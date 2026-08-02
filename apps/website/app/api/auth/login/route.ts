// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/auth/login/route.ts
// NIR: 02.08.2026 06:50
// UPDATED: 02.08.2026 06:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Explicit login proxy — forwards to FastAPI with Set-Cookie rewrite
// WHY: Production /api/auth/login hit broken BACKEND_ORIGIN rewrite (DNS_HOSTNAME_EMPTY 502)
// BEST-PRACTICE: Dedicated route (not only catch-all) so auth never depends on rewrite
// PITFALL: V-XX: credentials must never be logged; cookie Domain stripped for www host
// DEPENDS: lib/backend.ts proxyRequest, BACKEND_ORIGIN
// DOCS-REF: backend/portal.py login
// SESSION: website-nav-chat-login-fix

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Ungültige Anfrage" }, { status: 400 });
  }

  try {
    const upstream = await proxyRequest(
      "/api/auth/login",
      new Request(request.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify(body),
      }),
    );
    if (upstream) return upstream;
  } catch {
    return NextResponse.json(
      {
        detail:
          "Anmeldung fehlgeschlagen: Backend nicht erreichbar. Bitte später erneut versuchen oder mail@nexifyai.cloud kontaktieren.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      detail:
        "Anmeldung nicht möglich: API-Backend ist nicht konfiguriert (BACKEND_ORIGIN). Bitte Operator setzen.",
    },
    { status: 503 },
  );
}
