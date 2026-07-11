import {
  AppWindow,
  Bot,
  Boxes,
  ChartNoAxesCombined,
  Code2,
  Globe2,
  LayoutTemplate,
  MessageSquareMore,
  Rocket,
  Settings2,
  ShoppingCart,
  Smartphone,
  Workflow,
} from "lucide-react";

export const company = {
  brand: "NeXify AI",
  descriptor: "by NeXify — chat it. Automate it.",
  legalName: "NeXifyAI by NeXify – Chat it. Automate it.",
  legalForm: "Eenmanszaak",
  owner: "Pascal Courbois",
  role: "Inhaber / Directeur",
  address: "Graaf van Loonstraat 1E",
  postalCity: "5921 JA Venlo",
  country: "Niederlande",
  email: "mail@nexifyai.cloud",
  phone: "+31 6 133 188 56",
  phoneHref: "+31613318856",
  website: "https://nexifyai.cloud",
  kvk: "90483944",
  vatId: "NL865786276B01",
  dayRate: 999,
  vatRate: 0.21,
  targetMarket: "Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden",
  businessOnly: true,
} as const;

export const nav = [
  { label: "Leistungen", href: "/leistungen" },
  { label: "Preise", href: "/preise" },
  { label: "Arbeitsweise", href: "/prozess" },
  { label: "Über mich", href: "/ueber-mich" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  promise: string;
  days: string;
  minDays: number;
  maxDays?: number;
  from?: boolean;
  icon: typeof Globe2;
  features: string[];
  deliverables: string[];
  idealFor: string[];
};

export const services: Service[] = [
  {
    slug: "landingpages",
    title: "Landingpages, die verständlich verkaufen",
    shortTitle: "Landingpage",
    eyebrow: "Klar. Schnell. Conversion-orientiert.",
    description:
      "Eine fokussierte Seite für ein Angebot, eine Kampagne oder einen Markteintritt – konzipiert, gestaltet, entwickelt und technisch sauber ausgeliefert.",
    promise: "Eine verkaufsfähige Landingpage in einem Arbeitstag.",
    days: "1 Arbeitstag",
    minDays: 1,
    maxDays: 1,
    icon: LayoutTemplate,
    features: ["Premium UI/UX", "Responsive Design", "Kontakt- oder Leadformular", "Technisches SEO", "Performance-Basis", "Rechtliche Pflichtverlinkungen"],
    deliverables: ["Strategische Seitenstruktur", "Individuelles Graphite-Premium-Design", "Next.js-Umsetzung", "Formularintegration", "QA auf Desktop und Mobil"],
    idealFor: ["Neue Angebote", "Kampagnen", "Leadgenerierung", "Produktvalidierung"],
  },
  {
    slug: "websites",
    title: "Unternehmenswebsites mit Substanz",
    shortTitle: "Unternehmenswebsite",
    eyebrow: "Marke, Vertrauen und Nachfrage in einem System.",
    description:
      "Eine vollständige B2B-Unternehmenswebsite mit klarer Positionierung, Leistungsseiten, Kontaktführung, SEO-Grundlage und allen erforderlichen Standardseiten.",
    promise: "Eine vollständige Website in zwei bis drei Arbeitstagen.",
    days: "2–3 Arbeitstage",
    minDays: 2,
    maxDays: 3,
    icon: Globe2,
    features: ["Strategie und Informationsarchitektur", "Start- und Leistungsseiten", "Über-uns-/Expertenprofil", "Preis- und Prozessdarstellung", "Kontaktstrecke", "Rechtliche Seiten"],
    deliverables: ["Next.js App Router", "Shadcn-basiertes Designsystem", "SEO-Metadaten und Sitemap", "Responsive QA", "Deployment-Vorbereitung"],
    idealFor: ["Agenturen", "Beratungen", "Handwerk und Mittelstand", "B2B-Dienstleister"],
  },
  {
    slug: "onlineshops",
    title: "Onlineshops, die mit dem Sortiment wachsen",
    shortTitle: "Onlineshop",
    eyebrow: "Schneller Einkauf. Saubere Daten. Klare Prozesse.",
    description:
      "Vom fokussierten Shop bis zum umfangreichen Handelssystem: Produktsuche, Kategorien, Checkout, Zahlungen, Warenwirtschaft und Automatisierungen werden passend zum Betrieb geplant.",
    promise: "Standardshops in sechs bis acht Tagen, große Kataloge ab zwölf Tagen.",
    days: "6–8 Arbeitstage",
    minDays: 6,
    maxDays: 8,
    icon: ShoppingCart,
    features: ["Produkt- und Kategoriestruktur", "Suche und Filter", "Checkout und Zahlungsanbieter", "Bestellkommunikation", "SEO und strukturierte Daten", "Schnittstellen und Import"],
    deliverables: ["Shop-Frontend", "Administrationslogik", "Produktimport", "Checkout-Tests", "Betriebs- und Übergabedokumentation"],
    idealFor: ["D2C und B2B-Commerce", "Nischenhandel", "Hersteller", "Sortimente bis etwa 50.000 Artikel"],
  },
  {
    slug: "enterprise-commerce",
    title: "Commerce-Plattformen ab 50.000 Artikeln",
    shortTitle: "Großer Shop 50K+",
    eyebrow: "Kataloge, Suche, Integrationen und Betrieb für große Datenmengen.",
    description:
      "Für große Sortimente werden Datenmodell, Suchindex, Importpipeline, Caching, Produktvarianten, ERP/PIM-Anbindung und Betriebsmonitoring von Beginn an skalierbar angelegt.",
    promise: "Große Shops starten ab zwölf Arbeitstagen – der Umfang folgt der realen Systemkomplexität.",
    days: "ab 12 Arbeitstagen",
    minDays: 12,
    from: true,
    icon: Boxes,
    features: ["50.000+ Artikel", "Performante Suche und Facetten", "PIM-/ERP-/Feed-Integration", "Batch- und Delta-Importe", "Cache- und Indexstrategie", "Monitoring und Recovery"],
    deliverables: ["Technischer Blueprint", "Import- und Sucharchitektur", "Skalierbarer Shop", "Last- und Datenqualitätstests", "Betriebshandbuch"],
    idealFor: ["Großhandel", "Ersatzteilhandel", "Mehrmarkenshops", "Katalogbasierte Plattformen"],
  },
  {
    slug: "web-apps",
    title: "Web-Apps für echte Betriebsabläufe",
    shortTitle: "Web-App",
    eyebrow: "Portale, Dashboards und Prozesssoftware.",
    description:
      "Individuelle Web-Anwendungen für Kundenportale, interne Abläufe, Buchung, Disposition, Dokumente, Workflows oder branchenspezifische Prozesse.",
    promise: "Kompakte MVPs in sechs bis acht Tagen, komplexe Systeme ab zwölf Tagen.",
    days: "6–8 Arbeitstage",
    minDays: 6,
    maxDays: 8,
    icon: AppWindow,
    features: ["Login und Rollen", "Dashboards", "Datenmodelle und APIs", "Workflows und Benachrichtigungen", "Dateien und Dokumente", "Auditierbare Zustände"],
    deliverables: ["Produktkonzept", "Responsive Web-App", "Backend/API", "Tests", "Deployment- und Betriebsübergabe"],
    idealFor: ["Kundenportale", "SaaS-MVPs", "Interne Werkzeuge", "Buchungs- und Serviceplattformen"],
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps mit gemeinsamem Produktkern",
    shortTitle: "Mobile App",
    eyebrow: "Cross-Platform, wartbar und auf den Anwendungsfall reduziert.",
    description:
      "Mobile Anwendungen werden als fokussierte Produkte entwickelt – mit gemeinsamem Designsystem, sauberer API-Anbindung und klarer Veröffentlichungsstrategie.",
    promise: "Kompakte Cross-Platform-MVPs in sechs bis acht Tagen, umfangreiche Apps ab zwölf Tagen.",
    days: "6–8 Arbeitstage",
    minDays: 6,
    maxDays: 8,
    icon: Smartphone,
    features: ["iOS und Android", "Cross-Platform-Architektur", "Authentifizierung", "Push und Benachrichtigungen", "Offline-/Sync-Konzept", "Store-Vorbereitung"],
    deliverables: ["Produktflow", "App-Oberfläche", "API-Integration", "Gerätetests", "Release-Checkliste"],
    idealFor: ["Service-Apps", "Außendienst", "Kundenbindung", "Mobile Prozessunterstützung"],
  },
  {
    slug: "automatisierung",
    title: "AI-gestützte Automatisierung mit Kontrolle",
    shortTitle: "Automatisierung",
    eyebrow: "Weniger Routine. Mehr nachvollziehbarer Betrieb.",
    description:
      "Wiederkehrende Aufgaben werden analysiert, standardisiert und mit passenden Workflows, Integrationen und AI-gestützten Arbeitsschritten automatisiert.",
    promise: "Nicht möglichst viel automatisieren – sondern das Richtige, messbar und kontrolliert.",
    days: "ab 1 Arbeitstag",
    minDays: 1,
    from: true,
    icon: Workflow,
    features: ["Prozessanalyse", "E-Mail- und Dokumentenflows", "CRM-/ERP-Integrationen", "Freigaben und Policy-Gates", "Monitoring", "Fehler- und Recovery-Pfade"],
    deliverables: ["Prozesskarte", "Automatisierter Workflow", "Testfälle", "Monitoring", "Betriebsdokumentation"],
    idealFor: ["Vertrieb", "Support", "Backoffice", "Projekt- und Datenprozesse"],
  },
  {
    slug: "ai-agenten",
    title: "AI-gestützte Agenten für klar begrenzte Aufgaben",
    shortTitle: "AI-Agenten",
    eyebrow: "Werkzeuge, Regeln und Nachweise statt unkontrollierter Chatbots.",
    description:
      "Agentische Lösungen erhalten eindeutige Rollen, Datenzugriffe, Freigaben, Tests und Protokolle. So entstehen belastbare Assistenten und Operatoren statt Demo-Chats.",
    promise: "AI unterstützt die Arbeit – fachliche Verantwortung, Grenzen und Kontrolle bleiben sichtbar.",
    days: "ab 3 Arbeitstagen",
    minDays: 3,
    from: true,
    icon: Bot,
    features: ["Rollen und Berechtigungen", "Wissenszugriff", "Tool- und API-Anbindung", "Freigabestufen", "Evaluation", "Evidence und Monitoring"],
    deliverables: ["Agentenprofil", "Tool- und Wissensanbindung", "Sicherheitsregeln", "Testsuite", "Betriebskonzept"],
    idealFor: ["Wissensarbeit", "Support", "Recherche", "Interne Operations"],
  },
];

export const processSteps = [
  { n: "01", title: "Ziel und Geschäftsnutzen", text: "Wir klären, welches Ergebnis zählt, wer es nutzt und was bewusst nicht Teil des ersten Umfangs ist.", icon: ChartNoAxesCombined },
  { n: "02", title: "Konzept und Festpreisrahmen", text: "Der Aufwand wird in Arbeitstagen ausgewiesen. Sie sehen vorab Scope, Preisrahmen, Annahmen und mögliche Erweiterungen.", icon: MessageSquareMore },
  { n: "03", title: "AI-gestützte Umsetzung", text: "Moderne Entwicklungs- und Prüfwerkzeuge beschleunigen Analyse, Design, Code, Tests und Dokumentation – unter fachlicher Führung.", icon: Code2 },
  { n: "04", title: "Tests und Abnahme", text: "Funktion, Darstellung, Mobilansicht, Formulare, Performance und zentrale Nutzerwege werden nachvollziehbar geprüft.", icon: Settings2 },
  { n: "05", title: "Übergabe und Weiterentwicklung", text: "Sie erhalten Code, Dokumentation, klare Betriebsinformationen und eine priorisierte Liste sinnvoller nächster Schritte.", icon: Rocket },
];

export const faqs = [
  {
    q: "Wie kann eine vollständige Website in zwei bis drei Tagen entstehen?",
    a: "Nicht durch Weglassen von Qualität, sondern durch einen standardisierten Ablauf, wiederverwendbare technische Grundlagen, ein konsistentes Designsystem und AI-gestützte Analyse-, Entwicklungs- und Prüfprozesse. Pascal Courbois führt Konzeption, Architektur, Umsetzung und Qualitätskontrolle persönlich zusammen.",
  },
  {
    q: "Welche Rolle spielt AI in der Entwicklung?",
    a: "NeXify arbeitet AI-gestützt. Moderne Werkzeuge unterstützen Recherche, Strukturierung, Codeerstellung, Tests und Dokumentation. Fachliche Entscheidungen, Verantwortung, Prüfung und Freigabe bleiben beim erfahrenen Entwickler.",
  },
  {
    q: "Sind 999 Euro pro Arbeitstag ein Festpreis?",
    a: "Der Tagessatz ist fest. Vor Beginn erhalten Sie eine belastbare Aufwandsspanne. Ein verbindlicher Gesamtfestpreis ist möglich, sobald Umfang, Inhalte, Integrationen und Abnahmekriterien eindeutig feststehen.",
  },
  {
    q: "Was ist in einem Arbeitstag enthalten?",
    a: "Bis zu acht planbare Fachstunden für Konzeption, Designsystem, Entwicklung, Integration, Tests und Dokumentation. Fremdkosten wie Hosting, Domains, Zahlungsanbieter, Lizenzen, Inhalte oder Stockmaterial sind nicht enthalten, sofern nicht ausdrücklich vereinbart.",
  },
  {
    q: "Warum ist der Gesamtpreis trotz Fachmann-Niveau so niedrig?",
    a: "Weil nicht mehrere Abteilungen, Übergaben und lange Agenturketten bezahlt werden. Ein erfahrener Ansprechpartner steuert den gesamten Prozess und nutzt hochmoderne AI-gestützte Werkzeuge, Automatisierung und geprüfte Open-Source-Bausteine, um die Durchlaufzeit stark zu verkürzen.",
  },
  {
    q: "Gilt immer 21 Prozent BTW?",
    a: "Die Website zeigt den niederländischen Standardsatz von 21 Prozent als transparente Vergleichsrechnung. Bei grenzüberschreitenden B2B-Leistungen innerhalb der EU kann bei gültiger Umsatzsteuer-ID das Reverse-Charge-Verfahren gelten. Maßgeblich sind Rechnungsempfänger, Leistungsort und steuerliche Voraussetzungen.",
  },
  {
    q: "Arbeitet NeXify ausschließlich für Unternehmen?",
    a: "Ja. Angebote und Verträge richten sich ausschließlich an Unternehmer, juristische Personen und vergleichbare beruflich handelnde Organisationen.",
  },
  {
    q: "Welche Technologien werden eingesetzt?",
    a: "Je nach Ziel unter anderem Next.js, React, TypeScript, Shadcn-basierte Designsysteme, moderne Datenbanken und APIs, Vercel oder geeignete Self-Hosting-Infrastruktur. Technologie folgt dem Betrieb – nicht umgekehrt.",
  },
  {
    q: "Was passiert nach der Übergabe?",
    a: "Sie erhalten den vollständigen Quellcode, Dokumentation, Betriebsinformationen und eine priorisierte Liste sinnvoller nächster Schritte. Es gibt keinen Lock-in. Sie können den Code weiterentwickeln lassen, wo Sie wollen.",
  },
  {
    q: "Kann ich ein konkretes Beispiel sehen?",
    a: "Vertrauliche Kundenprojekte werden nicht ungefragt veröffentlicht. In einem kostenlosen Erstgespräch können wir aber über vergleichbare Projekte sprechen und Ihnen eine Referenz-URL zeigen, die für Ihre Branche relevant ist.",
  },
];

export const featurePillars = [
  { title: "Ein Fachmann, ein Ergebnis", text: "Keine Übergabekette zwischen Vertrieb, Design, Entwicklung und QA. Derjenige, der Ihren Scope versteht, trifft auch die technischen Entscheidungen und prüft das Ergebnis.", icon: Code2 },
  { title: "AI-gestützt, nicht AI-abgegeben", text: "AI verkürzt Recherche, Umsetzung und Prüfung um bis zu 60 %. Erfahrung entscheidet, was richtig, wartbar und wirtschaftlich ist. Keine Experimente auf Ihre Kosten.", icon: Bot },
  { title: "Transparenz pro Arbeitstag", text: "999 Euro netto pro Arbeitstag. Keine versteckten Posten, keine nachträglichen Überraschungen. Umfang, Annahmen und Zusatzaufwand werden vor Beginn dokumentiert.", icon: ChartNoAxesCombined },
];
