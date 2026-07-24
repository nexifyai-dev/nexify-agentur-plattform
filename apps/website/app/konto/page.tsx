"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, CreditCard, Download, FileText, LogOut, MessageSquare, Send, User as UserIcon, XCircle } from "lucide-react";
import { api, useAuth } from "@/lib/auth";
import { API_BASE } from "@/lib/company";
import { useLang } from "@/lib/lang-context";
import { ChatMarkdown } from "@/components/chat-markdown";
import { PortalTour } from "@/components/portal-tour";
import { SupportTickets } from "@/components/support-tickets";

type Offer = {
  id: string; name: string; email: string; company: string | null; language: string;
  offer: { title?: string; intro?: string; items?: { name: string; description: string; days_min: number; days_max: number }[]; next_steps?: string[] } | null;
  price_total: number | null; status: string; created_at: string;
};
type Msg = { id: string; sender: string; body: string; created_at: string };

const T = {
  de: {
    title: "Ihr Kundenportal", hello: "Willkommen zurück", offers: "Ihre Angebote", profile: "Ihre Daten", request: "Neues Angebot anfordern",
    noOffers: "Noch keine Angebote vorhanden. Fordern Sie unten ein neues Angebot an oder sprechen Sie mit dem NeXify AI Berater im Chat.",
    accept: "Angebot annehmen", decline: "Ablehnen", accepted: "Angenommen", declined: "Abgelehnt", sent: "Offen", followed_up: "Offen",
    pay: "Ersten Tagessatz jetzt bezahlen (€ 999)", paid: "Anzahlung bezahlt ✔", payPending: "Zahlung wird geprüft …",
    questions: "Rückfragen & Nachrichten", writeQuestion: "Ihre Rückfrage …", send: "Senden",
    requestPlaceholder: "Beschreiben Sie Ihr neues Vorhaben – wir melden uns mit einem Angebot.",
    requestBtn: "Anfrage senden", save: "Speichern", saved: "Gespeichert ✔", logout: "Abmelden",
    name: "Name", company: "Firma", phone: "Telefon", note: "Optionale Nachricht an uns …",
    total: "Richtpreis (netto)", you: "Sie", nexify: "NeXify AI",
  },
  en: {
    title: "Your Customer Portal", hello: "Welcome back", offers: "Your Offers", profile: "Your Data", request: "Request New Offer",
    noOffers: "No offers yet. Request a new offer below or chat with the NeXify AI advisor.",
    accept: "Accept Offer", decline: "Decline", accepted: "Accepted", declined: "Declined", sent: "Open", followed_up: "Open",
    pay: "Pay first daily rate now (€ 999)", paid: "Deposit paid ✔", payPending: "Payment being verified …",
    questions: "Questions & Messages", writeQuestion: "Your question …", send: "Send",
    requestPlaceholder: "Describe your new project – we will get back to you with an offer.",
    requestBtn: "Send Request", save: "Save", saved: "Saved ✔", logout: "Logout",
    name: "Name", company: "Company", phone: "Phone", note: "Optional message to us …",
    total: "Guide price (net)", you: "You", nexify: "NeXify AI",
  },
  nl: {
    title: "Uw klantportaal", hello: "Welkom terug", offers: "Uw offertes", profile: "Uw gegevens", request: "Nieuwe offerte aanvragen",
    noOffers: "Nog geen offertes aanwezig. Vraag hieronder een nieuwe offerte aan of chat met de NeXify AI adviseur.",
    accept: "Offerte aannemen", decline: "Afwijzen", accepted: "Aangenomen", declined: "Afgewezen", sent: "Open", followed_up: "Open",
    pay: "Eerste dagtarief nu betalen (€ 999)", paid: "Aanbetaling betaald ✔", payPending: "Betaling wordt gecontroleerd …",
    questions: "Vragen & berichten", writeQuestion: "Uw vraag …", send: "Versturen",
    requestPlaceholder: "Beschrijf uw nieuwe plan – wij melden ons met een offerte.",
    requestBtn: "Aanvraag versturen", save: "Opslaan", saved: "Opgeslagen ✔", logout: "Uitloggen",
    name: "Naam", company: "Bedrijf", phone: "Telefoon", note: "Optioneel bericht aan ons …",
    total: "Richtprijs (netto)", you: "U", nexify: "NeXify AI",
  },
};

function StatusBadge({ status, t }: { status: string; t: (typeof T)["de"] }) {
  const map: Record<string, string> = {
    accepted: "border-emerald-400/40 text-emerald-300",
    declined: "border-red-400/40 text-red-300",
    sent: "border-white/20 text-zinc-300",
    followed_up: "border-white/20 text-zinc-300",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${map[status] ?? map.sent}`} data-testid="offer-status-badge">
      {(t as Record<string, string>)[status] ?? status}
    </span>
  );
}

function OfferCard({ offer, t, onChanged }: { offer: Offer; t: (typeof T)["de"]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [payState, setPayState] = useState<string | null>(null);

  const loadMsgs = useCallback(() => {
    api(`/api/portal/offers/${offer.id}/messages`).then(setMsgs).catch(() => {});
  }, [offer.id]);

  useEffect(() => {
    if (open) loadMsgs();
  }, [open, loadMsgs]);

  useEffect(() => {
    if (offer.status === "accepted") {
      api(`/api/portal/offers/${offer.id}/payment-status`).then((d) => setPayState(d.status)).catch(() => setPayState(null));
    }
  }, [offer.id, offer.status]);

  const decide = async (decision: string) => {
    setBusy(true);
    try {
      await api(`/api/portal/offers/${offer.id}/decision`, { method: "POST", body: JSON.stringify({ decision, note: note || null }) });
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const pay = async () => {
    setBusy(true);
    try {
      const d = await api(`/api/portal/offers/${offer.id}/pay`, { method: "POST" });
      if (d.checkout_url) window.location.href = d.checkout_url;
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const sendMsg = async () => {
    if (!text.trim()) return;
    await api(`/api/portal/offers/${offer.id}/messages`, { method: "POST", body: JSON.stringify({ body: text }) });
    setText("");
    loadMsgs();
  };

  return (
    <div className="glass overflow-hidden" data-testid={`portal-offer-${offer.id}`}>
      <button className="flex w-full items-center justify-between gap-4 p-6 text-left" onClick={() => setOpen(!open)} data-testid="portal-offer-toggle">
        <div className="flex items-center gap-4">
          <FileText size={18} className="shrink-0 text-zinc-400" />
          <div>
            <div className="text-[15px] font-semibold text-white">{offer.offer?.title ?? "Angebot"}</div>
            <div className="mt-0.5 text-xs text-zinc-500">
              {new Date(offer.created_at).toLocaleDateString("de-DE")} · {t.total}: € {offer.price_total?.toLocaleString("de-DE")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={offer.status} t={t} />
          <ChevronDown size={16} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-white/10 p-6">
          <a
            href={`${API_BASE}/api/portal/offers/${offer.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
            data-testid="offer-pdf-link"
          >
            <Download size={13} /> PDF
          </a>
          {offer.offer?.intro && <p className="text-sm leading-relaxed text-zinc-400">{offer.offer.intro}</p>}
          <div className="mt-4 space-y-2">
            {offer.offer?.items?.map((it, i) => (
              <div key={i} className="flex items-start justify-between gap-4 rounded-xl bg-white/[0.03] px-4 py-3">
                <div>
                  <div className="text-[13.5px] font-semibold text-white">{it.name}</div>
                  <div className="text-xs text-zinc-500">{it.description}</div>
                </div>
                <div className="shrink-0 text-xs text-zinc-400">
                  {it.days_min === it.days_max ? it.days_min : `${it.days_min}–${it.days_max}`} Tage
                </div>
              </div>
            ))}
          </div>

          {(offer.status === "sent" || offer.status === "followed_up") && (
            <div className="mt-6 space-y-3">
              <textarea className="field min-h-20 !text-[13px]" placeholder={t.note} value={note} onChange={(e) => setNote(e.target.value)} data-testid="decision-note-input" />
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary !py-2.5 !text-[13px]" disabled={busy} onClick={() => decide("accepted")} data-testid="offer-accept-btn">
                  <CheckCircle2 size={15} /> {t.accept}
                </button>
                <button className="btn-ghost !py-2.5 !text-[13px] !text-red-300 !border-red-400/30" disabled={busy} onClick={() => decide("declined")} data-testid="offer-decline-btn">
                  <XCircle size={15} /> {t.decline}
                </button>
              </div>
            </div>
          )}

          {offer.status === "accepted" && (
            <div className="mt-6">
              {payState === "completed" ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300" data-testid="payment-completed">
                  <CheckCircle2 size={16} /> {t.paid}
                </div>
              ) : payState && ["pending", "processing", "authorised"].includes(payState) ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-zinc-400">{t.payPending}</span>
                  <button className="btn-ghost !py-2 !text-[12px]" onClick={pay} disabled={busy} data-testid="offer-pay-btn">
                    <CreditCard size={14} /> {t.pay}
                  </button>
                </div>
              ) : (
                <button className="btn-primary !py-2.5 !text-[13px]" onClick={pay} disabled={busy} data-testid="offer-pay-btn">
                  <CreditCard size={15} /> {t.pay}
                </button>
              )}
            </div>
          )}

          <div className="mt-8">
            <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              <MessageSquare size={13} /> {t.questions}
            </h3>
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${m.sender === "customer" ? "bg-gradient-to-br from-zinc-100 to-zinc-300 text-black" : "border border-white/10 bg-white/[0.05] text-zinc-200"}`}>
                    <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider opacity-60">{m.sender === "customer" ? t.you : t.nexify}</div>
                    {m.sender === "customer" ? m.body : <ChatMarkdown content={m.body} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="field !py-2.5 !text-[13px]" placeholder={t.writeQuestion} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()} data-testid="offer-question-input" />
              <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 text-black disabled:opacity-40" onClick={sendMsg} disabled={!text.trim()} data-testid="offer-question-send">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { lang } = useLang();
  const t = T[lang];
  const [offers, setOffers] = useState<Offer[]>([]);
  const [profile, setProfile] = useState({ name: "", company: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [reqText, setReqText] = useState("");
  const [reqDone, setReqDone] = useState("");

  const loadOffers = useCallback(() => {
    api("/api/portal/offers").then(setOffers).catch(() => {});
  }, []);

  useEffect(() => {
    if (user === false) router.push("/login");
    if (user) {
      setProfile({ name: user.name ?? "", company: user.company ?? "", phone: user.phone ?? "" });
      loadOffers();
    }
  }, [user, router, loadOffers]);

  if (!user) return <main className="pt-44 text-center text-zinc-500">…</main>;

  const saveProfile = async () => {
    const u = await api("/api/auth/profile", { method: "PUT", body: JSON.stringify({ ...profile, company: profile.company || null, phone: profile.phone || null, language: lang }) });
    setUser(u);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const requestOffer = async () => {
    if (!reqText.trim()) return;
    const d = await api("/api/portal/offers/request-new", { method: "POST", body: JSON.stringify({ description: reqText }) });
    setReqDone(d.message);
    setReqText("");
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(false);
    router.push("/");
  };

  return (
    <main className="pb-20 pt-28 md:pb-24 md:pt-36" data-testid="portal-page">
      <PortalTour />
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">{t.hello}, {user.name}</span>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-light text-white">{t.title}</h1>
          </div>
          <button className="btn-ghost !py-2.5 !text-[13px]" onClick={logout} data-testid="portal-logout-btn">
            <LogOut size={14} /> {t.logout}
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.offers}</h2>
            {offers.length === 0 && <div className="glass p-8 text-sm text-zinc-500" data-testid="portal-no-offers">{t.noOffers}</div>}
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o} t={t} onChanged={loadOffers} />
            ))}

            <div className="glass p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.request}</h3>
              <textarea className="field mt-4 min-h-24 !text-[13px]" placeholder={t.requestPlaceholder} value={reqText} onChange={(e) => setReqText(e.target.value)} data-testid="portal-request-input" />
              {reqDone && <p className="mt-2 text-sm text-emerald-400" data-testid="portal-request-success">{reqDone}</p>}
              <button className="btn-primary mt-3 !py-2.5 !text-[13px]" onClick={requestOffer} disabled={!reqText.trim()} data-testid="portal-request-btn">
                {t.requestBtn}
              </button>
            </div>

            <SupportTickets />
          </div>

          <div className="glass h-fit p-6" data-testid="portal-profile">
            <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              <UserIcon size={13} /> {t.profile}
            </h2>
            <div className="mt-4 space-y-3">
              <input className="field" placeholder={t.name} value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} data-testid="profile-name-input" />
              <input className="field" disabled value={user.email} />
              <input className="field" placeholder={t.company} value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} data-testid="profile-company-input" />
              <input className="field" placeholder={t.phone} value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} data-testid="profile-phone-input" />
              <button className="btn-primary w-full !py-2.5 !text-[13px]" onClick={saveProfile} data-testid="profile-save-btn">
                {saved ? t.saved : t.save}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
