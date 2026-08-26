# Agent Factory Blueprint — Customization Service Deliverable

**Lane:** Customization Service
**Version:** 1.0
**Date:** 2026-03-25
**Author:** Kyle Rosebrook / INT Customization Service
**Target Audience:** Technical decision-makers at mid-size SaaS/tech companies (25–500 engineers)
**Engagement Type:** Packaged consulting deliverable — white-label, client-configurable

---

## Executive Summary

This blueprint defines a phased **Agent Factory** for a modern engineering organization. Grounded in the Agent Factory pattern from GitHub Next and Microsoft Research (Peli de Halleux), the factory replaces monolithic AI assistance with a **heterogeneous ecosystem of 15–100+ specialized agents** embedded directly in the Software Development Lifecycle (SDLC).

**What this is NOT:** A single AI assistant bolted onto your workflow.
**What this IS:** AI-as-Infrastructure — dozens of niche agents, each doing one job exceptionally well, running continuously alongside your developers.

### Key Outcomes

| Metric | Target by Month 3 | Target by Month 6 |
|--------|-------------------|-------------------|
| Senior engineer hours reclaimed (triage/investigation) | 8–12 hrs/engineer/month | 15–20 hrs/engineer/month |
| CI MTTR (Mean Time to Recovery) | -40% | -60% |
| Tech debt backlog burn rate | Baseline established | 15–25% reduction |
| Agent signal-to-noise ratio | >90% | >80% at scale |
| Monthly LLM API spend | $150–$400 | $400–$1,200 |

---

## Part 1: Agent Catalog — 15-Agent Starter Set

The factory launches with **15 purpose-built agents** across 5 priority categories. Each agent has:
- A single, laser-focused job
- Minimum viable permissions
- A defined human review gate
- A measurable success metric

---

### Category A: Issue & PR Management (Tier 1 — Read-Only)

#### Agent 01: Issue Triage Analyst

| Field | Specification |
|-------|--------------|
| **ID** | `agent-01-issue-triage` |
| **Trigger** | `issues: [opened, edited]` GitHub Actions event |
| **Scope** | Read issues; apply labels; post comment with triage summary |
| **What It Does** | Classifies new issues as bug / feature / question / duplicate / needs-info. Assigns priority label (P0–P3). Tags relevant team area. Posts a structured triage comment with classification rationale. |
| **Permissions** | `issues: write` (labels + comment only), `contents: read` |
| **Output** | Labels applied + triage comment on issue |
| **Review Gate** | None — labels are non-destructive and easily overridden by humans |
| **Model Tier** | Fast (claude-haiku or equivalent) — classification task |
| **Est. Cost** | ~$0.002/issue · ~$4–$20/month depending on issue volume |
| **Success Metric** | >90% label accuracy (spot-check weekly for first 4 weeks) |

---

#### Agent 02: PR Auto-Labeler

| Field | Specification |
|-------|--------------|
| **ID** | `agent-02-pr-labeler` |
| **Trigger** | `pull_request: [opened, synchronize]` |
| **Scope** | Read PR diff + changed file paths; apply area/size labels |
| **What It Does** | Analyzes changed files to apply labels: area (auth, infra, frontend, api, tests), size (XS/S/M/L/XL), risk (breaking-change, migration-required, security-impact). |
| **Permissions** | `pull-requests: write` (labels only), `contents: read` |
| **Output** | Labels applied to PR |
| **Review Gate** | None — labels are advisory |
| **Model Tier** | Fast |
| **Est. Cost** | ~$0.003/PR · ~$6–$30/month |
| **Success Metric** | >85% label accuracy validated by PR author feedback |

---

#### Agent 03: Contributor Coordinator

| Field | Specification |
|-------|--------------|
| **ID** | `agent-03-contributor-coord` |
| **Trigger** | `issues: [opened]` — first-time contributors only |
| **Scope** | Read issue + contributor history; post onboarding guidance |
| **What It Does** | Detects first-time contributors. Posts a welcoming, contextual response pointing to contributing guidelines, relevant docs, and suggesting "good first issue" candidates in the same area. |
| **Permissions** | `issues: write` (comment only), `contents: read` |
| **Output** | Personalized contributor guidance comment |
| **Review Gate** | None |
| **Model Tier** | Fast |
| **Est. Cost** | ~$0.005/first-time-issue · ~$2–$10/month |
| **Success Metric** | Contributor drop-off rate on first issue; response time to first comment |

---

### Category B: Fault Investigation (Tier 1 — Read-Only)

#### Agent 04: CI Failure Analyst

| Field | Specification |
|-------|--------------|
| **ID** | `agent-04-ci-failure` |
| **Trigger** | `workflow_run: [completed]` where `conclusion == failure` |
| **Scope** | Read workflow logs; post root cause analysis comment on triggering PR |
| **What It Does** | Parses CI failure logs to identify: (1) specific failing test/step, (2) probable root cause, (3) file/line implicated, (4) suggested fix direction. Distinguishes infrastructure failures from code failures. Flags potential flaky test patterns. |
| **Permissions** | `actions: read`, `checks: read`, `pull-requests: write` (comment) |
| **Output** | Structured root cause analysis posted as PR comment |
| **Review Gate** | None — analysis only, no code changes |
| **Model Tier** | Standard (claude-sonnet equivalent) — reasoning required |
| **Est. Cost** | ~$0.02–$0.08/failure · ~$20–$120/month |
| **Success Metric** | MTTR reduction; % of failures where diagnosis saves investigation time |

---

#### Agent 05: Flaky Test Detector

| Field | Specification |
|-------|--------------|
| **ID** | `agent-05-flaky-test` |
| **Trigger** | Scheduled — runs every Sunday at 02:00 UTC |
| **Scope** | Read past 30 days of CI run history; produce flaky test report |
| **What It Does** | Analyzes CI run history to identify tests with >10% non-deterministic failure rate. Ranks tests by flakiness score. Produces a prioritized list with pattern analysis (timing issues, env dependencies, race conditions). Opens a GitHub Issue with the weekly report. |
| **Permissions** | `actions: read`, `issues: write` |
| **Output** | Weekly flaky test report issue |
| **Review Gate** | Report issue reviewed by lead engineer weekly |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.10–$0.30/week · ~$5–$15/month |
| **Success Metric** | Flaky test count reduction over 90 days |

---

### Category C: Continuous Improvement Suite (Tier 2 — PR Proposers)

#### Agent 06: Continuous Documentation Agent

| Field | Specification |
|-------|--------------|
| **ID** | `agent-06-continuous-docs` |
| **Trigger** | `pull_request: [merged]` — when code files change without corresponding doc changes |
| **Scope** | Read merged PR diff; identify undocumented public APIs/functions; open follow-up PR |
| **What It Does** | Detects when public APIs, exported functions, or config options changed without documentation updates. Opens a draft PR adding or updating: inline docstrings, README sections, and CHANGELOG entries. |
| **Permissions** | `contents: write` (new branch + commit), `pull-requests: write` |
| **Output** | Draft PR with documentation additions |
| **Review Gate** | PR requires human approval before merge |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.05–$0.15/trigger · ~$30–$90/month |
| **Success Metric** | % of public API surface with up-to-date documentation |

---

#### Agent 07: Continuous Style Enforcer

| Field | Specification |
|-------|--------------|
| **ID** | `agent-07-continuous-style` |
| **Trigger** | `pull_request: [opened, synchronize]` |
| **Scope** | Read PR diff; identify style violations not caught by existing linters; post inline review comments |
| **What It Does** | Catches style issues beyond mechanical linters: inconsistent naming conventions, overly abbreviated variables, ambiguous error messages, inconsistent comment style. Posts inline PR review comments (not blocking). |
| **Permissions** | `pull-requests: write` (review comments only), `contents: read` |
| **Output** | Inline PR review comments (advisory, non-blocking) |
| **Review Gate** | PR author decides whether to address comments |
| **Model Tier** | Fast |
| **Est. Cost** | ~$0.01–$0.04/PR · ~$10–$40/month |
| **Success Metric** | % of style comments acted on by authors; style issue recurrence rate |

---

#### Agent 08: Continuous Simplicity Agent

| Field | Specification |
|-------|--------------|
| **ID** | `agent-08-continuous-simplicity` |
| **Trigger** | Scheduled — nightly at 03:00 UTC; scans one module per night |
| **Scope** | Read source files in a rotating module; identify unnecessary complexity; open simplification PR |
| **What It Does** | Identifies: deeply nested conditionals (>4 levels), functions >80 lines, duplicated logic blocks, overly complex one-liners, unused parameters. Proposes concrete simplifications via a PR with before/after comparison in the description. |
| **Permissions** | `contents: write`, `pull-requests: write` |
| **Output** | Simplification PR with before/after rationale |
| **Review Gate** | PR requires human approval; marked as `agent-proposal` label |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.10–$0.30/run · ~$30–$90/month |
| **Success Metric** | Cyclomatic complexity trend; % of simplification PRs merged |

---

#### Agent 09: Continuous Refactoring Agent

| Field | Specification |
|-------|--------------|
| **ID** | `agent-09-continuous-refactor` |
| **Trigger** | `pull_request: [merged]` — when patterns warrant broader refactor |
| **Scope** | Read merged PR + broader codebase context; propose targeted refactoring |
| **What It Does** | After a merge, scans for the same pattern across the codebase. If the merged PR fixed a bug or improved a pattern, identifies 3–10 other locations with the same anti-pattern and opens a follow-up refactor PR. |
| **Permissions** | `contents: write`, `pull-requests: write` |
| **Output** | Targeted refactor PR or "no action needed" summary comment |
| **Review Gate** | PR requires human approval |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.08–$0.20/trigger · ~$40–$120/month |
| **Success Metric** | % of refactor PRs merged; anti-pattern recurrence rate |

---

### Category D: Security & Compliance (Tier 2 — PR Proposers)

#### Agent 10: Dependency Audit Agent

| Field | Specification |
|-------|--------------|
| **ID** | `agent-10-dep-audit` |
| **Trigger** | Scheduled — weekly on Monday 06:00 UTC; also on `push` to `package.json` / `requirements.txt` / `Gemfile` |
| **Scope** | Read dependency manifests; analyze for known CVEs and outdated packages; open update PRs |
| **What It Does** | Cross-references all dependencies against CVE databases and checks for major/minor version drift. Prioritizes by severity (CVSS score). For high/critical CVEs, opens an immediate PR with the fix. For medium/low, opens a weekly batch update PR. |
| **Permissions** | `contents: write`, `pull-requests: write`, `security-events: read` |
| **Output** | Priority-ranked security update PRs |
| **Review Gate** | All PRs require human approval; critical CVEs flagged with `SECURITY` label and assigned to security lead |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.05–$0.15/run · ~$10–$30/month |
| **Success Metric** | Mean time to patch critical CVEs; % of dependency update PRs merged within 7 days |

---

#### Agent 11: Secret Leak Detector

| Field | Specification |
|-------|--------------|
| **ID** | `agent-11-secret-scan` |
| **Trigger** | `push: [**]` — on every push to any branch |
| **Scope** | Read commit diff; detect credential patterns; block PR and alert |
| **What It Does** | Scans every commit diff for API keys, tokens, passwords, private keys, and connection strings using regex + semantic pattern matching. If detected: (1) posts blocking PR review comment, (2) opens a `CRITICAL SECURITY` issue, (3) notifies designated security channel. Does NOT reveal the secret in its output. |
| **Permissions** | `contents: read`, `pull-requests: write`, `issues: write` |
| **Output** | Blocking PR comment + critical security issue |
| **Review Gate** | Security lead must review and resolve before merge is unblocked |
| **Model Tier** | Fast (pattern matching + LLM for semantic detection) |
| **Est. Cost** | ~$0.005/push · ~$5–$25/month |
| **Success Metric** | Zero secrets reaching main branch; false positive rate <5% |

---

### Category E: Testing & Validation (Tier 2 — PR Proposers)

#### Agent 12: Test Coverage Improver

| Field | Specification |
|-------|--------------|
| **ID** | `agent-12-test-coverage` |
| **Trigger** | `pull_request: [merged]` — when new code added with <80% test coverage |
| **Scope** | Read merged PR diff + coverage report; generate missing unit tests; open follow-up PR |
| **What It Does** | Identifies functions/branches in the merged PR with no corresponding test. Generates unit tests covering: happy path, error cases, boundary conditions. Opens a follow-up PR with the generated tests. Includes a coverage delta estimate in PR description. |
| **Permissions** | `contents: write`, `pull-requests: write`, `checks: read` |
| **Output** | Follow-up PR with generated unit tests |
| **Review Gate** | PR requires human review; generated tests must pass CI before merge |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.10–$0.30/trigger · ~$30–$90/month |
| **Success Metric** | Coverage % trend; % of generated test PRs merged |

---

#### Agent 13: Edge Case Validator

| Field | Specification |
|-------|--------------|
| **ID** | `agent-13-edge-case` |
| **Trigger** | `pull_request: [opened, synchronize]` — on PRs modifying parsing, validation, or auth logic |
| **Scope** | Read PR diff; identify unhandled edge cases; post inline review comments |
| **What It Does** | For PRs touching input validation, parsing, or authentication code: analyzes for unhandled inputs (null/empty, unicode, very large inputs, malformed data, auth boundary cases). Posts specific edge case scenarios as inline review comments with recommended test cases. |
| **Permissions** | `pull-requests: write` (review comments), `contents: read` |
| **Output** | Inline edge case analysis comments |
| **Review Gate** | PR author decides how to address; not blocking |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.05–$0.15/PR · ~$15–$60/month |
| **Success Metric** | Edge case bug escape rate; % of comments that surface genuine bugs |

---

### Category F: Meta-Agents (Tier 3 — Factory Management)

#### Agent 14: Agent Health Monitor

| Field | Specification |
|-------|--------------|
| **ID** | `agent-14-meta-health` |
| **Trigger** | Scheduled — daily at 08:00 UTC |
| **Scope** | Read all agent workflow run histories; compute health metrics; post weekly dashboard issue |
| **What It Does** | Monitors all other agents for: (1) error rate per agent, (2) run frequency vs. trigger frequency, (3) cost per agent per week, (4) output volume (PRs/comments opened), (5) SNR (signal-to-noise) based on PR merge rates and comment acknowledgement. Posts a weekly "Factory Health" issue with agent-by-agent scorecard. |
| **Permissions** | `actions: read`, `issues: write`, `checks: read` |
| **Output** | Weekly factory health dashboard issue |
| **Review Gate** | Reviewed by engineering lead; alerts auto-created for agents with SNR <70% |
| **Model Tier** | Fast (metric aggregation) |
| **Est. Cost** | ~$0.03–$0.10/run · ~$5–$20/month |
| **Success Metric** | Coverage of all deployed agents; alert accuracy for degraded agents |

---

#### Agent 15: Output Quality Auditor

| Field | Specification |
|-------|--------------|
| **ID** | `agent-15-output-quality` |
| **Trigger** | Scheduled — weekly on Friday at 10:00 UTC |
| **Scope** | Read all agent-opened PRs and comments from the past week; score quality; produce audit report |
| **What It Does** | Samples 20–30% of agent outputs from the week. Scores each on: relevance, accuracy, actionability, and developer sentiment (based on emoji reactions, responses, and merge/dismiss actions). Identifies agents trending below quality thresholds. Flags specific output patterns that are generating noise. |
| **Permissions** | `pull-requests: read`, `issues: read`, `reactions: read` |
| **Output** | Weekly quality audit report posted as issue |
| **Review Gate** | Engineering lead reviews weekly; immediate action required if any agent drops below 60% SNR |
| **Model Tier** | Standard |
| **Est. Cost** | ~$0.15–$0.40/run · ~$10–$30/month |
| **Success Metric** | Overall factory SNR; % of flagged agents improved within 2 weeks |

---

## Part 2: Permission Model — Least-Privilege Matrix

Every agent in the factory operates under the minimum permissions required to complete its task. **No exceptions.** Permissions are never pre-granted "just in case."

### Permission Sets by Agent Tier

#### Tier 1: Observer Agents (Read-Only)
```yaml
permissions:
  contents: read
  issues: write          # labels + comments only
  pull-requests: write   # comments only (no PR creation)
  actions: read          # for CI log analysis
  checks: read           # for CI status
  security-events: read  # for vulnerability data
```

#### Tier 2: Proposer Agents (PR Creators)
```yaml
permissions:
  contents: write        # branch creation + commits
  pull-requests: write   # PR creation + comments
  issues: write          # issue creation + labels
  checks: read           # CI status validation
```

#### Tier 3: Meta-Agents (Factory Management)
```yaml
permissions:
  actions: read          # workflow run history
  checks: read           # build status
  issues: write          # report/alert creation
  pull-requests: read    # output quality sampling
  contents: read         # agent definition auditing
```

### Hard Permission Rules

| Rule | Rationale |
|------|-----------|
| Observer agents NEVER get `contents: write` | A triage agent cannot corrupt the codebase |
| No agent gets `admin` permissions | Factory agents are not infrastructure managers |
| No agent gets direct commit to `main` or protected branches | All changes via PRs with human review |
| Secret Leak Detector gets `contents: read` only | It identifies leaks but cannot delete them (prevents abuse) |
| Meta-agents get no `write` permissions except `issues: write` | Watchers don't act; they report |
| All agents are scoped to their triggering repository | No cross-repo write access in Phase 1–2 |

### Agent Permission Ledger

| Agent | contents | issues | pull-requests | actions | security-events |
|-------|----------|--------|---------------|---------|-----------------|
| 01 Issue Triage | read | write | — | — | — |
| 02 PR Labeler | read | — | write | — | — |
| 03 Contributor Coord | read | write | — | — | — |
| 04 CI Failure Analyst | read | — | write | read | — |
| 05 Flaky Test Detector | — | write | — | read | — |
| 06 Continuous Docs | write | — | write | — | — |
| 07 Continuous Style | read | — | write | — | — |
| 08 Continuous Simplicity | write | — | write | — | — |
| 09 Continuous Refactor | write | — | write | — | — |
| 10 Dependency Audit | write | — | write | — | read |
| 11 Secret Leak Detector | read | write | write | — | — |
| 12 Test Coverage Improver | write | — | write | — | — |
| 13 Edge Case Validator | read | — | write | — | — |
| 14 Agent Health Monitor | read | write | — | read | — |
| 15 Output Quality Auditor | read | read | read | — | — |

---

## Part 3: Meta-Agent Architecture

With 15 agents at launch and a planned growth to 30–50 agents, a meta-agent management layer is mandatory from Day 1. **Without meta-agents, the factory becomes a spam factory.**

### The Two-Layer Factory Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     MANAGEMENT LAYER                            │
│                                                                 │
│  Agent-14: Health Monitor    Agent-15: Output Quality Auditor   │
│       ↓ weekly scorecard           ↓ SNR enforcement            │
│  Factory Health Issue         Quality Audit Report Issue        │
│                                                                 │
│  Escalation Threshold:          SNR Alert Threshold:            │
│  Any agent error rate >20%      Any agent SNR <70%              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ monitors all
┌──────────────────────────▼──────────────────────────────────────┐
│                     WORKER LAYER                                │
│                                                                 │
│  TIER 1 OBSERVERS          TIER 2 PROPOSERS                     │
│  ─────────────────         ─────────────────                    │
│  01: Issue Triage          06: Continuous Docs                  │
│  02: PR Labeler            07: Continuous Style                 │
│  03: Contributor Coord     08: Continuous Simplicity            │
│  04: CI Failure Analyst    09: Continuous Refactor              │
│  05: Flaky Test Detector   10: Dependency Audit                 │
│                            11: Secret Leak Detector             │
│                            12: Test Coverage Improver           │
│                            13: Edge Case Validator              │
└─────────────────────────────────────────────────────────────────┘
```

### Meta-Agent Escalation Logic

The health monitor (Agent 14) applies the following escalation rules automatically:

| Condition | Action |
|-----------|--------|
| Agent error rate >20% in 7 days | Open `AGENT-ALERT` issue; tag engineering lead |
| Agent produces 0 outputs in 14 days | Open `AGENT-STALE` issue for review |
| API cost for single agent >150% of budget | Open `COST-ALERT` issue |
| SNR drops below 70% (audit) | Open `QUALITY-ALERT`; recommend agent pause |
| New agent deployed without library entry | Open `GOVERNANCE-VIOLATION` issue |

### Scaling to Phase 3 (30–50 agents)

When the factory grows beyond 15 agents, add two additional meta-agents:

**Agent 16: API Cost Monitor** — Tracks per-agent LLM API spend against budgets; alerts on cost spikes; provides monthly cost-per-value analysis to justify or deprecate agents.

**Agent 17: Cross-Repo Coordinator** — For multi-repo organizations; synchronizes agent definitions, propagates factory governance changes, and ensures pattern consistency across repositories.

---

## Part 4: Living Library — Directory Structure

The living library is the institutional memory of the factory. Every agent definition lives here, version-controlled alongside the code it governs.

```
.github/
└── agent-factory/
    ├── README.md                         # Factory overview + onboarding
    ├── GOVERNANCE.md                     # Rules for adding/modifying agents
    │
    ├── agents/                           # All active agent definitions (Markdown DSL)
    │   ├── tier-1-observers/
    │   │   ├── agent-01-issue-triage.md
    │   │   ├── agent-02-pr-labeler.md
    │   │   ├── agent-03-contributor-coord.md
    │   │   ├── agent-04-ci-failure.md
    │   │   └── agent-05-flaky-test.md
    │   ├── tier-2-proposers/
    │   │   ├── agent-06-continuous-docs.md
    │   │   ├── agent-07-continuous-style.md
    │   │   ├── agent-08-continuous-simplicity.md
    │   │   ├── agent-09-continuous-refactor.md
    │   │   ├── agent-10-dep-audit.md
    │   │   ├── agent-11-secret-scan.md
    │   │   ├── agent-12-test-coverage.md
    │   │   └── agent-13-edge-case.md
    │   └── tier-3-meta/
    │       ├── agent-14-health-monitor.md
    │       └── agent-15-output-quality.md
    │
    ├── templates/                        # Remix-ready agent starters
    │   ├── observer-agent.md             # Template: read-only, no side effects
    │   ├── proposer-agent.md             # Template: PR-creating agent
    │   ├── scheduled-agent.md            # Template: cron-triggered agent
    │   └── meta-agent.md                 # Template: agent-watching agent
    │
    ├── patterns/                         # Proven, reusable patterns
    │   ├── triage/
    │   │   ├── label-classification.md
    │   │   └── priority-scoring.md
    │   ├── continuous-improvement/
    │   │   ├── complexity-analysis.md
    │   │   └── documentation-gap-detection.md
    │   ├── security/
    │   │   ├── dependency-cve-scanning.md
    │   │   └── secret-pattern-detection.md
    │   └── meta/
    │       ├── snr-scoring.md
    │       └── cost-tracking.md
    │
    ├── governance/
    │   ├── permissions.md                # Standard permission sets (copy/paste)
    │   ├── review-gates.md               # Required human approvals by tier
    │   ├── cost-budgets.md               # Monthly API cost limits per agent
    │   ├── snr-thresholds.md             # Signal-to-noise standards by phase
    │   └── agent-lifecycle.md            # How to add, modify, deprecate agents
    │
    ├── metrics/
    │   ├── dashboard.md                  # Links to live factory health dashboards
    │   ├── monthly-reports/              # Archived monthly performance reports
    │   └── agent-scorecard.md            # Current agent performance ledger
    │
    └── archive/
        └── deprecated/                  # Retired agents with deprecation notes
```

### Agent Markdown Definition Format

Every agent in `agents/` follows this standard template:

```markdown
# Agent: [Name]

## Identity
- **ID:** agent-XX-[slug]
- **Tier:** [1 / 2 / 3]
- **Category:** [Issue Mgmt / Fault Investigation / etc.]
- **Status:** [active / paused / deprecated]

## Purpose
One-sentence description of exactly what this agent does.

## Trigger
- **Event:** [GitHub Actions trigger]
- **Condition:** [Additional filter criteria]

## Behavior
Step-by-step description of what the agent does, in plain English.
Engineers can read this without ML expertise to fully understand agent logic.

## Permissions
```yaml
permissions:
  contents: [read/write/none]
  issues: [read/write/none]
  pull-requests: [read/write/none]
```

## Output
Description of what the agent produces.

## Review Gate
Who must review + what constitutes approval.

## Cost Budget
- **Model tier:** [Fast / Standard / Deep]
- **Monthly cap:** $[X]
- **Estimated cost/trigger:** $[X]

## Success Metric
How we know this agent is working.

## Maintenance Notes
Known edge cases, tuning history, last reviewed date.
```

---

## Part 5: Deployment Sequence — Risk-Tiered Rollout

### Phase 1: Foundation — Weeks 1–4 (Zero-Risk Observers)

**Objective:** Prove the pipeline. Build team trust. Establish baseline metrics.

| Week | Action | Agents Deployed | Cumulative Count |
|------|--------|-----------------|------------------|
| Week 1 | Set up `.github/agent-factory/` structure; deploy Issue Triage | 01 | 1 |
| Week 2 | Deploy CI Failure Analyst; observe outputs, tune Markdown | 04 | 2 |
| Week 3 | Deploy PR Labeler; deploy Flaky Test Detector | 02, 05 | 4 |
| Week 4 | Deploy Contributor Coordinator; assess Phase 1 metrics | 03 | 5 |

**Phase 1 Exit Criteria:**
- [ ] All 5 agents operational with <5% error rate
- [ ] Team can read any agent's Markdown and explain what it does
- [ ] Zero negative incidents (no incorrect labels that confused the team)
- [ ] Baseline metrics captured: issue triage time, CI MTTR, label accuracy

---

### Phase 2: Proactive Agents — Weeks 5–12 (Medium Risk, PR Review Required)

**Objective:** Start improving code quality. One new agent every 1–2 weeks.

| Week | Action | Agents Deployed | Cumulative Count |
|------|--------|-----------------|------------------|
| Week 5 | Deploy Continuous Documentation; establish PR review norms | 06 | 6 |
| Week 6 | Deploy Secret Leak Detector (security-first) | 11 | 7 |
| Week 7 | Deploy Dependency Audit Agent | 10 | 8 |
| Week 8 | Assess quality. Pause if SNR <80%. Continue if healthy. | — | 8 |
| Week 9 | Deploy Continuous Style Enforcer | 07 | 9 |
| Week 10 | Deploy Edge Case Validator | 13 | 10 |
| Week 11 | Deploy Test Coverage Improver | 12 | 11 |
| Week 12 | Deploy Continuous Simplicity Agent | 08 | 12 |

**Phase 2 Exit Criteria:**
- [ ] 12 agents running; agent PR merge rate >60%
- [ ] API costs within budget
- [ ] No agent PR caused a production regression
- [ ] Team has reviewed and closed first quality audit cycle

---

### Phase 3: Full Factory — Weeks 13–20 (Meta-Agents + Advanced)

**Objective:** Achieve factory self-governance. Add remaining agents.

| Week | Action | Agents Deployed | Cumulative Count |
|------|--------|-----------------|------------------|
| Week 13 | Deploy Agent Health Monitor (meta) | 14 | 13 |
| Week 14 | Deploy Output Quality Auditor (meta) | 15 | 14 |
| Week 15 | Deploy Continuous Refactoring Agent | 09 | 15 |
| Week 16 | Factory Review: deprecate underperformers; plan expansion | — | 15 |
| Week 17–20 | Extend to additional repositories; design Phase 4 agents | — | 15–25 |

**Phase 3 Exit Criteria:**
- [ ] Meta-agents operational and accurately reporting factory health
- [ ] SNR >75% across the full factory
- [ ] Factory requires <2 hours/week of human maintenance
- [ ] Living library documented and being used by team to create new agents

---

## Part 6: Cost Model & Governance Checklist

### Monthly Cost Estimate

Costs assume a medium-sized repository (500 issues/month, 200 PRs/month, daily builds).

#### Phase 1 Total (5 agents)
| Agent | Model Tier | Est. Monthly Cost |
|-------|-----------|-------------------|
| Issue Triage | Fast | $10–$20 |
| PR Labeler | Fast | $6–$30 |
| Contributor Coord | Fast | $2–$10 |
| CI Failure Analyst | Standard | $20–$120 |
| Flaky Test Detector | Standard | $5–$15 |
| **Phase 1 Total** | | **$43–$195/month** |

#### Phase 2 Additional (7 agents)
| Agent | Model Tier | Est. Monthly Cost |
|-------|-----------|-------------------|
| Continuous Docs | Standard | $30–$90 |
| Secret Leak Detector | Fast | $5–$25 |
| Dependency Audit | Standard | $10–$30 |
| Continuous Style | Fast | $10–$40 |
| Edge Case Validator | Standard | $15–$60 |
| Test Coverage Improver | Standard | $30–$90 |
| Continuous Simplicity | Standard | $30–$90 |
| **Phase 2 Additional** | | **$130–$425/month** |

#### Phase 3 Additional (3 agents)
| Agent | Model Tier | Est. Monthly Cost |
|-------|-----------|-------------------|
| Continuous Refactoring | Standard | $40–$120 |
| Agent Health Monitor | Fast | $5–$20 |
| Output Quality Auditor | Standard | $10–$30 |
| **Phase 3 Additional** | | **$55–$170/month** |

#### Full Factory (15 agents)
| Phase | Monthly Range |
|-------|--------------|
| After Phase 1 | $43–$195 |
| After Phase 2 | $173–$620 |
| After Phase 3 (full factory) | $228–$790 |

**ROI Context:** At a fully-staffed factory saving 10 hours/engineer/month across a 20-engineer team, the factory recovers ~200 engineer-hours/month. At a loaded engineer cost of $150/hour, that's **$30,000/month in recovered productivity** against a **$790/month AI infrastructure cost**.

---

### Governance Checklist — New Agent Admission Gate

Before any agent can be deployed to the factory, it must pass the following checklist:

#### Design Gate (before build)
- [ ] Friction point documented: specific, named problem this agent solves
- [ ] Agent ID and slot in the living library assigned
- [ ] Risk tier classified (1 / 2 / 3)
- [ ] Trigger event defined and scoped precisely
- [ ] Permission set drafted using least-privilege principle
- [ ] Model tier selected (Fast / Standard) based on task complexity — not defaulting to most expensive

#### Review Gate (before deployment)
- [ ] Markdown definition complete and peer-reviewed
- [ ] Permissions reviewed by security lead
- [ ] Monthly cost budget confirmed and within plan
- [ ] Review gate defined for Tier 2/3 agents
- [ ] Success metric defined — quantifiable, measurable within 30 days
- [ ] Rollback plan documented (how to disable agent if it causes problems)

#### Monitoring Gate (30 days post-deployment)
- [ ] Agent health monitor has coverage of new agent
- [ ] SNR measured for first full month
- [ ] Cost tracking live and within budget
- [ ] 30-day performance review completed
- [ ] Agent promoted to "stable" status or flagged for tuning

#### Ongoing Governance
- [ ] **Quarterly review** of all agents: deprecate those with SNR <70% for 2+ quarters
- [ ] **Permission audit** every 6 months: ensure no permission creep
- [ ] **Cost review** monthly: per-agent API cost vs. value delivered
- [ ] **Living library** updated within 72 hours of any agent change
- [ ] **No silent agents**: if an agent hasn't triggered in 30 days, investigate

---

## Appendix A: Anti-Patterns This Architecture Explicitly Prevents

| Anti-Pattern | How This Blueprint Prevents It |
|-------------|-------------------------------|
| **Monolithic AI** | 15 specialized agents, each with one job |
| **Permission creep** | Hard permission ledger + semi-annual audit |
| **Output fatigue** | Meta-agents enforce SNR thresholds; alerts at <70% |
| **Black box logic** | All agent logic lives in human-readable Markdown |
| **Direct commits** | No agent writes to main; all changes via PR |
| **Cost spiral** | Per-agent monthly budgets + cost monitor meta-agent |
| **Automation sprawl** | Every agent maps to a documented friction point |
| **Stale agents** | Quarterly deprecation review; 30-day inactivity alert |

---

## Appendix B: Customization Points for Client Delivery

When delivering this blueprint to a specific client, customize the following:

1. **Repository names** — Replace `[your-repo]` with actual target repos
2. **Team structure** — Update `Contributor Coordinator` with actual team area labels
3. **CI system** — Blueprint assumes GitHub Actions; adapt triggers for GitLab/Bitbucket
4. **Cost budgets** — Adjust based on client's team size and issue/PR volume
5. **Security requirements** — Add SOC2/HIPAA/PCI-DSS-specific agents for regulated clients
6. **Model selection** — Swap fast/standard tiers based on client's preferred LLM provider
7. **Existing tooling** — Identify overlaps with Dependabot, CodeQL, etc. to avoid duplication
8. **Phase timing** — Compress or extend phases based on client's risk tolerance and team velocity

---

## Appendix C: Quick-Reference Card

**Fastest path to first value:**
1. Day 1: Deploy agent-01 (Issue Triage) — visible ROI within 24 hours
2. Day 2: Deploy agent-04 (CI Failure Analyst) — senior engineers immediately notice
3. Week 2: Deploy agent-06 (Continuous Docs) — first PR from an agent
4. Week 4: Deploy agent-11 (Secret Scan) — security leadership buy-in

**The two rules that matter most:**
1. Never grant a permission an agent doesn't actively need
2. Once you have 10 agents, meta-agents are not optional

**The SNR rule:**
- >90% = healthy, keep going
- 80–90% = watch closely, tune before adding more
- 70–80% = pause new deployments, fix existing agents first
- <70% = red alert, meta-agent audit required

---

*Blueprint version 1.0 — INT Customization Service — 2026-03-25*
*Based on the Agent Factory pattern by Peli de Halleux, GitHub Next / Microsoft Research*