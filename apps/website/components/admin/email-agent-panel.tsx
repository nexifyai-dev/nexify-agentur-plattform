"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox, Mail, PlayCircle, RefreshCw, ShieldAlert, Ticket } from "lucide-react";
import { api } from "@/lib/auth";
import { fmtDate } from "@/components/admin/panels";

type AgentStatus = {
  enabled: boolean; started_at: string | null; last_poll: string | null;
  polls: number; processed: number; spam: number; inquiries: number; other: number; errors: number;
};
type LogRow = { id: string; ts: string; from_addr: string; subject: string; category: string; action: string; detail: string };

const CAT_STYLE: Record<string, string> = {
  spam: "border-red-400/40 text-red-300",
  inquiry: "border-emerald-400/40 text-emerald-300",
  other: "border-white/20 text-zinc-400",
};
const ACTION_LABEL: Record<string, string> = {
  moved_to_spam: "In Spam verschoben",
  move_failed: "Spam-Verschiebung fehlgeschlagen",
  ticket_created: "Ticket erstellt",
  ignored: "Ignoriert",
};

export function EmailAgentPanel() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [log, setLog] = useState<LogRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [polling, setPolling] = useState(false);
  const [pollMsg, setPollMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const [s, l] = await Promise.all([
        api("/api/admin/email-agent/status"),
        api("/api/admin/email-agent/log?limit=50"),
      ]);
      setStatus(s);
      setLog(l);
    } catch {} finally {
      setBusy(false);
    }
  }, []);

  const pollNow = useCallback(async () => {
    setPolling(true);
    setPollMsg(null);
    try {
      const r = await api("/api/admin/email-agent/poll", { method: "POST" });
      if (r?.ok) {
        setPollMsg(r.found > 0 ? `Neue Nachrichten verarbeitet: ${r.found}` : "Postfach geprüft — keine neuen Mails.");
        await load();
      } else if (r?.reason === "already_running") {
        setPollMsg("Ein Abruf läuft bereits — bitte einen Moment warten.");
      } else if (r?.reason === "imap_disabled") {
        setPollMsg("IMAP-Zugangsdaten fehlen im Backend.");
      } else {
        setPollMsg(`Fehler: ${r?.reason ?? "unbekannt"}`);
      }
    } catch (e) {
      setPollMsg(e instanceof Error ? `Fehler: ${e.message}` : "Fehler beim Abruf");
    } finally {
      setPolling(false);
      setTimeout(() => setPollMsg(null), 6000);
    }
  }, [load]);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load]);

  const cards = status ? [
    { icon: Mail, label: "Status", value: status.enabled ? "Aktiv" : "Inaktiv", accent: status.enabled ? "text-emerald-300" : "text-red-300" },
    { icon: RefreshCw, label: "Letzter Abruf", value: status.last_poll ? fmtDate(status.last_poll) : "—", accent: "text-white" },
    { icon: Inbox, label: "Verarbeitet", value: String(status.processed), accent: "text-white" },
    { icon: Ticket, label: "Anfragen → Tickets", value: String(status.inquiries), accent: "text-emerald-300" },
    { icon: ShieldAlert, label: "Spam aussortiert", value: String(status.spam), accent: "text-red-300" },
  ] : [];

  return (
    <div className="space-y-6" data-testid="email-agent-panel">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Autonomer E-Mail-Agent</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Überwacht mail@nexifyai.cloud, sortiert Spam aus und erstellt Tickets &amp; Leads aus echten Anfragen.
            {status?.started_at && <> Läuft seit {fmtDate(status.started_at)}.</>}
          </p>
        </div>
        <button onClick={load} disabled={busy} data-testid="email-agent-refresh"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-zinc-300 hover:border-white/30 hover:text-white disabled:opacity-50">
          <RefreshCw size={13} className={busy ? "animate-spin" : ""} /> Aktualisieren
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={pollNow} disabled={polling || !status?.enabled} data-testid="email-agent-poll-now"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-[12px] font-semibold text-emerald-200 hover:border-emerald-400/60 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-40">
          <PlayCircle size={13} className={polling ? "animate-pulse" : ""} /> {polling ? "Prüfe Postfach…" : "Jetzt Postfach prüfen"}
        </button>
        {pollMsg && (
          <span className="text-[12px] text-zinc-400" data-testid="email-agent-poll-msg">{pollMsg}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="glass p-4" data-testid={`email-agent-stat-${c.label}`}>
            <c.icon size={15} className="text-zinc-500" />
            <div className={`mt-2 text-base font-semibold ${c.accent}`}>{c.value}</div>
            <div className="mt-0.5 text-[11px] text-zinc-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="glass overflow-hidden">
        <div className="border-b border-white/10 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Aktivitätslog
        </div>
        {log.length === 0 && (
          <p className="p-5 text-sm text-zinc-600" data-testid="email-agent-log-empty">
            Noch keine Aktivitäten protokolliert. Der Agent loggt jede verarbeitete E-Mail (Spam, Anfrage, Sonstiges).
          </p>
        )}
        {log.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-3 border-b border-white/5 px-5 py-3 last:border-b-0" data-testid={`email-agent-log-${r.id}`}>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-white">{r.subject || "(kein Betreff)"}</div>
              <div className="mt-0.5 truncate text-xs text-zinc-500">
                {r.from_addr} · {ACTION_LABEL[r.action] ?? r.action}{r.detail ? ` · ${r.detail}` : ""}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${CAT_STYLE[r.category] ?? CAT_STYLE.other}`}>
                {r.category}
              </span>
              <span className="text-[11px] text-zinc-600">{fmtDate(r.ts)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
