// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/booking/slots/route.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 06:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Callback slot list — proxy FastAPI or empty list fallback
// WHY: Live /api/booking/slots → DNS_HOSTNAME_EMPTY; UI already handles empty slots
// BEST-PRACTICE: Never invent fake appointments; empty [] → contact CTA on /rueckruf
// PITFALL: V-XX: must return JSON array, not HTML 502
// DEPENDS: lib/backend.ts
// DOCS-REF: backend/booking.py
// SESSION: website-ops-fix

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const upstream = await proxyRequest("/api/booking/slots", request);
    if (upstream) return upstream;
  } catch {
    // fall through
  }
  // Honest empty calendar — page shows contact alternative
  return NextResponse.json([]);
}
