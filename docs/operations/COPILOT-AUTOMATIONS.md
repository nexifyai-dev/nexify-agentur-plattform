# Copilot-Automations (GitHub) — NeXifyAI-Vorlagen (2026-08-09)

**Erstellung (Pascal, ~5 Min, einmalig):** GitHub → Repo `nexifyai-dev/nexify-agentur-plattform` → **Agents-Tab → Automations → Create new**. Automations sind UI-only (keine REST-API, verifiziert 404). Jede Automation unten als Name + Trigger + Prompt + Tools.

**Kontext für alle Prompts:** Repo = NeXifyAI-Plattform (Website Next.js, Backend FastAPI, Hermes-WebUI). Kommunikation Deutsch. CI-Tokens: #0A0A0A/#C8FF00, Claim „AUTOMATE IT.". Keine Secrets in Prompts (Repo-Secrets für Zugänge).

## 1. NexifyAI Issue-Triage (Trigger: When an issue is created)
- **Filter:** `is:open`
- **Tools:** Update issue labels, Comment on issue
- **Prompt:**
  > Klassifiziere dieses Issue als `bug`, `enhancement`, `security` oder `gtm` und setze das passende Label. Bei Sicherheit/Recht zusätzlich `P1`. Kommentiere auf Deutsch mit einer Begründung (1–3 Sätze) und der Priorität (P0/P1/P2/P3). Keine Änderungen am Code, kein Schließen.

## 2. NexifyAI PR-Review (Trigger: When a pull request is opened)
- **Filter:** `is:open`
- **Tools:** Comment on PR, Update PR labels
- **Prompt:**
  > Überprüfe diesen Pull Request: (1) Scope ausschließlich dieses Repos, (2) keine Secrets/Credentials im Diff, (3) Änderungen passen zur CI (Design-Tokens, Deutsch, keine Mockdaten). Schreibe einen Kommentar auf Deutsch mit Findings und Empfehlung `merge` oder `change`. Pushe keine Änderungen.

## 3. NexifyAI Security-Tagesreport (Trigger: On a schedule → Daily, 07:00)
- **Tools:** Create issue, Update issue labels
- **Prompt:**
  > Erstelle ein Issue „Security-Tagesreport" (Label `security`, Datum im Titel): Liste alle offenen Dependabot-Alerts und Code-Scanning-Alerts mit Severity, betroffenem Paket/Pfad und empfohlener Aktion (Update/Entfernen/Akzeptieren mit Begründung). Schließe einen Vortages-Report gleichen Titels, falls vorhanden. Deutsch.

## 4. NexifyAI GTM-Gap-Scan (Trigger: On a schedule → Weekly, Montag 08:00)
- **Tools:** Create issue, Update issue labels
- **Prompt:**
  > Scanne docs/gtm/ und die Lead-/Conversion-Pipeline (docs/governance/) auf offene Acquisition-/Conversion-Lücken. Erstelle ein Issue „GTM-Gap-Scan KW<xx>" (Label `gtm`) mit P0/P1-Empfehlungen, die Neukunden gewinnen oder begeistern (P0-Mandat). Deutsch.

---
**Hinweise:** Sessions aus Automations sind für alle Repo-Leser sichtbar — keine Secrets in Prompts. Modell: Standard (nicht zwingend). Bei Bedarf „Run now" zum Testen. Automations benötigen Copilot Pro/Business (laut Doku; Enterprise-Org-Einstellung erlaubt Automations standardmäßig).
