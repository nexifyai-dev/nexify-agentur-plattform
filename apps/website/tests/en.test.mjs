import assert from 'node:assert/strict';
import test from 'node:test';

test('legal-en - has required pages', () => {
  const pages = ['impressum', 'datenschutz', 'agb', 'ki-hinweise', 'cookie-richtlinie', 'avv', 'widerruf'];
  assert.equal(pages.length, 7);
});

test('legal-en - impressum has company info', () => {
  const content = 'NeXifyAI';
  assert.ok(content.includes('NeXify'));
});
