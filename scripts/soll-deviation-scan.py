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


def parse_tunnel_ingress_hosts(path: Path) -> dict[str, str]:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return {}

    host_to_service: dict[str, str] = {}
    current_host = ""
    for raw in text.splitlines():
        line = raw.strip()
        host_match = re.match(r"^-\s*hostname:\s*(.+)$", line)
        if host_match:
            current_host = host_match.group(1).strip().strip('"').strip("'")
            continue
        service_match = re.match(r"^service:\s*(.+)$", line)
        if service_match and current_host:
            service = service_match.group(1).strip().strip('"').strip("'")
            host_to_service[current_host] = service
            current_host = ""
    return host_to_service


def has_expected_github_origin(remotes_raw: str) -> bool:
    patterns = (
        r"github\.com[:/]nexifyai-dev/nexify-agentur-plattform(?:\.git)?",
    )
    return any(re.search(pat, remotes_raw) for pat in patterns)


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

    # --- Tooling files for MCP + integrations ---
    tooling_required = [
        "scripts/mcp-health-codespace.sh",
        "scripts/setup-codespace-mcp.sh",
        "deploy/cloudflare/tunnel-ingress.yml",
    ]
    for rel in tooling_required:
        p = ROOT / rel
        if p.exists():
            findings.append(Finding("ok", "TOOLING-PRESENT", f"{rel} vorhanden"))
        else:
            findings.append(
                Finding(
                    "error",
                    "TOOLING-MISSING",
                    f"Pflicht-Tool fehlt: {rel}",
                    f"Anlegen: {rel}",
                )
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
    elif re.search(r"(?m)^\s*stage:\s*deploy\s*$", gitlab_ci):
        findings.append(Finding("ok", "VCS-GITLAB-CI", "GitLab CI enthält Deploy-Stage (abweichende Job-Namen)"))
    else:
        findings.append(Finding("warn", "VCS-GITLAB-CI", "GitLab CI ohne Deploy-Stage"))

    # --- Git remotes must include GitHub origin + GitLab OSS ---
    try:
        remotes_raw = subprocess.run(
            ["git", "remote", "-v"], cwd=ROOT, capture_output=True, text=True, check=False
        ).stdout
    except OSError:
        remotes_raw = ""
    if has_expected_github_origin(remotes_raw):
        findings.append(Finding("ok", "VCS-ORIGIN", "GitHub origin remote korrekt gesetzt"))
    else:
        findings.append(
            Finding(
                "warn",
                "VCS-ORIGIN",
                "GitHub origin remote nicht eindeutig auf nexify-agentur-plattform",
                "git remote set-url origin git@github.com:nexifyai-dev/nexify-agentur-plattform.git",
            )
        )
    if "gitlab.nexifyai.cloud" in remotes_raw:
        findings.append(Finding("ok", "VCS-GITLAB-REMOTE", "GitLab OSS remote vorhanden"))
    else:
        findings.append(
            Finding(
                "warn",
                "VCS-GITLAB-REMOTE",
                "GitLab OSS remote fehlt",
                "bash scripts/ensure-gitlab-remote.sh",
            )
        )

    # --- Tunnel ingress consistency: dashboard + webui as control-plane hosts ---
    host_to_service = parse_tunnel_ingress_hosts(ROOT / "deploy/cloudflare/tunnel-ingress.yml")

    for host in ("dashboard.nexifyai.cloud", "webui.nexifyai.cloud"):
        if host in host_to_service:
            findings.append(Finding("ok", "TUNNEL-HOST", f"Ingress enthält {host}"))
        else:
            findings.append(
                Finding(
                    "error",
                    "TUNNEL-HOST-MISSING",
                    f"Ingress fehlt: {host}",
                    "deploy/cloudflare/tunnel-ingress.yml aktualisieren",
                )
            )

    dashboard_service = host_to_service.get("dashboard.nexifyai.cloud", "")
    webui_service = host_to_service.get("webui.nexifyai.cloud", "")
    if dashboard_service and webui_service and dashboard_service != webui_service:
        findings.append(
            Finding(
                "warn",
                "CONTROL-PLANE-SPLIT",
                (
                    "dashboard.nexifyai.cloud und webui.nexifyai.cloud zeigen auf "
                    f"unterschiedliche Targets ({dashboard_service} vs {webui_service})"
                ),
                "Zentralisierung planen: Dashboard-Funktionen in WebUI integrieren oder Redirect über WebUI-Gateway",
            )
        )
    elif dashboard_service and webui_service:
        findings.append(Finding("ok", "CONTROL-PLANE-UNIFIED", "Dashboard/WebUI teilen dasselbe Target"))

    # --- Runtime (optional — Cloud-Agent oft ohne VPS) ---
    # GitLab: /-/health ist auf OSS oft 404 — sign_in / public API sind die richtigen Probes
    runtime_checks = [
        ("AgentMemory REST", "http://127.0.0.1:3111/agentmemory/livez", False),
        ("LightRAG", "http://127.0.0.1:9622/health", False),
        ("9Router", "http://127.0.0.1:20128/api/health", False),
        ("GitLab OSS UI", "https://gitlab.nexifyai.cloud/users/sign_in", True),
        ("GitLab OSS API", "https://gitlab.nexifyai.cloud/api/v4/projects?per_page=1", True),
        ("WebUI", "https://webui.nexifyai.cloud/health", True),
        ("Dashboard", "https://dashboard.nexifyai.cloud", True),
        ("Backend OpenAPI", "https://api.nexifyai.cloud/openapi.json", True),
        ("Grafana", "https://grafana.nexifyai.cloud/api/health", True),
        ("Prometheus", "https://prometheus.nexifyai.cloud/-/healthy", True),
        (
            "Codespace URL",
            "https://ubiquitous-space-pancake-q7r5qvj444wxc46pg.github.dev/",
            True,
        ),
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
