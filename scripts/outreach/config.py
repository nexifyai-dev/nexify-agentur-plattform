# FILE: /scripts/outreach/config.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 11:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Outreach env config — hard caps, Hostinger/Resend split, paths
# WHY: Anti-spam pacing + GDPR defaults must not be overridable beyond safety bounds
# BEST-PRACTICE: Env names only; secrets never logged
# PITFALL: V-OUT-01/UWG-01: HARD_DAILY_CAP; --live alone never sends
# DEPENDS: SMTP_*, IMAP_*, FIRECRAWL_URL, OUTREACH_*
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

# Absolute safety ceiling — cannot be raised via env
HARD_DAILY_CAP = 800
DEFAULT_PACE_MIN_SEC = 30
DEFAULT_PACE_MAX_SEC = 60

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATA_DIR = REPO_ROOT / "data" / "outreach"

UWG_WARNING = (
    "§7 UWG (DE): E-Mail-Werbung ohne vorherige ausdrückliche Einwilligung "
    "ist auch B2B unzulässig. Cold live-send ist deaktiviert. Live nur mit "
    "--allow-opt-in-send UND consent=true (+consent_recorded_at) je Lead."
)


def _int_env(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


@dataclass(frozen=True)
class OutreachConfig:
    """Runtime config for the daily outreach job."""

    daily_cap: int
    pace_min_sec: int
    pace_max_sec: int
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_password: str
    sender_email: str
    sender_name: str
    reply_to: str
    firecrawl_url: str
    firecrawl_api_key: str
    queue_dir: Path
    state_dir: Path
    unsub_dir: Path
    unsubscribe_base_url: str
    booking_url: str
    live: bool
    enrich: bool
    require_send_allowed: bool
    allow_opt_in_send: bool

    @property
    def effective_live(self) -> bool:
        """True only when live AND explicit opt-in-send flag is set (§7 UWG)."""
        return bool(self.live and self.allow_opt_in_send)

    @property
    def smtp_ready(self) -> bool:
        return bool(self.smtp_user and self.smtp_password and self.smtp_host)

    @property
    def blocked_reason(self) -> str | None:
        if not self.smtp_user or not self.smtp_password:
            return "missing_smtp_creds:IMAP_USER+IMAP_PASSWORD (or SMTP_USER+SMTP_PASSWORD)"
        if not self.smtp_host:
            return "missing_SMTP_HOST"
        return None


def load_config() -> OutreachConfig:
    """Load config from env. Cap is clamped to HARD_DAILY_CAP."""
    requested = _int_env("OUTREACH_DAILY_CAP", HARD_DAILY_CAP)
    daily_cap = max(0, min(requested, HARD_DAILY_CAP))

    pace_min = max(5, _int_env("OUTREACH_PACE_MIN_SEC", DEFAULT_PACE_MIN_SEC))
    pace_max = max(pace_min, _int_env("OUTREACH_PACE_MAX_SEC", DEFAULT_PACE_MAX_SEC))

    data_dir = Path(os.environ.get("OUTREACH_DATA_DIR", str(DEFAULT_DATA_DIR)))
    queue_dir = Path(os.environ.get("OUTREACH_QUEUE_DIR", str(data_dir / "queue")))
    state_dir = Path(os.environ.get("OUTREACH_STATE_DIR", str(data_dir / "state")))
    unsub_dir = Path(os.environ.get("OUTREACH_UNSUB_DIR", str(data_dir / "unsub")))

    # Hostinger: backend uses IMAP_USER/IMAP_PASSWORD for SMTP login today
    smtp_user = (
        os.environ.get("SMTP_USER", "").strip()
        or os.environ.get("IMAP_USER", "").strip()
        or "mail@nexifyai.cloud"
    )
    smtp_password = (
        os.environ.get("SMTP_PASSWORD", "").strip()
        or os.environ.get("IMAP_PASSWORD", "").strip()
    )

    firecrawl = (
        os.environ.get("FIRECRAWL_URL", "").strip()
        or os.environ.get("FIRECRAWL_BASE_URL", "").strip()
        or "http://127.0.0.1:3003"
    )
    if firecrawl and "://" not in firecrawl:
        firecrawl = f"http://{firecrawl}"
    # Host→container map is 3003→3002; secrets often store container port 3002
    if "127.0.0.1:3002" in firecrawl or "localhost:3002" in firecrawl:
        firecrawl = firecrawl.replace(":3002", ":3003")

    # Live only when explicitly enabled AND creds present (safe default: dry-run)
    live_flag = os.environ.get("OUTREACH_LIVE", "").strip().lower() in (
        "1",
        "true",
        "yes",
        "on",
    )
    allow_opt_in = os.environ.get("OUTREACH_ALLOW_OPT_IN_SEND", "").strip().lower() in (
        "1",
        "true",
        "yes",
        "on",
    )

    return OutreachConfig(
        daily_cap=daily_cap,
        pace_min_sec=pace_min,
        pace_max_sec=pace_max,
        smtp_host=os.environ.get("SMTP_HOST", "smtp.hostinger.com").strip(),
        smtp_port=_int_env("SMTP_PORT", 465),
        smtp_user=smtp_user,
        smtp_password=smtp_password,
        sender_email=os.environ.get("SENDER_EMAIL", "mail@nexifyai.cloud").strip(),
        sender_name=os.environ.get("OUTREACH_SENDER_NAME", "NeXify AI").strip(),
        reply_to=os.environ.get("REPLY_TO_EMAIL", "mail@nexifyai.cloud").strip(),
        firecrawl_url=firecrawl.rstrip("/"),
        firecrawl_api_key=os.environ.get("FIRECRAWL_API_KEY", "").strip(),
        queue_dir=queue_dir,
        state_dir=state_dir,
        unsub_dir=unsub_dir,
        unsubscribe_base_url=os.environ.get(
            "OUTREACH_UNSUBSCRIBE_URL",
            "https://www.nexifyai.cloud/api/outreach/unsubscribe",
        ).strip(),
        booking_url=os.environ.get(
            "OUTREACH_BOOKING_URL",
            "https://www.nexifyai.cloud/rueckruf",
        ).strip(),
        live=live_flag,
        enrich=os.environ.get("OUTREACH_ENRICH", "1").strip().lower()
        not in ("0", "false", "no", "off"),
        require_send_allowed=os.environ.get(
            "OUTREACH_REQUIRE_SEND_ALLOWED", "1"
        ).strip().lower()
        not in ("0", "false", "no", "off"),
        allow_opt_in_send=allow_opt_in,
    )
