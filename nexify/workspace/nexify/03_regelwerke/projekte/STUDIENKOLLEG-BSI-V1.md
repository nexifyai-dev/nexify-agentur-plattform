# Regelwerk: Studienkolleg Aachen — BSI IT-Grundschutz

**Regelwerk-ID:** STUDIENKOLLEG-BSI-V1
**Template:** TPL-BSI-IT-GRUNDSCHUTZ-V1
**Kategorie:** Sicherheit / BSI
**Version:** 1.0
**Status:** AKTIV
**Erstellt:** 2026-06-23

---

## 1. Metadaten

| Feld | Beschreibung |
|------|-------------|
| Regelwerk-Name | Studienkolleg Aachen — BSI IT-Grundschutz |
| Version | 1.0 |
| Geltungsbereich | Studienkolleg Aachen IT-Infrastruktur |
| Verantwortlich | Systemmaster Agent |
| Review-Frequenz | Quartalsweise |
| Letztes Review | 2026-06-23 |

## 2. Zielsetzung

### 2.1 Zweck
Sicherstellung der IT-Sicherheit für das Studienkolleg Aachen gemäß BSI IT-Grundschutz.

### 2.2 Geltungsbereich
- **Systeme:** Web-Portal, Datenbanken, Authentifizierung
- **Prozesse:** Studentenverwaltung, Antragsstellung, Kommunikation
- **Personen:** Admins, Dozenten, Studenten

### 2.3 Abhängigkeiten
- BSI-Standard 200-1 bis 200-4
- DSGVO (Datenschutz)
- Landesdatenschutzgesetz NRW

## 3. Anforderungen

### 3.1 Grundschutz-Anforderungen

| Baustein | ID | Anforderung | Umsetzungsstand | Verantwortlich | Deadline |
|----------|-----|-------------|-----------------|----------------|----------|
| APP.1 Webanwendung | B.5.1 | Sichere Webanwendung | UMGESETZT | Agent | 2026-06-23 |
| OPS.1.1.1 Patch-Management | B.5.2 | Regelmäßige Updates | UMGESETZT | Agent | 2026-06-23 |
| INF.1 Serversysteme | B.5.3 | Härtung | IN_ARBEIT | Agent | 2026-09-30 |
| NET.1 Netzübergänge | B.5.4 | Firewall | UMGESETZT | Agent | 2026-06-23 |
| CON.2 Authentifizierung | B.5.5 | MFA | IN_ARBEIT | Agent | 2026-09-30 |
| DAT.1 Datensicherung | B.5.6 | Backup | UMGESETZT | Agent | 2026-06-23 |
| DER.2.1 Benutzerverwaltung | B.5.7 | IAM | IN_ARBEIT | Agent | 2026-09-30 |

### 3.2 Ergänzende Anforderungen
- DSGVO-konforme Datenverarbeitung
- Barrierefreiheit (WCAG 2.1 AA)
- Multilingualität (DE/EN)

### 3.3 Ausnahmen
- Keine Ausnahmen genehmigt

## 4. Umsetzung

### 4.1 Maßnahmenplan

| Maßnahme | Priorität | Status | Verantwortlich | Deadline |
|----------|-----------|--------|----------------|----------|
| Webanwendung härten | P0 | UMGESETZT | Agent | 2026-06-23 |
| MFA implementieren | P1 | IN_ARBEIT | Agent | 2026-09-30 |
| Backup-Strategie | P0 | UMGESETZT | Agent | 2026-06-23 |
| Monitoring einrichten | P1 | IN_ARBEIT | Agent | 2026-09-30 |

### 4.2 Technische Umsetzung
- Cloudflare WAF aktiviert
- HTTPS erzwungen
- CSP Headers gesetzt
- Backup: Täglich + wöchentlich

### 4.3 Organisatorische Umsetzung
- Security Awareness für Admins
- Dokumentation aller Änderungen
- Incident Response Plan

## 5. Prüfung und Nachweis

### 5.1 Prüfmetriken

| Metrik | Ziel | Ist | Status |
|--------|------|-----|--------|
| Patch-Level | 100% aktuell | 95% | 🟡 |
| MFA-Abdeckung | 100% | 60% | 🔴 |
| Backup-Erfolgsrate | 100% | 100% | 🟢 |
| Vulnerability Scan | 0 kritisch | 0 | 🟢 |

### 5.2 Prüfverfahren
- Monatliche Vulnerability Scans
- Quartalsweise Penetration Tests
- Jährliches Audit

### 5.3 Evidence

| Evidence-ID | Beschreibung | Pfad |
|-------------|-------------|------|
| EV-STUD-001 | Backup-Logs | /workspace/nexify/10_evidence/studienkolleg/ |
| EV-STUD-002 | Security Scan Reports | /workspace/nexify/10_evidence/studienkolleg/ |

## 6. Risikobewertung

| Risiko | Eintritt | Auswirkung | Maßnahme |
|--------|----------|------------|----------|
| Datenleck | 2 | 5 | Verschlüsselung + Access Control |
| DDoS | 3 | 4 | Cloudflare DDoS Protection |
| Ransomware | 2 | 5 | Backup + Incident Response |

## 7. Compliance-Check

- [x] Grundschutz-Anforderungen geprüft
- [x] Abweichungen dokumentiert
- [x] Maßnahmen definiert
- [x] Evidence gesammelt
- [x] Brain-Sync aktualisiert
- [x] Agentmemory aktualisiert

## 8. Änderungshistorie

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0 | 2026-06-23 | Initiale Erstellung aus Template | Systemmaster Agent |

---

**Erstellt von:** Systemmaster Agent
**Template-Pfad:** /workspace/nexify/03_regelwerke/templates/TPL-BSI-IT-GRUNDSCHUTZ-V1.md
**Regelwerks-Pfad:** /workspace/nexify/03_regelwerke/projekte/STUDIENKOLLEG-BSI-V1.md
