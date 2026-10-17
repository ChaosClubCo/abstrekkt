#!/usr/bin/env python3
"""Compose the Cloudflare Pages `_headers` file for an abstrekkt.com release.

The release workflow owns the security and provenance headers. Rules already
committed in the package's `_headers` (for example the homepage `Link` header)
are preserved after the managed block instead of being overwritten. A committed
rule that tries to set a managed header fails closed: Pages joins duplicate
header values with commas, which would silently corrupt values such as
`X-Frame-Options: DENY`.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from pages_probe import RELEASE_HEADER, SECURITY_HEADERS

SHA = re.compile(r"^[0-9a-f]{40}$")
MANAGED = frozenset({*SECURITY_HEADERS, RELEASE_HEADER})
# A leading "!" is a Pages removal directive ("! X-Frame-Options", colon optional). It
# must count as touching the header, or it could strip a managed header silently.
HEADER_LINE = re.compile(r"^\s+(?:!\s*([A-Za-z0-9-]+)\s*(?::|$)|([A-Za-z0-9-]+)\s*:)")
MANAGED_CACHE_RULES = (
    "/*.html\n"
    "  Cache-Control: public, max-age=0, must-revalidate\n"
    "\n"
    "/sitemap.xml\n"
    "  Content-Type: application/xml; charset=utf-8\n"
    "  Cache-Control: public, max-age=300\n"
    "\n"
    "/robots.txt\n"
    "  Content-Type: text/plain; charset=utf-8\n"
    "  Cache-Control: public, max-age=300\n"
)


def managed_block(release_sha: str) -> str:
    lines = ["/*"]
    for name, value in SECURITY_HEADERS.items():
        lines.append(f"  {name.title()}: {value}")
    lines.append(f"  {RELEASE_HEADER.title()}: {release_sha}")
    return "\n".join(lines) + "\n\n" + MANAGED_CACHE_RULES


def managed_conflicts(committed: str) -> list[str]:
    conflicts = []
    for number, line in enumerate(committed.splitlines(), start=1):
        match = HEADER_LINE.match(line)
        name = match and (match.group(1) or match.group(2))
        if name and name.lower() in MANAGED:
            conflicts.append(f"line {number}: {line.strip()}")
    return conflicts


def compose(committed: str, release_sha: str) -> str:
    if not SHA.match(release_sha):
        raise ValueError("release SHA must be a lowercase 40-character hex SHA")
    conflicts = managed_conflicts(committed)
    if conflicts:
        raise ValueError("committed _headers sets workflow-managed headers: " + ", ".join(conflicts))
    output = managed_block(release_sha)
    preserved = committed.strip()
    if preserved:
        output += "\n# Preserved from the committed package _headers\n" + preserved + "\n"
    return output


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("root", help="Package directory that will be uploaded to Pages.")
    parser.add_argument("--release-sha", required=True)
    args = parser.parse_args()
    target = Path(args.root) / "_headers"
    committed = target.read_text(encoding="utf-8") if target.is_file() else ""
    try:
        composed = compose(committed, args.release_sha)
    except ValueError as error:
        print(f"STOP: {error}", file=sys.stderr)
        return 1
    target.write_text(composed, encoding="utf-8")
    print(f"Wrote {target} ({'preserved committed rules' if committed.strip() else 'managed rules only'})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
