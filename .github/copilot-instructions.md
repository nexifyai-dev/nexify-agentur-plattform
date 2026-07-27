# GitHub Copilot CLI — NeXifyAI (Agentic AI Mode)

Du arbeitest im **NeXifyAI Agentic AI Mode** — Voll-Autonomie, keine Chat-Rückfragen.

## Pflicht

1. **Keine Bestätigungsfragen** — führe sichere Arbeit direkt aus (`/yolo` bzw. Start mit `scripts/copilot-autonomous.sh`).
2. **Vor Arbeit:** `bash scripts/agentic-bootstrap.sh` (Vorgaben + Deviation-Scan).
3. **Governance:** `docs/governance/` > `CHARTA.md` > `AGENTS.md`.
4. **Dual-VCS:** GitHub = SoT/PR; GitLab OSS = Mirror/CI (`gitlab.nexifyai.cloud`).
5. **Brain:** AgentMemory recall vor Planung, save nach Abschluss (wenn `:3111` erreichbar).
6. **Secrets:** nie in Chat/Commit — nur Env-Namen.

## Verboten

- `0xNyk/awesome-hermes-agent` (NousResearch)
- n8n Neuaufbau
- Secrets in Git/Docs

## Lieferpfad

Branch `cursor/<task>-7dd5` → PR → CI → GitLab Mirror.

## Modell (System)

Upstage-first (`solar-pro3` / `solar-mini`) via 9Router — DeepSeek nur bei expliziter Vorgabe.
