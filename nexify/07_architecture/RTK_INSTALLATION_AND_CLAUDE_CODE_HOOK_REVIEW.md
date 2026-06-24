# RTK — Installation & Claude Code Hook Review

> Stand: 2026-06-12

## Was ist RTK?

Single Rust Binary CLI Proxy. Reduziert LLM-Tokenverbrauch durch Tool-Output-Kompression um 60-90%. Läuft als Hook vor Claude Code.

## Installation

```bash
# Homebrew (macOS)
brew install rtk

# Linux/macOS Quick Install
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

# Cargo
cargo install rtk
```

## Integration in Claude Code

RTK installiert einen Hook (`rtk init -g`), der Tool-Outputs filtert/komprimiert bevor sie ins LLM-Kontextfenster gehen.

Betroffene Commands: ls, tree, cat, grep, rg, git status/diff/log, pytest, npm test, cargo test, docker ps/logs, ruff, tsc

## Sicherheit für API-Responses

RTK wirkt auf **Tool-Outputs**, nicht auf API-Responses.
RTK ist **sicher für Claude Code API/SSE-Verbindungen**.
RTK verändert keine SSE-Streams.

## Empfehlung

RTK kann installiert werden, sobald getestet ist dass der Hook:
1. Tool-Outputs korrekt komprimiert
2. Keine Secrets in Outputs belässt
3. Bei Fehlern graceful degraded
