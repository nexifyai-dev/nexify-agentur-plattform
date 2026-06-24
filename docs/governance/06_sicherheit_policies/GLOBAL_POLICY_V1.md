# GLOBAL_POLICY V1 — Policy Gate für alle Aktionen

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja
**Übergeordnetes Regelwerk:** Operational Constitution (Rang 1)

---

## 1. Zweck

Dieses Policy-Gate definiert die **obligatorische Prüfkette**, die jeder Agent
**vor jeder Aktion** durchlaufen muss. Es stellt sicher, dass keine Aktion ohne
ausreichenden Kontext, autorisierte Werkzeuge und dokumentierte Entscheidungsbasis
ausgeführt wird.

> **Leitsatz:** Keine Aktion ohne Policy Gate. Kein Gate ohne Evidence.

---

## 2. Die Policy-Gate-Kette

Jede Aktion durchläuft **5 Stufen** in strenger Reihenfolge:

```
[1] Skill-Prüfung  →  [2] Brain-Prüfung  →  [3] Memory-Prüfung  →  [4] Policy Gate  →  [5] Evidence
```

### Stufe 1: Skill-Prüfung

**Frage:** Steht für diese Aktion ein dedizierter Skill zur Verfügung?

| Ergebnis | Vorgehen |
|----------|----------|
| ✅ Skill existiert und ist geladen | → Weiter zu Stufe 2 |
| ✅ Skill existiert, aber nicht geladen | → Skill laden, dann weiter |
| ❌ Skill existiert nicht | → Aktion pausieren, Skill-Erstellung beantragen |
| ⚠️ Skill existiert, aber veraltet | → Skill aktualisieren lassen, dann weiter |

**Prüfkriterien:**
- Skill-Name und Version notieren
- Skill-Dokumentation auf Vollständigkeit prüfen
- Prüfen, ob der Skill die Aktion vollständig abdeckt

### Stufe 2: Brain-Prüfung

**Frage:** Ist der relevante Kontext aus dem Brain geladen?

| Ergebnis | Vorgehen |
|----------|----------|
| ✅ Brain-Kontext geladen | → Weiter zu Stufe 3 |
| ❌ Brain nicht konsultiert | → Brain-Abfrage durchführen, dann weiter |
| ⚠️ Brain-Kontext unvollständig | → Fehlenden Kontext nachladen, dann weiter |

**Prüfkriterien:**
- Architektur-Entscheidungen für diese Aktion bekannt?
- Existieren relevante Patterns oder Präzedenzfälle?
- Sind Abhängigkeiten zu anderen Systemen dokumentiert?

### Stufe 3: Memory-Prüfung

**Frage:** Wurde agentmemory synchronisiert und ist der relevante Verlauf bekannt?

| Ergebnis | Vorgehen |
|----------|----------|
| ✅ Memory geladen und aktuell | → Weiter zu Stufe 4 |
| ❌ Memory nicht geladen | → agentmemory laden, dann weiter |
| ⚠️ Memory veraltet (>1h ohne Sync) | → Sync durchführen, dann weiter |
| 🔴 Memory-Fehler | → Aktion pausieren, System-Admin informieren |

**Prüfkriterien:**
- Letzter Sync-Zeitstempel prüfen
- Relevante historische Einträge zu dieser Aktion/diesem Kontext abrufen
- Prüfen, ob offene Tasks/Vorgänge im Memory existieren

### Stufe 4: Policy Gate

**Frage:** Erfüllt die geplante Aktion alle Policy-Vorgaben?

| Prüfung | Kriterium |
|---------|-----------|
| **Konformität** | Aktion verletzt kein aktives Regelwerk |
| **Autorisierung** | Agent ist für diese Aktion autorisiert |
| **Scope** | Aktion bleibt im definierten Aufgabenbereich |
| **Security** | Keine Sicherheitsrichtlinie wird verletzt |
| **Ressourcen** | Ausreichend Kapazität (Zeit, Token, Zugriff) |
| **Dependencies** | Alle Vorbedingungen sind erfüllt |

**Ergebnis:**
| Ergebnis | Bedeutung | Vorgehen |
|----------|-----------|----------|
| 🟢 **PASS** | Alle Prüfungen grün | → Aktion freigegeben |
| 🟡 **WARN** | Nicht-kritische Abweichung | → Aktion mit dokumentierten Ausnahmen freigegeben |
| 🔴 **BLOCK** | Kritische Abweichung | → Aktion blockiert, Begründung dokumentieren, Eskalation |

### Stufe 5: Evidence

**Frage:** Wird die Aktion evidence-pflichtig dokumentiert?

**Pflicht-Evidence nach Policy Gate:**
- Datum, Uhrzeit, Agent-ID
- Durchlaufene Policy-Gate-Stufen (1-4)
- Ergebnisse jeder Stufe
- Bei Block: Grund und Eskalationspfad
- Security-Check-Ergebnis
- Geplante Aktion + erwartetes Ergebnis

> **Keine Aktion wird ohne Evidence-Datei abgeschlossen.**
> Siehe: [EVIDENCE_TEMPLATE_V1.md](./EVIDENCE_TEMPLATE_V1.md)

---

## 3. Policy Gate Kurzform (Quick Check)

Für einfache, risikoarme Aktionen (z.B. Lesen von Dateien) kann eine
**Kurzform** verwendet werden:

```
[1] Skill geladen?  [2] Brain aktuell?  [3] Memory aktiv?  [4] Policy OK?  →  Go
```

Die Kurzform muss trotzdem in der Evidence dokumentiert werden, jedoch mit
reduziertem Umfang.

---

## 4. Ausnahmen

Ausnahmen von der Policy-Gate-Pflicht:

| Ausnahme | Bedingung | Dokumentation |
|----------|-----------|---------------|
| Notfall | Systemausfall, Sicherheitsvorfall | Nachträgliche vollständige Dokumentation |
| Automatisierte Routine | Cron-Job, CI/CD-Pipeline | Einmalige Policy-Prüfung bei Setup |
| Sub-Agent | Vom Hauptagenten gespawnter Sub-Agent | Policy Gate wurde vom Hauptagenten durchlaufen |

---

## 5. Policy-Gate-Log

Jeder Durchlauf wird in einem strukturierten Log festgehalten:

```json
{
  "gate_id": "PG-20260610-001",
  "timestamp": "2026-06-10T18:42:00Z",
  "agent": "agent-name",
  "action": "kurzbeschreibung-der-aktion",
  "stages": {
    "skill_check": {"status": "PASS", "skill": "skill-name", "version": "1.0"},
    "brain_check": {"status": "PASS", "brain_context": "architektur/kontext-x"},
    "memory_check": {"status": "PASS", "last_sync": "2026-06-10T18:30:00Z"},
    "policy_gate": {"status": "PASS", "checks_passed": 6},
    "evidence": {"status": "CREATED", "path": "/evidence/pg-001.md"}
  },
  "result": "PASS",
  "duration_ms": 1234
}
```

---

## 6. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiale Version — 5-Stufen-Policy-Gate | NeXify Governance |

---

*Jede Umgehung des Policy Gates muss im RULE_CONFLICT_REGISTER dokumentiert werden.*
