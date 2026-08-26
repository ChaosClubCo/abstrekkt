# Ad Copy Prompt Library

Use these prompts with Claude (claude.sonnet-4-20250514) to generate Facebook ad copy for any client.
Swap `{{VARIABLES}}` before running. Always generate 3+ variations per ad set.

---

## Master prompt — benefit-led variation

```
You are writing Facebook ad copy for a local service business. Write in plain, direct language.
No corporate speak. No generic phrases like "world-class" or "second to none."

Business: {{CLIENT_NAME}}
Service: {{SERVICE_TYPE}}
Location: {{CLIENT_CITY}}
Target customer: {{TARGET_AUDIENCE}}
Primary CTA: {{CTA}} (e.g. "Get a free quote" / "Book online" / "Call us today")
Unique angle: {{DIFFERENTIATOR}} (e.g. "33 years in business" / "3 locations" / "same-day service")

Write 3 Facebook ad variations, each with:
- Headline: under 40 characters, benefit-focused
- Primary text: 2–3 sentences max, ends with a question or soft CTA
- One concrete detail (number, timeframe, or specific outcome)

Format each as:
VARIATION A
Headline: [headline]
Primary text: [text]

Do not use emojis. Do not use exclamation points more than once per variation.
Do not use the word "amazing", "passionate", "journey", or "solutions".
```

---

## Problem-led variation prompt

```
You are writing Facebook ad copy that opens with a pain point.

Business: {{CLIENT_NAME}}
Problem their customers face: {{CUSTOMER_PROBLEM}} (e.g. "guitar sitting unplayed because it's hard to play")
Service that solves it: {{SERVICE_TYPE}}
Location: {{CLIENT_CITY}}
CTA: {{CTA}}

Write 3 variations, each opening with the customer's problem — not the business.
Make the reader feel seen before introducing the solution.

Format:
VARIATION A
Headline: [headline under 40 chars]
Primary text: [2–3 sentences, problem → solution → CTA]
```

---

## Social proof / credibility variation prompt

```
You are writing Facebook ad copy that leads with credibility.

Business: {{CLIENT_NAME}}
Years in business: {{YEARS}}
Number of locations: {{CLIENT_LOCATIONS}}
Number of staff or technicians: {{STAFF_COUNT}}
Brands/manufacturers they're certified by: {{CERTIFICATIONS}}
One customer result or testimonial (if available): {{TESTIMONIAL}}

Write 3 variations using credibility signals — not claims.
Show, don't tell. Numbers beat adjectives.

Format:
VARIATION A
Headline: [headline]
Primary text: [2–3 sentences]
```

---

## Seasonal / promotional prompt

```
You are writing a Facebook ad for a seasonal promotion or event.

Business: {{CLIENT_NAME}}
Promotion: {{PROMOTION}} (e.g. "10% off setups in June" / "Back to school guitar checkup")
Urgency factor: {{DEADLINE}} (e.g. "ends June 30" / "limited spots")
CTA: {{CTA}}

Write 3 variations. At least one should use urgency without being manipulative.
The deadline must be real — never fabricate a deadline.

Format:
VARIATION A
Headline: [headline]
Primary text: [2–3 sentences]
```

---

## Quality check before using any copy

Run every generated variation through this checklist:

- [ ] Headline is under 40 characters
- [ ] No claim that can't be verified (no "best in Chicago" without a source)
- [ ] No generic filler words: amazing, passionate, journey, solutions, world-class
- [ ] Ends with a clear action the reader can take
- [ ] Reads like a human wrote it, not a marketing department
- [ ] Specific detail included (a number, a timeframe, a named service)
- [ ] Approved by {{CLIENT_CONTACT}} before publishing

---

## Third Coast Guitar Service — pre-built copy (example)

**Benefit-led — Variation A**
Headline: Guitar tech since 1991. Chicago's best.
Primary text: Your guitar plays better after a setup. We've been doing this for 33 years, with techs certified by 30+ manufacturers. Book a setup at any of our 3 Chicago-area locations.

**Problem-led — Variation A**
Headline: Is your guitar hard to play?
Primary text: A guitar that fights you isn't a gear problem — it's a setup problem. Our techs have seen it thousands of times. One appointment at Third Coast and you'll wonder why you waited. Get a quote.

**Credibility — Variation A**
Headline: 10 techs. 3 locations. 30+ brands.
Primary text: Third Coast Guitar Service has been Chicago's go-to repair shop since 1991. Factory authorized by Gibson, Fender, Taylor, and 30+ others. Walk-ins welcome at Chicago, Palatine, and Downers Grove.
