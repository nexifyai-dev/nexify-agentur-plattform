// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/components/deferred-widgets.tsx
// NIR: 02.08.2026 11:10
// UPDATED: 02.08.2026 11:10
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Idle-deferred Chat + ExitIntent (dynamic import, no SSR)
// WHY: Cut unused JS / long tasks from mobile LCP critical path
// BEST-PRACTICE: requestIdleCallback + timeout fallback; ssr:false
// PITFALL: V-XX: never block first paint waiting for chat session
// DEPENDS: chat-widget, exit-intent
// DOCS-REF: docs/operations/PAGESPEED-RETEST-2026-08-02.md
// SESSION: pagespeed-cls-lcp-llms-7dd5

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false },
);

const ExitIntent = dynamic(
  () => import("@/components/exit-intent").then((m) => ({ default: m.ExitIntent })),
  { ssr: false },
);

function scheduleIdle(cb: () => void): () => void {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const t = window.setTimeout(cb, 1600);
  return () => window.clearTimeout(t);
}

/** Loads heavy client widgets after first paint / idle. */
export function DeferredWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => scheduleIdle(() => setReady(true)), []);

  if (!ready) return null;

  return (
    <>
      <ExitIntent />
      <ChatWidget />
    </>
  );
}
