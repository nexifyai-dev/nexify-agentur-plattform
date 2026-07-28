#!/usr/bin/env python3
# FILE: /scripts/soll-deviation-scan.py
# WHAT: IST vs SOLL Abweichungs-Scan für Agentic AI Mode (GitHub + GitLab OSS).
# WHY: Deviation Zero — automatisch erkennen, nicht manuell raten.
"""Scan repository and runtime hints for SOLL deviations. Exit 1 if any ERROR severity."""

from __future__ import annotations

import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


@dataclass
class Finding:
    severity: str  # ok | warn | error
    code: str
    message: str
    fix: str = ""


def http_ok(url: str, timeout: float = 2.0) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            return 200 <= resp.status < 500
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def git_tracked(path: str) -> bool:
    r = subprocess.run(
        ["git", "ls-files", "--error-unmatch", path],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    return r.returncode == 0


def load_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def scan() -> list[Finding]:
    findings: list[Finding] = []

    # --- Governance / Vorgaben ---
    required = [
        "AGENTS.md",
        "CHARTA.md",
        "agent-config.yaml",
        "docs/operations/REPO-SYNC-STRATEGY.md",
        "docs/operations/AGENTIC-AI-MODE.md",
        ".gitlab-ci.yml",
        ".github/workflows/mirror-to-gitlab.yml",
        "deploy/mcp/gitlab-oss/README.md",
        ".cursor/mcp.json.example",
    ]
    for rel in required:
        p = ROOT / rel
        if p.exists():
            findings.append(Finding("ok", "GOV-PRESENT", f"{rel} vorhanden"))
        else:
            findings.append(
                Finding("error", "GOV-MISSING", f"Pflichtdatei fehlt: {rel}", f"Anlegen: {rel}")
            )

    # --- MCP: secrets must not be tracked ---
    if git_tracked(".cursor/mcp.json"):
        findings.append(
            Finding(
                "error",
                "MCP-TRACKED",
                ".cursor/mcp.json ist git-getrackt (Secret-Risiko)",
                "git rm --cached .cursor/mcp.json && cp .cursor/mcp.json.example .cursor/mcp.json",
            )
        )
    else:
        findings.append(Finding("ok", "MCP-UNTRACKED", ".cursor/mcp.json nicht im Index"))

    example = load_json(ROOT / ".cursor/mcp.json.example") or {}
    servers = set((example.get("mcpServers") or {}).keys())
    for name in ("agentmemory", "context7", "gitlab-oss"):
        if name in servers:
            findings.append(Finding("ok", "MCP-EXAMPLE", f"mcp.json.example enthält {name}"))
        else:
            findings.append(
                Finding(
                    "error",
                    "MCP-EXAMPLE-MISSING",
                    f"mcp.json.example fehlt Server: {name}",
                    "deploy/mcp/gitlab-oss/README.md + .cursor/mcp.json.example ergänzen",
                )
            )

    # --- Model strategy: validate the authoritative governance statement ---
    governance = ROOT / "docs/governance/GOVERNANCE.md"
    governance_text = governance.read_text(encoding="utf-8") if governance.exists() else ""
    if all(term in governance_text for term in ("DeepSeek V4", "Upstage", "Migration geplant")):
        findings.append(
            Finding(
                "ok",
                "MODEL-GOVERNANCE",
                "Modellstrategie dokumentiert: DeepSeek aktiv, Upstage-Migration geplant",
            )
        )
    else:
        findings.append(
            Finding(
                "warn",
                "MODEL-GOVERNANCE",
                "Autoritative Modellstrategie in GOVERNANCE.md nicht eindeutig",
                "GOVERNANCE.md §5 gegen den realen 9Router-Stand abgleichen",
            )
        )

    # --- Dual VCS wiring ---
    if (ROOT / ".github/workflows/mirror-to-gitlab.yml").exists():
        mirror = (ROOT / ".github/workflows/mirror-to-gitlab.yml").read_text(encoding="utf-8")
        if "VPS_GITLAB_URL" in mirror:
            findings.append(Finding("ok", "VCS-MIRROR", "GitHub→GitLab Mirror-Workflow vorhanden"))
        else:
            findings.append(Finding("warn", "VCS-MIRROR", "mirror-to-gitlab.yml ohne VPS_GITLAB_URL Secret-Hook"))

    gitlab_ci = (ROOT / ".gitlab-ci.yml").read_text(encoding="utf-8") if (ROOT / ".gitlab-ci.yml").exists() else ""
    if "deploy:vps" in gitlab_ci:
        findings.append(Finding("ok", "VCS-GITLAB-CI", "GitLab CI deploy:vps Job definiert"))
    else:
        findings.append(Finding("warn", "VCS-GITLAB-CI", "GitLab CI ohne deploy:vps"))

    # --- Runtime (optional — Cloud-Agent oft ohne VPS) ---
    # GitLab: /-/health ist auf OSS oft 404 — sign_in / public API sind die richtigen Probes
    runtime_checks = [
        ("AgentMemory REST", "http://127.0.0.1:3111/agentmemory/livez", False),
        ("9Router", "http://127.0.0.1:20128/api/health", False),
        ("GitLab OSS UI", "https://gitlab.nexifyai.cloud/users/sign_in", True),
        ("GitLab OSS API", "https://gitlab.nexifyai.cloud/api/v4/projects?per_page=1", True),
    ]
    for label, url, expect_public in runtime_checks:
        if http_ok(url):
            findings.append(Finding("ok", "RUNTIME-UP", f"{label} erreichbar ({url})"))
        else:
            sev = "warn"
            findings.append(
                Finding(
                    sev,
                    "RUNTIME-DOWN",
                    f"{label} nicht erreichbar ({url})",
                    (
                        "CF-Tunnel / DNS prüfen"
                        if expect_public
                        else "Auf VPS/Remote-SSH prüfen; Cloud-Agent: Action blocked"
                    ),
                )
            )

    sync = ROOT / ".github/workflows/gitlab-sync.yml"
    if sync.exists():
        findings.append(
            Finding(
                "error",
                "VCS-DUPLICATE-SYNC",
                "Veralteter zweiter GitLab-Sync-Workflow vorhanden",
                "gitlab-sync.yml entfernen; mirror-to-gitlab.yml ist kanonisch",
            )
        )
    else:
        findings.append(Finding("ok", "VCS-SINGLE-MIRROR", "Genau ein kanonischer GitLab-Mirror"))

    # --- Excluded patterns ---
    agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8") if (ROOT / "AGENTS.md").exists() else ""
    if "awesome-hermes-agent" in agents and "ausgeschlossen" in agents.lower():
        findings.append(Finding("ok", "EXCLUDE-NOUS", "AGENTS.md schließt NousResearch awesome-hermes-agent aus"))
    else:
        findings.append(Finding("warn", "EXCLUDE-NOUS", "AGENTS.md ohne klaren NousResearch-Ausschluss"))

    if re.search(r"\bn8n\b", agents, re.I) and "abgeschafft" in agents.lower():
        findings.append(Finding("ok", "EXCLUDE-N8N", "AGENTS.md: n8n abgeschafft dokumentiert"))

    return findings


def main() -> int:
    findings = scan()
    errors = [f for f in findings if f.severity == "error"]
    warns = [f for f in findings if f.severity == "warn"]
    oks = [f for f in findings if f.severity == "ok"]

    print("# SOLL-Deviation-Scan\n")
    print(f"OK: {len(oks)} | WARN: {len(warns)} | ERROR: {len(errors)}\n")

    if errors:
        print("## ERRORS\n")
        for f in errors:
            print(f"- **{f.code}**: {f.message}")
            if f.fix:
                print(f"  - Fix: {f.fix}")

    if warns:
        print("\n## WARNINGS\n")
        for f in warns:
            print(f"- **{f.code}**: {f.message}")
            if f.fix:
                print(f"  - Fix: {f.fix}")

    # Machine-readable for autopilot
    out = ROOT / "test_reports" / "soll-deviation-scan.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps(
            {
                "ok": len(oks),
                "warn": len(warns),
                "error": len(errors),
                "findings": [f.__dict__ for f in findings],
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"\nReport: {out.relative_to(ROOT)}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
