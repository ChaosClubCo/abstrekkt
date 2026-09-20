# Changelog

All notable changes to SuperGem Prompt Router will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-19

### Added
- **System Prompt v2.0.0**: Production-locked router with strict role separation
- **10 Prefilled Templates**: Complete, zero-placeholder templates for common workflows
  - 01: Repo Audit (Production Readiness)
  - 02: Feature to PRD (MVP Scope Lock)
  - 03: API Contract (JSON Schemas)
  - 04: Database Schema (RLS Policies)
  - 05: Security Review (Threat Model)
  - 06: Performance Plan (Bottleneck Analysis)
  - 07: Test Strategy (CI Gate)
  - 08: UX Flow Audit (Friction Map)
  - 09: Incident Postmortem (Blameless)
  - 10: Agent Prompt Builder (Meta-prompting)
- **Reasoning Engine Routing**: 7 engines (ChainOfThought, TreeOfThoughts, SelfCriticism, ReActLoop, StepBack, FirstPrinciples, SkeletonOfThought)
- **Framework Selection**: 7 frameworks (CO-STAR, RISEN, RACE, TRACE, TAG, RTF, APES)
- **Output Format Control**: 5 modes (JSONOnly, Markdown, Concise, ELI5plusExpert, BLUF)
- **Multi-Template Support**: Generate multiple prompts in one session
- **ZIP Export**: Package multiple prompts for team distribution
- **Comprehensive Documentation**: README, QUICK_START, TEMPLATES_CATALOG, examples

### Security
- **No Secret Leakage**: All templates use placeholders for sensitive data
- **Least-Privilege Defaults**: All prompts assume secure-by-default
- **No Destructive Actions**: Templates include rollback steps for risky operations
- **Explicit Acceptance Criteria**: Every prompt includes "Output is correct if..."
- **CLAIMS CHECK**: Every prompt includes failure mode analysis

### Fixed
- **Role Drift Prevention**: Router never replaces downstream agent's role
- **Reasoning Leakage**: Internal reasoning never appears in output unless requested
- **Framework Collisions**: Separated routing logic from execution instructions
- **Placeholder Pollution**: All templates fully populated with realistic data

### Architecture
- **Strict Input/Output Contract**: Single input block → Routing card + Final prompt
- **Default Inference Rules**: Safe defaults when MODE SWITCHES not provided
- **Quality Gates**: Mandatory acceptance criteria, self-check, and CLAIMS CHECK
- **Artifact Boundaries**: Clear separation between routing and execution

### Documentation
- `README.md`: Comprehensive overview and usage guide
- `QUICK_START.md`: 5-minute tutorial with step-by-step instructions
- `TEMPLATES_CATALOG.md`: Complete template reference with selection guide
- `system_prompt.md`: Production-locked router system prompt
- `examples/`: Sample routing card and final prompt outputs
- `LICENSE`: MIT license
- `CHANGELOG.md`: This file

## [1.0.0] - 2024 (Deprecated)

### Issues (Resolved in v2.0.0)
- Router would sometimes execute tasks instead of compiling prompts
- Internal reasoning would leak into final prompts
- Framework selection was not transparent
- Templates contained placeholders
- No multi-template support
- No ZIP export capability

---

## Version Numbering

**MAJOR.MINOR.PATCH**

- **MAJOR**: Breaking changes to input/output contract
- **MINOR**: New templates, reasoning engines, or frameworks
- **PATCH**: Bug fixes, documentation updates, template refinements

---

## Upgrade Guide

### From v1.x to v2.0.0

1. **Replace System Prompt**: Copy `system_prompt.md` to your Gemini/AI Studio/Gem configuration
2. **Update Input Format**: Use new INPUT BLOCK structure with MODE SWITCHES
3. **Review Templates**: All templates now fully populated with realistic examples
4. **Test Routing**: Verify router outputs ROUTING CARD + FINAL PROMPT (not execution results)

---

## Roadmap

### Planned for v2.1.0
- [ ] 5 additional templates (mobile app audit, API migration, cost optimization, compliance review, architecture review)
- [ ] Custom framework support (user-defined frameworks)
- [ ] Batch mode (process multiple input blocks at once)
- [ ] Template validation (lint INPUT BLOCKS before routing)

### Planned for v2.2.0
- [ ] Interactive template builder (CLI tool)
- [ ] Template versioning (track changes to individual templates)
- [ ] Collaboration features (team template library)
- [ ] Integration tests (automated validation of compiled prompts)

### Planned for v3.0.0
- [ ] Agent execution layer (optional: router → executor in one tool)
- [ ] Memory system (learn from past routing decisions)
- [ ] Custom reasoning engine support (user-defined engines)
- [ ] Multi-agent orchestration (coordinate multiple executor agents)

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Bug Reports**: Include INPUT BLOCK, expected output, actual output
2. **Feature Requests**: Describe use case + why existing templates don't fit
3. **New Templates**: Must be fully populated, safe-by-default, <120 lines
4. **Documentation**: Clear, concise, with examples

---

## Support

For issues, questions, or feedback:
- Review `QUICK_START.md` for common scenarios
- Check `TEMPLATES_CATALOG.md` for template selection guidance
- Verify INPUT BLOCK includes all required sections
- Test with default MODE SWITCHES before customizing

---

## License

MIT License - See LICENSE file for details
