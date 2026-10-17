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

# Tracked files that match .gitignore are forbidden: that is how credential files
# (Infinite-heroes-env.txt, Backup-codes-*) re-entered HEAD after earlier purges.
# Only these reviewed, non-secret files are exempt.
TRACKED_IGNORED_ALLOWLIST = frozenset({
    "Unicorn-maybe/flashfusion-web/tsconfig.tsbuildinfo",
    "a2alayer/a2a-layer/cards/n8n-credential-unlocker.json",
    "a2alayer/a2a-layer/cards/secret-scanner.json",
})

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


def changed_paths(base: str | None) -> list[str]:
    if not base or set(base) == {"0"}:
        return []
    output = git("diff", "--name-only", f"{base}...HEAD")
    return [line.strip() for line in output.splitlines() if line.strip()]


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
        "repository: ChaosClubCo/abstrekkt",
        "owner_repository: ChaosClubCo/abstrekkt",
        "owner_repository: ChaosClubCo/Loxihart",
        "mutation_policy: migration_evidence_only",
        "status: UNKNOWN",
    )
    for fragment in required_registry_fragments:
        if fragment not in registry:
            fail(f"repository registry missing required authority fragment: {fragment}", failures)


def check_frozen_paths(paths: list[str], failures: list[str]) -> None:
    for path in paths:
        if path.startswith("loxihart/"):
            fail(
                f"Loxihart source subtree is frozen in Abstrekkt; migrate in ChaosClubCo/Loxihart instead: {path}",
                failures,
            )
        if path.startswith("project/deploy/abstrekkt-com/"):
            fail(
                f"generated Abstrekkt deploy package changed directly; edit canonical source and regenerate separately: {path}",
                failures,
            )


def check_tracked_ignored(failures: list[str]) -> None:
    output = git("ls-files", "-z", "--cached", "--ignored", "--exclude-standard")
    for relative in filter(None, output.split("\0")):
        if relative not in TRACKED_IGNORED_ALLOWLIST:
            fail(f"tracked file matches .gitignore (possible credential); untrack it: {relative}", failures)


def check_changed_secrets(paths: list[str], failures: list[str]) -> None:
    for relative in paths:
        path = ROOT / relative
        if not path.is_file() or path.stat().st_size > 1_000_000:
            continue
        text = read_text(path)
        if text is None:
            continue
        for label, pattern in SECRET_PATTERNS:
            if pattern.search(text):
                fail(f"possible {label} in changed file: {relative}", failures)


def check_changed_loc(paths: list[str], failures: list[str]) -> None:
    for relative in paths:
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
    check_tracked_ignored(failures)

    paths = changed_paths(args.base)
    check_frozen_paths(paths, failures)
    check_changed_secrets(paths, failures)
    check_changed_loc(paths, failures)

    if failures:
        print("repo-integrity: FAIL", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(f"repo-integrity: PASS ({len(paths)} changed paths checked)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
