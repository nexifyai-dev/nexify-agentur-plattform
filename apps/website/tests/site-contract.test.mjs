import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('npm lockfile uses only public npm registry tarballs', () => {
  const lock = JSON.parse(read('package-lock.json'));
  const hosts = new Set();
  for (const meta of Object.values(lock.packages ?? {})) {
    if (typeof meta?.resolved !== 'string') continue;
    hosts.add(new URL(meta.resolved).host);
  }
  assert.deepEqual([...hosts], ['registry.npmjs.org']);
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
