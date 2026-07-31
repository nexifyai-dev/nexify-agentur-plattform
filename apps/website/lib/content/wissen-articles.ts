/**
 * Crawlable Wissen articles (SSR). Separate from accordion teasers in de.wissen.articles
 * so search engines get full HTML text under /wissen/[slug].
 */

export type WissenArticle = {
  slug: string;
  tag: string;
  readTime: string;
  title: string;
  description: string;
  excerpt: string;
  datePublished: string;
  dateModified: string;
  body: string[];
};

export const WISSEN_ARTICLES: WissenArticle[] = [
  {
    slug: "ai-automatisierung-kmu",
    tag: "Automatisierung",
    readTime: "6 Min.",
    title: "AI-Automatisierung für KMU: Die richtige Reihenfolge",
    description:
      "Wie mittelständische Unternehmen AI-Automatisierung sinnvoll starten: zuerst regelbasierte Prozesse, dann AI mit Freigabe – zum Tagessatz 449 € netto.",
    excerpt:
      "Nicht alles, was automatisierbar ist, sollte sofort automatisiert werden. Eine Priorisierungshilfe für KMU – mit klaren Kostenrahmen.",
    datePublished: "2026-07-20",
    dateModified: "2026-07-31",
    body: [
      "Der beste Startpunkt für AI-Automatisierung im Mittelstand sind Prozesse, die häufig, regelbasiert und nervig sind: Angebotsdokumente, E-Mail-Routing, Datenübertragung zwischen Systemen, Berichtserstellung. Hier ist der Return sofort messbar – und der Risikoanteil gering.",
      "Danach folgen Prozesse mit AI-Unterstützung: Vorqualifizierung von Anfragen, Zusammenfassungen, Entwurfserstellung. Hier bleibt ein Mensch in der Freigabe – die AI beschleunigt, entscheidet aber nicht allein. Genau diese Leitplanke unterscheidet produktive Automatisierung von teuren Experimenten.",
      "Zuletzt kommen komplexe agentische Workflows. Wer die ersten beiden Stufen sauber gebaut hat, verfügt über die Datenqualität und die Prozessklarheit, die Stufe drei erst möglich machen. Ohne diese Basis wird „AI-Agent“ schnell zum Wartungsprojekt.",
      "Bei NeXify AI gilt ein fester Tagessatz von 449 € netto pro Arbeitstag – für Konzeption, Integration und Abnahme. Vor Projektbeginn erhalten Sie eine belastbare Aufwandsspanne; Mehrbedarf wird immer vor Ausführung sichtbar gemacht. Details zu Leistungen und Preismodell finden Sie unter Leistungen und Preise; für eine kurze Einordnung reicht Kontakt.",
    ],
  },
  {
    slug: "was-kostet-web-app-2026",
    tag: "Preise",
    readTime: "5 Min.",
    title: "Was kostet eine Web-App 2026?",
    description:
      "Transparente Kosten für Web-Apps 2026: Tagessatz 449 € netto, typische Aufwandsspannen und wann ein Festpreis sinnvoll ist – ohne Agentur-Overhead.",
    excerpt:
      "Statt undurchsichtiger Paketpreise: ein fester Tagessatz, eine klare Aufwandsspanne und sichtbarer Mehrbedarf – so kalkulieren Sie Web-Apps realistisch.",
    datePublished: "2026-07-22",
    dateModified: "2026-07-31",
    body: [
      "Die ehrliche Antwort auf „Was kostet eine Web-App?“ hängt von Umfang, Integrationen und Abnahmekriterien ab – nicht von Marketing-Paketen. Bei NeXify AI liegt der Tagessatz fest bei 449 € netto pro Arbeitstag (bis zu acht planbare Fachstunden für Konzeption, Design, Entwicklung, Tests und Dokumentation).",
      "Typische Startumfänge für fokussierte Web-Apps liegen oft im niedrigen bis mittleren zweistelligen Tagesbereich, sobald Login, Rollen, Kernworkflows und ein sauberes Deployment definiert sind. Spezialintegrationen, Migrationen oder ungeklärte Fachlogik verlängern die Spanne – und werden vor Ausführung ausgewiesen, nie nachträglich versteckt.",
      "Ein verbindlicher Gesamtfestpreis ist möglich, sobald Umfang, Inhalte, Integrationen und Abnahmekriterien eindeutig feststehen. Solange Annahmen noch schwanken, ist eine Aufwandsspanne ehrlicher: Sie behalten Kostenkontrolle, ohne Qualität durch Pauschalversprechen zu opfern.",
      "Vergleichen Sie den Tagessatz mit klassischen Agenturmodellen: Weniger Übergaben, ein verantwortlicher Ansprechpartner und AI-gestützte Umsetzung verkürzen die Durchlaufzeit. Die konkrete Spanne für Ihr Vorhaben klären wir unter Preise und im direkten Kontakt – die Leistungsbausteine stehen unter Leistungen.",
    ],
  },
];

export function getWissenArticle(slug: string): WissenArticle | undefined {
  return WISSEN_ARTICLES.find((a) => a.slug === slug);
}

export function wissenArticleSlugs(): string[] {
  return WISSEN_ARTICLES.map((a) => a.slug);
}
