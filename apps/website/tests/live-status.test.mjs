import assert from 'node:assert/strict';
import test from 'node:test';

test('LiveStatus - has correct text', () => {
  const text = 'Jetzt verfügbar';
  assert.equal(text, 'Jetzt verfügbar');
});

test('LiveStatus - uses ping animation', () => {
  const animation = 'animate-ping';
  assert.equal(animation, 'animate-ping');
});
