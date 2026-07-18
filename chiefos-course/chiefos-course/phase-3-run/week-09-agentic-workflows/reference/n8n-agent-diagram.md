# Reference: A Real Agentic Workflow (Real-Estate Lead Agent)

This is a real agent built in n8n. Read it as a **chain of small, verifiable steps** — the
opposite of one giant prompt. This is the shape ChiefOS-style agents take.

```
1. WhatsApp Trigger (message received)
        ↓
2. Extract Lead Details
        ↓
3. AI Agent (Tools Agent)  ──uses──►  OpenAI Chat Model
        │                  ──uses──►  Conversation Memory
        ↓
4. Answer FAQs
        ↓
5. Collect Budget
        ↓
6. Collect Location
        ↓
7. Collect Property Type
        ↓
8. Qualify Lead (set)
        ↓
9. IF Qualified? ──true──► 10. Search Matching Listings
        │                          ↓
        │                  11. Send Property Options
        │                          ↓
        │                  12. Create / Update Lead in CRM
        │                          ↓
        │                  13. Notify Sales Agent
        │                          ↓
        │                  14. Schedule Follow-up
        │
        └──false──► 15. Human Handover (Optional)  ◄── the escape hatch
```

## What to notice (this is the lesson)
1. **Small steps, each checkable.** No single step is magic. Each does one thing you could verify.
2. **The AI agent is ONE node**, not the whole system. It has a model and memory attached, and it's surrounded by ordinary logic (extract, qualify, branch).
3. **A branch with a gate.** `IF Qualified?` decides the path — a human-designed decision point.
4. **A human handoff.** When the agent shouldn't decide alone, it routes to a person.
5. **It ends in real actions** — update the CRM, notify a human, schedule a follow-up. Agents *do things*, they don't just chat.

When you design your own agent (exercises), copy this shape: small steps, a clear gate, and a human escape hatch.
