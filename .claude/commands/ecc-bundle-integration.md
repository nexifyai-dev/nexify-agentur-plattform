---
name: ecc-bundle-integration
description: Workflow command scaffold for ecc-bundle-integration in nexify-agentur-plattform.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /ecc-bundle-integration

Use this workflow when working on **ecc-bundle-integration** in `nexify-agentur-plattform`.

## Goal

Integrate a new ECC bundle for a skill/agent, including metadata, agent configs, skills, instincts, and documentation across .claude, .codex, and .agents directories.

## Common Files

- `.claude/ecc-tools.json`
- `.claude/identity.json`
- `.claude/skills/*/SKILL.md`
- `.claude/homunculus/instincts/inherited/*.yaml`
- `.claude/commands/project-snapshot-or-cleanup.md`
- `.codex/config.toml`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update .claude/ecc-tools.json
- Add or update .claude/identity.json
- Add or update .claude/skills/[skill-name]/SKILL.md
- Add or update .claude/homunculus/instincts/inherited/[skill-name]-instincts.yaml
- Add or update .claude/commands/project-snapshot-or-cleanup.md

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.