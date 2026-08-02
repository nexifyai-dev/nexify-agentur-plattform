# FILE: docs/operations/GOOGLE-SEARCH-CONSOLE.md
# NIR: 02.08.2026 10:55
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps / GTM
# WHAT: SoT — Google Search Console Domain-Ownership + Sitemap für nexifyai.cloud
# WHY: Indexierung, Coverage, Money-Page-Indexing — Owner-Verify ist Human; DNS-Record bleibt permanent
# BEST-PRACTICE: Domain-Property via DNS TXT; Sitemap einmalig submitten; Coverage wöchentlich prüfen
# PITFALL: V-GSC-01: TXT entfernen = Ownership verloren; Token nicht in Code duplizieren (DNS reicht)
# DEPENDS: Cloudflare DNS Zone nexifyai.cloud; Live www.nexifyai.cloud
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md, docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
# SESSION: gsc-sitemap-submitted-7dd5

# Google Search Console — nexifyai.cloud

**Portal:** https://search.google.com/search-console  
**Property-Typ:** Domain (`nexifyai.cloud`) — deckt Apex, `www` und alle Subdomains ab.  
**Status (2026-08-02):**

| Schritt | Status | Datum |
|---------|--------|-------|
| Ownership (DNS Domain) | **DONE** | 2026-08-02 |
| Sitemap `https://www.nexifyai.cloud/sitemap.xml` submitted | **DONE** | 2026-08-02 |
| Coverage monitoring / Soft-404s | **next** (Human + Issue weekly check) | — |
| URL-Inspection Indexing (Money-Pages) | **next** (Human ~3 Min) | — |

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

## Next: Indexierung anfordern (Human ~3 Min — URL-Prüfung)

In GSC **URL-Prüfung** → „Indexierung beantragen“ für Money-Pages (nach Sitemap-Submit; Rate-Limit beachten):

| Priorität | URL |
|-----------|-----|
| P0 Home | `https://www.nexifyai.cloud/` |
| P0 Preise | `https://www.nexifyai.cloud/preise` |
| P0 Vergleich | `https://www.nexifyai.cloud/vergleich` |
| P0 Leistungen | `https://www.nexifyai.cloud/leistungen` |
| P1 Checkliste | `https://www.nexifyai.cloud/checkliste` |
| P1 Plattform | `https://www.nexifyai.cloud/plattform` |
| P1 Rückruf | `https://www.nexifyai.cloud/rueckruf` |
| P1 Kontakt | `https://www.nexifyai.cloud/kontakt` |
| P2 Wissen | `https://www.nexifyai.cloud/wissen` |
| P2 Artikel | `https://www.nexifyai.cloud/wissen/ai-automatisierung-kmu` |
| P2 Artikel | `https://www.nexifyai.cloud/wissen/was-kostet-web-app-2026` |

Optional (sobald live in Sitemap / Routes shipped): `/alternativen`, `/sprechstunde`, `/partner`, `/botschafter`, `/branchen`, `/leistungen/*`.

**3 empfohlene Human-Clicks zuerst:** Home → Preise → Vergleich (URL-Inspection).

## Empfohlene sekundäre Verify-Methoden (optional)

In GSC → **Einstellungen → Eigentumsbestätigung** zusätzlich aktivieren (Reihenfolge egal):

1. HTML-Tag (nur wenn Meta bewusst gewünscht — sonst weglassen)
2. Google Analytics (wenn GA4 Property verknüpft)
3. Google Tag Manager (wenn GTM-Container live)

Mind. **eine** Backup-Methode schützt vor versehentlichem TXT-Löschen.

## E-Mail-Einstellungen (Human ~30 s)

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
| Weekly Coverage Check | P2 Follow-up Issue (Coverage / Soft-404 / Indexing) |
| [`GTM_KOSTENFREI_GESAMTPLAN_V1.md`](../gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md) | SEO/GSC im kostenfreien GTM-Gesamtplan |
| [`ONGOING-GAP-AND-ACQUISITION-RADAR.md`](../gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md) | Gap A11 Status |
| [`SUPPLY_WAVE1_CHECKLIST_V1.md`](../gtm/SUPPLY_WAVE1_CHECKLIST_V1.md) | Supply Wave-1 (GBP parallel) |
| [`CHANNEL_REGISTER_V1.md`](../gtm/CHANNEL_REGISTER_V1.md) | Kanalregister |

## Agent-Checkliste (kein Login nötig)

```bash
dig +short TXT nexifyai.cloud @1.1.1.1 | grep google-site-verification
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://www.nexifyai.cloud/sitemap.xml
curl -sS https://www.nexifyai.cloud/robots.txt
curl -sS -A 'Googlebot' -o /dev/null -w "%{http_code}\n" https://www.nexifyai.cloud/
```
