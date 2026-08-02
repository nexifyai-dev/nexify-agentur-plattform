# FILE: /docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
<<<<<<< HEAD
# NIR: 02.08.2026 10:10
# UPDATED: 02.08.2026 10:40
=======
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 10:45
>>>>>>> 7fb8a8cd (fix(website): soft-404, security.txt, /danke + gap radar)
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Living checklist — acquisition, conversion, ops gaps for Cursor agents
# WHY: Permanent proactivity; never wait for user to ask for gap scans
# BEST-PRACTICE: Update this file when finding/fixing gaps; open Issues for larger items
# PITFALL: V-GTM-RADAR-01: Do not duplicate open PRs (blog, free GTM, outreach, Revolut, Gesamtkonzept)
<<<<<<< HEAD
# DEPENDS: .cursor/rules/60-proactive-acquisition-gaps.mdc, FREE-ACQUISITION-PLAYBOOK (PR #175)
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# SESSION: proactive-gaps-acquisition-7dd5
=======
# DEPENDS: .cursor/rules/60-proactive-acquisition-gaps.mdc
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# SESSION: unconsidered-gaps-scan-7dd5
>>>>>>> 7fb8a8cd (fix(website): soft-404, security.txt, /danke + gap radar)

# Ongoing Gap & Acquisition Radar

**Rule:** `.cursor/rules/60-proactive-acquisition-gaps.mdc` (alwaysApply)  
<<<<<<< HEAD
**Agents:** Nach jedem Task dieses Dokument pflegen (Checkboxen / „Neu“-Zeilen).  
=======
**Agents:** Nach jedem Task dieses Dokument pflegen.  
>>>>>>> 7fb8a8cd (fix(website): soft-404, security.txt, /danke + gap radar)
**HARD:** Keine Fake-Reviews · kein Hermes-Cutover · keine Secrets · kein Paid-Ads-Spend.

## Koordination (nicht duplizieren)

| Track | PR / Artefakt | Status |
|-------|---------------|--------|
<<<<<<< HEAD
| Free GTM Playbook | #175 `cursor/free-acquisition-dach-7dd5` | open |
| Blog DACH SEO | #190 `cursor/website-blog-dach-gtm-7dd5` | open |
| Outreach drip | #173 `cursor/lead-outreach-automation-7dd5` | open |
| Revolut payments | #205 `cursor/revolut-replace-stripe-7dd5` | open |
| FAQ expand | #199 | open |
| Continuous learning | #203 | open |
| Website Gesamtkonzept | Agent `5ccd455e` | coordinate |
| Legal data human | #201 | human-gate |
| Actions secrets/runner | #123 | human-gate P0 |

---

## A. Acquisition (kostenfrei / günstig) — DACH 2026

Beyond Blog / FAQ / Verzeichnisse / Outreach / GBP (bereits in Playbook #175):

| ID | Hebel | Status | Notes |
|----|-------|--------|-------|
| A01 | Partner / White-Label / Cross-Referral (Buchhalter, SEOs, Freelancer) | **done** | #206 → `PARTNER-WHITELABEL-INTRO-PLAYBOOK_V1.md` |
| A02 | Gastbeiträge (DE B2B Tech/KMU Magazin) | **done** | #207 → Pitch-Kit DE |
| A03 | Podcast-Gast Pitches (DACH KI/Gründer) | **done** | #207 → Pitch-Kit + evidence folder |
| A04 | Vergleichsseiten SEO (`/vergleich`, ChatGPT vs Agentur) | **shipped** | `/vergleich` in diesem PR |
| A05 | Lead-Magnet (PDF-Checkliste, light gate) | **shipped** | `/checkliste` + PDF + thank-you (#212) |
| A06 | WhatsApp Business Link (kein broken Cron) | **shipped** | Footer `wa.me` auf Firmennummer |
| A07 | Booking härter surface (`/rueckruf`) | **shipped** | Header + Sticky CTA |
| A08 | Retargeting nur organisch (kein Ad-Spend) | open | LinkedIn organic + remarketing-free only |
| A09 | Exit-Intent / Sticky CTA Verbesserungen | **shipped** | Sticky + Exit-Intent Modal (#208) |
| A10 | Trust: Testimonials/Logos/SLA | pipeline | #211 Permission-Pipeline; Widget erst nach ≥1 Erlaubnis |
| A11 | GSC Verification Meta/Property | open | Human — Search Console Verify |
| A12 | Comparison: „KI Agentur vs Freelance“ Subpages | open | Follow-up Content nach `/vergleich` |

---

## B. Conversion / Website

| ID | Gap | Status |
|----|-----|--------|
| C01 | Dual-CTA: Termin + Projekt | **shipped** header/sticky |
| C02 | `/konto` Status/Rechnung Transparenz | **minimal shipped** Status-Hinweis; Revolut #205 für Invoices |
| C03 | Chat → `/rueckruf` already | ok |
| C04 | Soft-404 / OG (SEO PRs) | coordinate #160 |
| C05 | Lead-Magnet Download-Asset (echtes PDF) | **shipped** | `/docs/nexify-website-ki-checkliste.pdf` |

---

## C. Stack / Ops (Smoke 2026-08-02)

| Service | Signal | Gap |
|---------|--------|-----|
| www.nexifyai.cloud | 308→ok | — |
| api.nexifyai.cloud `/api/health` | 200 | — |
| OpenMCP public DNS | NXDOMAIN | Decision: keep internal / docs-first (#209) |
| Spaether public DNS | NXDOMAIN | Decision: deprecate public until use-case (#209) |
| Paperclip :3100 | intentional down | KEEP Factory SoT; no auto-revive (#209) |
| Grafana/Prometheus/OpenDesign | RUNTIME-DOWN (bootstrap WARN) | Ops — CF-Tunnel |
| Google Search Console | unverifiziert? | Human Issue |
| #123 secrets+runner | open P0 human-gate | wait |
| #201 legal Stammdaten | open human-gate | wait |

---

## D. Neu gefunden (diese Session) — Issues

Agents: neue Zeilen hier + Issue-Nummer nach `gh issue create`.

| Datum | Gap | Issue | Priority |
|-------|-----|-------|----------|
| 2026-08-02 | Partner/White-Label Intro-Playbook (kein Paid SaaS) | #206 | **closing** |
| 2026-08-02 | Podcast + Gastbeitrag Pitch-Kit DE | #207 | **closing** |
| 2026-08-02 | Exit-Intent Modal (zero cost, DE) | #208 | **closing** |
| 2026-08-02 | OpenMCP/Spaether/Paperclip utilization decision | #209 | **closing** |
| 2026-08-02 | GSC verify + WhatsApp Business Profile (Human) | #210 | P1 |
| 2026-08-02 | Echte Testimonial-Pipeline (Permission-first) | #211 | **closing** (pipeline) |
| 2026-08-02 | Lead-Magnet PDF Asset + Thank-you mail | #212 | **closing** |

---

## Session-Learn Reminder

Nach Continuous-Learning (#203) / `scripts/learning/session-learn.sh`:
=======
| Free GTM Playbook | #175 | open |
| Blog DACH SEO | #190 | open |
| Outreach drip | #173 | open |
| Revolut payments | #205 | open |
| FAQ expand | #199 | open |
| Continuous learning | #203 | open |
| Legal pages | #202 | open |
| Website Gesamtkonzept / Portal | #214 | open |
| Acquisition radar + vergleich/checkliste | #213 | open |
| Soft-404 + security.txt + /danke | PR unconsidered-gaps-scan | shipping |
| Legal data human | #201 | human-gate |
| Actions secrets/runner | #123 | human-gate P0 |
| GTM backlog | #206–#212 | open — **nicht neu öffnen** |

## Bereits abgedeckt (nicht als „neu“ wiederholen)

#213/#214 · #205 Revolut · #199 FAQ · #202 Legal · #203 Learning · #200 Locale · #204 Throttle · Hermes BLEIBEN (#141) · #123 · #201 · #210 GSC/WhatsApp · #206–#212 · kein Stripe/n8n/Nous-awesome-hermes/Codex/Hermes-Cutover.

Live OK (2026-08-02): www 200 · api/health 200 · SPF+DKIM+DMARC · AVV/KI-Hinweise · Cookie-Banner · OG `/og-image.png` · hreflang unprefixed · Follow-up-Worker im Backend.

## Net-new Inventory (Session unconsidered-gaps-scan)

### Acquisition / Conversion
| ID | Gap | Priority |
|----|-----|----------|
| A13 | LinkedIn Organic Playbook | P1 |
| A14 | IHK / Kammern / lokale DACH-Netzwerke | P1 |
| A15 | Referral-Programm (Warm Intro) | P1 |
| A16 | Vergleich ChatGPT / Make / Zapier | P1 |
| A17 | Pricing-Objection Landing | P1 |
| A18 | Webinar / Demo-Recording evergreen | P2 |
| A19 | Domain Brand Protection Watch | P2 |

### Product / Website
| ID | Gap | Priority |
|----|-----|----------|
| P01 | Soft-404 `/[locale]` | **fixed in PR** |
| P02 | `/.well-known/security.txt` | **fixed in PR** |
| P03 | Thank-you `/danke` | **fixed in PR** |
| P04 | Alias-Redirects hilfe/docs/cookies/ki/dpa | **fixed in PR** |
| P05 | Status-Page + status.nexifyai.cloud DNS | P1 |
| P06 | Security Trust Page | P1 |
| P07 | Barrierefreiheitserklärung (BFSG) | P1 |
| P08 | Changelog / Public Roadmap | P2 |
| P09 | Jobs / Karriere | P2 |
| P10 | Partner-/Empfehlungsseite | P1 (mit A15) |
| P11 | SLA / Uptime Promise Page | P1 |
| P12 | AVV Download-PDF | P2 |
| P13 | Public API Docs Page | P2 |
| P14 | Kunden Knowledge-Base | P2 (#214) |
| P15 | Abandoned Booking Recovery | P1 |
| P16 | Per-Page OG / CWV Monitoring | P2 |
| P17 | NL Deep-Quality Audit | P2 |

### Ops / CI
| ID | Gap | Priority |
|----|-----|----------|
| O01 | CODEOWNERS fehlt | P1 |
| O02 | Branch Protection main fehlt (API 404) | P1 human |
| O03 | Sentry / Error-Monitoring fehlt | P1 |
| O04 | Incident + Backup/Restore Runbook | P2 |
| O05 | Dependabot backlog + Draft #197 | P2 |
| O06 | Grafana/Prometheus/OpenDesign RUNTIME-DOWN | P2 |
| O08 | Booking slots live 500 (DB) | P1 |
| O09 | Circuit Breaker nicht in PR-CI | P2 |
| O10 | DMARC rua → privates Gmail | P2 human |

### Stack / Sales / Legal delta
| ID | Gap | Priority |
|----|-----|----------|
| S05 | WhatsApp inbound Webhook ungenutzt (wa.me ok) | P2 |
| S07 | Booking Calendar Capacity Prozess | P1 (O08) |
| L02 | Berufshaftpflicht Trust-Hinweis | P2 |
| D03 | Lead-SLA Messung (1 Werktag Promise) | P1 |

## Issues (Session unconsidered-gaps-scan)

| Datum | Gap | Issue | Priority |
|-------|-----|-------|----------|
| 2026-08-02 | Soft-404 + security.txt + /danke | (dieser PR) | P1 shipped |
| 2026-08-02 | Trust-Seiten Status/Security/A11y/SLA | #217 | P1 |
| 2026-08-02 | Referral + LinkedIn + IHK | #219 | P1 |
| 2026-08-02 | ChatGPT/Make/Zapier + Pricing Objections | #221 | P1 |
| 2026-08-02 | CODEOWNERS + Branch Protection + Sentry | #224 | P1 |
| 2026-08-02 | Booking slots/capacity + abandoned recovery | #226 | P1 |
| 2026-08-02 | Incident/Backup Runbook + DMARC rua | #228 | P2 human |
| 2026-08-02 | Jobs/Karriere + Public API Docs | #230 | P2 |
| 2026-08-02 | Lead-SLA Messung (1 Werktag) | #215 | P1 |

## Session-Learn
>>>>>>> 7fb8a8cd (fix(website): soft-404, security.txt, /danke + gap radar)

```bash
python3 scripts/learning/note-acquisition-gaps.py --summary "…"
```
<<<<<<< HEAD

Oder manuell: 1–3 Acquisition-Opportunities in AgentMemory speichern + Radar updaten.
=======
>>>>>>> 7fb8a8cd (fix(website): soft-404, security.txt, /danke + gap radar)
