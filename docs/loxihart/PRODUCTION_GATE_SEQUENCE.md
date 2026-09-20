# Loxihart Production Gate Sequence

Base frozen candidate: `a237db22e7159df2327d0b92ca624079ac124ff8`.

The frozen candidate is immutable. Remediation occurs on `loxihart/production-gates-2026-08-21` and will produce a new candidate SHA.

## Required order

1. RG-01 Dependency Safety
2. RG-02 Authentication + Tenant Isolation
3. RG-03 Managed Signing-Key Custody
4. RG-04 Demo/Auth-Fallback Elimination
5. DR qualification
6. New frozen SHA
7. Same-SHA full rerun

## Current stop

RG-01 remains the active gate. The successful candidate build artifact contains a package lock that was not committed in the frozen source tree. The branch workflow verifies the artifact package hash and lockfile hash before importing that exact lockfile. Dependency audit, tests and production build must then pass before RG-02 work is eligible to begin.

No later gate may be declared PASS merely because its design or test specification exists.
