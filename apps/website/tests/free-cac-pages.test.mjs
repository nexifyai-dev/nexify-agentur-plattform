// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/tests/free-cac-pages.test.mjs
// NIR: 02.08.2026 11:00
// UPDATED: 02.08.2026 11:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Contract test — free CAC pages exist and export expected markers
// WHY: Guard acquisition pages against accidental deletion
// BEST-PRACTICE: File presence + string markers; no browser needed
// PITFALL: V-XX: keep assertions honest (no fake live URLs)
// DEPENDS: app routes under apps/website/app
// DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
// SESSION: research-free-cac-full-7dd5

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const pages = [
  ["app/alternativen/page.tsx", "alternativen-page"],
  ["app/sprechstunde/page.tsx", "sprechstunde-page"],
  ["app/partner/page.tsx", "partner-page"],
  ["app/botschafter/page.tsx", "botschafter-page"],
  ["app/vergleich/page.tsx", "vergleich-page"],
  ["app/checkliste/page.tsx", "checkliste-page"],
];

test("free CAC acquisition pages exist with data-testid", () => {
  for (const [rel, marker] of pages) {
    const path = join(root, rel);
    assert.equal(existsSync(path), true, `missing ${rel}`);
    const src = readFileSync(path, "utf8");
    assert.match(src, new RegExp(marker));
  }
});

test("sitemap lists new acquisition routes", () => {
  const src = readFileSync(join(root, "app/sitemap.ts"), "utf8");
  for (const route of ["/alternativen", "/sprechstunde", "/partner", "/botschafter", "/checkliste", "/vergleich"]) {
    assert.match(src, new RegExp(`"${route}"`));
  }
});

test("footer exposes WhatsApp Business link", () => {
  const src = readFileSync(join(root, "components/site-footer.tsx"), "utf8");
  assert.match(src, /footer-whatsapp-link/);
  assert.match(src, /wa\.me/);
});
