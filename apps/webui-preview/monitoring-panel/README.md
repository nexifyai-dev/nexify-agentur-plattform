# FILE: apps/webui-preview/monitoring-panel/README.md
# NIR: 31.07.2026 12:26
# UPDATED: 31.07.2026 12:26
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Preview Stub — native Monitoring Panel (Grafana) für WebUI-Zentrale
# WHY: Gap Monitoring TEIL; kein Prod Hermes Patch; CF DNS grafana blocked
# DEPENDS: docs/live/MONITORING-WEBUI-NATIVE-POINTER-2026-07-31.md
# KATEGORIE: platform

## Start

```bash
python3 -m http.server 8793 --directory apps/webui-preview/monitoring-panel
# → http://127.0.0.1:8793/
```

## Verify

```bash
curl -sS http://127.0.0.1:3000/api/health
curl -sk --resolve grafana.nexifyai.cloud:443:127.0.0.1 https://grafana.nexifyai.cloud/api/health
```

Kein Mount in Prod WebUI ohne Preview-Smoke + Endabnahme.
