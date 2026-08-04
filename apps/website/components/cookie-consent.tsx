"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/lang-context";

const KEY = "nexify-consent";

const T = {
  de: { title: "Cookies & Datenschutz", text: "Wir verwenden ausschließlich technisch notwendige Speicherungen. Optionale Kategorien (Statistik, Marketing) sind standardmäßig deaktiviert.", more: "Cookie-Richtlinie", acceptAll: "Alle akzeptieren", necessaryOnly: "Nur notwendige", settings: "Einstellungen", save: "Auswahl speichern", catNecessary: "Notwendig", catNecessaryText: "Immer aktiv.", catAnalytics: "Statistik", catAnalyticsText: "Derzeit nicht im Einsatz.", catMarketing: "Marketing", catMarketingText: "Derzeit nicht im Einsatz.", always: "Immer aktiv" },
  en: { title: "Cookies & Privacy", text: "We only use technically necessary storage. Optional categories are disabled by default.", more: "Cookie Policy", acceptAll: "Accept All", necessaryOnly: "Necessary Only", settings: "Settings", save: "Save Selection", catNecessary: "Necessary", catNecessaryText: "Always active.", catAnalytics: "Analytics", catAnalyticsText: "Currently not in use.", catMarketing: "Marketing", catMarketingText: "Currently not in use.", always: "Always active" },
  nl: { title: "Cookies & privacy", text: "Wij gebruiken uitsluitend technisch noodzakelijke opslag.", more: "Cookiebeleid", acceptAll: "Alles accepteren", necessaryOnly: "Alleen noodzakelijk", settings: "Instellingen", save: "Keuze opslaan", catNecessary: "Noodzakelijk", catNecessaryText: "Altijd actief.", catAnalytics: "Statistiek", catAnalyticsText: "Niet in gebruik.", catMarketing: "Marketing", catMarketingText: "Niet in gebruik.", always: "Altijd actief" },
};

type Consent = { necessary: true; analytics: boolean; marketing: boolean; ts: string };

export function getConsent(): Consent | null {
  try { const raw = window.localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as Consent) : null; }
  catch { return null; }
}

function Toggle({ on, disabled, onChange, testId }: { on: boolean; disabled?: boolean; onChange?: (v: boolean) => void; testId: string }) {
  return <button type="button" disabled={disabled} onClick={() => onChange?.(!on)} data-testid={testId} className={`relative h-7 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-400/80" : "bg-white/15"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`} aria-pressed={on}><span className={`absolute top-0.5 size-6 rounded-full bg-white transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} /></button>;
}

export function CookieConsent() {
  const pathname = usePathname() || "";
  const { lang } = useLang();
  const t = T[lang];
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/konto")) return;
    if (!getConsent()) { const timer = setTimeout(() => setVisible(true), 800); return () => clearTimeout(timer); }
  }, [pathname]);

  useEffect(() => {
    const openHandler = () => { const c = getConsent(); setAnalytics(c?.analytics ?? false); setMarketing(c?.marketing ?? false); setDetail(true); setVisible(true); };
    window.addEventListener("nexify-open-consent", openHandler);
    return () => window.removeEventListener("nexify-open-consent", openHandler);
  }, []);

  const persist = useCallback((a: boolean, m: boolean) => {
    const consent: Consent = { necessary: true, analytics: a, marketing: m, ts: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent("nexify-consent-changed", { detail: consent }));
    setVisible(false); setDetail(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6" data-testid="cookie-banner">
      <div className="pointer-events-auto mx-auto mb-[4.5rem] max-w-2xl rounded-2xl border border-white/15 bg-black/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:mb-0 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>
          </span>
          <div className="min-w-0"><div className="text-[14px] font-semibold text-white">{t.title}</div><p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">{t.text} <Link href="/cookie-richtlinie" className="underline hover:text-white">{t.more}</Link></p></div>
        </div>
        {detail && (
          <div className="mt-4 max-h-[40vh] space-y-3 overflow-y-auto border-t border-white/10 pt-4 sm:max-h-none" data-testid="cookie-settings-panel">
            {[{label:t.catNecessary,text:t.catNecessaryText,on:true,disabled:true,note:t.always,testId:"cookie-toggle-necessary"},{label:t.catAnalytics,text:t.catAnalyticsText,on:analytics,onChange:setAnalytics,testId:"cookie-toggle-analytics"},{label:t.catMarketing,text:t.catMarketingText,on:marketing,onChange:setMarketing,testId:"cookie-toggle-marketing"}].map(c=><div key={c.testId} className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-zinc-200">{c.label}{c.note&&<span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{c.note}</span>}</div><p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">{c.text}</p></div><Toggle on={c.on} disabled={"disabled" in c ? c.disabled : undefined} onChange={"onChange" in c ? c.onChange : undefined} testId={c.testId} /></div>)}
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button className="btn-primary min-h-11 w-full !px-5 !py-2.5 !text-[13px] sm:w-auto" onClick={() => persist(true, true)} data-testid="cookie-accept-all">{t.acceptAll}</button>
          <button className="btn-ghost min-h-11 w-full !px-5 !py-2.5 !text-[13px] sm:w-auto" onClick={() => persist(false, false)} data-testid="cookie-necessary-only">{t.necessaryOnly}</button>
          {detail ? <button className="btn-ghost min-h-11 w-full !px-5 !py-2.5 !text-[13px] sm:w-auto" onClick={() => persist(analytics, marketing)} data-testid="cookie-save">{t.save}</button>
          : <button className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-zinc-400 transition-colors hover:text-white sm:w-auto" onClick={() => setDetail(true)} data-testid="cookie-open-settings"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> {t.settings}</button>}
        </div>
      </div>
    </div>
  );
}
