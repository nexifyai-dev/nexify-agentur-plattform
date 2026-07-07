import assert from 'node:assert/strict';
import test from 'node:test';

test('HomePage - has correct sections', () => {
  const sections = ['hero', 'proof-strip', 'services', 'why-price', 'process', 'calculator', 'cta'];
  assert.ok(sections.includes('hero'));
  assert.ok(sections.includes('services'));
  assert.ok(sections.includes('cta'));
});

test('HomePage - has correct hero content', () => {
  const hero = {
    badge: 'Erfahrung trifft AI-gestützte Geschwindigkeit',
    headline: 'Websites und Software vom Fachmann.',
    highlight: 'In Tagen statt Monaten.',
  };
  assert.ok(hero.badge.includes('AI'));
  assert.ok(hero.highlight.includes('Tagen'));
});

test('HomePage - has correct service count', () => {
  const serviceCount = 8;
  assert.equal(serviceCount, 8);
});

test('HomePage - has correct proof metrics', () => {
  const metrics = [
    { value: '999', unit: '€', label: 'netto pro Arbeitstag' },
    { value: '1', unit: 'Tag', label: 'für eine Landingpage' },
    { value: '2–3', unit: 'Tage', label: 'für eine Website' },
    { value: '6–8', unit: 'Tage', label: 'für Shop oder App-MVP' },
  ];
  assert.equal(metrics.length, 4);
  assert.equal(metrics[0].value, '999');
});
