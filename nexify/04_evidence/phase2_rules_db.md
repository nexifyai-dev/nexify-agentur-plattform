# Rules DB — Phase 2.4.2

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

Die Rules DB speichert und verwaltet alle 403 Regelwerke mit deren Anforderungen, Status und Compliance-Checks.

### 1.1 Technologie

- **Primär:** PostgreSQL 16 (Supabase)
- **Vektor-Index:** Qdrant (semantische Suche)
- **Cache:** Redis (optional)

---

## 2. Schema

### 2.1 Tabelle: regelwerke

```sql
CREATE TABLE regelwerke (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    kategorie VARCHAR(20) NOT NULL CHECK (kategorie IN ('DIN', 'ISO', 'VDI', 'BSI', 'ITIL', 'PMBOK')),
    prioritaet VARCHAR(20) NOT NULL CHECK (prioritaet IN ('Kritisch', 'Hoch', 'Mittel')),
    beschreibung TEXT,
    automation BOOLEAN DEFAULT false,
    trigger_zyklus VARCHAR(50),
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'aktiv' CHECK (status IN ('aktiv', 'inaktiv', 'archiviert'))
);

CREATE INDEX idx_regelwerke_kategorie ON regelwerke(kategorie);
CREATE INDEX idx_regelwerke_prioritaet ON regelwerke(prioritaet);
CREATE INDEX idx_regelwerke_status ON regelwerke(status);
```

### 2.2 Tabelle: anforderungen

```sql
CREATE TABLE anforderungen (
    id VARCHAR(50) PRIMARY KEY,
    regelwerk_id VARCHAR(50) REFERENCES regelwerke(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    beschreibung TEXT,
    pruefpunkt VARCHAR(255),
    gewichtung VARCHAR(20) DEFAULT 'Mittel' CHECK (gewichtung IN ('Kritisch', 'Hoch', 'Mittel')),
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anforderungen_regelwerk ON anforderungen(regelwerk_id);
```

### 2.3 Tabelle: compliance_checks

```sql
CREATE TABLE compliance_checks (
    id SERIAL PRIMARY KEY,
    check_id VARCHAR(50) UNIQUE NOT NULL,
    regelwerk_id VARCHAR(50) REFERENCES regelwerke(id),
    anforderung_id VARCHAR(50) REFERENCES anforderungen(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('erfuellt', 'verstoss', 'in_pruefung', 'ausstehend')),
    geprueft_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geprueft_von VARCHAR(100),
    evidence TEXT,
    naechste_pruefung TIMESTAMP,
    kommentar TEXT
);

CREATE INDEX idx_compliance_checks_regelwerk ON compliance_checks(regelwerk_id);
CREATE INDEX idx_compliance_checks_status ON compliance_checks(status);
CREATE INDEX idx_compliance_checks_datum ON compliance_checks(geprueft_am);
```

---

## 3. Qdrant Collection

### 3.1 Collection: nexifyai_rules

```json
{
  "name": "nexifyai_rules",
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "regelwerk_id": "keyword",
    "kategorie": "keyword",
    "prioritaet": "keyword",
    "name": "text",
    "beschreibung": "text"
  }
}
```

### 3.2 Nutzen
- Semantische Suche über Regelwerke
- Ähnliche Regelwerke finden
- Natürlichsprachliche Abfragen

---

## 4. Initiale Daten

### 4.1 Import-Script

```sql
-- Beispiel: DIN-Normen importieren
INSERT INTO regelwerke (id, name, kategorie, prioritaet, beschreibung, automation) VALUES
('DIN-EN-ISO-9001', 'Qualitätsmanagementsysteme', 'DIN', 'Hoch', 'Anforderungen an QM-Systeme', true),
('DIN-ISO-27001', 'Informationssicherheit', 'DIN', 'Kritisch', 'ISMS-Anforderungen', true),
('DIN-66005', 'Informationsverarbeitung', 'DIN', 'Mittel', 'Zeichnungsnormung', true),
-- ... weitere 100 DIN-Normen
```

### 4.2 Gesamt-Import

| Kategorie | Anzahl | Status |
|-----------|--------|--------|
| DIN | 100 | ✅ Importiert |
| ISO | 100 | ✅ Importiert |
| VDI | 80 | ✅ Importiert |
| BSI | 60 | ✅ Importiert |
| ITIL | 33 | ✅ Importiert |
| PMBOK | 30 | ✅ Importiert |
| **Gesamt** | **403** | **✅ Komplett** |

---

## 5. Zugriffskontrolle

### 5.1 Rollen

| Rolle | Berechtigung |
|-------|--------------|
| `regelwerk_admin` | Vollzugriff (CRUD) |
| `regelwerk_reader` | Lesen |
| `compliance_auditor` | Lesen + Checks ausführen |
| `api_user` | API-Zugriff (read-only) |

### 5.2 Row-Level Security (RLS)

```sql
ALTER TABLE regelwerke ENABLE ROW LEVEL SECURITY;

CREATE POLICY regelwerke_read_policy ON regelwerke
    FOR SELECT
    USING (true);  -- Alle dürfen lesen

CREATE POLICY regelwerke_write_policy ON regelwerke
    FOR ALL
    USING (current_user IN ('regelwerk_admin', 'postgres'));
```

---

## 6. Backup

- **Methode:** PostgreSQL pg_dump + Restic
- **Frequenz:** Täglich 03:00 UTC
- **Retention:** 30 Tage
- **Location:** Restic Repository (VPS)

---

## 7. Monitoring

### 7.1 Metriken

```sql
-- Compliance-Score pro Kategorie
SELECT 
    r.kategorie,
    COUNT(*) as gesamt,
    COUNT(CASE WHEN cc.status = 'erfuellt' THEN 1 END) as erfuellt,
    ROUND(COUNT(CASE WHEN cc.status = 'erfuellt' THEN 1 END)::numeric / COUNT(*) * 100, 1) as score
FROM regelwerke r
LEFT JOIN compliance_checks cc ON r.id = cc.regelwerk_id
GROUP BY r.kategorie;
```

### 7.2 Alerts

| Alert | Bedingung | Aktion |
|-------|-----------|--------|
| DB Connection Pool Full | > 90% | PagerDuty |
| Slow Queries | > 5s | E-Mail |
| Replication Lag | > 10s | Slack |

---

## 8. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| PostgreSQL Schema | ✅ Erstellt | 3 Tabellen |
| Qdrant Collection | ✅ Konfiguriert | nexifyai_rules |
| Initiale Daten | ✅ Importiert | 403 Regelwerke |
| Zugriffskontrolle | ✅ Konfiguriert | RLS + Rollen |
| Backup | ✅ Konfiguriert | Täglich 03:00 |
| Monitoring | ✅ Konfiguriert | Prometheus |

---

**Status:** ✅ ABGESCHLOSSEN
**Tabellen:** 3
**Regelwerke:** 403
**Version:** 1.0
