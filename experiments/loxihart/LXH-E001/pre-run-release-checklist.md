# LXH-E001 Pre-Run Release Checklist

This checklist is the release gate for starting either verification arm. Every item must be satisfied. A failed item blocks execution; it may not be waived by narrative judgment.

## A. Reference application identity
- [ ] Checkout exact source commit `2f59b0443d63a2ad15d36496244d263081c518a0`.
- [ ] Use only `experiments/loxihart/LXH-E001/reference-app` from that commit as the pristine reference application.
- [ ] Verify `package.json` Git blob SHA = `beeb383fddec5964b33a43ec7042a2cd123ee832`.
- [ ] Verify `src/` Git tree SHA = `0a9adc2eac2c0fdc6ee54316093d1e764838efb2`.
- [ ] Verify `test/` Git tree SHA = `5084306bf934d4c8475237fa5070cd5eadb914a1`.
- [ ] Recompute the canonical reference identity and verify SHA-256 = `5d9501ef4936e97fa0abec8d7b945c696a278d5ad7041ae4b9863c7564c7251a`.
- [ ] Record runtime version; Node major version must satisfy `>=20`.
- [ ] Run the pristine reference test suite and preserve stdout/stderr and exit status as pre-seeding evidence.

## B. Preregistered protocol integrity
- [ ] Verify `preregistration.md` Git blob SHA = `7fac7c5e7d93ff2a89ce0342575f9b0ecac4fb00`.
- [ ] Verify `acceptance-manifest.json` Git blob SHA = `8653647d9a42f1a921cf9e6e377a922bbfa64756`.
- [ ] Verify `requirements.yaml` Git blob SHA = `62c20535d27b488779d2c6275ddb4db346ab82b6`.
- [ ] Confirm GO thresholds remain: VCR >= 0.50; VTR >= 0.60; RCR >= 0.70; critical recall = 1.00; high recall = 1.00; overall recall >= 0.95; precision >= 0.85; mandatory evidence coverage = 1.00; reproducibility >= 0.99; three-year TCO improvement >= 0.30.
- [ ] Confirm automatic NO-GO rules remain unchanged.
- [ ] Confirm no composite score or discretionary override has been introduced.

## C. Defect corpus integrity and custody
- [ ] Confirm exactly 20 frozen defect commitments exist.
- [ ] Confirm severity distribution = 3 CRITICAL / 9 HIGH / 7 MEDIUM / 1 LOW.
- [ ] Verify plaintext corpus SHA-256 commitment = `09d8e20f2fa38a0f52c8e0dde078db1fe7096eb25974833ac08c4fbd12df5f43`.
- [ ] Verify ciphertext SHA-256 = `7a197de1691840e26f2b35d667e1a6d565d38c6fa920ee1676806c1b8b433ad0`.
- [ ] Verify custodian key fingerprint SHA-256 = `cb6b8dc54324c53d514fe716d964f6c210794b49f4e77326f4fd4accf9a564ce` without disclosing the key to either verifier.
- [ ] Custodian decrypts in an isolated context and confirms plaintext SHA-256 and all 20 per-defect commitments.
- [ ] Custodian records successful integrity verification without publishing plaintext defects.
- [ ] CONTROL verifier has not seen plaintext defect details or the key.
- [ ] LXH verifier has not seen plaintext defect details or the key.

## D. Seeded artifact construction
- [ ] Apply the frozen 20-defect corpus to a copy of the pristine reference application, never to the frozen source commit.
- [ ] Produce one canonical seeded artifact used by both arms.
- [ ] Compute and record the seeded artifact Git/tree or archive SHA-256 identity before either arm sees it.
- [ ] Preserve a mapping from each seeded defect ID to its applied mutation solely within custodian/adjudicator custody.
- [ ] Verify all intended mutations are present and no unregistered mutation was introduced.
- [ ] Verify the seeded artifact is bit-identical for CONTROL and LXH inputs.

## E. Environment equivalence
- [ ] Freeze runtime, OS/container image, dependency resolution, test fixtures, network policy, secrets policy, and seeded dataset.
- [ ] Compute environment identity/hash before execution.
- [ ] Give both arms equivalent access to the same application artifact and allowed tooling class.
- [ ] Record any unavoidable tool asymmetry before execution; do not add compensating privileges after results begin.

## F. Verifier isolation
- [ ] CONTROL and LXH verifier identities are distinct.
- [ ] Generator is not either verifier.
- [ ] CONTROL working context contains no LXH findings/results.
- [ ] LXH working context contains no CONTROL findings/results.
- [ ] Neither arm can read custodian plaintext, mutation mappings, or the custody key.

## G. Result immutability contract
- [ ] Pre-create output schemas/locations for `control-results.json` and `loxihart-results.json`.
- [ ] Require each result to include verifier identity, start/end timestamps, frozen artifact identity, environment identity, complete findings, evidence references, human minutes, compute/tool cost, and final PASS/FAIL/INCONCLUSIVE decision.
- [ ] Once submitted, hash and commit each result artifact before unblinding.
- [ ] Corrections after submission must be a new superseding artifact; original results remain preserved.
- [ ] Initial unblinding is prohibited until both result hashes exist.

## H. Reverification protection
- [ ] Preserve CH-01 through CH-05 exactly as preregistered.
- [ ] Do not disclose plaintext seeded defect details to either verifier after initial scoring.
- [ ] Apply the same five legitimate changes to the same seeded baseline for both arms.
- [ ] Hash and commit both reverification result artifacts before final unblinding.

## RELEASE DECISION
Execution status is **READY** only when every checkbox A-H is satisfied and a signed/committed pre-run release record contains all frozen identities.

If any custody, threshold, artifact-identity, or verifier-isolation rule is violated, execution status is **BLOCKED**. If violation occurs after an arm begins, LXH-E001 is **INVALID/CONTAMINATED** and must be restarted under a new experiment ID.
