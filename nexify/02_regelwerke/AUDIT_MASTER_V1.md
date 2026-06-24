# AUDIT_MASTER V1 — Audit-System Definition

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja (Meta-Audit)

---

## 1. Zweck

Dieses Dokument definiert das **vollständige Audit-System** für das NeXify-Ökosystem.
Es legt Audit-Typen, Intervalle, Verantwortlichkeiten und das obligatorische
Audit-Template fest.

> **Leitsatz:** Was nicht auditiert ist, ist nicht vertrauenswürdig.
> Jede Änderung löst ein Audit aus.

---

## 2. Audit-Typen

### 2.1 Übersicht

| # | Audit-Typ | Fokus | Kritikalität | Automatisierbar |
|---|-----------|-------|-------------|-----------------|
| 01 | Regelwerk | Compliance aller Regelwerke | 🔴 CRITICAL | ✅ Teilweise |
| 02 | Skill | Skill-Qualität, -Aktualität, -Sicherheit | 🔴 CRITICAL | ✅ Ja |
| 03 | Prompt | Prompt-Qualität, -Sicherheit, -Effektivität | 🟡 HIGH | ✅ Ja |
| 04 | MCP | MCP-Konfiguration, -Verbindungen, -Sicherheit | 🟡 HIGH | ✅ Ja |
| 05 | Tool/CLI | Tool-Konfiguration, -Zugriff, -Sicherheit | 🟡 HIGH | ✅ Ja |
| 06 | UI | Benutzeroberfläche, -Erfahrung, -Sicherheit | 🟢 MEDIUM | ❌ Nein |
| 07 | Security | CVEs, Secrets, Injection, XSS, Auth | 🔴 CRITICAL | ✅ Ja |
| 08 | DNS | DNS-Konfiguration, -Routing, -Sicherheit | 🟡 HIGH | ✅ Ja |
| 09 | Memory | Memory-Integrität, -Vollständigkeit, -Konsistenz | 🔴 CRITICAL | ✅ Ja |
| 10 | Agentenketten | Agent-Kommunikation, -Sequenzen, -Fehler | 🟡 HIGH | ✅ Teilweise |
| 11 | DONE | DONE-Kriterien-Prüfung (Complete Check) | 🔴 CRITICAL | ✅ Ja |

### 2.2 Detaildefinition pro Audit-Typ

#### 01 — Regelwerk-Audit
**Prüft:** Alle aktiven Regelwerke auf Vollständigkeit, Widerspruchsfreiheit und Aktualität.
**Prüfkriterien:**
- Existieren alle im REGELWERKS_INDEX aufgeführten Dateien?
- Sind Kopfblöcke (Titel, Status, Version, Datum) vorhanden?
- Gibt es undokumentierte Konflikte? (→ RULE_CONFLICT_REGISTER)
- Sind Versionen aktuell?
- Wurden Regelwerke seit dem letzten Audit geändert?

**Intervall:** Alle 7 Tage oder bei jeder Regelwerksänderung

#### 02 — Skill-Audit
**Prüft:** Jeden Skill in `/workspace/nexify/05_skills/` auf Qualität und Sicherheit.
**Prüfkriterien:**
- Skill-Dokumentation vorhanden und vollständig?
- Input/Output klar definiert?
- Sicherheitsrisiken analysiert?
- Tests vorhanden? Coverage ≥ 80%?
- Letztes Audit nicht überschritten?

**Intervall:** Alle 14 Tage oder bei jeder Skill-Änderung

#### 03 — Prompt-Audit
**Prüft:** Prompt-Qualität, Sicherheit und Effektivität.
**Prüfkriterien:**
- Prompt enthält keine Injection-Risiken?
- Prompt ist klar, eindeutig, testbar?
- Output-Validierung definiert?
- Prompt-Versionierung vorhanden?

**Intervall:** Alle 30 Tage oder bei jeder Prompt-Änderung

#### 04 — MCP-Audit
**Prüft:** MCP-Konfigurationen und Verbindungen.
**Prüfkriterien:**
- Alle MCP-Verbindungen sind aktiv und antworten?
- Autorisierung korrekt konfiguriert?
- Rate-Limits definiert?
- Fehlerbehandlung vorhanden?
- Keine offenen Security-Issues?

**Intervall:** Alle 7 Tage oder bei jeder MCP-Änderung

#### 05 — Tool/CLI-Audit
**Prüft:** Verfügbarkeit, Konfiguration und Sicherheit der Tools/CLIs.
**Prüfkriterien:**
- Tools sind installiert und in der erwarteten Version?
- Berechtigungen korrekt gesetzt?
- Keine unsicheren Konfigurationen?
- Logging vorhanden?

**Intervall:** Alle 30 Tage oder bei Tool-Änderungen

#### 06 — UI-Audit
**Prüft:** Benutzeroberflächen auf Funktionalität und Sicherheit.
**Prüfkriterien:**
- Alle UI-Komponenten laden und funktionieren?
- Keine XSS-Lücken?
- Responsive Design eingehalten?
- Barrierefreiheit geprüft?

**Intervall:** Alle 30 Tage oder bei UI-Änderungen

#### 07 — Security-Audit
**Prüft:** Gesamtsystem auf Sicherheitslücken.
**Prüfkriterien:**
- CVE-Scans: 0 CRITICAL, 0 HIGH offen?
- Keine hartcodierten Secrets? (regex-Scan)
- Authentifizierung und Autorisierung korrekt?
- Injection-Prevention aktiv?
- HTTPS/TLS korrekt konfiguriert?
- Dependency-Checks aktuell?

**Intervall:** Alle 24 Stunden (automatisiert), alle 7 Tage (manuell reviewed)

#### 08 — DNS-Audit
**Prüft:** DNS-Konfiguration und Routing.
**Prüfkriterien:**
- Alle DNS-Einträge korrekt und aktuell?
- DNSSEC aktiv?
- TTL-Werte sinnvoll gesetzt?
- Keine verwaisten Einträge?
- Routing-Regeln korrekt?

**Intervall:** Alle 30 Tage oder bei DNS-Änderungen

#### 09 — Memory-Audit
**Prüft:** agentmemory auf Integrität und Vollständigkeit.
**Prüfkriterien:**
- Alle erwarteten Memory-Einträge vorhanden?
- Keine Korrupturen oder Inkonsistenzen?
- Verknüpfungen (Evidence ↔ Tasks ↔ Decisions) intakt?
- Synchronisations-Status aller Agenten aktuell?
- Backup-Validierung bestanden?

**Intervall:** Alle 24 Stunden (automatisiert), alle 7 Tage (Deep-Audit)

#### 10 — Agentenketten-Audit
**Prüft:** Kommunikations- und Ausführungsketten zwischen Agenten.
**Prüfkriterien:**
- Alle Agenten-Messages nachvollziehbar?
- Keine verlorenen Tasks in der Kette?
- Timeouts und Retries korrekt behandelt?
- Fehler-Weitergabe korrekt?
- Ergebnis-Übergabe vollständig?

**Intervall:** Alle 7 Tage oder bei Architektur-Änderungen

#### 11 — DONE-Audit
**Prüft:** Vollständigkeit der DONE-Kriterien für abgeschlossene Arbeiten.
**Prüfkriterien:**
- Alle 6 DONE-Kriterien erfüllt?
- Evidence existiert und vollständig?
- Memory-Sync bestätigt?
- Kanban aktuell?
- Alle Sub-Tasks geschlossen?

**Intervall:** Nach jeder abgeschlossenen Arbeit

---

## 3. Audit-Intervalle

| Intervall | Typ | Gültigkeit |
|-----------|-----|------------|
| **24h (täglich)** | Security, Memory | Automatisiert, 24/7 |
| **7 Tage (wöchentlich)** | Regelwerk, MCP, Agentenketten, Security Deep | Automatisiert + manuelles Review |
| **14 Tage (zweiwöchentlich)** | Skill | Automatisiert |
| **30 Tage (monatlich)** | Prompt, Tool/CLI, UI, DNS | Manuelles oder automatisiertes Review |
| **Bei jeder Änderung** | DONE, Regelwerk, Skill, Memory | Ereignisgesteuert |
| **Ad-hoc** | Alle Typen bei kritischem Vorfall | Bei Bedarf |

---

## 4. Audit-Template

Jedes Audit folgt diesem verbindlichen Template:

```markdown
# AUDIT-BERICHT

**Audit-ID:** AUD-{YYYYMMDD}-{NR}
**Audit-Typ:** {Typ aus Liste in 2.1}
**Datum:** {YYYY-MM-DD}
**Auditor:** {Agent/Mensch}
**Geprüfte Komponente:** {Name/Pfad}
**Version:** {Version der Komponente}
**Vorheriges Audit:** {AUD-ID des letzten Audits}

---

## 1. Prüfkriterien

| # | Kriterium | Status | Kommentar |
|---|-----------|--------|-----------|
| 1 | {Kriterium 1} | 🟢 PASS / 🟡 WARN / 🔴 FAIL | {Details} |
| 2 | {Kriterium 2} | 🟢 PASS / 🟡 WARN / 🔴 FAIL | {Details} |
| ... | ... | ... | ... |

## 2. Ergebnisse

**Gesamtergebnis:** 🟢 PASS / 🟡 CONDITIONAL / 🔴 FAIL

**Zusammenfassung:**
{Kurze Zusammenfassung der Ergebnisse}

**Abweichungen:**
| # | Abweichung | Schwere | Maßnahme |
|---|-----------|---------|----------|
| 1 | {Beschreibung} | 🔴 / 🟡 / 🟢 | {Maßnahme, Frist} |

## 3. Security-Check

- [ ] Keine CRITICAL Findings
- [ ] Keine HIGH Findings
- [ ] CVEs gecheckt
- [ ] Secrets-Scan durchgeführt
- [ ] Berechtigungen geprüft

## 4. Memory-Sync

- Memory-Sync zum Audit-Zeitpunkt: ✅ / ❌
- Letzter Sync: {Timestamp}

## 5. Folgeaktionen

| # | Aktion | Verantwortlich | Frist | Status |
|---|--------|----------------|-------|--------|
| 1 | {Aktion} | {Agent} | {Datum} | 🟢 Offen / 🔴 Überfällig / ✅ Erledigt |

## 6. Audit-Kette (bei Folgeanträgen)

- Dieses Audit ersetzt: AUD-{YYYYMMDD}-{NR}
- Nächstes Audit fällig: {YYYY-MM-DD}

---

*Audit-Bericht — erstellt am {YYYY-MM-DD} um {HH:MM}*
```

---

## 5. Audit-Regeln

### 5.1 Audit-Pflicht nach jeder Änderung

Jede Änderung an folgenden Komponenten löst ein **sofortiges Audit** aus:

| Änderung an | Ausgelöstes Audit |
|-------------|-------------------|
| Regelwerk | Regelwerk-Audit |
| Skill | Skill-Audit |
| Prompt | Prompt-Audit |
| MCP-Konfiguration | MCP-Audit |
| Tool/CLI-Konfiguration | Tool/CLI-Audit |
| UI-Code | UI-Audit |
| Security-relevanter Code | Security-Audit |
| DNS-Konfiguration | DNS-Audit |
| Memory-Struktur | Memory-Audit |
| Agenten-Logik | Agentenketten-Audit |
| Task-Abschluss | DONE-Audit |

### 5.2 Audit-Hierarchie

| Priorität | Audit-Typ | Max. Reaktionszeit |
|-----------|-----------|-------------------|
| 🔴 P0 | Security, DONE | Sofort (< 1 Min) |
| 🟠 P1 | Regelwerk, Memory, MCP | < 1 Stunde |
| 🟡 P2 | Skill, Agentenketten | < 24 Stunden |
| 🟢 P3 | Prompt, Tool/CLI, DNS | < 7 Tage |
| ⚪ P4 | UI | < 30 Tage |

### 5.3 Audit-Eskalation

| Schwelle | Aktion |
|----------|--------|
| 1 🔴 FAIL | Automatische Benachrichtigung, Task-Block |
| 3+ 🟡 WARN | Review durch übergeordneten Agenten |
| 5+ 🟡 WARN | Manuelles Review durch Menschen |
| Kritischer Fehler | Sofort-Stopp, System-Admin informieren |

---

## 6. Audit-Dokumentation

- Alle Audit-Berichte werden in `/workspace/nexify/27_audits/` gespeichert
- Benennung: `AUD_{Typ}_{YYYYMMDD}_{NR}.md`
- Jeder Audit-Bericht wird in agentmemory referenziert
- Verknüpfung zu Evidence-Dateien ist Pflicht

---

## 7. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiale Version — 11 Audit-Typen, Template, Intervalle | NeXify Governance |

---

*Dieses Audit-System unterliegt selbst der Audit-Pflicht. Meta-Audit: monatlich.*
