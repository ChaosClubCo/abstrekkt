# Outcome-Aware AI Systems — Cross-Reference & Archive Notices
**Date:** May 2026

---

## 1. Archive Notice: `Intent_Based_Computing_Runbook.docx`

> **STATUS: SUPERSEDED**
>
> This document (Intent-Based Computing Runbook, Version 1.0, May 2026) is superseded by the
> **Outcome-Aware AI Systems Runbook v2.0+ (Parts A–W)**, May 2026.
>
> **Why superseded:**
> - The IBN runbook is networking-domain-specific. The 23-part runbook is domain-general.
> - The IBN runbook uses "Intent-Based Computing" as the canonical label. The 23-part runbook
>   rejects this label in favor of "Outcome-Aware AI Systems" (see Part A §1.4 for rationale).
> - All structural content (architecture layers, approval gates, audit trail, governance,
>   failure modes) is covered more comprehensively in the 23-part version.
>
> **Retained for:** Historical reference on IBN-specific content (Cisco DNA Center, Juniper
> Apstra, SDN→IBN relationship, intent expression languages, the five-component IBN closed loop).
> These networking-specific sections have no equivalent in the domain-general runbook.
>
> **Do not cite this document as current guidance.** Cite the 23-part runbook (Parts A–W) instead.

---

## 2. Cross-Link Addendum: `outcome-aware-mcp-combos-v0.1.md`

Add to the combos spec's README or as a section in the spec itself:

> ### Related: Operational Deployment Guide
>
> The **Outcome-Aware AI Systems Runbook (Parts A–W)** is the operational deployment guide
> for systems built on the patterns in this spec.
>
> | This spec covers | The runbook covers |
> |---|---|
> | What to build (MCP-level code specs) | How to operate it (platform, governance, adoption) |
> | Outcome Receipt + Verdict schemas | Database schema, API endpoints, event model |
> | Sycophancy telemetry mechanism | Ethics framework, feedback loop architecture |
> | Maturity model (outcome-verification dimension) | Comprehensive: legal, cost, accessibility, DR, enterprise scale |
> | Single-user baseline | Multi-user coordination, delegation, async approval |
> | Threat model (v0.1) | Full security implementation, PII detection, credential lifecycle |
>
> **Reading order for implementers:**
> 1. This spec (combos v0.1) — understand the three combos
> 2. Repo schemas — understand the data contracts
> 3. Runbook Part B — platform architecture and event model
> 4. Runbook Part M — OAuth token lifecycle and adapter registry
> 5. Runbook Part K — rollback state machine (not covered in this spec)
> 6. Runbook Part W §4 — event-driven execution (triggers, schedules)

---

## 3. Cross-Link Addendum: `outcome-aware-mcp` GitHub Repo

Add to the repo's README.md under a "Related" section:

> ### Related
>
> - **[outcome-aware-mcp-combos-v0.1.md](outcome-aware-mcp-combos-v0.1.md)** — The complete
>   specification for all three combos. Start here to understand the framework.
> - **Outcome-Aware AI Systems Runbook (Parts A–W)** — The operational deployment guide covering
>   platform architecture, governance, adoption, legal, cost modeling, accessibility, disaster
>   recovery, and enterprise scale. The runbook is the "how to run this in production" complement
>   to this repo's "what to build" specifications.

---

## 4. Reconciliation Note: OTel-for-MCP

**Open question across both documents:**

The combos spec (open question #1) asks: "Should Outcome Receipts harmonize with the OTel-for-MCP proposal or fork ahead?"

The runbook (Part B §11) uses standard OpenTelemetry for platform observability but does not address the MCP-specific OTel proposal.

**Current status:** Unresolved.

**Recommendation:**
- The runbook's OTel instrumentation (traces, metrics, alerts) targets the **platform layer** — request lifecycle, execution engine, API gateway.
- The combos spec's Receipt schema targets the **MCP tool call layer** — what each individual tool claimed to do and whether it was verified.
- These are different observability surfaces. They can coexist.
- If/when the OTel-for-MCP proposal ships a standard `agent-run-record` schema, the Receipt schema should adopt compatible field names and extend (not replace) the standard fields with the claim/verification layer.
- Track at: [OTel MCP Discussion #269](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/269)

**Action items:**
1. Subscribe to OTel-for-MCP proposal updates
2. When the proposal reaches draft status, compare field names with `receipt.v0.1.schema.json`
3. If compatible: adopt and extend. If incompatible: document the divergence and rationale.
4. Update both the combos spec changelog and the runbook's Part B §11 when resolved.
