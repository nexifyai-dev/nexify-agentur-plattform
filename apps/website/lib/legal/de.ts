export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type LegalPageData = { slug: string; title: string; intro: string; updated: string; sections: LegalSection[] };

const C = {
  legalName: "NeXify AI by NeXify – chat it. Automate it.",
  owner: "Pascal Courbois",
  address: "Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande",
  email: "mail@nexifyai.cloud",
  phone: "+31 6 133 188 56",
  kvk: "90483944",
  vat: "NL865786276B01",
};

export const legalDe: Record<string, LegalPageData> = {
  impressum: {
    slug: "impressum",
    title: "Impressum",
    intro: "Anbieterkennzeichnung und Kontaktinformationen von NeXify AI by NeXify – chat it. Automate it.",
    updated: "Juni 2026",
    sections: [
      { heading: "Angaben zum Unternehmen", paragraphs: [C.legalName, `Eenmanszaak (Einzelunternehmen nach niederländischem Recht), Inhaber: ${C.owner}`, C.address] },
      { heading: "Kontakt", paragraphs: [`E-Mail: ${C.email}`, `Telefon: ${C.phone}`, "Web: nexifyai.cloud"] },
      {
        heading: "Register- und Steuerangaben",
        paragraphs: [
          `Kamer van Koophandel (KvK): ${C.kvk}`,
          `BTW-Identifikationsnummer (Umsatzsteuer-ID): ${C.vat}`,
          "Tätigkeitsbereich: IT-Beratung, AI-gestützte Automatisierung, Softwareentwicklung, Webentwicklung und E-Commerce-Lösungen.",
        ],
      },
      {
        heading: "Vertretung und redaktionelle Verantwortung",
        paragraphs: [`${C.owner}, Inhaber / Directeur.`, `Verantwortlich für redaktionelle Inhalte: ${C.owner}, Anschrift wie oben.`],
      },
      {
        heading: "Aufsicht und anwendbares Recht",
        paragraphs: [
          "Als in den Niederlanden ansässiges Einzelunternehmen unterliegt NeXify AI dem niederländischen Handels- und Gewerberecht. Zuständige Handelskammer ist die Kamer van Koophandel (KvK).",
          "Für datenschutzrechtliche Belange ist die Autoriteit Persoonsgegevens (Den Haag, Niederlande) die zuständige Aufsichtsbehörde.",
        ],
      },
      {
        heading: "B2B-Ausrichtung",
        paragraphs: [
          "Das Angebot richtet sich ausschließlich an Unternehmer, juristische Personen des öffentlichen Rechts und vergleichbare Organisationen, die in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit handeln. Verträge mit Verbrauchern werden nicht geschlossen.",
        ],
      },
      {
        heading: "Haftung für Inhalte",
        paragraphs: [
          "Die Inhalte dieser Website werden mit größter Sorgfalt erstellt und regelmäßig aktualisiert. Eine Gewähr für Richtigkeit, Vollständigkeit und Aktualität wird nur übernommen, soweit dies ausdrücklich vereinbart oder gesetzlich zwingend vorgeschrieben ist.",
          "Preisangaben auf dieser Website stellen kein bindendes Angebot dar, sondern eine transparente Orientierung. Verbindlich sind ausschließlich individuell erstellte und schriftlich bestätigte Angebote.",
        ],
      },
      {
        heading: "Haftung für Links",
        paragraphs: [
          "Verlinkte externe Angebote unterliegen der Verantwortung ihrer jeweiligen Betreiber. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Rechtswidrige Inhalte werden nach Kenntnis und angemessener Prüfung entfernt oder die Verlinkung beendet.",
        ],
      },
      {
        heading: "Urheberrecht",
        paragraphs: [
          "Sämtliche Inhalte, Grafiken, Logos und Gestaltungselemente dieser Website unterliegen dem Urheberrecht. Jede Verwertung außerhalb der gesetzlichen Schranken bedarf der vorherigen schriftlichen Zustimmung. Marken- und Produktnamen Dritter sind Eigentum ihrer jeweiligen Inhaber.",
        ],
      },
      {
        heading: "Online-Streitbeilegung",
        paragraphs: [
          "Da NeXify AI ausschließlich B2B-Leistungen anbietet, besteht keine Verpflichtung und keine Teilnahme an Verbraucherschlichtungsverfahren. Anfragen zu Verträgen oder Leistungen können direkt an die oben genannte E-Mail-Adresse gerichtet werden.",
        ],
      },
    ],
  },
  datenschutz: {
    slug: "datenschutz",
    title: "Datenschutzerklärung",
    intro: "Umfassende Informationen zur Verarbeitung personenbezogener Daten auf dieser Website, im KI-Chat und im Rahmen geschäftlicher Anfragen gemäß DSGVO / AVG.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "1. Verantwortlicher",
        paragraphs: [`${C.legalName}, ${C.address}.`, `Inhaber: ${C.owner}. Kontakt: ${C.email}, ${C.phone}.`],
      },
      {
        heading: "2. Grundsätze der Verarbeitung",
        paragraphs: [
          "NeXify AI verarbeitet personenbezogene Daten zweckgebunden, verhältnismäßig und nur so lange, wie dies für den jeweiligen Zweck, gesetzliche Pflichten oder die Wahrung berechtigter Interessen erforderlich ist (Art. 5 DSGVO).",
          "Diese Website ist grundsätzlich ohne Nutzerkonto und ohne Marketing-Tracking nutzbar. Nicht notwendige Analyse- oder Werbecookies werden nicht standardmäßig eingesetzt.",
        ],
      },
      {
        heading: "3. Hosting, CDN und technische Protokolldaten",
        paragraphs: [
          "Beim Aufruf der Website können technisch erforderliche Daten verarbeitet werden, insbesondere IP-Adresse, Zeitpunkt, aufgerufene Ressource, Referrer, Browser-/Geräteinformationen und Statuscodes. Dies dient der Auslieferung, Stabilität, Fehleranalyse und dem Schutz vor Missbrauch.",
          "Zur Auslieferung und Absicherung der Website können Content-Delivery- und Schutzdienste (z. B. Cloudflare) sowie Hosting-Infrastruktur (z. B. Vercel oder eigene Server in der EU) eingesetzt werden. Mit den Anbietern bestehen, soweit erforderlich, Auftragsverarbeitungsverträge.",
          "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und funktionsfähigen Webangebot). Protokolle werden auf das notwendige Maß begrenzt und nach Ablauf betrieblicher oder gesetzlicher Erfordernisse gelöscht oder anonymisiert.",
        ],
      },
      {
        heading: "4. Kontaktformular und Kommunikation",
        paragraphs: [
          "Bei einer Anfrage werden die von Ihnen übermittelten Angaben verarbeitet, insbesondere Name, Unternehmen, Kontaktdaten, Projektangaben und Nachricht. Zweck ist die Bearbeitung der Anfrage, vorvertragliche Kommunikation und gegebenenfalls die Durchführung des Vertrags.",
          "Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen bzw. Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sachgerechter B2B-Kommunikation). Pflichtangaben sind im Formular gekennzeichnet.",
          "Anfragedaten werden in einer gesicherten Datenbank (Supabase, PostgreSQL, Serverstandort EU) gespeichert.",
        ],
      },
      {
        heading: "5. KI-Berater „NeXify AI“ (Live-Chat)",
        paragraphs: [
          "Auf dieser Website steht ein KI-gestützter Berater („NeXify AI“) zur Verfügung. Bei Nutzung des Chats werden Ihre Chat-Nachrichten sowie eine zufällig erzeugte Sitzungskennung verarbeitet und gespeichert, um den Gesprächsverlauf bereitzustellen, Anfragen zu qualifizieren und auf Wunsch ein Angebot zu erstellen.",
          "Zur Erzeugung der Antworten werden Chat-Inhalte an ein KI-Sprachmodell (Large Language Model) eines spezialisierten Anbieters übermittelt. Übermitteln Sie im Chat bitte keine sensiblen oder besonders schutzbedürftigen Daten. Die Chat-Inhalte werden nicht zur allgemeinen Modellschulung freigegeben, soweit dies nicht ausdrücklich vereinbart und rechtlich zulässig ist.",
          "Geben Sie im Chat freiwillig Name, E-Mail-Adresse und Firma an, um ein Angebot zu erhalten, werden diese Daten zur Erstellung und Zusendung des Angebots sowie für eine angemessene geschäftliche Nachverfolgung (Follow-up-E-Mail) verwendet.",
          "Rechtsgrundlagen: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an effizienter Erstberatung). Sie sind nicht verpflichtet, den Chat zu nutzen – alle Anliegen können alternativ per E-Mail oder Telefon gestellt werden.",
          "Gedächtnisfunktion: Um wiederkehrende Interessenten und Kunden über mehrere Kontakte hinweg individuell beraten zu können, können zentrale Gesprächsinhalte (z. B. Branche, Projektziele, Präferenzen) in verdichteter Form als Merkposten gespeichert werden. Hierfür wird der spezialisierte Dienst Mem0 (Mem0 AI, USA) eingesetzt; die Übermittlung erfolgt auf Grundlage von EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Rechtsgrundlage der Speicherung ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an personalisierter, effizienter Betreuung). Sie können dieser Speicherung jederzeit formlos widersprechen (mail@nexifyai.cloud); die Merkposten werden dann gelöscht.",
          "Keine automatisierte Entscheidung im Sinne des Art. 22 DSGVO: Der KI-Berater trifft keine Entscheidungen mit Rechtswirkung oder ähnlich erheblicher Beeinträchtigung. Angebote sind unverbindliche Indikationen und werden vor Vertragsschluss stets menschlich geprüft.",
        ],
      },
      {
        heading: "6. E-Mail-Versand und Dienstleister",
        paragraphs: [
          "Für den technischen Versand von Formularbestätigungen, Angeboten und transaktionalen E-Mails wird ein spezialisierter E-Mail-Dienst (Resend) eingesetzt. Dabei werden nur die für Versand, Zustellung und Missbrauchsschutz notwendigen Daten verarbeitet (Empfängeradresse, Inhalt, Zustellstatus).",
          "Eingehende E-Mails an mail@nexifyai.cloud (Postfach bei Hostinger) werden zur effizienten Bearbeitung KI-gestützt vorsortiert (z. B. Erkennung unerwünschter Werbung) und bei geschäftlichen Anfragen automatisiert beantwortet. Sie werden im automatisierten Antwortprozess mit einem KI-System kommunizieren; eine persönliche Bearbeitung durch Pascal Courbois erfolgt jederzeit auf Wunsch und bei allen Anliegen, die menschliche Prüfung erfordern. Rechtsgrundlagen: Art. 6 Abs. 1 lit. b und lit. f DSGVO (effiziente Bearbeitung eingehender Geschäftskommunikation).",
          "Interner CEO-Agent (Fabrik-Empfehlungen): Aus dem Betreff und den ersten Zeilen einer geschäftlichen Anfrage wird intern ein strukturierter Angebotsentwurf (Positionen, Preis-Schätzung, Rückfragen) durch ein KI-System erzeugt und Pascal Courbois zur Freigabe vorgelegt. Es findet KEIN automatischer Angebotsversand statt – die Entscheidung trifft ausschließlich der Mensch (Art. 22 Abs. 1 DSGVO ist damit nicht berührt). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an schneller, qualitätsgesicherter Angebotsvorbereitung).",
          "Dienstleister werden sorgfältig ausgewählt, vertraglich gebunden (Art. 28 DSGVO) und nur im erforderlichen Umfang eingesetzt. Bei Übermittlungen außerhalb des Europäischen Wirtschaftsraums werden geeignete Garantien (z. B. EU-Standardvertragsklauseln) und zusätzliche Schutzmaßnahmen geprüft.",
        ],
      },
      {
        heading: "7. Datenbank und Speicherorte",
        paragraphs: [
          "Anfragen, Chat-Verläufe, Leads und Angebotsdaten werden in einer PostgreSQL-Datenbank des Anbieters Supabase gespeichert. Der Serverstandort liegt in der Europäischen Union. Zugriffe sind verschlüsselt (TLS) und auf das erforderliche Minimum beschränkt.",
        ],
      },
      {
        heading: "8. Geschäftskontakte und B2B-Projekte",
        paragraphs: [
          "Im Rahmen von Angeboten und Projekten können Ansprechpartner-, Vertrags-, Kommunikations-, Abrechnungs- und Projektdaten verarbeitet werden. Rechtsgrundlagen sind vorvertragliche Maßnahmen, Vertragserfüllung, gesetzliche Pflichten (insbesondere steuerliche Aufbewahrung) sowie berechtigte Interessen an Dokumentation, Qualitätssicherung und Rechtsverteidigung.",
        ],
      },
      {
        heading: "9. AI-gestützte Verarbeitung in Projekten",
        paragraphs: [
          "NeXify AI kann AI-gestützte Werkzeuge für Strukturierung, Entwürfe, Entwicklung, Tests und Dokumentation einsetzen. Personenbezogene oder vertrauliche Daten werden nur übertragen, wenn dies für den vereinbarten Zweck erforderlich, vertraglich zulässig und technisch angemessen abgesichert ist.",
          "AI-Ausgaben werden nicht ungeprüft als fachlich verbindliche Entscheidung behandelt. Weitere Hinweise stehen unter „KI-Hinweise“.",
        ],
      },
      {
        heading: "10. Speicherdauer",
        paragraphs: [
          "Anfrage- und Chatdaten werden grundsätzlich so lange gespeichert, wie dies zur Bearbeitung und für angemessene Anschlusskommunikation erforderlich ist, und anschließend gelöscht oder anonymisiert.",
          "Vertrags- und Abrechnungsdaten werden entsprechend gesetzlicher Aufbewahrungspflichten (in den Niederlanden in der Regel 7 Jahre) gespeichert. Daten können länger aufbewahrt werden, wenn dies zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.",
        ],
      },
      {
        heading: "11. Ihre Rechte",
        bullets: [
          "Auskunft über verarbeitete personenbezogene Daten (Art. 15 DSGVO)",
          "Berichtigung unrichtiger oder unvollständiger Daten (Art. 16 DSGVO)",
          "Löschung, soweit keine vorrangigen Pflichten entgegenstehen (Art. 17 DSGVO)",
          "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
          "Datenübertragbarkeit (Art. 20 DSGVO)",
          "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)",
          "Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)",
          "Beschwerde bei einer Datenschutzaufsichtsbehörde, insbesondere der Autoriteit Persoonsgegevens (NL) oder der für Sie zuständigen Behörde",
        ],
      },
      {
        heading: "12. Sicherheit und Aktualisierung",
        paragraphs: [
          "NeXify AI setzt angemessene technische und organisatorische Maßnahmen ein, darunter Transportverschlüsselung (TLS), Zugriffsbeschränkungen, Datensparsamkeit und regelmäßige Aktualisierungen. Kein Internetdienst kann jedoch absolute Sicherheit garantieren.",
          "Diese Erklärung wird angepasst, wenn Prozesse, Dienstleister oder rechtliche Anforderungen dies erfordern. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.",
        ],
      },
    ],
  },
  agb: {
    slug: "agb",
    title: "Allgemeine Geschäftsbedingungen (B2B)",
    intro: "Vertragsgrundlagen für Beratungs-, Entwicklungs-, Design-, Automatisierungs- und Betriebsleistungen von NeXify AI.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "1. Geltungsbereich und Unternehmerstatus",
        paragraphs: [
          "Diese Bedingungen gelten für alle Verträge zwischen NeXify AI und Unternehmern, juristischen Personen oder vergleichbaren Organisationen, die in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit handeln. Verträge mit Verbrauchern werden nicht geschlossen.",
          "Abweichende Bedingungen des Auftraggebers gelten nur, wenn NeXify AI ihnen ausdrücklich in Textform zustimmt. Individuelle vertragliche Vereinbarungen haben Vorrang vor diesen Bedingungen.",
        ],
      },
      {
        heading: "2. Vertragsschluss und Leistungsumfang",
        paragraphs: [
          "Angebote sind freibleibend, sofern sie nicht ausdrücklich als verbindlich bezeichnet werden. Dies gilt auch für automatisiert erstellte Angebotsindikationen des KI-Beraters NeXify AI, die stets unverbindliche Orientierungen darstellen. Ein Vertrag entsteht durch Annahme, Auftragsbestätigung oder Beginn der vereinbarten Leistung.",
          "Maßgeblich sind Angebot, Leistungsbeschreibung, vereinbarte Akzeptanzkriterien und dokumentierte Änderungen. Nicht ausdrücklich eingeschlossene Leistungen gelten als Zusatzaufwand.",
        ],
      },
      {
        heading: "3. Aufwand, Arbeitstage und Preis",
        paragraphs: [
          "Der reguläre Tagessatz beträgt 999 Euro netto pro Arbeitstag. Ein Arbeitstag umfasst bis zu acht planbare Fachstunden.",
          "Aufwandsspannen sind Schätzungen auf Grundlage des bekannten Umfangs. Ein verbindlicher Gesamtfestpreis gilt nur, wenn er ausdrücklich vereinbart wurde. Bei geänderten Anforderungen, fehlenden Inhalten, externen Blockern oder zusätzlichen Integrationen wird der Mehrbedarf vor Ausführung angezeigt.",
          "Preise verstehen sich zuzüglich der anwendbaren Umsatzsteuer. Bei grenzüberschreitenden B2B-Leistungen innerhalb der EU kann bei gültiger Umsatzsteuer-ID das Reverse-Charge-Verfahren gelten.",
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
          "NeXify AI setzt moderne AI-gestützte Entwicklungs-, Analyse- und Prüfwerkzeuge ein. Diese dienen der Beschleunigung und Qualitätssicherung. Die fachliche Verantwortung wird nicht an ein AI-System übertragen.",
          "Soweit der Auftraggeber besondere Vorgaben zur Verarbeitung, Modellwahl, Datenresidenz oder Geheimhaltung hat, müssen diese vor Projektbeginn mitgeteilt und vereinbart werden.",
        ],
      },
      {
        heading: "6. Termine und Lieferfristen",
        paragraphs: [
          "Auf der Website genannte Richtdauern (z. B. „Website in 2–3 Arbeitstagen“) beziehen sich auf reine Umsetzungszeit ab vollständiger Bereitstellung aller erforderlichen Inhalte und Freigaben. Verbindliche Termine bedürfen der ausdrücklichen Vereinbarung.",
          "Höhere Gewalt, Ausfälle von Drittanbietern und vom Auftraggeber zu vertretende Verzögerungen verlängern Fristen angemessen.",
        ],
      },
      {
        heading: "7. Abnahme",
        paragraphs: [
          "Abnahmepflichtige Leistungen werden nach Bereitstellung geprüft. Wesentliche Mängel sind nachvollziehbar und innerhalb der vereinbarten oder angemessenen Frist zu melden. Unwesentliche Abweichungen hindern die Abnahme nicht.",
          "Produktive Nutzung, Veröffentlichung oder ausbleibende Rückmeldung nach angemessener Prüfzeit kann als Abnahme gelten, soweit dies im konkreten Vertrag zulässig und angekündigt ist.",
        ],
      },
      {
        heading: "8. Nutzungsrechte und Open Source",
        paragraphs: [
          "Nach vollständiger Zahlung erhält der Auftraggeber die vereinbarten Nutzungsrechte am individuell erstellten Werk. Vorbestehende Werkzeuge, generische Komponenten, Frameworks, Methoden und Know-how verbleiben bei ihren jeweiligen Rechteinhabern beziehungsweise NeXify AI.",
          "Open-Source-Komponenten und Dienste Dritter unterliegen ihren eigenen Lizenz- und Nutzungsbedingungen. Diese werden nicht durch den Projektvertrag ersetzt.",
        ],
      },
      {
        heading: "9. Drittanbieter und laufende Kosten",
        paragraphs: [
          "Hosting, Domains, Zahlungsanbieter, App-Stores, externe APIs, AI-Modell-Nutzungskosten, Lizenzen, Transaktions- und Nutzungskosten sind nur enthalten, wenn dies ausdrücklich vereinbart ist. Änderungen, Ausfälle oder Einschränkungen von Drittanbietern liegen außerhalb des unmittelbaren Einflusses von NeXify AI.",
        ],
      },
      {
        heading: "10. Gewährleistung und Haftung",
        paragraphs: [
          "NeXify AI behebt reproduzierbare Mängel innerhalb eines angemessenen Zeitraums. Kein Softwareprodukt ist unter allen denkbaren Bedingungen vollständig fehlerfrei; geschuldet ist die vereinbarte Beschaffenheit und fachgerechte Umsetzung.",
          "Unbeschränkte Haftung gilt bei Vorsatz, grober Fahrlässigkeit, Verletzung von Leben, Körper oder Gesundheit sowie zwingender gesetzlicher Haftung. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypisch vorhersehbaren Schaden begrenzt; im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.",
          "Für Datenverlust haftet NeXify AI nur in dem Umfang, der auch bei ordnungsgemäßer, regelmäßiger Datensicherung durch den Auftraggeber eingetreten wäre.",
        ],
      },
      {
        heading: "11. Zahlung",
        paragraphs: [
          "Rechnungen sind innerhalb der ausgewiesenen Frist ohne Abzug zahlbar. Bei größeren Vorhaben können Abschläge, Vorauszahlungen oder Meilensteinzahlungen vereinbart werden.",
          "Bei Zahlungsverzug gelten die gesetzlichen B2B-Folgen einschließlich Verzugszinsen und angemessener Inkasso- beziehungsweise Rechtsverfolgungskosten. NeXify AI kann Leistungen bei erheblichem Zahlungsrückstand nach Ankündigung aussetzen.",
        ],
      },
      {
        heading: "12. Vertraulichkeit und Datenschutz",
        paragraphs: [
          "Beide Parteien behandeln nicht öffentliche Geschäfts- und Projektdaten vertraulich. Die Vertraulichkeit gilt über das Vertragsende hinaus fort.",
          "Soweit NeXify AI personenbezogene Daten im Auftrag verarbeitet, wird eine Vereinbarung zur Auftragsverarbeitung nach Art. 28 DSGVO geschlossen (siehe Seite „AVV“).",
        ],
      },
      {
        heading: "13. Referenznennung",
        paragraphs: [
          "NeXify AI darf den Auftraggeber nach Projektabschluss mit Name und Logo als Referenz nennen, sofern der Auftraggeber dem nicht widerspricht oder etwas anderes vereinbart wurde. Vertrauliche Projektdetails werden dabei nicht offengelegt.",
        ],
      },
      {
        heading: "14. Laufzeit, Kündigung und Projektunterbrechung",
        paragraphs: [
          "Projektverträge enden mit Erbringung der vereinbarten Leistung. Laufende Leistungen können nach den vereinbarten Fristen gekündigt werden. Das Recht zur außerordentlichen Kündigung bleibt bestehen.",
          "Bei Unterbrechung aus dem Verantwortungsbereich des Auftraggebers werden bereits erbrachte Leistungen abgerechnet; eine spätere Wiederaufnahme kann neu eingeplant werden.",
        ],
      },
      {
        heading: "15. Recht, Gerichtsstand und Schlussbestimmungen",
        paragraphs: [
          "Es gilt niederländisches Recht unter Ausschluss des UN-Kaufrechts und kollisionsrechtlicher Verweisungen, soweit keine zwingenden Vorschriften entgegenstehen. Gerichtsstand für Kaufleute und vergleichbare B2B-Auftraggeber ist der Sitz von NeXify AI, soweit zulässig.",
          "Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt die gesetzlich zulässige Regelung, die dem wirtschaftlichen Zweck am nächsten kommt.",
        ],
      },
    ],
  },
  "ki-hinweise": {
    slug: "ki-hinweise",
    title: "Hinweise zu AI-gestützter Arbeit",
    intro: "Wie NeXify AI moderne AI-Werkzeuge einsetzt – transparent erklärt, inklusive des KI-Beraters NeXify AI auf dieser Website.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "AI-gestützt statt AI-abgegeben",
        paragraphs: [
          "NeXify AI nutzt AI-Werkzeuge für Recherche, Strukturierung, Entwürfe, Entwicklungsunterstützung, Tests, Übersetzungen und Dokumentation. Diese Werkzeuge beschleunigen Arbeitsschritte, ersetzen aber nicht fachliche Verantwortung, Prüfung und Freigabe.",
        ],
      },
      {
        heading: "Der NeXify AI Berater auf dieser Website",
        paragraphs: [
          "NeXify AI ist ein KI-gestützter Beratungs- und Vertriebsassistent. Er beantwortet Fragen zu Leistungen und Preisen, qualifiziert Anfragen und kann auf ausdrücklichen Wunsch ein unverbindliches Angebot erstellen und per E-Mail versenden.",
          "Sie interagieren dabei mit einem automatisierten System, nicht mit einem Menschen. Alle von NeXify AI erstellten Angebote sind unverbindliche Indikationen; verbindliche Angebote werden ausschließlich von Pascal Courbois persönlich geprüft und bestätigt.",
          "Der Assistent verfügt über eine Gedächtnisfunktion: Zentrale Gesprächsinhalte können gespeichert werden, damit Sie bei erneutem Kontakt nicht von vorne beginnen müssen. Zudem können E-Mails an mail@nexifyai.cloud KI-gestützt vorsortiert und beantwortet werden. Details und Widerspruchsmöglichkeiten finden Sie in der Datenschutzerklärung.",
          "Der AI-Berater kann Fehler machen. Bei Unklarheiten oder wichtigen Entscheidungen kontaktieren Sie uns bitte direkt per E-Mail oder Telefon.",
        ],
      },
      {
        heading: "Menschliche Kontrolle",
        bullets: [
          "Ziele, Architektur und fachliche Entscheidungen werden durch einen verantwortlichen Fachmann gesteuert.",
          "AI-Ausgaben werden auf Plausibilität, Sicherheit, Projektkontext und Qualität geprüft.",
          "Rechtliche, steuerliche, medizinische oder andere hochriskante Entscheidungen werden nicht allein auf AI-Ausgaben gestützt.",
          "Produktive Änderungen werden anhand des vereinbarten Risikos getestet und dokumentiert.",
          "Automatisiert erstellte Angebote werden vor Vertragsschluss immer menschlich geprüft.",
        ],
      },
      {
        heading: "Daten und Vertraulichkeit",
        paragraphs: [
          "Vertrauliche oder personenbezogene Daten werden nur im erforderlichen Umfang verarbeitet. Modell-, Hosting- und Datenverarbeitungswege werden passend zum Projekt gewählt. Kundendaten werden nicht bewusst zur allgemeinen Modellschulung freigegeben, sofern dies nicht ausdrücklich vereinbart und rechtlich zulässig ist.",
          "Details zur Datenverarbeitung im Chat finden Sie in der Datenschutzerklärung, Abschnitt „NeXify AI Berater“.",
        ],
      },
      {
        heading: "EU AI Act und Transparenz",
        paragraphs: [
          "NeXify AI verfolgt die Anforderungen der EU-KI-Verordnung (AI Act) und setzt deren Transparenzpflichten um: Nutzer werden darüber informiert, wenn sie mit einem KI-System interagieren, und KI-generierte Angebotsindikationen werden als solche gekennzeichnet.",
          "Bei Kundenprojekten mit KI-Komponenten beraten wir zur Risikoklassifizierung und zu den jeweils geltenden Pflichten.",
        ],
      },
      {
        heading: "Grenzen",
        paragraphs: [
          "AI-Systeme können unvollständige, veraltete oder falsche Ergebnisse erzeugen. NeXify AI begegnet diesem Risiko durch Quellenprüfung, Tests, Review, begrenzte Rechte und nachvollziehbare Arbeitsstände. Eine absolute Fehlerfreiheit kann nicht garantiert werden.",
        ],
      },
    ],
  },
  "cookie-richtlinie": {
    slug: "cookie-richtlinie",
    title: "Cookie- und Speicherhinweise",
    intro: "Diese Website ist auf datensparsame Nutzung ohne standardmäßiges Marketing-Tracking ausgelegt.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "Notwendige Speichertechniken",
        paragraphs: [
          "Technisch notwendige Cookies oder lokale Speicherungen (localStorage) können eingesetzt werden, um Sicherheit, Formularzustände, Ihre Sprachwahl (Deutsch/Niederländisch), den Zustand des Chat-Assistenten oder elementare Websitefunktionen bereitzustellen. Sie dienen nicht der verhaltensbasierten Werbung.",
        ],
      },
      {
        heading: "Konkret eingesetzte Speicherungen",
        bullets: [
          "nexify-lang (localStorage): speichert Ihre Sprachwahl DE/NL – bis zur Löschung durch Sie.",
          "nova-greeted (localStorage): merkt sich, dass sich der Chat-Assistent bereits vorgestellt hat, um wiederholtes automatisches Öffnen zu vermeiden.",
          "nexify-consent (localStorage): speichert Ihre Auswahl im Cookie-Banner (Kategorien und Zeitpunkt der Entscheidung) – bis zur Löschung oder Änderung durch Sie.",
          "Sitzungskennung des Chats: technische Zuordnung Ihres Gesprächsverlaufs während der Nutzung.",
          "Anmelde-Cookie des Kundenportals (HttpOnly): hält Ihre Sitzung nach dem Login aufrecht; technisch notwendig für den Portalbetrieb.",
        ],
      },
      {
        heading: "Ihre Cookie-Einstellungen (Einwilligungs-Manager)",
        paragraphs: [
          "Beim ersten Besuch dieser Website können Sie über den Cookie-Banner wählen, welche Kategorien Sie zulassen: „Notwendig“ (immer aktiv), „Statistik“ und „Marketing“. Ihre Entscheidung wird ausschließlich lokal in Ihrem Browser gespeichert (nexify-consent) und nicht an Dritte übermittelt.",
          "Die Kategorien Statistik und Marketing sind standardmäßig deaktiviert (Opt-in im Sinne von Art. 6 Abs. 1 lit. a DSGVO bzw. § 25 TDDDG). Solange Sie nicht einwilligen, werden keine entsprechenden Dienste geladen. Derzeit setzt diese Website in beiden Kategorien keine Dienste ein; sie sind für mögliche künftige Erweiterungen vorgesehen und würden vor Aktivierung hier transparent benannt.",
          "Sie können Ihre Auswahl jederzeit mit Wirkung für die Zukunft ändern oder widerrufen: über den Link „Cookie-Einstellungen“ im Seitenfuß jeder Seite.",
        ],
      },
      {
        heading: "Keine standardmäßigen Marketing-Cookies",
        paragraphs: [
          "Ohne gesonderte Ankündigung und Einwilligung werden keine nicht notwendigen Werbe-, Retargeting- oder plattformübergreifenden Tracking-Cookies gesetzt. Wird die Website künftig um solche Dienste erweitert, werden Information und Einwilligungsmechanismus vor Aktivierung angepasst.",
        ],
      },
      {
        heading: "Drittdienste",
        paragraphs: [
          "Zur Auslieferung der Website können CDN- und Schutzdienste (z. B. Cloudflare) technisch notwendige Cookies setzen, die ausschließlich der Sicherheit und Lastverteilung dienen.",
        ],
      },
      {
        heading: "Browser-Einstellungen",
        paragraphs: [
          "Sie können Cookies und lokale Speicherungen über Ihren Browser einsehen, löschen oder blockieren. Bei technisch notwendigen Speicherungen können einzelne Funktionen (z. B. die Sprachwahl) dadurch eingeschränkt sein.",
        ],
      },
    ],
  },
  avv: {
    slug: "avv",
    title: "Auftragsverarbeitung (AVV)",
    intro: "Grundsätze für Projekte, in denen NeXify AI personenbezogene Daten im Auftrag eines Kunden verarbeitet (Art. 28 DSGVO).",
    updated: "Juni 2026",
    sections: [
      {
        heading: "Wann eine AVV erforderlich ist",
        paragraphs: [
          "Eine Vereinbarung zur Auftragsverarbeitung wird geschlossen, wenn NeXify AI personenbezogene Daten ausschließlich nach dokumentierter Weisung des Kunden verarbeitet und die gesetzlichen Voraussetzungen einer Auftragsverarbeitung vorliegen – etwa beim Betrieb von Web-Apps, Shops oder Automatisierungen mit Kundendaten.",
        ],
      },
      {
        heading: "Typische Bestandteile",
        bullets: [
          "Gegenstand, Dauer, Art und Zweck der Verarbeitung",
          "Kategorien betroffener Personen und personenbezogener Daten",
          "Weisungs- und Unterstützungsprozesse",
          "Vertraulichkeitsverpflichtungen der eingesetzten Personen",
          "Technische und organisatorische Maßnahmen (TOM)",
          "Regeln für Unterauftragsverarbeiter und deren Genehmigung",
          "Unterstützung bei Betroffenenrechten und Datenschutz-Folgenabschätzungen",
          "Löschung, Rückgabe und Nachweise nach Vertragsende",
          "Melde- und Unterstützungspflichten bei Datenschutzvorfällen",
          "Kontroll- und Auditrechte des Verantwortlichen",
        ],
      },
      {
        heading: "Typische Unterauftragsverarbeiter",
        paragraphs: [
          "Je nach Projekt können insbesondere folgende Kategorien von Unterauftragsverarbeitern eingesetzt werden: Hosting- und Cloud-Infrastruktur (z. B. Vercel, Hetzner, EU-Rechenzentren), Datenbankdienste (z. B. Supabase), E-Mail-Versanddienste (z. B. Resend), CDN- und Sicherheitsdienste (z. B. Cloudflare) sowie – bei AI-Funktionen – Anbieter von KI-Sprachmodellen.",
          "Die konkrete, projektbezogene Liste wird in der jeweiligen AVV dokumentiert und aktuell gehalten.",
        ],
      },
      {
        heading: "Technische und organisatorische Maßnahmen",
        bullets: [
          "Transportverschlüsselung (TLS) für alle Datenübertragungen",
          "Zugriffskontrolle nach dem Least-Privilege-Prinzip",
          "Getrennte Umgebungen für Entwicklung, Test und Produktion",
          "Protokollierung sicherheitsrelevanter Ereignisse",
          "Regelmäßige Updates und Sicherheits-Patches",
          "Datensparsamkeit und Pseudonymisierung, wo möglich",
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
    intro: "NeXify AI bietet Leistungen ausschließlich im unternehmerischen Geschäftsverkehr (B2B) an.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "Kein Verbrauchervertrag",
        paragraphs: [
          "Verträge werden ausschließlich mit Unternehmern, juristischen Personen und vergleichbaren Organisationen geschlossen, die in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit handeln. Das gesetzliche Verbraucherwiderrufsrecht für Fernabsatzverträge findet daher grundsätzlich keine Anwendung.",
          "Mit Anfrage und Beauftragung bestätigt der Auftraggeber, als Unternehmer im Sinne des anwendbaren Rechts zu handeln.",
        ],
      },
      {
        heading: "Ausnahmefälle",
        paragraphs: [
          "Sollte im Ausnahmefall eine Person entgegen dieser Ausrichtung als Verbraucher handeln wollen, muss dies vor Vertragsschluss ausdrücklich offengelegt und gesondert vereinbart werden. In diesem Fall werden die gesetzlichen Informationspflichten und Widerrufsbelehrungen individuell bereitgestellt – oder der Vertragsschluss wird abgelehnt.",
        ],
      },
      {
        heading: "Kulanz bei Projektabbruch",
        paragraphs: [
          "Unabhängig vom fehlenden gesetzlichen Widerrufsrecht gilt: Vor Beginn der Umsetzung kann ein beauftragtes Projekt in Textform kostenfrei storniert werden, sofern noch keine Leistungen erbracht wurden. Bereits erbrachte Konzeptions- oder Umsetzungsleistungen werden anteilig nach Tagessatz abgerechnet.",
        ],
      },
    ],
  },
};
