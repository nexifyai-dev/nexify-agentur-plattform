# NeXify AI — MASTER_PLAN.md

> **Single Source of Truth for NeXify Platform**
> **Last Updated:** 2026-06-20T14:30:00+00:00 (Round 4)
> **Version:** 1.1.0
> **Maintained by:** Automation Agent (automation-agent)

---

## 1. System Inventory

### Core Services

| Service | Port | Status | Health |
|---------|------|--------|--------|
| Paperclip (Factory) | localhost:3100 | 🟢 UP | HTTP 200 |
| Hermes Agent (Runtime+Gateway) | localhost:8787 | 🟢 UP | /health 200 |
| 9Router (LLM-Router) | localhost:20128 | 🟢 UP | 61 Modelle |
| agentmemory (iii) | localhost:3111 | 🟢 UP | REST-API |
| agentmemory (Viewer) | localhost:3113 | 🟢 UP | HTTP 200 |
| LightRAG | localhost:9622 | 🟢 UP | HTTP 307 |
| Spaether | localhost:8900 | 🟢 UP | HTTP 404 |
| Traefik | *:80/443 | 🟢 UP | systemd active |

### Deprecated Services
| Service | Status | Deprecated |
|---------|--------|------------|
| Brain API (:9090) | 🔴 DOWN | Q2 2026 |
| Qdrant (:6333) | 🔴 DOWN | Q2 2026 |
| Gateway (:8645) | 🔴 DOWN | Merged into Hermes :8787 |

> **Updated 2026-07-13**

### MCP Servers (Stand 2026-07-13)

| Server | Status | Note |
|--------|--------|------|
| agentmemory :3111 | ✅ REST-API | MCP via Cloudflare Tunnel agentmemory.nexifyai.cloud |
| brain :9090 | ❌ DEPRECATED | Q2 2026 |
| qdrant :6333 | ❌ DEPRECATED | Q2 2026 |
| you-search | ❌ disabled | API 403 |

> **Updated 2026-07-13:** Brain/Qdrant deprecated. agentmemory jetzt via REST-API direkt.

### Active Profiles (4 — Stand 2026-07-13)

| Profile | Model | Role |
|---------|-------|------|
| architect | ds/deepseek-v4-pro-max | Architecture, Planning |
| developer | ds/deepseek-v4-pro | Development, Building |
| reviewer | ds/deepseek-v4-flash | Code-Review, QA |
| devops | ds/deepseek-v4-flash | DevOps, Automation |

> **Updated 2026-07-13:** Von 16 Profilen auf 4 DeepSeek-first konsolidiert.

### Cron Jobs (22 active — Stand 2026-07-13)

| ID | Name | Schedule | Status |
|----|------|----------|--------|
| da19e7efa49f | kanban-auto-dispatch | every 1m | ✅ active |
| ddbab9c21114 | qa-sweep-auto | every 60m | ✅ active |
| c67951bfefd1 | github-token-refresh | */45 * * * * | ✅ active (network-engineer profile) |

### Known Issues

| 12 | **Pre-Task Compliance** — 0/6 → 6/6 ✅ | P0 | ✅ Script + SOP erstellt |
| 13 | **BRAIN_API_URL 8420→9090** — 11 Referenzen gefixt | P0 | ✅ Alle Code-Defaults korrigiert |
| 14 | **Brain Auth-Header** Bearer→X-Brain-Token | P1 | ✅ brain_client.py gefixt |
| 15 | **studienkolleg .gitignore** 220→56 Zeilen | P2 | ✅ dedupliziert |
| 16 | **Bookando Stale Stashes** 3→0 | P2 | ✅ bereinigt |
| 17 | **Corrupted Profile gelöscht** | P2 | ✅ shell-artifact cleaned |
| 18 | **Shared Agent State** neu erstellt | P1 | ✅ /workspace/nexify/04_register/SHARED_AGENT_STATE.json |
|| 19 | **Root CLAUDE.md** neu erstellt | P2 | ✅ /workspace/CLAUDE.md (entry point) |
|| 20 | **Memory Bootstrap deployt** — 3 kanonische Dateien in /workspace/nexify/memory/ | P1 | ✅ Alle 18 SOUL.md + 14 Profile synchronisiert |
|| 21 | **Scheduled Tasks 500 (agentur-admin)** — `jobs.json` owned by root, hermeswebui kann nicht lesen | P1 | ✅ GELÖST — `chown 1000:1000 /root/.hermes/.../cron/jobs.json`. Owner im Container: hermeswebui, readable+writable ✓, 2 Cron-Jobs valide. Host-Mount /root/.hermes→/home/hermeswebui/.hermes |
||| 22 | **Paperclip/ai-team Runtime-Abweichung** — Dashboard erreichbar (ai-team.nexifyai.cloud), Docker Manager zeigt paperclip-krv8: Created/0 Container. CEO failed after 1s (kein LLM-Routing). Keine AI-OS-Integration (kein Brain, Qdrant, Hermes). Keine Produktivnutzung. | P2 | Runtime-Mapping in `/workspace/nexify/ai-os/NEXIFY_AI_OS_PAPERCLIP_AI_TEAM_RUNTIME_MAPPING.md` |
||| 23 | **MEMORY.md Format-Drift** — Hermes memory tool kann nicht schreiben (file on disk mismatch) | P2 | Dokumentiert — manuelles Rewrite oder migration nötig |
| 24 | **9Router MITM Setup** — Antigravity/Copilot/Cursor MITM-Proxy live | P2 | ✅ Port 8443, systemd, iptables 443→8443, 2 Smoke-Tests bestanden |

## Resolved & Closed (4)

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1 | agentmemory SQLite REST (40000) — läuft, nicht persistent bei Container-Neustart | P1 | cron-watchdog aktiv (alle 2min) |
| 2 | **Gateway Port 8644 vs 8645** — Host-Gateway=8645, Container hat kein Gateway (WebUI managed) | P1 | ✅ Geklärt — kein Fix nötig |
| 3 | **agentmemory Memory-Druck** GEFIXT via systemd-Restart | P1 | ✅ am 2026-06-20 via VPS systemd restart |
| 4 | you-search MCP deprecated — deaktiviert | P2 | ✅ done |
| 5 | Cron-Jobs in jobs.json vs state.db sync: GEFIXT | P1 | ✅ beide via hermes cron create registered |
| 6 | nexify-agent-system Skill 40000→3111 Port-Update | P2 | ✅ 12 Patches applied |
| 7 | **qdrant MCP**: @app.call_tool() fehlte — gefixt | P0 | ✅ wirkt seit Container-Neustart |
| 8 | **Gateway cron.scheduler_provider**: plugins/cron shadow fix | P1 | ✅ pre-import in gateway.py + 8 deps installiert |
| 9 | **api.bookando.de DNS** bei 1blu — Vercel Domain registriert auf canonical bookando-de-riw8, DNS fehlt | P1 | CNAME+TXT bei 1blu nötig |
| 10 | **studienkolleg-aachen** GitHub Token — Remote ohne Token | P2 | ✅ Entwarnung |
| 11 | **Docker Volumes** 8.9GB → 0B reclaimable | P3 | ✅ cleaned: 21→16 volumes, Disk 35%→20% |
| 12 | **Supabase Pascal Bucket PUBLIC** — Masterprompt+Logos exponiert | P0 | ✅ Bucket privatisiert, Dateien gelöscht |
| 13 | **Cloudflare API Token** expired (401) | P2 | Tokens rotieren lassen |

### Resolved (4)

| # | Issue | Resolution |
|---|-------|------------|
| R1 | Duplicate auto-dispatch.sh | Removed scripts/ copy |
| R2 | Legacy cron entry kanban-auto-dispatch | Consolidated to modern format |
| R3 | **agentmemory Port 40000→3111** in MASTER_PLAN + MCP-Script + Bashrc | Fixed: MCP servers registered, port corrected, stats endpoint fixed |
| R4 | **Cron-Jobs state.db sync** | hermes cron create for kanban-auto-dispatch + qa-sweep-auto |

---

## 3. Changelog

| Date | Change | Agent |
|------|--------|-------|
| 2026-06-20 | Initial MASTER_PLAN created | automation-agent |
| 2026-06-20 | agentmemory restarted, duplicate cron cleaned | automation-agent |
| 2026-06-20 | **MCP-Server fix:** brain, qdrant, agentmemory registriert. agentmemory Port 40000→3111. Stats-Endpoint-Fix. Bashrc persistent. MASTER_PLAN port korrigiert. | expert-data |
| 2026-06-20 | **MCP-Infrastruktur-Fixes:** qdrant @app.call_tool() decorator, agentmemory stats endpoint, you-search disabled, commands → /app/venv/bin/python3, SSH VPS bidirektional, gateway cron import fix + 8 deps, agentmemory REST (40000) + watchdog | mcp-agent |
|| 2026-06-20 | **Langlauf-Session:** root-owned files gefixt (0 verbleibend), Docker Build Cache 55GB→0B, api.bookando.de DNS dokumentiert+Vercel registriert, Gateway Port Diskrepanz geklärt, RUNBOOK+MASTER_PLAN+Changelog aktualisiert | mcp-agent |
|| 2026-06-21 | **Memory Bootstrap systemweit deployt:** 3 kanonische Dateien in /workspace/nexify/memory/, 18 SOUL.md mit Bootstrap-Block, 14 Profile mit USER.md+MEMORY.md synchronisiert, nexify-ceo-Profil auf orchestration_only | nexifyai-ceo |
|| 2026-06-21 | **Kanban/Tasks AI-OS-Schicht aktiviert:** Bridge-API mit Evidence/Review/Columns erweitert, Dispatcher 5/5 korrekt, 47/47 Tests bestanden. Security-Gate: nexify-ceo key-frei, ceo gesperrt. | nexify-ceo |
|| 2026-06-21 | **Scheduled Tasks P1 Root Cause:** jobs.json owned by root → 500. Fix-Befehl dokumentiert, Host-Fix ausstehend. | nexify-ceo |
|| 2026-06-21 | **Container-Inventur:** Service Registry mit Docker-Manager-Stand aktualisiert (8 Services: core/support/customer/unknown). Paperclip/ai-team als P2-Runtime-Abweichung dokumentiert. | nexify-ceo |
# test trigger
