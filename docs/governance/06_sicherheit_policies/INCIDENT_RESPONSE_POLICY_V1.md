# INCIDENT RESPONSE POLICY V1

> **Status**: VERBINDLICH | **Scope**: NEXIFY_INTERNAL (OPERATIONS)
> **Erstellt**: 2026-06-12 | **Version**: 1.0.0
> **Gültigkeit**: dauerhaft
> **Klassifikation**: intern

---

## 1. Zweck

Diese Policy definiert das verbindliche Vorgehen bei Sicherheitsvorfällen, Ausfällen und Systemstörungen im NeXify-Betrieb. Sie gewährleistet schnelle, strukturierte Reaktion mit klaren Verantwortlichkeiten.

---

## 2. Severity-Stufen (S1–S4)

### S1 — KRITISCH (Vollausfall / Sicherheitsvorfall)

| Merkmal | Beschreibung |
|---------|-------------|
| Definition | Gesamtsystem nicht erreichbar, Datenverlust, aktiver Sicherheitsvorfall |
| Beispiele | 9Router-Ausfall, Brain-Datenverlust, Secret-Kompromittierung, VPS-Hack |
| Reaktionszeit | < 5 Minuten |
| Eskalation | Direkt an Pascal |
| Dokumentation | Post-Mortem innerhalb 24 Stunden |

### S2 — HOCH (Teilsystem-Ausfall / Degradiert)

| Merkmal | Beschreibung |
|---------|-------------|
| Definition | Ein kritisches Teilsystem ausgefallen oder stark degradiert |
| Beispiele | Cloudflare-Tunnel down, agentmemory nicht erreichbar, Docker-Container-Crash |
| Reaktionszeit | < 15 Minuten |
| Eskalation | Systemmaster entscheidet über Pascal-Eskalation |
| Dokumentation | Post-Mortem innerhalb 72 Stunden |

### S3 — MITTEL (Eingeschränkter Betrieb)

| Merkmal | Beschreibung |
|---------|-------------|
| Definition | Nicht-kritisches System gestört, Workaround verfügbar |
| Beispiele | VPS-Website-Deployment fehlgeschlagen, einzelner MCP-Server down |
| Reaktionszeit | < 60 Minuten |
| Eskalation | Systemmaster bearbeitet eigenständig |
| Dokumentation | Incident-Report im Brain |

### S4 — NIEDRIG (Kosmetisch / Nicht funktional)

| Merkmal | Beschreibung |
|---------|-------------|
| Definition | Kosmetische Probleme, Dokumentationslücken, kleine Fehler |
| Beispiele | Veraltete README, falscher Link, kleiner Config-Fehler |
| Reaktionszeit | < 24 Stunden (nächster Werktag) |
| Eskalation | Keine Eskalation nötig |
| Dokumentation | Task im Kanban-Board |

---

## 3. Eskalationspfad

```
S1 ──> Systemmaster (sofort) ──> Pascal (sofort)
         │
S2 ──> Systemmaster (sofort) ──> Pascal (nach Entscheidung)
         │
S3 ──> Systemmaster (innerhalb 60 Min)
         │
S4 ──> Systemmaster (nächster Werktag)
```

### 3.1 Eskalationskriterien

- S1: IMMER sofort eskalieren
- S2: Eskalation an Pascal, wenn:
  - Ausfall > 30 Minuten
  - Datenverlust möglich
  - Sicherheitsvorfall nicht auszuschliessen
  - Systemmaster nicht在手
- S3: Keine Eskalation, es sei denn der Incident dauert > 4 Stunden
- S4: Keine Eskalation

---

## 4. Incident-Response-Runbook (S1/S2)

### Phase 1 — Erkennung & Klassifikation (0–5 Min)

```
1. INCIDENT ERKENNEN
   └── Alarm, Monitoring, User-Report, Selbstentdeckung

2. SEVERITY BESTIMMEN
   └── S1/S2/S3/S4 anhand Kriterien (Abschnitt 2)

3. INCIDENT-ID VERGEBEN
   └── INC-{YYYYMMDD}-{NR}

4. ERSTE-MELDUNG
   └── Schnellstmögliche Benachrichtigung an Pascal
```

### Phase 2 — Containment (5–30 Min)

```
1. SCHADEN BEGRENZEN
   └── System isolieren, Zugriff entziehen, Traffic umleiten

2. BEWEISSICHERUNG (bei Security-Vorfall)
   └── Logs sichern, Snapshots, Timeline dokumentieren

3. WORKAROUND
   └── Falls möglich: Betrieb über Workaround aufrechterhalten

4. KOMMUNIKATION
   └── Pascal: Status + voraussichtliche Dauer
```

### Phase 3 — Beseitigung (30 Min–4 Stunden)

```
1. ROOT-CAUSE-ANALYSE
   └── Was ist genau passiert?
   └── Welche Systeme sind betroffen?
   └── Welche Daten/Secrets sind betroffen?

2. BEHEBUNG
   └── Fix implementieren
   └── Testen (nicht produktiv)
   └── Deployment mit Rollback-Bereitschaft

3. VERIFIKATION
   └── System wieder voll funktionsfähig?
   └── Keine Nebenwirkungen?
   └── Monitoring zeigt Normalbetrieb?
```

### Phase 4 — Wiederherstellung & Abschluss (4–72h)

```
1. RÜCKKEHR ZUM NORMALBETRIEB
   └── Alle Systeme sauber
   └── Temporäre Massnahmen rückgängig
   └── Monitoring bestätigt Stabilität

2. POST-MORTEM ERSTELLEN (S1: 24h, S2: 72h)
   └── Zeitleiste
   └── Root Cause
   └── Auswirkung
   └── Präventionsmassnahmen
   └── Lessons Learned

3. BRAIN-EINTRAG
   └── Incident-Dokumentation in Brain speichern
   └── Kategorie: incident-response
```

---

## 5. Post-Mortem-Pflicht

| Severity | Post-Mortem-Pflicht | Frist |
|----------|--------------------|-------|
| S1 | ZWINGEND | 24 Stunden nach Behebung |
| S2 | ZWINGEND | 72 Stunden nach Behebung |
| S3 | Empfohlen | 7 Tage |
| S4 | Optional | — |

### 5.1 Post-Mortem-Vorlage

```text
Post-Mortem: INC-{YYYYMMDD}-{NR}

Datum:           {YYYY-MM-DD}
Severity:        {S1|S2|S3}
Betroffene Systeme: {Liste}

1. ZEITLEISTE
   {YYYY-MM-DD HH:MM} — Erkennung
   {YYYY-MM-DD HH:MM} — Klassifikation
   {YYYY-MM-DD HH:MM} — Containment
   {YYYY-MM-DD HH:MM} — Root Cause gefunden
   {YYYY-MM-DD HH:MM} — Behebung deployed
   {YYYY-MM-DD HH:MM} — Normalbetrieb bestätigt

2. ROOT CAUSE
   {Technische + menschliche Faktoren}

3. AUSWIRKUNG
   {Downtime, Datenverlust, Kosten, betroffene Nutzer}

4. PRÄVENTIONSMASSNAHMEN
   - {Massnahme 1} → {Verantwortlich} → {Frist}
   - {Massnahme 2} → {Verantwortlich} → {Frist}

5. LESSONS LEARNED
   {Was haben wir gelernt?}
```

---

## 6. Kommunikationsregeln

| Kanal | S1 | S2 | S3 | S4 |
|-------|----|----|----|----|
| Pascal (Direkt) | ✅ Sofort | ✅ Nach Entscheidung | ❌ | ❌ |
| Brain-Eintrag | ✅ | ✅ | ✅ | Optional |
| Kanban-Task | ✅ | ✅ | ✅ | ✅ |

---

## 7. Verstöße

| Verstoss | Konsequenz |
|----------|-----------|
| S1/S2 nicht innerhalb 24h/72h dokumentiert | Eskalation an Pascal |
| Post-Mortem unvollständig | Nachbesserung erforderlich |
| Eskalationspfad nicht eingehalten | Review + Prozess-Anpassung |

---

## 8. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-12 | Systemmaster | Initiale Fassung |

---

*Ende INCIDENT RESPONSE POLICY V1*
