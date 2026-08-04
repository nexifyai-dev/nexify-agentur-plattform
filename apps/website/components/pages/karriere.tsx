// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/components/pages/karriere.tsx
// NIR: 04.08.2026 09:40
// UPDATED: 04.08.2026 09:40
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Karriere-Seite — ehrlich keine offenen Stellen, Initiativbewerbung per E-Mail
// WHY: Talent-Page fehlte; ehrliche Darstellung ohne falsche Hoffnungen
// BEST-PRACTICE: Direkter mailto-Link, kein eigenes Formular nötig
// PITFALL: V-KARRIERE-01: Keine erfundenen Stellen ausschreiben
// DEPENDS: company lib
// DOCS-REF: docs/governance/CHARTA.md
// SESSION: issue-230-karriere-7dd5

"use client";

import Link from "next/link";
import { company } from "@/lib/company";
import { Mail, Users, Zap, Code2 } from "lucide-react";

const LOOKING_FOR = [
  {
    icon: Code2,
    title: "Fullstack-Entwickler (Next.js / FastAPI)",
    text: "Du baust skalierbare Web-Apps und hast Lust, AI-Features zu integrieren.",
  },
  {
    icon: Zap,
    title: "AI / Automation Spezialist",
    text: "Du kennst LangChain, n8n-Alternativen oder baust eigene Agenten-Pipelines.",
  },
  {
    icon: Users,
    title: "Sales & GTM (B2B DACH)",
    text: "Du weißt, wie man KMU für Digitalisierung begeistert — ohne Kaltakquise-Spam.",
  },
];

export function KarrierePage() {
  const mailtoLink = `mailto:${company.email}?subject=Initiativbewerbung%20NeXify%20AI&body=Hallo%2C%0A%0Aich%20bewerbe%20mich%20initiativ%20bei%20NeXify%20AI.%0A%0AName%3A%0ARolle%2FSkills%3A%0ALinkedIn%2FGitHub%3A%0ANachricht%3A`;

  return (
    <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="karriere-page">
      <div className="site-container max-w-3xl">
        {/* Badge */}
        <span className="eyebrow">Karriere · Kein offenes Stellenangebot</span>

        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
          Wachse mit NeXify AI
        </h1>

        {/* Honest status */}
        <div
          className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4"
          data-testid="karriere-no-openings"
        >
          <p className="text-sm leading-relaxed text-amber-200/80">
            <strong className="font-semibold text-amber-300">Aktuell keine offenen Stellen.</strong>{" "}
            Wir sind ein kleines, fokussiertes Team. Wenn du wirklich überzeugt bist, schreib uns
            eine ehrliche Initiativbewerbung — wir lesen jede.
          </p>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          NeXify AI ist ein Solo-geführtes KI-Beratungsunternehmen in Venlo (NL) mit Kunden in
          DACH. Wir automatisieren Geschäftsprozesse, bauen Websites und AI-Agenten — alles mit
          echten Ergebnissen statt Buzz.
        </p>

        {/* What we're looking for */}
        <h2 className="mt-12 text-xl font-semibold text-white">
          Was uns interessiert (wenn wir wachsen)
        </h2>
        <div className="mt-6 grid gap-4" data-testid="karriere-profiles">
          {LOOKING_FOR.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-5"
            >
              <item.icon
                className="mt-0.5 size-5 shrink-0 text-[#B8F04C]"
                aria-hidden
              />
              <div>
                <p className="font-medium text-zinc-200">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white">Initiativbewerbung</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Kein Formular, kein Tracking — einfach eine ehrliche E-Mail mit deinem Hintergrund,
            was du beitragen kannst und warum NeXify AI passt.
          </p>
          <a
            href={mailtoLink}
            className="btn-primary mt-5 inline-flex items-center gap-2"
            data-testid="karriere-mailto"
          >
            <Mail className="size-4" />
            Initiativbewerbung senden
          </a>
          <p className="mt-4 text-xs text-zinc-600">
            Direkt: <span className="text-zinc-500">{company.email}</span>
          </p>
        </div>

        {/* Developer note: API docs */}
        <div className="mt-8 rounded-xl border border-white/6 bg-white/[0.02] p-5">
          <p className="text-sm text-zinc-500">
            <strong className="font-medium text-zinc-400">Für Entwickler:</strong> Unsere
            öffentliche API-Dokumentation findest du unter{" "}
            <a
              href="https://api.nexifyai.cloud/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8F04C]/80 underline underline-offset-4 hover:text-[#B8F04C]"
              data-testid="karriere-api-docs"
            >
              api.nexifyai.cloud/docs
            </a>
            .
          </p>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Fragen?{" "}
          <Link href="/kontakt" className="underline underline-offset-4">
            Kontaktseite
          </Link>{" "}
          oder direkt per{" "}
          <a
            href={`https://wa.me/${company.phoneHref.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    </main>
  );
}
