# Changelog — NeXify AI Website (apps/website)

Alle wesentlichen Änderungen an der Website werden nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/) dokumentiert.

## [Unreleased]

### Hinzugefügt (2026-08-08 — M-02a)
- **Schema.org Layout-Ebene (M-02 Teil 1)**: Organization-JSON-LD global im Root-Layout (Logo, ContactPoint, address, Offer) — ergänzt um `sameAs` mit der einzigen verifizierten externen Identität (WhatsApp Business `https://wa.me/31613318856`; keine Social-Profile existieren, keine erfundenen URLs). `organizationJsonLd()`-Helper in `lib/seo.ts` synchron aktualisiert. BreadcrumbList (alle Content-Seiten außer Homepage) und WebSite+SearchAction (Homepage) waren bereits live (M-13-Baseline) — E2E verifiziert 08.08.2026: 5 URLs parsen via `json.loads`, je Typ exakt 1×, 404 nur globales Organization, FAQPage/OfferCatalog unverändert.
- **Deploy-Enabler (nur CLI-Pfad, nicht committet)**: `packageManager: pnpm@10.14.0` im Worktree-Root gesetzt, da Vercel-CLI-Build sonst pnpm 6.35.1 nutzt (engines-Fehler). GH-Actions-Pfad (deploy-vercel.yml) ist davon unabhängig.

### Hinzugefügt (2026-08-08 — M-10)
- **Pressemappe** (`docs/gtm/PRESSE-MAPPE-2026-08-08.md`): Story-Angle „Erste KI-Agentur mit 24/7-Agenten-Netzwerk für den Mittelstand in DACH+NL“, 3 Kernbotschaften, Faktenblatt (Team, Leistungen, Preise — verifiziert gegen preisliste-leistungskatalog.md, KvK 90483944, BTW NL865786276B01, Sitz Venlo), verifizierte anonymisierte Projektdaten (Quelle /referenzen de.ts), Kundenstimmen, Presse-Logos-Konzept (Platzierung Startseite//referenzen/Pressemappe/Footer, Nutzungsrecht-Pflicht), Freigabe-Gate Pascal.
- **2 Gastartikel-Entwürfe** (`docs/gtm/drafts/`): (a) unternehmer.de-Stil „Warum Ihr Unternehmen 2026 auf KI-Automatisierung setzen sollte“ (638 Wörter, du-Form, werbefrei, Einreichungsweg unternehmer.de/autor-werden), (b) Startup Valley-Stil „KI-Agenten im Mittelstand: 5 Praxisbeispiele“ (653 Wörter, 5 anonymisierte Use-Cases aus /referenzen). Keine erfundenen Zahlen (V-PR-01), kein Versand ohne Pascal-Freigabe (V-PR-02).
- **Medienliste** (`docs/gtm/MEDIENLISTE-2026-08-08.md`): 10 Ziel-Medien DE (unternehmer.de, t3n, OMT, deutsche-startups.de, startupwissen.biz, impulse) + NL (Frankwatching, MT/Sprout, Emerce, mkb.nl) mit Einreichungswegen, Redaktionsregeln und Workflow; Ergänzung Presse-Portale (openPR kostenfrei, Handelsblatt-Pressportal kostenpflichtig nur nach Freigabe).

### Hinzugefügt (2026-08-08 — M-07)
- **/ki-roi-rechner** (app/ki-roi-rechner, statisch): KI-ROI-Rechner — Eingaben Mitarbeiterzahl, Std/Woche, Stundensatz → jährliche Ersparnis bei 20/40/60 % Automatisierung. Reine Client-Berechnung (`lib/gtm/free-tools.ts`, pure functions, 46 Arbeitswochen/Jahr, keine erfundenen Benchmarks). CTAs zu /preise und /audit mit UTM (`utm_source=ki-roi-rechner`). Schema `WebApplication` (M-02-Muster), Meta-Titel „KI-ROI-Rechner kostenlos".
- **/chatbot-kosten-rechner** (app/chatbot-kosten-rechner, statisch): Chatbot-Kosten-Rechner — Anfragen/Monat + Komplexität (einfach/mittel/komplex) → Kostenvergleich Eigenbau (10–25 Tage à 1.000 €, API 0,02 €/Anfrage) vs. Full-Service-Agentur (3.000–30.000 € Marktspannen 2026, WebChatAgent-Quelle) vs. NeXify KI-Begleiter (3–12 Tage × 449 € netto), inkl. 3-Jahres-Gesamtkosten. CTA zu /leistungen/ki-begleiter mit UTM. Schema `WebApplication`, Meta-Titel „Chatbot-Kosten-Rechner kostenlos".
- **Interne Verlinkung:** /wissen (Sektion „Kostenlose KI-Rechner"), /checkliste (Tool-Karten), Footer (alle 3 Sprachen de/en/nl).
- Sitemap-Einträge `/ki-roi-rechner` + `/chatbot-kosten-rechner` (priority 0.8).
- Tests: `tests/free-tools.test.mjs` (Logik, Randfälle, Datei-Contracts), `tests/e2e/m07-free-tools.spec.ts` (5 E2E: bekannte Ergebnisse, 0-Eingaben-Hinweise, CTA-UTM, Schema, interne Links). `pnpm test` 211/211, E2E m07 5/5, Regression critical-path + ebook 7/7.

### Hinzugefügt (2026-08-08 — M-08)
- **Branchenpages vertieft (5 bestehende: handwerk, steuerberater, ecommerce, immobilien, agenturen)**: Pain-Point-Sektion („Es ist nicht Ihre Schuld, dass …“), 1 konkrete Anwendung je Branche, 3 Anwendungsfälle (Website/Automatisierung/AI-Agent) mit Leistungs-Links, Branchen-FAQ mit **FAQPage-Schema**, Service-Schema, 3 Conversion-CTAs (Rückruf/Audit/Preise), Wissen-Artikel-Link (M-05).
- **5 neue Branchenseiten**: `/branchen/kanzleien` (Rechtsanwälte), `/branchen/logistik`, `/branchen/pflege` (Gesundheit), `/branchen/gastronomie`, `/branchen/produktion` — je Unique-Content, Pain-Points, Anwendungsfälle, FAQ (FAQPage-Schema), Sitemap-Einträge automatisch via `branchenSlugs()`.
- **Cross-Links**: Leistungsseiten (websites, automatisierung, ai-agenten, beratung, audit) verlinken die neuen Branchen-Slugs.
- **Contract-Tests** (`tests/branchen-m08.test.mjs`, 11 Tests): Slugs, Pain-Point-, FAQPage- und Anwendungsfall-Verträge, Unique-Content-Check, Negativfall (404-Guard), Fake-Metriken-Verbot, Wissen-Link-Validierung, Regression auf die bestehenden 5 Branchen.
- **Anleitung** (`docs/gtm/M-08-BRANCHENPAGES-AUFBAU-ANLEITUNG-2026-08-08.md`).

## [2026-08-05] — Compliance-Audit (GDOK §4)

### Hinzugefügt (2026-08-08 — M-04)
- **/erfahrungen Review-Landingpage** (app/erfahrungen + [locale]-Fallback): echte, anonymisierte Kundenstimmen aus `content.references.quotes`, 5-Sterne-Visualisierung, CTA zu /audit + /preise + /rueckruf. Schema `Review`/`Rating` pro Stimme — **kein AggregateRating** (V-GTM-TRUST-01/02, keine erfundenen Bewertungen).
- **Review-Request-Mail-Template** (`infra/lead-pipeline/templates/lead_email_review_request.html`) — Nach-Projektabschluss-Mail, Opt-out-Link, KI-Hinweis, UWG/DSGVO-konform.
- **Anleitung externer Review-Aufbau** (`docs/gtm/M-04-REVIEW-AUFBAU-ANLEITUNG-2026-08-08.md`) — Google Business Profile (S01) + ProvenExpert (S19) Schritt für Schritt, Owner-Gates für Pascal.
- Sitemap-Eintrag `/erfahrungen` + Contract-Tests (`tests/erfahrungen.test.mjs`, 7 Tests) inkl. Negativfall (leere Review-Liste) und Fake-Review-Quellen-Check.

## [2026-08-05] — Compliance-Audit (GDOK §4)
### Geändert
- **AGB § 4** (Vergütung, Tagesabrechnung und Projektkontinuität): Klausel `NXAI-LEGAL-AGB-VERGÜTUNG-2026-v1.0` eingearbeitet — Tagesabrechnung statt Stundenabrechnung, sofortige Fälligkeit (Zahlung bis 09:00 Uhr des Folgetages), Tagesbericht als Leistungsnachweis (§ 4.1), Zahlungsmodalitäten inkl. Revolut-Link und Rechnungsnummernkreis `NEXIFY-YYYY-NNNNN` (§ 4.2), Umsatzsteuer/Reverse-Charge (§ 4.3), Projektkontinuität/Verzug (§ 4.4), Projektstart (§ 4.5), Angebotsbindung 14 Kalendertage (§ 4.6). Alte 14-Tage-Zahlungsfrist und Stundenabrechnung entfernt.
- **AGB § 2/§ 3**: Angebotsbindungshinweis (§ 4.6) und Tagesbericht-Referenz als Leistungsnachweis ergänzt.
- **Datenschutzerklärung**: LLM-Provider OpenRouter und Upstage in § 6 (KI-Berater) und § 7 (Auftragsverarbeiter) ergänzt.
- **AVV**: Unterauftragsverarbeiter-Liste um OpenRouter und Upstage ergänzt.
- **Preise-Seite**: Kurzinfo „Rechnung sofort fällig, Zahlung bis 09:00 Uhr des Folgetages" mit AGB-Verweis (§ 4) ergänzt.
- **Kontaktformular**: Pflicht-Checkbox zur AGB-Akzeptanz (inkl. Tagesabrechnungsmodell) ergänzt.

## [2026-08-04] — Rechts- und Inhaltsüberarbeitung
- Rechtstexte (Impressum, Datenschutz, AGB, AVV, Widerruf, Cookie-Richtlinie, KI-Hinweise) DIN-/ISO-konform vollständig überarbeitet (Stand 4. August 2026).
