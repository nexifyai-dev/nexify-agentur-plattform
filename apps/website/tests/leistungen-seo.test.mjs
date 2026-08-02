import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");

test("leistungen-seo catalog has 15 sellable services", () => {
  const src = read("lib/gtm/leistungen-seo.ts");
  const slugs = [...src.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
  assert.equal(slugs.length, 15);
  for (const required of [
    "landingpages",
    "websites",
    "automatisierung",
    "ai-agenten",
    "ki-begleiter",
    "kundenportal",
    "ki-plattform",
    "beratung",
    "workshops",
    "white-label",
    "audit",
  ]) {
    assert.ok(slugs.includes(required), required);
  }
});

test("leistung detail route exists with FAQ + answer-first", () => {
  const page = read("app/leistungen/[slug]/page.tsx");
  assert.match(page, /FAQPage/);
  assert.match(page, /leistung-answer-first/);
  assert.match(page, /generateStaticParams/);
  assert.match(page, /leistung-cta-termin/);
  assert.doesNotMatch(page, /"@type":\s*"AggregateRating"/);
});

test("sitemap includes leistungen slugs and branchen", () => {
  const sm = read("app/sitemap.ts");
  assert.match(sm, /leistungSeoSlugs/);
  assert.match(sm, /branchenSlugs/);
  assert.match(sm, /\/audit/);
});

test("llms.txt lists service landings", () => {
  assert.ok(existsSync(join(root, "public/llms.txt")));
  const llms = read("public/llms.txt");
  assert.match(llms, /\/leistungen\/websites/);
  assert.match(llms, /\/leistungen\/ai-agenten/);
  assert.match(llms, /449/);
  assert.match(llms, /No AggregateRating/);
});

test("OfferCatalog JSON-LD points to slug URLs not hashes", () => {
  const seo = read("lib/seo.ts");
  assert.match(seo, /absoluteUrl\(`\$\{path\}\/\$\{s\.slug\}`\)/);
  assert.doesNotMatch(seo, /absoluteUrl\(`\$\{path\}#\$\{s\.slug\}`\)/);
});
