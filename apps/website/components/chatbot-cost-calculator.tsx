// FILE: apps/website/components/chatbot-cost-calculator.tsx
// NIR: 08.08.2026 11:50
// UPDATED: 08.08.2026 11:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Interaktiver Chatbot-Kosten-Rechner — Anfragen/Monat + Komplexität → Vergleich Eigenbau / NeXify / Full-Service-Agentur
// WHY: M-07 Linkbait/Lead-Magnet; reine Client-Berechnung, keine Server-Logik
// BEST-PRACTICE: CI-konform (ZK §7); Annahmen offen auf der Seite; NeXify = KI-Begleiter-Preisliste (449 € netto/Tag)
// PITFALL: V-GTM-07: Agentur-Spannen nur aus recherchierten Quellen 2026 (WebChatAgent), keine Eigenwerte erfunden
// DEPENDS: lib/gtm/free-tools (computeChatbotCosts, CHATBOT_COMPLEXITIES)
// DOCS-REF: docs/standards/ZENTRALE-KONFIGURATION.md §7
// SESSION: t_dfa9459e — M-07 Free-Tools
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CHATBOT_COMPLEXITIES, CHATBOT_ASSUMPTIONS, computeChatbotCosts } from "@/lib/gtm/free-tools";
import { euro } from "@/lib/utils";

const UTM = "?utm_source=chatbot-kosten-rechner&utm_medium=organic&utm_campaign=m07_free_tools";

export function ChatbotCostCalculator() {
  const [requests, setRequests] = useState(1000);
  const [complexity, setComplexity] = useState<"einfach" | "mittel" | "komplex">("mittel");

  const result = computeChatbotCosts(requests, complexity);
  const assumptions = CHATBOT_ASSUMPTIONS[complexity];
  const hasInput = requests > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-5" data-testid="chatbot-cost-calculator">
      <section className="glass h-fit p-6 md:p-8 lg:col-span-2" aria-label="Eingaben" data-testid="chatbot-inputs">
        <div className="space-y-6">
          <label className="block">
            <span className="text-sm font-medium text-zinc-300">Anfragen pro Monat (z. B. Support-Chat, Website-Kontakte)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={10000000}
              value={requests}
              onChange={(e) => setRequests(Number(e.target.value))}
              className="field"
              data-testid="chatbot-requests"
              aria-label="Anfragen pro Monat"
            />
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-zinc-300">Komplexität</legend>
            <div className="mt-3 space-y-2">
              {CHATBOT_COMPLEXITIES.map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/25 data-[checked=true]:border-[#C8FF00]/50"
                  data-checked={complexity === c}
                  data-testid={`chatbot-complexity-${c}`}
                >
                  <input
                    type="radio"
                    name="complexity"
                    value={c}
                    checked={complexity === c}
                    onChange={() => setComplexity(c)}
                    className="mt-1 size-4 accent-[#C8FF00]"
                  />
                  <span className="text-sm">
                    <span className="block font-medium text-zinc-200">{CHATBOT_ASSUMPTIONS[c].label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-zinc-500">{CHATBOT_ASSUMPTIONS[c].description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="glass p-6 md:p-8 lg:col-span-3" aria-label="Kostenvergleich" data-testid="chatbot-results">
        {hasInput ? (
          <>
            <p className="text-sm text-zinc-400">
              Kostenschätzung für <strong className="text-white">{assumptions.label}</strong>.
              Einmalig (netto), ohne laufende Plattform-/Hostingkosten; NeXify-Tagessatz 449 €.
            </p>
            <div className="mt-6 space-y-4" aria-live="polite">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4" data-testid="chatbot-diy">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Eigenbau im eigenen Team</p>
                    <p className="text-xs text-zinc-500">ca. {CHATBOT_ASSUMPTIONS[complexity].diyDays} Arbeitstage · API ca. {euro(result.diy.apiPerMonth)}/Monat</p>
                  </div>
                  <p className="text-right font-[family-name:var(--font-heading)] text-xl font-semibold text-zinc-200">
                    {euro(result.diy.once)}
                  </p>
                </div>
                <p className="mt-2 text-xs text-zinc-600">{result.diy.maintenanceNote} · laufende Pflege und Updates in Ihrer Verantwortung</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4" data-testid="chatbot-agency">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Full-Service-Agentur (Markt 2026)</p>
                    <p className="text-xs text-zinc-500">Spannbreite lt. Marktrecherche · Wartung ca. {euro(result.agency.maintenancePerYear)}/Jahr</p>
                  </div>
                  <p className="text-right font-[family-name:var(--font-heading)] text-xl font-semibold text-zinc-200">
                    {euro(result.agency.min)} – {euro(result.agency.max)}
                  </p>
                </div>
                <p className="mt-2 text-xs text-zinc-600">Solide KMU-Projekte laut WebChatAgent-Marktrecherche 2026 (3.000–30.000 € je Komplexität).</p>
              </div>

              <div className="rounded-2xl border border-[#C8FF00]/40 bg-[#C8FF00]/[0.06] px-5 py-4" data-testid="chatbot-nexify">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">NeXify AI — KI-Begleiter</p>
                    <p className="text-xs text-zinc-400">ca. {CHATBOT_ASSUMPTIONS[complexity].nexifyDays} Arbeitstage × 449 € netto · Transparenz statt Paketnebel</p>
                  </div>
                  <p className="text-right font-[family-name:var(--font-heading)] text-xl font-semibold text-[#C8FF00]">
                    {euro(result.nexify.once)}
                  </p>
                </div>
                <p className="mt-2 text-xs text-zinc-500">{result.nexify.note}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 px-5 py-4" data-testid="chatbot-3year">
              <p className="text-xs text-zinc-500">3-Jahres-Gesamtkosten (inkl. Wartung/API):</p>
              <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-sm">
                <span className="text-zinc-400">Eigenbau <strong className="text-white">{euro(result.threeYear.diy)}</strong></span>
                <span className="text-zinc-400">Agentur <strong className="text-white">{euro(result.threeYear.agency)}</strong></span>
                <span className="text-zinc-400">NeXify <strong className="text-[#C8FF00]">{euro(result.threeYear.nexify)}</strong></span>
              </div>
              <p className="mt-2 text-xs text-zinc-600">
                Eigenbau: einmalig + API + Pflegeaufwand (2–5 Std./Woche, nicht monetarisiert). Agentur: Projekt + 15 % Wartung/Jahr. NeXify: einmalig, Erweiterungen nach Aufwand.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/leistungen/ki-begleiter${UTM}`}
                className="btn-primary !px-6 !py-3 !text-[13px]"
                data-testid="chatbot-cta-begleiter"
              >
                KI-Begleiter ansehen <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`/audit${UTM}`}
                className="btn-ghost !px-6 !py-3 !text-[13px]"
                data-testid="chatbot-cta-audit"
              >
                Kostenloser KI-Audit
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-500" data-testid="chatbot-empty">
            Geben Sie Ihr Anfragevolumen ein, um den Kostenvergleich zu sehen.
          </p>
        )}
      </section>
    </div>
  );
}
