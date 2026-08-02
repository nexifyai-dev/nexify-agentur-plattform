// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/auth/me/route.ts
// NIR: 02.08.2026 06:50
// UPDATED: 02.08.2026 11:15
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Auth session probe — proxy GET /api/auth/me
// WHY: AuthProvider calls this on every page load; must not 502 via broken rewrite
// BEST-PRACTICE: Dedicated route; anonymous visitors get 200 {} (no 401 console noise)
// PITFALL: V-AUTH-01: never 401 when Cookie header lacks access/refresh tokens
// DEPENDS: lib/backend.ts proxyRequest
// DOCS-REF: backend/portal.py get me
// SESSION: pagespeed-cls-lcp-llms-7dd5

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function hasSessionCookie(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return /(?:^|;\s*)(?:access_token|refresh_token)=/.test(cookie);
}

export async function GET(request: Request) {
  if (!hasSessionCookie(request)) {
    return NextResponse.json({}, { status: 200 });
  }
  try {
    const upstream = await proxyRequest("/api/auth/me", request);
    if (upstream) return upstream;
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
  return NextResponse.json({}, { status: 200 });
}
