# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/scripts/learning/SESSION-LEARN-ACQUISITION.md
# NIR: 02.08.2026 10:10
# UPDATED: 02.08.2026 10:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Wire-up note — call acquisition gap note after session-learn
# WHY: Continuous Learning PR (#203) may land separately; this documents the hook
# BEST-PRACTICE: Append to session-learn.sh once it exists on main
# PITFALL: V-LEARN-01: Never block agent on AgentMemory outage
# DEPENDS: scripts/learning/note-acquisition-gaps.py
# DOCS-REF: .cursor/rules/60-proactive-acquisition-gaps.mdc
# SESSION: proactive-gaps-acquisition-7dd5

# Session-Learn → Acquisition Note

Wenn `scripts/learning/session-learn.sh` (PR #203 Continuous Learning) gemerged ist,
am Ende (vor `emit_allow`) ergänzen:

```bash
# Acquisition / Lead / Conversion gaps (fail-soft)
python3 "$ROOT/scripts/learning/note-acquisition-gaps.py" \
  --summary "${SUMMARY:-Session-Ende}" >/dev/null 2>&1 || true
```

Bis dahin: Agents rufen das Script am Session-Ende manuell auf oder speichern via
`memory_save` mit Tags `acquisition,gtm,gap-radar`.

Living Checklist: `docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md`.
