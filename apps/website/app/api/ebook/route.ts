// FILE: /root/nexify-agentur-plattform/apps/website/app/api/ebook/route.ts
// NIR: 08.08.2026 16:00
// UPDATED: 08.08.2026 16:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: E-Book-Lead-Magnet API — proxy an Backend /api/ebook (FastAPI :8901), das den
//       Opt-in-Lead in die Drip-Tabelle `leads` + `nexify_leads` schreibt und die
//       E-Book-Mail via Resend/SMTP sendet. UTM wird durchgereicht.
// WHY: Die frühere Lambda-eigene Supabase-Logik gab 500, weil SUPABASE_URL
//       auf 127.0.0.1:8000 zeigt (nur vom VPS erreichbar) und JWT_SECRET leer war.
//       Das Backend läuft auf dem VPS mit Zugriff auf den lokalen Supabase-Kong.
// BEST-PRACTICE: Opt-in-Pflicht (consent=true → Drip-Status new), ehrlicher Fehler
//       bei Backend-Ausfall (503 statt Fake-Erfolg).
// PITFALL: V-PGRST301 (Service-Role-JWT), V-OUT-01 (kein Versand ohne Opt-in),
//          V-DELIGHT-04 (kein falsches „Mail gesendet").
// DEPENDS: BACKEND_ORIGIN (Prod Env), backend server.py + ebook_endpoint.py
// DOCS-REF: docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md (M-01)
// SESSION: kanban-t_34e02d47

import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }

  const payload = {
    name: (body.name || "").trim().slice(0, 120),
    email,
    utm_source: (body.utm_source || "").slice(0, 60),
    utm_medium: (body.utm_medium || "").slice(0, 60),
    utm_campaign: (body.utm_campaign || "").slice(0, 60),
  };

  try {
    const upstream = await proxyPost("/api/ebook", payload);
    if (upstream) {
      if (upstream.ok) return upstream;
      if (upstream.status < 500) return upstream;
    }
  } catch {
    // fall through → ehrlicher 503
  }

  return NextResponse.json(
    {
      error:
        "E-Book-Versand ist derzeit nicht verfügbar. Bitte laden Sie das E-Book direkt: /docs/nexify-ebook-ki-automation.pdf",
      pdf: "https://www.nexifyai.cloud/docs/nexify-ebook-ki-automation.pdf",
    },
    { status: 503 },
  );
}
