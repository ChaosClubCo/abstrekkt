#!/usr/bin/env python3
"""Bounded local conformance harness for CanonicalMemoryVerifier/v1.

This script deliberately does not write to Mem. It validates candidate shape,
rejects forbidden runtime/secret classes, computes a deterministic proposal hash,
and emits a MemoryReceipt/v1-shaped decision. Runtime mutation remains gated on
an authorized n8n/ACP/TESSA implementation plus downstream readback.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ALLOWED_CLASSES = {
    "ArchitectureDecision",
    "SystemSummary",
    "ProjectContext",
    "ResearchFinding",
    "CustomerContext",
    "Postmortem",
    "VerifiedProcedure",
    "GovernancePolicy",
    "ReleaseEvidenceSummary",
}
FORBIDDEN_TERMS = {
    "runtime_secret",
    "provider_token",
    "api_key",
    "access_token",
    "refresh_token",
    "workflowlock",
    "workflow_lock",
    "lease",
    "retrycounter",
    "retry_counter",
    "pendingtransaction",
    "pending_transaction",
    "idempotencystate",
    "idempotency_state",
    "ephemeralauthorization",
    "ephemeral_authorization",
}


def canonical_json(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def proposal_hash(candidate: dict[str, Any]) -> str:
    return "sha256:" + hashlib.sha256(canonical_json(candidate)).hexdigest()


def basic_shape_errors(candidate: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    required = {"candidate_id", "schema_version", "subject", "knowledge_class", "source", "content", "created_at"}
    missing = sorted(required - set(candidate))
    if missing:
        errors.append("MISSING_REQUIRED:" + ",".join(missing))
    if candidate.get("schema_version") != "MemoryCandidate/v1":
        errors.append("INVALID_SCHEMA_VERSION")
    if candidate.get("knowledge_class") not in ALLOWED_CLASSES:
        errors.append("DISALLOWED_KNOWLEDGE_CLASS")
    source = candidate.get("source")
    if not isinstance(source, dict) or not all(source.get(k) for k in ("system", "reference", "observed_at")):
        errors.append("INVALID_SOURCE")
    if not isinstance(candidate.get("content"), str) or not candidate.get("content", "").strip():
        errors.append("EMPTY_CONTENT")
    return errors


def forbidden_hits(candidate: dict[str, Any]) -> list[str]:
    haystack = canonical_json(candidate).decode("utf-8").lower()
    return sorted(term for term in FORBIDDEN_TERMS if term in haystack)


def verify(candidate: dict[str, Any]) -> dict[str, Any]:
    reasons = basic_shape_errors(candidate)
    hits = forbidden_hits(candidate)
    if hits:
        reasons.append("FORBIDDEN_RUNTIME_OR_SECRET_CLASS:" + ",".join(hits))

    decision = "DENY" if reasons else "ALLOW"
    digest = proposal_hash(candidate)
    return {
        "receipt_id": "local-" + digest.split(":", 1)[1][:24],
        "schema_version": "MemoryReceipt/v1",
        "candidate_id": str(candidate.get("candidate_id", "unknown")),
        "decision": decision,
        "reason_codes": reasons,
        "proposal_hash": digest,
        "canonical_note_id": None,
        "source_revision": (candidate.get("source") or {}).get("revision") if isinstance(candidate.get("source"), dict) else None,
        "target_revision": None,
        "executed_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "evidence_refs": candidate.get("evidence_refs", []) if isinstance(candidate.get("evidence_refs", []), list) else [],
        "reconciliation": {
            "status": "NOT_APPLICABLE",
            "observed_hash": None,
            "details": "Local verifier harness performs no durable Mem mutation.",
        },
    }


def fixture(candidate_id: str, content: str, knowledge_class: str = "GovernancePolicy") -> dict[str, Any]:
    return {
        "candidate_id": candidate_id,
        "schema_version": "MemoryCandidate/v1",
        "subject": candidate_id,
        "knowledge_class": knowledge_class,
        "source": {
            "system": "GITHUB",
            "reference": "self-test",
            "observed_at": "2026-08-29T00:00:00Z",
            "revision": "self-test",
        },
        "content": content,
        "sensitivity": "INTERNAL",
        "supersedes": None,
        "evidence_refs": [],
        "created_at": "2026-08-29T00:00:00Z",
    }


def run_self_test() -> int:
    cases = [
        ("valid-policy", fixture("valid-policy", "single-writer-per-domain"), "ALLOW"),
        ("secret", fixture("secret", "provider_token must be copied"), "DENY"),
        ("lease", fixture("lease", "store workflow_lock and lease state"), "DENY"),
        ("retry", fixture("retry", "persist retry_counter in memory"), "DENY"),
        ("idempotency", fixture("idempotency", "save idempotency_state"), "DENY"),
        ("pending", fixture("pending", "save pending_transaction"), "DENY"),
        ("bad-class", fixture("bad-class", "hello", "WorkflowLock"), "DENY"),
        ("empty", {**fixture("empty", "x"), "content": ""}, "DENY"),
        ("bad-version", {**fixture("bad-version", "x"), "schema_version": "MemoryCandidate/v2"}, "DENY"),
        ("deterministic-hash", fixture("deterministic-hash", "stable"), "ALLOW"),
    ]
    failures = []
    for name, candidate, expected in cases:
        result = verify(candidate)
        if result["decision"] != expected:
            failures.append(f"{name}: expected {expected}, got {result['decision']}")
        if name == "deterministic-hash" and proposal_hash(candidate) != proposal_hash(json.loads(json.dumps(candidate))):
            failures.append("deterministic-hash: proposal hash changed after JSON round-trip")
    if failures:
        print("SELF_TEST_FAILED")
        for failure in failures:
            print(failure)
        return 1
    print(f"SELF_TEST_PASS passed={len(cases)} failed=0 total={len(cases)}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return run_self_test()
    if not args.candidate:
        parser.error("provide --candidate PATH or --self-test")
    candidate = json.loads(args.candidate.read_text(encoding="utf-8"))
    result = verify(candidate)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["decision"] in {"ALLOW", "NOOP"} else 2


if __name__ == "__main__":
    sys.exit(main())
