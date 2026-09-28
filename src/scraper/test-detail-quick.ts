import { createDb } from "../db/connection.js";
import { medicines } from "../db/schema.js";
import { isNull } from "drizzle-orm";
import { fetchHtml } from "./http-client.js";
import { parseDetailPage } from "./parsers.js";
import { validateDetail } from "../validators/medicine.js";
import { enrichMedicineDetail } from "../db/operations.js";
import { MEDEX_BASE_URL } from "../config.js";

async function quickTestDetail() {
  console.log("🧪 Quick test — Detail scraping (5 medicines)...\n");

  const { db } = createDb();

  const unenriched = db
    .select({
      medexId: medicines.medexId,
      medexUrl: medicines.medexUrl,
      brandName: medicines.brandName,
    })
    .from(medicines)
    .where(isNull(medicines.unitPrice))
    .limit(5)
    .all();

  if (unenriched.length === 0) {
    console.log("No unenriched medicines found.");
    return;
  }

  for (const med of unenriched) {
    if (!med.medexId || !med.medexUrl) continue;
    console.log(`Fetching detail for: ${med.brandName}`);
    
    const url = med.medexUrl.startsWith("http")
      ? med.medexUrl
      : `${MEDEX_BASE_URL}${med.medexUrl}`;
      
    const html = await fetchHtml(url);
    const rawDetail = parseDetailPage(html);
    const detail = validateDetail(rawDetail);
    
    if (detail) {
      console.log(`  ├─ Unit Price:  ${detail.unitPrice}`);
      console.log(`  ├─ Strip Price: ${detail.stripPrice}`);
      console.log(`  ├─ Pack Size:   ${detail.packSize}`);
      console.log(`  ├─ Indications: ${detail.indicationText ? detail.indicationText.substring(0, 50) + "..." : null}`);
      console.log(`  ├─ Composition: ${detail.composition ? detail.composition.substring(0, 50) + "..." : null}`);
      console.log(`  └─ Image URL:   ${detail.packImageUrl}\n`);
      
      await enrichMedicineDetail(db, med.medexId, detail);
    } else {
      console.log(`  ⚠️ Validation failed for ${med.brandName}\n`);
    }
  }

  console.log("✅ Quick test detail passed!");
}

quickTestDetail().catch(console.error);
