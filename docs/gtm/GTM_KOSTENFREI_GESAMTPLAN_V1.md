# FILE: /docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 07:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Operativer Gesamtplan kostenfreie Angebotsinsertion und Kundensuche
# WHY: Eine kanonische GTM-Quelle statt fragmentierter Sales-Notizen
# BEST-PRACTICE: Supply + Demand in CRM/Legal-Gate; Free-Tier only
# PITFALL: V-GTM-02: Kein Massenmail, kein n8n, kein SaaS-Verkauf ohne Pricing
# DEPENDS: SOP Kundensuche, SOP Angebotsgenerator, NAP_MASTER, CHANNEL_REGISTER
# DOCS-REF: docs/governance/02_sops/SOP_KUNDENSUCHE_LEAD_TO_CRM_OUTREACH_GATE_V3.md
# SESSION: gtm-kostenfrei-angebote-c6e3

# Gesamtplan V1 — Kostenfreie Angebotsinsertion & Kundensuche

## 1. Produktfokus (öffentlich verkaufen)

Acht Agentur-Leistungen, Tagessatz **449 € netto** (`apps/website/lib/content/de.ts`, `company.dayRate`):

| Leistung | Tage | Netto |
|----------|------|-------|
| Landingpage | 1 | 449 € |
| Unternehmenswebsite | 2–3 | 898–1.347 € |
| Onlineshop | 6–8 | 2.694–3.592 € |
| Enterprise-Commerce | ab 12 | ab 5.388 € |
| Web-App | 6–8 / ab 12 | 2.694–3.592 € / ab 5.388 € |
| Mobile App | 6–8 / ab 12 | wie Web-App |
| Automatisierung | ab 1 | ab 449 € |
| AI-Agenten | ab 3 | ab 1.347 € |

**Nicht öffentlich verkaufen:** Workstation, 9Router, AgentMemory, LightRAG, Paperclip, OpenMCP — nur als Delivery-USP („AI-gestützt, persönlich verantwortet“).

**ICP:** KMU/Mittelstand DACH+NL; Beratungen/Agenturen; Hersteller/Händler; manuelle Backoffice-/Vertriebsprozesse; entscheidungsreife MVP-Gründer. Nicht: B2C, rein preisgetriebene Ausschreibungen, unklare Vorhaben.

## 2. Architektur

```
Supply (Angebot inserieren) ──► Inbound UTM / Anfragen
Demand (Nachfrage scannen)  ──► Leadscore ──► CRM Pending
                                         │
                                         ▼
                              Legal/Policy Gate
                                         │
                                         ▼
                         Freigegebener Outreach
                                         │
                                         ▼
                    KI-Berater / Angebots-SOP ──► Follow-up
```

Quellen der Wahrheit:

| Artefakt | Pfad |
|----------|------|
| NAP | [NAP_MASTER_V1.md](NAP_MASTER_V1.md) |
| Kanäle | [CHANNEL_REGISTER_V1.md](CHANNEL_REGISTER_V1.md) |
| Inserat-Texte DE | [OFFER_SNIPPETS_de.md](OFFER_SNIPPETS_de.md) |
| Inserat-Texte NL | [OFFER_SNIPPETS_nl.md](OFFER_SNIPPETS_nl.md) |
| Demand-Queries | [DEMAND_SEARCH_QUERIES_V1.md](DEMAND_SEARCH_QUERIES_V1.md) |
| Conversion | [CONVERSION_LOOP_V1.md](CONVERSION_LOOP_V1.md) |
| Scale Gates | [SCALE_GATES_V1.md](SCALE_GATES_V1.md) |
| Supply Checklist | [SUPPLY_WAVE1_CHECKLIST_V1.md](SUPPLY_WAVE1_CHECKLIST_V1.md) |
| Scan-Script | [scripts/gtm/demand_scan_prepare.py](../../scripts/gtm/demand_scan_prepare.py) |
| Google Search Console | [GOOGLE-SEARCH-CONSOLE.md](../operations/GOOGLE-SEARCH-CONSOLE.md) |
| Lead-SOP | [SOP_KUNDENSUCHE…](../governance/02_sops/SOP_KUNDENSUCHE_LEAD_TO_CRM_OUTREACH_GATE_V3.md) |
| Angebots-SOP | [SOP_KI_BERATER…](../governance/02_sops/SOP_KI_BERATER_ANGEBOTSGENERATOR_RESEND_V3.md) |

## 3. Autonomie-Matrix

| Aktion | Autonomie | Gate |
|--------|-----------|------|
| Snippets, NAP, Channel-Register, Queries pflegen | Voll | Secret Scan |
| Verzeichnisse vorbereiten / Free-Formulare | Hoch | Owner-Credentials |
| Google Business / LinkedIn / Xing Verify | Blockiert | Owner physisch |
| GSC Domain-Ownership + Sitemap | **DONE** 2026-08-02 | TXT nie löschen — `docs/operations/GOOGLE-SEARCH-CONSOLE.md` |
| GSC Indexierung + E-Mail-Prefs | Blockiert | Owner ~5 Min (#243) |
| Demand-Scan → Score → CRM Pending JSON | Hoch | SOP Kundensuche |
| Outreach-Entwurf | Hoch | Legal/Policy Gate |
| E-Mail/DM senden | Niedrig | Explizite Freigabe |
| Massenmail / Scraping ohne Policy | Verboten | — |

Circuit Breaker vor kostenrelevanten LLM/API-Calls (`POST http://127.0.0.1:8912/check`).

## 4. Phasen (Betriebsstatus)

### Phase 0 — Foundations (Repo) — DONE in diesem Commit

- Preis-Audit: `COMPANY_KNOWLEDGE` und Website-Gesamtkonzept auf 449-€-Mathematik korrigiert
- Alle GTM-Artefakte unter `docs/gtm/` angelegt

### Phase 1 — Supply Wave 1

- Ziel: ≥15 Free-Listings mit konsistentem NAP
- Ablauf: [SUPPLY_WAVE1_CHECKLIST_V1.md](SUPPLY_WAVE1_CHECKLIST_V1.md)
- Evidence: `docs/gtm/evidence/supply-wave1/`
- Owner-Gates: Google Business, LinkedIn Company, Xing Verify
- SEO: GSC Ownership+Sitemap bestätigt; Index/Prefs — [GOOGLE-SEARCH-CONSOLE.md](../operations/GOOGLE-SEARCH-CONSOLE.md) · #243

### Phase 2 — Demand Engine

- Queries: [DEMAND_SEARCH_QUERIES_V1.md](DEMAND_SEARCH_QUERIES_V1.md)
- Script: `python3 scripts/gtm/demand_scan_prepare.py` erzeugt CRM-Pending-Entwürfe
- Kein Auto-Versand; Legal Gate bleibt Pflicht

### Phase 3 — Conversion Loop

- Siehe [CONVERSION_LOOP_V1.md](CONVERSION_LOOP_V1.md)
- Jeder qualifizierte Lead → Chat/Angebot → Follow-up → Brain-Learning

### Phase 4 — Scale Gates

- Siehe [SCALE_GATES_V1.md](SCALE_GATES_V1.md)
- Weitere Kanäle / öffentliche Vergabe / SaaS nur nach Evidence + Owner-Entscheidung

## 5. KPIs

| KPI | Ziel Wave 1 |
|-----|-------------|
| Live Free-Listings (NAP-konsistent) | ≥ 15 |
| Messbare Inbound-Pfade (UTM/GBP/LinkedIn) | ≥ 1 aktiv |
| Demand-Treffer → CRM Pending / Woche | Tracken |
| Gate-Freigaben → Angebote → Won | Tracken |
| Agent-Stunden / Won | Tracken (Free-CAC) |

## 6. Verbote

- Keine Paid Ads / Premium-Listings in diesem Plan
- Kein n8n
- Keine Handwerker-Portale als ICP-Kanal
- Kein Massenmail, kein ungeprüftes Scraping
- Keine abweichenden Tagessätze in öffentlichen Texten
- Kein Verkauf von Workstation/SaaS ohne separates Pricing-Mandat

## 7. Erfolgsdefinition

Operativ, wenn: (a) NAP+Preise konsistent, (b) ≥15 Free-Listings mit Evidence, (c) Demand-Scan erzeugt CRM-Pending, (d) Outreach nur nach Legal Gate, (e) mindestens ein messbarer Inbound-Pfad auf Website/Chat.
