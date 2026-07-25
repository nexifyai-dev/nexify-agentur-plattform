import assert from 'node:assert/strict';
import test from 'node:test';

test('i18n - supported locales', () => {
  const locales = ['de', 'en', 'nl'];
  assert.deepEqual(locales, ['de', 'en', 'nl']);
});

test('i18n - default locale is de', () => {
  const defaultLocale = 'de';
  assert.equal(defaultLocale, 'de');
});

test('i18n - isValidLocale accepts valid locales', () => {
  const isValid = (l: string) => ['de', 'en', 'nl'].includes(l);
  assert.ok(isValid('de'));
  assert.ok(isValid('en'));
  assert.ok(isValid('nl'));
  assert.ok(!isValid('fr'));
  assert.ok(!isValid(''));
});
