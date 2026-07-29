# Repo-Sync-Strategie: GitHub ↔ VPS GitLab ↔ Workspace

**Stand:** 2026-07-24T12:33+0200 (DE/Berlin)
**Repos:** GitHub `nexifyai-dev/nexify-agentur-plattform` ←→ VPS GitLab (lokal)

## Architektur

```
GitHub (Source of Truth)
    │
    ├── GitHub Actions: CI (lint, test, TS check)
    ├── GitHub Actions: mirror-to-gitlab (push on main)
    │
    ▼
VPS GitLab (lokal, srv1243952)
    │
    ├── GitLab CI: validate → test → deploy:vps
    ├── Deploy-Pfad: /opt/nexifyai-cloud
    │
    ▼
VPS Workspace /workspace/nexify/
    │
    ├── 00_master, 01_agenten_seele, 02_governance, ...
    └── rsync-basiert mit Repo (siehe scripts/sync-workspace-to-vps.sh)
```

## 1. GitHub → VPS GitLab Mirror

**Richtung:** GitHub (Push) → VPS GitLab (Pull via Mirror)

**Methode:** GitHub Actions triggert bei jedem Push auf `main` oder `develop`
einen Branch-/Tag-Sync (`refs/heads/*`, `refs/tags/*`) auf den VPS-GitLab-Remote.
Fehlende Credentials oder Push-Fehler lassen den Workflow hart fehlschlagen.

**Voraussetzung:** VPS GitLab Credentials als GitHub Secrets:
- `VPS_GITLAB_URL` — `https://gitlab.nexifyai.cloud/nexifyai_group/nexifyai.git`
- `VPS_GITLAB_USERNAME` — GitLab Username/Token-Name
- `VPS_GITLAB_TOKEN` — Personal Access Token (write_repository)

**Workflow:** `.github/workflows/mirror-to-gitlab.yml`

### Cursor MCP (GitLab OSS)

Self-hosted GitLab wird über MCP `gitlab-oss` angebunden (`@zereight/mcp-gitlab` → `https://gitlab.nexifyai.cloud/api/v4`). Setup: `deploy/mcp/gitlab-oss/README.md`.

## 2. VPS Workspace ↔ Repo Sync

**Problem:** `/workspace/nexify/` auf dem VPS enthält Dateien, die nicht im Repo sind
(z.B. Runtime-Outputs, Logs, temporäre Build-Artefakte).

**Lösung:**
- Repo `nexify/` = kanonische Quelle für versionierte Configs
- VPS `/workspace/nexify/` = Runtime-Kopie + unversionierte Outputs
- Sync via `scripts/sync-workspace-to-vps.sh`

**Sync-Richtung:**
- **Repo → VPS:** `rsync -az --delete nexify/ root@VPS:/workspace/nexify/` (nach PR-Merge)
- **VPS → Repo:** Nur manuell, nach Review (kein automatischer Pull)

## 3. Content-Klassifikation

| Verzeichnis | Quelle | Sync-Richtung |
|-------------|--------|---------------|
| `00_master/` | VPS (manuell erstellt) | VPS → Repo (manuell) |
| `01_agenten_seele/` | VPS | VPS → Repo (manuell) |
| `02_governance/` | VPS | VPS → Repo (manuell) |
| `02_regelwerke/` | VPS | VPS → Repo (manuell) |
| `03_checklisten/` | VPS | VPS → Repo (manuell) |
| `03_security/` | VPS | VPS → Repo (manuell) |
| `04_evidence/` | VPS | VPS → Repo (manuell) |
| `04_normen/` | VPS | VPS → Repo (manuell) |
| `04_register/` | VPS | VPS → Repo (manuell) |
| `05_skills/` | VPS | VPS → Repo (manuell) |
| `06_optimization/` | VPS | VPS → Repo (manuell) |
| `07_architecture/` | VPS | VPS → Repo (manuell, colon-files excluded) |
| `workspace/` | VPS (Runtime) | Niemals syncen |

## 4. GitLab CI Pipeline

Die `.gitlab-ci.yml` läuft auf dem VPS GitLab Runner:
- **validate:** flake8, AST-Syntax-Check
- **test:** pytest
- **deploy:vps:** Git-Pull in `/opt/nexifyai-cloud`, Docker Compose up, Health-Check

Trigger: `main` Branch + Merge Requests.

## 5. Notfall-Wiederherstellung

```bash
# VPS → GitHub (falls GitHub Repo verloren)
git clone --mirror https://gitlab.nexifyai.cloud/nexifyai_group/nexifyai.git
cd nexify-agentur-plattform.git
git push --prune https://github.com/nexifyai-dev/nexify-agentur-plattform.git \
  'refs/heads/*:refs/heads/*' 'refs/tags/*:refs/tags/*'

# GitHub → VPS (falls VPS GitLab neu aufgesetzt)
# Via mirror-to-gitlab.yml Workflow oder manuell:
git push --prune https://gitlab.nexifyai.cloud/nexifyai_group/nexifyai.git \
  'refs/heads/*:refs/heads/*' 'refs/tags/*:refs/tags/*'
```
