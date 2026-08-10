// FILE: apps/website/app/webhooks/meta/route.ts
// UPDATED: 10.08.2026 08:18
// WHAT: Public Meta webhook bridge to FastAPI signature-validated handler
// WHY: Meta callback URLs hit the Vercel website domain; FastAPI owns verify-token and HMAC validation
// DEPENDS: lib/webhook-proxy.ts, backend /webhooks/meta

import { proxyWebhook } from "@/lib/webhook-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const META_WEBHOOK_PATH = "/webhooks/meta";

export function GET(request: Request) {
  return proxyWebhook(request, META_WEBHOOK_PATH);
}

export function POST(request: Request) {
  return proxyWebhook(request, META_WEBHOOK_PATH);
}
