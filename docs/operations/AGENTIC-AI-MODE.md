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
# optional explizit:
bash scripts/gitlab-oss-smoke.sh
bash scripts/ensure-gitlab-remote.sh   # setzt das tokenfreie SSH-Remote 'gitlab'
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

**Setup:** `cp .cursor/mcp.json.example .cursor/mcp.json` — Secrets per Env setzen, **nie committen**.

Anleitung GitLab OSS: `deploy/mcp/gitlab-oss/README.md`

## Abweichungs-Scan

```bash
python3 scripts/soll-deviation-scan.py
# Report: test_reports/soll-deviation-scan.json
```

## Integrations-Langlauf (proaktiv)

Fuer kontinuierliche Integrationspruefung (OpenAPI, MCP, Monitoring, Domain-Routing, VCS-Wiring):

```bash
# Einmaliger Lauf
bash scripts/integration-longrun.sh

# Zyklisch, z. B. 24 Zyklen alle 15 Minuten
MAX_CYCLES=24 INTERVAL_SECONDS=900 bash scripts/integration-longrun.sh
```

Artefakte:

- `test_reports/soll-deviation-scan.json`
- `test_reports/longrun/integration-longrun-*.log`
- `test_reports/longrun/soll-deviation-scan-*.json`
- `test_reports/longrun/soll-deviation-delta-*.json`
- `test_reports/longrun/remediation-plan-*.json`
- `test_reports/longrun/remediation-gates-*.json`
- `test_reports/longrun/latest-integration-longrun.log`
- `test_reports/longrun/latest-soll-deviation-scan.json`
- `test_reports/longrun/latest-soll-deviation-delta.json`
- `test_reports/longrun/latest-remediation-plan.json`
- `test_reports/longrun/latest-remediation-gates.json`

Retention/Rotation:

- `KEEP_LAST` steuert, wie viele zeitgestempelte Longrun-Dateien pro Muster gehalten werden (Default: `20`).

Qualitaets-Gates:

- `MAX_P0`, `MAX_P1`, `MAX_P2`, `MAX_BLOCKED` definieren Grenzwerte fuer den Remediation-Backlog.
- `ENFORCE_GATES=1` aktiviert harte Durchsetzung (Longrun endet mit non-zero Exit bei Gate-Verletzung).

While-True Modus (dauerhaft):

- `MAX_CYCLES=0` aktiviert Endlosschleife (`while true`) fuer den Langlauf.
- `KILL_SWITCH_FILE` stoppt den Loop kontrolliert, sobald die Datei existiert.

Beispiel:

```bash
MAX_CYCLES=0 INTERVAL_SECONDS=900 ENFORCE_GATES=1 KILL_SWITCH_FILE=test_reports/longrun/KILL_SWITCH bash scripts/integration-longrun.sh
```

Hook-Guardrails:

- `AUTO_INSTALL_HOOKS=1` (Default) installiert/aktualisiert pro Zyklus lokale Git-Hooks (`post-merge`, `post-checkout`, `pre-push`).
- Hook-Installer: `bash scripts/install-agent-hooks.sh`
- `STRICT_PRE_PUSH=1` macht den lokalen `pre-push` Hook blocking bei Deviation-Fehlern.

GitHub Monorepo Clone Check:

- `CHECK_GH_CLONE=1` (Default) prueft pro Zyklus die reale Clone-Faehigkeit fuer das Monorepo.
- `GH_CLONE_REPO` steuert das Ziel-Repo (Default: `nexifyai-dev/nexify-agentur-plattform`).
- Script: `scripts/verify-gh-monorepo-clone.sh`

Zusatzchecks im Deviation-Scan:

- `gh` Verfuegbarkeit/Auth/Repo-View fuer `nexifyai-dev/nexify-agentur-plattform`
- lokale Hook-Integritaet (`.git/hooks/post-merge`, `.git/hooks/post-checkout`, `.git/hooks/pre-push`)

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

## Brain Dual-Write (optional)

Siehe `docs/operations/BRAIN-DUAL-WRITE.md`. Helper: `scripts/brain-dual-write.sh`.
Nicht als „überall aktiv“ dokumentieren — No-op ohne Env / ohne Hook-Path.

## Modell-Strategie

Verbindlich ist `docs/governance/GOVERNANCE.md` §5: DeepSeek V4 ist aktiv
und vollintegriert; Upstage befindet sich in geplanter, gestaffelter
Migration. Abweichende Cutover-Behauptungen benötigen einen aktualisierten
Governance-Nachweis.

**LightRAG Embedding IST (2026-08-02):** Upstage `embedding-passage` (nicht „nur Ollama bge-m3“).

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
