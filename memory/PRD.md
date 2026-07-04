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
