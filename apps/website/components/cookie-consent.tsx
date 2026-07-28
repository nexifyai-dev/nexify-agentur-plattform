"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, Settings2 } from "lucide-react";
import { useLang } from "@/lib/lang-context";

const KEY = "nexify-consent";

const T = {
  de: {
    title: "Cookies & Datenschutz",
    text: "Wir verwenden ausschließlich technisch notwendige Speicherungen. Optionale Kategorien (Statistik, Marketing) sind standardmäßig deaktiviert und werden nur mit Ihrer Einwilligung aktiviert.",
    more: "Cookie-Richtlinie",
    acceptAll: "Alle akzeptieren",
    necessaryOnly: "Nur notwendige",
    settings: "Einstellungen",
    save: "Auswahl speichern",
    catNecessary: "Notwendig",
    catNecessaryText: "Sprachwahl, Sitzung, Sicherheit – für den Betrieb der Website erforderlich. Immer aktiv.",
    catAnalytics: "Statistik",
    catAnalyticsText: "Anonymisierte Nutzungsstatistiken zur Verbesserung der Website. Derzeit nicht im Einsatz.",
    catMarketing: "Marketing",
    catMarketingText: "Dienste zur Erfolgsmessung von Kampagnen. Derzeit nicht im Einsatz.",
    always: "Immer aktiv",
  },
  en: {
    title: "Cookies & Privacy",
    text: "We only use technically necessary storage. Optional categories (analytics, marketing) are disabled by default and are only activated with your consent.",
    more: "Cookie Policy",
    acceptAll: "Accept All",
    necessaryOnly: "Necessary Only",
    settings: "Settings",
    save: "Save Selection",
    catNecessary: "Necessary",
    catNecessaryText: "Language selection, session, security – required for website operation. Always active.",
    catAnalytics: "Analytics",
    catAnalyticsText: "Anonymized usage statistics to improve the website. Currently not in use.",
    catMarketing: "Marketing",
    catMarketingText: "Services for measuring campaign success. Currently not in use.",
    always: "Always active",
  },
  nl: {
    title: "Cookies & privacy",
    text: "Wij gebruiken uitsluitend technisch noodzakelijke opslag. Optionele categorieën (statistiek, marketing) staan standaard uit en worden alleen met uw toestemming geactiveerd.",
    more: "Cookiebeleid",
    acceptAll: "Alles accepteren",
    necessaryOnly: "Alleen noodzakelijk",
    settings: "Instellingen",
    save: "Keuze opslaan",
    catNecessary: "Noodzakelijk",
    catNecessaryText: "Taalkeuze, sessie, beveiliging – vereist voor de werking van de website. Altijd actief.",
    catAnalytics: "Statistiek",
    catAnalyticsText: "Geanonimiseerde gebruiksstatistieken ter verbetering van de website. Momenteel niet in gebruik.",
    catMarketing: "Marketing",
    catMarketingText: "Diensten voor het meten van campagnes. Momenteel niet in gebruik.",
    always: "Altijd actief",
  },
};

type Consent = { necessary: true; analytics: boolean; marketing: boolean; ts: string };

export function getConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function Toggle({ on, disabled, onChange, testId }: { on: boolean; disabled?: boolean; onChange?: (v: boolean) => void; testId: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!on)}
      data-testid={testId}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-400/80" : "bg-white/15"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );
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
    if (!getConsent()) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    const openHandler = () => {
      const c = getConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setDetail(true);
      setVisible(true);
    };
    window.addEventListener("nexify-open-consent", openHandler);
    return () => window.removeEventListener("nexify-open-consent", openHandler);
  }, []);

  const persist = useCallback((a: boolean, m: boolean) => {
    const consent: Consent = { necessary: true, analytics: a, marketing: m, ts: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent("nexify-consent-changed", { detail: consent }));
    setVisible(false);
    setDetail(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-4 sm:p-6" data-testid="cookie-banner">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/15 bg-black/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
            <Cookie size={16} className="text-zinc-300" />
          </span>
          <div>
            <div className="text-[14px] font-semibold text-white">{t.title}</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">
              {t.text}{" "}
              <Link href="/cookie-richtlinie" className="underline hover:text-white">{t.more}</Link>
            </p>
          </div>
        </div>

        {detail && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4" data-testid="cookie-settings-panel">
            {[
              { label: t.catNecessary, text: t.catNecessaryText, on: true, disabled: true, note: t.always, testId: "cookie-toggle-necessary" },
              { label: t.catAnalytics, text: t.catAnalyticsText, on: analytics, onChange: setAnalytics, testId: "cookie-toggle-analytics" },
              { label: t.catMarketing, text: t.catMarketingText, on: marketing, onChange: setMarketing, testId: "cookie-toggle-marketing" },
            ].map((c) => (
              <div key={c.testId} className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-200">
                    {c.label}
                    {c.note && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{c.note}</span>}
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">{c.text}</p>
                </div>
                <Toggle on={c.on} disabled={c.disabled} onChange={c.onChange} testId={c.testId} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="btn-primary !px-5 !py-2 !text-[12.5px]" onClick={() => persist(true, true)} data-testid="cookie-accept-all">
            {t.acceptAll}
          </button>
          <button className="btn-ghost !px-5 !py-2 !text-[12.5px]" onClick={() => persist(false, false)} data-testid="cookie-necessary-only">
            {t.necessaryOnly}
          </button>
          {detail ? (
            <button className="btn-ghost !px-5 !py-2 !text-[12.5px]" onClick={() => persist(analytics, marketing)} data-testid="cookie-save">
              {t.save}
            </button>
          ) : (
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-zinc-400 transition-colors hover:text-white" onClick={() => setDetail(true)} data-testid="cookie-open-settings">
              <Settings2 size={13} /> {t.settings}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
