import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

test("mobile: sticky CTA clears chat launcher on small screens", () => {
  const src = read("components/sticky-cta.tsx");
  assert.match(src, /pr-\[4\.75rem\]/);
  assert.match(src, /data-testid="sticky-cta"/);
  assert.match(src, /safe-area-inset-bottom/);
});

test("mobile: chat panel goes full-bleed under 640px", () => {
  const css = read("app/globals.css");
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /\.chat-panel\s*\{[\s\S]*?height:\s*100dvh/);
  assert.match(css, /input\.field[\s\S]*?font-size:\s*16px/);
  assert.match(css, /#main-content\s*\{[\s\S]*?padding-bottom/);
});

test("mobile: StickyCta mounts once in root layout", () => {
  const rootLayout = read("app/layout.tsx");
  const localeLayout = read("app/[locale]/layout.tsx");
  assert.match(rootLayout, /StickyCta/);
  assert.doesNotMatch(localeLayout, /StickyCta/);
  assert.match(rootLayout, /viewportFit:\s*"cover"/);
});

test("mobile: header uses larger tap targets and scrollable menu", () => {
  const header = read("components/site-header.tsx");
  assert.match(header, /size-11/);
  assert.match(header, /max-h-\[min\(80vh/);
  assert.match(header, /\/rueckruf/);
  // Burger through tablet/lg; desktop nav only from xl — prevents logo/Leistungen overlap
  assert.match(header, /xl:hidden/);
  assert.match(header, /header-logo-link"[^>]*shrink-0/);
});

test("mobile: cookie banner offsets above chat on small screens", () => {
  const cookie = read("components/cookie-consent.tsx");
  assert.match(cookie, /mb-\[4\.5rem\]/);
  assert.match(cookie, /flex-col/);
});
