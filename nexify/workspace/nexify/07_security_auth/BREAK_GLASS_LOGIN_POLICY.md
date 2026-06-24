# Break-Glass Login Policy — NeXify OIDC Auth

**Stand:** 2026-06-12
**Version:** 1.0
**Status:** Policy (in Kraft)

> **WICHTIG:** Dieses Dokument enthalt NUR Referenzen/Platzhalter, KEINE Secret-Werte.

---

## 1. Zweck

Break-Glass-Login erlaubt temporaren Authentifizierungszugriff **ausserhalb der normalen OIDC-Auth-Kette** fur zwingende Notfalle. Dies ist das letzte Mittel, wenn der OIDC-Provider nicht erreichbar ist, der Token-Service ausgefallen ist oder ein Admin-Konto gesperrt wurde.

### Prinzipien

1. **Letztes Mittel** — Nur wenn OIDC-Auth komplett ausfallt
2. **Vier-Augen-Prinzip** — Mindestens 2 autorisierte Personen fur Aktivierung
3. **Zeitlich begrenzt** — Maximal 60 Minuten
4. **Vollstandiges Audit** — Jeder Zugriff wird protokolliert
5. **Nachbereitung** — RCA + Pramassnahmen innerhalb 24h

---

## 2. Ausloser

### Berechtigt

| Szenario | Beschreibung |
|----------|-------------|
| **OIDC-Provider ausgefallen** | auth.nexifyai.cloud nicht erreichbar |
| **Token-Service down** | 9Router kann Tokens nicht validieren |
| **Admin-Konto gesperrt** | Unfall oder Security-Vorfall |
| **Rotation-Fehler** | OIDC-Client-Secret rotiert, neues funktioniert nicht |

### Nicht berechtigt

| Szenario | Grund |
|----------|-------|
| Bequemlichkeit | Normaler Login ware gunstiger |
| Vergessenes Passwort | Passwort-Reset nutzen |
| Zeitdruck | Kein Sicherheitsrisiko rechtfertigt Umgehung |

---

## 3. Berechtigte

| Rolle | Darf aktivieren? | Darf autorisieren? |
|-------|-----------------|-------------------|
| Security Engineer | Ja | Ja |
| DevOps Engineer | Ja | Nein |
| System-Admin | Ja | Nein |
| Developer | Nur mit Autorisierung | Nein |

**Minimum:** 2 Personen (Autorisierer + Ausfuhrer).

---

## 4. Aktivierungsprozedur

```
PHASE 1 — Aktivierung
[1] Notfall feststellen (OIDC down / kein Login moglich)
[2] Security Engineer benachrichtigen
[3] Berechtigten Ausloser prufen
[4] Break-Glass-Formular ausfullen:
    - Secret/Grund: ____________
    - Antragsteller: ____________
    - Autorisiert durch: _________
    - Zeitstempel: _______________
[5] Break-Glass-Endpunkt aufrufen:
    curl -X POST https://9router:20128/v1/auth/break-glass \
      -H "Content-Type: application/json" \
      -d '{"token": "$RECOVERY_KEY", "reason": "...", "requested_by": "..."}'
[6] Temporarer Login wird fur 60 Min freigegeben
[7] Audit-Log-Eintrag automatisch

PHASE 2 — Zugriff
[1] Mit temporarem Token anmelden
[2] Nur notige Aktionen durchfuhren
[3] Kritischen Fix anwenden (OIDC-Provider neustarten / Token neu ausstellen)
[4] Zugriff sofort beenden nach Abschluss

PHASE 3 — Automatische Sperrung
Nach 60 Min (oder manuell fruher):
[1] Token widerrufen
[2] Cache geloscht
[3] Audit-Log "ABGESCHLOSSEN"
[4] Security-Team-Benachrichtigung
```

---

## 5. Recovery-Keys

| Key | Zweck | Aufbewahrung | Rotationsintervall |
|-----|-------|-------------|-------------------|
| `RECOVERY_KEY_1` | Break-Glass-API-Aufruf | Physisch (Tresor) + Infisical SEC-OIDC-RECOVERY-KEY | 90 Tage |
| `RECOVERY_KEY_2` | Lokaler Admin-Zugang | `.env` auf 9Router-Host | Bei jedem OIDC-Secret-Wechsel |

---

## 6. Audit-Pflicht

### Pflichtfelder pro Break-Glass-Ereignis

| Feld | Beispiel |
|------|---------|
| event_id | BG-OIDC-20260612-001 |
| timestamp | 2026-06-12T14:30:00Z |
| reason | "OIDC-Provider nicht erreichbar" |
| applicant | devops@nexify.local |
| authorizer | security@nexify.local |
| action | read-token + restart-provider |
| duration_minutes | 35 |
| status | completed |

---

## 7. Nachbereitung (innerhalb 24h)

- [ ] Root-Cause-Analyse: Warum war OIDC nicht verfugbar?
- [ ] Pramassnahmen definieren
- [ ] Policy-Update (falls notig)
- [ ] Report an CTO

---

## 8. Testplan

| Intervall | Test | Kriterium |
|-----------|------|-----------|
| Monatlich | Break-Glass-Endpunkt antwortet | HTTP 200 |
| Vierteljahrlich | Vollstandiger Durchlauf (trocken) | < 15 Minuten |
| Vierteljahrlich | Recovery-Key-Rotation funktioniert | Alter Key gesperrt, neuer aktiv |
| Jahrlich | Voll-Audit aller BG-Ereignisse | 100% nachbereitet |

---

**Policy erstellt von:** NeXify Security Engineering
**Nachstes Review:** 2026-07-12
