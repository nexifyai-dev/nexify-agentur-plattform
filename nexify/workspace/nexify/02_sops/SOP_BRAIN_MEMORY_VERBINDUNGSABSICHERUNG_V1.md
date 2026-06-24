# SOP — Brain/Memory-Verbindungsabsicherung V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Governance / NeXify AI

---

## 1. Zweck

Jede Agentenlösung muss nachweisbar auf Brain und agentmemory zugreifen oder zumindest Pending-Einträge erzeugen.

## 2. Pflichtprüfung

- [ ] Brain Health prüfbar?
- [ ] Brain Query funktioniert?
- [ ] Brain Store möglich (oder Pending)?
- [ ] agentmemory lesbar?
- [ ] agentmemory schreibbar?
- [ ] Sync zwischen Brain und agentmemory dokumentiert?

## 3. Keine teilweisen Verbindungen

Wenn ein Agent nicht direkt in Brain schreiben kann (Token fehlt), MUSS er:

- Pending-Eintrag in `brain/pending-store-queue/` erzeugen
- Grund dokumentieren (z.B. "Token fehlt")
- Im Evidence-Report vermerken

## 4. Brain/Memory-Done

Erst wenn nachweisbar gelesen UND geschrieben (oder Pending erzeugt) gilt die Verbindung als abgesichert.
