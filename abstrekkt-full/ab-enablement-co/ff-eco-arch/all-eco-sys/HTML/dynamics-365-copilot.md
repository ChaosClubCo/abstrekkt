# Dynamics 365 Copilot Guide

**Last Updated:** December 2025

## Overview

Dynamics 365 Copilot brings AI assistance across Sales, Customer Service, Field Service, Finance, Supply Chain, and Business Central. It helps automate repetitive tasks, generate insights, and improve customer interactions using natural language.

**Covered Applications:**
- **Dynamics 365 Sales** - Lead scoring, email drafting, opportunity insights
- **Dynamics 365 Customer Service** - Case summaries, response drafting, sentiment analysis
- **Dynamics 365 Field Service** - Work order generation, scheduling optimization, technician guidance
- **Dynamics 365 Finance** - Invoice processing, cash flow alerts, automated data entry
- **Dynamics 365 Supply Chain** - Demand forecasting, inventory optimization
- **Dynamics 365 Business Central** - Sales Order Agent (email-to-order automation)

---

## Dynamics 365 Sales Copilot

### Core Features

**1. Lead Scoring**

```
Lead record → Copilot → Analyze lead

Copilot generates:
  - Score: 85/100 (High likelihood to convert)
  - Reasoning:
    * Company size: 500+ employees (target market)
    * Industry: Technology (high-value sector)
    * Engagement: Opened 3 emails, attended webinar
    * Budget: $50K+ (above minimum threshold)
  - Recommendation: "Prioritize for demo call this week"
  - Similar wins: "Closed similar deal with TechCorp ($75K, 6-month cycle)"
```

**2. Email Generation**

```
Opportunity → Copilot → Draft email

Context: Follow-up after demo

Copilot drafts:
Subject: "Next Steps: FlashFusion Implementation"

Hi [Contact Name],

Thank you for attending yesterday's demo. Based on your feedback, I've highlighted how FlashFusion addresses your key requirements:

- Multi-channel publishing: Automate Shopify, Etsy, TikTok Shop
- Brand consistency: AI-generated templates matching your style
- ROI: Customers see 3x faster time-to-market

I'd love to schedule a technical deep-dive with your team. Are you available Tuesday or Wednesday next week?

Looking forward to connecting,
[Your Name]

---

Copilot suggestions:
  - Add case study attachment (similar customer)
  - CC technical champion identified in CRM
  - Schedule send: Tuesday 9 AM (optimal open time)
```

**3. Meeting Preparation**

```
Calendar event → Meeting with prospect → Copilot → Prepare

Copilot generates briefing:
  - Account: Acme Corp (Fortune 500, $2B revenue)
  - Contact: Jane Doe (VP Marketing, 5 years tenure)
  - Open opportunities: 2 ($150K total value)
  - Recent activity:
    * Opened pricing email (Dec 20)
    * Downloaded case study (Dec 22)
    * LinkedIn: Posted about "scaling creative operations"
  - News: Acme acquired competitor (Dec 15, expansion signal)
  - Talking points:
    * Reference LinkedIn post → Position FlashFusion as solution
    * Mention acquisition → Opportunity to consolidate tools
    * Highlight case study (similar company size)
```

**4. Record Summaries**

```
Account record: Acme Corp

Copilot → Summarize account

Output:
  - Relationship: Active customer since Jan 2024 ($50K ARR)
  - Products: FlashFusion Pro (5 licenses)
  - Health score: 75/100 (Moderate risk)
  - Risks:
    * Support tickets increased 50% (last 30 days)
    * No executive sponsor identified
    * Contract renewal in 45 days
  - Opportunities:
    * Upsell: 10 additional licenses ($20K ARR)
    * Cross-sell: FlashFusion Enterprise ($100K ARR)
  - Next steps:
    * Schedule QBR with VP Marketing
    * Address support issues (assign CSM)
```

**5. Opportunity & Lead Insights**

```
Opportunity: $75K deal (Stage: Negotiation)

Copilot insights:
  - Win probability: 65% (above average for stage)
  - Deal velocity: 90 days (slower than 60-day avg)
  - Competitors: Canva, Adobe Express
  - Strengths:
    * Strong technical champion (CTO engaged)
    * Budget confirmed ($75K approved)
  - Weaknesses:
    * Economic buyer not engaged (CFO)
    * Missing legal review (blocker)
  - Recommended actions:
    1. Engage CFO (schedule ROI review)
    2. Initiate legal review (send contract template)
    3. Set close date: Jan 15 (realistic given velocity)
```

**6. Recent Changes Tracking**

```
Account: Acme Corp → Copilot → Recent changes

Last 7 days:
  - New contact added: John Smith (Procurement Director)
  - Opportunity stage changed: Demo → Proposal
  - Support case closed: "Integration with Shopify" (Resolved)
  - Email sent: Pricing proposal (Opened 2x, Dec 26)
  - Task completed: "Send contract for legal review" (Dec 24)

Significance:
  - Procurement involved = buying signal (positive)
  - Proposal stage progression = deal advancing
  - Support case resolved = technical blockers cleared
```

**7. SharePoint Document Search**

```
Opportunity → Copilot → Find related documents

Search: "FlashFusion case studies technology sector"

Copilot finds (from SharePoint):
  1. TechCorp_CaseStudy.pdf (75% match)
  2. ROI_Calculator_Template.xlsx (60% match)
  3. FlashFusion_Security_Whitepaper.pdf (55% match)

Quick actions:
  - Attach to email
  - Add to opportunity documents
  - Share via Teams
```

### Best Practices

**Lead Scoring:**
- Review Copilot scores weekly, adjust model based on actual conversions
- Combine with manual judgment (Copilot = data, you = context)
- Set threshold: >80 = immediate follow-up, 60-80 = nurture, <60 = disqualify

**Email Drafting:**
- Always personalize: Add specific details Copilot can't know
- Review tone: Adjust formality based on relationship
- Test send time: Copilot suggests optimal time, test and refine

**Data Hygiene:**
- Copilot quality depends on data quality
- Enforce required fields: Company size, industry, budget
- Clean duplicates: Merge records monthly

---

## Dynamics 365 Customer Service Copilot

### Core Features

**1. Case Summaries**

```
Case #12345 (12 interactions, 5 days old)

Copilot → Summarize case

Output:
  - Issue: Customer unable to publish to TikTok Shop (integration error)
  - Root cause: API token expired (TikTok OAuth 30-day limit)
  - Actions taken:
    * Dec 22: Customer reported issue
    * Dec 23: Agent requested screenshots, logs
    * Dec 24: Engineering identified token expiration
    * Dec 26: Provided re-auth instructions
  - Status: Pending customer action (re-authenticate TikTok)
  - Next step: Follow up if no response by Dec 28
```

**2. Knowledge Search**

```
Case: "Error 503 when uploading images"

Copilot → Search knowledge base

Top results:
  1. KB-1234: "503 Service Unavailable - Cloudinary timeout"
     - Solution: Check image size (<10MB), retry upload
     - Success rate: 95%
  2. KB-5678: "Image upload failures - Network issues"
     - Solution: Verify internet connection, disable VPN
     - Success rate: 80%
  3. KB-9101: "503 errors - Server maintenance"
     - Solution: Wait 15 minutes, check status page
     - Success rate: 100% (if maintenance)

Copilot suggests: Try KB-1234 solution first (highest success rate)
```

**3. Response Drafting**

```
Case: Customer asks "When will my order ship?"

Copilot drafts:
Hi [Customer Name],

Thank you for contacting us about order #ORD-12345.

I've checked your order status, and it shipped on December 26 via FedEx (tracking: 1Z999AA10123456789). Expected delivery is December 28.

You can track your package here: [tracking link]

Is there anything else I can help with?

Best regards,
[Agent Name]

---

Data sources:
  - Order table: ORD-12345 (status, ship date, carrier)
  - Carrier API: FedEx tracking info
  - KB template: "Order status response"
```

**4. Sentiment Analysis**

```
Customer email:
"This is the THIRD time I've contacted support about this issue. Your product is completely broken and I'm extremely frustrated. I need a refund immediately."

Copilot analysis:
  - Sentiment: Negative (95% confidence)
  - Emotion: Anger, frustration
  - Urgency: High (keywords: "third time", "immediately")
  - Escalation recommended: Yes (severe dissatisfaction)

Suggested actions:
  1. Escalate to manager (within 1 hour)
  2. Offer immediate solution (refund, credit, expedited fix)
  3. Follow-up call (personal touch, de-escalate)
```

**5. Conversation Summaries**

```
Chat transcript (45 minutes, 32 messages)

Copilot → Summarize conversation

Output:
  - Issue: Login problems after password reset
  - Resolution: Cleared browser cache, reset password via email link
  - Outcome: Customer successfully logged in
  - Customer satisfaction: Positive (thanked agent)
  - Knowledge article used: KB-2345 ("Login troubleshooting")
  - Follow-up: None required

Auto-actions:
  - Case status: Closed
  - Survey sent: CSAT (email)
  - KB article: Upvote (+1 helpful)
```

**6. Omnichannel Routing**

```
Incoming case (email) → Copilot → Analyze and route

Analysis:
  - Topic: Technical issue (API integration)
  - Complexity: High (requires engineering expertise)
  - Language: English
  - Customer tier: Enterprise ($100K ARR, high priority)

Routing decision:
  - Queue: Technical Support (not General Support)
  - Agent: Sarah Johnson (expertise: API integrations, available now)
  - Priority: High (SLA: 2 hours)

Notification: Sarah receives case with Copilot summary
```

**7. Embedded Teams & Supervisor Analytics**

```
Teams integration:
  - Agent chat: "@Copilot summarize this customer's history"
  - Copilot: Posts card with account summary, open cases, recent interactions
  - Team collaboration: Share insights in channel

Supervisor dashboard:
  - Agent performance: Avg handle time, resolution rate, CSAT
  - Copilot usage: % of cases with Copilot-drafted responses
  - Trending issues: Top 5 case categories (last 7 days)
  - Bottlenecks: Cases pending >24 hours (queue: Technical Support)
```

### Best Practices

**Response Drafting:**
- Always personalize: Add empathy, customer name, specific details
- Review before sending: Copilot = draft, you = final editor
- Build KB library: More articles = better Copilot suggestions

**Sentiment Analysis:**
- Act on negative sentiment: Escalate high-emotion cases immediately
- Track trends: Weekly report on sentiment distribution
- Train agents: Use sentiment data to coach on tone, empathy

**Knowledge Management:**
- Update KB articles monthly: Mark outdated content
- Upvote/downvote: Train Copilot on article quality
- Create from cases: Convert frequent issues into KB articles

---

## Dynamics 365 Field Service Copilot

### Core Features

**1. Work Order Generation**

```
Natural language: "Customer reports broken HVAC at 123 Main St, needs urgent repair"

Copilot creates work order:
  - Service account: 123 Main St (auto-matched from address)
  - Issue: HVAC malfunction
  - Priority: High (keyword: "urgent")
  - Product: HVAC System (matched from service history)
  - Required skills: HVAC Technician
  - Estimated duration: 2 hours
  - Parts needed: HVAC filter, refrigerant (predicted from past similar cases)
  - Assigned to: [Technician] (nearest available with HVAC skill)
  - Scheduled: Today, 2:00 PM (earliest slot)
```

**2. Scheduling Optimization Agent**

```
Daily schedule (10 work orders, 5 technicians)

Copilot optimizes:
  - Minimize travel time (route optimization)
  - Match technician skills to work order requirements
  - Balance workload across team
  - Prioritize by urgency (High → Medium → Low)
  - Account for traffic (real-time data from Bing Maps)

Output:
  - Tech 1: 3 work orders (downtown, HVAC specialist)
  - Tech 2: 2 work orders (suburbs, electrical)
  - Tech 3: 3 work orders (north side, plumbing)
  - Tech 4: 1 work order (emergency, nearest available)
  - Tech 5: 1 work order (scheduled maintenance)

Savings: 30% reduction in drive time vs manual scheduling
```

**3. Technician Guidance (Mobile App)**

```
Technician arrives at job site → Mobile app → Copilot

Guidance:
  - Service history: Last visit 6 months ago (routine maintenance)
  - Common issues: Filter clogged (60% of cases), low refrigerant (30%)
  - Recommended steps:
    1. Check air filter (replace if dirty)
    2. Inspect refrigerant levels (refill if <80%)
    3. Test thermostat functionality
    4. Verify airflow (vents clear?)
  - Parts inventory: HVAC filter in van (qty: 5), refrigerant (qty: 2)
  - Safety notes: Wear gloves, ensure power off before servicing

Real-time support:
  - Technician: "Filter looks fine, but no cold air"
  - Copilot: "Low refrigerant likely. Check pressure gauge. If <30 PSI, refill with R-410A."
```

**4. Mobile App Integration**

```
Field Service mobile app features:
  - Voice commands: "Copilot, show me work order details"
  - Offline mode: Copilot guidance cached for areas without signal
  - Photo capture: Document before/after, Copilot detects issues (AI vision)
  - Signature: Customer signs on mobile, auto-closes work order

Example workflow:
  1. Technician arrives → GPS auto-updates status: "Traveling" → "In Progress"
  2. Copilot suggests troubleshooting steps
  3. Technician completes work → Captures photos
  4. Customer signs → Work order auto-closes
  5. Invoice auto-generated → Sent to customer email
```

**5. Microsoft 365 Integration**

```
Outlook:
  - Technician calendar syncs with work orders
  - Meeting blocked: 2:00-4:00 PM (HVAC repair at 123 Main St)

Teams:
  - Dispatcher posts in "Field Team" channel: "Emergency: Downtown office HVAC down"
  - Copilot suggests nearest technician: "John is 5 min away, available now"
  - Technician accepts via Teams mobile

Viva Connections:
  - Technician dashboard: Today's schedule, completed work orders, earnings
  - Copilot insights: "You're 15% above target this month. Great work!"
```

**6. Project Operations Connectivity**

```
Work order → Convert to project

Scenario: Multi-day HVAC installation (commercial building)

Copilot:
  - Creates project: "Acme Corp HVAC Installation"
  - Tasks: Site survey, equipment delivery, installation, testing, handoff
  - Resources: 2 technicians, 1 electrician, 1 project manager
  - Timeline: 5 days
  - Budget: $50K (labor + materials)
  - Milestones: Day 1 (survey), Day 3 (install), Day 5 (handoff)

Integration:
  - Project Operations: Track progress, time entries, expenses
  - Field Service: Dispatch technicians, manage inventory
```

### Best Practices

**Work Order Generation:**
- Train Copilot: Use consistent terminology ("HVAC malfunction" vs "broken AC")
- Review predictions: Parts needed may be inaccurate for new issues
- Set SLAs: High = 2 hours, Medium = 8 hours, Low = 48 hours

**Scheduling:**
- Let Copilot optimize: 30% time savings vs manual
- Override when needed: Customer requests specific technician
- Monitor metrics: Drive time, utilization rate, first-time fix rate

**Mobile App:**
- Enable offline mode: Technicians work in areas with poor signal
- Capture photos: Document work for quality assurance
- Voice commands: Faster than typing on job site

---

## Dynamics 365 Finance Copilot

### Core Features

**1. Invoice Processing Agent**

```
Inbox: invoice-email@company.com

Email arrives with PDF attachment: "Invoice_Acme_Corp.pdf"

Copilot:
  1. Extracts data (OCR):
     - Vendor: Acme Corp
     - Amount: $5,000
     - Due date: Jan 15, 2026
     - Invoice #: INV-12345
     - Line items: 100 units @ $50 each
  2. Matches to purchase order (PO-9876):
     - PO amount: $5,000 ✓
     - Vendor: Acme Corp ✓
     - Line items match ✓
  3. Creates invoice record in Dynamics 365 Finance
  4. Routes for approval (Finance Manager)
  5. Schedules payment (Jan 14, 1 day before due)

Exception handling:
  - No PO match → Flag for manual review
  - Amount mismatch → Alert approver (variance: $500)
  - Duplicate invoice → Reject (already processed)
```

**2. Approval Routing**

```
Invoice: $7,500 (exceeds $5K threshold)

Copilot routing:
  - Approver 1: Finance Manager (approval limit: $10K)
  - Notification: Email + Teams adaptive card
  - Timeout: 48 hours (auto-escalate if no response)

Adaptive card:
  - Vendor: Acme Corp
  - Amount: $7,500
  - Due: Jan 15
  - Action: Approve | Reject | Request more info

Finance Manager clicks "Approve":
  - Invoice status: Approved
  - Payment scheduled: Jan 14
  - Notification sent to AP team
```

**3. Cash Flow Alerts**

```
Daily cash flow analysis:

Copilot alert (email):
Subject: "Cash Flow Warning: Low Balance Projected"

Details:
  - Current balance: $100K
  - Projected balance (7 days): $20K
  - Upcoming expenses:
    * Payroll: $50K (Jan 5)
    * Vendor invoices: $30K (Jan 10)
  - Incoming revenue:
    * Customer payments: $40K (Jan 8)
  - Gap: $40K shortfall

Recommendations:
  1. Delay non-critical vendor payments (push to Jan 15)
  2. Accelerate collections (send reminders to customers)
  3. Line of credit: Draw $50K (if available)

Action required: Review and approve recommended plan
```

**4. Automated Data Entry**

```
Expense report: Employee submits receipts

Copilot:
  1. Reads receipts (OCR): Merchant, amount, date, category
  2. Validates:
     - Amount <$100: Auto-approve (within policy)
     - Category: "Meals" (allowed)
     - Receipt image: Clear, readable
  3. Creates expense record:
     - Employee: John Doe
     - Amount: $75
     - Category: Meals & Entertainment
     - Date: Dec 27, 2025
  4. Posts to GL (General Ledger):
     - Debit: Meals Expense ($75)
     - Credit: Accounts Payable ($75)

Reimbursement:
  - Auto-adds to next payroll cycle (Jan 5)
  - Notification: "Expense approved, reimbursement in next paycheck"
```

### Best Practices

**Invoice Processing:**
- Train Copilot on vendors: Upload historical invoices for pattern recognition
- Set tolerance: ±5% variance = flag for review
- Audit monthly: Review Copilot-processed invoices for accuracy

**Cash Flow:**
- Configure alerts: <$50K = warning, <$20K = critical
- Review weekly: Cash flow forecast vs actual
- Automate collections: Send payment reminders at 7, 3, 1 days before due

**Compliance:**
- Audit trail: All Copilot actions logged (who, what, when)
- Retention: 7 years (regulatory requirement)
- SOX compliance: Segregation of duties (invoice entry ≠ approval)

---

## Dynamics 365 Business Central - Sales Order Agent

### Core Features

**Email-to-Order Automation (Multi-Turn Conversations)**

```
Customer email:
"Hi, I'd like to order 50 units of Widget A and 30 units of Widget B for delivery to our Seattle warehouse."

Sales Order Agent:
  1. Parses email:
     - Products: Widget A (qty 50), Widget B (qty 30)
     - Delivery location: Seattle warehouse
  2. Multi-turn conversation (if needed):
     - Agent email: "Thanks! Which Seattle warehouse: Downtown or Northgate?"
     - Customer reply: "Northgate"
  3. Creates sales order:
     - Customer: Acme Corp (matched from email domain)
     - Items:
       * Widget A: 50 units @ $100 = $5,000
       * Widget B: 30 units @ $75 = $2,250
     - Subtotal: $7,250
     - Tax: $650 (9%)
     - Total: $7,900
     - Ship to: Seattle Northgate Warehouse
  4. Sends confirmation email:
     - Order #: SO-12345
     - Expected delivery: Jan 5, 2026
     - Invoice: Attached PDF

Approval workflow:
  - Orders >$5K → Requires sales manager approval
  - Agent sends approval request (Teams adaptive card)
  - Manager approves → Order confirmed, shipped
```

### Best Practices

**Email Parsing:**
- Train agent on customer terminology: "Widget A" = SKU-1234
- Handle ambiguity: Ask clarifying questions (which warehouse?)
- Confirm large orders: >$10K = send summary email for customer confirmation

**Order Validation:**
- Inventory check: Ensure stock available before confirming
- Credit limit: Reject if customer exceeds limit
- Pricing: Apply customer-specific discounts (volume, contract)

---

## Licensing

| License | Price | Includes |
|---------|-------|----------|
| **Dynamics 365 Sales** | $65-135/user/month | Professional / Enterprise |
| **Dynamics 365 Customer Service** | $50-120/user/month | Professional / Enterprise |
| **Dynamics 365 Field Service** | Varies | Depends on edition |
| **Dynamics 365 Finance** | Custom pricing | Enterprise resource planning |
| **Dynamics 365 Business Central** | $70-100/user/month | Essentials / Premium |

**Copilot Credits (included):**
- Premium editions: 1,000 credits/user/month
- Professional editions: 500 credits/user/month
- Additional credits: $0.01/credit (bulk pricing available)

**Contact Center:**
- Voice + Digital channels
- IVR: 2,000 minutes/user/month
- Call Intelligence: 6,000 minutes/user/month

---

## Security & Compliance

**Authentication:** Microsoft Entra ID, MFA required
**Authorization:** RBAC, RLS (users see only their data)
**Encryption:** AES-256 (rest), TLS 1.3 (transit)
**Compliance:** SOC 2, ISO 27001, GDPR, HIPAA (BAA), FedRAMP
**Audit:** Unified Audit Log, 90-day retention (default), 7-year option

---

## Resources

**Official Docs:**
- Dynamics 365 Overview: https://learn.microsoft.com/dynamics365
- Sales: https://learn.microsoft.com/dynamics365/sales
- Customer Service: https://learn.microsoft.com/dynamics365/customer-service
- Field Service: https://learn.microsoft.com/dynamics365/field-service
- Finance: https://learn.microsoft.com/dynamics365/finance
- Business Central: https://learn.microsoft.com/dynamics365/business-central

**Training:**
- Microsoft Learn: Dynamics 365 learning paths
- Certifications: MB-210 (Sales), MB-230 (Customer Service), MB-240 (Field Service)

---

**Next Steps:**
1. Review [Connectors & MCP Catalog](./connectors-mcp.md) for integration options
2. Return to [Main README](../MICROSOFT-COPILOT-ECOSYSTEM-README.md) for ecosystem overview
3. Explore [Power Platform](./power-platform-copilot.md) for workflow automation
