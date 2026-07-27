# Agentic AI Mode — Betriebshandbuch

**Stand:** 2026-07-27  
**Repo:** `nexifyai-dev/nexify-agentur-plattform`  
**Kategorie:** `platform`  
**VOLLSPEZIFIKATION:** scaling=OPS · artefacts=created/updated in diesem Doc + `scripts/*`

## Ziel

Einheitlicher **Agentic AI Mode** für Cursor Cloud-Agent, Desktop und VPS-SSH:

1. Vorgaben laden (Governance, nicht Chat-Kontext raten)
2. Abweichungen IST vs SOLL automatisch erkennen
3. **GitHub** (PR/CI, Source of Truth) + **GitLab OSS** (VPS Mirror/Deploy) vollintegriert
4. AgentMemory als systemweites Brain (wenn Runtime erreichbar)

## Session-Start (Pflicht)

```bash
cd /path/to/nexify-agentur-plattform
bash scripts/agentic-bootstrap.sh
```

Oder in Cursor: Command **`/agentic-bootstrap`** (siehe `.cursor/commands/agentic-bootstrap.md`).

### Vorgaben-Hierarchie

| Rang | Quelle |
|------|--------|
| 1 | `docs/governance/` (139 Dokumente) |
| 2 | `CHARTA.md` |
| 3 | `.cursor/rules/*.mdc` |
| 4 | `AGENTS.md` |

Bei Widerspruch gewinnt die höhere Zeile.

## Dual-VCS-Architektur

```
GitHub (nexifyai-dev/nexify-agentur-plattform)
  ├── PR + GitHub Actions (ci.yml, test, build)
  ├── mirror-to-gitlab.yml (push main → VPS GitLab)
  └── Cursor Cloud Agents API (tools/cursor_agents/)

GitLab OSS (gitlab.nexifyai.cloud / VPS :8922)
  ├── .gitlab-ci.yml (lint → test → build → deploy:vps)
  └── MCP: gitlab-oss (@zereight/mcp-gitlab + PAT)
```

Details: `docs/operations/REPO-SYNC-STRATEGY.md`

## MCP-Matrix (Cursor)

| Server | Zweck | Cloud-Agent | VPS/Desktop |
|--------|-------|-------------|-------------|
| **agentmemory** | Brain recall/save | ⚠️ nur wenn :3111 erreichbar | ✅ |
| **context7** | Library-Docs | ✅ | ✅ |
| **gitlab-oss** | Self-hosted GitLab | ⚠️ PAT + Tunnel | ✅ |
| GitHub (Plugin) | PR/Issues | ✅ OAuth | ✅ |
| Built-in `Gitlab` | gitlab.com SaaS | ❌ nicht für OSS | ❌ |

**Setup:** `cp .cursor/mcp.json.example .cursor/mcp.json` — Token lokal setzen, **nie committen**.

Anleitung GitLab OSS: `deploy/mcp/gitlab-oss/README.md`

## Abweichungs-Scan

```bash
python3 scripts/soll-deviation-scan.py
# Report: test_reports/soll-deviation-scan.json
```

| Severity | Bedeutung |
|----------|-----------|
| ERROR | Sofort fixen (z. B. getrackte Secrets, fehlende Pflichtdateien) |
| WARN | Runtime/Auth — Action `blocked`/`pending`, kein Chat-Ask |
| OK | SOLL erfüllt |

## Lieferpfad (Best Practice)

1. Branch `cursor/<kurzbeschreibung>-7dd5`
2. Kleine Diffs, conventional commits
3. `bash scripts/agentic-bootstrap.sh` vor Push
4. Draft-PR → GitHub CI grün
5. Merge `main` → Mirror triggert GitLab Pipeline
6. `deploy:vps` auf GitLab (manuell/automatisch je Policy)

Cursor-Command: `/pr-flow`

## Modell-Strategie (System-Default)

**Upstage-first** seit Cutover 2026-07-27:

- Heavy: `solar-pro3` / `nexifyai-heavy`
- Balanced: `solar-pro2` / `nexifyai`
- Fast: `solar-mini` / `nexifyai-cheap-first`

DeepSeek nur bei expliziter User-Wahl. SoT: `agent-config.yaml` + Workspace-Rule `9router-model-allowlist`.

## Ausgeschlossen

- `0xNyk/awesome-hermes-agent` (NousResearch)
- n8n (Abbau)
- Secrets in Git/Docs/Chat

## Session-Ende

- `memory_save` wenn AgentMemory erreichbar
- Deviation-Report prüfen
- PR aktualisieren

## Referenzen

- `AGENTS.md` — Orchestrator-Rolle
- `agent-config.yaml` — technische Agent-Config
- `docs/governance/13_betriebshandbuch/NEXIFY_STANDARD_OPERATING_PROTOCOL_V5.md`
- `docs/governance/07_audits_reports/BEST_PRACTICES_REPORT_2026-06-20.md`
- `.cursor/commands/mcp-health.md`, `pr-flow.md`
