// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/partner/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Partner / Referral landing — free co-marketing without affiliate SaaS payout
// WHY: Free CAC via complementary professionals (tax, SEO, freelance) referring KMU
// BEST-PRACTICE: Clear value exchange; rev-share terms documented later, not invented here
// PITFALL: V-CAC-PART-01: Do not promise commission % without signed terms
// DEPENDS: /api/contact, company, lib/seo
// DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
// SESSION: research-free-cac-full-7dd5

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Handshake } from "lucide-react";
import { company } from "@/lib/company";

const FITS = [
  "Steuerberater & Buchhalter mit Digitalisierungsbedarf bei Mandanten",
  "SEO-/Content-Freelancer ohne Dev-Kapazität",
  "Branding-/Design-Studios ohne Shop/App-Umsetzung",
  "IT-Freelancer, die AI-Automatisierung outsourcen wollen",
  "IHK-/Netzwerk-Organizer (Warm Intro, kein Spam)",
];

export default function PartnerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [note, setNote] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | string>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !privacy) return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: firm.trim() || null,
          message: `Partner-Anfrage (Referral/Co-Marketing).\nFirma: ${firm}\nNotiz: ${note || "—"}\nQuelle: /partner`,
          language: "de",
          type: "partner",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState(typeof data.error === "string" ? data.error : "Versand fehlgeschlagen.");
        return;
      }
      setState("ok");
    } catch {
      setState("Netzwerkfehler. Bitte mail@nexifyai.cloud schreiben.");
    }
  };

  return (
    <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="partner-page">
      <div className="site-container max-w-3xl">
        <span className="eyebrow">Partner · 0 € Einstieg</span>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
          Empfehlungspartner für NeXify AI
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-400">
          Sie betreuen KMU, wir liefern Websites, Shops, Apps und AI-Automatisierung zum festen
          Tagessatz von {company.dayRate}&nbsp;€ netto. Kein Affiliate-Tool-Abo nötig — erst
          Kennenlernen, dann klare Empfehlungsregeln (Rev-Share-Details schriftlich, nicht hier
          versprochen).
        </p>

        <ul className="mt-10 space-y-3" data-testid="partner-fit-list">
          {FITS.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-zinc-300">
              <Handshake className="mt-0.5 size-4 shrink-0 text-emerald-400/80" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {state === "ok" ? (
            <p className="text-zinc-200" data-testid="partner-success">
              Danke — wir melden uns persönlich. Parallel:{" "}
              <Link href="/rueckruf" className="underline underline-offset-4">
                Rückruf buchen
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4" data-testid="partner-form">
              <input
                className="field"
                placeholder="Ihr Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="partner-name"
              />
              <input
                className="field"
                type="email"
                placeholder="Geschäftliche E-Mail *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="partner-email"
              />
              <input
                className="field"
                placeholder="Firma / Rolle"
                value={firm}
                onChange={(e) => setFirm(e.target.value)}
                data-testid="partner-firm"
              />
              <textarea
                className="field min-h-24"
                placeholder="Wie könnten wir uns ergänzen?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                data-testid="partner-note"
              />
              <label className="flex items-start gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  className="mt-1"
                  data-testid="partner-privacy"
                />
                <span>
                  Ich bin Unternehmer/in und willige in die Kontaktaufnahme ein (
                  <Link href="/datenschutz" className="underline">
                    Datenschutz
                  </Link>
                  ).
                </span>
              </label>
              <button
                type="submit"
                className="btn-primary inline-flex items-center gap-2"
                disabled={state === "sending"}
                data-testid="partner-submit"
              >
                Partnergespräch anfragen <ArrowRight className="size-4" />
              </button>
              {state !== "idle" && state !== "sending" && state !== "ok" && (
                <p className="text-sm text-red-400" data-testid="partner-error">
                  {state}
                </p>
              )}
            </form>
          )}
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Warm Intro Templates: siehe interne GTM-Docs. Direkt:{" "}
          <a href={`https://wa.me/${company.phoneHref.replace(/\D/g, "")}`} className="underline">
            WhatsApp Business
          </a>
          .
        </p>
      </div>
    </main>
  );
}
