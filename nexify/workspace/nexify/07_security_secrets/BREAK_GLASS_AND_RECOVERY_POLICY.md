# BREAK_GLASS_AND_RECOVERY_POLICY

**Stand:** 2026-06-11  
**Version:** 1.0  
**Status:** Policy (in Kraft)

> **WICHTIG:** Dieses Dokument enthält NUR Referenzen/Platzhalter, KEINE Secret-Werte.

---

## 1. Grundsätze

Die Break-Glass-Prozedur erlaubt den temporären Zugriff auf Secrets **ausserhalb der normalen Autorisierungskette** für zwingende Notfälle. Jeder Break-Glass-Vorgang wird lückenlos auditiert und nachbereitet.

### Prinzipien

1. **Letztes Mittel** – Break-Glass nur wenn alle normalen Wege ausgeschöpft sind
2. **Vier-Augen-Prinzip** – Mindestens zwei autorisierte Personen für Aktivierung
3. **Vollständige Auditierung** – Jeder Zugriff wird protokolliert
4. **Zeitlich begrenzt** – Zugriff automatisch nach 60 Minuten beendet
5. **Nachbereitungspflicht** – Root-Cause-Analyse und Präventionsmassnahmen

---

## 2. Wann Break-Glass aktivieren?

### Berechtigte Auslöser

| Szenario | Beschreibung | Beispiel |
|:---------|:-------------|:---------|
| **System-Ausfall** | Produktivsystem läuft nicht, weil Secret-Management nicht erreichbar ist | Infisical-Down, kein Dienst kommt hoch |
| **Rotation-Fehler** | Rotiertes Secret funktioniert nicht, Rollback fehlgeschlagen | API-Key revoket bevor neuer funktioniert |
| **Security-Vorfall** | Akute Kompromittierung erfordert sofortigen Austausch | Secret geleakt, muss sofort gesperrt werden |
| **Dringender Wartungsfall** | Wartungsfenster kann wegen Secret-Fehler nicht starten | CI/CD baut mit falschem Secret |

### Nicht berechtigte Auslöser

| Szenario | Grund |
|:---------|:------|
| Bequemlichkeit | Normaler Zugriffsweg wäre zu umständlich |
| Vergessenes Secret | Secret wurde nicht dokumentiert |
| Test ohne Berechtigung | Testumgebung hat keine eigenen Secrets |
| Zeitdruck | Kein Planungsfehler rechtfertigt Sicherheitslücke |

---

## 3. Wer darf Break-Glass aktivieren?

### Berechtigungsmatrix

| Rolle | Darf aktivieren? | Darf autorisieren? | Darf ausführen? |
|:------|:-----------------|:-------------------|:----------------|
| Security Engineer | ✓ | ✓ | ✓ |
| DevOps Engineer | ✓ | ✗ | ✓ |
| System-Admin | ✓ | ✗ | ✓ |
| Developer | ⚠️ (nur mit Autorisierung) | ✗ | ✓ |
| Externer Consultant | ✗ | ✗ | ✗ |
| CI/CD-Agent | ✗ | ✗ | ✗ |

**Mindestanforderung:** 2 Personen (eine autorisierend, eine ausführend).

### Autorisierungskette

```
Antragsteller (z.B. DevOps) → Security Engineer (Autorisierung) → Ausführung
                       ↓
              Security-Team benachrichtigt
                       ↓
              Audit-Log-Eintrag automatisch
```

Bei Nichtverfügbarkeit des Security Engineers: Eskalation an CTO/Infrastruktur-Lead.

---

## 4. Break-Glass-Prozedur (Schritt-für-Schritt)

### Phase 1: Aktivierung

```
[ 1 ] Notfall feststellen (Secret nicht verfügbar / System ausgefallen)
[ 2 ] Security Engineer benachrichtigen (z.B. via Pager/Slack)
[ 3 ] Break-Ground-Regel prüfen: Ist es ein berechtigter Auslöser?
[ 4 ] Formular ausfüllen (siehe Anhang A):
      - Secret-ID: ____________
      - Grund: ____________
      - Antragsteller: ____________
      - Autorisiert durch: ____________
      - Zeitstempel: ____________
[ 5 ] Break-Glass-Skript ausführen:
      $ ./scripts/break-glass.sh <SECRET_ID>
[ 6 ] Secret wird für 60 Minuten freigegeben
[ 7 ] Audit-Log-Eintrag wird automatisch generiert
[ 8 ] Security-Team erhält Benachrichtigung
```

### Phase 2: Zugriff

```
[ 1 ] Secret aus temporärem Speicher abrufen
[ 2 ] Nur das benötigte Secret abrufen (keine Bulk-Abfragen)
[ 3 ] Zugriff protokollieren (welcher Dienst, welcher Befehl)
[ 4 ] Kritische Aktion durchführen (Rotation / Wiederherstellung)
[ 5 ] Nach Abschluss: Zugriff sofort beenden
```

### Phase 3: Automatische Sperrung

```
Nach 60 Minuten (oder manuell früher):
[ 1 ] Zugriffs-Token automatisch widerrufen
[ 2 ] Secret-Wert aus temporärem Cache gelöscht
[ 3 ] Audit-Log ABGESCHLOSSEN-Eintrag
[ 4 ] Security-Team: "Break-Glass beendet"-Benachrichtigung
```

---

## 5. Wiederherstellung (Recovery)

### Secret-Wiederherstellung aus Backup

```
[ 1 ] Backup-Repository öffnen (verschlüsselt)
[ 2 ] Gewünschtes Secret aus Backup extrahieren
      $ ./scripts/restore-secret.sh <SECRET_ID> --snapshot <DATUM>
[ 3 ] Secret in Infisical wiederherstellen
[ 4 ] Dienste neustarten / Konfiguration neu laden
[ 5 ] Funktionstest durchführen
[ 6 ] Backup-Integrität prüfen
```

### Vollständige Systemwiederherstellung

```
[ 1 ] Infisical-DB-Backup einspielen
      $ ./scripts/restore-infisical.sh --backup <BACKUP_FILE>
[ 2 ] Infisical-Dienst neustarten
[ 3 ] Alle Secrets prüfen (Automatisierter Check)
[ 4 ] Dienste nacheinander neustarten
[ 5 ] Vollständigen Integrationstest durchführen
[ 6 ] Monitoring auf Fehler prüfen
```

---

## 6. Audit-Log-Pflicht

### Pflichtfelder pro Break-Glass-Ereignis

| Feld | Beispiel |
|:-----|:---------|
| event_id | BG-20260611-001 |
| timestamp | 2026-06-11T14:30:00Z |
| secret_id | SEC-004 |
| secret_name | NEXIFY_ROUTER_API_KEY |
| applicant | devops@nexify.local |
| authorizer | security@nexify.local |
| reason | "Router API Key nach DB-Migration rotiert, neuer Key funktioniert nicht" |
| action | read + rotate |
| duration_minutes | 45 |
| status | completed |
| after_review | pending |

### Audit-Log-Aufbewahrung

| Stufe | Dauer | Format |
|:------|:------|:-------|
| Aktiv | 90 Tage | Infisical + Syslog |
| Archiv | 3 Jahre | Verschlüsseltes S3-Bucket |
| Compliance | 10 Jahre | WORM-Speicher (Write Once Read Many) |

---

## 7. Nachbereitung (Post-Break-Glass)

### Pflichtprogramm innerhalb 24h

```
[  ] Root-Cause-Analyse (RCA) durchführen
     - Warum war Break-Glass nötig?
     - Hätte es verhindert werden können?
     - Welche Präventionsmassnahmen gibt es?

[  ] Wiederholung verhindern
     - Automatisierung verbessern?
     - Monitoring erweitern?
     - Dokumentation aktualisieren?

[  ] Berechtigungen prüfen
     - Waren die Break-Glass-Berechtigten noch aktuell?
     - Wurde das Vier-Augen-Prinzip eingehalten?

[  ] Policy-Update (falls nötig)
     - Soll die Policy angepasst werden?
     - Soll das Skript verbessert werden?

[  ] Report erstellen und an CTO senden
```

### Eskalationsmatrix bei Policy-Verstoss

| Verstoss | Massnahme |
|:---------|:----------|
| Break-Glass ohne Autorisierung | Meldung an CTO, Zugriffsentzug |
| Break-Glass ohne Grund | Formelle Verwarnung |
| Secret-Werte weitergegeben | Sicherheitsvorfall – Incident-Response |
| Audit-Log manipuliert | Sicherheitsvorfall – sofortige Sperrung |

---

## 8. Anhang A: Break-Glass-Formular (Template)

```text
┌─────────────────────────────────────────────────────────────────┐
│                    BREAK GLASS REQUEST FORM                      │
├─────────────────────────────────────────────────────────────────┤
│ Datum: _______________   Uhrzeit: _______________                │
│                                                                  │
│ Secret-ID: _______________   Secret-Name: _______________        │
│                                                                  │
│ Grund des Notfalls:                                               │
│ ______________________________________________________________  │
│ ______________________________________________________________  │
│                                                                  │
│ Betroffenes System: _______________                              │
│                                                                  │
│ Antragsteller: _______________   Unterschrift: _______________   │
│ Autorisiert durch: _______________  Unterschrift: _______________│
│                                                                  │
│ Zugriffszeitraum: von _________ bis _________                    │
│                                                                  │
│ Nachbereitung abgeschlossen: [ ] Ja  [ ] Nein  Datum: _______   │
│                                                                  │
│ CTO-Info: [ ] Ja  Datum: _______________                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Anhang B: Wiederherstellungs-Testplan

| Intervall | Test | Erfolgskriterium |
|:----------|:-----|:------------------|
| Monatlich | Backup-Restore eines einzelnen Secrets | Secret-Wert korrekt wiederhergestellt |
| Vierteljährlich | Break-Glass-Prozedur (trocken) | Vollständiger Durchlauf < 15 Minuten |
| Vierteljährlich | Vollständige Systemwiederherstellung | Infisical läuft nach < 30 Minuten |
| Jährlich | Security-Audit aller Break-Glass-Ereignisse | 100% der Ereignisse nachbereitet |

---

**Policy erstellt von:** NeXify Security Engineering  
**Nächstes Review:** 2026-07-11  
**Letzte Überprüfung:** 2026-06-11
