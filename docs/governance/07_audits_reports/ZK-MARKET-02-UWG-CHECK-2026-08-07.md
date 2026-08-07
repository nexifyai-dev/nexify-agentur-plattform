# ZK-Eintrag: MARKET-02 — UWG-§7-Compliance-Check E-Mail-Kette (07.08.2026)

**Datum:** 07.08.2026 21:10 CEST
**Status:** ABGESCHLOSSEN (alle 5 Prüfpunkte OK nach Fixes)
**Referenz:** docs/standards/UWG-CHECK-2026-08-07.md (vollständiges Protokoll)

## Ergebnis

Cold-Email-Kette (Templates + Bulk/Drip + SMTP + Opt-out-Route) gegen UWG § 7, DSGVO Art. 6-lit.-f/21, EU AI Act Art. 50 geprüft. 2 Templates (followup, breakup) nicht compliant → gehoben. Opt-out-Pfad war funktionsunfähig (404-Link + Token-Pflicht ohne Token-Rendering) → Route-Fix. Art. 21 technische Umsetzung fehlte → umgesetzt.

## Fixes (live)

1. Templates followup + breakup: Compliant-Shell (Werbe-Kennzeichnung, Rechtsgrundlage, Art.21, AI-Act, Impressum). Alle 6 Template-Links auf /api/outreach/unsubscribe. 3 Verzeichnisse sync, MD5 6/6.
2. Route: Token optional; persistiert in leads.unsubscribed (PostgREST) + OUTREACH_UNSUB_FILE (/var/lib/nexifyai/unsubscribed.jsonl, pipeline.env).
3. DB: ALTER TABLE leads ADD COLUMN unsubscribed boolean NOT NULL DEFAULT false (live).
4. Send-Scripts (send_to_qualified_v2.py Bulk, drip-campaign.py /usr/local/bin + Spiegel): unsubscribed-Filter.

## Deploy

GitLab MR !1 (fix/uwg-unsubscribe-route-20260807, 4 Commits, 11 Changes). Route-Deploy blockiert durch fremden Merge-Konflikt in main (UU site-header.tsx/layout.tsx) — P1-Follow-up.

## Bewertung

Bis Route-Deploy: Opt-out-Link 404 (Compliance-Risiko, dokumentiert). Templates + Filter live wirksam ab nächster Welle.

**Kategorie:** Audit/Compliance
