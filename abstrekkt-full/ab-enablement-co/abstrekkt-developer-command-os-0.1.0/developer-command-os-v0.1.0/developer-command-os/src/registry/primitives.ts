import type { CapabilityPrimitive } from '../domain/types.js';

export const capabilityPrimitives = [
  {
    "id": "inspect-repository",
    "version": "1.0.0",
    "title": "Repository Discovery & Audit",
    "description": "Reusable capability primitive for repository discovery & audit.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "repository-analysis",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff"
    ],
    "procedure": [
      "Resolve the repository root and active scope.",
      "Capture a reproducible baseline of manifests, entry points, build paths, tests, deployment, and Git state.",
      "Inspect the requested quality dimensions and classify evidence, inference, and unknowns."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "analyze-architecture",
    "version": "1.0.0",
    "title": "Architecture Analysis",
    "description": "Reusable capability primitive for architecture analysis.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "architecture-reasoning",
    "requiredCapabilities": [
      "read_files",
      "analyze_graphs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Map boundaries, dependencies, public contracts, and ownership.",
      "Identify coupling, bottlenecks, anti-patterns, and architectural drift.",
      "Rank findings by severity, confidence, blast radius, effort, and dependency order."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "transform-code",
    "version": "1.0.0",
    "title": "Safe Code Transformation",
    "description": "Reusable capability primitive for safe code transformation.",
    "defaultRiskLevel": "medium",
    "modelProfile": "code-transformation",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff"
    ],
    "procedure": [
      "Create a rollback checkpoint and baseline targeted checks.",
      "Plan the smallest behavior-preserving change set.",
      "Apply changes incrementally and verify each batch before continuing."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "modernize-dependencies",
    "version": "1.0.0",
    "title": "Dependency & API Modernization",
    "description": "Reusable capability primitive for dependency & api modernization.",
    "defaultRiskLevel": "medium",
    "modelProfile": "dependency-modernization",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands",
      "network_optional"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package"
    ],
    "procedure": [
      "Inventory versions, deprecations, compatibility constraints, and authoritative migration guidance.",
      "Sequence upgrades by dependency and blast radius.",
      "Apply one bounded batch at a time with compatibility and rollback checks."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "clean-code",
    "version": "1.0.0",
    "title": "Code Cleanup & Debt Reduction",
    "description": "Reusable capability primitive for code cleanup & debt reduction.",
    "defaultRiskLevel": "medium",
    "modelProfile": "code-quality",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff"
    ],
    "procedure": [
      "Identify dead, duplicated, fragile, or unnecessarily complex code with usage evidence.",
      "Protect public contracts and generated sources.",
      "Remove or consolidate in bounded batches and verify behavior."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "normalize-structure",
    "version": "1.0.0",
    "title": "Structure & Naming Normalization",
    "description": "Reusable capability primitive for structure & naming normalization.",
    "defaultRiskLevel": "medium",
    "modelProfile": "architecture-reasoning",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory"
    ],
    "procedure": [
      "Map current module boundaries, naming conventions, and import paths.",
      "Propose a target structure consistent with project conventions.",
      "Move or rename incrementally while preserving imports, public APIs, and history where practical."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "generate-graphs",
    "version": "1.0.0",
    "title": "Architecture Graph Generation",
    "description": "Reusable capability primitive for architecture graph generation.",
    "defaultRiskLevel": "low",
    "modelProfile": "graph-analysis",
    "requiredCapabilities": [
      "read_files",
      "analyze_graphs",
      "write_docs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Extract nodes and edges from source, manifests, ownership, or runtime configuration.",
      "Normalize identifiers and remove duplicate relationships.",
      "Render machine-readable and human-readable graph artifacts with provenance."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "debug-root-cause",
    "version": "1.0.0",
    "title": "Root-Cause Debugging",
    "description": "Reusable capability primitive for root-cause debugging.",
    "defaultRiskLevel": "medium",
    "modelProfile": "debugging",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands",
      "inspect_logs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff",
      "service"
    ],
    "procedure": [
      "Reproduce or establish the smallest failing signal.",
      "Build and test competing hypotheses from logs, traces, diffs, and code paths.",
      "Implement the narrowest production-safe fix and add a regression guard."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "trace-runtime",
    "version": "1.0.0",
    "title": "Runtime & Integration Tracing",
    "description": "Reusable capability primitive for runtime & integration tracing.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "debugging",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands",
      "inspect_logs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Capture exact runtime, API, database, authentication, cache, and integration evidence.",
      "Correlate timestamps, request identifiers, stack traces, and configuration.",
      "Identify the earliest causal divergence and report unverifiable external dependencies."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "analyze-concurrency-state",
    "version": "1.0.0",
    "title": "Concurrency, State & Lifecycle Analysis",
    "description": "Reusable capability primitive for concurrency, state & lifecycle analysis.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "debugging",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands",
      "inspect_logs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "service"
    ],
    "procedure": [
      "Map lifecycle, ownership, synchronization, cancellation, and cleanup behavior.",
      "Identify races, stale state, loops, leaks, and ordering hazards.",
      "Construct a deterministic reproducer or invariant-based test where possible."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "audit-security",
    "version": "1.0.0",
    "title": "Application Security Assessment",
    "description": "Reusable capability primitive for application security assessment.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "security-analysis",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff",
      "service"
    ],
    "procedure": [
      "Identify trust boundaries, assets, entry points, data flows, and threat surfaces.",
      "Inspect controls and vulnerabilities using evidence-backed checks.",
      "Prioritize findings by exploitability, impact, confidence, and remediation dependency."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "validate-secrets-config",
    "version": "1.0.0",
    "title": "Secrets & Configuration Validation",
    "description": "Reusable capability primitive for secrets & configuration validation.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "security-analysis",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands",
      "redact_secrets"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Discover schemas and secret references without reading or emitting secret values.",
      "Validate required keys, rotation boundaries, storage, and environment parity.",
      "Redact evidence and report missing, stale, overprivileged, or exposed configuration."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "validate-authz-data-policies",
    "version": "1.0.0",
    "title": "Authorization & Data Policy Validation",
    "description": "Reusable capability primitive for authorization & data policy validation.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "security-analysis",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands",
      "inspect_database_schema"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Map identities, roles, resources, operations, and data ownership.",
      "Evaluate authorization, RBAC, RLS, and provider policy paths including negative cases.",
      "Produce policy probes and least-privilege remediation guidance."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "analyze-injection-threats",
    "version": "1.0.0",
    "title": "Injection & Boundary Threat Analysis",
    "description": "Reusable capability primitive for injection & boundary threat analysis.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "security-analysis",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "service"
    ],
    "procedure": [
      "Enumerate untrusted inputs and sensitive sinks.",
      "Trace validation, encoding, parameterization, origin, and network controls.",
      "Construct safe proof cases and prioritize boundary fixes."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "threat-model-compliance",
    "version": "1.0.0",
    "title": "Threat Modeling & Compliance",
    "description": "Reusable capability primitive for threat modeling & compliance.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "security-analysis",
    "requiredCapabilities": [
      "read_files",
      "write_docs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "service"
    ],
    "procedure": [
      "Define assets, actors, trust boundaries, abuse cases, and assumptions.",
      "Map controls to the selected standard or internal policy.",
      "Document gaps, mitigations, ownership, residual risk, and evidence status."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "profile-performance",
    "version": "1.0.0",
    "title": "Performance Measurement & Benchmarking",
    "description": "Reusable capability primitive for performance measurement & benchmarking.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "performance-analysis",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands",
      "inspect_metrics"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Define representative workloads and baseline metrics before optimization.",
      "Measure latency, throughput, memory, startup, bundle, network, and cost as applicable.",
      "Separate measurement noise from stable bottlenecks and rank opportunities."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "optimize-frontend",
    "version": "1.0.0",
    "title": "Frontend Performance Optimization",
    "description": "Reusable capability primitive for frontend performance optimization.",
    "defaultRiskLevel": "medium",
    "modelProfile": "performance-analysis",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands",
      "browser_optional"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file"
    ],
    "procedure": [
      "Capture browser and bundle baselines.",
      "Target rendering, fetching, assets, hydration, and JavaScript bottlenecks.",
      "Apply measured changes and compare user-visible metrics and regressions."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "optimize-backend-data",
    "version": "1.0.0",
    "title": "Backend, Database & Cache Optimization",
    "description": "Reusable capability primitive for backend, database & cache optimization.",
    "defaultRiskLevel": "medium",
    "modelProfile": "performance-analysis",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands",
      "inspect_database_schema"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Capture query plans, latency, cache behavior, and workload shape.",
      "Target query, index, batching, connection, and cache bottlenecks.",
      "Verify correctness, consistency, resource usage, and rollback safety."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "optimize-infrastructure-cost",
    "version": "1.0.0",
    "title": "Infrastructure Cost Optimization",
    "description": "Reusable capability primitive for infrastructure cost optimization.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "platform-reliability",
    "requiredCapabilities": [
      "read_files",
      "inspect_metrics",
      "network_optional"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "service"
    ],
    "procedure": [
      "Establish cost, utilization, traffic, and reliability baselines.",
      "Identify idle, oversized, duplicated, or poorly cached resources.",
      "Model savings against performance, resilience, and operational risk before recommending changes."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "govern-prompts",
    "version": "1.0.0",
    "title": "Prompt Governance & Versioning",
    "description": "Reusable capability primitive for prompt governance & versioning.",
    "defaultRiskLevel": "medium",
    "modelProfile": "ai-systems",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file"
    ],
    "procedure": [
      "Inventory prompts, versions, owners, inputs, outputs, and evaluation coverage.",
      "Consolidate shared contracts and remove divergent duplication.",
      "Version changes and validate behavior, safety, and cost against regression cases."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "optimize-context-retrieval",
    "version": "1.0.0",
    "title": "Context, Retrieval & Memory Optimization",
    "description": "Reusable capability primitive for context, retrieval & memory optimization.",
    "defaultRiskLevel": "medium",
    "modelProfile": "ai-systems",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Measure context composition, retrieval quality, memory freshness, and token use.",
      "Improve chunking, ranking, compression, provenance, and invalidation.",
      "Validate answer quality, latency, privacy, and cost on representative evaluations."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "evaluate-ai-orchestration",
    "version": "1.0.0",
    "title": "AI Routing, Model & Agent Evaluation",
    "description": "Reusable capability primitive for ai routing, model & agent evaluation.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "ai-systems",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands",
      "inspect_metrics"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Define routing, model, tool, handoff, and collaboration success metrics.",
      "Replay representative and adversarial cases.",
      "Compare accuracy, safety, latency, cost, fallback behavior, and failure handling."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "generate-tests",
    "version": "1.0.0",
    "title": "Test Generation & Coverage",
    "description": "Reusable capability primitive for test generation & coverage.",
    "defaultRiskLevel": "medium",
    "modelProfile": "test-engineering",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff",
      "service"
    ],
    "procedure": [
      "Identify behavior, risk, boundaries, and missing regression protection.",
      "Generate project-native tests with deterministic fixtures and meaningful assertions.",
      "Run targeted tests and ensure they fail for the intended defect when practical."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "assess-test-quality",
    "version": "1.0.0",
    "title": "Test Quality & Strategy Assessment",
    "description": "Reusable capability primitive for test quality & strategy assessment.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "test-engineering",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff",
      "service"
    ],
    "procedure": [
      "Inventory suites, coverage, reliability, speed, ownership, and CI placement.",
      "Evaluate assertion quality, isolation, determinism, and risk alignment.",
      "Prioritize missing tests and produce an executable test strategy."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "validate-ci-iac",
    "version": "1.0.0",
    "title": "CI/CD, Containers & IaC Validation",
    "description": "Reusable capability primitive for ci/cd, containers & iac validation.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "platform-reliability",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Discover workflows, containers, infrastructure code, environments, and release paths.",
      "Validate syntax, security, reproducibility, caching, permissions, and rollback.",
      "Report provider-specific assumptions and unverified remote behavior."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "assess-reliability",
    "version": "1.0.0",
    "title": "Operational Reliability & Recovery",
    "description": "Reusable capability primitive for operational reliability & recovery.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "platform-reliability",
    "requiredCapabilities": [
      "read_files",
      "run_safe_commands",
      "inspect_logs",
      "inspect_metrics"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "service"
    ],
    "procedure": [
      "Map service objectives, dependencies, telemetry, backups, recovery, and failure modes.",
      "Test or inspect monitoring, alerting, scaling, rollback, and disaster recovery evidence.",
      "Prioritize operational gaps by customer impact and recovery risk."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "audit-product-ux",
    "version": "1.0.0",
    "title": "Product, UX & Accessibility Audit",
    "description": "Reusable capability primitive for product, ux & accessibility audit.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "product-ux",
    "requiredCapabilities": [
      "read_files",
      "browser_optional",
      "inspect_metrics"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Identify target users, critical journeys, accessibility requirements, and success metrics.",
      "Inspect implementation and available runtime evidence for friction and inconsistency.",
      "Prioritize findings by user impact, frequency, confidence, and implementation effort."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "plan-product-delivery",
    "version": "1.0.0",
    "title": "Product Planning & Delivery",
    "description": "Reusable capability primitive for product planning & delivery.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "product-ux",
    "requiredCapabilities": [
      "read_files",
      "write_docs",
      "inspect_metrics"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "service"
    ],
    "procedure": [
      "Collect goals, constraints, evidence, dependencies, and uncertainty.",
      "Prioritize work using explicit value, risk, effort, and sequencing criteria.",
      "Produce a staged roadmap with milestones, owners, gates, and measurable outcomes."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "analyze-git-history",
    "version": "1.0.0",
    "title": "Git History & Contributor Intelligence",
    "description": "Reusable capability primitive for git history & contributor intelligence.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "repository-intelligence",
    "requiredCapabilities": [
      "read_files",
      "use_git"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "diff"
    ],
    "procedure": [
      "Resolve repository and history scope.",
      "Analyze commits, branches, contributors, ownership, and architectural change evidence.",
      "Separate historical facts from inferred intent and identify stale or abandoned work."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "assess-repository-risk",
    "version": "1.0.0",
    "title": "Repository Risk & Health Analysis",
    "description": "Reusable capability primitive for repository risk & health analysis.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "repository-intelligence",
    "requiredCapabilities": [
      "read_files",
      "use_git",
      "analyze_graphs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "diff"
    ],
    "procedure": [
      "Combine code, test, dependency, ownership, churn, branch, and change-risk signals.",
      "Identify fragile hotspots and likely regression surfaces.",
      "Produce a calibrated health score with transparent factors and limitations."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "generate-documentation",
    "version": "1.0.0",
    "title": "Documentation & Reporting",
    "description": "Reusable capability primitive for documentation & reporting.",
    "defaultRiskLevel": "low",
    "modelProfile": "documentation",
    "requiredCapabilities": [
      "read_files",
      "write_docs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff",
      "service"
    ],
    "procedure": [
      "Identify the intended audience, source evidence, and document lifecycle.",
      "Generate or update concise artifacts from verified implementation facts.",
      "Cross-link decisions, commands, changes, risks, and next actions while avoiding duplication."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "govern-execution",
    "version": "1.0.0",
    "title": "Execution Governance & Safe Autonomy",
    "description": "Reusable capability primitive for execution governance & safe autonomy.",
    "defaultRiskLevel": "high",
    "modelProfile": "execution-governance",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands",
      "checkpoint",
      "rollback"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "directory",
      "file",
      "diff",
      "service"
    ],
    "procedure": [
      "Resolve scope, permissions, budgets, approval gates, and terminal conditions.",
      "Plan checkpointed stages with bounded retries and independent verification.",
      "Stop, roll back, or escalate when policy, evidence, or consistency requirements fail."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "orchestrate-release",
    "version": "1.0.0",
    "title": "Release Orchestration & Readiness",
    "description": "Reusable capability primitive for release orchestration & readiness.",
    "defaultRiskLevel": "high",
    "modelProfile": "release-orchestration",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "run_safe_commands",
      "checkpoint",
      "rollback"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "service"
    ],
    "procedure": [
      "Assemble audit, change, test, security, documentation, and operations evidence.",
      "Evaluate release gates and repair only within approved scope.",
      "Prepare a reversible release package and require approval before external side effects."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "evaluate-best-practices",
    "version": "1.0.0",
    "title": "Best-Practice Comparison & Research",
    "description": "Reusable capability primitive for best-practice comparison & research.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "architecture-reasoning",
    "requiredCapabilities": [
      "read_files",
      "network_optional",
      "write_docs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "package",
      "service"
    ],
    "procedure": [
      "Establish the actual stack, lifecycle stage, constraints, and authoritative references.",
      "Separate required correctness and safety from preference.",
      "Recommend justified changes with alternatives, tradeoffs, and documented deviations."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "manage-version-control",
    "version": "1.0.0",
    "title": "Version Control Automation",
    "description": "Reusable capability primitive for version control automation.",
    "defaultRiskLevel": "high",
    "modelProfile": "repository-intelligence",
    "requiredCapabilities": [
      "read_files",
      "write_files",
      "use_git",
      "checkpoint"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "diff"
    ],
    "procedure": [
      "Inspect Git state, branch policy, protected paths, and user-owned changes.",
      "Prepare scoped commits or pull-request material with traceable evidence.",
      "Require explicit approval before push, PR creation, merge, force operations, or branch deletion."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  },
  {
    "id": "prioritize-next-action",
    "version": "1.0.0",
    "title": "Prioritization & Next-Best Action",
    "description": "Reusable capability primitive for prioritization & next-best action.",
    "defaultRiskLevel": "read_only",
    "modelProfile": "execution-governance",
    "requiredCapabilities": [
      "read_files",
      "inspect_metrics",
      "write_docs"
    ],
    "allowedScopes": [
      "repository",
      "workspace",
      "service"
    ],
    "procedure": [
      "Aggregate verified findings, blockers, dependencies, effort, impact, and confidence.",
      "Identify the smallest high-leverage next action that unlocks downstream work.",
      "Explain why it outranks alternatives and define its completion signal."
    ],
    "verification": [
      "Run the smallest relevant project-native checks and record exact commands and results.",
      "Separate new failures, pre-existing failures, skipped checks, and unverified areas.",
      "Return evidence, residual risks, rollback guidance, and the next highest-impact action."
    ],
    "recovery": [
      "Capture and classify the exact failure before changing anything.",
      "Attempt at most three materially different safe repairs within the approved scope.",
      "Roll back partial failed state and escalate with a minimal blocker packet when safe recovery is not possible."
    ]
  }
] as const satisfies readonly CapabilityPrimitive[];

export const primitiveById: ReadonlyMap<string, CapabilityPrimitive> = new Map(capabilityPrimitives.map((primitive) => [primitive.id, primitive]));
