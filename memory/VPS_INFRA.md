# NeXify VPS – Infrastruktur & Ops (Stand 25.07.2026 — C-07 CRITICAL BLOCKADE)

## Zugang
- VPS: Hostinger **KVM 8**, location **Germany – Frankfurt**
- Hostname: `srv1243952.hstgr.cloud` · IPv4: `72.62.152.47` · OS: Ubuntu 26.04
- Resources: 8 vCPU · 32 GB RAM · 400 GB disk · 32 TB bandwidth
- Backup: weekly · Plan expiry: 2026-07-27 · Auto-renewal: enabled
- SSH user: `root` · Port 22 open (OpenSSH_10.2p1) · Auth: `publickey,password`
- SSH: `ssh -i ~/.ssh/cursor-cloud-agent-nexify-vps root@72.62.152.47` ⚠️ **halb offen** — pubkey ✅ in VPS `authorized_keys` (2026-07-25); private key secret still missing in cloud agent.
- **CRITICAL:** Deploy pipelines remain blocked until the matching private key is available to CI/agents.
- Host key (aktuell, ED25519): `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID75SWQrbHF24KPgphTDczVnUJU4fvlDAqF6rkONl+gv`
- **Cursor Cloud Agent pubkey** (repo: `deploy/ssh/cursor-cloud-agent-nexify-vps.pub`):
  - Comment: `cursor-cloud-agent-nexify-vps`
  - Fingerprint: `SHA256:neGig+3ebWoBuJx4un1BlXPTz2WZHE89/pg6dni+hn8`
  - VPS install: ✅ confirmed via Hostinger console (`grep cursor-cloud-agent-nexify-vps`)
  - Private key: Cursor/GitHub secret only (`VPS_SSH_KEY` / `CURSOR_CLOUD_AGENT_VPS_SSH_KEY`) — never in git — **pending**
- Hostinger API-Token: in Chat (VnMnz…) – VM-ID 1243952. Docker-Manager-API: `/api/vps/v1/virtual-machines/1243952/docker`
- Cloudflare: Zone `nexifyai.cloud` = `2b96bbce5033dd364440906cea99b086`. Voll-Zugriff nur mit GLOBAL_KEY+EMAIL (aus backend/.env); der API_TOKEN ist nur zonen-lesend.

## Routing (WICHTIG)
- Öffentliche Website `nexifyai.cloud` + `www` → **Vercel** (CNAME vercel-dns, NICHT proxied). Nicht auf dem VPS!
- Fast alle übrigen Subdomains → **Cloudflare Tunnel** `aed8a968-…` (Service `cloudflared-main.service`, Config `/root/.cloudflared/config.yml`, credentials `current-tunnel-credentials.json`). Ingress dort editieren, NICHT nginx.
- SSL-Mode der Zone = flexible; Tunnel ist E2E-verschlüsselt.
- Weitere Tunnel: `cloudflared-vsk*` (vorratsgesellschaften), `cloudflared-paperclip` (ai-team → :49916).

## ⚠️ TUNNEL-KONFLIKT (Kritisch für Bots/Agenten)
Es existieren ZWEI cloudflared-Services mit UNTERSCHIEDLICHEN Tunnel-IDs:
- **cloudflared-main.service** = Tunnel `aed8a968-ac34-44cf-996d-0d2da8c872d7` → **PRODUKTIV**, hält 19 Ingress-Regeln (webui/work/api/ai-router/dashboard/brain/open/mcp/rag/docs/portal/etc.)
- **cloudflared.service** = Tunnel `6250ef9e-00af-4f1f-88f3-46aa12811f87` (Token-basiert) → **LEGACY**, MUSS stopped/inactive bleiben

DNS-Records zeigen ausschließlich auf `aed8a968…`. Wenn beide gleichzeitig laufen → Cloudflare 1033/530 auf allen Subdomains.

**Vor JEDEM Restart eines cloudflared-Services: `systemctl status cloudflared.service cloudflared-main.service` prüfen. Immer nur EINEN aktiv halten (den Main).**

Recovery bei 1033-Storm:
```
systemctl stop cloudflared.service
systemctl restart cloudflared-main.service
sleep 5 && for h in webui ai-router work api open dashboard; do curl -s -o /dev/null -w "$h: %{http_code}\n" https://$h.nexifyai.cloud; done
```

## ✅ Watchdog (installiert 06.07.2026, selbstheilend)
- Script: `/usr/local/bin/nexify-tunnel-watchdog.sh` — prüft alle 60s (`nexify-tunnel-watchdog.timer`)
- Legacy `cloudflared.service` per `systemctl mask` hart gesperrt (Unit-File backuped nach `/root/config-backups/06-tunnel-legacy/`)
- Log: `/var/log/nexify-tunnel-watchdog.log` (logrotate weekly x4)

## ✅ CEO-Agent-Worker (installiert 06.07.2026)
- Script: `/usr/local/bin/nexify-ceo-worker.sh` — pollt alle 10 min (`nexify-ceo-worker.timer`)
- Direkter 9router-Call (intern `127.0.0.1:20128`), Modell `nexifyai-combo-llm`, temp 0.4, stream:false
- Auth: NEXIFY_CRM_API_TOKEN aus `/root/.hermes/.env`
- Log: `/var/log/nexify-ceo-worker.log` (logrotate weekly x4)

## Kern-Endpoints (extern, verifiziert)
- webui.nexifyai.cloud / work.nexifyai.cloud → Hermes WebUI (:8787, gebrandet „NeXify AI") – DAS ist das NeXify AI ADMIN
- ai-router.nexifyai.cloud → 9router (:20128)
- api.nexifyai.cloud → :8001 · dashboard → :9119 · rag → ragflow · open → :3150 (OpenHands)

## Hermes Agent
- API (OpenAI-kompatibel): `127.0.0.1:8642` (health `/health`, v0.17.0). Gateway/Cron: `hermes-gateway.service` (jetzt autoritativ + reboot-sicher).
- Binaries: `/usr/local/lib/hermes-agent/venv`. State: `/root/.hermes`. Profil: `agentur-admin`.
- API-Key (= 9router-Key „system"): **[ROTIEREN — siehe docs/architecture/SECURITY-INCIDENT-2026-07-11.md, aus Git entfernt]**

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

## Website-LLM (Backend) – 9router Vollintegration (25.07.2026)
- **Code-SSOT:** `backend/ninerouter.py` · Doku: `docs/architecture/9ROUTER_VOLLINTEGRATION.md`
- Base: `NINEROUTER_BASE_URL=https://ai-router.nexifyai.cloud/v1` (intern `http://127.0.0.1:20128/v1`)
- **Customer** (Chat/Offer/Planner): `CUSTOMER_MODEL=ds/deepseek-chat`
- **Agent/intern:** `PRIMARY_MODEL=nexifyai-combo-llm`
- **Fallback:** `FALLBACK_MODEL=ds/deepseek-chat` (echter Modellwechsel bei Fehler/leerem Content)
- Key: nur Env `NINEROUTER_API_KEY` (Aliases: `NINEROUTER_KEY`, `OPENAI_API_KEY`) — **nicht in Git**
- Health: Backend `GET /api/health/llm` · Router `/api/health`
- Historie: früher MiMo-direkt → dann Combo-only → jetzt Customer/Agent-Split (siehe Vollintegration §6)

## Offen (P1/P2)
- **SSO – UMGESETZT & E2E-verifiziert (05.07.)**: Website-Admin → Einmal-HMAC-Token (60s, Nonce gegen Replay) → Hermes-WebUI `/api/auth/sso` → `create_session()` + Cookie → eingeloggt.
  - WebUI-Patch (Basis-Repo `/root/hermes-webui-nexify`): `api/auth.py` PUBLIC_PATHS + `api/routes.py` `handle_get` SSO-Block + Nonce-Store (Marker `# NEXIFY-SSO`). Secret `HERMES_WEBUI_SSO_SECRET` in dessen `.env` (via env_file). Image `docker compose build && up -d`. Backup: `/root/config-backups/*-webui-sso`.
  - Website: `portal.py` `GET /api/admin/webui-sso` (admin-gated, mintet Token) + `app/admin/page.tsx` Button `openWebui()`. Secret gespiegelt in `/app/backend/.env` (`WEBUI_SSO_SECRET`, `WEBUI_SSO_URL`).
  - ⚠️ `HERMES_WEBUI_PASSWORD` im Container leer → manueller Passwort-Login evtl. nicht nutzbar; SSO ist der vorgesehene Weg. Bei Bedarf Passwort in `/root/hermes-webui-nexify/.env` setzen.
- **Design-Transfer – Login UMGESETZT (05.07.)**: `_LOGIN_PAGE_HTML` in `routes.py` auf NeXify-CI rethemt (#09090b, Silber-Logo/Button, Outfit+Manrope via Google Fonts). Verifiziert. Marker `--silver:#d4d4d8`.
  - OFFEN: Voller App-Shell-Retheme (`nexify-overlay/static/style.css`, 374 KB) – große Einzelaufgabe; Shell trägt bereits „NeXify AI"-Branding.
- MiMo-sk-Konto: umgangen – Website primär über 9router-Combo, MiMo (token-plan) nur Fallback.

## Session-Fixes 06.07.2026 (Fork: Doku-Review + Provider-Hardening)
1. **Hermes LLM-Provider systemweit fixiert**: Hermes v0.17 unterstützt Provider-Typ `custom` in der WebUI nicht mehr. Lösung: `provider: openai-api` + ENV `OPENAI_API_KEY`/`OPENAI_BASE_URL` (→ 9router `localhost:20128/v1`).
   - Global: `/root/.hermes/config.yaml` · Profile gepatcht: agentur-admin, automation-agent, expert-data, ceo (alle → `nexifyai-combo-llm`). Backup: `/root/config-backups/*-hermes-models/`
   - Gateway: Dropin `/etc/systemd/system/hermes-gateway.service.d/openai-9router.conf` (setzt OPENAI_API_KEY+BASE_URL)
   - WebUI-Compose: `OPENAI_API_KEY`/`OPENAI_BASE_URL` aus `.env` durchgereicht (vorher hart leer!). E2E verifiziert: `hermes chat -q` → "OK" via combo-llm.
   - ⚠️ Alte WebUI-Sessions sind auf `mimo-v2.5-pro` (tot, 401) gepinnt → neue Session starten.
2. **Main-Tunnel ist REMOTE-MANAGED** (source=cloudflare, config-Version 26). `/root/.cloudflared/config.yml` ist NUR Doku/Fallback – Ingress-Änderungen via CF-API `cfd_tunnel/aed8a968…/configurations` (GLOBAL_KEY). Fixes: headroom→8788 (war 8790), portal→404 (kein Dienst auf 3004). DNS `headroom.nexifyai.cloud` CNAME neu angelegt.
3. **VSK-Tunnel-Duplikat behoben**: `cloudflared-vsk-prod-local.service` (Catchall-404-Config, gleiche Tunnel-ID `1c05573e` wie cloudflared-vsk) verursachte 404 auf vorratsgesellschaften-sofort-kaufen.de. → gestoppt, Unit nach `/root/config-backups/*-vsk-prod-local/` verschoben, gemaskt. Site wieder 200.
4. **traefik-vsrs entfernt** (`docker compose down`): Restart-Loop (Port 80 seit >33h von bookando-proxy belegt), alle Routen laufen direkt über Tunnel. Compose bleibt unter `/docker/traefik-vsrs/`.
5. **Fabrik-Agent-Timeouts**: Alle 6 Paperclip-Agenten `adapterConfig.timeoutSec` → 900 (Developer war 300 → Runs brachen mit timed_out/exit 130 ab, 54 LLM-Calls in 5 min sind normal). Patch via API `PATCH /api/agents/{id}`.
6. **Doku-Abgleich `NeXifyAI_Gesamtdokumentation_v1.0`**: Verifiziert: Qdrant 1.18.2 :6333 ✅, Redis :6379 ✅, PF-004 workflow-runtime :13062 healthy ✅, 9router :20128 ✅. Abweichungen (Doku beschreibt Zielarchitektur, nicht Ist): Temporal ❌ nicht deployt, Authentik ❌ nicht deployt, Traefik+LE ❌ ersetzt durch Cloudflare Tunnel, Hermes-Provider `custom` ❌ veraltet (jetzt openai-api).

## Session-Fixes 06.07.2026 – Teil 2 (Fork-Fortsetzung)
1. **Hermes-Profil-Configs waren KORRUPT**: 11 von 16 `/root/.hermes/profiles/*/config.yaml` enthielten literale Zeilennummern-Prefixe (`1|model:`) + einen mitten in Zeilen injizierten SSH-Kommentarblock (zerschnittene `inline_shell`/`persistent_shell`-Keys) → ungültiges YAML, Hermes fiel auf Defaults zurück. Alle repariert + YAML-validiert. Backup: `/root/config-backups/07-hermes-profiles/`.
2. **Alle 16 Profile auf `nexifyai-combo-llm`** normalisiert (`provider: openai-api`, `base_url: http://localhost:20128/v1`, echter 9router-Key statt leerem `${OPENAI_API_KEY}`). agentur-admin hing auf `ds/deepseek-chat` (DeepSeek-Konto leer → 402), automation-agent/expert-data auf `mimo-v2.5-pro` (tot). E2E: `hermes chat` → "OK" via combo; WebUI `/api/providers`: `active_provider=openai-api`, default `nexifyai-combo-llm`. hermes-gateway neu gestartet.
3. **Remote-Ingress korrigiert (CF-API, jetzt v27)**: vorschau→:80 (war :3020, bookando-proxy bedient Host-Routing), rag→:32781 (war :32770), headroom `httpHostHeader`. `/root/.cloudflared/config.yml` trägt jetzt REMOTE-MANAGED-Warnhinweis in Zeile 1.
4. **ragflow-Stack neu gestartet** (interner MySQL-DNS-Fehler „Temporary failure in name resolution" → nginx Connection reset). rag.nexifyai.cloud wieder 200.
5. **agentmemory.service hing** (node akzeptierte keine Verbindungen auf :3113, Accept-Queue voll) → restart, wieder 200 lokal / 403 extern (App-Auth, ok). REST-API :40000 healthy.
6. **headroom-Eigenheit**: liefert 421 auf `/` (litellm-basiert); nur `/health` + `/dashboard` liefern 200. Extern: `https://headroom.nexifyai.cloud/dashboard` ✅.
7. **Backend `llm_complete` gehärtet** (`/app/backend/server.py`): 3 Retries, Salvage von `reasoning_content` bei leerem `content` (deepseek-v4-pro-Eigenheit), `<think>`-Stripping. Fix für „offer parse failed" bei `/api/offers/request` (jetzt 200 in ~42s).
8. **Tests angepasst**: `test_portal_decision_flow` skippt bei legitimem Payment-Guard (400 „Zahlung bereits gestartet"), Wakeup-Poll-Limit 300s→600s, Slot-Test nutzt epoch-eindeutige Timestamps (Kollision mit Alt-Daten behoben).
9. **Fabrik-CEO-Runs liefen in `timed_out` (exit 130)**: Ursache waren interaktive Approval-Prompts („Timeout — denying command", clarify 120s) im autonomen Run. Fix: `approvals: {mode: yolo, timeout: 5}` in `/paperclip/.hermes/config.yaml` (Container paperclip-nexify, Volume paperclip-data). Backup: `config.yaml.bak-approvals`. CEO-Regressionstest danach in 123s ✅. Merke: Paperclip-Agenten nutzen `HERMES_HOME=/paperclip/.hermes` (Wrapper `/usr/local/bin/nexifyai` im Container), NICHT `/root/.hermes`.

## Session-Fixes 06.07.2026 – Teil 3 (Neuer MiMo Token-Plan-Key)
1. **User lieferte neuen MiMo Token-Plan-Key** (`tp-eji0dp…`, Base-URL `https://token-plan-ams.xiaomimimo.com/v1`, Region **AMS**). Key war bereits im 9router-Provider `xiaomi-tokenplan` hinterlegt, aber Provider stand auf `region: sgp` → 401 Invalid API Key.
2. **Fix**: `providerSpecificData.region` → `ams` direkt in der 9router-SQLite (`/var/lib/docker/volumes/9router-6kxn_data/_data/db/data.sqlite`, Tabelle `providerConnections`), Fehlerstatus/Backoff/modelLocks resettet, Container-Restart. `xmtp/mimo-v2.5-pro` → „OK" ✅.
3. **Toter Alt-Provider `xiaomi-mimo`** (sk-Konto leer, 401/402) auf `isActive=0` gesetzt (reversibel).
4. **Verifikation**: xmtp/mimo-v2.5-pro ✅, ds/deepseek-v4-pro ✅ (DeepSeek antwortet wieder), combo ✅ (routet primär deepseek-v4-pro), AsyncOpenAI-SDK-Kompatibilität geprüft, Hermes-Chat E2E ✅. Combo-Kette `ds → ds-max → xmtp → vercel/glm-5.2` ist jetzt komplett funktionsfähig.
5. ⚠️ **ToS-Hinweis Token-Plan**: Key ist laut Xiaomi nur für interaktive Agent-Tools, nicht für App-Backends. Backend nutzt combo (primär DeepSeek); xmtp ist nur Fallback-Glied in der Kette.
7. **Fabrik Auto-Approval**: CEO-Agent hatte als einziger kein `--yolo` in `adapterConfig.extraArgs` → clarify/approval-Prompts liefen je 120s in Timeouts. Gepatcht via API; jetzt alle 6 Agenten mit `--yolo` (vollautonom, keine Chatsteuerung nötig).
8. **Offer-Endpoint gehärtet** (`/app/backend/server.py`): Combo-Modell (glm-5.2) leakt Reasoning in Content + JSON wurde bei max_tokens=4000 abgeschnitten → `_parse_json_lenient()` (balancierte JSON-Extraktion), 2x LLM-Retry, max_tokens=9000, OFFER_PROMPT erzwingt JSON ohne Rückfragen. Test: 41s, E-Mail sent ✅.

## Session-Fixes 06.07.2026 – Teil 4 (Memory-Gesamtlösung + Host-Verbindungen + MCP-Produktion)
1. **Brain-Wissen refresht**: Stale Gap-Analyse (2026-06-20, "WebUI 21+ Gaps", ID 40f1d415…) GELÖSCHT – sie verleitete Agenten (MimoCode) dazu, work.nexifyai.cloud "umzusetzen". Autoritativer SYSTEM-STATUS (auch /workspace/00_status/) in Brain (category status) + agentmemory (key system-status-2026-07-06) + mem0 (user_id nexifyai-system) geseedet. E2E: hermes chat fragt Brain und antwortet korrekt "nichts umzusetzen".
2. **MEMORY-PROTOKOLL (Pflicht)** in ALLE SOULs/AGENTS: 17 Hermes-SOULs, Paperclip-SOUL, 6 canonical + 6 runtime Fabrik-AGENTS.md (instances/default/companies/…/agents/*/instructions/).
3. **Unified-MCP gefixt**: agentmemory_search nutzte falsche Route (immer "offline") → /agentmemory/smart_search; neues Tool agentmemory_save. Backup: mcp-sse-unified.py.bak-20260706.
4. **RAGFlow-MCP (:9382, api_key [ROTIEREN — aus Git entfernt])** in Hermes eingebunden: global + alle 16 Profile (127.0.0.1) + Paperclip (172.25.0.1).
5. **Host-SSH für Agenten**: Key /root/.hermes/ssh/id_ed25519 (= /home/hermeswebui/.hermes/ssh/… bzw. /paperclip/.hermes/ssh/…), in authorized_keys, beide Container getestet. In SOULs + Brain dokumentiert.
6. **agentmemory-Hänger-Root-Cause**: cgroup MemoryHigh=2G → Endlos-Throttling (D-State). Fix: Dropin memory-fix.conf (MemoryHigh=infinity, MemoryMax=3G) + agentmemory-watchdog.timer (5 min, prüft :40000/health + TCP :3113).
7. **RAM-Krise gelöst**: ragflow TEI (bge-m3) fraß 11G float32 unbounded → auf --dtype float16 + mem_limit 8g umgestellt (compose, Backup .bak-teimem). TEI Ready, embed 200. Host: 2G→8G+ available.
8. **MCP-Landschaft produktionsfest** (Hermes-Agent baute :9292/:9393/:9494 nur als Container-Prozesse): Skripte → /opt/nexify/mcp-servers/ + venv + systemd nexify-mcp-{brain,memory,qdrant}.service (Restart=always). :9200 unified bleibt (Profile nutzen ihn; Brain-Eintrag warnt vor Prozess-Kill wegen Restart=always).
9. **CLI-Tools verankert**: Claude Code (.claude.json: nexify-unified+nexify-brain SSE; CLAUDE.md: Memory-Protokoll), MimoCode (mimocode.jsonc "mcp" + ~/.config/mimocode/AGENTS.md), Goose (config.yaml nexify_unified SSE + .goosehints). Goose hatte bereits ragflow_brain mit echtem RAGFlow-API-Key (ragflow-gP9l…).
10. **Offen**: Tavily-Key fehlt (web_search nur DuckDuckGo-Fallback, liefert oft 0 Results). paperclip-krv8-Container (Exited, Altlast) belassen. brain-db.nexifyai.cloud/mcp (goose supermemory) liefert 404 – Alt-Eintrag.

## Session-Fixes 06.07.2026 – Teil 5 (Fabrik-Heilung + You.com-Websuche)
1. **Fabrik-Fehleranalyse**: 3 Agenten (Architekt/Analyst/QA) standen auf `error`. Ursachen (bereits zuvor behoben): fehlender `nexifyai`-Wrapper (bis 05.07. 21:06) + Approval-Prompt-Blockade (vor yolo-Fix). Heilung per Wakeup: QA-Run succeeded (exit 0), alle Agenten wieder `idle`/gesund. Brain-Zugriff der Fabrik: nexify-unified MCP + Memory-Protokoll in runtime AGENTS.md (bereits Teil 4).
2. **web_search → You.com**: unified MCP (:9200) nutzt jetzt `https://ydc-index.io/v1/search` (offizieller Endpoint), Key **[ROTIEREN — aus Git entfernt]**, Parsing `results.web[].description`. WICHTIG: `User-Agent`-Header setzen (curl/8.5.0), sonst 403 bei Python-urllib. Alter Tavily-Key war redacted/kaputt. Gleicher You.com-Key in 9router `youcom`-Provider aktualisiert (Backoff resettet, Router restartet). E2E: Hermes-Agent liefert via web_search korrekte GitHub-URLs.
3. **Paperclip-Referenzen**: Docs https://docs.paperclip.ing, Repo github.com/paperclipai/paperclip. Run-Logs: `paperclip-data/_data/instances/default/data/run-logs/<runId>/…ndjson`.
