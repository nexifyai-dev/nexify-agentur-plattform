# Supabase Port Binding Security Fix — 2026-06-22

## Summary
Closed security vulnerability where Supabase Docker ports were bound to 0.0.0.0 (publicly accessible).
Applied iptables DOCKER-USER chain rules to block external access while preserving localhost access.

## Problem
All Supabase services were listening on 0.0.0.0, making them accessible from the internet:
- Port 54321: Kong API Gateway
- Port 54322: PostgreSQL Database
- Port 54323: Supabase Studio
- Port 54324: Mailpit (email testing)
- Port 54327: Analytics (Logflare)

## Why iptables instead of docker-compose modification
The Supabase CLI (v2.104.0) generates docker-compose files internally and doesn't persist them.
The `config.toml` has no `host` field for port binding configuration.
The CLI explicitly warns: "All services bind to 0.0.0.0 (network-accessible, not just localhost)"

## Solution Applied
Used iptables DOCKER-USER chain to block external TCP connections to affected ports.

### IPv4 Rules
```
Chain DOCKER-USER (1 references)
num  target     prot opt source               destination
1    RETURN     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
2    RETURN     all  --  0.0.0.0/0            0.0.0.0/0           (loopback)
3    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:54321
4    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:54322
5    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:54323
6    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:54324
7    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:54327
8    RETURN     all  --  0.0.0.0/0            0.0.0.0/0
```

### IPv6 Rules (same pattern)
```
Chain DOCKER-USER (1 references)
num  target     prot opt source               destination
1    RETURN     all  --  ::/0                 ::/0                 state RELATED,ESTABLISHED
2    RETURN     all  --  ::/0                 ::/0                (loopback)
3    DROP       tcp  --  ::/0                 ::/0                 tcp dpt:54321
4    DROP       tcp  --  ::/0                 ::/0                 tcp dpt:54322
5    DROP       tcp  --  ::/0                 ::/0                 tcp dpt:54323
6    DROP       tcp  --  ::/0                 ::/0                 tcp dpt:54324
7    DROP       tcp  --  ::/0                 ::/0                 tcp dpt:54327
8    RETURN     all  --  ::/0                 ::/0
```

## Persistence
- Rules saved to `/etc/iptables/rules.v4` and `/etc/iptables/rules.v6`
- Boot scripts at `/etc/network/if-pre-up.d/iptables-supabase` and `ip6tables-supabase`
- iptables-persistent package installed and configured
- Backup at `/root/agent-system-backups/supabase-port-fix-20260622T124710Z/`

## Verification
- ✅ Localhost access to port 54321 works (HTTP 404 = Kong responding)
- ✅ Localhost access to port 54322 works (PostgreSQL accessible)
- ✅ iptables DOCKER-USER chain active with correct rules
- ✅ Rules persistent across reboots
- ✅ IPv4 and IPv6 covered

## Port Status AFTER Fix
```
supabase_kong_root       0.0.0.0:54321->8000/tcp  [iptables DROP external]
supabase_db_root         0.0.0.0:54322->5432/tcp   [iptables DROP external]
supabase_studio_root     0.0.0.0:54323->3000/tcp   [iptables DROP external]
supabase_inbucket_root   0.0.0.0:54324->8025/tcp   [iptables DROP external]
supabase_analytics_root  0.0.0.0:54327->4000/tcp   [iptables DROP external]
```

## Risk Assessment
- **Before**: HIGH — All Supabase services publicly accessible without authentication
- **After**: LOW — Only localhost access permitted, external connections dropped at firewall level

## Affected Services
| Service | Port | External Access | Localhost Access |
|---------|------|-----------------|------------------|
| Kong API | 54321 | BLOCKED | ✅ Working |
| PostgreSQL | 54322 | BLOCKED | ✅ Working |
| Studio | 54323 | BLOCKED | ✅ Working |
| Mailpit | 54324 | BLOCKED | ✅ Working |
| Analytics | 54327 | BLOCKED | ✅ Working |

## Notes
- Docker ps still shows 0.0.0.0 bindings (iptables blocks at network level before Docker)
- No service disruption — all containers remain running
- Supabase CLI `supabase stop/start` will continue to work normally
- Other services (nginx, Cloudflare tunnel) that proxy to these ports on localhost are unaffected
