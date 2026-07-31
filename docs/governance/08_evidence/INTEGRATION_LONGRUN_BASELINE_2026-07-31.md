# FILE: /docs/governance/08_evidence/INTEGRATION_LONGRUN_BASELINE_2026-07-31.md
# NIR: 31.07.2026 09:20
# UPDATED: 31.07.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Baseline-Evidence fuer den proaktiven Integrations-Langlauf im Repo/Codespace.
# WHY: Reproduzierbare Sicht auf Integrationsgrad und offene Vollintegrations-Gaps.
# BEST-PRACTICE: Scan + Longrun als wiederholbarer, machine-readable Nachweis.
# PITFALL: Cloud-Agent ohne VPS-Secrets zeigt Runtime-WARNs; das ist expected bis Auth/Netz freigegeben ist.
# DEPENDS: scripts/soll-deviation-scan.py, scripts/integration-longrun.sh, scripts/mcp-health-codespace.sh
# DOCS-REF: docs/operations/AGENTIC-AI-MODE.md, docs/governance/GOVERNANCE.md

# Integration Longrun Baseline — 2026-07-31

## Scope

- Repository: nexifyai-dev/nexify-agentur-plattform
- Umgebung: Codespace (ohne produktive Secrets)
- Ziel: Proaktive Integrationspruefung fuer OpenAPI, OpenMCP, Monitoring, AgentMemory, LightRAG, VCS-Wiring, Domain-Zentralisierung

## Durchgefuehrte Checks

1. `python3 scripts/soll-deviation-scan.py`
2. `bash scripts/integration-longrun.sh`
3. `bash scripts/mcp-health-codespace.sh`
4. `bash scripts/gitlab-oss-smoke.sh`
5. `bash scripts/ensure-gitlab-remote.sh`

## Ergebnis (Baseline)

- Status: `ERROR=0`
- WARN-Gruppen:
  - `CONTROL-PLANE-SPLIT` (dashboard/webui unterschiedliche Targets)
  - Runtime-Checks gegen lokale Dienste ohne VPS-Bind/Secrets (`agentmemory`, `lightrag`, `9router`)
  - Public Runtime Checks (`api`, `grafana`, `prometheus`) nicht erreichbar aus aktueller Umgebung

## Relevante Artefakte

- `test_reports/soll-deviation-scan.json`
- `test_reports/longrun/integration-longrun-20260731T090724Z.log`

## Priorisierte Folgeaktionen

1. P0: Control-Plane zentralisieren (`dashboard.nexifyai.cloud` in `webui.nexifyai.cloud` integrieren/redirecten).
2. P0: Secrets fuer Codespace-Lauf setzen (`AGENTMEMORY_SECRET`, `GITLAB_PERSONAL_ACCESS_TOKEN`) und erneut health-checken.
3. P1: Externe Monitoring- und OpenAPI-Erreichbarkeit gegen produktive Tunnel-Konfiguration gegenpruefen.
4. P1: Longrun zyklisch laufen lassen (z. B. alle 15 Minuten) und Baseline-Diff dokumentieren.
