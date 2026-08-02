"use client";

// FILE: apps/website/components/portal-project-panel.tsx
// NIR: 02.08.2026 10:55
// UPDATED: 02.08.2026 10:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Kundenportal Auftrag-Status, Deliverables, Rechnungen, AM-Kontakt.
// WHY: Post-order transparency — client-portal differentiation.
// BEST-PRACTICE: Clear empty states in DE; Revolut invoice download via API.
// PITFALL: Never invent fake progress; only show API data.
// DEPENDS: lib/auth api(), /api/portal/offers/{id}/project
// DOCS-REF: design_guidelines.json
// SESSION: website-gesamtkonzept-kundenportal-7dd5

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Circle, Download, FileText, Mail, Phone, UserRound } from "lucide-react";
import { api } from "@/lib/auth";
import { API_BASE } from "@/lib/company";

type TimelineStep = { id: string; label: string; state: "done" | "current" | "upcoming" };
type Deliverable = { title: string; status?: string; url?: string; note?: string };
type NextAction = { title: string; owner?: string; due?: string };
type Invoice = {
  id: string;
  number: string | null;
  title: string;
  amount_cents: number;
  currency: string;
  status: string;
  download_path: string;
  issued_at: string | null;
};
type Project = {
  offer_id: string;
  lifecycle_phase: string;
  timeline: TimelineStep[];
  deliverables: Deliverable[];
  next_actions: NextAction[];
  account_manager: { name: string; email: string; phone?: string; role?: string };
  invoices: Invoice[];
};

const COPY = {
  de: {
    status: "Auftrag-Status",
    deliverables: "Liefergegenstände & Evidence",
    next: "Nächste Schritte",
    invoices: "Rechnungen",
    am: "Ihr Ansprechpartner",
    emptyDeliverables: "Noch keine Liefergegenstände hinterlegt. Sobald die Umsetzung läuft, erscheinen hier Links und Evidence.",
    emptyNext: "Keine offenen Kundenaktionen. Wir melden uns, sobald etwas von Ihnen benötigt wird.",
    emptyInvoices: "Noch keine Rechnungen. Nach Zahlung der Anzahlung (Revolut) erscheint hier der Beleg zum Download.",
    loading: "Status wird geladen …",
    error: "Status konnte nicht geladen werden. Bitte später erneut versuchen oder Ihren Ansprechpartner kontaktieren.",
    download: "PDF herunterladen",
    phaseHint: "Phasen: Anfrage → Angebot → Freigabe → Umsetzung → Abnahme → Rechnung.",
  },
  en: {
    status: "Order status",
    deliverables: "Deliverables & evidence",
    next: "Next actions",
    invoices: "Invoices",
    am: "Your contact",
    emptyDeliverables: "No deliverables yet. Links and evidence appear once delivery starts.",
    emptyNext: "No open customer actions.",
    emptyInvoices: "No invoices yet. After the Revolut deposit, the receipt appears here.",
    loading: "Loading status …",
    error: "Could not load status.",
    download: "Download PDF",
    phaseHint: "Phases: enquiry → offer → approval → delivery → acceptance → invoice.",
  },
  nl: {
    status: "Opdrachtstatus",
    deliverables: "Deliverables & evidence",
    next: "Volgende stappen",
    invoices: "Facturen",
    am: "Uw contactpersoon",
    emptyDeliverables: "Nog geen deliverables. Zodra de uitvoering loopt, verschijnen hier links en evidence.",
    emptyNext: "Geen openstaande acties.",
    emptyInvoices: "Nog geen facturen. Na de Revolut-aanbetaling verschijnt hier het bewijs.",
    loading: "Status laden …",
    error: "Status kon niet worden geladen.",
    download: "PDF downloaden",
    phaseHint: "Fasen: aanvraag → offerte → vrijgave → uitvoering → acceptatie → factuur.",
  },
};

function eur(cents: number) {
  return `€ ${(cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;
}

export function PortalProjectPanel({ offerId, lang }: { offerId: string; lang: "de" | "en" | "nl" }) {
  const t = COPY[lang];
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api(`/api/portal/offers/${offerId}/project`)
      .then((d) => setProject(d as Project))
      .catch(() => setError(true));
  }, [offerId]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200/90" data-testid="portal-project-error">
        {t.error}
      </div>
    );
  }
  if (!project) {
    return (
      <div className="mt-6 text-sm text-zinc-500" data-testid="portal-project-loading">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8" data-testid={`portal-project-${offerId}`}>
      <section data-testid="portal-timeline">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.status}</h3>
        <p className="mt-2 text-[13px] text-zinc-500">{t.phaseHint}</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {project.timeline.map((step) => (
            <li
              key={step.id}
              className={`rounded-xl border px-3 py-3 text-center ${
                step.state === "current"
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : step.state === "done"
                    ? "border-white/15 bg-white/[0.04]"
                    : "border-white/8 bg-transparent opacity-60"
              }`}
              data-testid={`timeline-step-${step.id}`}
              data-state={step.state}
            >
              <div className="flex justify-center">
                {step.state === "upcoming" ? <Circle size={14} className="text-zinc-600" /> : <CheckCircle2 size={14} className={step.state === "current" ? "text-emerald-300" : "text-zinc-400"} />}
              </div>
              <div className="mt-2 text-[12px] font-semibold text-white">{step.label}</div>
            </li>
          ))}
        </ol>
      </section>

      <section data-testid="portal-deliverables">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.deliverables}</h3>
        {project.deliverables.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500" data-testid="portal-deliverables-empty">{t.emptyDeliverables}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {project.deliverables.map((d, i) => (
              <li key={i} className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3" data-testid={`deliverable-${i}`}>
                <div>
                  <div className="text-[13.5px] font-semibold text-white">{d.title}</div>
                  {d.note && <div className="text-xs text-zinc-500">{d.note}</div>}
                </div>
                {d.url && (
                  <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-zinc-300 underline">
                    Link
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section data-testid="portal-next-actions">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.next}</h3>
        {project.next_actions.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500" data-testid="portal-next-empty">{t.emptyNext}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {project.next_actions.map((a, i) => (
              <li key={i} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300" data-testid={`next-action-${i}`}>
                <span className="font-semibold text-white">{a.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section data-testid="portal-invoices">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          <FileText size={13} /> {t.invoices}
        </h3>
        {project.invoices.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500" data-testid="portal-invoices-empty">{t.emptyInvoices}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {project.invoices.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3" data-testid={`invoice-${inv.id}`}>
                <div>
                  <div className="text-[13.5px] font-semibold text-white">{inv.title}</div>
                  <div className="text-xs text-zinc-500">
                    {inv.number ?? "—"} · {eur(inv.amount_cents)} · {inv.status}
                  </div>
                </div>
                <a
                  href={`${API_BASE}${inv.download_path}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-zinc-300 hover:border-white/30 hover:text-white"
                  data-testid={`invoice-download-${inv.id}`}
                >
                  <Download size={13} /> {t.download}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4" data-testid="portal-account-manager">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          <UserRound size={13} /> {t.am}
        </h3>
        <div className="mt-3 text-sm text-white">{project.account_manager.name}</div>
        {project.account_manager.role && <div className="text-xs text-zinc-500">{project.account_manager.role}</div>}
        <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-zinc-400">
          <a href={`mailto:${project.account_manager.email}`} className="inline-flex items-center gap-2 hover:text-white" data-testid="am-email">
            <Mail size={13} /> {project.account_manager.email}
          </a>
          {project.account_manager.phone && (
            <a href={`tel:${project.account_manager.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-white" data-testid="am-phone">
              <Phone size={13} /> {project.account_manager.phone}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
