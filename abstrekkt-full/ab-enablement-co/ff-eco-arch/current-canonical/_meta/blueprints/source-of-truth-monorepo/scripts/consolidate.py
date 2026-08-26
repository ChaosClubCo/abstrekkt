#!/usr/bin/env python3
"""
scripts/consolidate.py
======================
Safe batch driver for monorepo consolidation. Reads IMPORT_PLAN.csv and either:
  * prints the plan (default, --dry-run) WITHOUT touching the filesystem, or
  * runs scripts/import-repo.sh per row (only with --confirm), or
  * regenerates REPO_MAP.md from the consolidation log (--map-only).

DESIGN PRINCIPLES (carried from the source chat + hardened here):
  * DRY-RUN IS THE DEFAULT. Nothing clones or writes unless you pass --confirm.
  * Imported repos are UNTRUSTED. This driver shells out to import-repo.sh, which
    copies source without .git and never runs the imported code.
  * GitHub rate limits: imports run sequentially with a sleep between them.
  * Append-only ledger: this script never rewrites CONSOLIDATION_LOG.md history;
    REPO_MAP.md is the only file it regenerates wholesale.

Usage:
  python3 scripts/consolidate.py --plan IMPORT_PLAN.csv --dry-run
  python3 scripts/consolidate.py --plan IMPORT_PLAN.csv --confirm --only P0
  python3 scripts/consolidate.py --map-only
"""
from __future__ import annotations

import argparse
import csv
import subprocess
import sys
import time
from pathlib import Path

PRIORITIES = ("P0", "P1", "P2", "P3")


def repo_root() -> Path:
    try:
        out = subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"], text=True
        ).strip()
        return Path(out)
    except Exception:
        return Path.cwd()


def load_plan(plan_path: Path) -> list[dict]:
    if not plan_path.exists():
        sys.exit(f"ERROR: plan not found: {plan_path}")
    with plan_path.open(newline="", encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))
    required = {"priority", "repo_name", "target_dir", "github_url"}
    if rows and not required.issubset(rows[0].keys()):
        sys.exit(f"ERROR: plan missing columns. Need at least: {sorted(required)}")
    return rows


def validate(rows: list[dict]) -> list[str]:
    """Return a list of human-readable problems (does not exit)."""
    problems: list[str] = []
    seen_targets: dict[str, str] = {}
    seen_repos: dict[str, str] = {}
    for i, r in enumerate(rows, start=2):  # +1 header, +1 1-based
        pr = r.get("priority", "").strip()
        if pr not in PRIORITIES:
            problems.append(f"row {i}: bad priority {pr!r} (expected one of {PRIORITIES})")
        tgt = r.get("target_dir", "").strip()
        if tgt in seen_targets:
            problems.append(f"row {i}: duplicate target_dir {tgt!r} (also row {seen_targets[tgt]})")
        seen_targets[tgt] = str(i)
        name = r.get("repo_name", "").strip().lower()
        if name in seen_repos:
            problems.append(f"row {i}: duplicate repo_name {name!r} (also row {seen_repos[name]}) — DEDUP before import")
        seen_repos[name] = str(i)
        if not r.get("github_url", "").startswith("https://"):
            problems.append(f"row {i}: github_url must be https (got {r.get('github_url')!r})")
    return problems


def print_plan(rows: list[dict], only: str | None) -> None:
    print("DRY RUN - no files will be written, no repos will be cloned.\n")
    by_pri: dict[str, list[dict]] = {p: [] for p in PRIORITIES}
    for r in rows:
        by_pri.setdefault(r["priority"].strip(), []).append(r)
    for p in PRIORITIES:
        sel = by_pri.get(p, [])
        if only and only != p:
            continue
        if not sel:
            continue
        print(f"[{p}] {len(sel)} repo(s)")
        for r in sel:
            hist = " (history)" if r.get("preserve_history", "").strip() == "true" else ""
            print(f"   - {r['repo_name']:<32} -> {r['target_dir']}{hist}")
        print()


def run_imports(rows: list[dict], root: Path, only: str | None, sleep_s: float) -> None:
    script = root / "scripts" / "import-repo.sh"
    if not script.exists():
        sys.exit(f"ERROR: {script} not found")
    selected = [r for r in rows if (only is None or r["priority"].strip() == only)]
    print(f"CONFIRMED — importing {len(selected)} repo(s) sequentially.\n")
    for r in selected:
        env_prefix = []
        if r.get("preserve_history", "").strip() == "true":
            env_prefix = ["env", "PRESERVE_HISTORY=true"]
        cmd = env_prefix + [
            "bash", str(script),
            r["github_url"], r["target_dir"], r["priority"].strip(),
        ]
        print("$ " + " ".join(cmd))
        res = subprocess.run(cmd)
        if res.returncode != 0:
            print(f"  ! import failed for {r['repo_name']} (rc={res.returncode}) — stopping.")
            sys.exit(res.returncode)
        time.sleep(sleep_s)  # be gentle with GitHub rate limits
    print("\nAll selected imports complete. Run: pnpm install --ignore-scripts")


def regenerate_map(root: Path) -> None:
    log = root / "CONSOLIDATION_LOG.md"
    out = root / "REPO_MAP.md"
    lines = ["# REPO_MAP.md\n", "_Auto-generated from CONSOLIDATION_LOG.md — do not edit by hand._\n\n"]
    if log.exists():
        lines.append(log.read_text(encoding="utf-8"))
    else:
        lines.append("_No consolidation log yet._\n")
    out.write_text("".join(lines), encoding="utf-8")
    print(f"Wrote {out}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Safe monorepo consolidation driver.")
    ap.add_argument("--plan", default="IMPORT_PLAN.csv", help="path to IMPORT_PLAN.csv")
    ap.add_argument("--dry-run", action="store_true", help="print the plan only (default)")
    ap.add_argument("--confirm", action="store_true", help="actually run imports")
    ap.add_argument("--only", choices=PRIORITIES, help="limit to one priority tier")
    ap.add_argument("--map-only", action="store_true", help="regenerate REPO_MAP.md and exit")
    ap.add_argument("--sleep", type=float, default=2.0, help="seconds between imports")
    args = ap.parse_args()

    root = repo_root()

    if args.map_only:
        regenerate_map(root)
        return

    rows = load_plan(root / args.plan if not Path(args.plan).is_absolute() else Path(args.plan))
    problems = validate(rows)
    if problems:
        print("PLAN VALIDATION WARNINGS:")
        for p in problems:
            print(f"  ! {p}")
        print()

    if args.confirm:
        if problems:
            sys.exit("Refusing to --confirm with validation warnings. Fix the plan first.")
        run_imports(rows, root, args.only, args.sleep)
    else:
        print_plan(rows, args.only)
        print("To execute: re-run with --confirm (optionally --only P0).")


if __name__ == "__main__":
    main()
