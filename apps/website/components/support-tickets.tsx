"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, LifeBuoy, Send } from "lucide-react";
import { api } from "@/lib/auth";
import { useLang } from "@/lib/lang-context";
import { ChatMarkdown } from "@/components/chat-markdown";

type Ticket = { id: string; subject: string; status: string; source: string; created_at: string };
type Msg = { id: string; sender: string; body: string; created_at: string };

const T = {
  de: {
    title: "Support-Tickets", newTicket: "Neues Ticket", subject: "Betreff", message: "Ihre Nachricht …", create: "Ticket eröffnen",
    empty: "Keine Tickets vorhanden. Bei Fragen sind wir jederzeit für Sie da.",
    open: "Offen", answered: "Beantwortet", reply: "Antwort schreiben …",
    note: "Unser AI-Support antwortet in der Regel innerhalb von 30 Minuten – zusätzlich per E-Mail.",
    you: "Sie", ai: "NeXify AI Support", admin: "Pascal (NeXify)",
  },
  en: {
    title: "Support Tickets", newTicket: "New Ticket", subject: "Subject", message: "Your message …", create: "Create Ticket",
    empty: "No tickets yet. We are always here for you if you have any questions.",
    open: "Open", answered: "Answered", reply: "Write reply …",
    note: "Our AI support typically responds within 30 minutes – also via email.",
    you: "You", ai: "NeXify AI Support", admin: "Pascal (NeXify)",
  },
  nl: {
    title: "Support-tickets", newTicket: "Nieuw ticket", subject: "Onderwerp", message: "Uw bericht …", create: "Ticket openen",
    empty: "Geen tickets aanwezig. Bij vragen staan wij altijd voor u klaar.",
    open: "Open", answered: "Beantwoord", reply: "Antwoord schrijven …",
    note: "Onze AI-support antwoordt doorgaans binnen 30 minuten – ook per e-mail.",
    you: "U", ai: "NeXify AI Support", admin: "Pascal (NeXify)",
  },
};

function TicketRow({ t, labels }: { t: Ticket; labels: (typeof T)["de"] }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  const load = useCallback(() => api(`/api/portal/tickets/${t.id}/messages`).then(setMsgs).catch(() => {}), [t.id]);
  useEffect(() => { if (open) load(); }, [open, load]);

  const send = async () => {
    if (!text.trim()) return;
    await api(`/api/portal/tickets/${t.id}/messages`, { method: "POST", body: JSON.stringify({ body: text }) });
    setText("");
    load();
  };

  return (
    <div className="glass overflow-hidden" data-testid={`ticket-${t.id}`}>
      <button className="flex w-full items-center justify-between gap-3 p-4 text-left" onClick={() => setOpen(!open)} data-testid="ticket-toggle">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold text-white">{t.subject}</div>
          <div className="text-xs text-zinc-500">{new Date(t.created_at).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${t.status === "answered" ? "border-emerald-400/40 text-emerald-300" : "border-white/20 text-zinc-400"}`}>
            {t.status === "answered" ? labels.answered : labels.open}
          </span>
          <ChevronDown size={14} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-white/10 p-4">
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${m.sender === "customer" ? "bg-gradient-to-br from-zinc-100 to-zinc-300 text-black" : "border border-white/10 bg-white/[0.05] text-zinc-200"}`}>
                  <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
                    {m.sender === "customer" ? labels.you : m.sender === "ai" ? labels.ai : labels.admin}
                  </div>
                  {m.sender === "customer" ? <span className="whitespace-pre-wrap">{m.body}</span> : <ChatMarkdown content={m.body} />}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input className="field !py-2.5 !text-[13px]" placeholder={labels.reply} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} data-testid="ticket-reply-input" />
            <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 text-black disabled:opacity-40" onClick={send} disabled={!text.trim()} data-testid="ticket-reply-send">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SupportTickets() {
  const { lang } = useLang();
  const labels = T[lang];
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [form, setForm] = useState({ subject: "", body: "" });
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => api("/api/portal/tickets").then(setTickets).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!form.subject.trim() || !form.body.trim()) return;
    await api("/api/portal/tickets", { method: "POST", body: JSON.stringify(form) });
    setForm({ subject: "", body: "" });
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-3" data-testid="support-tickets">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          <LifeBuoy size={13} /> {labels.title}
        </h2>
        <button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => setShowForm(!showForm)} data-testid="ticket-new-btn">
          {labels.newTicket}
        </button>
      </div>
      {showForm && (
        <div className="glass space-y-3 p-5" data-testid="ticket-form">
          <input className="field !text-[13px]" placeholder={labels.subject} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} data-testid="ticket-subject-input" />
          <textarea className="field min-h-24 !text-[13px]" placeholder={labels.message} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} data-testid="ticket-body-input" />
          <p className="text-xs text-zinc-600">{labels.note}</p>
          <button className="btn-primary !py-2.5 !text-[13px]" onClick={create} disabled={!form.subject.trim() || !form.body.trim()} data-testid="ticket-create-btn">
            {labels.create}
          </button>
        </div>
      )}
      {tickets.length === 0 && !showForm && <div className="glass p-6 text-sm text-zinc-500">{labels.empty}</div>}
      {tickets.map((t) => (
        <TicketRow key={t.id} t={t} labels={labels} />
      ))}
    </div>
  );
}
