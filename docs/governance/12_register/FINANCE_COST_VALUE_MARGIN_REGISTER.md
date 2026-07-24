# Finance/Cost/Value-Margin-Register

**Stand:** 2026-06-23 | **Status:** AKTIV  
**Owner:** Systemmaster / NeXify AI  
**Version:** 1.0.0  
**Task:** P0-LUECKE-010

---

## 1. Zweck

Dieses Register dokumentiert alle Kosten, Wertschöpfung und Margen
des NeXify AI Systems für Transparenz und Steuerung.

---

## 2. Kostenstruktur

### 2.1 Infrastruktur-Kosten

| Kostenpunkt | Beschreibung | Monatlich | Jährlich | Status |
|-------------|-------------|-----------|----------|--------|
| Cloudflare | Tunnel + CDN | ~0€ | ~0€ | ✅ Free Tier |
| Hostinger | Server-Hosting | ~10€ | ~120€ | ✅ Aktiv |
| Domain | nexifyai.cloud | ~15€ | ~180€ | ✅ Aktiv |
| **Summe Infra** | | **~25€** | **~300€** | |

### 2.2 Service-Kosten

| Service | Beschreibung | Monatlich | Jährlich | Status |
|---------|-------------|-----------|----------|--------|
| Brain API | Lokaler Server | 0€ | 0€ | ✅ Self-hosted |
| MongoDB | Lokaler Server | 0€ | 0€ | ✅ Self-hosted |
| Qdrant | Lokaler Server | 0€ | 0€ | ✅ Self-hosted |
| 9Router | DeepSeek API | ~50€ | ~600€ | ✅ Aktiv |
| **Summe Service** | | **~50€** | **~600€** | |

### 2.3 Gesamt-Kosten

| Kategorie | Monatlich | Jährlich |
|-----------|-----------|----------|
| Infrastruktur | ~25€ | ~300€ |
| Services | ~50€ | ~600€ |
| **Gesamt** | **~75€** | **~900€** |

---

## 3. Wertschöpfung

### 3.1 KI-Beratung

| Leistung | Beschreibung | Stundensatz | Geschätzter Umsatz |
|----------|-------------|-------------|-------------------|
| Strategische Beratung | KI-Strategie, Roadmap | 150€/h | 3.000€/Monat |
| Technische Beratung | Implementierung, Integration | 120€/h | 2.400€/Monat |
| Schulung | Workshops, Training | 200€/h | 1.000€/Monat |
| **Summe** | | | **6.400€/Monat** |

### 3.2 Plattform-Services

| Service | Beschreibung | Preis | Geschätzter Umsatz |
|---------|-------------|-------|-------------------|
| NeXify AI OS | Agent-Orchestrierung | 500€/Monat | 2.500€/Monat |
| Brain-as-a-Service | Wissensmanagement | 300€/Monat | 1.500€/Monat |
| Compliance-Check | Audit & Dokumentation | 200€/Monat | 1.000€/Monat |
| **Summe** | | | **5.000€/Monat** |

### 3.3 Gesamt-Wertschöpfung

| Kategorie | Monatlich | Jährlich |
|-----------|-----------|----------|
| KI-Beratung | 6.400€ | 76.800€ |
| Plattform-Services | 5.000€ | 60.000€ |
| **Gesamt** | **11.400€** | **136.800€** |

---

## 4. Marge

### 4.1 Deckungsbeitrag

| Kennzahl | Monatlich | Jährlich |
|----------|-----------|----------|
| Umsatz | 11.400€ | 136.800€ |
| Kosten | 75€ | 900€ |
| **Deckungsbeitrag** | **11.325€** | **135.900€** |
| **Marge** | **99.3%** | **99.3%** |

### 4.2 Break-Even

- Break-Even bei 1 Kunde/Monat
- Skalierbarkeit: 10+ Kunden ohne signifikante Kostensteigerung

---

## 5. Investitionen

### 5.1 Geplante Investitionen

| Investition | Beschreibung | Kosten | ROI-Zeit |
|-------------|-------------|--------|----------|
| MCP-Integration | Hostinger, Stripe, etc. | ~500€ | 3 Monate |
| Marketing | Website, Content | ~1.000€ | 6 Monate |
| **Summe** | | **~1.500€** | |

### 5.2 ROI-Kalkulation

- Investition: 1.500€
- Monatlicher Mehrumsatz: 2.000€ (geschätzt)
- ROI-Zeit: 1 Monat

---

## 6. KPI

| KPI | Beschreibung | Ziel | Ist | Status |
|-----|-------------|------|-----|--------|
| Customer Acquisition Cost | Kosten pro Kunde | < 500€ | 🟡 Messung | 🟡 |
| Customer Lifetime Value | Wert pro Kunde | > 5.000€ | 🟡 Messung | 🟡 |
| Monthly Recurring Revenue | Wiederkehrender Umsatz | > 5.000€ | 🟡 Messung | 🟡 |
| Churn Rate | Kundenverlust | < 5% | 🟡 Messung | 🟡 |

---

## 7. Quellen

| Quelle | Beschreibung | Status |
|--------|-------------|--------|
| KOSTENOPTIMIERUNG_V1.md | Kostenoptimierung | ✅ Vorhanden |
| MA-007 | Finance-Register | 🟡 Zu prüfen |
| MA-008 | Cost-Register | 🟡 Zu prüfen |
| MA-009 | Value-Margin-Register | 🟡 Zu prüfen |

---

---

## 6. Circuit Breaker (§12 Charta)

### 6.1 Cost-Brake Thresholds (LLM-Kosten)

| Level | Budget-Auslastung | Maßnahme |
|-------|------------------|----------|
| Grün | <50% | Normalbetrieb |
| Gelb | 50-80% | Cost-Warning an Event-Bus |
| Orange | 80-100% | Fallback auf günstigeres Modell (DeepSeek) |
| Rot | 100-150% | Task auf P2 herabstufen, Prüfung optional |
| **Kritisch** | **>150%** | **Task-Abbruch** |
| **P0** | **>200%** | **P0-Escalation an CEO** |

### 6.2 Iterationsgrenzen (pro Zyklus)

| Limit | Wert | Maßnahme bei Überschreitung |
|-------|------|----------------------------|
| Datei-Änderungen | 50 | Automatischer Commit-Zwang |
| Deviatonen/Zyklus | 20 | Pausieren, Report-Generierung |
| Zyklen/Tag | 24 | 12h Cooldown (siehe §12) |
| Stunden ohne Commit | 4 | Zwangs-Commit mit Status-Report |

### 6.3 Charta-Governance

- Diese Schwellen sind **nicht durch den Agenten änderbar** (§12 Abs. 2)
- Umsetzung auf Gateway-/Infrastrukturebene erforderlich
- Siehe: `GOVERNANCE.md §8` (Incident-Response / §12 Circuit Breaker)

---

*Erstellt: 2026-06-23 | Systemmaster Agent | NeXify AI OS*
*Aktualisiert: 2026-07-24 | §12 Cost-Brake integriert (Zyklus 2/3)*
