# FILE: docs/operations/WHATSAPP-BUSINESS-PROFILE.md
# NIR: 04.08.2026 09:36
# UPDATED: 04.08.2026 09:36
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps / GTM
# WHAT: SoT — WhatsApp Business Profile setup & status (human-gate)
# WHY: Footer wa.me ist live; Profil-Verify + Display-Name/Kategorie/Link sind Meta-Business-Manager-UI-Clicks
# BEST-PRACTICE: Business-Nummer = +31 6 133 188 56 (identisch mit phone in company.ts); nie Privat-WA
# PITFALL: V-WA-01: Privat-WA auf Geschäftsnummer paaren = Datenschutz + Meta-Policy-Bruch
# DEPENDS: Meta Business Manager (business.facebook.com); Telefon +31613318856; website https://www.nexifyai.cloud
# DOCS-REF: docs/gtm/CHANNEL_REGISTER_V1.md, apps/website/lib/company.ts
# SESSION: whatsapp-business-profile-210

# WhatsApp Business Profile — nexifyai.cloud

**Portal:** https://business.facebook.com → WhatsApp Manager  
**Nummer:** `+31 6 133 188 56` (= `company.phoneHref` in `apps/website/lib/company.ts`)  
**Footer-Link (live):** `https://wa.me/31613318856`  
**Issue:** #210

---

## Status

| # | Schritt | Status | Wer |
|---|---------|--------|-----|
| 1 | Footer `wa.me`-Link live | **DONE** | Agent (Repo) |
| 2 | WhatsApp Business App / API-Nummer paaren | **OPEN** | **Human (Pascal)** |
| 3 | Display-Name setzen | **OPEN** | **Human** |
| 4 | Firmenname eintragen | **OPEN** | **Human** |
| 5 | Kategorie wählen | **OPEN** | **Human** |
| 6 | Website-Link eintragen | **OPEN** | **Human** |
| 7 | Kurzbeschreibung | **OPEN** | **Human** |
| 8 | Profilbild (Logo) hochladen | **OPEN** | **Human** |
| 9 | Business Verification (Meta) falls gefordert | **OPEN** | **Human** |
| 10 | Quality-Rating / Green Tick (optional, nach Verif.) | **OPEN** | **Human** |

---

## Human-Schritte (~10 Min)

### Voraussetzungen

- Meta Business Manager Account: https://business.facebook.com
- Zugang zur Telefonnummer `+31 6 133 188 56` (für OTP-Bestätigung)
- Logo-Datei (quadratisch, min. 192×192 px)

### Schritt-für-Schritt

1. **Meta Business Manager** → https://business.facebook.com
2. Links: **WhatsApp Manager** → **Phone Numbers** → Nummer hinzufügen oder vorhandene Nummer auswählen
3. **Profil bearbeiten** (Edit Profile):

   | Feld | Wert |
   |------|------|
   | Display-Name | `NeXify AI` |
   | Firmenname | `NeXify AI by NeXify` |
   | Kategorie | `Software/IT-Dienstleistungen` oder `Unternehmensberatung` |
   | Website | `https://www.nexifyai.cloud` |
   | Kurzbeschreibung | `KI-Automatisierung für Betriebe. chat it. automate it.` |
   | Profilbild | NeXify-AI-Logo (quadratisch, PNG) |

4. **Speichern** — Änderungen gehen sofort live (kein Review bei WhatsApp Business App).
5. Optional: **Business Verification** in Meta Business Manager falls für API / Green Tick nötig.

---

## Hinweis: WhatsApp-Bridge (Baileys) — getrennt

Die technische Bridge (`whatsapp-bridge.service` / Baileys) ist aktuell pausiert (QR-Loop).  
Siehe `docs/operations/WHATSAPP-PAUSED.md`.

**Das WhatsApp Business Profil oben ist unabhängig davon** — es betrifft die öffentlich sichtbaren Meta-Profildaten (Display-Name, Kategorie, Link). Es kann im Meta Business Manager auch ohne laufende Bridge gepflegt werden.

---

## Footer-Implementierung (bereits live)

```ts
// apps/website/lib/company.ts
whatsappHref: "https://wa.me/31613318856",
```

```tsx
// apps/website/components/site-footer.tsx
href={`https://wa.me/${company.phoneHref.replace(/\D/g, '')}`}
```

**Keine Code-Änderung nötig** — Link ist korrekt und zeigt auf die Geschäftsnummer.

---

## Verwandte Issues / Dokumente

| Referenz | Rolle |
|----------|-------|
| #210 | Dieser Issue (GSC DONE + WA offen) |
| #238 | GSC Sitemap — **CLOSED** |
| #243 | GSC URL-Inspection (Human) |
| #237 | GBP verify |
| `docs/operations/WHATSAPP-PAUSED.md` | Bridge-Pause / Re-enable-Checkliste |
| `docs/operations/GOOGLE-SEARCH-CONSOLE.md` | GSC SoT (DONE) |
| `docs/gtm/CHANNEL_REGISTER_V1.md` | Kanal-Übersicht |
