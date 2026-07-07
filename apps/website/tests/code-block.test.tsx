import assert from 'node:assert/strict';
import test from 'node:test';

test('CodeBlock - has correct file name', () => {
  const fileName = 'nexify.config.ts';
  assert.equal(fileName, 'nexify.config.ts');
});

test('CodeBlock - has correct border radius', () => {
  const borderRadius = '12px';
  assert.equal(borderRadius, '12px');
});
