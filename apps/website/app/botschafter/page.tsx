// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/botschafter/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Free student/uni ambassador program landing (no paid perks)
// WHY: Campus referrals and content help without budget
// BEST-PRACTICE: Clear non-employee status; learning-first; honest scope
// PITFALL: V-CAC-AMB-01: No unpaid labor disguising employment — content & intros only
// DEPENDS: /api/contact, company
// DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
// SESSION: research-free-cac-full-7dd5

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, GraduationCap } from "lucide-react";
import { company } from "@/lib/company";

const TASKS = [
  "Campus-/Fachgruppen: hilfreiche Tipps zu Web & AI (kein Spam)",
  "1–2 kurze Erfahrungsberichte / Social Posts mit ehrlichem Disclaimer",
  "Warm Intros zu Gründerteams oder Uni-Spin-offs (nur mit Zustimmung)",
  "Feedback zu Website-Copy und Checkliste (DE)",
];

export default function BotschafterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uni, setUni] = useState("");
  const [why, setWhy] = useState("");
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
          company: uni.trim() || null,
          message: `Botschafter-Bewerbung (Student/Uni).\nUni/Ort: ${uni}\nMotivation: ${why || "—"}\nQuelle: /botschafter`,
          language: "de",
          type: "ambassador",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState(typeof data.error === "string" ? data.error : "Versand fehlgeschlagen.");
        return;
      }
      setState("ok");
    } catch {
      setState("Netzwerkfehler. Bitte mail@nexifyai.cloud.");
    }
  };

  return (
    <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="botschafter-page">
      <div className="site-container max-w-3xl">
        <span className="eyebrow">Campus · kostenfrei</span>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
          NeXify AI Campus-Botschafter
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-400">
          Für Studierende in DACH/NL, die digitales Bauen und AI praxisnah zeigen wollen — ohne
          Werbebudget. Kein Arbeitsverhältnis; Fokus auf Lernen, Content und faire Empfehlungen an
          Gründerteams. Tagessatz-Transparenz: {company.dayRate}&nbsp;€ netto für Kundenprojekte.
        </p>

        <ul className="mt-10 space-y-3" data-testid="botschafter-tasks">
          {TASKS.map((t) => (
            <li key={t} className="flex gap-3 text-sm text-zinc-300">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-sky-400/80" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {state === "ok" ? (
            <p className="text-zinc-200" data-testid="botschafter-success">
              Bewerbung eingegangen. Wir melden uns mit dem kurzen Onboarding-Paket.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4" data-testid="botschafter-form">
              <input
                className="field"
                placeholder="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="botschafter-name"
              />
              <input
                className="field"
                type="email"
                placeholder="E-Mail *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="botschafter-email"
              />
              <input
                className="field"
                placeholder="Uni / Stadt"
                value={uni}
                onChange={(e) => setUni(e.target.value)}
                data-testid="botschafter-uni"
              />
              <textarea
                className="field min-h-24"
                placeholder="Warum du? (2–3 Sätze)"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                data-testid="botschafter-why"
              />
              <label className="flex items-start gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  className="mt-1"
                  data-testid="botschafter-privacy"
                />
                <span>
                  Einwilligung zur Kontaktaufnahme (
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
                data-testid="botschafter-submit"
              >
                Bewerben <ArrowRight className="size-4" />
              </button>
              {state !== "idle" && state !== "sending" && state !== "ok" && (
                <p className="text-sm text-red-400">{state}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
