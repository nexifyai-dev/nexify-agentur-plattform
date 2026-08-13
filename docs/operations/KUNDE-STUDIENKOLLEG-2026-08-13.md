# Kundenstammdaten — Studienkolleg Aachen (W2G Academy GmbH)

UPDATED: 13.08.2026 (Europe/Berlin) — angelegt als EIGENSTÄNDIGER Kunde (Pascal-Auftrag).

## Stammdaten

| Feld | Wert |
|---|---|
| Kundenname | W2G Academy GmbH (Studienkolleg Aachen / „Dein Studienkolleg") |
| Plattform | https://app.deinstudienkolleg.de |
| Ansprechpartnerin | Laura |
| E-Mail | info@stk-aachen.de |
| Adresse | Theaterstrasse 24, 52062 Aachen, Deutschland |
| USt-IdNr. (Kunde) | DE333306663 |
| Tagessatz (daily_rate_eur) | 449,00 € netto |
| Reverse Charge | ja (§ 13b UStG — DE-USt-ID vorhanden, Leistung NL → DE) |
| Status | active |
| Zahlungsart | Vorabkasse (Rechnung AN--2025119, Revolut Business) |

## Zuordnung & Historie

- **Erstprojekt:** lief als Projekt IM AUFTRAG von FixDigital Aachen (Refinanzierung durch FixDigital).
- **Folgeprojekt (neu):** läuft DIREKT mit W2G Academy GmbH — Angebot **AN-2026-0813-001**
  (Plattform- & KI-Integration, 2 Arbeitstage × 449,00 € = 898,00 € netto statt regulär 4.500,00 €,
  Rabatt begründet als Folgeprojekt des durch FixDigital finanzierten Projekts).
- **Gültigkeit Angebot:** bis 12.09.2026. Annahme = vollständiger Zahlungseingang (Vorkasse).

## Leistungsumfang (Angebot AN-2026-0813-001)

1. Hostinger-VPS-Ersteinrichtung (Härtung: Firewall, SSH-Key-only, Fail2Ban, SSL)
2. Aufsetzen des Studienkolleg-Projekts auf dem neuen VPS (Zugangsdaten per E-Mail)
3. Google-Classroom-Integration als Open-Source-Lösung
4. RAG-/Dokumentenmanagementsystem (Open Source) ins Gesamtsystem
5. KI-Vollintegration

## Anlagen

- `AN-2026-0813-001-Dein-Studienkolleg-Angebot-V2.pdf` — Angebot (CI, 5 Seiten)
- `invoice_AN--2025119.pdf` — Rechnung (Vorabkasse)
- `Anschreiben-Laura-Variante-B.md` — Anschreiben Du-Form mit Signatur
# Kundenprojekt-Isolation — Studienkolleg Aachen vs. FixDigital Aachen

UPDATED: 13.08.2026 (Europe/Berlin)

## Grundsatz (§0b Mandantentrennung, §0e Kundenprojekt-Isolation, DSGVO Art. 28/32)

Studienkolleg Aachen (W2G Academy GmbH) und FixDigital Aachen sind **getrennte Kunden**.
Rechtlich und technisch strikt zu trennen:

| Ebene | Regel |
|---|---|
| Vertrag | Eigenes Angebot AN-2026-0813-001 mit W2G Academy GmbH — KEINE FixDigital-Vertragsdokumente verwenden; Bezug auf FixDigital nur als Rabatt-Begründung |
| Datenhaltung | Eigene DB-Zeile in `customers` (customer_id getrennt); keine gemeinsamen Sammel-Tabellen ohne tenant/customer_id |
| Repos | Eigenes Repo `nexifyai-dev/studienkolleg` (existiert) — FixDigital-Projekte (bookando) bleiben in eigenen Repos (`nexifyai-dev/bookando-de`) |
| Deployment | Eigenes Verzeichnis: `/workspace/nexifyai/clients/studienkolleg` (Container) ↔ `/opt/nexifyai/repos/studienkolleg` (Host-Spiegel) |
| Kommunikation | Mails/Angebote/Rechnungen nur im Kanal des jeweiligen Kunden; Empfänger↔Inhalt-Gegentest vor Versand |
| KI-Kontext | Bei kundenbezogenen Aufgaben nur Kontext DIESES Kunden laden (kein Cross-Kunden-Context) |
| AVV/TOM | AVV (Art. 28 DSGVO) je Kunde; Subprozessor-Liste; Zugriffskontrolle/Verschlüsselung/Logging (Art. 32) |
| CI/CD | Getrennte Pipelines je Repo; keine Cross-Kunden-Deploys |

## Konkrete Trennung (Stand 2026-08-13)

- **FixDigital Aachen:** Erstprojekt Studienkolleg (Refinanzierung), laufend. Eigener Kunden-Kontext.
- **W2G Academy GmbH (Studienkolleg Aachen):** neuer, eigenständiger Kunde. Angebot AN-2026-0813-001,
  Rechnung AN--2025119 (Vorabkasse). Kundenakte hier.
- Host-Spiegel `clients/studienkolleg` + `customers`-DB-Eintrag werden per Einspiel-Paket angelegt (root).

## Vorfall-Regel

Bei Verdacht auf Vertauschung/Vermischung: sofort stoppen, Pascal alarmieren, Datenintegritäts-Check
(vorher/nachher-Vergleich), Vorfall-Dokumentation.
