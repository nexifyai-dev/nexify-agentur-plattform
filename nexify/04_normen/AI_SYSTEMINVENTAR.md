# AI-SYSTEMINVENTAR — NeXify AI

**Stand:** 2026-06-23 | **Version:** 1.0.0 | **Owner:** CTO / CISO
**Klassifikation:** vertraulich | **Normbezug:** ISO/IEC 42001 A.2, ISO/IEC 23894, EU AI Act Art. 6
**Nächste Prüfung:** 2026-07-23

---

## 1. AI-Systeme bei NeXify

| # | System | Typ | Zweck | Modell(e) | Daten | Betreiber | Agenten-Rolle |
|---|--------|-----|-------|-----------|-------|-----------|---------------|
| 1 | **9Router** | LLM-Routing-Gateway | Routing aller LLM-Requests zu 22 Modellen | Alle über Gateway | Prompts, Outputs, Metriken | Pascal / Docker | Infrastruktur |
| 2 | **Brain** | Knowledge Store (RAG) | Speicherung + Retrieval von Systemwissen (2421 Einträge) | Qwen3-Embedding via nscale | Entscheidungen, Architektur, Lessons Learned | Pascal / Docker | Gedächtnis |
| 3 | **Qdrant** | Vektordatenbank | 4 Collections: brain (2421), memories (~150), projects, rules | — | Vektoren + Payloads | Pascal / Docker | Gedächtnis |
| 4 | **RAGFlow** | Dokument-RAG | 5 Datasets + 2 Memories, Chat/Search/Agent, 26 Tools | Qwen3-Embedding via nscale | PDFs, Docs, Governance, Kundenprojekte | Pascal / Docker | Dokumentenverständnis |
| 5 | **Hermes WebUI** | Chat-Interface | Browser-basierter Agenten-Client | — via 9Router | Prompts, Outputs, Session-DB | Pascal / Browser | Nutzer-Interface |
| 6 | **Hermes CEO Agent** | Executive AI Agent | Orchestrierung, Delegation, Governance, Freigaben | combo-llm via 9Router | Systemprompts, Entscheidungen, Arbeitspakete | Pascal / Hermes | CEO |
| 7 | **Hermes CTO Agent** | Technical AI Agent | Architektur, Debugging, Deployment | — via 9Router | Code, Configs, System-Outputs | Pascal / Hermes | CTO |
| 8 | **Hermes CISO Agent** | Security AI Agent | Sicherheitsprüfung, Controls, Audit | — via 9Router | Logs, Configs, Reports | Pascal / Hermes | CISO |
| 9 | **Hermes Expert-Dev** | Engineering AI Agent | Code-Entwicklung, Tests, Repos | — via 9Router | Code, Tests, Git-Outputs | Pascal / Hermes | Developer |
| 10 | **Hermes Automation Agent** | Cron/Scheduling AI Agent | Zeitgesteuerte Aufgaben, Compliance-Checks | — via 9Router | Cron-Outputs, Reports | Pascal / Hermes | Automatisierung |
| 11 | **Cloudflare Workers AI** | Edge AI Inference | 60+ Modelle (DeepSeek R1, Llama 3.2, Kimi K2.7, BGE-M3) | 60+ Open-Source-Modelle | Prompts, Outputs | Cloudflare | Fallback-Inferenz |
| 12 | **Unified MCP Server** | MCP-Gateway (SSE, Port 9200) | 9 Tools: Brain, Qdrant, agentmemory, RAGFlow, Tavily | — | Systemdaten, Metriken | Pascal / systemd | Agenten-Tooling |
| 13 | **6 MCP Server** | Agenten-Tool-Server | 26 Tools: Brain, Qdrant, agentmemory, RAGFlow, Tavily, CF | — | Systemdaten, Suchanfragen | Pascal / systemd | Agenten-Tooling |
| 14 | **Headroom** | Docker Sidecar | System-Monitoring, Ressourcen-Tracking | — | Metriken | Pascal / Docker | Monitoring |
| 15 | **Agentmemory** | Operatives Agentengedächtnis | 26 Einträge: Lessons Learned, Systemzustand | — | Operative Notizen, Fehler | Pascal / Docker | Kurzzeitgedächtnis |

## 2. EU AI Act Risikoklassifizierung

| # | System | Rolle | Risikoklasse | Begründung |
|---|--------|-------|-------------|-----------|
| 1 | 9Router | Bereitsteller | **Minimal** | Reines Routing, keine autonomen Entscheidungen |
| 2 | Brain | Betreiber | **Minimal** | RAG-Speicher/Retrieval, keine autonome Entscheidung |
| 3 | Qdrant | Betreiber | **Minimal** | Reine Vektordatenbank, keine Inferenz |
| 4 | RAGFlow | Betreiber | **Minimal** | Dokument-RAG, keine autonome Aktion |
| 5 | Hermes WebUI | Bereitsteller | **Minimal** | Chat-Interface, keine autonome Aktion |
| 6 | CEO Agent (Hermes) | Betreiber | **Minimal** | Orchestrierung ohne Kundenkontakt |
| 7 | CTO Agent | Betreiber | **Minimal** | Technische Analyse, kein Kundeneinsatz |
| 8 | CISO Agent | Betreiber | **Minimal** | Interne Sicherheitsprüfung |
| 9 | Expert-Dev Agent | Betreiber | **Minimal** | Code-Erstellung unter Aufsicht |
| 10 | Automation Agent | Betreiber | **Minimal** | Zeitgesteuerte Skripte, keine autonome Entscheidung |
| 11 | Cloudflare Workers AI | Bereitsteller (CF) | **Minimal** (CF) | Bekannte Open-Source-Modelle |
| 12 | Unified MCP | Betreiber | **Minimal** | Technisches Gateway |
| 13 | MCP Server | Betreiber | **Minimal** | Technische Tools |
| 14 | Headroom | Betreiber | **Minimal** | System-Monitoring |
| 15 | Agentmemory | Betreiber | **Minimal** | Operativer Speicher |

**Alle NeXify-AI-Systeme = Risikoklasse MINIMAL.** Kein Hochrisiko nach EU AI Act Annex III (keine biometrische ID, kritische Infrastruktur, Bildungszugang, Beschäftigung, Kreditwürdigkeit, Strafverfolgung, Migration, Rechtsauslegung). Prüfpflicht bei neuen Systemen/Use Cases.

## 3. Controls pro AI-System (ISO/IEC 42001 A.3 + OWASP)

| # | System | 42001 | 23894 | OWASP LLM | OWASP Agentic | Status |
|---|--------|-------|-------|-----------|---------------|--------|
| 1 | 9Router | AI-01, AI-02, AI-07 | Bias, Poisoning | LLM06 | ASI02 | ✅ Baseline |
| 2 | Brain | AI-01, AI-04, AI-06 | Datenvergiftung, Leakage | LLM03 | — | ✅ Baseline |
| 3 | Qdrant | AI-01, AI-06 | Zugriffskontrolle, Injection | LLM03 | — | ✅ Baseline |
| 4 | RAGFlow | AI-01, AI-04, AI-06 | Document-Poisoning, Injection | LLM03, LLM06 | — | ✅ Baseline |
| 5 | Hermes WebUI | AI-01, AI-02, AI-07 | Input-Injection, Session-Hijack | LLM01 | — | ✅ Baseline |
| 6 | CEO Agent | AI-01 bis AI-09 | Goal Hijack, Tool Misuse, Privilege | LLM01, LLM02, LLM06 | ASI01-05 | ⚠️ Enhanced |
| 7 | CTO Agent | AI-01, AI-02, AI-04 | Tool Misuse, Escalation | LLM01, LLM06 | ASI02-03 | ✅ Baseline |
| 8 | CISO Agent | AI-01, AI-05, AI-06 | Log Poisoning | LLM02 | — | ✅ Baseline |
| 9 | Expert-Dev | AI-02, AI-04, AI-07 | Code-Leakage, Git-Injection | LLM01, LLM06 | ASI02 | ✅ Baseline |
| 10 | Automation Agent | AI-01, AI-05, AI-07 | Cron-Injection, Escalation | LLM01, LLM06 | ASI02, ASI04 | ✅ Baseline |
| 11 | CF Workers AI | AI-01, AI-02 | Modell-Leakage | LLM06 | — | ✅ CF-verantwortet |
| 12 | Unified MCP | AI-01, AI-06, AI-07 | Tool-Access, SSE-Injection | LLM01 | ASI02, ASI03 | ✅ Baseline |
| 13 | MCP Server | AI-01, AI-06 | Datenabfluss via Tools | LLM06 | ASI02 | ✅ Baseline |
| 14 | Headroom | AI-01 | Keine AI-Risiken | — | — | ✅ N/A |
| 15 | Agentmemory | AI-01, AI-05 | Memory-Poisoning | LLM03 | — | ✅ Baseline |

## 4. Offene Sicherheitslücken (P0-P2)

| # | System | Lücke | Prio | Maßnahme | Owner |
|---|--------|-------|------|----------|-------|
| 1 | CEO Agent | ASI01: Goal Hijack — kein System-Prompt-Integritätscheck | **P0** | System-Prompt-Signing + Output-Validierung | CTO |
| 2 | CEO Agent | ASI03: Privilege Abuse — Alle Skills/Profiles ohne Rate Limit | **P0** | Tool-Rechte-Matrix + Ratelimit + Kill-Switch | CISO |
| 3 | Alle Hermes | LLM01: Prompt Injection — kein Input-Filter | **P0** | Input-Sanitizer + Injection-Detection in 9Router | CTO |
| 4 | MCP Server | ASI02: Tool Misuse — Tools ohne Aktivitäts-Log | **P1** | MCP-Call-Logging + Session-Context-Prüfung | CISO |
| 5 | RAGFlow+Brain | LLM03: Training Data Poisoning — ungeprüfte Uploads | **P1** | Upload-Scanner + Vertrauenswürdigkeitscheck | CTO |
| 6 | 9Router | LLM06: Sensitive Info Leakage — kein Output-Filter | **P1** | Output-Scanner für PII/Secrets | CISO |
| 7 | Automation Agent | ASI04: Supply Chain — Cron-Skripte ohne Hash-Prüfung | **P2** | SHA256-Check aller Cron-Skripte | CTO |
| 8 | Alle Agenten | Fehlendes zentrales AI-Aktionslog (EU AI Act Art. 12) | **P2** | Zentrales AI-Aktionslog aufbauen | CTO |

## 5. P0-Maßnahmen

| # | Maßnahme | System | Deadline | Evidence |
|---|----------|--------|----------|----------|
| A | System-Prompt-Integritätscheck (Signing) | CEO Agent | 7 Tage | Implementierung + Test |
| B | Tool-Rechte-Matrix + Ratelimit je Agent | Alle Hermes | 14 Tage | Zugriffsmatrix-Update |
| C | Input-Sanitizer + Injection-Detection in 9Router | 9Router | 14 Tage | 9Router-Update + Pen-Test |
| D | Output-Scanner für PII/Secrets | 9Router | 30 Tage | Scanner + Test |
| E | Upload-Scanner für Dokumente | RAGFlow+Brain | 30 Tage | Test + Log |
| F | Zentrales AI-Aktionslog | Alle | 30 Tage | Log-Schema + Dashboard |

## 6. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-23 | 1.0.0 | Ersterfassung — 15 Systeme, EU AI Act, Controls, Lücken | CTO / Systemmaster |
