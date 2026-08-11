// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/[...path]/route.ts
// NIR: 02.08.2026 06:45
// UPDATED: 02.08.2026 06:45
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Catch-all API proxy for auth/chat and other backend-only paths
// WHY: Missing local routes + invalid BACKEND_ORIGIN rewrite produced DNS_HOSTNAME_EMPTY 502
// BEST-PRACTICE: Specific app/api/*/route.ts handlers take precedence; this catches the rest
// PITFALL: V-XX: never rewrite to empty hostname; return honest JSON 503 when backend unset
// DEPENDS: lib/backend.ts proxyRequest, BACKEND_ORIGIN
// DOCS-REF: apps/website/.env.example
// SESSION: website-nav-chat-login-fix

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const segments = path ?? [];
  const url = new URL(request.url);
  const backendPath = `/api/${segments.map(encodeURIComponent).join("/")}${url.search}`;

  try {
    const upstream = await proxyRequest(backendPath, request);
    if (upstream) return upstream;
  } catch {
    return NextResponse.json(
      {
        detail:
          "Backend vorübergehend nicht erreichbar. Bitte später erneut versuchen oder mail@nexifyai.cloud kontaktieren.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      detail:
        "API-Backend ist nicht konfiguriert (BACKEND_ORIGIN). Login, Chat und Portal benötigen das FastAPI-Backend.",
    },
    { status: 503 },
  );
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
