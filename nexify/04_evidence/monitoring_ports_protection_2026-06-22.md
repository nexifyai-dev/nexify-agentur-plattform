# Evidence: Monitoring-Ports Protection (iptables)

**Datum:** 2026-06-22
**Agent:** Security Agent
**Aktion:** Monitoring-Ports iptables-Hardening

## Geschützte Ports

| Port | Service | Container IP | Status |
|------|---------|-------------|--------|
| 9091 | Prometheus | 172.19.0.7:9090 | ✅ Geschützt |
| 9093 | Alertmanager | 172.19.0.4:9093 | ✅ Geschützt |
| 9100 | node_exporter | 172.19.0.6:9100 | ✅ Geschützt |
| 9115 | blackbox_exporter | 172.19.0.2:9115 | ✅ Geschützt |

## iptables-Regeln (DOCKER-USER Chain - IPv4)

### VORHER (nur bestehende 54321-54327 DROPs):
```
1  RETURN  all  --  state RELATED,ESTABLISHED
2  RETURN  all  --  -i lo
3  DROP    tcp  --  tcp dpt:54321
4  DROP    tcp  --  tcp dpt:54322
5  DROP    tcp  --  tcp dpt:54323
6  DROP    tcp  --  tcp dpt:54324
7  DROP    tcp  --  tcp dpt:54327
8  RETURN  all  --  (catch-all)
```

### NACHHER (Monitoring-Container-IPs geschützt):
```
1   RETURN  all  --  state RELATED,ESTABLISHED
2   RETURN  all  --  -i lo
3   RETURN  all  --  -i br-ea59793af9c2 -d 172.19.0.0/16   ← Inter-Container erlaubt
4   DROP    tcp  --  -d 172.19.0.7 tcp dpt:9090            ← Prometheus
5   DROP    tcp  --  -d 172.19.0.4 tcp dpt:9093            ← Alertmanager
6   DROP    tcp  --  -d 172.19.0.6 tcp dpt:9100            ← node_exporter
7   DROP    tcp  --  -d 172.19.0.2 tcp dpt:9115            ← blackbox
8   DROP    tcp  --  tcp dpt:54321                          ← (bestehend)
9   DROP    tcp  --  tcp dpt:54322
10  DROP    tcp  --  tcp dpt:54323
11  DROP    tcp  --  tcp dpt:54324
12  DROP    tcp  --  tcp dpt:54327
13  RETURN  all  --  (catch-all)
```

## iptables-Regeln (INPUT Chain - Defense-in-Depth)

```
4  ACCEPT  tcp  --  127.0.0.1  tcp multiport dports 9091,9093,9100,9115
5  DROP    tcp  --  0.0.0.0/0  tcp multiport dports 9091,9093,9100,9115
```

## IPv6 (DOCKER-USER Chain)

```
3  RETURN  all  --  -i br-ea59793af9c2 -d fd00:172:19::/80
4  DROP    tcp  --  tcp dpt:9090
5  DROP    tcp  --  tcp dpt:9093
6  DROP    tcp  --  tcp dpt:9100
7  DROP    tcp  --  tcp dpt:9115
```

## Verifikation

### Localhost Access (alle HTTP 200/302):
- Port 9091 (Prometheus): HTTP 302 ✅
- Port 9093 (Alertmanager): HTTP 200 ✅
- Port 9100 (node_exporter): HTTP 200 ✅
- Port 9115 (blackbox): HTTP 200 ✅
- Port 3001 (Grafana): HTTP 200 ✅ (unverändert)

### Docker Container Status:
- nexify-prometheus: Up 8 hours ✅
- nexify-alertmanager: Up 3 minutes ✅
- nexify-node-exporter: Up 8 hours ✅
- nexify-blackbox-exporter: Up 8 hours ✅
- nexify-grafana: Up 8 hours ✅

### Externer Zugriff:
- IPv4 (72.62.152.47): BLOCKED ✅
- IPv6 (2a02:4780:41:aaea::1): BLOCKED ✅

## Persistenz
- `/etc/iptables/rules.v4` — iptables-save
- `/etc/iptables/rules.v6` — ip6tables-save
- `iptables-persistent` installiert (1.0.24)

## Schutz-Mechanismus
1. **DOCKER-USER Chain (FORWARD):** Blockt externen Zugriff auf Container-IPs/Ports nach DNAT
2. **INPUT Chain (Defense-in-Depth):** Blockt auch direkten Host-Zugriff auf die Ports
3. **Bridge-Internal RETURN:** Erlaubt Inter-Container-Kommunikation (Prometheus → node_exporter)
4. **localhost RETURN:** Bestehende Regel erlaubt localhost-Zugriff

## Dateien
- `iptables_docker_user_before.txt` — DOCKER-USER VORHER
- `iptables_docker_user_after.txt` — DOCKER-USER NACHHER
- `iptables_full_after.txt` — Kompletter iptables-save NACHHER
- `port_bindings_after.txt` — Port-Bindings NACHHER
