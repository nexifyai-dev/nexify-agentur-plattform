# Backup-Recovery-Policy — NeXify AI OS
## Version: 1.0 | Status: ACTIVE | Erstellt: 2026-06-23

---

## 1. Zweck und Geltungsbereich
Diese Policy regelt die Datensicherung und Wiederherstellung aller geschäftskritischen Daten und Systeme der NeXify AI OS-Plattform.

Geltungsbereich: Alle persistenten Daten, Konfigurationen, Datenbanken, Code-Repositories und Secrets.

## 2. Rollen und Verantwortlichkeiten
| Rolle | Verantwortung |
|---|---|
| **Backup Administrator** | Konfiguration, Überwachung, Verwaltung der Backups |
| **Backup Operator** | Durchführung von Backup- und Recovery-Operationen |
| **Recovery Manager** | Leitet Recovery-Prozess bei Bedarf |
| **Compliance Reviewer** | Prüft Einhaltung dieser Policy |

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

## 4. Backup-Recovery-Prozess

### 4.1 Phase: Backup Planning
1. Alle schützenswerten Daten identifizieren und kategorisieren
2. Backup-Strategie pro Kategorie festlegen (Methode, Frequenz, Speicherort)
3. RPO/RTO-Anforderungen definieren und validieren
4. Backup-Infrastruktur bereitstellen (systemd-Timer, Cron, Scripts)

### 4.2 Phase: Backup Execution
1. **Automatische Backups:**
   - Code: Git Push nach jedem Commit (CI/CD-Pipeline)
   - Datenbanken: Inkrementell alle 4h via systemd-Timer (`nexify-backup.timer`)
   - Konfigurationen: Alle 1h via Cron
   - Operating Data: Täglich via Cron (02:00 Uhr)
2. **Manuelle Backups:**
   - Vor jedem Change (gemäß Change-Management-Policy)
   - Vor jedem Upgrade/Migration
   - Auf Anforderung
3. Alle Backups werden verschlüsselt und mit Checksummen versehen
4. Backup-Erfolg wird protokolliert und überwacht

### 4.3 Phase: Backup Verification
1. **Tägliche Prüfung:** Automatische Verifizierung der Backup-Logs
2. **Wöchentliche Prüfung:** Stichproben-Restore-Test
3. **Monatliche Prüfung:** Vollständiger Restore-Test einer Datenbank
4. **Quartalsweise Prüfung:** Vollständiger Disaster-Recovery-Test
5. Ergebnisse werden in Evidence dokumentiert

### 4.4 Phase: Recovery
1. Incident/Bedarf für Recovery identifizieren
2. Recovery Manager bestimmt Scope und Priorität
3. Passendes Backup identifizieren (nach Datum, Integrität)
4. Recovery in isolierter Umgebung durchführen
5. Datenintegrität verifizieren (Checksummen, Stichproben)
6. Recovery in Produktion überführen
7. Smoke-Tests und Monitoring-Verifizierung
8. Evidence dokumentieren

## 5. Backup-Speicherorte
| Ort | Typ | Verschlüsselung | Redundanz |
|---|---|---|---|
| **Lokal (/workspace/nexify/)** | Primär | Ja (LUKS/GPG) | Nein |
| **Remote Git (GitHub)** | Offsite-Replica | Ja (TLS + GitCrypt) | Ja |
| **Cloudflare R2** (optional) | Offsite-Storage | Ja (Server-Side) | Ja |

## 6. Retention und Löschung
- Backups werden gemäß Aufbewahrungstabelle gelöscht
- Löschung wird protokolliert
- Compliance-relevante Backups: Aufbewahrung gemäß gesetzlichen Anforderungen

## 7. Sicherheitsanforderungen
- Alle Backups werden verschlüsselt (at-rest und in-transit)
- Backup-Zugriff nur durch autorisierte Rollen
- Backup-Credentials werden separat von Produktionssystemen verwaltet
- Secrets-Backups: Zusätzliche Verschlüsselung mit dediziertem Key

## 8. Metriken
- Backup Success Rate: Ziel ≥ 99%
- Restore Test Success Rate: Ziel ≥ 95%
- RPO-Verletzungen: Ziel 0 pro Quartal
- RTO-Verletzungen: Ziel 0 pro Quartal

## 9. Review-Zyklus
Diese Policy wird halbjährlich, nach jedem Recovery-Ereignis, oder bei signifikanten Infrastrukturänderungen überprüft.
