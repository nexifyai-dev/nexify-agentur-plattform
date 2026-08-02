# FILE: backend/tests/test_locale_util.py
# NIR: 02.08.2026 09:50
# WHAT: Accept-Language default is German (de)
# DOCS-REF: docs/operations/LOCALE-DE-STANDARD.md

from locale_util import DEFAULT_LOCALE, parse_accept_language


def test_default_locale_is_de():
    assert DEFAULT_LOCALE == "de"
    assert parse_accept_language(None) == "de"
    assert parse_accept_language("") == "de"
    assert parse_accept_language("bogus") == "de"


def test_parses_supported_languages():
    assert parse_accept_language("en-US,en;q=0.9") == "en"
    assert parse_accept_language("nl-NL,nl;q=0.9,en;q=0.8") == "nl"
    assert parse_accept_language("de-DE,de;q=0.9") == "de"


def test_q_values_pick_highest():
    assert parse_accept_language("en;q=0.5,de;q=0.9") == "de"
