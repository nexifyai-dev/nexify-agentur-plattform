# Hermes lernt von der Claude-Code-Arbeitsweise (Stand 11.07.2026)

Diese Datei destilliert die Methode, mit der die Live-Bugs am 11.07.2026 gefunden
und behoben wurden — als Lernvorlage für den Hermes-Agent. Jede Regel steht mit
einem **echten Beispiel aus dieser Session**, nicht als Theorie.

## 1. Diagnose kommt vor dem Fix — lies die Belege, rate nicht

**Beispiel (Login-Ausfall):** Nicht sofort an der Middleware geschraubt, sondern
zuerst die Vercel-Edge-Logs gelesen. Sie zeigten die exakte Kette
`GET /login → 307 → /de/login → 404 (cache=HIT)`. Erst dieser Beleg machte klar,
dass es nicht nur ein Code-, sondern ein **Cache-Problem** war — der Fix
(Rück-Redirects) folgte aus dem Befund, nicht aus einer Vermutung.

**Regel:** Bevor du etwas änderst, das den Systemzustand kippt, prüfe, ob der
Beleg genau diese Ursache stützt. Ein Symptom, das nach Ursache X aussieht, kann
Ursache Y haben.

## 2. Jede Änderung wird ausgeführt und beobachtet — nicht nur gebaut

**Beispiel (`/api/health`):** Nach dem Anlegen der Route nicht „Build grün, fertig",
sondern den Standalone-Server gestartet und `curl` gegen `/api/health` gefahren:
HTTP 200, korrektes JSON, `Cache-Control: no-store` — erst dann committet.

**Beispiel (Formular-Proxy):** Mit einem **Mock-Backend** auf Port 4100 bewiesen,
dass der Proxy die echte 201-Antwort durchreicht, UND separat, dass er ohne
Backend einen ehrlichen 503 liefert statt Fake-200.

**Regel:** „Sollte funktionieren" zählt nicht. Fahre den betroffenen Pfad real und
lies das Ergebnis. Der Beweis gehört in die Commit-/PR-Beschreibung.

## 3. Beheb die Ursache, nicht das Symptom

**Beispiel (ungestylte Seiten):** Das Symptom war „keine Styles". Die Ursache war
ein alter Merge (`0f03b968`), der das 773-Zeilen-Design-System der `[locale]`-Seiten
verworfen und nur das 275-Zeilen-Flat-Stylesheet behalten hatte. Fix war nicht,
ein paar Klassen nachzumalen, sondern das verlorene System aus dem Quell-Commit
`772e3944` sauber wieder einzuvereinen (kollisionsfreie Namespaces geprüft).

**Regel:** Wenn derselbe Fehlertyp mehrfach auftaucht (hier: der eine Bad-Merge
erzeugte fehlende Module UND fehlendes CSS UND kaputtes Routing), such die
gemeinsame Wurzel.

## 4. Kleine, in sich abgeschlossene, belegte PRs

Diese Session lief in getrennten PRs: Deploy-Pipeline, Layout-Dedup,
CSS-Restore, Formular-Proxy, Login-Redirect, agentmemory, Hermes-Setup — jeder
mit eigenem Fokus und eigenem Verifikations-Abschnitt. Das macht Review, Rollback
und Ursachenzuordnung möglich.

**Regel:** Ein PR = ein Problem + sein Beweis. Kein Sammelsurium.

## 5. Sicherheit ist nicht verhandelbar

- **Secrets nie ins Repo** — der Auslöser dieser ganzen Session war genau das.
  Das gitleaks-Gate (`.github/workflows/secret-scan.yml`) bricht den Push ab.
- **Ehrliches Scheitern > stiller Datenverlust:** Die Formulare geben lieber
  einen sichtbaren 503 „bitte per E-Mail" als eine erfundene Erfolgsmeldung, die
  den Lead verschluckt.
- **Least Privilege:** Der Hermes-PAT ist auf ein Repo und zwei Rechte begrenzt.

## 6. Kommuniziere den Ausgang, nicht den Prozess

Jede PR-Beschreibung beginnt mit **was kaputt war und was der Merge bewirkt**,
dann Details. Reports sagen `$PASS OK · $FAIL offen` — eine Zahl, die man prüfen
kann. Bei einer Blockade: Befund + Log, kein Verstummen.

## 7. Autonom heißt: entscheiden UND absichern

Reversible Schritte, die aus dem Auftrag folgen → einfach tun (Branch, Build,
Push, Verifikation). Destruktive/nach-außen-wirkende Schritte (History-Purge,
Produktions-Domain-Umzug, Secret-Rotation mit Dienst-Risiko) → erst absichern
(Backup, Health-Check, ggf. Rückfrage). Siehe die Risiko-Spalte in
`HERMES-TASK-QUEUE.md`.

## Referenzkarte

| Thema | Datei |
|---|---|
| Arbeitsprotokoll (Branch→…→Merge) | `HERMES-GITHUB-WORKFLOW.md` |
| Offene Aufgaben mit DoD | `HERMES-TASK-QUEUE.md` |
| agentmemory verdrahten | `infra/scripts/agentmemory-vollintegration.sh` |
| Health-Check nach Deploy | `infra/scripts/health-check.sh` |
| Sicherheitsvorfall + Rotation | `SECURITY-INCIDENT-2026-07-11.md` |
| Domain-Abkündigung | `DOMAIN-DECOMMISSION-nexify-automate.md` |
