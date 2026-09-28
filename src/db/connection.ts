import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
import { env } from "../config.js";
import { mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function createDb(dbPath?: string) {
  const path = dbPath ?? env.DB_PATH;
  ensureDir(path);

  const sqlite = new Database(path);

  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("synchronous = NORMAL");
  sqlite.pragma("foreign_keys = ON");

  const db = drizzle(sqlite, { schema });

  return { db, sqlite };
}

export type AppDb = ReturnType<typeof createDb>["db"];
