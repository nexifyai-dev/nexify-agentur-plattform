export type Service = {
  slug: string;
  icon: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  promise: string;
  days: string;
  minDays: number;
  maxDays?: number;
  from?: boolean;
  features: string[];
  deliverables: string[];
  idealFor: string[];
};

export type Dict = typeof de;

export const de = {
  common: {
    cta: "Projekt starten",
    ctaSecondary: "Leistungen ansehen",
    learnMore: "Mehr erfahren",
    from: "ab",
    workdays: "Arbeitstage",
    workday: "Arbeitstag",
    netPerDay: "€ 999 netto / Arbeitstag",
    allServices: "Alle Leistungen",
  },
  home: {
    badge: "AI-gestützte Entwicklung · Deutsch & Nederlands · B2B",
    titleA: "Digitale Exzellenz.",
    titleB: "In Tagen statt Monaten.",
    subtitle:
      "NeXify AI entwickelt Premium-Websites, Onlineshops, Web-Apps und AI-Automatisierungen – persönlich verantwortet von einem Fachmann, beschleunigt durch modernste AI-Werkzeuge, transparent zum festen Tagessatz von 999 € netto.",
    ctaPrimary: "Kostenlose Erstberatung",
    ctaSecondary: "Leistungen entdecken",
    stats: [
      { value: "999 €", label: "netto pro Arbeitstag – keine versteckten Kosten" },
      { value: "1–3", label: "Tage bis zur fertigen Website" },
      { value: "100 %", label: "persönliche Verantwortung, keine Übergabeketten" },
      { value: "24/7", label: "NeXify AI Berater für Ihr Anliegen" },
    ],
    pillarsEyebrow: "Warum NeXify AI",
    pillarsTitle: "Ein Fachmann. Moderne AI. Messbare Ergebnisse.",
    pillars: [
      {
        icon: "Code2",
        title: "Ein Fachmann, ein Ergebnis",
        text: "Keine Übergabekette zwischen Vertrieb, Design, Entwicklung und QA. Konzeption, Architektur, Umsetzung und Qualitätskontrolle liegen in einer Hand – persönlich und nachvollziehbar.",
      },
      {
        icon: "Bot",
        title: "AI-gestützt, nicht AI-abgegeben",
        text: "Modernste AI-Werkzeuge verkürzen Recherche, Umsetzung und Prüfung dramatisch. Die fachlichen Entscheidungen trifft weiterhin ein erfahrener Entwickler – mit voller Verantwortung.",
      },
      {
        icon: "ChartNoAxesCombined",
        title: "Transparenz pro Arbeitstag",
        text: "999 € netto pro Arbeitstag. Umfang, Annahmen und Mehrbedarf werden vor der Umsetzung sichtbar gemacht – Sie behalten jederzeit die volle Kostenkontrolle.",
      },
    ],
    servicesEyebrow: "Leistungen",
    servicesTitle: "Vom ersten Klick bis zur skalierten Plattform",
    servicesText: "Acht klar definierte Leistungsbausteine – jeder mit fester Zeitspanne, klaren Ergebnissen und transparentem Preis.",
    processEyebrow: "Arbeitsweise",
    processTitle: "Fünf Schritte. Null Überraschungen.",
    quotesEyebrow: "Stimmen & Ergebnisse",
    quotesTitle: "Was Zusammenarbeit mit NeXify AI bedeutet",
    ctaBandTitle: "Bereit für Ihr Projekt?",
    ctaBandText:
      "Beschreiben Sie Ihr Vorhaben – Sie erhalten innerhalb eines Werktags eine ehrliche Einschätzung mit Aufwandsspanne und Festpreisrahmen. Oder fragen Sie NeXify AI, unseren AI-Berater, direkt im Chat.",
    ctaBandBtn: "Jetzt Anfrage senden",
    ctaBandBtn2: "Mit NeXify AI chatten",
    marquee: ["Next.js", "React", "TypeScript", "Supabase", "AI-Agenten", "Automatisierung", "E-Commerce", "Web-Apps", "Mobile Apps", "SEO", "Cloud-Infrastruktur", "API-Integration"],
  },
  services: [
    {
      slug: "landingpages",
      icon: "LayoutTemplate",
      title: "Landingpages, die verständlich verkaufen",
      shortTitle: "Landingpage",
      eyebrow: "Klar. Schnell. Conversion-orientiert.",
      description:
        "Eine fokussierte Seite für ein Angebot, eine Kampagne oder einen Markteintritt – konzipiert, gestaltet, entwickelt und technisch sauber ausgeliefert. Vom ersten Wireframe bis zur Live-Schaltung entsteht eine Seite, die Besucher versteht, führt und konvertiert.",
      promise: "Eine verkaufsfähige Landingpage in einem Arbeitstag.",
      days: "1 Arbeitstag",
      minDays: 1,
      maxDays: 1,
      features: ["Premium UI/UX im Corporate Design", "Responsive auf allen Geräten", "Kontakt- oder Leadformular", "Technisches SEO & Metadaten", "Performance-Optimierung (Core Web Vitals)", "Rechtliche Pflichtverlinkungen"],
      deliverables: ["Strategische Seitenstruktur", "Individuelles Premium-Design", "Next.js-Umsetzung", "Formularintegration mit E-Mail-Anbindung", "QA auf Desktop und Mobil"],
      idealFor: ["Neue Angebote", "Kampagnen", "Leadgenerierung", "Produktvalidierung"],
    },
    {
      slug: "websites",
      icon: "Globe2",
      title: "Unternehmenswebsites mit Substanz",
      shortTitle: "Unternehmenswebsite",
      eyebrow: "Marke, Vertrauen und Nachfrage in einem System.",
      description:
        "Eine vollständige B2B-Unternehmenswebsite mit klarer Positionierung, Leistungsseiten, Kontaktführung, SEO-Grundlage und allen erforderlichen Standardseiten. Strategie, Inhalt und Technik werden gemeinsam gedacht – für eine Website, die Anfragen erzeugt statt nur zu existieren.",
      promise: "Eine vollständige Website in zwei bis drei Arbeitstagen.",
      days: "2–3 Arbeitstage",
      minDays: 2,
      maxDays: 3,
      features: ["Strategie und Informationsarchitektur", "Start- und Leistungsseiten", "Über-uns-/Expertenprofil", "Preis- und Prozessdarstellung", "Kontaktstrecke mit Formular", "Rechtliche Seiten (Impressum, Datenschutz, AGB)"],
      deliverables: ["Next.js App Router Architektur", "Individuelles Designsystem", "SEO-Metadaten und Sitemap", "Responsive QA", "Deployment-Vorbereitung"],
      idealFor: ["Agenturen", "Beratungen", "Handwerk und Mittelstand", "B2B-Dienstleister"],
    },
    {
      slug: "onlineshops",
      icon: "ShoppingCart",
      title: "Onlineshops, die mit dem Sortiment wachsen",
      shortTitle: "Onlineshop",
      eyebrow: "Schneller Einkauf. Saubere Daten. Klare Prozesse.",
      description:
        "Vom fokussierten Shop bis zum umfangreichen Handelssystem: Produktsuche, Kategorien, Checkout, Zahlungen, Warenwirtschaft und Automatisierungen werden passend zum Betrieb geplant. Nicht der Baukasten bestimmt den Shop – Ihr Geschäftsmodell tut es.",
      promise: "Standardshops in sechs bis acht Tagen, große Kataloge ab zwölf Tagen.",
      days: "6–8 Arbeitstage",
      minDays: 6,
      maxDays: 8,
      features: ["Produkt- und Kategoriestruktur", "Suche und Filter", "Checkout und Zahlungsanbieter", "Bestellkommunikation per E-Mail", "SEO und strukturierte Daten", "Schnittstellen und Produktimport"],
      deliverables: ["Shop-Frontend", "Administrationslogik", "Produktimport", "Checkout-Tests", "Betriebs- und Übergabedokumentation"],
      idealFor: ["D2C und B2B-Commerce", "Nischenhandel", "Hersteller", "Sortimente bis etwa 50.000 Artikel"],
    },
    {
      slug: "enterprise-commerce",
      icon: "Boxes",
      title: "Commerce-Plattformen ab 50.000 Artikeln",
      shortTitle: "Enterprise-Commerce",
      eyebrow: "Kataloge, Suche, Integrationen und Betrieb für große Datenmengen.",
      description:
        "Für große Sortimente werden Datenmodell, Suchindex, Importpipeline, Caching, Produktvarianten, ERP/PIM-Anbindung und Betriebsmonitoring von Beginn an skalierbar angelegt. Performance und Datenqualität sind hier keine Nachrüstung, sondern Architekturprinzip.",
      promise: "Große Shops starten ab zwölf Arbeitstagen – der Umfang folgt der realen Systemkomplexität.",
      days: "ab 12 Arbeitstagen",
      minDays: 12,
      from: true,
      features: ["50.000+ Artikel performant", "Performante Suche und Facetten", "PIM-/ERP-/Feed-Integration", "Batch- und Delta-Importe", "Cache- und Indexstrategie", "Monitoring und Recovery"],
      deliverables: ["Technischer Blueprint", "Import- und Sucharchitektur", "Skalierbarer Shop", "Last- und Datenqualitätstests", "Betriebshandbuch"],
      idealFor: ["Großhandel", "Ersatzteilhandel", "Mehrmarkenshops", "Katalogbasierte Plattformen"],
    },
    {
      slug: "web-apps",
      icon: "AppWindow",
      title: "Web-Apps für echte Betriebsabläufe",
      shortTitle: "Web-App",
      eyebrow: "Portale, Dashboards und Prozesssoftware.",
      description:
        "Individuelle Web-Anwendungen für Kundenportale, interne Abläufe, Buchung, Disposition, Dokumente, Workflows oder branchenspezifische Prozesse. Software, die sich Ihrem Betrieb anpasst – nicht umgekehrt.",
      promise: "Kompakte MVPs in sechs bis acht Tagen, komplexe Systeme ab zwölf Tagen.",
      days: "6–8 Arbeitstage",
      minDays: 6,
      maxDays: 8,
      features: ["Login und Rollenkonzept", "Dashboards und Auswertungen", "Datenmodelle und APIs", "Workflows und Benachrichtigungen", "Datei- und Dokumentenverwaltung", "Auditierbare Zustände"],
      deliverables: ["Produktkonzept", "Responsive Web-App", "Backend/API", "Tests", "Deployment- und Betriebsübergabe"],
      idealFor: ["Kundenportale", "SaaS-MVPs", "Interne Werkzeuge", "Buchungs- und Serviceplattformen"],
    },
    {
      slug: "mobile-apps",
      icon: "Smartphone",
      title: "Mobile Apps mit gemeinsamem Produktkern",
      shortTitle: "Mobile App",
      eyebrow: "Cross-Platform, wartbar und auf den Anwendungsfall reduziert.",
      description:
        "Mobile Anwendungen werden als fokussierte Produkte entwickelt – mit gemeinsamem Designsystem für iOS und Android, sauberer API-Anbindung und klarer Veröffentlichungsstrategie in den Stores.",
      promise: "Kompakte Cross-Platform-MVPs in sechs bis acht Tagen, umfangreiche Apps ab zwölf Tagen.",
      days: "6–8 Arbeitstage",
      minDays: 6,
      maxDays: 8,
      features: ["iOS und Android aus einer Codebasis", "Cross-Platform-Architektur", "Authentifizierung", "Push und Benachrichtigungen", "Offline-/Sync-Konzept", "Store-Vorbereitung"],
      deliverables: ["Produktflow", "App-Oberfläche", "API-Integration", "Gerätetests", "Release-Checkliste"],
      idealFor: ["Service-Apps", "Außendienst", "Kundenbindung", "Mobile Prozessunterstützung"],
    },
    {
      slug: "automatisierung",
      icon: "Workflow",
      title: "AI-gestützte Automatisierung mit Kontrolle",
      shortTitle: "Automatisierung",
      eyebrow: "Weniger Routine. Mehr nachvollziehbarer Betrieb.",
      description:
        "Wiederkehrende Aufgaben werden analysiert, standardisiert und mit passenden Workflows, Integrationen und AI-gestützten Arbeitsschritten automatisiert. Jeder automatisierte Prozess bleibt messbar, dokumentiert und kontrollierbar.",
      promise: "Nicht möglichst viel automatisieren – sondern das Richtige, messbar und kontrolliert.",
      days: "ab 1 Arbeitstag",
      minDays: 1,
      from: true,
      features: ["Prozessanalyse", "E-Mail- und Dokumentenflows", "CRM-/ERP-Integrationen", "Freigaben und Policy-Gates", "Monitoring", "Fehler- und Recovery-Pfade"],
      deliverables: ["Prozesskarte", "Automatisierter Workflow", "Testfälle", "Monitoring", "Betriebsdokumentation"],
      idealFor: ["Vertrieb", "Support", "Backoffice", "Projekt- und Datenprozesse"],
    },
    {
      slug: "ai-agenten",
      icon: "Bot",
      title: "AI-Agenten für klar begrenzte Aufgaben",
      shortTitle: "AI-Agenten",
      eyebrow: "Werkzeuge, Regeln und Nachweise statt unkontrollierter Chatbots.",
      description:
        "Agentische Lösungen erhalten eindeutige Rollen, Datenzugriffe, Freigaben, Tests und Protokolle. So entstehen belastbare Assistenten und Operatoren statt Demo-Chats – wie NeXify AI, der KI-Berater auf dieser Website.",
      promise: "AI unterstützt die Arbeit – fachliche Verantwortung, Grenzen und Kontrolle bleiben sichtbar.",
      days: "ab 3 Arbeitstagen",
      minDays: 3,
      from: true,
      features: ["Rollen und Berechtigungen", "Wissenszugriff (RAG)", "Tool- und API-Anbindung", "Freigabestufen", "Evaluation", "Evidence und Monitoring"],
      deliverables: ["Agentenprofil", "Tool- und Wissensanbindung", "Sicherheitsregeln", "Testsuite", "Betriebskonzept"],
      idealFor: ["Wissensarbeit", "Support", "Recherche", "Interne Operations"],
    },
  ] as Service[],
  servicesPage: {
    eyebrow: "Leistungen",
    title: "Acht Bausteine. Ein Anspruch: Exzellenz.",
    intro:
      "Jede Leistung hat eine klare Zeitspanne, definierte Ergebnisse und einen transparenten Preis von 999 € netto pro Arbeitstag. Was Sie hier lesen, bekommen Sie – ohne Kleingedrucktes, ohne Agentur-Overhead.",
    featuresLabel: "Leistungsumfang",
    deliverablesLabel: "Sie erhalten",
    idealLabel: "Ideal für",
  },
  pricing: {
    eyebrow: "Preise",
    title: "Ein Satz. Volle Transparenz.",
    intro:
      "999 € netto pro Arbeitstag – dieser Satz gilt für jede Leistung, jedes Projekt, jeden Tag. Ein Arbeitstag umfasst bis zu acht planbare Fachstunden für Konzeption, Design, Entwicklung, Tests und Dokumentation.",
    dayRateTitle: "Der Tagessatz",
    dayRateText:
      "Vor Projektbeginn erhalten Sie eine belastbare Aufwandsspanne in Arbeitstagen. Ein verbindlicher Gesamtfestpreis ist möglich, sobald Umfang, Inhalte, Integrationen und Abnahmekriterien eindeutig feststehen. Mehrbedarf wird immer vor Ausführung angezeigt – nie danach.",
    includedTitle: "Im Arbeitstag enthalten",
    included: [
      "Konzeption und Informationsarchitektur",
      "Individuelles Design im Designsystem",
      "Entwicklung (Frontend, Backend, APIs)",
      "Integrationen und Datenanbindung",
      "Tests, QA und Mobile-Prüfung",
      "Dokumentation und Übergabe",
    ],
    notIncludedTitle: "Nicht enthalten (sofern nicht vereinbart)",
    notIncluded: ["Hosting- und Domainkosten", "Lizenzen und externe API-Kosten", "Zahlungsanbieter-Gebühren", "Stockmaterial und Content-Erstellung", "Laufende Wartungsverträge (separat buchbar)"],
    calcTitle: "Projektkosten-Rechner",
    calcText: "Wählen Sie eine Leistung und den erwarteten Umfang – Sie sehen sofort die realistische Investition.",
    calcService: "Leistung",
    calcDays: "Arbeitstage",
    calcNet: "Netto-Investition",
    calcVat: "zzgl. 21 % BTW",
    calcGross: "Brutto (inkl. BTW)",
    calcNote: "Bei grenzüberschreitenden B2B-Leistungen innerhalb der EU kann mit gültiger USt-ID das Reverse-Charge-Verfahren gelten – dann wird keine BTW berechnet.",
    vatNote: "Alle Preise netto zzgl. anwendbarer Umsatzsteuer. Ausschließlich B2B.",
  },
  process: {
    eyebrow: "Arbeitsweise",
    title: "Fünf Schritte von der Idee zum Betrieb",
    intro:
      "Ein standardisierter, hundertfach verfeinerter Ablauf sorgt dafür, dass Projekte in Tagen statt Monaten fertig werden – ohne Qualitätsverlust, ohne Überraschungen, mit voller Nachvollziehbarkeit in jedem Schritt.",
    steps: [
      { n: "01", icon: "ChartNoAxesCombined", title: "Ziel und Geschäftsnutzen", text: "Wir klären, welches Ergebnis zählt, wer es nutzt und was bewusst nicht Teil des ersten Umfangs ist. Fokus schlägt Feature-Liste." },
      { n: "02", icon: "MessageSquareMore", title: "Konzept und Festpreisrahmen", text: "Der Aufwand wird in Arbeitstagen ausgewiesen. Sie sehen vorab Scope, Preisrahmen, Annahmen und mögliche Erweiterungen – schriftlich und verbindlich." },
      { n: "03", icon: "Code2", title: "AI-gestützte Umsetzung", text: "Moderne Entwicklungs- und Prüfwerkzeuge beschleunigen Analyse, Design, Code, Tests und Dokumentation – unter permanenter fachlicher Führung." },
      { n: "04", icon: "Settings2", title: "Tests und Abnahme", text: "Funktion, Darstellung, Mobilansicht, Formulare, Performance und zentrale Nutzerwege werden nachvollziehbar geprüft und dokumentiert." },
      { n: "05", icon: "Rocket", title: "Übergabe und Weiterentwicklung", text: "Sie erhalten Code, Dokumentation, klare Betriebsinformationen und eine priorisierte Liste sinnvoller nächster Schritte." },
    ],
    promiseTitle: "Was Sie sich darauf verlassen können",
    promises: [
      { title: "Antwort in 24h", text: "Jede Anfrage erhält innerhalb eines Werktags eine persönliche, qualifizierte Antwort." },
      { title: "Schriftliche Scope-Klarheit", text: "Kein Projekt startet ohne dokumentierten Umfang, Annahmen und Preisrahmen." },
      { title: "Tägliche Sichtbarkeit", text: "Bei mehrtägigen Projekten sehen Sie den Fortschritt – nicht erst am Ende." },
      { title: "Saubere Übergabe", text: "Code, Zugänge, Dokumentation und Betriebshinweise gehören Ihnen. Kein Vendor-Lock-in." },
    ],
  },
  platform: {
    eyebrow: "Plattform & Technologie",
    title: "Der Technik-Stack hinter der Geschwindigkeit",
    intro:
      "Geschwindigkeit ohne Qualitätsverlust entsteht durch einen bewusst kuratierten, hundertfach erprobten Technologie-Stack – kombiniert mit AI-gestützten Entwicklungs- und Prüfwerkzeugen der neuesten Generation.",
    blocks: [
      {
        icon: "Layers",
        title: "Frontend & Design",
        text: "Moderne, wartbare Oberflächen mit erstklassiger Performance und Barrierefreiheit.",
        points: ["Next.js App Router & React", "TypeScript durchgängig", "Individuelle Designsysteme", "Core Web Vitals optimiert", "Responsive & barrierearm"],
      },
      {
        icon: "Database",
        title: "Backend & Daten",
        text: "Skalierbare APIs und Datenmodelle, die mit Ihrem Geschäft wachsen.",
        points: ["Supabase / PostgreSQL", "REST- & Streaming-APIs", "Authentifizierung & Rollen", "Datenimport-Pipelines", "Backups & Monitoring"],
      },
      {
        icon: "Bot",
        title: "AI & Agenten",
        text: "Produktionsreife AI-Integrationen mit Kontrolle, Protokollen und Freigaben.",
        points: ["GPT, Claude & Gemini Integration", "RAG-Wissensanbindung", "AI-Berater wie NeXify AI", "Angebots- & E-Mail-Automatisierung", "Evaluation & Guardrails"],
      },
      {
        icon: "ShieldCheck",
        title: "Betrieb & Sicherheit",
        text: "Zuverlässiger Betrieb mit klaren Verantwortlichkeiten und DSGVO-Konformität.",
        points: ["Vercel & Self-Hosting (Docker/Traefik)", "Cloudflare CDN & Schutz", "SSL, Security-Header, Hardening", "DSGVO-konforme Datenflüsse", "Transaktionale E-Mails (Resend)"],
      },
    ],
    novaTitle: "NeXify AI – Ihr AI-Berater auf dieser Website",
    novaText:
      "Was Sie rechts unten im Chat erleben, ist ein Beispiel unserer AI-Agenten-Leistung: NeXify AI berät Besucher in zwei Sprachen, qualifiziert Anfragen, erstellt strukturierte Angebote und versendet sie automatisch per E-Mail – inklusive Nachfassen. Dieselbe Technologie bauen wir für Ihr Unternehmen.",
    novaBtn: "NeXify AI jetzt testen",
  },
  references: {
    eyebrow: "Referenzen & Ergebnisse",
    title: "Ergebnisse, die für sich sprechen",
    intro:
      "Ausgewählte, anonymisierte Projektergebnisse aus den Bereichen Web, Commerce und Automatisierung. Auf Anfrage stellen wir gern passende Referenzkontakte her.",
    cases: [
      {
        tag: "B2B-Website",
        title: "Beratungsunternehmen, DACH",
        text: "Vollständige Unternehmenswebsite mit Leistungsarchitektur, SEO-Grundlage und Kontaktstrecke – konzipiert und live in drei Arbeitstagen.",
        results: ["3 Arbeitstage bis Go-Live", "+68 % organische Anfragen in 90 Tagen", "Ladezeit unter 1 Sekunde"],
      },
      {
        tag: "E-Commerce",
        title: "Ersatzteilhandel, Niederlande",
        text: "Commerce-Plattform mit 60.000+ Artikeln, facettierter Suche, ERP-Anbindung und automatisierten Delta-Importen.",
        results: ["60.000+ Artikel performant", "Suchantworten unter 150 ms", "Importlauf vollautomatisch, täglich"],
      },
      {
        tag: "AI-Automatisierung",
        title: "Mittelständischer Dienstleister",
        text: "Automatisierte Angebots- und E-Mail-Strecke mit AI-Vorqualifizierung eingehender Anfragen und CRM-Integration.",
        results: ["–70 % manuelle Bearbeitungszeit", "Antwortzeit von 2 Tagen auf 2 Stunden", "Vollständig protokollierter Workflow"],
      },
    ],
    quotes: [
      {
        quote: "Innerhalb von drei Tagen stand eine Website, für die uns Agenturen drei Monate angeboten hatten – in besserer Qualität und zu einem Bruchteil des Preises.",
        author: "Geschäftsführer, Beratungsunternehmen (DACH)",
      },
      {
        quote: "Die Kombination aus persönlicher Verantwortung und AI-Geschwindigkeit ist beeindruckend. Jede Zusage wurde gehalten, jeder Aufwand vorher transparent gemacht.",
        author: "Inhaber, Handelsunternehmen (NL)",
      },
      {
        quote: "Endlich jemand, der Automatisierung nicht als Buzzword verkauft, sondern als kontrollierten, messbaren Prozess umsetzt.",
        author: "Operations-Leitung, Dienstleister (DE)",
      },
    ],
  },
  wissen: {
    eyebrow: "Wissen",
    title: "Einblicke in AI-gestützte Entwicklung",
    intro: "Praxisnahes Wissen zu Websites, Commerce, Automatisierung und AI-Agenten – ohne Marketing-Nebel, dafür mit klaren Empfehlungen.",
    readMore: "Weiterlesen",
    readLess: "Einklappen",
    articles: [
      {
        tag: "Strategie",
        readTime: "4 Min.",
        title: "Warum eine Website in 3 Tagen besser sein kann als eine in 3 Monaten",
        excerpt: "Lange Projektlaufzeiten entstehen selten durch Qualität – meist durch Übergaben, Abstimmungsschleifen und Leerlauf.",
        body: [
          "Der klassische Agenturprozess kennt viele Stationen: Vertrieb, Strategie, Design, Entwicklung, QA, Projektmanagement. Jede Übergabe kostet Zeit, Informationen und Geld. Das Ergebnis wird dadurch nicht besser – nur teurer und später.",
          "AI-gestützte Entwicklung dreht das Modell um: Ein erfahrener Fachmann steuert den gesamten Prozess und nutzt AI-Werkzeuge für Recherche, Code, Tests und Dokumentation. Die Durchlaufzeit sinkt von Monaten auf Tage, während die Qualitätskontrolle in einer Hand bleibt.",
          "Entscheidend ist die Standardisierung: erprobte Architekturen, wiederverwendbare Designsysteme und automatisierte Prüfungen. Wer jeden Schritt zum hundertsten Mal geht, geht ihn schneller und sicherer.",
        ],
      },
      {
        tag: "E-Commerce",
        readTime: "5 Min.",
        title: "50.000 Artikel sind kein Frontend-Problem – sondern ein Datenproblem",
        excerpt: "Große Kataloge scheitern selten an der Optik. Sie scheitern an Importen, Suche und Datenqualität.",
        body: [
          "Wer einen Shop mit großen Sortimenten plant, sollte zuerst über Datenflüsse sprechen: Woher kommen Artikelstammdaten? Wie oft ändern sich Preise und Bestände? Welche Systeme (ERP, PIM, Lieferantenfeeds) müssen angebunden werden?",
          "Die Antwort bestimmt die Architektur: Batch- und Delta-Importe, ein performanter Suchindex mit Facetten, konsequentes Caching und ein Monitoring, das Datenfehler erkennt, bevor Kunden sie sehen.",
          "Ein Shop, der diese Grundlagen von Beginn an mitdenkt, skaliert entspannt von 5.000 auf 100.000 Artikel. Einer, der sie nachrüsten muss, wird zum Dauerprojekt.",
        ],
      },
      {
        tag: "AI-Agenten",
        readTime: "6 Min.",
        title: "Vom Chatbot zum Vertriebsagenten: Was NeXify AI anders macht",
        excerpt: "Die meisten Website-Chatbots beantworten FAQs. Ein echter AI-Agent qualifiziert, berät und erstellt Angebote.",
        body: [
          "Ein klassischer Chatbot ist eine Suchmaske mit Sprechblase. Ein AI-Agent dagegen hat eine Rolle, ein Ziel und Werkzeuge: Er kennt das Leistungsportfolio, rechnet Preise transparent vor, stellt Qualifizierungsfragen und erstellt am Ende ein strukturiertes Angebot.",
          "NeXify AI – der Berater auf dieser Website – zeigt das Prinzip live: Das Gespräch wird gespeichert, das Angebot als E-Mail versendet, und nach 24 Stunden folgt automatisch ein freundliches Nachfassen. Aus einem anonymen Besucher wird ein dokumentierter Lead.",
          "Wichtig sind die Leitplanken: keine erfundenen Zusagen, klare Preislogik, Protokollierung jeder Interaktion. AI im Vertrieb funktioniert nur mit Kontrolle – dann aber außerordentlich gut.",
        ],
      },
      {
        tag: "Automatisierung",
        readTime: "4 Min.",
        title: "Die richtige Reihenfolge der Automatisierung",
        excerpt: "Nicht alles, was automatisierbar ist, sollte automatisiert werden. Eine Priorisierungshilfe.",
        body: [
          "Der beste Startpunkt sind Prozesse, die häufig, regelbasiert und nervig sind: Angebotsdokumente, E-Mail-Routing, Datenübertragung zwischen Systemen, Berichtserstellung. Hier ist der Return sofort messbar.",
          "Danach folgen Prozesse mit AI-Unterstützung: Vorqualifizierung von Anfragen, Zusammenfassungen, Entwurfserstellung. Hier bleibt ein Mensch in der Freigabe – die AI beschleunigt, entscheidet aber nicht allein.",
          "Zuletzt kommen komplexe agentische Workflows. Wer die ersten beiden Stufen sauber gebaut hat, verfügt über die Datenqualität und die Prozessklarheit, die Stufe drei erst möglich machen.",
        ],
      },
      {
        tag: "Technologie",
        readTime: "5 Min.",
        title: "Next.js, Supabase & Co.: Warum dieser Stack",
        excerpt: "Technologieentscheidungen sind Betriebskostenentscheidungen. Eine Begründung des NeXify-Stacks.",
        body: [
          "Next.js liefert Server-Rendering, exzellentes SEO und ein Ökosystem, das von Startups bis Konzernen getragen wird. React und TypeScript sichern Wartbarkeit und Entwicklerverfügbarkeit auf Jahre.",
          "Supabase kombiniert PostgreSQL – die zuverlässigste Open-Source-Datenbank – mit Authentifizierung, Storage und Realtime-Funktionen. Das reduziert Integrationsaufwand drastisch, ohne in proprietäre Abhängigkeit zu führen.",
          "Der Grundsatz: Technologie folgt dem Betrieb. Jede Komponente muss austauschbar bleiben, Daten müssen exportierbar sein, und der Kunde erhält immer den vollständigen Code.",
        ],
      },
      {
        tag: "Recht & Compliance",
        readTime: "5 Min.",
        title: "DSGVO-konforme AI-Integration: Die Checkliste",
        excerpt: "AI-Funktionen und Datenschutz schließen sich nicht aus – wenn die Grundlagen stimmen.",
        body: [
          "Erstens: Datenminimierung. An AI-Dienste wird nur übertragen, was für den Zweck erforderlich ist. Personenbezogene Daten werden, wo möglich, pseudonymisiert oder ganz vermieden.",
          "Zweitens: Transparenz. Nutzer erfahren, wann sie mit einem AI-System interagieren, was gespeichert wird und wofür. Diese Website macht das mit dem KI-Hinweis und der Datenschutzerklärung vor.",
          "Drittens: Auftragsverarbeitung und Speicherorte. Verarbeiter werden vertraglich gebunden (AVV), Übermittlungen in Drittländer geprüft, Löschfristen definiert. Wer das dokumentiert, integriert AI rechtssicher.",
        ],
      },
    ],
  },
  faqPage: {
    eyebrow: "FAQ",
    title: "Häufige Fragen, ehrliche Antworten",
    intro: "Alles Wichtige zu Arbeitsweise, Preisen, AI-Einsatz und Zusammenarbeit – kompakt beantwortet. Ihre Frage fehlt? der NeXify AI Chat oder das Kontaktformular helfen sofort.",
  },
  faqs: [
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
      a: "Je nach Ziel unter anderem Next.js, React, TypeScript, Supabase/PostgreSQL, moderne APIs, Vercel oder geeignete Self-Hosting-Infrastruktur. Technologie folgt dem Betrieb – nicht umgekehrt.",
    },
    {
      q: "Was kann der NeXify AI Berater?",
      a: "NeXify AI ist der AI-Vertriebsagent dieser Website. Er berät auf Deutsch und Niederländisch, qualifiziert Anfragen, erstellt strukturierte unverbindliche Angebote und sendet sie per E-Mail – inklusive automatischem Nachfassen. Dieselbe Technologie bauen wir auch für Ihr Unternehmen.",
    },
    {
      q: "Wie läuft die Zusammenarbeit nach dem Go-Live weiter?",
      a: "Sie erhalten Code, Dokumentation und Betriebshinweise vollständig übergeben. Auf Wunsch übernehmen wir Weiterentwicklung, Wartung und Monitoring zum selben transparenten Tagessatz – ohne Bindung, ohne Mindestlaufzeit.",
    },
  ],
  about: {
    eyebrow: "Über mich",
    title: "Pascal Courbois – Fachmann hinter NeXify AI",
    intro: "Deutscher aus der Grenzregion Limburg, seit über fünf Jahren in den Niederlanden zu Hause – mit mehr als 20 Jahren Berufs- und Praxiserfahrung in IT, Kaufmannswesen und Vertrieb. Ein Ansprechpartner für Strategie, Design, Entwicklung und Betrieb.",
    paragraphs: [
      "Ich bin Pascal Courbois – Deutscher aus der Grenzregion Limburg, mit einer Niederländerin verheiratet und seit gut fünf Jahren in den Niederlanden zu Hause. Ich lebe und arbeite täglich in beiden Kulturen und Sprachen. Für Sie bedeutet das: Beratung, Angebote und Kommunikation auf Deutsch oder Niederländisch – ohne Übersetzungsverluste und mit echtem Verständnis für beide Märkte.",
      "In mehr als 20 Jahren Berufs- und Praxiserfahrung habe ich beide Seiten der Digitalisierung kennengelernt: die technische in IT und Programmierung – und die unternehmerische im kaufmännischen Bereich. Dazu kommt jahrelange Vertriebserfahrung, unter anderem bei der Telekom Deutschland, Vodafone und Postcon Deutschland. Ich weiß daher nicht nur, wie Software gebaut wird, sondern auch, wie Kunden denken, wie Abläufe in Unternehmen wirklich funktionieren und woran Projekte in der Praxis scheitern – und genau dieses Verständnis fließt in jedes Projekt ein.",
      "NeXify AI ist die Antwort auf eine einfache Beobachtung: Die meisten Digitalprojekte sind zu teuer, dauern zu lange und verlieren zwischen den Abteilungen einer Agentur an Qualität. Als erfahrener Entwickler und Berater führe ich Konzeption, Architektur, Umsetzung und Qualitätskontrolle in einer Hand zusammen.",
      "Modernste AI-Werkzeuge – dieselben, die auch hinter NeXify AI stehen – beschleunigen Recherche, Code, Tests und Dokumentation um ein Vielfaches. So entstehen in Tagen Ergebnisse, für die klassische Prozesse Monate brauchen. Die fachliche Verantwortung bleibt dabei immer bei mir persönlich.",
      "Ich arbeite von Venlo aus für Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden – auf Deutsch und Niederländisch, ausschließlich B2B, immer mit transparentem Tagessatz und schriftlicher Scope-Klarheit vor Projektbeginn.",
    ],
    facts: [
      { label: "Herkunft", value: "Deutscher · Grenzregion Limburg" },
      { label: "Standort", value: "Venlo, Niederlande (seit 5+ Jahren)" },
      { label: "Erfahrung", value: "20+ Jahre IT, Handel & Vertrieb" },
      { label: "Sprachen", value: "Deutsch, Nederlands, Englisch" },
      { label: "Markt", value: "DE · AT · CH · NL" },
      { label: "Modell", value: "B2B, 999 € netto/Tag" },
    ],
    journeyTitle: "Erfahrung, die Sie spüren",
    journeyIntro: "Mehr als 20 Jahre Praxis – technisch, kaufmännisch und im Vertrieb. Diese Kombination ist selten und macht den Unterschied zwischen einer Website und einem Werkzeug, das verkauft.",
    journey: [
      { title: "IT & Entwicklung", text: "Über zwei Jahrzehnte Praxis in IT und Programmierung – von soliden Systemen bis zu modernen AI-Architekturen. Technik ist bei mir kein Blackbox-Versprechen, sondern Handwerk mit Verantwortung." },
      { title: "Kaufmännische Praxis", text: "Kalkulation, Prozesse, Verantwortung: Ich habe selbst kaufmännisch gearbeitet und weiß, wie Entscheidungen in Unternehmen fallen – und was eine Investition wirklich rechtfertigen muss." },
      { title: "Vertrieb auf Konzernniveau", text: "Jahrelange Vertriebserfahrung u. a. bei Telekom Deutschland, Vodafone und Postcon Deutschland. Ich verstehe Zielgruppen, Kundenbedürfnisse und wie aus Interesse messbarer Umsatz wird." },
      { title: "Zwei Länder, eine Region", text: "Als Deutscher in den Niederlanden, mit einer Niederländerin verheiratet, verbinde ich beide Geschäftskulturen – ideal für Unternehmen im deutsch-niederländischen Wirtschaftsraum." },
    ],
    principlesTitle: "Meine Arbeitsprinzipien",
    principles: [
      { title: "Ehrlichkeit vor Umsatz", text: "Wenn ein Projekt nicht sinnvoll ist, sage ich es – inklusive günstigerer Alternativen." },
      { title: "Ergebnis vor Aufwand", text: "Abgerechnet wird, was Ergebnisse bringt. Leerlauf und Meetings-Marathons sind nicht Ihr Problem." },
      { title: "Eigentum beim Kunden", text: "Code, Daten, Zugänge und Dokumentation gehören Ihnen. Vollständig, ab Tag eins." },
      { title: "Kontrollierte AI", text: "AI beschleunigt meine Arbeit, ersetzt aber nie Prüfung, Verantwortung und Freigabe durch den Fachmann." },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Erzählen Sie mir von Ihrem Projekt",
    intro: "Sie erhalten innerhalb eines Werktags eine persönliche, qualifizierte Antwort mit ehrlicher Einschätzung und Aufwandsspanne. Alternativ berät Sie der NeXify AI Chat sofort – rund um die Uhr.",
    name: "Ihr Name *",
    email: "E-Mail-Adresse *",
    companyField: "Unternehmen",
    phone: "Telefon (optional)",
    message: "Ihr Vorhaben *",
    messagePlaceholder: "Was möchten Sie umsetzen? Website, Shop, App, Automatisierung … Je konkreter, desto präziser die Einschätzung.",
    submit: "Anfrage senden",
    sending: "Wird gesendet …",
    success: "Vielen Dank! Ihre Anfrage ist eingegangen – Sie erhalten in Kürze eine Bestätigung per E-Mail und innerhalb eines Werktags eine persönliche Antwort.",
    error: "Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie direkt an",
    directTitle: "Direkter Draht",
    responseTitle: "Reaktionszeit",
    responseText: "Innerhalb eines Werktags – meist deutlich schneller.",
    b2bNote: "Ausschließlich B2B: Angebote richten sich an Unternehmen, Selbstständige und Organisationen.",
  },
};
