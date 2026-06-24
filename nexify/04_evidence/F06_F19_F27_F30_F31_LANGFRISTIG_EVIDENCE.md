# Langfristige Fragen F06, F19, F27, F30, F31 — Evidence

**Datum:** 2026-06-22  
**Agent:** Systemmaster  
**Status:** KLÄRUNG ABGESCHLOSSEN  
**Priorität:** LANGFRISTIG (nicht dringend, aber wichtig)

---

## F06: Headroom-Benchmarks — gibt es welche?

### Status: ✅ KLÄRT (Template vorhanden, keine aktiven Benchmarks)

**Aktueller Stand:**
- Headroom-URL konfiguriert: `http://localhost:8787` ✅
- Endpoint erreichbar: 302 Response ✅
- `headroomEnabled`: nicht explizit in DB (Default: false) ⚠️
- Proxy-Management implementiert (start/stop/status) ✅

**Benchmark-Template vorhanden:**
- Erstellt am: 2026-06-22
- Pfad: `/workspace/nexify/10_evidence/bolt/F03_F04_F06_BOLT_KONFIGURATION_2026-06-22.md`
- Enthält: Testfälle für kurze, mittlere und lange Prompts
- Metriken: Kompressionsrate, Latenz, Qualitätsverlust

**Fehlende Benchmarks:**
- ❌ Keine tatsächlichen Benchmark-Durchläufe
- ❌ Keine Performance-Metriken (aktuell)
- ❌ Keine Qualitätsbewertung durch Agenten

**Empfehlung (Langfristig):**
1. Headroom aktivieren (`headroomEnabled: true` in DB)
2. Benchmark-Suite mit 10+ Test-Prompts durchführen
3. Qualitätsbewertung durch 3 Agenten
4. Ergebnisse in `/workspace/nexify/10_evidence/bolt/headroom-benchmarks/` speichern
5. Regelmäßige Benchmarks (monatlich) einplanen

---

## F19: Penetrationstest — durchgeführt oder nur geplant?

### Status: ❌ OFFEN — Weder durchgeführt noch geplant

**Aktueller Security-Stand (aus F17/F18 Audit):**
- Security-Score: 3.3/10 (kritische Lücken)
- Firewall: 7/10 (gut)
- Secret-Rotation: 2/10 (manuell)
- CVE-Scanning: 0/10 (kein Scanner)
- SSH-Härtung: 3/10 (Root-Login erlaubt)
- Fail2Ban: 0/10 (nicht installiert)

**Penetrationstest-Status:**
- ❌ Kein Penetrationstest durchgeführt
- ❌ Kein Penetrationstest geplant
- ❌ Keine Pen-Test-Tools installiert (nmap, Metasploit, etc.)
- ❌ Keine externen Pen-Test-Dienste beauftragt

**Offene Sicherheitslücken (Pen-Test relevant):**
1. SSH: `PermitRootLogin yes`, `PasswordAuthentication` default
2. Offene Ports: 22, 8645, 8787, 9091, 9093, 9100, 9115, 54322, 54324, 54327, 5433
3. Keine Fail2Ban (Brute-Force-Schutz)
4. Keine CVE-Scanner
5. Manuelle Secret-Rotation

**Empfehlung (Langfristig):**
1. **Phase 1 (Sofort):** SSH härten, Fail2Ban installieren
2. **Phase 2 (bis 2026-07-06):** Trivy installieren, erste internen Tests
3. **Phase 3 (bis 2026-07-20):** Externer Pen-Test (Budget: 2.000–5.000 €)
4. **Phase 4 (quartalsweise):** Regelmäßige Pen-Tests

---

## F27: Customer-Boundary-Enforcement — wie wird es technisch durchgesetzt?

### Status: ⚠️ TEILWEISE — Policy vorhanden, technische Enforcement unvollständig

**Vorhandene Dokumente:**
1. `/workspace/nexify/30_operating_data/NEXIFY_CUSTOMER_PROJECT_BOUNDARY_REGISTER.md`
2. `/workspace/CUSTOMER_PROJECT_ISOLATION_POLICY.md`
3. `/workspace/nexify/04_projects/CUSTOMER_DATA_CLASSIFICATION_POLICY.md`

**Policy-Regeln (definiert):**
- Kundenprojekte dürfen nicht in NeXify-Kern integriert werden
- Brain-Scoping: `METADATA_ONLY` (keine Kundendaten im Brain)
- Verbotene Tätigkeiten: Code/Data in Kern, Kundendaten im Brain, etc.
- Erlaubte Tätigkeiten: Projektprofil, Anforderungen, Status, Evidence

**Technische Enforcement (FEHLEND):**
- ❌ Keine automatische Code-Analyse (ob Kundencode in Kern)
- ❌ Keine Data-Loss-Prevention (DLP) für Kundendaten
- ❌ Keine getrennten Qdrant-Collections pro Kunde
- ❌ Keine getrennten AgentMemory-Categories pro Kunde
- ❌ Keine CI/CD-Gates für Customer-Boundary-Checks

**Vorhandene technische Maßnahmen:**
- ✅ Separate Repositories pro Kunde (studienkolleg-aachen, bookando)
- ✅ Separate Deployment-Targets (GitHub Pages, app.bookando.de)
- ✅ Brain-Scoping in Policy definiert (METADATA_ONLY)

**Empfehlung (Langfristig):**
1. **Phase 1:** CI/CD-Gate einführen (Regex-Check für Kundendaten in Commits)
2. **Phase 2:** Getrennte Qdrant-Collections pro Kunde (nicht nur METADATA_ONLY)
3. **Phase 3:** DLP-Tool für Kundendaten (z.B. Microsoft Purview, Google DLP)
4. **Phase 4:** Automatische Boundary-Checks in Brain-Sync

---

## F30: Agent-Memory-Retention — wie lange bleiben Einträge?

### Status: ❌ OFFEN — Keine definierte Retention-Policy

**Aktueller Memory-Stand:**
- **Brain API:** http://127.0.0.1:9090 (systemd, 472 Einträge)
- **Qdrant:** http://127.0.0.1:6333 (4 Collections)
  - `nexifyai_brain` (12.989+ Points)
  - `nexifyai_memories` (5.852 Points)
  - `brain_agentmemory_4096_v1`
  - `brain_knowledge_3072_v3`
  - `nexifyai_brain_3072_v3`
- **AgentMemory:** Migration von Qdrant geplant

**Retention-Status:**
- ❌ Keine definierte Retention-Policy
- ❌ Keine automatische Löschung alter Einträge
- ❌ Keine Archivierungs-Strategie
- ❌ Keine Storage-Limits definiert

**Aktuelle Speicherung:**
- Brain: 1.252 Einträge (kein Limit)
- Qdrant: ~18.841 Points (kein Limit)
- AgentMemory: Migration läuft (kein Limit)

**Empfehlung (Langfristig):**
1. **Retention-Policy definieren:**
   - Operative Einträge: 30 Tage
   - Wissenseinträge: 180 Tage
   - Archiv-Einträge: 365 Tage
   - Metadaten: Unbegrenzt
2. **Automatische Löschung:** Cron-Job für alte Einträge
3. **Archivierung:** Alte Einträge → Cold Storage (S3, etc.)
4. **Storage-Monitoring:** Alerts bei 80% Speicherauslastung

---

## F31: Skill-Versionierung — semantisch oder inkrementell?

### Status: ❌ OFFEN — Kein definiertes Versionierungs-Schema

**Aktueller Skill-Stand:**
- Skills-Repository: `/workspace/nexify-ai-platform/src/automation/skills-repository/`
- Package-Skripte vorhanden:
  - `cli-tool/components/skills/productivity/skill-creator/scripts/package_skill.py`
  - `cli-tool/components/skills/development/skill-development/scripts/package_skill.py`
  - `cli-tool/components/skills/development/skill-creation-guide/scripts/package_skill.py`

**Versionierungs-Status:**
- ❌ Kein definiertes Versionierungs-Schema
- ❌ Keine Versionsnummern in Skill-Dateien
- ❌ Keine Changelog-Struktur
- ❌ Keine Backward-Compatibility-Checks

**Vorhandene Strukturen:**
- Skills haben: `name`, `description`, `version` (in JSON)
- Aber: Keine einheitliche Versionierung
- Keine automatische Versionierung bei Änderungen

**Empfehlung (Langfristig):**
1. **Semantische Versionierung einführen (SemVer):**
   - Format: `MAJOR.MINOR.PATCH` (z.B. `1.2.3`)
   - MAJOR: Breaking Changes
   - MINOR: Neue Features (backward-kompatibel)
   - PATCH: Bugfixes
2. **Changelog-Pflicht:** Jede Version muss Changelog haben
3. **Automatische Versionierung:** Git-Hooks für Version-Bumps
4. **Backward-Compatibility:** Tests für alte Versionen

---

## Zusammenfassung

| Frage | Status | Ergebnis | Nächster Schritt |
|-------|--------|----------|------------------|
| F06: Headroom-Benchmarks | ✅ KLÄRT | Template vorhanden, keine aktiven Benchmarks | Benchmarks durchführen |
| F19: Penetrationstest | ❌ OFFEN | Weder durchgeführt noch geplant | Pen-Test planen (Phase 3) |
| F27: Customer-Boundary | ⚠️ TEILWEISE | Policy vorhanden, technische Enforcement fehlt | CI/CD-Gates einführen |
| F30: Memory-Retention | ❌ OFFEN | Keine Retention-Policy | Policy definieren + automatisieren |
| F31: Skill-Versionierung | ❌ OFFEN | Kein Versionierungs-Schema | SemVer einführen |

---

## Priorisierung (Langfristig)

### Bis 2026-07-06 (nächste Woche):
1. **F30:** Retention-Policy definieren (einfach)
2. **F31:** SemVer-Schema definieren (einfach)

### Bis 2026-07-20 (2 Wochen):
3. **F27:** CI/CD-Gate für Customer-Boundary (mittel)
4. **F06:** Headroom-Benchmarks durchführen (mittel)

### Bis 2026-08-03 (1 Monat):
5. **F19:** Externer Pen-Test (komplex, Budget nötig)

---

*Generiert: 2026-06-22 | Agent: Systemmaster | Pfad: /workspace/nexify/10_evidence/langfristig/*
