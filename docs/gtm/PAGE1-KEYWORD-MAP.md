# FILE: /docs/gtm/PAGE1-KEYWORD-MAP.md
# NIR: 02.08.2026 11:00
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Keyword → URL → status map for every sellable NeXify Leistung (SEO/AEO)
# WHY: Page-1 + AI-citation coverage without paid ads; SoT for content agents
# BEST-PRACTICE: One primary commercial keyword per URL; secondaries on page body/FAQ
# PITFALL: V-SEO-MAP-01: No fake rankings; status = page live, not SERP claim
# DEPENDS: apps/website/lib/gtm/leistungen-seo.ts, sitemap.ts
# DOCS-REF: docs/gtm/OFFER_SNIPPETS_de.md
# SESSION: seo-page1-all-services-7dd5

# Page-1 Keyword Map — NeXify Leistungen

**Ziel:** Google Seite 1 + AI-Search-Zitationen für **jede** verkaufbare Leistung.  
**Hard stops:** Zero paid ads · keine Fake-AggregateRating · keine Fake-Filialen · kein Hermes-Cutover.

**Status-Legende:** `live` = URL im Repo/Sitemap · `draft` = Content geplant · `blocked` = Human-Gate.

## Inventar (verkaufbare Leistungen)

| # | Leistung | Slug | Primär-Keyword (DE, commercial) |
|---|----------|------|----------------------------------|
| 1 | Landingpage | `landingpages` | Landingpage erstellen lassen |
| 2 | Unternehmenswebsite | `websites` | Unternehmenswebsite erstellen lassen |
| 3 | Onlineshop | `onlineshops` | Onlineshop erstellen lassen |
| 4 | Enterprise-Commerce | `enterprise-commerce` | Enterprise Commerce Entwicklung |
| 5 | Web-App | `web-apps` | Web-App entwickeln lassen |
| 6 | Mobile App | `mobile-apps` | Mobile App entwickeln lassen |
| 7 | Automatisierung | `automatisierung` | Geschäftsprozesse automatisieren |
| 8 | AI-Agenten | `ai-agenten` | AI-Agenten für Unternehmen |
| 9 | KI-Begleiter | `ki-begleiter` | KI-Begleiter Unternehmen |
| 10 | Kundenportal | `kundenportal` | Kundenportal entwickeln lassen |
| 11 | KI-Plattform | `ki-plattform` | KI Plattform Integration Unternehmen |
| 12 | KI-Beratung | `beratung` | KI Beratung Mittelstand |
| 13 | Workshops | `workshops` | KI Workshop Unternehmen |
| 14 | White-Label | `white-label` | White-Label Entwicklung Agentur |
| 15 | KI-/Prozess-Audit | `audit` | KI Audit Unternehmen |

Zusatz-GTM (Einstieg, nicht immer „Produkt“): `/sprechstunde`, `/partner`, `/rueckruf`, `/checkliste`.

## Keyword → URL → Status

| Keyword (primary) | URL | Status | Intent |
|-------------------|-----|--------|--------|
| `Landingpage erstellen lassen` | `/leistungen/landingpages` | live | commercial |
| `Unternehmenswebsite erstellen lassen` | `/leistungen/websites` | live | commercial |
| `Onlineshop erstellen lassen` | `/leistungen/onlineshops` | live | commercial |
| `Enterprise Commerce Entwicklung` | `/leistungen/enterprise-commerce` | live | commercial |
| `Web-App entwickeln lassen` | `/leistungen/web-apps` | live | commercial |
| `Mobile App entwickeln lassen` | `/leistungen/mobile-apps` | live | commercial |
| `Geschäftsprozesse automatisieren` | `/leistungen/automatisierung` | live | commercial |
| `AI-Agenten für Unternehmen` | `/leistungen/ai-agenten` | live | commercial |
| `KI-Begleiter Unternehmen` | `/leistungen/ki-begleiter` | live | commercial |
| `Kundenportal entwickeln lassen` | `/leistungen/kundenportal` | live | commercial |
| `KI Plattform Integration Unternehmen` | `/leistungen/ki-plattform` | live | commercial |
| `KI Beratung Mittelstand` | `/leistungen/beratung` | live | commercial |
| `KI Workshop Unternehmen` | `/leistungen/workshops` | live | commercial |
| `White-Label Entwicklung Agentur` | `/leistungen/white-label` | live | commercial |
| `KI Audit Unternehmen` | `/leistungen/audit` | live | commercial |

## Secondary keywords (Auswahl)

Siehe `secondaryKeywords` in `apps/website/lib/gtm/leistungen-seo.ts` — je Leistung 4 Terms (Agentur/DACH/B2B/Use-Case). Nicht stuffen; in FAQ + Body natürlich einsetzen.

## Location modifiers (leicht)

- Deutschland / DACH / remote — in `locationNote` jeder Leistungsseite
- Venlo (NL) als realer Sitz — `/venlo` LocalBusiness
- **Keine** erfundenen Städte-Landingpages

## Interne Verlinkung

- Hub `/leistungen` → `/leistungen/[slug]`
- Jede Leistung → `/branchen/*`, `/vergleich*`, verwandte Leistungen, `/rueckruf`
- Branchen → Leistungen + `/audit`
- Vergleich → Leistungen + Branchen

## AEO / AI citations

- Answer-first Block + FAQPage JSON-LD auf jeder Leistungsseite
- `public/llms.txt` (+ `llm.txt`) mit cite-friendly Service-Liste
- Keine erfundenen Reviews/Ratings

## Rollout checklist

- [x] `/leistungen/[slug]` für alle 15
- [x] Sitemap inkl. Leistungen + Branchen + Audit
- [x] llms.txt
- [x] Branchen-Hub + 5 ICP-Pages (Koordination Competitors-IA)
- [ ] GSC URL-Inspection nach Merge (human)
- [ ] interne Backlinks aus Blog/Wissen (follow-up)
