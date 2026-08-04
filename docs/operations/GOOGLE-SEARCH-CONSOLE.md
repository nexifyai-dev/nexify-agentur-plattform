# FILE: docs/operations/GOOGLE-SEARCH-CONSOLE.md
# NIR: 02.08.2026 10:55
# UPDATED: 04.08.2026 09:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps / GTM
# WHAT: SoT — Google Search Console Owner-Fähigkeiten maxen (DONE vs TODO)
# WHY: Indexierung, Coverage, Rich Results, Bing/IndexNow — Owner bestätigt; Agents dokumentieren + Code; UI-Clicks bleiben Human
# BEST-PRACTICE: Domain-Property via DNS TXT; eine Sitemap; Money-Page URL-Inspection; wöchentliche Coverage
# PITFALL: V-GSC-01: TXT entfernen = Ownership verloren; Soft-404s nicht in Sitemap; keine Secrets in Git
# DEPENDS: Cloudflare DNS Zone nexifyai.cloud; Live www.nexifyai.cloud; Owner-Login GSC
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md, scripts/gtm/gsc-url-inspection-batch.md
# SESSION: gsc-max-owner-capabilities-7dd5

# Google Search Console — nexifyai.cloud (max free Owner capabilities)

**Portal:** https://search.google.com/search-console  
**Property-Typ:** Domain (`nexifyai.cloud`) — Apex, `www`, Subdomains.  
**Verified Owner (Human):** Pascal Courbois — `nexify.login@gmail.com` (Kontakt für GSC; **kein Secret**).  
**Live:** https://www.nexifyai.cloud

---

## Capability checklist — DONE vs TODO

| # | Fähigkeit | Status | Wer | Hinweis |
|---|-----------|--------|-----|---------|
| 1 | Domain-Ownership (DNS TXT) | **DONE** | Human 2026-08-02 | TXT **nie löschen** |
| 2 | Sitemap submit `…/sitemap.xml` | **DONE** | Human 2026-08-02 | #238 closed |
| 3 | Owner bestätigt „volle Möglichkeiten“ | **DONE** | Pascal | dieses Playbook |
| 4 | robots.txt Allow + Sitemap + Googlebot | **DONE** (Repo) | Agent | `apps/website/app/robots.ts` |
| 5 | Sitemap Money-Pages (existierende Routen) | **DONE** (Repo) | Agent | inkl. 15× `/leistungen/*` + `/branchen/*` (#252 merged) |
| 6 | `llms.txt` (+ `.well-known`) | **DONE** (Repo) | Agent | Spec: H1 + Links |
| 7 | Soft-404 `[locale]` catch-all | **DONE** (Repo) | Agent | `dynamicParams = false` |
| 8 | IndexNow key file (Bing/Yandex free) | **DONE** (Repo) | Agent | Key public; Bing UI einmalig |
| 9 | Structured-Data Seite→Test-Liste | **DONE** (Docs) | Agent | Abschnitt unten |
| 10 | URL-Inspection Batch (Top 20) | **TODO** | Human | `scripts/gtm/gsc-url-inspection-batch.md` |
| 11 | E-Mail-Notifications alle Issue-Typen | **TODO** | Human | GSC Einstellungen |
| 12 | Secondary owner / Backup-Verify | **TODO** | Human | optional GA/GTM/HTML |
| 13 | International targeting DE | **TODO** | Human | Domain-Property: UI prüfen |
| 14 | Performance-Report Cadence | **DONE** (Docs #245) | Human | wöchentlich — SoT „Performance / Coverage Cadence" unten |
| 15 | Core Web Vitals Report | **TODO** | Human | nach PSI-Fixes |
| 16 | Links-Report Awareness | **TODO** | Human | einmalig + monatlich |
| 17 | Experience / HTTPS | **TODO** | Human | GSC Experience prüfen |
| 18 | Removals / Crawl-Stats Awareness | **TODO** | Human | nur bei Bedarf Removals |
| 19 | Bing Webmaster (DNS/gleiche Verify) | **TODO** | Human | siehe Bing-Abschnitt |
| 20 | GBP ↔ Website Cross-Link | **TODO** | Human | #237 |
| 21 | Search Console API (list/submit) | **BLOCKED** | Pascal OAuth | keine Creds auf VPS |

---

## Verification (SoT = DNS)

| Feld | Wert |
|------|------|
| Methode | DNS TXT am **Apex** `nexifyai.cloud` |
| Proxy | **DNS only** (grau) |
| Record | `google-site-verification=CUuPNu4YG11dub8jLYqsigXpbDihohp1uByCF7yGupo` |
| Provider | Cloudflare → Zone `nexifyai.cloud` → DNS |
| Owner-Contact | `nexify.login@gmail.com` |

### HARD RULE — TXT niemals löschen

Ownership hängt an diesem TXT. Nicht entfernen / rotieren ohne vorher Backup-Verify in GSC.

### Warum kein Meta-Tag im Website-Code

Domain-Property + DNS deckt Apex + `www`. HTML-Meta würde Token duplizieren. Optional Backup: GA / GTM / HTML-Tag in GSC UI.

---

## Sitemaps

| URL | Status |
|-----|--------|
| `https://www.nexifyai.cloud/sitemap.xml` | **submitted** 2026-08-02 |
| `/de/sitemap.xml`, `/nl/sitemap.xml` | **nicht** einreichen (404) |
| `sitemap-0.xml` | HTML — **nicht** einreichen |

Nach Deploy mit erweiterter Sitemap: in GSC „Sitemap erneut abrufen“ oder warten (periodisch).

**In Sitemap (main, nach #252):** Hub `/leistungen`, **15×** `/leistungen/{slug}`, Hub `/branchen` + Branchen-Slugs, `/audit`, plus Money-Pages (`/partner`, `/botschafter`, `/sprechstunde`, `/alternativen`, …).

**Noch nicht in Sitemap (fehlen page.tsx / Soft-404):** `/ki-agentur`, `/vergleich/chatgpt`, `/vergleich/freelance` — nach Live-200 nachziehen.

---

## URL-Inspection (Human) — #243

Geordnete Top-20 + Copy-Paste: [`scripts/gtm/gsc-url-inspection-batch.md`](../../scripts/gtm/gsc-url-inspection-batch.md)

Kurz: GSC → **URL-Prüfung** → URL einfügen → **Indexierung beantragen** (Rate-Limit beachten).

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

**Quelle der 15× `/leistungen/[slug]` + Branchen:** PR #252 / `docs/gtm/PAGE1-KEYWORD-MAP.md` (live prüfen).

**Empfohlene Reihenfolge:** Home → Preise → Vergleich → Leistungen-Hub → die 15 Leistungs-Landings in Batches (GSC Rate-Limit) → Branchen/CTAs.

---

## Performance / Coverage Cadence — #245

**Wöchentlich (≈10 Min, Owner `nexify.login@gmail.com`):**

1. Indexierung → Seiten: Errors / Soft-404 / Redirects
2. Sitemaps: discovered vs. indexed (Sitemap-Status)
3. Leistung (Performance): Top Queries / Pages / CTR — Filter Land = Deutschland
4. Soft-404s gegen Live-URLs / SEO-PRs abgleichen
5. Bei Bedarf Money-Pages nach-inspizieren → `scripts/gtm/gsc-url-inspection-batch.md`

**Monatlich:** Links-Report, Experience/HTTPS, Core Web Vitals (nach PSI).

**Hinweis:** Nach Deploy mit erweiterter Sitemap (PR #259) Coverage-Check wiederholen.

---

## Core Web Vitals / Experience

- GSC → **Experience** → Core Web Vitals (URL-Gruppen)  
- PSI: https://pagespeed.web.dev/analysis?url=https://www.nexifyai.cloud/  
- Repo-PSI-Fixes: Branch/PR Pagespeed (`llms.txt`/CLS/LCP) — nach Merge CWV erneut in GSC prüfen  

---

## International targeting (DE)

Domain-Property hat kein klassisches „Land targeting“ wie URL-Prefix-Properties. Praktisch:

- Unprefixed DE-Default (`LOCALE-DE-STANDARD`)  
- hreflang / canonical auf www  
- In GSC Performance-Filter: Land = Deutschland prüfen  

---

## E-Mail-Notifications (Human)

GSC → Einstellungen → **E-Mail-Einstellungen** (Owner `nexify.login@gmail.com`):

- [ ] Alle wichtigen Issue-Typen (Coverage, Security, Manual Actions, CWV, …)  
- [ ] Empfänger = Owner-Inbox (nicht nur Alias ohne Postfach)  

---

## Secondary owners / Verify

Einstellungen → Nutzer und Berechtigungen / Eigentumsbestätigung:

1. Optional: zweite Person als Owner/Full  
2. Backup-Verify: GA4 / GTM / HTML-Tag (DNS bleibt SoT)  

---

## Bing Webmaster + IndexNow (kostenlos)

### Bing Webmaster Tools

1. https://www.bing.com/webmasters → Site hinzufügen `https://www.nexifyai.cloud`  
2. Verify: **DNS CNAME/TXT** oder „Import from Google Search Console“ (gleiche Google-Owner-Session)  
3. Sitemap: `https://www.nexifyai.cloud/sitemap.xml`  

### IndexNow (Repo bereit)

- Public key file: `https://www.nexifyai.cloud/a56f374489e943c9a2b9066f5d1fca66.txt`  
- Key = Basename der `.txt`-Datei unter `apps/website/public/` (öffentlich by design / IndexNow, kein Secret)  
- Nach Deploy: in Bing Webmaster IndexNow aktivieren / API ping optional  
- Kein neues Paid-SaaS  

---

## Search Console API (OAuth — Pascal, einmalig)

**Stand 2026-08-02:** Keine GSC OAuth-Creds unter `/etc/nexifyai/` / gcloud auf dem VPS. Agenten können Sitemap **nicht** via API listen/submitten.

**Einmalig (Pascal):**

1. Google Cloud Console → Projekt (oder neu) → Enable **Search Console API**  
2. OAuth Client (Desktop oder Web) — Client-ID/Secret nur in Secret-Store (`/etc/nexifyai/…`), **nie Git**  
3. Scope: `https://www.googleapis.com/auth/webmasters` (readonly reicht für Reports; write für Sitemap submit)  
4. Token lokal speichern; Agent-Skript später: `sitemaps.list` / `sitemaps.submit`  

Bis dahin: Human UI für Inspection + Prefs.

---

## Structured data — Rich Results Test (Seitenliste)

Tool: https://search.google.com/test/rich-results  

| URL | Erwartete Typen |
|-----|-----------------|
| `/` | ProfessionalService / LocalBusiness |
| `/leistungen` | BreadcrumbList + OfferCatalog (Service/Offer) |
| `/preise` | BreadcrumbList |
| `/faq` | FAQPage + BreadcrumbList |
| `/wissen/{slug}` | Article + BreadcrumbList |
| `/venlo` | LocalBusiness / Place (wenn vorhanden) |
| Legal (`/impressum`, …) | WebPage + BreadcrumbList |
| `/prozess`, `/vergleich`, `/referenzen`, … | BreadcrumbList |

Nach großen Schema-PRs: Home + Leistungen + FAQ + 1 Wissen-Artikel testen.

---

## Google Business Profile (#237)

Cross-Link: GBP Website-URL = `https://www.nexifyai.cloud/?utm_source=google&utm_medium=organic&utm_campaign=gbp` (NAP exakt aus `docs/gtm/NAP_MASTER_V1.md`). Verifizieren + Posts: Issue #237 / `docs/gtm/GBP-OPS-CHECKLIST.md`.

---

## Removals / Crawl stats

- **Removals:** nur bei echten Leak-/Rechts-URLs — nicht für Soft-404-Kosmetik  
- **Crawl-Statistiken:** bei Indexierungs-Drops prüfen (Host-Last, 5xx)  

---

## Verwandte Issues

| Issue | Rolle |
|-------|--------|
| #238 | Sitemap submitted — **CLOSED** |
| #243 | URL-Inspection + E-Mail-Prefs — Human clicks |
| #245 | Weekly coverage — recurring |
| #210 | WhatsApp bleibt offen; GSC DONE |
| #237 | GBP verify + posts |
| #249 | Docs Ownership PR (parallel) |

---

## Agent-Checkliste (kein Login)

```bash
dig +short TXT nexifyai.cloud @1.1.1.1 | grep google-site-verification
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://www.nexifyai.cloud/sitemap.xml
curl -sS https://www.nexifyai.cloud/robots.txt
curl -sS -A 'Googlebot' -o /dev/null -w "%{http_code}\n" https://www.nexifyai.cloud/
curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" https://www.nexifyai.cloud/llms.txt
curl -sS https://www.nexifyai.cloud/a56f374489e943c9a2b9066f5d1fca66.txt
# Soft-404 smoke (sollte 404 sein nach Deploy, nicht 200+Homepage):
curl -sS -o /dev/null -w "%{http_code}\n" https://www.nexifyai.cloud/branchen
```
