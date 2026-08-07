#!/usr/bin/env python3
"""Kuratierungs-Pipeline v2 (FT-Vorbereitung, System-CEO 2026-08-07).
Quelle A: AgentMemory-Episoden -> nur Lektionen/Festschreibungen (Qualität > Quantität).
Quelle B: Session-Traces (webui/sessions) -> echte user/assistant-Paare mit Tool-Spuren.
Ausgabe: data/ft/curated_lessons.jsonl + curated_traces.jsonl
"""
import glob
import json
import os
from datetime import datetime
from pathlib import Path

BASE = Path("/workspace/nexifyai/data/ft")
EPISODES = BASE / "episodes.jsonl"
LESSONS_OUT = BASE / "curated_lessons.jsonl"
TRACES_OUT = BASE / "curated_traces.jsonl"
SESSIONS_DIR = Path("/root/.hermes/webui/sessions")
MIN_LEN = 200
SINCE_TS = datetime(2026, 7, 1).timestamp()

def curate_lessons():
    if not EPISODES.exists():
        print("WARN: episodes.jsonl fehlt — zuerst ft-dataset-export.py laufen lassen")
        return 0
    seen = set()
    n = 0
    with LESSONS_OUT.open("w") as out:
        for line in EPISODES.read_text(errors="ignore").splitlines():
            try:
                ep = json.loads(line)
            except json.JSONDecodeError:
                continue
            if ep.get("source") != "agentmemory":
                continue
            status = str(ep.get("status", ""))
            if not any(k in status.lower() for k in ("lesson", "lektion", "rejected", "festschreibung")):
                continue
            content = ep.get("outcome", "")
            if len(content) < MIN_LEN:
                continue
            key = ep.get("mem_id") or content[:80]
            if key in seen:
                continue
            seen.add(key)
            out.write(json.dumps(ep, ensure_ascii=False) + "\n")
            n += 1
    print(f"A: {n} kuratierte Lektionen -> {LESSONS_OUT}")
    return n

def curate_traces():
    n = 0
    pairs = 0
    seen = set()
    with TRACES_OUT.open("w") as out:
        for f in glob.glob(str(SESSIONS_DIR / "*.json")):
            try:
                d = json.load(open(f))
            except (OSError, json.JSONDecodeError):
                continue
            if not isinstance(d, dict):
                continue
            if d.get("profile") not in (None, "default"):
                continue
            msgs = d.get("messages")
            if not isinstance(msgs, list) or not msgs:
                continue
            n += 1
            for m in msgs:
                if not isinstance(m, dict):
                    continue
                role = m.get("role")
                content = m.get("content")
                ts = m.get("timestamp") or m.get("created_at") or 0
                if role not in ("user", "assistant") or not isinstance(content, str):
                    continue
                if len(content) < 60:
                    continue
                if isinstance(ts, (int, float)) and ts > 0 and ts < SINCE_TS:
                    continue
                key = content[:120]
                if key in seen:
                    continue
                seen.add(key)
                out.write(json.dumps({
                    "source": "session_trace",
                    "session": d.get("session_id", ""),
                    "role": role,
                    "content": content[:4000],
                    "ts": ts,
                    "model": d.get("model", ""),
                }, ensure_ascii=False) + "\n")
                pairs += 1
    print(f"B: {n} Sessions verarbeitet, {pairs} kuratierte Nachrichten -> {TRACES_OUT}")
    return pairs

if __name__ == "__main__":
    BASE.mkdir(parents=True, exist_ok=True)
    a = curate_lessons()
    b = curate_traces()
    print(f"GESAMT: {a} Lektionen + {b} Trace-Nachrichten")
