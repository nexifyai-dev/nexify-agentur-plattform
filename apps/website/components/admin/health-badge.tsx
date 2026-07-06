"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { api } from "@/lib/auth";

type Health = {
  ok: boolean;
  degraded: string[];
  email_agent: { enabled: boolean; last_poll: string | null; polls: number; errors: number };
  ceo_queue: { counts: { pending: number; processing: number; done: number; failed: number }; last_done_at: string | null };
};

export function HealthBadge() {
  const [h, setH] = useState<Health | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api("/api/admin/health/infra");
      setH(data);
    } catch {
      setH(null);
    }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, [load]);

  if (!h) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[11px] text-zinc-500" data-testid="admin-health-badge">
        <XCircle size={12} /> Kein Health-Signal
      </span>
    );
  }

  const isOK = h.ok;
  const hasBacklog = h.ceo_queue.counts.pending > 0 || h.ceo_queue.counts.processing > 0;
  const Icon = isOK ? (hasBacklog ? AlertTriangle : CheckCircle2) : XCircle;
  const cls = isOK
    ? (hasBacklog ? "border-amber-400/40 text-amber-300" : "border-emerald-400/40 text-emerald-300")
    : "border-red-400/40 text-red-300";
  const label = !isOK
    ? `Degraded: ${h.degraded[0] ?? "unbekannt"}`
    : hasBacklog
      ? `${h.ceo_queue.counts.pending + h.ceo_queue.counts.processing} CEO-Aufgabe${h.ceo_queue.counts.pending + h.ceo_queue.counts.processing === 1 ? "" : "n"} offen`
      : "Alle Systeme grün";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${cls}`}
      title={`E-Mail-Agent: polls ${h.email_agent.polls}, errors ${h.email_agent.errors} · CEO-Queue: done ${h.ceo_queue.counts.done}, failed ${h.ceo_queue.counts.failed}`}
      data-testid="admin-health-badge"
    >
      <Icon size={12} /> {label}
    </span>
  );
}
