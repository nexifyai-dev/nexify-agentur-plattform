# NeXify AI — Scope-Profil

## Organisation
- **Name:** NeXify AI by NeXify — chat it. Automate it.  
- **Sitz:** Pascal Courbois, Deutschland
- **Tätigkeit:** AI-/Automatisierungsagentur, autonome Agentensysteme, SaaS-Plattform, Agentur-Betriebssystem
- **Kunden:** B2B, D/A/CH, Niederlande, Fokus auf KMU bis Mittelstand

## Services & Produkte
- Autonome AI-Agenten (Recherche, Content, Analyse, Entwicklung, Betrieb)
- AI-Agentur-Betriebssystem (Hermes Agent, 9Router, Brain, Qdrant, Agentmemory)
- SaaS-Plattform work.nexifyai.cloud (WebUI, Kanban, Aufgaben, Profile, Skills, Memory, Monitoring)
- Chat-/Konversations-KI über Telegram, Discord, Slack, WhatsApp (geplant)
- AI-Infrastruktur-Betrieb (Cloudflare, VPS, Docker, 9Router, MCP-Server)

## Systeme (Stand 23.06.2026)
| System | Standort | Tenant | Datenart |
|--------|----------|--------|----------|
| Hermes Agent | VPS + Workspace | NeXify intern | Agenten-Logs, Konversationen, Konfiguration |
| Brain API | brain.nexifyai.cloud | NeXify intern | Projektdokumentation, Architekturentscheidungen, Regeln |
| Qdrant (4 Collections) | localhost:6333 | NeXify intern | Vektorspeicher (8785+ Vektoren) |
| Agentmemory | localhost:40000 | NeXify intern | Operatives Agentengedächtnis |
| 9Router (22 Modelle) | ai-router.nexifyai.cloud | NeXify intern | LLM-Routing, Modellauswahl |
| RAGFlow | rag.nexifyai.cloud | NeXify intern | Dokumenten-RAG, 5 Datasets, 1 Chat, 1 Agent |
| Cloudflare Tunnel | 31 DNS, 60 AI Models | NeXify intern | Ingress, DDoS, WAF |
| VPS 72.62.152.47 | Hetzner (DE) | NeXify intern | 42 Container, Docker, systemd |
| GitHub | nexifyai-dev | NeXify intern | Repos, CI/CD, Secrets |
| Supabase | (aktiv) | NeXify intern | Auth, DB |
| Vercel | (aktiv) | NeXify intern | Frontend-Deployment |
| Resend | (aktiv) | NeXify intern | E-Mail-Versand |

## Kundenprojekte
| Projekt | Systeme | Datenart | Standort |
|---------|---------|----------|----------|
| Bookando (fixdigital) | API, Frontend | Produktdaten, Kundendaten | /workspace/customers/fixdigital/ |
| Studienkolleg Aachen | (direkt) | Bildungsdaten | /workspace/studienkolleg-aachen/ |

## Datenarten
- NeXify-intern: Systemkonfiguration, Agenten-Prompts, Betriebsdaten, Logs, Metriken
- Kundenprojekt: Kundendaten (je nach Projekt), keine PII ohne AVV
- Kunden-Betrieb: Logs, Nutzungsdaten (anonymisiert möglich)
- LLM-Traffic: Prompts, Responses (via 9Router geroutet, kein Training)

## Rollen (DSGVO/EU AI Act)
- **Verantwortlicher:** Pascal Courbois / NeXify
- **Auftragsverarbeiter:** Cloudflare, Vercel, GitHub, Hetzner, Supabase, Resend
- **Unterauftragsverarbeiter:** DeepSeek, nscale (LLM-Provider via 9Router)
- **AI-Deployer:** NeXify (eigene Agenten und Systeme)
- **AI-Provider:** DeepSeek, OpenRouter, nscale (via 9Router geroutet)

## Relevante Regulierung (vorläufig)
- DSGVO (Verantwortlicher + AV)
- EU AI Act (AI-Deployer + ggf. AI-Provider bei Eigenmodellen)
- BDSG (deutsches Datenschutzrecht)
- NIS-2 (bei Kritikalität)
- CRA (Cyber Resilience Act, bei Software-Produkten)
- TTDSG (Telekommunikation)
- GoBD (Buchhaltungsprozesse falls finanziell)
- BSI IT-Grundschutz (freiwillig, aber empfohlen)
