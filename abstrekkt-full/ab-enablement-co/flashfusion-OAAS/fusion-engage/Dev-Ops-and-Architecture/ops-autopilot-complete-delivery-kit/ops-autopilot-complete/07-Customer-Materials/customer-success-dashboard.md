# Customer Success Dashboard

> **Audience:** CUST | **Phase:** Beta

---

## What Customers See

The customer dashboard (https://app.opsautopilot.com) provides real-time visibility into all workflow activity.

### Overview Panel
- **Total runs** (today / this week / this month)
- **Success rate** (gauge: green >99%, yellow >95%, red <95%)
- **Active workflows** (count and list)
- **Pending approvals** (count with direct links to approve)
- **Usage vs limits** (runs/day and concurrent — progress bars)

### Workflow Performance
- Runs per workflow (bar chart, last 7 days)
- Average execution time per workflow
- Error breakdown (by workflow, by error type)
- Success rate trend (line chart, last 30 days)

### Approval Analytics
- Pending approvals (list with age, approver, workflow)
- Approval response time (average, P95)
- Decision breakdown (approved / denied / expired)
- Escalation rate

### Audit Trail
- Searchable event log (filter by date, type, actor)
- Export to CSV/JSON
- Compliance report generator (monthly, on-demand)

### Connector Health
- Status grid: each connector shows healthy/degraded/down
- Last health check timestamp
- Error rate per connector (last 24h)

---

## Dashboard Access by Role

| Feature | service_desk_agent | manager | it_admin | compliance_officer |
|---------|-------------------|---------|----------|-------------------|
| Overview (own runs) | ✅ | ✅ | ✅ | ✅ |
| Overview (all runs) | ❌ | Team only | ✅ | ✅ |
| Workflow performance | Limited | Team | Full | Full |
| Approve/deny | ❌ | ✅ (assigned) | ✅ | ❌ |
| Audit trail | ❌ | Team | Full | Full |
| Compliance reports | ❌ | ❌ | ✅ | ✅ |
| Connector health | ✅ (view) | ✅ (view) | ✅ (manage) | ✅ (view) |
