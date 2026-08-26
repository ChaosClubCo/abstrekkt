---
name: workflow-automation
description: Build automated workflows using no-code/low-code platforms (n8n, Zapier, Make/Integromat) and custom automation scripts. Use when connecting SaaS tools, automating business processes, or orchestrating multi-step workflows without extensive coding.
---

# Workflow Automation

Build automated workflows using n8n, Zapier, Make, and custom scripts to connect SaaS tools and automate business processes.

## Quick Start Decision Tree

**Choose your automation platform:**

1. **Need self-hosted + privacy?** → n8n (Step 1)
2. **Non-technical users?** → Zapier (Step 2)
3. **Complex multi-step flows?** → Make/Integromat (Step 3)
4. **Need full control + code?** → Custom Scripts (Step 4)
5. **Comparing platforms?** → See references/platform-comparison.md

## Core Workflow

### Step 1: n8n (Self-Hosted, Open Source)

**When to use n8n:**
- Need self-hosted solution (data privacy, compliance)
- Complex logic with code nodes (JavaScript/Python)
- 400+ native integrations
- Budget-conscious (free self-hosted, $20/month cloud)

**Setup:**

```bash
# Docker deployment (recommended)
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Or Docker Compose
version: '3'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
      - N8N_HOST=n8n.yourdomain.com
      - WEBHOOK_URL=https://n8n.yourdomain.com/
```

**Example workflow: Slack → Airtable → Email**

```json
{
  "nodes": [
    {
      "name": "Slack Trigger",
      "type": "n8n-nodes-base.slackTrigger",
      "parameters": {
        "channel": "#feedback",
        "simplifyOutput": true
      }
    },
    {
      "name": "Parse Message",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Extract email and feedback from message\nconst message = $input.item.json.text;\nconst email = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+)/)?.[0];\nconst feedback = message.replace(email, '').trim();\n\nreturn { email, feedback, timestamp: new Date().toISOString() };"
      }
    },
    {
      "name": "Add to Airtable",
      "type": "n8n-nodes-base.airtable",
      "parameters": {
        "operation": "create",
        "baseId": "appXXXXXXXXXXXXXX",
        "table": "Feedback",
        "fields": {
          "Email": "={{$json.email}}",
          "Feedback": "={{$json.feedback}}",
          "Timestamp": "={{$json.timestamp}}"
        }
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.gmail",
      "parameters": {
        "operation": "send",
        "to": "team@company.com",
        "subject": "New Feedback Received",
        "message": "Feedback from {{$json.email}}:\n\n{{$json.feedback}}"
      }
    }
  ],
  "connections": {
    "Slack Trigger": { "main": [[{ "node": "Parse Message" }]] },
    "Parse Message": { "main": [[{ "node": "Add to Airtable" }, { "node": "Send Email" }]] }
  }
}
```

**n8n best practices:**
- Use Code nodes for complex logic (JavaScript/Python)
- Enable error handling (Error Trigger node)
- Set execution limits (avoid infinite loops)
- Use variables for credentials (env vars)
- Test with sample data before activating
- Monitor executions in n8n logs

See: references/n8n-cookbook.md for 50+ workflow templates

### Step 2: Zapier (No-Code, Cloud)

**When to use Zapier:**
- Non-technical users need to build workflows
- Need 6,000+ app integrations
- Simple trigger → action flows
- Budget: $20-$100/month (based on tasks)

**Zapier terminology:**
- **Zap:** Automated workflow
- **Trigger:** Event that starts the Zap (e.g., new email)
- **Action:** What happens (e.g., create Slack message)
- **Task:** One action executed (billing unit)

**Example Zap: Gmail → Notion → Slack**

```
Trigger: Gmail - New Email Matching Search
  └─ Search: from:client@company.com subject:"Invoice"

Action 1: Notion - Create Database Item
  └─ Database: Invoices
  └─ Properties:
      - Client: {{Trigger__From Name}}
      - Amount: {{Trigger__Subject}} (extract via formatter)
      - Date: {{Trigger__Date}}
      - Email: {{Trigger__Link to Email}}

Action 2: Formatter - Text (Extract Number)
  └─ Input: {{Trigger__Subject}}
  └─ Pattern: \$([0-9,]+\.[0-9]{2})

Action 3: Slack - Send Channel Message
  └─ Channel: #finance
  └─ Message: New invoice from {{Trigger__From Name}}: ${{Formatter__Output}}
```

**Zapier best practices:**
- Use Formatter to clean/transform data
- Filter to prevent unnecessary actions (saves tasks)
- Paths for conditional logic (if/else)
- Delay to handle rate limits
- Error notifications to Slack/Email
- Test each step before activating

**Zapier limitations:**
- Max 100 steps per Zap (use sub-Zaps if needed)
- 15-minute polling interval (free/Starter plan)
- No self-hosting (cloud only)

See: references/zapier-cookbook.md

### Step 3: Make (Visual, Complex Flows)

**When to use Make (formerly Integromat):**
- Need visual workflow builder
- Complex branching logic (if/else, routers)
- Data transformation (aggregators, iterators)
- Budget: $9-$299/month (based on operations)

**Make terminology:**
- **Scenario:** Automated workflow
- **Module:** Individual app action
- **Router:** Branching logic (if/else)
- **Iterator:** Process array items one-by-one
- **Aggregator:** Combine multiple items into one

**Example scenario: Airtable → Router → Google Sheets/Slack**

```
Trigger: Airtable - Watch Records
  └─ Base: Sales CRM
  └─ Table: Leads
  └─ Filter: Status = "Qualified"

Router:
  ├─ Route 1 (High-value leads: Amount > $10,000)
  │   └─ Slack - Send Message (#sales-vip)
  │       └─ Message: "🔥 High-value lead: {{Name}} - ${{Amount}}"
  │
  └─ Route 2 (Standard leads: Amount ≤ $10,000)
      └─ Google Sheets - Add Row
          └─ Spreadsheet: Leads Pipeline
          └─ Row: {{Name}}, {{Email}}, {{Amount}}, {{Created}}
```

**Make advanced features:**

**Iterators (process arrays):**
```
Webhook → Parse JSON → Iterator → Send Email (one per item)
```

**Aggregators (combine items):**
```
Google Sheets (get rows) → Aggregator → Send single email with all rows
```

**Error handlers:**
```
HTTP Request → (on error) → Slack notification + Rollback
```

**Make best practices:**
- Use Routers for conditional logic
- Iterators for array processing
- Aggregators to combine data
- Error handlers on every critical module
- Commit/Rollback for database operations
- Test with sample data before activating

See: references/make-cookbook.md

### Step 4: Custom Scripts (Python/Node.js)

**When to use custom scripts:**
- Need full control over logic
- Complex data transformations
- API rate limit management
- Multi-step error handling
- Budget: Free (self-hosted)

**Python automation template:**

```python
# automation.py - Generic workflow automation

import os
import requests
import json
from datetime import datetime

# Load credentials from environment
SLACK_WEBHOOK = os.getenv('SLACK_WEBHOOK_URL')
AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE = os.getenv('AIRTABLE_BASE_ID')

def fetch_airtable_records(table_name, filter_formula=None):
    """Fetch records from Airtable with optional filter."""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE}/{table_name}"
    headers = {"Authorization": f"Bearer {AIRTABLE_API_KEY}"}
    params = {"filterByFormula": filter_formula} if filter_formula else {}
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()['records']

def send_slack_message(channel, message):
    """Send message to Slack via webhook."""
    payload = {
        "channel": channel,
        "text": message,
        "username": "Automation Bot"
    }
    response = requests.post(SLACK_WEBHOOK, json=payload)
    response.raise_for_status()

def process_new_leads():
    """Main workflow: Check new leads and notify Slack."""
    try:
        # Fetch qualified leads from last 24 hours
        filter_formula = "AND({Status}='Qualified', {Created} > DATEADD(NOW(), -1, 'days'))"
        leads = fetch_airtable_records("Leads", filter_formula)
        
        if not leads:
            print("No new leads found")
            return
        
        # Process each lead
        for lead in leads:
            name = lead['fields'].get('Name', 'Unknown')
            email = lead['fields'].get('Email', 'No email')
            amount = lead['fields'].get('Amount', 0)
            
            # Send Slack notification
            message = f"🎯 New qualified lead: {name} ({email}) - ${amount:,.2f}"
            send_slack_message("#sales", message)
            
            print(f"Processed: {name}")
        
        print(f"✅ Successfully processed {len(leads)} leads")
        
    except requests.exceptions.RequestException as e:
        # Error handling: Log and notify
        error_message = f"❌ Automation failed: {str(e)}"
        send_slack_message("#ops-alerts", error_message)
        raise

if __name__ == "__main__":
    process_new_leads()
```

**Run via cron (schedule):**

```bash
# crontab -e
# Run every hour
0 * * * * /usr/bin/python3 /path/to/automation.py >> /var/log/automation.log 2>&1

# Or use GitHub Actions (cloud scheduler)
```

**Node.js automation template:**

```javascript
// automation.js
const axios = require('axios');
require('dotenv').config();

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;

async function fetchAirtableRecords(tableName, filterFormula) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableName}`;
  const headers = { Authorization: `Bearer ${AIRTABLE_API_KEY}` };
  const params = filterFormula ? { filterByFormula: filterFormula } : {};

  const response = await axios.get(url, { headers, params });
  return response.data.records;
}

async function sendSlackMessage(channel, message) {
  await axios.post(SLACK_WEBHOOK, {
    channel,
    text: message,
    username: 'Automation Bot'
  });
}

async function processNewLeads() {
  try {
    // Fetch qualified leads from last 24 hours
    const filterFormula = "AND({Status}='Qualified', {Created} > DATEADD(NOW(), -1, 'days'))";
    const leads = await fetchAirtableRecords('Leads', filterFormula);

    if (leads.length === 0) {
      console.log('No new leads found');
      return;
    }

    // Process each lead
    for (const lead of leads) {
      const { Name, Email, Amount } = lead.fields;
      const message = `🎯 New qualified lead: ${Name} (${Email}) - $${Amount.toLocaleString()}`;
      
      await sendSlackMessage('#sales', message);
      console.log(`Processed: ${Name}`);
    }

    console.log(`✅ Successfully processed ${leads.length} leads`);
  } catch (error) {
    // Error handling
    const errorMessage = `❌ Automation failed: ${error.message}`;
    await sendSlackMessage('#ops-alerts', errorMessage);
    throw error;
  }
}

processNewLeads();
```

**Deployment options:**
- Cron job (Linux server)
- GitHub Actions (free, cloud-based)
- Vercel/Netlify Functions (serverless)
- AWS Lambda (serverless, pay-per-use)

See: references/custom-scripts.md for 30+ templates

## Common Workflow Patterns

### Pattern 1: Email → Parse → Database

**Use case:** Extract data from emails, store in CRM

```
Gmail (New Email) 
  → Regex/AI Parser (extract fields) 
  → Airtable/Notion (create record)
  → Slack (notify team)
```

### Pattern 2: Form → Approval → Action

**Use case:** Expense approval workflow

```
Typeform (New Submission)
  → Slack (send approval request)
  → Wait for approval (interactive button)
  → If approved: QuickBooks (create expense)
  → If rejected: Email (notify requester)
```

### Pattern 3: Scheduled Report

**Use case:** Daily sales report

```
Schedule (Daily 9am)
  → Airtable (get yesterday's sales)
  → Google Sheets (update dashboard)
  → Email (send report to team)
```

### Pattern 4: Multi-Source Aggregation

**Use case:** Social media monitoring

```
Twitter API (new mentions)
  ↓
Reddit API (new posts)  → Aggregator → Sentiment Analysis → Slack
  ↓
Facebook API (comments)
```

See: references/workflow-patterns.md for 50+ patterns

## Error Handling & Recovery

**Best practices:**

1. **Retry logic** (handle transient failures)
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def call_api():
    response = requests.get(API_URL)
    response.raise_for_status()
    return response.json()
```

2. **Error notifications** (Slack, email, PagerDuty)
```javascript
try {
  await runWorkflow();
} catch (error) {
  await sendSlackMessage('#ops-alerts', `❌ Workflow failed: ${error.message}`);
  throw error;
}
```

3. **Rollback on failure** (undo partial changes)
```python
try:
    record_id = create_airtable_record(data)
    send_email(data['email'])
except Exception as e:
    delete_airtable_record(record_id)  # Rollback
    raise
```

4. **Dead letter queue** (log failed items for manual review)
```python
try:
    process_item(item)
except Exception as e:
    log_to_failed_items_table(item, str(e))
```


## References
- `references/monitoring-debugging.md` — Monitoring & Debugging
