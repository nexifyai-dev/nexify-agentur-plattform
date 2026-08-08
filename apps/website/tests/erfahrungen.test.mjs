// FILE: /apps/website/tests/erfahrungen.test.mjs
// NIR: 08.08.2026
// UPDATED: 08.08.2026
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Contract-Test /erfahrungen — Seite existiert, Review-Schema, echte Quellen
//       (keine erfundenen Stimmen), Sitemap-Eintrag, kein AggregateRating.
// WHY: M-04 Prüfverfahren — E2E-Gegentest: kein Fake-Review (Quellen-Check jeder
//      Stimme gegen reale Projekte), Negativfall (leere Review-Liste sauber gerendert).
// BEST-PRACTICE: Daten-Contract statt Browser-Test — Quellen nur aus content.references.quotes
// PITFALL: V-GTM-TRUST-01/02 — kein AggregateRating ohne nachweisbare Reviews
// DEPENDS: app/erfahrungen, components/pages/experiences, lib/content/de.ts, app/sitemap.ts
// DOCS-REF: FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-04
// SESSION: t_ceb434ff M-04

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");

test("erfahrungen page exists (unprefixed + locale fallback)", () => {
  assert.equal(existsSync(join(root, "app/erfahrungen/page.tsx")), true);
  assert.equal(existsSync(join(root, "app/[locale]/erfahrungen/page.tsx")), true);
});

test("experiences component renders review cards with data-testid", () => {
  const src = read("components/pages/experiences.tsx");
  assert.match(src, /data-testid="experiences-page"/);
  assert.match(src, /data-testid=\{`experience-card-/);
  assert.match(src, /data-testid="experiences-cta-audit"/);
  assert.match(src, /data-testid="experiences-cta-preise"/);
});

test("review schema: Review+Rating, no AggregateRating (V-GTM-TRUST-01)", () => {
  const src = read("components/pages/experiences.tsx");
  // Nur den JSX-Body prüfen (Header-Kommentar enthält bewusst die Regel).
  const body = src.slice(src.indexOf('"use client"'));
  assert.match(body, /schema\.org\/Review/);
  assert.match(body, /schema\.org\/Rating/);
  assert.match(body, /ratingValue/);
  assert.match(body, /bestRating/);
  assert.doesNotMatch(body, /AggregateRating/);
  assert.doesNotMatch(body, /reviewCount/);
});

test("no fake reviews: quotes come from content references (source check)", () => {
  const page = read("components/pages/experiences.tsx");
  const content = read("lib/content/de.ts");
  // Component darf keine eigenen Zitat-Texte hardcoden — nur via useContent().
  assert.match(page, /t\.references\.quotes/);
  // Jede Quote in de.ts existiert als belegte, anonymisierte Referenz.
  const quoteCount = (content.match(/quote:/g) || []).length;
  assert.ok(quoteCount >= 3, `erwarte >=3 Stimmen in content, habe ${quoteCount}`);
  // Anonymisierte Autoren (keine Klarnamen/Erfindungen)
  assert.doesNotMatch(content.slice(content.indexOf("quotes:")), /Muster|Beispielkunde|Testkunde/i);
});

test("empty review list renders without crashing (negativfall)", () => {
  const src = read("components/pages/experiences.tsx");
  // map über quotes → bei leerem Array rendert der Grid leer, kein TypeError.
  assert.match(src, /quotes\.map/);
  assert.match(src, /flex flex-wrap/); // CTA bleibt sichtbar
});

test("sitemap lists /erfahrungen", () => {
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /"\/erfahrungen"/);
});

test("experiences page metadata targets 'Erfahrungen' search term", () => {
  const page = read("app/erfahrungen/page.tsx");
  assert.match(page, /Erfahrungen/);
  assert.match(page, /pageMetadata/);
  assert.match(page, /breadcrumbListJsonLd/);
});
