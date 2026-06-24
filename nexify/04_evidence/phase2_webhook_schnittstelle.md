# Webhook-Schnittstelle — Phase 2.3.3

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

Die Webhook-Schnittstelle ermöglicht event-getriebene Automatisierung für Regelwerks- und Compliance-Prozesse.

### 1.1 Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                Webhook-Schnittstelle v1.0                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Event Sources                                        │  │
│  │  - Compliance-Check Module                            │  │
│  │  - Rule Engine                                        │  │
│  │  - Security Scanner                                   │  │
│  │  - Monitoring (Alertmanager)                          │  │
│  │  - External Systems (GitHub, Cloudflare)              │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Webhook Dispatcher                                   │  │
│  │  - Event-Filterung                                    │  │
│  │  - Payload-Transformation                             │  │
│  │  - Retry-Logik (3x, exponential backoff)              │  │
│  │  - Dead-Letter-Queue                                  │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Webhook Endpoints                                    │  │
│  │  - Incoming: 3 Endpoints                              │  │
│  │  - Outgoing: 3 Endpoints                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Incoming Webhooks (Empfang)

### 2.1 POST /api/v1/webhooks/compliance-event
Empfängt Compliance-Events von externen Systemen.

**Request Headers:**
```
Content-Type: application/json
X-Webhook-Secret: <hmac_sha256_signature>
X-Webhook-Timestamp: <unix_timestamp>
```

**Request Body:**
```json
{
  "event_type": "compliance.violation",
  "source": "external_scanner",
  "timestamp": "2026-06-23T10:30:00Z",
  "data": {
    "regelwerk": "ISO-27001",
    "anforderung": "A.12.1.2",
    "status": "verstoss",
    "details": "Change Management nicht dokumentiert"
  }
}
```

**Response:**
```json
{
  "status": "accepted",
  "webhook_id": "WH-2026-06-23-001",
  "processed_at": "2026-06-23T10:30:01Z"
}
```

### 2.2 POST /api/v1/webhooks/security-event
Empfängt Sicherheitsereignisse.

**Event Types:**
- `security.vulnerability_detected`
- `security.secret_exposed`
- `security.intrusion_attempt`
- `security.access_violation`

### 2.3 POST /api/v1/webhooks/infrastructure-event
Empfängt Infrastruktur-Events.

**Event Types:**
- `infrastructure.service_down`
- `infrastructure.high_cpu`
- `infrastructure.disk_full`
- `infrastructure.backup_failed`

---

## 3. Outgoing Webhooks (Versand)

### 3.1 Compliance-Violation Webhook
Sendet Compliance-Verstöße an registrierte Systeme.

**Configuration:**
```json
{
  "webhook_id": "OUT-COMPLIANCE-001",
  "name": "Compliance Violation Notification",
  "url": "https://external-system.example.com/webhooks/compliance",
  "events": ["compliance.violation", "compliance.score_changed"],
  "secret": "<shared_secret>",
  "retry": {
    "max_attempts": 3,
    "backoff": "exponential",
    "initial_delay_ms": 1000
  }
}
```

**Payload:**
```json
{
  "event_type": "compliance.violation",
  "source": "nexifyai",
  "timestamp": "2026-06-23T10:30:00Z",
  "data": {
    "violation_id": "V-001",
    "regelwerk": "ISO-27001",
    "schweregrad": "hoch",
    "beschreibung": "Change Management nicht dokumentiert",
    "naechste_pruefung": "2026-06-24T02:00:00Z"
  },
  "signature": "sha256=<hmac_signature>"
}
```

### 3.2 Security-Alert Webhook
Sendet Sicherheitswarnungen.

**Configuration:**
```json
{
  "webhook_id": "OUT-SECURITY-001",
  "name": "Security Alert Notification",
  "url": "https://soc.example.com/webhooks/security",
  "events": ["security.vulnerability_detected", "security.intrusion_attempt"],
  "priority": "high"
}
```

### 3.3 Status-Update Webhook
Sendet Status-Updates an Monitoring/Dashboard.

**Configuration:**
```json
{
  "webhook_id": "OUT-STATUS-001",
  "name": "System Status Update",
  "url": "https://dashboard.nexifyai.cloud/api/status",
  "events": ["system.health_changed", "compliance.score_changed"],
  "batch": {
    "enabled": true,
    "max_size": 50,
    "flush_interval_ms": 5000
  }
}
```

---

## 4. Sicherheit

### 4.1 HMAC-Signatur-Verifikation

```python
import hmac
import hashlib

def verify_webhook_signature(payload, signature, secret):
    """Verifiziert HMAC-SHA256 Signatur."""
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

### 4.2 Timestamp-Validierung
- Max. Alter: 5 Minuten
- Schutz gegen Replay-Attacks

### 4.3 IP-Whitelist (Optional)
- Nur erlaubte Quell-IPs akzeptiert
- Konfigurierbar pro Webhook

---

## 5. Retry-Logik

### 5.1 Exponential Backoff

| Versuch | Delay | Kumulativ |
|---------|-------|-----------|
| 1 | 1s | 1s |
| 2 | 2s | 3s |
| 3 | 4s | 7s |

### 5.2 Dead-Letter-Queue
- Nach 3 fehlgeschlagenen Versuchen
- Manuelle Retry oder Archivierung
- Monitoring-Alert bei DLQ-Einträgen

---

## 6. Event-Typen

### 6.1 Compliance Events

| Event | Trigger | Priorität |
|-------|---------|-----------|
| `compliance.violation` | Compliance-Check fehlgeschlagen | Hoch |
| `compliance.score_changed` | Score um >5% geändert | Mittel |
| `compliance.check_completed` | Check abgeschlossen | Niedrig |
| `compliance.report_ready` | Report generiert | Niedrig |

### 6.2 Security Events

| Event | Trigger | Priorität |
|-------|---------|-----------|
| `security.vulnerability_detected` | CVE gefunden | Kritisch |
| `security.secret_exposed` | Secret-Leak erkannt | Kritisch |
| `security.intrusion_attempt` | Angriff erkannt | Kritisch |
| `security.access_violation` | Unbefugter Zugriff | Hoch |

### 6.3 Infrastructure Events

| Event | Trigger | Priorität |
|-------|---------|-----------|
| `infrastructure.service_down` | Service nicht erreichbar | Kritisch |
| `infrastructure.high_cpu` | CPU > 90% | Hoch |
| `infrastructure.disk_full` | Disk > 95% | Kritisch |
| `infrastructure.backup_failed` | Backup fehlgeschlagen | Hoch |

---

## 7. Monitoring

### 7.1 Metriken (Prometheus)

```
webhook_requests_total{endpoint, status, method}
webhook_processing_duration_seconds{endpoint}
webhook_queue_size{direction}
webhook_dlq_size
webhook_retry_total{endpoint, attempt}
```

### 7.2 Alerts

| Alert | Bedingung | Aktion |
|-------|-----------|--------|
| WebhookHighErrorRate | Error-Rate > 10% | PagerDuty |
| WebhookDLQGrowing | DLQ > 100 Einträge | E-Mail |
| WebhookProcessingSlow | p99 > 5s | Slack |

---

## 8. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| Incoming Endpoints | ✅ 3 definiert | API-Spec |
| Outgoing Endpoints | ✅ 3 konfiguriert | Config |
| HMAC-Sicherheit | ✅ Implementiert | Signatur-Verifikation |
| Retry-Logik | ✅ Konfiguriert | 3x exponential |
| Dead-Letter-Queue | ✅ Implementiert | DLQ-Setup |
| Event-Typen | ✅ 12 definiert | Event-Katalog |
| Monitoring | ✅ Konfiguriert | Prometheus + Alerts |

---

**Status:** ✅ ABGESCHLOSSEN
**Endpoints:** 6 (3 incoming, 3 outgoing)
**Event-Typen:** 12
**Version:** 1.0
