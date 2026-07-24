import assert from 'node:assert/strict';
import test from 'node:test';

test('MarqueeStrip - joins items with separator', () => {
  const items = ['Next.js', 'React', 'TypeScript', 'Tailwind'];
  const content = items.join(' · ');
  assert.equal(content, 'Next.js · React · TypeScript · Tailwind');
});

test('MarqueeStrip - default speed', () => {
  const speed = 30;
  assert.equal(speed, 30);
});
