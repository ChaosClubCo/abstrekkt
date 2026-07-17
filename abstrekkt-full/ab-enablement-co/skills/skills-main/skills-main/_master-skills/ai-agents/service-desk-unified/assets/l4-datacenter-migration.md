# L4: Data Center Migration Template

## Migration Overview
- **Project ID:** [DC-MIG-####]
- **Source DC:** [Location/Provider]
- **Target DC:** [Location/Provider]
- **Migration Type:** [Physical/Cloud/Hybrid]
- **Planned Start:** [YYYY-MM-DD]
- **Planned Completion:** [YYYY-MM-DD]
- **Project Manager:** [Name]

## Business Justification
- **Driver:** [Cost/Performance/Compliance/DR/EOL]
- **Expected Benefits:** _________________
- **Total Budget:** $[Amount]
- **ROI Timeline:** [Months]

## Scope Assessment

### Systems in Scope
- **Servers:** [Count]
- **Storage:** [XX TB]
- **Network Devices:** [Count]
- **Applications:** [Count]
- **Databases:** [Count]

### Applications Priority
| Application | Criticality | Users | Downtime Tolerance | Migration Wave |
|-------------|-------------|-------|-------------------|----------------|
| [App1] | P0 | [Count] | [0h] | Wave 1 |
| [App2] | P1 | [Count] | [4h] | Wave 2 |

## Migration Strategy

### Approach
- [ ] Lift-and-shift (physical migration)
- [ ] Re-platform (cloud native)
- [ ] Hybrid (phased approach)
- [ ] Parallel run (cutover after validation)

### Migration Waves
**Wave 1 (Non-critical):** [Dates]
- Systems: _________________
- Risk: Low
- Rollback: Easy

**Wave 2 (Business apps):** [Dates]
- Systems: _________________
- Risk: Medium
- Rollback: Moderate

**Wave 3 (Critical systems):** [Dates]
- Systems: _________________
- Risk: High
- Rollback: Complex

## Risk Assessment

### Technical Risks
1. **Risk:** Network latency increase
   - **Probability:** [High/Medium/Low]
   - **Impact:** [High/Medium/Low]
   - **Mitigation:** _________________

2. **Risk:** Application compatibility
   - **Probability:** [High/Medium/Low]
   - **Impact:** [High/Medium/Low]
   - **Mitigation:** _________________

3. **Risk:** Data loss during migration
   - **Probability:** [High/Medium/Low]
   - **Impact:** [Critical]
   - **Mitigation:** _________________

### Business Risks
- **Revenue Impact:** $[Amount if failed]
- **Compliance Breach:** [Yes/No - Details]
- **Customer Impact:** [Count/Percentage]

## Pre-Migration Preparation

### Week -8 to -4
- [ ] Complete discovery and assessment
- [ ] Design target architecture
- [ ] Procure hardware/services
- [ ] Setup target environment
- [ ] Configure network connectivity

### Week -4 to -2
- [ ] Test migration procedures
- [ ] Validate application compatibility
- [ ] Setup monitoring
- [ ] Train teams
- [ ] Create runbooks

### Week -2 to 0
- [ ] Final backup verification
- [ ] Freeze change control
- [ ] Stakeholder communication
- [ ] Execute pilot migration
- [ ] Validate pilot success

## Migration Execution

### Network Setup
- [ ] Establish WAN links
- [ ] Configure VPN tunnels
- [ ] Update DNS
- [ ] Setup load balancers
- [ ] Test connectivity

### Data Migration
```
Phase 1: Initial Sync
- Start date: [YYYY-MM-DD]
- Method: [Robocopy/rsync/Storage replication]
- Data volume: [XX TB]
- Transfer time: [Hours]

Phase 2: Delta Sync
- Frequency: [Daily/Hourly]
- Keep in sync until cutover

Phase 3: Final Sync
- During maintenance window
- Cutover once complete
```

### Server Migration
```
For each server:
1. [ ] Final backup
2. [ ] Shutdown source
3. [ ] Migrate/build target
4. [ ] Start services
5. [ ] Validate functionality
6. [ ] Update DNS/monitoring
7. [ ] Decommission source
```

### Application Cutover
```
Cutover Window: [Start - End]

Steps:
1. [ ] Maintenance mode ON
2. [ ] Stop application services
3. [ ] Final data sync
4. [ ] Update connection strings
5. [ ] Start services on target
6. [ ] Smoke test
7. [ ] DNS cutover
8. [ ] Monitor for 2 hours
9. [ ] Maintenance mode OFF
```

## Validation Testing

### Technical Validation
- [ ] Server accessibility
- [ ] Network performance
- [ ] Storage performance
- [ ] Backup functionality
- [ ] Monitoring active

### Application Validation
- [ ] User authentication
- [ ] Core functionality
- [ ] Data integrity
- [ ] Performance acceptable
- [ ] Integrations working

### User Acceptance
- [ ] Power users test
- [ ] Performance validated
- [ ] No critical issues
- [ ] User training complete

## Rollback Plan

### Rollback Triggers
- Migration fails > 2 attempts
- Data corruption detected
- Performance degradation > 50%
- Critical functionality broken
- Cannot meet maintenance window

### Rollback Procedure
```
1. [ ] Stop services on target
2. [ ] Revert DNS changes
3. [ ] Start services on source
4. [ ] Validate functionality
5. [ ] Communicate status
6. [ ] Schedule retry

Rollback Time: [XX hours]
```

## Post-Migration

### Immediate (Week 0-1)
- [ ] 24/7 monitoring
- [ ] Hypercare support
- [ ] Daily status reports
- [ ] Performance trending
- [ ] Issue tracking

### Short-term (Week 2-4)
- [ ] Optimize configuration
- [ ] Decommission source
- [ ] Update documentation
- [ ] Team training
- [ ] Cost validation

### Long-term (Month 2-3)
- [ ] Performance baseline
- [ ] Capacity planning
- [ ] Lessons learned
- [ ] Process improvements
- [ ] Contract closeout

## Success Criteria
- [ ] All systems migrated successfully
- [ ] Zero data loss
- [ ] Performance meets baseline
- [ ] Users operational
- [ ] Within budget
- [ ] RTO/RPO maintained

## Communication Plan

### Stakeholders
- **Executive:** Weekly updates
- **Users:** 2-week notice, cutover day, completion
- **Teams:** Daily standup during migration
- **Vendors:** As needed coordination

### Status Reporting
```
Daily (during migration):
- Systems migrated: [X/Total]
- Issues encountered: [Count]
- Hours remaining: [XX]

Weekly (post-migration):
- Stability report
- Performance metrics
- Open issues
```

## Budget Tracking
- **Hardware/Cloud:** $[Amount]
- **Network/Connectivity:** $[Amount]
- **Professional Services:** $[Amount]
- **Downtime Cost:** $[Amount]
- **Total Actual:** $[Amount]
- **Variance:** $[Amount] ([+/- %])

## Lessons Learned
**What Went Well:**
1. _________________
2. _________________

**What Didn't:**
1. _________________
2. _________________

**Recommendations:**
1. _________________
2. _________________

## Project Closure
- **Migration Complete:** [Yes/No]
- **All Systems Operational:** [Yes/No]
- **Documentation Updated:** [Yes/No]
- **Project Closed:** [Date]

---
**Post-Migration Review:** [30/60/90 days]
**Next Major Project:** [Description]
