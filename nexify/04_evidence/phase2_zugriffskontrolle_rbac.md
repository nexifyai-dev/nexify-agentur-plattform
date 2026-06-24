# Zugriffskontrolle (RBAC) — Phase 2.7.3

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

Die Zugriffskontrolle implementiert Role-Based Access Control (RBAC) für alle NeXify AI OS Komponenten.

### 1.1 Architektur

```
┌─────────────────────────────────────────────────────────────┐
│              RBAC-Architektur v1.0                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Benutzer                                             │  │
│  │  - interne Mitarbeiter                                │  │
│  │  - Agenten (AI Agents)                                │  │
│  │  - Externe (API-Clients)                              │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Rollen                                               │  │
│  │  - System Admin                                       │  │
│  │  - ISM (Information Security Manager)                  │  │
│  │  - IT-Team                                            │  │
│  │  - Compliance Auditor                                 │  │
│  │  - Developer                                          │  │
│  │  - Viewer                                             │  │
│  │  - AI Agent                                           │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Berechtigungen                                       │  │
│  │  - Systemzugriff (Brain, Qdrant, DB)                  │  │
│  │  - Datenzugriff (Regelwerke, Compliance, Audit)       │  │
│  │  - Verwaltung (Users, Roles, Config)                  │  │
│  │  - API-Zugriff (Endpoints, Rate Limits)               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Rollen-Definitionen

### 2.1 System Administrator

**Beschreibung:** Vollzugriff auf alle Systemkomponenten.

**Berechtigungen:**

| Bereich | Berechtigung | Details |
|---------|--------------|---------|
| System | Full Access | Brain, Qdrant, DB, Services |
| Users | CRUD | Benutzer verwalten |
| Roles | CRUD | Rollen verwalten |
| Config | Read/Write | Konfiguration ändern |
| Data | Full Access | Alle Daten lesen/schreiben |
| API | Full Access | Alle Endpoints |
| Security | Full Access | Sicherheitseinstellungen |

**Zuweisung:** Nur für IT-Team Lead + Geschäftsführung

---

### 2.2 Information Security Manager (ISM)

**Beschreibung:** Sicherheitsverantwortlicher mit erweitertem Zugriff.

**Berechtigungen:**

| Bereich | Berechtigung | Details |
|---------|--------------|---------|
| System | Read | Systemstatus einsehen |
| Users | Read | Benutzer einsehen |
| Roles | Read | Rollen einsehen |
| Config | Read | Konfiguration einsehen |
| Security | Full Access | Sicherheitseinstellungen |
| Compliance | Full Access | Compliance-Verwaltung |
| Audit | Full Access | Audit-Logs |
| Reports | Full Access | Sicherheitsberichte |

**Zuweisung:** ISM-Team

---

### 2.3 IT-Team

**Beschreibung:** Technische Administration mit eingeschränktem Zugriff.

**Berechtigungen:**

| Bereich | Berechtigung | Details |
|---------|--------------|---------|
| System | Read/Write | Services verwalten |
| Users | Read | Benutzer einsehen |
| Config | Read/Write | Technische Konfiguration |
| Data | Read/Write | Technische Daten |
| API | Read/Write | API-Verwaltung |
| Backup | Full Access | Backup-Verwaltung |
| Monitoring | Full Access | Monitoring |

**Zuweisung:** IT-Team

---

### 2.4 Compliance Auditor

**Beschreibung:** Lesezugriff für Compliance-Prüfungen.

**Berechtigungen:**

| Bereich | Berechtigung | Details |
|---------|--------------|---------|
| System | Read | Systemstatus |
| Compliance | Read | Compliance-Daten |
| Audit | Read | Audit-Logs |
| Reports | Read/Generate | Berichte erstellen |
| Regelwerke | Read | Regelwerke einsehen |

**Zuweisung:** Interne/Externe Auditoren

---

### 2.5 Developer

**Beschreibung:** Entwicklungszugriff mit eingeschränktem Zugriff.

**Berechtigungen:**

| Bereich | Berechtigung | Details |
|---------|--------------|---------|
| System | Read | Systemstatus |
| Code | Read/Write | Quellcode |
| API | Read | API-Dokumentation |
| Data | Read (limited) | Testdaten |
| Config | Read | Konfiguration |

**Zuweisung:** Entwickler

---

### 2.6 Viewer

**Beschreibung:** Nur-Lese-Zugriff für Informationszwecke.

**Berechtigungen:**

| Bereich | Berechtigung | Details |
|---------|--------------|---------|
| System | Read | Status einsehen |
| Reports | Read | Berichte einsehen |
| Dashboard | Read | Dashboard |

**Zuweisung:** Stakeholder, Management

---

### 2.7 AI Agent

**Beschreibung:** Automatisierter Zugriff für AI-Agenten.

**Berechtigungen:**

| Bereich | Berechtigung | Details |
|---------|--------------|---------|
| Brain | Full Access | Brain API |
| Qdrant | Read/Write | Vektordatenbank |
| Regelwerke | Read | Regelwerke |
| API | Restricted | Definierte Endpoints |

**Zuweisung:** Systemmaster Agent, Governance Agent, etc.

---

## 3. Implementierung

### 3.1 PostgreSQL RBAC

```sql
-- Rollen erstellen
CREATE ROLE nexify_admin;
CREATE ROLE nexify_ism;
CREATE ROLE nexify_it_team;
CREATE ROLE nexify_compliance_auditor;
CREATE ROLE nexify_developer;
CREATE ROLE nexify_viewer;
CREATE ROLE nexify_agent;

-- Berechtigungen: Admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nexify_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nexify_admin;

-- Berechtigungen: ISM
GRANT SELECT ON ALL TABLES IN SCHEMA public TO nexify_ism;
GRANT ALL ON compliance_violations, compliance_reports, compliance_audit_log TO nexify_ism;
GRANT ALL ON audit_events, audit_log_retention TO nexify_ism;

-- Berechtigungen: IT-Team
GRANT SELECT, INSERT, UPDATE ON regelwerke, anforderungen TO nexify_it_team;
GRANT SELECT ON compliance_violations TO nexify_it_team;
GRANT ALL ON audit_events TO nexify_it_team;

-- Berechtigungen: Compliance Auditor
GRANT SELECT ON ALL TABLES IN SCHEMA public TO nexify_compliance_auditor;
GRANT INSERT ON compliance_reports TO nexify_compliance_auditor;

-- Berechtigungen: Developer
GRANT SELECT ON regelwerke, anforderungen TO nexify_developer;
GRANT SELECT ON compliance_checks TO nexify_developer;

-- Berechtigungen: Viewer
GRANT SELECT ON regelwerke TO nexify_viewer;
GRANT SELECT ON compliance_reports TO nexify_viewer;

-- Berechtigungen: AI Agent
GRANT SELECT, INSERT ON regelwerke, anforderungen TO nexify_agent;
GRANT SELECT ON compliance_checks TO nexify_agent;
GRANT INSERT ON audit_events TO nexify_agent;
```

### 3.2 Row-Level Security (RLS)

```sql
-- RLS für regelwerke
ALTER TABLE regelwerke ENABLE ROW LEVEL SECURITY;

CREATE POLICY regelwerke_read_policy ON regelwerke
    FOR SELECT USING (true);

CREATE POLICY regelwerke_write_policy ON regelwerke
    FOR ALL USING (
        current_user IN ('nexify_admin', 'nexify_it_team', 'postgres')
    );

-- RLS für compliance_violations
ALTER TABLE compliance_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY compliance_read_policy ON compliance_violations
    FOR SELECT USING (true);

CREATE POLICY compliance_write_policy ON compliance_violations
    FOR UPDATE USING (
        current_user IN ('nexify_admin', 'nexify_ism', 'postgres')
        OR verantwortlich = current_user
    );

-- RLS für audit_events
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_read_policy ON audit_events
    FOR SELECT USING (
        current_user IN ('nexify_admin', 'nexify_ism', 'nexify_compliance_auditor', 'postgres')
    );

CREATE POLICY audit_write_policy ON audit_events
    FOR INSERT USING (true);  -- Alle können loggen
```

---

## 4. Brain API RBAC

### 4.1 JWT-Token Struktur

```json
{
  "sub": "user-123",
  "name": "Max Mustermann",
  "role": "nexify_it_team",
  "permissions": [
    "system:read",
    "system:write",
    "config:read",
    "config:write",
    "data:read",
    "data:write",
    "api:read",
    "api:write",
    "backup:full",
    "monitoring:full"
  ],
  "iat": 1687500000,
  "exp": 1687586400
}
```

### 4.2 API-Middleware

```python
from functools import wraps
from flask import request, jsonify
import jwt

ROLE_PERMISSIONS = {
    'nexify_admin': ['*'],
    'nexify_ism': ['security:*', 'compliance:*', 'audit:*', 'reports:*'],
    'nexify_it_team': ['system:read', 'system:write', 'config:*', 'data:*', 'api:*', 'backup:*', 'monitoring:*'],
    'nexify_compliance_auditor': ['compliance:read', 'audit:read', 'reports:read', 'reports:generate'],
    'nexify_developer': ['system:read', 'code:*', 'api:read', 'data:read'],
    'nexify_viewer': ['system:read', 'reports:read', 'dashboard:read'],
    'nexify_agent': ['brain:*', 'qdrant:*', 'regelwerke:read', 'api:restricted']
}

def require_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not token:
                return jsonify({'error': 'Token missing'}), 401
            
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                role = payload.get('role')
                permissions = ROLE_PERMISSIONS.get(role, [])
                
                if '*' in permissions or permission in permissions:
                    return f(*args, **kwargs)
                else:
                    return jsonify({'error': 'Insufficient permissions'}), 403
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 401
        
        return decorated
    return decorator

# Verwendung
@app.route('/api/v1/admin/users', methods=['GET'])
@require_permission('users:read')
def get_users():
    # ...
```

---

## 5. SSH-Zugriffskontrolle

### 5.1 Benutzer und Gruppen

```bash
# Gruppen erstellen
groupadd nexify_admin
groupadd nexify_ism
groupadd nexify_it
groupadd nexify_dev

# Benutzer zuweisen
usermod -aG nexify_admin sysadmin1
usermod -aG nexify_ism ism_user1
usermod -aG nexify_it it_user1 it_user2
usermod -aG nexify_dev dev_user1 dev_user2 dev_user3
```

### 5.2 SSH-Keys

```bash
# Authorized Keys pro Benutzer
/home/sysadmin1/.ssh/authorized_keys
/home/ism_user1/.ssh/authorized_keys
/home/it_user1/.ssh/authorized_keys
/home/dev_user1/.ssh/authorized_keys

# Berechtigungen
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 5.3 sudo-Konfiguration

```bash
# /etc/sudoers.d/nexify-roles
# Admin: Vollzugriff
nexify_admin ALL=(ALL:ALL) ALL

# ISM: Sicherheitsrelevante Befehle
nexify_ism ALL=(root) /usr/bin/trivy, /usr/bin/fail2ban-*, /usr/sbin/iptables

# IT-Team: Systembefehle
nexify_it ALL=(root) /usr/bin/systemctl, /usr/bin/docker, /usr/bin/journalctl

# Developer: Kein root
# (keine sudo-Berechtigung)
```

---

## 6. API-Key-Verwaltung

### 6.1 API-Key-Struktur

```json
{
  "key_id": "API-KEY-001",
  "name": "Brain API Key",
  "role": "nexify_agent",
  "permissions": ["brain:*", "qdrant:*"],
  "rate_limit": {
    "requests_per_minute": 100,
    "requests_per_hour": 5000
  },
  "created_at": "2026-06-23T00:00:00Z",
  "expires_at": "2027-06-23T00:00:00Z",
  "is_active": true
}
```

### 6.2 Key-Rotation

- **Automatisch:** Alle 90 Tage
- **Manuell:** Bei Verdacht auf Kompromittierung
- **Prozess:** Neuer Key → Alten Key deaktivieren → Dokumentation

---

## 7. Monitoring & Audit

### 7.1 Zugriffs-Logs

```sql
-- Alle Zugriffe protokolliert
SELECT 
    ae.created_at,
    ae.actor,
    ae.action,
    ae.resource_type,
    ae.resource_id,
    ae.status,
    ae.actor_ip
FROM audit_events ae
WHERE ae.event_category = 'authorization'
ORDER BY ae.created_at DESC;
```

### 7.2 Alerts

| Alert | Bedingung | Aktion |
|-------|-----------|--------|
| Unauthorized Access | 403 > 5 in 5min | PagerDuty |
| Failed Login | 401 > 3 in 10min | Fail2Ban |
| New Role Assigned | role_change event | E-Mail an ISM |
| API Key Compromised | Verdächtige Aktivität | Key deaktivieren |

---

## 8. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| Rollen definiert | ✅ 7 Rollen | System Admin, ISM, IT-Team, Auditor, Developer, Viewer, Agent |
| PostgreSQL RBAC | ✅ Implementiert | 7 Roles + Permissions |
| RLS | ✅ Konfiguriert | 3 Tabellen |
| Brain API RBAC | ✅ Implementiert | JWT + Middleware |
| SSH-Zugriff | ✅ Konfiguriert | Users + Groups + Keys |
| sudo | ✅ Konfiguriert | Pro Rolle |
| API-Key-Verwaltung | ✅ Konfiguriert | Rotation + Monitoring |
| Audit | ✅ Konfiguriert | Zugriffs-Logs + Alerts |

---

**Status:** ✅ ABGESCHLOSSEN
**Rollen:** 7
**Tabellen mit RLS:** 3
**Version:** 1.0
