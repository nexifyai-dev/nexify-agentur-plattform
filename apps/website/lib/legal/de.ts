// FILE: apps/website/lib/legal/de.ts
// UPDATED: 02.08.2026 10:00
// WHAT: Deutsche Rechtstexte (Impressum, Datenschutz, AGB, AVV, Widerruf, Cookies, KI-Hinweise)
// WHY: Production-grade Best-Practice-Templates; keine erfundenen Stammdaten
// PITFALL: Fehlende Fakten als [BITTE ERGÄNZEN]

export type LegalSubsection = {
  id?: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalSection = {
  id?: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: LegalSubsection[];
};

export type LegalRelatedLink = { label: string; href: string };

export type LegalPageData = {
  slug: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  related?: LegalRelatedLink[];
};

export const legalDe: Record<string, LegalPageData> = {
  impressum: {
    slug: "impressum",
    title: "Impressum",
    intro: "Anbieterkennzeichnung gemäß §§ 5, 6 Digitale-Dienste-Gesetz (DDG) für NeXify AI by NeXify – Chat it. Automate it. Sitz: Venlo (NL), Angebot ausgerichtet auf den DACH-Markt.",
    updated: "2. August 2026",
    related: [
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "AGB", href: "/agb" },
      { label: "AVV", href: "/avv" },
      { label: "Widerruf", href: "/widerruf" },
      { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" },
      { label: "KI-Hinweise", href: "/ki-hinweise" },
    ],
    sections: [
      {
        id: "unternehmen",
        heading: "1. Angaben zum Unternehmen",
        paragraphs: [
          "NeXify AI by NeXify – Chat it. Automate it.",
          "Eenmanszaak (Einzelunternehmen nach niederländischem Recht), Inhaber: Pascal Courbois.",
          "Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande.",
          'Das Unternehmen ist unter dem Markennamen "NeXify AI" bzw. "NeXify AI by NeXify – Chat it. Automate it." tätig.',
        ],
      },
      {
        id: "kontakt",
        heading: "2. Kontakt",
        paragraphs: [
          "E-Mail: mail@nexifyai.cloud",
          "Telefon: +31 6 133 188 56",
          "Web: https://www.nexifyai.cloud",
          "Elektronische Erreichbarkeit ist jederzeit über die genannte E-Mail-Adresse gewährleistet.",
        ],
      },
      {
        id: "register",
        heading: "3. Register- und Steuerangaben",
        paragraphs: [
          "Kamer van Koophandel (KvK / niederländische Handelskammer): 90483944.",
          "BTW-Identifikationsnummer (Umsatzsteuer-ID): NL865786276B01.",
          "[BITTE ERGÄNZEN: RSIN (falls separat auszuweisen) / Handelsregisterauszug-Datum der letzten Prüfung]",
          "Tätigkeitsbereich: IT-Beratung, AI-gestützte Automatisierung, Softwareentwicklung, Webentwicklung, E-Commerce-Lösungen und digitale B2B-Dienstleistungen.",
        ],
      },
      {
        id: "vertretung",
        heading: "4. Vertretung und redaktionelle Verantwortung",
        paragraphs: [
          "Pascal Courbois, Inhaber / Directeur.",
          "Verantwortlich für redaktionelle Inhalte dieser Website: Pascal Courbois, Anschrift wie unter Ziffer 1.",
          "Es besteht keine journalistische Redaktion im Sinne des Medienstaatsvertrags; Inhalte dienen der Unternehmensdarstellung und der Anbahnung von B2B-Aufträgen.",
        ],
      },
      {
        id: "ddg",
        heading: "5. Anbieterkennzeichnung und anwendbares Recht",
        paragraphs: [
          "Als in den Niederlanden ansässiges Einzelunternehmen unterliegt NeXify AI dem niederländischen Handels- und Gewerberecht. Zuständige Handelskammer ist die Kamer van Koophandel (KvK).",
          "Soweit sich dieses Angebot erkennbar an Nutzer in Deutschland richtet (deutsche Sprache, DACH-Fokus), werden die Informationspflichten der deutschen Anbieterkennzeichnung nach §§ 5, 6 DDG (vormals § 5 TMG) freiwillig und vollständig erfüllt.",
          "Für datenschutzrechtliche Belange ist die Autoriteit Persoonsgegevens (Den Haag, Niederlande) die federführende Aufsichtsbehörde.",
        ],
      },
      {
        id: "versicherung",
        heading: "6. Berufshaftpflicht / Versicherung",
        paragraphs: [
          "[BITTE ERGÄNZEN: Berufshaftpflichtversicherung – Versicherer, Police-Nr., räumlicher Geltungsbereich, Deckungssumme]",
          "Soweit eine Berufshaftpflicht besteht, wird sie auf Anfrage von Geschäftspartnern in angemessenem Umfang nachgewiesen.",
        ],
      },
      {
        id: "b2b",
        heading: "7. B2B-Ausrichtung",
        paragraphs: [
          "Das Angebot richtet sich ausschließlich an Unternehmer, juristische Personen des öffentlichen Rechts und vergleichbare Organisationen. Verträge mit Verbrauchern werden nicht geschlossen.",
          "Mit Nutzung der Website und Kontaktaufnahme bestätigt der Interessent, als Unternehmer zu handeln, sofern er eine Beauftragung anstrebt.",
        ],
      },
      {
        id: "haftung-inhalte",
        heading: "8. Haftung für Inhalte",
        paragraphs: [
          "Die Inhalte dieser Website werden mit Sorgfalt erstellt. Eine Gewähr für Richtigkeit, Vollständigkeit und Aktualität wird nur übernommen, soweit ausdrücklich vereinbart oder gesetzlich zwingend.",
          "Preisangaben und Richtdauern sind Orientierung, kein bindendes Angebot. Verbindlich sind individuell bestätigte Angebote.",
        ],
      },
      {
        id: "haftung-links",
        heading: "9. Haftung für Links",
        paragraphs: [
          "Verlinkte externe Angebote unterliegen der Verantwortung ihrer Betreiber. Rechtswidrige Inhalte werden nach Kenntnis entfernt oder die Verlinkung beendet.",
        ],
      },
      {
        id: "urheber",
        heading: "10. Urheberrecht und Marken",
        paragraphs: [
          "Inhalte, Grafiken, Logos und Gestaltung unterliegen dem Urheberrecht. Verwertung außerhalb gesetzlicher Schranken bedarf schriftlicher Zustimmung.",
          "Marken Dritter sind Eigentum ihrer Inhaber.",
        ],
      },
      {
        id: "streit",
        heading: "11. Online-Streitbeilegung",
        paragraphs: [
          "Als ausschließlich B2B-Anbieter besteht keine Teilnahme an Verbraucherschlichtung. Die EU-OS-Plattform ist nicht einschlägig.",
          "Anfragen: mail@nexifyai.cloud.",
        ],
      },
      {
        id: "hinweis",
        heading: "12. Hinweis zur Rechtsqualität",
        paragraphs: [
          "Diese Anbieterkennzeichnung ist eine Best-Practice-Darstellung (u. a. §§ 5, 6 DDG, KvK). Sie ersetzt keine anwaltliche Prüfung.",
        ],
      },
    ],
  },
  datenschutz: {
    slug: "datenschutz",
    title: "Datenschutzerklärung",
    intro: "Informationspflichten nach Art. 12–14 DSGVO (AVG) zur Verarbeitung personenbezogener Daten auf dieser Website, im KI-Chat und im Rahmen geschäftlicher B2B-Anfragen.",
    updated: "2. August 2026",
    related: [
      { label: "Impressum", href: "/impressum" },
      { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" },
      { label: "AVV", href: "/avv" },
      { label: "KI-Hinweise", href: "/ki-hinweise" },
      { label: "AGB", href: "/agb" },
    ],
    sections: [
      {
        id: "verantwortlicher",
        heading: "1. Verantwortlicher",
        paragraphs: [
          "NeXify AI by NeXify – Chat it. Automate it., Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande.",
          "Inhaber: Pascal Courbois. Kontakt: mail@nexifyai.cloud, +31 6 133 188 56.",
          "Web: https://www.nexifyai.cloud.",
        ],
      },
      {
        id: "dsb",
        heading: "2. Datenschutzbeauftragter",
        paragraphs: [
          "Es ist derzeit kein Datenschutzbeauftragter im Sinne von Art. 37 DSGVO bestellt. Anfragen: mail@nexifyai.cloud (Betreff: Datenschutz).",
          "[BITTE ERGÄNZEN: Bestätigung, ob künftig ein externer DSB bestellt wird / Kontaktdaten falls vorhanden]",
        ],
      },
      {
        id: "grundsaetze",
        heading: "3. Grundsätze der Verarbeitung",
        paragraphs: [
          "Verarbeitung zweckgebunden, verhältnismäßig und speicherbegrenzt (Art. 5 DSGVO).",
          "Website grundsätzlich ohne Nutzerkonto und ohne Marketing-Tracking nutzbar (siehe Cookie-Richtlinie).",
        ],
      },
      {
        id: "rechtsgrundlagen",
        heading: "4. Rechtsgrundlagen im Überblick (Art. 6 DSGVO)",
        paragraphs: [
          "Je nach Vorgang stützen wir uns insbesondere auf:",
        ],
        bullets: [
          "Art. 6 Abs. 1 lit. a – Einwilligung (optionale Cookie-Kategorien Statistik/Marketing)",
          "Art. 6 Abs. 1 lit. b – Vertrag / vorvertragliche Maßnahmen",
          "Art. 6 Abs. 1 lit. c – rechtliche Verpflichtung (z. B. steuerliche Aufbewahrung)",
          "Art. 6 Abs. 1 lit. f – berechtigte Interessen (Sicherheit, Stabilität, B2B-Kommunikation, Missbrauchsschutz)",
        ],
      },
      {
        id: "hosting",
        heading: "5. Hosting, CDN und Protokolldaten",
        paragraphs: [
          "Beim Aufruf: IP-Adresse, Zeitpunkt, Ressource, Referrer, Browser-/Geräteinfos, Statuscodes – für Auslieferung, Stabilität, Fehleranalyse, Missbrauchsschutz.",
          "CDN/Schutz (z. B. Cloudflare) und Hosting (z. B. Vercel / EU-Server) möglich; AVV nach Art. 28 soweit erforderlich.",
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Protokolle begrenzt und zeitnah gelöscht/anonymisiert.",
        ],
      },
      {
        id: "kontaktformular",
        heading: "6. Kontaktformular und Kommunikation",
        paragraphs: [
          "Verarbeitet werden u. a. Name, Unternehmen, Kontaktdaten, Projektangaben, Nachricht – zur Anfragenbearbeitung und Vertragsanbahnung.",
          "Rechtsgrundlagen: Art. 6 Abs. 1 lit. b und lit. f. Speicherung ggf. in Supabase/PostgreSQL (EU).",
        ],
      },
      {
        id: "ki-chat",
        heading: "7. KI-Berater „NeXify AI\" (Live-Chat)",
        paragraphs: [
          "Chat-Nachrichten und Sitzungskennung werden verarbeitet, um den Verlauf bereitzustellen und Anfragen zu qualifizieren.",
          "Inhalte können an ein LLM eines spezialisierten Anbieters übermittelt werden. Keine besonderen Kategorien (Art. 9) und keine Geheimnisse im Chat.",
          "Keine automatisierte Entscheidung i. S. v. Art. 22 DSGVO; Angebote sind unverbindlich und werden vor Vertragsschluss menschlich geprüft.",
        ],
        subsections: [
          {
            id: "ki-gedaechtnis",
            heading: "7.1 Gedächtnisfunktion / Merkposten",
            paragraphs: [
              "Verdichtete Merkposten können über Mem0 (USA) mit EU-SCC (Art. 46 Abs. 2 lit. c) gespeichert werden.",
              "Widerspruch: mail@nexifyai.cloud – Merkposten werden dann gelöscht, soweit keine Aufbewahrungspflicht entgegensteht.",
            ],
          },
        ],
      },
      {
        id: "email",
        heading: "8. E-Mail-Versand und Vorsortierung",
        paragraphs: [
          "Transaktionale E-Mails ggf. über Resend o. ä.",
          "Eingehende E-Mails an mail@nexifyai.cloud können KI-gestützt vorsortiert/beantwortet werden; menschliche Bearbeitung jederzeit möglich.",
          "Angebotsentwürfe werden Pascal Courbois zur Freigabe vorgelegt – kein automatischer Versand ohne Freigabe.",
        ],
      },
      {
        id: "empfaenger",
        heading: "9. Empfänger",
        paragraphs: [
          "Kategorien von Empfängern:",
        ],
        bullets: [
          "Hosting-, CDN- und Sicherheitsdienstleister",
          "Datenbank-/Backend-Anbieter (EU)",
          "E-Mail-Versanddienstleister",
          "KI-Modell- und Memory-Anbieter (ggf. Drittland mit Garantien)",
          "Steuerberater, Rechtsanwälte, Behörden soweit erforderlich",
        ],
      },
      {
        id: "drittland",
        heading: "10. Drittlandübermittlungen",
        paragraphs: [
          "Außerhalb EWR nur mit geeigneten Garantien (insb. EU-SCC Art. 46) und ggf. Zusatzmaßnahmen; Angemessenheitsbeschlüsse werden berücksichtigt.",
        ],
      },
      {
        id: "speicher",
        heading: "11. Speicherdauer",
        paragraphs: [
          "Anfrage-/Chatdaten: solange zur Bearbeitung nötig, dann Löschung/Anonymisierung.",
          "Vertrags-/Abrechnungsdaten: gesetzliche Aufbewahrung (NL i. d. R. 7 Jahre).",
          "Consent: lokal im Browser bis Löschung/Änderung.",
        ],
      },
      {
        id: "rechte",
        heading: "12. Ihre Rechte",
        paragraphs: [
          "Vorbehaltlich gesetzlicher Voraussetzungen:",
        ],
        bullets: [
          "Auskunft (Art. 15)",
          "Berichtigung (Art. 16)",
          "Löschung (Art. 17)",
          "Einschränkung (Art. 18)",
          "Datenübertragbarkeit (Art. 20)",
          "Widerspruch (Art. 21)",
          "Widerruf Einwilligung (Art. 7 Abs. 3)",
          "Beschwerde bei Autoriteit Persoonsgegevens (NL) oder zuständiger Behörde",
        ],
      },
      {
        id: "pflicht",
        heading: "13. Pflicht zur Bereitstellung",
        paragraphs: [
          "Keine allgemeine Pflicht zur Angabe; ohne erforderliche Anfrageangaben ggf. keine Bearbeitung möglich.",
        ],
      },
      {
        id: "art22",
        heading: "14. Automatisierte Entscheidungsfindung",
        paragraphs: [
          "Keine ausschließlich automatisierte Entscheidung mit Rechtswirkung i. S. v. Art. 22 DSGVO.",
        ],
      },
      {
        id: "avv-hinweis",
        heading: "15. Auftragsverarbeitung für Kundenprojekte",
        paragraphs: [
          "Weisungsgebundene Verarbeitung für Kunden: AVV nach Art. 28 – siehe Seite „AVV\".",
        ],
      },
      {
        id: "sicherheit",
        heading: "16. Sicherheit und Aktualisierung",
        paragraphs: [
          "TOM u. a. TLS, Zugriffsbeschränkungen, Datensparsamkeit. Absolute Sicherheit nicht garantierbar.",
          "Es gilt die jeweils veröffentlichte Fassung dieser Erklärung.",
        ],
      },
    ],
  },
  agb: {
    slug: "agb",
    title: "Allgemeine Geschäftsbedingungen (B2B)",
    intro: "Vertragsgrundlagen für Beratungs-, Entwicklungs-, Design-, Automatisierungs-, Integrations- und Betriebsleistungen von NeXify AI – ausschließlich im unternehmerischen Geschäftsverkehr.",
    updated: "2. August 2026",
    related: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "AVV", href: "/avv" },
      { label: "Widerruf", href: "/widerruf" },
      { label: "KI-Hinweise", href: "/ki-hinweise" },
    ],
    sections: [
      {
        id: "geltung",
        heading: "1. Geltungsbereich und Unternehmerstatus",
        paragraphs: [
          "Diese Bedingungen gelten für Verträge zwischen NeXify AI (NeXify AI by NeXify – Chat it. Automate it.) und Unternehmern/juristischen Personen. Verträge mit Verbrauchern werden nicht geschlossen.",
          "Abweichende AGB des Auftraggebers nur bei ausdrücklicher Textform-Zustimmung. Individuelle Vereinbarungen haben Vorrang.",
        ],
      },
      {
        id: "vertrag",
        heading: "2. Vertragsschluss und Leistungsumfang",
        paragraphs: [
          "Angebote freibleibend, sofern nicht verbindlich bezeichnet. KI-Angebotsindikationen sind unverbindlich.",
          "Vertrag durch Annahme, Auftragsbestätigung oder – soweit angekündigt – Leistungsbeginn. Maßgeblich: Angebot, Scope, Akzeptanzkriterien, Änderungen.",
        ],
      },
      {
        id: "preis",
        heading: "3. Aufwand, Arbeitstage und Preis",
        paragraphs: [
          "Regulärer Tagessatz: 449 Euro netto / Arbeitstag (bis zu acht Fachstunden), sofern nichts anderes vereinbart.",
          "Schätzungen unverbindlich; Festpreis nur bei ausdrücklicher Vereinbarung. Mehrbedarf vor Ausführung anzeigen.",
          "Preise zzgl. USt; Reverse Charge bei gültiger USt-ID möglich.",
        ],
      },
      {
        id: "mitwirkung",
        heading: "4. Mitwirkung des Auftraggebers",
        paragraphs: [
          "Inhalte, Zugänge, Freigaben und Entscheidungen rechtzeitig bereitstellen. Fehlende Mitwirkung kann Termin/Preis beeinflussen.",
          "Geheimnisse nicht unaufgefordert in öffentliche Tickets/Chats/Repos.",
        ],
      },
      {
        id: "ai",
        heading: "5. AI-gestützte Arbeitsweise",
        paragraphs: [
          "AI-Werkzeuge zur Beschleunigung; fachliche Verantwortung bleibt beim Menschen. Besondere Vorgaben zu Modell/Datenresidenz vorab vereinbaren.",
        ],
      },
      {
        id: "termine",
        heading: "6. Termine und Lieferfristen",
        paragraphs: [
          "Richtdauern ab vollständiger Content-Bereitstellung. Verbindliche Termine nur bei ausdrücklicher Vereinbarung.",
          "Höhere Gewalt und Drittanbieter-Ausfälle verlängern Fristen angemessen.",
        ],
      },
      {
        id: "abnahme",
        heading: "7. Abnahme",
        paragraphs: [
          "Wesentliche Mängel fristgerecht und nachvollziehbar melden. Unwesentliche Abweichungen hindern Abnahme nicht.",
          "Produktive Nutzung oder ausbleibende Rückmeldung kann als Abnahme gelten, soweit vereinbart/angekündigt.",
        ],
      },
      {
        id: "rechte",
        heading: "8. Nutzungsrechte und Open Source",
        paragraphs: [
          "Nach vollständiger Zahlung: vereinbarte Nutzungsrechte am individuellen Werk. Vorbestehende Tools/Know-how verbleiben bei NeXify AI.",
          "OSS und Drittdienste: eigene Lizenzbedingungen.",
        ],
      },
      {
        id: "dritte",
        heading: "9. Drittanbieter und laufende Kosten",
        paragraphs: [
          "Hosting, Domains, APIs, AI-Nutzung, Lizenzen nur enthalten wenn ausdrücklich vereinbart.",
        ],
      },
      {
        id: "gewaehr",
        heading: "10. Gewährleistung und Haftung",
        paragraphs: [
          "Reproduzierbare Mängel in angemessener Frist beheben. Geschuldet: vereinbarte Beschaffenheit.",
          "Unbeschränkt: Vorsatz, grobe Fahrlässigkeit, Leben/Körper/Gesundheit, zwingende Haftung. Leichte Fahrlässigkeit bei Kardinalpflichten: vertragstypisch vorhersehbarer Schaden; sonst ausgeschlossen.",
          "Datenverlust nur im Umfang trotz ordnungsgemäßer Sicherung.",
        ],
      },
      {
        id: "zahlung",
        heading: "11. Zahlung",
        paragraphs: [
          "Zahlung innerhalb ausgewiesener Frist. Abschläge/Meilensteine möglich. Verzug: gesetzliche B2B-Folgen; Aussetzung nach Ankündigung möglich.",
        ],
      },
      {
        id: "vertraulich",
        heading: "12. Vertraulichkeit und Datenschutz",
        paragraphs: [
          "Vertraulichkeit auch nach Vertragsende. Weisungsgebundene Verarbeitung: AVV Art. 28.",
        ],
      },
      {
        id: "referenz",
        heading: "13. Referenznennung",
        paragraphs: [
          "Name/Logo als Referenz nach Projektabschluss zulässig, sofern kein Widerspruch/andere Vereinbarung.",
        ],
      },
      {
        id: "laufzeit",
        heading: "14. Laufzeit, Kündigung, Unterbrechung",
        paragraphs: [
          "Projektende mit Leistungserbringung. Laufende Leistungen nach vereinbarten Fristen kündbar. Außerordentlich unberührt.",
          "Unterbrechung durch Auftraggeber: Abrechnung erbrachter Leistungen.",
        ],
      },
      {
        id: "saas",
        heading: "15. SaaS-ähnliche / Betriebsleistungen",
        paragraphs: [
          "Laufende Betriebs-/Agenten-Dienste: SLAs nur soweit vereinbart. Ohne SLA keine Garantie für Drittverfügbarkeit.",
        ],
      },
      {
        id: "recht",
        heading: "16. Recht, Gerichtsstand, Schluss",
        paragraphs: [
          "Niederländisches Recht; Ausschluss UN-Kaufrecht/Kollisionsrecht soweit zulässig. Gerichtsstand (Kaufleute): Venlo, NL, soweit zulässig.",
          "Teilunwirksamkeit lässt übrigen Vertrag unberührt.",
        ],
      },
    ],
  },
  "ki-hinweise": {
    slug: "ki-hinweise",
    title: "KI-Hinweise",
    intro: "Transparenz zu AI-gestützter Arbeit und zum KI-Berater – orientiert an Art. 50 EU AI Act und Art. 22 DSGVO.",
    updated: "2. August 2026",
    related: [
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "AGB", href: "/agb" },
      { label: "AVV", href: "/avv" },
      { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" },
    ],
    sections: [
      {
        id: "transparenz",
        heading: "1. Sie interagieren mit einem KI-System",
        paragraphs: [
          "Der Berater „NeXify AI\" ist ein KI-System. Interaktion mit Automatisierung, nicht mit einem Menschen – außer bei ausdrücklicher menschlicher Übernahme.",
          "Transparenz gemäß Art. 50 Abs. 1 VO (EU) 2024/1689 (AI Act); Pflichten ab 2. August 2026 – Hinweise bereits jetzt umgesetzt.",
        ],
      },
      {
        id: "rolle",
        heading: "2. Rolle und Grenzen",
        paragraphs: [
          "Fragen zu Leistungen/Preisen, Qualifizierung, unverbindliche Angebotsindikationen.",
          "Verbindliche Angebote nur nach Prüfung durch Pascal Courbois. Der Assistent kann Fehler machen.",
        ],
      },
      {
        id: "art22",
        heading: "3. Keine ausschließlich automatisierten Entscheidungen",
        paragraphs: [
          "Keine Art.-22-Entscheidungen mit Rechtswirkung. Vertraglich Relevantes unterliegt menschlicher Kontrolle.",
        ],
      },
      {
        id: "mensch",
        heading: "4. Menschliche Kontrolle in Projekten",
        bullets: [
          "Ziele/Architektur durch Fachmann",
          "AI-Ausgaben auf Plausibilität/Sicherheit prüfen",
          "Hochrisiko-Domänen nicht allein auf AI stützen",
          "Produktive Änderungen risikogerecht testen",
        ],
      },
      {
        id: "daten",
        heading: "5. Daten, Chat-Logs und Training",
        paragraphs: [
          "Chat-/Sitzungsdaten laut Datenschutzerklärung. Keine bewusste Freigabe zur allgemeinen Modellschulung ohne Vereinbarung.",
          "Projekte: Geheimhaltung, ggf. AVV, Datenresidenz/Modellwahl.",
        ],
      },
      {
        id: "synthetisch",
        heading: "6. Kennzeichnung synthetischer Inhalte",
        paragraphs: [
          "Bei synthetischen Audio-/Bild-/Video-/Textsystemen: Art. 50 Abs. 2 AI Act projektspezifisch berücksichtigen.",
        ],
      },
      {
        id: "risiko",
        heading: "7. Risikoklassifizierung",
        paragraphs: [
          "Beratung zur groben Einordnung; Compliance-Verantwortung des Betreibers bleibt beim Kunden, soweit nicht anders vereinbart.",
        ],
      },
      {
        id: "kontakt",
        heading: "8. Kontakt",
        paragraphs: [
          "mail@nexifyai.cloud.",
        ],
      },
    ],
  },
  "cookie-richtlinie": {
    slug: "cookie-richtlinie",
    title: "Cookie-Richtlinie",
    intro: "Cookies und ähnliche Speichertechniken gemäß § 25 TDDDG und DSGVO – abgestimmt auf den Cookie-Banner (Notwendig, Statistik, Marketing).",
    updated: "2. August 2026",
    related: [
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "Impressum", href: "/impressum" },
      { label: "KI-Hinweise", href: "/ki-hinweise" },
    ],
    sections: [
      {
        id: "grundlage",
        heading: "1. Rechtsgrundlagen",
        paragraphs: [
          "§ 25 TDDDG (ePrivacy) und DSGVO. Technisch unbedingt erforderlich: ohne Einwilligung (§ 25 Abs. 2). Sonst: Einwilligung (§ 25 Abs. 1 / Art. 6 Abs. 1 lit. a).",
        ],
      },
      {
        id: "manager",
        heading: "2. Einwilligungs-Manager und Kategorien",
        paragraphs: [
          "Auswahl im Banner; Speicherung lokal als nexify-consent. Änderung über Cookie-Einstellungen im Footer.",
        ],
        subsections: [
          {
            heading: "2.1 Notwendig (immer aktiv)",
            paragraphs: [
              "Sprachwahl, Sitzung, Sicherheit, Consent-Speicher. § 25 Abs. 2 TDDDG / Art. 6 Abs. 1 lit. f.",
            ],
          },
          {
            heading: "2.2 Statistik (Opt-in)",
            paragraphs: [
              "Nutzungsstatistiken. Derzeit nicht im Einsatz – keine Statistik-Dienste ohne Einwilligung und ohne Aktivierung.",
            ],
          },
          {
            heading: "2.3 Marketing (Opt-in)",
            paragraphs: [
              "Kampagnenmessung/Marketing. Derzeit nicht im Einsatz. Vor Aktivierung: Name, Anbieter, Zweck hier ergänzen.",
            ],
          },
        ],
      },
      {
        id: "konkret",
        heading: "3. Konkret eingesetzte Speicherungen",
        bullets: [
          "nexify-lang (localStorage): Sprachwahl",
          "nexify-consent (localStorage): Banner-Auswahl + Zeitstempel",
          "nova-greeted (localStorage): Chat-Begrüßungsmerker",
          "Chat-Sitzungskennung während der Nutzung",
          "Portal-Login-Cookie (HttpOnly), soweit Portal genutzt",
        ],
      },
      {
        id: "dritte",
        heading: "4. Drittdienste",
        paragraphs: [
          "CDN/Security (z. B. Cloudflare) kann technisch notwendige Cookies setzen.",
        ],
      },
      {
        id: "browser",
        heading: "5. Browser und Widerruf",
        paragraphs: [
          "Browser-Löschung möglich; notwendige Speicherungen können Funktionen einschränken. Widerruf über Cookie-Einstellungen.",
        ],
      },
      {
        id: "updates",
        heading: "6. Aktualisierung",
        paragraphs: [
          "Neue Statistik-/Marketing-Dienste werden vor Aktivierung hier und im Banner benannt.",
        ],
      },
    ],
  },
  avv: {
    slug: "avv",
    title: "Auftragsverarbeitung (AVV / DPA)",
    intro: "Struktur und Grundsätze einer AVV nach Art. 28 DSGVO. Kein Ersatz für die projektbezogene Vertragsfassung.",
    updated: "2. August 2026",
    related: [
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "AGB", href: "/agb" },
      { label: "KI-Hinweise", href: "/ki-hinweise" },
      { label: "Impressum", href: "/impressum" },
    ],
    sections: [
      {
        id: "wann",
        heading: "1. Wann eine AVV erforderlich ist",
        paragraphs: [
          "Bei weisungsgebundener Verarbeitung von Kundendaten (Web-Apps, Shops, Automationen, Agenten).",
          "Keine AVV, soweit NeXify AI eigener Verantwortlicher ist (z. B. Website-Leads).",
        ],
      },
      {
        id: "form",
        heading: "2. Form und Standardklauseln",
        paragraphs: [
          "Schriftlich oder elektronisch nachweisbar (Art. 28 Abs. 9).",
          "Vorlage: EU-SCC Verantwortlicher–Auftragsverarbeiter (Durchführungsbeschluss (EU) 2021/915). Drittland: ggf. zusätzlich (EU) 2021/914 Module 2/3.",
        ],
      },
      {
        id: "pflicht",
        heading: "3. Pflichtinhalte Art. 28 Abs. 3",
        paragraphs: [
          "Mindestens:",
        ],
        bullets: [
          "Gegenstand und Dauer",
          "Art und Zweck",
          "Art der Daten",
          "Kategorien Betroffener",
          "Pflichten/Rechte des Verantwortlichen",
          "Weisungsbindung (lit. a)",
          "Vertraulichkeit (lit. b)",
          "TOM / Art. 32 (lit. c)",
          "Unterauftragsverarbeitung (lit. d)",
          "Betroffenenrechte (lit. e)",
          "Sicherheit/Meldung/DSFA (lit. f)",
          "Löschung/Rückgabe (lit. g)",
          "Nachweise/Audits (lit. h)",
        ],
      },
      {
        id: "module",
        heading: "4. Module / Anhänge",
        paragraphs: [
          "Typische Struktur:",
        ],
        bullets: [
          "Anhang A: Verarbeitungsbeschreibung",
          "Anhang B: TOM",
          "Anhang C: Unterauftragsverarbeiter",
          "Anhang D: Kontakte",
          "Optional: SCC / Transfer-Hinweise",
        ],
      },
      {
        id: "uav",
        heading: "5. Unterauftragsverarbeiter",
        paragraphs: [
          "Kategorien: Hosting/Cloud, DB, E-Mail, CDN/Security, KI-Modell/Memory.",
          "[BITTE ERGÄNZEN: Master-Liste mit Rechtsname, Sitzland, Zweck, AVV-/SCC-Status]",
          "Wechsel nach vereinbartem Genehmigungsmodus.",
        ],
      },
      {
        id: "tom",
        heading: "6. TOM (Art. 32)",
        paragraphs: [
          "Projektspezifisch u. a.:",
        ],
        bullets: [
          "TLS / Verschlüsselung ruhender Daten wo möglich",
          "Least Privilege",
          "Getrennte Umgebungen",
          "Security-Logging",
          "Patches",
          "Datensparsamkeit/Pseudonymisierung",
          "Backup nach Scope",
          "Vertraulichkeitsverpflichtungen",
        ],
      },
      {
        id: "vorfall",
        heading: "7. Datenschutzvorfälle",
        paragraphs: [
          "Unverzügliche Meldung an den Verantwortlichen und Unterstützung bei Meldepflichten im vereinbarten Umfang.",
        ],
      },
      {
        id: "ende",
        heading: "8. Vertragsende",
        paragraphs: [
          "Löschung oder Rückgabe nach Weisung; angemessener Nachweis, soweit keine Aufbewahrungspflicht.",
        ],
      },
      {
        id: "projekt",
        heading: "9. Projektfassung und Kontakt",
        paragraphs: [
          "Diese Seite ist Strukturübersicht. Verbindliche AVV im Auftrag. Kontakt: mail@nexifyai.cloud.",
        ],
      },
    ],
  },
  widerruf: {
    slug: "widerruf",
    title: "Hinweis zum Widerrufsrecht",
    intro: "Klarstellung: NeXify AI schließt Verträge ausschließlich im B2B-Geschäftsverkehr – gesetzliches Fernabsatz-Widerrufsrecht gilt grundsätzlich nicht.",
    updated: "2. August 2026",
    related: [
      { label: "AGB", href: "/agb" },
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
    sections: [
      {
        id: "kein-verbraucher",
        heading: "1. Kein Verbrauchervertrag",
        paragraphs: [
          "Ausschließlich Unternehmer/juristische Personen. Gesetzliches Verbraucherwiderrufsrecht für Fernabsatz findet grundsätzlich keine Anwendung.",
          "Mit Anfrage/Beauftragung bestätigt der Auftraggeber seinen Unternehmerstatus.",
        ],
      },
      {
        id: "wann-doch",
        heading: "2. Wann ein Widerrufsrecht gelten würde",
        paragraphs: [
          "Nur bei Verbrauchervertrag entgegen Ausrichtung – dann individuelle Belehrung oder Ablehnung des Vertragsschlusses.",
        ],
      },
      {
        id: "digitale",
        heading: "3. Digitale Inhalte / Dienstleistungen",
        paragraphs: [
          "Bei Verbraucherverträgen kann das Widerrufsrecht unter gesetzlich geregelten Voraussetzungen erlöschen. Für das Standardgeschäft von NeXify AI nicht einschlägig.",
        ],
      },
      {
        id: "kulanz",
        heading: "4. Kulanz (B2B)",
        paragraphs: [
          "Vor Leistungsbeginn kostenfreie Stornierung in Textform möglich, sofern noch nichts erbracht. Erbrachtes anteilig abrechenbar.",
        ],
      },
      {
        id: "kontakt",
        heading: "5. Kontakt",
        paragraphs: [
          "mail@nexifyai.cloud / +31 6 133 188 56.",
        ],
      },
    ],
  },

  status: {
    slug: "status",
    title: "Systemstatus",
    intro: "Aktueller Betriebsstatus der NeXify AI Plattform. Wir zeigen ausschließlich gemessene Realwerte – keine Fake-Uptime.",
    updated: "2026-08-04",
    related: [
      { label: "SLA", href: "/sla" },
      { label: "Security", href: "/security" },
      { label: "Impressum", href: "/impressum" },
    ],
    sections: [
      {
        id: "aktuell",
        heading: "1. Aktueller Status",
        paragraphs: [
          "Die NeXify AI Plattform befindet sich derzeit im strukturierten Aufbau. Eine dedizierte Statusseite unter status.nexifyai.cloud ist in Vorbereitung.",
          "Bis zur Inbetriebnahme des Echtzeit-Monitors gilt: Bekannte Wartungsfenster werden mindestens 24 Stunden vorab per E-Mail an aktive Kunden kommuniziert.",
        ],
      },
      {
        id: "komponenten",
        heading: "2. Komponenten",
        bullets: [
          "Website (nexifyai.cloud) – öffentlich erreichbar",
          "KI-Agenten API – in Betrieb für aktive Projekte",
          "Kundenportal – in Betrieb für angemeldete Nutzer",
          "status.nexifyai.cloud – in Vorbereitung (DNS NXDOMAIN bis Go-live)",
        ],
      },
      {
        id: "vorfaelle",
        heading: "3. Vergangene Vorfälle",
        paragraphs: [
          "Bisher keine dokumentierten schwerwiegenden Vorfälle seit Produktionsstart.",
        ],
      },
      {
        id: "meldung",
        heading: "4. Störungsmeldung",
        paragraphs: [
          "Störungen bitte an mail@nexifyai.cloud melden. Wir reagieren innerhalb von 4 Stunden (Werktage 09–18 Uhr CET).",
        ],
      },
    ],
  },

  security: {
    slug: "security",
    title: "Security & Vertrauen",
    intro: "Transparenz über unsere Sicherheitsmaßnahmen, den verantwortungsvollen Umgang mit Schwachstellenmeldungen und die Ausrichtung an security.txt (RFC 9116).",
    updated: "2026-08-04",
    related: [
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "Status", href: "/status" },
      { label: "Impressum", href: "/impressum" },
    ],
    sections: [
      {
        id: "kontakt",
        heading: "1. Security-Kontakt",
        paragraphs: [
          "Sicherheitslücken bitte ausschließlich per E-Mail an security@nexifyai.cloud melden. PGP-Schlüssel auf Anfrage.",
          "Wir bestätigen den Eingang innerhalb von 48 Stunden und informieren über den weiteren Verlauf.",
        ],
      },
      {
        id: "security-txt",
        heading: "2. security.txt (RFC 9116)",
        paragraphs: [
          "Unsere Maschinenlesbare Sicherheitskontaktdatei ist unter /.well-known/security.txt abrufbar und folgt RFC 9116.",
        ],
      },
      {
        id: "massnahmen",
        heading: "3. Technische Maßnahmen",
        bullets: [
          "TLS 1.2+ auf allen Endpunkten (kein HTTP)",
          "HSTS mit langer max-age",
          "Content-Security-Policy (CSP) aktiv",
          "Eingabevalidierung serverseitig (FastAPI / Pydantic)",
          "Keine Speicherung von Klartext-Passwörtern (bcrypt)",
          "Dependency-Scanning via GitHub Advanced Security (Dependabot + CodeQL)",
          "Secrets ausschließlich in Umgebungsvariablen, nie im Quellcode",
        ],
      },
      {
        id: "daten",
        heading: "4. Datensicherheit",
        paragraphs: [
          "Kundendaten werden nur in europäischen Rechenzentren verarbeitet. Backups täglich, verschlüsselt.",
          "Zugriff auf Produktionssysteme nur für autorisiertes Personal mit Zwei-Faktor-Authentifizierung.",
        ],
      },
      {
        id: "responsible-disclosure",
        heading: "5. Responsible Disclosure",
        paragraphs: [
          "Wir begrüßen ethische Sicherheitsforschung. Bitte keine öffentliche Veröffentlichung vor koordinierter Behebung (Coordinated Vulnerability Disclosure). Wir verpflichten uns, gemeldete Schwachstellen innerhalb von 90 Tagen zu beheben.",
        ],
      },
    ],
  },

  barrierefreiheit: {
    slug: "barrierefreiheit",
    title: "Barrierefreiheitserklärung",
    intro: "Erklärung zur Barrierefreiheit gemäß § 12 Barrierefreiheitsstärkungsgesetz (BFSG) und WCAG 2.1 – ehrlicher Ist-Stand.",
    updated: "2026-08-04",
    related: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "Kontakt", href: "/kontakt" },
    ],
    sections: [
      {
        id: "stand",
        heading: "1. Aktueller Stand",
        paragraphs: [
          "Die Website nexifyai.cloud befindet sich in der aktiven Entwicklung. Eine vollständige WCAG-2.1-AA-Konformität ist unser Ziel; der aktuelle Stand ist im Folgenden dokumentiert.",
        ],
      },
      {
        id: "umgesetzt",
        heading: "2. Bereits umgesetzt",
        bullets: [
          "Semantisches HTML5 für Struktur und Navigation",
          "ARIA-Labels an interaktiven Elementen",
          "Ausreichende Farbkontrastverhältnisse (Ziel: WCAG AA 4.5:1 für Fließtext)",
          "Tastaturbedienbarkeit der Hauptnavigation",
          "Skip-Link zum Hauptinhalt",
          "Responsive Design (320 px bis 4K)",
          "Alternativtexte für informative Bilder",
        ],
      },
      {
        id: "bekannte-maengel",
        heading: "3. Bekannte Mängel (in Bearbeitung)",
        bullets: [
          "Einige Diagramme und KI-generierte Inhalte ohne vollständige Textalternative",
          "Live-Chat-Widget: eingeschränkte Screenreader-Unterstützung (in Überarbeitung)",
          "Video-Inhalte: automatische Untertitel noch nicht verfügbar",
        ],
      },
      {
        id: "feedback",
        heading: "4. Feedback und Kontakt",
        paragraphs: [
          "Wenn Sie Barrieren auf unserer Website feststellen, kontaktieren Sie uns bitte: mail@nexifyai.cloud oder +31 6 133 188 56.",
          "Wir bemühen uns, Ihnen innerhalb von 5 Werktagen zu antworten.",
        ],
      },
      {
        id: "durchsetzung",
        heading: "5. Durchsetzungsverfahren",
        paragraphs: [
          "Bei unbefriedigender Reaktion können Sie sich an die zuständige Aufsichtsbehörde wenden. In Deutschland: Beauftragter der Bundesregierung für die Belange von Menschen mit Behinderungen. In den Niederlanden: College voor de Rechten van de Mens.",
        ],
      },
    ],
  },

  sla: {
    slug: "sla",
    title: "Service Level Agreement (SLA)",
    intro: "Unsere Verfügbarkeits- und Reaktionszusagen – ausschließlich mit messbarer Realität. Keine Marketing-Versprechen.",
    updated: "2026-08-04",
    related: [
      { label: "Status", href: "/status" },
      { label: "AGB", href: "/agb" },
      { label: "Impressum", href: "/impressum" },
    ],
    sections: [
      {
        id: "geltungsbereich",
        heading: "1. Geltungsbereich",
        paragraphs: [
          "Dieses SLA gilt für aktive B2B-Verträge mit NeXify AI. Für Testphasen und Pilotprojekte gelten die im Angebot genannten abweichenden Bedingungen.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "2. Verfügbarkeit",
        paragraphs: [
          "Ziel-Verfügbarkeit: 99 % im Monatsmittel (gemessen am API-Endpunkt). Wartungsfenster werden mindestens 24 Stunden vorab angekündigt und zählen nicht als Ausfallzeit.",
          "Hinweis: Wir befinden uns im Aufbau. Historische Uptime-Daten werden ab Produktionsstart auf status.nexifyai.cloud veröffentlicht.",
        ],
      },
      {
        id: "reaktionszeiten",
        heading: "3. Reaktionszeiten",
        bullets: [
          "Kritisch (Totalausfall): Erstreaktion innerhalb 4 Stunden (Werktage 09–18 Uhr CET)",
          "Hoch (wesentliche Funktion eingeschränkt): Erstreaktion innerhalb 8 Stunden",
          "Mittel (einzelne Funktion eingeschränkt): Erstreaktion innerhalb 1 Werktag",
          "Niedrig (Frage / Verbesserung): Erstreaktion innerhalb 3 Werktage",
        ],
      },
      {
        id: "gutschriften",
        heading: "4. Service-Gutschriften",
        paragraphs: [
          "Bei nachgewiesenem Unterschreiten der Ziel-Verfügbarkeit (< 99 % im Kalendermonat) erhalten aktive Kunden auf Anfrage eine anteilige Gutschrift gemäß der im Vertrag festgelegten Staffelung.",
        ],
      },
      {
        id: "ausschluss",
        heading: "5. Ausschlüsse",
        bullets: [
          "Höhere Gewalt (DDoS-Angriffe, Naturkatastrophen, Netzausfall des ISP)",
          "Wartungsfenster mit 24-Stunden-Ankündigung",
          "Fehler durch Kundencode oder -konfiguration",
          "Externe Drittdienste außerhalb unseres Einflussbereichs",
        ],
      },
      {
        id: "kontakt",
        heading: "6. SLA-Kontakt",
        paragraphs: [
          `SLA-Eskalationen an mail@nexifyai.cloud mit dem Betreff "SLA-Vorfall – [Datum]".`,
        ],
      },
    ],
  },
};
