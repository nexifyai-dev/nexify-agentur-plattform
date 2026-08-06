# Hermes WebUI Container-Patches
Stand: 2026-08-06T11:13:23+02:00
Container-Pfad: /app (Host-Prozess PID 1446475)
Upstream: /root/hermes-webui (NousResearch hermes-webui, HEAD 320789a)

Diese Patches werden bei jedem Container-Update/Neustart benötigt:
1. Sidebar-Rail-Buttons (LightRAG + AgentMemory im selben Tab)
2. Reverse-Proxy /lightrag → 9622, /agentmemory → 3113 mit Pfad-Rewrites
3. BackToHermes-Rück-Button-Injektion in AgentMemory + LightRAG
