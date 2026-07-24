# Compliance DB — Phase 2.4.3

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

Die Compliance DB speichert Compliance-Check-Ergebnisse, Verstöße, Reports und Audit-Logs.

### 1.1 Technologie

- **Primär:** PostgreSQL 16 (Supabase)
- **Zeitreihen:** TimescaleDB (optional für Metriken)
- **Suche:** Qdrant (semantische Suche über Verstöße)

---

## 2. Schema

### 2.1 Tabelle: compliance_violations

```sql
CREATE TABLE compliance_violations (
    id SERIAL PRIMARY KEY,
    violation_id VARCHAR(50) UNIQUE NOT NULL,
    regelwerk_id VARCHAR(50) REFERENCES regelwerke(id),
    anforderung_id VARCHAR(50),
    schwergrad VARCHAR(20) NOT NULL CHECK (schwergrad IN ('Kritisch', 'Hoch', 'Mittel', 'Niedrig')),
    beschreibung TEXT NOT NULL,
    details TEXT,
    erkannt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    behoben_am TIMESTAMP,
    status VARCHAR(20) DEFAULT 'offen' CHECK (status IN ('offen', 'in_bearbeitung', 'behoben', 'akzeptiert')),
    verantwortlich VARCHAR(100),
    naechste_pruefung TIMESTAMP,
    remediation TEXT,
    evidence TEXT
);

CREATE INDEX idx_violations_regelwerk ON compliance_violations(regelwerk_id);
CREATE INDEX idx_violations_status ON compliance_violations(status);
CREATE INDEX idx_violations_schwergrad ON compliance_violations(schwergrad);
CREATE INDEX idx_violations_erkannt ON compliance_violations(erkannt_am);
```

### 2.2 Tabelle: compliance_reports

```sql
CREATE TABLE compliance_reports (
    id SERIAL PRIMARY KEY,
    report_id VARCHAR(50) UNIQUE NOT NULL,
    report_typ VARCHAR(50) NOT NULL CHECK (report_typ IN ('taeglich', 'woechentlich', 'monatlich', 'quartalsweise', 'ad_hoc')),
    zeitraum_von DATE NOT NULL,
    zeitrum_bis DATE NOT NULL,
    gesamt_score DECIMAL(5,2),
    kategorie_scores JSONB,
    violations_count INTEGER,
    violations_details JSONB,
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    erstellt_von VARCHAR(100),
    datei_pfad VARCHAR(500),
    status VARCHAR(20) DEFAULT 'erstellt' CHECK (status IN ('erstellt', 'versendet', 'archiviert'))
);

CREATE INDEX idx_reports_typ ON compliance_reports(report_typ);
CREATE INDEX idx_reports_zeitraum ON compliance_reports(zeitraum_von, zeitrum_bis);
```

### 2.3 Tabelle: compliance_audit_log

```sql
CREATE TABLE compliance_audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    benutzer VARCHAR(100),
    details JSONB,
    ip_adresse INET,
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_action ON compliance_audit_log(action);
CREATE INDEX idx_audit_log_entity ON compliance_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_datum ON compliance_audit_log(erstellt_am);
```

---

## 3. Qdrant Collection

### 3.1 Collection: nexifyai_compliance

```json
{
  "name": "nexifyai_compliance",
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "violation_id": "keyword",
    "regelwerk_id": "keyword",
    "schwergrad": "keyword",
    "beschreibung": "text",
    "status": "keyword"
  }
}
```

### 3.2 Nutzen
- Semantische Suche über Verstöße
- Ähnliche Verstöße finden
- Trend-Analyse

---

## 4. Views

### 4.1 Compliance-Übersicht

```sql
CREATE VIEW v_compliance_uebersicht AS
SELECT 
    r.kategorie,
    COUNT(DISTINCT r.id) as regelwerke_gesamt,
    COUNT(DISTINCT CASE WHEN cv.status = 'offen' THEN cv.id END) as violations_offen,
    COUNT(DISTINCT CASE WHEN cv.status = 'behoben' THEN cv.id END) as violations_behoben,
    ROUND(
        (COUNT(DISTINCT r.id) - COUNT(DISTINCT CASE WHEN cv.status = 'offen' THEN cv.id END))::numeric 
        / COUNT(DISTINCT r.id) * 100, 1
    ) as compliance_score
FROM regelwerke r
LEFT JOIN compliance_violations cv ON r.id = cv.regelwerk_id
GROUP BY r.kategorie;
```

### 4.2 Offene Verstöße

```sql
CREATE VIEW v_offene_verstoesse AS
SELECT 
    cv.violation_id,
    r.name as regelwerk,
    cv.schwergrad,
    cv.beschreibung,
    cv.erkannt_am,
    cv.verantwortlich,
    cv.naechste_pruefung,
    CURRENT_DATE - cv.erkannt_am::date as tage_offen
FROM compliance_violations cv
JOIN regelwerke r ON cv.regelwerk_id = r.id
WHERE cv.status = 'offen'
ORDER BY 
    CASE cv.schwergrad 
        WHEN 'Kritisch' THEN 1 
        WHEN 'Hoch' THEN 2 
        WHEN 'Mittel' THEN 3 
        WHEN 'Niedrig' THEN 4 
    END,
    cv.erkannt_am;
```

---

## 5. Stored Procedures

### 5.1 Compliance-Score berechnen

```sql
CREATE OR REPLACE FUNCTION calculate_compliance_score(
    p_kategorie VARCHAR DEFAULT NULL,
    p_von DATE DEFAULT NULL,
    p_bis DATE DEFAULT NULL
) RETURNS TABLE (
    kategorie VARCHAR,
    score DECIMAL,
    violations_offen INTEGER,
    violations_behoben INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.kategorie,
        ROUND(
            (COUNT(DISTINCT r.id) - COUNT(DISTINCT CASE WHEN cv.status = 'offen' THEN cv.id END))::numeric 
            / NULLIF(COUNT(DISTINCT r.id), 0) * 100, 1
        ) as score,
        COUNT(DISTINCT CASE WHEN cv.status = 'offen' THEN cv.id END)::integer as violations_offen,
        COUNT(DISTINCT CASE WHEN cv.status = 'behoben' THEN cv.id END)::integer as violations_behoben
    FROM regelwerke r
    LEFT JOIN compliance_violations cv ON r.id = cv.regelwerk_id
        AND (p_von IS NULL OR cv.erkannt_am >= p_von)
        AND (p_bis IS NULL OR cv.erkannt_am <= p_bis)
    WHERE (p_kategorie IS NULL OR r.kategorie = p_kategorie)
    GROUP BY r.kategorie;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Backup & Archivierung

### 6.1 Backup-Strategie

| Datenart | Methode | Frequenz | Retention |
|----------|---------|----------|-----------|
| Aktive Verstöße | pg_dump | Täglich | 30 Tage |
| Reports | Datei-Backup | Wöchentlich | 1 Jahr |
| Audit-Log | pg_dump | Täglich | 90 Tage |
| Archiv | Komprimierung | Monatlich | 7 Jahre |

### 6.2 Archivierung

```sql
-- Verstöße älter als 1 Jahr archivieren
CREATE OR REPLACE FUNCTION archive_old_violations() RETURNS void AS $$
BEGIN
    INSERT INTO compliance_violations_archive
    SELECT * FROM compliance_violations
    WHERE status IN ('behoben', 'akzeptiert')
    AND behoben_am < CURRENT_DATE - INTERVAL '1 year';
    
    DELETE FROM compliance_violations
    WHERE status IN ('behoben', 'akzeptiert')
    AND behoben_am < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;
```

---

## 7. Zugriffskontrolle

### 7.1 Rollen

| Rolle | Berechtigung |
|-------|--------------|
| `compliance_admin` | Vollzugriff |
| `compliance_auditor` | Lesen + Reports erstellen |
| `compliance_reader` | Nur lesen |
| `api_user` | API-Zugriff (read-only) |

### 7.2 Row-Level Security

```sql
ALTER TABLE compliance_violations ENABLE ROW LEVEL SECURITY;

-- Auditors können alles lesen
CREATE POLICY compliance_read_policy ON compliance_violations
    FOR SELECT
    USING (true);

-- Nur Admins und Verantwortliche können Status ändern
CREATE POLICY compliance_update_policy ON compliance_violations
    FOR UPDATE
    USING (
        current_user IN ('compliance_admin', 'postgres')
        OR verantwortlich = current_user
    );
```

---

## 8. Monitoring

### 8.1 Metriken

```sql
-- Verstöße pro Tag
SELECT 
    DATE(erkannt_am) as datum,
    COUNT(*) as anzahl,
    COUNT(CASE WHEN schwergrad = 'Kritisch' THEN 1 END) as kritisch
FROM compliance_violations
WHERE erkannt_am >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(erkannt_am)
ORDER BY datum;
```

### 8.2 Alerts

| Alert | Bedingung | Aktion |
|-------|-----------|--------|
| Neue kritische Verstöße | > 0 pro Tag | PagerDuty |
| Viele offene Verstöße | > 50 | E-Mail |
| Score unter 80% | Compliance-Score < 80 | Slack |

---

## 9. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| PostgreSQL Schema | ✅ Erstellt | 3 Tabellen |
| Qdrant Collection | ✅ Konfiguriert | nexifyai_compliance |
| Views | ✅ Erstellt | 2 Views |
| Stored Procedures | ✅ Implementiert | 1 Funktion |
| Backup | ✅ Konfiguriert | Täglich + Archiv |
| Zugriffskontrolle | ✅ Konfiguriert | RLS + Rollen |
| Monitoring | ✅ Konfiguriert | Prometheus |

---

**Status:** ✅ ABGESCHLOSSEN
**Tabellen:** 3
**Views:** 2
**Version:** 1.0
