# Gemini Workspace Extensions - Complete Guide

**Last Updated:** December 2025  
**Scope:** Gmail, Docs, Sheets, Slides, Drive, Meet, Chat, Vids, NotebookLM, 100+ extensions

---

## TL;DR

**Gemini for Workspace** embeds AI across Gmail, Docs, Sheets, Slides, Drive, Meet, Chat, and Vids with **100+ third-party extensions**. Available to **Business/Enterprise** users (included as of January 2025), it enables document drafting, email summarization, meeting transcription, data analysis, and workflow automation—all within familiar Google tools.

---

## What Is Gemini for Workspace?

**Gemini for Workspace** is Google's integrated AI assistant across Google Workspace apps:

- **Native integration:** AI features embedded in Gmail, Docs, Sheets, etc.
- **100+ extensions:** Third-party tools (Jira, Salesforce, HubSpot, Canva, etc.)
- **Included in plans:** Business, Enterprise (as of January 2025)
- **Standalone add-on:** Previously $20/user/month, now bundled
- **Cross-app context:** Share data across Gmail, Drive, Calendar, Docs

**Access:** [workspace.google.com/gemini](https://workspace.google.com/gemini)

---

## Core Workspace Apps

### 1. Gmail

**Features:**
- **Help me write:** Draft emails from prompts
- **Smart Reply:** AI-suggested responses
- **Summarize email thread:** Condensed view of long conversations
- **Organize inbox:** Auto-categorize, prioritize
- **Translate:** Inline translation (100+ languages)

**Use Cases:**
- Draft customer support responses
- Summarize project update threads
- Translate vendor communications
- Prioritize urgent messages

**How to Use:**
```
1. Click "Help me write" in compose window
2. Enter prompt: "Polite follow-up email about invoice payment"
3. Review generated draft
4. Edit as needed or regenerate
5. Send

Or:
1. Open long email thread
2. Click "Summarize this email"
3. Read condensed version
4. Jump to specific messages
```

**API Integration (Gmail API + Gemini):**
```python
# Fetch email thread
thread = gmail_service.users().threads().get(
    userId='me',
    id=thread_id
).execute()

# Summarize with Gemini
messages = [msg['snippet'] for msg in thread['messages']]
summary = gemini_model.generate_content(
    f"Summarize this email thread:\n\n{'\n'.join(messages)}"
)

print(summary.text)
```

---

### 2. Google Docs

**Features:**
- **Help me write:** Generate text from prompts
- **Rewrite:** Adjust tone, length, formality
- **Proofreading:** Grammar, spelling, style
- **Summarize:** Condense long documents
- **Smart canvas:** Inline tasks, @mentions, tables

**Use Cases:**
- Draft blog posts, reports, proposals
- Rewrite marketing copy for different audiences
- Summarize research papers
- Create meeting agendas

**How to Use:**
```
1. Click "Help me write" (Ctrl+H / Cmd+H)
2. Enter prompt: "Write introduction for Q4 sales report"
3. Review generated text
4. Click "Refine" → Adjust tone (formal, casual)
5. Insert into document

Or:
1. Select existing text
2. Right-click → "Rewrite"
3. Choose tone: Formal, Casual, Concise, Elaborate
4. Replace or keep original
```

**Advanced: Smart Canvas Integration**
```
Create a table of {{competitor_analysis}}
Add a to-do list for {{project_milestones}}
Insert chart from {{sales_data_sheet}}
```

---

### 3. Google Sheets

**Features:**
- **Help me organize:** Create tables from descriptions
- **Auto-fill:** Predict data patterns
- **Formula suggestions:** Smart formula generation
- **Data insights:** Auto-generated charts, trends
- **Clean data:** Remove duplicates, fix formatting

**Use Cases:**
- Create expense trackers from descriptions
- Generate sales forecasts
- Clean imported CSV data
- Build project timelines

**How to Use:**
```
1. Click "Help me organize" in new sheet
2. Describe table: "Budget tracker with categories and monthly columns"
3. Review generated structure
4. Adjust as needed

Or:
1. Select data range
2. Click "Insert" → "Chart"
3. Click "Gemini suggestions"
4. Choose recommended visualization
```

**Advanced: Formula Generation**
```
Prompt: "Calculate total sales by product category, excluding refunds"

Generated formula:
=SUMIFS(Sales!C:C, Sales!A:A, "Product Category", Sales!D:D, "<>Refund")
```

---

### 4. Google Slides

**Features:**
- **Help me create:** Generate presentations from topics
- **Auto-design:** Suggest layouts, themes
- **Image generation:** Create custom visuals
- **Speaker notes:** Auto-generate from content
- **Translate:** Convert presentations to other languages

**Use Cases:**
- Create pitch decks from outlines
- Design training materials
- Generate sales presentations
- Build team updates

**How to Use:**
```
1. Click "Create with Gemini"
2. Enter topic: "Q4 product launch strategy"
3. Specify slides: "5 slides covering market, features, pricing, timeline, CTA"
4. Review generated deck
5. Customize slides, images, layout

Or:
1. Select slide content
2. Click "Design ideas"
3. Choose Gemini-suggested layout
4. Adjust as needed
```

---

### 5. Google Drive

**Features:**
- **Search with AI:** Natural language file search
- **Summarize files:** Multi-file summaries
- **Auto-organize:** Suggest folder structures
- **Activity insights:** Who accessed what, when
- **Smart suggestions:** Related files, next actions

**Use Cases:**
- Find files without exact names ("Q3 budget spreadsheet")
- Summarize all project docs at once
- Organize messy shared drives
- Track team collaboration

**How to Use:**
```
1. Open Drive search (Ctrl+K / Cmd+K)
2. Enter natural language: "All presentations from last month about AI"
3. Review results
4. Filter by type, owner, date

Or:
1. Select multiple files
2. Right-click → "Summarize with Gemini"
3. Read combined summary
4. Jump to specific files
```

---

### 6. Google Meet

**Features:**
- **Live captions:** Real-time transcription (100+ languages)
- **Meeting summaries:** Auto-generated recaps
- **Action items:** Extract tasks, deadlines
- **Attendance tracking:** Who joined, when
- **Meeting insights:** Talk time, sentiment, topics

**Use Cases:**
- Transcribe interviews, user research
- Capture action items from standups
- Review meeting highlights (skip recording)
- Track participation metrics

**How to Use:**
```
1. Start Meet call
2. Click "Captions" → Enable live transcription
3. Click "Record" (if needed)
4. After meeting, click "View summary"
5. Review auto-generated recap, action items
6. Share with attendees

Or (during meeting):
1. Ask: "Hey Gemini, what are the action items so far?"
2. Review real-time summary
3. Confirm with team
```

---

### 7. Google Chat

**Features:**
- **Chatbot integration:** Gemini as team member
- **Summarize threads:** Condensed conversation view
- **Smart replies:** Suggested responses
- **Task extraction:** Auto-create tasks from messages
- **Search conversations:** Natural language queries

**Use Cases:**
- Ask Gemini for info ("What's our PTO policy?")
- Summarize long team discussions
- Extract action items from chat
- Search past conversations

**How to Use:**
```
1. In Chat, @mention Gemini
2. Ask: "@Gemini summarize this thread"
3. Or: "@Gemini what are the key decisions from today?"
4. Review response
5. Share with team

Or (personal):
1. Open Gemini chat (left sidebar)
2. Ask: "Find emails about project Alpha from last week"
3. Review results
4. Click to open in Gmail
```

---

### 8. Google Vids (New - 2025)

**Features:**
- **Video creation:** Generate from text prompts
- **Stock footage:** AI-recommended clips
- **Voiceover:** Text-to-speech narration
- **Music:** Royalty-free background tracks
- **Templates:** Pre-built layouts

**Use Cases:**
- Create training videos from docs
- Build product demos
- Generate team updates
- Design onboarding content

**How to Use:**
```
1. Open Vids
2. Click "Help me create"
3. Enter prompt: "Training video on new expense policy"
4. Upload source doc (optional)
5. Select template, voiceover style
6. Review generated video
7. Edit scenes, add footage
8. Publish or share
```

---

## NotebookLM (Standalone)

**What It Is:**
- **AI research assistant** for document analysis
- **Source grounding:** All responses cite uploaded docs
- **Audio Overviews:** Generate podcast-style summaries
- **Notebook organization:** Multi-source synthesis

**Features:**
- Upload up to 50 sources (PDFs, Docs, URLs, YouTube)
- Ask questions grounded in sources
- Generate study guides, FAQs, briefings
- Create Audio Overviews (2-host podcast format)

**Use Cases:**
- Research synthesis (10+ papers → summary)
- Study guides from textbooks
- Competitor analysis (upload competitor sites)
- Team knowledge base (upload all project docs)

**How to Use:**
```
1. Go to [notebooklm.google.com](https://notebooklm.google.com)
2. Create new notebook
3. Upload sources:
   - PDFs (max 500K words each)
   - Google Docs, Slides
   - Websites (auto-scrape)
   - YouTube videos (transcript)
4. Ask questions: "What are the key findings on AI safety?"
5. Review cited responses
6. Generate Audio Overview for 10-minute podcast summary
```

**Audio Overview Generation:**
```
1. Click "Generate Audio Overview"
2. Wait 5-10 minutes
3. Listen to 2-host podcast discussing your sources
4. Download MP3 (share with team)
5. Customize focus (optional): "Emphasize risk analysis"
```

**Limitations:**
- 50 sources max per notebook
- 500K words per source
- Audio Overviews: English only (as of Dec 2025)

---

## Extensions Marketplace

**100+ Third-Party Extensions** (December 2025)

### Productivity & Project Management
- **Jira:** Create issues, update tickets from Chat/Docs
- **Asana:** Assign tasks, track projects
- **Monday.com:** Update boards, sync status
- **Trello:** Create cards, move between lists
- **ClickUp:** Manage tasks, docs, goals

### CRM & Sales
- **Salesforce:** Update leads, log calls, check deals
- **HubSpot:** Track contacts, create deals, send emails
- **Pipedrive:** Manage pipeline, update stages
- **Zoho CRM:** Log activities, update records

### Marketing & Design
- **Canva:** Create designs from prompts
- **Figma:** Fetch designs, update files
- **Adobe Creative Cloud:** Access assets, generate images
- **Mailchimp:** Create campaigns, check stats

### Finance & Accounting
- **QuickBooks:** Track expenses, generate invoices
- **Xero:** Update transactions, reconcile accounts
- **Stripe:** View payments, create invoices
- **Expensify:** Submit expense reports

### Code & Dev Tools
- **GitHub:** Create issues, PR summaries, code reviews
- **GitLab:** Manage repositories, CI/CD
- **Linear:** Track issues, project updates
- **Sentry:** Check errors, triage bugs

### Communication
- **Slack:** Search messages, post updates
- **Microsoft Teams:** (via connectors)
- **Zoom:** Schedule meetings, get transcripts

### HR & Recruiting
- **Greenhouse:** Track candidates, schedule interviews
- **Lever:** Manage pipeline, post jobs
- **BambooHR:** Check PTO, update employee info

**How to Use Extensions:**
```
1. Go to Workspace → Extensions
2. Browse or search for extension
3. Click "Install"
4. Authorize permissions
5. Use in Chat: "@Jira create bug report for login issue"
6. Or in Docs: Insert → Extensions → Jira → Import ticket
```

---

## Cross-App Context

**Gemini shares context across Workspace apps:**

**Example Workflow:**
```
1. Gmail: Receive customer complaint email
2. Chat: @Gemini "Summarize complaint from john@example.com"
3. Docs: "Help me write response based on complaint"
4. Sheets: "Add complaint to tracker"
5. Meet: "Generate agenda for customer call"
6. Drive: "Find related support docs"
```

**API Integration:**
```python
# Unified Workspace API (Gemini + Google APIs)

# 1. Fetch email (Gmail API)
message = gmail_service.users().messages().get(
    userId='me',
    id=message_id
).execute()

# 2. Summarize with Gemini
summary = gemini_model.generate_content(
    f"Summarize: {message['snippet']}"
)

# 3. Create Doc (Docs API)
doc = docs_service.documents().create(
    body={"title": "Response to Customer"}
).execute()

# 4. Insert summary (Gemini + Docs API)
requests = [{
    'insertText': {
        'location': {'index': 1},
        'text': summary.text
    }
}]

docs_service.documents().batchUpdate(
    documentId=doc['documentId'],
    body={'requests': requests}
).execute()
```

---

## Pricing & Availability

### Included Plans (January 2025+)

| Plan | Gemini Included | Price |
|------|-----------------|-------|
| **Business Starter** | ✅ Basic | $6/user/month |
| **Business Standard** | ✅ Standard | $12/user/month |
| **Business Plus** | ✅ Advanced | $18/user/month |
| **Enterprise** | ✅ Enterprise | Custom pricing |

**Previously:** Gemini add-on was $20/user/month extra (now bundled)

### Feature Comparison

| Feature | Basic | Standard | Advanced | Enterprise |
|---------|-------|----------|----------|------------|
| **Help me write** (Gmail, Docs) | ✅ | ✅ | ✅ | ✅ |
| **Summarize** (Gmail, Drive) | ✅ | ✅ | ✅ | ✅ |
| **Meeting summaries** (Meet) | ❌ | ✅ | ✅ | ✅ |
| **Data insights** (Sheets) | ❌ | ✅ | ✅ | ✅ |
| **Extensions** | 10 | 50 | 100+ | 100+ |
| **NotebookLM sources** | 20 | 50 | 50 | 50 |
| **Audio Overviews** | ✅ | ✅ | ✅ | ✅ |
| **Admin controls** | Basic | Standard | Advanced | Enterprise |

---

## Admin Controls

**Workspace Admins can configure:**

### 1. Enable/Disable Features
- Turn on/off per app (Gmail, Docs, Sheets, etc.)
- Control extension access
- Set user groups with different permissions

### 2. Data Residency
- Choose data storage region
- Comply with GDPR, HIPAA
- Control cross-border data transfer

### 3. Usage Reports
- Track adoption metrics
- Monitor costs (if applicable)
- Review security events

### 4. Content Policy
- Block sensitive topics
- Filter harmful content
- Set custom safety thresholds

**Admin Console:**
```
1. Go to [admin.google.com](https://admin.google.com)
2. Apps → Google Workspace → Gemini
3. Configure settings:
   - Enable for organization
   - Select user groups
   - Set data location
   - Configure content policy
4. Save changes (apply in <1 hour)
```

---

## Security & Compliance

### Data Protection
- **Encryption:** At rest (AES-256), in transit (TLS 1.3)
- **Access controls:** Role-based permissions, audit logs
- **Data residency:** Regional storage options
- **DLP:** Data Loss Prevention integration
- **Retention:** Configurable (7 days to indefinite)

### Compliance Certifications
- ✅ SOC 2 Type II
- ✅ ISO 27001, 27017, 27018
- ✅ GDPR compliant
- ✅ HIPAA compliant (with BAA)
- ✅ FERPA compliant (education)
- ✅ FedRAMP Moderate (government)

### Privacy Commitments
- **No training on customer data:** Workspace data not used to train Gemini models
- **No human review:** Unless explicitly permitted for support
- **Admin transparency:** Full visibility into data access

---

## Best Practices

### 1. Prompt Engineering
- Be specific: "Draft 3-paragraph email" vs "Write email"
- Provide context: Include background, audience, tone
- Iterate: Refine prompts based on results

### 2. Integration Patterns
- Use extensions for repetitive tasks (Jira updates)
- Leverage cross-app context (Gmail → Docs → Sheets)
- Automate workflows with Apps Script + Gemini API

### 3. Team Adoption
- Start with Gmail, Docs (highest value)
- Train users on prompting best practices
- Share templates for common use cases
- Monitor usage reports, gather feedback

### 4. Security
- Enable DLP policies before rollout
- Review extension permissions carefully
- Train users on sensitive data handling
- Audit logs regularly

---

## Troubleshooting

**Gemini button not showing:**
- Check admin enabled Gemini for your account
- Refresh browser, clear cache
- Verify Workspace plan includes Gemini

**Generated content is inaccurate:**
- Provide more context in prompt
- Use "Refine" to adjust
- Enable grounding (if available)

**Extension not working:**
- Re-authorize extension permissions
- Check extension is installed
- Verify account has access (admin settings)

**Can't share Gemini results:**
- Check sharing permissions on source files
- Verify recipient has Workspace account
- Use "Download" if sharing externally

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Gemini included in Business/Enterprise plans (January 2025)  
**SOURCE:** [workspace.google.com/pricing](https://workspace.google.com/pricing)  
**STATUS:** Verified January 2025

**CLAIM:** 100+ extensions available  
**SOURCE:** [workspace.google.com/marketplace](https://workspace.google.com/marketplace)  
**STATUS:** Verified December 2025

**CLAIM:** NotebookLM supports 50 sources  
**SOURCE:** [notebooklm.google.com](https://notebooklm.google.com)  
**STATUS:** Verified December 2025

**COUNTEREXAMPLE:** Some features (Deep Research) not available in Workspace Gemini - requires Gemini Advanced subscription
