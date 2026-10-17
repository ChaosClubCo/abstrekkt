#!/usr/bin/env python3
"""Read-only Cloudflare diagnosis: what serves and what challenges the apex.

Issues GET requests only. Records each endpoint's HTTP status and a minimal,
non-secret extract; a 403 is recorded as INSUFFICIENT_SCOPE instead of failing.
Never prints the token. Environment:

  CF_API_TOKEN   read-only token (repo secret CLOUDFLARE_ZONE_READ_TOKEN)
  CF_ACCOUNT_ID  account id
  CF_ZONE_ID     zone id for abstrekkt.com
  PAGES_PROJECT  default "abstrekkt"
  APEX_HOSTNAME  default "abstrekkt.com"
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

from release_common import emit

API = "https://api.cloudflare.com/client/v4"
CHALLENGE_ACTIONS = {"challenge", "managed_challenge", "js_challenge"}


def get(path: str, token: str) -> dict:
    request = urllib.request.Request(
        API + path,
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            status, body = response.status, response.read()
    except urllib.error.HTTPError as error:
        status, body = error.code, error.read()
    except (urllib.error.URLError, TimeoutError, OSError) as error:
        return {"http": 0, "scope": "ERROR", "errors": [str(error)], "result": None}
    try:
        payload = json.loads(body or b"{}")
    except json.JSONDecodeError:
        payload = {}
    scope = {200: "OK", 403: "INSUFFICIENT_SCOPE", 404: "NOT_FOUND"}.get(status, "ERROR")
    errors = [f"{e.get('code')}: {e.get('message')}" for e in payload.get("errors") or []]
    return {"http": status, "scope": scope, "errors": errors, "result": payload.get("result")}


def pick(row: dict | None, *keys: str) -> dict:
    return {key: (row or {}).get(key) for key in keys}


OPAQUE_LITERAL = re.compile(r'"([A-Za-z0-9_+=-]{20,})"')


def redact_expression(expression: str | None) -> str | None:
    """Rule expressions can compare against shared-secret headers; drop opaque literals."""
    if expression is None:
        return None
    return OPAQUE_LITERAL.sub('"<redacted>"', expression)


def rule_view(row: dict, *keys: str) -> dict:
    view = pick(row, *keys)
    view["expression"] = redact_expression(row.get("expression"))
    return view


def route_matches(pattern: str, hostname: str) -> bool:
    host_pattern, _, path_pattern = pattern.partition("/")
    host_regex = "^" + re.escape(host_pattern).replace(r"\*", ".*") + "$"
    path_regex = "^/" + re.escape(path_pattern).replace(r"\*", ".*") + "$"
    return bool(re.match(host_regex, hostname)) and bool(re.match(path_regex, "/"))


def diagnose(token: str, account: str, zone: str, project: str, apex: str) -> dict:
    report: dict = {"apexHostname": apex, "pagesProject": project, "endpoints": {}}
    ep = report["endpoints"]

    def call(name: str, path: str, extract):
        response = get(path, token)
        result = response.pop("result")
        response["data"] = extract(result) if response["scope"] == "OK" else None
        ep[name] = response
        return response["data"]

    call("zone", f"/zones/{zone}", lambda r: {**pick(r, "name", "status", "paused"),
                                               "plan": (r.get("plan") or {}).get("name")})
    for setting in ("security_level", "browser_check", "email_obfuscation", "rocket_loader"):
        call(f"setting.{setting}", f"/zones/{zone}/settings/{setting}", lambda r: pick(r, "value"))
    call("bot_management", f"/zones/{zone}/bot_management",
         lambda r: pick(r, "fight_mode", "enable_js", "ai_bots_protection", "crawler_protection",
                        "sbfm_definitely_automated", "sbfm_likely_automated", "is_robots_txt_managed"))
    call("rulesets", f"/zones/{zone}/rulesets",
         lambda r: [pick(x, "phase", "kind", "name") for x in r or []])
    custom = call("waf_custom", f"/zones/{zone}/rulesets/phases/http_request_firewall_custom/entrypoint",
                  lambda r: [rule_view(x, "action", "description", "enabled")
                             for x in (r or {}).get("rules") or []])
    routes = call("worker_routes", f"/zones/{zone}/workers/routes",
                  lambda r: [pick(x, "pattern", "script") for x in r or []])
    domains = call("worker_custom_domains",
                   f"/accounts/{account}/workers/domains?{urllib.parse.urlencode({'zone_id': zone})}",
                   lambda r: [pick(x, "hostname", "service", "environment") for x in r or []])
    for host in (apex, f"www.{apex}", f"kyle.{apex}"):
        call(f"dns.{host}", f"/zones/{zone}/dns_records?{urllib.parse.urlencode({'name': host})}",
             lambda r: [pick(x, "type", "content", "proxied") for x in r or []])
    call("snippet_rules", f"/zones/{zone}/snippets/snippet_rules",
         lambda r: [rule_view(x, "snippet_name", "enabled") for x in r or []])
    pages = call("pages_project", f"/accounts/{account}/pages/projects/{project}",
                 lambda r: {**pick(r, "name", "subdomain", "production_branch", "domains"),
                            "canonical_deployment": (r.get("canonical_deployment") or {}).get("id"),
                            "latest_deployment": (r.get("latest_deployment") or {}).get("id")})
    pages_domains = call("pages_domains", f"/accounts/{account}/pages/projects/{project}/domains",
                         lambda r: [pick(x, "name", "status") for x in r or []])

    report["apexClaims"] = {
        "workerCustomDomains": [d for d in domains or [] if d.get("hostname") == apex],
        "workerRoutes": [r for r in routes or [] if route_matches(r.get("pattern") or "", apex)],
        "pagesDomains": [d for d in pages_domains or [] if d.get("name") == apex],
    }
    level = (ep.get("setting.security_level", {}).get("data") or {}).get("value")
    bots = ep.get("bot_management", {}).get("data") or {}
    report["challengeSources"] = {
        "securityLevel": level,
        "underAttackMode": level == "under_attack",
        "botFightMode": bots.get("fight_mode"),
        "challengeRules": [r for r in custom or [] if r.get("action") in CHALLENGE_ACTIONS and r.get("enabled")],
    }
    report["pagesProductionDeployment"] = (pages or {}).get("canonical_deployment")
    report["insufficientScope"] = sorted(k for k, v in ep.items() if v["scope"] == "INSUFFICIENT_SCOPE")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--json-out", default=None)
    args = parser.parse_args()
    token = os.environ.get("CF_API_TOKEN", "")
    account = os.environ.get("CF_ACCOUNT_ID", "")
    zone = os.environ.get("CF_ZONE_ID", "")
    if not (token and account and zone):
        print("STOP: CF_API_TOKEN, CF_ACCOUNT_ID and CF_ZONE_ID are required", file=sys.stderr)
        return 1
    report = diagnose(token, account, zone, os.environ.get("PAGES_PROJECT", "abstrekkt"),
                      os.environ.get("APEX_HOSTNAME", "abstrekkt.com"))
    emit(report, args.json_out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
