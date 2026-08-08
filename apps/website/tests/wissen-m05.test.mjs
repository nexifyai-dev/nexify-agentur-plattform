import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * M-05 Blog-Serie: strukturelle Verträge der 10 Wissen-Artikel.
 * Geprüft werden nur reine Text-/Daten-Verträge — kein Build nötig.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/content/wissen-articles.ts"), "utf8");

const EXPECTED_SLUGS = [
  "was-kostet-ki-chatbot-2026",
  "ki-automatisierung-kmu-7-gewinne",
  "whatsapp-marketing-handwerk",
  "ai-agenten-einfuehrung",
  "chatbot-dsgvo",
  "website-kosten-2026",
  "ki-steuerbuero",
  "automation-roi",
  "chatgpt-unternehmen-grenzen",
  "was-kostet-web-app-2026",
];

test("M-05 - alle 10 Ziel-Slugs vorhanden", () => {
  for (const slug of EXPECTED_SLUGS) {
    assert.ok(src.includes(`slug: "${slug}"`), `fehlt: ${slug}`);
  }
});

test("M-05 - kein Duplikat zu bestehenden Artikeln", () => {
  // ai-automatisierung-kmu bleibt Einzelgänger (bestehender Artikel, kein Update erzeugt).
  const legacy = src.match(/slug: "ai-automatisierung-kmu"/g) ?? [];
  assert.equal(legacy.length, 1);
});

test("M-05 - jeder Artikel hat FAQ-Block (FAQPage-Vertrag)", () => {
  const blocks = src.split(/slug: "/).slice(1);
  assert.ok(blocks.length >= 11, `erwartet >=11 Artikel, gefunden ${blocks.length}`);
  const checked = blocks.filter((b) => EXPECTED_SLUGS.includes(b.split('"')[0]));
  assert.equal(checked.length, EXPECTED_SLUGS.length, "Ziel-Slugs nicht alle im Array gefunden");
  for (const block of checked) {
    const slug = block.split('"')[0];
    assert.match(block, /faqs: \[/, `fehlt faqs in ${slug}`);
    assert.match(block, /q: "/, `fehlt q in ${slug}`);
    assert.match(block, /a: "/, `fehlt a in ${slug}`);
  }
});

test("M-05 - mindestens 3 interne Links je Artikel (Body-Links)", () => {
  const blocks = src.split(/slug: "/).slice(1);
  for (const block of blocks) {
    const slug = block.split('"')[0];
    if (!EXPECTED_SLUGS.includes(slug)) continue;
    const links = [...block.matchAll(/\]\(\/(?:leistungen|wissen|preise|audit|kontakt|faq|datenschutz|checkliste|branchen|ki-hinweise)[^)]*\)/g)];
    assert.ok(links.length >= 3, `${slug}: nur ${links.length} interne Links`);
  }
});

test("M-05 - CTA-Pflicht (explizit oder Default via Nav)", () => {
  // Jeder Artikel endet mit CTA: entweder cta-Feld oder Default-Nav (/kontakt) im Body.
  const blocks = src.split(/slug: "/).slice(1);
  const checked = blocks.filter((b) => EXPECTED_SLUGS.includes(b.split('"')[0]));
  assert.equal(checked.length, EXPECTED_SLUGS.length, "Ziel-Slugs nicht alle im Array gefunden");
  for (const block of checked) {
    const slug = block.split('"')[0];
    const hasCta = /cta:\s*\{/.test(block) || /\/kontakt/.test(block);
    assert.ok(hasCta, `${slug}: kein CTA`);
  }
});

test("M-05 - keine erfundenen Zahlen ohne Quellenangabe (Stichprobe)", () => {
  // Jeder Artikel mit Markt-Zahl nennt im selben Block eine Quelle (20xx|Quelle|Studie|Meta|Bitkom|IAB).
  const blocks = src.split(/slug: "/).slice(1);
  for (const block of blocks) {
    const slug = block.split('"')[0];
    if (!EXPECTED_SLUGS.includes(slug)) continue;
    const hasSource = /(20\d\d|Quelle|Meta|Bitkom|IAB|BStBK|IAPME|DSGVO)/.test(block);
    assert.ok(hasSource, `${slug}: keine Quellenangabe`);
  }
});

test("M-05 - Datenformat: datePublished/dateModified ISO", () => {
  const dates = [...src.matchAll(/date(?:Published|Modified): "(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
  assert.ok(dates.length >= 22, `erwartet >=22 Datumsangaben, gefunden ${dates.length}`);
});

test("M-05 - Body-Link-Syntax korrekt (kein kaputtes [Label](pfad))", () => {
  // Links ohne führenden Slash (relative Pfade) sind im Rendering ungültig.
  const bad = [...src.matchAll(/\]\((?!\/|https?:)/g)];
  assert.equal(bad.length, 0, `kaputte Links: ${bad.length}`);
});
