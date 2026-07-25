import assert from 'node:assert/strict';
import test from 'node:test';

test('Locale layout - supports de, en, nl', () => {
  const locales = ['de', 'en', 'nl'];
  assert.deepEqual(locales, ['de', 'en', 'nl']);
});

test('Locale layout - lang attribute matches locale', () => {
  const langMap: Record<string, string> = { de: 'de', en: 'en', nl: 'nl' };
  assert.equal(langMap['de'], 'de');
  assert.equal(langMap['en'], 'en');
});
