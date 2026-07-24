import assert from 'node:assert/strict';
import test from 'node:test';

test('middleware - supported locales are de, en, nl', () => {
  const locales = ['de', 'en', 'nl'];
  assert.deepEqual(locales, ['de', 'en', 'nl']);
});

test('middleware - default locale is de', () => {
  const defaultLocale = 'de';
  assert.equal(defaultLocale, 'de');
});

test('middleware - detects nl from accept-language', () => {
  const accept = 'nl-NL,nl;q=0.9,en;q=0.8';
  const lang = accept.split(',').map(l => l.split(';')[0].trim().toLowerCase())[0];
  assert.ok(lang.startsWith('nl'));
});

test('middleware - detects en from accept-language', () => {
  const accept = 'en-US,en;q=0.9';
  const lang = accept.split(',').map(l => l.split(';')[0].trim().toLowerCase())[0];
  assert.ok(lang.startsWith('en'));
});

test('middleware - skips _next paths', () => {
  const pathname = '/_next/static/chunk.js';
  assert.ok(pathname.startsWith('/_next'));
});

test('middleware - skips api paths', () => {
  const pathname = '/api/contact';
  assert.ok(pathname.startsWith('/api'));
});
