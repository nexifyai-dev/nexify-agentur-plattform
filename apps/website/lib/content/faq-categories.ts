// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/lib/content/faq-categories.ts
// NIR: 02.08.2026 09:55
// UPDATED: 02.08.2026 09:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Categorized FAQ Q&As (DE primary, NL/EN mirrors) for the website FAQ page.
// WHY: Drastic FAQ expansion for DACH SEO without inventing prices; reuse pricing-page language.
// BEST-PRACTICE: Single source for FAQPage JSON-LD flatten + UI categories with H2/H3.
// PITFALL: V-FAQ-01: Never invent euro amounts beyond published 449 € day rate / qualitative ranges.
// DEPENDS: Imported by lib/content/{de,nl,en}.ts
// DOCS-REF: design_guidelines.json · apps/website/app/faq/page.tsx
// SESSION: faq-expand-dach-7dd5

export type FaqItem = { q: string; a: string };
export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export function flattenFaqItems(categories: FaqCategory[]): FaqItem[] {
  return categories.flatMap((c) => c.items);
}

export const faqCategoriesDe: FaqCategory[] = [
  {
    id: "ueber-nexify",
    title: "Über NeXify AI",
    items: [
      {
        q: "Was ist NeXify AI?",
        a: "NeXify AI by NeXify — AUTOMATE IT. — ist die Marke für Premium-Websites, Onlineshops, Web-Apps und KI-Automatisierungen. Ein erfahrener Fachmann verantwortet Konzeption bis Übergabe; moderne AI-Werkzeuge beschleunigen Umsetzung und Prüfung. Zielmarkt ist der deutschsprachige DACH-Raum (DE/AT/CH), Sitz in Venlo (NL).",
      },
      {
        q: "Was unterscheidet NeXify AI von einer klassischen Agentur?",
        a: "Keine Abteilungsübergaben und kein Agentur-Overhead: ein Ansprechpartner steuert Strategie, Design, Entwicklung und QA. Dadurch kürzere Durchlaufzeiten und der transparente Tagessatz von 449 € netto. Details zu den Bausteinen finden Sie unter /leistungen.",
      },
      {
        q: "Was unterscheidet NeXify AI von reinen Self-Service-Tools?",
        a: "Website-Baukästen und Chatbots liefern Vorlagen ohne fachliche Verantwortung. NeXify AI liefert individuelle Systeme mit Scope-Klarheit, Tests, Dokumentation und Code-Eigentum beim Kunden — AI-gestützt, aber nie AI-abgegeben.",
      },
      {
        q: "Wer steckt hinter NeXify AI?",
        a: "Pascal Courbois — Deutscher aus der Grenzregion Limburg, seit über fünf Jahren in den Niederlanden. Mehr als 20 Jahre Praxis in IT, Kaufmannswesen und Vertrieb (u. a. Telekom Deutschland, Vodafone, Postcon). Beratung auf Deutsch und Niederländisch, ausschließlich B2B.",
      },
      {
        q: "Was bedeutet der Claim „AUTOMATE IT.“?",
        a: "Der Claim steht für den Kern des Angebots: wiederkehrende Prozesse, Angebote, Follow-ups und betriebsfähige Agenten — automatisiert mit Leitplanken, Freigaben und Protokollierung. Die Erstberatung übernimmt der NeXify AI Chat.",
      },
      {
        q: "Für welche Branchen arbeitet NeXify AI?",
        a: "Für KMU und mittelständische Organisationen im DACH-Raum und den Niederlanden — branchenübergreifend, sofern ein klarer Geschäftsnutzen und ein realistischer digitaler Scope bestehen. Keine Consumer-/Privatkunden-Projekte.",
      },
      {
        q: "Arbeitet NeXify ausschließlich B2B?",
        a: "Ja. Angebote und Verträge richten sich ausschließlich an Unternehmer, juristische Personen und vergleichbare beruflich handelnde Organisationen.",
      },
    ],
  },
  {
    id: "leistungen",
    title: "Leistungen & Angebot",
    items: [
      {
        q: "Welche Leistungen bietet NeXify AI an?",
        a: "Acht klar definierte Bausteine — u. a. Premium-Websites, Onlineshops, Web-Apps, AI-Automatisierung und Agenten — jeweils mit Zeitspanne, Ergebnissen und dem einheitlichen Tagessatz. Übersicht: /leistungen.",
      },
      {
        q: "Kann ich nur eine Website beauftragen — ohne Shop oder AI?",
        a: "Ja. Viele Projekte starten mit einer klar abgegrenzten Website (Richtwert oft 1–3 Arbeitstage). Erweiterungen zu Shop, App oder Automatisierung folgen erst, wenn der Nutzen belegt ist.",
      },
      {
        q: "Baut NeXify AI auch Onlineshops?",
        a: "Ja — mit Fokus auf Datenflüsse, Katalog, Checkout und Integrationen. Vor dem Start klären wir Stammdatenquellen, Bestände und angebundene Systeme. Aufwandsspanne und Scope stehen vor Umsetzung schriftlich.",
      },
      {
        q: "Was ist unter AI-Automatisierung zu verstehen?",
        a: "Produktionsreife Automatisierung von Beratung, Qualifizierung, Angeboten, Follow-ups oder internen Wissensprozessen — mit Rollen, Guardrails und Nachvollziehbarkeit. Keine Experimente ohne Abnahmekriterien.",
      },
      {
        q: "Können bestehende Systeme angebunden werden?",
        a: "Ja, über moderne APIs und geprüfte Integrationen (CRM, ERP, Mail, Zahlung, Datenbanken). Der Integrationsumfang gehört in den Scope — und damit in die Aufwandsspanne vor Projektstart.",
      },
      {
        q: "Erhalte ich Design und Markenauftritt mit?",
        a: "Jedes Projekt nutzt ein konsistentes Designsystem (Dark/Luxury-Linie der Marke oder Ihr Corporate Design). Visuelle Exzellenz ist Teil der Leistung — nicht optionaler Zusatz.",
      },
      {
        q: "Gibt es laufende Wartung oder Retainer?",
        a: "Auf Wunsch Weiterentwicklung, Wartung und Monitoring zum selben Tagessatz — ohne Bindung und ohne Mindestlaufzeit. Laufende Wartungsverträge sind separat buchbar und nicht automatisch im Projektpreis enthalten. Siehe /preise.",
      },
    ],
  },
  {
    id: "preise",
    title: "Preise & Abrechnung",
    items: [
      {
        q: "Was kostet ein Projekt bei NeXify AI?",
        a: "Es gilt ein fester Tagessatz von 449 € netto pro Arbeitstag. Der Gesamtaufwand ergibt sich aus der schriftlichen Aufwandsspanne in Arbeitstagen. Orientierung und Rechner: /preise.",
      },
      {
        q: "Sind 449 Euro pro Arbeitstag ein Festpreis?",
        a: "Der Tagessatz ist fest. Vor Beginn erhalten Sie eine belastbare Aufwandsspanne. Ein verbindlicher Gesamtfestpreis ist möglich, sobald Umfang, Inhalte, Integrationen und Abnahmekriterien eindeutig feststehen.",
      },
      {
        q: "Was ist in einem Arbeitstag enthalten?",
        a: "Bis zu acht planbare Fachstunden für Konzeption, Designsystem, Entwicklung, Integration, Tests und Dokumentation. Fremdkosten wie Hosting, Domains, Zahlungsanbieter, Lizenzen, Inhalte oder Stockmaterial sind nicht enthalten, sofern nicht ausdrücklich vereinbart.",
      },
      {
        q: "Warum ist der Gesamtpreis trotz Fachmann-Niveau so niedrig?",
        a: "Weil nicht mehrere Abteilungen, Übergaben und lange Agenturketten bezahlt werden. Ein erfahrener Ansprechpartner steuert den gesamten Prozess und nutzt AI-gestützte Werkzeuge sowie geprüfte Open-Source-Bausteine, um die Durchlaufzeit zu verkürzen.",
      },
      {
        q: "Gilt immer 21 Prozent BTW / Umsatzsteuer?",
        a: "Die Website zeigt den niederländischen Standardsatz von 21 Prozent als transparente Vergleichsrechnung. Bei grenzüberschreitenden B2B-Leistungen innerhalb der EU kann bei gültiger Umsatzsteuer-ID das Reverse-Charge-Verfahren gelten. Maßgeblich sind Rechnungsempfänger, Leistungsort und steuerliche Voraussetzungen.",
      },
      {
        q: "Wie kalkuliere ich grob die Investition?",
        a: "Wählen Sie auf /preise eine Leistung und die erwarteten Arbeitstage — der Rechner zeigt Netto, BTW-Vergleich und Brutto. Für eine verbindliche Spanne nutzen Sie Kontakt oder den Projekt-Planer auf derselben Seite.",
      },
      {
        q: "Gibt es versteckte Kosten?",
        a: "Nein im Tagessatz. Nicht enthalten (sofern nicht vereinbart) sind Hosting, Domains, Lizenzen, externe API-Kosten, Zahlungsanbieter-Gebühren, Stockmaterial und Content-Erstellung. Mehrbedarf wird vor Ausführung angezeigt — nie danach.",
      },
      {
        q: "Ist eine Ratenzahlung oder ein Abo-Modell möglich?",
        a: "Standard ist die Abrechnung nach Arbeitstagen bzw. vereinbartem Festpreisrahmen. Individuelle Zahlungsmodalitäten können im Angebot geregelt werden — ohne erfundene Listenpreise außerhalb des Tagessatzes.",
      },
    ],
  },
  {
    id: "ki-agenten",
    title: "KI, Agenten & Chat",
    items: [
      {
        q: "Welche Rolle spielt AI in der Entwicklung?",
        a: "NeXify arbeitet AI-gestützt. Moderne Werkzeuge unterstützen Recherche, Strukturierung, Codeerstellung, Tests und Dokumentation. Fachliche Entscheidungen, Verantwortung, Prüfung und Freigabe bleiben beim erfahrenen Entwickler.",
      },
      {
        q: "Was kann der NeXify AI Berater / Chat?",
        a: "NeXify AI ist der AI-Vertriebsagent dieser Website. Er berät auf Deutsch und Niederländisch, qualifiziert Anfragen, erstellt strukturierte unverbindliche Angebote und sendet sie per E-Mail — inklusive automatischem Nachfassen. Dieselbe Technologie bauen wir auch für Ihr Unternehmen.",
      },
      {
        q: "Ist der Chat ein einfacher FAQ-Bot?",
        a: "Nein. Ein klassischer Chatbot sucht Antworten; ein AI-Agent hat Rolle, Ziel und Werkzeuge: Portfolio kennen, Preise transparent vorrechnen, Qualifizierungsfragen stellen und Angebote strukturieren — mit Leitplanken gegen erfundene Zusagen.",
      },
      {
        q: "Können Sie einen ähnlichen AI-Berater für mein Unternehmen bauen?",
        a: "Ja — als Leistung unter AI-Agenten / Automatisierung. Typisch sind Wissenszugriff, Tool-Anbindung, Freigabestufen und Evaluation. Startpunkt: /leistungen und Erstgespräch über /kontakt.",
      },
      {
        q: "Wie unterscheidet sich NeXify AI von „nur ChatGPT nutzen“?",
        a: "ChatGPT ist ein allgemeines Sprachmodell ohne Ihr Betriebssystem, Ihre Datenhoheit und Ihre Abnahmeprozesse. NeXify AI liefert integrierte Lösungen: Design, Backend, Guardrails, Logging, DSGVO-bewusste Datenflüsse und einen verantwortlichen Ansprechpartner.",
      },
      {
        q: "Werden Kundendaten zum Training öffentlicher Modelle verwendet?",
        a: "Projektdaten und Gesprächsinhalte werden nicht als „Trainingsmaterial für die Öffentlichkeit“ freigegeben. Für AI-Integrationen gilt Datenminimierung, Zweckbindung und vertragliche Absicherung (AVV wo nötig). Details: /datenschutz und /ki-hinweise.",
      },
      {
        q: "Kann KI Buchungen oder Termine übernehmen?",
        a: "Ja, wenn klar definiert: verfügbare Slots, Bestätigung, Eskalation an Menschen und Protokollierung. Booking-Flows sind Teil individueller Automatisierung — nicht als Blackbox ohne Scope.",
      },
      {
        q: "Was passiert, wenn die KI unsicher ist oder falsch liegt?",
        a: "Guardrails, klare Preis- und Zusagelogik sowie menschliche Freigabe bei kritischen Schritten. Unsichere Fälle eskalieren an Pascal bzw. Ihr Team — AI beschleunigt, ersetzt aber keine Verantwortung.",
      },
    ],
  },
  {
    id: "datenschutz",
    title: "Datenschutz, DSGVO & Sicherheit",
    items: [
      {
        q: "Ist NeXify AI DSGVO-konform?",
        a: "Wir gestalten Datenflüsse nach Datenminimierung, Transparenz und Zweckbindung. Auftragsverarbeitung, Speicherorte und Löschfristen werden dokumentiert. Rechtstexte: /datenschutz, /avv, /ki-hinweise.",
      },
      {
        q: "Wo werden Daten gehostet?",
        a: "Je nach Architektur Vercel, Self-Hosting (z. B. Docker) oder EU-nahe Cloud-Dienste — Technologie folgt dem Betrieb. Ziel ist ein nachvollziehbarer, DSGVO-bewusster Betrieb ohne unnötige Drittlandtransfers.",
      },
      {
        q: "Schließen Sie Auftragsverarbeitungsverträge (AVV)?",
        a: "Ja, wo gesetzlich erforderlich. Eine AVV-Vorlage und Hinweise finden Sie unter /avv. Individuelle Regelungen gehören in die Vertragsunterlagen zum Projekt.",
      },
      {
        q: "Wie geht NeXify mit Sicherheit um?",
        a: "SSL, Security-Header, Hardening, klare Rollen/Berechtigungen und nachvollziehbare Integrationen. Sicherheit ist Teil von Betrieb & Plattform — siehe auch /plattform.",
      },
      {
        q: "Speichert der Website-Chat personenbezogene Daten?",
        a: "Nur soweit für Beratung, Angebot und Nachfassen erforderlich. Transparenzhinweise und Opt-outs sind Teil der rechtlichen Seiten. Details in /datenschutz und /ki-hinweise.",
      },
      {
        q: "Wer ist Eigentümer von Code und Daten nach dem Projekt?",
        a: "Sie. Code, Daten, Zugänge und Dokumentation gehören Ihnen — vollständig, ab Übergabe. Kein Vendor-Lock-in.",
      },
      {
        q: "Wie werden Secrets und Zugangsdaten gehandhabt?",
        a: "Über Umgebungsvariablen und getrennte Betriebsgeheimnisse — niemals im öffentlichen Code. Kunden erhalten die Betriebsinformationen, die sie für eigenen Betrieb oder Wechsel brauchen.",
      },
    ],
  },
  {
    id: "onboarding",
    title: "Onboarding, Dauer & Zielgruppe",
    items: [
      {
        q: "Wie kann eine vollständige Website in zwei bis drei Tagen entstehen?",
        a: "Nicht durch Weglassen von Qualität, sondern durch standardisierten Ablauf, wiederverwendbare Grundlagen, Designsystem und AI-gestützte Analyse-, Entwicklungs- und Prüfprozesse — unter persönlicher fachlicher Führung.",
      },
      {
        q: "Wie läuft das Onboarding ab?",
        a: "Kurz: Ziel und Nutzen klären → Konzept und Aufwandsspanne schriftlich → Umsetzung mit sichtbarem Fortschritt → Tests/Abnahme → Übergabe. Der Fünf-Schritt-Prozess steht unter /prozess.",
      },
      {
        q: "Wie schnell erhalte ich eine Antwort auf meine Anfrage?",
        a: "Innerhalb eines Werktags eine persönliche, qualifizierte Antwort — oft schneller. Alternativ berät der NeXify AI Chat sofort. Kontakt: /kontakt oder Rückruf unter /rueckruf.",
      },
      {
        q: "Für wen ist NeXify AI besonders geeignet?",
        a: "Für KMU und Entscheider im DACH-Raum, die Premium-Qualität ohne Agentur-Overhead wollen: klare Ziele, B2B, Bereitschaft zu schriftlichem Scope. Weniger geeignet: endlose Feature-Listen ohne Priorität oder Privatkunden.",
      },
      {
        q: "Was müssen wir als Kunde zuliefern?",
        a: "Ziele, Inhalte (Texte/Bilder soweit vorhanden), Zugänge zu bestehenden Systemen und zeitnahe Feedback-Schleifen. Je klarer die Zulieferung, desto belastbarer die Aufwandsspanne.",
      },
      {
        q: "Was passiert, wenn sich der Scope ändert?",
        a: "Mehrbedarf wird vor Ausführung sichtbar gemacht und freigegeben — nie als Überraschung danach. Das schützt Budget und Termin.",
      },
      {
        q: "Wie läuft die Zusammenarbeit nach dem Go-Live weiter?",
        a: "Sie erhalten Code, Dokumentation und Betriebshinweise vollständig. Auf Wunsch Weiterentwicklung und Monitoring zum selben Tagessatz — ohne Bindung.",
      },
    ],
  },
  {
    id: "technik",
    title: "Technik & Plattform",
    items: [
      {
        q: "Welche Technologien werden eingesetzt?",
        a: "Je nach Ziel u. a. Next.js, React, TypeScript, Supabase/PostgreSQL, moderne APIs, Vercel oder Self-Hosting. Technologie folgt dem Betrieb — nicht umgekehrt. Überblick: /plattform.",
      },
      {
        q: "Ist die Lösung SEO- und performance-tauglich?",
        a: "Ja — Server-Rendering, Core Web Vitals, strukturierte Daten (wo sinnvoll) und mobile Darstellung gehören zur Qualitätsprüfung vor Abnahme.",
      },
      {
        q: "Kann ich später die Agentur wechseln?",
        a: "Ja. Sie erhalten den vollständigen Quellcode und Dokumentation. Es gibt keinen Lock-in — Sie können woanders weiterentwickeln lassen.",
      },
      {
        q: "Unterstützen Sie Self-Hosting und EU-Betrieb?",
        a: "Ja, wenn es zum Betrieb passt (z. B. Docker-basierte Stacks). Die konkrete Hosting-Wahl ist Teil der Architekturentscheidung vor Umsetzung.",
      },
      {
        q: "Welche AI-Modelle oder Anbieter kommen zum Einsatz?",
        a: "Je nach Use-Case geprüfte Anbieter (z. B. gängige LLM-APIs) hinter klaren Guardrails. Die Auswahl folgt Datenschutz, Kostenkontrolle und Qualität — nicht dem Hype. Interne Infrastruktur-Details bleiben bewusst allgemein.",
      },
    ],
  },
  {
    id: "standort-dach",
    title: "Standort Venlo & Markt DACH",
    items: [
      {
        q: "Warum sitzt NeXify in Venlo (Niederlande)?",
        a: "Venlo liegt in der deutsch-niederländischen Grenzregion — ideal für DACH-Kunden und NL-Geschäft. Mehr zur lokalen Präsenz: /venlo.",
      },
      {
        q: "Ist der Zielmarkt Deutschland — trotz Sitz in den NL?",
        a: "Ja. Primärer Zielmarkt ist der deutschsprachige DACH-Raum; Venlo ist Sitz und Grenzstandort. Kommunikation und Angebote laufen bevorzugt auf Deutsch.",
      },
      {
        q: "Arbeiten Sie auch für Österreich und die Schweiz?",
        a: "Ja — B2B in DE, AT, CH und NL. Steuerliche Details (USt/Reverse Charge) hängen vom Rechnungsempfänger ab und werden im Angebot geklärt.",
      },
      {
        q: "In welchen Sprachen wird beraten?",
        a: "Deutsch und Niederländisch (Nederlands); Englisch bei Bedarf. Die Website ist DE-primär — NL als Locale für den Sitzmarkt.",
      },
      {
        q: "Sind Vor-Ort-Termine nötig?",
        a: "In der Regel nicht. Remote-Zusammenarbeit ist Standard; Grenzregion-Termine sind nach Absprache möglich.",
      },
    ],
  },
  {
    id: "vergleich",
    title: "Vergleich & Alternativen",
    items: [
      {
        q: "Warum nicht einfach nur ChatGPT für die Website nutzen?",
        a: "ChatGPT ersetzt weder Designsystem, Hosting, SEO, Formulare, Rechtstexte noch Abnahme und Betrieb. NeXify AI liefert ein fertiges, wartbares Produkt mit Verantwortung — optional mit ChatGPT-ähnlicher Beratung als Baustein.",
      },
      {
        q: "Warum nicht die günstigste No-Code-Plattform?",
        a: "No-Code ist oft schnell am Anfang und teuer bei Integrationen, SEO-Feinschliff und Exit. Bei NeXify AI gehören Code-Eigentum und Wechselbarkeit zum Prinzip.",
      },
      {
        q: "Warum nicht eine große Full-Service-Agentur?",
        a: "Große Agenturen bringen Kapazität — und oft Übergaben, längere Laufzeiten und höheren Overhead. NeXify AI optimiert auf Tempo, Transparenz (449 €/Tag) und einen Entscheider-Pfad.",
      },
      {
        q: "Kann ich NeXify AI mit meinem internen IT-Team kombinieren?",
        a: "Ja. Häufiges Modell: NeXify liefert MVP oder kritische Strecke, Ihr Team übernimmt Betrieb oder Weiterentwicklung anhand der Dokumentation.",
      },
      {
        q: "Gibt es Garantien für Umsatzsteigerung durch AI?",
        a: "Nein — seriös nicht. Wir liefern messbare Umsetzung, klare Annahmen und nachvollziehbare Qualifizierung. Geschäftserfolg hängt von Markt, Angebot und Vertrieb ab.",
      },
    ],
  },
  {
    id: "kontakt-weiteres",
    title: "Kontakt, Wissen & Nächste Schritte",
    items: [
      {
        q: "Wie starte ich ein Projekt?",
        a: "Nutzen Sie /kontakt für eine persönliche Einschätzung, den Chat für Sofort-Orientierung, /rueckruf für einen Rückruf oder den Projekt-Planer auf /preise für eine erste Aufwandsskizze.",
      },
      {
        q: "Wo finde ich Fachartikel und Hintergründe?",
        a: "Unter /wissen — u. a. zu KI-Automatisierung für KMU, Web-App-Kosten und DSGVO-Checklisten. (Ein separates /blog gibt es nicht; Wissen ist der redaktionelle Kanal.)",
      },
      {
        q: "Kann ich Referenzen sehen?",
        a: "Vertrauliche Kundenprojekte werden nicht ungefragt veröffentlicht. Im Erstgespräch sprechen wir über vergleichbare Projekte. Öffentliche Eindrücke: /referenzen.",
      },
      {
        q: "Meine Frage steht nicht in der FAQ — was nun?",
        a: "Schreiben Sie über /kontakt oder fragen Sie den NeXify AI Chat. Sie erhalten innerhalb eines Werktags eine ehrliche Einschätzung — auch wenn die Antwort „nicht sinnvoll“ lautet.",
      },
      {
        q: "Wo finde ich Impressum und rechtliche Hinweise?",
        a: "Impressum, Datenschutz, AGB, AVV, Widerruf, Cookie-Richtlinie und KI-Hinweise sind verlinkt in der Fußzeile — u. a. /impressum und /datenschutz.",
      },
    ],
  },
];

export const faqCategoriesNl: FaqCategory[] = [
  {
    id: "ueber-nexify",
    title: "Over NeXify AI",
    items: [
      {
        q: "Wat is NeXify AI?",
        a: "NeXify AI by NeXify — AUTOMATE IT. — is het merk voor premium websites, webshops, webapps en AI-automatisering. Eén ervaren vakman verantwoordt van concept tot overdracht; moderne AI-tools versnellen uitvoering en controle. Doelmarkt is DACH (DE/AT/CH), vestiging in Venlo (NL).",
      },
      {
        q: "Wat onderscheidt NeXify AI van een klassiek bureau?",
        a: "Geen afdelingsoverdrachten en geen bureau-overhead: één aanspreekpunt stuurt strategie, design, ontwikkeling en QA. Zo kortere doorlooptijden en het transparante dagtarief van € 449 netto. Details: /leistungen.",
      },
      {
        q: "Wat onderscheidt NeXify AI van pure selfservice-tools?",
        a: "Websitebouwers en chatbots leveren sjablonen zonder vakverantwoordelijkheid. NeXify AI levert individuele systemen met scope-duidelijkheid, tests, documentatie en code-eigendom bij de klant — AI-ondersteund, nooit AI-afgegeven.",
      },
      {
        q: "Wie zit er achter NeXify AI?",
        a: "Pascal Courbois — Duitser uit de grensregio Limburg, al ruim vijf jaar in Nederland. Meer dan 20 jaar praktijk in IT, commercie en sales. Advies in het Duits en Nederlands, uitsluitend B2B.",
      },
      {
        q: "Wat betekent „AUTOMATE IT.“?",
        a: "De claim staat voor de kern van het aanbod: terugkerende processen, offertes, follow-ups en productieklare agenten — geautomatiseerd met guardrails, goedkeuringen en logging. Het eerste advies geeft de NeXify AI-chat.",
      },
      {
        q: "Voor welke branches werkt NeXify AI?",
        a: "Voor kmo’s en midmarket in DACH en Nederland — brancheoverstijgend, zolang er duidelijk bedrijfsnut en een realistische digitale scope is. Geen consumenten-/particuliere projecten.",
      },
      {
        q: "Werkt NeXify uitsluitend B2B?",
        a: "Ja. Offertes en contracten richten zich uitsluitend op ondernemers, rechtspersonen en vergelijkbare beroepsmatig handelende organisaties.",
      },
    ],
  },
  {
    id: "leistungen",
    title: "Diensten & aanbod",
    items: [
      {
        q: "Welke diensten biedt NeXify AI?",
        a: "Acht heldere bouwstenen — o.a. premium websites, webshops, webapps, AI-automatisering en agenten — elk met tijdspanne, resultaten en hetzelfde dagtarief. Overzicht: /leistungen.",
      },
      {
        q: "Kan ik alleen een website laten bouwen — zonder shop of AI?",
        a: "Ja. Veel projecten starten met een scherp begrensde website (richtlijn vaak 1–3 werkdagen). Uitbreidingen volgen pas als het nut bewezen is.",
      },
      {
        q: "Bouwt NeXify AI ook webshops?",
        a: "Ja — met focus op dataflows, catalogus, checkout en integraties. Vooraf stemmen we stamgegevens, voorraad en gekoppelde systemen af.",
      },
      {
        q: "Wat is AI-automatisering hier?",
        a: "Productierijpe automatisering van advies, kwalificatie, offertes, follow-ups of interne kennisprocessen — met rollen, guardrails en traceerbaarheid.",
      },
      {
        q: "Kunnen bestaande systemen worden gekoppeld?",
        a: "Ja, via moderne API’s (CRM, ERP, mail, betaling, databases). Integratie-omvang hoort in de scope vóór de start.",
      },
      {
        q: "Krijg ik design en merkuitstraling mee?",
        a: "Elk project gebruikt een consistent designsysteem (Dark/Luxury of uw huisstijl). Visuele excellentie hoort bij de dienst.",
      },
      {
        q: "Is er doorlopend onderhoud of een retainer?",
        a: "Op verzoek doorontwikkeling, onderhoud en monitoring tegen hetzelfde dagtarief — zonder binding. Zie /preise.",
      },
    ],
  },
  {
    id: "preise",
    title: "Prijzen & facturatie",
    items: [
      {
        q: "Wat kost een project bij NeXify AI?",
        a: "Vast dagtarief van € 449 netto per werkdag. Totale inzet volgt uit de schriftelijke raming in werkdagen. Oriëntatie: /preise.",
      },
      {
        q: "Is € 449 per werkdag een vaste prijs?",
        a: "Het dagtarief staat vast. Vóór de start ontvangt u een betrouwbare raming. Een bindende totaalprijs kan zodra scope, content, integraties en acceptatiecriteria eenduidig zijn.",
      },
      {
        q: "Wat is inbegrepen in een werkdag?",
        a: "Maximaal acht planbare vakuren voor concept, designsysteem, ontwikkeling, integratie, tests en documentatie. Externe kosten (hosting, domeinen, betaalproviders, licenties, content, stock) niet inbegrepen tenzij overeengekomen.",
      },
      {
        q: "Waarom is de totaalprijs ondanks vakman-niveau zo laag?",
        a: "Omdat u geen meerdere afdelingen en lange bureauketens betaalt. Eén ervaren aanspreekpunt stuurt het proces en gebruikt AI-tools plus beproefde open-source componenten.",
      },
      {
        q: "Geldt altijd 21 procent btw?",
        a: "De site toont 21 % als transparante NL-vergelijking. Bij grensoverschrijdende B2B binnen de EU kan met geldig btw-nummer de verleggingsregeling gelden.",
      },
      {
        q: "Hoe schat ik de investering grof?",
        a: "Kies op /preise een dienst en werkdagen — de rekenhulp toont netto/btw/bruto. Voor een bindende bandbreedte: contact of de projectplanner op dezelfde pagina.",
      },
      {
        q: "Zijn er verborgen kosten?",
        a: "Niet in het dagtarief. Hosting, domeinen, licenties, API-kosten, betaalfees, stock en content zijn niet inbegrepen tenzij afgesproken. Meerwerk wordt vóór uitvoering getoond.",
      },
      {
        q: "Is gespreide betaling of abonnement mogelijk?",
        a: "Standaard is afrekening per werkdag of overeengekomen vaste kaderprijs. Individuele modaliteiten kunnen in de offerte — zonder verzonnen lijstprijzen buiten het dagtarief.",
      },
    ],
  },
  {
    id: "ki-agenten",
    title: "AI, agenten & chat",
    items: [
      {
        q: "Welke rol speelt AI in de ontwikkeling?",
        a: "NeXify werkt AI-ondersteund. Tools helpen bij onderzoek, structuur, code, tests en documentatie. Beslissingen, verantwoordelijkheid en goedkeuring blijven bij de ervaren ontwikkelaar.",
      },
      {
        q: "Wat kan de NeXify AI-adviseur / chat?",
        a: "De AI-salesagent van deze site adviseert in Duits en Nederlands, kwalificeert aanvragen, maakt vrijblijvende offertes en mailt ze — inclusief opvolging. Dezelfde technologie bouwen wij voor uw bedrijf.",
      },
      {
        q: "Is de chat een simpele FAQ-bot?",
        a: "Nee. Een agent heeft rol, doel en tools: portfolio kennen, prijzen voorrekenen, kwalificeren en offertes structureren — met guardrails tegen verzonnen toezeggingen.",
      },
      {
        q: "Kunnen jullie een vergelijkbare AI-adviseur voor mijn bedrijf bouwen?",
        a: "Ja — als dienst onder AI-agenten/automatisering. Start: /leistungen en /kontakt.",
      },
      {
        q: "Hoe verschilt NeXify AI van „alleen ChatGPT“?",
        a: "ChatGPT is een algemeen model zonder uw bedrijfsstack, datahouderschap en acceptatieprocessen. NeXify AI levert geïntegreerde oplossingen met verantwoordelijk aanspreekpunt.",
      },
      {
        q: "Worden klantdata gebruikt om publieke modellen te trainen?",
        a: "Project- en gespreksdata worden niet vrijgegeven als publiek trainingsmateriaal. Voor AI-integraties gelden dataminimalisatie en AV waar nodig. Zie /datenschutz en /ki-hinweise.",
      },
      {
        q: "Kan AI boekingen of afspraken overnemen?",
        a: "Ja, als slots, bevestiging, escalatie naar mensen en logging helder zijn gedefinieerd.",
      },
      {
        q: "Wat als de AI onzeker of fout is?",
        a: "Guardrails, duidelijke prijs-/toezeggingslogica en menselijke goedkeuring bij kritieke stappen. Onzekere gevallen escaleren naar Pascal of uw team.",
      },
    ],
  },
  {
    id: "datenschutz",
    title: "Privacy, AVG & security",
    items: [
      {
        q: "Is NeXify AI AVG-/DSGVO-proof?",
        a: "We ontwerpen dataflows met minimalisatie, transparantie en doelbinding. AV, opslaglocaties en bewaartermijnen worden gedocumenteerd. Zie /datenschutz, /avv, /ki-hinweise.",
      },
      {
        q: "Waar worden data gehost?",
        a: "Afhankelijk van architectuur: Vercel, self-hosting of EU-nahe cloud. Doel is traceerbare, AVG-bewuste exploitatie.",
      },
      {
        q: "Sluiten jullie verwerkersovereenkomsten (AV)?",
        a: "Ja, waar wettelijk nodig. Zie /avv; projectafspraken staan in de contractstukken.",
      },
      {
        q: "Hoe zit het met security?",
        a: "SSL, security headers, hardening, rollen/rechten en traceerbare integraties. Zie /plattform.",
      },
      {
        q: "Slaat de website-chat persoonsgegevens op?",
        a: "Alleen voor zover nodig voor advies, offerte en opvolging. Details in /datenschutz en /ki-hinweise.",
      },
      {
        q: "Wie is eigenaar van code en data na het project?",
        a: "U. Code, data, toegangen en documentatie zijn van u — volledig bij overdracht. Geen lock-in.",
      },
      {
        q: "Hoe gaan jullie om met secrets en credentials?",
        a: "Via omgevingsvariabelen en gescheiden bedrijfsgeheimen — nooit in publieke code.",
      },
    ],
  },
  {
    id: "onboarding",
    title: "Onboarding, doorlooptijd & doelgroep",
    items: [
      {
        q: "Hoe kan een complete website in twee tot drie dagen ontstaan?",
        a: "Niet door kwaliteit weg te laten, maar door gestandaardiseerd proces, herbruikbare fundamenten, designsysteem en AI-ondersteunde analyse/ontwikkeling/controle — onder persoonlijke vakleiding.",
      },
      {
        q: "Hoe verloopt onboarding?",
        a: "Doel & nut → schriftelijke scope/raming → uitvoering met zichtbare voortgang → tests/acceptatie → overdracht. Zie /prozess.",
      },
      {
        q: "Hoe snel krijg ik antwoord?",
        a: "Binnen één werkdag een persoonlijk, gekwalificeerd antwoord — vaak sneller. Alternatief: NeXify AI-chat. Contact: /kontakt of /rueckruf.",
      },
      {
        q: "Voor wie is NeXify AI geschikt?",
        a: "Voor kmo’s en beslissers in DACH die premium kwaliteit zonder bureau-overhead willen. Minder geschikt: eindeloze featurelijsten zonder prioriteit of particulieren.",
      },
      {
        q: "Wat moeten wij als klant aanleveren?",
        a: "Doelen, content, toegangen tot bestaande systemen en snelle feedback. Hoe helderder de input, hoe betrouwbaarder de raming.",
      },
      {
        q: "Wat als de scope wijzigt?",
        a: "Meerwerk wordt vóór uitvoering zichtbaar gemaakt en goedgekeurd — nooit als verrassing achteraf.",
      },
      {
        q: "Hoe gaat samenwerking na livegang verder?",
        a: "U ontvangt code, documentatie en beheerinfo volledig. Op verzoek doorontwikkeling/monitoring tegen hetzelfde dagtarief — zonder binding.",
      },
    ],
  },
  {
    id: "technik",
    title: "Techniek & platform",
    items: [
      {
        q: "Welke technologieën worden ingezet?",
        a: "O.a. Next.js, React, TypeScript, Supabase/PostgreSQL, moderne API’s, Vercel of self-hosting. Technologie volgt het bedrijf. Overzicht: /plattform.",
      },
      {
        q: "Is de oplossing SEO- en performance-geschikt?",
        a: "Ja — server rendering, Core Web Vitals, structured data waar zinvol, en mobile checks horen bij acceptatie.",
      },
      {
        q: "Kan ik later van bureau wisselen?",
        a: "Ja. U krijgt volledige broncode en documentatie. Geen lock-in.",
      },
      {
        q: "Ondersteunen jullie self-hosting en EU-exploitatie?",
        a: "Ja, als dat past bij de exploitatie. Hostingkeuze is onderdeel van de architectuur vóór start.",
      },
      {
        q: "Welke AI-modellen of providers?",
        a: "Afhankelijk van use-case beproefde LLM-API’s achter guardrails. Keuze volgt privacy, kosten en kwaliteit — geen hype. Interne infra blijft bewust algemeen.",
      },
    ],
  },
  {
    id: "standort-dach",
    title: "Locatie Venlo & markt DACH",
    items: [
      {
        q: "Waarom Venlo (Nederland)?",
        a: "Venlo ligt in de Duits-Nederlandse grensregio — ideaal voor DACH-klanten en NL-zaken. Meer: /venlo.",
      },
      {
        q: "Is de doelmarkt Duitsland — ondanks NL-vestiging?",
        a: "Ja. Primair DACH; Venlo is vestiging/grenslocatie. Communicatie bij voorkeur in het Duits.",
      },
      {
        q: "Werken jullie ook voor Oostenrijk en Zwitserland?",
        a: "Ja — B2B in DE, AT, CH en NL. Fiscale details worden in de offerte geklaard.",
      },
      {
        q: "In welke talen wordt geadviseerd?",
        a: "Duits en Nederlands; Engels indien nodig. Website is DE-primair — NL als locale voor de vestigingsmarkt.",
      },
      {
        q: "Zijn fysieke afspraken nodig?",
        a: "Meestal niet. Remote is standaard; grensregio-afspraken op verzoek.",
      },
    ],
  },
  {
    id: "vergleich",
    title: "Vergelijking & alternatieven",
    items: [
      {
        q: "Waarom niet alleen ChatGPT voor de website?",
        a: "ChatGPT vervangt geen designsysteem, hosting, SEO, formulieren, juridische pagina’s of acceptatie. NeXify AI levert een af product met verantwoordelijkheid.",
      },
      {
        q: "Waarom niet de goedkoopste no-code?",
        a: "No-code is vaak snel start, duur bij integraties en exit. Bij NeXify AI horen code-eigendom en wisselbaarheid bij het principe.",
      },
      {
        q: "Waarom niet een groot fullservicebureau?",
        a: "Grote bureaus brengen capaciteit — en vaak overdrachten, langere looptijden en meer overhead. NeXify AI optimaliseert op tempo, transparantie (€ 449/dag) en één beslisser.",
      },
      {
        q: "Kan NeXify AI met ons interne IT-team?",
        a: "Ja. Vaak: NeXify levert MVP of kritieke flow; uw team neemt beheer/doorontwikkeling over via de documentatie.",
      },
      {
        q: "Garanderen jullie omzetgroei door AI?",
        a: "Nee — serieus niet. Wij leveren meetbare uitvoering en heldere aannames. Resultaat hangt af van markt, aanbod en sales.",
      },
    ],
  },
  {
    id: "kontakt-weiteres",
    title: "Contact, kennis & volgende stappen",
    items: [
      {
        q: "Hoe start ik een project?",
        a: "Gebruik /kontakt, de chat, /rueckruf of de projectplanner op /preise.",
      },
      {
        q: "Waar vind ik artikelen en achtergrond?",
        a: "Onder /wissen. Er is geen apart /blog; Wissen is het redactionele kanaal.",
      },
      {
        q: "Kan ik referenties zien?",
        a: "Vertrouwelijke projecten publiceren we niet ongevraagd. In het kennismakingsgesprek bespreken we vergelijkbare cases. Zie /referenzen.",
      },
      {
        q: "Mijn vraag staat niet in de FAQ — wat nu?",
        a: "Schrijf via /kontakt of vraag de NeXify AI-chat. Binnen één werkdag een eerlijk antwoord — ook als dat „niet zinvol“ is.",
      },
      {
        q: "Waar vind ik impressum en juridische info?",
        a: "In de footer — o.a. /impressum en /datenschutz.",
      },
    ],
  },
];

export const faqCategoriesEn: FaqCategory[] = [
  {
    id: "ueber-nexify",
    title: "About NeXify AI",
    items: [
      {
        q: "What is NeXify AI?",
        a: "NeXify AI by NeXify — AUTOMATE IT. — is the brand for premium websites, online shops, web apps and AI automation. One experienced professional owns concept through handover; modern AI tools accelerate delivery and review. Primary market: German-speaking DACH; office in Venlo (NL).",
      },
      {
        q: "How does NeXify AI differ from a classic agency?",
        a: "No departmental handovers and no agency overhead: one contact steers strategy, design, development and QA. That yields shorter lead times and the transparent daily rate of €449 net. See /leistungen.",
      },
      {
        q: "How does NeXify AI differ from pure self-service tools?",
        a: "Builders and chatbots ship templates without professional accountability. NeXify AI delivers individual systems with scope clarity, tests, documentation and customer-owned code — AI-assisted, never AI-abdicated.",
      },
      {
        q: "Who is behind NeXify AI?",
        a: "Pascal Courbois — German from the Limburg border region, based in the Netherlands for 5+ years. 20+ years in IT, commerce and sales. Advice in German and Dutch, B2B only.",
      },
      {
        q: "What does “AUTOMATE IT.” mean?",
        a: "Chat: first advice and qualification via the NeXify AI chat plus clear communication. Automate: recurring processes, quotes, follow-ups and production-ready agents — with guardrails, approvals and logging.",
      },
      {
        q: "Which industries does NeXify AI serve?",
        a: "SMEs and mid-market organisations in DACH and the Netherlands — cross-industry when business value and a realistic digital scope exist. No consumer/private projects.",
      },
      {
        q: "Does NeXify work exclusively B2B?",
        a: "Yes. Quotations and contracts are for entrepreneurs, legal entities and comparable professional organisations only.",
      },
    ],
  },
  {
    id: "leistungen",
    title: "Services & offering",
    items: [
      {
        q: "Which services does NeXify AI offer?",
        a: "Eight defined building blocks — including premium websites, shops, web apps, AI automation and agents — each with time span, outcomes and the same daily rate. Overview: /leistungen.",
      },
      {
        q: "Can I commission only a website — without shop or AI?",
        a: "Yes. Many projects start with a tightly scoped website (often a 1–3 working-day guideline). Extensions follow once value is proven.",
      },
      {
        q: "Does NeXify AI also build online shops?",
        a: "Yes — focused on data flows, catalogue, checkout and integrations. Master data, stock and connected systems are clarified before start.",
      },
      {
        q: "What does AI automation mean here?",
        a: "Production-ready automation of advice, qualification, quotes, follow-ups or internal knowledge work — with roles, guardrails and traceability.",
      },
      {
        q: "Can existing systems be integrated?",
        a: "Yes, via modern APIs (CRM, ERP, mail, payments, databases). Integration scope belongs in the written effort range before start.",
      },
      {
        q: "Do I get design and brand presentation included?",
        a: "Every project uses a consistent design system (Dark/Luxury brand line or your corporate design). Visual excellence is part of the service.",
      },
      {
        q: "Is ongoing maintenance or a retainer available?",
        a: "On request: further development, maintenance and monitoring at the same daily rate — no lock-in. See /preise.",
      },
    ],
  },
  {
    id: "preise",
    title: "Pricing & billing",
    items: [
      {
        q: "What does a project cost at NeXify AI?",
        a: "A fixed daily rate of €449 net per working day. Total effort follows the written range in working days. Guidance: /preise.",
      },
      {
        q: "Is €449 per working day a fixed price?",
        a: "The daily rate is fixed. Before starting you receive a reliable effort range. A binding fixed total is possible once scope, content, integrations and acceptance criteria are clear.",
      },
      {
        q: "What is included in a working day?",
        a: "Up to eight plannable specialist hours for concept, design system, development, integration, testing and documentation. External costs (hosting, domains, payment providers, licences, content, stock) are excluded unless agreed.",
      },
      {
        q: "Why is the total still low despite specialist quality?",
        a: "Because you are not paying multiple departments and long agency chains. One experienced contact steers the process and uses AI-assisted tools plus proven open-source components.",
      },
      {
        q: "Does 21% VAT always apply?",
        a: "The site shows the Dutch 21% standard as a transparent comparison. For cross-border B2B within the EU, reverse charge may apply with a valid VAT ID.",
      },
      {
        q: "How do I roughly estimate investment?",
        a: "On /preise pick a service and working days — the calculator shows net/VAT/gross. For a binding range use contact or the project planner on the same page.",
      },
      {
        q: "Are there hidden costs?",
        a: "Not in the daily rate. Hosting, domains, licences, API costs, payment fees, stock and content are excluded unless agreed. Extra work is shown before execution.",
      },
      {
        q: "Is instalment payment or a subscription possible?",
        a: "Standard is billing by working days or an agreed fixed framework. Individual payment terms can be set in the quote — without inventing list prices beyond the daily rate.",
      },
    ],
  },
  {
    id: "ki-agenten",
    title: "AI, agents & chat",
    items: [
      {
        q: "What role does AI play in development?",
        a: "NeXify works AI-assisted. Tools support research, structuring, coding, testing and documentation. Decisions, accountability and approval stay with the experienced developer.",
      },
      {
        q: "What can the NeXify AI advisor / chat do?",
        a: "It is the AI sales agent of this website: advises in German and Dutch, qualifies enquiries, creates structured non-binding quotations and emails them — including follow-up. We build the same technology for your business.",
      },
      {
        q: "Is the chat a simple FAQ bot?",
        a: "No. An agent has a role, a goal and tools: know the portfolio, calculate prices transparently, qualify and structure quotes — with guardrails against invented promises.",
      },
      {
        q: "Can you build a similar AI advisor for my company?",
        a: "Yes — under AI agents / automation. Start via /leistungen and /kontakt.",
      },
      {
        q: "How does NeXify AI differ from “just using ChatGPT”?",
        a: "ChatGPT is a general model without your operating stack, data ownership and acceptance processes. NeXify AI delivers integrated solutions with an accountable human owner.",
      },
      {
        q: "Is customer data used to train public models?",
        a: "Project and conversation data are not released as public training material. AI integrations follow data minimisation and DPAs where required. See /datenschutz and /ki-hinweise.",
      },
      {
        q: "Can AI handle bookings or appointments?",
        a: "Yes when slots, confirmation, human escalation and logging are clearly defined.",
      },
      {
        q: "What if the AI is unsure or wrong?",
        a: "Guardrails, clear pricing/promise logic and human approval on critical steps. Uncertain cases escalate to Pascal or your team.",
      },
    ],
  },
  {
    id: "datenschutz",
    title: "Privacy, GDPR & security",
    items: [
      {
        q: "Is NeXify AI GDPR-compliant?",
        a: "We design data flows for minimisation, transparency and purpose limitation. Processing agreements, storage locations and retention are documented. See /datenschutz, /avv, /ki-hinweise.",
      },
      {
        q: "Where is data hosted?",
        a: "Depending on architecture: Vercel, self-hosting or EU-near cloud. Goal: traceable, GDPR-aware operations.",
      },
      {
        q: "Do you sign data processing agreements (DPA/AVV)?",
        a: "Yes where legally required. See /avv; project specifics go into the contract pack.",
      },
      {
        q: "How does NeXify handle security?",
        a: "SSL, security headers, hardening, roles/permissions and traceable integrations. See /plattform.",
      },
      {
        q: "Does the website chat store personal data?",
        a: "Only as needed for advice, quotation and follow-up. Details in /datenschutz and /ki-hinweise.",
      },
      {
        q: "Who owns code and data after the project?",
        a: "You. Code, data, access and documentation are yours at handover. No vendor lock-in.",
      },
      {
        q: "How are secrets and credentials handled?",
        a: "Via environment variables and separated operational secrets — never in public code.",
      },
    ],
  },
  {
    id: "onboarding",
    title: "Onboarding, timeline & audience",
    items: [
      {
        q: "How can a full website be delivered in two to three days?",
        a: "Not by cutting quality, but via a standardised process, reusable foundations, a design system and AI-assisted analysis, build and review — under personal professional leadership.",
      },
      {
        q: "How does onboarding work?",
        a: "Goals & value → written scope/effort → delivery with visible progress → tests/acceptance → handover. See /prozess.",
      },
      {
        q: "How fast do I get a reply?",
        a: "Within one working day a personal, qualified reply — often sooner. Alternatively use the NeXify AI chat. Contact: /kontakt or /rueckruf.",
      },
      {
        q: "Who is NeXify AI best for?",
        a: "SMEs and decision-makers in DACH who want premium quality without agency overhead. Less suitable: endless feature lists without priority, or private individuals.",
      },
      {
        q: "What must we as the client provide?",
        a: "Goals, content, access to existing systems and timely feedback. Clearer input means a more reliable effort range.",
      },
      {
        q: "What if scope changes?",
        a: "Extra work is made visible and approved before execution — never as a surprise afterwards.",
      },
      {
        q: "How does collaboration continue after go-live?",
        a: "You receive code, documentation and ops notes fully. On request: further development and monitoring at the same daily rate — no lock-in.",
      },
    ],
  },
  {
    id: "technik",
    title: "Technology & platform",
    items: [
      {
        q: "Which technologies are used?",
        a: "Depending on goals: Next.js, React, TypeScript, Supabase/PostgreSQL, modern APIs, Vercel or self-hosting. Technology follows operations. Overview: /plattform.",
      },
      {
        q: "Is the solution SEO- and performance-ready?",
        a: "Yes — server rendering, Core Web Vitals, structured data where useful, and mobile checks are part of acceptance.",
      },
      {
        q: "Can I switch agencies later?",
        a: "Yes. You receive full source code and documentation. No lock-in.",
      },
      {
        q: "Do you support self-hosting and EU operations?",
        a: "Yes when it fits operations. Hosting choice is part of architecture before build.",
      },
      {
        q: "Which AI models or providers are used?",
        a: "Proven LLM APIs behind guardrails, chosen for privacy, cost control and quality — not hype. Internal infra details stay intentionally high-level.",
      },
    ],
  },
  {
    id: "standort-dach",
    title: "Venlo office & DACH market",
    items: [
      {
        q: "Why is NeXify based in Venlo (Netherlands)?",
        a: "Venlo sits in the German–Dutch border region — ideal for DACH clients and NL business. More: /venlo.",
      },
      {
        q: "Is the target market Germany despite an NL seat?",
        a: "Yes. Primary market is German-speaking DACH; Venlo is the seat/border base. Communication preferably in German.",
      },
      {
        q: "Do you also work for Austria and Switzerland?",
        a: "Yes — B2B in DE, AT, CH and NL. Tax details are clarified in the quote.",
      },
      {
        q: "Which languages are used for advice?",
        a: "German and Dutch; English if needed. The site is DE-primary — NL as locale for the seat market.",
      },
      {
        q: "Are on-site meetings required?",
        a: "Usually not. Remote is standard; border-region meetings by arrangement.",
      },
    ],
  },
  {
    id: "vergleich",
    title: "Comparison & alternatives",
    items: [
      {
        q: "Why not just use ChatGPT for the website?",
        a: "ChatGPT replaces neither design system, hosting, SEO, forms, legal pages nor acceptance and operations. NeXify AI delivers a finished, maintainable product with accountability.",
      },
      {
        q: "Why not the cheapest no-code platform?",
        a: "No-code is often fast at the start and costly for integrations and exit. At NeXify AI, code ownership and portability are principles.",
      },
      {
        q: "Why not a large full-service agency?",
        a: "Large agencies bring capacity — and often handovers, longer timelines and higher overhead. NeXify AI optimises for speed, transparency (€449/day) and a single decision path.",
      },
      {
        q: "Can NeXify AI combine with our internal IT team?",
        a: "Yes. Common model: NeXify delivers the MVP or critical path; your team takes over ops or further development using the documentation.",
      },
      {
        q: "Do you guarantee revenue growth from AI?",
        a: "No — not seriously. We deliver measurable implementation and clear assumptions. Outcomes depend on market, offer and sales.",
      },
    ],
  },
  {
    id: "kontakt-weiteres",
    title: "Contact, knowledge & next steps",
    items: [
      {
        q: "How do I start a project?",
        a: "Use /kontakt, the chat, /rueckruf, or the project planner on /preise.",
      },
      {
        q: "Where can I find articles and background?",
        a: "Under /wissen. There is no separate /blog; Wissen is the editorial channel.",
      },
      {
        q: "Can I see references?",
        a: "Confidential client work is not published unsolicited. In a first call we discuss comparable projects. See /referenzen.",
      },
      {
        q: "My question is not in the FAQ — what now?",
        a: "Write via /kontakt or ask the NeXify AI chat. Within one working day you get an honest assessment — even if the answer is “not sensible”.",
      },
      {
        q: "Where are imprint and legal notices?",
        a: "In the footer — including /impressum and /datenschutz.",
      },
    ],
  },
];
