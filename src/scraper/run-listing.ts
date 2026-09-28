import { runListingCrawl } from "./medex-listing.js";

console.log("🚀 Starting Phase 1: Listing Crawl...\n");
const stats = await runListingCrawl();

if (stats.errors > stats.totalCards * 0.1) {
  console.error("⚠️ High error rate detected. Check logs.");
  process.exit(1);
}

console.log("\n✅ Phase 1 complete.");
process.exit(0);
