# FILE: /docs/gtm/CONVERSION_LOOP_V1.md
# NIR: 02.08.2026 07:40
# UPDATED: 02.08.2026 07:40
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Conversion-Loop von Lead bis Follow-up und Channel-KPIs
# WHY: Supply/Demand ohne Closing-Prozess erzeugt keine Pipeline
# BEST-PRACTICE: Bestehende Angebots- und Kundensuche-SOPs wiederverwenden
# PITFALL: V-GTM-06: Kein Auto-Versand vor Legal Gate
# DEPENDS: SOP Kundensuche, SOP Angebotsgenerator, CRM Backend
# DOCS-REF: docs/governance/02_sops/
# SESSION: gtm-kostenfrei-angebote-c6e3

# Conversion Loop V1

## Ablauf

```
Inbound (UTM/Chat/Form) oder Demand-Hit
        │
        ▼
Qualifizierung (Bedarf, Leistung, Budget-/Tagesrahmen, Entscheider)
        │
        ▼
CRM Lead (Pending bei Outbound; normal bei Inbound)
        │
        ▼
Legal/Policy Gate  ──(deny)──► dokumentieren, stoppen
        │ allow
        ▼
Outreach ODER Chat-Angebot (SOP KI-Berater + Resend)
        │
        ▼
Follow-up Timeline (CRM)
        │
        ▼
Won / Lost / On Hold
        │
        ▼
AgentMemory Learning + Channel-KPI Update
```

## Rollen

| Schritt | Wer | Artefakt |
|---------|-----|----------|
| Demand-Scan / Score | Agent | `scripts/gtm/demand_scan_prepare.py` Output |
| CRM Pending | Agent / Backend | Lead-Datensatz |
| Legal Gate | Owner / Policy | Freigabe-Flag |
| Angebot | KI-Berater + Resend-SOP | Offer PDF/Mail |
| Follow-up | Agent Entwurf, Owner Send | CRM Timeline |
| Learning | Agent | AgentMemory wenn erreichbar |

## Verbindliche SOPs

1. [SOP_KUNDENSUCHE_LEAD_TO_CRM_OUTREACH_GATE_V3.md](../governance/02_sops/SOP_KUNDENSUCHE_LEAD_TO_CRM_OUTREACH_GATE_V3.md)
2. [SOP_KI_BERATER_ANGEBOTSGENERATOR_RESEND_V3.md](../governance/02_sops/SOP_KI_BERATER_ANGEBOTSGENERATOR_RESEND_V3.md)

## Channel-KPI Review (wöchentlich)

Datei: `docs/gtm/evidence/channel-kpi-log.md` (bei erstem Review anlegen)

| Feld | Inhalt |
|------|--------|
| Woche | ISO-Woche |
| Live-Listings | Anzahl |
| Inbound Hits | UTM/GBP/LinkedIn |
| Demand Hits | Anzahl gescort |
| Pending | neu |
| Gate Allow/Deny | counts |
| Angebote gesendet | count |
| Won / Pipeline € | count / Summe |
| Top Source | channel_id |
| Aktion nächste Woche | Text |

## Brain-Learning Template

Wenn AgentMemory erreichbar (`:3111`):

```
memory_save(
  content="GTM: source=<id> leistung=<slug> score=<n> outcome=<won|lost|pending> note=<kurz>",
  type="workflow"
)
```

Wenn nicht erreichbar: Learning in KPI-Log-Zeile + Action blocked vermerken.

## Verbote

- Kein Massenmail
- Kein Outreach ohne dokumentierten Kontaktgrund
- Keine Preisabweichung von 449 €/Tag in Angeboten
- n8n nicht verwenden
