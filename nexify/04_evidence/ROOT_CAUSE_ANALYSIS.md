# P0-RUNTIME-CLOSURE-RUN Phase 1 — Proxy- und Docker-Netzwerk-Root-Cause Analysis
# Date: 2026-06-22
# Analyst: Hermes Runtime/DevOps Agent

## 1. Docker Container Status (Key Containers)

```
NAMES                                NETWORKS
9router-6kxn-niner-router-1          9router-6kxn_default       (172.18.0.2/16)
nexify-webui                         nexify-webui_default
hermes-webui-nexify-hermes-webui-1   host
nexify-proxy                         <NONE>                     ← CRITICAL
nexify-api                           host
traefik-vsrs-traefik-1               host
nexify-redis                         bridge
nexify-qdrant                        bridge,nexify-internal
nexify-mongodb                       bridge,nexify-internal
postgresql-tu3y-postgresql-1         postgresql-tu3y_default
ragflow-xszg-ragflow-1               ragflow-xszg_default
```

## 2. ROOT CAUSE: nexify-proxy — Network Disconnected

### 2.1 Port Bindings (Host Level)
- HostConfig.PortBindings: {"32768/tcp": [{"HostIp": "127.0.0.1", "HostPort": "32768"}]}
- NetworkSettings.Ports: {} (EMPTY — port forwarding BROKEN)
- docker-proxy process listens on 127.0.0.1:32768 (confirmed via ss -tlnp)

### 2.2 Network Configuration
- HostConfig.NetworkMode: "9router-6kxn_default" (stale reference)
- NetworkSettings.Networks: {} (EMPTY — NOT connected to ANY network)
- NetworkSettings.IPAddress: (empty)
- NetworkSettings.Gateway: (empty)
- Container does NOT appear in `docker network inspect 9router-6kxn_default`

### 2.3 Internal Functionality
- Proxy listens on 0.0.0.0:32768 inside container (netstat confirmed)
- Internal health check: {"status":"ok"} (works from inside container)
- Host access: "Empty reply from server" (docker-proxy can't forward — no network)

### 2.4 Network is Only 9router
- 9router-6kxn_default network contains ONLY: 9router-6kxn-niner-router-1 (172.18.0.2/16)
- nexify-proxy is NOT in this network despite NetworkMode claiming so

## 3. Error Propagation Chain

### ECONNREFUSED 127.0.0.1:7897
- Port 7897 = tinyproxy (forward proxy on host, PID 1275)
- tinyproxy is listening and functional (verified via curl -x)
- NOT the cause of the problem

### ECONNREFUSED 127.0.0.1:32768
- Port 32768 = nexify-proxy (docker-proxy forwarding to container)
- docker-proxy IS listening but CANNOT forward (container has no network)
- Connection returns "Empty reply from server"
- This IS the root cause of reported ECONNREFUSED errors

### DNS Resolution Failures
- From 9router: `getaddrinfo ENOTFOUND nexify-proxy` — hostname unresolvable
- Cause: nexify-proxy not on any Docker network → no DNS entry

## 4. Why Network Disconnected?

### Hypothesis: Network Recreation
1. nexify-proxy was started with `--network 9router-6kxn_default`
2. At some point, the 9router compose stack was `docker compose down && up`
3. This recreated the `9router-6kxn_default` network with a new ID
4. nexify-proxy retained its stale NetworkMode reference but lost actual connectivity
5. Evidence: NetworkSettings.Networks is {} even though HostConfig.NetworkMode says "9router-6kxn_default"

### Additional: Container has NO Docker Compose labels
- nexify-proxy was started with bare `docker run` (no compose labels)
- Makes it an orphan that won't be managed by any compose stack
- 16 "Proxy ready" log entries = 16 container restarts (crash loop of sorts)

## 5. hermes-webui Network Status
- Runs on `host` network mode
- CAN access 127.0.0.1:32768 (host port) — but port forwarding is broken
- Port 8787 (Python/Flask) is listening
- Port 8645 (Hermes Gateway) is listening

## 6. Evidence Summary

| Component | Status | Network | Accessible |
|-----------|--------|---------|------------|
| nexify-proxy | Running but isolated | NONE | Internal only |
| 9router | Healthy | 9router-6kxn_default | Can't reach proxy (DNS fail) |
| hermes-webui | Running | host | Can't reach proxy (port forwarding broken) |
| tinyproxy (7897) | Running | host | Working (forward proxy) |

## 7. FIX REQUIRED (Not in Phase 1 — Diagnostic Only)

Option A: Connect nexify-proxy to the 9router network:
```
docker network connect 9router-6kxn_default nexify-proxy
```

Option B: If host-mode access needed, run on host network:
```
docker run --network host ... nexify-proxy
```

Option C: Recreate with correct network and restart policy:
```
docker stop nexify-proxy && docker rm nexify-proxy
docker run -d --name nexify-proxy --network 9router-6kxn_default \
  -p 127.0.0.1:32768:32768 --restart unless-stopped node:22-alpine ...
```

## 8. Verification Commands
```bash
# After fix:
docker network inspect 9router-6kxn_default  # Should show nexify-proxy
docker exec 9router-6kxn-niner-router-1 wget -qO- http://nexify-proxy:32768/health
curl http://127.0.0.1:32768/health
```
