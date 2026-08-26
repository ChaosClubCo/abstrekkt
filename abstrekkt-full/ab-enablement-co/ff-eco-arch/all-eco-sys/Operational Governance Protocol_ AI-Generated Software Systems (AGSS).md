### Operational Governance Protocol: AI-Generated Software Systems (AGSS)

##### 1\. Strategic Foundation: The Shift to Verification Engineering

This protocol formalizes the mandatory transition from manual code authoring to "verification engineering." In the current industrial landscape, AI-driven implementation yields a 55% gain in speed but introduces a 45% risk of security flaws. Consequently, all source code SHALL be treated as a disposable build artifact rather than a human-authored asset. Engineering effort MUST migrate from writing logic to the higher-order task of defining intent and enforcing automated gates.The strategic foundation of AGSS rests upon four core pillars of human-authored input:

* **Executable Specifications:**  Machine-readable requirements and acceptance criteria that serve as the definitive source of truth.  
* **Test Intent:**  The definition of invariants, properties, and golden outputs that define "correct" behavior independent of implementation.  
* **Policies:**  Overarching security, compliance, and release rules that govern the entire system lifecycle.  
* **Skills:**  Structured markdown instruction sets that dictate how agents perform tasks, utilize tools, and generate evidence.**Defensible Framing:**  The removal of manual line-by-line review in favor of automated gate enforcement is a prerequisite for scale. This protocol relocation ensures that engineering rigor is applied to the architecture of skills and the integrity of the evidence pipeline, rather than the manual maintenance of ephemeral source files.This conceptual shift is operationalized through the mechanical structure of the Multi-Agent Compiler Stack.

##### 2\. The Multi-Agent Compiler Stack: Roles and Responsibilities

Software generation MUST be managed as a stateful, distributed system, contrasting with non-deterministic chat-based interactions. The system SHALL operate as a compiler toolchain where inputs are versioned and outputs are reproducible.| Role Name | Primary SDLC Function | Critical Output || \------ | \------ | \------ || **Spec Agent** | Requirements Normalization | Normalized specification bundle || **Planner** | Architecture Design | Actionable build plan and dependency map || **Coder** | Source Implementation | Source files (stored in /src.generated/) || **Test Agent** | Quality Assurance | Unit, integration, and property tests || **Runner/Debugger** | Build & Repair | Execution logs and automated patches || **Reviewer** | Standards Enforcement | Compliance and quality reports || **Security Agent** | Threat Modeling | Vulnerability scans and threat deltas || **Release Agent** | Deployment Preparation | SBOMs, signatures, and SLSA provenance |  
To ensure auditability and mitigate stochastic risk, the architecture MUST adhere to three mandates:

1. **Input Versioning:**  All spec bundles, skill packs, and model configurations MUST be versioned.  
2. **Bundle Hashing:**  Every input bundle SHALL be hashed to ensure generation is a pure, auditable function.  
3. **Idempotency:**  Identical inputs and skills MUST produce identical artifacts; the system SHALL skip work if no changes are detected in the hash.This stack operates according to a formal standard for Skill-driven authoring.

##### 3\. Skill-Driven Protocol: Standards for Agent Constraints

Governance is achieved by writing "Skills" (structured Skill.md files) rather than procedural code. Skills define the behavior, tools, and evidence requirements for every agent in the stack.

###### *Standardized Skill Specification Template*

\#\#\# SKILL.md \- \[Agent Name\]  
\#\#\#\# Role  
\[Authoritative description of the agent's purpose\]  
\#\#\#\# Inputs  
\* \[Required data/artifacts from previous agents\]  
\#\#\#\# Outputs  
\* \[Specific artifacts or signals to be produced\]  
\#\#\#\# Constraints  
\* \[Non-negotiable rules and boundaries for agent behavior\]  
\#\#\#\# Success Criteria  
\* \[Measurable metrics or conditions for a successful run\]  
\#\#\#\# Failure Protocol  
\* \[Specific instructions for error handling and agent hand-offs\]

Based on source requirements, specific agents MUST adhere to high-impact constraints:**Planner Agent Logic:**

* **Constraint:**  Must reference existing Architecture Decision Records (ADRs) and never contradict them.  
* **Failure Protocol:**  If scope exceeds defined complexity thresholds, the agent MUST split the task into sub-plans or request human approval.**Coder Agent Logic:**  
* **Directory Restriction:**  All generated code MUST reside exclusively in the /src.generated/ directory.  
* **Header Mandate:**  Every file MUST include a "Generated \- DO NOT EDIT" header.  
* **Atomic Limits:**  Files SHALL NOT exceed 300 lines; larger implementations MUST be split.These instructions bridge the gap between intent and the rigorous testing required to validate the output.

##### 4\. Verification Framework: Anti-Gaming and Quality Enforcement

To mitigate the "Benchmark Illusion"—where agents produce code that passes shallow tests while failing to fix underlying issues—the verification framework MUST be intent-focused and multi-layered.Mandatory testing layers include:

* **Unit Tests:**  Local functional correctness.  
* **Integration Tests:**  Module wiring and runtime behavior.  
* **Property-based Testing (Hypothesis):**  Validation of invariants against  **null, boundary, type coercion, and concurrency**  scenarios.  
* **Fuzzing:**  Identification of security boundary issues and edge cases.  
* **Golden Tests:**  Locking down specific behaviors to prevent regression.**Anti-Gaming Rules for the Test Agent:**  Tests SHALL assert  **SPEC INTENT**  only. The Test Agent is strictly forbidden from generating tests that merely assert implementation details (e.g., "function returns what it returns").**Success Criteria:**  
* **100% Traceability:**  100% of acceptance criteria MUST be mapped to an automated test.  
* **Input Diversity:**  Property tests SHALL generate a minimum of 100 inputs per run.This functional verification serves as the prerequisite for the critical layer of security policy enforcement.

##### 5\. Security Agent Constraints and Threat Modeling

Security is a zero-tolerance gate within the agentic loop. It SHALL NOT be a post-build checkbox but an explicit constraint that halting the pipeline upon any violation.The  **Security Agent Skill**  MUST integrate the following tools:

* **CodeQL:**  Static Analysis Security Testing (SAST).  
* **OSV-Scanner:**  Identification of vulnerabilities in third-party dependencies.**Zero-Tolerance Policy:**| Finding Class | Mandatory Response || \------ | \------ || **Critical/High CVE** | **SECURITY\_BLOCK**  (Pipeline Halt) || **Hardcoded Secret** | **SECURITY\_BLOCK**  (Pipeline Halt) || **Medium Vulnerability** | Generate Fixes & Trigger Coder Re-generation || **Threat Model Delta** | Flag for Human-in-the-Loop (HITL) Review |

Once security gates are cleared, the system proceeds to package the necessary evidence for the software supply chain.

##### 6\. Supply Chain Integrity: SBOMs and Provenance

In accordance with NIST mandates, evidence MUST be generated in real-time during the build process. Retroactive evidence generation is strictly prohibited for "Build Level 3" compliance.**The Release Sequence:**| Step | Tool | Output || \------ | \------ | \------ || **Build Artifact** | Project Builder | Deployable package || **Generate SBOM** | **Syft** | SPDX and CycloneDX formats || **Scan SBOM** | **Trivy** | Vulnerability and License report || **Sign Artifact** | **Cosign** | Keyless signature and certificate || **Provenance** | **SLSA Generator** | Build Level 3 attestation |  
**Compliant Release Metadata:**  Release metadata MUST be stored within the SLSA provenance and the Release Agent's event log. This SHALL include input hashes, skill versions, model configurations, and all gate results.If any stage of this integrity check fails, the protocol transitions to deterministic recovery.

##### 7\. Failure Protocols and Deterministic Recovery

Failure Protocols replace traditional retry logic by wiring agent loops together. When an agent fails its success criteria, it MUST trigger a specific response from the stack.**Failure Response Matrix:**| Failure Type | Triggered Agent/Action || \------ | \------ || **Ambiguous Spec** | Emit  **CLARIFICATION\_NEEDED** ; Halt || **Compilation Error** | Trigger Runner/Debugger for self-repair (Max 2 attempts) || **Security/Policy Block** | Emit  **SECURITY\_BLOCK** ; Escalate to Human Review || **License Conflict** | Halt; Escalate to Legal Review || **Test/Golden Drift** | Flag for Human-in-the-Loop (HITL) Review |  
**HITL Triggers:**  The automated loop MUST halt and escalate for human intervention when:

1. Critical security findings require manual validation.  
2. License conflicts are identified during the SBOM scan.  
3. Persistent compilation failures exceed the self-repair threshold.This structured approach to failure ensures a controlled environment for practical implementation.

##### 8\. Implementation Roadmap: The Incremental Migration Path

Organizations SHALL adopt the "Strangler Pattern" to migrate from manual codebases to 100% generated systems.

##### Phase 1: Boundary Establishment

Identify a vertical slice and establish a /src.generated/ directory. Implement CI gates to strictly forbid manual edits and establish golden tests to baseline legacy behavior.

##### Phase 2: Upstream Intent

Shift contract definitions to machine-readable formats (OpenAPI/Protobuf). Begin authoring skills for cross-cutting concerns such as authentication and logging.

##### Phase 3: Skill-Driven Repair

Enable the Failure Protocols to wire agent loops. Speed gains compound here as failures are automatically routed to Debugger or Planner agents without human oversight.

##### Phase 4: Governance Hardening

Integrate mandatory scanning, SBOM generation, and SLSA provenance into the Release Agent skill. Enforce a zero-tolerance policy for missing evidence.

##### Phase 5: Full Expansion

Continue replacing manual implementations behind stable interfaces until the /src.generated/ directory represents the entire codebase and legacy code is deleted.**The Bottom Line:**  The bottleneck of this transition is not model capability, but the quality of skill packs and the rigor of the evidence pipelines. Success is defined by the ability to prove the output is correct, secure, and compliant.**Legal and Quality Warning:**  AI outputs can be "strikingly similar" to existing open-source code and may carry "copyleft" license risks. Because the U.S. Copyright Office requires human authorship for registration, human authorial effort MUST be concentrated in the specification and skill-authoring phases to ensure both copyrightability and non-infringement.  
