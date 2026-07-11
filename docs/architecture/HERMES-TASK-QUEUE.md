# Hermes-Task-Queue — Übergabe offener Aufgaben (Stand 11.07.2026)

Übergeben von der Claude-Code-Session an den Hermes-Agent. Jede Aufgabe ist so
beschrieben, dass Hermes sie **eigenständig nach dem GITHUB-PROTOKOLL**
(`docs/architecture/HERMES-GITHUB-WORKFLOW.md`) abarbeiten kann: Kontext →
exakte Schritte → Beweis (Definition of Done) → Risiko/Leitplanke.

Reihenfolge = Priorität. Nach Abschluss: Häkchen setzen, Ergebnis mit Beleg ins
agentmemory schreiben (MEMORY-PROTOKOLL), diese Datei per PR aktualisieren.

**Grundregel für ALLE Aufgaben:** kein „erledigt" ohne Beweis (Log/curl/Statuscode).
Secrets niemals ins Repo. Bei Blockade: Befund + Log dokumentieren, nicht still abbrechen.

---

## T1 — agentmemory-Vollintegration scharf schalten  ⟨VPS⟩

- **Kontext:** Skript + Doku liegen bereits im Repo (PR #9).
- **Schritte:**
  ```bash
  cd /opt/nexifyai-cloud && git pull origin main
  bash infra/scripts/agentmemory-vollintegration.sh          # Audit
  bash infra/scripts/agentmemory-vollintegration.sh --apply  # Fixes + E2E
  ```
- **DoD:** Report unter `/root/nexifyai-reports/agentmemory-*.md` mit
  `$FAIL = 0`; E2E-Block zeigt WRITE ok, smart_search-Read-back ok, Reconnect ≤ 30 s.
  Je ein realer Agenten-Beleg (hermes chat, ein Paperclip-Run, ein Goose-Run mit
  Memory-Zugriff) im Report/agentmemory.
- **Risiko:** gering — read-only Default, Backups vor jedem Fix.

## T2 — Hermes-GitHub-Workflow scharf schalten (Selbst-Enablement)  ⟨VPS⟩

- **Kontext:** Skript + Protokoll im Repo (PR #12). Voraussetzung: fine-grained
  PAT als `GITHUB_TOKEN` in `/etc/nexifyai/secrets.env` (chmod 600).
- **Schritte:**
  ```bash
  cd /opt/nexifyai-cloud && git pull origin main
  bash infra/scripts/hermes-github-setup.sh          # Audit
  bash infra/scripts/hermes-github-setup.sh --apply  # Setup + Roundtrip-Beweis
  ```
- **DoD:** Report zeigt Roundtrip (Push ✓, PR ✓, Close ✓); GITHUB-PROTOKOLL in
  allen `profiles/*/SOUL.md`. Danach ist Hermes selbst PR-/Merge-fähig — ab hier
  bearbeitet er die restlichen Queue-Punkte über echte PRs.
- **Risiko:** Token-Scope strikt (ein Repo, Contents+PR). Bei Leak: revoken,
  neu eintragen, `systemctl restart hermes-gateway`.

## T3 — Lead-Erfassung der Website aktivieren  ⟨Vercel⟩

- **Kontext:** Kontakt-/Angebotsformulare proxien server-seitig ans Backend
  (`lib/backend.ts`), liefern aber ohne `BACKEND_ORIGIN` einen ehrlichen 503
  statt Fake-Erfolg. Backend-Endpunkte existieren (`api.nexifyai.cloud`).
- **Schritte:** Im Vercel-Dashboard (Projekt `website` → Settings → Environment
  Variables) `BACKEND_ORIGIN = https://api.nexifyai.cloud` für Production setzen,
  Redeploy. (Alternativ in `/etc/nexifyai/secrets.env`, falls der Website-
  Container auf dem VPS läuft — dort greift `env_file` aus docker-compose.yml.)
- **DoD:** `curl -sS -X POST https://nexifyai.cloud/api/contact -H 'content-type:
  application/json' -d '{"email":"test@example.com","message":"probe"}'` liefert
  die Backend-Antwort (nicht 503); ein Test-Lead ist im Backend/CRM sichtbar.
- **Risiko:** gering — nur env var. Vorher prüfen, dass `api.nexifyai.cloud` von
  extern 200 auf `/api/health` liefert.

## T4 — nexify-automate.com auf reine 301-Weiterleitung  ⟨Vercel/DNS⟩

- **Kontext:** Domain wird nicht mehr genutzt (Entscheidung 11.07.),
  siehe `docs/architecture/DOMAIN-DECOMMISSION-nexify-automate.md`.
- **Schritte:** Vercel → Projekt `website` → Domains: `nexify-automate.com` und
  `www.nexify-automate.com` von „Serve" auf **Redirect (301) → nexifyai.cloud**.
- **DoD:** `curl -sI https://nexify-automate.com/de` → `301` mit
  `location: https://nexifyai.cloud/de` (nicht 200). Test-Kunde
  `support@nexify-automate.com` auf `@nexifyai.cloud` migriert, Backend-Tests grün.
- **Risiko:** gering. Erst umstellen, wenn kein aktiver Mail-Flow mehr an der
  Domain hängt.

## T5 — Secret-Rotation  ⟨VPS + Dienste⟩  🔴 hohe Priorität, aber Reihenfolge beachten

- **Kontext:** `docs/architecture/SECURITY-INCIDENT-2026-07-11.md`. Werte lagen
  im Klartext in Git (gescrubbt, aber in der Historie noch vorhanden).
- **Schritte (Reihenfolge kritisch):**
  1. `ADMIN_API_TOKEN` / `NEXIFY_CRM_API_TOKEN`: neuen Wert erzeugen, **gleichzeitig**
     in Backend-`.env` UND `/root/.hermes/.env` setzen (sonst bricht der
     `nexify-crm`-Skill), Dienste neu laden, mit einem CRM-Call verifizieren.
  2. Admin-Passwort (`mail@nexifyai.cloud`) im Live-Admin ändern.
  3. Test-Kunden-Passwort ändern.
  4. VPS-Root-Passwort ändern; danach `PasswordAuthentication no` in
     `sshd_config` + Key-only-Auth.
- **DoD:** Jeder rotierte Wert einmal erfolgreich verifiziert (Login/CRM-Call);
  Incident-Doku-Checkliste abgehakt mit Beleg.
- **Risiko:** Punkt 1 kann Dienste brechen → beide Dateien atomar ändern, sofort
  testen, Backup vorher.

## T6 — Git-History-Purge der Alt-Secrets  ⟨Repo⟩  ⚠️ NUR mit expliziter Freigabe

- **Kontext:** Secrets sind in der Git-Historie (`memory/test_credentials.md`,
  `memory/VPS_INFRA.md`, `test_reports/iteration_*.json`).
- **Schritte:** `git filter-repo`/BFG auf die betroffenen Pfade, koordinierter
  Force-Push, alle Mitwirkenden informieren.
- **DoD:** Werte nicht mehr in `git log -p` auffindbar; alle Klone neu gezogen.
- **Risiko:** HOCH — schreibt Historie um, invalidiert Klone/Forks. **Erst nach
  ausdrücklichem „ja" des Betreibers.**

## T7 — VPS-Härtung aus den Alt-Audits  ⟨VPS⟩

Aus `docs/architecture/VPS_RUNTIME_INVENTORY.md` + den 06.–22.06.-Audits, seit
Wochen als P0/P1 offen:
- Supabase-Ports auf `0.0.0.0` → auf `127.0.0.1` binden (Tunnel/Reverse-Proxy davor).
- MongoDB-Dublette (systemd vs. Container) auflösen — eine Instanz stilllegen.
- Backups einrichten (Dienst-Volumes + DB-Dumps, Ziel + Zeitplan + Restore-Test).
- Monitoring (Prometheus/Grafana oder leichtgewichtige Alternative) — mind.
  Health-/Ressourcen-Alarme.
- **DoD je Punkt:** vorher/nachher-Beleg (Portscan, `docker ps`, Backup-Restore-
  Probe, Alarm-Test). Jeweils eigener PR nach Protokoll.
- **Risiko:** mittel — Port-/DB-Änderungen können Dienste treffen. Einzeln,
  mit Health-Check nach jedem Schritt.

---

## Fortschritt

| Task | Status | Beleg (Report/PR) |
|---|---|---|
| T1 agentmemory | offen | |
| T2 hermes-github | offen | |
| T3 BACKEND_ORIGIN | offen | |
| T4 Domain-Redirect | offen | |
| T5 Secret-Rotation | offen | |
| T6 History-Purge | **gesperrt** (Freigabe nötig) | |
| T7 VPS-Härtung | offen | |
