// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/booking/slots/route.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Callback slot list — proxy FastAPI or empty list fallback
// WHY: Live /api/booking/slots → 500 when DB down; UI already handles empty slots
// BEST-PRACTICE: Never invent fake appointments; empty [] → contact CTA on /rueckruf
// PITFALL: V-XX: must return JSON array, not pass through upstream 5xx text
// DEPENDS: lib/backend.ts
// DOCS-REF: backend/booking.py
// SESSION: fix-booking-slots-500

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const upstream = await proxyRequest("/api/booking/slots", request);
    // Only forward successful JSON lists — 5xx would break /rueckruf conversion UI
    if (upstream && upstream.ok) return upstream;
  } catch {
    // fall through
  }
  // Honest empty calendar — page shows contact alternative
  return NextResponse.json([]);
}
