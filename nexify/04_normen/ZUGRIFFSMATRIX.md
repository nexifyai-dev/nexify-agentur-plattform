# ZUGRIFFSMATRIX — NeXify AI

**Stand:** 2026-06-23 | **Version:** 1.0.0 | **Owner:** CISO / Systemmaster  
**Klassifikation:** intern, vertraulich | **Normbezug:** ISO 27001 A.9 (Zugriffssteuerung), ISO 27001 A.8 (Asset Management)  
**Nächste Prüfung:** 2026-07-23

## ⛔ HARTE VERBOTE P0 — Verstoß = sofortige Eskalation

| # | Verbot | Norm |
|---|--------|------|
| V-01 | **Kein Secret in Git, Logs, Prompts, Brain oder RAG.** Secrets gehören nur in ~/.hermes/config.yaml (mode 600) oder env-Variablen. Secrets in Logs/Brain/Prompts = sofortige Löschpflicht + Eskalation an CISO. | ISO 27001 A.10 |
| V-02 | **Keine Kundendaten in nicht freigegebene AI-Modelle.** 9Router-Whitelist prüfen (freigegeben: DeepSeek, nscale, Qwen3). OpenAI, Claude, Gemini = grundsätzlich gesperrt für Kundendaten. | ISO 27701 A.2, ISO 42001 A.2 |
| V-03 | **Keine Production-Schreibrechte für Agenten ohne Scope, Logging, Rate Limit, Kill Switch und Human Approval.** Jeder Produktions-Agent braucht: Aufgaben-Scope, Aktion-Log, Ratelimit-Check, Kill-Switch-Befehl, HITL-Gate für kritische Aktionen. | ISO 42001 A.4, OWASP ASI02/ASI03 |
| V-04 | **Keine Vermischung von NeXify-internen Daten und Kundenprojekten.** Jeder Kunde = eigener Workspace im tenant-isolierten Ordner. Shared Infrastructure = eigener Space. Cross-Tenant-Zugriff nur mit dokumentierter Freigabe. | ISO 27001 A.13 |
| V-05 | **Keine Admin-/Owner-Rechte ohne dokumentierten Zweck.** Jedes Admin-Recht braucht: Zweck, Laufzeit, dokumentierte Freigabe durch Pascal. Jährlicher Review. Brachliegende Admin-Accounts sofort entziehen. | ISO 27001 A.9 |
| V-06 | **Keine neuen SaaS-/Cloud-Tools ohne Normen-Check und AVV.** Jedes neue Tool braucht: Normen-Check (DSGVO, ISO 27001, ISO 42001), Risikobewertung, AVV-Abschluss vor Inbetriebnahme. Kein Shadow-IT. | DSGVO Art. 28, ISO 27001 A.15 |

---

## 1. Rollen (ISO 27001 A.9.1)

| Rolle | Beschreibung | ISO-Bezug |
|-------|-------------|-----------|
| **Owner** | Pascal Courbois — Inhaber, volle Rechte | A.9.2.1 |
| **Admin** | Pascal, NeXify CEO Agent, Hermes automation-agent — Betriebsverantwortung | A.9.2.2 |
| **Developer** | NeXify AI Agents — Entwicklung & Ausführung | A.9.2.3 |
| **Agent** | Alle Hermes-Agenten — eingeschränkte Ausführung | A.9.2.4 |
| **Reviewer** | NeXify QA Agent — Prüfung & Freigabe | A.9.2.5 |
| **Kunde** | bookando, studienkolleg-aachen — nur eigene Daten | A.9.2.6 |
| **Externer Provider** | Cloudflare, Vercel, GitHub, Hetzner, DeepSeek, nscale, Supabase, Resend — definierte Schnittstelle | A.9.2.7 |

## 2. Zugriffsrechte-Stufen

| Stufe | Bedeutung |
|-------|-----------|
| ✅ Lesen | Daten einsehen |
| ✅ Schreiben | Daten erstellen/bearbeiten |
| ✅ Deploy | Deployment ausführen |
| ✅ Löschen | Daten unwiderruflich entfernen |
| ✅ Export | Daten aus dem System exportieren |
| 🟡 Bedingt | Mit Einschränkungen (Scope, Logging, Rate-Limit, Human Approval) |
| ❌ Verboten | Kein Zugriff |
| — | Nicht zutreffend |

---

## 3. Access-Matrix

| Asset | Owner (Pascal) | Admin (CEO, automation) | Developer (Agents) | Agent (alle Hermes) | Reviewer (QA) | Kunde (bookando, stuka) | Externer Provider |
|-------|:--------------:|:-----------------------:|:------------------:|:-------------------:|:-------------:|:-----------------------:|:-----------------:|
| **I-001 Brain (SQLite)** | ✅ Alle | ✅ Alle | 🟡 Lesen | 🟡 Lesen | ✅ Lesen | ❌ | ❌ |
| **I-002 agentmemory (SQLite)** | ✅ Alle | 🟡 Lesen+Schreiben | 🟡 Lesen+Schreiben | 🟡 Lesen | ❌ | ❌ | ❌ |
| **I-003 Qdrant (Vektordb)** | ✅ Alle | ✅ Alle | 🟡 Lesen (via Brain-API) | 🟡 Lesen (via Brain-API) | ✅ Lesen | ❌ | ❌ |
| **I-004 9Router db.json** | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **I-005 Secrets** | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **I-006 Kundendaten bookando** | ✅ Alle | 🟡 Bedingt (Scope) | 🟡 Bedingt (Scope) | ❌ | ❌ | ✅ Nur eigene | ❌ |
| **I-007 Kundendaten stuka** | ✅ Alle | 🟡 Bedingt (Scope) | 🟡 Bedingt (Scope) | ❌ | ❌ | ✅ Nur eigene | ❌ |
| **I-008 Governance-Dokumente** | ✅ Alle | ✅ Lesen | ✅ Lesen | ✅ Lesen | ✅ Lesen | ❌ | ❌ |
| **I-009 Arbeitsdaten (/workspace/)** | ✅ Alle | ✅ Alle | 🟡 Bedingt (Scope) | 🟡 Bedingt (Scope) | ✅ Lesen | ❌ | ❌ |
| **I-010 System-Logs** | ✅ Alle | ✅ Lesen | ❌ | ❌ | ❌ | ❌ | ❌ |
| **I-011 Agenten-Outputs** | ✅ Alle | ✅ Alle | 🟡 Schreiben (eigene) | 🟡 Schreiben (eigene) | ✅ Lesen | ❌ | ❌ |
| **I-012 Prompts (Seelen)** | ✅ Alle | 🟡 Nur Promptmaster | ❌ | ❌ | ❌ | ❌ | ❌ |
| **I-013 Hermes Profile** | ✅ Alle | ✅ Lesen | ❌ | ❌ | ❌ | ❌ | ❌ |
| **I-014 Angebote/AVV/TOM** | ✅ Alle | 🟡 Bedingt | ❌ | ❌ | ❌ | ✅ Nur eigene AVV | ❌ |
| **I-015 E-Mails** | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **S-001 9Router** | ✅ Alle | 🟡 Lesen+Schreiben (bedingt) | 🟡 Lesen (via API) | 🟡 Lesen (via API) | ❌ | ❌ | ❌ |
| **S-002 Brain API** | ✅ Alle | ✅ Alle | 🟡 Query (Schreiben bedingt) | 🟡 Query (Schreiben bedingt) | ✅ Query | ❌ | ❌ |
| **S-003 agentmemory-Service** | ✅ Alle | ✅ Alle | 🟡 Bedingt | 🟡 Bedingt | ❌ | ❌ | ❌ |
| **S-004 Qdrant** | ✅ Alle | ✅ Alle | ❌ (nur via Brain) | ❌ (nur via Brain) | ❌ | ❌ | ❌ |
| **S-005 RAGFlow** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |
| **S-006 Hermes WebUI** | ✅ Alle | ✅ Alle | ✅ Nutzung | ✅ Nutzung | ❌ | ❌ | ❌ |
| **S-007 Cloudflare Tunnel** | ✅ Alle | 🟡 Lesen | ❌ | ❌ | ❌ | ❌ | ✅ Definierter Service |
| **S-008 Vercel Deployments** | ✅ Alle | ✅ Alle | 🟡 Deploy (bedingt) | ❌ | ✅ Review vor Deploy | ❌ | ✅ Plattform-Betrieb |
| **S-009 Supabase** | ✅ Alle | ✅ Alle | 🟡 Bedingt | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **S-010 Resend** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **S-011 Hermes-Agenten** | ✅ Alle | ✅ Konfiguration | ✅ Nutzung (eigener Agent) | ✅ Nutzung (eigener Agent) | ❌ | ❌ | ❌ |
| **S-012 MCP-Server** | ✅ Alle | ✅ Alle | 🟡 Bedingt (Permission-Matrix) | 🟡 Bedingt (Permission-Matrix) | ❌ | ❌ | ❌ |
| **S-013 Cron-Jobs** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |
| **S-014 nexifyai-platform (GitHub)** | ✅ Alle | ✅ Alle | 🟡 Schreiben (Branch) | ❌ | ✅ Review | ❌ | ✅ Plattform-Betrieb |
| **S-015 bookando-repos** | ✅ Alle | 🟡 Bedingt | 🟡 Bedingt | ❌ | ✅ Review | ✅ Nur eigenes | ✅ Plattform-Betrieb |
| **S-016 9router (GitHub)** | ✅ Alle | ✅ Lesen | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **S-017 Coolify** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **S-018 Docker** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |
| **S-019 GitHub Actions** | ✅ Alle | ✅ Alle | 🟡 Bedingt (CI-Logs) | ❌ | ✅ Review | ❌ | ✅ Plattform-Betrieb |
| **H-001 VPS (Root-Server)** | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Hosting-Betrieb |
| **H-002 NAS** | ✅ Alle | 🟡 Bedingt | ❌ | ❌ | ❌ | ❌ | ❌ |
| **D-001 Hostinger** | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **D-002 Cloudflare** | ✅ Alle | 🟡 Bedingt (DNS/Tunnel) | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **D-003 Vercel** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **D-004 GitHub** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **D-005 DeepSeek/nscale** | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ API-Provider |
| **D-006 Supabase Cloud** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **D-007 Resend** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **D-009 Docker Hub** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ✅ Plattform-Betrieb |
| **P-002 NeXify CEO Agent** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |
| **P-003 automation-agent** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |
| **P-004 QA Agent** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |
| **P-005 Systemmaster** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |
| **P-006 Hermes-Agenten** | ✅ Alle | ✅ Alle | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 4. Bedingungs-Definitionen (🟡)

| Kürzel | Bedingung | Beschreibung |
|--------|-----------|-------------|
| Scope | Scope-Definition | Zugriff nur auf explizit zugewiesene Ressourcen/Projekte |
| Logging | Volles Audit-Logging | Jeder Zugriff wird protokolliert und ist nachvollziehbar |
| Rate-Limit | Ratenbegrenzung | Max N Requests/Minute, Threshold-Überschreitung blockiert |
| Kill-Switch | Not-Aus | Zugriff kann durch Admin/Owner jederzeit unterbrochen werden |
| Human Approval | Menschliche Freigabe | Kritische Aktionen benötigen explizite Freigabe durch Pascal |
| Permission-Matrix | Definierte Tool-Berechtigungen | Nur explizit freigegebene Tools/Aktionen |
| Promptmaster | Prompt-Restriktion | Nur Promptmaster ändert Production-Prompts |
| CI/CD | CI/CD-Pipeline | Deployment nur via Pipeline, nie direkt |
| Tenant-Trennung | Kundenisolation | Keine Vermischung NeXify-intern/Kundenprojekte |

---

## 5. Harte Verbote — ISO 27001 A.9.3 (Nichtabstreitbarkeit / Verbindlichkeit)

> Die folgenden Verbote sind **nicht verhandelbar** und gelten für alle Rollen, Agenten und Systeme.

### ❌ Verbot 1: Kein Secret in Git, Logs, Prompts, Brain oder RAG
API-Keys, Tokens, Passwörter und andere Secrets dürfen **niemals** in:
- Git-Repositories (Commit-History, Branches, Issues)
- System-Logs (/var/log/, Docker-Logs)
- Agenten-Prompts oder Agentenseelen
- Brain-API-Einträge
- RAGFlow-Dokumente
- Evidence-Dateien
- Chat-Verläufe oder Agenten-Outputs

**Maßnahme:** Gitleaks in CI/CD, Secret-Scanner in Logs, regelmäßige Audits.  
**Verstoß:** P0-Sicherheitsvorfall — sofortige Eskalation an Pascal.

### ❌ Verbot 2: Keine Kundendaten in nicht freigegebene AI-Modelle
Personenbezogene oder vertraglich geschützte Kundendaten (bookando, studienkolleg-aachen) dürfen **niemals** in:
- Nicht-freigegebene externe LLM-APIs ohne AVV
- Öffentliche Trainingsdaten
- Shadow-AI ohne dokumentierten Zweck
- Freigegebene Prompts oder RAG-Datasets ohne Kundenfreigabe

**Maßnahme:** Tenant-Trennung, Kunden-Scope für Agenten, AVV-Nachweis vor Datenweitergabe.  
**Verstoß:** DSGVO-Verstoß — sofortige Eskalation an Pascal.

### ❌ Verbot 3: Keine Production-Schreibrechte für Agenten ohne Scope, Logging, Rate Limit, Kill Switch, Human Approval
Jeder Agent mit Production-Schreibzugriff MUSS folgende Schutzmechanismen haben:
- **Scope-Definition:** Explizit, dokumentiert, was der Agent darf und was nicht
- **Audit-Logging:** Jede Schreibaktion protokolliert
- **Rate-Limit:** Max N Aktionen/Zeiteinheit
- **Kill-Switch:** Admin/Owner kann Agent jederzeit stoppen
- **Human-Approval-Gate:** Für kritische Aktionen (Löschen, Deploy, Secret-Zugriff)

**Maßnahme:** Permission-Matrix pro Agent, Policy-Gate vor jeder riskanten Aktion.  
**Verstoß:** P0-Governance-Verstoß — Agent sofort deaktivieren.

### ❌ Verbot 4: Keine Vermischung NeXify-intern / Kundenprojekte
NeXify-interne Daten (Secrets, Infrastruktur, Prompts, Brain) und Kundenprojektdaten (bookando, studienkolleg-aachen) MÜSSEN strikt getrennt bleiben:
- Separate Repositories
- Separate Agenten-Profile oder strikte Scopes
- Separate Datenbanken/Collections oder dokumentierte Tenant-Trennung
- Kein gemeinsamer Prompt/Context zwischen intern und Kunde
- Keine Kunden-Secrets in NeXify-Secret-Management

**Maßnahme:** Tenant-Trennung dokumentieren, Separation in CI/CD prüfen.  
**Verstoß:** P0-Compliance-Verstoß — sofortige Isolation.

### ❌ Verbot 5: Keine Admin/Owner-Rechte ohne dokumentierten Zweck
Jeder Account, Agent oder Dienst mit Admin- oder Owner-Rechten MUSS:
- Einen dokumentierten, aktuellen Zweck haben
- In dieser Zugriffsmatrix gelistet sein
- Regelmäßig auf Notwendigkeit geprüft werden (quartalsweise)
- Bei Zweckentfall sofort entzogen werden

**Maßnahme:** Jährliches Access-Review, Dokumentation in dieser Matrix.  
**Verstoß:** P1-Compliance-Verstoß — Rechte sofort entziehen.

### ❌ Verbot 6: Keine neuen SaaS/Cloud-Tools ohne Normen-Check und AVV
Bevor ein neues SaaS-, Cloud- oder externes Tool eingesetzt wird, MUSS:
1. **Normen-Check:** Prüfung auf ISO 27001-Konformität des Anbieters
2. **AVV-Abschluss:** Auftragsverarbeitungsvertrag gemäß DSGVO Art. 28
3. **Dokumentation:** Eintrag in dieser Zugriffsmatrix
4. **Security-Review:** Prüfung auf Datenklasse und Risiko

**Maßnahme:** Aufnahme in Asset-Inventar und diese Matrix vor Inbetriebnahme.  
**Verstoß:** P0-Compliance-Verstoß — Tool sofort deaktivieren.

---

## 6. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-23 | Systemmaster | Initiale vollständige Zugriffsmatrix mit 6 harten Verboten |

---

*Erstellt gemäß ISO 27001 A.9 (Zugriffskontrolle). Nächste Prüfung: 2026-07-23.*
