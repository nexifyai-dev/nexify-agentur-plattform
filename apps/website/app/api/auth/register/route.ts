// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/auth/register/route.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 06:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Customer registration proxy
// WHY: /registrieren called /api/auth/register which hit DNS_HOSTNAME_EMPTY rewrite
// BEST-PRACTICE: Dedicated route + cookie rewrite via proxyRequest
// PITFALL: V-XX: registration requires FastAPI + DB — honest 503 without backend
// DEPENDS: lib/backend.ts
// DOCS-REF: backend/portal.py register
// SESSION: website-ops-fix

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
      "/api/auth/register",
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
          "Registrierung derzeit nicht möglich: Backend nicht erreichbar. Bitte später erneut versuchen.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      detail:
        "Registrierung nicht konfiguriert (BACKEND_ORIGIN). Bitte Operator — FastAPI-Portal muss online sein.",
    },
    { status: 503 },
  );
}
