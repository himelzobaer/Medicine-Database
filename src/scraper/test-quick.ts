/**
 * Quick test — শুধু একটা letter ("z") দিয়ে listing scraper টেস্ট করে।
 */
import { MEDEX_URLS } from "../config.js";
import { fetchHtml } from "./http-client.js";
import { parseBrandCards, getTotalPages } from "./parsers.js";
import { createDb } from "../db/connection.js";
import { upsertMedicineFromListing } from "../db/operations.js";
import { validateBrandCard } from "../validators/medicine.js";

async function quickTest() {
  console.log("🧪 Quick test — scraping letter Z...\n");

  const url = MEDEX_URLS.brands("z", 1);
  console.log(`Fetching: ${url}`);

  const html = await fetchHtml(url);
  const totalPages = getTotalPages(html);
  console.log(`Total pages for Z: ${totalPages}`);

  const cards = parseBrandCards(html);
  console.log(`Found ${cards.length} brand cards on page 1\n`);

  if (cards.length === 0) {
    console.log("⚠️ No cards found! Parser might need fixing.");
    console.log("HTML snippet (first 2000 chars):");
    console.log(html.substring(0, 2000));
    return;
  }

  // Show first 3 cards
  console.log("Sample cards:");
  for (const card of cards.slice(0, 3)) {
    console.log(`  ├─ ${card.brandName}`);
    console.log(`  │  Generic: ${card.genericName}`);
    console.log(`  │  Strength: ${card.strength}`);
    console.log(`  │  Company: ${card.companyName}`);
    console.log(`  │  Form: ${card.dosageForm}`);
    console.log(`  │  URL: ${card.detailUrl}`);
    console.log(`  │  MedexID: ${card.medexId}`);
    console.log("  │");
  }

  // Test DB upsert
  const { db } = createDb();
  let newCount = 0;
  let updateCount = 0;

  for (const rawCard of cards) {
    const card = validateBrandCard(rawCard);
    if (!card) continue;

    const { isNew } = await upsertMedicineFromListing(db, card);
    if (isNew) newCount++;
    else updateCount++;
  }

  console.log(`\n✅ DB Results: ${newCount} new, ${updateCount} updated`);
  console.log("🧪 Quick test passed!");
}

quickTest().catch(console.error);
