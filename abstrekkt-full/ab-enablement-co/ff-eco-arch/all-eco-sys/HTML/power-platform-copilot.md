# Power Platform Copilot Guide

**Last Updated:** December 2025

## Overview

Power Platform Copilot brings AI assistance to Power Apps, Power Automate, Power Pages, and Power BI, enabling citizen developers to build business applications faster with natural language.

**Key Platforms:**
- **Power Apps** - Build custom business apps with low-code/no-code
- **Power Automate** - Create automated workflows across 1,000+ connectors
- **Power Pages** - Build secure external-facing websites with AI chatbots
- **Power BI** - Analyze data and create reports with AI insights

---

## Power Apps Copilot

### Core Features

**1. App Generation from Description**

```
Power Apps → Create app → Describe the app you need

Input: "Expense tracking app for field technicians with receipt upload"

Copilot generates:
- Data tables: Expenses (amount, category, date, receipt_url, status)
- Screens: Home, Add Expense, View Expenses, Approvals
- Formulas: FILTER(), SUM(), SORT()
- Components: Receipt camera control, dropdown for categories
- Navigation: Bottom tab bar, back buttons

Output: Fully functional app in 30 seconds
```

**2. Formula Assistance**

```
Gallery control → OnSelect property → Type "filter"

Copilot autocomplete:
Filter(Expenses, Status = "Pending")
Filter(Expenses, Amount > 100)
Filter(Expenses, DateValue = Today())

Explanation tooltip: "Shows only expenses with Pending status"
```

**3. Data Table Creation**

```
Copilot: "Create a data table"

User: "Customer contacts with name, email, phone, company, last contact date"

Copilot creates Dataverse table:
Table: Contacts
Columns:
- Name (Single line text, required)
- Email (Email, required, unique)
- Phone (Phone number)
- Company (Single line text)
- LastContactDate (Date only)
- CreatedBy (User, system)
- ModifiedOn (Date and time, system)

Primary key: ContactID (auto-generated GUID)
Relationships: None (add manually if needed)
```

**4. App Modernization**

```
Legacy canvas app (created 2020) → Copilot → Modernize

Copilot suggests:
- Replace Dropdown with Combo box (better UX)
- Add Barcode scanner for inventory
- Implement offline sync (OneDrive)
- Upgrade connector to latest version
- Add accessibility features (screen reader labels)
```

### Best Practices

**App Generation:**
- Be specific: "Inventory app with barcode scanning and low-stock alerts" ✓
- Vague: "Build an app" ✗
- Iterative: Generate → Test → Ask for modifications

**Formulas:**
- Copilot suggests, you review: Always test formulas with sample data
- Complex logic: Break into sub-formulas, use variables
- Performance: Avoid nested FILTER() in galleries, use delegation

**Data Modeling:**
- Start with Copilot generation, refine manually
- Add relationships after initial table creation
- Use Dataverse for enterprise apps (SharePoint for simple lists)

---

## Power Automate Copilot

### Core Features

**1. Flow Creation from Description**

```
Power Automate → Create flow → Describe your workflow

Input: "When a new expense is added, send approval request to manager, if approved send to finance team"

Copilot generates:
Trigger: When a row is added or modified (Dataverse: Expenses table)
Condition: Status = "Pending"
Actions:
  1. Get manager email (Office 365 Users: Get manager)
  2. Start approval (Approvals: Start and wait for approval)
  3. Condition: Approval outcome = "Approve"
     - If yes:
       - Update row (Dataverse: Status = "Approved")
       - Send email (Office 365 Outlook: finance@company.com)
     - If no:
       - Update row (Dataverse: Status = "Rejected")
       - Send email (Office 365 Outlook: notify requester)
```

**2. Action Recommendations**

```
Flow builder → Add action → Copilot suggests

Context: Previous action = "Get items" from SharePoint

Copilot recommendations:
1. "Apply to each" (loop through items)
2. "Filter array" (subset of items)
3. "Create HTML table" (format for email)
4. "Send email" (notify with items)

Select suggestion → Copilot pre-fills parameters
```

**3. Error Handling**

```
Action: HTTP request to external API

Copilot → Add error handling

Generates:
Configure run after: Previous action → Failed, Timed out
Actions:
  1. Log error (Compose: @{outputs('HTTP_Request')['error']['message']})
  2. Send notification (Teams: Post message to channel)
  3. Terminate flow (Status: Failed, Error: @{variables('ErrorLog')})
```

**4. Expression Builder**

```
Action: Compose → Value field → Type "format date"

Copilot autocomplete:
formatDateTime(utcNow(), 'yyyy-MM-dd')
formatDateTime(items('Apply_to_each')?['Created'], 'MM/dd/yyyy')
addDays(utcNow(), 7)

Select → Press Tab to insert
```

### Best Practices

**Flow Design:**
- One trigger per flow (clarity)
- Use Scope actions to group related steps
- Add comments: Describe complex logic
- Test with real data before deployment

**Performance:**
- Minimize HTTP actions (cache responses)
- Use batch operations for Dataverse (update multiple rows)
- Avoid loops >1,000 iterations (pagination instead)

**Error Handling:**
- Every external API call needs try-catch
- Log failures to SharePoint or Dataverse
- Notify on critical failures (Teams, email)

---

## Power Pages Copilot

### Core Features

**1. Site Creation**

```
Power Pages → Create site → Describe your site

Input: "Customer support portal with knowledge base, case submission, and FAQs"

Copilot generates:
Pages:
  - Home (welcome message, search bar, quick links)
  - Knowledge Base (article list, categories, search)
  - Submit Case (web form: subject, description, priority, attachment)
  - My Cases (list view: user's submitted cases, status)
  - FAQs (accordion list, searchable)

Data sources:
  - Dataverse: Cases, KB Articles, Categories
  - Authentication: Microsoft Entra ID, local accounts

Features:
  - AI search (semantic search across KB)
  - Web agent chatbot (answer questions, create cases)
  - File upload (Azure Blob Storage)
```

**2. Page Modifications**

```
Existing page: Home

Copilot chat: "Add a hero banner with company logo and call-to-action button"

Copilot:
  1. Inserts hero section (full-width, background image)
  2. Adds logo image (placeholder: upload in Media Library)
  3. Adds CTA button: "Get Started" → Links to Submit Case page
  4. Applies theme colors (primary color for button)
```

**3. Web Agent (AI Chatbot)**

**What It Does:** AI-powered chatbot integrated into Power Pages for customer support.

```
Configuration:
Power Pages → Web Agent → Create

Settings:
  - Name: "Support Bot"
  - Model: GPT-4.1
  - Data sources:
    * Dataverse: KB Articles table
    * SharePoint: Product documentation
    * Website: company.com/help
  - Channels: Website (embedded), Email, Teams, WhatsApp
  - Escalation: Transfer to human agent after 3 unresolved questions

Capabilities:
  - Answer FAQs from knowledge base
  - Create support cases via natural language
  - Query account information (with authentication)
  - Provide troubleshooting steps

Example conversation:
User: "My order hasn't arrived yet"
Bot: "I can help. What's your order number?"
User: "ORD-12345"
Bot: [queries Dataverse] "Order ORD-12345 shipped on Dec 20, expected delivery Dec 27. Track here: [link]"
```

**4. AI-Assisted Form Filling**

```
Form: "Submit Case"

Fields: Subject, Description, Category, Priority

AI assistance:
  - User types: "Login not working after password reset"
  - Copilot auto-fills:
    * Category: "Authentication"
    * Priority: "Medium"
    * Description: "User unable to log in following a password reset. Issue reported on Dec 27."
  - User reviews and submits
```

**5. Security Agent (Proactive Monitoring)**

```
Power Pages Admin Center → Security Agent

Monitors:
  - Suspicious login patterns (>10 failed attempts from same IP)
  - SQL injection attempts in form inputs
  - Unusual traffic spikes (>5x normal, possible DDoS)
  - Unauthorized file uploads (executable files to non-admin users)

Alerts:
  - Email to site admin
  - Teams channel notification
  - Auto-block IP address (configurable threshold)
  - Log to Azure Sentinel
```

### Best Practices

**Site Design:**
- Start with template: FAQ, Scheduling, Registration, Application
- Customize with Copilot: Faster than manual HTML/CSS
- Mobile-first: Test on mobile devices (80% traffic from mobile)

**Web Agent:**
- Train on FAQs: Upload KB articles, product docs
- Set expectations: "I'm a bot, I'll connect you to a human if needed"
- Monitor conversations: Review Analytics → Web Agent → Conversation logs

**Security:**
- Enable IP filtering: Block countries outside target market
- WAF (Web Application Firewall): Protect against OWASP Top 10
- Authentication: Require login for sensitive pages (My Account, Cases)
- Rate limiting: Max 100 requests/minute/IP

---

## Power BI Copilot

### Core Features

**1. Report Generation**

```
Power BI → Create report → Describe the report

Input: "Show Q4 sales by region and product category with trend line"

Copilot generates:
  - Data connection: SQL Server (sales_db.transactions)
  - Visuals:
    * Map: Sales by region (color-coded)
    * Column chart: Sales by product category
    * Line chart: Monthly sales trend (Oct-Dec)
    * Card: Total sales ($4.2M)
  - Filters: Date range slider (Oct 1 - Dec 31)
  - Theme: Corporate colors (blue/green)
```

**2. DAX Formula Assistance**

```
Measure: Calculate year-over-year growth

Type: "yoy growth"

Copilot autocomplete:
YoY Growth = 
DIVIDE(
  [Total Sales] - CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date])),
  CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
)

Explanation: "Compares current period sales to same period last year as percentage"
```

**3. Insights & Anomalies**

```
Visual: Sales by month (line chart)

Copilot insights:
  - "Sales dropped 25% in November (holiday pre-buy in October)"
  - "West region outperformed by 40% (new store opening)"
  - "Product A represents 60% of revenue (concentration risk)"
  - Suggested actions: "Diversify product mix", "Investigate November dip"
```

**4. Q&A Natural Language**

```
Power BI report → Q&A visual

User types: "What's the average order value in Q4?"

Copilot:
  - Parses question: Metric = Average, Dimension = Order Value, Filter = Q4
  - Generates DAX: AVERAGE('Orders'[Value])
  - Applies filter: Date >= Oct 1 AND Date <= Dec 31
  - Returns: "$127.50" (formatted as currency)
  - Suggests follow-up: "Compare to Q3 average?"
```

### Best Practices

**Report Design:**
- Start with template: Sales, Finance, Marketing
- Copilot generates baseline, refine visuals manually
- Limit visuals per page: Max 5-7 (readability)

**DAX Formulas:**
- Test with sample data before deployment
- Use variables for complex calculations (readability)
- Avoid row-context functions in large tables (performance)

**Data Refresh:**
- Schedule during off-hours (nights, weekends)
- Incremental refresh for large datasets (>1M rows)
- Monitor refresh failures: Power BI Admin → Refresh history

---

## Cross-Platform Features

### 1. Dataverse Integration

**What It Is:** Common data layer for Power Apps, Automate, Pages, and BI.

```
Architecture:
Power Apps → CRUD operations → Dataverse
Power Automate → Trigger on row change → Dataverse
Power Pages → Web forms → Dataverse
Power BI → Data source → Dataverse

Benefits:
- Single source of truth (no data silos)
- Relationships enforced (referential integrity)
- Row-Level Security (RLS) built-in
- Audit trail (who changed what, when)
```

### 2. Connectors (1,000+ Available)

**Categories:**
- Microsoft (200+): SharePoint, Teams, Outlook, Dynamics 365, Azure
- Business (300+): Salesforce, SAP, Oracle, Workday, ServiceNow
- Productivity (200+): Google Workspace, Slack, Trello, Asana
- Social (50+): Twitter, LinkedIn, Facebook, Instagram
- Databases (100+): SQL Server, MySQL, PostgreSQL, MongoDB
- AI/ML (50+): OpenAI, Azure Cognitive Services, IBM Watson
- Custom (100+): REST API, SOAP, OData

**Example: Integrate Salesforce with Power Apps**
```
Power Apps → Data → Add data → Connectors → Salesforce

Authentication: OAuth 2.0 (Salesforce login)

Available tables:
  - Accounts
  - Contacts
  - Opportunities
  - Leads
  - Cases

Query: Gallery.Items = 'Salesforce'.Accounts
Filter: Filter('Salesforce'.Accounts, Industry = "Technology")
```

### 3. AI Builder (Pre-Built AI Models)

**Available Models:**
- **Text Recognition (OCR)** - Extract text from images, PDFs
- **Form Processing** - Extract data from invoices, receipts
- **Object Detection** - Identify objects in images
- **Sentiment Analysis** - Classify text as positive/negative/neutral
- **Language Detection** - Identify language of text
- **Category Classification** - Classify text into custom categories
- **Entity Extraction** - Extract names, dates, locations from text

**Example: Receipt Processing in Expense App**
```
Power Apps:
  1. User takes photo of receipt (Camera control)
  2. Upload to AI Builder → Receipt processing model
  3. AI extracts:
     - Merchant name: "Starbucks"
     - Amount: "$15.47"
     - Date: "2025-12-27"
     - Category: "Meals & Entertainment"
  4. Auto-populate expense form fields
  5. User reviews and submits

AI Builder configuration:
  - Model: Receipts (pre-trained)
  - Confidence threshold: 80% (reject low-confidence results)
  - Fallback: Manual entry if AI fails
```

---

## Licensing

| License | Price | Includes |
|---------|-------|----------|
| **Power Apps per user** | $20/user/month | Unlimited apps, standard connectors |
| **Power Apps per app** | $10/app/user/month | Single app access |
| **Power Automate per user** | $15/user/month | Unlimited flows |
| **Power Pages** | $200/month (capacity) | External users, 100K page views |
| **Power BI Pro** | $10/user/month | Basic reports, sharing |
| **Power BI Premium** | $4,995/month (capacity) | Advanced features, large datasets |

**Add-Ons:**
- AI Builder credits: $500/month for 1M credits
- Premium connectors: Included in Power Apps/Automate licenses

**Free Tier:**
- Power Apps: 2 apps/user (Dataverse for Teams)
- Power Automate: 750 runs/month
- Power Pages: 100 authenticated users
- Power BI: Desktop (local only, no sharing)

---

## Admin & Governance

**Power Platform Admin Center:**
```
admin.powerplatform.microsoft.com

Sections:
  - Environments (Dev, Test, Prod)
  - Data policies (DLP: Block/Allow connectors)
  - Analytics (App usage, Flow runs, Page views)
  - Capacity (Storage, API requests, AI Builder credits)
  - Support (Submit ticket, view incidents)

Key tasks:
  - Create environment: Production → Enable Dataverse
  - Set DLP policy: Block personal connectors (Gmail, Dropbox) in Prod
  - Monitor usage: Export CSV → Analyze in Excel/Power BI
  - Manage capacity: Add storage, AI credits as needed
```

**Data Loss Prevention (DLP):**
```
Admin Center → Data policies → New policy

Policy: "Production Environment - Strict"

Connector groups:
  - Business: SharePoint, Dynamics 365, SQL Server, Office 365
  - Non-business: Gmail, Twitter, Dropbox, personal OneDrive
  - Blocked: None (or add risky connectors)

Rules:
  - Apps in Production environment can ONLY use Business connectors
  - Flows cannot mix Business + Non-business connectors
  - Violation: App/Flow fails to save with DLP error

Apply to: Production environment
Enforced: Immediately
```

**Application Lifecycle Management (ALM):**
```
Environments:
  - Development → Build and test
  - Test → QA validation
  - Production → Live for users

Deployment:
  1. Export solution from Dev (ZIP file)
  2. Import to Test, run test suites
  3. Import to Prod after approval

CI/CD (Azure DevOps, GitHub Actions):
  - Power Platform CLI: pac solution export/import
  - Pipeline: Export Dev → Build → Deploy Test → Approval gate → Deploy Prod
```

---

## Security & Compliance

**Authentication:**
- Microsoft Entra ID (SSO)
- Multi-factor authentication (MFA) required
- Conditional access policies (IP restrictions, device compliance)

**Authorization:**
- Role-Based Access Control (RBAC)
- Dataverse security roles (Create, Read, Update, Delete per table)
- Row-Level Security (RLS): Users see only their data

**Data Encryption:**
- At rest: AES-256
- In transit: TLS 1.3
- Customer-managed keys (CMK) for Premium

**Compliance:**
- SOC 2, ISO 27001, ISO 27018
- GDPR, HIPAA, FedRAMP (GCC/GCC High)
- Data residency: US, EU, APAC, GCC

**Audit:**
- Unified Audit Log (M365 Admin Center)
- Export to Azure Sentinel, Splunk
- Retention: 90 days (default), 1 year (E5)

---

## Troubleshooting

**Issue: App/Flow Not Working After Update**
- Check dependencies: Connectors, data sources, permissions
- Review version history: Restore previous version if needed
- Test in Dev environment first before Prod deployment

**Issue: DLP Policy Blocking App**
- Review policy: Admin Center → Data policies
- Request exception: Submit ticket to admin
- Alternative: Use approved connector with similar functionality

**Issue: Slow Performance**
- Power Apps: Reduce gallery items (<500 rows), use delegation
- Power Automate: Batch operations, avoid nested loops
- Power BI: Incremental refresh, reduce visual count

---

## Resources

**Official Docs:**
- Power Platform: https://learn.microsoft.com/power-platform
- Power Apps: https://learn.microsoft.com/powerapps
- Power Automate: https://learn.microsoft.com/power-automate
- Power Pages: https://learn.microsoft.com/power-pages
- Power BI: https://learn.microsoft.com/power-bi

**Community:**
- Power Platform Community: https://powerusers.microsoft.com
- YouTube: Microsoft Power Platform channel

**Training:**
- Microsoft Learn: Power Platform learning paths
- PL-900: Power Platform Fundamentals (certification)

---

**Next Steps:**
1. Explore [Dynamics 365 Copilot](./dynamics-365-copilot.md) for CRM/ERP AI
2. Review [Connectors & MCP Catalog](./connectors-mcp.md) for integration options
3. Return to [Main README](../MICROSOFT-COPILOT-ECOSYSTEM-README.md) for overview
