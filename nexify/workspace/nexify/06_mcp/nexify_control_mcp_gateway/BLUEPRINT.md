# NeXify Control MCP Gateway — Phase B Blueprint

## Ziel
Ein zentraler MCP-Gateway-Kern für alle NeXify-Dienste:
- ChatGPT (via OpenAI Secure MCP Tunnel)
- Claude Code CLI
- NeXify Workstation
- 9Remote-Bedienebene
- Goose Recovery / Fallback
- Spätere externe Integrationen

## Architektur

```
                    ┌──────────────────────┐
                    │   ChatGPT (Tunnel)    │
                    └────────┬─────────────┘
                             │ OpenAI Secure Tunnel
                    ┌────────▼─────────────┐
                    │  NeXify Control MCP  │
                    │     Gateway Kern     │
                    │  (06_mcp/gateway/)   │
                    └────────┬─────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌──────▼──────┐  ┌────▼────────┐
     │  Tool      │  │  Policy     │  │  Audit/     │
     │  Registry  │  │  Gate       │  │  Evidence   │
     └────────────┘  └─────────────┘  └─────────────┘
              │              │              │
     ┌────────▼───┐  ┌──────▼──────┐  ┌────▼────────┐
     │  Brain     │  │agentmemory  │  │  Kanban     │
     │ (Wissen)   │  │ (Session)   │  │ (Tasks)     │
     └────────────┘  └─────────────┘  └─────────────┘
```

## Komponenten

### 1. Tool Registry (`NEXIFY_MCP_TOOL_REGISTRY`)
- JSON-basierte Registry aller verfügbaren Tools
- Pro Tool: name, description, policy_class (read-only | safe-internal-write | gated | forbidden)
- Pro Tool: readOnlyHint, destructiveHint, openWorldHint, idempotentHint
- Pro Tool: target (brain | agentmemory | kanban | evidence | system | ...)
- Format: `/workspace/nexify/30_operating_data/nexify-mcp-tool-registry.json`
- Begleitdokument: `/workspace/nexify/30_operating_data/NEXIFY_MCP_TOOL_REGISTRY.md`

### 2. Policy Gate
- **read-only tools**: immer erlaubt, kein Approval nötig
- **safe-internal-write tools**: erlaubt (Dry-Run, Kanban, Evidence schreiben)
- **gated tools**: brauchen Approval (Deploy, DNS, Secret-Rotation, DB-Migration)
- **forbidden tools**: nie erlaubt (raw_shell, sudo, rm, secret_read, env_dump)

### 3. Transport Layer
- **Streamable HTTP** für ChatGPT (OpenAI Secure Tunnel)
- **SSE** für Claude Code CLI und lokale Clients
- **Erweiterbar** für zukünftige Transporte (WebSocket, gRPC)

### 4. Authentifizierung
- Phase A (Dev): Tunnel-Auth, kein OAuth
- Phase B (Ziel): OAuth2 / DCR für externe Clients
- Phase C (Produktion): API-Keys pro Client, Rate-Limiting

### 5. Audit / Evidence
- Jeder Tool-Call wird in Evidence protokolliert
- Brain wird nach relevanten changes aktualisiert
- agentmemory wird nach Session-Ende aktualisiert
- Kanban wird bei Task-Erzeugung aktualisiert

## Tool-Kategorien (Phase B)

### Read-only Tools
| Tool | Quelle | Policy |
|------|--------|--------|
| get_status | System | read-only |
| list_open_blockers | Evidence | read-only |
| read_latest_evidence | Evidence | read-only |
| read_kanban | Kanban | read-only |
| read_brain_status | Brain | read-only |
| read_agentmemory_status | agentmemory | read-only |
| read_9router_status | 9Router | read-only |
| read_github_repo_status | GitHub API | read-only |
| read_vercel_status | Vercel API | read-only |
| read_cloudflare_status | Cloudflare API | read-only |

### Safe Internal Write Tools
| Tool | Effekt | Policy |
|------|--------|--------|
| create_dry_run_task | Kanban (JSON) | safe-internal-write |
| create_internal_task | Kanban | safe-internal-write |
| write_evidence | Evidence (Datei) | safe-internal-write |
| write_agentmemory_pending | agentmemory | safe-internal-write |
| write_brain_pending | Brain | safe-internal-write |
| update_kanban_safe_internal | Kanban | safe-internal-write |

### Gated Tools (brauchen Approval)
| Tool | Risiko | Policy |
|------|--------|--------|
| create_claude_task | Claude Code Task | gated |
| continue_claude_task | Claude Code Task | gated |
| trigger_code_review | Code-Qualität | gated |
| trigger_live_verification | Runtime-Check | gated |
| request_deploy | Produktion | gated |
| request_dns_change | DNS | gated |
| request_secret_rotation | Sicherheit | gated |
| sync_brain_agentmemory | Sync | gated |

### Verbotene Tools
| Tool | Grund |
|------|-------|
| raw_shell | Unkontrollierte Ausführung |
| sudo | Root-Zugriff |
| rm -rf / | Datenverlust |
| secret_read | Secretschutz |
| env_dump | Credential-Leak |
| public_deploy_without_gate | Produktionsrisiko |
| dns_write_without_gate | DNS-Risiko |
| cloudflare_write_without_gate | Infrastruktur-Risiko |
| database_migration_without_gate | Datenintegrität |

## Nächste Schritte (Umsetzung)

### Phase B-1: Gateway-Struktur
- [ ] `nexify_control_mcp_gateway/__init__.py`
- [ ] `nexify_control_mcp_gateway/main.py` (Server-Kern)
- [ ] `nexify_control_mcp_gateway/tool_registry.py` (Registry-Loader)
- [ ] `nexify_control_mcp_gateway/policy_gate.py` (Policy-Checker)
- [ ] `nexify_control_mcp_gateway/audit.py` (Evidence-Logger)
- [ ] `nexify_control_mcp_gateway/transport.py` (SSE + streamable_http)

### Phase B-2: Tool-Integration
- [ ] Registry mit 10+ Read-Tools
- [ ] Registry mit 3+ Safe-Write-Tools
- [ ] Registry mit 3+ Gated-Tools
- [ ] Policy Gate Enforcement
- [ ] Audit-Log in Evidence

### Phase B-3: Deployment
- [ ] Systemd-Service `nexify-mcp-gateway`
- [ ] Health-Check im Monitoring
- [ ] Tunnel-Neustart nach Gateway-Restart
- [ ] Fallback auf alten Server bei Gateway-Fehler

## Rollback
```bash
# Phase B Gateway stoppen
systemctl stop nexify-mcp-gateway
# Phase A Server aktivieren
cd /workspace/nexify/07_tools_cli/chatgpt_mcp/server && python3 nexify_control.py &
# Tunnel neustarten
```

---
*Blueprint generated: 2026-06-12T15:25+0200*
