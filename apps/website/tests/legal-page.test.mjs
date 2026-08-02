import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("LegalPage component - disclaimer and structure hooks", () => {
  const src = readFileSync(join(root, "components/legal-page.tsx"), "utf8");
  assert.match(src, /data-testid=\{`legal-page-\$\{page\.slug\}`\}/);
  assert.match(src, /legal-disclaimer/);
  assert.match(src, /Kein Rechtsrat/);
});

test("LegalPage - DE content has last-updated stamp", () => {
  const src = readFileSync(join(root, "lib/legal/de.ts"), "utf8");
  assert.match(src, /updated: "2\. August 2026"/);
});
