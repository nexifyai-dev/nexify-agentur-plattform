# EVIDENCE: PROMPT CHANGE CONTROL

**Status:** 🟢 DONE / 🟡 PARTIAL / 🔴 FAILED
**Datum:** {YYYY-MM-DD}
**Uhrzeit:** {HH:MM}
**Autor:** Promptmaster
**Change-Control-ID:** CC-{YYYYMMDD}-{NR}
**Betroffener Prompt:** {Prompt-Name/-Pfad}
**Prompt-Version (alt):** {X.Y.Z}
**Prompt-Version (neu):** {X.Y.Z}
**Vorschlag von:** {Agent-ID des Vorschlagenden}
**Urgency:** {P1/P2/P3/P4}
**Audit-ID:** {AUD-YYYYMMDD-NR}

---

## 1. Change-Vorschlag

**Titel:**
{Kurzer, aussagekräftiger Titel der Änderung}

**Typ:**
- [ ] BUGFIX — Fehlerbehebung
- [ ] IMPROVEMENT — Verbesserung
- [ ] CLARIFICATION — Klarstellung
- [ ] SECURITY — Sicherheitsrelevante Änderung

**Problembeschreibung:**
{Ausführliche Beschreibung des Problems, das diese Änderung adressiert}

**Erwartete Verbesserung:**
{Konkretes, messbares Ergebnis der Änderung}

---

## 2. IST/SOLL-Vergleich

### Alter Prompt (IST)
```markdown
{Alter Prompt-Text — oder Verweis auf Datei + Version}
```

### Neuer Prompt (SOLL)
```markdown
{Neuer Prompt-Text — oder Verweis auf Datei + Version}
```

### Änderungs-Diff
```diff
- {Gelöschte/geänderte Zeilen (ALT)}
+ {Hinzugefügte/geänderte Zeilen (NEU)}
```

---

## 3. Review-Ergebnis (Promptmaster)

| Kriterium | Ergebnis | Kommentar |
|-----------|----------|-----------|
| Korrektheit | 🟢 / 🟡 / 🔴 | {Kommentar} |
| Klarheit | 🟢 / 🟡 / 🔴 | {Kommentar} |
| Konsistenz | 🟢 / 🟡 / 🔴 | {Kommentar} |
| Vollständigkeit | 🟢 / 🟡 / 🔴 | {Kommentar} |
| Sicherheit | 🟢 / 🟡 / 🔴 | {Kommentar} |
| Rückwärtskompatibilität | 🟢 / 🟡 / 🔴 | {Kommentar} |
| Evidence | 🟢 / 🟡 / 🔴 | {Kommentar} |
| **Gesamt** | ✅ APPROVED / ⚠️ APPROVED WITH CHANGES / 🔄 REVISE / ❌ REJECTED | |

**Review-Datum:** {YYYY-MM-DD}
**Review-Dauer:** {Minuten}

**Review-Notizen:**
{Detail-Notizen aus dem Review-Prozess}

---

## 4. Test-Ergebnis (Promptmaster)

### 4.1 Isolationstest

| Testfall | Erwartet | Tatsächlich | Status |
|----------|----------|-------------|--------|
| {Testfall 1} | {Erwartetes Ergebnis} | {Tatsächliches Ergebnis} | 🟢 / 🟡 / 🔴 |
| {Testfall 2} | {Erwartetes Ergebnis} | {Tatsächliches Ergebnis} | 🟢 / 🟡 / 🔴 |
| {Testfall 3} | {Erwartetes Ergebnis} | {Tatsächliches Ergebnis} | 🟢 / 🟡 / 🔴 |

### 4.2 Regressionstest

| Workflow | Ergebnis | Abweichung |
|----------|----------|-----------|
| {Workflow 1} | 🟢 / 🟡 / 🔴 | {Abweichung} |
| {Workflow 2} | 🟢 / 🟡 / 🔴 | {Abweichung} |

### 4.3 Sicherheitstest

| Test | Ergebnis | Bemerkung |
|------|----------|-----------|
| Injection-Resistenz | 🟢 / 🟡 / 🔴 | |
| Jailbreak-Resistenz | 🟢 / 🟡 / 🔴 | |
| Data Leakage | 🟢 / 🟡 / 🔴 | |

### 4.4 Performance-Test

| Metrik | Vorher | Nachher | Abweichung |
|--------|--------|---------|-----------|
| Latenz (ms) | {Wert} | {Wert} | {Differenz} |
| Token-Verbrauch | {Wert} | {Wert} | {Differenz} |
| Cost per Call | {Wert} | {Wert} | {Differenz} |

### 4.5 Test-Gesamt

**Test-Ergebnis:** 🟢 PASS / 🟡 PARTIAL / 🔴 FAIL

---

## 5. Deployment

### 5.1 Pre-Deploy-Checkliste

- [ ] Backup des alten Prompts erstellt: {Backup-Pfad}
- [ ] Neuer Prompt versioniert: v{X.Y.Z}
- [ ] Change-Control-ID vergeben: CC-{YYYYMMDD-NR}
- [ ] Betroffene Agenten identifiziert: {Liste}
- [ ] Rollback-Plan vorhanden
- [ ] Evidence-Datei vorbereitet (diese Datei)

### 5.2 Deployment-Log

| Schritt | Zeit | Status |
|---------|------|--------|
| Backup erstellt | {HH:MM} | 🟢 |
| Neuer Prompt deployed | {HH:MM} | 🟢 |
| Smoke-Test | {HH:MM} | 🟢 |
| Benachrichtigung versendet | {HH:MM} | 🟢 |
| 24h-Monitoring gestartet | {HH:MM} | 🟢 |

### 5.3 Post-Deploy-Check (24h später)

| Metrik | Wert | Auffällig |
|--------|------|-----------|
| Latenz | {Durchschnitt} | Ja/Nein |
| Error-Rate | {Prozent} | Ja/Nein |
| User-Report | {Anzahl} | Ja/Nein |
| Rollback erforderlich? | Ja/Nein | Falls ja: Grund |

---

## 6. Rollback (Nur ausfüllen bei Bedarf)

**Rollback durchgeführt:** Ja / Nein
**Zeitpunkt:** {YYYY-MM-DD HH:MM}
**Grund:**
{Warum wurde zurückgesetzt?}

**Rollback-Schritte:**
1. {Schritt 1}
2. {Schritt 2}

**Rollback-Ergebnis:** 🟢 Erfolgreich / 🟡 Teilweise / 🔴 Fehlgeschlagen

---

## 7. Abschluss

**Gesamt-Status:** ✅ ERFOLGREICH DEPLOYT / ⚠️ DEPLOYT MIT EINSCHRÄNKUNGEN / 🔴 ROLLBACK / ❌ ABGELEHNT

**Nächste Schritte:**
- [ ] {Folgeaktion 1} (verantwortlich: {Agent}, bis: {Datum})
- [ ] {Folgeaktion 2} (verantwortlich: {Agent}, bis: {Datum})

**Learnings:**
{Was wurde aus diesem Change-Prozess gelernt?}

---

## 8. Anhänge

- Original-Vorschlag: {Link/Referenz}
- Test-Logs: {Link/Referenz}
- Backup-Datei: {Link/Referenz}
- Audit-Referenz: {AUD-ID}

---

*Evidence erstellt am {YYYY-MM-DD} um {HH:MM} — Promptmaster*
*Diese Evidence unterliegt der Audit-Pflicht gemäß AUDIT_MASTER_V1 und PROMPTMASTER_GOVERNANCE_V1.*
