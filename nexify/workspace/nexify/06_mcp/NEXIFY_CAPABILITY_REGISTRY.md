# NEXIFY CAPABILITY REGISTRY V1

**Status:** 🟢 Entwurf / Draft
**Version:** 1.0.0
**Datum:** 2026-06-11
**Autor:** Subagent 20260611_5
**Audit-Pflicht:** Ja

---

## 1. Überblick

Dieses Dokument ist die **zentrale Registry aller Fähigkeiten (Capabilities)** im NeXify-System. Jede Fähigkeit — Tool, CLI, Agent, Workflow, Skill, Prompt, Regelwerk — ist hier mit allen Metadaten erfasst.

> **Prinzip:** Eine Fähigkeit, die nicht in dieser Registry steht, existiert nicht für das System.

---

## 2. Registry-Struktur

Jeder Eintrag enthält folgende Felder:

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `capability_id` | String | ✅ | Eindeutige ID der Fähigkeit |
| `name` | String | ✅ | Lesbarer Name |
| `source` | String | ✅ | Herkunft (Repository, Framework, Eigenentwicklung) |
| `repo` | String | ⚠️ | GitHub/GitLab-Repository-URL |
| `license` | String | ⚠️ | Lizenz (MIT, Apache-2.0, etc.) |
| `category` | Enum | ✅ | Kategorie (S0–S6, siehe Architektur) |
| `usage_frequency` | Enum | ✅ | Nutzungshäufigkeit (sehr_häufig, häufig, normal, selten, nie) |
| `used_by_agents` | List | ✅ | Welche Agenten nutzen diese Fähigkeit |
| `allowed_tools` | List | ⚠️ | Erlaubte Tools für diese Fähigkeit |
| `forbidden_tools` | List | ⚠️ | Verbotene Tools für diese Fähigkeit |
| `mcp_endpoint` | String | ✅ | MCP-Endpunkt-URI |
| `cli_command` | String | ⚠️ | CLI-Befehl (falls vorhanden) |
| `skill_ref` | String | ⚠️ | Verweis auf Skill-Datei |
| `prompt_ref` | String | ⚠️ | Verweis auf Prompt-Datei |
| `risk_level` | Enum | ✅ | Risikostufe (niedrig, mittel, hoch, kritisch) |
| `approval_required` | Boolean | ✅ | Freigabe erforderlich (ja/nein) |
| `test_status` | Enum | ✅ | Test-Status (getestet, teilweise, ungetestet, nicht_anwendbar) |
| `evidence_ref` | String | ⚠️ | Verweis auf Evidence-Datei |

---

## 3. Fähigkeits-Registry

### 3.1 Basisfähigkeiten (S0 — Dauerhafte Nutzung)

| # | capability_id | name | source | repo | license | category | usage_frequency | used_by_agents | allowed_tools | forbidden_tools | mcp_endpoint | cli_command | skill_ref | prompt_ref | risk_level | approval_required | test_status | evidence_ref |
|---|--------------|------|--------|------|---------|----------|-----------------|---------------|---------------|----------------|--------------|-------------|-----------|------------|------------|-------------------|-------------|--------------|
| 1 | `mcp_read` | MCP Resource Read | MCP-Standard | — | MIT | S0 | sehr_häufig | Alle | read_resource | — | `mcp://nexify/base/read_resource` | — | — | — | niedrig | nein | getestet | — |
| 2 | `mcp_write` | MCP Resource Write | MCP-Standard | — | MIT | S0 | sehr_häufig | Alle | write | — | `mcp://nexify/base/write_resource` | — | — | — | niedrig | nein | getestet | — |
| 3 | `mcp_tool_call` | MCP Tool Call | MCP-Standard | — | MIT | S0 | sehr_häufig | Alle | call_tool | — | `mcp://nexify/base/call_tool` | — | — | — | niedrig | nein | getestet | — |
| 4 | `brain_query` | Brain/Qdrant Query | NeXify Eigenentwicklung | — | — | S0 | sehr_häufig | Alle | — | — | `mcp://nexify/base/brain_query` | `brain-cli query` | — | — | niedrig | nein | getestet | — |
| 5 | `memory_sync` | agentmemory Sync | agentmemory | — | — | S0 | sehr_häufig | Alle | — | — | `mcp://nexify/base/memory_sync` | `memory-cli sync` | — | — | niedrig | nein | getestet | — |

### 3.2 Tools/CLIs (S1–S4)

| # | capability_id | name | source | repo | license | category | usage_frequency | used_by_agents | allowed_tools | forbidden_tools | mcp_endpoint | cli_command | skill_ref | prompt_ref | risk_level | approval_required | test_status | evidence_ref |
|---|--------------|------|--------|------|---------|----------|-----------------|---------------|---------------|----------------|--------------|-------------|-----------|------------|------------|-------------------|-------------|--------------|
| 6 | `9router_query` | 9Router KI-Router | NeXify Eigenentwicklung | — | — | S1 | sehr_häufig | Goose, Hermes, Kilo, Oracle | chat/completions | — | `mcp://nexify/tools/9router_query` | `9router-cli query` | `skill/9router` | — | niedrig | nein | getestet | `07_tools_cli/9router/` |
| 7 | `goose_acc` | Goose ACC | Goose CLI | — | — | S2 | häufig | Goose Systemmaster | chain, execute, review | — | `mcp://nexify/tools/goose_acc` | `goose-acc` | `skill/goose` | — | mittel | nein | getestet | `07_tools_cli/goose/` |
| 8 | `hermes_cli` | Hermes CLI | Hermes | — | — | S2 | häufig | Hermes, Oracle | task, status, config | — | `mcp://nexify/tools/hermes_cli` | `hermes-cli` | `skill/hermes` | — | mittel | nein | getestet | `07_tools_cli/hermes/` |
| 9 | `kilo_cli` | Kilo CLI | Kilo | — | — | S2 | häufig | Kilo | audit, scan, analyze | — | `mcp://nexify/tools/kilo_cli` | `kilo-cli` | `skill/kilo` | — | mittel | nein | getestet | `07_tools_cli/kilo/` |
| 10 | `crush_audit` | Crush Audit | Crush | — | — | S2 | normal | Crush, Oracle | audit | — | `mcp://nexify/tools/crush_audit` | `crush-cli audit` | — | — | mittel | nein | getestet | `07_tools_cli/crush/` |
| 11 | `cloudflare_dns` | Cloudflare DNS | Cloudflare | — | — | S3 | selten | Oracle, Infra | dns, zone, record | delete_all | `mcp://nexify/tools/cloudflare_dns` | `cf-dns-cli` | — | — | hoch | ja | getestet | `07_tools_cli/cloudflare_dns/` |
| 12 | `domain_management` | Domain-Management | NeXify | — | — | S4 | selten | Oracle, Admin | domain, register, update | transfer, delete | `mcp://nexify/tools/domain_mgmt` | `domain-cli` | — | — | kritisch | ja | getestet | `07_tools_cli/cloudflare_dns/` |
| 13 | `rollback_exec` | Rollback-Execution | NeXify | — | — | S4 | selten | Oracle, Admin | rollback, restore | — | `mcp://nexify/tools/rollback_exec` | `rollback-cli` | — | — | kritisch | ja | getestet | `07_tools_cli/cloudflare_dns/ROLLBACK_PLAN_V1.md` |
| 14 | `tunnel_reduction` | Tunnel-Reduction | Cloudflare | — | — | S4 | selten | Oracle, Infra | tunnel, config | tunnel_delete_all | `mcp://nexify/tools/tunnel_reduction` | — | — | — | hoch | ja | teilweise | `07_tools_cli/cloudflare_dns/TUNNEL_REDUCTION_PLAN_V1.md` |
| 15 | `subdomain_mgmt` | Subdomain-Management | Cloudflare | — | — | S3 | selten | Oracle, Infra | subdomain, record | — | `mcp://nexify/tools/subdomain_mgmt` | — | — | — | mittel | nein | getestet | `07_tools_cli/cloudflare_dns/SUBDOMAIN_A_RECORD_PLAN_V1.md` |

### 3.3 Agenten-Fähigkeiten (S1–S3)

| # | capability_id | name | source | repo | license | category | usage_frequency | used_by_agents | allowed_tools | forbidden_tools | mcp_endpoint | cli_command | skill_ref | prompt_ref | risk_level | approval_required | test_status | evidence_ref |
|---|--------------|------|--------|------|---------|----------|-----------------|---------------|---------------|----------------|--------------|-------------|-----------|------------|------------|-------------------|-------------|--------------|
| 17 | `goose_session` | Goose-CLI-Session | Goose | — | — | S1 | sehr_häufig | Goose Systemmaster, Subagents | shell, write, edit, analyze, load | delete_production | `mcp://nexify/agents/goose_session` | `goose` | `skill/goose` | — | niedrig | nein | getestet | — |
| 18 | `goose_acc_chain` | ACC Task Chain | Goose ACC | — | — | S2 | häufig | Goose Systemmaster | chain, step, review | chain_ohne_audit | `mcp://nexify/agents/goose_acc_chain` | `goose-acc chain` | — | — | mittel | nein | getestet | — |
| 19 | `hermes_webui` | Hermes WebUI | Hermes | — | — | S1 | sehr_häufig | Benutzer, Oracle | chat, task, config | — | `mcp://nexify/agents/hermes_webui` | — | — | — | niedrig | nein | getestet | — |
| 20 | `hermes_automation` | Hermes Automation | Hermes | — | — | S2 | häufig | Oracle | automate, schedule, trigger | automate_mass | `mcp://nexify/agents/hermes_automation` | `hermes-cli automate` | — | — | mittel | nein | getestet | — |
| 21 | `oracle_dispatch` | Oracle Dispatch | Oracle | — | — | S2 | sehr_häufig | Oracle | dispatch, route, assign | — | `mcp://nexify/agents/oracle_dispatch` | — | — | — | mittel | nein | getestet | — |
| 22 | `promptmaster_gov` | Promptmaster Governance | Promptmaster | — | — | S2 | normal | Promptmaster | prompt_read, prompt_write, prompt_review | prompt_write_ohne_review | `mcp://nexify/agents/promptmaster_gov` | — | — | — | hoch | ja | getestet | — |
| 23 | `auto_chat_driver` | Auto-Chat-Driver | NeXify | — | — | S2 | häufig | Goose Auto-Chat | chat_drive, inject, observe | unsupervised_inject | `mcp://nexify/agents/auto_chat_driver` | — | — | — | hoch | ja | getestet | `10_evidence/goose_auto_chat/` |
| 24 | `observer_service` | Observer Service | NeXify | — | — | S1 | sehr_häufig | Goose Observer | observe, monitor, alert | — | `mcp://nexify/agents/observer_service` | — | — | — | niedrig | nein | getestet | — |
| 25 | `compression_service` | Compression Service | NeXify | — | — | S2 | normal | Alle (bei Bedarf) | compress, summarize, prune | compress_ohne_backup | `mcp://nexify/agents/compression_service` | — | — | — | mittel | nein | teilweise | — |
| 26 | `connection_loss_handler` | Connection Loss Handler | NeXify | — | — | S2 | normal | Goose | recover, reconnect, preserve | — | `mcp://nexify/agents/connection_loss_handler` | — | — | — | mittel | nein | getestet | `10_evidence/connection_loss/` |

### 3.4 Wissens-Fähigkeiten (S0–S2)

| # | capability_id | name | source | repo | license | category | usage_frequency | used_by_agents | allowed_tools | forbidden_tools | mcp_endpoint | cli_command | skill_ref | prompt_ref | risk_level | approval_required | test_status | evidence_ref |
|---|--------------|------|--------|------|---------|----------|-----------------|---------------|---------------|----------------|--------------|-------------|-----------|------------|------------|-------------------|-------------|--------------|
| 27 | `evidence_system` | Evidence-System | NeXify | — | — | S1 | sehr_häufig | Alle | write_evidence, read_evidence, search_evidence | evidence_loeschen | `mcp://nexify/knowledge/evidence` | — | — | — | niedrig | nein | getestet | `03_regelwerke/EVIDENCE_TEMPLATE_V1.md` |
| 28 | `kanban_task` | Kanban/Task-System | NeXify | — | — | S1 | sehr_häufig | Alle | create_task, update_task, list_tasks, close_task | task_loeschen | `mcp://nexify/knowledge/kanban` | — | — | — | niedrig | nein | getestet | — |
| 29 | `regelwerke_access` | Regelwerke-Zugriff | NeXify | — | — | S0 | sehr_häufig | Alle | read_rule, check_rule, list_rules | rule_aendern | `mcp://nexify/knowledge/regelwerke` | — | — | — | niedrig | nein | getestet | `03_regelwerke/REGELWERKS_INDEX_V1.md` |
| 30 | `skill_registry` | Skill-Registry | NeXify | — | — | S0 | sehr_häufig | Alle | list_skills, load_skill, search_skills | — | `mcp://nexify/knowledge/skills` | — | — | — | niedrig | nein | getestet | `05_skills/` |
| 31 | `oss_candidates` | OSS-Kandidaten | NeXify | — | — | S2 | normal | Oracle, Architekten | read_candidates, evaluate | — | `mcp://nexify/knowledge/oss_candidates` | — | — | — | niedrig | nein | getestet | `07_tools_cli/OSS_TOP_CANDIDATES_V1.md` |

### 3.5 Governance-Fähigkeiten (S2–S5)

| # | capability_id | name | source | repo | license | category | usage_frequency | used_by_agents | allowed_tools | forbidden_tools | mcp_endpoint | cli_command | skill_ref | prompt_ref | risk_level | approval_required | test_status | evidence_ref |
|---|--------------|------|--------|------|---------|----------|-----------------|---------------|---------------|----------------|--------------|-------------|-----------|------------|------------|-------------------|-------------|--------------|
| 32 | `global_policy` | Global Policy Gate | NeXify | — | — | S0 | sehr_häufig | Alle | check_policy, report_status | policy_umgehen | `mcp://nexify/governance/global_policy` | — | — | — | niedrig | nein | getestet | `03_regelwerke/GLOBAL_POLICY_V1.md` |
| 33 | `rule_conflict_register` | Rule Conflict Register | NeXify | — | — | S1 | normal | Alle | read_conflicts, report_conflict | conflict_ignore | `mcp://nexify/governance/rule_conflicts` | — | — | — | niedrig | nein | getestet | `03_regelwerke/RULE_CONFLICT_REGISTER.md` |
| 34 | `audit_master` | Audit System | NeXify | — | — | S1 | normal | Alle, Auditoren | run_audit, view_audit, list_audits | audit_manipulieren | `mcp://nexify/governance/audit` | — | — | — | mittel | nein | getestet | `03_regelwerke/AUDIT_MASTER_V1.md` |
| 35 | `feedback_loop` | Feedback Loop | NeXify | — | — | S1 | normal | Alle | submit_feedback, review_feedback | feedback_ignorieren | `mcp://nexify/governance/feedback` | — | — | — | niedrig | nein | getestet | `03_regelwerke/FEEDBACK_LOOP_MASTER_V1.md` |
| 36 | `dos_gates` | DOS Gates | NeXify | — | — | S0 | sehr_häufig | Alle | check_gate, list_gates, bypass_gate | gate_bypass_ohne_genehmigung | `mcp://nexify/governance/dos_gates` | — | — | — | niedrig | nein | getestet | `03_regelwerke/REGELWERKS_INDEX_V1.md` |
| 37 | `done_regel` | Done-Regel | NeXify | — | — | S0 | sehr_häufig | Alle | check_done, list_criteria | done_faken | `mcp://nexify/governance/done_regel` | — | — | — | niedrig | nein | getestet | `03_regelwerke/DONE_REGEL_V1.md` |
| 38 | `skill_first_regel` | Skill-First-Regel | NeXify | — | — | S0 | sehr_häufig | Alle | check_skill_loaded, list_skills | skill_umgehen | `mcp://nexify/governance/skill_first` | — | — | — | niedrig | nein | getestet | `03_regelwerke/SKILL_FIRST_REGEL_V1.md` |
| 39 | `memory_pflicht` | Memory-Pflicht | NeXify | — | — | S0 | sehr_häufig | Alle | check_memory_sync | memory_umgehen | `mcp://nexify/governance/memory_pflicht` | — | — | — | niedrig | nein | getestet | `03_regelwerke/MEMORY_PFLICHT_V1.md` |
| 40 | `brain_gebot` | Brain-Gebot | NeXify | — | — | S0 | sehr_häufig | Alle | check_brain_query | brain_umgehen | `mcp://nexify/governance/brain_gebot` | — | — | — | niedrig | nein | getestet | `03_regelwerke/BRAIN_GEBOT_V1.md` |
| 41 | `positive_surprise` | Positive Surprise Rule | NeXify | — | — | S1 | normal | Alle | check_surprise_opportunity | surprise_ignorieren | `mcp://nexify/governance/positive_surprise` | — | — | — | niedrig | nein | getestet | `03_regelwerke/POSITIVE_SURPRISE_DELIVERY_RULE_V1.md` |
| 42 | `promptmaster_change_control` | Promptmaster Change Control | NeXify | — | — | S4 | selten | Promptmaster | change_prompt, review_change | prompt_change_ohne_review | `mcp://nexify/governance/promptmaster_cc` | — | — | — | kritisch | ja | getestet | `03_regelwerke/PROMPTMASTER_GOVERNANCE_V1.md` |
| 43 | `no_full_crash` | No-Full-Crash-Policy | NeXify | — | — | S0 | sehr_häufig | Alle | check_crash_safety, list_protected | crash_ignorieren | `mcp://nexify/governance/no_full_crash` | — | — | — | kritisch | ja | getestet | `03_regelwerke/NO_FULL_CRASH_POLICY_V1.md` |
| 44 | `change_safety` | Change Safety Baseline | NeXify | — | — | S2 | normal | Alle | check_change_safety, create_baseline, verify_rollback | change_ohne_baseline | `mcp://nexify/governance/change_safety` | — | — | — | hoch | ja | getestet | `10_evidence/change_safety/` |

### 3.6 Oracle-Fähigkeiten (S1–S4)

| # | capability_id | name | source | repo | license | category | usage_frequency | used_by_agents | allowed_tools | forbidden_tools | mcp_endpoint | cli_command | skill_ref | prompt_ref | risk_level | approval_required | test_status | evidence_ref |
|---|--------------|------|--------|------|---------|----------|-----------------|---------------|---------------|----------------|--------------|-------------|-----------|------------|------------|-------------------|-------------|--------------|
| 45 | `oracle_question_routing` | Oracle Question Routing | Oracle | — | — | S1 | sehr_häufig | Oracle, Alle | route_question, find_expert | — | `mcp://nexify/knowledge/oracle_question_routing` | — | — | — | niedrig | nein | getestet | `31_oracle/ORACLE_QUESTION_ROUTING_POLICY.md` |
| 46 | `oracle_agent_dispatch` | Oracle Agent Dispatch | Oracle | — | — | S1 | sehr_häufig | Oracle | dispatch_task, assign_agent | — | `mcp://nexify/knowledge/oracle_agent_dispatch` | — | — | — | mittel | nein | getestet | `31_oracle/ORACLE_AGENT_DISPATCH_POLICY.md` |
| 47 | `oracle_research` | Oracle Research & you.com | Oracle | — | — | S2 | häufig | Oracle | research, search_internet | — | `mcp://nexify/knowledge/oracle_research` | — | — | — | niedrig | nein | getestet | `31_oracle/ORACLE_RESEARCH_AND_YOU_COM_POLICY.md` |
| 48 | `oracle_knowledge_migration` | Oracle Knowledge Migration | Oracle | — | — | S4 | selten | Oracle | migrate_brain, migrate_qdrant, canonicalize | migrate_ohne_backup | `mcp://nexify/knowledge/oracle_knowledge_migration` | — | — | — | kritisch | ja | teilweise | `31_oracle/ORACLE_DATA_MIGRATION_PLAN.md` |

---

## 4. Zusammenfassung nach Kategorien

| Kategorie | Stufe | Anzahl | Frequenz gesamt |
|-----------|-------|--------|-----------------|
| Basisfähigkeiten | S0 | 5 | sehr_häufig |
| Tools/CLIs | S1–S4 | 11 | sehr_häufig bis selten |
| Agenten-Fähigkeiten | S1–S3 | 10 | sehr_häufig bis normal |
| Wissens-Fähigkeiten | S0–S2 | 5 | sehr_häufig bis normal |
| Governance-Fähigkeiten | S0–S5 | 13 | sehr_häufig bis selten |
| Oracle-Fähigkeiten | S1–S4 | 4 | sehr_häufig bis selten |
| **Gesamt** | **S0–S5** | **48** | — |

---

## 5. Registry-Pflege

### 5.1 Neue Fähigkeit registrieren

1. Eindeutige `capability_id` vergeben
2. Kategorie (S0–S6) bestimmen
3. MCP-Endpunkt definieren
4. Permission-Eintrag in der Permission Matrix ergänzen
5. Eintrag in dieser Registry ergänzen
6. JSON-Version aktualisieren

### 5.2 Fähigkeit aktualisieren

- Jede Änderung an einer Fähigkeit (Kategorie, Risiko, Permission) muss evidence-pflichtig dokumentiert werden
- Bei Kategorie-Änderung (z. B. S2→S4): sofortige Benachrichtigung aller betroffenen Agenten

### 5.3 Fähigkeit entfernen (Deregistrierung)

- Nur mit Audit und Freigabe durch Oracle oder Admin
- Alle abhängigen Fähigkeiten müssen vorher umgestellt sein
- Entfernung wird 30 Tage im Voraus angekündigt

---

## 6. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-11 | 1.0.0 | Initiale Registry mit 48 Fähigkeiten | Subagent 20260611_5 |

---

*Ende der Capability Registry. Alle Änderungen an diesem Dokument sind evidence-pflichtig.*
