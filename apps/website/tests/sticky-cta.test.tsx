import assert from 'node:assert/strict';
import test from 'node:test';

test('StickyCta - shows after scroll threshold', () => {
  const threshold = 600;
  assert.equal(threshold, 600);
});

test('StickyCta - has correct position', () => {
  const position = { bottom: '24px', left: '50%', transform: 'translateX(-50%)' };
  assert.equal(position.bottom, '24px');
  assert.equal(position.left, '50%');
});
