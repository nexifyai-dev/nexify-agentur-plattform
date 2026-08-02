import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Mirror of siteOrigin() www-normalization (keeps unit test free of Next path aliases). */
function siteOrigin(raw) {
  try {
    const u = new URL(raw.trim() || "https://www.nexifyai.cloud");
    if (u.hostname === "nexifyai.cloud") u.hostname = "www.nexifyai.cloud";
    return u.origin.replace(/\/$/, "");
  } catch {
    return "https://www.nexifyai.cloud";
  }
}

test("seo helper forces www for apex env URLs", () => {
  assert.equal(siteOrigin("https://nexifyai.cloud"), "https://www.nexifyai.cloud");
  assert.equal(siteOrigin("https://www.nexifyai.cloud"), "https://www.nexifyai.cloud");
});

test("seo.ts exports pageMetadata and www canonical origin", () => {
  const src = read("lib/seo.ts");
  assert.match(src, /export function pageMetadata/);
  assert.match(src, /export function siteOrigin/);
  assert.match(src, /export function breadcrumbListJsonLd/);
  assert.match(src, /export function articleJsonLd/);
  assert.match(src, /export function localBusinessPlaceJsonLd/);
  assert.match(src, /export function servicesOfferCatalogJsonLd/);
  assert.match(src, /export function serializeJsonLd/);
  assert.match(src, /BreadcrumbList/);
  assert.match(src, /"@type": "Article"/);
  assert.match(src, /"@type": "OfferCatalog"/);
  assert.match(src, /\["LocalBusiness", "ProfessionalService"\]/);
  assert.match(src, /CANONICAL_ORIGIN = "https:\/\/www\.nexifyai\.cloud"/);
  assert.match(src, /alternates:\s*\{\s*canonical:/);
  assert.match(src, /openGraph:[\s\S]*url/);
});

test("faq page has FAQPage and BreadcrumbList JSON-LD", () => {
  const page = read("app/faq/page.tsx");
  assert.match(page, /FAQPage/);
  assert.match(page, /breadcrumbListJsonLd/);
  assert.match(page, /path:\s*"\/faq"/);
  assert.match(page, /flattenFaqItems/);
  assert.match(page, /faqCategories/);
});

test("faq categories are expansive with H2 sections in UI", () => {
  const cats = read("lib/content/faq-categories.ts");
  assert.match(cats, /export const faqCategoriesDe/);
  assert.match(cats, /flattenFaqItems/);
  const deBlock = cats.split("export const faqCategoriesDe")[1].split("export const faqCategoriesNl")[0];
  const qCount = (deBlock.match(/\bq:/g) || []).length;
  assert.ok(qCount >= 40, `expected >=40 DE FAQ items, got ${qCount}`);
  assert.ok((deBlock.match(/id: "/g) || []).length >= 8, "expected >=8 categories");

  const ui = read("components/pages/faq.tsx");
  assert.match(ui, /faqCategories\.map/);
  assert.match(ui, /<h2[\s\S]*cat\.title/);
  assert.match(ui, /<h3[\s\S]*f\.q/);
  assert.match(ui, /data-testid="faq-page"/);
  assert.match(ui, /data-testid=\{`faq-section-\$\{cat\.id\}`\}/);
  assert.match(ui, /href="\/leistungen"/);
  assert.match(ui, /href="\/preise"/);
  assert.match(ui, /href="\/kontakt"/);
  assert.match(ui, /href="\/wissen"/);
  assert.match(ui, /preise#planner/);
  assert.doesNotMatch(cats, /999/);
});

test("leistungen and preise pages expose BreadcrumbList JSON-LD", () => {
  for (const rel of ["app/leistungen/page.tsx", "app/preise/page.tsx"]) {
    const page = read(rel);
    assert.match(page, /breadcrumbListJsonLd/);
    assert.match(page, /JsonLd/);
  }
});

test("leistungen page exposes OfferCatalog Service/Offer JSON-LD", () => {
  const page = read("app/leistungen/page.tsx");
  assert.match(page, /servicesOfferCatalogJsonLd/);
  assert.match(page, /services\.map/);
  assert.match(page, /shortTitle/);
  assert.match(page, /minDays/);
  assert.match(page, /JsonLd data=\{servicesJsonLd\}/);

  const src = read("lib/seo.ts");
  assert.match(src, /"@type": "OfferCatalog"/);
  assert.match(src, /"@type": "Service"/);
  assert.match(src, /"@type": "Offer"/);
  assert.match(src, /company\.dayRate/);
  assert.match(src, /PriceSpecification/);
});

test("marketing pages expose BreadcrumbList JSON-LD", () => {
  const pages = [
    ["app/prozess/page.tsx", "/prozess", "Prozess"],
    ["app/plattform/page.tsx", "/plattform", "Plattform"],
    ["app/referenzen/page.tsx", "/referenzen", "Referenzen"],
    ["app/wissen/page.tsx", "/wissen", "Wissen"],
    ["app/kontakt/page.tsx", "/kontakt", "Kontakt"],
    ["app/ueber-mich/page.tsx", "/ueber-mich", "Über mich"],
    ["app/rueckruf/page.tsx", "/rueckruf", "Rückruf"],
  ];
  for (const [rel, path, label] of pages) {
    const page = read(rel);
    assert.match(page, /breadcrumbListJsonLd/);
    assert.match(page, /JsonLd/);
    assert.match(page, new RegExp(`path:\\s*"${escapeRegex(path)}"`));
    assert.match(page, new RegExp(`name:\\s*"${escapeRegex(label)}"`));
  }
});

test("JsonLd component serializes application/ld+json safely", () => {
  const src = read("components/json-ld.tsx");
  assert.match(src, /application\/ld\+json/);
  assert.match(src, /replace\(\/<\/g,\s*"\\\\u003c"\)/);
});

test("root layout has no global root-only canonical and uses 449 EUR", () => {
  const layout = read("app/layout.tsx");
  assert.doesNotMatch(layout, /alternates:\s*\{\s*canonical:\s*"\/"/);
  assert.match(layout, /449 Euro netto/);
  assert.match(layout, /€ 449 \/ Arbeitstag netto/);
  assert.match(layout, /price:\s*String\(company\.dayRate\)/);
  assert.match(layout, /replace\(\/<\/g,\s*"\\\\u003c"\)/);
});

test("leistungen page self-canonical and 449 in description", () => {
  const page = read("app/leistungen/page.tsx");
  assert.match(page, /pageMetadata/);
  assert.match(page, /path:\s*"\/leistungen"/);
  assert.match(page, /449/);
  assert.doesNotMatch(page, /999/);
});

test("llm.txt is present for AI crawlers", () => {
  const llm = read("public/llm.txt");
  assert.match(llm, /449/);
  assert.match(llm, /www\.nexifyai\.cloud/);
});

test("wissen articles are crawlable SSR routes with Article JSON-LD", () => {
  const articles = read("lib/content/wissen-articles.ts");
  assert.match(articles, /ai-automatisierung-kmu/);
  assert.match(articles, /was-kostet-web-app-2026/);
  assert.match(articles, /449/);
  assert.doesNotMatch(articles, /999/);

  const page = read("app/wissen/[slug]/page.tsx");
  assert.match(page, /generateStaticParams/);
  assert.match(page, /pageMetadata/);
  assert.match(page, /breadcrumbListJsonLd/);
  assert.match(page, /articleJsonLd/);
  assert.match(page, /href="\/preise"/);
  assert.match(page, /href="\/leistungen"/);
  assert.match(page, /href="\/kontakt"/);

  const index = read("components/pages/knowledge.tsx");
  assert.match(index, /WISSEN_ARTICLES/);
  assert.match(index, /href=\{`\/wissen\/\$\{a\.slug\}`\}/);

  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /wissenArticleSlugs/);
  assert.match(sitemap, /\/wissen\/\$\{slug\}/);
});

test("venlo local SEO page has SSR metadata, BreadcrumbList and LocalBusiness/Place", () => {
  const page = read("app/venlo/page.tsx");
  assert.match(page, /pageMetadata/);
  assert.match(page, /path:\s*"\/venlo"/);
  assert.match(page, /breadcrumbListJsonLd/);
  assert.match(page, /localBusinessPlaceJsonLd/);
  assert.match(page, /449|company\.dayRate/);
  assert.match(page, /Graaf van Loonstraat|company\.address/);
  assert.match(page, /href="\/leistungen"/);
  assert.match(page, /href="\/preise"/);
  assert.match(page, /href="\/kontakt"/);
  assert.match(page, /data-testid="venlo-page"/);
  assert.doesNotMatch(page, /999/);

  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /"\/venlo"/);

  const footer = read("components/site-footer.tsx");
  assert.match(footer, /href:\s*"\/venlo"/);
});
