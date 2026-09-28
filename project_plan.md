# 🏥 Bangladesh Medicine Database SaaS - Project Plan

## ✅ What We Have Done So Far (Completed)

### Phase 0: Project Initialization & Architecture
- [x] Initialized Node.js (TypeScript, ESM) project.
- [x] Configured `pnpm`, `zod`, `cheerio`, `playwright`, `drizzle-orm`, `better-sqlite3`.
- [x] Designed robust local SQLite Database Schema (WAL mode for concurrency).
- [x] Configured HTTP Client with retries, fake user-agents, and exponential backoff to prevent IP bans.

### Phase 1: Listing Scraper (Alpha-Shard Crawling)
- [x] Built the `medex-listing.ts` scraper that crawls A-Z letters concurrently (26 shards).
- [x] Extracted Basic Medicine Info: Brand Name, Generic, Company, Strength, Dosage Form.
- [x] **Successfully scraped ~25,416 medicines** across 857 pages with ZERO errors.
- [x] Safely saved data into `data/medicine.db`.

### Phase 2: Detail Scraper (Enrichment)
- [x] Built `medex-detail.ts` to visit each medicine's URL and fetch missing details.
- [x] Extracting: Unit Price, Strip Price, Pack Size, Indications, Composition, and Image URL.
- [x] Implemented Chunking: Added `--time-limit` and `--limit` to safely run the scraper incrementally.
- [x] Tested successfully on a small batch of 5 medicines.

### Phase 3: Exporters
- [x] Created `export/to-json.ts` and `export/to-csv.ts` to generate API-ready files.
- [x] Verified full export of 25k medicines.

### Phase 4: Automation (The Brilliant 100% Free Cloud Approach)
- [x] Wrote GitHub Actions Workflow (`incremental-scrape.yml`).
- [x] Set cron schedule to run **every hour** for 55 minutes (`0 * * * *`).
- [x] Commits the `.db`, `.json`, and `.csv` back to the GitHub repository automatically.
- [x] Initialized Git and made the first commit locally.

---

## ⏳ What is Happening NOW (In Progress)
- [ ] User will push the code to a **Public GitHub Repository**.
- [ ] GitHub Actions will run hourly for 1-2 days to fetch all 25,416 detail pages.

---

## 🚀 What We Will Do NEXT (Pending / Future Steps)

### Phase 5: Supabase Migration (SaaS Database)
- [ ] Wait for the GitHub Action to finish 100% detail scraping.
- [ ] Create `sync-to-supabase.ts` script to push the SQLite data to Supabase (PostgreSQL) in bulk.
- [ ] Update the GitHub Action to push diffs/updates to Supabase automatically after each scrape.

### Phase 6: SaaS Web App (Next.js)
- [ ] Initialize Next.js 14 (App Router) + Tailwind CSS + Shadcn UI.
- [ ] Connect Next.js to Supabase via `@supabase/supabase-js`.
- [ ] Build UI:
  - Homepage with intelligent Medicine Search.
  - Medicine Details page (SEO optimized).
  - Generics and Alternatives mapping.
- [ ] Monetization Setup (Ads / API Access for Developers).
