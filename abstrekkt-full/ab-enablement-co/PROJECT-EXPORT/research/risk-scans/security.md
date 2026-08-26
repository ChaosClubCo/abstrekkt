# Security Risk Scan

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._

    ## Risks

### R-006 — RLS misconfiguration exposes tenant data
Likelihood: Medium. Impact: Critical. Mitigation: RLS-first schema and access tests.. Owner: Security Owner. Artifact: `database/schema.sql`.

### R-012 — Security incidents from unauthenticated endpoints
Likelihood: Medium. Impact: Critical. Mitigation: No unauthenticated mutation/execution endpoints; threat model.. Owner: Security Owner. Artifact: `security/threat-model.md`.

### R-025 — Security risk: insufficient maturity controls for stage 5
Likelihood: Medium. Impact: Medium. Mitigation: Use generated security artifact controls, review cadence, and owner accountability.. Owner: Security Owner. Artifact: `research/risk-scans/security.md`.

### R-035 — Security risk: insufficient maturity controls for stage 15
Likelihood: Medium. Impact: Medium. Mitigation: Use generated security artifact controls, review cadence, and owner accountability.. Owner: Security Owner. Artifact: `research/risk-scans/security.md`.

### R-045 — Security risk: insufficient maturity controls for stage 25
Likelihood: Medium. Impact: Medium. Mitigation: Use generated security artifact controls, review cadence, and owner accountability.. Owner: Security Owner. Artifact: `research/risk-scans/security.md`.
