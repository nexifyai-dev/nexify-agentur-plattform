# SOP — Auftrag vorbereiten, ausführen, prüfen und in Endkontrolle geben V4

## 1. Ziel

Jeder Auftrag wird so behandelt, dass aus menschlicher Sicht der vollständige Zielzustand erreicht wird, nicht nur ein Artefakt entsteht.

## 2. Vorbereitung

Pflichtfelder vor Start:

```text
auftrag_id:
datum_berlin:
ersteller:
projekt:
kunde:
bereich:
ziel:
gewünschter_zielzustand:
nicht_ziel:
priorität:
frist:
betroffene_repos:
betroffene_live_systeme:
betroffene_docs:
betroffene_kundendaten:
rechtliche_relevanz:
security_relevanz:
wirtschaftliche_relevanz:
policy_level:
```

## 3. Kontextladepflicht

Vor Umsetzung laden:

- Agenten-Seele;
- Pascal-Profil;
- Projektprofil;
- gültige Regelwerke;
- Brain-Kontext;
- agentmemory;
- Repo und Live-Stand;
- relevante offizielle Docs;
- vorhandene Configs;
- vorhandene Tests;
- Kanban und Evidence.

Nicht ladbare Quellen werden mit Grund, Risiko, Ersatzquelle und Folgeauftrag dokumentiert.

## 4. Planung

1. Ziel in Einzelaufgaben zerlegen.
2. Reihenfolge bestimmen.
3. Abhängigkeiten erkennen.
4. vorhandene Lösungen bevorzugen.
5. passende Skills/MCPs/Tools wählen.
6. Tests und Akzeptanzkriterien definieren.
7. Gate-pflichtige Aktionen separieren.

## 5. Ausführung

Sichere interne Arbeiten werden ohne Rückfrage erledigt. Gate-pflichtige Arbeiten werden nicht blockierend gefragt, sondern als Approval-Paket vorbereitet.

## 6. Prüfung

Pflichtprüfungen:

- fachlich;
- technisch;
- Security;
- Datenschutz;
- Wirtschaftlichkeit;
- UX/CI, sofern sichtbar;
- Performance;
- Tests/Build/Lint;
- Live-/Deployment-Stand, sofern betroffen;
- Evidence.

## 7. Endkontrolle

Ein Auftrag geht erst in Endkontrolle, wenn:

```text
ziel_erfüllt = ja
alle_akzeptanzkriterien_erfüllt = ja
tests_bestanden_oder_ersatzprüfung = ja
evidence_vollständig = ja
brain_agentmemory_sync = ja_oder_pending
kanban_aktualisiert = ja
register_aktualisiert = ja
folgeaufträge = erzeugt_oder_nicht_erforderlich
risiken = dokumentiert
```

## 8. Abschlussstatus

Erlaubt:

- `DONE_TRUE`
- `PARTIAL_DONE`
- `WAITING_FOR_APPROVAL`
- `BLOCKED_ACCESS`
- `BLOCKED_SECURITY`
- `BLOCKED_DOCS`
- `REVIEW_REQUIRED`

Verboten: `DONE`, wenn nur Datei, Plan, Entwurf, lokale Prüfung oder ungetestete Config existiert.