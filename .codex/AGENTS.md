# ECC for Codex CLI

This supplements the root `AGENTS.md` with a repo-local ECC baseline.

## Repo Skill

- Repo-generated Codex skill: `.agents/skills/nexify-agentur-plattform/SKILL.md`
- Claude-facing companion skill: `.claude/skills/nexify-agentur-plattform/SKILL.md`
- Keep user-specific credentials and private MCPs in `~/.codex/config.toml`, not in this repo.
- Route Codex through NeXify 9router via `OPENAI_BASE_URL` / `OPENAI_API_KEY` as documented in `deploy/9router/README.md` and `deploy/9router/openai-compatible-client.env.example`.

## MCP Baseline

Treat `.codex/config.toml` as the default ECC-safe baseline for work in this repository.
The generated baseline enables GitHub, Context7, Exa, Memory, Playwright, and Sequential Thinking.

## Multi-Agent Support

- Explorer: read-only evidence gathering
- Reviewer: correctness, security, and regression review
- Docs researcher: API and release-note verification

## 9router Model Mapping

- Explorer → `cx/gpt-5.2-codex`
- Docs researcher → `cx/gpt-5.2-codex`
- Reviewer → `cx/gpt-5.1-codex-max`

## Workflow Files

- `.claude/commands/feature-development.md`
- `.claude/commands/ecc-bundle-integration.md`
- `.claude/commands/ci-cd-workflow-update.md`

Use these workflow files as reusable task scaffolds when the detected repository workflows recur.