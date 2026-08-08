// FILE: /apps/website/lib/gtm/branchen.ts
// NIR: 02.08.2026 10:50
// UPDATED: 08.08.2026 12:20
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: ICP branchen landing content for SEO — 10 Branchen (5 vertieft + 5 neu, M-08)
// WHY: Frewert-Muster: Branchenpages mit spezifischen Pain-Points + FAQPage-Schema;
//      Senorit/AUTIMA pattern — branchen pages convert SMB intent without paid ads
// BEST-PRACTICE: Pain→outcome→CTA; FAQPage-Vertrag (q/a); keine Fake-Case-Metriken; B2B only
// PITFALL: V-GTM-BR-01: Do not invent industry ROI percentages; V-GTM-BR-02: keine
//          Fake-Fallstudien; kein Rechts-/Medizinrat (nur Marketing/Web/Automation-Leistungen)
// DEPENDS: company, productized-offers, /leistungen/{websites,automatisierung,ai-agenten},
//          /wissen-Artikel (M-05) als Verlinkungsziele
// DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md, FREWERT-MARKETING-MASSNAHMENKATALOG M-08
// SESSION: t_0151f14a M-08

export type BrancheFaq = { q: string; a: string };

export type BrancheApp = { name: string; href: string; text: string };

export type Branche = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  pains: string[];
  /** Frewert-Muster „Es ist nicht deine Schuld, dass …" — empathisch, ohne Schuldzuweisung */
  notYourFault: string[];
  /** 1 konkrete Anwendung je Branche (echter Leistungsbezug, keine Fake-Case-Studie) */
  useCase: { title: string; text: string };
  /** Anwendungsfälle: Chatbot, Automatisierung, Website — je mit Ziel-Leistung */
  apps: BrancheApp[];
  outcomes: string[];
  offerHint: string;
  faqs: BrancheFaq[];
  /** Optionaler M-05-Wissen-Artikel als Verlinkungsziel */
  wissen?: { slug: string; title: string };
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
    notYourFault: [
      "dass Anfragen im Postfach verschwinden, statt als Auftrag zu enden",
      "dass Angebot und Nachfass am Abend von der Bildschirmzeit abhängen",
      "dass die Website nie das bekommt, was der Betrieb wirklich braucht",
    ],
    useCase: {
      title: "Auftragsannahme ohne Leerlauf",
      text: "Konkret: Eine schlanke Handwerker-Landing mit Anfrageformular (Gewerk, PLZ, Zeitfenster), Qualifizierungs-Fragen und automatischem Nachfass — jede Anfrage bekommt eine Antwort, ob Auftrag oder Absage, ohne dass Sie abends E-Mails sortieren.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Landing oder Website mit klarem Anfrage-Pfad und Vertrauenssignalen",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Anfrage-Triage, Angebots-Vorlagen und Nachfass-Erinnerungen",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "Chatbot für Einstiegsfragen und Terminvorqualifizierung",
      },
    ],
    outcomes: [
      "Klarer Aufnahme-Pfad: Anfrage → Qualifizierung → Termin/Angebot",
      "Website oder Landing, die Vertrauen und nächste Schritte zeigt",
      "Optional: Pilot eines Automatisierungs-Slices nach Audit",
    ],
    offerHint: "Start: kostenlose Sprechstunde oder 1-Tages-Audit (449 €).",
    faqs: [
      {
        q: "Was kostet eine Handwerker-Website bei NeXify AI?",
        a: "Ein fokussierter Startumfang (Landing mit Anfrageformular, technisches SEO, rechtliche Pflichtverlinkungen) kostet einen Arbeitstag × 449 € netto. Mehrsprachen oder Spezialintegrationen erweitern den Scope transparent vor Ausführung.",
      },
      {
        q: "Kann ein Chatbot Anfragen für mein Handwerksunternehmen vorqualifizieren?",
        a: "Ja — ein AI-Agent kann Gewerk, Ort und Zeitfenster abfragen und qualifizierte Anfragen strukturiert weiterreichen. Er ersetzt keine menschliche Beratung, sondern sortiert vor, damit Sie nur noch relevante Anfragen beantworten.",
      },
      {
        q: "Was gehört in einen Automatisierungs-Slice für Handwerksbetriebe?",
        a: "Typischer Start: Anfrage-Erfassung mit Qualifizierungsfragen, Angebotsvorlagen, automatische Eingangs- und Nachfass-Bestätigung. Der Umfang wird vor Ausführung fixiert — keine Tool-Friedhöfe.",
      },
    ],
    wissen: {
      slug: "whatsapp-marketing-handwerk",
      title: "WhatsApp-Marketing für Handwerker — so läuft es",
    },
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
    notYourFault: [
      "dass Mandanten-Unterlagen lückenhaft ankommen und Nachfassen Zeit frisst",
      "dass die Website nicht erklärt, warum Mandanten Ihnen vertrauen können",
      "dass Digitalisierung an zu vielen Tools scheitert, statt an einem klaren Plan",
    ],
    useCase: {
      title: "Digitales Mandanten-Onboarding",
      text: "Konkret: Ein Onboarding-Pfad mit Checkliste und Statusübersicht — Mandant lädt Belege strukturiert hoch, Sie sehen den Stand auf einen Blick, wiederkehrende Kommunikation läuft aus Vorlagen mit persönlicher Freigabe. DSGVO-Bewusstsein ist Teil des Builds, nicht nachträgliches Add-on.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Kanzlei-Website, die Leistungen und Vertrauen klar erklärt",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Beleg-Checklisten, Nachfass-Erinnerungen, Status-Mails",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "FAQ-Chatbot für Erstkontakt-Fragen (DSGVO-konform aufgesetzt)",
      },
    ],
    outcomes: [
      "Saubere digitale Einstiege (Formulare, Checklisten, Status)",
      "Automation nur wo Regeln und Freigaben klar sind",
      "Partner-fähig: White-Label für Ihre Mandanten-Empfehlungen",
    ],
    offerHint: "Audit-Tag → Pilot-Slice; Partner-Intro möglich.",
    faqs: [
      {
        q: "Ist KI-Automatisierung in einer Steuerkanzlei erlaubt?",
        a: "Ja, wenn Rechtsgrundlagen und Berufsrecht beachtet werden: DSGVO-konforme Verarbeitung, klare Verantwortlichkeit, menschliche Freigabe vor versandfertigen Ergebnissen. Wir bauen keine Rechtsberatung oder Steuerprüfung — wir automatisieren organisatorische Abläufe mit dokumentierter Verantwortung.",
      },
      {
        q: "Was kostet eine Kanzlei-Website mit Onboarding-Pfad?",
        a: "Ein Startumfang (Website mit Leistungsseiten, Kontaktformular, Onboarding-Checkliste) liegt im Bereich weniger Arbeitstage × 449 € netto — der Umfang wird vor Ausführung als fester Scope fixiert.",
      },
      {
        q: "Arbeitet ihr auch als White-Label-Partner für Steuerkanzleien?",
        a: "Ja — White-Label-Umsetzung mit Repo-Disziplin ist ein Standardweg: Sie bleiben die Ansprechperson für Mandanten, wir liefern Web und Automation zum Tagessatz.",
      },
    ],
    wissen: {
      slug: "ki-steuerbuero",
      title: "KI im Steuerbüro — was wirklich hilft",
    },
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
    notYourFault: [
      "dass Support-Tickets mit jedem Wachstumsschub teurer werden",
      "dass der Checkout mehr Besucher verliert als der Preis",
      "dass Integrationen nach Jahren niemand mehr nachvollziehen kann",
    ],
    useCase: {
      title: "Support-Entlastung im Nachkauf",
      text: "Konkret: Ein AI-Agent beantwortet wiederkehrende Fragen (Status, Versand, Retoure) auf der Website und im Kundenkonto; ein Automatisierungs-Slice übernimmt Statusmails und Retouren-Vorqualifizierung. Der Shop selbst bleibt Ihr System — wir ergänzen, nicht ersetzen.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Shop-Slices und Landingpages mit klarem Kauf-/Anfragepfad",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Statusmails, Retouren-Triage, Nachkauf-Kommunikation",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "Support-Chatbot mit Anbindung an Bestellstatus",
      },
    ],
    outcomes: [
      "Priorisierter Pilot: ein messbarer Prozess oder Shop-Slice",
      "Transparente Tageskalkulation statt Stundenpoker",
      "Übergabe mit nachvollziehbarem Repo",
    ],
    offerHint: "Pilot-Paket 5 Tage (2.245 € netto) nach kurzem Fit-Call.",
    faqs: [
      {
        q: "Kann ein KI-Chatbot meinen Shop-Support wirklich entlasten?",
        a: "Für wiederkehrende Fragen (Status, Versand, Retoure) ja — vorausgesetzt die Antworten sind klar dokumentiert und ein Fallback zum Menschen existiert. Wir messen den Umfang vorher am Ticket-Bestand, statt Versprechen zu machen.",
      },
      {
        q: "Müsst ihr in unseren Shop eingreifen?",
        a: "Nicht zwingend. Wir ergänzen per API oder Schnittstelle — Chatbot, Statusmails, Nachkauf-Flows laufen neben dem Bestandssystem. Eingriffe in den Checkout selbst sind optionaler Scope.",
      },
      {
        q: "Was kostet der Einstieg für Onlineshops?",
        a: "Nach kurzem Fit-Call gibt es ein Pilot-Paket (5 Arbeitstage, 2.245 € netto) für einen klar umrissenen Prozess — oder den Audit-Tag (449 €) zum Priorisieren der größten Hebel.",
      },
    ],
    wissen: {
      slug: "ki-automatisierung-kmu-7-gewinne",
      title: "KI-Automatisierung im KMU: 7 Gewinne",
    },
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
    notYourFault: [
      "dass Portal-Anfragen erst am Abend beantwortet werden",
      "dass jedes Exposé dieselbe Zeit kostet wie ein Angebot",
      "dass CRM, Kalender und E-Mail nie dasselbe Bild zeigen",
    ],
    useCase: {
      title: "Exposé-Pipeline mit Terminbuchung",
      text: "Konkret: Anfrage → automatische Antwort mit Exposé und Qualifizierungsfragen (Objekttyp, Budget, Zeitrahmen) → Terminbuchung direkt im Kalender. Der Makler sieht nur noch qualifizierte Anfragen mit Termin — der Rest ist erledigt, ohne dass jemand tippt.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Objekt-Seiten und Landing mit Exposé-Anfrage und Terminbuchung",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Exposé-Versand, Qualifizierung, Termin-Bestätigung",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "Erstkontakt-Bot für Objektfragen rund um die Uhr",
      },
    ],
    outcomes: [
      "Schnellerer, nachvollziehbarer Lead-Pfad",
      "Landing/Website mit klarer CTA und Vertrauen",
      "Audit mit Top-Hebeln vor dem Build",
    ],
    offerHint: "Sprechstunde → Audit → Pilot.",
    faqs: [
      {
        q: "Wie schnell reagiert eine automatisierte Exposé-Zustellung?",
        a: "Sofort: Anfrage löst Antwort mit Exposé und Qualifizierungsfragen aus. Die persönliche Antwort durch Sie folgt — aber der Interessent hat in Sekunden eine erste Reaktion, was die Absprungrate massiv senkt.",
      },
      {
        q: "Ersetzt die Automation die persönliche Betreuung?",
        a: "Nein. Sie übernimmt das Wiederkehrende (Versand, Bestätigung, Terminlogik). Verkaufsgespräche, Besichtigung und Verhandlung bleiben bei Ihnen.",
      },
      {
        q: "Was kostet eine Immobilien-Website mit Anfrage-Pfad?",
        a: "Startumfang ab einem Arbeitstag (449 € netto) für eine fokussierte Landing; Objekt-Portale oder CRM-Anbindung werden als fester Scope vor Ausführung kalkuliert.",
      },
    ],
    wissen: {
      slug: "ai-agenten-einfuehrung",
      title: "AI-Agenten fürs Unternehmen — Einführung",
    },
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
    notYourFault: [
      "dass Projekte am Dev-Engpass statt am Vertrieb scheitern",
      "dass Kunden KI wollen und niemand im Team die Kapazität hat",
      "dass Übergaben bei externen Partnern zur Qualitätslotterie werden",
    ],
    useCase: {
      title: "White-Label-Overflow für eine Website/App",
      text: "Konkret: Sie verkaufen, wir liefern — Landingpage, Web-App oder Automation-Slice in Ihrem Design, mit Repo-Übergabe und klarer Tagessatz-Kalkulation. Ihr Kunde sieht nur Sie; die Qualität ist durch dokumentierte Standards abgesichert.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "White-Label-Umsetzung in Ihrem Design, Übergabe mit Repo",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Prozess-Slices für Ihre Kundenprojekte zum Tagessatz",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "Chatbot- und Agenten-Bausteine als Partner-Leistung",
      },
    ],
    outcomes: [
      "White-Label-fähige Umsetzung mit Repo-Disziplin",
      "Klare Tagessatz-Kalkulation für Ihre Angebote",
      "Cross-Referral statt Konkurrenz um denselben Deal",
    ],
    offerHint: "Partner-Kennenlernen über /partner oder Rückruf.",
    faqs: [
      {
        q: "Wie läuft White-Label-Zusammenarbeit ab?",
        a: "Sie bleiben der Ansprechpartner. Wir arbeiten nach fester Tagessatz-Kalkulation, dokumentierten Standards und Repo-Übergabe — pro Projekt ein klarer Scope, kein offenes Stundenkonto.",
      },
      {
        q: "Könnt ihr in unserem Tech-Stack arbeiten?",
        a: "Standard ist unser bewährter Next.js/Node-Stack. Abweichungen werden vor Ausführung geprüft und als Scope benannt — wir versprechen nichts, was wir nicht liefern können.",
      },
      {
        q: "Gibt es eine Mindestabnahme?",
        a: "Nein — ein einzelner Arbeitstag (449 € netto) ist als Einstieg möglich. Sinnvoll ist ein Pilot-Slice, um Prozess und Qualität kennenzulernen.",
      },
    ],
    wissen: {
      slug: "was-kostet-web-app-2026",
      title: "Was kostet eine Web-App 2026?",
    },
  },
  {
    slug: "kanzleien",
    title: "Rechtsanwälte & Kanzleien — Mandate statt Verwaltung",
    eyebrow: "Branche · Kanzleien",
    description:
      "Erstkontakt, Mandatsannahme und wiederkehrende Kommunikation kosten Kanzleien wertvolle Kapazität. NeXify AI baut Website- und Automations-Slices zum Tagessatz 449 € — berufsrechtlich bewusst, ohne Rechtsdienstleistung.",
    pains: [
      "Mandatsanfragen kommen unstrukturiert über E-Mail, Telefon und Formulare",
      "Erstkontakt und Terminabstimmung sind manuell",
      "Kanzlei-Website erklärt nicht, wofür die Kanzlei steht",
    ],
    notYourFault: [
      "dass Mandatsanfragen zwischen Postfach und Telefon durchrutschen",
      "dass Erstgespräche mit Terminkoordination statt Inhalt beginnen",
      "dass die Kanzlei-Website nicht das Vertrauen baut, das der Ruf verdient",
    ],
    useCase: {
      title: "Strukturierter Mandats-Erstkontakt",
      text: "Konkret: Kanzlei-Website mit klar getrennten Wegen (Erstberatung, laufende Mandate, Kanzlei), Anfrageformular mit Rechtsgebiet und Anliegen, automatische Eingangsbestätigung und Terminvorschlag. Der Chatbot beantwortet nur organisatorische Fragen — rechtlicher Inhalt bleibt ausdrücklich bei Ihnen.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Kanzlei-Website mit Vertrauenssignalen und klarem Erstkontakt-Pfad",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Anfrage-Triage nach Rechtsgebiet, Terminabstimmung, Wiedervorlagen",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "FAQ-Chatbot zu Kanzlei, Erreichbarkeit und Ablauf — kein Rechtsrat",
      },
    ],
    outcomes: [
      "Jede Anfrage landet strukturiert am richtigen Ort",
      "Website, die Kompetenz und nächste Schritte zeigt",
      "Automation mit klarer Grenze: Mensch prüft, Maschine sortiert",
    ],
    offerHint: "Audit-Tag (449 €) oder Sprechstunde zum Einstieg.",
    faqs: [
      {
        q: "Dürfen Kanzleien KI-Chatbots auf der Website einsetzen?",
        a: "Ja — für organisatorische Themen (Erreichbarkeit, Ablauf, Unterlagen) ist ein FAQ-Bot unproblematisch, wenn er DSGVO-konform aufgesetzt ist und klar als KI kommuniziert wird. Rechtsberatung durch Maschinen bieten wir ausdrücklich nicht an — rechtlicher Inhalt bleibt beim Anwalt.",
      },
      {
        q: "Was kostet eine Kanzlei-Website bei NeXify AI?",
        a: "Startumfang (Website mit Leistungsbereichen, Erstkontakt-Formular, technisches SEO, Pflichtverlinkungen) ab einem Arbeitstag × 449 € netto. Scope wird vor Ausführung fixiert.",
      },
      {
        q: "Wie bleiben die Daten DSGVO-konform?",
        a: "Anfrageformulare und Bots verarbeiten nur die Daten, die für den Erstkontakt nötig sind, mit dokumentierter Verarbeitungsübersicht und Löschkonzept. Auf Wunsch mit AVV-gerechter Einordnung — Details klären wir vor dem Build.",
      },
    ],
    wissen: {
      slug: "chatbot-dsgvo",
      title: "Chatbot & DSGVO — worauf Kanzleien achten müssen",
    },
  },
  {
    slug: "logistik",
    title: "Logistik & Spedition — Status statt Telefonate",
    eyebrow: "Branche · Logistik",
    description:
      "Sendungsstatus, Dispo und Kundenkommunikation laufen quer über E-Mail und Telefon. NeXify AI automatisiert Status- und Auftragskommunikation zum Tagessatz 449 € — ohne Eingriff in Ihr TMS.",
    pains: [
      "Statusanfragen von Kunden binden Personal im Büro",
      "Auftragsbestätigungen und Lieferinformationen sind Handarbeit",
      "Website und Angebotsanfrage-Pfad sind unterentwickelt",
    ],
    notYourFault: [
      "dass Kunden für jede Statusfrage anrufen, weil niemand automatisch informiert",
      "dass Auftragsbestätigungen abends von Hand rausgehen",
      "dass die Website kaum Anfragen bringt, weil der Pfad fehlt",
    ],
    useCase: {
      title: "Automatische Sendungs-Kommunikation",
      text: "Konkret: Auftragseingang löst Bestätigung aus; Statusänderungen (Abholung, unterwegs, zugestellt) gehen automatisch an den Kunden — per E-Mail oder WhatsApp. Das Büro beantwortet nur noch Ausnahmen. Ihr TMS bleibt unangetastet; wir lesen Status über Schnittstelle oder Datei-Export.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Speditions-Website mit Angebotsanfrage und Leistungsübersicht",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Status-Trigger, Bestätigungen, Verspätungs-Alert",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "Chatbot für Sendungsstatus-Fragen mit TMS-Anbindung",
      },
    ],
    outcomes: [
      "Kunden erfahren Status aktiv — Anrufe sinken messbar",
      "Bestätigungen laufen automatisch und einheitlich",
      "Website mit echtem Anfrage-Pfad statt Impressums-Seite",
    ],
    offerHint: "Audit-Tag (449 €) identifiziert die größten Kommunikations-Engpässe.",
    faqs: [
      {
        q: "Müsst ihr unser Transportmanagementsystem (TMS) ersetzen?",
        a: "Nein. Wir binden Statusdaten per Schnittstelle oder Export an — Ihr TMS bleibt das System der Wahrheit. Die Automation liest und kommuniziert, sie verwaltet nicht.",
      },
      {
        q: "Kann der Chatbot echte Sendungsstatus ausgeben?",
        a: "Ja, wenn eine Statusquelle (API oder Datei-Export) existiert. Der Bot antwortet dann mit dem aktuellen Status und verweist bei Ausnahmen an den Menschen — keine erfundenen Tracking-Angaben.",
      },
      {
        q: "Was kostet der Einstieg für Speditionen?",
        a: "Ein Audit-Tag (449 € netto) priorisiert die Engpässe, danach wird ein Pilot-Slice als fester Scope kalkuliert — typischerweise im Bereich weniger Arbeitstage.",
      },
    ],
    wissen: {
      slug: "automation-roi",
      title: "Automation-ROI: was sich wirklich rechnet",
    },
  },
  {
    slug: "pflege",
    title: "Pflege & Gesundheit — Anfragen ohne Papierkram",
    eyebrow: "Branche · Pflege / Gesundheit",
    description:
      "Pflegeeinrichtungen und ambulante Dienste verlieren Zeit mit Anfragen, Dokumentation und Rückrufen. NeXify AI baut verständliche Websites und Automation — datenschutzbewusst, ohne medizinische Versprechen.",
    pains: [
      "Anfragen zu Pflegeplatz oder ambulanter Versorgung kommen unsortiert",
      "Rückruf-Orgien und handschriftliche Notizen fressen Zeit",
      "Website erklärt Leistungen und Aufnahme nicht klar",
    ],
    notYourFault: [
      "dass Angehörige dreimal anrufen, weil nichts schriftlich ankommt",
      "dass Aufnahme-Anfragen zwischen Dienstplänen hängen bleiben",
      "dass die Website Fragen zur Pflege nicht beantwortet, die alle stellen",
    ],
    useCase: {
      title: "Aufnahme-Anfrage mit klarem Pfad",
      text: "Konkret: Website mit Leistungsüberblick (ambulant, stationär, Tagespflege), Anfrageformular mit Pflegebedarf und Zeitrahmen, automatische Bestätigung mit nächsten Schritten. Ein FAQ-Bot beantwortet die häufigsten Fragen zur Aufnahme — medizinische Einschätzungen bleiben strikt beim Fachpersonal.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Pflege-Website mit Leistungen, Aufnahme-Pfad und Vertrauenssignalen",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Anfrage-Erfassung, Bestätigungen, Erinnerungen vor Aufnahmegespräch",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "FAQ-Chatbot zu Leistungen und Aufnahme — keine Medizinauskunft",
      },
    ],
    outcomes: [
      "Anfragen kommen strukturiert an — Rückruf-Orgien sinken",
      "Website beantwortet die Fragen, die Angehörige wirklich haben",
      "Klare Grenze: menschliche Fachlichkeit bleibt unangetastet",
    ],
    offerHint: "Sprechstunde oder Audit-Tag (449 €) zum Einstieg.",
    faqs: [
      {
        q: "Sind KI-Chatbots im Pflegebereich datenschutzrechtlich okay?",
        a: "Ja, wenn sie DSGVO-konform aufgesetzt sind: minimale Daten, keine Gesundheitsdaten-Verarbeitung ohne Zweck und Grundlage, klare KI-Kennzeichnung, Fallback zum Menschen. Wir bauen ausdrücklich keine medizinischen Einschätzungen.",
      },
      {
        q: "Was kostet eine Website für eine Pflegeeinrichtung?",
        a: "Startumfang (Leistungen, Aufnahme-Pfad, Kontakt, technisches SEO) ab einem Arbeitstag × 449 € netto. Der genaue Scope wird vor Ausführung fixiert.",
      },
      {
        q: "Kann die Automation Anfragen wirklich sortieren?",
        a: "Sie kann strukturieren: Pflegebedarf, gewünschter Zeitrahmen, Kontaktweg — damit die zuständige Person auf einen Blick sieht, was ansteht. Entscheidungen über Aufnahmen und Pflege treffen weiterhin Ihre Fachkräfte.",
      },
    ],
    wissen: {
      slug: "ki-automatisierung-kmu-7-gewinne",
      title: "KI-Automatisierung im KMU: 7 Gewinne",
    },
  },
  {
    slug: "gastronomie",
    title: "Gastronomie — Gäste statt Reservierungs-Chaos",
    eyebrow: "Branche · Gastronomie",
    description:
      "Reservierungen, Anfragen und Gästekommunikation laufen über Telefon, WhatsApp und Social Media quer. NeXify AI automatisiert Bestätigung und Erinnerung — Website und FAQ-Bot zum Tagessatz 449 €.",
    pains: [
      "Reservierungsanfragen kommen über vier Kanäle gleichzeitig",
      "Bestätigungen und Erinnerungen sind Handarbeit",
      "Website und Online-Präsenz lassen Gäste raten statt buchen",
    ],
    notYourFault: [
      "dass Reservierungen in Telefon- und WhatsApp-Nachrichten verloren gehen",
      "dass No-Shows teuer werden, weil niemand erinnert",
      "dass die Website nicht zeigt, was das Lokal ausmacht",
    ],
    useCase: {
      title: "Reservierung mit Bestätigung und Erinnerung",
      text: "Konkret: Website mit Menü, Öffnungszeiten und Reservierungsformular; jede Anfrage erhält automatisch Bestätigung, am Vortag eine Erinnerung — per E-Mail oder WhatsApp. Der FAQ-Bot beantwortet Fragen zu Öffnungszeiten, Menü und Events, damit das Telefon für echte Anliegen frei bleibt.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Restaurant-Website mit Menü, Öffnungszeiten und Reservierungspfad",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Reservierungs-Bestätigung, Erinnerung, No-Show-Reduktion",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "FAQ-Chatbot zu Öffnungszeiten, Menü, Events",
      },
    ],
    outcomes: [
      "Jede Anfrage bekommt eine Antwort — aus einem Pfad statt vier Kanälen",
      "Gäste kommen erinnert — No-Shows sinken",
      "Website, die Appetit und Buchung auslöst",
    ],
    offerHint: "Sprechstunde oder Audit-Tag (449 €) zum Einstieg.",
    faqs: [
      {
        q: "Kann ein Chatbot Reservierungen annehmen?",
        a: "Ja — der Bot fragt Datum, Uhrzeit und Personenzahl ab und reicht die Anfrage strukturiert weiter; Bestätigung und Erinnerung laufen automatisch. Anbindung an Ihr Reservierungssystem ist möglich, vorher klären wir den Umfang.",
      },
      {
        q: "Was kostet eine Restaurant-Website?",
        a: "Startumfang (Menü, Öffnungszeiten, Reservierungspfad, technisches SEO) ab einem Arbeitstag × 449 € netto — fester Scope vor Ausführung.",
      },
      {
        q: "Reduziert die Erinnerung wirklich No-Shows?",
        a: "Ja, erfahrungsgemäß deutlich — eine Erinnerung am Vortag senkt die No-Show-Quote spürbar, weil Gäste den Termin nicht vergessen. Versprochene Zahlen vermeiden wir, gemessen wird nach dem Pilot.",
      },
    ],
    wissen: {
      slug: "was-kostet-ki-chatbot-2026",
      title: "Was kostet ein KI-Chatbot 2026?",
    },
  },
  {
    slug: "produktion",
    title: "Produktion & Industrie — Angebote statt Anfrage-Lücken",
    eyebrow: "Branche · Produktion",
    description:
      "Angebotsanfragen, wiederkehrende Kommunikation und Kundenportale sind in mittelständischer Produktion oft Handarbeit. NeXify AI baut schlanke Web- und Automations-Slices zum Tagessatz 449 € — ohne Eingriff in ERP oder Maschinen.",
    pains: [
      "Angebotsanfragen kommen unstrukturiert und werden ungleich beantwortet",
      "Kundenstatus und Bestellkommunikation laufen über Einzel-E-Mails",
      "Website zeigt Kompetenz nicht — keine Anfragen über den Web-Pfad",
    ],
    notYourFault: [
      "dass Anfragen im Vertriebs-Postfach nach Eingangsdatum statt Priorität bearbeitet werden",
      "dass jeder Kunde denselben Status per E-Mail anfragt, den Sie längst kennen",
      "dass die Website zeigt, was Sie bauen — aber nicht, wie man anfragt",
    ],
    useCase: {
      title: "Angebotsanfrage mit Kundenportal-Slice",
      text: "Konkret: Website mit Produkt-/Leistungsübersicht und strukturiertem Anfrageformular (Material, Stückzahl, Zeithorizont) → automatische Eingangsbestätigung und Triage an den richtigen Vertriebler. Optional ein Kundenportal-Slice für Status und Dokumente — mit klarer Abgrenzung zu Ihrem ERP.",
    },
    apps: [
      {
        name: "Website",
        href: "/leistungen/websites",
        text: "Produktions-Website mit Leistungen und strukturierter Angebotsanfrage",
      },
      {
        name: "Automatisierung",
        href: "/leistungen/automatisierung",
        text: "Anfrage-Triage, Bestätigungen, Status-Updates an Kunden",
      },
      {
        name: "AI-Agent",
        href: "/leistungen/ai-agenten",
        text: "FAQ-Chatbot zu Materialien, Lieferzeiten, Zertifikaten",
      },
    ],
    outcomes: [
      "Anfragen kommen strukturiert an — Antwortzeiten sinken",
      "Kunden erhalten Status aktiv statt per Rückfrage",
      "Website wird zum Anfragekanal, nicht zur Visitenkarte",
    ],
    offerHint: "Audit-Tag (449 €) priorisiert die Engpässe in Vertrieb und Kommunikation.",
    faqs: [
      {
        q: "Müsst ihr in unser ERP oder die Maschinensteuerung eingreifen?",
        a: "Nein. Wir automatisieren die Kommunikationsebene: Anfrageformulare, Bestätigungen, Status-Updates. ERP-Anbindungen sind optional und werden als eigener Scope vor Ausführung geprüft — kein Eingriff in die Produktion.",
      },
      {
        q: "Kann ein Chatbot Anfragen zu Materialien und Lieferzeiten beantworten?",
        a: "Ja, wenn die Fakten dokumentiert sind (Materialdaten, Standard-Lieferzeiten). Der Bot gibt nur geprüfte Angaben wieder und übergibt Sonderfälle an den Menschen — keine erfundenen Werte.",
      },
      {
        q: "Was kostet eine Website mit Angebotsanfrage für Produktionsbetriebe?",
        a: "Startumfang ab einem Arbeitstag (449 € netto); ein Portal-Slice mit Status und Dokumenten wird als fester Scope kalkuliert — transparent vor Ausführung.",
      },
    ],
    wissen: {
      slug: "ai-agenten-einfuehrung",
      title: "AI-Agenten fürs Unternehmen — Einführung",
    },
  },
];

export function getBranche(slug: string): Branche | undefined {
  return branchen.find((b) => b.slug === slug);
}

export function branchenSlugs(): string[] {
  return branchen.map((b) => b.slug);
}
