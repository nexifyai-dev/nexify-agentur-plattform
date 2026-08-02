#!/usr/bin/env python3
# FILE: scripts/github-zombie-branch-cleanup.py
# NIR: 02.08.2026 08:55
# UPDATED: 02.08.2026 08:55
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Dry-run / delete remote branches that are safe post squash-merge zombies
# WHY: Keep origin lean after agent/copilot branch churn without deleting unique work
# BEST-PRACTICE: Dry-run first; only ancestor-of-main OR merged-PR with ahead<=5
# PITFALL: V-GIT: never delete main/open-PR heads; unset GITHUB_TOKEN before gh
# DEPENDS: git, gh auth, origin remote
# DOCS-REF: docs/operations/GITHUB-CURSOR-CONTROL-PLANE-STATUS.md
# SESSION: github-ops-automation-7dd5

"""Safe remote branch cleanup for nexify-agentur-plattform.

Usage:
  unset GITHUB_TOKEN
  python3 scripts/github-zombie-branch-cleanup.py          # dry-run
  python3 scripts/github-zombie-branch-cleanup.py --delete # execute
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from typing import Any

REPO_DEFAULT = "nexifyai-dev/nexify-agentur-plattform"
PROTECTED = frozenset({"main", "develop", "master"})
SQUASH_AHEAD_CAP = 5
BATCH = 20


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, text=True, capture_output=True, check=check)


def gh_json(args: list[str]) -> Any:
    out = run(["gh", *args]).stdout
    return json.loads(out) if out.strip() else []


def classify(repo: str) -> dict[str, Any]:
    run(["git", "fetch", "origin", "--prune"], check=False)
    run(["git", "rev-parse", "--verify", "origin/main"])

    branches: list[str] = []
    for line in (
        run(["git", "ls-remote", "--heads", "origin"]).stdout.strip().splitlines()
    ):
        parts = line.split("\t")
        if len(parts) == 2:
            branches.append(parts[1].replace("refs/heads/", ""))

    open_heads = {
        p["headRefName"]
        for p in gh_json(
            [
                "pr",
                "list",
                "--repo",
                repo,
                "--state",
                "open",
                "--limit",
                "100",
                "--json",
                "headRefName",
            ]
        )
    }
    merged_heads = {
        p["headRefName"]: p["number"]
        for p in gh_json(
            [
                "pr",
                "list",
                "--repo",
                repo,
                "--state",
                "merged",
                "--limit",
                "200",
                "--json",
                "number,headRefName",
            ]
        )
        if p.get("headRefName")
    }

    safe: list[dict[str, Any]] = []
    unsure: list[dict[str, Any]] = []
    skip: list[dict[str, Any]] = []

    for name in sorted(branches):
        if name in PROTECTED:
            skip.append({"branch": name, "reason": "protected"})
            continue
        if name in open_heads:
            skip.append({"branch": name, "reason": "open-pr"})
            continue

        tip = run(["git", "rev-parse", f"origin/{name}"]).stdout.strip()
        is_anc = (
            run(
                ["git", "merge-base", "--is-ancestor", tip, "origin/main"],
                check=False,
            ).returncode
            == 0
        )
        ahead_n = int(
            run(
                ["git", "rev-list", "--count", f"origin/main..origin/{name}"]
            ).stdout.strip()
        )
        pr = merged_heads.get(name)

        if is_anc:
            safe.append(
                {
                    "branch": name,
                    "reason": "ancestor-of-main",
                    "pr": pr,
                    "ahead": ahead_n,
                }
            )
        elif pr is not None and ahead_n <= SQUASH_AHEAD_CAP:
            safe.append(
                {
                    "branch": name,
                    "reason": f"merged-pr-#{pr}-squash-noise",
                    "pr": pr,
                    "ahead": ahead_n,
                }
            )
        else:
            unsure.append(
                {
                    "branch": name,
                    "reason": (
                        f"merged-pr-#{pr}-but-ahead-{ahead_n}"
                        if pr is not None
                        else f"no-merged-pr-ahead-{ahead_n}"
                    ),
                    "pr": pr,
                    "ahead": ahead_n,
                }
            )

    return {"safe": safe, "skip": skip, "unsure": unsure}


def delete_branches(names: list[str]) -> tuple[list[str], list[tuple[str, str]]]:
    deleted: list[str] = []
    failed: list[tuple[str, str]] = []
    for i in range(0, len(names), BATCH):
        batch = names[i : i + BATCH]
        r = run(["git", "push", "origin", "--delete", *batch], check=False)
        if r.returncode == 0:
            deleted.extend(batch)
        else:
            for b in batch:
                r2 = run(["git", "push", "origin", "--delete", b], check=False)
                if r2.returncode == 0:
                    deleted.append(b)
                else:
                    failed.append((b, (r2.stderr or r2.stdout or "error")[:200]))
        time.sleep(0.3)
    return deleted, failed


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", default=REPO_DEFAULT)
    ap.add_argument(
        "--delete", action="store_true", help="Actually delete safe branches"
    )
    ap.add_argument("--json-out", default="")
    args = ap.parse_args()

    result = classify(args.repo)
    print(
        f"SAFE={len(result['safe'])} SKIP={len(result['skip'])} UNSURE={len(result['unsure'])}"
    )
    for s in result["safe"]:
        print(f"  DELETE {s['branch']}  ({s['reason']}, ahead={s['ahead']})")
    for u in result["unsure"]:
        print(f"  KEEP   {u['branch']}  ({u['reason']})")
    for s in result["skip"]:
        print(f"  KEEP   {s['branch']}  ({s['reason']})")

    if args.delete and result["safe"]:
        deleted, failed = delete_branches([s["branch"] for s in result["safe"]])
        result["deleted"] = deleted
        result["failed"] = failed
        print(f"DELETED={len(deleted)} FAILED={len(failed)}")
        for b, err in failed:
            print(f"  FAIL {b}: {err}")

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)

    return 0


if __name__ == "__main__":
    sys.exit(main())
