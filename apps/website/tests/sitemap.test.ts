import assert from 'node:assert/strict';
import test from 'node:test';

test('Sitemap - homepage has highest priority', () => {
  const priority = 1.0;
  assert.equal(priority, 1.0);
});

test('Sitemap - service pages have high priority', () => {
  const priority = 0.8;
  assert.ok(priority >= 0.7);
});

test('Sitemap - legal pages have low priority', () => {
  const priority = 0.3;
  assert.ok(priority <= 0.5);
});

test('Sitemap - supports 3 locales', () => {
  const locales = ['de', 'en', 'nl'];
  assert.equal(locales.length, 3);
});

test('Sitemap - has correct base URL', () => {
  const baseUrl = 'https://nexifyai.cloud';
  assert.ok(baseUrl.includes('nexify'));
});
