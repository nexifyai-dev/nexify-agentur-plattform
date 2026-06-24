# 9Router DB/Zustand — Access Review

> Stand: 2026-06-12

## Pfad

| Element | Wert |
|---|---|
| DATA_DIR (Container) | /app/data |
| DB_PATH (Container) | /app/data/db/data.sqlite |
| DB_PATH (Host) | /var/lib/docker/volumes/9router-6kxn_data/_data/db/data.sqlite |
| DB_EXISTS | ✅ Ja |
| DB_SIZE | 11 MB |
| DB_BACKUP_EXISTS | ❌ Kein Backup kopiert (read-only) |

## Schema

| Tabelle | Inhalt |
|---|---|
| \_meta | Metadaten |
| providers | Provider-Konfigurationen (mit Keys) |
| providerConnections | Provider-Verbindungen |
| providerNodes | Provider-Knoten |
| apiKeys | API-Keys |
| combos | 1 Eintrag: nexifyai-combo-llm |
| proxyPools | LEER |
| settings | System-Einstellungen |
| kv | Key-Value-Store |
| usageDaily | Tägliche Nutzung |
| usageHistory | Nutzungsverlauf |
| requestDetails | Request-Details |

## Wichtige Befunde

| Aspekt | Status |
|---|---|
| Provider | 1: DeepSeek (ds/deepseek-v4-flash, ds/deepseek-reasoner) |
| Combos | nexifyai-combo-llm (reasoner + flash) |
| proxyPools | ✅ Leer (keine aktiven Proxies) |
| requestDetails | Alle success |
| Usage History | Verfügbar |
| Caveman/RTK in DB | ❌ Nicht in DB-Keys sichtbar |
| Caveman | Aktiv via 9Router-Logs (nicht in DB) |

## Relevanz

Caveman/RTK sind 9Router-interne Funktionen, die nicht in der DB,
sondern in der Runtime-Konfiguration (ENV, Code, Settings) aktiviert werden.
