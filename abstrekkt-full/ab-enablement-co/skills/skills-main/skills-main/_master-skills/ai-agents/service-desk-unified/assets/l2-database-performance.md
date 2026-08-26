# L2: Database Performance Issues Template

## Incident Information
- **Database:** [SQL Server/PostgreSQL/MySQL/Oracle]
- **Server:** [Hostname/IP]
- **Affected Application:** [App Name]
- **Impact:** [Users/Transactions affected]
- **Severity:** [P1/P2/P3]
- **Ticket ID:** [TICKET-####]

## Symptoms
- [ ] Slow query response (>5 seconds)
- [ ] Connection timeouts
- [ ] Deadlocks occurring
- [ ] High CPU usage (>80%)
- [ ] High memory usage
- [ ] Disk I/O bottleneck
- [ ] Connection pool exhausted

## Quick Metrics
```sql
-- Active connections
SELECT COUNT(*) FROM sys.dm_exec_sessions WHERE is_user_process = 1;
Current: [XX] / Max: [XX]

-- Blocking queries
SELECT * FROM sys.dm_exec_requests WHERE blocking_session_id <> 0;
Count: [XX]

-- Wait statistics
SELECT TOP 10 * FROM sys.dm_os_wait_stats ORDER BY wait_time_ms DESC;
Top wait: _________________
```

## Diagnostic Queries

### Long Running Queries
```sql
-- Find queries running > 30 seconds
SELECT r.session_id, r.status, r.command, r.cpu_time, r.total_elapsed_time,
       t.text, qp.query_plan
FROM sys.dm_exec_requests r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
CROSS APPLY sys.dm_exec_query_plan(r.plan_handle) qp
WHERE r.total_elapsed_time > 30000;
```
**Findings:** _________________

### Index Fragmentation
```sql
-- Check fragmentation levels
SELECT OBJECT_NAME(ips.object_id) AS TableName,
       i.name AS IndexName,
       ips.avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 30;
```
**Action Required:** [Yes/No]

### Missing Indexes
```sql
-- Identify missing indexes
SELECT migs.avg_user_impact * (migs.user_seeks + migs.user_scans) AS Impact,
       mid.statement AS TableName,
       mid.equality_columns,
       mid.inequality_columns,
       mid.included_columns
FROM sys.dm_db_missing_index_groups mig
JOIN sys.dm_db_missing_index_group_stats migs ON mig.index_group_handle = migs.group_handle
JOIN sys.dm_db_missing_index_details mid ON mig.index_handle = mid.index_handle
ORDER BY Impact DESC;
```
**Recommendations:** _________________

## Common Issues & Resolutions

### Issue: Query Timeout
- [ ] Identified slow query
- [ ] Checked execution plan
- [ ] Missing index detected
- [ ] Created index
- [ ] Updated statistics
- **Result:** Query time: [Before: XX s → After: XX s]

### Issue: Blocking/Deadlocks
- [ ] Identified blocking chain
- [ ] Killed blocking session (if safe)
- [ ] Reviewed transaction isolation level
- [ ] Optimized query order
- **Result:** _________________

### Issue: Connection Pool Exhausted
- [ ] Current pool size: [XX]
- [ ] Increased pool size to: [XX]
- [ ] Fixed connection leaks in app
- [ ] Implemented connection timeout
- **Result:** _________________

### Issue: High CPU
- [ ] Identified expensive queries
- [ ] Optimized query plans
- [ ] Updated statistics
- [ ] Parameter sniffing issue: [Yes/No]
- **Result:** CPU usage: [Before: XX% → After: XX%]

## Performance Baseline
| Metric | Baseline | Current | Status |
|--------|----------|---------|--------|
| Avg Query Time | <1s | [X]s | [OK/WARN/CRIT] |
| Active Connections | <100 | [X] | [OK/WARN/CRIT] |
| CPU % | <60% | [X]% | [OK/WARN/CRIT] |
| Disk Queue | <5 | [X] | [OK/WARN/CRIT] |

## Actions Taken
1. _________________
2. _________________
3. _________________

## Resolution
- **Issue Resolved:** [Yes/No]
- **Root Cause:** _________________
- **Performance Improved:** [XX%]
- **Monitoring Enabled:** [Yes/No]

## Escalation to L3
Escalate if:
- Complex query optimization needed
- Schema design issues
- Requires DBA expertise
- Infrastructure upgrade needed
- Issue persists after optimization

---
**SLA Target:** 2 hours
**Follow-up:** Monitor for 24 hours
