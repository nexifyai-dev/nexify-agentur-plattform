#!/usr/bin/env bash
# FILE: /scripts/install-copilot-autonomous.sh
# WHAT: User-Setup für Copilot CLI Voll-Autonomie (Alias + ~/.copilot/settings.json).
# WHY: Einmalig auf VPS/Desktop — danach kein Ja-Bestätigen mehr nötig.
# DOCS-REF: deploy/copilot/README.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COPILOT_HOME="${COPILOT_HOME:-$HOME/.copilot}"
SETTINGS="$COPILOT_HOME/settings.json"
MARK_START='# >>> nexifyai-copilot-autonomous >>>'
MARK_END='# <<< nexifyai-copilot-autonomous <<<'

mkdir -p "$COPILOT_HOME"

# Merge user settings (preserve existing keys)
python3 - "$SETTINGS" <<'PY'
import json, sys
from pathlib import Path
p = Path(sys.argv[1])
base = {}
if p.exists():
    try:
        base = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        base = {}
patch = {
    "askUser": False,
    "allowedUrls": sorted(set(base.get("allowedUrls", []) + [
        "github.com", "*.github.com",
        "gitlab.nexifyai.cloud", "*.nexifyai.cloud",
        "raw.githubusercontent.com",
    ])),
    "footer": {**base.get("footer", {}), "showYolo": True},
}
base.update(patch)
p.write_text(json.dumps(base, indent=2) + "\n", encoding="utf-8")
print(f"✅ {p} (askUser=false)")
PY

# Shell alias (idempotent block)
for rc in "$HOME/.bashrc" "$HOME/.zshrc"; do
  [[ -f "$rc" ]] || continue
  if grep -q "$MARK_START" "$rc" 2>/dev/null; then
    echo "✅ Alias bereits in $rc"
    continue
  fi
  cat >>"$rc" <<EOF

$MARK_START
# NeXifyAI: Copilot CLI ohne Bestätigungen
alias copilot-nexify='$ROOT/scripts/copilot-autonomous.sh'
alias copilot-yolo='$ROOT/scripts/copilot-autonomous.sh'
$MARK_END
EOF
  echo "✅ Alias copilot-nexify → $rc"
done

chmod +x "$ROOT/scripts/copilot-autonomous.sh"

echo
echo "Nutzung:"
echo "  copilot-nexify              # interaktiv, vollautonom"
echo "  copilot-nexify -p '…' -s    # ein Prompt, non-interactive"
echo
echo "Einmalig beim ersten Start: Verzeichnis dauerhaft vertrauen (Copilot-Dialog Option 2)."
echo "Org-Blocker: permissions.disableBypassPermissionsMode=disable verhindert --yolo."
