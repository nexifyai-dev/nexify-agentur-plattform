// FILE: /apps/website/lib/gtm/branchen.ts
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: ICP branchen landing content for SEO (competitor-style industry pages)
// WHY: Senorit/AUTIMA pattern — branchen pages convert SMB intent without paid ads
// BEST-PRACTICE: Pain→outcome→CTA; no fake case metrics; B2B only
// PITFALL: V-GTM-BR-01: Do not invent industry ROI percentages
// DEPENDS: company, productized-offers
// DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md
// SESSION: strongest-competitors-tactics-7dd5

export type Branche = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  pains: string[];
  outcomes: string[];
  offerHint: string;
};

export const branchen: Branche[] = [
  {
    slug: "handwerk",
    title: "Handwerk & Bau — weniger Büro, mehr Aufträge",
    eyebrow: "Branche · Handwerk",
    description:
      "Anfragen, Angebote, Nachfass und Rechnungen fressen Stunden. NeXify AI baut schlanke Website- und Automations-Slices zum Tagessatz 449 € netto — persönlich, B2B, ohne Agentur-Theater.",
    pains: [
      "Anfragen aus Portalen landen in Postfächern und sterben",
      "Angebote und Nachfass sind manuell und unregelmäßig",
      "Keine Zeit für eine Website, die wirklich führt",
    ],
    outcomes: [
      "Klarer Aufnahme-Pfad: Anfrage → Qualifizierung → Termin/Angebot",
      "Website oder Landing, die Vertrauen und nächste Schritte zeigt",
      "Optional: Pilot eines Automatisierungs-Slices nach Audit",
    ],
    offerHint: "Start: kostenlose Sprechstunde oder 1-Tages-Audit (449 €).",
  },
  {
    slug: "steuerberater",
    title: "Steuerberatung & Kanzleien — Prozesse statt Zettelchaos",
    eyebrow: "Branche · Steuer / Kanzlei",
    description:
      "Belege, Mandanten-Onboarding und wiederkehrende Kommunikation lassen sich strukturieren — mit DSGVO-Bewusstsein und Repo-Qualität, nicht mit Tool-Friedhof.",
    pains: [
      "Mandanten liefern unvollständig; Nachfass kostet Kapazität",
      "Website erklärt Leistungen und Vertrauen unklar",
      "Digitalisierung bleibt Strategiepapier",
    ],
    outcomes: [
      "Saubere digitale Einstiege (Formulare, Checklisten, Status)",
      "Automation nur wo Regeln und Freigaben klar sind",
      "Partner-fähig: White-Label für Ihre Mandanten-Empfehlungen",
    ],
    offerHint: "Audit-Tag → Pilot-Slice; Partner-Intro möglich.",
  },
  {
    slug: "ecommerce",
    title: "E-Commerce & Handel — Ops und Conversion ohne Overhead",
    eyebrow: "Branche · E-Commerce",
    description:
      "Shop, Support und Nachkauf-Kommunikation müssen zusammenspielen. Wir liefern Web/Shop-Slices und Automatisierung zum festen Tagessatz — AI-beschleunigt, menschlich freigegeben.",
    pains: [
      "Support-Tickets und Statusfragen skalieren mit dem Umsatz",
      "Shop-UX und Checkout bremsen Conversion",
      "Integrationen wachsen unkontrolliert",
    ],
    outcomes: [
      "Priorisierter Pilot: ein messbarer Prozess oder Shop-Slice",
      "Transparente Tageskalkulation statt Stundenpoker",
      "Übergabe mit nachvollziehbarem Repo",
    ],
    offerHint: "Pilot-Paket 5 Tage (2.245 € netto) nach kurzem Fit-Call.",
  },
  {
    slug: "immobilien",
    title: "Immobilien — Anfrage zu Besichtigung ohne Leerlauf",
    eyebrow: "Branche · Immobilien",
    description:
      "Portal-Leads, Exposé-Versand und Terminierung sind klassische Engpässe. Wir bauen die digitale Strecke schlank — Website, Flows, AI-Unterstützung wo sinnvoll.",
    pains: [
      "Portal-Anfragen werden zu langsam beantwortet",
      "Exposé und Qualifizierung sind Copy-Paste",
      "CRM und Kalender hängen nicht zusammen",
    ],
    outcomes: [
      "Schnellerer, nachvollziehbarer Lead-Pfad",
      "Landing/Website mit klarer CTA und Vertrauen",
      "Audit mit Top-Hebeln vor dem Build",
    ],
    offerHint: "Sprechstunde → Audit → Pilot.",
  },
  {
    slug: "agenturen",
    title: "Agenturen & Freelancer — White-Label Delivery-Partner",
    eyebrow: "Branche · Partner",
    description:
      "Sie behalten die Kundenbeziehung — wir liefern Web, App und AI-Automatisierung zum Tagessatz 449 €. Overflow ohne neues Headcount.",
    pains: [
      "Kapazität reicht nicht für Dev/Automation-Anfragen",
      "Kunden wollen KI, aber kein Enterprise-Budget",
      "Qualität und Übergabe müssen partnerfähig sein",
    ],
    outcomes: [
      "White-Label-fähige Umsetzung mit Repo-Disziplin",
      "Klare Tagessatz-Kalkulation für Ihre Angebote",
      "Cross-Referral statt Konkurrenz um denselben Deal",
    ],
    offerHint: "Partner-Kennenlernen über /partner oder Rückruf.",
  },
];

export function getBranche(slug: string): Branche | undefined {
  return branchen.find((b) => b.slug === slug);
}

export function branchenSlugs(): string[] {
  return branchen.map((b) => b.slug);
}
