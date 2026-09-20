# Prompt: Agent Design
**Use:** When designing a new automation or agent workflow. Input: workflow description.

---

Design an AI agent for the following workflow.

**Trigger:** {trigger}
**Goal:** {goal}
**Tools available:** {tools}
**Team technical level:** {tech_level}
**Compliance constraints:** {compliance}

Produce an agent spec:

**Trigger definition:** Exact condition that fires the agent
**Input schema:** What data the agent needs at start
**Steps:** Numbered sequence of actions (tool calls, Claude reasoning steps, data transforms)
**Output:** What the agent produces and where it goes
**Human-in-the-loop gates:** Where human review is required before the agent proceeds
**Guardrails:** What the agent must never do
**Failure modes:** Top 3 ways this agent could fail and how to handle each
**Estimated build time:** In n8n, from scratch, for a competent builder

Be concrete. Name the specific n8n nodes or API calls where known.
