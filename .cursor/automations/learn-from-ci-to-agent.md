# Cursor Automation — Learn from CI → AgentMemory (FINAL draft)

**Status:** FINAL draft for UI Enable (optional; Actions cover API path)  
**Human Gate:** nicht nötig — nur Learning, kein Prod-Cutover  
**SoT:** [`docs/operations/CONTINUOUS-LEARNING.md`](../../docs/operations/CONTINUOUS-LEARNING.md)

**Name:** CI Outcome → Continuous Learning  
**Description:** Nach CI success/failure Learning-Event in AgentMemory speichern; bei Failure optional Fix-Agent (parallel zu event-to-cloud-agent).

| Draft field | What will open in the editor |
|-------------|------------------------------|
| Name / description | Learn from CI → AgentMemory |
| Trigger | Git — Checks completed (success or failure) on nexifyai-dev/nexify-agentur-plattform |
| Tools | Comment on PRs optional; no prod deploy |
| Instructions | Speichere Outcome als Lesson/workflow via Repo-Protokoll CONTINUOUS-LEARNING.md. Bei Failure: Error-Pattern + Fix-Branch wenn sinnvoll. Keine Secrets in Payloads. Kein Hermes-Cutover. Kein force-push main. |
| Resolved settings | Repo nexifyai-dev/nexify-agentur-plattform |
| To finish in editor | Branch-Filter optional · then **Enable** |

**Hinweis:** GitHub Actions `.github/workflows/ci-learn.yml` ist die kanonische, secret-gestützte Variante (degrade ohne `AGENTMEMORY_SECRET` / ohne `CURSOR_API_KEY`). Diese Automation ist die Cursor-native Ergänzung.
