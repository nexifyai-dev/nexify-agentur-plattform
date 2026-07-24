# NeXify Skill-Versionierungs-Schema (SemVer)

**Version:** 1.0.0  
**Status:** BINDLICH  
**Erstellt:** 2026-06-22  
**Autor:** NeXify Systemmaster  

---

## 1. Zweck

Dieses Dokument definiert das verbindliche Versionierungs-Schema für alle NeXify Skills. Ziel ist Konsistenz, Nachvollziehbarkeit und Kompatibilitätskontrolle über den gesamten Skill-Lebenszyklus.

---

## 2. Schema: Semantic Versioning (SemVer)

### 2.1 Format

```
MAJOR.MINOR.PATCH[-nexify]
```

### 2.2 Semantik

| Komponente | Wann erhöhen | Beispiele |
|---|---|---|
| **MAJOR** | Breaking Changes — bestehende Funktionalität wird entfernt oder geändert, API/Prompt-Kontrakt gebrochen, Zielgruppe wechselt | Prompt-Schema geändert, Rollen-Definition grundlegend revidiert, Skills-Zielgruppe wechselt |
| **MINOR** | Neue Features — additive Erweiterungen ohne Breaking Change | Neue Fähigkeiten, neue Integrationen, erweiterte Checklisten, neue Quellen |
| **PATCH** | Bugfixes — Fehlerbehebungen, Klarstellungen, Redaktion | Typo-Fixes, Link-Korrekturen, fehlende Felder ergänzt, Klarstellungen ohne Funktionsänderung |
| **[-nexify]** | Suffix (optional) — NeXify-spezifische Ableitung aus einem Original-Skill | `1.0.0-nexify` für die erste NeXify-Optimierung eines Upstream-Skills |

### 2.3 Sonderregeln

| Regel | Beschreibung |
|---|---|
| **Initiale Version** | Jeder Skill beginnt bei `1.0.0` (oder `1.0.0-nexify` bei Ableitungen) |
| **Pre-Release** | Optional: `1.0.0-rc.1`, `1.0.0-beta.2` |
| **Build-Metadata** | Optional: `1.0.0+sha.abc1234` für SHA256-Referenz |
| **Keine führenden Nullen** | `1.0.0`, nicht `01.00.00` |
| **Vorwärtszähler** | Versionsnummern dürfen nur steigen |
| **Suffix wird beibehalten** | `1.0.0-nexify` → `1.1.0-nexify` → `2.0.0-nexify` |

---

## 3. Pflichtfelder in SKILL.md

Jeder Skill MUSS folgende Versionierungs-Felder im YAML-Frontmatter haben:

```yaml
---
name: <skill-name>
version: "<MAJOR.MINOR.PATCH[-nexify]>"
changelog_version: "<MAJOR.MINOR.PATCH>"
last_modified: "YYYY-MM-DD"
---
```

Zusätzlich MUSS am Ende des SKILL.md eine Versionstabelle stehen:

```markdown
## Versionierung

| Version | Datum | Änderung | Typ | SHA256 |
|---|---|---|---|---|
| 1.0.0 | YYYY-MM-DD | Initiale Version | MAJOR | <hash> |
```

---

## 4. Versionierungs-Workflow

```
1. Skill ändern
2. Änderungstyp bestimmen: MAJOR / MINOR / PATCH
3. Version im Frontmatter aktualisieren
4. Eintrag in Versionstabelle ergänzen
5. SHA256 der Skill-Datei erfassen
6. Evidence schreiben: /workspace/nexify/10_evidence/skills/
7. Skill-Register (nexify-skill-agent-command-hook-template-register.json) aktualisieren
```

---

## 5. Kompatibilitätsmatrix

| Situation | Aktion |
|---|---|
| Skill A v1.x.x → v1.x.x+1 | Kompatibel, Patch |
| Skill A v1.x.x → v1.(x+1).0 | Kompatibel, additive Features |
| Skill A v1.x.x → v2.0.0 | BREAKING — alle Abhängigkeiten prüfen |
| Skill A v1.0.0-nexify | Ableitung, truffix wird beibehalten |

---

## 6. Versionierungs-Pflicht für bestehende Skills

Alle Skills in `/workspace/nexify/05_skills/` werden erfasst und initial auf `1.0.0` gesetzt (sofern keine Version existiert). Skills, die bereits eine Version haben (z.B. `1.0.0-nexify`), werden beibehalten.

---

*Ende NeXify Skill Versionierungs-Schema v1.0.0*
