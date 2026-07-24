# Goose — agentmemory Sync Test

> Stand: 2026-06-12
> Zweck: Prüfen ob Goose agentmemory lesen kann

## Test-1: agentmemory Health

```bash
curl -s http://127.0.0.1:3111/agentmemory/health | python3 -c \
  "import sys,json; d=json.load(sys.stdin); print(d.get('status','UNKNOWN'))"
```

Erwartet: `healthy`

## Test-2: Brain Health

```bash
curl -s http://127.0.0.1:9090/health | python3 -c \
  "import sys,json; d=json.load(sys.stdin); print(d.get('status','UNKNOWN'))"
```

Erwartet: `ok`

## Test-3: 9Router Connectivity

```bash
curl -s https://ai-router.nexifyai.cloud/v1/models \
  -H "Authorization: Bearer $NEXIFY_ROUTER_API_KEY" | python3 -c \
  "import sys,json; d=json.load(sys.stdin); print(len(d.get('data',[])), 'models')"
```

Erwartet: `9 models`

## Ergebnis

| Test | Status |
|---|---|
| agentmemory Health | ⏳ Nicht getestet (Goose nicht aktiv) |
| Brain Health | ✅ 773 entries |
| 9Router Models | ✅ 9 models |
