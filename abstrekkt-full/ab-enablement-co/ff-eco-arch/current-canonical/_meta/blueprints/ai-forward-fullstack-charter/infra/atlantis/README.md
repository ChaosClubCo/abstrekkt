# Approval Gate — Atlantis (Terraform)

Human approval gate for all infrastructure changes (Zone 2). Agents may *propose*
Terraform; only a human `atlantis apply` lands it.

## Flow
1. Agent/PR changes `infra/*.tf`.
2. Atlantis auto-runs `terraform plan` and posts the plan to the PR.
3. A human reviews the plan and comments `atlantis apply` to execute.
4. No apply happens without that explicit human comment.

## atlantis.yaml (sketch)
```yaml
version: 3
projects:
  - dir: infra
    autoplan:
      when_modified: ["*.tf", "../modules/**/*.tf"]
      enabled: true
    apply_requirements: [approved, mergeable]
```

## Rules
- `apply_requirements: [approved]` — PR must be human-approved before apply.
- Plan output is logged to observability with actor + zone.
- Forbidden (Zone 3) resources (billing, prod data stores) require a second approver.
