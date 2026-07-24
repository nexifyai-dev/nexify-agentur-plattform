# Alertmanager Receiver Configuration — Evidence & Setup

**Date**: 2026-06-22
**Task**: P0-Task 1 — Alertmanager-Receiver konfigurieren (Slack/PagerDuty)
**Status**: ✅ Config structure deployed, ⚠️ Real webhook URLs needed

## What Was Done

### 1. Config Structure Deployed
- New `alertmanager.yml` deployed to VPS (`/opt/nexify/monitoring/alertmanager.yml`)
- Template saved at `/opt/nexify/monitoring/alertmanager.yml.template`
- Deploy script at `/opt/nexify/monitoring/deploy-alertmanager.sh`

### 2. Routing Configuration
| Severity | Receiver | Slack Channel | PagerDuty |
|----------|----------|---------------|-----------|
| critical | slack-critical-pagerduty | #nexify-alerts-critical | ✅ Yes |
| warning | slack-default | #nexify-alerts | ❌ No |
| info | slack-default | #nexify-alerts | ❌ No |

### 3. Alert Routing Verified
```
ServiceDown [critical] -> slack-critical-pagerduty | active
TestAlert [warning] -> slack-default | active
CriticalTestAlert [critical] -> slack-critical-pagerduty | active
```

### 4. Inhibition Rules
- Critical inhibits Warning (same alertname + instance)
- Warning inhibits Info (same alertname + instance)

### 5. Slack Message Templates
- **Default**: Color-coded (danger/good), alert details, silence button
- **Critical**: 🚨 prefix, fire emoji, additional job info

## Files Created/Modified
| File | Location | Purpose |
|------|----------|---------|
| alertmanager.yml | VPS:/opt/nexify/monitoring/ | Active config |
| alertmanager.yml.template | VPS:/opt/nexify/monitoring/ | Template for deploy script |
| deploy-alertmanager.sh | VPS:/opt/nexify/monitoring/ | Deploy script |
| slack_webhook_url | VPS:/root/.nexify/secrets/monitoring/ | Slack webhook secret |
| pagerduty_service_key | VPS:/root/.nexify/secrets/monitoring/ | PagerDuty key secret |
| alertmanager_config_BEFORE.yml | Local evidence | Config before changes |
| alertmanager_config_AFTER.yml | Local evidence | Config after changes |
| test_alerts_response.json | Local evidence | Test alert API response |
| alertmanager_status.json | Local evidence | Alertmanager status |
| alertmanager_logs_after_deploy.txt | Local evidence | Logs after deploy |

## ⚠️ Action Required: Set Real Webhook URLs

### Slack Webhook URL
1. Go to https://api.slack.com/apps → Create App → Incoming Webhooks
2. Enable Incoming Webhooks
3. Add Webhook to Workspace for #nexify-alerts and #nexify-alerts-critical
4. Store the webhook URL:
   ```bash
   ssh vps
   echo 'https://hooks.slack.com/services/T.../B.../xxx' > /root/.nexify/secrets/monitoring/slack_webhook_url
   chmod 600 /root/.nexify/secrets/monitoring/slack_webhook_url
   ```

### PagerDuty Service Key (Optional)
1. Go to PagerDuty → Services → Add Service
2. Integration type: Prometheus
3. Copy the Integration Key
4. Store it:
   ```bash
   ssh vps
   echo 'your-pagerduty-integration-key' > /root/.nexify/secrets/monitoring/pagerduty_service_key
   chmod 600 /root/.nexify/secrets/monitoring/pagerduty_service_key
   ```

### Apply Secrets to Config
```bash
ssh vps
SLACK_URL=$(cat /root/.nexify/secrets/monitoring/slack_webhook_url)
PD_KEY=$(cat /root/.nexify/secrets/monitoring/pagerduty_service_key)
sed -i "s|https://hooks.slack.com/services/PLACEHOLDER/REPLACE/ME|$SLACK_URL|g" /opt/nexify/monitoring/alertmanager.yml
sed -i "s|PAGERDUTY_SERVICE_KEY_PLACEHOLDER|$PD_KEY|g" /opt/nexify/monitoring/alertmanager.yml
docker restart nexify-alertmanager
```

### Test After Setting Real URLs
```bash
# Send test alert
curl -X POST http://72.62.152.47:9093/api/v2/alerts \
  -H "Content-Type: application/json" \
  -d '[{"labels":{"alertname":"TestAlert","severity":"warning","job":"test"},"annotations":{"summary":"Test from NeXify"}}]'
```

## Current Active Alerts (Critical — Needs Attention)
- ServiceDown [critical] for: supabase-kong, 9router, supabase-studio, supabase-postgres, qdrant, nexify-webui, nexify-brain
