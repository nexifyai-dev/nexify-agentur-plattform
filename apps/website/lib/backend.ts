// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/lib/backend.ts
// NIR: 02.08.2026 06:45
// UPDATED: 02.08.2026 08:15
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Server-side backend URL resolution and request proxy helpers
// WHY: Vercel rewrites with empty/invalid BACKEND_ORIGIN caused DNS_HOSTNAME_EMPTY (502) for auth/chat
// BEST-PRACTICE: Validate URL hostname before any rewrite/proxy; forward cookies for auth; stream SSE
// PITFALL: V-XX: truthy-but-empty BACKEND_ORIGIN (e.g. "https://") must be rejected;
//          re-streaming upstream.body for JSON through Next/Vercel can yield HTTP 200 with empty body
//          for /api/auth/me and /api/auth/refresh — buffer non-SSE responses instead
// DEPENDS: BACKEND_ORIGIN, NEXT_PUBLIC_BACKEND_URL
// DOCS-REF: apps/website/.env.example
// SESSION: fix-auth-me-empty-body

// Server-side proxy helper for the API routes.
//
// Form endpoints (contact, offers, planner) and the catch-all auth/chat proxy
// forward to the FastAPI backend when a valid origin is configured.
//
// Resolution order: BACKEND_ORIGIN (server-only) → NEXT_PUBLIC_BACKEND_URL.
// Returns null when neither is a usable absolute URL so callers can fail
// honestly instead of producing Vercel DNS_HOSTNAME_EMPTY 502s.

function isUsableOrigin(raw: string): boolean {
  try {
    const u = new URL(raw);
    return Boolean(u.protocol === "http:" || u.protocol === "https:") && Boolean(u.hostname);
  } catch {
    return false;
  }
}

export function backendBaseUrl(): string | null {
  const base = (process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_BACKEND_URL || "").trim();
  if (!base || !isUsableOrigin(base)) return null;
  return base.replace(/\/$/, "");
}

/** True when a rewrite/proxy target is safe (hostname present). Used by next.config. */
export function isValidBackendOrigin(raw: string | undefined | null): boolean {
  if (!raw) return false;
  return isUsableOrigin(raw.trim());
}

/**
 * Forward a JSON POST to the backend and return its response verbatim.
 * Returns null if no backend is configured (caller handles the fallback).
 * Throws on network/timeout so the caller can surface an honest error.
 */
export async function proxyPost(path: string, body: unknown): Promise<Response | null> {
  const base = backendBaseUrl();
  if (!base) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const upstream = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } finally {
    clearTimeout(timeout);
  }
}

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
  // Let undici negotiate/decompress; re-forwarding accept-encoding can yield
  // content-encoding mismatches when we re-emit the body through Next/Vercel.
  "accept-encoding",
]);

const RESPONSE_STRIP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
  "set-cookie",
]);

/**
 * Full request proxy (auth cookies + SSE streaming). Returns null when no
 * backend is configured. Caller must return an honest 503 in that case.
 */
export async function proxyRequest(pathWithQuery: string, request: Request): Promise<Response | null> {
  const base = backendBaseUrl();
  if (!base) return null;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  const method = request.method.toUpperCase();
  const init: RequestInit = {
    method,
    headers,
    cache: "no-store",
    redirect: "manual",
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(`${base}${pathWithQuery}`, init);
  const outHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (RESPONSE_STRIP.has(lower)) return;
    outHeaders.set(key, value);
  });
  // Node/undici exposes multiple Set-Cookie via getSetCookie().
  // Strip upstream Domain= so the browser binds the cookie to www.nexifyai.cloud
  // (host-only) when we proxy — avoids Domain=api.* cookies that never stick.
  const rewriteCookie = (c: string) => c.replace(/;\s*Domain=[^;]*/gi, "");
  const getSetCookie = (upstream.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const cookies = typeof getSetCookie === "function" ? getSetCookie.call(upstream.headers) : [];
  if (cookies.length > 0) {
    for (const c of cookies) outHeaders.append("set-cookie", rewriteCookie(c));
  } else {
    const single = upstream.headers.get("set-cookie");
    if (single) outHeaders.append("set-cookie", rewriteCookie(single));
  }

  const contentType = (upstream.headers.get("content-type") || "").toLowerCase();
  const isEventStream = contentType.includes("text/event-stream");

  // SSE must stay streamed; JSON/auth responses are buffered so Next/Vercel
  // never emit HTTP 200 with an empty body (observed live on /api/auth/me).
  if (isEventStream) {
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: outHeaders,
    });
  }

  const buf = await upstream.arrayBuffer();
  outHeaders.set("content-length", String(buf.byteLength));
  return new Response(buf, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}
