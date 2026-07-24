# ANALYSE 3 — Bisherige Einzelanwendungen identifizieren und integrieren

> **Erstellt**: 2026-06-22  
> **Status**: ANALYSE ABGESCHLOSSEN  
> **Autor**: NeXify Systemmaster Agent

---

## 1. IDENTIFIZIERTE ANWENDUNGEN

### 1.1 /workspace/nexify/ (Workspace-Struktur)

| # | Anwendung/Bereich | Pfad | Status | Beschreibung |
|---|-------------------|------|--------|--------------|
| 1 | **Kanban** | `/workspace/nexify/kanban/` | ✅ Existiert | Task-Registry, E2E-Tests, Migrations, Runbooks |
| 2 | **Memory** | `/workspace/nexify/memory/` | ✅ Existiert | Agenten-Seele, Benutzerprofil, Notizen, Bootstrap |
| 3 | **Security** | `/workspace/nexify/security/` | ✅ Existiert | Secret-Rotation, SSH-Hardening, Trivy-Scans |
| 4 | **Ops** | `/workspace/nexify/ops/` | ✅ Existiert | Supabase-Bootstrap, Hermes-SSH-Setup |
| 5 | **AI OS** | `/workspace/nexify/ai-os/` | ✅ Existiert | Service-Registry, Policies, RAGFlow-Analyse |
| 6 | **Skills** | `/workspace/nexify/05_skills/` | ✅ Existiert | Skill-Definitionen (nexify-knowledge-data-engineer, goose) |
| 7 | **Brain Sync** | `/workspace/nexify/11_brain_sync/` | ✅ Existiert | Brain-Synchronisation |
| 8 | **Agentmemory** | `/workspace/nexify/12_agentmemory/` | ✅ Existiert | Agentenspeicher |
| 9 | **Regelwerke** | `/workspace/nexify/03_regelwerke/` | ✅ Existiert | 403+ kanonisierte Regeln |
| 10 | **Evidence** | `/workspace/nexify/10_evidence/` | ✅ Existiert | Nachweise für alle Bereiche |
| 11 | **Monitoring** | `/workspace/nexify/10_evidence/monitoring/` | ✅ Existiert | Slack-Webhook, Alertmanager |
| 12 | **Backup** | `/workspace/nexify/10_evidence/backup/` | ✅ Existiert | Backup/Restore-Tests |
| 13 | **Design System** | `/workspace/nexify/18_designsystem/` | ✅ Existiert | Graphite Design Tokens |

### 1.2 /workspace/nexifyai-platform/ (Platform)

| # | Anwendung | Pfad | Status | Beschreibung |
|---|-----------|------|--------|--------------|
| 1 | **Landingpage** | `/workspace/nexifyai-platform/frontend/product-landing/` | ✅ Existiert | React+Vite, Landing, Login, Register, Dashboard, Docs, Admin |
| 2 | **Web (Hauptseite)** | `/workspace/nexifyai-platform/apps/web/` | ✅ Existiert | React, AdminCockpit, Prelogin-Komponenten |
| 3 | **Admin Chat** | `/workspace/nexifyai-platform/apps/admin-chat/` | ✅ Existiert | Next.js Admin-Chat-App |
| 4 | **Design Tokens** | `/workspace/nexifyai-platform/apps/design-tokens/` | ✅ Existiert | Design-Token-Definitionen |
| 5 | **AI Fabrik** | `/workspace/nexifyai-platform/packages/ai-farbrik/` | ✅ Existiert | KI-Fabrik-Paket |
| 6 | **Analytics** | `/workspace/nexifyai-platform/packages/analytics/` | ✅ Existiert | Analytics-Paket |
| 7 | **Services API** | `/workspace/nexifyai-platform/services/api/` | ✅ Existiert | API-Server |
| 8 | **Runtime** | `/workspace/nexifyai-platform/services/runtime/` | ✅ Existiert | Workflow-Runtime, Rollback |
| 9 | **Systemmaster** | `/workspace/nexifyai-platform/services/systemmaster/` | ✅ Existiert | Systemmaster-Service |
| 10 | **Automations** | `/workspace/nexifyai-platform/services/automations/` | ✅ Existiert | Cron-Jobs, Brain-Sync |

### 1.3 /workspace/hermes-paperclip-adapter/

| # | Anwendung | Pfad | Status | Beschreibung |
|---|-----------|------|--------|--------------|
| 1 | **Paperclip Adapter** | `/workspace/hermes-paperclip-adapter/` | ✅ Existiert | Hermes-Agent-Adapter für Paperclip AI |

### 1.4 Laufende Services (aus Service Registry)

| # | Service | Port | Status | WebUI-Integration |
|---|---------|------|--------|-------------------|
| 1 | **Hermes WebUI** | 8787 | ✅ Running | **HAUPT-APP** |
| 2 | **Brain API** | 9090 | ✅ Running | ✅ BrainView integriert |
| 3 | **Agentmemory** | 3111 | ✅ Running | ❌ NICHT integriert |
| 4 | **Qdrant** | 6333 | ✅ Running | ❌ NICHT integriert |
| 5 | **9Router** | 20128 | ✅ Running | ❌ NICHT integriert |
| 6 | **Redis** | 6379 | ✅ Running | ❌ NICHT integriert |
| 7 | **Supabase** | 54321-54327 | ✅ Running | ❌ NICHT integriert |
| 8 | **MongoDB** | 27017 | ✅ Running | ❌ NICHT integriert |
| 9 | **RAGFlow** | 32770 | ✅ Running | ❌ NICHT integriert |

---

## 2. AKTUELLE WEBUI-INTEGRATION (AdminCockpit)

### 2.1 Bereits integriert in Sidebar

| View | Komponente | Status | Beschreibung |
|------|------------|--------|--------------|
| `chat` | LiveDashboard + ChatWindow + CommandButtons | ✅ Integriert | Dashboard + Chat |
| `conversations` | ConversationsView | ✅ Integriert | Konversationen |
| `leads` | LeadsView | ✅ Integriert | Lead-Management |
| `tasks` | TasksView | ✅ Integriert | Kanban/Task-Ansicht |
| `skills` | SkillsView | ✅ Integriert | Skills auflisten/toggeln |
| `mcp` | MCPToolsView | ✅ Integriert | MCP-Tools |
| `workers` | WorkerPoolView | ✅ Integriert | Worker-Pool |
| `brain` | BrainView | ✅ Integriert | Brain-Suche |
| `legal` | LegalView | ✅ Integriert | Rechtliches |

### 2.2 NICHT integriert (Fehlende Views)

| Anwendung | Benötigt | Priorität | Beschreibung |
|-----------|----------|-----------|--------------|
| **Profile** | Neues View | P1 | Benutzerprofile, Agenten-Seele |
| **Spaces** | Neues View | P1 | Workspace-Organisation |
| **Memory** | Neues View | P1 | Agenten-Memory (Memory-Stats, Notizen) |
| **Qdrant** | Neues View | P2 | Vektor-DB Collections verwalten |
| **Agentmemory** | Neues View | P2 | Agentenspeicher-Verwaltung |
| **Monitoring** | Neues View | P1 | System-Health, Alerts, Metriken |
| **Security** | Neues View | P1 | Secret-Rotation, SSH-Status, Trivy |
| **Backup** | Neues View | P2 | Backup/Restore-Verwaltung |
| **Landingpage** | Separat | P3 | Bereits als eigenständige App |
| **Auto Wiki** | Neues View | P3 | Automatische Wiki-Generierung |
| **Spaces** | Neues View | P2 | Multi-Tenant-Organisation |

---

## 3. INTEGRATIONS-ANALYSE

### 3.1 Hohe Priorität (P1) — Sofort integrieren

#### 3.1.1 Monitoring View
- **Quelle**: `/workspace/nexify/10_evidence/monitoring/`, Service Registry
- **API-Endpunkte**: Brain `/brain/health`, Agentmemory `/agentmemory/health`
- **Daten**: Container-Status, Service-Health, Alertmanager-Config
- **Integration**: Neues `MonitoringView.jsx` mit:
  - Service-Health-Dashboard (alle 42 Container)
  - Port-Binding-Übersicht
  - Alert-Status
  - System-Metriken (CPU, RAM, Disk)

#### 3.1.2 Security View
- **Quelle**: `/workspace/nexify/security/`, `/workspace/nexify/10_evidence/security/`
- **Daten**: SSH-Hardening, Trivy-Scans, Secret-Rotation, Fail2Ban
- **Integration**: Neues `SecurityView.jsx` mit:
  - Secret-Rotation-Status
  - SSH-Konfiguration
  - Trivy-Scan-Ergebnisse
  - Fail2Ban-Status
  - Supabase-Port-Warnungen

#### 3.1.3 Profile View
- **Quelle**: `/workspace/nexify/memory/`, `/workspace/nexify/01_agenten_seele/`
- **Daten**: Agenten-Seele, Benutzerprofil, Notizen
- **Integration**: Neues `ProfileView.jsx` mit:
  - Benutzerprofil-Editor
  - Agenten-Seele-Konfiguration
  - Persönliche Notizen

#### 3.1.4 Memory View
- **Quelle**: `/workspace/nexify/memory/`, Brain API, Agentmemory
- **Daten**: Memory-Stats, Brain-Einträge, Agentmemory-Kategorien
- **Integration**: Neues `MemoryView.jsx` mit:
  - Memory-Statistiken
  - Brain-Einträge durchsuchen/verwalten
  - Agentmemory-Kategorien
  - Memory-Bootstrap-Status

### 3.2 Mittlere Priorität (P2) — Nächste Phase

#### 3.2.1 Qdrant View
- **Quelle**: Qdrant API (Port 6333)
- **Daten**: Collections, Vektoren, Points
- **Integration**: Neues `QdrantView.jsx` mit:
  - Collections-Liste
  - Collection-Details (Points, Dimensionen)
  - Suche in Collections
  - Collection-Statistiken

#### 3.2.2 Agentmemory View
- **Quelle**: Agentmemory API (Port 3111)
- **Daten**: 53 MCP-Tools, 8 Kategorien, Erinnerungen
- **Integration**: Neues `AgentmemoryView.jsx` mit:
  - Kategorien-Übersicht
  - Erinnerungen suchen/durchsuchen
  - MCP-Tools-Liste
  - Health-Status

#### 3.2.3 Backup View
- **Quelle**: `/workspace/nexify/10_evidence/backup/`, Service Registry
- **Daten**: Backup-Status, Volume-Liste, Restore-Tests
- **Integration**: Neues `BackupView.jsx` mit:
  - Backup-Matrix (alle Volumes)
  - Backup-Status (vorhanden/fehlend)
  - Restore-Test-Ergebnisse
  - Backup-Schedule-Verwaltung

#### 3.2.4 Spaces View
- **Quelle**: Supabase, Multi-Tenant-Konzept
- **Daten**: Tenant-Organisation, Zugriffsrechte
- **Integration**: Neues `SpacesView.jsx` mit:
  - Space-Liste
  - Space-Konfiguration
  - Zugriffsrechte
  - Tenant-Verwaltung

### 3.3 Niedrige Priorität (P3) — Später

#### 3.3.1 Auto Wiki View
- **Quelle**: Dokumentation, Regeln, Skills
- **Daten**: Auto-generierte Wiki-Seiten
- **Integration**: Neues `AutoWikiView.jsx` mit:
  - Wiki-Übersicht
  - Seiten-Editor
  - Generierungs-Status

#### 3.3.2 Landingpage
- **Status**: Bereits als eigenständige App (`/workspace/nexifyai-platform/frontend/product-landing/`)
- **Integration**: Nicht in AdminCockpit, eigenständig erreichbar

---

## 4. INTEGRATIONS-PLAN

### 4.1 Phase 1: P1-Views (Woche 1)

| Tag | Task | Komponente | Abhängigkeit |
|-----|------|------------|--------------|
| 1 | MonitoringView erstellen | `MonitoringView.jsx` | Service Registry API |
| 1 | SecurityView erstellen | `SecurityView.jsx` | Security-Daten |
| 2 | ProfileView erstellen | `ProfileView.jsx` | Memory-Daten |
| 2 | MemoryView erstellen | `MemoryView.jsx` | Brain + Agentmemory API |
| 3 | Sidebar erweitern | `Sidebar.jsx` | Alle neuen Views |
| 3 | AdminCockpit erweitern | `AdminCockpit.jsx` | Sidebar + Views |
| 4 | API-Endpunkte erweitern | `adminApi.js` | Backend-Services |
| 5 | Testing + CSS | `admin.css` | Alle Komponenten |

### 4.2 Phase 2: P2-Views (Woche 2)

| Tag | Task | Komponente | Abhängigkeit |
|-----|------|------------|--------------|
| 1 | QdrantView erstellen | `QdrantView.jsx` | Qdrant API |
| 1 | AgentmemoryView erstellen | `AgentmemoryView.jsx` | Agentmemory API |
| 2 | BackupView erstellen | `BackupView.jsx` | Backup-Daten |
| 2 | SpacesView erstellen | `SpacesView.jsx` | Supabase |
| 3 | Integration + Testing | Alle P2-Views | Backend |
| 4 | CSS + Polish | `admin.css` | Alle Views |
| 5 | Dokumentation | README | Alle |

### 4.3 Phase 3: P3-Views (Woche 3)

| Tag | Task | Komponente | Abhängigkeit |
|-----|------|------------|--------------|
| 1 | AutoWikiView erstellen | `AutoWikiView.jsx` | Wiki-Daten |
| 2 | Finale Integration | Alle Views | Backend |
| 3 | Testing + QA | E2E-Tests | Alle |
| 4 | Deployment | Production | Alle |
| 5 | Dokumentation | Final | Alle |

---

## 5. TECHNISCHE ANFORDERUNGEN

### 5.1 Neue API-Endpunkte (adminApi.js)

```javascript
// Monitoring
api.getContainerStatus()      // Docker-Container-Status
api.getServiceHealth()        // Service-Health-Check
api.getSystemMetrics()        // CPU, RAM, Disk

// Security
api.getSecurityStatus()       // SSH, Trivy, Fail2Ban
api.getSecretRotation()       // Secret-Rotation-Status
api.getTrivyScans()           // Trivy-Scan-Ergebnisse

// Profile
api.getUserProfile()          // Benutzerprofil
api.updateProfile(data)       // Profil aktualisieren
api.getAgentSeele()           // Agenten-Seele

// Memory
api.getMemoryStats()          // Memory-Statistiken
api.getMemoryEntries()        // Memory-Einträge
api.searchMemory(query)       // Memory-Suche

// Qdrant
api.getQdrantCollections()    // Collections-Liste
api.getQdrantCollection(name) // Collection-Details
api.searchQdrant(collection, query) // Suche

// Agentmemory
api.getAgentmemoryCategories() // Kategorien
api.getAgentmemoryEntries()    // Einträge
api.searchAgentmemory(query)   // Suche

// Backup
api.getBackupStatus()         // Backup-Status
api.getBackupSchedule()       // Backup-Schedule
api.triggerBackup(volume)     // Backup auslösen

// Spaces
api.getSpaces()               // Space-Liste
api.getSpaceDetails(id)       // Space-Details
```

### 5.2 Neue Komponenten-Struktur

```
src/pages/admin/components/
├── MonitoringView.jsx        (NEU)
├── SecurityView.jsx          (NEU)
├── ProfileView.jsx           (NEU)
├── MemoryView.jsx            (NEU)
├── QdrantView.jsx            (NEU)
├── AgentmemoryView.jsx       (NEU)
├── BackupView.jsx            (NEU)
├── SpacesView.jsx            (NEU)
├── AutoWikiView.jsx          (NEU)
├── BrainView.jsx             (EXISTIERT)
├── SkillsView.jsx            (EXISTIERT)
├── TasksView.jsx             (EXISTIERT)
├── ChatWindow.jsx            (EXISTIERT)
├── ConversationsView.jsx     (EXISTIERT)
├── LeadsView.jsx             (EXISTIERT)
├── LegalView.jsx             (EXISTIERT)
├── MCPToolsView.jsx          (EXISTIERT)
├── WorkerPoolView.jsx        (EXISTIERT)
├── CommandButtons.jsx        (EXISTIERT)
├── LiveDashboard.jsx         (EXISTIERT)
└── Sidebar.jsx               (ERWEITERN)
```

### 5.3 Sidebar-Erweiterung

```javascript
const NAV_ITEMS = [
  // EXISTIEREND
  { id: 'chat', label: t.nav.chat, icon: 'chat' },
  { id: 'conversations', label: t.nav.conversations, icon: 'forum' },
  { id: 'leads', label: t.nav.leads, icon: 'person_search' },
  { id: 'tasks', label: t.nav.kanban, icon: 'assignment' },
  { id: 'skills', label: t.nav.skills, icon: 'extension' },
  { id: 'mcp', label: t.nav.mcp, icon: 'power_settings_new' },
  { id: 'workers', label: t.nav.workers, icon: 'smart_toy' },
  { id: 'brain', label: t.nav.brain, icon: 'psychology' },
  { id: 'legal', label: t.nav.legal, icon: 'gavel' },
  
  // NEU (P1)
  { id: 'monitoring', label: t.nav.monitoring, icon: 'monitoring' },
  { id: 'security', label: t.nav.security, icon: 'security' },
  { id: 'profile', label: t.nav.profile, icon: 'person' },
  { id: 'memory', label: t.nav.memory, icon: 'memory' },
  
  // NEU (P2)
  { id: 'qdrant', label: t.nav.qdrant, icon: 'storage' },
  { id: 'agentmemory', label: t.nav.agentmemory, icon: 'auto_awesome' },
  { id: 'backup', label: t.nav.backup, icon: 'backup' },
  { id: 'spaces', label: t.nav.spaces, icon: 'workspaces' },
  
  // NEU (P3)
  { id: 'autowiki', label: t.nav.autowiki, icon: 'auto_stories' },
];
```

---

## 6. ZUSAMMENFASSUNG

### 6.1 Gesamtübersicht

| Kategorie | Anzahl | Integriert | Offen |
|-----------|--------|------------|-------|
| Workspace-Apps | 13 | 4 | 9 |
| Platform-Apps | 10 | 2 | 8 |
| Adapter | 1 | 0 | 1 |
| Laufende Services | 9 | 2 | 7 |
| **GESAMT** | **33** | **8** | **25** |

### 6.2 Kritische Lücken

1. **Monitoring** — Keine WebUI-Integration für Service-Health
2. **Security** — Keine WebUI-Integration für Sicherheitsstatus
3. **Profile** — Keine WebUI-Integration für Benutzerprofile
4. **Memory** — Keine WebUI-Integration für Memory-Verwaltung
5. **Qdrant** — Keine WebUI-Integration für Vektor-DB
6. **Agentmemory** — Keine WebUI-Integration für Agentenspeicher
7. **Backup** — Keine WebUI-Integration für Backup-Verwaltung
8. **Spaces** — Keine WebUI-Integration für Multi-Tenant

### 6.3 Empfohlene nächste Schritte

1. **Sofort**: P1-Views implementieren (Monitoring, Security, Profile, Memory)
2. **Nächste Woche**: P2-Views implementieren (Qdrant, Agentmemory, Backup, Spaces)
3. **Danach**: P3-Views implementieren (AutoWiki)
4. **Kontinuierlich**: API-Endpunkte erweitern und testen

---

## 7. EVIDENCE

- **Datei**: `/workspace/nexify/10_evidence/integration/ANALYSE_3_EINZELANWENDUNGEN_INTEGRATION.md`
- **Erstellt**: 2026-06-22
- **Status**: ANALYSE ABGESCHLOSSEN
- **Nächster Schritt**: Implementierung Phase 1

---

*Erstellt von NeXify Systemmaster Agent — 2026-06-22*
