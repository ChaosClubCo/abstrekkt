# Prompt: Integration Mapping
**Use:** When connecting two or more systems. Input: systems + desired outcome.

---

Map the integration between these systems.

**System A:** {system_a}
**System B:** {system_b}
**Additional systems:** {other_systems}
**Desired outcome:** {outcome}
**Data that needs to flow:** {data}
**Team technical level:** {tech_level}

Produce:

1. **Integration Options** (3 approaches ranked by effort/reliability tradeoff)
2. **Data Flow Diagram** (text-based — show the path data takes through each system)
3. **API/Webhook Requirements** (what endpoints, auth methods, and data formats are needed)
4. **Recommended Approach** (which option and why — one paragraph)
5. **Implementation Path** (5–8 steps from start to live)
6. **Estimated Complexity** (Low/Medium/High with justification)

Assume n8n as the orchestration layer unless another tool is more appropriate.
