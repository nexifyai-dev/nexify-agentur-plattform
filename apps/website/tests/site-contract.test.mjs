import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const read = (path) => readFileSync(path, 'utf8');

const loadNextConfig = () => {
  const source = read('next.config.ts');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: 'next.config.ts',
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    exports: module.exports,
    module,
    process: { env: {} },
  }, { filename: 'next.config.ts' });
  return module.exports.default ?? module.exports;
};
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

test('redirect config keeps expected locale and legacy aliases', async () => {
  const config = loadNextConfig();
  const redirects = JSON.parse(JSON.stringify(await config.redirects()));
  assert.deepEqual(redirects, [
    { source: '/:locale(de|en|nl)/:page(login|admin|konto|registrieren|rueckruf)', destination: '/:page', permanent: false },
    { source: '/arbeitsweise', destination: '/prozess', permanent: true },
    { source: '/ueber-pascal', destination: '/ueber-mich', permanent: true },
    { source: '/projekte', destination: '/referenzen', permanent: true },
  ]);
  assert.ok(!redirects.some(({ source }) => source === '/preise'));
  assert.ok(!redirects.some(({ source }) => source === '/kontakt'));
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
