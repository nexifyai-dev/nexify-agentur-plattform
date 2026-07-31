# FILE: /docs/governance/08_evidence/INTEGRATION_LONGRUN_BASELINE_2026-07-31.md
# NIR: 31.07.2026 09:20
# UPDATED: 31.07.2026 09:35
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

- Status: `OK=32, WARN=6, ERROR=0`
- WARN-Gruppen:
  - Runtime-Checks gegen lokale Dienste ohne VPS-Bind/Secrets (`agentmemory`, `lightrag`, `9router`)
  - Public Runtime Checks (`api`, `grafana`, `prometheus`) nicht erreichbar aus aktueller Umgebung

## Delta seit erstem Lauf

- `CONTROL-PLANE-SPLIT` ist aufgeloest (Ingress-Zentralisierung auf WebUI-Gateway)
- Longrun erzeugt jetzt pro Zyklus Scan-Snapshots und Delta-JSON

## Relevante Artefakte

- `test_reports/soll-deviation-scan.json`
- `test_reports/longrun/integration-longrun-20260731T091308Z.log`
- `test_reports/longrun/soll-deviation-scan-20260731T091308Z.json`
- `test_reports/longrun/soll-deviation-delta-20260731T091308Z.json`
- `test_reports/longrun/remediation-plan-20260731T091745Z.json`

## Automatischer Maßnahmenplan

Der Longrun erstellt jetzt pro Zyklus einen priorisierten Maßnahmenplan.

- Aktuelle Verteilung: `P0=0, P1=3, P2=3, P3=0`
- Blockierte Maßnahmen (ohne Secrets/VPS-Bind im Codespace): `3`
- Ziel: Priorisierte Abarbeitung ohne manuelle Triage-Runden

## Qualitaets-Gates (neu)

Langlauf besitzt jetzt optionale harte Gates auf Basis des Maßnahmenplans:

- Parameter: `MAX_P0`, `MAX_P1`, `MAX_P2`, `MAX_BLOCKED`
- Schalter: `ENFORCE_GATES=1`
- Gate-Artefakte: `test_reports/longrun/remediation-gates-*.json` + `latest-remediation-gates.json`

Verifiziert am 31.07.2026:

- Soft-Mode (`ENFORCE_GATES=0`): Lauf erfolgreich, Gate-Report erzeugt
- Hard-Mode (`ENFORCE_GATES=1`, `MAX_P1=2`): Lauf endet korrekt mit Exit-Code `2` bei Gate-Verletzung

## Priorisierte Folgeaktionen

1. P0: Secrets fuer Codespace-Lauf setzen (`AGENTMEMORY_SECRET`, `GITLAB_PERSONAL_ACCESS_TOKEN`) und erneut health-checken.
2. P1: Externe Monitoring- und OpenAPI-Erreichbarkeit gegen produktive Tunnel-Konfiguration gegenpruefen.
3. P1: Longrun zyklisch laufen lassen (z. B. alle 15 Minuten) und Delta-Reports in Governance-Evidence uebernehmen.
