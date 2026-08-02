import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("soft-404: [locale] dynamicParams is false", () => {
  const src = readFileSync(join(root, "app/[locale]/layout.tsx"), "utf8");
  assert.match(src, /export const dynamicParams\s*=\s*false/);
});

test("security.txt exists at public root and .well-known", () => {
  const a = readFileSync(join(root, "public/security.txt"), "utf8");
  const b = readFileSync(join(root, "public/.well-known/security.txt"), "utf8");
  assert.match(a, /Contact:\s*mailto:mail@nexifyai\.cloud/);
  assert.equal(a, b);
});

test("thank-you page /danke exists", () => {
  const src = readFileSync(join(root, "app/danke/page.tsx"), "utf8");
  assert.match(src, /thank-you-page/);
  assert.match(src, /noIndex:\s*true/);
});

test("alias redirects cover former soft-404 paths", () => {
  const src = readFileSync(join(root, "next.config.ts"), "utf8");
  for (const needle of ["/hilfe", "/docs", "/cookies", "/ki", "/dpa", "/thank-you"]) {
    assert.match(src, new RegExp(needle.replace("/", "\\/")));
  }
});

test("not-found is server component with CTA", () => {
  const src = readFileSync(join(root, "app/not-found.tsx"), "utf8");
  assert.doesNotMatch(src, /use client/);
  assert.match(src, /not-found-page/);
  assert.match(src, /rueckruf/);
});
