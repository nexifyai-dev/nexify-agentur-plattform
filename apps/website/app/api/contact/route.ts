// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/contact/route.ts
// NIR: 02.08.2026 06:55
// UPDATED: 02.08.2026 10:40
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Contact form API — FastAPI proxy, then Resend fallback
// WHY: Live returned 502 when BACKEND_ORIGIN proxy failed; leads must still reach inbox when possible
// BEST-PRACTICE: Prefer backend; Resend only with RESEND_API_KEY; never fake success
// PITFALL: V-XX: DNS_HOSTNAME_EMPTY rewrite must not shadow this filesystem route
// DEPENDS: lib/backend.ts, lib/mail.ts, RESEND_API_KEY
// DOCS-REF: apps/website/.env.example
// SESSION: website-ops-fix

import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";
import { resendConfigured, sendContactNotification } from "@/lib/mail";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    company?: string | null;
    phone?: string | null;
    language?: string;
    type?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.email || !body.message) {
    return NextResponse.json(
      { error: "Bitte E-Mail-Adresse und Nachricht angeben." },
      { status: 400 },
    );
  }

  const payload = {
    name: body.name,
    email: body.email,
    message: body.message,
    company: body.company,
    phone: body.phone,
    language: body.language,
    type: body.type,
  };

  try {
    const upstream = await proxyPost("/api/contact", payload);
    if (upstream) {
      if (upstream.ok) return upstream;
      // 4xx from backend (validation) — pass through
      if (upstream.status < 500) return upstream;
    }
  } catch {
    // fall through to Resend / honest error
  }

  if (resendConfigured()) {
    try {
      const ok = await sendContactNotification(payload);
      if (ok) return NextResponse.json({ ok: true, channel: "resend" });
    } catch {
      // fall through
    }
  }

  return NextResponse.json(
    {
      error:
        "Kontaktversand ist derzeit nicht verfügbar. Bitte per E-Mail an mail@nexifyai.cloud schreiben.",
    },
    { status: 503 },
  );
}
