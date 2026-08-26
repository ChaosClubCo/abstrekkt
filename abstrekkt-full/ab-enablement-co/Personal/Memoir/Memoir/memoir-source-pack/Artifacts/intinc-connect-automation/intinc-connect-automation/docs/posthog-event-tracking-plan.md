# INTINC Connect - PostHog Event Tracking Plan

## Overview

This document defines the complete event tracking strategy for INTINC Connect using PostHog. The plan covers user behavior, feature adoption, engagement metrics, and HR analytics.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Event Taxonomy](#event-taxonomy)
3. [Core Events](#core-events)
4. [Feature-Specific Events](#feature-specific-events)
5. [Engagement Metrics & KPIs](#engagement-metrics--kpis)
6. [User Properties](#user-properties)
7. [Dashboards & Insights](#dashboards--insights)
8. [Implementation Guide](#implementation-guide)

---

## Setup & Configuration

### Environment Variables

```bash
# PostHog Configuration
POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxx
POSTHOG_HOST=https://app.posthog.com  # or self-hosted URL
POSTHOG_PROJECT_ID=12345

# Feature Flags
POSTHOG_FEATURE_FLAGS_ENABLED=true
```

### Client-Side Initialization (React)

```typescript
// posthog.ts
import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: true,
        maskTextContent: true,
      },
      // Respect user privacy
      respect_dnt: true,
      // Group analytics by company (for future multi-tenant)
      bootstrap: {
        distinctID: undefined, // Set after auth
      },
    });
  }
  return posthog;
};
```

### Server-Side Tracking (Node.js)

```typescript
// posthog-server.ts
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: process.env.POSTHOG_HOST,
  flushAt: 20,
  flushInterval: 10000,
});

export const trackServerEvent = async (
  distinctId: string,
  event: string,
  properties: Record<string, any>
) => {
  posthog.capture({
    distinctId,
    event,
    properties: {
      ...properties,
      $lib: 'node',
      source: 'server',
      timestamp: new Date().toISOString(),
    },
  });
};

export default posthog;
```

---

## Event Taxonomy

### Naming Convention

```
{domain}_{action}_{target}
```

**Examples:**
- `recognition_sent_kudos`
- `survey_completed_pulse`
- `rewards_redeemed_giftcard`
- `onboarding_step_completed`

### Event Categories

| Domain | Description | Priority |
|--------|-------------|----------|
| `recognition` | Peer recognition events | P0 |
| `survey` | Survey and feedback events | P0 |
| `rewards` | Points and rewards events | P1 |
| `wellness` | Wellness challenge events | P2 |
| `milestone` | Birthday/anniversary events | P1 |
| `onboarding` | New hire flow events | P0 |
| `engagement` | General engagement signals | P0 |
| `auth` | Authentication events | P0 |
| `admin` | HR admin actions | P1 |
| `error` | Error and failure tracking | P0 |

---

## Core Events

### 1. Authentication Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `auth_login_success` | User logs in | `method`, `device_type`, `is_mobile`, `session_duration_prev` |
| `auth_login_failed` | Login attempt fails | `method`, `error_reason` |
| `auth_logout` | User logs out | `session_duration`, `pages_visited` |
| `auth_session_expired` | Session timeout | `last_activity`, `session_duration` |
| `auth_password_reset_requested` | Reset requested | `method` |
| `auth_sso_linked` | SSO account linked | `provider` |

```typescript
// Example implementation
posthog.capture('auth_login_success', {
  method: 'google_sso',
  device_type: 'desktop',
  is_mobile: false,
  user_agent: navigator.userAgent,
  login_time: new Date().toISOString(),
});
```

### 2. Page View Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `$pageview` | Page load (auto) | `$current_url`, `$pathname`, `$referrer` |
| `$pageleave` | Page exit (auto) | `time_on_page`, `scroll_depth` |

**Custom Page Tracking:**

```typescript
posthog.capture('page_viewed', {
  page_name: 'recognition_feed',
  page_category: 'engagement',
  previous_page: 'dashboard',
  time_since_last_page: 45, // seconds
});
```

---

## Feature-Specific Events

### Recognition Module

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `recognition_form_opened` | User opens recognition form | `source` (feed, profile, quick-action) |
| `recognition_recipient_selected` | Recipient picked | `recipient_department`, `is_same_team` |
| `recognition_sent` | Recognition submitted | See detailed schema below |
| `recognition_draft_saved` | Draft saved | `has_message`, `has_gif`, `points_selected` |
| `recognition_viewed` | User views a recognition | `recognition_id`, `is_own`, `age_hours` |
| `recognition_reaction_added` | Emoji reaction added | `reaction_type`, `recognition_id` |
| `recognition_comment_added` | Comment on recognition | `comment_length`, `recognition_id` |
| `recognition_shared` | Shared externally | `share_method` (teams, email, link) |

**Detailed Schema: `recognition_sent`**

```typescript
interface RecognitionSentEvent {
  event: 'recognition_sent';
  properties: {
    // Recognition details
    recognition_id: string;
    recognition_type: 'kudos' | 'achievement' | 'teamwork' | 'innovation' | 'client_success';
    points_given: number;
    message_length: number;
    has_gif: boolean;
    tags: string[];
    
    // Sender context
    sender_department: string;
    sender_tenure_months: number;
    sender_recognition_count_30d: number;
    
    // Recipient context
    recipient_department: string;
    is_cross_department: boolean;
    is_manager_to_report: boolean;
    is_report_to_manager: boolean;
    is_peer_to_peer: boolean;
    
    // Session context
    time_to_complete_seconds: number;
    form_source: 'feed' | 'profile' | 'quick_action' | 'teams_action' | 'email_action';
    device_type: 'desktop' | 'mobile' | 'tablet';
    
    // Engagement signals
    is_first_recognition: boolean;
    days_since_last_recognition: number;
  };
}
```

### Survey Module

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `survey_viewed` | User views survey | `survey_id`, `survey_type`, `is_reminder` |
| `survey_started` | User begins survey | `survey_id`, `question_count` |
| `survey_question_answered` | Each question answered | `survey_id`, `question_index`, `question_type`, `time_to_answer` |
| `survey_abandoned` | User leaves incomplete | `survey_id`, `questions_completed`, `last_question_index` |
| `survey_completed` | Survey submitted | See detailed schema below |
| `survey_reminder_sent` | Reminder email sent | `survey_id`, `reminder_number` |
| `survey_reminder_clicked` | Clicked reminder link | `survey_id`, `reminder_number` |

**Detailed Schema: `survey_completed`**

```typescript
interface SurveyCompletedEvent {
  event: 'survey_completed';
  properties: {
    survey_id: string;
    survey_type: 'pulse' | 'enps' | 'onboarding' | 'exit' | 'custom';
    survey_name: string;
    
    // Completion metrics
    questions_total: number;
    questions_answered: number;
    questions_skipped: number;
    time_to_complete_seconds: number;
    
    // Response quality
    open_ended_responses_count: number;
    avg_open_ended_length: number;
    
    // User context
    department: string;
    tenure_months: number;
    is_manager: boolean;
    
    // Survey context
    days_since_survey_launch: number;
    reminder_count_before_completion: number;
    completion_source: 'email_link' | 'in_app' | 'teams_action';
    
    // Derived metrics (for eNPS)
    enps_score?: number; // 0-10
    enps_category?: 'promoter' | 'passive' | 'detractor';
  };
}
```

### Rewards Module

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `rewards_catalog_viewed` | Opens rewards page | `current_balance` |
| `rewards_item_viewed` | Views specific reward | `reward_id`, `reward_type`, `points_cost` |
| `rewards_redemption_started` | Begins redemption | `reward_id`, `points_cost` |
| `rewards_redeemed` | Successfully redeems | See detailed schema below |
| `rewards_redemption_failed` | Redemption error | `reward_id`, `error_reason` |
| `rewards_wishlist_added` | Adds to wishlist | `reward_id`, `points_needed` |

**Detailed Schema: `rewards_redeemed`**

```typescript
interface RewardsRedeemedEvent {
  event: 'rewards_redeemed';
  properties: {
    redemption_id: string;
    reward_id: string;
    reward_type: 'gift_card' | 'swag' | 'donation' | 'pto' | 'experience';
    reward_name: string;
    points_spent: number;
    balance_before: number;
    balance_after: number;
    
    // Value metrics
    monetary_value_usd?: number;
    
    // User context
    department: string;
    tenure_months: number;
    total_redemptions_ytd: number;
    total_points_redeemed_ytd: number;
    
    // Timing
    days_since_last_redemption: number;
    time_on_catalog_page_seconds: number;
  };
}
```

### Wellness Module

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `wellness_challenge_joined` | User joins challenge | `challenge_id`, `challenge_type`, `duration_days` |
| `wellness_challenge_left` | User leaves challenge | `challenge_id`, `days_participated` |
| `wellness_checkin_completed` | Weekly check-in done | `checkin_id`, `mood_score`, `energy_score` |
| `wellness_activity_logged` | Activity recorded | `activity_type`, `duration_minutes`, `points_earned` |
| `wellness_goal_achieved` | Goal milestone hit | `goal_type`, `achievement_level` |

### Milestone Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `milestone_celebration_sent` | System sends celebration | `milestone_type`, `employee_id`, `points_awarded` |
| `milestone_recognition_received` | User gets milestone kudos | `milestone_type`, `from_user_count` |
| `milestone_card_signed` | User signs group card | `milestone_id`, `message_length` |

### Onboarding Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `onboarding_started` | New user first login | `days_since_hire`, `referral_source` |
| `onboarding_step_completed` | Completes onboarding step | `step_name`, `step_index`, `time_to_complete` |
| `onboarding_completed` | All steps done | `total_time_minutes`, `steps_completed`, `steps_skipped` |
| `onboarding_skipped` | User skips onboarding | `last_step_completed`, `skip_reason` |
| `onboarding_tutorial_watched` | Watches tutorial video | `video_name`, `watch_duration_percent` |

---

## Engagement Metrics & KPIs

### Primary KPIs

| KPI | Definition | Target | PostHog Query |
|-----|------------|--------|---------------|
| **DAU** | Daily Active Users | 60%+ | Unique users with any event/day |
| **WAU** | Weekly Active Users | 80%+ | Unique users with any event/week |
| **MAU** | Monthly Active Users | 95%+ | Unique users with any event/month |
| **Recognition Rate** | % users who sent recognition/month | 50%+ | `recognition_sent` unique users/total users |
| **Survey Completion** | % invited users who complete | 70%+ | `survey_completed` / `survey_viewed` |
| **Rewards Redemption** | % users who redeem/quarter | 40%+ | `rewards_redeemed` unique users |
| **Session Duration** | Avg time per session | 5+ min | Avg(`session_end` - `session_start`) |

### Secondary KPIs

| KPI | Definition | Target |
|-----|------------|--------|
| **Recognition Velocity** | Avg recognitions sent per active user/week | 2+ |
| **Cross-Department Recognition** | % of recognitions across teams | 30%+ |
| **Points Circulation** | Points given vs. redeemed ratio | 0.8-1.2 |
| **Survey Response Time** | Avg hours from invite to completion | <48 hours |
| **Wellness Participation** | % users in active challenge | 25%+ |
| **Feature Adoption** | % users who've used each feature | 60%+ |

### Engagement Score Formula

```typescript
// Composite engagement score (0-100)
const calculateEngagementScore = (userMetrics: UserMetrics): number => {
  const weights = {
    login_frequency: 0.20,      // Days active in last 30 days
    recognition_sent: 0.25,     // Recognitions sent in last 30 days
    recognition_received: 0.15, // Recognitions received (social proof)
    survey_completion: 0.15,    // Survey response rate
    feed_interaction: 0.10,     // Reactions, comments, views
    rewards_activity: 0.10,     // Catalog views, redemptions
    wellness_activity: 0.05,    // Challenge participation
  };

  const scores = {
    login_frequency: Math.min(userMetrics.days_active_30d / 20, 1) * 100,
    recognition_sent: Math.min(userMetrics.recognitions_sent_30d / 4, 1) * 100,
    recognition_received: Math.min(userMetrics.recognitions_received_30d / 3, 1) * 100,
    survey_completion: userMetrics.surveys_completed_rate * 100,
    feed_interaction: Math.min(userMetrics.feed_interactions_30d / 10, 1) * 100,
    rewards_activity: Math.min(userMetrics.rewards_actions_30d / 5, 1) * 100,
    wellness_activity: userMetrics.wellness_active ? 100 : 0,
  };

  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (scores[key as keyof typeof scores] * weight);
  }, 0);
};
```

---

## User Properties

### Identifying Users

```typescript
// On login, identify user with properties
posthog.identify(user.employee_id, {
  // Core identity
  email: user.email,
  name: `${user.first_name} ${user.last_name}`,
  
  // Organization
  department: user.department,
  team: user.team_name,
  manager_id: user.manager_id,
  role: user.role, // 'employee' | 'team_lead' | 'hr_admin' | 'super_admin'
  location: user.location,
  
  // Tenure
  hire_date: user.hire_date,
  tenure_months: calculateTenureMonths(user.hire_date),
  tenure_bucket: getTenureBucket(user.hire_date), // 'new' | '1-2yr' | '3-5yr' | '5yr+'
  
  // Engagement baseline
  points_balance: user.points_balance,
  total_recognitions_sent: user.total_recognitions_sent,
  total_recognitions_received: user.total_recognitions_received,
  
  // Preferences
  notification_preferences: user.notification_preferences,
  timezone: user.timezone,
  
  // Platform
  signup_date: user.created_at,
  last_active: user.last_active_at,
  onboarding_completed: user.onboarding_completed,
});
```

### Group Analytics (Department Level)

```typescript
// Group users by department for cohort analysis
posthog.group('department', user.department, {
  department_name: user.department,
  department_size: departmentStats.size,
  department_avg_engagement: departmentStats.avg_engagement_score,
  department_manager: departmentStats.manager_name,
});
```

### User Properties to Track

| Property | Type | Update Frequency | Use Case |
|----------|------|------------------|----------|
| `engagement_score` | number | Daily | Segment users by engagement |
| `recognition_streak` | number | Real-time | Gamification insights |
| `last_recognition_sent` | datetime | Real-time | Inactivity triggers |
| `total_points_earned` | number | Real-time | Rewards analytics |
| `surveys_completed_rate` | number | Weekly | Survey engagement |
| `is_champion` | boolean | Monthly | Identify power users |
| `risk_flag` | string | Weekly | HR alerts |

---

## Dashboards & Insights

### 1. Executive Dashboard

**Widgets:**
- MAU/WAU/DAU trend line
- Overall engagement score trend
- Recognition volume (sent/received)
- Survey completion rates
- Top performing departments
- Risk indicators count

### 2. HR Analytics Dashboard

**Widgets:**
- Engagement score by department (heatmap)
- New hire onboarding funnel
- Survey response analysis
- Recognition patterns (giver/receiver network)
- Inactive user alerts
- Sentiment trends (from surveys)

### 3. Recognition Analytics

**Widgets:**
- Daily/weekly recognition volume
- Recognition type breakdown
- Cross-department recognition flow (Sankey)
- Top recognition senders/receivers
- Points circulation rate
- Average points per recognition

### 4. Survey Analytics

**Widgets:**
- Survey completion funnel
- Response time distribution
- eNPS trend over time
- Question-level analysis
- Sentiment word cloud
- Completion by department

### 5. Feature Adoption

**Widgets:**
- Feature usage heatmap
- Adoption funnel by feature
- Time to first feature use
- Feature correlation analysis
- Power user identification

---

## Implementation Guide

### React Hook for Tracking

```typescript
// useTracking.ts
import { useCallback } from 'react';
import posthog from 'posthog-js';
import { useAuth } from './useAuth';

export const useTracking = () => {
  const { user } = useAuth();

  const track = useCallback(
    (event: string, properties?: Record<string, any>) => {
      if (!user) return;

      posthog.capture(event, {
        ...properties,
        // Auto-attach user context
        user_department: user.department,
        user_tenure_months: user.tenure_months,
        user_role: user.role,
        timestamp: new Date().toISOString(),
      });
    },
    [user]
  );

  const trackPageView = useCallback(
    (pageName: string, properties?: Record<string, any>) => {
      track('page_viewed', {
        page_name: pageName,
        ...properties,
      });
    },
    [track]
  );

  const trackFeatureUsed = useCallback(
    (featureName: string, properties?: Record<string, any>) => {
      track('feature_used', {
        feature_name: featureName,
        ...properties,
      });
    },
    [track]
  );

  return { track, trackPageView, trackFeatureUsed };
};

// Usage
const RecognitionForm = () => {
  const { track } = useTracking();

  const handleSubmit = async (data: RecognitionData) => {
    const startTime = Date.now();
    
    await submitRecognition(data);
    
    track('recognition_sent', {
      recognition_type: data.type,
      points_given: data.points,
      message_length: data.message.length,
      has_gif: !!data.gifUrl,
      time_to_complete_seconds: (Date.now() - startTime) / 1000,
      form_source: 'feed',
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### Server-Side Tracking

```typescript
// api/recognition/create.ts
import posthog from '@/lib/posthog-server';

export async function POST(req: Request) {
  const data = await req.json();
  const user = await getAuthUser(req);

  // Create recognition
  const recognition = await createRecognition(data);

  // Track server-side
  posthog.capture({
    distinctId: user.employee_id,
    event: 'recognition_sent',
    properties: {
      recognition_id: recognition.id,
      recipient_id: data.recipient_id,
      points_given: data.points,
      recognition_type: data.type,
      is_cross_department: user.department !== data.recipient_department,
      source: 'server',
    },
  });

  return Response.json(recognition);
}
```

### Feature Flags Integration

```typescript
// Check feature flags for gradual rollout
const isNewRecognitionUIEnabled = posthog.isFeatureEnabled('new-recognition-ui');

// Track feature flag exposure
posthog.capture('$feature_flag_called', {
  $feature_flag: 'new-recognition-ui',
  $feature_flag_response: isNewRecognitionUIEnabled,
});
```

---

## Data Retention & Privacy

### Retention Policy

| Data Type | Retention Period | Reason |
|-----------|------------------|--------|
| Raw events | 12 months | Trend analysis |
| Aggregated metrics | Indefinite | Historical comparison |
| Session recordings | 30 days | UX debugging |
| User properties | Until user deletion | GDPR/CCPA compliance |

### Privacy Compliance

```typescript
// Anonymize sensitive data before tracking
const sanitizeProperties = (props: Record<string, any>) => {
  const sanitized = { ...props };
  
  // Remove PII
  delete sanitized.email;
  delete sanitized.phone;
  delete sanitized.salary;
  
  // Hash identifiers if needed
  if (sanitized.manager_email) {
    sanitized.has_manager = true;
    delete sanitized.manager_email;
  }
  
  return sanitized;
};
```

### GDPR Data Subject Requests

```typescript
// Handle data deletion request
const handleGDPRDeletion = async (userId: string) => {
  // Delete from PostHog
  await posthog.api.delete(`/api/person/${userId}`);
  
  // Log deletion for compliance
  await logComplianceAction({
    action: 'gdpr_deletion',
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
};
```

---

## Quality Assurance

### Event Validation

```typescript
// Validate events before sending
const validateEvent = (event: string, properties: Record<string, any>) => {
  const schema = eventSchemas[event];
  if (!schema) {
    console.warn(`Unknown event: ${event}`);
    return false;
  }

  const requiredFields = schema.required || [];
  const missingFields = requiredFields.filter(
    (field) => properties[field] === undefined
  );

  if (missingFields.length > 0) {
    console.error(`Missing required fields for ${event}:`, missingFields);
    return false;
  }

  return true;
};
```

### Testing Events

```typescript
// Jest test for tracking
describe('Recognition Tracking', () => {
  it('should track recognition_sent with required properties', () => {
    const mockCapture = jest.spyOn(posthog, 'capture');

    sendRecognition({
      type: 'kudos',
      points: 25,
      message: 'Great work!',
    });

    expect(mockCapture).toHaveBeenCalledWith(
      'recognition_sent',
      expect.objectContaining({
        recognition_type: 'kudos',
        points_given: 25,
        message_length: 11,
      })
    );
  });
});
```

---

## Alerts & Monitoring

### Configure PostHog Actions

1. **Low Engagement Alert**
   - Trigger: `engagement_score` drops below 30
   - Action: Slack notification to HR channel

2. **Survey Abandonment Alert**
   - Trigger: `survey_abandoned` rate > 40%
   - Action: Email to survey creator

3. **Error Spike Alert**
   - Trigger: `error_occurred` count > 10/hour
   - Action: PagerDuty alert to engineering

---

*Last updated: November 25, 2025*
*Version: 1.0.0*
