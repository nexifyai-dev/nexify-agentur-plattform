# ChatGPT MCP Tool Metadata Review

## Server: NeXify Control (v1.23.3)
## Transport: streamable-http (privat, tunnel-gebunden)
## Stand: 2026-06-12

## Tool Review

### get_status
| Feld | Wert |
|---|---|
| Title | NeXify System-Status abrufen |
| readOnlyHint | ✅ true |
| destructiveHint | ✅ false |
| openWorldHint | ✅ false |
| idempotentHint | ✅ true |
| secret_output_blocked | ✅ (redigierte Stati) |
| policy_class | read-only |

### list_open_blockers
| Feld | Wert |
|---|---|
| Title | Offene Blocker anzeigen |
| readOnlyHint | ✅ true |
| destructiveHint | ✅ false |
| openWorldHint | ✅ false |
| idempotentHint | ✅ true |
| secret_output_blocked | ✅ (lokale Datei) |
| policy_class | read-only |

### read_latest_evidence
| Feld | Wert |
|---|---|
| Title | Letzte Evidence-Einträge lesen |
| readOnlyHint | ✅ true |
| destructiveHint | ✅ false |
| openWorldHint | ✅ false |
| idempotentHint | ✅ true |
| secret_output_blocked | ✅ (lokale Datei) |
| policy_class | read-only |

### create_dry_run_task
| Feld | Wert |
|---|---|
| Title | Dry-Run-Aufgabe erstellen (keine Ausführung) |
| readOnlyHint | ✅ false |
| destructiveHint | ✅ false |
| openWorldHint | ✅ false |
| idempotentHint | ✅ false |
| dryRunOnly | ✅ (keine Shell, kein Deploy, kein Git) |
| policy_class | safe-internal-write |

### read_task_status
| Feld | Wert |
|---|---|
| Title | Task-Status abfragen |
| readOnlyHint | ✅ true |
| destructiveHint | ✅ false |
| openWorldHint | ✅ false |
| idempotentHint | ✅ true |
| policy_class | read-only |

## Sicherheitsbewertung

| Prüfung | Status |
|---|---|
| raw_shell_exposed | ❌ false |
| sudo_exposed | ❌ false |
| public_unauthenticated | ❌ false (Tunnel) |
| secret_output_blocked | ✅ |
| env_dump_blocked | ✅ |
| write_tools_gated | ✅ (dry_run only) |
| audit_event | ✅ (alle Tools) |

## Abweichungen / Risiken

1. **ChatGPT UI zeigt evtl. "Autorisierung: Keinen"** — Dev-Mode-Tunnel, kein OAuth-Flow. Für Testphase akzeptabel.
2. **ChatGPT UI zeigt "Sichtbarkeit: public"** — bezieht sich auf Tool-Metadaten-Sichtbarkeit, nicht Netzwerk. Für Dev-Test akzeptabel.
3. **create_dry_run_task ohne echte Autorisierung** — Tunnel übernimmt Auth. Für Dry-Run ausreichend.
4. **Kein Rate-Limiting** — Phase B.

## Phase B erforderliche Verbesserungen

- [ ] OAuth2/DCR Auth-Flow integrieren
- [ ] Policy Gate vor allen Write-Tools
- [ ] Rate-Limiting pro Tool/Profil
- [ ] Audit-Log in separater Collection
- [ ] Tool-Registry mit vollständigen Metadaten
- [ ] Write-Tools nur nach explizitem Permission-Check

---
*Review generated: 2026-06-12T15:25+0200*
