# Canonical World Model

## Purpose

The canonical world model defines what the system believes exists. It prevents agents from inventing arbitrary structures and gives migrations, memory systems, and UIs a shared semantic contract.

## Top-Level Domains

1. Organization
2. Person
3. Project
4. Asset
5. Knowledge
6. Prompt
7. Agent
8. Workflow
9. Decision
10. Event
11. System
12. Integration
13. Policy
14. Memory
15. Client
16. Product
17. Service
18. Risk
19. Metric
20. Evidence

## Core Entity Map

```txt
Organization
 ├── owns → Project
 ├── employs → Person
 ├── authorizes → Agent
 ├── contains → KnowledgeAsset
 ├── operates → Workflow
 ├── enforces → Policy
 └── serves → Client

Project
 ├── contains → Asset
 ├── uses → Prompt
 ├── routes_to → Agent
 ├── produces → Output
 ├── governed_by → Policy
 └── measured_by → Metric

Asset
 ├── derived_from → Source
 ├── supports → Decision
 ├── related_to → Knowledge
 ├── used_by → Agent
 └── belongs_to → Project

Agent
 ├── executes → Workflow
 ├── reads → Memory
 ├── proposes → Decision
 ├── mutates → Entity
 ├── governed_by → Policy
 └── reports_to → HumanOwner

Prompt
 ├── instructs → Agent
 ├── governed_by → Policy
 ├── produces → Output
 ├── version_of → Prompt
 └── evaluated_by → Test

Memory
 ├── summarizes → Knowledge
 ├── references → Asset
 ├── records → Event
 ├── stores → Decision
 └── expires_by → MemoryPolicy
```

## Required Fields For All Canonical Entities

- id
- entity_type
- name
- description
- owner_id
- tenant_id
- status
- source_system
- created_at
- updated_at
- provenance_id
- confidence_score
- visibility_scope
- lifecycle_state

## Entity Lifecycle States

- proposed
- active
- validated
- stale
- deprecated
- archived
- deleted
- quarantined
- unresolved
