#!/usr/bin/env python3
# prompt-filter-standalone.py — LLM01 Prompt Injection + Sensitive Info Detection
# OWASP LLM Top 10 2.0 (LLM01 + LLM06) | ISO 42001 A.3
# Owner: CTO | Stand: 2026-06-23
# Usage: filter-check.py <text>
# Returns JSON: {verdict, risk_score, alerts, pii_found}

import re, sys, json

# ── Injection-Patterns ──────────────────────────────────────────────────
INJECTION_PATTERNS = {
    "system_prompt_override": [
        r"(?i)(ignore|forget|override|disregard|overwrite)\s+(all\s+)?(prior|previous|system|above|your)\s",
        r"(?i)(ignore|disregard|forget)\s+(all\s+)?(previous|prior|above|the)\s+(instructions|prompts|rules|directives|commands)\s",
        r"(?i)you\s+(are|were)\s+(not|no\s+longer)\s+(an?\s+)?(AI|assistant|chatbot|language\s+model)",
        r"(?i)act\s+as\s+(if\s+)?you\s+(are|were)\s+(an?\s+)?(human|admin|root|sudo|god)",
        r"(?i)^(new\s+)?(system\s+)?(prompt|instruction|directive|role)\s*:\s",
    ],
    "role_play_escape": [
        r"(?i)you\s+(are\s+)?(now\s+)?(DAN|free|unlocked|unfiltered|unconstrained)",
        r"(?i)(no\s+)?(restrictions|rules|limitations|boundaries|constraints|guardrails)\s",
        r"(?i)do\s+(whatever|anything|everything)\s+(you\s+)?want",
        r"(?i)(output|respond|answer)\s+(without|regardless\s+of)\s+(filtering|safety|ethics)",
        r"(?i)(hypothetical|fictional|pretend|simulate|story\s+mode).*no\s+(rules|restrictions)",
    ],
    "data_exfiltration": [
        r"(?i)(repeat|echo|mirror|copy|dump)\s+(back|all|my|the|this)\s",
        r"(?i)(show|reveal|display|print|leak|expose)\s+(your|the|all|system|internal)\s",
        r"(?i)what\s+(is|are|was|were)\s+(your\s+)?(system\s+)?(prompt|instruction|directive)\s",
        r"(?i)(your\s+)?(system\s+)?(prompt|instructions|directives|context)\s",
    ],
    "secret_leakage": [
        r"(?i)(api[_-]?key|token|secret|password|credential|auth[_-]?token|bearer)\s*[=:]?\s*['\"]?[a-zA-Z0-9_\-]{8,}",
        r"(?i)(-----BEGIN\s+(RSA|OPENSSH|PRIVATE|PGP).*-----)",
        r"(?i)(AKIA[0-9A-Z]{16})",
        r"(?i)(sk-[a-zA-Z0-9]{20,})",
        r"(?i)(ghp_|gho_|ghu_|ghs_|ghf_)[a-zA-Z0-9_\-]{36}",
        r"(?i)(xox[abprs]-[a-zA-Z0-9\-]{10,})",
    ],
}

# ── Sensitive Content ───────────────────────────────────────────────────
PII_PATTERNS = {
    "email": r"(?i)[\w.+-]+@[\w-]+\.\w{2,}",
    "phone": r"(?i)(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{2,4}[\s-]?\d{2,4}[\s-]?\d{2,4}",
    "credit_card": r"\b(?:\d[ -]*?){13,16}\b",
    "ip_address": r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b",
}


def analyze_prompt(text: str) -> dict:
    result = {
        "verdict": "PASS",
        "risk_score": 0,
        "alerts": [],
        "recommended_action": "allow",
    }

    # 1. Injection patterns
    for cat, patterns in INJECTION_PATTERNS.items():
        matches = []
        for p in patterns:
            for m in re.finditer(p, text):
                matches.append({"match": m.group()[:80], "pos": m.start()})
        if matches:
            result["alerts"].append(f"[{cat}] {len(matches)} Treffer")
            if cat in ("data_exfiltration",):
                result["risk_score"] += len(matches) * 20
            elif cat in ("system_prompt_override",):
                result["risk_score"] += len(matches) * 40
            elif cat == "secret_leakage":
                result["risk_score"] += len(matches) * 50
            else:
                result["risk_score"] += len(matches) * 25

    # 2. PII
    for label, pat in PII_PATTERNS.items():
        matches = re.findall(pat, text)
        if matches and not all(m in ("127.0.0.1", "0.0.0.0", "::1") for m in matches):
            result["alerts"].append(f"[PII:{label}] {len(matches)} Funde")
            result["risk_score"] += 30 * len(matches)

    # 3. Verdict
    if result["risk_score"] >= 45:
        result["verdict"] = "BLOCK"
        result["recommended_action"] = "block"
    elif result["risk_score"] >= 20:
        result["verdict"] = "FLAG"
        result["recommended_action"] = "flag_for_review"
    elif result["risk_score"] > 0:
        result["verdict"] = "WARN"
        result["recommended_action"] = "allow_with_log"

    return result


if __name__ == "__main__":
    text = " ".join(sys.argv[1:])
    result = analyze_prompt(text)
    print(json.dumps(result, ensure_ascii=False, indent=2))
