# SOP — Auftrag vorbereiten, ausführen, prüfen, endkontrollieren

## Zweck
Jeder Auftrag wird so vorbereitet, dass ein Agent ihn ohne menschliche Nachinterpretation sauber ausführen kann.

## Pflichtfelder
Auftrags-ID, Datum/Zeit Europe/Berlin, Quelle, Projekt, Kunde, Bereich, Ziel, Warum wichtig, Nicht-Ziel, IST, SOLL, Gap, betroffene Dateien/Repos/Systeme, Brain-Kontext, agentmemory-Kontext, Regeln, Skills, MCPs, Tools/CLIs, Daten, Risiken, Gate-Pflicht, Rollback, Akzeptanzkriterien, Tests, Evidence, Abbruchkriterien, Review-Instanz, QR-Instanz.

## Ablauf
Kontext laden → Bestand prüfen → vorhandene Lösung bevorzugen → Plan gegen Policy prüfen → kleine Schritte ausführen → Evidence schreiben → Tests ausführen → Fehler korrigieren → Gate-pflichtige Punkte vorbereiten → Endkontrolle.

## Endstatus
`DONE_TRUE`, `PARTIAL_DONE`, `WAITING_FOR_APPROVAL`, `BLOCKED_ACCESS`, `CORRECTION_REQUIRED`.
