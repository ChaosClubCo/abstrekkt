# Power Platform Connectors & MCP Server Catalog

**Last Updated:** December 2025

## Overview

This catalog covers:
- **1,000+ Power Platform Connectors** - Integrate with business apps via Power Apps, Power Automate, Power Pages
- **1,400+ MCP Servers** - Connect Copilot Studio agents to developer tools and SaaS platforms

---

## Power Platform Connectors (1,000+)

### Categories

**Microsoft (200+ connectors):**
- SharePoint, OneDrive, Teams, Outlook, Excel Online
- Dynamics 365 (Sales, Service, Field Service, Finance)
- Azure (SQL, Cosmos DB, Blob Storage, Functions, Logic Apps)
- Power Platform (Dataverse, AI Builder, Power BI)
- Microsoft Graph, Azure DevOps, Microsoft Forms

**Business Applications (300+ connectors):**
- **CRM:** Salesforce, HubSpot, Zoho CRM, Pipedrive, Insightly
- **ERP:** SAP, Oracle, NetSuite, Sage, Workday
- **HR:** BambooHR, ADP, Workday HCM, UltiPro
- **Marketing:** Mailchimp, Constant Contact, SendGrid, Marketo
- **Support:** Zendesk, Freshdesk, ServiceNow, Jira Service Desk

**Productivity (200+ connectors):**
- **Collaboration:** Slack, Discord, Microsoft Teams, Workplace by Meta
- **Project Management:** Asana, Trello, Monday.com, Basecamp, Wrike
- **Note-Taking:** OneNote, Evernote, Notion
- **Calendar:** Google Calendar, Calendly, Acuity Scheduling
- **File Storage:** Dropbox, Box, Google Drive, AWS S3

**Social Media (50+ connectors):**
- Twitter, LinkedIn, Facebook, Instagram, YouTube
- Pinterest, TikTok, Snapchat, Reddit
- Buffer, Hootsuite (social media management)

**Databases (100+ connectors):**
- **SQL:** SQL Server, MySQL, PostgreSQL, Oracle
- **NoSQL:** MongoDB, Cosmos DB, Cassandra, Redis
- **Cloud:** Amazon RDS, Google Cloud SQL, Azure SQL
- **Data Warehouses:** Snowflake, BigQuery, Redshift

**AI & Machine Learning (50+ connectors):**
- OpenAI, Azure OpenAI Service, Google Gemini
- IBM Watson, AWS SageMaker
- Azure Cognitive Services (Vision, Speech, Language)
- Hugging Face, Anthropic Claude

**Custom (100+ connectors):**
- REST API (generic HTTP connector)
- SOAP, OData, RSS
- Custom connectors via OpenAPI spec

### Connector Tiers

| Tier | Cost | Use When |
|------|------|----------|
| **Standard** | Included in license | Microsoft apps, popular SaaS (Salesforce, Gmail) |
| **Premium** | Requires premium license | Database connectors (SQL, Oracle), enterprise apps (SAP) |
| **Custom** | No additional cost | Build your own for internal APIs |

### Top 50 Most-Used Connectors

**Microsoft Ecosystem:**
1. SharePoint - Document libraries, lists
2. Office 365 Outlook - Email, calendar
3. Teams - Messages, channels, meetings
4. OneDrive for Business - File storage
5. Excel Online - Spreadsheets, tables
6. Dataverse - Power Platform data
7. Microsoft Forms - Surveys, quizzes
8. Power BI - Reports, datasets
9. Azure Blob Storage - File storage
10. SQL Server - Relational database

**Third-Party SaaS:**
11. Gmail - Email
12. Google Drive - File storage
13. Google Calendar - Scheduling
14. Salesforce - CRM
15. Slack - Team chat
16. Dropbox - File storage
17. Mailchimp - Email marketing
18. Twitter - Social media
19. LinkedIn - Professional network
20. Trello - Project boards

**Business Applications:**
21. HubSpot - CRM, marketing
22. Asana - Project management
23. Zendesk - Customer support
24. Stripe - Payments
25. QuickBooks - Accounting
26. Shopify - E-commerce
27. WooCommerce - E-commerce
28. Jira - Issue tracking
29. ServiceNow - IT service management
30. Dynamics 365 - ERP/CRM

**Productivity & Automation:**
31. Notion - Knowledge base
32. Monday.com - Work OS
33. Airtable - Database/spreadsheet hybrid
34. ClickUp - Project management
35. Basecamp - Project management
36. Todoist - Task management
37. Evernote - Note-taking
38. Box - File storage
39. DocuSign - Electronic signatures
40. Adobe Sign - Electronic signatures

**Developer Tools:**
41. GitHub - Code repository
42. Azure DevOps - CI/CD
43. GitLab - Code repository
44. Bitbucket - Code repository
45. Postman - API testing

**Communication:**
46. Twilio - SMS, voice
47. SendGrid - Email delivery
48. Zoom - Video conferencing
49. GoToMeeting - Video conferencing
50. RingCentral - Business phone

### Connector Best Practices

**Security:**
- Use service principal accounts (not personal) for OAuth connections
- Rotate credentials quarterly
- Grant minimum permissions (least privilege)
- Review connections monthly: Admin Center → Connections

**Performance:**
- Batch operations when possible (update 100 rows vs 100 individual calls)
- Implement retry logic with exponential backoff
- Cache frequently-accessed data in Dataverse

**DLP (Data Loss Prevention):**
- Create policies: Block personal connectors in production
- Groups: Business (SharePoint, Dynamics) vs Non-business (Gmail, Twitter)
- Enforcement: Apps fail to save if violating DLP

**Rate Limits:**
| Connector | Rate Limit | Notes |
|-----------|------------|-------|
| SharePoint | 600 calls/minute | Per connection |
| Salesforce | 100,000 calls/24h | Per org |
| Twitter | 100 calls/15min | Per endpoint |
| Gmail | 250 messages/day | Free tier |
| Custom API | Depends on API | Check provider docs |

---

## MCP Servers (1,400+)

### What is MCP?

**Model Context Protocol (MCP)** - Open standard for connecting AI agents to external tools and data sources using:
- **SSE (Server-Sent Events)** - Real-time streaming
- **HTTP** - Traditional request/response

### MCP Integration in Microsoft Ecosystem

**Supported Platforms:**
- **Copilot Studio** - GA (December 2025)
- **ChatGPT** - Full read/write support via Developer Mode beta
- **Claude CLI** - 1,200+ plugins
- **Gemini** - 100+ extensions via Google Workspace

**Example: Connect GitHub MCP to Copilot Studio**

```
Copilot Studio → Settings → Integrations → MCP Servers

1. Add MCP Server:
   Name: GitHub MCP
   URL: https://mcp.github.com/sse
   Authentication: OAuth 2.0

2. Configure Tools:
   - create_issue
   - list_repos
   - get_pull_requests
   - create_pull_request

3. Test Connection:
   Test chat: "List my GitHub repos"
   Copilot: [calls MCP] "You have 15 repos: acme-app, dashboard, api..."

4. Deploy to Agent:
   Topic: "Create GitHub Issue"
   Action: Call MCP → create_issue
   Map inputs: title, body, labels
```

### Top 100 MCP Servers by Category

**Developer Tools (30 servers):**
1. **GitHub** - Repos, issues, PRs, actions
2. **GitLab** - Source control, CI/CD
3. **Linear** - Issue tracking, project management
4. **Jira** - Agile project management
5. **Sentry** - Error tracking, performance monitoring
6. **Atlassian** - Confluence, Jira, Bitbucket
7. **VS Code** - Code editing, extensions
8. **JetBrains** - IntelliJ, PyCharm, WebStorm
9. **Postman** - API testing, collections
10. **Swagger** - OpenAPI, API docs

**Productivity (25 servers):**
11. **Notion** - Notes, databases, wikis
12. **Asana** - Task management
13. **Todoist** - Personal task management
14. **Obsidian** - Local markdown notes
15. **Evernote** - Note-taking
16. **Google Drive** - File storage, docs
17. **Dropbox** - File sync
18. **Slack** - Team communication
19. **Discord** - Community chat
20. **Zoom** - Video conferencing

**Finance & Payments (15 servers):**
21. **Stripe** - Payment processing
22. **QuickBooks** - Accounting
23. **Xero** - Accounting
24. **PayPal** - Payments
25. **Square** - Point of sale
26. **Plaid** - Banking data
27. **Coinbase** - Cryptocurrency
28. **Brex** - Corporate cards

**CRM & Sales (15 servers):**
29. **Salesforce** - CRM platform
30. **HubSpot** - Inbound marketing, CRM
31. **Pipedrive** - Sales CRM
32. **Close** - Sales automation
33. **Intercom** - Customer messaging
34. **Zendesk** - Customer support
35. **Freshdesk** - Help desk

**Marketing & Analytics (20 servers):**
36. **Google Analytics** - Web analytics
37. **Amplitude** - Product analytics
38. **Mixpanel** - User analytics
39. **Segment** - Customer data platform
40. **Mailchimp** - Email marketing
41. **SendGrid** - Transactional email
42. **HubSpot** - Marketing automation
43. **Marketo** - B2B marketing
44. **Google Ads** - Advertising

**Monitoring & Observability (15 servers):**
45. **Datadog** - Infrastructure monitoring
46. **New Relic** - Application performance
47. **PagerDuty** - Incident management
48. **Grafana** - Visualization, dashboards
49. **Prometheus** - Metrics, alerting
50. **Splunk** - Log analysis

**Cloud Infrastructure (20 servers):**
51. **AWS** - EC2, S3, Lambda, RDS
52. **Azure** - VMs, Storage, Functions
53. **Google Cloud** - Compute, Storage, BigQuery
54. **Vercel** - Frontend deployment
55. **Netlify** - Web hosting
56. **Cloudflare** - CDN, DNS, Workers
57. **DigitalOcean** - VPS, databases
58. **Heroku** - PaaS

**Communication (10 servers):**
59. **Twilio** - SMS, voice, video
60. **SendGrid** - Email delivery
61. **Mailgun** - Email API
62. **WhatsApp** - Messaging
63. **Telegram** - Messaging
64. **Signal** - Secure messaging

**E-commerce (10 servers):**
65. **Shopify** - E-commerce platform
66. **WooCommerce** - WordPress e-commerce
67. **BigCommerce** - E-commerce
68. **Etsy** - Marketplace
69. **Amazon Seller** - Amazon marketplace

**HR & Recruiting (10 servers):**
70. **BambooHR** - HR management
71. **Greenhouse** - Recruiting
72. **Lever** - Applicant tracking
73. **Workday** - HR, finance
74. **ADP** - Payroll

**Design & Creative (10 servers):**
75. **Figma** - Design collaboration
76. **Canva** - Graphic design
77. **Adobe Creative Cloud** - Photoshop, Illustrator
78. **Sketch** - UI design
79. **Invideo** - Video creation

**AI & ML (15 servers):**
80. **OpenAI** - GPT models
81. **Anthropic** - Claude models
82. **Google Gemini** - Multimodal AI
83. **Hugging Face** - Model hub
84. **Replicate** - ML model hosting
85. **ElevenLabs** - Text-to-speech
86. **Midjourney** - Image generation

**Data & Databases (15 servers):**
87. **Supabase** - PostgreSQL, Auth, Storage
88. **Firebase** - Realtime database
89. **MongoDB** - NoSQL database
90. **Redis** - In-memory cache
91. **Airtable** - Spreadsheet-database hybrid

**Miscellaneous (10 servers):**
92. **IFTTT** - Automation
93. **Zapier** - Workflow automation
94. **n8n** - Workflow automation (open-source)
95. **Make (Integromat)** - Visual automation
96. **Monday.com** - Work OS
97. **ClickUp** - Project management
98. **Basecamp** - Project management
99. **Trello** - Kanban boards
100. **Linear** - Issue tracking

### MCP Server Selection Guide

| Use Case | Recommended MCP Server |
|----------|------------------------|
| Create GitHub issues from chat | GitHub MCP |
| Query Salesforce data | Salesforce MCP |
| Send SMS notifications | Twilio MCP |
| Process payments | Stripe MCP |
| Monitor application errors | Sentry MCP |
| Deploy code changes | Vercel MCP, Netlify MCP |
| Fetch Google Analytics data | Google Analytics MCP |
| Create design prototypes | Figma MCP |
| Manage tasks | Linear MCP, Asana MCP |
| Search knowledge base | Notion MCP |

### MCP vs Power Platform Connectors

| Feature | MCP Servers | Power Platform Connectors |
|---------|-------------|---------------------------|
| **Count** | 1,400+ | 1,000+ |
| **Protocol** | SSE, HTTP | REST, OAuth, SOAP |
| **Real-time** | Yes (SSE streaming) | Limited |
| **Latency** | Lower (streaming) | Standard (request/response) |
| **Use in** | Copilot Studio | Power Apps, Automate, Pages, BI |
| **Best for** | Developer tools, real-time data | Enterprise apps, Microsoft ecosystem |
| **Authentication** | OAuth, API key, bearer token | OAuth, service principal, API key |
| **Community** | Open-source, rapid growth | Microsoft + verified publishers |

**When to Use MCP:**
- Real-time data streaming (logs, metrics, chat)
- Developer-centric workflows (GitHub, Sentry, Linear)
- Low-latency operations (<100ms response)
- Open-source tool integrations

**When to Use Power Platform Connectors:**
- Business applications (Dynamics 365, SAP, Salesforce)
- Microsoft 365 ecosystem (SharePoint, Teams, Outlook)
- Legacy system integrations (SOAP, OData)
- DLP compliance (admin controls)

---

## Configuration Examples

### Power Platform Connector Setup

**Example: Salesforce Connector in Power Automate**

```
1. Create Flow:
   Power Automate → Create → Automated cloud flow

2. Trigger:
   Dataverse: When a row is added (Lead table)

3. Add Action:
   Salesforce → Create record

4. Configure:
   - Object: Lead
   - Fields:
     * First Name: @{triggerOutputs()?['FirstName']}
     * Last Name: @{triggerOutputs()?['LastName']}
     * Email: @{triggerOutputs()?['Email']}
     * Company: @{triggerOutputs()?['Company']}
   - Connection: Sign in to Salesforce (OAuth)

5. Test:
   Create lead in Dataverse → Verify created in Salesforce
```

### MCP Server Setup

**Example: GitHub MCP in Copilot Studio**

```json
{
  "mcp_servers": [
    {
      "name": "GitHub",
      "url": "https://mcp.github.com/sse",
      "protocol": "sse",
      "authentication": {
        "type": "oauth2",
        "scopes": ["repo", "issues", "pull_requests"]
      },
      "tools": [
        {
          "name": "create_issue",
          "description": "Create a new GitHub issue",
          "parameters": {
            "owner": "string",
            "repo": "string",
            "title": "string",
            "body": "string",
            "labels": "array"
          }
        },
        {
          "name": "list_repos",
          "description": "List user repositories",
          "parameters": {
            "visibility": "public|private|all"
          }
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

**Issue: Connector Authentication Fails**
- Re-authenticate: Power Automate → Connections → Sign in again
- Check permissions: Ensure service account has required scopes
- Verify expiration: Some tokens expire (refresh needed)

**Issue: MCP Server Timeout**
- Check URL: Ensure server is reachable (test with curl)
- Increase timeout: Default 30s, increase to 60s if needed
- Review logs: Copilot Studio → Analytics → Error details

**Issue: Rate Limit Exceeded**
- Implement backoff: Retry after delay (exponential: 1s, 2s, 4s...)
- Cache results: Store frequently-accessed data in Dataverse
- Batch operations: Combine multiple API calls into one

---

## Resources

**Power Platform Connectors:**
- Connector Reference: https://learn.microsoft.com/connectors
- Custom Connectors: https://learn.microsoft.com/connectors/custom-connectors
- Connector Certification: https://learn.microsoft.com/connectors/custom-connectors/certification-submission

**MCP Servers:**
- MCP Specification: https://modelcontextprotocol.io
- Server Directory: https://github.com/modelcontextprotocol/servers
- Build Your Own MCP: https://modelcontextprotocol.io/quickstart

---

**Next Steps:**
1. Return to [Main README](../MICROSOFT-COPILOT-ECOSYSTEM-README.md) for ecosystem overview
2. Review [Copilot Studio Guide](./copilot-studio.md) for agent building
3. Explore [Power Platform Guide](./power-platform-copilot.md) for workflows
