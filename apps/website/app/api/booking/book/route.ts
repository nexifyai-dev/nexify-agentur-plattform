// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/booking/book/route.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 06:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Callback booking — proxy FastAPI only (no fake bookings)
// WHY: Without backend, inventing slots would create false appointments
// BEST-PRACTICE: Proxy when available; otherwise clear 503 JSON for api() error UI
// PITFALL: V-XX: never confirm a booking without FastAPI persistence
// DEPENDS: lib/backend.ts
// DOCS-REF: backend/booking.py
// SESSION: website-ops-fix

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Ungültige Anfrage" }, { status: 400 });
  }

  try {
    const upstream = await proxyRequest(
      "/api/booking/book",
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
          "Terminbuchung derzeit nicht möglich (Backend offline). Bitte Kontaktformular oder mail@nexifyai.cloud nutzen.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      detail:
        "Terminbuchung nicht konfiguriert. Bitte über /kontakt anfragen oder mail@nexifyai.cloud schreiben.",
    },
    { status: 503 },
  );
}
