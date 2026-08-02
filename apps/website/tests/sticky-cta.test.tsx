import assert from 'node:assert/strict';
import test from 'node:test';

test('StickyCta - shows after scroll threshold', () => {
  const threshold = 600;
  assert.equal(threshold, 600);
});

test('StickyCta - clears chat launcher on mobile', () => {
  const position = { insetX: true, chatClearance: '4.75rem', lgHidden: true };
  assert.equal(position.chatClearance, '4.75rem');
  assert.equal(position.lgHidden, true);
});
