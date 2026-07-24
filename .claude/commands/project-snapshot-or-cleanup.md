---
name: project-snapshot-or-cleanup
description: Workflow command scaffold for project-snapshot-or-cleanup in nexify-agentur-plattform.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /project-snapshot-or-cleanup

Use this workflow when working on **project-snapshot-or-cleanup** in `nexify-agentur-plattform`.

## Goal

Create a clean snapshot of the project or perform a mass cleanup (e.g., removing problematic files for cross-platform compatibility).

## Common Files

- `.gitignore`
- `.gitlab-ci.yml`
- `.github/workflows/*`
- `apps/hermes/**`
- `README.md`
- `docs/**`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Identify files that need to be removed or cleaned (e.g., invalid path chars).
- Remove or update those files across the codebase.
- Commit all changes in a single large commit with a chore/cleanup message.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.