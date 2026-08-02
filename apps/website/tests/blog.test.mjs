import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");

test("blog content directory has DE seed articles", () => {
  const dir = join(root, "content/blog");
  assert.ok(existsSync(dir), "content/blog must exist");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  assert.ok(files.length >= 3, `expected >=3 seed posts, got ${files.length}`);
  for (const f of files) {
    const raw = read(`content/blog/${f}`);
    assert.match(raw, /^---[\s\S]*title:/m);
    assert.match(raw, /449|Tagessatz|DACH|Deutschland|Venlo|NRW/i);
    assert.doesNotMatch(raw, /999\s*€/);
  }
});

test("blog index and slug routes are crawlable SSR", () => {
  const index = read("app/blog/page.tsx");
  assert.match(index, /pageMetadata/);
  assert.match(index, /path:\s*"\/blog"/);
  assert.match(index, /data-testid="blog-page"/);
  assert.match(index, /getAllBlogPosts/);
  assert.match(index, /breadcrumbListJsonLd/);

  const slug = read("app/blog/[slug]/page.tsx");
  assert.match(slug, /generateStaticParams/);
  assert.match(slug, /blogPostingJsonLd/);
  assert.match(slug, /BlogMarkdown/);
  assert.match(slug, /href="\/kontakt"/);
  assert.match(slug, /href="\/leistungen"/);
  assert.match(slug, /data-testid="blog-internal-links"/);
});

test("blog RSS route exists", () => {
  const rss = read("app/blog/rss.xml/route.ts");
  assert.match(rss, /application\/rss\+xml/);
  assert.match(rss, /getAllBlogPosts/);
  assert.match(rss, /language>de-de/);
});

test("sitemap includes blog routes", () => {
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /blogPostSlugs/);
  assert.match(sitemap, /"\/blog"/);
  assert.match(sitemap, /\/blog\/\$\{slug\}/);
});

test("seo helpers expose BlogPosting and DE-first hreflang", () => {
  const src = read("lib/seo.ts");
  assert.match(src, /export function blogPostingJsonLd/);
  assert.match(src, /"@type": "BlogPosting"/);
  assert.match(src, /"x-default"/);
  assert.match(src, /locale:\s*"de_DE"/);
  assert.match(src, /og-image\.png/);
  // Must not claim equal NL/EN alternate content
  assert.doesNotMatch(
    src,
    /languages:\s*\{[^}]*\bnl:\s*canonicalPath/,
  );
});

test("soft-404 not-found is server noindex", () => {
  const nf = read("app/not-found.tsx");
  assert.match(nf, /robots:\s*\{\s*index:\s*false/);
  assert.match(nf, /data-testid="not-found-page"/);
  assert.doesNotMatch(nf, /"use client"/);
});

test("nav/footer/home/services link to blog", () => {
  assert.match(read("components/site-header.tsx"), /href:\s*"\/blog"/);
  assert.match(read("components/site-footer.tsx"), /href:\s*"\/blog"/);
  assert.match(read("components/pages/home.tsx"), /href="\/blog"/);
  assert.match(read("components/pages/services.tsx"), /href="\/blog"/);
  assert.match(read("components/pages/knowledge.tsx"), /href="\/blog"/);
});

test("llm.txt lists blog crawl targets", () => {
  const llm = read("public/llm.txt");
  assert.match(llm, /\/blog/);
  assert.match(llm, /rss\.xml/);
  assert.match(llm, /DACH|German \(primary/i);
});
