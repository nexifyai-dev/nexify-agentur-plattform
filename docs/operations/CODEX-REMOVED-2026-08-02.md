# CODEX entfernt — Ops-Note (2026-08-02)

**Entscheidung:** „Codex nutzen wir nicht mehr.“  
**Ersatz:** Cursor Agent / Cursor Cloud Agent (Control Plane).  
**Scope:** NeXify / `nexify-agentur-plattform` First-Party + Host-Configs.

## Repo

- Verzeichnis `.codex/` gelöscht (config, AGENTS.md, agents/*.toml).
- Docs, Skills, ECC-Bundle, MCP-Bootstrap, SOPs und Agent-Config auf Cursor umgestellt.
- Historische Review-Datei `nexify/workspace/nexify/07_tools_cli/openai_codex/` auf DEPRECATED gesetzt.
- Branch: `cursor/remove-codex-7dd5`.

## Runtime / Host (kein systemd-Job gefunden)

| Artefakt | Aktion |
|----------|--------|
| systemd `*codex*` units/timers | Keine gefunden — nichts zu disable |
| `/opt/nexifyai/config/autopilot/jobs.yaml` | Kein Codex-Job |
| GitHub/GitLab CI | Kein Codex-Invoke |
| `~/.codex` (`/root/.codex`) | **disabled** → umbenannt nach `~/.codex.disabled-20260802` (Inhalt erhalten, nicht zerstört) |
| Symlink `~/.codex/config.toml` → `/workspace/nexifyai/codex/config.toml` | war ohnehin tot; mit Rename deaktiviert |

## Bewusst nicht angefasst

- `apps/hermes/**` Upstream-Provider `openai-codex` (Fremdprodukt-Code; kein Hermes-Cutover).
- Vendored Upstream-Docs unter `nexify/workspace/.../07_tools_cli/{9router,rtk,caveman}/source/**`.
- Backups unter `/opt/nexifyai/backups/**` und `docs.old/**`.

## Verifikation

```bash
rg -i 'codex' --glob '!.codex/**' AGENTS.md CLAUDE.md agent-config.yaml .cursor .claude .agents scripts deploy/mcp docs memory
# Erwartung: nur Deprecation-/Retired-Hinweise, kein aktiver Harness
test ! -d .codex
test ! -e ~/.codex && test -d ~/.codex.disabled-20260802
```
