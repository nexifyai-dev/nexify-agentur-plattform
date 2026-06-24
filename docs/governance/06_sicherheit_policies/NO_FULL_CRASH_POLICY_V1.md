# NO FULL CRASH POLICY V1 — Systemweit

> **Stand**: 2026-06-11 | **Status**: VERBINDLICH | **Rang**: 3 (nach Operational Constitution)
> **Durchsetzung**: Automatisiert (CI/Gate) | **Gilt für**: Alle NeXify-Systeme

---

## 1. Präambel

Diese Policy definiert **verbindliche Regeln** für alle Änderungen an kritischen NeXify-Systemen.
Keine Änderung darf einen Vollabsturz riskieren. Jede Änderung muss einen dokumentierten,
getesteten und evidenzbasierten sicheren Pfad haben.

---

## 2. Geltungsbereich

| System | Schutzstufe | Risk Level Default |
|---|---|---|
| 9Router | **KRITISCH** | HIGH |
| Brain/Qdrant | **KRITISCH** | HIGH |
| agentmemory | **KRITISCH** | HIGH |
| Oracle | **KRITISCH** | HIGH |
| Hermes WebUI / Workstation | **HOCH** | MEDIUM |
| Auto-Chat / User-Chat Driver | **HOCH** | MEDIUM |
| Cloudflare / Tunnel / DNS | **KRITISCH** | HIGH |
| Vercel | **HOCH** | MEDIUM |
| Supabase | **KRITISCH** | HIGH |
| Redis / Postgres | **KRITISCH** | HIGH |
| Goose ACC | **HOCH** | MEDIUM |
| Claude Code Systemmaster | **HOCH** | MEDIUM |
| SimpleX Gateway | **HOCH** | MEDIUM |
| MCP Server | **HOCH** | MEDIUM |
| Secret-Management | **KRITISCH** | HIGH |

---

## 3. Pflicht vor jeder riskanten Änderung

Vor jeder Änderung an einem System aus Abschnitt 2 MUSS folgende Kette durchlaufen werden:

### 3.1 Vorbereitung

| Schritt | Beschreibung | Pflicht |
|---|---|---|
| **Backup** | Vollständiges Backup des betroffenen Systems | ✅ |
| **Config Export** | Aktuelle Konfiguration exportieren und sichern | ✅ |
| **Rollback-Plan** | Dokumentierter Plan zur Wiederherstellung | ✅ |
| **Health Baseline** | Aktuelle Gesundheitsmetriken erfassen | ✅ |
| **Change Plan** | Detaillierter Änderungsplan mit Schritten | ✅ |
| **Risk Level** | Risikoeinstufung (LOW/MEDIUM/HIGH/CRITICAL) | ✅ |
| **Approval Gate** | Festgelegtes Genehmigungsverfahren | ✅ |
| **Evidence-Vorlage** | Evidence-Dokument vorbereitet | ✅ |

### 3.2 Change-Plan-Vorlage

```text
Change-ID:        CC-{YYYYMMDD}-{NR}
System:           {betroffenes System}
Änderung:         {Kurzbeschreibung}
Risk Level:       {LOW|MEDIUM|HIGH|CRITICAL}
Approval Gate:    {GATE_NAME}
Datum:            {YYYY-MM-DD}
Autor:            {Agent/Person}

Backup-Pfad:      {Pfad zum Backup}
Config-Export:    {Pfad zum Config-Export}
Rollback-Plan:    {Pfad zum Rollback-Plan}

Health Before:
  - Status: {OK|WARN|ERROR}
  - Metrik 1: {Wert}
  - Metrik 2: {Wert}

Test-Ergebnisse:
  - T1: {PASS|FAIL}
  - T2: {PASS|FAIL}

Evidence-Pfad:    {Pfad zur Evidence-Datei}
```

### 3.3 Health-Check-Vorlage (Post-Change)

```text
Post-Change Health Check
Change-ID:        {CC-ID}
Zeitpunkt:        {YYYY-MM-DD HH:MM}

System Status:    {OK|WARN|ERROR|DEGRADED}
Antwortzeit:      {ms}
Fehlerrate:       {Prozent}
Letzter Restart:  {Timestamp}

Metriken:
  - {Metrik 1}: {Wert} (vorher: {Wert})
  - {Metrik 2}: {Wert} (vorher: {Wert})

Abhängigkeiten:
  - {System A}: {OK|WARN|ERROR}
  - {System B}: {OK|WARN|ERROR}

Rollback-Entscheidung: {NO_ROLLBACK_NEEDED|ROLLBACK_REQUIRED|ROLLBACK_EXECUTED}
Gate-Freigabe:          {APPROVED|DENIED|PENDING}

Nächster Check:         {YYYY-MM-DD HH:MM}
```

---

## 4. Risk Level Matrix

| Risk Level | Beschreibung | Gate | Beispiele |
|---|---|---|---|
| **LOW** | Kein Ausfallrisiko, nur Dokumentation | Kein Gate | Evidence schreiben, README aktualisieren |
| **MEDIUM** | Geringes Ausfallrisiko, degradierter Betrieb möglich | Code Review | Config-Änderungen mit Rollback, Plugin-Test |
| **HIGH** | Ausfallrisiko für Teilsysteme | Approval + Review | 9Router-Provider ändern, DNS-Änderung |
| **CRITICAL** | Vollausfallrisiko für Gesamtsystem | Mehrstufiges Gate + Staging/Shadow | 9Router-Neustart, Secret-Rotation, DB-Migration |

---

## 5. Verbote

**Niemals ohne Rollback:**

- ❌ 9Router hart neu starten ohne Rollback
- ❌ Config überschreiben ohne Backup
- ❌ Provider löschen ohne Prüfung
- ❌ `nexifyai-combo-llm` entfernen oder überschreiben
- ❌ Secret-Werte in Klartext in Git/Evidence/Brain/Logs schreiben
- ❌ Riskante Live-Änderungen ohne Staging/Shadow-Test
- ❌ Vollabsturz riskieren ohne dokumentierten Notfallplan
- ❌ Produktive Prompts ohne Promptmaster-Review ändern
- ❌ DNS/Tunnel-Änderungen ohne Rollback-Plan
- ❌ Datenbank-Migration ohne Backup

---

## 6. Verstöße

Jeder Verstoß gegen diese Policy muss dokumentiert werden:

```text
Violation-ID:     V-{YYYYMMDD}-{NR}
Datum:            {YYYY-MM-DD}
System:           {betroffenes System}
Art:              {Verstoß-Kategorie}
Verursacher:      {Agent/Person}
Auswirkung:       {tatsächliche Auswirkung}
Massnahme:        {Sofortmassnahme}
Prävention:       {zukünftige Vermeidung}
Evidence:         {Pfad zur Evidence}
```

---

## 7. Änderungen an dieser Policy

| Version | Datum | Autor | Änderung |
|---|---|---|---|
| V1 | 2026-06-11 | Systemmaster | Initiale Fassung |
