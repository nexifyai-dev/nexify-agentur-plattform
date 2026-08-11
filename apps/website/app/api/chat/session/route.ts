// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/api/chat/session/route.ts
// NIR: 02.08.2026 06:45
// UPDATED: 02.08.2026 06:45
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Chat session create — proxy backend or local UUID fallback
// WHY: Without a local route, rewrite hit empty BACKEND_ORIGIN → DNS_HOSTNAME_EMPTY
// BEST-PRACTICE: Prefer FastAPI when configured; local session id keeps UI usable offline
// PITFALL: V-XX: client expects { session_id: string }
// DEPENDS: lib/backend.ts
// DOCS-REF: backend/server.py create_session
// SESSION: website-nav-chat-login-fix

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { language?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  try {
    const upstream = await proxyPost("/api/chat/session", body);
    if (upstream) return upstream;
  } catch {
    // fall through to local session
  }

  return NextResponse.json({
    session_id: randomUUID(),
    language: body.language ?? "de",
    estimate: "local",
  });
}
