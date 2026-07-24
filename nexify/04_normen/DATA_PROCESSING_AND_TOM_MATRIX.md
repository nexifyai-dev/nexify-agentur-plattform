# Datenverarbeitungs- und TOM-Matrix — NeXify AI OS
## Version: 1.0 | Stand: 2026-06-23
## Normbasis: DSGVO Art. 32 (TOM), ISO 27701 (Privacy Information Management), ISO 27001 A.18

---

## 1. Zweck
Diese Matrix dokumentiert alle relevanten Verarbeitungstätigkeiten personenbezogener Daten im NeXify AI OS sowie die technischen und organisatorischen Maßnahmen (TOM) gemäß DSGVO Art. 32. Sie dient als Nachweis für Datenschutz-Audits und AVV-Prüfungen.

---

## 2. Verarbeitungstätigkeiten (VT)

### VT-01: Brain-Speicher (Wissensbasis)

| Attribut | Wert |
|---|---|
| **Zweck** | Semantische Wissensbasis für AI-Agenten — Speicherung von Projektwissen, Architekturentscheidungen, Governance-Dokumenten |
| **Datenarten** | Technische Dokumentation, Konfigurationen, Entscheidungen (keine direkten PII) |
| **Kategorien betroffener Personen** | Keine natürlichen Personen |
| **Speicherdauer** | Unbefristet (bis zur Löschung durch Admin) |
| **Löschfrist** | 30 Tage nach Löschantrag |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| **Datenempfänger** | Keine Weitergabe |
| **AVV-Bezug** | Hetzner (Hosting), Cloudflare (Tunnel-Transit) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, WEITERGABE, VERFÜGBARKEIT, TRENNUNG |

### VT-02: RAGFlow-Dokumente

| Attribut | Wert |
|---|---|
| **Zweck** | Dokumentenverarbeitung und -indexierung für Retrieval-Augmented Generation |
| **Datenarten** | Kunden-Dokumente, technische Spezifikationen, Projektdateien |
| **Kategorien betroffener Personen** | Kundenmitarbeiter (indirekt in Dokumenten) |
| **Speicherdauer** | Bis Projektende + 90 Tage |
| **Löschfrist** | 90 Tage nach Projektende |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| **Datenempfänger** | Keine Weitergabe (kein externes LLM-Training) |
| **AVV-Bezug** | Hetzner (Hosting) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, WEITERGABE, VERFÜGBARKEIT, TRENNUNG |

### VT-03: Agenten-Logs

| Attribut | Wert |
|---|---|
| **Zweck** | Protokollierung von Agent-Aktionen für Debugging, Audit und Optimierung |
| **Datenarten** | Agent-ID, Aktion, Timestamp, Prompt-Texte (keine PII) |
| **Kategorien betroffener Personen** | Keine natürlichen Personen |
| **Speicherdauer** | 90 Tage |
| **Löschfrist** | Automatische Löschung nach 90 Tagen |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| **Datenempfänger** | Keine Weitergabe |
| **AVV-Bezug** | Hetzner (Hosting), MongoDB (Speicherung), Cloudflare (Transit) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, VERFÜGBARKEIT |

### VT-04: Chat-Verlauf (Hermes WebUI)

| Attribut | Wert |
|---|---|
| **Zweck** | Fortlaufende Unterhaltung mit AI-Agenten; Kontexterhaltung |
| **Datenarten** | Chat-Nachrichten, User-ID, Timestamp |
| **Kategorien betroffener Personen** | Nutzer (Mitarbeiter, Kundenprojekt-Mitarbeiter) |
| **Speicherdauer** | 30 Tage (aktiv) / 90 Tage (Archiv) |
| **Löschfrist** | 30 Tage nach Löschantrag des Nutzers |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| **Datenempfänger** | Keine Weitergabe |
| **AVV-Bezug** | Hetzner (Hosting), Vercel (WebUI), Cloudflare (Transit) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, WEITERGABE, VERFÜGBARKEIT, TRENNUNG |

### VT-05: Kundendaten (Projektspezifisch)

| Attribut | Wert |
|---|---|
| **Zweck** | Kundenprojekt-Abwicklung (Studienkolleg, Bookando, VSK) |
| **Datenarten** | Name, E-Mail, Projektdaten, Zahlungsdaten (keine besonderen Kategorien) |
| **Kategorien betroffener Personen** | Kunden, Kundenmitarbeiter, Projektteilnehmer |
| **Speicherdauer** | Vertragslaufzeit + 6 Jahre (steuerrechtlich) |
| **Löschfrist** | 6 Jahre nach Vertragsende |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| **Datenempfänger** | Resend (E-Mail), Hetzner (Hosting) |
| **AVV-Bezug** | Resend (AVV vorhanden), Hetzner (AVV vorhanden) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, WEITERGABE, VERFÜGBARKEIT, TRENNUNG, INTEGRITÄT |

### VT-06: Betriebsdaten (Monitoring, Logs, Metriken)

| Attribut | Wert |
|---|---|
| **Zweck** | Systemüberwachung, Kapazitätsplanung, Fehleranalyse |
| **Datenarten** | IP-Adressen (anonymisiert), Systemmetriken, Zugriffslogs |
| **Kategorien betroffener Personen** | Keine (IP-Anonymisierung) |
| **Speicherdauer** | 30 Tage (Prometheus), 90 Tage (Logs) |
| **Löschfrist** | Automatische Rotation nach 30/90 Tagen |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| **Datenempfänger** | Keine Weitergabe |
| **AVV-Bezug** | Hetzner (Hosting) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, VERFÜGBARKEIT |

### VT-07: Qdrant Vector Store

| Attribut | Wert |
|---|---|
| **Zweck** | Vektorspeicher für semantische Suche und Embedding-basierte Abfragen |
| **Datenarten** | Embedding-Vektoren, Metadaten (keine Rohdaten) |
| **Kategorien betroffener Personen** | Siehe abhängige VT (VT-01, VT-02) |
| **Speicherdauer** | Wie Quellsystem (VT-01 unbefristet, VT-02 bis Projekt+90d) |
| **Löschfrist** | Synchron zur Löschung der Quelldaten |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b/f DSGVO |
| **Datenempfänger** | Keine Weitergabe |
| **AVV-Bezug** | Hetzner (Hosting) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, VERFÜGBARKEIT, INTEGRITÄT |

### VT-08: Agentmemory

| Attribut | Wert |
|---|---|
| **Zweck** | Kurzzeitgedächtnis für AI-Agenten während der Aufgabenbearbeitung |
| **Datenarten** | Agent-Kontext, Aufgabenstatus, temporäre Daten |
| **Kategorien betroffener Personen** | Keine natürlichen Personen |
| **Speicherdauer** | 24 Stunden (automatische Bereinigung) |
| **Löschfrist** | Automatisch nach 24h |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| **Datenempfänger** | Keine Weitergabe |
| **AVV-Bezug** | Hetzner (Hosting) |
| **TOM-Kategorien** | ZUTRITT, ZUGANG, VERFÜGBARKEIT |

---

## 3. Technische und organisatorische Maßnahmen (TOM)

### 3.1 Zutrittskontrolle (Unbefugten den Zutritt verwehren)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **ZUTRITT-01** | Serverraum im Rechenzentrum (Hetzner Nürnberg); 24/7-Zutrittskontrolle, Videoüberwachung | Alle VT | ✅ Aktiv |
| **ZUTRITT-02** | Biometrische/Transponder-Zugangskontrolle zu Hetzner-Servern | Alle VT | ✅ Aktiv |
| **ZUTRITT-03** | Kein physischer Zugriff durch NeXify-Mitarbeiter (reines IaaS) | Alle VT | ✅ Aktiv |

### 3.2 Zugangskontrolle (Berechtigten den Zugang gewähren)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **ZUGANG-01** | SSH-Key-Authentifizierung (kein Passwort) für Server-Zugriff | VT-01 bis VT-08 | ✅ Aktiv |
| **ZUGANG-02** | Cloudflare Access/Tunnel mit Zero-Trust-Proxy | VT-01, VT-02, VT-04 | ✅ Aktiv |
| **ZUGANG-03** | Rollenbasierte Zugriffssteuerung (Admin, Operator, Viewer) | VT-04 (Hermes WebUI) | ✅ Aktiv |
| **ZUGANG-04** | Fail2ban-Sperre nach 5 Fehlversuchen | Alle VT (SSH-Zugriff) | ✅ Aktiv |
| **ZUGANG-05** | 2FA für Cloudflare-Dashboard und GitHub | VT-01 bis VT-08 | ✅ Aktiv |
| **ZUGANG-06** | JIT (Just-in-Time) Admin-Zugriff nur bei Bedarf | Alle VT | ⚠️ Geplant |

### 3.3 Zugriffskontrolle (Nur autorisierte Aktionen)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **ZUGRIFF-01** | Linux-Dateiberechtigungen (root/service-user Trennung) | Alle VT | ✅ Aktiv |
| **ZUGRIFF-02** | Datenbank-User mit minimalen Rechten (MongoDB, PostgreSQL) | VT-01, VT-05, VT-06 | ✅ Aktiv |
| **ZUGRIFF-03** | Docker-Container-Isolation (eigene Netzwerke pro Service) | Alle VT | ✅ Aktiv |
| **ZUGRIFF-04** | Least-Privilege-Prinzip für Agent-API-Zugriff | VT-01 bis VT-08 | ✅ Aktiv |

### 3.4 Weitergabekontrolle (Vertraulichkeit bei Übertragung)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **WEITERGABE-01** | TLS 1.3 für alle externen Kommunikationen (HTTPS) | Alle VT | ✅ Aktiv |
| **WEITERGABE-02** | Cloudflare-Tunnel (kein öffentlicher Port) für interne Dienste | VT-01, VT-02, VT-04 | ✅ Aktiv |
| **WEITERGABE-03** | VPN (WireGuard) für Admin-Zugriff | VT-05 | ✅ Aktiv |
| **WEITERGABE-04** | Keine Datenweitergabe an Dritte außer vertraglich AVV-gesichert | Alle VT | ✅ Aktiv |
| **WEITERGABE-05** | Prompt-Filterung: Keine PII in LLM-Anfragen (DeepSeek, OpenRouter) | VT-04 | ✅ Aktiv |

### 3.5 Eingabekontrolle (Dokumentation der Verarbeitung)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **EINGABE-01** | Audit-Logging aller Admin-Aktionen (> /var/log/auth.log) | VT-05, VT-06 | ✅ Aktiv |
| **EINGABE-02** | Agent-Aktions-Log (Wer, Was, Wann) in Brain/agentmemory | VT-03 | ✅ Aktiv |
| **EINGABE-03** | MongoDB-Log-Level: alle Queries geloggt (Performance Mode) | Alle VT mit MongoDB | ✅ Aktiv |
| **EINGABE-04** | Git-Historie für alle Code- und Config-Änderungen | VT-01 bis VT-08 | ✅ Aktiv |

### 3.6 Verfügbarkeitskontrolle (Schutz vor Verlust/Unterbrechung)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **VERFÜGBARKEIT-01** | Stündliche MongoDB-Dumps (mindestens 7 Tage Retention) | VT-01, VT-03, VT-05, VT-06 | ✅ Aktiv |
| **VERFÜGBARKEIT-02** | Qdrant-Snapshots (stündlich, 24h Retention) | VT-01, VT-02, VT-07 | ✅ Aktiv |
| **VERFÜGBARKEIT-03** | Brain-API-Snapshot (Brain-First-Policy-Konfiguration) | VT-01 | ✅ Aktiv |
| **VERFÜGBARKEIT-04** | Docker-Compose-File als "Infrastructure as Code" (Sofort-Deployment) | Alle VT | ✅ Aktiv |
| **VERFÜGBARKEIT-05** | 3-2-1-Backup-Regel: 3 Kopien, 2 Medien, 1 Offsite | Alle VT | ✅ Aktiv |
| **VERFÜGBARKEIT-06** | Monitoring: Prometheus + Alertmanager (13 Alert-Regeln) | Alle VT | ✅ Aktiv |
| **VERFÜGBARKEIT-07** | RTO: 1h-8h je nach System (siehe BCM-Runbook) | Alle VT | ✅ Aktiv |

### 3.7 Trennungsgebot (Getrennte Verarbeitung)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **TRENNUNG-01** | Kundenprojekt-Isolation: Separate Docker-Netzwerke für Bookando, Studienkolleg, VSK | VT-05 | ✅ Aktiv |
| **TRENNUNG-02** | Datenbank-Isolation: Separate MongoDB-Datenbanken pro Projekt | VT-05 | ✅ Aktiv |
| **TRENNUNG-03** | CUSTOMER_PROJECT_ISOLATION_POLICY (CLAUDE.md, 04_register/) | VT-05 | ✅ Aktiv |
| **TRENNUNG-04** | Kein Agent-übergreifender Zugriff auf Kundendaten | VT-05 | ✅ Aktiv |
| **TRENNUNG-05** | System/Betrieb vs. Produktion vs. Kunde getrennte Netzwerksegmente | Alle VT | ✅ Aktiv |

### 3.8 Datenintegrität (Schutz vor Manipulation)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **INTEGRITÄT-01** | Hash-basierte Integritätsprüfung für Backups (SHA256) | VT-01, VT-02, VT-05, VT-07 | ✅ Aktiv |
| **INTEGRITÄT-02** | MongoDB-Replikation mit Write-Consern "majority" | VT-01, VT-05 | ✅ Aktiv |
| **INTEGRITÄT-03** | Qdrant-Replikation (2 Replicas pro Shard) | VT-07 | ✅ Aktiv |
| **INTEGRITÄT-04** | Container-Read-Only-Filesystem wo möglich | Alle VT | ⚠️ Geplant |

### 3.9 Auftragskontrolle (Weisungsgebundene Verarbeitung)

| Maßnahme | Beschreibung | VT-Anwendung | Status |
|---|---|---|---|
| **AUFTRAG-01** | AVV mit allen Auftragsverarbeitern (siehe Lieferantenregister) | Alle VT | ⚠️ Siehe Maßnahmenplan |
| **AUFTRAG-02** | Jährliche AVV-Prüfung und Aktualisierung | Alle VT | ✅ Aktiv |
| **AUFTRAG-03** | Keine Unterbeauftragung ohne Zustimmung | Alle VT | ✅ Aktiv |
| **AUFTRAG-04** | Weisungsbefugnis des Verantwortlichen dokumentiert | Alle VT | ✅ Aktiv |

---

## 4. TOM-Zuordnungsmatrix

| TOM-Kategorie | VT-01 Brain | VT-02 RAGFlow | VT-03 AgentLog | VT-04 Chat | VT-05 KDaten | VT-06 Betrieb | VT-07 Qdrant | VT-08 Amemory |
|---|---|---|---|---|---|---|---|---|
| Zutritt | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Zugang | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Zugriff | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Weitergabe | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Eingabe | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Verfügbarkeit | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Trennung | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Integrität | ✅ | ✅ | — | — | ✅ | — | ✅ | — |
| Auftrag | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. AVV-Bezug

| Auftragsverarbeiter | VT-Bezug | AVV-Status | Letzte Prüfung |
|---|---|---|---|
| **Hetzner Online GmbH** | VT-01 bis VT-08 (Hosting aller Systeme) | ✅ AVV vorhanden | 2026-06 |
| **Cloudflare Inc.** | VT-01, VT-02, VT-04, VT-05 (Tunnel-Transit) | ✅ AVV vorhanden + SCC | 2026-06 |
| **Vercel Inc.** | VT-04 (WebUI) | ✅ AVV vorhanden + SCC | 2026-06 |
| **GitHub Inc.** | VT-01 bis VT-08 (Quellcode-Verwaltung) | ⚠️ AVV in Verhandlung | 2026-06 |
| **Resend Inc.** | VT-05 (E-Mail-Versand) | ✅ AVV vorhanden + SCC | 2026-06 |
| **Supabase Inc.** | VT-05 (Auth, Storage) | ✅ AVV vorhanden | 2026-06 |
| **DeepSeek** | VT-04 (LLM-API via 9Router) | ❌ Kein AVV | 2026-06 |
| **OpenRouter** | VT-04 (LLM-Fallback) | ⚠️ Kein dediziertes DPA | 2026-06 |

---

## 6. Verantwortungsverteilung

| Rolle | Verantwortung |
|---|---|
| **Verantwortlicher (Controller)** | Pascal Courbois, NeXify AI (Einzelunternehmen) |
| **Datenschutzbeauftragter** | Philipp Gros (extern, bestellt) |
| **Auftragsverarbeiter** | Hetzner, Cloudflare, Vercel, GitHub, Resend, Supabase |
| **Verantwortlichkeiten bei DeepSeek/OpenRouter** | Keine klare AVV-Regelung — Risiko! |
| **Stand der Verarbeitungsverzeichnisse** | Dieses Dokument + PRIVACY_POLICY_INTERNAL.md |

---

## 7. Metadaten

| Attribut | Wert |
|---|---|
| Erstellungsdatum | 2026-06-23 |
| Nächstes TOM-Review | 2026-12-23 |
| Anzahl VT | 8 |
| Anzahl TOM-Einzelmaßnahmen | 30 |
| Umsetzungsgrad | 28/30 ✅ (2 geplant) |
| Verantwortlich | DSB (Philipp Gros) |
| Letzte Aktualisierung | 2026-06-23 |
