# Feedback & Review System Demo

This module provides a starting point for a feedback and review system within the FlashFusion platform. It includes a custom hook (`useFeedbackSystem`) and a demo component (`FeedbackSystem`) that allow users to submit ratings and comments about templates, AI outputs, or deployed apps.

## Features

- Submit feedback with a rating (1–5) and a textual comment.
- Display recent feedback entries with timestamps and star ratings.
- Delete feedback entries.
- Maintain a log of actions (adding and deleting feedback).

> **Note:** This module stores feedback in local state only. It does not persist data or include moderation. Use this as a skeleton for implementing a full feedback system.

## Files

| File | Purpose |
|------|---------|
| `useFeedbackSystem.ts` | Custom hook to manage feedback items and logs. Provides functions to add, update and remove feedback. |
| `FeedbackSystem.tsx` | Demo component using the hook. Renders a form to submit feedback, a list of existing feedback with delete buttons, and action logs. |
| `README.md` | This file; explains the module and provides usage guidance. |
| `PRODUCTION_PLAN.md` | Outlines how to extend this demo into a production‑ready feedback and review system. |

## Usage

1. Copy the `feedback_system` directory into your project.
2. Import and use the `FeedbackSystem` component:

```tsx
import FeedbackSystem from './feedback_system/FeedbackSystem';

function ReviewsPage() {
  return <FeedbackSystem />;
}
```

3. Customize the styling as needed to match your design system.

## Extending the Module

To make this module production ready:

- **Backend integration:** Store feedback in a database via a secure API. Include fields like user ID, template/feature ID, rating, comment, and timestamp.
- **Moderation:** Implement moderation workflows to filter inappropriate content, including spam detection and profanity checks. Provide tools for administrators to approve, edit or remove reviews.
- **Aggregated ratings:** Calculate average ratings for items and display them in the UI.
- **Pagination & search:** Add pagination and search capabilities to handle large volumes of reviews efficiently.
- **User identity:** Link feedback to authenticated users and prevent duplicate submissions. Display user names or anonymize reviews depending on privacy requirements.
- **Notifications:** Notify authors when their feedback receives replies or status changes. Optionally notify administrators about new reviews that need moderation.

See **PRODUCTION_PLAN.md** for a detailed roadmap to production.