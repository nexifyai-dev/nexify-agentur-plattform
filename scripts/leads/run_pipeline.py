#!/usr/bin/env python3
# FILE: /scripts/leads/run_pipeline.py
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 11:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: CLI — discover / status / export / promote / mail (dry-run; --send needs consent)
# WHY: One command weekly cadence for zero-cost acquisition agents
# BEST-PRACTICE: Default dry-run; --send requires consent=true (§7 UWG) or self-test
# PITFALL: V-LEAD-06/UWG-01: Never log secrets; allow ≠ consent; seeds ≠ consent
# DEPENDS: discover, schema, mail_batch, optional outreach
# DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md, docs/gtm/UWG-EMAIL-OPTIN-ONLY.md
# SESSION: zero-cost-leads-mailing-7dd5

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]
_REPO = Path(__file__).resolve().parents[2]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from leads.discover import discover_from_seeds, github_org_about_hint
from leads.mail_batch import load_env_files, run_from_queue
from leads.schema import (
    append_leads,
    default_data_dir,
    export_csv,
    has_send_consent,
    load_queue,
    queue_path,
    save_queue,
    set_status,
    to_outreach_record,
    utc_now,
)

UWG_SEND_WARN = (
    "UWG-WARN (§7): --send requires consent=true (or self-test @nexifyai.*). "
    "Cold email without consent is illegal in DE (also B2B). Seeds ≠ consent."
)


def cmd_discover(args: argparse.Namespace) -> int:
    seed = Path(args.seed)
    if not seed.is_file():
        print(json.dumps({"error": f"seed not found: {seed}"}))
        return 1
    leads = discover_from_seeds(seed, limit=args.limit, pause_sec=args.pause)
    for org in args.github_org or []:
        leads.append(github_org_about_hint(org))
    data_dir = Path(args.data_dir) if args.data_dir else default_data_dir()
    q = queue_path(data_dir)
    added, skipped = append_leads(q, leads)
    print(json.dumps({
        "ok": True,
        "discovered": len(leads),
        "with_email": sum(1 for x in leads if x.get("email")),
        "added": added,
        "skipped_dupes": skipped,
        "queue": str(q),
        "sample": [{"company": x.get("company"), "has_email": bool(x.get("email")),
                    "status": x.get("status"), "do_not_mail": x.get("do_not_mail"),
                    "website": x.get("website")} for x in leads[:10]],
    }, ensure_ascii=False, indent=2))
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    data_dir = Path(args.data_dir) if args.data_dir else default_data_dir()
    leads = load_queue(queue_path(data_dir))
    counts: dict[str, int] = {}
    for lead in leads:
        st = lead.get("status") or "new"
        counts[st] = counts.get(st, 0) + 1
    print(json.dumps({"queue": str(queue_path(data_dir)), "total": len(leads),
                      "by_status": counts}, ensure_ascii=False, indent=2))
    return 0


def cmd_export(args: argparse.Namespace) -> int:
    data_dir = Path(args.data_dir) if args.data_dir else default_data_dir()
    leads = load_queue(queue_path(data_dir))
    out = Path(args.out)
    if out.suffix.lower() == ".csv":
        export_csv(out, leads)
    else:
        out.write_text(json.dumps(leads, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"ok": True, "written": len(leads), "out": str(out)}))
    return 0


def cmd_allow(args: argparse.Namespace) -> int:
    """Mark researched + send_allowed for dry-run preview.

    Does NOT set consent=true — seeds/public scrape ≠ opt-in (§7 UWG).
    Live --send still blocked until consent or self-test domain.
    """
    data_dir = Path(args.data_dir) if args.data_dir else default_data_dir()
    q = queue_path(data_dir)
    leads = load_queue(q)
    n = 0
    for lead in leads:
        if args.id and lead.get("id") != args.id:
            continue
        if lead.get("do_not_mail") or not lead.get("email"):
            continue
        if lead.get("status") not in {"new", "researched"}:
            continue
        # Policy gate only — never invent consent from seeds
        set_status(lead, "researched", send_allowed=True)
        n += 1
        if args.limit and n >= args.limit:
            break
    save_queue(q, leads)
    print(json.dumps({
        "ok": True,
        "allowed": n,
        "queue": str(q),
        "note": "send_allowed for dry-run only; --send still needs consent=true",
    }))
    return 0


def cmd_consent(args: argparse.Namespace) -> int:
    """Record explicit opt-in on a lead (form/checkliste/self_test)."""
    data_dir = Path(args.data_dir) if args.data_dir else default_data_dir()
    q = queue_path(data_dir)
    leads = load_queue(q)
    n = 0
    for lead in leads:
        if args.id and lead.get("id") != args.id:
            continue
        if args.email and (lead.get("email") or "").lower() != args.email.lower():
            continue
        if lead.get("do_not_mail") or not lead.get("email"):
            continue
        st = lead.get("status") or "researched"
        if st not in {"new", "researched"}:
            st = "researched"
        set_status(
            lead,
            st,
            consent=True,
            consent_recorded_at=utc_now(),
            legal_basis="consent",
            send_allowed=True,
            source_type=args.source_type or lead.get("source_type") or "optin",
        )
        n += 1
        if args.limit and n >= args.limit:
            break
    save_queue(q, leads)
    print(json.dumps({"ok": True, "consent_set": n, "queue": str(q)}))
    return 0


def cmd_promote(args: argparse.Namespace) -> int:
    data_dir = Path(args.data_dir) if args.data_dir else default_data_dir()
    leads = load_queue(queue_path(data_dir))
    out_dir = Path(os.environ.get("OUTREACH_QUEUE_DIR", str(_REPO / "data" / "outreach" / "queue")))
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / args.out_name
    n = 0
    blocked_no_consent = 0
    with out.open("a", encoding="utf-8") as fh:
        for lead in leads:
            if not lead.get("email") or lead.get("do_not_mail"):
                continue
            if args.only_allowed and not lead.get("send_allowed"):
                continue
            rec = to_outreach_record(lead)
            if args.allow_send:
                if has_send_consent(lead):
                    rec["send_allowed"] = True
                    rec["consent"] = True
                    rec["legal_basis"] = "consent"
                    rec["status"] = "outreach_pending"
                else:
                    rec["send_allowed"] = False
                    blocked_no_consent += 1
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
            n += 1
    print(json.dumps({
        "ok": True,
        "promoted": n,
        "blocked_no_consent": blocked_no_consent,
        "out": str(out),
    }))
    return 0


def cmd_mail(args: argparse.Namespace) -> int:
    load_env_files("/etc/nexifyai/mail-nexifyai.env", "/etc/nexifyai/secrets.env", args.secrets_file)
    data_dir = Path(args.data_dir) if args.data_dir else default_data_dir()
    if args.send:
        print(UWG_SEND_WARN, file=sys.stderr)
    result = run_from_queue(
        send=bool(args.send), limit=args.limit, data_dir=data_dir,
        require_send_allowed=not args.force,
    )
    print(json.dumps({
        "ok": result.errors == 0,
        "mode": "send" if args.send else "dry-run",
        "queue": str(queue_path(data_dir)),
        "uwg": "consent_required_for_send",
        **result.as_dict(),
    }, ensure_ascii=False, indent=2))
    return 0 if result.errors == 0 else 1


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="NeXify AI zero-cost lead pipeline")
    p.add_argument("--data-dir", default=os.environ.get("LEADS_DATA_DIR", ""))
    sub = p.add_subparsers(dest="cmd", required=True)

    d = sub.add_parser("discover"); d.add_argument("--seed", default=str(_REPO/"data/leads/seeds/dach_smb_agencies.json"))
    d.add_argument("--limit", type=int, default=20); d.add_argument("--pause", type=float, default=0.35)
    d.add_argument("--github-org", action="append", default=[]); d.set_defaults(func=cmd_discover)

    s = sub.add_parser("status"); s.set_defaults(func=cmd_status)
    e = sub.add_parser("export"); e.add_argument("--out", required=True); e.set_defaults(func=cmd_export)
    a = sub.add_parser("allow"); a.add_argument("--limit", type=int, default=10); a.add_argument("--id", default="")
    a.set_defaults(func=cmd_allow)
    c = sub.add_parser("consent", help="Record explicit opt-in (consent=true); not for seeds")
    c.add_argument("--limit", type=int, default=1)
    c.add_argument("--id", default="")
    c.add_argument("--email", default="")
    c.add_argument("--source-type", default="optin")
    c.set_defaults(func=cmd_consent)
    pr = sub.add_parser("promote"); pr.add_argument("--out-name", default="zero_cost_batch.jsonl")
    pr.add_argument("--allow-send", action="store_true"); pr.add_argument("--only-allowed", action="store_true", default=True)
    pr.set_defaults(func=cmd_promote)
    m = sub.add_parser("mail"); m.add_argument("--send", action="store_true",
        help="Live SMTP — requires consent=true or self-test @nexifyai.* (§7 UWG)")
    m.add_argument("--limit", type=int, default=8)
    m.add_argument("--force", action="store_true", help="Skip send_allowed check (consent still required)")
    m.add_argument("--secrets-file", default=os.environ.get("SECRETS_FILE", "/etc/nexifyai/secrets.env"))
    m.set_defaults(func=cmd_mail)
    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    if not args.data_dir:
        args.data_dir = str(default_data_dir())
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
