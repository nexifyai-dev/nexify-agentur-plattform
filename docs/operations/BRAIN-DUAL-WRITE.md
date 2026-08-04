# FILE: docs/operations/BRAIN-DUAL-WRITE.md
# NIR: 02.08.2026 09:00
# UPDATED: 04.08.2026 09:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Ops-Hinweis — optionaler Dual-Write AgentMemory + LightRAG nach Commits
# WHY: Frühere Docs behaupteten „post-commit Dual-Write aktiv" — IST war GAP
# DEPENDS: scripts/brain-dual-write.sh, .githooks/post-commit-dual-write
# STATUS: OPTIONAL / ENV-gated — kein Prod-Zwang

## IST (2026-08-04)

| Artefakt | Status |
|----------|--------|
| `scripts/brain-dual-write.sh` | ✅ Repo-Helper (Safe, No-op ohne Env) |
| `.githooks/post-commit-dual-write` | ✅ tracked Hook → ruft Helper auf |
| `core.hooksPath=.githooks` + `.githooks/post-commit` | ✅ Pflicht-Entry (nicht nur `*-dual-write`) |
| `core.hooksPath` aktiv | ⚠ lokal/VPS muss gesetzt sein |
| Event-Ingest LightRAG dual-write | ✅ `dispatch_cloud_agent.py` schreibt bei `LIGHTRAG_API_KEY` |
| AM livez + recall smoke in CI | ✅ `daily-smoke-hosted.sh` probt `/livez` + `/recall` |
| Secrets in Git | ❌ verboten — nur Env |

**Nicht** behaupten: „Dual-Write ist überall aktiv." Ohne Env und Hook-Installation bleibt es ein No-op.

## Env (keine Defaults mit Secrets)

| Variable | Zweck |
|----------|--------|
| `AGENTMEMORY_URL` | Default `http://127.0.0.1:3111` |
| `AGENTMEMORY_SECRET` | Auth `/agentmemory/remember` und `/agentmemory/recall` |
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

## Pflicht-Save-Typen nach GitHub/Ops-Sessions

Nach jeder GitHub-Actions- oder Ops-Session **müssen** folgende Save-Typen in
AgentMemory (`:3111/agentmemory/remember`) geschrieben werden, damit
cross-session Currency erhalten bleibt:

| Session-Typ | Pflicht-Content | `type`-Feld |
|-------------|-----------------|-------------|
| GitHub Actions (CI green) | `"CI run {run_id} passed: {summary}"` | `workflow` |
| GitHub Actions (CI fail) | `"CI run {run_id} failed: {steps_failed}"` | `workflow` |
| Ops-Deployment (VPS) | `"Deployed {ref} → {env}: {result}"` | `deployment` |
| Cursor Cloud Agent launch | `"Cloud Agent {agent_id} launched for {event}"` | `agent-action` |
| Issue/PR triage | `"Issue #{n} / PR #{n}: {action} — {summary}"` | `triage` |
| Secret rotation | `"Secret rotated: {name} (not value)"` | `security` |

**Minimalformat:**
```json
{
  "content": "<text>",
  "type": "<type>",
  "project": "nexify-agentur-plattform",
  "concepts": ["<tag1>", "<tag2>"]
}
```

Der `post-commit`-Hook und `dispatch_cloud_agent.py` erledigen dies automatisch
wenn `AGENTMEMORY_SECRET` gesetzt ist. Manuelle Ops-Tasks müssen explizit
`brain-dual-write.sh text "<summary>"` aufrufen.

## MCP Empty-Recall Gap

**Problem:** `memory_recall` über Cursor/MCP kann leere Ergebnisse zurückgeben,
obwohl `GET /agentmemory/livez` `status=ok` meldet.

**Ursachen (bekannt):**
1. MCP-Session cached einen leeren Index-Stand aus dem Boot.
2. REST-Writes landen in einer anderen Partition als MCP-Queries lesen.
3. `AGENTMEMORY_SECRET` im MCP-Context unterscheidet sich vom REST-Secret.

**Mitigation:**
- Direkt gegen REST prüfen: `curl http://127.0.0.1:3111/agentmemory/livez`
- Recall via REST statt MCP wenn MCP leer: `POST /agentmemory/recall {"query":"…","limit":5}`
- Nach jedem manuellen Write 5 s warten vor Recall (Indexierungs-Latenz).
- Beim Booten des VPS-Workers einmalig `brain-dual-write.sh text "boot-sync"` ausführen.

**Status:** Offener Gap — nicht schließen bis MCP-Recall und REST-Recall konsistente
Ergebnisse für denselben Index liefern (Issue #125).

## Cloud Agent Dual-Write (CURSOR_API_KEY)

`scripts/event-ingest/dispatch_cloud_agent.py` schreibt bei konfiguriertem
`LIGHTRAG_API_KEY` nach jedem Event-Ingest in LightRAG (zusätzlich zu AgentMemory).
Voraussetzung für vollständigen Cloud-Agent-Pfad:

```
CURSOR_API_KEY      → Cloud Agent create (agents/client.py)
AGENTMEMORY_SECRET  → AM remember + action
LIGHTRAG_API_KEY    → LightRAG /documents/text
```

Ohne diese Vars bleibt der entsprechende Pfad ein No-op (nie blockierend).

## Embedding IST (LightRAG live)

LightRAG Embedding ist **Upstage** `embedding-passage` über `https://api.upstage.ai/v1`
(nicht primär Ollama `bge-m3`). Ollama kann als Legacy/Fallback existieren — Status-Docs
müssen das nicht als Live-Pfad ausgeben.

## Sicherheit

- Hook/Skript loggen **keine** Secrets.
- Commit-Summary wird grob redacted (`sk-`, `ghp_`, `glpat-`).
- Kill-Switch: `/opt/nexifyai/state/autopilot/KILL_SWITCH` → sofort Exit 0.
- Git darf nie durch Dual-Write-Fehler blockieren (Skript endet immer 0).

## Verwandt

- Issue [#125](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/125) — AgentMemory currency
- Decision [#141](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/141) — Hermes WebUI bleiben
- `docs/live/GITHUB-ORG-MONOREPO-DRIFT-2026-07-31.md` — Hook-Drift
