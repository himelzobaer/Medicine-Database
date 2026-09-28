import { runDetailCrawl } from "./medex-detail.js";

const diffOnly = process.argv.includes("--diff-only");

const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1]!, 10) : undefined;

const timeLimitArg = process.argv.find((arg) => arg.startsWith("--time-limit="));
const timeLimitMs = timeLimitArg ? parseInt(timeLimitArg.split("=")[1]!, 10) * 60000 : undefined;

console.log(`🔬 Starting Phase 2: Detail Crawl ${diffOnly ? "(diff-only)" : "(full)"}...`);
if (limit) console.log(`   - Item limit: ${limit}`);
if (timeLimitMs) console.log(`   - Time limit: ${timeLimitMs / 60000} minutes\n`);

const stats = await runDetailCrawl({ diffOnly, limit, timeLimitMs });

console.log("\n✅ Phase 2 complete.");
process.exit(0);
