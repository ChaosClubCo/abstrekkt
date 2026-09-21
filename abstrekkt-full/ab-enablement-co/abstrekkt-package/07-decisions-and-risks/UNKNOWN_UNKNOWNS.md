# Unknown Unknowns

Structured techniques applied to surface risks not explicitly visible in the KB. Each entry: scenario → why it was missable → early warning → detection → prevention → contingency.

## Pre-mortem — "It's 2027-01 and FlashFusion earned nothing. Why?"

- **UU-1 · The legal gate never closed.** Kyle kept doing free work (Art, Ryan) because it felt productive, and the LLC/E&O/IP items stayed "almost done" for six months. *Warning:* free engagements accumulate while B-1..B-5 stay open. *Detection:* Milestone-0 checklist age. *Prevention:* time-box Phase 0 to July; no new free engagement until gate closes. *Contingency:* hard-stop rule — one free engagement max until entity exists.
- **UU-2 · First floor-hold failed and cascaded.** The first paid prospect pushed, Kyle discounted, and every subsequent prospect referenced it. *Warning:* a discovery call where the floor gets hedged. *Detection:* any signed audit < $4,500. *Prevention:* scripted floor-hold + Ryan case study as proof. *Contingency:* document any exception as isolated, in writing, same day.

## Dependency inversion — "What if X disappears?"

- **UU-3 · Anthropic changes terms/pricing/Partner Network criteria.** Provider + credential + partner concentration means one change hits three things. *Warning:* Anthropic policy emails. *Detection:* monitor provider changelog. *Prevention:* keep the champion-model IP provider-agnostic; design a provider-abstraction layer before scaling product. *Contingency:* the consulting offer survives a provider swap; the product line is more exposed.
- **UU-4 · Base44 or n8n cloud outage/discontinuation.** Fusion AI + automation both sit on hosted no-code platforms. *Warning:* platform status pages. *Prevention:* export entity schemas + workflow definitions to version control. *Contingency:* consulting continues; internal tooling degrades to manual.

## Scale test — "What breaks at 10x?"

- **UU-5 · 10x clients but still one deliverer.** The champion model is designed to exit dependency, but if handoffs are incomplete, Kyle becomes on-call for every past client. *Warning:* past clients messaging for help post-engagement. *Prevention:* enforce documented-workflow handoff as an acceptance criterion. *Contingency:* contractor bench.

## Hostile-user test

- **UU-6 · Prompt injection / data exfiltration through a client-facing agent.** A malicious input causes a delivered agent to leak data or take a harmful action. *Warning:* none without logging. *Prevention:* HITL on consequential actions; input validation; threat model before any client agent ships. *Contingency:* kill switch + incident comms plan (neither exists yet).

## Operator test — "What won't the 2 a.m. maintainer understand?"

- **UU-7 · The ~101-entity Base44 schema with unknown dead entities.** A future operator (or Kyle in 6 months) can't tell which entities are live. *Prevention:* entity audit + dependency map now, while context exists.

## Handoff test — "What lives only in Kyle's head?"

- **UU-8 · Client relationships, pricing rationale, the day-job clearance terms.** *Prevention:* the written clearance exists; ensure pricing rationale + client context are in the project, not memory.

## Cost test

- **UU-9 · Model/API + hosted-platform costs scale silently with usage.** No unified cost view exists. *Warning:* monthly Anthropic/Supabase/Base44 bills. *Prevention:* the CFO ROI model being built for clients should also be pointed inward. *Contingency:* usage caps.

## Reality test — "Which assumed thing may not actually work?"

- **UU-10 · The 30% ladder conversion is assumed, never observed.** Zero paid clients means zero conversion data. *Prevention:* treat the ladder as a hypothesis; instrument the first three audits. *Contingency:* renegotiate the gate sequence (not the floor) if conversion underperforms. [SOURCED — flashfusion-arc explicitly frames this as an assumption]
