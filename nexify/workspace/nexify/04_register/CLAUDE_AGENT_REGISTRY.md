# Claude Agent Registry — NeXify AI Systemmaster

> Status: 2026-06-12
> Ausgangslage: 187 Agentfiles mit ~1.5 MB (~66.3k Token)
> Ziel: Agentbeschreibungen ≤ 15k Token (besser ≤ 10k)
> Klassifikation: CORE / FREQUENT / NORMAL / ARCHIVE / DISABLED

## Klassifikationsregeln

| Kategorie | Zweck | beschreibung |
|---|---|---|
| CORE_ALWAYS_ACTIVE | Immer geladen, Systemkern | < 500 Token pro Datei, < 3 KB |
| FREQUENT_ON_DEMAND | Häufig genutzt, projekt-logisch | < 300 Token, < 2 KB |
| NORMAL_ON_DEMAND | Selten, aber verfügbar | von Registry referenziert, Datei reduziert |
| RARE_ARCHIVE | Nicht mehr aktiv | In `99_archiv/agents/` ausgelagert |
| DISABLED_CONFLICT | Doppelt/veraltet | Gelöscht, Referenz in Registry |

---

## CORE_ALWAYS_ACTIVE (immer geladen)

| Agent | Funktion | Token-Ziel |
|---|---|---|
| systemmaster | Systemsteuerung, Orchestrierung | < 500 |
| planner | Implementierungsplanung | < 500 |
| executor | Bulk-Ausführung | < 500 |
| reviewer | Code-Review, Diff-Analyse | < 500 |
| security | Security-Prüfung | < 500 |
| memory | Agentmemory / Brain-Sync | < 500 |
| evidence | Evidence-Erfassung | < 500 |
| live-verification | Live-Check | < 500 |
| 9router | AI-Routing | < 500 |

## FREQUENT_ON_DEMAND (projekt-logisch)

| Agent | Funktion | Token-Ziel |
|---|---|---|
| frontend | UI-Entwicklung | < 300 |
| backend | API-Entwicklung | < 300 |
| devops | Infrastruktur | < 300 |
| python-pro | Python-Entwicklung | < 300 |
| typescript-pro | TypeScript-Entwicklung | < 300 |
| sql-pro | Datenbank-Queries | < 300 |
| debugger | Fehlerdiagnose | < 300 |
| claude-api | Claude/Anthropic API | < 300 |

## NORMAL_ON_DEMAND (referenziert in Registry, minimale Agent-Datei)

| Agent | Typ | Beschreibung |
|---|---|---|
| 3d-artist | creative | 3D-Art für Games |
| angular-architect | framework | Angular 15+ |
| api-designer | api | REST/GraphQL/gRPC Design |
| graphql-architect | api | GraphQL Federation |
| react-specialist | framework | React 18 |
| vue-expert | framework | Vue 3/Nuxt |
| nextjs-developer | framework | Next.js 14 |
| golang-pro | lang | Go Concurrency |
| rust-pro | lang | Rust Systems |
| kotlin-specialist | lang | Kotlin Multiplatform |
| cpp-pro | lang | C++20/23 |
| php-pro | lang | PHP 8.3 |
| java-architect | lang | Java/Spring |
| mobile-app-developer | mobile | iOS + Android |
| kubernetes-specialist | infra | K8s Deploy |
| terraform-specialist | infra | Terraform |
| database-architect | db | Schema Design |
| postgres-pro | db | PostgreSQL Tuning |
| redis-specialist | db | Redis/Cache |
| prompt-engineer | ai | Prompt Design |
| machine-learning-engineer | ai | ML Serving |
| nlp-engineer | ai | NLP Pipeline |
| data-scientist | data | Predictive Models |
| devops-engineer | ops | CI/CD |
| security-auditor | sec | Compliance |
| performance-engineer | perf | Bottleneck Analysis |
| ux-researcher | ux | User Research |
| technical-writer | docs | API/Tech Docs |
| test-automator | qa | Test Frameworks |
| project-manager | mgmt | Projektplanung |
| scrum-master | mgmt | Agile Facilitation |
| business-analyst | mgmt | Requirements |
| product-strategist | mgmt | Roadmap |
| market-researcher | mgmt | Market Analysis |
| competitive-analyst | mgmt | Competitive Intel |
| content-marketer | marketing | Content Strategy |

## DISABLED_CONFLICT (Duplikate, gelöscht)

| Gelöscht | Ersatz | Grund |
|---|---|---|
| cli-ui-designer | — | Nicht benötigt |
| command-expert | — | Nicht benötigt |
| ai-ethics-advisor | — | Nicht benötigt |
| architect-review | architect-reviewer | Duplikat |
| changelog-generator | — | Automatisch |
| code-architect | planner | Überschneidung |
| code-explorer | — | Nicht benötigt |
| compliance-specialist | security-auditor | Überschneidung |
| computer-vision-engineer | — | Nicht benötigt |
| content-curator | — | Nicht benötigt |
| context-manager | memory | Überschneidung |
| critical-thinking | — | Nicht benötigt |
| customer-success-manager | — | Nicht benötigt |
| customer-support | — | Nicht benötigt |
| database-optimizer | postgres-pro | Überschneidung |
| dependency-manager | — | Automatisch |
| diagram-architect | — | Nicht benötigt |
| document-structure-analyzer | — | Nicht benötigt |
| documentation-expert | technical-writer | Duplikat |
| dx-optimizer | — | Nicht benötigt |
| error-detective | debugger | Duplikat |
| git-flow-manager | — | Manuell |
| hackathon-ai-strategist | — | Nicht benötigt |
| implementation-plan | planner | Duplikat |
| incident-responder | debugger | Überschneidung |
| legal-advisor | — | Nicht benötigt |
| llms-maintainer | — | Nicht benötigt |
| load-testing-specialist | perf | Überschneidung |
| markdown-syntax-formatter | — | Überflüssig |
| mcp-deployment-orchestrator | devops | Überschneidung |
| mcp-server-architect | — | Nicht benötigt |
| monitoring-specialist | devops | Überschneidung |
| ocr-grammar-fixer | — | Nicht benötigt |
| ocr-quality-assurance | — | Nicht benötigt |
| ocr-preprocessing-optimizer | — | Nicht benötigt |
| react-performance-optimizer | react-specialist | Duplikat |
| search-ai-optimization-expert | seo | Duplikat |
| shell-scripting-pro | — | Transparent |
| unreal-engine-developer | — | Nicht benötigt |
| unused-code-cleaner | — | Riskant |
| url-link-extractor | — | Nicht benötigt |
| vercel-deployment-specialist | devops | Überschneidung |
| web3-integration-specialist | — | Nicht benötigt |
| websocket-engineer | backend | Überschneidung |
