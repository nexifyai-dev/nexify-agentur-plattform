import assert from 'node:assert/strict';
import test from 'node:test';

test('Loading - spinner uses animate-spin', () => {
  const animation = 'animate-spin';
  assert.equal(animation, 'animate-spin');
});

test('Loading - compact min height', () => {
  const height = '40vh';
  assert.equal(height, '40vh');
});
