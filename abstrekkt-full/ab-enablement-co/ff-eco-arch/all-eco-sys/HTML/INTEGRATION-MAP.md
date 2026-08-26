# Microsoft Copilot Ecosystem - Integration Map

**Last Updated:** December 2025  
**Purpose:** Visual guide to component connections, data flows, and integration patterns across the Microsoft Copilot ecosystem.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Integration Patterns](#integration-patterns)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Component Connectivity Matrix](#component-connectivity-matrix)
5. [Common Integration Scenarios](#common-integration-scenarios)
6. [Security Boundaries](#security-boundaries)
7. [Troubleshooting Integration Issues](#troubleshooting-integration-issues)

---

## High-Level Architecture

### Five-Layer Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER EXPERIENCE LAYER                         │
│  M365 Copilot (Word, Excel, PowerPoint, Teams, Outlook, Chat)   │
│  Copilot Studio Agent Builder │ Power Platform Apps/Portals      │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                   INTELLIGENCE LAYER                             │
│  GPT-4.1 │ GPT-5 │ GPT-5.2 │ Claude AI │ Azure OpenAI            │
│  Work IQ Memory │ Agent Mode │ Autonomous Agents │ HITL          │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                   INTEGRATION LAYER                              │
│  1,000+ Power Platform Connectors │ 1,400+ MCP Servers           │
│  Microsoft Graph API │ Dataverse │ Azure Logic Apps              │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                   │
│  SharePoint │ OneDrive │ Dataverse │ Dynamics 365 │ SQL          │
│  External: Salesforce │ SAP │ Oracle │ ServiceNow                │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                           │
│  Azure AD │ Azure Key Vault │ Azure Monitor │ Sentinel           │
│  SOC 2 │ ISO 27001 │ GDPR │ HIPAA │ FedRAMP                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration Patterns

### Pattern 1: Direct Integration (Microsoft → Microsoft)

**Components:** M365 Copilot ↔ SharePoint/OneDrive/Teams  
**Protocol:** Microsoft Graph API  
**Authentication:** Azure AD with SSO  
**Latency:** <100ms  
**Use Cases:** Document summarization, meeting notes, email drafting

```
User in Teams
    ↓ (Request summary)
M365 Copilot
    ↓ (Graph API call with access token)
SharePoint/OneDrive
    ↓ (Return document content)
M365 Copilot
    ↓ (GPT-4.1 processing)
User in Teams (receives summary)
```

**Best Practice:** Use Microsoft Graph for all M365-to-M365 integrations. Single authentication flow, built-in rate limiting, audit trail.

---

### Pattern 2: Connector Integration (Power Platform → External)

**Components:** Power Automate/Apps ↔ Salesforce/SAP/Oracle  
**Protocol:** REST API (OAuth 2.0 / API Key)  
**Authentication:** Per-connector credentials stored in Azure Key Vault  
**Latency:** 200-500ms (depends on external API)  
**Use Cases:** CRM sync, ERP data retrieval, marketing automation

```
Power Automate Flow Trigger (New Dynamics 365 Lead)
    ↓
Connector: Get Salesforce Account (if exists)
    ↓ (REST API call with OAuth token)
Salesforce API
    ↓ (Return account details or 404)
Condition: Account exists?
    ├─ Yes → Update Dynamics 365 Lead with Salesforce ID
    └─ No → Create Salesforce Account + Link to Lead
```

**Best Practice:** Use standard connectors when available (pre-built, Microsoft-supported, DLP-compliant). Only create custom connectors for proprietary APIs.

---

### Pattern 3: MCP Integration (Copilot Studio → Developer Tools)

**Components:** Copilot Studio ↔ GitHub/Notion/Stripe/Sentry  
**Protocol:** SSE (Server-Sent Events) or HTTP  
**Authentication:** Bearer tokens, API keys (stored in agent config)  
**Latency:** <100ms (streaming responses)  
**Use Cases:** GitHub issue creation, Notion database queries, Stripe payment processing, Sentry error tracking

```
User: "Create GitHub issue for login bug"
    ↓
Copilot Studio Agent (parses intent)
    ↓
MCP Server: GitHub (SSE connection)
    ↓ (Streaming: title, body, labels, assignee)
GitHub API
    ↓ (Issue created, return URL)
Copilot Studio Agent
    ↓
User: "Issue created: github.com/org/repo/issues/123"
```

**Best Practice:** Use MCP for real-time developer workflows. SSE protocol provides lower latency than REST polling. Configure retry logic (3 attempts, exponential backoff).

---

### Pattern 4: Hybrid Integration (Multi-Layer)

**Components:** M365 Copilot → Power Automate → Dynamics 365 → External API  
**Protocol:** Mixed (Graph API + Connector + Custom API)  
**Authentication:** Multiple credential stores (Azure AD + Key Vault + External OAuth)  
**Latency:** 500-2000ms (sequential API calls)  
**Use Cases:** Complex business processes (e.g., expense approval with budget check, PO creation, email notification)

```
User in Outlook: "Approve this expense report"
    ↓ (M365 Copilot extracts expense details)
M365 Copilot Chat
    ↓ (Trigger Power Automate flow via HTTP request)
Power Automate
    ├─ Get Budget from Dynamics 365 Finance (Connector)
    ├─ Check if Expense <= Budget (Condition)
    ├─ If Yes: Create PO in SAP (Custom Connector)
    └─ Send Approval Email (Outlook Connector)
    ↓
User: "Expense approved, PO# 12345 created"
```

**Best Practice:** Design for failure. Each API call should have timeout + retry logic. Log each step for audit trail. Use idempotency keys for external APIs (prevent duplicate POs if retry happens).

---

## Data Flow Diagrams

### Scenario 1: Sales Lead Qualification (End-to-End)

**Trigger:** New lead form submitted on Power Pages website  
**Flow:** Power Pages → Dataverse → Copilot Studio → Dynamics 365 Sales → Power Automate → Salesforce

```
┌──────────────┐
│ Power Pages  │ User fills "Contact Sales" form
│   (Public)   │ (Name, Email, Company, Message)
└──────┬───────┘
       ↓ (Submit form)
┌──────────────┐
│  Dataverse   │ Lead record created
│   (CRM DB)   │ (lead_id: 123, status: new)
└──────┬───────┘
       ↓ (Trigger: New Lead)
┌──────────────┐
│Copilot Studio│ Lead Qualification Agent
│    Agent     │ - Lookup company size (LinkedIn API via MCP)
│              │ - Score lead (1-100) based on rules
│              │ - If score >= 70: High-priority
└──────┬───────┘
       ↓ (Update lead with score)
┌──────────────┐
│Dynamics 365  │ Lead record updated
│    Sales     │ (score: 85, priority: high, owner: sales_team)
└──────┬───────┘
       ↓ (If score >= 70, trigger flow)
┌──────────────┐
│Power Automate│ High-Priority Lead Flow
│     Flow     │ - Check if company exists in Salesforce
│              │ - If not: Create Salesforce Lead
│              │ - Assign to sales rep (round-robin)
│              │ - Send notification to rep (Teams message)
└──────┬───────┘
       ↓ (Create/Update external CRM)
┌──────────────┐
│ Salesforce   │ Lead synced to external CRM
│   (External) │ (sf_id: 00Q5g000001AbCD, owner: john@acme.com)
└──────────────┘
```

**Data Points Tracked:**
- Lead source (Power Pages form ID)
- Timestamp (submission datetime)
- Qualification score (AI-generated, 1-100)
- Company size (LinkedIn API, employees count)
- Salesforce sync status (success/failure)
- Sales rep assignment (user ID)

**Latency Breakdown:**
- Form submit → Dataverse: <100ms
- Dataverse → Copilot Studio: <200ms (trigger delay)
- Copilot Studio scoring: 500-1000ms (LinkedIn API call)
- Dynamics 365 update: <100ms
- Power Automate trigger: <500ms
- Salesforce create/update: 200-500ms
- **Total: 1.5-2.5 seconds**

**Failure Modes:**
- LinkedIn API rate limit (100 calls/hour) → Queue lead for retry in 1 hour
- Salesforce connection timeout → Retry 3x with exponential backoff (1s, 2s, 4s)
- Sales rep not found (user left company) → Assign to "Unassigned Queue" + alert manager

---

### Scenario 2: Customer Support Case Resolution (Autonomous Agent)

**Trigger:** Customer submits support ticket via email  
**Flow:** Outlook → Dynamics 365 Customer Service → Copilot Studio → SharePoint → Power Automate → Teams

```
┌──────────────┐
│   Outlook    │ Customer emails support@acme.com
│  (Shared MB) │ Subject: "Can't log in to portal"
└──────┬───────┘
       ↓ (Email arrives)
┌──────────────┐
│Dynamics 365  │ Case auto-created from email
│Customer Svc  │ (case_id: CS-456, status: new, priority: normal)
└──────┬───────┘
       ↓ (Trigger: New Case)
┌──────────────┐
│Copilot Studio│ Customer Service Agent (Autonomous)
│    Agent     │ Step 1: Search KB for "login portal" (SharePoint)
│ (Autonomous) │ Step 2: Find article "Password Reset Guide"
│              │ Step 3: Check if article solves issue (AI judgment)
│              │ Step 4: If yes: Draft response + attach article
│              │ Step 5: If no: Escalate to human (HITL)
└──────┬───────┘
       ↓ (KB article found, confidence: 92%)
┌──────────────┐
│  SharePoint  │ Knowledge Base article retrieved
│      KB      │ (article_id: KB-789, title: "How to Reset Password")
└──────┬───────┘
       ↓ (Article content returned)
┌──────────────┐
│Copilot Studio│ Agent drafts response
│    Agent     │ "Hi [Customer], try these steps: ..."
│              │ Attaches: Password_Reset_Guide.pdf
└──────┬───────┘
       ↓ (Update case + send response)
┌──────────────┐
│Power Automate│ Case Response Flow
│     Flow     │ - Send email to customer (Outlook Connector)
│              │ - Update case status: "Pending Customer"
│              │ - Log interaction in Dataverse
│              │ - Post to Teams channel (agent activity log)
└──────┬───────┘
       ↓ (Email sent)
┌──────────────┐
│   Customer   │ Receives email with solution
│   (Email)    │ Clicks link, resets password, logs in
└──────────────┘
```

**Autonomous Agent Decision Tree:**

```
New Case → Search KB (SharePoint)
           ├─ Match found (confidence >= 80%)
           │  └─ Draft response + attach article
           │     └─ If customer replies "solved" → Close case
           │     └─ If customer replies "not solved" → Escalate to human
           │
           └─ No match found (confidence < 80%)
              └─ Check case priority
                 ├─ High/Critical → Immediate HITL escalation (30 sec SLA)
                 └─ Normal/Low → Queue for human review (4 hour SLA)
```

**Human-in-the-Loop Triggers:**
- KB article confidence < 80%
- Customer replied "not solved" after AI response
- Case priority = High or Critical
- Customer sentiment = Negative (detected by sentiment analysis)
- Case involves refund request (financial action requires approval)

**Metrics Tracked:**
- Cases resolved by AI (no human intervention): Target 40%
- Average resolution time (AI): Target <5 minutes
- Customer satisfaction (CSAT) score: Target 4.5/5
- Escalation rate (AI → Human): Target <20%
- KB article effectiveness (case closure rate): Track per article

---

### Scenario 3: Field Service Work Order (Multi-Channel)

**Trigger:** Customer reports issue via mobile app, web portal, or phone call  
**Flow:** Power Pages/Dynamics 365 → Field Service → Copilot Studio → Power Automate → Outlook → Teams

```
┌──────────────┐
│ Power Pages  │ Customer: "HVAC not working at 123 Main St"
│   or Phone   │ (Submitted via web form or call transcribed by agent)
└──────┬───────┘
       ↓ (Create work order)
┌──────────────┐
│Dynamics 365  │ Work order created
│Field Service │ (wo_id: WO-789, asset: HVAC Unit #42, location: 123 Main)
└──────┬───────┘
       ↓ (Trigger: New Work Order)
┌──────────────┐
│Copilot Studio│ Field Service Scheduling Agent
│    Agent     │ Step 1: Identify asset (HVAC Unit #42)
│              │ Step 2: Retrieve service history (last 3 repairs)
│              │ Step 3: Predict issue (AI: "Compressor failure, 85% confidence")
│              │ Step 4: Find qualified technician (skill: HVAC, available: today)
│              │ Step 5: Optimize route (minimize drive time)
│              │ Step 6: Schedule appointment (2-4 PM slot available)
└──────┬───────┘
       ↓ (Technician assigned: Sarah Johnson)
┌──────────────┐
│Power Automate│ Work Order Assignment Flow
│     Flow     │ - Send calendar invite to technician (Outlook)
│              │ - Update work order status: "Scheduled"
│              │ - Send SMS to customer: "Technician arriving 2-4 PM"
│              │ - Post to Teams: "New WO assigned to Sarah"
└──────┬───────┘
       ↓ (Calendar invite sent)
┌──────────────┐
│ Technician   │ Receives Outlook calendar event
│   (Mobile)   │ - Work order details (asset, location, history)
│              │ - Recommended parts (compressor, refrigerant)
│              │ - Driving directions (Maps link)
└──────┬───────┘
       ↓ (Technician completes repair)
┌──────────────┐
│Field Service │ Technician submits:
│  Mobile App  │ - Photos (before/after)
│              │ - Parts used (compressor: 1, refrigerant: 2 lbs)
│              │ - Labor hours (2.5 hours)
│              │ - Customer signature (approval)
└──────┬───────┘
       ↓ (Work order completed)
┌──────────────┐
│Power Automate│ Work Order Completion Flow
│     Flow     │ - Generate invoice (Dynamics 365 Finance)
│              │ - Send invoice to customer (email)
│              │ - Request CSAT survey (SMS link)
│              │ - Update asset service history (last repair date)
└──────────────┘
```

**Scheduling Optimization Algorithm (AI Agent):**

```
Input: Work order (location, asset, priority, time window)
       
Step 1: Find qualified technicians
        - Filter by skill (HVAC certification)
        - Filter by availability (today's calendar)
        - Result: 3 technicians (Sarah, Mike, Tom)

Step 2: Calculate drive time for each
        - Sarah: 15 min (current location: 10 miles away)
        - Mike: 45 min (current location: 30 miles away)
        - Tom: Off today (not available)
        - Result: Sarah is optimal (shortest drive)

Step 3: Check Sarah's schedule
        - 8-10 AM: WO-788 (already scheduled)
        - 10 AM-2 PM: Open
        - 2-4 PM: WO-790 (already scheduled)
        - Result: Schedule WO-789 at 10 AM-2 PM

Step 4: Predict duration (AI model)
        - Input: Asset type (HVAC), issue (compressor failure), technician skill (expert)
        - Output: 2 hours (90% confidence)
        - Buffer: +30 min (travel + unexpected delays)
        - Result: Total time slot = 2.5 hours (10 AM-12:30 PM)

Step 5: Validate
        - Customer availability: 9 AM-5 PM (business hours)
        - Parts availability: Compressor in stock (warehouse)
        - Priority: Normal (can wait until 10 AM)
        - Result: Schedule confirmed

Output: Appointment scheduled (10 AM-12:30 PM, Sarah Johnson)
```

**30% Drive Time Reduction (AI Optimization):**

**Before AI:**
- Dispatcher manually assigns based on "who's available"
- Average daily route: 150 miles (6 appointments, random order)
- Average drive time: 3 hours/day (50% of work time)

**After AI:**
- Agent clusters appointments by geography + optimizes route
- Average daily route: 105 miles (same 6 appointments, optimized order)
- Average drive time: 2.1 hours/day (35% of work time)
- **Savings: 0.9 hours/day = 30% reduction**

---

## Component Connectivity Matrix

### Detailed Integration Capability Table

| Source Component | Target Component | Protocol | Auth Method | Latency | Use Cases |
|------------------|------------------|----------|-------------|---------|-----------|
| **M365 Copilot** | SharePoint | Graph API | Azure AD SSO | <100ms | Document summarization, search |
| M365 Copilot | OneDrive | Graph API | Azure AD SSO | <100ms | File operations, sharing |
| M365 Copilot | Teams | Graph API | Azure AD SSO | <100ms | Meeting summaries, chat search |
| M365 Copilot | Outlook | Graph API | Azure AD SSO | <100ms | Email drafting, calendar management |
| M365 Copilot | Dynamics 365 | OData API | Azure AD | 100-200ms | CRM data retrieval, record creation |
| M365 Copilot | Power Automate | HTTP Webhook | Azure AD | 200-500ms | Trigger flows from Copilot Chat |
| **Copilot Studio** | GitHub (MCP) | SSE | OAuth / Token | <100ms | Issue creation, PR review, repo search |
| Copilot Studio | Notion (MCP) | HTTP | API Key | 100-200ms | Database queries, page creation |
| Copilot Studio | Stripe (MCP) | HTTP | Bearer Token | 100-200ms | Payment processing, customer lookup |
| Copilot Studio | Sentry (MCP) | HTTP | Auth Token | 100-200ms | Error tracking, issue monitoring |
| Copilot Studio | Dataverse | OData API | Azure AD | <100ms | Entity CRUD, search, workflows |
| Copilot Studio | Power Automate | HTTP Webhook | Azure AD | 200-500ms | Trigger flows from agents |
| **Power Apps** | Dataverse | OData API | Azure AD | <100ms | Form data binding, galleries |
| Power Apps | SharePoint | REST API | Azure AD SSO | 100-200ms | Document libraries, lists |
| Power Apps | Dynamics 365 | OData API | Azure AD | 100-200ms | CRM entity access (leads, accounts) |
| Power Apps | Salesforce | Connector (REST) | OAuth 2.0 | 200-500ms | CRM sync, external data sources |
| Power Apps | SQL Server | Connector | SQL Auth | 100-300ms | Direct database queries (read-only) |
| **Power Automate** | SharePoint | Connector | Azure AD SSO | 100-200ms | File operations, list updates |
| Power Automate | Outlook | Connector | Azure AD SSO | 100-200ms | Send emails, calendar events |
| Power Automate | Teams | Connector | Azure AD SSO | 100-200ms | Post messages, adaptive cards |
| Power Automate | Dynamics 365 | Connector | Azure AD | 100-200ms | Entity operations, workflows |
| Power Automate | Salesforce | Connector | OAuth 2.0 | 200-500ms | Lead/account sync, campaigns |
| Power Automate | SAP | Connector | Basic Auth | 500-1000ms | ERP data retrieval, PO creation |
| Power Automate | ServiceNow | Connector | OAuth 2.0 | 300-700ms | Incident creation, CMDB updates |
| Power Automate | Slack | Connector | OAuth 2.0 | 200-400ms | Post messages, notifications |
| Power Automate | Mailchimp | Connector | API Key | 300-500ms | Email campaigns, subscriber lists |
| **Power Pages** | Dataverse | OData API | Anonymous / Auth | <100ms | Forms, lists, entity permissions |
| Power Pages | SharePoint | REST API | Azure AD (optional) | 100-200ms | Document download, search |
| Power Pages | Azure AD | OAuth 2.0 | N/A | 100-200ms | User authentication, SSO |
| **Dynamics 365 Sales** | Dataverse | Native | N/A | <50ms | Lead/account/opportunity storage |
| Dynamics 365 Sales | SharePoint | Graph API | Azure AD SSO | 100-200ms | Document management per record |
| Dynamics 365 Sales | Outlook | Graph API | Azure AD SSO | 100-200ms | Email tracking, calendar integration |
| Dynamics 365 Sales | LinkedIn | Connector | OAuth 2.0 | 300-500ms | Lead enrichment, Sales Navigator |
| **Dynamics 365 CS** | Dataverse | Native | N/A | <50ms | Case/knowledge article storage |
| Dynamics 365 CS | Teams | Native | Azure AD SSO | <100ms | Agent collaboration, case escalation |
| Dynamics 365 CS | Omnichannel | Native | N/A | <100ms | Chat, voice, SMS channel routing |
| **Dynamics 365 FS** | Dataverse | Native | N/A | <50ms | Work order, asset, booking storage |
| Dynamics 365 FS | Outlook | Graph API | Azure AD SSO | 100-200ms | Technician calendar, dispatch |
| Dynamics 365 FS | Teams | Native | Azure AD SSO | <100ms | Technician collaboration, dispatch |
| Dynamics 365 FS | Project Ops | Native | Azure AD | 100-200ms | Multi-day installations, resource planning |
| **Dynamics 365 Finance** | Dataverse | Native | N/A | <50ms | Invoice, PO, GL account storage |
| Dynamics 365 Finance | Azure AD | OAuth 2.0 | N/A | 100-200ms | User authentication, RBAC |
| Dynamics 365 Finance | Power BI | DirectQuery | Azure AD | 200-500ms | Financial reporting, dashboards |

**Legend:**
- **Latency:** Typical round-trip time for API call (excludes AI processing time)
- **Native:** Direct integration (same database, no API call)
- **SSO:** Single Sign-On (user authenticated once, reused across apps)
- **OAuth 2.0:** Industry standard for secure API access (token-based)
- **Azure AD:** Microsoft's identity platform (handles authentication + authorization)

---

### Connector vs MCP Decision Matrix

| Criteria | Use Power Platform Connector | Use MCP Server |
|----------|------------------------------|----------------|
| **Target System** | Business apps (Salesforce, SAP, Oracle, Dynamics 365, ServiceNow) | Developer tools (GitHub, Notion, Stripe, Sentry, Linear, Jira) |
| **Protocol** | REST API (request/response) | SSE (streaming) or HTTP |
| **Latency** | 200-500ms (acceptable for batch operations) | <100ms (required for real-time workflows) |
| **Authentication** | OAuth 2.0, API Key, Basic Auth (stored in Azure Key Vault) | Bearer tokens, API keys (stored in agent config) |
| **DLP Compliance** | Built-in (classify as business/non-business connector) | Manual (define rules per MCP server) |
| **Rate Limiting** | Built-in (connector handles throttling) | Manual (implement retry logic) |
| **Use Case** | Scheduled sync (hourly lead import), batch processing (invoice generation) | Interactive workflows (create GitHub issue from chat), event-driven (Sentry alert → Teams notification) |
| **Maintenance** | Managed by Microsoft (updates automatic) | Community-driven (check for breaking changes) |
| **Cost** | Premium connectors require license ($20/user/month Power Apps or $15/user/month Power Automate) | Free (open-source), but self-hosted servers may have infrastructure cost |

**Example Decision:**

**Scenario:** Sync Dynamics 365 leads to Salesforce every hour  
**Decision:** Use Power Platform Connector  
**Why:** Batch operation (hourly), DLP compliant, OAuth managed by Azure Key Vault, built-in throttling for Salesforce API limits (100K calls/day)

**Scenario:** Create GitHub issue when customer reports bug in Copilot Chat  
**Decision:** Use MCP Server  
**Why:** Real-time (user expects immediate response), SSE streaming provides <100ms latency, GitHub MCP server is official and well-maintained

---

## Common Integration Scenarios

### Scenario A: Expense Approval Workflow (Hybrid)

**Components:** M365 Copilot (Outlook) → Power Automate → Dynamics 365 Finance → SAP → Teams  
**Trigger:** Employee submits expense report via email to finance@acme.com

**Step-by-Step Flow:**

```
1. Employee sends email to finance@acme.com
   Subject: "Expense Report - Nov 2025"
   Attachments: Receipt_1.pdf, Receipt_2.pdf
   Body: "Hotel: $500, Meals: $150, Total: $650"

2. M365 Copilot (Outlook) extracts data
   - Use AI Builder (OCR) to read receipts
   - Extract: Date, Vendor, Amount, Category
   - Result: {date: "2025-11-15", vendor: "Marriott", amount: 500, category: "Hotel"}

3. Power Automate Flow triggered (New Email in Shared Mailbox)
   - Create expense record in Dynamics 365 Finance (Dataverse)
   - Expense ID: EXP-123, Employee: john@acme.com, Total: $650, Status: Pending

4. Dynamics 365 Finance: Check budget
   - Query: "SELECT remaining_budget FROM budgets WHERE department = 'Sales' AND month = 'Nov 2025'"
   - Result: $5,000 remaining budget (sufficient)

5. Condition: If Total <= $1,000 (auto-approve threshold)
   - Yes: Proceed to step 6
   - No: Send approval request to manager (Adaptive Card in Teams)

6. Power Automate: Create PO in SAP
   - SAP Connector (REST API with Basic Auth)
   - POST /api/purchase-orders
   - Body: {vendor: "Marriott", amount: 500, gl_account: "6000-Travel"}
   - Result: PO #789 created

7. Power Automate: Update Dynamics 365 Finance
   - Set Status: "Approved", PO Number: 789, Approved By: "Auto (under $1K)"

8. Power Automate: Send notification to employee
   - Teams Connector: Post message to employee
   - "Your expense report EXP-123 has been approved. PO #789 created."

9. Power Automate: Post to Finance team channel
   - Teams Connector: Post to #finance-team
   - "Auto-approved: $650 expense for john@acme.com (PO #789)"
```

**Data Validation Checkpoints:**
- Receipts must be PDF or JPG/PNG (reject .txt, .doc)
- Total amount must match sum of line items (±$1 tolerance)
- Date must be within past 90 days (reject old expenses)
- GL account must exist in Dynamics 365 (prevent invalid postings)
- Budget must have sufficient funds (reject if overdraft)

**Error Handling:**
- OCR confidence < 80% → Send email to employee: "Receipt not readable, please rescan"
- SAP connection timeout → Retry 3x (1s, 2s, 4s), then alert finance team
- Budget insufficient → Send rejection email: "Expense exceeds remaining budget ($5,000 available)"

---

### Scenario B: Sales Pipeline Review (Autonomous Agent)

**Components:** Copilot Studio Agent → Dynamics 365 Sales → SharePoint → Power BI → Outlook  
**Trigger:** Manager asks in Copilot Chat: "Review Q4 sales pipeline and send summary to VP"

**Agent Execution (Autonomous Multi-Step):**

```
User: "Review Q4 sales pipeline and send summary to VP"

Copilot Studio Agent (Autonomous Mode):
  
  Step 1: Query Dynamics 365 Sales
    - OData API: GET /api/data/v9.2/opportunities?$filter=estimatedclosedate ge 2025-10-01 and estimatedclosedate le 2025-12-31
    - Result: 50 opportunities, total value $5.2M, weighted value $3.1M (considering win probability)

  Step 2: Breakdown by stage
    - Qualification: 15 opps ($800K)
    - Proposal: 20 opps ($2.1M)
    - Negotiation: 10 opps ($1.8M)
    - Closed Won: 5 opps ($500K, already won)

  Step 3: Identify at-risk deals
    - Filter: Last Activity > 14 days ago AND Stage != "Closed Won"
    - Result: 8 at-risk deals ($1.2M total value)
    - Example: Opp-456 (Acme Corp, $300K, last activity: 21 days ago)

  Step 4: Retrieve previous Q4 pipeline (SharePoint)
    - Search: "Q4 2024 Sales Pipeline Review.xlsx"
    - Result: Found file (last year's Q4 had $4.5M pipeline, closed $2.8M = 62% win rate)

  Step 5: Compare YoY
    - 2024 Q4 Pipeline: $4.5M
    - 2025 Q4 Pipeline: $5.2M
    - Growth: +16% YoY

  Step 6: Generate insights (AI analysis)
    - "Pipeline is up 16% YoY, strong performance in Proposal stage ($2.1M)"
    - "8 deals at risk (no activity >14 days), recommend immediate outreach"
    - "Closed Won deals ($500K) ahead of pace vs 2024 (only $300K closed by this date)"

  Step 7: Create PowerPoint summary (Power Automate)
    - Template: "Sales Pipeline Review.pptx" (SharePoint)
    - Slide 1: Executive Summary (key metrics)
    - Slide 2: Pipeline by Stage (bar chart)
    - Slide 3: At-Risk Deals (table with owner, value, last activity)
    - Slide 4: YoY Comparison (line chart)

  Step 8: Send email to VP (Outlook)
    - To: vp-sales@acme.com
    - Subject: "Q4 Sales Pipeline Review - $5.2M Total"
    - Body: "Attached is the Q4 pipeline summary. Key highlights: ..."
    - Attachment: Q4_Sales_Pipeline_Review_2025.pptx

  Step 9: Log activity (Dataverse)
    - Entity: "Agent Activity Log"
    - Fields: {agent: "Sales Pipeline Agent", user: "manager@acme.com", timestamp: "2025-11-15T10:30:00Z", status: "Completed"}

Agent Response to User:
  "Q4 pipeline review completed. $5.2M total pipeline (+16% YoY), 8 at-risk deals identified. 
   Summary sent to vp-sales@acme.com. 
   [Link to PowerPoint: Q4_Sales_Pipeline_Review_2025.pptx]"
```

**Autonomous Agent Capabilities:**
- **Multi-step planning:** Agent decomposes "review pipeline" into 9 discrete steps
- **Dynamic tool selection:** Agent chooses appropriate APIs (Dynamics 365, SharePoint, Outlook) without explicit instructions
- **Error recovery:** If SharePoint file not found, agent searches by keyword instead of exact filename
- **Human-in-the-loop:** If email send fails (invalid recipient), agent asks user to confirm VP email address

**When Agent Escalates to Human:**
- Data inconsistency detected (e.g., opportunity total doesn't match sum of line items)
- External API timeout after 3 retries (e.g., SharePoint unavailable)
- Ambiguous user request (e.g., "Review pipeline" without specifying quarter)
- High-risk action (e.g., "Delete all closed-lost opportunities" → requires confirmation)

---

### Scenario C: Customer Onboarding (Multi-Channel)

**Components:** Power Pages (Form) → Dataverse → Copilot Studio → Power Automate → Dynamics 365 Sales → DocuSign → Mailchimp → Teams  
**Trigger:** New customer signs up on website (Power Pages)

**Flow with Decision Points:**

```
1. Customer fills "Sign Up" form on Power Pages
   - Name: Jane Doe
   - Email: jane@newcorp.com
   - Company: NewCorp Inc
   - Employees: 50-200 (dropdown)
   - Industry: Technology (dropdown)

2. Dataverse: Create Account record
   - Account ID: ACC-789
   - Status: "Pending Verification"
   - Owner: "New Accounts Queue" (unassigned)

3. Copilot Studio: Account Verification Agent
   - Step 1: Verify email domain (jane@newcorp.com)
     - Check: Is domain disposable (e.g., mailinator.com)? → No (valid corporate domain)
     - Check: Does domain have MX records? → Yes (email server exists)
     - Result: Email verified ✓
   
   - Step 2: Enrich company data (LinkedIn Sales Navigator API via MCP)
     - Input: Company name "NewCorp Inc"
     - Output: {employees: 150, location: "San Francisco, CA", industry: "Software", revenue: "$10M-50M"}
     - Result: Company enriched ✓
   
   - Step 3: Score account (AI model)
     - Input: Employees (150), Industry (Technology), Revenue ($10M-50M)
     - Output: Score 78/100, Tier: "Mid-Market"
     - Result: Account scored ✓

4. Power Automate: Account Assignment Flow
   - Condition: Score >= 70 (high-value account)
     - Yes: Assign to "Enterprise Sales" team
     - No: Assign to "SMB Sales" team
   - Result: Assigned to Sarah Johnson (Enterprise Sales Rep)

5. Dynamics 365 Sales: Create Opportunity
   - Opportunity ID: OPP-456
   - Account: ACC-789 (NewCorp Inc)
   - Estimated Value: $50K (based on tier + industry averages)
   - Stage: "Qualification"
   - Owner: Sarah Johnson

6. Power Automate: Send welcome email (Mailchimp)
   - Template: "Welcome to Acme - Enterprise Tier"
   - Personalization: {name: "Jane", company: "NewCorp Inc", rep: "Sarah Johnson", rep_email: "sarah@acme.com"}
   - Body: "Welcome Jane! Your account rep Sarah will reach out within 24 hours..."

7. Power Automate: Send contract via DocuSign
   - Template: "Enterprise SaaS Agreement.docx"
   - Signers: jane@newcorp.com (customer) + legal@acme.com (Acme)
   - Expiration: 7 days
   - Webhook: Notify when signed

8. Power Automate: Notify sales rep (Teams)
   - Post to Teams channel: #new-accounts
   - Adaptive Card with:
     - Account details (name, score, tier)
     - Opportunity link (Dynamics 365)
     - Action buttons: "Call Customer", "Send Follow-Up Email"

9. Copilot Studio: Schedule follow-up task
   - Create task in Dynamics 365: "Call Jane Doe at NewCorp Inc"
   - Due date: Tomorrow at 10 AM
   - Assigned to: Sarah Johnson
   - Priority: High

10. Dataverse: Update Account status
    - Status: "Active"
    - Stage: "Onboarding"
    - Last Activity: Today
```

**Decision Tree (Account Assignment Logic):**

```
Score >= 70 AND Employees >= 100
  → Enterprise Sales Team
  → SLA: 24 hours for first contact

Score >= 70 AND Employees < 100
  → Mid-Market Sales Team
  → SLA: 48 hours for first contact

Score < 70 AND Employees >= 20
  → SMB Sales Team
  → SLA: 3 days for first contact

Score < 70 AND Employees < 20
  → Inside Sales (Automated Email Drip Campaign)
  → SLA: No personal outreach (nurture via email)
```

**Metrics Tracked:**
- Time to first contact (Sales Rep → Customer): Target <24 hours for Enterprise
- Contract signing rate: Target 60% within 7 days
- Onboarding completion rate: Target 80% (customer activates account)
- Lead source effectiveness: Track conversions per source (website form, referral, event)

---

## Security Boundaries

### Trust Zones & Data Isolation

```
┌─────────────────────────────────────────────────────────────────┐
│                        ZONE 1: M365 TENANT                       │
│  Trust Level: High (Azure AD protected, MFA enforced)            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SharePoint │ OneDrive │ Teams │ Outlook │ M365 Copilot   │   │
│  │ Data Residency: US (configurable per tenant)             │   │
│  │ Encryption: AES-256 at rest, TLS 1.3 in transit          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (Graph API with Azure AD token)
┌─────────────────────────────────────────────────────────────────┐
│                    ZONE 2: POWER PLATFORM                        │
│  Trust Level: Medium (Azure AD + Dataverse RLS)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Power Apps │ Power Automate │ Power Pages │ Dataverse    │   │
│  │ RLS: Row-level security (user can only access own data)  │   │
│  │ DLP: Prevent data leakage (classify connectors)          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (Connectors with OAuth / API Key)
┌─────────────────────────────────────────────────────────────────┐
│                   ZONE 3: EXTERNAL SYSTEMS                       │
│  Trust Level: Low (Third-party SaaS, untrusted)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Salesforce │ SAP │ Oracle │ GitHub │ Stripe │ SendGrid   │   │
│  │ Credential Storage: Azure Key Vault (encrypted)          │   │
│  │ Network: Firewall rules (allow only specific IPs)        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (Public Internet)
┌─────────────────────────────────────────────────────────────────┐
│                    ZONE 4: PUBLIC WEB                            │
│  Trust Level: Untrusted (anonymous users)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Power Pages (Public Website) │ Forms │ Web Agents        │   │
│  │ Authentication: Optional (Azure AD B2C for customers)    │   │
│  │ WAF: Web Application Firewall (OWASP Top 10 protection)  │   │
│  │ DDoS Protection: Azure DDoS Standard                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow Rules:**
- **Zone 1 → Zone 2:** Allowed (Graph API with user consent)
- **Zone 2 → Zone 3:** Allowed (OAuth 2.0 via connector, credentials in Key Vault)
- **Zone 3 → Zone 1:** Blocked (external systems cannot write to M365 directly)
- **Zone 4 → Zone 2:** Allowed (authenticated users via Azure AD B2C)
- **Zone 4 → Zone 1:** Blocked (public cannot access M365 tenant)

**Security Controls by Zone:**

| Zone | Authentication | Encryption (Rest) | Encryption (Transit) | Network Access | Audit Logging |
|------|----------------|-------------------|----------------------|----------------|---------------|
| Zone 1 (M365) | Azure AD + MFA | AES-256 | TLS 1.3 | Private (tenant only) | Azure Monitor (90 days) |
| Zone 2 (Power Platform) | Azure AD + RLS | AES-256 | TLS 1.3 | Private (tenant + connectors) | Dataverse Audit (90 days) |
| Zone 3 (External) | OAuth 2.0 / API Key | Per vendor (TLS for Salesforce, SAP, etc.) | TLS 1.2+ | Public (firewall rules) | Per vendor (varies) |
| Zone 4 (Public) | Optional (Azure AD B2C) | AES-256 | TLS 1.3 | Public (WAF + DDoS) | Power Pages Logs (30 days) |

---

### Cross-Boundary Data Transfer (Example: Salesforce → M365)

**Scenario:** Sync Salesforce leads to Dynamics 365 Sales (hourly)

**Security Checkpoints:**

```
1. Power Automate (Zone 2) initiates connection to Salesforce (Zone 3)
   ✓ Retrieve OAuth token from Azure Key Vault (encrypted at rest)
   ✓ Validate token expiration (refresh if expired)

2. Salesforce API call (REST over TLS 1.2)
   ✓ HTTPS only (reject HTTP)
   ✓ Certificate validation (ensure SSL cert is valid)
   ✓ Rate limit check (Salesforce allows 100K calls/24h, track usage)

3. Data transformation (Zone 2)
   ✓ PII masking (if configured): Mask SSN (123-45-6789 → XXX-XX-6789)
   ✓ Data validation: Email must be valid format, Phone must be 10-15 digits
   ✓ Deduplication: Check if lead already exists in Dynamics 365 (match by email)

4. Write to Dynamics 365 Sales (Zone 2)
   ✓ Row-level security: Lead owner = current user (cannot assign to others without permission)
   ✓ Field-level security: Salary field (if present) only visible to Finance team
   ✓ Audit trail: Log who created lead, when, and source (Salesforce)

5. Notification (Zone 2 → Zone 1)
   ✓ Send Teams message to sales rep (Graph API with user consent)
   ✓ Include lead link (Dynamics 365 URL, user must authenticate to view)
   ✓ No PII in notification (only: "New lead from Acme Corp" without name/email)
```

**DLP Policy Example (Prevent Data Leakage):**

```json
{
  "policy_name": "Production-Strict",
  "business_connectors": [
    "SharePoint", "Outlook", "Teams", "Dynamics 365", "Dataverse", "SQL Server"
  ],
  "non_business_connectors": [
    "Gmail", "Twitter", "Dropbox", "Personal OneDrive"
  ],
  "rules": [
    {
      "description": "Block Dynamics 365 data to personal email",
      "source": "Dynamics 365",
      "target": "Gmail",
      "action": "Block"
    },
    {
      "description": "Block Dataverse export to Dropbox",
      "source": "Dataverse",
      "target": "Dropbox",
      "action": "Block"
    },
    {
      "description": "Allow Dynamics 365 to Salesforce (business use)",
      "source": "Dynamics 365",
      "target": "Salesforce",
      "action": "Allow"
    }
  ]
}
```

**Result:** Power Automate flow attempting to send Dynamics 365 lead data to Gmail will be blocked by DLP policy. User receives error: "Data loss prevention policy violation: Cannot transfer business data to non-business connector (Gmail)."

---

## Troubleshooting Integration Issues

### Common Failure Modes & Resolutions

#### Issue 1: Connector Timeout (Power Automate → Salesforce)

**Symptom:** Power Automate flow fails with "Action 'Get_Salesforce_Account' timed out after 120 seconds"

**Root Cause Analysis:**
- Salesforce API response time: >120 seconds (default timeout)
- Possible reasons:
  1. Salesforce instance under heavy load (peak hours 9-11 AM PST)
  2. Complex SOQL query (joining 5+ objects, no index on query field)
  3. Large dataset returned (>10,000 records without pagination)

**Resolution Steps:**

```
Step 1: Verify Salesforce instance health
  - Check: Salesforce Trust Status page (https://status.salesforce.com)
  - If degraded: Wait for Salesforce to resolve (ETA shown on status page)
  - If operational: Proceed to Step 2

Step 2: Optimize SOQL query
  - Bad query: SELECT Id, Name, (SELECT * FROM Opportunities) FROM Account
  - Good query: SELECT Id, Name FROM Account WHERE LastModifiedDate >= LAST_N_DAYS:1
  - Add index: Contact Salesforce admin to create index on LastModifiedDate field

Step 3: Implement pagination
  - Salesforce API limit: 2,000 records per query
  - Solution: Use "offset" parameter in loop
  - Example: Query 1 (offset: 0, limit: 2000), Query 2 (offset: 2000, limit: 2000), etc.

Step 4: Increase timeout in Power Automate
  - Default: 120 seconds
  - Recommended: 300 seconds (5 minutes) for complex queries
  - How: Go to flow settings → Timeout → Set to 300

Step 5: Add retry logic
  - Retry policy: 3 attempts with exponential backoff (1s, 2s, 4s)
  - How: In Power Automate, go to action settings → Configure run after → On timeout, retry 3 times
```

**Prevention:**
- Schedule flow during off-peak hours (12-2 AM PST)
- Cache frequently accessed data in Dataverse (hourly sync instead of real-time)
- Monitor Salesforce API usage (avoid hitting 100K call/day limit)

---

#### Issue 2: MCP Server Connection Refused (Copilot Studio → GitHub)

**Symptom:** Copilot Studio agent fails with "MCP server connection refused: https://mcp.github.com/sse"

**Root Cause Analysis:**
- MCP server URL incorrect (typo, deprecated endpoint)
- Authentication token invalid/expired (GitHub PAT expired after 90 days)
- Network firewall blocking outbound SSE connections (port 443)
- Rate limit exceeded (GitHub API: 5,000 requests/hour for authenticated users)

**Resolution Steps:**

```
Step 1: Verify MCP server URL
  - Correct URL: https://mcp.github.com/sse (official GitHub MCP server)
  - Test: curl -X GET https://mcp.github.com/sse -H "Authorization: Bearer <token>"
  - Expected response: "SSE connection established" (event stream)

Step 2: Validate authentication token
  - GitHub PAT (Personal Access Token) required
  - Scopes needed: repo (full control), read:org (read org data)
  - Check expiration: GitHub Settings → Developer Settings → Personal Access Tokens → Check "Expiration" column
  - If expired: Generate new token → Update Copilot Studio agent config

Step 3: Test network connectivity
  - From Copilot Studio environment (Azure): curl -v https://mcp.github.com/sse
  - If timeout: Check Azure Network Security Group (NSG) rules
  - Required: Allow outbound HTTPS (port 443) to *.github.com

Step 4: Check rate limits
  - GitHub API headers: X-RateLimit-Remaining (shows calls left)
  - If 0: Wait for rate limit reset (X-RateLimit-Reset timestamp)
  - Solution: Implement caching (store GitHub issue list in Dataverse for 15 minutes)

Step 5: Review Copilot Studio agent config
  - File: configs/copilot-studio-settings.json
  - Section: mcp_servers → github
  - Verify: url, protocol (sse), auth_type (bearer), auth_token (not expired)
```

**Prevention:**
- Set token expiration reminder (30 days before expiry)
- Use GitHub App (OAuth) instead of PAT (auto-refresh token)
- Implement exponential backoff for rate limit errors (retry after X-RateLimit-Reset)

---

#### Issue 3: Dataverse RLS Blocking User Access

**Symptom:** User reports "You don't have permission to view this record" when opening lead in Dynamics 365 Sales

**Root Cause Analysis:**
- Row-level security (RLS) rule blocking access
- Possible reasons:
  1. Lead owner != current user (user can only see own leads)
  2. User role missing "Read" privilege on Lead entity
  3. Security role inheritance broken (user removed from team)
  4. Business unit mismatch (user in BU "West", lead in BU "East")

**Resolution Steps:**

```
Step 1: Verify lead ownership
  - Query: SELECT ownerid FROM lead WHERE leadid = '123'
  - Result: ownerid = 'abc-def-ghi' (GUID)
  - Compare: Current user ID = 'xyz-uvw-rst' (different)
  - Conclusion: User does not own lead → RLS blocking

Step 2: Check user's security role
  - Dynamics 365 Admin Center → Users → Select user → Security Roles
  - Expected role: "Salesperson" or "Sales Manager"
  - Verify privileges: Read (Organization-level) on Lead entity
  - If missing: Assign "Salesperson" role or add "Read" privilege

Step 3: Verify team membership (if lead owned by team)
  - Query: SELECT teamid FROM teammembership WHERE systemuserid = 'xyz-uvw-rst'
  - Result: No team membership found
  - Solution: Add user to "Sales Team" (which owns the lead)

Step 4: Check business unit hierarchy
  - User BU: "West Region" (BU ID: 111)
  - Lead BU: "East Region" (BU ID: 222)
  - RLS rule: User can only access records in own BU or child BUs
  - Solution: Change lead BU to "West Region" OR add user to "East Region" BU

Step 5: Audit trail review
  - Dataverse Audit Log: Filter by Entity = Lead, ID = 123
  - Check: When was ownerid changed? By whom?
  - Example: "2025-11-15 10:30 AM - ownerid changed from 'xyz-uvw-rst' to 'abc-def-ghi' by admin@acme.com"
  - Conclusion: Lead was reassigned (intentional) → Update user expectations
```

**Prevention:**
- Document RLS rules clearly (user guide: "You can only see leads you own or your team owns")
- Implement lead assignment notifications (Teams message when lead reassigned)
- Regular access reviews (quarterly): Verify users have correct roles and team memberships

---

#### Issue 4: HITL Approval Timeout (Copilot Studio Agent)

**Symptom:** Copilot Studio agent shows "Action timed out waiting for human approval (24h limit exceeded)"

**Root Cause Analysis:**
- Human-in-the-loop (HITL) approval not responded to within 24 hours
- Possible reasons:
  1. Approver on vacation (OOO, no delegate assigned)
  2. Approval request sent to wrong email (typo in config)
  3. Adaptive Card blocked by email filter (flagged as spam)
  4. Approver missed notification (email buried in inbox)

**Resolution Steps:**

```
Step 1: Verify approval request was sent
  - Copilot Studio Activity Log: Filter by Agent = "Expense Approval Agent", Status = "Pending HITL"
  - Result: Approval sent to manager@acme.com at 2025-11-14 10:00 AM
  - Check: Email delivery status (sent vs delivered vs opened)

Step 2: Resend approval request
  - Option A: Manually trigger Power Automate flow "Resend Approval"
  - Option B: Agent auto-retry (if enabled): Resend after 12 hours if no response

Step 3: Escalate to backup approver
  - Config: hitl_rules → financial_actions → escalation
  - Escalation path: Primary approver (manager@acme.com) → Backup (vp-finance@acme.com)
  - Timeout: If primary doesn't respond in 24h, escalate to backup (additional 24h)

Step 4: Review email delivery
  - Microsoft 365 Admin Center → Message Trace
  - Search: Recipient = manager@acme.com, Date = 2025-11-14
  - Result: Email delivered but not opened
  - Solution: Send Teams notification (in addition to email)

Step 5: Adjust timeout settings
  - Current: 24 hours
  - Recommendation: 48 hours (allow 2 business days)
  - How: configs/copilot-studio-settings.json → hitl_timeout_hours: 48
```

**Prevention:**
- Configure approval delegation (manager assigns delegate when OOO)
- Multi-channel notifications (email + Teams + SMS for high-priority)
- Auto-escalation after 12 hours (gentle reminder before timeout)
- Holiday calendar integration (extend timeout during company holidays)

---

### Diagnostic Checklist (Use When Integration Fails)

```
[ ] Check network connectivity (ping, curl, traceroute)
[ ] Verify authentication (token not expired, correct scopes)
[ ] Review rate limits (API calls remaining, reset timestamp)
[ ] Check DLP policies (data transfer allowed?)
[ ] Examine audit logs (who did what, when)
[ ] Test with Postman/curl (isolate issue: client vs server?)
[ ] Review recent changes (deployments, config updates)
[ ] Validate input data (correct format, within limits)
[ ] Check service health (Salesforce Trust, Azure Status)
[ ] Enable verbose logging (capture request/response headers)
```

---

## Resource Links

### Official Documentation

- **M365 Copilot:** https://learn.microsoft.com/en-us/microsoft-365-copilot/
- **Copilot Studio:** https://learn.microsoft.com/en-us/microsoft-copilot-studio/
- **Power Platform:** https://learn.microsoft.com/en-us/power-platform/
- **Dynamics 365:** https://learn.microsoft.com/en-us/dynamics365/
- **Microsoft Graph API:** https://learn.microsoft.com/en-us/graph/
- **Power Platform Connectors:** https://learn.microsoft.com/en-us/connectors/
- **MCP Protocol:** https://modelcontextprotocol.io/
- **Azure AD:** https://learn.microsoft.com/en-us/azure/active-directory/

### Community & Support

- **Power Platform Community:** https://powerusers.microsoft.com/
- **Dynamics 365 Community:** https://community.dynamics.com/
- **GitHub Discussions (MCP):** https://github.com/microsoft/copilot-studio-mcp/discussions
- **Stack Overflow:** Tag `microsoft-copilot`, `power-platform`, `dynamics-365`

### Training & Certification

- **Microsoft Learn:** https://learn.microsoft.com/ (free courses)
- **Copilot Studio Learning Path:** https://learn.microsoft.com/training/paths/copilot-studio/
- **Power Platform Certifications:** PL-100 (Power Platform App Maker), PL-200 (Power Platform Functional Consultant)
- **Dynamics 365 Certifications:** MB-210 (Sales), MB-230 (Customer Service), MB-240 (Field Service)

---

## Next Steps

1. **Review your current integrations:** Use the Component Connectivity Matrix to identify gaps and opportunities
2. **Map data flows:** Document where data comes from, how it transforms, and where it goes
3. **Identify security boundaries:** Ensure trust zones are properly configured (RLS, DLP, firewalls)
4. **Implement monitoring:** Set up alerts for integration failures, rate limits, and latency spikes
5. **Train your team:** Share this integration map with developers, admins, and business users
6. **Plan for scale:** Consider what happens when you 10x your users, data volume, or API calls

**Questions?** Refer to the troubleshooting section or contact your Microsoft account team for support.

---

**File Structure Reference:**
```
/mnt/user-data/outputs/
├── MICROSOFT-COPILOT-ECOSYSTEM-README.md (main overview)
├── docs/
│   ├── copilot-studio.md
│   ├── microsoft-365-copilot.md
│   ├── power-platform-copilot.md
│   ├── dynamics-365-copilot.md
│   ├── connectors-mcp.md
│   └── INTEGRATION-MAP.md (this file)
└── configs/
    ├── copilot-studio-settings.json
    ├── power-platform-settings.json
    └── .env.example
```

**Version:** 1.0  
**Last Updated:** December 27, 2025  
**Maintained By:** Staff Platform/AppSec Engineering Team
