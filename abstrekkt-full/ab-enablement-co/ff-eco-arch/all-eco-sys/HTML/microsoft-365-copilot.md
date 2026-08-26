# Microsoft 365 Copilot Guide

**Last Updated:** December 2025

## Overview

Microsoft 365 Copilot is your AI assistant integrated across Word, Excel, PowerPoint, Teams, Outlook, and other Microsoft 365 apps. It helps you write, analyze, design, and communicate more effectively using GPT-4.1, GPT-5, GPT-5.2, and Claude AI models.

**Key Stats (November 2025):**
- 3x more thumbs up than 6 months ago
- 17% satisfaction increase (May-Nov 2025)
- 2x drop in thumbs down
- Deployed across 15+ Microsoft 365 applications

---

## Quick Reference: What Copilot Can Do

| App | Key Capabilities |
|-----|------------------|
| **Word** | Draft documents, rewrite paragraphs, summarize, voice dictation |
| **Excel** | Agent Mode (multi-step), Python analysis, formula suggestions, data insights |
| **PowerPoint** | Generate slides, speaker notes, explain charts, on-canvas creation |
| **Teams** | Meeting summaries, file Q&A, live transcription, custom templates |
| **Outlook** | Draft emails, summarize threads, agenda generation, scheduling |
| **OneNote** | Summarize notes, extract to-dos |
| **Copilot Chat** | Cross-app assistant, Work IQ memory, file navigation |

---

## Word Copilot

### Core Features

**1. Draft Documents**
```
Prompt: "Write a 500-word blog post about sustainable farming practices"

Copilot:
- Generates full article with introduction, body paragraphs, conclusion
- Includes citations from web search (if enabled)
- Suggests tone: Professional, Casual, Enthusiastic

Output: Complete draft ready for editing
```

**2. Rewrite**
```
Select text → Copilot menu → Rewrite

Options:
- Professional tone
- Concise (shorter)
- Elaborate (longer)
- Casual tone
- Custom: "Rewrite for non-technical audience"
```

**3. Summarize**
```
Copilot → Summarize document

Options:
- Key Points (bullet list)
- Abstract (paragraph)
- Executive Summary (1-page)
- Custom length: "Summarize in 3 sentences"
```

**4. Voice in Word (Hands-Free)**
```
Word → Dictate → Copilot Voice Mode

Features:
- Hands-free document creation
- Voice commands: "New paragraph", "Bold that", "Insert header"
- Real-time transcription with auto-formatting
- Multi-language support (50+ languages)
```

### Best Practices

**Prompt Engineering:**
- **Specific:** "Write a 3-paragraph email to sales team about Q4 targets" ✓
- **Vague:** "Write something" ✗

**Iterative Refinement:**
```
1. Initial: "Draft product announcement"
2. Refine: "Make it more exciting and add customer benefits"
3. Polish: "Add a call-to-action for pre-orders"
```

**Citations:**
- Enable web search: Copilot → Settings → Allow web search
- Copilot includes footnotes for sourced claims
- Review citations for accuracy before publishing

---

## Excel Copilot

### Core Features

**1. Agent Mode (Multi-Step Analysis)**

**What It Does:** Breaks complex data tasks into subtasks and executes them autonomously.

```
User: "Analyze Q4 sales by region and product category, show trends"

Agent Mode:
1. Identifies required analysis: Revenue by region, product, month-over-month growth
2. Creates pivot table: Region × Product Category
3. Calculates metrics: Total revenue, % change vs Q3
4. Generates chart: Column chart with trend lines
5. Inserts summary: "North America leads with $1.2M (30% growth)"

Output: Complete analysis with visualizations in seconds
```

**2. Python Code Interpreter**

**What It Does:** Executes Python code for advanced analytics (regression, forecasting, ML).

```
User: "Predict next quarter sales using linear regression"

Copilot:
1. Loads data into Python pandas DataFrame
2. Trains sklearn LinearRegression model on historical data
3. Generates forecast for Q1 2026
4. Plots actual vs predicted with confidence intervals
5. Returns: "Predicted Q1 revenue: $1.4M ±$150K (R²=0.85)"
```

**Supported Libraries:**
- pandas (data manipulation)
- numpy (numerical computing)
- matplotlib / seaborn (visualization)
- sklearn (machine learning)
- scipy (statistics)

**3. Formula Suggestions**

```
Scenario: Calculating monthly growth rate

User types: "=growth"

Copilot autocomplete:
=(B2-A2)/A2  // Month-over-month growth
=(B2-A2)/A2*100  // Growth percentage
=(B2/A2)-1  // Alternative growth formula

Select suggestion → Press Tab to accept
```

**4. Data Analysis**

```
Select data range → Copilot → Analyze Data

Copilot insights:
- "Revenue peaks in December (seasonal trend)"
- "West region growth 45% above average"
- "Product A represents 60% of total sales"
- Suggested pivot tables and charts
```

### Best Practices

**Agent Mode:**
- Be specific: "Show top 10 products by revenue" vs "Show products"
- Review outputs: Agent Mode is fast but double-check calculations
- Complex tasks: Break into smaller steps if Agent Mode struggles

**Python Analysis:**
- Data prep: Clean data first (remove nulls, fix formats)
- Model validation: Check R² score, residuals, outliers
- Document code: Copilot includes code comments, save for reproducibility

**Performance:**
- Large datasets (>100K rows): Use Power Query for pre-processing
- Slow responses: Reduce data range or simplify request
- Memory limits: Python interpreter has 2GB RAM limit

---

## PowerPoint Copilot

### Core Features

**1. Generate Slides from Prompts**

```
Copilot → "Create presentation"

Prompt: "Create a 5-slide deck about AI in healthcare"

Copilot:
1. Slide 1: Title - "AI in Healthcare: Transforming Patient Care"
2. Slide 2: Current Challenges (bullet list with icons)
3. Slide 3: AI Applications (diagnosis, treatment, drug discovery)
4. Slide 4: Case Study (Mayo Clinic AI radiology)
5. Slide 5: Future Outlook (predictions, call-to-action)

Each slide includes:
- Designer-quality layouts
- Relevant stock images
- Consistent theme/colors
- Speaker notes
```

**2. Generate from Documents**

```
Copilot → "Create presentation from file"

Upload: "Q4_Financial_Report.docx"

Copilot:
- Extracts key sections from document
- Converts to slides (headers → slide titles)
- Summarizes paragraphs into bullets
- Adds charts from document tables
- Preserves citations and footnotes
```

**3. Speaker Notes**

```
Select slide → Copilot → Generate speaker notes

Copilot:
- Expands bullet points into full sentences
- Adds context and examples
- Suggests talking points
- Estimates speaking time (2-3 min per slide)
```

**4. "Explain This" Feature**

```
Select chart/diagram → Copilot → "Explain this"

Copilot:
- Describes what chart shows
- Highlights key insights
- Suggests verbal explanation for presenter
- Identifies anomalies or trends
```

**5. On-Canvas Creation**

```
PowerPoint → Copilot sidebar (always visible)

Commands:
- "Add a slide about customer testimonials"
- "Insert a timeline showing product roadmap"
- "Create a comparison table: Plan A vs Plan B"
- "Add icon: rocket ship"

Copilot creates content directly on canvas while you present or edit.
```

### Best Practices

**Prompt Specificity:**
- **Good:** "Create 8-slide sales pitch for B2B SaaS product targeting CFOs" ✓
- **Vague:** "Make presentation about sales" ✗

**Design Consistency:**
- Apply theme first: Design → Themes → Select corporate template
- Copilot respects theme colors, fonts, layouts
- Review for brand compliance (logo placement, color palette)

**Speaker Notes:**
- Generate notes after finalizing content
- Edit for personal style (Copilot = starting point)
- Practice with notes, adjust length if timing is off

---

## Teams Copilot

### Core Features

**1. Meeting Summaries**

**During Meeting:**
- Copilot → Start recording
- Real-time transcription with speaker identification
- Live captions for accessibility

**After Meeting:**
```
Copilot generates:

Summary Types:
1. Speaker Summary - Who said what (attribution)
2. Executive Summary - High-level overview (for leadership)
3. Action Items - To-dos with assignees
4. Decisions - Key decisions made during call
5. Q&A - Questions asked and answers given

Custom Templates:
- "Summarize only technical discussions"
- "Extract decisions and next steps"
- "List unresolved issues"
```

**2. File Summaries in Chat**

```
Teams chat with attachment: "Quarterly_Report.pdf"

User: "@Copilot summarize this file"

Copilot:
- Reads PDF content
- Extracts key metrics (revenue, growth, risks)
- Highlights action items
- Answers follow-up questions: "What's the biggest risk?"
```

**3. Q&A During Calls**

```
Meeting in progress → Copilot panel

User (typed question): "What did we decide about the pricing model?"

Copilot:
- Searches meeting transcript (real-time)
- Finds relevant segment: "At 14:32, Sarah proposed tiered pricing..."
- Provides answer without interrupting speaker
```

### Best Practices

**Recording Consent:**
- Announce recording at meeting start (legal requirement in some regions)
- Teams displays "Recording in progress" badge
- Participants can opt out (meeting organizer decides)

**Summary Templates:**
- Create custom templates for recurring meetings (sprint planning, 1:1s, board meetings)
- Teams → Copilot Settings → Meeting Templates → Add Custom

**Follow-Up:**
- Export action items to Planner, To Do, or Jira
- Share summary via Teams chat or email
- Review transcript for accuracy (AI transcription ~95% accurate)

---

## Outlook Copilot

### Core Features

**1. Draft Emails**

```
Outlook → New Email → Copilot → Draft with Copilot

Prompt: "Write email to vendor requesting quote for 100 laptops"

Copilot:
Subject: Request for Quote - 100 Laptops

Dear [Vendor Name],

I hope this email finds you well. We are currently seeking a quote for 100 laptops with the following specifications:
- Processor: Intel Core i7 or equivalent
- RAM: 16GB
- Storage: 512GB SSD
- Display: 15-inch

Please include:
- Unit pricing
- Bulk discount (if applicable)
- Delivery timeline
- Warranty terms

Looking forward to your response.

Best regards,
[Your Name]
```

**2. Summarize Email Threads**

```
Long email thread (10+ messages) → Copilot → Summarize

Copilot:
- Timeline of discussion
- Key decisions made
- Open questions
- Action items with owners
- Recommended next step
```

**3. Meeting Agenda Generation**

```
Calendar → New Meeting → Copilot → Suggest Agenda

Based on: Meeting title, attendees, related emails

Copilot generates:
1. Welcome & Introductions (5 min)
2. Project Status Update (15 min) - Sarah presents
3. Budget Review (10 min) - Finance team
4. Next Steps & Action Items (5 min)
5. Q&A (5 min)

Total: 40 minutes
```

**4. Scheduling with Copilot**

```
Email: "Let's meet next week to discuss the proposal"

Copilot suggests:
- Tuesday 2:00 PM (all attendees available)
- Wednesday 10:00 AM (second option)
- Sends meeting invite with agenda
```

### Best Practices

**Email Drafting:**
- Specify tone: "Professional", "Friendly", "Formal"
- Include context: "Draft thank-you email after client meeting"
- Review before sending (AI may miss nuances)

**Thread Management:**
- Summarize threads >5 messages to catch up quickly
- Use summary to decide: Reply, forward, or archive?
- Export summaries to OneNote for future reference

---

## Copilot Chat (Cross-App Assistant)

### Core Features

**1. Work IQ Memory (Recalls Past Conversations)**

**What It Does:** Remembers context from previous chats to provide personalized responses.

```
Monday:
User: "I'm working on the FlashFusion project budget"
Copilot: "Got it. How can I help with the budget?"

Wednesday:
User: "What was my budget estimate again?"
Copilot: "From our conversation on Monday, you were working on FlashFusion budget. Let me find that..."
[retrieves previous context]
```

**How It Works:**
- Stores conversation summaries (not verbatim transcripts)
- Privacy: User can delete memory at any time
- Retention: 90 days (default), user-configurable

**2. Expanded Navigation**

```
Copilot Chat sidebar:

Sections:
- Recent (last 7 days)
- Work (project-related)
- Personal (calendar, tasks)
- Shared (team conversations)

Quick actions:
- "Find email from Sarah about Q4 targets"
- "Show my calendar for next week"
- "List tasks due today"
```

**3. Library Experience**

```
Copilot → Library

Collections:
- Saved Prompts (reusable templates)
- Pinned Conversations (quick access)
- Shared Copilots (team-created agents)
- Templates (pre-built workflows)

Example saved prompt:
"Summarize this document and extract action items with deadlines"
→ Reuse for every project doc
```

**4. Frontier Tab (Experimental Features)**

```
Copilot → Settings → Frontier

Early access features:
- Multi-modal input (voice + image + text)
- Code generation from wireframes
- Advanced reasoning (GPT-5.2)
- Custom plugins (preview)

Opt-in required: Settings → Enable Frontier features
```

### Best Practices

**Work IQ:**
- Review memory: Copilot → Settings → Manage Memory
- Delete sensitive info: Select conversation → Delete
- Control retention: Settings → Memory → 30/60/90 days

**Navigation:**
- Pin important conversations for quick access
- Use tags: "Project X", "Client Y" for filtering
- Export conversations to OneNote or Word for archival

---

## Mobile (Copilot in Word/Excel/PowerPoint Apps)

**File Preview with Copilot Chat:**
```
OneDrive mobile → Open document → Copilot button

Without opening full app:
- Summarize document
- Answer questions about content
- Extract key data

Example:
User: "What's the total revenue in this spreadsheet?"
Copilot: (reads Excel file) "Total revenue: $4.2M across all regions"
```

**Features:**
- iOS and Android supported
- Requires Microsoft 365 Copilot license
- Works offline (limited features)

---

## Declarative Agents (Advanced)

**What It Does:** Custom agents interpret images, extract chart data, and work across Word/PowerPoint/PDFs.

```
Agent: "Financial Analyst"

Capabilities:
1. Image interpretation:
   - Scan uploaded chart image
   - Extract data points (revenue, expenses)
   - Identify trends (growth, decline)

2. Document insights:
   - Read PDF financial statements
   - Summarize balance sheet, income statement
   - Flag anomalies (unexpected expenses, missing data)

3. Cross-app workflow:
   - Extract data from Word report
   - Create Excel analysis
   - Generate PowerPoint summary

Configuration:
Copilot Studio → Create Agent → Financial Analyst
Capabilities: Image → Chart data extraction, PDF → Text extraction
Connectors: Excel, PowerPoint, SharePoint
```

**Use Cases:**
- Legal Contract Review (extract clauses, flag risks)
- Research Assistant (summarize papers, extract citations)
- Competitive Analysis (scan competitor PDFs, extract features)

---

## Agent Builder (No-Code Agent Creation)

**What It Does:** Build custom agents without Copilot Studio subscription.

```
Copilot Chat → Create Agent

Steps:
1. Name: "Sales Enablement Bot"
2. Purpose: "Help sales team find product info and case studies"
3. Data sources:
   - SharePoint: /sites/sales/Documents
   - Dataverse: Customer table
4. Actions:
   - Search product catalog
   - Find case studies by industry
5. Test & deploy

Agent available to team in Copilot Chat.
```

**Upgrade Path:**
- "Copy to Copilot Studio" button
- Migrates agent to full Copilot Studio environment
- Unlocks advanced features (HITL, MCP, workflows)

---

## Licensing

| License | Price | Includes |
|---------|-------|----------|
| **Microsoft 365 E3/E5** | $36-57/user/month | Base M365 apps (no Copilot) |
| **Microsoft 365 Copilot** | +$30/user/month | Copilot in all apps, 1K credits |
| **Microsoft 365 Premium** | $19.99/month | Individual (home/small business) |

**What's Included:**
- Word, Excel, PowerPoint, Teams, Outlook Copilot
- Copilot Chat with Work IQ memory
- 1,000 Copilot Studio credits/user/month
- Agent Builder (basic)

**Not Included:**
- Advanced Copilot Studio features (HITL, MCP) → Separate license ($200/month capacity)
- Custom model fine-tuning → Azure OpenAI separate SKU

---

## Admin Controls

**Usage Reports:**
```
Microsoft 365 Admin Center → Reports → Copilot

Metrics:
- Prompt submissions (by app, by user)
- App interactions (Word, Excel, PowerPoint, Teams, Outlook)
- Feature adoption (Agent Mode, Voice, Summarize)
- User satisfaction (thumbs up/down)

Export: CSV, Power BI connector
```

**Copilot Dashboard:**
```
Admin Center → Copilot Dashboard

Views:
- Active users (daily, weekly, monthly)
- Top features (most-used capabilities)
- Error rates (failed requests, timeouts)
- Model distribution (GPT-4.1 vs GPT-5 usage)

Graph API endpoint: /admin/serviceAnnouncement/copilotUsage
```

**Policy Controls:**
```
Admin Center → Settings → Copilot

Toggles:
☑ Allow web search (for citations)
☑ Allow image generation (Designer integration)
☐ Allow Python code execution (security risk)
☑ Enable Work IQ memory
☐ Allow external data connectors

Data residency: US, EU, APAC
Retention: 30/60/90 days
```

---

## Security & Compliance

**Data Protection:**
- Prompts and responses encrypted at rest (AES-256)
- In-transit encryption (TLS 1.3)
- Data residency honors tenant location (EU, US, APAC)

**Compliance:**
- SOC 2, ISO 27001/27018
- GDPR compliant (data subject rights, retention policies)
- HIPAA (BAA available for healthcare tenants)

**Privacy:**
- Microsoft does not use customer data to train models
- Prompts logged for 30 days (admin-configurable)
- User can delete conversation history

**Audit:**
- Unified Audit Log captures Copilot events
- Export to Microsoft Sentinel, Splunk, Azure Log Analytics
- Retention: 90 days (default), 1 year (E5)

---

## Troubleshooting

**Issue: Copilot Not Appearing**
- Check license: Admin Center → Users → [User] → Licenses → Microsoft 365 Copilot
- Check rollout: Copilot may take 24-48 hours after license assignment
- Clear cache: Office app → File → Account → Update Options → Update Now

**Issue: Slow Responses**
- Network latency: Check internet speed (>5 Mbps recommended)
- Large files: Excel files >50MB may timeout, use smaller range
- Model choice: GPT-5 slower than GPT-4.1, switch models in Settings

**Issue: Inaccurate Results**
- Web search disabled: Enable in Copilot Settings → Allow web search
- Ambiguous prompt: Be specific ("Summarize page 3" vs "Summarize")
- Outdated data: Copilot uses file's current state, refresh if stale

---

## Resources

**Official Docs:**
- M365 Copilot Overview: https://learn.microsoft.com/microsoft-365-copilot
- Feature Roadmap: https://www.microsoft.com/microsoft-365/roadmap
- What's New: https://support.microsoft.com/microsoft-365-copilot/whats-new

**Training:**
- Microsoft Learn: M365 Copilot Learning Path
- YouTube: Microsoft 365 channel

**Support:**
- In-app feedback: Copilot → Thumbs up/down on any response
- Admin support: Microsoft 365 Admin Center → Support

---

**Next Steps:**
1. Explore [Power Platform Integration](./power-platform-copilot.md) for workflow automation
2. Review [Dynamics 365 Copilot](./dynamics-365-copilot.md) for CRM/ERP AI features
3. Check [Connectors & MCP Catalog](./connectors-mcp.md) for extending Copilot
