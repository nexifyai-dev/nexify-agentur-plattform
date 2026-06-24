# Monitoring/Operations — Diese-Woche-Fragen F20, F22, F23, F24

**Stand:** 2026-06-22  
**Geprüft von:** Systemmaster Agent  
**VPS-Check:** `ssh vps` (7.0.0-22-generic)

---

## F20: Incident-Response — letzter Drill?

**Status: ⚠️ KEIN formal durchgeführter Incident-Response-Drill**

### Befund:
- **Incident-Templates vorhanden:** `/root/nexifyai-platform/docs/incidents/` enthält:
  - `INCIDENT_TEMPLATE.md` — Vorlage für neue Incidents
  - `INCIDENT-002-build-error-blog-import.md` (SEV2, ✅ Closed, 2026-05-08)
  - `INCIDENT-003-vercel-deploy-all-errors.md` (SEV1, ✅ Closed, 2026-05-08)
  - `INDEX.md` — Incident-Übersicht
- **Incident-Responder Agent:** `/root/.claude/agents/incident-responder.md` existiert
- **Drill-Dateien:** Keine gefunden (kein `*drill*`, kein `*response-plan*`)
- **Rollout-Runbook:** Vorhanden unter `affilinet-portal/` (Customer-Projekt, nicht Core)

### Bewertung:
- Incident-Prozess existiert (Template + Historie), aber es gab **keinen dokumentierten Drills**
- Letzte dokumentierte Incidents: Mai 2026 (>1 Monat alt)
- **Empfehlung:** Quarterly Incident-Drill einführen, Runbook für Core-Infra erstellen

---

## F22: Alertmanager — PagerDuty/Slack-Integration konfiguriert?

**Status: ❌ NEIN — Keine aktiven Receiver konfiguriert**

### Befund:
Alertmanager (`nexify-alertmanager`) ist deployed, aber:

```yaml
# Aktuelle alertmanager.yml
receivers:
  - name: 'default-receiver'
    # webhook/email/slack: alles auskommentiert
    # webhook_configs:
    #   - url: 'http://host.docker.internal:8080/webhook'
    # email_configs:
    #   - to: 'admin@nexify.ai'
```

- **PagerDuty:** NICHT konfiguriert (kein `pagerduty_configs`-Block)
- **Slack:** NICHT konfiguriert (kein `slack_configs`-Block)
- **Webhook:** Auskommentiert
- **Email:** Auskommentiert, SMTP nur auf `localhost:587`

### Prometheus → Alertmanager Verbindung:
✅ `prometheus.yml` enthält Alertmanager-Target: `alertmanager:9093`

### Bewertung:
- Alerts werden von Prometheus erkannt, aber **an niemanden zugestellt**
- Alertmanager ist ein "stiller Beobachter" — keine Benachrichtigung bei Incidents
- **Kritisch:** Production-Monitoring ohne aktive Alert-Zustellung
- **Empfehlung:** Mindestens Slack-Webhook oder Email aktivieren

---

## F23: Bolt-Metriken — in Monitoring-Dashboard integriert?

**Status: ❌ NEIN — Keine Bolt-spezifischen Metriken im Dashboard**

### Befund:
**Grafana-Dashboard `nexify-health`:**
1. Service Status
2. CPU Usage
3. Memory Usage
4. Disk Usage
5. Network Traffic
6. Container CPU Usage (cAdvisor)
7. Container Memory Usage
8. Probe Duration (Blackbox)

**Prometheus Scrape-Targets (alle aktiv):**
- `nexify-brain` (9090) — NeXify Brain API
- `qdrant` (6333) — Vector DB
- `9router` (20128) — LLM Router
- `nexify-webui` (3080) — WebUI
- `supabase-kong`, `supabase-postgres`, `supabase-studio`
- `blackbox-http`, `blackbox-tcp` — Health Probes
- `node-exporter`, `cadvisor` — System/Container

### Bewertung:
- System- und Container-Metriken sind abgedeckt
- **Keine Bolt-spezifischen Metriken** (kein Bolt-Exporter, kein Bolt-Scrape-Target)
- Kein Bolt-Panel im Grafana-Dashboard
- **Empfehlung:** Bolt-Metriken-Endpoint identifizieren → Prometheus-Target + Dashboard-Panel hinzufügen

---

## F24: Log-Retention — wie lange werden Logs aufbewahrt?

**Status: ✅ KONFIGURIERT — Begrenzte Retention**

### Befund:
**Docker Log-Konfiguration** (`/etc/docker/daemon.json`):
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "20m",
    "max-file": "3"
  }
}
```

### Berechnung:
- **Max-Size pro Log-Datei:** 20 MB
- **Max-Anzahl Dateien:** 3 (aktive + 2 Rotated)
- **Max Speicher pro Container:** 60 MB
- **Log-Rotation:** Automatisch bei Erreichen von 20 MB
- **Retention-Zeit:** Abhängig von Log-Volumen (typisch: **1-7 Tage** bei normaler Last)

### Bewertung:
- Log-Rotation ist konfiguriert ✅
- Keine explizite Zeit-basierte Retention (nur Size-basiert)
- Bei hohem Log-Aufkommen können Logs innerhalb von Stunden rotiert werden
- **Empfehlung:** Für Compliance/Audit ggf. zentrales Logging (Loki/ELK) mit definierter Retention einführen

---

## Zusammenfassung

| Frage | Thema | Status | Priorität |
|-------|-------|--------|-----------|
| **F20** | Incident-Response Drill | ⚠️ Kein Drill durchgeführt | MEDIUM |
| **F22** | Alertmanager-Integration | ❌ Keine aktiven Receiver | **HIGH** |
| **F23** | Bolt-Metriken im Dashboard | ❌ Nicht integriert | MEDIUM |
| **F24** | Log-Retention | ✅ Size-basiert (20m×3) | LOW |

### Top-Aktionspunkte:
1. **SOFORT (F22):** Alertmanager-Slack oder -Email-Receiver konfigurieren
2. **Bald (F20):** Incident-Response-Drill planen + durchführen
3. **Bald (F23):** Bolt-Metriken in Prometheus + Grafana integrieren
4. **Optional (F24):** Zentrales Logging für längere Retention evaluieren
