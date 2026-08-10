// FILE: apps/website/components/vercel-insights.tsx
// UPDATED: 10.08.2026 09:13
// WHAT: Vercel Analytics + Speed Insights instrumentation with private-route filtering
// WHY: Customer-facing UX metrics must not be polluted by internal admin/account sessions
// BEST-PRACTICE: Keep instrumentation active globally, but return null for private paths before sending
// DEPENDS: @vercel/analytics, @vercel/speed-insights

"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const PRIVATE_ROUTE_PREFIXES = ["/admin", "/konto", "/login", "/registrieren", "/api"] as const;

function isPrivateUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname;
    return PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  } catch {
    return true;
  }
}

export function beforeSendPublicOnly<T extends { url: string }>(event: T): T | null {
  return isPrivateUrl(event.url) ? null : event;
}

export function VercelInsights() {
  return (
    <>
      <Analytics beforeSend={(event: BeforeSendEvent) => beforeSendPublicOnly(event)} />
      <SpeedInsights beforeSend={beforeSendPublicOnly} />
    </>
  );
}
