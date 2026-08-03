import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8');

test('delight-copy exposes DE speed promise and portal empty state', () => {
  const src = read('../lib/delight-copy.ts');
  assert.match(src, /Rückmeldung · Ziel/);
  assert.match(src, /Werktag/);
  assert.match(src, /PORTAL_EMPTY/);
  assert.match(src, /Kein Fake-SLA/);
});

test('DelightSuccess and InboundSpeedPromise components exist with testids', () => {
  const delight = read('../components/delight-success.tsx');
  const speed = read('../components/inbound-speed-promise.tsx');
  assert.match(delight, /data-testid=\{testId\}/);
  assert.match(delight, /delight-cta-book/);
  assert.match(delight, /delight-cta-whatsapp/);
  assert.match(speed, /inbound-speed-promise/);
});

test('contact form wires delight success and speed promise', () => {
  const src = read('../components/contact-form.tsx');
  assert.match(src, /DelightSuccess/);
  assert.match(src, /InboundSpeedPromise/);
  assert.match(src, /contact-success/);
});

test('booking success uses DelightSuccess', () => {
  const src = read('../components/pages/callback.tsx');
  assert.match(src, /DelightSuccess/);
  assert.match(src, /booking-success/);
  assert.match(src, /booking-speed-promise/);
});

test('portal empty state is premium and guiding', () => {
  const src = read('../app/konto/page.tsx');
  assert.match(src, /PORTAL_EMPTY/);
  assert.match(src, /portal-no-offers/);
  assert.match(src, /portal-empty-cta-book/);
  assert.match(src, /whatsappHref/);
});

test('danke page supports variants and is noindex', () => {
  const src = read('../app/danke/page.tsx');
  assert.match(src, /danke-page/);
  assert.match(src, /noIndex:\s*true/);
  assert.match(src, /lead_magnet/);
  assert.match(src, /thank-you-page/);
});

test('company exports WhatsApp deep link', () => {
  const src = read('../lib/company.ts');
  assert.match(src, /whatsappHref/);
  assert.match(src, /wa\.me\/31613318856/);
});

test('mail confirmation includes delight next steps', () => {
  const src = read('../lib/mail.ts');
  assert.match(src, /customerDelightHtml/);
  assert.match(src, /Werktags/);
  assert.match(src, /\/danke\?variant=/);
});
