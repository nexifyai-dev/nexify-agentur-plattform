# FILE: docs/operations/BRAIN-DUAL-WRITE.md
# NIR: 02.08.2026 09:00
# UPDATED: 02.08.2026 09:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Ops-Hinweis — optionaler Dual-Write AgentMemory + LightRAG nach Commits
# WHY: Frühere Docs behaupteten „post-commit Dual-Write aktiv“ — IST war GAP
# DEPENDS: scripts/brain-dual-write.sh, .githooks/post-commit-dual-write
# STATUS: OPTIONAL / ENV-gated — kein Prod-Zwang

## IST (2026-08-02)

| Artefakt | Status |
|----------|--------|
| `scripts/brain-dual-write.sh` | ✅ Repo-Helper (Safe, No-op ohne Env) |
| `.githooks/post-commit-dual-write` | ✅ tracked Hook → ruft Helper auf |
| `core.hooksPath=.githooks` lokal | ⚠ optional — muss aktiviert werden |
| Secrets in Git | ❌ verboten — nur Env |

**Nicht** behaupten: „Dual-Write ist überall aktiv.“ Ohne Env und Hook-Installation bleibt es ein No-op.

## Env (keine Defaults mit Secrets)

| Variable | Zweck |
|----------|--------|
| `AGENTMEMORY_URL` | Default `http://127.0.0.1:3111` |
| `AGENTMEMORY_SECRET` | Bearer für `/agentmemory/remember` |
| `LIGHTRAG_URL` | Default `http://127.0.0.1:9622` |
| `LIGHTRAG_API_KEY` | Header `X-API-Key` für `/documents/text` |

## Nutzung

```bash
# Manuell (Commit-Summary des HEAD)
bash scripts/brain-dual-write.sh commit

# Freier Text
bash scripts/brain-dual-write.sh text "SoT note: …"

# Hook aktivieren (lokal / VPS)
git config core.hooksPath .githooks
# Git führt `.githooks/post-commit` aus (nicht den Compat-Namen *-dual-write).
# oder: bash scripts/install-agent-hooks.sh
```

## Embedding IST (LightRAG live)

LightRAG Embedding ist **Upstage** `embedding-passage` über `https://api.upstage.ai/v1`
(nicht primär Ollama `bge-m3`). Ollama kann als Legacy/Fallback existieren — Status-Docs
müssen das nicht als Live-Pfad ausgeben.

## Sicherheit

- Hook/Skript loggen **keine** Secrets.
- Commit-Summary wird grob redacted (`sk-`, `ghp_`, `glpat-`, `Bearer …`).
- Kill-Switch: `/opt/nexifyai/state/autopilot/KILL_SWITCH` → sofort Exit 0.
- Git darf nie durch Dual-Write-Fehler blockieren (Skript endet immer 0).

## Verwandt

- Issue [#125](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/125) — AgentMemory currency
- Decision [#141](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/141) — Hermes WebUI bleiben
- `docs/live/GITHUB-ORG-MONOREPO-DRIFT-2026-07-31.md` — Hook-Drift
