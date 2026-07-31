import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as ts from 'typescript';

const read = (path) => {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    const displayPath = path instanceof URL ? fileURLToPath(path) : path;
    throw new Error(`${displayPath} not found or unreadable`, { cause: error });
  }
};
const isBooleanKeyword = (node) => node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword;
const nextConfigPath = new URL('../next.config.ts', import.meta.url);

const parseRedirects = () => {
  const source = read(nextConfigPath);
  const sourceFile = ts.createSourceFile('next.config.ts', source, ts.ScriptTarget.ES2023, true, ts.ScriptKind.TS);
  const unwrapExpression = (node) => {
    if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
      return unwrapExpression(node.expression);
    }
    return node;
  };
  const getObjectProperty = (objectNode, propertyName, context = 'object') => {
    const property = objectNode.properties.find(
      (node) => ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === propertyName
    );
    assert.ok(property, `Missing ${context} property: ${propertyName}`);
    return unwrapExpression(property.initializer);
  };

  const configStatement = sourceFile.statements.find(
    (statement) =>
      ts.isVariableStatement(statement) &&
      statement.declarationList.declarations.some(
        (declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === 'nextConfig' && declaration.initializer
      )
  );
  assert.ok(configStatement && ts.isVariableStatement(configStatement), 'next.config.ts must define nextConfig');
  const configDeclaration = configStatement.declarationList.declarations.find(
    (declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === 'nextConfig'
  );
  assert.ok(configDeclaration?.initializer, 'nextConfig must have an initializer');
  const configObject = unwrapExpression(configDeclaration.initializer);
  assert.ok(ts.isObjectLiteralExpression(configObject), 'nextConfig must be an object literal');

  const redirects = getObjectProperty(configObject, 'redirects', 'next.config.ts');
  assert.ok(ts.isArrowFunction(redirects), 'redirects must be an arrow function');
  const redirectsBody = unwrapExpression(redirects.body);
  assert.ok(ts.isArrayLiteralExpression(redirectsBody), 'redirects must return an array literal');

  return redirectsBody.elements.map((entry) => {
    assert.ok(ts.isObjectLiteralExpression(entry), 'redirect entries must be object literals');
    const sourceNode = getObjectProperty(entry, 'source', 'redirect entry');
    const destinationNode = getObjectProperty(entry, 'destination', 'redirect entry');
    const permanentNode = getObjectProperty(entry, 'permanent', 'redirect entry');
    assert.ok(ts.isStringLiteralLike(sourceNode), 'redirect source must be a string literal');
    assert.ok(ts.isStringLiteralLike(destinationNode), 'redirect destination must be a string literal');
    assert.ok(isBooleanKeyword(permanentNode), 'redirect permanent must be boolean');
    return {
      source: sourceNode.text,
      destination: destinationNode.text,
      permanent: permanentNode.kind === ts.SyntaxKind.TrueKeyword,
    };
  });
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

test('redirect config keeps expected locale and legacy aliases', () => {
  const redirects = parseRedirects();
  for (const expected of [
    { source: '/:locale(de|en|nl)/:page(login|admin|konto|registrieren|rueckruf)', destination: '/:page', permanent: false },
    { source: '/arbeitsweise', destination: '/prozess', permanent: true },
    { source: '/ueber-pascal', destination: '/ueber-mich', permanent: true },
    { source: '/projekte', destination: '/referenzen', permanent: true },
  ]) {
    assert.ok(
      redirects.some(
        (redirect) =>
          redirect.source === expected.source &&
          redirect.destination === expected.destination &&
          redirect.permanent === expected.permanent
      ),
      `missing redirect ${expected.source} -> ${expected.destination}`
    );
  }
  // Representative top-level canonicals must stay directly addressable, not aliases.
  for (const canonicalRoute of ['/preise', '/kontakt']) {
    assert.ok(!redirects.some(({ source }) => source === canonicalRoute));
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
  assert.match(data, /dayRate:\s*449/);
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
