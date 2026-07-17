# L2: Backup/Restore Failure Template

## Backup Information
- **System:** [Server/Application/Database]
- **Backup Type:** [Full/Incremental/Differential]
- **Backup Tool:** [Veeam/CommVault/Azure Backup]
- **Failure Type:** [Backup Failed/Restore Failed]
- **Ticket ID:** [TICKET-####]

## Failure Details
- **Failed Date/Time:** [YYYY-MM-DD HH:MM]
- **Last Successful Backup:** [YYYY-MM-DD]
- **Error Code:** _________________
- **Error Message:** _________________

## Impact Assessment
- **RPO Risk:** [Hours/Days since last backup]
- **Business Impact:** [Critical/High/Medium]
- **Data at Risk:** [Size/Type]
- **Compliance Issue:** [Yes/No]

## Initial Diagnostics

### Backup Status Check
- [ ] Verify backup schedule
- [ ] Check backup job logs
- [ ] Review backup server status
- [ ] Check storage capacity

### Common Failure Reasons
- [ ] Insufficient storage space
- [ ] Network connectivity issue
- [ ] Service account credentials expired
- [ ] File locks/open files
- [ ] VSS/snapshot failure
- [ ] Repository corruption

## Diagnostic Commands
```
# Check backup job status
# Check storage space on target
# Review application/system logs
# Verify network path to repository
# Test service account permissions
```

## Resolution Steps

### Storage Issue
- [ ] Check available space
- [ ] Clean old backups
- [ ] Extend storage capacity
- [ ] Result: _________________

### Connectivity Issue
- [ ] Test network path
- [ ] Verify firewall rules
- [ ] Check DNS resolution
- [ ] Result: _________________

### Credentials Issue
- [ ] Verify service account
- [ ] Reset password if expired
- [ ] Update backup configuration
- [ ] Result: _________________

### Application Issue
- [ ] Check VSS writers
- [ ] Close open files/connections
- [ ] Restart backup agent
- [ ] Result: _________________

## Backup Recovery
- [ ] Manual backup initiated
- [ ] Backup completed successfully
- [ ] Backup validated/tested
- [ ] Schedule re-enabled

## Restore Testing (if applicable)
- [ ] Test restore to alternate location
- [ ] Verify data integrity
- [ ] Check file timestamps
- [ ] Validate application functionality

## Monitoring Enhancement
- [ ] Configure alerting for failures
- [ ] Add capacity monitoring
- [ ] Schedule regular test restores
- [ ] Document known issues

## Resolution
- **Backup Operational:** [Yes/No]
- **RPO Met:** [Yes/No]
- **Root Cause:** _________________
- **Permanent Fix:** _________________

## Escalation to L3
Escalate if:
- Repository corruption detected
- Hardware failure suspected
- Requires vendor support
- Complex restore scenario

---
**SLA Target:** 4 hours
**Critical:** Test restore monthly
