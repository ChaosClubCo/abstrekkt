#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = (
    "README.md",
    "CLAUDE.md",
    "REPOSITORY.md",
    "AGENTS.md",
    "repository-registry.yaml",
    "project/CANON.md",
)

STALE_ROOT_PHRASES = (
    "no git repo anywhere in this tree",
    "this is a **handoff bundle** from claude design",
)

SECRET_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("private key", re.compile(r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----")),
    ("GitHub token", re.compile(r"\bgh[opurs]_[A-Za-z0-9_]{30,}\b")),
    ("OpenAI-style key", re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b")),
    ("bearer token", re.compile(r"(?i)authorization\s*[:=]\s*bearer\s+[A-Za-z0-9._~+/=-]{20,}")),
)

CODE_EXTENSIONS = {
    ".c", ".cc", ".cpp", ".cs", ".go", ".java", ".js", ".jsx", ".kt",
    ".mjs", ".mts", ".py", ".rb", ".rs", ".sh", ".swift", ".ts", ".tsx",
}


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)


def git(*args: str) -> str:
    completed = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout


def git_bytes(*args: str) -> bytes:
    completed = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    return completed.stdout


def parse_name_status_z(output: bytes) -> list[tuple[str, list[str]]]:
    fields = [field.decode("utf-8", "surrogateescape") for field in output.split(b"\x00") if field]
    entries: list[tuple[str, list[str]]] = []
    i = 0
    while i < len(fields):
        status = fields[i]
        i += 1
        path_count = 2 if status[:1] in {"R", "C"} else 1
        entries.append((status, fields[i:i + path_count]))
        i += path_count
    return entries


def ls_tree_blobs(revision: str) -> dict[str, str]:
    entries: dict[str, str] = {}
    for record in git_bytes("ls-tree", "-r", "-z", revision).split(b"\x00"):
        if not record:
            continue
        metadata, path = record.split(b"\t", 1)
        entries[path.decode("utf-8", "surrogateescape")] = metadata.decode().split()[2]
    return entries


def batched(items: list[str], size: int) -> list[list[str]]:
    return [items[index:index + size] for index in range(0, len(items), size)]


def changed_path_statuses(base: str | None) -> dict[str, str]:
    if not base or set(base) == {"0"}:
        return {}
    output = git_bytes("diff", "--name-status", "-z", f"{base}...HEAD")
    statuses: dict[str, str] = {}
    for status, paths in parse_name_status_z(output):
        statuses[paths[-1]] = status
    return statuses


def exact_restorations(base: str | None, statuses: dict[str, str]) -> set[str]:
    if not base or set(base) == {"0"}:
        return set()

    added_paths = sorted(path for path, status in statuses.items() if status.startswith("A"))
    if not added_paths:
        return set()

    head_blobs = ls_tree_blobs("HEAD")
    restored: set[str] = set()
    for chunk in batched(added_paths, 512):
        history = git(
            "log",
            "--format=",
            "--raw",
            "--abbrev=40",
            "--full-history",
            "--no-renames",
            base,
            "--",
            *chunk,
        )
        for line in history.splitlines():
            if "\t" not in line:
                continue
            metadata, path = line.split("\t", 1)
            parts = metadata.split()
            if len(parts) < 4:
                continue
            if head_blobs.get(path) == parts[3]:
                restored.add(path)
    return restored


def read_text(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return None


def check_required_files(failures: list[str]) -> None:
    for relative in REQUIRED_FILES:
        if not (ROOT / relative).is_file():
            fail(f"missing required authority file: {relative}", failures)


def check_root_authority(failures: list[str]) -> None:
    combined = "\n".join(
        (read_text(ROOT / name) or "").lower() for name in ("README.md", "CLAUDE.md")
    )
    for phrase in STALE_ROOT_PHRASES:
        if phrase in combined:
            fail(f"stale root authority phrase remains: {phrase!r}", failures)

    registry = read_text(ROOT / "repository-registry.yaml") or ""
    required_registry_fragments = (
        "schema: AbstrekktRepositoryRegistry/v1",
        "owner_repository: Krosebrook/Loxihart",
        "mutation_policy: migration_evidence_only",
        "status: UNKNOWN",
    )
    for fragment in required_registry_fragments:
        if fragment not in registry:
            fail(f"repository registry missing required authority fragment: {fragment}", failures)


def check_frozen_paths(paths: list[str], restored_paths: set[str], failures: list[str]) -> None:
    for path in paths:
        if path in restored_paths:
            continue
        if path.startswith("loxihart/"):
            fail(
                f"Loxihart source subtree is frozen in Abstrekkt; migrate in Krosebrook/Loxihart instead: {path}",
                failures,
            )
        if path.startswith("project/deploy/abstrekkt-com/"):
            fail(
                f"generated Abstrekkt deploy package changed directly; edit canonical source and regenerate separately: {path}",
                failures,
            )


def check_changed_secrets(paths: list[str], restored_paths: set[str], failures: list[str]) -> None:
    for relative in paths:
        if relative in restored_paths:
            continue
        path = ROOT / relative
        if not path.is_file() or path.stat().st_size > 1_000_000:
            continue
        text = read_text(path)
        if text is None:
            continue
        for label, pattern in SECRET_PATTERNS:
            if pattern.search(text):
                fail(f"possible {label} in changed file: {relative}", failures)


def check_changed_loc(paths: list[str], restored_paths: set[str], failures: list[str]) -> None:
    for relative in paths:
        if relative in restored_paths:
            continue
        path = ROOT / relative
        if not path.is_file() or path.suffix.lower() not in CODE_EXTENSIONS:
            continue
        text = read_text(path)
        if text is None:
            continue
        loc = len(text.splitlines())
        if loc > 400:
            fail(f"code file exceeds 400 LOC ({loc}): {relative}", failures)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Abstrekkt repository authority invariants.")
    parser.add_argument("--base", default=None, help="Base commit SHA for changed-path checks.")
    args = parser.parse_args()

    failures: list[str] = []
    check_required_files(failures)
    check_root_authority(failures)

    statuses = changed_path_statuses(args.base)
    paths = sorted(statuses)
    restored_paths = exact_restorations(args.base, statuses)
    check_frozen_paths(paths, restored_paths, failures)
    check_changed_secrets(paths, restored_paths, failures)
    check_changed_loc(paths, restored_paths, failures)

    if failures:
        print("repo-integrity: FAIL", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(f"repo-integrity: PASS ({len(paths)} changed paths checked)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
