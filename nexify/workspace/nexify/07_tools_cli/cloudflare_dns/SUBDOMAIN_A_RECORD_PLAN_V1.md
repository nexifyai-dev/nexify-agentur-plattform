# SUBDOMAIN A-RECORD PLAN V1

---
**Titel:** Subdomain A-Record Plan — Detaillierte Planung sämtlicher A-Records
**Status:** PLAN_ONLY — KEINE AUSFÜHRUNG OHNE FREIGABE
**Version:** 1.0.0
**Datum:** 2026-06-10
**AUTHOR:** NETZWERK-EXPERTE
**Klassifikation:** INTERNAL — NEXIFY INFRASTRUCTURE
---

## ⚠️ WARNUNG

> **Änderungen an DNS, Cloudflare Proxy, Tunnel, Vercel, SSL und Mail-DNS sind GESPERRT bis Pascal Freigabe erteilt.**
> Dieses Dokument dient der **Detailplanung** — keine Änderungen ohne schriftliche Freigabe.

---

## 1. ÜBERSICHT: WELCHE SUBDOMAINS BRAUCHEN A-RECORDS?

### 1.1 Subdomain-Kategorien

| Kategorie | Beschreibung | A-Record nötig? |
|---|---|---|
| **Backend-Dienste** | Services auf VDS (`72.62.152.47`) | ✅ Ja — direkt A-Record |
| **Website/App** | Vercel-gehostete Domains | ❌ Nein — Vercel-Anycast-IPs via A oder CNAME |
| **Interne Dienste** | Nur intern erreichbar | ❌ Nein — kein DNS nötig oder Tunnel |
| **Reserviert/Sparplan** | Subdomain für später | ✅ Ja — als Platzhalter |

---

## 2. SUBDOMAIN-MATRIX (VOLLSTÄNDIG)

### 2.1 A-Records auf `72.62.152.47`

| Subdomain | FQDN | A-Record | TTL | Proxy | Priorität | Status |
|---|---|---|---|---|---|---|
| **Router API** | `ai-router.nexifyai.cloud` | `72.62.152.47` | `120` | ❌ Nein | 🔴 Hoch | ✅ Besteht, prüfen |
| **AgentMemory** | `agentmemory.nexifyai.cloud` | `72.62.152.47` | `120` | ❌ Nein | 🔴 Hoch | ✅ Besteht, ändern |
| **API Gateway** | `api.nexifyai.cloud` | `72.62.152.47` | `300` | ❌ Nein | 🟠 Mittel | ⏸ Neu (Sparplan) |
| **Auth** | `auth.nexifyai.cloud` | `72.62.152.47` | `300` | ❌ Nein | 🟠 Mittel | ⏸ Neu (Sparplan) |
| **Status/Monitoring** | `status.nexifyai.cloud` | `72.62.152.47` | `300` | ⚠️ Optional | 🟢 Niedrig | ⏸ Neu (Sparplan) |

### 2.2 Apex (Root-Domain) auf Vercel

| Domain | Eintragstyp | Wert | TTL | Proxy |
|---|---|---|---|---|
| `nexify-automate.com` | A (Vercel) | `76.76.21.21` | `Auto` | ❌ Nein |
| `nexifyai.cloud` | A | `72.62.152.47` | `300` | ❌ Nein |

> **ACHTUNG:** Der Apex von `nexify-automate.com` muss auf Vercel-IPs zeigen, damit Vercel die Website ausliefern kann.
> Vercel-IPs (Stand 2026): `76.76.21.21`, `76.76.21.22`, `76.76.21.61`, `76.76.21.123`
> → Bitte im Vercel-Dashboard prüfen ob andere IPs angegeben sind.

### 2.3 Subdomains die **KEINE** A-Records brauchen

| Subdomain | Begründung |
|---|---|
| `www.nexify-automate.com` | CNAME auf Apex (Vercel), 308 Redirect |
| `*.vercel.app` | Vercel-eigene Domain — nicht relevant |
| `localhost` | Loopback — kein DNS |

---

## 3. CLOUDFLARE PROXY — DETAIL-ENTSCHEIDUNG

### 3.1 Proxy-Entscheidungen pro Subdomain

| Subdomain | Proxy | Begründung | Risiko ohne Proxy |
|---|---|---|---|
| `ai-router.nexifyai.cloud` | ❌ **Nein** | Websocket-Unterstützung nötig; Latenz kritisch | ✅ Gering — Server ist hardened |
| `agentmemory.nexifyai.cloud` | ❌ **Nein** | Agent Memory DB — direkter Zugriff, niedrige Latenz | ✅ Gering — DB intern abgesichert |
| `api.nexifyai.cloud` | ❌ **Nein** | API — kein Caching erwünscht | ✅ Gering — API hat eigene Auth |
| `auth.nexifyai.cloud` | ❌ **Nein** | Authentifizierung — Proxy würde Token-Handling stören | ✅ Gering — Auth-Header direkt |
| `status.nexifyai.cloud` | ⚠️ **Optional** | Wenn öffentliches Dashboard → Proxy sinnvoll | 🟡 Mittel — Informationspreisgabe |

### 3.2 Wann wäre Proxy aktivierbar?

| Szenario | Proxy? |
|---|---|
| DDoS-Angriff auf `ai-router` | ✅ Ja, temporär aktivieren |
| WAF-Regeln für API-Schutz nötig | ✅ Ja, dann Proxy für `api.` |
| SSL-Zertifikat abgelaufen | ❌ Nein — Full (strict) erfordert Server-Zertifikat |
| IP-Wechsel des Servers | ❌ Nein — dann A-Record updaten |

---

## 4. TTL-PLANUNG

### 4.1 TTL-Strategie

| TTL | Einsatzgebiet | Beispiele |
|---|---|---|
| **120s (2 Min)** | Änderungsfrequenz hoch, Latenz sensibel | `ai-router`, `agentmemory` |
| **300s (5 Min)** | Standard — guter Kompromiss | `api`, `auth`, `nexifyai.cloud` |
| **Auto (Vercel)** | Vercel-eigene Nameserver | `nexify-automate.com`, `www.nexify-automate.com` |

### 4.2 TTL-Übersicht

| Eintrag | Aktuelle TTL | Ziel-TTL | Begründung |
|---|---|---|---|
| `ai-router.nexifyai.cloud` | ❓ | `120` | Häufige Änderungen, Latenz kritisch |
| `agentmemory.nexifyai.cloud` | ❓ | `120` | Häufige Änderungen, Latenz kritisch |
| `api.nexifyai.cloud` | ❓ (neu) | `300` | Neuer Eintrag, Standard-TTL |
| `auth.nexifyai.cloud` | ❓ (neu) | `300` | Neuer Eintrag, Standard-TTL |
| `nexifyai.cloud` | ❓ | `300` | Apex, selten geändert |
| `nexify-automate.com` | ❓ | `Auto` (Vercel) | Vercel managed |

---

## 5. UMSTELLUNGS-PLAN (SCHRITT FÜR SCHRITT)

### Phase 1: Bestandsaufnahme (KEINE ÄNDERUNGEN)

```
[ ] Cloudflare DNS Export anfordern
[ ] Aktuelle Einträge dokumentieren
[ ] Tunnel-Liste abrufen
[ ] Bestehende Proxy-Einstellungen notieren
```

### Phase 2: A-Record-Fixes (NACH FREIGABE)

```
Schritt 1: agentmemory.nexifyai.cloud Proxy ausschalten (DNS Only)
  → TTL: 120s
  → Änderungsrisiko: Mittel (aktuell 301 via Proxy)
  → Rollback: Proxy wieder aktivieren

Schritt 2: ai-router.nexifyai.cloud prüfen und ggf. A-Record setzen
  → TTL: 120s
  → Proxy: DNS Only (aus)
  → Änderungsrisiko: Gering (bereits A-Record)

Schritt 3: api.nexifyai.cloud anlegen (Sparplan)
  → A-Record auf 72.62.152.47
  → TTL: 300s
  → Proxy: DNS Only
  → Änderungsrisiko: Gering (neuer Eintrag)

Schritt 4: auth.nexifyai.cloud anlegen (Sparplan)
  → A-Record auf 72.62.152.47
  → TTL: 300s
  → Proxy: DNS Only
  → Änderungsrisiko: Gering (neuer Eintrag)
```

### Phase 3: Verifikation (NACH JEDEM SCHRITT)

```
[ ] DNS-Propagation prüfen (dig +trace, whatsmydns.net)
[ ] HTTP-Status testen (curl -I)
[ ] SSL-Zertifikat prüfen (openssl s_client)
[ ] Service-Funktionalität testen
```

---

## 6. RISIKO-MATRIX

| Änderung | Risiko | Begründung | Mitigation |
|---|---|---|---|
| `agentmemory` Proxy entfernen | 🟠 Mittel | Aktuell 301 via Proxy → DNS-Only ändert Verhalten | Rollback vorbereiten, niedrige TTL |
| `ai-router` Anpassung | 🟢 Gering | Bereits A-Record, nur Proxy/TTL-Anpassung | Einfacher Rollback |
| Neue A-Records (api, auth) | 🟢 Gering | Neuanlagen, keine bestehenden Dienste betroffen | Minimales Risiko |
| Apex `nexifyai.cloud` ändern | 🟢 Gering | Kein aktiver Dienst auf Apex | Keine Auswirkungen |

---

## 7. KONSEQUENZEN DER ÄNDERUNGEN

### 7.1 Positive Konsequenzen

- ✅ Reduzierte Latenz (kein Cloudflare Proxy-Durchlauf)
- ✅ Einfachere Netzwerk-Architektur (weniger Komplexität)
- ✅ Klarere Trennung: DNS vs. Proxy
- ✅ Vollständige SSL-Kontrolle (Full strict)
- ✅ Höhere Kompatibilität mit Websockets

### 7.2 Negative Konsequenzen

- ⚠️ Server-IP wird sichtbar (kein IP-Verschleierung)
- ⚠️ Kein CDN-Caching für diese Subdomains
- ⚠️ Kein DDoS-Schutz über Cloudflare für diese Einträge
- ⚠️ SSL-Zertifikat muss auf Server valide sein

---

## 8. CHECKLISTE: VOR FREIGABE

- [ ] Server-Seitiges SSL (Let's Encrypt) für `*.nexifyai.cloud` läuft
- [ ] Firewall-Regeln offen für Port 80/443 auf `72.62.152.47`
- [ ] A-Records sind korrekt getestet (dry-run via `/etc/hosts`)
- [ ] Rollback-fähiger DNS-Export liegt vor
- [ ] Monitoring/Benachrichtigung aktiv für Dienst-Ausfälle
- [ ] Kommunikation an Team erfolgt (Änderungsfenster)

---

## 9. FREIGABE-BLOCK

```
┌─────────────────────────────────────────────────┐
│ FREIGABE DURCH PASCAL                           │
├─────────────────────────────────────────────────┤
│                                                   │
│ [] Freigegeben — A-Record-Plan wie beschrieben    │
│ [] Abgelehnt — Änderungen erforderlich:           │
│    ___________________________________            │
│                                                   │
│ Datum: _____________  Unterschrift: ___________ │
└─────────────────────────────────────────────────┘
```

---

*Ende des Subdomain A-Record Plans.*
*Nächstes Dokument: `TUNNEL_REDUCTION_PLAN_V1.md`*
