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
  "berlin": {
    h1: "KI-Agentur Berlin — Websites, Apps & KI-Automatisierung",
    intro: "Wir bauen für Berliner KMU Websites, Apps und KI-Automatisierung, die echten Umsatz bringen. Kein buzzword-Gefasel, sondern handfeste Prozesse: Terminbuchung, Angebotserstellung, Kundenkommunikation. Unser Team arbeitet remote-first vom Standort Venlo aus, mit regelmäßigen Berlin-Besuchen für Workshops. Tagessatz 449 Euro, transparent und fest – ohne Überraschungen. Sie profitieren von schnellen Reaktionszeiten und pragmatischen Lösungen, die zu Ihrer Branche passen – ob Handwerk, Gastronomie oder Tech.",
    services: [
      { title: "Website & Webshop", text: "Wir entwickeln performante Websites und Webshops, die auf Conversion optimiert sind. Von der Struktur bis zum Ladezeit-Tuning: alles auf Ihre Berliner Zielgruppe ausgerichtet. Sie erhalten ein System, das Sie selbst pflegen können. Kein Ballast, keine überflüssigen Plugins." },
      { title: "KI-Automatisierung & Chatbots", text: "Ihr Support-Team schläft nie: Wir integrieren Chatbots, die Termine vergeben, Standardfragen beantworten und Leads qualifizieren. Dazu automatisieren wir interne Workflows wie Rechnungserstellung und E-Mail-Follow-ups. Ihre Mitarbeiter arbeiten an den wichtigen Aufgaben, nicht an Routine." },
      { title: "WhatsApp-Marketing & CRM", text: "Wir verbinden Ihr CRM mit WhatsApp, damit Sie Kunden dort erreichen, wo sie täglich sind. Automatisierte Kampagnen, personalisierte Nachrichten, ohne Datenschutz-Risiko. Sie behalten den Überblick über jeden Kontakt und steigern die Wiederkaufrate messbar." },
    ],
    localNote: "Wir sind zwar remote-first in Venlo, aber kein Fake-Büro in Berlin. Wir pflegen echte Kooperationen mit lokalen Partnern und besuchen Sie bei Bedarf persönlich. Die Zusammenarbeit funktioniert digital – mit festen Ansprechpartnern und klaren Kommunikationswegen.",
    faqs: [
      { q: "Wie viel kostet eine Website in Berlin?", a: "Eine professionelle Website startet bei 4.500 Euro, der Tagessatz liegt bei 449 Euro. Die genaue Summe hängt von Umfang und Anforderungen ab. Sie erhalten immer ein Festpreisangebot." },
      { q: "Wie lange dauert ein Webprojekt in Berlin?", a: "In der Regel 4 bis 8 Wochen, je nach Komplexität. Wir arbeiten in wöchentlichen Sprints mit klaren Meilensteinen. Sie sehen den Fortschritt kontinuierlich und können steuern." },
      { q: "Ist der Chatbot DSGVO-konform?", a: "Ja, komplett. Wir hosten in deutschen Rechenzentren und speichern nur notwendige Daten. Sie erhalten eine DSGVO-konforme Dokumentation, die auch Ihren Anforderungen als Berliner Unternehmen entspricht." },
      { q: "Wie funktioniert die Remote-Zusammenarbeit?", a: "Wir nutzen strukturierte Projektmanagement-Tools und wöchentliche Videocalls. Sie haben direkten Draht zu Ihrem Projektleiter. Bei Kickoff und Review sind wir vor Ort in Berlin, wenn es nötig ist." },
    ],
  },
  "hamburg": {
    h1: "KI-Agentur Hamburg — Websites, Apps & KI-Automatisierung",
    intro: "Für Hamburger Mittelstand und Startups entwickeln wir digitale Lösungen, die den Hafen an Effizienz denken. Website, App oder KI-basierte Prozessautomatisierung – wir setzen auf bewährte Technik statt Experimente. Remote-first aus Venlo, aber mit Verständnis für lokale Branchen wie Logistik, Handel und Medien. Tagessatz 449 Euro, kalkulierbar und fair. Sie bekommen einen Partner, der liefert und mitdenkt – ohne monatelange Implementierungszeit.",
    services: [
      { title: "Webentwicklung & Webshops", text: "Ob Corporate Site oder Shop: Wir bauen mit modernem Stack, der schnell läuft und einfach zu pflegen ist. Typisch Hamburger Hanse-Geist: pragmatisch, zuverlässig, auf den Punkt. Ihre Kunden finden schnell, was sie suchen – und kaufen." },
      { title: "KI-Automatisierung & Chatbots", text: "Wir ersetzen manuelle Schreibtischarbeit durch intelligente Automatisierung. Chatbots für Vertrieb und Support, automatische Datenverarbeitung, Formularerkennung. Ihre Prozesse laufen rund um die Uhr, ohne Fehler und ohne Personalkosten." },
      { title: "WhatsApp Business & CRM-Anbindung", text: "Kommunizieren Sie mit Kunden über WhatsApp – zentralisiert und DSGVO-konform. Wir verknüpfen Ihr CRM, senden Erinnerungen, Angebote und Newsletter. In der maritimen Stadt wissen Sie: Der Wind dreht schnell. Wir halten Ihre Kunden auf Kurs." },
    ],
    localNote: "Remote-first aus Venlo, aber kein Schein-Filialkonzept in Hamburg. Wir arbeiten digital mit klaren Prozessen und sind für Workshops zu Ihnen vor Ort. Unsere Erfahrung aus norddeutscher und niederländischer Wirtschaft macht die Zusammenarbeit unkompliziert – und ehrlich.",
    faqs: [
      { q: "Was kostet eine KI-Automatisierung in Hamburg?", a: "Der Tagessatz beträgt 449 Euro; ein kleines Automatisierungsprojekt startet bei 2.500 Euro. Machbarkeit und Aufwand klären wir in einem kostenlosen Erstgespräch. Sie erhalten ein transparentes Angebot." },
      { q: "Wie lange dauert die Entwicklung einer App in Hamburg?", a: "Eine Standard-App benötigt 6 bis 12 Wochen. Komplexe Integrationen können länger dauern. Sie bekommen von Anfang an einen Umsetzungsplan mit festen Deadlines." },
      { q: "Ist die KI-Lösung DSGVO-konform?", a: "Selbstverständlich. Alle Daten verbleiben auf EU-Servern, wir dokumentieren die Verarbeitung. Sie erhalten eine Konformitätsbescheinigung für Ihr Revisions- und Qualitätsmanagement." },
      { q: "Wie kommen wir mit Ihnen in Kontakt, wenn Sie remote sind?", a: "Täglich per E-Mail, Slack oder Telefon – und bei Bedarf per Videocall. Wir sind auch regelmäßig in Hamburg, etwa für Workshops und Projekt-Kickoffs. Persönlicher Kontakt bleibt essentiell." },
    ],
  },
  "muenchen": {
    h1: "KI-Agentur München — Websites, Apps & KI-Automatisierung",
    intro: "Für Münchner Unternehmen – von Automobilzulieferern bis zur Biotech-Szene – entwickeln wir Websites, Apps und KI-Automatisierung, die komplexe Anforderungen mit einfacher Bedienbarkeit verbinden. Unser remote-first-Team in Venlo kombiniert deutsche Präzision mit pragmatischer Herangehensweise. Tagessatz 449 Euro, Festpreise für klare Projekte. Wir liefern nicht nur Code, sondern auch Strategie. So bleiben Sie wettbewerbsfähig im Herzen des High-Tech-Standorts.",
    services: [
      { title: "Hochleistungs-Websites & Webshops", text: "Technisch anspruchsvolle Plattformen, die auch bei hohen Zugriffszahlen stabil laufen. Wir optimieren für Suchmaschinen, Conversions und Mobile-First. Ihr Webauftritt wird zur effektiven Vertriebsmaschine – ohne komplizierte Verwaltung." },
      { title: "KI-Automatisierung & intelligente Chatbots", text: "Von der automatisierten Angebotserstellung bis zur Predictive Analytics: Wir setzen Machine Learning gezielt ein, wo es Mehrwert bringt. Chatbots sprechen natürlich und integrieren sich in Ihre Systeme. Sie sparen Zeit und Kosten nachweislich." },
      { title: "WhatsApp-Marketing & CRM-Workflows", text: "WhatsApp ist der direkte Draht zum Kunden. Wir automatisieren Kampagnen und Support, verknüpfen mit Salesforce, HubSpot oder individuellen CRMs. DSGVO-konform, mit klarer Dokumentation. Ihre Vertriebsmannschaft nutzt die effektivste Kommunikationslinie." },
    ],
    localNote: "Remote-first aus Venlo, aber keine virtuelle Filiale. Wir betreuen Münchner Unternehmen mit festem Ansprechpartner und besuchen Sie für Strategieworkshops und Reviews. Die Distanz ist überwindbar – was zählt, sind schnelle Entscheidungswege und Ergebnisse.",
    faqs: [
      { q: "Wie sind Ihre Preise für ein Projekt in München?", a: "Tagessatz 449 Euro; eine durchschnittliche Website liegt bei 4.000 bis 7.000 Euro. KI-Projekte projektieren wir individuell. Sie erhalten immer eine Festpreisgarantie aus dem ersten Workshop." },
      { q: "Wie lange dauert die Umsetzung eines Chatbots?", a: "Basierend auf Standardmodulen zwei bis vier Wochen. Individuelle Integrationen in CRM oder ERP benötigen vier bis sechs Wochen. Nach der Freigabe starten wir sofort." },
      { q: "Wo werden die Daten gespeichert?", a: "Ausschließlich auf Servern in Deutschland bzw. der EU. Wir vermeiden Drittlandtransfer. DSGVO-Konformität ist Teil des Projekts, nicht optionaler Aufpreis." },
      { q: "Wie läuft die Remote-Zusammenarbeit mit einem Münchner Kunden ab?", a: "Regelmäßige Videocalls, Kanban-Board mit offenem Zugang, wöchentliche Statusmails. Für Kreativ-Workshops und Abnahme sind wir persönlich in München. So bleibt die Kommunikation effektiv und vertrauensvoll." },
    ],
  },
  "koeln": {
    h1: "KI-Agentur Köln — Websites, Apps & KI-Automatisierung",
    intro: "Kölns Mittelstand braucht digitale Lösungen, die mithalten mit den Besten. Wir entwickeln Websites, Apps und KI-Automatisierung für Medien, Versicherungen, Logistik und das Handwerk – mit klarer Kante und ohne Schnickschnack. Remote-first aus Venlo, mit echter Verbindung zur Domstadt durch regelmäßige Präsens. Tagessatz 449 Euro, transparent kalkuliert. Sie profitieren von unserer jahrelangen Erfahrung mit lokalen und internationalen Teams – und von Ergebnissen, die Sie messen können.",
    services: [
      { title: "Webentwicklung für mittelständische Unternehmen", text: "Performante Websites und Webshops, die auf Geschwindigkeit und Bedienbarkeit getrimmt sind. Wir nutzen bewährte Strukturen und achten auf SEO-Grundlagen. Ihre Seite wird zum Verkaufsargument – gerade für Kölner Kunden, die Wert auf Verlässlichkeit legen." },
      { title: "KI-gestützte Automatisierung & Chatbots", text: "Ob Versicherungsanfragen, Terminvereinbarungen oder Dokumentenprüfung – wir automatisieren wiederkehrende Abläufe. Unsere Chatbots lernen aus den Gesprächen und verbessern sich kontinuierlich. Sie entlasten Ihr Team spürbar, ohne die Qualität zu beeinträchtigen." },
      { title: "WhatsApp-Marketing & CRM-Integration", text: "Wir machen WhatsApp zum Vertriebskanal: personalisierte Nachrichten, automatisierte Follow-ups, die den Beratungstermin ausfüllen. Ihr CRM bleibt die zentrale Datenbasis. DSGVO-konform und mit messbarem ROI für jedes Geschäftsfeld." },
    ],
    localNote: "Remote-first aus Venlo, kein Büro in Köln „auf dem Papier“. Wir arbeiten digital mit klaren Prozessen, sind aber regelmäßig vor Ort in Workshops und bei der Einführung. Das ist keine Kulisse, sondern gelebte Nähe auf Distanz.",
    faqs: [
      { q: "Was kostet eine Website in Köln?", a: "Ab 4.500 Euro für eine professionelle Seite mit CMS. Komplexere Projekte wie Webshops starten bei 7.500 Euro. Der Tagessatz liegt bei 449 Euro, mit Festpreisvereinbarung." },
      { q: "Wie lange dauert ein Chatbot-Projekt in Köln?", a: "Mit Standardmodulen etwa drei Wochen. Individuelle Anpassungen an Ihr CRM oder ERP dauern fünf bis acht Wochen. Sie erhalten einen verbindlichen Terminplan vor Projektstart." },
      { q: "Ist die KI-Lösung DSGVO-konform?", a: "Ja, wir setzen nur datenschutzkonforme Modelle und speichern Daten in der EU. Sie bekommen eine vollständige Dokumentation, auch für Ihre betriebliche Datenschutzprüfung." },
      { q: "Wie funktioniert die Kommunikation bei Remote-Projekten?", a: "Direct über Slack und E-Mail, mit wöchentlichen Statuscalls. Für Workshops und das finale Testing kommen wir nach Köln. Das hält den Aufwand gering und die Abstimmung hoch." },
    ],
  },
  "frankfurt-am-main": {
    h1: "KI-Agentur Frankfurt am Main — Websites, Apps & KI-Automatisierung",
    intro: "Frankfurt ist das Finanzzentrum – hier zählt Effizienz bis auf die zweite Nachkommastelle. Wir unterstützen lokale KMU und Startups mit Websites, Apps und KI-Automatisierung, die Prozesse nachweislich beschleunigen. Remote-first aus Venlo, mit einer Arbeitsweise, die auf Transparenz und Liefertreue ausgelegt ist. Tagessatz 449 Euro, unbürokratisch. Ob Kanzlei, FinTech oder Beratung: Sie erhalten digitale Werkzeuge, die Ihren Alltag erleichtern und Ihren Gewinn steigern.",
    services: [
      { title: "Professionelle Websites & Webshops", text: "Klare Struktur, schnelle Ladezeiten, überzeugende Darstellung – genau das erwarten Frankfurter Kunden. Wir bauen Websites und Webshops, die Vertrauen schaffen und Umsatz generieren. Pflegeleicht, ohne Versteckspiel. Sie können Inhalte selbst anpassen." },
      { title: "KI-Automatisierung & Chatbots für Dienstleister", text: "Automatisierte Terminvereinbarungen, Dokumentenanalysen und Kundenqualifikation – das spart Kosten und minimiert Fehler. Unsere Chatbots liefern präzise Antworten und leiten komplexe Fälle an Ihr Team weiter. Effizienz, wie sie im Bankenviertel üblich ist." },
      { title: "WhatsApp-Marketing & CRM-Anbindung", text: "Wir bauen eine nahtlose Schnittstelle zwischen WhatsApp und Ihrem CRM. Automatisierte Nachrichten, Status-Updates, Zahlungserinnerungen – DSGVO-konform und serviceorientiert. Ihre Kunden schätzen die schnelle Antwortzeit, Sie sparen Personalressourcen." },
    ],
    localNote: "Remote-first aus Venlo, aber keine vorgetäuschte Niederlassung. Wir betreuen Frankfurter Firmen mit digitalen Meetings und attraktiven Präsenzterminen. Unser Team ist auch in der Finanzmetropole keine Unbekannte: regelmäßige Kontakte zu lokalen Partnern erhalten die Bodenhaftung.",
    faqs: [
      { q: "Wie hoch sind die Kosten für eine Automatisierung in Frankfurt?", a: "Ein Basis-Chatbot beginnt bei 2.500 Euro, komplexe Automatisierungen ab 5.000 Euro. Der Tagessatz ist 449 Euro. Sie erhalten eine detaillierte Aufstellung ohne versteckte Posten." },
      { q: "Wie lange dauert die Entwicklung einer individuellen App?", a: "In der Regel 8 bis 16 Wochen, abhängig von Funktionen und Integrationen. Durch unseren modularen Ansatz können Sie erste Teile früher nutzen. Einfache Prototypen sind in 2 Wochen realisierbar." },
      { q: "Wie stellen Sie Datenschutz bei KI-Systemen sicher?", a: "Wir verwenden ausschließlich EU-gehostete Infrastruktur und modelset ohne Datenweitergabe an Drittländer. Eine DSGVO-Konformitätserklärung ist Teil des Projektabschlusses. Zusätzlich schulen wir Ihre Mitarbeiter." },
      { q: "Ist die Remote-Arbeit mit einem Frankfurter Terminkalender vereinbar?", a: "Ja, wir arbeiten asynchron mit definierten Reaktionszeiten. Sie erreichen uns werktags innerhalb von zwei Stunden. Für wichtige Gespräche und Abnahmen sind wir persönlich in Frankfurt – terminlich flexibel." },
    ],
  },
  "duesseldorf": {
    h1: "KI-Agentur Düsseldorf — Websites, Apps & KI-Automatisierung",
    intro: "Wir bauen für Düsseldorfer KMU aus Medien, Mode und Logistik performante Websites, individuelle Apps und KI-Automatisierung. Kein Buzzword-Bingo, sondern messbare Prozesse: Anfragen beantworten, Termine buchen, Dokumente prüfen. Remote-first von Venlo aus spart Ihnen overhead, der Tagessatz liegt bei 449 Euro. Sie erhalten einen festen Ansprechpartner, klare Meilensteine und Code, der Ihnen gehört. Ob Neubau oder Optimierung bestehender Systeme – wir setzen Prioritäten, die Ihren Umsatz stützen.",
    services: [
      { title: "Website & Webshop", text: "Konzeption, Design und technische Umsetzung Ihrer Website oder Ihres Webshops mit Fokus auf Conversion. Wir achten auf Ladezeiten, mobile Nutzung und Suchmaschinen. Von der Produktseite bis zum Checkout – angepasst an die Bedürfnisse Ihrer Kunden in Düsseldorf. Inklusive Wartung und Schulung für Ihr Team." },
      { title: "KI-Automatisierung & Chatbots", text: "KI-Chatbots beantworten häufige Kundenfragen rund um die Uhr, qualifizieren Leads und entlasten Ihre Mitarbeiter. Wir integrieren sie in bestehende Systeme wie CRM oder Terminbuchung. Dazu automatisieren wir wiederkehrende Abläufe wie Rechnungsstellung oder Angebotserstellung. Ihre Mannschaft arbeitet an wichtigeren Aufgaben – wir kümmern uns um den Rest." },
      { title: "WhatsApp-Marketing & CRM", text: "Wir verbinden WhatsApp Business mit Ihrem CRM und verschicken personalisierte Nachrichten zu Angeboten, Terminen oder Updates. DSGVO-konform und mit Opt-in-Verwaltung. Sie sehen Auswertungen, die zeigen, welche Kampagne tatsächlich Kunden bringt. Kein Newsletter-Spam, sondern relevante Kommunikation, die Ihre Kunden schätzen." },
    ],
    localNote: "Unser Sitz ist in Venlo, direkt an der Grenze. Für Düsseldorf arbeiten wir remote-first: Videocalls, gemeinsame Dokumente und gelegentliche Treffen vor Ort. Sie profitieren von einem internationalen Team ohne Standortkosten. Ehrlich gesagt: Eine Filiale in der Innenstadt haben wir nicht – dafür bekommen Sie schnellere Reaktionszeiten und faire Preise.",
    faqs: [
      { q: "Was kostet eine Website in Düsseldorf?", a: "Ein professioneller Webshop startet bei etwa 8.000 Euro, eine klassische Website bei 4.000 Euro. Dazu kommen laufende Kosten für Hosting und Wartung. Sie erhalten ein Festpreisangebot nach einem kostenlosen Erstgespräch." },
      { q: "Wie lange dauert die Entwicklung?", a: "Eine typische Website ist nach 4 bis 6 Wochen live, ein Webshop nach 8 bis 12 Wochen. Abhängig von Umfang und Ihrer Feedback-Geschwindigkeit. Wir liefern in Etappen, damit Sie jederzeit den Fortschritt sehen." },
      { q: "Ist ein KI-Chatbot DSGVO-konform?", a: "Ja, wenn er europäische Server nutzt und Sie eine Verarbeitungsvereinbarung abschließen. Wir setzen auf Lösungen mit Datenverschlüsselung und klaren Löschfristen. Sie bleiben Herr über alle Daten." },
      { q: "Warum arbeiten Sie remote-first von Venlo aus?", a: "Wir haben uns bewusst gegen ein teures Büro in Düsseldorf entschieden. Das spart Kosten, die wir an Sie weitergeben. remote-first heißt für Sie: flexible Termine, kürzere Wartezeiten und dennoch ein persönlicher Ansprechpartner." },
    ],
  },
  "stuttgart": {
    h1: "KI-Agentur Stuttgart — Websites, Apps & KI-Automatisierung",
    intro: "Stuttgarter KMU aus Automobilzulieferung, Maschinenbau und IT profitieren von unseren maßgeschneiderten Websites, Apps und Automatisierungslösungen. Wir ersetzen manuelle Arbeit durch KI-Chatbots und Workflows, die Fehler reduzieren. Entwickelt wird remote-first in Venlo – das bedeutet für Sie: kein Overhead, Tagessatz 449 Euro. Wir verstehen Ihre Industrie, liefern sauberen Code und integrieren sich in bestehende Systeme. Der Fokus liegt auf Effizienzgewinn, der sich im Betriebsergebnis niederschlägt.",
    services: [
      { title: "Website & Webshop", text: "Technisch hochwertige Websites für Unternehmen, die Präzision erwarten. Wir setzen auf moderne Frameworks, schnelle Server und klare Strukturen. Ob Produktkatalog, Konfigurator oder B2B-Shop – wir bauen, was Ihre Kunden brauchen. Inklusive SEO-Grundlagen und Web-Analyse. Sie erhalten eine Lösung, die skaliert, wenn Ihr Geschäft wächst." },
      { title: "KI-Automatisierung & Chatbots", text: "Wir entwickeln KI-Assistenten für technische Anfragen, Support-Tickets und interne Wissenssuche. Ihre Mitarbeiter bekommen Antworten in Sekunden, Kunden erhalten rund um die Uhr Hilfe. Dazu automatisieren wir Datenübertragungen zwischen ERP und CRM. Weniger manuelle Arbeit, geringere Fehlerquote – das spüren Sie sofort." },
      { title: "WhatsApp-Marketing & CRM", text: "Kommunizieren Sie mit Kunden und Partnern dort, wo sie sind: auf WhatsApp. Wir binden den Kanal sicher an Ihr CRM an und versenden automatisierte Statusmeldungen oder Angebotsupdates. Mit Einwilligungsmanagement und Volltextsuche im Verlauf. Sie sparen Zeit und erhöhen die Erreichbarkeit – ohne zusätzliche Software." },
    ],
    localNote: "Venlo ist rund 400 Kilometer von Stuttgart entfernt, aber virtuell sind wir näher als mancher Nachbar. remote-first heißt für uns: strukturierte Prozesse, tägliche Updates und Tools, die Zusammenarbeit einfach machen. Wir verzichten auf ein Stuttgarter Büro, um Ihnen günstigere Preise zu bieten. Ehrlich: Für Workshops oder Vor-Ort-Termine reisen wir gern an – die Fahrtzeit planen wir transparent ein.",
    faqs: [
      { q: "Was kostet eine KI-Automatisierung in Stuttgart?", a: "Ein einfacher Workflow beginnt bei 1.500 Euro, ein Chatbot mit ERP-Anbindung ab 5.000 Euro. Sie erhalten einen Kostenvoranschlag nach einer Analysephase. Die Investition amortisiert sich meist innerhalb von sechs Monaten." },
      { q: "Wie lange dauert die Umsetzung?", a: "Ein Chatbot ist in 3 bis 6 Wochen einsatzbereit, eine vollständige Automatisierung in 8 bis 12 Wochen. Wir arbeiten agil und liefern regelmäßig testbare Zwischenstände. So bleiben Sie stets im Loop." },
      { q: "Welche Daten verarbeitet der Chatbot?", a: "Nur die Daten, die für die Beantwortung notwendig sind. Wir konfigurieren Speicherfristen und Zugriffsrechte nach Ihrer Vorgabe. Alle Systeme laufen auf Servern in der EU, DSGVO-konform." },
      { q: "Warum kein Standort in Stuttgart?", a: "Weil ein Büro in Stuttgart Ihre Kosten unnötig erhöht. remote-first spart Miete und Anfahrtszeit – das geben wir an Sie weiter. Sie erhalten trotzdem enge Betreuung und schriftliche Dokumentation aller Schritte." },
    ],
  },
  "leipzig": {
    h1: "KI-Agentur Leipzig — Websites, Apps & KI-Automatisierung",
    intro: "Leipziger KMU aus Logistik, Handel und Kreativwirtschaft bekommen von uns Websites, Apps und KI-Lösungen, die im Alltag funktionieren. Wir digitalisieren Prozesse ohne Umwege: Chatbots beantworten Kundenanfragen, Automatisierungen übernehmen Dateneingaben, Webshops laufen stabil. Entwickelt wird remote-first aus Venlo, Tagessatz 449 Euro. Sie erhalten einen Partner, der zuhört und liefert – mit klarer Kommunikation und nachvollziehbaren Ergebnissen. Kein Projekt, das sich zieht, sondern ein Ziel, das wir gemeinsam erreichen.",
    services: [
      { title: "Website & Webshop", text: "Wir bauen Websites und Webshops, die schnell laden und einfach zu bedienen sind. Für Leipziger Händler und Dienstleister bedeutet das: mehr Anfragen, weniger Absprünge. Wir kümmern uns um Technik, Gestaltung und Texte. Sie pflegen Inhalte selbst mit einem benutzerfreundlichen CMS. Nach dem Launch bleiben wir für Optimierungen an Ihrer Seite." },
      { title: "KI-Automatisierung & Chatbots", text: "KI-Chatbots übernehmen erste Kundenkontakte, beantworten Standardfragen und leiten komplexe Anliegen weiter. Das entlastet Ihre Hotline und verbessert die Erreichbarkeit. Wir verbinden die Bots mit Ihrem Warenwirtschaftssystem oder Terminkalender. So wird aus einem technischen Feature ein echter Umsatzhelfer." },
      { title: "WhatsApp-Marketing & CRM", text: "Nutzen Sie WhatsApp für Angebote, Bestellstatus oder Terminbestätigungen. Wir integrieren den Kanal in Ihr CRM und versenden automatisierte, personalisierte Nachrichten. DSGVO-konform mit Zustimmung und Abmeldefunktion. Sie sparen Porto und Zeit, Ihre Kunden schätzen die unkomplizierte Kommunikation." },
    ],
    localNote: "Leipzig ist eine wachsende Stadt mit viel Innovationskraft – wir tragen dazu bei, ohne eigene Filiale vor Ort zu haben. remote-first aus Venlo ermöglicht uns, flexibel auf Ihre Anforderungen zu reagieren. Persönliche Treffen planen wir bei Bedarf, ansonsten arbeiten wir mit Video-Calls und digitalen Boards. Ehrlicherweise: Für kleinere Projekte reicht das völlig aus, und Sie sparen die Agentur-Rabatte für Büromieten.",
    faqs: [
      { q: "Was kostet eine Website in Leipzig?", a: "Eine mittelständische Firmenwebsite liegt zwischen 3.500 und 7.000 Euro, ein Webshop zwischen 6.000 und 12.000 Euro. Der Preis hängt von Umfang und Funktionen ab. Wir erstellen ein transparentes Angebot nach einer kurzen Anforderungsanalyse." },
      { q: "Wie läuft die Zusammenarbeit remote ab?", a: "Wir nutzen Tools wie Slack, Trello und gemeinsame Laufwerke. Wöchentliche Statusupdates und klare Verantwortlichkeiten sorgen für Fortschritt. Für Kick-off und Abschluss sind wir gern persönlich in Leipzig." },
      { q: "Ist ein Chatbot für kleine Unternehmen sinnvoll?", a: "Ja, wenn er häufige Fragen automatisiert beantwortet und so Zeit freisetzt. Schon fünf Anrufe pro Tag sparen bis zu zwei Stunden wöchentlich. Die Einrichtung ist in wenigen Tagen erledigt." },
      { q: "Warum arbeiten Sie nicht direkt in Leipzig?", a: "Weil wir die Kosten gering halten wollen. Ohne teures Büro in Leipzig können wir Ihnen einen fairen Stundensatz anbieten. Die Nähe ist dennoch da – durch Technik und gelegentliche Besuche." },
    ],
  },
  "dortmund": {
    h1: "KI-Agentur Dortmund — Websites, Apps & KI-Automatisierung",
    intro: "Dortmunder KMU aus Industrie, Handwerk und Gesundheitswesen setzen auf unsere Websites, Apps und Automatisierungen, die den Unterschied machen. Wir analysieren Ihre Prozesse und bauen genau die Lösung, die Sie brauchen – von KI-Chatbots für Terminbuchungen bis hin zu Webshops mit komplexen Kalkulationen. remote-first aus Venlo mit Tagessatz 449 Euro. Ehrlich, termintreu und ohne versteckte Kosten. Ihr Nutzen: mehr Zeit fürs Kerngeschäft, weniger manuelle Arbeit, zufriedenere Kunden. Wir sind Ihr Wegbegleiter für die digitale Zukunft.",
    services: [
      { title: "Website & Webshop", text: "Ihre Website ist oft der erste Eindruck – wir sorgen dafür, dass er zählt. Mit klarem Design, verständlichen Texten und schneller Technik. Für Dortmunder Unternehmen im B2B- und B2C-Bereich bauen wir Webshops mit individuellen Funktionen wie Preisstaffeln oder Kundenlogin. Sie erhalten eine Plattform, die Vertrauen schafft und Verkäufe fördert." },
      { title: "KI-Automatisierung & Chatbots", text: "Ein KI-Chatbot, der Ihre Kunden versteht: Er hilft bei Anfragen zu Öffnungszeiten, Preisen oder Terminvereinbarungen. Wir trainieren ihn mit Ihren Inhalten und verbinden ihn mit Ihrem Kalender. Dazu automatisieren wir interne Abläufe wie Berichte oder Rechnungsprüfung. Das Ergebnis: weniger Fehler, schnellere Bearbeitung." },
      { title: "WhatsApp-Marketing & CRM", text: "Reach your Kunden direkt über WhatsApp mit Angeboten, Erinnerungen und Umfragen. Wir koppeln den Messenger mit Ihrem CRM und erstellen Kampagnen mit klaren Erfolgskennzahlen. Sie sehen, wer geöffnet hat und was funktioniert. DSGVO-konform und unkompliziert – alles aus einer Hand." },
    ],
    localNote: "Dortmund liegt im Ruhrgebiet, Venlo ist nur etwa 150 Kilometer entfernt. Für viele Projekte kommen wir gern vorbei, dennoch ist remote-first unsere Basis. Das spart Ihnen Fahrtkosten und Planungsaufwand. Wir kommunizieren regelmäßig per Video, teilen Protokolle und arbeiten in gemeinsamen Projektmanagements. So bleiben Sie informiert, ohne dass es Sie Zeit kostet.",
    faqs: [
      { q: "Wie viel kostet ein KI-Chatbot in Dortmund?", a: "Ein Basis-Chatbot ist ab 2.500 Euro erhältlich, mit Integration in Ihre Systeme ab 5.000 Euro. Der Preis richtet sich nach Funktionen und Nachrichtenaufkommen. Sie bekommen eine monatliche Abrechnung ohne versteckte Kosten." },
      { q: "Wie lange dauert die Erstellung einer Website?", a: "Ein professioneller Webauftritt entsteht in 3 bis 5 Wochen, ein Webshop in 6 bis 9 Wochen. Währenddessen erhalten Sie Zwischenstände zur Freigabe. Ihre Mitwirkung beschleunigt den Prozess spürbar." },
      { q: "Was passiert mit den Daten, die der Chatbot sammelt?", a: "Die Daten werden ausschließlich für die Beantwortung Ihrer Kundenanfragen verwendet. Sie bleiben in der EU und werden nach Ablauf der gesetzlichen Fristen gelöscht. Sie haben jederzeit Zugriff auf alle Auswertungen." },
      { q: "Ist die Remote-Zusammenarbeit für uns geeignet?", a: "Ja, wir haben Prozesse entwickelt, die remote genauso reibungslos funktionieren: tägliche Updates, klare Tickets und ein Transparenz-Dashboard. Wenn Sie persönliche Treffen bevorzugen, sind wir gerne vor Ort in Dortmund – das ist im Festpreis enthalten." },
    ],
  },
  "hannover": {
    h1: "KI-Agentur Hannover — Websites, Apps & KI-Automatisierung",
    intro: "Hannoversche KMU aus Versicherung, Maschinenbau und Dienstleistung setzen auf unsere digitalen Lösungen. Wir bauen performante Websites, performante Apps und implementieren KI-Chatbots, die echte Arbeit abnehmen. Alles remote-first aus Venlo konzipiert und entwickelt – für Sie heißt das: Tagessatz 449 Euro, transparente Abrechnung und keine Standort-Nachteile. Wir verstehen lokale Besonderheiten, arbeiten ergebnisorientiert und halten Termine ein. Sie erhalten Code, der wartbar bleibt und Dokumentation, die verständlich ist.",
    services: [
      { title: "Website & Webshop", text: "Eine Website, die Besucher in Kunden verwandelt – das liefern wir für Hannoveraner Unternehmen. Wir gestalten responsiv, programmieren auf modernen Grundlagen und optimieren für Suchmaschinen. Egal ob Unternehmensauftritt oder Webshop mit Warenkorbfunktion: Wir setzen Ihre Anforderungen präzise um. Nach dem Launch schulen wir Ihr Team im Umgang mit dem System." },
      { title: "KI-Automatisierung & Chatbots", text: "KI-Chatbots für Versicherungsanfragen, Support-Tickets oder Produktberatung – wir machen das möglich. Unsere Automatisierungen übernehmen Datenabgleiche, Statusmeldungen und Erinnerungen. Damit sparen Sie Stunden pro Woche. Die Einrichtung ist unkompliziert, die Integration in Ihre bestehende Software verlustfrei. Sie behalten die Kontrolle über alle Abläufe." },
      { title: "WhatsApp-Marketing & CRM", text: "WhatsApp ist der meistgenutzte Messenger in Deutschland – nutzen Sie ihn für Ihre Kundenkommunikation. Wir verbinden ihn mit Ihrem CRM und versenden relevante Nachrichten automatisch. Zum Beispiel nach einem Kauf oder vor einem Termin. Das erhöht die Kundenzufriedenheit und bindet Ihre Zielgruppe langfristig." },
    ],
    localNote: "Hannover ist bekannt für seine Messe, aber unsere Zusammenarbeit findet digital statt. remote-first aus Venlo ermöglicht es uns, flexibel auf Ihre Anforderungen zu reagieren – ohne dass Sie auf persönliche Beratung verzichten. Wir nutzen Webinare, Videokonferenzen und ein gemeinsames Ticket-System. Bei Bedarf treffen wir uns zu Workshops in Hannover; das planen wir zeitig und transparent.",
    faqs: [
      { q: "Was kostet eine KI-Lösung bei einer Agentur in Hannover?", a: "Die Kosten hängen von Umfang, Datenanbindung und Individualisierung ab, typisch zwischen 5.000 und 50.000 Euro. Sie erhalten ein transparentes Festpreisangebot nach einem kostenlosen Erstgespräch. Wir definieren Meilensteine mit klaren Budgetgrenzen, damit keine versteckten Nachzahlungen entstehen." },
      { q: "Wie lange dauert die Entwicklung eines KI-Assistenten?", a: "Ein Prototyp ist meist nach zwei bis vier Wochen lauffähig, die Produktionsversion nach acht bis zwölf Wochen. Die Dauer richtet sich nach Datenqualität, Schnittstellen und gewünschten Funktionen. Wir liefern nach agiler Methode, sodass Sie früh erste Ergebnisse sehen und laufend steuern können." },
      { q: "Ist ein KI-Chatbot nach DSGVO für Unternehmen in Hannover zulässig?", a: "Ja, wenn Sie Hosting in der EU, verschlüsselte Übertragung und Löschkonzepte wählen. Wir implementieren Auftragsverarbeitung, Datenminimierung und Protokollierung gemäß Art. 28 DSGVO. Eine Datenschutz-Folgenabschätzung gehört bei personenbezogenen Daten zum Standard. Ihr Rechtsrahmen bleibt vollständig gewahrt." },
      { q: "Wie funktioniert Remote-Zusammenarbeit mit Ihrer Agentur aus Hannover?", a: "Wir arbeiten über strukturierte Sprint-Zyklen mit wöchentlichen Video-Reviews und einem gemeinsamen Aufgabenkanal. Alle Artefakte liegen in Ihrem System, Entscheidungen dokumentieren wir schriftlich. Für Workshops in Hannover sind wir präsent, die tägliche Zusammenarbeit läuft jedoch vollständig digital und asynchron." },
    ],
  },
};
export function getStadtContent(slug: string): StadtSeoContent | undefined {
  return stadtContent[slug];
}
