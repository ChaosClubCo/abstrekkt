# FlashFusion — MVP Pitch Pack

**Purpose**: Ship one paid pilot in 30 days. Five warm customers, ranked by WSJF (value / job size). Outreach templates for each.

---

## The MVP Decision: Pick One, Ship It

Shipping one customer matters more than architecting ten. Here's the WSJF ranking.

### Customer Prioritization (WSJF = Cost of Delay / Job Size)

| Rank | Customer | Cost of Delay | Job Size | WSJF | Why |
|------|----------|--------------|----------|------|-----|
| **#1** | **Grand Appliance** | **HIGH** — category template for 200+ regional retailers; Aaron is a friend; birthday month (March→April); scalable vertical | **MEDIUM** — post-purchase lifecycle agent is well-scoped; Base44 can ship in 2 weeks | **⭐ HIGHEST** | Build once, sell 200x |
| #2 | The Sole Revival | HIGH — Fortune 500 logo validation (Amex, Capital One, PepsiCo, Dell, Comcast); Kyle previously worked there, fastest trust | LOW — "Activation OS" for corporate events is simple CRUD + agent | HIGH | Fastest trust, highest logos |
| #3 | Centerline Equipment | MEDIUM — aerospace/military case study is gold for Anthropic; best-friend intro | HIGH — MIL-SPEC docs, RFQ parsing is complex; can't touch proprietary process | MEDIUM | Great case study, hard execution |
| #4 | CSTMPRNT | MEDIUM — ERP automation is real pain; custom print is a vertical | MEDIUM–HIGH — ERP integration is always longer than you think | MEDIUM | Vertical-adjacent to Relish |
| #5 | Relish Print Shop | LOW — small print shop, limited scale | LOW | LOW | Ship after #1–#3 |

**Recommended first pilot: Grand Appliance — Post-Purchase Lifecycle Agent**

---

## The MVP: Post-Purchase Lifecycle Agent for Grand Appliance

### One-sentence pitch
An AI agent that watches every customer's appliance purchase date, sends intelligent maintenance reminders, flags warranty expirations, and surfaces upgrade opportunities at the exact right moment — turning one-time buyers into 15-year customers.

### Why this use case
- Appliances last 10–15 years. **Nobody tracks this.** Not Amazon. Not Home Depot. Not Grand Appliance today.
- This is where independents can **beat Amazon** — CRM sophistication on top of a personal relationship.
- Claude-native makes this cheap. Per-customer cost: ~$0.10/year at Claude Haiku token rates.
- **Demonstrates every FlashFusion differentiator**: RLS per-customer isolation, audit log of every agent action, A/B tested reminder messaging, MCP tool for CRM lookup.

### Scope (30 days, one location pilot)

**Week 1 — Data**
- CSV import of past 12 months of sales (customer, product, purchase date, warranty terms)
- Set up RLS in Supabase with tenant_id = grand_appliance_store_id
- Build customer profile entity

**Week 2 — Agent**
- Claude Sonnet 4.5 agent with tools:
  - `lookupCustomer(customer_id)` — MCP tool hitting Grand's CRM
  - `sendSMS(customer_id, template, variables)` — MCP tool to Twilio
  - `logInteraction(customer_id, action, reason)` — writes to audit_log
- Prompt templates (A/B tested): year-2 maintenance, year-5 deep clean, year-8 upgrade opportunity, warranty expiry-30

**Week 3 — Dashboard**
- Store manager dashboard (Next.js): customers, upcoming touchpoints, message previews, agent audit log
- Manager can approve/edit/reject every agent-generated message before it sends (human-in-loop)

**Week 4 — Launch & measure**
- 100-customer pilot (opt-in from recent buyers)
- Success metrics: open rate, reply rate, service bookings attributed, upgrade sales attributed

### Pilot pricing
- **$7,500 pilot fee** (30 days, one location, 100 customers)
- **$60K/year** if they scale to all 20 locations + 50K customer database

### What Grand gets
- Agent that runs 24/7 for less than 1/10th the cost of a part-time CRM manager
- Complete audit log of every customer touchpoint
- A/B tested messaging showing which language converts
- Template that transfers to delivery coordination, service scheduling, price-match, and sales floor intelligence

### What FlashFusion gets
- Anchor case study: "20-location, 95-year-old family retailer runs agent-native customer lifecycle on Claude. Zero security incidents. $X revenue attributed."
- Template for every regional appliance retailer in the US (category is 200+ companies)
- Proof point for Anthropic Partner Network application

---

## Outreach Templates

### Grand Appliance — Aaron Reckling

**Channel**: Text first, then dinner. Do NOT email.

**Text (Week 1)**:
> Hey Aaron — saw it's your birthday month. Hope you and the family are good. Unrelated: I've been building something I think you'd find interesting. Not pitching anything — just want to buy you dinner and show you what it does. Next two weeks work?

**Dinner conversation opener (NO slides, no laptop):**
> Aaron, I'm not here to sell you software. I want to ask you one question and listen. What's the thing that keeps you up at night operationally? What's the thing that if you could wave a wand and fix, you would?

**Whatever he says, respond with:**
> I think I can build that. Let me come back in two weeks with something concrete. Not a deck — a working demo for one of your locations. If it doesn't land, we got dinner.

**Follow-up (Day 14)**:
> Aaron — demo ready. Want to do it at [location] so you can watch it run on real data? 30 min. I'll bring coffee.

---

### The Sole Revival — (Kyle's prior employer)

**Channel**: Direct — leverage prior relationship.

**Message**:
> Hey [name] — long time. I've been building an AI platform for businesses like yours, and I want to show you something specifically because of who you work with (Amex, Cap One, Pepsi). I built a demo of what I'm calling an "Activation OS" — it handles the entire event lifecycle (client intake, design sign-off, production scheduling, on-site event coordination, post-event gallery, follow-up) with an AI agent. I want to give it to you for free for 90 days as my first customer because your logo list opens every Fortune 500 door in the country. Can we jump on a call this week?

---

### Centerline Equipment — Best Friend

**Channel**: In person.

**Opening (leading with domain, NOT product)**:
> Random thing first — did you know there's a 5-million-developer AI company called Cline that's all over Fortune 500? They're on cline.bot. Your .com could be worth $50K to $500K+ to them. I'd facilitate the intro if you want.

**(Weeks later, separate conversation)**:
> Totally separate thing — I'm building an AI platform. What I realized is it's perfect for your business specifically because I can automate everything AROUND the process — RFQs, quoting, MIL-SPEC documentation, customer portal — without ever touching the proprietary chemistry. Zero process exposure. Full audit log. Want me to show you what that would look like? It's the kind of thing Anthropic would use as a case study for regulated industry.

---

### CSTMPRNT & Relish Print Shop

**Channel**: Combined pitch — they're the same vertical.

**Message**:
> Hey [name] — building an AI platform specifically for custom/print shops. Most ERP tools are built for Amazon-scale — you need something that understands one-off custom orders, proofing, approvals, and last-minute rush work. I'm looking for two shops to pilot with at no cost for 60 days. In exchange, I use the case study with other shops. Want to see a 15-minute demo?

---

## Success Criteria (After First Pilot)

After 30 days with Grand, we measure:

| Metric | Threshold | Meaning |
|--------|-----------|---------|
| Messages generated | 200+ | Agent has real usage |
| Manager approval rate | >70% | Agent quality is high enough to trust |
| Customer reply rate | >15% | Customers engage (benchmark: retail SMS is ~5%) |
| Attributed revenue | >$5K | Pays for itself in month 1 |
| Security incidents | 0 | Validates "not Moltbook" positioning |

**If we hit 4 of 5 → go all-in, scale to 20 locations + build the next pilot.**
**If we hit 2 or fewer → pivot the use case, keep the customer, try service scheduling instead.**

---

## The One Thing

If Kyle only does one thing this week: **text Aaron Reckling to schedule dinner.**

Everything else is downstream of getting that dinner on the calendar.
