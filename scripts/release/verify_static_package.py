#!/usr/bin/env python3
"""Gate the exact directory about to be uploaded to Cloudflare Pages.

Fails on: missing required pages, disallowed file types, oversize files, too many
files, or secret-shaped content (patterns shared with scripts/repo_integrity.py).
Warns (does not fail) on internal links that resolve to nothing in the package:
project/CANON.md documents known sibling-property 404s that ship intentionally.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path, PurePosixPath

from release_common import PLATFORM_FILES, REQUIRED_FILES, SECRET_PATTERNS, emit, package_files

ALLOWED_SUFFIXES = {
    ".html", ".css", ".js", ".mjs", ".json", ".txt", ".xml", ".svg",
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".woff", ".woff2",
}
TEXT_SUFFIXES = {".html", ".css", ".js", ".mjs", ".json", ".txt", ".xml", ".svg"}
MAX_FILE_BYTES = 5 * 1024 * 1024
MAX_FILES = 200
LINK_ATTR = re.compile(r"""(?:href|src)\s*=\s*["']([^"']+)["']""", re.IGNORECASE)
EXTERNAL = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//|#)", re.IGNORECASE)


def resolve_link(page: str, link: str, present: set[str]) -> bool:
    target = link.split("#", 1)[0].split("?", 1)[0]
    if not target:
        return True
    base = PurePosixPath("/") / PurePosixPath(page).parent
    joined = PurePosixPath(target) if target.startswith("/") else base / target
    parts: list[str] = []
    for part in joined.parts[1:]:
        if part == "..":
            if parts:
                parts.pop()
        elif part not in ("", "."):
            parts.append(part)
    path = "/".join(parts)
    candidates = [f"{path}/index.html" if path else "index.html"]
    if target.endswith("/"):
        return candidates[0] in present
    candidates += [path, f"{path}.html"]
    return any(candidate in present for candidate in candidates)


def verify(root: Path) -> dict:
    failures: list[str] = []
    warnings: list[str] = []
    if not root.is_dir():
        return {"status": "FAIL", "failures": [f"package root not found: {root}"], "warnings": []}

    files = package_files(root)
    present = set(files)
    for required in REQUIRED_FILES:
        path = root / required
        if not path.is_file() or path.stat().st_size == 0:
            failures.append(f"missing or empty required file: {required}")
    if len(files) > MAX_FILES:
        failures.append(f"package has {len(files)} files; limit is {MAX_FILES}")

    for relative in files:
        path = root / relative
        name = PurePosixPath(relative).name
        suffix = PurePosixPath(relative).suffix.lower()
        if name.startswith(".") or (suffix not in ALLOWED_SUFFIXES and relative not in PLATFORM_FILES):
            failures.append(f"disallowed file type in release package: {relative}")
            continue
        if path.stat().st_size > MAX_FILE_BYTES:
            failures.append(f"file exceeds {MAX_FILE_BYTES} bytes: {relative}")
        if suffix not in TEXT_SUFFIXES and relative not in PLATFORM_FILES:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for label, pattern in SECRET_PATTERNS:
            if pattern.search(text):
                failures.append(f"possible {label} in release package: {relative}")
        if suffix == ".html":
            for link in LINK_ATTR.findall(text):
                if not EXTERNAL.match(link) and not resolve_link(relative, link, present):
                    warnings.append(f"unresolved internal link in {relative}: {link}")

    return {
        "status": "FAIL" if failures else "PASS",
        "fileCount": len(files),
        "failures": failures,
        "warnings": sorted(set(warnings)),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("root", help="Directory that will be uploaded to Pages.")
    parser.add_argument("--json-out", default=None)
    args = parser.parse_args()
    result = verify(Path(args.root))
    emit(result, args.json_out)
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
