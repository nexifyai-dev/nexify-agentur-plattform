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
