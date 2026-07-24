# PRIVACY_POLICY_INTERNAL — Interne Datenschutz-Richtlinie

| Feld | Wert |
|------|------|
| **Dokumenttyp** | Policy (ISO 27701:2019, DSGVO) |
| **Version** | 1.0 |
| **Stand** | 23.06.2026 |
| **Nächste Prüfung** | 23.06.2027 |
| **Verantwortlich** | Datenschutzbeauftragter (Pascal) |
| **Geltungsbereich** | NeXify AI — gesamte Datenverarbeitung |

---

## 1. Geltungsbereich

Diese interne Richtlinie gilt für alle personenbezogenen Daten, die NeXify AI verarbeitet:

- **Kundendaten** (Projektdaten, Brain-Inhalte, Logs)
- **Betriebsdaten** (Monitoring-Logs, IP-Adressen, Zugriffsdaten)
- **Mitarbeiterdaten** (Kommunikation, Zugriffsrechte)
- **Agenten-Daten** (Prompts, Outputs, Interaktionsdaten)

Referenz: ISO/IEC 27701:2019 (PIMS), DSGVO, BDSG-neu, TTDSG.

---

## 2. Rollen und Verantwortlichkeiten

| Rolle | DSGVO-Begriff | Person/Instanz |
|-------|--------------|----------------|
| **Verantwortlicher** | Art. 4 Nr. 7 DSGVO | Pascal (Geschäftsführung NeXify) |
| **Datenschutzbeauftragter** | Art. 37 DSGVO | Pascal (externe DSB-Beauftragung optional) |
| **Auftragsverarbeiter (AV)** | Art. 28 DSGVO | Cloudflare, Vercel, Hetzner, GitHub, DeepSeek, OpenAI (per API), Qdrant Cloud |
| **Berechtigte interne Personen** | — | Pascal, ggf. Sub-AV |

---

## 3. Verzeichnis von Verarbeitungstätigkeiten (VT)

Das VT-Verzeichnis (Art. 30 DSGVO) wird geführt und enthält zu jeder Verarbeitung:

| Verarbeitung | Zweck | Datenkategorien | Empfänger | Löschfrist |
|-------------|-------|----------------|-----------|------------|
| **Brain-Speicher** | Wissensbasis für Agenten | Projektdokumente, anonymisiert | Vektordatenbank | 12 Monate / Kundenende |
| **Agenten-Interaktion** | Auftragsbearbeitung | Prompts, Outputs | LLM-Provider (9Router) | Keine Speicherung |
| **Monitoring** | Betriebsstabilität | IP, Timestamp, Action-Log | VPS (Hetzner) | 12 Monate |
| **GitHub** | Code-Entwicklung, CI/CD | Code, Commit-Meta | GitHub Inc. | Projektlebensdauer |
| **RAGFlow** | Dokumenten-RAG | Kundendokumente | VPS (Hetzner) | 12 Monate / Projektende |
| **Kundenkommunikation** | Projektabwicklung | Name, E-Mail, Firma | E-Mail, Dashboard | 36 Monate nach Projektende |

---

## 4. Auftragsverarbeitungs-Matrix (AVV-Matrix)

| AV | Verarbeitung | Standort | AVV abgeschlossen? | Datenkategorien |
|----|-------------|----------|-------------------|----------------|
| **Hetzner** | VPS-Hosting, Storage | DE/FIN | ✅ Standard-AVV | Betriebsdaten, Brain |
| **Cloudflare** | CDN, Tunnel, DDoS | Global (EU-Standard) | ✅ Standard-AVV | Metadaten, IPs |
| **GitHub** | Code-Repository | USA (SCC) | ✅ SCC | Code, CI/CD-Logs |
| **DeepSeek** | LLM-API | China / Drittland | ⚠️ Prüfung erforderlich | Prompts (keine PII) |
| **OpenAI** | LLM-API (9Router-Fallback) | USA (SCC) | ✅ SCC (via Platform) | Prompts (keine PII) |
| **Vercel** | WebUI-Hosting | USA (SCC) | ✅ Standard-AVV | Web-Logs, Session |
| **Qdrant Cloud** | Vektor-DB (falls SaaS) | EU | Prüfung erforderlich | Embeddings, Chunks |

Alle AVV-Dokumente in `10_evidence/avv/`.

---

## 5. Betroffenenrechte-Prozess (Art. 15–22 DSGVO)

| Recht | Frist | Prozess | Verantwortlich |
|-------|-------|---------|---------------|
| **Auskunft (Art. 15)** | 1 Monat | Anfrage via E-Mail → Brain-Lookup → Antwort | Pascal |
| **Berichtigung (Art. 16)** | 1 Monat | Anfrage → Datenkorrektur in Brain/System | Pascal |
| **Löschung (Art. 17)** | 1 Monat | Anfrage → Löschung aus allen Systemen | Pascal |
| **Einschränkung (Art. 18)** | 1 Monat | Anfrage → Sperrlogik aktivieren | Pascal |
| **Datenübertragbarkeit (Art. 20)** | 1 Monat | Anfrage → Export im maschinenlesbaren Format | Pascal |
| **Widerspruch (Art. 21)** | 1 Monat | Anfrage → Prüfung, ggf. Beendigung der Verarbeitung | Pascal |

Kontakt: datenschutz@nexifyai.cloud

---

## 6. Löschkonzept

| Datenkategorie | Standard-Löschfrist | Automatisierung | Verantwortlich |
|----------------|--------------------|-----------------|---------------|
| **Kundenprojekt-Daten (Brain)** | 12 Monate nach Projektende | Manueller Cleanup | Pascal |
| **Agenten-Logs** | 12 Monate | Rotation (Log-Rotate) | System |
| **Monitoring-Logs (Grafana)** | 6 Monate | Retro Retention | System |
| **GitHub-Snippets** | Projektlebensdauer | Manuell | Pascal |
| **Kundenkommunikation (E-Mail)** | 36 Monate nach letztem Kontakt | Manuell | Pascal |
| **Externe LLM-Provider** | Keine Speicherung (No-Retention) | API-Config | System |

Nach Ablauf: Sicheres Löschen (shred/DB-Drop), Bestätigung im Löschprotokoll.

---

## 7. Datenschutz-Folgenabschätzung (DPA)

Eine DPA ist erforderlich bei:

- Verarbeitung besonderer Kategorien (Art. 9 DSGVO) — **nicht anwendbar**
- Automatisierte Entscheidungen mit Rechtswirkung — **nicht anwendbar**
- Umfassende Überwachung öffentlich zugänglicher Bereiche — **nicht anwendbar**
- Potenziell hohes Risiko für Betroffene durch Agenten-Entscheidungen — **geprüft, aktuell nicht erforderlich**

DPA-Dokumente in `10_evidence/dpa/`.

---

## 8. Datenschutz bei KI-Agenten

Spezifische Regelungen für KI-Systeme:

| Anforderung | Umsetzung |
|-------------|-----------|
| **PII-Filter** | Automatische PII-Erkennung vor Agenten-Output |
| **Keine PII an Modelle** | Prompts werden vor Versand an LLM anonymisiert (keine Namen, E-Mails, Adressen) |
| **Transparenz** | Kunden erhalten Hinweis auf KI-Verarbeitung (Art. 13/14 DSGVO) |
| **Datenminimierung** | Agenten erhalten nur die für die Aufgabe notwendigen Daten |
| **Kein Profiling** | Keine automatisierte Profilbildung zu natürlichen Personen |

---

## 9. Datenschutz-Vorfälle (Art. 33/34 DSGVO)

| Schritt | Beschreibung | Frist |
|---------|-------------|-------|
| **1. Erkennung** | Automatischer Security- oder manueller Hinweis | Sofort |
| **2. Erstbewertung** | Ist ein Personenbezug wahrscheinlich? | 24 h |
| **3. Meldung an Aufsichtsbehörde** | Bei Risiko für Betroffene | 72 h |
| **4. Benachrichtigung Betroffene** | Bei hohem Risiko | Unverzüglich |
| **5. Dokumentation** | Vollständige Incident-Dokumentation | 1 Woche |

Meldeadresse: datenschutz@nexifyai.cloud

---

## 10. Verweise

| Dokument | Pfad |
|----------|------|
| Security Policy | `SECURITY_POLICY.md` |
| AI Governance Policy | `AI_GOVERNANCE_POLICY.md` |
| Normenregister | `NORMENREGISTER.md` |
| CONTROL_CATALOG | `CONTROL_CATALOG.yaml` |
| AVV-Dokumente | `10_evidence/avv/` |
| DPA-Dokumente | `10_evidence/dpa/` |

---

*Ende der PRIVACY_POLICY_INTERNAL*
