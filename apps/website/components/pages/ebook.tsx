// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/components/pages/ebook.tsx
// NIR: 08.08.2026 12:06
// UPDATED: 08.08.2026 12:06
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Client-Komponente der E-Book-Landingpage — Formular mit Opt-in, UTM-Erfassung, Erfolgs-/Fehlerzustand, Strategie-Übersicht.
// WHY: M-01 — Scarcity + 10 Strategien als Conversion-Elemente nach Frewert-Muster (Trick 7), CI-Design.
// BEST-PRACTICE: UTM aus URL in Hidden-Fields; Opt-in-Checkbox erforderlich; PDF-Link immer verfügbar.
// PITFALL: V-GTM-LM-01: PDF auch bei Mail-Fehler anbieten (kein falscher Erfolg).
// DEPENDS: /api/ebook
// DOCS-REF: docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md
// SESSION: kanban-t_34e02d47

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, FileDown } from "lucide-react";
import { company } from "@/lib/company";

const PDF_HREF = "/docs/nexify-ebook-ki-automation.pdf";

const STRATEGIES = [
  { n: "1", t: "KI-Chatbot für Website & WhatsApp — Rückfragen um 50 % senken", d: "Rund-um-die-Uhr-Antworten auf Standardfragen, Termine direkt buchen." },
  { n: "2", t: "E-Mail-Postfach automatisieren — 90 % der Routine-Mails sortiert", d: "KI-Agent kategorisiert, entwirft Antworten, priorisiert die Warteschlange." },
  { n: "3", t: "Terminbuchung ohne Ping-Pong — 24/7 ohne Büro", d: "Kalender-Anbindung mit freien Slots, automatische Erinnerungen." },
  { n: "4", t: "Angebote in Stunden statt Tagen — aus Stammdaten generiert", d: "Entwurf aus Preisliste + Kundendaten, Freigabe durch Sie." },
  { n: "5", t: "Lead-Nachverfolgung, die niemanden vergisst", d: "Automatische Erfassung, Qualifizierung und Sequenz bis zur Antwort." },
  { n: "6", t: "Rechnungen & Belege automatisch verbuchen", d: "OCR-Erfassung, Prüfung, Freigabe-Workflow — Skonto-Fristen sicher." },
  { n: "7", t: "Berichte & Dokumente aus Rohdaten — ohne Copy-Paste", d: "Wöchentliche Zahlen und Statusberichte automatisch zusammengestellt." },
  { n: "8", t: "CRM & Systeme pflegen sich selbst", d: "Kontakte, Notizen und Korrespondenz ohne manuelles Nachtragen." },
  { n: "9", t: "Social Media & Content aus einem Baustein-System", d: "Wochenpläne und Posts aus Ihrem Themenpool — 15 Minuten Aufwand." },
  { n: "10", t: "Qualitäts-Checks & interne Prozesse mit Wächter-Agenten", d: "Autonome Checks melden nur echte Abweichungen." },
];

export function EbookLanding() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [utm] = useState<{ source?: string; medium?: string; campaign?: string }>(() => {
    // Lazy-Initializer: liest URL nur einmal beim Mount (kein setState-in-effect)
    if (typeof window === "undefined") return {};
    const sp = new URLSearchParams(window.location.search);
    const pick = (k: string) => sp.get(k)?.slice(0, 60) || undefined;
    return { source: pick("utm_source"), medium: pick("utm_medium"), campaign: pick("utm_campaign") };
  });
  const [state, setState] = useState<"idle" | "sending" | "ok" | string>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !privacy) return;
    setState("sending");
    try {
      const res = await fetch("/api/ebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), ...utm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState(typeof data.error === "string" ? data.error : "Versand fehlgeschlagen — E-Book unten direkt laden.");
        return;
      }
      setState("ok");
    } catch {
      setState("Netzwerkfehler. E-Book unten direkt laden.");
    }
  };

  const showDownload = state === "ok" || (state !== "idle" && state !== "sending");

  return (
    <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="ebook-page">
      <div className="site-container max-w-3xl">
        <span className="eyebrow">E-Book · 100 % kostenlos</span>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
          KI-Automation für den Mittelstand:{" "}
          <span className="text-[#C8FF00]">10 Strategien, die sofort Zeit &amp; Geld sparen</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-400">
          Konkrete Anwendungsfälle für DACH-KMU — vom Chatbot bis zum autonomen Agenten. Jede Strategie
          mit Aufwand, Einsparung und erstem Schritt. <strong className="text-zinc-200">Kostenlos, solange verfügbar.</strong>
        </p>

        <ul className="mt-10 space-y-2.5" data-testid="ebook-strategies">
          {STRATEGIES.map((s) => (
            <li
              key={s.n}
              className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#C8FF00]/15 font-heading text-xs font-bold text-[#C8FF00]">
                {s.n}
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-200">{s.t}</p>
                <p className="text-xs text-zinc-500">{s.d}</p>
              </div>
            </li>
          ))}
        </ul>

        {state === "ok" ? (
          <div className="mt-10 rounded-2xl border border-[#C8FF00]/30 bg-[#C8FF00]/5 p-8 text-center" data-testid="ebook-success">
            <p className="font-heading text-2xl text-white">Danke, {name.trim() || "dort"}! 🎉</p>
            <p className="mt-2 text-zinc-400">Ihr E-Book ist bereit. Wir haben Ihnen den Link auch per E-Mail geschickt.</p>
            <a
              href={PDF_HREF}
              download
              className="btn-primary mx-auto mt-6 inline-flex items-center gap-2 !px-8 !py-3.5"
              data-testid="ebook-download"
            >
              <FileDown className="size-5" /> E-Book jetzt herunterladen
            </a>
            <p className="mt-4 text-xs text-zinc-500">
              Haben Sie Fragen? <Link href="/rueckruf" className="underline hover:text-zinc-300">Kostenlose Automatisierungs-Analyse</Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            data-testid="ebook-form"
          >
            <p className="text-sm font-medium text-zinc-200">E-Book anfordern — kostenlos &amp; unverbindlich:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="field"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="ebook-name"
                autoComplete="name"
              />
              <input
                className="field"
                type="email"
                required
                placeholder="E-Mail *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="ebook-email"
                autoComplete="email"
              />
            </div>
            <label className="flex items-start gap-2 text-xs text-zinc-500">
              <input
                type="checkbox"
                className="mt-0.5 size-4 accent-white"
                checked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
                required
                data-testid="ebook-privacy"
              />
              <span>
                Ich willige ein, dass {company.brand} mir das E-Book per E-Mail zusendet und mich zu
                Automatisierungs-Themen kontaktiert. Hinweise in der{" "}
                <Link href="/datenschutz" className="underline hover:text-zinc-300">Datenschutzerklärung</Link>.
              </span>
            </label>
            <button
              type="submit"
              disabled={state === "sending" || !privacy}
              className="btn-primary !px-6 !py-3 !text-[13px]"
              data-testid="ebook-submit"
            >
              {state === "sending" ? "Senden …" : "E-Book kostenlos anfordern"}
              <ArrowRight className="size-4" />
            </button>
            {state !== "idle" && state !== "sending" && state !== "ok" && (
              <p className="text-sm text-amber-300/90" data-testid="ebook-error">{state}</p>
            )}
            <p className="text-xs text-zinc-600">
              Tagessatz {company.dayRate}&nbsp;€ netto · nur B2B.{" "}
              <a href={PDF_HREF} className="underline hover:text-zinc-400" data-testid="ebook-pdf-direct">PDF direkt</a>
              {" · "}
              <a href="/docs/nexify-ebook-ki-automation.html" className="underline hover:text-zinc-400">HTML</a>
            </p>
          </form>
        )}

        {showDownload && state !== "ok" && (
          <p className="mt-4" data-testid="ebook-pdf-fallback">
            <a href={PDF_HREF} className="text-sm text-zinc-300 underline hover:text-white">E-Book direkt herunterladen</a>
          </p>
        )}
      </div>
    </main>
  );
}
