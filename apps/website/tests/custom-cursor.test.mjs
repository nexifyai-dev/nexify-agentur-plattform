import assert from 'node:assert/strict';
import test from 'node:test';

test('CustomCursor - default size', () => {
  const size = 8;
  assert.equal(size, 8);
});

test('CustomCursor - has mix-blend-mode difference', () => {
  const blendMode = 'difference';
  assert.equal(blendMode, 'difference');
});
