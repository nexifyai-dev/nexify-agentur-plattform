# FILE: /docs/gtm/SCALE_GATES_V1.md
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 07:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Skalierungsgrenzen nach Wave 1 — Evidence before Scale
# WHY: Verhindert unkontrollierte Verzeichnis-Spam und verfrühte SaaS-/Vergabe-Versprechen
# BEST-PRACTICE: Jede neue Kanalwelle braucht KPI-Nachweis
# PITFALL: V-GTM-07: Öffentliche Vergabe ist kein Free-Listing, sondern Bid-Projekt
# DEPENDS: CHANNEL_REGISTER_V1.md, CONVERSION_LOOP_V1.md
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# SESSION: gtm-kostenfrei-angebote-c6e3

# Scale Gates V1

## Gate S — Weitere Supply-Kanäle

**Voraussetzung:**

1. Wave 1: ≥15 `live` Einträge
2. NAP-Stichprobe ohne Abweichung
3. Mindestens 1 messbarer Inbound-Pfad
4. Keine offenen Abo-/Premium-Fallen

**Dann erlaubt:** S16–S19 auf `live` bringen; weitere Free-Verzeichnisse nur mit neuer Register-Zeile + Evidence.

**Nicht erlaubt ohne neues Mandat:** Paid Boosts, Premium-Profile, Verzeichnis-Netzwerke mit Lead-Gebühren.

## Gate D — Demand-Intensivierung

**Voraussetzung:** Demand-Scan erzeugt ≥3 CRM-Pending mit Score ≥50 und dokumentiertem Kontaktgrund.

**Dann erlaubt:** Häufigerer Scan, zusätzliche Keyword-Varianten, optionale Free-Vergabe-Aggregatoren (nur lesen/score).

**Weiterhin verboten:** Auto-Gebote, Auto-DMs, Scraping ohne Policy.

## Gate V — Öffentliche Vergabe (Teilnahme)

**Default: Owner-Entscheidung erforderlich.**

Teilnahme an bund.de/TED-Verfahren nur wenn:

- Eignung/Referenzen tragfähig
- Aufwand vs. Gewinnchance bewertet
- Rechtliche Unterlagen verfügbar
- Explizite Freigabe durch Pascal

Scannen und Scoren ist erlaubt; Einreichen ist gated.

## Gate P — Plattform-/SaaS-Verkauf

**Default: geschlossen.**

Workstation, Brain-as-a-Service, AI OS, White-Label **nicht** öffentlich listen oder bepreisen, bis:

- Öffentliches Pricing existiert
- Recht/AGB/Support geklärt
- Owner-Mandat dokumentiert

Delivery-USP („AI-gestützt“) bleibt erlaubt.

## Gate C — Communities Auto-Posting

**Default: geschlossen.**

Reddit/LinkedIn/Xing-Antworten nur manuell oder mit Freigabe je Post. Hilfreicher Content ja; Promo-Spam nein.

## Eskalation

Bei Widerspruch zwischen Wachstumsziel und Gate: `docs/governance/` > dieser Scale-Gates-Text. Entscheidung protokollieren in Channel-KPI-Log oder Shared Agent State.
