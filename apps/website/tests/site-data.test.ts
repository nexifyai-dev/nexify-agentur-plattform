import assert from 'node:assert/strict';
import test from 'node:test';

test('site-data - company has required fields', async () => {
  const { company } = await import('@/lib/site-data');
  assert.ok(company.brand.length > 0);
  assert.ok(company.owner.length > 0);
  assert.ok(company.dayRate > 0);
});

test('site-data - services array is not empty', async () => {
  const { services } = await import('@/lib/site-data');
  assert.ok(services.length > 0);
});

test('site-data - each service has required fields', async () => {
  const { services } = await import('@/lib/site-data');
  for (const s of services) {
    assert.ok(s.slug.length > 0);
    assert.ok(s.title.length > 0);
    assert.ok(s.minDays > 0);
  }
});

test('site-data - FAQs exist', async () => {
  const { faqs } = await import('@/lib/site-data');
  assert.ok(faqs.length >= 8);
});

test('site-data - processSteps has 5 steps', async () => {
  const { processSteps } = await import('@/lib/site-data');
  assert.equal(processSteps.length, 5);
});

test('site-data - featurePillars has 3 items', async () => {
  const { featurePillars } = await import('@/lib/site-data');
  assert.equal(featurePillars.length, 3);
});
