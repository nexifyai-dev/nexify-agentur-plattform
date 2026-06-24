# Goose Fallback & Recovery Policy

> **Scope:** `nexify_internal`
> **Category:** `claude-code-infrastructure`
> **Stand:** 2026-06-12
> **Status:** PLANUNGSDOKUMENT
> **Klassifikation:** INTERN

---

## 1. Zweck

Diese Policy definiert, wie **Goose CLI** als **Recovery-Agent** fungiert,
wenn Claude Code, 9Remote oder die Workstation ausfallen.

Goose ist der **letzte funktionsfähige Agent** — er kann Diagnose, Restore
und Notfall-Kommunikation durchführen, solange der VPS noch erreichbar ist.

---

## 2. Fallback-Szenarien

| Szenario | Auslöser | Goose-Reaktion |
|----------|----------|----------------|
| **Claude Code ausgefallen** | Prozess tot, Port nicht erreichbar | Diagnose → Restart → Brain-Report |
| **9Remote unerreichbar** | Web-Terminal lädt nicht | Port-Check → Config-Fix → Service-Restart |
| **Workstation offline** | Browser/Desktop-App weg | SSH-Empfehlung + Status-Mail |
| **9Router-API-Fehler** | LLM-Response-Timeouts | Provider-Failover via 9Router-Settings |
| **Agentmemory-Timeout** | MCP antwortet nicht | Neustart-Versuch → Brain-Warnung |
| **Brain-Ausfall** | Health-Check schlägt fehl | Lokale Diagnose → Service-Restart |
| **System-Overload** | CPU/Memory/Disk kritisch | Ressourcen-Check → Cleanup → Alert |
| **Security-Incident** | Unautorisierter Zugriff | Isolation → Log-Sicherung → User-Alarm |

---

## 3. Recovery-Strategie

### 3.1 Prinzip

```
1. DETECT    — Erkennen ob ein Service ausgefallen ist
2. DIAGNOSE  — Ursache identifizieren (Logs, Status, Ports, Prozesse)
3. DECIDE    — Entscheiden ob Auto-Recovery möglich oder manueller Eingriff nötig
4. RECOVER   — Automatische Wiederherstellung (Restart, Config-Fix, Failover)
5. REPORT    — Ergebnis an Brain + User melden
```

### 3.2 Auto-Recovery (erlaubt ohne Freigabe)

| Aktion | Befehl | Risiko |
|--------|--------|--------|
| Claude Code neustarten | `pkill claude; claude &` | Niedrig |
| 9Remote neustarten | `systemctl restart 9remote` | Niedrig |
| Agentmemory neustarten | `docker restart agentmemory` | Mittel |
| 9Router neustarten | `docker restart 9router` | Mittel |
| Brain neustarten | `systemctl restart brain` | Mittel |
| Cloudflare Tunnel restart | `systemctl restart cloudflared` | Niedrig |

### 3.3 Manueller Eingriff (Goose darf NICHT automatisch)

| Aktion | Begründung |
|--------|------------|
| Config-Änderungen an 9Router | Provider-Config, API-Keys |
| Docker-Netzwerk-Änderungen | Kann andere Container beeinträchtigen |
| Firewall-Regeln | Kann VPS-Zugriff blockieren |
| User-Konten ändern/anlegen | Identity-Management |
| Datenbank-Migrationen | Datenverlust-Risiko |
| Secret-Rotation | Nur mit expliziter User-Freigabe |

---

## 4. Goose als Diagnose-Tool

### 4.1 Health-Check-Playbook

```bash
# 1. System-Health
goose run "Check system health: CPU, memory, disk, load, uptime"

# 2. Docker-Health
goose run "Check all running containers and their health status"

# 3. Service-Health
goose run "Check systemd status for: claude, 9remote, brain, cloudflared, docker"

# 4. Network-Health
goose run "Check network connectivity: ping, DNS, ports 3400, 32794, 3111, 80"

# 5. Claude Code CLI check
goose run "Check if claude binary exists, version, and can start"

# 6. 9Router check
goose run "Check if 9Router API responds at https://ai-router.nexifyai.cloud/health"

# 7. Agentmemory check
goose run "Check agentmemory MCP: curl http://127.0.0.1:3111/agentmemory/health"

# 8. Brain check
goose run "Check Brain API: curl https://brain.nexifyai.cloud/health"
```

### 4.2 Recovery-Playbook (Auto)

```bash
# Claude Code neu starten
goose run "Kill all claude processes and restart claude"

# 9Remote Service neustarten
goose run "Run: systemctl restart 9remote; systemctl status 9remote"

# Agentmemory Docker neustarten
goose run "Run: docker restart <agentmemory-container>; sleep 5; curl http://127.0.0.1:3111/agentmemory/health"

# Cloudflare Tunnel neustarten
goose run "Run: systemctl restart cloudflared; systemctl status cloudflared"
```

---

## 5. Brain-Integration

Jeder Recovery-Vorgang wird im Brain dokumentiert:

```json
{
  "collection": "nexifyai_brain",
  "category": "incident-recovery",
  "content": "Goose Auto-Recovery: {Szenario}. Service {Service} war down. Ursache: {Grund}. Lösung: {Aktion}. Ergebnis: {Status}.",
  "metadata": {
    "timestamp_utc": "2026-06-12T10:00:00Z",
    "agent": "goose_cli",
    "szenario": "service_outage",
    "service": "9remote",
    "status": "recovered"
  }
}
```

---

## 6. Kommunikation

| Kanal | Verwendung |
|-------|------------|
| **STDOUT** | Direkte Ausgabe an User (interaktiv) |
| **Brain** | Permanente Dokumentation |
| **Log-Datei** | `/var/log/goose-recovery.log` |
| **Handoff-Outbox** | Für nachfolgende Claude-Code-Sessions |

---

## 7. Einschränkungen

- Goose CLI läuft **manuell** — kein 24/7 ohne Goose ACC
- Goose kann **keinen Web-Terminal-Zugriff** ersetzen (9Remote-Feature)
- Bei **komplettem VPS-Ausfall** (Strom/Netzwerk/Hardware) hilft auch Goose nicht
- **Config-Änderungen** nur nach expliziter Autorisierung

---

## 8. Test-Plan

Siehe eigenes Dokument: `GOOSE_AGENTMEMORY_SYNC_TEST.md`

---

*Erstellt 2026-06-12 im Rahmen von P0-007 (Goose CLI Fallback/Recovery).
Ergänzt `GOOSE_AGENTMEMORY_SYNC_TEST.md` und `goose-fallback-recovery-policy.json`.*
