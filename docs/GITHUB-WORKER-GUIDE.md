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
  └─ mirror-to-gitlab.yml ......... Vollständiger Ref-Mirror zu GitLab
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
| `VPS_GITLAB_URL` | HTTPS Clone URL | Self-hosted GitLab project |
| `VPS_GITLAB_USERNAME` | GitLab user | Self-hosted GitLab |
| `VPS_GITLAB_TOKEN` | GitLab PAT (`write_repository`) | Self-hosted GitLab |
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

# 3. Get GitLab project token (from VPS)
ssh root@gitlab.nexifyai.cloud
# → GitLab WebUI: nexifyai_group/nexify → Settings → Access Tokens
# → Create: github-mirror
# → Role: Maintainer; scopes: read_repository, write_repository
# → Copy token

# 4. GitHub UI → Add three repository secrets
# VPS_GITLAB_URL=https://gitlab.nexifyai.cloud/nexifyai_group/nexifyai.git
# VPS_GITLAB_USERNAME=<project-token-username>
# VPS_GITLAB_TOKEN=<project-token>

# 5. Verify
gh secret list -R nexifyai-dev/nexify-agentur-plattform \
  | grep '^VPS_GITLAB_'
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
2. Connect to VPS: `root@gitlab.nexifyai.cloud`
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

### mirror-to-gitlab.yml

**Trigger:** `push` to `main` or `develop`

**Steps:**
1. Validate all three GitLab secrets
2. Require HTTPS
3. Add the GitLab remote without embedding credentials
4. Push branches and tags with `git push --prune gitlab 'refs/heads/*:refs/heads/*' 'refs/tags/*:refs/tags/*'`
5. Fail the workflow on any mirror error

**Expected Duration:** ~2 min

**Failure modes:**
- GitLab offline → workflow fails
- Token invalid → workflow fails without printing the token
- Project not found → workflow fails; projects are never auto-created

## Manual Workflow Trigger

```bash
# Via GitHub CLI
gh workflow run deploy-vps.yml -R nexifyai-dev/nexify-agentur-plattform
gh workflow run mirror-to-gitlab.yml -R nexifyai-dev/nexify-agentur-plattform

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
# https://gitlab.nexifyai.cloud/nexifyai_group/nexifyai/-/pipelines

# Query via API
curl -s https://gitlab.nexifyai.cloud/api/v4/projects/7/pipelines \
  -H "PRIVATE-TOKEN: $VPS_GITLAB_TOKEN" | jq '.[0]'
```

## Troubleshooting

### "Deploy failed: SSH connection refused"

```bash
# Check VPS SSH key in GitHub Secret
# Verify: cat /root/.ssh/github_nexify.pub matches GitHub settings

# Manual test
ssh -i ~/.ssh/github_nexify root@gitlab.nexifyai.cloud "docker ps"
```

### "GitLab mirror failed: 401 Unauthorized"

```bash
# VPS_GITLAB_TOKEN invalid/expired
# Fix:
# 1. Create a new project token in nexifyai_group/nexifyai
# 2. Update GitHub Secret: gh secret set VPS_GITLAB_TOKEN ...
# 3. Re-run workflow
```

### "Docker build timeout"

```bash
# Increase timeout in .github/workflows/build.yml
# timeout-minutes: 30 (default 360)

# Or run build manually on VPS
ssh root@gitlab.nexifyai.cloud
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
├── mirror-to-gitlab.yml . Mirror to GitLab
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
        │ mirror-to-      │
        │ gitlab.yml      │
        └────┬────────────┘
             │
        ┌────v─────────────┐
        │ GitLab CI/CD     │
        │ (backup/audit)   │
        └──────────────────┘
```

---

**Generated:** 2026-07-24 04:58 UTC  
**Status:** Mirror credentials configured; workflow repair pending merge
