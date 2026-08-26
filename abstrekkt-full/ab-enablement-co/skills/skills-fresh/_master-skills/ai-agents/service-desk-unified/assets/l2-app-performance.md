# L2: Application Performance Degradation Template

## Incident Information
- **Application:** [App Name/Version]
- **Affected Users:** [Count / Department / All]
- **Severity:** [P1/P2/P3]
- **Started:** [Date/Time]
- **Ticket ID:** [TICKET-####]

## Symptoms
- [ ] Application slow to load (>30 seconds)
- [ ] Operations timing out
- [ ] High memory usage
- [ ] High CPU usage
- [ ] Frequent crashes
- [ ] Unresponsive UI

## Scope Assessment
- **Users Affected:** [X / Total]
- **Geographic Distribution:** [Office/Region/Global]
- **Pattern:** [Time of day, specific action, random]

## Diagnostic Steps

### Client-Side Metrics
- CPU Usage: [XX%]
- Memory Usage: [XX GB]
- Disk I/O: [XX MB/s]
- Network Latency: [XX ms]

### Application Logs
- Location: _________________
- Error Messages: _________________
- Stack Traces: _________________

## Common Fixes

### Memory Leak
- [ ] Restart application service
- [ ] Clear cache
- [ ] Update to latest patch

### Database Contention
- [ ] Review slow queries
- [ ] Rebuild indexes
- [ ] Optimize queries

### Network Bottleneck
- [ ] Check bandwidth utilization
- [ ] Test alternative route
- [ ] Check DNS resolution

## Resolution
- **Issue Resolved:** [Yes/No]
- **Root Cause:** _________________
- **Time to Resolve:** [Hours]

## Escalation to L3
Escalate if:
- Code-level issues suspected
- Database architecture problems
- Infrastructure capacity issues

---
**SLA Target:** 4 hours
