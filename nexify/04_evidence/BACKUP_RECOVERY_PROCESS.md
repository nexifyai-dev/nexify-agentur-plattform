# Backup-Recovery-Prozess — Implementierung
## NeXify AI OS | Erstellt: 2026-06-23

---

## Prozessablauf

```
[Backup Planning: Daten identifizieren, Strategie festlegen]
    ↓
[Automated Backup Execution: systemd-Timer, Cron, Git]
    ↓
[Backup Verification: Logs prüfen, Restore-Tests]
    ↓
[Recovery bei Bedarf: Backup auswählen, restoren, verifizieren]
    ↓
[Evidence dokumentieren]
```

## Implementierungsdetails

### 1. Automatisierte Backup-Infrastruktur

#### 1.1 Code-Repositories
```bash
# Git-Workflow: Push nach jedem Commit
git add -A && git commit -m "..." && git push origin main
# CI/CD-Pipeline übernimmt Mirror-Backup
```

#### 1.2 Datenbanken (Brain API + Qdrant)
```bash
# Brain API Backup (systemd-Timer: nexify-backup.timer)
curl -s http://127.0.0.1:9090/api/backup > /workspace/nexify/30_operating_data/backups/brain_$(date +%Y%m%d_%H%M%S).json

# Qdrant Snapshot
curl -X POST http://127.0.0.1:6333/collections/{collection}/snapshots
```

#### 1.3 Konfigurationen
```bash
# Versioniertes Config-Backup
tar czf /workspace/nexify/30_operating_data/backups/config_$(date +%Y%m%d_%H%M%S).tar.gz \
  /workspace/nexify/03_regelwerke/ \
  /workspace/nexify/07_tools_cli/ \
  /workspace/nexify/09_dispatcher/
```

#### 1.4 Secrets
```bash
# Verschlüsseltes Offline-Backup
tar czf - /root/.nexify/secrets/ | gpg --symmetric --cipher-algo AES256 \
  -o /workspace/nexify/30_operating_data/backups/secrets_$(date +%Y%m%d).tar.gz.gpg
```

### 2. Backup-Überwachung
```bash
# Backup-Status prüfen (täglich)
ls -la /workspace/nexify/30_operating_data/backups/ | tail -5
# Erfolgsmeldung im Monitoring-Log prüfen
journalctl -u nexify-backup.service --since "24 hours ago"
```

### 3. Recovery-Playbooks

#### 3.1 Database Recovery
```bash
# 1. Passendes Backup identifizieren
ls -la /workspace/nexify/30_operating_data/backups/brain_*.json | tail -5
# 2. Recovery in isolierter Umgebung testen
curl -X POST http://127.0.0.1:9090/api/restore -d @backup.json
# 3. Datenintegrität prüfen
curl -s http://127.0.0.1:9090/api/health
# 4. In Produktion überführen (bei Erfolg)
```

#### 3.2 Configuration Recovery
```bash
# 1. Backup auswählen und extrahieren
tar xzf /workspace/nexify/30_operating_data/backups/config_YYYYMMDD.tar.gz -C /tmp/restore/
# 2. Diff gegen Produktion prüfen
diff -r /tmp/restore/ /workspace/nexify/03_regelwerke/
# 3. Überführen
cp -r /tmp/restore/* /workspace/nexify/
```

#### 3.3 Secrets Recovery
```bash
# 1. Verschlüsseltes Backup entschlüsseln
gpg --decrypt secrets_YYYYMMDD.tar.gz.gpg | tar xzf - -C /tmp/restore/
# 2. Secrets verifizieren
ls -la /tmp/restore/root/.nexify/secrets/
# 3. Überführen (mit Vorsicht)
```

### 4. Backup-Verification-Schedule
| Prüfung | Frequenz | Methode | Dokumentation |
|---|---|---|---|
| Log-Prüfung | Täglich | Automatisiert | Monitoring-Log |
| Stichproben-Restore | Wöchentlich | Manuell/Automatisiert | Evidence |
| Full Restore Test | Monatlich | Manuell | Evidence |
| DR-Test | Quartalsweise | Manuell | Evidence |

### 5. Disaster-Recovery-Checkliste
- [ ] Ausmaß des Datenverlusts bestimmen (RPO prüfen)
- [ ] Letztes intaktes Backup identifizieren
- [ ] Recovery-Umfeld bereitstellen
- [ ] Recovery durchführen
- [ ] Datenintegrität vollständig verifizieren
- [ ] Services wieder starten
- [ ] Health-Checks bestehen
- [ ] Monitoring überprüfen
- [ ] Stakeholder informieren
- [ ] Evidence dokumentieren

## Integration in NeXify
- **Automation:** 09_dispatcher/automation/production/systemd/nexify-backup.timer
- **Backups:** /workspace/nexify/30_operating_data/backups/
- **Evidence:** 10_evidence/operations/
- **Monitoring:** systemd-Timer + Journal

## Status: IMPLEMENTIERT ✅
