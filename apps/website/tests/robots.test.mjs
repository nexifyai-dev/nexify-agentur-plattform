import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const robotsSrc = readFileSync(join(root, 'app/robots.ts'), 'utf8');

test('robots - Googlebot allow rule present', () => {
  assert.match(robotsSrc, /Googlebot/);
  assert.match(robotsSrc, /allow:\s*"\/"/);
});

test('robots - disallows private paths', () => {
  for (const p of ['/admin', '/konto', '/login', '/registrieren', '/api/']) {
    assert.ok(robotsSrc.includes(p), p);
  }
});

test('robots - has sitemap reference', () => {
  assert.match(robotsSrc, /sitemap\.xml/);
});

test('robots - Bingbot rule present', () => {
  assert.match(robotsSrc, /Bingbot/);
});
