### The New Craft: A Beginner’s Guide to Skill Authoring

Welcome to the era of the  **Verification Engineer** . As a Senior Learning Architect, I am here to tell you that the best code you will ever ship is code you never actually wrote. In this new paradigm, we treat source code as what it truly is: a disposable build artifact. Your value is no longer found in the syntax you memorize, but in the boundaries you enforce and the intent you define.

#### 1\. The Great Shift: From Coding to Verification

The philosophy of "100% code generation" moves the human role upstream. You are no longer the manual laborer laying bricks; you are the architect defining the structural integrity of the building. In this world, the source tree is stamped "DO NOT EDIT," much like a generated API client. If the requirements change, you don't edit the code—you refine the specification and regenerate.| The Old Way (Writing Code) | The New Way (Writing Skills) || \------ | \------ || **Role:**  Software Engineer (The Author) | **Role:**  Verification Engineer (The Auditor) || **Artifact:**  Source Code (.py, .js, .cpp) | **Artifact:**  Executable Specifications (.md) || **Method:**  Manual if/else and loop logic | **Method:**  Defining Intent, Constraints, and Policies || **Maintenance:**  Debugging lines of code | **Maintenance:**  Refining instructions and evidence gates |  
**The Professional Insight:**  The code itself is a liability and a disposable byproduct. The  **specification**  is your true asset. Your job is to prove that the machine-generated solution is correct through rigorous governance and automated verification.**Transition:**  To exercise this new authority, you must learn to lead a specialized digital workforce rather than acting as a solo contributor.

#### 2\. The Agent Team: Your New Digital Workforce

Rather than treating AI as a "chat" interface—which is prone to hallucinations and unreliability—we utilize a  **Multi-Agent Compiler Stack** . Research shows that combining specialized agents with runtime execution information significantly improves functional reliability compared to single-agent workflows.

* **Spec Agent** : Normalizes raw, messy requirements into a clean, executable specification bundle.  
* **Planner** : Acts as the lead architect, designing the component boundaries and sequencing the build steps.  
* **Coder** : Generates the actual implementation files based strictly on the plan.  
* **Test Agent** : Generates layered test suites (unit, integration, property-based) to verify intent.  
* **Runner/Debugger** : Executes the build and provides the runtime feedback loop to propose patches for failures.  
* **Reviewer** : Evaluates the output against organizational quality standards and coding patterns.  
* **Security Agent** : Performs threat modeling and interprets scans to ensure zero-tolerance for vulnerabilities.  
* **Release Agent** : The final gatekeeper that packages the product with the necessary evidence and signatures.**Transition:**  These agents operate based on a standardized instruction format known as the  **SKILL.md**  file.

#### 3\. Anatomy of a Skill: The SKILL.md Framework

In this craft, the structure  *is*  the logic. By writing a structured Markdown document, you are "programming" the orchestrator without writing Python code. A Skill is a specification that any agent framework can execute.

* **Role** : Defines the agent’s professional identity and focus.  
* *Why it Matters:*  It prevents "context drift" by narrowing the agent's decision-making scope to a specific domain.  
* **Inputs** : Lists the explicit data required (e.g., spec bundles, ADRs).  
* *Why it Matters:*  This ensures the agent does not hallucinate context or operate on stale information.  
* **Outputs** : Defines the precise artifacts the agent must produce.  
* *Why it Matters:*  It standardizes the handoff between agents, making the pipeline modular and predictable.  
* **Constraints** : Strict "rules of the road" that cannot be broken.  
* *Why it Matters:*  This enforces organizational standards and prevents the AI from taking dangerous "shortcuts."  
* **Success Criteria** : A checklist of conditions that must be met for the work to be deemed complete.  
* *Why it Matters:*  It provides the Reviewer Agent with an objective rubric for verification.  
* **Failure Protocol** : Instructions for what to do when things go wrong.  
* *Why it Matters:*  It creates a self-healing loop that removes the need for manual human retries.**The Failure Protocol Insight**  The Failure Protocol is the "feedback loop" that wires the agent loop together. Instead of a human typing "try again," the protocol might state: "If compilation fails after 2 self-repairs, trigger the Debugger Agent." This replaces manual retry logic with automated, intent-based recovery.**Transition:**  To see this in action, we must look at how the Planner and Coder agents interact through their respective skills.

#### 4\. Deep Dive: The Planner and The Coder

The relationship between agents is a "Connected Thread" where the output of one serves as the input for the next, acting like passes in a compiler.| Skill Component | **Planner Agent** | **Coder Agent** || \------ | \------ | \------ || **Inputs** | Spec bundle & Existing ADRs | Architecture Plan & Build Step || **Outputs** | Architecture Plan & Dependency Map | Source files & Change Manifest || **Constraints** | Must never contradict existing ADRs | NEVER modify files outside /src.generated/ |  
**The Fundamental Rules of the Coder:**

* **Isolation:**  All generated work must live in a dedicated /src.generated/ directory. Humans are strictly forbidden from editing this directory.  
* **Traceability:**  Every file must include a "Generated \- DO NOT EDIT" header.  
* **Granularity Pro-Tip:**  Implement a strict "Max 300 lines per file" constraint. If the logic exceeds this, the Coder must be instructed to split the file, ensuring the code remains maintainable and reviewable by other agents.**Transition:**  Once the Coder generates the artifact, it must pass through the most critical phase of the lifecycle: the Quality Gates.

#### 5\. The Quality Gates: Testing, Security, and Release

In a 100% codegen environment, testing is not a checkbox; it is the product. We use specialized agents to ensure the AI hasn't "gamed" the system or introduced security debt.

##### The Test Agent: Asserting Intent

To prevent agents from writing code that merely passes a weak test, the Test Agent must follow these  **Anti-Gaming Rules** :

1. **Assert Spec Intent:**  Tests must verify what the code should do, not mirror how it was implemented.  
2. **Property-Based Testing:**  Use tools like  **Hypothesis**  to generate at least 100 random inputs (nulls, boundaries) to catch "hallucinated assumptions."  
3. **Fuzzing:**  Utilize  **libFuzzer**  or  **OSS-Fuzz**  to identify security boundary issues.  
4. **No Mirror Tests:**  Forbid any test that only asserts "the function returns what it returns."

##### The Security and Release Sequence

Security is a constant constraint. The Security Agent utilizes  **CodeQL**  for SAST and  **OSV-Scanner**  for dependencies, enforcing a policy pack aligned with OWASP standards. The Release Agent then generates  **Provenance** —evidence of the artifact's origin created at build time.| Step | Tool | Output || \------ | \------ | \------ || **Build Artifact** | Project Builder | Deployable Package || **Generate SBOM** | **Syft** | Software Bill of Materials (SPDX/CycloneDX) || **Scan SBOM** | **Trivy** | Vulnerability and License Report || **Sign Artifact** | **Cosign** | Digital Signature and Certificate || **Provenance** | **SLSA Generator** | Build Level 3 Attestation |  
**Legal & Copyright Warning:**  While AI providers may grant you ownership of the output, the  **U.S. Copyright Office**  currently requires human authorship for registration. Furthermore, model outputs can be "strikingly similar" to open-source code. You must define ownership of the  *skills*  and enforce attribution policies via your Security and Reviewer agents.**Transition:**  Moving to this model requires a disciplined roadmap to ensure governance maturity.

#### 6\. The Migration Path: Starting Your Skill Authoring Journey

Do not attempt a "big bang" migration. Follow this incremental 5-phase plan:

*   **Phase 1: Establish the Boundary.**  Pick one service, create a /src.generated/ folder, and enforce "no manual edits" in your CI/CD pipeline using an automated assertion tool.  
*   **Phase 2: Move Intent Upstream.**  Shift your data contracts to OpenAPI or Protocol Buffers. Write your first Coder skills to handle logging and pagination.  
*   **Phase 3: Introduce Skill-Driven Repair Loops.**  Wire the "Failure Protocol" between your Coder and Test agents so they begin fixing their own bugs.  
*   **Phase 4: Harden Governance.**  Integrate the Security and Release agents. Generate SBOMs and SLSA provenance for every build.  
*   **Phase 5: Expand.**  Use the "Strangler Pattern" to replace legacy manual code with skill-generated implementations until the entire codebase is generated.

##### Avoiding Common Failure Modes

* **Failure Mode: Test-gaming.**  
* *Pro-Tip:*  Bake the Anti-Gaming rules into the Test Agent skill and mandate property-based testing to catch edge cases the AI assumes don't exist.  
* **Failure Mode: Security Debt.**  
* *Pro-Tip:*  Set a zero-tolerance constraint for high-level vulnerabilities in the Security Agent skill; never let "AI speed" bypass your security policy pack.  
* **Failure Mode: Non-determinism.**  
* *Pro-Tip:*  Ensure "diffs" remain meaningful by  **locking your toolchains** , versioning your skill packs, and recording model metadata (like seeds) for every run.**The Bottom Line:**  The bottleneck in the industry is no longer the speed of generation. Models will continue to improve. The real bottleneck is your ability to write skills that constrain that generation and provide the evidence that the output is correct, secure, and legally sound.The teams that win this transition won't have the fastest typists; they will have the most robust  **skill packs and evidence pipelines** . Stop writing code. Start writing skills.

