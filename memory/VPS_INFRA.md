# NeXify VPS – Infrastruktur & Ops (Stand 05.07.2026)

## Zugang
- VPS: Hostinger KVM8, `srv1243952.hstgr.cloud`, IPv4 `72.62.152.47`, Ubuntu 26.04
- SSH: `ssh -i /root/.ssh/nexify_vps root@72.62.152.47` (Key via Hostinger-API hinterlegt, ID 528586)
- Hostinger API-Token: in Chat (VnMnz…) – VM-ID 1243952. Docker-Manager-API: `/api/vps/v1/virtual-machines/1243952/docker`
- Cloudflare: Zone `nexifyai.cloud` = `2b96bbce5033dd364440906cea99b086`. Voll-Zugriff nur mit GLOBAL_KEY+EMAIL (aus backend/.env); der API_TOKEN ist nur zonen-lesend.

## Routing (WICHTIG)
- Öffentliche Website `nexifyai.cloud` + `www` → **Vercel** (CNAME vercel-dns, NICHT proxied). Nicht auf dem VPS!
- Fast alle übrigen Subdomains → **Cloudflare Tunnel** `aed8a968-…` (Service `cloudflared-main.service`, Config `/root/.cloudflared/config.yml`). Ingress dort editieren, NICHT nginx.
- SSL-Mode der Zone = flexible; Tunnel ist E2E-verschlüsselt.
- Weitere Tunnel: `cloudflared-vsk*` (vorratsgesellschaften), `cloudflared-paperclip` (ai-team → :49916).

## Kern-Endpoints (extern, verifiziert)
- webui.nexifyai.cloud / work.nexifyai.cloud → Hermes WebUI (:8787, gebrandet „NeXify AI") – DAS ist das NeXify AI ADMIN
- ai-router.nexifyai.cloud → 9router (:20128)
- api.nexifyai.cloud → :8001 · dashboard → :9119 · rag → ragflow · open → :3150 (OpenHands)

## Hermes Agent
- API (OpenAI-kompatibel): `127.0.0.1:8642` (health `/health`, v0.17.0). Gateway/Cron: `hermes-gateway.service` (jetzt autoritativ + reboot-sicher).
- Binaries: `/usr/local/lib/hermes-agent/venv`. State: `/root/.hermes`. Profil: `agentur-admin`.
- API-Key (= 9router-Key „system"): `sk-97034a83a8033b14-ijhhux-4a3f10ba`

## 9router (:20128, ai-router.nexifyai.cloud)
- v0.5.18. 7 aktive Provider: DeepSeek, Xiaomi MiMo (sk- + token-plan tp-), NScale, Codex(OAuth nexify.login@gmail.com), Vercel AI Gateway, You.com.
- 21 Modelle. Combo `nexifyai-combo-llm` (→ glm-5.2, leakt Reasoning – meiden für Kundentexte).
- Sauberes Chat-Modell: `ds/deepseek-chat` (→ deepseek-v4-flash). `deepseek-v4-pro` legt Text in reasoning_content → content leer, NICHT nutzen.
- ⚠️ `mimo/mimo-v2.5` (sk-Konto) = 402 Insufficient balance. Token-Plan (tp-) hat noch Guthaben.
- Compose: `/docker/9router-6kxn/`. Dashboard-Login: INITIAL_PASSWORD in dessen `.env`.

## Session-Fixes 05.07.2026 (alle verifiziert, 0 failed/crash-loops danach)
1. `hermes-gateway.service`: war 130k+ Restarts (Lock-Konflikt mit transientem systemd-run). → Override-Dropin `--profile agentur-admin gateway run --replace`, transienten Runner gestoppt, autoritativ+enabled.
2. `nexify-gateway.service`: `ExecStartPre … >/dev/null` (systemd interpretiert `>` literal) → disabled (redundant).
3. `cloudflared-brain.service`: Duplikat des Haupt-Tunnels (gleiche Tunnel-ID/creds) → disabled.
4. `cloudflared-dns.service`: `proxy-dns` seit cloudflared 2026.2.0 entfernt → disabled + `resolved.conf.d/nexify-doh-local.conf` auf natives DoT (1.1.1.1) umgestellt.
5. `cloudflared-paperclip.service`: YAML-Indentation kaputt (Z.6-10) → nur ai-team-Ingress, repariert (ai-team 530→403 app-level).
- Backups: `/root/config-backups/<ts>-gateways` und `-cloudflared`.

## Website-LLM (mein /app-Backend) – 9router-Integration
- Primär: MiMo direkt (`MIMO_BASE_URL_OPENAI`, Modell `mimo-v2.5-pro`).
- Auto-Fallback: `NINEROUTER_BASE_URL=https://ai-router.nexifyai.cloud/v1`, Key = system-key, Modell `ds/deepseek-chat`.
- Code: `server.py` `llm_complete()` + `open_chat_stream()` fangen Fehler/leere Antwort ab → 9router. Verifiziert (401→Fallback liefert sauberes Deutsch).

## Offen (P1/P2)
- **SSO – UMGESETZT & E2E-verifiziert (05.07.)**: Website-Admin → Einmal-HMAC-Token (60s, Nonce gegen Replay) → Hermes-WebUI `/api/auth/sso` → `create_session()` + Cookie → eingeloggt.
  - WebUI-Patch (Basis-Repo `/root/hermes-webui-nexify`): `api/auth.py` PUBLIC_PATHS + `api/routes.py` `handle_get` SSO-Block + Nonce-Store (Marker `# NEXIFY-SSO`). Secret `HERMES_WEBUI_SSO_SECRET` in dessen `.env` (via env_file). Image `docker compose build && up -d`. Backup: `/root/config-backups/*-webui-sso`.
  - Website: `portal.py` `GET /api/admin/webui-sso` (admin-gated, mintet Token) + `app/admin/page.tsx` Button `openWebui()`. Secret gespiegelt in `/app/backend/.env` (`WEBUI_SSO_SECRET`, `WEBUI_SSO_URL`).
  - ⚠️ `HERMES_WEBUI_PASSWORD` im Container leer → manueller Passwort-Login evtl. nicht nutzbar; SSO ist der vorgesehene Weg. Bei Bedarf Passwort in `/root/hermes-webui-nexify/.env` setzen.
- **Design-Transfer – Login UMGESETZT (05.07.)**: `_LOGIN_PAGE_HTML` in `routes.py` auf NeXify-CI rethemt (#09090b, Silber-Logo/Button, Outfit+Manrope via Google Fonts). Verifiziert. Marker `--silver:#d4d4d8`.
  - OFFEN: Voller App-Shell-Retheme (`nexify-overlay/static/style.css`, 374 KB) – große Einzelaufgabe; Shell trägt bereits „NeXify AI"-Branding.
- MiMo-sk-Konto: umgangen – Website primär über 9router-Combo, MiMo (token-plan) nur Fallback.

## Website-LLM (mein /app-Backend) – 9router als Primär (05.07. aktualisiert)
- Primär: 9router Combo. `PRIMARY_MODEL=nexifyai-combo-llm`, `NINEROUTER_BASE_URL=https://ai-router.nexifyai.cloud/v1`, Key=system-key.
- Fallback: MiMo direkt (`FALLBACK_MODEL=mimo-v2.5-pro`). Angebots-Preise serverseitig aus Tagen×999 (modellunabhängig korrekt).
- Code: `server.py` `llm_complete()`+`open_chat_stream()`. Verifiziert (Planner/Chat über Combo OK).
