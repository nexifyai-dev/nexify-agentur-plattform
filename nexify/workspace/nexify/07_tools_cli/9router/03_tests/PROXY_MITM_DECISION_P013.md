# Proxy / MITM Decision — P0-013

**Stand:** 2026-06-12
**Status:** Entscheidung (final)
**Version:** 1.0

---

## 1. Entscheidung

| Feature | Default | Status |
|---------|---------|--------|
| **MITM (Man-in-the-Middle)** | **AUS** | Dauerhaft deaktiviert |
| **Proxy-Pools** | **Leer** | Keine Eintrage bis Bedarf nachgewiesen |
| **Network-Proxy** | **Kein** | Nur bei dokumentiertem Bedarf aktivieren |

---

## 2. Begrundung

### 2.1 MITM — AUS

| Grund | Detail |
|-------|--------|
| **Sicherheit** | MITM wurde bedeuten, dass 9Router TLS-Verbindungen terminiert und neu aufbaut. Das erzeugt eine zentrale Angriffsflache: ein kompromittierter 9Router konnte alle API-Traffic-Mitschriften entschlusseln. |
| **ToS-Verstoss** | Die meisten AI-Provider (DeepSeek, OpenAI, Anthropic, OpenRouter) verbieten in ihren AGB das Abfangen/Analysieren von API-Traffic durch Dritte. Ein Proxy/MITM zwischen 9Router und Upstream-Provider wurde gegen diese AGB verstossen. |
| **Debugging-Wert** | Der Nutzen fur Debugging (Request/Response-Logs) ist geringer als das Risiko. 9Router loggt bereits non-Payload-Metadaten (Status, Latenz, Token-Count), die fur 95% aller Debugging-Falle ausreichen. |
| **Wartungsaufwand** | MITM-Proxy erfordert Zertifikatsmanagement, regelmassige Updates und zusatzliche Monitoring-Infrastruktur. |

### 2.2 Proxy-Pools — Leer

| Grund | Detail |
|-------|--------|
| **Kein Bedarf** | Aktuell werden alle Provider direkt uber ihre API-Endpunkte erreicht. Kein Provider verlangt einen Proxy. |
| **Rotating Proxies** | Fur Web-Scraping oder API-Aggregation nutzlich, aber 9Router routed nur zu bekannten AI-APIs. Kein Scraping. |
| **Aktivierung nur bei Bedarf** | Wenn ein Provider kunftig nur noch aus bestimmten Regionen erreichbar ist ODER ein Kunde einen dedizierten Egress-Proxy verlangt, kann ein Proxy-Pool fur *diesen spezifischen* Provider angelegt werden. Kein Global-Proxy. |

### 2.3 Network-Proxy — Nur bei Bedarf

| Grund | Detail |
|-------|--------|
| **Transparenz** | Ein HTTP- oder SOCKS5-Proxy zwischen 9Router und Upstream-Provider wurde die Ende-zu-Ende-Verschlusselung aufheben. |
| **Ausnahme** | Sollte ein Provider kunftig nur noch uber einen bestimmten Proxy erreichbar sein (z.B. Enterprise-Support verlangt dedizierten Egress), kann ein Network-Proxy fur *diesen einen* Provider konfiguriert werden. |
| **Dokumentationspflicht** | Jede Proxy-Aktivierung muss dokumentiert werden: Grund, Provider, Proxy-Betreiber, Sicherheitsimplikationen. |

---

## 3. Zustandigkeitsmatrix

| Feature | Wer darf aktivieren? | Voraussetzung |
|---------|---------------------|---------------|
| MITM | Niemand | Dauerhaft deaktiviert |
| Proxy-Pool-Eintrag | Security Engineer + DevOps | Dokumentierter Bedarf, Genehmigung |
| Network-Proxy | Security Engineer + DevOps | Dokumentierter Bedarf, Genehmigung |

---

## 4. Ausnahmeregelung

Sollte kunftig ein begrundeter Bedarf fur MITM oder Proxy entstehen:

1. **Schriftlicher Antrag** mit:
   - Konkretem Anwendungsfall
   - Betroffenem Provider / Service
   - Sicherheitsbewertung
   - Alternativprufung (gibt es einen Weg ohne MITM?)
2. **Genehmigung** durch Security Engineer + CTO
3. **Dokumentation** in diesem Decision-Doc (neue Version)
4. **Zeitliche Befristung** (max. 30 Tage, verlangbar)
5. **Rollback-Plan** muss vor Aktivierung vorliegen

---

## 5. Alternativen zu MITM

| Anwendungsfall | Alternative |
|---------------|-------------|
| Debugging Request/Response | 9Router-Logs (Metadaten) + Provider-Dashboard |
| Traffic-Analyse (Rate, Latenz, Fehler) | Bestehendes 9Router-Monitoring (Health-Checks, Metriken) |
| Payload-Inspektion | Lokales Logging auf Agent-Ebene (Claude Code / Goose) |
| Content-Filter / Moderation | Provider-seitig (DeepSeek, OpenAI haben eigene Filter) |

---

**Entscheidung getroffen von:** NeXify Security Engineering
**Datum:** 2026-06-12
**Nachstes Review:** 2026-09-12
