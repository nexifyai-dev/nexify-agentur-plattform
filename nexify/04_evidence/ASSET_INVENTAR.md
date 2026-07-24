# ASSET-INVENTAR — NeXify AI

**Stand:** 2026-06-23 | **Version:** 1.0.0 | **Owner:** Pascal Courbois / Systemmaster  
**Klassifikation:** intern | **Normbezug:** ISO 27001 A.8 (Asset Management)  
**Nächste Prüfung:** 2026-07-23

---

## 1. Asset-Klassen (ISO 27001 A.8.1)

| Klasse | ISO-Bezug | Beschreibung |
|--------|-----------|-------------|
| **I** — Information/Daten | A.8.2 | Datenbestände, Dokumente, Logs, Secrets |
| **S** — Software | A.8.3 | Anwendungen, Systemsoftware, Skills |
| **H** — Hardware | A.8.4 | Server, Netzwerk |
| **D** — Dienstleistung | A.8.5 | SaaS, Cloud, Provider |
| **P** — Personen | A.8.6 | Rollen, Agenten, Externe |

## 2. Kritikalität & Datenklassen

| Stufe | Bedeutung | Beispiele |
|-------|-----------|-----------|
| **P0** | Systemkritisch — Ausfall = Geschäftsstillstand | 9Router, Brain, Secrets |
| **P1** | Hoch — Ausfall = schwerer Betriebseinschränkung | Qdrant, Cloudflare-Tunnel, Cron |
| **P2** | Mittel — Ausfall = Workaround möglich | Vercel-Deploy, Monitoring |
| **P3** | Niedrig — kein direkter Betriebseinfluss | Doku, Archive |

| Datenklasse | Definition |
|-------------|-----------|
| 🔓 öffentlich | Für jedermann zugänglich (Website, README) |
| 🔒 intern | Nur NeXify-Team (Doku, Architektur) |
| 🔐 vertraulich | Nur Owner/Escalation (Angebote, Kundenprojekte) |
| 👤 personenbezogen | DSGVO-relevant (Kundendaten, Logs mit Identitäten) |
| 🛡️ besonders schützenswert | Besondere Kategorien (AVV/TOM) |
| ⚡ Secret | API-Keys, Tokens, Passwörter |

## 3. Risiken

| Risiko | Beschreibung |
|--------|-------------|
| Fehlkonfiguration | Service durch falsche Config unerreichbar |
| Datenabfluss | Unautorisierter Export/Verlust von Daten |
| Secret-Leak | API-Key/Token in Git, Logs, Brain oder RAG |
| Vendor-Lock-in | Abhängigkeit von einem Provider (DeepSeek, Cloudflare) |
| Shadow-AI | Ungesteuerter KI-Einsatz durch Agenten |
| Production-Ausfall | Service nicht erreichbar |

---

## 4. Asset-Inventar

### 4.1 Information / Daten (I)

| Asset-ID | Name | Typ | Owner | Kritikalität | Datenklasse | Normbezug | Zugriff | Risiko | Maßnahmen |
|----------|------|-----|-------|-------------|-------------|-----------|---------|--------|-----------|
| I-001 | Brain API (SQLite) | Wissensdatenbank | Systemmaster | P0 | 🔒 intern | A.8.2, A.12 | Systemmaster, Agents | Datenverlust, Fehlkonfiguration | Tägliches Backup, Read-Only für Agents |
| I-002 | agentmemory (SQLite) | Agenten-Memory | Systemmaster | P0 | 🔒 intern | A.8.2, A.12 | Systemmaster, Agents | Datenverlust, Context-Poisoning | Tägliches Backup, Retention-Policy |
| I-003 | Qdrant (Vektordb) | Vektorspeicher (9.249 Points) | Systemmaster | P1 | 🔒 intern | A.8.2 | Brain-API, Agents | Datenverlust, Korruption | Wöchentliches Backup |
| I-004 | 9Router db.json | Routing-Datenbank | Systemmaster | P0 | ⚡ Secret | A.8.2, A.10 | Root (Pascal) | Datenabfluss, Secret-Leak | Vor-Change-Backup, kein Git |
| I-005 | Secrets (~/.nexify/secrets/) | API-Keys, Tokens, Passwörter | Pascal | P0 | ⚡ Secret | A.8.2, A.9, A.10 | Root (Pascal) | **Secret-Leak** | Nie in Git/Logs/Brain/RAG, Rotation geplant |
| I-006 | Kundendaten (bookando) | Kundenprojekt-Daten | Pascal | P1 | 👤 personenbezogen | A.8.2, DSGVO | Pascal, Bookando-Agents | Datenabfluss, Shadow-AI | Tenant-Trennung, keine Freigabe in AI ohne AVV |
| I-007 | Kundendaten (studienkolleg-aachen) | Kundenprojekt-Daten | Pascal | P1 | 👤 personenbezogen | A.8.2, DSGVO | Pascal, Studienkolleg-Agents | Datenabfluss, Shadow-AI | Tenant-Trennung |
| I-008 | Governance-Dokumente (/root/.nexify/) | Policies, Regeln | Systemmaster | P1 | 🔒 intern | A.8.2 | Root, Systemmaster | Datenverlust | Wöchentliches Backup |
| I-009 | Arbeitsdaten (/workspace/nexify/) | Projekt-Ordnungssystem | Systemmaster | P1 | 🔒 intern | A.8.2 | Agents | Datenverlust | Wöchentliches Backup, Git-Repository |
| I-010 | System-Logs (/var/log/, Docker) | Betriebslogs | Systemmaster | P2 | 🔒 intern | A.8.2, A.12 | Root | Secret-Leak in Logs | Log-Scann auf Secrets, Rotation |
| I-011 | Agenten-Outputs (Brain, Artefakte) | Agentenprodukte | Systemmaster | P2 | 🔒 intern | A.8.2 | Agents | Datenabfluss | Evidence-Pflicht, Audit |
| I-012 | Prompts (Hermes-Profile, Seelen) | Agenten-Identitäten | Pascal | P0 | 🔐 vertraulich | A.8.2 | Pascal, Promptmaster | Fehlkonfiguration, Shadow-AI | Nur Promptmaster ändert Production-Prompts |
| I-013 | Hermes-Profil (nexify-ceo) | Agentenkonfiguration | Pascal | P1 | 🔒 intern | A.8.2 | Pascal, Systemmaster | Fehlkonfiguration | Backup vor Change |
| I-014 | Angebote, AVV/TOM-Daten | Vertrags-/Compliance-Daten | Pascal | P1 | 🔐 vertraulich | A.8.2, DSGVO, AVV | Pascal | Datenabfluss | Verschlüsselung, Zugriffsbeschränkung |
| I-015 | E-Mails (Resend/cloudflare-email) | Kommunikationsdaten | Pascal | P2 | 👤 personenbezogen | A.8.2, DSGVO | Pascal | Datenabfluss | Retention-Policy |
| I-016 | Production-Cron-Register | Automatisierungsregister | Systemmaster | P2 | 🔒 intern | A.8.2 | Systemmaster | Fehlkonfiguration | Versioniert in Git |

### 4.2 Software (S)

| Asset-ID | Name | Typ | Owner | Kritikalität | Datenklasse | Normbezug | Zugriff | Risiko | Maßnahmen |
|----------|------|-----|-------|-------------|-------------|-----------|---------|--------|-----------|
| S-001 | 9Router (nexifyai-combo-llm) | KI-Router (deepseek-v4-flash + reasoner) | Pascal | **P0** | 🔒 intern | A.8.3, A.14 | Systemmaster, Agents | **Production-Ausfall**, Vendor-Lock-in | No-Full-Crash-Policy, Backup vor Change |
| S-002 | Brain API (Port 9090) | Knowledge-Store | Systemmaster | **P0** | 🔒 intern | A.8.3 | Agents | **Production-Ausfall**, Datenverlust | systemd, tägliches Backup, Health-Check |
| S-003 | agentmemory (Port 9091) | Agent-Memory-Service | Systemmaster | **P0** | 🔒 intern | A.8.3 | Agents | **Production-Ausfall** | systemd, tägliches Backup |
| S-004 | Qdrant (Port 6333) | Vektordatenbank | Systemmaster | P1 | 🔒 intern | A.8.3 | Brain-API | Datenverlust | systemd, 4 Collections |
| S-005 | RAGFlow | Retrieval-Augmented Generation | Systemmaster | P2 | 🔒 intern | A.8.3 | Systemmaster | Fehlkonfiguration | 0 Datasets (noch nicht aktiv) |
| S-006 | Hermes WebUI | Agent-Oberfläche | Pascal | P1 | 🔒 intern | A.8.3 | Agents, User | Fehlkonfiguration | |
| S-007 | Cloudflare Tunnel (brain+agentmemory) | Tunnel zu Brain/agentmemory | Pascal | P1 | 🔒 intern | A.8.3, A.13 | Cloudflare | Production-Ausfall | Tunnel-Monitoring, Rollback-Plan |
| S-008 | Vercel Deployments | Website/App-Deployment | Pascal | P1 | 🔒 intern | A.8.3 | Systemmaster | Fehlkonfiguration | CI/CD, Rollback |
| S-009 | Supabase | Datenbank-Backend | Pascal | P1 | 👤 personenbezogen | A.8.3, DSGVO | Backend | Datenabfluss | Zugriffsbeschränkung |
| S-010 | Resend | E-Mail-Versand | Pascal | P2 | 👤 personenbezogen | A.8.3, DSGVO | Systemmaster | Datenabfluss | API-Key-Management |
| S-011 | Hermes-Agenten (NeXify CEO, automation, QA, oracle) | KI-Agenten | Pascal | P0 | 🔒 intern | A.8.3 | Agents | Shadow-AI, Fehlkonfiguration | Scope, Logging, Rate-Limit, Kill-Switch |
| S-012 | MCP-Server | Tool-Gateway | Systemmaster | P1 | 🔒 intern | A.8.3 | Agents | Fehlkonfiguration | Permission-Matrix |
| S-013 | Cron-Jobs (Sync alle 4h, Compliance) | Automatisierte Jobs | Systemmaster | P1 | 🔒 intern | A.8.3 | Systemmaster | Production-Ausfall | Monitoring, Logging |
| S-014 | nexifyai-platform (GitHub) | Codebase | Pascal | P0 | 🔒 intern | A.8.3 | Pascal, Systemmaster, Agents | Secret-Leak, Fehlkonfiguration | CI/CD, Gitleaks, Dependabot |
| S-015 | bookando-api / bookando-de (GitHub) | Kunden-Codebase | Pascal | P1 | 🔐 vertraulich | A.8.3, DSGVO | Pascal, Bookando-Agents | Datenabfluss | Separates Repo, CI/CD |
| S-016 | 9router (decolua/9router) | Routing-Software | Pascal | P1 | 🔒 intern | A.8.3 | Pascal, Systemmaster | Vendor-Lock-in | OSS, selbst gehostet |
| S-017 | Coolify | Deployment-Plattform | Pascal | P2 | 🔒 intern | A.8.3 | Pascal | Fehlkonfiguration | |
| S-018 | Docker-Container (~42 Container) | Containerisierte Dienste | Systemmaster | P1 | 🔒 intern | A.8.3 | Root | Fehlkonfiguration | Docker-Compose, Backup |
| S-019 | GitHub Actions (CI/CD) | CI/CD-Pipelines | Pascal | P1 | 🔒 intern | A.8.3 | Pascal, Systemmaster | Secret-Leak | Secrets nie in Logs, Gitleaks |
| S-020 | Cloudflare Pages/Workers | Serverless-Functions | Pascal | P2 | 🔒 intern | A.8.3 | Systemmaster | Vendor-Lock-in | |
| S-021 | VPS systemd Services | Infrastruktur-Dienste | Systemmaster | P1 | 🔒 intern | A.8.3 | Root | Production-Ausfall | Health-Check, Restart-Policy |
| S-022 | Hermes Skills (05_skills/) | Agenten-Skills | Systemmaster | P1 | 🔒 intern | A.8.3 | Agents | Fehlkonfiguration | Versioniert |
| S-023 | Oracle (Dispatcher) | Dispatch-System | Systemmaster | P1 | 🔒 intern | A.8.3 | Agents | Fehlkonfiguration | |

### 4.3 Hardware (H)

| Asset-ID | Name | Typ | Owner | Kritikalität | Datenklasse | Normbezug | Zugriff | Risiko | Maßnahmen |
|----------|------|-----|-------|-------------|-------------|-----------|---------|--------|-----------|
| H-001 | VPS srv1243952 (Hostinger) | Root-Server (72.62.152.47) | Pascal | **P0** | — | A.8.4, A.11 | Root (Pascal) | **Production-Ausfall**, Datenverlust | Hetzner-Hosting, DR-Plan, Backups |
| H-002 | NAS (WebDAV) | Netzwerkspeicher | Pascal | P2 | 🔒 intern | A.8.4 | Pascal, Systemmaster | Datenverlust | Backup nicht bestätigt |
| H-003 | Lokales System (Workstation) | Entwicklungsrechner | Pascal | P2 | 🔒 intern | A.8.4 | Pascal | Datenabfluss | |

### 4.4 Dienstleistungen / Cloud (D)

| Asset-ID | Name | Typ | Owner | Kritikalität | Datenklasse | Normbezug | Zugriff | Risiko | Maßnahmen |
|----------|------|-----|-------|-------------|-------------|-----------|---------|--------|-----------|
| D-001 | Hostinger (VPS) | Server-Hosting | Pascal | **P0** | — | A.8.5, A.11 | Pascal | **Vendor-Lock-in**, Production-Ausfall | DR-Plan, monatliches Backup |
| D-002 | Cloudflare (DNS, Tunnel, CDN, Mail) | DNS/CDN/Tunnel/Mail | Pascal | **P0** | — | A.8.5 | Pascal, Systemmaster | **Production-Ausfall**, Vendor-Lock-in | DNS-Backup, Tunnel-Rollback |
| D-003 | Vercel | Deployment-Plattform | Pascal | P1 | — | A.8.5 | Pascal, Systemmaster | Vendor-Lock-in | CI/CD, Rollback |
| D-004 | GitHub | Code-Hosting, CI/CD | Pascal | **P0** | — | A.8.5 | Pascal, Systemmaster | **Vendor-Lock-in**, Secret-Leak | Secrets nie in Repos, Gitleaks |
| D-005 | DeepSeek via nscale | LLM-Provider | Pascal | **P0** | — | A.8.5 | Systemmaster (via 9Router) | **Vendor-Lock-in**, Secret-Leak | API-Key-Rotation, Fallback-Provider |
| D-006 | Supabase (Cloud) | DBaaS | Pascal | P1 | 👤 personenbezogen | A.8.5, DSGVO | Pascal, Backend | Vendor-Lock-in, Datenabfluss | AVV erforderlich |
| D-007 | Resend | E-Mail-API | Pascal | P2 | 👤 personenbezogen | A.8.5, DSGVO | Systemmaster | Vendor-Lock-in | |
| D-008 | 9Router (self-hosted) | KI-Routing | Pascal | **P0** | — | A.8.5 | Pascal | Vendor-Lock-in | Multi-Provider, Fallback |
| D-009 | Docker Hub / Container Registry | Container-Images | Systemmaster | P2 | — | A.8.5 | Systemmaster | Vendor-Lock-in | |

### 4.5 Personen / Rollen (P)

| Asset-ID | Name | Typ | Owner | Kritikalität | Datenklasse | Normbezug | Zugriff | Risiko | Maßnahmen |
|----------|------|-----|-------|-------------|-------------|-----------|---------|--------|-----------|
| P-001 | Pascal Courbois | CEO / Inhaber | Pascal | **P0** | 👤 personenbezogen | A.8.6 | Owner | **Single-Point-of-Failure** | Break-Glass-Verfahren, Delegation |
| P-002 | NeXify CEO Agent | Admin-Agent | Pascal | P0 | — | A.8.6 | Agents | Shadow-AI | Scope-Definition, Logging |
| P-003 | Hermes automation-agent | Admin-Agent | Pascal | P0 | — | A.8.6 | Agents | Shadow-AI | Scope-Definition |
| P-004 | NeXify QA Agent | Reviewer | Pascal | P1 | — | A.8.6 | Agents | Fehlkonfiguration | |
| P-005 | Systemmaster (Claude Code) | Gesamtkonzept | Pascal | P0 | — | A.8.6 | Agents | Shadow-AI | Promptrestriktionen |
| P-006 | Alle Hermes-Agenten | Ausführende Agenten | Pascal | P1 | — | A.8.6 | Agents | Shadow-AI | Scope, Rate-Limit, Kill-Switch |
| P-007 | Bookando (Kunde) | Kunde | Pascal | P1 | 👤 personenbezogen | A.8.6, DSGVO | Pascal | Datenabfluss | Tenant-Trennung |
| P-008 | Studienkolleg Aachen (Kunde) | Kunde | Pascal | P1 | 👤 personenbezogen | A.8.6, DSGVO | Pascal | Datenabfluss | Tenant-Trennung |
| P-009 | Cloudflare (Provider) | Externer Dienstleister | Pascal | P1 | — | A.8.6, AVV | Pascal | Vendor-Lock-in | AVV erforderlich |
| P-010 | Vercel (Provider) | Externer Dienstleister | Pascal | P1 | — | A.8.6, AVV | Pascal | Vendor-Lock-in | |
| P-011 | GitHub (Provider) | Externer Dienstleister | Pascal | P1 | — | A.8.6, AVV | Pascal | Vendor-Lock-in | |
| P-012 | DeepSeek / nscale (Provider) | LLM-Provider | Pascal | P1 | — | A.8.6, AVV | Pascal | Vendor-Lock-in | Fallback-Provider |
| P-013 | Supabase (Provider) | Externer Dienstleister | Pascal | P2 | — | A.8.6, AVV | Pascal | Vendor-Lock-in | |
| P-014 | Resend (Provider) | Externer Dienstleister | Pascal | P2 | — | A.8.6, AVV | Pascal | Vendor-Lock-in | |

---

## 5. Klassifikations-Statistik

| Klasse | P0 | P1 | P2 | P3 | Gesamt |
|--------|----|----|----|----|--------|
| Information/Daten (I) | 6 | 6 | 4 | 0 | 16 |
| Software (S) | 10 | 11 | 2 | 0 | 23 |
| Hardware (H) | 1 | 0 | 2 | 0 | 3 |
| Dienstleistung (D) | 7 | 2 | 1 | 0 | 10 |
| Personen (P) | 5 | 6 | 3 | 0 | 14 |
| **Gesamt** | **29** | **25** | **12** | **0** | **66** |

---

## 6. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-23 | Systemmaster | Initiales vollständiges Asset-Inventar (66 Assets) |

---

*Erstellt gemäß ISO 27001 A.8 (Asset Management). Nächste Prüfung: 2026-07-23.*
