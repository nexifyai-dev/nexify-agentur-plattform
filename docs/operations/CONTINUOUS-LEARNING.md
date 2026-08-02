# FILE: docs/operations/CONTINUOUS-LEARNING.md
# NIR: 02.08.2026 10:00
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Dauerhaftes Lernen — Protokoll für Cursor, Hermes, Cloud Agents, Backend.
# WHY: Korrekturen und Erfolge systemweit speichern (AgentMemory + LightRAG).
# BEST-PRACTICE: Recall→Act→Verify→Learn→Index; fail-soft; keine Secrets in Payloads.
# PITFALL: V-LEARN-01: Agent blockieren wenn Brain down — soft continue.
# DEPENDS: AgentMemory :3111, LightRAG :9622 (optional), Cursor hooks
# DOCS-REF: .cursor/rules/50-continuous-learning.mdc
# SESSION: continuous-learning-7dd5

# Continuous Learning — Dauerhaftes Lernen

## Ziel

Jede AI-Lösung (Cursor Agent, Cloud Agents, Hermes, Backend-Email-Agent) lernt
systematisch mit:

**Recall → Act → Verify → Learn → Index (LightRAG)**

- Fehler → **Error-Pattern** (PITFALL-ID) als Lesson + `bug`-Memory
- Erfolge → Lesson / optional Crystal (`memory_crystallize`)
- Korrekturen des Users nie verwerfen

Metadaten: **Timezone Europe/Berlin**, Lerntexte **Deutsch (DE)**,
Project-Slug `nexify-agentur-plattform` (kein Filesystem-Pfad).

## Architektur

| Schicht | Rolle |
|---------|--------|
| AgentMemory `:3111` | Brain: lessons, remember, crystals, insights |
| LightRAG `:9622` | Semantischer Index (X-API-Key); optional, no-op ohne Env |
| Cursor Rule `50-continuous-learning.mdc` | Pflichtverhalten im Agent |
| Hook `stop` → `scripts/learning/session-learn.sh` | Session-Ende auto-learn |
| Post-commit `.githooks/post-commit-dual-write` | Commit → AM remember + LightRAG (best effort) |
| CI `ci-learn.yml` / `ci-learn-event.py` | Merge/Fail → Lesson (degrade ohne Secrets) |

**Kein falscher Dual-Write:** Nur melden, was wirklich geschrieben wurde
(`am=1` / `lightrag=1`). Fehlt `LIGHTRAG_API_KEY` oder AM-Secret → soft skip.

## Cursor Agent (lokal / Remote-SSH)

### Vor Planung
1. MCP `memory_recall` / `memory_smart_search`
2. MCP `memory_lesson_recall` (wenn Server `user-agentmemory` / Tools=all)
3. Optional LightRAG-Query

### Nach Task
1. `memory_lesson_save` + `memory_save`
2. Bei Failure: `python3 scripts/learning/error-pattern-save.py --pitfall V-XX ...`
3. LightRAG: MCP `lightrag_insert_text` oder Script mit Env

### Session-Ende (automatisch)
`.cursor/hooks.json` Event `stop`:

```text
scripts/learning/session-learn.sh
```

Fail-soft: immer `permission: allow`. Schreibt Lesson + workflow-Remember;
LightRAG nur wenn `LIGHTRAG_URL` (+ Key) gesetzt.

## Cursor Cloud Agents

- Gleiche Rule + Docs in Repo (Branch-Checkout).
- CI-Fail/Merge: Workflow speichert Learning-Event via `ci-learn-event.py`.
- Ohne `CURSOR_API_KEY`: **kein** Cloud-Launch nötig für Learning — nur AM.
- Launch-Pfad bleibt `event-to-cloud-agent.yml` (Fix-Agent), Learning ist orthogonal.

Automation-Draft: `.cursor/automations/learn-from-ci-to-agent.md`

## Hermes

- Profile/Skills sollen nach Task `POST /agentmemory/remember` und
  `POST /agentmemory/lessons` nutzen (Bearer aus Env, nie hardcoden).
- Preview-Panel (`apps/webui-preview/agentmemory-panel`) zeigt Lessons —
  Learning-Hinweis in README; **kein** Prod-Static-Patch ohne Endabnahme.
- Hermes Gateway `:8644` / WebUI Prod: nur dokumentieren, nicht cutovern.

## Backend Email-Agent

Nach verarbeitetem Ticket / Korrektur:

```bash
python3 scripts/learning/error-pattern-save.py --stdin <<'EOF'
{"pitfall":"V-MAIL-01","summary":"...","fix":"..."}
EOF
```

Oder REST Remember mit `type=workflow` und Tags `email-agent,continuous-learning`.

## Commit Dual-Write

Installer: `bash scripts/install-dual-write-hook.sh`  
Hook: `.githooks/post-commit-dual-write` → AM `/remember` + LightRAG-Sync-Hilfe.

Learning-Scripts ergänzen Commits **nicht** doppelt zwingend; Session-Hook
deckt Chat-Sessions, Post-Commit deckt Git-History.

## Env (keine Secrets committen)

| Variable | Pflicht | Nutzen |
|----------|---------|--------|
| `AGENTMEMORY_URL` | nein (Default localhost:3111) | Brain base |
| `AGENTMEMORY_SECRET` | für Writes | Bearer |
| `LIGHTRAG_URL` | für Index | z. B. `http://127.0.0.1:9622` |
| `LIGHTRAG_API_KEY` | für Index | Header `X-API-Key` |

## HARTE Grenzen

1. Keine Secrets in Lesson-/Memory-/LightRAG-Payloads (Scripts redakten)
2. Kein Hermes-Produktions-Cutover ohne Endabnahme
3. Kein Force-Push auf `main`

## Verifikation (lokal)

```bash
# Dry-run Error-Pattern
python3 scripts/learning/error-pattern-save.py --dry-run \
  --pitfall V-LEARN-TEST --summary "Test" --fix "n/a"

# Session learn (fail-soft)
bash scripts/learning/session-learn.sh </dev/null

# CI event (braucht Secret in Env)
python3 scripts/learning/ci-learn-event.py --outcome success \
  --source local-smoke --ref HEAD --title "manual verify"
```
