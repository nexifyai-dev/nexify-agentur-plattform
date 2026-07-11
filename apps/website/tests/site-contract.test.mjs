import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('yarn lockfile uses only trusted public registry tarballs', () => {
  // This is a yarn project (yarn.lock, no package-lock.json). Assert every
  // resolved tarball comes from a trusted public registry — supply-chain guard.
  const lock = read('yarn.lock');
  const allowed = new Set(['registry.yarnpkg.com', 'registry.npmjs.org']);
  const hosts = new Set();
  for (const m of lock.matchAll(/resolved\s+"(https:\/\/[^"#]+)/g)) {
    hosts.add(new URL(m[1]).host);
  }
  assert.ok(hosts.size > 0, 'expected resolved entries in yarn.lock');
  for (const host of hosts) {
    assert.ok(allowed.has(host), `untrusted registry host in yarn.lock: ${host}`);
  }
});

test('package exposes required quality scripts', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.name, 'nexifyai-agency-website');
  for (const script of ['typecheck', 'lint', 'build', 'test']) {
    assert.equal(typeof pkg.scripts?.[script], 'string');
  }
});

test('legacy and contract URLs redirect to canonical pages', () => {
  const config = read('next.config.ts');
  const redirects = [
    ['/arbeitsweise', '/de/prozess'],
    ['/ueber-pascal', '/de/ueber-mich'],
    ['/projekte', '/de/referenzen'],
    ['/preise', '/de/preise'],
    ['/kontakt', '/de/kontakt'],
  ];
  for (const [source, destination] of redirects) {
    assert.match(config, new RegExp(`source: "${source.replaceAll('/', '\\/')}"`));
    assert.match(config, new RegExp(`destination: "${destination.replaceAll('/', '\\/')}"`));
  }
});

test('service price model keeps required day-rate and offer ranges', () => {
  const data = read('lib/site-data.ts');
  assert.match(data, /dayRate:\s*999/);
  assert.match(data, /vatRate:\s*0\.21/);
  for (const slug of ['landingpages', 'websites', 'onlineshops', 'enterprise-commerce', 'web-apps', 'mobile-apps', 'automatisierung', 'ai-agenten']) {
    assert.match(data, new RegExp(`slug: "${slug}"`));
  }
});

test('design keeps reference overflow guards', () => {
  const css = read('app/globals.css');
  assert.match(css, /\.hero-copy\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /\.operator-wrap\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /\.operator-wrap\s*\{[^}]*overflow:\s*visible/s);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*\.95fr\)\s*minmax\(530px,\s*1\.05fr\)/);
});
