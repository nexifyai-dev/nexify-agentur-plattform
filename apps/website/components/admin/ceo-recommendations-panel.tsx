"use client";

import { useCallback, useEffect, useState } from "react";
import { Brain, Clock, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { api } from "@/lib/auth";
import { fmtDate } from "@/components/admin/panels";
import { ChatMarkdown } from "@/components/chat-markdown";

type Row = {
  id: string;
  kind: string;
  ref_id: string | null;
  subject: string;
  body_snippet: string;
  status: "pending" | "processing" | "done" | "failed";
  recommendation: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_STYLE: Record<string, string> = {
  pending: "border-amber-400/40 text-amber-300",
  processing: "border-sky-400/40 text-sky-300",
  done: "border-emerald-400/40 text-emerald-300",
  failed: "border-red-400/40 text-red-300",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Wartet auf CEO-Agent",
  processing: "CEO-Agent arbeitet",
  done: "Empfehlung bereit",
  failed: "Fehler",
};

export function CeoRecommendationsPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const data = await api("/api/admin/ceo-recommendations?limit=30");
      setRows(Array.isArray(data) ? data : []);
    } catch {} finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 45000);
    return () => clearInterval(iv);
  }, [load]);

  const stats = {
    pending: rows.filter((r) => r.status === "pending").length,
    processing: rows.filter((r) => r.status === "processing").length,
    done: rows.filter((r) => r.status === "done").length,
  };

  return (
    <div className="space-y-6" data-testid="ceo-recommendations-panel">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Fabrik-CEO – Proaktive Empfehlungen</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Der Fabrik-CEO-Agent bereitet für jede neu eingehende E-Mail-Anfrage einen strukturierten Angebotsentwurf vor.
            Keine automatische Versendung – Sie entscheiden.
          </p>
        </div>
        <button onClick={load} disabled={busy} data-testid="ceo-recommendations-refresh"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-zinc-300 hover:border-white/30 hover:text-white disabled:opacity-50">
          <RefreshCw size={13} className={busy ? "animate-spin" : ""} /> Aktualisieren
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass p-4" data-testid="ceo-stat-pending">
          <Clock size={15} className="text-amber-300" />
          <div className="mt-2 text-base font-semibold text-amber-300">{stats.pending}</div>
          <div className="mt-0.5 text-[11px] text-zinc-500">Wartet auf Agent</div>
        </div>
        <div className="glass p-4" data-testid="ceo-stat-processing">
          <Sparkles size={15} className="text-sky-300" />
          <div className="mt-2 text-base font-semibold text-sky-300">{stats.processing}</div>
          <div className="mt-0.5 text-[11px] text-zinc-500">In Bearbeitung</div>
        </div>
        <div className="glass p-4" data-testid="ceo-stat-done">
          <Brain size={15} className="text-emerald-300" />
          <div className="mt-2 text-base font-semibold text-emerald-300">{stats.done}</div>
          <div className="mt-0.5 text-[11px] text-zinc-500">Empfehlung bereit</div>
        </div>
      </div>

      <div className="glass overflow-hidden">
        <div className="border-b border-white/10 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Empfehlungen
        </div>
        {rows.length === 0 && (
          <p className="p-5 text-sm text-zinc-600" data-testid="ceo-recommendations-empty">
            Noch keine Empfehlungen. Sobald eine echte E-Mail-Anfrage eintrifft, legt der E-Mail-Agent hier eine Aufgabe an – der CEO-Agent arbeitet sie autonom ab.
          </p>
        )}
        {rows.map((r) => {
          const isOpen = openId === r.id;
          return (
            <div key={r.id} className="border-b border-white/5 last:border-b-0" data-testid={`ceo-row-${r.id}`}>
              <button
                onClick={() => setOpenId(isOpen ? null : r.id)}
                className="flex w-full items-start justify-between gap-3 px-5 py-3 text-left hover:bg-white/[0.03]"
                data-testid={`ceo-row-toggle-${r.id}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-white">{r.subject || "(kein Betreff)"}</div>
                  <div className="mt-0.5 truncate text-xs text-zinc-500">{r.body_snippet}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLE[r.status] ?? STATUS_STYLE.pending}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                  <span className="text-[11px] text-zinc-600">{fmtDate(r.updated_at)}</span>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-white/5 bg-white/[0.02] px-5 py-4" data-testid={`ceo-row-detail-${r.id}`}>
                  {r.recommendation ? (
                    <div className="text-[13.5px] leading-relaxed text-zinc-200">
                      <ChatMarkdown content={r.recommendation} />
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      {r.status === "pending"
                        ? "Wartet auf den CEO-Agent-Cron (läuft alle ~10 Minuten)."
                        : r.status === "processing"
                          ? "CEO-Agent arbeitet gerade an einer Empfehlung – erneut aktualisieren."
                          : "Keine Empfehlung hinterlegt."}
                    </p>
                  )}
                  {r.ref_id && (
                    <a
                      href={`/admin?ticket=${r.ref_id}`}
                      className="mt-3 inline-flex items-center gap-1 text-[12px] text-zinc-400 hover:text-white"
                      data-testid={`ceo-ticket-link-${r.id}`}
                    >
                      Verknüpftes Ticket öffnen <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
