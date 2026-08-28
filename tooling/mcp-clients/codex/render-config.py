#!/usr/bin/env python3
from __future__ import annotations
import os
import pathlib
import sys
import tomllib
from typing import NoReturn
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent
TEMPLATE = ROOT / "config.toml.template"
OUTPUT = ROOT / ".codex" / "config.toml"

def fail(message: str) -> NoReturn:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(2)

def toml_basic_string(value: str) -> str:
    return (value.replace("\\", "\\\\").replace('"', '\\"').replace("\b", "\\b").replace("\t", "\\t").replace("\n", "\\n").replace("\f", "\\f").replace("\r", "\\r"))

def validate_remote_http_url(name: str, value: str) -> None:
    parsed = urlparse(value)
    if parsed.scheme != "https": fail(f"{name} must use https://")
    if not parsed.netloc: fail(f"{name} must contain a host")
    if parsed.username or parsed.password: fail(f"{name} must not contain URL userinfo credentials")

def main() -> None:
    zapier_url = os.environ.get("ZAPIER_MCP_URL", "").strip()
    if not zapier_url: fail("ZAPIER_MCP_URL is required")
    validate_remote_http_url("ZAPIER_MCP_URL", zapier_url)
    template = TEMPLATE.read_text(encoding="utf-8")
    marker = "__ZAPIER_MCP_URL__"
    if template.count(marker) != 1: fail("template marker count is not exactly 1")
    rendered = template.replace(marker, toml_basic_string(zapier_url))
    tomllib.loads(rendered)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUTPUT.with_suffix(".toml.tmp")
    tmp.write_text(rendered, encoding="utf-8")
    tmp.replace(OUTPUT)
    print(f"Wrote {OUTPUT}")

if __name__ == "__main__": main()
