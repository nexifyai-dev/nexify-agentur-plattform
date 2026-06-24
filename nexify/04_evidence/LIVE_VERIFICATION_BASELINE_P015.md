# Live Verification Baseline — P0-015

> Stand: 2026-06-12

## Ergebnisse

| Check | Status | Detail |
|---|---|---|
| Agent Descriptions | ✅ PASS | 151 Files, ~2.5k Tokens (Ziel < 15k) |
| 9Router Models | ✅ PASS | 9 Models (reasoner + flash + combo) |
| Brain Health | ✅ PASS | 774 entries, status ok |
| agentmemory Health | ✅ PASS | healthy, 271 Functions |
| Docker Core Services | ✅ PASS | 9Router, 2x Hermes, Traefik, agentmemory, qdrant alle up |
| Auth Conflict | ⚠️ PASS (Shell) | ANTHROPIC_AUTH_TOKEN noch in Shell-Env, settings.json ist korrigiert |
| Missing Artifacts | ✅ PASS | 0 pending — alle 16 erstellt |
| Nacht-Dokumente | ✅ PASS | 3 Dokumente verankert, Pfadabweichungen per Symlink korrigiert |
| MCP | ✅ PASS | 5 Connected, 38 Needs Auth (erwartet), 28 Failed (erwartet) |

## Offene Restrisiken

| Risiko | Grund | Status |
|---|---|---|
| ANTHROPIC_AUTH_TOKEN in Shell-Env | .bashrc/.profile korrigiert, aber laufende Session sourcet alte Werte | Beim nächsten Login verschwunden |
| Hermes-3fach-Container | 3 Hermes-Instanzen (fix, lq3f, nexify) | Konsolidierungsplan P0-005 erstellt |
| Kein Volume-Backup | Docker-Volumes ohne dokumentierte Backup-Strategie | Incident Response Policy MA-011 erstellt |
| Supabase-Ports offen | 5 Ports auf 0.0.0.0 | In VPS_CLEANUP_PLAN dokumentiert |
