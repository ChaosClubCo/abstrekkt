---
name: sentry-monitoring
description: Comprehensive error tracking, performance monitoring, and alerting with Sentry. Covers SDK integration, issue triage, release tracking, and proactive monitoring strategies for production applications. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Sentry Monitoring

## Overview

Sentry monitoring provides comprehensive error tracking and performance monitoring for production applications. This skill covers the complete lifecycle of application observability, from initial SDK integration through advanced alerting and issue resolution workflows.

Effective error monitoring transforms reactive firefighting into proactive quality assurance. By implementing structured error tracking, teams gain visibility into production issues before users report them, understand the true impact of bugs through user session data, and prioritize fixes based on real-world frequency and severity.

This skill encompasses both technical implementation and operational excellence. Beyond basic SDK setup, it covers alert tuning to reduce noise, release tracking to correlate deployments with issues, and integration patterns that connect Sentry data to your broader development workflow.

### Why This Matters

- **Reduce MTTR**: Mean time to resolution drops significantly when errors include full context, stack traces, and reproduction steps
- **Prioritize effectively**: Event frequency and user impact data enables evidence-based bug prioritization
- **Prevent regressions**: Release tracking identifies new issues introduced by specific deployments
- **Improve user experience**: Performance monitoring surfaces slow transactions before they impact conversion
- **Enable accountability**: Clear ownership and routing ensures issues reach the right team immediately

## When to Use

### Primary Triggers

- "Set up error tracking for our application"
- "We need to monitor production errors"
- "Configure Sentry for our Next.js/React/Node project"
- "Create alerts for critical errors"
- "Track down a production bug"
- "Analyze error patterns"
- "Set up performance monitoring"

### Specific Use Cases

1. **New Project Setup**: Integrating Sentry SDK into a new or existing application
2. **Alert Configuration**: Creating intelligent alerts that reduce noise while catching critical issues
3. **Issue Triage**: Investigating and categorizing incoming errors for resolution
4. **Release Tracking**: Correlating deployments with error rates and regressions
5. **Performance Analysis**: Identifying slow transactions and optimization opportunities
6. **Compliance Monitoring**: Setting up data scrubbing and retention policies

## Core Processes

### Process 1: SDK Integration and Configuration

**Objective**: Properly integrate Sentry SDK with optimal configuration for your stack.

**Step 1: Determine Project Configuration**

```typescript
// Next.js / React Configuration
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment and Release Tracking
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION,

  // Sampling Configuration
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Error Filtering
  beforeSend(event, hint) {
    // Filter out known non-actionable errors
    const error = hint.originalException;
    if (error && error.message) {
      if (error.message.includes('ResizeObserver loop')) {
        return null;
      }
      if (error.message.includes('Network request failed')) {
        event.fingerprint = ['network-error'];
      }
    }
    return event;
  },

  // PII Scrubbing
  beforeSendTransaction(event) {
    // Remove sensitive data from transaction names
    if (event.transaction) {
      event.transaction = event.transaction.replace(/\/users\/\d+/, '/users/:id');
    }
    return event;
  },
});
```

**Step 2: Server-Side Configuration**

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,

  tracesSampleRate: 0.1,

  integrations: [
    Sentry.prismaIntegration(),
    Sentry.httpIntegration({
      tracing: true,
    }),
  ],

  // Capture unhandled promise rejections
  onUnhandledRejection: (reason, promise) => {
    Sentry.captureException(reason);
  },
});
```

**Step 3: Source Map Configuration**

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your existing Next.js config
};

module.exports = withSentryConfig(
  nextConfig,
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: true,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

### Process 2: Alert Configuration Strategy

**Objective**: Create alerts that catch critical issues without overwhelming the team.

**Alert Hierarchy**:

```yaml
# Critical Alerts (Immediate Response Required)
critical_alerts:
  - name: "Payment Processing Failures"
    conditions:
      - event_type: error
      - tags:
          feature: payments
          severity: critical
      - frequency: ">= 1 in 5 minutes"
    actions:
      - notify: pagerduty
      - notify: slack_critical

  - name: "Authentication System Down"
    conditions:
      - event_type: error
      - message_contains: ["auth", "login", "session"]
      - unique_users: ">= 10 in 10 minutes"
    actions:
      - notify: pagerduty
      - notify: engineering_leads

# Warning Alerts (Review Within Hours)
warning_alerts:
  - name: "Elevated Error Rate"
    conditions:
      - event_frequency: "> 200% of baseline"
      - time_window: 30 minutes
    actions:
      - notify: slack_engineering

  - name: "Performance Degradation"
    conditions:
      - transaction_duration: "> p95 by 50%"
      - affected_transactions: ">= 5"
    actions:
      - notify: slack_performance

# Informational (Daily Digest)
info_alerts:
  - name: "New Issue Types"
    conditions:
      - first_seen: true
      - event_count: ">= 5"
    actions:
      - add_to_digest: daily
```

**Alert Noise Reduction Strategies**:

```typescript
// Custom fingerprinting to reduce duplicate alerts
Sentry.init({
  beforeSend(event, hint) {
    // Group related network errors
    if (event.exception?.values?.[0]?.type === 'NetworkError') {
      event.fingerprint = ['network-error', event.request?.url?.split('?')[0]];
    }

    // Group validation errors by field
    if (event.tags?.error_type === 'validation') {
      event.fingerprint = ['validation-error', event.tags?.field];
    }

    return event;
  },
});
```

### Process 3: Issue Triage and Resolution

**Objective**: Efficiently categorize and resolve incoming issues.

**Triage Decision Matrix**:

| Impact Level | User Count | Business Impact | Response Time |
|--------------|------------|-----------------|---------------|
| Critical | 100+ | Revenue/Security | < 15 minutes |
| High | 50-100 | Core Feature | < 1 hour |
| Medium | 10-50 | Non-core Feature | < 4 hours |
| Low | < 10 | Edge Case | Next sprint |

**Issue Investigation Workflow**:

```markdown
## Issue Investigation Checklist

### 1. Initial Assessment
- [ ] Review error message and stack trace
- [ ] Check user count and frequency
- [ ] Identify affected browser/device/OS combinations
- [ ] Check if related to recent deployment

### 2. Context Gathering
- [ ] Review session replay (if available)
- [ ] Check breadcrumbs for user actions leading to error
- [ ] Examine request/response data
- [ ] Review custom context and tags

### 3. Reproduction
- [ ] Identify reproduction steps from session data
- [ ] Test in staging environment
- [ ] Confirm fix in development

### 4. Resolution
- [ ] Link to pull request
- [ ] Set "Resolve in next release"
- [ ] Add regression test
- [ ] Update monitoring if new pattern identified
```

### Process 4: Release Tracking and Regression Detection

**Objective**: Correlate deployments with error patterns to catch regressions early.

**Release Configuration**:

```yaml
# GitHub Actions - Release Tracking
name: Deploy with Sentry Release

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Create Sentry Release
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
        with:
          environment: production
          version: ${{ github.sha }}

      - name: Deploy Application
        run: |
          # Your deployment commands

      - name: Notify Sentry of Deploy
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
        with:
          environment: production
          version: ${{ github.sha }}
          set_commits: auto
          finalize: true
```

**Regression Detection Queries**:

```typescript
// Automated regression check post-deploy
async function checkForRegressions(releaseVersion: string) {
  const issues = await sentry.getIssues({
    query: `firstRelease:${releaseVersion} is:unresolved`,
    limit: 50,
  });

  if (issues.length > 0) {
    await notifyTeam({
      channel: 'deployments',
      message: `Warning: ${issues.length} new issues detected in ${releaseVersion}`,
      issues: issues.slice(0, 5).map(i => ({
        title: i.title,
        count: i.count,
        url: i.permalink,
      })),
    });
  }
}
```

### Process 5: Performance Monitoring Setup

**Objective**: Identify and resolve performance bottlenecks proactively.

**Transaction Tracing Configuration**:

```typescript
// Custom transaction instrumentation
import * as Sentry from "@sentry/nextjs";

export async function processOrder(orderId: string) {
  return Sentry.startSpan(
    {
      name: 'process-order',
      op: 'order.process',
      attributes: {
        orderId,
      },
    },
    async (span) => {
      // Validate order
      await Sentry.startSpan(
        { name: 'validate-order', op: 'order.validate' },
        async () => {
          await validateOrder(orderId);
        }
      );

      // Process payment
      await Sentry.startSpan(
        { name: 'process-payment', op: 'payment.process' },
        async () => {
          await processPayment(orderId);
        }
      );

      // Send confirmation
      await Sentry.startSpan(
        { name: 'send-confirmation', op: 'email.send' },
        async () => {
          await sendConfirmation(orderId);
        }
      );
    }
  );
}
```

**Performance Budgets**:

```yaml
performance_budgets:
  transactions:
    - name: "/api/checkout"
      p50: 500ms
      p95: 2000ms
      p99: 5000ms

    - name: "/api/search"
      p50: 200ms
      p95: 800ms
      p99: 1500ms

  web_vitals:
    LCP: 2500ms
    FID: 100ms
    CLS: 0.1
    TTFB: 800ms
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `search_issues` | Find issues by query | Investigating patterns |
| `get_issue_details` | Deep dive into specific issue | Root cause analysis |
| `analyze_issue_with_seer` | AI-powered root cause | Complex bugs |
| `search_events` | Query raw events | Performance analysis |
| `find_projects` | List available projects | Initial setup |
| `get_logs` | View service logs | Debug edge functions |

### Templates

**Error Boundary Template**:
```typescript
// ErrorBoundary.tsx
import * as Sentry from "@sentry/nextjs";

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      scope.setTag('boundary', this.props.name);
      Sentry.captureException(error);
    });
  }
}
```

**Weekly Error Review Template**:
```markdown
## Weekly Error Review - [Date]

### Summary
- Total events: X
- Unique issues: Y
- Users affected: Z

### Critical Issues Resolved
1. [Issue title] - Root cause and fix

### New Issues Requiring Attention
1. [Issue title] - Proposed action

### Performance Insights
- Slowest transaction: X (p95: Yms)
- Regression detected: Z
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Error Rate | < 0.1% of sessions | Weekly average |
| MTTR | < 4 hours for critical | Time from alert to resolution |
| Noise Ratio | < 20% of alerts | Non-actionable alerts |
| Coverage | 100% of services | Projects with Sentry |
| Performance P95 | < 2s for API calls | Transaction monitoring |

## Common Pitfalls

1. **Alert Fatigue**: Too many alerts lead to ignored alerts. Start strict, loosen gradually.
2. **Missing Context**: Errors without user context are hard to reproduce. Add custom context.
3. **PII Exposure**: Scrub sensitive data before sending to Sentry. Use beforeSend hooks.
4. **High Sampling**: 100% sampling in production is expensive. Use adaptive sampling.
5. **Ignoring Performance**: Error-only monitoring misses slow-but-working issues.

## Integration Points

- **CI/CD**: Release tracking with GitHub Actions, Vercel deployments
- **Incident Management**: PagerDuty, Opsgenie integration for critical alerts
- **Communication**: Slack notifications for team awareness
- **Issue Tracking**: Jira/Linear integration for bug assignment
- **APM**: Combine with distributed tracing for full observability
