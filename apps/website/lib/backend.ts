// Server-side proxy helper for the API routes.
//
// The three form endpoints (contact, offers, planner) must forward to the real
// FastAPI backend (backend/server.py, exposed at api.nexifyai.cloud) so leads are
// actually persisted and emailed. Previously these routes echoed a fake success
// response and silently dropped every submission.
//
// Resolution order: BACKEND_ORIGIN (server-only) → NEXT_PUBLIC_BACKEND_URL (also
// used client-side). Returns null when neither is configured so the caller can
// decide between an honest error and a local fallback.

export function backendBaseUrl(): string | null {
  const base = process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) return null;
  return base.replace(/\/$/, "");
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
    // Pass the backend's status + JSON straight through.
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
