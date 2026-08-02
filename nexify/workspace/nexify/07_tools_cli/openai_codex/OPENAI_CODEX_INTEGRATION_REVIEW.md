# OpenAI Codex — DEPRECATED (NeXify)

**Status:** ENTFERNT / ABGESCHALTET  
**Datum Entscheidung:** 2026-08-02  
**Ersatz:** Cursor Agent / Cursor Cloud Agent  
**Ops-Note:** `docs/operations/CODEX-REMOVED-2026-08-02.md`

## Entscheidung

OpenAI Codex (CLI / ChatGPT Codex / `@openai/codex`) wird bei NeXify **nicht mehr genutzt**.
Der einzige AI-Coding-Agent für Repo- und Control-Plane-Arbeit ist **Cursor**.

## Historie (kurz)

- 2026-06-12: Integration Review P0-008 — Codex war nie Systemmaster, nur optionales Zusatzwerkzeug.
- 2026-08-02: Vollständige Entfernung der Repo-Harness (`.codex/`), Docs/Configs umgestellt, Host-Config `~/.codex` disabled.

## Nicht anfassen

- Upstream-Vendor-Bäume (Hermes Provider-Katalog `openai-codex`, 9router/rtk/caveman Upstream-Docs) bleiben unverändert — das sind Fremdprodukte, kein NeXify-Agent-Betrieb.
- Kein Hermes-Cutover, kein Live-Rewrite der Hermes-WebUI.

## Querverweise

- `docs/operations/CODEX-REMOVED-2026-08-02.md`
- `AGENTS.md` / `.cursor/rules/` — Cursor Control Plane
