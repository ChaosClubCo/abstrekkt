"""Regression coverage for extraction staging boundary (no network or secrets)."""
from __future__ import annotations

import hashlib
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[1] / "scripts" / "extract_subtree.py"


class ExtractionBoundaryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "repo"
        (self.root / "scripts").mkdir(parents=True)
        (self.root / "docs/decomposition").mkdir(parents=True)
        shutil.copy2(SOURCE, self.root / "scripts/extract_subtree.py")
        (self.root / "docs/decomposition/never-extract.denylist").write_text(
            "project/uploads/**\nmemoir/**\n**/*intinc*/**\nloxihart/**\n",
            encoding="utf-8",
        )
        (self.root / "project/uploads").mkdir(parents=True)
        (self.root / "project/uploads/secret.txt").write_text("not to be staged", encoding="utf-8")
        (self.root / "project/public").mkdir(parents=True)
        (self.root / "project/public/index.txt").write_text("safe", encoding="utf-8")
        self.target = Path(self.temp.name) / "staged"

    def run_script(self, *sources: str, dry_run: bool = False) -> subprocess.CompletedProcess[str]:
        args = [sys.executable, str(self.root / "scripts/extract_subtree.py")]
        if dry_run:
            args.append("--dry-run")
        return subprocess.run(
            [*args, *sources, str(self.target)], cwd=self.root,
            capture_output=True, text=True, check=False,
        )

    def test_denied_descendant_prevents_all_copying(self) -> None:
        result = self.run_script("project")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("project/uploads", result.stderr)
        self.assertFalse(self.target.exists())

    def test_denied_descendant_prevents_false_positive_dry_run(self) -> None:
        result = self.run_script("project", dry_run=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.target.exists())

    def test_relative_traversal_outside_repository_is_rejected(self) -> None:
        outside = Path(self.temp.name) / "private.txt"
        outside.write_text("outside", encoding="utf-8")
        result = self.run_script("../private.txt")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("outside repository", result.stderr)
        self.assertFalse(self.target.exists())

    def test_symlinks_are_rejected(self) -> None:
        link = self.root / "project/public/alias.txt"
        link.symlink_to(self.root / "project/uploads/secret.txt")
        result = self.run_script("project/public")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("symbolic link", result.stderr)
        self.assertFalse(self.target.exists())

    def test_nested_wildcard_deny_pattern_is_enforced(self) -> None:
        nested = self.root / "project/public/client_intinc_export"
        nested.mkdir()
        (nested / "export.txt").write_text("restricted", encoding="utf-8")
        result = self.run_script("project/public")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("intinc", result.stderr)
        self.assertFalse(self.target.exists())

    def test_safe_files_stage_with_hash_manifest(self) -> None:
        result = self.run_script("project/public")
        self.assertEqual(result.returncode, 0, result.stderr)
        copied = self.target / "project/public/index.txt"
        self.assertEqual(copied.read_text(encoding="utf-8"), "safe")
        self.assertEqual(
            (self.target / "MANIFEST.sha256").read_text(encoding="utf-8"),
            f"{hashlib.sha256(b'safe').hexdigest()}  ./project/public/index.txt\n",
        )

    def test_dry_run_creates_no_staging_directory(self) -> None:
        result = self.run_script("project/public", dry_run=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertFalse(self.target.exists())

    def test_existing_destination_is_never_overwritten(self) -> None:
        self.target.mkdir()
        (self.target / "preexisting.txt").write_text("keep", encoding="utf-8")
        result = self.run_script("project/public")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((self.target / "preexisting.txt").read_text(), "keep")

    def test_target_parent_symlink_into_repo_is_rejected(self) -> None:
        (self.root / "staging").mkdir()
        shortcut = Path(self.temp.name) / "repo-link"
        shortcut.symlink_to(self.root, target_is_directory=True)
        self.target = shortcut / "staging" / "copied"
        result = self.run_script("project/public")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("outside this source repository", result.stderr)
        self.assertFalse(self.target.exists())

    def test_repository_root_is_not_extractable(self) -> None:
        result = self.run_script(".")
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.target.exists())


if __name__ == "__main__":
    unittest.main()
