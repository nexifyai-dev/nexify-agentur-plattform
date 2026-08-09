#!/usr/bin/env python3
"""DeepSeek FIM (Fill-In-The-Middle) — Code-Vervollstaendigung via /beta (E3 2026-08-09).
Usage: ds-fim.py --prompt "def fib(a):" --suffix "return fib(a-1)+fib(a-2)" [--model deepseek-v4-flash] [--max-tokens 512]
Nutzt DEEPSEEK_API_KEY aus /etc/nexifyai/hermes.env (oder env). Max 4K Tokens (API-Grenze)."""
import argparse, json, os, subprocess, sys

def get_key():
    for p in ("/etc/nexifyai/hermes.env", "/root/.hermes/hermes.env"):
        try:
            for line in open(p):
                if line.startswith("DEEPSEEK_API_KEY="):
                    return line.strip().split("=", 1)[1]
        except OSError:
            pass
    return os.environ.get("DEEPSEEK_API_KEY", "")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--suffix", default="")
    ap.add_argument("--model", default="deepseek-v4-flash")
    ap.add_argument("--max-tokens", type=int, default=512)
    a = ap.parse_args()
    key = get_key()
    if not key:
        print("FEHLER: DEEPSEEK_API_KEY nicht gefunden", file=sys.stderr); sys.exit(2)
    body = {"model": a.model, "prompt": a.prompt, "suffix": a.suffix, "max_tokens": a.max_tokens}
    r = subprocess.run(["curl", "-s", "--max-time", "90",
        "https://api.deepseek.com/beta/completions",
        "-H", f"Authorization: Bearer {key}", "-H", "Content-Type: application/json",
        "-d", json.dumps(body)], capture_output=True, text=True)
    try:
        d = json.loads(r.stdout)
        print(d["choices"][0]["text"], end="")
    except Exception:
        print("FIM-FEHLER:", r.stdout[:300], file=sys.stderr); sys.exit(1)

if __name__ == "__main__":
    main()
