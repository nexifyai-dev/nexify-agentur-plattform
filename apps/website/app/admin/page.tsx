"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, Bot, ChevronDown, FileText, LogOut, Mail, Send, Users } from "lucide-react";
import { api, useAuth } from "@/lib/auth";

type Stats = { leads: number; offers: number; accepted: number; declined: number; chat_sessions: number; customers: number; pipeline_value: number; won_value: number };
type Lead = { id: string; name: string; email: string; company: string | null; phone: string | null; language: string; message: string; source: string; status: string; created_at: string };
type Offer = { id: string; name: string; email: string; company: string | null; language: string; offer: any; price_total: number | null; status: string; created_at: string };
type Session = { id: string; language: string; created_at: string; msg_count: number; last_at: string | null };

const fmtDate = (s: string) => new Date(s).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
const eur = (n: number) => `€ ${n.toLocaleString("de-DE")}`;

const STATUS_LABEL: Record<string, string> = { sent: "Offen", followed_up: "Nachgefasst", accepted: "Angenommen", declined: "Abgelehnt" };
const SOURCE_LABEL: Record<string, string> = { contact: "Kontaktformular", chat_offer: "KI-Berater", portal_request: "Kundenportal" };

function OfferRow({ o }: { o: Offer }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<any[]>([]);
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
          {o.offer?.items && (
            <div className="space-y-1.5">
              {o.offer.items.map((it: any, i: number) => (
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

function SessionRow({ s }: { s: Session }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<any[]>([]);
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

export default function AdminPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState<"leads" | "offers" | "chats" | "email">("leads");
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [mail, setMail] = useState({ to: "", subject: "", body: "" });
  const [mailState, setMailState] = useState("");

  useEffect(() => {
    if (user === false) router.push("/login");
    if (user && user.role !== "admin") router.push("/konto");
    if (user && user.role === "admin") {
      api("/api/admin/stats").then(setStats).catch(() => {});
      api("/api/admin/leads").then(setLeads).catch(() => {});
      api("/api/admin/offers").then(setOffers).catch(() => {});
      api("/api/admin/sessions").then(setSessions).catch(() => {});
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return <main className="pt-44 text-center text-zinc-500">…</main>;

  const sendMail = async () => {
    setMailState("sending");
    try {
      await api("/api/admin/email", { method: "POST", body: JSON.stringify(mail) });
      setMailState("sent");
      setMail({ to: "", subject: "", body: "" });
    } catch (e: any) {
      setMailState(e.message);
    }
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(false);
    router.push("/");
  };

  const statCards = stats
    ? [
        { label: "Leads", value: stats.leads, icon: Users },
        { label: "Angebote", value: stats.offers, icon: FileText },
        { label: "Angenommen", value: stats.accepted, icon: BarChart3 },
        { label: "Chat-Sessions", value: stats.chat_sessions, icon: Bot },
        { label: "Pipeline", value: eur(stats.pipeline_value), icon: BarChart3 },
        { label: "Gewonnen", value: eur(stats.won_value), icon: BarChart3 },
      ]
    : [];

  return (
    <main className="pb-10 pt-36" data-testid="admin-page">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">CRM · {user.email}</span>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-light text-white">NeXify Cockpit</h1>
          </div>
          <button className="btn-ghost !py-2.5 !text-[13px]" onClick={logout} data-testid="admin-logout-btn">
            <LogOut size={14} /> Abmelden
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" data-testid="admin-stats">
          {statCards.map((c) => (
            <div key={c.label} className="glass p-4">
              <c.icon size={15} className="text-zinc-500" />
              <div className="mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold text-white">{c.value}</div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {([["leads", "Leads"], ["offers", "Angebote"], ["chats", "KI-Chats"], ["email", "E-Mail senden"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} data-testid={`admin-tab-${k}`}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${tab === k ? "border-white/60 bg-white text-black" : "border-white/12 text-zinc-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {tab === "leads" && leads.map((l) => (
            <div key={l.id} className="glass flex flex-wrap items-center justify-between gap-3 p-5" data-testid={`admin-lead-${l.id}`}>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-white">{l.name} {l.company ? <span className="font-normal text-zinc-500">· {l.company}</span> : null}</div>
                <div className="mt-0.5 text-xs text-zinc-500">{l.email}{l.phone ? ` · ${l.phone}` : ""} · {fmtDate(l.created_at)}</div>
                {l.message && <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-zinc-400">{l.message}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full border border-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{SOURCE_LABEL[l.source] ?? l.source}</span>
                <button className="btn-ghost !px-4 !py-2 !text-[12px]" onClick={() => { setTab("email"); setMail({ to: l.email, subject: "", body: `Guten Tag ${l.name},\n\n` }); }} data-testid="admin-lead-mail-btn">
                  <Mail size={13} /> Kontaktieren
                </button>
              </div>
            </div>
          ))}
          {tab === "leads" && leads.length === 0 && <p className="text-sm text-zinc-600">Keine Leads vorhanden.</p>}

          {tab === "offers" && offers.map((o) => <OfferRow key={o.id} o={o} />)}

          {tab === "chats" && sessions.map((s) => <SessionRow key={s.id} s={s} />)}

          {tab === "email" && (
            <div className="glass max-w-2xl space-y-3 p-6" data-testid="admin-email-form">
              <input className="field" type="email" placeholder="Empfänger (E-Mail)" value={mail.to} onChange={(e) => setMail({ ...mail, to: e.target.value })} data-testid="admin-email-to" />
              <input className="field" placeholder="Betreff" value={mail.subject} onChange={(e) => setMail({ ...mail, subject: e.target.value })} data-testid="admin-email-subject" />
              <textarea className="field min-h-40" placeholder="Nachricht (wird im NeXify-CI-Design versendet)" value={mail.body} onChange={(e) => setMail({ ...mail, body: e.target.value })} data-testid="admin-email-body" />
              <button className="btn-primary !py-2.5 !text-[13px]" onClick={sendMail} disabled={!mail.to || !mail.subject || !mail.body || mailState === "sending"} data-testid="admin-email-send">
                {mailState === "sending" ? "Wird gesendet …" : "E-Mail senden"}
              </button>
              {mailState === "sent" && <p className="text-sm text-emerald-400" data-testid="admin-email-success">E-Mail versendet ✔</p>}
              {mailState && mailState !== "sending" && mailState !== "sent" && <p className="text-sm text-red-400">{mailState}</p>}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
