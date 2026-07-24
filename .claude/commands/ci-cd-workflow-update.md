---
name: ci-cd-workflow-update
description: Workflow command scaffold for ci-cd-workflow-update in nexify-agentur-plattform.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /ci-cd-workflow-update

Use this workflow when working on **ci-cd-workflow-update** in `nexify-agentur-plattform`.

## Goal

Update or expand CI/CD workflows for GitHub Actions and/or GitLab CI, including job fixes, new workflows, and related documentation.

## Common Files

- `.github/workflows/*.yml`
- `.gitlab-ci.yml`
- `.gitignore`
- `docs/architecture/DEVIATION-REPORT-*.md`
- `docs/operations/REPO-SYNC-STRATEGY.md`
- `scripts/*.sh`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit .github/workflows/*.yml to add/fix jobs (ci.yml, deploy-vps.yml, mirror-to-gitlab.yml, secret-scan.yml, etc.)
- Edit .gitlab-ci.yml for GitLab pipeline changes
- Edit .gitignore if needed for workflow artifacts
- Add or update related documentation (e.g., docs/architecture/DEVIATION-REPORT-*.md, docs/operations/REPO-SYNC-STRATEGY.md)
- Add or update scripts for deployment/sync (e.g., scripts/sync-workspace-to-vps.sh)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.