# GitHub Actions + GitLab CI/CD — Deployment Runbook

**NIR:** 24.07.2026 13:30  
**NAME:** NeXifyAI DevOps Team  
**WHAT:** Complete GitHub-GitLab dual-CI setup for nexify-agentur-plattform  
**WHY:** Redundancy, local control (GitLab), cloud speed (GitHub)  
**DEPENDS:** Secrets configured, SSH keys deployed, Docker registry access  
**Hinweis (2026-08-02, aktualisiert 2026-08-12):** Produkt **NeXify AI by NeXify — chat it. Automate it.** · Website-Deploy via `deploy-vps.yml` + Host-Timer `nexifyai-website-sync.timer` (kein Vercel mehr) · Live https://www.nexifyai.cloud · GHCR-Image-Basis `nexify-agentur-plattform` (Tags website/backend/hermes), nicht „vitrine/konsole“.

---

## Workflows Overview

### GitHub Actions (`.github/workflows/`)

| Workflow | Trigger | Stage | Purpose |
|---|---|---|---|
| **test.yml** | push/PR | 1. Lint+Test | ESLint, YAML check, Jest, Python tests, security scans |
| **build.yml** | push (main/develop) | 2. Build | Docker multi-app build → GHCR (vitrine, konsole, backend) |
| **deploy-vps.yml** | push (main) | 3. Deploy | SSH to VPS, git pull, `docker-compose up --build`, health check |
| **mirror-to-gitlab.yml** | push (main/develop) | 4. Mirror | Branch- und Tag-Sync zu GitLab |
| **secret-scan.yml** | push | Security | TruffleHog secret detection |

### GitLab CI/CD (`.gitlab-ci.yml`)

| Pipeline | Trigger | Stage | Purpose |
|---|---|---|---|
| **lint** | branches | 1. Lint | ESLint, YAML validation |
| **test** | branches | 2. Test | npm test, artifacts |
| **build** | main/develop | 3. Build | Docker build → registry (vitrine, backend) |
| **deploy:vps** | main (manual) | 4. Deploy | SSH deploy to VPS |

---

## Setup Checklist

- [x] GitHub SSH key deployed (`github_nexify`)
- [x] GitHub deploy key deployed (`github_deploy_vps`)
- [x] GitHub Secrets configured:
  - `DEPLOY_KEY_VPS` → private SSH key
  - `VPS_HOST` → `gitlab.nexifyai.cloud`
  - `VPS_USER` → `root`
  - `VPS_PORT` → `22`
- [x] `.github/workflows/` created (test.yml, build.yml, deploy-vps.yml, mirror-to-gitlab.yml)
- [x] `.gitlab-ci.yml` created
- [ ] GitLab project mirrored (needs manual setup via GitLab UI)
- [ ] `VPS_GITLAB_URL`, `VPS_GITLAB_USERNAME`, `VPS_GITLAB_TOKEN` gesetzt
- [ ] SSH key added to VPS `authorized_keys`

---

## Workflow Execution Flow

```
GitHub Push (main)
  ↓
1. test.yml (in parallel: lint, unit-test, security, docker-build-test)
  ↓ (all success)
2. build.yml (matrix: vitrine, konsole, backend → GHCR)
  ↓ (build success)
3. deploy-vps.yml (SSH: git pull, docker-compose up)
  ↓ (deploy success)
4. mirror-to-gitlab.yml (Branch- und Tag-Sync zu GitLab)
```

---

## Secrets Configuration

Set via GitHub UI (Settings → Secrets and variables → Actions):

```bash
# Via CLI:
gh secret set DEPLOY_KEY_VPS -b "$(cat /root/.ssh/github_deploy_vps)"
gh secret set VPS_HOST -b "gitlab.nexifyai.cloud"
gh secret set VPS_USER -b "root"
gh secret set VPS_PORT -b "22"
gh secret set VPS_GITLAB_URL -b "https://gitlab.nexifyai.cloud/<namespace>/nexify-agentur-plattform.git"
gh secret set VPS_GITLAB_USERNAME -b "<gitlab-user>"
gh secret set VPS_GITLAB_TOKEN
```

---

## Local Testing

### Test workflow locally:

```bash
# Install act (GitHub Actions emulator)
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | bash

# Run test.yml locally
act -j lint -s GITHUB_TOKEN=$GH_TOKEN
act -j unit-test
```

### Trigger GitHub workflow manually:

```bash
cd /opt/nexifyai/repos/nexify-agentur-plattform
gh workflow run deploy-vps.yml -b main
gh run list --branch main
gh run view <RUN_ID> --log
```

---

## GitLab CI/CD Setup (Local)

### 1. Register GitLab Runner (if not exists)

```bash
# On VPS:
docker run -d --name gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  gitlab/gitlab-runner:latest

docker exec gitlab-runner gitlab-runner register \
  --url http://localhost:8922 \
  --registration-token <REGISTRATION_TOKEN> \
  --executor docker \
  --docker-image docker:latest
```

### 2. Create/Sync Project in GitLab

```bash
# Manual: GitLab UI → New Project → Import from GitHub
# Or via API:
curl -X POST http://localhost:8922/api/v4/projects/import \
  -H "PRIVATE-TOKEN: <GITLAB_TOKEN>" \
  -d '{"name":"nexify-agentur-plattform","import_url":"https://github.com/nexifyai-dev/nexify-agentur-plattform.git"}'
```

### 3. Set GitLab Variables for Deployment

```bash
# In GitLab UI: Project → Settings → CI/CD → Variables

SSH_PRIVATE_KEY = [content of /root/.ssh/github_deploy_vps]
VPS_HOST = gitlab.nexifyai.cloud
VPS_USER = root
```

---

## Troubleshooting

### GitHub Actions: Test fails with npm errors

**Fix:** Workflows use `npm ci` (deterministic) + fallback to `npm install`

```yaml
run: npm ci --prefer-offline 2>&1 || npm install --prefer-offline || true
```

### Deploy fails with SSH permission denied

**Fix:** Verify `DEPLOY_KEY_VPS` in GitHub Secrets matches VPS `authorized_keys`

```bash
# On VPS:
cat ~/.ssh/authorized_keys | grep github-deploy-vps
```

### Docker image push to GHCR fails

**Fix:** `GITHUB_TOKEN` auto-injected, but requires repo write access

```bash
# Verify token scope (in repo Settings → Actions):
gh secret list
```

### GitLab pipeline not triggered

**Fix:** Set `GITLAB_TOKEN` in repo (Settings → Secrets)

```bash
gh secret set GITLAB_TOKEN -b "<token>"
```

---

## Monitoring

### Live runs:

```bash
cd /opt/nexifyai/repos/nexify-agentur-plattform

# List all runs
gh run list --branch main --limit 20

# Watch specific run
gh run watch <RUN_ID>

# Get logs
gh run view <RUN_ID> --log
```

### VPS deploy verification:

```bash
# After deploy, check containers
docker ps --format "{{.Names}}: {{.Status}}"

# Check logs
docker-compose -f /opt/nexifyai/repos/nexify-agentur-plattform/docker-compose.yml logs --tail=50
```

---

## Best Practices

1. **Always test locally** before push to main
2. **Secrets rotation:** Regenerate keys every 90 days
3. **Log retention:** GitHub keeps 90 days (default); GitLab configurable
4. **Rollback:** `git reset --hard <COMMIT>` + `git push --force` (caution!)
5. **Notifications:** Set repo notifications → Email/Slack for failed runs

---

## References

- HERMES-GITHUB-WORKFLOW.md (architecture)
- .github/workflows/*.yml (inline documentation)
- .gitlab-ci.yml (inline configuration)
- docs/architecture/DEPLOYMENT-MODES.md (deployment strategy)
