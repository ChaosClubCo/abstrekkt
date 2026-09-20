# Analytics Dashboard Demo Skeleton

This folder contains a **business analytics dashboard** prototype.  It
displays high‑level metrics such as monthly recurring revenue (MRR),
active users, churn rate, average revenue per user (ARPU) and growth
rate.  The implementation uses React and TypeScript and simulates
data fetching.  Use this as a starting point for building your own
analytics suite.

## Structure

```
analytics_dashboard/
├─ README.md                # This file
├─ AnalyticsDashboard.tsx    # Top‑level component rendering metrics
├─ useAnalytics.ts           # Hook to fetch and manage metrics
└─ PRODUCTION_PLAN.md         # Roadmap for production readiness
```

## How It Works

1. **Timeframe Selection** – Users choose a timeframe (7, 30 or 90
   days) from a drop‑down.  Changing the timeframe updates the log and
   triggers a new fetch.
2. **Data Fetching** – The `useAnalytics` hook generates random
   metrics based on the selected timeframe.  It simulates a network
   request by delaying for 800 ms before updating the data.  The
   metrics include:
   * **Revenue** – Monthly recurring revenue (MRR) in USD.
   * **Active Users** – Number of unique users in the timeframe.
   * **Churn Rate** – Percentage of users who cancelled in the timeframe.
   * **ARPU** – Average revenue per user (revenue divided by active users).
   * **Growth Rate** – Percent change in revenue compared to the
     previous period, displayed with an arrow indicator.
3. **Logs** – The hook records log messages when a fetch is initiated,
   when data updates and when the timeframe changes.  These logs
   appear in a scrollable `<pre>` element.

## Usage

1. Copy `AnalyticsDashboard.tsx` and `useAnalytics.ts` into your
   project.  Place the hook under `hooks/` and the component under
   `components/`.
2. Import and render the component:

   ```tsx
   import AnalyticsDashboard from './components/AnalyticsDashboard';

   export default function AnalyticsPage() {
     return <AnalyticsDashboard />;
   }
   ```

3. Replace the random number generation in `useAnalytics.ts` with
   calls to your analytics service or data warehouse.  Use
   environment variables (e.g. `VITE_ANALYTICS_API_URL`,
   `VITE_ANALYTICS_TOKEN`) to configure endpoints and secrets.
4. Integrate a charting library (e.g. Chart.js, Recharts) to visualise
   historical trends.  For example, display revenue and active user
   charts that update when the timeframe changes.
5. Add filters (e.g. by plan type, region) to allow deeper analysis.

## Security & Performance Considerations

* **Rate Limits** – Cache fetched results on the client to avoid
  hitting rate limits on your analytics API.  Implement server‑side
  caching and pagination for large result sets.
* **Sensitive Data** – Do not expose personally identifiable
  information (PII) in analytics queries.  Aggregate metrics to
  preserve user privacy.
* **Performance** – For large dashboards, use memoization and
  virtualisation techniques to avoid unnecessary re‑renders.

## Next Steps

* Integrate real analytics: query your production database or
  analytics platform for metrics.
* Implement anomaly detection to highlight unusual spikes in churn or
  revenue.
* Add cohort analysis (e.g. by sign‑up date, plan type) to better
  understand user behaviour.
* Provide export options (CSV, JSON) and shareable reports.

This skeleton serves as a foundation for building a powerful analytics
dashboard tailored to your product’s needs.