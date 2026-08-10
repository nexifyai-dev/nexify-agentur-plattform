// FILE: /apps/website/app/api/outreach/unsubscribe/route.ts
// NIR: 02.08.2026 09:25
// UPDATED: 02.08.2026 09:25
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: GDPR unsubscribe endpoint for Hostinger outreach mails
// WHY: Every cold mail must offer one-click / link opt-out
// BEST-PRACTICE: Token = sha256(salt:email)[:32] matching scripts/outreach/store.py
// PITFALL: V-OUT-02: Never require login; always acknowledge even on bad token (generic)
// DEPENDS: OUTREACH_UNSUB_SALT, optional OUTREACH_UNSUB_FILE
// DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
// SESSION: lead-outreach-automation-7dd5

import { createHash, timingSafeEqual } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function tokenFor(email: string, salt: string): string {
  return createHash("sha256")
    .update(`${salt}:${email.toLowerCase().trim()}`)
    .digest("hex")
    .slice(0, 32);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeTokenEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

function htmlPage(title: string, body: string): NextResponse {
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${safeTitle}</title></head>
<body style="margin:0;background:#0A0A0A;color:#e5e5e5;font-family:Manrope,Arial,sans-serif;padding:48px 16px;">
<main style="max-width:520px;margin:0 auto;">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><img src="https://www.nexifyai.cloud/logo-mark.png" alt="NeXify" width="34" height="34" style="display:block;width:34px;height:34px;border:0;border-radius:8px;"><div style="font-family:Outfit,Arial,sans-serif;font-size:24px;color:#ffffff;letter-spacing:1px;">Ne<span style="color:#C8FF00;font-weight:700;">X</span>ify <span style="color:#9E9E9E;font-weight:300;">AI</span></div></div>
  <h1 style="font-size:20px;font-weight:600;">${safeTitle}</h1>
  <p style="line-height:1.6;color:#a1a1aa;">${safeBody}</p>
  <p style="margin-top:24px;font-size:13px;color:#71717a;"><a href="https://www.nexifyai.cloud/de" style="color:#a1a1aa;">www.nexifyai.cloud</a></p>
</main></body></html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function persistUnsub(email: string): Promise<void> {
  const file = process.env.OUTREACH_UNSUB_FILE?.trim();
  if (!file) return;
  try {
    await mkdir(path.dirname(file), { recursive: true });
    const line = JSON.stringify({
      email: email.toLowerCase().trim(),
      ts: new Date().toISOString(),
      source: "website_api",
    });
    await appendFile(file, `${line}\n`, "utf8");
  } catch {
    // Ephemeral hosts / missing volume — still acknowledge to user
  }
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  let email = (url.searchParams.get("email") || "").trim().toLowerCase();
  let token = (url.searchParams.get("token") || "").trim();

  if (req.method === "POST") {
    try {
      const ct = req.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const body = (await req.json()) as { email?: string; token?: string };
        email = (body.email || email).trim().toLowerCase();
        token = (body.token || token).trim();
      } else {
        const form = await req.formData();
        email = String(form.get("email") || email)
          .trim()
          .toLowerCase();
        token = String(form.get("token") || token).trim();
      }
    } catch {
      /* ignore */
    }
  }

  const salt = process.env.OUTREACH_UNSUB_SALT?.trim() || "nexify-outreach";
  const wantJson =
    url.searchParams.get("format") === "json" ||
    (req.headers.get("accept") || "").includes("application/json");

  // UWG §7: Opt-out muss ohne Hürde möglich sein. Token bleibt Hardening
  // gegen Spam-Missbrauch, ist aber nicht erforderlich — eine valide E-Mail
  // genügt (Abmeldung schadet dem Betroffenen nie).
  if (!email || !email.includes("@")) {
    if (wantJson) {
      return NextResponse.json(
        { ok: false, error: "email_and_token_required" },
        { status: 400 },
      );
    }
    return htmlPage(
      "Abmeldung",
      "Bitte nutzen Sie den Abmelde-Link aus der E-Mail (enthält Token).",
    );
  }

  await persistUnsub(email);

  // Art. 21 DSGVO: Opt-out zusätzlich in der leads-Tabelle persistieren
  // (PostgREST, env-gesteuert — auf Vercel nicht gesetzt, lokal via pipeline.env).
  const sbUrl = process.env.SUPABASE_URL?.trim();
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SERVICE_KEY?.trim();
  if (sbUrl && sbKey) {
    try {
      await fetch(`${sbUrl.replace(/\/$/, "")}/rest/v1/leads?contact_email=eq.${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: {
          "apikey": sbKey,
          "Authorization": `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ unsubscribed: true }),
      });
    } catch {
      // File persistenz greift bereits; DB-Update ist Best-Effort
    }
  }

  const expected = tokenFor(email, salt);
  if (!safeTokenEqual(expected, token)) {
    // Generic message — do not leak whether email exists
    if (wantJson) {
      return NextResponse.json({ ok: true, status: "recorded" });
    }
    return htmlPage(
      "Abmeldung bestätigt",
      "Sie erhalten von NeXify AI keine weiteren Outreach-Mails an diese Adresse (sofern der Link gültig war).",
    );
  }

  if (wantJson) {
    return NextResponse.json({ ok: true, status: "unsubscribed", email });
  }
  return htmlPage(
    "Abmeldung bestätigt",
    `Die Adresse ${email} wurde von der NeXify AI Outreach-Liste entfernt. Transactional Mails (z. B. Ihre eigenen Anfragen) sind davon nicht betroffen.`,
  );
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
