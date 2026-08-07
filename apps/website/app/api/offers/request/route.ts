// /api/offers/request — Proxy zum Backend (api.nexifyai.cloud) mit Resend-Fallback
// UPDATED: 07.08.2026 — Resend-Fallback analog /api/contact (Lead-Sicherung bei Proxy-Ausfall)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

import { NextResponse } from "next/server";
import { resendConfigured, sendOfferRequestNotification } from "@/lib/mail";

const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.nexifyai.cloud") + "/api/offers/request";

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    company?: string | null;
    phone?: string | null;
    language?: string;
    description?: string;
    session_id?: string;
    features?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ error: "Bitte E-Mail-Adresse angeben." }, { status: 400 });
  }

  const payload = {
    name: body.name,
    email: body.email,
    company: body.company,
    phone: body.phone,
    language: body.language,
    description: body.description,
    session_id: body.session_id,
    features: body.features,
  };

  try {
    const res = await fetch(BACKEND, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    // 4xx vom Backend (Validierung) — durchreichen, kein Fallback
    if (res.status < 500) {
      return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    // Netzwerk-/Proxy-Fehler → Resend-Fallback
  }

  if (resendConfigured()) {
    try {
      const ok = await sendOfferRequestNotification(payload);
      if (ok) return NextResponse.json({ ok: true, channel: "resend" });
    } catch {
      // fall through
    }
  }

  return NextResponse.json(
    { error: "Angebotsversand ist derzeit nicht verfügbar. Bitte per E-Mail an mail@nexifyai.cloud schreiben." },
    { status: 502 },
  );
}
