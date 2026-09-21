# INT Template Registry

This file tracks all available document templates. When a new template is added,
register it here so the skill knows to offer it during Phase 1.

## Available Templates

| Template | Spec File | Best For | Status |
|----------|-----------|----------|--------|
| Reference Guide | `reference-guide-spec.md` | How-to guides, onboarding docs, process references, technical documentation | ✅ Active |

## Planned Templates

| Template | Target Use Case | Status |
|----------|----------------|--------|
| SOP (Standard Operating Procedure) | Step-by-step procedures with roles & approvals | 🔲 Awaiting template |
| Runbook | Operational playbooks for incident response, deployments | 🔲 Awaiting template |
| Technical Report | Analysis, findings, recommendations for leadership | 🔲 Awaiting template |
| Project Brief | Project scope, timeline, resource planning | 🔲 Awaiting template |

## How to Add a Template

1. Provide the .docx template file
2. The skill will extract: headings, sections, placeholder fields, formatting rules
3. A new spec file is created at `references/[template-name]-spec.md`
4. The template is registered in this file
5. The skill automatically offers it as an option going forward

## Template Adaptation Rules

When no dedicated template exists for a requested document type, the Reference Guide
template is used as the base with section adaptations. See SKILL.md "Template Adaptation"
section for the mapping rules.
