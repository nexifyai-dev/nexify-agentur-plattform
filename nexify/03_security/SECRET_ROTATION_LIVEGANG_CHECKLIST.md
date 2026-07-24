# SECRET_ROTATION_LIVEGANG_CHECKLIST

**Stand:** 2026-06-11  
**Version:** 1.0  
**Status:** Checkliste – Finale Rotation VOR Livegang

> **WICHTIG:** Diese Checkliste enthält NUR Referenzen/Platzhalter, KEINE Secret-Werte.
> Die finale Rotation stellt sicher, dass zum Zeitpunkt des Livegangs alle frischen,
> noch nie kompromittierten Secrets im Einsatz sind.

---

## Präambel

Diese Checkliste wird **genau einmal** ausgeführt: in den 24–48 Stunden vor dem Livegang.
Danach gelten die regulären Rotationsintervalle aus `SECRET_ROTATION_PLAN.md`.

**Ziel:** Jedes Secret ist frisch rotiert, getestet und verifiziert. Kein Secret ist älter als 24h.

---

## 1. Vorbereitung (T-48h)

### Team & Kommunikation

- [ ] Rotations-Team festgelegt (mind. 2 Personen)
  - Verantwortlich: _______________
  - Stellvertretend: _______________
  - Benachrichtigungskanal: #security-livegang
- [ ] Kommunikationsplan erstellt
  - [ ] Start: Team-Benachrichtigung
  - [ ] Fortschritt: Status-Updates alle 2 Stunden
  - [ ] Störung: Sofort-Benachrichtigung an alle
  - [ ] Abschluss: Finale Bestätigung
- [ ] Ausfallzeit-Fenster definiert
  - Geplante Ausfallzeit: _________ bis _________ Uhr
  - Maximal tolerierte Ausfallzeit: _________ Minuten

### System-Check

- [ ] **Infisical-Instanz läuft stabil** (≥ 48h ohne Ausfall)
  - [ ] Healthcheck: `curl https://infisical.nexi fy.local/api/health`
  - [ ] DB-Verbindung geprüft
  - [ ] Backup läuft (letztes Backup: _______________ )
- [ ] **CLI-Zugriff** auf allen relevanten Maschinen getestet
  ```bash
  $ infisical whoami
  → Angemeldet als: <service-token>
  ```
- [ ] **Monitoring aktiv**
  - [ ] Infisical-Monitoring
  - [ ] Dienst-Monitoring (alle abhängigen Systeme)
  - [ ] Alerting konfiguriert (Pager/Slack)
- [ ] **Backup aktuell**
  - [ ] Letztes Infisical-DB-Backup: _______________
  - [ ] Letztes .env-Archiv (verschlüsselt): _______________
  - [ ] Backup-Restore getestet: [ ] Ja [ ] Nein

### Break-Glass

- [ ] Break-Glass-Skript getestet
  ```bash
  $ ./scripts/break-glass.sh SEC-001 --dry-run
  → OK
  ```
- [ ] Break-Glass-Kontakte hinterlegt
  - Security Engineer: _______________
  - DevOps Engineer: _______________
  - CTO: _______________

### Rollback-Vorbereitung

- [ ] Letzte stabile .env-Backups bereit (verschlüsselt)
- [ ] Rollback-Skript getestet
  ```bash
  $ ./scripts/rollback-env.sh --dry-run
  → OK
  ```
- [ ] Alte Secret-Werte in externen Dashboards dokumentiert (für Reaktivierung)

---

## 2. Testrotation (T-24h)

> In STAGING-Umgebung alle Secrets einmal rotieren, um die Prozedur zu validieren.

### CRITICAL Secrets

- [ ] **SEC-016 (.env-Dateien)**
  - [ ] STAGING: Alle Secrets aus .env in Infisical migriert
  - [ ] STAGING: Keine .env-Dateien mehr vorhanden
  - [ ] Ergebnis: _______________

- [ ] **SEC-011 (Supabase Keys)**
  - [ ] STAGING: Neue Keys generiert (service_role + anon)
  - [ ] STAGING: Keys deployt und getestet
  - [ ] STAGING: Alte Keys deaktiviert
  - [ ] Ergebnis: _______________

- [ ] **SEC-009 (SSH-Private-Keys)**
  - [ ] STAGING: Neues Key-Paar generiert (ed25519)
  - [ ] STAGING: Public Key auf Test-Servern deployt
  - [ ] STAGING: SSH-Verbindung getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-008 (OPENAI_API_KEY)**
  - [ ] STAGING: Neuer Key über OpenAI Dashboard generiert
  - [ ] STAGING: Key deployt und getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-001 (ANTHROPIC_AUTH_TOKEN)**
  - [ ] STAGING: Neuer Token generiert
  - [ ] STAGING: Token deployt und getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-002 (ANTHROPIC_API_KEY)**
  - [ ] STAGING: Neuer Key generiert
  - [ ] STAGING: Key deployt und getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-003 (DEEPSEEK_API_KEY)**
  - [ ] STAGING: Neuer Key generiert
  - [ ] STAGING: Key deployt und getestet
  - [ ] Ergebnis: _______________

### HIGH Secrets

- [ ] **SEC-013 (Webhook Tokens)**
  - [ ] STAGING: Neue Tokens generiert
  - [ ] STAGING: Tokens deployt + extern getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-014 (NEXIFY_AUTO_CHAT_INTERNAL_TOKEN)**
  - [ ] STAGING: Neuer Token generiert
  - [ ] STAGING: Token deployt und getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-004 (NEXIFY_ROUTER_API_KEY)**
  - [ ] STAGING: Neuer Key generiert
  - [ ] STAGING: Key deployt, Router neugestartet
  - [ ] Ergebnis: _______________

- [ ] **SEC-006 (AGENTMEMORY_SECRET)**
  - [ ] STAGING: Neuer Secret-Wert generiert
  - [ ] STAGING: Wert deployt, Service neugestartet
  - [ ] Ergebnis: _______________

- [ ] **SEC-007 (CUSTOM_API_KEY Hermes)**
  - [ ] STAGING: Neuer Key generiert
  - [ ] STAGING: Key deployt, Hermes getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-010 (Cloudflare API Tokens)**
  - [ ] STAGING: Neuer Token generiert
  - [ ] STAGING: Token deployt, DNS/CDN getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-017 (TLS/SSL Certificates)**
  - [ ] STAGING: Zertifikat erneuert
  - [ ] STAGING: HTTPS-Verbindung getestet
  - [ ] Ergebnis: _______________

### MEDIUM Secrets

- [ ] **SEC-005 (YOU_API_KEY)**
  - [ ] STAGING: Neuer Key generiert
  - [ ] STAGING: Key deployt, Web-Search getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-012 (Resend Keys)**
  - [ ] STAGING: Neuer Key generiert
  - [ ] STAGING: Key deployt, E-Mail-Versand getestet
  - [ ] Ergebnis: _______________

- [ ] **SEC-015 (HERMES_WEBUI_PASSWORD)**
  - [ ] STAGING: Neues Passwort generiert
  - [ ] STAGING: Passwort deployt, WebUI-Login getestet
  - [ ] Ergebnis: _______________

### Testrotation Fazit

- [ ] Alle Testrotationen erfolgreich abgeschlossen
- [ ] Keine unerwarteten Fehler
- [ ] Durchschnittliche Rotationsdauer: _________ Minuten pro Secret
- [ ] Geschätzte Gesamtdauer Live-Rotation: _________ Minuten
- [ ] **GO für Live-Rotation: [ ] Ja [ ] Nein**

---

## 3. Live-Rotation (T-0h)

> Jetzt in PRODUCTION. Secret für Secret rotieren.
> Nach jeder Rotation: Testen, bevor das nächste Secret rotiert wird.

### Phase 1: Niedrig-Risiko Secrets (Start)

| Reihenfolge | Secret-ID | Name | Erledigt | Status |
|:------------|:----------|:-----|:---------|:-------|
| 1 | SEC-017 | TLS/SSL Certificates | [ ] | |
| 2 | SEC-012 | Resend Keys | [ ] | |
| 3 | SEC-005 | YOU_API_KEY | [ ] | |
| 4 | SEC-015 | HERMES_WEBUI_PASSWORD | [ ] | |

### Phase 2: Mittel-Risiko Secrets

| Reihenfolge | Secret-ID | Name | Erledigt | Status |
|:------------|:----------|:-----|:---------|:-------|
| 5 | SEC-013 | Webhook Tokens | [ ] | |
| 6 | SEC-014 | NEXIFY_AUTO_CHAT_INTERNAL_TOKEN | [ ] | |
| 7 | SEC-006 | AGENTMEMORY_SECRET | [ ] | |
| 8 | SEC-007 | CUSTOM_API_KEY (Hermes) | [ ] | |
| 9 | SEC-004 | NEXIFY_ROUTER_API_KEY | [ ] | |
| 10 | SEC-010 | Cloudflare API Tokens | [ ] | |

### Phase 3: Hoch-Risiko Secrets

| Reihenfolge | Secret-ID | Name | Erledigt | Status |
|:------------|:----------|:-----|:---------|:-------|
| 11 | SEC-009 | SSH-Private-Keys | [ ] | |
| 12 | SEC-002 | ANTHROPIC_API_KEY | [ ] | |
| 13 | SEC-001 | ANTHROPIC_AUTH_TOKEN | [ ] | |
| 14 | SEC-003 | DEEPSEEK_API_KEY | [ ] | |
| 15 | SEC-008 | OPENAI_API_KEY | [ ] | |
| 16 | SEC-011 | Supabase Keys | [ ] | |

### Phase 4: Abschluss

| Reihenfolge | Secret-ID | Name | Erledigt | Status |
|:------------|:----------|:-----|:---------|:-------|
| 17 | SEC-016 | .env-Dateien entfernen | [ ] | |

---

## 4. Verifikation

### Nach jeder Rotation

- [ ] Funktionstest für das rotierte Secret bestanden
- [ ] Integrationstest für abhängige Systeme bestanden
- [ ] Log-Check: Keine Auth-Fehler seit Rotation
- [ ] Audit-Log: Rotation ist sichtbar
- [ ] Zeit notiert: _______ Minuten für diese Rotation

### Gesamtverifikation

- [ ] **Alle Systeme laufen** (nach vollständiger Rotation)
  - [ ] NeXify Router
  - [ ] Claude Code CLI
  - [ ] DeepSeek-Module
  - [ ] Hermes-Agent
  - [ ] Auto Chat Service
  - [ ] Agent Memory Service
  - [ ] Web-Search
  - [ ] E-Mail-Versand
  - [ ] Webhooks
  - [ ] SSH-Zugriff
  - [ ] DNS/CDN (Cloudflare)
  - [ ] Datenbank (Supabase)

- [ ] **Keine Auth-Fehler in Logs** der letzten 30 Minuten
- [ ] **Monitoring zeigt keine Alarme**
- [ ] **Infisical-Instanz läuft stabil** (CPU, Memory, DB)
- [ ] **Audit-Logs vollständig** (jede Rotation dokumentiert)

---

## 5. Deaktivierung alter Secrets

### Externe Dashboards

| System | Aktion | Erledigt |
|:-------|:-------|:---------|
| Anthropic Console | Alten Token revoken | [ ] |
| OpenAI Dashboard | Alten Key revoken | [ ] |
| DeepSeek Dashboard | Alten Key revoken | [ ] |
| Supabase Dashboard | Alte Keys revoken (service_role + anon) | [ ] |
| Cloudflare Dashboard | Alte Tokens revoken | [ ] |
| Resend Dashboard | Alte Keys revoken | [ ] |
| You.com Dashboard | Alten Key revoken | [ ] |
| SSH-Server | Alte Public Keys entfernen | [ ] |

### Infisical

- [ ] Alte Secrets in Infisical deaktiviert (nicht gelöscht!)
- [ ] 24h-Timer gestartet für endgültige Löschung

### Lokale Systeme

- [ ] `.env`-Dateien aus Produktion gelöscht
- [ ] CI/CD-Variablen gelöscht (GitHub Secrets, etc.)
- [ ] Lokale Config-Dateien gesäubert
- [ ] Git-Verlauf bereinigt (BFG Repo-Cleaner)

---

## 6. Monitoring (Post-Livegang)

### Erste 24 Stunden

- [ ] Stündlicher Check: Alle Dienste erreichbar?
- [ ] Stündlicher Check: Infisical-Instanz gesund?
- [ ] Stündlicher Check: Keine Auth-Fehler in Logs?
- [ ] Alerting aktiv (Pager/Slack bei Fehlern)

### Erste 7 Tage

- [ ] Täglicher Audit-Log-Report
- [ ] Täglicher Performance-Report (Infisical)
- [ ] Täglicher Funktionstest (kritische Pfade)

### Nach 30 Tagen

- [ ] Review aller Rotationen
- [ ] Optimierungspotenzial identifizieren
- [ ] Rotationsintervall-Anpassungen prüfen
- [ ] Break-Glass-Ereignisse reviewen
- [ ] Policy-Update (falls nötig)

---

## 7. Abschluss-Dokumentation

### Erfolgskriterien

- [ ] 100% aller Secrets frisch rotiert
- [ ] 0 Secrets älter als 48h zum Zeitpunkt des Livegangs
- [ ] 0 Auth-Fehler in Logs
- [ ] Alle externen Keys revoken/erneuert
- [ ] Alle `.env`-Dateien aus Produktion entfernt
- [ ] Git-Verlauf bereinigt
- [ ] Audit-Logs vollständig
- [ ] Backup erstellt (Post-Rotation)

### Abschlusserklärung

```text
Hiermit bestätige ich, dass die finale Secret-Rotation vor Livegang
vollständig und erfolgreich durchgeführt wurde.

Datum: _______________
Uhrzeit: _______________
Rotations-Team:
  - ___________________
  - ___________________

CTO-Freigabe:
  - ___________________
```

---

**Checkliste erstellt von:** NeXify Security Engineering  
**Letzte Aktualisierung:** 2026-06-11
