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
2. **Zweiter-CEO-Mandat 2026-08-07** — `docs/standards/CEO-MISSION-2026-08-07.md`
   + `docs/standards/ARBEITSVORGABEN-v3.3.md` (§14) — Pascal-Direktive, geht
   Konflikten mit älterer Governance vor (neuestes Datum gewinnt).
3. `CHARTA.md` (Chat-Konsolidierung, §0–§16) — bestätigter, aber
   vereinfachter Auszug von (1), nicht Ersatz.
4. `design_guidelines.json` (Repo-Root, Stand 04.07.2026) — verbindliches
   Design. NICHT die ältere „Graphite Premium"-Referenz aus
   `nexify/02_regelwerke/GESAMTZIELBILD_V3.md` verwenden.

## Auftrag: Hermes-Workstation-Konsolidierung
Siehe `.cursor/rules/10-hermes-consolidation.mdc` für den vollständigen,
aktuellen Auftragstext. Wird dort gepflegt, nicht hier dupliziert.

## Proaktive Acquisition- & Gap-Scans (Pflicht)
Jeder Task: Acquisition/Lead/Conversion/Ops-Lücken scannen und fixen oder
Issue (`gtm` + `agent-fix` + `P1`). Rule:
`.cursor/rules/60-proactive-acquisition-gaps.mdc` · Radar:
`docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md`.

## Ausdrücklich ausgeschlossen (bereits geprüft, nicht erneut prüfen)
- **`0xNyk/awesome-hermes-agent`** — NousResearchs eigenes, unabhängiges
  „Hermes Agent"-Projekt. NICHTS von dort übernehmen. Dritte
  Namenskollision dieser Art — bei jedem Fund mit „Hermes" im Namen zuerst
  gegen NousResearch abgrenzen, bevor irgendetwas integriert wird.
- **n8n** — laut bestehender Entscheidung abgeschafft. Nicht aufnehmen,
  sofern nicht ausdrücklich widerrufen.
- **OpenAI Codex** (CLI / ChatGPT Codex / `@openai/codex` / `.codex/`) —
  abgeschaltet 2026-08-02. Primäragent ist **Cursor Agent / Cloud Agent**.
  Details: `docs/operations/CODEX-REMOVED-2026-08-02.md`.

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

## NO_CONFIRMATION (Cursor Agent Ops)

Agents arbeiten **confirmation-free**: kein „soll ich committen/pushen/PR
öffnen/mergen?“ — ausführen und Ergebnis melden. Diff-Tab ist kein Gate.

**HARD STOPs (bleiben):**
1. Hermes-Produktions-Cutover ohne Endabnahme
2. Echte Secret-Werte in Chat/Issues/Commits erfinden oder einfügen
3. Force-Push auf `main` / geschützte Branches
4. Kunden-/Regelwerk-Logik ohne Governance-Protokoll

Alles andere: auto (Hooks + `agent-branch-autopilot` + `pr-auto-merge`
inkl. Draft→ready wenn `automerge` + CI green). Rule:
`.cursor/rules/40-no-confirmation.mdc`.

## Branding
„NeXify AI by NeXify — chat it. Automate it." — durchgängig.

## P0 — Neukunden & Begeisterung
**Neukunden gewinnen und stets begeistern** ist Priorität P0 (Rule
`.cursor/rules/61-neukunden-begeisterung.mdc`). Jeder Task: hilft es
Neukunden zu gewinnen *oder* zu begeistern? Sonst depriorisieren.
Outbound/Scraping: Zero-Cost-Leads-Agent; Delight/Onboarding/Conversion-UX:
dieser Track (`docs/gtm/NEUKUNDEN-BEGEISTERUNG.md`).

## Sprache / Locale (verbindlich)
- **Standard:** Deutsch (`de` / `de-DE`) für Agent-Kommunikation, Produkt-UI und owned Copy.
- **NL:** Firmensitz (Venlo) — **kein** Default für Acquisition oder Apps.
- **EN:** nur Identifier / Upstream-UIs; Liste: `docs/operations/LOCALE-DE-STANDARD.md`.
- Cursor-Rule: `.cursor/rules/40-locale-de-standard.mdc`.

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

## Cursor Cloud specific instructions
> Für zukünftige Cloud-Agenten: Der Update-Script (läuft beim VM-Start)
> installiert bereits die Website-Deps (`pnpm --dir apps/website install
> --frozen-lockfile`). Diese Sektion nennt nur nicht-offensichtliche
> Start-/Run-Stolpersteine; Standardbefehle stehen in der Website-Skill
> (`.cursor/skills/website-dev/SKILL.md`) und im `README.md`.

### Website (`apps/website`) — primäres, voll lauffähiges Produkt
- Next.js 16 + React 19 + Tailwind v4, Paketmanager **pnpm**. Alle Befehle
  **aus `apps/website`** ausführen (Verzeichnis ist eigener pnpm-Workspace-Root
  mit eigenem `pnpm-lock.yaml`). Standardbefehle (lint/typecheck/test/build/dev):
  siehe `website-dev`-Skill.
- Dev-Server: `pnpm dev` → http://localhost:3000. Healthcheck: `GET /api/health`
  (JSON `{"status":"ok"}`). `/` ist unprefixed DE-Default (`lang="de"`, Cookie
  `NEXT_LOCALE=de`); Legacy `/{locale}/…` wird auf unprefixed umgeleitet.
  Default-Locale ist immer **de** — kein Accept-Language-Redirect nach NL.
- Next.js warnt beim Start über „multiple lockfiles / inferred workspace root"
  (Repo-Root-`pnpm-workspace.yaml` vs. `apps/website/…`) — **harmlos**, ignorieren.
- Ohne Backend: `/api/planner/plan` liefert eine deterministische lokale
  Schätzung (funktioniert offline, ist der beste Hello-World-Flow), während
  `/api/contact` und `/api/offers/request` bewusst 5xx liefern, bis
  `BACKEND_ORIGIN` (Proxy an echtes Backend) und/oder `RESEND_API_KEY` gesetzt
  sind.

### Backend (`backend`) — FastAPI, sekundär, läuft nur degradiert lokal
- **Nicht** im Update-Script (braucht System-Paket + venv). Setup einmalig:
  `sudo apt-get install -y python3.12-venv`, dann venv **außerhalb** des Repos
  anlegen (z. B. `~/.venvs/nexify-backend`) und `pip install -r
  backend/requirements.txt`.
- **Gotcha (Boot-Crash):** `server.py` mountet StaticFiles hart auf
  `/opt/nexifyai/repos/lead-pipeline/demos` und ruft `os.makedirs` darauf → ohne
  diesen (beschreibbaren) Pfad bricht der Start mit `PermissionError: /opt/nexifyai`
  ab. Vor dem Start einmalig anlegen:
  `sudo mkdir -p /opt/nexifyai/repos/lead-pipeline/demos && sudo chown -R "$(id -u):$(id -g)" /opt/nexifyai`.
- Start: `cd backend && uvicorn server:app --host 0.0.0.0 --port 8000`. Boot
  gelingt, meldet aber erwartungsgemäß „Supabase connection failed" (kein lokales
  Postgres auf :5432) und „email agent disabled" (keine IMAP-Creds) — graceful
  degradation, kein Fehler. Health: `GET /api/health` → `{"status":"ok",
  "db":"unavailable"}`. OpenAPI unter `/openapi.json`.
- Backend-Tests (`backend/tests/`) sind **Integrationstests gegen eine entfernte
  `REACT_APP_BACKEND_URL`** und laufen offline nicht durch; CI führt sie mit
  `continue-on-error` aus. Der CI-Backend-Job macht nur flake8 (nur E9,F63,F7,F82)
  + `ast`-Syntaxcheck von `server.py`/`portal/server.py`.

### Nicht vorhanden / irreführend
- Root-`docker-compose.yml` bringt **Harness/CI-Infra** hoch (nicht das Produkt);
  das im `README.md` erwähnte `deploy/docker-compose.yml` **existiert nicht**.
- Die „Brain"-Dienste (9Router, AgentMemory, LightRAG, CircuitBreaker) haben in
  diesem Repo **keinen Quellcode** — extern/privat, für lokale Dev-Arbeit nicht nötig.
