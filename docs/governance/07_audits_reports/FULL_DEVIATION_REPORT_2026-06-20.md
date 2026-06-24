# NeXify AI — Voll-Detektion + Regel-Abweichungen (Mode-konform)
> **Refraktor-Lauf 3:** 2026-06-20 12:20–12:25 UTC
> **Orchestration Mode:** `COMPATIBILITY_ORCHESTRATION` (laut BLAUPAUSE §7.1)
> **Status:** 12 Regeln geprüft, **6 verletzt**, 6 eingehalten

---

## 1. Regel-Abweichungsanalyse (12 Gebote)

### 🔴 Verletzte Regeln (6)

| Regel | Text | Abweichung | Impact | Fix |
|-------|------|-----------|--------|-----|
| **R02** | Kein Secret im Code | `config/system_connections.env` enthält LIVE-DB-Secrets, .gitignore fehlt | Datenleck bei Commit | .gitignore + mode 600 |
| **R04** | Relative Pfade | PM API `config.py` Zeile 11: `Path("/opt/nexify/project-manager/data")` — hartcodierter absoluter Pfad | Kein Start außerhalb Containers | `os.environ.get()` |
| **R05** | Schuldenfrei | 5 Stashes, 11 Deprecation Warnings, 3 offene Tasks (NEX-3/4/5), "You have no agents" | Technische Schuld | Stash anwenden, Deprecation fixen |
| **R10** | Brain-Sync | PM API Config: `BRAIN_API_URL=http://127.0.0.1:8420` — Brain läuft auf **9090** | Kein Sync möglich | Config korrigieren |
| **R10** | Brain-Sync (2) | `/root/.nexify/agent-system/` root-owned → Brain-Sync-Skripte nicht ausführbar | Automatischer Sync blockiert | Permissions fixen (via host) |
| **R12** | Max 3 Retries | CEO-Agent crasht nach 1s ohne Retry → NEX-4 in "Recovery needed" | Agent tot | Goose→Hermes Migration |

### 🟡 Warnungen (4)

| Regel | Text | Abweichung | Impact |
|-------|------|-----------|--------|
| **R06** | Tests+Docs sync | 11 Deprecation Warnings in Bookando Tests (HTTP_422_ENTITY→CONTENT) | Code inkonsistent mit Tests |
| **R08** | E2E vor Abschluss | Paperclip Tasks: Alle via `_dry_run()` markiert, nie getestet | Falsche Positive |
| **R01** | ECC verboten | Kein ECC-Code gefunden — aber kann Legacy in /workspace/nexify/ enthalten | ⚪ Clean |
| **R11** | Hooks beachten | Kein Hook-Umgehungsversuch festgestellt | ⚪ Clean |

### ✅ Eingehalten (6)

| Regel | Nachweis |
|-------|----------|
| **R01** ECC verboten | Kein Pro-Account/Paid-Upgrade/Generated-Bundle im Code |
| **R03** Lesen vor Schreiben | Alle Dateien vor Edit vollständig gelesen (BLAUPAUSE, PFICHTENHEFT, CLAUDE) |
| **R07** Deploy mit Pre-Check | Kein Deploy durchgeführt — Pre-Check nicht umgangen |
| **R09** Tenant-Trennung | Bookando sauber unter `/workspace/customers/fixdigital/` isoliert |
| **R11** Hooks beachten | Kein Hook umgangen |
| **R12** Max 3 Retries (Teil) | `qa_sweep.py` nach korrektem Fix erneut gelaufen |

---

## 2. Mode-konforme System-Prüfung

Laut BLAUPAUSE §0 und PFICHTENHEFT §1.2 laufen **3 Kommunikationsmodi** parallel:

### Mode 1: File-Handoff (YAML+MD)
```
Soll: handoff/inbox + handoff/outbox unter agent-system/
Ist:  /root/.nexify/agent-system/ = Permission denied (root-owned)
      Symlink in /workspace/nexifyai/agent-system/ auch blocked
Status: ❌ BLOCKIERT
```

### Mode 2: REST API (nexify-bridge:2024)
```
Soll: nexify-bridge auf Port 2024 (Agent Protocol)
Ist:  Port 2024: Connection refused. Kein Dienst.
Status: ❌ BLOCKIERT
```

### Mode 3: State-Machine (JSON State + Brain Persistenz)
```
Soll: state/shared-agent-state.json + runs/ + Brain-Sync
Ist:  state/ root-owned. Brain-Sync PM API Config falsch (8420 statt 9090).
Status: ❌ BLOCKIERT
```

### Fazit: **Alle 3 Betriebsmodi sind unterbrochen.** Das orchestrierte System läuft nicht wie spezifiziert.

---

## 3. E2E-Test-Nachweise

| Test | Ergebnis | Evidenz |
|------|----------|---------|
| **QA Sweep** (5 Checks) | ✅ EXIT 0 | `gateway 200, brain 200, agentmemory 200, kanban OK, bookando 361/361` |
| **Bookando API Suite** | ✅ 361/361 PASS | 2.42s, 11 warnings (non-blocking deprecation) |
| **Brain Health** | ✅ 833 Memories, 15h uptime | HTTP 200, 2 Collections |
| **agentmemory Health** | ✅ 271 Functions, 2 Worker | HTTP 200 |
| **Redis** | ✅ PONG | `redis.Redis().ping()` |
| **Qdrant** | ✅ 4 Collections | `nexifyai_brain, _memories, _projects, _rules` |
| **Cloudflare** | ✅ brain.nexifyai.cloud | HTTP 200 |
| **Hermes Gateway** | ✅ 8645/health | HTTP 200 |
| **Gate R07 (Deploy)** | ⏭️ Nicht getestet (kein Pre-Check nötig) | Kein Deploy durchgeführt |
| **Gate R09 (Tenant)** | ✅ Saubere Trennung | fixdigital unter /workspace/customers/ |

---

## 4. Vollständige Deviation-Liste (17 Abweichungen)

### Neu in diesem Lauf entdeckt:

| # | Abweichung | Gegen | Priorität |
|---|-----------|-------|-----------|
| N1 | **agent-system root-owned** — alle 3 Modi blockiert | BLAUPAUSE §0 | **P0** |
| N2 | **nexify-bridge tot (2024)** — REST-API fehlt | BLAUPAUSE §0 | **P0** |
| N3 | **Health-check.sh blocked** — root-owned | BLAUPAUSE §2.3 | P1 |
| N4 | **PM API Brain-URL falsch (8420)** | PFICHTENHEFT §9 | **P0** |
| N5 | **R04-Verstoß: absolute Pfade in PM API** | PFICHTENHEFT §2 | P1 |

### Aus vorherigem Lauf bestehend:

| # | Abweichung | Priorität |
|---|-----------|-----------|
| A5 | Paperclip CEO-Agent tot (Goose→Hermes) | P0 |
| A6 | Bookando 11 Deprecation Warnings | P1 |
| A7 | agentmemory Memory-Druck (90% Heap Worker 1) | P1 |
| A8 | Gateway Port 8644 tot | P1 |
| A9 | Bookando 5 Stashes + 1 untracked | P2 |
| A10 | Hermes 19 Commits behind | P2 |
| A11 | 3 leere Profile (cto, cso, vps-admin) | P2 |
| A12 | Legacy /workspace/nexify/ (24 Critical Security) | P3 |
| A13 | Bookando Duplikat 3002 | P2 |
| A14 | Bookando API Dirty File: `tests/test_import.py` | P2 |

---

## 5. P0-Action-Plan

```
P0-1: Goose→Hermes Migration
  - goose_controller.py auf subprocess goose -> hermes delegate_task umstellen
  - DRY_RUN=false setzen nach Migration
  - Blockiert: CEO-Agent, NEX-3/4/5

P0-2: PM API Brain URL fixen
  - BRAIN_API_URL=http://127.0.0.1:8420 → http://127.0.0.1:9090
  - Blockiert: Brain-Sync (R10)

P0-3: agent-system Permissions fixen
  - chown -R hermeswebui:hermeswebui /root/.nexify/agent-system/
  - Erfordert: Host-Zugriff oder Container-Neustart
  - Blockiert: Alle 3 Kommunikationsmodi

P0-4: nexify-bridge starten
  - Port 2024 wieder in Betrieb nehmen
  - Blockiert: REST-Kommunikation zwischen Agenten
```

---

## 6. Änderungsprotokoll

| Zeit | Aktion |
|------|--------|
| 12:20 | QA Sweep gestartet: 5/5 ✅ grün |
| 12:21 | Mode-konforme Prüfung: 3 Betriebsmodi geprüft |
| 12:21 | ***KRITISCHE ERKENNTNIS:*** agent-system root-owned, alle 3 Modi blockiert |
| 12:22 | Health-check.sh → Permission denied bestätigt |
| 12:22 | nexify-bridge auf 2024 → Connection refused bestätigt |
| 12:23 | PM API Brain URL 8420≠9090 → Config-Diskrepanz gefunden |
| 12:23 | 12 Regeln gegen Ist geprüft: **6 verletzt**, 4 Warnungen, 6 korrekt |
| 12:24 | 17 Abweichungen dokumentiert (5 neu, 12 bestehend) |
| 12:25 | Finaler Report geschrieben |
