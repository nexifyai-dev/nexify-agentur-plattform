# Verarbeitungsverzeichnis (VVT) nach Art. 30 DSGVO
## NeXifyAI Agentur-Plattform

> **Version:** 1.0 | **Stand:** 08.07.2026 | **Verantwortlicher:** Pascal (Geschäftsführer)
> **Geltungsbereich:** Alle Systeme der NeXifyAI Agentur-Plattform
> **Rechtsgrundlage:** DSGVO Art. 30, ISO 27701 A.7
> **Prüfintervall:** Jährlich, bei neuen Verarbeitungen sofort

---

## Systemübersicht

| ID | System | Typ | Hosting | Port |
|----|--------|-----|---------|------|
| S01 | Hermes Agent Runtime | KI-Agenten-Plattform | VPS srv1243952 | systemd |
| S02 | Hermes WebUI | Browser-Chat-Interface | VPS (Traefik) | admin.nexifyai.cloud |
| S03 | Paperclip Control Plane | Mandantenfähige Steuerung | VPS (Docker) | 3100 |
| S04 | 9Router | LLM-Routing (701 Modelle/77 Provider) | VPS (Docker) | 20128 |
| S05 | agentmemory | Persistenter Speicher für KI-Agenten | VPS (Node) | 3111 |
| S06 | LightRAG | Knowledge Graph / RAG | VPS (Docker) | 9621 |
| S07 | Spaether | Lead-Pipeline | VPS (Python) | 8900 |
| S08 | Supabase | Datenbank (PostgreSQL) | Supabase Cloud (EU) | supabase.com |
| S09 | Cloudflare | DNS, Proxy, CDN | Cloudflare (EU) | cloudflare.com |
| S10 | Vercel | Website-Hosting | Vercel (EU) | vercel.com |
| S11 | Traefik | Reverse-Proxy | VPS (Docker) | 80/443 |
| S12 | NeXifyAI Website | Öffentliche Website | Vercel | nexifyai.cloud |
| S13 | Paperclip Factory | Mandanten-Dashboard | VPS (Traefik) | factory.nexifyai.cloud |

---

## 1. Verarbeitungstätigkeiten

### S01 — Hermes Agent Runtime

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Ausführung von KI-Agenten für Kundenprojekte und interne Automatisierung |
| **Zweck** | Autonome Bearbeitung von Kundenaufträgen, System-Monitoring, Kommunikation über Messenger |
| **Datenkategorien** | Chat-Verläufe (Telegram/Discord/Slack/WhatsApp/Signal/E-Mail), Projektdateien, Konfigurationsdaten, Logs |
| **Betroffene Personen** | Kunden (Studienkolleg, Bookando), Pascal (Geschäftsführer), Agentur-Mitarbeiter |
| **Empfänger** | Paperclip (Auftragssteuerung), 9Router (LLM-Calls), agentmemory (Speicherung) |
| **Löschfrist** | Session-Archive: 30 Tage. Chat-Verläufe: nach Projektabschluss + 90 Tage |
| **Rechtsgrundlage** | Art. 6(1)(b) DSGVO (Vertragserfüllung), Art. 6(1)(f) (Berechtigtes Interesse) |
| **Drittland** | LLM-Provider via 9Router (siehe S04) |
| **TOM** | API-Key-Verschlüsselung (env), Secret-Redaction, Tenant-Isolation, Zugriffsbeschränkung (systemd) |

### S02 — Hermes WebUI

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Webbasiertes Chat-Interface für Agentensteuerung |
| **Zweck** | Direkte Interaktion mit KI-Agenten, System-Administration |
| **Datenkategorien** | Chat-Nachrichten, Session-Daten, Login-Daten (Basic Auth), Browser-Fingerprint |
| **Betroffene Personen** | Pascal (Admin) |
| **Empfänger** | Hermes Agent Runtime (intern), Traefik (Reverse-Proxy) |
| **Löschfrist** | Sessions: nach Abmeldung. Chat-Verläufe: 30 Tage |
| **Rechtsgrundlage** | Art. 6(1)(f) DSGVO (Berechtigtes Interesse: System-Administration) |
| **Drittland** | Kein (selbst gehostet) |
| **TOM** | HTTPS (TLS 1.3), Basic Auth, Secret-Redaction, IP-Whitelist (Traefik) |

### S03 — Paperclip Control Plane

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Mandantenfähige Steuerung von KI-Agenten, Auftragsverwaltung, Routinen |
| **Zweck** | Orchestrierung aller Agenten-Aufträge, Projektmanagement, Kundenverwaltung |
| **Datenkategorien** | Projekt-Metadaten, Agenten-Konfiguration, API-Keys (Referenzen), Auftragsdaten, Kundenstammdaten |
| **Betroffene Personen** | Kunden (Studienkolleg, Bookando), Pascal (Admin) |
| **Empfänger** | Hermes Agent Runtime, agentmemory, Supabase |
| **Löschfrist** | Projektbezogene Daten: nach Vertragsende + 3 Jahre (gesetzliche Aufbewahrung) |
| **Rechtsgrundlage** | Art. 6(1)(b) DSGVO (Vertragserfüllung), Art. 6(1)(c) (rechtliche Verpflichtung) |
| **Drittland** | Kein (selbst gehostet) |
| **TOM** | Tenant-Isolation (Company-Trennung), API-Key-Referenzen (DS_SLUG), HTTPS (intern) |

### S04 — 9Router

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Routing von LLM-Anfragen an 701 Modelle / 77 Provider |
| **Zweck** | Optimierte KI-Modellauswahl, Token-Spar-Layer, Fallback-Ketten |
| **Datenkategorien** | Prompt-Inhalte, LLM-Antworten, Token-Zähler, Modell-Präferenzen |
| **Betroffene Personen** | Kunden (via Agenten-Kommunikation), Pascal (interne Nutzung) |
| **Empfänger** | DeepSeek, OpenAI, Anthropic, xAI, Nous Research, MiniMax, Kimi, nscale, Z.AI/GLM (wechselnd je nach Routing) |
| **Löschfrist** | Prompt/Response: kein Logging im Regelbetrieb. Error-Logs: 7 Tage |
| **Rechtsgrundlage** | Art. 6(1)(b) DSGVO (Vertragserfüllung), Art. 28 DSGVO (Auftragsverarbeitung mit Providern) |
| **Drittland** | USA (OpenAI, Anthropic, xAI, Nous), China (DeepSeek, MiniMax, Kimi, Z.AI/GLM), EU (nscale) |
| **TOM** | Input/Output-Filter, Token-Budget-Limits, Non-Interactive-Mode, No-Logging-Policy im Regelbetrieb |

### S05 — agentmemory

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Persistente Speicherung von Agenten-Erinnerungen, Sessions, Entscheidungen |
| **Zweck** | Kontext-Erhalt über Sessions, Wissensmanagement, Multi-Agent-Kollaboration |
| **Datenkategorien** | Agenten-Observations, Session-Daten, Projekt-Metadaten, Entscheidungsprotokolle, Code-Snippets |
| **Betroffene Personen** | Kunden (via Agenten-Output), Pascal (Admin-Entscheidungen) |
| **Empfänger** | Hermes Agent, Paperclip, LightRAG (Wissensgraph) |
| **Löschfrist** | Observations: nach Projektende + 90 Tage. Memories: nach 365 Tagen Inaktivität |
| **Rechtsgrundlage** | Art. 6(1)(f) DSGVO (Berechtigtes Interesse: System-Betrieb) |
| **Drittland** | Kein (lokal auf VPS) |
| **TOM** | Lokale Speicherung (VPS), Secret-Redaction, Tenant-Scoping (project-Feld), REST-API localhost-only |

### S06 — LightRAG

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Knowledge Graph und semantische Suche über Dokumente |
| **Zweck** | DIN/ISO-konforme Wissensbasis, RAG für KI-Agenten |
| **Datenkategorien** | Governance-Dokumente, Projektpläne, Regelwerke, SOPs, Text-Embeddings |
| **Betroffene Personen** | Keine personenbezogenen Daten (ausschließlich Dokumente) |
| **Empfänger** | Hermes Agent Runtime, agentmemory |
| **Löschfrist** | Dokumente: synchron mit Quell-Repo. Embeddings: bei Re-Indexierung |
| **Rechtsgrundlage** | Art. 6(1)(f) DSGVO (Berechtigtes Interesse: Wissensmanagement) |
| **Drittland** | LLM-Embeddings via nscale (EU) für Embedding-Modell |
| **TOM** | Lokaler Docker-Container, Auth-Mode: disabled (intern), Embedding-Modell in EU |

### S07 — Spaether

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Lead-Recherche und Pipeline-Management |
| **Zweck** | Automatisierte Akquise von potenziellen Kunden |
| **Datenkategorien** | Unternehmensdaten (öffentlich), Kontaktdaten (öffentlich), Lead-Status |
| **Betroffene Personen** | Potenzielle Kunden (Unternehmen) |
| **Empfänger** | Hermes Agent Runtime (zur Weiterverarbeitung) |
| **Löschfrist** | Leads ohne Fortschritt: 90 Tage. Abgelehnte Leads: sofort |
| **Rechtsgrundlage** | Art. 6(1)(f) DSGVO (Berechtigtes Interesse: Kundenakquise B2B) |
| **Drittland** | Kein (lokal) |
| **TOM** | Lokales Python-Service, keine Speicherung personenbezogener Daten außer öffentlichen Firmendaten |

### S08 — Supabase

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Cloud-Datenbank für Kundenprojekte und interne Anwendungen |
| **Zweck** | Persistente Datenspeicherung, Authentifizierung, Row-Level-Security |
| **Datenkategorien** | Projektdaten, Kundenstammdaten, Auth-Tokens, API-Logs |
| **Betroffene Personen** | Kunden (Studienkolleg, Bookando), Pascal (Admin) |
| **Empfänger** | Paperclip, Hermes Agent, Website |
| **Löschfrist** | Projektdaten: nach Vertragsende + 3 Jahre. Auth-Tokens: nach Session-Ende |
| **Rechtsgrundlage** | Art. 6(1)(b) DSGVO (Vertragserfüllung), Art. 6(1)(c) (rechtliche Verpflichtung) |
| **Drittland** | EU (Supabase EU-Region). Subprocessor: AWS (EU) |
| **TOM** | RLS (Row-Level-Security), Tenant-Schema-Trennung, SSL/TLS, AVV mit Supabase vorhanden |

### S09 — Cloudflare

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | DNS-Management, Reverse-Proxy, CDN, DDoS-Schutz |
| **Zweck** | Verfügbarkeit und Sicherheit aller öffentlichen Endpunkte |
| **Datenkategorien** | IP-Adressen, DNS-Queries, TLS-Zertifikate, Traffic-Metadaten |
| **Betroffene Personen** | Alle Besucher der NeXifyAI-Domains |
| **Empfänger** | Cloudflare Inc. (USA), Traefik (intern) |
| **Löschfrist** | DNS-Logs: 24h. Analytics: 30 Tage |
| **Rechtsgrundlage** | Art. 6(1)(f) DSGVO (Berechtigtes Interesse: IT-Sicherheit) |
| **Drittland** | USA (Cloudflare Inc.). Angemessenheitsbeschluss: EU-US DPF |
| **TOM** | TLS 1.3, DDoS-Schutz, AVV mit Cloudflare |

### S10 — Vercel

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Hosting der öffentlichen Website nexifyai.cloud |
| **Zweck** | Bereitstellung der Unternehmenswebsite |
| **Datenkategorien** | Webserver-Logs, Deployment-Daten, Build-Logs |
| **Betroffene Personen** | Website-Besucher |
| **Empfänger** | Vercel Inc. (USA), Cloudflare (Proxy) |
| **Löschfrist** | Server-Logs: standardmäßig Vercel-intern. Build-Logs: 30 Tage |
| **Rechtsgrundlage** | Art. 6(1)(f) DSGVO (Berechtigtes Interesse: Webpräsenz) |
| **Drittland** | USA (Vercel Inc.). EU-US DPF |
| **TOM** | HTTPS, GitHub-Integration, AVV mit Vercel |

### S11 — Traefik

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Reverse-Proxy, TLS-Terminierung, Routing |
| **Zweck** | Internes Routing aller Services auf dem VPS |
| **Datenkategorien** | HTTP-Header, Client-IPs, TLS-Handshakes |
| **Betroffene Personen** | Pascal (Admin-Zugriffe), Kunden (via API) |
| **Empfänger** | Alle internen Services (S01–S07) |
| **Löschfrist** | Access-Logs: 7 Tage |
| **Rechtsgrundlage** | Art. 6(1)(f) DSGVO (Berechtigtes Interesse: IT-Betrieb) |
| **Drittland** | Kein (selbst gehostet) |
| **TOM** | TLS 1.3, IP-Whitelist, Basic Auth, Docker-Isolation |

### S12 — NeXifyAI Website

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Bereitstellung der öffentlichen Website nexifyai.cloud |
| **Zweck** | Unternehmensdarstellung, Kundenakquise, Kontaktaufnahme |
| **Datenkategorien** | Seitenaufrufe (anonym), Kontaktformular-Daten (Name, E-Mail, Nachricht) |
| **Betroffene Personen** | Website-Besucher, potenzielle Kunden |
| **Empfänger** | Vercel (Hosting), Cloudflare (Proxy), Hermes Agent (Kontaktanfragen) |
| **Löschfrist** | Kontaktanfragen: nach Bearbeitung + 90 Tage |
| **Rechtsgrundlage** | Art. 6(1)(a) DSGVO (Einwilligung bei Kontaktformular), Art. 6(1)(f) (Webpräsenz) |
| **Drittland** | USA (Vercel, Cloudflare). EU-US DPF |
| **TOM** | HTTPS, kein Tracking ohne Einwilligung, Cookie-frei (keine Analytics-Cookies) |

### S13 — Paperclip Factory

| Feld | Inhalt |
|------|--------|
| **Verarbeitungstätigkeit** | Mandanten-Dashboard für Kundenprojekte |
| **Zweck** | Kunden-Interface für Projektverfolgung, Auftragsstatus |
| **Datenkategorien** | Projektstatus, Auftragsdaten, Login-Daten |
| **Betroffene Personen** | Kunden (Studienkolleg, Bookando), Pascal (Admin) |
| **Empfänger** | Paperclip API (intern) |
| **Löschfrist** | Session-Daten: nach Abmeldung. Projektansichten: nach Vertragsende |
| **Rechtsgrundlage** | Art. 6(1)(b) DSGVO (Vertragserfüllung) |
| **Drittland** | Kein (selbst gehostet) |
| **TOM** | HTTPS, Tenant-Isolation, Login-Auth |

---

## 2. Zusammenfassung: Empfänger & Drittländer

| Empfänger | Land | Garantie | Betroffene Systeme |
|-----------|------|----------|-------------------|
| DeepSeek | China | AVV (geplant) | S04 |
| OpenAI | USA | EU-US DPF + AVV | S04 |
| Anthropic | USA | EU-US DPF + AVV | S04 |
| xAI | USA | EU-US DPF | S04 |
| Nous Research | USA | EU-US DPF | S04 |
| MiniMax | China | AVV (geplant) | S04 |
| Kimi/Moonshot | China | AVV (geplant) | S04 |
| nscale | EU (Norwegen) | Angemessenheitsbeschluss | S04, S06 |
| Supabase | EU | AVV vorhanden | S08 |
| Cloudflare | USA | EU-US DPF + AVV | S09 |
| Vercel | USA | EU-US DPF + AVV | S10 |

---

## 3. Datenkategorien (Übersicht)

| Kategorie | Beispiele | Betroffene Systeme |
|-----------|----------|-------------------|
| Stammdaten | Name, Unternehmen, Kontaktdaten | S03, S07, S08, S12 |
| Kommunikationsdaten | Chat-Verläufe, E-Mails | S01, S02, S12 |
| Projekt- & Auftragsdaten | Projektstatus, Tasks, Agenten-Output | S01, S03, S05, S08, S13 |
| Technische Daten | IP-Adressen, Logs, Session-Cookies | S02, S09, S10, S11 |
| Authentifizierungsdaten | API-Keys (Referenzen), Auth-Tokens | S03, S08 |
| LLM-Daten | Prompts, LLM-Responses | S04 |
| Konfigurationsdaten | System-Config, Deployment-Parameter | S01, S05, S11 |
| Embeddings/Wissen | Vektorisierte Dokumente, Knowledge-Graph | S06 |

---

## 4. Löschfristen (Übersicht)

| Frist | Daten |
|-------|-------|
| < 24h | DNS-Logs (Cloudflare) |
| 7 Tage | Error-Logs (9Router), Access-Logs (Traefik) |
| 30 Tage | Session-Archive (Hermes), Chat-Verläufe (WebUI), Analytics (Cloudflare), Build-Logs (Vercel) |
| 90 Tage | Chat-Verläufe nach Projektende, Observations nach Projektende, Kontaktanfragen, Leads ohne Fortschritt |
| 365 Tage | Inaktive agentmemory Memories |
| 3 Jahre | Projektbezogene Daten nach Vertragsende (gesetzl. Aufbewahrung), Supabase-Projektdaten |
| sofort | Abgelehnte Leads (Spaether), abgelaufene Auth-Tokens |

---

## 5. TOM-Referenzen (Technische und Organisatorische Maßnahmen)

| Maßnahme | Referenz |
|----------|---------|
| Tenant-Isolation | REGELWERK_MASTER §9, BOUNDARY_ENFORCEMENT_GATES_V1 |
| Secret-Management | REGELWERK_MASTER §2.2, SECURITY_P0_CONFIG_SECRETS |
| Zugriffskontrolle | ZUGRIFFSMATRIX (P0-015 ✅) |
| Incident Response | INCIDENT_RESPONSE_POLICY_V1 |
| Backup & Recovery | BACKUP_RESTORE_DR_POLICY_V1 |
| Change Management | CHANGE_MANAGEMENT_POLICY_V1 |
| Data Classification | CUSTOMER_DATA_CLASSIFICATION_POLICY |
| Prompt-Filter | PROMPT-FILTER-INTEGRATION (P0-021 ✅) |

---

## 6. Versionierung

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-07-08 | Hermes Agent (Automode) | Initiales VVT nach Art. 30 DSGVO für alle 13 Systeme |

---

*Dieses Verarbeitungsverzeichnis ist Teil des DSGVO-Compliance-Systems der NeXifyAI Agentur-Plattform.*
*Nächste planmäßige Überprüfung: 2026-10-08 | Verantwortlicher: Pascal (Geschäftsführer)*
