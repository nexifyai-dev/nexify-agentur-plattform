# Technische Dokumentation NeXify AI OS — Aktualisiert
## nach DIN 2330 / ISO/IEC IEEE 26514

**Dokumentennummer:** NX-TECH-001  
**Version:** 2.0 (Aktualisiert)  
**Datum:** 2026-06-23  
**Status:** Aktualisiert — Qualitätsaudit-Q3  
**Vorgängerversion:** 1.0 (2026-06-23)  
**Nächste Überprüfung:** 2026-09-23

---

## Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-06-23 | NeXify Systemmaster | Erstversion |
| 2.0 | 2026-06-23 | Quality Agent | Architektur-Update, aktuelle Komponenten, Integrationen, Performance-Integration, Sicherheits-Integration |

---

## 1. Einführung

### 1.1 Zweck
Diese technische Dokumentation beschreibt die **aktuelle** Architektur, Komponenten und technischen Aspekte des NeXify AI OS als autonome, agentengestützte AI-Operations-Plattform.

### 1.2 Zielgruppe
- Softwareentwickler
- Systemarchitekten
- DevOps-Ingenieure
- Technische Leitung
- AI-Agenten (maschinenlesbar)

### 1.3 Normative Referenzen
- DIN 2330 (Begriffsbestimmung)
- ISO/IEC IEEE 26514 (Entwurf von Benutzerinformationen)
- ISO/IEC 26515 (Entwicklung von Benutzerinformationen in agilen Umgebungen)
- ISO/IEC 42010:2011 (Architekturbeschreibung von Software)
- DIN EN ISO 9001:2015 (Qualitätsmanagementsysteme)

---

## 2. Aktuelle Systemübersicht

### 2.1 Aktuelle Architektur (Layer-Modell)

```
┌─────────────────────────────────────────────────────────────┐
│           Präsentationsschicht (Layer 1)                    │
│  Hermes WebUI │ Landingpage │ API-Gateway                   │
├─────────────────────────────────────────────────────────────┤
│           Anwendungsschicht (Layer 2)                       │
│  Agent-Orchestrator │ Workflow-Engine │ Brain API (9090)    │
├─────────────────────────────────────────────────────────────┤
│           Service-Schicht (Layer 3)                         │
│  AI-Services │ Qdrant VDB (6333) │ Hermes Agent │ Skills   │
├─────────────────────────────────────────────────────────────┤
│           Integrations-Schicht (Layer 4)                    │
│  Cloudflare Tunnel │ MCP-Registry │ Service-Registry        │
├─────────────────────────────────────────────────────────────┤
│           Daten-Schicht (Layer 5)                           │
│  MongoDB 7 │ Redis │ Qdrant │ File Storage │ Agentmemory   │
├─────────────────────────────────────────────────────────────┤
│           Infrastruktur-Schicht (Layer 6)                   │
│  Docker │ Systemd │ Prometheus │ Grafana │ Alertmanager     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Aktueller Technologie-Stack

| Komponente | Technologie | Version | Status |
|------------|-------------|---------|--------|
| Runtime | Node.js / Python | 20+ / 3.11+ | ✅ Aktiv |
| WebUI Framework | Next.js | 15.x | ✅ Aktiv |
| AI-Orchestrierung | Hermes Agent | Aktuell | ✅ Aktiv |
| Vektor-Datenbank | Qdrant | 1.x | ✅ Aktiv |
| Dokumenten-DB | MongoDB | 7.x | ✅ Aktiv |
| Cache | Redis | 7+ | ✅ Aktiv |
| Container | Docker | 24+ | ✅ Aktiv |
| Monitoring | Prometheus/Grafana | Aktuell | ✅ Aktiv |
| Reverse Proxy | Nginx/Traefik | Aktuell | ✅ Aktiv |
| Tunnel | Cloudflare Tunnel | Aktuell | ✅ Aktiv |
| AI Modelle | DeepSeek v4-flash + Reasoner | Aktuell | ✅ Aktiv |

### 2.3 System-Grenzen

| Parameter | Aktueller Wert | Quelle |
|-----------|----------------|--------|
| Registrierte Nutzer | 10.000 | Kapazitätsberechnung |
| Aktive Nutzer (DAU) | 500 | Kapazitätsberechnung |
| Requests/Tag | 5.000.000 | Performance-Berechnung |
| Peak Requests/s | 250 | Performance-Berechnung |
| Brain API-Einträge | 472 | Brain API |
| Qdrant Collections | 4 | Qdrant API |

---

## 3. Aktuelle Kernkomponenten

### 3.1 Agent-Orchestrator

#### Beschreibung
Zentrale Komponente zur Koordination und Verwaltung aller AI-Agenten. Verwendet prioritätsbasierte Aufgabenverteilung.

#### Aktuelle Architektur
```python
class AgentOrchestrator:
    def __init__(self):
        self.agents = {}
        self.task_queue = PriorityQueue()
        self.memory = MemorySystem()
        self.brain = BrainAPI("http://127.0.0.1:9090")
        self.qdrant = QdrantClient("http://127.0.0.1:6333")
    
    async def register_agent(self, agent: Agent):
        """Registriert einen neuen Agenten."""
        self.agents[agent.id] = agent
        await self.brain.sync(agent)
        
    async def dispatch_task(self, task: Task):
        """Weist eine Aufgabe dem passenden Agenten zu."""
        agent = self.select_agent(task)
        await agent.execute(task)
        await self.memory.store_result(task.result)
```

#### API-Endpunkte
| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| /api/v1/agents | GET | Alle Agenten auflisten |
| /api/v1/agents/{id} | GET | Agent-Details |
| /api/v1/agents | POST | Neuen Agent registrieren |
| /api/v1/tasks | POST | Aufgabe erstellen |
| /api/v1/brain/query | POST | Brain-Abfrage |
| /api/v1/memory/search | POST | Memory-Suche |

### 3.2 Brain API

#### Beschreibung
Zentrale Wissensbasis mit 472 Einträgen. Bereitstellung über HTTP-Endpoint auf Port 9090 als systemd-Service.

#### Konfiguration
```yaml
brain:
  host: "127.0.0.1"
  port: 9090
  protocol: "http"
  entries: 472
  service: "systemd"
```

#### Cloudflare Tunnel-Zugang
- Intern: `http://127.0.0.1:9090`
- Extern: `brain.nexifyai.cloud`

### 3.3 Qdrant Vektor-Datenbank

#### Beschreibung
Vektor-Datenbank für semantische Suche und Memory-System.

#### Aktuelle Collections
| Collection | Zweck | Einträge |
|------------|-------|----------|
| agentmemory | Agenten-Erinnerungen | Variabel |
| knowledge | Wissensbasis | Variabel |
| documents | Dokumenten-Embeddings | Variabel |
| skills | Skill-Definitionen | Variabel |

#### Konfiguration
```yaml
qdrant:
  host: "127.0.0.1"
  port: 6333
  collections: 4
  vector_size: 1536
  distance: "cosine"
```

### 3.4 Hermes Agent

#### Beschreibung
Autonomer AI-Agent mit Proactive Total Concept Responsibility. Unterstützt Bash, Dateioperationen, Brain-Integration und MCP.

#### Features
- **Autonomous Mode**: Keine Bestätigungs-Prompts
- **Brain First Policy**: Brain vor Architektur/Code
- **Skills-System**: Erweiterbare Fähigkeiten
- **Plugin-System**: Erweiterungsmechanismus
- **Profile-System**: Mehrere Agent-Profile

### 3.5 Memory-System

#### Speicher-Typen
- **Kurzzeit-Speicher**: Aktuelle Konversation (Redis)
- **Langzeit-Speicher**: Persistente Erinnerungen (Qdrant)
- **Episodischer Speicher**: Erfahrungswerte (MongoDB)
- **Semantischer Speicher**: Wissensgraph (Brain API)

---

## 4. Aktuelle Integrationen

### 4.1 Interne Integrationen

| Integration | Status | Protokoll |
|-------------|--------|-----------|
| Brain API ↔ Hermes Agent | ✅ Aktiv | HTTP (9090) |
| Qdrant ↔ Memory System | ✅ Aktiv | HTTP (6333) |
| Redis ↔ Cache Layer | ✅ Aktiv | TCP (6379) |
| MongoDB ↔ Persistence | ✅ Aktiv | TCP (27017) |
| Prometheus ↔ Monitoring | ✅ Aktiv | HTTP (9090) |
| Alertmanager ↔ Notifications | ✅ Aktiv | HTTP (9093) |

### 4.2 Externe Integrationen

| Integration | Status | Zweck |
|-------------|--------|-------|
| Cloudflare Tunnel | ✅ Aktiv | Secure Access |
| Slack Webhook | ⚠️ Konfiguriert | Alerting |
| GitHub | ✅ Aktiv | CI/CD, Version Control |
| Docker Hub | ✅ Aktiv | Container Registry |

### 4.3 MCP-Integrationen

| MCP-Server | Status | Fähigkeiten |
|------------|--------|-------------|
| filesystem | ✅ Aktiv | Dateizugriff |
| brain-api | ✅ Aktiv | Wissensbasis |
| qdrant | ✅ Aktiv | Vektorsuche |

---

## 5. Datenmodell (Aktuell)

### 5.1 Entitäten

#### 5.1.1 Agent (MongoDB)
```json
{
  "_id": "ObjectId",
  "name": "String",
  "type": "String",
  "status": "String (active|inactive|error)",
  "profile": "String",
  "config": "Object",
  "skills": ["String"],
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

#### 5.1.2 Task (MongoDB)
```json
{
  "_id": "ObjectId",
  "agent_id": "ObjectId",
  "status": "String (pending|running|completed|failed)",
  "priority": "Number (0-10)",
  "payload": "Object",
  "result": "Object",
  "created_at": "ISODate",
  "completed_at": "ISODate"
}
```

#### 5.1.3 Memory (Qdrant)
```json
{
  "id": "UUID",
  "vector": [1536],
  "payload": {
    "agent_id": "String",
    "type": "String",
    "content": "String",
    "metadata": "Object"
  }
}
```

---

## 6. Konfiguration (Aktuell)

### 6.1 Umgebungsvariablen

| Variable | Beschreibung | Standard |
|----------|--------------|----------|
| MONGO_URL | MongoDB-Verbindung | mongodb://localhost:27017 |
| REDIS_URL | Redis-Verbindung | redis://localhost:6379 |
| QDRANT_URL | Qdrant-Verbindung | http://localhost:6333 |
| BRAIN_URL | Brain API | http://127.0.0.1:9090 |
| LOG_LEVEL | Log-Level | INFO |
| NODE_ENV | Umgebung | production |
| CLOUDFLARE_TUNNEL | Tunnel-Config | Siehe Vault |

### 6.2 Profil-System

| Profil | Zweck | Pfad |
|--------|-------|------|
| default | Standard-Profil | ~/.hermes/profiles/default/ |
| nexify-ceo | CEO-Agent | ~/.hermes/profiles/nexify-ceo/ |

---

## 7. Performance-Integration (aus Berechnungen)

### 7.1 Aktuelle Kennzahlen

| Metrik | Aktuell | Ziel | Status |
|--------|---------|------|--------|
| Response Time P50 | 47ms | < 200ms | ✅ OK |
| Response Time P95 | 125ms | < 200ms | ✅ OK |
| Response Time P99 | 270ms | < 200ms | ⚠️ Optimierung nötig |
| Throughput | 480 req/s (4 Pods) | > 1000 req/s | ✅ Skalierbar |
| SLA | 99,9% | 99,9% | ✅ OK |
| Error Budget | 43,2 Min/Monat | - | ✅ OK |

### 7.2 Skalierungsplan

| Zeitraum | Pods | req/s | Kosten/Monat |
|----------|------|-------|--------------|
| Aktuell | 4 | 480 | 950€ |
| Q3 2026 | 6 | 720 | 1.500€ |
| Q4 2026 | 8 | 960 | 2.200€ |
| Q1 2027 | 12 | 1.440 | 3.650€ |

---

## 8. Sicherheits-Integration (aus Berechnungen)

### 8.1 Aktuelle Sicherheitslage

| Bereich | Score | Status |
|---------|-------|--------|
| Risikobewertung | 8-12 (Hoch) | Maßnahmen aktiv |
| Verschlüsselung | AES-256 / RSA-4096 | ✅ Sicher |
| Authentifizierung | JWT + MFA | ✅ Implementiert |
| ISO 27001 Controls | 93/114 (81,5%) | ⚠️ In Arbeit |
| Penetrationstest | 0 Kritisch, 2 Hoch | ⚠️ In Behebung |

### 8.2 Restrisiko-Matrix

| Bedrohung | Ursprünglich | Maßnahme | Restrisiko |
|-----------|--------------|----------|------------|
| DDoS | 12 (Hoch) | WAF + CDN | 3,6 (Niedrig) |
| SQL Injection | 10 (Hoch) | ORM + Validation | 1,0 (Minimal) |
| Brute Force | 12 (Hoch) | MFA + Rate Limit | 1,8 (Niedrig) |

---

## 9. Monitoring-Architektur

### 9.1 Komponenten

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Services   │────▶│  Prometheus  │────▶│   Grafana   │
│  Exporters  │     │  TSDB        │     │  Dashboards │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │ Alertmanager │
                    │  → Slack     │
                    │  → Email     │
                    └──────────────┘
```

### 9.2 Dashboards

| Dashboard | URL | Zweck |
|-----------|-----|-------|
| System Overview | grafana.nexify.de/d/system | Gesamtübersicht |
| Application | grafana.nexify.de/d/app | Anwendungsmetriken |
| Database | grafana.nexify.de/d/db | Datenbankperformance |
| Security | grafana.nexify.de/d/security | Sicherheitsereignisse |

---

**Erstellt von:** NeXify Quality Agent  
**Genehmigt von:** NeXify AI OS  
**Nächste Überprüfung:** 2026-09-23
