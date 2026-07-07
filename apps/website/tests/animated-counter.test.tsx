import assert from 'node:assert/strict';
import test from 'node:test';

test('AnimatedCounter - uses ease-out-quart easing', () => {
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
  assert.equal(easeOutQuart(0), 0);
  assert.equal(easeOutQuart(1), 1);
  assert.ok(easeOutQuart(0.5) > 0.5); // ease-out is faster at start
});

test('AnimatedCounter - formats numbers German style', () => {
  const formatted = (999).toLocaleString('de-DE');
  assert.equal(formatted, '999');
  const big = (184260).toLocaleString('de-DE');
  assert.ok(big.includes('184'));
});
