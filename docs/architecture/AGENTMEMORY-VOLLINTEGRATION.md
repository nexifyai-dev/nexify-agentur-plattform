# agentmemory-Vollintegration (Stand 11.07.2026)

Ziel: **Ein** Gedächtnis für **alle** AI-Agenten des Systems — jeder Agent kann
lesen/schreiben, kein Agent arbeitet mit veraltetem oder isoliertem Wissen.

## Architektur

```
                       ┌──────────────────────────────┐
                       │  agentmemory.service (VPS)   │
                       │  App :3113 · REST :40000     │
                       │  Härtung: memory-fix.conf    │
                       │  Watchdog: 5-min-Timer       │
                       └──────────────┬───────────────┘
                                      │ REST
                       ┌──────────────┴───────────────┐
                       │  Unified-MCP  :9200 (SSE)    │
                       │  Tools: agentmemory_search   │
                       │  (smart_search-Route!),      │
                       │  agentmemory_save            │
                       └──┬────┬────┬────┬────┬───────┘
        ┌─────────────────┘    │    │    │    └──────────────────┐
   Hermes global          16 Hermes  │  Goose (config +     Claude Code
   (/root/.hermes/        Profile    │  Recipes, Endpunkt   (.claude.json)
   config.yaml)                      │  statt Platzhalter)  + MimoCode
                                     │
                          Paperclip-Container (6 Fabrik-Agenten)
                          HERMES_HOME=/paperclip/.hermes
                          MCP-URL: http://172.25.0.1:9200/sse (Host-Gateway!)
```

Ergänzend zur technischen Verdrahtung gilt das **MEMORY-PROTOKOLL** (Pflichtblock
in allen 17 Hermes-SOULs, der Paperclip-SOUL und allen 12 Fabrik-AGENTS.md):
Vor jeder Aufgabe Memory abfragen, nach jeder Aufgabe Ergebnis speichern.

## Umsetzung / Prüfung

Ein einziges idempotentes Skript prüft (und fixt mit `--apply`) alle Ebenen:

```bash
cd /opt/nexifyai-cloud && git pull origin main
bash infra/scripts/agentmemory-vollintegration.sh          # Audit, read-only
bash infra/scripts/agentmemory-vollintegration.sh --apply  # Fixes + E2E-Beweis
```

Was es abdeckt:

| Ebene | Prüfung | Fix bei `--apply` |
|---|---|---|
| Dienst | systemd aktiv, :3113, :40000/health | — (meldet nur) |
| Härtung | memory-fix.conf (cgroup-Hänger-Bug 06.07.), Watchdog-Timer | Dropin anlegen |
| Unified-MCP | :9200 erreichbar, `agentmemory_save` vorhanden, search nutzt `smart_search` | — (meldet nur) |
| Hermes | global + jedes Profil: YAML gültig **und** unified-MCP eingetragen | MCP-Eintrag ergänzen (mit Backup) |
| Paperclip | Container-Config enthält Host-Gateway-MCP | Anleitung (Container-Edit bewusst manuell) |
| Goose | Extension eingebunden; Recipe-Platzhalter „Agentenmemory" scharf | Platzhalter → `:9200/sse` |
| CLIs | Claude Code `.claude.json`, MimoCode `mimocode.jsonc` | — (meldet nur) |
| SOULs | MEMORY-PROTOKOLL-Block überall vorhanden | — (listet fehlende) |
| **Beweis** | save → smart_search-Read-back · Restart → Recovery ≤ 30 s | führt Test aus, loggt in Report |

Report: `/root/nexifyai-reports/agentmemory-vollintegration-<ts>.md` ·
Backups: `/root/config-backups/<ts>-agentmemory/`.

## Definition of Done (Beweispflicht)

- [ ] Skript-Audit läuft mit **0 offen** durch (`exit 0`).
- [ ] E2E-Beweis im Report: WRITE ok, READ-BACK ok, Reconnect ≤ 30 s.
- [ ] Ein realer Agenten-Beleg pro Consumer-Klasse: je einmal `hermes chat`
      (nutzt agentmemory_search), ein Paperclip-Run, ein Goose-Run mit
      Memory-Zugriff — im Report oder Brain protokolliert.
- [ ] Offene Punkte aus dem Masterplan-Paket 02 geschlossen: Agentenmemory-
      Endpunkt ist nicht mehr Platzhalter, Reconnect/Backoff getestet
      (Bauvorschrift 3.1).

## Bekannte Eigenheiten

- Paperclip-Agenten erreichen den Host **nicht** über 127.0.0.1 — Host-Gateway-IP
  verwenden (typisch `172.25.0.1`, prüfen mit `docker network inspect`).
- `agentmemory_search` muss die `smart_search`-Route nutzen; die alte Route
  meldete dauerhaft „offline" (Fix vom 06.07., Teil 4 — das Skript prüft das).
- Der Dienst hing früher im D-State durch `MemoryHigh=2G`-Throttling; das
  Dropin `memory-fix.conf` (MemoryHigh=infinity, MemoryMax=3G) ist Pflicht.
