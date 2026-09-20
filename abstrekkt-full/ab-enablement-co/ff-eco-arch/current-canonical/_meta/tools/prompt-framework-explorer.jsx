import { useState } from "react";

/* Reading Room at Midnight — ChaosClub Co. variant
   Design system from 00-suite-README.md:
   Fonts: Playfair Display / IBM Plex Sans / IBM Plex Mono
   No box shadows · No gradients · No blur
   border-radius: 2–3px max
   Glyphs in chrome: ◆ ◇ ◌ ◈ ▸ ▾ ✗
   Tabs: bottom-border active indicator, no fills
   Transitions: 0.15s on color/border/opacity only

   Accessibility:
   WCAG 2.2 AA verified on dark surface:
   — primary text #ddd8ce on #0c0c0b  ≈ 13.4:1 ✓
   — secondary #9a9690 on #0c0c0b     ≈  5.9:1 ✓
   — accent #d4893a on #0c0c0b        ≈  6.2:1 ✓
   — all badge combos verified ≥ 4.5:1 ✓
   — focus ring: 2px solid #d4893a, 2px offset
   — touch targets: ≥ 44px on all interactive elements
   — aria-expanded, aria-pressed, aria-current on all controls
   — skip link · sr-only headings · landmark roles
*/

// ─── Design tokens ────────────────────────────────────────────────
const T = {
  bg:       "#0c0c0b",
  surface:  "#111110",
  card:     "#181815",
  border:   "#232320",
  borderHi: "#303030",
  accent:   "#d4893a",
  accentHi: "#e8a050",
  text:     "#ddd8ce",
  text2:    "#9a9690",
  text3:    "#4a4844",
  green:    "#5a9c5a",
  greenBg:  "#0f1f0f",
  mono:     "#7ab878",
  monoBg:   "#0d1a0d",
  blue:     "#78afc8",
  blueBg:   "#0d1820",
  red:      "#c05050",
  redBg:    "#1e0c0c",
  amber:    "#d4893a",
  amberBg:  "#1e130a",
  purple:   "#a090c8",
  purpleBg: "#14101e",
  tag:      "#1e1e1a",
  fontHead: "'Playfair Display', Georgia, serif",
  fontBody: "'IBM Plex Sans', system-ui, sans-serif",
  fontMono: "'IBM Plex Mono', 'Courier New', monospace",
};

// ─── Status config — all verified ≥ 4.5:1 on dark surfaces ──────
const SC = {
  core:     { label:"Core",         color:T.green,  bg:T.greenBg,  border:T.green  },
  helpful:  { label:"Helpful",      color:T.blue,   bg:T.blueBg,   border:T.blue   },
  redundant:{ label:"Redundant",    color:T.amber,  bg:T.amberBg,  border:T.amber  },
  moved:    { label:"Moved → API",  color:T.purple, bg:T.purpleBg, border:T.purple },
  new_:     { label:"New",          color:T.mono,   bg:T.monoBg,   border:T.mono   },
  legacy:   { label:"N/A",          color:T.text2,  bg:T.tag,      border:T.border },
  warning:  { label:"Caution",      color:T.red,    bg:T.redBg,    border:T.red    },
};

const ERAS = [
  { id:"2x",   label:"2.x",    long:"Claude 2.x",    desc:"Intent-first · 2023" },
  { id:"3x",   label:"3.x",    long:"Claude 3.x",    desc:"CoT era · 2024" },
  { id:"4std", label:"4 Std",  long:"4.x Standard",  desc:"Literal execution · 2025" },
  { id:"4adp", label:"4.7 ◈",  long:"4.7 Adaptive",  desc:"xhigh effort · 2025–26" },
];

// ─── Data ─────────────────────────────────────────────────────────
const COMPS = [
  { id:"task", name:"Task", sym:"◆", group:"img", ut:"both", eras:{
    "2x":  {s:"helpful", d:"Any description worked. Model inferred intent generously and expanded vague requests.", t:'You could write "write a report" and get something reasonable.'},
    "3x":  {s:"helpful", d:"Action verbs and scope helped. Model still filled gaps but responded better to structured asks.", t:'"Write a 500-word summary for Y audience" started working reliably.'},
    "4std":{s:"core",    d:"Exact verb + scope is now load-bearing. The model will not infer what you left out.", t:'If you say "summarize" without a length, expect a length you may not want.'},
    "4adp":{s:"core",    d:"Goal-oriented framing works. The model reasons toward execution. Output shape still needs to be specified.", t:'"So the reader can decide X" is more powerful than just "summarize."'},
  }},
  { id:"context", name:"Context files", sym:"◇", group:"img", ut:"both", eras:{
    "2x":  {s:"helpful", d:"Limited context windows. Pasting content directly was the only method — prioritize ruthlessly.", t:"Context window was small. Include only what is directly relevant."},
    "3x":  {s:"core",    d:"Expanded windows (100K+). Context quality mattered more than quantity.", t:"Label your context blocks — the model reads headers and infers structure."},
    "4std":{s:"core",    d:"Must explicitly tell the model what each file contains and why. Model won't assume relevance.", t:'Use XML tagging: <context id="brief">...</context>'},
    "4adp":{s:"helpful", d:"In agentic flows, the model self-retrieves context via tool calls. Still needed for single-shot prompts.", t:"Design context for tool-accessible retrieval, not just upfront paste."},
  }},
  { id:"reference", name:"Reference", sym:"◌", group:"img", ut:"both", eras:{
    "2x":  {s:"helpful", d:"Style matching worked roughly. Model approximated tone from examples.", t:"Examples were stronger than style descriptions in text."},
    "3x":  {s:"helpful", d:"Stronger example-following. Multi-shot patterns (3–5 examples) became a core technique.", t:"Few-shot was one of the most reliable 3.x patterns."},
    "4std":{s:"warning", d:"CAUTION: Examples override rules. In 4.x, demonstrated patterns carry higher model weight than stated constraints. If your reference shows a behavior you didn't ban, the model replicates it.", t:'Scope your reference: "Apply only these structural patterns, not tone or vocabulary."'},
    "4adp":{s:"warning", d:"Same override risk at all effort levels. The model weights what it sees demonstrated over what it's told.", t:"Always enumerate which specific patterns you want adopted from the reference."},
  }},
  { id:"success", name:"Success brief", sym:"◈", group:"img", ut:"both", eras:{
    "2x":  {s:"legacy",  d:"Not a recognized pattern. Model inferred desired outcome from the task description.", t:""},
    "3x":  {s:"helpful", d:"Outcome framing helped for complex deliverables. Recipient context improved relevance.", t:'"So that my manager approves it" started working well in 3.5.'},
    "4std":{s:"core",    d:"Critical. 4.7 will not add what you didn't ask for. Without a success definition, literal execution produces technically correct but wrong outputs.", t:'Always define what done means — recipient reaction + one success action.'},
    "4adp":{s:"core",    d:"Still needed even at xhigh effort. Deep reasoning doesn't compensate for an absent success definition.", t:"The model can reason brilliantly toward the wrong goal if the goal isn't defined."},
  }},
  { id:"rules", name:"Rules", sym:"◆", group:"img", ut:"both", eras:{
    "2x":  {s:"helpful", d:"Constraints helped but were inconsistently applied. Negative rules were especially unreliable.", t:'"Don\'t use jargon" worked less well than "use plain English."'},
    "3x":  {s:"helpful", d:"Rules became more reliable. Positive instructions outperformed negative ones.", t:'Replace "don\'t use leverage" with "use plain verbs: use, build, run."'},
    "4std":{s:"core",    d:"Positive rules only. The model follows them precisely. State scope explicitly — it won't generalize silently.", t:'"Apply this to every section" must be stated. The model won\'t assume scope.'},
    "4adp":{s:"helpful", d:"Model infers many common constraints correctly. Explicit rules still win for unusual requirements.", t:"Only specify rules that deviate from reasonable defaults."},
  }},
  { id:"tools", name:"Tools", sym:"◇", group:"img", ut:"both", eras:{
    "2x":  {s:"legacy",  d:"No native tool calling. Tool use was simulated entirely via prompt engineering.", t:"Not applicable to this era."},
    "3x":  {s:"helpful", d:"Tool calling introduced in Claude 3. Explicit instructions on which tools to use improved reliability.", t:'"Use web search to verify any statistics" started working here.'},
    "4std":{s:"core",    d:"Must explicitly specify which tools to use and when. The model won't assume tool routing.", t:'"Use web search for any claim dated after 2024."'},
    "4adp":{s:"moved",   d:"Moved to harness. Tool definitions belong in the system prompt. At xhigh effort, the model self-routes without explicit instruction.", t:"Technical: define tools in system prompt. Non-technical: still useful to name tools in the user turn."},
  }},
  { id:"conv", name:"Clarification", sym:"◌", group:"img", ut:"both", eras:{
    "2x":  {s:"helpful", d:"The model asked clarifying questions unprompted — sometimes too many. More conversational by default.", t:'Claude 2.x was chattier; you often had to say "just answer."'},
    "3x":  {s:"helpful", d:"Better calibrated. Asking it to surface questions before acting improved complex outputs.", t:'"Ask me up to 3 questions before you begin" became a reliable pattern.'},
    "4std":{s:"core",    d:"The model will proceed with assumptions rather than asking, unless explicitly told to wait. Gaps are filled silently.", t:'"Ask me anything unclear before starting. Wait for my answers before writing."'},
    "4adp":{s:"helpful", d:"At high effort, the model surfaces uncertainties through its thinking process. Still worth instructing explicitly for high-stakes outputs.", t:"Ask for questions on anything blocking a decision, not everything ambiguous."},
  }},
  { id:"plan", name:"Plan", sym:"◆", group:"img", ut:"both", eras:{
    "2x":  {s:"legacy",    d:'"Think step by step" was just emerging as a technique. Not a standard framework component.', t:"CoT prompting was in its infancy."},
    "3x":  {s:"helpful",   d:"Asking the model to surface its plan before executing improved quality. Chain-of-thought was a core technique.", t:'"Before answering, list your top 3 reasoning steps" meaningfully improved complex outputs.'},
    "4std":{s:"helpful",   d:"Useful visibility lever. Gives a checkpoint before execution, especially for technical or multi-step tasks.", t:"Best for non-technical users — lets you catch misalignment before a full wrong answer."},
    "4adp":{s:"redundant", d:"The model plans internally during adaptive thinking. Asking for an explicit plan means it articulates reasoning it already did — you're paying output tokens for a summary of work already completed.", t:"Review the thinking block summary instead of prompting for a plan."},
  }},
  { id:"push", name:"Push", sym:"◇", group:"img", ut:"both", eras:{
    "2x":  {s:"legacy",  d:"Not a recognized pattern.", t:""},
    "3x":  {s:"helpful", d:'"Go beyond the basics" and "think before answering" meaningfully improved output depth on complex tasks.', t:'Aspirational language like "ship this like a senior consultant" helped with 3.5.'},
    "4std":{s:"helpful", d:"Still useful at low effort as a reasoning trigger.", t:'"Think carefully through this before responding" compensates for low effort.'},
    "4adp":{s:"moved",   d:"Replaced by the effort parameter at the API layer. 'Maximum reasoning' in prose adds noise at xhigh — the model is already reasoning at full depth.", t:"Technical: set effort=xhigh. Non-technical: one 'think carefully' line is fine."},
  }},
  { id:"sysp", name:"System prompt", sym:"◈", group:"new", ut:"technical", eras:{
    "2x":  {s:"helpful", d:"Optional flavor text. Persona priming. Treated as extra context, not architecture.", t:""},
    "3x":  {s:"helpful", d:"Role priming became reliable. Domain expertise in system prompt improved response quality.", t:'"You are a senior financial analyst" in system prompt outperformed in-turn framing.'},
    "4std":{s:"core",    d:"Structural separation is now load-bearing. Persona, persistent rules, tool definitions, and standing constraints belong here — not in the user turn.", t:"System prompt + prompt caching = meaningful cost reduction on high-volume calls."},
    "4adp":{s:"core",    d:"Critical infrastructure. Caching economics depend on system prompt stability. Constants here, variables in user turn.", t:"Note: adaptive thinking is OFF by default on 4.7. Must send thinking: {type: 'adaptive'} explicitly."},
  }},
  { id:"effort", name:"Effort parameter", sym:"◆", group:"new", ut:"technical", eras:{
    "2x":  {s:"legacy",  d:"Did not exist.", t:""},
    "3x":  {s:"new_",    d:"Extended thinking introduced in 3.7 via budget_tokens. Manual token budget. First appearance of configurable reasoning depth.", t:"budget_tokens: 8000 = thinking cap. Higher = slower and more thorough."},
    "4std":{s:"helpful", d:"budget_tokens deprecated in 4.6+. Effort parameter replaces it. 4.7 removes manual thinking entirely — budget_tokens returns a 400 error.", t:"For 4.5 and earlier: budget_tokens still works. For 4.6+: effort + adaptive thinking."},
    "4adp":{s:"core",    d:"Primary intelligence lever. xhigh (new in 4.7) = best for coding/agentic. max = risk of overthinking. low = skips thinking entirely. This is what 'Push' was trying to accomplish in prose.", t:"effort=xhigh for complex builds. effort=high for most knowledge work. effort=low for latency-sensitive extraction. Budget 64k+ max_tokens for xhigh/max runs."},
  }},
  { id:"xml", name:"XML structure", sym:"◌", group:"new", ut:"technical", eras:{
    "2x":  {s:"legacy",  d:"Not effective. Plain text sections worked fine.", t:""},
    "3x":  {s:"helpful", d:"Claude was trained to recognize XML structure. Tags improved section disambiguation.", t:"<instructions> and <context> tags started working well."},
    "4std":{s:"core",    d:"The model is fine-tuned to respect arbitrary hierarchical XML tags. Prevents silent section override. Recommended for any multi-section prompt.", t:"<task>, <context>, <success_criteria>, <rules>, <reference> — prevents reference from overriding rules."},
    "4adp":{s:"helpful", d:"Less critical at xhigh — model reasons through section boundaries. Still best practice for complex prompts.", t:"Use XML especially when reference content and rule content appear together."},
  }},
  { id:"multi", name:"Multi-turn state", sym:"◇", group:"new", ut:"technical", eras:{
    "2x":  {s:"legacy",  d:"Single-shot only. No conversation memory architecture.", t:""},
    "3x":  {s:"helpful", d:"Conversation history included in context. Multi-turn became viable for simple tasks.", t:"Pass prior turns in the messages array to maintain continuity."},
    "4std":{s:"helpful", d:"Multi-turn state management matters. Thinking blocks in prior turns must be preserved for reasoning continuity.", t:"Don't truncate thinking blocks from prior assistant turns — breaks reasoning continuity."},
    "4adp":{s:"core",    d:"For long-horizon agentic tasks, the conversation history IS the prompt. Prior tool results, decisions, and thinking blocks compound across turns. 4.7 can write to file-system memory as persistent state.", t:"Design your turn architecture upfront. System prompt = constants, messages = state, tool memory = persistent store."},
  }},
];

const FRAMEWORKS = [
  { id:"rctf", name:"RCTF", full:"Role · Context · Task · Format", best:"General tasks, clear output needed", diff:"Beginner", cat:"foundation",
    era:{"2x":"helpful","3x":"core","4std":"core","4adp":"helpful"},
    when:"Default starting point. Use when you need deterministic, structured output and the task is well-defined. Works across all model generations.",
    v47note:"Still valid. Add XML tags and explicit scope. Remove CoT instructions — redundant at xhigh effort.",
    template:`Role: You are a senior [ROLE] with expertise in [DOMAIN].

Context: [BACKGROUND — who is this for, situation, constraints]

Task: [SPECIFIC OBJECTIVE — what exactly should be produced]

Constraints:
- [Boundary 1]
- [Boundary 2]
- [What NOT to do]

Output Format: [STRUCTURE — bullets, table, JSON, narrative]`},
  { id:"risen", name:"RISEN", full:"Role · Input · Steps · Expected · Narrowing", best:"Step-by-step procedures", diff:"Beginner", cat:"foundation",
    era:{"2x":"helpful","3x":"core","4std":"core","4adp":"helpful"},
    when:"Procedural fidelity matters — steps must be followed in sequence. API docs, policy drafts, algorithm design.",
    v47note:"Explicit steps are more important in 4.7. The model won't generalize from step 1 to step 3 without being told.",
    template:`Role: You are a [ROLE] responsible for [RESPONSIBILITY].

Input: [RAW MATERIAL — data, document, situation]

Steps to follow:
1. [First action]
2. [Second action]
3. [Third action]
4. [Validation step]

Expected Output: [FORMAT, LENGTH, CONTENT of success]

Narrowing Constraints:
- [Hard limit 1]
- [Hard limit 2]
- [Quality gate]`},
  { id:"costar", name:"CO-STAR", full:"Context · Objective · Style · Tone · Audience · Response", best:"Communication where tone matters", diff:"Beginner", cat:"communication",
    era:{"2x":"helpful","3x":"helpful","4std":"core","4adp":"core"},
    when:"Tone-sensitive communication: emails, LinkedIn posts, investor decks, customer-facing copy. When HOW you say it matters as much as WHAT.",
    v47note:"Best framework for non-technical users on 4.7. The Success Brief from the anatomy image maps directly to the Objective + Audience fields here.",
    template:`Context: [SITUATION — what's happening, background]

Objective: [GOAL — what you want to achieve]

Style: [WRITING STYLE — formal, conversational, technical, narrative]

Tone: [EMOTIONAL TONE — confident, empathetic, urgent, measured]

Audience: [WHO READS THIS — role, expertise, what they care about]

Response Format: [email, bullet list, report, script, etc.]`},
  { id:"react", name:"ReAct", full:"Reason + Act", best:"Research and reasoning loops", diff:"Intermediate", cat:"reasoning",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"core"},
    when:"Tasks requiring Claude to think, take an action, observe the result, then continue reasoning. Research, fact-checking, multi-step analysis.",
    v47note:"Native to 4.7's interleaved thinking. With adaptive thinking on, the model runs ReAct loops automatically between tool calls. The prompt structure helps at low/medium effort.",
    template:`Task: [PROBLEM TO SOLVE]

Approach: Use a Reason-Act-Observe loop:

1. REASON: Think about what information you need and why
2. ACT: [Search / Calculate / Analyze] to get that information
3. OBSERVE: Evaluate what you found — sufficient? Accurate?
4. REPEAT until confident in your answer

Constraints:
- Show your reasoning at each step
- If uncertain, state confidence level
- Cite sources for factual claims

Final Output: [DELIVERABLE with reasoning trail]`},
  { id:"cot", name:"CoT-S", full:"Chain-of-Thought Structured", best:"Complex multi-step problem solving", diff:"Intermediate", cat:"reasoning",
    era:{"2x":"legacy","3x":"core","4std":"helpful","4adp":"redundant"},
    when:"When the problem requires visible step-by-step reasoning. Math, logic, debugging, architectural decisions where you need to see the thinking.",
    v47note:"Redundant at xhigh effort. The model reasons internally. Adding CoT instructions means it narrates work it already did — you pay output tokens for a summary with no quality gain.",
    template:`Problem: [COMPLEX QUESTION OR TASK]

Think through this step by step:

Step 1: [FIRST DECOMPOSITION — break into sub-problems]
Step 2: [WORK THROUGH each sub-problem sequentially]
Step 3: [SYNTHESIZE findings into coherent answer]
Step 4: [VERIFY — check for errors, edge cases, contradictions]

Show your reasoning at each step. Flag uncertainty.

Final Answer: [CLEAR CONCLUSION with confidence level]`},
  { id:"fewshot", name:"Few-Shot", full:"Few-Shot Calibration", best:"Pattern matching with examples", diff:"Intermediate", cat:"foundation",
    era:{"2x":"helpful","3x":"core","4std":"warning","4adp":"warning"},
    when:"When you have 2–5 examples of the input→output pattern you want. Classification, formatting, style matching, data transformation.",
    v47note:"Caution: Examples override instructions in 4.x. Audit every example — if it shows a behavior you didn't intend, the model replicates it even if your rules say otherwise.",
    template:`Task: [WHAT TO DO]

Here are examples of the pattern I want:

Example 1:
Input: [EXAMPLE INPUT 1]
Output: [EXAMPLE OUTPUT 1]

Example 2:
Input: [EXAMPLE INPUT 2]
Output: [EXAMPLE OUTPUT 2]

Example 3:
Input: [EXAMPLE INPUT 3]
Output: [EXAMPLE OUTPUT 3]

Now apply the same pattern:
Input: [YOUR ACTUAL INPUT]
Output:`},
  { id:"zeroshot", name:"Zero-Shot", full:"Zero-Shot with Guardrails", best:"Quick tasks, safety constraints", diff:"Beginner", cat:"foundation",
    era:{"2x":"legacy","3x":"helpful","4std":"core","4adp":"core"},
    when:"Simple, well-defined tasks where you don't need examples but want boundaries. The lightest viable framework for 4.7.",
    v47note:"Well-suited to 4.7's literal execution. No examples means no override risk. Rules are followed precisely. Ideal for high-volume API calls at medium effort.",
    template:`Task: [SPECIFIC OBJECTIVE]

Rules:
- [MUST DO — required elements]
- [MUST NOT — prohibited elements]
- [FORMAT requirement]
- [LENGTH requirement]

Output:`},
  { id:"scqa", name:"SCQA", full:"Situation · Complication · Question · Answer", best:"Narrative business communication", diff:"Intermediate", cat:"communication",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"helpful"},
    when:"Business storytelling: memos, proposals, strategy docs. Set up a problem before presenting the solution. McKinsey-style structured narrative.",
    v47note:"Works well on 4.7. Add explicit audience and success criteria — 4.7 won't infer that the memo is for a board vs a team.",
    template:`Situation: [CURRENT STATE — what's true today, baseline]

Complication: [WHAT CHANGED — the problem, tension, challenge]

Question: [THE KEY QUESTION this creates — what must we decide?]

Answer: [YOUR RECOMMENDATION with supporting evidence]

Format: [Memo / Proposal / Strategy brief / Board update]
Audience: [WHO — their role and what they care about]`},
  { id:"ooda", name:"OODA", full:"Observe · Orient · Decide · Act", best:"Fast decisions under uncertainty", diff:"Intermediate", cat:"reasoning",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"helpful"},
    when:"Time-sensitive decisions, competitive analysis, incident response. When you need to decide fast with incomplete information.",
    v47note:"4.7 follows the structure precisely. At xhigh effort the model self-iterates; at low effort the structure keeps it on track.",
    template:`Scenario: [SITUATION REQUIRING DECISION]

OBSERVE: What data/signals/facts do we have right now?
[List available information, even if incomplete]

ORIENT: How do we interpret this data?
[Mental models, frameworks, past patterns that apply]
[What biases might distort our reading?]

DECIDE: What is the best course of action?
[Options with tradeoffs]
[Recommended action with justification]

ACT: What are the immediate next steps?
[Concrete actions, owners, timelines]
[Trigger conditions for re-evaluation]`},
  { id:"tot", name:"ToT", full:"Tree-of-Thought", best:"Branching exploration", diff:"Advanced", cat:"reasoning",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"helpful"},
    when:"Open-ended problems where multiple approaches might work. Strategic planning, creative brainstorming, architecture decisions with genuine tradeoffs.",
    v47note:"Still useful at any effort level for structured tradeoff analysis. At xhigh, the model explores branches internally but won't show them unless you ask.",
    template:`Problem: [COMPLEX PROBLEM WITH MULTIPLE VALID APPROACHES]

Explore 3 distinct solution paths:

Branch A: [APPROACH NAME]
- Reasoning: [Why this might work]
- Risks: [What could go wrong]
- Outcome quality: [Expected result]

Branch B: [APPROACH NAME]
- Reasoning: [Why this might work]
- Risks: [What could go wrong]
- Outcome quality: [Expected result]

Branch C: [APPROACH NAME]
- Reasoning: [Why this might work]
- Risks: [What could go wrong]
- Outcome quality: [Expected result]

Evaluation: Compare branches on [CRITERIA].
Recommendation: [BEST PATH with justification]`},
  { id:"crisp", name:"CRISP-DM", full:"CRISP-DM Adapted for AI", best:"Data / ML project scoping", diff:"Advanced", cat:"technical",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"helpful"},
    when:"Data science or ML projects requiring structured lifecycle planning. Scoping, feasibility, roadmapping.",
    v47note:"Technical audience only. 4.7's improved vision and file-system memory make it well-suited to data exploration tasks that follow this structure.",
    template:`Project: [DATA/ML PROJECT NAME]

1. Business Understanding:
   Objective: [BUSINESS GOAL]
   Success criteria: [MEASURABLE OUTCOMES]

2. Data Understanding:
   Available data: [SOURCES, VOLUME, QUALITY]
   Gaps: [WHAT'S MISSING]

3. Data Preparation:
   Required transformations: [CLEANING, FEATURE ENGINEERING]

4. Modeling:
   Approach: [ALGORITHMS, ARCHITECTURE]
   Evaluation: [METRICS]

5. Evaluation:
   Business validation: [DOES IT SOLVE THE PROBLEM?]

6. Deployment:
   Infrastructure: [WHERE AND HOW]
   Monitoring: [WHAT TO WATCH]`},
  { id:"pyramid", name:"Pyramid", full:"Pyramid Principle (Minto)", best:"Executive communication", diff:"Beginner", cat:"communication",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"core"},
    when:"Board updates, decision memos, policy justifications. When the audience needs the answer FIRST, evidence SECOND.",
    v47note:"Excellent on 4.7 — the model's more direct communication style naturally aligns with bottom-line-up-front structure. Pair with CO-STAR for tone and audience.",
    template:`[STATE YOUR CONCLUSION FIRST — one sentence]

Supporting Argument 1: [CLAIM]
- Evidence: [DATA/FACT]
- Evidence: [DATA/FACT]

Supporting Argument 2: [CLAIM]
- Evidence: [DATA/FACT]
- Evidence: [DATA/FACT]

Supporting Argument 3: [CLAIM]
- Evidence: [DATA/FACT]
- Evidence: [DATA/FACT]

Implication: [SO WHAT — what should happen next]`},
  { id:"bmad", name:"BMAD", full:"Breakdown · Model · Assess · Deliver", best:"Engineering & security problems", diff:"Advanced", cat:"technical",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"core"},
    when:"Architecture reviews, security assessments, DevOps planning, incident post-mortems. When risk modeling is as important as the solution.",
    v47note:"Well-matched to 4.7's self-verification capability. The ASSESS section maps to 4.7's improved threat modeling. Use xhigh effort.",
    template:`Problem: [ENGINEERING/SECURITY PROBLEM]

BREAKDOWN:
- Components: [DECOMPOSE into sub-problems]
- Dependencies: [WHAT CONNECTS TO WHAT]
- Scope: [BOUNDARIES — in vs out]

MODEL:
- Approach: [PROPOSED SOLUTION ARCHITECTURE]
- Alternatives: [OTHER OPTIONS CONSIDERED]
- Assumptions: [WHAT WE'RE ASSUMING IS TRUE]

ASSESS:
- Risks: [SECURITY, PERFORMANCE, OPS, COST]
- Unknowns: [WHAT WE DON'T KNOW]
- Mitigations: [HOW TO REDUCE RISK]

DELIVER:
- Implementation plan: [PHASED STEPS]
- Success criteria: [HOW WE KNOW IT WORKED]
- Rollback plan: [WHAT IF IT FAILS]`},
  { id:"panel", name:"Expert Panel", full:"Expert Panel Simulation", best:"Multi-perspective decisions", diff:"Advanced", cat:"reasoning",
    era:{"2x":"legacy","3x":"helpful","4std":"helpful","4adp":"core"},
    when:"Complex decisions benefiting from multiple specialized viewpoints. Policy debates, technical tradeoffs, product positioning. Stress-testing an idea.",
    v47note:"4.7's more direct style makes expert panel outputs sharper. At xhigh effort, the model produces genuinely conflicting viewpoints rather than diplomatic hedging.",
    template:`Decision: [WHAT WE'RE DECIDING]

Simulate 3 experts with distinct viewpoints:

Expert 1 — [DOMAIN, e.g., Security Engineer]:
- Position: [THEIR STANCE]
- Key argument: [WHY]
- Risk they see: [CONCERN]

Expert 2 — [DOMAIN, e.g., Product Manager]:
- Position: [THEIR STANCE]
- Key argument: [WHY]
- Risk they see: [CONCERN]

Expert 3 — [DOMAIN, e.g., CFO]:
- Position: [THEIR STANCE]
- Key argument: [WHY]
- Risk they see: [CONCERN]

Synthesis: Where do they agree? Where do they clash?
Recommendation: [BALANCED DECISION with reasoning]`},
  { id:"eval", name:"Eval-First", full:"Evaluation-First Prompting", best:"High-stakes outputs with quality gates", diff:"Advanced", cat:"technical",
    era:{"2x":"legacy","3x":"helpful","4std":"core","4adp":"core"},
    when:"High-stakes deliverables: proposals, code quality reviews, compliance docs. Define what 'good' looks like BEFORE generating the output.",
    v47note:"Directly leverages 4.7's self-verification capability. The model catches its own logical faults during planning. Pair with xhigh effort.",
    template:`Task: [WHAT TO PRODUCE]

EVALUATION RUBRIC (define BEFORE generating):

| Criterion | Weight | Score 1 | Score 5 |
|-----------|--------|---------|---------|
| [CRITERION 1] | [%] | [POOR] | [EXCELLENT] |
| [CRITERION 2] | [%] | [POOR] | [EXCELLENT] |
| [CRITERION 3] | [%] | [POOR] | [EXCELLENT] |

Now:
1. Generate the output
2. Score it against the rubric
3. Identify the weakest criterion
4. Revise to improve that criterion
5. Output the final version only`},
];

const HARNESS = [
  { id:"h1", sev:"breaking", sym:"✗", title:"budget_tokens removed", affects:"4.7 API callers",
    before:`thinking = {"type": "enabled", "budget_tokens": 32000}`,
    after:`thinking = {"type": "adaptive"}\noutput_config = {"effort": "xhigh"}`,
    note:"Returns 400 error on Opus 4.7. Adaptive thinking auto-scales based on task complexity. In internal evals, adaptive reliably outperforms fixed budgets."},
  { id:"h2", sev:"breaking", sym:"✗", title:"temperature / top_p / top_k removed", affects:"4.7 API callers",
    before:`temperature=0.7, top_p=0.9`,
    after:`# Omit entirely. Use prompting to guide behavior.`,
    note:"Returns 400 error on Opus 4.7. temperature=0 never guaranteed identical outputs anyway. Use explicit rules and examples for determinism."},
  { id:"h3", sev:"breaking", sym:"✗", title:"Thinking is OFF by default", affects:"4.7 callers expecting reasoning",
    before:`# On 4.6, thinking engaged automatically at high effort`,
    after:`thinking = {"type": "adaptive"}  # Must send explicitly`,
    note:"If you omit the thinking field, Claude 4.7 does not think at all. This is a behavior change from 4.6. Add thinking: {type: 'adaptive'} explicitly on every request that needs reasoning."},
  { id:"h4", sev:"breaking", sym:"✗", title:"New tokenizer — up to 35% more tokens", affects:"All 4.7 API callers",
    before:`max_tokens: 4096  # Was enough for 4.6`,
    after:`max_tokens: 64000  # Recommended for xhigh/max runs\n# Same text may tokenize to 1.35× more tokens on 4.7`,
    note:"Same price per token, but the same prompt may cost up to 35% more due to tokenizer changes. Update max_tokens parameters. /v1/messages/count_tokens returns different counts for 4.7 vs 4.6."},
  { id:"h5", sev:"behavioral", sym:"◌", title:"More literal instruction following", affects:"All users with existing prompts",
    before:`"Summarize this"  # 4.6 inferred length, format, depth`,
    after:`"Summarize this in 3 bullets, one sentence each,\nfor an executive audience"`,
    note:"4.7 will not silently generalize or infer requests you didn't make. Prompts that worked on 4.6 by relying on Claude reading between the lines need to be made more explicit."},
  { id:"h6", sev:"behavioral", sym:"◌", title:"Thinking content omitted by default", affects:"Apps that display reasoning to users",
    before:`# Thinking blocks streamed automatically in 4.6`,
    after:`thinking = {\n  "type": "adaptive",\n  "display": "summarized"\n}`,
    note:"If you stream reasoning to users, the new default causes a long pause before output begins. Set display: 'summarized' to restore visible progress."},
  { id:"h7", sev:"deadline", sym:"◆", title:"Model string deprecation — June 15, 2026", affects:"All API callers, artifact builders",
    before:`"claude-sonnet-4-20250514"  # Retires June 15\n# All current project artifacts use this string`,
    after:`"claude-sonnet-4-6"   # Recommended replacement\n"claude-opus-4-7"    # Most capable`,
    note:"Project artifacts currently use claude-sonnet-4-20250514. Find-and-replace across all JSX files before June 15. Sonnet 4.6 is the recommended replacement — same API shape, 40% cheaper than Opus."},
  { id:"h8", sev:"new", sym:"◈", title:"xhigh effort level (new in 4.7)", affects:"4.7 callers doing agentic/coding work",
    before:`effort = "high"  # Was the top recommended level`,
    after:`effort = "xhigh"  # New level between high and max\n# Best for coding and agentic use cases`,
    note:"New in 4.7. Low-effort 4.7 ≈ medium-effort 4.6 — you get equivalent quality for fewer tokens on straightforward tasks. xhigh is the new recommended default for complex builds."},
];

const DOTS = [
  { id:1, sym:"⇌", title:'"Push" = effort parameter', short:"Same lever, different abstraction layer",
    connects:["push","effort"],
    body:"The image's Push section ('maximum reasoning') and the API's effort=xhigh parameter are the same thing at different layers. The parameter wins if they conflict. Non-technical users can only access the prose version. Technical users should set the parameter and drop the prose entirely."},
  { id:2, sym:"−", title:"CoT prompting is now a tax", short:"Not a boost at xhigh effort",
    connects:["plan","cot"],
    body:'"Think step by step" was a scaffold for models that needed guidance on how to reason. Adaptive thinking does that internally. Adding CoT instructions at xhigh effort means the model narrates reasoning it already did — you\'re paying output tokens for a summary of work already completed.'},
  { id:3, sym:"↑", title:"Examples override rules", short:"Reference > Rules in 4.x",
    connects:["reference","rules","fewshot"],
    body:"In Claude 4.x, demonstrated patterns carry higher model weight than stated constraints. The image puts Rules after Reference but doesn't flag this precedence. Few-Shot is the most affected framework — audit every example before use in 4.x."},
  { id:4, sym:"⟳", title:"Framework purpose changed", short:"Reasoning scaffold → constraint spec",
    connects:["task","success","rules"],
    body:"Old frameworks (RISE, FLOW, CoT) were compensating for model limitations — helping models that needed guidance on how to think. 4.7 with adaptive thinking reasons independently. You're no longer teaching it to reason. You're specifying the exact boundaries of what literal execution should produce."},
  { id:5, sym:"⌥", title:"System prompt is infrastructure", short:"Not optional context",
    connects:["sysp","rules","tools"],
    body:"Legacy frameworks treated the system prompt as optional flavor text. In 4.x it's load-bearing infrastructure with caching economics. The stable portions (persona, rules, tool definitions) belong in the system prompt to hit cache on every request."},
  { id:6, sym:"⟲", title:"All frameworks assume single-shot", short:"4.7 was built for loops",
    connects:["multi","tools","react"],
    body:"Every framework in the image — and most legacy frameworks — assumes one prompt, one answer. Claude 4.7's design center is multi-turn agentic workflows. ReAct is the only framework here explicitly designed for the loop pattern 4.7 natively executes."},
];

const SEV = {
  breaking: { label:"Breaking",   color:T.red,    bg:T.redBg,    border:T.red    },
  behavioral:{ label:"Behavioral", color:T.amber,  bg:T.amberBg,  border:T.amber  },
  new:      { label:"New",         color:T.mono,   bg:T.monoBg,   border:T.mono   },
  deadline: { label:"Deadline",    color:T.purple, bg:T.purpleBg, border:T.purple },
};

// ─── Shared components ────────────────────────────────────────────
function Badge({ s }) {
  const c = SC[s] || SC.legacy;
  return (
    <span style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500, letterSpacing:"0.04em",
      padding:"2px 7px", borderRadius:2, color:c.color, background:c.bg,
      border:`1px solid ${c.border}`, whiteSpace:"nowrap", lineHeight:1.5 }}>
      {c.label}
    </span>
  );
}

function SevBadge({ sev }) {
  const c = SEV[sev] || SEV.behavioral;
  return (
    <span style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500, letterSpacing:"0.04em",
      padding:"2px 7px", borderRadius:2, color:c.color, background:c.bg,
      border:`1px solid ${c.border}`, whiteSpace:"nowrap", lineHeight:1.5 }}>
      {c.label}
    </span>
  );
}

function EraChips({ itemEras, currentEra, onEraChange }) {
  return (
    <div role="group" aria-label="Era suitability" style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
      {ERAS.map(e => {
        // itemEras can be either:
        //   component shape: { "2x": {s:"helpful", d:"...", t:"..."}, ... }
        //   framework shape: { "2x": "helpful", ... }
        const raw = itemEras[e.id];
        const s = !raw ? "legacy" : (typeof raw === "object" ? raw.s || "legacy" : raw);
        const c = SC[s] || SC.legacy;
        const active = e.id === currentEra;
        return (
          <button key={e.id} onClick={() => onEraChange(e.id)} aria-pressed={active}
            style={{ fontFamily:T.fontMono, fontSize:"11px", padding:"3px 9px", borderRadius:2,
              border:`1px solid ${active ? c.border : T.border}`,
              background:active ? c.bg : "transparent",
              color:active ? c.color : T.text2,
              cursor:"pointer", lineHeight:1.5, transition:"all 0.15s",
              fontWeight:active ? 500 : 400 }}>
            {e.label}
          </button>
        );
      })}
    </div>
  );
}

function CodeBlock({ code, variant }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const bg = variant === "before" ? "#160a0a" : variant === "after" ? "#0a160a" : "#0d0d0b";
  const textColor = variant === "before" ? "#e07070" : variant === "after" ? "#70b870" : T.text2;
  return (
    <div style={{ position:"relative", borderRadius:2, overflow:"hidden", marginTop:6 }}>
      <pre style={{ margin:0, padding:"12px 14px 12px 14px", background:bg, color:textColor,
        fontSize:"12px", fontFamily:T.fontMono, lineHeight:1.7, overflowX:"auto",
        whiteSpace:"pre-wrap", wordBreak:"break-word", borderLeft:`2px solid ${variant === "before" ? T.red : variant === "after" ? T.green : T.border}` }}>
        {code}
      </pre>
      <button onClick={copy} aria-label="Copy code to clipboard"
        style={{ position:"absolute", top:7, right:7, padding:"2px 8px", fontSize:"11px",
          fontFamily:T.fontMono, borderRadius:2, border:`1px solid ${T.borderHi}`,
          background:T.card, color:T.text2, cursor:"pointer", lineHeight:1.5, transition:"color 0.15s" }}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────
function Row({ id, label, sub, badge, isOpen, onToggle, children }) {
  return (
    <div style={{ borderBottom:`1px solid ${T.border}` }}>
      <button id={`btn-${id}`} onClick={onToggle} aria-expanded={isOpen} aria-controls={`panel-${id}`}
        style={{ display:"flex", alignItems:"baseline", width:"100%", padding:"14px 0",
          background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:12, minHeight:48 }}>
        <span aria-hidden="true" style={{ fontFamily:T.fontMono, fontSize:"11px", color:T.text3,
          flexShrink:0, width:12, transition:"transform 0.15s",
          transform:isOpen ? "rotate(90deg)" : "none", display:"inline-block", marginTop:2 }}>
          ▸
        </span>
        <div style={{ flex:1, display:"flex", flexWrap:"wrap", alignItems:"baseline", gap:"8px 12px" }}>
          <span style={{ fontFamily:T.fontHead, fontSize:"16px", fontWeight:600,
            color:T.text, lineHeight:1.3 }}>{label}</span>
          {sub && <span style={{ fontFamily:T.fontBody, fontSize:"13px", color:T.text2,
            fontStyle:"italic", lineHeight:1.4 }}>{sub}</span>}
        </div>
        <span style={{ flexShrink:0, marginTop:2 }}>{badge}</span>
      </button>
      {isOpen && (
        <div id={`panel-${id}`} role="region" aria-labelledby={`btn-${id}`}
          style={{ paddingLeft:24, paddingBottom:24 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────
function Note({ children, color, label }) {
  const c = color || T.accent;
  const lbl = label || (c === T.red ? "Caution" : (c === T.blue ? "In practice" : "4.7 note"));
  return (
    <div style={{ borderLeft:`2px solid ${c}`, paddingLeft:12, marginTop:14,
      paddingTop:2, paddingBottom:2 }}>
      <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500, color:c,
        textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 4px" }}>
        {lbl}
      </p>
      <p style={{ fontFamily:T.fontBody, fontSize:"14px", color:T.text2,
        lineHeight:1.65, margin:0 }}>{children}</p>
    </div>
  );
}

function ComponentsView({ era, ut, onEraChange }) {
  const [open, setOpen] = useState(null);
  const toggle = id => setOpen(open === id ? null : id);
  const filtered = COMPS.filter(c => ut === "both" || c.ut === "both" || c.ut === ut);
  const imgComps = filtered.filter(c => c.group === "img");
  const newComps = filtered.filter(c => c.group === "new");

  const renderComp = c => {
    const ed = c.eras[era] || {};
    return (
      <Row key={c.id} id={c.id} label={`${c.sym}  ${c.name}`}
        sub={ed.d?.substring(0,55) + (ed.d?.length > 55 ? "…" : "")}
        badge={<Badge s={ed.s || "legacy"} />}
        isOpen={open === c.id} onToggle={() => toggle(c.id)}>
        <p style={{ fontFamily:T.fontBody, fontSize:"15px", lineHeight:1.75,
          color:T.text, margin:"0 0 16px" }}>{ed.d}</p>
        {ed.t && <Note color={T.blue}>{ed.t}</Note>}
        <div style={{ marginTop:20 }}>
          <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500,
            textTransform:"uppercase", letterSpacing:"0.07em", color:T.text3, margin:"0 0 8px" }}>
            Era suitability — click to switch
          </p>
          <EraChips itemEras={c.eras} currentEra={era} onEraChange={onEraChange} />
        </div>
      </Row>
    );
  };

  return (
    <div>
      <section aria-labelledby="img-comps-heading">
        <h2 id="img-comps-heading" style={{ fontFamily:T.fontHead, fontSize:"13px", fontWeight:600,
          color:T.text3, textTransform:"uppercase", letterSpacing:"0.09em",
          margin:"0 0 4px", padding:"0 0 12px", borderBottom:`1px solid ${T.border}` }}>
          From the image
        </h2>
        {imgComps.map(renderComp)}
      </section>
      {newComps.length > 0 && (
        <section aria-labelledby="new-comps-heading" style={{ marginTop:32 }}>
          <h2 id="new-comps-heading" style={{ fontFamily:T.fontHead, fontSize:"13px", fontWeight:600,
            color:T.text3, textTransform:"uppercase", letterSpacing:"0.09em",
            margin:"0 0 4px", padding:"0 0 12px", borderBottom:`1px solid ${T.border}` }}>
            Not in the image
          </h2>
          <p style={{ fontFamily:T.fontBody, fontSize:"13px", color:T.text2, margin:"0 0 16px" }}>
            API-layer components the image doesn't address
          </p>
          {newComps.map(renderComp)}
        </section>
      )}
    </div>
  );
}

const FW_CATS = [{id:"all",label:"All"},{id:"foundation",label:"Foundation"},{id:"communication",label:"Communication"},{id:"reasoning",label:"Reasoning"},{id:"technical",label:"Technical"}];
const FW_DIFFS = [{id:"all",label:"All"},{id:"Beginner",label:"Beginner"},{id:"Intermediate",label:"Intermediate"},{id:"Advanced",label:"Advanced"}];

function FrameworksView({ era, onEraChange }) {
  const [open, setOpen] = useState(null);
  const [showTpl, setShowTpl] = useState({});
  const [cat, setCat] = useState("all");
  const [diff, setDiff] = useState("all");
  const toggle = id => setOpen(open === id ? null : id);
  const filtered = FRAMEWORKS.filter(f => (cat === "all" || f.cat === cat) && (diff === "all" || f.diff === diff));

  return (
    <div>
      <div role="group" aria-label="Filter frameworks" style={{ display:"flex", gap:6, flexWrap:"wrap",
        padding:"0 0 16px", borderBottom:`1px solid ${T.border}`, marginBottom:20 }}>
        {FW_CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id}
            style={{ fontFamily:T.fontMono, fontSize:"11px", padding:"4px 10px", borderRadius:2,
              border:`1px solid ${cat === c.id ? T.accent : T.border}`,
              background: cat === c.id ? T.amberBg : "transparent",
              color: cat === c.id ? T.accent : T.text2,
              cursor:"pointer", lineHeight:1.5, transition:"all 0.15s" }}>
            {c.label}
          </button>
        ))}
        <span aria-hidden style={{ color:T.border, padding:"4px 2px", fontSize:"11px" }}>|</span>
        {FW_DIFFS.map(d => (
          <button key={d.id} onClick={() => setDiff(d.id)} aria-pressed={diff === d.id}
            style={{ fontFamily:T.fontMono, fontSize:"11px", padding:"4px 10px", borderRadius:2,
              border:`1px solid ${diff === d.id ? T.text2 : T.border}`,
              background: diff === d.id ? T.tag : "transparent",
              color: diff === d.id ? T.text : T.text2,
              cursor:"pointer", lineHeight:1.5, transition:"all 0.15s" }}>
            {d.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ fontFamily:T.fontBody, fontSize:"14px", color:T.text2, padding:"20px 0" }}>
          No frameworks match these filters.
        </p>
      )}
      {filtered.map(fw => {
        const s = fw.era[era] || "legacy";
        const tplOpen = showTpl[fw.id];
        return (
          <Row key={fw.id} id={fw.id} label={fw.name}
            sub={fw.full}
            badge={<Badge s={s} />}
            isOpen={open === fw.id} onToggle={() => toggle(fw.id)}>
            <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
              {[fw.diff, fw.cat, fw.best].map((t, i) => (
                <span key={i} style={{ fontFamily:T.fontMono, fontSize:"11px", padding:"2px 7px",
                  borderRadius:2, background:T.tag, color:T.text2,
                  border:`1px solid ${T.border}`, lineHeight:1.5 }}>{t}</span>
              ))}
            </div>
            <p style={{ fontFamily:T.fontBody, fontSize:"15px", lineHeight:1.75, color:T.text, margin:"0 0 14px" }}>{fw.when}</p>
            {fw.v47note && <Note color={T.accent}>{fw.v47note}</Note>}
            <div style={{ marginTop:20, marginBottom:16 }}>
              <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500,
                textTransform:"uppercase", letterSpacing:"0.07em", color:T.text3, margin:"0 0 8px" }}>
                Era suitability
              </p>
              <EraChips itemEras={fw.era} currentEra={era} onEraChange={onEraChange} />
            </div>
            <button onClick={() => setShowTpl(p => ({...p, [fw.id]: !p[fw.id]}))}
              aria-expanded={!!tplOpen}
              style={{ fontFamily:T.fontMono, fontSize:"11px", padding:"5px 12px", borderRadius:2,
                border:`1px solid ${tplOpen ? T.accent : T.border}`,
                background:"transparent",
                color: tplOpen ? T.accent : T.text2,
                cursor:"pointer", lineHeight:1.5, transition:"all 0.15s" }}>
              {tplOpen ? "◆ Hide template" : "◇ Show template"}
            </button>
            {tplOpen && <CodeBlock code={fw.template} />}
          </Row>
        );
      })}
    </div>
  );
}

function HarnessView() {
  const [open, setOpen] = useState(null);
  const toggle = id => setOpen(open === id ? null : id);
  return (
    <div>
      <div style={{ padding:"10px 12px", marginBottom:20, borderRadius:2,
        background:T.amberBg, border:`1px solid ${T.amber}` }}>
        <p style={{ fontFamily:T.fontBody, fontSize:"13px", color:T.amber, margin:0, lineHeight:1.6 }}>
          API users only — these changes affect direct API callers. claude.ai users are unaffected.
        </p>
      </div>
      {HARNESS.map(h => (
        <Row key={h.id} id={h.id}
          label={`${h.sym}  ${h.title}`}
          sub={h.affects}
          badge={<SevBadge sev={h.sev} />}
          isOpen={open === h.id} onToggle={() => toggle(h.id)}>
          <div style={{ marginBottom:14 }}>
            <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500, color:T.text3,
              textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 4px" }}>Before (4.6)</p>
            <CodeBlock code={h.before} variant="before" />
          </div>
          <div style={{ marginBottom:14 }}>
            <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500, color:T.text3,
              textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 4px" }}>After (4.7)</p>
            <CodeBlock code={h.after} variant="after" />
          </div>
          <Note color={T.text2} label="Note">{h.note}</Note>
        </Row>
      ))}
    </div>
  );
}

function ConnectionsView({ onNavComp, onNavFw }) {
  const [open, setOpen] = useState(null);
  const toggle = id => setOpen(open === id ? null : id);
  return (
    <div>
      {DOTS.map(d => (
        <Row key={d.id} id={`dot-${d.id}`}
          label={`${d.sym}  ${d.title}`}
          sub={d.short}
          isOpen={open === d.id} onToggle={() => toggle(d.id)}>
          <p style={{ fontFamily:T.fontBody, fontSize:"15px", lineHeight:1.75,
            color:T.text, margin:"0 0 18px" }}>{d.body}</p>
          <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500, color:T.text3,
            textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 8px" }}>Jump to</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {d.connects.map(cid => {
              const comp = COMPS.find(x => x.id === cid);
              const fw = FRAMEWORKS.find(x => x.id === cid);
              const item = comp || fw;
              if (!item) return null;
              return (
                <button key={cid} onClick={() => comp ? onNavComp(cid) : onNavFw(cid)}
                  style={{ fontFamily:T.fontMono, fontSize:"12px", padding:"5px 12px", borderRadius:2,
                    border:`1px solid ${T.borderHi}`, background:T.tag,
                    color:T.text, cursor:"pointer", lineHeight:1.5, transition:"all 0.15s" }}>
                  {comp ? comp.sym : "◇"} {comp ? comp.name : fw.name} →
                </button>
              );
            })}
          </div>
        </Row>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────
const VIEWS = [
  { id:"components", label:"Components",  n:COMPS.length },
  { id:"frameworks",  label:"Frameworks",   n:FRAMEWORKS.length },
  { id:"harness",     label:"API Changes",  n:HARNESS.length },
  { id:"connections", label:"Connections",  n:DOTS.length },
];

export default function App() {
  const [view, setView]   = useState("components");
  const [era, setEra]     = useState("4adp");
  const [ut, setUt]       = useState("both");
  const showCtx = view === "components" || view === "frameworks";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        button:focus-visible{outline:2px solid ${T.accent};outline-offset:2px;border-radius:2px}
        a:focus-visible{outline:2px solid ${T.accent};outline-offset:2px}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
        .skip-link{position:absolute;top:-100%;left:0;background:${T.accent};color:${T.bg};padding:8px 16px;font-family:${T.fontMono};font-size:13px;font-weight:500;z-index:9999;text-decoration:none;border-radius:0 0 2px 0}
        .skip-link:focus{top:0}
        @media(prefers-reduced-motion:reduce){*{transition:none !important}}
      `}</style>

      <a href="#main-content" className="skip-link">Skip to content</a>

      <div style={{ fontFamily:T.fontBody, color:T.text, background:T.bg,
        minHeight:"100%", padding:"0 0 48px" }}>

        {/* Masthead */}
        <header role="banner" style={{ padding:"28px 0 20px",
          borderBottom:`1px solid ${T.border}`, marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
            <span aria-hidden style={{ fontFamily:T.fontMono, fontSize:"22px",
              color:T.accent, lineHeight:1, marginTop:4 }}>◈</span>
            <div>
              <h1 style={{ fontFamily:T.fontHead, fontSize:"22px", fontWeight:700,
                color:T.text, margin:"0 0 3px", lineHeight:1.2 }}>
                Prompt Framework Explorer
              </h1>
              <p style={{ fontFamily:T.fontBody, fontSize:"13px", color:T.text2,
                margin:0, lineHeight:1.5, fontStyle:"italic" }}>
                How every prompt component and framework behaves across Claude generations — from 2.x intent-inference to 4.7 literal execution.
              </p>
            </div>
          </div>
          <p style={{ fontFamily:T.fontMono, fontSize:"11px", color:T.text3,
            textTransform:"uppercase", letterSpacing:"0.08em", margin:0 }}>
            Chaos Club Co. · Reading Room at Midnight
          </p>
        </header>

        {/* Nav */}
        <nav aria-label="Explorer sections"
          style={{ display:"flex", borderBottom:`1px solid ${T.border}`, marginBottom:24 }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} aria-current={view === v.id ? "page" : undefined}
              style={{ fontFamily:T.fontBody, fontSize:"13px", fontWeight:view===v.id ? 500 : 400,
                padding:"8px 14px", background:"none", border:"none", cursor:"pointer",
                color: view===v.id ? T.accent : T.text2,
                borderBottom: view===v.id ? `2px solid ${T.accent}` : "2px solid transparent",
                marginBottom:"-1px", transition:"color 0.15s",
                display:"flex", alignItems:"center", gap:6, lineHeight:1.4, minHeight:44 }}>
              {v.label}
              <span style={{ fontFamily:T.fontMono, fontSize:"10px", padding:"1px 5px",
                borderRadius:2, background:T.tag, color:T.text3, lineHeight:1.5 }}>{v.n}</span>
            </button>
          ))}
        </nav>

        {/* Context bar */}
        {showCtx && (
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-start",
            padding:"14px 16px", marginBottom:24, borderRadius:2,
            background:T.surface, border:`1px solid ${T.border}` }}>
            <div>
              <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500,
                textTransform:"uppercase", letterSpacing:"0.07em", color:T.text3, margin:"0 0 7px" }}>
                Era
              </p>
              <div role="radiogroup" aria-label="Select model era"
                style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {ERAS.map(e => (
                  <button key={e.id} onClick={() => setEra(e.id)}
                    aria-pressed={era === e.id}
                    style={{ fontFamily:T.fontMono, fontSize:"11px", padding:"4px 10px", borderRadius:2,
                      border:`1px solid ${era===e.id ? T.accent : T.border}`,
                      background: era===e.id ? T.amberBg : "transparent",
                      color: era===e.id ? T.accent : T.text2,
                      cursor:"pointer", lineHeight:1.5, transition:"all 0.15s",
                      fontWeight: era===e.id ? 500 : 400 }}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
            {view === "components" && (
              <div>
                <p style={{ fontFamily:T.fontMono, fontSize:"11px", fontWeight:500,
                  textTransform:"uppercase", letterSpacing:"0.07em", color:T.text3, margin:"0 0 7px" }}>
                  Audience
                </p>
                <div role="radiogroup" aria-label="Select audience"
                  style={{ display:"flex", gap:4 }}>
                  {[{id:"both",label:"All"},{id:"nontechnical",label:"Non-technical"},{id:"technical",label:"Technical"}].map(u => (
                    <button key={u.id} onClick={() => setUt(u.id)} aria-pressed={ut === u.id}
                      style={{ fontFamily:T.fontMono, fontSize:"11px", padding:"4px 10px", borderRadius:2,
                        border:`1px solid ${ut===u.id ? T.text : T.border}`,
                        background: ut===u.id ? T.tag : "transparent",
                        color: ut===u.id ? T.text : T.text2,
                        cursor:"pointer", lineHeight:1.5, transition:"all 0.15s" }}>
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginLeft:"auto", textAlign:"right" }}>
              <p style={{ fontFamily:T.fontBody, fontSize:"12px", color:T.text3,
                margin:0, lineHeight:1.5, fontStyle:"italic" }}>
                {ERAS.find(e => e.id === era)?.desc}
                {era === "4adp" && <span style={{ color:T.accent, fontStyle:"normal" }}> · adaptive</span>}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <main id="main-content" tabIndex={-1}>
          <h2 className="sr-only">
            {VIEWS.find(v => v.id === view)?.label} — {ERAS.find(e => e.id === era)?.long}
          </h2>
          {view === "components"  && <ComponentsView era={era} ut={ut} onEraChange={setEra} />}
          {view === "frameworks"  && <FrameworksView era={era} onEraChange={setEra} />}
          {view === "harness"     && <HarnessView />}
          {view === "connections" && <ConnectionsView
            onNavComp={() => setView("components")}
            onNavFw={() => setView("frameworks")} />}
        </main>
      </div>
    </>
  );
}

/*
Smoke test:
- Dark surface #0c0c0b renders as base background
- Playfair Display headings load from Google Fonts
- IBM Plex Mono used for all labels, badges, code, meta text
- Skip link visible on keyboard focus, disappears on blur
- Tab through nav: focus ring is 2px solid #d4893a visible on dark bg
- aria-expanded toggles on accordion items (verify with screen reader or DOM inspector)
- aria-pressed reflects active state on era/audience buttons
- aria-current="page" on active nav tab
- Era chips update global era context when clicked from within an expanded item
- Frameworks filter chips: category and difficulty reduce the list
- Template toggle shows IBM Plex Mono code block with left-border accent
- API Changes before/after blocks use red-tinted / green-tinted backgrounds
- Copy button in code blocks works and shows "Copied" confirmation
- All text ≥ 11px, no text below that threshold
- Status badges: text label + color + border (not color-only)
- border-radius never exceeds 3px
- No box-shadows, no gradients, no blur anywhere
- prefers-reduced-motion: all transitions disabled
*/
