# FILE: /docs/gtm/CHANNEL_REGISTER_V1.md
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 11:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Register aller kostenfreien Supply- und Demand-Kanäle
# WHY: Zentrale Steuerung, NAP-Konsistenz, UTM und Owner-Gates
# BEST-PRACTICE: Status nur nach Evidence-URL aktualisieren
# PITFALL: V-GTM-03: „3 Monate gratis“-Fallen (Gelbe Seiten Starteintrag) meiden
# DEPENDS: NAP_MASTER_V1.md, OFFER_SNIPPETS_*.md
# DOCS-REF: docs/gtm/GTM_KOSTENFREI_GESAMTPLAN_V1.md
# SESSION: gtm-kostenfrei-angebote-c6e3

# Channel-Register V1 (Free-Tier only)

**Status-Werte:** `pending_owner` | `ready_to_submit` | `submitted` | `live` | `blocked` | `wont_do`  
**Evidence:** `docs/gtm/evidence/supply-wave1/<channel_id>.md`

## A — Supply (Angebot inserieren)

| ID | Kanal | URL | Prio | Free? | Owner-Gate | utm_source | Status | Evidence |
|----|-------|-----|------|-------|------------|------------|--------|----------|
| S00 | Google Search Console | https://search.google.com/search-console | A1 | ja | Ownership+Sitemap DONE; Index/Prefs #243 | gsc | live_ownership | [Ops](../operations/GOOGLE-SEARCH-CONSOLE.md) |
| S01 | Google Unternehmensprofil | https://business.google.com/ | A1 | ja | Verify (Video/Post) | google_business | pending_owner | [S01](evidence/supply-wave1/S01-google-business.md) |
| S02 | LinkedIn Company | https://www.linkedin.com/company/ | A1 | ja | Owner Login | linkedin_company | pending_owner | [S02](evidence/supply-wave1/S02-linkedin-company.md) |
| S03 | LinkedIn Personal (Pascal) | https://www.linkedin.com/ | A1 | ja | Owner Login | linkedin_personal | pending_owner | [S03](evidence/supply-wave1/S03-linkedin-personal.md) |
| S04 | Xing Unternehmen | https://www.xing.com/ | A1 | ja | Owner Login | xing | pending_owner | [S04](evidence/supply-wave1/S04-xing.md) |
| S05 | wlw (Wer liefert was) | https://www.wlw.de/de/supplier-registration | A2 | Grundprofil | Account | wlw | ready_to_submit | [S05](evidence/supply-wave1/S05-wlw.md) |
| S06 | Gelbe Seiten Grundeintrag | https://www.gelbeseiten.de/starteintrag | A2 | nur Grundeintrag | Account; **kein Starteintrag-Abo** | gelbe_seiten | ready_to_submit | [S06](evidence/supply-wave1/S06-gelbe-seiten.md) |
| S07 | Das Örtliche | https://www.dasoertliche.de/ | A2 | Grundeintrag | Account | das_oertliche | ready_to_submit | [S07](evidence/supply-wave1/S07-das-oertliche.md) |
| S08 | Cylex | https://web2.cylex.de/ | A2 | ja | E-Mail-Confirm | cylex | ready_to_submit | [S08](evidence/supply-wave1/S08-cylex.md) |
| S09 | Hotfrog DE | https://www.hotfrog.de/ | A2 | ja | Account | hotfrog | ready_to_submit | [S09](evidence/supply-wave1/S09-hotfrog.md) |
| S10 | Firmeneintrag.de | https://firmeneintrag.de/ | A2 | ja | E-Mail-Confirm | firmeneintrag | ready_to_submit | [S10](evidence/supply-wave1/S10-firmeneintrag.md) |
| S11 | Dienstleistungen24 | https://dienstleistungen24.de/ | A2 | ja (keine Provision) | Account | dienstleistungen24 | ready_to_submit | [S11](evidence/supply-wave1/S11-dienstleistungen24.md) |
| S12 | Bizin NL | https://nl.bizin.eu/nld/ | A2 | ja | Account | bizin_nl | ready_to_submit | [S12](evidence/supply-wave1/S12-bizin-nl.md) |
| S13 | Handelsgids.be | https://www.handelsgids.be/zaak-aanmelden/ | A2 | ja | Formular | handelsgids | ready_to_submit | [S13](evidence/supply-wave1/S13-handelsgids.md) |
| S14 | Business Vlaanderen | https://businessvlaanderen.be/aanmelden/ | A2 | ja | Formular | business_vlaanderen | ready_to_submit | [S14](evidence/supply-wave1/S14-business-vlaanderen.md) |
| S15 | Clutch | https://clutch.co/ | A3 | Free Profile | Account + Verify | clutch | ready_to_submit | [S15](evidence/supply-wave1/S15-clutch.md) |
| S16 | Sortlist | https://www.sortlist.com/ | A3 | Free Profile | Account | sortlist | ready_to_submit | [S16](evidence/supply-wave1/S16-sortlist.md) |
| S17 | freelance.de Profil | https://www.freelance.de/ | A3 | Free Profile | Account | freelance_de | ready_to_submit | [S17](evidence/supply-wave1/S17-freelance-de.md) |
| S18 | freelancermap.de Profil | https://www.freelancermap.de/ | A3 | Free Profile | Account | freelancermap | ready_to_submit | [S18](evidence/supply-wave1/S18-freelancermap.md) |
| S19 | ProvenExpert | https://www.provenexpert.com/ | A3 | Free Basis | Account | provenexpert | ready_to_submit | [S19](evidence/supply-wave1/S19-provenexpert.md) |
| S20 | Website Leistungen/Preise | https://www.nexifyai.cloud/leistungen | A4 | eigen | Deploy | website | live | kanonisch |
| S33 | Vergleichsseite | https://www.nexifyai.cloud/vergleich | A1 | eigen | Deploy | vergleich | live | page |
| S34 | Alternativen-Hub | https://www.nexifyai.cloud/alternativen | A1 | eigen | Deploy | alternativen | live | page |
| S35 | Checkliste Lead-Magnet | https://www.nexifyai.cloud/checkliste | A1 | eigen | Deploy | checkliste | live | page |
| S36 | AI-Sprechstunde | https://www.nexifyai.cloud/sprechstunde | A1 | eigen | Deploy | sprechstunde | live | page |
| S37 | Partner / Referral | https://www.nexifyai.cloud/partner | A2 | eigen | Deploy | partner | live | page |
| S38 | Campus-Botschafter | https://www.nexifyai.cloud/botschafter | A3 | eigen | Deploy | botschafter | live | page |
| S39 | WhatsApp Business Link | wa.me (Footer) | A1 | eigen | Deploy | whatsapp | live | footer |
| S21 | 11880 | https://www.11880.com/ | A2 | ja | Account | 11880 | ready_to_submit | [S21](evidence/supply-wave2/S21-11880.md) |
| S22 | GoYellow | https://www.goyellow.de/ | A2 | ja | Account | goyellow | ready_to_submit | [S22](evidence/supply-wave2/S22-goyellow.md) |
| S23 | Yelp DE | https://www.yelp.de/ | A2 | Free Claim | Owner Login | yelp | ready_to_submit | [S23](evidence/supply-wave2/S23-yelp.md) |
| S24 | Bing Places | https://www.bingplaces.com/ | A2 | ja | Microsoft Account | bing_places | ready_to_submit | [S24](evidence/supply-wave2/S24-bing-places.md) |
| S25 | Apple Business Connect | https://businessconnect.apple.com/ | A2 | ja | Apple ID | apple_business | ready_to_submit | [S25](evidence/supply-wave2/S25-apple-business.md) |
| S26 | Branchenverzeichnis.org | https://www.branchenverzeichnis.org/ | A3 | Basiseintrag | Formular | branchenverzeichnis | ready_to_submit | [S26](evidence/supply-wave2/S26-branchenverzeichnis.md) |
| S27 | Kennstdueinen | https://www.kennstdueinen.de/ | A3 | ja | Formular | kennstdueinen | ready_to_submit | [S27](evidence/supply-wave2/S27-kennstdueinen.md) |
| S28 | Stadtbranchenbuch | https://www.stadtbranchenbuch.de/ | A3 | ja | Formular | stadtbranchenbuch | ready_to_submit | [S28](evidence/supply-wave2/S28-stadtbranchenbuch.md) |
| S29 | Europages | https://www.europages.de/ | A2 | Free Profile | Account | europages | ready_to_submit | [S29](evidence/supply-wave2/S29-europages.md) |
| S30 | opensourceprojects.dev | https://opensourceprojects.dev/ | A4 | free if eligible | Human Gate | opensourceprojects | ready_to_submit | [S30](evidence/supply-wave2/S30-opensourceprojects.md) |
| S31 | Indie Hackers | https://www.indiehackers.com/ | A4 | ja | Value-Post Gate | indiehackers | ready_to_submit | [S31](evidence/supply-wave2/S31-indiehackers.md) |
| S32 | Product Hunt | https://www.producthunt.com/ | A4 | Free Launch | Human Timing Gate | producthunt | ready_to_submit | [S32](evidence/supply-wave2/S32-producthunt.md) |

### Wave-1-Minimum (15 Einträge)

S00 = GSC (Ownership DONE). S01–S15 bilden das Ziel ≥15 Listings. S16–S19 Wave-1-Plus. S20 bereits live (eigene Site).

### wont_do

| ID | Kanal | Grund |
|----|-------|-------|
| X01 | Handwerkerportale | ICP-Mismatch |
| X02 | Marketingburos.nl Paid | nicht Free |
| X03 | Gelbe Seiten Starteintrag-Abo | Abo-Falle nach Trial |
| X04 | Paid Premium Listings | Plan: Free only |

## B — Demand (Nachfrage finden)

| ID | Kanal | URL | Typ | Free? | Autonomie | Status |
|----|-------|-----|-----|-------|-----------|--------|
| D01 | freelance.de Projekte | https://www.freelance.de/Webentwicklung-Projekte | Projektbörse | Suche/Profil free | Scan hoch | active_queries |
| D02 | freelancermap Projekte | https://www.freelancermap.de/ | Projektbörse | Profil free | Scan hoch | active_queries |
| D03 | service.bund.de | https://www.service.bund.de/ | Vergabe | ja | Scan/Score | active_queries |
| D04 | TED EU | https://ted.europa.eu/de/ | Vergabe | ja | Scan/Score | active_queries |
| D05 | LinkedIn Gruppen/Posts | https://www.linkedin.com/ | Intent | ja | Owner + Gate | watchlist |
| D06 | Xing Gruppen | https://www.xing.com/ | Intent | ja | Owner + Gate | watchlist |
| D07 | Reddit (hilfreich, kein Spam) | https://www.reddit.com/ | Intent | ja | Gate vor Post | watchlist |
| D08 | Procuris Free Search | https://procuris.app/ o.ä. | Vergabe-Aggregator | Free-Kern | nur lesen/score | optional |

Queries: [DEMAND_SEARCH_QUERIES_V1.md](DEMAND_SEARCH_QUERIES_V1.md)

## Pflege-Regel

1. Vor Status `live`: Evidence-Datei mit öffentlicher URL + NAP-Checkliste ausfüllen.
2. Nach jeder Änderung: `UPDATED`-Header und Channel-Register-Zeile aktualisieren.
3. Wöchentliches Review laut [CONVERSION_LOOP_V1.md](CONVERSION_LOOP_V1.md).
