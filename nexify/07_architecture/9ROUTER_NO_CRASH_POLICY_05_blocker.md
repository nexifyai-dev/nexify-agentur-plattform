# 9Router No-Crash Policy

**Status:** AKTIV
**Datum:** 2026-06-11

## Grundsatz

nexifyai-combo-llm ist das systemweite Zielmodell.
Keine harte deepseek-reasoner-Einzelauswahl in CLI oder Auto-Chat.

## Fallback-Kaskade

1. nexifyai-combo-llm (Primär)
2. ds/deepseek-v4-flash (wenn Combo ausfällt)
3. ds/deepseek-reasoner (wenn Flash nicht reicht)
4. nscale/Qwen/Qwen2.5-Coder-32B-Instruct (Coding-Fallback)

## Blockierungsverbot

Keine Modellprüfung darf Auto-Chat blockieren.
Kein 9Router-Health-Timeout darf Systemmaster-Aufhängung verursachen.
