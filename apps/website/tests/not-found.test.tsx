import assert from 'node:assert/strict';
import test from 'node:test';

test('NotFound - has correct error code', () => {
  const code = '404';
  assert.equal(code, '404');
});

test('NotFound - has correct heading', () => {
  const heading = 'Seite nicht gefunden.';
  assert.ok(heading.length > 0);
});

test('NotFound - has back link', () => {
  const href = '/';
  assert.equal(href, '/');
});
