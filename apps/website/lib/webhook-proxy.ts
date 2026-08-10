// FILE: apps/website/lib/webhook-proxy.ts
// NIR: 10.08.2026 08:18
// UPDATED: 10.08.2026 08:18
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Server-side proxy bridge for public webhook callback URLs
// WHY: Public website (Host-VPS, Port 8880) receives provider callbacks while FastAPI owns validation and processing
// BEST-PRACTICE: Reject unsigned POST noise before proxying; backend still validates signed callbacks; never fake success
// PITFALL: V-WEBHOOK-01: Missing BACKEND_ORIGIN must return 503, not 200, so providers retry visibly
// DEPENDS: lib/backend.ts proxyRequest, BACKEND_ORIGIN
// DOCS-REF: backend/server.py /webhooks/meta; backend/channel_sync.py /api/webhooks/whatsapp
// SESSION: vercel-agent-webhook-bridge

import { NextResponse } from "next/server";
import { proxyRequest } from "@/lib/backend";

function hasWebhookSignature(request: Request): boolean {
  const signature = request.headers.get("x-hub-signature-256")?.trim();
  return Boolean(signature?.startsWith("sha256=") && signature.length > "sha256=".length);
}

export async function proxyWebhook(request: Request, backendPath: string) {
  if (request.method.toUpperCase() === "POST" && !hasWebhookSignature(request)) {
    return NextResponse.json(
      {
        detail:
          "Webhook-Signatur fehlt. Callback wurde vor der Backend-Weiterleitung abgewiesen.",
      },
      { status: 403 },
    );
  }

  const url = new URL(request.url);
  const pathWithQuery = `${backendPath}${url.search}`;

  try {
    const upstream = await proxyRequest(pathWithQuery, request);
    if (upstream) return upstream;
  } catch {
    return NextResponse.json(
      {
        detail:
          "Webhook-Backend ist vorübergehend nicht erreichbar. Die Signaturprüfung bleibt im Backend erzwungen.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      detail:
        "Webhook-Backend ist nicht konfiguriert (BACKEND_ORIGIN). Callback wurde nicht bestätigt.",
    },
    { status: 503 },
  );
}
