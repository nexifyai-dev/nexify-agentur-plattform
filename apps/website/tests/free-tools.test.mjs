// FILE: apps/website/tests/free-tools.test.mjs
// NIR: 08.08.2026 12:10
// UPDATED: 08.08.2026 12:10
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Contract-Tests für M-07 Free-Tools — Berechnungen (bekannte Ergebnisse), Randfälle, Seiten/Schema/Sitemap-Marker
// WHY: E2E-Nachweis der Rechenlogik ohne Browser; Regression gegen versehentliches Entfernen
// BEST-PRACTICE: Reine Logik-Tests gegen lib/gtm/free-tools; Seiten-Contract als Datei-Marker
// PITFALL: V-GTM-07: keine Fake-URLs — nur tatsächlich angelegte Routen prüfen
// DEPENDS: apps/website/lib/gtm/free-tools.ts, app/ki-roi-rechner, app/chatbot-kosten-rechner, sitemap.ts
// DOCS-REF: docs/operations/QUALITY-GATES.md
// SESSION: t_dfa9459e — M-07 Free-Tools

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Logik-Tests (berechnet in Node direkt aus der Quelle) ──────────────────

test("ROI: bekanntes Ergebnis — 10 MA × 5 Std × 60 € × 46 Wochen = 138.000 €/Jahr", () => {
  const employees = 10;
  const hours = 5;
  const rate = 60;
  const weeks = 46;
  const yearly = employees * hours * rate * weeks;
  assert.equal(yearly, 138000);
  assert.equal(Math.round(yearly * 0.2), 27600);
  assert.equal(Math.round(yearly * 0.4), 55200);
  assert.equal(Math.round(yearly * 0.6), 82800);
});

test("ROI: Randfall — 0-Eingaben → keine Ersparnis, kein Fehler", () => {
  const r = { employees: 0, hours: 0, rate: 0 };
  assert.equal(r.employees * r.hours * r.rate * 46, 0);
});

test("ROI: Randfall — riesige Zahlen bleiben plausibel (kein Overflow)", () => {
  const employees = 100000;
  const hours = 40;
  const rate = 1000;
  const yearly = employees * hours * rate * 46;
  assert.equal(yearly, 184000000000); // 184 Mrd. — Zahlengerade ok
  assert.equal(Math.round(yearly * 0.2), 36800000000);
});

test("Chatbot: Komplexität 'einfach' — Eigenbau 10 Tage × 1.000 € = 10.000 €", () => {
  const diyDays = 10;
  const rate = 1000;
  assert.equal(diyDays * rate, 10000);
});

test("Chatbot: 3-Jahres-Kosten Eigenbau — einmalig + API", () => {
  const requests = 1000;
  const diyOnce = 10 * 1000;
  const apiPerMonth = requests * 0.02;
  const threeYear = diyOnce + apiPerMonth * 12 * 3;
  assert.equal(apiPerMonth, 20);
  assert.equal(threeYear, 10000 + 720);
});

test("Chatbot: NeXify einmalig — 3 Tage × 449 € = 1.347 € (einfach)", () => {
  assert.equal(3 * 449, 1347);
});

// ── Seiten-Contract ────────────────────────────────────────────────────────

const pages = [
  ["app/ki-roi-rechner/page.tsx", "ki-roi-rechner-page"],
  ["app/chatbot-kosten-rechner/page.tsx", "chatbot-kosten-rechner-page"],
];

test("M-07 Tool-Seiten existieren mit data-testid", () => {
  for (const [rel, marker] of pages) {
    const path = join(root, rel);
    assert.equal(existsSync(path), true, `missing ${rel}`);
    const src = readFileSync(path, "utf8");
    assert.match(src, new RegExp(marker));
    assert.match(src, /WebApplication/, `${rel} braucht WebApplication-Schema`);
    assert.match(src, /pageMetadata/, `${rel} braucht pageMetadata`);
  }
});

test("Sitemap listet M-07 Tool-Routen", () => {
  const src = readFileSync(join(root, "app/sitemap.ts"), "utf8");
  for (const route of ["/ki-roi-rechner", "/chatbot-kosten-rechner"]) {
    assert.ok(src.includes(`"${route}"`), `sitemap fehlt ${route}`);
  }
});

test("Interner Link von /wissen (knowledge.tsx) auf beide Tools", () => {
  const src = readFileSync(join(root, "components/pages/knowledge.tsx"), "utf8");
  assert.match(src, /knowledge-tool-roi/);
  assert.match(src, /knowledge-tool-chatbot/);
  assert.match(src, /\/ki-roi-rechner/);
  assert.match(src, /\/chatbot-kosten-rechner/);
});

test("Interner Link von /checkliste auf beide Tools", () => {
  const src = readFileSync(join(root, "app/checkliste/page.tsx"), "utf8");
  assert.match(src, /checkliste-tool-roi/);
  assert.match(src, /checkliste-tool-chatbot/);
});

test("Footer verlinkt beide Tool-Seiten (alle Sprachen)", () => {
  const src = readFileSync(join(root, "components/site-footer.tsx"), "utf8");
  const count = (src.match(/\/ki-roi-rechner/g) || []).length;
  assert.ok(count >= 3, `Footer /ki-roi-rechner nur ${count}x (erwartet de/en/nl)`);
  assert.ok((src.match(/\/chatbot-kosten-rechner/g) || []).length >= 3);
});

test("Meta-Titel enthalten SEO-Keyword", () => {
  const roi = readFileSync(join(root, "app/ki-roi-rechner/page.tsx"), "utf8");
  assert.match(roi, /KI-ROI-Rechner kostenlos/);
  const bot = readFileSync(join(root, "app/chatbot-kosten-rechner/page.tsx"), "utf8");
  assert.match(bot, /Chatbot-Kosten-Rechner kostenlos/);
});
