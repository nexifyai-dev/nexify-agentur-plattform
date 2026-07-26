import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('project lockfile uses only public package registries', () => {
  // @NEXIFYAI-MARKER: test-contract-lockfile-20260713
  const candidates = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];
  const lockPath = candidates.find((path) => {
    try { read(path); return true; } catch { return false; }
  });
  assert.ok(lockPath, 'one supported package-manager lockfile must exist');
  const lock = read(lockPath);
  const hosts = new Set([...lock.matchAll(/https?:\/\/([^/\s"'()<>]+)/g)].map((match) => match[1]));
  for (const host of hosts) {
    assert.ok(['registry.npmjs.org', 'registry.yarnpkg.com'].includes(host), `unexpected package registry: ${host}`);
  }
});

test('package exposes required quality scripts', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.name, 'nexifyai-agency-website');
  for (const script of ['typecheck', 'lint', 'build', 'test']) {
    assert.equal(typeof pkg.scripts?.[script], 'string');
  }
});

test('legacy aliases and locale-only routes redirect to canonical pages', () => {
  const config = read('next.config.ts');
  const redirects = [
    ['/:locale(de|en|nl)/:page(login|admin|konto|registrieren|rueckruf)', '/:page'],
    ['/arbeitsweise', '/prozess'],
    ['/ueber-pascal', '/ueber-mich'],
    ['/projekte', '/referenzen'],
  ];
  for (const [source, destination] of redirects) {
    assert.ok(config.includes(`source: "${source}"`));
    assert.ok(config.includes(`destination: "${destination}"`));
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
