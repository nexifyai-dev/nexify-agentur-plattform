# CHANGE MANAGEMENT POLICY V1

> **Status**: VERBINDLICH | **Scope**: NEXIFY_INTERNAL (OPERATIONS)
> **Erstellt**: 2026-06-12 | **Version**: 1.0.0
> **Gültigkeit**: dauerhaft
> **Klassifikation**: intern

---

## 1. Zweck

Diese Policy definiert den verbindlichen Change-Management-Prozess für alle Änderungen an NeXify-Systemen. Sie stellt sicher, dass jede Änderung dokumentiert, bewertet, genehmigt und rückverfolgbar ist.

---

## 2. Geltungsbereich

| Bereich | Betroffene Systeme |
|---------|-------------------|
| Infrastruktur | 9Router, Brain, agentmemory, Hermes, Cloudflare, Docker-Hosts |
| Datenbanken | PostgreSQL, Redis, SQLite-Daten |
| Konfiguration | env-Dateien, docker-compose, settings.json, Traefik-Labels |
| Secrets | API-Keys, Token, Zertifikate, OAuth-Credentials |
| Code | Governance-Dokumente, SOPs, Policies, Regelwerke |
| Deployment | VPS, Docker-Container, Cloudflare-Tunnel, Vercel |

---

## 3. Change-Typen

| Typ | Beschreibung | Beispiele | Risiko |
|-----|-------------|-----------|--------|
| **Standard** | Geringes Risiko, dokumentierter Standardpfad | Evidence schreiben, README aktualisieren, neue Policies | LOW |
| **Normal** | Mittleres Risiko, erfordert Review | Config-Änderung mit Rollback, Plugin-Installation, Docker-Neustart | MEDIUM |
| **Emergency** | Hohes Risiko, sofortige Massnahme nötig | Incident-Response, Security-Patch, Ausfallbehebung | HIGH/CRITICAL |

---

## 4. Change-Prozess

### 4.1 Standard-Change

```
1. CHANGE ERKENNEN
   └── Was muss geändert werden?

2. TYP BESTIMMEN
   └── Standard / Normal / Emergency

3. DOKUMENTIEREN
   └── Change-ID: CH-{YYYYMMDD}-{NR}
   └── Beschreibung, Grund, betroffene Systeme

4. DURCHFÜHREN
   └── Änderung gemäss Dokumentation umsetzen

5. VERIFIZIEREN
   └── Health-Check, Smoke-Test

6. ABSCHLIESSEN
   └── Dokumentation finalisieren, Brain-Eintrag
```

### 4.2 Normal-Change

```
1. CHANGE-ID BEANTRAGEN
   └── CH-{YYYYMMDD}-{NR}

2. CHANGE-PLAN ERSTELLEN
   └── Beschreibung, Risikobewertung, Rollback-Plan
   └── Backup-Pfad, Config-Export, Test-Schritte

3. CAB-REVIEW (Change Advisory Board)
   └── Systemmaster prüft Plan
   └── Risikobewertung bestätigen oder ablehnen

4. GENEHMIGUNG
   └── CAB genehmigt / lehnt ab / fordert Nachbesserung

5. DURCHFÜHRUNG
   └── Innerhalb des genehmigten Zeitfensters
   └── Rollback-Plan bereithalten

6. POST-CHANGE-REVIEW
   └── Health-Check, Metriken, unerwartete Effekte

7. ABSCHLUSS
   └── Dokumentation in Brain speichern
```

### 4.3 Emergency-Change

```
1. NOTFALL ERKENNEN
   └── Incident vorliegend (S1/S2)

2. CHANGE-ID BEANTRAGEN
   └── CH-E-{YYYYMMDD}-{NR}

3. MASSNAHME DIREKT DURCHFÜHREN
   └── Kein CAB-Review erforderlich
   └── ABER: minimale Dokumentation (Was + Warum)

4. INNERHALB 24H NACHDOKUMENTIEREN
   └── Vollständige Change-Dokumentation
   └── Retrospektive: Warum Emergency nötig?
   └── Prävention für Zukunft

5. POST-MORTEM (INNERHALB 72H)
   └── Analyse + Präventionsmassnahmen
```

---

## 5. CAB — Change Advisory Board

| Rolle | Verantwortung | Person/Agent |
|-------|--------------|-------------|
| Vorsitz | Genehmigung Normal- + Emergency-Changes | Systemmaster |
| Prüfer | Technische Prüfung des Change-Plans | Systemmaster |
| Dokumentar | Change-Dokumentation + Brain-Entry | Systemmaster |
| Stellvertreter | Vertretung bei Abwesenheit | Pascal |

### 5.1 CAB-Entscheidungen

| Entscheidung | Bedeutung |
|-------------|-----------|
| APPROVED | Change darf durchgeführt werden |
| APPROVED-CONDITIONAL | Change mit Auflagen genehmigt |
| DENIED | Change abgelehnt mit Begründung |
| DEFERRED | Change auf später verschoben |

---

## 6. Change-Dokumentation (Vorlage)

```text
Change-ID:       CH-{YYYYMMDD}-{NR}
Typ:             {STANDARD|NORMAL|EMERGENCY}
Betroffenes System: {Systembezeichnung}
Kurzbeschreibung: {max 2 Sätze}

Begründung:
{Warum dieser Change notwendig ist}

Risikobewertung:
- Risiko: {LOW|MEDIUM|HIGH|CRITICAL}
- Begründung: {Risikobegründung}

Backup-Pfad:     {Pfad/ID}
Config-Export:   {Pfad/ID}
Rollback-Plan:   {Pfad/ID}

Genehmigt von:   {Entscheider}
Datum:           {YYYY-MM-DD}
Status:          {BEANTRAGT|GENEHMIGT|DURCHGEFUEHRT|ROLLBACK|ABGESCHLOSSEN}
```

---

## 7. Rollback-Regeln

| Regel | Beschreibung |
|-------|-------------|
| **R1** | Jeder Normal- + Emergency-Change MUSS einen dokumentierten Rollback-Plan haben |
| **R2** | Rollback löst die Änderung vollständig auf den Zustand VOR dem Change zurück |
| **R3** | Rollback muss innerhalb von 15 Minuten ausführbar sein |
| **R4** | Nach Rollback: Health-Check + Incident-Erfassung pflichtig |
| **R5** | Rollback ohne Dokumentation ist nicht erlaubt (Ausnahme: akute Vollausfall-Gefahr) |

---

## 8. Change-Kalender

- Standard-Changes: jederzeit, ohne Einschränkung
- Normal-Changes: Mo–Fr, 08:00–16:00 (ausserhalb nur mit CAB-Freigabe)
- Emergency-Changes: jederzeit, mit 24h-Nachdokumentation
- Wartungsfenster: Mittwoch 10:00–12:00 (geplante Normal-Changes)

---

## 9. Verstöße

| Verstoss | Konsequenz |
|----------|-----------|
| Change ohne Dokumentation durchgeführt | Review + Rollback-Prüfung |
| Emergency-Change nicht nachdokumentiert | Eskalation an Pascal |
| Rollback-Plan nicht erstellt | Change gilt als nicht genehmigt |
| CAB-Entscheidung umgangen | Wiederholung: Sicherheitsverwarnung |

---

## 10. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-12 | Systemmaster | Initiale Fassung |

---

*Ende CHANGE MANAGEMENT POLICY V1*
