import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const header = fs.readFileSync(path.join(root, 'components/site-header.tsx'), 'utf8');

test('SiteHeader Component - has correct navigation items', () => {
  assert.match(header, /label:\s*"Leistungen"/);
  assert.match(header, /href:\s*"\/leistungen"/);
  assert.match(header, /data-testid="header-nav"/);
  assert.match(header, /data-testid=\{`nav-link-\$\{item\.href\.slice\(1\)\}`\}/);
});

test('SiteHeader Component - has correct header height', () => {
  assert.match(header, /h-\[64px\]/);
  assert.match(header, /sm:h-\[74px\]/);
});

test('SiteHeader Component - has mobile menu toggle', () => {
  assert.match(header, /data-testid="mobile-menu-toggle"/);
  assert.match(header, /Menü öffnen/);
});

test('SiteHeader - logo never shrinks under nav (overlap guard)', () => {
  // Regression: min-w-0 shrink collapsed logo to width 0 at lg → „Leistungen“ over logo
  assert.match(header, /data-testid="header-logo-link"[^>]*className="[^"]*shrink-0/);
  assert.doesNotMatch(header, /data-testid="header-logo-link"[^>]*className="[^"]*min-w-0\s+shrink"/);
});

test('SiteHeader - desktop nav collapses to burger before xl (no overlap at 1024)', () => {
  assert.match(header, /data-testid="header-nav"/);
  assert.match(header, /hidden[^"]*xl:flex/);
  assert.match(header, /className="[^"]*xl:hidden"[\s\S]*?data-testid="mobile-menu-toggle"/);
  assert.match(header, /xl:hidden"[\s\S]*?data-testid="mobile-menu"/);
  assert.doesNotMatch(header, /data-testid="header-nav"[^>]*lg:flex/);
});
