# Alertmanager Configuration — Evidence

## Date: 2026-06-22 (Updated)
## VPS: 72.62.152.47
## Container: nexify-alertmanager
## Alertmanager Version: 0.33.0

## Health Check
```
$ curl -s http://localhost:9093/-/healthy
OK
```

## Config Validation
```
$ docker exec nexify-alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
Checking '/etc/alertmanager/alertmanager.yml'  SUCCESS
Found:
 - global config
 - route
 - 1 inhibit rules
 - 2 receivers
 - 0 templates
```

## Current Configuration Summary
- **Receivers:**
  - `slack-default` → `#nexify-alerts` (warnings)
  - `slack-critical` → `#nexify-alerts-critical` + PagerDuty (critical alerts)
- **Routing:**
  - Critical alerts → slack-critical (10s wait, 1h repeat)
  - Warning alerts → slack-default (4h repeat)
- **Inhibit Rules:** Critical inhibits warning for same alertname+instance
- **Both receivers:** send_resolved = true

## Config Location
- Host path: `/opt/nexify/monitoring/alertmanager.yml`
- Container path: `/etc/alertmanager/alertmanager.yml` (read-only mount)

## Placeholders to Replace
1. `slack_api_url`: Replace `https://hooks.slack.com/services/PLACEHOLDER/SLACK/WEBHOOK` with real Slack Incoming Webhook URL
2. `pagerduty_configs.service_key`: Replace `PLACEHOLDER_PAGERDUTY_SERVICE_KEY` with real PagerDuty integration key
3. Slack channels: Create `#nexify-alerts` and `#nexify-alerts-critical` in Slack workspace if not existing

## Container Status
- Container: `nexify-alertmanager`
- Status: Up and healthy
- Port: 0.0.0.0:9093->9093/tcp
