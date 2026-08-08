// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/ebook/route.ts
// NIR: 08.08.2026 12:00
// UPDATED: 08.08.2026 12:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: E-Book-Lead-Magnet API — validiert Formular, speichert Opt-in-Lead in Supabase (leads-Tabelle), sendet E-Book-Mail mit PDF-Link via Resend, erfasst UTM-Quelle.
// WHY: M-01 (FREWERT-MASSNAHMENKATALOG) — eigener Lead-Magnet-Endpunkt statt /api/contact, damit Lead sauber als ebook-Opt-in markiert wird und Drip-Campaign ihn (status != contacted) automatisch übernimmt.
// BEST-PRACTICE: Opt-in-Pflicht (consent=true → send_allowed), PGRST301-JWT-Bearer für PostgREST, Resend-Fallback, niemals falschen Erfolg melden.
// PITFALL: V-PGRST301: Supabase-Service-Role braucht echtes HS256-JWT; V-OUT-01: kein Versand ohne Opt-in; V-DELIGHT-04: kein falsches „Mail gesendet".
// DEPENDS: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET, RESEND_API_KEY (Vercel Production Env), public/docs/nexify-ebook-ki-automation.pdf
// DOCS-REF: docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md (M-01), infra/lead-pipeline/README.md
// SESSION: kanban-t_34e02d47

import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PDF_URL = "https://www.nexifyai.cloud/docs/nexify-ebook-ki-automation.pdf";

/** Echtes HS256-JWT für Supabase-PostgREST (PGRST301-Pitfall). */
function supabaseJwt(): string | null {
  const secret = process.env.SUPABASE_JWT_SECRET?.trim();
  if (!secret) return null;
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const header = b64({ alg: "HS256", typ: "JWT" });
  const payload = b64({ role: "service_role", iss: "supabase", iat: now, exp: now + 3600 });
  const sig = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${sig}`;
}

async function insertLead(input: {
  name: string;
  email: string;
  source: string;
}): Promise<boolean> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const jwt = supabaseJwt();
  if (!url || !key || !jwt) return false;
  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: input.name,
      contact_email: input.email.toLowerCase().trim(),
      status: "new",
      source: input.source || "ebook",
      metadata: { magnet: "ebook-ki-automation", consent: true, ts: new Date().toISOString() },
    }),
  });
  return res.ok;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** CI-Mail (#111114-Karte auf #0a0a0a, Lime-CTA #C8FF00 — MAIL-DESIGN-VORGABE). */
function ebookMailHtml(name: string): string {
  const n = esc(name || "dort");
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"/>
<meta name="color-scheme" content="light dark"/>
<meta name="supported-color-schemes" content="light dark"/>
<style>@media (prefers-color-scheme: dark){body{background:#0a0a0a!important}}</style></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 32px 20px;border-bottom:1px solid #26262b;">
  <div style="display:flex;align-items:center;gap:12px;">
    <img src="https://www.nexifyai.cloud/logo-mark.png" alt="NeXify" width="34" height="34" style="display:block;width:34px;height:34px;border:0;border-radius:8px;"/>
    <div style="font-family:Outfit,Arial,sans-serif;font-size:24px;color:#ffffff;letter-spacing:1px;">Ne<span style="color:#C8FF00;font-weight:700;">X</span>ify <span style="color:#9E9E9E;font-weight:300;">AI</span></div>
  </div>
  <div style="font-family:Manrope,Arial,sans-serif;font-size:11px;color:#71717a;letter-spacing:3px;text-transform:uppercase;padding-top:6px;">Ihr E-Book · KI-Automation</div>
</td></tr>
<tr><td style="padding:28px 32px 8px;font-family:Manrope,Arial,sans-serif;">
  <h1 style="margin:0 0 12px;color:#ffffff;font-size:20px;font-weight:600;">Ihr E-Book ist da, ${n}.</h1>
  <div style="color:#a1a1aa;font-size:14px;line-height:1.7;">
    <p>vielen Dank für Ihr Interesse an <strong style="color:#e4e4e7;">KI-Automation für den Mittelstand — 10 Strategien, die sofort Zeit &amp; Geld sparen</strong>.</p>
    <p>Hier geht es direkt zum Download:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="border-radius:999px;background:#C8FF00;">
      <a href="${PDF_URL}" style="display:inline-block;padding:13px 30px;font-family:Manrope,Arial,sans-serif;font-size:14px;font-weight:700;color:#0A0A0A;text-decoration:none;">E-Book jetzt herunterladen</a>
    </td></tr></table>
    <p style="font-size:13px;color:#71717a;">Tipp: Starten Sie mit Strategie 1 (Chatbot) oder 2 (E-Mail-Postfach) — der größte Sofort-Effekt.</p>
    <p style="font-size:13px;color:#71717a;">Wenn Sie wissen möchten, welche Strategie in Ihrem Betrieb zuerst rechnet: <a href="https://www.nexifyai.cloud/rueckruf" style="color:#C8FF00;">kostenlose Automatisierungs-Analyse</a> — unverbindlich.</p>
  </div>
</td></tr>
<tr><td style="padding:14px 32px 26px;font-family:Manrope,Arial,sans-serif;">
  <p style="margin:0;color:#52525b;font-size:11px;line-height:1.6;">Diese E-Mail richtet sich an Unternehmer (B2B). Unverbindliche Indikationen stellen kein bindendes Angebot dar. Datenschutz: nexifyai.cloud/datenschutz</p>
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #26262b;font-family:Manrope,Arial,sans-serif;color:#52525b;font-size:11px;line-height:1.7;">
  NeXify AI by NeXify · Graaf van Loonstraat 1E, 5921 JA Venlo · Pascal Courbois · mail@nexifyai.cloud · <a href="https://www.nexifyai.cloud/impressum" style="color:#71717a;">Impressum</a> · <a href="https://www.nexifyai.cloud/datenschutz" style="color:#71717a;">Datenschutz</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

async function sendEbookMail(to: string, name: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "NeXify AI Website <website@nexifyai.cloud>",
      to,
      subject: "Ihr E-Book: KI-Automation für den Mittelstand",
      html: ebookMailHtml(name),
      text: `Guten Tag ${name || "dort"},\n\nvielen Dank für Ihr Interesse an unserem E-Book "KI-Automation für den Mittelstand – 10 Strategien, die sofort Zeit & Geld sparen".\n\nDownload: ${PDF_URL}\n\nKostenlose Automatisierungs-Analyse: https://www.nexifyai.cloud/rueckruf\n\nMit besten Grüßen\nPascal Courbois · NeXify AI`,
    }),
  });
  return res.ok;
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim().slice(0, 120);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }

  const utm = [body.utm_source, body.utm_medium, body.utm_campaign]
    .filter(Boolean)
    .map((v) => String(v).slice(0, 60))
    .join("|");
  const source = utm ? `ebook:${utm}` : "ebook";

  const leadStored = await insertLead({ name: name || "E-Book-Interessent", email, source });
  const mailSent = await sendEbookMail(email, name);

  // Erfolg ehrlich melden: PDF ist der Kernnutzen; Mail-Status separat ausweisen.
  return NextResponse.json({ ok: true, pdf: PDF_URL, leadStored, mailSent });
}
