// FILE: /apps/website/lib/content/home-faqs.ts
// NIR: 08.08.2026 13:45
// UPDATED: 08.08.2026 13:45
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: DE-Homepage-FAQ als gemeinsame Datenquelle (UI + FAQPage-JSON-LD)
// WHY: M-02: FAQPage-Schema auf der Homepage; eine Quelle statt Duplikation
//      zwischen components/pages/home.tsx (Client) und app/page.tsx (Server).
// DEPENDS: lib/seo (FAQPage-Schema), components/pages/home (UI)
// SESSION: kanban t_d13d48e3

export type HomeFaq = { q: string; a: string };

/** FAQ der DE-Homepage — UI (home.tsx) und FAQPage-Schema (page.tsx) nutzen dieselben Daten. */
export const HOME_FAQS_DE: HomeFaq[] = [
  { q: "Wie schnell ist ein Agent einsatzbereit?", a: "1 bis 5 Umsetzungstage, je nach Komplexität." },
  { q: "Was kostet der laufende Betrieb?", a: "Umsetzung pro Tag, Betreuung optional monatlich." },
  { q: "Funktioniert das auf Niederländisch?", a: "Ja, alle Agenten zweisprachig DE/NL." },
  { q: "Brauchen wir eigene Entwickler?", a: "Nein, wir übernehmen alles." },
  { q: "Wie sicher sind unsere Daten?", a: "EU Infrastruktur, AVV nach Art. 28 DSGVO." },
];
