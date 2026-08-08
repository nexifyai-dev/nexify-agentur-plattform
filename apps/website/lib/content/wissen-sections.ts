// M-13 GEO/LLM-SEO: Wissen-Artikel-Sektionen (H2-Frageform, Antwort-zuerst) + Freshness
// NIR: 08.08.2026 15:05 · NeXifyAI Agent · NeXifyAI GTM
// WHAT: H2-Frageform-Sektionen für die 11 Wissen-Artikel (M-13: Top-10-Seiten H2-Frageform,
//       Antwort in ersten 50 Wörtern nach H2, aktuelle Daten 2025/26)
// WHY: RAG-Extraktion belohnt Frage-Antwort-Struktur (Enrich Labs 2026, M-12-Report)
// DEPENDS: lib/content/wissen-articles.ts (Typ sections), Artikel-Bodys
/** Sektionen je Artikel-Slug: h2 = Frageform, answer = Antwort-zuerst (erste 50 Wörter). */
export const WISSEN_SECTIONS: Record<string, { h2: string; answer: string }[]> = {
  "ai-automatisierung-kmu": [
    {
      h2: "Wo startet AI-Automatisierung im Mittelstand am sinnvollsten?",
      answer:
        "Bei Prozessen, die häufig, regelbasiert und nervig sind: Angebotsdokumente, E-Mail-Routing, Datenübertragung zwischen Systemen, Berichtserstellung. Hier ist der Return sofort messbar und der Risikoanteil gering (Praxisleitfaden 2026).",
    },
    {
      h2: "Welche Stufe kommt nach regelbasierten Workflows?",
      answer:
        "Prozesse mit AI-Unterstützung: Vorqualifizierung von Anfragen, Zusammenfassungen, Entwurfserstellung. Hier bleibt ein Mensch in der Freigabe — die AI beschleunigt, entscheidet aber nicht allein.",
    },
    {
      h2: "Ab wann lohnen sich komplexe agentische Workflows?",
      answer:
        "Erst wenn Datenqualität und Prozessklarheit der ersten beiden Stufen stehen. Ohne diese Basis wird „AI-Agent“ schnell zum Wartungsprojekt.",
    },
  ],
  "was-kostet-ki-chatbot-2026": [
    {
      h2: "Was kostet ein KI-Chatbot 2026 im Monat?",
      answer:
        "Baukasten-Lösungen starten bei 49 bis 200 Euro monatlich, professionelle SaaS-Plattformen liegen bei 500 bis 2.500 Euro plus Setup (2.000–15.000 Euro). Die Gesamtkosten hängen stark von Pflegeaufwand und LLM-Token ab (Marktbeobachtung 2026).",
    },
    {
      h2: "Was kostet ein individueller KI-Chatbot mit eigenen Daten?",
      answer:
        "Bei NeXify AI gilt ein Tagessatz von 449 € netto; ein KI-Begleiter mit Wissensbasis startet typischerweise ab drei Arbeitstagen (ab 1.347 € netto) — zuzüglich laufender LLM-Token- und Hostingkosten.",
    },
    {
      h2: "Welche laufenden Kosten werden unterschätzt?",
      answer:
        "LLM-Token (z. B. Claude Haiku 4.5: 1,00 USD Input / 5,00 USD Output je 1 Mio. Token, Stand 2026), Hosting, Wartung und die Pflege der Wissensbasis. Wer die Pflege vergisst, hat nach sechs Monaten einen Bot mit veralteten Antworten.",
    },
  ],
  "ki-automatisierung-kmu-7-gewinne": [
    {
      h2: "Welche KI-Automatisierung spart KMU am schnellsten Zeit?",
      answer:
        "E-Mail-Triage spart in der Praxis 30 bis 60 Minuten pro Mitarbeitendem und Tag; Angebotserstellung und Termin-Koordination folgen dicht dahinter (Praxisberichte 2026).",
    },
    {
      h2: "Was kostet KI-Automatisierung für ein KMU?",
      answer:
        "Das Werkzeug-Budget liegt meist bei 50 bis 150 Euro monatlich; die Umsetzung bei NeXify AI startet ab einem Arbeitstag à 449 € netto — inklusive Prozesskarte, Freigaben und Monitoring.",
    },
    {
      h2: "Wie schnell sind erste Ergebnisse sichtbar?",
      answer:
        "Bei fokussierten Workflows nach zwei bis vier Wochen — wenn der Workflow vor dem Tool steht. 41 Prozent der deutschen Unternehmen setzen 2026 aktiv KI ein (Bitkom 2026).",
    },
  ],
  "whatsapp-marketing-handwerk": [
    {
      h2: "Ist WhatsApp-Marketing für Handwerker DSGVO-konform möglich?",
      answer:
        "Ja, über die WhatsApp Business API mit dokumentiertem Opt-in (Art. 6 Abs. 1 a DSGVO) und jederzeit möglichem Widerruf. Broadcasts über die kostenlose Business-App sind nicht zulässig.",
    },
    {
      h2: "Was kostet WhatsApp-Marketing?",
      answer:
        "Service-Unterhaltungen sind seit 01.11.2024 kostenlos; Marketing-Unterhaltungen kosten in Deutschland 11,31 Cent pro Nachricht (Meta-Preisliste, Stand Januar 2026).",
    },
    {
      h2: "Wie viele Menschen in Deutschland nutzen WhatsApp?",
      answer:
        "Rund 50 Millionen — etwa 80 Prozent der deutschsprachigen Bevölkerung ab 14 Jahren (Lime Connect / Global Web Index). Weltweit über zwei Milliarden monatlich aktive Nutzer (Meta).",
    },
  ],
  "ai-agenten-einfuehrung": [
    {
      h2: "Was ist der Unterschied zwischen Chatbot und AI-Agent?",
      answer:
        "Ein Chatbot beantwortet Fragen; ein Agent führt Aktionen aus — prüft Status, erstellt Entwürfe, löst Workflows aus — mit Rollen, Tools und Freigaben.",
    },
    {
      h2: "Wie startet man AI-Agenten ohne Chaos?",
      answer:
        "Mit einem schmalen Pilot: ein Prozess, eine Datenquelle, definierte Rollen und Freigaben, Protokollierung und Ausstiegskriterien vor dem Produktionslauf.",
    },
    {
      h2: "Was kostet ein AI-Agent bei NeXify AI?",
      answer:
        "Ab drei Arbeitstagen × 449 € netto = ab 1.347 € netto; der Scope folgt Datenquellen und Tool-Anbindungen. Ein Audit-Tag (449 €) schafft die Grundlage.",
    },
  ],
  "chatbot-dsgvo": [
    {
      h2: "Darf ein KI-Chatbot personenbezogene Daten verarbeiten?",
      answer:
        "Ja, mit Rechtsgrundlage nach Art. 6 DSGVO: Vertragsanbahnung (b), berechtigtes Interesse (f) oder Einwilligung (a) für Marketing. Externe Anbieter brauchen einen AVV nach Art. 28.",
    },
    {
      h2: "Betrifft Art. 22 DSGVO meinen Chatbot?",
      answer:
        "Meist nicht — erst wenn der Bot allein über etwas mit rechtlicher Wirkung entscheidet (z. B. Bonitätsprüfung). Dann gehört ein Mensch als Rückfallebene in den Ablauf.",
    },
    {
      h2: "Was ändert die EU-KI-Verordnung ab August 2026?",
      answer:
        "Art. 50 KI-VO verlangt Transparenz: Nutzer müssen klar erkennen, dass sie mit einer KI chatten. Das gilt seit 02.08.2026 für Chatbots im Kundenkontakt.",
    },
  ],
  "website-kosten-2026": [
    {
      h2: "Was kostet eine Unternehmenswebsite 2026 realistisch?",
      answer:
        "Marktüblich 1.500 bis 5.000 Euro (webcraftdev 2026). Bei NeXify AI: 2–3 Arbeitstage × 449 € = 898–1.347 € netto inklusive Leistungsseiten, SEO und Rechtsseiten.",
    },
    {
      h2: "Warum unterscheiden sich Agentur-Preise so stark?",
      answer:
        "Der sichtbare Output ist ähnlich, der Umfang nicht: Strategie, Inhalte, SEO und Betreuung machen den Unterschied — vergleichen Sie den Leistungsumfang, nicht den Preis.",
    },
    {
      h2: "Welche laufenden Kosten hat eine Website?",
      answer:
        "Domain (10–20 €/Jahr), Hosting, E-Mail und Pflege — realistisch 15 bis 25 Prozent der Erstellungskosten pro Jahr (Preisleitfaden 2026).",
    },
  ],
  "ki-steuerbuero": [
    {
      h2: "Wie viel lässt sich im Steuerbüro automatisieren?",
      answer:
        "Das Automatisierungspotenzial der Steuerfachangestellten-Tätigkeiten liegt bei rund 50 Prozent (IAB/BIBB 2024). Die fünf größten Hebel: E-Mail-Triage, Fristen, Belege, Bescheidprüfung, Antwortentwürfe.",
    },
    {
      h2: "Ersetzt KI den Steuerberater?",
      answer:
        "Nein — der Beruf ist gesetzlich geschützt (§ 57 StBerG, § 203 StGB). KI automatisiert Routine; Beratung, Haftung und Entscheidungen bleiben beim Berufsträger.",
    },
    {
      h2: "Welche rechtlichen Voraussetzungen gelten?",
      answer:
        "EU-Hosting, AVV nach Art. 28 DSGVO, Multi-Tenant-Isolation und EU-AI-Act-Compliance ab August 2026.",
    },
  ],
  "automation-roi": [
    {
      h2: "Welcher ROI ist bei Automatisierung realistisch?",
      answer:
        "220–400 Prozent im ersten Jahr bei fokussierten Projekten mit klarem Scope, Baseline und Verantwortlichem (IAPME 2026); der Break-even liegt bei 4–9 Monaten.",
    },
    {
      h2: "Welche Kosten vergisst man bei der ROI-Rechnung?",
      answer:
        "Einrichtung (~50 Prozent der Kosten), laufende Wartung (~30 Prozent) und Datenbereinigung — sie verschieben den Break-even typisch von Monat 4 auf Monat 7.",
    },
    {
      h2: "Gibt es Förderung für Automatisierungsprojekte?",
      answer:
        "Die BAFA-Förderung deckt bis zu 50 Prozent der Beratungskosten (maximal 3.500 €) und verbessert den ROI im ersten Jahr erheblich (stakk.agency 2026).",
    },
  ],
  "chatgpt-unternehmen-grenzen": [
    {
      h2: "Darf ich ChatGPT im Unternehmen für Kundendaten nutzen?",
      answer:
        "Nur mit Vorsicht: Standardkonfiguration verarbeitet in den USA und nutzt Eingaben ggf. für Training. Für personenbezogene Daten braucht es AVV, Absicherung des Drittlandtransfers und dokumentierte Grundsätze.",
    },
    {
      h2: "Welche Bußgelder drohen bei DSGVO-Verstößen mit KI?",
      answer:
        "Bis zu 20 Mio. € oder 4 Prozent des weltweiten Jahresumsatzes. Beispiele: 15 Mio. € gegen OpenAI (Italien 2024), 1,2 Mrd. € gegen Meta (Irland 2023).",
    },
    {
      h2: "Was ist die Alternative zu ChatGPT für Unternehmen?",
      answer:
        "Eine KI-Plattform mit eigenen Daten, Modell-Routing, Freigaben und Nachweisen — bei NeXify AI ab drei Arbeitstagen (ab 1.347 € netto).",
    },
  ],
  "was-kostet-web-app-2026": [
    {
      h2: "Was kostet eine Web-App 2026 am Markt?",
      answer:
        "Individuelle Webanwendungen liegen typischerweise bei 10.000 bis 100.000 Euro (webcraftdev 2026). Bei NeXify AI gilt der Tagessatz von 449 € netto.",
    },
    {
      h2: "Was kostet ein Kundenportal bei NeXify AI?",
      answer:
        "Ein MVP mit Login, Rollen, Status und Dokumenten: 6–8 Arbeitstage × 449 € = 2.694–3.592 € netto.",
    },
    {
      h2: "Wann ist ein Festpreis sinnvoll?",
      answer:
        "Sobald Umfang, Integrationen und Abnahmekriterien eindeutig feststehen; solange Annahmen schwanken, ist eine Aufwandsspanne ehrlicher.",
    },
  ],
};

/** Liefert Sektionen für einen Artikel (Fallback: []). */
export function getWissenSections(slug: string): { h2: string; answer: string }[] {
  return WISSEN_SECTIONS[slug] ?? [];
}
