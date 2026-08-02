// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/checkliste/page.tsx
// NIR: 02.08.2026 10:10
// UPDATED: 02.08.2026 10:10
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Lead-magnet stub — KI/Website-Checkliste with light email gate via /api/contact
// WHY: Free acquisition conversion without new SaaS; Resend/backend already wired
// BEST-PRACTICE: Honest stub until PDF asset exists; never fake download success
// PITFALL: V-GTM-LM-01: Do not claim PDF sent if contact API returns 5xx
// DEPENDS: /api/contact, company, lib/seo
// DOCS-REF: docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
// SESSION: proactive-gaps-acquisition-7dd5

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, FileDown } from "lucide-react";
import { company } from "@/lib/company";

const CHECKLIST_PREVIEW = [
  "Zielgruppe & Angebot in einem Satz klar?",
  "Impressum, Datenschutz, Cookie-Banner B2B-konform?",
  "Eine primäre CTA oberhalb der Falz?",
  "Terminbuchung oder Rückruf erreichbar in ≤2 Klicks?",
  "Mobile: Formulare tippbar, Telefon-Link aktiv?",
  "Ladezeit & Core Web Vitals grob geprüft?",
  "Tracking nur mit Consent — kein Dark Pattern?",
  "Nächste 3 SEO-Intent-Seiten priorisiert?",
];

export default function ChecklistePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | string>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !privacy) return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Checkliste",
          email: email.trim(),
          message:
            "Lead-Magnet: Bitte Website-/KI-Projekt-Checkliste zusenden (Stub — PDF folgt). Quelle: /checkliste",
          language: "de",
          type: "lead_magnet",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState(typeof data.error === "string" ? data.error : "Versand fehlgeschlagen.");
        return;
      }
      setState("ok");
    } catch {
      setState("Netzwerkfehler. Bitte später erneut oder mail@nexifyai.cloud.");
    }
  };

  return (
    <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="checkliste-page">
      <div className="site-container max-w-3xl">
        <span className="eyebrow">Lead-Magnet · kostenfrei</span>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
          Checkliste: Website &amp; KI-Projekt startklar?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-400">
          Kurze B2B-Checkliste für KMU — ohne Sales-Call. Tragen Sie Ihre E-Mail ein; wir senden
          die Liste zu (PDF-Asset wird ergänzt). Kein Newsletter-Zwang, kein Paid Funnel.
        </p>

        <ul className="mt-10 space-y-3" data-testid="checkliste-preview">
          {CHECKLIST_PREVIEW.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
            >
              <FileDown className="mt-0.5 size-4 shrink-0 text-zinc-500" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        {state === "ok" ? (
          <div
            className="mt-10 rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-6 text-sm text-emerald-200"
            data-testid="checkliste-success"
          >
            Danke — Anfrage eingegangen. Wir melden uns mit der Checkliste an Ihre E-Mail.
            Parallel:{" "}
            <Link href="/rueckruf" className="underline hover:text-white">
              Termin buchen
            </Link>{" "}
            oder{" "}
            <Link href="/vergleich" className="underline hover:text-white">
              Preisvergleich ansehen
            </Link>
            .
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            data-testid="checkliste-form"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="field"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="checkliste-name"
                autoComplete="name"
              />
              <input
                className="field"
                type="email"
                required
                placeholder="E-Mail *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="checkliste-email"
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
                data-testid="checkliste-privacy"
              />
              <span>
                Ich willige ein, dass {company.brand} mich zur Checkliste kontaktiert. Hinweise in der{" "}
                <Link href="/datenschutz" className="underline hover:text-zinc-300">
                  Datenschutzerklärung
                </Link>
                .
              </span>
            </label>
            <button
              type="submit"
              disabled={state === "sending" || !privacy}
              className="btn-primary !px-6 !py-3 !text-[13px]"
              data-testid="checkliste-submit"
            >
              {state === "sending" ? "Senden …" : "Checkliste anfordern"}
              <ArrowRight className="size-4" />
            </button>
            {state !== "idle" && state !== "sending" && state !== "ok" && (
              <p className="text-sm text-red-400" data-testid="checkliste-error">
                {state}
              </p>
            )}
            <p className="text-xs text-zinc-600">
              Stub: Bis das PDF live ist, erhalten Sie die Punkte per Antwort-Mail / Follow-up.
              Tagessatz {company.dayRate}&nbsp;€ netto · nur B2B.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
