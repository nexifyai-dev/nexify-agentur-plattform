// FILE: /apps/website/lib/gtm/leistungen-seo.ts
// NIR: 02.08.2026 10:55
// UPDATED: 08.08.2026 14:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Full-service SEO/AEO catalog — keywords, answer-first, FAQ per Leistung
// WHY: Page-1 + AI-citation coverage for every sellable NeXify Angebot (zero paid ads)
// BEST-PRACTICE: Commercial-intent DE keywords; unique H1/meta; no stuffing; B2B only
// PITFALL: V-SEO-L01: No fake AggregateRating; no invented local offices
// DOCS-REF: docs/gtm/GEO-LLM-SEO-2026-08-08.md (M-13: FAQ ≥6 je Seite, Antwort-zuerst, Frageform-H2)
// SESSION: m13-geo-llm-seo-7dd5

import { company } from "@/lib/company";

export type LeistungFaq = { q: string; a: string };

export type LeistungSeo = {
  slug: string;
  shortTitle: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  answerFirst: string;
  body: string;
  daysLabel: string;
  minDays: number;
  maxDays?: number;
  from?: boolean;
  primaryKeyword: string;
  secondaryKeywords: string[];
  features: string[];
  outcomes: string[];
  idealFor: string[];
  faqs: LeistungFaq[];
  branchen: string[];
  related: string[];
  locationNote: string;
};

const RATE = company.dayRate;
const LOC =
  "Lieferung remote für Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden — Sitz Venlo (NL), ohne Fake-Filialnetz.";

export const leistungenSeo: LeistungSeo[] = [
  {
    slug: "landingpages",
    shortTitle: "Landingpage",
    h1: "Landingpage erstellen lassen — conversion-klar in 1 Arbeitstag",
    metaTitle: "Landingpage erstellen lassen (1 Tag) — B2B DACH",
    metaDescription: "Landingpage Konzept, Design und Next.js-Umsetzung in 1 Arbeitstag für 449 € netto. B2B DACH + NL. Persönlich, AI-beschleunigt.",
    eyebrow: "Leistung · Landingpage",
    answerFirst: "Eine verkaufsfähige B2B-Landingpage entsteht bei NeXify AI in einem Arbeitstag zum Tagessatz 449 € netto: Strategie, Design, Next.js-Umsetzung, Formular und technisches SEO — persönlich verantwortet, AI-beschleunigt.",
    body: "Fokussierte Seiten für Angebot, Kampagne oder Markteintritt. Kein Baukasten-Look, sondern klare Botschaft, Lead-Pfad und rechtliche Pflichtverlinkungen.",
    daysLabel: "1 Arbeitstag",
    minDays: 1,
    maxDays: 1,
    primaryKeyword: "Landingpage erstellen lassen",
    secondaryKeywords: [
      "Landingpage Agentur DACH",
      "Conversion Landingpage B2B",
      "Landingpage Next.js",
      "Landingpage Festpreis",
    ],
    features: [
      "Premium UI/UX",
      "Responsive Design",
      "Kontakt- oder Leadformular",
      "Technisches SEO",
      "Performance-Basis",
      "Rechtliche Pflichtverlinkungen",
    ],
    outcomes: [
      "Eine klare Botschaft und ein messbarer CTA",
      "Crawl- und indexierbare Meta-Struktur",
      "Übergabe mit Repo — kein Lock-in",
    ],
    idealFor: [
      "Neue Angebote",
      "Kampagnen",
      "Leadgenerierung",
      "Produktvalidierung",
    ],
    faqs: [
      {
        q: "Was kostet eine Landingpage bei NeXify AI?",
        a: "Ein fokussierter Startumfang kostet einen Arbeitstag × 449 € = 449 € netto. Mehrsprachen oder Spezialintegrationen erweitern den Scope transparent vor Ausführung.",
      },
      {
        q: "Wie schnell ist die Landingpage live?",
        a: "Bei geklärtem Angebot und Inhalten oft innerhalb eines Arbeitstags — plus Ihr Hosting-/Domain-Setup.",
      },
      {
        q: "Für welche Regionen liefert ihr?",
        a: "Lieferung remote für Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden — Sitz Venlo (NL), ohne Fake-Filialnetz.",
      },
      {
        q: "Was ist in einer Landingpage enthalten?",
        a: "Strategie, individuelles Premium-Design, Next.js-Umsetzung, Kontakt- oder Leadformular, technisches SEO und Performance-Basis — inklusive rechtlicher Pflichtverlinkungen.",
      },
      {
        q: "Bekomme ich den Quellcode der Landingpage?",
        a: "Ja, vollständige Übergabe mit Repository — kein Lock-in. Hosting und Domain können Sie selbst betreiben oder wir begleiten die Einrichtung.",
      },
      {
        q: "Für wen lohnt sich eine Landingpage statt einer Website?",
        a: "Für ein einzelnes Angebot, eine Kampagne oder einen Markteintritt mit klarem Ziel (Lead, Anmeldung, Termin). Mehrere Zielgruppen brauchen eher eine Unternehmenswebsite.",
      },
    ],
    branchen: ["handwerk", "immobilien", "ecommerce"],
    related: ["websites", "automatisierung", "beratung"],
    locationNote: LOC,
  },
  {
    slug: "websites",
    shortTitle: "Unternehmenswebsite",
    h1: "Unternehmenswebsite erstellen — B2B in 2–3 Arbeitstagen",
    metaTitle: "Unternehmenswebsite erstellen lassen — 2–3 Tage",
    metaDescription: "B2B-Website mit Leistungen, SEO und Kontaktstrecke in 2–3 Tagen (898–1347 € netto). NeXify AI — DACH + NL.",
    eyebrow: "Leistung · Website",
    answerFirst: "NeXify AI liefert vollständige B2B-Unternehmenswebsites in zwei bis drei Arbeitstagen (898–1347 € netto): Positionierung, Leistungsseiten, SEO-Grundlage, Kontakt und Rechtsseiten — ein Fachmann, AI-gestützt.",
    body: "Marke, Vertrauen und Nachfrage in einem System. Next.js, Designsystem, Sitemap und Responsive QA. Ideal für Agenturen, Beratungen, Handwerk und Mittelstand.",
    daysLabel: "2–3 Arbeitstage",
    minDays: 2,
    maxDays: 3,
    primaryKeyword: "Unternehmenswebsite erstellen lassen",
    secondaryKeywords: [
      "B2B Website Agentur Deutschland",
      "Website Mittelstand DACH",
      "Next.js Unternehmenswebsite",
      "Website Festpreis Tagessatz",
    ],
    features: [
      "Strategie und Informationsarchitektur",
      "Start- und Leistungsseiten",
      "Expertenprofil",
      "Preis- und Prozessdarstellung",
      "Kontaktstrecke",
      "Rechtliche Seiten",
    ],
    outcomes: [
      "Klare Positionierung statt generischer Broschüre",
      "SEO-Metadaten und Sitemap von Tag 1",
      "Vollständiger Quellcode ohne Lock-in",
    ],
    idealFor: [
      "Agenturen",
      "Beratungen",
      "Handwerk und Mittelstand",
      "B2B-Dienstleister",
    ],
    faqs: [
      {
        q: "Wie kann eine Website in 2–3 Tagen entstehen?",
        a: "Durch standardisierten Ablauf, wiederverwendbare Grundlagen, konsistentes Designsystem und AI-gestützte Umsetzung unter fachlicher Freigabe — nicht durch Qualitätsverzicht.",
      },
      {
        q: "Was kostet eine Unternehmenswebsite?",
        a: "Richtaufwand 2–3 Arbeitstage × 449 € = 898–1347 € netto. Verbindlicher Festpreis nach Scope-Klärung möglich.",
      },
      {
        q: "Arbeitet ihr auch remote für Deutschland?",
        a: "Lieferung remote für Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden — Sitz Venlo (NL), ohne Fake-Filialnetz.",
      },
      {
        q: "Welche Seiten sind in einer Unternehmenswebsite enthalten?",
        a: "Startseite, Leistungsseiten, Expertenprofil, Preis- und Prozessdarstellung, Kontaktstrecke mit Formular sowie rechtliche Seiten (Impressum, Datenschutz, AGB).",
      },
      {
        q: "Gehört SEO und Sitemap zum Umfang?",
        a: "Ja, SEO-Metadaten und Sitemap gehören ab Tag eins dazu — inklusive strukturierter Daten und technischer Grundlagen für Google und KI-Suchmaschinen.",
      },
      {
        q: "Was passiert nach dem Go-Live?",
        a: "Sie erhalten Code, Dokumentation und klare Betriebsinformationen. Wartung und Weiterentwicklung sind separat buchbar — ohne Retainer-Zwang.",
      },
    ],
    branchen: ["handwerk", "steuerberater", "agenturen", "kanzleien", "logistik", "pflege", "gastronomie", "produktion"],
    related: ["landingpages", "ki-begleiter", "beratung"],
    locationNote: LOC,
  },
  {
    slug: "onlineshops",
    shortTitle: "Onlineshop",
    h1: "Onlineshop erstellen lassen — Katalog, Checkout, Wachstum",
    metaTitle: "Onlineshop erstellen lassen — 6–8 Tage B2B",
    metaDescription: "Onlineshop mit Suche, Checkout und Import in 6–8 Tagen (2694–3592 € netto). Skalierbar. NeXify AI DACH.",
    eyebrow: "Leistung · Onlineshop",
    answerFirst: "Standard-Onlineshops liefert NeXify AI in sechs bis acht Arbeitstagen (2694–3592 € netto): Produktstruktur, Filter, Checkout, Zahlungen, SEO und Basis-Integrationen — AI-beschleunigt, repo-fähig.",
    body: "Vom Nischen-Shop bis zum wachsenden Handelssystem. Große Kataloge ab zwölf Tagen (siehe Enterprise-Commerce).",
    daysLabel: "6–8 Arbeitstage",
    minDays: 6,
    maxDays: 8,
    primaryKeyword: "Onlineshop erstellen lassen",
    secondaryKeywords: [
      "E-Commerce Agentur DACH",
      "Next.js Shop",
      "B2B Onlineshop Entwicklung",
      "Shop Checkout Integration",
    ],
    features: [
      "Produkt- und Kategoriestruktur",
      "Suche und Filter",
      "Checkout und Zahlungsanbieter",
      "Bestellkommunikation",
      "SEO und strukturierte Daten",
      "Schnittstellen und Import",
    ],
    outcomes: [
      "Kaufbarer Shop mit klarer Admin-Logik",
      "Importpfad statt manueller Tipparbeit",
      "Betriebsdokumentation zur Übergabe",
    ],
    idealFor: [
      "D2C und B2B-Commerce",
      "Nischenhandel",
      "Hersteller",
    ],
    faqs: [
      {
        q: "Was kostet ein Onlineshop?",
        a: "Richtaufwand 6–8 Tage × 449 € = 2694–3592 € netto. ERP-/PIM-Tiefe und Kataloggröße erweitern den Scope.",
      },
      {
        q: "Welche Zahlungsanbieter sind möglich?",
        a: "Je nach Markt und Compliance — z. B. gängige EU-PSP. Fremdkosten (PSP, Domains, Lizenzen) sind nicht im Tagessatz enthalten.",
      },
      {
        q: "Ab wann brauche ich Enterprise-Commerce?",
        a: "Typischerweise ab sehr großen Katalogen (ca. 50.000+ Artikel), schweren Importpipelines oder PIM/ERP-Kernsystemen.",
      },
      {
        q: "Welche Shop-Funktionen sind im Standardumfang?",
        a: "Produkt- und Kategoriestruktur, Suche und Filter, Checkout mit Zahlungsanbieter, Bestellkommunikation per E-Mail, SEO und strukturierte Daten sowie Schnittstellen und Produktimport.",
      },
      {
        q: "Übernehmt ihr einen bestehenden Produktkatalog?",
        a: "Ja, über geplante Importpipelines. Datenqualität und Mapping werden vorab geklärt — keine Blackbox-Migration.",
      },
      {
        q: "Wie lange dauert ein Onlineshop?",
        a: "Standard-Shops sechs bis acht Arbeitstage, große Kataloge ab zwölf Tagen. Der Zeitrahmen steht vor Projektstart schriftlich fest.",
      },
    ],
    branchen: ["ecommerce", "handwerk"],
    related: ["enterprise-commerce", "automatisierung", "web-apps"],
    locationNote: LOC,
  },
  {
    slug: "enterprise-commerce",
    shortTitle: "Enterprise-Commerce",
    h1: "Commerce-Plattform ab 50.000 Artikeln — skalierbar gebaut",
    metaTitle: "Enterprise-Commerce 50K+ Artikel — ab 12 Tagen",
    metaDescription: "Große Shops: Suchindex, PIM/ERP, Importe, Monitoring. Ab 12 Arbeitstagen / ab 5388 € netto. NeXify AI.",
    eyebrow: "Leistung · Enterprise-Commerce",
    answerFirst: "Für Sortimente ab ca. 50.000 Artikeln plant NeXify AI Datenmodell, Suche, Importpipelines und ERP/PIM von Beginn an skalierbar — Start ab zwölf Arbeitstagen (ab 5388 € netto).",
    body: "Architektur statt Nachrüstung: Facetten, Caching, Delta-Importe, Monitoring und Recovery.",
    daysLabel: "ab 12 Arbeitstagen",
    minDays: 12,
    from: true,
    primaryKeyword: "Enterprise Commerce Entwicklung",
    secondaryKeywords: [
      "Großer Onlineshop 50000 Artikel",
      "PIM ERP Shop Integration",
      "Skalierbare Produktsuche",
      "B2B Commerce Plattform",
    ],
    features: [
      "50.000+ Artikel",
      "Performante Suche und Facetten",
      "PIM-/ERP-/Feed-Integration",
      "Batch- und Delta-Importe",
      "Cache- und Indexstrategie",
      "Monitoring und Recovery",
    ],
    outcomes: [
      "Technischer Blueprint vor dem Build",
      "Last- und Datenqualitätstests",
      "Betriebshandbuch für Ihr Team",
    ],
    idealFor: [
      "Großhandel",
      "Ersatzteilhandel",
      "Mehrmarkenshops",
    ],
    faqs: [
      {
        q: "Ab welchem Katalog lohnt Enterprise-Commerce?",
        a: "Wenn Suche, Varianten und Importe mit Standard-Shop-Annahmen brechen — oft ab fünfstelligen Artikelzahlen oder ERP-geführten Beständen.",
      },
      {
        q: "Was kostet der Einstieg?",
        a: "Ab 12 Arbeitstagen × 449 € = ab 5388 € netto. Der Scope folgt der Systemkomplexität — transparent vor Start.",
      },
      {
        q: "Übernehmt ihr Bestandsdaten?",
        a: "Ja, über geplante Importpipelines. Datenqualität und Mapping werden im Blueprint geklärt — keine Blackbox-Migration.",
      },
      {
        q: "Was unterscheidet Enterprise-Commerce von einem Standard-Shop?",
        a: "Datenmodell, Suchindex, Importpipeline, Caching, Varianten und ERP/PIM-Anbindung werden von Beginn an skalierbar angelegt — Performance ist Architekturprinzip, keine Nachrüstung.",
      },
      {
        q: "Welche Integrationen sind typisch?",
        a: "PIM-/ERP-Anbindung, Lieferanten-Feeds, Delta-Importe, Monitoring und Recovery. Die konkrete Integrationsliste entsteht im technischen Blueprint vor dem Build.",
      },
      {
        q: "Wie wird die Performance sichergestellt?",
        a: "Durch Suchindex-Strategie, Caching und Lasttests. Antwortzeiten und Datenqualität werden als Abnahmekriterien definiert — messbar statt versprochen.",
      },
    ],
    branchen: ["ecommerce"],
    related: ["onlineshops", "web-apps", "ki-plattform"],
    locationNote: LOC,
  },
  {
    slug: "web-apps",
    shortTitle: "Web-App",
    h1: "Web-App & Prozesssoftware — Portale, Dashboards, Workflows",
    metaTitle: "Web-App entwickeln lassen — MVP 6–8 Tage",
    metaDescription: "Individuelle Web-Apps mit Login, Rollen und APIs. MVP 6–8 Tage (2694–3592 €). NeXify AI B2B DACH.",
    eyebrow: "Leistung · Web-App",
    answerFirst: "NeXify AI baut Web-Apps für echte Betriebsabläufe: Kundenportale, Dashboards und Workflows. Kompakte MVPs in sechs bis acht Tagen (2694–3592 € netto), komplexe Systeme ab zwölf.",
    body: "Software, die sich Ihrem Betrieb anpasst — nicht umgekehrt. Login, Rollen, Datenmodelle, Benachrichtigungen und auditierbare Zustände.",
    daysLabel: "6–8 Arbeitstage",
    minDays: 6,
    maxDays: 8,
    primaryKeyword: "Web-App entwickeln lassen",
    secondaryKeywords: [
      "Kundenportal Entwicklung",
      "B2B Dashboard App",
      "Prozesssoftware Mittelstand",
      "SaaS MVP Agentur",
    ],
    features: [
      "Login und Rollen",
      "Dashboards",
      "Datenmodelle und APIs",
      "Workflows und Benachrichtigungen",
      "Dateien und Dokumente",
      "Auditierbare Zustände",
    ],
    outcomes: [
      "Produktkonzept vor dem Build",
      "Responsive App + Backend/API",
      "Deployment- und Betriebsübergabe",
    ],
    idealFor: [
      "Kundenportale",
      "SaaS-MVPs",
      "Interne Werkzeuge",
      "Buchungsplattformen",
    ],
    faqs: [
      {
        q: "Was kostet eine Web-App MVP?",
        a: "Richtaufwand 6–8 Arbeitstage × 449 € = 2694–3592 € netto. Komplexität (Rollen, Integrationen) steuert den Scope.",
      },
      {
        q: "Unterschied zu Kundenportal?",
        a: "Kundenportal ist ein typischer Anwendungsfall einer Web-App. Für portal-fokussierte Briefings siehe auch die Leistungsseite Kundenportal.",
      },
      {
        q: "Bleibt der Code bei uns?",
        a: "Ja. Vollständige Übergabe, kein Plattform-Lock-in.",
      },
      {
        q: "Welche Web-App-Funktionen sind im Standardumfang?",
        a: "Login und Rollenkonzept, Dashboards und Auswertungen, Datenmodelle und APIs, Workflows mit Benachrichtigungen sowie Datei- und Dokumentenverwaltung.",
      },
      {
        q: "Wie läuft ein Web-App-Projekt ab?",
        a: "Produktkonzept vor dem Build, dann responsive Umsetzung mit Backend/API, Tests und Deployment-Übergabe — inklusive Betriebsdokumentation.",
      },
      {
        q: "Bauen Sie auch komplexe Systeme?",
        a: "Ja, ab zwölf Arbeitstagen. Umfang, Integrationen und Abnahmekriterien werden vorab schriftlich festgelegt — Mehrbedarf wird immer vor Ausführung sichtbar.",
      },
    ],
    branchen: ["steuerberater", "agenturen", "immobilien"],
    related: ["kundenportal", "mobile-apps", "automatisierung"],
    locationNote: LOC,
  },
  {
    slug: "mobile-apps",
    shortTitle: "Mobile App",
    h1: "Mobile App entwickeln — iOS & Android mit gemeinsamem Kern",
    metaTitle: "Mobile App entwickeln lassen — Cross-Platform",
    metaDescription: "Cross-Platform Mobile Apps in 6–8 Tagen (2694–3592 € netto). Auth, Push, Store-Vorbereitung. NeXify AI.",
    eyebrow: "Leistung · Mobile App",
    answerFirst: "Mobile MVPs liefert NeXify AI cross-platform in sechs bis acht Arbeitstagen (2694–3592 € netto): gemeinsames Designsystem, API-Anbindung, Auth und Store-Vorbereitung.",
    body: "Fokussierte Produkte statt Feature-Friedhof. Ideal für Service, Außendienst und Kundenbindung.",
    daysLabel: "6–8 Arbeitstage",
    minDays: 6,
    maxDays: 8,
    primaryKeyword: "Mobile App entwickeln lassen",
    secondaryKeywords: [
      "Cross Platform App Agentur",
      "iOS Android App B2B",
      "Außendienst App Entwicklung",
      "App MVP Festpreis",
    ],
    features: [
      "iOS und Android",
      "Cross-Platform-Architektur",
      "Authentifizierung",
      "Push und Benachrichtigungen",
      "Offline-/Sync-Konzept",
      "Store-Vorbereitung",
    ],
    outcomes: [
      "Klarer Produktflow",
      "Gerätetests und Release-Checkliste",
      "API-Integration dokumentiert",
    ],
    idealFor: [
      "Service-Apps",
      "Außendienst",
      "Kundenbindung",
    ],
    faqs: [
      {
        q: "Native oder Cross-Platform?",
        a: "Standard ist Cross-Platform mit gemeinsamem Produktkern — schneller und wartbarer für die meisten B2B-MVPs. Native nur wenn der Use-Case es verlangt.",
      },
      {
        q: "Was kostet der MVP?",
        a: "Richtaufwand 6–8 Tage × 449 € = 2694–3592 € netto. Store-Gebühren und Gerätehardware sind Fremdkosten.",
      },
      {
        q: "Geht das remote für DACH?",
        a: "Lieferung remote für Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden — Sitz Venlo (NL), ohne Fake-Filialnetz.",
      },
      {
        q: "Welche App-Funktionen sind im Standardumfang?",
        a: "iOS und Android aus einer Codebasis, Authentifizierung, Push und Benachrichtigungen, Offline-/Sync-Konzept und Store-Vorbereitung.",
      },
      {
        q: "Wie lange dauert eine Mobile App?",
        a: "Kompakte Cross-Platform-MVPs in sechs bis acht Arbeitstagen, umfangreiche Apps ab zwölf Tagen — inklusive Gerätetests und Release-Checkliste.",
      },
      {
        q: "Wer veröffentlicht die App in den Stores?",
        a: "Wir bereiten die Veröffentlichung vor (Release-Checkliste, Assets, Datenschutzangaben). Die Store-Accounts gehören Ihnen — keine Übergabe fremder Zugänge.",
      },
    ],
    branchen: ["handwerk", "immobilien", "ecommerce"],
    related: ["web-apps", "kundenportal", "automatisierung"],
    locationNote: LOC,
  },
  {
    slug: "automatisierung",
    shortTitle: "Automatisierung",
    h1: "Geschäftsprozesse automatisieren — AI-gestützt mit Kontrolle",
    metaTitle: "Prozessautomatisierung mit AI — ab 1 Tag",
    metaDescription: "AI-gestützte Automatisierung mit Freigaben und Monitoring. Ab 1 Arbeitstag / ab 449 € netto. B2B DACH + NL.",
    eyebrow: "Leistung · Automatisierung",
    answerFirst: "NeXify AI automatisiert wiederkehrende Aufgaben mit Workflows, Integrationen und AI-Schritten — messbar, dokumentiert und freigabefähig. Einstieg ab einem Arbeitstag (ab 449 € netto).",
    body: "Nicht möglichst viel automatisieren, sondern das Richtige: E-Mail-/Dokumentenflows, CRM/ERP, Policy-Gates und Recovery.",
    daysLabel: "ab 1 Arbeitstag",
    minDays: 1,
    from: true,
    primaryKeyword: "Geschäftsprozesse automatisieren",
    secondaryKeywords: [
      "KI Automatisierung Mittelstand",
      "Prozessautomatisierung Agentur",
      "CRM ERP Automation DACH",
      "Workflow Automatisierung B2B",
    ],
    features: [
      "Prozessanalyse",
      "E-Mail- und Dokumentenflows",
      "CRM-/ERP-Integrationen",
      "Freigaben und Policy-Gates",
      "Monitoring",
      "Fehler- und Recovery-Pfade",
    ],
    outcomes: [
      "Prozesskarte vor dem Build",
      "Testfälle und Monitoring",
      "Betriebsdokumentation",
    ],
    idealFor: [
      "Vertrieb",
      "Support",
      "Backoffice",
      "Projektprozesse",
    ],
    faqs: [
      {
        q: "Ersetzt Automatisierung Mitarbeiter?",
        a: "Nein — Ziel ist weniger Routine und klarere Kontrolle. Fachliche Verantwortung und Freigaben bleiben bei Menschen.",
      },
      {
        q: "Was kostet der Einstieg?",
        a: "Ab 1 Arbeitstag × 449 €. Sinnvoll oft nach einem Audit-Tag, der die Top-Hebel priorisiert.",
      },
      {
        q: "Nutzt ihr n8n?",
        a: "n8n ist bei uns kein Integrationsziel. Wir wählen Workflow- und Integrationswege passend zu Sicherheit, Betrieb und Ihrem Stack.",
      },
      {
        q: "Welche Prozesse eignen sich zuerst?",
        a: "Häufige, regelbasierte und nervige Abläufe: E-Mail- und Dokumentenflows, CRM-/ERP-Integrationen, Berichtserstellung. Hier ist der Return sofort messbar.",
      },
      {
        q: "Wie schnell ist ein Workflow produktiv?",
        a: "Erste messbare Ergebnisse gibt es bei fokussierten Workflows nach zwei bis vier Wochen — Prozesskarte und Baseline vor dem Build, Auswertung nach dem Go-Live.",
      },
      {
        q: "Bleibt die Automatisierung kontrollierbar?",
        a: "Ja: Freigaben und Policy-Gates, Monitoring sowie Fehler- und Recovery-Pfade gehören zum Lieferumfang — jede Aktion bleibt nachvollziehbar.",
      },
    ],
    branchen: ["handwerk", "steuerberater", "ecommerce", "immobilien", "kanzleien", "logistik", "pflege", "gastronomie", "produktion"],
    related: ["ai-agenten", "audit", "ki-plattform"],
    locationNote: LOC,
  },
  {
    slug: "ai-agenten",
    shortTitle: "AI-Agenten",
    h1: "AI-Agenten für Unternehmen — Rollen, Tools, Freigaben",
    metaTitle: "AI-Agenten entwickeln lassen — ab 3 Tagen",
    metaDescription: "Agenten mit Rollen, RAG, Tools und Evidence — keine unkontrollierten Chatbots. Ab 3 Tagen / ab 1347 €. NeXify AI.",
    eyebrow: "Leistung · AI-Agenten",
    answerFirst: "NeXify AI baut AI-Agenten mit eindeutigen Rollen, Wissenszugriff, Tool-Anbindung und Freigabestufen — ab drei Arbeitstagen (ab 1347 € netto). Keine Demo-Chatbots ohne Nachweis.",
    body: "Werkzeuge, Regeln und Protokolle statt Blackbox. Ideal für Wissensarbeit, Support, Recherche und interne Operations.",
    daysLabel: "ab 3 Arbeitstagen",
    minDays: 3,
    from: true,
    primaryKeyword: "AI-Agenten für Unternehmen",
    secondaryKeywords: [
      "KI Agenten Agentur Deutschland",
      "RAG Agent entwickeln",
      "Unternehmens Chatbot mit Freigaben",
      "AI Operator Mittelstand",
    ],
    features: [
      "Rollen und Berechtigungen",
      "Wissenszugriff",
      "Tool- und API-Anbindung",
      "Freigabestufen",
      "Evaluation",
      "Evidence und Monitoring",
    ],
    outcomes: [
      "Agentenprofil und Sicherheitsregeln",
      "Testsuite und Betriebskonzept",
      "Nachvollziehbare Evidence-Pfade",
    ],
    idealFor: [
      "Wissensarbeit",
      "Support",
      "Recherche",
      "Interne Operations",
    ],
    faqs: [
      {
        q: "Was unterscheidet eure Agenten von ChatGPT?",
        a: "Unternehmensdaten, Tools, Rollen und Freigaben sind definiert. Antworten und Aktionen bleiben auditierbar — kein unkontrollierter Consumer-Chat.",
      },
      {
        q: "Was kostet ein Einstieg?",
        a: "Ab 3 Arbeitstagen × 449 € = ab 1347 € netto. Scope folgt Datenquellen und Tool-Anbindungen.",
      },
      {
        q: "Ist das DSGVO-tauglich?",
        a: "Wir planen Zugriffe, Speicherung und Freigaben bewusst. Konkrete Rechtsberatung ist nicht Bestandteil — AVV und KI-Hinweise stellen wir bereit.",
      },
      {
        q: "Welche Aufgaben übernimmt ein AI-Agent?",
        a: "Typisch sind Support-Vorqualifizierung, interne Wissensarbeit mit Quellenangabe und Backoffice-Routine wie Statusprüfung oder Entwurfserstellung — immer mit menschlicher Freigabe bei heiklen Schritten.",
      },
      {
        q: "Wie wird die Qualität der Antworten geprüft?",
        a: "Durch Evaluation und Testsuiten mit Negativtests, Evidence-Logs jeder Aktion sowie definierte Ausstiegskriterien — Qualität ist Teil des Lieferumfangs.",
      },
      {
        q: "Wie schnell ist ein Agent einsatzbereit?",
        a: "Erste Agenten-Versionen entstehen ab drei Arbeitstagen. Der schmale Pilot (ein Prozess, eine Datenquelle) ist der empfohlene Start.",
      },
    ],
    branchen: ["steuerberater", "agenturen", "ecommerce", "kanzleien", "logistik", "pflege", "gastronomie", "produktion"],
    related: ["ki-begleiter", "automatisierung", "ki-plattform"],
    locationNote: LOC,
  },
  {
    slug: "ki-begleiter",
    shortTitle: "KI-Begleiter",
    h1: "KI-Begleiter für Ihr Unternehmen — Assistent mit Grenzen",
    metaTitle: "KI-Begleiter / AI-Assistent für KMU — DACH",
    metaDescription: "Persönlicher KI-Begleiter mit Wissensbasis und Freigaben — kein unkontrollierter Bot. B2B DACH + NL. Tagessatz 449 €.",
    eyebrow: "Leistung · KI-Begleiter",
    answerFirst: "Ein KI-Begleiter von NeXify AI ist ein fachlich begrenzter Assistent mit Wissenszugriff, Regeln und Freigaben — eingebettet in Website oder Portal. Aufwand typischerweise ab drei Arbeitstagen, abhängig von Datenquellen.",
    body: "Kunden und Teams bekommen Antworten und nächste Schritte — ohne dass der Bot Verträge schließt oder unkontrolliert handelt.",
    daysLabel: "ab 3 Arbeitstagen",
    minDays: 3,
    from: true,
    primaryKeyword: "KI-Begleiter Unternehmen",
    secondaryKeywords: [
      "AI Assistent Mittelstand",
      "KI Berater Website",
      "Digitaler Assistent B2B",
      "KI Begleiter DACH",
    ],
    features: [
      "Rollenklarheit und Guardrails",
      "Wissensbasis / RAG",
      "Einbettung in Website oder Portal",
      "Eskalation an Menschen",
      "Protokollierung",
      "Evaluation von Antworten",
    ],
    outcomes: [
      "Entlastung bei Standardfragen",
      "Klarer Handoff an Vertrieb/Support",
      "Messbare Qualitätskriterien",
    ],
    idealFor: [
      "Service",
      "Beratung",
      "Interne Wissensarbeit",
    ],
    faqs: [
      {
        q: "Ist der KI-Begleiter dasselbe wie AI-Agenten?",
        a: "Verwandt: Der Begleiter ist oft die kundennahe Schicht; Agenten können tiefer Tools und Workflows bedienen. Wir schneiden den Scope ehrlich zu.",
      },
      {
        q: "Brauche ich dafür eine eigene Plattform?",
        a: "Nicht zwingend. Viele Begleiter starten auf der Website. Für Graph/Memory/Router siehe KI-Plattform-Integration.",
      },
      {
        q: "Was kostet es?",
        a: "Ab ca. 3 Tagen × 449 €. Nach kurzem Fit-Call oder Audit priorisieren wir den sinnvollsten Slice.",
      },
      {
        q: "Woran erkennt der Nutzer, dass er mit KI spricht?",
        a: "Transparenz ist Pflicht: Der KI-Hinweis kennzeichnet Chat-Kontakt (EU AI Act Art. 50). Grenzen und Eskalation an Menschen sind Teil des Konzepts.",
      },
      {
        q: "Welche Daten nutzt der Begleiter?",
        a: "Eine definierte Wissensbasis (z. B. eigene Dokumente, FAQ, Produktdaten) mit Rechten je Rolle — keine freie Internetrecherche ohne Freigabe.",
      },
      {
        q: "Wie wird der Begleiter in die Website eingebettet?",
        a: "Als Chat-Widget mit eigenem Design, DSGVO-Hinweis und Session-Log — wie NeXify AI auf dieser Website, nur für Ihr Unternehmen.",
      },
    ],
    branchen: ["steuerberater", "agenturen", "immobilien"],
    related: ["ai-agenten", "websites", "ki-plattform"],
    locationNote: LOC,
  },
  {
    slug: "kundenportal",
    shortTitle: "Kundenportal",
    h1: "Kundenportal bauen — Status, Dokumente, Self-Service",
    metaTitle: "Kundenportal entwickeln lassen — B2B Portal",
    metaDescription: "Kundenportal mit Login, Status und Dokumenten. MVP typisch 6–8 Tage. Tagessatz 449 €. NeXify AI DACH + NL.",
    eyebrow: "Leistung · Kundenportal",
    answerFirst: "NeXify AI entwickelt B2B-Kundenportale mit Login, Rollen, Status und Dokumenten — typisch als Web-App-MVP in sechs bis acht Arbeitstagen (2694–3592 € netto).",
    body: "Weniger E-Mail-Chaos, mehr Self-Service. Ideal für Kanzleien, Agenturen und Dienstleister mit wiederkehrenden Mandanten-/Kundenprozessen.",
    daysLabel: "6–8 Arbeitstage",
    minDays: 6,
    maxDays: 8,
    primaryKeyword: "Kundenportal entwickeln lassen",
    secondaryKeywords: [
      "B2B Kundenportal Software",
      "Client Portal Agentur",
      "Mandantenportal Entwicklung",
      "Self Service Portal KMU",
    ],
    features: [
      "Authentifizierung und Rollen",
      "Status und Tickets/Aufgaben",
      "Dokumentenablage",
      "Benachrichtigungen",
      "Audit-Trail",
      "API zu Bestandssystemen",
    ],
    outcomes: [
      "Weniger manuelle Statusmails",
      "Transparente Kundenkommunikation",
      "Erweiterbarer Produktkern",
    ],
    idealFor: [
      "Kanzleien",
      "Agenturen",
      "Dienstleister",
      "SaaS-Slices",
    ],
    faqs: [
      {
        q: "Portal oder reine Web-App?",
        a: "Kundenportal ist der produktnahe Name; technisch oft eine Web-App. Wir wählen die Seite, die Ihre Suchintention und Ihren Scope am klarsten trifft.",
      },
      {
        q: "Kann das White-Label sein?",
        a: "Ja — Partner behalten die Kundenbeziehung, wir liefern die Umsetzung. Siehe White-Label.",
      },
      {
        q: "Remote für Deutschland?",
        a: "Lieferung remote für Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden — Sitz Venlo (NL), ohne Fake-Filialnetz.",
      },
      {
        q: "Welche Portal-Funktionen sind im MVP enthalten?",
        a: "Authentifizierung und Rollen, Status und Tickets/Aufgaben, Dokumentenablage, Benachrichtigungen, Audit-Trail und eine API zu Bestandssystemen.",
      },
      {
        q: "Wie schnell ist ein Kundenportal live?",
        a: "Typisch sechs bis acht Arbeitstage für das MVP. Vorab entsteht ein Produktkonzept mit Scope und Abnahmekriterien.",
      },
      {
        q: "Was reduziert ein Portal im Tagesgeschäft?",
        a: "Manuelle Statusmails und Rückfragen: Kunden sehen Status und Dokumente selbst — Kommunikation wird transparenter und Support entlastet.",
      },
    ],
    branchen: ["steuerberater", "agenturen", "immobilien"],
    related: ["web-apps", "white-label", "automatisierung"],
    locationNote: LOC,
  },
  {
    slug: "ki-plattform",
    shortTitle: "KI-Plattform",
    h1: "KI-Plattform integrieren — Router, Memory, Wissensgraph",
    metaTitle: "KI-Plattform Integration — Router Memory RAG",
    metaDescription: "Kundennahe Integration von LLM-Routing, Agent-Memory und Wissenssuche — mit Kontrolle und Evidence. Tagessatz 449 €. NeXify AI.",
    eyebrow: "Leistung · KI-Plattform",
    answerFirst: "NeXify AI integriert KI-Laufzeitbausteine für Unternehmen: Modell-Routing, Agentengedächtnis und semantische Wissenssuche — nativ in Ihre Prozesse, mit Freigaben und Nachweisen statt Iframe-Flickenteppich.",
    body: "Kundenfreundlich: zuverlässige Antworten aus Ihrem Wissen, gesteuerte Modellwahl und nachvollziehbare Agentenaktionen. Technisch erprobte Open-Source- und Eigenbetrieb-Komponenten (Router-, Memory- und RAG-Schichten) — ohne Vendor-Lock-in-Theater.",
    daysLabel: "ab 3 Arbeitstagen",
    minDays: 3,
    from: true,
    primaryKeyword: "KI Plattform Integration Unternehmen",
    secondaryKeywords: [
      "LLM Router Integration",
      "Agent Memory Unternehmen",
      "RAG Wissensgraph B2B",
      "AI Stack Mittelstand",
    ],
    features: [
      "Modell-Routing und Allowlists",
      "Agentengedächtnis / Session-Kontext",
      "Semantische Wissenssuche (RAG)",
      "Freigaben und Policy-Gates",
      "Dual-Write / Indexierung wo sinnvoll",
      "Betriebs- und Sicherheitsgrenzen",
    ],
    outcomes: [
      "Weniger Tool-Chaos, klarer AI-Stack",
      "Citierbare, nachvollziehbare Antworten",
      "Skalierbarer Pfad von Pilot zu Betrieb",
    ],
    idealFor: [
      "Produktteams",
      "Ops",
      "Wissensintensive KMU",
      "Partner-Agenturen",
    ],
    faqs: [
      {
        q: "Müsst ihr unsere Daten in die Cloud schicken?",
        a: "Wir planen Speicher- und Verarbeitungsorte bewusst (EU/Self-Host wo sinnvoll). Konkrete Architektur folgt Ihrem Compliance-Rahmen.",
      },
      {
        q: "Ist das nur für Konzerne?",
        a: "Nein. Der Einstieg ist oft ein Pilot-Slice (z. B. Wissenssuche + ein Agent) zum Tagessatz — nicht ein Enterprise-Rahmenvertrag.",
      },
      {
        q: "Wie startet man?",
        a: "Fit-Call oder Audit-Tag, dann Pilot. Siehe auch AI-Agenten und Automatisierung.",
      },
      {
        q: "Welche Bausteine gehören zu einer KI-Plattform?",
        a: "Modell-Routing mit Allowlists, Agentengedächtnis und Session-Kontext, semantische Wissenssuche (RAG), Freigaben und Policy-Gates sowie Betriebs- und Sicherheitsgrenzen.",
      },
      {
        q: "Was bringt Modell-Routing im Betrieb?",
        a: "Passende Modelle je Aufgabe, Kostenkontrolle und definierte Ausfallpfade — statt eines einzigen Blackbox-Anbieters mit Preisrisiko.",
      },
      {
        q: "Wie bleiben Antworten nachvollziehbar?",
        a: "Durch Dual-Write und Indexierung, zitierbare Quellen und Evidence-Logs je Agentenaktion — skaliert vom Pilot bis zum Betrieb.",
      },
    ],
    branchen: ["agenturen", "steuerberater", "ecommerce"],
    related: ["ai-agenten", "automatisierung", "audit"],
    locationNote: LOC,
  },
  {
    slug: "beratung",
    shortTitle: "KI-Beratung",
    h1: "KI-Beratung für Mittelstand — klarer Scope statt Folien",
    metaTitle: "KI-Beratung Mittelstand DACH — Tagessatz",
    metaDescription: "KI- und Digitalisierungsberatung für KMU: Prioritäten, Aufwand, nächster Slice. Tagessatz 449 € netto. Remote DACH + NL.",
    eyebrow: "Leistung · Beratung",
    answerFirst: "NeXify AI berät B2B-Unternehmen zu Website, Automatisierung und KI — mit schriftlichen Prioritäten und realistischem Tagesaufwand (449 € netto), nicht mit Verkaufsfolien.",
    body: "Oft kombiniert mit Audit-Tag oder kostenloser Sprechstunde. Ziel: entscheiden, was sich lohnt — und was bewusst nicht.",
    daysLabel: "ab 1 Arbeitstag",
    minDays: 1,
    from: true,
    primaryKeyword: "KI Beratung Mittelstand",
    secondaryKeywords: [
      "KI Beratung Deutschland",
      "Digitalisierungsberatung KMU",
      "AI Strategy Workshop Alternative",
      "KI Beratung remote DACH",
    ],
    features: [
      "Ist-Analyse Website/Prozesse/Tools",
      "Priorisierung Aufwand × Nutzen",
      "Technische Machbarkeit",
      "Risiken und Guardrails",
      "Empfehlung Pilot vs. Pause",
      "Schriftliches Ergebnis",
    ],
    outcomes: [
      "Entscheidungsvorlage statt Buzzwords",
      "Klare nächste Schritte",
      "Optional: direkter Übergang in Umsetzung",
    ],
    idealFor: [
      "Geschäftsführung",
      "Ops",
      "IT-Verantwortliche KMU",
    ],
    faqs: [
      {
        q: "Unterschied zu Audit?",
        a: "Beratung kann kürzer/fokussierter sein; das Audit ist der produktisierte 1-Tages-Deliverable-Pfad. Beide nutzen denselben Tagessatz.",
      },
      {
        q: "Gibt es eine kostenlose Einstiegsoption?",
        a: "Ja: die AI-Sprechstunde / Rückruf (ca. 15–20 Min) zur Fit-Prüfung.",
      },
      {
        q: "BAFA-Beratung?",
        a: "Wir sind kein BAFA-zertifizierter Berater und behaupten das nicht. Förderfragen klären Sie mit Ihrem Steuerberater/zuständiger Stelle.",
      },
      {
        q: "Was bekomme ich nach der Beratung schriftlich?",
        a: "Eine Ist-Analyse mit Priorisierung nach Aufwand × Nutzen, technischer Machbarkeit, Risiken und einer klaren Empfehlung — Pilot, weitere Tage oder Pause.",
      },
      {
        q: "Für wen ist KI-Beratung sinnvoll?",
        a: "Für Geschäftsführung, Ops und IT-Verantwortliche im Mittelstand, die vor einer Investition entscheiden wollen, was sich lohnt — und was bewusst nicht.",
      },
      {
        q: "Wie läuft die Beratung ab?",
        a: "Remote per Video, in der Regel ein halber bis ganzer Tag: Gespräch, Sichtung der Systeme, schriftliche Prioritäten — ohne Verkaufsfolien.",
      },
    ],
    branchen: ["handwerk", "steuerberater", "ecommerce", "kanzleien", "logistik", "pflege", "gastronomie", "produktion"],
    related: ["audit", "workshops", "automatisierung"],
    locationNote: LOC,
  },
  {
    slug: "workshops",
    shortTitle: "Workshops",
    h1: "KI- & Digital-Workshops für Teams — praxisnah, B2B",
    metaTitle: "KI Workshop Unternehmen — praxisnah DACH",
    metaDescription: "Workshops zu KI, Automatisierung und Web-Delivery für Teams. Tagessatz 449 €. Remote oder vor Ort nach Absprache.",
    eyebrow: "Leistung · Workshops",
    answerFirst: "NeXify AI führt praxisnahe KI- und Digital-Workshops für B2B-Teams: konkrete Use-Cases, Guardrails und ein umsetzbarer Backlog — ab einem Arbeitstag (449 € netto).",
    body: "Kein Motivationsseminar. Ziel ist gemeinsames Verständnis und priorisierte nächste Schritte. Vor Ort in der Grenzregion DACH/NL nach Absprache; sonst remote.",
    daysLabel: "ab 1 Arbeitstag",
    minDays: 1,
    from: true,
    primaryKeyword: "KI Workshop Unternehmen",
    secondaryKeywords: [
      "AI Workshop Mittelstand",
      "Automatisierung Workshop Team",
      "Digital Workshop KMU",
      "KI Schulung B2B",
    ],
    features: [
      "Zielgruppen- und Pain-Mapping",
      "Live-Demo relevanter Patterns",
      "Guardrails und Risiken",
      "Priorisierter Use-Case-Backlog",
      "Übergabe an Pilot/Umsetzung",
      "Optional: Hands-on Prompt-/Flow-Übung",
    ],
    outcomes: [
      "Team-Alignment",
      "Schriftliche Prioritäten",
      "Klarer Upsell nur bei echtem Fit",
    ],
    idealFor: [
      "Führungsteams",
      "Ops",
      "Agentur-Teams",
      "Partner",
    ],
    faqs: [
      {
        q: "Online oder vor Ort?",
        a: "Standard remote. Vor Ort in erreichbarer Distanz zur Grenzregion Venlo nach Absprache — ohne Fake-Filialversprechen.",
      },
      {
        q: "Wie groß darf die Gruppe sein?",
        a: "Sinnvoll meist 4–12 Personen. Größere Formate splitten wir oder verkürzen die Agenda.",
      },
      {
        q: "Was kostet ein Workshop-Tag?",
        a: "449 € netto pro Arbeitstag. Reisezeit/Spesen nur wenn vor Ort und vorab vereinbart.",
      },
      {
        q: "Was ist das Ergebnis eines Workshops?",
        a: "Team-Alignment, ein priorisierter Use-Case-Backlog und eine schriftliche Empfehlung für den nächsten Schritt — kein Motivationsseminar.",
      },
      {
        q: "Welche Themen deckt ein Workshop ab?",
        a: "KI-Grundlagen mit Live-Demos relevanter Patterns, Automatisierungs-Use-Cases, Guardrails und Risiken sowie optional eine Hands-on-Übung zu Prompts und Flows.",
      },
      {
        q: "Eignet sich ein Workshop als Projektstart?",
        a: "Ja, häufig als Kickoff: Das Team versteht danach, welche Prozesse sich lohnen — und der Übergang in einen Pilot ist direkt möglich.",
      },
    ],
    branchen: ["agenturen", "steuerberater", "handwerk"],
    related: ["beratung", "audit", "white-label"],
    locationNote: LOC,
  },
  {
    slug: "white-label",
    shortTitle: "White-Label",
    h1: "White-Label Web & AI — Sie bleiben Kundenface",
    metaTitle: "White-Label Entwicklung Agentur Partner",
    metaDescription: "White-Label-Umsetzung für Agenturen und Freelancer: Web, Shop, Automation zum Tagessatz 449 €. Partner bleibt Kundenbeziehung.",
    eyebrow: "Leistung · White-Label",
    answerFirst: "NeXify AI liefert White-Label Web-, Shop- und AI-Umsetzung für Agenturen und Freelancer: Sie behalten die Kundenbeziehung, wir liefern zum Tagessatz 449 € netto — repo-fähig und partnerfähig.",
    body: "Overflow ohne neues Headcount. Kein Paid Partner-Portal, keine Fake-Logos. Einstieg über Partner-Gespräch oder Rückruf.",
    daysLabel: "nach Scope · Tagessatz",
    minDays: 1,
    from: true,
    primaryKeyword: "White-Label Entwicklung Agentur",
    secondaryKeywords: [
      "White Label Webentwicklung",
      "Agentur Overflow Partner",
      "White Label AI Automation",
      "Partner Delivery DACH",
    ],
    features: [
      "Umsetzung unter Ihrer Marke (nach Vereinbarung)",
      "Klare Tagessatz-Kalkulation für Ihre Angebote",
      "Repo-Disziplin und Übergabe",
      "NDA/Partner-Rahmen auf Wunsch",
      "Kein Retainer-Zwang",
      "Cross-Referral möglich",
    ],
    outcomes: [
      "Kapazität ohne Hiring",
      "Qualität, die Sie weiterverkaufen können",
      "Transparente Margen-Rechnung",
    ],
    idealFor: [
      "Digitalagenturen",
      "SEO-Freelancer",
      "Design-Studios",
      "IT-Freelancer",
    ],
    faqs: [
      {
        q: "Wie starten Partner?",
        a: "Über /partner oder Rückruf. Wir klären Fit, NDA und typische Scopes — ohne erfundene Provisionsversprechen.",
      },
      {
        q: "Wer spricht mit dem Endkunden?",
        a: "Standard: Sie. Direkter Kundenkontakt durch uns nur wenn Sie das wollen.",
      },
      {
        q: "Gibt es Mindestvolumen?",
        a: "Nein. Ein klarer Pilot-Slice reicht als Einstieg.",
      },
      {
        q: "Was liefert ihr im White-Label?",
        a: "Web-, Shop- und AI-Umsetzung unter Ihrer Marke (nach Vereinbarung), mit klarer Tagessatz-Kalkulation für Ihre Angebote und Repo-Disziplin bei der Übergabe.",
      },
      {
        q: "Wie kalkuliere ich als Partner meine Marge?",
        a: "Transparent: Ihre Angebotskalkulation baut auf dem Tagessatz auf, wir zeigen die Rechengrundlage — keine versteckten Retainer oder Zusatzgebühren.",
      },
      {
        q: "Brauchen Partner ein Paid-Portal?",
        a: "Nein. Es gibt kein Partner-Portal-Abo — der Einstieg läuft über Gespräch, NDA auf Wunsch und klare Pilot-Scopes.",
      },
    ],
    branchen: ["agenturen"],
    related: ["websites", "web-apps", "automatisierung", "workshops"],
    locationNote: LOC,
  },
  {
    slug: "audit",
    shortTitle: "KI-/Prozess-Audit",
    h1: "KI-/Prozess-Audit — 1 Tag, schriftliche Prioritäten",
    metaTitle: "KI Prozess Audit — 449 € netto (1 Tag)",
    metaDescription: "1-Tages-Audit: Top-Hebel, Festpreis-Pilot-Empfehlung, Deliverable gehört Ihnen. 449 € netto. B2B DACH + NL.",
    eyebrow: "Leistung · Audit",
    answerFirst: "Das NeXify KI-/Prozess-Audit ist ein bezahlter Arbeitstag (449 € netto) mit schriftlichem Deliverable: Ist-Zustand, Top-3 Hebel und Festpreis-Empfehlung für einen Pilot — ohne Folien-Theater.",
    body: "Filtert Willingness-to-Pay besser als endlose Sales-Calls. Detailseite auch unter /audit. Danach entscheiden Sie: Pilot, weitere Tage oder Pause.",
    daysLabel: "1 Arbeitstag",
    minDays: 1,
    maxDays: 1,
    primaryKeyword: "KI Audit Unternehmen",
    secondaryKeywords: [
      "Prozess Audit Digitalisierung",
      "AI Readiness Audit KMU",
      "Automatisierung Audit",
      "KI Potenzialanalyse Mittelstand",
    ],
    features: [
      "Ist-Zustand Website/Tools/Prozesse",
      "Top-3 Hebel Aufwand × Nutzen",
      "Festpreis-Empfehlung Pilot",
      "Risiken und Guardrails",
      "Schriftliches Dokument",
      "Keine Kaufpflicht",
    ],
    outcomes: [
      "Entscheidungsgrundlage in einem Tag",
      "Klarer Pilot-Scope",
      "Dokument bleibt Ihres",
    ],
    idealFor: [
      "KMU vor KI-Invest",
      "Ops",
      "Geschäftsführung",
    ],
    faqs: [
      {
        q: "Was passiert nach dem Audit?",
        a: "Sie entscheiden frei. Typisch folgt ein 5-Tage-Pilot (5 × Tagessatz), wenn der Fit stimmt.",
      },
      {
        q: "Ist das dasselbe wie Beratung?",
        a: "Das Audit ist die produktisierte 1-Tages-Variante mit festem Deliverable-Format.",
      },
      {
        q: "Remote möglich?",
        a: "Lieferung remote für Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden — Sitz Venlo (NL), ohne Fake-Filialnetz.",
      },
      {
        q: "Was ist im Audit-Deliverable enthalten?",
        a: "Ist-Zustand von Website, Tools und Prozessen, die Top-3 Hebel nach Aufwand × Nutzen, eine Festpreis-Empfehlung für einen Pilot sowie Risiken und Guardrails.",
      },
      {
        q: "Muss ich nach dem Audit kaufen?",
        a: "Nein, es besteht keine Kaufpflicht. Das Dokument gehört Ihnen — Entscheidung über Pilot oder Pause liegt bei Ihnen.",
      },
      {
        q: "Für wen lohnt sich der Audit-Tag?",
        a: "Für KMU vor einer KI-Investition, die eine belastbare Entscheidungsgrundlage wollen — statt teurer Fehlstarts mit Tool-Lizenzen.",
      },
    ],
    branchen: ["handwerk", "steuerberater", "ecommerce", "immobilien", "agenturen", "kanzleien", "logistik", "pflege", "gastronomie", "produktion"],
    related: ["beratung", "automatisierung", "ai-agenten"],
    locationNote: LOC,
  }
];

export function getLeistungSeo(slug: string): LeistungSeo | undefined {
  return leistungenSeo.find((l) => l.slug === slug);
}

export function leistungSeoSlugs(): string[] {
  return leistungenSeo.map((l) => l.slug);
}

export function leistungPriceHint(l: LeistungSeo): string {
  const min = l.minDays * RATE;
  const max = l.maxDays != null ? l.maxDays * RATE : undefined;
  if (l.from) return `ab ${min.toLocaleString("de-DE")} € netto`;
  if (max != null && max !== min) {
    return `${min.toLocaleString("de-DE")}–${max.toLocaleString("de-DE")} € netto`;
  }
  return `${min.toLocaleString("de-DE")} € netto`;
}
