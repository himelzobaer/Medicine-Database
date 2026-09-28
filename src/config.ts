import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_KEY: z.string().min(1).optional().or(z.literal("")),
  SCRAPE_CONCURRENCY: z.coerce.number().int().min(1).max(26).default(5),
  SCRAPE_DELAY_MS: z.coerce.number().int().min(500).default(2000),
  SCRAPE_DETAIL_DELAY_MS: z.coerce.number().int().min(1000).default(3000),
  SCRAPE_BATCH_SIZE: z.coerce.number().int().min(10).default(50),
  DATA_DIR: z.string().default("data"),
  DB_PATH: z.string().default("data/medicine.db"),
});

export const env = envSchema.parse(process.env);

export const MEDEX_BASE_URL = "https://medex.com.bd";

export const MEDEX_URLS = {
  brands: (alpha: string, page: number) =>
    `${MEDEX_BASE_URL}/brands?alpha=${alpha}&page=${page}`,
  brandDetail: (path: string) => `${MEDEX_BASE_URL}${path}`,
  generics: (alpha: string, page: number) =>
    `${MEDEX_BASE_URL}/generics?alpha=${alpha}&page=${page}`,
  companies: `${MEDEX_BASE_URL}/companies`,
  drugClasses: `${MEDEX_BASE_URL}/drug-classes`,
  dosageForms: `${MEDEX_BASE_URL}/dosage-forms`,
  indications: `${MEDEX_BASE_URL}/indications`,
} as const;

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
] as const;

export function getRandomUserAgent(): string {
  const index = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[index] ?? USER_AGENTS[0];
}
