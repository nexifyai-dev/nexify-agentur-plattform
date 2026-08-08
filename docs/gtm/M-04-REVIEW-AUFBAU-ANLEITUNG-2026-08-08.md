# FILE: /docs/gtm/M-04-REVIEW-AUFBAU-ANLEITUNG-2026-08-08.md
# NIR: 08.08.2026
# UPDATED: 08.08.2026
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Schritt-für-Schritt-Anleitung für Google Business Profile (GBP) und ProvenExpert
#       (Owner-Gates: Login/Verifizierung durch Pascal) + Review-Request-Mailing
# WHY: M-04 FREWERT-MARKETING-MASSNAHMENKATALOG — externer Review-Aufbau; echte Evidenz,
#      keine Fake-Bewertungen; DSGVO-/UWG-konform (Art. 21 DSGVO, §7 UWG)
# BEST-PRACTICE: NAP exakt aus NAP_MASTER_V1.md; UTM an Links; ehrliche Reviews
# PITFALL: V-GTM-TRUST-01/02: nie AggregateRating ohne nachweisbare Reviews
# DEPENDS: docs/gtm/NAP_MASTER_V1.md, GBP-OPS-CHECKLIST.md, evidence/supply-wave1/S01/S19,
#          infra/lead-pipeline/templates/lead_email_review_request.html
# DOCS-REF: FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-04
# SESSION: t_ceb434ff M-04

# M-04 — Externer Review-Aufbau: Google Business Profile + ProvenExpert

## 1. Status

| Kanal | Status | Owner-Gate |
|---|---|---|
| Website /erfahrungen | LIVE (Seite + Review-Schema, kein AggregateRating) | — |
| Google Business Profile | `pending_owner` (S01) | Pascal: Login + Verifizierung |
| ProvenExpert | `ready_to_submit` (S19) | Pascal: Account/E-Mail-Confirm |
| Review-Request-Mail | Template bereit (infra/lead-pipeline/templates/lead_email_review_request.html) | Versand via bestehender Pipeline |

## 2. Google Business Profile — Schritt für Schritt (Pascal, ~20 Min)

**Portal:** https://business.google.com/

1. Mit Unternehmens-E-Mail (mail@nexifyai.cloud) anmelden.
2. „Profil hinzufügen“ → **NeXify AI** (kein Keyword-Spam im Namen).
3. Adresse: **Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande** (aus NAP-Master).
4. Kategorie: primär **Webdesign / Digitalagentur / IT-Dienstleistung**, sekundär E-Commerce, Softwareentwicklung, KI/Automatisierung.
5. Website: `https://www.nexifyai.cloud/?utm_source=google_business&utm_medium=listing&utm_campaign=brand`
6. Service Area: DE, AT, CH, NL (Remote/Hybrid — kein falscher Storefront-Anspruch).
7. Beschreibung (≤750 Zeichen): NAP-Kurzbeschreibung DE verwenden.
8. Telefon: +31 6 133 188 56 · Öffnungszeiten realistisch (Mo–Fr 09–18).
9. Verifizierung: Video oder Postkarte (je nach Google-Flow) — danach Profil öffentlich.
10. Fotos: Logo + echte Brand-Fotos (nichts Erfundenes).

**Wöchentlich (15–20 Min):** 1 GBP-Post, alle Reviews beantworten (höflich, B2B, kein Fake), Insights skimmen. Details: `docs/gtm/GBP-OPS-CHECKLIST.md`.

**Wichtig:** Erst ab echten Reviews AggregateRating-Schema einsetzen — bis dahin bleiben es einzelne Review-Einträge ohne Aggregat (DSGVO/Google-Richtlinien; Frewert-Muster 127×5,0 wird NICHT kopiert).

## 3. ProvenExpert — Schritt für Schritt (Pascal, ~10 Min)

**Portal:** https://www.provenexpert.com/

1. Konto mit mail@nexifyai.cloud anlegen.
2. Firma exakt aus NAP-Master: **NeXify AI by NeXify – Chat it. Automate it.**, Graaf van Loonstraat 1E, 5921 JA Venlo.
3. Kategorie: Digitalagentur / Webentwicklung / IT.
4. Kurztext: NAP-Kurzbeschreibung DE.
5. Website-URL mit UTM: `https://www.nexifyai.cloud/?utm_source=provenexpert&utm_medium=listing&utm_campaign=brand`
6. Nur Free-/Grundtarif wählen (keine Abo-Falle).
7. E-Mail-Confirm abschließen → Profil aktiv; Bewertungs-Link an Kunden senden.

## 4. Review-Request-Mail — Integration

**Template:** `infra/lead-pipeline/templates/lead_email_review_request.html`

- Platzhalter: `{{first_name}}`, `{{project_name}}`, `{{email}}`, `{{token}}`.
- Versand nach Projektabschluss (Kundenverhältnis) — Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO, Opt-out-Link `/api/outreach/unsubscribe?email&token` (UWG §7 / Art. 21 DSGVO), KI-Hinweis (EU AI Act Art. 50).
- Auslieferung über bestehende Mail-Pipeline (`/usr/local/bin/nexifyai-drip-campaign.py` Muster: render_template + send_email + State-Dedupe) — NICHT automatisch verschicken, erst mit realen abgeschlossenen Projekten und nach Freigabe durch Pascal.
- Nach Template-Deploy in Produktion: Kopie nach `/usr/local/share/nexifyai-templates/` + MD5-Sync (Muster MAIL-02-Deploy).

## 5. Erfolgsmetrik (M-04)

- [x] /erfahrungen live (Seite + Schema)
- [x] Review-Request-Template erstellt
- [ ] GBP verifiziert (Pascal)
- [ ] ProvenExpert-Profil live (Pascal)
- [ ] ≥1 echtes Review öffentlich
- [ ] Erst dann: AggregateRating-Schema auf /erfahrungen ergänzen (Doku im Code)

## 6. Quellen

- `docs/gtm/NAP_MASTER_V1.md` (NAP-Master)
- `docs/gtm/GBP-OPS-CHECKLIST.md` (GBP-Ops)
- `docs/gtm/evidence/supply-wave1/S01-google-business.md`, `S19-provenexpert.md`
- `docs/gtm/TESTIMONIAL-PERMISSION-PIPELINE_V1.md` (Permission-first)
- `FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md` M-04
