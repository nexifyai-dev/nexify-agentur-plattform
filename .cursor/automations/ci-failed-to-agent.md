# Cursor Automation Draft — CI Failed → Agent

**Name:** GitHub CI Failed → Fix Agent  
**Description:** Nach fehlgeschlagenen Checks Cloud Agent gegen Branch.

| Draft field | What will open in the editor |
|-------------|------------------------------|
| Name / description | CI Failed → Fix Agent |
| Trigger | Git — Checks completed (failure) on nexifyai-dev/nexify-agentur-plattform |
| Tools | Comment on PRs; Manage check runs optional |
| Instructions | Lies fehlgeschlagene Checks, fixe Root-Cause auf dem PR-Branch oder neuem Fix-Branch, pushe, warte auf Grün. Label automerge nur wenn Policy und Checks ok. Kein force main. |
| Resolved settings | Repo nexifyai-dev/nexify-agentur-plattform |
| To finish in editor | Ggf. Branch-Filter; parallel zu Actions-Workflow ok (dedupe via Cloud) |

**Hinweis:** GitHub Actions `event-to-cloud-agent.yml` deckt denselben Pfad API-seitig ab — Automation ist die Cursor-native Variante.
