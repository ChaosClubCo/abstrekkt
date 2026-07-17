---
name: integration-complexity-estimating
description: Estimate technical complexity and effort for integrating AI solutions with existing enterprise systems. Use when scoping implementation work, sizing professional services engagements, or creating project timelines. Triggers on integration estimate, implementation timeline, technical scoping, effort estimation, professional services sizing.
version: 1.0.0
allowed-tools: Read, Write, Bash
license: MIT
---

# Integration Complexity Estimating

## Purpose
Size technical integrations to generate accurate professional services quotes and project timelines.

## When to Use
- Creating SOW (Statement of Work) for implementation
- Customer asks: "How long will this take?"
- Professional services team needs effort estimate

## Complexity Factors
**Simple (2-4 weeks):** REST API, OAuth, webhooks
**Medium (6-8 weeks):** Database integration, batch ETL, custom auth
**Complex (12+ weeks):** Legacy systems, custom protocols, data migration

## Estimation Formula
```
Total Hours = (
  API Integration Hours +
  Data Pipeline Hours +
  Testing Hours +
  Documentation Hours
) * Risk Multiplier (1.2-1.5x)
```

## Output
Effort estimate (hours) + timeline (weeks) + risk factors
