// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/auth/me/route.ts
// NIR: 02.08.2026 06:50
// UPDATED: 02.08.2026 06:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Auth session probe — proxy GET /api/auth/me
// WHY: AuthProvider calls this on every page load; must not 502 via broken rewrite
// BEST-PRACTICE: Dedicated route; 401 when unauthenticated is expected
// PITFALL: V-XX: return JSON never HTML DNS errors
// DEPENDS: lib/backend.ts proxyRequest
// DOCS-REF: backend/portal.py get me
// SESSION: website-nav-chat-login-fix

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const upstream = await proxyRequest("/api/auth/me", request);
    if (upstream) return upstream;
  } catch {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
}
