import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dePath = join(root, "lib/legal/de.ts");
const legalPagePath = join(root, "components/legal-page.tsx");

const SLUGS = [
  "impressum",
  "datenschutz",
  "agb",
  "avv",
  "widerruf",
  "cookie-richtlinie",
  "ki-hinweise",
];

test("legal de.ts exports all required slugs", () => {
  const src = readFileSync(dePath, "utf8");
  for (const slug of SLUGS) {
    assert.match(src, new RegExp(`slug: "${slug}"`));
  }
});

test("legal pages include disclaimer hook and TOC support in component", () => {
  const src = readFileSync(legalPagePath, "utf8");
  assert.match(src, /legal-disclaimer/);
  assert.match(src, /legal-toc/);
  assert.match(src, /Kein Rechtsrat/);
  assert.match(src, /Fachanwalt/);
});

test("cookie policy aligns with consent categories", () => {
  const src = readFileSync(dePath, "utf8");
  assert.match(src, /Notwendig/);
  assert.match(src, /Statistik/);
  assert.match(src, /Marketing/);
  assert.match(src, /nexify-consent/);
  assert.match(src, /§ 25 TTDSG/);
});

test("datenschutz covers Art. 6 and Art. 22", () => {
  const src = readFileSync(dePath, "utf8");
  assert.match(src, /Art\. 6/);
  assert.match(src, /Art\. 22/);
  assert.match(src, /Autoriteit Persoonsgegevens/);
});

test("avv covers Art. 28 mandatory contents", () => {
  const src = readFileSync(dePath, "utf8");
  assert.match(src, /Art\. 28/);
  assert.match(src, /TOM/);
  assert.match(src, /Unterauftragsverarbeiter/);
});

test("ki-hinweise references AI Act Art. 50", () => {
  const src = readFileSync(dePath, "utf8");
  assert.match(src, /Art\. 50/);
  assert.match(src, /2024\/1689|AI Act/);
});

test("impressum references DDG and known company facts only", () => {
  const src = readFileSync(dePath, "utf8");
  assert.match(src, /§§ 5, 6 DDG|Digitale-Dienste-Gesetz/);
  assert.match(src, /90483944/);
  assert.match(src, /NL865786276B01/);
  assert.match(src, /Pascal Courbois/);
  assert.match(src, /Graaf van Loonstraat/);
  assert.match(src, /mail@nexifyai\.cloud/);
});

test("legal-page component renders placeholders with distinct styling", () => {
  const src = readFileSync(legalPagePath, "utf8");
  assert.match(src, /isPlaceholder/);
  assert.match(src, /BITTE ERGÄNZEN/);
  assert.match(src, /TextItem/);
});

test("flat legal routes exist and include JsonLd", () => {
  for (const slug of SLUGS) {
    const page = join(root, "app", slug, "page.tsx");
    assert.equal(existsSync(page), true, page);
    const src = readFileSync(page, "utf8");
    assert.match(src, /webPageJsonLd/);
    assert.match(src, /JsonLd/);
  }
});

test("legal-content re-exports legalDe", () => {
  const src = readFileSync(join(root, "lib/legal-content.ts"), "utf8");
  assert.match(src, /legalDe as legalPages/);
});
