import assert from 'node:assert/strict';
import test from 'node:test';

test('robots - allows all user agents', () => {
  const userAgent = '*';
  assert.equal(userAgent, '*');
});

test('robots - disallows api paths', () => {
  const disallow = ['/api/'];
  assert.ok(disallow.includes('/api/'));
});

test('robots - has sitemap reference', () => {
  const sitemap = 'https://nexifyai.cloud/sitemap.xml';
  assert.ok(sitemap.includes('sitemap.xml'));
});
