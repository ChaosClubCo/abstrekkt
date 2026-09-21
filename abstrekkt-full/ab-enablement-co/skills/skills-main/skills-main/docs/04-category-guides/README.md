# Category Guides

The Skills Library organizes 513 master skills across six categories. Each category targets a distinct domain of professional work, from engineering and design to business strategy and industry-specific operations. This directory contains a detailed guide for each category, including subcategory breakdowns, skill tables, usage recommendations, and example workflows.

## Category Overview

| Category | Count | Description | Typical Users |
|----------|------:|-------------|---------------|
| [ai-agents](ai-agents.md) | 232 | AI agent workflows, infrastructure, security, marketing, data, finance, content, and e-commerce automation | AI engineers, DevOps engineers, marketers, data engineers, creative producers |
| [technical](technical.md) | 130 | Software development, testing, DevOps, architecture, databases, documentation, and code quality | Software engineers, frontend/backend developers, QA engineers, technical writers |
| [strategy](strategy.md) | 59 | Business planning, analytics, customer management, HR, compliance, project management, and marketing strategy | Product managers, business analysts, executives, project managers, marketing leads |
| [creative](creative.md) | 40 | Visual design, motion graphics, UX research, content creation, and production workflows | Designers, animators, UX researchers, content creators, brand managers |
| [operations](operations.md) | 27 | Process automation, supply chain, incident management, compliance, vendor and release management | Operations managers, IT managers, procurement leads, compliance officers |
| [industry](industry.md) | 25 | Vertical-specific guidance for healthcare, fintech, manufacturing, logistics, energy, and more | Industry specialists, compliance officers, operations managers, consultants |

**Total: 513 master skills**

## How Categories Are Assigned

Each skill lives in exactly one category directory under `_master-skills/`. The category is determined by the skill's primary domain:

- **ai-agents** -- Skills designed for configuring, building, or troubleshooting AI agent workflows. This is the largest category because it includes agent-oriented versions of skills spanning infrastructure, security, marketing, data, finance, and creative domains. The unifying thread is that each skill is structured to support an AI agent performing or assisting with the work.
- **technical** -- Skills focused on building, debugging, or optimizing technical implementations. Covers the full software development lifecycle from architecture through deployment. These skills assume a human or AI developer working directly on code, infrastructure, or technical systems.
- **strategy** -- Skills for planning, analyzing, or developing business strategies. Covers high-level decision-making frameworks and organizational management. These skills provide frameworks, templates, and methodologies rather than hands-on implementation guidance.
- **creative** -- Skills for designing, creating, or reviewing creative deliverables. Focused on visual design, motion, UX writing, and production output. These skills assume a creative professional or AI assistant producing design assets.
- **operations** -- Skills for managing, optimizing, or automating operational workflows. Covers the day-to-day mechanics of running a business. These skills focus on process efficiency, compliance, and workflow orchestration.
- **industry** -- Skills for navigating industry-specific regulations, processes, or operations. Each skill maps to a specific vertical market. These skills provide domain expertise that generic categories cannot cover.

## Cross-Category Patterns

Some skill slugs appear in multiple categories with different orientations. For example:

- `inventory-management` exists in both **ai-agents** (agent workflow focus) and **operations** (operational workflow focus)
- `vendor-management` exists in both **strategy** (strategic planning focus) and **operations** (process automation focus)
- `packaging-design` exists in both **ai-agents** (agent workflow focus) and **creative** (design deliverable focus)
- `podcast-production` exists in both **ai-agents** (agent workflow focus) and **creative** (production deliverable focus)

These are distinct skills with different content, not duplicates. The pipeline handles them using a `{category}--{slug}` deduplication prefix during cross-platform conversion. There are five known collision groups that require this prefix.

## Category Size Distribution

```
ai-agents   ████████████████████████████████████████████████  232  (45.2%)
technical   ███████████████████████████                       130  (25.3%)
strategy    ████████████                                       59  (11.5%)
creative    ████████                                           40  ( 7.8%)
operations  ██████                                             27  ( 5.3%)
industry    █████                                              25  ( 4.9%)
```

The ai-agents category is intentionally the largest. Many business domains (marketing, finance, design) have both a "do the work" skill in their natural category and an "agent that does the work" variant in ai-agents.

## Choosing the Right Category

When selecting a skill, consider your primary goal:

| If you want to... | Start with | Example Skills |
|-------------------|------------|----------------|
| Build an AI agent or automation pipeline | [ai-agents](ai-agents.md) | ai-agents-workflow, mcp-builder, langchain-architecture |
| Write, test, or deploy code | [technical](technical.md) | api-design-principles, testing-strategies, terraform-iac-deployment |
| Plan a business initiative or analyze metrics | [strategy](strategy.md) | strategic-planning, kpi-frameworks, go-to-market |
| Design a visual asset or user experience | [creative](creative.md) | ui-design, accessibility-core, brand-systems |
| Automate or optimize a business process | [operations](operations.md) | business-process-automation, workflow-orchestration, vendor-management |
| Work within a specific regulated industry | [industry](industry.md) | healthcare-compliance, fintech-operations, aviation-safety |

## Common Multi-Category Combinations

Many real-world projects require skills from multiple categories. Here are common pairings:

| Project Type | Primary Category | Supporting Categories |
|-------------|-----------------|----------------------|
| SaaS product development | technical | strategy (product-strategy, saas-metrics), creative (ui-design) |
| AI agent deployment | ai-agents | technical (testing-strategies), operations (release-management) |
| New market entry | strategy | industry (vertical-specific), operations (compliance-monitoring) |
| Design system rollout | creative | technical (design-system-builder), operations (creative-review) |
| Compliance program | strategy | industry (vertical-specific), operations (compliance-monitoring) |

## Skill Format

Every skill follows the same SKILL.md format regardless of category:

```yaml
---
name: skill-display-name
description: What it does and when to use it
---
```

Followed by markdown sections:

1. **Overview** -- What the skill does and why it matters
2. **When to Use** -- Trigger conditions and use cases
3. **Core Processes** -- Step-by-step workflows and procedures
4. **Tools and Templates** -- Reusable assets, checklists, and templates
5. **Metrics** -- How to measure success
6. **Common Pitfalls** -- Mistakes to avoid
7. **Integration Points** -- How this skill connects to others

## Related Documentation

- [Getting Started](../01-getting-started/) -- Installation and first-use guides
- [Platform Guides](../02-platform-guides/) -- Platform-specific deployment details
- [Role Guides](../03-role-guides/) -- Skills organized by job function
- [Skill Catalog](../05-skill-catalog/) -- Complete searchable index
- [Admin Guide](../06-admin-guide/) -- Pipeline, scripts, and maintenance
- [Skill Format Spec](../SKILL_FORMAT_SPEC.md) -- Authoring reference for SKILL.md files
- [Architecture](../ARCHITECTURE.md) -- System architecture and data flow
