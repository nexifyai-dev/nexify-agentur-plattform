---
id: EVIDENCE_REGELWERKE_MEMORY_LOAD_001
title: Regelwerke in agentmemory geladen — Load Evidence
version: 1.0.0
status: COMPLETED
datum: 2026-06-10
tester: Goose AI CLI (NeXify Auto-System)
methode: agentmemory_helper.py → docker exec → REST API
audit_pflicht: ja
tags: [agentmemory, regelwerke, load, evidence]
---

# REGELWERKE_MEMORY_LOAD_EVIDENCE

## 1. Übersicht

Alle 12 Kernregelwerke + 3 Goose-Driver-Dokumente + 3 Status-Einträge wurden
erfolgreich in agentmemory geladen. Insgesamt 18 Memories in 7 Kategorien.

## 2. Geladene Kategorien

| Kategorie | Speicherort | Einträge |
|-----------|-------------|----------|
| `regelwerke` | agentmemory | 9 |
| `teams` | agentmemory | 1 |
| `tasks` | agentmemory | 1 |
| `dispatcher` | agentmemory | 1 |
| `goose_user_chat_driver` | agentmemory | 4 |
| `session` | agentmemory | 1 |
| `evidence` | agentmemory | 1 |

## 3. Geladene Dateien im Detail

| # | Datei | Kategorie | Memory-ID | Status |
|---|-------|-----------|-----------|--------|
| 1 | REGELWERKS_INDEX_V1.md | regelwerke | `mem_mq8gbzsr_...` | ✅ |
| 2 | GLOBAL_POLICY_V1.md | regelwerke | `mem_mq8gbzxy_...` | ✅ |
| 3 | DONE_REGEL_V1.md | regelwerke | `mem_mq8gc02h_...` | ✅ |
| 4 | SKILL_FIRST_REGEL_V1.md | regelwerke | `mem_mq8gc07a_...` | ✅ |
| 5 | MEMORY_PFLICHT_V1.md | regelwerke | `mem_mq8gc0bn_...` | ✅ |
| 6 | RULE_CONFLICT_REGISTER.md | regelwerke | `mem_mq8gc0fp_...` | ✅ |
| 7 | AUDIT_MASTER_V1.md | regelwerke | `mem_mq8gc0k9_...` | ✅ |
| 8 | EVIDENCE_TEMPLATE_V1.md | regelwerke | `mem_mq8gc0qp_...` | ✅ |
| 9 | FEEDBACK_LOOP_MASTER_V1.md | regelwerke | `mem_mq8gc0wg_...` | ✅ |
| 10 | TEAM_SYSTEM_V1.md | teams | `mem_mq8gc11i_...` | ✅ |
| 11 | TASK_REGISTRY_V1.md | tasks | `mem_mq8gc15u_...` | ✅ |
| 12 | DISPATCHER_ARCHITEKTUR_V1.md | dispatcher | `mem_mq8gc1a8_...` | ✅ |
| 13 | GOOSE_AUTO_CHAT_ARCHITECTURE.md | goose_user_chat_driver | `mem_mq8gc1eo_...` | ✅ |
| 14 | GOOSE_AUTO_CHAT_SESSION_RULES.md | goose_user_chat_driver | `mem_mq8gc1j7_...` | ✅ |
| 15 | GOOSE_AUTO_CHAT_SWITCH_RULES.md | goose_user_chat_driver | `mem_mq8gc1o0_...` | ✅ |
| 16 | Session 20260610_28 | session | `mem_mq8gc7b1_...` | ✅ |
| 17 | Dry-Run-Evidence | evidence | `mem_mq8gc7h2_...` | ✅ |
| 18 | Driver-Status | goose_user_chat_driver | `mem_mq8gc7mk_...` | ✅ |

## 4. Technischer Zugang

```
Zugriff: docker exec coolify-agentmemory-1 curl -H "Authorization: Bearer <HMAC>"
Port:     http://127.0.0.1:3111
Auth:    Bearer-Token aus /data/.hmac
```

## 5. Validierung

- ✅ Alle 18 API-Calls erfolgreich (success: true)
- ✅ 12 Dateien von Festplatte geladen
- ✅ 3 Goose-Driver-Dokumente geladen
- ✅ 3 Status-Memories erstellt
- ✅ Health-Check bestätigt (254 Funktionen, 1 Worker)

---

*Evidence erstellt am 2026-06-10 19:18 UTC | Version 1.0.0 | Audit-Pflichtig*
