# INTINC Connect - MS Teams Webhook Notification Schema

## Overview

This document defines the webhook notification schemas for integrating INTINC Connect with Microsoft Teams. All notifications use the **Adaptive Cards** format (preferred) or **MessageCard** format (legacy but widely supported).

---

## Table of Contents

1. [Setup Requirements](#setup-requirements)
2. [Webhook Types](#webhook-types)
3. [Notification Schemas](#notification-schemas)
4. [Implementation Guide](#implementation-guide)
5. [Error Handling](#error-handling)

---

## Setup Requirements

### Creating an Incoming Webhook in Teams

1. Navigate to the Teams channel → **⋯ More options** → **Connectors**
2. Search for **Incoming Webhook** → Click **Configure**
3. Name: `INTINC Connect Bot`
4. Upload icon: Use INTINC Dot favicon
5. Copy the webhook URL → Store securely as `TEAMS_WEBHOOK_URL`

### Required Environment Variables

```bash
# Primary channel webhooks
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/xxx/IncomingWebhook/xxx
TEAMS_WEBHOOK_HR_CHANNEL=https://outlook.office.com/webhook/xxx/IncomingWebhook/xxx
TEAMS_WEBHOOK_CELEBRATIONS=https://outlook.office.com/webhook/xxx/IncomingWebhook/xxx

# Direct message webhook (requires Power Automate or Graph API)
TEAMS_GRAPH_CLIENT_ID=xxx
TEAMS_GRAPH_CLIENT_SECRET=xxx
TEAMS_GRAPH_TENANT_ID=xxx
```

---

## Webhook Types

| Type | Channel | Trigger | Priority |
|------|---------|---------|----------|
| Recognition Posted | #general or #kudos | New peer recognition | P0 |
| New Hire Welcome | #general | Employee onboarding | P0 |
| Birthday/Anniversary | #celebrations | Daily milestone check | P1 |
| Survey Launch | #hr-announcements | New survey created | P1 |
| Survey Reminder | DM to user | Survey incomplete | P2 |
| Wellness Challenge | #wellness | Challenge start/end | P2 |
| HR Alert | #hr-private | Inactive user, risk flag | P1 |
| System Alert | #ops-alerts | Errors, downtime | P0 |

---

## Notification Schemas

### 1. Recognition Posted

**Trigger:** When an employee gives recognition to another employee

```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "6366F1",
  "summary": "New Recognition: {sender_name} → {recipient_name}",
  "sections": [
    {
      "activityTitle": "🌟 {sender_name} recognized {recipient_name}!",
      "activitySubtitle": "{recognition_message}",
      "activityImage": "{sender_avatar_url}",
      "facts": [
        { "name": "Points", "value": "+{points} 🎁" },
        { "name": "Category", "value": "{category}" },
        { "name": "Tags", "value": "{tags_comma_separated}" }
      ],
      "markdown": true
    }
  ],
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": "👏 Add to Recognition",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/recognition/{recognition_id}"
        }
      ]
    },
    {
      "@type": "OpenUri",
      "name": "Give Your Own Recognition",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/recognition/new"
        }
      ]
    }
  ]
}
```

**TypeScript Interface:**

```typescript
interface RecognitionNotification {
  recognition_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar_url?: string;
  recipient_id: string;
  recipient_name: string;
  message: string;
  points: number;
  category: 'kudos' | 'achievement' | 'teamwork' | 'innovation' | 'client_success';
  tags: string[];
  visibility: 'public' | 'department' | 'private';
  created_at: string; // ISO 8601
}
```

---

### 2. New Hire Welcome

**Trigger:** When a new employee is added to the system

```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "10B981",
  "summary": "Welcome {full_name} to INTINC!",
  "sections": [
    {
      "activityTitle": "🎉 New Team Member Alert!",
      "activitySubtitle": "Please join us in welcoming {first_name} {last_name} to the {department} team!",
      "activityImage": "https://intinc.com/wp-content/uploads/2024/11/Dot-favicon.png",
      "facts": [
        { "name": "Name", "value": "{full_name}" },
        { "name": "Department", "value": "{department}" },
        { "name": "Start Date", "value": "{start_date}" },
        { "name": "Manager", "value": "{manager_name}" },
        { "name": "Location", "value": "{location}" }
      ],
      "markdown": true
    },
    {
      "text": "💡 **Pro tip:** Send {first_name} a welcome message in INTINC Connect to help them feel at home!"
    }
  ],
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": "👋 Send Welcome Recognition",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/recognition/new?recipient={employee_id}&template=welcome"
        }
      ]
    },
    {
      "@type": "OpenUri",
      "name": "View Profile",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/employees/{employee_id}"
        }
      ]
    }
  ]
}
```

**TypeScript Interface:**

```typescript
interface NewHireNotification {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  start_date: string; // YYYY-MM-DD
  manager_id: string;
  manager_name: string;
  manager_email: string;
  location?: string;
  role_title?: string;
  onboarding_id: string;
}
```

---

### 3. Birthday/Anniversary Celebration

**Trigger:** Daily cron job at 8 AM

```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "{color_based_on_type}",
  "summary": "{celebration_type}: {employee_name}",
  "sections": [
    {
      "activityTitle": "{emoji} {celebration_headline}",
      "activitySubtitle": "{celebration_message}",
      "activityImage": "https://intinc.com/wp-content/uploads/2024/11/Dot-favicon.png",
      "facts": [
        { "name": "Celebrating", "value": "{full_name}" },
        { "name": "Department", "value": "{department}" },
        { "name": "Points Awarded", "value": "{points} 🎁" }
      ],
      "markdown": true
    }
  ],
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": "🎉 Send Celebration Message",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/recognition/new?recipient={employee_id}&occasion={celebration_type}"
        }
      ]
    }
  ]
}
```

**Color Codes by Celebration Type:**

| Type | Theme Color | Emoji |
|------|-------------|-------|
| Birthday | `#FF6B6B` | 🎂 |
| 1-Year Anniversary | `#4ECDC4` | 🎊 |
| 2-4 Year Anniversary | `#45B7D1` | 🌟 |
| 5-9 Year Anniversary | `#96CEB4` | 🏅 |
| 10+ Year Anniversary | `#FFD93D` | 🏆 |

**TypeScript Interface:**

```typescript
interface CelebrationNotification {
  employee_id: string;
  first_name: string;
  last_name: string;
  department: string;
  celebration_type: 'birthday' | 'anniversary';
  years_at_company?: number; // For anniversaries
  celebration_message: string;
  points_awarded: number;
  celebration_id: string;
}
```

---

### 4. Survey Launch Announcement

**Trigger:** When HR creates a new survey

```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "8B5CF6",
  "summary": "New Survey: {survey_name}",
  "sections": [
    {
      "activityTitle": "📋 New Survey Available!",
      "activitySubtitle": "{survey_name}",
      "activityImage": "https://intinc.com/wp-content/uploads/2024/11/Dot-favicon.png",
      "facts": [
        { "name": "Description", "value": "{survey_description}" },
        { "name": "Estimated Time", "value": "{estimated_minutes} minutes" },
        { "name": "Deadline", "value": "{deadline_date}" },
        { "name": "Target Audience", "value": "{target_audience}" }
      ],
      "markdown": true
    },
    {
      "text": "🔒 **Reminder:** All responses are anonymous. Results are only visible after 5+ submissions."
    }
  ],
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": "Take Survey Now →",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/surveys/{survey_id}"
        }
      ]
    }
  ]
}
```

**TypeScript Interface:**

```typescript
interface SurveyLaunchNotification {
  survey_id: string;
  survey_name: string;
  survey_description: string;
  estimated_minutes: number;
  deadline: string; // ISO 8601
  target_audience: 'all' | 'department' | 'team' | 'role';
  target_filter?: string; // Department name, team ID, etc.
  created_by: string;
  is_anonymous: boolean;
  min_responses_for_results: number;
}
```

---

### 5. HR Alert (Private Channel)

**Trigger:** Various HR-relevant events

```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "{priority_color}",
  "summary": "HR Alert: {alert_type}",
  "sections": [
    {
      "activityTitle": "{priority_emoji} {alert_title}",
      "activitySubtitle": "{alert_message}",
      "facts": [
        { "name": "Employee", "value": "{employee_name}" },
        { "name": "Department", "value": "{department}" },
        { "name": "Manager", "value": "{manager_name}" },
        { "name": "Alert Type", "value": "{alert_type}" },
        { "name": "Priority", "value": "{priority}" },
        { "name": "Details", "value": "{additional_details}" }
      ],
      "markdown": true
    },
    {
      "text": "**Suggested Action:** {suggested_action}"
    }
  ],
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": "View in HR Dashboard",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/hr/alerts/{alert_id}"
        }
      ]
    },
    {
      "@type": "OpenUri",
      "name": "View Employee Profile",
      "targets": [
        {
          "os": "default",
          "uri": "{INTINC_CONNECT_URL}/hr/employees/{employee_id}"
        }
      ]
    }
  ]
}
```

**Alert Types & Priority Colors:**

| Alert Type | Priority | Color | Emoji |
|------------|----------|-------|-------|
| `inactive_user` | Medium | `#F59E0B` | ⚠️ |
| `inactive_user_30_days` | High | `#EF4444` | 🚨 |
| `low_engagement_score` | Medium | `#F59E0B` | 📉 |
| `negative_survey_sentiment` | High | `#EF4444` | 😟 |
| `recognition_imbalance` | Low | `#3B82F6` | ℹ️ |
| `burnout_risk` | High | `#EF4444` | 🔥 |

**TypeScript Interface:**

```typescript
interface HRAlertNotification {
  alert_id: string;
  alert_type: 'inactive_user' | 'low_engagement' | 'negative_sentiment' | 'burnout_risk' | 'recognition_imbalance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  employee_id: string;
  employee_name: string;
  department: string;
  manager_id: string;
  manager_name: string;
  alert_message: string;
  suggested_action: string;
  additional_details: Record<string, any>;
  created_at: string;
}
```

---

### 6. System/Error Alert

**Trigger:** System errors, API failures, downtime

```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "DC2626",
  "summary": "⚠️ System Alert: {error_type}",
  "sections": [
    {
      "activityTitle": "🚨 INTINC Connect System Alert",
      "activitySubtitle": "{error_message}",
      "facts": [
        { "name": "Error Type", "value": "{error_type}" },
        { "name": "Service", "value": "{affected_service}" },
        { "name": "Timestamp", "value": "{timestamp}" },
        { "name": "Error Code", "value": "{error_code}" },
        { "name": "Request ID", "value": "{request_id}" }
      ],
      "markdown": true
    },
    {
      "text": "**Stack Trace (truncated):**\n```\n{stack_trace_preview}\n```"
    }
  ],
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": "View in Datadog",
      "targets": [
        {
          "os": "default",
          "uri": "{DATADOG_URL}/logs?query={request_id}"
        }
      ]
    },
    {
      "@type": "OpenUri",
      "name": "View in PostHog",
      "targets": [
        {
          "os": "default",
          "uri": "{POSTHOG_URL}/events?eventType={error_type}"
        }
      ]
    }
  ]
}
```

---

## Implementation Guide

### Node.js/TypeScript Helper

```typescript
// teams-webhook.ts
import axios from 'axios';

interface TeamsWebhookConfig {
  webhookUrl: string;
  defaultThemeColor?: string;
}

interface MessageCardPayload {
  '@type': 'MessageCard';
  '@context': string;
  themeColor: string;
  summary: string;
  sections: Array<{
    activityTitle?: string;
    activitySubtitle?: string;
    activityImage?: string;
    facts?: Array<{ name: string; value: string }>;
    text?: string;
    markdown?: boolean;
  }>;
  potentialAction?: Array<{
    '@type': string;
    name: string;
    targets: Array<{ os: string; uri: string }>;
  }>;
}

export class TeamsWebhook {
  private webhookUrl: string;
  private defaultThemeColor: string;

  constructor(config: TeamsWebhookConfig) {
    this.webhookUrl = config.webhookUrl;
    this.defaultThemeColor = config.defaultThemeColor || '6366F1';
  }

  async send(payload: MessageCardPayload): Promise<void> {
    try {
      const response = await axios.post(this.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000, // 10 second timeout
      });

      if (response.status !== 200) {
        throw new Error(`Teams webhook failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Teams webhook error:', error);
      throw error;
    }
  }

  async sendRecognition(data: RecognitionNotification): Promise<void> {
    const payload: MessageCardPayload = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: '6366F1',
      summary: `New Recognition: ${data.sender_name} → ${data.recipient_name}`,
      sections: [
        {
          activityTitle: `🌟 ${data.sender_name} recognized ${data.recipient_name}!`,
          activitySubtitle: data.message,
          activityImage: data.sender_avatar_url,
          facts: [
            { name: 'Points', value: `+${data.points} 🎁` },
            { name: 'Category', value: data.category },
            { name: 'Tags', value: data.tags.join(', ') },
          ],
          markdown: true,
        },
      ],
      potentialAction: [
        {
          '@type': 'OpenUri',
          name: '👏 View Recognition',
          targets: [
            {
              os: 'default',
              uri: `${process.env.INTINC_CONNECT_URL}/recognition/${data.recognition_id}`,
            },
          ],
        },
      ],
    };

    await this.send(payload);
  }

  // Add similar methods for other notification types...
}

// Usage example
const teamsWebhook = new TeamsWebhook({
  webhookUrl: process.env.TEAMS_WEBHOOK_URL!,
});

await teamsWebhook.sendRecognition({
  recognition_id: 'rec_123',
  sender_id: 'emp_456',
  sender_name: 'Jane Smith',
  recipient_id: 'emp_789',
  recipient_name: 'John Doe',
  message: 'Great job on the Q4 security audit! Your attention to detail saved us from a potential vulnerability.',
  points: 50,
  category: 'achievement',
  tags: ['security', 'Q4', 'audit'],
  visibility: 'public',
  created_at: new Date().toISOString(),
});
```

---

## Error Handling

### Retry Logic

```typescript
async function sendWithRetry(
  webhookUrl: string,
  payload: MessageCardPayload,
  maxRetries = 3
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await axios.post(webhookUrl, payload, {
        timeout: 10000,
      });
      return; // Success
    } catch (error) {
      if (attempt === maxRetries) {
        // Log to Datadog/PostHog
        console.error(`Teams webhook failed after ${maxRetries} attempts:`, error);
        throw error;
      }
      // Exponential backoff: 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }
}
```

### Common Error Codes

| HTTP Status | Cause | Fix |
|-------------|-------|-----|
| 400 | Invalid payload format | Validate JSON structure, check for missing required fields |
| 401 | Invalid/expired webhook URL | Regenerate webhook URL in Teams |
| 429 | Rate limited | Implement exponential backoff, batch notifications |
| 500 | Teams service error | Retry with backoff |
| 504 | Timeout | Retry, consider smaller payload |

---

## Rate Limits & Best Practices

- **Rate Limit:** ~4 messages/second per webhook
- **Payload Size:** Max 28 KB
- **Batch similar notifications** (e.g., daily digest instead of per-event)
- **Use different channels** for different notification types
- **Respect quiet hours** (avoid notifications outside business hours)
- **Allow user preferences** for notification opt-out

---

## Security Considerations

1. **Store webhook URLs in environment variables** - never hardcode
2. **Validate all input data** before sending to Teams
3. **Sanitize user-generated content** to prevent injection
4. **Use HTTPS only** for webhook URLs
5. **Rotate webhooks periodically** (quarterly recommended)
6. **Monitor for abuse** - unusual notification volumes

---

*Last updated: November 25, 2025*
*Version: 1.0.0*
