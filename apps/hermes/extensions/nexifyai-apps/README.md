# NeXify AI Apps

Fünf Workstation-Tabs für die Hermes-WebUI-Sidebar (Extension `nexifyai-apps`, Runtime-Spiegel: `/workspace/nexifyai/webui-data/extensions/nexifyai-apps/`).

| Tab | Ziel | Quelle |
|-----|------|--------|
| Brain (AgentMemory) | https://agentmemory.nexifyai.cloud/ | assets/app-memory.js |
| Wissen (LightRAG) | https://rag.nexifyai.cloud/lightrag/webui/ | assets/app-wissen.js |
| Router (9Router) | https://ai-router.nexifyai.cloud/ | assets/app-router.js |
| Automation (n8n) | https://n8n.nexifyai.cloud/ (Port 5678) | assets/app-automation.js |
| Paperclip | PLATZHALTER — Factory-API aktiv auf Port 3100, Web-UI existiert nicht (API-only, Re-Setup 2026-08-10) | assets/app-paperclip.js |

Hinweise:
- Paperclip wurde am 2026-08-10 per Pascal-Mandat reaktiviert (Factory-API auf :3100). Da keine Web-UI existiert, zeigt der Tab ein CI-gestyltes Info-Panel statt Iframe. Entscheidung Re-Setup/Web-UI-Erweiterung: mit Pascal abstimmen (siehe Kanban t_6f0ba09e).
- Sync-Regel: Repo ist Master — Änderungen zuerst hier, dann in den Runtime-Spiegel kopieren + MD5 prüfen.
