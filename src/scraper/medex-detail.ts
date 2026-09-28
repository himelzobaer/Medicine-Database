import { isNull } from "drizzle-orm";
import { MEDEX_BASE_URL, env } from "../config.js";
import { fetchHtml, sleep } from "./http-client.js";
import { parseDetailPage } from "./parsers.js";
import { validateDetail } from "../validators/medicine.js";
import { createDb } from "../db/connection.js";
import { enrichMedicineDetail } from "../db/operations.js";
import { medicines } from "../db/schema.js";

interface DetailStats {
  total: number;
  enriched: number;
  errors: number;
  skipped: number;
  startTime: number;
}

/**
 * Phase 2: Detail Page Crawler
 *
 * unitPrice NULL আছে এমন medicines-এর detail pages visit করে
 * price, indication, composition, pack image extract করে enrich করে।
 */
export async function runDetailCrawl(
  options: { diffOnly?: boolean; limit?: number; timeLimitMs?: number } = {}
): Promise<DetailStats> {
  const { diffOnly = false, limit, timeLimitMs } = options;
  const { db } = createDb();

  const stats: DetailStats = {
    total: 0,
    enriched: 0,
    errors: 0,
    skipped: 0,
    startTime: Date.now(),
  };

  let query = db
    .select({
      medexId: medicines.medexId,
      medexUrl: medicines.medexUrl,
      brandName: medicines.brandName,
    })
    .from(medicines)
    .where(isNull(medicines.unitPrice));

  if (limit) {
    query = query.limit(limit) as any;
  }

  const unenriched = query.all().filter(
      (r): r is { medexId: string; medexUrl: string; brandName: string } =>
        r.medexId !== null && r.medexUrl !== null
    );

  stats.total = unenriched.length;

  console.log("═══════════════════════════════════════════════════");
  console.log("  BD Medicine Database — Phase 2: Detail Crawl");
  console.log(`  Medicines to enrich: ${stats.total}`);
  console.log(`  Delay: ${env.SCRAPE_DETAIL_DELAY_MS}ms between requests`);
  console.log("═══════════════════════════════════════════════════\n");

  if (stats.total === 0) {
    console.log("  ✅ All medicines already enriched. Nothing to do.");
    return stats;
  }

  let batchCount = 0;

  for (let i = 0; i < unenriched.length; i++) {
    const med = unenriched[i];
    if (!med) continue;

    try {
      const url = med.medexUrl.startsWith("http")
        ? med.medexUrl
        : `${MEDEX_BASE_URL}${med.medexUrl}`;

      const html = await fetchHtml(url);
      const rawDetail = parseDetailPage(html);
      const detail = validateDetail(rawDetail);

      if (!detail) {
        stats.skipped++;
        continue;
      }

      await enrichMedicineDetail(db, med.medexId, detail);
      stats.enriched++;

      if ((i + 1) % 50 === 0) {
        console.log(
          `  [Progress] ${i + 1}/${stats.total} — ` +
            `Enriched: ${stats.enriched}, Errors: ${stats.errors}`
        );
      }

      batchCount++;

      if (batchCount >= env.SCRAPE_BATCH_SIZE) {
        console.log(
          `  [Batch Pause] ${batchCount} requests done, cooling down 30s...`
        );
        await sleep(30000);
        batchCount = 0;
      } else {
        await sleep(env.SCRAPE_DETAIL_DELAY_MS);
      }

      if (timeLimitMs && Date.now() - stats.startTime >= timeLimitMs) {
        console.log(`\n  ⏳ Time limit reached (${timeLimitMs / 60000} min). Stopping gracefully...`);
        break;
      }
    } catch (error) {
      console.error(
        `  [Error] ${med.brandName} (${med.medexId}): ${error}`
      );
      stats.errors++;
    }
  }

  const elapsed = ((Date.now() - stats.startTime) / 1000 / 60).toFixed(1);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  Detail Crawl Complete!");
  console.log(`  Total:    ${stats.total}`);
  console.log(`  Enriched: ${stats.enriched}`);
  console.log(`  Errors:   ${stats.errors}`);
  console.log(`  Skipped:  ${stats.skipped}`);
  console.log(`  Time:     ${elapsed} min`);
  console.log("═══════════════════════════════════════════════════");

  return stats;
}
