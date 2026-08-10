// FILE: apps/website/app/WebHook/route.ts
// UPDATED: 10.08.2026 08:18
// WHAT: Case-variant webhook callback bridge to the canonical Meta webhook backend
// WHY: Production logs show POST /WebHook; valid provider retries should not be lost to case-only path drift
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
