# Architecture

The system deliberately separates vocabulary from execution.

1. **Command definitions** preserve the 200 user-facing intents and aliases.
2. **Capability primitives** implement reusable behavior and eliminate 200 independent execution engines.
3. **Environment detection** creates a redacted manifest before prompt compilation.
4. **Routing** matches required capabilities and abstract model profiles.
5. **Prompt compilation** assembles versioned global, safety, recovery, verification, primitive, and command fragments.
6. **Policy enforcement** exists outside prompts and controls side effects.
7. **Pipeline planning** validates DAGs and orders stages.
8. **Structured results** make evidence machine-readable.
9. **Evaluations** prevent production promotion without regression coverage and human approval.

Multi-agent autonomy is intentionally not implemented in v0.1.0. The current router selects capability and model profiles only; an executor can be added later without changing command semantics.
