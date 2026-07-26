import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

test('routing contract keeps unprefixed canonical pages and legacy aliases', () => {
  // PR47 / Emergent SoT: canonical routes are UNPREFIXED (no /de/* prefix).
  // Middleware strips locale prefixes; next.config.ts redirects legacy aliases
  // to the unprefixed canonical paths.
  const config = read('next.config.ts');
  const redirects = [
    ['/arbeitsweise', '/prozess'],
    ['/ueber-pascal', '/ueber-mich'],
    ['/projekte', '/referenzen'],
  ];
  for (const [source, destination] of redirects) {
    assert.match(
      config,
      new RegExp(`\\{\\s*source:\\s*"${escapeRegex(source)}",\\s*destination:\\s*"${escapeRegex(destination)}",\\s*permanent:\\s*true\\s*\\}`),
    );
  }
});

test('middleware strips locale-prefixed public routes back to the unprefixed tree', () => {
  const middleware = read('middleware.ts');
  assert.ok(middleware.includes('if (isLocale(first))'));
  assert.ok(middleware.includes('url.pathname = rest ? `/${rest}` : "/"'));
  assert.ok(middleware.includes('const response = NextResponse.redirect(url, 308);'));
  assert.ok(middleware.includes('response.cookies.set("NEXT_LOCALE", first'));
});

test('service price model keeps required day-rate and offer ranges', () => {
  const data = read('lib/site-data.ts');
  assert.match(data, /dayRate:\s*999/);
  assert.match(data, /vatRate:\s*0\.21/);
  for (const slug of ['landingpages', 'websites', 'onlineshops', 'enterprise-commerce', 'web-apps', 'mobile-apps', 'automatisierung', 'ai-agenten']) {
    assert.match(data, new RegExp(`slug: "${slug}"`));
  }
});

test('layout self-hosts the brand fonts without remote Google fetches', () => {
  const layout = read('app/layout.tsx');
  const css = read('app/globals.css');
  assert.match(layout, /import "@fontsource-variable\/manrope";/);
  assert.match(layout, /import "@fontsource-variable\/outfit";/);
  assert.match(css, /--font-heading:\s*"Outfit Variable",\s*sans-serif;/);
  assert.match(css, /--font-body:\s*"Manrope Variable",\s*sans-serif;/);
});

test('design keeps reference overflow guards', () => {
  const css = read('app/globals.css');
  assert.match(css, /\.hero-copy\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /\.operator-wrap\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /\.operator-wrap\s*\{[^}]*overflow:\s*visible/s);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*\.95fr\)\s*minmax\(530px,\s*1\.05fr\)/);
});
