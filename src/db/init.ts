import { createDb } from "./connection.js";
import { sql } from "drizzle-orm";

/**
 * Database tables তৈরি করে (migration ছাড়াই direct DDL)।
 */
export function initializeDatabase(): void {
  const { db } = createDb();

  db.run(sql`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      medex_id TEXT,
      slug TEXT
    )
  `);

  db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS companies_name_idx ON companies(name)`);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS generics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      medex_id TEXT,
      slug TEXT
    )
  `);

  db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS generics_name_idx ON generics(name)`);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS dosage_forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon_url TEXT
    )
  `);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS drug_classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS indications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    )
  `);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name TEXT NOT NULL,
      medex_id TEXT,
      medex_url TEXT,
      slug TEXT,
      strength TEXT,
      unit_price REAL,
      strip_price REAL,
      pack_size TEXT,
      composition TEXT,
      indication_text TEXT,
      pack_image_url TEXT,
      generic_id INTEGER REFERENCES generics(id),
      company_id INTEGER REFERENCES companies(id),
      dosage_form_id INTEGER REFERENCES dosage_forms(id),
      scraped_at TEXT,
      updated_at TEXT
    )
  `);

  db.run(sql`CREATE INDEX IF NOT EXISTS medicines_brand_name_idx ON medicines(brand_name)`);
  db.run(sql`CREATE INDEX IF NOT EXISTS medicines_generic_id_idx ON medicines(generic_id)`);
  db.run(sql`CREATE INDEX IF NOT EXISTS medicines_company_id_idx ON medicines(company_id)`);
  db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS medicines_medex_id_idx ON medicines(medex_id)`);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS medicine_indications (
      medicine_id INTEGER NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
      indication_id INTEGER NOT NULL REFERENCES indications(id) ON DELETE CASCADE
    )
  `);

  db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS med_ind_unique_idx ON medicine_indications(medicine_id, indication_id)`);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS generic_drug_classes (
      generic_id INTEGER NOT NULL REFERENCES generics(id) ON DELETE CASCADE,
      drug_class_id INTEGER NOT NULL REFERENCES drug_classes(id) ON DELETE CASCADE
    )
  `);

  db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS gen_dc_unique_idx ON generic_drug_classes(generic_id, drug_class_id)`);

  console.log("✅ Database initialized successfully.");
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
  initializeDatabase();
}
