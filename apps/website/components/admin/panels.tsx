"use client";

import { useCallback, useEffect, useState } from "react";
import { Bot, ChevronDown, Download, Send } from "lucide-react";
import { api } from "@/lib/auth";
import { API_BASE } from "@/lib/company";
import { ChatMarkdown } from "@/components/chat-markdown";

export type OfferItem = { name: string; description: string; days_min: number; days_max: number };
export type OfferJson = { title?: string; intro?: string; items?: OfferItem[]; next_steps?: string[] } | null;
export type Offer = { id: string; name: string; email: string; company: string | null; language: string; offer: OfferJson; price_total: number | null; status: string; created_at: string };
export type Session = { id: string; language: string; created_at: string; msg_count: number; last_at: string | null };

export const fmtDate = (s: string) => new Date(s).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
export const eur = (n: number) => `€ ${n.toLocaleString("de-DE")}`;

const STATUS_LABEL: Record<string, string> = { sent: "Offen", followed_up: "Nachgefasst", accepted: "Angenommen", declined: "Abgelehnt" };

export function OfferRow({ o }: { o: Offer }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<TicketMsg[]>([]);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);

  const load = useCallback(() => api(`/api/portal/offers/${o.id}/messages`).then(setMsgs).catch(() => {}), [o.id]);
  useEffect(() => { if (open) load(); }, [open, load]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    await api(`/api/admin/offers/${o.id}/messages`, { method: "POST", body: JSON.stringify({ body: reply }) });
    setReply("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    load();
  };

  return (
    <div className="glass overflow-hidden" data-testid={`admin-offer-${o.id}`}>
      <button className="flex w-full items-center justify-between gap-3 p-5 text-left" onClick={() => setOpen(!open)}>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold text-white">{o.offer?.title ?? "Angebot"}</div>
          <div className="mt-0.5 text-xs text-zinc-500">{o.name} · {o.email} · {fmtDate(o.created_at)}</div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm font-semibold text-zinc-300">{o.price_total ? eur(o.price_total) : "—"}</span>
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${o.status === "accepted" ? "border-emerald-400/40 text-emerald-300" : o.status === "declined" ? "border-red-400/40 text-red-300" : "border-white/20 text-zinc-400"}`}>
            {STATUS_LABEL[o.status] ?? o.status}
          </span>
          <ChevronDown size={15} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-white/10 p-5">
          <a href={`${API_BASE}/api/portal/offers/${o.id}/pdf`} target="_blank" rel="noreferrer" className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-zinc-300 hover:border-white/30 hover:text-white" data-testid="admin-offer-pdf">
            <Download size={13} /> PDF
          </a>
          {o.offer?.items && (
            <div className="space-y-1.5">
              {o.offer.items.map((it: OfferItem, i: number) => (
                <div key={i} className="flex justify-between gap-4 text-[13px]">
                  <span className="text-zinc-300">{it.name}</span>
                  <span className="shrink-0 text-zinc-500">{it.days_min === it.days_max ? it.days_min : `${it.days_min}–${it.days_max}`} Tage</span>
                </div>
              ))}
            </div>
          )}
          <h4 className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">Nachrichtenverlauf</h4>
          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
            {msgs.length === 0 && <p className="text-xs text-zinc-600">Keine Nachrichten.</p>}
            {msgs.map((m) => (
              <div key={m.id} className={`rounded-xl px-3.5 py-2.5 text-[13px] ${m.sender === "admin" ? "border border-white/15 bg-white/[0.06] text-zinc-200" : "bg-white/[0.03] text-zinc-300"}`}>
                <span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{m.sender === "admin" ? "NeXify" : "Kunde"}</span>
                {m.body}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input className="field !py-2.5 !text-[13px]" placeholder="Antwort an den Kunden (wird auch per E-Mail gesendet) …" value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendReply()} data-testid="admin-reply-input" />
            <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 text-black disabled:opacity-40" onClick={sendReply} disabled={!reply.trim()} data-testid="admin-reply-send">
              <Send size={15} />
            </button>
          </div>
          {sent && <p className="mt-2 text-xs text-emerald-400">Antwort gesendet ✔ (Portal + E-Mail)</p>}
        </div>
      )}
    </div>
  );
}

export function SessionRow({ s }: { s: Session }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ id: string; role: string; content: string }[]>([]);
  useEffect(() => {
    if (open) api(`/api/admin/sessions/${s.id}/messages`).then(setMsgs).catch(() => {});
  }, [open, s.id]);
  return (
    <div className="glass overflow-hidden">
      <button className="flex w-full items-center justify-between gap-3 p-4 text-left" onClick={() => setOpen(!open)} data-testid={`admin-session-${s.id}`}>
        <div className="flex items-center gap-3">
          <Bot size={15} className="text-zinc-500" />
          <span className="text-[13px] text-zinc-300">{fmtDate(s.last_at ?? s.created_at)}</span>
          <span className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] uppercase text-zinc-500">{s.language}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">{s.msg_count} Nachrichten</span>
          <ChevronDown size={14} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="max-h-72 space-y-2 overflow-y-auto border-t border-white/10 p-4">
          {msgs.map((m) => (
            <div key={m.id} className={`rounded-xl px-3.5 py-2 text-[13px] leading-relaxed ${m.role === "user" ? "bg-white/[0.06] text-white" : "bg-white/[0.02] text-zinc-400"}`}>
              <span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{m.role === "user" ? "Besucher" : "Berater"}</span>
              {m.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type AdminTicket = { id: string; subject: string; name: string; email: string; status: string; source: string; created_at: string };
export type TicketMsg = { id: string; sender: string; body: string; created_at: string };

export function TicketAdminRow({ t }: { t: AdminTicket }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<TicketMsg[]>([]);
  const [reply, setReply] = useState("");
  const load = useCallback(() => api(`/api/portal/tickets/${t.id}/messages`).then(setMsgs).catch(() => {}), [t.id]);
  useEffect(() => { if (open) load(); }, [open, load]);
  const send = async () => {
    if (!reply.trim()) return;
    await api(`/api/admin/tickets/${t.id}/messages`, { method: "POST", body: JSON.stringify({ body: reply }) });
    setReply("");
    load();
  };
  const SOURCE: Record<string, string> = { portal: "Portal", contact: "Kontaktformular", email: "E-Mail-Eingang" };
  return (
    <div className="glass overflow-hidden" data-testid={`admin-ticket-${t.id}`}>
      <button className="flex w-full items-center justify-between gap-3 p-4 text-left" onClick={() => setOpen(!open)}>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold text-white">{t.subject}</div>
          <div className="text-xs text-zinc-500">{t.name} · {t.email} · {fmtDate(t.created_at)} · {SOURCE[t.source] ?? t.source}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${t.status === "answered" ? "border-emerald-400/40 text-emerald-300" : "border-white/20 text-zinc-400"}`}>{t.status}</span>
          <ChevronDown size={14} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-white/10 p-4">
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {msgs.map((m) => (
              <div key={m.id} className={`rounded-xl px-3.5 py-2 text-[13px] leading-relaxed ${m.sender === "customer" ? "bg-white/[0.06] text-white" : "bg-white/[0.02] text-zinc-400"}`}>
                <span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{m.sender === "customer" ? "Kunde" : m.sender === "ai" ? "AI-Support" : "Admin"}</span>
                {m.sender === "customer" ? <span className="whitespace-pre-wrap">{m.body}</span> : <div className="mt-1"><ChatMarkdown content={m.body} /></div>}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input className="field !py-2.5 !text-[13px]" placeholder="Antwort (Portal + E-Mail) …" value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} data-testid="admin-ticket-reply-input" />
            <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 text-black disabled:opacity-40" onClick={send} disabled={!reply.trim()} data-testid="admin-ticket-reply-send">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
