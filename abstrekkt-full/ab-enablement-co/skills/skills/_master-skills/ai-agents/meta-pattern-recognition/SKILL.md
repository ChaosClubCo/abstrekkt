---
name: meta-pattern-recognition
description: Helps configure and build meta pattern recognition processes. Spot patterns appearing in 3+ domains to find universal principles. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Meta-Pattern Recognition

## Overview

When the same pattern appears in 3+ domains, it's probably a universal principle worth extracting.

**Core principle:** Find patterns in how patterns emerge.

## Quick Reference

| Pattern Appears In | Abstract Form | Where Else? |
|-------------------|---------------|-------------|
| CPU/DB/HTTP/DNS caching | Store frequently-accessed data closer | LLM prompt caching, CDN |
| Layering (network/storage/compute) | Separate concerns into abstraction levels | Architecture, organization |
| Queuing (message/task/request) | Decouple producer from consumer with buffer | Event systems, async processing |
| Pooling (connection/thread/object) | Reuse expensive resources | Memory management, resource governance |

## Process

1. **Spot repetition** - See same shape in 3+ places
2. **Extract abstract form** - Describe independent of any domain
3. **Identify variations** - How does it adapt per domain?
4. **Check applicability** - Where else might this help?

## Example

**Pattern spotted:** Rate limiting in API throttling, traffic shaping, circuit breakers, admission control

**Abstract form:** Bound resource consumption to prevent exhaustion

**Variation points:** What resource, what limit, what happens when exceeded

**New application:** LLM token budgets (same pattern - prevent context window exhaustion)

## Additional Examples

**Pattern spotted:** Backpressure in TCP flow control, Kafka consumer lag, thread pool saturation, grocery checkout lines

**Abstract form:** Signal upstream to slow down when downstream can't keep up

**Variation points:** What signal mechanism, what threshold triggers it, graceful vs hard cutoff

**New application:** LLM batch processing - when output queue fills, throttle new prompt submissions rather than dropping results

---

**Pattern spotted:** Sharding in database partitioning, DNS zones, microservice boundaries, library book shelving by genre

**Abstract form:** Divide a large space into smaller, independently manageable segments

**Variation points:** Partition key selection, rebalancing strategy, cross-shard queries

**New application:** Prompt routing - shard user requests by domain to specialized fine-tuned models

## Red Flags You're Missing Meta-Patterns

- "This problem is unique" (probably not)
- Multiple teams independently solving "different" problems identically
- Reinventing wheels across domains
- "Haven't we done something like this?" (yes, find it)
- Solving the same class of problem with a different name each time

## Tips for Effective Meta-Pattern Work

- Keep a running log of patterns you spot - review it monthly for clusters
- When you find a pattern, immediately ask "where else does this apply?"
- Teach others to spot patterns; a team that pattern-matches is far more effective
- Cross-pollinate: read outside your domain to accelerate recognition

## Remember

- 3+ domains = likely universal
- Abstract form reveals new applications
- Variations show adaptation points
- Universal patterns are battle-tested
- The best engineers are pattern collectors
