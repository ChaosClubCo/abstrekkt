"""Shared helpers for the abstrekkt.com Cloudflare Pages release scripts.

Stdlib only. Imported by sibling scripts, which the release workflow runs from the
trusted automation checkout, never from the candidate being released.
"""
from __future__ import annotations

import hashlib
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

USER_AGENT = "abstrekkt-release-verifier/1 (+https://github.com/ChaosClubCo/abstrekkt)"
PLATFORM_FILES = {"_headers", "_redirects"}  # consumed by Pages, never served
REQUIRED_FILES = (
    "index.html",
    "founder/index.html",
    "pillars/index.html",
    "contact/index.html",
    "404.html",
)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def package_files(root: Path) -> list[str]:
    """Relative POSIX paths of every file under root, sorted."""
    return sorted(p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file())


def package_manifest(root: Path) -> dict[str, str]:
    return {rel: sha256_bytes((root / rel).read_bytes()) for rel in package_files(root)}


def route_for(relative: str) -> str | None:
    """Public URL path Pages serves a package file at, or None when not directly served.

    Pages 308-redirects /x/index.html -> /x/ and /404.html -> /404, so directory
    routes use the trailing-slash form and 404.html is checked via a miss probe.
    """
    if relative in PLATFORM_FILES or relative == "404.html":
        return None
    if relative == "index.html":
        return "/"
    if relative.endswith("/index.html"):
        return "/" + relative[: -len("index.html")]
    return "/" + relative


def fetch(url: str, attempts: int = 1, delay: float = 5.0, timeout: float = 20.0) -> dict:
    """GET url without following redirects. Retries on network errors and 5xx."""
    last: dict = {}
    for attempt in range(1, attempts + 1):
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            opener = urllib.request.build_opener(_NoRedirect())
            with opener.open(request, timeout=timeout) as response:
                last = _result(url, response.status, response.headers, response.read())
        except urllib.error.HTTPError as error:
            last = _result(url, error.code, error.headers, error.read())
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            last = {"url": url, "status": 0, "headers": {}, "body": b"", "error": str(error)}
        if last["status"] and last["status"] < 500:
            return last
        if attempt < attempts:
            time.sleep(delay)
    return last


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):  # noqa: D401 - urllib hook
        return None


def _result(url: str, status: int, headers, body: bytes) -> dict:
    lowered = {key.lower(): value for key, value in (headers or {}).items()}
    return {"url": url, "status": status, "headers": lowered, "body": body}


def html_title(body: bytes) -> str | None:
    text = body.decode("utf-8", errors="replace")
    start = text.lower().find("<title>")
    end = text.lower().find("</title>", start + 7)
    if start == -1 or end == -1:
        return None
    return text[start + 7 : end].strip()


def is_challenge(response: dict) -> bool:
    if response.get("headers", {}).get("cf-mitigated", "").lower() == "challenge":
        return True
    return response.get("status") == 403 and html_title(response.get("body", b"")) == "Just a moment..."


def emit(result: dict, json_out: str | None) -> None:
    payload = json.dumps(result, indent=2, sort_keys=True)
    if json_out:
        Path(json_out).write_text(payload + "\n", encoding="utf-8")
    print(payload)
