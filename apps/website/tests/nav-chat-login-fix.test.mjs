import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8');

test('globals.css must not force header to position:relative (breaks fixed nav)', () => {
  const css = read('../app/globals.css');
  assert.doesNotMatch(
    css,
    /main,\s*header,\s*footer\s*\{\s*position:\s*relative/s,
    'header must stay fixed via Tailwind / explicit site-header rule'
  );
  assert.match(css, /header\[data-testid="site-header"\]\s*\{\s*position:\s*fixed/);
});

test('cookie banner uses pointer-events-none shell so footer links stay clickable', () => {
  const src = read('../components/cookie-consent.tsx');
  assert.match(src, /pointer-events-none fixed inset-x-0 bottom-0/);
  assert.match(src, /pointer-events-auto mx-auto max-w-2xl/);
});

test('next.config validates BACKEND_ORIGIN before adding /api rewrite', () => {
  const src = read('../next.config.ts');
  assert.match(src, /Boolean\(u\.hostname\)/);
  assert.match(src, /DNS_HOSTNAME_EMPTY/);
});

test('chat session + chat routes exist as local handlers', () => {
  const session = read('../app/api/chat/session/route.ts');
  const chat = read('../app/api/chat/route.ts');
  assert.match(session, /session_id/);
  assert.match(chat, /text\/event-stream/);
  assert.match(chat, /localAdvice|estimate: "local"|type: "delta"/);
});

test('catch-all API proxy returns honest 503 when backend unset', () => {
  const src = read('../app/api/[...path]/route.ts');
  assert.match(src, /proxyRequest/);
  assert.match(src, /status: 503/);
  assert.match(src, /BACKEND_ORIGIN/);
});

test('service worker never caches HTML navigations or /api', () => {
  const sw = read('../public/sw.js');
  assert.match(sw, /nexify-v2/);
  assert.match(sw, /mode === "navigate"/);
  assert.match(sw, /pathname\.startsWith\("\/api"\)/);
  assert.doesNotMatch(sw, /caches\.put\(e\.request.*navigate/s);
});

test('pageMetadata exposes hreflang language alternates', () => {
  const src = read('../lib/seo.ts');
  assert.match(src, /languages:\s*\{/);
  assert.match(src, /"x-default"/);
});

test('login and register layouts are noindex', () => {
  const login = read('../app/login/layout.tsx');
  const reg = read('../app/registrieren/layout.tsx');
  assert.match(login, /index:\s*false/);
  assert.match(reg, /index:\s*false/);
});

test('contact and offers use Resend fallback helpers', () => {
  assert.match(read('../lib/mail.ts'), /resendConfigured/);
  assert.match(read('../lib/mail.ts'), /sendContactNotification/);
  assert.match(read('../app/api/contact/route.ts'), /sendContactNotification/);
  assert.match(read('../app/api/offers/request/route.ts'), /sendOfferRequestNotification/);
});

test('booking slots returns empty array fallback without inventing appointments', () => {
  const slots = read('../app/api/booking/slots/route.ts');
  const book = read('../app/api/booking/book/route.ts');
  assert.match(slots, /NextResponse\.json\(\[\]\)/);
  assert.match(book, /status: 503/);
});

test('auth register route exists for /registrieren', () => {
  assert.match(read('../app/api/auth/register/route.ts'), /\/api\/auth\/register/);
});
