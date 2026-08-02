# Timezone Mandate — Europe/Berlin

**NIR:** 02.08.2026 09:50  
**UPDATED:** 02.08.2026 09:50  
**WHAT:** Single Source of Truth — alle NeXify-Runtime, Tools, Timer und App-Anzeigezeiten laufen auf `Europe/Berlin`.  
**WHY:** Mandat: Berlin/Germany; keine stillen UTC-/Amsterdam-Annahmen für Booking, Cron, Logs, CI-Datum.  
**PITFALL:** ISO-Timestamps in APIs bleiben oft UTC (`Z`) — Anzeige und Business-Slots interpretieren als Berlin. GitHub Actions `schedule:`-Cron ist weiterhin UTC (Plattform-Limit).  
**DEPENDS:** Host `timedatectl`, systemd, cron `CRON_TZ`, Docker `TZ`, App `ZoneInfo` / `timeZone`.

---

## Mandate (SoT)

| Ebene | Vorgabe |
|-------|---------|
| Host OS | `timedatectl` → `Europe/Berlin`; `/etc/localtime`; `/etc/timezone` |
| Shell / Login | `TZ=Europe/Berlin` (`/etc/environment`, `/etc/profile.d/nexify-tz.sh`) |
| systemd timers | System-TZ (nach Host-Set); Services: `Environment=TZ=Europe/Berlin` |
| cron | `CRON_TZ=Europe/Berlin` (+ `TZ=`) in root-crontab und `/etc/cron.d/nexifyai-*` |
| Autopilot | `/opt/nexifyai/config/autopilot/jobs.yaml` → `timezone: Europe/Berlin` |
| Docker | `TZ=Europe/Berlin` (Postgres zusätzlich `PGTZ` wo relevant) |
| Backend | `ZoneInfo("Europe/Berlin")` (Booking/Agent) |
| Website | `timeZone: "Europe/Berlin"` bei Slot-/Datum-Formatierung |
| GitHub Actions | Job/Step `env: TZ: Europe/Berlin` wo Datum/Logs zählen; Schedule-Cron bleibt UTC |

**Ausnahme (plattformbedingt):** GitHub-hosted `on.schedule.cron` ist immer UTC — lokale Wall-Clock-Jobs auf dem VPS nutzen systemd/cron mit Berlin.

---

## Service notes (TZ)

| Service / Job | TZ-Verhalten |
|---------------|--------------|
| Autopilot (`jobs.yaml`) | `timezone: Europe/Berlin`; Timer folgen Host-TZ |
| `nexify-gateway-spend-guard` | systemd oneshot + `Environment=TZ=Europe/Berlin` |
| `nexify-booking-slots-keepalive` | systemd oneshot + Berlin; Slot-Parsing via Backend `Europe/Berlin` |
| Email agent / inbox triage | Process-TZ Berlin; interne Audit-Stamps dürfen ISO-UTC bleiben |
| Website Next.js | Display-TZ Berlin (Slots, Admin); RSS `toUTCString` = Wire-Format, ok |

---

## Checklist

- [ ] `timedatectl` zeigt `Europe/Berlin`
- [ ] `cat /etc/timezone` → `Europe/Berlin`
- [ ] `echo $TZ` → `Europe/Berlin` (Login-Shell / Service-Env)
- [ ] `crontab -l` beginnt mit `CRON_TZ=Europe/Berlin`
- [ ] `/etc/cron.d/nexifyai-*` haben `CRON_TZ` / `TZ`
- [ ] Compose-Services: `TZ=Europe/Berlin`
- [ ] Backend Booking: `ZoneInfo("Europe/Berlin")`
- [ ] Website Slot-UI: `timeZone: "Europe/Berlin"`
- [ ] CI-Jobs mit Datumsbezug: `env.TZ`

---

## Verification commands

```bash
timedatectl | grep Berlin
echo "TZ=${TZ:-unset}"
date
cat /etc/timezone
ls -la /etc/localtime
# systemd service env
systemctl show nexify-backend.service -p Environment | tr ' ' '\n' | grep '^TZ='
# booking interpretation (Python)
python3 -c 'from zoneinfo import ZoneInfo; from datetime import datetime; print(datetime.now(ZoneInfo("Europe/Berlin")).isoformat())'
# optional: public slots (times meant as Berlin wall-clock in UI)
curl -sf http://127.0.0.1:8900/api/booking/slots | head -c 400; echo
```

---

## Remaining UTC / third-party

| Komponente | Status |
|------------|--------|
| GitHub Actions `schedule:` | Cron-Ausdruck in UTC (GitHub-Limit) — Wall-Clock-Äquivalent in Docs vermerken |
| Supabase / GitLab Images | Oft ohne `TZ` bis Compose-Recreate; Wire-Timestamps UTC üblich |
| Prometheus/cAdvisor metrics | Epoch/UTC intern — Dashboard-TZ in Grafana auf Berlin setzen |
| Hermes live cutover | HARD STOP — Compose-Dateien dürfen `TZ` haben; kein Live-Cutover |

---

## Related

- [`HUMAN-GATE-5MIN.md`](./HUMAN-GATE-5MIN.md) — One-liner: Runtime-TZ = Europe/Berlin  
- [`STATUS-DASHBOARD.md`](./STATUS-DASHBOARD.md) — Ops glance  
