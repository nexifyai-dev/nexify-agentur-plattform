import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");

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
  assert.match(src, /CANONICAL_ORIGIN = "https:\/\/www\.nexifyai\.cloud"/);
  assert.match(src, /alternates:\s*\{\s*canonical:/);
  assert.match(src, /openGraph:[\s\S]*url/);
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
