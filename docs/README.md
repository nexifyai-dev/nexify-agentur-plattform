# Dokumentation — NeXify AI by NeXify

> **chat it. Automate it.** · Repo: `nexifyai-dev/nexify-agentur-plattform`

Kurzer Index der öffentlichen und betrieblichen Docs in diesem Monorepo. Verbindliche Regelwerke stehen unter `governance/` — nicht hier duplizieren.

## Live & Einstieg

| Ressource | URL / Pfad |
|-----------|------------|
| Website (Live) | https://www.nexifyai.cloud |
| API | https://api.nexifyai.cloud |
| Produkt-README | [`../README.md`](../README.md) |
| Agenten-Hinweise | [`../AGENTS.md`](../AGENTS.md) |
| Design SoT | [`../design_guidelines.json`](../design_guidelines.json) |

## Ordner

| Ordner | Inhalt |
|--------|--------|
| [`governance/`](governance/) | Primärquelle: Regeln, SOPs, Register, Audits (~139 Dokumente) |
| [`operations/`](operations/) | Dual-VCS-Sync, Agentic Mode, Event-Ingest |
| [`architecture/`](architecture/) | Architektur, Hosting-Blueprints, Integrationspläne |
| [`design/`](design/) | Design-Audits (historisch); kanonisch ist Root-`design_guidelines.json` |
| [`concepts/`](concepts/) | Konzept-Kurzüberblick |
| [`gtm/`](gtm/) / [`go-to-market/`](go-to-market/) | Go-to-Market |
| [`live/`](live/) | Live-Betriebsnotizen |
| [`decisions/`](decisions/) | Architektur-/Produktentscheidungen |
| [`standards/`](standards/) | Normen-/Standardverweise |
| [`research/`](research/) | Recherche |

## Snapshot-Dateien im Docs-Root

Die Dateien `GESAMT-INTEGRATION-STATUS.md`, `GITHUB-WORKER-GUIDE.md` und `GITHUB_ACTIONS_SETUP.md` sind **Zeitpunkt-Snapshots / Setup-Guides**. Bei Widerspruch zu `README.md`, `AGENTS.md` oder `operations/REPO-SYNC-STRATEGY.md` gewinnen die aktuelleren Quellen — und Live-Evidence schlägt Doku.

## Dual-VCS (Kurz)

GitHub = Source of Truth (PR, Actions, VPS-Deploy). GitLab OSS = Mirror + CI/VPS-Pfad. Details: [`operations/REPO-SYNC-STRATEGY.md`](operations/REPO-SYNC-STRATEGY.md).

## Absichtlich nicht hier

Deep Governance-Umschreibungen, Legacy-„Graphite Premium“-Redesigns und VPS-interne Brain-Quelltexte gehören nicht in diesen Index.
