# LXH-E001 Preregistration

Preregistration state: LOCKED WHEN BOTH ARMS HAVE NOT STARTED

## Research question
Can Loxihart reduce verification cost enough to preserve the economics of one generated internal workflow while maintaining equivalent-or-better assurance than conventional verification?

## Unit under test
One generated Employee Equipment Request application with fixed functionality: authentication; Employee, Manager, and IT roles; request submission; approve/reject; legal state transitions; comments; audit history; notification integration; admin/search/reporting; persistence; API access.

Excluded: payroll, PHI, financial transactions, public anonymous workflows, production IdP migration, regulated records, autonomous external financial or legal actions.

## Experimental isolation
1. Freeze source commit, dependency lockfiles, deployment artifact/container digest, specification hash, test-suite hash, model/provider/version, Loxihart version, and verification configuration before execution.
2. CONTROL and LXH use separate verifiers and isolated working context.
3. The application generator may not act as verifier.
4. A separate defect custodian owns the seeded defect key until both arms submit immutable verdicts.
5. Both arms operate against equivalent environments and identical application artifacts.

## Cost model
Total verification cost VC = human labor + compute/inference + paid tooling + review + verification-induced rework.

Human labor is measured from observed minutes multiplied by the same fully loaded hourly rate in both arms. Default analysis must report raw minutes separately from monetized cost so labor-rate assumptions cannot hide the result.

Verification Cost Reduction VCR = (VC_CONTROL - VC_LXH) / VC_CONTROL.

Elapsed Verification Time Reduction VTR = (T_CONTROL - T_LXH) / T_CONTROL.

Reverification Cost Reduction RCR = (RC_CONTROL - RC_LXH) / RC_CONTROL after the fixed five-change change set.

## Defect metrics
Recall = true seeded defects detected / total seeded defects.
Precision = true findings / all reported material findings.
Critical and High recall are evaluated independently and are non-compensatory gates.

## Evidence rule
A mandatory requirement is PASS only when a predefined test/control produced an observed result with preserved evidence bound to the exact artifact and environment. Model opinion, source inspection alone, or inferred correctness cannot satisfy a mandatory execution requirement unless the requirement explicitly defines static inspection as the control.

Allowed verdicts: PASS, FAIL, INCONCLUSIVE.

INCONCLUSIVE never counts as PASS for mandatory evidence coverage.

## Locked primary thresholds
- VCR >= 0.50
- VTR >= 0.60
- RCR >= 0.70
- criticalRecall = 1.00
- highRecall = 1.00
- overallRecall >= 0.95
- precision >= 0.85
- mandatoryEvidenceCoverage = 1.00
- reproducibility >= 0.99
- threeYearTcoImprovement >= 0.30

## Conditional band
CONDITIONAL GO is permitted only when every safety/evidence gate passes and either VCR is 0.30–0.49 inclusive or three-year TCO improvement is 0.01–0.29 inclusive. The protocol must identify the failed economic threshold explicitly; it may not relabel the result as GO.

## Automatic NO-GO
Any one condition is sufficient:
- criticalRecall < 1.00
- mandatoryEvidenceCoverage < 1.00
- reproducibility < 0.95
- VCR < 0.30
- threeYearGeneratedLoxihartTco >= threeYearReferenceTco

## Reverification change set
After initial adjudication, apply exactly five legitimate changes:
- CH-01 add request priority
- CH-02 require Finance approval for requests above $2,500
- CH-03 alter Manager permission boundary
- CH-04 change notification provider
- CH-05 add cancellation transition

Both arms reverify the same changed artifact. No verifier sees the defect key before reverification evidence is committed.

## Economic analysis
Report three scenarios:
A. Observed: measured costs only.
B. Conservative: documented higher maintenance/verification/incident assumptions applied symmetrically and disclosed.
C. Adverse: assumptions intentionally unfavorable to generated software and disclosed.

Primary GO/NO-GO uses the preregistered three-year risk-adjusted TCO model. Sensitivity analysis may supplement but may not replace the primary result.

## Amendment policy
Before execution: amendments require a new commit and an explicit AMENDMENT section containing rationale, author, timestamp, and changed fields.
After either arm starts: thresholds, defect counts/severity, scoring rules, success bands, and automatic failure rules are immutable. Any change creates a new experiment ID rather than modifying LXH-E001.

## Final adjudication
No composite score may override a failed gate. GO requires every GO threshold. CONDITIONAL GO requires all assurance gates and the conditional economic band. Otherwise the result is NO-GO.