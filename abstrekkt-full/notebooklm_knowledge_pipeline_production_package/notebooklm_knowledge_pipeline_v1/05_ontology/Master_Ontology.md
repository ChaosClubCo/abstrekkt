# Master Ontology — Agentic AI / MCP / Cowork OS

## Purpose

This ontology prevents the corpus from creating five names for the same idea. Every extracted concept should map to one canonical term where possible.

## Canonical Terms

### Agent

Definition: A bounded software actor that can pursue a goal, call tools, use memory, produce artifacts, and report state under explicit constraints.

Aliases: AI employee, coworker, worker agent, assistant, executor, autonomous agent.

Relationships: uses Skill; calls Tool; reads Memory; writes Artifact; reports to Orchestrator; requires Security Control; may require Human Approval Gate.

### Skill

Definition: A reusable capability package that lets an agent perform a class of tasks reliably, such as OCR extraction, transcript summarization, code review, or lead qualification.

Aliases: capability, routine, procedure, tool-use pattern, playbook.

Relationships: owned by Agent; executes Workflow; may call MCP Server; produces Artifact.

### Tool

Definition: A callable external or internal function used by an agent, such as Gmail, Google Drive, Supabase, GitHub, OCR, Whisper, or a browser automation action.

Aliases: connector, action, integration, API function.

Relationships: called by Agent; constrained by Security Control; authenticated by Secret; logged by Observability Event.

### MCP Server

Definition: A server exposing tools/resources to AI agents through a Model Context Protocol-style interface or equivalent connector contract.

Aliases: tool server, local bridge, agent bridge, connector server.

Relationships: exposes Tool; requires Authentication; enforces Authorization; logs Tool Call; can access Local Resource.

### Memory

Definition: Stored information an agent can retrieve later, including episodic memory, semantic concepts, working state, user preferences, project status, and operational history.

Aliases: Company Brain, knowledge base, agent memory, RAG store, filing cabinet.

Relationships: stores Concept; links to Provenance Record; retrieved by Agent; updated by Workflow.

### Workflow

Definition: An ordered set of steps that transforms inputs into outputs with decision points, QA gates, and provenance.

Aliases: playbook, pipeline, process, runbook.

Relationships: executed by Agent or Human; consumes Asset; produces Artifact; includes QA Gate; may require Human Approval Gate.

### Orchestrator

Definition: A coordinator that routes tasks to agents, tracks state, handles approvals, applies policy, and manages retries/fallbacks.

Aliases: manager agent, router, controller, conductor, head agent.

Relationships: routes Task; monitors Agent; enforces Policy; escalates Human Approval Gate.

### Human Approval Gate

Definition: A mandatory decision point where a human must approve, reject, or modify an agent action before execution continues.

Aliases: HITL, manual approval, review gate, sign-off.

Relationships: guards Risk; approves Workflow Step; blocks destructive actions; records Decision.

### Provenance Record

Definition: A structured reference showing where a claim, concept, relationship, or artifact came from.

Aliases: citation, source trace, evidence pointer.

Relationships: supports Claim; links Asset to Concept; enables audit; reduces hallucination risk.

### Security Control

Definition: A policy, mechanism, or boundary that reduces misuse, leakage, unauthorized access, or unsafe autonomous action.

Aliases: guardrail, boundary, policy, control, enforcement point.

Relationships: protects Asset; constrains Tool; requires Audit Log; can trigger Human Approval Gate.

## Deprecated or ambiguous terms

- "AI that can do anything" should be treated as marketing language unless backed by specific tool permissions, workflows, and constraints.
- "Autonomous employee" should map to Agent plus Workflow plus Tool plus Approval Gate. Do not treat it as literal employment or unlimited autonomy.
- "Prompting is dead" should be treated as a thesis about shifting from one-off prompts to reusable skills/workflows, not a literal claim that prompts vanish.
