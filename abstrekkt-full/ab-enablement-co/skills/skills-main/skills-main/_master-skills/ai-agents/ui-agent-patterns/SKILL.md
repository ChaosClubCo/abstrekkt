---
name: ui-agent-patterns
description: Helps configure and build ui agent patterns processes. Patterns for delegating UI work to specialized agents. Covers synthesis-master vs specialized agents, multi-agent UI generation workflows, and orchestration strategies for complex UI tasks. Use when configuring, building, or troubleshooting AI agent workflows.
---

# UI Agent Patterns

## Instructions


Patterns for orchestrating AI agents to generate, refine, and maintain user interfaces. This skill bridges Karpathy's "new programming vocabulary" with practical UI/UX development workflows.

---

## When to Use This Skill

- Delegating complex UI generation to specialized agents
- Deciding between synthesis-master vs specialized agent architectures
- Orchestrating multi-agent workflows for design systems
- Managing handoffs between research, design, and implementation agents
- Building agent pipelines for iterative UI refinement
- Scaling UI generation beyond single-agent capabilities

---

## Core Concepts

### The New Programming Vocabulary

Karpathy's insight: LLMs introduce new programming primitives that extend beyond functions and objects:

| Primitive | Description | UI Application |
|-----------|-------------|----------------|
| **Agents** | Autonomous LLM-powered workers | UI generators, reviewers, refiners |
| **Subagents** | Delegated specialists | Component builders, accessibility checkers |
| **Prompts** | Instructions as code | Design specifications, component contracts |
| **Contexts** | Shared state and knowledge | Design tokens, brand guidelines |
| **Memory** | Persistent learning | Style preferences, past decisions |
| **Modes** | Behavioral configurations | Draft mode, production mode, audit mode |
| **Permissions** | Capability boundaries | Read-only review vs code modification |
| **Tools** | External capabilities | Figma API, browser DevTools, screenshot capture |
| **Plugins** | Modular extensions | Design system loaders, component libraries |
| **Skills** | Reusable knowledge | This file - codified expertise |
| **Hooks** | Lifecycle interceptors | Pre-commit design checks, post-render audits |
| **MCP** | Model Context Protocol | Tool integration standard |
| **Workflows** | Orchestrated sequences | Design-to-code pipelines |

---

## Agent Architecture Patterns

### Pattern 1: Synthesis-Master Architecture

A single powerful agent handles the full UI generation task.

**When to Use**:
- Simple, well-defined UI tasks
- Tight coupling between decisions
- Speed is critical
- Context window sufficient for entire task

**Structure**:
```
[User Request]
      |
      v
+------------------+
|  Synthesis-Master |
|  (Full Context)  |
+------------------+
      |
      v
[Complete UI Output]
```

**Implementation**:
```python
class SynthesisMasterAgent:
    """
    Single agent handling all UI generation aspects.
    Best for: Landing pages, simple forms, atomic components
    """

    def __init__(self, model: str = "claude-sonnet-4-5-20250929"):
        self.context = {
            "design_tokens": load_design_tokens(),
            "brand_guidelines": load_brand_context(),
            "component_library": load_component_docs(),
            "accessibility_rules": load_a11y_rules(),
        }

    async def generate(self, request: UIRequest) -> UIOutput:
        prompt = f"""
        You are a senior UI engineer and designer. Generate a complete,
        production-ready component based on this request.

        Context:
        - Design Tokens: {self.context['design_tokens']}
        - Brand Guidelines: {self.context['brand_guidelines']}

        Request: {request.description}

        Output requirements:
        1. React/TypeScript component
        2. Tailwind CSS styling
        3. Accessibility attributes
        4. Responsive breakpoints
        5. Dark mode support
        """

        return await self.model.generate(prompt)
```

**Advantages**:
- Simpler orchestration
- No handoff overhead
- Consistent voice/style
- Lower latency

**Disadvantages**:
- Context window limits
- Single point of failure
- Hard to scale complexity
- No specialized expertise

---

### Pattern 2: Specialized Agent Swarm

Multiple specialized agents collaborate on UI tasks.

**When to Use**:
- Complex design systems
- Tasks requiring different expertise
- Parallel processing beneficial
- Quality through specialization

**Structure**:
```
[User Request]
      |
      v
+------------------+
|   Orchestrator   |
+------------------+
      |
      +-----------------+----------------+----------------+
      |                 |                |                |
      v                 v                v                v
+----------+     +----------+     +----------+     +----------+
| Research |     |  Design  |     |   Code   |     |  Review  |
|  Agent   |     |  Agent   |     |  Agent   |     |  Agent   |
+----------+     +----------+     +----------+     +----------+
      |                 |                |                |
      v                 v                v                v
  [Context]        [Wireframe]      [Component]       [Audit]
```

**Specialized Agent Definitions**:

```python
# Agent 1: Research Agent
class UIResearchAgent:
    """
    Gathers context and prior art before design begins.
    """

    permissions = ["read_codebase", "search_web", "read_figma"]

    async def research(self, request: UIRequest) -> ResearchContext:
        return {
            "existing_patterns": await self.find_similar_components(),
            "competitive_analysis": await self.analyze_competitors(),
            "user_research": await self.gather_user_insights(),
            "technical_constraints": await self.identify_constraints(),
        }

# Agent 2: Design Agent
class UIDesignAgent:
    """
    Produces design specifications and wireframes.
    """

    permissions = ["generate_images", "access_design_tokens"]

    async def design(self, context: ResearchContext) -> DesignSpec:
        return {
            "layout": await self.generate_layout(),
            "spacing": await self.calculate_spacing(),
            "typography": await self.select_typography(),
            "colors": await self.derive_color_scheme(),
            "interactions": await self.define_interactions(),
        }

# Agent 3: Implementation Agent
class UIImplementationAgent:
    """
    Translates designs into production code.
    """

    permissions = ["write_code", "access_component_library"]

    async def implement(self, spec: DesignSpec) -> CodeOutput:
        return await self.generate_component(
            framework="react",
            styling="tailwind",
            typescript=True,
            spec=spec
        )

# Agent 4: Review Agent
class UIReviewAgent:
    """
    Audits output for quality, accessibility, and standards.
    """

    permissions = ["read_code", "run_tests", "access_browser"]
    mode = "audit"  # Read-only, cannot modify

    async def review(self, code: CodeOutput) -> ReviewReport:
        return {
            "accessibility": await self.audit_a11y(),
            "performance": await self.audit_performance(),
            "design_fidelity": await self.compare_to_spec(),
            "code_quality": await self.lint_and_analyze(),
        }
```

---

### Pattern 3: Hierarchical Delegation

Master agent delegates to subagents for specific subtasks.

**When to Use**:
- Complex pages with many components
- Need for parallel component generation
- Different components require different expertise

**Structure**:
```
[User Request: "Create a dashboard"]
             |
             v
    +------------------+
    |   Master Agent   |
    | (Task Planning)  |
    +------------------+
             |
    +--------+--------+--------+
    |        |        |        |
    v        v        v        v
[Header] [Sidebar] [Charts] [Tables]
Subagent Subagent Subagent Subagent
    |        |        |        |
    v        v        v        v
  [JSX]    [JSX]    [JSX]    [JSX]
             |
             v
    +------------------+
    |   Master Agent   |
    |  (Integration)   |
    +------------------+
             |
             v
     [Complete Dashboard]
```

**Implementation**:
```python
class HierarchicalUIOrchestrator:
    """
    Master agent that delegates to specialized subagents.
    """

    def __init__(self):
        self.subagents = {
            "header": HeaderComponentAgent(),
            "sidebar": SidebarComponentAgent(),
            "charts": DataVisualizationAgent(),
            "tables": DataTableAgent(),
            "forms": FormBuilderAgent(),
        }

    async def generate_page(self, request: PageRequest) -> PageOutput:
        # Step 1: Plan the page structure
        plan = await self.plan_page_structure(request)

        # Step 2: Delegate component generation in parallel
        component_tasks = []
        for component in plan.components:
            agent = self.subagents[component.type]
            task = agent.generate(component.spec)
            component_tasks.append(task)

        components = await asyncio.gather(*component_tasks)

        # Step 3: Integrate components into cohesive page
        page = await self.integrate_components(components, plan.layout)

        # Step 4: Final coherence review
        return await self.ensure_coherence(page)

    async def plan_page_structure(self, request: PageRequest) -> PagePlan:
        """
        Master agent determines page structure and delegation.
        """
        prompt = f"""
        Analyze this page request and create a component breakdown:

        Request: {request.description}

        For each component, specify:
        1. Component type (header, sidebar, chart, table, form, etc.)
        2. Component requirements
        3. Data dependencies
        4. Layout position

        Return as structured JSON.
        """
        return await self.model.generate(prompt, format="json")
```

---

## Multi-Agent Workflow Patterns

### Workflow 1: Design-to-Code Pipeline

Sequential workflow from design intent to production code.

```python
class DesignToCodePipeline:
    """
    Complete workflow from natural language to deployed UI.
    """

    stages = [
        ("interpret", InterpretationAgent()),    # NL -> Design Intent
        ("design", DesignAgent()),               # Intent -> Wireframe
        ("specify", SpecificationAgent()),       # Wireframe -> Spec
        ("implement", ImplementationAgent()),    # Spec -> Code
        ("review", ReviewAgent()),               # Code -> Audit
        ("refine", RefinementAgent()),           # Audit -> Final Code
    ]

    async def run(self, request: str) -> CodeOutput:
        context = {"request": request}

        for stage_name, agent in self.stages:
            result = await agent.process(context)
            context[stage_name] = result

            # Allow early exit on critical issues
            if result.has_blocking_issues:
                return self.handle_blocker(stage_name, result)

        return context["refine"]
```

### Workflow 2: Iterative Refinement Loop

Agent loop that refines UI through multiple passes.

```python
class IterativeRefinementWorkflow:
    """
    Generate -> Review -> Refine loop until quality threshold met.
    """

    def __init__(self, max_iterations: int = 5):
        self.generator = UIGeneratorAgent()
        self.reviewer = UIReviewerAgent()
        self.refiner = UIRefinerAgent()
        self.max_iterations = max_iterations
        self.quality_threshold = 0.85

    async def run(self, request: UIRequest) -> RefinedOutput:
        # Initial generation
        current = await self.generator.generate(request)

        for iteration in range(self.max_iterations):
            # Review current version
            review = await self.reviewer.review(current)

            # Check if quality threshold met
            if review.score >= self.quality_threshold:
                return current

            # Refine based on feedback
            current = await self.refiner.refine(
                current=current,
                feedback=review.feedback,
                priority=review.critical_issues
            )

        # Return best effort after max iterations
        return current
```


## References
- `references/modes-and-permissions.md` — Modes and Permissions
- `references/references.md` — References
- `references/workflow-3-parallel-variant-generation.md` — Workflow 3: Parallel Variant Generation
