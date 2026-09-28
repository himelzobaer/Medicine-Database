import { createDb } from "../db/connection.js";
import { medicines, companies, generics, dosageForms } from "../db/schema.js";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { env } from "../config.js";
import { eq } from "drizzle-orm";

export function exportToCsv(outputPath?: string): number {
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

  const headers = [
    "ID",
    "Brand Name",
    "Strength",
    "Generic Name",
    "Company",
    "Dosage Form",
    "Unit Price (BDT)",
    "Strip Price (BDT)",
    "Pack Size",
    "Indications",
    "Composition",
    "Medex URL",
  ];

  const csvLines = [headers.join(",")];

  for (const row of rows) {
    const line = [
      row.id,
      escapeCsv(row.brandName),
      escapeCsv(row.strength),
      escapeCsv(row.genericName),
      escapeCsv(row.companyName),
      escapeCsv(row.dosageForm),
      row.unitPrice ?? "",
      row.stripPrice ?? "",
      escapeCsv(row.packSize),
      escapeCsv(row.indicationText),
      escapeCsv(row.composition),
      escapeCsv(row.medexUrl),
    ].join(",");

    csvLines.push(line);
  }

  const outDir = `${env.DATA_DIR}/exports`;
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const filePath = outputPath ?? `${outDir}/medicines.csv`;
  writeFileSync(filePath, csvLines.join("\n"), "utf-8");

  console.log(`✅ Exported ${rows.length} medicines to ${filePath}`);
  return rows.length;
}

function escapeCsv(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
  exportToCsv();
}
