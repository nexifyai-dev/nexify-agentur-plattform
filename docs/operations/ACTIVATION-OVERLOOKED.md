# Overlooked Stack — Activation (no new products)

**NIR:** 02.08.2026 09:05  
**UPDATED:** 02.08.2026 09:05  
**WHAT:** Bestehende Lösungen aktivieren / dokumentieren — nichts Neues kaufen.  
**WHY:** Utilization ~48% → Lücken schließen.  
**Hard stop:** Hermes WebUI Prod-Cutover ohne Endabnahme.

| Item | Action | Status |
|------|--------|--------|
| Gateway `:8644` | systemd env → `/etc/nexifyai/hermes.env` | UP (see UTILIZATION doc) |
| Headroom default | Keep in self_heal whitelist; no iframe | Runtime |
| 9Router cheap-first | Combos `nexifyai-cheap-first` / `nexifyai-combo-llm`; backend `.env.example` | Config |
| AgentMemory `TOOLS=all` | `.cursor/mcp.json.example` | Done |
| LightRAG SoT seed | `scripts/lightrag-sot-seed.sh` + dual-write hook | Scripts |
| Event-ingest install | `bash deploy/autopilot/install-event-ingest.sh` | One-liner |
| Paperclip revive | `enabled: false` + timer disabled (#150) | Stopped burn |
| Issues lifecycle | PR #152 | Peer |
| Draft→Ready | PR #146 | Peer |
| CI integrity | PR #147 | Peer |
| Dependabot | PR #148 | Peer |
| OpenMCP allowlist | Beyond health → public slots + metrics | This PR |
| Daily smoke hosted | `daily-smoke.yml` on `ubuntu-latest` | This PR |
| Human Gate doc | `HUMAN-GATE-5MIN.md` | This PR |

n8n bleibt abgeschafft. Paperclip tree fehlt — nicht reviven.
