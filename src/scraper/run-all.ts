import { runListingCrawl } from "./medex-listing.js";
import { runDetailCrawl } from "./medex-detail.js";

console.log("🚀 Starting Full Scrape Pipeline...\n");

console.log("━━━ Phase 1: Listing Crawl ━━━\n");
await runListingCrawl();

console.log("\n━━━ Phase 2: Detail Crawl ━━━\n");
await runDetailCrawl();

console.log("\n🎉 Full scrape pipeline complete!");
process.exit(0);
