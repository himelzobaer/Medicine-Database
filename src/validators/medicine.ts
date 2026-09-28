import { z } from "zod";

export const scrapedBrandCardSchema = z.object({
  brandName: z.string().min(1),
  strength: z.string().nullable(),
  genericName: z.string().nullable(),
  companyName: z.string().nullable(),
  dosageForm: z.string().nullable(),
  dosageFormIconUrl: z.string().nullable(),
  detailUrl: z.string().min(1),
  medexId: z.string().nullable(),
});

export type ScrapedBrandCard = z.infer<typeof scrapedBrandCardSchema>;

export const scrapedDetailSchema = z.object({
  unitPrice: z.number().nullable(),
  stripPrice: z.number().nullable(),
  packSize: z.string().nullable(),
  indicationText: z.string().nullable(),
  composition: z.string().nullable(),
  packImageUrl: z.string().nullable(),
});

export type ScrapedDetail = z.infer<typeof scrapedDetailSchema>;

export const fullMedicineSchema = scrapedBrandCardSchema.merge(scrapedDetailSchema);

export type FullMedicine = z.infer<typeof fullMedicineSchema>;

export function validateBrandCard(data: unknown): ScrapedBrandCard | null {
  const result = scrapedBrandCardSchema.safeParse(data);
  if (!result.success) {
    console.error(`[Validation Error] Brand card: ${result.error.message}`);
    return null;
  }
  return result.data;
}

export function validateDetail(data: unknown): ScrapedDetail | null {
  const result = scrapedDetailSchema.safeParse(data);
  if (!result.success) {
    console.error(`[Validation Error] Detail: ${result.error.message}`);
    return null;
  }
  return result.data;
}
