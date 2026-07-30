# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/assessor.py
# NIR: 28.07.2026 10:50
# NAME: NeXifyAI Inbox-Triage
# WHAT: IST/SOLL-Assessment — Systemzustand gegen Gesamtkonzept prüfen
# WHY: Sense-Phase des 5-Phasen-Kreislaufs
# BEST-PRACTICE: Caching (TTL 5min), Delta-Erkennung, parallele Health-Checks
# PITFALL: V-16: Nicht nur HTTP-Checks — Docker + systemd auch prüfen
# DEPENDS: requests, subprocess, agentmemory REST API
# DOCS-REF: /opt/nexifyai/docs/architecture/SOLL-GESAMTKONZEPT.md

"""IST/SOLL Assessment — System Health Check."""

import json
import os
import subprocess
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

import requests

AGENTMEMORY_URL = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111")

# Optimierung: Caching — Health-Checks nicht öfter als alle 5 Minuten
_CACHE_TTL = 300  # Sekunden
_cache: dict[str, tuple[float, Any]] = {}


def _cached(key: str, factory, ttl: int = _CACHE_TTL):
    """Cache mit TTL — vermeidet unnötige Health-Calls."""
    now = time.time()
    if key in _cache:
        cached_at, value = _cache[key]
        if now - cached_at < ttl:
            return value
    value = factory()
    _cache[key] = (now, value)
    return value


@dataclass
class SystemCheck:
    name: str
    status: str  # ok, degraded, down, unknown
    detail: str = ""
    checked_at: str = ""


@dataclass
class ISTSOLLReport:
    checks: list[SystemCheck] = field(default_factory=list)
    gaps: list[str] = field(default_factory=list)
    recommendations: list[str] = field(default_factory=list)
    created_at: str = ""
    cached: bool = False

    def to_dict(self) -> dict:
        return {
            "checks": [
                {
                    "name": c.name,
                    "status": c.status,
                    "detail": c.detail,
                    "checked_at": c.checked_at,
                }
                for c in self.checks
            ],
            "gaps": self.gaps,
            "recommendations": self.recommendations,
            "created_at": self.created_at,
            "cached": self.cached,
            "summary": f"{sum(1 for c in self.checks if c.status == 'ok')}/{len(self.checks)} OK, {len(self.gaps)} Gaps",
        }


def check_endpoint(url: str, timeout: int = 5) -> SystemCheck:
    """HTTP-Health-Endpoint prüfen."""
    now = datetime.now(timezone.utc).isoformat()
    try:
        # Try /health first, fallback to /
        for path in ["/health", "/"]:
            try:
                r = requests.get(f"{url}{path}", timeout=timeout)
                status = "ok" if r.status_code in (200, 401, 403) else "degraded"
                return SystemCheck(
                    name=url,
                    status=status,
                    detail=f"HTTP {r.status_code} @ {path}",
                    checked_at=now,
                )
            except requests.ConnectionError:
                continue
        return SystemCheck(
            name=url, status="down", detail="no response", checked_at=now
        )
    except Exception as e:
        return SystemCheck(name=url, status="down", detail=str(e)[:200], checked_at=now)


def check_docker(container: str) -> SystemCheck:
    """Docker-Container-Status prüfen."""
    now = datetime.now(timezone.utc).isoformat()
    try:
        result = subprocess.run(
            [
                "docker",
                "ps",
                "--filter",
                f"name={container}",
                "--format",
                "{{.Status}}",
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )
        status = "ok" if result.stdout.strip() else "down"
        return SystemCheck(
            name=f"docker:{container}",
            status=status,
            detail=result.stdout.strip()[:200]
            if result.stdout.strip()
            else "not running",
            checked_at=now,
        )
    except Exception as e:
        return SystemCheck(
            name=f"docker:{container}",
            status="unknown",
            detail=str(e)[:200],
            checked_at=now,
        )


def check_systemd(service: str) -> SystemCheck:
    """Systemd-Service-Status prüfen."""
    now = datetime.now(timezone.utc).isoformat()
    try:
        result = subprocess.run(
            ["systemctl", "is-active", service],
            capture_output=True,
            text=True,
            timeout=10,
        )
        status = "ok" if result.stdout.strip() == "active" else "down"
        return SystemCheck(
            name=f"systemd:{service}",
            status=status,
            detail=result.stdout.strip(),
            checked_at=now,
        )
    except Exception as e:
        return SystemCheck(
            name=f"systemd:{service}",
            status="unknown",
            detail=str(e)[:200],
            checked_at=now,
        )


# Optimierung: Parallele Checks wo möglich (via ThreadPool in Zukunft)
# Für jetzt: sequentiell mit Caching


def assess_endpoints() -> list[SystemCheck]:
    """Alle Health-Endpoints prüfen."""
    endpoints = [
        ("9Router", "http://127.0.0.1:20128"),
        ("AgentMemory Viewer", "http://127.0.0.1:3113"),
        ("AgentMemory API", "http://127.0.0.1:3111"),
        ("Hermes Gateway", "http://127.0.0.1:8644"),
        ("LightRAG", "http://127.0.0.1:9622"),
    ]
    checks = []
    for name, url in endpoints:
        checks.append(_cached(f"endpoint:{name}", lambda u=url: check_endpoint(u)))
    return checks


def assess_docker() -> list[SystemCheck]:
    """Alle Docker-Container prüfen."""
    containers = [
        "9router",
        "headroom",
        "portainer",
        "gitlab",
        "traefik",
        "nexify-grafana",
        "nexify-prometheus",
    ]
    checks = []
    for c in containers:
        checks.append(_cached(f"docker:{c}", lambda cn=c: check_docker(cn)))
    return checks


def assess_systemd() -> list[SystemCheck]:
    """Alle systemd-Services prüfen."""
    services = [
        "agentmemory",
        "hermes-webui",
        "nexify-auth",
        "nexify-portal",
        "traefik",
        "deepcode-director",
        "deepcode-reviewer",
        "hermes-gateway",
    ]
    checks = []
    for s in services:
        checks.append(_cached(f"systemd:{s}", lambda sv=s: check_systemd(sv)))
    return checks


def assess_all(use_cache: bool = True) -> ISTSOLLReport:
    """Vollständiger IST-Check aller Systeme gegen SOLL.

    Args:
        use_cache: Wenn True, werden gecachte Ergebnisse (TTL 5min) verwendet.

    Returns:
        ISTSOLLReport mit allen Checks, Gaps und Recommendations.
    """
    if not use_cache:
        _cache.clear()

    report = ISTSOLLReport(created_at=datetime.now(timezone.utc).isoformat())

    # Alle Checks sammeln
    report.checks.extend(assess_endpoints())
    report.checks.extend(assess_docker())
    report.checks.extend(assess_systemd())

    # Gap-Analyse: Nicht-OK-Status = Gap
    for c in report.checks:
        if c.status != "ok":
            report.gaps.append(f"{c.name}: {c.status} — {c.detail}")
            if c.status == "down":
                report.recommendations.append(
                    f"Restart {c.name} — systemctl restart oder docker restart"
                )

    # Zusätzliche SOLL-Checks
    _check_soll_gaps(report)

    return report


def _check_soll_gaps(report: ISTSOLLReport):
    """SOLL-Abweichungen prüfen, die nicht durch Health-Checks abgedeckt sind."""
    # Kill-Switch prüfen
    kill_switch = "/opt/nexifyai/state/autopilot/KILL_SWITCH"
    if os.path.exists(kill_switch):
        report.gaps.append("KILL_SWITCH aktiv — Autopilot-Jobs werden geskippt")
        report.recommendations.append("KILL_SWITCH prüfen und ggf. entfernen")

    # POOLSIDE_API_KEY prüfen
    if not os.environ.get("POOLSIDE_API_KEY") and not os.environ.get("POOLSIDE_TOKEN"):
        # Auch in secrets.env prüfen
        try:
            with open("/etc/nexifyai/secrets.env") as f:
                content = f.read()
            if "POOLSIDE_API_KEY" not in content and "POOLSIDE_TOKEN" not in content:
                report.gaps.append("POOLSIDE_API_KEY fehlt — Poolside-Modelle inaktiv")
        except Exception:
            report.gaps.append("POOLSIDE_API_KEY fehlt — Poolside-Modelle inaktiv")

    # FIRECRAWL_API_KEY prüfen
    if not os.environ.get("FIRECRAWL_API_KEY"):
        try:
            with open("/etc/nexifyai/secrets.env") as f:
                content = f.read()
            if "FIRECRAWL_API_KEY" not in content:
                report.gaps.append(
                    "FIRECRAWL_API_KEY fehlt — Firecrawl MCP eingeschränkt"
                )
        except Exception:
            pass


def persist_to_agentmemory(report: ISTSOLLReport) -> bool:
    """IST/SOLL-Report in AgentMemory speichern."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return False
    try:
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/remember",
            json={
                "type": "fact",
                "content": json.dumps(report.to_dict(), ensure_ascii=False),
                "tags": ["ist-soll", "health", "inbox-triage", "sense"],
            },
            headers={
                "Authorization": f"Bearer {secret}",
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        return r.status_code == 200
    except Exception:
        return False


def delta_from_previous(current: ISTSOLLReport, previous: dict | None) -> ISTSOLLReport:
    """Nur Deltas zum vorherigen Report markieren — Optimierung für Decide-Phase."""
    if not previous:
        return current
    prev_gaps = set(previous.get("gaps", []))
    current_gaps = set(current.gaps)
    new_gaps = current_gaps - prev_gaps
    resolved_gaps = prev_gaps - current_gaps

    if resolved_gaps:
        current.recommendations.insert(
            0,
            f"{len(resolved_gaps)} Gaps seit letztem Check behoben: {', '.join(list(resolved_gaps)[:3])}",
        )
    return current
