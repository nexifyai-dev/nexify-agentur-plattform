# NeXify AI — HITL-Gate (Human In The Loop)
> ASI03 Privilege Abuse Prevention / ISO 42001 A.4 Human Oversight
> Stand: 2026-06-23 | Version: 1.0 | Owner: CTO

## Zweck
Blockiert kritische Agenten-Aktionen bis Pascal freigibt.

## Wann HITL erforderlich

| Aktion | Gate | Ausnahme |
|--------|------|----------|
| Production-Deployment (VPS, Cloudflare, Vercel) | **immer** | Keine |
| Secrets-Änderung | **immer** | Keine |
| Infrastruktur-Änderung (Docker, systemd, DNS) | **immer** | Keine |
| Kunden-Daten-Berührung | **immer** | Keine |
| Kostenpflichtige Aktionen (>0€) | **immer** | Keine |
| Löschung von Daten/Assets | **immer** | Keine |
| Neue SaaS-Tools | **immer** | Keine |
| Merge zu Main/Production-Branch | **immer** | Keine |
| Normale Code-Änderungen | **nie** | HITL nicht nötig |
| Recherche/Lesen/Suchen | **nie** | HITL nicht nötig |

## Commands

```bash
# Agent (blockiert bis Freigabe oder Timeout 300s):
hitl-gate request "<agent>" "<action>" "[detail]"
  → Returns: HITL:<id>:APPROVED (exit 0)
  → Returns: HITL:<id>:REJECTED (exit 1)
  → Returns: HITL:<id>:TIMEDOUT (exit 2)

# Pascal (Freigabe):
hitl-gate approve <id> "[approver]"

# Pascal (Ablehnung):
hitl-gate reject <id> "[reason]" "[rejector]"

# Pascal (Status prüfen):
hitl-gate list [pending|approved|rejected|timedout]
hitl-gate status <id>
```

## Integration in Agent-Prompt

Jeder Agent, der Production-Aktionen ausführen darf, muss vor der Aktion:
```
# Production-Aktion erkannt → HITL-Gate
hitl-gate request "Agent-Name" "Aktion" "Detail"
if [ $? -ne 0 ]; then
  # Aktion abgelehnt → dokumentieren + Break
  echo "HITL_REJECTED: Aktion blockiert"
  exit 1
fi
# HITL APPROVED → Aktion ausführen
```

## Test

```
HITL:489d5248c4e6:PENDING
→ hitl-gate approve 489d5248c4e6 "Pascal"
→ HITL APPROVED 489d5248c4e6
→ Approved by: Pascal
→ Approved at: 2026-06-23T21:32:01Z
→ DONE:0
```
