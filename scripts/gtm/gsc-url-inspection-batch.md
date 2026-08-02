# FILE: scripts/gtm/gsc-url-inspection-batch.md
# NIR: 02.08.2026 11:15
# UPDATED: 02.08.2026 11:15
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM / SEO
# WHAT: Geordnete Top-20-URLs für GSC „Indexierung beantragen“
# WHY: Rate-Limits + kommerzielle Priorität — Human klickt; Agents halten Liste aktuell
# BEST-PRACTICE: Nur Live-200 + in Sitemap; Soft-404s auslassen
# PITFALL: V-GSC-02: Locale-Pfade / 404-Landings beantragen = Coverage-Müll
# DEPENDS: docs/operations/GOOGLE-SEARCH-CONSOLE.md; Property nexifyai.cloud
# DOCS-REF: https://search.google.com/search-console
# SESSION: gsc-max-owner-capabilities-7dd5

# GSC URL-Inspection Batch — Top 20 commercial

**Owner:** Pascal Courbois (`nexify.login@gmail.com`)  
**Portal:** https://search.google.com/search-console → Property `nexifyai.cloud` → **URL-Prüfung**

## Ablauf (pro URL)

1. URL einfügen → Enter  
2. Live-URL testen (optional)  
3. **Indexierung beantragen** (wenn „URL ist nicht auf Google“ / veraltet)  
4. Nächste URL — Pause bei Quota-Warnung  

Quota: Google limitiert Anträge/Tag — bei Block Stopp, morgen fortsetzen.

## Reihenfolge (1–20)

| # | URL | Warum |
|---|-----|--------|
| 1 | https://www.nexifyai.cloud/ | Home / Brand |
| 2 | https://www.nexifyai.cloud/preise | Money — Tagessatz |
| 3 | https://www.nexifyai.cloud/leistungen | Money — Katalog |
| 4 | https://www.nexifyai.cloud/vergleich | Commercial intent |
| 5 | https://www.nexifyai.cloud/kontakt | Conversion |
| 6 | https://www.nexifyai.cloud/rueckruf | Conversion / Booking |
| 7 | https://www.nexifyai.cloud/prozess | Trust / How |
| 8 | https://www.nexifyai.cloud/plattform | Product |
| 9 | https://www.nexifyai.cloud/checkliste | Lead magnet |
| 10 | https://www.nexifyai.cloud/faq | SERP FAQ |
| 11 | https://www.nexifyai.cloud/referenzen | Trust |
| 12 | https://www.nexifyai.cloud/ueber-mich | E-E-A-T |
| 13 | https://www.nexifyai.cloud/venlo | Local SEO |
| 14 | https://www.nexifyai.cloud/wissen | Content hub |
| 15 | https://www.nexifyai.cloud/wissen/ai-automatisierung-kmu | Content |
| 16 | https://www.nexifyai.cloud/wissen/was-kostet-web-app-2026 | Content / Cost intent |
| 17 | https://www.nexifyai.cloud/partner | Partner / White-Label |
| 18 | https://www.nexifyai.cloud/alternativen | Commercial comparison |
| 19 | https://www.nexifyai.cloud/botschafter | Referral program |
| 20 | https://www.nexifyai.cloud/sprechstunde | Conversion / booking-adjacent |

## Später nachziehen (wenn Live-200 + Sitemap)

Nicht beantragen solange Soft-404 / 404:

- `/branchen`, `/branchen/*`
- `/leistungen/{slug}` (landingpages, websites, …)
- `/audit`, `/ki-agentur`
- `/vergleich/chatgpt`, `/vergleich/freelance`

Quelle: PR #252 / SEO-Page1 — nach Merge + Deploy hier ergänzen.

## Copy-Paste (eine Zeile pro Request)

```
https://www.nexifyai.cloud/
https://www.nexifyai.cloud/preise
https://www.nexifyai.cloud/leistungen
https://www.nexifyai.cloud/vergleich
https://www.nexifyai.cloud/kontakt
https://www.nexifyai.cloud/rueckruf
https://www.nexifyai.cloud/prozess
https://www.nexifyai.cloud/plattform
https://www.nexifyai.cloud/checkliste
https://www.nexifyai.cloud/faq
https://www.nexifyai.cloud/referenzen
https://www.nexifyai.cloud/ueber-mich
https://www.nexifyai.cloud/venlo
https://www.nexifyai.cloud/wissen
https://www.nexifyai.cloud/wissen/ai-automatisierung-kmu
https://www.nexifyai.cloud/wissen/was-kostet-web-app-2026
https://www.nexifyai.cloud/partner
https://www.nexifyai.cloud/alternativen
https://www.nexifyai.cloud/botschafter
https://www.nexifyai.cloud/sprechstunde
```
