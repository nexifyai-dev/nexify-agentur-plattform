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
  assert.match(src, /pointer-events-auto mx-auto mb-\[4\.5rem\] max-w-2xl/);
});

test('next.config validates BACKEND_ORIGIN before adding /api rewrite', () => {
  const src = read('../next.config.ts');
  // Reale Validierung: new URL(origin) in try/catch, hostname-Pflicht, http(s)-Protokoll —
  // verhindert DNS_HOSTNAME_EMPTY-Rewrites (truthy-but-empty origin wie "https://").
  assert.match(src, /new URL\(origin\)/);
  assert.match(src, /Boolean\(u\.hostname\)/);
  assert.match(src, /u\.protocol === "http:" \|\| u\.protocol === "https:"/);
});

test('next.config disables standalone output on Vercel builds only', () => {
  const src = read('../next.config.ts');
  assert.match(src, /const isVercelBuild = process\.env\.VERCEL === "1" \|\| process\.env\.VERCEL === "true"/);
  assert.match(src, /output:\s*isVercelBuild \? undefined : "standalone"/);
});

test('chat session + chat routes exist as local handlers', () => {
  const session = read('../app/api/chat/session/route.ts');
  const chat = read('../app/api/chat/route.ts');
  assert.match(session, /session_id/);
  // Lokaler JSON-Handler (kein SSE): withButtons extrahiert [BTN:Label|/pfad] und
  // type: "plan" (Planner) bzw. type: "text" (direkter Chat) kennzeichnet das Antwortformat.
  assert.match(chat, /withButtons/);
  assert.match(chat, /type: "plan"/);
  assert.match(chat, /type: "text"/);
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
  assert.match(src, /\bde:/);
  assert.match(src, /"x-default"/);
  assert.match(src, /de \+ x-default are primary/);
});

test('login and register layouts are noindex', () => {
  const login = read('../app/login/layout.tsx');
  const reg = read('../app/registrieren/layout.tsx');
  assert.match(login, /index:\s*false/);
  assert.match(reg, /index:\s*false/);
});

test('chat planner uses same-origin planner route, not external backend fallback', () => {
  const chat = read('../app/api/chat/route.ts');
  assert.match(chat, /new URL\("\/api\/planner\/plan", requestUrl\)/);
  assert.doesNotMatch(chat, /NEXT_PUBLIC_BACKEND_URL \|\| "https:\/\/api\.nexifyai\.cloud"/);
});

test('chat AI router parsing rejects malformed JSON without raw-slice hacks', () => {
  const chat = read('../app/api/chat/route.ts');
  assert.match(chat, /async function readJsonResponse/);
  assert.match(chat, /JSON\.parse\(raw\)/);
  assert.match(chat, /chatCompletionText/);
  assert.doesNotMatch(chat, /raw\.slice\(0, raw\.lastIndexOf/);
});

test('root layout instruments Vercel Analytics and Speed Insights', () => {
  const layout = read('../app/layout.tsx');
  const pkg = read('../package.json');
  assert.match(layout, /import \{ Analytics \} from "@vercel\/analytics\/next"/);
  assert.match(layout, /import \{ SpeedInsights \} from "@vercel\/speed-insights\/next"/);
  assert.match(layout, /<Analytics \/>/);
  assert.match(layout, /<SpeedInsights \/>/);
  assert.match(pkg, /"@vercel\/analytics"/);
  assert.match(pkg, /"@vercel\/speed-insights"/);
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
  assert.match(slots, /upstream\.ok/);
  assert.match(book, /status: 503/);
});

test('auth register route exists for /registrieren', () => {
  assert.match(read('../app/api/auth/register/route.ts'), /\/api\/auth\/register/);
});

test('proxyRequest buffers non-SSE bodies (auth/me empty-body regression)', () => {
  const src = read('../lib/backend.ts');
  assert.match(src, /text\/event-stream/);
  assert.match(src, /arrayBuffer\(\)/);
  assert.match(src, /accept-encoding/);
  assert.match(src, /content-encoding/);
});

test('AuthProvider rejects empty {} session payloads', () => {
  const src = read('../lib/auth.tsx');
  assert.match(src, /empty session/);
  assert.match(src, /typeof me\.id === "string"/);
});
