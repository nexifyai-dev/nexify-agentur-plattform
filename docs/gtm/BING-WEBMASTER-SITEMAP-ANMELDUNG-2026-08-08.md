# FILE: /apps/website/docs/gtm/BING-WEBMASTER-SITEMAP-ANMELDUNG-2026-08-08.md
# NIR: 08.08.2026 15:20
# UPDATED: 08.08.2026 15:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Bing Webmaster Tools Sitemap-Anmeldung — Status + Anleitung (M-13 Punkt 5)
# WHY: ChatGPT-Search retrievt über den Bing-Index; Anmeldung nötig für zügige Indexierung
# BEST-PRACTICE: Sitemap bereits live + robots.txt verweist; manuelle Anmeldung via Microsoft Account
# PITFALL: V-GEO-B01: Kein BING_API_KEY in hermes.env — automatisierte Anmeldung nicht möglich (kein Fake-Key)
# DEPENDS: sitemap.xml (77 URLs, live 200), robots.txt (Sitemap-Zeile)
# DOCS-REF: docs/gtm/GEO-LLM-SEO-2026-08-08.md
# SESSION: m13-geo-llm-seo-7dd5

# Bing Webmaster Tools — Sitemap-Anmeldung

## Status (geprüft 08.08.2026)

| Prüfpunkt | Ergebnis |
|---|---|
| sitemap.xml erreichbar | ✅ HTTP 200, 77 URLs (www.nexifyai.cloud) |
| robots.txt Sitemap-Zeile | ✅ `Sitemap: https://www.nexifyai.cloud/sitemap.xml` |
| Bingbot Zugriff auf / | ✅ HTTP 200 |
| IndexNow / API-Key | ⚠️ kein Key in hermes.env → manuelle Anmeldung nötig |

## Anleitung (Human, 5 Min, einmalig)

1. https://www.bing.com/webmasters → mit Microsoft-Konto anmelden (kostenlos)
2. Website hinzufügen: **URL-Übermittlung** → `https://www.nexifyai.cloud`
3. Verifizierung: **Meta-Tag** (einfachste Variante) oder DNS TXT
   - Meta-Tag in `app/layout.tsx` `<head>` einfügen (danach Deploy) — oder DNS TXT bei Hostinger
4. Nach Verifikation: **Sitemaps** → `https://www.nexifyai.cloud/sitemap.xml` hinzufügen
5. Optional: **IndexNow** aktivieren (Key in hermes.env als `BING_INDEXNOW_KEY` hinterlegen → dann automatisierte Ping-Integration möglich)

## Warum (ChatGPT-Search)

ChatGPT-Search retrievt über den Bing-Index. Ohne Anmeldung wird die Sitemap trotzdem gefunden
(robots.txt + Discovery), aber die Anmeldung beschleunigt Indexierung und liefert Crawl-Einblicke.

## Automatisierung (wenn Key da)

```bash
# IndexNow-Ping (Key in hermes.env hinterlegen):
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{"host":"www.nexifyai.cloud","key":"<KEY>","keyLocation":"https://www.nexifyai.cloud/<KEY>.txt","urlList":["https://www.nexifyai.cloud/"]}'
```
