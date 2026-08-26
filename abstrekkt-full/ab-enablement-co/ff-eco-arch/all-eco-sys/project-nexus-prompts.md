# PROJECT NEXUS: 7-Context-Engineered Prompt Chain
## Cloudflare-Optimized Developer Operations Dashboard

**Document Version:** 1.0  
**Created:** March 2026  
**Target Platform:** Cloudflare Pages + Workers + D1  
**Build Time Estimate:** 12-15 hours  
**Monthly Cost:** $35-50

---

## Executive Summary

This document contains 7 context-engineered prompts to build PROJECT NEXUS, a production-grade developer operations dashboard for SREs managing AI-powered systems. Each prompt is designed to be executed sequentially in Claude or other LLM tools to generate specific components.

**What This Builds:**
- Context-switching command center for 3 active projects
- Automated prompt regression testing (saves 30 min/deployment)
- Automated log analysis with anomaly detection (saves 30 min/day)
- CI/CD pipeline visualization with deployment safety checks
- AI-powered file organization system
- Real-time health monitoring dashboard

**Target User:** SRE managing INT-triage-ai-2.0, Server-Side Rate Limiting, and LLM Model Chaining POC

---

## Tech Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + TypeScript | Dashboard UI |
| Styling | Tailwind + shadcn/ui | Component library |
| Deployment | Cloudflare Pages | Static hosting |
| Backend | Cloudflare Workers | API routes |
| Database | Cloudflare D1 (SQLite) | Edge database |
| Storage | Cloudflare R2 | Test artifacts |
| AI | OpenAI GPT-4 + Claude | Testing + categorization |
| CI/CD | GitHub Actions | Automated testing |
| Alerts | Slack Webhooks | Notifications |

---

## PROMPT 1: Cloudflare D1 Database Schema Design

### Role
You are a Senior Database Architect specializing in edge computing databases, specifically Cloudflare D1 (SQLite). You have deep expertise in designing schemas for developer operations dashboards with high read throughput and efficient query patterns.

### Context
Building PROJECT NEXUS dashboard for an SRE managing 3 production systems. The dashboard must support:
- **Project tracking:** 3 active projects with real-time health metrics (error rate, latency, DB persistence)
- **Context snapshots:** Save/restore what user was working on (files, next steps, blockers)
- **Prompt regression testing:** Store test baselines (input/expected output/actual output) for 26 test cases
- **Alert rules:** Configurable thresholds for automated log analysis
- **File organization history:** Track Desktop file moves with AI suggestions
- **User preferences:** Dashboard settings (refresh rate, default views)

Database will be queried frequently (30-second polling) from Cloudflare Workers. Must be optimized for read-heavy workloads.

### Task
Design complete Cloudflare D1 (SQLite) database schema that supports all PROJECT NEXUS features across 5 tabs: Projects, Automation, Observability, Deployment, Files.

### Constraints
**D1/SQLite-Specific:**
- No JSONB type (use TEXT with JSON serialization)
- No UUID type (use TEXT for IDs, generate with crypto.randomUUID())
- No TIMESTAMPTZ (use INTEGER unix timestamps)
- No Row-Level Security (handle authorization in Workers code)
- Use AUTOINCREMENT for integer primary keys where appropriate
- Create explicit indexes for frequently queried columns
- Support for JSON functions: `json_extract()`, `json_array()`, etc.

**Performance Requirements:**
- Optimize for reads (10:1 read:write ratio)
- Support concurrent queries (multiple dashboard users)
- Efficient filtering by status, timestamp, project
- Fast lookups by primary key and common foreign keys

**Data Integrity:**
- Foreign key constraints where relationships exist
- CHECK constraints for enums (status values, severity levels)
- NOT NULL for required fields
- Default values for timestamps

### Output Format
Provide SQL DDL statements with this structure:

```sql
-- ============================================
-- TABLE: table_name
-- PURPOSE: [Describe what this table stores]
-- ============================================
CREATE TABLE table_name (
  id TEXT PRIMARY KEY,
  field1 TEXT NOT NULL,
  field2 INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for query optimization
CREATE INDEX idx_table_field ON table_name(field);

-- Sample seed data
INSERT INTO table_name (id, field1, field2) VALUES
  ('uuid-1', 'value1', 123),
  ('uuid-2', 'value2', 456);
```

For each table provide:
1. Table definition with comments explaining each column
2. All necessary indexes with justification
3. Sample seed data (at least 2 rows per table)
4. Trigger for updating `updated_at` timestamp

### Required Tables

**1. projects**
- Stores project metadata (name, status, health metrics)
- Status: 'healthy' | 'warning' | 'critical' | 'inactive'
- Metrics: JSON string containing `{errorRate: number, llmLatencyP95: number, dbPersistence: number}`
- Last worked timestamp, next step, blockers array (JSON)

**2. context_snapshots**
- Stores saved context for each project
- Project ID (foreign key)
- Snapshot name (e.g., "Working on env vars")
- Context data: JSON string with `{openFiles: string[], terminalCommands: string[], nextSteps: string[], notes: string}`

**3. prompt_test_baselines**
- Stores expected outputs for prompt regression tests
- Test name, input text, expected output (JSON), model version
- Active flag (to disable obsolete tests)

**4. prompt_test_results**
- Stores historical test run results
- Test baseline ID (foreign key), run timestamp, actual output (JSON)
- Pass/fail status, diff/similarity score
- Model version used for the test

**5. alert_rules**
- Configurable thresholds for automated alerts
- Rule name, condition (e.g., "error_rate"), operator (e.g., ">"), threshold value
- Time window (seconds), severity level
- Notification channels: JSON array `["slack", "email"]`
- Active flag

**6. alerts**
- Generated alerts from log analysis
- Rule ID (foreign key), severity, message, suggested action
- Triggered timestamp, resolved timestamp (nullable)
- Status: 'active' | 'resolved' | 'suppressed'

**7. file_moves**
- History of file organization operations
- Original path, new path, file name, file size
- AI suggestion reason, confidence score (0-100)
- Moved timestamp, undo flag

**8. user_preferences**
- Dashboard settings (single row for single-user MVP)
- Auto-refresh interval (seconds), default tab
- Theme preferences, notification settings (JSON)

**9. deployment_logs**
- Deployment history cache (populated from GitHub API)
- Project name, deployment ID, status, duration
- Commit SHA, branch, deployed timestamp
- Build logs URL

### Success Criteria
1. Schema supports all 5 dashboard tabs without future migrations
2. Queries execute in <50ms on D1 for typical dashboard loads
3. JSON columns are properly structured for efficient extraction
4. Indexes cover all common query patterns (status filters, time-based sorts)
5. Sample data demonstrates realistic use cases
6. Triggers maintain `updated_at` automatically

### Deliverables
1. Complete SQL schema (CREATE TABLE statements)
2. All indexes with comments explaining query optimization
3. Update triggers for timestamps
4. Comprehensive seed data (2-3 rows per table minimum)
5. Query examples for common operations (e.g., "Get all healthy projects", "Get unresolved alerts")

---

## PROMPT 2: React Project Card Component with Real-Time Metrics

### Role
You are a Senior React Developer specializing in production-grade dashboard components with real-time data visualization. You have expertise in TypeScript, Tailwind CSS, shadcn/ui, and optimizing component performance for frequent re-renders.

### Context
PROJECT NEXUS displays project cards on the main "Projects" tab. Each card provides at-a-glance visibility into project health for an SRE managing 3 production systems. The SRE needs to instantly answer: "Is everything healthy? What needs my attention right now?"

The card must display:
- **Visual status indicator:** Color-coded badge (healthy/warning/critical)
- **Key metrics:** Error rate %, LLM latency p95, DB persistence %
- **Context information:** Last worked timestamp, next step, current blockers
- **Quick actions:** Resume work, view logs, deploy buttons
- **Trend indicators:** Up/down arrows showing metric changes

Data is fetched from Cloudflare Workers API endpoint (`/api/projects`) which queries D1 database. Components poll every 30 seconds for updates (no WebSocket for MVP).

### Task
Build a production-ready `ProjectCard` React component that displays real-time project status and metrics with clean, dashboard-appropriate UI.

### Input Data Structure
```typescript
interface Project {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'inactive';
  metrics: {
    errorRate: number;        // 0-100 (percentage)
    llmLatencyP95: number;    // milliseconds
    dbPersistence: number;    // 0-100 (percentage)
  };
  lastWorked: number;         // Unix timestamp
  nextStep: string;
  blockers: string[];
  updatedAt: number;          // Unix timestamp
}
```

### Component Requirements

**Visual Design:**
- Use shadcn/ui `Card` component as base
- Dark mode compatible (default)
- Status badge with icon: 🟢 Healthy / 🟡 Warning / 🔴 Critical / ⚪ Inactive
- Metrics displayed as compact stat cards with trend indicators
- Responsive: Stack vertically on mobile (<768px), grid on desktop

**Status Determination Logic:**
```typescript
// Define thresholds
const getStatus = (metrics: Metrics): Status => {
  if (metrics.errorRate > 0.5) return 'critical';
  if (metrics.errorRate > 0.1) return 'warning';
  if (metrics.llmLatencyP95 > 2000) return 'warning';
  if (metrics.llmLatencyP95 > 3000) return 'critical';
  if (metrics.dbPersistence < 98) return 'warning';
  if (metrics.dbPersistence < 95) return 'critical';
  return 'healthy';
};
```

**Data Fetching Pattern:**
```typescript
// Polling every 30 seconds
useEffect(() => {
  const fetchProjects = async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    setProjects(data);
  };
  
  fetchProjects(); // Initial load
  const interval = setInterval(fetchProjects, 30000);
  return () => clearInterval(interval);
}, []);
```

**Interaction Behaviors:**
- Clicking card expands detail modal (not included in this component)
- "Resume Work" button loads context snapshot (future integration)
- "View Logs" opens external logging dashboard
- "Deploy" button shows deployment checklist modal

**Accessibility:**
- ARIA labels for status badges and metrics
- Keyboard navigation (tab through buttons)
- Color is not the only indicator (use icons + text)
- Screen reader announces status changes

### Output Format

Provide complete implementation with these files:

**1. Component Code (`ProjectCard.tsx`):**
```typescript
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// ... other imports

interface ProjectCardProps {
  project: Project;
  onResume: (projectId: string) => void;
  onViewLogs: (projectId: string) => void;
  onDeploy: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onResume,
  onViewLogs,
  onDeploy
}) => {
  // Component implementation
};
```

**2. Utility Functions (`projectUtils.ts`):**
```typescript
export const getStatusColor = (status: Status): string => {
  // Return Tailwind color classes
};

export const formatTimestamp = (unixTime: number): string => {
  // Return relative time (e.g., "2 hours ago")
};

export const formatLatency = (ms: number): string => {
  // Return human-readable latency (e.g., "1.2s")
};
```

**3. Styling Guidance:**
- Use Tailwind utility classes (no custom CSS)
- Consistent spacing: `p-4` for card padding, `gap-4` for flex layouts
- Status badges: `Badge` component with variant mapping
- Metrics: Use `flex` with `justify-between` for label-value pairs
- Buttons: `Button` component, size="sm", variant based on action type

**4. Loading and Error States:**
```typescript
// Loading skeleton
{isLoading && <ProjectCardSkeleton />}

// Error state
{error && <ProjectCardError error={error} onRetry={refetch} />}

// No data state
{projects.length === 0 && <EmptyProjectsState />}
```

### Constraints
- Component must render in <16ms (60fps target)
- No prop drilling (use context if needed for deeply nested state)
- Memoize expensive computations (status calculation, time formatting)
- Handle stale data gracefully (show "Last updated" timestamp)
- Maximum bundle size contribution: 15KB (gzipped)

### Success Criteria
1. Component displays all required information clearly and concisely
2. Status badge accurately reflects project health based on metrics
3. Metrics are formatted for human readability (no raw numbers)
4. Timestamps show relative time ("2h ago") with tooltip showing absolute time
5. Component is fully responsive (mobile to desktop)
6. Loading states prevent layout shift
7. All interactive elements are keyboard accessible
8. TypeScript types are strict (no `any`)

### Deliverables
1. Complete `ProjectCard.tsx` component
2. Utility functions file (`projectUtils.ts`)
3. TypeScript interfaces/types file (`types.ts`)
4. Example usage code showing component in a grid layout
5. Test data generator (mock `Project` objects for development)

---

## PROMPT 3: Prompt Regression Test Suite with CI/CD Integration

### Role
You are a DevOps Engineer specializing in LLM testing automation and CI/CD pipeline integration. You have deep expertise in testing non-deterministic AI systems, GitHub Actions, and Cloudflare Workers.

### Context
INT-triage-ai-2.0 uses GPT-4 to classify customer support inquiries into triage categories. The system is production-critical and vulnerable to silent model updates that break classification behavior. Current process is manual: run 26 test cases, manually compare outputs, takes 30+ minutes.

**Critical Risk:** OpenAI can update models without notice. A subtle prompt behavior change could misclassify urgent issues as low-priority, impacting customer experience.

**Automation Goal:** 
- Automated test suite runs on every PR and daily at 6 AM (catch overnight model updates)
- Tests compare actual LLM output against stored baselines
- Fails CI/CD pipeline if regression detected (blocks deployment)
- Sends Slack alert with diff visualization on failure

### Task
Create a complete prompt regression test automation system deployable to Cloudflare Workers with GitHub Actions integration.

### System Architecture

**Components:**
1. **Test Runner (Cloudflare Worker):** Executes test suite on schedule or API trigger
2. **Test Baseline Storage (D1):** Stores expected outputs for each test case
3. **Result Storage (D1 + R2):** Stores test results with detailed diffs
4. **GitHub Actions Workflow:** Triggers tests on PR/merge
5. **Slack Notifier:** Sends formatted alerts on test failures

### Test Case Structure

```typescript
interface PromptTestCase {
  id: string;
  name: string;
  description: string;
  input: string;              // Customer inquiry text
  expectedOutput: {
    category: string;          // e.g., "Account Access"
    priority: 'low' | 'medium' | 'high' | 'critical';
    action: string;            // e.g., "Send password reset"
    confidence: number;        // 0-100
  };
  modelVersion: string;       // e.g., "gpt-4-turbo-2024-04-09"
  active: boolean;
  createdAt: number;
}

interface TestResult {
  testId: string;
  runId: string;
  timestamp: number;
  actualOutput: {
    category: string;
    priority: string;
    action: string;
    confidence: number;
  };
  passed: boolean;
  similarityScore: number;    // 0-100 (semantic similarity)
  diff: {
    category: boolean;        // true if matches expected
    priority: boolean;
    action: boolean;
    confidence: boolean;
  };
  executionTime: number;      // milliseconds
  modelVersion: string;
}
```

### Test Execution Logic

**1. Fetch Test Baselines from D1:**
```sql
SELECT * FROM prompt_test_baselines 
WHERE active = 1 
ORDER BY name;
```

**2. Execute Each Test (Parallel):**
```typescript
const runTest = async (testCase: PromptTestCase): Promise<TestResult> => {
  const prompt = `
You are a customer support triage AI. Classify this inquiry:

Inquiry: "${testCase.input}"

Respond with JSON only:
{
  "category": "string",
  "priority": "low|medium|high|critical",
  "action": "string",
  "confidence": number
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,  // Deterministic responses
      response_format: { type: 'json_object' }
    })
  });
  
  const data = await response.json();
  const actualOutput = JSON.parse(data.choices[0].message.content);
  
  return compareOutputs(testCase.expectedOutput, actualOutput);
};
```

**3. Compare Outputs (Fuzzy Matching):**
```typescript
const compareOutputs = (expected, actual): TestResult => {
  // Exact match for category and priority
  const categoryMatch = expected.category === actual.category;
  const priorityMatch = expected.priority === actual.priority;
  
  // Semantic similarity for action (use embeddings or string similarity)
  const actionSimilarity = calculateSimilarity(expected.action, actual.action);
  const actionMatch = actionSimilarity > 0.85; // 85% threshold
  
  // Confidence within ±10 points
  const confidenceMatch = Math.abs(expected.confidence - actual.confidence) <= 10;
  
  const passed = categoryMatch && priorityMatch && actionMatch && confidenceMatch;
  
  return {
    passed,
    diff: { categoryMatch, priorityMatch, actionMatch, confidenceMatch },
    similarityScore: (actionSimilarity * 100)
  };
};
```

**4. Store Results:**
- Write to D1 `prompt_test_results` table
- Upload detailed report to R2 as JSON: `test-results/{runId}.json`

### Cloudflare Worker Implementation

```typescript
// workers/prompt-test-runner.ts
export default {
  // Scheduled trigger (daily at 6 AM UTC)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const results = await runTestSuite(env);
    
    if (results.failureCount > 0) {
      await notifySlack(env.SLACK_WEBHOOK_URL, results);
    }
    
    // Store results
    ctx.waitUntil(storeResults(env.DB, env.R2_BUCKET, results));
  },
  
  // HTTP trigger (for manual runs and GitHub Actions)
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    // Verify GitHub webhook signature
    const signature = request.headers.get('x-hub-signature-256');
    if (!verifyGitHubSignature(signature, env.GITHUB_WEBHOOK_SECRET)) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const results = await runTestSuite(env);
    
    return Response.json({
      passed: results.failureCount === 0,
      summary: {
        total: results.totalTests,
        passed: results.passCount,
        failed: results.failureCount
      },
      reportUrl: results.reportUrl
    });
  }
};
```

### GitHub Actions Workflow

```yaml
# .github/workflows/prompt-regression-tests.yml
name: Prompt Regression Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:     # Manual trigger

jobs:
  test-prompts:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Trigger prompt test suite
        id: run-tests
        run: |
          RESPONSE=$(curl -X POST \
            -H "x-hub-signature-256: ${{ secrets.GITHUB_WEBHOOK_SIGNATURE }}" \
            https://prompt-test-runner.your-workers.dev/run)
          
          echo "response=$RESPONSE" >> $GITHUB_OUTPUT
          
          PASSED=$(echo $RESPONSE | jq -r '.passed')
          echo "passed=$PASSED" >> $GITHUB_OUTPUT
      
      - name: Fail if tests failed
        if: steps.run-tests.outputs.passed == 'false'
        run: |
          echo "Prompt regression detected!"
          exit 1
```

### Constraints
- Complete all 26 tests in <5 minutes (parallel execution required)
- Handle OpenAI rate limits: max 5 concurrent requests, exponential backoff
- Zero false positives: Don't fail on semantically equivalent outputs
- Deterministic: Use `temperature: 0` for consistent responses
- Cost-conscious: Minimize API calls (cache results, batch requests)

### Success Criteria
1. Test suite catches actual prompt behavior regressions
2. Runs automatically on every PR and daily schedule
3. Blocks deployments when regressions detected
4. Completes 26 tests in <5 minutes
5. Sends actionable Slack alerts with diff visualization
6. Stores detailed results in D1 and R2 for debugging
7. No false positives (semantic similarity matching works correctly)

### Deliverables
1. Complete Cloudflare Worker code (`prompt-test-runner.ts`)
2. GitHub Actions workflow file (`.github/workflows/prompt-regression-tests.yml`)
3. D1 schema for test baselines and results (SQL)
4. Slack notification formatter with rich blocks
5. Test case seed data (26 sample test cases)
6. Configuration guide (environment variables, webhook setup)

---

## PROMPT 4: Automated Log Analysis & Anomaly Detection

### Role
You are an SRE Tooling Engineer specializing in observability automation. You have expertise in building anomaly detection systems, log analysis pipelines, and actionable alerting that minimizes false positives.

### Context
The SRE currently spends 30 minutes daily manually reviewing logs for anomalies:
- LLM latency spikes (p95/p99 degradation)
- Error rate increases (looking for 2x baseline jumps)
- New error patterns (e.g., "Connection timeout to Supabase" appearing 3+ times)
- Database persistence failures

This manual process is:
- Time-consuming (210 min/week)
- Prone to missing patterns (human fatigue)
- Not real-time (issues detected hours late)

**Automation Goal:** Replace manual log review with automated system that:
- Runs every 5 minutes via Cloudflare Workers cron
- Detects anomalies using statistical baselines
- Suppresses noise (transient spikes, auto-resolved errors)
- Creates actionable alerts with suggested fixes
- Notifies Slack only for High/Critical severity

### Task
Build an automated log analysis system deployable to Cloudflare Workers that detects anomalies and creates actionable alerts.

### System Architecture

**Components:**
1. **Log Ingestion:** Application logs stored in D1 `application_logs` table
2. **Anomaly Detector (Worker):** Scheduled job analyzes logs every 5 minutes
3. **Baseline Calculator:** Rolling 7-day averages for error rate, latency
4. **Alert Engine:** Creates/updates alerts in D1, deduplicates similar alerts
5. **Notification Service:** Sends Slack alerts for High/Critical severity

### Log Data Structure

```typescript
interface ApplicationLog {
  id: string;
  timestamp: number;          // Unix timestamp
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  metadata: string;           // JSON string with additional context
  source: string;             // e.g., "triage-ai", "rate-limiter"
  traceId?: string;           // For distributed tracing
}

// Metadata examples:
// Error: { errorType: "TimeoutError", endpoint: "/api/triage", duration: 5000 }
// Performance: { endpoint: "/api/triage", latency: 1200, userId: "123" }
```

### Anomaly Detection Logic

**1. Error Rate Anomaly:**
```typescript
const detectErrorRateAnomaly = async (db: D1Database): Promise<Alert | null> => {
  // Calculate 7-day baseline (errors per hour)
  const baseline = await db.prepare(`
    SELECT AVG(error_count) as avg_errors
    FROM (
      SELECT 
        strftime('%Y-%m-%d %H', datetime(timestamp, 'unixepoch')) as hour,
        COUNT(*) as error_count
      FROM application_logs
      WHERE 
        level IN ('error', 'fatal')
        AND timestamp > unixepoch() - (7 * 86400)
      GROUP BY hour
    )
  `).first();
  
  // Current error rate (last 15 minutes)
  const current = await db.prepare(`
    SELECT COUNT(*) as errors
    FROM application_logs
    WHERE 
      level IN ('error', 'fatal')
      AND timestamp > unixepoch() - 900
  `).first();
  
  const threshold = baseline.avg_errors * 2; // 2x baseline
  
  if (current.errors > threshold) {
    return {
      severity: 'high',
      title: 'Error Rate Spike Detected',
      message: `Error rate: ${current.errors} errors/15min (baseline: ${baseline.avg_errors.toFixed(1)})`,
      suggestedAction: 'Check recent deployments and error patterns',
      metadata: JSON.stringify({ current: current.errors, baseline: baseline.avg_errors })
    };
  }
  
  return null;
};
```

**2. Latency Spike Anomaly:**
```typescript
const detectLatencySpikeAnomaly = async (db: D1Database): Promise<Alert | null> => {
  // 7-day p95 baseline calculation
  // Current 15-min p95 calculation
  // Compare and return alert if > 2x baseline
};
```

**3. New Error Pattern Detection:**
```typescript
const detectNewErrorPatterns = async (db: D1Database): Promise<Alert[]> => {
  // Get error messages from last 2 hours
  const recentErrors = await db.prepare(`
    SELECT message, COUNT(*) as count
    FROM application_logs
    WHERE 
      level = 'error'
      AND timestamp > unixepoch() - 7200
    GROUP BY message
    HAVING count >= 3
  `).all();
  
  // Check if error pattern is new (not seen in last 7 days before 2 hours ago)
  const alerts: Alert[] = [];
  
  for (const error of recentErrors.results) {
    const historicalCount = await db.prepare(`
      SELECT COUNT(*) as count
      FROM application_logs
      WHERE 
        level = 'error'
        AND message = ?
        AND timestamp BETWEEN unixepoch() - (7 * 86400) AND unixepoch() - 7200
    `).bind(error.message).first();
    
    if (historicalCount.count === 0) {
      alerts.push({
        severity: 'medium',
        title: 'New Error Pattern Detected',
        message: `"${error.message.substring(0, 100)}" occurred ${error.count} times`,
        suggestedAction: 'Investigate root cause - this error pattern is new',
        metadata: JSON.stringify({ errorMessage: error.message, count: error.count })
      });
    }
  }
  
  return alerts;
};
```

### Alert Deduplication & Auto-Resolution

```typescript
const manageAlerts = async (db: D1Database, newAlert: Alert): Promise<void> => {
  // Check for similar active alerts (within last 1 hour)
  const existingAlert = await db.prepare(`
    SELECT id, created_at
    FROM alerts
    WHERE 
      title = ?
      AND status = 'active'
      AND created_at > unixepoch() - 3600
    ORDER BY created_at DESC
    LIMIT 1
  `).bind(newAlert.title).first();
  
  if (existingAlert) {
    // Update existing alert instead of creating duplicate
    await db.prepare(`
      UPDATE alerts 
      SET 
        updated_at = unixepoch(),
        message = ?,
        metadata = ?
      WHERE id = ?
    `).bind(newAlert.message, newAlert.metadata, existingAlert.id).run();
    
    return;
  }
  
  // Create new alert
  await db.prepare(`
    INSERT INTO alerts (id, severity, title, message, suggested_action, status, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, 'active', ?, unixepoch())
  `).bind(
    crypto.randomUUID(),
    newAlert.severity,
    newAlert.title,
    newAlert.message,
    newAlert.suggestedAction,
    newAlert.metadata
  ).run();
};
```

### Cloudflare Worker Implementation

```typescript
// workers/log-analyzer.ts
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const db = env.DB;
    
    // Run all anomaly detectors
    const [errorRateAlert, latencySpikeAlert, newPatternAlerts] = await Promise.all([
      detectErrorRateAnomaly(db),
      detectLatencySpikeAnomaly(db),
      detectNewErrorPatterns(db)
    ]);
    
    // Collect all alerts
    const alerts = [
      errorRateAlert,
      latencySpikeAlert,
      ...newPatternAlerts
    ].filter(Boolean);
    
    // Store alerts
    for (const alert of alerts) {
      await manageAlerts(db, alert);
    }
    
    // Auto-resolve old alerts
    ctx.waitUntil(autoResolveAlerts(db));
    
    // Notify for critical alerts
    const criticalAlerts = alerts.filter(a => 
      a.severity === 'high' || a.severity === 'critical'
    );
    
    if (criticalAlerts.length > 0) {
      ctx.waitUntil(notifySlack(env.SLACK_WEBHOOK_URL, criticalAlerts));
    }
  }
};

// Configure in wrangler.toml:
// [triggers]
// crons = ["*/5 * * * *"]  # Every 5 minutes
```

### Constraints
- Must run efficiently on D1 (< 100ms per analysis)
- Handle missing/delayed logs gracefully (no crashes)
- Configurable thresholds stored in `alert_rules` table
- Maximum 1 Slack notification per alert per hour (avoid spam)
- Auto-resolve alerts within 1 hour of condition clearing

### Success Criteria
1. System detects anomalies within 5 minutes of occurrence
2. False positive rate < 1 per week (very high signal-to-noise)
3. Alerts include actionable suggested fixes (not just "error detected")
4. Auto-resolution works correctly (doesn't resolve too early)
5. Eliminates 30 min/day manual log review
6. Dashboard shows alert history and trends

### Deliverables
1. Complete Cloudflare Worker (`log-analyzer.ts`)
2. D1 schema for alerts and alert rules (SQL)
3. All anomaly detection functions (error rate, latency, patterns)
4. Alert management logic (deduplication, auto-resolution)
5. Slack notification formatter
6. Dashboard API endpoint for fetching alerts
7. Configuration guide (alert rules, thresholds, notification settings)
8. Sample alert rules (seed data)

---

## PROMPT 5: CI/CD Pipeline Visualization Dashboard

### Role
You are a Frontend Developer specializing in real-time CI/CD dashboards. You have expertise in React, GitHub Actions API integration, and building intuitive deployment interfaces.

### Context
The SRE deploys INT-triage-ai-2.0 through GitHub Actions pipeline with 6 stages:
1. **Build** - Compile code, bundle assets
2. **Unit Tests** - Run Jest/Vitest tests
3. **Integration Tests** - API and database tests
4. **Prompt Tests** - LLM regression tests (from Prompt 3)
5. **Security Scan** - Dependency vulnerabilities, SAST
6. **Deploy** - Push to production (Cloudflare Workers)

**Current problem:** SRE must open GitHub web UI to check pipeline status, can't see holistic deployment health, no clear blockers visible.

**Dashboard goal:**
- At-a-glance pipeline status (which stage failed/succeeded)
- Pre-deployment checklist (blocks deploy if incomplete)
- One-click deploy button (triggers GitHub Actions workflow)
- Real-time updates as pipeline progresses

### Task
Build `DeploymentPipeline` React component that visualizes CI/CD status and provides safe deployment controls.

### Data Structure

```typescript
interface WorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
  headBranch: string;
  headSha: string;
}

interface WorkflowJob {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  startedAt: string;
  completedAt: string;
  steps: JobStep[];
}

interface DeploymentChecklist {
  allTestsPassing: boolean;
  noOpenP0Incidents: boolean;
  promptTestsAutomated: boolean;
  securityScanPassed: boolean;
  approvedByReviewer: boolean;
}
```

### GitHub API Integration

```typescript
// Fetch latest workflow runs
const fetchWorkflowRuns = async (
  owner: string,
  repo: string,
  token: string
): Promise<WorkflowRun[]> => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=5`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );
  
  const data = await response.json();
  return data.workflow_runs;
};

// Trigger new workflow run
const triggerDeploy = async (
  owner: string,
  repo: string,
  workflow_id: string,
  ref: string,
  token: string
): Promise<void> => {
  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref })
    }
  );
};
```

### Component Structure

```typescript
export const DeploymentPipeline: React.FC = () => {
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [jobs, setJobs] = useState<WorkflowJob[]>([]);
  const [checklist, setChecklist] = useState<DeploymentChecklist>(null);
  
  // Poll GitHub API every 30 seconds
  // Fetch deployment checklist from API
  // Handle deploy button click with safety checks
  
  return (
    <div className="space-y-6">
      <PipelineStages jobs={jobs} />
      <DeploymentChecklist checklist={checklist} />
      <Button onClick={handleDeploy}>Deploy to Production</Button>
      <RecentWorkflowRuns runs={workflowRuns} />
    </div>
  );
};
```

### Pipeline Stages Visualization

```typescript
const PipelineStages: React.FC<{ jobs: WorkflowJob[] }> = ({ jobs }) => {
  const stages = [
    { name: 'Build', jobName: 'build' },
    { name: 'Unit Tests', jobName: 'unit-tests' },
    { name: 'Integration Tests', jobName: 'integration-tests' },
    { name: 'Prompt Tests', jobName: 'prompt-tests' },
    { name: 'Security Scan', jobName: 'security-scan' },
    { name: 'Deploy', jobName: 'deploy' }
  ];
  
  return (
    <div className="flex items-center justify-between gap-4">
      {stages.map((stage, index) => {
        const job = jobs.find(j => j.name === stage.jobName);
        const status = getStageStatus(job);
        
        return (
          <React.Fragment key={stage.name}>
            <StageCard
              name={stage.name}
              status={status}
              duration={job ? getDuration(job) : null}
              logsUrl={job?.htmlUrl}
            />
            {index < stages.length - 1 && <ArrowRight />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
```

### Constraints
- GitHub API has rate limits (5000 req/hour) - cache for 30s
- Component must handle workflows with different names
- Show last 5 workflow runs with timestamps
- Mobile-responsive: Pipeline stages wrap vertically
- Handle GitHub API errors gracefully

### Success Criteria
1. Component updates in real-time during deployments
2. Pipeline status is visually clear (green/red/yellow obvious)
3. Pre-deployment checklist blocks unsafe deploys
4. Deploy button only enabled when all checks pass
5. Links to GitHub logs work correctly
6. Component handles API failures without crashing

### Deliverables
1. Complete `DeploymentPipeline.tsx` component
2. `PipelineStages.tsx` visualization sub-component
3. `DeploymentChecklist.tsx` sub-component
4. GitHub API integration utilities
5. Cloudflare Workers API endpoint for checklist
6. TypeScript interfaces for all data structures
7. Example mock data for development

---

## PROMPT 6: AI-Powered File Organization System

### Role
You are a Full-Stack Developer specializing in AI-powered automation tools. You have expertise in building intelligent file management systems, Claude API integration, and creating intuitive batch operation interfaces.

### Context
The SRE has 30+ scattered files on Desktop related to FlashFusion project:
- Checkpoint documents (12 files): `CHECKPOINT_CURRENT_2025_07_30.md`
- Scripts (5 files): `FlashFusion-Launcher.bat`, `Launch Local Apps.bat`
- Diagrams (8 files): `flashfusion_ecosystem.svg`, `agent_dashboard_wireframe.svg`
- Documentation (5+ files): Various markdown and text files

**Current problem:** Files accumulate on Desktop, creating visual clutter and making it hard to find things. Manual organization is time-consuming.

**Solution approach:** Web-based file organization interface where user:
1. Provides list of files (manually or via upload)
2. AI analyzes each file and suggests destination folder
3. User reviews suggestions and approves batch operations
4. System generates executable scripts for user to run

**Note:** This is NOT a local filesystem scanner. This is a web interface where user provides file information and manually executes generated move commands.

### Task
Build AI-powered file organization system with web interface for analyzing files and generating move commands.

### Data Structures

```typescript
interface FileToOrganize {
  id: string;
  fileName: string;
  currentPath: string;
  fileSize?: number;
  fileExtension: string;
  contentPreview?: string;
  lastModified?: number;
}

interface OrganizationSuggestion {
  fileId: string;
  suggestedPath: string;
  confidence: number;
  reason: string;
  category: string;
}

interface OrganizationRule {
  id: string;
  pattern: string;
  destination: string;
  priority: number;
  active: boolean;
}
```

### Target Folder Structure

```
C:\Users\kyler\FlashFusion-Organized\
├── Knowledge\
│   ├── Checkpoints\
│   │   ├── 2025-Q1\
│   │   ├── 2025-Q2\
│   │   └── 2025-Q3\
│   ├── Guides\
│   └── Documentation\
├── Scripts\
│   ├── FlashFusion\
│   ├── Deployment\
│   └── Utilities\
├── Diagrams\
│   ├── Architecture\
│   ├── Workflows\
│   └── Wireframes\
├── Archive\
└── Misc\
```

### Claude API Integration

```typescript
const categorizeFile = async (
  file: FileToOrganize,
  claudeApiKey: string
): Promise<OrganizationSuggestion> => {
  const prompt = `You are a file organization expert. Analyze this file:

Filename: ${file.fileName}
Extension: ${file.fileExtension}
Current location: ${file.currentPath}
${file.contentPreview ? `Content preview: ${file.contentPreview}` : ''}

Available destinations:
- Knowledge/Checkpoints/YYYY-QX/
- Knowledge/Guides/
- Knowledge/Documentation/
- Scripts/FlashFusion/
- Scripts/Deployment/
- Diagrams/Architecture/
- Diagrams/Workflows/
- Archive/YYYY/
- Misc/

Respond with JSON:
{
  "destination": "path/",
  "confidence": 0-100,
  "reason": "brief explanation",
  "category": "category name"
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': claudeApiKey
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  const data = await response.json();
  const result = JSON.parse(data.content[0].text);
  
  return {
    fileId: file.id,
    suggestedPath: result.destination,
    confidence: result.confidence,
    reason: result.reason,
    category: result.category
  };
};
```

### React Component

```typescript
export const FileOrganizer: React.FC = () => {
  const [files, setFiles] = useState<FileToOrganize[]>([]);
  const [suggestions, setSuggestions] = useState<OrganizationSuggestion[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  
  const analyzeFiles = async () => {
    const response = await fetch('/api/categorize-files', {
      method: 'POST',
      body: JSON.stringify(files)
    });
    const results = await response.json();
    setSuggestions(results);
  };
  
  const generateMoveCommands = () => {
    const approved = suggestions.filter(s => selectedFiles.has(s.fileId));
    // Generate batch script or PowerShell script
    // Display in modal with copy button
  };
  
  return (
    <div>
      <FileInput onFilesAdded={setFiles} />
      <Button onClick={analyzeFiles}>Analyze {files.length} Files</Button>
      {suggestions.map(s => (
        <SuggestionCard
          suggestion={s}
          selected={selectedFiles.has(s.fileId)}
          onToggle={id => /* toggle selection */}
        />
      ))}
      <Button onClick={generateMoveCommands}>
        Generate Move Commands
      </Button>
    </div>
  );
};
```

### Move Commands Generator

```typescript
const generateBatchScript = (suggestions: OrganizationSuggestion[]) => {
  return `@echo off
REM File Organization Script - Generated ${new Date().toISOString()}

${suggestions.map(s => {
  const file = files.find(f => f.id === s.fileId);
  return `
REM Move ${file.fileName}
mkdir "${s.suggestedPath}" 2>nul
move "${file.currentPath}" "${s.suggestedPath}${file.fileName}"`;
}).join('\n')}

echo File organization complete!
pause`;
};
```

### Constraints
- No direct filesystem access (user executes generated commands)
- Claude API calls batched to minimize cost (<$0.10 per 30 files)
- Maximum 100 files per batch
- Mobile-friendly interface

### Success Criteria
1. AI correctly categorizes 90%+ of files
2. Confidence scores accurate
3. Generated move commands are syntactically correct
4. Move history allows tracing operations
5. Rules override AI suggestions
6. Interface is intuitive

### Deliverables
1. Complete `FileOrganizer.tsx` component
2. `SuggestionCard.tsx` sub-component
3. `OrganizationRules.tsx` management interface
4. `MoveHistory.tsx` with undo capability
5. Cloudflare Worker for AI categorization
6. D1 schema for rules and move history
7. Move command generator (batch and PowerShell)
8. File list parser

---

## PROMPT 7: Master Lovable Integration Prompt

### Role
You are an expert at creating comprehensive Lovable.dev prompts that generate complete, production-ready full-stack applications.

### Context
I have 6 detailed prompts defining PROJECT NEXUS components:
1. Database Schema (D1)
2. Project Cards (React)
3. Prompt Testing (Workers + GitHub Actions)
4. Log Analysis (Workers)
5. CI/CD Dashboard (React + GitHub API)
6. File Organizer (React + Claude API)

These must be unified into a single Lovable prompt.

### Task
Create a master Lovable.dev prompt (5000-7000 words) that generates the complete PROJECT NEXUS application.

### Lovable Platform Constraints

**What Lovable Can Do:**
- Generate React + TypeScript frontend
- Create Tailwind CSS styling with shadcn/ui
- Set up basic component structure
- Generate responsive layouts

**What Lovable Cannot Do:**
- Deploy Cloudflare Workers (you deploy via Wrangler)
- Execute D1 migrations (you run SQL manually)
- Set up GitHub Actions (you add YAML files)
- Configure API keys (you set environment variables)

### Output Format

Structure the Lovable prompt with:

**Section 1: Project Overview**
- Purpose, target user, problems solved
- Tech stack specification
- Database schema (complete SQL from Prompt 1)

**Section 2: Application Structure**
- Tab navigation (Home, Projects, Automation, Observability, Deployment, Files)
- Layout requirements (sidebar, header, dark mode)
- Auto-refresh patterns

**Section 3: Component Specifications**
For each tab:
- Component hierarchy
- Data structures (TypeScript interfaces)
- API endpoints
- UI/UX requirements
- Mock data for development

**Section 4: Integration Details**
- GitHub API integration patterns
- Cloudflare Workers endpoints (to deploy separately)
- State management (TanStack Query)
- Routing (React Router)

**Section 5: UI/UX Requirements**
- Design system (Tailwind + shadcn/ui)
- Responsive breakpoints
- Loading and error states
- Accessibility requirements

**Section 6: Post-Generation Instructions**
- D1 database setup commands
- Workers deployment steps
- Environment variable configuration
- GitHub Actions workflow setup

### Template Structure

```markdown
# PROJECT NEXUS: Developer Operations Command Center

Build a production-grade dashboard for SREs managing AI-powered production systems.

## Project Overview

**Purpose:** Context-switching command center eliminating manual toil

**Target User:** SRE managing 3 active projects

**Problems Solved:**
1. Manual prompt testing (30+ min/deploy) → Automated
2. Manual log analysis (30 min/day) → Automated  
3. Context loss switching projects → Saved snapshots
4. Scattered Desktop files → AI organization

## Tech Stack

### Frontend (Lovable-Generated)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Lucide React icons
- Recharts for visualization
- TanStack Query for server state
- React Router v6

### Backend (Deploy Separately)
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Cloudflare R2 (storage)

### Integrations
- GitHub Actions API
- OpenAI API (prompt testing)
- Claude API (file categorization)
- Slack Webhooks

## Database Schema

[Include complete SQL DDL from Prompt 1]

## Application Structure

### Tab 1: Home/Today
[Specification from context]

### Tab 2: Projects
[Complete spec from Prompt 2]

### Tab 3: Automation
[Specification for test suite UI]

### Tab 4: Observability
[Specification from Prompt 4]

### Tab 5: Deployment
[Complete spec from Prompt 5]

### Tab 6: Files
[Complete spec from Prompt 6]

## Component Library

Use shadcn/ui components:
- Card, Button, Badge, Table
- Dialog, Sheet, Tabs
- Checkbox, Switch, Input
- Alert, Skeleton

## State Management

TanStack Query for server state:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  refetchInterval: 30000
});
```

## API Endpoints

```typescript
// Deploy these as Cloudflare Workers separately
GET /api/projects
POST /api/categorize-files
GET /api/deployment-checklist
GET /api/alerts
POST /api/prompt-tests/run
```

## Mock Data

```typescript
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'INT-triage-ai-2.0',
    status: 'warning',
    metrics: { errorRate: 0.15, llmLatencyP95: 1200, dbPersistence: 99.8 },
    lastWorked: Date.now() - 7200000,
    nextStep: 'Fix production env vars',
    blockers: ['Prompt tests not automated']
  }
];
```

## File Structure

```
src/
├── components/
│   ├── ui/
│   ├── projects/
│   ├── automation/
│   ├── observability/
│   ├── deployment/
│   ├── files/
│   └── layout/
├── hooks/
├── lib/
├── types/
├── pages/
└── App.tsx
```

## Success Criteria

1. All 6 tabs navigable without errors
2. Project cards display mock data
3. Charts render using Recharts
4. Forms functional
5. Responsive mobile/tablet/desktop
6. No console errors
7. TypeScript strict mode
8. Accessible (ARIA, keyboard nav)

## Post-Generation Setup

### 1. Create D1 Database
```bash
wrangler d1 create nexus-db
```

### 2. Run Schema
```bash
wrangler d1 execute nexus-db --file=schema.sql
```

### 3. Deploy Workers
```bash
wrangler deploy workers/api/projects.ts
wrangler deploy workers/prompt-test-runner.ts
wrangler deploy workers/log-analyzer.ts
```

### 4. Set Environment Variables
Cloudflare Dashboard > Workers > Settings:
```
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
GITHUB_TOKEN=ghp_...
```

### 5. Deploy Frontend
```bash
npm run build
wrangler pages deploy dist
```

### 6. Add GitHub Actions
Create `.github/workflows/prompt-tests.yml` from Prompt 3
```

### Success Criteria for Master Prompt

1. Generates working frontend without manual coding
2. Includes all component specs from Prompts 1-6
3. Specifies exact data structures
4. Provides clear deployment instructions
5. Includes mock data for local dev
6. Defines TypeScript interfaces strictly
7. Within Lovable's capabilities

### Deliverables

1. Complete Lovable prompt (5000-7000 words, markdown)
2. All SQL DDL statements embedded
3. All TypeScript interfaces included
4. Component specifications with props
5. Mock data examples
6. Post-generation deployment guide
7. File structure specification
8. Environment variables documentation

---

## Execution Plan

### Phase 1: Foundation (Week 1)
- Run Prompt 1 → Get D1 schema → Create database
- Run Prompt 2 → Get ProjectCard → Test with mock data

### Phase 2: Automation (Week 2)
- Run Prompt 3 → Get test suite → Deploy to Workers
- Run Prompt 4 → Get log analyzer → Deploy scheduled Worker

### Phase 3: UI Completion (Week 3)
- Run Prompt 5 → Get CI/CD dashboard → Integrate GitHub API
- Run Prompt 6 → Get file organizer → Deploy categorization Worker

### Phase 4: Integration (Week 4)
- Run Prompt 7 → Generate master Lovable prompt
- Build in Lovable.dev
- Deploy to Cloudflare Pages
- Wire up all Workers and D1

**Total Build Time:** 12-15 hours (focused sprint)

**Cost Estimate:**
- Cloudflare: $20/month
- OpenAI API: $10-20/month
- Claude API: $5-10/month
- GitHub Actions: Free tier
- **Total: $35-50/month**

---

## Quick Reference

### Command Cheat Sheet

```bash
# D1 Database
wrangler d1 create nexus-db
wrangler d1 execute nexus-db --file=schema.sql
wrangler d1 execute nexus-db --command="SELECT * FROM projects"

# Workers Deployment
wrangler deploy workers/api/projects.ts
wrangler deploy workers/prompt-test-runner.ts
wrangler deploy workers/log-analyzer.ts

# Pages Deployment
npm run build
wrangler pages deploy dist

# Local Development
npm run dev
wrangler pages dev dist
```

### Environment Variables Template

```env
# Frontend (.env)
VITE_API_BASE_URL=https://your-workers.dev
VITE_GITHUB_TOKEN=ghp_...
VITE_GITHUB_OWNER=your-username
VITE_GITHUB_REPO=your-repo

# Workers (Cloudflare Dashboard)
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
GITHUB_TOKEN=ghp_...
GITHUB_WEBHOOK_SECRET=...
```

---

## Appendix: Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Cloudflare D1 | Edge-native, low latency, included in paid plan |
| Backend | Cloudflare Workers | Serverless, global edge, integrates with D1 |
| Frontend Framework | React + TypeScript | Lovable's native support, type safety |
| UI Library | shadcn/ui | Production-ready components, Tailwind-based |
| State Management | TanStack Query | Server state caching, auto-refresh patterns |
| Testing Framework | GitHub Actions | Native CI/CD, free tier sufficient |
| AI Provider (Testing) | OpenAI GPT-4 | Deterministic with temp=0, JSON mode |
| AI Provider (Files) | Claude API | Superior at understanding file context |
| Alerting | Slack Webhooks | Simple integration, no additional service |
| Real-time Updates | 30s Polling | Simpler than WebSockets, sufficient for MVP |

---

END OF DOCUMENT