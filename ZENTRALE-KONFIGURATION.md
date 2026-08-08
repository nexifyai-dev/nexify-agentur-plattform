
## 2026-08-08 — M-01 E-Book-Lead-Magnet live + Fix /api/ebook (500)
- **Landingpage** /ebook live (PR #365, Commit e05fde89) — 10 Strategien, Opt-in, UTM.
- **Fix:** /api/ebook gab 500 (Vercel-Lambda: SUPABASE_URL=127.0.0.1:8000 unerreichbar,
  JWT_SECRET leer). Lösung: Backend-Endpoint /api/ebook (ebook_endpoint.py, FastAPI :8901)
  + Frontend-Route als Proxy (proxyPost). Commit 595176bc.
- **Backend-Endpoint** schreibt Opt-in-Lead in Drip-Tabelle `leads` (PostgREST,
  Service-Role-JWT mit PGRST_JWT_SECRET + pipeline-Service-Key KGDX…) UND nexify_leads
  (Pool), sendet E-Book-Mail via send_email (Resend→SMTP-Fallback). CI-Mail #111114/Lime.
- **Drip-Trigger:** drip-campaign.py um Opt-in-Filter erweitert (nur source=ebook oder
  metadata.consent=true) — UWG-§7-Compliance: keine Mails an gescrapte firecrawl-Leads.
  Produktionskopien synchronisiert (3 Pfade), Timer aktiv (täglich 00:04).
- **E2E:** api.nexifyai.cloud + www.nexifyai.cloud POST /api/ebook → 200, leadStored+leadNex+mailSent
  (DB belegt). Negativfall (ungültige Mail) → 400. PDF 200 (109 KB). tsc + Build grün.
- **Cleanup:** alle Test-Leads entfernt; e2e-*-Leads auf contacted (kein Drip-Versand).
- **Befund:** hermes.env überschreibt SUPABASE_SERVICE_ROLE_KEY mit sb_secret_*-Key
  (Kong: 401) — Backend liest Service-Key deshalb explizit aus pipeline.env.
