# GitHub Worker Integration Guide

**NIR:** 2026-07-24 04:58 UTC  
**PURPOSE:** Enable GitHub Actions as primary CI + GitLab backup worker

---

## Workflow

```
Developer: git push origin feature/xyz
  ↓
GitHub Actions (.github/workflows/*.yml)
  ├─ test.yml ...................... Unit + E2E tests
  ├─ build.yml ..................... Docker image build + push to GHCR
  ├─ deploy-vps.yml ............... Deploy to staging VPS via SSH
  └─ gitlab-sync.yml .............. Mirror to GitLab + trigger pipeline
       ↓
      GitLab CI/CD (.gitlab-ci.yml) [BACKUP]
       ├─ Build Docker images (if GitHub build failed)
       ├─ Run tests (redundancy)
       └─ Deploy to production (manual approval)
```

## GitHub Secrets Required

Set these in: `github.com/nexifyai-dev/nexify-agentur-plattform/settings/secrets/actions`

| Secret | Value | Source |
|--------|-------|--------|
| `GITLAB_TOKEN` | GitLab PAT | http://srv1243952.hstgr.cloud:8922/profile/personal_access_tokens |
| `VPS_SSH_KEY` | SSH Private Key | `/root/.ssh/github_nexify` (created earlier) |
| `GITHUB_TOKEN` | Auto-provided | GitHub (built-in) |
| `DOCKER_REGISTRY_PASSWORD` | Docker token | If pushing to registry (optional) |

**Setup:**
```bash
# 1. Get VPS SSH key (created earlier)
cat /root/.ssh/github_nexify | base64 -w 0
# → Copy output

# 2. GitHub UI → Settings → Secrets → New repository secret
# Name: VPS_SSH_KEY
# Value: (paste base64 encoded key)

# 3. Get GitLab Token (from VPS)
ssh root@srv1243952.hstgr.cloud
# → GitLab WebUI: Profile → Personal Access Tokens
# → Create: nexifyai-ci
# → Scopes: api, read_repo, write_repo
# → Copy token

# 4. GitHub UI → New secret
# Name: GITLAB_TOKEN
# Value: glpat-XXXXXXXX

# 5. Verify
gh secret list -R nexifyai-dev/nexify-agentur-plattform
```

## Workflow Details

### test.yml (Unit + E2E)

**Trigger:** `push` to `main`, `develop`, `feature/*`

```yaml
- Node setup
- npm ci (install locked deps)
- npm run test (Jest with coverage)
- npm run e2e (Playwright)
```

**Expected Duration:** ~5-10 min

### build.yml (Docker Image)

**Trigger:** `push` to `main` or `develop` (tags image)

```yaml
- Docker login to GHCR (GitHub Container Registry)
- Build images: vitrine, konsole, werkstatt, editor, backend
- Push to ghcr.io/nexifyai-dev/nexify-...
- Tag: latest, main, develop, git-sha
```

**Expected Duration:** ~10-15 min (first build), ~2-5 min (cached)

**Images location:** https://github.com/nexifyai-dev?tab=packages

### deploy-vps.yml (VPS Deploy)

**Trigger:** `push` to `main` (production) or manual `workflow_dispatch`

**Steps:**
1. SSH key setup
2. Connect to VPS: `root@srv1243952.hstgr.cloud`
3. Pull latest code: `cd /opt/nexifyai/deployment/nexify-agentur-plattform && git pull`
4. docker-compose pull + up
5. Health checks: curl all endpoints

**Expected Duration:** ~5 min

**Failure Rollback:**
```bash
git revert <commit-hash>
git push origin main
# → Workflow re-runs with old version
```

### gitlab-sync.yml (Mirror + Trigger)

**Trigger:** `push` to `main` or `develop`

**Steps:**
1. Add GitLab remote
2. Force-push branches to GitLab
3. Query GitLab project ID
4. Trigger GitLab pipeline via API
5. Report status

**Expected Duration:** ~2 min

**Failure modes:**
- GitLab offline → continues (marked as warning)
- Token invalid → logs 401, skips trigger
- Project not found → auto-creates if admin permissions

## Manual Workflow Trigger

```bash
# Via GitHub CLI
gh workflow run deploy-vps.yml -R nexifyai-dev/nexify-agentur-plattform

# Via GitHub WebUI
# → Actions → Select workflow → Run workflow → Branch: main
```

## Monitoring

### GitHub Actions

```bash
# View recent runs
gh run list -R nexifyai-dev/nexify-agentur-plattform

# View specific run
gh run view <RUN_ID> -R nexifyai-dev/nexify-agentur-plattform --log

# View in browser
# https://github.com/nexifyai-dev/nexify-agentur-plattform/actions
```

### GitLab Pipelines

```bash
# After sync, check GitLab
# https://srv1243952.hstgr.cloud:8922/nexifyai/nexify-agentur-plattform/-/pipelines

# Query via API
curl -s http://127.0.0.1:8922/api/v4/projects/ID/pipelines \
  -H "PRIVATE-TOKEN: GITLAB_TOKEN" | jq '.[0]'
```

## Troubleshooting

### "Deploy failed: SSH connection refused"

```bash
# Check VPS SSH key in GitHub Secret
# Verify: cat /root/.ssh/github_nexify.pub matches GitHub settings

# Manual test
ssh -i ~/.ssh/github_nexify root@srv1243952.hstgr.cloud "docker ps"
```

### "GitLab sync failed: 401 Unauthorized"

```bash
# GITLAB_TOKEN invalid/expired
# Fix:
# 1. Create new token on VPS: http://srv1243952.hstgr.cloud:8922/profile/personal_access_tokens
# 2. Update GitHub Secret: gh secret set GITLAB_TOKEN --body "glpat-NEW" ...
# 3. Re-run workflow
```

### "Docker build timeout"

```bash
# Increase timeout in .github/workflows/build.yml
# timeout-minutes: 30 (default 360)

# Or run build manually on VPS
ssh root@srv1243952.hstgr.cloud
cd /opt/nexifyai/deployment/nexify-agentur-plattform
docker-compose build
```

### "Test failed: ENOENT /app/node_modules"

```bash
# node_modules not installed in CI
# Ensure workflow has: npm ci --prefer-offline

# Or in Dockerfile: RUN npm ci
```

## Best Practices

1. **Always use `npm ci`** (not `npm install`) in CI
2. **Tag Docker images** with both `:latest` and `:git-sha`
3. **Test before deploy:** run test.yml before deploy-vps.yml
4. **Separate concerns:** test.yml → build.yml → deploy-vps.yml (sequential)
5. **Log all secrets:** GitHub Actions auto-masks secrets in logs
6. **Use concurrency groups:** prevent simultaneous deploys to same target
7. **Enable branch protection:** require passing checks before merge

## Files

```
.github/workflows/
├── test.yml ............. Unit + E2E tests
├── build.yml ............ Docker image build
├── deploy-vps.yml ....... Deploy to VPS
├── gitlab-sync.yml ...... Mirror to GitLab
├── secret-scan.yml ...... Security scan
└── package.json (root)
```

## Diagram

```
┌──────────────────────────────────────────┐
│ Developer: git push origin main          │
└──────────────┬───────────────────────────┘
               │
        ┌──────v──────────┐
        │ GitHub Actions  │
        └──────┬──────────┘
               │
     ┌─────────┼─────────┐
     │         │         │
 ┌───v──┐ ┌──v───┐ ┌───v────┐
 │test  │ │build │ │deploy  │
 │.yml  │ │.yml  │ │-vps.yml│
 └───┬──┘ └──┬───┘ └───┬────┘
     │       │        │
     └───────┼────────┘
             │
        ┌────v────────────┐
        │ gitlab-sync.yml │
        │ (mirror + run)  │
        └────┬────────────┘
             │
        ┌────v─────────────┐
        │ GitLab CI/CD     │
        │ (backup/audit)   │
        └──────────────────┘
```

---

**Generated:** 2026-07-24 04:58 UTC  
**Status:** Ready for deployment (pending GITLAB_TOKEN secret)
