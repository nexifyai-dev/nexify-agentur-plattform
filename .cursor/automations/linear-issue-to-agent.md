# Cursor Automation — Linear → Cloud Agent (FINAL — enable in UI)

**Status:** FINAL draft for UI Enable (not draft-only intent)  
**Human Gate step:** [`docs/operations/HUMAN-GATE-5MIN.md`](../../docs/operations/HUMAN-GATE-5MIN.md) §5  
**Issue:** [#137](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/137)

**Name:** Linear Issue → Fix Agent  
**Description:** Bei neuem Linear-Issue Branch/PR-Fix ohne Desktop.

| Draft field | What will open in the editor |
|-------------|------------------------------|
| Name / description | Linear Issue → Fix Agent / Cloud Agent erstellt Fix-PR |
| Trigger | Linear — Issue created (Team NeXify) |
| Tools | Comment on PRs; Use MCP (Linear) wenn auth; Git scope this repo |
| Instructions | Nimm das neue Issue. Triage. Wenn code-fixbar im Repo nexifyai-dev/nexify-agentur-plattform: Branch cursor/<kurz>-7dd5, Fix, PR, Label agent-fix. Kein Hermes-Cutover. Keine Secrets. AgentMemory Action speichern wenn möglich. |
| Resolved settings | Repo: nexifyai-dev/nexify-agentur-plattform · Branch main |
| To finish in editor | Linear Team/Project wählen; MCP Linear nur wenn bereits connected · then **Enable** |

**User:** Nach Approval Automations-Editor öffnen. Linear MCP vorher auth.
