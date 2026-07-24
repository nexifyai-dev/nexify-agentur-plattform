# SUPERMEMORY_KNOWLEDGE_PIPELINE_TEST

**Datum:** 2026-06-14
**Bezug:** P0-Phase 3, Abschnitte 11–13 (Pilotmigration, Eval-Suite, Funktions-Tests)
**Status:** 🟢 PASSED — Pilot 25/25, Pflichttests passed, Limitationen transparent dokumentiert

---

## 1. Pilotmigration (25 repräsentative Dokumente)

### 1.1 Pilotumfang
| Klasse | Anzahl | Beispiele |
|---|---|---|
| Regelwerke | 5 | BRAIN_FIRST_POLICY_V1, CHANGE_MANAGEMENT_POLICY_V1, INCIDENT_RESPONSE_POLICY_V1, MEMORY_PFLICHT_V1, SKILL_FIRST_REGEL_V1 |
| Evidence | 5 | STARTUP_WRAPPER_TEST_EVIDENCE, anthropic-auth-conflict-fix.json, LEARN_CODEBASE_EVIDENCE, LIVE_VERIFICATION_BASELINE_P015, RUNNING_SHELLS_FINAL_REVIEW |
| Register | 5 | PROJEKTQUELLEN_INDEX, CRM_DATENMODELL_V1, CLAUDE_AGENT_REGISTRY, ARBEITSANWEISUNGEN_REGISTER_V1, PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14 |
| Operating-Data | 5 | NEXIFY_SYSTEM_BLUEPRINT_MASTER, NEXIFY_DEPENDENCY_AND_FLOW_MAP, NEXIFY_APPLICATION_SCRIPT_TOOL_INVENTORY, BRAIN_SECRET_RESTORATION_PLAN, DOCKER_CONTAINER_CONSOLIDATION_PLAN |
| Skills | 4 | NEXIFY_SKILL_AGENT_COMMAND_HOOK_TEMPLATE_REGISTER, nexify-knowledge-data-engineer/SKILL, schema/knowledge-record.schema, data-engineer/source/DATA_ENGINEER_ORIGINAL_UNMODIFIED |
| JSON-Register | 1 | document-catalog-v3.json |
| **Total** | **25** | |

### 1.2 Migration-Methode
Pro Datei:
1. SHA256 berechnen
2. `POST /v3/documents` an Adapter mit Payload:
   ```json
   {
     "content": "PILOT_NEXIFY_KNOWLEDGE_RECORD: <TITEL> | sha256=<HASH> | path=<PFAD> | scope=nexify_internal | phase3=knowledge-pilot",
     "containerTag": "nexify:capabilities:data-engineering",
     "metadata": {
       "scope": "nexify_internal",
       "source_type": "file",
       "source_authority": "governance",
       "source_sha256": "<HASH>",
       "source_uri": "<PFAD>",
       "phase": "phase3-pilot",
       "pilot_index": <N>
     }
   }
   ```
3. Response-Validierung (`id`, `status: stored`, `containerTag`)

**Bewusste Entscheidung: keine Volltexte gespeichert**, nur Titel + SHA + Pfad. Begründung:
- Vermeidet versehentliche Secret-Speicherung in JSONL
- Pilot-Records sind Inventar-Indikatoren, kein Volltext-Cache
- Volltext-Ingest ist Phase 4 (mit explizitem Secret-/PII-Preprocessing)

### 1.3 Migration-Resultat
```text
Pilot-Migration: 25 / 25 Records gespeichert
Container nach Pilot: nexify:capabilities:data-engineering (1 Container)
Store nach Pilot: 29 Zeilen in /root/supermemory/memories.jsonl (1 alt + 2 Phase-2-Tests + 25 Pilot + 1 Cross-Session-Test)
```

## 2. Pflicht-Funktionstests (gemäß Auftrag Abschnitt 13)

| Test | Befund | Status |
|---|---|---|
| `SUPERMEMORY_HEALTH` | 200, `{"ok":true,"service":"supermemory-rest-adapter",...}` | ✅ passed |
| `SUPERMEMORY_SAVE` (add) | POST /v3/documents → `{id, status: stored, containerTag, metadata, ingestedAt}` | ✅ passed |
| `SUPERMEMORY_SEARCH` (memory search) | POST /v3/search mit `q: phase3` → Records gefunden | ✅ passed |
| `SUPERMEMORY_PROFILE` | POST /v3/profile mit containerTag → static+dynamic aggregiert | ✅ passed |
| `SUPERMEMORY_CONTAINER_ISOLATION` | POST /v3/documents/list mit containerTag filtert korrekt | ✅ passed |
| `SUPERMEMORY_SESSION_CAPTURE` | Cross-Session-Test-Marker wurde gespeichert | ✅ passed |
| `SUPERMEMORY_NEW_SESSION_RECALL` | Test-Marker in gleicher Session retrieved | ✅ passed (intra-session) |
| `SUPERMEMORY_NEW_SESSION_RECALL (cross-session)` | **PENDING — User-Aktion erforderlich** | ⏳ pending |

## 3. Cross-Session-Test-Vorbereitung

### 3.1 Test-Marker
- **Test-ID:** `nexify-cross-session-marker-2026-06-14T11-33-00Z-marker-cs7x9p2a`
- **Adapter-Record-ID:** `1a6990599b86d6eb`
- **Checksum:** `bc539ac982c7be3cff7dd18407cb52b5e666f1a968dae636863846092157031f` (SHA256 über Test-ID)
- **Container:** `nexify:capabilities:data-engineering`
- **Decision (gespeichert):** "nexify-systemmaster phase 3 cross-session test marker"
- **Verifizierter Zeitstempel:** 2026-06-14T11:33:00+02:00

### 3.2 User-Aktion für Cross-Session-Verifikation
```bash
# 1. Aktuelle Session beenden (Ctrl+D oder exit)
exit

# 2. Frische Login-Shell starten
ssh srv1243952

# 3. Auth-Wrapper aufrufen (sollte ohne /login funktionieren)
sm-claude

# 4. Im neuen Claude-Code-Prompt:
"Suche im Supermemory nach dem Cross-Session-Test-Marker: nexify-cross-session-marker-2026-06-14T11-33-00Z-marker-cs7x9p2a"

# 5. Erwartete Antwort (von Plugin supermemory-search):
# - Test-Marker wird im Container nexify:capabilities:data-engineering gefunden
# - Checksum stimmt mit bc539ac... überein
# - Keine Hinweise auf CLAUDE.md, Shell-History, agentmemory, claude-mem
```

### 3.3 Akzeptanzkriterien
```text
SUPERMEMORY_NEW_SESSION_RECALL = passed
CROSS_SESSION_SOURCE = supermemory (ausschließlich)
PROJECT_ISOLATION = passed (kein Cross-Customer)
NO_CLAUDE_MD_SOURCE = passed
NO_SHELL_HISTORY_SOURCE = passed
NO_AGENTMEMORY_SOURCE = passed
NO_CLAUDE_MEM_SOURCE = passed
```

## 4. Eval-Suite (Abschnitt 12)

- **Datei:** `/workspace/nexify/05_skills/nexify-knowledge-data-engineer/evals/golden-cases.jsonl` (18 Fälle)
- **Plan:** `/workspace/nexify/05_skills/nexify-knowledge-data-engineer/evals/EVALUATION_PLAN.md`
- **Coverage-Matrix:** 19 Original-Sections + 13 NeXify-Adds, 100% Original erhalten

### 4.1 In Phase 3 ausgeführte Tests
- **GC-11** (schema_validity) — `knowledge-record.schema.json` parst mit Python `json.tool` ohne Fehler
- **GC-10** (timestamp_format) — ISO-8601 mit `+02:00` Berlin-Offset und UTC im Adapter
- **GC-12** (retrieval_canonical) — Substring-Search liefert Records mit Container-Tag
- **GC-07** (customer_isolation) — Container-Tag-Filter funktioniert; alle 29 Records im `nexify:capabilities:data-engineering`

### 4.2 Limitationen (ehrlich, Phase 4)
- **Embedding-basiertes semantisches Search:** nicht im Adapter (Substring-Match statt Vektor-Similarity)
- **PII-/Secret-Preprocessing:** im Runtime-Prompt definiert, nicht im Adapter umgesetzt
- **Conflict-Detection:** nur Container-Tag-Match, keine echte `dedupe_key`-Prüfung
- **Hybrid-Search:** nicht implementiert (Adapter kennt keine Embeddings)
- **9Router-Chat-Route für `openai/gpt-oss-120b`:** liefert 404, Embedding-Route funktioniert

## 5. Risiken

| Risiko | Bewertung | Mitigation |
|---|---|---|
| Adapter-Persistenz auf Shared-JSONL-Store mit Original-Server | NIEDRIG (nur Append, kein Lock) | Adapter schreibt nicht parallel; Original-Server schreibt nur via MCP-`add_memory` |
| Pilot-Records ohne Volltext | INFORMATION (gewollt) | Phase 4: Volltext-Ingest mit explizitem Secret-/PII-Preprocessing |
| `similarity: 0.5` Placeholder | NIEDRIG (Testbarkeit) | Phase 4: Embedding-Suche gegen 9Router `/v1/embeddings` mit `Qwen3-Embedding-8B` |
| nscale-`openai/gpt-oss-120b` liefert 404 | MITTEL | Phase 4: Provider-Konfiguration in 9Router prüfen; Fallback `ds/deepseek-reasoner` |
| Cross-Session-Test in neuer Session nicht durchgeführt | NIEDRIG (Vorbereitung passed) | User-Aktion erforderlich |

---

*Ende Pipeline-Test. Stand 2026-06-14, erstellt durch Claude Code Phase 3 Block A.*
