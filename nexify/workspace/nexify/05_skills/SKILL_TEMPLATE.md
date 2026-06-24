# NeXify SKILL.md Template — Erweitert mit Versionierung (SemVer)

**Version:** 1.0.0  
**Status:** VERBINDLICH  
**Erstellt:** 2026-06-22  
**Autor:** NeXify Systemmaster  

---

## Zweck

Dieses Template definiert die verbindliche Struktur aller NeXify SKILL.md-Dateien. Es ist erweitert um das SemVer-Versionierungs-Feld gemäß `/workspace/nexify/05_skills/VERSIONING_SCHEMA.md`.

---

## Template

```markdown
---
name: <skill-name>
display_name: "<Anzeigename>"
description: "<Beschreibung>"
version: "<MAJOR.MINOR.PATCH[-nexify]>"
last_modified: "YYYY-MM-DD"
author: "<Autor>"
status: "ACTIVE|DRAFT|DEPRECATED"
risk_level: "LOW|MEDIUM|HIGH"
tools: "<Tool1>, <Tool2>, ..."
---

# <Skill Name>

## 1. Zweck und Geltungsbereich

<Kurzbeschreibung des Skills, seiner Aufgabe und seines Geltungsbereichs>

## 2. Kernfunktionen

<Funktionalitäten des Skills>

## 3. Aufruf-Konvention

<Wie wird der Skill aufgerufen?>

## 4. Workflow / Ablauf

<Schritt-für-Schritt-Ablauf>

## 5. Berechtigungen

<Tabelle mit Tool-Berechtigungen>

## 6. Quellen und Referenzen

<Links, Pfade, SHA256>

## 7. Versionierung

| Version | Datum | Änderung | Typ | SHA256 |
|---|---|---|---|---|
| 1.0.0 | YYYY-MM-DD | Initiale Version | MAJOR | <hash> |

---

*Ende <Skill Name> — Skill-Definition v<VERSION>.*
```

---

## Versionierungs-Felder

| Feld | Pflicht | Beschreibung |
|---|---|---|
| `version` | JA | SemVer-Version im YAML-Frontmatter |
| `last_modified` | JA | Letztes Änderungsdatum (YYYY-MM-DD) |
| `Versionierung` (Tabelle) | JA | Versionstabelle am Ende des Dokuments |
| `changelog_version` | OPTIONAL | Wenn Abweichung von `version` |

---

## Beispiel

```yaml
---
name: nexify-knowledge-data-engineer
display_name: "NeXify Knowledge Data Engineer"
description: "..."
version: "1.0.0-nexify"
last_modified: "2026-06-14"
author: "NeXify Systemmaster"
status: "ACTIVE"
risk_level: "LOW"
tools: "Read, Write, Edit, Bash, Glob, Grep"
---
```

---

*Ende NeXify SKILL.md Template v1.0.0*
