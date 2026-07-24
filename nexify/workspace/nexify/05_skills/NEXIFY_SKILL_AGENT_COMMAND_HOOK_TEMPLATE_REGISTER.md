# NEXIFY SKILL AGENT COMMAND HOOK TEMPLATE REGISTER V1
Stand: 2026-06-11 | Status: DRAFT

---

## Sektion 1: Skills Register

| Skill ID | Name | Source | Type | Target System | Install Status | Config Status | Prompt Status | Risk Level |
|---|---|---|---|---|---|---|---|---|
| SKILL-001 | 9router-web-search | raw.githubusercontent.com/decolua/9router | web search | 9Router | REGISTERED | NOT_CONFIGURED | NOT_VERIFIED | MEDIUM |
| SKILL-002 | NeXify Automation Rules | GOOSE_NEXIFY_AUTOMATION_RULES.md | automation | Goose | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-003 | NeXify Semantic Compression | NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1.md | compression | System | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-004 | Andrej Karpathy Skills | github.com/multica-ai/andrej-karpathy-skills | coding discipline | Claude Code | REGISTERED | NOT_CONFIGURED | NOT_VERIFIED | MEDIUM |
| SKILL-005 | Brandkit | image-generation | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-006 | Design Taste Frontend | UI/UX design | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-007 | GPT Taste | UI/UX + GSAP Motion | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-008 | High End Visual Design | visual design | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-009 | Image to Code | website coding | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-010 | Industrial Brutalist UI | UI theme | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-011 | Minimalist UI | UI theme | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-012 | NeXify i18n German | language | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-013 | Redesign Existing Projects | project redesign | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-014 | Stitch Design Taste | design system | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-015 | find-skills | skill discovery | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-016 | goose-doc-guide | goose documentation | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-017 | full-output-enforcement | code generation | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |
| SKILL-018 | emil-design-eng | UI polish | NeXify | ACTIVE | ACTIVE | ACTIVE | LOW |

---

## Sektion 2: Sub-Agenten Register

| Agent ID | Name | Speciality | Call Method | Risk Level | Status |
|---|---|---|---|---|---|
| **C01–C11** | **Entwicklung (Development)** | | | | |
| AGENT-C01 | code-architect | Software architecture | direct | LOW | ACTIVE |
| AGENT-C02 | code-explorer | Code exploration | direct | LOW | ACTIVE |
| AGENT-C03 | code-reviewer | Code review | direct | LOW | ACTIVE |
| AGENT-C04 | debugger | Debugging | direct | LOW | ACTIVE |
| AGENT-C05 | frontend-developer | Frontend development | direct | LOW | ACTIVE |
| AGENT-C06 | backend-developer | Backend development | direct | LOW | ACTIVE |
| AGENT-C07 | fullstack-developer | Fullstack development | direct | LOW | ACTIVE |
| AGENT-C08 | test-automator | Test automation | direct | LOW | ACTIVE |
| AGENT-C09 | test-engineer | Test engineering | direct | LOW | ACTIVE |
| AGENT-C10 | test-generator | Test generation | direct | LOW | ACTIVE |
| AGENT-C11 | test-runner | Test execution | direct | LOW | ACTIVE |
| **D01–D07** | **DevOps** | | | | |
| AGENT-D01 | devops-engineer | DevOps engineering | direct | LOW | ACTIVE |
| AGENT-D02 | devops-expert | DevOps expertise | direct | LOW | ACTIVE |
| AGENT-D03 | devops-troubleshooter | DevOps troubleshooting | direct | LOW | ACTIVE |
| AGENT-D04 | deployment-engineer | Deployment | direct | MEDIUM | ACTIVE |
| AGENT-D05 | terraform-specialist | Terraform | direct | LOW | ACTIVE |
| AGENT-D06 | kubernetes-specialist | Kubernetes | direct | LOW | ACTIVE |
| **S01–S04** | **Security** | | | | |
| AGENT-S01 | security-auditor | Security auditing | direct | HIGH | ACTIVE |
| AGENT-S02 | security-engineer | Security engineering | direct | HIGH | ACTIVE |
| AGENT-S03 | api-security-audit | API security audit | direct | HIGH | ACTIVE |
| AGENT-S04 | compliance-specialist | Compliance | direct | MEDIUM | ACTIVE |
| **AI01–AI07** | **KI/ML** | | | | |
| AGENT-AI01 | ai-engineer | AI engineering | direct | LOW | ACTIVE |
| AGENT-AI02 | ml-engineer | Machine learning | direct | LOW | ACTIVE |
| AGENT-AI03 | llm-architect | LLM architecture | direct | LOW | ACTIVE |
| AGENT-AI04 | data-scientist | Data science | direct | LOW | ACTIVE |
| AGENT-AI05 | machine-learning-engineer | Machine learning engineering | direct | LOW | ACTIVE |
| AGENT-AI06 | nlp-engineer | NLP engineering | direct | LOW | ACTIVE |
| AGENT-AI07 | computer-vision-engineer | Computer vision | direct | LOW | ACTIVE |
| **U01–U06** | **UI/UX** | | | | |
| AGENT-U01 | ui-designer | UI design | direct | LOW | ACTIVE |
| AGENT-U02 | ui-ux-designer | UI/UX design | direct | LOW | ACTIVE |
| AGENT-U03 | ux-researcher | UX research | direct | LOW | ACTIVE |
| AGENT-U04 | se-ux-ui-designer | SE UX/UI design | direct | LOW | ACTIVE |
| AGENT-U05 | cli-ui-designer | CLI UI design | direct | LOW | ACTIVE |
| AGENT-U06 | web-accessibility-checker | Web accessibility | direct | LOW | ACTIVE |
| **M01–M07** | **MCP** | | | | |
| AGENT-M01 | mcp-expert | MCP expertise | direct | MEDIUM | ACTIVE |
| AGENT-M02 | mcp-server-architect | MCP server architecture | direct | MEDIUM | ACTIVE |
| AGENT-M03 | mcp-protocol-specialist | MCP protocol | direct | MEDIUM | ACTIVE |
| AGENT-M04 | mcp-security-auditor | MCP security | direct | HIGH | ACTIVE |
| AGENT-M05 | mcp-deployment-orchestrator | MCP deployment | direct | MEDIUM | ACTIVE |
| AGENT-M06 | mcp-testing-engineer | MCP testing | direct | LOW | ACTIVE |
| AGENT-M07 | mcp-registry-navigator | MCP registry | direct | LOW | ACTIVE |
| **A01–A06** | **Architektur** | | | | |
| AGENT-A01 | architect-reviewer | Architecture review | direct | MEDIUM | ACTIVE |
| AGENT-A02 | architecture-modernizer | Architecture modernization | direct | MEDIUM | ACTIVE |
| AGENT-A03 | backend-architect | Backend architecture | direct | MEDIUM | ACTIVE |
| AGENT-A04 | cloud-architect | Cloud architecture | direct | MEDIUM | ACTIVE |
| AGENT-A05 | database-architect | Database architecture | direct | MEDIUM | ACTIVE |
| AGENT-A06 | java-architect | Java architecture | direct | MEDIUM | ACTIVE |
| AGENT-A07 | diagram-architect | Architecture diagrams | direct | LOW | ACTIVE |
| **O01–O06** | **Organisation** | | | | |
| AGENT-O01 | project-manager | Project management | direct | LOW | ACTIVE |
| AGENT-O02 | scrum-master | Scrum mastery | direct | LOW | ACTIVE |
| AGENT-O03 | business-analyst | Business analysis | direct | LOW | ACTIVE |
| AGENT-O04 | product-strategist | Product strategy | direct | LOW | ACTIVE |
| AGENT-O05 | context-manager | Context management | direct | LOW | ACTIVE |
| **DA01–DA08** | **Daten** | | | | |
| AGENT-DA01 | data-engineer | Data engineering | direct | LOW | ACTIVE |
| AGENT-DA02 | data-analyst | Data analysis | direct | LOW | ACTIVE |
| AGENT-DA03 | database-administrator | Database administration | direct | MEDIUM | ACTIVE |
| AGENT-DA04 | database-optimizer | Database optimization | direct | MEDIUM | ACTIVE |
| AGENT-DA05 | postgres-pro | PostgreSQL expertise | direct | LOW | ACTIVE |
| AGENT-DA06 | sql-pro | SQL expertise | direct | LOW | ACTIVE |
| AGENT-DA07 | nosql-specialist | NoSQL expertise | direct | LOW | ACTIVE |
| AGENT-DA08 | supabase-schema-architect | Supabase schema | direct | LOW | ACTIVE |
| **F01–F06** | **Forschung** | | | | |
| AGENT-F01 | comprehensive-researcher | Comprehensive research | direct | LOW | ACTIVE |
| AGENT-F02 | academic-researcher | Academic research | direct | LOW | ACTIVE |
| AGENT-F03 | academic-research-synthesizer | Research synthesis | direct | LOW | ACTIVE |
| AGENT-F04 | search-specialist | Search expertise | direct | LOW | ACTIVE |
| AGENT-F05 | competitive-analyst | Competitive analysis | direct | LOW | ACTIVE |
| AGENT-F06 | market-researcher | Market research | direct | LOW | ACTIVE |
| **L01–L15** | **Sprachen** | | | | |
| AGENT-L01 | python-pro | Python | direct | LOW | ACTIVE |
| AGENT-L02 | typescript-pro | TypeScript | direct | LOW | ACTIVE |
| AGENT-L03 | javascript-pro | JavaScript | direct | LOW | ACTIVE |
| AGENT-L04 | cpp-pro | C++ | direct | LOW | ACTIVE |
| AGENT-L05 | c-pro | C | direct | LOW | ACTIVE |
| AGENT-L06 | c-sharp-pro | C# | direct | LOW | ACTIVE |
| AGENT-L07 | rust-pro | Rust | direct | LOW | ACTIVE |
| AGENT-L08 | golang-pro | Go | direct | LOW | ACTIVE |
| AGENT-L09 | php-pro | PHP | direct | LOW | ACTIVE |
| AGENT-L10 | kotlin-specialist | Kotlin | direct | LOW | ACTIVE |
| AGENT-L11 | vue-expert | Vue.js | direct | LOW | ACTIVE |
| AGENT-L12 | angular-architect | Angular | direct | LOW | ACTIVE |
| AGENT-L13 | react-specialist | React | direct | LOW | ACTIVE |
| AGENT-L14 | nextjs-developer | Next.js | direct | LOW | ACTIVE |
| AGENT-L15 | expert-nextjs-developer | Next.js (expert) | direct | LOW | ACTIVE |
| AGENT-L16 | expert-react-frontend-engineer | React (expert) | direct | LOW | ACTIVE |
| **I01–I04** | **Sicherheit (Incident & Performance)** | | | | |
| AGENT-I01 | incident-responder | Incident response | direct | HIGH | ACTIVE |
| AGENT-I02 | error-detective | Error detection | direct | MEDIUM | ACTIVE |
| AGENT-I03 | monitoring-specialist | Monitoring | direct | LOW | ACTIVE |
| AGENT-I04 | performance-engineer | Performance engineering | direct | LOW | ACTIVE |
| AGENT-I05 | performance-profiler | Performance profiling | direct | LOW | ACTIVE |
| **SP01–SP10** | **Spezial** | | | | |
| AGENT-SP01 | 3d-artist | 3D art | direct | LOW | ACTIVE |
| AGENT-SP02 | game-designer | Game design | direct | LOW | ACTIVE |
| AGENT-SP03 | unreal-engine-developer | Unreal Engine | direct | LOW | ACTIVE |
| AGENT-SP04 | mobile-app-developer | Mobile app development | direct | LOW | ACTIVE |
| AGENT-SP05 | web-vitals-optimizer | Web Vitals optimization | direct | LOW | ACTIVE |
| AGENT-SP06 | seo-specialist | SEO | direct | LOW | ACTIVE |
| AGENT-SP07 | seo-analyzer | SEO analysis | direct | LOW | ACTIVE |
| AGENT-SP08 | content-marketer | Content marketing | direct | LOW | ACTIVE |
| AGENT-SP09 | technical-writer | Technical writing | direct | LOW | ACTIVE |
| AGENT-SP10 | documentation-engineer | Documentation engineering | direct | LOW | ACTIVE |

**Gesamt Sub-Agenten: 112**

---

## Sektion 3: Commands & Hooks

| ID | Name | Type | Target | Status | Risk Level | Description |
|---|---|---|---|---|---|---|
| CMD-001 | cmd-execute | command | shell execution | ACTIVE | LOW | Shell command execution |
| CMD-002 | cmd-review | command | code review | PLANNED | MEDIUM | Automated code review |
| CMD-003 | cmd-test | command | test execution | ACTIVE | LOW | Run test suites |
| CMD-004 | cmd-deploy | command | deployment | GATE_PROTECTED | HIGH | Deploy to target environment |
| CMD-005 | cmd-backup | command | system backup | PLANNED | MEDIUM | System backup procedure |
| HOOK-001 | hook-pre-commit | hook | vor Commit | PLANNED | MEDIUM | Prüfung vor Commit |
| HOOK-002 | hook-post-merge | hook | nach Merge | PLANNED | LOW | Aktion nach Merge |
| HOOK-003 | hook-pre-deploy | hook | vor Deployment | GATE_PROTECTED | HIGH | Validierung vor Deployment |
| HOOK-004 | hook-pre-change | hook | vor Änderung | PLANNED | MEDIUM | Prüfung vor Änderung (gemäß NO_FULL_CRASH_POLICY) |

---

## Sektion 4: Knowledge Capabilities (Phase 3 — 2026-06-14, additiv)

| ID | Name | Type | Target | Status | Risk Level | Description |
|---|---|---|---|---|---|---|
| SKILL-019 | nexify-knowledge-data-engineer | knowledge data engineering | Supermemory + Brain + 9Router + nscale | REGISTERED → CONFIGURED → VERIFIED | LOW | NeXify-optimierte Erweiterung des `data-engineer`-Originals. 100% Original erhalten, 13 NeXify-Adds. Original SHA256 `7d98bfc15f917e0b2522abe730914ce6c72a951233b3e18dd6babf555655e715`. Optimiert SHA256 `8657164ab46ab14edd0c4b240475a8ab30d80f21ba883c765cd1e2611bd82337`. Runtime-Prompt SHA256 `6ec47ac17b0bfe96385f2dcf6785925b4d824b8a6eae55468c71905611ecc3dd`. Supermemory-Container `nexify:capabilities:data-engineering`. Modelle: `openai/gpt-oss-120b` (LLM), `Qwen/Qwen3-Embedding-8B` (Embedding). 9Router `http://127.0.0.1:20128/v1`. Pilot: 25+1 Records. Visibility: visible skill profile. |

### Sektion 4 Details (Phase 3)

- **Originalquelle (unverändert):** `/workspace/nexify/05_skills/data-engineer/source/DATA_ENGINEER_ORIGINAL_UNMODIFIED.md`
- **Source-Manifest:** `/workspace/nexify/05_skills/data-engineer/SOURCE_MANIFEST.json`
- **Optimierte Fassung (additiv):** `/workspace/nexify/05_skills/nexify-knowledge-data-engineer/SKILL.md`
- **Subagent-Profil:** `/workspace/nexify/.claude/agents/data-engineer.md`
- **Skill-Symlink:** `/workspace/nexify/.claude/skills/nexify-knowledge-data-engineer/SKILL.md`
- **Runtime-Prompt:** `/workspace/nexify/07_tools_cli/supermemory/prompts/NEXIFY_KNOWLEDGE_DATA_ENGINEER_SYSTEM_PROMPT.md`
- **Knowledge-Record-Schema:** `/workspace/nexify/05_skills/nexify-knowledge-data-engineer/schemas/knowledge-record.schema.json`
- **Eval-Set + Plan:** `/workspace/nexify/05_skills/nexify-knowledge-data-engineer/evals/`
- **Supermemory-Plugin:** `supermemory@supermemoryai` v0.0.7 (offiziell installiert, 7 Skills, 2 Hooks)
- **Plugin-Config:** `/workspace/nexify/.claude/.supermemory-claude/config.json` (`baseUrl=http://127.0.0.1:6768`)
- **Original NeXify-Supermemory-Server:** `/root/supermemory/server.py` (Port 6767, unverändert)
- **Compatibility-Adapter (Phase 3 Block A):** `/root/supermemory/adapter.py` (Port 6768, läuft)
- **Cross-Session-Test-Marker:** `nexify-cross-session-marker-2026-06-14T11-33-00Z-marker-cs7x9p2a` (Adapter-Record `1a6990599b86d6eb`)
- **Phase-3-Evidence:** `/workspace/nexify/10_evidence/supermemory/PHASE3_INSTALLATION_AND_COMPATIBILITY_2026-06-14.md`
- **Brain-Pending:** `/workspace/nexify/11_brain_sync/pending/PHASE3_SUPERMEMORY_DATA_ENGINEER_PENDING.jsonl`

---

*End of Document*
