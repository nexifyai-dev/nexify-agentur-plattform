# FILE: /docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
# NIR: 02.08.2026 10:10
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Living checklist — acquisition, conversion, ops gaps for Cursor agents
# WHY: Permanent proactivity; never wait for user to ask for gap scans
# BEST-PRACTICE: Update this file when finding/fixing gaps; open Issues for larger items
# PITFALL: V-GTM-RADAR-01: Do not duplicate open PRs (blog, free GTM, outreach, Revolut, Gesamtkonzept)
# DEPENDS: .cursor/rules/60-proactive-acquisition-gaps.mdc, FREE-ACQUISITION-PLAYBOOK (PR #175)
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# SESSION: proactive-gaps-acquisition-7dd5

# Ongoing Gap & Acquisition Radar

**Rule:** `.cursor/rules/60-proactive-acquisition-gaps.mdc` (alwaysApply)  
**Agents:** Nach jedem Task dieses Dokument pflegen (Checkboxen / „Neu“-Zeilen).  
**HARD:** Keine Fake-Reviews · kein Hermes-Cutover · keine Secrets · kein Paid-Ads-Spend.

## Koordination (nicht duplizieren)

| Track | PR / Artefakt | Status |
|-------|---------------|--------|
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
| A11 | GSC Verification Meta/Property | **done** | DNS Domain + Sitemap submitted 2026-08-02 — `docs/operations/GOOGLE-SEARCH-CONSOLE.md`; next: Coverage + Money-Page Indexing |
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
| Google Search Console | Ownership + Sitemap **DONE** 2026-08-02 | Next: Coverage weekly + URL-Inspection Money-Pages |
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
| 2026-08-02 | GSC verify + WhatsApp Business Profile (Human) | #210 | P1 — GSC Ownership+Sitemap DONE; WhatsApp offen |
| 2026-08-02 | GSC Property + Sitemap submit (Human) | #238 | **closed** — submitted 2026-08-02 |
| 2026-08-02 | GSC coverage weekly check | #245 | P2 — recurring Coverage / Soft-404 / Indexing |
| 2026-08-02 | Echte Testimonial-Pipeline (Permission-first) | #211 | **closing** (pipeline) |
| 2026-08-02 | Lead-Magnet PDF Asset + Thank-you mail | #212 | **closing** |

---

## Session-Learn Reminder

Nach Continuous-Learning (#203) / `scripts/learning/session-learn.sh`:

```bash
python3 scripts/learning/note-acquisition-gaps.py --summary "…"
```

Oder manuell: 1–3 Acquisition-Opportunities in AgentMemory speichern + Radar updaten.
