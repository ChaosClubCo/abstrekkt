# Kyle's Cross-Lane Vocabulary

**Purpose:** one canonical phrase per concept. Use these when cross-citing across lanes (INT, FlashFusion, personal, AI design) so the same idea is named the same way regardless of which deliverable it lands in.

**How to use:**
- Each entry leads with the **canonical phrase** — use this in cross-lane work.
- The lane variants section lists how the same concept gets named *within* each lane. Use the lane-native variant when writing inside that lane for fluency.
- **Commonly confused with** entries flag where concepts get conflated. Read these — they're the traps.
- **Origin** tags each definition as `[SOURCED]` (directly from your own docs/memory) or `[GENERATED]` (my inference from the pattern across your work).

**Correction from prior turn:** In the cross-document connection map I produced earlier, I wrote "Architecture before generation = OOBE golden state = specs-driven = spec → arch → code — four phrasings, one idea, four lanes." That was wrong. Three of those phrases are the design-first principle (entry: *Architecture Before Generation*). "OOBE golden state" is a baseline-state concept (entry: *Golden Set*). The glossary disambiguates them.

**Version history:**
- **v1.0** — initial 12 entries.
- **v1.1** — added Build Doc, Decision Log, Run Doc. Introduced the doc-system cluster matrix.
- **v1.2** — added Spec Doc. Doc-system cluster complete (Spec / Build / Run / Decision Log).
- **v1.3** — added ADR (Architecture Decision Record) as a deep-dive entry with template, severity, and supersession sub-sections.
- **v1.4** — added Acceptance Checklist as a standard entry. Formalized the sub-format pattern: doc types (Spec, Build, Run, Decision Log) get standard entries; sub-formats within them (ADR inside Decision Log, Acceptance Checklist inside Spec/Build) also get entries when conventions warrant.

---

## A

### Acceptance Checklist

**Canonical phrase:** Acceptance Checklist
**One-line definition:** A list of testable, binary pass/fail conditions that must all be true before a deliverable is signed off as "done." Typically lives as an appendix within a Spec Doc or Build Doc, walked with the engagement lead at handoff.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "acceptance checklist"; "definition of done" |
| FlashFusion | "Acceptance Checklist" (formal — see Spec Template Appendix A and Build Template Appendix C) |
| INT | "completion criteria"; "go-live checklist"; "QA sign-off list" |
| AI Design | "release gate criteria"; "exit criteria" |

**Example usage:**
- *Personal:* "Don't ship until every line on the Acceptance Checklist passes."
- *FlashFusion:* "Walk the Acceptance Checklist with the client engineering lead before sign-off. A spec is done only when every line passes."
- *INT:* "MSP deployment isn't complete until the go-live checklist is signed by ops."

**Commonly confused with:**
- *Spec Doc* — the Spec *contains* the Acceptance Checklist as an appendix; they aren't the same. A Spec defines the system; the checklist tests whether the system meets the Spec. Specs that are *only* checklists are missing the business context, scope, and out-of-scope decisions that frame the checklist.
- *Build Acceptance Checklist (vs Spec Acceptance Checklist)* — same format, different content. The Spec's checklist tests "is the system designed correctly?" The Build's checklist tests "is the system built correctly?" They overlap but aren't the same. You produce both during a full engagement.
- *Smoke Test* — both verify a deployed system, but at different layers. A smoke test is automated, runs in CI, exercises a few critical paths. The Acceptance Checklist is human-verified, covers business and operational criteria, runs once per release. A passing smoke test is sometimes a single line item *on* the Acceptance Checklist.
- *Definition of Done* — overlapping but not synonymous. "Definition of Done" is broader (covers all team deliverables, ongoing). Acceptance Checklist is bound to a *specific deliverable*. A team has one Definition of Done and many Acceptance Checklists.

**Format conventions:**
- Each item must be **testable, binary, and specific.** "System works" is not acceptable. "Endpoint returns 200 on valid HMAC, 401 on invalid HMAC" is.
- Each item **maps to a section of the parent doc** (e.g., "Section 5.1 HMAC verification uses raw body bytes, not parsed JSON"). This makes failure diagnosis traceable.
- Two checklist styles exist in your system:
  - **Spec Acceptance Checklist** — tests the design. Lives in the Spec Doc.
  - **Build Acceptance Checklist** — tests the implementation. Lives in the Build Doc.
- Walked **with the receiving party** at handoff. The checklist is a sign-off ritual, not a self-audit.
- Failed items don't fail silently. A failed item blocks delivery until reconciled, or formally waived with rationale recorded in the Decision Log (as an ADR).

**Origin:** `[SOURCED]` — explicit as Appendix A in the FF Pipeline Spec Template ("A spec is 'done' only when every line below passes") and as Appendix C in the FF Pipeline Build Template ("The build is 'done' only when every line passes"). Concept also matches your INT MSM deployment practices.

---

### Accumulator Architecture

**Canonical phrase:** Accumulator Architecture
**One-line definition:** A system designed so that new signals, projects, or contributions layer onto the existing structure incrementally, with no gatekeeping at the input layer.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "Construction over Recovery" |
| FlashFusion | "accumulator platform" |
| INT | (not formally named — implicit in KB additive structure) |
| AI Design | (not formally named — implicit in skill library composition) |

**Example usage:**
- *Personal:* "The memoir works because it's construction over recovery — every chapter adds, none rebuilds."
- *FlashFusion:* "FlashFusion is an accumulator platform. New ideas layer onto current projects; nothing gets gatekept."

**Commonly confused with:** none in your usage. External writers sometimes conflate this with "monolithic" — which is the opposite (rigid, non-additive). Worth being careful when explaining to outsiders.

**Origin:** `[SOURCED]` — "Construction over Recovery" is your stated personal philosophy; "accumulator platform" is in your FF strategy notes.

---

### ADR (Architecture Decision Record)

**Canonical phrase:** ADR (Architecture Decision Record)
**One-line definition:** The unit format for entries in the Decision Log — a single, immutable, numbered record of one architectural or implementation decision, its context, the alternatives considered, and the consequences accepted.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "ADR file"; "decision record" (e.g., `decisions/0001-use-typescript.md`) |
| FlashFusion | "ADR"; "ADR-NNNN" (numbered) |
| INT | "change record" (loose ITIL equivalent — but ITIL CABs don't enforce ADR conventions) |
| AI Design | "model card revision"; "prompt version entry" |

**Example usage:**
- *Personal:* "Open an ADR for this — we just made a call that changes the next three sprints."
- *FlashFusion:* "ADR-042 supersedes ADR-015 on the orchestration platform choice."

**Commonly confused with:**
- *Decision Log* — container vs entry. The Decision Log is the *journal*; an ADR is one *page* in that journal. Adding to the Decision Log means writing an ADR. Asking "what's our Decision Log on X?" is shorthand for "show me the ADRs covering X."
- *Provenance Labeling* — both preserve record integrity, but for different content. ADRs preserve decision integrity (this choice was made for these reasons). Provenance Labeling preserves claim integrity ([SOURCED] vs [GENERATED]). Parallel concepts, non-overlapping.
- *Spec Doc* — a Spec Doc may *contain* an ADR section or reference ADRs externally, but the Spec defines the target state while the ADR records the choices made along the way. If you find yourself putting decision rationale in the Spec body, you're doing the ADR work in the wrong document.
- *Acceptance Checklist* — both are sub-formats inside parent docs, but they answer different questions. An ADR records "what did we decide and why?" An Acceptance Checklist tests "did we deliver what we said?" Failed checklist items can produce ADRs (for waivers); ADRs do not produce checklist items.

**Origin:** `[SOURCED]` — externally standard practice (Michael Nygard, 2011 "Documenting Architecture Decisions"); MADR specification; widely adopted across engineering orgs. `[GENERATED]` — the specific severity scheme below is a synthesis tuned to your operating patterns; standard ADR practice doesn't always include severity.

#### Deep dive — template conventions

The canonical ADR format:

```markdown
# ADR-NNNN: Short title (verb-led, present tense)

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
**Date:** YYYY-MM-DD
**Severity:** Trivial | Standard | Major | Foundational
**Supersedes:** ADR-NNNN (if any)
**Authors:** name(s)

## Context
What is the issue motivating this decision? What forces are at play? What
constraints exist? Two to four paragraphs maximum.

## Decision
What we are doing about it. Stated in active voice ("We will use X"). One
or two paragraphs.

## Alternatives considered
What else we looked at and why we rejected it. One short paragraph per
alternative. Cite ADRs or external sources where relevant.

## Consequences
What becomes easier as a result. What becomes harder. What new risks we are
accepting. Be honest about the trade-offs you are making.
```

**Rules of the format:**
- Numbered sequentially across the entire repo or project (ADR-001, ADR-002, ADR-003…). Numbers are never reused.
- Title is verb-led and present tense ("Use Postgres for relational data," not "Database choice").
- One ADR per decision. If you find yourself documenting two decisions in one ADR, split them.
- Brevity is a feature. Aim for ≤500 words. Longer ADRs usually conceal multiple decisions.
- All four sections are mandatory. An ADR without "Alternatives considered" is a directive, not a decision record.

#### Deep dive — severity levels

| Severity | Blast radius | Reversibility | When to use |
|---|---|---|---|
| **Trivial** | Single file or module | Within a sprint | Lint rules, naming conventions for one module, error message format |
| **Standard** | Multiple modules or one major component | With moderate effort | Library choices, testing framework, validation library |
| **Major** | Cross-cutting; affects most of the system | With significant rework | Database choice, orchestration platform, auth provider |
| **Foundational** | Defines the system | Effectively irreversible | Monorepo vs polyrepo, cloud vs self-hosted, language choice |

**Reading guidance:**
- Trivial ADRs can be one paragraph; reviewers should approve in minutes.
- Standard ADRs deserve full sections; reviewers should approve within a day.
- Major ADRs require alternatives-considered with explicit trade-off analysis; reviewers should approve within a week.
- Foundational ADRs require a wider review (engineering lead + product + at least one external sanity check); approval timeline measured in weeks. These are the ADRs you read again at the post-mortem.

#### Deep dive — supersession rules

ADRs are immutable. When a decision changes, the answer is *never* to edit the existing ADR — it is to write a new one that supersedes it.

**The rules:**

1. **Immutability.** An accepted ADR is never edited except to change its `Status` to "Superseded by ADR-NNNN." That status update is the only exception to immutability.
2. **New ADR for new decision.** When a decision changes, write a new ADR. Set its `Supersedes` field to the old ADR's number. Set the old ADR's status to "Superseded by [new ADR number]."
3. **Content preservation.** The old ADR's content is preserved verbatim. Readers six months later can see what was decided, why, and why it was later changed.
4. **Severity matching.** A Foundational ADR can only be superseded by another Foundational ADR. The reasoning: a system-level decision requires system-level justification to change. Trivial, Standard, and Major ADRs can be superseded by any severity, but stepping up severity requires explicit acknowledgment in the new ADR's Context.
5. **Single direct superseder.** An ADR can only be directly superseded by one ADR. If two competing successors exist, one of them should supersede the *other* — only one chain is valid.
6. **Chain visibility.** Supersession chains should be navigable forwards and backwards. ADR-001 → ADR-015 → ADR-042 means readers can land on any of the three and find the others.

**What supersession is NOT:**
- Not for fixing typos. Edit those directly with a `Last edited:` annotation.
- Not for clarifying ambiguous wording. If the original ADR's intent is clear and you only need to add detail, add a comment block at the bottom — don't supersede.
- Not for status changes alone. "Accepted" → "Deprecated" is a status update on the same ADR, not a supersession. Supersession applies when there is a *new* decision replacing the old one.

---

### Adversarial Review

**Canonical phrase:** Adversarial Review
**One-line definition:** A standing practice of pressure-testing your own outputs by surfacing counterexamples, contradictions, and gaps before shipping — explicitly *not* relying on the reader to do this work.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS footer"; "agreement streak flag"; "anti-sycophancy" |
| FlashFusion | "anti-slop gates"; "design audit" |
| INT | "post-incident review" (loose equivalent, ITIL-derived) |
| AI Design | "stress test the model" / "red-team the output" |

**Example usage:**
- *Personal:* "Every substantive output ends in a CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS footer."
- *FlashFusion:* "The 7 anti-slop gates run before any UI ships."

**Commonly confused with:** *Provenance Labeling* — different concept. Adversarial review checks whether claims hold up under attack. Provenance labeling tags where claims came from. You usually want both, but they're distinct gates.

**Origin:** `[SOURCED]` — explicit in your operating rules and the `applying-adversarial-review` skill.

---

### Architecture Before Generation

**Canonical phrase:** Architecture Before Generation
**One-line definition:** The principle that system structure must be designed before content, code, or output is generated — no "vibe coding," no "just start writing." Spec the shape first, fill it in second.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "spec → arch → code gen → local test → deploy → monitor → iterate" |
| FlashFusion | "Specs-Driven Loop"; "Beyond the Vibe" |
| INT | "design before deployment" (implicit in OOBE provisioning standards) |
| AI Design | "Architectural Approach to AI Design"; "architecture before generation" |

**Example usage:**
- *Personal:* "My dev philosophy is architecture before generation — spec, arch, code, in that order."
- *FlashFusion:* "Our specs-driven loop is what separates us from vibe-coded agent stacks."

**Commonly confused with:** *Golden Set* (see correction at top of doc). Both are pre-build concepts but they're different — design-first is about *shape*, golden-set is about *reference state*.

**Origin:** `[SOURCED]` — your stated dev philosophy; named directly in the AI Design docs.

---

## B

### Build Doc

**Canonical phrase:** Build Doc
**One-line definition:** The implementation companion to a Spec — concrete code, configuration, JSON contracts, schema definitions, and deployment steps for constructing the system the Spec describes. Answers "how do I build this?"

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "implementation notes" (informal); "build doc" |
| FlashFusion | "Build Doc" (formal — see Pipeline Build Template) |
| INT | "deployment guide"; "provisioning runbook"; "MSM deployment guide" |
| AI Design | "implementation spec"; "engineering doc" |

**Example usage:**
- *Personal:* "Spec the change, then write the Build Doc before touching code."
- *FlashFusion:* "Pair the Pipeline Spec with the Pipeline Build Doc. Spec says what; Build says how."
- *INT:* "The Intinc Deployment Kit is functionally a Build Doc for endpoint provisioning."

**Commonly confused with:**
- *Spec Doc* — Spec is what/why; Build is how. A reader needs both to make decisions and to implement.
- *Run Doc* — Build is one-time construction; Run is continuous operation. The Build Doc ends when the system is deployed; the Run Doc begins. If a procedure repeats (health check, on-call response), it belongs in Run, not Build.
- *Decision Log* — Build says how to implement; Decision Log says why this implementation over alternatives. The Build Doc cites the Decision Log when explaining non-obvious choices.
- *Acceptance Checklist (Build variant)* — the Build Doc contains an Acceptance Checklist as an appendix that tests the implementation. See *Acceptance Checklist* entry for format conventions.

**Origin:** `[SOURCED]` — explicit in the FlashFusion Pipeline Build Template v1.0; concept referenced in the FF Pipeline Spec Template ("Pair this spec with a Build doc and a Run doc").

---

## D

### Decision Log

**Canonical phrase:** Decision Log
**One-line definition:** The continuous container — across a project's lifetime — of architectural and implementation decisions. Holds individual ADRs (see *ADR* entry for the format, severity scheme, and supersession rules). Answers "where do I look to see why this is the way it is?"

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "Decision Log"; "ADR file in repo" |
| FlashFusion | "Decision Log"; "downstream context handoff" target (where Specs-Driven Loop iterations publish) |
| INT | "change log"; "CAB minutes" (loose ITIL equivalent) |
| AI Design | "model card decisions"; "prompt version log" |

**Example usage:**
- *Personal:* "Updated patterns, interfaces, and assumptions go in the Decision Log before cutover."
- *FlashFusion:* "Every Specs-Driven Loop iteration produces at least one Decision Log entry — even if the decision is 'we considered X and rejected it.'"
- *INT:* "Significant config changes need a CAB entry, which functions as the Decision Log for the MSP estate."

**Commonly confused with:**
- *ADR* — container vs entry. The Decision Log is the journal; an ADR is one entry. "Add to the Decision Log" = "write an ADR." See *ADR* entry for format conventions, severity levels, and supersession rules.
- *Run Doc* — Decision Log captures *why* we made the choices; Run Doc captures *how* to operate the resulting system. The Run Doc cites the Decision Log when explaining quirky procedures.
- *Provenance Labeling* — both track origins, but for different things. Decision Log tracks *decisions* and *rationale*. Provenance Labeling tags individual *claims* (`[SOURCED]` vs `[GENERATED]`). Use the Decision Log for "why we picked Supabase over Firebase"; use Provenance Labeling for "this stat came from the Q1 report."
- *Build Doc* — Build doc says *how*; Decision Log says *why*. Read both before challenging a build choice.
- *Spec Doc* — Spec defines the target state; Decision Log records the journey of choices that produced the spec. The Spec answers "what?"; the Decision Log answers "why this 'what?'?"

**Origin:** `[SOURCED]` — referenced in the FF Render Engine doc, FF Pipeline Spec Template, and FF Pipeline Build Template ("published to the project's Decision Log before cutover").

---

## G

### GIGO Validation

**Canonical phrase:** GIGO Validation
**One-line definition:** A pre-flight check at the ingress layer that verifies input quality *before* any billable, irreversible, or expensive downstream work fires. Garbage-in failures are caught and rejected at the door, not absorbed by the pipeline.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "audit before shipping" (YAML valid, trigger-density, line count) |
| FlashFusion | "GIGO Validation"; "ingress shield" |
| INT | "pre-deployment checklist"; "OOBE verification" |
| AI Design | "input validation"; "guardrail" |

**Example usage:**
- *Personal:* "Audit before shipping — skill YAML valid, trigger density ≥ 4, line count under 500."
- *FlashFusion:* "The GIGO shield is what makes the pipeline economically viable."

**Commonly confused with:** *Adversarial Review* — different timing. GIGO is at the *input* layer (rejecting bad inputs). Adversarial review is at the *output* layer (stress-testing what you produced).

**Origin:** `[SOURCED]` — explicit in the B2B Pipeline doc and your skill-authoring audit rules.

---

### Golden Set

**Canonical phrase:** Golden Set
**One-line definition:** A small, fixed, hand-labeled set of reference records (typically 20–50) used to validate that changes to a system don't regress its known-good behavior.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "test fixtures" (loose); "smoke tests" (loose) |
| FlashFusion | "Golden Set of 20–50" |
| INT | "OOBE Golden State" (the validated post-provisioning reference state of an endpoint) |
| AI Design | "regression set"; "eval set"; "calibration corpus" |

**Example usage:**
- *FlashFusion:* "Every change to the AI Control Plane is replayed against the Golden Set before deployment."
- *INT:* "After provisioning, capture the OOBE Golden State as the deviation baseline."

**Commonly confused with:** *Architecture Before Generation* (see correction at top of doc). They share a vibe — both happen "before" something — but they're orthogonal. You can have a Golden Set without having designed the architecture first, and vice versa.

**Origin:** `[SOURCED]` — "Golden Set of 20–50" is in your FF docs; "OOBE Golden State" is in the INT IT deployment docs.

---

## P

### Provenance Labeling

**Canonical phrase:** Provenance Labeling
**One-line definition:** Every substantive claim in an output is tagged with its source: `[SOURCED]` for claims drawn from documents, search results, or stated facts, `[GENERATED]` for claims that are your (or my) inference.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "[SOURCED] vs [GENERATED] labeling" |
| FlashFusion | "source attribution" (per-render in the Render Engine) |
| INT | "ticket citations"; "KB cross-reference" |
| AI Design | "RAG attribution"; "model citation" |

**Example usage:**
- *Personal:* "Every claim labeled — [SOURCED] for what came from your Drive, [GENERATED] for what I inferred."
- *FlashFusion:* "Source attribution is preserved in every render tier where appropriate."

**Commonly confused with:**
- *Adversarial Review* — different gate (see Adversarial Review entry). Also sometimes confused with citation footnotes — those are a *format* for provenance labeling, not the concept itself.
- *Decision Log* — provenance tags *claims*; decisions are tracked in the *Decision Log*. "We chose Supabase" is a decision; "Supabase has a $25/mo Pro tier" is a claim.
- *ADR* — parallel concepts. ADRs preserve decision integrity; Provenance Labeling preserves claim integrity. Use ADRs for decision records; use Provenance Labeling on claims inside any document.

**Origin:** `[SOURCED]` — explicit in your anti-sycophancy rule and operating instructions.

---

## R

### Run Doc

**Canonical phrase:** Run Doc
**One-line definition:** The operational companion to a Spec and Build Doc — on-call procedures, incident response playbooks, health-check rituals, escalation paths, and recovery procedures for keeping the deployed system running. Answers "how do I operate this?"

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "runbook"; "SOP file" |
| FlashFusion | "Run Doc" (third doc in the Spec → Build → Run trio) |
| INT | "runbook"; "escalation playbook"; "shift handoff doc"; "KB article" (for repeatable procedures) |
| AI Design | "operational guide"; "production handbook"; "model monitoring playbook" |

**Example usage:**
- *Personal:* "Build the Run Doc before you ship — on-call procedures need to exist before the system is live."
- *FlashFusion:* "Every FF engagement ends with three docs: Spec (what), Build (how to construct), Run (how to operate)."
- *INT:* "Service desk KB articles are essentially Run Docs for the MSP estate — each one is the operational playbook for a specific failure mode."

**Commonly confused with:**
- *Build Doc* — Build is how to construct (one-time); Run is how to operate (continuous). If a procedure runs once during deployment, it's Build. If it repeats (health check, on-call, monthly review), it's Run.
- *Spec Doc* — Spec defines what counts as working; Run defines what to do when it isn't. Both get pulled out during an incident — Spec for diagnosis (is this still meeting the spec?), Run for remediation.
- *Decision Log* — Run says how to operate; Decision Log says why the operation is the way it is. The Run Doc cites the Decision Log when explaining non-obvious procedures.

**Origin:** `[SOURCED]` — explicit in the FF Pipeline Spec Template and Build Template as the third companion doc; concept matches your INT KB and runbook practices.

---

## S

### Scope Gate

**Canonical phrase:** Scope Gate
**One-line definition:** A runtime decision about how much rigor, audit overhead, and process to apply to a task — based on the task's complexity, blast radius, or stakes. Different gates trigger different procedures.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "SCOPE_MODE LITE / STANDARD / FULL" |
| FlashFusion | "Maturity Tier: Mini / Mid / Enterprise" |
| INT | (not formally named; functions through L1–L4 escalation logic) |
| AI Design | "task complexity gating" (loose) |

**Example usage:**
- *Personal:* "LITE scope gets one ! flag; STANDARD and FULL require the full adversarial critic step."
- *FlashFusion:* "The build targets the Mid maturity tier — Golden Set, graders, shadow deployment."

**Commonly confused with:** *Tier Matrix*. Important distinction:
- **Tier Matrix** = the *static structure* of how many tiers exist and what each one contains (e.g., "we have 4 audience tiers").
- **Scope Gate** = the *runtime decision* about which tier to invoke for a given task (e.g., "this request is STANDARD scope, so run the full check").

You will conflate these constantly. Don't.

**Origin:** `[SOURCED]` — SCOPE_MODE is explicit in your operating rules; Mini/Mid/Enterprise is in the FF agent stack docs.

---

### Shadow Deployment

**Canonical phrase:** Shadow Deployment
**One-line definition:** Running a new version of a system in parallel with the existing version, capturing both outputs, comparing them, but not exposing the new version's outputs to downstream consumers until comparison passes.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | (not formally named; informal "test in isolation first") |
| FlashFusion | "Shadow Deployment" (release ritual) |
| INT | "pilot deployment"; "test group rollout" |
| AI Design | "shadow inference"; "champion/challenger" |

**Example usage:**
- *FlashFusion:* "Run the new logic in parallel with the old for the agreed shadow duration. Compare outputs before cutover."

**Commonly confused with:** *Golden Set* — orthogonal. Shadow deployment compares old-vs-new on *live* traffic. Golden Set compares both against *fixed* reference fixtures. You usually want both.

**Origin:** `[SOURCED]` — explicit in the FF agent stack and AI Control Plane docs.

---

### Spec Doc

**Canonical phrase:** Spec Doc
**One-line definition:** The defining document for a system — what it is, why it exists, what counts as "done," what's in scope and what's out. Answers "what is this and what does success look like?" The first of the four documents in the Spec / Build / Run / Decision Log system.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "spec"; "design doc" (informal) |
| FlashFusion | "Spec Doc" (formal — see Pipeline Spec Template); doubles as a sales asset for client engagements |
| INT | "change request spec"; "project charter"; "requirements doc"; "ITIL change record" |
| AI Design | "model spec"; "product spec"; "evaluation criteria doc" |

**Example usage:**
- *Personal:* "Write the Spec Doc before the Build Doc — what success looks like, before how to construct it."
- *FlashFusion:* "The Pipeline Spec Template is our Spec Doc format for any engagement. It also functions as the cover page of the deliverable bundle."
- *INT:* "Major MSP changes go through a change request spec before CAB approval — that's the Spec Doc for the change."

**Commonly confused with:**
- *Build Doc* — Spec is what/why; Build is how. The Spec defines the destination; the Build defines the path. A Spec without a Build is undeliverable; a Build without a Spec has no shared definition of done.
- *Run Doc* — Spec defines what counts as working; Run defines what to do when it isn't. Both get pulled out during an incident — Spec for diagnosis (is this still meeting the spec?), Run for remediation.
- *Decision Log* — Spec defines the target state; Decision Log records the journey of choices that produced it. The Spec answers "what?"; the Decision Log answers "why this 'what?'?" An engineer challenging the spec is implicitly challenging the Decision Log — cite both.
- *Acceptance Checklist* — a Spec Doc *contains* an Acceptance Checklist as an appendix; they aren't the same. The checklist is *one section* of the spec, not a replacement for it. See *Acceptance Checklist* entry for format conventions and the Spec vs Build checklist distinction.

**Origin:** `[SOURCED]` — explicit as the canonical doc type in the FF Pipeline Spec Template v1.0. References in the Build Template, Render Engine doc, and the Build/Run/Decision Log glossary entries all point back to "the Spec." The concept is also implicit across your INT change-management work and the AI Design spec docs.

---

### Specs-Driven Loop

**Canonical phrase:** Specs-Driven Loop
**One-line definition:** The full iterative cycle implementing the *Architecture Before Generation* principle — spec, architecture, code generation, local test, deploy, monitor, iterate, repeat. The cycle, not the principle.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "spec → arch → code gen → local test → deploy → monitor → iterate" |
| FlashFusion | "Specs-Driven Loop" |
| INT | "ITIL change management cycle" (loose equivalent) |
| AI Design | "MLOps loop" (loose equivalent) |

**Example usage:**
- *Personal:* "Run the specs-driven loop: spec the change, arch it, generate, test, ship, monitor."
- *FlashFusion:* "The specs-driven loop separates production agents from prototypes."

**Commonly confused with:** *Architecture Before Generation* — principle vs cycle. Architecture-Before-Generation is *what you believe*. Specs-Driven Loop is *how you operationalize it*. Cite the principle when justifying; cite the loop when describing how the work happens.

**Origin:** `[SOURCED]` — your dev philosophy and the FF Beyond-the-Vibe doc both name this.

---

## T

### Tier Matrix

**Canonical phrase:** Tier Matrix
**One-line definition:** The static structural definition of how many tiers exist in a system and what each tier represents — independent of which tier any specific task gets routed to.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "tier 1–4" (when discussing structure broadly) |
| FlashFusion | "Render Engine 4 tiers" (newcomer / case-study / strategic / technical); "AI Control Plane tiers" (Mini / Mid / Enterprise) |
| INT | "L1 / L2 / L3 / L4 service desk tiers" |
| AI Design | "model size tiers"; "audience tiers" |

**Example usage:**
- *FlashFusion:* "The Render Engine ships a 4-tier matrix per source — newcomer, case study, strategic, technical."
- *INT:* "Standard MSP service desk runs an L1–L4 tier matrix."

**Commonly confused with:** *Scope Gate* — see Scope Gate entry. Tier Matrix = structure. Scope Gate = runtime selection.

**Origin:** `[SOURCED]` — multiple instances across your INT docs (L1–L4), FF docs (Mini/Mid/Enterprise), and the Render Engine deliverable (4 audience tiers).

---

## U

### Uncertainty Architecture

**Canonical phrase:** Uncertainty Architecture
**One-line definition:** A system design posture that explicitly separates the deterministic layer (orchestration, validators, routing rules) from the probabilistic layer (LLM inference, external API responses) and treats the probabilistic layer as a first-class architectural citizen with its own versioning, validation, and evaluation.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | (not formally named) |
| FlashFusion | "Uncertainty Architecture"; "linguistic logic vs deterministic logic" |
| INT | (not applicable — INT systems are mostly deterministic) |
| AI Design | "probabilistic vs deterministic split"; "AI as a subsystem" |

**Example usage:**
- *FlashFusion:* "The pipeline is built on an Uncertainty Architecture posture — deterministic orchestration, probabilistic rendering, explicit evaluation."

**Commonly confused with:** none in your usage. External writers sometimes conflate this with "non-determinism" generally — which misses the point. Uncertainty Architecture is *not* about embracing chaos; it's about *bounding* it with structure.

**Origin:** `[SOURCED]` — explicit in the FF Beyond-the-Vibe doc and the B2B Pipeline doc.

---

## W

### WSJF Prioritization

**Canonical phrase:** WSJF Prioritization
**One-line definition:** Weighted Shortest Job First — a backlog prioritization method scoring each item by (business value + time criticality + risk reduction) / job size. The highest score gets worked first.

**Lane variants:**
| Lane | Phrase |
|---|---|
| Personal | "WSJF prioritization" |
| FlashFusion | "WSJF backlog audit" |
| INT | "ticket priority matrix" (loose ITIL equivalent) |
| AI Design | "task value scoring" (loose) |

**Example usage:**
- *Personal:* "Run a WSJF audit on the backlog — anything below the threshold archives, top three become the sprint."
- *FlashFusion:* "WSJF prioritization at the start of every sprint cycle."

**Commonly confused with:** none in your usage. Sometimes confused externally with simpler priority schemes (P0/P1/P2) — but WSJF includes the *size* dividend, which the priority schemes don't.

**Origin:** `[SOURCED]` — explicit in your operating rules as a standing practice.

---

## Appendix A — Quick reference (canonical phrases only)

For when you need to scan fast:

1. **Acceptance Checklist** — testable binary pass/fail list for sign-off
2. **Accumulator Architecture** — additive system design, no gatekeeping
3. **ADR** — single immutable Decision Log entry; sequential, severity-graded, supersession-tracked
4. **Adversarial Review** — stress-test your own outputs before shipping
5. **Architecture Before Generation** — design the shape before generating the content
6. **Build Doc** — how-to-construct companion to a Spec
7. **Decision Log** — container for ADRs; the journal of project decisions
8. **GIGO Validation** — reject bad input at the door
9. **Golden Set** — small fixed validated reference baseline
10. **Provenance Labeling** — `[SOURCED]` vs `[GENERATED]` on every claim
11. **Run Doc** — how-to-operate companion to a Spec and Build Doc
12. **Scope Gate** — runtime decision on which tier of rigor to apply
13. **Shadow Deployment** — run new in parallel with old before cutover
14. **Spec Doc** — what is this, why, and what counts as done
15. **Specs-Driven Loop** — the iterative spec → arch → code cycle
16. **Tier Matrix** — the static structure of how many tiers exist
17. **Uncertainty Architecture** — deterministic + probabilistic, both first-class
18. **WSJF Prioritization** — value × time × risk / size, highest first

## Appendix B — Conflation traps (read these)

### Single-pair traps

- **Architecture Before Generation** vs **Golden Set** — principle (design first) vs reference state (validated baseline). Different concepts, both pre-build.
- **Tier Matrix** vs **Scope Gate** — static structure (how many tiers) vs runtime decision (which tier now).
- **Adversarial Review** vs **Provenance Labeling** — output-side check (do claims hold up) vs source-side tag (where did claims come from).
- **GIGO Validation** vs **Adversarial Review** — input gate (reject bad inputs) vs output gate (stress-test products).
- **Specs-Driven Loop** vs **Architecture Before Generation** — the loop (operational cycle) vs the principle (the rule that justifies the cycle).
- **Shadow Deployment** vs **Golden Set** — live-traffic comparison vs fixed-fixture comparison. Both are evaluation; both can run simultaneously.

### The doc-system cluster (complete in v1.2)

The four document types in your system collapse into each other constantly. Internalize this matrix:

| Document | Answers | Lives | Read when |
|---|---|---|---|
| **Spec Doc** | What is this? Why does it exist? What's done? | Cover-page in repo, sales asset | Designing, scoping, accepting |
| **Build Doc** | How is this constructed? | Repo, paired with Spec | Implementing, refactoring |
| **Run Doc** | How is this operated? | Repo, paired with Build; also exported as ops doc | Incidents, on-call, monthly checks |
| **Decision Log** | Why this, not that? | Repo (`docs/decisions/` or ADR file) | Challenging a choice, onboarding, post-mortem |

Specific pairs you will mix up:

- **Spec Doc** vs **Build Doc** — what counts as done vs how to build it. Test: am I describing the destination or the path? Destination = Spec. Path = Build.
- **Build Doc** vs **Run Doc** — one-time construction vs continuous operation. Test: does this procedure run once at deploy, or repeat? Once = Build. Repeat = Run.
- **Decision Log** vs **Build Doc** — why this implementation vs how to implement it. Test: does this explain a choice (decision) or describe a step (build)? Choice = Decision Log. Step = Build.
- **Decision Log** vs **Provenance Labeling** — decisions (and rationale) vs claims (and sources). Test: am I tagging an opinion-driven choice or a factual claim? Choice = Decision Log. Fact = Provenance Label.
- **Spec Doc** vs **Run Doc** — what counts as working vs what to do when it isn't. Both get pulled out during an incident; cite one for diagnosis, the other for remediation.
- **Spec Doc** vs **Decision Log** — target state vs journey of choices that produced it. Test: am I declaring an outcome or recording how we arrived at it? Outcome = Spec. Journey = Decision Log.

### Doc system as a system

The four docs are not independent. They depend on each other in a specific order:

1. **Spec Doc** comes first. Without it, the other three are guessing at the target.
2. **Decision Log** runs in parallel with the Spec and continues through Build and Run. It is the only doc that spans the full lifecycle.
3. **Build Doc** follows the Spec. Cite the Spec sections it implements.
4. **Run Doc** follows the Build. Cite the Build sections it operates.

A complete engagement produces all four. A complete *audit* of an engagement reads them in this order: Spec (what?) → Decision Log (why?) → Build (how built?) → Run (how operated?). Mixing the order produces the wrong diagnostic at incident time.

### ADR-specific traps

- **ADR** vs **Decision Log** — entry vs container. The Decision Log is the journal; an ADR is one page. "Add to the Decision Log" = "write an ADR." Useful test: is this a *thing* (a single record) or a *place* (a collection)? Thing = ADR. Place = Decision Log.
- **Supersession** vs **Editing** — supersession creates a new immutable record and updates the old one's status only. Editing destroys history. Wrong choice destroys auditability.
- **Severity** vs **Priority** — severity is about blast radius and reversibility (a property of the *decision*). Priority is about urgency and forcing function (a property of the *work*). Don't conflate.
- **ADR** vs **Provenance Labeling** — parallel concepts, both about preserving record integrity. ADRs preserve decision integrity. Provenance Labeling preserves claim integrity.

### Acceptance Checklist traps (new in v1.4)

- **Acceptance Checklist** vs **Spec Doc** — the checklist is contained in the spec; not the same thing. A spec without the surrounding business context, scope, and out-of-scope sections is a checklist masquerading as a spec — and that's where most engagement disputes start.
- **Spec Acceptance Checklist** vs **Build Acceptance Checklist** — same format, different layer. Spec checklist tests design; Build checklist tests implementation. You produce both during a full engagement and walk each with the appropriate counterparty.
- **Acceptance Checklist** vs **Smoke Test** — human-verified business/operational criteria vs automated technical critical-path checks. A passing smoke test is sometimes a *single line item* on the Acceptance Checklist.
- **Acceptance Checklist** vs **Definition of Done** — one deliverable's pass/fail conditions vs a team's ongoing quality standard. A team has one Definition of Done; the same team produces many Acceptance Checklists.

### The sub-format pattern (precedent set in v1.3, extended in v1.4)

Two glossary entries now describe *sub-formats* that live inside parent docs:

| Sub-format | Lives inside | Function |
|---|---|---|
| **ADR** | Decision Log | The unit format for a single decision record |
| **Acceptance Checklist** | Spec Doc or Build Doc | The pass/fail testing list for a single deliverable |

This is a deliberate precedent: sub-formats earn glossary entries when (a) they have specific conventions that need to be locked in, and (b) they appear across 3+ lanes. Not every sub-format qualifies — runbook procedures inside a Run Doc, for example, are too varied to be formalized as a single entry. The bar is "the format has rules that, if violated, cause real downstream problems."

---

## Gaps in v1.4

- **Severity scheme** for ADRs is GENERATED, not directly SOURCED from your operating rules. If you adopt a different severity model in practice, the ADR entry needs updating.
- **The doc-system cluster** could be promoted from an appendix section into its own dedicated reference card. With v1.4 closing both the cluster *and* the two sub-format entries, this is the natural next step if cross-lane work cites the cluster heavily.
- **Enforcement.** The glossary describes what these formats *should* look like; it does not enforce them. The "package as enforcement skill" path remains the live next move for any team that wants the conventions to land in real output rather than just live in a reference doc.

---

*Cross-Lane Vocabulary v1.4 — Kyle's canonical terms. Update this when new concepts cross 3+ lanes. v1.4 added Acceptance Checklist and formalized the sub-format pattern.*
