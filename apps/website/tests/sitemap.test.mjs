import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sitemapSrc = readFileSync(join(root, 'app/sitemap.ts'), 'utf8');

test('Sitemap - homepage has highest priority', () => {
  assert.match(sitemapSrc, /priority:\s*1/);
});

test('Sitemap - money pages present', () => {
  for (const path of ['/leistungen', '/preise', '/vergleich', '/kontakt', '/rueckruf', '/checkliste', '/partner', '/alternativen', '/branchen', '/audit']) {
    assert.ok(sitemapSrc.includes(`"${path}"`) || sitemapSrc.includes(`'${path}'`), path);
  }
});

test('Sitemap - single vergleich money path entry (no soft-404 children)', () => {
  const pathEntries = [...sitemapSrc.matchAll(/path:\s*"(\/vergleich[^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(pathEntries, ['/vergleich']);
  assert.doesNotMatch(sitemapSrc, /ki-agentur/);
});

test('Sitemap - leistungen/branchen/wissen via helpers', () => {
  assert.match(sitemapSrc, /leistungSeoSlugs/);
  assert.match(sitemapSrc, /branchenSlugs/);
  assert.match(sitemapSrc, /wissenArticleSlugs/);
});

test('Sitemap - has www base via siteOrigin', () => {
  assert.match(sitemapSrc, /siteOrigin/);
});
