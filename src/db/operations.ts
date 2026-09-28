import { eq } from "drizzle-orm";
import type { AppDb } from "./connection.js";
import {
  medicines,
  companies,
  generics,
  dosageForms,
} from "./schema.js";
import type { ScrapedBrandCard, ScrapedDetail } from "../validators/medicine.js";

/**
 * Company name দিয়ে find or create করে, id রিটার্ন করে।
 */
export async function upsertCompany(
  db: AppDb,
  name: string
): Promise<number> {
  const existing = db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.name, name))
    .get();

  if (existing) return existing.id;

  const result = db
    .insert(companies)
    .values({ name })
    .onConflictDoNothing()
    .returning({ id: companies.id })
    .get();

  if (result) return result.id;

  const refetch = db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.name, name))
    .get();

  return refetch?.id ?? -1;
}

/**
 * Generic name দিয়ে find or create করে।
 */
export async function upsertGeneric(
  db: AppDb,
  name: string
): Promise<number> {
  const existing = db
    .select({ id: generics.id })
    .from(generics)
    .where(eq(generics.name, name))
    .get();

  if (existing) return existing.id;

  const result = db
    .insert(generics)
    .values({ name })
    .onConflictDoNothing()
    .returning({ id: generics.id })
    .get();

  if (result) return result.id;

  const refetch = db
    .select({ id: generics.id })
    .from(generics)
    .where(eq(generics.name, name))
    .get();

  return refetch?.id ?? -1;
}

/**
 * Dosage form name দিয়ে find or create করে।
 */
export async function upsertDosageForm(
  db: AppDb,
  name: string,
  iconUrl: string | null
): Promise<number> {
  const existing = db
    .select({ id: dosageForms.id })
    .from(dosageForms)
    .where(eq(dosageForms.name, name))
    .get();

  if (existing) return existing.id;

  const result = db
    .insert(dosageForms)
    .values({ name, iconUrl })
    .onConflictDoNothing()
    .returning({ id: dosageForms.id })
    .get();

  if (result) return result.id;

  const refetch = db
    .select({ id: dosageForms.id })
    .from(dosageForms)
    .where(eq(dosageForms.name, name))
    .get();

  return refetch?.id ?? -1;
}

/**
 * Phase 1 listing data থেকে medicine upsert করে।
 * medexId দিয়ে uniqueness check — already exists হলে update, নতুন হলে insert।
 */
export async function upsertMedicineFromListing(
  db: AppDb,
  card: ScrapedBrandCard
): Promise<{ id: number; isNew: boolean }> {
  const companyId = card.companyName
    ? await upsertCompany(db, card.companyName)
    : null;

  const genericId = card.genericName
    ? await upsertGeneric(db, card.genericName)
    : null;

  const dosageFormId =
    card.dosageForm
      ? await upsertDosageForm(db, card.dosageForm, card.dosageFormIconUrl)
      : null;

  const now = new Date().toISOString();

  if (card.medexId) {
    const existing = db
      .select({ id: medicines.id })
      .from(medicines)
      .where(eq(medicines.medexId, card.medexId))
      .get();

    if (existing) {
      db.update(medicines)
        .set({
          brandName: card.brandName,
          strength: card.strength,
          medexUrl: card.detailUrl,
          companyId,
          genericId,
          dosageFormId,
          updatedAt: now,
        })
        .where(eq(medicines.id, existing.id))
        .run();

      return { id: existing.id, isNew: false };
    }
  }

  const result = db
    .insert(medicines)
    .values({
      brandName: card.brandName,
      medexId: card.medexId,
      medexUrl: card.detailUrl,
      strength: card.strength,
      companyId,
      genericId,
      dosageFormId,
      scrapedAt: now,
      updatedAt: now,
    })
    .returning({ id: medicines.id })
    .get();

  return { id: result?.id ?? -1, isNew: true };
}

/**
 * Phase 2 detail data দিয়ে existing medicine enrich করে।
 */
export async function enrichMedicineDetail(
  db: AppDb,
  medexId: string,
  detail: ScrapedDetail
): Promise<void> {
  db.update(medicines)
    .set({
      unitPrice: detail.unitPrice,
      stripPrice: detail.stripPrice,
      packSize: detail.packSize,
      indicationText: detail.indicationText,
      composition: detail.composition,
      packImageUrl: detail.packImageUrl,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(medicines.medexId, medexId))
    .run();
}

/**
 * Detail enrichment না হওয়া medicines এর URLs পায়।
 */
export function getUnenrichedMedicines(
  db: AppDb
): Array<{ medexId: string; medexUrl: string }> {
  const results = db
    .select({
      medexId: medicines.medexId,
      medexUrl: medicines.medexUrl,
    })
    .from(medicines)
    .where(eq(medicines.unitPrice, 0))
    .all();

  return results.filter(
    (r): r is { medexId: string; medexUrl: string } =>
      r.medexId !== null && r.medexUrl !== null
  );
}
