# Externe Tasks — Priorisierte Handlungsübersicht

**Datum:** 2026-06-23  
**Agent:** Quality Agent  
**Status:** ✅ PRIORISIERT  

---

## 1. Priorisierungsmatrix

### 1.1 Kritischer Pfad (P0 — Sofort)

| Rang | Task | Priorität | Status | Deadline | Handlungsbedarf |
|------|------|-----------|--------|----------|-----------------|
| 1 | **Cloudflare DNS Fix** | 🔴 P0 | ❌ BLOCKED | 48h | **SOFORT** — Neuen API-Token generieren |
| 2 | **SSH-Key-Rotation** | 🔴 P0 | ⏳ OFFEN | 48h | **SOFORT** — Keys auditieren & rotieren |

### 1.2 Wichtige Tasks (P1 — Kurzfristig)

| Rang | Task | Priorität | Status | Deadline | Handlungsbedarf |
|------|------|-----------|--------|----------|-----------------|
| 3 | **Externe Service-Zugänge** | 🟡 P1 | ⏳ OFFEN | 1-2 Wochen | Resend + Hostinger priorisieren |
| 4 | **Headroom Fix Review** | 🟢 P1 | ✅ DONE | 72h | CEO-Review ausstehend |
| 5 | **Phase 4 Bestätigung** | 🟢 P0 | ✅ DONE | Diese Woche | CEO-Bestätigung für Phase 5 |

---

## 2. Detaillierte Handlungsanweisungen

### 2.1 EXT-001: Cloudflare DNS Fix 🔴 P0 — BLOCKED

**Status:** ❌ BLOCKED  
**Blocker:** API-Token ungültig (HTTP 401)  
**Owner:** Pascal CEO  
**Deadline:** 48 Stunden  

**Sofortige Maßnahmen:**

1. **API-Token generieren (15 Min)**
   - Cloudflare Dashboard → API Tokens → Create Token
   - Berechtigungen: Zone:DNS:Edit, Zone:Zone:Read
   - Zone: nexifyai.cloud

2. **DNS-Einträge korrigieren (10 Min)**
   ```
   nexifyai.cloud     → A → 64.29.17.65 (proxied)
   www.nexifyai.cloud → A → 64.29.17.65 (proxied)
   ```

3. **Skript ausführen (5 Min)**
   ```bash
   python3 /workspace/nexify/07_tools_cli/cloudflare/cf_dns_setup.py
   ```

4. **Verifikation (5 Min)**
   ```bash
   dig nexifyai.cloud
   dig www.nexifyai.cloud
   curl -I https://nexifyai.cloud
   ```

**Impact ohne Aktion:** Web-Portal nicht erreichbar, Phase 5 (Go-Live) blockiert

---

### 2.2 EXT-002: SSH-Key-Rotation 🔴 P0 — OFFEN

**Status:** ⏳ OFFEN  
**Owner:** Pascal CEO  
**Deadline:** 48 Stunden  

**Sofortige Maßnahmen:**

1. **Alte Keys auditieren (10 Min)**
   ```bash
   ssh ubuntu@72.62.152.47 "cat ~/.ssh/authorized_keys"
   ```

2. **Neuen Key generieren (5 Min)**
   ```bash
   ssh-keygen -t ed25519 -C "pascal@nexifyai" -f ~/.ssh/id_ed25519_nexify
   ```

3. **Key auf VPS deployen (5 Min)**
   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519_nexify.pub ubuntu@72.62.152.47
   ```

4. **Alten Key löschen (5 Min)**
   ```bash
   ssh ubuntu@72.62.152.47 "sed -i '/old-key/d' ~/.ssh/authorized_keys"
   ```

5. **Key-Rotation-Intervall definieren**
   - Empfohlen: 90 Tage
   - Kalender-Eintrag erstellen

**Impact ohne Aktion:** Sicherheitsrisiko, Compliance-Verstoß (BSI, ISO 27001)

---

### 2.3 EXT-003: Externe Service-Zugänge 🟡 P1 — OFFEN

**Status:** ⏳ OFFEN  
**Owner:** Pascal CEO  
**Deadline:** 1-2 Wochen  

**Priorisierte Maßnahmen:**

| Priorität | Service | Zeitaufwand | Aktion |
|-----------|---------|-------------|--------|
| 1 | Resend API | 30 Min | Account erstellen, Domain verifizieren |
| 2 | Hostinger Firewall MCP | 15 Min | Zugang beantragen |
| 3 | CI/CD-Zugang | 15 Min | GitHub Deploy-Key erstellen |
| 4 | Knowledge-Work Plugins | 60 Min | Plugins identifizieren |
| 5 | Oracle Folgeauftrag | Prüfung | Kanonisierung klären |

**Gesamtaufwand:** ~2 Stunden

**Impact ohne Aktion:** P1-Kanban-Tasks (K-013 bis K-021) blockiert

---

## 3. Zeitplan für Pascal CEO

### Tag 1 (Heute)
| Zeit | Aufgabe | Dauer |
|------|---------|-------|
| 09:00 | Cloudflare Token generieren | 15 Min |
| 09:15 | DNS-Einträge korrigieren | 10 Min |
| 09:25 | Skript ausführen & verifizieren | 10 Min |
| 09:35 | SSH-Keys auditieren | 10 Min |
| 09:45 | Neuen SSH-Key generieren & deployen | 10 Min |
| **Summe** | | **55 Min** |

### Tag 2 (Morgen)
| Zeit | Aufgabe | Dauer |
|------|---------|-------|
| 09:00 | Resend Account erstellen | 30 Min |
| 09:30 | Hostinger Firewall MCP beantragen | 15 Min |
| 09:45 | CI/CD-Zugang erstellen | 15 Min |
| **Summe** | | **60 Min** |

### Woche 2
| Zeit | Aufgabe | Dauer |
|------|---------|-------|
| Flexibel | Knowledge-Work Plugins | 60 Min |
| Flexibel | Oracle Folgeauftrag klären | 30 Min |
| **Summe** | | **90 Min** |

---

## 4. Eskalationspfad

```
Tag 1: Cloudflare DNS + SSH-Key-Rotation (P0)
  │
  ├── Erfolg → Phase 5 Go-Live möglich
  │
  └── Fehlschlag → Eskalation an Systemmaster
        │
        └── Alternative Lösungen prüfen
```

---

## 5. Erfolgskriterien

| Kriterium | Messung | Ziel |
|-----------|---------|------|
| DNS korrekt | dig/curl | 64.29.17.65 |
| SSH-Key rotiert | authorized_keys | 1 aktueller Key |
| Resend API | API-Key generiert | Funktionierend |
| Phase 5 Go-Live | CEO-Bestätigung | FREIGEGEBEN |

---

## 6. Brain/Agentmemory-Updates

### MEMORY-036: Priorisierte externe Tasks
**Typ:** Task-Management  
**Inhalt:** 3 externe Tasks priorisiert. 2x P0 (48h), 1x P1 (1-2 Wochen).  
**Details:**
- EXT-001 (Cloudflare DNS): P0, BLOCKED, 48h
- EXT-002 (SSH-Key-Rotation): P0, OFFEN, 48h
- EXT-003 (Service-Zugänge): P1, OFFEN, 1-2 Wochen

### MEMORY-037: CEO-Handlungsplan
**Typ:** Eskalation  
**Inhalt:** Detaillierter Zeitplan für Pascal CEO mit 55 Min Tag 1, 60 Min Tag 2.  
**Details:**
- Tag 1: Cloudflare DNS + SSH-Key-Rotation
- Tag 2: Resend + Hostinger + CI/CD
- Woche 2: Knowledge-Work + Oracle

---

**Erstellt von:** Quality Agent  
**Datum:** 2026-06-23  
**Nächster Schritt:** CEO-Information und Umsetzung
