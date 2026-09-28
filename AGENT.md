# System Agent Instructions for "BD Data Marketplace"

You are an AI coding assistant working on the "BD Data Marketplace" (or BD Data Hub) project. This project aims to scrape, process, and sell high-demand, localized datasets for the Bangladesh market via JSON/CSV downloads and REST APIs.

When working on this project, you must adhere strictly to the following rules, context, and architectural decisions.

## 1. Project Context & Mindset
- **Goal:** Solve the "Cold Start" problem for Bangladeshi developers and startups by providing ready-made databases (e.g., Courier Mapping, POS Barcodes, Medicine Data).
- **Business Model:** DaaS (Data as a Service). We offer freemium samples, one-time JSON purchases, and monthly API subscriptions.
- **Mindset:** Think like a B2B SaaS founder. Prioritize automation, cost-efficiency (100% free cloud execution where possible), and developer experience (DX).

## 2. Scraping & Automation Rules
- **Anti-Ban is Priority #1:** Always include delays (e.g., 2-3 seconds between requests), implement exponential backoff, and rotate User-Agents. DO NOT blast target servers.
- **Cloud Execution:** Scraping jobs that take hours must be designed to run incrementally on GitHub Actions. Rely on `--time-limit` or `--limit` chunking.
- **Source of Truth:** Initially, save scraped data to local `SQLite` (via Drizzle ORM). This SQLite file is committed back to GitHub as the ultimate free backup and state tracker.
- **Supabase Sync:** Only sync to Supabase (PostgreSQL) in bulk AFTER the local scraping is verified, or incrementally at the end of a GitHub Action run. Avoid direct Supabase writes during heavy scraping loops to prevent connection drops/rate limits.

## 3. Tech Stack & Coding Standards
- **Language:** Strict TypeScript (ESM). No `any` types.
- **Scraping:** Cheerio for static HTML, Playwright only if JavaScript rendering is strictly required. 
- **Database:** `drizzle-orm` + `better-sqlite3` for local. `@supabase/supabase-js` for cloud sync.
- **Web App (Future):** Next.js 14+ (App Router), TailwindCSS, Shadcn UI.
- **Validation:** Always parse and validate scraped data using `zod` before inserting it into the database.

## 4. pSEO & Marketing Awareness
- When building the Web App, always structure URLs, metadata, and page rendering (SSR/SSG) keeping **Programmatic SEO (pSEO)** and **GEO (Generative Engine Optimization)** in mind.
- Write code that allows dynamic generation of thousands of landing pages based on the datasets.

## 5. Interaction Guidelines
- Be concise, professional, and proactive.
- Never explain what you are about to do—just do it.
- If a file already exists, modify it (do not recreate from scratch).
- Always ensure code is production-ready and error-free.
