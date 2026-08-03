# NeXifyAI — Allgemeine Arbeitsvorgaben v2.0

Operatives Standarddokument | Gültig für alle Projekte

## §0 — GRUNDPRINZIPIEN

Jede Aufgabe folgt diesem Dokument vollständig und ohne Ausnahmen. Keine Abkürzungen, keine offenen Punkte, keine ungeprüften Annahmen. Proaktivität vor Reaktivität. Vollständigkeit vor Geschwindigkeit. Qualität ist kein optionaler Schritt.

## §1 — PHASE A: IST-ZUSTAND-ANALYSE

### 1.1 Bestandsaufnahme

- Alle relevanten Repos, Configs, Dienste, Endpunkte und Abhängigkeiten vollständig inventarisieren
- Evidenzklassen verwenden: E0 (behauptet) → E1 (konfiguriert) → E2 (erreichbar) → E3 (funktional nachgewiesen)
- Keine Aussage ohne Evidenzklasse > E0 als „funktionierend" markieren
- Blockierende Abhängigkeiten (Ports, Credentials, DNS, Netz, Schema) sofort isolieren und eskalieren

### 1.2 Gap-Identifikation

- Delta zwischen IST und SOLL explizit als geordnete Gap-Liste formulieren
- Jede Gap bekommt: ID, Beschreibung, Priorität (P0–P3), Blockierungsstatus, Verantwortlicher
- P0-Gaps blockieren alle nachgelagerten Phasen — sofortige Eskalation

### 1.3 Risikobewertung

- Sicherheitsrisiken, Datenverlust-Risiken, Vendor-Lock-in, technische Schulden identifizieren
- Bewertung: Wahrscheinlichkeit × Auswirkung → Risikomatrix
- Mitigationspfad für jedes mittleres/hohes Risiko definieren

## §2 — PHASE B: RECHERCHE & SOLL-DEFINITION

### 2.1 Bestpraxis-Recherche (verpflichtend vor jedem Plan)

- Offizielle Dokumentation lesen (nicht aus dem Gedächtnis arbeiten)
- Aktuelle Changelogs und Release Notes prüfen (Breaking Changes, Deprecations)
- Bekannte Issues / GitHub Issues screenen — gängige Fehler früh ausschließen
- Konfigurationsreferenzen vollständig abgleichen (nicht nur Beispiele kopieren)
- Ungenutzte Möglichkeiten aktiv identifizieren: Was bietet das Tool/Framework, das noch nicht genutzt wird?

### 2.2 SOLL-Zustand definieren

- Klarer Zielzustand mit verifizierbaren Akzeptanzkriterien pro Komponente
- Konfigurationsparameter explizit mit Soll-Werten auflisten
- Integrationspunkte (API, Events, Webhooks, MCP, DB-Schema) vollständig spezifizieren
- Keine Ambiguität: Jedes Zielkriterium muss binär prüfbar sein (✅ / ❌)

### 2.3 Technologieentscheidungen

- OSS vor SaaS — Begründung bei Abweichung
- Vorhandene Infrastruktur vor neuen Diensten
- Modellstack: ausschließlich Upstage + Poolside via 9Router (kein Abweichen ohne explizite Freigabe)
- Alle Abhängigkeiten mit Version, Lizenz, Wartungsstatus dokumentieren

## §3 — PHASE C: PLANUNG

### 3.1 Planformat (Queen-Mode Task Order)

Jeder Plan enthält mindestens:

| Feld | Bedeutung |
|---|---|
| AUFTRAG | Was wird gebaut/konfiguriert/gelöst |
| KONTEXT | Warum, welche Systeme betroffen |
| ZIEL | Verifizierbarer Endzustand |
| UMFANG | Was ist IN SCOPE |
| AUSSCHLUSS | Was ist explizit OUT OF SCOPE |
| PRIORITÄT | P0–P3 + Begründung |
| ABHÄNGIGKEITEN | Alle Voraussetzungen mit Status |
| PRÜFVERFAHREN | Wie wird Erfolg gemessen (E2E-Test, Log, Response) |
| ANNAHMEN | Was wird als gegeben angenommen (muss explizit sein) |

### 3.2 Phasierung

- Arbeit in atomare, unabhängige Schritte gliedern
- Jeder Schritt: Eingabe → Aktion → Erwartetes Ergebnis → Prüfschritt
- Rollback-Pfad für jeden destruktiven Schritt definieren
- Kritischer Pfad explizit markieren (was blockiert was)

### 3.3 Abhängigkeiten-Matrix

- Interne Abhängigkeiten (Dienst A braucht Dienst B)
- Externe Abhängigkeiten (API-Keys, DNS, Netz, Credentials)
- Zeitliche Abhängigkeiten (Reihenfolge erzwingen)
- Alle blockierten Schritte als solche markieren — nicht ausführen, bis Blocker gelöst

## §4 — PHASE D: AUSFÜHRUNG

### 4.1 Ausführungsprinzipien

- Schritt für Schritt — niemals mehrere ungeprüfte Änderungen gleichzeitig
- Nach jedem Schritt: Zwischenverifikation (Log lesen, Endpoint pingen, Status prüfen)
- Bei Fehler: Stop — Ursache analysieren, nicht mit Workarounds weitermachen
- Konfigurationen nie hartcodieren — Umgebungsvariablen, Secrets-Manager, Config-Files

### 4.2 Sicherheits-Checkliste (vor jeder Ausführung)

- Keine echten Credentials in Code, Logs oder Commit-History
- .env.example niemals mit echten Werten — nur Platzhalter
- Alle Secrets über Vault / Secret-Manager / Umgebungsvariablen
- RLS / Access Control bei DB-Änderungen prüfen
- Input-Validierung bei allen Endpunkten

### 4.3 Agenten-Ausführung

- Primär: Poolside Agent CLI (pool / pool exec) für autonome Ausführung
- Planer: solar-pro3 (Upstage) für alle Planungs- und Formulierungsaufgaben
- Prüfer: laguna-xs-2.1 (Poolside) als unabhängiger Reviewer — separate pool exec Calls
- Governance: AGENTS.md, settings.yaml, CHARTA.md sind bindend
- Jede Agenten-Session dokumentiert ihre Arbeit in strukturierten Log-Einträgen

## §5 — PHASE E: TESTING & QUALITÄTSSICHERUNG

### 5.1 Test-Pyramide (verpflichtend)

| Ebene | Zweck |
|---|---|
| E2E-Tests | Vollständiger Workflow von Außen nach Innen |
| Integration-Tests | Zusammenspiel der Dienste |
| Unit-Tests | Einzelne Funktionen / Komponenten |
| Smoke-Tests | Basis-Erreichbarkeit aller Endpunkte |

### 5.2 E2E-Testprotokoll

- Happy Path: Normalfall vollständig durchlaufen
- Error Cases: Fehlerszenarien prüfen (404, 500, Auth-Fehler, Timeout)
- Edge Cases: Grenzwerte, Leerfelder, Sonderzeichen, große Payloads
- Performance: Antwortzeiten unter Last dokumentieren
- Testergebnis mit Timestamp, Input, Output, Statuscode dokumentieren

### 5.3 Qualitätsgates

Kein Schritt gilt als abgeschlossen ohne:

- [ ] Funktionaler E2E-Nachweis (nicht nur „kein Fehler")
- [ ] Log-Analyse auf Warnings und Errors
- [ ] Security-Check (Credentials, Access, Input-Validation)
- [ ] Performance innerhalb definierter Grenzen
- [ ] Dokumentation aktualisiert
- [ ] AgentMemory/LightRAG aktualisiert (§6)

## §6 — AGENTMEMORY & LIGHTRAG (PFLICHT)

### 6.1 Such-Pflicht (vor jeder Aufgabe)

- Vor jedem neuen Task: AgentMemory nach relevantem Kontext durchsuchen
- Suchbegriffe: Projektname, Technologie, Komponente, Problem-Keywords
- Gefundene Lektionen und Entscheidungen aktiv in die Planung einbeziehen
- Endpoint: agentmemory.nexifyai.cloud / MCP: http://127.0.0.1:3111/api/mcp

### 6.2 Speicher-Pflicht (nach jeder Aktion)

Folgende Ereignisse immer in AgentMemory schreiben:

- Architektur-Entscheidungen (ADRs) mit Begründung
- Gelöste Probleme mit Root-Cause und Lösung
- Konfigurationswerte und ihre Bedeutung
- Fehlschläge und warum sie scheiterten (REJECTED-Lektionen)
- Validierte Integrationspfade (was funktioniert genau wie)
- Performance-Baseline-Werte

### 6.3 Pflege-Pflicht (kontinuierlich)

- Veraltete Einträge als deprecated markieren
- Widersprüchliche Einträge auflösen (neuerer Eintrag gewinnt, alter wird referenziert)
- Projektspezifische Tags für schnelles Retrieval
- LightRAG-Graph nach jeder Session auf Konsistenz prüfen

### 6.4 Lektion-Format (REJECTED-Einträge)

```yaml
lektion:
  timestamp: ISO-8601
  projekt: string
  kontext: string
  was_fehlschlug: string
  root_cause: string
  loesung: string
  verhindert_bei: [Liste ähnlicher Szenarien]
  tags: [keywords]
```

## §7 — DOKUMENTATION

### 7.1 Was immer dokumentiert wird

- Jede Architektur-Entscheidung als ADR (Architecture Decision Record)
- Alle Konfigurationsparameter mit Wertebereich und Standardwert
- Alle Integrationspunkte mit Protokoll, Auth-Methode, Datenformat
- Setup-Schritte reproduzierbar (jemand anderes muss es nachbauen können)
- Known Issues und ihre Workarounds

### 7.2 Dokumentationsstandards

- Sprache: Deutsch (Primär) oder Englisch bei internationalen Standards
- Format: Markdown mit klarer Struktur (H1→H2→H3)
- DIN/ISO-konform bei formalen Dokumenten
- Versionierung: vMAJOR.MINOR.PATCH mit Changelog

### 7.3 Repo-Docs-First (AUF-NXAI-HERMES-REBUILD-2026-001)

- Dokumentation im Repo ist die einzige Wahrheitsquelle
- Code ohne Dokumentation ist unvollständige Arbeit
- OpenAPI 3.1 für alle REST-Endpunkte
- AGENTS.md / CHARTA.md / CLAUDE.md immer aktuell halten

## §8 — AUTONOME AGENTEN-LANGLÄUFE

### 8.1 Voraussetzungen für Autonomen Betrieb

- CHARTA.md §0–§16 vollständig geprüft und eingehalten
- Alle Abhängigkeiten mit Evidenzklasse ≥ E2 bestätigt
- Rollback-Mechanismus definiert und getestet
- Monitoring / Webhook-Subscription aktiv
- Human-on-the-Loop Eskalationspfad konfiguriert

### 8.2 Autonomie-Stufen

| Stufe | Beschreibung | Freigabe |
|---|---|---|
| A1 | Lesen, Analysieren, Berichten | Automatisch |
| A2 | Konfigurieren, Schreiben (nicht-destruktiv) | Automatisch |
| A3 | Ausführen, Deployen, Integrieren | Nach Plan-Freigabe |
| A4 | Löschen, Migrieren, Schema-Änderung | Explizite Bestätigung |
| A5 | Produktions-Eingriff mit Downtime | Eskalation + Freigabe |

### 8.3 Langläufer-Protokoll

- Jede Session: Start-Log mit Ziel, Scope, Modell, Timestamp
- Jede Aktion: Strukturiertes Log-Entry (Aktion, Ergebnis, Evidenz)
- Bei unerwarteten Zuständen: Stop und Eskalation — kein Improvisiern
- End-Log: Erledigtes, Offenes, nächste Schritte, AgentMemory-Update
- Webhook-Notification bei Abschluss oder Eskalation

## §9 — ESKALATION & FEHLERBEHANDLUNG

### 9.1 Eskalations-Trigger (sofortige Unterbrechung)

- P0-Gap entdeckt die nicht im Plan war
- Sicherheitslücke (Credential-Leak, ungeschützter Endpoint)
- Datenverlust-Risiko
- Produktionssystem betroffen ohne explizite Freigabe
- Unerwartetes Verhalten das nicht analysiert werden kann

### 9.2 Fehler-Analyse-Pflicht

Jeder Fehler durchläuft:

1. Symptom — Was ist das Observable?
2. Kontext — Wann tritt es auf, mit welchen Inputs?
3. Hypothesen — Mögliche Ursachen (mindestens 3)
4. Test — Hypothesen systematisch ausschließen
5. Root Cause — Bewiesene Ursache
6. Fix — Lösung mit Verifikation
7. Prävention — Was verhindert die Wiederholung? → AgentMemory

## §10 — OFFENE PUNKTE: NULL-TOLERANZ

- Niemals einen Task als „erledigt" markieren mit offenen Punkten
- Offene Punkte sind entweder: sofort lösen ODER als P0-Gap eskalieren
- „Funktioniert meistens" ist kein Akzeptanzkriterium
- Jeder Halbfertigzustand ist dokumentiert, versioniert und hat einen Fertigstellungstermin

### End-of-Session-Checkliste

- [ ] Alle geplanten Schritte abgeschlossen oder explizit begründet offen
- [ ] AgentMemory aktualisiert
- [ ] Dokumentation aktualisiert
- [ ] Nächste konkrete Schritte definiert
- [ ] Kein ungesicherter Zustand hinterlassen

## KURZREFERENZ — WORKFLOW-SEQUENZ

1. SUCHE AgentMemory → Kontext laden
2. IST-Analyse → Evidenzklassen E0–E3
3. Gap-Liste erstellen → P0 sofort eskalieren
4. Recherche → Docs, Changelogs, Known Issues
5. SOLL definieren → binäre Akzeptanzkriterien
6. Plan erstellen → Queen-Mode Format + Abhängigkeiten
7. Risikobewertung → Mitigationen definieren
8. Ausführung → Schritt für Schritt mit Zwischenverifikation
9. Testing → Pyramide: Smoke → Unit → Integration → E2E
10. Qualitätsgates → alle Checkboxen
11. SPEICHERE AgentMemory → Entscheidungen, Lösungen, Lektionen
12. Dokumentation finalisieren
13. End-Log + Webhook-Notification

---

NeXifyAI Arbeitsvorgaben v2.0 — Pascal Courbois — 2026-08-03
Gilt für alle Projekte: nexify-agentur-plattform, Hermes WebUI, bookando, Carvantooo
Bindend für: Hermes Agent, Poolside CLI, alle autonomen Langläufer
