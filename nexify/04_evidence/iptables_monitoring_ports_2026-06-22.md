# Evidence: Monitoring-Ports iptables-Schutz
**Datum:** 2026-06-22  
**Task:** P0-Task 2 — Monitoring-Ports schützen (iptables-Regeln)  
**Status:** ✅ ABGESCHLOSSEN

## Geschützte Ports
| Port | Service | Status |
|------|---------|--------|
| 9091 | Prometheus | 🔒 Nur localhost |
| 9093 | Alertmanager | 🔒 Nur localhost |
| 9100 | node_exporter | 🔒 Nur localhost |
| 9115 | blackbox_exporter | 🔒 Nur localhost |

## Durchgeführte Änderungen

### iptables INPUT-Chain Regeln (hinzugefügt)
```
-A INPUT -s 127.0.0.1/32 -p tcp -m tcp --dport 9091 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 9091 -j DROP
-A INPUT -s 127.0.0.1/32 -p tcp -m tcp --dport 9093 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 9093 -j DROP
-A INPUT -s 127.0.0.1/32 -p tcp -m tcp --dport 9100 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 9100 -j DROP
-A INPUT -s 127.0.0.1/32 -p tcp -m tcp --dport 9115 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 9115 -j DROP
```

### Persistierung
```bash
iptables-save > /etc/iptables/rules.v4
```

## Verifikation

### ✅ Localhost-Zugriff funktioniert
- `curl http://localhost:9091/-/healthy` → "Prometheus Server is Healthy." ✓
- `curl http://localhost:9093/-/healthy` → "OK" ✓
- `curl http://localhost:9100/metrics` → Prometheus-Metrics ✓
- `curl http://localhost:9115/` → blackbox HTML ✓

### ✅ Externer Zugriff blockiert
- Port 9091: BLOCKED (keine Antwort) ✓
- Port 9093: BLOCKED (keine Antwort) ✓
- Port 9100: BLOCKED (keine Antwort) ✓
- Port 9115: BLOCKED (keine Antwort) ✓

### ✅ Services laufen weiter
- nexify-prometheus: Up 8 hours
- nexify-alertmanager: Up 3 minutes
- nexify-node-exporter: Up 8 hours
- nexify-blackbox-exporter: Up 8 hours

## Zusätzliche Schutzebene
Die **DOCKER-USER Chain** hatte bereits DROP-Regeln für Container-IPs:
- 172.19.0.7:9090 (Prometheus intern)
- 172.19.0.4:9093 (Alertmanager intern)
- 172.19.0.6:9100 (node_exporter intern)
- 172.19.0.2:9115 (blackbox intern)

Die neuen INPUT-Chain Regeln schützen zusätzlich die **Host-Port-Mappings** (0.0.0.0:9091, etc.).

## Backup
iptables-Backup vor Änderung gespeichert auf VPS unter `/tmp/iptables_backup_before_*.rules`
