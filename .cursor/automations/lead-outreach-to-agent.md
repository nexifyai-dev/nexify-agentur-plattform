# Cursor Automation — Lead Outreach → Agent

**Status:** FINAL draft for UI Enable  
**Human Gate step:** Hostinger SMTP missing → Issue [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123) + `docs/operations/LEAD-OUTREACH-AUTOMATION.md`  
**Pattern:** Same as CI-failed / Slack-alert → Cursor Cloud Agent owns failures & retries.

**Name:** Lead Outreach Failures → Fix Agent  
**Description:** Wenn der tägliche Lead-Outreach-Job fehlschlägt oder SMTP fehlt, startet der Agent Diagnose + Fix (Queue, Bounce, Unsub, Creds-Gate) — confirmation-free außer HUMAN-GATE Secrets.

| Draft field | What will open in the editor |
|-------------|------------------------------|
| Name / description | Lead Outreach → Agent |
| Trigger | GitHub — Workflow `Lead Outreach Daily` completed (failure) **or** repository_dispatch `lead-outreach-run` / `agent-fix` with source `lead-outreach-daily` |
| Tools | Read repo; run `python3 scripts/outreach/run_daily.py --dry-run --json`; comment on issues; open PR if code fix |
| Instructions | Siehe Prompt unten |
| Resolved settings | Repo `nexifyai-dev/nexify-agentur-plattform` |
| To finish in editor | Enable · parallel zu `event-to-cloud-agent.yml` ok |

## Agent instructions (paste)

```
Du bist der NeXify AI Outreach-Agent.

Ziel: B2B-Leads (gescraped / outreach_pending) gewinnen neue Kunden via langsamer Hostinger-SMTP-Drip.
Kanal-Split: Hostinger SMTP = cold/drip; Resend = nur transactional (Kontakt/Angebot) — NIEMALS Resend für Cold Outreach.

Hard rules:
- ≤800 Mails/Tag (HARD_DAILY_CAP), Pace 30–60s Jitter
- GDPR: source + legal_basis speichern, Unsubscribe-Link, keine purchased lists
- Secrets nie committen; nur Env-Namen
- Kein Hermes-Cutover

Bei Fehlern:
1. Lies docs/operations/LEAD-OUTREACH-AUTOMATION.md
2. Dry-run: python3 scripts/outreach/run_daily.py --dry-run --json
3. Prüfe data/outreach/state/errors.jsonl und Queue
4. SMTP fehlt → Issue #123 kommentieren (human-gate), nicht raten
5. Code-Fixes als Branch cursor/lead-outreach-fix-<short>-7dd5 + PR; Label automerge wenn CI grün und Policy ok

Pattern auch für andere Automationen: Agent owns failures/retries, HUMAN-GATE nur für Secrets/Cutover.
```

**Hinweis:** Workflow `.github/workflows/lead-outreach-daily.yml` dispatched bei Send-Errors bereits `agent-fix`. Diese Cursor-Automation ist die UI-native Variante.
