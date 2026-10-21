#!/usr/bin/env python3
"""Fail-closed local source extraction with an all-descendants denylist preflight.

The script stages copies only. It never changes source files, contacts the network,
or creates a Git commit. A rejected selection creates no destination directory.
"""
from __future__ import annotations

import fnmatch
import hashlib
import os
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DENYLIST = ROOT / "docs/decomposition/never-extract.denylist"


class ExtractionError(Exception):
    """Unsafe or invalid source selection."""


def denied_pattern(relative: Path, patterns: list[str]) -> str | None:
    parts = relative.parts
    candidates = ["/".join(parts[:count]) for count in range(1, len(parts) + 1)]
    for pattern in patterns:
        # A pattern ending in '/**' prohibits the entire matching directory.
        expected = pattern[:-3] if pattern.endswith("/**") else pattern
        if any(
            fnmatch.fnmatchcase(candidate, expected)
            or (expected.startswith("**/") and fnmatch.fnmatchcase(candidate, expected[3:]))
            for candidate in candidates
        ):
            return pattern
    return None


def relative_checked(source: Path) -> Path:
    # Reject symlinks in any path component, including in a nested selection.
    absolute = source.absolute()
    try:
        relative = absolute.relative_to(ROOT)
    except ValueError as exc:
        raise ExtractionError(f"Source outside repository: {source}") from exc
    if not relative.parts:
        raise ExtractionError("Selecting the entire repository is prohibited")
    if ".." in relative.parts:
        raise ExtractionError("Source traversal outside repository is prohibited")
    current = ROOT
    for part in relative.parts:
        current = current / part
        if current.is_symlink():
            raise ExtractionError(f"Source contains a symbolic link: {relative}")
    if not absolute.exists():
        raise ExtractionError(f"Source path does not exist: {relative}")
    if not absolute.resolve(strict=True).is_relative_to(ROOT):
        raise ExtractionError(f"Source escapes repository: {relative}")
    if ".git" in relative.parts:
        raise ExtractionError(f"Git metadata cannot be extracted: {relative}")
    if "\n" in relative.as_posix() or "\r" in relative.as_posix():
        raise ExtractionError("Newlines in source paths are not supported by the manifest")
    return relative


def gather_sources(sources: list[str], patterns: list[str]) -> list[Path]:
    selected: set[Path] = set()
    for requested in sources:
        source = Path(requested)
        if not source.is_absolute():
            source = ROOT / source
        relative = relative_checked(source)
        entries = [source]
        if source.is_dir():
            # os.walk never follows directory symlinks with followlinks=False.
            for folder, dirs, files in os.walk(source, topdown=True, followlinks=False):
                entries.extend(Path(folder) / name for name in sorted(dirs + files))
        for entry in entries:
            rel = relative_checked(entry)
            pattern = denied_pattern(rel, patterns)
            if pattern:
                raise ExtractionError(f"REFUSED: {rel} matches denylist pattern {pattern}")
            if entry.is_file():
                if rel == Path("MANIFEST.sha256"):
                    raise ExtractionError("Source conflicts with output manifest")
                selected.add(rel)
            elif not entry.is_dir():
                raise ExtractionError(f"Unsupported source type: {rel}")
    if not selected:
        raise ExtractionError("No regular files selected for extraction")
    return sorted(selected)


def extract(files: list[Path], target: Path) -> None:
    target = target.absolute()
    if target.exists() or target.is_symlink():
        raise ExtractionError("Target must be a new, nonexistent staging directory")
    if target.resolve(strict=False).is_relative_to(ROOT):
        raise ExtractionError("Staging target must be outside this source repository")
    target.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=".extraction-", dir=target.parent))
    try:
        receipts: list[str] = []
        for relative in files:
            source = ROOT / relative
            # Revalidate before opening. O_NOFOLLOW refuses last-component symlinks.
            relative_checked(source)
            dest = staging / relative
            dest.parent.mkdir(parents=True, exist_ok=True)
            flags = os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0)
            with os.fdopen(os.open(source, flags), "rb") as original, dest.open("xb") as copy:
                digest = hashlib.sha256()
                while block := original.read(1024 * 1024):
                    copy.write(block)
                    digest.update(block)
            dest.chmod(0o600)
            receipts.append(f"{digest.hexdigest()}  ./{relative.as_posix()}\n")
        (staging / "MANIFEST.sha256").write_text("".join(receipts), encoding="utf-8")
        os.rename(staging, target)
    except BaseException:
        shutil.rmtree(staging, ignore_errors=True)
        raise


def main(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    args = [item for item in argv if item != "--dry-run"]
    if len(args) < 2 or any(item.startswith("--") for item in args):
        print("Usage: extract-subtree.sh [--dry-run] <source> ... <target>", file=sys.stderr)
        return 2
    try:
        if not DENYLIST.is_file():
            raise ExtractionError("Denylist missing: refusing extraction")
        patterns = [
            line.strip() for line in DENYLIST.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.lstrip().startswith("#")
        ]
        if not patterns:
            raise ExtractionError("Empty denylist: refusing extraction")
        files = gather_sources(args[:-1], patterns)
        if dry_run:
            print("DRY RUN: no output created")
            for item in files:
                print(item.as_posix())
        else:
            extract(files, Path(args[-1]))
            print(f"Staged {len(files)} verified files to {args[-1]}")
        return 0
    except (ExtractionError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
