# PLAN — DeepSeek V4 Flash 0731 feinabstimmen auf NeXifyAI (System-CEO)

**Stand:** 07.08.2026 · **Ersteller:** Hermes (System-CEO) · **Status:** Entwurf zur Freigabe — P0/P1-Teile umgesetzt (siehe §11 Status)
**Ablage:** `docs/plans/` · **Governance:** Arbeitsvorgaben v2.3 (§1–§13), SOUL.md, HERMES.md

---

## 0. TL;DR

DeepSeek V4 Flash 0731 ist **Open-Weight (MIT-Lizenz)** → Fine-Tuning ist erlaubt und über
Drittanbieter-APIs möglich (DeepSeek selbst bietet **kein** offizielles FT mehr an). Aber:
**Feinabstimmung beginnt nicht mit FT, sondern mit der Prompt-/Kontext-/Memory-Schicht** —
dort liegen die größten, sofortigen Gewinne (Kosten, Vorgaben-Compliance, Konsistenz).
Der Plan gliedert sich in 4 Phasen: **P0 Sofort-Fixes → P1 Prompt-/Cache-Optimierung →
P2 geschlossene Lernschleife (Evals + Memory) → P3 Fine-Tuning** (erst nach messbarem
Bedarf, mit Kosten-Gate und Pascal-Freigabe).

---

## 1. AUFTRAG (Queen-Mode)

- **AUFTRAG:** DeepSeek V4 Flash 0731 dauerhaft auf NeXifyAI-System, Vorgaben (Arbeitsvorgaben
  v2.3 / SOUL.md) und CEO-Rolle (24/7, ≥50 K€/Monat, COO-Board-Loop) feinabstimmen; kontinuierliches
  Lernen + Optimierung institutionalisieren.
- **KONTEXT:** Hermes default-Profil läuft vollständig auf `openrouter/deepseek/deepseek-v4-flash-0731`
  via 9Router (Kern + ~30 Auxiliary-Rollen + MOA + Kompression). Vorgaben-Konformität ist
  Nicht-Verhandelbar; Kosten wachsen mit jedem Auxiliary-Call.
- **ZIEL (binär prüfbar):**
  - ✅ Alle Vorgaben-Dokumente auf v2.3 (inkl. E2E-Gegentest §5.4) synchron (Repo + SOUL.md)
  - ✅ Think-Max-Pflicht technisch durchgesetzt (reasoning_effort max beim CEO-Kern)
  - ✅ Messbare Eval-Suite (≥10 CEO-Szenarien, Vorgaben-Compliance ≥95 %) läuft wöchentlich
  - ✅ Lernschleife geschlossen: Session-Traces → kuratierte Lektionen → AgentMemory/LightRAG + Skills
  - ✅ FT-Entscheidung mit Daten getroffen (Eval-Lücken dokumentiert) oder FT-Run mit Gate freigegeben
- **UMFANG:** Hermes default-Profil, 9Router, AgentMemory/LightRAG, Cron-Suite, Repo-Doku.
- **AUSSCHLUSS:** Kein FT-Training auf dem VPS (Hardware reicht nicht, siehe §6.4); kein
  Provider-Wechsel des CEO-Kernmodells ohne Freigabe; keine Änderung an Kunden-Repos.
- **PRIORITÄT:** P0 (Sofort-Fixes kostenlos, verhindern Vorgaben-Drift + Kostenleck).
- **PRÜFVERFAHREN:** E2E-Smoke (System läuft unverändert nach jeder Änderung) + E2E-Gegentest
  (§5.4: Fehler-/Randfälle, Regression) + Eval-Suite.
- **ANNAHMEN:** OpenRouter/9Router-Preise bleiben stabil; HF-Token (`/etc/nexifyai/hf.env`) bleibt
  gültig; Cutover an Hermes-Produktion erst nach Endabnahme (AGENTS.md).

---

## 2. RECHERCHE-ERGEBNISSE (online, Primärquellen, 07.08.2026)

### 2.1 Modellfakten DeepSeek V4 Flash 0731 (E2/E3)

| Fakt | Wert | Quelle |
|---|---|---|
| Name | `deepseek-v4-flash` (alias = Revision **DeepSeek-V4-Flash-0731**) | api-docs.deepseek.com |
| Release | 31.07.2026 | openrouter.ai Modellseite |
| Architektur | Sparse MoE, **13B aktiv / 284B total** | OpenRouter |
| Kontext | **1.000.000 Tokens**, max Output 384.000 | 9Router `/v1/models` (capabilities) |
| Preis (OpenRouter) | $0.09 / $0.18 pro 1M (in/out) | OpenRouter |
| Lizenz | **MIT** (kommerziell, FT, Distillation erlaubt) | HF Model Card |
| Weights | `deepseek-ai/DeepSeek-V4-Flash-0731` (702k DL, 2.7k Likes); Unsloth-FT-Pack + GGUF vorhanden | HF API |
| Paper | arxiv:2606.19348 | HF Tags |
| Capabilities | tools ✅, reasoning ✅, thinkingFormat `deepseek`, thinkingCanDisable, kein Vision | 9Router |

### 2.2 Fine-Tuning-Landschaft (verifiziert)

- **DeepSeek offizielle API: KEIN Fine-Tuning mehr.** Sitemap (63 URLs) enthält keinen
  FT-Guide mehr; `/guides/fine_tuning` redirectet auf „Your First API Call". → FT nur über
  Open-Weight-Drittanbieter oder eigene GPU.
- **9Router: kein FT-Endpoint.** `/v1/fine_tunes` existiert nicht (UI-Fallback);
  `nexifyai` / `nexifyai-combo-llm` sind **Combo-Routing-Aliasse**, keine Fine-Tunes.
- **Together AI:** Fine-Tuning (LoRA + Full) inkl. **Bring-Your-Own-Model von HF** —
  DeepSeek-V4-Flash-0731 (MIT) damit direkt trainierbar. JSONL/Parquet-Dataset. (docs.together.ai)
- **Unsloth Studio:** lokales FT (Beta), GGUF/LoRA-Export, Unsloth-FT-Pack für V4-Flash-0731
  auf HF vorhanden → für spätere eigene GPU oder Unsloth-Cloud.
- **Novita AI:** FT-Angebot vorhanden (Doku-Index via `/docs/llms.txt`).
- **OpenRouter:** keine FT-Feature-Doku (nur Distillation-Cookbook); OpenRouter ist reiner Router.
- **Hardware-Grenze VPS:** 8C/32G RAM kann 284B-MoE nicht trainieren (Weights > 500 GB).
  FT = Cloud-GPU/API (Phase 3, Kosten-Gate).

### 2.3 DeepSeek-Betriebsregeln (wichtig für Kosten & Qualität)

- **Context Caching ist automatisch aktiv** (Disk-Cache, „Sliding Window Attention"-Präfix-Einheiten).
  Cache-Hit nur bei **vollständigem Präfix-Match** → System-Prompt + Tool-Schemata **stabil halten**;
  volatile Inhalte (Memory, Timestamp) ans **Ende** des Prompts. Hermes-Prompt-Assembly
  (stable → context → volatile) erfüllt das bereits — nicht aufbrechen. (api-docs.deepseek.com/guides/kv_cache)
- **Thinking-Mode:** default enabled, Effort-Mapping flash: `low→low, high→high, xhigh→high, max→max`.
  **Nur `max` erreicht volle Denktiefe** → Vorgabe „Think Max" = `reasoning_effort: max`.
  In Thinking-Mode werden temperature/top_p **ignoriert** (kein Fehler).
  Bei Tool-Calls muss `reasoning_content` in Folge-Turns mitgegeben werden (Hermes erledigt das). (thinking_mode)
- **Tool-Calls strict mode (Beta):** `/beta`-Base-URL + `strict:true` pro Function → JSON-Schema-
  Compliance. Option für 9Router/Hermes-Tools bei Halluzinations-Problemen. (tool_calls)

### 2.4 Hermes-eigene Lern-/Optimierungsmechanismen (Doku, E3 lokal)

- **Memory:** MEMORY.md (2.200 Zeichen) + USER.md (1.375) — frozen Snapshot je Session,
  per-Profil. Aktuell **100 % voll** → muss konsolidiert werden (Blockade für neues Lernen).
- **Memory-Provider (8):** Honcho, OpenViking, Mem0, Hindsight, Holographic, RetainDB, ByteRover,
  Supermemory — additiv zur Built-in-Memory. Wir nutzen custom `agentmemory` + LightRAG
  (dual_write) — bereits die richtige Richtung.
- **Skills-System:** progressive disclosure, `/learn` (Material → SKILL.md), agentskills.io-kompatibel.
- **Curator:** automatische Skill-Pflege (stale→archived), LLM-Konsolidierung (off by default;
  bei uns an: `interval_hours: 24, consolidate: true, auto_consolidate: true`).
- **Prompt-Assembly:** 3 Tier (stable/context/volatile) — Cache-stabil (s. 2.3).
- **Context Compression:** aktiv (target 50 %, Auxiliary = flash).
- **Weitere relevante Doku-Seiten:** `docs/user-guide/features/memory-providers`, `skills`,
  `curator`, `developer-guide/prompt-assembly` (alle abgerufen, s. Quellen).

### 2.5 Evals & Observability (Best Practice 2026)

- **Langfuse v4** (self-hosted GA, OTel-Ingest) als LLM-Observability; Pflicht-Metriken je Agent:
  Erfolgsrate/Task-Typ, Kosten/Lauf, Retry-/Loop-Muster, Latenz, Kontext-Auslastung. (references)
- **promptfoo** (OSS) als leichtgewichtige Eval-Suite für Prompt-/Verhaltens-Regression.
- **Guardrail-Praxis:** fehlgeschlagene Outputs als Feedback an den Agent zurückführen
  (nicht nur filtern). (references/agent-orchestration-landscape-2026.md)
- **Self-Improvement-Patterns:** Letta (24 k★, stateful agents), Reflektion/Consolidation-Loops —
  in Hermes bereits durch Curator + dual_write abgedeckt; wir schließen nur die Dataset-Lücke.

---

## 3. IST-ZUSTAND (VPS srv1243952, Evidenz E3)

| Bereich | Befund |
|---|---|
| Modell-Stack | ALLES auf `openrouter/deepseek/deepseek-v4-flash-0731` via 9Router (config.yaml): Kern, 30+ Auxiliary-Rollen (compression, vision, web_extract, skills_hub, approval, mcp, curator, goal_judge, kanban_decomposer, session_search, monitor, moa_* …), Embedding separat |
| reasoning_effort | überall `high` (Vorgabe: Think **Max**) → Abweichung |
| MOA | enabled, 3× Referenz = flash + Aggregator = flash → **kein Diversitätsgewinn, 4× Kosten** |
| Memory | `provider: agentmemory` + `dual_write` → LightRAG; URL 127.0.0.1:3111; LightRAG healthy (Port 9621) |
| Skills | write_approval + guard_agent_created aktiv; Curator 24 h + consolidate an |
| Cron | 31 Jobs (WebUI-Profil), u. a. CEO-Strategie 06:00, Tagesplaner 05:30, **Agenten-Evaluation & Qualität 07:00**, AgentMemory-Wissensabgleich 13:00, Agentengedächtnis-Konsolidierung 02:00, **ML-Fine-Tuning-Wissen So 10:30**, COO-Board-Loop alle 45 min |
| Hooks | nexify-loop-control (post_task) aktiv |
| Vorgaben | SOUL.md Stand 16.07.2026 + Direktiven 2026-08-06; **Repo-Doku „ARBEITSVORGABEN-v2.2.md" — v2.3 (E2E-Gegentest §5.4) fehlt dort** → Abweichung |
| 9Router | `/v1/models`: ds/ + openrouter/ DeepSeek, GLM, Poolside; kein FT-Endpoint; `nexifyai` = Combo |
| Secrets | HF-Token neu abgelegt: `/etc/nexifyai/hf.env` (root-only, verifiziert via whoami: PascalNeXify, Gated-Reads OK) |

---

## 4. GAP-LISTE

| ID | Gap | Prio | Blockiert durch |
|---|---|---|---|
| G1 | Vorgaben-Doku im Repo auf v2.3 (E2E-Gegentest) nachziehen | P0 | — |
| G2 | Think-Max nicht durchgesetzt (reasoning_effort high statt max) | P0 | 9Router-Durchreichung prüfen |
| G3 | MOA ohne Diversität = Kostenleck | P1 | Entscheidung: deaktivieren vs. Aggregator=pro |
| G4 | MEMORY.md 100 % voll → Lernblockade | P1 | Konsolidierung |
| G5 | Keine Eval-Suite für Vorgaben-Compliance/CEO-Verhalten | P1 | Phase 2 |
| G6 | Session-Traces → Lern-Dataset nicht kuratiert (FT-Voraussetzung) | P2 | Phase 2 |
| G7 | FT-Anbieter/Kosten nicht verifiziert (Together BYOM, Unsloth, Novita) | P2 | Freigabe-Gate |
| G8 | Stack v3.1: PLAN/REVIEW sollen solar-pro3 sein — Config nutzt überall flash | P2 | ✅ ERLEDIGT (2026-08-07, Pascal-Direktive DeepSeek-only: PLAN/REVIEW = flash, solar-pro3 entfernt) |
| G9 | Auxiliary-Kosten unkontrolliert (jede Rolle = eigener Call auf Flash) | P2 | Phase 1 |

---

## 5. STRATEGIE — 3-Ebenen-Modell „Feinabstimmung"

```
Ebene 1  PROMPT & KONTEXT   (Sofort, ~0 €)   Vorgaben-Treue, Cache-Stabilität, Few-Shot
Ebene 2  LERNEN & MESSEN    (Wochen 1–2)     Memory-Pipeline, Evals, Feedback-Loop
Ebene 3  FINE-TUNING        (ab Woche 3, Gate) Nur wenn Evals Lücken zeigen; LoRA via Cloud-API
```

Prinzip: **Kein FT ohne Evidenz.** FT verschiebt Gewichte; Vorgaben-Drift (z. B. WhatsApp-Guard)
ist danach schwerer zu korrigieren als im Prompt. Erst Ebene 1+2 wirken lassen, messen, dann
entscheiden.

---

## 6. MASSNAHMEN-PHASEN

### PHASE 0 — Sofort-Fixes (heute, P0)

1. **Vorgaben-Sync v2.3:** `docs/standards/ARBEITSVORGABEN-v2.3.md` anlegen (aus v2.2 + §5.4
   E2E-Gegentest), SOUL.md-Verweis aktualisieren, ZENTRALE-KONFIGURATION.md ergänzen.
   Prüfung: `verify-vorgaben-sync.py` (Skill nexify-platform) → grün.
2. **Think-Max:** `agent.reasoning_effort: max` für CEO-Kern setzen; testen, ob 9Router
   `reasoning_effort=max` an DeepSeek durchreicht (Mapping max→max verifiziert). Auxiliary-Rollen
   bleiben `high` (Kosten; Denktiefe dort nicht nötig).
3. **MOA-Entscheidung:** Default: **MOA deaktivieren** (identische Modelle = 4× Kosten ohne
   Nutzen) ODER Aggregator auf `deepseek-v4-pro` + Referenzen flash (Diversität). Empfehlung:
   erst deaktivieren, Effekt in Eval-Suite messen.
4. **Gegentest-Pflicht** in Hooks/Cron verankern (E2E-Gegentest nach jeder Behebung).

### PHASE 1 — Prompt-/Context-Engineering (Woche 1)

1. **Cache-Stabilität sichern:** System-Prompt-Änderungen **gebündelt** (1×/Woche), nicht
   täglich; volatile Teile (Memory/Timestamp) bleiben am Ende (DeepSeek-Präfix-Cache).
   Messung: Cache-Hit-Rate via 9Router/OpenRouter-Nutzung.
2. **Few-Shot-Verstärkung:** 3–5 kanonische CEO-Beispiele (Vorgaben-konform) als
   SOUL.md-Anhang/Kontext-Datei (`docs/standards/CEO-FEWSHOT.md`): je 1 Muster für
   Recherchepflicht, E2E-Gegentest, Eskalation, WhatsApp-Guard, Terse-Stil.
3. **Auxiliary-Tiering (Stack v3.2, DeepSeek-only):** alle plan/review-nahen Rollen
   (goal_judge, monitor, background_review, profile_describer) auf `deepseek-v4-flash-0731`;
   nur `curator` + `moa_aggregator` auf `deepseek-v4-pro` (hochkomplexe Analyse).
4. **Kosten-Log:** pro Auxiliary-Rolle Kosten/Tag nach 7 Tagen messen → G9 entscheiden.

### PHASE 2 — Geschlossene Lernschleife (Woche 1–2)

1. **Memory entlasten:** MEMORY.md konsolidieren (Einträge straffen/mergen, 100 % → ≤80 %),
   Wissenswertes in AgentMemory/LightRAG verschieben (die sind unbegrenzt).
2. **Lern-Pipeline (Cron „Agentengedächtnis-Konsolidierung" 02:00 erweitern):**
   - Session-Traces (Session-DB) → `session_search` → Lektionen extrahieren
   - Kuratierte Lektionen → AgentMemory + LightRAG (dual_write läuft) + ggf. Skills (`/learn`)
   - Fehlgeschlagene Tasks → REJECTED-Lektionen (§6.4-Format) — Root-Cause-Pflicht
3. **Eval-Suite aufbauen (promptooff oder leichtgewichtig als Cron):**
   - ≥10 CEO-Szenarien: Recherchepflicht, Gegentest, Eskalation, WhatsApp-Guard, Angebots-Mail,
     Terse-Stil, Vorgaben-Compliance, Kostenbewusstsein, Kunden-Ton, Tool-Nutzung
   - Ausführung gegen Live-System (read-only), binäre Auswertung; Lauf wöchentlich,
     Ergebnis nach `~/.hermes/cron/output/` + AgentMemory
   - Kopplung an bestehenden Cron „Agenten-Evaluation & Qualität" (07:00)
4. **Feedback-Loop:** Eval-Fails → automatisch Issue auf Kanban `nexify` (Dispatcher) →
   Behebung → Gegentest → erneuter Eval (nächster Lauf).

### PHASE 3 — Fine-Tuning (ab Woche 3, GATE) — STAND 07.08.2026 ABENDS (Recherche-Update)

**Gate-Bedingung (alle drei):**
- Eval-Suite läuft ≥2 Wochen, dokumentierte Lücken, die per Prompt/Memory nicht schließbar sind
- Kuratiertes Dataset ≥ 300–1.000 hochwertige Paare (Vorgaben-konforme CEO-Traces, aus Phase 2)
- Pascal-Freigabe + Budget-Gate (Kosten vorab beim Anbieter verifiziert) + **FT-Konto/Key (Together/Unsloth — aktuell KEINE Keys auf dem VPS, verifiziert 21:55)**

**Umsetzung (konkretisiert nach Online-Recherche 07.08.2026, ≥3 Quellen):**
1. **Dataset:** JSONL (OpenAI-Chat-Format, mit Tool-Call-Traces!) aus: kuratierte CEO-Traces (Eval-bestanden), AgentMemory-Lektionen, Vorgaben-Few-Shots, `task-log.jsonl` + `changes.jsonl` (existieren auf VPS), Eval-Suite-Traces. Qualität > Quantität (LIMA: 1.000 kuratierte > 100.000 noisy); Dedup; SFT- und DPO-Split getrennt anlegen.
2. **Trainings-Stack 2026 (Standard, mehrfach belegt):** **SFT zuerst, dann DPO** — DPO ersetzt RLHF (kein Reward-Model, ein Trainingsschritt, vergleichbare Qualität; ORPO als Ein-Schritt-Alternative; NIE SFT+DPO in einem Schritt kombinieren). **QLoRA als Default** (4-bit NF4, LoRA-Adapters, ~0,1 % Parameter): r=32–64 für Domain-/Rollen-Shift, alpha=2×r, Zielmodule q_proj/v_proj zuerst (MoE-schonend: Experten-LoRA wo unterstützt), epochs 1–3, LR ~1e-4.
3. **Anbieter (Auswahl, Kosten vorab verifizieren):**
   - **Together AI** (LoRA/Full, BYOM von HF `deepseek-ai/DeepSeek-V4-Flash-0731`; FT-Modell direkt bei Together hostbar → als Provider in 9Router registrieren) — Primärkandidat
   - **QLoRA auf gemieteter GPU** (RunPod/Vast, 1× A100 80 GB; Referenz: Llama-3-8B, 50k Beispiele, 6 h ≈ 12–50 $; unser 13B-aktiv-MoE: Faktor 2–3) — kostenoptimale Alternative, erfordert aber eigenes Serving (vLLM mit LoRA hot-swap, Adapter ~30 MB)
   - **Unsloth Studio** (LoRA/GGUF-Export) als Alternative; On-prem ausgeschlossen (284B-MoE > 31 GB RAM, keine GPU — verifiziert)
4. **Rollout:** FT-Modell als eigener OpenAI-kompatibler Endpoint in 9Router (z. B. `custom:ft-ceo`), erst als **Shadow/Nebenprofil** — A/B gegen Flash-Basis über 1 Woche (Eval-Suite + Live-Beobachtung), dann Cutover nach Endabnahme (AGENTS.md). **Rollback = 1 Config-Zeile** (Basis-Modell bleibt konfiguriert).
5. **Evaluation:** gleiche Eval-Suite vorher/nachher + **Catastrophic-Forgetting-Check** (Basis-Szenarien müssen stabil bleiben — hjlabs-Playbook) + E2E-Gegentest (§5.4) inkl. Negativfälle (Guards!).

---

## 7. ABHÄNGIGKEITEN-MATRIX

| Schritt | hängt ab von | Status |
|---|---|---|
| P0.1 Vorgaben-Sync | Repo-Write-Zugriff | offen (machbar) |
| P0.2 Think-Max | 9Router-Durchreichung max | prüfen (E2E-Test) |
| P0.3 MOA | Entscheidung Pascal/Hermes | offen |
| P2.3 Eval-Suite | Phase 1 stabil | offen |
| P3 Dataset | Phase 2 (≥2 Wochen Traces) | offen |
| P3 FT-Run | Gate + Kosten-Freigabe | offen |
| Extern | HF-Token (gelegt ✅), Together/Unsloth-Konto (neu), ggf. Budget | teils offen |

## 8. RISIKEN & MITIGATION

| Risiko | Wahrsch. | Auswirkung | Mitigation |
|---|---|---|---|
| FT verschlechtert Vorgaben-Compliance | mittel | hoch | Evals vor/nach; FT nur mit Gate; Rollback = Config-Zeile |
| Vorgaben-Drift durch volatile Prompts | mittel | mittel | Cache-Stabilität, gebündelte Änderungen |
| Kosten-Anstieg (Auxiliary × max) | hoch | mittel | Tiering (flash/pro), MOA-Deaktivierung, Kosten-Log |
| 9Router reicht max nicht durch | mittel | mittel | E2E-Test mit `thinking`-Payload; Fallback: budget_tokens 16000 |
| Dataset kontaminiert (schlechte Traces) | mittel | hoch | Kuratierung + Dedup + Eval-Filter vor Training |

## 9. PRÜFVERFAHREN (Pflicht, §5)

- **Smoke:** Gateway/9Router/AgentMemory/LightRAG healthy nach jeder Phase (Ports 8644/20128/3111/9621).
- **E2E:** 1 kompletter CEO-Zyklus (COO-Board-Loop-Trigger → Recherche → Bericht → Memory-Write).
- **E2E-Gegentest (§5.4):** Negativfälle (Vorgaben-Verstoß-Prompt → Guard greift; WhatsApp-Sperre;
  Eskalationsfall), Datenintegrität (Memory-Writes ohne Duplikate), Rollback (Config-Backup-Restore),
  Regression (bestehende Cron-Jobs laufen unverändert).
- **Ergebnis binär:** `GEGENTEST BESTANDEN / FEHLGESCHLAGEN` je Phase; Ablage Betriebshandbuch + AgentMemory.

## 10. QUELLEN (07.08.2026 abgerufen)

1. api-docs.deepseek.com (First API Call, guides/kv_cache, guides/thinking_mode, guides/tool_calls, sitemap.xml)
2. openrouter.ai/deepseek/deepseek-v4-flash-0731 (Preise, Architektur, Release)
3. huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Flash-0731 + unsloth/DeepSeek-V4-Flash-0731 (Lizenz MIT, Downloads)
4. docs.together.ai/docs/fine-tuning (LoRA/Full, BYOM von HF)
5. unslothai/unsloth README (Studio, FT, Export)
6. hermes-agent.nousresearch.com/docs (memory, memory-providers, skills, curator, prompt-assembly)
7. GitHub-Suche: letta-ai/letta (24 k★), DeepSeek-V4-Flash-FT-Repos
8. Lokal: /root/.hermes/config.yaml, SOUL.md, cron/jobs.json (31 Jobs), 9Router /v1/models, LightRAG /health

---

## 11. UMSETZUNGSSTATUS (07.08.2026, E3)

| Schritt | Status | Evidenz |
|---|---|---|
| P0.1 Vorgaben-Sync v2.3 (ARBEITSVORGABEN-v2.3.md im Repo, SOUL.md-Verweis, Hub-Referenz, verify-Skript-Pfade fix) | ✅ FERTIG | verify-vorgaben-sync.py: GEGENTEST BESTANDEN (Exit 0) |
| P0.2 Think-Max: reasoning_effort max in beiden Hermes-Homes; 9Router-Durchreichung | ✅ FERTIG | Live-Call E3: HTTP 200, reasoning-Tokens, Cache-Hit 768/781 |
| **Abweichungs-Fix (Eval-Befund): WhatsApp-Guard fehlte in injizierter SOUL.md** — §0a mit harter Ausführungsformel ergänzt (vorher nur in Host-Kurzfassung) | ✅ FERTIG | Eval whatsapp_guard: ❌→✅; Jailbreak-Gegentest: Guard-Formel wörtlich, GEGENTEST BESTANDEN |
| G4 MEMORY.md-Entlastung (100 % → 99 % mit FT-Wissen, Compression-Eintrag in Skill-Ref verschoben) | ✅ FERTIG | 2181/2200 Zeichen |
| P2.3 CEO-Eval-Suite v1 (`/workspace/nexifyai/scripts/ceo-eval-suite.py`, 8 Szenarien, SOUL+USER-Prompt-Nachbau, 9Router, max) | ✅ FERTIG | 1. Lauf 50 % → nach Check-Kalibrierung 100 % (8/8); Negativkontrolle ok |
| Cron-Anbindung: Job „Agenten-Evaluation & Qualität" (07:00) führt Suite aus | ✅ FERTIG | jobs.json (Backup .bak-20260807-evalsuite), 31 Jobs intakt |
| P0.3 MOA (deaktivieren vs. Aggregator=pro) | ✅ FERTIG (Entscheidung: deaktivieren) | Keine Log-Nutzung nachweisbar; 3× identische Referenz + Aggregator = 4× Kosten ohne Diversität; /root-Config `moa.enabled: false` (Backup .bak-20260807-moa); WebUI-Config hat keinen MOA-Block (default off); moa_aggregator auf v4-pro getiered für Reaktivierung |
| P1.3 Auxiliary-Tiering (Stack v3.2, DeepSeek-only) | ✅ FERTIG (revidiert) | Pascal-Direktive 2026-08-07: solar-pro3-Tiering zurückgenommen; alle Aux-Rollen → 9Router deepseek-v4-flash-0731 (Backup .bak-20260807-deepseekonly); curator/moa_aggregator → deepseek-v4-pro (effort max) |
| P1.2 Few-Shot CEO-FEWSHOT.md | ⏸ OFFEN | Phase 1; Eval-Suite zeigt Guards greifen — Few-Shot nur bei Eval-Lücken |
| P2.1 Lern-Pipeline (Traces→Lektionen, REJECTED-Format) | ✅ FERTIG (Anbindung) | Cron „AgentMemory-Wissensabgleich" (13:00) um Session-Traces-Durchsuchung erweitert (Backup jobs.json.bak-20260807-traces); bestehende Konsolidierungs-Jobs 02:00/13:00 decken Berichte→Memory ab |
| P3 Fine-Tuning (Together BYOM / Unsloth, LoRA) | ⏸ OFFEN | Gate: Evals ≥2 Wochen + Dataset ≥300 Paare + Kosten-Freigabe + FT-Key (alle Keys fehlen, verifiziert 21:55) |

---

## 12. DAUERHAFTES LERNEN & OPTIMIERUNG — CONTINUAL-LEARNING-ARCHITEKTUR (Recherche-Update 07.08.2026 abends)

**Leitbild (Quellenlage 2026):** „Fine-tuning is for form, RAG is for facts" — dauerhaftes Lernen = **mehrschichtig**: (a) gewichtsfreie Lernschicht (Memory/RAG/Skills — läuft, Memento-Paradigma: UCL/Huawei zeigen, dass Agenten ohne Gewichts-FT aus Erfahrung lernen können — das IST unsere AgentMemory+LightRAG+Skills-Architektur), (b) periodische Gewichts-Updates (LoRA SFT→DPO) nur für **stabiles Verhalten** (Rolle, Vorgaben-Treue, Ton, Format) — niemals für Fakten/Marktwissen (dafür RAG). (c) Replay-/Konsolidierungs-Pipeline gegen Catastrophic Forgetting (MSSR: Memory-Aware Adaptive Replay).

### 12.1 Zwei-Schichten-Modell
```
SCHICHT A (gewichtsfrei, täglich, läuft):   Lernen via Kontext
  AgentMemory (Lektionen) + LightRAG (Wissen) + Skills (Prozeduren) + Curator (Konsolidierung)
  + Eval-Suite (07:00) + Feedback-Loop (Eval-Fails → Kanban → Fix → Gegentest)
  → „Memento-Paradigma": Verbesserung ohne Gewichtsänderung

SCHICHT B (Gewichte, quartalsweise/zweimonatlich, Gate):  Lernen via Training
  Pipeline: Session-Traces → kuratierte Episoden (SFT-Paare + DPO-Preferenz-Paare)
  → QLoRA SFT → DPO → Evals (vor/nach + Forgetting-Check) → Shadow-A/B → Cutover
  → nur für: Rollenverhalten, Vorgaben-Treue, Terse-Stil, Tool-Disziplin
```

### 12.2 Replay- & Konsolidierungs-Pipeline (gegen Vergessen, MSSR-Muster)
1. **Episoden-Export (wöchentlich, Cron):** Session-DB + task-log.jsonl + Eval-Traces → extrahierte, bewertete Episoden (Erfolg/Fehlschlag) → kuratierter Replay-Puffer (`/workspace/nexifyai/data/ft/`).
2. **Replay-Sampling:** Beim periodischen FT wird der Puffer mit **Baseline-Kernepisoden** gemischt (Vorgaben-Guards, Kern-Szenarien) — verhindert, dass neue Daten alte Fähigkeiten überschreiben (MSSR: memory-aware replay).
3. **Konsolidierung (monatlich):** veraltete Episoden raus (z. B. gelöste Workarounds), dedupliziert, Versioniert (Dataset-Versionen in Git).
4. **Forgetting-Guard:** Die Eval-Suite-Basis-Szenarien (Guards, Terse, Gegentest) laufen in JEDER FT-Evaluation — Regression dort = Abbruch des Rolls.

### 12.3 Lern-Steuerung & Metriken
- **Trigger für Schicht B:** Eval-Suite zeigt ≥2 Wochen persistente Lücken (z. B. <95 % Compliance) ODER wiederkehrende Verhaltensabweichung, die per Prompt/Memory nicht schließbar ist.
- **Metriken (laufend, Langfuse/Logs):** Eval-Score je Szenario (wöchentlich), Lektionen/Woche (AgentMemory), Retry-/Loop-Muster, Cache-Hit-Rate, Kosten/Tag je Rolle.
- **Kein Auto-FT:** Jeder Schicht-B-Lauf braucht das Gate (Eval-Evidenz + Dataset ≥300 Paare + Pascal-Freigabe + Budget).

### 12.4 Sofort umsetzbar (ohne FT, diese Woche) — STATUS 22:20 (umgesetzt)
1. ✅ **Dataset-Pipeline läuft:** `ft-dataset-export.py` (16.056 Roh-Episoden aus AgentMemory) + `ft-curate.py` (Kuratierung v2): **29 kuratierte Lektionen + 2.591 Trace-Nachrichten** aus 55 Session-JSONs (Quelle: /root/.hermes/webui/sessions, 989 Dateien, ~26k Messages/Stichprobe; Format role/content/timestamp mit Tool-Spuren). Gate-Ziel ≥300 Paare **erreicht** — SFT-/DPO-Split-Kuratierung (Erfolgs-/Fehlschlag-Kennzeichnung) folgt bei Gate-Öffnung.
2. Eval-Suite 8 Szenarien läuft (07:00) — Erweiterung auf 10+ (Preis-/Kosten-Disziplin, Tool-Disziplin) als Task auf Board.
3. Eval-Ergebnisse wöchentlich nach `~/.hermes/cron/output/` + ZK (Historie für Gate-Evidenz).
4. FT-Konto-Vorbereitung: Together-Konto (Pascal) — Key dann in hermes.env; bis dahin P3 blockiert.
5. ✅ **Kosten-Fakt (verifiziert 22:15):** Together-LoRA-FT ab **$0,48/1M Tokens** (≤16B-Bracket; unser Modell = 13B aktiv) bis ~$2/1M je Methode (DPO teurer als SFT); Full-FT bis $8/1M. Bei 1M-Token-Dataset: **FT-Run < $5**; laufender Kostenpunkt ist das Endpoint-Serving des FT-Modells (Serverless-Preis ≈ Modellklasse). → Kosten-Gate ist damit rein formal; Entscheidungskriterium ist die Eval-Evidenz, nicht das Budget.

### 12.5 Quellen (neu, 07.08.2026 abends)
| Quelle | Inhalt |
|---|---|
| sukruyusufkaya.com DPO/LoRA/QLoRA-Guide 2026 | Prompt+RAG zuerst; Stack base→SFT→DPO; „FT=Form, RAG=Fakten" |
| hjlabs.in FT-Best-Practices 2026 (11 Steps, 29.07.2026) | LoRA r=8-16 Chat / r=32-64 Domain; QLoRA-Default; DPO>RLHF; Forgetting-Evals; vLLM hot-swap; ~$12/6h A100 |
| technologypulse.app FT-Guide 2026 (23.05.2026) | QLoRA 70B auf 1×A100; SFT→DPO nie kombinieren; Data quality > Technik; Synthetic Data |
| KevinAi18/llm-finetuning-toolkit (GitHub) | Unified FT-Toolkit 100+ Modelle (LoRA/QLoRA/DPO/PPO/ORPO) |
| qianlima-lab/awesome-lifelong-llm-agent (TPAMI 2026) | Lifelong-Learning-Module Perception/Memory/Action für LLM-Agenten |
| MSSR arxiv 2603.09892 | Memory-Aware Adaptive Replay für Continual FT (gegen Catastrophic Forgetting) |
| Memento (UCL/Huawei, GitHub) | LLM-Agenten ohne Gewichts-FT lernen (Memory-basiert, Planner-Executor, MCP) — bestätigt unsere Architektur |
| LifelongAgentBench | Evaluation lebenslang lernender Agenten (Group Self-Consistency) |
| arxiv 2501.07278 | Roadmap Lifelong Learning LLM-Agents |
