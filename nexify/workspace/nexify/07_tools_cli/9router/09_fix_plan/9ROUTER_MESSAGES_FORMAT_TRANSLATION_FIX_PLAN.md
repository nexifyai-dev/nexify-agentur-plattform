# 9Router /v1/messages Format-Translation — Fix Plan

> Stand: 2026-06-12
> Status: ANALYSIERT

## Problem

9Router `/v1/messages` (Anthropic-kompatibler Endpoint) gibt bei `stream=false`
OpenAI-`chat.completion`-Format zurück statt Anthropic-Message-Format.

## Warum?

1. `detectFormatByEndpoint()` erkennt `/v1/messages` korrekt als `FORMATS.CLAUDE`.
2. 9Router **übersetzt den Input** Claude → OpenAI für DeepSeek (weil DeepSeek nur OpenAI-API spricht).
3. Die **Ausgabe** wird von DeepSeek in OpenAI-Format geliefert.
4. 9Router übersetzt die Ausgabe **nicht zurück** ins Anthropic-Format für den Client.
5. Claude Code Client erwartet Anthropic-Format → kann `chat.completion` nicht parsen → "malformed HTTP 200".

## Lösungsoptionen

| Option | Beschreibung | Aufwand | Risiko |
|---|---|---|---|
| **A** | 9Router so konfigurieren, dass `/v1/messages` Output in Anthropic-Format rückübersetzt wird | Mittel | Mittel |
| **B** | Claude Code nur mit `stream=true` betreiben (SSE-Format wird korrekt übersetzt) | Gering | Gering — stream=true in Logs sauber |
| **C** | Eigenen Adapter vor 9Router für `/v1/messages` schalten | Hoch | Hoch |
| **D** | 9Router-Option "preserveOutputFormat" setzen (falls existiert) | Gering | Unbekannt |
| **E** | Subagents via `/v1/chat/completions` mit `stream=true` + OpenAI-kompatiblem Payload | Gering | Mittel |

## Empfehlung

**Option B + E**: Claude Code stream=true (Standard) und Subagents via kompatiblen Pfad.
9Router SSE-Streaming funktioniert korrekt — nur non-stream gibt falsches Format.
