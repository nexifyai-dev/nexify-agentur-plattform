# FILE: /docs/gtm/SUPPLY_WAVE1_CHECKLIST_V1.md
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 07:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Ausführ-Checkliste Supply Wave 1 (≥15 Free-Listings)
# WHY: Owner und Agent teilen denselben NAP-/Evidence-Prozess
# BEST-PRACTICE: Evidence-Datei vor Status live ausfüllen
# PITFALL: V-GTM-03: Keine Abo-Upgrades ohne Mandat
# DEPENDS: NAP_MASTER_V1.md, CHANNEL_REGISTER_V1.md, OFFER_SNIPPETS_*.md
# DOCS-REF: docs/gtm/evidence/supply-wave1/
# SESSION: gtm-kostenfrei-angebote-c6e3

# Supply Wave 1 — Checkliste

## Vorbereitung (Agent erledigt / erledigt)

- [x] NAP-Master vorhanden
- [x] Offer-Snippets DE/NL vorhanden
- [x] Channel-Register mit IDs S01–S20
- [x] Evidence-Stubs je Wave-1-Kanal angelegt
- [x] Preis-Audit 449 € in Backend-Prompt + Gesamtkonzept

## Owner-Gates (blockiert ohne Pascal)

| Schritt | Kanal | Aktion Owner |
|---------|-------|--------------|
| 1 | S01 Google | Profil anlegen/beanspruchen, Video-/Post-Verify, Service Area DACH+NL, Posts mit Snippets |
| 2 | S02 LinkedIn Company | Seite anlegen/claimen, Featured + About aus Bio |
| 3 | S03 LinkedIn Personal | Headline/About, Featured Link mit UTM, wöchentlicher Post |
| 4 | S04 Xing | Unternehmensprofil + Leistungen |

## Agent/Owner Submit (ready_to_submit)

Für jedes S05–S19:

1. Evidence-Datei öffnen (`docs/gtm/evidence/supply-wave1/Sxx-*.md`)
2. Formular mit NAP + passendem Snippet (DE oder NL) befüllen
3. Nur Free-/Grundeintrag wählen — **keine** Premium-Checkbox
4. UTM-Website-URL setzen
5. Nach Submit: Status `submitted`, Datum, Bestätigungsmail-Notiz
6. Nach Go-Live: öffentliche URL, Screenshot-Hinweis, Status `live`, Channel-Register aktualisieren

## Abnahme Wave 1

- [ ] ≥15 Kanäle Status `live`
- [ ] NAP-Stichprobe 5 Einträge identisch
- [ ] Mindestens 1 Inbound-Pfad messbar (UTM oder GBP Insights)
- [ ] Keine unbeabsichtigten Abos aktiv

## Evidence-Ordner

`docs/gtm/evidence/supply-wave1/` — eine Datei pro Kanal-ID.
