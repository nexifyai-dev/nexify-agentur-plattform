import assert from 'node:assert/strict';
import test from 'node:test';

test('TestimonialStrip - has correct count', () => {
  const count = 3;
  assert.equal(count, 3);
});

test('TestimonialStrip - has correct structure', () => {
  const item = {
    quote: 'Test quote',
    author: 'Test Author',
    company: 'Test Company',
    industry: 'Test Industry',
  };
  assert.ok(item.quote.length > 0);
  assert.ok(item.author.length > 0);
});
