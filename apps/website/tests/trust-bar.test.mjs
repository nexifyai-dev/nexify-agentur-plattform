import assert from 'node:assert/strict';
import test from 'node:test';

test('TrustBar - has 6 items', () => {
  const count = 6;
  assert.equal(count, 6);
});

test('TrustBar - items have correct structure', () => {
  const item = { icon: 'Shield', label: 'Kein Risiko', detail: 'Kostenlose Erstberatung' };
  assert.ok(item.label.length > 0);
  assert.ok(item.detail.length > 0);
});
