# SOFTWARE_ENGINEERING_STANDARD — Softwareentwicklungs-Standard

| Feld | Wert |
|------|------|
| **Dokumenttyp** | Standard (ISO/IEC 12207:2017, ISO/IEC 25010:2023) |
| **Version** | 1.0 |
| **Stand** | 23.06.2026 |
| **Nächste Prüfung** | 23.06.2027 |
| **Verantwortlich** | Pascal |
| **Geltungsbereich** | Alle Softwareentwicklungsaktivitäten der NeXify AI |

---

## 1. Geltungsbereich

Dieser Standard gilt für alle Software-Artefakte, die NeXify AI entwickelt oder betreibt:

- **Plattform-Repositories**: nexifyai-platform (Python, FastAPI, CLI)
- **Agenten-Repositories**: Hermes Agent, Recherche-Agent, Content-Agent
- **WebUI**: work.nexifyai.cloud (Frontend + Backend)
- **KI-Komponenten**: Brain API, 9Router, RAGFlow-Integration
- **CI/CD-Konfiguration**: GitHub Actions, Docker, Deployment-Skripte
- **Infrastruktur-Code**: Docker Compose, Cloudflare-Konfiguration

Referenz: ISO/IEC 12207 (Software-Lifecycle), ISO 25010 (Qualitätsmodell), ISO 9001 (Qualitätsmanagement).

---

## 2. Anforderungsmanagement (SE-01)

| Phase | Beschreibung | Artefakt |
|-------|-------------|----------|
| **Erhebung** | Anforderungen aus Kundenprojekt, Brain, Aufgaben-Register | Requirements-Register (`04_register/`) |
| **Analyse** | Machbarkeit, Risiko, Priorisierung (P0–P3) | Analyse-Dokument |
| **Spezifikation** | Formulierung als User Story + Akzeptanzkriterien | GitHub Issues / Milestones |
| **Validierung** | Anforderung mit Auftraggeber abgestimmt | Sign-off (E-Mail / Dashboard) |
| **Änderungsmanagement** | Jede Änderung via Change-Request dokumentiert | ADR (Architecture Decision Record) |

Architecture Decision Records (ADRs) in `03_regelwerke/adr/`.

---

## 3. Architektur-Definition

- **ADR-Pflicht**: Jede signifikante Architekturentscheidung erhält ein ADR
- **Tech-Stack**: Python (Backend), FastAPI, Docker, Cloudflare, Qdrant, VPS (Hetzner)
- **Abnahmekriterien**: Security, Skalierbarkeit, Wartbarkeit, Testbarkeit
- **Dokumentation**: Tech-Stack-Register in `04_register/techstack.md`
- **Review**: Architektur-Review vor Implementierung (bei P0/P1)

---

## 4. Implementierung (SE-02)

### 4.1 Coding-Standards

| Sprache | Standard | Tool |
|---------|----------|------|
| **Python** | PEP 8, PEP 257 (Docstrings) | Ruff / black / flake8 |
| **YAML** | YAML 1.2 | yamllint |
| **Markdown** | CommonMark | markdownlint |
| **Docker** | Dockerfile Best Practices | hadolint |
| **Shell** | POSIX-konform | shellcheck |

### 4.2 Qualitätsanforderungen

- Typannotationen in Python (mypy strict)
- Keine Secrets im Code (V01)
- README-Datei pro Repository
- Lauffähige /health-Endpoints (V06)

### 4.3 Branching-Strategie (GitHub Flow)

- `main` — production-ready, geschützt (PR-Required, Tests Required)
- `feat/*` — Feature-Zweige
- `fix/*` — Bugfix-Zweige
- `chore/*` — Wartungsarbeiten

---

## 5. Code-Review und Merge (V04, SE-03)

| Kriterium | Vorgabe |
|-----------|---------|
| **PR-Review** | Mindestens 1 Review vor Merge in `main` |
| **Tests bestanden** | Alle CI-Tests grün |
| **Linting** | Keine neuen Linting-Fehler |
| **Secrets-Scan** | pre-commit + CI (git-secrets) |
| **Dokumentation** | Bei API-Änderungen: OpenAPI/Doc-Update |
| **Squash-Merge** | Squash-Merge auf `main` |
| **Ausnahme** | P0-Hotfix: Merge erlaubt mit Post-Merge-Review |

---

## 6. Tests (>80% Coverage) (SE-04)

| Teststufe | Beschreibung | Mindestabdeckung |
|-----------|-------------|------------------|
| **Unit-Tests** | Einzelfunktionen, Module | ≥ 80% |
| **Integrationstests** | API-Endpunkte, DB-Zugriffe, Agenten-Flows | ≥ 70% |
| **End-to-End-Tests** | Komplette User-Journeys | Kritische Pfade |
| **Security-Tests** | SAST (Bandit), Dependency-Scan (pip-audit) | 100% der kritischen Module |
| **KI-Validierungstests** | Prompt-Injection, Output-Qualität | Stichproben |

Test-Ausführung: Automatisch in CI (GitHub Actions).

---

## 7. CI/CD (SE-04)

| Schritt | Tool | Beschreibung |
|---------|------|-------------|
| **Commit-Hook** | pre-commit | Linting, Secrets-Scan, Formatierung |
| **CI-Build** | GitHub Actions | Test, Lint, Build, Docker-Build |
| **SAST** | Bandit + pip-audit | Sicherheitsanalyse |
| **Release-Tag** | SemVer (MAJOR.MINOR.PATCH) | Git-Tag + Changelog |
| **CD-Deployment** | GitHub Actions → VPS (Docker) | Automatisiert nach Release |
| **Health-Check** | /health + Monitoring | Automatisch nach Deployment |

---

## 8. Releases und Versionierung

- SemVer-Strict: `MAJOR.MINOR.PATCH` (ISO 12207)
- Jeder Release: Changelog-Eintrag, Tag, Release-Note
- Release-Frequenz: Nach Bedarf (mindestens 1 Release pro Sprint)
- Rollback-Fähigkeit: Jeder Release mit Docker-Image-Tag (V02)

---

## 9. Betrieb (SE-02, QM-04)

| Bereich | Vorgabe |
|---------|---------|
| **Monitoring** | Service Health, Error Rate, Latenz |
| **Backup** | Tägliches Backup (Brain, Qdrant, Config) |
| **Logging** | Strukturierte Logs (JSON) |
| **Incident** | Meldepflicht, Incident-Response-Prozess |
| **Security-Updates** | Monatlicher Dependency-Update-Check |

---

## 10. Verweise

| Dokument | Pfad |
|----------|------|
| Normenregister | `NORMENREGISTER.md` |
| CONTROL_CATALOG (SE-01 bis SE-04) | `CONTROL_CATALOG.yaml` |
| Verbote und Pflichtregeln | `VERBOTE_UND_PFLICHTREGELN.md` |
| Security Policy | `SECURITY_POLICY.md` |
| Compliance-Testplan | `TESTPLAN_COMPLIANCE.md` |
| ADRs | `03_regelwerke/adr/` |

---

*Ende der SOFTWARE_ENGINEERING_STANDARD*
