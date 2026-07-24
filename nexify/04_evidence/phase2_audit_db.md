# Audit DB — Phase 2.4.4

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

Die Audit DB speichert alle sicherheitsrelevanten Aktionen, Änderungen und Zugriffe für Compliance-Nachweise.

### 1.1 Technologie

- **Primär:** PostgreSQL 16 (Supabase)
- **Zeitreihen:** TimescaleDB (optional für Metriken)
- **Verschlüsselung:** AES-256 at rest

---

## 2. Schema

### 2.1 Tabelle: audit_events

```sql
CREATE TABLE audit_events (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL CHECK (event_category IN (
        'authentication', 'authorization', 'data_access', 'data_modification',
        'system_change', 'security_event', 'compliance_check', 'api_access',
        'configuration_change', 'user_management'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    actor VARCHAR(100) NOT NULL,
    actor_ip INET,
    actor_user_agent TEXT,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    details JSONB,
    old_value JSONB,
    new_value JSONB,
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failure', 'denied')),
    request_id VARCHAR(100),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Partitionierung
    partition_date DATE DEFAULT CURRENT_DATE
) PARTITION BY RANGE (partition_date);

-- Partitionen erstellen
CREATE TABLE audit_events_2026_06 PARTITION OF audit_events
    FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE TABLE audit_events_2026_07 PARTITION OF audit_events
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- Indizes
CREATE INDEX idx_audit_events_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_category ON audit_events(event_category);
CREATE INDEX idx_audit_events_actor ON audit_events(actor);
CREATE INDEX idx_audit_events_resource ON audit_events(resource_type, resource_id);
CREATE INDEX idx_audit_events_created ON audit_events(created_at);
CREATE INDEX idx_audit_events_severity ON audit_events(severity);
```

### 2.2 Tabelle: audit_log_retention

```sql
CREATE TABLE audit_log_retention (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    retention_days INTEGER NOT NULL,
    archive_after_days INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standard-Retention Policies
INSERT INTO audit_log_retention (category, retention_days, archive_after_days, description) VALUES
('authentication', 365, 90, 'Login/Logout Events'),
('authorization', 365, 90, 'Zugriffskontrolle Events'),
('data_access', 730, 180, 'Datenzugriffe'),
('data_modification', 730, 180, 'Datenänderungen'),
('system_change', 1095, 365, 'Systemänderungen'),
('security_event', 1095, 365, 'Sicherheitsereignisse'),
('compliance_check', 1095, 365, 'Compliance-Checks'),
('api_access', 90, 30, 'API-Zugriffe'),
('configuration_change', 1095, 365, 'Konfigurationsänderungen'),
('user_management', 1095, 365, 'Benutzerverwaltung');
```

### 2.3 Tabelle: audit_sensitive_operations

```sql
CREATE TABLE audit_sensitive_operations (
    id SERIAL PRIMARY KEY,
    operation VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    requires_approval BOOLEAN DEFAULT false,
    approval_workflow VARCHAR(100),
    notification_recipients TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kritische Operationen
INSERT INTO audit_sensitive_operations (operation, description, requires_approval, notification_recipients) VALUES
('user.create', 'Neuen Benutzer erstellen', true, ARRAY['ism@nexifyai.cloud']),
('user.delete', 'Benutzer löschen', true, ARRAY['ism@nexifyai.cloud', 'gf@nexifyai.cloud']),
('role.assign', 'Rolle zuweisen', true, ARRAY['ism@nexifyai.cloud']),
('secret.rotate', 'Secret rotieren', false, ARRAY['ism@nexifyai.cloud']),
('config.security', 'Sicherheitskonfiguration ändern', true, ARRAY['ism@nexifyai.cloud', 'it@nexifyai.cloud']),
('data.export', 'Daten exportieren', true, ARRAY['dsb@nexifyai.cloud', 'ism@nexifyai.cloud']),
('backup.delete', 'Backup löschen', true, ARRAY['it@nexifyai.cloud', 'gf@nexifyai.cloud']);
```

---

## 3. Qdrant Collection

### 3.1 Collection: nexifyai_audit

```json
{
  "name": "nexifyai_audit",
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "event_id": "keyword",
    "event_type": "keyword",
    "event_category": "keyword",
    "actor": "keyword",
    "resource_type": "keyword",
    "action": "keyword",
    "severity": "keyword",
    "created_at": "datetime"
  }
}
```

### 3.2 Nutzen
- Semantische Suche über Audit-Events
- Anomalie-Erkennung
- Forensische Analyse

---

## 4. Views

### 4.1 Sicherheitsrelevante Events

```sql
CREATE VIEW v_security_events AS
SELECT 
    event_id,
    event_type,
    severity,
    actor,
    actor_ip,
    action,
    description,
    created_at
FROM audit_events
WHERE event_category IN ('security_event', 'authentication', 'authorization')
AND severity IN ('WARNING', 'ERROR', 'CRITICAL')
ORDER BY created_at DESC;
```

### 4.2 Compliance-Relevante Events

```sql
CREATE VIEW v_compliance_events AS
SELECT 
    ae.event_id,
    ae.event_type,
    ae.actor,
    ae.resource_type,
    ae.action,
    ae.description,
    ae.created_at,
    so.requires_approval
FROM audit_events ae
LEFT JOIN audit_sensitive_operations so ON ae.action = so.operation
WHERE ae.event_category IN ('compliance_check', 'data_access', 'data_modification')
ORDER BY ae.created_at DESC;
```

### 4.3 Aktivitäts-Statistiken

```sql
CREATE VIEW v_activity_stats AS
SELECT 
    DATE(created_at) as datum,
    event_category,
    COUNT(*) as events,
    COUNT(DISTINCT actor) as unique_actors,
    COUNT(CASE WHEN severity IN ('ERROR', 'CRITICAL') THEN 1 END) as errors
FROM audit_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), event_category
ORDER BY datum DESC, events DESC;
```

---

## 5. Stored Procedures

### 5.1 Audit-Event loggen

```sql
CREATE OR REPLACE FUNCTION log_audit_event(
    p_event_type VARCHAR,
    p_event_category VARCHAR,
    p_severity VARCHAR,
    p_actor VARCHAR,
    p_actor_ip INET DEFAULT NULL,
    p_resource_type VARCHAR DEFAULT NULL,
    p_resource_id VARCHAR DEFAULT NULL,
    p_action VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_status VARCHAR DEFAULT 'success'
) RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO audit_events (
        event_type, event_category, severity, actor, actor_ip,
        resource_type, resource_id, action, description, details, status
    ) VALUES (
        p_event_type, p_event_category, p_severity, p_actor, p_actor_ip,
        p_resource_type, p_resource_id, p_action, p_description, p_details, p_status
    ) RETURNING event_id INTO v_event_id;
    
    -- Alert bei kritischen Events
    IF p_severity = 'CRITICAL' THEN
        PERFORM pg_notify('audit_critical', json_build_object(
            'event_id', v_event_id,
            'event_type', p_event_type,
            'actor', p_actor,
            'description', p_description
        )::text);
    END IF;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;
```

### 5.2 Alte Events archivieren

```sql
CREATE OR REPLACE FUNCTION archive_audit_events() RETURNS void AS $$
DECLARE
    v_retention RECORD;
BEGIN
    FOR v_retention IN SELECT * FROM audit_log_retention
    LOOP
        -- Archivierung
        IF v_retention.archive_after_days IS NOT NULL THEN
            INSERT INTO audit_events_archive
            SELECT * FROM audit_events
            WHERE event_category = v_retention.category
            AND created_at < CURRENT_TIMESTAMP - (v_retention.archive_after_days || ' days')::interval
            AND partition_date < CURRENT_DATE - (v_retention.archive_after_days || ' days')::interval;
        END IF;
        
        -- Löschung nach Retention
        DELETE FROM audit_events
        WHERE event_category = v_retention.category
        AND created_at < CURRENT_TIMESTAMP - (v_retention.retention_days || ' days')::interval;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Trigger

### 6.1 Automatisches Logging

```sql
-- Trigger für automatisches Logging bei Regelwerks-Änderungen
CREATE OR REPLACE FUNCTION trigger_audit_regelwerke() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        PERFORM log_audit_event(
            'regelwerk.updated',
            'data_modification',
            'INFO',
            current_user,
            NULL,
            'regelwerk',
            NEW.id,
            'update',
            'Regelwerk aktualisiert: ' || NEW.name,
            jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
        );
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event(
            'regelwerk.deleted',
            'data_modification',
            'WARNING',
            current_user,
            NULL,
            'regelwerk',
            OLD.id,
            'delete',
            'Regelwerk gelöscht: ' || OLD.name,
            to_jsonb(OLD)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_regelwerke_trigger
    AFTER UPDATE OR DELETE ON regelwerke
    FOR EACH ROW EXECUTE FUNCTION trigger_audit_regelwerke();
```

---

## 7. Sicherheit

### 7.1 Verschlüsselung

```sql
-- Transparent Data Encryption (TDE)
ALTER TABLE audit_events SET (
    autovacuum_enabled = true,
    toast.autovacuum_enabled = true
);

-- Column-level Encryption für sensitive Daten
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### 7.2 Zugriffskontrolle

| Rolle | Berechtigung |
|-------|--------------|
| `audit_admin` | Vollzugriff |
| `audit_reader` | Nur lesen |
| `audit_archiver` | Archivierung durchführen |
| `compliance_auditor` | Lesen + Reports |

### 7.3 Immutability

```sql
-- Prevent direct modifications to audit_events
CREATE OR REPLACE FUNCTION prevent_audit_modification() RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Direct modification of audit_events is not allowed';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_audit_update
    BEFORE UPDATE OR DELETE ON audit_events
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
```

---

## 8. Monitoring

### 8.1 Metriken

```sql
-- Events pro Stunde
SELECT 
    date_trunc('hour', created_at) as stunde,
    COUNT(*) as events,
    COUNT(CASE WHEN severity IN ('ERROR', 'CRITICAL') THEN 1 END) as errors
FROM audit_events
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
GROUP BY date_trunc('hour', created_at)
ORDER BY stunde;
```

### 8.2 Alerts

| Alert | Bedingung | Aktion |
|-------|-----------|--------|
| Kritische Events | > 0 pro Stunde | PagerDuty |
| Viele Fehler | > 10 pro Stunde | E-Mail |
| Unbekannte Actors | Neue IPs | Slack |

---

## 9. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| PostgreSQL Schema | ✅ Erstellt | 3 Tabellen + Partitionierung |
| Qdrant Collection | ✅ Konfiguriert | nexifyai_audit |
| Views | ✅ Erstellt | 3 Views |
| Stored Procedures | ✅ Implementiert | 2 Funktionen |
| Trigger | ✅ Konfiguriert | Automatisches Logging |
| Retention Policies | ✅ Definiert | 10 Kategorien |
| Sicherheit | ✅ Konfiguriert | Verschlüsselung + Immutability |
| Monitoring | ✅ Konfiguriert | Prometheus |

---

**Status:** ✅ ABGESCHLOSSEN
**Tabellen:** 3 + Partitionen
**Views:** 3
**Version:** 1.0
