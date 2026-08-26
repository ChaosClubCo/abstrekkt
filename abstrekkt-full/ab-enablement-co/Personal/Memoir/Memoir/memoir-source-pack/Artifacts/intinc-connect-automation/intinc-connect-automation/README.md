# INTINC Connect - Automation & Integration Package

> Employee Engagement Platform automation workflows, webhook schemas, and analytics tracking for INTINC's remote-first team.

![INTINC](https://intinc.com/wp-content/uploads/2024/11/Dot-favicon.png)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [n8n Workflows](#n8n-workflows)
- [MS Teams Integration](#ms-teams-integration)
- [PostHog Analytics](#posthog-analytics)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

This package contains the complete automation infrastructure for **INTINC Connect**, an employee engagement platform for INTINC's remote workforce.

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **n8n Workflows** | Onboarding, birthdays, thank-you, outreach | `/n8n-workflows/` |
| **MS Teams Schema** | Webhook notification formats | `/docs/ms-teams-webhook-schema.md` |
| **PostHog Plan** | Event tracking & analytics | `/docs/posthog-event-tracking-plan.md` |
| **Env Template** | All required environment variables | `/.env.example` |

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INTINC Connect (Base44)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │Recognition│   │ Surveys  │   │ Rewards  │   │ Wellness │            │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘            │
│       │              │              │              │                    │
│       └──────────────┴──────────────┴──────────────┘                    │
│                              │                                          │
│                         Webhooks                                        │
│                              │                                          │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │   n8n.io    │      │  MS Teams   │      │   PostHog   │
   │  Workflows  │      │  Webhooks   │      │  Analytics  │
   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
          │                    │                    │
          ├────────────────────┼────────────────────┤
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │    Gmail    │      │   Zapier    │      │   Datadog   │
   │   Emails    │      │  Webhooks   │      │    APM      │
   └─────────────┘      └─────────────┘      └─────────────┘
```

---

## Quick Start

### 1. Clone & Setup

```bash
# Create project directory
mkdir intinc-connect-automation
cd intinc-connect-automation

# Copy environment template
cp .env.example .env

# Fill in your credentials
nano .env
```

### 2. Import n8n Workflows

```bash
# Access n8n instance
open https://n8n.intinc.com

# Import each workflow JSON
# Settings → Import from File → Select workflow JSON
```

### 3. Configure MS Teams Webhooks

1. Go to Teams channel → **⋯** → **Connectors**
2. Add **Incoming Webhook**
3. Copy webhook URL to `.env`

### 4. Initialize PostHog

```bash
# Add to your app's initialization
npm install posthog-js posthog-node
```

---

## n8n Workflows

### Workflow Inventory

| File | Name | Trigger | Description |
|------|------|---------|-------------|
| `01-new-hire-onboarding.json` | New Hire Onboarding | Webhook | Creates employee, sends welcome email, posts to Teams |
| `02-birthday-anniversary-celebrations.json` | Birthday & Anniversary | Daily 8AM | Checks for milestones, posts celebrations |
| `03-thank-you-automation.json` | Thank You Automation | Recognition webhook | Notifies recipient, suggests thank-you message |
| `04-outreach-automation.json` | Outreach Automation | Weekly Monday 9AM | Survey reminders, engagement nudges, wellness check-ins |

### Importing Workflows

1. Open n8n dashboard
2. Click **Workflows** → **Import from File**
3. Select JSON file from `/n8n-workflows/`
4. Configure credentials (see below)
5. Activate workflow

### Required n8n Credentials

| Credential Type | Name | Used By |
|-----------------|------|---------|
| HTTP Header Auth | `INTINC Connect API` | All workflows |
| Gmail OAuth2 | `INTINC Gmail` | Email notifications |
| Generic HTTP | (inline) | Teams webhooks, PostHog |

### Webhook Endpoints

After importing, these webhooks will be available:

```
POST https://n8n.intinc.com/webhook/new-hire-webhook
POST https://n8n.intinc.com/webhook/recognition-created
```

---

## MS Teams Integration

### Documentation

Full schema documentation: [`/docs/ms-teams-webhook-schema.md`](docs/ms-teams-webhook-schema.md)

### Notification Types

| Type | Channel | Color |
|------|---------|-------|
| Recognition | #general | `#6366F1` (indigo) |
| New Hire | #general | `#10B981` (green) |
| Birthday | #celebrations | `#FF6B6B` (coral) |
| Anniversary | #celebrations | Varies by tenure |
| Survey | #hr-announcements | `#8B5CF6` (purple) |
| HR Alert | #hr-private | `#EF4444` (red) |
| System Alert | #ops-alerts | `#DC2626` (red) |

### Quick Test

```bash
# Test webhook with curl
curl -X POST "YOUR_TEAMS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": "6366F1",
    "summary": "Test Message",
    "sections": [{
      "activityTitle": "🧪 Test Notification",
      "activitySubtitle": "If you see this, Teams integration is working!"
    }]
  }'
```

---

## PostHog Analytics

### Documentation

Full tracking plan: [`/docs/posthog-event-tracking-plan.md`](docs/posthog-event-tracking-plan.md)

### Key Events

| Event | Category | Priority |
|-------|----------|----------|
| `recognition_sent` | Recognition | P0 |
| `survey_completed` | Surveys | P0 |
| `rewards_redeemed` | Rewards | P1 |
| `milestone_celebration_sent` | Milestones | P1 |
| `onboarding_completed` | Onboarding | P0 |

### Primary KPIs

| KPI | Target | PostHog Query |
|-----|--------|---------------|
| DAU | 60%+ | Unique users/day |
| Recognition Rate | 50%+ | Users who sent recognition/month |
| Survey Completion | 70%+ | `survey_completed` / `survey_viewed` |

### Quick Setup

```typescript
// Client-side initialization
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: true,
});

// Track event
posthog.capture('recognition_sent', {
  recognition_type: 'kudos',
  points_given: 25,
  recipient_department: 'Engineering',
});
```

---

## Environment Setup

### Required Services

| Service | Purpose | Signup |
|---------|---------|--------|
| n8n.io Cloud | Workflow automation | [n8n.io](https://n8n.io) |
| PostHog | Product analytics | [posthog.com](https://posthog.com) |
| Datadog | APM & logging | [datadoghq.com](https://datadoghq.com) |

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Core (Required)
INTINC_CONNECT_URL=https://connect.intinc.com
INTINC_CONNECT_API_KEY=ic_live_xxx

# MS Teams (Required)
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/xxx

# PostHog (Required)
POSTHOG_API_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx

# n8n (Required)
N8N_API_KEY=n8n_api_xxx

# AI Providers (At least one)
OPENAI_API_KEY=sk-xxx        # OR
ANTHROPIC_API_KEY=sk-ant-xxx # OR
GOOGLE_AI_API_KEY=AIza-xxx
```

---

## Deployment

### n8n Cloud

1. Create account at [n8n.io](https://n8n.io)
2. Import workflow JSONs
3. Configure credentials
4. Activate workflows

### Self-Hosted n8n

```yaml
# docker-compose.yml
version: '3'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.intinc.com
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.intinc.com/
    volumes:
      - ~/.n8n:/home/node/.n8n
```

### Base44 Webhooks

Configure these outgoing webhooks in Base44:

| Event | Webhook URL |
|-------|-------------|
| Employee Created | `https://n8n.intinc.com/webhook/new-hire-webhook` |
| Recognition Created | `https://n8n.intinc.com/webhook/recognition-created` |

---

## Troubleshooting

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Teams webhook 400 | Invalid JSON | Validate payload format |
| n8n timeout | Slow API response | Increase timeout settings |
| PostHog events missing | Wrong API key | Check `POSTHOG_API_KEY` |
| Emails not sending | Gmail OAuth expired | Re-authenticate OAuth |

### Debug Mode

```bash
# Enable verbose logging in n8n
export N8N_LOG_LEVEL=debug
export N8N_LOG_OUTPUT=console
```

### Support

- **Internal:** #ops-alerts on Teams
- **n8n:** [community.n8n.io](https://community.n8n.io)
- **PostHog:** [posthog.com/questions](https://posthog.com/questions)

---

## File Structure

```
intinc-connect-automation/
├── n8n-workflows/
│   ├── 01-new-hire-onboarding.json
│   ├── 02-birthday-anniversary-celebrations.json
│   ├── 03-thank-you-automation.json
│   └── 04-outreach-automation.json
├── docs/
│   ├── ms-teams-webhook-schema.md
│   └── posthog-event-tracking-plan.md
├── .env.example
└── README.md
```

---

## Changelog

### v1.0.0 (November 25, 2025)
- Initial release
- 4 n8n workflows (onboarding, birthdays, thank-you, outreach)
- MS Teams webhook schema (6 notification types)
- PostHog event tracking plan (50+ events)

---

## License

Internal use only. Property of INTINC.

---

*Built with 🎯 by INTINC Technology Team*
