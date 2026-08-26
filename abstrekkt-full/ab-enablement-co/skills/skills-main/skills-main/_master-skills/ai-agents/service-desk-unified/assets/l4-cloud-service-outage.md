# L4: Cloud Service Provider Outage Template

## Outage Information
- **Provider:** [AWS/Azure/GCP/Other]
- **Service Affected:** [EC2/S3/Azure VMs/etc]
- **Region:** [us-east-1/etc]
- **Start Time:** [YYYY-MM-DD HH:MM TZ]
- **Provider Status:** [service-status-url]
- **Severity:** [Widespread/Regional/Service-Specific]

## Internal Impact
- **Applications Affected:** _________________
- **Users Affected:** [Count/%]
- **Business Impact:** [Revenue/Operations/Customer]
- **Data Accessibility:** [Full/Partial/None]
- **Workaround Available:** [Yes/No]

## Provider Communication
**Status Page Updates:**
- [HH:MM] - _________________
- [HH:MM] - _________________

**Support Case:** [CASE-####]
**Severity Level:** [SEV 1/2/3]
**ETA:** [If provided]

## Multi-Region Failover Assessment
- **DR Region Available:** [Yes/No - Region]
- **Auto-Failover Configured:** [Yes/No]
- **Manual Failover Possible:** [Yes/No]
- **Failover Time:** [Estimated minutes]
- **Data Sync Status:** [Current/Lag: X minutes]

## Immediate Actions

### Monitoring
- [ ] Check provider status dashboard
- [ ] Monitor internal systems
- [ ] Track error rates
- [ ] Review metrics/dashboards
- [ ] Document error patterns

### Communication
- [ ] Notify leadership
- [ ] Update internal status page
- [ ] Inform affected users
- [ ] Coordinate with teams
- [ ] Prepare customer communication

### Mitigation
- [ ] Implement workaround (if available)
- [ ] Failover to DR region
- [ ] Route traffic to backup
- [ ] Scale remaining capacity
- [ ] Throttle non-critical services

## Provider Engagement

### Support Case Details
```
Case ID: [CASE-####]
Opened: [YYYY-MM-DD HH:MM]
Severity: [1-4]
Contact: [TAM/Engineer Name]
Phone: [Emergency number if available]
```

### Escalation Path
- [ ] Standard support engaged
- [ ] TAM notified
- [ ] Management escalation requested
- [ ] Executive briefing (if needed)

## Workaround Implementation
**Option 1:** _________________
- Complexity: [Low/Medium/High]
- Time to implement: [Minutes]
- Limitations: _________________

**Option 2:** _________________
- Complexity: [Low/Medium/High]
- Time to implement: [Minutes]
- Limitations: _________________

**Selected:** [Option X]
**Implemented:** [Yes/No - Time]
**Effective:** [Yes/No - Notes]

## Business Continuity
- **Critical Functions:** [Operational/Degraded/Down]
- **Revenue Impact:** $[Amount/hour]
- **SLA Breach:** [Yes/No]
- **Customer Notifications:** [Sent/In Progress]
- **Media Relations:** [Involved/Not Needed]

## Service Recovery Tracking

| Service | Status | Workaround | ETA | Notes |
|---------|--------|------------|-----|-------|
| [Service] | [Up/Degraded/Down] | [Yes/No] | [Time] | [...] |

## Post-Outage Actions

### When Service Restores
- [ ] Verify full functionality
- [ ] Test all integrations
- [ ] Monitor for stability (4 hours)
- [ ] Failback from DR (if used)
- [ ] Resume normal operations

### Documentation
- [ ] Timeline documented
- [ ] Impact assessment completed
- [ ] Mitigation steps recorded
- [ ] Lessons learned captured

## Provider Accountability

### SLA Review
- **SLA Commitment:** [99.XX%]
- **Actual Uptime:** [99.XX%]
- **Breach:** [Yes/No]
- **Credit Eligible:** [Yes/No - $Amount]

### Credit Request
```
Downtime: [Minutes]
Affected Services: _________________
Estimated Credit: $[Amount]
Status: [Requested/Approved/Applied]
```

### Root Cause (from Provider)
**Provided RCA:** [Yes/No - Link]
**Summary:** _________________
**Prevention Measures:** _________________

## Internal Review

### Architectural Improvements
1. [ ] Implement multi-region
2. [ ] Add redundancy
3. [ ] Improve monitoring
4. [ ] Automate failover
5. [ ] Review SLAs

### Process Improvements
1. [ ] Update runbooks
2. [ ] Enhance alerting
3. [ ] Improve communication
4. [ ] Test DR procedures
5. [ ] Train team

## Final Metrics
- **Outage Duration:** [HH:MM]
- **Detection Time:** [Minutes]
- **Response Time:** [Minutes]
- **Mitigation Time:** [Minutes]
- **Resolution Time:** [HH:MM]
- **Users Impacted:** [Count]
- **Revenue Impact:** $[Amount]

## Lessons Learned
**What Went Well:**
1. _________________
2. _________________

**What Didn't:**
1. _________________
2. _________________

**Action Items:**
1. _________________
2. _________________

---
**Status:** [Resolved/Monitoring]
**Follow-up:** Review architecture resiliency
