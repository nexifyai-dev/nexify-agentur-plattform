# Phase 4: Paperclip/ai-team Runtime Mapping — CEO-Fail-Runs Analyse

**Datum**: 2026-06-22  
**Container**: `paperclip-krv8-paperclip-1`  
**Image**: `ghcr.io/hostinger/hvps-paperclip:latest` (vom Hostinger VPS Docker Compose Catalog)  
**Status**: Running (up 4h), aber **funktional defekt**  

---

## 1. Container-Tiefenanalyse

### Container-Config
| Property | Wert |
|----------|------|
| User | `node` (uid=1000) |
| Entrypoint | `/bin/bash /entrypoint.sh` |
| WorkingDir | `/paperclip` |
| Node.js | v24.16.0 |
| Port | 3100 (mapped auf Host 0.0.0.0:49916) |
| Deployment | `authenticated` mode, `private` exposure |
| PUBLIC_URL | `http://localhost:3100` |

### Netzwerk
- **2 Netzwerke**:
  - `hermes-webui-nexify_default` → IP `172.16.3.2/24` (Gateway: 172.16.3.1)
  - `paperclip-krv8_default` → IP `172.16.10.2/24` (Gateway: 172.16.10.1)
- Docker DNS-Namen: `paperclip-krv8-paperclip-1`, `26d539b86bc0`

### Mounts
```json
[
  {
    "Type": "bind",
    "Source": "/docker/paperclip-krv8/data",
    "Destination": "/paperclip",
    "Mode": "rw"
  },
  {
    "Type": "bind",
    "Source": "/var/run/docker.sock",
    "Destination": "/var/run/docker.sock",
    "Mode": "ro"
  }
]
```

### ❌ KRITISCHE ERKENNTNIS: Mount-Source existiert NICHT
```bash
$ ls -la /docker/paperclip-krv8/
ls: cannot access '/docker/paperclip-krv8/': No such file or directory
```
Der Host-Pfad `/docker/paperclip-krv8/data` für den Bind-Mount existiert **nicht**. Docker erstellt dann einen leeren, read-only-artigen Mount:
```bash
$ touch /paperclip/test123
touch: cannot touch '/paperclip/test123': No such file or directory
```
Der `/paperclip`-Ordner im Container ist **leer und nicht beschreibbar**.

### Entrypoint-Skript (vollständig analysiert)
Das Entrypoint-Skript `/entrypoint.sh` macht:
1. `sudo chown -R node:node ${PAPERCLIP_HOME}` — Permissions fixen
2. OPENAI_API_KEY → CODEX_API_KEY Mapping
3. Config-Check: `[ ! -f "$CONFIG" ] && BOOTSTRAP_REQUIRED=1`
4. **BOOTSTRAP** (wenn Config fehlt):
   - Startet `paperclipai onboard --yes --bind lan --run &` im Hintergrund
   - Wartet auf Health-Endpoint (`curl http://localhost:3100/api/health`)
   - Erstellt Admin-User via `api/auth/sign-up/email` + `api/auth/sign-in/email`
   - Führt `paperclipai auth bootstrap-ceo --force` aus
   - Deaktiviert Sign-Up in Config
5. UI-Modifikation: Signup-Button verstecken
6. **Stale PID-Check**: Prüft `/paperclip/instances/default/db/postmaster.pid`
7. `paperclipai run` — Startet den Server (Node.js, embedded Postgres)

---

## 2. CEO-Fail-Chain Analyse

### Root Cause: Embedded PostgreSQL nicht verfügbar

**Architektur**: Paperclip verwendet ein **embedded PostgreSQL** (`@embedded-postgres` npm package), das auf `127.0.0.1:54329` lauscht und Daten in `/paperclip/instances/default/db/` speichert.

**Fail-Kette**:
```
1. Container startet → Entrypoint ausgeführt
2. Bind-Mount /paperclip ist leer + nicht beschreibbar
   → Kein config.json vorhanden
   → BOOTSTRAP_REQUIRED=1
3. Bootstrap versucht embedded Postgres zu starten
   → Scheitert weil /paperclip nicht beschreibbar
   → Postgres kann Datenbank nicht initialisieren
4. Server startet trotzdem (HTTP-Server + UI)
   → Alle DB-Queries schlagen fehl:
   → connect ECONNREFUSED 127.0.0.1:54329
5. CEO-Run-Request kommt an:
   → Paperclip versucht heartbeat_runs-Tabelle zu schreiben
   → DB-Connection fehlschlägt
   → Run failt nach ~1 Sekunde
```

### Log-Evidence
Der Container-Log ist geflutet mit (alle 30 Sekunden wiederholend):
```
[HH:MM:35] ERROR: heartbeat timer tick failed
  → connect ECONNREFUSED 127.0.0.1:54329

[HH:MM:05] ERROR: routine scheduler tick failed
  → connect ECONNREFUSED 127.0.0.1:54329

[HH:MM:35] ERROR: periodic heartbeat recovery failed
  → connect ECONNREFUSED 127.0.0.1:54329

[HH:MM:05] ERROR: scheduler tick error (plugin-job-scheduler)
  → Failed query: select ... from plugin_jobs
```

**Betroffene Services** (alle hängen an PostgreSQL 54329):
| Service | Funktion |
|---------|----------|
| `heartbeat.tickTimers` | Agent-Herzschlag-Überwachung |
| `heartbeat.reapOrphanedRuns` | Aufräumen verwaister Runs |
| `routines.tickScheduledTriggers` | Cron-Trigger für Routinen |
| `plugin-job-scheduler` | Plugin-Job-Ausführung |

### Warum genau 1 Sekunde?
Das Dashboard zeigt CEO-Fail nach ~1s, weil:
1. CEO-Run triggert API-Request an Paperclip
2. Paperclip versucht DB-Write für `heartbeat_runs`
3. `connect ECONNREFUSED 127.0.0.1:54329` — sofortiger Fehler
4. Request wird abgebrochen → UI zeigt Fail

### Ist 401 von nexify-ceo die Ursache?
**Nein.** Die Fehlerkette ist **nicht** auth-bedingt. Es gibt keine 401-Fehler in den Logs. Der Fehler ist **ausschließlich** die fehlende PostgreSQL-Datenbank. Selbst wenn nexify-ceo korrekt authentifiziert wäre, würden CEO-Runs fehlschlagen, weil die DB nicht verfügbar ist.

---

## 3. Cloudflare Tunnel-Route

**Aktiv**: `cloudflared-paperclip.service` — läuft seit 3h 30min

**Konfiguration** (`/root/.cloudflared/paperclip-config.yml`):
```yaml
tunnel: paperclip-ai-team
ingress:
  - hostname: ai-team.nexifyai.cloud
    service: http://localhost:49916
  - service: http_status:404
```

**Route**: `https://ai-team.nexifyai.cloud` → Cloudflare Tunnel → `http://localhost:49916` → Container Port 3100

**HTTP-Check**: `https://ai-team.nexifyai.cloud/NEX/dashboard` → **HTTP 200** (0.066s)

**Tunnel-Status**: Stabil, aber der Service dahinter ist funktional defekt (keine DB).

---

## 4. Docker Manager Anomalie

**Warum zeigt Docker Manager `0 container / Created`?**
- Das Paperclip-Container wurde **nicht** mit docker-compose erstellt (keine `com.docker.compose.project` Labels)
- Es wurde vermutlich über das **Hostinger VPS Panel** deployed (Image stammt aus `ghcr.io/hostinger/hvps-paperclip`)
- Der Docker Manager auf dem Hermes-WebUI-Server verwendet eine **separate Docker-Socket-Verbindung** oder filtert nach docker-compose-Projekten
- Daher wird der Container zwar auf dem Host gesehen `(docker ps zeigt ihn)`, aber nicht vom Docker Manager, der nur compose-Projekte listet

**Weitere Panel-Instanzen?** Kein Portainer, Coolify oder anderes Panel gefunden. Die Verwaltung läuft über Hostinger-eigene Tools.

---

## 5. Runtime-Komponenten-Mapping

### Paperclip benötigt für Vollbetrieb:
| Komponente | Status | Bemerkung |
|------------|--------|-----------|
| **PostgreSQL (embedded)** | ❌ NICHT LÄUFT | Auf 127.0.0.1:54329 — kein Prozess, kein Data-Dir |
| **LLM-Zugriff** | ⚠️ Unklar | `OPENAI_API_KEY` nicht gesetzt; evtl. über Codex/9Router |
| **Docker-Socket** | ✅ Read-only | Für Sandbox-Agenten gedacht |
| **Datei-Store** | ❌ Defekt | `/paperclip` ist leer und nicht beschreibbar |
| **HTTP-Server/UI** | ✅ Läuft | Port 3100, UI erreichbar, aber ohne DB-Funktionalität |
| **Auth-System** | ❌ Nicht initialisiert | Kein User bootstrapped, kein CEO eingerichtet |

### Verbindung zu Hermes/9Router:
- **9Router** läuft auf `127.0.0.1:20128` — für Nexify-Main/Work-Kommunikation
- Paperclip ist im `hermes-webui-nexify_default` Netzwerk (könnte 9Router erreichen)
- **Keine sichtbare Integration** zwischen Paperclip und 9Router aktuell
- Die `PAPERCLIP_AUTH_BASE_URL_MODE=***` in den Env-Vars deutet auf eine geplante Auth-Integration hin, die aber nicht konfiguriert ist

---

## 6. Vollständige Fail-Chain Dokumentation

```
User klickt "CEO ausführen" im Dashboard
  ↓
HTTP POST an ai-team.nexifyai.cloud/api/...
  ↓
Cloudflare Tunnel leitet an localhost:49916 weiter
  ↓
Paperclip Container (Port 3100) empfängt Request
  ↓
Paperclip versucht DB-Query (heartbeat_runs INSERT)
  ↓
DB-Client versucht connect zu 127.0.0.1:54329
  ↓
connect ECONNREFUSED — embedded PostgreSQL läuft nicht
  ↓
DrizzleQueryError: "Failed query"
  ↓
Run schlägt fehl → UI zeigt "CEO-Fail" nach ~1 Sekunde
  ↓
Alle 30 Sekunden: Heartbeat/Scheduler/Routine-Timer scheitern erneut
```

### Kein 401 Problem!
Die Auth-Komponente ist sekundär. Selbst wenn Phase 3 (nexify-ceo Auth) gelöst wäre, würde Paperclip weiterhin CEO-Fails produzieren, weil das Fundament (PostgreSQL) fehlt.

---

## 7. Nächste Schritte

### Sofortmassnahmen:
1. **Paperclip bleibt gesperrt für Produktion** — kein aktiver Betrieb möglich
2. **Daten-Verzeichnis anlegen**: `mkdir -p /docker/paperclip-krv8/data && chown -R 1000:1000 /docker/paperclip-krv8/data`
3. **Container neustarten** (docker-compose restart oder docker restart)
4. **Bootstrapping abwarten** (embedded PostgreSQL initialisiert sich beim Start)
5. **Logs prüfen** auf erfolgreiche DB-Initialisierung

### Nach erfolgreichem Bootstrap:
6. **Erst dann Phase 3 Auth-Test** — CEO-Login mit nexify-ceo prüfen
7. **CEO-Run testen** — sollte jetzt funktionieren
8. **Paperclip-Integration mit 9Router prüfen** — falls LLM-Routing nötig

### Voraussetzungen für Produktionsfreigabe:
- ✅ Daten-Persistenz: Bind-Mount muss existieren + beschreibbar sein
- ✅ Embedded PostgreSQL: Muss auf 54329 starten
- ✅ Bootstrap: Admin-User + CEO-Rolle müssen angelegt sein
- ✅ UI: Dashboard muss Daten laden können
- ❌ Auth: nexify-ceo Integration (Phase 3)
- ❌ LLM: 9Router-Anbindung für LLM-Calls

---

## 8. Zusammenfassung

| Aspekt | Status |
|--------|--------|
| Container läuft | ✅ Ja |
| UI erreichbar | ✅ HTTP 200 |
| Cloudflare Tunnel | ✅ Aktiv |
| **PostgreSQL (embedded)** | **❌ ECONNREFUSED 127.0.0.1:54329** |
| Bind-Mount existiert | **❌ /docker/paperclip-krv8/data fehlt** |
| Datenverzeichnis beschreibbar | ❌ Nein |
| Bootstrap durchgeführt | ❌ Nie erfolgt |
| CEO-Runs möglich | ❌ Schon ohne DB unmöglich |
| Auth-Problem (401) | ❌ Nicht die Ursache |
| **Produktionsbereit** | **❌ Nein** |

**Fazit**: Der Paperclip-Container ist durch die fehlende Daten-Persistenz (Bind-Mount existiert nicht auf dem Host) vollständig funktionsunfähig. Ohne Datenbank können keine CEO-Runs, Agent-Heartbeats, Scheduler oder irgendeine datenbankgestützte Operation durchgeführt werden. Die nächsten Schritte müssen zuerst das Datenverzeichnis anlegen und den Container neustarten, BEVOR Auth-Probleme (Phase 3) adressiert werden.
