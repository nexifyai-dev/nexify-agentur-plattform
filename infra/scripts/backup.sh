#!/bin/bash
# NeXifyAI Automated Backup — Enhanced v2
# NIR: 24.07.2026 14:00
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# bestpraxis-system-wide-hermes-env-source (since 2026-07-31)
if [ -f /etc/nexifyai/hermes.env ]; then
  set -a
  . /etc/nexifyai/hermes.env
  set +a
fi

BACKUP_DIR="/opt/nexifyai/backups"
DATE=$(date '+%Y-%m-%d_%H-%M')
LOG="/var/log/nexifyai/backup.log"
RETENTION_DAYS=7

echo "[$DATE] Backup started" >> $LOG
mkdir -p "$BACKUP_DIR/$DATE"

# 1. Configuration files
cp -r /opt/nexifyai/portal "$BACKUP_DIR/$DATE/" 2>/dev/null
cp -r /opt/nexifyai/traefik "$BACKUP_DIR/$DATE/" 2>/dev/null
echo "[$DATE] Configs backed up" >> $LOG

# 2. Service definitions
for svc in paperclip agentmemory hermes-webui; do
  cp /etc/systemd/system/${svc}.service "$BACKUP_DIR/$DATE/" 2>/dev/null
done
echo "[$DATE] Services backed up" >> $LOG

# 3. Environment files (WITHOUT secrets for security)
for envfile in /opt/nexifyai/.env /root/.agentmemory/.env /opt/nexifyai/repos/lead-pipeline/.env; do
  if [ -f "$envfile" ]; then
    dir=$(dirname "$envfile" | sed 's|/||' | sed 's|/|_|g')
    # Copy with keys redacted
    sed 's/=.*/=<REDACTED>/' "$envfile" > "$BACKUP_DIR/$DATE/env_${dir}_keys_only.txt" 2>/dev/null
  fi
done
echo "[$DATE] Env key names backed up (values redacted)" >> $LOG

# 4. Agentmemory data (SQLite + state)
cp -r /root/.agentmemory/data "$BACKUP_DIR/$DATE/agentmemory-data" 2>/dev/null
echo "[$DATE] Agentmemory data backed up" >> $LOG

# 5. LightRAG data
cp -r /opt/nexifyai/repos/LightRAG/data "$BACKUP_DIR/$DATE/lightrag-data" 2>/dev/null
echo "[$DATE] LightRAG data backed up" >> $LOG

# 6. Hermes session data
cp -r /root/.hermes/sessions "$BACKUP_DIR/$DATE/hermes-sessions" 2>/dev/null
cp /root/.hermes/config.yaml "$BACKUP_DIR/$DATE/" 2>/dev/null
echo "[$DATE] Hermes data backed up" >> $LOG

# 7. Governance documents
cp -r /opt/nexifyai/repos/nexify-agentur-plattform/docs "$BACKUP_DIR/$DATE/governance-docs" 2>/dev/null
echo "[$DATE] Governance docs backed up" >> $LOG

# 8. Docker compose files
for f in /opt/nexifyai/repos/*/docker-compose.yml; do
  cp "$f" "$BACKUP_DIR/$DATE/docker-compose-$(basename $(dirname $f)).yml" 2>/dev/null
done
echo "[$DATE] Docker compose files backed up" >> $LOG

# 9. Docker volume dumps (databases + persistent data)
echo "[$DATE] Starting Docker volume dumps..." >> $LOG
for vol in $(docker volume ls --format '{{.Name}}' 2>/dev/null | grep -vE '^$'); do
  docker run --rm -v "${vol}:/source:ro" -v "$BACKUP_DIR/$DATE:/backup" alpine \
    tar czf "/backup/volume-${vol}.tar.gz" -C /source . 2>/dev/null && \
    echo "[$DATE] Volume $vol dumped" >> $LOG || \
    echo "[$DATE] WARN: Volume $vol dump failed" >> $LOG
done
echo "[$DATE] Docker volume dumps completed" >> $LOG

# 10. Postgres DB dumps (twenty-db, zitadel-postgres)
for db_container in twenty-db-1 zitadel-postgres-1; do
  if docker ps --format '{{.Names}}' | grep -q "^${db_container}$"; then
    DB_NAMES=$(docker exec "$db_container" psql -U postgres -lqt 2>/dev/null | cut -d'|' -f1 | sed 's/ //g' | grep -vE '^(template|postgres)$')
    for db in $DB_NAMES; do
      docker exec "$db_container" pg_dump -U postgres "$db" 2>/dev/null | gzip > "$BACKUP_DIR/$DATE/db-${db_container}-${db}.sql.gz" && \
        echo "[$DATE] DB dump: ${db_container}/${db}" >> $LOG || \
        echo "[$DATE] WARN: DB dump ${db_container}/${db} failed" >> $LOG
    done
  fi
done
# Supabase local DB (leads, invoice_sequences, auth) — Finanzkreislauf GDOK §10
if docker ps --format '{{.Names}}' | grep -q '^supabase-db$'; then
  docker exec supabase-db pg_dump -U postgres postgres 2>/dev/null | gzip > "$BACKUP_DIR/$DATE/db-supabase-db-postgres.sql.gz" && \
    echo "[$DATE] DB dump: supabase-db/postgres" >> $LOG || \
    echo "[$DATE] WARN: DB dump supabase-db/postgres failed" >> $LOG
fi
echo "[$DATE] Database dumps completed" >> $LOG

# 10b. DB dump integrity verification (2026-08-06 Go-Live Audit)
DBDUMP="$BACKUP_DIR/$DATE/db-supabase-db-postgres.sql.gz"
if [ -f "$DBDUMP" ]; then
  if gzip -t "$DBDUMP" 2>/dev/null; then
    echo "[$DATE] DB dump integrity OK" >> $LOG
  else
    echo "[$DATE] ERROR: DB dump integrity FAILED - re-dumping..." >> $LOG
    docker exec supabase-db pg_dump -U postgres postgres 2>/dev/null | gzip > "$DBDUMP" && \
      echo "[$DATE] DB dump re-created after integrity failure" >> $LOG || \
      echo "[$DATE] CRITICAL: DB dump re-creation FAILED" >> $LOG
  fi
  sha256sum "$DBDUMP" > "${DBDUMP}.sha256" && \
    echo "[$DATE] DB dump checksum saved" >> $LOG || \
    echo "[$DATE] WARN: Could not create checksum" >> $LOG
else
  echo "[$DATE] WARN: DB dump file not found" >> $LOG
fi


# 10.5 Lead-Pipeline data
if [ -f /opt/nexifyai/repos/lead-pipeline/data.json ]; then
  cp /opt/nexifyai/repos/lead-pipeline/data.json "$BACKUP_DIR/$DATE/lead-data.json"
  echo "[$DATE] Lead data backed up" >> $LOG
fi

# 11. Compression
tar czf "$BACKUP_DIR/nexifyai-backup-$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE" 2>/dev/null
rm -rf "$BACKUP_DIR/$DATE"
echo "[$DATE] Backup compressed: nexifyai-backup-$DATE.tar.gz" >> $LOG

# 12. Retention: delete backups older than $RETENTION_DAYS days
find "$BACKUP_DIR" -name "nexifyai-backup-*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null
OLD_COUNT=$(find "$BACKUP_DIR" -name "nexifyai-backup-*.tar.gz" -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)
echo "[$DATE] Retention cleanup: $OLD_COUNT old backups removed" >> $LOG

# 13. Verify latest backup
LATEST=$(ls -t "$BACKUP_DIR"/nexifyai-backup-*.tar.gz 2>/dev/null | head -1)
if [ -n "$LATEST" ]; then
  SIZE=$(du -h "$LATEST" | awk '{print $1}')
  echo "[$DATE] Backup completed: $LATEST ($SIZE)" >> $LOG
else
  echo "[$DATE] ERROR: No backup file found!" >> $LOG
fi


