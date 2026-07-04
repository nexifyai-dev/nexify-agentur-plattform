"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, FileText, CheckCircle2 } from "lucide-react";
import { API_BASE } from "@/lib/company";
import { useLang } from "@/lib/i18n";

type Msg = { role: "user" | "assistant"; content: string };

const T = {
  de: {
    title: "NOVA – Ihr KI-Berater",
    status: "Online · antwortet sofort",
    greeting:
      "Guten Tag! Ich bin NOVA, der KI-Berater von NeXify AI. Ich berate Sie zu Websites, Onlineshops, Web-Apps und AI-Automatisierung – und erstelle Ihnen auf Wunsch sofort ein unverbindliches Angebot per E-Mail. Woran arbeiten Sie gerade?",
    placeholder: "Ihre Nachricht an NOVA …",
    offerBtn: "Angebot per E-Mail erhalten",
    offerTitle: "Unverbindliches Angebot anfordern",
    offerText: "NOVA fasst unser Gespräch zu einem strukturierten Angebot zusammen und sendet es Ihnen sofort per E-Mail.",
    name: "Ihr Name *",
    email: "Ihre E-Mail *",
    companyField: "Firma (optional)",
    sendOffer: "Angebot jetzt senden",
    sending: "Wird erstellt …",
    offerSent: "Ihr Angebot ist unterwegs! Prüfen Sie Ihr Postfach – wir melden uns außerdem persönlich bei Ihnen.",
    offerGenerated: "Ihr Angebot wurde erstellt. Der E-Mail-Versand wird kurzfristig nachgeholt – wir melden uns persönlich.",
    error: "Verbindung unterbrochen – bitte erneut versuchen.",
    cancel: "Zurück zum Chat",
  },
  nl: {
    title: "NOVA – Uw AI-adviseur",
    status: "Online · antwoordt direct",
    greeting:
      "Goedendag! Ik ben NOVA, de AI-adviseur van NeXify AI. Ik adviseer u over websites, webshops, web-apps en AI-automatisering – en stel desgewenst direct een vrijblijvende offerte per e-mail op. Waar werkt u momenteel aan?",
    placeholder: "Uw bericht aan NOVA …",
    offerBtn: "Offerte per e-mail ontvangen",
    offerTitle: "Vrijblijvende offerte aanvragen",
    offerText: "NOVA vat ons gesprek samen in een gestructureerde offerte en stuurt deze direct per e-mail.",
    name: "Uw naam *",
    email: "Uw e-mail *",
    companyField: "Bedrijf (optioneel)",
    sendOffer: "Offerte nu versturen",
    sending: "Wordt opgesteld …",
    offerSent: "Uw offerte is onderweg! Controleer uw inbox – wij nemen bovendien persoonlijk contact op.",
    offerGenerated: "Uw offerte is opgesteld. De e-mail volgt spoedig – wij nemen persoonlijk contact op.",
    error: "Verbinding onderbroken – probeer het opnieuw.",
    cancel: "Terug naar de chat",
  },
};

export function ChatWidget() {
  const { lang } = useLang();
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [offerState, setOfferState] = useState<"idle" | "sending" | "sent" | "generated">("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const openedOnce = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!openedOnce.current && !window.localStorage.getItem("nova-greeted")) {
        window.localStorage.setItem("nova-greeted", "1");
        setOpen(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.greeting }]);
    }
    if (open) openedOnce.current = true;
  }, [open, messages.length, t.greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming, showOffer, offerState]);

  const ensureSession = async (): Promise<string> => {
    if (sessionId) return sessionId;
    const res = await fetch(`${API_BASE}/api/chat/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: lang }),
    });
    const data = await res.json();
    setSessionId(data.session_id);
    return data.session_id;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setStreaming(true);
    try {
      const sid = await ensureSession();
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid, message: text, language: lang }),
      });
      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const ev = JSON.parse(line.slice(6));
          if (ev.type === "delta") {
            acc += ev.content;
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: acc };
              return copy;
            });
          }
        }
      }
      if (!acc) throw new Error("empty");
    } catch {
      setMessages((m) => {
        const copy = m[m.length - 1]?.role === "assistant" && !m[m.length - 1].content ? m.slice(0, -1) : [...m];
        return [...copy, { role: "assistant", content: t.error }];
      });
    } finally {
      setStreaming(false);
    }
  };

  const requestOffer = async () => {
    if (!form.name || !form.email) return;
    setOfferState("sending");
    try {
      const sid = await ensureSession();
      const res = await fetch(`${API_BASE}/api/offers/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid, name: form.name, email: form.email, company: form.company || null, language: lang }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setOfferState(data.email_sent ? "sent" : "generated");
      setShowOffer(false);
      setMessages((m) => [...m, { role: "assistant", content: data.email_sent ? t.offerSent : t.offerGenerated }]);
    } catch {
      setOfferState("idle");
      setMessages((m) => [...m, { role: "assistant", content: t.error }]);
      setShowOffer(false);
    }
  };

  return (
    <>
      {!open && (
        <button className="chat-launcher" onClick={() => setOpen(true)} aria-label="Chat öffnen" data-testid="chat-launcher">
          <Sparkles size={24} className="text-zinc-200" />
        </button>
      )}

      {open && (
        <div className="chat-panel" data-testid="chat-panel">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="pulse-dot flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500">
                <Sparkles size={16} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{t.title}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
                  {t.status}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-zinc-500 transition-colors hover:text-white" aria-label="Schließen" data-testid="chat-close">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  data-testid={`chat-msg-${m.role}`}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-zinc-100 to-zinc-300 text-black"
                      : "rounded-bl-md border border-white/10 bg-white/[0.05] text-zinc-200"
                  }`}
                >
                  {m.content || (
                    <span className="flex gap-1 py-1">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {showOffer && (
              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4" data-testid="offer-form">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <FileText size={15} /> {t.offerTitle}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{t.offerText}</p>
                <div className="mt-3 space-y-2">
                  <input className="field !py-2.5 !text-[13px]" placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="offer-name-input" />
                  <input className="field !py-2.5 !text-[13px]" type="email" placeholder={t.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="offer-email-input" />
                  <input className="field !py-2.5 !text-[13px]" placeholder={t.companyField} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} data-testid="offer-company-input" />
                  <button className="btn-primary w-full !py-2.5 !text-[13px]" onClick={requestOffer} disabled={offerState === "sending" || !form.name || !form.email} data-testid="offer-submit-btn">
                    {offerState === "sending" ? t.sending : t.sendOffer}
                  </button>
                  <button className="w-full py-1 text-xs text-zinc-500 transition-colors hover:text-white" onClick={() => setShowOffer(false)}>
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            {(offerState === "sent" || offerState === "generated") && !showOffer && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs text-emerald-300" data-testid="offer-success">
                <CheckCircle2 size={14} /> {offerState === "sent" ? t.offerSent : t.offerGenerated}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            {!showOffer && offerState !== "sent" && offerState !== "generated" && messages.length >= 2 && (
              <button
                className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-white/30 hover:text-white"
                onClick={() => setShowOffer(true)}
                data-testid="offer-open-btn"
              >
                <FileText size={13} /> {t.offerBtn}
              </button>
            )}
            <div className="flex items-center gap-2">
              <input
                className="field !rounded-full !py-2.5 !text-[13.5px]"
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                data-testid="chat-input"
              />
              <button
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 text-black transition-transform hover:scale-105 disabled:opacity-40"
                onClick={send}
                disabled={streaming || !input.trim()}
                aria-label="Senden"
                data-testid="chat-send-btn"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
