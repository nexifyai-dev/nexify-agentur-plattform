# FILE: /docs/gtm/COMPETITOR-PLAYBOOK-COPY.md
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Konkurrenz-Taktiken (Struktur) → NeXify-Adaptation ohne Text/Assets zu klonen
# WHY: Lernen was im DACH-Markt konvertiert — legal umschreiben
# BEST-PRACTICE: Nur Patterns; Texte/Bilder/Marken eigen
# PITFALL: V-COMP-01: Keine Fake-Case-Zahlen; keine Trademark-Slogans
# DEPENDS: ICP-HIGH-DEMAND-2026.md
# DOCS-REF: apps/website/app/branchen/
# SESSION: icp-demand-competitor-copy-7dd5

# Competitor Playbook → NeXify Copy

Recherche: 2026-08-02.

## Untersuchte Anbieter

| Name | URL | Auffällig |
|------|-----|-----------|
| NPC Agency | https://npc-agency.com/ki-automatisierung-kmu/ | Pillar-Leitfaden, Branchen-Adoption, ab ~2.000 €, BAFA, Handwerk-Gap |
| Adfera | https://adfera.de/…/prozessautomatisierung/ | TL;DR-Landings, Preistabellen, End-to-End-Prozesse, Audit-CTA, FAQ |
| Collective Brain | https://collectivebrain.de/… | Tool-Vergleich SEO (n8n/Make/Zapier) |
| SMA-Agent | https://sma-agent.de/ | White-Label für Agenturen, Freigabe-Workflow |
| voice.ki / Voicery | https://voice.ki/anbieten/whitelabel-agentur | Agentur-Lizenzpreise, EU-Hosting |
| pixelegg.de | https://www.pixelegg.de/… | Lead-Magnet „KI-Check“, Premium-Service-Tabelle |
| Astro IT (Sortlist) | Sortlist NRW | Make/n8n/Zapier ab ~500 € |
| kiagentenberatung.de | Kosten-Artikel | Transparente PoC→Enterprise-Spannen |
| Agenturmatching.de | Verzeichnis | Boutique-Tagessätze 1.000–1.600 € → unser 449 €-Hebel |

## Taktiken → Adaptation

| Muster | NeXify | Status |
|--------|--------|--------|
| Branchen-SEO-Landings | `/branchen/[slug]` | dieses PR |
| Vergleichstabellen | `/vergleich` + Branchen-Block | vorhanden + erweitert |
| Lead-Magnet | `/checkliste` | vorhanden |
| Transparente Preise | 449 € SoT | `/preise`, Branchen |
| Audit/Erstgespräch-CTA | `/rueckruf` | vorhanden |
| White-Label/Partner | `/branchen/agenturen` | dieses PR |
| Förderhinweis ohne Garantie | Handwerk/Steuerberater | dieses PR |
| FAQ + JSON-LD | Branchen-Pages | dieses PR |
| End-to-End statt Stückwerk | Hooks Anfrage→… | dieses PR |
| Segmentierte Mails | `icp_mail_send.py` | dieses PR |

## Differenzierung
- „Chat it. Automate it.“ + GitHub/GitLab-Delivery
- Fester Tagessatz 449 € statt undurchsichtiger Boutique-Sätze
- Keine erfundenen Kunden-ROI-%
- n8n nicht als Produktversprechen (intern abgeschafft)
