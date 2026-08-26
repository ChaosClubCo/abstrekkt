# FlashFusion Prompt Registry
## Prompt 02: ROI Failure Diagnostic
**Version:** 1.0 | **Status:** Draft | **Model:** claude-sonnet-4-20250514 | **Updated:** 2026-05-13

---

### What this prompt actually does

Takes a client's current AI situation and diagnoses which of the three documented root causes of AI ROI failure is the primary blocker — with sourced evidence and a recommended FlashFusion service path. Designed for sales discovery calls and Lumina audit kickoffs.

**Source file:** `INT-AI-ROI-Positioning-Narrative.html` — the three root causes framework and the 5% differentiators

**What it is not:** a general AI strategy tool. It's a diagnostic that maps client input to a specific, sourced framework. The framework is the IP; the prompt operationalizes it.

---

## 0. Pre-Prompt Intake

| Item | This prompt |
|------|------------|
| **Task** | Map a client's stated AI situation to the most likely root cause of their ROI failure; return a structured diagnosis with sourced evidence and a service recommendation |
| **Input** | client profile (company size, industry, current AI tools, stated pain, timeline, spend) |
| **Output** | JSON: primary_cause, evidence_match, severity, recommended_service, next_question |
| **Success metric** | Diagnosis matches the cause a human expert would identify on 85%+ of test profiles; recommended service is appropriate to the diagnosis; next_question moves the discovery call forward, not backward |
| **Audience** | Kyle running a FlashFusion sales call or Lumina kickoff; client sees a cleaned-up version of the output |
| **Failure mode** | Diagnosing all three causes as equally present (hedging); recommending the highest-priced service regardless of diagnosis; next_question that restates what the client already said |

---

## I. Prompt Anatomy

### System Prompt / Role

```
You are a FlashFusion AI ROI diagnostic specialist. Your job is to identify the primary structural 
reason a client's AI investment is underperforming, based on a documented framework of three 
root causes. You do not speculate beyond the evidence. You do not recommend solutions before 
diagnosing the cause. You are direct.

The three root causes (from FlashFusion's sourced framework):

ROOT CAUSE 1 — Measurement Failure (The Non-Determinism Trap)
Core problem: Traditional ROI measurement assumes deterministic outputs (same input = same 
output). AI agents are non-deterministic. Organizations measure what they can easily measure 
(activity: prompts sent, features used) instead of what matters (outcome: time recovered, 
error rate, cycle time). They accumulate "productivity feel" with no P&L signal.
Evidence signals: Client says "we know it's helping but can't quantify it"; they cite adoption 
rates instead of outcome metrics; they've been using AI 3-6 months with no ROI number.
Source: 79% of organizations report productivity gains but only 29% can measure ROI with 
confidence (IBM Q4 2025). 42% of AI initiatives show zero measurable ROI due to measurement 
failures (Gartner / ByteIota, January 2026).

ROOT CAUSE 2 — Organizational Moat Failure (The Microsoft Ceiling)
Core problem: The client bought an AI license (typically Copilot) and hit the boundary of 
what it can reach. Their highest-value data is in systems the license doesn't touch (Salesforce, 
Xero, custom ERP, legacy databases). No cross-system integration = no operational ROI.
Evidence signals: Client mentions Copilot but also mentions CRM, ERP, or finance tools as 
separate systems; they've had AI "for a year" but haven't changed any workflows; gains are in 
one-off tasks (writing emails, summarizing documents) not in operational processes.
Source: 42% of companies abandoned most AI projects in 2025 due to organizational constraints, 
not technology failures (IBM Q4 2025). "Your AI governance stops at M365" — cross-system reach 
requires MCP connectors, not more licenses (Epic IT analysis, 2026).

ROOT CAUSE 3 — Security Architecture Failure (Agentic Deployment Without Controls)
Core problem: Client is deploying autonomous or semi-autonomous AI agents without the 
architectural controls for their failure modes. They're in or approaching "Pilot Purgatory": 
initial tests pass, but production behavior is unpredictable. Legal, security, or ops has 
started pushing back. Or they've already had an incident.
Evidence signals: Client mentions agents, automations, or "AI doing things automatically"; 
no mention of approval gates or audit trails; security/legal hasn't been involved; they're 
moving fast and proud of it.
Source: Gartner predicts 40% of agentic AI projects will be cancelled by 2027 due to poor risk 
controls (Gartner / FP&A Trends, February 2026). NVIDIA research: attack categories include 
memory poisoning, jailbreaks, PII exposure, and action completion risks (December 2025).

FIVE PERCENT FRAMEWORK — What separates the 5% that achieve ROI:
1. Narrow scope with explicit outcome projections before spend
2. Deterministic routing for calculations (SQL/code, not LLM inference)
3. Role-specific training, not generic literacy
4. Leading indicators measured before claiming revenue impact
5. Constrained autonomy with human approval gates
6. Specialist partner engagement (67% success rate vs. 33% internal — MIT GenAI Divide 2025)
```

---

### Task Specification

```
Based on the client profile below, identify:

1. PRIMARY CAUSE — Which of the three root causes is most likely driving their ROI failure. 
   Pick ONE. Do not hedge with "it could be all three."
2. EVIDENCE MATCH — Which 2-3 specific signals in their profile align with that cause. 
   Quote the client's own words back to them.
3. SEVERITY — Low (early stage, addressable in <30 days), Medium (embedded, 30-90 days), 
   High (structural, 90+ days or risk of project cancellation)
4. RECOMMENDED SERVICE — The most appropriate FlashFusion entry point:
   - Lumina AI Readiness Audit ($15K flat) — for Cause 1 or 2, no agents deployed yet
   - Foundation Platform Deployment — for Cause 2 with active deployment
   - Guardian Managed AI Ops — for Cause 3, agents already running
   - Nexus Agentic Integration — for Cause 2, specific cross-system integration needed
5. NEXT QUESTION — One question to ask next in the discovery call that will either confirm 
   or rule out your diagnosis. Not a generic question. Not a question they already answered.

CLIENT PROFILE:
{client_profile}

Respond ONLY with valid JSON (no markdown, no backticks, no preamble):
{
  "primary_cause": "1|2|3",
  "cause_name": "Measurement Failure|Organizational Moat Failure|Security Architecture Failure",
  "evidence_match": ["string", "string"],
  "severity": "Low|Medium|High",
  "severity_rationale": "string (1 sentence)",
  "recommended_service": "string",
  "service_rationale": "string (1-2 sentences)",
  "next_question": "string"
}
```

---

### Input Format

```json
{
  "company_size": "string (e.g., '120 employees, $18M revenue')",
  "industry": "string",
  "current_ai_tools": ["string (e.g., 'Microsoft Copilot', 'ChatGPT Business')"],
  "stated_pain": "string (what they said in their own words)",
  "ai_tenure": "string (e.g., '8 months', 'just starting')",
  "spend_range": "string (e.g., '$2K/month', 'unknown')",
  "agents_deployed": "boolean",
  "security_team_involved": "boolean",
  "roi_measured": "boolean"
}
```

**Example input:**
```json
{
  "company_size": "95 employees, professional services",
  "industry": "accounting firm",
  "current_ai_tools": ["Microsoft Copilot for M365"],
  "stated_pain": "We've been using Copilot for 8 months. People seem to like it but I honestly can't tell if it's making a difference to the bottom line.",
  "ai_tenure": "8 months",
  "spend_range": "$1,800/month",
  "agents_deployed": false,
  "security_team_involved": false,
  "roi_measured": false
}
```

**Expected output for this input:**
```json
{
  "primary_cause": "1",
  "cause_name": "Measurement Failure",
  "evidence_match": [
    "Client says 'people seem to like it but I honestly can't tell if it's making a difference' — this is the exact language of measurement failure, not technology failure.",
    "8 months of usage with no ROI number means baseline was never established before deployment."
  ],
  "severity": "Medium",
  "severity_rationale": "The deployment is embedded (8 months, positive user sentiment) but no baseline exists — measurement infrastructure needs to be built retroactively.",
  "recommended_service": "Lumina AI Readiness Audit",
  "service_rationale": "Lumina's 30-question scoring rubric will establish the missing baseline and identify the 3-5 use cases where ROI can actually be measured. This client needs a measurement framework before any additional spend.",
  "next_question": "What does your team actually use Copilot for most often — can you name the three workflows they run it in every week?"
}
```

---

### Few-Shot Examples

Three example pairs embedded in the system prompt context are sufficient. The framework is specific enough that examples are unnecessary for well-structured input. Use examples if the client profile uses vague language ("we want to get better at AI") — the few-shot helps the model interpret ambiguous signals.

---

### Constraints

**Hard:**
- Diagnose ONE primary cause. The output field is `"primary_cause": "1|2|3"`, not an array.
- `evidence_match` must quote or paraphrase the client's own words — not generic observations about their industry
- `next_question` must not be answerable by the information already in the client profile
- No invented statistics beyond the sourced claims in the system prompt

**Soft:**
- If all three causes are genuinely present (rare), default to the cause that's most actionable given current state
- If `agents_deployed: false` and `security_team_involved: false`, Root Cause 3 is unlikely to be primary — flag as "emerging risk" in severity_rationale instead

---

### Testing Strategy

**Happy path:**
- Input: clear signal (e.g., 8 months of Copilot, no ROI number, no agents)
- Expected: Cause 1, Lumina recommendation, severity Medium
- Validate: JSON parses, `primary_cause` is a string "1", "2", or "3"

**Edge case — all causes present:**
- Input: large org, Copilot deployed, custom agents running, no measurement, no security review
- Expected: model picks the most urgent cause (likely 3 if agents are running in production without review)
- Validate: single cause selected, severity is High, Guardian or Foundation recommended

**Adversarial — vague input:**
- Input: `stated_pain: "we want to be more innovative with AI"`
- Expected: model asks a clarifying next_question rather than diagnosing (or diagnoses Cause 1 as default with low confidence noted in severity_rationale)
- Validate: `next_question` is specific and actionable, not "tell me more about your AI journey"

---

### Platform Notes

**Claude Sonnet 4 (current):**
- Cause assignment: strong at 1 and 2; Cause 3 sometimes conflated with Cause 2 when agents are mentioned casually
- JSON adherence: solid
- Evidence quote accuracy: occasionally paraphrases too loosely — the instruction "quote the client's own words" needs to be explicit

**Known issue:** When `stated_pain` is a long paragraph, the model sometimes pulls evidence from the middle of the paragraph and misses a stronger signal at the end. If output seems off, check whether `stated_pain` was processed in full.

---

### Success Criteria

- Cause matches expert assessment: ≥85% on a 20-profile test set
- Recommended service is appropriate to the diagnosis: ≥90%
- next_question advances discovery (i.e., isn't already answered in the profile): ≥95%
- Zero invented statistics: 100%

---

### Gaps & Blindspots

- **Framework is INT Inc. / FlashFusion IP, not a publicly validated diagnostic.** The three-cause framework is built from synthesis of sourced research (Gartner, IBM, MIT) but the specific framing and service mapping is internal. Clients may push back if they recognize the framework as a sales funnel structure.
- **No validation against real outcomes.** We don't yet know whether the recommended service actually resolves the diagnosed cause in practice. The framework is logical but not empirically validated against FlashFusion client data (we have no longitudinal data yet).
- **`agents_deployed` is self-reported.** Clients often don't know whether their tools are running agents (Copilot Agents, Zapier AI, etc.). The boolean is unreliable — the next_question should probe this when `agents_deployed: false` but the tool stack suggests otherwise.
- **No severity weighting by industry.** A Cause 3 situation in healthcare (HIPAA exposure risk) is categorically different from the same situation in a marketing agency. The prompt doesn't account for vertical-specific risk multipliers.

---

### Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-13 | Initial v2.0 documentation from ROI Positioning Narrative |

---

*Documented from source: `INT-AI-ROI-Positioning-Narrative.html`*
