# ZENTRALE-KONFIGURATION (NeXifyAI) — Wissens- & Konfigurations-Masterdatei

> **Verbindlich:** Diese Datei ist die zentrale Quelle für ALLE Konfigurationen, Verbindungen,
> Abhängigkeiten und Betriebsinformationen. Jede Installation, Konfiguration oder Entscheidung
> wird hier eingetragen bzw. bezieht sich hierauf. Keine Arbeit ohne Bezug auf diese Datei.
> **Pflegepflicht:** Bei jeder Code-, Konfigurations- oder Logik-Änderung aktualisieren.
> Secrets liegen ausschließlich in `/etc/nexifyai/*.env` (root-only) — hier nur Referenzen.

## 1. Identität & Grundlagen

| Feld | Wert |
|---|---|
| Unternehmen | NeXify AI by NeXify – chat it. Automate it. |
| Inhaber/CEO | Pascal Courbois |
| System-CEO | Hermes Agent (zweiter CEO, ADMIN-Vollmacht, 24/7) |
| Sitz | Graaf van Loonstraat 1E, 5921 JA Venlo, NL |
| Kontakt | mail@nexifyai.cloud · +31 6 133 188 56 |
| Ziel | ≥50 K€/Monat ≈ 6 Kunden/Woche (€449/Tag netto) |
| Sprache systemweit | Deutsch (Doku, Kommunikation, Prompts) |
| B2B-Fokus | DACH + NL, ausschließlich B2B |

## 2. Server-Architektur

| Server | IP | Rolle | Zugang |
|---|---|---|---|
| **Manager (VPS srv1243952)** | **72.62.152.47** | Produktion: WebUI-Container, Backend, Supabase-lokal, GitLab, 9Router, LightRAG, AgentMemory, Monitoring | SSH `nexify-admin@127.0.0.1:2222` (Loopback, Key `~/.ssh/id_ed25519`), root via sudo |
| VPS-Specs | — | KVM 8 · 8 CPU · 32 GB RAM · 400 GB · 32 TB BW · Ubuntu 26.04 · Frankfurt · Backup wöchentlich · Ablauf 2026-08-27 (Auto-Verlängerung aktiv) | Hostinger |

## 2a. VPS-Details (verifiziert 2026-08-06, User-Angabe)

| Feld | Wert |
|---|---|
| Standort | Germany — Frankfurt |
| OS | Ubuntu 26.04 |
| Hostname | srv1243952.hstgr.cloud |
| IPv4 | 72.62.152.47 |
| Uptime (Stand) | 2 Tage 21 Std |
| Plan | KVM 8 (8 CPU / 32 GB / 400 GB / 32 TB) |
| Backup-Zeitplan | wöchentlich |
| Ablauf | 2026-08-27 · Auto-Verlängerung aktiv |
| SSH-User | root (direkt), nexify-admin (Loopback-Admin) |

> **Hinweis:** IP 145.14.158.198 aus früherer Direktive ist veraltet/nicht diese Maschine (22/443 zu, kein PTR). Kanonisch: **72.62.152.47**.

## 3. Dienste & Ports (Host srv1243952)

| Dienst | Port | Zweck | Auth |
|---|---|---|---|
| Supabase-Kong | 8000 | Supabase-lokal API (leads, auth, invoice_sequences) | Kong-Key + HS256-JWT |
| Backend (FastAPI, uvicorn) | 8901 | server.py — Chat, Planner, Offers, Kontakt, Webhooks | via WebUI/Cloudflare |
| Mail-Webhook | 8902 | mail_webhook.py (Kampagnen-Versand) | CAMPAIGN_DRY_RUN=1 |
| 9Router | 20128 | LLM-Gateway (OpenAI-kompatibel /v1) | CUSTOM_API_KEY (universal lokal+remote) |
| LightRAG | 9622 | RAG/Wissensdatenbank | keyless, nur via WebUI-Proxy /lightrag |
| AgentMemory-Viewer | 3113 | Memory-REST-API + Viewer (/memories, /health) | AGENTMEMORY_BEARER_TOKEN |
| AgentMemory-iii-Engine | 3111 | interne Engine (MCP /api/mcp) | NUR intern, kein REST |
| Hermes-Gateway | 8642 | Agent-Gateway (Health 200) | API_SERVER_KEY |
| Hermes-Dashboard | 9119 | Dashboard (302→Login = normal) | Basic-Auth |
| WebUI-Server | 8787 (Container) | Hermes WebUI (public webui.nexifyai.cloud) | Session-Auth |
| Grafana | 3030 | Observability (301→Login = normal) | Login |
| SearXNG | 8090 | key-loser Suchkanal (Recherche/LeadGen) | local |
| Firecrawl | 3003 | Scraping/Enrichment | FIRECRAWL_API_KEY |
| Portainer | 8080 | Container-Management | Login |
| WhatsApp-Bridge | 3000 | Hermes-native WhatsApp (Session /root/.hermes/platforms/whatsapp) | gepaart +31613318856 |
| SSH | 2222 | Admin (Port≠22, PermitRootLogin no, fail2ban) | Key |

## 4. Öffentliche Endpunkte

| Hostname | Ziel | Zweck |
|---|---|---|
| www.nexifyai.cloud | Vercel (Next.js) | Marketing-Website (DE/EN/NL) |
| api.nexifyai.cloud | Cloudflare-Tunnel → Backend 8901 | Backend-API (chat, planner, offers, contact) |
| webui.nexifyai.cloud | Cloudflare-Tunnel → 8787 | Hermes WebUI |
| ai-router.nexifyai.cloud | Cloudflare-Tunnel → 20128 | 9Router remote (CUSTOM_API_KEY) |
| hermes-dash.nexifyai.cloud | Cloudflare-Tunnel → 9119 | Hermes Dashboard |
| dashboard.nexifyai.cloud | Cloudflare-Tunnel → 4001 | Kundenportal (Portal) |
| gitlab.nexifyai.cloud | Cloudflare-Tunnel → 8922 | GitLab |
| n8n.nexifyai.cloud | Cloudflare-Tunnel → 5678 | n8n (DEPRECATED — abgeschafft laut AGENTS.md, Referenz entfernen → DOC-01) |
| *.nexifyai.cloud | Wildcard → 8080 | Fallback |

## 5. LLM-Stack (SOLL, v2.1/V4 — DeepSeek-only)

| Rolle | Modell (via 9Router) | Think |
|---|---|---|
| DEFAULT/EXECUTE | openrouter/deepseek/deepseek-v4-flash-0731 | max (Hermes), disabled (Backend-JSON-Tasks) |
| COMPLEX/DEEP | openrouter/deepseek/deepseek-v4-pro | max |
| PLAN/REVIEW | upstage/solar-pro3-260323 | — |
| EMBED | upstage/solar-embedding-1-large | — |

- **9Router-Key-Matrix:** `CUSTOM_API_KEY` (secrets.env/hermes.env) = universal lokal+remote. `NINEROUTER_KEY` = tot. Backend `ninerouter.py` Key-Kette: CUSTOM_API_KEY → NINEROUTER_API_KEY → NINEROUTER_KEY → OPENAI_API_KEY.
- **JSON-Tasks (planner/offer):** `thinking={"type":"disabled"}` via `extra_body` (SDK lehnt thinking-kwarg ab; Think-Max liefert sonst leeres content → 502).
- **Backend-Env:** CUSTOMER_MODEL=ds/deepseek-v4-flash, FALLBACK=ds/deepseek-v4-flash, NINEROUTER_BASE_URL=http://127.0.0.1:20128/v1, CAMPAIGN_DRY_RUN=1.

## 6. Vercel (Website)

| Feld | Wert |
|---|---|
| Projekt | `website` (prj_VL82MypI2xAxo9QqR3l1zMOWWyKI) |
| Region | fra1 (Frankfurt) |
| Fluid Compute | aktiv (Default seit 2025-04) |
| maxDuration | 60 (alle Backend-Proxy-Routen) |
| BACKEND_ORIGIN | sensitive → https://api.nexifyai.cloud |
| NEXT_PUBLIC_SITE_URL | https://www.nexifyai.cloud |
| NINEROUTER_ENDPOINT | https://ai-router.nexifyai.cloud/v1 (Website-Chat) |
| Deploy | Push auf main → Auto-Build (READY ~60-90s) |

## 7. CI (Corporate Identity) — systemweit verbindlich

| Token | Wert | Verwendung |
|---|---|---|
| Hintergrund | #09090B (Seiten), #0A0A0A (Elemente) | alle Flächen |
| Karte/Oberfläche | #111114, Border #26262b | Cards, Panels |
| Akzent | **#C8FF00** (Lime) | CTAs, Links, Hervorhebungen — dunkler Text (#0A0A0A) darauf |
| Text primär | #FAFAFA/#FFFFFF | Überschriften |
| Text sekundär | #A1A1AA/#9CA3AF | Fließtext |
| Text tertiär | #71717A/#52525B | Metadaten, Footer |
| Font Heading | Outfit (Fallback: system-ui) | Überschriften |
| Font Body | Manrope (Fallback: system-ui) | Fließtext |
| Radius | 16px (Cards), 999px (Buttons/Chips) | Formen |
| Dark-Mode-Meta | `<meta name="color-scheme" content="light dark">` | E-Mails + Web |

**Kontrast:** Lime #C8FF00 mit Text #09090B ≈ 12:1 (WCAG AA ✅). Niemals weißen Text auf Lime (≈1.9:1, failt).
**E-Mail-CI:** ci_email() in backend/server.py — Lime-CTA, Manrope/Outfit mit Fallback, #09090B-BG, Dark-Mode-Meta (Commit 94c3fc44).

## 8. Wichtige Env-Dateien (Secrets → Referenzen, Werte in Dateien)

| Datei | Inhalt | Lesbarkeit |
|---|---|---|
| /etc/nexifyai/hermes.env (=secrets.env, symlink) | CUSTOM_API_KEY, GITHUB_TOKEN, SUPABASE_*, VERCEL_*, RESEND, SMTP, Cloudflare | root |
| /etc/nexifyai/credentials.env | FRONTEND_URL, CORS_ORIGINS, AGENTMEMORY_BEARER_TOKEN, FIRECRAWL | ACL hermeswebui |
| /etc/nexifyai/9router.env | DEEPSEEK/UPSTAGE-Keys + 9router.service-Env (Key rotiert → CUSTOM_API_KEY syncen!) | root |
| /opt/nexifyai/repos/nexify-agentur-plattform/backend/.env | FRONTEND_URL=https://www.nexifyai.cloud, CUSTOMER_MODEL, NINEROUTER_BASE_URL | root |
| /opt/nexifyai/config/pipeline.env | Lead-Pipeline-Env | root |
| /root/.hermes/.env | Hermes-Key (muss CUSTOM_API_KEY spiegeln — Worker 401 sonst!) | root |
| /etc/nexifyai/lightrag.env | LightRAG-Config (keyless seit 2026-08-05) | root |
| /etc/nexifyai/agentmemory.env | AgentMemory-Config (DeepSeek-only) | root |

**FRONTEND_URL (kritisch, 2026-08-06-Fix):** MUSS überall `https://www.nexifyai.cloud` sein (credentials.env + backend/.env). `localhost:3001` = toter Dienst → Registrierungs-Links in Mails 404.

## 9. Sub-Agenten-Netzwerk (17 + 2 neue Profile)

| Ebene | Profile |
|---|---|
| Steuerung | orchestrator, strategist, ops-watch |
| Squad Revenue | marketing, strategist, **sales (neu)** |
| Squad Delivery | builder, maintainer, qa, reviewer |
| Squad Operations | ops, inbox-triage, finance, trader, **compliance (neu)** |
| Squad Knowledge | km-agent, researcher, sage, scribe |
| Security (geplant) | owasp-security-Skill (davila7) als Basis |

- Orchestrierung: Kanban-Board `nexify` (Host /root/.hermes/kanban/boards/nexify/kanban.db), Dispatcher spawnt Worker (`hermes -p <profil> chat -q work kanban task <id>`), Cron `coo-board-loop` (45m, gepinnt).
- **Worker-Protokoll (Pflicht):** Letzter Tool-Call MUSS `kanban_complete(artifacts=...)` / `kanban_block` sein.
- **Profil-Pitfalls:** CRLF-Configs (grep -a), providers-Sektion nötig (custom:9Router + key_env CUSTOM_API_KEY), nach Stack-Wechsel ALLE Profile prüfen.

## 10. Automatisierungen (Timer/Cron)

| Timer | Zeit | Zweck | Status |
|---|---|---|---|
| nexifyai-backup.timer | 00:00 | Backup (DB + Volumes) | ✅ (verify RESULT=OK) |
| nexifyai-backup-verify.timer | 00:15 | Backup-Integrität | ✅ (--wildcards-Fix) |
| nexifyai-backup-rotation.timer | 00:00 | Retention | ✅ |
| nexifyai-daily-backup.timer | 00:00 | tägliches Backup | ✅ |
| nexifyai-leadgen.timer | 08:00 | Lead-Gen (9 Kombos × 4 Leads) | ✅ |
| nexifyai-pipeline.timer | 06:03 | Lead-Pipeline | ✅ |
| nexifyai-coo-report.timer | 06:00 + :15 | COO-Report | ✅ |
| nexifyai-tagesabrechnung.timer | 18:00 | GDOK §10 Abrechnung | ✅ |
| nexifyai-autopilot-kreislauf-e2e-smoke.timer | 00:00 | E2E-Smoke | ✅ |
| coo-board-loop (Cron) | 45m | Kanban-Dispatcher | ✅ |
| WebUI-Cron | 29 Jobs | Bereichs-Agenten (05:30-22:00) | ✅ (deliver=local) |

## 11. Offene Punkte (Live-Gaps → Kanban)

| ID | Gap | Status |
|---|---|---|
| OPS-01 | WhatsApp-Bridge: systemd-Service läuft (nexifyai-whatsapp-bridge), aber Session abgelaufen — QR-Code-Pairing nötig (Pascal: Dashboard → Pair-with-QR). Bridge im Pairing-Modus, nicht verbunden. | blocked (User-QR) |
| OPS-03 | E-Mail-Triage: inbox-poller.py via IMAP (Hostinger) aktiv — verarbeitet ungelesene Mails als Tasks. Cron-Job im Script-Mode (15min). | ✅ |
| COMPLIANCE-01 | AVV/Drittland-Risiko: OpenRouter bietet Enterprise DPA mit EU-SCCs. Nächster Schritt: DPA-Anfrage. | open |
| TDDDG-01 | Cookie-Banner E2E-Test ausstehend (Browser-Daemon down) | open |
| AGENTS-02 | 3-Ebenen-Org finalisieren (Design-/Security-Squad) | open |
| WHATSAPP-01 | WhatsApp-Kanal-Spezifikation liegt vor (Meta Business AI, 4.986/5.000 Zeichen). Live-Validierung jetzt möglich (Bridge läuft). | open |
| WHATSAPP-02 | Namenskonflikt NOVA vs NeXify AI (NXAI-KOMM-001 §17) + /ki-hinweise-Seite leer | open |

### Geschlossen (Audit Runde 3)

| ID | Gap | Grund |
|---|---|---|
| SEC-01 | Rate-Limit/Spam-Schutz | Eigenbau-Middleware aktiv: 5 Regeln (chat 20/min, plan 10/min, offers 5/min, contact 5/min, webhooks 100/min), 60s-Fenster, IP-basiert |
| OPS-02 | Manager-IP 145.14.158.198 | Veraltet — nicht diese Maschine. Kanonisch: 72.62.152.47 (§2) |
| AGENTS-01 | Profile compliance+sales E2E-Test | Beide Profile erstellt + E2E getestet: Compliance (19s) + Sales (22s), deepseek-v4-flash-0731 via 9Router ✅ |
| DOC-01 | n8n-Referenz in §4 | In §4 als DEPRECATED markiert; Cloudflare-Tunnel-Deaktivierung ausstehend (P3, kein Betriebsrisiko) |

## 12. Changelog

| Datum | Änderung |
|---|---|
| 2026-08-06 | Initiale Masterdatei; FRONTEND_URL-Fix, E-Mail-CI (94c3fc44), Profile compliance+sales, WebUI-Rück-Button-Injektion, Backup-verify-Fix, SSE-Keep-Alive, AsyncOpenAI-Timeout |
| 2026-08-06 | Audit Runde 3: 16 Dienste + 6 öffentliche Endpunkte gehealthchecked; SEC-01 geschlossen (Rate-Limit Eigenbau aktiv); OPS-02 geschlossen (145.14.158.198 veraltet); WhatsApp-Bridge DOWN bestätigt (seit 27.07.); MCPs alle OK; Hermes v0.20.0 aktuell; DeepSeek Flash Update keine Breaking Changes; DOC-01 n8n-Cleanup offen |
