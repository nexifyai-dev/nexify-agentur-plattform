# Security Policy / Sicherheitsrichtlinie

**NeXify AI by NeXify** — `nexifyai-dev/nexify-agentur-plattform`

---

## Deutsch

### Schwachstellen melden

Bitte **keine** öffentlichen Issues für Sicherheitslücken öffnen.

1. **Bevorzugt:** [GitHub Private Vulnerability Reporting](https://github.com/nexifyai-dev/nexify-agentur-plattform/security/advisories/new) (Security Advisories → Report a vulnerability)
2. **Alternativ:** E-Mail an **mail@nexifyai.cloud** mit Betreff `[SECURITY]`

Bitte angeben: betroffene Komponente/Pfad, Reproduktionsschritte, Impact, ggf. Proof-of-Concept (ohne Exploits gegen Produktivsysteme).

### Scope

In Scope: Website (`apps/website`), Backend (`backend/`), CI/Deploy-Workflows, öffentlich erreichbare APIs dieser Plattform.

Außerhalb / begrenzt: vendored Upstream (z. B. Hermes WebUI unter `apps/hermes`), Drittanbieter-SaaS, Infrastruktur außerhalb dieses Repos.

### Erwartungen

| Schritt | Ziel |
|--------|------|
| Erste Rückmeldung | innerhalb von **2 Werktagen** |
| Triage / Severity | innerhalb von **5 Werktagen** |
| Fix / Advisory | so schnell wie angemessen; kritische Issues priorisiert |

Wir danken für verantwortungsvolle Offenlegung. Bitte keine Daten Dritter und keine Secrets in öffentlichen Kanälen teilen.

---

## English

### Reporting a vulnerability

Please **do not** open public issues for security vulnerabilities.

1. **Preferred:** [GitHub Private Vulnerability Reporting](https://github.com/nexifyai-dev/nexify-agentur-plattform/security/advisories/new)
2. **Alternative:** Email **mail@nexifyai.cloud** with subject `[SECURITY]`

Include: affected component/path, reproduction steps, impact, and a PoC if available (do not attack production systems).

### Scope

In scope: website (`apps/website`), backend (`backend/`), CI/deploy workflows, and public APIs of this platform.

Out of scope / limited: vendored upstream (e.g. Hermes WebUI under `apps/hermes`), third-party SaaS, infrastructure outside this repository.

### Response expectations

| Step | Target |
|------|--------|
| Initial acknowledgement | within **2 business days** |
| Triage / severity | within **5 business days** |
| Fix / advisory | as promptly as reasonable; critical issues prioritized |

Thank you for responsible disclosure. Do not share third-party data or secrets in public channels.
