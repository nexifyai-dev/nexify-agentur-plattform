# DEPRECATED (2026-08-10): GitHub Self-Hosted Runner DEAKTIVIERT — Workflows laufen auf ubuntu-latest oder Host-Timer (website-sync 5min, healthcheck 15min).
# FILE: docs/architecture/GITHUB-RUNNER-VPS.md
# NIR: 26.07.2026 13:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Architektur-Dokumentation GitHub Self-Hosted Runner auf VPS
# WHY: Vollintegration von GitHub Actions mit VPS-Infrastruktur —
#      kein SSH-Tunnel, direkter Docker-Zugang, interne Dienste erreichbar.
# BEST-PRACTICE: Ephemere Runner + Docker-Socket-Mount + GITHUB_PAT statt statischem Token
# PITFALL: V-01: Runner-Token (GITHUB_RUNNER_TOKEN) läuft nach 1h ab — GITHUB_PAT verwenden.
# DEPENDS: Docker, /etc/nexifyai/secrets.env, docker-compose.yml
# DOCS-REF: https://docs.github.com/en/actions/hosting-your-own-runners

# GitHub Self-Hosted Runner — VPS Vollintegration

> **Stand:** 26.07.2026 | **Status:** Aktiv | **Version:** 1.0.0  
> **Owner:** NeXifyAI DevOps  
> **Primärquelle:** `docs/architecture/GITHUB-RUNNER-VPS.md`

---

## 1. Warum Self-Hosted Runner?

| Merkmal | GitHub-hosted (`ubuntu-latest`) | Self-Hosted (`vps, nexifyai`) |
|---------|--------------------------------|-------------------------------|
| Standort | GitHub-Infrastruktur | Unser VPS (gitlab.nexifyai.cloud) |
| Docker-Zugang | Nur innerhalb CI | Echter Docker-Socket — direkte Container-Steuerung |
| Interne Dienste | Nur via SSH-Tunnel | Direkt: LightRAG:9621, AgentMemory:3111, 9Router:20128 |
| Deploy-Mechanismus | `appleboy/ssh-action` + SSH-Key | `docker compose up` direkt |
| Secrets | GitHub-Secrets → SSH-Übertragung | `/etc/nexifyai/secrets.env` lokal |
| Geschwindigkeit | ~3–5 min (SSH + Pull) | ~1–2 min (direkt) |
| Kosten | Inkludiert (bis 2000 min/Monat) | 0 (eigener VPS) |

---

## 2. Architektur-Übersicht

```
GitHub.com (Push/PR/Schedule)
     │
     │ HTTPS — Runner-Polling
     ▼
┌─────────────────────────────────────────────────────────────────┐
│  VPS (gitlab.nexifyai.cloud)                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Docker: nexify-github-runner                             │  │
│  │  Image: Dockerfile.github-runner                         │  │
│  │  Labels: self-hosted, vps, nexifyai, linux, x64          │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  GitHub Actions Runner (entrypoint.sh)            │   │  │
│  │  │  - Registriert sich via GITHUB_PAT               │   │  │
│  │  │  - Wartet auf Jobs von GitHub                    │   │  │
│  │  │  - Führt Workflow-Steps direkt aus               │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  Volumes:                                                 │  │
│  │  - /var/run/docker.sock → Docker-Befehle                 │  │
│  │  - /opt/nexifyai/repos  → schnelle Checkouts             │  │
│  │  - /etc/nexifyai        → Secrets (read-only)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Interne Dienste (direkt erreichbar vom Runner):                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ LightRAG     │  │ AgentMemory  │  │ 9Router              │ │
│  │ :9621        │  │ :3111        │  │ :20128               │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Hermes       │  │ Website      │  │ Webhook              │ │
│  │ :8787        │  │ :3000        │  │ :8644                │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Komponenten

### 3.1 Docker Image (`deploy/docker/Dockerfile.github-runner`)

Basis: `ubuntu:22.04`  
Enthält:
- GitHub Actions Runner (v2.325.0)
- Docker CLI + docker compose plugin (kein Daemon — Socket-Mount)
- pnpm@9 (für Website-Jobs)
- gh CLI (für proaktive PR-Kommentare und Workflow-Dispatch)
- Python 3, Node.js, curl, jq

### 3.2 Entrypoint (`infra/github-runner/entrypoint.sh`)

Ablauf beim Container-Start:
1. Token via `GITHUB_PAT` → GitHub API holen
2. Runner registrieren (`config.sh --replace`)
3. `run.sh` starten (blockiert, wartet auf Jobs)
4. Bei `SIGTERM` (Container-Stop): Runner sauber de-registrieren

### 3.3 Compose-Service (`docker-compose.yml`)

```yaml
github-runner:
  network_mode: host    # voller Zugang zu internen Diensten
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - /opt/nexifyai/repos:/opt/nexifyai/repos
    - /etc/nexifyai:/etc/nexifyai:ro
```

### 3.4 VPS Worker Workflow (`.github/workflows/vps-worker.yml`)

Jobs:
| Job | Trigger | Was |
|-----|---------|-----|
| `quick-ping` | stündlich | 6 kritische Dienste pingen |
| `full-health` | täglich 06:00 | Vollsystem-Health + Evidence |
| `cleanup` | montags 07:00 | Docker Prune + Log-Rotation |
| `lightrag-reindex` | montags 07:00 | Governance-Docs → LightRAG |
| `hermes-sync` | täglich 06:00 | AgentMemory + SharedState sync |
| `runner-renew` | täglich 06:00 | Runner-Container-Health prüfen |
| `governance-audit` | montags 07:00 | §2/§11 Vollprüfung |

### 3.5 Deploy-Workflow (`deploy-vps.yml`)

Primär: `self-hosted` → `docker compose pull + up` direkt auf VPS  
Fallback: `ubuntu-latest` → SSH-Tunnel (deaktiviert, reaktivierbar)

---

## 4. Einrichtung auf dem VPS

### 4.1 Einmalige Voraussetzungen

```bash
# 1. Fine-grained PAT erstellen (GitHub.com → Settings → Developer settings)
#    Scope: Actions (Read & Write), Repository: nexifyai-dev/nexify-agentur-plattform
#    Token in Secrets hinterlegen:
echo 'GITHUB_PAT=github_pat_xxx' >> /etc/nexifyai/secrets.env
echo 'RUNNER_NAME=nexifyai-vps-runner-prod' >> /etc/nexifyai/secrets.env
chmod 600 /etc/nexifyai/secrets.env

# 2. Audit (read-only):
bash infra/scripts/github-runner-setup.sh

# 3. Apply (Runner starten):
bash infra/scripts/github-runner-setup.sh --apply
```

### 4.2 Manuell via Docker Compose

```bash
cd /opt/nexifyai/repos/nexify-agentur-plattform

# Runner bauen + starten
docker compose build github-runner
docker compose up -d github-runner

# Logs prüfen
docker logs -f nexify-github-runner

# Status
docker ps --filter name=nexify-github-runner
```

### 4.3 Verifikation

```bash
# GitHub API: Runner-Liste
curl -H "Authorization: token $GITHUB_PAT" \
  https://api.github.com/repos/nexifyai-dev/nexify-agentur-plattform/actions/runners

# Workflow manuell triggern (VPS-Worker)
gh workflow run vps-worker.yml --field job=quick-ping
```

---

## 5. Token-Management

| Variable | Wo | Zweck |
|----------|----|-------|
| `GITHUB_PAT` | `/etc/nexifyai/secrets.env` | Runner registrieren + API-Calls |
| `GITHUB_RUNNER_TOKEN` | Env (optional) | Direkt, läuft nach 1h ab |
| `RUNNER_NAME` | `/etc/nexifyai/secrets.env` | Runner-Name in GitHub UI |
| `RUNNER_LABELS` | `docker-compose.yml` env | Label-Matching in Workflows |

**Sicherheit:**
- PAT niemals in Git committen
- `/etc/nexifyai/secrets.env` muss `chmod 600` haben
- Runner läuft mit `RUNNER_ALLOW_RUNASROOT=1` im Container

---

## 6. Governance-Integration

- **Automation-Register:** `docs/governance/12_register/automation-control-register-v1.json` — Einträge `AUTO-RUNNER-001..003`
- **Cron-Register:** `docs/governance/12_register/AUTOMATION_CRONREGISTER_V1.md`
- **§11 Monitoring:** VPS Worker läuft täglich 06:00 + stündlich
- **§2 SOLL/IST:** Governance-Audit-Job montags
- **Evidence:** `docs/governance/08_evidence/VPS_HEALTH_*.md`

---

## 7. Proaktive Flows

Der Self-Hosted Runner ermöglicht folgende proaktive Automations:

1. **Push → Sofort-Health-Check:** Bei jedem Merge zu `main` startet `full-health`
2. **Stündlicher Ping:** 6 kritische Dienste werden jede Stunde geprüft
3. **LightRAG Reindex:** Governance-Docs wöchentlich neu indexiert
4. **AgentMemory Sync:** Täglicher Status-Save → Brain kennt Runner-Zustand
5. **Hermes-Dispatch:** Webhook (Port 8644) kann `workflow_dispatch` triggern
6. **Auto-Cleanup:** Wöchentliche Docker- und Log-Bereinigung

---

## 8. Fehler-Szenarien + Rollback

| Szenario | Erkennung | Aktion |
|----------|-----------|--------|
| Runner offline | Job wird nicht gestartet | SSH-Fallback in `deploy-vps.yml` aktivieren |
| Container crashed | `docker ps` zeigt Exit | `docker compose restart github-runner` |
| PAT abgelaufen | Runner de-registriert | Neues PAT in `/etc/nexifyai/secrets.env` |
| Runner-Token Konflikt | Config.sh-Fehler | `--replace` Flag löst Konflikte |
| VPS nicht erreichbar | Alle Jobs scheitern | SSH-Fallback aktivieren |

**Rollback (SSH-Fallback aktivieren):**  
In `.github/workflows/deploy-vps.yml` den `deploy-ssh-fallback`-Job aktivieren:
```yaml
if: |
  (github.event_name == 'push' && github.ref == 'refs/heads/main') ||
  github.event_name == 'workflow_dispatch'
```
