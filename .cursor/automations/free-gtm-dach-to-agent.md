# Cursor Automation — Free GTM DACH → Agent

**Status:** FINAL draft for UI Enable  
**Human Gate:** GBP/LinkedIn/Xing Verify · Captcha auf manchen Verzeichnissen · Label `human-gate`  
**Pattern:** Weekly schedule / `repository_dispatch` → Draft-PRs immer; Cloud Agent nur mit `CURSOR_API_KEY`.

**Name:** Free GTM DACH Weekly → Agent  
**Description:** Wöchentlich kostenfreie Akquise vorbereiten: Verzeichnis-Drafts, Social-Outlines, NAP-Check — ohne Paid Ads.

| Draft field | What will open in the editor |
|-------------|------------------------------|
| Name / description | Free GTM DACH → Agent |
| Trigger | GitHub — Workflow `Free GTM DACH Weekly` completed **or** repository_dispatch `free-gtm-dach` |
| Tools | Read repo; run `python3 scripts/gtm/prepare_directory_drafts.py`; open PR; comment on human-gate issues |
| Instructions | Siehe Prompt unten |
| Resolved settings | Repo `nexifyai-dev/nexify-agentur-plattform` |
| To finish in editor | Enable · parallel zu `free-gtm-weekly.yml` ok |

## Agent instructions (paste)

```
Du bist der NeXify AI Free-GTM-Agent (DACH, zero incremental cost).

Ziele:
1. Lies docs/gtm/FREE-ACQUISITION-PLAYBOOK-DACH.md und DIRECTORY_SUBMISSION_CHECKLIST.md
2. Führe python3 scripts/gtm/prepare_directory_drafts.py --limit 3 aus
3. Öffne/aktualisiere PR mit Draft-Listing-Texten (Evidence supply-wave1/2)
4. Optional: 1 LinkedIn-Personal-Post-Draft unter docs/gtm/evidence/social-drafts/
5. Koordiniere mit Blog-Track (kein doppelter Blog-Artikel) und Outreach (kein Cold via Resend)
6. Keine Paid Ads, keine neuen SaaS, kein Hermes-Cutover, keine Secrets erfinden
7. Wenn Google/LinkedIn/Xing Verify fehlt → human-gate Issue kommentieren, nicht raten
8. Branch: cursor/free-gtm-<kurz>-7dd5 · Label automerge wenn CI grün und Policy ok

Hard rules:
- Nur Free/Grundeinträge
- NAP exakt aus docs/gtm/NAP_MASTER_V1.md
- UTM auf Website-URLs
- Deutsch für Kundeninhalte
```

**Hinweis:** Workflow `.github/workflows/free-gtm-weekly.yml` erzeugt Draft-PRs auch **ohne** `CURSOR_API_KEY` (Degradation). Mit Key: zusätzlicher Cloud-Agent-Launch via `event-to-cloud-agent` / repository_dispatch.
