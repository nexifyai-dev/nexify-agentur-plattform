# PFLICHTDOKUMENTE — REALPFAD-MAPPING

**Datum:** 2026-06-14
**Erstellt durch:** Claude Code (P0-Phase 2, Block A, Abschnitt 9)
**Status:** 🟢 VERBINDLICH — Single Source of Truth für erwartete vs. reale Dokumentenpfade
**Anlass:** Mehrere im Großauftrag 2026-06-14 genannte V3-Pflichtdokumente existieren unter den im Auftrag angegebenen Pfaden nicht. Mapping verhindert Fehlzuordnungen.

---

## 1. Mapping-Tabelle (erwartet → real)

| Erwarteter Name | Erwarteter Pfad | Realer Name | Realer Pfad | Version | Status | Authority | Supersedes | Conflicts | Action |
|---|---|---|---|---|---|---|---|---|---|
| optimierter_chatgpt_projektprompt.md | `03_regelwerke/` | DOKUMENTENKATALOG_V3.md | `/workspace/nexify/03_regelwerke/DOKUMENTENKATALOG_V3.md` | 3.0.0 | 🟢 AKTIV | Systemmaster | — | keine | Korrekturen an realer Datei vornehmen |
| optimierter_chatgpt_projektprompt_v2_offizielle_docs.md | `03_regelwerke/` | REGELWERKS_INDEX_V1.md | `/workspace/nexify/03_regelwerke/REGELWERKS_INDEX_V1.md` | 1.0.0 | 🟢 AKTIV | Governance | — | keine | Korrekturen an realer Datei vornehmen |
| aenderungserlass_offizielle_primaerdokumentation.md | `03_regelwerke/` | (in führendem Großauftrag eingebettet) | `/workspace/nexify/02_auftraege/claude_code/NEXIFY_AI_CLAUDE_CODE_SYSTEMMASTER_FINALER_LUECKENSCHLIESSENDER_GROSSAUFTRAG_2026-06-11.md` | 1.0 | 🟢 AKTIV | Systemmaster | — | keine | Korrektur in Sections 0, 1, 6 des Großauftrags |
| — (Bonus) | — | NEXIFY_AI_CLAUDE_CODE_SYSTEMMASTER_FINALER_LUECKENSCHLIESSENDER_GROSSAUFTRAG | `/workspace/nexify/02_auftraege/claude_code/NEXIFY_AI_CLAUDE_CODE_SYSTEMMASTER_FINALER_LUECKENSCHLIESSENDER_GROSSAUFTRAG_2026-06-11.md` | 1.0 | 🟢 AKTIV | Systemmaster | ersetzt alle P0-Einzelaufträge 2026-06-11 | — | führender Bezugspunkt |

---

## 2. Begründung der Diskrepanz

Der Auftrag vom 2026-06-14 referenziert drei Dokumente, die:
1. **nicht unter den genannten Pfaden existieren** (durch Read-Tool bestätigt: `File does not exist`),
2. **inhaltlich durch reale Dokumente abgedeckt sind** (DOKUMENTENKATALOG_V3.md, REGELWERKS_INDEX_V1.md, eingebetteter Änderungserlass im Großauftrag),
3. **in der Workspace-Struktur eine andere Rolle einnehmen** (Dokumentenkatalog V3 ist die maßgebliche Doku-Liste, Regelwerks-Index V1 das maßgebliche Regelwerk-Verzeichnis).

**Es wurde keine konkurrierende Kopie erstellt** — dieses Register ist die einzige Mapping-Quelle.

---

## 3. Verbindliche Korrekturpfade

Wenn in folgenden Aufträgen / Anweisungen die erwarteten Dateinamen auftauchen, sind die **realen Dateien** zu verwenden:

| Erwartet im Auftrag | Korrigiere in realer Datei |
|---|---|
| `optimierter_chatgpt_projektprompt.md` | `/workspace/nexify/03_regelwerke/DOKUMENTENKATALOG_V3.md` |
| `optimierter_chatgpt_projektprompt_v2_offizielle_docs.md` | `/workspace/nexify/03_regelwerke/REGELWERKS_INDEX_V1.md` |
| `aenderungserlass_offizielle_primaerdokumentation.md` | im Großauftrag `/workspace/nexify/02_auftraege/claude_code/NEXIFY_AI_CLAUDE_CODE_SYSTEMMASTER_FINALER_LUECKENSCHLIESSENDER_GROSSAUFTRAG_2026-06-11.md` (Abschnitte 0–6) |

---

## 4. Aktualisierungsregel

Bei jeder Änderung an einer der drei realen Dateien ist dieses Register gegenzuprüfen. Wird ein viertes erwartetes Dokument im Auftrag genannt, das hier nicht gemappt ist, MUSS zuerst dieses Register erweitert werden, **bevor** Korrekturen an irgendeiner Datei vorgenommen werden.

---

*Ende des Mappings. Pflicht-Stand: 2026-06-14, erstellt durch Claude Code P0-Phase 2 Block A.*
