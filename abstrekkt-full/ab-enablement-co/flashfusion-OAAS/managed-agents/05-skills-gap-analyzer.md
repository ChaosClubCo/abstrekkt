# Prompt: Skills Gap Analyzer
**Use:** During audit or post-discovery. Input: client use case + current AI stack.

---

Analyze this client's AI skill gaps.

**Company:** {company}
**Team size:** {team_size}
**Current AI tools:** {current_tools}
**Primary use case:** {use_case}
**Biggest stated frustration:** {frustration}

FlashFusion's skill library includes these categories:
- Content and communications (social posts, multi-format content, newsletters)
- Automation (workflow, agent orchestration, task decomposition)
- Engineering (code audit, frontend, debugging, shell scripts)
- Sales (ROI calculation, solution architecture)
- Delivery (KB articles, sprint planning, client comms)
- Platform (skill development, packaging)

Produce:
1. Top 5 recommended skill packs with 1-sentence justification each
2. The skill gap causing the most pain right now (be specific)
3. The skill that would show the fastest ROI (and why)
4. Any gaps the client hasn't mentioned that the data suggests

No boilerplate. Trace every recommendation to a specific signal from their inputs.
