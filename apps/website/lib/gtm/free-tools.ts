// FILE: apps/website/lib/gtm/free-tools.ts
// NIR: 08.08.2026 11:40
// UPDATED: 08.08.2026 11:40
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Pure Berechnungsmodelle fuer M-07 Free-Tools (KI-ROI-Rechner, Chatbot-Kosten-Rechner)
// WHY: Clientseitige Berechnung ohne Server-Logik; zentrale Logik testbar als pure functions
// BEST-PRACTICE: Alle Annahmen transparent als Konstanten + Quellen-Kommentar, keine erfundenen Benchmarks
// PITFALL: V-GTM-07: Preise/Spannen nur aus recherchierten Quellen (2026), NeXify-Kosten aus eigener Preisliste (449 €/Tag)
// DEPENDS: company.dayRate (via site-data), leistungen-seo (ki-begleiter ab 3 Tagen)
// DOCS-REF: docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
// SESSION: t_dfa9459e — M-07 Free-Tools

/** Arbeitswochen/Jahr, konservativ (52 − 6 Wochen Urlaub/Krankheit/Feiertage). */
export const WORK_WEEKS_PER_YEAR = 46;

/** Komplexitaetsstufen des Chatbot-Kosten-Rechners. */
export type ChatbotComplexity = "einfach" | "mittel" | "komplex";

export const CHATBOT_COMPLEXITIES: ChatbotComplexity[] = ["einfach", "mittel", "komplex"];

/**
 * Annahmen fuer den Chatbot-Kosten-Rechner (Quellen 2026, siehe DOCS-REF):
 * - Eigenbau: 2–4 Wochen (10–20 Arbeitstage) erste brauchbare Version (WebChatAgent 2026);
 *   interner Team-Tagessatz 1.000 € (Backend-Entwickler-Median DACH, SimpleProposals 2026).
 * - Full-Service-Agentur: solide KMU-Projekte 3.000–15.000 €, komplex auch darueber (WebChatAgent 2026);
 *   Wartung 10–20 % der Projektsumme pro Jahr (WebChatAgent 2026).
 * - Eigenbau-Pflege: 2–5 Std/Woche (Chatarmin 2026); API-Kosten 0,02 €/Anfrage (Bruchteile bis wenige Cent je Gespraech, WebChatAgent 2026).
 * - NeXify: KI-Begleiter ab 3 Arbeitstagen × 449 € netto (eigene Preisliste, leistungen-seo.ts).
 */
export const CHATBOT_ASSUMPTIONS: Record<
  ChatbotComplexity,
  {
    label: string;
    diyDays: number;
    agencyMin: number;
    agencyMax: number;
    nexifyDays: number;
    description: string;
  }
> = {
  einfach: {
    label: "Einfach — FAQ-Bot aus Website-Inhalten",
    diyDays: 10,
    agencyMin: 3000,
    agencyMax: 8000,
    nexifyDays: 3,
    description: "Beantwortet Standardfragen aus Ihrer Website und Wissensbasis, Lead-Formular.",
  },
  mittel: {
    label: "Mittel — CRM- & Terminanbindung",
    diyDays: 15,
    agencyMin: 8000,
    agencyMax: 15000,
    nexifyDays: 6,
    description: "Qualifiziert Leads, bucht Termine, schreibt CRM/ERP — mit Rollen und Freigaben.",
  },
  komplex: {
    label: "Komplex — Prozesse & Altsysteme",
    diyDays: 25,
    agencyMin: 15000,
    agencyMax: 30000,
    nexifyDays: 12,
    description: "Agenten mit Tool-Zugriff, Altsystem-Anbindung, mehrstufige Workflows, Compliance.",
  },
};

export const DIY_DAY_RATE = 1000; // EUR, interner Team-Tagessatz Eigenbau (Quelle s.o.)
export const AGENCY_MAINTENANCE_RATE = 0.15; // Wartung 10–20 %/Jahr, konservativer Mittelwert
export const DIY_API_COST_PER_REQUEST = 0.02; // EUR je Anfrage (Annahme: kleines LLM-Budget)

export type RoiInput = {
  employees: number;
  hoursPerWeekPerEmployee: number;
  hourlyRate: number;
};

export type RoiResult = {
  weeklyManualHours: number;
  yearlyManualCost: number;
  savings: { automationRate: number; yearly: number; weeklyHoursSaved: number }[];
};

/**
 * KI-ROI: Jahreskosten manueller Arbeit → Ersparnis bei 20/40/60 % Automatisierung.
 * Formel: woechentliche Stunden = Mitarbeiter × Std/Woche; Jahreskosten =
 * Stunden × Stundensatz × Arbeitswochen; Ersparnis = Jahreskosten × Automatisierungsgrad.
 */
export function computeRoi(input: RoiInput): RoiResult {
  const employees = Math.max(0, Math.round(input.employees) || 0);
  const hours = Math.max(0, input.hoursPerWeekPerEmployee || 0);
  const rate = Math.max(0, input.hourlyRate || 0);

  const weeklyManualHours = employees * hours;
  const yearlyManualCost = weeklyManualHours * rate * WORK_WEEKS_PER_YEAR;
  const savings = [0.2, 0.4, 0.6].map((automationRate) => ({
    automationRate,
    yearly: Math.round(yearlyManualCost * automationRate),
    weeklyHoursSaved: Math.round(weeklyManualHours * automationRate * 10) / 10,
  }));

  return { weeklyManualHours, yearlyManualCost, savings };
}

export type ChatbotCostResult = {
  diy: { once: number; apiPerMonth: number; maintenanceNote: string };
  agency: { min: number; max: number; onceMiddle: number; maintenancePerYear: number };
  nexify: { once: number; note: string };
  threeYear: { diy: number; agency: number; nexify: number };
};

/** Chatbot-Kostenvergleich der drei Wege inkl. 3-Jahres-Gesamtkosten. */
export function computeChatbotCosts(requestsPerMonth: number, complexity: ChatbotComplexity): ChatbotCostResult {
  const a = CHATBOT_ASSUMPTIONS[complexity];
  const requests = Math.max(0, Math.round(requestsPerMonth) || 0);

  const diyOnce = a.diyDays * DIY_DAY_RATE;
  const diyApiPerMonth = Math.round(requests * DIY_API_COST_PER_REQUEST);
  const agencyMin = a.agencyMin;
  const agencyMax = a.agencyMax;
  const agencyMiddle = Math.round((agencyMin + agencyMax) / 2);
  const nexifyOnce = a.nexifyDays * 449; // Tagessatz netto, ZK §1

  const diyThreeYear = diyOnce + diyApiPerMonth * 12 * 3;
  const agencyThreeYear = agencyMiddle + agencyMiddle * AGENCY_MAINTENANCE_RATE * 3;
  const nexifyThreeYear = nexifyOnce;

  return {
    diy: {
      once: diyOnce,
      apiPerMonth: diyApiPerMonth,
      maintenanceNote: "2–5 Stunden Pflege pro Woche (eigene Zeit, nicht monetarisiert)",
    },
    agency: {
      min: agencyMin,
      max: agencyMax,
      onceMiddle: agencyMiddle,
      maintenancePerYear: agencyMiddle * AGENCY_MAINTENANCE_RATE,
    },
    nexify: { once: nexifyOnce, note: "Anpassungen und Erweiterungen nach Aufwand (449 € netto/Tag)" },
    threeYear: { diy: diyThreeYear, agency: agencyThreeYear, nexify: nexifyThreeYear },
  };
}
