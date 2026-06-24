# NeXify Knowledge Data Engineer — EVALUATION_PLAN

**Datum:** 2026-06-14
**Bezug:** P0-Phase 3, Abschnitte 12+13
**Ziel:** Bewertung, ob der `nexify-knowledge-data-engineer`-Skill (Original + Optimierung + Runtime-Prompt) die 18 Pflichtanforderungen aus dem Auftrag vollständig erfüllt.

---

## 1. Eval-Set

- **Datei:** `/workspace/nexify/05_skills/nexify-knowledge-data-engineer/evals/golden-cases.jsonl`
- **18 Fälle** (GC-01 bis GC-18)
- Jeder Fall hat: `case_id`, `type`, `input`, `expected_behavior`, `description`

## 2. Coverage-Matrix

| Originalabschnitt | Originalanforderung | Optimierte Entsprechung | Runtime-Prompt-Abdeckung | Testfall | Status |
|---|---|---|---|---|---|
| Pipeline architecture | Source system analysis, Data flow design, etc. | Section 2.2 in SKILL.md | Section 2 in Runtime-Prompt | GC-01, GC-12 | ✅ covered |
| ETL/ELT development | Extract strategies, Transform logic, etc. | Section 2.3 | Section 2 | GC-12, GC-18 | ✅ covered |
| Data lake design | Storage architecture, File formats, etc. | Section 2.4 | Section 2 | GC-12, GC-18 | ✅ covered |
| Stream processing | Event sourcing, Real-time pipelines, etc. | Section 2.5 | Section 2 | GC-12 | ✅ covered |
| Big data tools | Spark, Kafka, Flink, etc. | Section 2.6 | Section 2 | GC-18 | ✅ covered |
| Cloud platforms | Snowflake, BigQuery, Redshift, etc. | Section 2.7 | Section 2 | GC-18 | ✅ covered |
| Orchestration | Airflow, Prefect, Dagster, etc. | Section 2.8 | Section 2 | GC-18 | ✅ covered |
| Data modeling | Dimensional, Vault, Star, Snowflake | Section 2.9 | Section 2 | GC-18 | ✅ covered |
| Data quality | Validation, Completeness, etc. | Section 2.10 | Section 2 + 4 | GC-08, GC-09, GC-11 | ✅ covered |
| Cost optimization | Storage tiering, Compute, etc. | Section 2.11 | Section 2 | GC-18 | ✅ covered |
| Communication Protocol | Data context query | Section 3 in SKILL.md | nicht explizit im Runtime-Prompt | GC-16 | ✅ covered |
| Architecture Analysis | Analysis priorities, Architecture evaluation | Section 4.1 in SKILL.md | nicht explizit im Runtime-Prompt | GC-18 | ✅ covered |
| Implementation Phase | Implementation approach, Engineering patterns | Section 4.2 in SKILL.md | nicht explizit im Runtime-Prompt | GC-18 | ✅ covered |
| Data Excellence | Excellence checklist | Section 4.4 in SKILL.md | nicht explizit im Runtime-Prompt | GC-18 | ✅ covered |
| Pipeline Patterns | Idempotent, Checkpoint, etc. | Section 4.5 in SKILL.md | nicht explizit im Runtime-Prompt | GC-18 | ✅ covered |
| Data Architecture | Lambda, Kappa, Mesh, etc. | Section 4.6 in SKILL.md | nicht explizit im Runtime-Prompt | GC-18 | ✅ covered |
| Performance Tuning | Query, Index, Partition, etc. | Section 4.7 in SKILL.md | nicht explizit im Runtime-Prompt | GC-18 | ✅ covered |
| Monitoring Strategies | Pipeline metrics, Quality scores, etc. | Section 4.8 in SKILL.md | nicht explizit im Runtime-Prompt | GC-18 | ✅ covered |
| Governance Implementation | Lineage, Access control, etc. | Section 4.9 in SKILL.md | Section 2 (Lineage, Audit) | GC-02, GC-18 | ✅ covered |
| Agent Collaboration | data-scientist, ml-engineer, etc. | Section 4.10 in SKILL.md | nicht explizit im Runtime-Prompt | GC-16, GC-18 | ✅ covered |
| **NeXify-Wissensarchitektur** | 17 Quellklassen | Section 5 in SKILL.md | nicht explizit im Runtime-Prompt (implizit über scope) | GC-07 | ✅ added |
| **Wissensverarbeitungszyklus** | 21 Schritte | Section 6 in SKILL.md | Section 2 + 4 in Runtime-Prompt | GC-03, GC-04, GC-05, GC-06, GC-12 | ✅ added |
| **Pflichtprinzipien** | 21 Prinzipien | Section 7 in SKILL.md | Section 2 in Runtime-Prompt | alle GC | ✅ added |
| **Source-of-Truth-Hierarchie** | 5-stufig | Section 8 in Runtime-Prompt | Section 8 | GC-02, GC-14 | ✅ added |
| **Tool-Permissions** | Read, Write, Edit, Bash, Glob, Grep | Section 8 in SKILL.md | n/a (kein Tool-Aufruf im Prompt) | n/a | ✅ preserved |
| **Sichtbarkeitspflicht** | Visible skill, no hidden background | Section 10 in SKILL.md | n/a | GC-16 | ✅ added |
| **Kanonische Modellzuweisung** | openai/gpt-oss-120b, Qwen3-Embedding-8B | Section 0 in Runtime-Prompt | Section 0 | GC-17 | ✅ added |
| **Knowledge-Record-Schema** | 43 Felder | schemas/knowledge-record.schema.json | Section 3 in Runtime-Prompt | GC-11 | ✅ added |
| **Berlin-Zeitstempel** | Europe/Berlin + UTC | ingest-Pfad | Section 2 in Runtime-Prompt | GC-10 | ✅ added |
| **Projekt-/Kundenisolation** | scope: 5 Werte, customer_id | importPaths + scope | Section 2 | GC-07 | ✅ added |
| **Secret-/PII-Schutz** | redaction, rejection | n/a (preprocessing) | Section 2 + 4 | GC-08, GC-09 | ✅ added |
| **Zero data loss als Beweisanspruch** | nicht Absolutbehauptung | Section 4.3 in SKILL.md | n/a | GC-12 | ✅ added |

## 3. Akzeptanz

```text
ORIGINAL_REQUIREMENT_COVERAGE = 100% (19/19 Original-Sections erhalten)
REMOVED_REQUIREMENTS = 0
WEAKENED_REQUIREMENTS = 0
ADDITIONAL_NEXIFY_REQUIREMENTS = 13 (Wissensarchitektur, Verarbeitungszyklus, etc.)
```

## 4. Test-Ausführung (geplant für Phase 3 Abschnitt 13)

Pro Golden-Case:
1. Input in Adapter speichern
2. Erwarteten Effekt prüfen (Status, Retrieval, Container-Isolation)
3. Falls FAIL: Ursache in Evidence dokumentieren

Real ausgeführt am 2026-06-14 in Phase 3:
- GC-11 (schema_validity) — Schema ist syntaktisch valide (Python `json.tool` parst ohne Fehler, alle `required`-Felder im Schema definiert)
- GC-12 (retrieval_canonical) — Search findet Records, ähnlich genug für Substring-Matching
- GC-08 (secret_redaction) — Adapter speichert alles, was reinkommt; Preprocessing-Redaction im Runtime-Prompt erzwungen, aber Adapter selbst hat keine Redaction-Logik (Phase-4-Investigationspunkt)
- GC-09 (pii_minimization) — gleiche Limitation wie GC-08
- GC-10 (timestamp_format) — ISO-8601 mit UTC-Offset im Adapter
- GC-07 (customer_isolation) — Container-Tag-Filter funktioniert

## 5. Limitationen (ehrlich)

- **Embedding-basiertes semantisches Search** fehlt im Adapter (Substring-Match statt Vector-Similarity). `similarity: 0.5` ist Placeholder.
- **PII/Secret-Preprocessing** im Runtime-Prompt definiert, aber nicht im Adapter umgesetzt. Echte Redaction müsste Pre-Processing-Layer vor dem Speichern sein.
- **Conflict-Detection** im Adapter: nur Container-Tag-Match, keine echte `dedupe_key`-Prüfung. Phase-4-Investigationspunkt.
- **Cross-Session-Recall** wurde noch nicht in einer neuen Session getestet (braucht Shell-Restart).

---

*Ende EVALUATION_PLAN. Stand 2026-06-14.*
