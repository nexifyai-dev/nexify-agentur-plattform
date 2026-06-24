# NeXify AI — API-Katalog V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Backend / NeXify AI
**Klassifikation:** nexify_internal

---

## 1. Zweck

Zentraler Katalog aller API-Endpunkte, Services und Integrationen.

## 2. Interne APIs

| ID | API | Typ | Port/URL | Status |
|----|-----|-----|----------|--------|
| API-001 | Brain API | REST | `brain.nexifyai.cloud/api/brain` | 🟢 AKTIV |
| API-002 | Qdrant | gRPC + REST | `127.0.0.1:6333` | 🟢 AKTIV |
| API-003 | 9Router | OpenAI-kompatibel | `ai-router.nexifyai.cloud/v1` | 🟢 AKTIV |
| API-004 | Supabase REST | REST | `127.0.0.1:54321` | 🟢 AKTIV |
| API-005 | Supabase Auth | REST | `127.0.0.1:54321/auth/v1` | 🟢 AKTIV |
| API-006 | Supabase Realtime | WebSocket | `127.0.0.1:54321/realtime/v1` | 🟢 AKTIV |
| API-007 | Supabase Storage | REST | `127.0.0.1:54321/storage/v1` | 🟢 AKTIV |
| API-008 | Redis | RESP | `127.0.0.1:6379` | 🟢 AKTIV |
| API-009 | Nexify Proxy | HTTP | `127.0.0.1:32768` | 🟢 AKTIV |
| API-010 | **Nexify API** | FastAPI | `🔴 CRASH LOOP` | 🔴 OFFLINE |

## 3. Externe APIs

| ID | API | Typ | Status | Token |
|----|-----|-----|--------|-------|
| API-020 | GitHub | REST | 🟢 AKTIV | GitHub PAT |
| API-021 | Vercel | REST | 🟢 AKTIV | Vercel Token |
| API-022 | Cloudflare | REST | 🟢 AKTIV | Cloudflare API |
| API-023 | Resend | REST | 🟢 KONFIGURIERT | Resend API Key |
| API-024 | DeepSeek | OpenAI-komp. | 🟢 AKTIV | DeepSeek API Key |
| API-025 | NScale | OpenAI-komp. | 🟢 AKTIV | 9Router-routed |
| API-026 | Supabase Cloud | REST | 🟢 KONFIGURIERT | Supabase Key |
| API-027 | You.com | REST | 🟢 KEY_ROTIERT | You API Key |

## 4. Offene API-Punkte (SOLL)

| ID | API | Beschreibung | Priorität |
|----|-----|-------------|-----------|
| API-030 | Lead-API | Lead-Erfassung und -Qualifizierung | P1 |
| API-031 | Offer-API | Angebotsgenerierung und -Versand | P1 |
| API-032 | CRM-API | Kunden-, Kontakt- und Opportunity-Verwaltung | P1 |
| API-033 | Project-API | Projektanlage, -Status, -Timeline | P1 |
| API-034 | Workstation-API | Workstation-Backend-Services | P1 |
| API-035 | Chat-API | Chat-Session-Management | P1 |

## 5. OpenAPI-Pflicht

Jede neue API muss:
- OpenAPI 3.1 Spezifikation
- Endpunkt im API-Katalog
- Healthcheck-Endpoint (`/health`)
- Readiness-Probe
