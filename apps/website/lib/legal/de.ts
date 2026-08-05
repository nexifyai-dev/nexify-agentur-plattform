// FILE: apps/website/lib/legal/de.ts
// UPDATED: 04.08.2026 22:45 — DIN-/ISO-konforme Vollausbauung aller 7 Rechtstexte (DE)
// Rechtsgrundlagen: DDG, MStV, DSGVO, TTDSG, BGB, EU AI Act (VO 2024/1689), UStG, KvK NL
// B2B-Ausrichtung: ausschließlich Verträge mit Unternehmern (§ 14 BGB)
// Formatierung: Datum TT.MM.JJJJ, Beträge mit Dezimalkomma (449,00 €), Paragraphenzeichen

export type LegalSubsection = { id?: string; heading: string; paragraphs?: string[]; bullets?: string[] };
export type LegalSection = { id?: string; heading: string; paragraphs?: string[]; bullets?: string[]; subsections?: LegalSubsection[] };
export type LegalRelatedLink = { label: string; href: string };
export type LegalPageData = { slug: string; title: string; intro: string; updated: string; sections: LegalSection[]; related?: LegalRelatedLink[] };

export const legalDe: Record<string, LegalPageData> = {

  impressum: {
    slug: "impressum", title: "Impressum",
    intro: "Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV). Sitz: Venlo, Niederlande. Das Angebot richtet sich ausdrücklich an den DACH-Markt und wird in deutscher Sprache geführt.",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "AGB", href: "/agb" }, { label: "AVV", href: "/avv" }, { label: "Widerruf", href: "/widerruf" }, { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" }, { label: "KI-Hinweise", href: "/ki-hinweise" }],
    sections: [
      { id: "diensteanbieter", heading: "§ 1 Diensteanbieter",
        paragraphs: [
          "NeXify AI by NeXify – Chat it. Automate it.",
          "Inhaber: Pascal Courbois (Eenmanszaak nach niederländischem Recht)",
          "Anschrift: Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande",
          "Handelsregister: KvK Nr. 90483944 (Kamer van Koophandel, Eindhoven)",
          "Umsatzsteuer-Identifikationsnummer: NL865786276B01",
        ] },
      { id: "kontakt", heading: "§ 2 Kontakt",
        paragraphs: [
          "E-Mail: mail@nexifyai.cloud",
          "Telefon: +31 6 133 188 56 (Mo–Fr 09:00–18:00 Uhr, MEZ)",
          "Web: https://www.nexifyai.cloud",
          "Verfügbarkeit: Antworten in der Regel innerhalb eines Werktages.",
        ] },
      { id: "vertretung", heading: "§ 3 Vertretung und redaktionelle Verantwortung",
        paragraphs: [
          "Gesetzlicher Vertreter: Pascal Courbois (Inhaber).",
          "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: Pascal Courbois, Anschrift wie in § 1.",
        ] },
      { id: "aufsicht", heading: "§ 4 Aufsichtsbehörden und Register",
        paragraphs: [
          "Zuständige Handelskammer: Kamer van Koophandel (KvK), Regio Eindhoven, Niederlande.",
          "Datenschutz-Aufsichtsbehörde: Autoriteit Persoonsgegevens (AP), Postbus 93374, 2509 AJ Den Haag, Niederlande.",
          "Es besteht keine gesetzliche Verpflichtung zur Bestellung einer Berufshaftpflichtversicherung; eine solche wird derzeit nicht unterhalten.",
        ] },
      { id: "b2b", heading: "§ 5 B2B-Ausrichtung und Ausschluss von Verbraucherverträgen",
        paragraphs: [
          "Das Angebot richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB, an juristische Personen des öffentlichen Rechts sowie an öffentlich-rechtliche Sondervermögen.",
          "Verträge mit Verbrauchern im Sinne des § 13 BGB werden nicht geschlossen. Auf Verbraucher bezogene gesetzliche Informationspflichten (insbesondere §§ 312a–312i, 355–361 BGB) finden daher keine Anwendung.",
        ] },
      { id: "streit", heading: "§ 6 Streitbeilegung und anwendbares Recht",
        paragraphs: [
          "Als B2B-Anbieter nehmen wir nicht an Verbraucherstreitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil (§ 36 VSBG). Eine entsprechende Verpflichtung besteht nicht.",
          "Es gilt das Recht der Niederlande. Die Anwendung des UN-Kaufrechts (CISG) ist ausgeschlossen.",
          "Gerichtsstand für alle Streitigkeiten ist – soweit gesetzlich zulässig – Venlo, Niederlande.",
        ] },
      { id: "haftung", heading: "§ 7 Haftung und Urheberrecht",
        paragraphs: [
          "Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird jedoch keine Gewähr übernommen.",
          "Für den Inhalt externer Links (einschließlich Social-Media-Profile) sind ausschließlich deren Betreiber verantwortlich.",
          "Alle Inhalte, Texte, Grafiken und Logos dieser Website sind urheberrechtlich geschützt. Jede Verwertung außerhalb der engen Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung.",
          "Künstlich generierte Inhalte (KI-Assets) werden gemäß den KI-Hinweisen gekennzeichnet.",
        ] },
      { id: "social", heading: "§ 8 Social-Media-Präsenzen",
        paragraphs: [
          "Diese Website verlinkt auf externe Präsenzen (z. B. LinkedIn, WhatsApp). Für die dort verarbeiteten Daten gelten die Datenschutzbestimmungen der jeweiligen Plattformanbieter.",
          "Verantwortlich für die redaktionellen Inhalte der Präsenzen ist ebenfalls Pascal Courbois (Anschrift wie § 1).",
        ] },
    ],
  },

  datenschutz: {
    slug: "datenschutz", title: "Datenschutzerklärung",
    intro: "Datenschutzinformationen gemäß Art. 12 ff. DSGVO sowie § 25 TTDSG. Wir verarbeiten personenbezogene Daten ausschließlich auf Grundlage der DSGVO, des TTDSG und des niederländischen Umsetzungsrechts (UAVG). Transparenz ist die Grundlage für Vertrauen.",
    updated: "5. August 2026",
    related: [{ label: "Impressum", href: "/impressum" }, { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" }, { label: "AVV", href: "/avv" }, { label: "KI-Hinweise", href: "/ki-hinweise" }, { label: "AGB", href: "/agb" }],
    sections: [
      { id: "verantwortlicher", heading: "1. Verantwortlicher",
        paragraphs: [
          "Verantwortlicher im Sinne des Art. 4 Nr. 7 DSGVO ist:",
          "Pascal Courbois (NeXify AI by NeXify), Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande.",
          "E-Mail: mail@nexifyai.cloud · Telefon: +31 6 133 188 56",
        ] },
      { id: "dsb", heading: "2. Datenschutzbeauftragter",
        paragraphs: [
          "Eine gesetzliche Pflicht zur Bestellung eines Datenschutzbeauftragten besteht nicht (Art. 37 DSGVO, Art. 37 Abs. 1 lit. c DSGVO i. V. m. § 38 BDSG).",
          "Datenschutzanfragen richten Sie bitte an: mail@nexifyai.cloud.",
        ] },
      { id: "allgemeines", heading: "3. Allgemeines zur Datenverarbeitung",
        paragraphs: [
          "Wir verarbeiten personenbezogene Daten ausschließlich unter Beachtung der DSGVO, des TTDSG und der für uns geltenden niederländischen Vorschriften.",
          "Eine automatisierte Entscheidungsfindung im Sinne des Art. 22 DSGVO findet nicht statt.",
          "Rechtsgrundlagen im Überblick:",
        ],
        bullets: [
          "Art. 6 Abs. 1 lit. a DSGVO – Einwilligung",
          "Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung und vorvertragliche Maßnahmen",
          "Art. 6 Abs. 1 lit. c DSGVO – Rechtliche Verpflichtung",
          "Art. 6 Abs. 1 lit. f DSGVO – Berechtigte Interessen (insbesondere Betrieb und Sicherheit der Website)",
        ] },
      { id: "hosting", heading: "4. Hosting und Server-Logfiles",
        paragraphs: [
          "Hosting: Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (EU-Standardvertragsklauseln gemäß Art. 46 DSGVO abgeschlossen).",
          "Content Delivery Network und Web Application Firewall: Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA (SCC).",
          "Bei jedem Aufruf dieser Website verarbeitet der Hosting-Anbieter automatisiert folgende Daten: IP-Adresse (gekürzt), Datum und Uhrzeit des Zugriffs, aufgerufene URL, HTTP-Statuscode, Referrer-URL, User-Agent, Browsertyp und -version, Betriebssystem.",
          "Diese Logfiles dienen der Betriebssicherheit, Fehleranalyse und Missbrauchsabwehr (berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO).",
          "Server-Logfiles werden nach spätestens 30 Tagen gelöscht oder anonymisiert.",
        ] },
      { id: "kontaktformular", heading: "5. Kontaktformular und E-Mail-Kommunikation",
        paragraphs: [
          "Bei Nutzung des Kontaktformulars erheben wir: Name, E-Mail-Adresse, Unternehmen (optional), Telefonnummer (optional), Projektbeschreibung.",
          "Zweck: Bearbeitung Ihrer Anfrage, Angebotserstellung, Kommunikation. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO.",
          "Speicherung: Supabase/PostgreSQL in der EU-Region (eu-west-1). E-Mail-Versand über Resend Inc. (USA, SCC).",
          "Die Daten werden gelöscht, sobald sie für den Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        ] },
      { id: "ki-chat", heading: "6. KI-Berater (Live-Chat)",
        paragraphs: [
          "Der KI-Berater ist ein Large Language Model, das über den Routing-Dienst 9Router sowie die Modell-Anbieter DeepSeek (Volksrepublik China), OpenRouter (USA) und Upstage (Südkorea) betrieben wird. Ihre Chat-Nachrichten werden zur Beantwortung an das Modell übermittelt.",
          "Es werden keine Chat-Inhalte zum Training der KI-Modelle verwendet. Eine Speicherung erfolgt ausschließlich zur Fehleranalyse und Qualitätssicherung, maximal 12 Monate.",
          "Bitte geben Sie im Chat keine Passwörter, Zahlungsdaten, Gesundheitsdaten oder sonstigen besonders sensiblen Daten (Art. 9 DSGVO) an.",
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung Ihrer Anfragen). Bei Drittlandübermittlung: Art. 44 ff. DSGVO mit geeigneten Garantien.",
        ] },
      { id: "empfaenger", heading: "7. Auftragsverarbeiter",
        paragraphs: ["Folgende Auftragsverarbeiter (Art. 28 DSGVO) sind eingesetzt. Mit allen wurden AVV geschlossen:"],
        bullets: [
          "Vercel Inc. (USA) – Hosting und Deployment (SCC)",
          "Cloudflare Inc. (USA) – CDN, WAF, DNS (SCC)",
          "Resend Inc. (USA) – Versand von E-Mails (SCC)",
          "Supabase Inc. (USA) – Datenbank, EU-Region (SCC)",
          "DeepSeek, OpenRouter und Upstage (über 9Router) – LLM-Inferenz, Embeddings und Textanalyse (geeignete Garantien)",
          "Hetzner GmbH (DE) – VPS-Hosting für interne Dienste",
        ] },
      { id: "drittland", heading: "8. Drittlandübermittlung",
        paragraphs: [
          "Übermittlungen personenbezogener Daten in Drittländer (insbesondere USA und China) erfolgen ausschließlich auf Grundlage von",
        ],
        bullets: [
          "Angemessenheitsbeschlüssen der EU-Kommission (Art. 45 DSGVO) – soweit vorliegend",
          "EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) mit zusätzlichen technischen und organisatorischen Maßnahmen (TOMs)",
          "Im Übrigen nur bei Vorliegen einer Rechtsgrundlage nach Art. 49 DSGVO",
        ] },
      { id: "cookies", heading: "9. Cookies und lokale Speicherung",
        paragraphs: [
          "Details zu eingesetzten Cookies, Speicherungen und Einwilligungsverwaltung entnehmen Sie bitte der Cookie-Richtlinie.",
          "Kurzfassung: Technisch notwendige Speicherungen erfolgen ohne Einwilligung (§ 25 Abs. 2 TTDSG); alle übrigen nur mit Ihrer Einwilligung (§ 25 Abs. 1 TTDSG i. V. m. Art. 6 Abs. 1 lit. a DSGVO).",
          "Es werden keine Tracking-Cookies von Drittanbietern (Google Analytics, Meta-Pixel, LinkedIn Insight) eingesetzt.",
        ] },
      { id: "betroffenenrechte", heading: "10. Ihre Rechte als betroffene Person",
        paragraphs: [
          "Ihnen stehen folgende Rechte zu (Art. 15–22 DSGVO):",
          "Anfragen richten Sie bitte an: mail@nexifyai.cloud. Wir bearbeiten Anfragen innerhalb von einem Monat (Art. 12 Abs. 3 DSGVO).",
        ],
        bullets: [
          "Auskunft über verarbeitete Daten (Art. 15 DSGVO)",
          "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
          "Löschung („Recht auf Vergessenwerden“, Art. 17 DSGVO)",
          "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
          "Datenübertragbarkeit (Art. 20 DSGVO)",
          "Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)",
          "Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)",
          "Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)",
        ],
      },
      { id: "speicherdauer", heading: "11. Speicherdauer",
        paragraphs: [
          "Korrespondenz und Vertragsunterlagen: 7 Jahre (niederländische Aufbewahrungspflichten, u. a. Art. 52 Abs. 4 Niederländische Steuergesetze)",
          "Server-Logfiles: 30 Tage",
          "Chat-Protokolle (KI-Berater): maximal 12 Monate",
          "Cookie-Präferenzen: bis zum Löschen durch den Nutzer",
          "Nach Ablauf der Fristen werden die Daten routinemäßig gelöscht, sofern keine berechtigte Aufbewahrung (z. B. Rechtsverteidigung) besteht.",
        ] },
      { id: "sicherheit", heading: "12. Technische und organisatorische Maßnahmen (TOM)",
        paragraphs: [
          "Wir setzen dem Stand der Technik entsprechende Maßnahmen zum Schutz Ihrer Daten ein (Art. 32 DSGVO):",
        ],
        bullets: [
          "TLS 1.3-Verschlüsselung und HSTS für die gesamte Website",
          "Content Security Policy (CSP) gegen Injection-Angriffe",
          "Zwei-Faktor-Authentifizierung für alle administrativen Zugänge",
          "Regelmäßige Updates und automatisierte Sicherheits-Scans (Dependabot, CodeQL)",
          "Gekürzte IP-Adressen in Logfiles",
          "Zugriffskonzept: Zugriff auf personenbezogene Daten nur nach Bedarf",
        ] },
      { id: "newsletter", heading: "13. Newsletter (kein Einsatz)",
        paragraphs: [
          "Wir versenden derzeit keinen Newsletter. Sollte sich dies ändern, erfolgt die Anmeldung ausschließlich im Double-Opt-in-Verfahren (Art. 6 Abs. 1 lit. a DSGVO) mit dokumentierter Einwilligung.",
        ] },
      { id: "aenderungen", heading: "14. Änderungen dieser Datenschutzerklärung",
        paragraphs: [
          "Diese Datenschutzerklärung wird bei rechtlichen oder technischen Änderungen angepasst. Die jeweils aktuelle Fassung ist unter https://www.nexifyai.cloud/datenschutz abrufbar.",
          "Stand: 4. August 2026.",
        ] },
    ],
  },

  agb: {
    slug: "agb", title: "Allgemeine Geschäftsbedingungen (B2B)",
    intro: "Diese AGB gelten für sämtliche Leistungen von NeXify AI gegenüber Unternehmern (§ 14 BGB), juristischen Personen des öffentlichen Rechts und öffentlich-rechtlichen Sondervermögen. Verbraucherverträge (§ 13 BGB) werden nicht geschlossen.",
    updated: "5. August 2026",
    related: [{ label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }, { label: "AVV", href: "/avv" }, { label: "Widerruf", href: "/widerruf" }, { label: "KI-Hinweise", href: "/ki-hinweise" }],
    sections: [
      { id: "geltung", heading: "§ 1 Geltungsbereich",
        paragraphs: [
          "Diese AGB gelten für alle Verträge, Angebote und sonstigen Leistungen zwischen NeXify AI (nachfolgend „Auftragnehmer“) und dem Auftraggeber.",
          "Abweichende oder entgegenstehende AGB des Auftraggebers werden nicht Vertragsbestandteil, es sei denn, der Auftragnehmer stimmt ihrer Geltung ausdrücklich schriftlich zu (§ 305 Abs. 3 BGB).",
        ] },
      { id: "vertragsschluss", heading: "§ 2 Vertragsschluss",
        paragraphs: [
          "Angebote des Auftragnehmers sind freibleibend und unverbindlich, sofern nicht ausdrücklich anders bezeichnet. Schriftliche Angebote sind gemäß § 4.6 für 14 Kalendertage ab Ausstellungsdatum verbindlich.",
          "Ein Vertrag kommt durch schriftliche Auftragsbestätigung des Auftragnehmers oder durch Aufnahme der Leistungserbringung zustande.",
          "KI-gestützte Angebotskalkulationen (Angebots-Generator) sind unverbindliche Richtwerte und stellen kein bindendes Angebot dar.",
          "Nebenabreden und Änderungen bedürfen der Textform.",
        ] },
      { id: "leistung", heading: "§ 3 Leistungsumfang",
        paragraphs: [
          "Der Leistungsumfang ergibt sich aus der Leistungsbeschreibung im jeweiligen Angebot bzw. der Auftragsbestätigung.",
          "Gegenstand sind insbesondere: Konzeption, Entwicklung, Integration und Betrieb von KI-Agenten, Automatisierungen, Websites und Webanwendungen.",
          "Nicht enthalten sind – sofern nicht gesondert vereinbart – laufende Hostingkosten, Drittdienstleistungen (z. B. API-Gebühren), Domaingebühren und Wartungsleistungen.",
          "Die tägliche Leistungserbringung wird durch Tagesberichte dokumentiert; der Tagesbericht dient zugleich als Leistungsnachweis (siehe § 4.1).",
        ] },
      { id: "verguetung", heading: "§ 4 Vergütung, Tagesabrechnung und Projektkontinuität",
        paragraphs: [
          "(1) NeXify AI erbringt Leistungen zum vereinbarten Netto-Tagessatz (derzeit 449,00 € zzgl. anwendbarer Umsatzsteuer). Der Tagessatz gilt je angefangenem, vollständigem Arbeitstag und ist im schriftlich bestätigten Projektauftrag festgehalten.",
          "(2) Das Vergütungsmodell von NeXify AI basiert auf dem Prinzip der vollständigen täglichen Transparenz: Der Auftraggeber erhält täglich einen detaillierten Leistungsnachweis (Tagesbericht) und zahlt ausschließlich für tatsächlich erbrachte und dokumentierte Arbeit. Es entstehen keine verdeckten Kosten, keine Pauschalierungen und kein Risiko unerwarteter Nachrechnungen.",
          "(3) Es gibt keinen Mindestabrechnungszeitraum über einen Arbeitstag hinaus. Der Auftraggeber kann das Projekt täglich mit dem Abschluss eines Arbeitstages ohne weitere Verpflichtung pausieren oder beenden, sofern alle bis dahin fälligen Rechnungen beglichen sind.",
        ],
        subsections: [
          { id: "tagesbericht", heading: "§ 4.1 Tagesbericht als Leistungsnachweis",
            paragraphs: [
              "(1) NeXify AI übermittelt dem Auftraggeber jeweils am Ende jedes Arbeitstages, spätestens bis 20:00 Uhr, einen Tagesbericht in digitaler Form (PDF per E-Mail und/oder im Kundenportal). Der Tagesbericht enthält: eine übersichtliche Zusammenfassung der an diesem Tag erbrachten Leistungen, den aktuellen Projektstand und die erreichten Zwischenergebnisse, konkrete nächste Schritte für den Folgetag sowie etwaige Abhängigkeiten, Rückfragen oder Entscheidungsbedarfe.",
              "(2) Der Tagesbericht dient gleichzeitig als Leistungsnachweis im Sinne des Werkvertrags- und Dienstleistungsrechts. Mit dem Versand des Tagesberichts gilt die Leistung des jeweiligen Arbeitstages als erbracht und zur Abrechnung freigegeben.",
              "(3) Einwände gegen den Inhalt des Tagesberichts sind dem Auftraggeber innerhalb von 24 Stunden nach Empfang schriftlich mitzuteilen. Widerspricht der Auftraggeber nicht innerhalb dieser Frist, gilt der im Tagesbericht beschriebene Leistungsumfang als anerkannt.",
            ] },
          { id: "faelligkeit", heading: "§ 4.2 Sofortige Fälligkeit und Zahlungsmodalitäten",
            paragraphs: [
              "(1) Jede Tagesrechnung ist sofort fällig. Der Rechnungsbetrag ist bis spätestens 09:00 Uhr des unmittelbar folgenden Arbeitstages auf dem angegebenen Konto von NeXify AI in voller Höhe zu entrichten.",
              "(2) Die Rechnung wird gemeinsam mit dem Tagesbericht versendet und enthält einen direkten Online-Zahlungslink (Revolut Pay / Kartenzahlung / Banküberweisung), der eine sofortige 1-Klick-Zahlung ermöglicht. Alternativ steht die im Rechnungsdokument angegebene IBAN für Überweisungen zur Verfügung.",
              "(3) Als Zahlungseingang gilt der Zeitpunkt der Gutschrift auf dem Konto von NeXify AI, nicht der Zeitpunkt der Auslösung der Zahlung durch den Auftraggeber. Bei SEPA-Überweisungen ist daher eine ausreichende Vorlaufzeit einzuplanen; die Nutzung des bereitgestellten Online-Zahlungslinks wird ausdrücklich empfohlen.",
              "(4) Alle Rechnungen werden unter einer fortlaufenden, unveränderlichen Rechnungsnummer im Format NEXIFY-YYYY-NNNNN ausgestellt. Die Rechnungsnummernvergabe ist lückenlos und nicht rückdatierbar.",
            ] },
          { id: "umsatzsteuer", heading: "§ 4.3 Umsatzsteuer und grenzüberschreitende Leistungen",
            paragraphs: [
              "(1) Alle genannten Preise und Tagessätze verstehen sich als Netto-Beträge zzgl. der jeweils geltenden Umsatzsteuer. NeXify AI ist in den Niederlanden umsatzsteuerlich registriert (BTW NL865786276B01).",
              "(2) Für Leistungen an Unternehmen (B2B) mit Sitz in einem anderen EU-Mitgliedstaat und gültiger Umsatzsteuer-Identifikationsnummer (USt-IdNr.) gilt das Reverse-Charge-Verfahren nach Art. 196 MwStSystRL: Die Umsatzsteuer wird in diesem Fall nicht von NeXify AI berechnet; der Auftraggeber schuldet die Umsatzsteuer in seinem Ansässigkeitsstaat selbst. Die Rechnung weist in diesem Fall den Hinweis „Steuerschuldnerschaft des Leistungsempfängers“ aus.",
              "(3) Für Leistungen an Auftraggeber mit Sitz in den Niederlanden wird die niederländische BTW (21 %) berechnet und ausgewiesen.",
              "(4) NeXify AI richtet sich ausschließlich an Unternehmer im Sinne des § 2 UStG (DE) / Art. 7 Wet OB 1968 (NL). Eine Erbringung von Leistungen an Verbraucher (B2C) findet nicht statt.",
            ] },
          { id: "kontinuitaet", heading: "§ 4.4 Projektkontinuität und Zahlungsverzug",
            paragraphs: [
              "(1) Die pünktliche Zahlung ist die Grundlage der nahtlosen Projektfortsetzung: NeXify AI plant die Arbeitskapazität des Folgetages auf Basis des bestätigten Zahlungseingangs. Diese Struktur gewährleistet, dass dem Auftraggeber stets volle Ressourcen und volle Aufmerksamkeit gewidmet werden können.",
              "(2) Liegt bis 09:00 Uhr des Folgearbeitstages kein vollständiger Zahlungseingang für die vorangegangene Tagesrechnung vor, sendet NeXify AI zunächst eine freundliche automatische Zahlungserinnerung an den Auftraggeber. Die Arbeit wird in dieser Zeit in den Wartemodus versetzt; die Arbeitsaufnahme erfolgt unverzüglich nach bestätigtem Zahlungseingang.",
              "(3) Bleibt die Zahlung auch nach der Erinnerung aus, ist NeXify AI berechtigt, die Leistungserbringung bis zum vollständigen Zahlungseingang zu unterbrechen, ohne dass dies als Vertragsverletzung seitens NeXify AI gewertet werden kann.",
              "(4) Ab dem ersten Werktag nach Ablauf der Zahlungsfrist gerät der Auftraggeber ohne weitere Mahnung in Verzug (§ 286 Abs. 2 Nr. 1 BGB analog / Art. 6:83 BW). Ab Verzugseintritt werden Verzugszinsen in Höhe von 9 Prozentpunkten über dem jeweiligen Basiszinssatz (DE: § 247 BGB; NL: Wettelijk handelsrente) fällig. NeXify AI behält sich die Geltendmachung weiterer Verzugsschäden ausdrücklich vor.",
              "(5) Erbringt NeXify AI Vorleistungen (z. B. Konzepte, Skizzen, Code-Entwürfe) auf Basis noch nicht beglichener Tagesrechnungen, entsteht hieraus kein Anspruch auf kostenlose Weiterverwendung dieser Vorleistungen. Alle im Rahmen des Projekts erstellten Arbeitsergebnisse verbleiben bis zum vollständigen Zahlungsausgleich im Eigentum von NeXify AI.",
            ] },
          { id: "projektstart", heading: "§ 4.5 Projektstart und erste Tagesrechnung",
            paragraphs: [
              "(1) Die erste Tagesrechnung wird für den ersten tatsächlichen Arbeitstag ausgestellt, unmittelbar nachdem die Auftragsbestätigung des Auftraggebers vorliegt und die Arbeit aufgenommen wurde.",
              "(2) NeXify AI beginnt in der Regel am nächsten Werktag nach schriftlicher Auftragsbestätigung mit der Arbeit, sofern keine anderweitige Vereinbarung getroffen wurde.",
              "(3) Für die Erstellung und Zusendung des initialen Konzepts oder Projektplans (sofern im Auftragsumfang enthalten) gilt ebenso die Tagesabrechnung. Der Auftraggeber erhält mit dem ersten Tagesbericht eine vollständige Übersicht aller an diesem Tag durchgeführten Analyse-, Planungs- und Konzeptionsleistungen.",
            ] },
          { id: "angebote", heading: "§ 4.6 Angebote und Kostenrahmen",
            paragraphs: [
              "(1) Alle Angebote von NeXify AI sind 14 Kalendertage ab Ausstellungsdatum verbindlich, sofern keine andere Frist angegeben ist.",
              "(2) Angebote enthalten eine realistische Aufwandsspanne in Arbeitstagen. Ein verbindlicher Gesamtfestpreis wird vereinbart, sobald Umfang, Inhalte, Integrationen und Abnahmekriterien abschließend schriftlich festgelegt sind.",
              "(3) Entsteht während der Projektlaufzeit Mehrbedarf, der über den ursprünglich vereinbarten Umfang hinausgeht, wird dieser vor Ausführung transparent angezeigt und erst nach schriftlicher Freigabe durch den Auftraggeber realisiert. Niemals nach der Ausführung.",
            ] },
        ] },
      { id: "mitwirkung", heading: "§ 5 Mitwirkungspflichten des Auftraggebers",
        paragraphs: [
          "Der Auftraggeber stellt alle für die Leistungserbringung erforderlichen Inhalte, Zugänge, Daten und Rechte rechtzeitig und vollständig bereit.",
          "Verzögerungen durch verspätete oder unvollständige Mitwirkung verschieben vereinbarte Termine angemessen; hierdurch entstehender Mehraufwand wird gesondert nach § 4 vergütet.",
          "Der Auftraggeber ist verpflichtet, dem Auftragnehmer die Nutzung der vertragsgegenständlichen Systeme und Daten zu gestatten, soweit dies für die Leistungserbringung erforderlich ist.",
        ] },
      { id: "ki", heading: "§ 6 KI-gestützte Arbeitsweise",
        paragraphs: [
          "Der Auftragnehmer setzt zur Leistungserbringung KI-Werkzeuge (Large Language Models, Code-Assistenten) ein, um Effizienz und Qualität zu steigern.",
          "Die fachliche Letztverantwortung für alle erbrachten Leistungen verbleibt beim Auftragnehmer; KI-Ergebnisse werden vor Auslieferung geprüft.",
          "Der Auftraggeber wird über den Einsatz von KI in der Leistungserbringung gemäß den KI-Hinweisen informiert.",
          "Keine Verwendung von vertraulichen oder personenbezogenen Daten des Auftraggebers zum Training öffentlicher KI-Modelle.",
        ] },
      { id: "abnahme", heading: "§ 7 Abnahme und Mängelansprüche",
        paragraphs: [
          "Nach Fertigstellung erhält der Auftraggeber die Leistung zur Prüfung. Die Prüffrist beträgt 14 Kalendertage.",
          "Erfolgt innerhalb der Prüffrist keine Rüge in Textform, gilt die Leistung als abgenommen.",
          "Die gesetzlichen Mängelgewährleistungsrechte (§§ 634 ff. BGB) gelten entsprechend. Der Auftragnehmer ist berechtigt, zunächst Nacherfüllung zu leisten.",
          "Mängelansprüche verjähren nach den gesetzlichen Vorschriften; bei B2B gilt die gesetzliche Verjährungsfrist.",
        ] },
      { id: "haftung", heading: "§ 8 Haftung",
        paragraphs: [
          "Der Auftragnehmer haftet unbeschränkt bei Vorsatz, grober Fahrlässigkeit, arglistigem Verschweigen von Mängeln sowie bei Verletzung von Leben, Körper oder Gesundheit.",
          "Bei leichter Fahrlässigkeit haftet der Auftragnehmer nur für die Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und nur auf den vertragstypisch vorhersehbaren Schaden, begrenzt auf die Höhe der vereinbarten Vergütung.",
          "Die Haftung für mittelbare Schäden, entgangenen Gewinn und Datenverlust ist – soweit gesetzlich zulässig – ausgeschlossen.",
          "Die vorstehenden Haftungsbeschränkungen gelten nicht bei zwingender gesetzlicher Haftung (insbesondere Produkthaftung).",
        ] },
      { id: "rechte", heading: "§ 9 Nutzungsrechte",
        paragraphs: [
          "Mit vollständiger Zahlung der Vergütung erhält der Auftraggeber die vertraglich vereinbarten, zeitlich und räumlich unbeschränkten Nutzungsrechte an den individuell erstellten Leistungen.",
          "Open-Source-Software und Drittdienste unterliegen deren jeweiligen Lizenzen.",
          "Bis zur vollständigen Zahlung verbleiben sämtliche Rechte beim Auftragnehmer (Eigentumsvorbehalt analog § 449 BGB).",
        ] },
      { id: "vertraulichkeit", heading: "§ 10 Vertraulichkeit",
        paragraphs: [
          "Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei ausschließlich zur Vertragserfüllung zu verwenden und sie vor unbefugtem Zugriff Dritter zu schützen.",
          "Die Vertraulichkeitsverpflichtung besteht über das Vertragsende hinaus fort.",
          "Von der Vertraulichkeit ausgenommen sind Informationen, die bereits öffentlich bekannt sind oder dem Empfänger nachweislich bereits bekannt waren.",
        ] },
      { id: "referenz", heading: "§ 11 Referenznennung",
        paragraphs: [
          "Der Auftragnehmer ist berechtigt, den Auftraggeber und die erbrachte Leistung in Referenzlisten, Portfolio und Social-Media-Präsenzen zu nennen, sofern der Auftraggeber nicht innerhalb von 14 Tagen nach Vertragsschluss widerspricht.",
        ] },
      { id: "schluss", heading: "§ 12 Schlussbestimmungen",
        paragraphs: [
          "Es gilt das Recht der Niederlande unter Ausschluss des UN-Kaufrechts (CISG).",
          "Gerichtsstand für alle Streitigkeiten ist – soweit gesetzlich zulässig – Venlo, Niederlande.",
          "Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam. An die Stelle der unwirksamen Bestimmung tritt die gesetzliche Regelung (§ 306 BGB analog).",
        ] },
    ],
  },

  avv: {
    slug: "avv", title: "Auftragsverarbeitungsvertrag (AVV / DPA)",
    intro: "Vereinbarung über die Verarbeitung personenbezogener Daten gemäß Art. 28 DSGVO. Dieser AVV ist Bestandteil aller Verträge, bei denen der Auftragnehmer personenbezogene Daten im Auftrag des Auftraggebers verarbeitet.",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "AGB", href: "/agb" }, { label: "Impressum", href: "/impressum" }],
    sections: [
      { id: "gegenstand", heading: "§ 1 Gegenstand und Dauer",
        paragraphs: [
          "Der Auftragnehmer verarbeitet personenbezogene Daten des Auftraggebers ausschließlich weisungsgebunden im Rahmen des Hauptvertrags.",
          "Gegenstand der Verarbeitung: Kunden-, Interessenten- und Nutzerdaten, die im Rahmen der vertraglichen Leistungen verarbeitet werden.",
          "Dauer der Verarbeitung: Laufzeit des Hauptvertrags zuzüglich gesetzlicher Aufbewahrungsfristen.",
        ] },
      { id: "pflichten", heading: "§ 2 Pflichten des Auftragnehmers",
        bullets: [
          "Weisungsgebundene Verarbeitung (Art. 28 Abs. 3 lit. a DSGVO)",
          "Verpflichtung des Personals auf Vertraulichkeit (Art. 28 Abs. 3 lit. b DSGVO)",
          "Umsetzung technischer und organisatorischer Maßnahmen gemäß Art. 32 DSGVO",
          "Unterstützung bei der Erfüllung von Betroffenenrechten (Art. 15–22 DSGVO)",
          "Unterstützung bei Datenschutz-Folgenabschätzungen (Art. 35, 36 DSGVO)",
          "Löschung oder Rückgabe aller Daten nach Vertragsende (Art. 28 Abs. 3 lit. g DSGVO)",
          "Nachweis der Einhaltung auf Anforderung (Art. 28 Abs. 3 lit. h DSGVO)",
        ] },
      { id: "uav", heading: "§ 3 Unterauftragsverarbeiter",
        paragraphs: [
          "Folgende Unterauftragsverarbeiter (Sub-Processor) sind aktuell eingesetzt: Vercel Inc., Cloudflare Inc., Supabase Inc., Resend Inc., DeepSeek, OpenRouter und Upstage (über 9Router), Hetzner GmbH.",
          "Änderungen der Unterauftragsverarbeiter werden dem Auftraggeber mit einer Frist von 14 Tagen in Textform angekündigt. Erfolgt kein Widerspruch, gilt die Änderung als genehmigt.",
          "Mit allen Unterauftragsverarbeitern bestehen vertragliche Verpflichtungen auf dem Niveau dieses AVV.",
        ] },
      { id: "rechte", heading: "§ 4 Rechte der betroffenen Personen",
        paragraphs: [
          "Der Auftragnehmer unterstützt den Auftraggeber nach Maßgabe des Art. 28 Abs. 3 lit. e DSGVO bei der Beantwortung von Anfragen betroffener Personen.",
          "Gehen Betroffenenanfragen unmittelbar beim Auftragnehmer ein, werden sie unverzüglich – spätestens innerhalb von 3 Werktagen – an den Auftraggeber weitergeleitet.",
        ] },
      { id: "verletzung", heading: "§ 5 Verletzung des Schutzes personenbezogener Daten (Data Breach)",
        paragraphs: [
          "Der Auftragnehmer meldet Verletzungen des Schutzes personenbezogener Daten (Art. 33 DSGVO) unverzüglich – spätestens innerhalb von 48 Stunden nach Kenntnis – an den Auftraggeber.",
          "Die Meldung enthält die nach Art. 33 Abs. 3 DSGVO erforderlichen Angaben, soweit sie dem Auftragnehmer vorliegen.",
        ] },
      { id: "audit", heading: "§ 6 Audit- und Nachweispflichten",
        paragraphs: [
          "Der Auftraggeber ist berechtigt, die Einhaltung der datenschutzrechtlichen Pflichten im erforderlichen Umfang zu prüfen (Art. 28 Abs. 3 lit. h DSGVO).",
          "Auf Anforderung übergibt der Auftragnehmer geeignete Nachweise (z. B. Sicherheitskonzept, Zertifizierungen, TOM-Dokumentation).",
        ] },
      { id: "schluss", heading: "§ 7 Vertragsende und Löschung",
        paragraphs: [
          "Nach Vertragsende werden alle personenbezogenen Daten gelöscht oder an den Auftraggeber zurückgegeben; eine Kopie verbleibt nur, soweit gesetzliche Aufbewahrungspflichten bestehen.",
          "Auf Wunsch des Auftraggebers wird die Löschung schriftlich bestätigt.",
        ] },
    ],
  },

  widerruf: {
    slug: "widerruf", title: "Widerrufsrecht",
    intro: "Hinweis zum Widerrufsrecht: NeXify AI schließt Verträge ausschließlich im B2B-Bereich (Unternehmer nach § 14 BGB). Verbrauchern (§ 13 BGB) wird kein Vertrag angeboten.",
    updated: "4. August 2026",
    related: [{ label: "AGB", href: "/agb" }, { label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }],
    sections: [
      { id: "kein-verbraucher", heading: "§ 1 Kein gesetzliches Verbraucherwiderrufsrecht",
        paragraphs: [
          "Das gesetzliche Widerrufsrecht für Verbraucher (§§ 312g, 355 BGB) findet ausschließlich auf Verbraucherverträge Anwendung.",
          "Da NeXify AI ausschließlich Verträge mit Unternehmern schließt, besteht ein gesetzliches Widerrufsrecht nicht.",
        ] },
      { id: "ausnahme", heading: "§ 2 Ausnahmefall: irrtümlich geschlossener Verbrauchervertrag",
        paragraphs: [
          "Sollte ausnahmsweise ein Vertrag mit einem Verbraucher zustande kommen (z. B. durch Bestellungen über automatisierte Kanäle), steht dem Verbraucher das gesetzliche Widerrufsrecht nach §§ 312g, 355 BGB zu.",
          "In diesem Fall gilt: Widerrufsfrist 14 Tage ab Vertragsschluss; Widerruf in Textform an mail@nexifyai.cloud; Erstattung innerhalb von 14 Tagen nach Zugang des Widerrufs.",
          "Für bereits erbrachte digitale Leistungen kann eine Wertersatzpflicht bestehen (§ 357 Abs. 8 BGB).",
        ] },
      { id: "storno", heading: "§ 3 Freiwilliges Stornorecht (Kulanzregelung)",
        paragraphs: [
          "Vor Beginn der Leistungserbringung kann der Auftraggeber den Auftrag jederzeit kostenfrei stornieren.",
          "Nach Leistungsbeginn werden bereits erbrachte Leistungen anteilig nach § 4 AGB abgerechnet.",
          "Diese Kulanzregelung stellt kein gesetzliches Widerrufsrecht dar und kann jederzeit geändert werden.",
        ] },
    ],
  },

  "cookie-richtlinie": {
    slug: "cookie-richtlinie", title: "Cookie-Richtlinie",
    intro: "Informationen über Cookies und ähnliche Speichertechnologien gemäß § 25 TTDSG und Art. 5, 6 DSGVO. Grundsatz: Nur das technisch Notwendige ohne Einwilligung — alles andere nur mit Ihrer Zustimmung.",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "Impressum", href: "/impressum" }, { label: "KI-Hinweise", href: "/ki-hinweise" }],
    sections: [
      { id: "grundlagen", heading: "§ 1 Rechtsgrundlagen",
        paragraphs: [
          "Technisch notwendige Speicherungen: § 25 Abs. 2 TTDSG (keine Einwilligung erforderlich).",
          "Alle übrigen Speicherungen: § 25 Abs. 1 TTDSG i. V. m. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung erforderlich).",
          "Die Einwilligung wird über den Cookie-Banner („Cookie-Einstellungen“) verwaltet und dokumentiert.",
        ] },
      { id: "eingesetzt", heading: "§ 2 Eingesetzte Speicherungen",
        paragraphs: ["Diese Website verwendet ausschließlich folgende Speicherungen:"],
        bullets: [
          "nexify-lang (localStorage) – Speicherung der Sprachwahl",
          "nexify-consent (localStorage) – Speicherung der Cookie-Präferenzen",
          "NEXT_LOCALE (Cookie) – Session-basierte Spracherkennung",
          "Cloudflare __cf_bm (Cookie, 30 Minuten) – Bot-Schutz und Missbrauchsabwehr",
        ] },
      { id: "drittanbieter", heading: "§ 3 Keine Tracking- oder Marketing-Cookies",
        paragraphs: [
          "Es werden KEINE Cookies oder Tracking-Pixel von Google Analytics, Meta (Facebook/Instagram), LinkedIn, TikTok oder Werbenetzwerken eingesetzt.",
          "Unser Geschäftsmodell basiert auf direkten B2B-Beziehungen — nicht auf nutzungsbasierter Werbung.",
          "Es findet kein Cross-Site-Tracking statt.",
        ] },
      { id: "verwaltung", heading: "§ 4 Verwaltung und Widerruf",
        paragraphs: [
          "Ihre Cookie-Einstellungen können Sie jederzeit über „Cookie-Einstellungen“ im Footer anpassen oder widerrufen.",
          "Alternativ können Sie Speicherungen über die Einstellungen Ihres Browsers löschen oder blockieren.",
          "Der Widerruf einer Einwilligung berührt nicht die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung (Art. 7 Abs. 3 DSGVO).",
        ] },
    ],
  },

  "ki-hinweise": {
    slug: "ki-hinweise", title: "KI-Hinweise und Transparenz",
    intro: "Informationen zum Einsatz Künstlicher Intelligenz gemäß Art. 50 EU AI Act (Verordnung (EU) 2024/1689) und der KI-Transparenzpflichten. Wir setzen KI offen, gekennzeichnet und unter menschlicher Kontrolle ein.",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "AGB", href: "/agb" }, { label: "Impressum", href: "/impressum" }],
    sections: [
      { id: "transparenz", heading: "§ 1 Sie interagieren mit KI-Systemen",
        paragraphs: [
          "Der KI-Berater auf dieser Website ist ein Large Language Model (LLM). Die Kommunikation erfolgt automatisiert; eine menschliche Übernahme ist jederzeit möglich (E-Mail: mail@nexifyai.cloud, Telefon: +31 6 133 188 56).",
          "Die Kennzeichnung erfolgt gemäß Art. 50 Abs. 1 EU AI Act (Transparenzpflicht bei Interaktion mit KI-Systemen).",
        ] },
      { id: "einsatz", heading: "§ 2 Einsatzbereiche von KI",
        bullets: [
          "KI-Berater (Live-Chat) – Erstqualifizierung und Beantwortung von Anfragen",
          "Code-Generierung – Entwicklungsunterstützung, stets menschengeprüft",
          "Bildgenerierung – Marketing-Assets, als KI-generiert gekennzeichnet",
          "E-Mail-Vorsortierung – KI-gestützte Kategorisierung eingehender Anfragen",
          "Angebotserstellung – KI-unterstützte Kalkulation, abschließend durch den Inhaber freigegeben",
        ] },
      { id: "risiken", heading: "§ 3 Risiken und Grenzen von KI-Systemen",
        paragraphs: [
          "KI-Systeme können fehlerhafte oder erfundene Informationen liefern (sog. Halluzinationen).",
          "Bitte treffen Sie keine geschäftlichen Entscheidungen ausschließlich auf Basis von KI-Ausgaben.",
          "Bei Unsicherheit über die Richtigkeit einer Antwort wenden Sie sich bitte an mail@nexifyai.cloud.",
        ] },
      { id: "mensch", heading: "§ 4 Menschliche Kontrolle (Human-in-the-Loop)",
        paragraphs: [
          "Alle KI-generierten Ergebnisse werden vor Auslieferung an Kunden durch den Inhaber Pascal Courbois geprüft und freigegeben.",
          "KI unterstützt die Arbeitsweise — die Letztentscheidung liegt stets beim Menschen.",
        ] },
      { id: "daten", heading: "§ 5 Datenverarbeitung durch KI",
        paragraphs: [
          "Personenbezogene Daten, die im Rahmen von KI-gestützten Leistungen verarbeitet werden, unterliegen der Datenschutzerklärung und dem AVV.",
          "Es erfolgt kein Training von KI-Modellen mit Ihren Daten, es sei denn, dies ist ausdrücklich und schriftlich vereinbart.",
        ] },
    ],
  },

};
