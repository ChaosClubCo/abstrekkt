# L3: Root Cause Analysis (RCA) Template

## Incident Overview
- **Incident ID:** [INC-####]
- **Service:** [Affected Service/System]
- **Impact:** [Severity/Users/Revenue]
- **Start Time:** [YYYY-MM-DD HH:MM TZ]
- **End Time:** [YYYY-MM-DD HH:MM TZ]
- **Duration:** [Hours/Minutes]
- **Status:** [Resolved/In Progress]

## Executive Summary
[2-3 sentences describing what happened, impact, and resolution]

## Timeline of Events

| Time | Event | Action Taken | Owner |
|------|-------|--------------|-------|
| [HH:MM] | [Event description] | [Action] | [Name] |
| [HH:MM] | [Event description] | [Action] | [Name] |

## Impact Assessment
- **Users Affected:** [Count / Percentage]
- **Business Impact:** [Revenue/SLA/Customer]
- **Data Loss:** [Yes/No - Details]
- **Security Impact:** [Yes/No - Details]
- **Reputation Impact:** [Low/Medium/High]

## Root Cause Analysis

### 5 Whys Method
1. **Why did the incident occur?**
   Answer: _________________
   
2. **Why [answer from #1]?**
   Answer: _________________
   
3. **Why [answer from #2]?**
   Answer: _________________
   
4. **Why [answer from #3]?**
   Answer: _________________
   
5. **Why [answer from #4]?**
   Answer: _________________

### Identified Root Cause
**Primary Cause:** _________________

**Contributing Factors:**
1. _________________
2. _________________
3. _________________

### Root Cause Category
- [ ] Human Error
- [ ] Process Failure
- [ ] Technology Failure
- [ ] External Dependency
- [ ] Capacity/Performance
- [ ] Security/Compliance
- [ ] Design Flaw

## Technical Analysis

### System State Before Incident
```
Configuration: _________________
Load: _________________
Recent Changes: _________________
Monitoring Alerts: _________________
```

### What Went Wrong
```
Component: _________________
Failure Mode: _________________
Error Messages: _________________
Logs: _________________
```

### Why Detection Was Delayed
- [ ] Monitoring gap
- [ ] Alert not configured
- [ ] Alert ignored/missed
- [ ] Normal business hours delay
- **Detection Time:** [Minutes from start]

## Resolution Details

### Immediate Actions (Stop the Bleeding)
1. _________________
2. _________________
3. _________________

### Workaround Applied
```
Workaround: _________________
Effective: [Yes/No]
Duration: [Until permanent fix]
```

### Permanent Fix
```
Solution: _________________
Implemented: [Date/Time]
Tested: [Yes/No]
Verified: [Yes/No]
```

## Lessons Learned

### What Went Well
1. _________________
2. _________________
3. _________________

### What Didn't Go Well
1. _________________
2. _________________
3. _________________

### Where We Got Lucky
1. _________________
2. _________________

## Corrective Actions

| Action | Owner | Due Date | Priority | Status |
|--------|-------|----------|----------|--------|
| [Action item] | [Name] | [Date] | [P0-P3] | [Open/Done] |

### Prevention Actions
1. _________________
2. _________________

### Detection Actions
1. _________________
2. _________________

### Response Actions
1. _________________
2. _________________

## Risk Assessment

### Could This Happen Again?
**Likelihood:** [Low/Medium/High]
**If No Action Taken:** _________________

### Blast Radius if Repeated
- **Same Impact:** [Yes/No]
- **Worse Impact Possible:** [Yes/No]
- **Cascading Failures:** [Yes/No]

## Monitoring & Alerting Improvements
- [ ] New monitor: _________________
- [ ] Alert threshold: _________________
- [ ] Dashboard update: _________________
- [ ] Runbook created/updated

## Documentation Updates
- [ ] Wiki/KB article: [Link]
- [ ] Runbook: [Link]
- [ ] Architecture diagram: [Link]
- [ ] Training material: [Link]

## Communication

### Stakeholders Notified
- [ ] Leadership
- [ ] Affected teams
- [ ] Customers
- [ ] Vendors

### Post-Incident Report Distributed
- **Date:** [YYYY-MM-DD]
- **Recipients:** _________________
- **Follow-up Meeting:** [Scheduled/Completed]

## Review & Approval
- **Prepared By:** [Name/Date]
- **Reviewed By:** [Name/Date]
- **Approved By:** [Name/Date]

---
**Next Review:** [30/60/90 days]
**Status Check:** Verify corrective actions complete
