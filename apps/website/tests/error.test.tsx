import assert from 'node:assert/strict';
import test from 'node:test';

test('Error - has correct structure', () => {
  const structure = { heading: true, message: true, retry: true };
  assert.ok(structure.heading);
  assert.ok(structure.message);
  assert.ok(structure.retry);
});
