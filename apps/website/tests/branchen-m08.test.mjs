// FILE: /apps/website/tests/branchen-m08.test.mjs
// NIR: 08.08.2026 12:30
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: M-08 strukturelle Verträge der 10 Branchenseiten (5 vertieft + 5 neu):
//       Slugs, Pain-Point-Sektion, Anwendungsfälle, FAQPage-Vertrag, Unique-Content,
//       Cross-Links, Negativfall. Reine Text-/Daten-Verträge — kein Build nötig.
// WHY: E2E-Gegentest lt. Maßnahmenkatalog M-08: Unique-Content-Check, Negativfall,
//      Regression gegen die bestehenden 5 Branchen.
// BEST-PRACTICE: Kein Build nötig (statische Source-Verträge, Muster wissen-m05.test.mjs)
// PITFALL: V-GTM-BR-01: keine erfundenen ROI-Zahlen; V-GTM-BR-03: 404 für unbekannte Slugs
// DEPENDS: lib/gtm/branchen.ts, app/branchen/[slug]/page.tsx
// DOCS-REF: FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-08
// SESSION: t_0151f14a M-08

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/gtm/branchen.ts"), "utf8");
const page = readFileSync(join(root, "app/branchen/[slug]/page.tsx"), "utf8");

const EXPECTED_SLUGS = [
  "handwerk",
  "steuerberater",
  "ecommerce",
  "immobilien",
  "agenturen",
  "kanzleien",
  "logistik",
  "pflege",
  "gastronomie",
  "produktion",
];

const slugs = [...src.matchAll(/^    slug: "([^"]+)",$/gm)].map((m) => m[1]);
const blocks = slugs.map((slug) => blockOf(slug));

test("M-08 - alle 10 Ziel-Slugs vorhanden", () => {
  for (const slug of EXPECTED_SLUGS) {
    assert.ok(src.includes(`slug: "${slug}"`), `fehlt: ${slug}`);
  }
  // keine 11. Branche durch Fehler
  assert.equal(blocks.length, EXPECTED_SLUGS.length, `erwartet 10 Branchen, gefunden ${blocks.length}`);
});

test("M-08 - jede Branche hat Pain-Point-Sektion (notYourFault >= 2)", () => {
  for (const slug of EXPECTED_SLUGS) {
    const block = blockOf(slug);
    assert.match(block, /notYourFault: \[/, `${slug}: fehlt notYourFault`);
    const items = block.match(/notYourFault: \[([\s\S]*?)\],/)?.[1] ?? "";
    const count = (items.match(/"/g) ?? []).length;
    assert.ok(count >= 4, `${slug}: notYourFault nur ${count / 2} Einträge`);
  }
});

test("M-08 - jede Branche hat 1 konkrete Anwendung (useCase)", () => {
  for (const slug of EXPECTED_SLUGS) {
    const block = blockOf(slug);
    assert.match(block, /useCase: \{/, `${slug}: fehlt useCase`);
    assert.match(block, /title: "/, `${slug}: fehlt useCase.title`);
    assert.match(block, /text: "/, `${slug}: fehlt useCase.text`);
  }
});

test("M-08 - jede Branche hat 3 Anwendungsfälle (Website/Automatisierung/AI-Agent) mit Ziel-Leistung", () => {
  const validTargets = [
    "/leistungen/websites",
    "/leistungen/automatisierung",
    "/leistungen/ai-agenten",
  ];
  for (const slug of EXPECTED_SLUGS) {
    const block = blockOf(slug);
    const appsBlock = block.match(/apps: \[([\s\S]*?)\],\n\s*outcomes/)?.[1] ?? "";
    assert.ok(appsBlock.length > 0, `${slug}: apps-Block fehlt`);
    const hrefs = [...appsBlock.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]);
    assert.equal(hrefs.length, 3, `${slug}: ${hrefs.length}/3 apps`);
    for (const h of hrefs) {
      assert.ok(validTargets.includes(h), `${slug}: unbekanntes Ziel ${h}`);
    }
    assert.match(appsBlock, /name: "Website"/, `${slug}: App Website fehlt`);
    assert.match(appsBlock, /name: "Automatisierung"/, `${slug}: App Automatisierung fehlt`);
  }
});

test("M-08 - jede Branche hat FAQ-Block mit q/a (FAQPage-Vertrag)", () => {
  for (const slug of EXPECTED_SLUGS) {
    const block = blockOf(slug);
    assert.match(block, /faqs: \[/, `${slug}: fehlt faqs`);
    const faqsBlock = block.match(/faqs: \[([\s\S]*?)\],\n\s*(?:wissen|\})/)?.[1] ?? "";
    const qs = (faqsBlock.match(/q: "/g) ?? []).length;
    const as = (faqsBlock.match(/a: "/g) ?? []).length;
    assert.ok(qs >= 3, `${slug}: nur ${qs} FAQ-Fragen`);
    assert.equal(qs, as, `${slug}: q/a-Anzahl mismatch (${qs}/${as})`);
  }
});

test("M-08 - FAQPage-Schema wird in der Seite gerendert", () => {
  assert.match(page, /"@type": "FAQPage"/, "page.tsx: FAQPage-Schema fehlt");
  assert.match(page, /mainEntity: b\.faqs\.map/, "page.tsx: FAQ mainEntity fehlt");
  assert.match(page, /data-testid="branche-faq"/, "page.tsx: FAQ-Sektion fehlt");
  assert.match(page, /data-testid="branche-not-your-fault"/, "page.tsx: Pain-Point-Sektion fehlt");
  assert.match(page, /data-testid="branche-apps"/, "page.tsx: Anwendungsfälle fehlen");
  assert.match(page, /data-testid="branche-usecase"/, "page.tsx: useCase fehlt");
});

test("M-08 - Unique-Content: keine doppelten descriptions/pains zwischen Branchen", () => {
  const descriptions = EXPECTED_SLUGS.map((slug) => {
    const block = blockOf(slug);
    return block.match(/description:\s*\n?\s*"([^"]+)"/)?.[1] ?? "";
  });
  assert.equal(new Set(descriptions).size, EXPECTED_SLUGS.length, "doppelte description gefunden");
  const allPains = EXPECTED_SLUGS.flatMap((slug) => {
    const block = blockOf(slug);
    const pains = block.match(/pains: \[([\s\S]*?)\],/)?.[1] ?? "";
    return [...pains.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  });
  assert.equal(new Set(allPains).size, allPains.length, "doppelte pain gefunden");
});

test("M-08 - Negativfall: unbekannter Slug -> notFound im Page-Code", () => {
  assert.match(page, /if \(!b\) notFound\(\)/, "page.tsx: notFound-Guard fehlt");
  assert.doesNotMatch(src, /slug: "zahnarzt"/, "unerwartete Branche zahnarzt");
  assert.doesNotMatch(src, /slug: "arzt"/, "unerwartete Branche arzt");
});

test("M-08 - keine erfundenen ROI-Prozentzahlen (V-GTM-BR-01)", () => {
  const data = src.slice(src.indexOf("export const branchen"));
  assert.doesNotMatch(data, /\d+\s*%/, "Prozentangabe ohne Quelle gefunden");
  assert.doesNotMatch(data, /ROI[-: ]+\d/, "ROI-Zahl ohne Quelle gefunden");
  assert.doesNotMatch(data, /(Fallstudie|Case-?Study)/i, "Fake-Fallstudie gefunden");
});

test("M-08 - 3 CTAs + Wissen-Link-Vertrag", () => {
  assert.match(page, /branche-cta-rueckruf/, "CTA Rückruf fehlt");
  assert.match(page, /branche-cta-audit/, "CTA Audit fehlt");
  assert.match(page, /branche-cta-preise/, "CTA Preise fehlt");
  assert.match(page, /branche-wissen-link/, "Wissen-Link-Sektion fehlt");
  const wissenSlugs = [
    ...src.matchAll(/wissen: \{\s*slug: "([^"]+)"/g),
  ].map((m) => m[1]);
  assert.ok(wissenSlugs.length >= 5, `nur ${wissenSlugs.length} Branchen mit Wissen-Link`);
  const artikel = readFileSync(join(root, "lib/content/wissen-articles.ts"), "utf8");
  for (const s of wissenSlugs) {
    assert.ok(artikel.includes(`slug: "${s}"`), `Wissen-Artikel ${s} existiert nicht`);
  }
});

test("M-08 - bestehende 5 Branchen unverändert (Regression: Slugs + Kernfelder)", () => {
  for (const slug of ["handwerk", "steuerberater", "ecommerce", "immobilien", "agenturen"]) {
    const block = blockOf(slug);
    assert.match(block, /pains: \[/, `${slug}: pains fehlt`);
    assert.match(block, /outcomes: \[/, `${slug}: outcomes fehlt`);
    assert.match(block, /offerHint: "/, `${slug}: offerHint fehlt`);
    assert.match(block, /title: "/, `${slug}: title fehlt`);
  }
});

function blockOf(slug) {
  const idx = src.indexOf(`slug: "${slug}"`);
  assert.ok(idx >= 0, `Branche ${slug} nicht im Datensatz`);
  const next = src.indexOf(`slug: "`, idx + 10);
  return src.slice(idx, next > 0 ? next : undefined);
}
