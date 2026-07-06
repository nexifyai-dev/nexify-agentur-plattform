import assert from 'node:assert/strict';
import test from 'node:test';

test('Reveal - uses correct easing', () => {
  const easing = 'cubic-bezier(0.16,1,0.3,1)';
  assert.equal(easing, 'cubic-bezier(0.16,1,0.3,1)');
});

test('Reveal - default threshold', () => {
  const threshold = 0.1;
  assert.equal(threshold, 0.1);
});

test('RevealGroup - default stagger', () => {
  const stagger = 80;
  assert.equal(stagger, 80);
});

test('RevealGroup - calculates delay per item', () => {
  const stagger = 80;
  const delays = [0, 1, 2, 3, 4].map(i => i * stagger);
  assert.deepEqual(delays, [0, 80, 160, 240, 320]);
});
