# Change-Log — Orchestrator Cursor Anchor (HOTFIX)

| Feld | Wert |
|------|------|
| Datum | 2026-07-26 |
| Scaling | HOTFIX |
| Repo | nexifyai-dev/nexify-agentur-plattform |
| Kategorie | platform |

## SRS-Delta
- REQ-ORCH-001: Repo-Root `AGENTS.md` ist verbindliche Cursor-Agent-Mode Orchestrator-Quelle.
- REQ-ORCH-002: Always-Apply Rules `00-charter`, `10-hermes-consolidation`, `20-safety-escalation` unter `.cursor/rules/`.
- REQ-ORCH-003: `.cursor/mcp.json` enthält agentmemory + context7 (keine Hostinger-MCP im Repo-Default).
- REQ-ORCH-004: Scope HARD bis Ende 08-2026: nur dieses Repo.

## RTM
| REQ | Artefakt | Verify |
|-----|----------|--------|
| REQ-ORCH-001 | `AGENTS.md` | Datei vorhanden, Abschnitte Rolle/Quellen/Scope |
| REQ-ORCH-002 | `.cursor/rules/*.mdc` | 3 Dateien, alwaysApply |
| REQ-ORCH-003 | `.cursor/mcp.json` | keys agentmemory, context7 |
| REQ-ORCH-004 | `AGENTS.md` §Scope-Grenze | Text bis Ende 08-2026 |

## Testprotokoll
1. `test -f` für alle fünf Orchestrator-Dateien — erwartet OK
2. `jq -e '.mcpServers.agentmemory and .mcpServers.context7'` — erwartet OK
3. `jq -e '.mcpServers["hostinger-billing"]'` — erwartet fail (entfernt)
4. Kein Hermes Live-Cutover in diesem Change

## Geänderte Dateien
- `AGENTS.md` (updated)
- `.cursor/mcp.json` (updated)
- `.cursor/rules/00-charter.mdc` (created)
- `.cursor/rules/10-hermes-consolidation.mdc` (created)
- `.cursor/rules/20-safety-escalation.mdc` (created)
- `docs/standards/projects/orchestrator-cursor-anchor/CHANGE-LOG-2026-07-26.md` (created)
