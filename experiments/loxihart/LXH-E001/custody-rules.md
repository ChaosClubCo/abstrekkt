# LXH-E001 Defect Corpus Custody Rules

Status: FROZEN BEFORE EITHER VERIFICATION ARM RUNS

## Roles
- **Defect custodian**: the only party permitted to possess the corpus decryption key before unblinding.
- **CONTROL verifier**: must not receive the decryption key, plaintext defect descriptions, mutation instructions, or seeded locations.
- **LXH verifier**: must not receive the decryption key, plaintext defect descriptions, mutation instructions, or seeded locations.
- **Adjudicator**: may receive the key only after both arms have committed immutable initial results and the preregistered unblinding condition is satisfied.

## Frozen corpus artifacts
- Public commitment manifest: `defect-corpus.commitments.json`
- Encrypted plaintext corpus: `defect-corpus.encrypted.json`
- Plaintext corpus SHA-256: `09d8e20f2fa38a0f52c8e0dde078db1fe7096eb25974833ac08c4fbd12df5f43`
- Ciphertext SHA-256: `7a197de1691840e26f2b35d667e1a6d565d38c6fa920ee1676806c1b8b433ad0`
- Key fingerprint SHA-256: `cb6b8dc54324c53d514fe716d964f6c210794b49f4e77326f4fd4accf9a564ce`

The decryption key is intentionally excluded from GitHub and verifier-visible artifacts.

## Custody rules
1. The decryption key must remain outside both verifier workspaces and outside Git history.
2. Neither verifier may inspect, derive, request, or receive the plaintext defect corpus before permitted unblinding.
3. The public commitment manifest may be visible to verifiers; it discloses only ID, category, severity, and SHA-256 commitment.
4. The encrypted corpus may be copied into evidence bundles because possession without the key does not disclose the defect key.
5. Before unblinding, both arms must commit immutable result artifacts containing their complete findings, timestamps, artifact hash, environment hash, and verifier identity.
6. After both initial-arm results are committed, the adjudicator may decrypt the corpus solely to score initial recall/precision and map findings to seeded defects.
7. The plaintext defect key must not be disclosed back to either verifier before the fixed five-change reverification phase is complete. The adjudicator may retain it in an isolated context.
8. After both reverification result artifacts are committed, final unblinding is permitted.
9. If the key or plaintext defect instructions are exposed to either verifier before the allowed point, LXH-E001 is **CONTAMINATED** and cannot produce GO, CONDITIONAL_GO, or NO_GO evidence. It must terminate as INVALID and restart under a new experiment ID.
10. Any corpus mutation after this freeze, including severity, count, target, wording, or mutation behavior, creates a new experiment ID.

## Integrity check before use
A custodian must verify:
- decrypted plaintext SHA-256 equals `09d8e20f2fa38a0f52c8e0dde078db1fe7096eb25974833ac08c4fbd12df5f43`;
- key SHA-256 equals `cb6b8dc54324c53d514fe716d964f6c210794b49f4e77326f4fd4accf9a564ce`;
- corpus contains exactly 20 defects;
- severities remain 3 CRITICAL, 9 HIGH, 7 MEDIUM, 1 LOW;
- each defect canonical JSON object matches its published per-defect commitment.

No failed integrity check may be waived.