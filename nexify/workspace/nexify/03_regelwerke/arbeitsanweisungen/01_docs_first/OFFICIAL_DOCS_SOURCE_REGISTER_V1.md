# Official Docs Source Register V1

**Status:** VERBINDLICH — vor Tool-/API-/MCP-/Konfigurationsarbeiten prüfen.

## 9Router — docs-9router-main

- Typ: `official_repo`
- Offizielle Quelle: https://github.com/decolua/9router
- Pflichtnutzung: 9Router Installation, Provider, Dashboard, OpenAI-compatible endpoint, RTK, Fallbacks, Analytics, Docker/VPS/Cloudflare Workers deployment, supported CLI tools
- Pflichtausgaben: 9ROUTER_OFFICIAL_DOCS_AUDIT.md, 9ROUTER_CAPABILITY_MAP.md, 9ROUTER_CONFIG_TARGET_STATE.md, 9ROUTER_TEST_PLAN.md

## 9Router — docs-9router-docs

- Typ: `official_docs_folder`
- Offizielle Quelle: https://github.com/decolua/9router/tree/master/docs
- Pflichtnutzung: Architecture and internal design before modifying routing or deployment
- Pflichtausgaben: 9ROUTER_ARCHITECTURE_AUDIT.md

## 9Router — docs-9router-gitbook

- Typ: `official_gitbook_source`
- Offizielle Quelle: https://github.com/decolua/9router/tree/master/gitbook
- Pflichtnutzung: Website/docs feature discovery and user-facing UI reference
- Pflichtausgaben: 9ROUTER_DOCS_UI_FEATURE_MAP.md

## Claude Code — docs-claude-code-settings

- Typ: `official_docs`
- Offizielle Quelle: https://docs.anthropic.com/en/docs/claude-code/settings
- Pflichtnutzung: Settings, permission modes, allowed tools, hooks, non-interactive operation
- Pflichtausgaben: CLAUDE_CODE_SETTINGS_POLICY.md, CLAUDE_CODE_PERMISSION_MATRIX.md

## Claude Code — docs-claude-code-best-practices

- Typ: `official_docs`
- Offizielle Quelle: https://docs.anthropic.com/en/docs/claude-code/best-practices
- Pflichtnutzung: Subagents, testing, hooks, coding discipline
- Pflichtausgaben: CLAUDE_CODE_BEST_PRACTICE_AUDIT.md

## Vercel — docs-vercel

- Typ: `official_docs`
## Cloudflare — docs-cloudflare

- Typ: `official_docs`
- Offizielle Quelle: https://developers.cloudflare.com/
- Pflichtnutzung: DNS, tunnel, proxy, security, WAF, SSL, Zero Trust
- Pflichtausgaben: CLOUDFLARE_DNS_TUNNEL_RUNBOOK.md

## Supabase — docs-supabase

- Typ: `official_docs`
- Offizielle Quelle: https://supabase.com/docs
- Pflichtnutzung: Auth, RLS, database, realtime, storage, edge functions, CLI, migrations
- Pflichtausgaben: SUPABASE_ARCHITECTURE_RLS_RUNBOOK.md

## Resend — docs-resend

- Typ: `official_docs`
- Offizielle Quelle: https://resend.com/docs
- Pflichtnutzung: Transactional mails, domains, templates, webhooks, bounces, compliance
- Pflichtausgaben: RESEND_MAILFLOW_RUNBOOK.md

## GitHub — docs-github

- Typ: `official_docs`
- Offizielle Quelle: https://docs.github.com/
- Pflichtnutzung: Actions, Apps, Projects, Issues, PRs, branch protection, secrets, code scanning
- Pflichtausgaben: GITHUB_REPO_AUTONOMY_RUNBOOK.md

## Next.js — docs-nextjs

- Typ: `official_docs`
- Offizielle Quelle: https://nextjs.org/docs
- Pflichtnutzung: Website, portal, App Router, server actions, deployment, performance
- Pflichtausgaben: NEXTJS_FRONTEND_ARCHITECTURE.md

## Qdrant — docs-qdrant

- Typ: `official_docs`
- Offizielle Quelle: https://qdrant.tech/documentation/
- Pflichtnutzung: Brain vector storage, collections, payloads, snapshots, backups, filters
- Pflichtausgaben: QDRANT_BRAIN_RUNBOOK.md

## agentmemory — docs-agentmemory

- Typ: `official_repo`
- Offizielle Quelle: https://github.com/rohitg00/agentmemory
- Pflichtnutzung: cross-agent memory, MCP integration, hooks, connect commands
- Pflichtausgaben: AGENTMEMORY_CONNECT_RUNBOOK.md