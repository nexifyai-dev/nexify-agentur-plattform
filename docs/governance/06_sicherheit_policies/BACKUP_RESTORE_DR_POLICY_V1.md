# BACKUP RESTORE DR POLICY V1

> **Status**: VERBINDLICH | **Scope**: NEXIFY_INTERNAL (OPERATIONS)
> **Erstellt**: 2026-06-12 | **Version**: 1.0.0
> **Gültigkeit**: dauerhaft
> **Klassifikation**: intern

---

## 1. Zweck

Diese Policy definiert die verbindlichen Backup-, Restore- und Disaster-Recovery-Regeln für alle geschützten NeXify-Systeme. Sie stellt sicher, dass Datenverluste minimiert und Systeme nach einem Ausfall innerhalb definierter Zeitrahmen wiederhergestellt werden können.

---

## 2. Geltungsbereich

| System | Schutzstufe | Backup-Pflicht | RPO | RTO |
|--------|------------|----------------|-----|-----|
| Brain (SQLite) | KRITISCH | ✅ Täglich + Vor-Change | 24h | 1h |
| agentmemory (SQLite) | KRITISCH | ✅ Täglich | 24h | 1h |
| 9Router (db.json, usage.json) | KRITISCH | ✅ Täglich + Vor-Change | 24h | 30 Min |
| /root/.nexify/ (Governance) | HOCH | ✅ Wöchentlich + Vor-Change | 7d | 2h |
| /workspace/nexify/ (Arbeitsdaten) | HOCH | ✅ Wöchentlich | 7d | 4h |
| Docker-Volumes | HOCH | ✅ Wöchentlich | 7d | 4h |
| VPS-Gesamtsystem | HOCH | ✅ Monatlich | 30d | 8h |
| Cloudflare-Konfiguration | NIEDRIG | ✅ Manuell bei Änderung | — | 24h |

---

## 3. Backup-Strategie

### 3.1 Backup-Intervalle

| Typ | Intervall | Aufbewahrung | Ziel |
|-----|-----------|-------------|------|
| Tägliches Backup | Alle 24h | 7 Tage | Brain, agentmemory, 9Router |
| Vor-Change-Backup | Vor jeder riskanten Änderung | Bis Change abgeschlossen | Betroffenes System |
| Wöchentliches Backup | Sonntag 03:00 | 4 Wochen | Alle Systeme |
| Monatliches Backup | 1. des Monats 03:00 | 6 Monate | VPS-Gesamtsystem |

### 3.2 Backup-Typen

| Typ | Beschreibung | Speicher |
|-----|-------------|----------|
| **Vollbackup** | Komplettes System/Datenbank | /root/.nexify/backups/ + Cloud |
| **Differentiell** | Nur Änderungen seit letztem Vollbackup | Lokal |
| **Config-Export** | Konfiguration als Text/JSON | /root/.nexify/backups/configs/ |
| **SQLite-Dump** | .dump der SQLite-Datenbanken | /root/.nexify/backups/db/ |

### 3.3 Backup-Speicherorte

| Speicher | Pfad | Zweck |
|----------|------|-------|
| Lokal (VPS) | /root/.nexify/backups/ | Primäre Backups |
| Lokal (VPS) | /root/.nexify/backups/configs/ | Config-Exports |
| Lokal (VPS) | /root/.nexify/backups/db/ | SQLite-Dumps |
| Lokal (VPS) | /root/.nexify/backups/changes/ | Vor-Change-Backups |

> **Hinweis**: Sekundärer Backup-Speicher (Cloud) muss noch implementiert werden. Aktuell nur lokale Backups.

---

## 4. RPO/RTO-Ziele

| System | RPO (Datenverlusttoleranz) | RTO (Wiederherstellungszeit) |
|--------|---------------------------|------------------------------|
| Brain | 24 Stunden | 1 Stunde |
| agentmemory | 24 Stunden | 1 Stunde |
| 9Router | 24 Stunden | 30 Minuten |
| Governance-Dateien | 7 Tage | 2 Stunden |
| Arbeitsdaten | 7 Tage | 4 Stunden |
| Docker-Volumes | 7 Tage | 4 Stunden |

---

## 5. Restore-Prozess

### 5.1 Restore-Typen

| Typ | Beschreibung | Verantwortlich |
|-----|-------------|---------------|
| **Point-in-Time** | Wiederherstellung zu bestimmtem Zeitpunkt | Systemmaster |
| **Last-Good-Backup** | Wiederherstellung des letzten gültigen Backups | Systemmaster |
| **Vor-Change-Rollback** | Wiederherstellung des Backups vor der letzten Änderung | Systemmaster |

### 5.2 Restore-Ablauf (für kritisches System)

```
1. BACKUP IDENTIFIZIEREN
   └── Letztes gültiges Backup ermitteln
   └── Backup-Integrität prüfen (SQLite .verify / checksum)

2. SYSTEM OFFLINE NEHMEN (falls nötig)
   └── Dienst stoppen
   └── Zugriff sperren

3. RESTORE DURCHFÜHREN
   └── Backup einspielen
   └── Configs wiederherstellen
   └── Berechtigungen prüfen

4. VERIFIKATION
   └── Datenintegrität prüfen
   └── Funktionalität testen
   └── Health-Check

5. SYSTEM ONLINE NEHMEN
   └── Dienst starten
   └── Monitoring prüfen
   └── Nutzer informieren (falls nötig)
```

---

## 6. Restore-Tests

| Test-Typ | Frequenz | Beschreibung |
|----------|----------|-------------|
| SQLite-Integrität | Bei jedem Backup | .verify auf .dump-Datei |
| Config-Restore | Wöchentlich | Config aus Backup einspielen + prüfen |
| Voll-Restore (Brain) | Monatlich | Kompletten Restore-Prozess durchspielen |
| DR-Übung (VPS) | Vierteljährlich | Komplette Wiederherstellung auf Test-VPS |

---

## 7. Disaster Recovery (DR)

### 7.1 DR-Stufen

| Stufe | Beschreibung | Massnahme |
|-------|-------------|-----------|
| **DR-1** | Einzelnes System ausgefallen | Restore aus lokalem Backup |
| **DR-2** | Mehrere Systeme ausgefallen | Sequentieller Restore nach Priorität |
| **DR-3** | VPS komplett ausgefallen | Neuaufsetzen + Restore aller Systeme |

### 7.2 DR-Prioritäten

```
Priorität 1: 9Router (RTO: 30 Min)
Priorität 2: Brain (RTO: 1h)
Priorität 3: agentmemory (RTO: 1h)
Priorität 4: Cloudflare-Tunnel (RTO: 2h)
Priorität 5: Governance-Dateien (RTO: 2h)
Priorität 6: Docker-Services (RTO: 4h)
Priorität 7: Arbeitsdaten (RTO: 4h)
```

### 7.3 DR-Kommunikation

| Ereignis | Empfänger | Kanal |
|----------|-----------|-------|
| DR-1 Beginn | Systemmaster | Brain + Task |
| DR-2 Beginn | Systemmaster + Pascal | Brain + Task + Direkt |
| DR-3 Beginn | Systemmaster + Pascal | Brain + Task + Direkt |
| Wiederherstellung abgeschlossen | Systemmaster + Pascal | Brain + Task |

---

## 8. Backup-Namenkonvention

```text
{BACKUP_TYP}_{SYSTEM}_{DATUM}_{VERSION}.{EXT}

Beispiele:
full_brain_2026-06-12_v1.sqlite.dump
config_9router_2026-06-12_v1.json
prechange_agentmemory_2026-06-12_CH-20260612-001.sqlite.dump
weekly_workspace_2026-06-12_v1.tar.gz
monthly_vps_2026-06-01_v1.tar.gz
```

---

## 9. Verstöße

| Verstoss | Konsequenz |
|----------|-----------|
| Kritisches System ohne Backup > 24h | Sofort-Backup erzwingen + Eskalation |
| Restore-Test nicht durchgeführt | Nächster Werktag nachholen |
| Backup-Integrität nicht geprüft | Backup gilt als unsicher |
| DR-Plan nicht aktuell | Überarbeitung innerhalb 7 Tagen |

---

## 10. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-12 | Systemmaster | Initiale Fassung |

---

*Ende BACKUP RESTORE DR POLICY V1*
