# PHASE3_ROLLBACK

**Datum:** 2026-06-14
**Bezug:** P0-Phase 3, Abschnitt 17 (Rollback)
**Status:** 🟢 ROLLBACK_READY — alle destruktiven Schritte haben dokumentierte Rollback-Pfade

---

## 1. Rollback-Inventar (alle Phase-3-Änderungen)

| # | Datei / Komponente | Backup-Pfad | SHA256 (post) | Rollback-Befehl |
|---|---|---|---|---|
| 1 | `/root/.nexify/claude-env.sh` | `10_evidence/claude_startup/wrapper-fix-20260614T*/claude-env.sh.bak` | `cdf8bd0bfcffb6d0686f5a0152cf081522d57460cf9f3753ba7070002a5aee0c` | `cp .bak /root/.nexify/claude-env.sh && chmod 600 /root/.nexify/claude-env.sh` |
| 2 | `/root/.local/bin/sm-claude` | `10_evidence/claude_startup/wrapper-fix-20260614T*/sm-claude.bak` | `9c59709e44c549714100a85bb38433eefda8c6e50ff4dd759e2084ff34016b46` | `cp .bak /root/.local/bin/sm-claude && chmod 700 /root/.local/bin/sm-claude` |
| 3 | `/root/.bashrc.d/claude-code.sh` | `10_evidence/claude_startup/wrapper-fix-20260614T*/claude-code.sh.bak` | (unverändert) | `cp .bak /root/.bashrc.d/claude-code.sh` |
| 4 | `/root/.claude/plugins/installed_plugins.json` (Carta disabled) | `10_evidence/plugins/carta-disable-20260614T*/installed_plugins.json.bak` | (Carta-Flag entfernt) | `cp .bak /root/.claude/plugins/installed_plugins.json && claude plugin enable carta-cap-table@knowledge-work-plugins carta-crm@knowledge-work-plugins carta-investors@knowledge-work-plugins` |
| 5 | `/workspace/nexify/SYSTEMMASTER_TOTAL_CONCEPT_V1.md` | (kein Backup nötig, nur additiver Korrekturvermerk) | (additiv) | manuell: Edit-Aktion rückgängig |
| 6 | `/workspace/nexify/.claude/.supermemory-claude/config.json` | `10_evidence/supermemory/.supermemory-claude-config-original.bak` (zu erstellen) | (additive Phase-3-Sektion) | JSON-Merge: Phase-3-Felder entfernen |
| 7 | `/root/.claude/plugins/installed_plugins.json` (Supermemory installiert) | (nicht destruktiv — Deinstallation via `claude plugin disable`) | (neuer Eintrag `supermemory@supermemoryai` v0.0.7) | `claude plugin disable supermemory@supermemoryai` |
| 8 | `/root/supermemory/adapter.py` (NEU) | (zu erstellen: `10_evidence/supermemory/adapter.py.original.bak` nach Phase-3-Ende) | (neu erstellt) | `rm /root/supermemory/adapter.py && kill 1539662` |
| 9 | `/root/supermemory/server.py` (UNVERÄNDERT) | `10_evidence/supermemory/server.py.original.bak-20260614` | (unverändert) | n/a (kein Patch) |
| 10 | `/workspace/nexify/05_skills/data-engineer/` (NEU) | (kein Backup nötig — neue Verzeichnisse) | Original SHA `7d98bfc1...` | `rm -rf /workspace/nexify/05_skills/data-engineer/` (Original geht mit verloren! NICHT EMPFOHLEN) |
| 11 | `/workspace/nexify/05_skills/nexify-knowledge-data-engineer/` (NEU) | (kein Backup nötig) | (neue Skill-Definitionen) | `rm -rf /workspace/nexify/05_skills/nexify-knowledge-data-engineer/` (Achtung: SKILL.md, Schema, Eval, Runtime-Prompt-Verweise gehen mit verloren) |
| 12 | `/workspace/nexify/.claude/agents/data-engineer.md` (NEU) | (zu erstellen) | (neu) | `rm /workspace/nexify/.claude/agents/data-engineer.md` |
| 13 | `/workspace/nexify/.claude/skills/nexify-knowledge-data-engineer/` (Symlink NEU) | (zu erstellen) | Symlink auf `05_skills/.../SKILL.md` | `rm /workspace/nexify/.claude/skills/nexify-knowledge-data-engineer/SKILL.md` (nur den Symlink) |
| 14 | `/workspace/nexify/07_tools_cli/supermemory/prompts/NEXIFY_KNOWLEDGE_DATA_ENGINEER_SYSTEM_PROMPT.md` (NEU) | (zu erstellen) | (neu) | `rm` |
| 15 | `/workspace/nexify/07_tools_cli/supermemory/prompts/nexify-knowledge-data-engineer-runtime.json` (NEU) | (zu erstellen) | (neu) | `rm` |
| 16 | `/root/supermemory/memories.jsonl` (PHASE-3-RECORDS) | n/a (Append-Only, 29 Records) | (nicht destruktiv) | Records einzeln löschen via `claude plugin save`/`recall` oder direkt mit `sed -i '/test_id/d' /root/supermemory/memories.jsonl` |
| 17 | `/workspace/nexify/05_skills/nexify-skill-agent-command-hook-template-register.json` (additiver SKILL-019) | (zu erstellen: Pre-Phase-3-Stand) | Post-Phase-3 SHA `bb52d6309bc8b93b464232d346f7d21ea966d3a8394248a50b863e5aa50955f8` | JSON-Merge: SKILL-019 entfernen |
| 18 | `/workspace/nexify/05_skills/NEXIFY_SKILL_AGENT_COMMAND_HOOK_TEMPLATE_REGISTER.md` (additive Sektion 4) | (zu erstellen) | (additiv) | Edit-Aktion rückgängig |
| 19 | `/workspace/nexify/30_operating_data/NEXIFY_SYSTEM_BLUEPRINT_MASTER.md` (Phase-3-Anhang) | (zu erstellen) | (additiv) | Edit-Aktion rückgängig |
| 20 | `/workspace/nexify/30_operating_data/NEXIFY_DEPENDENCY_AND_FLOW_MAP.md` (Phase-3-Flow) | (zu erstellen) | (additiv) | Edit-Aktion rückgängig |
| 21 | `/workspace/nexify/04_register/PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14.md` (Phase 2 Block A) | (kein Backup nötig) | (neu) | `rm` (Mapping-Register; war im Phase-2-Block-A erstellt) |
| 22 | `/workspace/nexify/10_evidence/brain/BRAIN_WRITE_AUTH_BLOCKER_2026-06-14.md` | (kein Backup nötig) | (neu, Evidence) | n/a (Evidence) |
| 23 | `/workspace/nexify/30_operating_data/BRAIN_SECRET_RESTORATION_PLAN.md` | (kein Backup nötig) | (neu, Plan) | n/a (Plan) |
| 24 | `/workspace/nexify/11_brain_sync/pending/PHASE3_SUPERMEMORY_DATA_ENGINEER_PENDING.jsonl` | (kein Backup nötig) | (neu, Pending) | n/a (Pending) |
| 25 | `/workspace/nexify/10_evidence/supermemory/*` (alle Phase-3-Evidence) | (kein Backup nötig) | (neu, Evidence) | n/a (Evidence) |

## 2. Rollback-Szenarien (gemäß Auftrag Abschnitt 17)

### 2.1 "Skill auf vorherige Version zurücksetzen"
- Original-Datei `DATA_ENGINEER_ORIGINAL_UNMODIFIED.md` bleibt immer erhalten
- Optimierter Skill kann gelöscht werden (`rm -rf /workspace/nexify/05_skills/nexify-knowledge-data-engineer/`)
- Symlink in `.claude/skills/` ebenfalls löschen
- Agent-Profil in `.claude/agents/data-engineer.md` löschen
- Register-Eintrag SKILL-019 aus JSON entfernen
- **Resultat:** Originalskill verfügbar, keine NeXify-Optimierung, keine Schema, kein Eval

### 2.2 "Runtime-Prompt deaktivieren"
- Lösche `/workspace/nexify/07_tools_cli/supermemory/prompts/NEXIFY_KNOWLEDGE_DATA_ENGINEER_SYSTEM_PROMPT.md`
- Lösche `nexify-knowledge-data-engineer-runtime.json`
- **Resultat:** Optimierter Skill noch vorhanden, aber kein System-Prompt für nscale-Inferenz

### 2.3 "nscale-Modellpfad zurücksetzen"
- Im Runtime-JSON: `model_id_router`, `supermemory_llm`, `embedding_llm` auf leer setzen oder Datei löschen
- Im Skill-Schema-Feldern `processing_model` und `embedding_model` Documentation entfernen
- **Resultat:** Kein LLM-Pfad definiert, neues Modell wählbar ohne Altlast

### 2.4 "9Router-Alias entfernen"
- **Nicht angelegt** (siehe Phase-3-Bericht Abschnitt 7) — kein Rollback nötig

### 2.5 "Supermemory-Pilotdaten löschen"
```bash
# Records nach Test-Marker filtern und löschen
grep -E 'PILOT_NEXIFY_KNOWLEDGE_RECORD|CROSS_SESSION_TEST_RECORD' /root/supermemory/memories.jsonl | wc -l
# 26 (25 Pilot + 1 Cross-Session-Test)

# Selektiv entfernen
grep -v -E 'PILOT_NEXIFY_KNOWLEDGE_RECORD|CROSS_SESSION_TEST_RECORD' /root/supermemory/memories.jsonl > /tmp/memories.clean.jsonl
# Backup der vollen Datei:
cp /root/supermemory/memories.jsonl /root/supermemory/memories.jsonl.pre-phase3-cleanup
# Atomarer Replace:
mv /tmp/memories.clean.jsonl /root/supermemory/memories.jsonl
```
- **Resultat:** Pilot + Cross-Session-Records weg, ursprüngliche Records (1 SM_ROUNDTRIP_TEST + 2 Phase-2-Adapter-Tests) bleiben

### 2.6 "Plugin deaktivieren"
```bash
claude plugin disable supermemory@supermemoryai
# Plugin bleibt installiert, wird nicht mehr geladen
# Zur Reaktivierung:
claude plugin enable supermemory@supermemoryai
```

### 2.7 "Alte Projektkonfiguration wiederherstellen"
- `/workspace/nexify/.claude/.supermemory-claude/config.json` (alt, pre-Phase-3)
  - Phase-3-Add-Sektion `_phase3_additions_2026-06-14` entfernen
  - JSON-Merge mit `jq 'del(._phase3_additions_2026-06-14)' config.json`
- Adapter-Plugin-Config `baseUrl` zurück auf `http://127.0.0.1:6767` (würde aber wieder 404 liefern, weil Server kein REST hat — dann Plugin nicht funktional)
- **Saubere Variante:** baseUrl auf `https://api.supermemory.ai` (Cloud-Default, aber **nicht freigegeben**) — Plugin wäre nicht-funktional ohne Cloud-Key

### 2.8 "REST-Adapter stoppen"
```bash
kill 1539662
# oder
pkill -f "python3 /root/supermemory/adapter.py"
# Kein Auto-Restart eingerichtet (Phase-4-Investigationspunkt: systemd-Unit)
```

## 3. Composite-Rollback (alles auf einmal)

Falls die **gesamte Phase 3 rückgängig** gemacht werden soll:

```bash
# 1. Plugin deaktivieren
claude plugin disable supermemory@supermemoryai

# 2. Adapter-Service beenden
kill 1539662 2>/dev/null
rm /root/supermemory/adapter.py

# 3. NeXify-Skill-Verzeichnisse entfernen
rm -rf /workspace/nexify/05_skills/nexify-knowledge-data-engineer/
rm -rf /workspace/nexify/05_skills/data-engineer/
rm /workspace/nexify/.claude/agents/data-engineer.md
rm /workspace/nexify/.claude/skills/nexify-knowledge-data-engineer/SKILL.md

# 4. Runtime-Prompts entfernen
rm /workspace/nexify/07_tools_cli/supermemory/prompts/NEXIFY_KNOWLEDGE_DATA_ENGINEER_SYSTEM_PROMPT.md
rm /workspace/nexify/07_tools_cli/supermemory/prompts/nexify-knowledge-data-engineer-runtime.json

# 5. Pilot-Daten aus Store entfernen
grep -v -E 'PILOT_NEXIFY_KNOWLEDGE_RECORD|CROSS_SESSION_TEST_RECORD' /root/supermemory/memories.jsonl > /tmp/memories.clean.jsonl
mv /tmp/memories.clean.jsonl /root/supermemory/memories.jsonl

# 6. Register und Blueprint-Sektionen entfernen
# (manuelle Edits oder jq für JSON)

# 7. Phase-2-Block-A-Komponenten NICHT entfernen (siehe Block-A-Rollback-Pfade)
```

**Wichtig:** Originalskill `DATA_ENGINEER_ORIGINAL_UNMODIFIED.md` ist byte-exakt erhalten (SHA `7d98bfc1...`). Falls Phase-3-Skill + Source-Manifest gelöscht werden, muss die `.git`-Historie oder ein externer Backup den Original-Block bewahren.

## 4. Test-Rollback (was NICHT rückgängig)

Folgende Artefakte sind **additiv** und können einzeln gelöscht werden, ohne den Rest zu beeinträchtigen:
- Evidence-Dateien in `10_evidence/supermemory/`
- Pending-Manifest in `11_brain_sync/pending/`
- Brain-Secret-Restoration-Plan
- Pflichtdokument-Mapping
- SKILL-019-Eintrag im Register (nach manuellem JSON-Edit)

## 5. Auto-Restart-Lücke (Phase-4-Investigationspunkt)

Der REST-Adapter hat **keine** systemd-Unit. Nach Server-Reboot startet er nicht automatisch. Empfohlener Phase-4-Schritt:

```ini
# /etc/systemd/system/supermemory-rest-adapter.service
[Unit]
Description=NeXify Supermemory REST Adapter (Phase 3 Compatibility Layer)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/supermemory
ExecStart=/usr/bin/python3 /root/supermemory/adapter.py
Restart=on-failure
RestartSec=5
StandardOutput=append:/root/supermemory/adapter.log
StandardError=append:/root/supermemory/adapter.log

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now supermemory-rest-adapter.service
```

---

*Ende Phase-3-Rollback. Stand 2026-06-14, erstellt durch Claude Code Phase 3 Block A.*
