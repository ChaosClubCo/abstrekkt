# Dashboards, Analytics & Data-Heavy Ops

Dense, expert-user screens. These need explicit virtualization, drilldowns, and
filter contracts or generators produce "pretty rectangles" that lock up on real data.

> Assumes Brand Header + Enforcement Block + Prompt 0 pasted above.

---

## P06 — Financial Analytics Dashboard (filters + tables + drilldowns)
*Audit: full state coverage ✓. Generate in Batch 1 — it defines the chart/table patterns.*

**COMPACT:**
```
Design a complex financial analytics dashboard. Modules:
- KPI row: MRR, ARR, churn, CAC, LTV, NRR.
- Charts: time-series, cohort retention, funnel, segmented bar.
- Table: sorting, column chooser, saved views, export.
Requirements:
- Global filters: date range, segment, plan, region + pinned filter chips.
- Drilldown: click chart -> updates table; breadcrumb back.
- States: loading, no-data, partial-data warning, permission-limited view.
Output: desktop 1440 + note how it collapses at 1024. Tables: sticky header,
virtualization notes, sorting indicators.
```

**MAX-DEPTH SYSTEM ROLE:** Principal dashboard designer (Datadog/Stripe-grade) for
expert financial users. **Layout:** top global filters (date range, entity, currency,
segment); KPI strip (Revenue, Gross Margin, Net, Cash, Burn, Runway); left cohort/segment
controls; center primary charts; bottom transaction table + anomalies panel; right insights
rail (alerts, notes, exports). **Widgets:** revenue trend (line, compare period +
annotations), margin waterfall, cashflow statement (expandable), AR/AP aging table, forecast
panel with scenario switch (base/bull/bear), threshold + anomaly alerts, chart-click drilldown
→ detail drawer + filtered table. **Output contract:** data schema + 30 sample transaction
rows; filter logic + query contract; error/loading/empty states; A11Y + keyboard-nav spec for tables.

---

## P12 — Data Ingestion & Pipeline Monitor
*Audit: full state coverage ✓.*

```
Design a UI to configure and monitor data ingestion pipelines. Modules:
- Source setup (API, CSV, webhook)
- Mapping/transform preview
- Pipeline status (success/fail/retry)
- Logs with severity filters
Requirements:
- Visual pipeline flow with per-step states.
- Real-time status indicators + retry controls.
- Error drilldown with copyable logs.
Output: include the full "Add source -> Live pipeline" interaction flow.
```

---

## P23 — Inventory / Warehouse Ops Dashboard
*Audit [FIX-5.1][FIX-3.6]: added destructive confirm + barcode scan-error state.*

```
Design an inventory ops dashboard. Modules: stock table, reorder suggestions,
shipment tracking, alerts, barcode scan entry.
Requirements:
- Critical low-stock state + audit trail.
- Barcode scan-error state (unreadable / unknown SKU) with recovery.
- Destructive actions (discard inventory changes, bulk adjust) require typed
  confirmation or re-auth.
Output: dense table layout; sticky headers; virtualization notes.
```

---

## P27 — Real-Time Operations Monitor (NOC-style)
*Audit: full state coverage ✓.*

```
Design a real-time monitoring dashboard. Modules: service map, incident feed,
metrics charts, log tail, alert routing.
Requirements:
- Dense layout, drilldowns, ack/snooze alerts, dark-mode optimized.
- Log tail with virtualization (avoid infinite DOM).
Output: 1440 baseline; describe how panels collapse at 1024.
```

---

## P16 — Incident Status & Uptime Page
*Audit: STATIC/marketing exception — full interactive states not required.*

```
Design a public-facing status page for a SaaS product. Sections: current status
banner, component uptime history, incident timeline, subscribe to updates.
Requirements:
- Color-safe status indicators (icon + label, not color alone).
- Cached fallback state when the status API is unreachable.
- Mobile-friendly timeline.
Output: accessibility-first; readable without JS where possible.
```

---

## P19 — Mobile Health Tracking Dashboard
*Audit: full state coverage ✓.*

```
Design a mobile health tracking UI. Data: daily metrics, goals, trends.
Requirements:
- Glanceable summary; touch-friendly charts.
- Data-privacy indicators (what is shared / stored locally).
Output: Android + iOS neutral design; respect reduced motion.
```
