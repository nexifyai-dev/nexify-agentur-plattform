# MAIL-DNS: SPF / DKIM / DMARC — FIX PLAN V1

---
**Titel:** Mail DNS Security — SPF, DKIM, DMARC Prüf- und Fix-Plan
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

## 1. GRUNDSATZENTSCHEIDUNG: BRAUCHEN WIR MAIL?

### 1.1 Entscheidungsmatrix

| Frage | Antwort | Konsequenz |
|---|---|---|
| Versendet nexify-automate.com E-Mails? | ❓ Unbekannt | SPF/DKIM/DMARC notwendig falls ja |
| Versendet nexifyai.cloud E-Mails? | ❓ Unbekannt | SPF/DKIM/DMARC notwendig falls ja |
| Gibt es Kontaktformulare? | ❓ Unbekannt | Falls ja → SMTP oder API |
| Gibt es Transaktions-Mails? | ❓ Unbekannt | Falls ja → Mail-Dienst nötig |
| Gibt es Newsletter? | ❓ Unbekannt | Falls ja → Mail-Dienst nötig |

### 1.2 Vorschlag: Mail-Strategie festlegen

| Strategie | Beschreibung | SPF/DKIM/DMARC |
|---|---|---|
| **A) Kein Mail-Versand** | Keine E-Mails von diesen Domains | ❌ Nicht nötig (trotzdem empfehlenswert) |
| **B) Transaktions-Mails** | Passwort-Reset, Benachrichtigungen | ✅ Zwingend erforderlich |
| **C) Externer Dienst** | SendGrid, Mailgun, AWS SES | ✅ Nach Anbieter-Vorgabe |
| **D) Eigener Mail-Server** | Postfix/Dovecot auf VDS | ❌ Nicht empfohlen (hoher Aufwand) |

> **EMPFEHLUNG:** Option C (externer Dienst) für Transaktions-Mails.
> Kein eigener Mail-Server auf dem VDS (Sicherheitsrisiko, Wartungsaufwand).

---

## 2. SPF (Sender Policy Framework)

### 2.1 Was ist SPF?

SPF legt fest, welche Server E-Mails im Namen einer Domain versenden dürfen.

```
Beispiel: "v=spf1 include:_spf.google.com ~all"
→ Nur Google-Server dürfen Mails für diese Domain senden
```

### 2.2 SPF-Plan für `nexify-automate.com`

| Szenario | SPF-Eintrag |
|---|---|
| **Kein Mail-Versand** | `v=spf1 -all` (hart ablehnen) |
| **Nur Vercel** | `v=spf1 include:vercel.com ~all` |
| **SendGrid** | `v=spf1 include:sendgrid.net ~all` |
| **Mailgun** | `v=spf1 include:mailgun.org ~all` |
| **AWS SES** | `v=spf1 include:amazonses.com ~all` |
| **Mehrere Dienste** | `v=spf1 include:sendgrid.net include:spf.mailgun.org ~all` |

### 2.3 SPF-Plan für `nexifyai.cloud`

| Szenario | SPF-Eintrag |
|---|---|
| **Kein Mail-Versand** (empfohlen) | `v=spf1 -all` (hart ablehnen) |
| **API-Transaktions-Mails** | Nach Anbieter |

> **WICHTIG:** SPF hat ein Limit von 10 DNS-Lookups (includes).
> `-all` = hart ablehnen (Fail), `~all` = weich ablehnen (Softfail)

### 2.4 SPF-Record-Template (TXT-Record)

| Domain | Typ | Name | Wert | TTL |
|---|---|---|---|---|
| `nexify-automate.com` | TXT | `@` | `v=spf1 -all` | `3600` |
| `nexifyai.cloud` | TXT | `@` | `v=spf1 -all` | `3600` |

---

## 3. DKIM (DomainKeys Identified Mail)

### 3.1 Was ist DKIM?

DKIM signiert E-Mails digital. Empfänger können die Signatur mit einem öffentlichen
Schlüssel im DNS prüfen.

```
Selector: mail._domainkey.nexify-automate.com
Typ: TXT
Wert: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."
```

### 3.2 DKIM-Plan

| Szenario | DKIM nötig? |
|---|---|
| **Kein Mail-Versand** | ❌ Nein |
| **Externer Mail-Dienst** | ✅ Ja — Anbieter stellt Schlüssel bereit |
| **Eigener Mail-Server** | ✅ Ja — selbst generieren |

### 3.3 Vorschlag: Kein DKIM (bei keinem Mail-Versand)

Solange keine E-Mails verschickt werden, ist DKIM nicht erforderlich.
Bei zukünftiger Mail-Einführung nach Bedarf hinzufügen.

---

## 4. DMARC (Domain-based Message Authentication, Reporting & Conformance)

### 4.1 Was ist DMARC?

DMARC sagt dem Empfänger, was mit E-Mails passieren soll, die SPF/DKIM nicht bestehen.

```
Beispiel: "v=DMARC1; p=reject; rua=mailto:dmarc@nexify-automate.com"
→ Alle E-Mails, die SPF/DKIM nicht bestehen, werden abgelehnt
→ Berichte an dmarc@nexify-automate.com
```

### 4.2 DMARC-Policies

| Policy | Wirkung | Empfehlung |
|---|---|---|
| `p=none` | Nur Monitoring, keine Aktion | ❌ Nur für Testphase |
| `p=quarantine` | Nicht bestandene Mails → Spam | ⚠️ Übergangsweise |
| `p=reject` | Nicht bestandene Mails → ablehnen | ✅ Ziel-Zustand |

### 4.3 DMARC-Plan

| Phase | Policy | Dauer | Beschreibung |
|---|---|---|---|
| **Phase 1** | `p=none` | 2 Wochen | Monitoring — Reports sammeln |
| **Phase 2** | `p=quarantine` | 2 Wochen | Spam-Ordner für Problem-Fälle |
| **Phase 3** | `p=reject` | Dauerhaft | Vollständiger Schutz |

### 4.4 DMARC-Record-Template

| Domain | Typ | Name | Wert | TTL |
|---|---|---|---|---|
| `nexify-automate.com` | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@nexify-automate.com; ruf=mailto:dmarc@nexify-automate.com; fo=1` | `3600` |
| `nexifyai.cloud` | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@nexifyai.cloud; ruf=mailto:dmarc@nexifyai.cloud; fo=1` | `3600` |

> **HINWEIS:** Die DMARC-Report-Empfänger-Adresse (`rua`) muss selbst E-Mails empfangen können.
> Falls keine Mail-Infrastruktur existiert → `rua` weglassen oder externen Dienst (z.B. dmarcian) nutzen.

---

## 5. MX-RECORDS (MAIL EXCHANGE)

### 5.1 Was ist ein MX-Record?

MX-Records legen fest, welche Server E-Mails für eine Domain empfangen.

### 5.2 MX-Plan

| Szenario | MX-Eintrag |
|---|---|
| **Kein Mail-Empfang** | ❌ Kein MX-Eintrag nötig |
| **Google Workspace** | `ASPMX.L.GOOGLE.COM.` (Priority 1) |
| **Microsoft 365** | `outlook.com` (Priority 0) |
| **Eigener Server** | `72.62.152.47` (NICHT EMPFOHLEN) |

### 5.3 Empfehlung

> **Keine MX-Records setzen, solange keine Mail-Infrastruktur existiert.**
> Falls später E-Mail gewünscht wird → Google Workspace oder Microsoft 365.

---

## 6. GESAMT-KONFIGURATION (ZIELZUSTAND)

### 6.1 `nexify-automate.com` — Ohne Mail

| Typ | Name | Wert | TTL |
|---|---|---|---|
| TXT | `@` | `v=spf1 -all` | `3600` |
| TXT | `_dmarc` | `v=DMARC1; p=reject;` | `3600` |

### 6.2 `nexifyai.cloud` — Ohne Mail

| Typ | Name | Wert | TTL |
|---|---|---|---|
| TXT | `@` | `v=spf1 -all` | `3600` |
| TXT | `_dmarc` | `v=DMARC1; p=reject;` | `3600` |

> **HINWEIS:** `-all` (SPF) + `p=reject` (DMARC) bedeutet:
> Jede E-Mail, die angeblich von diesen Domains kommt, aber nicht von autorisierten
> Servern stammt, wird abgelehnt. Das schützt vor Spoofing.

---

## 7. ÄNDERUNGS-PLAN (NACH FREIGABE)

### Phase 1: Prüfung (KEINE ÄNDERUNG)

```
[ ] dig TXT nexify-automate.com → SPF prüfen
[ ] dig TXT _dmarc.nexify-automate.com → DMARC prüfen
[ ] dig MX nexify-automate.com → MX prüfen
[ ] dig TXT nexifyai.cloud → SPF prüfen
[ ] dig TXT _dmarc.nexifyai.cloud → DMARC prüfen
[ ] dig MX nexifyai.cloud → MX prüfen
```

### Phase 2: SPF setzen (nach Freigabe)

```
Schritt 1: TXT-Record für nexify-automate.com: "v=spf1 -all"
Schritt 2: TXT-Record für nexifyai.cloud: "v=spf1 -all"
Schritt 3: Propagation abwarten (max. 1h)
Schritt 4: Verifikation: dig TXT <domain>
```

### Phase 3: DMARC setzen (nach Freigabe)

```
Schritt 1: TXT-Record _dmarc.nexify-automate.com: "v=DMARC1; p=none;"
Schritt 2: TXT-Record _dmarc.nexifyai.cloud: "v=DMARC1; p=none;"
Schritt 3: 2 Wochen monitoring (p=none)
Schritt 4: Auf p=quarantine erhöhen (2 Wochen)
Schritt 5: Auf p=reject erhöhen (dauerhaft)
```

---

## 8. RISIKO-ANALYSE

| Änderung | Risiko | Begründung | Mitigation |
|---|---|---|---|
| SPF `-all` setzen | 🟢 Gering | Nur wenn kein Mail-Versand — schützt vor Spoofing | Vorher prüfen ob Mails versendet werden |
| DMARC `p=reject` | 🟠 Mittel | Könnte legitime Mails blockieren wenn Mail-Dienst später | Schrittweise Erhöhung (none → quarantine → reject) |
| MX löschen | 🟢 Gering | Wenn kein MX existiert, kann keine Domain Mails empfangen | Vorher prüfen ob MX aktuell genutzt wird |

---

## 9. OFFENE PUNKTE

- [ ] Entscheidung: Versendet eine der Domains E-Mails?
- [ ] Falls ja: Welcher Mail-Dienst?
- [ ] Aktuelle SPF/DKIM/DMARC/MX-Einträge prüfen (`dig`)
- [ ] DMARC-Report-Empfänger-Adresse festlegen
- [ ] **FREIGABE durch Pascal vor Änderungen**

---

## 10. FREIGABE-BLOCK

```
┌─────────────────────────────────────────────────┐
│ FREIGABE DURCH PASCAL                           │
├─────────────────────────────────────────────────┤
│                                                   │
│ [] Freigegeben — Mail-DNS-Plan wie beschrieben    │
│ [] Abgelehnt — Änderungen erforderlich:           │
│    ___________________________________            │
│                                                   │
│ Datum: _____________  Unterschrift: ___________ │
└─────────────────────────────────────────────────┘
```

---

*Ende des Mail DNS Security Fix Plans.*
*Nächstes Dokument: `ROLLBACK_PLAN_V1.md`*
