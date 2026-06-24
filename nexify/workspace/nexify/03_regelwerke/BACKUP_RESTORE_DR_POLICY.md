# Backup-Restore-DR-Policy — NeXify AI OS
## Version: 1.0 | Status: ACTIVE | Erstellt: 2026-06-23
## Normbasis: ISO 27001 A.12.3, BSI IT-Grundschutz OPS.1.2.2, ISO 22301

---

## 1. Zweck und Geltungsbereich
Diese Policy regelt die Datensicherung und Wiederherstellung aller geschäftskritischen Daten und Systeme der NeXify AI OS-Plattform. Sie umfasst Backup, Restore und Disaster Recovery (DR).

**Geltungsbereich:** Alle persistenten Daten, Konfigurationen, Datenbanken, Code-Repositories und Secrets.

---

## 2. Rollen und Verantwortlichkeiten

| Rolle | Verantwortung |
|---|---|
| **Backup Administrator** | Konfiguration, Überwachung, Verwaltung der Backups |
| **Backup Operator** | Durchführung von Backup- und Recovery-Operationen |
| **Recovery Manager** | Leitet Recovery-Prozess bei Bedarf |
| **Compliance Reviewer** | Prüft Einhaltung dieser Policy |

---

## 3. Backup-Kategorien und RPO/RTO

| Datenkategorie | Backup-Methode | RPO | RTO | Aufbewahrung |
|---|---|---|---|---|
| **Code-Repositories (Git)** | Git Push + Remote Mirror | 0 (sofort) | < 15 Min | Permanent |
| **Konfigurationen** | Versioniert + Snapshot | < 1h | < 30 Min | 90 Tage |
| **Datenbanken (Brain/Qdrant)** | Automatisiert, inkrementell | < 4h | < 1h | 30 Tage |
| **Secrets/Keys** | Verschlüsseltes Offline-Backup | < 24h | < 2h | 365 Tage |
| **Operating Data** | Täglich, inkrementell | < 24h | < 2h | 30 Tage |
| **Evidence/Dokumentation** | Git + File-Backup | < 24h | < 4h | Permanent |

**RPO** (Recovery Point Objective): Maximaler akzeptabler Datenverlust.
**RTO** (Recovery Time Objective): Maximaler akzeptabler Wiederherstellungszeitraum.

---

## 4. Backup-Prozess

### 4.1 Backup Planning
1. Alle schützenswerten Daten identifizieren und kategorisieren
2. Backup-Strategie pro Kategorie festlegen (Methode, Frequenz, Speicherort)
3. RPO/RTO-Anforderungen definieren und validieren
4. Backup-Infrastruktur bereitstellen (systemd-Timer, Cron, Scripts)

### 4.2 Backup Execution
**Automatische Backups:**
- Code: Git Push nach jedem Commit (CI/CD-Pipeline)
- Datenbanken: Inkrementell alle 4h via systemd-Timer (`nexify-backup.timer`)
- Konfigurationen: Alle 1h via Cron
- Operating Data: Täglich via Cron (02:00 Uhr)

**Manuelle Backups:**
- Vor jedem Change (gemäß Change-Management-Policy)
- Vor jedem Upgrade/Migration
- Auf Anforderung

Alle Backups werden verschlüsselt und mit Checksummen versehen.

### 4.3 Backup Verification
| Frequenz | Prüfung |
|---|---|
| Tägliche | Automatische Verifizierung der Backup-Logs |
| Wöchentliche | Stichproben-Restore-Test |
| Monatliche | Vollständiger Restore-Test einer Datenbank |
| Quartalsweise | Vollständiger Disaster-Recovery-Test |

---

## 5. Restore-Prozess

1. Incident/Bedarf für Recovery identifizieren
2. Recovery Manager bestimmt Scope und Priorität
3. Passendes Backup identifizieren (nach Datum, Integrität)
4. Recovery in isolierter Umgebung durchführen
5. Datenintegrität verifizieren (Checksummen, Stichproben)
6. Recovery in Produktion überführen
7. Smoke-Tests und Monitoring-Verifizierung
8. Evidence dokumentieren

---

## 6. Disaster Recovery (DR)

### 6.1 DR-Szenarien

| Szenario | RTO | Strategie |
|---|---|---|
| Einzelausfall (Service) | < 15 Min | Container-Restart, Failover |
| Datenbankverlust | < 1h | Inkrementelles Backup + Restore |
| VPS-Komplettverlust | < 4h | Git + Offsite-Backup + Rebuild |
| Sicherheitsverletzung | < 2h | Isolation + Credential-Rotation + Restore |

### 6.2 DR-Testplan
- **Quartalsweise:** Vollständiger DR-Test (VPS-Simulated-Down)
- **Halbjährlich:** Tabletop-Exercise mit allen Rollen
- **Ergebnisse:** In `10_evidence/dr_tests/` dokumentieren

---

## 7. Backup-Speicherorte

| Ort | Typ | Verschlüsselung | Redundanz |
|---|---|---|---|
| **Lokal (/workspace/nexify/)** | Primär | Ja (LUKS/GPG) | Nein |
| **Remote Git (GitHub)** | Offsite-Replica | Ja (TLS + GitCrypt) | Ja |
| **Cloudflare R2** (optional) | Offsite-Storage | Ja (Server-Side) | Ja |

---

## 8. Retention und Löschung
- Backups werden gemäß Aufbewahrungstabelle gelöscht
- Löschung wird protokolliert
- Compliance-relevante Backups: Aufbewahrung gemäß gesetzlichen Anforderungen

---

## 9. Sicherheitsanforderungen
- Alle Backups werden verschlüsselt (at-rest und in-transit)
- Backup-Zugriff nur durch autorisierte Rollen
- Backup-Credentials werden separat von Produktionssystemen verwaltet
- Secrets-Backups: Zusätzliche Verschlüsselung mit dediziertem Key

---

## 10. Metriken

| Metrik | Ziel |
|---|---|
| Backup Success Rate | ≥ 99% |
| Restore Test Success Rate | ≥ 95% |
| RPO-Verletzungen | 0 pro Quartal |
| RTO-Verletzungen | 0 pro Quartal |

---

## 11. Integration mit anderen Policies

| Policy | Bezug |
|---|---|
| CHANGE_MANAGEMENT_POLICY | Backup vor jedem Change |
| INCIDENT_RESPONSE_POLICY | Recovery bei Incident |
| REAL_PROGRESS_GATE_V1 | Backup-Verifizierung im Gate |

---

## 12. Review-Zyklus
Diese Policy wird halbjährlich, nach jedem Recovery-Ereignis, oder bei signifikanten Infrastrukturänderungen überprüft.

---

## 13. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---|---|---|---|
| 1.0.0 | 2026-06-23 | Systemmaster | Initiale Fassung |

---

*Ende BACKUP_RESTORE_DR_POLICY*
