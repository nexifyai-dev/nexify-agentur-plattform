# WhatsApp bridge paused (error-loop)

**UPDATED:** 2026-08-02 09:25

## Action taken
- Disabled/stopped: `whatsapp-health-monitor.timer`, `whatsapp-bridge.service`, `nexifyai-whatsapp.service`, `whatsapp-baileys.service`
- Reason: continuous QR reconnect spam (~every 3 min) without paired session = error loop / log noise

## Re-enable checklist
1. Pair Baileys session under `WHATSAPP_AUTH_DIR` successfully (one QR cycle).
2. Pin LLM/router model for any WhatsApp agent path to allowlist (e.g. `solar-mini` / `nexifyai-cheap-first`) — never unbounded model.
3. `systemctl enable --now whatsapp-bridge.service` (or baileys unit — single owner only).
4. Optionally re-enable `whatsapp-health-monitor.timer` after healthy for 15 min.
5. Smoke: send test message; confirm no QR spam in `journalctl -u whatsapp-bridge -f`.
