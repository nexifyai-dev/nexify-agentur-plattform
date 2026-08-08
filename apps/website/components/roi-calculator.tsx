// FILE: apps/website/components/roi-calculator.tsx
// NIR: 08.08.2026 11:45
// UPDATED: 08.08.2026 11:45
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Interaktiver KI-ROI-Rechner — Mitarbeiterzahl, Std/Woche, Stundensatz → Ersparnis bei 20/40/60 % Automatisierung
// WHY: M-07 Linkbait/Lead-Magnet; reine Client-Berechnung, keine Server-Logik
// BEST-PRACTICE: CI-konform (ZK §7: Lime #C8FF00, dark, Outfit/Manrope); aria-live; Randfaelle abgefangen (0-Eingaben → Hinweis)
// PITFALL: V-GTM-07: keine erfundenen Benchmarks — Ersparnis rein aus Nutzereingaben
// DEPENDS: lib/gtm/free-tools (computeRoi), lib/site-data (company)
// DOCS-REF: docs/standards/ZENTRALE-KONFIGURATION.md §7
// SESSION: t_dfa9459e — M-07 Free-Tools
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { computeRoi, WORK_WEEKS_PER_YEAR } from "@/lib/gtm/free-tools";
import { euro } from "@/lib/utils";

const UTM_PREISE = "?utm_source=ki-roi-rechner&utm_medium=organic&utm_campaign=m07_free_tools";
const UTM_AUDIT = "?utm_source=ki-roi-rechner&utm_medium=organic&utm_campaign=m07_free_tools_audit";

export function RoiCalculator() {
  const [employees, setEmployees] = useState(10);
  const [hours, setHours] = useState(5);
  const [rate, setRate] = useState(60);

  const result = computeRoi({ employees, hoursPerWeekPerEmployee: hours, hourlyRate: rate });
  const hasInput = employees > 0 && hours > 0 && rate > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-5" data-testid="roi-calculator">
      <section className="glass h-fit p-6 md:p-8 lg:col-span-2" aria-label="Eingaben" data-testid="roi-inputs">
        <div className="space-y-6">
          <label className="block">
            <span className="text-sm font-medium text-zinc-300">Mitarbeiter, die manuell arbeiten</span>
            <span className="mt-1 flex items-baseline gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={100000}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="field"
                data-testid="roi-employees"
                aria-label="Anzahl Mitarbeiter"
              />
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-300">Stunden pro Woche und Mitarbeiter (manuelle Routine)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={40}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="field"
              data-testid="roi-hours"
              aria-label="Stunden pro Woche"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-300">Stundensatz (Vollkosten in €)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={10000}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="field"
              data-testid="roi-rate"
              aria-label="Stundensatz in Euro"
            />
          </label>
          <p className="text-xs leading-5 text-zinc-500">
            Basis: {WORK_WEEKS_PER_YEAR} Arbeitswochen pro Jahr. Die Ersparnis ist eine reine
            Hochrechnung aus Ihren Eingaben — kein Benchmark, keine pauschalisierten Annahmen.
          </p>
        </div>
      </section>

      <section className="glass p-6 md:p-8 lg:col-span-3" aria-label="Ergebnis" data-testid="roi-results">
        {hasInput ? (
          <>
            <p className="text-sm text-zinc-400">
              Ihre manuelle Routinearbeit kostet jährlich{" "}
              <strong className="text-white">{euro(result.yearlyManualCost)}</strong> ({result.weeklyManualHours} Std./Woche).
            </p>
            <div className="mt-6 space-y-4" aria-live="polite">
              {result.savings.map((s) => (
                <div
                  key={s.automationRate}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
                  data-testid={`roi-savings-${Math.round(s.automationRate * 100)}`}
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      bei {Math.round(s.automationRate * 100)} % Automatisierung
                    </p>
                    <p className="text-xs text-zinc-500">{s.weeklyHoursSaved} Std./Woche gespart</p>
                  </div>
                  <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[#C8FF00]">
                    {euro(s.yearly)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/preise${UTM_PREISE}`}
                className="btn-primary !px-6 !py-3 !text-[13px]"
                data-testid="roi-cta-pricing"
              >
                Sparpotenzial sichern — Preise ansehen <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`/audit${UTM_AUDIT}`}
                className="btn-ghost !px-6 !py-3 !text-[13px]"
                data-testid="roi-cta-audit"
              >
                Kostenloser KI-Audit
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-500" data-testid="roi-empty">
            Geben Sie Mitarbeiterzahl, Stunden und Stundensatz ein, um Ihr Automatisierungspotenzial zu sehen.
          </p>
        )}
      </section>
    </div>
  );
}
