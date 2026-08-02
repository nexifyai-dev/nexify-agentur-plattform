# FILE: apps/webui-preview/ninerouter-panel/README.md
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Preview — native 9Router panel gegen :20128 (same-origin Proxy)
# WHY: Parität zu AgentMemory/LightRAG panels (#141)
# DOCS-REF: Issue #141

## Start

```bash
python3 apps/webui-preview/ninerouter-panel/serve.py
# → http://127.0.0.1:8794/
```

## Views

Health · Models · Chat Completions Probe (default model `solar-mini`)

## Hard stop

Kein Kill von Dashboard `:4001`.
