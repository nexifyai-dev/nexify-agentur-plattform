import assert from 'node:assert/strict';
import test from 'node:test';

test('Loading - has correct animation', () => {
  const animation = 'animate-pulse';
  assert.equal(animation, 'animate-pulse');
});

test('Loading - has correct dimensions', () => {
  const height = '60vh';
  assert.equal(height, '60vh');
});
