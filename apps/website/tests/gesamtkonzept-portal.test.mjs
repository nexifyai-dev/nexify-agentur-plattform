import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (rel) => readFileSync(new URL(rel, import.meta.url), "utf8");

test("vergleich page reinforces 449 vs 1000–1500", () => {
  const src = read("../app/vergleich/page.tsx");
  assert.ok(src.includes("vergleich-page"));
  assert.ok(src.includes("1.000") || src.includes("1000"));
  assert.ok(src.includes("449") || src.includes("dayRate"));
  assert.ok(src.includes("/kontakt") || src.includes("/rueckruf"));
});

test("portal project panel exposes timeline and invoices", () => {
  const src = read("../components/portal-project-panel.tsx");
  assert.ok(src.includes("portal-timeline"));
  assert.ok(src.includes("portal-invoices"));
  assert.ok(src.includes("portal-deliverables"));
  assert.ok(src.includes("portal-account-manager"));
  assert.ok(src.includes("/api/portal/offers/"));
});

test("konto exposes portal status and payment flows", () => {
  const src = read("../app/konto/page.tsx");
  assert.ok(src.includes("statusHelpTitle"));
  assert.ok(src.includes("/api/portal/offers/"));
  assert.ok(src.includes("offer-status-badge"));
});

test("process page has transparency and QA sections", () => {
  const src = read("../components/pages/process.tsx");
  assert.ok(src.includes("process-transparency"));
  assert.ok(src.includes("process-qa"));
  assert.ok(src.includes("/vergleich"));
});

test("home hero CTA points to vergleich for rate comparison", () => {
  const home = read("../components/pages/home.tsx");
  assert.ok(home.includes('href="/vergleich"'));
  const de = read("../lib/content/de.ts");
  assert.ok(de.includes("449 € statt 1.000–1.500") || de.includes("AI als Begleiter"));
});

test("backend lifecycle helpers exist", () => {
  const src = readFileSync(new URL("../../../backend/lifecycle.py", import.meta.url), "utf8");
  assert.ok(src.includes("anfrage"));
  assert.ok(src.includes("rechnung"));
  assert.ok(src.includes("derive_lifecycle_phase"));
});
