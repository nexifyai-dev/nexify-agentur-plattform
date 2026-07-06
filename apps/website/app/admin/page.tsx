"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, Bot, FileText, LogOut, Sparkles, Users } from "lucide-react";
import { api, useAuth } from "@/lib/auth";

const WEBUI_URL = process.env.NEXT_PUBLIC_WEBUI_URL || "https://webui.nexifyai.cloud";
import { OfferRow, SessionRow, TicketAdminRow, eur, type Offer, type Session, type AdminTicket } from "@/components/admin/panels";
import { CreateOfferForm, ProspectForm } from "@/components/admin/forms";
import { LeadsPanel, type Lead } from "@/components/admin/leads-panel";
import { SlotsPanel } from "@/components/admin/slots-panel";
import { AgentChat } from "@/components/admin/agent-chat";
import { EmailAgentPanel } from "@/components/admin/email-agent-panel";
import { CeoRecommendationsPanel } from "@/components/admin/ceo-recommendations-panel";
import { HealthBadge } from "@/components/admin/health-badge";

type Stats = { leads: number; offers: number; accepted: number; declined: number; chat_sessions: number; customers: number; pipeline_value: number; won_value: number };
type Tab = "leads" | "offers" | "slots" | "tickets" | "chats" | "agent" | "createOffer" | "prospect" | "email" | "emailAgent" | "ceo";

const TABS: [Tab, string][] = [
  ["agent", "AI-Agent"],
  ["leads", "Leads"],
  ["offers", "Angebote"],
  ["slots", "Termine"],
  ["tickets", "Tickets"],
  ["chats", "KI-Chats"],
  ["emailAgent", "E-Mail-Agent"],
  ["ceo", "CEO-Empfehlungen"],
  ["createOffer", "+ Angebot"],
  ["prospect", "+ Interessent"],
  ["email", "E-Mail"],
];

export default function AdminPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState<Tab>("agent");
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [mail, setMail] = useState({ to: "", subject: "", body: "" });
  const [mailState, setMailState] = useState("");
  const [ssoBusy, setSsoBusy] = useState(false);

  const openWebui = useCallback(async () => {
    setSsoBusy(true);
    const win = window.open("", "_blank");
    try {
      const { url } = await api("/api/admin/webui-sso");
      if (win) win.location.href = url;
      else window.location.href = url;
    } catch {
      if (win) win.location.href = WEBUI_URL;
      else window.location.href = WEBUI_URL;
    } finally {
      setSsoBusy(false);
    }
  }, []);

  const loadLeads = useCallback(() => api("/api/admin/leads").then(setLeads).catch(() => {}), []);

  useEffect(() => {
    if (user === false) router.push("/login");
    if (user && user.role !== "admin") router.push("/konto");
    if (user && user.role === "admin") {
      api("/api/admin/stats").then(setStats).catch(() => {});
      loadLeads();
      api("/api/admin/offers").then(setOffers).catch(() => {});
      api("/api/admin/sessions").then(setSessions).catch(() => {});
      api("/api/admin/tickets").then(setTickets).catch(() => {});
    }
  }, [user, router, loadLeads]);

  if (!user || user.role !== "admin") return <main className="pt-44 text-center text-zinc-500">…</main>;

  const sendMail = async () => {
    setMailState("sending");
    try {
      await api("/api/admin/email", { method: "POST", body: JSON.stringify(mail) });
      setMailState("sent");
      setMail({ to: "", subject: "", body: "" });
    } catch (e) {
      setMailState(e instanceof Error ? e.message : String(e));
    }
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(false);
    router.push("/");
  };

  const openEmail = (to: string, name: string) => {
    setTab("email");
    setMail({ to, subject: "", body: `Guten Tag ${name},\n\n` });
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
    <main className="pb-20 pt-28 md:pb-24 md:pt-36" data-testid="admin-page">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">CRM · {user.email}</span>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-light text-white">NeXify Cockpit</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <HealthBadge />
            <button
              onClick={openWebui}
              disabled={ssoBusy}
              className="btn-primary !py-2.5 !text-[13px]"
              data-testid="open-hermes-webui-btn"
            >
              <Sparkles size={14} /> {ssoBusy ? "Öffne …" : "NeXify AI ADMIN öffnen"}
            </button>
            <button className="btn-ghost !py-2.5 !text-[13px]" onClick={logout} data-testid="admin-logout-btn">
              <LogOut size={14} /> Abmelden
            </button>
          </div>
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
          {TABS.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} data-testid={`admin-tab-${k}`}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${tab === k ? "border-white/60 bg-white text-black" : "border-white/12 text-zinc-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {tab === "agent" && <AgentChat />}

          {tab === "leads" && <LeadsPanel leads={leads} onChanged={loadLeads} onEmail={openEmail} />}

          {tab === "offers" && offers.map((o) => <OfferRow key={o.id} o={o} />)}
          {tab === "offers" && offers.length === 0 && <p className="text-sm text-zinc-600">Keine Angebote vorhanden.</p>}

          {tab === "slots" && <SlotsPanel />}

          {tab === "tickets" && tickets.map((t) => <TicketAdminRow key={t.id} t={t} />)}
          {tab === "tickets" && tickets.length === 0 && <p className="text-sm text-zinc-600">Keine Tickets vorhanden.</p>}

          {tab === "chats" && sessions.map((s) => <SessionRow key={s.id} s={s} />)}

          {tab === "emailAgent" && <EmailAgentPanel />}
          {tab === "ceo" && <CeoRecommendationsPanel />}

          {tab === "createOffer" && <CreateOfferForm onDone={() => api("/api/admin/offers").then(setOffers).catch(() => {})} />}

          {tab === "prospect" && <ProspectForm />}

          {tab === "email" && (
            <div className="glass max-w-2xl space-y-3 p-6" data-testid="admin-email-form">
              <input className="field" type="email" placeholder="Empfänger (E-Mail)" value={mail.to} onChange={(e) => setMail((m) => ({ ...m, to: e.target.value }))} data-testid="admin-email-to" />
              <input className="field" placeholder="Betreff" value={mail.subject} onChange={(e) => setMail((m) => ({ ...m, subject: e.target.value }))} data-testid="admin-email-subject" />
              <textarea className="field min-h-40" placeholder="Nachricht (wird im NeXify-CI-Design versendet, Absender & Antwort an mail@nexifyai.cloud)" value={mail.body} onChange={(e) => setMail((m) => ({ ...m, body: e.target.value }))} data-testid="admin-email-body" />
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
