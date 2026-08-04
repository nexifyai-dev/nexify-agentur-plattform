// FILE: apps/website/lib/legal/de.ts
// UPDATED: 04.08.2026 12:00 — Vollständige Neufassung aller 7 Rechtstexte
// Keine [BITTE ERGÄNZEN]-Platzhalter mehr. Deutsches Recht, B2B-Ausrichtung.

export type LegalSubsection = { id?: string; heading: string; paragraphs?: string[]; bullets?: string[] };
export type LegalSection = { id?: string; heading: string; paragraphs?: string[]; bullets?: string[]; subsections?: LegalSubsection[] };
export type LegalRelatedLink = { label: string; href: string };
export type LegalPageData = { slug: string; title: string; intro: string; updated: string; sections: LegalSection[]; related?: LegalRelatedLink[] };

export const legalDe: Record<string, LegalPageData> = {

  impressum: {
    slug: "impressum", title: "Impressum",
    intro: "Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG), § 18 Abs. 2 MStV. Sitz: Venlo, Niederlande. Angebot ausgerichtet auf den DACH-Markt.",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "AGB", href: "/agb" }, { label: "AVV", href: "/avv" }, { label: "Widerruf", href: "/widerruf" }, { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" }, { label: "KI-Hinweise", href: "/ki-hinweise" }],
    sections: [
      { id: "diensteanbieter", heading: "§ 1 Diensteanbieter",
        paragraphs: ["NeXify AI by NeXify – Chat it. Automate it.", "Inhaber: Pascal Courbois (Eenmanszaak)", "Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande", "Handelsregister: KvK Nr. 90483944", "USt-ID: NL865786276B01"] },
      { id: "kontakt", heading: "§ 2 Kontakt",
        paragraphs: ["E-Mail: mail@nexifyai.cloud", "Telefon: +31 6 133 188 56 (Mo–Fr 09–18 Uhr)", "Web: https://www.nexifyai.cloud"] },
      { id: "vertretung", heading: "§ 3 Vertretung und redaktionelle Verantwortung",
        paragraphs: ["Gesetzlicher Vertreter: Pascal Courbois. Verantwortlich für redaktionelle Inhalte nach § 18 Abs. 2 MStV: Pascal Courbois (Anschrift wie § 1)."] },
      { id: "aufsicht", heading: "§ 4 Aufsichtsbehörde",
        paragraphs: ["Zuständige Handelskammer: KvK Eindhoven. Datenschutz-Aufsicht: Autoriteit Persoonsgegevens (Den Haag, NL). Eine gesonderte Berufshaftpflichtversicherung besteht derzeit nicht."] },
      { id: "b2b", heading: "§ 5 B2B-Ausrichtung",
        paragraphs: ["Das Angebot richtet sich ausschließlich an Unternehmer (§ 14 BGB) und juristische Personen des öffentlichen Rechts. Verträge mit Verbrauchern (§ 13 BGB) werden nicht geschlossen."] },
      { id: "streit", heading: "§ 6 Streitbeilegung und anwendbares Recht",
        paragraphs: ["Als B2B-Anbieter keine Teilnahme an Verbraucherschlichtung. Es gilt niederländisches Recht. Gerichtsstand: Venlo, Niederlande."] },
      { id: "haftung", heading: "§ 7 Haftung und Urheberrecht",
        paragraphs: ["Inhalte mit größtmöglicher Sorgfalt erstellt. Keine Gewähr für Vollständigkeit. Für externe Links sind deren Betreiber verantwortlich. Alle Inhalte urheberrechtlich geschützt."] },
    ],
  },

  datenschutz: {
    slug: "datenschutz", title: "Datenschutzerklärung",
    intro: "Datenschutzinformationen gemäß Art. 12 ff. DSGVO sowie § 25 TTDSG. Transparenz ist Grundlage für Vertrauen.",
    updated: "4. August 2026",
    related: [{ label: "Impressum", href: "/impressum" }, { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" }, { label: "AVV", href: "/avv" }, { label: "KI-Hinweise", href: "/ki-hinweise" }, { label: "AGB", href: "/agb" }],
    sections: [
      { id: "verantwortlicher", heading: "1. Verantwortlicher",
        paragraphs: ["Pascal Courbois (NeXify AI by NeXify), Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande. E-Mail: mail@nexifyai.cloud, Tel: +31 6 133 188 56."] },
      { id: "dsb", heading: "2. Datenschutzbeauftragter",
        paragraphs: ["Keine gesetzliche Pflicht zur Bestellung (Art. 37 DSGVO). Anfragen an: mail@nexifyai.cloud."] },
      { id: "allgemeines", heading: "3. Allgemeines zur Datenverarbeitung",
        paragraphs: ["Wir verarbeiten personenbezogene Daten ausschließlich unter Beachtung der DSGVO und des TTDSG. Keine automatisierte Entscheidungsfindung (Art. 22 DSGVO)."],
        bullets: ["Art. 6 Abs. 1 lit. a – Einwilligung", "Art. 6 Abs. 1 lit. b – Vertragserfüllung", "Art. 6 Abs. 1 lit. c – Rechtliche Pflicht", "Art. 6 Abs. 1 lit. f – Berechtigte Interessen"] },
      { id: "hosting", heading: "4. Hosting und Server-Logfiles",
        paragraphs: ["Hosting: Vercel Inc. (USA) mit EU-Standardvertragsklauseln. Cloudflare (CDN/WAF). Bei Aufruf: IP-Adresse (gekürzt), Zeitstempel, URL, Statuscode, Referrer, User-Agent. Löschung nach 30 Tagen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO."] },
      { id: "kontaktformular", heading: "5. Kontaktformular und Kommunikation",
        paragraphs: ["Erhoben werden: Name, E-Mail, Unternehmen, Telefon (optional), Projektbeschreibung. Speicherung in Supabase/PostgreSQL (EU). E-Mail-Versand über Resend (USA, SCC). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO."] },
      { id: "ki-chat", heading: "6. KI-Berater (Live-Chat)",
        paragraphs: ["Chat-Nachrichten werden an LLM (9Router/DeepSeek) übermittelt. Keine Speicherung von Chat-Inhalten im KI-Modell. Keine Eingabe von Passwörtern oder Gesundheitsdaten. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO."] },
      { id: "empfaenger", heading: "7. Auftragsverarbeiter",
        bullets: ["Vercel Inc. (USA) – Hosting (SCC)", "Cloudflare Inc. (USA) – CDN/WAF (SCC)", "Resend Inc. (USA) – E-Mail (SCC)", "Supabase Inc. (USA) – Datenbank, EU-Region (SCC)", "DeepSeek (China) – LLM-Inferenz (SCC-Äquivalent)", "Hetzner GmbH (DE) – VPS-Hosting"] },
      { id: "drittland", heading: "8. Drittlandübermittlung",
        paragraphs: ["Übermittlungen außerhalb EWR nur mit Angemessenheitsbeschluss (Art. 45) oder EU-SCC (Art. 46) mit zusätzlichen TOMs."] },
      { id: "betroffenenrechte", heading: "9. Ihre Rechte",
        bullets: ["Auskunft (Art. 15)", "Berichtigung (Art. 16)", "Löschung (Art. 17)", "Einschränkung (Art. 18)", "Datenübertragbarkeit (Art. 20)", "Widerspruch (Art. 21)", "Widerruf der Einwilligung (Art. 7 Abs. 3)", "Beschwerde bei Aufsichtsbehörde (Art. 77)"],
        paragraphs: ["Anfragen an: mail@nexifyai.cloud. Bearbeitung innerhalb 1 Monat."] },
      { id: "speicherdauer", heading: "10. Speicherdauer",
        paragraphs: ["Korrespondenz: 7 Jahre (NL-Recht). Server-Logs: 30 Tage. Chat-Protokolle: max. 12 Monate."] },
      { id: "sicherheit", heading: "11. Technische und organisatorische Maßnahmen",
        paragraphs: ["TLS 1.3, HSTS, CSP, 2FA, regelmäßige Updates, automatisierte Security-Scans (Dependabot, CodeQL)."] },
    ],
  },

  agb: {
    slug: "agb", title: "Allgemeine Geschäftsbedingungen (B2B)",
    intro: "Vertragsgrundlagen für sämtliche Leistungen von NeXify AI. Ausschließlich für Unternehmer (§ 14 BGB).",
    updated: "4. August 2026",
    related: [{ label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }, { label: "AVV", href: "/avv" }, { label: "Widerruf", href: "/widerruf" }, { label: "KI-Hinweise", href: "/ki-hinweise" }],
    sections: [
      { id: "geltung", heading: "1. Geltungsbereich",
        paragraphs: ["Diese AGB gelten für alle Verträge mit Unternehmern (§ 14 BGB). Abweichende AGB des Auftraggebers werden nicht Vertragsbestandteil."] },
      { id: "vertragsschluss", heading: "2. Vertragsschluss",
        paragraphs: ["Angebote freibleibend. Vertrag durch schriftliche Auftragsbestätigung oder Leistungsbeginn. KI-indizierte Angebote unverbindlich."] },
      { id: "verguetung", heading: "3. Vergütung",
        paragraphs: ["Tagessatz: 449,00 € netto. Alle Preise zzgl. USt (Reverse Charge möglich). Zahlung: 14 Tage netto. Verzug: 9% über Basiszinssatz."] },
      { id: "mitwirkung", heading: "4. Mitwirkungspflichten",
        paragraphs: ["Auftraggeber stellt Inhalte und Zugänge rechtzeitig. Mehraufwand durch Verspätung wird gesondert vergütet."] },
      { id: "ki", heading: "5. KI-gestützte Arbeitsweise",
        paragraphs: ["KI-Werkzeuge zur Beschleunigung. Fachliche Letztverantwortung beim Auftragnehmer."] },
      { id: "abnahme", heading: "6. Abnahme und Mängel",
        paragraphs: ["Prüffrist: 14 Tage. Keine Rüge = Abnahme. Mängelgewährleistung nach gesetzlichen Vorschriften."] },
      { id: "haftung", heading: "7. Haftung",
        paragraphs: ["Unbeschränkt bei Vorsatz/grober Fahrlässigkeit. Bei leichter Fahrlässigkeit: vertragstypisch vorhersehbarer Schaden, max. Vergütung."] },
      { id: "rechte", heading: "8. Nutzungsrechte",
        paragraphs: ["Vollständige Zahlung = vereinbarte Nutzungsrechte. OSS/Drittdienste nach eigener Lizenz."] },
      { id: "vertraulichkeit", heading: "9. Vertraulichkeit",
        paragraphs: ["Vertrauliche Informationen nur zur Vertragserfüllung. Fortdauer über Vertragsende."] },
      { id: "referenz", heading: "10. Referenznennung",
        paragraphs: ["Auftragnehmer darf Auftraggeber als Referenz nennen, sofern kein Widerspruch."] },
      { id: "schluss", heading: "11. Schlussbestimmungen",
        paragraphs: ["Niederländisches Recht. Gerichtsstand: Venlo, NL. Teilunwirksamkeit berührt Rest nicht."] },
    ],
  },

  avv: {
    slug: "avv", title: "Auftragsverarbeitungsvertrag (AVV / DPA)",
    intro: "Standardvertrag gemäß Art. 28 DSGVO für die weisungsgebundene Verarbeitung personenbezogener Daten.",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "AGB", href: "/agb" }, { label: "Impressum", href: "/impressum" }],
    sections: [
      { id: "gegenstand", heading: "1. Gegenstand und Dauer",
        paragraphs: ["Verarbeitung personenbezogener Daten gemäß Hauptvertrag. Dauer = Vertragslaufzeit + Aufbewahrungsfristen. Kategorien: Kunden-, Interessenten-, Nutzerdaten des Auftraggebers."] },
      { id: "pflichten", heading: "2. Pflichten des Auftragnehmers",
        bullets: ["Weisungsgebundene Verarbeitung", "Vertraulichkeit (Art. 28 Abs. 3 lit. b)", "TOM gemäß Art. 32", "Unterstützung bei Betroffenenrechten und DSFA", "Löschung/Rückgabe nach Vertragsende", "Nachweispflicht auf Anforderung"] },
      { id: "uav", heading: "3. Unterauftragsverarbeiter",
        paragraphs: ["Vercel, Cloudflare, Supabase, Resend. Änderungen werden mit 14-Tage-Frist angekündigt."] },
      { id: "betroffenenrechte", heading: "4. Betroffenenrechte",
        paragraphs: ["Auftragnehmer leitet Anfragen unverzüglich weiter und unterstützt bei der Bearbeitung."] },
      { id: "schluss", heading: "5. Vertragsende",
        paragraphs: ["Löschung oder Rückgabe aller Daten. Schriftliche Löschbestätigung auf Wunsch."] },
    ],
  },

  widerruf: {
    slug: "widerruf", title: "Widerrufsrecht",
    intro: "Klarstellung: NeXify AI schließt Verträge ausschließlich im B2B-Bereich.",
    updated: "4. August 2026",
    related: [{ label: "AGB", href: "/agb" }, { label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }],
    sections: [
      { id: "kein-verbraucher", heading: "1. Kein Verbraucherwiderrufsrecht",
        paragraphs: ["Gesetzliches Widerrufsrecht (§§ 312g, 355 BGB) gilt nur für Verbraucher. NeXify AI schließt ausschließlich B2B-Verträge."] },
      { id: "ausnahme", heading: "2. Ausnahmefall Verbrauchervertrag",
        paragraphs: ["Bei irrtümlichem Verbrauchervertrag: Hinweis + Widerrufsbelehrung oder Rücktritt."] },
      { id: "storno", heading: "3. Freiwilliges Stornorecht (Kulanz)",
        paragraphs: ["Vor Leistungsbeginn: kostenfreie Stornierung. Erbrachte Leistungen: anteilige Abrechnung."] },
    ],
  },

  "cookie-richtlinie": {
    slug: "cookie-richtlinie", title: "Cookie-Richtlinie",
    intro: "Cookies und ähnliche Technologien gemäß § 25 TTDSG und DSGVO. Nur das Nötigste — alles andere nur mit Ihrer Zustimmung.",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "Impressum", href: "/impressum" }, { label: "KI-Hinweise", href: "/ki-hinweise" }],
    sections: [
      { id: "grundlagen", heading: "1. Rechtsgrundlagen",
        paragraphs: ["Technisch notwendig: § 25 Abs. 2 TTDSG (ohne Einwilligung). Alle anderen: § 25 Abs. 1 TTDSG i.V.m. Art. 6 Abs. 1 lit. a DSGVO (mit Einwilligung)."] },
      { id: "eingesetzt", heading: "2. Eingesetzte Speicherungen",
        bullets: ["nexify-lang (localStorage) – Sprachwahl", "nexify-consent (localStorage) – Cookie-Präferenzen", "NEXT_LOCALE (Cookie) – Session-Spracherkennung", "Cloudflare __cf_bm (30 Min) – Bot-Schutz"] },
      { id: "drittanbieter", heading: "3. Keine Tracking-Cookies",
        paragraphs: ["KEINE Cookies von Google Analytics, Facebook, LinkedIn oder Werbenetzwerken. Unser Geschäftsmodell basiert auf direkten B2B-Beziehungen."] },
      { id: "verwaltung", heading: "4. Verwaltung",
        paragraphs: ["Einstellungen jederzeit über „Cookie-Einstellungen\" im Footer änderbar."] },
    ],
  },

  "ki-hinweise": {
    slug: "ki-hinweise", title: "KI-Hinweise und Transparenz",
    intro: "Informationen zum Einsatz Künstlicher Intelligenz gemäß Art. 50 EU AI Act (VO 2024/1689).",
    updated: "4. August 2026",
    related: [{ label: "Datenschutz", href: "/datenschutz" }, { label: "AGB", href: "/agb" }, { label: "Impressum", href: "/impressum" }],
    sections: [
      { id: "transparenz", heading: "1. Sie interagieren mit KI-Systemen",
        paragraphs: ["Der KI-Berater ist ein Large Language Model. Kommunikation automatisiert, menschliche Übernahme jederzeit möglich. Kennzeichnung gemäß Art. 50 Abs. 1 AI Act."] },
      { id: "einsatz", heading: "2. Einsatzbereiche",
        bullets: ["KI-Berater (Chat) – Erstqualifizierung", "Code-Generierung – Entwicklungsunterstützung (menschengeprüft)", "Bildgenerierung – Marketing-Assets (gekennzeichnet)", "E-Mail-Vorsortierung – KI-gestützte Kategorisierung", "Angebotserstellung – KI-unterstützte Kalkulation (freigegeben)"] },
      { id: "risiken", heading: "3. Risiken und Grenzen",
        paragraphs: ["KI kann fehlerhafte Informationen liefern (Halluzinationen). Keine geschäftlichen Entscheidungen allein auf Basis von KI-Ausgaben. Bei Unsicherheit: mail@nexifyai.cloud."] },
      { id: "mensch", heading: "4. Menschliche Kontrolle (Human-in-the-Loop)",
        paragraphs: ["Alle KI-Ergebnisse werden vor Kundenauslieferung durch Pascal Courbois geprüft. KI unterstützt — der Mensch entscheidet."] },
    ],
  },

};
