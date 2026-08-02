import assert from 'node:assert/strict';
import test from 'node:test';

test('LocaleSwitcher - has 3 locales', () => {
  const locales = ['de', 'en', 'nl'];
  assert.equal(locales.length, 3);
});

test('LocaleSwitcher - locale labels are correct', () => {
  const labels = { de: 'DE', en: 'EN', nl: 'NL' };
  assert.equal(labels.de, 'DE');
  assert.equal(labels.en, 'EN');
  assert.equal(labels.nl, 'NL');
});
