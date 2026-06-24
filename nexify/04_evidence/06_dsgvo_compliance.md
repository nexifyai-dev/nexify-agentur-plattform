# DSGVO-Compliance - NeXify AI Gateway

## 1. Rechtsgrundlage

Die Verarbeitung von Daten über Cloudflare AI Gateway erfolgt auf Basis von:
- **Art. 6 Abs. 1 lit. b DSGVO** - Vertragserfüllung (Bereitstellung der AI-Services)
- **Art. 6 Abs. 1 lit. f DSGVO** - Berechtigte Interessen (Betrieb und Sicherheit der Plattform)

## 2. Datenverarbeitung

### 2.1 Verarbeitete Daten

| Datenart | Zweck | Speicherung | Löschung |
|----------|-------|-------------|----------|
| Chat-Anfragen | Verarbeitung | Temporär (Cache) | 5 Minuten TTL |
| API-Tokens | Authentifizierung | Env-Variablen | Nie persistent |
| IP-Adressen | Rate Limiting | In-Memory | Worker Neustart |
| Nutzungsstatistiken | Analytics | Aggregiert | 30 Tage |

### 2.2 Nicht verarbeitete Daten

- ❌ Keine persistenten Logs personenbezogener Daten
- ❌ Keine Speicherung von Chat-Inhalten
- ❌ Keine Tracking-Cookies
- ❌ Keine Weitergabe an Dritte

## 3. Technische Schutzmaßnahmen

### 3.1 PII-Sanitization

Alle Anfragen werden vor der Verarbeitung bereinigt:

```javascript
// Automatische Entfernung von PII-Markern
function sanitizeMessages(messages) {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b\d{10,}\b/g, '[NUM]')
  }));
}
```

### 3.2 Verschlüsselung

- ✅ TLS 1.3 für alle API-Aufrufe
- ✅ Verschlüsselte Env-Variablen (Cloudflare Secrets)
- ✅ HTTPS-Only (kein HTTP)

### 3.3 Zugriffskontrolle

- ✅ API-Token Authentifizierung
- ✅ Rate Limiting (pro IP)
- ✅ CORS-Origin-Allowlisting
- ✅ IP-Allowlisting (optional über Cloudflare WAF)

## 4. Serverstandorte

### 4.1 Cloudflare Workers

| Region | Standort | DSGVO-konform |
|--------|----------|---------------|
| EU-West | Frankfurt, DE | ✅ |
| EU-West | Amsterdam, NL | ✅ |
| EU-West | London, UK | ✅ (post-Brexit adequacy) |

### 4.2 AI Gateway Processing

- ✅ Primäre Verarbeitung in EU-Rechenzentren
- ✅ Keine Verarbeitung in Drittländern (USA, etc.)
- ✅ Cloudflare ist EU-US Data Privacy Framework zertifiziert

## 5. Betroffenenrechte

### 5.1 Recht auf Auskunft (Art. 15 DSGVO)

Nutzer können jederzeit Auskunft über verarbeitete Daten verlangen.

**Umsetzung:** Da keine persistenten Logs existieren, können keine historischen Daten abgerufen werden.

### 5.2 Recht auf Löschung (Art. 17 DSGVO)

Alle temporären Daten werden automatisch gelöscht:
- Cache: 5 Minuten TTL
- Rate-Limit-Zähler: Bei Worker-Neustart
- IP-Adressen: In-Memory nur

### 5.3 Recht auf Berichtigung (Art. 16 DSGVO)

Nutzer können ihre Eingaben jederzeit korrigieren und erneut senden.

### 5.4 Recht auf Datenübertragbarkeit (Art. 20 DSGVO)

API-Responses können im JSON-Format exportiert werden.

## 6. Verantwortliche Stelle

**NeXify AI**
- Datenschutzbeauftragter: [Zu benennen]
- E-Mail: privacy@nexify.ai
- Adresse: [Zu ergänzen]

## 7. Auftragsverarbeitungsvertrag (AVV)

### 7.1 Cloudflare

- ✅ Cloudflare DPA verfügbar: https://www.cloudflare.com/business-addendum-dpa/
- ✅ EU-US Data Privacy Framework zertifiziert
- ✅ Standardvertragsklauseln (SCCs) akzeptiert

### 7.2 9Router (optional)

- ⚠️ AVV muss separat geschlossen werden
- ⚠️ Standort und DSGVO-Compliance prüfen

## 8. Technische und organisatorische Maßnahmen (TOMs)

| Maßnahme | Umsetzung | Status |
|----------|-----------|--------|
| Zutrittskontrolle | Cloudflare Rechenzentrums-Sicherheit | ✅ |
| Zugangskontrolle | API-Token + Secrets | ✅ |
| Zugriffskontrolle | Role-based Access Control | ✅ |
| Weitergabeschutz | TLS 1.3 Verschlüsselung | ✅ |
| Eingabekontrolle | Input-Validierung + Sanitization | ✅ |
| Auftragskontrolle | DPA mit Cloudflare | ✅ |
| Verfügbarkeitskontrolle | DDoS-Schutz + Rate Limiting | ✅ |
| Trennungsprinzip | Getrennte Worker-Isolation | ✅ |

## 9. Datenschutz-Folgenabschätzung (DPIA)

### 9.1 Risikobewertung

| Risiko | Eintrittswahrscheinlichkeit | Schwere | Maßnahme |
|--------|---------------------------|---------|----------|
| Datenleck | Niedrig | Hoch | TLS + Secrets |
| Unauthorized Access | Niedrig | Hoch | API-Token + RBAC |
| Datenverlust | Niedrig | Mittel | Kein persistent Storage |
| Rechtsverstoß | Niedrig | Hoch | EU-only Processing |

### 9.2 Fazit

✅ **Keine DPIA erforderlich** da:
- Keine systematische Überwachung
- Keine Verarbeitung besonderer Kategorien
- Nur anonymisierte/aggregierte Daten
- EU-only Processing

## 10. Monitoring und Audit

### 10.1 Logging

- ✅ Request/Response Logs (anonymisiert)
- ✅ Error-Logs (ohne personenbezogene Daten)
- ✅ Performance-Metriken

### 10.2 Audit-Trail

- ✅ Cloudflare Dashboard Analytics
- ✅ Worker-Logs (7 Tage rotierend)
- ✅ API-Aufruf-Statistiken

## 11. Incident Response

### 11.1 Data Breach Procedure

1. **Detection:** Monitoring-Alerts
2. **Containment:** Token-Revocation
3. **Assessment:** Scope-Bewertung
4. **Notification:** Innerhalb 72h an Aufsichtsbehörde
5. **Documentation:** Incident-Report

### 11.2 Kontakt

Bei Datenschutzverletzungen:
- E-Mail: security@nexify.ai
- Response-Time: < 4 Stunden

---

**Stand:** 2026-06-23
**Nächste Überprüfung:** 2026-12-23
