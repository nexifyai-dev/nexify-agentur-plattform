// FILE: /apps/website/lib/content/branchen.ts
// NIR: 02.08.2026 11:00
// UPDATED: 02.08.2026 11:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: ICP branchen landing content (Top-5 high-demand DACH)
// WHY: SEO + conversion aligned with ICP-HIGH-DEMAND-2026
// BEST-PRACTICE: No fake metrics
// PITFALL: V-BRANCHE-01: Do not invent customer ROI percentages
// DEPENDS: company.dayRate via pages
// DOCS-REF: docs/gtm/ICP-HIGH-DEMAND-2026.md
// SESSION: icp-demand-competitor-copy-7dd5

export type BrancheFaq = { q: string; a: string };

export type Branche = {
  slug: string;
  rank: number;
  title: string;
  eyebrow: string;
  headline: string;
  lead: string;
  pains: string[];
  outcomes: string[];
  comparisonRows: { label: string; typical: string; nexify: string }[];
  faqs: BrancheFaq[];
  foerderHinweis?: string;
  metaTitle: string;
  metaDescription: string;
};

export const BRANCHEN: Branche[] = [
  {
    slug: "handwerk",
    rank: 1,
    title: "KI & Automation fürs Handwerk",
    eyebrow: "Branche · Handwerk",
    headline: "Weniger Admin — mehr Zeit auf der Baustelle",
    lead: "Anfragen, Termine, Angebote und Nachfassungen fressen Bürozeit. NeXify AI automatisiert diese Schleifen AI-beschleunigt, mit menschlicher Freigabe und nachvollziehbarer Repo-Qualität — zum festen Tagessatz statt klassischer IT-Sätze.",
    pains: [
      "Angebote und Rückrufe bleiben liegen, sobald das Team auf Montage ist",
      "Termin-Pingpong per Telefon und WhatsApp ohne System",
      "Belege und Nachweise erreichen die Buchhaltung zu spät",
    ],
    outcomes: [
      "Anfrage → Qualifizierung → Termin → Angebot → Reminder als durchgängiger Flow",
      "Status für Kunden ohne Extra-Anruf",
      "Übergaben an Buchhaltung/DATEV-nahe Abläufe — Scope klar in Tagen",
    ],
    comparisonRows: [
      { label: "Ansatz", typical: "ChatGPT-Einzelnutzung oder teure Systemhäuser", nexify: "End-to-End Büro-Flow, freigegeben, in Git geliefert" },
      { label: "Preislogik", typical: "oft 1.000–1.500 € Tag / undurchsichtige Pauschalen", nexify: "449 € netto/Tag — Scope in Tagen" },
      { label: "Einstieg", typical: "langes Lastenheft", nexify: "15-Min-Rückruf, ein Engpass zuerst" },
    ],
    faqs: [
      { q: "Ersetzen Sie meine Bürokraft?", a: "Nein. Wir entlasten Routine. Entscheidungen und Kundenbeziehung bleiben bei Ihnen." },
      { q: "Brauchen wir eine große IT-Abteilung?", a: "Nein. Schlanke Automation mit Repo-Dokumentation — geeignet für Inhaber-geführte Betriebe." },
    ],
    foerderHinweis: "Externe Digitalisierungsberatung kann je nach Programm (z. B. BAFA, Landes-Digitalbonus) förderfähig sein — keine Garantie; Antrag vor Beauftragung prüfen.",
    metaTitle: "KI-Automatisierung für Handwerk — NeXify AI",
    metaDescription: "Büro-Automation für Handwerksbetriebe: Anfrage bis Angebot. Tagessatz 449 € netto. DACH B2B — Termin buchen.",
  },
  {
    slug: "steuerberater",
    rank: 2,
    title: "Automation für Steuerberater & Kanzleien",
    eyebrow: "Branche · Steuerberatung",
    headline: "Kapazität für Beratung statt Sortierarbeit",
    lead: "Belege, Statusfragen und Standardantworten binden teure Kanzlei-Zeit. Wir automatisieren Vorsortierung und Mandanten-Flows — mit Freigabe durch Ihre Fachkräfte.",
    pains: [
      "Belegflut und Medienbrüche zwischen Mandant und Kanzlei",
      "Wiederkehrende Status- und Dokumentenanfragen",
      "Wenig Zeit für komplexe Beratung trotz hoher Auslastung",
    ],
    outcomes: [
      "Vorsortierung und Status-Updates mit klarer Eskalation an Menschen",
      "Mandanten-Kommunikation nach Ihren Vorlagen",
      "Portal-/Workflow-Bausteine mit GitHub/GitLab-Nachweis",
    ],
    comparisonRows: [
      { label: "Fokus", typical: "generische Chatbots ohne Kanzlei-Prozess", nexify: "Prozess zuerst, Modell zweitens, Freigabe immer" },
      { label: "Compliance-Haltung", typical: "Blackbox-Cloud ohne Doku", nexify: "Nachvollziehbare Lieferartefakte, AVV-fähig besprechbar" },
      { label: "Kosten", typical: "Boutique-KI oft 1.000+ €/Tag", nexify: "449 € netto/Tag" },
    ],
    faqs: [
      { q: "Arbeiten Sie in DATEV hinein?", a: "Wir integrieren dort, wo Schnittstellen und Mandatsrahmen es erlauben — Scope im Erstgespräch." },
      { q: "Wie schnell starten wir?", a: "Typisch mit einem Engpass-Prozess (Tage), nicht mit einer Jahres-Transformation." },
    ],
    foerderHinweis: "Beratungsanteile können unter Förderprogrammen fallen — Einzelfall prüfen, keine Zusage auf dieser Seite.",
    metaTitle: "KI-Automation für Steuerberater — NeXify AI",
    metaDescription: "Kanzlei-Automation: Belege, Status, Mandanten-Flows. 449 € Tagessatz. B2B DACH — Rückruf buchen.",
  },
  {
    slug: "agenturen",
    rank: 3,
    title: "White-Label & Overflow für Agenturen",
    eyebrow: "Branche · Agenturen",
    headline: "Sie verkaufen KI — wir liefern ohne Margenkiller",
    lead: "Kunden erwarten Automation und Agenten. Interne Dev-Kapazität fehlt oft. NeXify AI ist Overflow- und Partner-Delivery zum Tagessatz 449 € — Sie bleiben das Kundengesicht.",
    pains: [
      "KI-Anfragen der Kunden, aber keine Delivery-Bank",
      "Weitergabe an klassische IT frisst die Marge",
      "Uneinheitliche Qualität ohne Repo-Standards",
    ],
    outcomes: [
      "Co-Delivery oder White-Label-fähig unter Ihrer Marke (vertraglich geregelt)",
      "Feste Tagesrate kalkulierbar für Ihre Angebote",
      "CI, Reviews, GitHub/GitLab — anschlussfähig an Ihre QA",
    ],
    comparisonRows: [
      { label: "Modell", typical: "SaaS-White-Label-Abo oder teure Boutique", nexify: "Agentur-Tage zu 449 € — kein Zwangs-Abo" },
      { label: "Marke", typical: "Vendor-Brand im Vordergrund", nexify: "Ihr Brand gegenüber dem Endkunden (wenn vereinbart)" },
      { label: "Speed", typical: "lange Onboardings", nexify: "Partner-Call, Scope in Tagen" },
    ],
    faqs: [
      { q: "Gibt es Rev-Share?", a: "Empfehlungsregeln und etwaige Beteiligung klären wir schriftlich — keine %-Versprechen auf der Website." },
      { q: "Können wir gemeinsam pitchen?", a: "Ja. Kurzbriefing, klare Rollen, eine Stimme zum Kunden." },
    ],
    metaTitle: "KI-Delivery für Agenturen (White-Label) — NeXify AI",
    metaDescription: "Overflow & Partner-Delivery für Digitalagenturen. 449 €/Tag. DACH B2B — Termin oder Partner-Gespräch.",
  },
  {
    slug: "ecommerce",
    rank: 4,
    title: "Automation für E-Commerce & Handel",
    eyebrow: "Branche · E-Commerce",
    headline: "Support und Order-Flow ohne Ticket-Chaos",
    lead: "Shop-KMU verlieren Zeit an Standard-Tickets, Retouren-Kommunikation und Content-Nachlauf. Wir automatisieren Engpässe — messbar, freigegeben, tagbasiert.",
    pains: [
      "Wiederkehrende Support-Fragen ohne Routing",
      "Manuelle Status-Mails entlang der Bestellung",
      "Content- und Katalog-Pflege als Bottleneck",
    ],
    outcomes: [
      "Ticket-Klassifizierung und Antworten mit Eskalation",
      "Order-to-Cash-Hilfsflows zwischen Shop, CRM und Mail",
      "Content-Assist mit redaktioneller Freigabe",
    ],
    comparisonRows: [
      { label: "DIY-Plugins", typical: "viele Tools, wenig Prozess", nexify: "Ein Engpass-Prozess End-to-End" },
      { label: "Agentur Classic", typical: "Retainer ohne Repo-Transparenz", nexify: "449 €/Tag + Git-Nachweis" },
      { label: "Skalierung", typical: "Alles auf einmal", nexify: "Pilot in Tagen, dann erweitern" },
    ],
    faqs: [
      { q: "Shopify, Shopware, Custom?", a: "Stack-agnostisch über APIs und klare Schnittstellen — Details im Rückruf." },
    ],
    metaTitle: "KI-Automatisierung für E-Commerce — NeXify AI",
    metaDescription: "Shop-Automation: Support, Order-Flow, Content-Assist. Tagessatz 449 €. B2B DACH.",
  },
  {
    slug: "immobilien",
    rank: 5,
    title: "Lead- & Prozess-Automation für Immobilien",
    eyebrow: "Branche · Immobilien",
    headline: "Weniger verlorene Anfragen — klarere Besichtigungs-Flows",
    lead: "Portal-Leads, Besichtigungskoordination und Follow-ups verlaufen im Alltag. NeXify AI strukturiert Lead → Termin → Reminder — ohne Fake-Erfolgsquoten, mit ehrlichem Scope.",
    pains: [
      "Portal-Anfragen ohne qualifizierte Nachfassung",
      "Terminchaos zwischen Interessenten und Eigentümern",
      "Exposé- und Textarbeit als Zeitfresser",
    ],
    outcomes: [
      "Lead-Qualifizierung und Termin-Reminder",
      "Status-Transparenz für Ihr Team",
      "Text-/Exposé-Assist mit Freigabe",
    ],
    comparisonRows: [
      { label: "PropTech-SaaS only", typical: "Abo ohne Anpassung an Ihren Ablauf", nexify: "Automation an Ihren Prozess gekoppelt" },
      { label: "Klassische IT", typical: "hohe Tagessätze, lange Projekte", nexify: "449 €/Tag, Engpass zuerst" },
      { label: "ChatGPT allein", typical: "Texte ohne CRM-Anbindung", nexify: "Prozess + Freigabe + Nachvollziehbarkeit" },
    ],
    faqs: [
      { q: "Ersetzen Sie unser CRM/Portal?", a: "Nein. Wir verbinden und automatisieren — bestehende Systeme bleiben, wo sinnvoll." },
    ],
    metaTitle: "KI-Automation für Immobilienmakler — NeXify AI",
    metaDescription: "Lead- und Besichtigungs-Automation für Makler-Büros. 449 € Tagessatz. B2B DACH.",
  },
];

export const branchenSlugs = () => BRANCHEN.map((b) => b.slug);

export function getBranche(slug: string): Branche | undefined {
  return BRANCHEN.find((b) => b.slug === slug);
}
