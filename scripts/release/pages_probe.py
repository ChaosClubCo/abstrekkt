#!/usr/bin/env python3
"""Read back a Cloudflare Pages release and classify the production apex.

readback  Byte-compare every served package file on the immutable deployment URL,
          check security + release headers, and confirm misses serve 404.html.
apex      preflight:  REACHABLE | CHALLENGED | FOREIGN_ORIGIN   (before deploy)
          postdeploy: MATCH     | CHALLENGED | STALE_OR_FOREIGN (after deploy)
          The apex is compared by release header and non-HTML bytes only, because
          zone features (email obfuscation, Rocket Loader, injected scripts) may
          legitimately rewrite HTML on the custom domain but not on *.pages.dev.

Exit codes: 0 = pass, 2 = apex challenged, 1 = any other failure.
"""
from __future__ import annotations

import argparse
import secrets
import sys
import time
from pathlib import Path

from release_common import emit, fetch, html_title, is_challenge, package_manifest, route_for, sha256_bytes

SECURITY_HEADERS = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
}
RELEASE_HEADER = "x-abstrekkt-release"


def _url(base: str, path: str) -> str:
    return base.rstrip("/") + path


def _check(checks: list[dict], name: str, ok: bool, detail: str) -> bool:
    checks.append({"check": name, "ok": ok, "detail": detail})
    return ok


def readback(base: str, root: Path, release_sha: str | None, wait_seconds: int) -> dict:
    manifest = package_manifest(root)
    checks: list[dict] = []
    deadline = time.monotonic() + wait_seconds
    home = fetch(_url(base, "/"))
    while home["status"] != 200 and time.monotonic() < deadline:
        time.sleep(5)
        home = fetch(_url(base, "/"))

    for relative, expected in manifest.items():
        route = route_for(relative)
        if route is None:
            continue
        served = fetch(_url(base, route), attempts=3)
        actual = sha256_bytes(served["body"]) if served["status"] == 200 else None
        _check(checks, f"bytes {route}", actual == expected,
               f"status={served['status']} expected={expected[:12]} actual={(actual or '-')[:12]}")

    headers = home.get("headers", {})
    for header, value in SECURITY_HEADERS.items():
        _check(checks, f"header {header}", headers.get(header) == value, f"got={headers.get(header)!r}")
    if release_sha:
        _check(checks, f"header {RELEASE_HEADER}", headers.get(RELEASE_HEADER) == release_sha,
               f"got={headers.get(RELEASE_HEADER)!r}")

    if "404.html" in manifest:
        miss = fetch(_url(base, f"/__release-miss-{secrets.token_hex(6)}"))
        _check(checks, "404 for unknown path", miss["status"] == 404, f"status={miss['status']}")
        _check(checks, "404 body is package 404.html",
               sha256_bytes(miss["body"]) == manifest["404.html"], "byte comparison")

    status = "PASS" if checks and all(c["ok"] for c in checks) else "FAIL"
    return {"mode": "readback", "base": base, "status": status, "checks": checks}


def apex(base: str, root: Path, phase: str, release_sha: str | None, wait_seconds: int) -> dict:
    manifest = package_manifest(root)
    expected_title = html_title((root / "index.html").read_bytes())
    checks: list[dict] = []
    deadline = time.monotonic() + wait_seconds
    while True:
        home = fetch(_url(base, "/"), attempts=3)
        headers = home.get("headers", {})
        if is_challenge(home):
            classification = "CHALLENGED"
        elif phase == "preflight":
            title = html_title(home["body"]) if home["status"] == 200 else None
            classification = "REACHABLE" if title == expected_title else "FOREIGN_ORIGIN"
            _check(checks, "title", title == expected_title,
                   f"status={home['status']} title={title!r} expected={expected_title!r}")
        else:
            classification = _postdeploy(base, manifest, headers, release_sha, checks)
        if classification in ("MATCH", "REACHABLE", "CHALLENGED") or time.monotonic() >= deadline:
            break
        checks.clear()
        time.sleep(10)

    return {
        "mode": "apex",
        "phase": phase,
        "base": base,
        "classification": classification,
        "httpStatus": home["status"],
        "cfMitigated": headers.get("cf-mitigated"),
        "cfRay": headers.get("cf-ray"),
        "checks": checks,
    }


def _postdeploy(base: str, manifest: dict, headers: dict, release_sha: str | None, checks: list) -> str:
    ok = _check(checks, f"header {RELEASE_HEADER}", bool(release_sha) and headers.get(RELEASE_HEADER) == release_sha,
                f"got={headers.get(RELEASE_HEADER)!r} expected={release_sha!r}")
    for relative, expected in manifest.items():
        route = route_for(relative)
        if route is None or relative.endswith(".html"):
            continue
        served = fetch(_url(base, route), attempts=3)
        actual = sha256_bytes(served["body"]) if served["status"] == 200 else None
        ok = _check(checks, f"bytes {route}", actual == expected,
                    f"status={served['status']} expected={expected[:12]} actual={(actual or '-')[:12]}") and ok
    return "MATCH" if ok else "STALE_OR_FOREIGN"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("mode", choices=("readback", "apex"))
    parser.add_argument("--base", required=True, help="Origin to probe, e.g. https://abc.abstrekkt.pages.dev")
    parser.add_argument("--root", required=True, help="Exact directory that was (or will be) uploaded.")
    parser.add_argument("--phase", choices=("preflight", "postdeploy"), default="postdeploy")
    parser.add_argument("--release-sha", default=None)
    parser.add_argument("--wait-seconds", type=int, default=0, help="Keep retrying until this budget is spent.")
    parser.add_argument("--json-out", default=None)
    args = parser.parse_args()

    root = Path(args.root)
    if args.mode == "readback":
        result = readback(args.base, root, args.release_sha, args.wait_seconds)
        emit(result, args.json_out)
        return 0 if result["status"] == "PASS" else 1

    result = apex(args.base, root, args.phase, args.release_sha, args.wait_seconds)
    emit(result, args.json_out)
    if result["classification"] in ("REACHABLE", "MATCH"):
        return 0
    return 2 if result["classification"] == "CHALLENGED" else 1


if __name__ == "__main__":
    sys.exit(main())
