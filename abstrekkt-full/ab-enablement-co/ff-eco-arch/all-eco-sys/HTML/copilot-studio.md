# Microsoft Copilot Studio Guide

**Last Updated:** December 2025

## Overview

Microsoft Copilot Studio is the low-code platform for building custom AI agents and copilots that connect to your business data and systems. It enables you to create conversational AI experiences that integrate with 1,000+ Power Platform connectors and 1,400+ MCP servers.

**Key Capabilities:**
- **Agent Builder** - Visual canvas for creating custom copilots with natural language
- **Autonomous Agents** - Self-directed AI that can plan, execute, and complete multi-step tasks
- **MCP Integration** - Connect to 1,400+ Model Context Protocol servers (GA December 2025)
- **Human-in-the-Loop (HITL)** - Require human approval for high-risk actions (Preview)
- **Generative Actions** - AI dynamically discovers and executes connector actions
- **Conversational Canvas** - Interactive UI for building conversations with branching logic
- **Multi-Model Support** - GPT-4.1, GPT-5, GPT-5.2, Claude AI

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Copilot Studio                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Agent      │  │  Autonomous  │  │     MCP      │    │
│  │   Builder    │  │    Agents    │  │  Integration │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    HITL      │  │  Generative  │  │ Conversational│   │
│  │   Preview    │  │   Actions    │  │    Canvas    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                   Integration Layer                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1,000+ Power Platform    │    1,400+ MCP Servers          │
│  Connectors               │    (GitHub, Notion, etc.)      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dataverse  │  SharePoint  │  SQL  │  Custom APIs          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Agent Builder (Visual No-Code Interface)

**What It Does:**
Creates custom copilots through a visual canvas without writing code.

**Key Components:**
- **Topics** - Conversation flows triggered by user phrases
- **Entities** - Data types (e.g., date, number, custom)
- **Variables** - Store and pass data between topics
- **Nodes** - Question, Message, Condition, Action, Redirect
- **Trigger Phrases** - Natural language inputs that start topics

**Example Use Cases:**
- IT Help Desk Agent - "Reset my password", "Request laptop", "Check ticket status"
- HR Onboarding Agent - "Submit I-9", "Enroll in benefits", "Request time off"
- Sales Assistant - "Schedule demo", "Get pricing", "Find account history"

**Best Practices:**
- Start with 3-5 core topics, expand based on usage
- Use fallback topics for unrecognized inputs
- Test with real user phrases, not just technical terms
- Monitor Analytics dashboard for topic performance

---

### 2. Autonomous Agents (Self-Directed Multi-Step Execution)

**What It Does:**
AI agents that can independently plan, execute, and complete tasks without step-by-step human guidance.

**How It Works:**
1. User provides high-level goal: "Prepare Q4 sales report"
2. Agent decomposes into subtasks: Fetch data → Analyze → Generate charts → Draft summary
3. Agent executes each step using available connectors/MCP servers
4. Agent returns completed artifact: Sales report with visualizations

**Key Capabilities:**
- **Task Decomposition** - Breaks complex goals into actionable steps
- **Dynamic Planning** - Adjusts plan based on intermediate results
- **Tool Selection** - Chooses optimal connectors/APIs for each subtask
- **Error Recovery** - Retries failed steps, requests clarification when blocked

**Architecture Pattern:**
```
User Goal → LLM Planning → Task Queue → Executor (Connectors/MCP) → Result Aggregation
```

**Example Workflow (Sales Report Agent):**
```
1. User: "Generate Q4 sales report for North America region"
2. Agent Plan:
   - Query Dynamics 365 for Q4 sales data (Oct-Dec 2025)
   - Filter by region: North America
   - Calculate: Total revenue, top products, growth vs Q3
   - Generate Excel file with pivot tables
   - Create PowerPoint with 5 slides (summary, revenue, products, trends, action items)
   - Email report to sales leadership distribution list
3. Agent Execution:
   - Dynamics 365 Connector: GET /api/data/v9.2/salesorders?$filter=...
   - Excel Connector: Create workbook, populate data, add formulas
   - PowerPoint Connector: Generate slides from template
   - Outlook Connector: Send email with attachments
4. Agent Result: "Q4 sales report sent to 12 recipients. Revenue: $4.2M (+18% vs Q3)."
```

**Security Guardrails:**
- Autonomous agents run with user's permissions (RLS enforced)
- HITL (Human-in-the-Loop) required for destructive actions (delete, approve >$X, external emails)
- Audit trail logs all agent actions with timestamps

**When to Use:**
- Multi-step workflows (5+ actions)
- Tasks requiring data aggregation from multiple sources
- Scenarios where user wants outcome, not step-by-step control

**When NOT to Use:**
- Simple single-action tasks (use standard topics)
- High-risk operations requiring approval at each step (use HITL topics)
- Real-time conversational support (use standard copilot)

---

### 3. MCP Integration (Model Context Protocol)

**What It Does:**
Connects Copilot Studio agents to 1,400+ MCP servers (GitHub, Notion, Stripe, Sentry, etc.) for seamless tool access.

**Status:** Generally Available (GA) - December 2025

**How It Works:**
```
Copilot Studio Agent
    ↓
MCP Client (built-in)
    ↓
MCP Server (e.g., GitHub, Notion, Stripe)
    ↓
External Service API
```

**Supported MCP Servers (Examples):**
- **Developer Tools:** GitHub, GitLab, Linear, Jira, Sentry
- **Productivity:** Notion, Asana, Todoist, Google Drive, Slack
- **Finance:** Stripe, QuickBooks, Xero
- **CRM:** Salesforce, HubSpot, Pipedrive
- **Analytics:** Amplitude, Mixpanel, Google Analytics
- **Monitoring:** Datadog, New Relic, PagerDuty

**Configuration Steps:**
1. **Add MCP Server:**
   - Copilot Studio → Settings → Integrations → MCP Servers
   - Click "Add MCP Server"
   - Enter server URL (e.g., `https://mcp.github.com/sse`)
   - Name: "GitHub MCP"
   - Authentication: OAuth 2.0, API Key, or Bearer Token

2. **Map Tools to Topics:**
   - Create topic: "Create GitHub Issue"
   - Add Action node → MCP Server → GitHub → `create_issue`
   - Map inputs: title, body, labels, assignees
   - Map outputs: issue_number, url

3. **Test Integration:**
   - Test chat: "Create issue titled 'Fix login bug' in repo 'acme-app'"
   - Verify issue created in GitHub with correct metadata

**Example: GitHub Issue Creation Agent**
```yaml
# Topic: Create GitHub Issue
Trigger Phrases:
  - "Create GitHub issue"
  - "File a bug"
  - "Open ticket in GitHub"

Flow:
  1. Question: "What's the issue title?"
     → Store in: var_title
  
  2. Question: "Describe the issue"
     → Store in: var_description
  
  3. Question: "Which repository? (e.g., 'acme/web-app')"
     → Store in: var_repo
  
  4. Action: Call MCP Server
     Server: GitHub MCP
     Tool: create_issue
     Inputs:
       - owner: Split(var_repo, '/')[0]
       - repo: Split(var_repo, '/')[1]
       - title: var_title
       - body: var_description
       - labels: ["bug", "from-copilot"]
     Outputs:
       - issue_url → var_issue_url
  
  5. Message: "Issue created! View it here: {var_issue_url}"
```

**MCP vs Power Platform Connectors:**
| Feature | MCP Servers | Power Platform Connectors |
|---------|-------------|---------------------------|
| **Count** | 1,400+ | 1,000+ |
| **Protocol** | MCP (SSE, Streaming HTTP) | REST, OAuth, Custom |
| **Latency** | Low (streaming) | Standard (request/response) |
| **Real-time** | Yes (SSE support) | Limited |
| **Community** | Open-source, growing fast | Microsoft + verified publishers |
| **Use When** | Developer tools, real-time data | Enterprise apps, Microsoft ecosystem |

**Best Practices:**
- Use MCP for developer-centric workflows (GitHub, Sentry, Linear)
- Use Power Platform Connectors for business apps (Dynamics, Salesforce, SAP)
- Combine both for comprehensive coverage
- Rate limit MCP calls: Max 100 requests/minute/agent

---

### 4. Human-in-the-Loop (HITL) - Preview

**What It Does:**
Requires explicit human approval before executing high-risk actions.

**Status:** Preview (December 2025)

**Use Cases:**
- Approve expense >$500
- Delete customer account
- Send email to external recipients
- Modify production database records
- Submit regulatory filings

**How It Works:**
```
1. Agent identifies high-risk action
2. Agent sends approval request to designated approver(s)
3. Approver receives notification (Teams, Email, Adaptive Card)
4. Approver reviews details, approves or rejects
5. Agent executes (if approved) or cancels (if rejected)
6. Agent notifies original requester of outcome
```

**Configuration:**
```yaml
# HITL Configuration
Actions Requiring Approval:
  - Type: Financial
    Condition: amount > 500
    Approvers:
      - Role: Finance Manager
      - Fallback: VP Finance
    Timeout: 24 hours
    Notification: Teams + Email

  - Type: Data Deletion
    Condition: entity_type == 'customer'
    Approvers:
      - Role: Data Steward
      - Fallback: DPO
    Timeout: 48 hours
    Notification: Adaptive Card

Approval Flow:
  1. Notify approver(s)
  2. Wait for response (max: timeout)
  3. If approved → Execute action
  4. If rejected → Cancel + log reason
  5. If timeout → Escalate to fallback approver
```

**Example: Expense Approval Agent**
```
User: "Reimburse $750 for conference registration"

Agent:
  1. Extracts: amount=$750, category=conference
  2. Checks HITL rules: $750 > $500 → Requires approval
  3. Creates approval request:
     - Title: "Expense Approval: $750 Conference Registration"
     - Details: User=John Doe, Amount=$750, Category=Conference
     - Approver: Finance Manager (jane@acme.com)
  4. Sends Teams adaptive card to Jane
  5. Waits for approval (max 24 hours)

Jane (Approver):
  - Reviews adaptive card in Teams
  - Clicks "Approve" or "Reject" with optional comment

Agent (after approval):
  - Executes Dynamics 365 expense creation
  - Notifies John: "Expense approved and submitted. Tracking ID: EXP-2025-1234"
```

**Security Best Practices:**
- Define approval thresholds in policy (not hardcoded)
- Require multi-approver for >$10K or sensitive data
- Log all HITL decisions with justification
- Set timeout escalation paths
- Audit HITL bypass attempts

---

### 5. Generative Actions (Dynamic Connector Discovery)

**What It Does:**
AI dynamically discovers and executes Power Platform connector actions based on natural language, without pre-configured topics.

**How It Works:**
```
User: "Find my open Jira tickets"

Agent:
  1. Analyzes intent: Query Jira for tickets assigned to user
  2. Discovers available connectors: Jira Connector
  3. Discovers available actions: listIssues, getIssue, createIssue
  4. Selects optimal action: listIssues
  5. Infers parameters:
     - assignee: current_user
     - status: Open, In Progress
  6. Executes connector action
  7. Formats results: "You have 3 open tickets: ACME-123, ACME-124, ACME-125"
```

**Benefits:**
- **Zero Configuration** - No need to pre-map every connector action
- **Adaptive** - Discovers new actions as connectors are updated
- **Natural Language** - Users don't need to know API syntax

**Limitations:**
- Limited to Power Platform connectors (not MCP servers)
- Requires connector to have OpenAPI spec
- May struggle with ambiguous requests ("get data" - from where?)

**When to Use:**
- Exploratory workflows where user doesn't know exact action
- Connecting to frequently-updated connectors
- Prototyping before building formal topics

**When NOT to Use:**
- Mission-critical workflows (use explicit topics)
- High-risk actions requiring approval (use HITL topics)
- Performance-sensitive operations (generative discovery adds latency)

---

### 6. Conversational Canvas (Visual Flow Designer)

**What It Does:**
Drag-and-drop interface for designing conversation flows with branching logic, conditions, and integrations.

**Key Components:**

**Nodes:**
- **Question** - Ask user for input (text, number, date, choice)
- **Message** - Send response to user
- **Condition** - Branch based on variable value
- **Action** - Call connector, run Power Automate flow, invoke MCP
- **Redirect** - Jump to another topic
- **End Conversation** - Close dialog

**Variables:**
- **System** - Conversation.Id, User.Name, User.Email
- **Topic** - Scoped to current topic (var_userName)
- **Global** - Available across all topics (global_customerID)

**Entities:**
- **Prebuilt** - Age, City, Color, Date, Email, Number, Percentage, Phone
- **Custom** - Product SKU, Employee ID, Case Number

**Example: IT Support Flow**
```
Topic: Reset Password

Trigger: "reset password", "forgot password", "can't log in"

Flow:
  ┌─────────────────┐
  │  Greeting       │
  │  "I can help    │
  │  reset your     │
  │  password"      │
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │  Question       │
  │  "What's your   │
  │  email address?"│
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │  Validate Email │
  │  Entity: Email  │
  │  Store: var_email│
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │  Action         │
  │  Call Azure AD  │
  │  Send reset link│
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │  Message        │
  │  "Reset link    │
  │  sent to        │
  │  {var_email}"   │
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │  End            │
  └─────────────────┘
```

**Best Practices:**
- Keep topics focused (1 goal per topic)
- Use redirect nodes for common sub-flows (e.g., verify identity)
- Set fallback paths for unexpected inputs
- Test with edge cases (empty input, invalid format, timeout)

---

## Multi-Model Support

Copilot Studio supports multiple LLM models:

| Model | Use Case | Latency | Cost | Context |
|-------|----------|---------|------|---------|
| **GPT-4.1** | Default, balanced | Medium | Medium | 128K tokens |
| **GPT-5** | Complex reasoning | High | High | 256K tokens |
| **GPT-5.2** | Latest features (Dec 2025) | High | High | 256K tokens |
| **Claude AI** | Analytical tasks | Medium | Medium | 200K tokens |

**Configuration:**
```json
{
  "agent": {
    "name": "Sales Assistant",
    "model": "gpt-4.1",
    "fallback_model": "claude-ai",
    "temperature": 0.7,
    "max_tokens": 2000
  }
}
```

**When to Choose:**
- **GPT-4.1** - General purpose, cost-effective
- **GPT-5/5.2** - Complex multi-step reasoning, latest features
- **Claude AI** - Document analysis, code review, long-context tasks

---

## Licensing & Credits

**Microsoft 365 Copilot License:**
- $30/user/month (add-on to M365 E3/E5)
- Includes 1,000 Copilot Studio credits/user/month
- Credits consumed by agent messages

**Copilot Studio Standalone:**
- $200/month (capacity-based, not per-user)
- Includes 25,000 messages/month
- Additional messages: $0.01-0.05 each (varies by model)

**Credit Consumption:**
| Action | Credits |
|--------|---------|
| GPT-4.1 message | 1 credit |
| GPT-5 message | 3 credits |
| Generative Action | 2 credits |
| MCP call | 0.5 credits |

---

## Security & Compliance

**Authentication:**
- Azure AD (Microsoft Entra ID)
- OAuth 2.0 for connectors
- Service Principal for automation

**Authorization:**
- Role-Based Access Control (RBAC)
- Dataverse security roles
- Row-Level Security (RLS) enforced

**Data Residency:**
- EU, US, APAC regions available
- Data stored in Dataverse (customer-controlled)

**Compliance:**
- SOC 2 Type II
- ISO 27001, ISO 27018
- GDPR, HIPAA (BAA available)
- PCI DSS (for payment flows)

**Audit:**
- All agent actions logged to Dataverse
- 90-day retention (default), 7-year option
- Export to Azure Log Analytics, Sentinel

---

## Best Practices

### Development
1. **Start Simple** - Build 1-2 core topics, iterate based on usage
2. **Test with Real Users** - Pilot with 10-20 users before org-wide rollout
3. **Monitor Analytics** - Track topic trigger rate, abandonment, escalation
4. **Version Control** - Export agent as solution, commit to Git

### Security
1. **Principle of Least Privilege** - Grant minimum connector permissions
2. **HITL for High-Risk** - Require approval for delete, external email, >$X
3. **Input Validation** - Sanitize user input before passing to connectors
4. **Rate Limiting** - Max 100 MCP calls/minute, 1,000 messages/hour

### Performance
1. **Optimize Prompts** - Use system messages for consistent behavior
2. **Cache Results** - Store frequently-accessed data in Dataverse
3. **Async Actions** - Use Power Automate for long-running tasks
4. **Monitor Latency** - p95 latency <2s for standard topics

### User Experience
1. **Clear Greeting** - Explain what agent can do in first message
2. **Progressive Disclosure** - Don't overwhelm with all options upfront
3. **Graceful Fallback** - Escalate to human if 3+ unrecognized inputs
4. **Mobile-Friendly** - Test on Teams mobile, responsive Adaptive Cards

---

## Troubleshooting

### Issue: Agent Not Triggering
**Symptoms:** User types trigger phrase, nothing happens
**Cause:** Trigger phrase mismatch, topic disabled, permissions
**Fix:**
1. Check topic status: Enabled?
2. Test trigger phrases: "test password reset" vs "reset password"
3. Verify user permissions: Security role assigned?
4. Check agent publish status: Latest version published?

### Issue: Connector Action Fails
**Symptoms:** "Unable to complete action" error
**Cause:** Auth expired, API rate limit, malformed request
**Fix:**
1. Re-authenticate connector: Settings → Connections → Sign in again
2. Check connector status: Power Platform Admin Center → Connectors
3. Review error logs: Analytics → Error Details
4. Verify API limits: Most connectors = 100 req/min

### Issue: Slow Response Time
**Symptoms:** Agent takes >5s to respond
**Cause:** Complex prompt, multiple connector calls, large data fetch
**Fix:**
1. Optimize topic flow: Reduce steps, combine actions
2. Use Power Automate for background work
3. Cache frequently-used data in Dataverse
4. Switch to faster model (GPT-4.1 vs GPT-5)

---

## Resources

**Official Docs:**
- Copilot Studio Overview: https://learn.microsoft.com/microsoft-copilot-studio
- Agent Builder Guide: https://learn.microsoft.com/microsoft-copilot-studio/fundamentals-get-started
- MCP Integration: https://learn.microsoft.com/microsoft-copilot-studio/model-context-protocol

**Training:**
- Microsoft Learn: Copilot Studio Learning Path
- Community: https://powerusers.microsoft.com/t5/Copilot-Studio-Community/ct-p/PVACommunity

**Support:**
- Submit feedback: Copilot Studio → Feedback button
- File bug: https://aka.ms/copilotstudio/bug

---

**Next Steps:**
1. Review [Microsoft 365 Copilot Guide](./microsoft-365-copilot.md) for end-user experiences
2. Explore [Power Platform Integration](./power-platform-copilot.md) for workflow automation
3. Check [Connectors & MCP Catalog](./connectors-mcp.md) for available integrations
