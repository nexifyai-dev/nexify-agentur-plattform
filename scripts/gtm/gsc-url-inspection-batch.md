# FILE: scripts/gtm/gsc-url-inspection-batch.md
# NIR: 02.08.2026 11:15
# UPDATED: 02.08.2026 11:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM / SEO
# WHAT: Geordnete URLs für GSC „Indexierung beantragen“ inkl. 15 Leistungen (#252)
# WHY: Rate-Limits + kommerzielle Priorität — Human klickt; Agents halten Liste aktuell
# BEST-PRACTICE: Nur Live-200 + in Sitemap; Soft-404s auslassen
# PITFALL: V-GSC-02: Locale-Pfade / 404-Landings beantragen = Coverage-Müll
# DEPENDS: docs/operations/GOOGLE-SEARCH-CONSOLE.md; Property nexifyai.cloud
# DOCS-REF: https://search.google.com/search-console
# SESSION: gsc-max-owner-capabilities-7dd5

# GSC URL-Inspection Batch — Money + 15 Leistungen

**Owner:** Pascal Courbois (`nexify.login@gmail.com`)  
**Portal:** https://search.google.com/search-console → Property `nexifyai.cloud` → **URL-Prüfung**  
**Live seit:** PR #252 (15× `/leistungen/*`)

## Ablauf (pro URL)

1. URL einfügen → Enter  
2. Live-URL testen (optional)  
3. **Indexierung beantragen** (wenn „URL ist nicht auf Google“ / veraltet)  
4. Nächste URL — Pause bei Quota-Warnung  

Quota: Google limitiert Anträge/Tag — bei Block Stopp, morgen fortsetzen.

## Batch A — Core Money (1–4)

| # | URL | Warum |
|---|-----|--------|
| 1 | https://www.nexifyai.cloud/ | Home / Brand |
| 2 | https://www.nexifyai.cloud/preise | Money — Tagessatz |
| 3 | https://www.nexifyai.cloud/leistungen | Money — Katalog |
| 4 | https://www.nexifyai.cloud/vergleich | Commercial intent |

## Batch B — 15 Leistungs-Landings (P0, #252)

| # | URL | Warum |
|---|-----|--------|
| 5 | https://www.nexifyai.cloud/leistungen/landingpages | P0 — Landingpages |
| 6 | https://www.nexifyai.cloud/leistungen/websites | P0 — Websites |
| 7 | https://www.nexifyai.cloud/leistungen/onlineshops | P0 — Onlineshops |
| 8 | https://www.nexifyai.cloud/leistungen/enterprise-commerce | P0 — Enterprise-Commerce |
| 9 | https://www.nexifyai.cloud/leistungen/web-apps | P0 — Web-Apps |
| 10 | https://www.nexifyai.cloud/leistungen/mobile-apps | P0 — Mobile Apps |
| 11 | https://www.nexifyai.cloud/leistungen/automatisierung | P0 — Automatisierung |
| 12 | https://www.nexifyai.cloud/leistungen/ai-agenten | P0 — AI-Agenten |
| 13 | https://www.nexifyai.cloud/leistungen/ki-begleiter | P0 — KI-Begleiter |
| 14 | https://www.nexifyai.cloud/leistungen/kundenportal | P0 — Kundenportal |
| 15 | https://www.nexifyai.cloud/leistungen/ki-plattform | P0 — KI-Plattform |
| 16 | https://www.nexifyai.cloud/leistungen/beratung | P0 — KI-Beratung |
| 17 | https://www.nexifyai.cloud/leistungen/workshops | P0 — Workshops |
| 18 | https://www.nexifyai.cloud/leistungen/white-label | P0 — White-Label |
| 19 | https://www.nexifyai.cloud/leistungen/audit | P0 — KI-/Prozess-Audit |

## Batch C — Branchen + CTAs (danach / Tag 2)

| # | URL | Warum |
|---|-----|--------|
| 20 | https://www.nexifyai.cloud/audit | Alias Audit-Landing |
| 21 | https://www.nexifyai.cloud/branchen | Branchen Hub |
| 22 | https://www.nexifyai.cloud/branchen/handwerk | P1 — Handwerk |
| 23 | https://www.nexifyai.cloud/branchen/steuerberater | P1 — Steuerberater |
| 24 | https://www.nexifyai.cloud/branchen/ecommerce | P1 — E-Commerce |
| 25 | https://www.nexifyai.cloud/branchen/immobilien | P1 — Immobilien |
| 26 | https://www.nexifyai.cloud/branchen/agenturen | P1 — Agenturen |
| 27 | https://www.nexifyai.cloud/kontakt | Conversion |
| 28 | https://www.nexifyai.cloud/rueckruf | Conversion / Booking |
| 29 | https://www.nexifyai.cloud/plattform | Product |
| 30 | https://www.nexifyai.cloud/checkliste | Lead magnet |

## Später nachziehen (wenn Live-200 + Sitemap)

Nicht beantragen solange Soft-404 / 404:

- `/ki-agentur`
- `/vergleich/chatgpt`, `/vergleich/freelance`

## Copy-Paste Batch B (15 Leistungen)

```
https://www.nexifyai.cloud/leistungen/landingpages
https://www.nexifyai.cloud/leistungen/websites
https://www.nexifyai.cloud/leistungen/onlineshops
https://www.nexifyai.cloud/leistungen/enterprise-commerce
https://www.nexifyai.cloud/leistungen/web-apps
https://www.nexifyai.cloud/leistungen/mobile-apps
https://www.nexifyai.cloud/leistungen/automatisierung
https://www.nexifyai.cloud/leistungen/ai-agenten
https://www.nexifyai.cloud/leistungen/ki-begleiter
https://www.nexifyai.cloud/leistungen/kundenportal
https://www.nexifyai.cloud/leistungen/ki-plattform
https://www.nexifyai.cloud/leistungen/beratung
https://www.nexifyai.cloud/leistungen/workshops
https://www.nexifyai.cloud/leistungen/white-label
https://www.nexifyai.cloud/leistungen/audit
```

## Copy-Paste Batch A (Core)

```
https://www.nexifyai.cloud/
https://www.nexifyai.cloud/preise
https://www.nexifyai.cloud/leistungen
https://www.nexifyai.cloud/vergleich
```
