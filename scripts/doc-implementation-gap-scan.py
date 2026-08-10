#!/usr/bin/env python3
# FILE: scripts/doc-implementation-gap-scan.py
# NIR: 02.08.2026 09:15
# UPDATED: 02.08.2026 09:15
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Quality
# WHAT: Heuristic scan: governance MUST/PFLICHT statements vs repo implementation markers.
# WHY: Catch doc obligations that never landed in code/CI/scripts — quality absolute coverage.
# BEST-PRACTICE: Report markdown artifact; exit 1 only on ERROR severity; WARN stays green.
# PITFALL: V-DG-01: Regex is heuristic — false positives are WARN, not ERROR.
# DEPENDS: docs/governance/; pathlib
# DOCS-REF: docs/operations/QUALITY-GATES.md
# SESSION: quality-gates-absolute-7dd5

"""Scan governance docs for MUST/PFLICHT and check known implementation markers.

Exit codes:
  0 — no ERROR findings (WARN allowed)
  1 — one or more ERROR findings
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GOV = ROOT / "docs" / "governance"
OUT_MD = ROOT / "test_reports" / "doc-implementation-gap.md"
OUT_JSON = ROOT / "test_reports" / "doc-implementation-gap.json"

# Obligation line patterns (DE/EN)
OBLIGATION_RE = re.compile(
    r"\b(MUST|SHALL|PFLICHT|PFLICHTIG|VERPFLICHTET|DARF NICHT|MUST NOT|SHALL NOT)\b",
    re.IGNORECASE,
)

# Map keyword → paths that satisfy the obligation (any existing = implemented)
IMPLEMENTATION_MARKERS: dict[str, list[str]] = {
    "agentmemory": [
        "docs/operations/QUALITY-GATES.md",
        "scripts/soll-deviation-scan.py",
        ".cursor/mcp.json.example",
    ],
    "lightrag": [
        "scripts/soll-deviation-scan.py",
        ".cursor/mcp.json.example",
    ],
    "flowsearch": [
        "scripts/check_knowledge_mandate.py",
        "backend/flowsearch/__init__.py",
        "docs/governance/02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md",
    ],
    "knowledge": [
        "scripts/check_knowledge_mandate.py",
        "docs/governance/12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md",
    ],
    "secret": [
        ".github/workflows/secret-scan.yml",
        ".github/workflows/ci.yml",
    ],
    "tenant": [
        ".github/workflows/customer-isolation.yml",
    ],
    "mirror": [
        ".github/workflows/mirror-to-gitlab.yml",
        "docs/operations/REPO-SYNC-STRATEGY.md",
    ],
    "gitlab": [
        ".gitlab-ci.yml",
        "deploy/mcp/gitlab-oss/README.md",
    ],
    "quality gate": [
        "docs/operations/QUALITY-GATES.md",
        "docs/governance/10_quality_gates/",
    ],
    "quality": [
        "docs/operations/QUALITY-GATES.md",
        ".github/workflows/quality-smoke.yml",
        ".github/workflows/quality-audit.yml",
    ],
    "hitl": [
        "docs/governance/10_quality_gates/HITL_GATE.md",
    ],
    "evidence": [
        "docs/governance/08_evidence/",
    ],
    "design": [
        "design_guidelines.json",
        ".github/workflows/design-system-guard.yml",
    ],
    "playwright": [
        "apps/website/playwright.config.ts",
        "apps/website/tests/e2e/critical-path.spec.ts",
    ],
    "circuit breaker": [
        "docs/operations/QUALITY-GATES.md",
    ],
    "n8n": [
        "AGENTS.md",
        "CHARTA.md",
    ],
    "awesome-hermes": [
        "AGENTS.md",
        "CHARTA.md",
    ],
    "pre-task": [
        "docs/governance/GOVERNANCE.md",
        "scripts/agentic-bootstrap.sh",
    ],
    "brain_first": [
        "scripts/agentic-bootstrap.sh",
        "docs/governance/GOVERNANCE.md",
    ],
    "dual-vcs": [
        ".github/workflows/mirror-to-gitlab.yml",
        "docs/operations/REPO-SYNC-STRATEGY.md",
    ],
}


@dataclass
class Gap:
    severity: str  # error | warn | ok
    source: str
    line: int
    obligation: str
    keyword: str
    status: str
    detail: str


def exists_any(rel_paths: list[str]) -> tuple[bool, str]:
    present = []
    for rel in rel_paths:
        p = ROOT / rel
        if p.exists():
            present.append(rel)
    if present:
        return True, ", ".join(present[:3])
    return False, f"missing all of: {', '.join(rel_paths[:4])}"


def classify_line(text: str) -> str | None:
    lower = text.lower()
    # Prefer longer / more specific keys first
    keys = sorted(IMPLEMENTATION_MARKERS.keys(), key=len, reverse=True)
    for key in keys:
        if key in lower:
            return key
    return None


def scan_file(path: Path) -> list[Gap]:
    gaps: list[Gap] = []
    try:
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    except OSError as e:
        return [
            Gap(
                "warn",
                str(path.relative_to(ROOT)),
                0,
                "",
                "",
                "unreadable",
                str(e),
            )
        ]

    rel = str(path.relative_to(ROOT))
    for i, line in enumerate(lines, start=1):
        if not OBLIGATION_RE.search(line):
            continue
        # Skip headings that are just section titles without actionable verbs sometimes
        stripped = line.strip()
        if stripped.startswith("#") and len(stripped) < 40:
            continue
        keyword = classify_line(stripped)
        if not keyword:
            gaps.append(
                Gap(
                    "warn",
                    rel,
                    i,
                    stripped[:200],
                    "(unmapped)",
                    "no_marker_map",
                    "Obligation found but no IMPLEMENTATION_MARKERS keyword matched — review manually",
                )
            )
            continue
        ok, detail = exists_any(IMPLEMENTATION_MARKERS[keyword])
        if ok:
            gaps.append(
                Gap(
                    "ok",
                    rel,
                    i,
                    stripped[:200],
                    keyword,
                    "implemented",
                    detail,
                )
            )
        else:
            # Known hard exclusions documented as MUST NOT → ok if AGENTS documents exclusion
            if keyword in ("n8n", "awesome-hermes"):
                gaps.append(
                    Gap(
                        "ok",
                        rel,
                        i,
                        stripped[:200],
                        keyword,
                        "exclusion_documented",
                        detail if ok else "check AGENTS/CHARTA exclusion text",
                    )
                )
                # Re-check: if AGENTS missing, escalate
                ag = (ROOT / "AGENTS.md").read_text(encoding="utf-8", errors="replace").lower()
                if keyword == "n8n" and "abgeschafft" not in ag:
                    gaps[-1] = Gap(
                        "error",
                        rel,
                        i,
                        stripped[:200],
                        keyword,
                        "exclusion_missing",
                        "n8n exclusion not documented in AGENTS.md",
                    )
                if keyword == "awesome-hermes" and "ausgeschlossen" not in ag:
                    gaps[-1] = Gap(
                        "error",
                        rel,
                        i,
                        stripped[:200],
                        keyword,
                        "exclusion_missing",
                        "awesome-hermes exclusion not documented",
                    )
                continue
            # Missing quality/workflow markers are ERROR; soft topics WARN
            sev = "error" if keyword in {
                "quality",
                "secret",
                "mirror",
                "flowsearch",
                "knowledge",
                "design",
            } else "warn"
            gaps.append(
                Gap(
                    sev,
                    rel,
                    i,
                    stripped[:200],
                    keyword,
                    "gap",
                    detail,
                )
            )
    return gaps


def collect_gov_files() -> list[Path]:
    if not GOV.exists():
        return []
    files: list[Path] = []
    for p in GOV.rglob("*"):
        if p.suffix.lower() in {".md", ".json", ".yml", ".yaml"} and p.is_file():
            # Skip huge evidence dumps if any
            if "08_evidence" in p.parts and p.stat().st_size > 500_000:
                continue
            files.append(p)
    return sorted(files)


def write_reports(gaps: list[Gap]) -> None:
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    errors = [g for g in gaps if g.severity == "error"]
    warns = [g for g in gaps if g.severity == "warn"]
    oks = [g for g in gaps if g.severity == "ok"]

    lines = [
        "# Doc ↔ Implementation Gap Scan",
        "",
        f"OK: {len(oks)} | WARN: {len(warns)} | ERROR: {len(errors)}",
        "",
        "Heuristic scan of `docs/governance/` for MUST/PFLICHT vs repo markers.",
        "Exit fails on ERROR only.",
        "",
    ]
    if errors:
        lines.append("## ERRORS")
        lines.append("")
        for g in errors:
            lines.append(f"- **{g.keyword}** `{g.source}:{g.line}` — {g.detail}")
            lines.append(f"  - `{g.obligation}`")
        lines.append("")
    if warns:
        lines.append("## WARNINGS (sample ≤40)")
        lines.append("")
        for g in warns[:40]:
            lines.append(f"- **{g.keyword}** `{g.source}:{g.line}` — {g.status}: {g.detail}")
        if len(warns) > 40:
            lines.append(f"- … +{len(warns) - 40} more")
        lines.append("")
    lines.append("## Implemented (sample ≤20)")
    lines.append("")
    for g in oks[:20]:
        lines.append(f"- **{g.keyword}** `{g.source}:{g.line}` → {g.detail}")
    lines.append("")

    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    OUT_JSON.write_text(
        json.dumps(
            {
                "ok": len(oks),
                "warn": len(warns),
                "error": len(errors),
                "findings": [asdict(g) for g in gaps],
            },
            indent=2,
        ),
        encoding="utf-8",
    )


def main() -> int:
    files = collect_gov_files()
    if not files:
        print("ERROR: docs/governance/ missing or empty", file=sys.stderr)
        return 1

    gaps: list[Gap] = []
    for f in files:
        gaps.extend(scan_file(f))

    write_reports(gaps)
    errors = [g for g in gaps if g.severity == "error"]
    warns = [g for g in gaps if g.severity == "warn"]
    oks = [g for g in gaps if g.severity == "ok"]

    print("# Doc-Implementation-Gap-Scan\n")
    print(f"Scanned files: {len(files)}")
    print(f"OK: {len(oks)} | WARN: {len(warns)} | ERROR: {len(errors)}")
    print(f"Report: {OUT_MD.relative_to(ROOT)}")
    print(f"JSON: {OUT_JSON.relative_to(ROOT)}")

    if errors:
        print("\n## ERRORS\n")
        for g in errors:
            print(f"- **{g.keyword}**: {g.source}:{g.line} — {g.detail}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
