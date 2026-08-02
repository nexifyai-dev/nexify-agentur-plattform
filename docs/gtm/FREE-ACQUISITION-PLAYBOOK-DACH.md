# FILE: /docs/gtm/FREE-ACQUISITION-PLAYBOOK-DACH.md
# NIR: 02.08.2026 09:30
# UPDATED: 02.08.2026 09:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Ranked Playbook kostenfreie Neukundenakquise DACH (+NL Sitz Venlo)
# WHY: Zero incremental cost — Zeit statt Paid Ads / neue SaaS
# BEST-PRACTICE: Supply (sichtbar sein) + Demand (Intent finden) + Conversion (Website)
# PITFALL: V-GTM-FREE-01: Kein Spam in Foren; V-GTM-03: keine Abo-Fallen (Gelbe Seiten Starteintrag)
# DEPENDS: NAP_MASTER_V1.md, CHANNEL_REGISTER_V1.md, OFFER_SNIPPETS_*.md, DIRECTORY_SUBMISSION_CHECKLIST.md
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# SESSION: free-acquisition-dach-7dd5

# Free Acquisition Playbook — DACH (Zero Incremental Cost)

**Regel:** Keine Paid Ads, kein neues SaaS-Abo, kein Extra-Cloud-Spend über die laufende Infra hinaus.  
**Sitz:** Venlo (NL) · Service Area: DE/AT/CH/NL · Sprache primär DE.  
**Preisanker:** 449 € netto / Arbeitstag (öffentlich).

## Koordination (nicht duplizieren)

| Agent / Track | Scope | Dieses Playbook |
|---------------|-------|-----------------|
| Blog/GTM (`/blog`, SEO-Artikel) | Content & llm.txt | Verlinken, CTAs — **keine** parallelen Blog-PRs |
| Outreach (Hostinger SMTP) | Gated Cold-Drip | Nur freigegebene Leads; **kein** Resend-Cold |
| Dieses Playbook | Ranking, Verzeichnisse, GBP/NAP, Social Proof, Weekly Agent | Eigentümer |

Quellen der Wahrheit: [GTM_KOSTENFREI_GESAMTPLAN_V1.md](GTM_KOSTENFREI_GESAMTPLAN_V1.md) · [CHANNEL_REGISTER_V1.md](CHANNEL_REGISTER_V1.md) · [NAP_MASTER_V1.md](NAP_MASTER_V1.md)

---

## Top 15 kostenfreie Taktiken (ranked)

| Rang | Taktik | Hebel | Aufwand/Woche | Owner | Agent-Autonomie | Zeit bis Signal |
|------|--------|-------|---------------|-------|-----------------|-----------------|
| 1 | **Google Business Profile** (Venlo + Service Area DACH/NL) | Local Pack / Maps / Trust | 30–45 min | Human (Login/Verify) | Draft Posts + NAP | Tage |
| 2 | **Organisches LinkedIn** (Personal ≫ Company) | B2B Reach DACH | 90–120 min | Human postet; Agent draftet | Post-Drafts DE | 2–6 Wochen |
| 3 | **Organisches SEO** (Wissen/Blog/FAQ + LocalBusiness Schema) | Intent-Traffic | Agent Content + Deploy | Agent + Blog-Track | Hoch | 3–6 Monate |
| 4 | **NAP-Citations** Free-Verzeichnisse Wave 1–2 | Local SEO Trust | 60–90 min Submit | Agent draft + Human Click | Draft-PRs wöchentlich | Wochen |
| 5 | **wlw / Europages / B2B-Kataloge** Free-Profil | B2B Discovery DE | 20–40 min | Agent/Owner | ready_to_submit | Wochen |
| 6 | **freelance.de + freelancermap** Profil + Projekt-Scan | Demand Intent | Scan Agent; Profil Owner | Demand-Script | Hoch (Scan) | Tage–Wochen |
| 7 | **Website Conversion** (CTA, Chat, Referenzen, Social Proof) | Inbound Close | einmalig + Pflege | Agent PR | Hoch | sofort |
| 8 | **Xing** Unternehmens-/Personalprofil (Free) | DACH Altkanal | 20 min | Human Login | Draft Bio | Wochen |
| 9 | **Clutch / Sortlist / ProvenExpert** Free Profiles | Social Proof | 30–45 min | Owner Verify | Drafts | Wochen |
| 10 | **Bing Places + Apple Business Connect** | ChatGPT/Siri Citations | 20 min | Human | NAP-Checkliste | Wochen |
| 11 | **Reddit / IndieHackers / DE-Communities** — Value-Posts only | Awareness (kein Spam) | 30–45 min | Human approve | Outline-Draft | Wochen |
| 12 | **GitHub About/Topics + Website Social Proof** | Builder Trust | einmalig | Agent | Done wenn live | sofort |
| 13 | **Partner/Cross-Links** (Komplementäre Freelancer, Buchhalter, SEOs) | Referral | opportunistisch | Human | Intro-Draft | Monate |
| 14 | **Öffentliche Vergabe lesen** (service.bund.de / TED) — nur Score | Long-tail Demand | Scan | Demand-Script | High read-only | laufend |
| 15 | **Product Hunt / opensourceprojects** — vorsichtig, Free Tier | Launch Visibility | einmalig | Human Gate | Listing-Draft | Event |

**Explizit nicht:** Paid Ads, Apollo/Hunter Paid, neue E-Mail-Tools, Forum-Spam, Gelbe-Seiten-Starteintrag-Abo, Hermes-Cutover.

---

## Wöchentliche Cursor-Agent-Checkliste

Automation: `.cursor/automations/free-gtm-dach-to-agent.md` · Workflow: `.github/workflows/free-gtm-weekly.yml`

### Montag — Supply

- [ ] Nächste 3 Kanäle aus [DIRECTORY_SUBMISSION_CHECKLIST.md](DIRECTORY_SUBMISSION_CHECKLIST.md) mit Status `ready_to_submit`
- [ ] Draft-Inserattexte (DE) aus `OFFER_SNIPPETS_de.md` + NAP exakt
- [ ] PR öffnen: `docs/gtm/evidence/supply-wave*/Sxx-*.md` ausfüllen (submitted_at leer bis Human klickt)
- [ ] Keine Premium-Checkboxen

### Dienstag — Content / SEO

- [ ] Mit Blog-Track abstimmen: 1 FAQ- oder Wissen-Snippet **oder** Blog-CTA prüfen (kein Doppel-Artikel)
- [ ] `llm.txt` / FAQ-Anker auf Live-Site noch aktuell?
- [ ] LocalBusiness/ProfessionalService JSON-LD unverändert korrekt?

### Mittwoch — Demand (read-only)

- [ ] `python3 scripts/gtm/demand_scan_prepare.py` (oder `--demo`) → CRM Pending JSON
- [ ] Kein Auto-Versand; Legal Gate bleibt
- [ ] Outreach-Track nur informieren wenn SMTP/Hostinger bereits paid & configured

### Donnerstag — Social Drafts

- [ ] 2× LinkedIn Personal Post-Draft (Problem → Lösung → CTA mit UTM)
- [ ] 1× optional Xing/Reddit-Outline (Value first, Soft-CTA)
- [ ] Drafts als PR unter `docs/gtm/evidence/social-drafts/YYYY-Www.md`

### Freitag — Conversion & KPI

- [ ] Sticky-/Wissen-/Referenzen-CTAs live? Social-Proof-Sektion sichtbar?
- [ ] KPI-Logzeile in `docs/gtm/evidence/channel-kpi-log.md`
- [ ] AgentMemory `memory_save` (was submitted / blocked / human-gate)

### Human 5-Min-Gates (blockierend)

| Gate | Issue / Aktion |
|------|----------------|
| Google Business Verify + Posts | Issue mit Label `human-gate` (GBP/NAP) |
| LinkedIn/Xing Login | Owner |
| Verzeichnis-Captcha / E-Mail-Confirm | Owner klickt Submit aus Draft |
| CURSOR_API_KEY für Cloud-Dispatch | Repo Secret — ohne Key: Workflow produziert trotzdem Draft-PRs |

---

## UTM-Mindestschema

```
https://www.nexifyai.cloud/?utm_source=<channel>&utm_medium=listing|organic|social&utm_campaign=<leistung|brand>
```

Siehe [NAP_MASTER_V1.md](NAP_MASTER_V1.md).

---

## Erfolgsdefinition Wave Free-1 (30 Tage)

- ≥15 Free-Listings live, NAP-Stichprobe ok
- GBP claim/verify erledigt (Human)
- ≥1 messbarer Inbound-Pfad (UTM oder GBP Insights)
- Website Social Proof + klare DE-CTAs live
- Weekly Workflow hat ≥1 Draft-PR erzeugt (auch ohne CURSOR_API_KEY)
