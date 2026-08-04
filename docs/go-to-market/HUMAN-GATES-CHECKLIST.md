# GTM Human-Gates Checklist — Pascal-Actions

<!-- NIR: 04.08.2026 09:35 | UPDATED: 04.08.2026 09:35 -->
<!-- Source: channels.json + Issue #294 -->

Alle Einträge hier benötigen **manuelle Aktion von Pascal** (SSO-Login, OTP, CAPTCHA, E-Mail-Verify).  
Kein Agent kann diese Schritte übernehmen.

---

## ✅ Sofort erledigen — E-Mail-Verify (Posteingang `mail@nexifyai.cloud`)

### 1. agenturen.app
- **Status:** Formular eingereicht 01.08.2026 — wartet auf E-Mail-Verify
- **Aktion:** E-Mail von agenturen.app öffnen → Verifizierungslink klicken → Profil vervollständigen
- **Listing-Text:** `docs/go-to-market/listing-copy.json`

### 2. Zukko.nl
- **Status:** Anmeldung eingereicht 01.08.2026 — Profil-Link innerhalb 24h
- **Sprache:** Niederländisch (NL)
- **Aktion:** Zukko-Mail öffnen → Profil-Link annehmen → Fotos + Texte nachpflegen
- **Hinweis:** `first_year_free`

---

## 🔑 P0 — SSO-Login erforderlich

### 3. Google Business Profile
- **URL:** https://business.google.com/
- **Login:** Google-Account Pascal
- **Aktion:** Local-Listing anlegen (Standort: Venlo, NL) — Kategorien: KI-Beratung / Webentwicklung
- **Adresse:** Graaf van Loonstraat 1E, 5921 JA Venlo

### 4. Clutch Free Profile
- **URL:** https://clutch.co/tools
- **Login:** Google oder LinkedIn (Pascal-Account)
- **Aktion:** Profil anlegen — Kategorien: websites / web-apps / ai
- **Hinweis:** Erst Kundenbewertungen sammeln, bevor Paid Clutch erwogen wird

---

## 🔒 P0 — Passwort + CAPTCHA im Browser nötig (VPS blockiert)

> VPS-IP ist von Cloudflare/reCAPTCHA geblockt. Diese Schritte im **lokalen Browser** von Pascal ausführen.

### 5. profis.ai
- **URL:** https://profis.ai/
- **Vorbereitet:** Benutzername `nexifyai` / E-Mail `mail@nexifyai.cloud` / Kategorie: KI-Profi
- **Aktion:** Registrierungsformular aufrufen → Passwort setzen → reCAPTCHA lösen → Submit
- **Kategorien:** Automationen mit KI / KI & GenAI Beratung B2B / AI-Engineering

### 6. GoodFirms
- **URL:** https://www.goodfirms.co/get-listed
- **Aktion:** Register-Formular ausfüllen → Turnstile/CAPTCHA lösen → Listing-Text aus `listing-copy.json` (Feld `long_en`) einfügen
- **Hinweis:** ~23 % Acceptance Rate Free Tier; Resend API vom VPS 403 → Verify-Mail nur im lokalen Browser möglich

### 7. Sortlist NL/DE
- **URL:** https://www.sortlist.nl/agency/register (oder sortlist.de)
- **Aktion:** Agency-Registrierung im lokalen Browser → Cloudflare Bot-Check manuell bestätigen
- **Hinweis:** Free Profile ausreichend für Start

---

## P1 — Folgewelle (nach P0 abgeschlossen)

| Kanal | Status | Aktion |
|-------|--------|--------|
| Agenturmarkt.de KI | pending | Freemium-Registrierung auf https://www.agenturmarkt.de/agenturen/ki-agentur |
| The AI Rolodex | blocked_cloudflare | /add = 404; Listing-Mail-Draft in `outbound-listing-emails.md` |
| AI Agency Search | blocked_form_unavailable | /submit zeigt nur Pricing; Listing-Mail-Draft in `outbound-listing-emails.md` |

---

## Listing-Copy

Alle Texte, Kategorien und Firmendaten für die Einträge:  
→ `docs/go-to-market/listing-copy.json`  
→ `docs/go-to-market/channels.json` (Firmendaten unter `company`)

---

## Compliance

- **Kein Cold-Send** (§7 UWG): E-Mail-Outreach bleibt dry-run bis Consent-Queue existiert
- **Kein B2C**, keine SaaS-Workstation-Bewerbung vor Cutover-Freigabe
- Outbound-Listing-Entwürfe: `docs/go-to-market/outbound-listing-emails.md`
