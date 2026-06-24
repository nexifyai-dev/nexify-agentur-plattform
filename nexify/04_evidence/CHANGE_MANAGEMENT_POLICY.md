# Change-Management-Policy — NeXify AI OS
## Version: 1.0 | Status: ACTIVE | Erstellt: 2026-06-23

---

## 1. Zweck und Geltungsbereich
Diese Policy regelt die Kontrolle aller Änderungen an der NeXify-Produktionsinfrastruktur, um Störungen zu minimieren und Nachvollziehbarkeit sicherzustellen.

Geltungsbereich: Alle Systeme, Konfigurationen, Deployments, Infrastruktur und Daten der NeXify AI OS-Plattform.

## 2. Rollen und Verantwortlichkeiten
| Rolle | Verantwortung |
|---|---|
| **Change Requester** | Erstellt Change Request (CR), definiert Umfang |
| **Change Manager** | Prüft, priorisiert, genehmigt CRs |
| **Change Implementer** | Führt die Änderung durch |
| **Change Reviewer** | Verifiziert Ergebnis, schließt CR ab |

## 3. Change-Kategorien
| Kategorie | Genehmigung | Vorlaufzeit | Beispiel |
|---|---|---|---|
| **Standard** | Vorab genehmigt | Keine | Routine-Updates, bekannte Patches |
| **Normal** | Change Manager | 48h | Feature-Deployment, Konfigurationsänderung |
| **Emergency** | Nachträglich | Sofort | Critical-Security-Patch, Incident-Fix |

## 4. Change-Management-Prozess

### 4.1 Phase: Request
1. Change Request im Task-System erstellen (08_kanban_tasks/)
2. Beschreibung: Was, Warum, Umfang, Risiko, Rollback-Plan
3. Kategorie festlegen (Standard/Normal/Emergency)

### 4.2 Phase: Review & Approval
- **Standard:** Automatisch genehmigt bei Einhaltung definierter Kriterien
- **Normal:** Change Manager prüft Risiko, plant Fenster, genehmigt
- **Emergency:** Sofortige Umsetzung, Review innerhalb 24h nachträglich

### 4.3 Phase: Implementation
1. Backup/Snapshot vor Änderung (gemäß Backup-Recovery-Policy)
2. Änderung in Staging/Test durchführen (wenn möglich)
3. Änderung in Production implementieren
4. Smoke-Test durchführen

### 4.4 Phase: Verification & Closure
1. Erfolg der Änderung verifizieren
2. Monitoring auf Auffälligkeiten (mind. 24h)
3. CR im Task-System schließen
4. Evidence in 10_evidence/ speichern

## 5. Rollback-Strategie
- Jeder Change MUSS einen Rollback-Plan haben
- Rollback-Mechanismen vor Deployment testen
- Rollback-Zeitziel (RTO): < 30 Minuten für Normal, < 15 Minuten für Emergency

## 6. Dokumentation
- Alle CRs werden im Kanban-Task-System protokolliert
- Änderungen an Konfigurationen werden versioniert (Git)
- Evidence-Ablage: `/workspace/nexify/10_evidence/changes/`

## 7. Metriken
- Change Success Rate: Ziel ≥ 95%
- Emergency Change Ratio: Ziel < 10%
- Rollback Rate: Ziel < 5%

## 8. Review-Zyklus
Diese Policy wird quartalsweise oder nach signifikanten Vorfällen überprüft.
