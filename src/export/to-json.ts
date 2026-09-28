import { createDb } from "../db/connection.js";
import { medicines, companies, generics, dosageForms } from "../db/schema.js";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { env } from "../config.js";
import { eq } from "drizzle-orm";

interface ExportMedicine {
  id: number;
  brandName: string;
  strength: string | null;
  genericName: string | null;
  companyName: string | null;
  dosageForm: string | null;
  unitPrice: number | null;
  stripPrice: number | null;
  packSize: string | null;
  indicationText: string | null;
  composition: string | null;
  medexUrl: string | null;
}

export function exportToJson(outputPath?: string): number {
  const { db } = createDb();

  const rows = db
    .select({
      id: medicines.id,
      brandName: medicines.brandName,
      strength: medicines.strength,
      genericName: generics.name,
      companyName: companies.name,
      dosageForm: dosageForms.name,
      unitPrice: medicines.unitPrice,
      stripPrice: medicines.stripPrice,
      packSize: medicines.packSize,
      indicationText: medicines.indicationText,
      composition: medicines.composition,
      medexUrl: medicines.medexUrl,
    })
    .from(medicines)
    .leftJoin(generics, eq(medicines.genericId, generics.id))
    .leftJoin(companies, eq(medicines.companyId, companies.id))
    .leftJoin(dosageForms, eq(medicines.dosageFormId, dosageForms.id))
    .orderBy(medicines.brandName)
    .all();

  const outDir = `${env.DATA_DIR}/exports`;
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const filePath = outputPath ?? `${outDir}/medicines.json`;
  writeFileSync(filePath, JSON.stringify(rows, null, 2), "utf-8");

  console.log(`✅ Exported ${rows.length} medicines to ${filePath}`);
  return rows.length;
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
  exportToJson();
}
