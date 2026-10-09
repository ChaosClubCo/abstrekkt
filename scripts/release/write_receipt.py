#!/usr/bin/env python3
"""Assemble an AbstrekktReleaseReceipt/v1 from release-step outputs.

Carries every field REPOSITORY.md "Deployment authority" requires. The status is
derived from evidence, never passed in: CERTIFIED only when the immutable
deployment read-back passed AND the production apex classified as MATCH.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from release_common import package_manifest, sha256_bytes


def _load(path: str | None) -> dict:
    if not path or not Path(path).is_file():
        return {}
    return json.loads(Path(path).read_text(encoding="utf-8"))


def derive_status(readback: dict, apex: dict) -> str:
    if readback.get("status") != "PASS":
        return "FAILED"
    if apex.get("classification") == "MATCH":
        return "CERTIFIED"
    return "DEPLOYED_UNVERIFIED"


def build(args: argparse.Namespace) -> dict:
    readback = _load(args.readback)
    apex = _load(args.apex)
    preflight = _load(args.preflight)
    package = _load(args.package)
    status = derive_status(readback, apex)
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    return {
        "schemaVersion": "AbstrekktReleaseReceipt/v1",
        "observedAt": now,
        "overallStatus": status,
        "proof": {
            "repository": args.repository,
            "commit_sha": args.candidate_sha,
            "provider": "cloudflare-pages",
            "provider_project_id": args.project_name,
            "deployment_id": args.deployment_id or None,
            "public_url": args.public_url,
            "deployed_at": args.deployed_at or None,
            "verified_at": now,
            "readback_result": {"deploymentUrl": readback.get("status"), "apex": apex.get("classification")},
        },
        "releaseCandidate": {
            "sha": args.candidate_sha,
            "staticPackageRoot": args.package_label,
            "files": package_manifest(Path(args.root)),
        },
        "staticPackageVerification": package,
        "cloudflarePagesRelease": {
            "workflow": os.environ.get("GITHUB_WORKFLOW_REF"),
            "automationSha": args.automation_sha,
            "runId": os.environ.get("GITHUB_RUN_ID"),
            "runAttempt": os.environ.get("GITHUB_RUN_ATTEMPT"),
            "projectName": args.project_name,
            "deploymentUrl": args.deployment_url or None,
            "pagesDeploymentId": args.deployment_id or None,
            "wranglerVersion": args.wrangler_version,
        },
        "apexPreflight": preflight,
        "deploymentReadBack": readback,
        "productionReadBack": apex,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--root", required=True, help="Uploaded directory (hashed into the receipt).")
    parser.add_argument("--package-label", default="project/deploy/abstrekkt-com")
    parser.add_argument("--repository", required=True)
    parser.add_argument("--candidate-sha", required=True)
    parser.add_argument("--automation-sha", required=True)
    parser.add_argument("--project-name", required=True)
    parser.add_argument("--public-url", required=True)
    parser.add_argument("--deployment-id", default="")
    parser.add_argument("--deployment-url", default="")
    parser.add_argument("--deployed-at", default="")
    parser.add_argument("--wrangler-version", required=True)
    parser.add_argument("--package", help="verify_static_package.py JSON output")
    parser.add_argument("--preflight", help="pages_probe.py apex preflight JSON output")
    parser.add_argument("--readback", help="pages_probe.py readback JSON output")
    parser.add_argument("--apex", help="pages_probe.py apex postdeploy JSON output")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    receipt = build(args)
    payload = (json.dumps(receipt, indent=2, sort_keys=True) + "\n").encode("utf-8")
    Path(args.out).write_bytes(payload)
    print(f"receipt={args.out}")
    print(f"receipt_sha256={sha256_bytes(payload)}")
    print(f"overall_status={receipt['overallStatus']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
