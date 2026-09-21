import type { CommandDefinition } from '../domain/types.js';

/** Generated once from the human-facing v1 specification. This TypeScript registry is now authoritative. */
export const commandDefinitions = [
  {
    "index": 1,
    "id": "audit-codebase",
    "version": "1.0.0",
    "slash": "/audit-codebase",
    "title": "Audit the entire codebase",
    "category": "Engineering & Architecture",
    "aliases": [
      "audit-entire-codebase",
      "entire-codebase-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "inspect-repository",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit the entire codebase with evidence, risk-based prioritization, and reproducible verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Discover and baseline entry points, package boundaries, build and deployment paths; Inspect and correlate correctness, maintainability, tests, security, performance, documentation, and operations; then evaluate and rank severity, confidence, effort, blast radius, and dependency order.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "1. /audit-codebase"
    }
  },
  {
    "index": 2,
    "id": "refactor-codebase",
    "version": "1.0.0",
    "slash": "/refactor-codebase",
    "title": "Refactor the entire codebase",
    "category": "Engineering & Architecture",
    "aliases": [
      "refactor-entire-codebase",
      "entire-codebase-refactor"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "transform-code",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Refactor the entire codebase safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline entry points, package boundaries, build and deployment paths; Plan the smallest safe change to correctness, maintainability, tests, security, performance, documentation, and operations; then implement incrementally and compare severity, confidence, effort, blast radius, and dependency order.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "2. /refactor-codebase"
    }
  },
  {
    "index": 3,
    "id": "modernize-the-codebase",
    "version": "1.0.0",
    "slash": "/modernize-the-codebase",
    "title": "Modernize the codebase to current best practices",
    "category": "Engineering & Architecture",
    "aliases": [
      "modernize-codebase-current",
      "codebase-current-modernize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "modernize-dependencies",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Modernize the codebase to current best practices safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline actual framework, runtime, deployment, project stage, authoritative guidance, local decisions, and constraints; Plan the smallest safe change to required safety/correctness versus preference; then implement incrementally and compare documented justified deviations.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "3. /modernize-the-codebase"
    }
  },
  {
    "index": 4,
    "id": "upgrade-deprecated-apis",
    "version": "1.0.0",
    "slash": "/upgrade-deprecated-apis",
    "title": "Upgrade all deprecated APIs",
    "category": "Engineering & Architecture",
    "aliases": [
      "deprecated-apis-upgrade"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "modernize-dependencies",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Upgrade all deprecated APIs safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline compiler/runtime warnings and provider deprecation notices; Plan the smallest safe change to replacement semantics and compatibility windows; then implement incrementally and compare migration tests, deadlines, and intentionally retained exceptions.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "4. /upgrade-deprecated-apis"
    }
  },
  {
    "index": 5,
    "id": "eliminate-technical-debt",
    "version": "1.0.0",
    "slash": "/eliminate-technical-debt",
    "title": "Eliminate technical debt",
    "category": "Engineering & Architecture",
    "aliases": [
      "technical-debt-eliminate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "clean-code",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Eliminate technical debt safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline TODOs, workarounds, duplication, fragile areas, obsolete dependencies, and operational pain; Plan the smallest safe change to impact, urgency, effort, confidence, and enabling value; then implement incrementally and compare measurable reduction rather than cosmetic churn.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "5. /eliminate-technical-debt"
    }
  },
  {
    "index": 6,
    "id": "remove-dead-code",
    "version": "1.0.0",
    "slash": "/remove-dead-code",
    "title": "Remove dead code",
    "category": "Engineering & Architecture",
    "aliases": [
      "dead-code-remove"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "clean-code",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Remove dead code safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline static references, dynamic loading, routes, feature flags, telemetry, and Git history; Plan the smallest safe change to confirmed-dead versus conditional or externally consumed code; then implement incrementally and compare deletion manifests, build verification, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "6. /remove-dead-code"
    }
  },
  {
    "index": 7,
    "id": "detect-duplicate-implementations",
    "version": "1.0.0",
    "slash": "/detect-duplicate-implementations",
    "title": "Detect duplicate implementations",
    "category": "Engineering & Architecture",
    "aliases": [
      "duplicate-implementations-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "clean-code",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect duplicate implementations with evidence, risk-based prioritization, and reproducible verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Inventory and map syntactic, semantic, schema, validation, and workflow duplication; Detect and reproduce intentional variants versus accidental copies; then classify and prioritize canonical ownership, edge cases, and safe consolidation order.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "7. /detect-duplicate-implementations"
    }
  },
  {
    "index": 8,
    "id": "consolidate-duplicate-logic",
    "version": "1.0.0",
    "slash": "/consolidate-duplicate-logic",
    "title": "Consolidate duplicate logic",
    "category": "Engineering & Architecture",
    "aliases": [
      "duplicate-logic-consolidate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "clean-code",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Consolidate duplicate logic safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline syntactic, semantic, schema, validation, and workflow duplication; Plan the smallest safe change to intentional variants versus accidental copies; then implement incrementally and compare canonical ownership, edge cases, and safe consolidation order.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "8. /consolidate-duplicate-logic"
    }
  },
  {
    "index": 9,
    "id": "simplify-architecture",
    "version": "1.0.0",
    "slash": "/simplify-architecture",
    "title": "Simplify architecture",
    "category": "Engineering & Architecture",
    "aliases": [
      "architecture-simplify"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-architecture",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Simplify architecture safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline components, responsibilities, data flows, deployment units, trust boundaries, and failure modes; Plan the smallest safe change to dependency direction, critical paths, cycles, ownership, and change cost; then implement incrementally and compare logical, deployment, data-flow, and risk views.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "9. /simplify-architecture"
    }
  },
  {
    "index": 10,
    "id": "propose-a-cleaner-folder-structure",
    "version": "1.0.0",
    "slash": "/propose-a-cleaner-folder-structure",
    "title": "Propose a cleaner folder structure",
    "category": "Engineering & Architecture",
    "aliases": [
      "propose-cleaner-folder",
      "cleaner-folder-propose"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "normalize-structure",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Propose a cleaner folder structure using verified project evidence and a platform-agnostic execution contract.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Gather and normalize evidence for framework conventions, import rules, runtime boundaries, and ownership; Design and generate cohesion, discoverability, circular dependencies, and migration mapping; then review and validate target structure and compatibility-preserving move plan.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "10. /propose-a-cleaner-folder-structure"
    }
  },
  {
    "index": 11,
    "id": "split-oversized-files",
    "version": "1.0.0",
    "slash": "/split-oversized-files",
    "title": "Split oversized files",
    "category": "Engineering & Architecture",
    "aliases": [
      "oversized-files-split"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "normalize-structure",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Split oversized files safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline size, complexity, responsibility count, churn, and ownership; Plan the smallest safe change to natural seams such as domain logic, adapters, schemas, and side effects; then implement incrementally and compare imports, initialization order, cycles, and focused tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "11. /split-oversized-files"
    }
  },
  {
    "index": 12,
    "id": "merge-overly-fragmented-modules",
    "version": "1.0.0",
    "slash": "/merge-overly-fragmented-modules",
    "title": "Merge overly fragmented modules",
    "category": "Engineering & Architecture",
    "aliases": [
      "merge-overly-fragmented",
      "overly-fragmented-merge"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "normalize-structure",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Merge overly fragmented modules safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline single-consumer modules, pass-through exports, co-change, and coupling; Plan the smallest safe change to meaningful boundaries versus accidental fragmentation; then implement incrementally and compare api stability, navigation, bundle behavior, and cycles.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "12. /merge-overly-fragmented-modules"
    }
  },
  {
    "index": 13,
    "id": "normalize-naming-conventions",
    "version": "1.0.0",
    "slash": "/normalize-naming-conventions",
    "title": "Normalize naming conventions",
    "category": "Engineering & Architecture",
    "aliases": [
      "naming-conventions-normalize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "normalize-structure",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Normalize naming conventions safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline language, framework, domain, file, API, schema, route, and telemetry conventions; Plan the smallest safe change to ambiguous, misleading, inconsistent, and contract-bound names; then implement incrementally and compare reference-safe migration and compatibility aliases.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "13. /normalize-naming-conventions"
    }
  },
  {
    "index": 14,
    "id": "generate-an-architecture-report",
    "version": "1.0.0",
    "slash": "/generate-an-architecture-report",
    "title": "Generate an architecture report",
    "category": "Engineering & Architecture",
    "aliases": [
      "generate-architecture-report",
      "architecture-report-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate an architecture report using verified project evidence and a platform-agnostic execution contract.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Gather and normalize evidence for components, responsibilities, data flows, deployment units, trust boundaries, and failure modes; Design and generate dependency direction, critical paths, cycles, ownership, and change cost; then review and validate logical, deployment, data-flow, and risk views.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "14. /generate-an-architecture-report"
    }
  },
  {
    "index": 15,
    "id": "generate-dependency-diagrams",
    "version": "1.0.0",
    "slash": "/generate-dependency-diagrams",
    "title": "Generate dependency diagrams",
    "category": "Engineering & Architecture",
    "aliases": [
      "dependency-diagrams-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-graphs",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate dependency diagrams using verified project evidence and a platform-agnostic execution contract.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Gather and normalize evidence for direct/transitive packages, lockfiles, registries, containers, actions, provenance, install scripts, and licenses; Design and generate reachability, exposure, maintenance, and upgrade compatibility; then review and validate lockfile integrity and tested remediation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "15. /generate-dependency-diagrams"
    }
  },
  {
    "index": 16,
    "id": "identify-architectural-bottlenecks",
    "version": "1.0.0",
    "slash": "/identify-architectural-bottlenecks",
    "title": "Identify architectural bottlenecks",
    "category": "Engineering & Architecture",
    "aliases": [
      "architectural-bottlenecks-identify"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-architecture",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Identify architectural bottlenecks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Inventory and map the exact scope, inputs, outputs, dependencies, and current behavior; Detect and reproduce evidence, failure modes, edge cases, and project conventions; then classify and prioritize measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "16. /identify-architectural-bottlenecks"
    }
  },
  {
    "index": 17,
    "id": "recommend-design-patterns",
    "version": "1.0.0",
    "slash": "/recommend-design-patterns",
    "title": "Recommend design patterns",
    "category": "Engineering & Architecture",
    "aliases": [
      "design-patterns-recommend"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-architecture",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Recommend design patterns using verified project evidence and a platform-agnostic execution contract.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Gather and normalize evidence for the exact scope, inputs, outputs, dependencies, and current behavior; Design and generate evidence, failure modes, edge cases, and project conventions; then review and validate measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "17. /recommend-design-patterns"
    }
  },
  {
    "index": 18,
    "id": "remove-anti-patterns",
    "version": "1.0.0",
    "slash": "/remove-anti-patterns",
    "title": "Remove anti-patterns",
    "category": "Engineering & Architecture",
    "aliases": [
      "anti-patterns-remove"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "clean-code",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Remove anti-patterns safely, incrementally, and with measurable verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Measure and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Plan the smallest safe change to evidence, failure modes, edge cases, and project conventions; then implement incrementally and compare measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "18. /remove-anti-patterns"
    }
  },
  {
    "index": 19,
    "id": "detect-code-smells",
    "version": "1.0.0",
    "slash": "/detect-code-smells",
    "title": "Detect code smells",
    "category": "Engineering & Architecture",
    "aliases": [
      "code-smells-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "clean-code",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect code smells with evidence, risk-based prioritization, and reproducible verification.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Inventory and map the exact scope, inputs, outputs, dependencies, and current behavior; Detect and reproduce evidence, failure modes, edge cases, and project conventions; then classify and prioritize measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "19. /detect-code-smells"
    }
  },
  {
    "index": 20,
    "id": "score-maintainability",
    "version": "1.0.0",
    "slash": "/score-maintainability",
    "title": "Score maintainability",
    "category": "Engineering & Architecture",
    "aliases": [
      "maintainability-score"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-architecture",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Score maintainability using verified project evidence and a platform-agnostic execution contract.",
    "where": "source, configuration, tests, build graph, dependencies, documentation, and architecture boundaries.",
    "how": "Discover and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Inspect and correlate evidence, failure modes, edge cases, and project conventions; then evaluate and rank measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Architecture & Code Quality Agent; deep-reasoning code model with repository-wide context.",
    "hiddenConnection": "Connect this command to testing, ownership, dependency risk, documentation drift, security, and release impact; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "structural coupling, generated code, hidden consumers, public contracts, and undocumented business rules.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "20. /score-maintainability"
    }
  },
  {
    "index": 21,
    "id": "debug-the-last-10-turns",
    "version": "1.0.0",
    "slash": "/debug-the-last-10-turns",
    "title": "Debug the last 10 turns",
    "category": "Debugging",
    "aliases": [
      "debug-last-10",
      "last-10-debug"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--time-window",
      "--branch"
    ],
    "primitiveId": "debug-root-cause",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Debug the last 10 turns with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Reconstruct scope and state for expected behavior, actual behavior, causal mechanism, trigger, and escape path; Plan bounded execution around technical and non-technical explanation; then execute, checkpoint, and verify prevention, detection, and regression coverage.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "21. /debug-the-last-10-turns"
    }
  },
  {
    "index": 22,
    "id": "debug-everything-changed-today",
    "version": "1.0.0",
    "slash": "/debug-everything-changed-today",
    "title": "Debug everything changed today",
    "category": "Debugging",
    "aliases": [
      "debug-everything-changed",
      "everything-changed-debug"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--time-window",
      "--branch"
    ],
    "primitiveId": "debug-root-cause",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Debug everything changed today with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Reconstruct scope and state for expected behavior, actual behavior, causal mechanism, trigger, and escape path; Plan bounded execution around technical and non-technical explanation; then execute, checkpoint, and verify prevention, detection, and regression coverage.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "22. /debug-everything-changed-today"
    }
  },
  {
    "index": 23,
    "id": "find-root-causes-instead-of-symptoms",
    "version": "1.0.0",
    "slash": "/find-root-causes-instead-of-symptoms",
    "title": "Find root causes instead of symptoms",
    "category": "Debugging",
    "aliases": [
      "find-root-causes",
      "root-causes-find"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "debug-root-cause",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Find root causes instead of symptoms with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map expected versus actual behavior and exact trigger; Detect and reproduce competing hypotheses tested against logs, traces, diffs, and minimal reproductions; then classify and prioritize root cause, trigger, contributing conditions, and detection gaps.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "23. /find-root-causes-instead-of-symptoms"
    }
  },
  {
    "index": 24,
    "id": "trace-every-runtime-error",
    "version": "1.0.0",
    "slash": "/trace-every-runtime-error",
    "title": "Trace every runtime error",
    "category": "Debugging",
    "aliases": [
      "trace-runtime-error",
      "runtime-error-trace"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "trace-runtime",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Trace every runtime error with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map error fingerprints, versions, request/trace IDs, environments, and user impact; Detect and reproduce primary versus downstream errors; then classify and prioritize reproduction, source maps, telemetry, and regression checks.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "24. /trace-every-runtime-error"
    }
  },
  {
    "index": 25,
    "id": "explain-why-each-bug-exists",
    "version": "1.0.0",
    "slash": "/explain-why-each-bug-exists",
    "title": "Explain why each bug exists",
    "category": "Debugging",
    "aliases": [
      "explain-why-each",
      "why-each-explain"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "debug-root-cause",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Explain why each bug exists using verified project evidence and a platform-agnostic execution contract.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Discover and baseline expected behavior, actual behavior, causal mechanism, trigger, and escape path; Inspect and correlate technical and non-technical explanation; then evaluate and rank prevention, detection, and regression coverage.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "25. /explain-why-each-bug-exists"
    }
  },
  {
    "index": 26,
    "id": "generate-minimal-fixes",
    "version": "1.0.0",
    "slash": "/generate-minimal-fixes",
    "title": "Generate minimal fixes",
    "category": "Debugging",
    "aliases": [
      "minimal-fixes-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "debug-root-cause",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Generate minimal fixes using verified project evidence and a platform-agnostic execution contract.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Gather and normalize evidence for smallest correct layer and invariant to restore; Design and generate narrow patch, regression test, and limited blast radius; then review and validate temporary limitations and follow-up hardening.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "26. /generate-minimal-fixes"
    }
  },
  {
    "index": 27,
    "id": "generate-production-safe-fixes",
    "version": "1.0.0",
    "slash": "/generate-production-safe-fixes",
    "title": "Generate production-safe fixes",
    "category": "Debugging",
    "aliases": [
      "generate-production-safe",
      "production-safe-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "debug-root-cause",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate production-safe fixes using verified project evidence and a platform-agnostic execution contract.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Gather and normalize evidence for defense-in-depth validation, errors, observability, migration, rollout, and rollback; Design and generate backward compatibility and canary or feature-flag options; then review and validate full relevant checks and residual risk.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "27. /generate-production-safe-fixes"
    }
  },
  {
    "index": 28,
    "id": "detect-race-conditions",
    "version": "1.0.0",
    "slash": "/detect-race-conditions",
    "title": "Detect race conditions",
    "category": "Debugging",
    "aliases": [
      "race-conditions-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-concurrency-state",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect race conditions with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map concurrent actors, shared resources, transactions, locks, queues, and retries; Detect and reproduce interleavings, idempotency, lost updates, stale reads, and double execution; then classify and prioritize stress/failure injection and deterministic evidence.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "28. /detect-race-conditions"
    }
  },
  {
    "index": 29,
    "id": "detect-memory-leaks",
    "version": "1.0.0",
    "slash": "/detect-memory-leaks",
    "title": "Detect memory leaks",
    "category": "Debugging",
    "aliases": [
      "memory-leaks-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "trace-runtime",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect memory leaks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map heap/allocation/resource profiles, retaining paths, listeners, caches, and unclosed resources; Detect and reproduce repeated workload cycles and garbage-collection behavior; then classify and prioritize before/after memory trends and alerting.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "29. /detect-memory-leaks"
    }
  },
  {
    "index": 30,
    "id": "detect-infinite-loops",
    "version": "1.0.0",
    "slash": "/detect-infinite-loops",
    "title": "Detect infinite loops",
    "category": "Debugging",
    "aliases": [
      "infinite-loops-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-concurrency-state",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect infinite loops with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map loop conditions, recursion, retries, reactive effects, scheduling, and state machines; Detect and reproduce CPU traces, counters, watchdogs, and repeating transitions; then classify and prioritize bounded termination, backoff, cycle detection, and malformed-input tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "30. /detect-infinite-loops"
    }
  },
  {
    "index": 31,
    "id": "detect-stale-state",
    "version": "1.0.0",
    "slash": "/detect-stale-state",
    "title": "Detect stale state",
    "category": "Debugging",
    "aliases": [
      "stale-state-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-concurrency-state",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect stale state with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map sources of truth, copies, caches, subscriptions, versions, and invalidation; Detect and reproduce timing and navigation sequences that produce stale values; then classify and prioritize concurrent updates, reconnects, optimistic updates, and accepted consistency.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "31. /detect-stale-state"
    }
  },
  {
    "index": 32,
    "id": "detect-async-issues",
    "version": "1.0.0",
    "slash": "/detect-async-issues",
    "title": "Detect async issues",
    "category": "Debugging",
    "aliases": [
      "async-issues-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-concurrency-state",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect async issues with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map task ownership, awaits, cancellation, timeouts, detached work, and error propagation; Detect and reproduce operation lifetime across requests, components, jobs, and shutdown; then classify and prioritize ordering, cleanup, cancellation, and failure tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "32. /detect-async-issues"
    }
  },
  {
    "index": 33,
    "id": "detect-hydration-issues",
    "version": "1.0.0",
    "slash": "/detect-hydration-issues",
    "title": "Detect hydration issues",
    "category": "Debugging",
    "aliases": [
      "hydration-issues-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-concurrency-state",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect hydration issues with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map server markup, client initial state, serialization, locale/time/random values, and browser APIs; Detect and reproduce server/client boundaries and nondeterministic rendering; then classify and prioritize production build, seo, accessibility, and timezone/auth variants.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "33. /detect-hydration-issues"
    }
  },
  {
    "index": 34,
    "id": "detect-rendering-loops",
    "version": "1.0.0",
    "slash": "/detect-rendering-loops",
    "title": "Detect rendering loops",
    "category": "Debugging",
    "aliases": [
      "rendering-loops-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "analyze-concurrency-state",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect rendering loops with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map component update graphs, props, state, selectors, subscriptions, and unstable references; Detect and reproduce costly versus harmless renders; then classify and prioritize interaction metrics, strict mode, and production behavior.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "34. /detect-rendering-loops"
    }
  },
  {
    "index": 35,
    "id": "detect-event-listener-leaks",
    "version": "1.0.0",
    "slash": "/detect-event-listener-leaks",
    "title": "Detect event listener leaks",
    "category": "Debugging",
    "aliases": [
      "detect-event-listener",
      "event-listener-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-concurrency-state",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect event listener leaks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map registrations, ownership, cleanup, reconnect, mount/unmount, timers, sockets, and observers; Detect and reproduce duplicate handlers and retained closures; then classify and prioritize stable resource counts over repeated cycles.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "35. /detect-event-listener-leaks"
    }
  },
  {
    "index": 36,
    "id": "trace-api-failures",
    "version": "1.0.0",
    "slash": "/trace-api-failures",
    "title": "Trace API failures",
    "category": "Debugging",
    "aliases": [
      "api-failures-trace"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "trace-runtime",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Trace API failures with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map routes, clients, schemas, auth, retries, timeouts, proxies, payloads, and downstream calls; Detect and reproduce contract, network, permission, capacity, and logic failures; then classify and prioritize success/failure contracts, redaction, and request correlation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "36. /trace-api-failures"
    }
  },
  {
    "index": 37,
    "id": "trace-database-failures",
    "version": "1.0.0",
    "slash": "/trace-database-failures",
    "title": "Trace database failures",
    "category": "Debugging",
    "aliases": [
      "database-failures-trace"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "trace-runtime",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Trace database failures with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map engine, schema, ORM, migrations, pooling, replicas, locks, constraints, and transactions; Detect and reproduce queries, plans, data shape, timeouts, and connection exhaustion; then classify and prioritize safe reproduction, retry semantics, and data protection.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "37. /trace-database-failures"
    }
  },
  {
    "index": 38,
    "id": "trace-authentication-failures",
    "version": "1.0.0",
    "slash": "/trace-authentication-failures",
    "title": "Trace authentication failures",
    "category": "Debugging",
    "aliases": [
      "authentication-failures-trace"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "trace-runtime",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Trace authentication failures with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map providers, redirects, tokens, cookies, sessions, refresh, expiry, domains, and clocks; Detect and reproduce authentication versus authorization failures; then classify and prioritize logout, revocation, multi-device, and privacy-safe diagnostics.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "38. /trace-authentication-failures"
    }
  },
  {
    "index": 39,
    "id": "trace-cache-inconsistencies",
    "version": "1.0.0",
    "slash": "/trace-cache-inconsistencies",
    "title": "Trace cache inconsistencies",
    "category": "Debugging",
    "aliases": [
      "cache-inconsistencies-trace"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "trace-runtime",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Trace cache inconsistencies with evidence, risk-based prioritization, and reproducible verification.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Inventory and map layers, keys, TTLs, versions, invalidation, tenancy, and source of truth; Detect and reproduce cold, warm, stale, concurrent, and dependency-failure states; then classify and prioritize correctness, hit rate, latency, and data isolation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "39. /trace-cache-inconsistencies"
    }
  },
  {
    "index": 40,
    "id": "build-a-debugging-timeline",
    "version": "1.0.0",
    "slash": "/build-a-debugging-timeline",
    "title": "Build a debugging timeline",
    "category": "Debugging",
    "aliases": [
      "build-debugging-timeline",
      "debugging-timeline-build"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--time-window",
      "--branch"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Build a debugging timeline using verified project evidence and a platform-agnostic execution contract.",
    "where": "recent changes, logs, stack traces, runtime state, tests, network calls, data, and configuration.",
    "how": "Gather and normalize evidence for expected behavior, actual behavior, causal mechanism, trigger, and escape path; Design and generate technical and non-technical explanation; then review and validate prevention, detection, and regression coverage.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Root-Cause Debugging Agent; tool-using reasoning model optimized for logs, diffs, traces, and hypothesis testing.",
    "hiddenConnection": "Connect this command to recent diffs, telemetry gaps, environment drift, dependency changes, and regression tests; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "nondeterminism, stale caches, missing telemetry, hidden retries, clock skew, and environment drift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "40. /build-a-debugging-timeline"
    }
  },
  {
    "index": 41,
    "id": "perform-a-security-audit",
    "version": "1.0.0",
    "slash": "/perform-a-security-audit",
    "title": "Perform a security audit",
    "category": "Security",
    "aliases": [
      "perform-security-audit",
      "security-audit-perform"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "audit-security",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Perform a security audit with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover and baseline assets, identities, data classes, trust boundaries, dependencies, and attack surface; Inspect and correlate authentication, authorization, validation, secrets, supply chain, logging, infrastructure, and abuse cases; then evaluate and rank exploitability, impact, exposure, confidence, containment, and remediation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "41. /perform-a-security-audit"
    }
  },
  {
    "index": 42,
    "id": "scan-for-exposed-secrets",
    "version": "1.0.0",
    "slash": "/scan-for-exposed-secrets",
    "title": "Scan for exposed secrets",
    "category": "Security",
    "aliases": [
      "scan-exposed-secrets",
      "exposed-secrets-scan"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-secrets-config",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Scan for exposed secrets with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map source, history, logs, build artifacts, CI, environment files, containers, and provider patterns; Detect and reproduce redacted validation, rotation, revocation, and retained copies; then classify and prioritize pre-commit/ci prevention and credential lifecycle.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "42. /scan-for-exposed-secrets"
    }
  },
  {
    "index": 43,
    "id": "scan-git-history-for-secrets",
    "version": "1.0.0",
    "slash": "/scan-git-history-for-secrets",
    "title": "Scan Git history for secrets",
    "category": "Security",
    "aliases": [
      "scan-git-history",
      "git-history-scan"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--time-window",
      "--branch",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-secrets-config",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Scan Git history for secrets with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map source, history, logs, build artifacts, CI, environment files, containers, and provider patterns; Detect and reproduce redacted validation, rotation, revocation, and retained copies; then classify and prioritize pre-commit/ci prevention and credential lifecycle.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "43. /scan-git-history-for-secrets"
    }
  },
  {
    "index": 44,
    "id": "validate-environment-variables",
    "version": "1.0.0",
    "slash": "/validate-environment-variables",
    "title": "Validate environment variables",
    "category": "Security",
    "aliases": [
      "environment-variables-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-secrets-config",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate environment variables with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover requirements and current state for definitions, reads, schemas, examples, CI, deploy settings, build-time, runtime, public, and secret scopes; Test and challenge missing, unused, deprecated, inconsistent, or unsafe defaults; then report gaps and verify typed validation and startup behavior.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "44. /validate-environment-variables"
    }
  },
  {
    "index": 45,
    "id": "detect-insecure-api-routes",
    "version": "1.0.0",
    "slash": "/detect-insecure-api-routes",
    "title": "Detect insecure API routes",
    "category": "Security",
    "aliases": [
      "detect-insecure-api",
      "insecure-api-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "audit-security",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect insecure API routes with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map the exact scope, inputs, outputs, dependencies, and current behavior; Detect and reproduce evidence, failure modes, edge cases, and project conventions; then classify and prioritize measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "45. /detect-insecure-api-routes"
    }
  },
  {
    "index": 46,
    "id": "detect-missing-authorization",
    "version": "1.0.0",
    "slash": "/detect-missing-authorization",
    "title": "Detect missing authorization",
    "category": "Security",
    "aliases": [
      "missing-authorization-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-authz-data-policies",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect missing authorization with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map resource, action, tenant, owner, role, policy, job, tool, and data boundaries; Detect and reproduce positive and negative cases, default deny, and privilege escalation; then classify and prioritize central policy, revocation, caching, and cross-tenant tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "46. /detect-missing-authorization"
    }
  },
  {
    "index": 47,
    "id": "validate-rbac",
    "version": "1.0.0",
    "slash": "/validate-rbac",
    "title": "Validate RBAC",
    "category": "Security",
    "aliases": [
      "rbac-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-authz-data-policies",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate RBAC with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover requirements and current state for roles, permissions, inheritance, assignments, admin paths, and enforcement; Test and challenge role-resource-action matrix and least privilege; then report gaps and verify role granting, revocation, caching, and negative tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "47. /validate-rbac"
    }
  },
  {
    "index": 48,
    "id": "validate-rls",
    "version": "1.0.0",
    "slash": "/validate-rls",
    "title": "Validate RLS",
    "category": "Security",
    "aliases": [
      "rls-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-authz-data-policies",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate RLS with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover requirements and current state for tables, views, functions, storage, service roles, and policy bypass paths; Test and challenge role, tenant, ownership, CRUD, joins, functions, and bulk operations; then report gaps and verify isolated test identities and unauthorized-row denial.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "48. /validate-rls"
    }
  },
  {
    "index": 49,
    "id": "audit-supabase-policies",
    "version": "1.0.0",
    "slash": "/audit-supabase-policies",
    "title": "Audit Supabase policies",
    "category": "Security",
    "aliases": [
      "supabase-policies-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-authz-data-policies",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit Supabase policies with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover and baseline Auth, Postgres RLS, Storage, Edge Functions, keys, functions, and project settings; Inspect and correlate anon, authenticated, service-role, custom claims, and tenant isolation; then evaluate and rank direct api tests, migrations, and secret protection.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "49. /audit-supabase-policies"
    }
  },
  {
    "index": 50,
    "id": "audit-firebase-rules",
    "version": "1.0.0",
    "slash": "/audit-firebase-rules",
    "title": "Audit Firebase rules",
    "category": "Security",
    "aliases": [
      "firebase-rules-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "validate-authz-data-policies",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit Firebase rules with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover and baseline Firestore, Realtime Database, Storage, Auth claims, Functions, Admin SDK, rules, and emulator; Inspect and correlate path, query, wildcard, ownership, role, and validation behavior; then evaluate and rank emulator tests and server-side authorization.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "50. /audit-firebase-rules"
    }
  },
  {
    "index": 51,
    "id": "detect-xss-risks",
    "version": "1.0.0",
    "slash": "/detect-xss-risks",
    "title": "Detect XSS risks",
    "category": "Security",
    "aliases": [
      "xss-risks-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "analyze-injection-threats",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect XSS risks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map untrusted input, storage, markdown, URLs, templates, and HTML/JS/CSS sinks; Detect and reproduce escaping, sanitization, CSP, rich content, and context-specific encoding; then classify and prioritize safe regression cases and exploitability evidence.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "51. /detect-xss-risks"
    }
  },
  {
    "index": 52,
    "id": "detect-sql-injection-risks",
    "version": "1.0.0",
    "slash": "/detect-sql-injection-risks",
    "title": "Detect SQL injection risks",
    "category": "Security",
    "aliases": [
      "detect-sql-injection",
      "sql-injection-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "analyze-injection-threats",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect SQL injection risks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map raw queries, dynamic identifiers, filters, procedures, ORM escape hatches, and admin/reporting paths; Detect and reproduce parameterization and strict identifier allowlists; then classify and prioritize negative tests and safe evidence.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "52. /detect-sql-injection-risks"
    }
  },
  {
    "index": 53,
    "id": "detect-ssrf-risks",
    "version": "1.0.0",
    "slash": "/detect-ssrf-risks",
    "title": "Detect SSRF risks",
    "category": "Security",
    "aliases": [
      "ssrf-risks-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "analyze-injection-threats",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect SSRF risks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map user-controlled URLs, redirects, webhooks, imports, previews, proxies, protocols, DNS, and egress; Detect and reproduce metadata services, internal networks, redirect chains, IPv6, and DNS rebinding; then classify and prioritize allowlists, resolver checks, network controls, and safe test targets.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "53. /detect-ssrf-risks"
    }
  },
  {
    "index": 54,
    "id": "detect-csrf-risks",
    "version": "1.0.0",
    "slash": "/detect-csrf-risks",
    "title": "Detect CSRF risks",
    "category": "Security",
    "aliases": [
      "csrf-risks-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "analyze-injection-threats",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect CSRF risks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map cookie authentication, state-changing routes, CORS, SameSite, Origin/Referer, tokens, forms, and OAuth; Detect and reproduce ambient credentials and cross-site trigger conditions; then classify and prioritize login/logout/upload/callback cases and negative tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "54. /detect-csrf-risks"
    }
  },
  {
    "index": 55,
    "id": "detect-prompt-injection-risks",
    "version": "1.0.0",
    "slash": "/detect-prompt-injection-risks",
    "title": "Detect prompt injection risks",
    "category": "Security",
    "aliases": [
      "detect-prompt-injection",
      "prompt-injection-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "analyze-injection-threats",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect prompt injection risks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map instruction hierarchy, retrieved content, tools, files, memory, external pages, and trust boundaries; Detect and reproduce direct, indirect, multi-turn, tool-mediated, and retrieval-based injection; then classify and prioritize least privilege, confirmation, data minimization, and adversarial evals.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "55. /detect-prompt-injection-risks"
    }
  },
  {
    "index": 56,
    "id": "detect-dependency-vulnerabilities",
    "version": "1.0.0",
    "slash": "/detect-dependency-vulnerabilities",
    "title": "Detect dependency vulnerabilities",
    "category": "Security",
    "aliases": [
      "dependency-vulnerabilities-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "audit-security",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect dependency vulnerabilities with evidence, risk-based prioritization, and reproducible verification.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Inventory and map direct/transitive packages, lockfiles, registries, containers, actions, provenance, install scripts, and licenses; Detect and reproduce reachability, exposure, maintenance, and upgrade compatibility; then classify and prioritize lockfile integrity and tested remediation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "56. /detect-dependency-vulnerabilities"
    }
  },
  {
    "index": 57,
    "id": "generate-threat-models",
    "version": "1.0.0",
    "slash": "/generate-threat-models",
    "title": "Generate threat models",
    "category": "Security",
    "aliases": [
      "threat-models-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "threat-model-compliance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Generate threat models using verified project evidence and a platform-agnostic execution contract.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Gather and normalize evidence for assets, actors, data flows, trust boundaries, abuse cases, and business logic; Design and generate STRIDE or suitable method, likelihood, impact, controls, and owners; then review and validate evidence-linked mitigations and update triggers.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "57. /generate-threat-models"
    }
  },
  {
    "index": 58,
    "id": "generate-mitigation-plans",
    "version": "1.0.0",
    "slash": "/generate-mitigation-plans",
    "title": "Generate mitigation plans",
    "category": "Security",
    "aliases": [
      "mitigation-plans-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "threat-model-compliance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Generate mitigation plans using verified project evidence and a platform-agnostic execution contract.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Gather and normalize evidence for the exact scope, inputs, outputs, dependencies, and current behavior; Design and generate evidence, failure modes, edge cases, and project conventions; then review and validate measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "58. /generate-mitigation-plans"
    }
  },
  {
    "index": 59,
    "id": "score-security-posture",
    "version": "1.0.0",
    "slash": "/score-security-posture",
    "title": "Score security posture",
    "category": "Security",
    "aliases": [
      "security-posture-score"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "threat-model-compliance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Score security posture using verified project evidence and a platform-agnostic execution contract.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Inspect and correlate evidence, failure modes, edge cases, and project conventions; then evaluate and rank measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "59. /score-security-posture"
    }
  },
  {
    "index": 60,
    "id": "produce-an-owasp-compliance-report",
    "version": "1.0.0",
    "slash": "/produce-an-owasp-compliance-report",
    "title": "Produce an OWASP compliance report",
    "category": "Security",
    "aliases": [
      "produce-owasp-compliance",
      "owasp-compliance-produce"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--standard",
      "--redact",
      "--no-write"
    ],
    "primitiveId": "threat-model-compliance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Produce an OWASP compliance report using verified project evidence and a platform-agnostic execution contract.",
    "where": "code, identities, data flows, dependencies, tools, infrastructure, CI/CD, and configuration.",
    "how": "Discover and baseline diff semantics, critical files, dependencies, migrations, tests, owners, complexity, deployment, and historical incidents; Inspect and correlate risk factors, reviewer guidance, and verification; then evaluate and rank small high-impact config/permission changes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Application Security Agent; security-focused reasoning model with threat-modeling and code-analysis capability.",
    "hiddenConnection": "Connect this command to identity, tenancy, data classification, supply chain, observability, deployment, and incident response; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "shadow integrations, historical secrets, inherited permissions, business-logic abuse, and compensating controls.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "60. /produce-an-owasp-compliance-report"
    }
  },
  {
    "index": 61,
    "id": "profile-performance",
    "version": "1.0.0",
    "slash": "/profile-performance",
    "title": "Profile performance",
    "category": "Performance",
    "aliases": [
      "performance-profile"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "profile-performance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Profile performance with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Discover and baseline critical journeys, workload, runtime, CPU, memory, I/O, network, database, and contention; Inspect and correlate baseline profiles, percentiles, distributions, and representative data; then evaluate and rank measured before/after change and regression budgets.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "61. /profile-performance"
    }
  },
  {
    "index": 62,
    "id": "benchmark-startup-time",
    "version": "1.0.0",
    "slash": "/benchmark-startup-time",
    "title": "Benchmark startup time",
    "category": "Performance",
    "aliases": [
      "startup-time-benchmark"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "profile-performance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Benchmark startup time with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Discover cold/warm boundaries, initialization, dependency loading, network, migration, and readiness; Analyze repeated isolated trials and cache controls; then act on first successful user operation, not only process start.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "62. /benchmark-startup-time"
    }
  },
  {
    "index": 63,
    "id": "benchmark-bundle-size",
    "version": "1.0.0",
    "slash": "/benchmark-bundle-size",
    "title": "Benchmark bundle size",
    "category": "Performance",
    "aliases": [
      "bundle-size-benchmark"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "profile-performance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Benchmark bundle size with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Discover bundler, chunks, routes, source maps, compression, duplicate modules, polyfills, and side effects; Analyze raw, compressed, initial, deferred, parse, and execute cost; then act on route budgets and tree-shaking verification.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "63. /benchmark-bundle-size"
    }
  },
  {
    "index": 64,
    "id": "benchmark-memory-usage",
    "version": "1.0.0",
    "slash": "/benchmark-memory-usage",
    "title": "Benchmark memory usage",
    "category": "Performance",
    "aliases": [
      "memory-usage-benchmark"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "profile-performance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Benchmark memory usage with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Discover heap, native, buffers, caches, external resources, peak, steady state, and long-running behavior; Analyze idle/load/cleanup/recovery cycles; then act on gc behavior, thresholds, and leak distinction.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "64. /benchmark-memory-usage"
    }
  },
  {
    "index": 65,
    "id": "benchmark-api-latency",
    "version": "1.0.0",
    "slash": "/benchmark-api-latency",
    "title": "Benchmark API latency",
    "category": "Performance",
    "aliases": [
      "api-latency-benchmark"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "profile-performance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Benchmark API latency with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Discover p50, p95, p99, throughput, errors, saturation, cache states, regions, and downstream contribution; Analyze cold/warm/authenticated/cache-miss paths; then act on slos, coordinated omission, and regression budgets.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "65. /benchmark-api-latency"
    }
  },
  {
    "index": 66,
    "id": "detect-unnecessary-renders",
    "version": "1.0.0",
    "slash": "/detect-unnecessary-renders",
    "title": "Detect unnecessary renders",
    "category": "Performance",
    "aliases": [
      "unnecessary-renders-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect unnecessary renders with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Inventory and map component update graphs, props, state, selectors, subscriptions, and unstable references; Detect and reproduce costly versus harmless renders; then classify and prioritize interaction metrics, strict mode, and production behavior.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "66. /detect-unnecessary-renders"
    }
  },
  {
    "index": 67,
    "id": "detect-unnecessary-re-fetches",
    "version": "1.0.0",
    "slash": "/detect-unnecessary-re-fetches",
    "title": "Detect unnecessary re-fetches",
    "category": "Performance",
    "aliases": [
      "detect-unnecessary-re",
      "unnecessary-re-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect unnecessary re-fetches with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Inventory and map the exact scope, inputs, outputs, dependencies, and current behavior; Detect and reproduce evidence, failure modes, edge cases, and project conventions; then classify and prioritize measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "67. /detect-unnecessary-re-fetches"
    }
  },
  {
    "index": 68,
    "id": "detect-unnecessary-network-traffic",
    "version": "1.0.0",
    "slash": "/detect-unnecessary-network-traffic",
    "title": "Detect unnecessary network traffic",
    "category": "Performance",
    "aliases": [
      "detect-unnecessary-network",
      "unnecessary-network-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "profile-performance",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect unnecessary network traffic with evidence, risk-based prioritization, and reproducible verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Inventory and map the exact scope, inputs, outputs, dependencies, and current behavior; Detect and reproduce evidence, failure modes, edge cases, and project conventions; then classify and prioritize measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "68. /detect-unnecessary-network-traffic"
    }
  },
  {
    "index": 69,
    "id": "optimize-react-rendering",
    "version": "1.0.0",
    "slash": "/optimize-react-rendering",
    "title": "Optimize React rendering",
    "category": "Performance",
    "aliases": [
      "react-rendering-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize React rendering safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline component update graphs, props, state, selectors, subscriptions, and unstable references; Plan the smallest safe change to costly versus harmless renders; then implement incrementally and compare interaction metrics, strict mode, and production behavior.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "69. /optimize-react-rendering"
    }
  },
  {
    "index": 70,
    "id": "optimize-nextjs",
    "version": "1.0.0",
    "slash": "/optimize-nextjs",
    "title": "Optimize Next.js",
    "category": "Performance",
    "aliases": [
      "optimize-next-js",
      "next-js-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize Next.js safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline router mode, version, runtime target, server/client boundaries, data fetching, caching, routes, assets, and host capabilities; Plan the smallest safe change to production rendering, hydration, SEO, dynamic behavior, and deployment assumptions; then implement incrementally and compare route-level before/after evidence.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "70. /optimize-nextjs"
    }
  },
  {
    "index": 71,
    "id": "optimize-database-queries",
    "version": "1.0.0",
    "slash": "/optimize-database-queries",
    "title": "Optimize database queries",
    "category": "Performance",
    "aliases": [
      "database-queries-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-backend-data",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize database queries safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline query plans, cardinality, indexes, joins, round trips, locks, transactions, and representative data; Plan the smallest safe change to query shape, batching, schema, and write/read tradeoffs; then implement incrementally and compare correctness, plan stability, and production distribution.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "71. /optimize-database-queries"
    }
  },
  {
    "index": 72,
    "id": "optimize-indexes",
    "version": "1.0.0",
    "slash": "/optimize-indexes",
    "title": "Optimize indexes",
    "category": "Performance",
    "aliases": [
      "indexes-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-backend-data",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize indexes safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline predicates, joins, sorting, selectivity, frequency, overlap, bloat, storage, and write cost; Plan the smallest safe change to engine-specific ordering and rollout; then implement incrementally and compare read improvement versus write/lock impact.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "72. /optimize-indexes"
    }
  },
  {
    "index": 73,
    "id": "optimize-caching",
    "version": "1.0.0",
    "slash": "/optimize-caching",
    "title": "Optimize caching",
    "category": "Performance",
    "aliases": [
      "caching-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-backend-data",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize caching safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Plan the smallest safe change to evidence, failure modes, edge cases, and project conventions; then implement incrementally and compare measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "73. /optimize-caching"
    }
  },
  {
    "index": 74,
    "id": "optimize-images",
    "version": "1.0.0",
    "slash": "/optimize-images",
    "title": "Optimize images",
    "category": "Performance",
    "aliases": [
      "images-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize images safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline formats, dimensions, responsive variants, CDN transforms, priority, compression, layout shift, and alt text; Plan the smallest safe change to quality versus bytes and decode cost; then implement incrementally and compare high-dpi, slow-network, and fallback behavior.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "74. /optimize-images"
    }
  },
  {
    "index": 75,
    "id": "optimize-fonts",
    "version": "1.0.0",
    "slash": "/optimize-fonts",
    "title": "Optimize fonts",
    "category": "Performance",
    "aliases": [
      "fonts-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize fonts safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline families, weights, subsets, origins, preload, fallback metrics, language coverage, and licensing; Plan the smallest safe change to transfer, render blocking, cache, and CLS; then implement incrementally and compare failure/offline behavior and privacy.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "75. /optimize-fonts"
    }
  },
  {
    "index": 76,
    "id": "optimize-css",
    "version": "1.0.0",
    "slash": "/optimize-css",
    "title": "Optimize CSS",
    "category": "Performance",
    "aliases": [
      "css-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize CSS safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline framework, build pipeline, unused rules, duplication, specificity, variants, critical CSS, and dynamic classes; Plan the smallest safe change to transfer, parse, recalculation, CLS, and visual behavior; then implement incrementally and compare visual regression and accessibility.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "76. /optimize-css"
    }
  },
  {
    "index": 77,
    "id": "optimize-javascript",
    "version": "1.0.0",
    "slash": "/optimize-javascript",
    "title": "Optimize JavaScript",
    "category": "Performance",
    "aliases": [
      "javascript-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize JavaScript safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline bundles, long tasks, hydration, polyfills, events, third-party scripts, and browser support; Plan the smallest safe change to remove, defer, split, server-execute, or replace with platform APIs; then implement incrementally and compare interaction latency and behavior verification.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "77. /optimize-javascript"
    }
  },
  {
    "index": 78,
    "id": "optimize-server-costs",
    "version": "1.0.0",
    "slash": "/optimize-server-costs",
    "title": "Optimize server costs",
    "category": "Performance",
    "aliases": [
      "server-costs-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-infrastructure-cost",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize server costs safely, incrementally, and with measurable verification.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Measure and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Plan the smallest safe change to evidence, failure modes, edge cases, and project conventions; then implement incrementally and compare measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "78. /optimize-server-costs"
    }
  },
  {
    "index": 79,
    "id": "generate-lighthouse-improvements",
    "version": "1.0.0",
    "slash": "/generate-lighthouse-improvements",
    "title": "Generate Lighthouse improvements",
    "category": "Performance",
    "aliases": [
      "lighthouse-improvements-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-frontend",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate Lighthouse improvements using verified project evidence and a platform-agnostic execution contract.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Gather and normalize evidence for diff semantics, critical files, dependencies, migrations, tests, owners, complexity, deployment, and historical incidents; Design and generate risk factors, reviewer guidance, and verification; then review and validate small high-impact config/permission changes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "79. /generate-lighthouse-improvements"
    }
  },
  {
    "index": 80,
    "id": "generate-performance-roadmap",
    "version": "1.0.0",
    "slash": "/generate-performance-roadmap",
    "title": "Generate performance roadmap",
    "category": "Performance",
    "aliases": [
      "performance-roadmap-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate performance roadmap using verified project evidence and a platform-agnostic execution contract.",
    "where": "client, server, network, database, cache, assets, build output, and infrastructure cost.",
    "how": "Gather and normalize evidence for critical journeys, workload, runtime, CPU, memory, I/O, network, database, and contention; Design and generate baseline profiles, percentiles, distributions, and representative data; then review and validate measured before/after change and regression budgets.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Performance & Cost Agent; measurement-first model with profiling, query, bundle, and systems reasoning.",
    "hiddenConnection": "Connect this command to user outcomes, error rate, cache strategy, concurrency, cloud cost, and capacity; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "production data distribution, warm/cold behavior, contention, real user networks, and third-party latency.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "80. /generate-performance-roadmap"
    }
  },
  {
    "index": 81,
    "id": "audit-prompts",
    "version": "1.0.0",
    "slash": "/audit-prompts",
    "title": "Audit prompts",
    "category": "AI Systems",
    "aliases": [
      "prompts-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "govern-prompts",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit prompts with evidence, risk-based prioritization, and reproducible verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover and baseline system/developer/user/tool/retrieval prompts, precedence, versions, owners, conflicts, token use, and output contracts; Inspect and correlate representative and adversarial evaluations; then evaluate and rank quality, safety, latency, cost, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "81. /audit-prompts"
    }
  },
  {
    "index": 82,
    "id": "consolidate-prompts",
    "version": "1.0.0",
    "slash": "/consolidate-prompts",
    "title": "Consolidate prompts",
    "category": "AI Systems",
    "aliases": [
      "prompts-consolidate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "govern-prompts",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Consolidate prompts safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline system/developer/user/tool/retrieval prompts, precedence, versions, owners, conflicts, token use, and output contracts; Plan the smallest safe change to representative and adversarial evaluations; then implement incrementally and compare quality, safety, latency, cost, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "82. /consolidate-prompts"
    }
  },
  {
    "index": 83,
    "id": "optimize-prompts",
    "version": "1.0.0",
    "slash": "/optimize-prompts",
    "title": "Optimize prompts",
    "category": "AI Systems",
    "aliases": [
      "prompts-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "govern-prompts",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize prompts safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline system/developer/user/tool/retrieval prompts, precedence, versions, owners, conflicts, token use, and output contracts; Plan the smallest safe change to representative and adversarial evaluations; then implement incrementally and compare quality, safety, latency, cost, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "83. /optimize-prompts"
    }
  },
  {
    "index": 84,
    "id": "version-prompts",
    "version": "1.0.0",
    "slash": "/version-prompts",
    "title": "Version prompts",
    "category": "AI Systems",
    "aliases": [
      "prompts-version"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "govern-prompts",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Version prompts safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover system/developer/user/tool/retrieval prompts, precedence, versions, owners, conflicts, token use, and output contracts; Analyze representative and adversarial evaluations; then act on quality, safety, latency, cost, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "84. /version-prompts"
    }
  },
  {
    "index": 85,
    "id": "detect-prompt-duplication",
    "version": "1.0.0",
    "slash": "/detect-prompt-duplication",
    "title": "Detect prompt duplication",
    "category": "AI Systems",
    "aliases": [
      "prompt-duplication-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "govern-prompts",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect prompt duplication with evidence, risk-based prioritization, and reproducible verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Inventory and map system/developer/user/tool/retrieval prompts, precedence, versions, owners, conflicts, token use, and output contracts; Detect and reproduce representative and adversarial evaluations; then classify and prioritize quality, safety, latency, cost, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "85. /detect-prompt-duplication"
    }
  },
  {
    "index": 86,
    "id": "evaluate-hallucination-risk",
    "version": "1.0.0",
    "slash": "/evaluate-hallucination-risk",
    "title": "Evaluate hallucination risk",
    "category": "AI Systems",
    "aliases": [
      "hallucination-risk-evaluate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Evaluate hallucination risk with evidence, risk-based prioritization, and reproducible verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover requirements and current state for the exact scope, inputs, outputs, dependencies, and current behavior; Test and challenge evidence, failure modes, edge cases, and project conventions; then report gaps and verify measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "86. /evaluate-hallucination-risk"
    }
  },
  {
    "index": 87,
    "id": "evaluate-routing-logic",
    "version": "1.0.0",
    "slash": "/evaluate-routing-logic",
    "title": "Evaluate routing logic",
    "category": "AI Systems",
    "aliases": [
      "routing-logic-evaluate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Evaluate routing logic with evidence, risk-based prioritization, and reproducible verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover requirements and current state for intent rules, features, risk, permissions, agents, models, tools, budgets, fallbacks, and observed decisions; Test and challenge ambiguous, adversarial, unavailable-tool, and degraded-provider cases; then report gaps and verify accuracy, unsafe misroutes, latency, cost, and escalation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "87. /evaluate-routing-logic"
    }
  },
  {
    "index": 88,
    "id": "evaluate-agent-handoffs",
    "version": "1.0.0",
    "slash": "/evaluate-agent-handoffs",
    "title": "Evaluate agent handoffs",
    "category": "AI Systems",
    "aliases": [
      "agent-handoffs-evaluate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Evaluate agent handoffs with evidence, risk-based prioritization, and reproducible verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover requirements and current state for triggers, payloads, schemas, decisions, evidence, memory, permissions, ownership, and return paths; Test and challenge normal, partial, failed, ambiguous, and circular transfers; then report gaps and verify lost constraints, duplication, context cost, and acceptance criteria.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "88. /evaluate-agent-handoffs"
    }
  },
  {
    "index": 89,
    "id": "optimize-tool-selection",
    "version": "1.0.0",
    "slash": "/optimize-tool-selection",
    "title": "Optimize tool selection",
    "category": "AI Systems",
    "aliases": [
      "tool-selection-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize tool selection safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Plan the smallest safe change to evidence, failure modes, edge cases, and project conventions; then implement incrementally and compare measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "89. /optimize-tool-selection"
    }
  },
  {
    "index": 90,
    "id": "optimize-context-windows",
    "version": "1.0.0",
    "slash": "/optimize-context-windows",
    "title": "Optimize context windows",
    "category": "AI Systems",
    "aliases": [
      "context-windows-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-context-retrieval",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize context windows safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline sources, trust, relevance, freshness, token size, truncation, summaries, retrieval, and invariant policy; Plan the smallest safe change to smallest sufficient context and source provenance; then implement incrementally and compare long-session, conflicting-context, and rehydration tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "90. /optimize-context-windows"
    }
  },
  {
    "index": 91,
    "id": "compress-context",
    "version": "1.0.0",
    "slash": "/compress-context",
    "title": "Compress context",
    "category": "AI Systems",
    "aliases": [
      "context-compress"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "optimize-context-retrieval",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Compress context safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline sources, trust, relevance, freshness, token size, truncation, summaries, retrieval, and invariant policy; Plan the smallest safe change to smallest sufficient context and source provenance; then implement incrementally and compare long-session, conflicting-context, and rehydration tests.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "91. /compress-context"
    }
  },
  {
    "index": 92,
    "id": "improve-retrieval",
    "version": "1.0.0",
    "slash": "/improve-retrieval",
    "title": "Improve retrieval",
    "category": "AI Systems",
    "aliases": [
      "retrieval-improve"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-context-retrieval",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Improve retrieval safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline corpus, chunking, metadata, indexes, query rewriting, filters, hybrid search, reranking, freshness, and permissions; Plan the smallest safe change to labeled queries and relevant/irrelevant evidence; then implement incrementally and compare recall, precision, ranking, latency, cost, and source provenance.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "92. /improve-retrieval"
    }
  },
  {
    "index": 93,
    "id": "improve-embeddings",
    "version": "1.0.0",
    "slash": "/improve-embeddings",
    "title": "Improve embeddings",
    "category": "AI Systems",
    "aliases": [
      "embeddings-improve"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-context-retrieval",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Improve embeddings safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline domain, languages, query/document lengths, preprocessing, dimensions, normalization, model version, and index settings; Plan the smallest safe change to pair and end-to-end retrieval evaluation; then implement incrementally and compare reindexing, dual-write migration, and provenance.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "93. /improve-embeddings"
    }
  },
  {
    "index": 94,
    "id": "improve-rag-quality",
    "version": "1.0.0",
    "slash": "/improve-rag-quality",
    "title": "Improve RAG quality",
    "category": "AI Systems",
    "aliases": [
      "rag-quality-improve"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-context-retrieval",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Improve RAG quality safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline ingestion, source quality, chunking, retrieval, reranking, context ordering, prompt, generation, citations, and answerability; Plan the smallest safe change to grounded accuracy, completeness, abstention, latency, and cost; then implement incrementally and compare conflicting/stale evidence and citation precision.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "94. /improve-rag-quality"
    }
  },
  {
    "index": 95,
    "id": "evaluate-memory-quality",
    "version": "1.0.0",
    "slash": "/evaluate-memory-quality",
    "title": "Evaluate memory quality",
    "category": "AI Systems",
    "aliases": [
      "memory-quality-evaluate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "optimize-context-retrieval",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Evaluate memory quality with evidence, risk-based prioritization, and reproducible verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover requirements and current state for memory types, sources, write triggers, consent, provenance, confidence, expiry, retrieval, correction, and deletion; Test and challenge task benefit versus privacy and error risk; then report gaps and verify stale, contradictory, sensitive, and cross-scope memory.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "95. /evaluate-memory-quality"
    }
  },
  {
    "index": 96,
    "id": "evaluate-agent-collaboration",
    "version": "1.0.0",
    "slash": "/evaluate-agent-collaboration",
    "title": "Evaluate agent collaboration",
    "category": "AI Systems",
    "aliases": [
      "agent-collaboration-evaluate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Evaluate agent collaboration with evidence, risk-based prioritization, and reproducible verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover requirements and current state for roles, shared state, communication, permissions, arbitration, handoffs, and accountable completion; Test and challenge single-agent baseline and multi-agent scenarios; then report gaps and verify quality, cost, latency, duplicate effort, and circular delegation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "96. /evaluate-agent-collaboration"
    }
  },
  {
    "index": 97,
    "id": "recommend-better-models",
    "version": "1.0.0",
    "slash": "/recommend-better-models",
    "title": "Recommend better models",
    "category": "AI Systems",
    "aliases": [
      "better-models-recommend"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Recommend better models using verified project evidence and a platform-agnostic execution contract.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Gather and normalize evidence for task families, quality criteria, context, tools, privacy, latency, cost, rate limits, and availability; Design and generate representative benchmarks and failure cases; then review and validate primary, fallback, degraded mode, and migration.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "97. /recommend-better-models"
    }
  },
  {
    "index": 98,
    "id": "reduce-token-usage",
    "version": "1.0.0",
    "slash": "/reduce-token-usage",
    "title": "Reduce token usage",
    "category": "AI Systems",
    "aliases": [
      "token-usage-reduce"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "optimize-context-retrieval",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Reduce token usage safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline input/output tokens by source, agent, tool, retry, and output section; Plan the smallest safe change to duplicate policy, irrelevant history, verbose results, and caching opportunities; then implement incrementally and compare quality floor, safety, and measured savings.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "98. /reduce-token-usage"
    }
  },
  {
    "index": 99,
    "id": "estimate-inference-cost",
    "version": "1.0.0",
    "slash": "/estimate-inference-cost",
    "title": "Estimate inference cost",
    "category": "AI Systems",
    "aliases": [
      "inference-cost-estimate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Estimate inference cost using verified project evidence and a platform-agnostic execution contract.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Discover and baseline model routes, prompt/output size, frequency, concurrency, retries, caching, tools, storage, and operations; Inspect and correlate typical, peak, and failure scenarios; then evaluate and rank ranges, sensitivity analysis, quality, and latency tradeoffs.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Benchmark the entire context/tool/retrieval recipe, not only the visible prompt or model.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "99. /estimate-inference-cost"
    }
  },
  {
    "index": 100,
    "id": "improve-ai-accuracy",
    "version": "1.0.0",
    "slash": "/improve-ai-accuracy",
    "title": "Improve AI accuracy",
    "category": "AI Systems",
    "aliases": [
      "ai-accuracy-improve"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "evaluate-ai-orchestration",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Improve AI accuracy safely, incrementally, and with measurable verification.",
    "where": "prompts, context assembly, routing, models, tools, retrieval, embeddings, memory, and evaluations.",
    "how": "Measure and baseline diff semantics, critical files, dependencies, migrations, tests, owners, complexity, deployment, and historical incidents; Plan the smallest safe change to risk factors, reviewer guidance, and verification; then implement incrementally and compare small high-impact config/permission changes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "AI Systems & Evaluation Agent; reasoning model with prompt, RAG, tool, memory, evaluation, and cost expertise.",
    "hiddenConnection": "Connect this command to prompt hierarchy, retrieval, tools, model routing, memory, evaluations, privacy, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "provider drift, injection, evaluation leakage, stale indexes, memory contamination, and distribution shift.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "100. /improve-ai-accuracy"
    }
  },
  {
    "index": 101,
    "id": "generate-unit-tests",
    "version": "1.0.0",
    "slash": "/generate-unit-tests",
    "title": "Generate unit tests",
    "category": "Testing",
    "aliases": [
      "unit-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate unit tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for test framework, public behavior, stable seams, edge cases, invalid input, and error paths; Design and generate deterministic fixtures, clocks, randomness, and isolation; then review and validate meaningful assertions and maintainability.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "101. /generate-unit-tests"
    }
  },
  {
    "index": 102,
    "id": "generate-integration-tests",
    "version": "1.0.0",
    "slash": "/generate-integration-tests",
    "title": "Generate integration tests",
    "category": "Testing",
    "aliases": [
      "integration-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate integration tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for real boundaries, contracts, dependencies, fixtures, cleanup, serialization, retries, partial failure, and consistency; Design and generate isolated environments and representative schemas; then review and validate ci reliability and state isolation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "102. /generate-integration-tests"
    }
  },
  {
    "index": 103,
    "id": "generate-e2e-tests",
    "version": "1.0.0",
    "slash": "/generate-e2e-tests",
    "title": "Generate E2E tests",
    "category": "Testing",
    "aliases": [
      "e2e-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate E2E tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for critical journeys, roles, browsers, data setup, auth, permissions, recovery, and cross-system behavior; Design and generate accessible selectors and diagnostic artifacts; then review and validate smoke subset versus broad scheduled suite.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "103. /generate-e2e-tests"
    }
  },
  {
    "index": 104,
    "id": "generate-smoke-tests",
    "version": "1.0.0",
    "slash": "/generate-smoke-tests",
    "title": "Generate smoke tests",
    "category": "Testing",
    "aliases": [
      "smoke-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate smoke tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for startup, auth, critical read/write, core journey, integrations, and health signals; Design and generate fast, safe, repeatable checks; then review and validate deployment artifact and actionable failure output.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "104. /generate-smoke-tests"
    }
  },
  {
    "index": 105,
    "id": "generate-regression-tests",
    "version": "1.0.0",
    "slash": "/generate-regression-tests",
    "title": "Generate regression tests",
    "category": "Testing",
    "aliases": [
      "regression-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate regression tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for smallest reliable reproduction, root cause, user-visible contract, and adjacent edge cases; Design and generate test fails on known-bad state and passes after fix; then review and validate issue linkage and escape-path coverage.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "105. /generate-regression-tests"
    }
  },
  {
    "index": 106,
    "id": "detect-missing-tests",
    "version": "1.0.0",
    "slash": "/detect-missing-tests",
    "title": "Detect missing tests",
    "category": "Testing",
    "aliases": [
      "missing-tests-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "assess-test-quality",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect missing tests with evidence, risk-based prioritization, and reproducible verification.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Inventory and map the exact scope, inputs, outputs, dependencies, and current behavior; Detect and reproduce evidence, failure modes, edge cases, and project conventions; then classify and prioritize measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "106. /detect-missing-tests"
    }
  },
  {
    "index": 107,
    "id": "increase-coverage",
    "version": "1.0.0",
    "slash": "/increase-coverage",
    "title": "Increase coverage",
    "category": "Testing",
    "aliases": [
      "coverage-increase"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Increase coverage safely, incrementally, and with measurable verification.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Measure and baseline risk, user journeys, branches, permissions, incidents, churn, complexity, and missing test levels; Plan the smallest safe change to behavioral and mutation value rather than raw line percentage; then implement incrementally and compare suite speed, stability, and prioritized gaps.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "107. /increase-coverage"
    }
  },
  {
    "index": 108,
    "id": "validate-existing-tests",
    "version": "1.0.0",
    "slash": "/validate-existing-tests",
    "title": "Validate existing tests",
    "category": "Testing",
    "aliases": [
      "existing-tests-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "assess-test-quality",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate existing tests with evidence, risk-based prioritization, and reproducible verification.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Discover requirements and current state for the exact scope, inputs, outputs, dependencies, and current behavior; Test and challenge evidence, failure modes, edge cases, and project conventions; then report gaps and verify measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "108. /validate-existing-tests"
    }
  },
  {
    "index": 109,
    "id": "generate-playwright-tests",
    "version": "1.0.0",
    "slash": "/generate-playwright-tests",
    "title": "Generate Playwright tests",
    "category": "Testing",
    "aliases": [
      "playwright-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate Playwright tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for routes, browser matrix, startup commands, fixtures, auth state, test IDs, traces, video, screenshots, and CI; Design and generate resilient locators and deterministic data; then review and validate headless/headed runs and flake diagnosis.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "109. /generate-playwright-tests"
    }
  },
  {
    "index": 110,
    "id": "generate-cypress-tests",
    "version": "1.0.0",
    "slash": "/generate-cypress-tests",
    "title": "Generate Cypress tests",
    "category": "Testing",
    "aliases": [
      "cypress-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate Cypress tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for version, component/e2e mode, commands, fixtures, intercepts, selectors, data setup, and CI; Design and generate real versus mocked boundaries; then review and validate arbitrary-wait removal and diagnostics.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "110. /generate-cypress-tests"
    }
  },
  {
    "index": 111,
    "id": "generate-jest-tests",
    "version": "1.0.0",
    "slash": "/generate-jest-tests",
    "title": "Generate Jest tests",
    "category": "Testing",
    "aliases": [
      "jest-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate Jest tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for config, transforms, environment, aliases, setup, ESM/CJS behavior, mocks, timers, and global state; Design and generate typed tests and stable contracts; then review and validate ci-equivalent execution and cleanup.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "111. /generate-jest-tests"
    }
  },
  {
    "index": 112,
    "id": "generate-vitest-tests",
    "version": "1.0.0",
    "slash": "/generate-vitest-tests",
    "title": "Generate Vitest tests",
    "category": "Testing",
    "aliases": [
      "vitest-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate Vitest tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for workspace, environment, aliases, setup, browser mode, ESM semantics, mocks, and framework libraries; Design and generate focused tests and test seams; then review and validate isolated plus full-suite execution.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "112. /generate-vitest-tests"
    }
  },
  {
    "index": 113,
    "id": "generate-api-tests",
    "version": "1.0.0",
    "slash": "/generate-api-tests",
    "title": "Generate API tests",
    "category": "Testing",
    "aliases": [
      "api-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate API tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for the exact scope, inputs, outputs, dependencies, and current behavior; Design and generate evidence, failure modes, edge cases, and project conventions; then review and validate measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "113. /generate-api-tests"
    }
  },
  {
    "index": 114,
    "id": "generate-load-tests",
    "version": "1.0.0",
    "slash": "/generate-load-tests",
    "title": "Generate load tests",
    "category": "Testing",
    "aliases": [
      "load-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate load tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for journey mix, arrival pattern, concurrency, think time, data, regions, duration, and safety limits; Design and generate ramp, steady, burst, soak, and recovery; then review and validate latency percentiles, errors, saturation, and abort thresholds.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "114. /generate-load-tests"
    }
  },
  {
    "index": 115,
    "id": "generate-stress-tests",
    "version": "1.0.0",
    "slash": "/generate-stress-tests",
    "title": "Generate stress tests",
    "category": "Testing",
    "aliases": [
      "stress-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate stress tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for constrained resources, gradual overload, failure mode, queueing, rejection, data integrity, and recovery; Design and generate safe environment and abort thresholds; then review and validate graceful degradation and no silent corruption.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "115. /generate-stress-tests"
    }
  },
  {
    "index": 116,
    "id": "generate-security-tests",
    "version": "1.0.0",
    "slash": "/generate-security-tests",
    "title": "Generate security tests",
    "category": "Testing",
    "aliases": [
      "security-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate security tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for the exact scope, inputs, outputs, dependencies, and current behavior; Design and generate evidence, failure modes, edge cases, and project conventions; then review and validate measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "116. /generate-security-tests"
    }
  },
  {
    "index": 117,
    "id": "generate-accessibility-tests",
    "version": "1.0.0",
    "slash": "/generate-accessibility-tests",
    "title": "Generate accessibility tests",
    "category": "Testing",
    "aliases": [
      "accessibility-tests-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate accessibility tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for semantics, keyboard, focus, labels, contrast, zoom, motion, dynamic updates, screen-reader mental models, and WCAG; Design and generate automated plus manual evidence; then review and validate critical journeys and user impact.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "117. /generate-accessibility-tests"
    }
  },
  {
    "index": 118,
    "id": "generate-visual-regression-tests",
    "version": "1.0.0",
    "slash": "/generate-visual-regression-tests",
    "title": "Generate visual regression tests",
    "category": "Testing",
    "aliases": [
      "generate-visual-regression",
      "visual-regression-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "generate-tests",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Generate visual regression tests using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for components, journeys, viewports, browser, fonts, time, animation, data, baselines, and diff review; Design and generate nondeterminism control and semantic assertions; then review and validate intentional baseline approval.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "118. /generate-visual-regression-tests"
    }
  },
  {
    "index": 119,
    "id": "generate-ci-test-plan",
    "version": "1.0.0",
    "slash": "/generate-ci-test-plan",
    "title": "Generate CI test plan",
    "category": "Testing",
    "aliases": [
      "generate-ci-test",
      "ci-test-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "assess-test-quality",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Generate CI test plan using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Gather and normalize evidence for PR, merge, release, and scheduled gates; suite duration; dependencies; change graph; caching; parallelism; artifacts; and flakiness; Design and generate required versus advisory checks; then review and validate fast feedback without weakened release confidence.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "119. /generate-ci-test-plan"
    }
  },
  {
    "index": 120,
    "id": "score-test-quality",
    "version": "1.0.0",
    "slash": "/score-test-quality",
    "title": "Score test quality",
    "category": "Testing",
    "aliases": [
      "test-quality-score"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs"
    ],
    "primitiveId": "assess-test-quality",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Score test quality using verified project evidence and a platform-agnostic execution contract.",
    "where": "test suites, contracts, source seams, APIs, UI journeys, infrastructure checks, fixtures, and CI gates.",
    "how": "Discover and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Inspect and correlate evidence, failure modes, edge cases, and project conventions; then evaluate and rank measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Test Engineering Agent; code-specialized model with test design, fixtures, mocking, and CI expertise.",
    "hiddenConnection": "Connect this command to risk, user journeys, changed files, contracts, observability, and release gates; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "flaky dependencies, clocks, shared state, unrealistic mocks, and untested operational failures.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "120. /score-test-quality"
    }
  },
  {
    "index": 121,
    "id": "audit-ci-cd",
    "version": "1.0.0",
    "slash": "/audit-ci-cd",
    "title": "Audit CI/CD",
    "category": "DevOps & Operations",
    "aliases": [
      "ci-cd-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "validate-ci-iac",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit CI/CD with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover and baseline triggers, permissions, secrets, runners, caches, artifacts, workflows, environments, approvals, and deploy targets; Inspect and correlate reproducibility, isolation, fork safety, supply chain, and rollback; then evaluate and rank source-controlled evidence versus external settings.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "121. /audit-ci-cd"
    }
  },
  {
    "index": 122,
    "id": "optimize-github-actions",
    "version": "1.0.0",
    "slash": "/optimize-github-actions",
    "title": "Optimize GitHub Actions",
    "category": "DevOps & Operations",
    "aliases": [
      "github-actions-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "validate-ci-iac",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize GitHub Actions safely, incrementally, and with measurable verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Measure and baseline workflows, events, permissions, third-party actions, runners, caching, matrices, artifacts, and concurrency; Plan the smallest safe change to pinned actions, reusable workflows, fork safety, and runtime cost; then implement incrementally and compare before/after reliability and duration.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "122. /optimize-github-actions"
    }
  },
  {
    "index": 123,
    "id": "validate-dockerfiles",
    "version": "1.0.0",
    "slash": "/validate-dockerfiles",
    "title": "Validate Dockerfiles",
    "category": "DevOps & Operations",
    "aliases": [
      "dockerfiles-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "validate-ci-iac",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate Dockerfiles with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for Dockerfiles, build contexts, .dockerignore, base images, multi-stage builds, users, signals, health checks, and secrets; Test and challenge reproducibility, image size, startup, shutdown, and non-root behavior; then report gaps and verify safe build and scan.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "123. /validate-dockerfiles"
    }
  },
  {
    "index": 124,
    "id": "validate-kubernetes-configs",
    "version": "1.0.0",
    "slash": "/validate-kubernetes-configs",
    "title": "Validate Kubernetes configs",
    "category": "DevOps & Operations",
    "aliases": [
      "kubernetes-configs-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "validate-ci-iac",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate Kubernetes configs with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for manifests, Helm, overlays, namespaces, probes, requests/limits, security context, RBAC, networking, disruption, and rollout; Test and challenge rendered schema/policy validation versus live cluster; then report gaps and verify environment-specific assumptions and no-apply default.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "124. /validate-kubernetes-configs"
    }
  },
  {
    "index": 125,
    "id": "validate-terraform",
    "version": "1.0.0",
    "slash": "/validate-terraform",
    "title": "Validate Terraform",
    "category": "DevOps & Operations",
    "aliases": [
      "terraform-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "validate-ci-iac",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate Terraform with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for modules, providers, versions, variables, state, backend, workspace, lifecycle, imports, plan, and destructive changes; Test and challenge format/validate/plan/policy without apply; then report gaps and verify state protection and blast-radius review.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "125. /validate-terraform"
    }
  },
  {
    "index": 126,
    "id": "audit-infrastructure",
    "version": "1.0.0",
    "slash": "/audit-infrastructure",
    "title": "Audit infrastructure",
    "category": "DevOps & Operations",
    "aliases": [
      "infrastructure-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "validate-ci-iac",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit infrastructure with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover and baseline accounts, networks, compute, data, identity, observability, dependencies, quotas, redundancy, patching, and IaC versus live state; Inspect and correlate single points of failure, cost, and recovery; then evaluate and rank manual console drift and no-write default.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "126. /audit-infrastructure"
    }
  },
  {
    "index": 127,
    "id": "detect-deployment-risks",
    "version": "1.0.0",
    "slash": "/detect-deployment-risks",
    "title": "Detect deployment risks",
    "category": "DevOps & Operations",
    "aliases": [
      "deployment-risks-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect deployment risks with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Inventory and map release candidate versus deployed baseline, migrations, flags, compatibility, capacity, observability, and rollback; Detect and reproduce blast radius, reversibility, and go/no-go criteria; then classify and prioritize environment-specific preflight and post-deploy verification.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "127. /detect-deployment-risks"
    }
  },
  {
    "index": 128,
    "id": "optimize-cloud-costs",
    "version": "1.0.0",
    "slash": "/optimize-cloud-costs",
    "title": "Optimize cloud costs",
    "category": "DevOps & Operations",
    "aliases": [
      "cloud-costs-optimize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "optimize-infrastructure-cost",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Optimize cloud costs safely, incrementally, and with measurable verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Measure and baseline billing dimensions, usage, tags, idle/oversized resources, egress, logs, snapshots, and service minimums; Plan the smallest safe change to savings, reliability, security, and capacity tradeoffs; then implement incrementally and compare owners, anomaly alerts, and measured cost change.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "128. /optimize-cloud-costs"
    }
  },
  {
    "index": 129,
    "id": "validate-secrets-management",
    "version": "1.0.0",
    "slash": "/validate-secrets-management",
    "title": "Validate secrets management",
    "category": "DevOps & Operations",
    "aliases": [
      "secrets-management-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "validate-secrets-config",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate secrets management with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for source, history, logs, build artifacts, CI, environment files, containers, and provider patterns; Test and challenge redacted validation, rotation, revocation, and retained copies; then report gaps and verify pre-commit/ci prevention and credential lifecycle.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "129. /validate-secrets-management"
    }
  },
  {
    "index": 130,
    "id": "validate-backups",
    "version": "1.0.0",
    "slash": "/validate-backups",
    "title": "Validate backups",
    "category": "DevOps & Operations",
    "aliases": [
      "backups-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate backups with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for systems, schedules, retention, encryption, isolation, permissions, alerts, RPO, RTO, and restore targets; Test and challenge actual restore testing and usable recovered application; then report gaps and verify same-failure and attacker isolation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "130. /validate-backups"
    }
  },
  {
    "index": 131,
    "id": "validate-monitoring",
    "version": "1.0.0",
    "slash": "/validate-monitoring",
    "title": "Validate monitoring",
    "category": "DevOps & Operations",
    "aliases": [
      "monitoring-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate monitoring with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for critical journeys, services, dependencies, SLOs, metrics, logs, traces, synthetics, dashboards, retention, and ownership; Test and challenge known-failure detection, noise, and gaps; then report gaps and verify user outcomes and actionable signals.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "131. /validate-monitoring"
    }
  },
  {
    "index": 132,
    "id": "validate-logging",
    "version": "1.0.0",
    "slash": "/validate-logging",
    "title": "Validate logging",
    "category": "DevOps & Operations",
    "aliases": [
      "logging-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate logging with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for libraries, schemas, levels, correlation, destinations, privacy, retention, cost, and cardinality; Test and challenge critical-flow diagnostic value and sensitive-data protection; then report gaps and verify machine-queryable and actionable output.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "132. /validate-logging"
    }
  },
  {
    "index": 133,
    "id": "validate-alerting",
    "version": "1.0.0",
    "slash": "/validate-alerting",
    "title": "Validate alerting",
    "category": "DevOps & Operations",
    "aliases": [
      "alerting-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate alerting with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for rules, thresholds, severity, routing, owners, schedules, silences, escalations, dashboards, and runbooks; Test and challenge false positives, missed incidents, and notification-path tests; then report gaps and verify pages versus informational tickets.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "133. /validate-alerting"
    }
  },
  {
    "index": 134,
    "id": "improve-rollback-strategy",
    "version": "1.0.0",
    "slash": "/improve-rollback-strategy",
    "title": "Improve rollback strategy",
    "category": "DevOps & Operations",
    "aliases": [
      "rollback-strategy-improve"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Improve rollback strategy safely, incrementally, and with measurable verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Measure and baseline reversibility, artifacts, feature flags, schema compatibility, data repair, triggers, owners, and verification; Plan the smallest safe change to tested non-production recovery and irreversible boundaries; then implement incrementally and compare forward fixes versus rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "134. /improve-rollback-strategy"
    }
  },
  {
    "index": 135,
    "id": "improve-disaster-recovery",
    "version": "1.0.0",
    "slash": "/improve-disaster-recovery",
    "title": "Improve disaster recovery",
    "category": "DevOps & Operations",
    "aliases": [
      "disaster-recovery-improve"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Improve disaster recovery safely, incrementally, and with measurable verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Measure and baseline critical services, dependencies, regions, providers, accounts, identity, control plane, RPO/RTO, backups, failover, and communication; Plan the smallest safe change to tabletop or technical exercise; then implement incrementally and compare access, credentials, capacity, and remediation tracking.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "135. /improve-disaster-recovery"
    }
  },
  {
    "index": 136,
    "id": "validate-autoscaling",
    "version": "1.0.0",
    "slash": "/validate-autoscaling",
    "title": "Validate autoscaling",
    "category": "DevOps & Operations",
    "aliases": [
      "autoscaling-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate autoscaling with evidence, risk-based prioritization, and reproducible verification.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover requirements and current state for compute model, signals, thresholds, quotas, minimums, cooldowns, warm-up, dependencies, and cost; Test and challenge ramp, burst, scale-down, failure, and cold start; then report gaps and verify database, queue, and third-party bottlenecks.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "136. /validate-autoscaling"
    }
  },
  {
    "index": 137,
    "id": "generate-deployment-checklist",
    "version": "1.0.0",
    "slash": "/generate-deployment-checklist",
    "title": "Generate deployment checklist",
    "category": "DevOps & Operations",
    "aliases": [
      "deployment-checklist-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate deployment checklist using verified project evidence and a platform-agnostic execution contract.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Gather and normalize evidence for release candidate versus deployed baseline, migrations, flags, compatibility, capacity, observability, and rollback; Design and generate blast radius, reversibility, and go/no-go criteria; then review and validate environment-specific preflight and post-deploy verification.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "137. /generate-deployment-checklist"
    }
  },
  {
    "index": 138,
    "id": "generate-release-checklist",
    "version": "1.0.0",
    "slash": "/generate-release-checklist",
    "title": "Generate release checklist",
    "category": "DevOps & Operations",
    "aliases": [
      "release-checklist-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate release checklist using verified project evidence and a platform-agnostic execution contract.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Gather and normalize evidence for actual scope, environment, diff, migrations, dependencies, approvals, tests, rollout, monitoring, rollback, and ownership; Design and generate blockers versus advisories; then review and validate executable evidence-based gates.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "138. /generate-release-checklist"
    }
  },
  {
    "index": 139,
    "id": "generate-runbooks",
    "version": "1.0.0",
    "slash": "/generate-runbooks",
    "title": "Generate runbooks",
    "category": "DevOps & Operations",
    "aliases": [
      "runbooks-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate runbooks using verified project evidence and a platform-agnostic execution contract.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Gather and normalize evidence for symptoms, prerequisites, safety, diagnosis, commands, expected outcomes, verification, rollback, escalation, dashboards, and owners; Design and generate tested instructions and versioning; then review and validate do-not-do boundaries under stress.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "139. /generate-runbooks"
    }
  },
  {
    "index": 140,
    "id": "score-operational-readiness",
    "version": "1.0.0",
    "slash": "/score-operational-readiness",
    "title": "Score operational readiness",
    "category": "DevOps & Operations",
    "aliases": [
      "operational-readiness-score"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-reliability",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Score operational readiness using verified project evidence and a platform-agnostic execution contract.",
    "where": "CI/CD, containers, infrastructure-as-code, cloud settings, secrets, monitoring, backups, and runbooks.",
    "how": "Discover and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Inspect and correlate evidence, failure modes, edge cases, and project conventions; then evaluate and rank measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Platform & Reliability Agent; infrastructure-aware model with CI/CD, containers, cloud, IaC, observability, and recovery expertise.",
    "hiddenConnection": "Connect this command to permissions, data migration, capacity, monitoring, rollback, recovery, and cost; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "manual console drift, hidden environment settings, quotas, regional differences, and untested restores.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "140. /score-operational-readiness"
    }
  },
  {
    "index": 141,
    "id": "audit-ux",
    "version": "1.0.0",
    "slash": "/audit-ux",
    "title": "Audit UX",
    "category": "Product & UX",
    "aliases": [
      "ux-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit UX with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline target users, journeys, devices, goals, information architecture, states, content, forms, errors, loading, empty states, and responsiveness; Inspect and correlate analytics, support, research, accessibility, and technical feasibility; then evaluate and rank edge/recovery states and prioritized impact.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "141. /audit-ux"
    }
  },
  {
    "index": 142,
    "id": "audit-accessibility",
    "version": "1.0.0",
    "slash": "/audit-accessibility",
    "title": "Audit accessibility",
    "category": "Product & UX",
    "aliases": [
      "accessibility-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit accessibility with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline semantics, keyboard, focus, labels, contrast, zoom, motion, dynamic updates, screen-reader mental models, and WCAG; Inspect and correlate automated plus manual evidence; then evaluate and rank critical journeys and user impact.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "142. /audit-accessibility"
    }
  },
  {
    "index": 143,
    "id": "audit-onboarding",
    "version": "1.0.0",
    "slash": "/audit-onboarding",
    "title": "Audit onboarding",
    "category": "Product & UX",
    "aliases": [
      "onboarding-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit onboarding with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline entry sources, signup, permissions, setup, education, empty states, first value, abandonment, and activation; Inspect and correlate personas, required knowledge, and recovery; then evaluate and rank instrumentation and experiments.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "143. /audit-onboarding"
    }
  },
  {
    "index": 144,
    "id": "audit-navigation",
    "version": "1.0.0",
    "slash": "/audit-navigation",
    "title": "Audit navigation",
    "category": "Product & UX",
    "aliases": [
      "navigation-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit navigation with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline global/local/contextual navigation, search, breadcrumbs, mobile, labels, hierarchy, deep links, permissions, and dead ends; Inspect and correlate user mental models and task tests; then evaluate and rank accessibility and migration.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "144. /audit-navigation"
    }
  },
  {
    "index": 145,
    "id": "audit-conversion-funnel",
    "version": "1.0.0",
    "slash": "/audit-conversion-funnel",
    "title": "Audit conversion funnel",
    "category": "Product & UX",
    "aliases": [
      "conversion-funnel-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit conversion funnel with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline stage definitions, eligibility, denominators, time windows, segments, data quality, drop-off, errors, performance, trust, and pricing; Inspect and correlate quantitative plus qualitative evidence; then evaluate and rank hypotheses, experiments, and non-manipulative design.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "145. /audit-conversion-funnel"
    }
  },
  {
    "index": 146,
    "id": "audit-feature-discoverability",
    "version": "1.0.0",
    "slash": "/audit-feature-discoverability",
    "title": "Audit feature discoverability",
    "category": "Product & UX",
    "aliases": [
      "feature-discoverability-audit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Audit feature discoverability with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline features, entry points, timing, labels, navigation, context, empty states, education, permissions, and adoption; Inspect and correlate low demand versus poor discoverability; then evaluate and rank successful use rather than clicks.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "146. /audit-feature-discoverability"
    }
  },
  {
    "index": 147,
    "id": "detect-abandoned-features",
    "version": "1.0.0",
    "slash": "/detect-abandoned-features",
    "title": "Detect abandoned features",
    "category": "Product & UX",
    "aliases": [
      "abandoned-features-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect abandoned features with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Inventory and map code, routes, flags, analytics, support, docs, roadmap, ownership, usage, and contractual obligations; Detect and reproduce seasonal, internal, critical-small-segment, or obsolete classification; then classify and prioritize deprecation, communication, data, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "147. /detect-abandoned-features"
    }
  },
  {
    "index": 148,
    "id": "detect-inconsistent-ux",
    "version": "1.0.0",
    "slash": "/detect-inconsistent-ux",
    "title": "Detect inconsistent UX",
    "category": "Product & UX",
    "aliases": [
      "inconsistent-ux-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "audit-product-ux",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect inconsistent UX with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Inventory and map target users, journeys, devices, goals, information architecture, states, content, forms, errors, loading, empty states, and responsiveness; Detect and reproduce analytics, support, research, accessibility, and technical feasibility; then classify and prioritize edge/recovery states and prioritized impact.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "148. /detect-inconsistent-ux"
    }
  },
  {
    "index": 149,
    "id": "recommend-new-features",
    "version": "1.0.0",
    "slash": "/recommend-new-features",
    "title": "Recommend new features",
    "category": "Product & UX",
    "aliases": [
      "new-features-recommend"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Recommend new features using verified project evidence and a platform-agnostic execution contract.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Gather and normalize evidence for the exact scope, inputs, outputs, dependencies, and current behavior; Design and generate evidence, failure modes, edge cases, and project conventions; then review and validate measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "149. /recommend-new-features"
    }
  },
  {
    "index": 150,
    "id": "prioritize-backlog",
    "version": "1.0.0",
    "slash": "/prioritize-backlog",
    "title": "Prioritize backlog",
    "category": "Product & UX",
    "aliases": [
      "backlog-prioritize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Prioritize backlog safely, incrementally, and with measurable verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Normalize and de-duplicate duplicate normalization, value, reach, risk reduction, urgency, learning, effort, confidence, dependencies, and capacity; Score and compare mandatory risk work versus discretionary bets; then sequence and explain now/next/later rationale.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "150. /prioritize-backlog"
    }
  },
  {
    "index": 151,
    "id": "build-roadmap",
    "version": "1.0.0",
    "slash": "/build-roadmap",
    "title": "Build roadmap",
    "category": "Product & UX",
    "aliases": [
      "roadmap-build"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Build roadmap using verified project evidence and a platform-agnostic execution contract.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Gather and normalize evidence for strategy, outcomes, commitments, capacity, dependencies, risk, discovery, foundations, delivery, rollout, and learning; Design and generate themes and measurable outcomes; then review and validate confidence, alternatives, and decision points.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "151. /build-roadmap"
    }
  },
  {
    "index": 152,
    "id": "estimate-effort",
    "version": "1.0.0",
    "slash": "/estimate-effort",
    "title": "Estimate effort",
    "category": "Product & UX",
    "aliases": [
      "effort-estimate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Estimate effort using verified project evidence and a platform-agnostic execution contract.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline scope, acceptance criteria, team, environment, discovery, implementation, tests, migration, rollout, docs, support, and unknowns; Inspect and correlate ranges, confidence, assumptions, and risk scenarios; then evaluate and rank elapsed time versus engineering effort.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "152. /estimate-effort"
    }
  },
  {
    "index": 153,
    "id": "identify-quick-wins",
    "version": "1.0.0",
    "slash": "/identify-quick-wins",
    "title": "Identify quick wins",
    "category": "Product & UX",
    "aliases": [
      "quick-wins-identify"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Identify quick wins with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Inventory and map impact, effort, confidence, reversibility, dependencies, enabling value, and success metric; Detect and reproduce genuinely small versus hidden foundational work; then classify and prioritize temporary relief versus durable improvement.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "153. /identify-quick-wins"
    }
  },
  {
    "index": 154,
    "id": "identify-high-risk-work",
    "version": "1.0.0",
    "slash": "/identify-high-risk-work",
    "title": "Identify high-risk work",
    "category": "Product & UX",
    "aliases": [
      "identify-high-risk",
      "high-risk-identify"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Identify high-risk work with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Inventory and map blast radius, uncertainty, data, security, permissions, irreversibility, dependencies, ownership, observability, and rollback; Detect and reproduce impact, likelihood, detectability, and mitigation; then classify and prioritize spikes, gates, staged rollout, and decision thresholds.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "154. /identify-high-risk-work"
    }
  },
  {
    "index": 155,
    "id": "identify-blockers",
    "version": "1.0.0",
    "slash": "/identify-blockers",
    "title": "Identify blockers",
    "category": "Product & UX",
    "aliases": [
      "blockers-identify"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Identify blockers with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Inventory and map goals, critical path, dependencies, decisions, access, environment, data, skills, external commitments, owner, and fallback; Detect and reproduce true blocker versus parallelizable risk; then classify and prioritize next action, due date, and escalation.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "155. /identify-blockers"
    }
  },
  {
    "index": 156,
    "id": "detect-scope-creep",
    "version": "1.0.0",
    "slash": "/detect-scope-creep",
    "title": "Detect scope creep",
    "category": "Product & UX",
    "aliases": [
      "scope-creep-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect scope creep with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Inventory and map original objective, acceptance criteria, decisions, change requests, quality bars, dependencies, and current plan; Detect and reproduce clarification, defect, required dependency, improvement, or true expansion; then classify and prioritize impact and approval.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "156. /detect-scope-creep"
    }
  },
  {
    "index": 157,
    "id": "validate-mvp",
    "version": "1.0.0",
    "slash": "/validate-mvp",
    "title": "Validate MVP",
    "category": "Product & UX",
    "aliases": [
      "mvp-validate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Validate MVP with evidence, risk-based prioritization, and reproducible verification.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover requirements and current state for target user, problem, hypothesis, critical journey, learning objective, required viability, safety, reliability, operations, support, and exclusions; Test and challenge smallest coherent solution, not simply fewest features; then report gaps and verify success/failure metrics and staged scope.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "157. /validate-mvp"
    }
  },
  {
    "index": 158,
    "id": "generate-release-notes",
    "version": "1.0.0",
    "slash": "/generate-release-notes",
    "title": "Generate release notes",
    "category": "Product & UX",
    "aliases": [
      "release-notes-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate release notes using verified project evidence and a platform-agnostic execution contract.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Gather and normalize evidence for merged changes, deployed flags, migrations, fixes, known issues, user-visible behavior, operators, developers, and security sensitivity; Design and generate added/changed/fixed/deprecated/breaking classifications; then review and validate verified enabled behavior only.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "158. /generate-release-notes"
    }
  },
  {
    "index": 159,
    "id": "generate-changelog",
    "version": "1.0.0",
    "slash": "/generate-changelog",
    "title": "Generate changelog",
    "category": "Product & UX",
    "aliases": [
      "changelog-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate changelog using verified project evidence and a platform-agnostic execution contract.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Gather and normalize evidence for versions, tags, commits, PRs, reverts, dates, public versus internal changes, configuration, and migrations; Design and generate consistent format and unreleased section; then review and validate behavior-focused entries.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Pair quantitative evidence with observed user behavior; the largest visible problem is not always the highest-value opportunity.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "159. /generate-changelog"
    }
  },
  {
    "index": 160,
    "id": "score-product-maturity",
    "version": "1.0.0",
    "slash": "/score-product-maturity",
    "title": "Score product maturity",
    "category": "Product & UX",
    "aliases": [
      "product-maturity-score"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "plan-product-delivery",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Score product maturity using verified project evidence and a platform-agnostic execution contract.",
    "where": "user journeys, UI states, navigation, analytics, backlog, content, product behavior, and documentation.",
    "how": "Discover and baseline diff semantics, critical files, dependencies, migrations, tests, owners, complexity, deployment, and historical incidents; Inspect and correlate risk factors, reviewer guidance, and verification; then evaluate and rank small high-impact config/permission changes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Product, UX & Accessibility Agent; product-reasoning model with UX, accessibility, analytics, and technical feasibility awareness.",
    "hiddenConnection": "Connect this command to support burden, conversion, retention, accessibility, instrumentation, and technical constraints; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "missing analytics, biased feedback, edge users, assistive technology, and segment-specific workflows.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "160. /score-product-maturity"
    }
  },
  {
    "index": 161,
    "id": "summarize-the-last-100-commits",
    "version": "1.0.0",
    "slash": "/summarize-the-last-100-commits",
    "title": "Summarize the last 100 commits",
    "category": "Repository Intelligence",
    "aliases": [
      "summarize-last-100",
      "last-100-summarize"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--time-window",
      "--branch"
    ],
    "primitiveId": "analyze-git-history",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Summarize the last 100 commits using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Discover and baseline default branch, merge style, tags, authors, diffs, PRs, reverts, files, features, fixes, refactors, infrastructure, and docs; Inspect and correlate thematic behavior summary rather than message dump; then evaluate and rank incomplete work and release impact.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "161. /summarize-the-last-100-commits"
    }
  },
  {
    "index": 162,
    "id": "explain-recent-architectural-changes",
    "version": "1.0.0",
    "slash": "/explain-recent-architectural-changes",
    "title": "Explain recent architectural changes",
    "category": "Repository Intelligence",
    "aliases": [
      "explain-recent-architectural",
      "recent-architectural-explain"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--time-window",
      "--branch"
    ],
    "primitiveId": "analyze-git-history",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Explain recent architectural changes using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Discover and baseline the exact scope, inputs, outputs, dependencies, and current behavior; Inspect and correlate evidence, failure modes, edge cases, and project conventions; then evaluate and rank measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "162. /explain-recent-architectural-changes"
    }
  },
  {
    "index": 163,
    "id": "analyze-contributor-patterns",
    "version": "1.0.0",
    "slash": "/analyze-contributor-patterns",
    "title": "Analyze contributor patterns",
    "category": "Repository Intelligence",
    "aliases": [
      "contributor-patterns-analyze"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-git-history",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Analyze contributor patterns with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Discover and baseline commits, reviews, ownership, areas, bots, pair work, squashes, knowledge concentration, and privacy; Inspect and correlate system risk rather than individual productivity; then evaluate and rank documentation and reviewer coverage.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "163. /analyze-contributor-patterns"
    }
  },
  {
    "index": 164,
    "id": "detect-risky-prs",
    "version": "1.0.0",
    "slash": "/detect-risky-prs",
    "title": "Detect risky PRs",
    "category": "Repository Intelligence",
    "aliases": [
      "risky-prs-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect risky PRs with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map diff semantics, critical files, dependencies, migrations, tests, owners, complexity, deployment, and historical incidents; Detect and reproduce risk factors, reviewer guidance, and verification; then classify and prioritize small high-impact config/permission changes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "164. /detect-risky-prs"
    }
  },
  {
    "index": 165,
    "id": "detect-stale-branches",
    "version": "1.0.0",
    "slash": "/detect-stale-branches",
    "title": "Detect stale branches",
    "category": "Repository Intelligence",
    "aliases": [
      "stale-branches-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--time-window",
      "--branch"
    ],
    "primitiveId": "analyze-git-history",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect stale branches with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map default, release, environment, feature, protected branches, age, ahead/behind, unique commits, PRs, checks, deployments, and ownership; Detect and reproduce retain, archive, merge, or delete recommendations; then classify and prioritize no deletion and deployment references.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "165. /detect-stale-branches"
    }
  },
  {
    "index": 166,
    "id": "detect-abandoned-work",
    "version": "1.0.0",
    "slash": "/detect-abandoned-work",
    "title": "Detect abandoned work",
    "category": "Repository Intelligence",
    "aliases": [
      "abandoned-work-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "analyze-git-history",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect abandoned work with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map the exact scope, inputs, outputs, dependencies, and current behavior; Detect and reproduce evidence, failure modes, edge cases, and project conventions; then classify and prioritize measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "166. /detect-abandoned-work"
    }
  },
  {
    "index": 167,
    "id": "detect-merge-conflicts-before-merging",
    "version": "1.0.0",
    "slash": "/detect-merge-conflicts-before-merging",
    "title": "Detect merge conflicts before merging",
    "category": "Repository Intelligence",
    "aliases": [
      "detect-merge-conflicts",
      "merge-conflicts-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect merge conflicts before merging with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map source/target branches, trial merge/rebase in isolated worktree, symbols, schemas, routes, lockfiles, migrations, and generated artifacts; Detect and reproduce textual and semantic conflict; then classify and prioritize resolution options and verification.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "167. /detect-merge-conflicts-before-merging"
    }
  },
  {
    "index": 168,
    "id": "analyze-branch-health",
    "version": "1.0.0",
    "slash": "/analyze-branch-health",
    "title": "Analyze branch health",
    "category": "Repository Intelligence",
    "aliases": [
      "branch-health-analyze"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Analyze branch health with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Discover and baseline default, release, environment, feature, protected branches, age, ahead/behind, unique commits, PRs, checks, deployments, and ownership; Inspect and correlate retain, archive, merge, or delete recommendations; then evaluate and rank no deletion and deployment references.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "168. /analyze-branch-health"
    }
  },
  {
    "index": 169,
    "id": "analyze-repository-health",
    "version": "1.0.0",
    "slash": "/analyze-repository-health",
    "title": "Analyze repository health",
    "category": "Repository Intelligence",
    "aliases": [
      "repository-health-analyze"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Analyze repository health with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Discover and baseline code quality, dependencies, tests, CI, branches, issues, docs, ownership, history, and operations; Inspect and correlate methodology, confidence, systemic risk, and trend; then evaluate and rank current defects versus structural risk.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "169. /analyze-repository-health"
    }
  },
  {
    "index": 170,
    "id": "build-dependency-graph",
    "version": "1.0.0",
    "slash": "/build-dependency-graph",
    "title": "Build dependency graph",
    "category": "Repository Intelligence",
    "aliases": [
      "dependency-graph-build"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-graphs",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Build dependency graph using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Gather and normalize evidence for languages, modules, imports, workspaces, packages, services, data stores, external APIs, edge type, direction, condition, and confidence; Design and generate cycles, centrality, critical paths, and boundary violations; then review and validate machine-readable plus human-readable output.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "170. /build-dependency-graph"
    }
  },
  {
    "index": 171,
    "id": "build-ownership-graph",
    "version": "1.0.0",
    "slash": "/build-ownership-graph",
    "title": "Build ownership graph",
    "category": "Repository Intelligence",
    "aliases": [
      "ownership-graph-build"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-graphs",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Build ownership graph using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Gather and normalize evidence for formal ownership, Git history, reviews, docs, service ownership, observed maintainership, orphaned areas, and knowledge concentration; Design and generate evidence and confidence; then review and validate privacy and no performance scoring.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "171. /build-ownership-graph"
    }
  },
  {
    "index": 172,
    "id": "build-knowledge-graph",
    "version": "1.0.0",
    "slash": "/build-knowledge-graph",
    "title": "Build knowledge graph",
    "category": "Repository Intelligence",
    "aliases": [
      "knowledge-graph-build"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-graphs",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Build knowledge graph using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Gather and normalize evidence for ontology, entities, concepts, components, decisions, owners, APIs, data, incidents, docs, relationships, provenance, confidence, and timestamps; Design and generate duplicate resolution and stale edges; then review and validate access controls and rationale nodes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "172. /build-knowledge-graph"
    }
  },
  {
    "index": 173,
    "id": "detect-undocumented-areas",
    "version": "1.0.0",
    "slash": "/detect-undocumented-areas",
    "title": "Detect undocumented areas",
    "category": "Repository Intelligence",
    "aliases": [
      "undocumented-areas-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect undocumented areas with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map critical modules, public interfaces, decisions, onboarding, APIs, migrations, runbooks, ownership, freshness, audience, and discoverability; Detect and reproduce right document type and risk; then classify and prioritize missing why and operational failure guidance.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "173. /detect-undocumented-areas"
    }
  },
  {
    "index": 174,
    "id": "detect-high-churn-files",
    "version": "1.0.0",
    "slash": "/detect-high-churn-files",
    "title": "Detect high-churn files",
    "category": "Repository Intelligence",
    "aliases": [
      "detect-high-churn",
      "high-churn-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect high-churn files with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map change frequency, co-change, authorship, size, complexity, tests, incidents, generated files, and restructures; Detect and reproduce healthy activity versus risk hotspot; then classify and prioritize churn plus centrality plus low coverage.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "174. /detect-high-churn-files"
    }
  },
  {
    "index": 175,
    "id": "detect-fragile-code",
    "version": "1.0.0",
    "slash": "/detect-fragile-code",
    "title": "Detect fragile code",
    "category": "Repository Intelligence",
    "aliases": [
      "fragile-code-detect"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Detect fragile code with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map complexity, coupling, hidden state, ordering, global state, undocumented data shapes, tests, history, incidents, and invariants; Detect and reproduce boundary/failure probes; then classify and prioritize characterization tests and hardening.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "175. /detect-fragile-code"
    }
  },
  {
    "index": 176,
    "id": "predict-regression-risk",
    "version": "1.0.0",
    "slash": "/predict-regression-risk",
    "title": "Predict regression risk",
    "category": "Repository Intelligence",
    "aliases": [
      "regression-risk-predict"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Predict regression risk with evidence, risk-based prioritization, and reproducible verification.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Inventory and map dependency impact, churn, complexity, ownership, tests, incidents, diff semantics, deployment scope, and history; Detect and reproduce transparent heuristic and confidence; then classify and prioritize verification allocation, not automatic blocking.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "176. /predict-regression-risk"
    }
  },
  {
    "index": 177,
    "id": "recommend-cleanup",
    "version": "1.0.0",
    "slash": "/recommend-cleanup",
    "title": "Recommend cleanup",
    "category": "Repository Intelligence",
    "aliases": [
      "cleanup-recommend"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "clean-code",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Recommend cleanup using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Gather and normalize evidence for the exact scope, inputs, outputs, dependencies, and current behavior; Design and generate evidence, failure modes, edge cases, and project conventions; then review and validate measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "177. /recommend-cleanup"
    }
  },
  {
    "index": 178,
    "id": "generate-executive-summary",
    "version": "1.0.0",
    "slash": "/generate-executive-summary",
    "title": "Generate executive summary",
    "category": "Repository Intelligence",
    "aliases": [
      "executive-summary-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate executive summary using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Gather and normalize evidence for audience, decision, current state, outcomes, impact, risks, options, approvals, confidence, and next actions; Design and generate facts versus implications versus recommendations; then review and validate lead with decision, not chronology.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "178. /generate-executive-summary"
    }
  },
  {
    "index": 179,
    "id": "estimate-project-health",
    "version": "1.0.0",
    "slash": "/estimate-project-health",
    "title": "Estimate project health",
    "category": "Repository Intelligence",
    "aliases": [
      "project-health-estimate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "assess-repository-risk",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Estimate project health using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Discover and baseline diff semantics, critical files, dependencies, migrations, tests, owners, complexity, deployment, and historical incidents; Inspect and correlate risk factors, reviewer guidance, and verification; then evaluate and rank small high-impact config/permission changes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Use risk, dependency, and reversibility to decide depth and execution order rather than treating every finding equally.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "179. /estimate-project-health"
    }
  },
  {
    "index": 180,
    "id": "generate-engineering-scorecard",
    "version": "1.0.0",
    "slash": "/generate-engineering-scorecard",
    "title": "Generate engineering scorecard",
    "category": "Repository Intelligence",
    "aliases": [
      "engineering-scorecard-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Generate engineering scorecard using verified project evidence and a platform-agnostic execution contract.",
    "where": "Git history, branches, commits, pull requests, ownership, dependencies, documentation, and change patterns.",
    "how": "Gather and normalize evidence for the exact scope, inputs, outputs, dependencies, and current behavior; Design and generate evidence, failure modes, edge cases, and project conventions; then review and validate measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Repository Intelligence Agent; long-context model with Git history, graph analysis, ownership, and risk scoring.",
    "hiddenConnection": "Connect this command to change frequency, dependency centrality, ownership, tests, incidents, and business criticality; do not evaluate it as an isolated local task.",
    "proMove": "Combine static evidence with runtime behavior, change history, ownership, tests, and production impact before prioritizing.",
    "unknownUnknown": "squashed history, bots, rebases, external work, monorepo boundaries, and undocumented ownership.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "180. /generate-engineering-scorecard"
    }
  },
  {
    "index": 181,
    "id": "continue-until-finished",
    "version": "1.0.0",
    "slash": "/continue-until-finished",
    "title": "Continue until finished",
    "category": "Autonomous Execution",
    "aliases": [
      "until-finished-continue"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Continue until finished safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for the exact scope, inputs, outputs, dependencies, and current behavior; Plan bounded execution around evidence, failure modes, edge cases, and project conventions; then execute, checkpoint, and verify measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "181. /continue-until-finished"
    }
  },
  {
    "index": 182,
    "id": "work-completely-autonomously",
    "version": "1.0.0",
    "slash": "/work-completely-autonomously",
    "title": "Work completely autonomously",
    "category": "Autonomous Execution",
    "aliases": [
      "completely-autonomously-work"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "high",
    "status": "experimental",
    "what": "Work completely autonomously safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for objective, allowed tools, environments, permissions, budgets, prohibited actions, checkpoints, and escalation gates; Plan bounded execution around plan, execute, verify, self-review, document; then execute, checkpoint, and verify minimal interruptions without bypassing governance.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "182. /work-completely-autonomously"
    }
  },
  {
    "index": 183,
    "id": "stop-only-for-destructive-operations",
    "version": "1.0.0",
    "slash": "/stop-only-for-destructive-operations",
    "title": "Stop only for destructive operations",
    "category": "Autonomous Execution",
    "aliases": [
      "stop-only-destructive",
      "only-destructive-stop"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "high",
    "status": "experimental",
    "what": "Stop only for destructive operations safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for reversibility, blast radius, data impact, production, permissions, billing, external communication, and irreversible side effects; Plan bounded execution around safe automatic actions versus approval packet; then execute, checkpoint, and verify no action-splitting to evade gates.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "183. /stop-only-for-destructive-operations"
    }
  },
  {
    "index": 184,
    "id": "batch-similar-work-together",
    "version": "1.0.0",
    "slash": "/batch-similar-work-together",
    "title": "Batch similar work together",
    "category": "Autonomous Execution",
    "aliases": [
      "batch-similar-work",
      "similar-work-batch"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Batch similar work together safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for task dependency graph, shared files, tools, environments, risks, and verification; Plan bounded execution around reviewable and reversible batch boundaries; then execute, checkpoint, and verify shared discovery versus separate behavior changes.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "184. /batch-similar-work-together"
    }
  },
  {
    "index": 185,
    "id": "verify-every-change-before-continuing",
    "version": "1.0.0",
    "slash": "/verify-every-change-before-continuing",
    "title": "Verify every change before continuing",
    "category": "Autonomous Execution",
    "aliases": [
      "verify-change-continuing",
      "change-continuing-verify"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Verify every change before continuing with evidence, risk-based prioritization, and reproducible verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Discover requirements and current state for smallest relevant check per edit, broader checks per batch, and full gates at completion; Test and challenge exact commands, results, pre-existing failures, and rollback; then report gaps and verify do not proceed from inconsistent state.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "185. /verify-every-change-before-continuing"
    }
  },
  {
    "index": 186,
    "id": "self-review-every-implementation",
    "version": "1.0.0",
    "slash": "/self-review-every-implementation",
    "title": "Self-review every implementation",
    "category": "Autonomous Execution",
    "aliases": [
      "self-review-implementation",
      "review-implementation-self"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Self-review every implementation safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for requirements, final diff, correctness, edge cases, security, performance, tests, docs, and unintended changes; Plan bounded execution around fresh adversarial pass and falsification; then execute, checkpoint, and verify confirmation bias reduction.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "186. /self-review-every-implementation"
    }
  },
  {
    "index": 187,
    "id": "compare-against-best-practices",
    "version": "1.0.0",
    "slash": "/compare-against-best-practices",
    "title": "Compare against best practices",
    "category": "Autonomous Execution",
    "aliases": [
      "compare-against-best",
      "against-best-compare"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "evaluate-best-practices",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Compare against best practices with evidence, risk-based prioritization, and reproducible verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Discover requirements and current state for actual framework, runtime, deployment, project stage, authoritative guidance, local decisions, and constraints; Test and challenge required safety/correctness versus preference; then report gaps and verify documented justified deviations.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "187. /compare-against-best-practices"
    }
  },
  {
    "index": 188,
    "id": "search-for-better-approaches",
    "version": "1.0.0",
    "slash": "/search-for-better-approaches",
    "title": "Search for better approaches",
    "category": "Autonomous Execution",
    "aliases": [
      "search-better-approaches",
      "better-approaches-search"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "evaluate-best-practices",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Search for better approaches safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for problem, constraints, current approach, decision criteria, primary sources when allowed, alternatives, and status quo; Plan bounded execution around migration, operations, security, cost, reversibility, and counterarguments; then execute, checkpoint, and verify recommend one with evidence.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "188. /search-for-better-approaches"
    }
  },
  {
    "index": 189,
    "id": "apply-fixes-incrementally",
    "version": "1.0.0",
    "slash": "/apply-fixes-incrementally",
    "title": "Apply fixes incrementally",
    "category": "Autonomous Execution",
    "aliases": [
      "fixes-incrementally-apply"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "medium",
    "status": "experimental",
    "what": "Apply fixes incrementally safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Measure and baseline root causes, dependency order, small batches, expected impact, tests, checkpoints, and repository consistency; Plan the smallest safe change to no unrelated cleanup; then implement incrementally and compare observability/test foundations first.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Establish a baseline and regression guard first, then change one dependency-ordered batch at a time.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "189. /apply-fixes-incrementally"
    }
  },
  {
    "index": 190,
    "id": "commit-after-each-completed-milestone",
    "version": "1.0.0",
    "slash": "/commit-after-each-completed-milestone",
    "title": "Commit after each completed milestone",
    "category": "Autonomous Execution",
    "aliases": [
      "commit-each-completed",
      "each-completed-commit"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "manage-version-control",
    "kind": "alias",
    "riskLevel": "high",
    "status": "experimental",
    "what": "Commit after each completed milestone safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for Git state, branch policy, conventions, generated files, secret scanning, milestone boundary, staging, checks, and message; Plan bounded execution around atomic recovery/review unit; then execute, checkpoint, and verify no push without approval.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "190. /commit-after-each-completed-milestone"
    }
  },
  {
    "index": 191,
    "id": "generate-pr-automatically",
    "version": "1.0.0",
    "slash": "/generate-pr-automatically",
    "title": "Generate PR automatically",
    "category": "Autonomous Execution",
    "aliases": [
      "pr-automatically-generate"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "manage-version-control",
    "kind": "alias",
    "riskLevel": "high",
    "status": "experimental",
    "what": "Generate PR automatically using verified project evidence and a platform-agnostic execution contract.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Gather and normalize evidence for branch, remote, base, repository policy, checks, issue links, risks, tests, migrations, rollout, rollback, reviewers, and draft status; Design and generate create/update only with permission; then review and validate never merge or expose secrets.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "191. /generate-pr-automatically"
    }
  },
  {
    "index": 192,
    "id": "update-documentation-continuously",
    "version": "1.0.0",
    "slash": "/update-documentation-continuously",
    "title": "Update documentation continuously",
    "category": "Autonomous Execution",
    "aliases": [
      "documentation-continuously-update"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Update documentation continuously safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Measure and baseline behavior, interfaces, architecture, runbooks, migrations, examples, commands, links, audience, ownership, and shipped state; Plan the smallest safe change to same-milestone updates and executable examples; then implement incrementally and compare generated versus maintained sections.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "192. /update-documentation-continuously"
    }
  },
  {
    "index": 193,
    "id": "update-architecture-docs",
    "version": "1.0.0",
    "slash": "/update-architecture-docs",
    "title": "Update architecture docs",
    "category": "Autonomous Execution",
    "aliases": [
      "architecture-docs-update"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Update architecture docs safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Measure and baseline components, responsibilities, data flows, deployment units, trust boundaries, and failure modes; Plan the smallest safe change to dependency direction, critical paths, cycles, ownership, and change cost; then implement incrementally and compare logical, deployment, data-flow, and risk views.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "193. /update-architecture-docs"
    }
  },
  {
    "index": 194,
    "id": "update-changelog",
    "version": "1.0.0",
    "slash": "/update-changelog",
    "title": "Update changelog",
    "category": "Autonomous Execution",
    "aliases": [
      "changelog-update"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Update changelog safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Measure and baseline versions, tags, commits, PRs, reverts, dates, public versus internal changes, configuration, and migrations; Plan the smallest safe change to consistent format and unreleased section; then implement incrementally and compare behavior-focused entries.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "194. /update-changelog"
    }
  },
  {
    "index": 195,
    "id": "update-todos",
    "version": "1.0.0",
    "slash": "/update-todos",
    "title": "Update TODOs",
    "category": "Autonomous Execution",
    "aliases": [
      "todos-update"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--execute",
      "--max-batch",
      "--approval-mode",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Update TODOs safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Measure and baseline TODO/FIXME markers, linked issues, current state, owner, reason, trigger, expiry, and backlog consistency; Plan the smallest safe change to resolve/remove/rewrite/track; then implement incrementally and compare do not silently delete obligations.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "195. /update-todos"
    }
  },
  {
    "index": 196,
    "id": "re-run-tests-after-every-change",
    "version": "1.0.0",
    "slash": "/re-run-tests-after-every-change",
    "title": "Re-run tests after every change",
    "category": "Autonomous Execution",
    "aliases": [
      "re-run-tests",
      "run-tests-re"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--environment",
      "--scenario",
      "--runs",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "govern-execution",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Re-run tests after every change safely, incrementally, and with measurable verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Reconstruct scope and state for the exact scope, inputs, outputs, dependencies, and current behavior; Plan bounded execution around evidence, failure modes, edge cases, and project conventions; then execute, checkpoint, and verify measurable success criteria, verification, residual risk, and rollback.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Choose the lowest test layer that proves the behavior, then add a higher-level guard only for the real escape path.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "196. /re-run-tests-after-every-change"
    }
  },
  {
    "index": 197,
    "id": "verify-production-readiness",
    "version": "1.0.0",
    "slash": "/verify-production-readiness",
    "title": "Verify production readiness",
    "category": "Autonomous Execution",
    "aliases": [
      "production-readiness-verify"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "orchestrate-release",
    "kind": "alias",
    "riskLevel": "high",
    "status": "experimental",
    "what": "Verify production readiness with evidence, risk-based prioritization, and reproducible verification.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Discover requirements and current state for release scope, tests, security, performance, data, migrations, deployment, monitoring, rollback, support, docs, known issues, and environment; Test and challenge blockers, conditional approvals, advisories, unknowns, and go/no-go; then report gaps and verify no hidden failed or unverified checks.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "197. /verify-production-readiness"
    }
  },
  {
    "index": 198,
    "id": "produce-implementation-report",
    "version": "1.0.0",
    "slash": "/produce-implementation-report",
    "title": "Produce implementation report",
    "category": "Autonomous Execution",
    "aliases": [
      "implementation-report-produce"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Produce implementation report using verified project evidence and a platform-agnostic execution contract.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Gather and normalize evidence for objective, scope, decisions, files, migrations, tests, commands, results, before/after behavior, risks, rollback, and remaining work; Design and generate completed/deferred/blocked/unverified distinctions; then review and validate evidence links and rejected alternatives.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "198. /produce-implementation-report"
    }
  },
  {
    "index": 199,
    "id": "produce-executive-summary",
    "version": "1.0.0",
    "slash": "/produce-executive-summary",
    "title": "Produce executive summary",
    "category": "Autonomous Execution",
    "aliases": [
      "executive-summary-produce"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "generate-documentation",
    "kind": "alias",
    "riskLevel": "low",
    "status": "experimental",
    "what": "Produce executive summary using verified project evidence and a platform-agnostic execution contract.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Gather and normalize evidence for audience, decision, current state, outcomes, impact, risks, options, approvals, confidence, and next actions; Design and generate facts versus implications versus recommendations; then review and validate lead with decision, not chronology.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "199. /produce-executive-summary"
    }
  },
  {
    "index": 200,
    "id": "recommend-the-next-highest-impact-task",
    "version": "1.0.0",
    "slash": "/recommend-the-next-highest-impact-task",
    "title": "Recommend the next highest-impact task",
    "category": "Autonomous Execution",
    "aliases": [
      "recommend-next-highest",
      "next-highest-recommend"
    ],
    "arguments": [
      "--scope",
      "--depth",
      "--output",
      "--dry-run",
      "--budget",
      "--max-iterations",
      "--checkpoint"
    ],
    "primitiveId": "prioritize-next-action",
    "kind": "alias",
    "riskLevel": "read_only",
    "status": "experimental",
    "what": "Recommend the next highest-impact task using verified project evidence and a platform-agnostic execution contract.",
    "where": "the active task, repository, tools, execution state, checkpoints, approvals, and verification results.",
    "how": "Gather and normalize evidence for goals, completed work, open findings, blockers, roadmap, incidents, capacity, impact, urgency, risk reduction, effort, confidence, and enabling value; Design and generate one recommended task plus alternatives; then review and validate clear stopping point and why now.",
    "why": "To improve correctness, reliability, maintainability, safety, decision quality, or delivery speed without relying on platform assumptions.",
    "router": "Execution Orchestrator & Safety Governor; agentic reasoning model with planning, tool use, checkpoints, state, and policy enforcement.",
    "hiddenConnection": "Connect this command to risk scoring, permissions, dependency graphs, budgets, context compaction, approvals, and specialist handoffs; do not evaluate it as an isolated local task.",
    "proMove": "Persist decisions, evidence, approvals, checkpoints, and exact verification results so the run can resume without replaying full history.",
    "unknownUnknown": "tool outages, stale credentials, hidden side effects, partial writes, changing requirements, and ambiguous completion.",
    "source": {
      "document": "AI_Developer_Command_OS_200_Prompts_v1.docx",
      "section": "200. /recommend-the-next-highest-impact-task"
    }
  }
] as const satisfies readonly CommandDefinition[];
