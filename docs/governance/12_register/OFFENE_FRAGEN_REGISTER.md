---
ralph_loop_file: true
file_type: offene_fragen
title: NeXify AI OS — Offene Fragen Register
version: 1.0.0
date: 2026-06-22
status: AKTIV
priority: P1
owner: NeXify CEO (nexify-ceo)
---

# OFFENE FRAGEN REGISTER V1 — Bisher Ungeklärtes

> **Leitsatz:** Jede offene Frage ist ein Risiko. Wer sie nicht stellt, verschleppt sie.
> Dieses Register ist die Single Source of Truth für alles Ungeklärte.

---

## 1. Bolt-Integration (Offene Fragen)

| # | Frage | Kritikalität | Status | Owner | Deadline | Aktion |
|---|-------|-------------|--------|-------|----------|--------|
| F01 | Ist RTK aktuell in 9Router aktiviert oder nur evaluiert? | 🔴 HIGH | OFFEN | 9Router-Admin | 2026-06-25 | 9Router-Config prüfen |
| F02 | Ist Headroom (/v1/compress) Endpoint deployed oder nur geplant? | 🔴 HIGH | OFFEN | 9Router-Admin | 2026-06-25 | Endpoint-Test |
| F03 | Caveman "moderate" — exakte Konfigurationswerte? | 🟡 MEDIUM | ✅ KLÄRT | 9Router-Admin | 2026-06-29 | "moderate" existiert NICHT → `lite` als Ersatz |
| F04 | Ponytail-Metriken — wie wird "mehr gelöscht als hinzugefügt" gemessen? | 🟡 MEDIUM | ✅ KLÄRT | Systemmaster | 2026-06-29 | PDR = deleted/added, Ziel ≥ 1.0 |
| F05 | RTK-Whitelist: Welche Dateien/Tools sind von Kompression ausgenommen? | 🟡 MEDIUM | OFFEN | 9Router-Admin | 2026-06-29 | Whitelist erstellen |
| F06 | Headroom-Kompressionsverlust: Gibt es Benchmarks? | 🟢 LOW | ✅ KLÄRT | 9Router-Admin | 2026-07-06 | Template vorhanden, keine aktiven Benchmarks → Benchmarks durchführen |

---

## 2. Architektur (Offene Fragen)

| # | Frage | Kritikalität | Status | Owner | Deadline | Aktion |
|---|-------|-------------|--------|-------|----------|--------|
| F07 | Paperclip/KI-Fabrik — aktueller Implementierungsstand? | 🔴 HIGH | OFFEN | Systemmaster | 2026-06-25 | Status-Review |
| F08 | Redis Queue — deployed oder nur geplant? | 🟡 MEDIUM | OFFEN | Systemmaster | 2026-06-29 | Deployment-Check |
| F09 | RAGFlow — wird es tatsächlich genutzt oder nur skizziert? | 🟡 MEDIUM | OFFEN | Systemmaster | 2026-06-29 | Nutzungs-Check |
| F10 | Adapter v1.0 — welche Schnittstellen sind implementiert? | 🟡 MEDIUM | OFFEN | Systemmaster | 2026-06-29 | API-Inventory |
| F11 | Multi-Agent-Orchestrierung — wie werden Agentenketten koordiniert? | 🔴 HIGH | OFFEN | Systemmaster | 2026-06-25 | Architektur-Doku |

---

## 3. Governance (Offene Fragen)

| # | Frage | Kritikalität | Status | Owner | Deadline | Aktion |
|---|-------|-------------|--------|-------|----------|--------|
| F12 | Wer ist der definierte 9Router-Admin (Rolle, nicht Person)? | 🔴 HIGH | OFFEN | NeXify CEO | 2026-06-25 | Rolle definieren |
| F13 | Eskalationsweg bei 9Router-Ausfall — wer wird informiert? | 🔴 HIGH | OFFEN | NeXify CEO | 2026-06-25 | Eskalationsmatrix |
| F14 | Promptmaster — ist das eine separate Rolle oder identisch mit Systemmaster? | 🟡 MEDIUM | OFFEN | NeXify CEO | 2026-06-29 | Rollenklärung |
| F15 | Meta-Audit — wer auditiert den Auditor? | 🟡 MEDIUM | OFFEN | NeXify CEO | 2026-06-29 | Prozess definieren |
| F16 | Budget-Freigabe bei Kostenüberschreitung — wer entscheidet? | 🟡 MEDIUM | OFFEN | NeXify CEO | 2026-06-29 | Policy erstellen |
| F32 | Charta §8 „volle Autonomie… wartet auf niemanden“ vs. `GOVERNANCE.md` §2.2 „Kein interaktiver Eingriff in Produktionsprozesse ohne Freigabe“ (+ Verbot V08)? | 🔴 HIGH | OFFEN | NeXify CEO + CTO | 2026-07-28 | **Eskalation — Agent darf nicht selbst auflösen.** Kontext: `CHARTA.md` §16 |

---

## 4. Sicherheit (Offene Fragen)

| # | Frage | Kritikalität | Status | Owner | Deadline | Aktion |
|---|-------|-------------|--------|-------|----------|--------|
| F17 | Secret-Rotation — automatisiert oder manuell? | 🔴 HIGH | OFFEN | Systemmaster | 2026-06-25 | Prozess definieren |
| F18 | CVE-Scanner — welcher ist konfiguriert? | 🔴 HIGH | OFFEN | Systemmaster | 2026-06-25 | Tool-Auswahl |
| F19 | Penetrationstest — durchgeführt oder nur geplant? | 🟡 MEDIUM | ✅ KLÄRT | NeXify CEO | 2026-07-06 | Weder durchgeführt noch geplant → Phase 3: Externer Pen-Test |
| F20 | Incident-Response — letzter Drill? | 🟡 MEDIUM | OFFEN | Systemmaster | 2026-06-29 | Drill planen |

---

## 5. Monitoring (Offene Fragen)

| # | Frage | Kritikalität | Status | Owner | Deadline | Aktion |
|---|-------|-------------|--------|-------|----------|--------|
| F21 | Prometheus/Grafana — deployed oder nur in docker-compose skizziert? | 🔴 HIGH | OFFEN | Systemmaster | 2026-06-25 | Deployment-Check |
| F22 | Alertmanager — PagerDuty/Slack-Integration konfiguriert? | 🟡 MEDIUM | OFFEN | Systemmaster | 2026-06-29 | Integration prüfen |
| F23 | Bolt-Metriken — in Monitoring-Dashboard integriert? | 🟡 MEDIUM | OFFEN | 9Router-Admin | 2026-06-29 | Dashboard erstellen |
| F24 | Log-Retention — wie lange werden Logs aufbewahrt? | 🟡 MEDIUM | OFFEN | Systemmaster | 2026-06-29 | Policy definieren |

---

## 6. Kundenprojekte (Offene Fragen)

| # | Frage | Kritikalität | Status | Owner | Deadline | Aktion |
|---|-------|-------------|--------|-------|----------|--------|
| F25 | Studienkolleg — aktueller Status? | 🟡 MEDIUM | ✅ KLÄRT | NeXify CEO | 2026-06-29 | Technisch ~85% reif, Go-Live-Blocker (Recht, Betrieb, Technik) |
| F26 | Bookando — aktueller Status? | 🟡 MEDIUM | ✅ KLÄRT | NeXify CEO | 2026-06-29 | In Entwicklung, MVP-Phase, solide Architektur |
| F27 | Customer-Boundary-Enforcement — wie wird es technisch durchgesetzt? | 🟡 MEDIUM | ✅ KLÄRT | Systemmaster | 2026-07-06 | Policy vorhanden, technische Enforcement fehlt → CI/CD-Gates einführen |

---

## 7. Prozesse (Offene Fragen)

| # | Frage | Kritikalität | Status | Owner | Deadline | Aktion |
|---|-------|-------------|--------|-------|----------|--------|
| F28 | DONE-Definition — gibt es eine automatisierte Prüfung? | 🟡 MEDIUM | ✅ KLÄRT | Systemmaster | 2026-06-29 | Umfassend (5 Kategorien), automatisiert als Cron, nicht als CI/CD-Gate |
| F29 | Brain-Sync-Frequenz — wie oft wird synchronisiert? | 🟡 MEDIUM | ✅ KLÄRT | Systemmaster | 2026-06-29 | Alle 30 Min konfiguriert, letzter Sync veraltet (2026-05-08) |
| F30 | Agent-Memory-Retention — wie lange bleiben Einträge? | 🟢 LOW | ✅ KLÄRT | Systemmaster | 2026-07-06 | Keine Retention-Policy → Policy definieren + automatisieren |
| F31 | Skill-Versionierung — semantisch oder inkrementell? | 🟢 LOW | ✅ KLÄRT | Systemmaster | 2026-07-06 | Kein Schema → SemVer einführen |

---

## 8. Priorisierung

### 8.1 SOFORT (bis 2026-06-25 / Autonomie-Blocker)

```
F01 — RTK-Status klären
F02 — Headroom-Endpoint klären
F07 — Paperclip-Status klären
F11 — Multi-Agent-Orchestrierung
F12 — 9Router-Admin-Rolle
F13 — Eskalationsweg 9Router
F17 — Secret-Rotation
F18 — CVE-Scanner
F21 — Monitoring-Deployment
F32 — Charta §8 Autonomie vs. GOVERNANCE Produktions-Freigabe (CEO/CTO) — nicht selbst auflösen
```

### 8.2 BIS 2026-06-29

```
F05 — RTK-Whitelist
F08 — Redis Queue
F09 — RAGFlow
F10 — Adapter
F14 — Promptmaster-Rolle
F15 — Meta-Audit
F16 — Budget-Freigabe
F20 — Incident-Drill
F22 — Alertmanager
F23 — Bolt-Metriken
F24 — Log-Retention
~~F25 — Studienkolleg~~ ✅
~~F26 — Bookando~~ ✅
~~F28 — DONE-Automatisierung~~ ✅
~~F29 — Brain-Sync-Frequenz~~ ✅
```

### 8.3 BIS 2026-07-06

```
~~F19 — Penetrationstest~~ ✅
~~F27 — Customer-Boundary-Enforcement~~ ✅
~~F30 — Memory-Retention~~ ✅
~~F31 — Skill-Versionierung~~ ✅
```

---

## 9. Workflow für neue offene Fragen

```
1. Frage identifiziert
2. In OFFENE_FRAGEN_REGISTER.md eintragen
   - Einzigartige ID (F01-FXX)
   - Kritikalität (HIGH/MEDIUM/LOW)
   - Owner benennen
   - Deadline setzen
   - Aktion definieren
3. Eskalation bei HIGH-Kritikalität → NeXify CEO
4. Bei Klärung: Status auf ✅ KLÄRT setzen, Lösung dokumentieren
5. Bei Verzug: Re-Eskalation nach Deadline
```

---

## 10. Register-Statistik

| Metriken | Wert |
|----------|------|
| Offene Fragen gesamt | 20 |
| Kritikalität HIGH | 11 |
| Kritikalität MEDIUM | 10 |
| Kritikalität LOW | 0 |
| Deadline 2026-06-25 | 9 |
| Deadline 2026-06-29 | 10 |
| Deadline 2026-07-06 | 0 |
| Deadline 2026-07-28 (F32) | 1 |
| ✅ Geklärt (F03, F04, F06, F19, F25, F26, F27, F28, F29, F30, F31) | 12 |

---

## 11. Owner & Accountability

| Bereich | Owner | Eskalation |
|---------|-------|------------|
| Bolt-Fragen (F01-F06) | 9Router-Admin | NeXify CEO |
| Architektur-Fragen (F07-F11) | Systemmaster | NeXify CEO |
| Governance-Fragen (F12-F16) | NeXify CEO | — |
| Normkonflikt Autonomie (F32) | NeXify CEO + CTO | — (Agent entscheidet nicht) |
| Security-Fragen (F17-F20) | Systemmaster | NeXify CEO |
| Monitoring-Fragen (F21-F24) | Systemmaster | NeXify CEO |
| Kunden-Fragen (F25-F27) | NeXify CEO | — |
| Prozess-Fragen (F28-F31) | Systemmaster | NeXify CEO |
| Gesamtverantwortung | NeXify CEO | — |

---

*Generiert: 2026-06-22 | Aktualisiert: 2026-07-25 (F32 eskaliert) | Nächster Review: CEO/CTO zu F32 + offene HIGH-Fragen*
