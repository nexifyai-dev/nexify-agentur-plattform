# GitHub ↔ Cursor Control-Plane Status

**Stand:** 2026-08-02  
**Branch:** `cursor/github-ops-automation-7dd5`  
**Repo:** `nexifyai-dev/nexify-agentur-plattform`  
**Mandat:** Audit + Automation aller Top-Level-Surfaces; Laptop-off wo GitHub+Cursor erlauben.

## Inventory (verified)

| Surface | Status | Notes |
|---------|--------|-------|
| **Code** | OK | Default branch `main`. Remote cleaned: **81** zombie branches deleted; **5** skipped (unsure). |
| **Issues** | OK | P0 gaps opened #123–#127 (secrets/runner, booking, AgentMemory, GitHub MCP, Cloud webhook secrets). |
| **Pull requests** | OK | #122 docs merged. Dependabot #128 (pyasn1) merged; #129 (litellm) left for human review. |
| **Agents** | Config on main | Workflows: `event-to-cloud-agent.yml`, `agent-branch-autopilot.yml`, `pr-auto-merge.yml`. Automations: `.cursor/automations/`. Doc: `CLOUD-AGENT-EVENT-INGEST.md`. Needs secrets (#123/#127). |
| **Discussions** | Enabled | Handoff thread: [Discussion #142](https://github.com/nexifyai-dev/nexify-agentur-plattform/discussions/142). Prefer Issues for work items. |
| **Actions** | Healthy | Last 50 runs: no P0 failures (2 cancelled only). Key workflows present on `main` (CI, mirror, auto-merge, Linear sync, Cloud Agent). Copilot workflows active (leave; not obsolete). |
| **Projects** | Empty / blocked | Projects V2 create via PAT → `FORBIDDEN`. Human/org token with `project` scope needed for „NeXify Ops“ board. |
| **Wiki** | Unused | `has_wiki=true` but wiki git repo not initialized (`*.wiki.git` 404). **SoT = README + `docs/`** — do not rely on Wiki until first page created in UI. |
| **Security & quality** | Enabled this run | Vulnerability alerts ON; Dependabot security updates ON; secret scanning + push protection ON. Code scanning: no analysis yet (needs CodeQL/workflow if desired). |
| **Insights** | N/A API | Traffic graphs UI-only; repo About verified. |
| **Settings** | Hardened for autonomy | `allow_auto_merge=true`, `delete_branch_on_merge=true`, squash allowed. About: homepage `https://www.nexifyai.cloud`. |

## Branch protection (do not weaken)

- Classic `branches/main/protection` API: **not set** (404).
- **Ruleset active:** `main — required CI checks` (id `20223912`) — blocks deletion + force-push; required status checks include `backend`, `website`, `hermes`, `secret-scan` (strict). **Do not remove.**

## Branch cleanup (executed)

**Deleted (safe):** tip ancestor of `origin/main` **or** associated merged PR with ≤5 ahead commits (squash-noise). Never `main`, never open-PR heads.

**Skipped (unsure) — keep until manual review:**

| Branch | Why skipped |
|--------|-------------|
| `claude/vps-setup-bug-audit-89h0n0` | Merged PR #4 but ahead=7 |
| `cursor/agent-triggers-integrations-7dd5` | No merged PR, ahead=2 |
| `cursor/agentic-ai-mode-bootstrap-7dd5` | No merged PR, ahead=5 |
| `cursor/webui-am-native-stub-hermes-wire-7dd5` | Merged PR #107 but ahead=8 |
| `feat/monorepo-integration` | Merged PR #2 but ahead=20 |

Script for future dry-run/delete: `scripts/github-zombie-branch-cleanup.py`.

## Actions inventory (main)

| Workflow | Role |
|----------|------|
| `ci.yml` | CI — Test & Lint (required checks) |
| `mirror-to-gitlab.yml` | Dual-VCS mirror |
| `pr-auto-merge.yml` | Label-gated auto-merge |
| `linear-pr-sync.yml` | Linear ↔ PR |
| `event-to-cloud-agent.yml` | Event → Cursor Cloud |
| `agent-branch-autopilot.yml` | Draft-PR on agent branches |
| `secret-scan.yml` / `test.yml` / `build.yml` | Quality / images |
| `deploy-vps.yml` / `vps-worker.yml` | Deploy (need secrets + runner) |
| Copilot / Copilot cloud agent | Leave enabled; not duplicate of Cursor path |

## Settings flipped this session

| Setting | Before → After |
|---------|----------------|
| Vulnerability alerts | off → **on** |
| Dependabot security updates | off → **on** |
| Secret scanning | off → **on** |
| Secret scanning push protection | off → **on** |
| `delete_branch_on_merge` | confirmed **on** |
| `allow_auto_merge` | confirmed **on** |

## Human required

1. **Org/billing:** Advanced Security extras if desired (validity checks, non-provider patterns); CodeQL enable if wanted.
2. **Projects:** PAT/App with Projects write → create „NeXify Ops“ and attach #123–#127.
3. **Wiki (optional):** Create first page in GitHub UI to initialize wiki, or leave unused (recommended: README SoT).
4. **Secrets (#123/#127):** `CURSOR_API_KEY`, `LINEAR_API_KEY`, `AGENTMEMORY_*` — values only in GitHub Settings.
5. **Self-hosted runner:** 0 registered — needed for VPS deploy/worker.
6. **GitHub MCP plugin (#126):** Cursor OAuth/install on operator machines + Cloud.
7. **Dependabot #129:** litellm bump — review before merge.
8. **Branch protection:** Classic rules optional; ruleset already covers required checks — do not weaken.

## Cursor autonomy path (laptop off)

```
Event → Actions (event-to-cloud-agent) → Cursor Cloud Agent
  → cursor/* branch → autopilot Draft-PR + automerge label
  → CI green (ruleset) → pr-auto-merge squash → delete head branch
  → mirror-to-gitlab
```

Blockers for full PC-off: Actions secrets + runner (#123), Cloud webhook/API key (#127), MCP auth (#126).

## Ops hygiene

- Always `unset GITHUB_TOKEN` before `gh` / `git push` on this host (env token shadows `gh` auth).
- No force-push to `main`. No Hermes production cutover without explicit approval.
- No secret values in issues/PRs/logs.
