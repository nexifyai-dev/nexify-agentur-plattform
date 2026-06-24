# Proxy/MITM/Network State — Review

> Stand: 2026-06-12

## 9Router Config

| Aspekt | Status |
|---|---|
| Proxy Pools | Leer (keine Env-Vars mit proxy) |
| Network Proxy | Kein Environment-Proxy gefunden |
| Outgoing Proxy | Kein System-Proxy aktiv |
| MITM | Nicht aktiv |
| Caveman | 🔴 full (CAUSE of malformed HTTP 200) |
| Cloudflare Tunnel | ✅ brain + agentmemory + router aktiv |

## Port-Check

Keine ungewöhnlichen Proxy-Ports (7897, 7890, 1080, 3128, 8080) in Benutzung.

## Entscheidung

- MITM: OFF (bestätigt)
- Proxy Pools: LEER (bestätigt)
- Network Proxy: OFF (bestätigt)
- **Caveman: auf OFF oder moderate für Claude-Code-Pfade setzen (P0)**

## Aktion

Caveman ist die einzige aktive Kompressions-/Transformationskomponente,
die malformed Responses verursachen kann. Kein Proxy/MITM involviert.
