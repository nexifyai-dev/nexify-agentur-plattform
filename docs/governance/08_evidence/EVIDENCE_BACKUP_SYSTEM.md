# Evidence: Backup-System (Pattern 2: BACKUP)

**Datum:** 2026-06-22 12:52 CEST  
**Status:** ✅ ERFOLGREICH  
**Verantwortlich:** DevOps Agent (Agentic Run)

---

## 1. Systemübersicht

| Komponente | Details |
|------------|---------|
| Backup-Tool | restic 0.18.1 (go1.25.0, linux/amd64) |
| Repository | /opt/nexify/backup/data |
| Passwort-Datei | /opt/nexify/backup/.restic-password (chmod 600) |
| Kompression | auto (Ratio: 3.78x) |
| Aufbewahrung | 30 Tage (keep-daily) |
| Zeitplan | Täglich 03:00 Uhr (systemd timer) |

---

## 2. Backup-Ziele

| Ziel | Pfad | Status |
|------|------|--------|
| Brain | /opt/nexify/brain | ✅ |
| PostgreSQL (Supabase) | pg_dumpall → /tmp/nexify-pg-backup-*.sql | ✅ |
| Qdrant | /var/lib/docker/volumes/qdrant_data/_data | ✅ |
| 9Router | /var/lib/docker/volumes/9router-6kxn_data/_data | ✅ |
| 9Router Usage | /var/lib/docker/volumes/9router-6kxn_usage-data/_data | ✅ |
| Workspace | /workspace/nexify | ✅ |
| Agent Memory | /workspace/nexify/memory | ✅ |
| Skills | /workspace/nexify/05_skills | ✅ |

---

## 3. Erstes Backup (2026-06-22 12:51)

```
Snapshot ID: 4d5a0e9f
Host: srv1243952
Tags: nexify-daily
Paths: 8 (siehe oben)
Files processed: 12,982
Data size: 1.519 GiB
Stored size: 303 MiB (156.847 MiB compressed)
Compression ratio: 3.78x
Duration: ~12 seconds
Status: OK (no errors)
```

---

## 4. systemd-Konfiguration

### Timer (/etc/systemd/system/nexify-backup.timer)
```ini
[Unit]
Description=NeXify Backup Timer (daily at 03:00)

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
```

### Service (/etc/systemd/system/nexify-backup.service)
```ini
[Unit]
Description=NeXify Backup Service (restic)
Wants=network-online.target
After=network-online.target docker.service

[Service]
Type=oneshot
ExecStart=/opt/nexify/backup/backup.sh
Nice=19
IOSchedulingClass=idle
IOSchedulingPriority=7
```

### Timer Status
```
● nexify-backup.timer - NeXify Backup Timer (daily at 03:00)
     Loaded: loaded (/etc/systemd/system/nexify-backup.timer; enabled)
     Active: active (waiting)
    Trigger: Tue 2026-06-23 03:01:05 CEST; 14h left
```

---

## 5. Backup-Skript (/opt/nexify/backup/backup.sh)

**Features:**
- set -euo pipefail (robust error handling)
- PostgreSQL Dump vor restic Backup
- Automatische Repo-Initialisierung
- Ausschlüsse: *.pyc, __pycache__, node_modules, .git, *.log
- Automatisches Pruning (30 Tage)
- Verifizierung (5% data subset)
- Log-Dateien in /opt/nexify/backup/logs/

---

## 6. Verifizierung

```bash
# Restic Version
restic 0.18.1 compiled with go1.25.0 on linux/amd64

# Repository Struktur
/opt/nexify/backup/data/
├── config
├── data/ (258 subdirs)
├── index/
├── keys/
├── locks/
└── snapshots/

# Erster Snapshot
ID        Time                 Host        Tags          Paths
4d5a0e9f  2026-06-22 12:51:54  srv1243952  nexify-daily  8 paths, 1.519 GiB

# Check (keine Fehler)
check snapshots, trees and blobs
[0:00] 100.00%  1 / 1 snapshots
read 5.0% of data packs
[0:00] 100.00%  1 / 1 packs
no errors were found
```

---

## 7. Restore-Anleitung

```bash
# Repository konfigurieren
export RESTIC_REPOSITORY=/opt/nexify/backup/data
export RESTIC_PASSWORD_FILE=/opt/nexify/backup/.restic-password

# Snapshots anzeigen
restic snapshots

# Dateien aus letztem Snapshot wiederherstellen
restic restore latest --target /restore/path

# Bestimmte Datei wiederherstellen
restic restore latest --target /restore/path --include /path/to/file

# PostgreSQL Restore
restic dump latest /tmp/nexify-pg-backup-YYYYMMDD.sql | docker exec -i supabase_db_root psql -U postgres
```

---

## 8. Wartung

```bash
# Manueller Backup-Start
systemctl start nexify-backup.service

# Logs anzeigen
journalctl -u nexify-backup.service -f

# Backup-Logs
ls -la /opt/nexify/backup/logs/

# Repository prüfen
restic check

# Snapshots auflisten
restic snapshots

# Alte Snapshots manuell löschen
restic forget --keep-daily 30 --prune
```

---

## 9. Sicherheitshinweise

- ⚠️ Passwort-Datei: `/opt/nexify/backup/.restic-password` (chmod 600, root only)
- ⚠️ KEINE Secrets in Git/Logs
- ⚠️ Repository-Password für Restore notwendig (sicher aufbewahren!)

---

**Evidence erstellt:** 2026-06-22 12:52 CEST  
**Nächster Backup-Lauf:** 2026-06-23 03:01 CEST
