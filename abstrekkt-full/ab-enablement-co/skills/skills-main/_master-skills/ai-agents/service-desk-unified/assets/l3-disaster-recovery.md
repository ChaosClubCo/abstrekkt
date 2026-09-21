# L3: Disaster Recovery Activation Template

## DR Event Information
- **DR ID:** [DR-####]
- **Event Type:** [Site Failure/Cyberattack/Natural Disaster/Data Center Outage]
- **Declared:** [YYYY-MM-DD HH:MM]
- **Severity:** [Total/Partial/Test]
- **Primary Site:** [Location]
- **DR Site:** [Location]

## Impact Assessment
- **Services Affected:** _________________
- **Users Affected:** [Count/%]
- **Data Loss:** [Yes/No - RPO breach]
- **Downtime Expected:** [Hours]
- **Business Impact:** [Critical/High]

## DR Plan Activation
- [ ] DR team assembled
- [ ] Management notified
- [ ] Stakeholders informed
- [ ] DR site prepared
- [ ] Runbooks retrieved

## Pre-Activation Checklist
- [ ] Verify primary site truly down
- [ ] Assess DR site readiness
- [ ] Check last backup timestamp
- [ ] Verify network connectivity
- [ ] Confirm resource availability

## Recovery Objectives
- **RTO (Recovery Time Objective):** [4 hours]
- **RPO (Recovery Point Objective):** [15 minutes]
- **Target Recovery Time:** [YYYY-MM-DD HH:MM]

## System Recovery Priority
1. [P0] Domain Controllers
2. [P0] Email servers
3. [P0] Core business applications
4. [P1] File servers
5. [P1] Database servers
6. [P2] Collaboration tools
7. [P3] Non-critical systems

## Recovery Steps

### Network Infrastructure
- [ ] DR site network active
- [ ] VPN tunnels established
- [ ] DNS updated to DR IPs
- [ ] Firewall rules applied
- [ ] Load balancer configured

### Server Recovery
```
For each critical server:
1. [ ] Restore from backup
2. [ ] Verify boot sequence
3. [ ] Start services
4. [ ] Test connectivity
5. [ ] Validate functionality

Servers restored: [X/Total]
```

### Application Recovery
- [ ] Database restored to DR
- [ ] Application servers started
- [ ] Configuration verified
- [ ] Integration tested
- [ ] Performance validated

### Data Validation
- [ ] Check backup integrity
- [ ] Verify data completeness
- [ ] Test critical transactions
- [ ] Confirm no corruption
- **Data Loss:** [Yes/No - Amount]

## User Communication
**Initial Notification (Sent: __):**
```
Subject: DR Activation - Service Disruption

We are experiencing [issue] affecting [systems].
DR procedures activated.
Estimated restoration: [time]
Updates every 30 minutes.
```

**Status Updates:**
- [HH:MM] - _________________
- [HH:MM] - _________________

**Resolution Notification:**
```
Services restored at DR site.
Access via: [URLs/IPs]
Primary site recovery underway.
```

## Recovery Progress Tracking

| System | Priority | Start | Complete | Status | Notes |
|--------|----------|-------|----------|--------|-------|
| DC01 | P0 | 10:00 | 10:15 | ✓ | Functional |
| Email | P0 | 10:15 | 10:45 | ✓ | Functional |
| ... | ... | ... | ... | ... | ... |

## Service Validation
- [ ] User authentication working
- [ ] Email sending/receiving
- [ ] Core applications accessible
- [ ] Data integrity confirmed
- [ ] Performance acceptable
- [ ] Monitoring active

## Failback Planning
**When to Fail Back:**
- Primary site fully operational
- All systems tested
- Planned maintenance window
- Business approval obtained

**Failback Steps:**
1. _________________
2. _________________
3. _________________

## Post-DR Review
- **RTO Met:** [Yes/No - Actual: X hours]
- **RPO Met:** [Yes/No - Data loss: X minutes]
- **Total Downtime:** [HH:MM]
- **Services Restored:** [Count/Total]
- **Issues Encountered:** _________________

## Lessons Learned
**What Worked:**
1. _________________
2. _________________

**What Didn't:**
1. _________________
2. _________________

**Improvements Needed:**
1. _________________
2. _________________

## Final Status
- **DR Successful:** [Yes/No]
- **Services Operational:** [Yes/No]
- **Users Functional:** [Yes/No]
- **Failback Required:** [Yes/No - When]

---
**Next Test:** [Quarterly DR test]
**Plan Update:** Within 30 days
