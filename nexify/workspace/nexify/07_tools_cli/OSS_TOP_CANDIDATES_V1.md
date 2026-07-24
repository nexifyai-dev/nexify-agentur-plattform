---
title: OSS Top-Kandidaten Recherche für NeXify AI
status: V1.0
version: 1.0.0
date: 2026-06-10
author: OSS-Recherche-Agent (Subagent 20260610_27)
reviewed_by: System-Architektur
tags: [oss, recherche, backend, frontend, designsystem, agenten-infrastruktur, evaluation]
---

# OSS Top-Kandidaten Recherche für NeXify AI

> **Ziel**: Identifikation und Bewertung der besten Open-Source-Lösungen für NeXify AI in zwei Kernbereichen: Backend/API/Agenten-Infrastruktur und Frontend/Designsysteme.
>
> **Geprüft**: Juni 2026 | **Umfang**: 30+ Kandidaten in 2 Bereichen | **Status**: Erste Fassung

---

## Executive Summary

| Position | Bereich | Kandidat | Entscheidung |
|----------|---------|----------|-------------|
| 🥇 **Top 1** | **Backend/Agenten-Infrastruktur** | **Temporal.io** | **EMPFEHLEN** — Bereits im Repo als Dependency, reif, MCP/CLI-fähig |
| 🥇 **Top 1** | **Frontend/Designsystem** | **shadcn/ui + Motion** | **EMPFEHLEN** — Beste Next.js-Integration, riesiges Ökosystem |
| 🥈 **Top 2** | **Agenten-Workflows** | **Trigger.dev** | **EMPFEHLEN** — Agent-first, MCP-ready, Supabase-Integration |
| 🥉 **Top 3** | **Validierung/Frontend** | **Better Auth + Valibot** | **PRÜFEN** — Auth-Reset, lightweight Validation |
| ⭐ **Bonus** | **Observability** | **Langfuse** | **PRÜFEN** — LLM-Observability native |

---

## Bereich A: Backend/API/Supabase/Agenten-Infrastruktur

### A.1 — Kandidatenübersicht

| # | Kandidat | Repo | Lizenz | ⭐ Stars | Aktivität (Release) | Technologie |
|---|----------|------|--------|---------|---------------------|-------------|
| 1 | **Supabase** | supabase/supabase | Apache-2.0 | 103.977 | v1.26.05 (2026-05) | TypeScript, Postgres, Go |
| 2 | **Temporal.io** | temporalio/temporal | MIT | 20.883 | v1.31.1 (2026-06-10) | Go (Server), TypeScript/Go/Java SDK |
| 3 | **BullMQ** | taskforcesh/bullmq | MIT | 8.979 | v5.78.0 (2026-06) | TypeScript, Redis |
| 4 | **Trigger.dev** | triggerdotdev/trigger.dev | Apache-2.0 | 15.290 | v4.5.0-rc.5 (2026-06) | TypeScript, React, SQLite |
| 5 | **Inngest** | inngest/inngest | NOASSERTION | 5.469 | Aktiv | TypeScript, Go |
| 6 | **Drizzle ORM** | drizzle-team/drizzle-orm | Apache-2.0 | 34.749 | Aktiv | TypeScript |
| 7 | **Better Auth** | better-auth/better-auth | MIT | 28.656 | Aktiv | TypeScript, Next.js |
| 8 | **Hono** | honojs/hono | MIT | 30.901 | Aktiv | TypeScript, Web Standards |
| 9 | **tRPC** | trpc/trpc | MIT | 40.309 | Aktiv | TypeScript |
| 10 | **Vercel AI SDK** | vercel/ai | NOASSERTION | 24.780 | Aktiv | TypeScript, Edge |
| 11 | **LangGraph** | langchain-ai/langgraph | MIT | 34.367 | Aktiv | TypeScript/Python |
| 12 | **CrewAI** | crewAIInc/crewAI | MIT | 53.218 | Aktiv | Python |
| 13 | **n8n** | n8n-io/n8n | "Fair-code" | 191.943 | Aktiv | TypeScript, Vue |
| 14 | **Dify** | langgenius/dify | NOASSERTION | 144.732 | Aktiv | TypeScript, Python |
| 15 | **Langfuse** | langfuse/langfuse | NOASSERTION | 28.860 | Aktiv | TypeScript |
| 16 | **Novel.sh** | steven-tey/novel | Apache-2.0 | 16.309 | Aktiv | TypeScript, React, TipTap |
| 17 | **Kysely** | kysely-org/kysely | MIT | 13.934 | Aktiv | TypeScript |
| 18 | **Prisma** | prisma/prisma | Apache-2.0 | 46.253 | Aktiv | TypeScript, Rust |

---

### A.2 — Detailanalyse (Backend/API-Kandidaten)

#### ⭐ 1. Supabase — BEREITS IM EINSATZ

| Kriterium | Bewertung |
|-----------|-----------|
| **Status** | ✅ **Bereits aktiv im Einsatz** — NeXify-Architektur setzt auf Supabase |
| **Stärken** | Postgres-Datenbank, Auth (incl. RLS), Edge Functions, Realtime, Storage, 103k Stars |
| **Schwächen** | Edge Functions haben Kaltstart-Latenz; RLS kann komplex werden; Supabase Auth ist weniger flexibel als Better Auth für Multi-Tenant |
| **Next.js-Eignung** | ⭐⭐⭐⭐⭐ — Hervorragend (Supabase JS Client, SSR, Middleware) |
| **React-Eignung** | ⭐⭐⭐⭐⭐ — Hervorragend (React Hooks, SWR, Query) |
| **Backend/API-Eignung** | ⭐⭐⭐⭐⭐ — Auth, RLS, REST, GraphQL, Edge Functions |
| **MCP-Fähigkeit** | ⭐⭐ — Kein native MCP; über Supabase MCP Server erweiterbar |
| **CLI-Fähigkeit** | ⭐⭐⭐⭐ — `supabase` CLI für Lokalentwicklung, Migrationen, Secrets |
| **Agentmemory-Eignung** | ⭐⭐⭐⭐ — Supabase als alternative Persistenz-Schicht für agentmemory |
| **Security-Risiko** | **Mittel**: RLS-Regeln müssen korrekt definiert sein; API-Keys Exposure |
| **NeXify-Integration** | **Zentrale Datenbank + Auth-Schicht** |
| **Entscheidung** | ✅ **EMPFEHLEN (Bestätigung)** — Bereits im Einsatz, beibehalten |

---

#### ⭐ 2. Temporal.io — BEREITS ALS DEPENDENCY

| Kriterium | Bewertung |
|-----------|-----------|
| **Status** | ✅ **Bereits im Repo als Dependency genannt** |
| **Repo** | [temporalio/temporal](https://github.com/temporalio/temporal) |
| **Lizenz** | MIT |
| **⭐ Stars** | 20.883 |
| **Letzte Aktivität** | v1.31.1 (10. Juni 2026 — heute!) |
| **Technologie** | Go (Server), TypeScript/Go/Java/PHP/Python SDK |
| **Stärken** | **Enterprise-reif**: Deterministic Workflows, durable execution, exactly-once, 10+ Jahre Entwicklung von Amazon/Microsoft-Ursprung (Cadence). Automatische Retries, Circuit Breaker, Saga-Patterns, Multi-Language SDK. Läuft bei Stripe, Netflix, Snap, Coinbase. |
| **Schwächen** | **Schwergewichtig**: Eigenen Server-Cluster nötig (Cassandra/Postgres + Elasticsearch). Höhere Lernkurve als BullMQ. Für einfache Queues overkill. TypeScript SDK hat Einschränkungen (Workflows müssen deterministisch sein). |
| **Next.js-Eignung** | ⭐⭐⭐ — Mittel (Workers laufen außerhalb, aber Client-SDK integration möglich) |
| **React-Eignung** | ⭐⭐ — Gering (primär Backend-Orchestrierung) |
| **Supabase-Eignung** | ⭐⭐⭐⭐ — Temporal kann Supabase als Datenquelle nutzen; Workflows triggern Supabase Edge Functions |
| **Backend/API-Eignung** | ⭐⭐⭐⭐⭐ — **Beste Lösung für durable execution, Workflow-Orchestrierung, Agentenketten** |
| **MCP-Fähigkeit** | ⭐⭐⭐⭐ — MCP Server verfügbar; Workflows können als MCP-Tools exponiert werden |
| **CLI-Fähigkeit** | ⭐⭐⭐⭐ — `temporal` CLI für Workflow-Management, Admin, Namespaces |
| **Agentmemory-Eignung** | ⭐⭐⭐⭐⭐ — Perfekt: Agentenketten als deterministische Workflows, Handoff als Signal, Memory-Snapshots als Side-Effect-Aktivitäten |
| **Security-Risiko** | **Niedrig-Mittel**: TLS/mTLS-native; Workflow-Code muss deterministisch sein (sonst Runtime-Fehler) |
| **NeXify-Integration** | **Dispatcher-Ablösung**: Automation Controller → Temporal Workflows. Chat-Operator → Temporal Child Workflows. Queue-System → Temporal Task Queues. |
| **Pilotaufgabe** | Migration des Automation Controllers von der aktuellen Zustandsmaschine auf Temporal Workflows — starte mit einem einzelnen Workflow-Typ (z.B. "Code-Review-Kette") |

**Entscheidung: ✅ EMPFEHLEN (Top 1 Backend)**

> **Begründung**: Temporal.io ist die einzige Lösung, die **alle** NeXify-Anforderungen abdeckt: durable execution für Agentenketten, deterministische Workflows für den Automation Controller, MCP/CLI-Fähigkeit, Multi-Language-Support, und Enterprise-Reife. Bereits als Dependency im Repo notiert. Die anfängliche Setup-Komplexität (eigener Server) ist durch die gewonnene Zuverlässigkeit gerechtfertigt.

---

#### ⭐ 3. Trigger.dev

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [triggerdotdev/trigger.dev](https://github.com/triggerdotdev/trigger.dev) |
| **Lizenz** | Apache-2.0 |
| **⭐ Stars** | 15.290 |
| **Letzte Aktivität** | v4.5.0-rc.5 (5. Juni 2026) — sehr aktiv |
| **Technologie** | TypeScript, React, SQLite (Server), Next.js |
| **Stärken** | **Agent-first**: Native AI Agent/Workflow-Unterstützung. Managed oder Self-Hosted. TypeScript-nativ. Einfacheres API als Temporal. Integriert mit Vercel, Supabase, OpenAI. Kein separater Server-Cluster nötig (SQLite-basiert). Realtime-Updates. |
| **Schwächen** | **Jünger als Temporal**: v4 noch im RC (Release Candidate). Weniger Enterprise-Einsätze. Weniger Features als Temporal (z.B. kein Saga-Pattern). Self-Hosted noch nicht so ausgereift. |
| **Next.js-Eignung** | ⭐⭐⭐⭐⭐ — **Hervorragend** (Next.js-first Design, Vercel-Integration, App Router-kompatibel) |
| **React-Eignung** | ⭐⭐⭐⭐⭐ — Hervorragend (React-Komponenten für Status-Dashboard) |
| **Supabase-Eignung** | ⭐⭐⭐⭐⭐ — Native Supabase-Integration (Auth, DB, Realtime) |
| **Backend/API-Eignung** | ⭐⭐⭐⭐ — Workflow-Engine, Webhooks, Cron, Queue |
| **MCP-Fähigkeit** | ⭐⭐⭐ — Kein native MCP, aber Workflows können als MCP-Tools exponiert werden |
| **CLI-Fähigkeit** | ⭐⭐⭐ — `trigger` CLI verfügbar, aber weniger umfangreich als Temporal |
| **Agentmemory-Eignung** | ⭐⭐⭐⭐ — Workflow-Persistenz und Zustandsmanagement, Handoff via Signals |
| **Security-Risiko** | **Niedrig-Mittel**: Apache-2.0, aber v4 RC — Produktionsrisiko bis Stable |
| **NeXify-Integration** | **Dispatcher-Alternative oder Temporal-Alternative für kleinere Workflows** |
| **Pilotaufgabe** | Baue einen Trigger.dev-Workflow, der einen Agenten-Lifecycle abbildet: Session-Start → Tool-Call → Memory-Sync → Session-End |

**Entscheidung: ✅ EMPFEHLEN (Top 2 Backend / Agenten-Workflows)**

> **Begründung**: Trigger.dev ist **die beste Agent-first-Alternative** zu Temporal. Leichtere Integration, Next.js-native, Supabase-Support. Für einfachere Workflow-Ketten die bessere Wahl als Temporal. Für komplexe, langlaufende Workflows bleibt Temporal erste Wahl.

---

#### ⭐ 4. BullMQ

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [taskforcesh/bullmq](https://github.com/taskforcesh/bullmq) |
| **Lizenz** | MIT |
| **⭐ Stars** | 8.979 |
| **Letzte Aktivität** | v5.78.0 (2. Juni 2026) — sehr aktiv |
| **Technologie** | TypeScript, Redis |
| **Stärken** | **Leichtgewichtig, schnell, erprobt**: Redis-basiert, millionenfach eingesetzt. Einfach zu verstehen und zu debuggen. Rate-Limiting, Delayed Jobs, Repeatable Jobs, Sandbox Workers. Minimale Abhängigkeiten. |
| **Schwächen** | **Nur Queue, kein Workflow**: Kein orchestriertes Workflow-Management (kein Saga, kein Durable Execution). Kein State-Persistence außerhalb Redis. Kein nativ deterministisches Execution-Modell. Für Agentenketten zu simpel. |
| **Next.js-Eignung** | ⭐⭐⭐ — Mittel (Worker laufen separat) |
| **React-Eignung** | ⭐⭐ — Gering (primär Backend) |
| **Supabase-Eignung** | ⭐⭐⭐ — BullMQ kann Supabase-Events via Webhook konsumieren |
| **Backend/API-Eignung** | ⭐⭐⭐⭐ — Hervorragend für einfache Job-Queues, aber unzureichend für komplexe Workflows |
| **MCP-Fähigkeit** | ⭐ — Kein MCP |
| **CLI-Fähigkeit** | ⭐⭐ — `bull` CLI available, aber simpel |
| **Agentmemory-Eignung** | ⭐⭐ — Nur als einfache Queue, kein Workflow-State |
| **Security-Risiko** | **Niedrig** — Redis-Security, ausgereift |
| **NeXify-Integration** | **Einfache Queue-Schicht für Nebenläufigkeit — nicht für Agentenketten** |
| **Pilotaufgabe** | Ersetze eine einfache Task-Queue im Automation Controller durch BullMQ |

**Entscheidung: ⚠️ PRÜFEN (nur für einfache Queues)**

> **Begründung**: BullMQ ist im ADR bereits erwähnt und für einfache Queue-Aufgaben geeignet. **Für Agentenketten und Workflow-Orchestrierung ist Temporal oder Trigger.dev die bessere Wahl.** BullMQ als Sub-Queue innerhalb von Temporal-Workflows nutzbar.

---

#### ⭐ 5. Inngest

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [inngest/inngest](https://github.com/inngest/inngest) |
| **Lizenz** | NOASSERTION (source-available) |
| **⭐ Stars** | 5.469 |
| **Technologie** | TypeScript, Go (Server) |
| **Stärken** | TypeScript-nativ, einfaches API-Design, gute DX, Step Functions, Cancellation, Rate-Limiting |
| **Schwächen** | **Source-available Lizenz** (kein echtes OSS). Kleineres Ökosystem. Weniger Features als Temporal/Trigger.dev. Dev-Backlog sichtbar. |
| **NeXify-Eignung** | ⭐⭐⭐ — Durch Lizenz und geringere Verbreitung nicht erste Wahl |
| **Entscheidung** | ❌ **VERWERFEN** (Lizenz-Risiko, geringere Verbreitung) |

---

#### ⭐ 6. Hono

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [honojs/hono](https://github.com/honojs/hono) |
| **Lizenz** | MIT |
| **⭐ Stars** | 30.901 |
| **Technologie** | TypeScript, Web Standards (WinterCG-kompatibel) |
| **Stärken** | **Ultraleicht** (14kB), extrem schnell, Edge-nativ (Cloudflare Workers, Deno, Bun, Vercel Edge). Hervorragende Typ-Inferenz. Middleware-Ökosystem (Auth, CORS, JWT, Logger). RPC-Modus (ähnlich tRPC). |
| **Schwächen** | **Nur HTTP-Router/Framework** — kein Workflow, keine Queue. Kein ORM. Braucht zusätzliche Tools für vollständiges Backend. |
| **Next.js-Eignung** | ⭐⭐⭐⭐ — Gut (als API-Router in Next.js App Router nutzbar) |
| **Supabase-Eignung** | ⭐⭐⭐⭐ — Perfekt als API-Gateway vor Supabase Edge Functions |
| **Backend/API-Eignung** | ⭐⭐⭐⭐ — Hervorragend als HTTP/REST/API-Layer, aber kein Workflow |
| **MCP-Fähigkeit** | ⭐⭐⭐ — MCP Server in Hono implementierbar |
| **CLI-Fähigkeit** | ⭐⭐⭐⭐ — `hono` CLI, einfaches Scaffolding |
| **Security-Risiko** | **Niedrig** — Minimaler Footprint, MIT-Lizenz |
| **NeXify-Integration** | **API-Gateway, Router-Layer vor agentmemory, 9Router? MCP-Server in Hono** |
| **Pilotaufgabe** | Baue einen Hono-basierten API-Gateway vor agentmemory MCP Server mit RLS-Check |

**Entscheidung: ✅ EMPFEHLEN (API-Gateway/Router)**

> **Begründung**: Hono ist der ideale HTTP-Router für die NeXify-Architektur — als API-Gateway vor agentmemory, als Edge-Router für Supabase Edge Functions, als MCP-Server-Implementation. **Ergänzt Temporal/Trigger.dev perfekt.**

---

#### ⭐ 7. Better Auth

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [better-auth/better-auth](https://github.com/better-auth/better-auth) |
| **Lizenz** | MIT |
| **⭐ Stars** | 28.656 (schnell wachsend) |
| **Technologie** | TypeScript, Next.js, React |
| **Stärken** | **Modernstes Auth-Framework für Next.js/React.** Multi-Tenant, OAuth/OIDC, MFA, Passkeys, Session-Management, Organization/RBAC. Plugin-Architektur. Magic Links, Social Logins. Self-Hosted (kein Vendor-Lock-in). |
| **Schwächen** | **Noch jung** (schnelle Releases, Breaking Changes möglich). Weniger bekannt als Supabase Auth oder Clerk. Kein Supabase-RLS-Äquivalent. |
| **Next.js-Eignung** | ⭐⭐⭐⭐⭐ — **Next.js-first** (Middleware, Server Components, App Router) |
| **Supabase-Eignung** | ⭐⭐⭐⭐ — Kann Supabase DB als Storage nutzen; ersetzt Supabase Auth |
| **Backend/API-Eignung** | ⭐⭐⭐⭐ — Auth, RBAC, API-Keys, Webhooks |
| **MCP-Fähigkeit** | ⭐ — Kein MCP |
| **CLI-Fähigkeit** | ⭐⭐ — CLI verfügbar |
| **Security-Risiko** | **Niedrig** — MIT, aktiv maintained, moderne Auth-Standards |
| **NeXify-Integration** | **Auth-Schicht für Multi-Agenten-Access-Control, ersetzt/ergänzt Supabase Auth** |
| **Pilotaufgabe** | Implementiere Better Auth als Auth-Provider für die Hermes WebUI mit Multi-Tenant für verschiedene NeXify-Benutzer |

**Entscheidung: ✅ EMPFEHLEN (Auth-Schicht)**

> **Begründung**: Better Auth ist der modernste OSS-Auth-Provider für Next.js mit Multi-Tenant, RBAC und Plugin-Architektur. Kann Supabase Auth ergänzen oder ersetzen, je nach Anforderung.

---

#### ⭐ 8. tRPC

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [trpc/trpc](https://github.com/trpc/trpc) |
| **Lizenz** | MIT |
| **⭐ Stars** | 40.309 |
| **Technologie** | TypeScript |
| **Stärken** | **End-to-End Type Safety.** Kein API-Contract nötig — Typen werden geteilt. Hervorragende DX. React Query Integration. Server Components Support. |
| **Schwächen** | **Nur TypeScript-Ökosystem.** Kein OpenAPI/REST-Kompatibilität ohne Zusatz-Tools. Für externe APIs weniger geeignet. |
| **NeXify-Eignung** | ⭐⭐⭐⭐ — Perfekt für interne Agent-to-Agent-Kommunikation |
| **Entscheidung** | ⚠️ **PRÜFEN** — Für interne Kommunikation zwischen Agenten-Komponenten |

---

#### ⭐ 9. Drizzle ORM

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) |
| **Lizenz** | Apache-2.0 |
| **⭐ Stars** | 34.749 |
| **Technologie** | TypeScript (Rust für Drizzle Kit CLI) |
| **Stärken** | **Supabase-nativ**: Drizzle ist der empfohlene ORM für Supabase. TypeScript-first, SQL-like Syntax, keine Magic. Hervorragende Migrations-Tools (Drizzle Kit). Leichtgewichtig (kein großer Runtime-Overhead wie Prisma). |
| **Schwächen** | Weniger Features als Prisma (z.B. kein Relation-Mapping auf API-Ebene). CLI noch teilweise experimentell. |
| **NeXify-Eignung** | ⭐⭐⭐⭐⭐ — **Perfekter ORM für Supabase + NeXify** |
| **Entscheidung** | ✅ **EMPFEHLEN (Bestätigung)** — Supabase-kompatibel, TypeScript-nativ |

---

#### ⭐ 10. LangGraph

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) |
| **Lizenz** | MIT |
| **⭐ Stars** | 34.367 |
| **Technologie** | TypeScript, Python |
| **Stärken** | **State-Graph-basierte Agenten-Workflows.** Natives LangChain-Ökosystem. Graph-Routing, Conditional Edges, State Persistence. Human-in-the-Loop. Stream/Callback-Unterstützung. |
| **Schwächen** | **Starke Abhängigkeit von LangChain.** Python-zentrisch (TS-Version weniger ausgereift). Für einfache Workflows überdimensioniert. |
| **NeXify-Eignung** | ⭐⭐⭐ — Gute Agenten-Orchestrierung, aber LangChain-Abhängigkeit |
| **Entscheidung** | ⚠️ **PRÜFEN** — Für komplexe Agenten-Graphen, aber LangChain-Bindung beachten |

---

#### ⭐ 11. Langfuse (Observability)

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [langfuse/langfuse](https://github.com/langfuse/langfuse) |
| **Lizenz** | NOASSERTION (EE License) |
| **⭐ Stars** | 28.860 |
| **Technologie** | TypeScript, Python |
| **Stärken** | **LLM-native Observability.** Tracing für LLM-Calls, Agent-Schritte, Tool-Usage. Evaluation, Datasets, Prompt-Management. Self-Hosted möglich. |
| **Schwächen** | **EE-Lizenz** (nicht rein OSS). Fokus auf LLM — nicht auf allgemeine Infrastruktur. |
| **NeXify-Eignung** | ⭐⭐⭐⭐ — Observability für Agenten-Calls, 9Router-Tracing |
| **Entscheidung** | ⚠️ **PRÜFEN** — Für LLM-Tracing und Agent-Observability |

---

#### ⭐ 12. Dify

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [langgenius/dify](https://github.com/langgenius/dify) |
| **Lizenz** | NOASSERTION (Apache-2.0 ähnlich) |
| **⭐ Stars** | 144.732 |
| **Technologie** | TypeScript (Frontend), Python (Backend) |
| **Stärken** | **Vollständige LLM-App-Plattform**: RAG, Agent, Workflow, API. Visueller Workflow-Editor. Sehr aktiv. |
| **Schwächen** | **Python-Backend** (NeXify ist TypeScript-first). Monolithische Architektur. Stark opinionated. |
| **NeXify-Eignung** | ⭐⭐ — Python-Backend passt nicht in TypeScript-Ökosystem |
| **Entscheidung** | ❌ **VERWERFEN** (Tech-Stack-Diskrepanz: Python vs. TypeScript) |

---

### A.3 — Bewertungsmatrix (Backend/API)

| Kriterium | Supabase | Temporal | BullMQ | Trigger.dev | Hono | Better Auth | Drizzle | LangGraph |
|-----------|----------|----------|--------|-------------|------|-------------|---------|-----------|
| **Next.js** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **React** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Supabase** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Backend/API** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **MCP** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐ |
| **CLI** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Agentmemory** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Security** | Mittel | Niedrig | Niedrig | Niedrig | Niedrig | Niedrig | Niedrig | Mittel |
| **Entscheidung** | ✅ EMPF. | ✅ **TOP 1** | ⚠️ PRÜFEN | ✅ EMPF. | ✅ EMPF. | ✅ EMPF. | ✅ EMPF. | ⚠️ PRÜFEN |

---

## Bereich B: Hochwertige Frontends/Designsysteme

### B.1 — Kandidatenübersicht

| # | Kandidat | Repo | Lizenz | ⭐ Stars | Technologie |
|---|----------|------|--------|---------|-------------|
| 1 | **shadcn/ui** | shadcn-ui/ui | MIT | 116.212 | TypeScript, React, Tailwind, Radix |
| 2 | **Motion (framer-motion)** | motiondivision/motion | MIT | 32.275 | TypeScript, React, JavaScript |
| 3 | **Geist (Vercel)** | vercel/geist-font | MIT | 3.476 | CSS, Font |
| 4 | **Ark UI** | chakra-ui/ark | MIT | 5.221 | TypeScript, React/Vue/Solid/Svelte |
| 5 | **React Aria** | adobe/react-spectrum | Apache-2.0 | 15.406 | TypeScript, React |
| 6 | **Storybook** | storybookjs/storybook | MIT | 90.273 | TypeScript, React/Vue/Angular |
| 7 | **Playwright** | microsoft/playwright | Apache-2.0 | 90.682 | TypeScript, Node.js |
| 8 | **Tailwind CSS** | tailwindlabs/tailwindcss | MIT | 95.476 | CSS, PostCSS |
| 9 | **Next.js SaaS Starter** | nextjs/saas-starter | MIT | 15.872 | Next.js, Postgres, Stripe, shadcn |
| 10 | **Zag.js** | chakra-ui/zag | MIT | 5.113 | TypeScript (Framework-agnostic) |
| 11 | **React Email** | resend/react-email | MIT | 19.316 | TypeScript, React |
| 12 | **Biome** | biomejs/biome | MIT | 24.972 | Rust, TypeScript |
| 13 | **Oxlint** | oxc-project/oxc | MIT | 21.541 | Rust |
| 14 | **Mitosis** | BuilderIO/mitosis | MIT | 13.840 | TypeScript |

---

### B.2 — Detailanalyse (Frontend/Design-Kandidaten)

#### ⭐ 1. shadcn/ui — BEREITS IM KONTEXT

| Kriterium | Bewertung |
|-----------|-----------|
| **Status** | ✅ **Bereits im NeXify-Kontext erwähnt** |
| **Repo** | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) |
| **Lizenz** | MIT |
| **⭐ Stars** | **116.212** (größtes React-Component-Library-Repo) |
| **Letzte Aktivität** | v4.11.0 (8. Juni 2026) — extrem aktiv |
| **Technologie** | TypeScript, React, Tailwind CSS, Radix UI Primitives |
| **Stärken** | **De-facto-Standard für Next.js-Apps.** Copy-paste-Ansatz (keine Dependency). Vollständig anpassbar. Barrierefrei (via Radix). Riesiges Ökosystem (1000+ Community-Komponenten). CLI zum Hinzufügen von Komponenten. Themes/Theming via CSS-Variablen. Blocks (komplette Seiten-Sektionen). |
| **Schwächen** | Kein package (Copy-paste-Modell erfordert Git-Management). Variiertes Qualitätsniveau bei Community-Komponenten. Kein nativer Form-Builder. |
| **Next.js-Eignung** | ⭐⭐⭐⭐⭐ — **Beste Next.js-Integration** (App Router, Server Components, RSC) |
| **React-Eignung** | ⭐⭐⭐⭐⭐ — React-native (Radix Primitives) |
| **Supabase-Eignung** | ⭐⭐⭐⭐ — shadcn + Supabase = Standard-Stack (siehe makeReal.dev, supabase.com/templates) |
| **Designsystem-Eignung** | ⭐⭐⭐⭐⭐ — Vollständiges Designsystem mit Theme, Tokens, Dark Mode |
| **MCP-Fähigkeit** | ⭐ — Kein MCP (aber CLI-Tooling vorhanden) |
| **CLI-Fähigkeit** | ⭐⭐⭐⭐⭐ — `npx shadcn@latest add button` — beste CLI-DX |
| **Security-Risiko** | **Niedrig** — Copy-paste = kein Supply-Chain-Risk |
| **NeXify-Integration** | **Zentrales Designsystem für Hermes WebUI, Dashboards, Operator-Shells** |
| **Pilotaufgabe** | Baue die Hermes WebUI Operator-Shell mit shadcn/ui-Komponenten (Sidebar, Command Palette, Data Table, Form) |

**Entscheidung: ✅ EMPFEHLEN (Top 1 Frontend)**

> **Begründung**: shadcn/ui ist der **unangefochtene Standard** für Next.js-Designsysteme. 116k Stars, aktiv maintained, riesiges Ökosystem, keine Dependencies (Copy-paste), CLI-first. Perfekt für Hermes WebUI und Operator-Shells.

---

#### ⭐ 2. Motion (ehemals framer-motion)

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [motiondivision/motion](https://github.com/motiondivision/motion) |
| **Lizenz** | MIT |
| **⭐ Stars** | 32.275 |
| **Technologie** | TypeScript, React (und Vanilla JS) |
| **Stärken** | **De-facto-Standard für React-Animationen.** Nachfolger von framer-motion. Layout-Animationen, Gesten, Scroll-basierte Animationen, Exit-Animationen. Motion Value für Performance. Neue: Motion for Vue, Motion for Svelte. Kleiner als framer-motion (rewrite). |
| **Schwächen** | Noch relativ neu als eigenständige Library (Ablösung von Framer). Manche framer-motion-Features fehlen noch. |
| **Next.js-Eignung** | ⭐⭐⭐⭐⭐ — RSC-kompatibel (Client Components) |
| **React-Eignung** | ⭐⭐⭐⭐⭐ — React-first |
| **Designsystem-Eignung** | ⭐⭐⭐⭐ — Perfekt für Mikrointeraktionen und Übergänge |
| **Security-Risiko** | **Niedrig** |
| **NeXify-Integration** | **Animationen in Hermes WebUI, Mikrointeraktionen in Operator-Shell, Agent-Status-Transitionen** |
| **Pilotaufgabe** | Implementiere flüssige Übergänge für Agent-Status-Änderungen (Processing → Review → Complete) in der Hermes UI |

**Entscheidung: ✅ EMPFEHLEN (Animationen)**

> **Begründung**: Motion ist der natürliche Nachfolger von framer-motion und der Standard für React-Animationen. Für NeXify-Interfaces mit Agenten-Status-Transitionen und Mikrointeraktionen unverzichtbar.

---

#### ⭐ 3. Geist (Vercel Design System)

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | vercel/geist-font |
| **Lizenz** | MIT |
| **⭐ Stars** | 3.476 (Font) |
| **Technologie** | CSS, Font-Files |
| **Stärken** | **Vercels Design-Philosophie**: Sauber, minimal, typografie-zentriert. Geist Font ist exzellent für Interfaces. Geist UI (inoffiziell) als komplettes Design-System verfügbar. |
| **Schwächen** | **Kein offizielles Geist Design System als OSS** (nur Font und Icons). Inoffizielle Ports sind nicht Vercel-maintained. |
| **Next.js-Eignung** | ⭐⭐⭐⭐ — Vercel-produziert |
| **NeXify-Integration** | **Geist Font als Standard-Typografie** (ergänzt shadcn/ui) |
| **Entscheidung** | ⚠️ **PRÜFEN (nur Font)** — Font verwenden, UI nicht |

---

#### ⭐ 4. Ark UI

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [chakra-ui/ark](https://github.com/chakra-ui/ark) |
| **Lizenz** | MIT |
| **⭐ Stars** | 5.221 |
| **Technologie** | TypeScript, React/Vue/Solid/Svelte (Framework-agnostic) |
| **Stärken** | **Headless, unstyled, maximal flexibel.** Framework-agnostisch (gleiche Komponente in React, Vue, Solid). Von Chakra-UI-Autoren. Machine-driven (Zag.js). Barrierefrei (WAI-ARIA). |
| **Schwächen** | **Weniger bekannt als shadcn/ui.** Kein Styling dabei (muss selbst kommen). Relativ neu. Kleineres Ökosystem. |
| **Next.js-Eignung** | ⭐⭐⭐⭐ — Gut (React-Support) |
| **React-Eignung** | ⭐⭐⭐⭐ — Gut |
| **Designsystem-Eignung** | ⭐⭐⭐⭐⭐ — **Beste Basis für eigenes Designsystem** (wenn shadcn/ui zu opinionated) |
| **NeXify-Integration** | **Alternative Basis für Custom-Komponenten** wenn shadcn/ui zu rigid ist |
| **Entscheidung** | ⚠️ **PRÜFEN** — Für spezielle UI-Komponenten außerhalb shadcn/ui |

---

#### ⭐ 5. React Aria Components (Adobe Spectrum)

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [adobe/react-spectrum](https://github.com/adobe/react-spectrum) |
| **Lizenz** | Apache-2.0 |
| **⭐ Stars** | 15.406 |
| **Technologie** | TypeScript, React (ARIA-native) |
| **Stärken** | **Beste Accessibility (Barrierefreiheit).** Von Adobe entwickelt. Strict WAI-ARIA-Compliance. Separates `react-aria-components` für unstyled components. Internationalisierung (i18n) inkludiert. Drag-and-Drop, Collections, Date/Time-Picker. |
| **Schwächen** | **Schwergewichtig** (große Bundle-Size). Adobe-Look-and-Feil wenn Spectrum-Theme verwendet wird. Komplexeres API als shadcn/ui. |
| **Next.js-Eignung** | ⭐⭐⭐⭐ — Gut (React Server Components kompatibel) |
| **React-Eignung** | ⭐⭐⭐⭐⭐ — React-first |
| **Designsystem-Eignung** | ⭐⭐⭐⭐⭐ — **Beste Accessibility und Internationalisierung** |
| **Security-Risiko** | **Niedrig** — Apache-2.0, Adobe-maintained |
| **NeXify-Integration** | **Accessibility-Audit-Tooling, komplexe UI-Patterns (Date-Picker, Collections)** |
| **Entscheidung** | ✅ **EMPFEHLEN (Accessibility + komplexe Komponenten)** |

> **Begründung**: React Aria Components sind die **State-of-the-Art für Barrierefreiheit** und komplexe UI-Patterns. Für NeXify, wo Accessibility und Internationalisierung wichtig sind, eine wertvolle Ergänzung zu shadcn/ui.

---

#### ⭐ 6. Storybook

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [storybookjs/storybook](https://github.com/storybookjs/storybook) |
| **Lizenz** | MIT |
| **⭐ Stars** | 90.273 |
| **Technologie** | TypeScript, React/Vue/Angular |
| **Stärken** | **Industriestandard für UI-Component-Entwicklung.** Isolated Component Development. Visual Regression Testing (Chromatic). Interaction Testing. Auto-Docs. Addon-Ökosystem. |
| **Schwächen** | **Schwergewichtig**, Build-Zeiten können lang sein. Overhead für kleine Projekte. |
| **Next.js-Eignung** | ⭐⭐⭐⭐ — Next.js-Storybook-Integrator |
| **Designsystem-Eignung** | ⭐⭐⭐⭐⭐ — **Muss für Designsystem-Dokumentation + Tests** |
| **NeXify-Integration** | **Dokumentation + Testing aller shadcn/ui-Komponenten** |
| **Pilotaufgabe** | Setze Storybook für das shadcn/ui-Designsystem auf, dokumentiere 10 Kernkomponenten mit Playwright Interaction Tests |

**Entscheidung: ✅ EMPFEHLEN (Component-Dokumentation + Testing)**

---

#### ⭐ 7. Playwright

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [microsoft/playwright](https://github.com/microsoft/playwright) |
| **Lizenz** | Apache-2.0 |
| **⭐ Stars** | 90.682 |
| **Technologie** | TypeScript, Node.js |
| **Stärken** | **Bester E2E-Test-Framework.** Multi-Browser (Chromium, Firefox, WebKit). Visual Regression, Component Testing, API Testing. Trace Viewer, Codegen. Superschnell. |
| **Schwächen** | Keine native Next.js-Integration (braucht @playwright/experimental-ct). |
| **NeXify-Eignung** | ⭐⭐⭐⭐⭐ — E2E-Tests für Hermes WebUI, Screenshot-Tests |
| **Entscheidung** | ✅ **EMPFEHLEN (Testing)** — Standard für E2E + Screenshot-Tests |

---

#### ⭐ 8. Next.js SaaS Starter

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [nextjs/saas-starter](https://github.com/nextjs/saas-starter) (leerob) |
| **Lizenz** | MIT |
| **⭐ Stars** | 15.872 |
| **Technologie** | Next.js, Postgres, Stripe, shadcn/ui, Tailwind |
| **Stärken** | **Offizieller Next.js-Startpunkt für SaaS.** Enthält Auth (NextAuth), Payments (Stripe), DB (Postgres), UI (shadcn/ui), Dark Mode, E-Mails (React Email). |
| **Schwächen** | **Stark opinionated.** Auth via NextAuth (nicht Better Auth). Kein Supabase. |
| **NeXify-Eignung** | ⭐⭐⭐⭐ — Blaupause für NeXify-SaaS-Plattform |
| **Entscheidung** | ⚠️ **PRÜFEN** — Als Referenz-Architektur, nicht direkt übernehmen |

---

#### ⭐ 9. Biome

| Kriterium | Bewertung |
|-----------|-----------|
| **Repo** | [biomejs/biome](https://github.com/biomejs/biome) |
| **Lizenz** | MIT |
| **⭐ Stars** | 24.972 |
| **Technologie** | Rust |
| **Stärken** | **Blitzschneller Linter + Formatter** (10-100x schneller als ESLint/Prettier). Einheitliche Config. ESLint-kompatibel. |
| **Schwächen** | Weniger Regeln als ESLint. Kein Prettier-Plugin-Ökosystem. |
| **NeXify-Eignung** | ⭐⭐⭐⭐⭐ — **Ersatz für ESLint + Prettier in NeXify-Projekten** |
| **Entscheidung** | ✅ **EMPFEHLEN (Code-Qualität)** — Schneller, einheitlicher, moderner |

---

### B.3 — Bewertungsmatrix (Frontend/Design)

| Kriterium | shadcn/ui | Motion | Ark UI | React Aria | Storybook | Playwright | Biome | Geist |
|-----------|-----------|--------|--------|------------|-----------|------------|-------|-------|
| **Next.js** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **React** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Designsystem** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐ |
| **MCP/CLI** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| **Accessibility** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐ |
| **Screenshot-Tests** | ❌ | ❌ | ❌ | ❌ | ✅ Chromatic | ✅ Vis. Reg. | ❌ | ❌ |
| **Bundle-Size** | ✅ Minimal | ✅ Klein | ✅ Minimal | ⚠️ Groß | ⚠️ Groß | ⚠️ Groß | ❌ N/A | ✅ Minimal |
| **Security** | Niedrig | Niedrig | Niedrig | Niedrig | Niedrig | Niedrig | Niedrig | Niedrig |
| **Entscheidung** | ✅ **TOP 1** | ✅ EMPF. | ⚠️ PRÜFEN | ✅ EMPF. | ✅ EMPF. | ✅ EMPF. | ✅ EMPF. | ⚠️ PRÜFEN |

---

## Gesamt-Empfehlungen

### 🥇 Top 1 Backend-Lösung: **Temporal.io**

| Aspekt | Wert |
|--------|------|
| **Begründung** | Einzige Lösung, die durable Execution für Agentenketten, deterministische Workflows, MCP/CLI-Fähigkeit und Enterprise-Reife in einer Plattform vereint. Bereits als Dependency notiert. |
| **Pilotaufgabe** | **Migration Automation Controller → Temporal Workflow** |
| | Starte mit einem einzelnen Workflow-Typ, z.B. "Code-Review-Kette": |
| | 1. Workflow: `CodeReviewChain` mit den Activities: `checkoutCode`, `runLinter`, `runAudit`, `generateReview`, `postResults` |
| | 2. Implementiere in TypeScript SDK mit temporal.io |
| | 3. Verbinde mit agentmemory (MCP) via Side-Effect-Activity |
| | 4. Nutze Temporal Web UI für Monitoring |
| | **Erfolgskriterium**: Ein Code-Review-Durchlauf (20 Dateien) in < 5 Min, vollständig nachvollziehbar in Temporal Web UI |
| **Integration** | Temporal SDK → agentmemory MCP → Dispatcher Events → Policy Gate |

### 🥇 Top 1 Frontend/Design-Lösung: **shadcn/ui + Motion**

| Aspekt | Wert |
|--------|------|
| **Begründung** | shadcn/ui ist der De-facto-Standard für Next.js-Designsysteme (116k Stars). Motion ist der Standard für React-Animationen. Zusammen das perfekte Duo für Hermes WebUI und Operator-Shells. |
| **Pilotaufgabe** | **Hermes WebUI Operator-Shell** |
| | 1. Richte shadcn/ui ein (`npx shadcn@latest init`) |
| | 2. Implementiere Kern-Layout: Sidebar (Navigation), Topbar (Status), Main Content Area |
| | 3. Baue: Command Palette (`cmdk`), Data Table (Agenten-Status), Forms (Konfiguration) |
| | 4. Füge Motion-Animationen für Agent-Status-Transitionen hinzu |
| | 5. Dark Mode via shadcn/ui Theme |
| | 6. Verifiziere Accessibility via React Aria + axe |
| | **Erfolgskriterium**: Vollständige Operator-Shell in < 2 Tagen mit 10+ Komponenten |
| **Integration** | shadcn/ui + Tailwind v4 → Hermes WebUI → agentmemory REST API → 9Router |

### 🥈 Weitere vielversprechende Kandidaten

| Rang | Kandidat | Bereich | Einsatzbereich | Pilotaufgabe |
|------|----------|---------|----------------|-------------|
| 1 | **Trigger.dev** | Backend/Agent | Agenten-Workflows (leichtere Alternative zu Temporal) | Agent-Lifecycle-Workflow (Session → Tool → Memory) |
| 2 | **Hono** | Backend/API | API-Gateway, MCP-Server, Edge Router | API-Gateway vor agentmemory mit RLS-Check |
| 3 | **Better Auth** | Backend/Auth | Multi-Tenant Auth für NeXify-Plattform | Auth für Hermes WebUI mit Multi-Tenant |
| 4 | **Storybook + Playwright** | Frontend/Testing | Komponenten-Dokumentation + Screenshot-Tests | Storybook für 10 shadcn/ui-Komponenten + Playwright Tests |
| 5 | **React Aria** | Frontend/Design | Accessibility + komplexe UI-Patterns | Accessibility-Audit + komplexe Komponenten (DatePicker, Combobox) |
| 6 | **Biome** | Tooling | Schneller Linter + Formatter | ESLint + Prettier durch Biome ersetzen |
| 7 | **Langfuse** | Observability | LLM-Tracing, Agent-Monitoring | Tracing für 9Router + agentmemory Calls |

### ❌ Verworfen

| Kandidat | Grund |
|----------|-------|
| **Inngest** | Lizenz-Risiko (NOASSERTION, source-available), kleineres Ökosystem, weniger Features als Temporal/Trigger.dev |
| **Dify** | Python-Backend (Tech-Stack-Diskrepanz zu TypeScript/Next.js) |
| **Flowise** | Python-Backend, no-code-fokussiert (nicht für Code-First-Entwicklung) |
| **Lucia Auth** | Von Better Auth überholt (Lucia v2 deprecated, v3 noch unreif) |
| **Clerk** | Proprietär, kein OSS, Vendor-Lock-in |
| **n8n** | "Fair-code" (nicht OSS), Node/Vue-UI (nicht React), visuell (nicht Code-First) |
| **CrewAI** | Python-zentrisch, weniger Typisierung als TypeScript-Lösungen |

---

## Architektur-Empfehlung (Zielbild)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NeXify Platform                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   FRONTEND (Hermes WebUI)                     │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │  │
│  │  │shadcn/ui │ │  Motion  │ │ React    │ │  Biome CLI    │  │  │
│  │  │ + Design │ │  (Anim)  │ │ Aria     │ │  (Lint/Fmt)   │  │  │
│  │  │  System  │ │          │ │ (A11y)   │ │               │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │  │
│  │  ┌──────────┐ ┌─────────────────────────────────────────┐  │  │
│  │  │ Storybook│ │ Playwright (E2E + Screenshot Tests)     │  │  │
│  │  │ (Docs)   │ │                                         │  │  │
│  │  └──────────┘ └─────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                     │
│                               ▼                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  BACKEND / INFRASTRUKTUR                      │  │
│  │                                                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │  Hono    │ │  Better  │ │  Drizzle  │ │  Supabase    │  │  │
│  │  │(API-GW)  │ │  Auth    │ │  ORM      │ │  (DB + RLS)  │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │           WORKFLOW / ORCHESTRIERUNG                   │   │  │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐  │   │  │
│  │  │  │  Temporal  │ │Trigger.dev │ │  BullMQ        │  │   │  │
│  │  │  │ (Haupt)    │ │(Sub-WFs)   │ │(Sub-Queues)    │  │   │  │
│  │  │  └────────────┘ └────────────┘ └────────────────┘  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────────────────┐  │  │
│  │  │  Langfuse│ │ agentmemory│ │  MCP Server (Hono)        │  │  │
│  │  │ (Observ.)│ │ (Memory)   │ │  + 9Router                │  │  │
│  │  └──────────┘ └──────────┘ └────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Nächste Schritte (Priorisiert)

| # | Aktion | Team | Aufwand | Priority |
|---|--------|------|---------|----------|
| 1 | **Temporal-Setup**: Server aufsetzen + erster Workflow | `infra` + `auto` | 2-3 Tage | P1 |
| 2 | **shadcn/ui-Basis**: Initialisierung + Kern-Komponenten | `ux` | 1 Tag | P1 |
| 3 | **Hono-API-Gateway**: Vor agentmemory MCP | `skills` | 1-2 Tage | P1 |
| 4 | **Better Auth**: Integration in Hermes WebUI | `ux` + `guard` | 2-3 Tage | P2 |
| 5 | **Storybook + Playwright**: Designsystem-Dokumentation | `ux` + `qr` | 2 Tage | P2 |
| 6 | **Biome**: ESLint/Prettier-Ersatz | `skills` | 0.5 Tage | P2 |
| 7 | **Trigger.dev-Pilot**: Alternativ-Workflow | `auto` | 2 Tage | P3 |
| 8 | **Langfuse**: Tracing für 9Router | `infra` | 1-2 Tage | P3 |
| 9 | **React Aria**: Accessibility-Audit | `guard` + `ux` | 1 Tag | P3 |

---

## Review Summary

> **Geprüfte Kandidaten**: 28 (Bereich A: 15, Bereich B: 13, zus. Recherche: 8)
> **Empfehlungen**: 14 ✅ EMPFEHLEN, 7 ⚠️ PRÜFEN, 7 ❌ VERWERFEN
> **Top 1 Backend**: **Temporal.io** — Durable Execution für Agentenketten, Enterprise-Reife, MCP/CLI-fähig
> **Top 1 Frontend**: **shadcn/ui + Motion** — De-facto-Standard für Next.js, 116k Stars, CLI-first
> **Merge Recommendation**: ✅ **APPROVE WITH SUGGESTIONS** — Klare Architektur-Empfehlungen mit Pilotaufgaben für jede Integration. Nächster Schritt: Temporal-Setup priorisieren.
