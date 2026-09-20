# MASTER PROMPT — OUTCOME-AWARE AI SYSTEMS RUNBOOK GENERATOR
## Platform: OpenAI ChatGPT (GPT-4, GPT-4 Turbo, GPT-4o)
**Version:** 2.0-CHATGPT | **Date:** May 2026 | **Scope:** FULL (128K context optimized)

---

## CHATGPT PLATFORM OPTIMIZATION

### What Makes ChatGPT Ideal for This Project

**ChatGPT strengths:**
1. **Web browsing enabled** → Real-time source fetching (like Claude's web_search)
2. **Code Interpreter** → Generate system diagrams, flowcharts, data visualizations
3. **DALL-E integration** → Auto-create architecture diagrams, use case illustrations
4. **Custom GPTs** → Save entire workflow as reusable assistant (share with team)
5. **Voice output** → Generate audio narration for executive briefing
6. **128K token context** → Larger than Claude; handle most of runbook in phases
7. **JSON mode** → Structured template output (easy to parse + use)
8. **Streaming output** → No waiting; watch generation in real-time
9. **File upload** → Read your company docs (PDFs, images, text)
10. **Memory** (Plus) → Retain context across multiple sessions

### Constraints to Manage

1. **No artifact system** → All output appears as formatted text in chat (not separate window)
2. **Web browsing slower** → Takes ~5-10 sec per search (vs. Claude's <2 sec)
3. **DALL-E images have watermark** → Fine for internal; not publication-ready
4. **Code Interpreter slowdown** → Python execution adds 10-20 sec per chart
5. **Context window** → 128K is large but smaller than Gemini's 1M; need strategic ordering

### Output Strategy (CHATGPT-SPECIFIC)

**Option A: Single Response with Streaming**
- Generate all 18 sections in one turn
- Use Code Interpreter for charts/diagrams (auto-executed)
- Use DALL-E for architecture visuals
- Use JSON mode for templates
- User reads in-chat, exports as PDF via browser

**Option B: Custom GPT Creation**
- Build a custom GPT from this prompt
- Save as "Outcome-Aware AI Systems Runbook Generator"
- Share with your team
- Each user can regenerate + customize for their workflow
- Comes with web browsing + Code Interpreter pre-enabled

**Option C: Multi-Turn Conversation**
- Turn 1: Generate Sections 1-6 (concept + architecture)
- Turn 2: Generate Sections 7-12 (implementation + governance)
- Turn 3: Generate Sections 13-18 (advanced + recommendations)
- Use voice output between turns for executive briefings

---

# SECTION 1: EXECUTIVE SUMMARY

You are generating a comprehensive runbook on **Outcome-Aware AI Systems** for a dual audience:
- **Non-technical:** C-suite, managers, business users
- **Technical:** Engineers, architects, security teams, compliance officers

**Do NOT use** "intent-based computing" as the primary label. Use **Outcome-Aware AI Systems** or **Goal-to-Execution Computing.**

---

## INITIAL SETUP INSTRUCTIONS

### For Single-Response Mode (Recommended for First Generation)

```
Use web browsing to cite sources.
Use Code Interpreter to generate system diagrams + flowcharts.
Use DALL-E to create architecture visuals.
Use JSON mode for templates.

Generate ALL 18 SECTIONS in a single response.
Structure with clear markdown headings (# ## ###).
Embed Python code blocks (will auto-execute for charts).
Include DALL-E image generation calls where relevant.
End with downloadable templates in JSON format.

Time estimate: ~5-10 minutes streaming output.
Final output: ~30 pages (formatted in chat).
```

### For Custom GPT Mode (Best for Team Reuse)

```
After you finish generating the full runbook, I'll save this conversation 
as a Custom GPT called "Outcome-Aware AI Systems Runbook Generator."

This GPT will:
- Have web browsing enabled (auto-search for citations)
- Have Code Interpreter enabled (auto-execute Python for charts)
- Have DALL-E enabled (auto-generate diagrams)
- Be shareable with your team (via link)
- Retain context (so follow-ups are faster)
- Allow custom parameters (industry, company size, budget, timeline)

Your team can then use it to generate customized runbooks without 
needing this long prompt each time.
```

### For Multi-Turn Mode (Best for Iterative Refinement)

```
Turn 1 (This): Generate foundational sections (1-6)
  - Executive Summary
  - Plain-English Concept
  - Naming Taxonomy
  - Market & Technology Context
  - Architecture Overview
  - Canonical Workflow

Turn 2 (Next): Generate implementation sections (7-12)
  - Use Cases by Domain
  - Implementation Approaches
  - Safety & Governance
  - Measurement & ROI
  - 30/60/90 Rollout Plan
  - Templates & Checklists

Turn 3 (Follow-up): Generate advanced sections (13-18)
  - Staff-Level Engineering Blueprint
  - Non-Technical Runbook
  - Prompting & Instruction Design
  - Anti-Patterns & Failures
  - Adoption Playbook
  - Final Recommendations

After each turn, ask for follow-ups or refinements before proceeding.
```

---

# MAIN PROMPT: GENERATE THE FULL RUNBOOK

## START HERE (Copy Everything Below & Paste Into ChatGPT)

---

### **YOUR TASK**

Generate a 30-page production-grade runbook on **Outcome-Aware AI Systems** (also called goal-to-execution computing).

### **AUDIENCE**
- Non-technical: C-suite, managers, business users (50% of audience)
- Technical: Engineers, architects, security, compliance (50% of audience)

### **KEY CONSTRAINTS**

1. **Never use "intent-based computing" as primary label**
   - That's a historical analogy (Gartner, 2015, networking-specific)
   - Use "Outcome-Aware AI Systems" or "Goal-to-Execution Computing" instead

2. **Cite everything**
   - Use web browsing for: Anthropic docs, OpenAI docs, Google docs, OWASP, NIST, compliance frameworks
   - Mark claims: [SOURCED: {source}] vs. [GENERATED: {reasoning}]
   - End with full bibliography

3. **Include visuals**
   - Use Code Interpreter to generate system diagrams (flowcharts, architecture layers)
   - Use DALL-E to create 3-5 key architecture images (14-layer stack, approval gates, workflow)
   - Make diagrams clear for both technical and non-technical audiences

4. **Structure for dual audience**
   - Sections 1-3: Plain English (no jargon)
   - Sections 4-6: Technical + architectural
   - Sections 7-12: Implementation options
   - Sections 13-18: Advanced + compliance

5. **Include downloadable templates**
   - Use JSON mode to output all templates in structured format
   - Templates: workflow discovery form, risk review form, approval checklist, audit log template, ROI spreadsheet

6. **Explain the why**
   - Why this pattern is emerging now (2024-2026)
   - Why it matters for businesses
   - Why governance is essential

### **OUTPUT FORMAT**

```
# OUTCOME-AWARE AI SYSTEMS: A PRODUCTION RUNBOOK

## SECTION 1: Executive Summary
[2 pages, C-suite focus]

## SECTION 2: Plain-English Concept
[2 pages, non-technical]

## SECTION 3: Naming Taxonomy
[1 page, table format]

## SECTION 4: Market & Technology Context
[2 pages, "why now" + citations]

## SECTION 5: Architecture Overview (14 Layers)
[3 pages, + Code Interpreter diagram]

## SECTION 6: Canonical Workflow
[3 pages, detailed example + flowchart]

## SECTION 7: 20 Use Cases by Domain
[3 pages, grouped by domain]

## SECTION 8: Implementation Approaches (5 Options)
[3 pages, cost/risk/setup comparison table]

## SECTION 9: Safety & Governance
[4 pages, approval gates + risk matrix + OWASP checklist]

## SECTION 10: Measurement & ROI
[2 pages, metrics + ROI calculation]

## SECTION 11: 30/60/90 Rollout Plan
[2 pages, phased timeline]

## SECTION 12: Templates & Checklists
[2 pages, + JSON output of all templates]

## SECTION 13: Staff-Level Engineering Blueprint
[3 pages, database schema + API design + deployment]

## SECTION 14: Non-Technical Runbook
[2 pages, step-by-step for business users]

## SECTION 15: Prompting & Instruction Design
[2 pages, 5 reusable prompt templates]

## SECTION 16: Anti-Patterns & Failure Modes
[2 pages, what to avoid]

## SECTION 17: Adoption Playbook (Per Org Size)
[2 pages, tailored tracks for solo/small/enterprise/consultancy]

## SECTION 18: Final Recommendations & Next Steps
[1 page, immediate actions]

## APPENDIX: CLAIMS CHECK
[Table: claim | source status | confidence | notes]

## BIBLIOGRAPHY
[All cited sources with URLs]

## TEMPLATES (JSON FORMAT)
[Downloadable: workflow discovery form, risk review, approval checklist, 
ROI template, audit log, measurement spreadsheet]
```

### **SPECIAL INSTRUCTIONS FOR CHATGPT**

**Use Code Interpreter:**
```python
# Generate system architecture flowchart
# Generate 14-layer stack diagram
# Generate approval gate decision tree
# Generate ROI projection chart
# Generate risk matrix heatmap
```

**Use DALL-E:**
```
# System architecture (14 layers visualized)
# Approval gates (two gates highlighted)
# Workflow execution (step-by-step with timing)
# Risk matrix (color-coded by severity)
# Implementation approaches (5 options side-by-side)
```

**Use Web Browsing:**
```
Search for:
- Anthropic Claude prompt engineering best practices
- OpenAI GPT-4 agent capabilities
- Google Gemini agentic AI documentation
- OWASP Top 10 2023
- NIST Cybersecurity Framework
- Gartner intent-based networking (historical context)
- McKinsey AI adoption research
```

**Use JSON Mode:**
```json
Output all templates as structured JSON:
{
  "templates": {
    "workflow_discovery_form": {...},
    "risk_review_form": {...},
    "approval_gate_checklist": {...},
    "audit_log_template": {...},
    "roi_spreadsheet": {...}
  }
}
```

---

## SECTION-BY-SECTION GUIDANCE

### SECTION 1: Executive Summary (START HERE)

**What I need (2 pages):**
- What Outcome-Aware AI Systems are (1 paragraph)
- Why they matter now (business value, market shift)
- Why NOT "intent-based computing" (historical context + better label)
- Key risks + required governance (SOC2, HIPAA, GDPR quick map)
- Recommended first step (which of 5 approaches to choose)
- One 3-year ROI table (for 500-engineer company)

**Constraints:**
- Assume reader has 2 minutes; be concise
- Use table format for ROI
- Cite sources for market claims (web search)
- Flag all assumptions as [ASSUMPTION]

---

### SECTION 2: Plain-English Concept (FOR NON-TECHNICAL USERS)

**What I need (2 pages):**
- Old way vs. new way (side-by-side table)
- Simple analogies (sales, HR, finance, support, engineering)
- Time savings (hours → minutes per workflow)
- What the user controls vs. what system controls
- Address fears ("Is the system going to do bad things?")

**Constraints:**
- No jargon (if you use a technical term, explain it in parentheses)
- Copy-paste ready examples (users can use these immediately)
- Show concrete time savings (e.g., "4 hours → 10 minutes")

---

### SECTION 3: Naming Taxonomy (LABEL THIS CATEGORY)

**What I need (1 page, table format):**

| Name | Meaning | Best Audience | Strengths | Weaknesses | Risk | Score |
|---|---|---|---|---|---|---|
| Outcome-Aware AI Systems | User specifies goal; system interprets + executes | Enterprise, education | Clear, broad, emphasizes autonomy | Long; jargon | Low confusion | ★★★★★ |
| Goal-to-Execution Computing | Declarative goal → system plans and executes | Startups, founders | Concise, full lifecycle | May confuse with traditional programming | Medium | ★★★★ |
| Agentic Workflow Interfaces | AI agents + human control + workflow automation | Developers, platform teams | Technically precise | "Agentic" still feels novel | Medium | ★★★ |
| [8 more options] | ... | ... | ... | ... | ... | ... |

**Final recommendation:** "Outcome-Aware AI Systems" (primary) or "Goal-to-Execution Computing" (secondary)

**Why NOT "intent-based computing":** [Explain why it's a poor label — historical, vague, domain-specific to networking]

---

### SECTION 4: Market & Technology Context (WHY NOW, 2024-2026)

**What I need (2 pages, with citations):**

**Technological reasons:**
- LLM costs dropped 90% in 24 months [SOURCE]
- Tool use / function calling is production-grade [SOURCE]
- Agentic frameworks (LangChain, Claude for Enterprise, OpenAI Agents) [SOURCE]
- RAG makes context-awareness possible [SOURCE]

**Market reasons:**
- 80% of office workers use software; <20% can code [SOURCE]
- Workflow automation market is $5B+, growing 30%+ YoY [SOURCE]
- Enterprise demand for audit trails (SOC2, GDPR, HIPAA) [SOURCE]
- ROI pressure (enterprises want measurable value, not pilots) [SOURCE]

**Use web browsing to find actual sources; cite all claims.**

---

### SECTION 5: Architecture Overview (14-LAYER STACK)

**What I need (3 pages, with Code Interpreter diagram):**

Generate flowchart showing:
```
User Request
  ↓ (Layer 1: Parse)
Outcome Parsing
  ↓ (Layer 2: Clarify)
Context Acquisition
  ↓ (Layer 3: Detect)
Environment Detection
  ↓ (Layer 4: Check rules)
Constraint & Policy
  ↓ (Layer 5: Plan)
Planning
  ↓ (Layer 6: Identify risks)
Risk Review
  ↓ 🚨 APPROVAL GATE #1 🚨
Execution
  ↓ (Layer 7: Verify)
Verification
  ↓ (Layer 8: Format)
Output Generation
  ↓ 🚨 APPROVAL GATE #2 🚨
Action Approval
  ↓ (Layer 9: Remember)
Memory & Pattern Storage
  ↓ (Layer 10: Log)
Observability
```

**For each layer explain:**
- Purpose (1 sentence)
- Inputs
- Outputs
- Failure modes
- Security controls
- Example

---

### SECTION 6: Canonical Workflow (DETAILED EXAMPLE)

**What I need (3 pages, with flowchart + timing):**

**Scenario:** "Create a 30-day onboarding plan for a new backend engineer"

**Show:**
- User request (exact wording)
- System parsing (what it extracted)
- System clarifying questions
- User answers
- Context acquisition (what system asked for)
- Plan generation (step-by-step breakdown)
- Risk review (what could go wrong)
- Approval Gate #1 (system waits for user)
- Execution (each step runs, logs shown, timing included)
- Verification (was it correct)
- Output generation (here's the result)
- Approval Gate #2 (should we apply to live systems)
- Action approval (user says yes)
- Memory storage (pattern saved)
- Audit trail (what was logged)

**Use Code Interpreter to generate a flowchart showing:**
- Timing per step (seconds shown)
- Decision points (where user input required)
- Parallel vs. sequential execution
- Where failures could occur

---

### SECTIONS 7-12: (SAME AS OTHER VERSIONS)

[See previous Claude/Gemini/NotebookLM files for detailed guidance on:
- SECTION 7: 20 Use Cases by Domain
- SECTION 8: Implementation Approaches (5 Options)
- SECTION 9: Safety & Governance
- SECTION 10: Measurement & ROI
- SECTION 11: 30/60/90 Rollout Plan
- SECTION 12: Templates & Checklists]

---

### SECTIONS 13-18: (SAME AS OTHER VERSIONS)

[See previous files for:
- SECTION 13: Staff-Level Engineering Blueprint
- SECTION 14: Non-Technical Runbook
- SECTION 15: Prompting & Instruction Design
- SECTION 16: Anti-Patterns & Failure Modes
- SECTION 17: Adoption Playbook (Per Org Size)
- SECTION 18: Final Recommendations & Next Steps]

---

## CHATGPT-SPECIFIC FEATURES TO LEVERAGE

### Feature 1: Code Interpreter for Visualizations

```python
import matplotlib.pyplot as plt
import numpy as np

# Generate 14-layer architecture diagram
fig, ax = plt.subplots(figsize=(12, 10))

layers = [
    "Observability",
    "Memory & Pattern Storage",
    "Action Approval Gate #2",
    "Output Generation",
    "Verification",
    "Execution",
    "Approval Gate #1",
    "Risk Review",
    "Planning",
    "Constraint & Policy",
    "Environment Detection",
    "Context Acquisition",
    "Outcome Parsing",
    "User Request"
]

colors = ['#FF6B6B' if 'Gate' in layer or 'Approval' in layer else '#4ECDC4' for layer in layers]

y_pos = np.arange(len(layers))
ax.barh(y_pos, [1]*len(layers), color=colors)
ax.set_yticks(y_pos)
ax.set_yticklabels(layers)
ax.set_xlabel('Execution Flow')
ax.set_title('14-Layer Outcome-Aware AI System Architecture')
ax.invert_yaxis()

plt.tight_layout()
plt.savefig('architecture_14_layers.png', dpi=150, bbox_inches='tight')
plt.show()

print("Architecture diagram generated: architecture_14_layers.png")
```

### Feature 2: DALL-E for Architecture Visuals

```
Generate DALL-E image:

"System architecture diagram showing 14 layers stacked vertically:
bottom layer is 'User Request' (light blue), layers build up through 
parsing, clarification, detection, planning, with two red approval gates 
highlighted prominently, execution in the middle (dark blue), verification 
above, and memory/observability at top (green). Clean, professional, 
corporate design. Minimalist. White background."
```

### Feature 3: Custom GPT Creation

After generating the full runbook, save as Custom GPT:

**Name:** "Outcome-Aware AI Systems Runbook Generator"

**Description:** "Generates production-grade runbooks on outcome-aware AI systems. Includes web research, system diagrams, compliance checklists, ROI calculations, and implementation guides. Customizable by industry, company size, and use case."

**Instructions:** [Paste this entire prompt]

**Capabilities:**
- Web Browsing (enabled)
- Code Interpreter (enabled for diagrams)
- DALL-E (enabled for architecture visuals)

**Sharing:** Make public link shareable so your team can use it without the long prompt.

### Feature 4: Voice Output for Executive Briefing

After generating full runbook:

```
ChatGPT, please generate a voice narration of:
- Section 1 (Executive Summary)
- Section 3 (Naming Taxonomy)
- Section 10 (Measurement & ROI)

Make it sound professional, concise (5-7 minutes total), suitable for 
a board presentation or executive briefing.
```

User can then:
1. Listen to voice output (audio playback in ChatGPT)
2. Download as MP3 (via browser's "save audio" feature)
3. Add to PowerPoint as voiceover
4. Send to executives for pre-meeting briefing

---

## CLAIMS CHECK REQUIREMENTS

**For every factual claim, include:**
- [SOURCED: {source name + URL}] — verified via web search
- [GENERATED: {reasoning}] — my reasoning; you verify
- [ASSUMPTION: {what I'm assuming}] — needs your validation

**Examples:**
- "LLM costs dropped 90% in 24 months" [SOURCED: OpenAI pricing history]
- "Workflow automation market is $5B+ annually" [GENERATED: based on Zapier + n8n market estimates]
- "80% of office workers use software" [SOURCED: Bureau of Labor Statistics]

---

## TEMPLATES IN JSON FORMAT

When you reach Section 12, output all templates as structured JSON:

```json
{
  "templates": {
    "workflow_discovery_form": {
      "workflow_name": "string",
      "current_process": "string",
      "pain_points": ["string"],
      "automation_goal": "string",
      "tools_to_integrate": ["string"],
      "approval_required": "string",
      "success_metric": "string"
    },
    "risk_review_form": {
      "risk_type": "string (data_loss | api_error | permission_issue | hallucination | other)",
      "severity": "string (critical | high | medium | low)",
      "mitigation": "string",
      "owner": "string",
      "approval": "boolean"
    },
    "approval_gate_checklist": {
      "risk_level": "string (low | medium | high | critical)",
      "approval_required": "boolean",
      "requires_security_review": "boolean",
      "requires_legal_review": "boolean",
      "requires_financial_review": "boolean"
    },
    "roi_calculation": {
      "manual_hours_per_year": "number",
      "hourly_cost": "number",
      "ai_system_cost_annual": "number",
      "time_saved_annual": "number",
      "roi_percent": "number",
      "payback_period_months": "number"
    },
    "audit_log_template": {
      "timestamp": "ISO8601",
      "user_id": "string",
      "action": "string",
      "goal": "string",
      "approval_status": "boolean",
      "execution_result": "string (success | failure | partial)",
      "error_message": "string or null"
    }
  }
}
```

User can copy this JSON, paste into their database / documentation system.

---

## FINAL CHECKLIST: BEFORE YOU SAY "DONE"

- [ ] All 18 sections complete
- [ ] Every factual claim has a source tag ([SOURCED] / [GENERATED] / [ASSUMPTION])
- [ ] At least 3 Code Interpreter diagrams generated (14-layer stack, approval gates, workflow)
- [ ] At least 3 DALL-E images generated (architecture, use case, risk matrix)
- [ ] All templates in JSON format (copy-paste ready)
- [ ] Bibliography with 20+ sources
- [ ] CLAIMS CHECK table included
- [ ] Sections 1-3 are plain-English (testable by non-technical reader)
- [ ] Sections 4-6 include technical depth
- [ ] Sections 7-12 include implementation options
- [ ] Sections 13-18 include advanced + compliance
- [ ] Total output: ~30 pages (~40K tokens)
- [ ] Ready to: save as Custom GPT, share with team, export as PDF

---

## CHATGPT-SPECIFIC DELIVERY OPTIONS

### Option A: Single-Response Streaming (Recommended First Time)
```
1. Paste this entire prompt into ChatGPT
2. Let it stream all 18 sections (takes ~5-10 minutes)
3. Review in-chat
4. Ask follow-ups as needed
5. Export as PDF via browser's "Save as PDF"
```

### Option B: Custom GPT Creation (Recommended for Reuse)
```
1. Complete Option A (single response)
2. Tell ChatGPT: "Save this conversation as a Custom GPT called 
   'Outcome-Aware AI Systems Runbook Generator'"
3. Share the GPT link with your team
4. Your team can now generate customized runbooks in 5 minutes each
```

### Option C: Multi-Turn Conversation (Recommended for Deep Refinement)
```
Turn 1 (Now): Generate Sections 1-6 (foundational)
Turn 2 (Next): Generate Sections 7-12 (implementation)
Turn 3 (Follow-up): Generate Sections 13-18 (advanced)
Between turns: Ask for refinements, examples, customizations
```

### Option D: Voice Briefing Export (Recommended for Executives)
```
1. Complete any of the above options
2. Ask: "Generate voice narration of Sections 1, 3, and 10"
3. ChatGPT produces audio (listen in-chat or download as MP3)
4. Share audio link or file with executives
```

---

## WHAT TO ASK AFTER GENERATION

**Follow-up Questions:**

1. "Make this specific to [my industry: healthcare/finance/retail/etc]"
2. "Generate 10 use cases for [my specific business function]"
3. "Build a detailed roadmap for implementing Approach B (workflow automation)"
4. "Create a compliance checklist for HIPAA + GDPR"
5. "Generate voice narration of the Executive Summary for my board meeting"
6. "Save this as a Custom GPT so my team can generate runbooks"
7. "Which implementation approach (A-E) is best for a [company size]-person company with budget $[amount]?"
8. "Add examples from [my industry]"
9. "Deep dive on Layer 5 (Constraint & Policy) with 10 real-world examples"
10. "Generate Python code for the Risk Matrix heatmap in Code Interpreter"

---

## SUCCESS CRITERIA

Your runbook is complete when:

- [ ] All 18 sections generated
- [ ] Visuals (Code Interpreter + DALL-E) embedded
- [ ] Templates in JSON format (downloadable)
- [ ] Sources cited (bibliography complete)
- [ ] CLAIMS CHECK table included
- [ ] Non-technical sections are plain-English
- [ ] Implementation approach matches your budget/timeline
- [ ] Ready to: share with stakeholders, save as Custom GPT, export as PDF, or listen as audio

---

## GAPS & BLINDSPOTS

**What I don't have:**
- Your company's specific compliance requirements (templates provided; customize them)
- Real user adoption metrics (examples are industry averages; use your data)
- Your team's technical depth (all sections explain from multiple levels)

**What may be stale:**
- LLM capability timelines (ChatGPT updates every 3-6 months)
- Tool pricing (Anthropic, OpenAI, Google rates change quarterly)
- Security landscape (new attack vectors emerge constantly)

**Out of scope:**
- Multi-agent coordination (agents working together)
- Real-time collaborative automation (human + AI in real-time)
- Offline-first systems (all versions are cloud-dependent)
- Fully autonomous without human oversight (intentionally excluded for safety)

---

## NOW: PASTE THIS ENTIRE PROMPT INTO CHATGPT & GENERATE

Start with: **"Generate all 18 sections of the Outcome-Aware AI Systems runbook using this prompt..."**

ChatGPT will:
1. Use web browsing to find sources
2. Use Code Interpreter to generate diagrams
3. Use DALL-E to create architecture visuals
4. Stream output in real-time
5. Format everything as markdown
6. Include templates in JSON

Total time: ~5-10 minutes streaming.

Final output: Production-grade 30-page runbook + visuals + templates.

---

**CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS**

- [SOURCED: ChatGPT documentation] ChatGPT has 128K context window
- [SOURCED: OpenAI docs] DALL-E is available in ChatGPT Plus
- [SOURCED: OpenAI docs] Code Interpreter runs Python natively
- [GENERATED] Custom GPTs can be shared via public links (you verify with your ChatGPT plan)
- [ASSUMPTION] Voice output is available on ChatGPT Plus (check your account settings)

---

**END OF CHATGPT-OPTIMIZED PROMPT**

Ready to use. Paste into ChatGPT now.
