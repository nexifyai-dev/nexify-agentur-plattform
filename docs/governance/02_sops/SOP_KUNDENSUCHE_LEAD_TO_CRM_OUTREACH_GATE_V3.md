# SOP — Kundensuche, Lead-to-CRM und Outreach Gate

## Grundsatz
Kundensuche ist ein geprüfter Agenturprozess, kein Massenmailing.

## Ablauf
Produkt/Leistung auswählen → Zielgruppe bewerten → rechtliche Grenzen prüfen → Suchquellen definieren → potenzielle Firmen erfassen → öffentliche Präsenz analysieren → Bedarf/Chance bewerten → Leadscore berechnen → Kontaktgrund dokumentieren → CRM Lead Pending erstellen → Outreach-Entwurf erzeugen → Legal/Policy Gate → Versandfreigabe → Follow-up planen → CRM Timeline aktualisieren → Brain-Learnings speichern.

## Verbot
Keine Massenmails ohne Freigabe, kein Speichern sensibler Daten ohne Rechtsgrundlage, kein Scraping ohne Policy/Legal Gate, kein automatischer Versand in Stage 1.

## GTM-Anbindung (kostenfreie Kanäle)
Kanalregister, Offer-Snippets, Demand-Queries und Conversion-Loop:
`docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md` · `docs/gtm/CHANNEL_REGISTER_V1.md` ·
`docs/gtm/CONVERSION_LOOP_V1.md`.
Demand-Treffer als CRM-Pending vorbereiten (kein Versand):
`python3 scripts/gtm/demand_scan_prepare.py --input hits.json`.
