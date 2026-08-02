# FILE: docs/operations/WEBUI-DUAL-DASHBOARD-PARITY.md
# NIR: 02.08.2026 09:25
# UPDATED: 02.08.2026 09:25
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Parity checklist — Hermes WebUI bleiben vs Preview panels (no kill :4001)
# WHY: Issue #141 — native panels toward parity without production cutover
# BEST-PRACTICE: Preview ports only; Endabnahme gate for Traefik/Hermes swap
# PITFALL: HARD STOP — do not stop dashboard:4001 or swap Traefik without Endabnahme
# DEPENDS: apps/webui-preview/*-panel
# DOCS-REF: https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/141
# SESSION: production-readiness-close-7dd5

# Dual-Dashboard Parity Checklist (#141)

**Verdict:** Hermes WebUI **BLEIBEN**. Preview panels harden native integrations in isolation.

## Hard stops

- [ ] **Do not** kill / stop Hermes dashboard on `:4001`
- [ ] **Do not** Traefik cutover / route swap to preview without Endabnahme
- [ ] **Do not** replace Hermes shell with Open WebUI / LibreChat / Dify

## Panel parity (preview)

| Capability | AgentMemory :8792 | LightRAG :8793 | 9Router :8794 | Hermes native (later) |
|------------|-------------------|----------------|---------------|------------------------|
| Same-origin proxy to real REST | ✅ | ✅ | ✅ | target |
| Health probe | ✅ livez | ✅ /health | ✅ /api/health | target |
| Auth via sessionStorage only | ✅ | ✅ X-API-Key | ✅ Bearer | target |
| Dark/Luxury tokens `#0A0A0A` | ✅ | ✅ | ✅ | target |
| `data-testid` coverage | ✅ | ✅ | ✅ | target |
| No iframe | ✅ | ✅ | ✅ | target |

## Start commands

```bash
python3 apps/webui-preview/agentmemory-panel/serve.py   # :8792
python3 apps/webui-preview/lightrag-panel/serve.py      # :8793
python3 apps/webui-preview/ninerouter-panel/serve.py    # :8794
```

## Acceptance for Endabnahme (future)

1. All three panels green against live upstreams.
2. Hermes WebUI embeds/routes same modules **natively** (no iframe).
3. Explicit written Endabnahme before any `:4001` / Traefik change.
