# Agent Permission Model

## Permission Levels

### Level 0 — No Access

Agent cannot read or act.

### Level 1 — Read Public

Agent can read public or shared context only.

### Level 2 — Read Scoped

Agent can read tenant-scoped context.

### Level 3 — Analyze

Agent can reason over scoped context and produce recommendations.

### Level 4 — Propose Mutations

Agent can propose changes but not apply them.

### Level 5 — Apply Low-Risk Mutations

Agent can apply reversible, tenant-scoped changes.

### Level 6 — Execute External Actions

Agent can trigger external workflows with approval.

### Level 7 — Admin Governance

Reserved for human-supervised governance changes.

## Approval Gates

Require approval for:

- destructive operations
- schema changes
- tenant boundary changes
- prompt constitution changes
- external communications
- production deployment
- secret-related operations
