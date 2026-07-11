import { company } from "@/lib/site-data";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPage = {
  slug: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export const legalPages: Record<string, LegalPage> = {
  impressum: {
    slug: "impressum",
    title: "Impressum",
    intro: "Anbieterkennzeichnung und Kontaktinformationen von NeXifyAI by NeXify – Chat it. Automate it.",
    updated: "20. Juni 2026",
    sections: [
      {
        heading: "Angaben zum Unternehmen",
        paragraphs: [
          `${company.legalName}`,
          `${company.legalForm}, Inhaber: ${company.owner}`,
          `${company.address}, ${company.postalCity}, ${company.country}`,
        ],
      },
      {
        heading: "Kontakt",
        paragraphs: [`E-Mail: ${company.email}`, `Telefon: ${company.phone}`, `Web: nexifyai.cloud`],
      },
      {
        heading: "Register- und Steuerangaben",
        paragraphs: [
          `Kamer van Koophandel (KvK): ${company.kvk}`,
          `BTW-Identifikationsnummer: ${company.vatId}`,
          "Tätigkeitsbereich: IT-Beratung, AI-gestützte Automatisierung und Softwareentwicklung.",
        ],
      },
      {
        heading: "Vertretung und redaktionelle Verantwortung",
        paragraphs: [
          `${company.owner}, Inhaber / Directeur.`,
          `Verantwortlich für redaktionelle Inhalte: ${company.owner}, Anschrift wie oben.`,
        ],
      },
      {
        heading: "B2B-Ausrichtung",
        paragraphs: [
          "Das Angebot richtet sich ausschließlich an Unternehmer, juristische Personen des öffentlichen Rechts und vergleichbare Organisationen, die in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit handeln.",
        ],
      },
      {
        heading: "Haftung für Inhalte und Links",
        paragraphs: [
          "Die Inhalte dieser Website werden mit Sorgfalt erstellt. Eine Gewähr für Richtigkeit, Vollständigkeit und Aktualität wird nur übernommen, soweit dies ausdrücklich vereinbart oder gesetzlich zwingend ist.",
          "Verlinkte externe Angebote unterliegen der Verantwortung ihrer jeweiligen Betreiber. Rechtswidrige Inhalte werden nach Kenntnis und angemessener Prüfung entfernt oder die Verlinkung beendet.",
        ],
      },
      {
        heading: "Online-Streitbeilegung",
        paragraphs: [
          "Da NeXifyAI ausschließlich B2B-Leistungen anbietet, besteht keine Teilnahme an Verbraucherschlichtungsverfahren. Anfragen zu Verträgen oder Leistungen können direkt an die oben genannte E-Mail-Adresse gerichtet werden.",
        ],
      },
    ],
  },
  datenschutz: {
    slug: "datenschutz",
    title: "Datenschutzerklärung",
    intro: "Informationen zur Verarbeitung personenbezogener Daten auf dieser Website und im Rahmen geschäftlicher Anfragen.",
    updated: "20. Juni 2026",
    sections: [
      {
        heading: "1. Verantwortlicher",
        paragraphs: [
          `${company.legalName}, ${company.address}, ${company.postalCity}, ${company.country}.`,
          `Inhaber: ${company.owner}. Kontakt: ${company.email}, ${company.phone}.`,
        ],
      },
      {
        heading: "2. Grundsätze",
        paragraphs: [
          "NeXifyAI verarbeitet personenbezogene Daten zweckgebunden, verhältnismäßig und nur so lange, wie dies für den jeweiligen Zweck, gesetzliche Pflichten oder die Wahrung berechtigter Interessen erforderlich ist.",
          "Diese Website ist grundsätzlich ohne Nutzerkonto und ohne Marketing-Tracking nutzbar. Nicht notwendige Analyse- oder Werbecookies werden nicht standardmäßig eingesetzt.",
        ],
      },
      {
        heading: "3. Hosting und technische Protokolldaten",
        paragraphs: [
          "Beim Aufruf können technisch erforderliche Daten verarbeitet werden, insbesondere IP-Adresse, Zeitpunkt, aufgerufene Ressource, Referrer, Browser-/Geräteinformationen und Statuscodes. Dies dient Auslieferung, Stabilität, Fehleranalyse und Schutz vor Missbrauch.",
          "Rechtsgrundlage ist das berechtigte Interesse an einem sicheren und funktionsfähigen Webangebot. Protokolle werden auf das notwendige Maß begrenzt und nach Ablauf betrieblicher oder gesetzlicher Erfordernisse gelöscht oder anonymisiert.",
        ],
      },
      {
        heading: "4. Kontaktformular und Kommunikation",
        paragraphs: [
          "Bei einer Anfrage werden die von Ihnen übermittelten Angaben verarbeitet, insbesondere Name, Unternehmen, Kontaktdaten, Projektangaben und Nachricht. Zweck ist die Bearbeitung der Anfrage, vorvertragliche Kommunikation und gegebenenfalls Durchführung des Vertrags.",
          "Je nach Anfrage beruht die Verarbeitung auf vorvertraglichen Maßnahmen, Vertragserfüllung oder berechtigten Interessen an sachgerechter B2B-Kommunikation. Pflichtangaben werden im Formular gekennzeichnet.",
        ],
      },
      {
        heading: "5. E-Mail-Versand und Dienstleister",
        paragraphs: [
          "Für den technischen Versand von Formularnachrichten und transaktionalen E-Mails kann ein spezialisierter E-Mail-Dienst eingesetzt werden. Dabei werden nur die für Versand, Zustellung und Missbrauchsschutz notwendigen Daten verarbeitet.",
          "Dienstleister werden vertraglich gebunden und nur im erforderlichen Umfang eingesetzt. Bei Übermittlungen außerhalb des Europäischen Wirtschaftsraums werden geeignete Garantien und zusätzliche Schutzmaßnahmen geprüft.",
        ],
      },
      {
        heading: "6. Geschäftskontakte und B2B-Projekte",
        paragraphs: [
          "Im Rahmen von Angeboten und Projekten können Ansprechpartner-, Vertrags-, Kommunikations-, Abrechnungs- und Projektdaten verarbeitet werden. Rechtsgrundlagen sind vorvertragliche Maßnahmen, Vertragserfüllung, gesetzliche Pflichten sowie berechtigte Interessen an Dokumentation, Qualitätssicherung und Rechtsverteidigung.",
        ],
      },
      {
        heading: "7. AI-gestützte Verarbeitung",
        paragraphs: [
          "NeXifyAI kann AI-gestützte Werkzeuge für Strukturierung, Entwürfe, Entwicklung, Tests und Dokumentation einsetzen. Personenbezogene oder vertrauliche Daten werden nur übertragen, wenn dies für den vereinbarten Zweck erforderlich, vertraglich zulässig und technisch angemessen abgesichert ist.",
          "AI-Ausgaben werden nicht ungeprüft als fachlich verbindliche Entscheidung behandelt. Weitere Hinweise stehen unter „AI-Hinweise“.",
        ],
      },
      {
        heading: "8. Speicherdauer",
        paragraphs: [
          "Anfragedaten werden grundsätzlich so lange gespeichert, wie dies zur Bearbeitung und für angemessene Anschlusskommunikation erforderlich ist. Vertrags- und Abrechnungsdaten werden entsprechend gesetzlicher Aufbewahrungspflichten gespeichert. Daten können länger aufbewahrt werden, wenn dies zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.",
        ],
      },
      {
        heading: "9. Ihre Rechte",
        bullets: [
          "Auskunft über verarbeitete personenbezogene Daten",
          "Berichtigung unrichtiger oder unvollständiger Daten",
          "Löschung oder Einschränkung, soweit keine vorrangigen Pflichten entgegenstehen",
          "Datenübertragbarkeit bei Vorliegen der gesetzlichen Voraussetzungen",
          "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen",
          "Widerruf einer Einwilligung mit Wirkung für die Zukunft",
          "Beschwerde bei einer zuständigen Datenschutzaufsichtsbehörde, insbesondere der Autoriteit Persoonsgegevens in den Niederlanden",
        ],
      },
      {
        heading: "10. Sicherheit und Aktualisierung",
        paragraphs: [
          "NeXifyAI setzt angemessene technische und organisatorische Maßnahmen ein. Kein Internetdienst kann jedoch absolute Sicherheit garantieren. Diese Erklärung wird angepasst, wenn Prozesse, Dienstleister oder rechtliche Anforderungen dies erfordern.",
        ],
      },
    ],
  },
  agb: {
    slug: "agb",
    title: "Allgemeine Geschäftsbedingungen (B2B)",
    intro: "Vertragsgrundlagen für Beratungs-, Entwicklungs-, Design-, Automatisierungs- und Betriebsleistungen von NeXifyAI.",
    updated: "20. Juni 2026",
    sections: [
      {
        heading: "1. Geltungsbereich und Unternehmerstatus",
        paragraphs: [
          "Diese Bedingungen gelten für Verträge zwischen NeXifyAI und Unternehmern, juristischen Personen oder vergleichbaren Organisationen. Verträge mit Verbrauchern werden nicht geschlossen.",
          "Abweichende Bedingungen des Auftraggebers gelten nur, wenn NeXifyAI ihnen ausdrücklich in Textform zustimmt.",
        ],
      },
      {
        heading: "2. Vertragsschluss und Leistungsumfang",
        paragraphs: [
          "Angebote sind freibleibend, sofern sie nicht ausdrücklich als verbindlich bezeichnet werden. Ein Vertrag entsteht durch Annahme, Auftragsbestätigung oder Beginn der vereinbarten Leistung.",
          "Maßgeblich sind Angebot, Leistungsbeschreibung, vereinbarte Akzeptanzkriterien und dokumentierte Änderungen. Nicht ausdrücklich eingeschlossene Leistungen gelten als Zusatzaufwand.",
        ],
      },
      {
        heading: "3. Aufwand, Arbeitstage und Preis",
        paragraphs: [
          `Der reguläre Tagessatz beträgt ${company.dayRate.toLocaleString("de-DE")} Euro netto pro Arbeitstag. Ein Arbeitstag umfasst bis zu acht planbare Fachstunden.`,
          "Aufwandsspannen sind Schätzungen auf Grundlage des bekannten Umfangs. Ein verbindlicher Gesamtfestpreis gilt nur, wenn er ausdrücklich vereinbart wurde. Bei geänderten Anforderungen, fehlenden Inhalten, externen Blockern oder zusätzlichen Integrationen wird der Mehrbedarf vor Ausführung angezeigt.",
          "Preise verstehen sich zuzüglich der anwendbaren Umsatzsteuer. Bei grenzüberschreitenden B2B-Leistungen kann das Reverse-Charge-Verfahren gelten.",
        ],
      },
      {
        heading: "4. Mitwirkung des Auftraggebers",
        paragraphs: [
          "Der Auftraggeber stellt Inhalte, Zugangsdaten, Freigaben, Ansprechpartner, rechtliche Texte und fachliche Entscheidungen rechtzeitig bereit. Verzögerungen oder Mehraufwand aus fehlender Mitwirkung können Termin und Preis beeinflussen.",
          "Zugangsdaten sind über vereinbarte sichere Wege bereitzustellen. Geheimnisse dürfen nicht unaufgefordert in öffentliche Tickets, Chats oder Repositories eingestellt werden.",
        ],
      },
      {
        heading: "5. AI-gestützte Arbeitsweise",
        paragraphs: [
          "NeXifyAI setzt moderne AI-gestützte Entwicklungs-, Analyse- und Prüfwerkzeuge ein. Diese dienen der Beschleunigung und Qualitätssicherung. Die fachliche Verantwortung wird nicht an ein AI-System übertragen.",
          "Soweit der Auftraggeber besondere Vorgaben zur Verarbeitung, Modellwahl, Datenresidenz oder Geheimhaltung hat, müssen diese vor Projektbeginn mitgeteilt und vereinbart werden.",
        ],
      },
      {
        heading: "6. Abnahme",
        paragraphs: [
          "Abnahmepflichtige Leistungen werden nach Bereitstellung geprüft. Wesentliche Mängel sind nachvollziehbar und innerhalb der vereinbarten oder angemessenen Frist zu melden. Unwesentliche Abweichungen hindern die Abnahme nicht.",
          "Produktive Nutzung, Veröffentlichung oder ausbleibende Rückmeldung nach angemessener Prüfzeit kann als Abnahme gelten, soweit dies im konkreten Vertrag zulässig und angekündigt ist.",
        ],
      },
      {
        heading: "7. Nutzungsrechte und Open Source",
        paragraphs: [
          "Nach vollständiger Zahlung erhält der Auftraggeber die vereinbarten Nutzungsrechte. Vorbestehende Werkzeuge, generische Komponenten, Frameworks, Methoden und Know-how verbleiben bei ihren jeweiligen Rechteinhabern beziehungsweise NeXifyAI.",
          "Open-Source-Komponenten und Dienste Dritter unterliegen ihren eigenen Lizenz- und Nutzungsbedingungen. Diese werden nicht durch den Projektvertrag ersetzt.",
        ],
      },
      {
        heading: "8. Drittanbieter und laufende Kosten",
        paragraphs: [
          "Hosting, Domains, Zahlungsanbieter, App-Stores, externe APIs, Lizenzen, Transaktions- und Nutzungskosten sind nur enthalten, wenn dies ausdrücklich vereinbart ist. Änderungen, Ausfälle oder Einschränkungen von Drittanbietern liegen außerhalb des unmittelbaren Einflusses von NeXifyAI.",
        ],
      },
      {
        heading: "9. Gewährleistung und Haftung",
        paragraphs: [
          "NeXifyAI behebt reproduzierbare Mängel innerhalb eines angemessenen Zeitraums. Kein Softwareprodukt ist unter allen denkbaren Bedingungen vollständig fehlerfrei; geschuldet ist die vereinbarte Beschaffenheit und fachgerechte Umsetzung.",
          "Unbeschränkte Haftung gilt bei Vorsatz, grober Fahrlässigkeit, Verletzung von Leben, Körper oder Gesundheit sowie zwingender gesetzlicher Haftung. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypisch vorhersehbaren Schaden begrenzt. Weitere Haftungsbegrenzungen können projektbezogen vereinbart werden.",
        ],
      },
      {
        heading: "10. Zahlung",
        paragraphs: [
          "Rechnungen sind innerhalb der ausgewiesenen Frist ohne Abzug zahlbar. Bei größeren Vorhaben können Abschläge, Vorauszahlungen oder Meilensteinzahlungen vereinbart werden. Bei Zahlungsverzug gelten die gesetzlichen B2B-Folgen und angemessene Inkasso- beziehungsweise Rechtsverfolgungskosten.",
        ],
      },
      {
        heading: "11. Vertraulichkeit und Datenschutz",
        paragraphs: [
          "Beide Parteien behandeln nicht öffentliche Geschäfts- und Projektdaten vertraulich. Soweit NeXifyAI personenbezogene Daten im Auftrag verarbeitet, wird bei Bedarf eine Vereinbarung zur Auftragsverarbeitung geschlossen.",
        ],
      },
      {
        heading: "12. Laufzeit, Kündigung und Projektunterbrechung",
        paragraphs: [
          "Projektverträge enden mit Erbringung der vereinbarten Leistung. Laufende Leistungen können nach den vereinbarten Fristen gekündigt werden. Das Recht zur außerordentlichen Kündigung bleibt bestehen.",
          "Bei Unterbrechung aus dem Verantwortungsbereich des Auftraggebers werden bereits erbrachte Leistungen abgerechnet; eine spätere Wiederaufnahme kann neu eingeplant werden.",
        ],
      },
      {
        heading: "13. Recht und Gerichtsstand",
        paragraphs: [
          "Es gilt niederländisches Recht unter Ausschluss kollisionsrechtlicher Verweisungen, soweit keine zwingenden Vorschriften entgegenstehen. Gerichtsstand für Kaufleute und vergleichbare B2B-Auftraggeber ist der Sitz von NeXifyAI, soweit zulässig.",
        ],
      },
    ],
  },
  "ki-hinweise": {
    slug: "ki-hinweise",
    title: "Hinweise zu AI-gestützter Arbeit",
    intro: "Wie NeXifyAI moderne AI-Werkzeuge einsetzt – und wo menschliche Verantwortung unverzichtbar bleibt.",
    updated: "20. Juni 2026",
    sections: [
      {
        heading: "AI-gestützt statt AI-abgegeben",
        paragraphs: [
          "NeXifyAI nutzt AI-Werkzeuge für Recherche, Strukturierung, Entwürfe, Entwicklungsunterstützung, Tests, Übersetzungen und Dokumentation. Diese Werkzeuge beschleunigen Arbeitsschritte, ersetzen aber nicht fachliche Verantwortung, Prüfung und Freigabe.",
        ],
      },
      {
        heading: "Menschliche Kontrolle",
        bullets: [
          "Ziele, Architektur und fachliche Entscheidungen werden durch einen verantwortlichen Fachmann gesteuert.",
          "AI-Ausgaben werden auf Plausibilität, Sicherheit, Projektkontext und Qualität geprüft.",
          "Rechtliche, steuerliche, medizinische oder andere hochriskante Entscheidungen werden nicht allein auf AI-Ausgaben gestützt.",
          "Produktive Änderungen werden anhand des vereinbarten Risikos getestet und dokumentiert.",
        ],
      },
      {
        heading: "Daten und Vertraulichkeit",
        paragraphs: [
          "Vertrauliche oder personenbezogene Daten werden nur im erforderlichen Umfang verarbeitet. Modell-, Hosting- und Datenverarbeitungswege werden passend zum Projekt gewählt. Kundendaten werden nicht bewusst zur allgemeinen Modellschulung freigegeben, sofern dies nicht ausdrücklich vereinbart und rechtlich zulässig ist.",
        ],
      },
      {
        heading: "Grenzen",
        paragraphs: [
          "AI-Systeme können unvollständige, veraltete oder falsche Ergebnisse erzeugen. NeXifyAI begegnet diesem Risiko durch Quellenprüfung, Tests, Review, begrenzte Rechte und nachvollziehbare Arbeitsstände. Eine absolute Fehlerfreiheit kann nicht garantiert werden.",
        ],
      },
    ],
  },
  "cookie-richtlinie": {
    slug: "cookie-richtlinie",
    title: "Cookie- und Speicherhinweise",
    intro: "Diese Website ist auf datensparsame Nutzung ohne standardmäßiges Marketing-Tracking ausgelegt.",
    updated: "20. Juni 2026",
    sections: [
      {
        heading: "Notwendige Speichertechniken",
        paragraphs: [
          "Technisch notwendige Cookies oder lokale Speicherungen können eingesetzt werden, um Sicherheit, Formularzustände, Sprache oder elementare Websitefunktionen bereitzustellen. Sie dienen nicht der verhaltensbasierten Werbung.",
        ],
      },
      {
        heading: "Keine standardmäßigen Marketing-Cookies",
        paragraphs: [
          "Ohne gesonderte Ankündigung und Einwilligung werden keine nicht notwendigen Werbe-, Retargeting- oder plattformübergreifenden Tracking-Cookies gesetzt. Wird die Website künftig um solche Dienste erweitert, werden Information und Einwilligungsmechanismus vor Aktivierung angepasst.",
        ],
      },
      {
        heading: "Browser-Einstellungen",
        paragraphs: [
          "Sie können Cookies über Ihren Browser löschen oder blockieren. Bei technisch notwendigen Cookies können einzelne Funktionen dadurch eingeschränkt sein.",
        ],
      },
    ],
  },
  avv: {
    slug: "avv",
    title: "Auftragsverarbeitung (AVV)",
    intro: "Grundsätze für Projekte, in denen NeXifyAI personenbezogene Daten im Auftrag eines Kunden verarbeitet.",
    updated: "20. Juni 2026",
    sections: [
      {
        heading: "Wann eine AVV erforderlich ist",
        paragraphs: [
          "Eine Vereinbarung zur Auftragsverarbeitung wird geschlossen, wenn NeXifyAI personenbezogene Daten ausschließlich nach dokumentierter Weisung des Kunden verarbeitet und die gesetzlichen Voraussetzungen einer Auftragsverarbeitung vorliegen.",
        ],
      },
      {
        heading: "Typische Bestandteile",
        bullets: [
          "Gegenstand, Dauer, Art und Zweck der Verarbeitung",
          "Kategorien betroffener Personen und personenbezogener Daten",
          "Weisungs- und Unterstützungsprozesse",
          "Vertraulichkeitsverpflichtungen",
          "Technische und organisatorische Maßnahmen",
          "Regeln für Unterauftragsverarbeiter",
          "Löschung, Rückgabe und Nachweise nach Vertragsende",
          "Meldung und Unterstützung bei Datenschutzvorfällen",
        ],
      },
      {
        heading: "Projektbezogene Fassung",
        paragraphs: [
          "Da Datenarten, Systeme, Hosting, Unterauftragnehmer und Risiken vom jeweiligen Projekt abhängen, wird die AVV projektbezogen erstellt oder ergänzt. Eine aktuelle Vorlage und die zugehörigen technischen und organisatorischen Maßnahmen werden im Rahmen der Beauftragung bereitgestellt.",
        ],
      },
    ],
  },
  widerruf: {
    slug: "widerruf",
    title: "Hinweis zum Widerrufsrecht",
    intro: "NeXifyAI bietet Leistungen ausschließlich im unternehmerischen Geschäftsverkehr an.",
    updated: "20. Juni 2026",
    sections: [
      {
        heading: "Kein Verbrauchervertrag",
        paragraphs: [
          "Verträge werden ausschließlich mit Unternehmern, juristischen Personen und vergleichbaren Organisationen geschlossen, die in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit handeln. Das gesetzliche Verbraucherwiderrufsrecht findet daher grundsätzlich keine Anwendung.",
          "Sollte im Ausnahmefall eine Person entgegen dieser Ausrichtung als Verbraucher handeln, muss dies vor Vertragsschluss ausdrücklich offengelegt und gesondert vereinbart werden.",
        ],
      },
    ],
  },
};
