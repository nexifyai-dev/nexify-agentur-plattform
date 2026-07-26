# NeXify Agentur-Plattform

**Enterprise AI Agent Infrastructure for de-DE/nl-NL Markets**

> Vollintegrierte SaaS-Plattform für autonome KI-Agenten mit proprietärem Brain (AgentMemory + LightRAG), dediziertem Router (9Router), GitLab-basierter CI/CD und produktionsreifer Observability.

---

## 🚀 Quick Start

### Voraussetzungen
- Docker 24+ & docker-compose 2.0+
- Node.js 20+ (apps)
- Python 3.10+ (backend)
- Git SSH-Key in GitHub hinterlegt

### Lokal starten (Development)

```bash
git clone git@github.com:nexifyai-dev/nexify-agentur-plattform.git
cd nexify-agentur-plattform

# Backend + Services
docker-compose up -d

# Website App (Next.js)
pnpm --dir apps/website install
pnpm --dir apps/website dev

# Zugriff
# - Website: http://localhost:3000
# - Backend: http://localhost:3100/api
# - LightRAG: http://localhost:9621
```

### Auf VPS deployen

```bash
# Via GitLab CI/CD (recommended)
git push origin main  # triggers .gitlab-ci.yml

# Oder manuell
./deploy/deploy-vps.sh
```

---

## 📁 Projektstruktur

```
nexify-agentur-plattform/
├── apps/                    # Frontend/Produkt-Apps
│   ├── website/            # Public Website (Next.js) → :3000
│   ├── hermes/             # Hermes service/app
│   └── paperclip/          # Paperclip app workspace
├── backend/                # FastAPI Backend
│   ├── app/
│   ├── agents/
│   ├── routers/
│   └── schemas/
├── deploy/                 # Infrastructure-as-Code
│   ├── docker-compose.yml  # Development stack
│   ├── kubernetes/         # K8s manifests (production)
│   └── deploy-vps.sh       # VPS deployment script
├── infra/                  # Infrastructure configs
│   ├── traefik/           # Reverse proxy
│   ├── prometheus/        # Monitoring
│   └── scripts/           # Admin scripts
├── docs/                   # Documentation
│   ├── architecture/      # System design
│   ├── governance/        # Rules & processes (5 levels)
│   └── api/               # API reference
├── memory/                # Brain snapshots
├── fabrik/                # Factory patterns & templates
├── .github/workflows/     # GitHub Actions (CI/CD backup)
├── .gitlab-ci.yml         # GitLab CI/CD (primary)
└── docker-compose.yml     # Root compose (development)
```

---

## 🔧 Konfiguration

### Environment Variables

Kopiere `.env.example` → `.env`:

```bash
cp .env.example .env
# Edit: DEEPSEEK_API_KEY, DATABASE_URL, GITHUB_TOKEN, GITLAB_TOKEN, etc.
```

**Kritische Variablen:**
- `9ROUTER_BASE_URL`: http://127.0.0.1:20128/v1 (Local LLM Router)
- `LIGHTRAG_URL`: http://127.0.0.1:9621 (RAG Engine)
- `AGENTMEMORY_URL`: http://agentmemory.nexifyai.cloud (Brain)
- `GITLAB_TOKEN`: Private token für CI/CD
- `GITHUB_TOKEN`: PAT für GitHub Actions

### Secrets Management

Alle Secrets in `/opt/nexifyai/security/keys/`:

```bash
ls -la /opt/nexifyai/security/keys/
# - gitlab-token.txt
# - github-token.txt
# - deepseek-api-key.txt
# - etc.
```

NIE in `.env` committen. Nutze GitLab CI/CD Secrets.

---

## 🔄 CI/CD Pipeline

### GitHub Actions → GitLab Sync

**File:** `.github/workflows/gitlab-sync.yml`

Automatisch synchronisiert:
- Commits (main, develop)
- Tags (releases)
- Pull Requests → Merge Requests
- Workflows (GitHub Actions → GitLab CI)

**Manuell triggern:**
```bash
git push origin main  # Beide Repos updated
```

### GitLab CI/CD (Primary)

**File:** `.gitlab-ci.yml`

**Stages:**
1. `build` — Docker images bauen (nexifyai-dev Docker Registry)
2. `test` — Jest, pytest, E2E Tests
3. `deploy-staging` — Staging VPS
4. `deploy-production` — Production (manuell approved)

**Logs ansehen:**
```bash
# Local
gitlab-runner verify
gitlab-runner run-single ...

# Via GitLab WebUI
# https://srv1243952.hstgr.cloud:8922/nexifyai-dev/nexify-agentur-plattform/-/pipelines
```

### Deploy auf VPS

**VPS Details:**
- Host: `srv1243952.hstgr.cloud`
- User: `root` (via SSH-Key)
- Deployment Path: `/opt/nexifyai/deployment/nexify-agentur-plattform/`

**Deploy Script:**
```bash
./deploy/deploy-vps.sh [staging|production]
```

**Status prüfen:**
```bash
ssh root@srv1243952.hstgr.cloud "docker ps | grep nexify"
```

---

## 📚 Dokumentation

| Dokument | Pfad | Zweck |
|----------|------|-------|
| **Architektur** | `docs/architecture/` | System-Design, Components |
| **Governance** | `docs/governance/` | Rules, SOPs, Change Management |
| **API Reference** | `docs/api/` | Endpoint-Dokumentation |
| **Deployment** | `deploy/` | Infrastructure-as-Code |
| **Brain** | `memory/` | AgentMemory + LightRAG Snapshots |
| **Agent Factory** | `fabrik/` | Skill Templates, Agent Patterns |

**Wiki aktualisieren:** Docs ändern → `git push` → Automatisch in GitLab Wiki synced.

---

## 🧠 Brain Integration

**AgentMemory** (NeXifyAI proprietary):
```
POST /api/save
{
  "entity": "platform-config",
  "data": {...},
  "review_due": "2026-08-01"
}
```

**LightRAG** (Knowledge Graph):
```
POST http://127.0.0.1:9621/v1/api/kg_api/query
{
  "mode": "local",
  "query": "deployment status"
}
```

**Dual-Write:** Jeder Agent speichert erkenntnisse in beiden Systemen.

---

## 🤖 GitHub Worker Integration

**GitHub Actions können direkt deployen (als Backup zu GitLab CI).**

```yaml
# .github/workflows/deploy-vps.yml
name: Deploy VPS
on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        env:
          VPS_SSH_KEY: ${{ secrets.VPS_SSH_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$VPS_SSH_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh -o StrictHostKeyChecking=no root@srv1243952.hstgr.cloud "cd /opt/nexifyai/deployment/nexify-agentur-plattform && git pull && docker-compose up -d"
```

**Setup:**
1. GitHub Settings → Secrets → `VPS_SSH_KEY` (privater SSH-Key)
2. Trigger: `git push origin main`

---

## 🔍 Monitoring & Debugging

### Logs

```bash
# Docker logs
docker logs nexify-backend
docker logs nexify-website
docker logs lightrag

# Via docker-compose
docker-compose logs -f backend

# VPS (SSH)
ssh root@srv1243952.hstgr.cloud "tail -f /var/log/nexify/*.log"
```

### Health Checks

```bash
# Backend
curl http://localhost:3100/health

# Frontend
curl http://localhost:3000

# LightRAG
curl http://localhost:9621/health

# 9Router (LLM)
curl http://localhost:20128/health
```

### Performance

```bash
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3030
# cAdvisor: http://localhost:8080
```

---

## 🛠 Development Workflow

### 1. Feature Branch

```bash
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: description"
git push origin feature/my-feature
```

### 2. Pull Request → Merge Request

- GitHub: Create PR
- GitLab: Auto-creates MR (via gitlab-sync)
- Reviews in BOTH platforms
- Merge via GitLab (source of truth)

### 3. Deploy

```bash
git push origin main
# → GitLab CI/CD pipeline auto-starts
# → Staging deploy (automatic)
# → Production deploy (manual approval)
```

### 4. Rollback

```bash
git revert <commit-hash>
git push origin main
# Pipeline re-runs with previous version
```

---

## 🚨 Troubleshooting

### Deploy fehlgeschlagen

```bash
# Check logs
gitlab-runner logs

# Manual deploy
./deploy/deploy-vps.sh staging

# VPS debugging
ssh root@srv1243952.hstgr.cloud "docker-compose logs backend"
```

### Performance Issues

1. **Check resource usage:** `docker stats`
2. **Check LightRAG:** `curl http://localhost:9621/health`
3. **Check 9Router:** `curl http://localhost:20128/health`
4. **Scale:** `docker-compose up -d --scale backend=3`

### Brain (AgentMemory/LightRAG) offline

```bash
# Restart
docker restart lightrag-lightrag-1
docker restart agentmemory

# Sync
curl -X POST http://127.0.0.1:9621/v1/api/kg_api/reset
```

---

## 📦 Release Process

1. **Tag erstellen:** `git tag v1.0.0`
2. **Push:** `git push origin v1.0.0`
3. **GitHub Release:** Auto-generiert
4. **GitLab Release:** Auto-synced
5. **Docker Images:** Tagged in Registry

```bash
git tag v1.0.0
git push origin v1.0.0
# → Workflows triggern auto-release
```

---

## 🔐 Security

- **Secrets:** `.env` NIE committen (`.env` in `.gitignore`)
- **SSH Keys:** `/opt/nexifyai/security/keys/` nur für root lesbar
- **Scanning:** GitLab CI Secret Scan + GitHub Advanced Security
- **Compliance:** DIN ISO 27001 Standards (siehe `docs/governance/06_sicherheit_policies/`)

---

## 📞 Support

- **Issues:** GitHub Issues (synced zu GitLab)
- **Docs:** `/docs/` (Markdown)
- **Brain:** AgentMemory `query` API
- **Team:** [Slack/Discord Link]

---

## 📄 License

Proprietary — NeXifyAI 2026

---

**Generated:** 2026-07-24 04:45 UTC  
**Sync Status:** GitHub ↔ GitLab ✓  
**Next Review:** 2026-08-01
