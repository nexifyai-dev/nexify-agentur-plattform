# SOP — Offizielle Dokumentation, Recherche und Konfiguration V1

## Zweck

Diese SOP erzwingt, dass jede Konfiguration und Integration auf aktuellen offiziellen Quellen basiert und alle Möglichkeiten der Lösung erkannt, bewertet und nutzbringend eingebunden werden.

## Eingang

- Auftrag oder ToDo;
- betroffenes Tool/API/MCP/Framework;
- Projektkontext;
- Brain-/agentmemory-Kontext;
- vorhandene Configs und Deployments;
- bekannte Blocker.

## Ablauf

### Phase 1 — Kontext laden

1. Auftrag und Zielzustand erfassen.
2. Agenten-Seele, Benutzerprofil, Regelwerke, Projektdaten, Repo, Live-Stand, Evidence und Kanban laden.
3. Prüfen, ob Tool schon im Register existiert.
4. Vorhandene Configs, ENV-Namen, Secret-Refs, Logs und Tests lesen.

### Phase 2 — Offizielle Quellen laden

1. Quelle aus `OFFICIAL_DOCS_SOURCE_REGISTER_V1` wählen.
2. README, docs, API-Referenz, Beispiele, CLI-Hilfe, Releases und Security-Hinweise prüfen.
3. Version, Stand, relevante Breaking Changes und Migrationshinweise dokumentieren.
4. Bei nicht erreichbarer Quelle: `DOCS_UNAVAILABLE` setzen, Ersatzquelle nennen und Folgeauftrag erzeugen.

### Phase 3 — Capability-Extraktion

Für jede Lösung eine Capability-Matrix erstellen:

```text
capability_id:
name:
official_doc_ref:
function:
current_nexify_usage:
missing_usage:
business_value:
technical_value:
cost_effect:
security_effect:
automation_effect:
customer_effect:
implementation_effort:
risk:
policy_gate:
recommended_action:
```

### Phase 4 — Zielkonfiguration

1. Zielkonfiguration mit ENV-Namen und Secret-Refs definieren.
2. Keine Secret-Werte dokumentieren.
3. Healthchecks und Tests definieren.
4. Rollback definieren.
5. Gate-Punkte markieren.

### Phase 5 — Umsetzung

1. Nur sichere interne Schritte direkt umsetzen.
2. Gate-pflichtige Schritte als Approval-Paket vorbereiten.
3. Keine produktiven Writes ohne Freigabe.
4. Tests ausführen oder Ersatzprüfung begründen.

### Phase 6 — Endkontrolle

1. Prüfen: Ziel erreicht?
2. Prüfen: Tests/Evidence vollständig?
3. Prüfen: Register aktualisiert?
4. Prüfen: Brain/agentmemory aktualisiert oder Pending erzeugt?
5. Prüfen: Folgetasks erzeugt?
6. Erst dann Status `DONE_TRUE`.

## Abbruchkriterien

Abbruch nur bei:

- fehlender Freigabe für produktive Änderung;
- nicht ersetzbarer fehlender Quelle;
- Secret-/Sicherheitsrisiko;
- möglichem Datenverlust;
- unklarem Kunden-/Rechtsbezug.

Bei Abbruch: Status `WAITING_FOR_APPROVAL`, `BLOCKED_ACCESS`, `BLOCKED_DOCS` oder `BLOCKED_SECURITY`, niemals Fake-Done.