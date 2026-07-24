# API-Schnittstellen — Phase 2 Installation

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** Konfiguriert

---

## 1. API-Übersicht

### 1.1 Brain API
- **Endpoint:** http://127.0.0.1:9090
- **Status:** ✅ Aktiv
- **Funktion:** Zentrale API für Regelwerksabfragen und Agentenkommunikation

### 1.2 Qdrant API
- **Endpoint:** http://127.0.0.1:6333
- **Status:** ✅ Aktiv
- **Funktion:** Vektordatenbank für semantische Regelwerkssuche

### 1.3 Cloudflare Tunnel
- **Endpoint:** brain+agentmemory.nexifyai.cloud
- **Status:** ✅ Aktiv
- **Funktion:** Sichere externe Erreichbarkeit

---

## 2. API-Endpoints

### 2.1 Regelwerks-Endpoints

| Endpoint | Methode | Beschreibung | Status |
|----------|---------|-------------|--------|
| `/api/v1/rules` | GET | Alle Regelwerke abrufen | ✅ |
| `/api/v1/rules/{id}` | GET | Einzelnes Regelwerk | ✅ |
| `/api/v1/rules/search` | POST | Regelwerke suchen | ✅ |
| `/api/v1/rules/validate` | POST | Regelwerk validieren | ✅ |
| `/api/v1/compliance/check` | POST | Compliance-Check | ✅ |
| `/api/v1/compliance/report` | GET | Compliance-Report | ✅ |

### 2.2 Audit-Endpoints

| Endpoint | Methode | Beschreibung | Status |
|----------|---------|-------------|--------|
| `/api/v1/audit/start` | POST | Audit starten | ✅ |
| `/api/v1/audit/{id}` | GET | Audit-Status | ✅ |
| `/api/v1/audit/report` | GET | Audit-Report | ✅ |

### 2.3 Monitoring-Endpoints

| Endpoint | Methode | Beschreibung | Status |
|----------|---------|-------------|--------|
| `/api/v1/health` | GET | Health-Check | ✅ |
| `/api/v1/metrics` | GET | Metriken | ✅ |
| `/api/v1/alerts` | GET | Alarme | ✅ |

---

## 3. Webhook-Schnittstellen

### 3.1 Eingehende Webhooks

| Webhook | Trigger | Aktion | Status |
|---------|---------|--------|--------|
| `/webhook/incident` | Incident erstellt | Auto-Eskalation | ✅ |
| `/webhook/change` | Change-Antrag | CAB-Review | ✅ |
| `/webhook/breach` | Datenverstoß | 72h-Meldung | ✅ |

### 3.2 Ausgehende Webhooks

| Webhook | Event | Ziel | Status |
|---------|-------|------|--------|
| Compliance-Alert | Non-Compliance | Team-Benachrichtigung | ✅ |
| Audit-Complete | Audit abgeschlossen | Report-Generator | ✅ |
| Incident-Escalated | Eskalation | Management | ✅ |

---

## 4. Integration mit Bestehenden Systemen

### 4.1 Brain API Integration
```yaml
brain_api:
  endpoint: http://127.0.0.1:9090
  capabilities:
    - rule_queries
    - compliance_checks
    - audit_reports
    - agent_communication
```

### 4.2 MCP Integration
```yaml
mcp:
  registry: /workspace/nexify/06_mcp/
  capabilities:
    - rule_engine
    - compliance_checker
    - audit_service
    - report_generator
```

### 4.3 Cloudflare Integration
```yaml
cloudflare:
  tunnel: brain+agentmemory.nexifyai.cloud
  services:
    - brain_api
    - agentmemory
    - monitoring
```

---

## 5. Sicherheit

### 5.1 Authentifizierung
- API-Key Authentifizierung
- JWT Token für Session-Management
- OAuth2 für externe Integrationen

### 5.2 Autorisierung
- RBAC (Role-Based Access Control)
- Least-Privilege Prinzip
- Audit-Logging aller API-Zugriffe

### 5.3 Verschlüsselung
- TLS 1.3 für alle API-Verbindungen
- AES-256 für Daten at Rest
- End-to-End Verschlüsselung für sensitive Daten

---

**Status:** KONFIGURIERT
**Version:** 1.0
**Endpoints:** 12
**Webhooks:** 6
