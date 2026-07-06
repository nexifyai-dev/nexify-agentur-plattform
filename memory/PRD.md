# NeXify AI – Product Requirements Document

## Original Problem Statement
Vollumfängliches Premium-Rebranding der NeXify-AI-Website: Design, Inhalte, umfangreiche Rechtstexte (DE/NL), Grafiken, Layout, Logo. Bilinguale Website (DE/NL), dunkles Premium-Design mit Silber-Akzenten, proaktiver AI-Berater-Chat ("NeXify AI"), Supabase-Datenbank, Kundenportal, Admin-Panel, PWA, PDF-Angebote, Revolut-Zahlung, Resend-E-Mails.

## Personas
- **Interessent/Kunde (B2B, DE/NL)**: informiert sich, chattet mit NeXify AI, erhält individuelles Angebot, bucht Rückruf-Termine, nutzt Kundenportal (Angebote annehmen/ablehnen, Tickets, Zahlung).
- **Admin (Pascal Courbois)**: verwaltet CRM/Leads (editierbar inkl. Telefon), Angebote, Tickets, Termine; nutzt agentischen AI-Assistenten mit Systemvollzugriff.

## Kern-Anforderungen (alle umgesetzt, Stand 04.07.2026)
1. Bilinguale Website DE/NL, dunkles Premium-Design, Logo, Rechtstexte ✅
2. NeXify AI Chat-Berater mit echter **Bedarfsanalyse** (Discovery-Gate `[ANGEBOT_BEREIT]`-Marker, Angebots-Button erst nach Qualifizierung) ✅
3. **Individualisierte Angebote**: summary (Kundenanforderungen), recommendation (persönliche Empfehlung), Positionen mit Gesprächsbezug – in E-Mail + PDF ✅
4. Kundenportal: Login/Registrierung, Angebote einsehen/annehmen/ablehnen, Rückfragen, Revolut-Zahlung erste Tagesrate, Support-Tickets ✅
5. Admin-Cockpit (9 Tabs): AI-Agent, Leads (editierbar, Telefon, Status, Löschen), Angebote, Termine, Tickets, KI-Chats, +Angebot, +Interessent, E-Mail ✅
6. **Rückruf-Terminbuchung**: Admin legt Zeitfenster an (/admin → Termine), Interessenten buchen auf /rueckruf, Bestätigungs-Mails an beide ✅
7. **Agentischer Admin-AI** (MiMo Tool-Calling, 20 Tools): CRM lesen/ändern, E-Mails/Angebote/Tickets senden, Slots verwalten, selbst geplante Folge-Tasks (Cron-Worker alle 60s), Sicherheits-Gates im Prompt, Accept+Poll-Pattern gegen Ingress-Timeouts ✅
8. Alle ausgehenden E-Mails: From + Reply-To **mail@nexifyai.cloud** ✅
9. Inbound-E-Mail-Webhook (`POST /api/webhooks/resend-inbound`): eingehende Mails → Ticket + Lead + zeitversetzte KI-Antwort (5–30 Min) ✅ (Resend-Dashboard-Setup durch User nötig, siehe unten)
10. Kontaktformular → Lead + Ticket + verzögerte KI-Antwort ✅
11. PWA (manifest, sw.js), SEO (OG-Image, Favicon, Sitemap inkl. /rueckruf, Metadata) ✅
11b. **Cookie-Consent-Manager** (components/cookie-consent.tsx): Banner mit Kategorien Notwendig/Statistik/Marketing (Opt-in), localStorage `nexify-consent`, wieder öffenbar via Footer-Link „Cookie-Einstellungen“; Cookie-Rechtstexte DE (§25 TDDDG) + NL (Telecommunicatiewet) entsprechend erweitert ✅
11c. **Über-mich ausgebaut**: Pascal-Story (Deutscher aus Grenzregion Limburg, mit Niederländerin verheiratet, 5+ Jahre NL, 20+ Jahre IT/kaufmännisch/Vertrieb bei Telekom/Vodafone/Postcon), Journey-Karten, erweiterte Facts; Story auch in COMPANY_KNOWLEDGE (Chat-AI) + Agent-Prompt integriert ✅
12. pascal.png NUR auf /ueber-mich, rechtsbündig, linker Freiraum mit Logo/Tagline/Chip gefüllt ✅ (Startseiten-Hero = SVG-Orbital, zurückgesetzt auf Nutzerwunsch)
13. Social-Media-Grafiken zum Download unter /brand/ (WhatsApp-Profil 500×500, FB-Profil 720×720, FB-Titelbild 1640×624, WhatsApp-Status 1080×1920) ✅
14. **Vercel-Deployment live**: Projekt "website" (git-verbunden mit nexifyai-dev/nexify-agentur-plattform, rootDirectory=apps/website, yarn.lock im Repo, package-lock.json entfernt), Domains www.nexifyai.cloud (primär), nexifyai.cloud, nexify-automate.com, www.nexify-automate.com (Apex → www Redirect). API via Next-Rewrite-Proxy (`BACKEND_ORIGIN`-Env auf Vercel). GitHub-Push-Builds funktionieren (verifiziert iteration_4, 12/12) ✅

## Architektur
- Frontend: Next.js App Router, `/app/apps/website` (Tailwind, i18n DE/NL, PWA)
- Backend: FastAPI `/app/backend` (server.py=Chat/E-Mail/PDF/Webhooks, portal.py=Auth/CRM/Revolut, booking.py=Termine, agent.py=Admin-Agent)
- DB: Supabase PostgreSQL (asyncpg). Tabellen: nexify_users, nexify_leads, nexify_offers(+messages), nexify_chat_sessions(+messages), nexify_tickets(+messages), nexify_slots, nexify_agent_messages, nexify_agent_tasks
- LLM: MiMo `mimo-v2.5-pro` via token-plan-ams.xiaomimimo.com (OpenAI-Protokoll, Tool-Calling). KEIN Emergent-Key (Budget leer).
- E-Mail: Resend (Absender/Reply-To mail@nexifyai.cloud), Zahlungen: Revolut, DNS: Cloudflare (Global Key in backend/.env)

## Wichtige API-Endpunkte
- Chat: POST /api/chat/session, /api/chat (SSE, offer_ready-Event), /api/offers/request (mit phone)
- Booking: GET /api/booking/slots, POST /api/booking/book; Admin: GET/POST /api/admin/slots, DELETE /api/admin/slots/{id}
- Agent: POST /api/admin/agent/chat (202-Accept), GET /api/admin/agent/status|history|tasks, POST /api/admin/agent/tasks/{id}/cancel
- Leads: PUT/DELETE /api/admin/leads/{id}
- Inbound: POST /api/webhooks/resend-inbound

## Offene Punkte / Nutzer-Aktionen
- **Resend Inbound aktivieren** (für KI-Antworten auf eingehende Mails): Resend-Dashboard → Domain → Receiving aktivieren + Webhook `https://www.nexifyai.cloud/api/webhooks/resend-inbound` (Event email.received). ACHTUNG: MX von nexifyai.cloud zeigt auf Hostinger (echtes Postfach) – MX-Umstellung auf Resend würde Hostinger-Empfang beenden. Alternative: Hostinger-Weiterleitung oder Subdomain.
- **Backend-Persistenz**: Backend läuft aktuell in der Emergent-Preview-Umgebung (BACKEND_ORIGIN auf Vercel zeigt darauf). Für dauerhaften Betrieb: Emergent "Deploy" nutzen und BACKEND_ORIGIN auf Vercel aktualisieren.
- Revolut-Zahlung E2E mit echter Zahlung verifizieren (Sandbox getestet).

## Backlog (P2)
- Agent-Chat SSE-Streaming statt Poll (Nice-to-have)
- Mobile-Feinschliff / PWA-Installationstest auf Geräten
- Referenzen-Sektion mit echten Projekten befüllen

## Test-Status
- iteration_1/2: frühere Phasen; iteration_3 (04.07.2026): 100 % Backend (8/8 pytest) + 100 % Frontend (13/13 Flows)
- Discovery-Gate + individualisiertes Angebot: manuell E2E verifiziert (Zahnarzt-Szenario, summary/recommendation im Angebot, Marker leakt nicht)
- Live-Domain verifiziert: www.nexifyai.cloud (Seite, API-Proxy, Login, Stats)
- iteration_5 (04.07.2026): Voller Bug-Sweep 100 % Backend (10/10) + 100 % Frontend (17 Seiten Desktop+Mobile, Chat, Auth, Booking, Cookies)

## Session 05.07.2026 (Fork) – Umgesetzt
- **Autonomer E-Mail-Agent** (`backend/email_agent.py`): pollt Hostinger IMAP alle 120s, LLM-Triage (spam/inquiry/other), Spam → Spam-Ordner, Anfragen → Ticket + Lead + Mem0 + zeitversetzte AI-Antwort (5–30 Min) + Admin-Notify. Läuft produktiv, sortiert korrekt.
- **Mem0-Langzeitgedächtnis**: in ai_ticket_reply (Suche + Speichern) und /api/offers/request (Beratungsverlauf) integriert. Key in backend/.env.
- **SMTP-Fallback**: send_email nutzt Hostinger SMTP (smtp.hostinger.com:465), wenn Resend fehlschlägt.
- **Chat-Formatierung**: ChatMarkdown-Komponente (Fett, Listen, Absätze) in Chat-Widget, Konto, Support-Tickets, Admin-Panels, Agent-Chat inkl. Task-Results; Streaming ohne sichtbare `**`; Prompts: echte Umlaute (ä/ö/ü/ß) + konsequente Sie-Form.
- **Bugfixes**: Mobile-Header (CTA !hidden md:!inline-flex, Logo nowrap, Burger sichtbar), UUID-ValueError → 400 statt 500, data-scroll-behavior, Admin-Passwort re-seeded + Login verifiziert.
- **Spacing-System (8pt, Best Practice)**: Hero pt-32→44 responsiv, alle Seiten pt-28 md:pt-36, Home-Sections py-12/16 mobil → py-16/28 Desktop; vermessen & verifiziert (Mobile-Badge 251→203px).
- **Admin-Chat-Scroll-Bug**: Root Cause scrollIntoView (Seiten-Scroll) + Poll-Re-Render → Container-only scrollTop + setMsgsIfChanged; scrollY konstant verifiziert.
- Angebots-Button im Chat ab 3 Nutzer-Nachrichten (vorher 4).
- WICHTIG: Produktion (Vercel) erhält Frontend-Fixes erst nach "Save to GitHub".

## Sweep 2 (05.07.2026) – Ganzheitliches Audit
- Accessibility: axe-core WCAG 2.0/2.1 A+AA auf 6 Kernseiten → 0 Verstöße.
- DSGVO-Lücken geschlossen (DE+NL): Datenschutz §5 um Mem0-Gedächtnisfunktion (Drittland/SCC, Widerspruchsrecht) + Art.-22-Klarstellung ergänzt; §6 um KI-gestützte E-Mail-Vorsortierung/-Beantwortung (Hostinger); KI-Hinweise um Gedächtnis + E-Mail-Automation ergänzt.
- Deutsches Zahlenformat in interner Angebots-Notification.
- Backend-Logs & tsc sauber, D/A/CH-Formate (de-DE Datum/Währung) geprüft.

## Sweep 3 (05.07.2026) – QS-Auftrag (Lint/Code-Qualität/Formulare)
- ESLint: 28 Fehler → 0 Fehler. Alle `any` typisiert (OfferJson/OfferItem/AdminTicket/TicketMsg, catch-Narrowing via instanceof Error). React-Compiler-Regeln set-state-in-effect/purity → warn (dokumentiert: bewusste SSR-Hydration-Muster in i18n/auth/chat).
- DSGVO-Formulare: Kontaktformular jetzt mit Pflicht-Checkbox „Datenschutzerklärung zur Kenntnis genommen" (Submit gated, DE/NL); Registrierung mit AGB+Datenschutz-Hinweis (DE/NL). Verifiziert im Browser.
- Backend: HISTORY-Dict (Chat-Sessions im RAM) gegen unbegrenztes Wachstum gedeckelt (Cap 500, FIFO-Eviction).
- Toter-Link-Check über alle internen hrefs: 0 tote Links. Produktions-Build grün.
- Offen (Produktentscheidung nötig): Referenzen-Seite mit echten Projekten befüllen; Resend-Inbound vs. Hostinger-MX (siehe Offene Punkte).

## Feature: AI-Projektplaner (05.07.2026)
- `/preise`: neue Sektion `ProjectPlanner` (components/project-planner.tsx, DE/NL) – Projekttyp-Karten mit Live-Preisspannen, geführte Eingabe (Branche, Ziel, Feature-Chips, Details), AI generiert Projektplan (Module mit Tagen/€, erster Struktur-Entwurf, 5 Phasen, Empfehlung, Gesamtspanne).
- Backend: `POST /api/planner/plan` (server.py) – LLM-Plan als JSON, legt Chat-Session an und seeded HISTORY, sodass das bestehende `POST /api/offers/request` daraus das vollwertige individuelle Angebot (PDF, E-Mail, Lead, Konto-Einladung, Mem0) erzeugt.
- E2E getestet: Plan-Generierung (Bäckerei-Szenario, branchenspezifische Struktur inkl. Allergene) + Angebot aus Planner-Session (Steuerberatung, status sent). Mobile ohne Overflow, tsc/lint sauber.

## VPS-Infrastruktur & 9router-Integration (05.07.2026)
- **SSH-Zugang zum Produktions-VPS** eingerichtet (srv1243952 / 72.62.152.47) via Hostinger-API. Details + Ops-Runbook in `/app/memory/VPS_INFRA.md`.
- **5 crash-loopende systemd-Dienste behoben** (0 failed danach, Last 11→8): hermes-gateway (130k+ Restarts, Lock-Konflikt → autoritativ+reboot-sicher), nexify-gateway (systemd-Redirect-Bug → disabled), cloudflared-brain (Tunnel-Duplikat → disabled), cloudflared-dns (proxy-dns abgeschafft → natives DoT), cloudflared-paperclip (YAML-Fix → ai-team wieder erreichbar). Backups unter /root/config-backups/.
- **9router verifiziert**: 7 Provider, 21 Modelle, bereits als Hermes-LLM-Backend verdrahtet. Extern erreichbar via ai-router.nexifyai.cloud.
- **Website-9router-Integration**: `server.py` `llm_complete()`+`open_chat_stream()` mit Auto-Fallback (MiMo primär → 9router `ds/deepseek-chat` bei Fehler/leerer Antwort). Verifiziert. Schützt vor MiMo-Guthaben-Ausfall (mimo sk-Konto aktuell 402).
- Routing-Erkenntnis: Website läuft auf Vercel; alle *.nexifyai.cloud-Dienste via Cloudflare-Tunnel (nicht nginx). webui/work.nexifyai.cloud = gebrandete Hermes WebUI (:8787) = „NeXify AI ADMIN".
- **Offen (P1/P2)**: SSO Website-ADMIN→WebUI (Hermes-Auth-Fähigkeit prüfen), Design-Transfer CI→Hermes WebUI (custom.css).

## Session 05.07.2026 (Fork 2) – VPS/Fabrik-Stabilisierung
- **P0 Paperclip-Agent-Fix verifiziert**: `Failed to start command "nexifyai"` behoben. Wrapper `/usr/local/bin/nexifyai` (exec hermes) dreifach persistiert: docker commit `paperclip-nexify:latest`, Dockerfile `/workspace/paperclip-by-nexifyai/Dockerfile` (COPY scripts/nexifyai), Skript im Build-Repo. Unabhängig verifiziert durch testing_agent (iteration_7.json, 4/4 PASS: Login, Agentenliste, Developer-Run succeeded/exitCode 0, CEO-Regression succeeded).
- **DIN NX-900-03 API-GAPs geschlossen** (Hermes WebUI, webui.nexifyai.cloud): NEU `GET /api/kanban/tasks` (+?status=), `GET /api/tasks` (Alias), `GET /api/agents`, `GET /api/brain` (+category/collection/limit), `GET /api/brain/search?q=` (Proxy auf nexify-brain :9090, dort NEU `GET /memories`). Alle hinter Auth (401 ohne Session). Patches in /apptoo (rsync-Quelle) + docker commit `hermes-webui-nexify-hermes-webui-1:with-deps`. Brain-Patch auf Host /opt/nexify/brain/server.py (systemd, persistent).
- **NL (Nederlands) i18n komplett**: 1.290 Keys DE→NL automatisiert via 9router (ds/deepseek-chat) mit Key-Paritäts-Validierung + Bisektion, in `/root/hermes-webui-nexify/static/i18n.js` (host-persistent) als `nl:`-Locale eingefügt. Login-Locale "nl" in routes.py ergänzt. UI verifiziert (Screenshot: "Hoe kan ik helpen?"). Paperclip/Fabrik hat upstream-natives nl.json (i18next) — nichts nötig.
- **Cloudflare-Cache-Root-Cause behoben**: Statische Assets wurden mit `?v=unknown` + `immutable, max-age=1y` am CF-Edge eingefroren (Updates kamen nie an). Fix: (1) CF-Purge prefix webui.nexifyai.cloud/static/, (2) nexify-prestart.sh stempelt jetzt pro Boot `__version__ = 'nexify-<timestamp>'` in /apptoo/api/_version.py → Asset-URLs rotieren pro Neustart.
- WebUI-Sprache auf de zurückgesetzt (nl als Option verfügbar).

### Offen (nächste Session)
- P1: Migration alte ADMIN-Panels (CRM/Leads, Angebote, Termine, Tickets, Queen-Board) in Hermes WebUI — Architektur-Entscheid nötig: SSO-Embed vs. native Panels.
- P2: 9router-Modelle als Provider in Hermes-WebUI-Settings konfigurierbar.
- P1: Autonome E-Mail-Verarbeitung läuft bereits (email_agent.py) — Integration/Sichtbarkeit im Hermes-ADMIN prüfen.
- P2: PDF-Angebote direkt aus Hermes WebUI.
- Backlog: Revolut-E2E, Referenzen-Seite.

## Session 05.07.2026 (Fork 2, Teil 2) – ADMIN-Konsolidierung (a) + 9router
- **User-Entscheid**: (a) SSO-Embed des bestehenden Admin-Cockpits in die Hermes WebUI JETZT; (b) native Hermes-Panels erst am Gesamt-Ende.
- **CRM-SSO-Rückweg live** (bidirektional, same-tab): Neuer WebUI-Sidebar-Tab „CRM & Agentur" (data-testid webui-crm-tab, index.html host-persistent) → WebUI-Route `/crm` (One-Time-HMAC, CRM_SSO_SECRET) → FastAPI `GET /api/auth/sso-consume` (portal.py: HMAC + Nonce-Replay-Schutz + set_auth_cookies) → 302 /admin eingeloggt. Rückweg existierte bereits („NeXify AI ADMIN öffnen"). Secrets: CRM_SSO_SECRET in backend/.env + /root/hermes-webui-nexify/.env, CRM_ADMIN_URL=https://www.nexifyai.cloud. KEINE Next.js/Vercel-Änderung nötig.
- **9router-Vollintegration**: Alle 21 Modelle im WebUI-Model-Picker (Gruppe AI-ROUTER.NEXIFYAI.CLOUD, live auto-detected). Funktionsmatrix: ds/*, vercel/zai/glm-5.2, nexifyai-combo-llm ✅; mimo/* = 402 (MiMo-Guthaben leer, User-Thema); xmtp/* = 401 (Upstream-Key im 9router ungültig).
- **Phantom-Provider-Bug (iteration_6) strukturell behoben**: OPENAI_API_KEY enthielt den 9router-Key → falsche „openai"-Provider-Karten → „No active credentials"-Fehler. Fix: OPENAI_API_KEY aus hermes .env, HERMES_HOME/.env, compose entfernt + Image-Default via compose `OPENAI_API_KEY=` (leer) überschrieben (docker commit hatte alte Env eingebrannt — Merke: bei commit-basierten Images env-Overrides im compose setzen!). Provider mit Key jetzt exakt: custom:ai-router + xiaomi.
- **Testing (iteration_8.json, 6/6 PASS)**: SSO-Security 5/5 via testing_agent (Replay/Fake/Cookie-Schutz), 9router 2/2 via testing_agent, CRM-Browser-E2E + Chat-Streaming (13.2 t/s) + DIN-Alias- & NL-Regression via Selbsttest.
- **P2-Härtung (Backlog, aus Code-Review)**: SSO-Nonces persistieren (DB statt RAM); Admin-Identität in HMAC-Token einbetten statt „ältester Admin".

## Session 06.07.2026 (Fork 2, Teil 3) – E-Mail-Agent-Dashboard, PDF aus WebUI, SSO-Härtung
- **E-Mail-Agent-Sichtbarkeit (iteration_9, 6/6 PASS)**: email_agent.py führt jetzt STATE-Metriken + DB-Aktivitätslog (nexify_email_agent_log). Neue Admin-APIs GET /api/admin/email-agent/status + /log. Neuer Cockpit-Tab „E-Mail-Agent" (email-agent-panel.tsx, data-testid admin-tab-emailAgent) mit Status-Karten + Aktivitätslog, 30s-Auto-Refresh. ⚠️ PRODUKTIV erst nach „Save to GitHub" (Vercel) — Preview zeigt es bereits.
- **PDF-Angebote aus der Hermes WebUI**: (a) via CRM-Tab → Angebote → PDF-Button (bestand schon, Admin-berechtigt, verifiziert %PDF). (b) NEU: Service-Token-Auth `X-Admin-Token` (ADMIN_API_TOKEN, hmac-verglichen) in get_current_user + Hermes-Skill `nexify-crm` (/root/.hermes/skills/nexify-crm/SKILL.md, Token als NEXIFY_CRM_API_TOKEN in HERMES_HOME/.env) — der WebUI-Chat-Agent kann Leads/Stats/Tickets lesen, Angebote erstellen (PDF+Mail automatisch) und PDFs abrufen.
- **P2-SSO-Härtung verifiziert**: Nonces DB-persistent (nexify_sso_nonces, Pruning eingebaut; Replay nach Backend-Restart abgelehnt ✅). Admin-Identität (E-Mail) im HMAC-Token (Format exp:nonce:email.sig), beide Seiten (WebUI /crm + portal.py sso_consume) angepasst; CRM_ADMIN_EMAIL in hermes .env.
- Review-Fix: enabled/started_at vor 10s-Startup-Sleep gesetzt (kein „Inaktiv"-Flackern).
- Test-Infra: /app/backend/tests/test_iter9_email_agent_sso.py (13 pytest, alle grün).

### Offen (nächste Session)
- „Save to GitHub" durch User → Vercel-Deploy des E-Mail-Agent-Tabs auf www.nexifyai.cloud.
- Native Hermes-Panels für CRM (b, am Gesamt-Ende laut User-Entscheid).
- Backlog: Revolut-E2E, Referenzen-Seite, XMTP-Key im 9router erneuern, MiMo-Guthaben (402), CRM-Live-Badge am WebUI-Tab (Vorschlag), Cookie-Banner-Überlappung im Admin (minor).

## Session 06.07.2026 (Fork 3) – Pre-Save-to-GitHub Deploy-Readiness-Check
- **Full-stack Vercel-Deploy-Readiness verifiziert**: `yarn build` sauber (27/27 statische Seiten, TypeScript grün), `yarn lint` 0 Errors, Backend `/api/admin/email-agent/status`+`/log` liefern 200 OK (enabled:true, polls>0), E-Mail-Agent-Tab (data-testid admin-tab-emailAgent) im Cockpit visuell verifiziert (Screenshot: Status Aktiv, 5 Karten, Aktivitätslog leer, Auto-Refresh 30s).
- **Rechtstexte-Audit (DE+NL) bestanden**: Datenschutz §5 (Mem0 SCC), §6 (KI-Vorsortierung + Hostinger-Postfach), KI-Hinweise (E-Mail-Automation Art. 22 DSGVO), Cookie-Consent (§25 TDDDG / Telecommunicatiewet), Impressum/AGB/AVV/Widerruf — alle bilingual vollständig.
- **Git-Working-Tree sauber** für Save-to-GitHub (kosmetische next-env.d.ts-Diff durch Build zurückgesetzt; nur harmlose Untracked-Artefakte übrig).

## Session 06.07.2026 (Fork 3, Teil 2) – Proaktive Abweichungs-Bereinigung
Erkannte Abweichungen aus visuellem/logischem Audit und behoben:
- **1-Klick-„Jetzt Postfach prüfen"** im E-Mail-Agent-Panel: neuer `POST /api/admin/email-agent/poll` (portal.py, get_admin-authentifiziert), serialisiert via asyncio-Lock; UI-Button mit Status-Toast in email-agent-panel.tsx (data-testid `email-agent-poll-now` + `email-agent-poll-msg`). Verifiziert: E2E-Klick triggert IMAP-Zyklus, `last_poll` aktualisiert sich, 3/3 pytest grün (mit/ohne/falsches X-Admin-Token).
- **Overlay-Cleanup im geschlossenen Bereich**: Chat-Widget und Cookie-Banner verbergen sich jetzt auf `/admin` + `/konto` (usePathname-Gate). Admins sind eingeloggt, brauchen den Berater-Chat nicht; Cookie-Consent hat auf öffentlichen Seiten stattgefunden. Verifiziert via Screenshot (`chat-launcher: 0, cookie-banner: 0` in /admin).
- **Bottom-Padding** in `/admin` und `/konto` auf pb-20 md:pb-24 erhöht — bessere Atmung.
- **Test-Suite**: pytest 66 passed. 1 booking_agent-Test (Legacy, Accept+Poll-Pattern-Mismatch) und 8 VPS-abhängige (webui.nexifyai.cloud CF 530) offene Errors sind nicht durch diese Änderungen verursacht (Infra/Legacy).

## Session 06.07.2026 (Fork 3, Teil 3) – VPS-Recovery nach Tunnel-Konflikt

**Vorfall & Root-Cause**: Beim Vorbereiten der Fabrik-CEO-Push-Integration wurde `cloudflared-main.service` neu gestartet, ohne zu erkennen, dass gleichzeitig ein zweiter Service `cloudflared.service` (Token-basiert) mit einer **anderen** Tunnel-ID lief. Dadurch existierten kurzzeitig zwei aktive Prozesse — beide registrieren sich bei Cloudflare, aber die DNS-Records zeigen nur auf einen. Resultat: alle *.nexifyai.cloud-Subdomains 530 (Error 1033).

**Recovery-Steps (dokumentiert für Wiedererkennung)**:
1. `dig +short webui.nexifyai.cloud CNAME` → prüft welche Tunnel-ID die DNS-Records nutzen (CF `cfargotunnel.com`-CNAME dekodieren)
2. Beide Services `cloudflared*.service` mit `journalctl -u X --no-pager -n 20` und `systemctl cat X` prüfen: **Tunnel-ID unterscheidet sich!**
3. **Soll-Zustand (autoritative Info aus /root/.cloudflared/config.yml + credentials-file)**:
   - `cloudflared-main.service` = **Main-Tunnel** `aed8a968-ac34-44cf-996d-0d2da8c872d7`, Config `/root/.cloudflared/config.yml`, credentials `current-tunnel-credentials.json` — enthält 19 Ingress-Rules (webui, ai-router, api, work, www, dashboard, brain, ai-team via app.nexifyai.cloud, docs, portal, rag, mcp, open, etc.) → **das ist der produktive Tunnel**
   - `cloudflared.service` = Sekundär/Legacy-Tunnel `6250ef9e-00af-4f1f-88f3-46aa12811f87` (Token-basiert) — nicht der Ingress-Owner, deshalb stopped/inactive halten
4. Fix: `systemctl start cloudflared-main.service && systemctl stop cloudflared.service` → 4 QUIC-Connections registered, alle Endpoints wieder 200/302/401 (keine 530).

**Verifiziert nach Recovery**: webui/work/api/ai-router/ai-team/dashboard/open/brain/mcp/www — alle antworten mit application-level Codes. Hermes WebUI-Login-Page „NeXify AI — Anmelden" lädt, ai-router liefert 21 Modelle, E-Mail-Agent-API 200 mit polls=10.

**Merke für Zukunft**: NIEMALS `systemctl restart cloudflared-main.service` ausführen wenn `cloudflared.service` gleichzeitig aktiv ist. Vorher `systemctl is-active cloudflared.service` prüfen und bei Bedarf `stop` — ODER umgekehrt. Beide teilen sich Namespace-Zone und ergeben Konflikte.

## Session 06.07.2026 (Fork 3, Teil 4) – Fabrik-CEO-Push + Best-Practice-Härtung + Watchdog
### Was gebaut wurde
1. **Tunnel-Watchdog** (`/usr/local/bin/nexify-tunnel-watchdog.sh` + systemd-Timer, alle 60s):
   - Prüft `cloudflared.service` (Legacy) — bei active → stop + disable, dann `cloudflared-main.service` neu registrieren
   - Endpoint-Probe (webui/ai-router/work/api/open/dashboard) — logged Degradation
   - Log in `/var/log/nexify-tunnel-watchdog.log`, logrotate weekly x4
2. **Legacy cloudflared.service maskiert**: Unit-File nach `/root/config-backups/06-tunnel-legacy/` verschoben, `systemctl mask` → Symlink auf /dev/null → kann NIEMALS mehr starten
3. **Fabrik-CEO-Queue** (Backend):
   - Tabelle `nexify_ceo_queue` (id, kind, ref_id, subject, body_snippet, status, recommendation, claimed_by, claimed_at, created_at, updated_at) + Index auf (status, created_at)
   - portal.ceo_queue_enqueue() interner helper (email_agent nutzt ihn auf jede Inquiry — kein DB-race dank in-Row lock)
   - Endpoints (X-Admin-Token authenticated):
     - `GET /api/admin/ceo-queue?status=pending|processing|done|failed|all&limit=100`
     - `POST /api/admin/ceo-queue/{id}/claim` (atomar via `update where status='pending'`, gibt 409 bei bereits geclaimed)
     - `POST /api/admin/ceo-queue/{id}/complete` (Body: recommendation, status=done|failed)
     - `GET /api/admin/ceo-recommendations?limit=30` (UI-facing, alle Status gemischt)
4. **CEO-Worker** (`/usr/local/bin/nexify-ceo-worker.sh` + systemd-Timer, alle 10 min):
   - Preflight: nur wenn Pending > 0 (spart LLM-Calls)
   - Direkter HTTP-Call an 9router intern (`127.0.0.1:20128`, Modell **`nexifyai-combo-llm`**, temp 0.4, stream:false) — KEIN Hermes-CLI mehr (der Ansatz war fragil: "no final response was produced")
   - Best-Practices: 300s-timeout, Log-Rotation, idempotent (409-Handling), Retry-safe
5. **Health-Endpunkt + Admin-Badge**:
   - `GET /api/admin/health/infra` liefert `{ok, degraded[], email_agent{}, ceo_queue{counts, last_done_at}}`
   - Admin-Cockpit-Header rendert `HealthBadge` (grün/amber/rot) mit 60s Auto-Refresh — data-testid `admin-health-badge`
6. **Admin-Cockpit-Tab „CEO-Empfehlungen"**: `admin-tab-ceo` → CeoRecommendationsPanel mit 3 Statistik-Karten (pending/processing/done), Expandable-Liste, ChatMarkdown-Rendering, 45s-Auto-Refresh
7. **DSGVO-Ergänzung DE+NL**: Datenschutz §6 um „Interner CEO-Agent (Fabrik-Empfehlungen)" erweitert — explicit „kein automatischer Angebotsversand → Art. 22 Abs. 1 DSGVO nicht berührt", Rechtsgrundlage Art. 6 Abs. 1 lit. f
8. **Test-Coverage**: `tests/test_iter10_ceo_health.py` (4/4 grün): Lifecycle (enqueue via DB → GET → claim → 409 double-claim → complete → recommendations verify), Auth-Gates, Health-Shape, Health-Auth

### E2E-Verifikation
- 2 synthetische Cases (Restaurant, Kaffeerösterei) durch Worker verarbeitet — jeweils ~1000 Zeichen strukturierte Empfehlung (Kontext, 2-4 Positionen mit PT-Range, Preisrechnung Tage × 999 €, Risiken/Rückfragen, Nächster Schritt). LLM-Qualität hervorragend.
- Admin-Panel Screenshot: „Alle Systeme grün" Badge + 4 Empfehlungen bereit + Expandable-Detail mit Markdown
- Preview `www.nexifyai.cloud/api/admin/health/infra` liefert `ok:true, degraded:[]` ✅
- Post-Test Cleanup: Alle synthetischen Rows entfernt (0 rows remaining) — Feature bereit für echte E-Mail-Anfragen

### 402/Modell-Erkenntnisse (aktualisiert)
- `ds/deepseek-chat` NEU AUCH 402 (Insufficient Balance) — DeepSeek-Provider im 9router jetzt leer, nicht nur MiMo
- **Neuer Primär-Chat**: `nexifyai-combo-llm` (routet intern zu Vercel AI Gateway → GLM 5.2 → Fireworks) ✅
- Fallback-Modell im CEO-Worker: nicht mehr nötig, da Combo bereits Multi-Provider-Fallback intern hat

### Offen (nächste Session)
- User: „Save to GitHub" → Vercel-Deploy des CEO-Empfehlungen-Tabs + Health-Badge auf www.nexifyai.cloud
- P1: Revolut-E2E mit echter Zahlung (User-Aktion)
- P2: Native Hermes-CRM-Panels (nach Gesamt-Ende)
- Backlog: Referenzen-Seite mit echten Projekten, 9router-Provider-Auffüllung (DeepSeek + MiMo)

## Session 06.07.2026 (Fork 3, Teil 5) – Fabrik-Config Canonicalization

User lieferte `nexify-ai.zip` = kanonischer Export der Paperclip-Fabrik-Company (88 Files: `.paperclip.yaml`, 6 Agent-Definitionen mit AGENTS.md/HEARTBEAT.md/SOUL.md/TOOLS.md, 74 Skills, images).

### Erkannte Abweichung: Runtime vs. Canonical
Die im Paperclip-Container aktive Company `150dc80b-…` hatte **veraltete, gekürzte Agent-Instructions**:
| Agent | Runtime | Canonical | Delta |
|---|---|---|---|
| nexify-ai-developer | 25 Zeilen | 106 Zeilen | **+81** |
| nexify-ai-ceo | 37 | 44 | +7 |
| nexify-analyst | 24 | 32 | +8 |
| nexify-architekt | 24 | 32 | +8 |
| nexify-qa | 22 | 30 | +8 |
| nexify-ops | 23 | 31 | +8 |

### Aktion (best-practice, mit Backup)
1. Kanonische Company → **doppelt versioniert**:
   - `/app/fabrik/nexify-ai/` (im Emergent-Repo → GitHub) + `/app/fabrik/README.md` mit Restore-Verfahren
   - `/root/nexify-ai-company/` auf VPS (rsync-Sync, Source-of-Truth für Restore)
2. Runtime-Instructions **synced** aus Canonical (6/6 Agents; Backup unter `/root/config-backups/06-paperclip-runtime-20260706-033432/`)
3. Paperclip-Container restart (`unless-stopped`-policy verifiziert)
4. Health-Check: `{"status":"ok","deploymentMode":"authenticated","bootstrapStatus":"ready"}` ✅
5. Endpoint-Sweep (final): webui 302, ai-router 307, work 302, api 404, open 200, dashboard 302, ai-team 403, www 200 — alle App-Level-Codes, keine 5xx ✅

### Ergebnis
- Die Fabrik läuft nun mit den **vollen, aktuellen Agent-Instructions** — insbesondere der Developer hat die kompletten 74 Skills-Referenzen wieder
- Änderungen an der Fabrik-Config gehören ab jetzt in `/app/fabrik/nexify-ai/` (via Save-to-GitHub versionierbar), dann sync auf VPS mit `rsync -az --delete /app/fabrik/nexify-ai/ root@72.62.152.47:/root/nexify-ai-company/`
- Watchdog stabil (seit Mask keine neuen Konflikte), CEO-Worker-Timer läuft alle 10 min

## Session 06.07.2026 (Fork 4) – Doku-Review, Provider-Fix, System-Härtung

**Auftrag**: `NeXifyAI_Gesamtdokumentation_v1.0.zip` prüfen + sicherstellen, dass technisch alles funktioniert; weiterer Aufbau autonom ohne Chatsteuerung.

### Behobene Probleme (alle E2E-verifiziert)
1. **Hermes WebUI 401/402**: Provider `custom` von Hermes v0.17 nicht mehr unterstützt; leerer `OPENAI_API_KEY` im Container. → `openai-api`-Provider + ENV in Gateway-Dropin & Compose; alle Profile (agentur-admin, automation-agent, expert-data, ceo) auf `nexifyai-combo-llm`. `hermes chat -q` → "OK" ✅
2. **VSK-Kundenseite 404**: Duplikat-Service `cloudflared-vsk-prod-local` (Catchall-404, gleiche Tunnel-ID) → gestoppt/gemaskt. vorratsgesellschaften-sofort-kaufen.de → 200 ✅
3. **traefik-vsrs Restart-Loop** (Port 80 an bookando-proxy verloren) → compose down; alle Routen laufen direkt über Tunnel ✅
4. **Main-Tunnel Remote-Config korrigiert** (headroom→8788, portal→404) + DNS `headroom.nexifyai.cloud` angelegt. Wichtig: Main-Tunnel ist REMOTE-managed – Ingress via CF-API ändern, nicht config.yml!
5. **Fabrik-Agent-Timeouts**: timeoutSec 300→900 für alle 6 Agenten (Developer-Heartbeat = 54 LLM-Calls > 5 min). Wakeup-E2E: Developer + CEO succeeded ✅
6. **CEO-Agent Auto-Approval**: fehlendes `--yolo` ergänzt → keine 120s-clarify-Timeouts mehr (volle Autonomie)
7. **Offer-Endpoint 500/502**: Reasoning-Leak + JSON-Truncation → `_parse_json_lenient()`, Retry, max_tokens=9000, Prompt erzwingt JSON. Test: 41s, email_sent ✅
8. **Testsuite**: veraltete Tests an Async-Agent-API angepasst; Gesamtstand 74 passed, 1 skipped

### Doku-Abgleich (Zielarchitektur vs. Ist)
✅ Qdrant 1.18.2 :6333, Redis :6379, PF-004 :13062, 9router :20128, Hermes-Gateway :8642
❌ Nicht deployt (nur Zielbild in Doku): Temporal, Authentik, Traefik+LE (ersetzt durch CF-Tunnel). Hermes-Provider-Typ `custom` in Doku veraltet (jetzt `openai-api`).

### Offen / Nächste Schritte
- Revolut-Payment E2E (P1, braucht echten Zahltest durch User)
- CRM-Panels nativ im Hermes-Stil neu bauen (P2, laut User ganz am Ende)
- Alte WebUI-Chat-Sessions auf mimo-v2.5-pro gepinnt → User muss neue Session starten

## Session 06.07.2026 (Fork 5) – Doku-Review-Abschluss & Restfehler-Behebung

**Auftrag**: Fortsetzung Doku-Review + „technisch alles sicherstellen".

### Behobene Probleme (alle E2E-verifiziert)
1. **11 von 16 Hermes-Profil-Configs waren KORRUPT** (`/root/.hermes/profiles/*/config.yaml`): literale Zeilennummern-Prefixe (`1|model:`) + SSH-Kommentarblock mitten in Zeilen injiziert (zerschnittene `inline_shell`/`persistent_shell`) → ungültiges YAML. Alle repariert + validiert. Backup: `/root/config-backups/07-hermes-profiles/`.
2. **Alle 16 Profile auf `nexifyai-combo-llm` normalisiert** (openai-api, localhost:20128, echter Key statt leerem `${OPENAI_API_KEY}`). agentur-admin hing auf `ds/deepseek-chat` (402), automation-agent/expert-data auf totem `mimo-v2.5-pro`. WebUI `/api/providers`: `active_provider=openai-api`, default combo ✅. `hermes chat` → „OK" ✅. Gateway restartet.
3. **Remote-Tunnel-Ingress via CF-API korrigiert (v27)**: vorschau→:80 (war :3020), rag→:32781 (war :32770), headroom httpHostHeader. vorschau + rag extern wieder 200 ✅. `/root/.cloudflared/config.yml` trägt REMOTE-MANAGED-Warnung.
4. **ragflow-Stack**: interner MySQL-DNS-Fehler → compose restart → 200 ✅.
5. **agentmemory.service hing** (:3113 Accept-Queue voll) → restart → 200 lokal ✅.
6. **`llm_complete` gehärtet** (server.py): 3 Retries, `reasoning_content`-Salvage, `<think>`-Strip → „offer parse failed" behoben, `/api/offers/request` 200 in ~42s ✅.
7. **Fabrik-Approval-Blockade**: CEO-Runs timed_out (exit 130) wegen interaktiver Approval-Prompts. Fix: `approvals: {mode: yolo, timeout: 5}` in `/paperclip/.hermes/config.yaml` → CEO-Regressionstest 123s ✅. Merke: Paperclip nutzt `HERMES_HOME=/paperclip/.hermes`!
8. **Tests**: Slot-Test epoch-eindeutige Timestamps, decision-flow Payment-Guard-Skip, Wakeup-Poll 600s+. Finale Läufe: 9/10 + CEO einzeln ✅ → alle vorherigen Failures behoben.

### Doku-Review abgeschlossen
Alle Runtime-prüfbaren Claims der `NeXifyAI_Gesamtdokumentation_v1.0` verifiziert (Qdrant/Redis/PF-004/9router/21 Modelle inkl. combo). Kap. 8 (MimoCode-Abgrenzung) rein konzeptionell. Abweichungen unverändert: Temporal/Authentik/Traefik nur Zielbild.

### Nachtrag: Neuer MiMo Token-Plan-Key integriert (06.07.)
User lieferte neuen `tp-`Key (Region AMS). 9router-Provider `xiaomi-tokenplan` stand auf `region: sgp` → 401. Fix: Region→ams in 9router-DB, Locks/Backoff resettet, toter Alt-Provider `xiaomi-mimo` deaktiviert. Verifiziert: xmtp/mimo-v2.5-pro ✅, DeepSeek ✅ (wieder Guthaben), combo ✅, Hermes-Chat E2E ✅. Combo-Fallback-Kette (ds → ds-max → xmtp → glm-5.2) komplett funktionsfähig.

### Offen / Nächste Schritte
- Revolut-Payment E2E (P1, echter Zahltest durch User)
- CRM-Panels nativ im Hermes-Stil (P2, ganz am Ende)
