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
| System-CEO | Hermes Agent (zweiter CEO, ADMIN-Vollmacht, 24/7) — Rolle kanonisch: §1a + docs/standards/CEO-MISSION-2026-08-06.md |
| Sitz | Graaf van Loonstraat 1E, 5921 JA Venlo, NL |
| Kontakt | mail@nexifyai.cloud · +31 6 133 188 56 |
| Ziel | ≥50 K€/Monat ≈ 6 Kunden/Woche (€449/Tag netto) |
| Sprache systemweit | Deutsch (Doku, Kommunikation, Prompts) |
| B2B-Fokus | DACH + NL, ausschließlich B2B |

## 1a. Rolle & Mandat — System-CEO (Hermes) [FESTSCHREIBUNG 2026-08-06]

> **Kanonische Rollen-Definition:** `docs/standards/CEO-MISSION-2026-08-06.md` (Pascal-Direktive, verbindlich).
> **Kanonische Vorgaben:** `docs/standards/ARBEITSVORGABEN-v2.2.md` (§0–§13, Pascal-Direktive — Abweichungs-Null-Toleranz, Betriebshandbuch-Pflicht, Online-Recherchepflicht).
> **Oberste Direktive:** `docs/standards/SYSTEM-DIREKTIVE.md` (Rollenfixierung unwiderruflich, Zentralisierung Single Source of Truth, operative Vorausschau — Pascal-Direktive 2026-08-06).
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
| nexifyai-rss-wiki.timer | 07:30 | RSS-Scan + Wiki-Ingest (Neues → raw/articles + log.md) | ⏳ (wird eingerichtet) |

## 11. Offene Punkte (Live-Gaps → Kanban)

| ID | Gap | Status |
|---|---|---|
| OPS-01 | WhatsApp-Bridge: `whatsapp-baileys.service` (Port 3000) VERBUNDEN (2026-08-07 verifiziert: /health `{"status":"connected"}`). Service-Name im ZK korrigiert (nicht nexifyai-whatsapp-bridge). | ✅ |
| OPS-03 | E-Mail-Triage: inbox-poller.py via IMAP (Hostinger) aktiv — verarbeitet ungelesene Mails als Tasks. Cron-Job im Script-Mode (15min). | ✅ |
| COMPLIANCE-01 | AVV/Drittland-Risiko: OpenRouter bietet Enterprise DPA mit EU-SCCs. Nächster Schritt: DPA-Anfrage. | open |
| TDDDG-01 | Cookie-Banner E2E-Test ausstehend (Browser-Daemon down) | open |
| AGENTS-02 | 3-Ebenen-Org finalisieren (Design-/Security-Squad) | open |
| WHATSAPP-01 | WhatsApp-Kanal-Spezifikation liegt vor (Meta Business AI, 4.986/5.000 Zeichen). Live-Validierung jetzt möglich (Bridge läuft). | open |
| WHATSAPP-02 | Namenskonflikt NOVA vs NeXify AI (NXAI-KOMM-001 §17) + /ki-hinweise-Seite leer | open |
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
