import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ─── Companies ──────────────────────────────────────────────
export const companies = sqliteTable(
  "companies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    medexId: text("medex_id"),
    slug: text("slug"),
  },
  (table) => [
    uniqueIndex("companies_name_idx").on(table.name),
  ]
);

// ─── Generics ───────────────────────────────────────────────
export const generics = sqliteTable(
  "generics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    medexId: text("medex_id"),
    slug: text("slug"),
  },
  (table) => [
    uniqueIndex("generics_name_idx").on(table.name),
  ]
);

// ─── Dosage Forms ───────────────────────────────────────────
export const dosageForms = sqliteTable(
  "dosage_forms",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    iconUrl: text("icon_url"),
  }
);

// ─── Drug Classes ───────────────────────────────────────────
export const drugClasses = sqliteTable(
  "drug_classes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
  }
);

// ─── Indications ────────────────────────────────────────────
export const indications = sqliteTable(
  "indications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    description: text("description"),
  }
);

// ─── Medicines (Core Table) ─────────────────────────────────
export const medicines = sqliteTable(
  "medicines",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    brandName: text("brand_name").notNull(),
    medexId: text("medex_id"),
    medexUrl: text("medex_url"),
    slug: text("slug"),
    strength: text("strength"),
    unitPrice: real("unit_price"),
    stripPrice: real("strip_price"),
    packSize: text("pack_size"),
    composition: text("composition"),
    indicationText: text("indication_text"),
    packImageUrl: text("pack_image_url"),
    genericId: integer("generic_id").references(() => generics.id),
    companyId: integer("company_id").references(() => companies.id),
    dosageFormId: integer("dosage_form_id").references(() => dosageForms.id),
    scrapedAt: text("scraped_at"),
    updatedAt: text("updated_at"),
  },
  (table) => [
    index("medicines_brand_name_idx").on(table.brandName),
    index("medicines_generic_id_idx").on(table.genericId),
    index("medicines_company_id_idx").on(table.companyId),
    uniqueIndex("medicines_medex_id_idx").on(table.medexId),
  ]
);

// ─── Medicine ↔ Indication (Many-to-Many) ───────────────────
export const medicineIndications = sqliteTable(
  "medicine_indications",
  {
    medicineId: integer("medicine_id")
      .notNull()
      .references(() => medicines.id, { onDelete: "cascade" }),
    indicationId: integer("indication_id")
      .notNull()
      .references(() => indications.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("med_ind_unique_idx").on(table.medicineId, table.indicationId),
  ]
);

// ─── Generic ↔ Drug Class (Many-to-Many) ────────────────────
export const genericDrugClasses = sqliteTable(
  "generic_drug_classes",
  {
    genericId: integer("generic_id")
      .notNull()
      .references(() => generics.id, { onDelete: "cascade" }),
    drugClassId: integer("drug_class_id")
      .notNull()
      .references(() => drugClasses.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("gen_dc_unique_idx").on(table.genericId, table.drugClassId),
  ]
);

// ─── Type Exports ───────────────────────────────────────────
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Generic = typeof generics.$inferSelect;
export type NewGeneric = typeof generics.$inferInsert;
export type DosageForm = typeof dosageForms.$inferSelect;
export type Medicine = typeof medicines.$inferSelect;
export type NewMedicine = typeof medicines.$inferInsert;
export type Indication = typeof indications.$inferSelect;
export type DrugClass = typeof drugClasses.$inferSelect;
