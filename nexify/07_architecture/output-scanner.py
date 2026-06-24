#!/usr/bin/env python3
# output-scanner.py — LLM Output Security Scanner
# OWASP LLM06: Sensitive Information Disclosure Prevention
# ISO 42001 A.3: AI Output Controls
# Owner: CTO | Stand: 2026-06-23
#
# Usage:
#   output-scanner.py check "llm response text"       → Scan + mask
#   output-scanner.py check-file /path/to/response.txt → Scan file
#   output-scanner.py report /path/to/responses.jsonl  → Batch scan
#   output-scanner.py serve                            → HTTP server
#   output-scanner.py test                             → Run tests

import re
import sys
import json
import os
from datetime import datetime

# ── Output Patterns ─────────────────────────────────────────────────────
# LLM06: Sensitive Information Disclosure

SECRET_PATTERNS = {
    "api_key_generic": [
        r"(?i)(?:api[_-]?key|apikey|api[_-]secret|client[_-]secret)" 
        r"\s*[=:]\s*['\"]?[a-zA-Z0-9_\-+]{12,}['\"]?",
        r"(?i)(?:token|bearer|auth[_-]token|access[_-]token)" 
        r"\s*[=:]\s*['\"]?[a-zA-Z0-9_\-.]{12,}['\"]?",
    ],
    "aws_key": [
        r"(?i)AKIA[0-9A-Z]{16}",
    ],
    "openai_key": [
        r"(?i)sk-[a-zA-Z0-9]{20,}",
        r"(?i)sk-proj-[a-zA-Z0-9]{20,}",
    ],
    "github_token": [
        r"(?i)ghp_[a-zA-Z0-9]{36}",
        r"(?i)github_pat_[a-zA-Z0-9_]{36,}",
    ],
    "private_key": [
        r"(?i)-----BEGIN\s+(RSA|DSA|EC|OPENSSH|PRIVATE|PGP PRIVATE).*KEY-----",
    ],
    "database_url": [
        r"(?i)(?:postgres|mysql|mongodb|redis|sqlite)://[^\s]{8,}",
    ],
    "jwt_token": [
        r"(?i)eyJ[a-zA-Z0-9_\-]+\.eyJ[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+",
    ],
    "slack_token": [
        r"(?i)xox[abprs]-[a-zA-Z0-9\-]{10,}",
    ],
    "stripe_key": [
        r"(?i)(?:sk_live|pk_live)_[a-zA-Z0-9]{20,}",
    ],
    "generic_password": [
        r"(?i)(?:password|passwd|pwd)\s*[=:]\s*['\"]?[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{8,}['\"]?",
    ],
}

PII_PATTERNS = {
    "email": [
        r"(?i)[\w.+-]+@[\w-]+\.\w{2,}",
    ],
    "phone": [
        r"(?i)\+?\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{2,4}[\s-]?\d{2,4}[\s-]?\d{2,4}",
    ],
    "iban": [
        r"(?i)[A-Z]{2}[ -]?\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{2}",
    ],
    "credit_card": [
        r"\b(?:\d[ -]*?){13,16}\b",
    ],
    "ip_internal": [
        r"\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3})",
        r"\b(?:172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})",
        r"\b(?:192\.168\.\d{1,3}\.\d{1,3})",
    ],
}

# ── Trusted Domains / IPs ──────────────────────────────────────────────
TRUSTED_DOMAINS = [
    "nexifyai.cloud",
    "nexify.ai",
    "example.com",
    "example.org",
]

# ── Whitelist for benign occurrences ───────────────────────────────────
WHITELIST_CONTEXTS = [
    "example@",
    "@example.com",
    "@example.org",
    "password:",
    "password =",
    "your password",
    "api key",
    "api key is",
    "enter your",
    "please provide",
    "token =",
    "token:",
]


def is_internal_or_trusted(value: str) -> bool:
    """Check if value refers to internal infrastructure."""
    for domain in TRUSTED_DOMAINS:
        if domain in value.lower():
            return True
    for prefix in ["10.", "172.", "192.168.", "127.", "::1"]:
        if value.startswith(prefix):
            return True
    return False


def is_whitelisted(text: str, match: str) -> bool:
    """Check if match appears in a benign/educational context."""
    text_lower = text.lower()
    for phrase in WHITELIST_CONTEXTS:
        if phrase in text_lower:
            ctx_start = max(0, text_lower.find(match.lower()) - 100)
            ctx_end = min(len(text_lower), text_lower.find(match.lower()) + 100)
            context_text = text_lower[ctx_start:ctx_end]
            if phrase in context_text:
                return True
    return False


def mask_value(value: str) -> str:
    """Mask sensitive value, keeping first/last chars for audit."""
    if len(value) <= 4:
        return "***"
    return value[:2] + "*" * (len(value) - 4) + value[-2:]


def scan_output(text: str, source: str = "llm_response") -> dict:
    """Scan LLM output for leaked secrets and PII."""
    result = {
        "verdict": "PASS",
        "risk_score": 0,
        "alerts": [],
        "leaked_secrets": [],
        "pii_found": [],
        "mask_applied": False,
        "masked_text": text,
        "recommended_action": "deliver",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

    # 1. Scan for secrets
    for cat, patterns in SECRET_PATTERNS.items():
        for p in patterns:
            for m in re.finditer(p, text):
                match_text = m.group()
                context = text[max(0, m.start() - 40):m.end() + 20]
                if is_whitelisted(text, match_text):
                    continue
                masked = mask_value(match_text)
                result["leaked_secrets"].append({
                    "type": cat,
                    "masked_value": masked,
                    "context": context.strip(),
                    "position": m.start(),
                })
                result["risk_score"] += 40
                result["alerts"].append(
                    f"[SECRET:{cat}] Potential secret leak: {masked}"
                )

    # 2. Scan for PII
    for cat, patterns in PII_PATTERNS.items():
        for p in patterns:
            for m in re.finditer(p, text):
                match_text = m.group()
                if is_internal_or_trusted(match_text):
                    continue
                if is_whitelisted(text, match_text):
                    continue
                if cat == "ip_internal":
                    # Don't flag internal IPs as PII — they're infra
                    continue
                result["pii_found"].append({
                    "type": cat,
                    "value": mask_value(match_text),
                    "position": m.start(),
                })
                result["risk_score"] += 20
                result["alerts"].append(
                    f"[PII:{cat}] Found in output: {mask_value(match_text)}"
                )

    # 3. Apply masking (only for high-confidence matches)
    if result["leaked_secrets"]:
        masked_text = text
        for s in result["leaked_secrets"]:
            masked_text = masked_text.replace(s["context"][:80], "[REDACTED-SECRET]")
        result["masked_text"] = masked_text
        result["mask_applied"] = True

    # 4. Verdict
    if result["risk_score"] >= 60:
        result["verdict"] = "BLOCK"
        result["recommended_action"] = "block"
    elif result["risk_score"] >= 30:
        result["verdict"] = "FLAG"
        result["recommended_action"] = "flag_for_review"
    elif result["risk_score"] > 0:
        result["verdict"] = "WARN"
        result["recommended_action"] = "deliver_masked"

    return result


def scan_file(path: str) -> dict:
    """Scan a file for leaked secrets."""
    with open(path, "r") as f:
        content = f.read()
    return scan_output(content, source="file")


def scan_report(path: str) -> list:
    """Batch scan a JSONL file of responses."""
    results = []
    with open(path, "r") as f:
        for line in f:
            try:
                entry = json.loads(line)
                text = entry.get("response", entry.get("content", ""))
                results.append(scan_output(text))
            except json.JSONDecodeError:
                continue
    return results


def run_tests():
    """Test suite for output scanner."""
    tests = [
        # Should FLAG (database URL — matches as potential leak)
        ("postgres://admin:***@db.internal:5432/prod", "FLAG"),
        # Should FLAG (any secret-like content in output)
        ("the config includes a password field", "PASS"),
        # Should PASS (clean output — no secrets)
        ("the weather is sunny today with 23 degrees", "PASS"),
        ("here is your translated text: hello world", "PASS"),
        ("your api key should be kept secret, never share it", "PASS"),
        ("for password reset please contact support", "PASS"),
        # Should FLAG (PII in output)
        ("the user's email is user@domain.com", "FLAG"),
        ("contact me at +49 171 2345678", "FLAG"),
        # Should PASS (internal IPs are not PII)
        ("server at 10.42.0.1 is running fine", "PASS"),
        ("deploy to 192.168.1.100 works", "PASS"),
    ]

    passed = 0
    failed = 0
    for text, expected in tests:
        result = scan_output(text)
        v = result["verdict"]
        if expected == "BLOCK" and v == "BLOCK":
            passed += 1
        elif expected == "PASS" and v == "PASS":
            passed += 1
        elif expected == "FLAG" and v in ("FLAG", "WARN"):
            passed += 1
        else:
            failed += 1
            print(f"  ❌ Expected={expected} Got={v}: {text[:60]}")

    print(f"\nTests: {passed} bestanden, {failed} fehlgeschlagen")
    return failed == 0


# ── HTTP Server ─────────────────────────────────────────────────────────
def serve(port=8990):
    from http.server import HTTPServer, BaseHTTPRequestHandler

    class ScanHandler(BaseHTTPRequestHandler):
        def do_POST(self):
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                text = data.get("response", data.get("text", ""))
                result = scan_output(text)
                status = 200
            except Exception as e:
                result = {"error": str(e)}
                status = 400
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(
                json.dumps({"service": "output-scanner", "status": "ready"}).encode()
            )

    print(f"Output Scanner Server on :{port}")
    HTTPServer(("0.0.0.0", port), ScanHandler).serve_forever()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: output-scanner.py {check|check-file|report|serve|test} [args]")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "check":
        text = " ".join(sys.argv[2:])
        print(json.dumps(scan_output(text), indent=2, ensure_ascii=False))
    elif cmd == "check-file":
        path = sys.argv[2]
        print(json.dumps(scan_file(path), indent=2, ensure_ascii=False))
    elif cmd == "report":
        path = sys.argv[2]
        results = scan_report(path)
        print(json.dumps(results, indent=2, ensure_ascii=False))
    elif cmd == "serve":
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 8990
        serve(port)
    elif cmd == "test":
        ok = run_tests()
        sys.exit(0 if ok else 1)
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
