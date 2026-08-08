
## 2026-08-08 — M-03b Stadt-Landingpages Teil 2/2 (Düsseldorf, Stuttgart, Leipzig, Dortmund, Hannover)
- **Live:** /stadt/duesseldorf, /stadt/stuttgart, /stadt/leipzig, /stadt/dortmund, /stadt/hannover — HTTP 200, Titel-Muster "KI-Agentur [Stadt] » Gratis KI-Audit | NeXify AI" exakt.
- **Content:** 10-Städte-Registry (lib/gtm/stadt-seo.ts, Commit 78d169e8) deckt Teil 1+2 ab; je Stadt 400+ Wörter Unique-Content (Doku: max 19 % pairwise Similarity, Grenze 60 %).
- **Fix (Commit e4cae81f):** Titel-Doppel-Suffix behoben — page.tsx gab "| NeXify AI" im title UND Root-Layout-Template "%s | NeXify AI" hängte Suffix an → "…Gratis KI-Audit | NeXify AI | NeXify AI". Jetzt: Template liefert Suffix, page übergibt ohne.
- **Schema:** LocalBusiness+ProfessionalService (Venlo-Sitz, areaServed=Stadt, kein Fake-Filialnetz), BreadcrumbList (3), FAQPage (4) — pro Seite validiert.
- **CTAs:** 3 mit UTM (utm_source=stadtseite&utm_medium=organic&utm_campaign=<slug>) — /audit, /preise, /kontakt.
- **Interne Links:** /leistungen, /branchen, /ki-agentur — alle HTTP 200 (Link-Check über alle 5 Seiten).
- **Sitemap:** alle 5 Einträge live (stadtSlugs() dynamisch, Commit 78d169e8).
- **Negativfall:** /stadt/bremerhaven, /stadt/oberhausen, /stadt/404er-test → 404 (dynamicParams=false).
- **E2E:** pnpm build grün (Next 16.2.12), lokaler Smoke-Test (200 + korrektes Titel-Muster + 404), Deploy via GitHub Action deploy-vercel.yml → production (Run 31273493205, success).

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
