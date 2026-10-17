#!/usr/bin/env python3
"""Unit tests for the abstrekkt.com release scripts. Run: python3 scripts/release/test_release_scripts.py"""
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from cf_zone_diagnose import redact_expression, route_matches  # noqa: E402
from compose_headers import compose  # noqa: E402
from release_common import is_challenge, route_for  # noqa: E402
from verify_static_package import resolve_link, verify  # noqa: E402
from write_receipt import derive_status  # noqa: E402

PAGE = "<!doctype html><title>t</title><a href='/founder/'>f</a>"


def make_package(root: Path, extra: dict[str, str] | None = None) -> None:
    files = {
        "index.html": PAGE, "founder/index.html": PAGE, "pillars/index.html": PAGE,
        "contact/index.html": PAGE, "404.html": PAGE, "abstrekkt/nav-toggle.js": "void 0;",
    }
    files.update(extra or {})
    for relative, text in files.items():
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")


class RouteTests(unittest.TestCase):
    def test_routes(self):
        self.assertEqual(route_for("index.html"), "/")
        self.assertEqual(route_for("founder/index.html"), "/founder/")
        self.assertEqual(route_for("abstrekkt/nav-toggle.js"), "/abstrekkt/nav-toggle.js")
        self.assertIsNone(route_for("404.html"))
        self.assertIsNone(route_for("_headers"))


class PackageTests(unittest.TestCase):
    def test_clean_package_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            make_package(Path(tmp), {"_headers": "/*\n  X-Frame-Options: DENY\n"})
            result = verify(Path(tmp))
            self.assertEqual(result["status"], "PASS", result)
            self.assertEqual(result["warnings"], [])

    def test_dotfile_and_unknown_type_fail(self):
        with tempfile.TemporaryDirectory() as tmp:
            make_package(Path(tmp), {".env": "X=1", "notes.md": "x"})
            failures = " ".join(verify(Path(tmp))["failures"])
            self.assertIn(".env", failures)
            self.assertIn("notes.md", failures)

    def test_secret_shaped_content_fails(self):
        fake_key = "sk" + "-" + "A1b2C3d4" * 4  # assembled at runtime so this file stays clean
        with tempfile.TemporaryDirectory() as tmp:
            make_package(Path(tmp), {"abstrekkt/leak.js": f"const k = '{fake_key}';"})
            self.assertEqual(verify(Path(tmp))["status"], "FAIL")

    def test_missing_required_page_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            make_package(Path(tmp))
            (Path(tmp) / "contact" / "index.html").unlink()
            self.assertEqual(verify(Path(tmp))["status"], "FAIL")

    def test_link_resolution(self):
        present = {"index.html", "founder/index.html", "abstrekkt/nav-toggle.js"}
        self.assertTrue(resolve_link("index.html", "/founder/", present))
        self.assertTrue(resolve_link("index.html", "/founder", present))
        self.assertTrue(resolve_link("founder/index.html", "../abstrekkt/nav-toggle.js", present))
        self.assertFalse(resolve_link("index.html", "Load-Bearing Home.html", present))
        self.assertFalse(resolve_link("index.html", "/pillars/", present))


class ClassificationTests(unittest.TestCase):
    def test_challenge_detection(self):
        self.assertTrue(is_challenge({"status": 403, "headers": {"cf-mitigated": "challenge"}, "body": b""}))
        self.assertTrue(is_challenge({"status": 403, "headers": {}, "body": b"<title>Just a moment...</title>"}))
        self.assertFalse(is_challenge({"status": 404, "headers": {}, "body": b"<title>Not Found</title>"}))

    def test_receipt_status_is_derived(self):
        self.assertEqual(derive_status({"status": "PASS"}, {"classification": "MATCH"}), "CERTIFIED")
        self.assertEqual(derive_status({"status": "PASS"}, {"classification": "CHALLENGED"}), "DEPLOYED_UNVERIFIED")
        self.assertEqual(derive_status({"status": "FAIL"}, {"classification": "MATCH"}), "FAILED")
        self.assertEqual(derive_status({}, {}), "FAILED")


class HeaderCompositionTests(unittest.TestCase):
    SHA = "a" * 40

    def test_managed_headers_without_committed_rules(self):
        out = compose("", self.SHA)
        self.assertTrue(out.startswith("/*\n"))
        self.assertIn("  X-Frame-Options: DENY\n", out)
        self.assertIn("  Permissions-Policy: camera=(), microphone=(), geolocation=()\n", out)
        self.assertIn(f"  X-Abstrekkt-Release: {self.SHA}\n", out)
        self.assertNotIn("Preserved", out)

    def test_committed_rules_are_preserved_after_managed_block(self):
        committed = '/\n  Link: </pillars/>; rel="describedby"; type="text/html"\n'
        out = compose(committed, self.SHA)
        self.assertIn('/\n  Link: </pillars/>; rel="describedby"; type="text/html"\n', out)
        self.assertLess(out.index("X-Frame-Options"), out.index("Link:"))

    def test_committed_managed_header_fails_closed(self):
        with self.assertRaises(ValueError):
            compose("/*\n  x-frame-options: SAMEORIGIN\n", self.SHA)
        with self.assertRaises(ValueError):
            compose("/*\n  X-Abstrekkt-Release: spoofed\n", self.SHA)

    def test_committed_removal_of_managed_header_fails_closed(self):
        for rule in ("  !X-Frame-Options:", "  ! x-frame-options", "  ! X-Abstrekkt-Release:"):
            with self.subTest(rule=rule), self.assertRaises(ValueError):
                compose("/*\n" + rule + "\n", self.SHA)
        out = compose("/assets/*\n  ! Link\n", self.SHA)
        self.assertIn("! Link", out)

    def test_invalid_release_sha_rejected(self):
        with self.assertRaises(ValueError):
            compose("", "HEAD")


class ZoneDiagnoseTests(unittest.TestCase):
    def test_route_patterns(self):
        self.assertFalse(route_matches("*.abstrekkt.com/*", "abstrekkt.com"))
        self.assertTrue(route_matches("abstrekkt.com/*", "abstrekkt.com"))
        self.assertTrue(route_matches("*abstrekkt.com/*", "abstrekkt.com"))
        self.assertFalse(route_matches("abstrekkt.com/api/*", "abstrekkt.com"))

    def test_expression_redaction(self):
        opaque = "Q" * 12 + "w" * 12
        expression = f'http.host eq "abstrekkt.com" and http.request.headers["x-k"][0] eq "{opaque}"'
        redacted = redact_expression(expression)
        self.assertIn('"abstrekkt.com"', redacted)
        self.assertNotIn(opaque, redacted)


if __name__ == "__main__":
    unittest.main(verbosity=2)
