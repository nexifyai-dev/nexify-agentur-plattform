# Noninteractive Execution Policy V1

**Status:** AKTIV
**Version:** 1.0
**Datum:** 2026-06-11
**Owner:** NeXify Systemmaster
**Scope:** nexify_internal

## Grundregel

```text
NEXIFY_NO_BLOCKING_CONFIRMATIONS = TRUE
NEXIFY_NONINTERACTIVE_BY_DEFAULT = TRUE
NEXIFY_SAFE_INTERNAL_AUTO_APPROVAL = TRUE
NEXIFY_GATE_TASKS_DO_NOT_BLOCK_SAFE_WORK = TRUE
```

## Entscheidungsmatrix

| Kategorie | Verhalten | Beispiel |
|---|---|---|
| READONLY | Automatisch | cat, ls, grep, git log, systemctl status |
| SAFE_INTERNAL | Automatisch | mkdir -p, echo > file, python3 harmlos |
| TEST | Automatisch | npm test, pytest, lint |
| DOCS | Automatisch | MD/JSON schreiben in /workspace/nexify |
| GATED | WAITING_FOR_APPROVAL | git push, docker compose down, rm -rf |
| SECRET_RISK | BLOCKED | Jeder Befehl mit Secret-Werten |
| DESTRUCTIVE | BLOCKED | docker system prune, git clean -fd, chmod -R 777 |
| EXTERNAL_WRITE | WAITING_FOR_APPROVAL | Production deploy, DNS change, Vercel deploy |
| UNKNOWN | REGISTER + HOLD | Unbekannter Prompt erfassen, abbrechen |

## Tool-spezifische Noninteractive-Regeln

### apt/apt-get
```bash
DEBIAN_FRONTEND=noninteractive
-y
-o Dpkg::Options::=--force-confdef
-o Dpkg::Options::=--force-confold
```

### npm/npx
```bash
--yes  # oder NPM_CONFIG_YES=true
# Keine globalen Installationen ohne Register/Evidence
```

### pip
```bash
PIP_DISABLE_PIP_VERSION_CHECK=1
# --yes nur bei uninstall
# venv bevorzugt
```

### docker
```bash
# --force nur bei klar erlaubten, ungefährlichen Befehlen
# Kein prune ohne Gate
# Kein compose down produktiv ohne Gate
```

### git
```bash
GIT_TERMINAL_PROMPT=0
# Kein push/merge/clean/reset hard ohne Gate
```

### gh
```bash
GH_PROMPT_DISABLED=1
# Keine Repo-/Secret-/Workflow-Schreibaktion ohne Gate
```

## Gate-Verfahren

Wenn eine Aktion gate-pflichtig ist:
1. Terminal blockiert NICHT
2. WAITING_FOR_APPROVAL-Status setzen
3. Approval-Paket schreiben: /workspace/nexify/11_gate/approval/
4. Risiko dokumentieren
5. Rollback dokumentieren
6. Sichere Nebenarbeiten fortsetzen
