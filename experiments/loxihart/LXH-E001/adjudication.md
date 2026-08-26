# LXH-E001 Adjudication Procedure

## Roles
- Generator: produces the workflow artifact; cannot verify it.
- CONTROL verifier: performs conventional verification; no access to defect key or LXH result.
- LXH verifier: performs Loxihart verification; no access to defect key or CONTROL result.
- Defect custodian/adjudicator: prepares and protects the seeded defect key, unblinds only after both initial result artifacts are committed, and resolves finding-to-defect matches using the rules below.

## Submission lock
Each arm must commit a result artifact containing start/end timestamps, human minutes by activity, compute/inference/tooling cost, findings, requirement verdicts, evidence references, artifact/environment hashes, and final release verdict. Once both artifacts are committed, their commits are the immutable comparison inputs.

## Finding match rule
A reported finding counts as a true positive only when it identifies the affected behavior/control with enough specificity that a competent engineer could reproduce the seeded defect without seeing the seed key. Exact file/line identification is not required unless the defect is exclusively static.

Duplicate reports of the same seeded defect count once for recall and all duplicates beyond the first are excluded from precision rather than rewarded.

A finding unrelated to any seeded defect may still be a real defect. The adjudicator must classify it as REAL_UNSEEDED or FALSE_POSITIVE using reproducible evidence. REAL_UNSEEDED findings count as true findings for precision but do not change the seeded recall denominator.

## Severity rule
Seeded severity is fixed before execution. Verifier severity labels do not modify the recall gate. A verifier may disagree with severity, but the preregistered seed severity governs threshold evaluation.

## Evidence coverage
Mandatory evidence coverage = mandatory requirements with at least one valid evidence chain / total mandatory requirements.

A valid evidence chain contains every required field in acceptance-manifest.json and resolves to an artifact whose hashes match the frozen execution inputs. Missing, unverifiable, or post-hoc reconstructed evidence yields INCONCLUSIVE for coverage purposes.

## Reproducibility
An independent rerun receives the frozen application artifact, environment declaration, verifier configuration, and evidence instructions but not prior observed outputs. A result is reproduced when the requirement/control verdict matches. Reproducibility = matching verdicts / rerun verdicts. Any critical or high disagreement must be reported separately even if aggregate reproducibility remains above threshold.

## Cost accounting
Human time is contemporaneously recorded by activity. Compute/inference cost is provider-observed usage when available; otherwise exact token/request/runtime counts are preserved and converted using the price schedule frozen on the execution date. Tooling is incremental pilot cost, not annual list price unless the tool was purchased exclusively for the arm. Verification-induced rework is time spent changing the application solely because the verifier found an issue.

Shared generation and hosting costs are excluded from VCR but included in the three-year TCO model where applicable.

## Decision order
1. Evaluate automatic NO-GO rules.
2. Evaluate non-compensatory assurance gates.
3. Evaluate all GO thresholds.
4. If GO fails, evaluate CONDITIONAL_GO eligibility.
5. Otherwise issue NO_GO.

No average, weighted score, reviewer discretion, or narrative benefit may override steps 1–5.

## Conflicts
If evidence is insufficient to classify a finding, classify it INCONCLUSIVE rather than choosing the result favorable to either arm. If a dispute could alter GO/NO-GO, rerun the relevant control before final adjudication and preserve both the original and rerun evidence.

## Final verdict record
final-verdict.json must include the frozen source commit, preregistration commit, CONTROL result commit, LXH result commit, defect-key unblinding commit/reference, metric values, each gate result, final GO|CONDITIONAL_GO|NO_GO decision, and explicit reasons for every failed threshold.