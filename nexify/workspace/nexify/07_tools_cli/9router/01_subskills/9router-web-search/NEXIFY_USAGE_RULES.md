# 9Router Web Search — NeXify Usage Rules

> **Stand**: 2026-06-11 | **Status**: ACTIVE

## Quellen

- Skill: `https://raw.githubusercontent.com/decolua/9router/refs/heads/master/skills/9router-web-search/SKILL.md`
- Primär: `9router-web-search` + `you.com` als Fallback

## Nutzungsregeln

### 1. Vorrang: Internes Wissen vor Internet
Bevor Internet-Recherche gestartet wird:
1. Oracle/Brain/agentmemory/Knowledge-Register prüfen
2. Research Cache Register prüfen (`NEXIFY_RESEARCH_CACHE_REGISTER.md`)
3. Nur bei Lücken oder veralteten Einträgen → Internet

### 2. Recherche-Pflicht
Internet-Recherche ist PFLICHT bei:
- Technischen Entscheidungen (Tools, Libraries, APIs)
- Sicherheitsrelevanten Themen (Best Practices, CVEs)
- Rechtlichen Fragen (Lizenzen, Compliance, GDPR)
- Architekturentscheidungen (Patterns, Anti-Patterns)
- Tool-Evaluierungen (Alternativen, Reviews)

### 3. Qualitätskriterien
- Offizielle Dokumentation bevorzugen
- GitHub-Repos prüfen: Sterne,维护, Issues, Last Commit
- Lizenz prüfen (OSI-konform?)
- Security-Status prüfen ( bekannte CVEs?)
- Seriöse Quellen bevorzugen (keine AI-generierten Inhalt-Mühlen)

### 4. Dokumentation
Nach jeder Recherche:
- Ergebnis dokumentieren
- Im Research Cache Register eintragen
- Evidence schreiben (wenn relevant)
- Brain/agentmemory/Oracle-Pending erzeugen

### 5. Verboten
- Keine Recherche für bereits gut dokumentierte interne Themen
- Keine Exzessiv-Anfragen (Rate-Limiting beachten)
- Keine敏感 Daten in Suchanfragen
