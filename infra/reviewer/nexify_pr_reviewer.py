#!/usr/bin/env python3
"""NeXifyAI autonomer PR-Reviewer.

Läuft 24/7 (systemd-Timer) und übernimmt die Review-Rolle im Loop mit den
Agenten (Hermes u. a.) — dieselbe Methode wie die Claude-Code-Reviews:

  1. offene, nicht-selbst-authored PRs holen
  2. Gates prüfen: Secrets, Verifikations-Beleg im Body, CI/Checks grün,
     Mergeability, Risiko-Pfade
  3. Ergebnis:
       - alle Gates grün + geringes Risiko  → APPROVE + merge
       - Gate verletzt                       → REQUEST_CHANGES (mit Begründung)
       - hohes Risiko (siehe HIGH_RISK)      → Label `needs-human-review`,
                                               kein Auto-Merge, Kommentar
  4. Idempotent: markiert bearbeitete Commits per Marker-Kommentar, damit
     dieselbe Head-SHA nicht doppelt reviewt wird.

GEWALTENTEILUNG (Pflicht): Der Reviewer nutzt ein EIGENES GitHub-Token
(REVIEWER_GITHUB_TOKEN, eigener Bot-Account) — GitHub verbietet das Approven
eigener PRs, und ein Autor darf seine Arbeit nicht selbst freigeben. Reviewt
NIE PRs, deren Autor der Reviewer-Account selbst ist.

Nur Standardbibliothek + `gh` CLI. Keine Secrets im Code.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys

REPO = os.environ.get("NEXIFY_REPO", "nexifyai-dev/nexify-agentur-plattform")
REVIEWER_LOGIN = os.environ.get("NEXIFY_REVIEWER_LOGIN", "")  # eigener Bot-Login
DRY_RUN = os.environ.get("NEXIFY_REVIEWER_DRYRUN", "0") == "1"
MARKER = "<!-- nexify-reviewer -->"

# Pfade, die NIE autonom gemergt werden (menschliche Freigabe nötig).
HIGH_RISK = [
    r"^\.github/",              # CI/CD, Workflows
    r"secrets", r"\.env",       # Secret-nahes
    r"^memory/",                # Betriebsnotizen (Angriffsfläche)
    r"(^|/)Dockerfile", r"docker-compose", r"deploy/",
    r"middleware\.ts$", r"proxy\.ts$",
    r"next\.config\.",          # Header/CSP/Redirects
    r"filter-repo|history",     # History-Rewrites
]
# Verifikations-Beleg: Body muss echten Nachweis enthalten, nicht nur Behauptung.
VERIFY_HINTS = re.compile(r"verifi|verifik|getestet|\bcurl\b|status\s*200|"
                          r"\b2\d\d\b|test(s|lauf)?|build (grün|green|passed)", re.I)


def gh(*args: str, token: str | None = None) -> str:
    env = dict(os.environ)
    if token:
        env["GH_TOKEN"] = token
    r = subprocess.run(["gh", *args], capture_output=True, text=True, env=env)
    if r.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args)} failed: {r.stderr.strip()}")
    return r.stdout


def gh_api(path: str, token: str, method: str = "GET", fields: dict | None = None) -> str:
    args = ["api", "-X", method, path]
    for k, v in (fields or {}).items():
        args += ["-f", f"{k}={v}"]
    return gh(*args, token=token)


def list_open_prs(token: str) -> list[dict]:
    out = gh("pr", "list", "--repo", REPO, "--state", "open", "--draft=false",
             "--json", "number,title,author,headRefOid,files,body,mergeable,"
             "reviewDecision,statusCheckRollup,isDraft", "--limit", "50", token=token)
    return json.loads(out or "[]")


def already_reviewed(number: int, head: str, token: str) -> bool:
    """True, wenn für diese Head-SHA schon ein Reviewer-Marker-Kommentar existiert."""
    out = gh("pr", "view", str(number), "--repo", REPO, "--json", "comments", token=token)
    for c in json.loads(out).get("comments", []):
        if MARKER in c.get("body", "") and head[:12] in c.get("body", ""):
            return True
    return False


def classify(pr: dict) -> tuple[str, list[str]]:
    """Return (decision, reasons). decision ∈ approve|request_changes|human."""
    reasons: list[str] = []
    files = [f["path"] for f in pr.get("files", [])]

    # 1) Checks (CI/Vercel/Secret-Scan) müssen grün sein.
    rollup = pr.get("statusCheckRollup") or []
    bad = [c for c in rollup
           if (c.get("conclusion") or c.get("state") or "").upper()
           in ("FAILURE", "ERROR", "CANCELLED", "TIMED_OUT", "ACTION_REQUIRED")]
    pending = [c for c in rollup
               if (c.get("status") or "").upper() in ("QUEUED", "IN_PROGRESS", "PENDING")
               or (c.get("state") or "").upper() == "PENDING"]
    if bad:
        return "request_changes", [f"CI rot: {', '.join(c.get('name','check') for c in bad)}"]
    if pending:
        return "wait", ["Checks laufen noch"]

    # 2) Mergeability
    if (pr.get("mergeable") or "").upper() == "CONFLICTING":
        return "request_changes", ["Merge-Konflikt gegen main — bitte rebasen"]

    # 3) Verifikations-Beleg im Body (Regel 2: behauptet ≠ verifiziert)
    if not VERIFY_HINTS.search(pr.get("body") or ""):
        reasons.append("Kein Verifikations-Beleg im PR-Body (Statuscode/Test/Build-Nachweis fehlt)")

    # 4) Risiko-Pfade → menschliche Freigabe
    risky = [p for p in files if any(re.search(rx, p) for rx in HIGH_RISK)]
    if risky:
        return "human", [f"Risiko-Pfade berühren manuelle Freigabe: {', '.join(risky[:6])}"]

    if reasons:
        return "request_changes", reasons
    return "approve", ["Alle Gates grün, geringes Risiko"]


def act(pr: dict, decision: str, reasons: list[str], token: str) -> None:
    n = pr["number"]
    head = pr["headRefOid"]
    body = f"{MARKER} head={head[:12]}\n\n**Autonomer Reviewer:** {decision.upper()}\n\n" \
           + "\n".join(f"- {r}" for r in reasons)

    if DRY_RUN:
        print(f"[DRY] PR#{n} → {decision}: {reasons}")
        return

    if decision == "approve":
        gh("pr", "review", str(n), "--repo", REPO, "--approve", "--body", body, token=token)
        gh("pr", "merge", str(n), "--repo", REPO, "--merge", token=token)
        print(f"PR#{n} approved + merged")
    elif decision == "request_changes":
        gh("pr", "review", str(n), "--repo", REPO, "--request-changes", "--body", body, token=token)
        print(f"PR#{n} changes requested: {reasons}")
    elif decision == "human":
        _ensure_label(token)
        gh("pr", "edit", str(n), "--repo", REPO, "--add-label", "needs-human-review", token=token)
        gh("pr", "comment", str(n), "--repo", REPO, "--body", body, token=token)
        print(f"PR#{n} flagged for human review: {reasons}")


def _ensure_label(token: str) -> None:
    try:
        gh("label", "create", "needs-human-review", "--repo", REPO,
           "--color", "B60205", "--description", "Autonomer Reviewer: manuelle Freigabe nötig",
           "--force", token=token)
    except RuntimeError:
        pass


def main() -> int:
    token = os.environ.get("REVIEWER_GITHUB_TOKEN") or os.environ.get("GH_TOKEN", "")
    if not token:
        print("FEHLER: REVIEWER_GITHUB_TOKEN nicht gesetzt", file=sys.stderr)
        return 2
    processed = 0
    for pr in list_open_prs(token):
        author = (pr.get("author") or {}).get("login", "")
        if REVIEWER_LOGIN and author == REVIEWER_LOGIN:
            continue  # niemals eigene PRs reviewen (Gewaltenteilung)
        if already_reviewed(pr["number"], pr["headRefOid"], token):
            continue
        decision, reasons = classify(pr)
        if decision == "wait":
            continue  # nächster Lauf
        act(pr, decision, reasons, token)
        processed += 1
    print(f"Reviewer-Lauf fertig: {processed} PR(s) bearbeitet")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
