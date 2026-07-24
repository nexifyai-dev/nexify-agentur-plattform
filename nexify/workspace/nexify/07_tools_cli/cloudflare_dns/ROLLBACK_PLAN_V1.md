# ROLLBACK PLAN V1 — DNS / CLOUDFLARE / TUNNEL / VERCEL

---
**Titel:** Rollback Plan — Wiederherstellungsstrategie für DNS, Cloudflare, Tunnel, Vercel
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

## 1. GRUNDSATZ: ROLLBACK-FÄHIGKEIT

### 1.1 Prinzip

> **Jede Änderung muss rückgängig machbar sein, bevor sie ausgeführt wird.**

| Prinzip | Beschreibung |
|---|---|
| **Backup vor Änderung** | Vollständiger Export des Ist-Zustands |
| **Niedrige TTL** | Kurze TTL = schnelle Propagation = schneller Rollback |
| **Schrittweise Änderung** | Nie mehrere Änderungen gleichzeitig |
| **Verifikation nach jedem Schritt** | Testen bevor weiter gemacht wird |
| **Time-Box** | Max. Zeit pro Änderung definieren |

### 1.2 Rollback-Arten

| Art | Beschreibung | Zeit |
|---|---|---|
| **Sofort-Rollback** | Letzten Schritt rückgängig machen | < 5 Minuten |
| **Voll-Rollback** | Kompletten Vor-Zustand wiederherstellen | < 30 Minuten |
| **Notfall-Rollback** | Bei schwerwiegenden Fehlern | < 10 Minuten |

---

## 2. DNS-BACKUP

### 2.1 Vor jeder Änderung: DNS-Export

```bash
# Cloudflare DNS Export (via API)
curl -X GET "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/dns_records/export" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -o /workspace/nexify/99_archiv/dns/nexify-automate.com_$(date +%Y%m%d_%H%M%S).txt

curl -X GET "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/dns_records/export" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -o /workspace/nexify/99_archiv/dns/nexifyai.cloud_$(date +%Y%m%d_%H%M%S).txt
```

### 2.2 Manuelles Backup (via Cloudflare Dashboard)

```
Cloudflare Dashboard → Domain → DNS → Export
→ Datei speichern unter: /workspace/nexify/99_archiv/dns/
```

### 2.3 Backup-Verzeichnis-Struktur

```
/workspace/nexify/99_archiv/
  ├── dns/
  │   ├── nexify-automate.com_20260610_180000.txt    (Vorher)
  │   ├── nexifyai.cloud_20260610_180000.txt          (Vorher)
  │   ├── nexify-automate.com_20260611_120000.txt     (Nach Änderung 1)
  │   └── nexifyai.cloud_20260611_120000.txt          (Nach Änderung 1)
  ├── cloudflared/
  │   └── config_backup_20260610/
  │       ├── config.yml
  │       └── credentials.json
  └── vercel/
      └── vercel.json_backup_20260610.json
```

---

## 3. CLOUDFLARE-KONFIGURATIONS-EXPORT

### 3.1 Cloudflare Konfiguration sichern

```bash
# Cloudflare Zone Settings exportieren (via API)
curl -X GET "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/settings" \
  -H "Authorization: Bearer <TOKEN>" \
  -o /workspace/nexify/99_archiv/cloudflare/settings_$(date +%Y%m%d).json

# SSL/TLS Settings
curl -X GET "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/settings/ssl" \
  -H "Authorization: Bearer <TOKEN>" \
  -o /workspace/nexify/99_archiv/cloudflare/ssl_$(date +%Y%m%d).json
```

### 3.2 Manuelle Dokumentation

```
Cloudflare Dashboard → Domain → SSL/TLS → Screenshot/Notizen
Cloudflare Dashboard → Domain → Security → WAF → Screenshot/Notizen
Cloudflare Dashboard → Domain → Caching → Screenshot/Notizen
```

---

## 4. TUNNEL-BACKUP

### 4.1 Vor Tunnel-Änderungen

```bash
# Alle Tunnel-Informationen sichern
cloudflared tunnel list > /workspace/nexify/99_archiv/cloudflared/tunnel_list_$(date +%Y%m%d).txt

# Pro Tunnel: Details sichern
cloudflared tunnel info <NAME> > /workspace/nexify/99_archiv/cloudflared/tunnel_<NAME>_$(date +%Y%m%d).txt

# Konfigurationsdateien sichern
cp -r ~/.cloudflared/ /workspace/nexify/99_archiv/cloudflared/config_$(date +%Y%m%d)/
```

---

## 5. VERCEL-BACKUP

### 5.1 Vercel-Konfiguration sichern

```bash
# vercel.json aus Repository kopieren
cp /workspace/nexify/vercel.json /workspace/nexify/99_archiv/vercel/vercel.json_$(date +%Y%m%d)

# Vercel-Projekt-Liste (via Vercel CLI)
npx vercel project ls > /workspace/nexify/99_archiv/vercel/projects_$(date +%Y%m%d).txt

# Vercel-Domain-Liste (via Vercel CLI)
npx vercel domains ls > /workspace/nexify/99_archiv/vercel/domains_$(date +%Y%m%d).txt

# Environment-Variablen (NICHT die Werte — nur die Namen!)
npx vercel env ls > /workspace/nexify/99_archiv/vercel/env_$(date +%Y%m%d).txt
```

---

## 6. WIEDERHERSTELLUNGS-SCHRITTE

### 6.1 DNS-Rollback

```
Schritt 1: Aktuelle DNS-Einträge identifizieren (was wurde geändert?)
Schritt 2: DNS-Export vom Vorher-Zustand öffnen
Schritt 3: Cloudflare DNS-Einträge manuell zurücksetzen
  → Cloudflare Dashboard → DNS → Eintrag bearbeiten/löschen/hinzufügen
  → Oder via API: curl -X PUT /dns_records/<ID>
Schritt 4: Propagation prüfen (dig +trace)
Schritt 5: Service-Funktionalität testen
```

### 6.2 Cloudflare Proxy-Rollback

```
Schritt 1: Cloudflare Dashboard → DNS
Schritt 2: Betroffenen Eintrag finden
Schritt 3: Proxy-Status wieder auf "Proxied" (Orange Cloud) setzen
Schritt 4: Warten (30s) bis Änderung aktiv
Schritt 5: curl -I https://<domain> → Status prüfen
```

### 6.3 Tunnel-Rollback

```
Schritt 1: Tunnel-Konfiguration aus Backup wiederherstellen
  → cp /workspace/nexify/99_archiv/cloudflared/config_<DATUM>/* ~/.cloudflared/
Schritt 2: Tunnel starten
  → cloudflared tunnel run <NAME>
Schritt 3: Oder: cloudflared service install (wenn systemd)
Schritt 4: DNS-Eintrag ggf. wieder auf Tunnel umstellen (CNAME)
Schritt 5: curl -I https://<domain> → Status prüfen
```

### 6.4 Vercel-Rollback

```
Schritt 1: Custom Domain in Vercel-Dashboard prüfen
Schritt 2: Falls geändert: Domain wieder auf vorherige Konfiguration setzen
Schritt 3: vercel.json aus Backup wiederherstellen
  → cp /workspace/nexify/99_archiv/vercel/vercel.json_<DATUM> /workspace/nexify/vercel.json
Schritt 4: Deployment auslösen (git push oder Vercel Deploy Hook)
Schritt 5: SSL-Zertifikat automatisch ausstellen lassen (Vercel)
Schritt 6: https://nexify-automate.com → 200 OK prüfen
```

### 6.5 Mail-DNS-Rollback

```
Schritt 1: Geänderten TXT/SPF/DKIM/DMARC-Record löschen oder alten Wert wieder eintragen
Schritt 2: Propagation prüfen (dig TXT <domain>)
Schritt 3: Mail-Test (falls Mail aktiv)
```

---

## 7. NOTFALL-PLAN

### 7.1 Wann wird der Notfall-Plan aktiviert?

| Kriterium | Auslöser |
|---|---|
| **Website nicht erreichbar** | `nexify-automate.com` → kein 200 OK |
| **API nicht erreichbar** | `ai-router.nexifyai.cloud` → kein HTTP-Status |
| **SSL-Zertifikat fehlerhaft** | Browser zeigt Sicherheitswarnung |
| **Cloudflare-Konfiguration korrupt** | Proxy/DNS unerwartetes Verhalten |
| **Tunnel ausgefallen** | Service nicht mehr erreichbar |

### 7.2 Notfall-Rollback (max. 10 Minuten)

```
1. STOP — Keine weiteren Änderungen
2. ANALYZE — Was wurde zuletzt geändert?
3. ROLLBACK — Letzte Änderung rückgängig machen
   → DNS: Eintrag löschen oder alten Wert wiederherstellen
   → Proxy: Proxy wieder aktivieren
   → Tunnel: cloudflared tunnel run <NAME>
4. VERIFY — curl -I https://<domain> → 200 OK?
5. REPORT — Pascal informieren
```

### 7.3 Kommunikation im Notfall

```
An: Pascal
Betreff: [NOTFALL] Rollback durchgeführt — <Ursache>

Was wurde geändert: [Kurzbeschreibung]
Was ist passiert: [Fehlerbeschreibung]
Rollback durchgeführt: [Zeitpunkt]
Aktueller Status: [Online / Teilweise / Kritisch]
Nächste Schritte: [Analyse, neuer Termin]
```

---

## 8. ROLLBACK-CHECKLISTE (VOR JEDER ÄNDERUNG)

- [ ] DNS-Export von Cloudflare erstellt (txt-Datei gesichert)
- [ ] Tunnel-Konfiguration gesichert (falls vorhanden)
- [ ] Vercel-Konfiguration gesichert (vercel.json)
- [ ] TTL auf niedrigen Wert gesetzt (120s für schnellen Rollback)
- [ ] Rollback-Schritte für diese spezifische Änderung definiert
- [ ] Time-Box festgelegt (max. Zeit für diese Änderung)
- [ ] Kommunikationskanal zu Pascal offen (bei Problemen)
- [ ] Monitoring-Check vor der Änderung: Alles OK?
- [ ] Monitoring-Check nach der Änderung: Vergleich OK?

---

## 9. ROLLBACK-LOG

| Datum | Änderung | Rollback nötig? | Rollback-Zeit | Status |
|---|---|---|---|---|
| — | — | — | — | ⏸ Noch keine Änderungen |

---

*Ende des Rollback Plans.*
*Nächstes Dokument: `APPROVAL_REQUEST_V1.md`*
