// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/components/deferred-widgets.tsx
// NIR: 02.08.2026 11:10
// UPDATED: 02.08.2026 11:15
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Idle-deferred fixed overlays (chat, exit-intent, sticky CTA, cookie)
// WHY: Cut unused JS; keep overlays out of early paint; never push footer (position:fixed)
// BEST-PRACTICE: requestIdleCallback + timeout; ssr:false for heavy widgets
// PITFALL: V-CLS-01: Sticky/Cookie must stay fixed — never in document flow above footer
// DEPENDS: chat-widget, exit-intent, sticky-cta, cookie-consent
// DOCS-REF: docs/operations/PAGESPEED-RETEST-2026-08-02.md
// SESSION: pagespeed-cls-lcp-llms-7dd5

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CookieConsent } from "@/components/cookie-consent";
import { StickyCta } from "@/components/sticky-cta";

const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false },
);

const ExitIntent = dynamic(
  () => import("@/components/exit-intent").then((m) => ({ default: m.ExitIntent })),
  { ssr: false },
);

function scheduleIdle(cb: () => void): () => void {
  const w = typeof window !== "undefined" ? window : undefined;
  if (w && typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(cb, { timeout: 2500 });
    return () => w.cancelIdleCallback(id);
  }
  const t = globalThis.setTimeout(cb, 1600);
  return () => globalThis.clearTimeout(t);
}

/** Loads fixed overlays after first paint / idle — never shifts site-footer. */
export function DeferredWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => scheduleIdle(() => setReady(true)), []);

  if (!ready) return null;

  return (
    <>
      <StickyCta />
      <ExitIntent />
      <ChatWidget />
      <CookieConsent />
    </>
  );
}
