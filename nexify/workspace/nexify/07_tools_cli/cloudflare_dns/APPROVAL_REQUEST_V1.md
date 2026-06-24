# APPROVAL REQUEST V1 — FORMALLE FREIGABEANFRAGE

---
**Titel:** Formelle Freigabeanfrage — Netzwerk-, DNS-, Cloudflare-, Vercel-Änderungen
**Status:** WAITING_FOR_APPROVAL
**Version:** 1.0.0
**Datum:** 2026-06-10
**AUTHOR:** NETZWERK-EXPERTE
**Klassifikation:** INTERNAL — NEXIFY INFRASTRUCTURE
**An:** Pascal (Entscheider)
**Von:** NETZWERK-EXPERTE (Subagent Sicherheitsauditor)
---

## ⚠️ STATUS

> **Derzeit: WAITING_FOR_APPROVAL**
> Keine Änderungen werden ohne schriftliche Freigabe durch Pascal umgesetzt.

---

## 1. ZUSAMMENFASSUNG DER BEANTRAGTEN ÄNDERUNGEN

### 1.1 Änderungspaket A: DNS-Optimierung (Höchste Priorität)

| # | Änderung | Ziel | Risiko |
|---|---|---|---|
| A-01 | `agentmemory.nexifyai.cloud` Proxy deaktivieren (DNS Only) | Reduzierte Latenz, Websocket-Kompatibilität | 🟠 Mittel |
| A-02 | `ai-router.nexifyai.cloud` prüfen, ggf. A-Record optimieren | Stabilität, direktes Routing | 🟢 Gering |
| A-03 | TTL auf 120s (Backend) / 300s (Standard) setzen | Schnellere Propagation bei Änderungen | 🟢 Gering |

### 1.2 Änderungspaket B: Subdomain-Erweiterung (Mittlere Priorität)

| # | Änderung | Ziel | Risiko |
|---|---|---|---|
| B-01 | `api.nexifyai.cloud` A-Record anlegen (Sparplan) | Reserviert für API-Gateway | 🟢 Gering |
| B-02 | `auth.nexifyai.cloud` A-Record anlegen (Sparplan) | Reserviert für Authentifizierung | 🟢 Gering |
| B-03 | `*.nexifyai.cloud` Wildcard A-Record anlegen | Flexibilität für neue Subdomains | 🟢 Gering |

### 1.3 Änderungspaket C: Tunnel-Reduktion (Nach vorheriger Prüfung)

| # | Änderung | Ziel | Risiko |
|---|---|---|---|
| C-01 | Tunnel inventarisieren (KEINE Änderung) | Bestandsaufnahme | 🟢 Gering |
| C-02 | Tunnel schrittweise durch A-Records ersetzen | Reduzierte Komplexität | 🟠 Mittel |
| C-03 | Tunnel-Konfiguration sichern und deaktivieren | Aufgeräumte Infrastruktur | 🟠 Mittel |

### 1.4 Änderungspaket D: SSL/TLS-Optimierung (Niedrige Priorität)

| # | Änderung | Ziel | Risiko |
|---|---|---|---|
| D-01 | SSL-Modus auf Full (strict) setzen | Ende-zu-Ende-Verschlüsselung | 🟠 Mittel |
| D-02 | Let's Encrypt Wildcard für `*.nexifyai.cloud` | SSL für alle Subdomains | 🟢 Gering |
| D-03 | HSTS aktivieren (max-age=31536000) | Strict Transport Security | 🟢 Gering |

### 1.5 Änderungspaket E: Mail-DNS-Sicherheit (Niedrige Priorität)

| # | Änderung | Ziel | Risiko |
|---|---|---|---|
| E-01 | SPF-Record setzen: `v=spf1 -all` | Spoofing-Schutz | 🟢 Gering |
| E-02 | DMARC-Record setzen: Phase 1 (p=none) | Monitoring, später reject | 🟢 Gering |

---

## 2. RISIKO-BEWERTUNG (GESAMT)

### 2.1 Risiko-Matrix

| Bereich | Risiko | Begründung |
|---|---|---|
| **Website-Verfügbarkeit** | 🟢 **Gering** | `nexify-automate.com` bleibt unverändert |
| **API/Backend-Verfügbarkeit** | 🟠 **Mittel** | Tunnel-Reduktion birgt Ausfallrisiko |
| **Datensicherheit** | 🟢 **Gering** | SSL-Verbesserung erhöht Sicherheit |
| **Mail-Zustellung** | 🟢 **Gering** | Aktuell kein Mail-Versand |
| **SEO/Rankings** | 🟢 **Gering** | Keine Änderung an Hauptdomain |

### 2.2 Gesamt-Risikoeinschätzung

| Kategorie | Wert |
|---|---|
| **Gesamt-Risiko** | 🟢 **Niedrig bis Mittel** |
| **Kritische Änderungen** | 0 (keine) |
| **Hoch-Risiko-Änderungen** | 0 (keine) |
| **Mittel-Risiko-Änderungen** | 3 (`agentmemory` Proxy, Tunnel-Reduktion, SSL-Modus) |
| **Gering-Risiko-Änderungen** | 8 (A-Records, TTL, Mail-DNS, Wildcard) |

---

## 3. ROLLBACK-PLAN (KURZFASSUNG)

> **Ausführlicher Rollback-Plan:** Siehe `ROLLBACK_PLAN_V1.md`

### 3.1 DNS-Rollback

| Szenario | Rollback | Max. Zeit |
|---|---|---|
| A-Record falsch | Alten Wert wiederherstellen | 2 Minuten |
| Proxy fälschlich deaktiviert | Proxy wieder aktivieren | 1 Minute |
| TTL zu niedrig | TTL erhöhen | 1 Minute |

### 3.2 Tunnel-Rollback

| Szenario | Rollback | Max. Zeit |
|---|---|---|
| Tunnel gestoppt, Service down | `cloudflared tunnel run <NAME>` | 3 Minuten |
| Tunnel gelöscht | Config aus Backup + `cloudflared tunnel create` | 10 Minuten |

### 3.3 SSL-Rollback

| Szenario | Rollback | Max. Zeit |
|---|---|---|
| SSL-Modus Full (strict) fehlschlägt | Auf "Full" (ohne strict) zurück | 1 Minute |
| Let's Encrypt fehlerhaft | Auf Cloudflare Universal zurück | 5 Minuten |

### 3.4 Mail-DNS-Rollback

| Szenario | Rollback | Max. Zeit |
|---|---|---|
| SPF/DMARC blockiert legitim | Eintrag löschen | 1 Minute |

---

## 4. TEST-PLAN

### 4.1 Vor der Änderung (Baseline)

```
Test 1: nexify-automate.com → 200 OK, SSL gültig
Test 2: www.nexify-automate.com → 308 → 200 OK
Test 3: ai-router.nexifyai.cloud → 401 (erwartet)
Test 4: agentmemory.nexifyai.cloud → aktueller Status dokumentieren
Test 5: dig +trace für alle Domains → DNS-Propagation prüfen
Test 6: openssl s_client → SSL-Zertifikate prüfen
```

### 4.2 Nach jeder Änderung

```
Test 1: curl -I https://<geänderte-domain> → Status prüfen
Test 2: dig <geänderte-domain> → DNS-Eintrag prüfen
Test 3: curl -v https://<geänderte-domain> → SSL-Zertifikat prüfen
Test 4: Service-Funktionalität testen (API-Call, Website-Laden)
Test 5: whatsmydns.net → Globale Propagation prüfen
```

### 4.3 Abschluss-Test (nach allen Änderungen)

```
Test 1: https://nexify-automate.com → 200 OK, SSL grün, keine Warnungen
Test 2: https://ai-router.nexifyai.cloud → 401 (Backend)
Test 3: https://agentmemory.nexifyai.cloud → Antwort (Service)
Test 4: https://api.nexifyai.cloud → 404 / Antwort (sobald aktiv)
Test 5: dig TXT nexify-automate.com → SPF vorhanden
Test 6: dig TXT _dmarc.nexify-automate.com → DMARC vorhanden
Test 7: SSL-Labs-Test (SSLLabs.com) → Bewertung A oder besser
```

---

## 5. ÄNDERUNGSFENSTER

### 5.1 Vorschlag

| Phase | Änderungen | Geschätzte Dauer | Vorschlag Zeitpunkt |
|---|---|---|---|
| **Phase 1** | A-01 bis A-03 (DNS-Optimierung) | 30 Minuten | Beliebig (niedriges Risiko) |
| **Phase 2** | B-01 bis B-03 (Subdomain-Erweiterung) | 15 Minuten | Beliebig (sehr niedriges Risiko) |
| **Phase 3** | C-01 bis C-03 (Tunnel-Reduktion) | 2 Stunden | Am besten nachts/Wochenende |
| **Phase 4** | D-01 bis D-03 (SSL-Optimierung) | 1 Stunde | Beliebig (nach Phase 3) |
| **Phase 5** | E-01 bis E-02 (Mail-DNS) | 15 Minuten | Beliebig (niedriges Risiko) |

### 5.2 Time-Box (pro Phase)

| Phase | Max. Zeit | Bei Überschreitung |
|---|---|---|
| Phase 1 | 45 Min | Rollback, nächster Termin |
| Phase 2 | 30 Min | Rollback, nächster Termin |
| Phase 3 | 3 Stunden | Abbruch, bestehende Tunnel wieder aktivieren |
| Phase 4 | 1,5 Stunden | SSL-Modus auf alten Wert zurücksetzen |
| Phase 5 | 30 Min | Rollback, nächster Termin |

---

## 6. AUSWIRKUNGEN BEI ABLEHNUNG

| Änderung | Auswirkung wenn nicht umgesetzt |
|---|---|
| **DNS-Optimierung** | Erhöhte Latenz, mögliche Websocket-Probleme |
| **Subdomain-Erweiterung** | Keine — Sparplan, kein Block |
| **Tunnel-Reduktion** | Unnötige Komplexität, erhöhte Angriffsfläche |
| **SSL-Optimierung** | Keine Vollverschlüsselung, niedrigere SSL-Bewertung |
| **Mail-DNS** | SPF/DKIM/DMARC fehlen → Spoofing möglich |

---

## 7. NÄCHSTE SCHRITTE (NACH FREIGABE)

1. ⬜ **Backup erstellen** (DNS-Export, Tunnel-Config, Vercel-Config)
2. ⬜ **Phase 1 durchführen** (DNS-Optimierung)
3. ⬜ **Phase 2 durchführen** (Subdomain-Erweiterung)
4. ⬜ **Phase 3 durchführen** (Tunnel-Reduktion) — nur nach erfolgreicher Phase 1+2
5. ⬜ **Phase 4 durchführen** (SSL-Optimierung)
6. ⬜ **Phase 5 durchführen** (Mail-DNS-Sicherheit)
7. ⬜ **Abschluss-Test** durchführen und dokumentieren
8. ⬜ **Ergebnis-Report** erstellen

---

## 8. FREIGABE-BLOCK (AUSFÜLLEN DURCH PASCAL)

```
┌──────────────────────────────────────────────────────────────────┐
│                      FORMALLE FREIGABE                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Option 1: VOLLSTÄNDIGE FREIGABE                                 │
│  [] Alle Phasen (A-E) freigegeben                                │
│                                                                   │
│  Option 2: STUFE FÜR STUFE                                       │
│  [] Nur Phase 1 freigegeben (DNS-Optimierung)                    │
│  [] Nur Phase 1+2 freigegeben                                    │
│  [] Nur Phase 3 nach vorheriger Prüfung freigegeben               │
│  [] Nur Phase 4 freigegeben                                      │
│  [] Nur Phase 5 freigegeben                                      │
│                                                                   │
│  Option 3: ABLEHNUNG                                              │
│  [] Abgelehnt — Änderungen abgelehnt                             │
│      Begründung: __________________________________              │
│                                                                   │
│  Option 4: ÄNDERUNGEN GEWÜNSCHT                                   │
│  [] Änderungen gewünscht — bitte anpassen:                       │
│      _________________________________________                   │
│                                                                   │
│  Datum: _____________  Unterschrift: _________________________ │
│                                                                   │
│  Hinweis: Diese Freigabe gilt für 14 Tage ab Unterschrift.       │
│  Nach Ablauf ist eine erneute Freigabe erforderlich.             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. DOKUMENTEN-ÜBERSICHT

| # | Datei | Beschreibung | Status |
|---|---|---|---|
| 1 | `NETWORK_MASTER_AUDIT_V1.md` | Ist-Zustand der gesamten Netzwerk-Infrastruktur | ✅ Erstellt |
| 2 | `CLOUDFLARE_DNS_TARGET_STATE_V1.md` | Ziel-Zustand DNS, Proxy, SSL | ✅ Erstellt |
| 3 | `SUBDOMAIN_A_RECORD_PLAN_V1.md` | Detaillierter A-Record-Plan | ✅ Erstellt |
| 4 | `TUNNEL_REDUCTION_PLAN_V1.md` | Tunnel-Reduktionsstrategie | ✅ Erstellt |
| 5 | `NEXIFY_AUTOMATE_ACTIVE_WEBSITE_PLAN_V1.md` | Hauptdomain-Strategie | ✅ Erstellt |
| 6 | `NEXIFYAI_CLOUD_RESERVED_DOMAIN_PLAN_V1.md` | nexifyai.cloud Reservierungsplan | ✅ Erstellt |
| 7 | `VERCEL_DOMAIN_PLAN_V1.md` | Vercel Custom Domains, Env-Vars, Hooks | ✅ Erstellt |
| 8 | `MAIL_DNS_SPF_DKIM_DMARC_FIX_PLAN_V1.md` | SPF/DKIM/DMARC Fix-Plan | ✅ Erstellt |
| 9 | `ROLLBACK_PLAN_V1.md` | Notfall- und Wiederherstellungsplan | ✅ Erstellt |
| 10 | **`APPROVAL_REQUEST_V1.md`** | **Diese Freigabeanfrage** | ✅ **Erstellt — WAITING_FOR_APPROVAL** |

---

## 10. ABSCHLUSS

> **Diese formelle Freigabeanfrage fasst alle geplanten Netzwerk-, DNS-, Cloudflare-,
> Tunnel-, Vercel- und Mail-DNS-Änderungen zusammen.**
>
> **Derzeitiger Status: WAITING_FOR_APPROVAL**
> **Keine Änderungen werden ohne schriftliche Freigabe durch Pascal umgesetzt.**
>
> Nach Freigabe werden die Änderungen phasenweise, mit vollständigem Rollback-Plan,
> dokumentiertem Backup und abschließendem Test-Report durchgeführt.

---

*Ende der formellen Freigabeanfrage.*
*Alle 10 Planungsdokumente erstellt und abrufbereit.*
