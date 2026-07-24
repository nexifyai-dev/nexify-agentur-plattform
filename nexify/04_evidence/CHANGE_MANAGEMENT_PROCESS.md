# Change-Management-Prozess — Implementierung
## NeXify AI OS | Erstellt: 2026-06-23

---

## Prozessablauf

```
[Requester erstellt CR] → [Kategorie prüfen]
    ├── Standard → Automatisch genehmigt → Implementation
    ├── Normal → Change Manager Review → Approval → Implementation
    └── Emergency → Sofort-Implementation → Nachträgliche Review
                                                ↓
                                        [Verification] → [Closure + Evidence]
```

## Implementierungsdetails

### 1. Change Request Template
Jeder CR enthält:
- **ID:** CR-YYYY-NNN
- **Titel:** Kurzbeschreibung
- **Kategorie:** Standard | Normal | Emergency
- **Beschreibung:** Was wird geändert und warum?
- **Umfang:** Betroffene Systeme/Services
- **Risiko:** Hoch/Mittel/Niedrig + Beschreibung
- **Rollback-Plan:** Schritte zur Rücknahme
- **Zeitfenster:** Geplanter Implementierungszeitpunkt
- **Approval:** Genehmigungsstatus

### 2. Automatisierte Checks (vor Implementation)
```bash
# Pre-flight checks vor jedem Change
- Git-Status: Keine uncommitted changes
- Backup-Status: Letztes Backup < 4h alt
- Health-Check: Alle Services gesund
- Dependency-Check: Keine Blocker
```

### 3. Implementation-Checkliste
- [ ] Backup erstellt (gemäß Backup-Recovery-Policy)
- [ ] Rollback-Plan validiert
- [ ] Change implementiert
- [ ] Smoke-Test bestanden
- [ ] Monitoring-Check (mind. 15 Min)
- [ ] CR-Status aktualisiert
- [ ] Evidence gespeichert

### 4. Post-Implementation Review
- Monitoring für 24h nach Normal-Changes
- Monitoring für 48h nach Emergency-Changes
- Erfolg/Kommunikation an Stakeholder

## Integration in NeXify
- **Task-System:** 08_kanban_tasks/ — CRs als Tasks
- **Evidence:** 10_evidence/changes/
- **Automation:** 09_dispatcher/automation/ — Pre-flight-Checks
- **Monitoring:** systemd-Timer (nexify-health.timer)

## Status: IMPLEMENTIERT ✅
