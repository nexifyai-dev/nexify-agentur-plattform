# SECRET_MIGRATION_CHECKLIST

**Stand:** 2026-06-11  
**Version:** 1.0  
**Status:** Checkliste

> **WICHTIG:** Diese Checkliste enthält NUR Referenzen/Platzhalter, KEINE Secret-Werte.
> Ziel: Migration von aktuell (Hardcoded / .env) zu zentralem Secret-Management (Infisical).

---

## Prä-Migration: Vorbereitung

### Infrastruktur

- [ ] **Infisical Instanz aufgesetzt**
  - [ ] Docker Compose deployt
  - [ ] Erster Admin-Account angelegt
  - [ ] TLS-Zertifikat konfiguriert
  - [ ] Backup-Strategie eingerichtet (tägliches DB-Backup)
  - [ ] Monitoring eingerichtet (Healthcheck, CPU, Memory)

- [ ] **CLI-Zugriff eingerichtet**
  - [ ] `infisical` CLI auf allen Maschinen installiert
  - [ ] Service-Tokens für Agenten erstellt
  - [ ] Service-Tokens für CI/CD erstellt

- [ ] **Umgebungen angelegt**
  - [ ] `dev` – Entwicklungsumgebung
  - [ ] `staging` – Staging-Umgebung
  - [ ] `prod` – Produktionsumgebung

### Organisation

- [ ] **Rollen angelegt**
  - [ ] `admin` – Vollzugriff (Security-Team)
  - [ ] `agent` – Read-only für Agenten
  - [ ] `deploy` – Read/Write für CI/CD
  - [ ] `viewer` – Read-only Metadaten

- [ ] **Berechtigungsmatrix erstellt** (siehe `SECRET_ACCESS_POLICY.md`)

- [ ] **Backup der aktuellen Secrets erstellt**
  - [ ] Alle `.env`-Dateien in einem verschlüsselten Archiv gesichert
  - [ ] CI/CD-Variablen exportiert (GitHub Secrets, etc.)
  - [ ] Lokale Konfigurationsdateien gesichert

---

## Phase 1: Secrets in Infisical anlegen (DEV)

### SEC-001 – ANTHROPIC_AUTH_TOKEN

- [ ] Secret in Infisical (DEV) angelegt: `SEC-001`
- [ ] Wert aus aktuellem Speicher referenziert (KEIN Hardcoding im Skript)
- [ ] Umgebungsvariablen: `ANTHROPIC_AUTH_TOKEN`
- [ ] Berechtigung: Claude Code, DeepSeek (read)
- [ ] **Test:** `infisical run -- Claude Code CLI funktioniert`

### SEC-002 – ANTHROPIC_API_KEY

- [ ] Secret in Infisical (DEV) angelegt: `SEC-002`
- [ ] Wert referenziert
- [ ] Umgebungsvariablen: `ANTHROPIC_API_KEY`
- [ ] Berechtigung: NeXify Router (read)
- [ ] **Test:** Router-Call zu Anthropic funktioniert

### SEC-003 – DEEPSEEK_API_KEY

- [ ] Secret in Infisical (DEV) angelegt: `SEC-003`
- [ ] Wert referenziert
- [ ] Berechtigung: NeXify Router, DeepSeek-Module (read)
- [ ] **Test:** Router-Call zu DeepSeek funktioniert

### SEC-004 – NEXIFY_ROUTER_API_KEY

- [ ] Secret in Infisical (DEV) angelegt: `SEC-004`
- [ ] Wert referenziert
- [ ] Berechtigung: Alle Agenten, CI/CD (read)
- [ ] **Test:** Agenten erreichen Router

### SEC-005 – YOU_API_KEY

- [ ] Secret in Infisical (DEV) angelegt: `SEC-005`
- [ ] Wert referenziert
- [ ] Berechtigung: NeXify Router (read)
- [ ] **Test:** Web-Search funktioniert

### SEC-006 – AGENTMEMORY_SECRET

- [ ] Secret in Infisical (DEV) angelegt: `SEC-006`
- [ ] Wert referenziert
- [ ] Berechtigung: Agent Memory Service (read)
- [ ] **Test:** Memory-Zugriff funktioniert

### SEC-007 – CUSTOM_API_KEY (Hermes)

- [ ] Secret in Infisical (DEV) angelegt: `SEC-007`
- [ ] Wert referenziert
- [ ] Berechtigung: Hermes-Agent (read)
- [ ] **Test:** Hermes-Funktionen funktionieren

### SEC-008 – OPENAI_API_KEY

- [ ] Secret in Infisical (DEV) angelegt: `SEC-008`
- [ ] Wert referenziert
- [ ] Berechtigung: NeXify Router (read)
- [ ] **Test:** Router-Call zu OpenAI funktioniert

### SEC-009 – SSH-Private-Keys

- [ ] Secrets in Infisical (DEV) angelegt: `SEC-009`
- [ ] SSH-Keys als Dateien in Infisical gespeichert
- [ ] Berechtigung: Nur Deployment (read)
- [ ] **Test:** SSH-Verbindung mit Infisical-Key funktioniert

### SEC-010 – Cloudflare API Tokens

- [ ] Secrets in Infisical (DEV) angelegt: `SEC-010`
- [ ] Token referenziert
- [ ] Berechtigung: Deployment (read)
- [ ] **Test:** DNS/CDN-Update funktioniert

### SEC-011 – Supabase Keys

- [ ] Secrets in Infisical (DEV) angelegt: `SEC-011` (anon + service_role getrennt)
- [ ] Keys referenziert
- [ ] Berechtigung: NeXify Router (read anon), Deployment (read service_role)
- [ ] **Test:** DB-Zugriff mit Infisical-Referenz funktioniert

### SEC-012 – Resend Keys

- [ ] Secrets in Infisical (DEV) angelegt: `SEC-012`
- [ ] Keys referenziert
- [ ] Berechtigung: Notification Service (read)
- [ ] **Test:** E-Mail-Versand funktioniert

### SEC-013 – Webhook Tokens

- [ ] Secrets in Infisical (DEV) angelegt: `SEC-013`
- [ ] Tokens referenziert
- [ ] Berechtigung: NeXify Router (read)
- [ ] **Test:** Webhook-Auslösung funktioniert

### SEC-014 – NEXIFY_AUTO_CHAT_INTERNAL_TOKEN

- [ ] Secret in Infisical (DEV) angelegt: `SEC-014`
- [ ] Token referenziert
- [ ] Berechtigung: Auto Chat Service (read)
- [ ] **Test:** Auto Chat funktioniert

### SEC-015 – HERMES_WEBUI_PASSWORD

- [ ] Secret in Infisical (DEV) angelegt: `SEC-015`
- [ ] Passwort referenziert
- [ ] Berechtigung: Hermes WebUI (read)
- [ ] **Test:** WebUI-Login funktioniert

### SEC-017 – TLS/SSL Certificates

- [ ] Secrets in Infisical (DEV) angelegt: `SEC-017`
- [ ] Zertifikate referenziert
- [ ] Berechtigung: Infrastruktur-Team (read)
- [ ] **Test:** HTTPS-Verbindung funktioniert

---

## Phase 2: CI/CD-Integration

### GitHub Actions

- [ ] GitHub Actions mit Infisical verbunden (Service-Token)
- [ ] Deployment-Workflow: `infisical run --command="..."` statt `${{ secrets.X }}`
- [ ] **Test:** CI/CD-Pipeline läuft mit Infisical-Referenzen durch
- [ ] **Rollback:** Alte GitHub Secrets reaktivieren falls nötig

### Docker Compose

- [ ] `docker-compose.yml` auf Infisical-Referenzen umgestellt
  ```yaml
  environment:
    - ANTHROPIC_API_KEY=${INFISICAL_ANTHROPIC_API_KEY}
  ```
- [ ] `.env`-Dateien aus `docker-compose.yml` entfernt
- [ ] **Test:** `docker-compose up` läuft ohne `.env`-Datei
- [ ] **Rollback:** `.env`-Datei wiederherstellen, `docker-compose restart`

---

## Phase 3: Agenten-Konfiguration

### Claude Code

- [ ] `~/.claude/auth.json` durch Infisical-Referenz ersetzt
- [ ] **Test:** Claude Code CLI startet und authentifiziert sich
- [ ] **Rollback:** Alte `auth.json` wiederherstellen

### NeXify Router

- [ ] Router-Konfiguration auf Infisical umgestellt
- [ ] **Test:** Router-Calls zu allen APIs funktionieren
- [ ] **Rollback:** Alte `.env` wiederherstellen, Router neustarten

### Weitere Agenten (DeepSeek, Hermes, Auto Chat)

- [ ] Agenten-Konfiguration auf Infisical umgestellt
- [ ] **Test:** Alle Agenten-Funktionen getestet
- [ ] **Rollback:** Alte Konfiguration wiederherstellen

---

## Phase 4: Produktions-Rollout

### Go/No-Go Kriterien

**Go-Kriterien (alle müssen erfüllt sein):**

- [ ] DEV-Umgebung läuft stabil mit Infisical (≥ 24h)
- [ ] STAGING-Umgebung läuft stabil mit Infisical (≥ 24h)
- [ ] Alle Integrationstests bestanden
- [ ] Backup/Recovery getestet (mind. 1 Restore-Durchlauf)
- [ ] Audit-Logs aktiv und werden korrekt geschrieben
- [ ] Break-Glass-Prozedur getestet (Trockentest)
- [ ] Rotationsplan für CRITICAL Secrets bereit
- [ ] Monitoring für Infisical aktiv
- [ ] Alle Teammitglieder geschult

**No-Go-Kriterien (ein Kriterium reicht für Abbruch):**

- [ ] Infisical-Instanz instabil (Ausfälle, Performance-Probleme)
- [ ] Integrationstests nicht bestanden
- [ ] Backup/Restore nicht getestet
- [ ] Kritischer Sicherheitsmangel gefunden
- [ ] Team nicht ausreichend geschult

### Rollout-Reihenfolge

```
1. TLS/SSL-Zertifikate (SEC-017)      → Niedriges Risiko, schnelles Rollback
2. Resend Keys (SEC-012)              → Niedriges Risiko
3. YOU_API_KEY (SEC-005)              → Niedriges Risiko
4. HERMES_WEBUI_PASSWORD (SEC-015)    → Niedriges Risiko
5. Webhook Tokens (SEC-013)           → Mittleres Risiko
6. NEXIFY_AUTO_CHAT_INTERNAL_TOKEN    → Mittleres Risiko
7. AGENTMEMORY_SECRET (SEC-006)       → Mittleres Risiko
8. CUSTOM_API_KEY Hermes (SEC-007)    → Mittleres Risiko
9. NEXIFY_ROUTER_API_KEY (SEC-004)    → Mittleres Risiko
10. Cloudflare API Tokens (SEC-010)   → Mittleres Risiko
11. SSH-Private-Keys (SEC-009)        → Hohes Risiko
12. ANTHROPIC_API_KEY (SEC-002)       → Hohes Risiko
13. ANTHROPIC_AUTH_TOKEN (SEC-001)    → Hohes Risiko
14. DEEPSEEK_API_KEY (SEC-003)        → Hohes Risiko
15. OPENAI_API_KEY (SEC-008)          → Hohes Risiko
16. Supabase Keys (SEC-011)           → Hohes Risiko
17. .env-Dateien entfernen (SEC-016)  → Letzter Schritt
```

---

## Phase 5: Nachbereitung

- [ ] Alte Secrets aus Code/Config entfernt (Git-Commit)
- [ ] `.env`-Dateien aus allen Produktionsverzeichnissen gelöscht
- [ ] Git-Verlauf von Secrets bereinigt (BFG Repo-Cleaner)
- [ ] Alte CI/CD-Secrets gelöscht
- [ ] Backup der .env-Dateien (verschlüsselt) archiviert
- [ ] Audit-Pfad verifiziert: Alle Secrets jetzt über Infisical bezogen
- [ ] Monitoring-Dashboard eingerichtet
- [ ] Incident-Response-Plan aktualisiert
- [ ] Dokumentation aktualisiert (dieses Dokument abschliessen)

---

## Rollback (Gesamtplan)

Sollte die Migration fehlschlagen oder ein kritischer Fehler auftreten:

```
1. Fehler erkennen (Monitoring/Alert)
2. CI/CD-Pipelines stoppen (keine weiteren Deployments)
3. Letzte stabile .env-Backups wiederherstellen
   $ ./scripts/rollback-env.sh --snapshot <DATUM>
4. Dienste nacheinander neustarten
5. Funktionstest durchführen
6. Root-Cause-Analyse starten
7. Migration erst nach RCA-Abschluss wiederholen
```

---

## Erfolgskriterien

- [ ] 100% der Secrets aus zentralem System bezogen
- [ ] 0 Secrets hardcoded in Code/Config
- [ ] 0 `.env`-Dateien in Produktion
- [ ] Audit-Logs zeigen vollständigen Zugriffspfad
- [ ] Break-Glass getestet und funktionsfähig
- [ ] Backup/Restore getestet und dokumentiert
- [ ] Team geschult und Dokumentation aktuell

---

**Checkliste erstellt von:** NeXify Security Engineering  
**Letzte Aktualisierung:** 2026-06-11
