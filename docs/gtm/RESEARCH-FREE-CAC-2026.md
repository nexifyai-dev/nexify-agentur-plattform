# FILE: /docs/gtm/RESEARCH-FREE-CAC-2026.md
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Web-Research 2025–2026 Free CAC (DACH) + Mapping implementiert vs. deferred
# WHY: Mandate: research first, then ship runnable free acquisition in-repo
# BEST-PRACTICE: Quellen ≥5; UWG/DSGVO vor Cold-Mail; extend existing GTM tracks
# PITFALL: V-CAC-01: DE Cold-E-Mail ohne Einwilligung abmahnfähig (§7 UWG) — kein Massenversand
# DEPENDS: FREE-ACQUISITION-PLAYBOOK-DACH.md, CHANNEL_REGISTER_V1.md, NAP_MASTER_V1.md
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# SESSION: research-free-cac-full-7dd5

# Research Free CAC 2026 — NeXify AI (DACH + NL)

**Produkt:** AI-Begleiter / Automatisierungs-Agentur · **449 €/Tag** · Booking `www.nexifyai.cloud`  
**Regel:** 0 € Paid Ads / neues SaaS · nur Repo + laufende VPS-Infra · ehrliche Claims · B2B.

## 1. Research-Findings (Kurz)

| Erkenntnis | Praxis-Hebel | Quellen |
|------------|--------------|---------|
| Organische Kanäle brauchen 3–6 Monate; Outbound (legal) + Content parallel | LinkedIn organisch + SEO jetzt; Cold-Mail in DE nur mit Einwilligung | AgentGrow 2026; KonexusHub 2026; Monolit 2026 |
| DACH: LinkedIn Personal ≫ Company; Vertrauen > Volumen | Wöchentliche Post-Drafts + Comment-Scripts; Owner postet | iGrow DACH 2026; Close One 2026; SeoEnergie 2026 |
| Local SEO / GBP: NAP, Kategorie, Posts, Reviews — oft schneller als Website-SEO | S01 Evidence + GBP-Ops-Checkliste; Human Verify | Lumina GBP 2026; tamer GBP Checklist 2026; SearchScope 36-pt |
| Lead-Magnet + Nurture schlägt generisches Whitepaper | `/checkliste`, Planner, Office Hours, Opt-in-Mail | KonexusHub; SeoEnergie |
| Partnerships/Referrals: Komplementäre ohne Payout-SaaS | `/partner` Rev-Share-Doku später; Intro-Scripts jetzt | Journeybee Partner 2026; Warm-Intro Praxis |
| HARO tot → Free: Source of Sources, #JournoRequest, Featured free tier | Pitch-Drafts + Human Gate | MarketingSherpa HARO alternatives; AnswerSocrates 2025 |
| Communities nur value-first (Reddit/FB/Xing) | Draft-Packs, kein Spam | FREE-ACQUISITION-PLAYBOOK; Close One |
| **Recht DE:** E-Mail-Werbung ohne ausdrückliche Einwilligung unzulässig (§7 UWG), auch B2B | Opt-in Nurture + Telefon/LinkedIn-Human; Dry-Run default | IHK München; Anwalt.de; TrustYourWebsite UWG-Guide |

### Quellen (URL)

1. https://agentgrow.io/blog/posts/b2b-leads-without-paid-ads.html
2. https://konexushub.com/b2b-lead-generation-engine-without-paid-ads/
3. https://monolit.sh/blog/customer-acquisition-strategies-startups-no-budget-2026
4. https://www.igrow.at/blog/b2b-leadgenerierung-dach-pipeline
5. https://seoenergie.de/leads-generieren-kostenlos/
6. https://www.close-one.de/blog/leadgenerierung-dach-2026
7. https://lumina-seo.com/blog/google-business-profile-optimization/
8. https://tamer.marketing/resources/checklist-google-business-profile/
9. https://sherpablog.marketingsherpa.com/content-marketing-2/haro-alternatives/
10. https://www.ihk-muenchen.de/ratgeber/recht/werbung-fairer-wettbewerb/marketing-per-email-telefon-brief-etc/
11. https://trustyourwebsite.com/de/de/guides/b2b-email-uwg-7
12. https://www.anwalt.de/rechtstipps/b2b-kaltakquise-via-e-mail-telefon-oder-brief-was-ist-rechtlich-erlaubt-275464.html

## 2. Implementiert (`cursor/research-free-cac-full-7dd5`)

| Taktik | Artefakt |
|--------|----------|
| Research + Compliance | diese Datei |
| Local SEO / GBP Ops | `GBP-OPS-CHECKLIST.md`, `drafts/GBP-WEEKLY-POSTS.md`, S01 |
| LinkedIn + Newsletter-from-Blog | `LINKEDIN-WEEK-1.md`, `drafts/LINKEDIN-NEWSLETTER.md` |
| Partnerships | `/partner`, `PARTNER-REVSHARE-LATER.md`, `WARM-INTRO-SCRIPTS.md` |
| Communities | `drafts/COMMUNITY-POSTS.md` |
| Comparison SEO | `/vergleich`, `/alternativen` |
| Lead magnet + nurture | `/checkliste`, `EMAIL-NURTURE-OPTIN.md`, `discover_and_optin_mail.py` |
| Office Hours | `/sprechstunde` → `/rueckruf` |
| PR pitches DE | `drafts/PR-PITCHES-DE.md` |
| Quora/Gutefrage | `drafts/GUTEFRAGE-QUORA.md` |
| GitHub trust | `github-social-proof.tsx` (via #175 merge) |
| Campus Ambassadors | `/botschafter` |
| WhatsApp Business | Footer `wa.me` |
| Schema/FAQ | FAQ auf `/alternativen` + bestehendes FAQPage |
| Discover + dry-run | `scripts/gtm/discover_and_optin_mail.py` |

**Merged:** #175 free-acquisition-dach · #213 proactive-gaps.

## 3. Deferred

| Thema | Warum |
|-------|-------|
| Paid Ads / Sales Nav | Hard stop Kosten |
| Cold-E-Mail Massenversand | §7 UWG |
| Gekaufte Listen | DSGVO + UWG |
| Fake Reviews / Fake Metrics | Hard stop |
| Hermes Cutover | Hard stop |
| Affiliate-Payout-Automation | Rev-Share später |

## 4. Legal Operating Rules

1. Opt-in only für E-Mail-Nurture.
2. Demand-Scan → CRM Pending → Legal Gate → Human Send.
3. LinkedIn/Xing/WhatsApp/GBP: Owner postet; Agent draftet.
4. Communities: Value first, max. 1 Soft-CTA-Link.
5. Claims nur belegbar (449 €, Venlo, B2B).
