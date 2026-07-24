"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Wand2 } from "lucide-react";
import { API_BASE } from "@/lib/company";
import { useLang } from "@/lib/lang-context";
import { useContent } from "@/lib/content";

type Plan = {
  title: string;
  summary: string;
  modules: { name: string; description: string; days_min: number; days_max: number }[];
  structure: string[];
  phases: { name: string; text: string }[];
  recommendation: string;
};
type PlanResult = { session_id: string; plan: Plan; days_min: number; days_max: number; price_min: number; price_max: number };

const FEATURES = {
  de: ["Kontakt & Lead-Formulare", "Online-Terminbuchung", "Mehrsprachigkeit (DE/NL/EN)", "Blog / News", "Shop & Online-Zahlungen", "Kundenkonto / Login", "ERP- / Buchhaltungs-Anbindung", "KI-Chatbot / KI-Berater", "Newsletter & E-Mail-Automation", "SEO & Analytics"],
  en: ["Contact & Lead Forms", "Online Appointment Booking", "Multilingual (EN/DE/NL)", "Blog / News", "Shop & Online Payments", "Customer Account / Login", "ERP / Accounting Integration", "AI Chatbot / AI Advisor", "Newsletter & Email Automation", "SEO & Analytics"],
  nl: ["Contact- & leadformulieren", "Online afspraken boeken", "Meertaligheid (NL/DE/EN)", "Blog / nieuws", "Shop & online betalingen", "Klantaccount / login", "ERP- / boekhoudkoppeling", "AI-chatbot / AI-adviseur", "Nieuwsbrief & e-mailautomatisering", "SEO & analytics"],
};

const T = {
  de: {
    eyebrow: "AI-Projektplaner",
    title: "Planen Sie Ihr Projekt – die AI liefert Konzept, Entwurf und Angebot",
    intro: "Wählen Sie Ihren Projekttyp, beschreiben Sie kurz Ihr Vorhaben – NeXify AI erstellt in Sekunden einen individuellen Projektplan mit Modulen, erster Struktur und transparenter Preisspanne. Auf Wunsch direkt als verbindliches Angebot per E-Mail.",
    step1: "1. Projekttyp", step2: "2. Ihr Vorhaben", step3: "3. Ihr AI-Projektplan",
    industry: "Ihre Branche (z. B. Zahnarztpraxis, Maschinenbau) *",
    goal: "Was soll das Projekt erreichen? (z. B. mehr Anfragen, Online-Verkauf) *",
    features: "Gewünschte Funktionen (optional)",
    details: "Weitere Details, Besonderheiten, Vorbilder … (optional)",
    generate: "AI-Projektplan erstellen",
    generating: "NeXify AI plant Ihr Projekt …",
    modules: "Module & Aufwand", structure: "Erster Struktur-Entwurf", phases: "Projektphasen", reco: "Empfehlung",
    total: "Richtpreis gesamt (netto)",
    offerTitle: "Verbindliches Angebot anfordern",
    offerText: "Wir senden Ihnen diesen Plan als individuelles Angebot inkl. PDF per E-Mail – geprüft von Pascal Courbois.",
    name: "Ihr Name *", email: "Ihre E-Mail *", companyF: "Firma (optional)", phoneF: "Telefon (optional)",
    send: "Angebot per E-Mail erhalten", sending: "Ihr Angebot wird erstellt …",
    sent: "Ihr Angebot ist unterwegs! Prüfen Sie Ihr Postfach – Pascal Courbois meldet sich zudem persönlich.",
    error: "Das hat leider nicht geklappt – bitte versuchen Sie es erneut oder schreiben Sie an mail@nexifyai.cloud.",
    restart: "Neues Projekt planen",
    legal: "Unverbindliche Indikation, ausschließlich B2B. Preise zzgl. USt.",
  },
  en: {
    eyebrow: "AI Project Planner",
    title: "Plan Your Project – AI Delivers Concept, Draft and Offer",
    intro: "Choose your project type, briefly describe your plans – NeXify AI creates an individual project plan in seconds with modules, initial structure and transparent price range. On request directly as a binding offer via email.",
    step1: "1. Project Type", step2: "2. Your Project", step3: "3. Your AI Project Plan",
    industry: "Your industry (e.g. dental practice, mechanical engineering) *",
    goal: "What should the project achieve? (e.g. more inquiries, online sales) *",
    features: "Desired features (optional)",
    details: "Further details, specifics, examples … (optional)",
    generate: "Create AI Project Plan",
    generating: "NeXify AI is planning your project …",
    modules: "Modules & Effort", structure: "Initial Structure Draft", phases: "Project Phases", reco: "Recommendation",
    total: "Guide price total (net)",
    offerTitle: "Request Binding Offer",
    offerText: "We will send you this plan as an individual offer incl. PDF via email – reviewed by Pascal Courbois.",
    name: "Your name *", email: "Your email *", companyF: "Company (optional)", phoneF: "Phone (optional)",
    send: "Receive offer via email", sending: "Your offer is being created …",
    sent: "Your offer is on its way! Check your inbox – Pascal Courbois will also contact you personally.",
    error: "Unfortunately that didn't work – please try again or write to mail@nexifyai.cloud.",
    restart: "Plan New Project",
    legal: "Non-binding indication, exclusively B2B. Prices excl. VAT.",
  },
  nl: {
    eyebrow: "AI-projectplanner",
    title: "Plan uw project – de AI levert concept, ontwerp en offerte",
    intro: "Kies uw projecttype en beschrijf kort uw plannen – NeXify AI stelt in seconden een individueel projectplan op met modules, eerste structuur en transparante prijsindicatie. Desgewenst direct als offerte per e-mail.",
    step1: "1. Projecttype", step2: "2. Uw plan", step3: "3. Uw AI-projectplan",
    industry: "Uw branche (bijv. tandartspraktijk, machinebouw) *",
    goal: "Wat moet het project bereiken? (bijv. meer aanvragen, online verkoop) *",
    features: "Gewenste functies (optioneel)",
    details: "Verdere details, bijzonderheden, voorbeelden … (optioneel)",
    generate: "AI-projectplan opstellen",
    generating: "NeXify AI plant uw project …",
    modules: "Modules & inspanning", structure: "Eerste structuurontwerp", phases: "Projectfasen", reco: "Aanbeveling",
    total: "Richtprijs totaal (netto)",
    offerTitle: "Vrijblijvende offerte aanvragen",
    offerText: "Wij sturen u dit plan als individuele offerte incl. pdf per e-mail – gecontroleerd door Pascal Courbois.",
    name: "Uw naam *", email: "Uw e-mail *", companyF: "Bedrijf (optioneel)", phoneF: "Telefoon (optioneel)",
    send: "Offerte per e-mail ontvangen", sending: "Uw offerte wordt opgesteld …",
    sent: "Uw offerte is onderweg! Controleer uw inbox – Pascal Courbois neemt bovendien persoonlijk contact op.",
    error: "Dat is helaas niet gelukt – probeer het opnieuw of mail naar mail@nexifyai.cloud.",
    restart: "Nieuw project plannen",
    legal: "Vrijblijvende indicatie, uitsluitend B2B. Prijzen excl. btw.",
  },
};

const eur = (n: number) => `€ ${n.toLocaleString("de-DE")}`;

export function ProjectPlanner() {
  const { lang } = useLang();
  const t = T[lang];
  const content = useContent();
  const [typeIdx, setTypeIdx] = useState<number | null>(null);
  const [industry, setIndustry] = useState("");
  const [goal, setGoal] = useState("");
  const [feats, setFeats] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "planning" | "planned" | "sending" | "sent" | "error">("idle");
  const [result, setResult] = useState<PlanResult | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });

  const svc = typeIdx !== null ? content.services[typeIdx] : null;
  const toggleFeat = (f: string) => setFeats((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]));

  const generate = async () => {
    if (typeIdx === null || !industry.trim() || !goal.trim() || state === "planning") return;
    setState("planning");
    try {
      const res = await fetch(`${API_BASE}/api/planner/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_type: content.services[typeIdx].title, industry, goal, features: feats, details: details || null, language: lang }),
      });
      if (!res.ok) throw new Error("failed");
      setResult(await res.json());
      setState("planned");
    } catch {
      setState("error");
    }
  };

  const requestOffer = async () => {
    if (!result || !form.name || !form.email || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch(`${API_BASE}/api/offers/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: result.session_id, name: form.name, email: form.email, company: form.company || null, phone: form.phone || null, language: lang }),
      });
      if (!res.ok) throw new Error("failed");
      setState("sent");
    } catch {
      setState("error");
    }
  };

  const reset = () => { setState("idle"); setResult(null); setTypeIdx(null); setIndustry(""); setGoal(""); setFeats([]); setDetails(""); };

  return (
    <div className="glass relative overflow-hidden p-8 md:p-12" data-testid="project-planner">
      <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[320px] w-[320px] rounded-full bg-white/[0.05] blur-[100px]" />
      <div className="relative">
        <span className="eyebrow flex items-center gap-2"><Wand2 size={13} /> {t.eyebrow}</span>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.title}</h2>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-zinc-400">{t.intro}</p>

        {!result && (
          <>
            <h3 className="mt-10 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.step1}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {content.services.map((s, i) => {
                const max = s.maxDays ?? s.minDays;
                return (
                  <button key={s.slug} onClick={() => setTypeIdx(i)} data-testid={`planner-type-${s.slug}`}
                    className={`rounded-2xl border p-4 text-left transition-all ${i === typeIdx ? "border-white/60 bg-white/[0.07]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
                    <div className="text-[13.5px] font-semibold text-white">{s.shortTitle}</div>
                    <div className="mt-1.5 text-[12px] text-zinc-500">
                      {s.minDays === max ? s.minDays : `${s.minDays}–${max}`}{s.from ? "+" : ""} {s.minDays === max && s.minDays === 1 && !s.from ? (lang === "nl" ? "werkdag" : "Arbeitstag") : (lang === "nl" ? "werkdagen" : "Arbeitstage")} · € 999 / {lang === "nl" ? "dag" : "Tag"} netto
                    </div>
                    <div className="text-silver mt-1 text-[13px] font-semibold">
                      {s.from ? `${lang === "nl" ? "vanaf" : "ab"} ${eur(s.minDays * 999)}` : s.minDays === max ? eur(s.minDays * 999) : `${eur(s.minDays * 999)} – ${eur(max * 999)}`}
                    </div>
                  </button>
                );
              })}
            </div>

            {svc && (
              <div className="mt-8" data-testid="planner-step2">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.step2}</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input className="field" placeholder={t.industry} value={industry} onChange={(e) => setIndustry(e.target.value)} data-testid="planner-industry-input" />
                  <input className="field" placeholder={t.goal} value={goal} onChange={(e) => setGoal(e.target.value)} data-testid="planner-goal-input" />
                </div>
                <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.features}</div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {FEATURES[lang].map((f) => (
                    <button key={f} onClick={() => toggleFeat(f)} data-testid="planner-feature-chip"
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${feats.includes(f) ? "border-white/60 bg-white text-black" : "border-white/12 text-zinc-400 hover:border-white/30 hover:text-white"}`}>
                      {f}
                    </button>
                  ))}
                </div>
                <textarea className="field mt-4 min-h-20" placeholder={t.details} value={details} onChange={(e) => setDetails(e.target.value)} data-testid="planner-details-input" />
                <button className="btn-primary mt-5" onClick={generate} disabled={!industry.trim() || !goal.trim() || state === "planning"} data-testid="planner-generate-btn">
                  {state === "planning" ? <><Loader2 size={15} className="animate-spin" /> {t.generating}</> : <><Sparkles size={15} /> {t.generate}</>}
                </button>
                {state === "error" && <p className="mt-3 text-sm text-red-400" data-testid="planner-error">{t.error}</p>}
              </div>
            )}
          </>
        )}

        {result && (
          <div className="mt-10" data-testid="planner-result">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.step3}</h3>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-6 md:p-8">
              <h4 className="font-[family-name:var(--font-heading)] text-2xl font-medium text-white">{result.plan.title}</h4>
              <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-zinc-400">{result.plan.summary}</p>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.modules}</div>
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                    {result.plan.modules.map((m, i) => (
                      <div key={i} className={`flex items-start justify-between gap-4 p-4 ${i > 0 ? "border-t border-white/8" : ""}`}>
                        <div>
                          <div className="text-[13.5px] font-semibold text-white">{m.name}</div>
                          <div className="mt-1 text-[12.5px] leading-relaxed text-zinc-500">{m.description}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[12px] text-zinc-400">{m.days_min === m.days_max ? m.days_min : `${m.days_min}–${m.days_max}`} {lang === "nl" ? "dagen" : "Tage"}</div>
                          <div className="text-silver text-[13px] font-semibold">{m.days_min === m.days_max ? eur(m.days_min * 999) : `${eur(m.days_min * 999)} – ${eur(m.days_max * 999)}`}</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-white/15 bg-white/[0.04] p-4">
                      <span className="text-[13px] font-bold text-white">{t.total}</span>
                      <span className="text-silver font-[family-name:var(--font-heading)] text-xl font-semibold" data-testid="planner-total">
                        {eur(result.price_min)} – {eur(result.price_max)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-600">{t.legal}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.structure}</div>
                    <ul className="mt-3 space-y-1.5">
                      {result.plan.structure?.map((s, i) => (
                        <li key={i} className="flex gap-2 text-[13px] text-zinc-400"><span className="mt-[7px] size-1 shrink-0 rounded-full bg-zinc-400" /> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.phases}</div>
                    <ol className="mt-3 space-y-2">
                      {result.plan.phases?.map((p, i) => (
                        <li key={i} className="flex gap-2.5 text-[13px] text-zinc-400">
                          <span className="text-silver shrink-0 font-semibold">{i + 1}.</span>
                          <span><b className="font-semibold text-zinc-200">{p.name}:</b> {p.text}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {result.plan.recommendation && (
                <div className="mt-8 rounded-xl border-l-2 border-zinc-300 bg-white/[0.03] p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.reco}</div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-300">{result.plan.recommendation}</p>
                </div>
              )}

              {state === "sent" ? (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4" data-testid="planner-offer-success">
                  <p className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={16} /> {t.sent}</p>
                  <button className="btn-ghost !py-2 !text-[12px]" onClick={reset} data-testid="planner-restart-btn">{t.restart}</button>
                </div>
              ) : (
                <div className="mt-8 rounded-xl border border-white/12 bg-white/[0.03] p-5" data-testid="planner-offer-form">
                  <div className="text-[14px] font-semibold text-white">{t.offerTitle}</div>
                  <p className="mt-1 text-[12.5px] text-zinc-500">{t.offerText}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input className="field !py-2.5 !text-[13px]" placeholder={t.name} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="planner-name-input" />
                    <input className="field !py-2.5 !text-[13px]" type="email" placeholder={t.email} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="planner-email-input" />
                    <input className="field !py-2.5 !text-[13px]" placeholder={t.companyF} value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} data-testid="planner-company-input" />
                    <input className="field !py-2.5 !text-[13px]" type="tel" placeholder={t.phoneF} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} data-testid="planner-phone-input" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <button className="btn-primary !py-2.5 !text-[13px]" onClick={requestOffer} disabled={!form.name || !form.email || state === "sending"} data-testid="planner-offer-btn">
                      {state === "sending" ? <><Loader2 size={14} className="animate-spin" /> {t.sending}</> : <>{t.send} <ArrowRight size={14} /></>}
                    </button>
                    <button className="text-xs text-zinc-500 transition-colors hover:text-white" onClick={reset} data-testid="planner-reset-btn">{t.restart}</button>
                  </div>
                  {state === "error" && <p className="mt-3 text-sm text-red-400">{t.error}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
