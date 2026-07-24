# P0-Task 3: MongoDB Verification Evidence (Raw Output)

**Date:** 2026-06-23T03:24:00Z

---

## Evidence 1: MongoDB Ping & Database List

```
Port 27017 - ping: {'ok': 1.0}
Port 27017 - databases: ['admin', 'config', 'local', 'nexifyai', 'vorratsgesellschaften']
Port 27018 - ping: {'ok': 1.0}
Port 27018 - databases: ['admin', 'config', 'local', 'nexifyai']
```

## Evidence 2: Detailed Server Status — Nexify MongoDB (27018)

```
Nexify MongoDB (port 27018):
  Version: 7.0.37
  Uptime: 8372.0 seconds (2h 19m)
  Connections: 3 current / 406 available
  Ping: {'ok': 1.0}
  Databases: ['admin', 'config', 'local', 'nexifyai']
  nexifyai collections: ['documents', 'messages', 'jobs', 'project_chat', 'contracts', 'leads', 'customer_memory', 'admin_users', 'chat_sessions', 'contract_evidence', 'contract_appendices', 'bookings', 'legal_audit', 'projects', 'outbound_leads', 'whatsapp_sessions', 'audit_log', 'conversations', 'timeline_events', 'project_versions', 'legal_risks', 'project_sections', 'webhook_events', 'analytics', 'contacts', 'suppression_list', 'opt_outs']
    timeline_events: 61 documents
  Status: ✅ RUNNING & HEALTHY
```

## Evidence 3: Detailed Server Status — VSK MongoDB (27017)

```
VSK MongoDB (port 27017):
  Version: 7.0.37
  Uptime: 8372.0 seconds (2h 19m)
  Connections: 8 current / 401 available
  Ping: {'ok': 1.0}
  Databases: ['admin', 'config', 'local', 'nexifyai', 'vorratsgesellschaften']
  Status: ✅ RUNNING & HEALTHY
```

## Evidence 4: Port Connectivity Test

```
Port 27017: OPEN
Port 27018: OPEN
```

## Evidence 5: HTTP Response on MongoDB Ports

```
Port 27017: "It looks like you are trying to access MongoDB over HTTP on the native driver port."
Port 27018: "It looks like you are trying to access MongoDB over HTTP on the native driver port."
```
(This confirms MongoDB is running and rejecting HTTP — expected behavior for MongoDB native protocol)

## Evidence 6: Nexify API Service

```
curl http://127.0.0.1:3000/health:
{
  "status": "ok",
  "service": "nasc-webhook",
  "timestamp": "2026-06-23T03:24:26.610247+00:00"
}
```

## Evidence 7: Host Info

```
Hostname: srv1243952
Container: Running in Docker container on VPS 72.62.152.47
```
