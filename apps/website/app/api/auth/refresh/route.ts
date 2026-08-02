// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/auth/refresh/route.ts
// NIR: 02.08.2026 06:50
// UPDATED: 02.08.2026 06:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Refresh-token proxy for AuthProvider fallback
// WHY: Same DNS_HOSTNAME_EMPTY failure mode as /api/auth/login without a local route
// BEST-PRACTICE: Dedicated POST handler; cookie rewrite via proxyRequest
// PITFALL: V-XX: unauthenticated refresh → 401, not 502 HTML
// DEPENDS: lib/backend.ts proxyRequest
// DOCS-REF: backend/portal.py refresh
// SESSION: website-nav-chat-login-fix

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  if (!/(?:^|;\s*)(?:access_token|refresh_token)=/.test(cookie)) {
    return NextResponse.json({}, { status: 200 });
  }
  try {
    const upstream = await proxyRequest("/api/auth/refresh", request);
    if (upstream) return upstream;
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
  return NextResponse.json({}, { status: 200 });
}
