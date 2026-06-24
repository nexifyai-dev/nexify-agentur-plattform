# NEXIFY PROMPT VERANKERUNG REGISTER V1

**Stand:** 2026-06-11 | **Status:** DRAFT | **Promptmaster:** aktive Kontrolle

---

## Zweck

Dieses Register dokumentiert, welche Systemprompts, Konfigurationen und Agentenanweisungen in welcher Datei verankert sind und wer sie ändern darf.

## Regel

- **Nur Promptmaster** darf produktive Prompts ändern
- Andere Agenten dürfen: Vorschläge, Diffs, Evidence, Testfälle
- Jede Änderung braucht: Change Control ID, Evidence, Gate-Freigabe

---

## Sektion 1: Prompt-Verankerungen

| prompt_id | name | file_path | type | owner | change_authority | last_change | status | evidence_ref |
|---|---|---|---|---|---|---|---|---|
| P-001 | Systemmaster Identity | System-Instructions (eingebaut) | Systemmaster | Systemmaster | PROMPTMASTER | 2026-06-11 | ACTIVE | Diese Datei |
| P-002 | CLAUDE.md | /workspace/nexify/.claude/CLAUDE.md (falls existent) | Systemprompt | Systemmaster | PROMPTMASTER | UNKNOWN | UNKNOWN | KEIN_EVIDENCE |
| P-003 | GOOSE.md | /workspace/nexify/05_skills/goose/GOOSE.md | Skillprompt | Goose | PROMPTMASTER | 2026-06-10 | ACTIVE | GOOSE_MD_CREATION_AND_LOAD_EVIDENCE.md |
| P-004 | GOOSE_NEXIFY_AUTOMATION_RULES | /workspace/nexify/05_skills/goose/GOOSE_NEXIFY_AUTOMATION_RULES.md | Regelprompt | Goose ACC | PROMPTMASTER | 2026-06-10 | ACTIVE | REGELWERKS_INDEX_UPDATE_V1.0.1_EVIDENCE.md |
| P-005 | 9Router Systemprompt | 9ROUTER_TARGET_STATE_V1.md | Systemkonfig | 9Router | PROMPTMASTER | 2026-06-10 | DRAFT | 9ROUTER_SAFE_CHANGE_EVIDENCE.md |
| P-006 | NeXify Semantic Compression Prompt | NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1.md | Skillprompt | System | PROMPTMASTER | 2026-06-11 | ACTIVE | TOKEN_COMPRESSION_TEST_EVIDENCE.md |
| P-007 | Agenten-Seele Team System | TEAM_SYSTEM_V1.md | Agentenprompt | Alle Agenten | PROMPTMASTER | 2026-06-10 | ACTIVE | KEIN_EVIDENCE |
| P-008 | Regelwerks-Index | REGELWERKS_INDEX_V1.md | Regelregister | System | PROMPTMASTER | 2026-06-10 | ACTIVE | REGELWERKS_INDEX_UPDATE_V1.0.1_EVIDENCE.md |
| P-009 | PROMPTMASTER_GOVERNANCE | PROMPTMASTER_GOVERNANCE_V1.md | Governance-Regel | Promptmaster | PROMPTMASTER | 2026-06-11 | ACTIVE | PROMPT_CHANGE_CONTROL_EVIDENCE.md |
| P-010 | NO_FULL_CRASH_POLICY | NO_FULL_CRASH_POLICY_V1.md | Sicherheitsregel | System | PROMPTMASTER | 2026-06-11 | BINDING | CHANGE_SAFETY_BASELINE_EVIDENCE.md |
| P-011 | 9Router Web Search Usage Rules | NEXIFY_USAGE_RULES.md | Skillnutzungsregeln | 9Router | PROMPTMASTER | 2026-06-11 | ACTIVE | KEIN_EVIDENCE |
| P-012 | Operational Constitution | GLOBAL_POLICY_V1.md | Grundregel | System | PROMPTMASTER | 2026-06-10 | ACTIVE | KEIN_EVIDENCE |

---

## Sektion 2: Prompt-Änderungsprotokoll

| cc_id | prompt_id | date | author | change_type | description | status | evidence_ref |
|---|---|---|---|---|---|---|---|
| CC-20260610-001 | P-004 | 2026-06-10 | Systemmaster | UPDATE | Automation Rules erstellt | CLOSED | REGELWERKS_INDEX_UPDATE_V1.0.1_EVIDENCE.md |
| CC-20260610-002 | P-009 | 2026-06-10 | Systemmaster | CREATE | Promptmaster Governance erstellt | CLOSED | PROMPTMASTER_GOVERNANCE_V1.md |
| CC-20260611-001 | P-010 | 2026-06-11 | Systemmaster | CREATE | NO_FULL_CRASH_POLICY erstellt | CLOSED | CHANGE_SAFETY_BASELINE_EVIDENCE.md |

---

## Sektion 3: Prompt-Änderungs-Gate-Prozess

1. **Änderungsvorschlag einreichen** (mit Diff)
2. **Promptmaster prüft** Auswirkung auf abhängige Systeme
3. **Risikobewertung** (LOW / MEDIUM / HIGH / CRITICAL)
4. **Bei CRITICAL:** Staging-Test + Rollback-Plan
5. **Evidence dokumentieren**
6. **Gate-Freigabe einholen**
7. **Änderung ausrollen**
8. **Post-Change Health Check**
9. **Register aktualisieren**

---

## Sektion 4: Geschützte Prompts (nur Promptmaster)

Liste der Prompts, die **NIEMALS** ohne Promptmaster-Review geändert werden dürfen:

- System-Instructions (Identity)
- CLAUDE.md (falls vorhanden)
- GOOSE.md + GOOSE_NEXIFY_AUTOMATION_RULES.md
- Alle Dateien in `/workspace/nexify/01_agenten_seele/`
- Alle Dateien in `/workspace/nexify/03_regelwerke/`
- 9Router-Config-Prompts
- NeXify Semantic Compression Prompt
- Promptmaster Governance selbst
