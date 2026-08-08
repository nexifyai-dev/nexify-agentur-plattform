# Changelog — NeXify AI Website (apps/website)

Alle wesentlichen Änderungen an der Website werden nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/) dokumentiert.

## [Unreleased]

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
