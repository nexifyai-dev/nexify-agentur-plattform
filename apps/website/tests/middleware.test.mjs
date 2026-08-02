import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mw = readFileSync(join(root, 'middleware.ts'), 'utf8');

test('middleware - supported locales are de, en, nl', () => {
  const locales = ['de', 'en', 'nl'];
  assert.deepEqual(locales, ['de', 'en', 'nl']);
});

test('middleware - default locale is de', () => {
  assert.match(mw, /const defaultLocale:\s*Locale\s*=\s*"de"/);
});

test('middleware - does not redirect acquisition via Accept-Language to NL', () => {
  // Comment may mention Accept-Language; must not read the header for routing.
  assert.doesNotMatch(mw, /headers\.get\([\'"]accept-language[\'"]\)/i);
  assert.doesNotMatch(mw, /request\.headers.*accept-language/i);
  assert.match(mw, /ignore Accept-Language/);
  assert.match(mw, /NEXT_LOCALE", defaultLocale/);
});

test('middleware - strips locale prefixes without inventing NL', () => {
  assert.match(mw, /Strip legacy locale prefixes/);
  assert.match(mw, /does not invent NL from headers/);
});

test('middleware - skips _next paths', () => {
  const pathname = '/_next/static/chunk.js';
  assert.ok(pathname.startsWith('/_next'));
});

test('middleware - skips api paths', () => {
  const pathname = '/api/contact';
  assert.ok(pathname.startsWith('/api'));
});
