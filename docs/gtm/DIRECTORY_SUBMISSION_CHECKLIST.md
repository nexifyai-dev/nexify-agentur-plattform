# FILE: /docs/gtm/DIRECTORY_SUBMISSION_CHECKLIST.md
# NIR: 02.08.2026 09:30
# UPDATED: 02.08.2026 09:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Checkbox-Liste Free-Verzeichnisse Wave 1+2 + Human-Submit-Hinweise
# WHY: Agent bereitet Drafts vor; viele Portale brauchen menschlichen Klick (Captcha/Login)
# BEST-PRACTICE: Nur Free/Grundeintrag; NAP exakt aus NAP_MASTER; UTM-URL
# PITFALL: V-GTM-03 Gelbe Seiten Starteintrag-Abo; keine bezahlten Premiums
# DEPENDS: NAP_MASTER_V1.md, OFFER_SNIPPETS_de.md, CHANNEL_REGISTER_V1.md
# DOCS-REF: docs/gtm/FREE-ACQUISITION-PLAYBOOK-DACH.md
# SESSION: free-acquisition-dach-7dd5

# Free Directory Submission Checklist

**NAP-Quelle:** [NAP_MASTER_V1.md](NAP_MASTER_V1.md)  
**Texte:** [OFFER_SNIPPETS_de.md](OFFER_SNIPPETS_de.md) / [OFFER_SNIPPETS_nl.md](OFFER_SNIPPETS_nl.md)  
**Evidence:** `docs/gtm/evidence/supply-wave1/` bzw. `supply-wave2/`  
**Automation:** `python3 scripts/gtm/prepare_directory_drafts.py --limit 3`

## Wer macht was?

| Schritt | Agent | Human |
|---------|-------|-------|
| Research + Draft-Text + Evidence-Stub | ✅ | |
| PR mit Draft | ✅ | Review optional |
| Account anlegen / Captcha / 2FA / Verify | | ✅ oft |
| Submit klicken | ✅ wenn Formular ohne Login | ✅ sonst |
| Status `live` + öffentliche URL | ✅ nach Evidence | |

---

## Wave 1 (Channel Register S01–S19)

### Owner-Gates (Human Login)

- [ ] **S01** Google Business Profile — https://business.google.com/ — Verify Video/Post · Service Area DACH+NL
- [ ] **S02** LinkedIn Company — Company Page claim
- [ ] **S03** LinkedIn Personal (Pascal) — Headline/About/Featured
- [ ] **S04** Xing Unternehmen — Profil + Leistungen

### Ready to submit (Agent Draft → oft Human Confirm)

- [ ] **S05** wlw — https://www.wlw.de/de/supplier-registration — nur Grundprofil
- [ ] **S06** Gelbe Seiten — https://www.gelbeseiten.de/starteintrag — **nur kostenloser Grundeintrag, kein Starteintrag-Abo**
- [ ] **S07** Das Örtliche — https://www.dasoertliche.de/
- [ ] **S08** Cylex — https://web2.cylex.de/
- [ ] **S09** Hotfrog DE — https://www.hotfrog.de/
- [ ] **S10** Firmeneintrag.de — https://firmeneintrag.de/
- [ ] **S11** Dienstleistungen24 — https://dienstleistungen24.de/ — keine Provisionstarife
- [ ] **S12** Bizin NL — https://nl.bizin.eu/nld/
- [ ] **S13** Handelsgids.be — https://www.handelsgids.be/zaak-aanmelden/
- [ ] **S14** Business Vlaanderen — https://businessvlaanderen.be/aanmelden/
- [ ] **S15** Clutch — https://clutch.co/ — Free Profile
- [ ] **S16** Sortlist — https://www.sortlist.com/
- [ ] **S17** freelance.de Profil — https://www.freelance.de/
- [ ] **S18** freelancermap.de Profil — https://www.freelancermap.de/
- [ ] **S19** ProvenExpert — https://www.provenexpert.com/ — Free Basis

### Bereits live (eigene Site)

- [x] **S20** Website Leistungen/Preise — https://www.nexifyai.cloud/leistungen

---

## Wave 2 — erweiterte Free Citations (S21–S32)

Status initial: `ready_to_submit` · Evidence unter `docs/gtm/evidence/supply-wave2/`

- [ ] **S21** 11880 — https://www.11880.com/ — Free Firmeneintrag
- [ ] **S22** GoYellow — https://www.goyellow.de/ — kostenlos
- [ ] **S23** Yelp DE — https://www.yelp.de/ — Business Claim (Free)
- [ ] **S24** Bing Places — https://www.bingplaces.com/ — ChatGPT-Citation-Signal
- [ ] **S25** Apple Business Connect — https://businessconnect.apple.com/ — Siri/Karten
- [ ] **S26** Branchenverzeichnis.org — https://www.branchenverzeichnis.org/ — Basiseintrag free
- [ ] **S27** Kennstdueinen — https://www.kennstdueinen.de/ — Free Listing
- [ ] **S28** Stadtbranchenbuch — https://www.stadtbranchenbuch.de/
- [ ] **S29** Europages — https://www.europages.de/ — B2B Free Profile
- [ ] **S30** opensourceprojects.dev — https://opensourceprojects.dev/ — Entdeckungskanal (kein Paid); Listing nur wenn Free & passend
- [ ] **S31** Indie Hackers — https://www.indiehackers.com/ — Value-Post / Product page, kein Spam
- [ ] **S32** Product Hunt — https://www.producthunt.com/ — Free Launch **sorgfältig** (Timing, DE Audience sekundär) — Human Gate vor Launch

---

## Draft-Template (Agent füllt aus)

```markdown
# Draft Listing — <Sxx> <Name>

**Status:** ready_to_submit
**Portal:** <URL>
**utm_source:** <slug>
**Human nötig:** ja | nein (Captcha/Login)

## Felder (Copy-Paste)

| Feld | Wert |
|------|------|
| Name | NeXify AI |
| Straße | Graaf van Loonstraat 1E |
| PLZ Ort | 5921 JA Venlo |
| Land | Niederlande |
| Telefon | +31 6 133 188 56 |
| E-Mail | mail@nexifyai.cloud |
| Website | https://www.nexifyai.cloud/?utm_source=<slug>&utm_medium=listing&utm_campaign=brand |
| Kategorie | Webentwicklung / Digitalagentur / IT-Dienstleistungen |
| Kurzbeschreibung | <aus OFFER_SNIPPETS_de Brand Short> |

## Submit-Schritte für Human

1. Link öffnen
2. Free/Basic wählen — Premium ablehnen
3. Felder einfügen
4. Captcha/Confirm
5. Evidence-Datei: submitted_at + confirmation notieren
```

---

## wont_do (Erinnerung)

- Handwerkerportale (ICP-Mismatch)
- Marketingburos.nl Paid
- Gelbe Seiten Starteintrag-Abo
- Alle Paid Premium Listings
