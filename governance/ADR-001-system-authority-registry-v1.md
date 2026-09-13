# ADR-001 — SystemAuthorityRegistry/v1

- **Status:** Accepted / Frozen
- **Effective:** 2026-08-28
- **Owner:** Abstrekkt
- **Machine-readable contract:** `governance/system-authority-registry.v1.json`

## Decision

Abstrekkt adopts a single-writer-per-domain authority model. `n8n/ACP/TESSA` is the only cross-system execution authority. Provider-native automations may emit events or perform narrowly local operations, but consequential workflows that coordinate writes across systems must pass through ACP authorization, idempotency, bounded retry, evidence/receipt generation, and reconciliation.

## Canonical authorities

| Domain | Authority | Supporting systems |
| --- | --- | --- |
| Cross-system execution | n8n / ACP / TESSA | Provider-native triggers |
| Revenue CRM | HubSpot | Folk, Hunter, Calendly |
| Relationship intelligence | Folk | HubSpot projection |
| Lead enrichment | Hunter | HubSpot |
| Scheduling | Calendly | HubSpot, n8n |
| Durable knowledge | Mem | Context7, source systems |
| Technical documentation truth | Context7 + official vendor docs | Engineering workflows |
| Commerce, when release-bound | Shopify | Printify, Etsy, n8n |
| Fulfillment | Printify | Shopify |
| Marketplace channel | Etsy | Shopify, n8n |
| Corporate/product marketing web | Wix | n8n |
| Editorial/blog publishing | WordPress | n8n |
| Customer conversation runtime | Botpress | n8n / ACP |
| Advertising measurement | OpenAI Ads | THE VERDICT, n8n evidence |
| Typography discovery | MyFonts | Brand system |
| Audio derivatives | Speechify | Source content systems |

## Permanent Wix / WordPress boundary

**Wix** owns corporate/product marketing surfaces: landing pages, service pages, product-marketing pages, and conversion-oriented web experiences.

**WordPress** owns editorial/blog publishing and long-form research-derived content.

The same canonical content must not be independently authored in both systems. Any cross-publishing must originate from one canonical content object and be treated as a projection.

## CRM boundary

HubSpot is the canonical revenue CRM. It owns Contacts, Companies, Deals, lifecycle state, revenue state, sales activity, and customer ownership.

Folk is limited to founder/partner/warm-relationship intelligence. Hunter is limited to discovery, enrichment, and verification. Neither system may become an alternate revenue-pipeline authority.

## Commerce boundary

Shopify is intentionally dormant as a release authority until commerce is explicitly promoted into release scope. When that happens, Shopify owns merchant-facing product, variant, SKU, price, cart, checkout, order, and commerce-customer state.

Printify remains fulfillment/manufacturing authority. Etsy remains a marketplace/channel adapter. Neither owns the universal product model.

## Botpress boundary

Botpress is a conversation runtime, not an execution authority. It may read approved context, collect intent, and present responses. Mutations involving CRM, commerce, scheduling, email, billing, fulfillment, or other consequential systems must route through n8n/ACP.

## Mem boundary

Mem stores durable semantic knowledge such as architecture decisions, system summaries, project context, research findings, customer context, postmortems, verified procedures, governance policy, and release-evidence summaries.

Mem must not store runtime locks, leases, retry counters, pending transactions, idempotency state, ephemeral authorization, runtime secrets, or provider tokens.

## IntegrationEvent/v1

Cross-system events normalize into `IntegrationEvent/v1` with these required fields:

- `event_id`
- `event_type`
- `occurred_at`
- `source`
- `subject_type`
- `subject_id`
- `correlation_id`
- `causation_id`
- `schema_version`
- `actor`
- `consent_context`
- `payload`
- `evidence_refs`

Required execution path:

`validate -> normalize -> authorize -> execute -> receipt -> reconcile`

## THE VERDICT paid-acquisition gate

Paid acquisition remains blocked until all of the following are evidenced:

1. Advertiser identity verification approved.
2. Conversion Source / Pixel provisioned.
3. One Pixel ID bound to both browser Pixel and server CAPI.
4. One deterministic `event_id` reused by both transports for the same logical conversion.
5. Consent/privacy gates verified.
6. One real bounded conversion executed.
7. Recent conversion events inspected and duplicate transports proven to deduplicate into one logical conversion.
8. Evidence preserved in `ADS-001` or a successor receipt.
9. Only then may paid acquisition be activated.

## Change control

This decision is frozen as `SystemAuthorityRegistry/v1`. Any authority change requires a new versioned governance decision. A connector exposing a convenient write operation is not sufficient justification to change ownership.
