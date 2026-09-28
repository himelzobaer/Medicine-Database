import { exportToJson } from "./to-json.js";
import { exportToCsv } from "./to-csv.js";

console.log("📦 Running all exports...\n");

const jsonCount = exportToJson();
const csvCount = exportToCsv();

console.log(`\n🎉 All exports complete. ${jsonCount} medicines exported.`);
process.exit(0);
