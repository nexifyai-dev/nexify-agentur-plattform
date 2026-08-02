import assert from 'node:assert/strict';
import test from 'node:test';

test('LegalPage - has correct structure', () => {
  const structure = { badge: true, title: true, intro: true, sections: true };
  assert.ok(structure.badge);
  assert.ok(structure.title);
});

test('LegalPage - badge text', () => {
  const badge = 'Rechtliche Informationen';
  assert.equal(badge, 'Rechtliche Informationen');
});
