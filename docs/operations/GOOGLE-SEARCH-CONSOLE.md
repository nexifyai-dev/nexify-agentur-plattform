# FILE: docs/operations/GOOGLE-SEARCH-CONSOLE.md
# NIR: 02.08.2026 10:55
# UPDATED: 03.08.2026 06:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps / GTM
# WHAT: SoT — Google Search Console Domain-Ownership + Sitemap für nexifyai.cloud
# WHY: Indexierung, Coverage, Money-Page-Indexing — Owner-Verify ist Human; DNS-Record bleibt permanent
# BEST-PRACTICE: Domain-Property via DNS TXT; Sitemap einmalig submitten; Coverage wöchentlich prüfen
# PITFALL: V-GSC-01: TXT entfernen = Ownership verloren; Token nicht in Code duplizieren (DNS reicht)
# DEPENDS: Cloudflare DNS Zone nexifyai.cloud; Live www.nexifyai.cloud
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md, docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
# SESSION: gsc-ownership-confirmed-7dd5 + gsc-sitemap-submitted-7dd5

# Google Search Console — nexifyai.cloud

**Portal:** https://search.google.com/search-console  
**Property-Typ:** Domain (`nexifyai.cloud`) — deckt Apex, `www` und alle Subdomains ab.  
**Status (2026-08-02):**

| Schritt | Status | Datum |
|---------|--------|-------|
| Ownership (DNS Domain) | **DONE** | 2026-08-02 |
| Sitemap `https://www.nexifyai.cloud/sitemap.xml` submitted | **DONE** (#238) | 2026-08-02 |
| Coverage monitoring / Soft-404s | **next** (Human + weekly #245) | — |
| URL-Inspection Indexing (Money-Pages) | **next** (#243) | — |
| E-Mail-Prefs | **next** (#243) | — |

## Verification (SoT = DNS, nicht HTML-Meta)

| Feld | Wert |
|------|------|
| Methode | DNS TXT am **Apex** `nexifyai.cloud` |
| Proxy | **DNS only** (grau / nicht proxied) |
| Record | `google-site-verification=CUuPNu4YG11dub8jLYqsigXpbDihohp1uByCF7yGupo` |
| Provider | Cloudflare → Zone `nexifyai.cloud` → DNS |

### HARD RULE — TXT niemals löschen

Google bestätigt Ownership über diesen TXT-Record. **Nicht entfernen**, nicht rotieren ohne vorher neue Verify-Methode in GSC zu aktivieren. Andere Apex-TXT (SPF, Microsoft `MS=…`) sind unabhängig — nur den `google-site-verification=…`-Eintrag schützen.

### Warum kein Meta-Tag im Website-Code

- Domain-Property + DNS reicht für Apex **und** `www` / Subdomains.
- HTML-Meta würde denselben Token in `apps/website` duplizieren (Drift-Risiko).
- Optional (Redundanz): in GSC unter **Einstellungen → Ownership verification** eine zweite Methode aktivieren — HTML-Tag, Google Analytics oder Google Tag Manager — **nur wenn gewünscht**; Repo bleibt DNS-SoT.

Live-Check (Agent, 2026-08-02):

```text
dig +short TXT nexifyai.cloud @1.1.1.1
→ enthält google-site-verification=CUuPNu4YG11dub8jLYqsigXpbDihohp1uByCF7yGupo

curl -sS https://www.nexifyai.cloud/ | kein google-site-verification Meta (erwartbar)
```

## Sitemaps — submitted 2026-08-02

Human-Confirm: Sitemap in GSC für Property `nexifyai.cloud` / `www.nexifyai.cloud` eingereicht. Google verarbeitet periodisch.

| URL | Status |
|-----|--------|
| `https://www.nexifyai.cloud/sitemap.xml` | **submitted** 2026-08-02 — HTTP 200, `application/xml` |
| Locale-Pfade `/de/sitemap.xml`, `/nl/sitemap.xml` | **nicht** vorhanden (404) — DE ist unprefixed Default; nicht einreichen |
| `https://www.nexifyai.cloud/sitemap-0.xml` | HTML (kein Sitemap) — **nicht** einreichen |

`robots.txt` verweist bereits auf die Primär-Sitemap:

```text
Sitemap: https://www.nexifyai.cloud/sitemap.xml
```

Wiederholen nur bei neuer Sitemap-URL oder Property-Wechsel — nicht bei jedem Deploy nötig.

## Next: Coverage + Soft-404s (Human / weekly)

1. GSC → **Indexierung → Seiten** (Coverage): Errors / Soft-404 / Redirects prüfen.
2. Soft-404s gegen Live-URLs und PR #222 / Issue soft-404 koordinieren.
3. Sitemap-Status in GSC: „Erfolgreich“ / discovered URLs vs. indexed.

## Next: Indexierung anfordern (Human ~3 Min — URL-Prüfung) — #243

In GSC **URL-Prüfung** → „Indexierung beantragen“ für Money-Pages (nach Sitemap-Submit; Rate-Limit beachten):

| Priorität | URL |
|-----------|-----|
| P0 Home | `https://www.nexifyai.cloud/` |
| P0 Preise | `https://www.nexifyai.cloud/preise` |
| P0 Vergleich | `https://www.nexifyai.cloud/vergleich` |
| P0 Leistungen Hub | `https://www.nexifyai.cloud/leistungen` |
| P0 Landingpages | `https://www.nexifyai.cloud/leistungen/landingpages` |
| P0 Websites | `https://www.nexifyai.cloud/leistungen/websites` |
| P0 Onlineshops | `https://www.nexifyai.cloud/leistungen/onlineshops` |
| P0 Enterprise-Commerce | `https://www.nexifyai.cloud/leistungen/enterprise-commerce` |
| P0 Web-Apps | `https://www.nexifyai.cloud/leistungen/web-apps` |
| P0 Mobile Apps | `https://www.nexifyai.cloud/leistungen/mobile-apps` |
| P0 Automatisierung | `https://www.nexifyai.cloud/leistungen/automatisierung` |
| P0 AI-Agenten | `https://www.nexifyai.cloud/leistungen/ai-agenten` |
| P0 KI-Begleiter | `https://www.nexifyai.cloud/leistungen/ki-begleiter` |
| P0 Kundenportal | `https://www.nexifyai.cloud/leistungen/kundenportal` |
| P0 KI-Plattform | `https://www.nexifyai.cloud/leistungen/ki-plattform` |
| P0 KI-Beratung | `https://www.nexifyai.cloud/leistungen/beratung` |
| P0 Workshops | `https://www.nexifyai.cloud/leistungen/workshops` |
| P0 White-Label | `https://www.nexifyai.cloud/leistungen/white-label` |
| P0 KI-/Prozess-Audit | `https://www.nexifyai.cloud/leistungen/audit` |
| P0 Audit (Alias) | `https://www.nexifyai.cloud/audit` |
| P1 Branchen Hub | `https://www.nexifyai.cloud/branchen` |
| P1 Handwerk | `https://www.nexifyai.cloud/branchen/handwerk` |
| P1 Steuerberater | `https://www.nexifyai.cloud/branchen/steuerberater` |
| P1 E-Commerce | `https://www.nexifyai.cloud/branchen/ecommerce` |
| P1 Immobilien | `https://www.nexifyai.cloud/branchen/immobilien` |
| P1 Agenturen | `https://www.nexifyai.cloud/branchen/agenturen` |
| P1 Checkliste | `https://www.nexifyai.cloud/checkliste` |
| P1 Plattform | `https://www.nexifyai.cloud/plattform` |
| P1 Rückruf | `https://www.nexifyai.cloud/rueckruf` |
| P1 Kontakt | `https://www.nexifyai.cloud/kontakt` |
| P2 Wissen | `https://www.nexifyai.cloud/wissen` |
| P2 Artikel | `https://www.nexifyai.cloud/wissen/ai-automatisierung-kmu` |
| P2 Artikel | `https://www.nexifyai.cloud/wissen/was-kostet-web-app-2026` |

Optional (sobald live in Sitemap / Routes shipped): `/alternativen`, `/sprechstunde`, `/partner`, `/botschafter`, `/branchen`, `/leistungen/*`.

**Quelle der 15× `/leistungen/[slug]` + Branchen:** PR #252 / `docs/gtm/PAGE1-KEYWORD-MAP.md` (nach Deploy live prüfen).

**3 empfohlene Human-Clicks zuerst:** Home → Preise → Vergleich (URL-Inspection); danach die 15 Leistungs-Landings in Batches (GSC Rate-Limit).

## Empfohlene sekundäre Verify-Methoden (optional)

In GSC → **Einstellungen → Eigentumsbestätigung** zusätzlich aktivieren (Reihenfolge egal):

1. HTML-Tag (nur wenn Meta bewusst gewünscht — sonst weglassen)
2. Google Analytics (wenn GA4 Property verknüpft)
3. Google Tag Manager (wenn GTM-Container live)

Mind. **eine** Backup-Methode schützt vor versehentlichem TXT-Löschen.

## E-Mail-Einstellungen (Human ~30 s) — #243

GSC → **Einstellungen → Nutzer und Berechtigungen / E-Mail-Einstellungen**:

- [ ] Wichtige Mitteilungen (Coverage, Security, Manual Actions) aktiv
- [ ] Empfänger = Owner-Mailbox (nicht nur Alias ohne Inbox)

## robots.txt / Crawler (verifiziert 2026-08-02)

```text
User-Agent: *
Allow: /
Disallow: /admin /konto /login /registrieren /api/
Host: www.nexifyai.cloud
Sitemap: https://www.nexifyai.cloud/sitemap.xml
```

- Googlebot Homepage: HTTP 200  
- Kein globales `Disallow: /` — Indexierung erlaubt  
- Private Bereiche (`/admin`, Auth, `/api/`) korrekt gesperrt

## Verwandte Issues / Playbooks

| Artefakt | Rolle |
|----------|--------|
| Issue #238 | GSC Property + Sitemap — **CLOSED** (submitted 2026-08-02) |
| Issue #210 | GSC+WhatsApp — **GSC DONE**; WhatsApp-Profil bleibt Human |
| Issue [#243](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/243) | Indexierung Money-Pages + E-Mail-Prefs (+ Coverage) |
| Issue #245 | P2 — GSC coverage weekly check (Coverage / Soft-404 / Indexing) |
| [`GTM_KOSTENFREI_GESAMTPLAN_V1.md`](../gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md) | SEO/GSC im kostenfreien GTM-Gesamtplan |
| [`ONGOING-GAP-AND-ACQUISITION-RADAR.md`](../gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md) | Gap A11 Status |
| [`SUPPLY_WAVE1_CHECKLIST_V1.md`](../gtm/SUPPLY_WAVE1_CHECKLIST_V1.md) | Supply Wave-1 (GBP parallel) |
| [`CHANNEL_REGISTER_V1.md`](../gtm/CHANNEL_REGISTER_V1.md) | Kanalregister S00 |

## Agent-Checkliste (kein Login nötig)

```bash
dig +short TXT nexifyai.cloud @1.1.1.1 | grep google-site-verification
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://www.nexifyai.cloud/sitemap.xml
curl -sS https://www.nexifyai.cloud/robots.txt
curl -sS -A 'Googlebot' -o /dev/null -w "%{http_code}\n" https://www.nexifyai.cloud/
```
