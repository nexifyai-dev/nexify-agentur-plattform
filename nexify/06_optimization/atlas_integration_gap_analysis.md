# Hermes Atlas — NeXify AI Integration & Skill Gap Analysis

**Erstellt:** 2026-06-24  
**Quelle:** https://hermesatlas.com (95+ Repos, 12 Kategorien)  
**Stand:** Hermes Atlas community map, live GitHub data

## Ziel

Hermes Atlas als kanonischen Index des Hermes-Ökosystems in NeXify AI integrieren. Skills, Memory-Provider, Multi-Agent-Frameworks und Security-Filter aus Atlas in NeXify-Katalog übernehmen.

## Atlas-Kategorien vs NeXify-Abdeckung

| Atlas-Kategorie | Repos | NeXify hat | Fehlt | Priorität |
|----------------|-------|-----------|-------|-----------|
| Memory Providers | \~12 | 0 | 12 | **P0** |
| Context Engines | \~4 | 0 | 4 | P1 |
| Multi-Agent Frameworks | \~5 | 0 | 5 | **P0** |
| Plugins (Skills) | \~200 | 88 | 112 | P2 |
| Workspaces | \~6 | 0 | 6 | P1 |
| Deployment | \~8 | 1 | 7 | P2 |
| DevTools | \~10 | 1 | 9 | P3 |

## Top-Gaps (P0 für NeXify)

### 1. Memory: Mnemonic / Mnemosyne / GBBrain
- **Problem:** Brain-Token unbekannt → write tot. Wir brauchen lokale Memory-Alternative.
- **Atlas-Lösung:** Mnemosyne = SQLite + lokales Embedding + kleiner LLM. Kein externer Service.
- **Aktion:** `mnemonic-ai` oder `gbbrain` als zusätzlichen Memory-Provider evaluieren.

### 2. Context: Agent-Soul-Compiler
- **Problem:** 38 Regelwerke, 40 Normen, 14 Recovery-Docs — alles manuell. Kein Compiler.
- **Atlas-Lösung:** Compilert JSON-Files zu System-Prompts.
- **Aktion:** Agenten-Seele(n) strukturiert ablegen → compilern lassen → in Hermes laden.

### 3. Multi-Agent: Open-Coordination-Protocol + OpenClaw
- **Problem:** NeXify Dispatcher/Kanban ist Eigenbau. Kein Framework.
- **Atlas-Lösung:** Multi-Agent-Orchestrierung + cowork-App für mehrere CLI-Agents.
- **Aktion:** OpenClaw evaluieren als Alternative/Sidecar zum NeXify Dispatcher.

### 4. Workspace: Hermes Studio
- **Problem:** WebUI hat UI-Bugs (Aufgaben 500, Kanban leer).
- **Atlas-Lösung:** Lightweight Canvas-basierte Web-UI.
- **Aktion:** Test-Instance deployen → gegen WebUI evaluieren.

### 5. Deployment: Helm Chart + Ansible
- **Problem:** Manuelle Configs, kein Infra-as-Code für Hermes.
- **Atlas-Lösung:** Helm Chart für Hermes + Ansible Playbook.
- **Aktion:** Für VPS-Recovery automatisieren.

## Mapping: NeXify-Komponenten → Atlas-Kategorien

| NeXify-Komponente | Atlas-Kategorie | Atlas-Äquivalent | Status |
|------------------|----------------|-----------------|--------|
| Brain | Memory/Knowledge | GBBrain, Mnemonic | 🔴 Fehlt |
| Agentmemory | Memory Provider | (none exact) | 🟡 Eigenbau |
| Qdrant | Memory Provider | (none exact) | 🟡 Eigenbau |
| RAGFlow | Plugins/Data | MCP-RAGFlow | ✅ Haben |
| 9Router | (no category) | (none) | 🟡 Einzigartig |
| Dispatcher | Multi-Agent | Open-Coordination-Protocol | 🔴 Fehlt |
| Kanban | Multi-Agent | (none) | 🟡 Eigenbau |
| WebUI | Workspaces | Hermes Studio | 🔴 Fehlt |
| MCP Server | Plugins | MCP ecosystem | 🟡 Teils |
| Cron | Automation | (built-in) | ✅ Hermes nativ |
| Headroom | (no category) | (none) | 🟡 Einzigartig |
| Cloudflare | Infrastructure | (none) | 🟡 Einzigartig |

## Nächste Schritte (priorisiert)

1. **P0:** Mnemosyne/Mnemonic lokal installieren + evaluieren (Brain-Token-Alternative)
2. **P0:** Agent-Soul-Compiler evaluieren (Regelwerke → Prompts automatisch)
3. **P0:** Open-Coordination-Protocol studieren (Multi-Agent-Orchestrierung)
4. **P1:** Hermes Studio deployen (WebUI-Alternative)
5. **P1:** Hermes Helm Chart + Ansible für VPS-Recovery
6. **P2:** Atlas-Skills aus missing 112 Repos sichten + Bedarf prüfen
7. **P3:** NeXify-Repo in Atlas eintragen via PR an ksimback/hermes-ecosystem

## Risiken

- **Atlas ist community-curated.** Einige Repos können veraltet oder ungepflegt sein.
- **NeXify-Eigenbau (Dispatcher, Kanban) ist nicht Atlas-kompatibel.** Migration braucht Zeit.
- **Brain-Token-Problem blockiert Memory-Provider-Vergleich.** Ohne Write kein Benchmark.
