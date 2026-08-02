# docs/gtm — Go-to-Market (kostenfrei)

Operative Artefakte für Angebotsinsertion und Kundensuche ohne Paid Ads.

| Datei | Zweck |
|-------|-------|
| [DACH-ACQUISITION-PLAYBOOK.md](DACH-ACQUISITION-PLAYBOOK.md) | DE-first Acquisition: Blog, SEO, Cursor Agent, Gates |
| [RESEARCH-FREE-CAC-2026.md](RESEARCH-FREE-CAC-2026.md) | Web-Research Free CAC + shipped/deferred |
| [FREE-ACQUISITION-PLAYBOOK-DACH.md](FREE-ACQUISITION-PLAYBOOK-DACH.md) | **Ranked Top-15 + Weekly Agent-Checkliste** |
| [DIRECTORY_SUBMISSION_CHECKLIST.md](DIRECTORY_SUBMISSION_CHECKLIST.md) | Free-Verzeichnisse Wave 1+2 Checkboxen |
| [GTM_KOSTENFREI_GESAMTPLAN_V1.md](GTM_KOSTENFREI_GESAMTPLAN_V1.md) | Gesamtplan |
| [NAP_MASTER_V1.md](NAP_MASTER_V1.md) | Firma/NAP/UTM |
| [CHANNEL_REGISTER_V1.md](CHANNEL_REGISTER_V1.md) | Supply/Demand-Kanäle |
| [OFFER_SNIPPETS_de.md](OFFER_SNIPPETS_de.md) | Inserattexte DE |
| [OFFER_SNIPPETS_nl.md](OFFER_SNIPPETS_nl.md) | Inserattexte NL |
| [DEMAND_SEARCH_QUERIES_V1.md](DEMAND_SEARCH_QUERIES_V1.md) | Suchqueries |
| [SUPPLY_WAVE1_CHECKLIST_V1.md](SUPPLY_WAVE1_CHECKLIST_V1.md) | Wave-1-Checkliste |
| [CONVERSION_LOOP_V1.md](CONVERSION_LOOP_V1.md) | Lead → Angebot → KPI |
| [SCALE_GATES_V1.md](SCALE_GATES_V1.md) | Skalierungsgrenzen |
| [STRONGEST-COMPETITORS-2026.md](STRONGEST-COMPETITORS-2026.md) | Top-Konkurrenten + Taktik-Matrix + Adoption |
| [STEAL-LIKE-AN-ARTIST-WEEKLY.md](STEAL-LIKE-AN-ARTIST-WEEKLY.md) | Wöchentliche Steal-Checklist für Agents |
| [ONGOING-GAP-AND-ACQUISITION-RADAR.md](ONGOING-GAP-AND-ACQUISITION-RADAR.md) | Living Gap-/Acquisition-Radar (Agents pflegen) |
| [GBP-OPS-CHECKLIST.md](GBP-OPS-CHECKLIST.md) | Google Business Ops (Human Gate) |
| [EMAIL-NURTURE-OPTIN.md](EMAIL-NURTURE-OPTIN.md) | Opt-in Nurture (UWG-safe) |
| [UWG-EMAIL-OPTIN-ONLY.md](UWG-EMAIL-OPTIN-ONLY.md) | **Hard stop:** DE Cold-Mail ohne Consent (§7 UWG) |
| [drafts/](drafts/) | LinkedIn/PR/Community/Gutefrage Drafts |
| [PARTNER-REVSHARE-LATER.md](PARTNER-REVSHARE-LATER.md) | Rev-Share deferred |
| [NEUKUNDEN-BEGEISTERUNG.md](NEUKUNDEN-BEGEISTERUNG.md) | P0 Delight nach First Touch · Koordination Zero-Cost-Leads |
| [ONBOARDING-EMAIL-TEMPLATES.md](ONBOARDING-EMAIL-TEMPLATES.md) | Inbound-Mail-Templates + Versand-Hook |
| [evidence/](evidence/) | Listing- und Demand-Evidence |
| [ONGOING-GAP-AND-ACQUISITION-RADAR.md](ONGOING-GAP-AND-ACQUISITION-RADAR.md) | Living Gap-/Acquisition-Radar |

Scripts:  
`python3 scripts/gtm/demand_scan_prepare.py --demo`  
`python3 scripts/gtm/prepare_directory_drafts.py --limit 3`  
`python3 scripts/gtm/discover_and_optin_mail.py --discover-demo --mail-list docs/gtm/evidence/optin-leads.sample.json --dry-run`  
`python3 scripts/gtm/icp_competitor_outreach.py --discover-demo`  

**UWG §7:** nur Opt-in-Mails — siehe `docs/gtm/UWG-EMAIL-OPTIN-ONLY.md` (`consent=true` + `OUTREACH_LIVE=1`).

Tests: `python3 scripts/gtm/test_demand_scan_prepare.py` · `python3 scripts/gtm/test_prepare_directory_drafts.py` · `python3 scripts/gtm/test_discover_and_optin_mail.py` · `python3 scripts/gtm/test_competitor_angle_templates.py`  

Automation: `.cursor/automations/free-gtm-dach-to-agent.md` · `.github/workflows/free-gtm-weekly.yml`

Onboarding-Mail (dry-run): `python3 scripts/gtm/send-onboarding-email.py --template lead_magnet --to dry@example.com --name Test`  
Tests: `python3 scripts/gtm/test_send_onboarding_email.py`

## Issue closures (2026-08-02)

- `PARTNER-WHITELABEL-INTRO-PLAYBOOK_V1.md` (#206)
- `PODCAST-GASTBEITRAG-PITCH-KIT_DE.md` (#207)
- `TESTIMONIAL-PERMISSION-PIPELINE_V1.md` (#211)
- Lead-Magnet PDF (#212)
- Ops decision `docs/operations/OPENMCP-SPAETHER-PAPERCLIP-DECISION-2026-08-02.md` (#209)

| [ZERO-COST-ACQUISITION-PLAYBOOK.md](ZERO-COST-ACQUISITION-PLAYBOOK.md) | Wöchentliche Lead-Discovery + Mail-Cadence |
