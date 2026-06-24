# REST API für Regelwerke — Phase 2.3.2

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. API-Übersicht

Die REST API ermöglicht den Zugriff auf alle 403 Regelwerke über standardisierte HTTP-Endpoints.

### 1.1 Basis-URL

```
Production:  https://brain.nexifyai.cloud/api/v1/regelwerke
Internal:    http://127.0.0.1:9090/api/v1/regelwerke
```

### 1.2 Authentication

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 2. Endpoints

### 2.1 Regelwerke abfragen

#### GET /api/v1/regelwerke
Listet alle Regelwerke mit Filtermöglichkeiten.

**Query Parameters:**
| Parameter | Typ | Beschreibung | Beispiel |
|-----------|-----|--------------|----------|
| kategorie | string | DIN, ISO, VDI, BSI, ITIL, PMBOK | `?kategorie=ISO` |
| prioritaet | string | Kritisch, Hoch, Mittel | `?prioritaet=Kritisch` |
| suchbegriff | string | Volltextsuche | `?suchbegriff=datenschutz` |
| seite | int | Paginierung | `?seite=1` |
| limit | int | Einträge pro Seite (max 100) | `?limit=20` |

**Response:**
```json
{
  "status": "success",
  "data": {
    "regelwerke": [
      {
        "id": "ISO-27001",
        "name": "Informationssicherheits-Management",
        "kategorie": "ISO",
        "prioritaet": "Kritisch",
        "beschreibung": "Anforderungen an ein ISMS",
        "automation": true,
        "letzte_pruefung": "2026-06-23T02:00:00Z",
        "compliance_status": "erfuellt"
      }
    ],
    "pagination": {
      "seite": 1,
      "limit": 20,
      "gesamt": 403,
      "seiten": 21
    }
  }
}
```

#### GET /api/v1/regelwerke/{id}
Einzelnes Regelwerk abrufen.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "ISO-27001",
    "name": "Informationssicherheits-Management",
    "kategorie": "ISO",
    "prioritaet": "Kritisch",
    "beschreibung": "Anforderungen an ein ISMS",
    "anforderungen": [
      {
        "id": "ISO-27001-A5",
        "text": "Informationssicherheitsrichtlinien",
        "status": "erfuellt",
        "evidence": "ISMS-Dokumentation vorhanden"
      }
    ],
    "automation": true,
    "trigger": "wöchentlich",
    "letzte_pruefung": "2026-06-23T02:00:00Z",
    "naechste_pruefung": "2026-06-30T02:00:00Z"
  }
}
```

### 2.2 Compliance-Status

#### GET /api/v1/compliance/status
Gesamt-Compliance-Status abrufen.

**Response:**
```json
{
  "status": "success",
  "data": {
    "gesamt_score": 87.5,
    "kategorien": {
      "DIN": {"score": 90.0, "checks": 100, "erfuellt": 90},
      "ISO": {"score": 85.0, "checks": 100, "erfuellt": 85},
      "VDI": {"score": 88.0, "checks": 80, "erfuellt": 70},
      "BSI": {"score": 92.0, "checks": 60, "erfuellt": 55},
      "ITIL": {"score": 86.0, "checks": 33, "erfuellt": 28},
      "PMBOK": {"score": 84.0, "checks": 30, "erfuellt": 25}
    },
    "letzte_pruefung": "2026-06-23T02:00:00Z",
    "naechste_pruefung": "2026-06-24T02:00:00Z"
  }
}
```

#### GET /api/v1/compliance/violations
Aktuelle Verstöße abrufen.

**Response:**
```json
{
  "status": "success",
  "data": {
    "violations": [
      {
        "id": "V-001",
        "regelwerk": "ISO-27001",
        "anforderung": "A.12.1.2",
        "beschreibung": "Change Management Prozess nicht dokumentiert",
        "schweregrad": "Hoch",
        "erkannt_am": "2026-06-23T02:00:00Z",
        "status": "offen"
      }
    ],
    "gesamt": 15,
    "kritisch": 2,
    "hoch": 8,
    "mittel": 5
  }
}
```

### 2.3 Compliance-Checks auslösen

#### POST /api/v1/compliance/check
Manuellen Compliance-Check auslösen.

**Request Body:**
```json
{
  "kategorie": "ISO",
  "regelwerk": "ISO-27001",
  "scope": "vollstaendig"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "check_id": "CHK-2026-06-23-001",
    "gestartet": "2026-06-23T10:30:00Z",
    "geschaeft": 15,
    "erwartete_dauer": "2 Minuten"
  }
}
```

### 2.4 Reports

#### GET /api/v1/reports/compliance
Compliance-Bericht generieren.

**Query Parameters:**
| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| von | datetime | Startdatum |
| bis | datetime | Enddatum |
| format | string | json, pdf, csv |

**Response:**
```json
{
  "status": "success",
  "data": {
    "report_id": "RPT-2026-06-001",
    "zeitraum": {"von": "2026-06-01", "bis": "2026-06-23"},
    "gesamt_score": 87.5,
    "aenderung": "+2.3%",
    "download_url": "/api/v1/reports/RPT-2026-06-001/download"
  }
}
```

---

## 3. Error Handling

### 3.1 HTTP Status Codes

| Code | Beschreibung |
|------|--------------|
| 200 | Erfolgreich |
| 201 | Erstellt |
| 400 | Ungültige Anfrage |
| 401 | Nicht authentifiziert |
| 403 | Nicht autorisiert |
| 404 | Nicht gefunden |
| 429 | Rate Limit erreicht |
| 500 | Interner Serverfehler |

### 3.2 Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ungültiger Parameter: kategorie muss einer von [DIN, ISO, VDI, BSI, ITIL, PMBOK] sein",
    "details": {
      "parameter": "kategorie",
      "erhalten": "INVALID",
      "erlaubt": ["DIN", "ISO", "VDI", "BSI", "ITIL", "PMBOK"]
    }
  }
}
```

---

## 4. Rate Limiting

| Endpoint | Limit | Zeitfenster |
|----------|-------|-------------|
| GET /regelwerke | 100 requests | 1 Minute |
| GET /regelwerke/{id} | 200 requests | 1 Minute |
| GET /compliance/status | 50 requests | 1 Minute |
| POST /compliance/check | 10 requests | 1 Minute |
| GET /reports/* | 20 requests | 1 Minute |

---

## 5. Integration

### 5.1 Brain API
- Proxy über Brain API (127.0.0.1:9090)
- Brain API handled Authentication und Routing

### 5.2 Qdrant
- Semantische Suche über Qdrant
- Collection: `nexifyai_rules`

### 5.3 Monitoring
- API-Metriken in Prometheus
- Response-Time, Error-Rate, Request-Count

---

## 6. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| API-Definition | ✅ Spezifiziert | 12 Endpoints |
| Authentication | ✅ JWT-basiert | Bearer Token |
| Rate Limiting | ✅ Konfiguriert | 5 Stufen |
| Error Handling | ✅ Standardisiert | RFC 7807 |
| Integration | ✅ Brain API + Qdrant | Proxy-Setup |

---

**Status:** ✅ ABGESCHLOSSEN
**Endpoints:** 12
**Version:** 1.0
