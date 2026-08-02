# FILE: /docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
# NIR: 02.08.2026 10:10
# UPDATED: 02.08.2026 10:10
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
| A01 | Partner / White-Label / Cross-Referral (Buchhalter, SEOs, Freelancer) | open | Issue — Intro-Drafts, kein Paid WL-SaaS |
| A02 | Gastbeiträge (DE B2B Tech/KMU Magazin) | open | Pitch-Liste + 1 Outline |
| A03 | Podcast-Gast Pitches (DACH KI/Gründer) | open | z. B. Branchen-KI-Podcasts; 20–30 Min |
| A04 | Vergleichsseiten SEO (`/vergleich`, ChatGPT vs Agentur) | **shipped** | `/vergleich` in diesem PR |
| A05 | Lead-Magnet (PDF-Checkliste, light gate) | **stub shipped** | `/checkliste` → `/api/contact` type=lead_magnet |
| A06 | WhatsApp Business Link (kein broken Cron) | **shipped** | Footer `wa.me` auf Firmennummer |
| A07 | Booking härter surface (`/rueckruf`) | **shipped** | Header + Sticky CTA |
| A08 | Retargeting nur organisch (kein Ad-Spend) | open | LinkedIn organic + remarketing-free only |
| A09 | Exit-Intent / Sticky CTA Verbesserungen | partial | Sticky → Termin; Exit-Intent noch offen |
| A10 | Trust: Testimonials/Logos/SLA | blocked | Nur mit echter Erlaubnis; kein AggregateRating fake |
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
| C05 | Lead-Magnet Download-Asset (echtes PDF) | open Issue |

---

## C. Stack / Ops (Smoke 2026-08-02)

| Service | Signal | Gap |
|---------|--------|-----|
| www.nexifyai.cloud | 308→ok | — |
| api.nexifyai.cloud `/api/health` | 200 | — |
| OpenMCP public DNS | NXDOMAIN | Issue — Tunnel/DNS oder docs-only |
| Spaether public DNS | NXDOMAIN | Issue — underused / tunnel |
| Paperclip :3100 | down lokal | Decision: Factory-Skill-Source vs. Runtime |
| Grafana/Prometheus/OpenDesign | RUNTIME-DOWN (bootstrap WARN) | Ops — CF-Tunnel |
| Google Search Console | unverifiziert? | Human Issue |
| #123 secrets+runner | open P0 human-gate | wait |
| #201 legal Stammdaten | open human-gate | wait |

---

## D. Neu gefunden (diese Session) — Issues

Agents: neue Zeilen hier + Issue-Nummer nach `gh issue create`.

| Datum | Gap | Issue | Priority |
|-------|-----|-------|----------|
| 2026-08-02 | Partner/White-Label Intro-Playbook (kein Paid SaaS) | #206 | P1 |
| 2026-08-02 | Podcast + Gastbeitrag Pitch-Kit DE | #207 | P1 |
| 2026-08-02 | Exit-Intent Modal (zero cost, DE) | #208 | P1 |
| 2026-08-02 | OpenMCP/Spaether/Paperclip utilization decision | #209 | P1 |
| 2026-08-02 | GSC verify + WhatsApp Business Profile (Human) | #210 | P1 |
| 2026-08-02 | Echte Testimonial-Pipeline (Permission-first) | #211 | P1 |
| 2026-08-02 | Lead-Magnet PDF Asset + Thank-you mail | #212 | P1 |

---

## Session-Learn Reminder

Nach Continuous-Learning (#203) / `scripts/learning/session-learn.sh`:

```bash
python3 scripts/learning/note-acquisition-gaps.py --summary "…"
```

Oder manuell: 1–3 Acquisition-Opportunities in AgentMemory speichern + Radar updaten.
