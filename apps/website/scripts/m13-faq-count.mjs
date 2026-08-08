// M-13 QA: zählt FAQs pro Leistungs-Slug (Quelle: leistungen-seo.ts)
import { readFileSync } from "node:fs";

const src = readFileSync("lib/gtm/leistungen-seo.ts", "utf8");
// Jeder Service-Block beginnt mit slug: "..." — Anzahl q: innerhalb des Blocks zählen
const re = /slug: "([^"]+)"[\s\S]*?faqs: \[([\s\S]*?)\n\s*\],\n\s*branchen:/g;
let m;
let bad = 0;
let total = 0;
while ((m = re.exec(src)) !== null) {
  total++;
  const slug = m[1];
  const qs = (m[2].match(/q: "/g) || []).length;
  if (qs < 6) {
    bad++;
    console.log(`ZU WENIG (${qs}): ${slug}`);
  } else {
    console.log(`ok (${qs}): ${slug}`);
  }
}
console.log(`\nGesamt: ${total} Services, davon <6 FAQs: ${bad}`);
process.exit(bad ? 1 : 0);
