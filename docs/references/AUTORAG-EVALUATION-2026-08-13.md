# AutoRAG-Evaluation — Pascal-Anfrage 2026-08-13 (github.com/Marker-Inc-Korea/AutoRAG)

**UPDATED:** 13.08.2026 06:10 (Europe/Berlin) — Erstfassung, Recherche-Quelle: GitHub-README main + LICENSE (Raw).

## 1. Was ist das Repo?

Zwei Produkte in einem Repo:

| Komponente | Technik | Lizenz | Status |
|---|---|---|---|
| **AutoRAG 2.0** (main) | TypeScript, Runtime Node ≥24 oder **Bun**; npm `@autorag/librarian` | **MIT** (NomaDamas / Marker Inc.) | aktive Entwicklung |
| **Legacy AutoRAG** (legacy/) | Python, `pip install AutoRAG` — RAG-AutoML (optimiert RAG-Pipelines via Evaluation) | **Apache-2.0** (separat in legacy/LICENSE) | Maintenance-Mode (Bugfixes, weiter PyPI-Releases) |

## 2. AutoRAG 2.0 — Funktionsweise

- „Self-evolving librarian agent": durchsucht Dokumentkollektionen, kuratiert Ergebnisse in nummerierte Wissenseinheiten mit Quellen-Verweisen (kein Raw-grep-Dump).
- Basis: **Pi-Agent-Loop** (github.com/earendil-works/pi-mono), konfiguriert als Librarian; Parent-Orchestrator delegiert an Explorer-Subagenten.
- Retrieval: BM25 (lexikalisch) + MinSync (semantisch) per Default; pluggable Vector-/Hybrid-Backends; `RetrievalMethodRegistry` + `ResultMerger` (Score-Normalisierung, Dedupe).
- **Self-Evolving Memory:** Feedback (`recordFeedbackByNumbers`) → lernt, welche Retrieval-Methode für welchen Query-Typ funktioniert.
- **Datasource-Skills:** Slack, Discord, Notion, GitHub Issues/PRs, Google Drive, Gmail/IMAP (himalaya), lokale Mail-Exports (.mbox/.eml).
- **Kein Provider-Default:** Modelle kommen aus der authentifizierten Runtime des Nutzers → konfigurierbar auf eigenen Endpoint.
- CLI: `autorag init/search/refresh/index/health/status`; Config `.autorag/`; Memory `memory.json`; Indexes workspace-lokal (`.autorag/`).
- Optionale Helfer: Jikji (find-first, Rust-Binary via cargo — optional), MinSync-Binary (GitHub-Release, autoInstall, abschaltbar).
- Installation: `bun install -g @autorag/librarian` (Git-Installs brauchen Bun fürs dist-Build).

## 3. Legacy AutoRAG (Python, legacy/)

- RAG-AutoML: automatische Optimierung von RAG-Pipelines (Chunking, Embedding, Retrieval, Rerank, Generation) über Evaluation mit Q&A-Datasets (Optuna-basiert).
- Zweck: beste RAG-Konfiguration für eigene Daten finden.
- Apache-2.0; `pip install AutoRAG`.

## 4. Bewertung für NeXifyAI

**Chancen:**
1. **Lizenz unproblematisch:** MIT (2.0) / Apache-2.0 (Legacy) — kommerzielle Nutzung frei.
2. **Konform zum Modell-Stack möglich:** AutoRAG 2.0 nutzt Nutzer-Runtime-Modelle → kann auf 9Router (`ds/deepseek-v4-flash`, OpenAI-kompatibel /v1) gezeigt werden; MinSync-Embedder konfigurierbar (`--embedder-*`) → 9Router-/v1/embeddings.
3. **Einsatzgebiet passend:** Wissenssuche über `/workspace/nexifyai/wiki` (LLM-Wiki), AgentMemory-Exports, Kundenprojekt-Dokus (a-bau KB, studienkolleg) — bessere kuratierte Antworten statt Roh-Treffer.
4. **Legacy-AutoML** könnte unsere LightRAG-/Retrieval-Konfiguration benchmarken (Chunk-Größen, Retrieval-Modi hybrid/local/global, Top-K).

**Risiken/Grenzen:**
1. **Neue Runtime-Dependency:** Bun/Node 24 im WebUI-Container nötig (RAM-Limit 8 GB Cgroup; Container derzeit ohne Bun).
2. **Multi-Agent-Kosten:** Pi-Loop mit Explorer-Subagenten = viele LLM-Calls (DeepSeek-Kosten, Latenz). Kein Ersatz für FTS5/AgentMemory-Kurzpfade.
3. **Überlappung:** LLM-Wiki-Panel + LightRAG + AgentMemory existieren — §1b „Erweitern statt Aushebeln": AutoRAG nur als ERGÄNZUNG (z.B. Wiki-Suche-Panel-Verbesserung), nicht als Ersatz.
4. **Selbst-evolvierendes Verhalten** = nicht-deterministisch → für Live-Kundenpfade (Chat-Antworten) erst nach Pilot-Gate.
5. Legacy-AutoML braucht Embedding-Provider — unser Stack: „keine externen Embeddings, lokal (FTS5)" (Pascal 2026-08-10) → Legacy-Optimierung nur mit 9Router-Embedding (Nicht-LLM-Ausnahme §2.3) oder lokalen Embeddings (prüfen).

**Empfehlung:**
- **Pilot (Container, isoliert):** `bun install -g @autorag/librarian` in separatem Werkzeug-Container/Venv; Config auf 9Router (`ds/deepseek-v4-flash`), MinSync-Embedder via 9Router-Embeddings; Test-Corpus = LLM-Wiki oder a-bau-FAQ; 10 definierte Queries; Qualität + Kosten messen (Kosten-Benchmark vs. LightRAG-Suche).
- **Gate:** Bessere Antwortqualität bei ≤2× Kosten → Kandidat für Wiki-Suche-Panel-Erweiterung (§1b Vollintegration: WebUI-Panel, /api/wiki-Erweiterung, CI, Doku, Skill). Sonst verwerfen.
- **Legacy-AutoML:** optional 1× als Benchmark gegen LightRAG nutzen (DSGVO: kein PII im Test-Dataset).
- **Nicht tun:** Produktionseinsatz in Kunden-Chat-Pfaden ohne Freigabe; kein Ersatz bestehender LightRAG-/AgentMemory-/FTS5-Ketten.

## 5. Quellen
- https://github.com/Marker-Inc-Korea/AutoRAG (README main) — Stand 2026-08-13
- LICENSE (main) = MIT; legacy/LICENSE = Apache-2.0
- https://github.com/earendil-works/pi-mono (Basis-Agent)
