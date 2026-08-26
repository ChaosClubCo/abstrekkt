# Security Policy

- Do not log or place secret values in prompts. Environment detection reads only names from example/template files.
- Read-only commands are blocked from writes by policy.
- Push, PR, merge, deployment, production data, permissions, secret rotation, billing, and external messages require explicit approval.
- Protected-branch direct pushes are blocked.
- Broad changes exceed default blast-radius thresholds and require approval.
- Self-healing is bounded to three materially different attempts and must roll back failed partial state.
