# Cursor Automation — Slack → Agent (FINAL — enable in UI)

**Status:** FINAL draft for UI Enable (not draft-only intent)  
**Human Gate step:** [`docs/operations/HUMAN-GATE-5MIN.md`](../../docs/operations/HUMAN-GATE-5MIN.md) §5  
**Issue:** [#137](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/137)

**Name:** Slack Alert → Agent  
**Description:** Slack-Nachricht in Ops-Kanal triggert Cloud Agent oder Status-Antwort.

| Draft field | What will open in the editor |
|-------------|------------------------------|
| Name / description | Slack Alert → Agent |
| Trigger | Slack — New message in channel (Ops/Alerts) |
| Tools | Post to Slack (thread reply); Read Slack; MCP optional |
| Instructions | Bei Alert/Fehler: kurz bestätigen, dann Cloud-Fix im Repo starten (Branch+PR). Bei reiner Statusfrage: antworten ohne Code. Keine Secrets posten. |
| Resolved settings | Repo: nexifyai-dev/nexify-agentur-plattform — Channel im Editor |
| To finish in editor | Slack-Kanal wählen; Completion-Reaction optional · then **Enable** |

**User:** Slack Integration in Cursor verbinden; Kanal im Editor picken.
