// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/offers/request/route.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 06:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Offer request API — FastAPI proxy, then Resend notification fallback
// WHY: Live 502 when backend rewrite/proxy failed; chat/planner offer flow depends on this
// BEST-PRACTICE: Prefer backend (PDF + DB); Resend notifies ops so leads are not dropped
// PITFALL: V-XX: Resend fallback does not generate PDF — honest ok without claiming PDF sent
// DEPENDS: lib/backend.ts, lib/mail.ts
// DOCS-REF: backend/server.py offers
// SESSION: website-ops-fix

import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";
import { resendConfigured, sendOfferRequestNotification } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    company?: string | null;
    phone?: string | null;
    type?: string;
    description?: string;
    features?: string[];
    language?: string;
    session_id?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json(
      { error: "Bitte eine E-Mail-Adresse angeben, damit das Angebot zugestellt werden kann." },
      { status: 400 },
    );
  }

  const payload = {
    name: body.name,
    email: body.email,
    company: body.company,
    phone: body.phone,
    type: body.type,
    description: body.description,
    features: body.features,
    language: body.language,
    session_id: body.session_id,
  };

  try {
    const upstream = await proxyPost("/api/offers/request", payload);
    if (upstream) {
      if (upstream.ok) return upstream;
      if (upstream.status < 500) return upstream;
    }
  } catch {
    // fall through
  }

  if (resendConfigured()) {
    try {
      const ok = await sendOfferRequestNotification(payload);
      if (ok) {
        return NextResponse.json({
          ok: true,
          channel: "resend",
          email_sent: false,
          message:
            "Ihre Anfrage wurde entgegengenommen. Das PDF-Angebot folgt, sobald das Backend wieder erreichbar ist — Pascal meldet sich persönlich.",
        });
      }
    } catch {
      // fall through
    }
  }

  return NextResponse.json(
    {
      error:
        "Angebotsanfrage ist derzeit nicht verfügbar. Bitte per E-Mail an mail@nexifyai.cloud schreiben.",
    },
    { status: 503 },
  );
}
