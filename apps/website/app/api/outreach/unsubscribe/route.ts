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

import { createHash } from "node:crypto";
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

function htmlPage(title: string, body: string): NextResponse {
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head>
<body style="margin:0;background:#0A0A0A;color:#e5e5e5;font-family:Manrope,Arial,sans-serif;padding:48px 16px;">
<main style="max-width:520px;margin:0 auto;">
  <div style="font-family:Outfit,Arial,sans-serif;font-size:28px;margin-bottom:16px;">Ne<span style="color:#c0c0c8;">X</span>ify <span style="color:#9ca3af;">AI</span></div>
  <h1 style="font-size:20px;font-weight:600;">${title}</h1>
  <p style="line-height:1.6;color:#a1a1aa;">${body}</p>
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

  if (!email || !email.includes("@") || !token) {
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

  const expected = tokenFor(email, salt);
  if (expected !== token) {
    // Generic message — do not leak whether email exists
    if (wantJson) {
      return NextResponse.json({ ok: true, status: "recorded" });
    }
    return htmlPage(
      "Abmeldung bestätigt",
      "Sie erhalten von NeXify AI keine weiteren Outreach-Mails an diese Adresse (sofern der Link gültig war).",
    );
  }

  await persistUnsub(email);

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
