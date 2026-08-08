// FILE: /apps/website/lib/gtm/productized-offers.ts
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Productized offer packages — audit / pilot / retainer anchors (449 € day)
// WHY: Competitor pattern (Pexon/Nao/AI-Native) adapted to NeXify day-rate model
// BEST-PRACTICE: Honest day multiples; no fake market prices for named rivals
// PITFALL: V-GTM-PRICE-01: Never invent competitor quotes — only own math + ballpark anchors
// DEPENDS: lib/company.dayRate
// DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md
// SESSION: strongest-competitors-tactics-7dd5

import { company } from "@/lib/company";

export const DAY_RATE = company.dayRate;

export type ProductizedOffer = {
  id: string;
  slug: string;
  name: string;
  days: number;
  priceNet: number;
  durationHint: string;
  headline: string;
  bullets: string[];
  ctaHref: string;
  ctaLabel: string;
  badge?: string;
};

/** Fixed packages = days × dayRate (transparent, no hidden markup). */
export const productizedOffers: ProductizedOffer[] = [
  {
    id: "audit",
    slug: "audit",
    name: "KI-/Prozess-Audit",
    days: 1,
    priceNet: DAY_RATE * 1,
    durationHint: "1 Arbeitstag",
    headline: "Schriftliche Prioritäten statt Sales-Folien",
    bullets: [
      "Ist-Zustand: Website, Tools, wiederkehrende Engpässe",
      "Top-3 Hebel nach Aufwand × Nutzen",
      "Festpreis-Empfehlung für einen Pilot-Slice",
      "Sie behalten das Dokument — auch ohne Folgeauftrag",
    ],
    ctaHref: "/audit",
    ctaLabel: "Audit anfragen",
    badge: "Einstieg",
  },
  {
    id: "pilot",
    slug: "pilot",
    name: "Pilot-Paket",
    days: 5,
    priceNet: DAY_RATE * 5,
    durationHint: "ca. 1–2 Wochen",
    headline: "Ein laufender Slice — messbar, repo-fähig",
    bullets: [
      "Ein Prozess oder Website-/App-Slice in Produktion",
      "Anbindung an bestehende Tools wo sinnvoll",
      "Übergabe + kurze Einweisung",
      "Klarer Upsell-Pfad: weitere Tage oder Retainer",
    ],
    ctaHref: "/rueckruf?utm_source=preise&utm_medium=organic&utm_campaign=pilot",
    ctaLabel: "Pilot besprechen",
    badge: "Beliebt",
  },
  {
    id: "retainer",
    slug: "retainer",
    name: "Betriebs-Retainer",
    days: 3,
    priceNet: DAY_RATE * 3,
    durationHint: "3 Tage / Monat · monatlich kündbar",
    headline: "Iteration ohne Agentur-Overhead",
    bullets: [
      "Monitoring-Hinweise, Micro-Fixes, Prompt-/Workflow-Feinschliff",
      "Priorisierte Backlog-Tage nach Ihrem Engpass",
      "Kein Zwang — nur wenn der Pilot trägt",
      `Transparent: ${DAY_RATE} € × gebuchte Tage`,
    ],
    ctaHref: "/rueckruf?utm_source=preise&utm_medium=organic&utm_campaign=retainer",
    ctaLabel: "Retainer klären",
  },
];

export const marketDayRateAnchor = {
  low: 1000,
  high: 1500,
  note: "Marktüblicher Richtwert klassische IT-/Agentur-Tagessätze (netto) — keine Einzelangebot-Zitate.",
} as const;
