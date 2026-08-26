# Template 5: Security Review + Threat Model (OWASP-Style)

## COPY/PASTE INPUT BLOCK

```
GOAL:
Perform a security review and create a threat model for the described app/feature, then output concrete mitigations and verification tests.

CONTEXT:
- Web app with auth + APIs + data persistence
- Goal: reduce real-world risk, not academic checklists

CONSTRAINTS:
- Prioritize practical, implementable controls
- Include abuse cases, privilege boundaries, and logging requirements
- No penetration instructions; only defensive guidance

INPUTS:
[Paste: architecture notes, endpoints, auth flow, and data classification]

OUTPUT NEEDS:
- Markdown
- Sections: Assets; Trust boundaries; Threats; Controls; Logging/Monitoring; Secure defaults; Test plan; Rollout; CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=SelfCriticism
- Framework=TRACE
- OutputFormat=Markdown
```

## USAGE NOTES

- Paste your architecture diagram, auth flow, and API endpoints
- SelfCriticism produces initial threat model → critiques it → improves
- TRACE (Task, Request, Audience, Context, Example) structures security analysis
- Output focuses on practical defenses, not penetration techniques
