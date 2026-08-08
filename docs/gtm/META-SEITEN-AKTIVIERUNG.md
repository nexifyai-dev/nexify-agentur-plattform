# Meta-Seiten-Aktivierung (NeXify) — Checkliste & Pfad

**Stand:** 2026-08-08 · **Portfolio:** 888468287689944 · **Primäre Seite (Telefonprofil):** 1071302456068905 · **FB-Seite:** 702237169646391 · **IG:** @nexify.automate
**Status:** Verifizierung läuft (bis zu 2 Werktage). Alles Vorbereitete wird nach Freischaltung automatisch verdrahtet.

## Was Pascal freischalten muss (Reihenfolge)

### 1. App-Review / Permissions (blockiert API-Schreibzugriff)
App-Dashboard → App Review → Einreichen mit:
- `pages_manage_metadata` (Seiten-Profile aktualisieren)
- `pages_messaging` (Messenger-Antworten)
- `pages_manage_posts` (Beiträge)
- `instagram_basic` + `instagram_manage_messages` (IG-DM)
- `business_management` (Portfolio/Werbekonto)
- `whatsapp_business_messaging` + `whatsapp_business_management` (WhatsApp)
- Datenverwendung einreichen: Kontakt-/Messaging-Daten für automatisierte Antworten (EU-AI-Act: KI-Offenlegung Pflicht — in Messenger-Begrüßung integriert).

### 2. Tokens (sobald Permissions genehmigt)
- **Page-Token** (Seite 1071302456068905 + 702237169646391): Business Suite → Einstellungen → Neuer Zugriff → Seite (Admin) → Token mit `pages_*`-Permissions → `META_PAGE_TOKEN_TELEFONPROFIL` + `META_PAGE_TOKEN_FB` in hermes.env.
- **System-User-Token** (Business Manager) mit `business_management` + `ads_read` → `META_ACCESS_TOKEN`.
- **WABA + Phone-ID** (WhatsApp): läuft bei Pascal → `META_BUSINESS_ACCOUNT_ID`, `META_PHONE_NUMBER_ID`.

### 3. App-Use-Cases
App-Dashboard → App 28086460497651702 → Produkte hinzufügen:
- **Messenger** (Use Case „Connect with customers through Messenger") → Seite verknüpfen → Webhook `messages` auf `https://api.nexifyai.cloud/webhooks/meta` + Verify-Token
- **Instagram** (Use Case Instagram) → IG-Konto @nexify.automate verknüpfen → Webhook `messages`
- **WhatsApp** → läuft

## Was Hermes nach Freischaltung automatisch macht

1. **Seiten aktualisieren (CI):** Profilbild/Logo, Titelbild, Beschreibung (DE, CI-Ton), Kontaktdaten, CTA-Button („Angebot anfordern" → nexifyai.cloud/preise), Kategorien — auf FB-Seite + Telefonprofil + IG.
2. **Messenger/IG-Antworten:** Webhook-Proxy aktivieren (Port 8092) → Hermes-Route → Persona „NeXify AI" (Routing §0c, KI-Offenlegung, keine Preise im Chat → /preise; Bestandskunden → /login; Beschwerden → sofort Pascal).
3. **WhatsApp:** WABA/Phone verifizieren → Cloud-API-Versand + Templates.
4. **Marketing:** Content-Plan (2 Beiträge/Woche, CI #0a0a0a/#C8FF00), erste 5 Beiträge liegen bereit (docs/gtm/META-SEITEN-MARKETING.md); Ads-Ansatz: Werbekonto 2236954670479629, CTA → /preise, Zielgruppe DE/AT/CH/NL.
5. **Verifikation:** `meta-whatsapp-verify.py` (WhatsApp), Seite-POST-Test (Testbeitrag → löschen), Messenger-Echo-Test.


## SCHRITT-FÜR-SCHRITT (Pascal, je ~2 Minuten) — Stand 2026-08-08

> Webhook-Empfang ist BEREITS LIVE: Alle 3 Subscriptions (page/instagram/whatsapp_business_account) per API registriert und aktiv; Callback `https://api.nexifyai.cloud/webhooks/meta`, Verify-Tokens akzeptiert (beide). Es fehlen NUR die Asset-Verknüpfungen unten.

### A) Messenger aktivieren (2 Min)
1. https://developers.facebook.com/apps/28086460497651702 öffnen
2. Linkes Menü: **Messenger** → **Setup** → **Erste Schritte**
3. Seite wählen: **NeXify - Chat it. Automate it.** (Telefonprofil 1071302456068905 oder FB-Seite 702237169646391) → **Weiter**
4. Auf der Setup-Seite unten: **„Zugriffstoken generieren"** → Token kopieren → **mir schicken** (`META_PAGE_TOKEN`)

### B) Instagram aktivieren (2 Min)
1. App-Dashboard → **„+ Produkt hinzufügen"** (linkes Menü, unten) → **Instagram**
2. **„Instagram-Konto verbinden"** → **@nexify.automate** wählen → bestätigen
3. Fertig (Webhook ist schon aktiv)

### C) WhatsApp (läuft parallel bei dir)
- WABA + Nummer sind eingerichtet (Phone-ID 767191923135508 verankert) — fehlt: **WABA-ID** + **System-User-Token** (Business Settings → System Users → Generate token, Permissions `whatsapp_business_messaging` + `whatsapp_business_management`) → mir schicken

**Nach den Tokens mache ich automatisch (API):** Page-Subscription (`/{page_id}/subscribed_apps`), Seiten-CI (Profil/Beschreibung/CTA), Messenger-Begrüßung, erste 5 Beiträge, WABA-Subscription, Templates, Sendetest.
## Blockaden (aktuell)

| Blockade | Lösung |
|---|---|
| API-Schreibzugriff auf Seiten | App-Review (2 Werktage, Punkt 1) |
| Kein Page-Token | Punkt 2 |
| Kein System-User-Token | Punkt 2 |
| Keine WABA/Phone-ID | WhatsApp-Setup Pascal |
| Webhook-Proxy nicht deployed | Nach Token-Eingang: uvicorn auf Host (Port 8092) + systemd-Unit |
