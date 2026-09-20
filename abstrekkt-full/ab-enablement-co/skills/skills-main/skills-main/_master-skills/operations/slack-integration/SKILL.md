---
name: slack-integration
description: Helps automate and manage slack integration processes. Comprehensive Slack integration expertise covering bot development, webhooks, interactive components, app development, and workflow automation for team communication and productivity. Use when managing, optimizing, or automating operational workflows.
---

# Slack Integration

## Overview

Slack integration enables powerful team communication automation through bots, webhooks, and interactive applications. This skill covers the complete spectrum of Slack development, from simple webhook notifications to full-featured Slack apps with interactive components and event handling.

Effective Slack integration transforms passive notifications into interactive workflows that meet users where they work. Beyond simple message posting, modern Slack apps provide slash commands, modal dialogs, interactive buttons, and deep integration with business processes.

This skill provides patterns for building production-grade Slack integrations, including proper event handling, error recovery, and user experience best practices. The focus is on creating integrations that feel native to Slack while extending its capabilities for specific business needs.

### Why This Matters

- **Reduce context switching**: Bring workflows into Slack where teams already collaborate
- **Improve response times**: Real-time notifications ensure rapid awareness of critical events
- **Enable self-service**: Interactive commands let users trigger complex operations without leaving Slack
- **Enhance visibility**: Automated reporting keeps teams informed without manual updates
- **Streamline approvals**: Approval workflows in Slack accelerate decision-making

## When to Use

### Primary Triggers

- "Send notifications to Slack"
- "Build a Slack bot"
- "Create a slash command"
- "Add interactive buttons to Slack messages"
- "Set up approval workflows in Slack"
- "Integrate our app with Slack"
- "Build a Slack app for our team"

### Specific Use Cases

1. **Alerting**: Send alerts from monitoring systems to appropriate channels
2. **Slash Commands**: Custom commands for common operations
3. **Interactive Approvals**: Approval workflows with button interactions
4. **Bot Conversations**: Conversational interfaces for complex workflows
5. **Event Integration**: React to Slack events (reactions, messages, channel activity)
6. **Home Tab Apps**: Rich dashboard experiences within Slack

## Core Processes

### Process 1: Webhook Notifications

**Objective**: Send formatted notifications to Slack channels.

**Basic Webhook Implementation**:

```typescript
// lib/slack/webhook.ts
interface SlackWebhookOptions {
  webhookUrl: string;
  timeout?: number;
}

interface SlackMessage {
  text?: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
  unfurl_links?: boolean;
  unfurl_media?: boolean;
}

export class SlackWebhook {
  private webhookUrl: string;
  private timeout: number;

  constructor(options: SlackWebhookOptions) {
    this.webhookUrl = options.webhookUrl;
    this.timeout = options.timeout || 10000;
  }

  async send(message: SlackMessage): Promise<void> {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Slack webhook failed: ${response.status} - ${text}`);
    }
  }
}

// Usage example
const slack = new SlackWebhook({
  webhookUrl: process.env.SLACK_WEBHOOK_URL!,
});

// Rich notification
await slack.send({
  blocks: [
    {
      type: 'header',
      text: { type: 'plain_text', text: 'Deployment Successful' },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: '*Environment:*\nProduction' },
        { type: 'mrkdwn', text: '*Version:*\nv1.2.3' },
        { type: 'mrkdwn', text: '*Deployed by:*\n@john' },
        { type: 'mrkdwn', text: '*Time:*\n<!date^1234567890^{date_short_pretty} at {time}|Just now>' },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'View Deployment' },
          url: 'https://vercel.com/deployments/abc123',
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Rollback' },
          style: 'danger',
          action_id: 'rollback_deployment',
          value: 'deployment_abc123',
        },
      ],
    },
  ],
});
```

**Message Builder Utility**:

```typescript
// lib/slack/message-builder.ts
export class SlackMessageBuilder {
  private blocks: SlackBlock[] = [];
  private attachments: SlackAttachment[] = [];

  header(text: string): this {
    this.blocks.push({
      type: 'header',
      text: { type: 'plain_text', text, emoji: true },
    });
    return this;
  }

  section(text: string): this {
    this.blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text },
    });
    return this;
  }

  fields(fields: Record<string, string>): this {
    this.blocks.push({
      type: 'section',
      fields: Object.entries(fields).map(([label, value]) => ({
        type: 'mrkdwn',
        text: `*${label}:*\n${value}`,
      })),
    });
    return this;
  }

  divider(): this {
    this.blocks.push({ type: 'divider' });
    return this;
  }

  actions(...buttons: Array<{ text: string; actionId: string; style?: 'primary' | 'danger'; value?: string }>): this {
    this.blocks.push({
      type: 'actions',
      elements: buttons.map(btn => ({
        type: 'button',
        text: { type: 'plain_text', text: btn.text, emoji: true },
        action_id: btn.actionId,
        style: btn.style,
        value: btn.value,
      })),
    });
    return this;
  }

  context(...items: string[]): this {
    this.blocks.push({
      type: 'context',
      elements: items.map(text => ({ type: 'mrkdwn', text })),
    });
    return this;
  }

  image(url: string, altText: string, title?: string): this {
    this.blocks.push({
      type: 'image',
      image_url: url,
      alt_text: altText,
      title: title ? { type: 'plain_text', text: title } : undefined,
    });
    return this;
  }

  build(): { blocks: SlackBlock[] } {
    return { blocks: this.blocks };
  }
}

// Usage
const message = new SlackMessageBuilder()
  .header('New Order Received')
  .fields({
    'Order ID': '#12345',
    'Customer': 'Acme Corp',
    'Amount': '$1,234.56',
    'Items': '5 products',
  })
  .divider()
  .actions(
    { text: 'Approve', actionId: 'approve_order', style: 'primary', value: '12345' },
    { text: 'Reject', actionId: 'reject_order', style: 'danger', value: '12345' }
  )
  .context('Received at <!date^1234567890^{date_short} {time}|just now>')
  .build();
```

### Process 2: Slack Bot with Bolt Framework

**Objective**: Build a full-featured Slack bot with commands and interactions.

**Bot Setup**:

```typescript
// app/slack/bot.ts
import { App, LogLevel } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.INFO,
});

// Slash command handler
app.command('/deploy', async ({ command, ack, respond, client }) => {
  await ack();

  const [environment, version] = command.text.split(' ');

  if (!environment || !version) {
    await respond({
      response_type: 'ephemeral',
      text: 'Usage: /deploy <environment> <version>',
    });
    return;
  }

  // Show modal for confirmation
  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'deploy_confirm',
      private_metadata: JSON.stringify({ environment, version, channel: command.channel_id }),
      title: { type: 'plain_text', text: 'Confirm Deployment' },
      submit: { type: 'plain_text', text: 'Deploy' },
      close: { type: 'plain_text', text: 'Cancel' },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `You are about to deploy *v${version}* to *${environment}*`,
          },
        },
        {
          type: 'input',
          block_id: 'notes_block',
          optional: true,
          element: {
            type: 'plain_text_input',
            action_id: 'notes_input',
            multiline: true,
            placeholder: { type: 'plain_text', text: 'Optional deployment notes...' },
          },
          label: { type: 'plain_text', text: 'Notes' },
        },
      ],
    },
  });
});

// Modal submission handler
app.view('deploy_confirm', async ({ ack, view, client, body }) => {
  await ack();

  const { environment, version, channel } = JSON.parse(view.private_metadata);
  const notes = view.state.values.notes_block?.notes_input?.value || '';
  const userId = body.user.id;

  // Post deployment start message
  const result = await client.chat.postMessage({
    channel,
    text: `Deployment started by <@${userId}>`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:rocket: *Deployment Started*\n*Environment:* ${environment}\n*Version:* v${version}\n*Initiated by:* <@${userId}>`,
        },
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: notes ? `_Notes: ${notes}_` : '_No notes provided_' },
        ],
      },
    ],
  });

  // Trigger actual deployment (async)
  triggerDeployment({
    environment,
    version,
    userId,
    messageTs: result.ts,
    channel,
  });
});

// Button interaction handler
app.action('approve_order', async ({ ack, body, client, action }) => {
  await ack();

  const orderId = (action as any).value;
  const userId = body.user.id;

  // Process approval
  await approveOrder(orderId, userId);

  // Update the original message
  await client.chat.update({
    channel: body.channel!.id,
    ts: (body as any).message.ts,
    blocks: [
      ...(body as any).message.blocks.slice(0, -1), // Keep all but actions block
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `:white_check_mark: Approved by <@${userId}>` },
        ],
      },
    ],
  });
});

// Message event handler
app.message(/help|support/i, async ({ message, say }) => {
  await say({
    text: 'How can I help you?',
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Here are some things I can help with:' },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '• `/deploy <env> <version>` - Deploy to an environment\n• `/status` - Check deployment status\n• `/rollback` - Rollback to previous version',
        },
      },
    ],
  });
});

// Start the app
(async () => {
  await app.start();
  console.log('Slack bot is running');
})();
```


## References
- `references/process-3-interactive-approval-workflows.md` — Process 3: Interactive Approval Workflows
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
