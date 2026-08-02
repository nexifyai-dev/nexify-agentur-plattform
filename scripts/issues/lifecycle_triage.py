#!/usr/bin/env python3
# FILE: scripts/issues/lifecycle_triage.py
# NIR: 02.08.2026 08:58
# UPDATED: 02.08.2026 11:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Issues Lifecycle — auto-label, triage comment, slash-command labeling.
# WHY: Keep GHA YAML free of unindented heredocs / injection risks; Launches laufen zentral im Event-Router.
# BEST-PRACTICE: Env-based inputs; PR comments via issue_comment sauber skippen; marker comments.
# PITFALL: V-IL-01: Never print secrets; V-IL-03: Backfill unlabeled only.
# DEPENDS: gh CLI, GH_TOKEN, json module
# DOCS-REF: docs/operations/ISSUES-AUTOMATION.md
# SESSION: automate-issues-lifecycle-7dd5
"""GitHub Issues lifecycle triage for Actions."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
from typing import Iterable


def env(name: str, default: str = "") -> str:
    return (os.environ.get(name) or default).strip()


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=check, text=True, capture_output=True)


def gh_json(args: list[str]) -> object:
    cp = run(["gh", *args])
    return json.loads(cp.stdout or "null")


def issue_labels(repo: str, num: str) -> list[str]:
    data = gh_json(["issue", "view", num, "--repo", repo, "--json", "labels"])
    assert isinstance(data, dict)
    return [str(x.get("name", "")) for x in data.get("labels", [])]


def add_labels(repo: str, num: str, labels: Iterable[str]) -> None:
    labs = [name for name in labels if name]
    if not labs:
        return
    run(
        ["gh", "issue", "edit", num, "--repo", repo, "--add-label", ",".join(labs)],
        check=False,
    )


def comment_bodies(repo: str, num: str) -> list[str]:
    try:
        cp = run(
            [
                "gh",
                "api",
                f"repos/{repo}/issues/{num}/comments",
                "--paginate",
            ],
            check=False,
        )
        if cp.returncode != 0:
            return []
        data = json.loads(cp.stdout or "[]")
        return [str(c.get("body", "")) for c in data]
    except (json.JSONDecodeError, TypeError):
        return []


def has_marker(bodies: list[str], marker: str) -> bool:
    return any(marker in b for b in bodies)


def infer_labels(title: str, body: str, existing: list[str]) -> list[str]:
    text = f"{title}\n{body}".lower()
    have = {x.lower() for x in existing}
    add: list[str] = []

    def need(name: str) -> None:
        if name.lower() not in have and name not in add:
            add.append(name)

    if re.search(
        r"(missing actions secrets|human.?gate|hermes.*(cutover|prod)|production cutover|\[human-gate\])",
        text,
        re.I,
    ) or re.search(r"^\[ops\].*secret", title, re.I):
        need("human-gate")
        need("blocked")

    if re.search(r"(^|[^a-z])bug([^a-z]|$)|regression|fixme|crash|traceback", text):
        need("bug")
    if re.search(r"\bdocs?\b|documentation|readme", text):
        need("documentation")
        need("docs")
    if re.search(r"\[ops\]", title, re.I) or re.search(
        r"(^|[^a-z])ops([^a-z]|$)", text
    ):
        need("ops")
    if re.search(r"\bP0\b", title) or re.search(r"(^|[^a-z])p0([^a-z]|$)", text):
        need("P0")
    if re.search(r"security|cve|dependabot|secret.?scan|codeql", text):
        need("security")
    if re.search(r"\[agent-task\]|agent.?task|cursor cloud|laptop.?off", text):
        need("agent-task")
        need("agent-fix")

    return add


def ensure_triage_comment(
    repo: str, num: str, labels: list[str], has_cursor_key: bool
) -> None:
    marker = "<!-- nexify-issues-lifecycle-triage -->"
    bodies = comment_bodies(repo, num)
    if has_marker(bodies, marker):
        print(f"triage comment already present on #{num}")
        return

    joined = ",".join(labels)
    if re.search(r"(^|,)(human-gate|blocked)(,|$)", joined, re.I):
        gate = (
            "\n⚠️ **Human-gate / blocked** — Cursor Agent startet **nicht** automatisch. "
            "Manuelle Freigabe nötig."
        )
    else:
        gate = (
            "\n🤖 **Owner:** Cursor Cloud Agent (PC-off). Label `agent-fix` oder `P0` "
            "triggert Launch via `event-to-cloud-agent`."
        )
    if not has_cursor_key:
        gate += (
            f"\n⏳ `CURSOR_API_KEY` fehlt → Launch blockiert bis "
            f"[#123](https://github.com/{repo}/issues/123) (Secrets) erledigt ist."
        )

    body = f"""{marker}
### Triage checklist (Issues Lifecycle)

- [ ] Labels korrekt (bug / docs / ops / P0 / security / human-gate)
- [ ] Scope = dieses Repo only
- [ ] Keine Secret-Werte in Issue/Kommentaren
- [ ] Fix → Branch `cursor/<task>-7dd5` → Draft-PR mit `Fixes #{num}`
- [ ] Nach Merge: Issue schließt via GitHub native keywords
{gate}

Docs: `docs/operations/ISSUES-AUTOMATION.md`
"""
    run(["gh", "issue", "comment", num, "--repo", repo, "--body", body])
    add_labels(repo, num, ["triage"])


def maybe_dispatch(
    repo: str, num: str, labels: list[str], reason: str, has_cursor_key: bool
) -> None:
    joined = ",".join(labels)
    if re.search(r"(^|,)(human-gate|blocked)(,|$)", joined, re.I):
        print(f"skip dispatch: human-gate/blocked on #{num}")
        return
    if not re.search(r"(^|,)(agent-fix|P0)(,|$)", joined, re.I):
        print(f"skip dispatch: no agent-fix/P0 on #{num}")
        return

    if not has_cursor_key:
        marker = "<!-- nexify-issues-lifecycle-no-cursor-key -->"
        if not has_marker(comment_bodies(repo, num), marker):
            body = f"""{marker}
Cloud-Agent Launch übersprungen: Secret `CURSOR_API_KEY` fehlt.
Blocked by [#123](https://github.com/{repo}/issues/123) (Actions secrets & VPS runner).
Sobald gesetzt, Label `agent-fix` erneut setzen oder Issue reopen.
"""
            run(["gh", "issue", "comment", num, "--repo", repo, "--body", body])
        print("dispatch degraded: no CURSOR_API_KEY")
        return

    meta = gh_json(["issue", "view", num, "--repo", repo, "--json", "title,body"])
    assert isinstance(meta, dict)
    title = str(meta.get("title") or "")
    issue_body = str(meta.get("body") or "")[:5000]
    prompt = (
        f"GitHub Issue #{num}: {title}\n\n{issue_body}\n\n"
        f"Triage/fix if actionable. Branch cursor/<kurz>-7dd5, draft PR with Fixes #{num}.\n"
        "No Hermes cutover. No secrets in commits. Human-gate issues must not be auto-closed.\n"
    )
    payload = {
        "event_type": "agent-fix",
        "client_payload": {
            "dedupe_key": f"issue-lifecycle-{num}-{reason}",
            "issue_number": num,
            "prompt": prompt,
            "auto_pr": True,
        },
    }
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", suffix=".json", delete=False
    ) as fh:
        json.dump(payload, fh)
        path = fh.name
    try:
        cp = run(
            [
                "gh",
                "api",
                f"repos/{repo}/dispatches",
                "--method",
                "POST",
                "--input",
                path,
            ],
            check=False,
        )
        if cp.returncode != 0:
            print(f"dispatch soft-fail stderr={cp.stderr.strip()[:400]}")
        else:
            print(f"repository_dispatch agent-fix sent for #{num}")
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass


def backfill(repo: str) -> None:
    print("One-shot label backfill for unlabeled open issues")
    data = gh_json(
        [
            "issue",
            "list",
            "--repo",
            repo,
            "--state",
            "open",
            "--limit",
            "30",
            "--json",
            "number,labels,title,body",
        ]
    )
    assert isinstance(data, list)
    for item in data:
        if item.get("labels"):
            continue
        num = str(item["number"])
        title = str(item.get("title") or "")
        body = str(item.get("body") or "")
        add = infer_labels(title, body, [])
        print(f"backfill #{num} +{add}")
        add_labels(repo, num, add)


def main() -> int:
    repo = env("REPO")
    event = env("EVENT_NAME")
    action = env("ACTION")
    num = env("ISSUE_NUMBER")
    title = env("ISSUE_TITLE")
    body = env("ISSUE_BODY")
    state = env("ISSUE_STATE")
    existing = [x for x in env("ISSUE_LABELS").split(",") if x]
    comment_body = env("COMMENT_BODY")
    label_name = env("LABEL_NAME")
    backfill_flag = env("BACKFILL", "false").lower() in ("1", "true", "yes")
    has_cursor_key = env("HAS_CURSOR_KEY", "false").lower() in ("1", "true", "yes")
    issue_is_pr = env("ISSUE_IS_PR", "false").lower() in ("1", "true", "yes")

    if not repo:
        print("REPO missing", file=sys.stderr)
        return 1

    if event == "workflow_dispatch" and backfill_flag:
        backfill(repo)
        return 0

    if not num:
        print("no issue context")
        return 0

    if state == "closed" and action == "closed":
        print(f"issue #{num} closed — no triage")
        return 0

    if event == "issue_comment" and issue_is_pr:
        print("issue_comment belongs to PR — skipped in issues lifecycle")
        return 0

    if event == "issue_comment":
        if not re.search(r"(^|\s)/(triage|agent-fix)\b", comment_body, re.I):
            print("issue_comment ignored (no /triage|/agent-fix)")
            return 0

    add = infer_labels(title, body, existing)
    if add:
        print(f"issue #{num} +labels: {add}")
        add_labels(repo, num, add)

    labels = issue_labels(repo, num)

    if event == "issues" and action in ("opened", "reopened"):
        ensure_triage_comment(repo, num, labels, has_cursor_key)
    elif event == "issues" and action == "edited":
        # re-label only; no new triage spam
        pass
    elif event == "issue_comment":
        if re.search(r"(^|\s)/agent-fix\b", comment_body, re.I):
            add_labels(repo, num, ["agent-fix"])

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
