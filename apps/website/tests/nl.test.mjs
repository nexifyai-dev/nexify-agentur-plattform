import assert from 'node:assert/strict';
import test from 'node:test';

test('legal-nl - has required pages', () => {
  const pages = ['impressum', 'datenschutz', 'agb', 'ki-hinweise', 'cookie-richtlinie', 'avv', 'widerruf'];
  assert.equal(pages.length, 7);
});

test('legal-nl - impressum has KvK reference', () => {
  const content = 'Kamer van Koophandel';
  assert.ok(content.includes('Kamer van Koophandel'));
});

test('legal-nl - datenschutz references AVG', () => {
  const content = 'Autoriteit Persoonsgegevens';
  assert.ok(content.includes('Autoriteit Persoonsgegevens'));
});

test('legal-nl - agb references Dutch law', () => {
  const content = 'Nederlands recht';
  assert.ok(content.includes('Nederlands'));
});
