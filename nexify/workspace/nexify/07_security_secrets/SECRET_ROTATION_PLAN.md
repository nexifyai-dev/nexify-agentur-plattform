# SECRET_ROTATION_PLAN

**Stand:** 2026-06-11  
**Version:** 1.0  
**Status:** Plan

> **WICHTIG:** Dieses Dokument enthält NUR Referenzen/Platzhalter, KEINE Secret-Werte.

---

## 1. Rotationsreihenfolge (Risiko-basiert)

Die Rotation erfolgt priorisiert nach Risikolevel. CRITICAL-Secrets zuerst, dann HIGH, dann MEDIUM.

### Phase 1: CRITICAL (Sofort nach Livegang)

| Rang | Secret-ID | Secret-Name | Grund |
|:-----|:----------|:------------|:------|
| 1 | SEC-016 | .env-Dateien | Breiteste Angriffsfläche, unsicherster Speicher |
| 2 | SEC-011 | Supabase Keys (service_role) | DB-Vollzugriff |
| 3 | SEC-009 | SSH-Private-Keys | Server-Vollzugriff |
| 4 | SEC-008 | OPENAI_API_KEY | Kosten + Datenschutz |
| 5 | SEC-001 | ANTHROPIC_AUTH_TOKEN | Kosten + Datenschutz |
| 6 | SEC-002 | ANTHROPIC_API_KEY | Kosten + Datenschutz |
| 7 | SEC-003 | DEEPSEEK_API_KEY | Kosten + Datenschutz |

### Phase 2: HIGH (Innerhalb 1 Woche nach Livegang)

| Rang | Secret-ID | Secret-Name | Grund |
|:-----|:----------|:------------|:------|
| 8 | SEC-013 | Webhook Tokens | Externe Aufrufe manipulierbar |
| 9 | SEC-014 | NEXIFY_AUTO_CHAT_INTERNAL_TOKEN | Interne Kommunikation |
| 10 | SEC-004 | NEXIFY_ROUTER_API_KEY | Interne API |
| 11 | SEC-006 | AGENTMEMORY_SECRET | Agenten-Gedächtnis |
| 12 | SEC-007 | CUSTOM_API_KEY (Hermes) | Agentenzugriff |
| 13 | SEC-010 | Cloudflare API Tokens | DNS/CDN |
| 14 | SEC-017 | TLS/SSL Certificates | HTTPS |

### Phase 3: MEDIUM (Innerhalb 2 Wochen nach Livegang)

| Rang | Secret-ID | Secret-Name | Grund |
|:-----|:----------|:------------|:------|
| 15 | SEC-005 | YOU_API_KEY | Nur Recherche |
| 16 | SEC-012 | Resend Keys | Nur E-Mail |
| 17 | SEC-015 | HERMES_WEBUI_PASSWORD | Nur UI |

---

## 2. Rotationsprozedur (Pro Secret)

### Allgemeines Schema

Jede Rotation folgt dem **4-Phasen-Modell**:

```
Prüfen → Generieren → Deployen → Testen → Alten deaktivieren
```

### Schritt-für-Schritt (Template)

#### Schritt 1: Abhängigkeiten prüfen
```
[ ] Alle Systeme identifizieren, die das Secret verwenden
[ ] Ausfallzeit/Laufzeitabhängigkeit prüfen
[ ] Staging-Umgebung bereit?
[ ] Break-Glass-Verfahren für dieses Secret vorbereitet?
[ ] Fallback-Plan dokumentiert?
```

#### Schritt 2: Neuen Wert generieren
```
[ ] Secret-Management öffnen (Infisical CLI/UI)
[ ] Neuen Wert generieren (mind. 32 Zeichen, zufällig)
[ ] Für API-Keys: über externes Dashboard neuen Key generieren
[ ] Neuen Wert in Infisical in DEV-Umgebung speichern
```

#### Schritt 3: Deployen
```
[ ] Secret in STAGING-Umgebung aktivieren
[ ] Dienst neu starten / Konfiguration neu laden
[ ] CI/CD-Pipeline mit neuem Secret testen
```

#### Schritt 4: Testen
```
[ ] Funktionstest: System läuft mit neuem Secret
[ ] Integrationstest: Abhängige Systeme erreichen das Ziel
[ ] Log-Check: Keine Fehler durch falsches Secret
[ ] Audit-Log-Check: Zugriff sichtbar
```

#### Schritt 5: Alten Wert deaktivieren
```
[ ] Neues Secret in PRODUCTION deployen
[ ] Alten Wert im Secret-Management deaktivieren (nicht löschen!)
[ ] Alten Wert extern deaktivieren (API-Dashboard)
[ ] 24h Wartezeit: Überwachung auf unerwartete Fehler
[ ] Alten Wert endgültig löschen (nach Bestätigung)
```

---

## 3. Detail-Rotationspläne

### SEC-001: ANTHROPIC_AUTH_TOKEN

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: Claude Code CLI, DeepSeek-Module | 15 min | niedrig |
| 2 | Neuen Token über Anthropic Console generieren | 5 min | niedrig |
| 3 | Token in Infisical (DEV) deployen | 5 min | niedrig |
| 4 | Claude Code CLI testen | 10 min | mittel |
| 5 | Alten Token deaktivieren (Anthropic Console → Revoke) | 5 min | **hoch** |

**Rollback:** Alten Token in Infisical reaktivieren, solange er nicht revoket wurde.

### SEC-002: ANTHROPIC_API_KEY

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: NeXify Router | 15 min | niedrig |
| 2 | Neuen Key über Anthropic Console generieren | 5 min | niedrig |
| 3 | Key in Infisical deployen | 5 min | niedrig |
| 4 | Router-Call zu Anthropic testen | 10 min | mittel |
| 5 | Alten Key revoken | 5 min | **hoch** |

**Rollback:** Alten Key reaktivieren (falls nicht revoket), sonst neuen Key neu deployen.

### SEC-003: DEEPSEEK_API_KEY

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen | 15 min | niedrig |
| 2 | Neuen Key generieren | 5 min | niedrig |
| 3 | Key deployen | 5 min | niedrig |
| 4 | Router-Call zu DeepSeek testen | 10 min | mittel |
| 5 | Alten Key deaktivieren | 5 min | **hoch** |

**Rollback:** Alten Key reaktivieren.

### SEC-004: NEXIFY_ROUTER_API_KEY

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: alle Router-Clients | 20 min | niedrig |
| 2 | Neuen Key generieren (openssl rand -hex 32) | 2 min | niedrig |
| 3 | Key in Infisical deployen + Clients updaten | 15 min | **hoch** |
| 4 | Router-Zugriff testen (alle Clients) | 20 min | mittel |
| 5 | Alten Key deaktivieren | 5 min | niedrig |

**Rollback:** Alten Key wieder bei Clients einspielen.

### SEC-005: YOU_API_KEY

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: Web-Search-Modul | 10 min | niedrig |
| 2 | Neuen Key über You.com Dashboard generieren | 5 min | niedrig |
| 3 | Key deployen | 5 min | niedrig |
| 4 | Web-Search testen | 10 min | niedrig |
| 5 | Alten Key löschen | 5 min | niedrig |

**Rollback:** Alten Key reaktivieren.

### SEC-006: AGENTMEMORY_SECRET

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: Memory Service | 15 min | niedrig |
| 2 | Neuen Secret-Wert generieren | 2 min | niedrig |
| 3 | Secret deployen, Service neustarten | 10 min | mittel |
| 4 | Memory-Zugriff testen | 15 min | mittel |
| 5 | Alten Secret deaktivieren | 5 min | niedrig |

**Rollback:** Alten Secret-Wert zurücksetzen, Service neustarten.

### SEC-007: CUSTOM_API_KEY (Hermes)

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: Hermes-Module | 15 min | niedrig |
| 2 | Neuen Key generieren | 2 min | niedrig |
| 3 | Key deployen | 5 min | niedrig |
| 4 | Hermes-Funktionen testen | 15 min | mittel |
| 5 | Alten Key deaktivieren | 5 min | niedrig |

**Rollback:** Alten Key deployen.

### SEC-008: OPENAI_API_KEY

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen | 15 min | niedrig |
| 2 | Neuen Key über OpenAI Dashboard generieren | 5 min | niedrig |
| 3 | Key in Infisical (DEV) deployen | 5 min | niedrig |
| 4 | Router-Call zu OpenAI testen | 10 min | mittel |
| 5 | Alten Key revoken | 5 min | **hoch** |

**Rollback:** Alten Key reaktivieren (falls nicht revoket).

### SEC-009: SSH-Private-Keys

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: alle SSH-Ziele | 30 min | niedrig |
| 2 | Neues SSH-Key-Paar generieren (ssh-keygen -t ed25519) | 5 min | niedrig |
| 3 | Public Key auf allen Servern deployen | 30 min | **hoch** |
| 4 | SSH-Verbindung testen | 30 min | mittel |
| 5 | Alten Public Key von Servern entfernen | 15 min | niedrig |

**Rollback:** Alten Public Key wieder auf Servern einspielen.

### SEC-010: Cloudflare API Tokens

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: DNS, CDN, SSL | 15 min | niedrig |
| 2 | Neuen Token über Cloudflare Dashboard generieren | 10 min | niedrig |
| 3 | Token deployen | 5 min | niedrig |
| 4 | DNS/CDN-Funktionen testen | 20 min | mittel |
| 5 | Alten Token revoken | 5 min | **hoch** |

**Rollback:** Alten Token reaktivieren (vor Ablauf des Revoke).

### SEC-011: Supabase Keys

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: alle DB-Clienten | 20 min | niedrig |
| 2 | Neue Keys über Supabase Dashboard generieren | 10 min | niedrig |
| 3 | Keys deployen (service_role + anon) | 10 min | **hoch** |
| 4 | DB-Zugriff testen (lesen + schreiben) | 20 min | **hoch** |
| 5 | Alte Keys revoken | 10 min | **hoch** |

**Rollback:** Alte Keys reaktivieren (Supabase Dashboard).

### SEC-012: Resend Keys

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: Notification Service | 10 min | niedrig |
| 2 | Neuen Key über Resend Dashboard generieren | 5 min | niedrig |
| 3 | Key deployen | 5 min | niedrig |
| 4 | E-Mail-Versand testen | 10 min | niedrig |
| 5 | Alten Key revoken | 5 min | niedrig |

**Rollback:** Alten Key reaktivieren.

### SEC-013: Webhook Tokens

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: alle Webhook-Empfänger | 20 min | niedrig |
| 2 | Neue Tokens generieren (openssl rand -hex 32) | 5 min | niedrig |
| 3 | Tokens deployen + in externen Systemen updaten | 30 min | **hoch** |
| 4 | Webhook-Auslösung testen | 20 min | mittel |
| 5 | Alte Tokens deaktivieren | 10 min | niedrig |

**Rollback:** Alte Tokens wieder in externen Systemen eintragen.

### SEC-014: NEXIFY_AUTO_CHAT_INTERNAL_TOKEN

| Schritt | Aktion | Dauer | Risiko |
|:--------||:-------|:------|:-------|
| 1 | Abhängigkeiten prüfen: Auto Chat Service | 10 min | niedrig |
| 2 | Neuen Token generieren | 2 min | niedrig |
| 3 | Token deployen, Service neustarten | 10 min | mittel |
| 4 | Auto Chat testen | 15 min | mittel |
| 5 | Alten Token deaktivieren | 5 min | niedrig |

**Rollback:** Alten Token deployen, Service neustarten.

### SEC-016: .env-Dateien (Systemische Rotation)

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Alle Secrets aus .env in Infisical migrieren | n/a (Grundmigration) | **hoch** |
| 2 | .env-Dateien aus Produktion entfernen | 30 min | **hoch** |
| 3 | Backup der .env-Dateien erstellen (verschlüsselt) | 10 min | niedrig |
| 4 | Systemlauf mit Infisical-Referenzen testen | 60 min | **hoch** |
| 5 | .env-Dateien aus Git-Verlauf entfernen (BFG Repo-Cleaner) | 30 min | mittel |

**Rollback:** .env-Dateien wiederherstellen, Dienst neustarten.

### SEC-017: TLS/SSL Certificates

| Schritt | Aktion | Dauer | Risiko |
|:--------|:-------|:------|:-------|
| 1 | Ablaufdatum prüfen | 5 min | niedrig |
| 2 | Neues Zertifikat via Let's Encrypt / Cert-Manager anfordern | 10 min | niedrig |
| 3 | Zertifikat deployen | 5 min | niedrig |
| 4 | HTTPS-Verbindung testen | 10 min | mittel |
| 5 | Altes Zertifikat deaktivieren | 5 min | niedrig |

**Rollback:** Altes Zertifikat wieder deployen (vor Ablauf).

---

## 4. Rollback-Plan (Generisch)

| Schritt | Aktion | Verantwortlich | Dauer |
|:--------|:-------|:---------------|:------|
| 1 | Fehler erkennen (Monitoring/Alert) | System/Operator | <5 min |
| 2 | Rotation stoppen – keine weiteren Secrets rotieren | Operator | 1 min |
| 3 | Altes Secret in Infisical reaktivieren | Operator | 2 min |
| 4 | Dienste mit altem Secret neustarten | Operator | 5 min |
| 5 | Funktionstest durchführen | Operator | 15 min |
| 6 | Root-Cause-Analyse starten | Team | n/a |

**Rollback-Fenster:** Maximal 24h nach Rotation, danach kann alter Key revoket sein.

---

## 5. Break-Glass-Prozedur (Kurzform)

Siehe separates Dokument: `BREAK_GLASS_AND_RECOVERY_POLICY.md`

**Kurzübersicht:**
1. Operator identifiziert sich
2. Break-Glass-Skript ausführen (`scripts/break-glass.sh <secret-id>`)
3. Audit-Log-Eintrag wird automatisch erstellt
4. Secret wird für 60 Minuten freigegeben
5. Nach 60 Minuten: automatische Sperrung + Benachrichtigung an Security-Team

---

**Keine Klartextwerte enthalten. Nächste Überprüfung: 2026-07-11**
