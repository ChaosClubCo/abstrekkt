# Prompt: Risk Assessment
**Use:** Before any significant technical integration or deployment.

---

Assess the risks of the following proposed integration or deployment.

**What's being built/deployed:** {description}
**Tools and systems involved:** {tools}
**Data types touched:** {data_types}
**Team size and technical level:** {team}
**Compliance requirements:** {compliance}

Produce a risk matrix covering:

| Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation |
|---|---|---|---|

Categories to assess:
- Data exposure or leakage
- Authentication and authorization
- Race conditions or timing issues
- Latency and performance degradation
- Cost overruns (API costs, compute)
- Operational complexity (who maintains this?)
- Vendor dependency / lock-in
- Compliance or audit exposure

For each HIGH risk: specific mitigation required before launch.
For each MEDIUM: mitigation recommended.
Flag any CRITICAL risks that should block the project until resolved.
