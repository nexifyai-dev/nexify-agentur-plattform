# Evidence: Vitrine E2E-Flow + API-Contact-Fix — 13.07.2026 06:55 CEST

## Problem
Das Kontaktformular auf vitrine.nexifyai.cloud POSTete an /api/contact (Next.js API-Route),
aber dieser Endpoint existierte NICHT im Portal auf :8880. Alle Website-Leads verschwanden.

## Fix
1. /api/contact -> _public_lead_submit() im Portal server.py (do_POST)
2. _public_lead_submit aktualisiert: company/phone Felder, name-company-Fallback
3. Portal restart + E2E-Test

## Verifikation
- L1: POST /api/contact -> HTTP 200
- L2: Lead-19 in Pipeline: name=Interessierter Kunde, email=interessent@beispiel.de
- L3: Intelligence API zeigt 19 Leads

## Gelernt
- Niemals API-Endpoints als "existiert" annehmen ohne E2E-Test
- Next.js `proxyPost()` fallbackt zu 503 "Nicht konfiguriert" statt Fehler zu werfen
- Website-Formular-Daten verschwinden leise, wenn Backend fehlt
