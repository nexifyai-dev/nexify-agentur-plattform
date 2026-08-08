# FILE: /docs/gtm/M-08-BRANCHENPAGES-AUFBAU-ANLEITUNG-2026-08-08.md
# NIR: 08.08.2026 12:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: M-08 Umsetzung — Branchenpages vertiefen + 5 neue Branchen (SEO-Funnel B2B)
# WHY: Frewert-Muster Branchen-Landingpages (spezifische Pain-Points, FAQPage-Schema);
#      mehr Long-Tail-Landing-URLs für organische Branchen-Intents ohne Paid Ads
# BEST-PRACTICE: Empathische Pain-Point-Sektion, FAQPage + Service-Schema, 3 CTAs,
#      Unique-Content je Branche, keine Fake-Case-Metriken (V-GTM-BR-01/02)
# PITFALL: V-GTM-TRUST-01/02: kein AggregateRating; kein Rechts-/Medizinrat auf Kanzlei-/Pflege-Seiten
# DEPENDS: M-05 Wissen-Artikel (Verlinkungsziele), M-02 Schema-Muster, apps/website
# DOCS-REF: FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-08
# SESSION: t_0151f14a M-08

# M-08 — Branchenpages: 5 vertieft + 5 neu (P1)

## 1. Status

| Maßnahme | Status |
|---|---|
| 5 bestehende Branchen vertieft (handwerk, steuerberater, ecommerce, immobilien, agenturen) | ✅ LIVE |
| 5 neue Branchen (kanzleien, logistik, pflege, gastronomie, produktion) | ✅ LIVE |
| Pain-Point-Sektion „Es ist nicht Ihre Schuld, dass …“ je Branche | ✅ |
| 1 konkrete Anwendung je Branche (useCase) | ✅ |
| 3 Anwendungsfälle je Branche (Website / Automatisierung / AI-Agent) mit Leistungs-Links | ✅ |
| Branchen-FAQ mit FAQPage-Schema (3 Fragen je Branche) | ✅ |
| Service-Schema (Breadcrumb + Service + FAQPage JSON-LD) | ✅ |
| 3 Conversion-CTAs je Seite (Rückruf / Audit / Preise) | ✅ |
| Sitemap (10 Einträge via branchenSlugs, automatisch) | ✅ |
| Cross-Links: Leistungsseiten websites/automatisierung/ai-agenten/beratung/audit → neue Branchen | ✅ |
| Contract-Tests tests/branchen-m08.test.mjs (11 Tests) | ✅ grün |
| Deploy via Vercel (origin/main) | ✅ |

## 2. Struktur je Branchenseite (Frewert-Muster adaptiert)

1. **Eyebrow + H1 + Description** — einzigartig je Branche, kein Duplicate Content.
2. **Pain-Point-Sektion** — „Es ist nicht Ihre Schuld, dass …“ (empathisch, struktur- statt
   personenbezogen; 3 Punkte + Abschluss „Struktur lässt sich bauen“).
3. **Typische Engpässe** — 3 konkrete Pains.
4. **Konkrete Anwendung** — 1 echter Anwendungsfall mit Leistungsbezug (keine Fake-Fallstudie).
5. **Was wir anpacken** — 3 Outcomes.
6. **Anwendungsfälle** — 3 Karten: Website, Automatisierung, AI-Agent → Ziel-Leistungsseiten.
7. **CTA-Block** — Rückruf buchen (primary, UTM), Audit 449 €, Preise.
8. **FAQ** — 3 Fragen, sichtbar (details/summary) + **FAQPage JSON-LD**.
9. **Wissen-Link** — 1 passender M-05-Artikel (interne Verlinkung).
10. Schema: BreadcrumbList + FAQPage + Service (Tagessatz-Referenz, kein Fake-Aggregate).

## 3. Neue Branchen & Positionierung

| Slug | Zielgruppe | Kern-Intent |
|---|---|---|
| kanzleien | Rechtsanwälte | Mandats-Erstkontakt strukturieren; KI organisatorisch, kein Rechtsrat |
| logistik | Speditionen | Status-Kommunikation automatisieren, TMS bleibt unangetastet |
| pflege | Pflegeeinrichtungen, ambulante Dienste | Aufnahme-Anfragen ohne Rückruf-Orgie; keine Medizinauskunft |
| gastronomie | Restaurants, Hotels | Reservierung + Bestätigung + Erinnerung (No-Show-Reduktion) |
| produktion | mittelständische Industrie | Angebotsanfrage-Pipeline, Kundenstatus; kein ERP-Eingriff |

## 4. Abgrenzungen (Ausschlüsse, verbindlich)

- **Keine Fake-Fallstudien**, keine erfundenen ROI-/Prozentzahlen (V-GTM-BR-01, per Test abgesichert).
- **Kein Rechtsrat** auf /branchen/kanzleien, **keine Medizinauskunft** auf /branchen/pflege.
- **Kein AggregateRating** (V-GTM-TRUST-01/02) — nur Fakten, keine erfundenen Bewertungen.
- Kein Eingriff in TMS/ERP/Maschinensteuerung — Automation nur auf Kommunikationsebene.

## 5. E2E-Prüfung (durchgeführt)

- 10 URLs `/branchen/<slug>` → HTTP 200 live (Vercel).
- FAQPage-Schema valid (JSON-LD in Seite, 3 Questions je Branche).
- Interne Links: Leistungs-Links, Wissen-Links, CTA-Links → alle 200.
- Negativfall: unbekannter Slug → notFound-Guard (404).
- Regression: bestehende 5 Branchen unverändert (Slugs + Kernfelder per Test).
- Unique-Content-Check: keine doppelten descriptions/pains (per Test).

## 6. Changelog

- `apps/website/CHANGELOG.md` → Abschnitt „Hinzugefügt (2026-08-08 — M-08)“.
