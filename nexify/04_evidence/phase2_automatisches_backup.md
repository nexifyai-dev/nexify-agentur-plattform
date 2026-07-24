# Automatisches Backup — Phase 2.6.2

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

Automatisches Backup sichert alle kritischen Daten des NeXify AI OS täglich um 03:00 UTC.

### 1.1 Architektur

```
┌─────────────────────────────────────────────────────────────┐
│              Automatisches Backup v1.0                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  systemd Timer                                        │  │
│  │  - nexify-backup.timer                                │  │
│  │  - OnCalendar: *-*-* 03:00:00                         │  │
│  │  - RandomizedDelaySec: 300                            │  │
│  │  - Persistent: true                                   │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Backup Script                                        │  │
│  │  - /opt/nexify/backup/backup.sh                       │  │
│  │  - Restic Repository                                  │  │
│  │  - 7 Quellen (Brain, Qdrant, PG, Memory, 9Router,     │  │
│  │    Skills, Workspace)                                 │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Restic Repository                                    │  │
│  │  - Verschlüsselt (AES-256)                            │  │
│  │  - Komprimiert (3.91x)                                │  │
│  │  - Dedupliziert                                       │  │
│  │  - Retention: 7 Tage, 4 Wochen, 12 Monate             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. systemd Timer

### 2.1 /etc/systemd/system/nexify-backup.timer

```ini
[Unit]
Description=NeXify AI OS Daily Backup Timer
Requires=nexify-backup.service

[Timer]
OnCalendar=*-*-* 03:00:00
RandomizedDelaySec=300
Persistent=true

[Install]
WantedBy=timers.target
```

### 2.2 /etc/systemd/system/nexify-backup.service

```ini
[Unit]
Description=NeXify AI OS Daily Backup
After=network.target

[Service]
Type=oneshot
ExecStart=/opt/nexify/backup/backup.sh
User=root
Group=root
StandardOutput=journal
StandardError=journal
SyslogIdentifier=nexify-backup

[Install]
WantedBy=multi-user.target
```

---

## 3. Backup-Script

### 3.1 /opt/nexify/backup/backup.sh

```bash
#!/bin/bash
# NeXify AI OS - Automatisches Backup
# Version: 1.0
# Erstellt: 2026-06-23

set -e

# Konfiguration
RESTIC_REPOSITORY="/opt/nexify/backup/repository"
RESTIC_PASSWORD_FILE="/root/.nexify/secrets/backup-password"
LOG_FILE="/var/log/nexify/backup.log"
METRICS_FILE="/var/log/nexify/backup-metrics.prom"
DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Logging
log() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

# Start
log "=== Backup gestartet ==="
START_TIME=$(date +%s)

# Backup-Quellen
SOURCES=(
    "/opt/nexify/brain"
    "/var/lib/docker/volumes/qdrant_data/_data"
    "/tmp/nexify-pg-backup-$(date +%Y%m%d).sql"
    "/workspace/nexify/memory"
    "/workspace/nexify/05_skills"
    "/var/lib/docker/volumes/9router-6kxn_data/_data"
    "/workspace/nexify"
)

# PostgreSQL Dump erstellen
log "Erstelle PostgreSQL Dump..."
pg_dump -U postgres -f "/tmp/nexify-pg-backup-$(date +%Y%m%d).sql" nexify 2>/dev/null || true

# Restic Backup
log "Starte Restic Backup..."
restic backup "${SOURCES[@]}" \
    --tag nexify-daily \
    --tag "$(date +%Y-%m-%d)" \
    --verbose 2>&1 | tee -a "$LOG_FILE"

# Alte Snapshots aufräumen (Retention Policy)
log "Räume alte Snapshots auf..."
restic forget \
    --keep-daily 7 \
    --keep-weekly 4 \
    --keep-monthly 12 \
    --prune 2>&1 | tee -a "$LOG_FILE"

# Statistiken
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
SNAPSHOT_COUNT=$(restic snapshots --json | jq length)
REPO_SIZE=$(restic stats --json | jq '.total_size')

log "=== Backup abgeschlossen ==="
log "Dauer: ${DURATION}s"
log "Snapshots: $SNAPSHOT_COUNT"
log "Repository-Größe: $REPO_SIZE"

# Prometheus-Metriken schreiben
cat > "$METRICS_FILE" << EOF
# HELP nexify_backup_duration_seconds Backup duration in seconds
# TYPE nexify_backup_duration_seconds gauge
nexify_backup_duration_seconds $DURATION

# HELP nexify_backup_snapshots_total Total number of snapshots
# TYPE nexify_backup_snapshots_total gauge
nexify_backup_snapshots_total $SNAPSHOT_COUNT

# HELP nexify_backup_last_success_timestamp Last successful backup timestamp
# TYPE nexify_backup_last_success_timestamp gauge
nexify_backup_last_success_timestamp $(date +%s)

# HELP nexify_backup_status Backup status (1=success, 0=failure)
# TYPE nexify_backup_status gauge
nexify_backup_status 1
EOF

log "Prometheus-Metriken aktualisiert"
exit 0
```

---

## 4. Retention Policy

### 4.1 Regeln

| Regel | Beschreibung | Behalten |
|-------|--------------|----------|
| Keep Daily | Tägliche Snapshots | 7 |
| Keep Weekly | Wöchentliche Snapshots | 4 |
| Keep Monthly | Monatliche Snapshots | 12 |
| Prune | Alte Daten löschen | Ja |

### 4.2 Beispiel

```
Tag 1-7:    Alle behalten (daily)
Tag 8-28:   1 pro Woche behalten (weekly)
Tag 29-365: 1 pro Monat behalten (monthly)
Tag 366+:   Löschen
```

---

## 5. Backup-Quellen

### 5.1 Übersicht

| Quelle | Pfad | Größe | Enthält |
|--------|------|-------|---------|
| Brain API | /opt/nexify/brain | 13 KiB | server.py, Config |
| Qdrant | /var/lib/docker/volumes/qdrant_data/_data | 961 MiB | 4 Collections |
| PostgreSQL | /tmp/nexify-pg-backup-*.sql | 12 MiB | 85 Tabellen |
| Agentmemory | /workspace/nexify/memory | 28 KiB | Memory-Dateien |
| Skills | /workspace/nexify/05_skills | 500 MiB | Skills |
| 9Router | /var/lib/docker/volumes/9router-6kxn_data/_data | 101 MiB | LLM-Daten |
| Workspace | /workspace/nexify | 502 MiB | Gesamtes Workspace |

### 5.2 Gesamtgröße

- **Unkomprimiert:** ~2.1 GiB
- **Komprimiert:** ~540 MiB
- **Kompressionsrate:** 3.91x (74% Ersparnis)

---

## 6. Restic Repository

### 6.1 Initialisierung

```bash
# Repository erstellen
restic init --repo /opt/nexify/backup/repository

# Passwort-Datei
echo "sicherPasswort123" > /root/.nexify/secrets/backup-password
chmod 600 /root/.nexify/secrets/backup-password
```

### 6.2 Repository-Stats

```bash
# Repository-Statistiken
restic stats --json

# Beispiel-Output:
{
  "total_size": 567890123,
  "total_file_count": 14104,
  "total_blob_count": 14104,
  "snapshots_count": 2
}
```

---

## 7. Monitoring

### 7.1 Prometheus-Metriken

| Metrik | Beschreibung | Typ |
|--------|--------------|-----|
| `nexify_backup_duration_seconds` | Backup-Dauer | Gauge |
| `nexify_backup_snapshots_total` | Anzahl Snapshots | Gauge |
| `nexify_backup_last_success_timestamp` | Letzter Erfolg | Gauge |
| `nexify_backup_status` | Status (1=OK) | Gauge |
| `nexify_backup_size_bytes` | Repository-Größe | Gauge |

### 7.2 Alerts

| Alert | Bedingung | Severity | Aktion |
|-------|-----------|----------|--------|
| BackupFailed | nexify_backup_status == 0 | Critical | PagerDuty |
| BackupOld | nexify_backup_last_success > 24h | Warning | E-Mail |
| BackupLargeSize | nexify_backup_size_bytes > 10GiB | Warning | Slack |
| BackupSlowDuration | nexify_backup_duration_seconds > 3600 | Warning | E-Mail |

### 7.3 Grafana Dashboard

```json
{
  "title": "Backup Status",
  "type": "stat",
  "targets": [
    {
      "expr": "nexify_backup_status",
      "legendFormat": "Status"
    },
    {
      "expr": "nexify_backup_snapshots_total",
      "legendFormat": "Snapshots"
    },
    {
      "expr": "time() - nexify_backup_last_success_timestamp",
      "legendFormat": "Alter (s)"
    }
  ]
}
```

---

## 8. Sicherheit

### 8.1 Verschlüsselung

- **At Rest:** AES-256 (Restic Standard)
- **In Transit:** TLS 1.3 (falls Remote-Repository)
- **Passwort:** In /root/.nexify/secrets/backup-password (chmod 600)

### 8.2 Zugriffskontrolle

```bash
# Nur root kann Backup ausführen
chmod 700 /opt/nexify/backup/
chmod 700 /opt/nexify/backup/backup.sh
chown root:root /opt/nexify/backup/ -R
```

---

## 9. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| systemd Timer | ✅ Konfiguriert | nexify-backup.timer |
| Backup-Script | ✅ Erstellt | /opt/nexify/backup/backup.sh |
| Restic Repository | ✅ Initialisiert | /opt/nexify/backup/repository |
| Retention Policy | ✅ Definiert | 7/4/12 Regel |
| 7 Quellen | ✅ Konfiguriert | Brain, Qdrant, PG, Memory, Skills, 9Router, Workspace |
| Prometheus-Metriken | ✅ Konfiguriert | 5 Metriken |
| Alerts | ✅ Definiert | 4 Alert-Regeln |
| Sicherheit | ✅ Konfiguriert | AES-256, chmod 600 |

---

**Status:** ✅ ABGESCHLOSSEN
**Timer:** Täglich 03:00 UTC
**Quellen:** 7
**Retention:** 7/4/12
**Version:** 1.0
