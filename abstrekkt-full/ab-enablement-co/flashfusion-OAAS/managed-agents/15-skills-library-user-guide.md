# FlashFusion Skills Library — User Guide

**Version:** May 2026

---

## What Skills Are

Claude skills (also called skill packs) are pre-configured instruction sets that tell Claude how to behave for a specific task. Instead of writing a custom prompt every time, skills let you trigger expert-level behavior with a short phrase.

Example: Type "generating-social-posts" and Claude knows to produce LinkedIn/X/Threads content in the right voice, with hook variants, without any additional instructions.

---

## How to Activate a Skill

**In Claude.ai:**
1. Start a new conversation
2. Type the skill's trigger phrase (e.g., "generating-social-posts")
3. Add your task context

The skill activates automatically when it detects its trigger phrases in the conversation.

**Trigger phrase examples:**
- "generating-social-posts: write a LinkedIn post about AI governance"
- "workflow-automation: help me automate my CRM to Notion sync"
- "applying-adversarial-review: pressure-test this proposal"

---

## The 25 Skills

### Content (3 skills)
- **generating-social-posts** — LinkedIn/X/Threads/Blog/Audio posts with hook A/B/C variants
- **drafting-multi-format-content** — 48 templates: scripts, threads, carousels, lifecycle emails
- **producing-ai-newsletter** — Full newsletter production: research to delivery

### Automation (3 skills)
- **workflow-automation** — n8n, Zapier, Make workflows
- **orchestrating-ai-agents** — Multi-agent systems with MCP, LangChain, CrewAI
- **task-decomposition** — Complex requests into parallel workstreams

### Engineering (6 skills)
- **code-auditor** — Architecture, security, performance analysis
- **frontend-design** — Production UI with design brief gate
- **applying-sparc-methodology** — Structured development methodology
- **engineering-staff-workflows** — Security-first staff engineer workflow
- **debug-like-expert** — Systematic root cause analysis
- **writing-shell-scripts** — MSP-grade Bash/PS1 with audit gate

### Sales (2 skills)
- **roi-calculator-building** — B2B ROI models with payback period and executive narrative
- **ai-solution-architecture** — Pre-sales technical architectures

### Documentation (1 skill)
- **generating-kb-articles** — .docx KB articles, SOPs, runbooks

### Analysis (1 skill)
- **applying-adversarial-review** — Claims sourced/generated, agreement streak detection

### Design (2 skills)
- **managing-design-briefs** — Anti-slop gates, locked design tokens
- **elite-ui-design** — Full product design orchestration

### Platform (2 skills)
- **developing-skills** — Creating Claude skills per March 2026 spec
- **packaging-skills** — Production zip files for distribution

---

## Tips for Best Results

1. **Be specific in your task context.** Skills set the behavior; you still need to provide the task.
2. **Use the skill name as a prefix.** "workflow-automation: [task]" is clearer than hoping the skill activates from context.
3. **Check the SKILL.md for each skill's "Use when..." trigger.** Skills activate on specific phrases — if one isn't firing, check the trigger documentation.
4. **Don't stack multiple skills in one prompt.** Use one skill per task for cleanest results.

---

*Questions or issues: kyle@flashfusion.co*
