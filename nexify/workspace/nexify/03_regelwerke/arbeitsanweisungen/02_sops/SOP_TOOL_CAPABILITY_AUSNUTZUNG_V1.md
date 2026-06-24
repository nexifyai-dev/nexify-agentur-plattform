# SOP — Tool-Capability-Ausnutzung V1

## Zweck

NeXify nutzt vorhandene Lösungen vollständig, bevor neu gebaut wird. Jede Lösung wird als Capability-System betrachtet, nicht als einzelnes Tool.

## Pflichtanalyse je Tool

```text
tool_name:
official_docs:
version:
existing_usage:
capabilities:
missing_capabilities:
security_features:
automation_features:
integration_features:
observability_features:
cost_control_features:
fallback_features:
api_surface:
cli_surface:
mcp_surface:
webhook_surface:
ui_surface:
recommended_nexify_modules:
not_to_use:
reason:
```

## Bewertungslogik

Eine Capability wird aufgenommen, wenn sie mindestens eine Wirkung hat:

- reduziert manuelle Arbeit;
- senkt Kosten;
- erhöht Qualität;
- erhöht Ausfallsicherheit;
- verbessert Kundenwirkung;
- verbessert Automatisierung;
- verbessert Nachweisbarkeit;
- reduziert Vendor-Lock-in;
- verbessert Sicherheit;
- verkürzt Projektlaufzeiten.

## Ergebnis

Für jedes Tool entsteht ein Capability-Register und ein Workstation-Einbindungsplan.