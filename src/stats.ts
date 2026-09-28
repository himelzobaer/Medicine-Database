import { createDb } from "./db/connection.js";
import { medicines, companies, generics, dosageForms } from "./db/schema.js";
import { count } from "drizzle-orm";

const { db } = createDb();

const m = db.select({ count: count() }).from(medicines).get();
const c = db.select({ count: count() }).from(companies).get();
const g = db.select({ count: count() }).from(generics).get();
const d = db.select({ count: count() }).from(dosageForms).get();

console.log("╔═══════════════════════════════════════╗");
console.log("║   BD Medicine Database — Stats        ║");
console.log("╠═══════════════════════════════════════╣");
console.log(`║  💊 Medicines:    ${String(m?.count).padStart(6)}            ║`);
console.log(`║  🏢 Companies:    ${String(c?.count).padStart(6)}            ║`);
console.log(`║  🧬 Generics:     ${String(g?.count).padStart(6)}            ║`);
console.log(`║  💉 Dosage Forms: ${String(d?.count).padStart(6)}            ║`);
console.log("╚═══════════════════════════════════════╝");
