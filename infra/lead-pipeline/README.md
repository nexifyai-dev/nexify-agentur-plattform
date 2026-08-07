# Lead-Pipeline Live-Spiegel

Deployte Referenzkopie der Lead-Mailing-Pipeline (Stand 2026-08-07, P0-Fixes v2.1).

## Live-Deploy-Pfade (Host srv1243952)

| Repo-Datei | Live-Pfad | Einheit |
|---|---|---|
| `scripts/run_cycle.py` | `/opt/nexifyai/repos/lead-pipeline/scripts/run_cycle.py` | `nexifyai-pipeline.service` (Timer 18:04, `--max-leads 1`, 10 Branchen Berlin) |
| `src/phases/outreach.py` | `/opt/nexifyai/repos/lead-pipeline/src/phases/outreach.py` | Teil von run_cycle (Retry 3×, Backoff) |
| `scripts/send_to_qualified_v2.py` | `/workspace/scripts/send_to_qualified_v2.py` | `nexifyai-bulk-send.service` (Timer 06:00+18:00, oneshot) |
| `scripts/drip-campaign.py` | `/workspace/scripts/drip-campaign.py` | `nexifyai-drip-campaign.service` (Timer 00:12, täglich) |
| `templates/lead_email.html` | `/workspace/templates/lead_email.html` | Bulk Welle A (neue Leads) |
| `templates/lead_email_reengage.html` | `/workspace/templates/lead_email_reengage.html` | Bulk Welle B (Reaktivierung >48h) |

## Systemd-Drop-Ins (live)

- `nexifyai-pipeline.service.d/`: `10-env-fix.conf` (NINE_ROUTER_KEY, OPENAI_API_KEY), `30-timezone-berlin.conf` (TZ=Europe/Berlin), `40-execstart.conf` (ExecStart mit 10 Branchen + `--max-leads 1`), `50-restart.conf` (Restart=on-failure, RestartSec=30, StartLimitIntervalSec=0), `override.conf` (TimeoutStartSec=1800)
- `nexifyai-bulk-send.service.d/`: `20-restart.conf` (Type=oneshot, Restart=on-failure, RestartSec=30, StartLimitIntervalSec=0), `30-timeout.conf` (TimeoutStartSec=7200 — 100 Mails × 30–60s Delay ≈ 75+ min)
- `nexifyai-drip-campaign.service.d/`: Drop-In `20-restart.conf` (Restart=on-failure, RestartSec=30, StartLimitIntervalSec=0), Unit enabled, Timer aktiv

## Logik-Referenz (v2.1)

- **run_cycle.py**: 4-Phasen-Cycle (Discovery → Enrich → Demo → Outreach) pro Lead. Fetch-Retry nicht nötig (kein Supabase-Fetch). Summary-Zählung mit `isinstance`-Guards (Fix 2026-08-07: `demo`/`outreach` können Fehler-Strings sein → `AttributeError` vermieden). `_send_campaign` POST an `MAIL_WEBHOOK_URL` (`http://localhost:8901/campaign/send`, mail-webhook.service).
- **send_to_qualified_v2.py**: Fetch-Retry (4 Versuche, Backoff 5/15/45s, frischer `create_client` pro Versuch — Kong-Disconnect-Fix). Duale Logik: Welle A = neue Leads (`discovered`/`enriched`, Resume über `last_index`), Welle B = Reaktivierung (`contacted` + >48h + nicht in `state['reengagement']`). Cap `BULK_MAX_MAILS` (100). State `/var/log/nexifyai/bulk-send-state.json`. Template `lead_email_reengage.html` für Welle B.
- **drip-campaign.py**: 3 Mails über 7 Tage (Mail 1 Tag 0, Mail 2 Tag 4, Mail 3 Tag 10), State `/var/log/nexifyai/drip-campaign-state.json` (Guards gegen Doppelversand), Cap 10 Mails/Lauf (`Max 10 Mails erreicht`).
- Mailversand via `src.pipeline.email_lead.send_email` (Hostinger SMTP, List-Unsubscribe-Pflicht, One-Click).

## Betrieb

- Logs: `/var/log/nexifyai/{bulk-send,drip-campaign}.log`, Journal (`journalctl -u nexifyai-{pipeline,bulk-send,drip-campaign}`)
- Test-Lead-Gegentest: Lead mit `status=contacted`, `contacted_at` >48h, eigene Mailbox anlegen → Reaktivierungs-Welle B → nach E2E löschen.
- Schema (A4 2026-08-07): `leads.contacted_at`, `leads.reengaged_at` (timestamptz); Backfill `contacted_at=created_at` (311 Zeilen).
