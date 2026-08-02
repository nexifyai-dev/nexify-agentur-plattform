#!/usr/bin/env bash
# FILE: scripts/refresh-status-dashboard.sh
# NIR: 02.08.2026 09:05
# UPDATED: 02.08.2026 09:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Patch docs/operations/STATUS-DASHBOARD.md smoke table from daily-smoke TSV.
# WHY: Living ops status without manual edits.
# BEST-PRACTICE: Idempotent regex replace of the hosted-smoke table only.
# PITFALL: Never write secrets into the dashboard.
# DEPENDS: scripts/daily-smoke-hosted.sh; python3
# DOCS-REF: docs/operations/STATUS-DASHBOARD.md
# SESSION: full-auto-config-close-7dd5

set -euo pipefail

# Timezone mandate — Europe/Berlin (docs/operations/TIMEZONE-EUROPE-BERLIN.md)
export TZ=Europe/Berlin

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DASH="$ROOT/docs/operations/STATUS-DASHBOARD.md"
TSV="${SMOKE_RESULTS_FILE:-/tmp/nexify-daily-smoke.tsv}"
UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [[ ! -f "$TSV" ]]; then
  SMOKE_RESULTS_FILE="$TSV" bash "$ROOT/scripts/daily-smoke-hosted.sh" || true
fi

python3 - "$DASH" "$TSV" "$UTC" <<'PY'
import pathlib, re, sys

dash_path = pathlib.Path(sys.argv[1])
tsv_path = pathlib.Path(sys.argv[2])
utc = sys.argv[3]
rows = {}
if tsv_path.exists():
    for line in tsv_path.read_text().splitlines():
        parts = line.split("|", 3)
        if len(parts) >= 3:
            status, name, code = parts[0], parts[1], parts[2]
            rows[name] = f"| `{name}` | **{status}** HTTP {code} | {utc} |"

text = dash_path.read_text()
text = re.sub(
    r"\*\*UPDATED:\*\*.*",
    f"**UPDATED:** {utc.replace('T', ' ').replace('Z', ' UTC')}",
    text,
    count=1,
)

def cell(name: str) -> str:
    return rows.get(name, f"| `{name}` | _no data_ | — |")

new_table = "\n".join(
    [
        "| Probe | Last result | Checked at (UTC) |",
        "|-------|-------------|------------------|",
        cell("SITE_HEALTH"),
        cell("AI_ROUTER_HEALTH"),
        cell("AGENTMEMORY_PUBLIC"),
    ]
)

pattern = re.compile(
    r"\| Probe \| Last result \| Checked at \(UTC\) \|\n\|-+\|-+\|-+\|\n(?:\|.*\|\n){1,6}",
    re.M,
)
if pattern.search(text):
    text = pattern.sub(new_table + "\n", text, count=1)
else:
    text = text.replace(
        "## Hosted daily smoke (ubuntu-latest)\n\n",
        "## Hosted daily smoke (ubuntu-latest)\n\n" + new_table + "\n\n",
        1,
    )

dash_path.write_text(text)
print(f"dashboard_updated={dash_path}")
print(f"probes={sorted(rows)}")
PY
