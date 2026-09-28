import pLimit from "p-limit";
import { ALPHABET, MEDEX_URLS, env } from "../config.js";
import { fetchHtml, sleep } from "./http-client.js";
import { parseBrandCards, getTotalPages } from "./parsers.js";
import { validateBrandCard } from "../validators/medicine.js";
import { createDb } from "../db/connection.js";
import { upsertMedicineFromListing } from "../db/operations.js";

interface CrawlStats {
  totalCards: number;
  totalPages: number;
  newMedicines: number;
  updatedMedicines: number;
  errors: number;
  startTime: number;
}

/**
 * Alpha-Shard Concurrent Listing Crawler
 *
 * A-Z পর্যন্ত concurrent workers চালায়, প্রতিটা letter-এর সব pages crawl করে,
 * brand cards parse করে, DB তে upsert করে।
 */
export async function runListingCrawl(): Promise<CrawlStats> {
  const { db } = createDb();
  const limit = pLimit(env.SCRAPE_CONCURRENCY);
  const stats: CrawlStats = {
    totalCards: 0,
    totalPages: 0,
    newMedicines: 0,
    updatedMedicines: 0,
    errors: 0,
    startTime: Date.now(),
  };

  console.log("═══════════════════════════════════════════════════");
  console.log("  BD Medicine Database — Phase 1: Listing Crawl");
  console.log(`  Concurrency: ${env.SCRAPE_CONCURRENCY} workers`);
  console.log(`  Delay: ${env.SCRAPE_DELAY_MS}ms between requests`);
  console.log("═══════════════════════════════════════════════════\n");

  const tasks = ALPHABET.map((letter) =>
    limit(async () => {
      try {
        await crawlLetter(db, letter, stats);
      } catch (error) {
        console.error(`[${letter.toUpperCase()}] Fatal error: ${error}`);
        stats.errors++;
      }
    })
  );

  await Promise.all(tasks);

  const elapsed = ((Date.now() - stats.startTime) / 1000).toFixed(1);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  Crawl Complete!");
  console.log(`  Total Pages:   ${stats.totalPages}`);
  console.log(`  Total Cards:   ${stats.totalCards}`);
  console.log(`  New Medicines: ${stats.newMedicines}`);
  console.log(`  Updated:       ${stats.updatedMedicines}`);
  console.log(`  Errors:        ${stats.errors}`);
  console.log(`  Time:          ${elapsed}s`);
  console.log("═══════════════════════════════════════════════════");

  return stats;
}

/**
 * একটা letter (a-z) এর সব pages crawl করে।
 */
async function crawlLetter(
  db: ReturnType<typeof createDb>["db"],
  letter: string,
  stats: CrawlStats
): Promise<void> {
  const firstPageUrl = MEDEX_URLS.brands(letter, 1);
  const firstPageHtml = await fetchHtml(firstPageUrl);
  const totalPages = getTotalPages(firstPageHtml);

  console.log(
    `[${letter.toUpperCase()}] Found ${totalPages} page(s)`
  );

  // First page already fetched — process it
  await processPage(db, firstPageHtml, letter, 1, stats);

  // Remaining pages
  for (let page = 2; page <= totalPages; page++) {
    try {
      await sleep(env.SCRAPE_DELAY_MS);
      const url = MEDEX_URLS.brands(letter, page);
      const html = await fetchHtml(url);
      await processPage(db, html, letter, page, stats);
    } catch (error) {
      console.error(`[${letter.toUpperCase()}] Page ${page} error: ${error}`);
      stats.errors++;
    }
  }

  stats.totalPages += totalPages;
}

/**
 * একটা page-এর HTML process করে — parse + validate + upsert।
 */
async function processPage(
  db: ReturnType<typeof createDb>["db"],
  html: string,
  letter: string,
  page: number,
  stats: CrawlStats
): Promise<void> {
  const rawCards = parseBrandCards(html);

  for (const rawCard of rawCards) {
    const card = validateBrandCard(rawCard);
    if (!card) {
      stats.errors++;
      continue;
    }

    try {
      const { isNew } = await upsertMedicineFromListing(db, card);
      stats.totalCards++;

      if (isNew) {
        stats.newMedicines++;
      } else {
        stats.updatedMedicines++;
      }
    } catch (error) {
      console.error(
        `[${letter.toUpperCase()}:${page}] Upsert error for "${card.brandName}": ${error}`
      );
      stats.errors++;
    }
  }

  console.log(
    `[${letter.toUpperCase()}] Page ${page}: ${rawCards.length} medicines processed`
  );
}
