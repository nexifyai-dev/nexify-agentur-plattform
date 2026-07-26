import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../lib/site-data.ts', import.meta.url), 'utf8');

test('site-data - company has required fields', () => {
  assert.match(source, /brand:\s*"NeXify AI"/);
  assert.match(source, /owner:\s*"Pascal Courbois"/);
  assert.match(source, /dayRate:\s*999/);
});

test('site-data - services array is not empty', () => {
  assert.match(source, /export const services:\s*Service\[]\s*=\s*\[/);
  assert.ok((source.match(/slug:\s*"/g) ?? []).length > 0);
});

test('site-data - each service has required fields', () => {
  const serviceEntries = source.match(/\{\s*slug:\s*"[^"]+"[\s\S]*?minDays:\s*\d+[\s\S]*?\}/g) ?? [];
  assert.ok(serviceEntries.length >= 8);
});

test('site-data - FAQs exist', () => {
  const faqEntries = source.match(/\{\s*q:\s*"[\s\S]*?",\s*a:\s*"[\s\S]*?"\s*\}/g) ?? [];
  assert.ok(faqEntries.length >= 8);
});

test('site-data - processSteps has 5 steps', () => {
  const steps = source.match(/\{\s*n:\s*"\d{2}"/g) ?? [];
  assert.equal(steps.length, 5);
});

test('site-data - featurePillars has 3 items', () => {
  const section = source.match(/export const featurePillars = \[([\s\S]*?)\];/);
  assert.ok(section);
  assert.equal((section[1].match(/title:\s*"/g) ?? []).length, 3);
});
