# FILE: /docs/governance/08_evidence/GITLAB_MIRROR_DEVIATION_2026-07-27.md
# NIR: 27.07.2026 12:10
# UPDATED: 27.07.2026 12:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Evidence zur GitHub-GitLab-Mirror-Abweichung und ihrer Repository-Reparatur.
# WHY: Grüne Workflows hatten einen fehlenden Mirror verdeckt.
# BEST-PRACTICE: Repository- und Produktionsabweichungen getrennt nachweisen.
# PITFALL: V-GL-03: Ein übersprungener Mirror darf nicht als Erfolg gelten.
# DEPENDS: mirror-to-gitlab.yml, GitLab CE, GitHub Actions Secrets
# DOCS-REF: docs/operations/REPO-SYNC-STRATEGY.md
# SESSION: copilot-cli-6ad64251

# GitLab Mirror Deviation Evidence — 2026-07-27

## Ergebnis

| Bereich | Soll | Ist | Status |
|---|---|---|---|
| GitHub Source of Truth | `main` auf aktuellem GitHub-Commit | Clone auf GitHub `main` synchronisiert | behoben |
| Pre-Task-Gates | 7/7 portabel grün | zuvor 2/7 durch feste VPS-Pfade | behoben |
| Mirror-Workflow | Fehler bei fehlenden Credentials | zwei Workflows; fehlende Secrets ergaben Erfolg | behoben |
| GitLab-Projekt | per API und Git erreichbar | Projekt 7 unter `nexifyai_group/nexifyai` aktiv | behoben |
| GitLab Mirror-Ref | entspricht GitHub `main` | GitLab `main` entspricht GitHub `main` | behoben |
| GitLab CI | Pipeline-Konfiguration gültig | Secret-Detection-Template kollidierte mit `only` | behoben |

## Repository-Reparatur

- `gitlab-sync.yml` entfernt; `mirror-to-gitlab.yml` ist der einzige Mirror-Pfad.
- Fehlende `VPS_GITLAB_URL`, `VPS_GITLAB_USERNAME` oder
  `VPS_GITLAB_TOKEN` brechen den Workflow ab.
- Mirror-Ziel muss HTTPS verwenden.
- Push-Fehler werden nicht mehr als Warnung oder Erfolg maskiert.
- Pre-Task-Gates leiten den Repository-Pfad aus dem Skriptstandort ab.
- AgentMemory, Skills, Masterplan, Shared State und Tenant-Isolation werden
  gegen die aktuellen Governance-Artefakte geprüft.

## Produktionsbefund und Reparatur

- GitLab-Weboberfläche ist lokal und öffentlich erreichbar.
- Das funktionsfähige Mirror-Ziel ist Projekt 7,
  `nexifyai_group/nexifyai`.
- Das Projekt enthält den vollständigen GitHub-Stand mit 358 Commits und den
  Branches `main` und `feat/route-hermes-dash-tunnel`.
- Ein Maintainer-Projekttoken mit `read_repository` und `write_repository`
  wurde für den GitHub-Mirror erstellt; sein Klarwert ist ausschließlich als
  GitHub-Actions-Secret gespeichert.
- `VPS_GITLAB_URL`, `VPS_GITLAB_USERNAME` und `VPS_GITLAB_TOKEN` sind im
  GitHub-Repository konfiguriert.
- Die ersten drei Pipelines scheiterten vor Job-Erzeugung, weil das
  eingebundene Secret-Detection-Template `rules` verwendet, während der
  Repository-Override `only` verwendete. Der Override verwendet nun ebenfalls
  `rules`.
- Das alte Projekt 6 (`root/nexify-agentur-plattform`) besitzt keine Route und
  bleibt als nicht blockierender Cleanup-Befund bestehen.

## Produktionsgrenze

Das funktionsfähige Projekt 7 und seine Mirror-Credentials wurden verwendet.
Das routenlose Altprojekt 6 und historische Token-Datensätze wurden nicht
verändert oder gelöscht.
