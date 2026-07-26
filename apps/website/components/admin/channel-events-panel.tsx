"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { api } from "@/lib/auth";
import { fmtDate } from "@/components/admin/panels";

type ChannelEvent = {
  id: string;
  created_at: string;
  channel: string;
  direction: string;
  contact: string;
  summary: string;
};

const CHANNEL_BADGES: Record<string, string> = {
  website: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  telegram: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  whatsapp: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  email: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  hermes: "border-purple-400/30 bg-purple-400/10 text-purple-200",
};

function asText(value: unknown, fallback = "—") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeEvent(row: unknown, index: number): ChannelEvent {
  const event = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
  const createdAt = typeof event.created_at === "string"
    ? event.created_at
    : typeof event.ts === "string"
      ? event.ts
      : typeof event.timestamp === "string"
        ? event.timestamp
        : new Date(0).toISOString();
  const channel = typeof event.channel === "string" ? event.channel : "unknown";
  const direction = typeof event.direction === "string" ? event.direction : "inbound";
  const contact = typeof event.contact === "string"
    ? event.contact
    : typeof event.contact_label === "string"
      ? event.contact_label
      : typeof event.contact_name === "string"
        ? event.contact_name
        : typeof event.contact_email === "string"
          ? event.contact_email
          : typeof event.contact_phone === "string"
            ? event.contact_phone
            : typeof event.contact_ref === "string"
              ? event.contact_ref
              : typeof event.name === "string"
                ? event.name
                : typeof event.email === "string"
                  ? event.email
                  : "—";
  const summary = typeof event.summary === "string"
    ? event.summary
    : typeof event.message === "string"
      ? event.message
      : typeof event.subject === "string"
        ? event.subject
        : "—";

  return {
    id: typeof event.id === "string" ? event.id : `${channel}-${createdAt}-${index}`,
    created_at: createdAt,
    channel,
    direction,
    contact,
    summary,
  };
}

export function ChannelEventsPanel() {
  const [events, setEvents] = useState<ChannelEvent[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback((): Promise<ChannelEvent[]> => {
    return api("/api/admin/channels/events?limit=50").then((data) => {
      const rows = Array.isArray(data) ? data : Array.isArray((data as { items?: unknown[] })?.items) ? (data as { items: unknown[] }).items : [];
      return rows.map(normalizeEvent);
    });
  }, []);

  useEffect(() => {
    fetchEvents()
      .then((rows) => { setEvents(rows); setLoading(false); })
      .catch(() => { setEvents([]); setLoading(false); });

    const interval = setInterval(() => {
      setRefreshing(true);
      fetchEvents()
        .then((rows) => setEvents(rows))
        .catch(() => {})
        .finally(() => setRefreshing(false));
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const load = useCallback(() => {
    setRefreshing(true);
    fetchEvents()
      .then((rows) => setEvents(rows))
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, [fetchEvents]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return events;
    return events.filter((event) =>
      event.contact.toLowerCase().includes(needle) || event.summary.toLowerCase().includes(needle),
    );
  }, [events, query]);

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]" data-testid="channel-events-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Admin Channel Events</h2>
          <p className="mt-1 text-xs text-zinc-500">Kanalübergreifende Ereignisse aus Website, Messenger, E-Mail und Hermes.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-400 sm:min-w-80">
            <Search size={14} className="shrink-0 text-zinc-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kontakt oder Zusammenfassung suchen …"
              className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            />
          </label>
          <button
            type="button"
            onClick={() => load()}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-zinc-300 hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Aktualisieren
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-black/20">
            <tr className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              <th className="px-4 py-3 font-medium">Zeit</th>
              <th className="px-4 py-3 font-medium">Kanal</th>
              <th className="px-4 py-3 font-medium">Richtung</th>
              <th className="px-4 py-3 font-medium">Kontakt</th>
              <th className="px-4 py-3 font-medium">Zusammenfassung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">Lade Ereignisse …</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">Keine Ereignisse</td>
              </tr>
            ) : (
              filtered.map((event) => {
                const inbound = event.direction.toLowerCase() === "inbound";
                return (
                  <tr key={event.id} className="align-top text-zinc-300">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">{fmtDate(event.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${CHANNEL_BADGES[event.channel] ?? "border-white/15 bg-white/[0.03] text-zinc-300"}`}>
                        {event.channel}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-zinc-400">
                      {inbound ? "↓ inbound" : "↑ outbound"}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-200">{asText(event.contact)}</td>
                    <td className="max-w-xl px-4 py-3 text-sm text-zinc-400">{asText(event.summary)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
