# Changelog

All notable changes to the Skills Library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-16

### Added
- 507 master skills across 6 categories (ai-agents, technical, strategy, creative, operations, industry)
- Multi-platform output generation for Claude, Gemini, GitHub Copilot, and OpenAI Codex
- 15 platform-specific output variants
- 18 curated bundles across Gemini (7), Copilot (6), and Codex (5)
- 3-stage pipeline: Quality Fixes, Conversion, Population
- 6 shared libraries (config, parser, validator, enricher, tuning, logger)
- UniversalAdapters JS layer for runtime cross-platform conversion
- 60+ documentation pages across 9 organized sections
- Per-platform deployment guides for all 4 platforms
- Role-based guides for 7 user personas
- 5 tutorials (create skill, run pipeline, customize, create bundle, debug)
- Skill validation system with scoring (0-100)
- CLI flags: --dry-run, --verbose, --stats across all scripts
- PyYAML fallback with regex parsing
- MIT License

### Infrastructure
- pyproject.toml with dev dependencies (pytest, ruff, black)
- GitHub Actions CI (test + lint workflows)
- Pre-commit hook configuration
- pytest integration test suite
- CONTRIBUTING.md with contributor workflow
- GitHub issue and PR templates
