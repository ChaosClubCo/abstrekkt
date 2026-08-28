# LXH-E001 — Verification Economics Pilot

Status: PREREGISTERED / NOT YET EXECUTED

## Purpose
Test whether Loxihart can reduce the verification cost of a generated internal workflow enough to preserve its economic advantage without reducing measurable assurance.

## Workflow under test
Employee Equipment Request: authenticated employee submission, manager decision, IT decision, fulfillment, closure, comments, audit trail, notifications, admin/search/reporting, persistence, and API access.

## Experimental arms
- CONTROL: conventional human-heavy verification with normal CI/scanning/testing practices and no Loxihart.
- LXH: Loxihart verification using requirement-to-control-to-test-to-execution-to-evidence-to-verdict traceability.

Both arms receive the same frozen application, specification, environment, and seeded defect corpus. Neither verifier may see defect locations before both verdicts are committed.

## Primary hypothesis
Loxihart reduces total verification cost by at least 50% relative to CONTROL while preserving all critical assurance gates.

## Locked GO gates
- Critical defect recall = 100%
- High defect recall = 100%
- Overall defect recall >= 95%
- Precision >= 85%
- Mandatory evidence coverage = 100%
- Reproducibility >= 99%
- Verification cost reduction >= 50%
- Verification elapsed-time reduction >= 60%
- Reverification cost reduction >= 70%
- Three-year risk-adjusted TCO improvement >= 30%

## Automatic NO-GO gates
Any of the following is an automatic NO-GO:
- Critical defect recall < 100%
- Mandatory evidence coverage < 100%
- Reproducibility < 95%
- Verification cost reduction < 30%
- Generated + Loxihart three-year TCO >= reference TCO

## Required package
- preregistration.md
- requirements.yaml
- acceptance-manifest.json
- seeded-defects.template.json
- adjudication.md
- control-results.json
- loxihart-results.json
- reverification-results.json
- economic-model.json
- final-verdict.json

No threshold in this directory may be changed after either verification arm begins execution. Any amendment before execution must be committed with rationale and invalidates earlier preregistration hashes.