# Outcome-Aware AI Systems — Part S: Master Index & Glossary
**Version:** 2.0 | **Date:** May 2026 | **Audience:** All readers — this is the navigation document for the full runbook

---

## Master Index

### Full Runbook Table of Contents

| Part | Title | Audience | Pages (est.) |
|------|-------|----------|-------------|
| **A** | Executive & Concept Runbook | Executives, managers, non-technical | ~9 |
| **B** | Technical Blueprint & Implementation | Staff engineers, architects | ~19 |
| **C** | Templates (JSON, SQL, Markdown) | Implementation teams, business users | ~9 |
| **D** | Adoption & Change Management | Program managers, team leads, HR | ~6 |
| **E** | Vendor & Platform Evaluation | CTOs, procurement, platform teams | ~7 |
| **F** | Non-Technical User Guide | All users — no technical background required | ~8 |
| **G** | Cost Modeling & ROI | Finance, executive sponsors, procurement | ~6 |
| **H** | Legal, Regulatory & Liability | Legal, compliance, risk | ~8 |
| **I** | Governance for Non-Technical Admins | Workspace admins, ops leads, compliance | ~9 |
| **J** | Multi-User Coordination & Delegation | Staff engineers, platform teams, admins | ~5 |
| **K** | Failure Recovery & Rollback State Machine | Staff engineers, SREs | ~6 |
| **L** | Model Versioning & Pattern-Model Compatibility | Staff engineers, MLOps | ~4 |
| **M** | OAuth Token Refresh & Adapter Registry | Staff engineers, integration engineers | ~6 |
| **N** | Cost Sensitivity & Productivity Paradox | Finance, executive sponsors, program managers | ~6 |
| **O** | Accessibility, Multimodal Input & i18n | Product teams, UX engineers, accessibility leads | ~6 |
| **P** | Enterprise Scale: SSO, Multi-Workspace, LMS | IT admins, enterprise architects, HR/L&D | ~6 |
| **Q** | Employment Law, IP Ownership & AI Insurance | Legal, HR, risk | ~6 |
| **R** | Bottlenecks: System & Organizational | All — engineers, program managers, admins, execs | ~8 |
| **S** | Master Index & Glossary | All readers | ~6 |
| **T** | Disaster Recovery & Business Continuity | SREs, IT, compliance, executive sponsors | ~6 |
| **U** | Air-Gapped & On-Prem Deployment | Enterprise architects, security, infrastructure | ~6 |
| **V** | Ethical AI, Feedback Loops & Responsible Use | All — product teams, legal, executives | ~6 |
| **W** | Platform Change Mgmt, Data Portability & Event-Driven Execution | Staff engineers, platform teams, admins | ~8 |

### Companion Documents

This runbook does not exist in isolation. Three other documents form the complete ecosystem:

| Document | What It Is | Relationship | Location |
|----------|-----------|-------------|----------|
| **`outcome-aware-mcp-combos-v0.1.md`** | Three co-validating combo specs: Outcome Receipts × Forgery Detector, Eval-as-MCP × Sycophancy Telemetry, Anti-Pattern Catalog × Maturity Model | **Implementation layer.** The combos spec defines *what to build* at the MCP code level. This runbook defines *how to operate* the system those combos power. They compose; they don't duplicate. | Project knowledge (this project) + GitHub: `outcome-aware-mcp` repo |
| **`outcome-aware-mcp` GitHub repo** | Production repo with README, THREAT_MODEL.md, JSON schemas (receipt, verdict, eval-result), and case study (msp-service-desk-l1.md) | **Code artifacts.** The schemas implement Combo 01 and 02 from the combos spec. The runbook's Part B database schema and Part C templates are at the platform layer above these MCP-level schemas. | GitHub: `Krosebrook/outcome-aware-mcp` |
| **`Intent_Based_Computing_Runbook.docx`** | Earlier IBN-specific dual-audience runbook (21 sections) | **Superseded.** Networking-domain-specific predecessor. Retained for historical reference on IBN content. This 23-part runbook is the canonical version for all domain-general outcome-aware AI systems. | Project knowledge (this project) — archived |

### Open Reconciliation: OTel-for-MCP

The combos spec (open question #1) flags: "Should Outcome Receipts harmonize with the OTel-for-MCP proposal as it evolves, or fork ahead with our own spec?"

Part B §11 (Observability) uses OpenTelemetry for platform-level instrumentation but does not address the MCP-specific OTel proposal ([discussion #269](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/269)).

**Status:** Unresolved. The runbook's OTel instrumentation and the combos spec's Receipt schema target different layers (platform vs. MCP tool call). They can coexist, but if the OTel-for-MCP proposal ships a standard agent-run-record schema, the Receipt schema should adopt compatible field names. Track this in the combos spec changelog.

---

### Reading Paths by Role

Not everyone should read all 23 parts. Use these paths:

**Executive Sponsor (C-suite, VP)**
> A → G → N → H (sections 1–3 only) → R (section 1 only)
> Time: ~2 hours

**Department Manager / Team Lead**
> A → D → F → I → R (sections 3, 5)
> Time: ~3 hours

**Non-Technical End User**
> F (complete) → D (modules 1–5 only)
> Time: ~1 hour

**Workspace Admin (Non-Technical)**
> I (complete) → P (sections 2, 5, 6, 7) → R (sections 3, 5) → T (section 5)
> Time: ~3 hours

**Staff Engineer / Platform Team**
> B → C → J → K → L → M → R (sections 2, 4) → T → U → W
> Time: ~8 hours

**Implementer (Building on the Combos Spec)**
> `outcome-aware-mcp-combos-v0.1.md` (full read) → repo schemas → B (architecture + event model) → M (adapters + OAuth) → K (rollback) → C (templates) → W §4 (event-driven execution)
> Time: ~6 hours

**Legal / Compliance**
> H (complete) → Q (complete) → I (sections 7–10) → V (sections 1–4)
> Time: ~4 hours

**Finance / Procurement**
> G → N → E → H (section 6 only)
> Time: ~2.5 hours

**HR / People Ops**
> D → F (HR quick start) → Q (sections 1–2, 5) → V (section 3)
> Time: ~2 hours

**Program Lead (Champion Coordinator)**
> D (complete) → I → P (sections 4–5) → R (sections 3, 5, 7) → V (section 5)
> Time: ~4 hours

---

### Section-Level Cross-Reference Index

#### Human Approval
- Architecture: B §Layer 8
- User-facing explanation: A §1.6, F §3–6
- Configuration: I §4
- Dual approval: I §4, J §6
- Async approval: J §4
- Delegation: J §3
- Auto-approval tradeoffs: R §Bottleneck 2
- Legal significance: H §5, Q §1

#### Audit Trail
- Schema: B §Part 6 (database)
- Query examples: C §6
- Admin reading guide: I §7
- Compliance requirements: H §2, H §7
- Immutability enforcement: B §Part 9
- Enterprise roll-up: P §6
- Gaps detection: R §Bottleneck 5

#### Patterns (Reusable Workflows)
- Architecture: B §Part 6 (patterns table)
- Template: C §4, §8
- User guide: F §8
- Admin curation: I §6
- Cross-workspace sharing: J §5, P §3
- Model compatibility: L §3
- Curation bottleneck: R §Bottleneck 6
- Migration/portability: W §3

#### Security
- Threat model: B §Part 9
- Credential management: M §2–5
- Prompt injection: B §Part 9
- Plan hash integrity: B §Part 9, K §3
- PII detection: B §Part 9
- Vendor access controls: P §7
- Insurance: Q §4

#### Cost & ROI
- Cost model: G §1–2
- ROI framework: G §3–5
- Worked example: G §5
- Sensitivity analysis: N §2
- Productivity paradox: N §3
- Switching costs: N §4
- Token forecasting: N §5
- Break-even: N §6
- Budget template: G §7

#### Adoption & Training
- Adoption model (3-stage): D §2
- Rollout phases: D §4
- Training curriculum: D §5
- LMS at scale: P §5
- Champion structure: D §4 (flat), P §4 (tiered)
- Resistance handling: D §7
- Success metrics: D §8

#### Legal & Compliance
- Data privacy (GDPR, CCPA): H §2
- AI regulation (EU AI Act): H §3
- Sector-specific (HIPAA, SOX, FERPA): H §4
- Employment law: Q §1–2
- IP ownership: Q §3
- Insurance: Q §4
- Vendor contracts: H §6
- Compliance checklist: H §7

#### Failure & Recovery
- Partial execution: K §1–3
- Rollback state machine: K §2
- Compensation by tool type: K §4
- Resume-from-failure: K §5
- Dead letter queue: K §6
- Disaster recovery: T (complete)

#### Accessibility & Internationalization
- WCAG 2.2 requirements: O §2
- Voice input: O §3
- Image/document input: O §4
- Non-English support: O §5
- Low digital literacy: O §6
- Mobile UX: O §7

---

## Glossary

### A

**AEDT (Automated Employment Decision Tool):** Software that uses AI to assist in hiring or promotion decisions. Regulated under NYC Local Law 144 and similar legislation.

**Agentic AI:** AI systems that can autonomously plan multi-step actions, use tools, and execute workflows — not just respond to prompts. Core concept underlying outcome-aware AI systems.

**Approval Gate:** A mandatory pause in the execution pipeline where a human must review and explicitly approve before the system proceeds. Two gates exist: plan approval (before execution) and output approval (before committing results).

### B

**BAA (Business Associate Agreement):** Contract required under HIPAA between a covered entity (e.g., hospital) and any vendor that processes Protected Health Information.

### C

**CCPA/CPRA (California Consumer Privacy Act / California Privacy Rights Act):** California data privacy law granting consumers rights over their personal information.

**Clarification Flow:** The system's process of asking targeted follow-up questions when a goal statement is ambiguous. Triggered when NLU confidence is below 0.7.

**Compensation (Saga Pattern):** The process of undoing completed steps in reverse order after a failure — the "rollback" in a multi-step workflow. Named after the saga pattern in distributed systems.

**Context Acquisition:** Layer 3 of the architecture — the system collects files, database records, and documents relevant to the user's goal, with explicit user permission.

### D

**Dead Letter Queue (DLQ):** A holding area for requests that cannot be completed, resumed, or fully rolled back. Requires manual admin resolution.

**Delegation:** Assigning another user the authority to approve a plan or output on your behalf. Used when the original user is unavailable.

**DPIA (Data Protection Impact Assessment):** Assessment required under GDPR before deploying AI systems that process personal data in high-risk contexts.

**DPA (Data Processing Agreement):** Contract between a data controller and data processor specifying how personal data will be handled. Required under GDPR.

### E

**Environment Detection:** Layer 4 of the architecture — the system identifies which tools are available, what permissions exist, and what constraints apply in the user's workspace.

**Execution Engine:** Layer 9 — the runtime that executes plan steps in order, logs every action, and pauses on unexpected conditions.

### F

**FedRAMP (Federal Risk and Authorization Management Program):** US government program that standardizes security assessment for cloud services used by federal agencies.

### G

**GDPR (General Data Protection Regulation):** EU/EEA data privacy regulation. The most demanding privacy standard globally; compliance with GDPR generally satisfies less stringent requirements.

**Goal Statement:** The natural language input a user provides describing their desired outcome. The starting point for every request.

**Golden Test Case:** A curated test case with a known-good plan and output, used for regression testing when the LLM model is updated.

### H

**Hallucination:** When the AI system generates information that is not supported by the source data — presents fabricated facts as real. A key risk requiring verification controls.

**HITL (Human-in-the-Loop):** Architecture pattern where a human reviews and approves AI outputs before they are applied. The approval gate is the HITL mechanism in this system.

### I

**Idempotency:** The property that running an operation multiple times produces the same result as running it once. Required for safe retry of execution steps.

**Integration:** A connection between the AI system and an external tool (Notion, Slack, Google Drive, etc.) via API credentials.

### J

**JIT Provisioning (Just-In-Time):** Automatic creation of a user account when someone authenticates via SSO for the first time, without requiring pre-registration.

### L

**LMS (Learning Management System):** Platform for delivering, tracking, and managing training content at scale (Docebo, Litmos, Workday Learning, etc.).

### M

**MCP (Model Context Protocol):** Anthropic's open standard for connecting AI models to external tools. Provides a standardized, auditable tool call interface.

### N

**NLU (Natural Language Understanding):** The AI's ability to extract structured meaning (goal, entities, constraints) from a natural language input.

### O

**OAuth 2.0:** Industry-standard authorization protocol. Used to connect the AI system to external tools without sharing user passwords.

**Outcome-Aware AI System:** A system where users express desired outcomes in natural language, and the AI interprets goals, detects context, plans execution, and acts with human oversight at every material decision point. The subject of this runbook.

### P

**Pattern:** A saved, reusable workflow template derived from a successful request. Parameterized — users fill in variables (client name, date range, role) and run it without re-planning.

**PII (Personally Identifiable Information):** Any data that could identify a specific individual — name, email, phone, SSN, address, etc. Subject to strict handling requirements.

**Plan Hash:** SHA-256 hash of the plan's step list, computed at generation and re-verified at execution start. Prevents tampering between approval and execution (TOCTOU protection).

**Productivity Paradox:** The phenomenon where automation tools increase total time spent on tasks despite making individual steps faster, due to scope creep, perfectionism, or over-automation.

### R

**Resource Lock:** A temporary exclusive hold on an external resource (database, file, channel) during execution, preventing concurrent writes from conflicting.

**RLS (Row-Level Security):** PostgreSQL feature that restricts which rows a user can read or modify. Used to enforce workspace isolation and audit log immutability.

**RPO (Recovery Point Objective):** The maximum acceptable amount of data loss measured in time. "RPO of 1 hour" means you can lose up to 1 hour of data.

**RTO (Recovery Time Objective):** The maximum acceptable downtime. "RTO of 4 hours" means the system must be restored within 4 hours.

### S

**Saga Pattern:** A design pattern for managing multi-step transactions in distributed systems. Each step has a compensating action (undo). If a step fails, previous steps are compensated in reverse order.

**SCCs (Standard Contractual Clauses):** EU-approved contractual framework for transferring personal data from the EU to non-EU countries.

**SCIM (System for Cross-domain Identity Management):** Protocol for automating user provisioning and deprovisioning between identity providers and applications.

**Shadow Mode:** A deployment strategy where a new model version runs in parallel, generating outputs that are compared but not served to users. Used for pre-production validation.

**SOC 2 (Service Organization Control Type 2):** Third-party audit standard verifying that a service provider securely manages data. Type 2 covers operational effectiveness over time.

**SSE (Server-Sent Events):** A web standard for pushing real-time updates from server to browser over HTTP. Used for streaming execution progress to the user.

### T

**TOCTOU (Time-of-Check to Time-of-Use):** A class of security vulnerability where the state checked at approval time differs from the state at execution time. The plan hash mechanism prevents this.

**Tool Adapter:** A module that implements a standard interface for connecting the AI system to a specific external tool. Each adapter handles authentication, validation, execution, and rollback for one tool.

### V

**Verification Engine:** Layer 10 — validates that execution output matches the stated goal, checks for hallucinations, and presents a diff view to the user.

### W

**WSJF (Weighted Shortest Job First):** A prioritization framework that divides the cost of delay by job size. Used to decide which bottleneck to fix first.

**Workspace:** An isolated tenant within the system. Contains its own users, integrations, patterns, and governance configuration. Typically maps to a department or business unit.

---

## Document Conventions

| Convention | Meaning |
|-----------|---------|
| **[SOURCED]** | Claim is traceable to a specific public source (cited in the local bibliography) |
| **[GENERATED]** | Claim is a reasoned estimate or synthesis by the author; not externally verified |
| **!** prefix in CONTRADICTIONS | Identifies a genuine tension between two parts of the runbook that requires a design decision |
| **CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS** footer | Appears at the end of every substantive part; evaluates the claims made in that part |
| **GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS** footer | Identifies known unknowns and areas outside the runbook's coverage |

---

## Version History

| Version | Date | Parts | Summary |
|---------|------|-------|---------|
| 1.0 | May 2026 | A–C | Initial release: executive, technical, templates |
| 2.0 | May 2026 | A–W | Full runbook: 23 parts covering architecture, adoption, governance, legal, accessibility, enterprise scale, bottlenecks, DR, ethics, portability |
| 2.1 | May 2026 | S (updated) | Added companion documents section, implementer reading path, OTel reconciliation note, cross-references to `outcome-aware-mcp-combos-v0.1.md` and GitHub repo |
