# NeXify AI by NeXify — chat it. Automate it.

Autonome, agentengestützte AI-Agentur- und Operations-Plattform.

## Repository-Struktur

```
nexify/      → Zentrales Governance-, Wissens- und Orchestrierungsrepository
other/       → Ergänzende Workspace-Dokumente
```

## Standards

- **ISO 27001 / 42001 / 27701 / 23894** — Sicherheit, KI, Datenschutz, Risiko
- **EU AI Act / DSGVO** — Regulatorisch
- **DIN 5008** — Schriftverkehr
- **WCAG 2.2** — Barrierefreiheit
- **OWASP Top 10 for LLM & Agentic AI** — Security

## Infrastruktur

- VPS: 72.62.152.47, 42 Docker-Container
- LLM: 9Router (22 Modelle), Ollama, Cloudflare Workers AI
- Wissen: Brain, Agentmemory, Qdrant, RAGFlow
- Agent: Hermes WebUI + MCP (6 Server, 26 Tools)
- Cloudflare: Free Tier (~$275/Monat gespart), 16 Ingress, mcp.nexifyai.cloud
- CI: Graphite / Premium Dark Operator Shell

## Prinzipien

- Docs-first: Jede Änderung dokumentiert, bevor sie deployed wird
- Evidence vor Abschluss: Kein Done ohne Nachweis
- OSS vor SaaS, vorhandene Infra vor neuen Diensten
- Mandantentrennung: NeXify-intern / Kundenprojekte / Infrastruktur
