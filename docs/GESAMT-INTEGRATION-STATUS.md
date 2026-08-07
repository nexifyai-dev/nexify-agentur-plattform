# NeXifyAI Gesamt-Integration — Live-Status 28.07.2026

> **Hinweis (2026-08-02):** Historischer VPS-Snapshot. Keine aktuelle Produktionsgarantie.
> Aktuelle öffentliche Produktwahrheit: Root-`README.md`, Live https://www.nexifyai.cloud, API https://api.nexifyai.cloud.
>
> Generiert: 14:35 UTC (28.07.2026). Damaliger Health-Lauf: 0/13 failures — nicht als Dauer-IST lesen.
>
> **Korrektur Embedding/Dual-Write (02.08.2026):** LightRAG Embedding IST = Upstage
> `embedding-passage` (`api.upstage.ai`), nicht „nur Ollama bge-m3“. Dual-Write post-commit
> ist **optional** (`scripts/brain-dual-write.sh`) — nicht als systemweit aktiv lesen.

## Service-Matrix (Port, API, Integration)

| Service | Port | API | Integration |
|---------|------|-----|-------------|
| 9Router | :20128 | /v1/models, /v1/chat/completions | → LightRAG, → AgentMemory, → Hermes |
| AgentMemory | :3111/:3113 | /health, /memory/* (268 funcs) | ← MCP-Proxy, ← Monorepo-Hook, ↔ LightRAG |
| LightRAG | :9622 | /health, /documents/* | ← Upstage LLM+Embed (IST), Ollama Legacy, ↔ AgentMemory |
| MCP-Proxy | :8650 | /api/mcp/servers, /api/mcp/tools | → 9 Server, 263 Tools |
| WebUI | :8787 | /api/health, /api/files | CF-blocked (public) |
| Dashboard | :4001 | /api/health, /api/memory | → AgentMemory :3111 |
| Headroom | :7777 | /v1/chat/completions | Token-Optimierung (OpenAI-kompatibel) |
| OpenDesign | :3002 | /api/* | HTML Anything Editor (nexu-io) |
| Nexify-Portal | :8880 | / | Frontend-Website (DE) |
| Grafana | :3000 | /api/health | ← Prometheus Metrics |
| GitLab OSS | :8922 | /api/v4/* | Primär-Repo, ← Monorepo |
| Supabase | :3001 | /rest/v1/* | Daten-Persistenz |
| Ollama | :11434 | /api/tags, /api/embeddings | Legacy/optional — LightRAG Embed IST = Upstage |
| Redis | :6379 | — | Cache/Queue |

## Wissens-Pipeline

```
Monorepo (GitHub SoT → GitLab Mirror)
  ↓ optional: scripts/brain-dual-write.sh
     (.githooks/post-commit-dual-write — No-op ohne Env)
  ├→ AgentMemory (:3111) — /agentmemory/remember
  └→ LightRAG (:9622) — /documents/text
       ↓ DeepSeek via 9Router (DeepSeek-only-Direktive 2026-08-07)
       ↓ Upstage — embedding-passage (IST; nur Embedding, Nicht-LLM-Ausnahme; nicht Ollama bge-m3)
       ↓
    Indexierung (MCP insert / Seed-Skript / VPS-Sync)
```

Siehe `docs/operations/BRAIN-DUAL-WRITE.md`.

## AgentMemory 4-Tier-Consolidation

| Tier | Status | Output |
|------|--------|--------|
| Working | ✅ Aktiv | Raw Observations |
| Episodic | ✅ Aktiv | Session Summaries |
| Semantic | ✅ Aktiv | 15 Facts + 7 Summaries |
| Procedural | ⏳ Inaktiv | Braucht ≥2 Patterns |

## MCP-Server (9 aktiv, 263 Tools)

| Server | Tools | Status |
|--------|-------|--------|
| agentmemory | 55 | active |
| gitlab | 60 | active |
| github | 35 | active |
| supabase | 35 | active |
| firecrawl | 30 | active (DNS broken) |
| filesystem | 20 | active |
| vercel | 15 | active |
| lightrag | 10 | active |
| context7 | 3 | active |
| linear | 20 | disabled |
| n8n | 15 | disabled |

## Systemd-Automation

| Timer | Intervall | Status |
|-------|-----------|--------|
| nexifyai-health | 15min | active |
| nexifyai-resilience | 5min | active |
| nexifyai-deviation-auto-fix | 15min | active |
| soul-compliance-check | daily | inactive |

## BLOCKER

| Blocker | Typ | Lösung |
|---------|-----|--------|
| CF Access webui.nexifyai.cloud | Extern | Manuell (CF Dashboard) |
| POOLSIDE_API_KEY | Credential | Gap-Alert |
| MSGRAPH_* | Credential | Gap-Alert |
| Firecrawl DNS | Network | firecrawl.nexifyai.cloud unauflösbar |
| AgentMemory Slots 500 | Bug | Upstream v0.9.28 |
| AgentMemory OTel 2/268 | Code-Level | Upstream |
| 178 unscoped Memories | Migration | Endpoint silent-fail |
| GitHub Force-Push | Git | Merge/Rebase nötig |
