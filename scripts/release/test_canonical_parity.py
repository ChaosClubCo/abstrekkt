#!/usr/bin/env python3
"""Check public-page content decisions against canonical studio HTML.

The static deploy pages intentionally transform links and image-slot tooling,
so byte-for-byte canonical equality is not expected. These assertions protect
privacy and navigation intent across those transformations.
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main() -> int:
    founder_source = (ROOT / "project/Abstrekkt Founder.html").read_text(encoding="utf-8")
    founder_public = (ROOT / "project/deploy/abstrekkt-com/founder/index.html").read_text(encoding="utf-8")
    home_source = (ROOT / "project/Abstrekkt Home.html").read_text(encoding="utf-8")
    home_public = (ROOT / "project/deploy/abstrekkt-com/index.html").read_text(encoding="utf-8")

    for label, html in (("founder source", founder_source), ("founder deploy", founder_public)):
        assert "<title>Abstrekkt | Founder</title>" in html, f"{label}: privacy-safe title missing"
        assert "<span>Abstrekkt Founder · Member 001</span>" in html, f"{label}: privacy-safe hero eyebrow missing"
        assert "<title>Abstrekkt, Kyle" not in html, f"{label}: identifying title reintroduced"
        assert "<span>Kyle Rosebrook · Founder · Member 001</span>" not in html, f"{label}: identifying eyebrow reintroduced"

    for label, html in (("home source", home_source), ("home deploy", home_public)):
        for href in (
            "Corridor Archive Manifest.html",
            "Load-Bearing Home.html",
            "Kyle Rosebrook Home.html",
        ):
            assert href not in html, f"{label}: unsupported public link reintroduced: {href}"

    print("abstrekkt-canonical-parity: PASS (founder privacy and home navigation)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
