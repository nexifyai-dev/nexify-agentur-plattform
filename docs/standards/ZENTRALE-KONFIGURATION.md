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
| System-CEO | Hermes Agent (zweiter CEO, ADMIN-Vollmacht, 24/7, dauerhaft in Produktion) — Rolle kanonisch: §1a + docs/standards/CEO-MISSION-2026-08-07.md |
| Sitz | Graaf van Loonstraat 1E, 5921 JA Venlo, NL |
| Kontakt | mail@nexifyai.cloud · +31 6 133 188 56 |
| Ziel | ≥50 K€/Monat ≈ 6 Kunden/Woche (€449/Tag netto) |
| Sprache systemweit | Deutsch (Doku, Kommunikation, Prompts) |
| B2B-Fokus | DACH + NL, ausschließlich B2B |

## 1a. Rolle & Mandat — System-CEO (Hermes) [FESTSCHREIBUNG 2026-08-07 — DAUERHAFT IN PRODUKTION]

> **Kanonische Rollen-Definition:** `docs/standards/CEO-MISSION-2026-08-07.md` (Zweiter-CEO-Mandat, Pascal-Direktive, verbindlich).
> **Kanonische Vorgaben:** `docs/standards/ARBEITSVORGABEN-v3.3.md` (§0–§14, Pascal-Direktive — Abweichungs-Null-Toleranz, Betriebshandbuch-Pflicht, Online-Recherchepflicht, E2E-Gegentest, Zweiter-CEO-Mandat).
> **Oberste Direktive:** `docs/standards/SYSTEM-DIREKTIVE.md` (Rollenfixierung unwiderruflich, Zentralisierung Single Source of Truth, operative Vorausschau — Pascal-Direktive 2026-08-06).
> **Agenten-Dokumente (Zentralisierung 2026-08-07):** Master im Repo = `docs/operations/hermes/AGENTS.md`, `docs/standards/SOUL.md`, `docs/standards/HERMES.md`. Laufzeit-Spiegel = `/root/.hermes/*.md` + `/workspace/nexifyai/hermes/AGENTS.md`. **Sync-Regel: Repo ist Master — Änderungen zuerst im Repo, dann in die Spiegel kopieren + MD5 prüfen.** Container-/Host-Asymmetrie beachten (kein Symlink-Umbau der Laufzeit-Pfade — bricht Worker im Container).
> Diese Datei ist der zentrale Live-Stand-Hub; Widersprüche zu alten Quellen → diese Datei + CEO-MISSION gewinnen.

| Feld | Festlegung |
|---|---|
| Rolle | Hermes = **System-CEO** (zweiter CEO neben Pascal), volle Eigenverantwortung für dauerhaften autonomen Live-Produktionsbetrieb |
| Befugnis | ADMIN-Vollmacht: A4-Aktionen (DB-Schema, SSH-Härtung, Deploys) eigenverantwortlich; Sub-Agenten-Team (19 Profile) braucht Hermes' Zustimmung |
| Betrieb | 24/7. Loop: Kanban-Board `nexify` (Host /root/.hermes/kanban/boards/nexify/kanban.db) + Dispatcher + Cron `coo-board-loop` (45m, gepinnt) |
| Ziel | ≥50 K€/Monat ≈ 6 Kunden/Woche (€449/Tag, GDOK §10); Kunden zufrieden; Ziele proaktiv übertreffen |
| Kommunikation | Systemweit Deutsch; alle Kanäle (Website-Chat, WhatsApp, E-Mail) einheitlich charmant-business, nicht übertrieben; terse (kein Füllwort-Geschwätz) |
| Harte Grenze | Revolut-PAY-Zahlungen NUR mit expliziter Pascal-Freigabe (GDOK §10) |
| Angebots-Pflicht | Mit jedem Angebot Kundenkonto-Einladungs-Mail (Kunde legt Konto an, um Angebot anzunehmen) |
| Wissenspflicht | Vor jeder Aufgabe: AgentMemory-Suche; nach jeder Aktion: AgentMemory-Speichern (MCP-Tool, REST 3113-POST tot); LightRAG konsistent; Recherche-Ergebnisse in `~/.hermes/cron/output/` |
| Worker-Protokoll | Letzter Tool-Call jedes Workers MUSS `kanban_complete(artifacts=...)` / `kanban_block` sein |
| Modell | NUR `openrouter/deepseek/deepseek-v4-flash-0731` via 9Router (Think-Max); Ausnahmen nur mit schriftlicher Freigabe (§2.3 Vorgaben) |

## 1b. Grundprinzip: Erweitern statt Aushebeln (Vollintegrationspflicht)

> **Pascal-Direktive 2026-08-07 — generelle Vorgabe für JEDE Arbeit, systemweit.**

**Kern:** Wir erweitern stets und hebeln bestehende Lösungen NICHT aus. Jede neue
Möglichkeit wird mit bestehenden Lösungen verbunden, stabilisiert und vollintegriert —
nie isoliert, nie als Ersatz ohne Migration.

**Anwendungspflicht (verbindlich):**
1. **Bestand prüfen:** Existiert eine Lösung für denselben Zweck? (Dienste, Routen,
   Panels, Skills, Timer, Datenquellen — ZK + Repo + AgentMemory)
2. **Erweitern statt ersetzen:** Bestehende Lösung stabilisieren und ERGÄNZEN.
   Ablösung nur mit Freigabe + Migrationspfad.
3. **Vollintegration:** Neue Fähigkeit mit dem Gesamtsystem verbinden — WebUI-Panel,
   Backend-Routen, i18n, CI, Doku, Timer, AgentMemory, Skills. Keine Insellösung.
4. **Recherche-Pflicht (§13):** Online recherchierte Gesamt-Möglichkeiten aktiv
   nutzen, verbinden, integrieren.
5. **Dokumentation:** ZK + Repo-Doku + Skill-Referenz + Betriebshandbuch (§12).
6. **Qualität:** Test-Pyramide (§5) + E2E-Gegentest (§5.4).

**Verankert:** RSS/LLM-Wiki als ERWEITERUNG der WebUI (neue Panels, bestehende
/api/wiki/*-Routen genutzt, nicht dupliziert); Memory-Panel-Sektionen (Gedächtnis/
Notizen/Profil/Agenten-Seele/Project Context) aus Live-Stand übernommen statt neu gebaut.

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
| Hostname | gitlab.nexifyai.cloud |
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
| LLM-Wiki (Karpathy) | /workspace/nexifyai/wiki | Wissensbasis (raw/, entities/, concepts/, comparisons/, queries/) via WebUI-Panel + /api/wiki/* | Session-Auth |
| RSS (blogwatcher-cli 0.2.1) | 0.2.1 (DB /workspace/nexifyai/blogwatcher/) | Feed-Monitoring via WebUI-Panel + /api/rss/* + Ingest in Wiki | Session-Auth |

> **Live-Verifizierung 2026-08-07 07:12 (E2, Hermes-Container → Host-127.0.0.1):** 15/16 Ports HTTP-antwortend (2222 = SSH, kein HTTP — erwartet).
> 3003 / 3113 / 8090 = 200 ✅ · 8000 = 401 (Kong-Auth erwartet) · 3030 / 8080 / 9622 / 20128 = 301/307 (Login/Redirect) ·
> 8901 / 8902 / 8642 / 3000 / 3111 = 404 bei GET auf `/` (Health-Pfade: Backend `/openapi.json`, 3111 = POST-only MCP — normal) ·
> 9119 / 8787 = 302 (Login) ✅.

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

> **Live-Verifizierung 2026-08-07 07:12 (E2):** www = 200 ✅ · dashboard = 200 ✅ · api = 404 auf `/` (Health-Pfad `/openapi.json` = 200) ✅ ·
> webui / hermes-dash / gitlab = 302 (Login) ✅ · ai-router = 307 (Redirect → Auth, erwartet) ✅.

## 5. LLM-Stack (SOLL, v2.1/V4 — DeepSeek-only)

| Rolle | Modell (via 9Router) | Think |
|---|---|---|
| DEFAULT/EXECUTE | openrouter/deepseek/deepseek-v4-flash-0731 | max (Hermes), disabled (Backend-JSON-Tasks) |
| COMPLEX/DEEP | openrouter/deepseek/deepseek-v4-pro | max |
| PLAN/REVIEW | openrouter/deepseek/deepseek-v4-flash-0731 | max |
| EMBED | upstage/solar-embedding-1-large (einzige Nicht-LLM-Ausnahme, kein DeepSeek-Äquivalent) | — |

> **Pascal-Direktive 2026-08-07 (DeepSeek-only):** Systemweit AUSSCHLIESSLICH
> `deepseek-v4-flash-0731` (Standard) und `deepseek-v4-pro` (nur für wirklich tiefe Aufgaben).
> Alle anderen LLMs entfernt; weitere Modelle existieren NUR in 9Router (manuelle Nutzung durch Pascal).

- **MOA:** deaktiviert seit 2026-08-07 (`moa.enabled: false`, Backup config.yaml.bak-20260807-moa) — 3× identische Referenz + Aggregator = 4× Kosten ohne Diversität. Reaktivierung: `moa_aggregator` auf v4-pro getiered.
- **Auxiliary-Tiering v3.2** (WebUI-Config, Backup .bak-20260807-deepseekonly): ALLE Aux-Rollen auf deepseek-v4-flash-0731 via custom:9Router (effort high); nur `curator` + `moa_aggregator` auf deepseek-v4-pro (effort max); custom:upstage-Provider + solar-pro3 aus Configs entfernt; upstage-API-Key nicht mehr in Hermes-Configs.

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
**E-Mail-CI:** Kanonische `mail_shell(label, body_html)` in backend/server.py (Vorgabe 2026-08-06, `docs/standards/MAIL-DESIGN-VORGABE.md`): dunkle Karte #111114 auf #0a0a0a, Border #26262b, Radius 16px, CI-Logo (logo-mark.png + Wortmarke Lime X #C8FF00 / AI #9E9E9E fw300), Impressum-Footer, Dark-Mode-Meta. Alle Pfade: offer_email_html, ci_email, followup_email_html, /campaign/send, Outreach-/Leads-Templates. HTML+Plain (multipart) via `text:`-Param (Resend) / MIMEMultipart (SMTP) + List-Unsubscribe. E2E 72/72 PASS.

## 8. Wichtige Env-Dateien (Secrets → Referenzen, Werte in Dateien)

| Datei | Inhalt | Lesbarkeit |
|---|---|---|
| /etc/nexifyai/hermes.env (=secrets.env, symlink) | CUSTOM_API_KEY, GITHUB_TOKEN, SUPABASE_* (inkl. SECRET_KEY), VERCEL_*, RESEND, SMTP, Cloudflare | root |
| /etc/nexifyai/credentials.env | FRONTEND_URL, CORS_ORIGINS, AGENTMEMORY_BEARER_TOKEN, FIRECRAWL | ACL hermeswebui |
| /etc/nexifyai/9router.env | DEEPSEEK-Keys + 9router.service-Env (Key rotiert → CUSTOM_API_KEY syncen!); CUSTOMER/FALLBACK_MODEL = deepseek-v4-flash-0731 (solar-mini-Altlast entfernt 2026-08-07) | root |
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
| nexifyai-backup.timer | 00:00 | Backup (DB + Volumes) | ✅ |
| nexifyai-backup-verify.timer | 00:15 | Backup-Integrität | ✅ (--wildcards-Fix) |
| nexifyai-backup-rotation.timer | 00:00 | Retention | ✅ |
| nexifyai-daily-backup.timer | 00:00 | tägliches Backup | ✅ |
| nexifyai-restore-test.timer | So 03:00 | **Restore-Test Ebene 3 (echter pg_restore in Test-DB)** — NEU 2026-08-08 | ✅ (E2E: RESULT=OK, 5/5 Tabellen, Prod unangetastet) |
| nexifyai-leadgen.timer | 08:00 | Lead-Gen (9 Kombos × 4 Leads) | ✅ |
| nexifyai-pipeline.timer | 00:02 | Lead-Pipeline (IST 2026-08-08) | ✅ |
| nexifyai-bulk-send.timer | 00:23 | Bulk-Mailing (v2.2, MAX 500) | ✅ |
| nexifyai-drip-campaign.timer | 00:25 | Drip-Kampagne | ✅ |
| nexifyai-followup-wave.timer | 00:30 | Follow-up-Welle M2 | ✅ |
| nexifyai-coo-report.timer | 22:15 | COO-Report (IST 2026-08-08) | ✅ |
| nexifyai-tagesabrechnung.timer | 18:00 | GDOK §10 Abrechnung | ✅ (MODE=send) |
| nexifyai-autopilot-kreislauf-e2e-smoke.timer | 00:00 | E2E-Smoke | ✅ |
| health-watchdog.timer | alle 5 min | Health-Check 11 Punkte + Telegram-Alarm | ✅ (Rebuild 21:30) |
| nexifyai-log-stall-watchdog.timer | alle 5 min | Log-Stall-Erkennung (Alarm-only) | ✅ |
| nexifyai-secret-scanner.timer | 00:00 | Secret-Scan | ✅ |
| nexifyai-sslcheck.timer | 00:00 | SSL-Ablauf-Check | ✅ |
| nexifyai-autopilot-tunnel.timer | alle 5 min | Tunnel-Health | ✅ |
| nexifyai-governance.timer | alle 15 min | Governance-Check | ✅ |
| nexifyai-autopilot-cursor-cp-health.timer | alle 15 min | Cursor-CP-Health | ✅ |
| nexifyai-autopilot-port-harden.timer | alle 15 min | Port-Härtung | ✅ |
| nexifyai-autopilot-gap-alert.timer | alle 15 min | Gap-Alert | ✅ |
| nexifyai-deviation-auto-fix.timer | alle 15 min | Abweichungs-Auto-Fix | ✅ |
| nexifyai-health.timer | alle 15 min | Health | ✅ |
| nexifyai-resilience.timer | alle 15 min | Resilienz-Check | ✅ |
| nexifyai-kern-regelkreis.timer | alle 15 min | Kern-Regelkreis | ✅ |
| nexifyai-autopilot-dependency.timer | 06:30 | Abhängigkeits-Check | ✅ |
| nexifyai-autopilot-spec-delta.timer | 07:00 | Spec-Delta | ✅ |
| nexifyai-watchdog-reactivate.timer | Montag | Watchdog-Reaktivierung | ✅ |
| coo-board-loop (WebUI-Cron) | 45m | Kanban-Dispatcher | ✅ |
| WebUI-Cron | 31 Jobs | Bereichs-Agenten + CEO-Loop + Calendly | ✅ (deliver=local, IST 2026-08-08) |

## 11. Offene Punkte (Live-Gaps → Kanban)

| ID | Gap | Status |
|---|---|---|
| OPS-01 | WhatsApp-Bridge: Hermes-native `nexifyai-whatsapp-bridge.service` (Baileys, Port 3000) — **reaktiviert 2026-08-07 22:30 (war inactive+disabled, Abweichung)** — enabled+active, /health `{"status":"disconnected"}` = Pairing-Modus. **Blocker: Pascal muss QR im Dashboard scannen (hermes-dash.nexifyai.cloud → Channels → WhatsApp).** Ban-Risiko dokumentiert (Baileys Error 463, Issues offen) → Cloud-API-Strategie WA-API-01. | ⏳ Pairing (Pascal) |
| OPS-03 | E-Mail-Triage: inbox-poller.py via IMAP (Hostinger) aktiv — verarbeitet ungelesene Mails als Tasks. Cron-Job im Script-Mode (15min). | ✅ |
| COMPLIANCE-01 | AVV/Drittland-Risiko: **Doku `docs/standards/AVV-DRITTLAND-2026-08-07.md`** — Bestandsaufnahme 8 Datenpfade, Provider-Matrix (OpenRouter DPA+SCCs ✅, Resend/Vercel DPA+SCCs ✅, Hostinger DPA ✅, DeepSeek kein DPA ⚠️ China, Upstage AWS-US ⚠️), Mitigation: ZDR aktivieren, OFFER-Prompt PII-minimiert (nur Vorname), Rechtstexte-Fix Hetzner→Hostinger. Offen: DPA-Anfragen OpenRouter/Upstage, ZDR-Aktivierung (Account). | ✅ |
| TDDDG-01 | Cookie-Banner E2E-Test **GESCHLOSSEN (2026-08-08, E2E+Gegentest via CDP Chrome-150)**: Banner sichtbar („Wir nutzen essenzielle Cookies… Kein Tracking"), Buttons „Nur Essenzielle"/„Alle akzeptieren", Ablehnen-Pfad → Banner weg + Consent `nexifyai-cookie-consent` (essential-only) in localStorage, Reload → bleibt weg, keine Tracking-Cookies (nur NEXT_LOCALE=de). GEGENTEST BESTANDEN. | ✅ |
| AGENTS-02 | 3-Ebenen-Org finalisieren (Design-/Security-Squad) | open |
| WHATSAPP-01 | WhatsApp-Kanal-Spezifikation liegt vor (Meta Business AI, 4.986/5.000 Zeichen). Live-Validierung jetzt möglich (Bridge läuft). | open |
| WHATSAPP-02 | Namenskonflikt NOVA vs NeXify AI: **gelöst** (Persona systemweit „NeXify AI", /ki-hinweise vollständig: Art.-50-KI-Offenlegung, Einsatzbereiche, Risiken, Stand 04.08.2026 — E3 via Browser 2026-08-08). Rest: Live-Validierung nach Pairing (WA-TEST-01). | ✅ (Rest: WA-TEST-01) |
| OPS-04 | **Supabase-Cloud→OSS GESCHLOSSEN (2026-08-07 GO-LIVE):** Alle DSNs/URLs lokal — credentials.env (CONNECTION_STRING+DB_URL), hermes.env+secrets.env (SUPABASE_URL/REST_URL/JWKS_URL/PROJECT_ID), pipeline.env (DB_URL); 0 Cloud-Refs (grep-verifiziert). Backend-Runtime-Env lokal (E2), E2E Register→Login→Lokale-DB bestanden, Cleanup OK. `nexifyai-db-ip.sh` erweitert (zieht pipeline.env+credentials.env mit). Supabase-MCP-Wrapper auf lokalen Kong-/mcp-Endpoint (mcp-remote, read_only_user-PW sync). Cloud-DB nicht mehr auflösbar (DNS tot) — nur interne Konten (2) betroffen, lokal vorhanden. | ✅ |

### Geschlossen (Audit Runde 3)

| ID | Gap | Grund |
|---|---|---|
| SEC-01 | Rate-Limit/Spam-Schutz | Eigenbau-Middleware aktiv: 5 Regeln (chat 20/min, plan 10/min, offers 5/min, contact 5/min, webhooks 100/min), 60s-Fenster, IP-basiert |
| OPS-02 | Manager-IP 145.14.158.198 | Veraltet — nicht diese Maschine. Kanonisch: 72.62.152.47 (§2) |
| AGENTS-01 | Profile compliance+sales E2E-Test | Beide Profile erstellt + E2E getestet: Compliance (19s) + Sales (22s), deepseek-v4-flash-0731 via 9Router ✅ |
| DOC-01 | n8n-Referenz in §4 | In §4 als DEPRECATED markiert; Cloudflare-Tunnel-Deaktivierung ausstehend (P3, kein Betriebsrisiko) |

## 12. Systemvorgaben (verbindlich, Pascal-Direktive 2026-08-06)

Kanonische Fassung: `docs/standards/ARBEITSVORGABEN-v2.2.md` (Quelle: SOUL.md v2.2, System-Prompt).

| Vorgabe | Inhalt |
|---|---|
| **Abweichungs-Null-Toleranz** | Bei JEDER Arbeit ALLE Abweichungen erkennen — auch außerhalb des aktuellen Fokus (indirekte Abhängigkeiten, Nachbarsysteme). Jede Abweichung ausnahmslos fixen und in Produktion bringen mit Ergebnis-Check + Qualitätskontrolle nach fest definierten Vorgaben (Test-Pyramide, Qualitätsgates). „Nur Fokus-Pfad geprüft" ist kein Abschlusskriterium. |
| **Betriebshandbuch-Pflicht** | Zu jedem System/Dienst/Komponente Betriebshandbuch führen (Betrieb, Wartung, Troubleshooting, Wiederanlauf, Fehlerbehandlung). Fehler und Optimierungen erkannt UND umgesetzt. Teil der Qualitätsgates. |
| **Online-Recherchepflicht** | Ständige proaktive Tiefen-Recherche (offizielle Doku, Changelogs, GitHub Issues, Bestpraxis, Mitbewerber-/Kunden-/Marketing-Analysen). Ergebnisse in AgentMemory + `~/.hermes/cron/output/` ablegen. SearXNG: Host 127.0.0.1:8090, `language=de&time_range=month`. |
| **E2E-Gegentest-Pflicht (v2.3, 2026-08-07)** | Bei JEDER Änderung vor Abschluss: unabhängiger Gegentest, der den Primärnachweis **widerlegt** statt ihn zu wiederholen (Negativ-/Fehler-/Randfälle, Datenintegrität, Rollback-Pfad, Regression §11). Binäres Ergebnis `GEGENTEST BESTANDEN/FEHLGESCHLAGEN`; bei Fehlschlag STOP → Fix → beide Tests erneut. Kanonisch: ARBEITSVORGABEN §5.4. |

## 13. Changelog

| Datum | Änderung |
|---|---|
| 2026-08-07 22:40 | **GO-LIVE RUNDE 3 — CONVERSION-PFAD E3-BEWIESEN + KONVERSIONS-RECHERCHE:** (1) **P0-Neukundenpfad vollintegriert verifiziert (E3):** Website-Chat `/api/chat` → Plan + Session persistiert in `nexify_chat_sessions` (a7f53fee ✅); Kontaktformular `/api/contact` → 200 + Lead in `nexify_leads` (e6dbc4d8, source=contact, status=new ✅ — korrekt getrennt vom LeadGen-Pool `leads`/bigint); Angebot `/api/offers/request` → 422 ohne session_id = korrekte Validierung (Design: Chat-Session → Angebot); `nexify_offers` session_id-verknüpft (3 Test-Angebote 18:31-18:34, status sent). Dienste-Check: Kundenportal 4001 = 200 ✅, Grafana 301/Portainer 307/MailWebhook 404-GET (normal). (2) **Tiefen-Recherche Konversion 2026 (wonderchat B2B-Report + trtc.io, Juni 2026):** Speed-to-Lead <5 Min → **21× höhere Qualifizierungsrate** (Ø B2B: 29 h Follow-up = Pipeline-Loch); Conversational-AI 15–25 % Konversion (3–8× vs. Formular 2–3 %); 67 % B2B-Käufer bevorzugen self-service → 24/7-Chat kritisch; Chat-Nutzer 5,13× kaufwahrscheinlicher; proaktive Chat-Trigger auf Preis-/Produktseiten nach 30–45 s (nicht <5 s). → Unser AI-Chat+Planner ist der richtige Pfad; **Folge-Tasks: AUTO-REPLY für nexify_leads prüfen/bauen (Speed-to-Lead) + proaktive Chat-Trigger** (t_…). |
| 2026-08-07 22:10 | **FT-PLAN AKTUALISIERT + DATASET-PIPELINE V1 (DeepSeek-V4-Flash-Feinabstimmung, Recherche-Update):** Plan `docs/plans/DEEPSEEK-V4-FLASH-FEINABSTIMMUNG-PLAN-2026-08-07.md` (im Repo, Master): (1) **P3 konkretisiert** nach Online-Recherche 2026 (≥3 Quellen): Stack **SFT→DPO** (DPO ersetzt RLHF; ORPO-Alternative; nie kombinieren), **QLoRA-Default** (r=32–64 Domain, alpha 2×r, q/v_proj), Anbieter-Route Together-BYOM primär / gemietete A100 (≈12–50 $, vLLM-LoRA-hot-swap) / Unsloth; **Forgetting-Check** (Basis-Szenarien in jeder FT-Eval). Gate erweitert: FT-Keys fehlen (verifiziert: Together/Unsloth/Novita/Fireworks = 0). (2) **Neu §12 Continual-Learning-Architektur:** Zwei-Schichten (A: Memory/RAG/Skills/Eval-Loop — läuft, Memento-Paradigma UCL/Huawei bestätigt unsere Architektur; B: periodische LoRA-Updates nur für Verhalten), MSSR-Replay gegen Catastrophic Forgetting, Trigger/Evals, kein Auto-FT. (3) **Dataset-Pipeline v1** (`docs/plans/scripts/ft-dataset-export.py`): **16.056 Episoden** aus AgentMemory-Lektionen exportiert → `/workspace/nexifyai/data/ft/episodes.jsonl` (Gegentest OK); task-log.jsonl/changes.jsonl = 0 Zeilen (Autotask-Logging erzeugt nichts — Abweichung notiert, Session-DB als nächste Quelle). Commits 92791d41 + ae036cbb. Offen: Eval-2-Wochen-Gate, FT-Konto (Pascal). |
| 2026-08-07 21:50 | **ZENTRALISIERUNG VERTIEFT (Agenten-Dokumente ins Repo):** SOUL.md/HERMES.md/AGENTS.md lagen nur als Laufzeit-Dateien (/root/.hermes, /workspace/nexifyai/hermes) — Repo (einzige Wahrheitsquelle §7.3) hatte sie nicht. Fix: Master im Repo angelegt — `docs/standards/SOUL.md`, `docs/standards/HERMES.md`, `docs/operations/hermes/AGENTS.md` (MD5-identisch zu Laufzeit, verifiziert). Sync-Regel in §1a verankert (Repo = Master → Spiegel, MD5-Pflicht; kein Symlink-Umbau wegen Container-/Host-Asymmetrie). Damit ist die Festschreibung vollständig: Rolle/Vorgaben/Ziele/ZK/Wissen (AgentMemory) + Agenten-Dokumente zentral im Repo. |
| 2026-08-07 21:45 | **ROLLE SYSTEMWEIT FESTSCHREIBUNG + ZENTRALISIERUNG (Pascal-Auftrag „dauerhaft in Produktion, zentralisieren"):** §1a-Drift korrigiert (Referenzen CEO-MISSION-2026-08-06.md→**07.07** (Zweiter-CEO-Mandat), ARBEITSVORGABEN-v2.2→**v3.3**, FESTSCHREIBUNG 06.→07.08, Rolle = „dauerhaft in Produktion"). Alt-Repo-Clone /opt/nexifyai/repos/nexify-agentur-plattform (Arbeitsort Nacht-Zyklus) ff-synchronisiert auf 6f7c1939 — Doku-Drift geschlossen. **Zentralisierungs-Status (verifiziert):** ZK = Master-Hub ✅ · CEO-MISSION-2026-08-07 = Mandat ✅ · ARBEITSVORGABEN-v3.3 (Repo = WebUI-SOUL) ✅ · SOUL.md (root+WebUI, Guards/Direktiven) ✅ · HERMES.md (Governance) ✅ · AGENTS.md (Session-Pflicht) ✅ · Kanban nexify = Betriebs-Loop ✅ · AgentMemory = Wissensschicht (8 Lektionen heute) ✅ · Dashboard/Telegram auf default-Profil ✅ · Health 200/200/302 ✅. Einzige externe Wahrheitsquelle (Vercel/Hostinger/Meta) = Pascal-Aktionen (DKIM, Pairing, Healthchecks). |
| 2026-08-08 07:40 | **RECHTSTEXTE-FIX (Runde 4b, Pascal-Meldung „Nutzungsbedingungen fehlen"):** Root-Cause: AGB existierte (de.ts vollständig, §1–§12 B2B) — aber (1) Middleware (PR47/LOCALE-DE-STANDARD) leitete `/en/agb`, `/nl/agb` etc. per 308 auf deutsche Seiten um → **en.ts/nl.ts-Übersetzungen (existierten!) waren unerreichbar**; (2) `/nutzungsbedingungen` = 404; (3) Angebots-/Kampagnen-Mails verlinkten keine AGB. Fix (Commit 8409e23e, GitHub+GitLab, Vercel READY): (a) middleware.ts LEGAL_SLUGS-Ausnahme — `/en|nl/<legal>` läuft auf `app/[locale]` (de bleibt gestrippt, DACH-first unverändert); (b) next.config Redirects: `/nutzungsbedingungen`→`/agb`, `/terms`+`/terms-and-conditions`→`/en/agb`, `/voorwaarden`→`/nl/agb`; (c) server.py MAIL_FOOTER_HTML um AGB/Datenschutz/Impressum-Links erweitert (alle Mails), Backend-Restart. E2E: /agb=deutsch, /en/agb=„Terms & Conditions (B2B)", /nl/agb=„Algemene voorwaarden (B2B)", en/datenschutz=„Privacy Policy", nl/impressum=„Colofon", en/ki-hinweise=„AI Notice", nl/widerruf=„Herroepingsrecht"; Redirects 308 (Next.js-permanent); GEGENTEST: /en/leistungen weiterhin 308→/leistungen (Marketing-Stripping unverändert), /de/agb→/agb, 6/6 Middleware-Tests pass. Recherche-Abgleich (eRecht24-Bestpractice, AI-Act-Art.-50-Pflicht seit 02.08.2026): Rechtstexte-Suite vollständig — Impressum (DDG §5/MStV/KvK/BTW/Social-Media), Datenschutz, AGB, Widerruf (B2B-Klausel), Cookie-Richtlinie+Banner (TDDDG-E2E ✅), KI-Hinweise, AVV, Streitbeilegung (Impressum §6), Sitemap mit allen 7 Rechtstexten. |
| 2026-08-08 06:50 | **GO-LIVE-SCAN RUNDE 4 (CEO, Live-Betrieb):** (1) **Restore-Test Ebene 3 NEU** (`/opt/nexifyai/scripts/restore-test.sh` + `nexifyai-restore-test.timer` So 03:00): echter pg_restore des supabase-Dumps in Wegwerf-Test-DB, count(*)-Check 5 Kerntabellen, Aufräumen. E2E: Dump 469KB, leads 599/nexify_leads 20/nexify_users 8/nexify_offers 17/customers 0, RESULT=OK, keine restore_test-Reste; GEGENTEST: Prod-Counts unverändert (672→675 nur paralleles Lead-Wachstum, offers 17 konstant). (2) **WhatsApp-Bridge reaktiviert** (Service war inactive+disabled — Abweichung): enabled+active, /health disconnected = Pairing-Modus, QR-Scan durch Pascal offen (einziger Kanal-Blocker). (3) **TDDDG-01 E2E+Gegentest bestanden** (CDP Chrome-150 headless, 9222): Banner, Ablehnen-Pfad, Consent-Persistenz, keine Tracking-Cookies — Browser-Daemon läuft (chrome-debug.service). (4) **Opt-out-Gegentest bestanden** (www/api/outreach/unsubscribe): ohne Token → Hinweis, falscher Token → generisch „sofern der Link gültig war", kein Leak; Seite 200 (P0-Fix 21:40 live). (5) **Website-Sync verifiziert:** GitHub-main = Host-Repo = Vercel-Deploy (072518df, READY/PROMOTED, 181/181 Tests) — keine Divergenz. (6) **MCP-Verbindungen E3:** LightRAG-MCP healthy (DeepSeek via 9Router, Embedding Upstage, 0 Fehler), Supabase-MCP lokal (24 Tabellen, RLS, 666+ Leads), AgentMemory healthy, Vercel-MCP OK, 9Router Chat-Call E3 (deepseek-v4-flash-0731, Think-Max aktiv). (7) **9Router-Allowlist:** glm-cn/poolside-Modelle vorhanden = per 07.08.-Direktive erlaubt (manuelle Pascal-Nutzung), System nutzt NUR deepseek (verifiziert: Backend/Hermes/LightRAG/AgentMemory). (8) **Recherche (Tiefen-Recherche 08.08.):** Baileys Error-463-Ban-Risiko belegt (offene Issues 07/2026, auch warme Kontakte) → Cloud-API-Pfad (WA-API-01) bestätigt; Meta-Pricing nicht verifizierbar (Block 400) → vor Einführung prüfen; Monitoring-/Vertriebs-Benchmarks aus Skill-Refs konsolidiert (Uptime Kuma 2.5.0, healthchecks v4.3, Restore-3-Ebenen, SLO 99,5 %, Speed-to-Lead 9×/21×, AI-Act Art. 50 seit 02.08.2026). (9) **ZK-Korrekturen:** §10 Timer-IST-Vollständig (28 Timer inkl. restore-test), WebUI-Cron 31 Jobs, Pipeline 00:02, COO-Report 22:15. (10) **Offen (Pascal):** WhatsApp-QR-Pairing, DKIM (hPanel, MAIL-03), Healthchecks.io-Account optional (HEALTH-01), Offsite-Backup (rclone→B2, ~1–3 €/Mo, Credentials), Vercel/Stripe-Kartenproblem. |
| 2026-08-07 21:30 | **HEALTH-WATCHDOG REBUILD (P1 — Datei war leere Hülle):** Abweichungs-Scan fand: health-watchdog.py enthielt NUR Konstanten (kein Main-Code) — Timer feuerte alle 5 Min, aber KEIN Check, KEIN Telegram-Alarm (de facto tot, vermutlich seit 24.07.-Umbau). Zusätzlich tote Referenzen („LightRAG DEAKTIVIERT" = falsch, aktiv seit 05.08; Upstage-Bot :9650 existiert nicht). Neu implementiert (Backup .bak-20260807-huelle): 9 interne/öffentliche Checks (Website www, Backend 8901, Gateway, WebUI, Dashboard, 9Router, AgentMemory, LightRAG 9622, SearXNG) + 2 Docker-Checks (supabase-db, gitlab), Telegram-Alarm bei Statuswechsel (State-Dedup, Muster log-stall-watchdog), Exit 0/2. E2E: Positivlauf 11/11 OK Exit 0; Negativtest (kaputte URL) → FAIL + ALARM (Telegram-Delivery E3-bewiesen — Testnachricht an Home-Channel gesendet, kein echter Ausfall). Tagesabrechnung 18:00 Exit 0 verifiziert. |
| 2026-08-07 21:40 | **P0-OPT-OUT-FIX (DSGVO Art. 21 / UWG §7, E2E-Gegentest BESTANDEN):** Abweichungs-Scan fand: Alle Mail-Templates verlinkten auf `www.nexifyai.cloud/unsubscribe` → **HTTP 404** (toter Opt-out im Live-Betrieb, ~500 Mails/Tag!) und ohne Token (API `/api/outreach/unsubscribe` existierte, aber Token-Pflicht). Fix (Commit 21427f62): (1) Alle 7 Templates (lead_email/v2/reengage/followup/m2/breakup/m3) → Link `https://www.nexifyai.cloud/api/outreach/unsubscribe?email={{email}}&token={{token}}`; (2) send_to_qualified_v2.py render_template generiert Token (sha256(salt:email)[:32], Salt `OUTREACH_UNSUB_SALT` fallback 'nexify-outreach' — explizit in pipeline.env gesetzt, matchend zur Vercel-API); (3) alle 3 Template-Orte MD5-synchron. E2E: gültiger Token → „Abmeldung bestätigt… entfernt"; falscher Token → generisch (kein Leak); ohne Token → Hinweis. List-Unsubscribe-Header (server.py:742) ✅. |
| 2026-08-07 21:20 | **GO-LIVE-SCAN (Phase A/B, CEO):** (1) **DNS von außen E2-verifiziert** (dns.google): SPF ✅, MX ✅ (mx1/mx2.hostinger.com), DMARC ✅ (p=quarantine, rua gmail) — **DKIM ❌ bestätigt** (default/hostinger/selector1 leer; Hostinger-Email-API hat keinen DKIM-Endpoint → nur hPanel, Pascal-Schritte auf MAIL-03 t_1bb9f711). (2) **Bounce-Loop-Fix deployed + gepusht (443e77f8):** send_to_qualified_v2.py — ✗-Adressen (3 Fehlversuche) blieben in allen 3 Pools (A/RE/M2) → wiederholte SMTP-Versuche an tote Adressen (Deliverability-Schaden). Fix: DB-Update `status='bounced'` (permanente Suppression, fällt aus allen Pools) + State-Append in allen 3 Zweigen; Backup .bak-20260807-bouncefix; py_compile OK; Repo-Spiegel MD5-synchron. (3) **Health-IST:** intern 3-fach abgedeckt (health-watchdog.py 5 Min/Telegram, 2× health-check.sh identisch, log-stall-watchdog, Cloudflare-Tunnel); Healthchecks.io-Integration im health-check.sh VORBEREITET, HEALTHCHECKS_URL fehlt → Pascal-Anleitung auf HEALTH-01 t_c16cb571 (extern = optional, kein Blocker). (4) **Firecrawl-MCP E3-verifiziert** (Scrape 200) — funktionierender Fetch-Kanal; Hermes-web-Tools brauchen FIRECRAWL-Env im WebUI-Container → OPS-04 t_6707d15b. (5) WhatsApp-Pairing = einziger Kanal-Blocker (Pascal: QR-Scan im Dashboard). |
| 2026-08-07 21:20 | **OPS-03 GEKLÄRT (5 SIGTERM-Kills Bulk-Send 19:25–20:08 = manuelle SSH-Eingriffe, KEIN Automatismus):** Journal-Beleg je Kill-Zeitpunkt: `sudo[2214313/2465175/2518206/2525485/2619089]: nexify-admin : COMMAND=/usr/bin/systemctl (stop|restart|start) nexifyai-bulk-send.service`, jeweils aus SSH-Session (127.0.0.1, Key-Fingerprint `SHA256:V2mQELPWOOPYqjbZZAXSxyBJmgYGOsZutNWLXtKRwSM` = `nexifyai-central@…gitlab.nexifyai.cloud` = Pascals zentrales Profil `nexifyai_central`). Muster (19:25:38 stop→reset-failed→start; 19:51:31 restart; 19:57:06 restart; 19:57:53 stop→start; 20:08:16 stop→reset-failed→start) = Debug-/Validierungs-Eingriff während BULK-SMTP-TIMEOUT-FIX (Bulk hing 19:46–19:51, fix: email_lead.py `timeout=60`, Changelog 20:25). Ausgeschlossen mit Beleg: log-stall-watchdog.py (nur `is-active`, Alarm-only), coo-report.sh (nur `is-active`), resilience-monitor.sh/nexify_resilience.py (keine bulk-Treffer), systemd-Timer (keine), Hermes-Cron (keine), state.db-Sessions (kein systemctl-restart-Call außer read-only Checks; OPS-02-Session 195448 prüfte nur Unit/Status). AUDIT-01-Hypothese falsch — kein Worker-Restart. Konsequenz: Kill-Quelle = manueller Ops-Eingriff, kein Härtungsbedarf; System wie designed (Restart=on-failure, State-File schützt). |
| 2026-08-07 21:00 | **CEO-RUNDE ABSCHLUSS (Bulk verifiziert + Compliance reaktiviert):** MAIL-04 t_218b3c4d E2E-verifiziert und abgeschlossen: Bulk-Lauf 18:33–20:52, **572 Mails ✓ heute** (Ziel >150), 0 Fehler, 0 NameError/Traceback (Gegentest BESTANDEN), State gewachsen (processed 41→48, reengagement 23→206, last_index 45→79), sauber beendet „Done. 57 (Limit 500)". 5 SIGTERM-Neustarts während des Laufs (19:25–20:08) ohne Datenverlust — Quelle offen, **OPS-03 t_74c03685** angelegt (Hypothese: AUDIT-01-Worker-Validierung). WEB-01 (/ki-hinweise), AUDIT-01, SEC-04 **DONE** durch Dispatcher (läuft wieder stabil); OPS-02 Log-Stall-Watchdog (Alarm-only, kein Restart — verifiziert) gebaut. **Compliance-Tasks reaktiviert** (lagen seit 06.08 als „open" brach, Dispatcher greift nur ready auf): MARKET-02 UWG-§7 t_4b3e1d81, COMPLIANCE-01 AVV/Drittland t_77c78ba8. Alt-Tasks t_c6229249fb03/t_b750ab55518f als Duplikate gekennzeichnet. |
| 2026-08-07 21:15 | **COMPLIANCE-01 ABGESCHLOSSEN (AVV/Drittland-Risiko LLM-Provider):** Doku `docs/standards/AVV-DRITTLAND-2026-08-07.md` (12,5 KB): 8 PII-Datenpfade identifiziert (Chat, Planner, Offers mit Name/E-Mail im Prompt, Embeddings via Upstage→AWS US, Resend-Mail, Vercel fra1, Hostinger DE), Provider-Matrix mit AVV-Status (OpenRouter Enterprise-DPA+SCCs vorhanden/nicht beantragt; Resend DPA+SCCs 31.12.2025; Vercel DPA+SCCs+IDTA 17.03.2026; Hostinger DPA EU; **DeepSeek: kein DPA, Speicherung VR China, kein Adequacy = HOCH**; Upstage: Korea-Adequacy aber Verarbeitung AWS US, DPA-Pfad unklar = MITTEL), EU-AI-Act-Art.-50-Lückenliste (Chat ✅ /ki-hinweise ✅; Fix: Rechtstexte). **Code-Mitigationen:** (1) `backend/server.py` OFFER-Prompt PII-minimiert — nur Vorname in den LLM-Prompt (Name bleibt in DB/E-Mail), + DSGVO-Art.-5-Promptregel; (2) `apps/website/lib/legal/de.ts` — Faktenfehler „Hetzner GmbH"→**Hostinger** (VPS Frankfurt/DE) in Datenschutz §7 + AVV §3 korrigiert, ZDR-Erwähnung ergänzt, /ki-hinweise §5 Drittland-Garantien-Text. Quellen ≥3 je Provider, Links mit Datum. Offen (keine Blockade): DPA-Anfragen OpenRouter/Upstage, ZDR-Aktivierung im OpenRouter-Account, Website-Deploy. |
| 2026-08-07 20:35 | **AUDIT-01 ABGESCHLOSSEN (Altdaten-Bereinigung + Verbindungs-Audit, 19→1-Baseline):** (1) **Board:** 12 nicht-done Tasks, ALLE auf `default` — die 6 genannten IDs verarbeitet (SEC-03 t_2eaa267edda4 done, MAIL-02 t_ebb42de7 blocked, SEC-01 t_d2fcc0445adc done, MARKET-02 t_c6229249fb03 open, AGENTS-02 t_0d46195ed70f done, t_be82fc43 done); tote Assignees in offenen Tasks: 0 (sqlite-geprüft). (2) **Doku:** Repo-Governance/CHARTA/AGENTS/MASTERPLAN + /root/.hermes/*.md driftfrei (solar-pro-LLM-Fix bereits via GESAMT-INTEGRATION-STATUS.md; n8n nur noch in „abgeschafft"-Kontexten; LightRAG AKTIV; kein :4020). (3) **Verbindungen live:** 7/7 Domains (www/dashboard/agentmemory=200, hermes-dash/webui=302, ai-router/rag=307), 9Router /api/health 200 + Modelle (nexifyai-combo, glm-cn, DeepSeek via 9Router), AgentMemory Viewer :3113 200, LightRAG :9622 200, Hermes 8787+8644 200; 3111/20128 haben keinen /health-Pfad (eigene API, kein Fehler). (4) **hermes.env:** Spiegel /root/.hermes/hermes.env fehlte WhatsApp-Cloud-Sektion → aus kanonischer /etc/nexifyai/hermes.env neu gesynct (KEYS IDENTISCH, chmod 600); Supabase-Cloud-Altlast mdlgodcvpasgplcrkiad = 0 Ref (bereits OPS-04-GO-LIVE). (5) **Repo-Müll entfernt:** 7 .bak-Dateien (backend/), header-fixed-1024.png, .playwright-mcp/. Commit + Push origin+gitlab. |
| 2026-08-07 18:40 | **BAN-RISIKO-BEWERTUNG WHATSAPP (offizielle Hermes-Doku):** Baileys-Bridge = inoffiziell; Regeln: dedizierte Bot-Nummer, kein Kalt-Bulk, kein Outbound an Nicht-Erstschreiber. Unsere Welle auf 31613318856 (Geschäftsnummer) → Wave-Tagescap 50 (hart 150) deployt (whatsapp-wave.py), STOP-Handling, Conversational-Fokus. Strategie: **WhatsApp Business Cloud API** als Produktionspfad (Meta-Konto + dedizierte Nummer + Webhook via Cloudflare-Tunnel; `hermes whatsapp-cloud`-Wizard) — Task WA-API-01 t_e4f5a9fd. Recherche-Nachtrag im §0b-Bericht (71 Zeilen). Bulk 18:25: JWT aus pipeline.env bestätigt (SUPABASE_JWT_SECRET vorhanden — früherer Grep lief ohne sudo), Lauf auth-sicher; Verifikation via MAIL-04 t_218b3c4d. |
| 2026-08-07 18:20 | **WHATSAPP-SPEZ NXAI-KANAL-WHATSAPP-2026-08-06 UMGESETZT:** §0c WHATSAPP-PERSONA & ROUTING in SOUL.md (beide) + AGENTS.md Regel 10 verankert: Persona „NeXify AI" mit KI-Offenlegung beim Erstkontakt (Art. 50), Routing (Status→/login, Neukunden→/leistungen, Angebote→/preise AI-Projektplaner, unsicher→/kontakt, Beschwerden→Pascal), keine Preiszusagen/Wettbewerbsvergleiche; Confidentiality-Guard §0b hat Vorrang. Artefakt-Datei `NeXifyAI_WhatsApp_Unternehmensbeschreibung.md` nicht auf Disk (nur ZK-Referenz) — Implementierung direkt aus Spezifikation. Neue Tasks: WA-TEST-01 (4-Punkt-Validierung nach Pairing), WEB-01 (/ki-hinweise leer + NOVA-Namenskonflikt). Live-Kanal = Hermes-Baileys-Bridge (Meta-Business-API = strategische Option, ToS-Risiko dokumentiert). |
| 2026-08-07 18:00 | **GO-LIVE-VERIFIKATION (SOLL vs IST):** Kanäle: Telegram ✅, Webhook ✅, api_server ✅, WhatsApp ⏳ fatal (Re-Pairing wartet auf QR-Scan — Session geleert, Gateway 17:31 neu, einziger Blocker). Timer alle scharf: Tagesabrechnung 18:00 MODE=send ✅, Bulk 18:25 (v2.2, ~190 erwartet), Drip 00:28, Followup-Welle 00:30 (M2), LeadGen 08:00. Gateway-Service gehärtet (Restart=always/RestartSec=5 ✅). Neue Tasks: MAIL-03 DKIM (t_1bb9f711, SPF/DMARC ✅ DKIM fehlt), SEC-04 RLS/Tenant + Abuse-Case-Matrix (t_63112197, offers ohne customer_id), MAIL-04 Bulk-Verifikation. AgentMemory: mem_msj42e2y (GO-LIVE-Session). Recherche-Bericht §0b abgelegt. Offen/P1: Vercel-/Stripe-Zahlungsfehler (Kartenproblem Pascal), DKIM, WhatsApp-Pairing. |
| 2026-08-07 17:45 | **CONFIDENTIALITY-GUARD + MANDANTENTRENNUNG (Pascal-Direktive):** §0b verankert (beide SOULs, HERMES.md Pflicht 9, AGENTS.md Regel 9, Repo ARBEITSVORGABEN v3.3): NIE vertrauliche Informationen auf Kanälen; einzige Ausnahme Pascal via Telegram (Owner-Chat) / WhatsApp **31613318856**; Mandantentrennung (Kundendaten nie vertauschen: tenant/customer_id, Empfänger↔Inhalt-Gegentest, KI-Kontext-Isolation). Tiefen-Recherche: OWASP AI Agent Security Cheat Sheet (Memory-Isolation, Output-Guardrails, Data Classification PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED), Supabase RLS, Etheon („wrong place"-Risiko), DSGVO Art. 5/25/28/32 — Bericht: `~/.hermes/cron/output/confidentiality-mandantentrennung-recherche-2026-08-07.md`. **WhatsApp-Repair:** Baileys `failed to find key…decode mutation` (Issue 1623, PR 2288) → App-State-Keys bereinigt → Send-Test success (messageId 3EB06074…); anschließend Server-Logout → **Re-Pairing nötig** (Session geleert, Gateway neu gestartet 17:31, wartet auf QR-Scan im Dashboard). **Mail-E2E bestanden** (SEND_RESULT True via Hostinger-SMTP). **Bulk-Script v2.2 deployed** (NameError-Fix, RE 24h, MAX 500, --followup-only + 00:30-Timer). **whatsapp-wave.py v2** (Health-Precheck, Retry failed, Dedupe, ~480 Nummern). DNS: SPF ✅ DMARC ✅ (quarantine), **DKIM fehlt** (Gap). Vercel-/Stripe-Zahlungsfehler (124,08 $/100,41 $) = P1 offen. |
| 2026-08-07 17:10 | **DOKU-SYNC + ALTDATEN-BEREINIGUNG (CEO-Mandat verankert):** Zweiter-CEO-Mandat (CEO-MISSION-2026-08-07) in ALLE verbindlichen Dateien eingebettet: `/root/.hermes/SOUL.md` (Block ZWEITER-CEO-MANDAT + LightRAG-Altstand korrigiert: AKTIV :9621/:9622, rag.nexifyai.cloud 307→/lightrag/webui/, WebUI-Proxy /lightrag auf :8787), `/root/.hermes/HERMES.md` (komplett neu: Dienste/Ports verifiziert, Credentials-Regel hermes.env, DeepSeek-only), `/root/.hermes/IDENTITY.md` (Modell+Memory-Stand korrigiert), `/home/hermeswebui/.hermes/SOUL.md` = Arbeitsvorgaben **v3.3** (neu: §14 ZWEITER-CEO-MANDAT), Repo `docs/standards/ARBEITSVORGABEN-v2.3.md` → **v3.3** (Modellstack-Drift solar-pro3→flash-0731 behoben = v3.2-Abgleich, §14 ergänzt), Repo `AGENTS.md` + `CHARTA.md` (Mandat als Primärquelle #2). **Gefixt:** defekter Symlink `/root/.hermes/AGENTS.md` → `/workspace/nexifyai/hermes/AGENTS.md` (Ziel fehlte; neue aktuelle AGENTS.md erstellt). **Gefixt:** `/root/.hermes/hermes.env` = tote Supabase-Cloud-Altlast (584 B) → Spiegel von `/etc/nexifyai/hermes.env` (kanonisch, root-only). Sidebar-Buttons WebUI↔agentmemory↔lightRAG: von Pascal geklärt (kein Bau nötig). Next: lückenloses Verbindungs-/Funktions-/Datei-Audit gegen Altdaten (Profil-Konsolidierung 19→1 als Baseline), Recherche-Loop. |
| 2026-08-07 16:00 | **SESSION-ABSCHLUSS:** Profile manuell finalisiert (nur default, WhatsApp gepairt, Webhooks aktiv). CEO-MISSION-2026-08-07.md verankert (Rollenverständnis, Sub-Agenten-Netzwerk, autonomer Loop, CI-Pflicht, Sidebar-Buttons agentmemory/lightRAG). Hermes-Agent-Repo sync mit upstream. Alle Session-Ergebnisse in ZK + AgentMemory + Commit 46c7da8e/folgend dokumentiert. Next: Tiefen-Recherche-Loop starten (Stabilisierung, fehlende Automatisierungen, CI-Audit, Sidebar-Buttons). |
| 2026-08-07 | **PROFIL-KONSOLIDIERUNG (19 → 1):** Alle 19 Profile (/root/.hermes/profiles/) deaktiviert → `profiles.old/` + `profiles.old/2026-08-07/`; Voll-Backup `/opt/nexifyai/backups/profile-consolidation-20260807/profiles-full-backup.tar.gz` (96.8 MB, 11.218 Dateien, SHA256 7d2e58…68e68). Nur `default` bleibt. Nutzungs-Analyse: Dispatcher (COO-Board-Loop) spawnt KEINE Worker-Profile mehr (liest nur .task-Dateien); task_runs endeten 06.08.; 9 Profile hatten 0 Läufe/0 History (compliance, finance, km-agent, ops-watch, reviewer, sage, sales, trader, workspace). inbox-triage (1.3 MB History) + default (721 KB) = einzige mit realer Nutzung. Migriert → default/.env: TELEGRAM_BOT_TOKEN, WHATSAPP_MODE=bridge, WHATSAPP_DM_POLICY, WHATSAPP_ALLOWED_USERS (Telegram-Kanal im default damit aktiv: Bot myNeXifyAI getMe ok). **Gefunden:** workspace-Gateway-Prozess (`-p workspace gateway restart`, aus WebUI-Session gestartet) blockierte 8642 → gekillt; whatsapp-baileys.service (Port 3456, parallele Bridge) = Memory-verboten → **gestoppt+disabled** (native Hermes-Bridge Port 3000 ist Referenz; deren Session invalid → **WhatsApp Re-Pairing nötig**: Dashboard → Pair-with-QR). mcp-discovery-proxy.py CONFIG_PATH → /root/.hermes/config.yaml. **9Router-Key-Erkenntnis:** 15-Zeichen-Key (Container-Env) = nur /v1/models (chat=401); 35-Zeichen-Key (secrets.env CUSTOM_API_KEY) = chat 200. config.yaml (Host+Volume) auf 35er umgestellt + key_env entfernt (YAML-Rebuild aus validem Bak). WebUI-Cron-Jobs (31) laufen im default; 10+ Jobs hatten 401 (Config-Korruption 13:27 + alter Key) — **Fix aktiv nach WebUI-Server-Neustart** (Server cached Config). |
| 2026-08-07 | **GO-LIVE-Härtung (Nachmittag):** OPS-04 geschlossen (Cloud→Lokal komplett: Env-Dateien, Backend-Runtime, E2E Register/Login lokal bestanden); WhatsApp-Bridge connected (OPS-01 ✅); DRY_RUN-Drop-Ins (backend+mail-webhook) entfernt — tote Config, Mails sind ECHT (Hostinger-SMTP direkt, Resend via Backend); backup.sh Duplikat-Block (10b nach rm -rf) entfernt → falsche WARN weg; Docker-Healthchecks ergänzt: prometheus+grafana (monitoring-Compose), firecrawl-api (curl statt wget) — alle healthy; Supabase-MCP auf lokalen Kong-/mcp (mcp-remote-Bridge, read_only_user-PW sync); send_to_qualified_v2.py Welle-B-Email-Dedupe; Phase-1-Tests abgeschlossen (Pipeline 30/30, Bulk 64 Mails inkl. Welle B, Drip-Gegentest 0 Duplikate, Test-Lead 484 gelöscht) |
| 2026-08-07 | **Pascal-Direktive DeepSeek-only (v3.2):** PLAN/REVIEW → flash; Auxiliary-Tiering v3.2 (alle Rollen flash, nur curator/moa_aggregator pro); Upstage nur noch Embedding (Nicht-LLM-Ausnahme); 9router.env solar-mini-Altlast bereinigt; lightrag.env OPENAI_API_BASE/KEY → 9Router; Konfliktmarker-Korruption aus main bereinigt |
| 2026-08-07 | **E2E-GEGENTEST-PFLICHT (v2.3, Pascal-Direktive „Baue stets den E2E-Gegentest ein")**: §5.4 in ARBEITSVORGABEN v2.3 + SOUL.md verankert — unabhängige Gegenprobe widerlegt Primärnachweis (Negativ-/Fehler-/Randfälle, Datenintegrität, Rollback-Pfad, Regression); binäres Ergebnis; Gate §5.3 ergänzt; Kurzreferenz [9]/[10] erweitert; §12-Tabelle ergänzt. Gilt für JEDE Änderung/Behebung/Deployment. |
| 2026-08-07 | **ROLLE GESTARTET + ZENTRALISIERUNG VERIFIZIERT (System-CEO, dauerhaft)**: Rolle gem. SYSTEM-DIREKTIVE §1 angenommen (unwiderruflich). Credential-Coverage 15/15 gegen Prompt-Zugangsdaten verifiziert (Supabase inkl. SECRET_KEY, GitHub dev+org-PAT, Cloudflare Account/Master/API, Vercel Admin/UserID) — SUPABASE_SECRET_KEY in hermes.env ergänzt (lag nur in credentials.env). Live-Stand re-verifiziert 07:12: 15/16 Ports HTTP-antwortend (2222=SSH), 7/7 Endpunkte erreichbar (api-Health-Pfad `/openapi.json`=200). |
| 2026-08-06 | **E2E-SMOKE-FIX (P0, live)**: `nexify-kreislauf-e2e-smoke.service` FAILED (seit 22:59) — Root-Cause: LightRAG-Verarbeitung dauert jetzt 40–60s (Extract ~25s + Merge ~15s + Flush ~4s, DeepSeek-v4-flash via 9Router Think-Max), Smoke-Poll-Timeout war nur 40×1s → brach vor PROCESSED ab (21:59+ reproduzierbar, pass=8 fail=1). Fix: `for i in $(seq 1 40)` → `seq 1 120` in /opt/nexifyai/scripts/autopilot/jobs/kreislauf-e2e-smoke.sh (Backup .bak-20260806) + `systemctl reset-failed`. Verifikation: manueller Lauf 23:36 `pass=10 fail=0` + `exit=0` (LightRAG→AgentMemory sync synced=1). 22:59-transiente Fails (am_health 404, gateway 000000, otel down) nicht reproduzierbar, Folge-Lauf grün. Host-only-Script (nicht im Repo) — Fix direkt am Host, hier dokumentiert. |
| 2026-08-06 | **SYSTEM-DIREKTIVE eingebunden** (`docs/standards/SYSTEM-DIREKTIVE.md`, Pascal-Direktive): Rollenfixierung unwiderruflich/systemweit, Zentralisierung von Wissen & Live-Status (Single Source of Truth), operative Verantwortung mit vorausschauender Logik (Abhängigkeiten lückenlos, Systemstabilität, proaktive Entwicklung). Referenziert in §1a als oberste Direktive. |
| 2026-08-06 | **ROLLE SYSTEM-CEO FESTSCHREIBUNG + LIVE-STAND-ZENTRALISIERUNG (CEO-Start in Produktion)**: §1a neu — Rolle & Mandat (kanonisch: CEO-MISSION-2026-08-06.md + ARBEITSVORGABEN-v2.2.md), Ziele (≥50 K€/Monat), Betriebsmodus (Kanban-Loop coo-board-loop 45m, 19 Profile), Grenzen (Revolut-PAY), Wissenspflicht (AgentMemory), Worker-Protokoll. Live-Stand verifiziert (E2): alle 16 Host-Ports offen, 15/16 Dienste HTTP-grün (401/302/301/307 = Auth/Login normal), 7/7 öffentliche Endpunkte erreichbar; Backend-Health-Pfad = /openapi.json (kein /health). Loop aktiv: Kanban-DB beschrieben 22:18, Recherche-Output ceo-strategie-update-2026-08-06-live.md vorhanden. |
| 2026-08-06 | **SYSTEMVORGABEN v2.2 (Pascal-Direktive)**: §12 verankert — Abweichungs-Null-Toleranz (alle Abweichungen auch außerhalb Fokus → fixen → Produktion mit Ergebnis-Check/Qualitätskontrolle), Betriebshandbuch-Pflicht, Online-Recherchepflicht (proaktiv, Tiefen-Recherche). Kanonisch: docs/standards/ARBEITSVORGABEN-v2.2.md + SOUL.md v2.2 + AgentMemory. |
| 2026-08-06 | Initiale Masterdatei; FRONTEND_URL-Fix, E-Mail-CI (94c3fc44), Profile compliance+sales, WebUI-Rück-Button-Injektion, Backup-verify-Fix, SSE-Keep-Alive, AsyncOpenAI-Timeout |
| 2026-08-06 | Audit Runde 3: 16 Dienste + 6 öffentliche Endpunkte gehealthchecked; SEC-01 geschlossen (Rate-Limit Eigenbau aktiv); OPS-02 geschlossen (145.14.158.198 veraltet); WhatsApp-Bridge DOWN bestätigt (seit 27.07.); MCPs alle OK; Hermes v0.20.0 aktuell; DeepSeek Flash Update keine Breaking Changes; DOC-01 n8n-Cleanup offen |
| 2026-08-06 | **MAIL-DESIGN-VORGABE** (8cfb56ca, Pascal-Direktive): kanonische mail_shell() mit CI-Logo systemweit — alle Mail-Pfade (Angebot, Kundenportal, Follow-up, Kampagne, Kontakt, Outreach, Leads, GTM), HTML+Plain-Text, Dark-Mode-Meta, List-Unsubscribe. Vorgabe: docs/standards/MAIL-DESIGN-VORGABE.md. E2E 85/85. |
| 2026-08-06 | **MAILING-VERSAND 2026-08-06 (Pascal-Direktive „heute Mails raus, bis morgen 09:00, 500 inkl. bereits gesendeter")**: bulk-send-Filter in send_to_qualified_v2.py von score>=50 auf alle gültigen E-Mail-Adressen gesenkt (Bestand: 335 Leads, nur 33 mit score>=50, davon fast alle ohne gültige E-Mail; 155 gültige nicht-kontaktierte Adressen = reales Tagesmaximum ≈ 219 kumuliert inkl. 61+3 zuvor gesendeter); Lead-Template auf mail_shell-Stand (CI-Logo, Werbe-Kennzeichnung, Opt-out {{email}}, DSGVO Art.6/21 + §7 UWG + EU-AI-Act Art.50, Plain-Text-Teil in email_lead.py ergänzt) deployed auf /workspace/templates/{lead_email,lead_email_v2}.html + /usr/local/share/nexifyai-templates/ + src/pipeline/email_lead.py + scripts/send_to_qualified_v2.py (Backups .bak.20260806-mailing); Versand via Hostinger-SMTP läuft mit 60–180s-Delay. BACKUP-GAP supabase-db GESCHLOSSEN (E3: Dump im 00:00-Tarball, verify RESULT=OK 10:48, Timer aktiv). Leadgen-Batch 3000 läuft (107 inserted, ~150/Tag — zu langsam für 500/Tag-Ziel, Pool-Ausbau offen). |
| 2026-08-06 | **MARQUEE-FIX + WHATSAPP + CEO-MISSION (CEO-Runde 4)**: Reduced-Motion-Marquee-Problem E3-bewiesen (CDP-Emulation: Animation tot bei prefers-reduced-motion) + Fix live (globals.css §12-Ausnahme `[style*="nx-marquee"]` 34s!important, Commit 150f8c60, Vercel success, CDP-Nachweis BEWEGT=True beide Modi). WhatsApp-Re-Pairing vorbereitet: alte Session (invalide 27.07.) gesichert+geleert, Bridge active „Waiting for scan…" → QR im Dashboard scannen (hermes-dash.nexifyai.cloud → Channels → WhatsApp). CEO-MISSION-2026-08-06.md versioniert (docs/standards/). 3 Recherche-Subagenten (DACH-Markt, Mitbewerber, B2B-Marketing) gestartet. |
