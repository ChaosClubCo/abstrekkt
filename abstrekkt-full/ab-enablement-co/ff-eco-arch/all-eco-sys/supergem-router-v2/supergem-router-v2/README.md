# SuperGem Prompt Router & Compiler v2.0.0

**Production-Locked System for Gemini/AI Studio/Gems**

## Overview

SuperGem Prompt Router & Compiler is a specialized agent that transforms raw task descriptions into production-ready prompts for execution in Gemini, AI Studio, or custom Gems. It does **NOT** execute tasks—it compiles execution-ready prompts.

## Key Features

- **Reasoning Engine Selection**: ChainOfThought, TreeOfThoughts, SelfCriticism, ReActLoop, StepBack, FirstPrinciples, SkeletonOfThought
- **Framework Routing**: CO-STAR, RISEN, RACE, TRACE, TAG, RTF, APES
- **Output Format Control**: JSONOnly, Markdown, Concise, ELI5plusExpert, BLUF
- **10 Prefilled Templates**: Ready-to-use templates for common engineering workflows
- **Multi-Template Support**: Generate multiple prompts in one session
- **ZIP Export**: Package multiple prompts for team distribution

## Quick Start

### 1. Install the System Prompt

Copy `system_prompt.md` into your Gemini/AI Studio/Gem configuration.

### 2. Choose a Template

Browse the `/templates` directory and select a prefilled template that matches your task.

### 3. Paste and Customize

Copy the INPUT BLOCK from your chosen template, replace bracketed text with your actual data, and paste into the router.

### 4. Get Your Compiled Prompt

The router will output:
- **ROUTING CARD**: Selected engine/framework/format + rationale
- **FINAL PROMPT**: Copy-pasteable prompt ready for execution

## File Structure

```
supergem-router-v2/
├── README.md                          # This file
├── QUICK_START.md                     # Step-by-step tutorial
├── system_prompt.md                   # Main router system prompt
├── templates/
│   ├── 01_repo_audit.md              # Audit repo for production readiness
│   ├── 02_feature_to_prd.md          # Convert feature notes to PRD
│   ├── 03_api_contract.md            # Generate API contracts + schemas
│   ├── 04_database_schema.md         # Design database + RLS policies
│   ├── 05_security_review.md         # Security review + threat model
│   ├── 06_performance_plan.md        # Performance optimization plan
│   ├── 07_test_strategy.md           # Test strategy + CI gates
│   ├── 08_ux_flow_audit.md           # UX flow friction analysis
│   ├── 09_incident_postmortem.md     # Blameless incident postmortem
│   └── 10_agent_prompt_builder.md    # Build prompts for other agents
└── examples/
    ├── example_routing_card.md        # Sample routing card output
    └── example_final_prompt.md        # Sample final prompt output
```

## Usage Examples

### Example 1: Using a Prefilled Template

```
# Copy from templates/01_repo_audit.md
GOAL:
Audit the repository I provide, identify production gaps, and output a prioritized roadmap plus a PR-by-PR delivery plan with acceptance criteria.

CONTEXT:
- Platform: GitHub repo (Next.js app)
- Audience: senior engineering + product stakeholders
- Definition of done: can ship to real users with monitoring, security baseline, CI, and docs

CONSTRAINTS:
- No breaking changes unless explicitly flagged and justified
- Do not request secrets; propose env var names only
- Assume least-privilege and secure-by-default

INPUTS:
[Paste your README.md, package.json, folder tree here]

OUTPUT NEEDS:
- Markdown
- Sections: Executive summary; Risks; Gaps; Roadmap (WSJF if possible); PR plan; Acceptance criteria; Smoke tests; CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=TreeOfThoughts
- Framework=RISEN
- OutputFormat=Markdown
```

### Example 2: Custom Task (No Template)

```
GOAL:
Create a monitoring dashboard spec for our payment processing pipeline.

CONTEXT:
- Tech stack: Stripe webhooks + Supabase + Next.js
- Target: 1000 transactions/hour
- Users: internal ops team

CONSTRAINTS:
- Must show real-time status within 30 seconds
- No PII in logs or dashboards
- Budget: $100/month for monitoring tools

INPUTS:
Current architecture diagram: [paste]
Existing metrics: [paste]
Failed transaction logs: [paste]

OUTPUT NEEDS:
- Markdown
- Sections: Metrics to track; Dashboard layout; Alert thresholds; Integration plan; Cost estimate

MODE SWITCHES:
- ReasoningEngine=FirstPrinciples
- Framework=CO-STAR
- OutputFormat=Markdown
```

## Advanced Features

### Multi-Template Selection

Request multiple templates in one session:

```
Please compile prompts for:
1. Template 02 (Feature to PRD) with inputs: [...]
2. Template 05 (Security Review) with inputs: [...]
```

### ZIP Export

Request a ZIP package:

```
Please compile templates 01, 03, and 07 and package as ZIP.
```

The router will create:
```
supergem_export/
├── template_01_repo_audit/
│   ├── compiled_prompt.md
│   └── routing_card.md
├── template_03_api_contract/
│   ├── compiled_prompt.md
│   └── routing_card.md
└── template_07_test_strategy/
    ├── compiled_prompt.md
    └── routing_card.md
```

## Safety & Constraints

- **No secrets**: Router never outputs API keys or credentials
- **No destructive actions**: Prompts include rollback steps
- **Least-privilege**: All prompts assume secure-by-default
- **Explicit acceptance criteria**: Every prompt includes "Output is correct if…"
- **CLAIMS CHECK**: Every prompt includes failure mode analysis

## Failure Modes Prevented

✓ **Role drift**: Router never replaces downstream agent's role  
✓ **Reasoning leakage**: Internal reasoning never appears in output unless requested  
✓ **Framework collisions**: Separate routing logic from execution instructions  
✓ **Placeholder pollution**: All templates are fully populated  

## Version History

- **v2.0.0** (2025-01-19): Production-locked release
  - Separated routing from execution
  - Added 10 prefilled templates
  - Added multi-template and ZIP export support
  - Hardened safety constraints

## Support

For issues or questions:
1. Check `QUICK_START.md` for common scenarios
2. Review `examples/` directory for sample outputs
3. Verify your INPUT BLOCK includes all required sections

## License

MIT License - See LICENSE file for details
