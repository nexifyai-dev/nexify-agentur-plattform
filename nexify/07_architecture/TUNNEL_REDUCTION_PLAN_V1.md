# TUNNEL REDUCTION PLAN V1

---
**Titel:** Cloudflare Tunnel Reduction Plan — Tunnel auditieren, reduzieren, ersetzen
**Status:** PLAN_ONLY — KEINE AUSFÜHRUNG OHNE FREIGABE
**Version:** 1.0.0
**Datum:** 2026-06-10
**AUTHOR:** NETZWERK-EXPERTE
**Klassifikation:** INTERNAL — NEXIFY INFRASTRUCTURE
---

## ⚠️ WARNUNG

> **Änderungen an DNS, Cloudflare Proxy, Tunnel, Vercel, SSL und Mail-DNS sind GESPERRT bis Pascal Freigabe erteilt.**
> Dieses Dokument dient der **Planung** — keine Änderungen ohne schriftliche Freigabe.

---

## 1. AKTUELLER TUNNEL-BESTAND (UNBEKANNT)

### 1.1 Status

> ⚠️ **Der aktuelle Tunnel-Bestand kann nicht aus dem Repository ermittelt werden.**
> Folgende Aktionen sind vor der Planung erforderlich:

```
cloudflared tunnel list              # Alle Tunnel auflisten
cloudflared tunnel info <name>       # Details zu einem Tunnel
ls -la ~/.cloudflared/               # Konfigurationsdateien
systemctl list-units | grep cloudflared  # Tunnel-Services
cat /etc/cloudflared/config.yml      # Tunnel-Konfiguration
```

### 1.2 Bekannte Tunnel (Schätzung)

| Tunnel-Name | Subdomain | Ziel | Status | Priorität prüfen |
|---|---|---|---|---|
| *(unbekannt)* | `ai-router.nexifyai.cloud` | `localhost:XXXX` | ❓ | 🔴 Hoch |
| *(unbekannt)* | `agentmemory.nexifyai.cloud` | `localhost:XXXX` | ❓ | 🔴 Hoch |
| *(unbekannt)* | ggf. weitere | ❓ | ❓ | 🟠 Mittel |

---

## 2. TUNNEL-ANALYSE: WELCHE TUNNEL KÖNNEN ERSETZT WERDEN?

### 2.1 Entscheidungsmatrix

| Kriterium | Tunnel behalten | Tunnel ersetzen (A-Record) |
|---|---|---|
| **Service-Typ** | Interner Dienst, DB, Docker ohne Port | HTTP(S)-Service mit festem Port |
| **IP** | Keine feste IP / dynamisch | Feste IP (72.62.152.47) |
| **Firewall** | Service nur intern erreichbar | Service kann öffentlich sein |
| **Auth** | Service hat keine eigene Auth | Service hat eigene Authentifizierung |
| **Websocket** | Tunnel unterstützt WebSocket | A-Record + Direktverbindung |
| **Latenz** | Latenz unkritisch | Latenz kritisch → direkte Verbindung |

### 2.2 Bewertung: Tunnel durch A-Record ersetzbar?

| Subdomain | Hat Tunnel? | Ersetzbar? | Begründung |
|---|---|---|---|
| `ai-router.nexifyai.cloud` | ❓ | ✅ **Ja** | Feste IP, HTTP(S)-Service, eigene Auth (401) |
| `agentmemory.nexifyai.cloud` | ❓ | ✅ **Ja** | Feste IP, HTTP(S)-Service, kann Auth haben |
| *(andere)* | ❓ | ❓ | Nach Prüfung entscheiden |

> **VORSCHLAG:** Alle Tunnel, die auf `localhost:PORT` auf dem VDS zeigen, können durch A-Records + Direktzugriff auf `72.62.152.47:PORT` ersetzt werden.

---

## 3. ZIEL-ZUSTAND: REDUZIERTE TUNNEL-STRUKTUR

### 3.1 Tunnel die bleiben sollen

| Tunnel | Ziel | Begründung |
|---|---|---|
| *(nur wenn nötig)* | *(z.B. interner DB-Tunnel)* | Nur wenn Service keine öffentliche IP verträgt |

### 3.2 Tunnel die ersetzt werden sollen

| Tunnel-Name | Ersetzung durch | Status |
|---|---|---|
| `ai-router`-Tunnel (falls aktiv) | A-Record `ai-router.nexifyai.cloud` → `72.62.152.47` | ⏸ Planung |
| `agentmemory`-Tunnel (falls aktiv) | A-Record `agentmemory.nexifyai.cloud` → `72.62.152.47` | ⏸ Planung |

### 3.3 Ziel-Architektur

```
┌─────────────────────────────────────────────┐
│           ZIEL: MAX. 1 TUNNEL                │
├─────────────────────────────────────────────┤
│                                              │
│  Internet ──► A-Record ──► 72.62.152.47     │
│                   │                          │
│                   ├── ai-router (Direkt)     │
│                   ├── agentmemory (Direkt)   │
│                   ├── api (Direkt)           │
│                   ├── auth (Direkt)          │
│                   │                          │
│                   └── [Tunnel] ← nur bei     │
│                        zwingendem Bedarf     │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 4. UMSTELLUNGS-PLAN (NACH FREIGABE)

### Phase 1: Inventur

```
Schritt 1: Tunnel-Liste vom Server abrufen
  → Befehl: cloudflared tunnel list
  → Ergebnis in TUNNEL_INVENTORY.md speichern

Schritt 2: Pro Tunnel prüfen:
  → Welcher Service hängt dran?
  → Port? (localhost:XXXX)
  → Auth-Mechanismus?
  → Logs auf Fehler prüfen
```

### Phase 2: Ersetzung (pro Tunnel)

```
Schritt 3: Neuen A-Record in Cloudflare anlegen (DNS Only)
  → Typ: A
  → Name: <subdomain>
  → Wert: 72.62.152.47
  → TTL: 120
  → Proxy: Off

Schritt 4: Warten auf DNS-Propagation (2× TTL = 240s)

Schritt 5: Service auf Server auf Port 80/443 umleiten (nginx/caddy)
  → Proxy-Pass an localhost:PORT

Schritt 6: Tunnel stoppen (nicht löschen!)
  → cloudflared tunnel stop <name>

Schritt 7: Funktionalität testen
  → curl -I https://<subdomain>.nexifyai.cloud
  → Service-spezifische Tests

Schritt 8: Wenn alles läuft → Tunnel-Konfiguration sichern, dann löschen
  → cloudflared tunnel delete <name>
```

### Phase 3: Aufräumen

```
Schritt 9: Tunnel-Konfigurationsdateien sichern ins Archiv
  → cp -r ~/.cloudflared/ /workspace/nexify/99_archiv/cloudflared/

Schritt 10: Systemd-Service deaktivieren (falls vorhanden)
  → systemctl disable cloudflared-<name>
  → systemctl stop cloudflared-<name>
```

---

## 5. RISIKO-ANALYSE

### 5.1 Risiken der Tunnel-Entfernung

| Risiko | Eintrittswahrsch. | Auswirkung | Gegenmaßnahme |
|---|---|---|---|
| **Service kurzzeitig offline** | 🟠 Mittel | 🟠 Mittel | Niedrige TTL, außerhalb Geschäftszeit |
| **DNS-Propagation-Verzögerung** | 🟢 Gering | 🟢 Gering | 2× TTL warten (240s) |
| **Server-Firewall blockiert** | 🟠 Mittel | 🔴 Hoch | Vorher Port 80/443 freigeben prüfen |
| **SSL-Zertifikat fehlt** | 🟠 Mittel | 🔴 Hoch | Vorher Let's Encrypt einrichten |
| **Tunnel-Konfiguration verloren** | 🟢 Gering | 🟠 Mittel | Backup vor Löschung |
| **Vergessener Service am Tunnel** | 🟠 Mittel | 🟠 Mittel | Vorher alle Tunnel-Dienste identifizieren |

### 5.2 Sicherheitsrisiken OHNE Tunnel

| Risiko | Beschreibung | Schwere |
|---|---|---|
| **IP sichtbar** | Server-IP ist bekannt (keine Verschleierung) | 🟢 Gering (IP ist bereits bekannt) |
| **Kein DDoS-Schutz** | Cloudflare DDoS-Schutz fällt weg | 🟠 Mittel (abhängig von Bedrohungslage) |
| **Kein CDN-Caching** | Cloudflare CDN wird nicht genutzt | 🟢 Gering (dynamische Dienste) |

---

## 6. ROLLBACK-PLAN

> Siehe auch: `ROLLBACK_PLAN_V1.md` (detaillierter Rollback)

### 6.1 Kurz-Rollback (pro Tunnel)

```
Schritt 1: A-Record löschen (oder Proxy wieder aktivieren)
Schritt 2: Tunnel wieder starten:
  → cloudflared tunnel run <name>
Schritt 3: Service-Funktionalität prüfen
Schritt 4: Fehleranalyse
```

### 6.2 Time-Box

| Phase | Max. Zeit | Abbruchkriterium |
|---|---|---|
| Pro Tunnel-Umstellung | 30 Minuten | Nach 30 Min → Rollback |
| Gesamte Tunnel-Reduktion | 2 Stunden | Nach 2h → Abbruch, nächster Termin |

---

## 7. VORBEREITUNG (VOR FREIGABE)

- [ ] Server-Zugriff einrichten (SSH-Key hinterlegen)
- [ ] `cloudflared` auf dem Server prüfen (Binary vorhanden?)
- [ ] Docker-Container-Liste für Service-Zuordnung
- [ ] Let's Encrypt Certbot installieren und Wildcard-Zertifikat beantragen
- [ ] Nginx/Caddy-Konfiguration vorbereiten (Reverse Proxy)
- [ ] Firewall-Regeln dokumentieren und Ports freigeben

---

## 8. FREIGABE-BLOCK

```
┌─────────────────────────────────────────────────┐
│ FREIGABE DURCH PASCAL                           │
├─────────────────────────────────────────────────┤
│                                                   │
│ [] Freigegeben — Tunnel-Reduktion wie beschrieben  │
│ [] Abgelehnt — Änderungen erforderlich:           │
│    ___________________________________            │
│                                                   │
│ Datum: _____________  Unterschrift: ___________ │
└─────────────────────────────────────────────────┘
```

---

*Ende des Tunnel Reduction Plans.*
*Nächstes Dokument: `NEXIFY_AUTOMATE_ACTIVE_WEBSITE_PLAN_V1.md`*
