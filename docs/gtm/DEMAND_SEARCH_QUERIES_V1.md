# FILE: /docs/gtm/DEMAND_SEARCH_QUERIES_V1.md
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 07:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Suchbegriffe und Filter für Demand-Kanäle je Leistung
# WHY: Wiederholbarer Scan ohne Ad-hoc-Recherche
# BEST-PRACTICE: KMU-Scope bevorzugen; ANÜ-Großkonzern-Staffing meiden
# PITFALL: V-GTM-05: Treffer ≠ Outreach; immer Legal Gate
# DEPENDS: CHANNEL_REGISTER_V1.md, SOP Kundensuche
# DOCS-REF: scripts/gtm/demand_scan_prepare.py
# SESSION: gtm-kostenfrei-angebote-c6e3

# Demand Search Queries V1

## Globale Filter (alle Plattformen)

**Einschließen:** Remote/Hybrid, Festpreis oder Tagessatz-kompatibel, Website/Shop/App/Automation/KI, KMU/Mittelstand, DACH/NL/EU.  
**Ausschließen:** Reine ANÜ/Bodyleasing ohne Delivery-Scope, rein preisgetriebene Dumping-Ausschreibungen, B2C-Hobbyprojekte, unklare „billig WordPress“-Anfragen ohne Entscheider.

**Leadscore (0–100, SOP-kompatibel):**

| Punkte | Kriterium |
|--------|-----------|
| +25 | Passende Leistung klar erkennbar |
| +20 | Budget/Tage oder Festpreisrahmen angedeutet |
| +15 | Entscheider / Firmenkontext öffentlich |
| +15 | DACH/NL / Remote möglich |
| +15 | Zeitnahe Deadline (< 60 Tage) |
| +10 | Kein Agentur-Zwischenhändler-Only |
| −30 | Reines Staffing/ANÜ ohne Produktlieferung |
| −40 | Explizit unter Marktniveau / nur Billigstbieter |

CRM Pending ab Score ≥ 50.

---

## D01 — freelance.de

| Leistung | Suchbegriffe / Kategorien |
|----------|---------------------------|
| Landingpage / Website | Webentwicklung, Webdesign, Next.js, React, Unternehmenswebsite, Landingpage |
| Onlineshop | E-Commerce, Shopware, Shopify, Onlineshop, Checkout |
| Enterprise-Commerce | PIM, ERP Integration, Produktsuche, großer Katalog |
| Web-App | Web App, Portal, Dashboard, Fullstack TypeScript |
| Mobile App | React Native, Flutter, iOS Android App MVP |
| Automatisierung | Prozessautomatisierung, Workflow, CRM Integration, RPA (mit Scope) |
| AI-Agenten | Künstliche Intelligenz, GenAI, RAG, Chatbot mit Freigaben, LLM Integration |

URL-Einstieg: `https://www.freelance.de/Webentwicklung-Projekte`, `https://www.freelance.de/Kuenstliche-Intelligenz-Projekte`

---

## D02 — freelancermap.de

Gleicher Keyword-Satz DE. Profil-Skills spiegeln: Next.js, React, TypeScript, E-Commerce, AI Agents, Automatisierung, B2B Web.

---

## D03 — service.bund.de

Keywords (Volltext / CPV-nah):

- Website, Webauftritt, Internetauftritt, Relaunch
- Onlineshop, E-Commerce-Plattform
- Webanwendung, Fachverfahren Frontend
- Mobile Applikation
- Prozessautomatisierung, Workflow-Management
- Künstliche Intelligenz, Chatbot, Sprachmodell (nur mit klarem Liefergegenstand)

Region-Fokus: NRW, bundesweit Remote-fähig, NL-grenznah optional.

**Regel:** Nur scoren und als Pending speichern — **keine** automatische Angebotsabgabe.

---

## D04 — TED (EU)

CPV-Hinweise (orientierend):

- 72000000 IT-Dienste
- 72400000 Internet-Dienste
- 72212220 Website-Entwicklung (bzw. aktuelle Äquivalente prüfen)
- 72212517 IT-Programmierdienste

Keywords EN/DE: website development, e-commerce platform, web application, AI assistant, process automation. Länderfilter: DE, NL, AT, BE, LU.

---

## D05–D07 — Communities (Watchlist)

Intent-Phrasen (manuell / Agent-Digest, kein Auto-Spam):

- „Website Agentur empfohlen“
- „Shop Relaunch gesucht“
- „Automatisierung CRM E-Mails“
- „KI Assistent intern mit Freigabe“
- „MVP Web-App Festpreis“
- NL: „website laten maken“, „webshop ontwikkelaar“, „AI automatisering mkb“

Antwortstil: erst helfen, dann soft CTA auf Profil/Website. Posts nur nach Freigabe.

---

## Signal-Suche (B4)

Öffentliche Signale für CRM Pending:

1. Stellenanzeige „Online-Shop Manager“ / „E-Commerce“ bei Firma ohne erkennbaren Shop
2. LinkedIn: „wir suchen Website / Agentur“
3. Neue Domain / Impressum ohne moderne Site (nur öffentlich, kein Dark Scraping)
4. „Website gesucht“ in Xing/Foren

Jeder Treffer → `scripts/gtm/demand_scan_prepare.py` oder manuelles JSON laut Script-Schema.
