#!/usr/bin/env python3
"""Dataset-Pipeline-Skelett v1 (FT-Vorbereitung, System-CEO 2026-08-07).
Extrahiert bewertete Episoden aus task-log.jsonl + changes.jsonl in kuratierten Replay-Puffer.
Schicht-B-Vorbereitung aus Plan §12.2 — laeuft ohne Kosten, sammelt Evidenz.
"""
import json
import os
from datetime import datetime
from pathlib import Path

SRC = Path("/workspace/nexifyai/docs/autotask/task-log.jsonl")
SRC2 = Path("/workspace/nexifyai/docs/live/changes.jsonl")
OUT = Path("/workspace/nexifyai/data/ft/episodes.jsonl")

def load_jsonl(p: Path):
    if not p.exists():
        return []
    out = []
    for line in p.read_text(errors="ignore").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out

def fetch_agentmemory():
    """AgentMemory-Lektionen via REST (:3113/memories) als Episoden-Quelle."""
    import urllib.request
    try:
        with urllib.request.urlopen("http://127.0.0.1:3113/memories", timeout=15) as r:
            data = json.loads(r.read().decode())
    except Exception as e:
        print(f"WARN: AgentMemory nicht erreichbar: {e}")
        return []
    eps = []
    for m in data.get("memories", []):
        title = m.get("title", "")
        content = m.get("content", "")
        if not title and not content:
            continue
        eps.append({
            "source": "agentmemory",
            "ts": m.get("createdAt") or m.get("updatedAt") or datetime.now().isoformat(),
            "task": title[:200],
            "status": "lesson" if any(k in title.lower() for k in ("lektion", "lesson", "rejected", "festschreibung")) else m.get("type", "fact"),
            "outcome": content[:2000],
            "error": "",
            "mem_id": m.get("id", ""),
            "strength": m.get("strength", 0),
        })
    return eps

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    ep_count = 0
    with OUT.open("w") as f:
        for rec in load_jsonl(SRC):
            # Episode: task-bezogen, mit Status, soweit vorhanden
            ep = {
                "source": "task-log",
                "ts": rec.get("ts") or rec.get("timestamp") or datetime.now().isoformat(),
                "task": rec.get("task") or rec.get("title") or "",
                "status": rec.get("status") or rec.get("outcome") or "unknown",
                "outcome": rec.get("outcome") or rec.get("result") or "",
                "error": rec.get("error") or "",
            }
            if ep["task"] or ep["error"]:
                f.write(json.dumps(ep, ensure_ascii=False) + "\n")
                ep_count += 1
        for rec in load_jsonl(SRC2):
            ep = {
                "source": "changes",
                "ts": rec.get("ts") or rec.get("timestamp") or datetime.now().isoformat(),
                "task": rec.get("what") or rec.get("change") or rec.get("title") or "",
                "status": rec.get("status") or "applied",
                "outcome": rec.get("detail") or rec.get("description") or "",
            }
            if ep["task"]:
                f.write(json.dumps(ep, ensure_ascii=False) + "\n")
                ep_count += 1
        for ep in fetch_agentmemory():
            f.write(json.dumps(ep, ensure_ascii=False) + "\n")
            ep_count += 1
    print(f"OK: {ep_count} Episoden nach {OUT}")

if __name__ == "__main__":
    main()
