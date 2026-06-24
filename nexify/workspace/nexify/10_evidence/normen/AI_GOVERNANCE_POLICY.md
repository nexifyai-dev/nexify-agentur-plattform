# AI_GOVERNANCE_POLICY — KI-Governance-Richtlinie

| Feld | Wert |
|------|------|
| **Dokumenttyp** | Policy (ISO 42001:2023, EU AI Act) |
| **Version** | 1.0 |
| **Stand** | 23.06.2026 |
| **Nächste Prüfung** | 23.06.2027 |
| **Verantwortlich** | AI-Governance-Beauftragter (Pascal) |
| **Geltungsbereich** | Alle KI-Systeme der NeXify AI |

---

## 1. Geltungsbereich

Diese Richtlinie gilt für alle KI-Systeme, die NeXify AI entwickelt, betreibt oder einsetzt:

- **Autonome Agenten**: Hermes Agent, Recherche-Agent, Content-Agent
- **Modell-Router**: 9Router (DeepSeek V4 Flash, DeepSeek Reasoner, Drittanbieter)
- **Wissenssysteme**: Brain (Vektor-DB), Qdrant, RAGFlow
- **KI-gestützte Services**: Agenten auf work.nexifyai.cloud, Kundenprojekte
- **Entscheidungslogiken**: CI/CD-gesteuerte KI-Entscheidungen

Referenz: ISO/IEC 42001:2023 (AIMS), ISO/IEC 23894:2023 (KI-Risikomanagement), EU AI Act 2024.

---

## 2. AI-Systeminventar (AI-01)

Jedes KI-System wird im Systeminventar erfasst (CONTROL_CATALOG AI-01):

| System | Typ | Modell/Engine | Risikoklasse | Status |
|--------|-----|--------------|-------------|--------|
| Hermes Agent | Autonomer Agent | DeepSeek V4 Flash / Reasoner | Mittel | Aktiv |
| Recherche-Agent | Spezialagent | DeepSeek V4 Flash | Niedrig | Aktiv |
| Content-Agent | Spezialagent | DeepSeek V4 Flash | Niedrig | Aktiv |
| 9Router | Modell-Router | Multi-Model-Routing | Mittel | Aktiv |
| Brain | Vektor-Wissen | Qdrant + Embedding | Mittel | Aktiv |
| RAGFlow | Dokumenten-RAG | RAGFlow + LLM | Mittel | Aktiv |
| Kundenagenten | Kundenspezifisch | Nach Projektkonfiguration | Variabel | Je Projekt |

Inventar-Aktualisierung: Bei jeder neuen KI-Funktion / vor Production-Deployment.

---

## 3. Risikoklassifizierung (AI-02)

Klassifizierung nach ISO 42001 + EU AI Act (4-Stufen-Modell):

| Risikostufe | Definition | Beispiele | Anforderungen |
|-------------|-----------|-----------|---------------|
| **Inakzeptabel** | Verbotene KI-Praktiken (EU AI Act Art. 5) | Social Scoring, Manipulation | **Darf nicht betrieben werden** |
| **Hoch** | Autonome Entscheidungen mit Personenauswirkung | Kreditwürdigkeit, Job-Auswahl | Human-in-the-Loop, Conformity Assessment |
| **Mittel** | Teilautonome Aktionen, Content-Generierung | Hermes Agent-Aktionen, Code-Gen | Logging, Transparenz, menschliche Freigabe bei krit. Aktionen |
| **Niedrig** | Reine Assistenz, keine autonome Entscheidung | ChatGPT-Nutzung, KI-Suche | Transparenzhinweis |

Bei NeXify AI: **Keine Hochrisiko-Systeme aktiv** (Stand 06/2026). Mittelrisiko-Systeme (Hermes, 9Router) unterliegen voller Governance.

---

## 4. Human Oversight (AI-03)

| Prinzip | Umsetzung |
|---------|----------|
| **Human-in-the-Loop (HITL)** | Kritische Aktionen (VPS-Zugriff, Secrets, Delete, Production-Deployment) erfordern menschliche Freigabe |
| **Human-on-the-Loop (HOTL)** | Autonome Agenten-Aktionen werden geloggt und können jederzeit gestoppt werden |
| **Human-over-the-Loop** | Geschäftsführung hat Not-Stopp für alle Agenten |
| **Override-Funktion** | Jeder Agent hat `/stop`-Endpoint; alle Jobs kündbar via Dashboard |

Referenz: CONTROL_CATALOG AI-03, VERBOT V08.

---

## 5. Transparenz und Kundenhinweise (AI-04)

- **Kundenhinweis-Pflicht**: Jeder Kunde erhält schriftlichen Hinweis auf KI-Nutzung
- **Agenten-Kennzeichnung**: Jeder KI-Output wird als "AI-generiert" gekennzeichnet (wo technisch möglich)
- **Transparenz-Dokument**: Kunden erhalten Beschreibung der eingesetzten KI-Systeme
- **Opt-Out**: Kunden können KI-Komponenten ablehnen (muss projektindividuell geprüft werden)

---

## 6. Bias-Prävention und Fairness (AI-05)

- Regelmäßige Bias-Tests auf Agenten-Outputs (quartalsweise)
- Trainingsdaten-Quellen dokumentiert (Brain-Source-Tracking)
- Diskriminierungs-Monitoring: Stichproben auf geschützte Merkmale
- Korrekturmechanismus: Bei Bias-Fund → Sperrung der betroffenen Route/Agent bis Fix

---

## 7. Agenten-Aktionssperren (AI-06)

| Aktionstyp | Erlaubt? | Freigabe |
|------------|----------|----------|
| Lesender Zugriff auf Brain/Qdrant | ✅ | Automatisch |
| Schreibzugriff auf eigene Daten | ✅ | Automatisch |
| Production-Deployment | ❌ | Mensch (HITL) |
| Secrets lesen/schreiben | ❌ | Gesperrt (V08) |
| Datei löschen (produktiv) | ❌ | Gesperrt (V08) |
| Data-Sharing an LLM-Provider | ❌ | Nur mit AVV (V09) |

---

## 8. KI-Logging (AI-09)

Jede Agenten-Aktion wird geloggt:

| Log-Feld | Beschreibung |
|----------|-------------|
| **Timestamp** | ISO 8601 (UTC) |
| **Agent-ID** | Welcher Agent |
| **Action** | Was wurde getan? |
| **Modell** | Welches Modell/Route |
| **Prompt** | Gekürzt/Normalisiert (keine Secrets) |
| **Result** | Output/Ergebnis |
| **Duration** | Laufzeit (ms) |
| **Status** | Success / Error / Blocked |

Log-Aufbewahrung: 12 Monate (bei Kundenprojekten nach AVV).

---

## 9. Datenqualität (AI-07)

Qualitätskriterien für Trainings-/Wissensdaten im Brain:

- **Aktualität**: Daten älter als 12 Monate markiert, 24 Monate archiviert
- **Quellentransparenz**: Jeder Chunk mit Source-URI
- **Validierung**: Automatische Prüfung auf PII/Secrets vor Brain-Import
- **Rechteklärung**: Nur Daten mit Nutzungserlaubnis

---

## 10. Modellfreigabe und Monitoring (AI-08)

- **Modell-Zulassung**: Jedes Modell/Route im 9Router durchläuft Freigabe-Prozess (Performance, Bias, Kosten)
- **Performance-Monitoring**: Latenz, Token-Verbrauch, Fehlerrate (Dashboard)
- **Drift-Erkennung**: Automatischer Vergleich von Output-Qualität über Zeit
- **Deaktivierung**: Modelle mit >5% Fehlerrate werden automatisch deaktiviert

---

## 11. Verweise

| Dokument | Pfad |
|----------|------|
| CONTROL_CATALOG (AI-01 bis AI-09) | `CONTROL_CATALOG.yaml` |
| Security Policy | `SECURITY_POLICY.md` |
| Datenschutz-Richtlinie (intern) | `PRIVACY_POLICY_INTERNAL.md` |
| Verbote und Pflichtregeln | `VERBOTE_UND_PFLICHTREGELN.md` |
| Normenregister | `NORMENREGISTER.md` |

---

*Ende der AI_GOVERNANCE_POLICY*
