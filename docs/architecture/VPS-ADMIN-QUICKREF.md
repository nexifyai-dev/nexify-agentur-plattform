# VPS-Admin — Quick Reference
# Stand: 2026-06-20 14:33 UTC | Langlauf Phase 4

## System-Status-Check
```
Runtime:  bash /workspace/nexifyai-platform/scripts/start-runtime.sh --check
Brain:    curl -s http://127.0.0.1:9090/stats
Qdrant:   curl -s http://127.0.0.1:6333/collections/nexifyai_brain
Memory:   python3 -c "import sqlite3; conn=sqlite3.connect('/workspace/agentmemory.db'); print(conn.execute('SELECT COUNT(*) FROM memories').fetchone()[0])"
Disk:     df -h /
```
## Runtime Management
```
Start:    bash /workspace/nexifyai-platform/scripts/start-runtime.sh --daemon
Stop:     kill $(cat /tmp/nexify-workflow-runtime.pid)
Log:      tail -f /tmp/workflow-runtime.log
Health:   python3 /workspace/nexifyai-platform/services/runtime/workflow_health.py
```
## Key Paths
```
Company Config:   /workspace/nexifyai/ops/company-config.json
Integration Plan: /workspace/nexifyai/integration-plan.md
Evidence:         /workspace/nexify/10_evidence/workflow/
Runtime Root:     /workspace/nexifyai-platform/services/runtime/
Agentmemory DB:   /workspace/agentmemory.db
Shared State:     /workspace/nexify/04_register/SHARED_AGENT_STATE.json
```
## Known Constraints
- Container: kein docker, systemctl, crontab, journalctl
- HOME-Pfad: /home/hermeswebui/.hermes/profiles/expert-dev/home (rekursiv)
- Brain Write Token: fehlt → nur Lesezugriff auf Brain API
- Supabase Key: fehlt (P0)
