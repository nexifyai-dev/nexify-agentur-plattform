# F12/F13: Verantwortlichkeiten — 9Router Governance

**Status:** ✅ DEFINED
**Datum:** 2026-06-22
**Governance-Agent:** NeXify AI OS

---

## Zusammenfassung: Wer ist verantwortlich?

### F12: Wer ist der definierte 9Router-Admin?

**Antwort:** Der **9Router-Admin** ist eine dedizierte technische Operations-Rolle, die dem **Systemmaster** berichtet.

```
Organisationsstruktur:

    NeXify CEO
         │
    Systemmaster
         │
    9Router-Admin ← Verantwortlich für 9Router-Betrieb
```

### F13: Eskalationsweg bei 9Router-Ausfall

**Antwort:** Der Eskalationsweg folgt einer klaren Kette:

```
9Router-Admin → Systemmaster → NeXify CEO
```

| Wer | Wann | Was |
|-----|------|-----|
| **9Router-Admin** | Sofort (0-15 Min) | Erste Diagnose & Quick-Fix |
| **Systemmaster** | Bei Nichtbehebung (15-30 Min) | Root-Cause-Analyse |
| **NeXify CEO** | Bei kritischem Impact (30-60 Min) | Business-Entscheidungen |

---

## Verantwortlichkeitsmatrix (RACI)

| Aufgabe | 9Router-Admin | Systemmaster | NeXify CEO |
|---------|:-------------:|:------------:|:----------:|
| **Monitoring** | R | A | I |
| **First Response** | R | A | I |
| **Troubleshooting** | R | C | I |
| **Root-Cause-Analyse** | C | R | I |
| **Business-Entscheidung** | I | C | R |
| **Kunden-Kommunikation** | I | C | R |
| **Backup-Provider-Switch** | R | A | I |
| **Post-Mortem** | R | A | I |
| **Prevention Measures** | C | R | A |

**Legende:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## Checkliste: 9Router Governance

- [x] **Rolle definiert:** 9Router-Admin
- [x] **Eskalationsweg dokumentiert:** Admin → Systemmaster → CEO
- [x] **Verantwortlichkeiten klar:** RACI-Matrix
- [x] **Fallback-Logik definiert:** Bei Nichterreichbarkeit
- [x] **SLA-Anforderungen:** RTO < 1h, Reaktion < 15 Min
- [x] **Dokumentationspflicht:** Incident Report, Post-Mortem

---

## Referenzen

- **F12 Detail:** [F12_9router-admin-rolle.md](./F12_9router-admin-rolle.md)
- **F13 Detail:** [F13_eskalationsmatrix-9router.md](./F13_eskalationsmatrix-9router.md)

---

**Evidence-Typ:** Governance-Zusammenfassung
**Governance-Level:** Strategic + Operational
**Nächste Review:** 2026-09-22
