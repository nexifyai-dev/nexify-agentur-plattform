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

const source = read(new URL('../lib/site-data.ts', import.meta.url));
const sourceFile = ts.createSourceFile('site-data.ts', source, ts.ScriptTarget.ES2023, true, ts.ScriptKind.TS);

/** Unwraps TypeScript type assertions so tests can inspect the underlying literal AST nodes. */
const unwrapExpression = (node) => {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    return unwrapExpression(node.expression);
  }
  return node;
};

const getExport = (name) => {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer) {
        return unwrapExpression(declaration.initializer);
      }
    }
  }
  throw new Error(`Missing export: ${name}`);
};

const getPropertyValue = (objectNode, propertyName) => {
  const property = objectNode.properties.find(
    (node) => ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === propertyName
  );
  assert.ok(property, `Missing property: ${propertyName}`);
  return unwrapExpression(property.initializer);
};

test('site-data - company has required fields', () => {
  const company = getExport('company');
  assert.ok(ts.isObjectLiteralExpression(company));
  assert.equal(getPropertyValue(company, 'brand').text, 'NeXify AI');
  assert.equal(getPropertyValue(company, 'owner').text, 'Pascal Courbois');
  assert.equal(getPropertyValue(company, 'dayRate').text, '449');
});

test('site-data - services array is not empty', () => {
  const services = getExport('services');
  assert.ok(ts.isArrayLiteralExpression(services));
  assert.ok(services.elements.length > 0);
});

test('site-data - each service has required fields', () => {
  const services = getExport('services');
  assert.ok(ts.isArrayLiteralExpression(services));
  for (const entry of services.elements) {
    assert.ok(ts.isObjectLiteralExpression(entry));
    assert.ok(ts.isStringLiteralLike(getPropertyValue(entry, 'slug')));
    assert.ok(ts.isStringLiteralLike(getPropertyValue(entry, 'title')));
    assert.ok(ts.isNumericLiteral(getPropertyValue(entry, 'minDays')));
  }
});

test('site-data - FAQs exist', () => {
  const faqs = getExport('faqs');
  assert.ok(ts.isArrayLiteralExpression(faqs));
  assert.ok(faqs.elements.length >= 8);
});

test('site-data - processSteps has 5 steps', () => {
  const processSteps = getExport('processSteps');
  assert.ok(ts.isArrayLiteralExpression(processSteps));
  assert.equal(processSteps.elements.length, 5);
});

test('site-data - featurePillars has 3 items', () => {
  const featurePillars = getExport('featurePillars');
  assert.ok(ts.isArrayLiteralExpression(featurePillars));
  assert.equal(featurePillars.elements.length, 3);
});
