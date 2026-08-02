import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
describe("branchen ICP pages", () => {
  it("defines top-5 slugs", () => {
    const src = readFileSync(join(root, "lib/content/branchen.ts"), "utf8");
    for (const slug of ["handwerk", "steuerberater", "agenturen", "ecommerce", "immobilien"]) {
      assert.match(src, new RegExp(`slug: "${slug}"`));
    }
  });
  it("has page files", () => {
    assert.equal(existsSync(join(root, "app/branchen/page.tsx")), true);
    assert.equal(existsSync(join(root, "app/branchen/[slug]/page.tsx")), true);
  });
  it("sitemap references branchen", () => {
    assert.match(readFileSync(join(root, "app/sitemap.ts"), "utf8"), /branchenSlugs/);
  });
});
