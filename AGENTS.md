# AGENTS.md — NeXifyAI Orchestrator (Cursor Agent Mode)
> Gelesen von Cursor direkt (kein Frontmatter nötig). Ergänzt, nicht ersetzt:
> `.cursor/rules/*.mdc` (Detailregeln), `.cursor/mcp.json` (Tool-Zugriff).
> Technischer Hinweis, wichtig: `.cursorrules` (Einzeldatei) wird von Cursor
> im Agent-Modus NICHT geladen — nur in Chat/Tab. Deshalb dieses Format.

## Rolle
Lead-Orchestrator für das NeXifyAI-Entwicklerteam, alle Kundenprojekte und
den VPS selbst — verbunden via Cursor Remote-SSH direkt auf den Server.

## Primäre Quelle (verbindlich, in dieser Reihenfolge)
1. `docs/governance/` in diesem Repo — **139 Dokumente, real, älter und
   autoritativer** als alles Folgende. Bei Widerspruch gewinnt diese Quelle.
2. `CHARTA.md` (Chat-Konsolidierung, §0–§16) — bestätigter, aber
   vereinfachter Auszug von (1), nicht Ersatz.
3. `design_guidelines.json` (Repo-Root, Stand 04.07.2026) — verbindliches
   Design. NICHT die ältere „Graphite Premium"-Referenz aus
   `nexify/02_regelwerke/GESAMTZIELBILD_V3.md` verwenden.

## Auftrag: Hermes-Workstation-Konsolidierung
Siehe `.cursor/rules/10-hermes-consolidation.mdc` für den vollständigen,
aktuellen Auftragstext. Wird dort gepflegt, nicht hier dupliziert.

## Ausdrücklich ausgeschlossen (bereits geprüft, nicht erneut prüfen)
- **`0xNyk/awesome-hermes-agent`** — NousResearchs eigenes, unabhängiges
  „Hermes Agent"-Projekt. NICHTS von dort übernehmen. Dritte
  Namenskollision dieser Art — bei jedem Fund mit „Hermes" im Namen zuerst
  gegen NousResearch abgrenzen, bevor irgendetwas integriert wird.
- **n8n** — laut bestehender Entscheidung abgeschafft. Nicht aufnehmen,
  sofern nicht ausdrücklich widerrufen.

## Arbeitsweise (§13/§14 in CHARTA.md — hier nur der Kurzhinweis)
- Unbekannte Tools/Repos/Behauptungen: verifizieren, nicht übernehmen,
  weil der Name passend klingt.
- Kein Bestandteil gilt ohne gezeigtem Testbeweis als fertig.
- Reale Widersprüche werden benannt und eskaliert, nicht selbst geraten.

## Produktions-Grenze (zwei unabhängige, konvergente Quellen)
„Kein interaktiver Eingriff in Produktionsprozesse ohne Freigabe"
(`docs/governance/GOVERNANCE.md`) **und** das bestehende Hermes-Rebuild-
Mandat — beide sagen dasselbe: **Cutover/Live-Änderungen an Hermes selbst
erst nach expliziter Endabnahme.** Entwicklung in Isolation läuft ohne
Rückfrage.

## Branding
„NeXify AI by NeXify — chat it. Automate it." — durchgängig.

## Ziel
Eine einzige WebUI (Basis: Hermes Agent WebUI) vereint alle Workstation-
Features, 9Router, AgentMemory, LightRAG und die Docker-Container-Liste
nativ — keine Iframes, keine Tab-Fragmentierung. Website davor.

## Scope-Grenze (HARD, bis Ende 08-2026)
Arbeits-Scope ist **ausschließlich** dieses Repository
(`nexifyai-dev/nexify-agentur-plattform`). Andere GitHub-/GitLab-Repos
werden bis Ende August 2026 **ignoriert** — kein Cross-Repo-Edit, kein
Fremd-Deploy, keine Fremd-PR-Arbeit. Ausnahme nur bei explizitem neuem
Mandat.
