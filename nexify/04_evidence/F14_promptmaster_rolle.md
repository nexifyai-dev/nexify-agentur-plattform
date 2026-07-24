# F14: Promptmaster — Rollen-Definition

**Status:** ✅ DEFINED  
**Datum:** 2026-06-22  
**Governance-Agent:** NeXify AI OS

---

## Fragestellung

> Ist der Promptmaster eine separate Rolle oder identisch mit Systemmaster?

## Antwort

**Der Promptmaster ist eine eigenständige, separate Rolle — nicht identisch mit dem Systemmaster.**

---

## Rollenvergleich

| Attribut | Systemmaster | Promptmaster |
|----------|-------------|--------------|
| **Fokus** | Gesamte technische Systemarchitektur | Prompt-Qualität, Versionierung, Deployment |
| **Scope** | Infrastruktur, Agenten, Routing, Security | Prompts, Templates, CLAUDE.md |
| **Typ** | Technische Gesamtverantwortung | Qualitäts- und Sprachgovernance |
| **Entscheidet über** | Architektur-Entscheidungen, Infrastruktur | Prompt-Inhalte, Sprache, Strategie |
| **Autorität** | Technisch höchste Instanz | Letzte Instanz bei Prompt-Fragen |

## Trennung der Begründung (Separation of Concerns)

1. **Qualitätssicherung:** Ein Systemmaster hat zu viele Verantwortlichkeiten, um sich fachlich auf Prompt-Exzellenz zu konzentrieren.
2. **Fachexpertise:** Promptmaster erfordert spezifisches Know-how in Prompt Engineering, Linguistik und LLM-Verhalten.
3. **Checks & Balances:** Systemmaster darf Prompts nicht eigenmächtig ändern — nur Promptmaster hat diese Autorität.
4. **Unabhängigkeit:** Promptmaster kann Systemmaster-Arbeit reviewen (bezüglich Prompt-Seiten), was eine gesunde gegenseitige Kontrolle schafft.

## Eskalationsbeziehung

```
NeXify CEO (strategische Entscheidungen)
    │
    ├── Systemmaster (technische Gesamtverantwortung)
    │       │
    │       └── 9Router-Admin (LLM-Router-Betrieb)
    │
    └── Promptmaster (Prompt-Qualität & Deployment)
            │
            └── Alle Agents (Vorschläge einreichen, NICHT selbst ändern)
```

## Abgrenzung

| Aktion | Systemmaster | Promptmaster |
|--------|-------------|--------------|
| Infrastruktur ändern | ✅ | ❌ |
| Prompts ändern | ❌ | ✅ |
| Security-Policies | ✅ | ❌ |
| CLAUDE.md-Review | ❌ | ✅ |
| Agent-Orchestrierung | ✅ | ❌ |
| Prompt-Tests | ❌ | ✅ |
| Budget-Freigabe | Empfiehlt | — |
| Letzte Entscheidung (Business) | — | NeXify CEO |

## Querverweise

- `promptmaster-governance-v1.json` — Vollständige Promptmaster-Governance
- `F12_9router-admin-rolle.md` — 9Router-Admin-Rolle
- `F13_eskalationsmatrix-9router.md` — Eskalationsmatrix

---

**Evidence-Typ:** Rollen-Definition (Klärung)  
**Governance-Level:** Strategic  
**Nächste Review:** 2026-09-22
