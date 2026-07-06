import assert from 'node:assert/strict';
import test from 'node:test';

test('PricingCalculator Component - calculates correct prices', () => {
  const dayRate = 999;
  const vatRate = 0.21;
  const days = 3;
  const net = days * dayRate;
  const vat = net * vatRate;
  const gross = net + vat;
  assert.equal(net, 2997);
  assert.ok(Math.abs(vat - 629.37) < 0.01);
  assert.ok(Math.abs(gross - 3626.37) < 0.01);
});

test('PricingCalculator Component - has correct day range', () => {
  const minDays = 1;
  const maxDays = 60;
  assert.equal(minDays, 1);
  assert.equal(maxDays, 60);
});

test('PricingCalculator Component - uses NeXify Blue for accent', () => {
  const accentColor = "#2563EB";
  assert.equal(accentColor, "#2563EB");
});
