// FILE: /apps/website/lib/gtm/stadt-seo.ts
// NIR: 08.08.2026 11:50
// UPDATED: 08.08.2026 11:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Datenmodell + Registry fuer Stadt-Landingpages (M-03, Local-SEO)
// WHY: 10 (spaeter 50+) Stadtseiten aus einer Registry + einem generischen Page
// BEST-PRACTICE: Kein Duplicate-Content — pro Stadt eigener KI-Content aus
//                /tmp/stadt-content/*.json (bei Build eingebettet), keine 1:1-Templates
// PITFALL: V-SEO-L01: kein Fake-Filialnetz; LocalBusiness-Schema NUR mit
//          ehrlichem Venlo-Sitz + areaServed-Stadt (kein address der Stadt)
// DEPENDS: company, breadcrumbListJsonLd, pageMetadata
// DOCS-REF: docs/gtm/MASSNAHMENKATALOG M-03 (Frewert-Muster)

export type StadtFaq = { q: string; a: string };

export type StadtSeoContent = {
  h1: string;
  intro: string;
  services: { title: string; text: string }[];
  localNote: string;
  faqs: StadtFaq[];
};

export type Stadt = {
  slug: string;
  name: string;      // Anzeigename
  bundesland: string;
  lat?: number;      // fuer geo (optional, nur wenn sauber hinterlegt)
  lng?: number;
};

export const staedte: Stadt[] = [
  { slug: "berlin", name: "Berlin", bundesland: "Berlin" },
  { slug: "hamburg", name: "Hamburg", bundesland: "Hamburg" },
  { slug: "muenchen", name: "München", bundesland: "Bayern" },
  { slug: "koeln", name: "Köln", bundesland: "Nordrhein-Westfalen" },
  { slug: "frankfurt-am-main", name: "Frankfurt am Main", bundesland: "Hessen" },
  { slug: "duesseldorf", name: "Düsseldorf", bundesland: "Nordrhein-Westfalen" },
  { slug: "stuttgart", name: "Stuttgart", bundesland: "Baden-Württemberg" },
  { slug: "leipzig", name: "Leipzig", bundesland: "Sachsen" },
  { slug: "dortmund", name: "Dortmund", bundesland: "Nordrhein-Westfalen" },
  { slug: "hannover", name: "Hannover", bundesland: "Niedersachsen" },
];

export function stadtSlugs(): string[] {
  return staedte.map((s) => s.slug);
}

export function getStadt(slug: string): Stadt | undefined {
  return staedte.find((s) => s.slug === slug);
}

/**
 * KI-generierter Unique-Content pro Stadt. Eingebettet zur Buildzeit.
 * Content-Quelle: /tmp/stadt-content/<slug>.json (DeepSeek via 9Router, M-03).
 * Kein 1:1-Template: jede Stadt hat eigene Texte (E2E-Gegentest Similarity < 60%).
 */
export const stadtContent: Record<string, StadtSeoContent> = {
  berlin: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  hamburg: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  muenchen: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  koeln: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  "frankfurt-am-main": { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  duesseldorf: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  stuttgart: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  leipzig: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  dortmund: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
  hannover: { h1: "", intro: "", services: [], localNote: "", faqs: [] },
};

export function getStadtContent(slug: string): StadtSeoContent | undefined {
  return stadtContent[slug];
}
