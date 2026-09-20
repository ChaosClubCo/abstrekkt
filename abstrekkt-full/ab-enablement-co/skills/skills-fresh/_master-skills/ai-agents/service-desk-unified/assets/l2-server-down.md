# L2: Server Down/Unresponsive Template

## Server Information
- **Server Name:** [hostname]
- **IP Address:** [XX.XX.XX.XX]
- **Role:** [Web/DB/App/File Server]
- **OS:** [Windows/Linux Version]
- **Criticality:** [P0/P1/P2]
- **Affected Services:** _________________

## Impact Assessment
- **Users Affected:** [Count/Department/All]
- **Business Impact:** [Critical/High/Medium/Low]
- **Revenue Impact:** [Yes/No - $Amount]
- **SLA Breach:** [Yes/No]
- **Start Time:** [YYYY-MM-DD HH:MM]

## Symptoms
- [ ] Server not pingable
- [ ] No remote access (RDP/SSH)
- [ ] Services not responding
- [ ] High resource usage (CPU/RAM/Disk)
- [ ] Kernel panic/BSOD
- [ ] Disk full

## Initial Diagnostics

### Network Check
```bash
ping [server-ip]
Result: [Reachable/Unreachable]

traceroute [server-ip]
Hops: [Count] Last hop: _________________

Port check:
nmap -p 22,80,443,3389 [server-ip]
Open ports: _________________
```

### Out-of-Band Access
- [ ] iLO/iDRAC/IPMI accessible
- [ ] Console access obtained
- [ ] BIOS POST successful
- [ ] OS loading: [Yes/No]

### Resource Check (if accessible)
```
CPU: [XX%] - Threshold: 90%
Memory: [XX%] - Threshold: 90%
Disk: [XX%] - Threshold: 90%
Network: [XX Mbps]
```

## Actions Taken

### Immediate Recovery
1. [ ] Attempted ping/connection
2. [ ] Checked monitoring alerts
3. [ ] Accessed out-of-band management
4. [ ] Reviewed console/logs
5. [ ] Attempted graceful restart
6. [ ] Performed hard reset (if necessary)

### Service Recovery
- [ ] Server booted successfully
- [ ] Services started automatically
- [ ] Services started manually
- [ ] Database recovered
- [ ] Application tested

## Root Cause Investigation
```
Logs Reviewed:
- System logs: _________________
- Application logs: _________________
- Event viewer: _________________

Error Messages:
_________________

Recent Changes:
_________________

Resource Exhaustion:
- CPU spike: [Yes/No]
- Memory leak: [Yes/No]
- Disk full: [Yes/No]
- Network saturation: [Yes/No]
```

## Restore Actions
1. _________________
2. _________________
3. _________________

## Verification
- [ ] Server pingable
- [ ] Services running
- [ ] Applications functional
- [ ] Users can connect
- [ ] Performance acceptable
- [ ] Monitoring restored

## Downtime Summary
- **Start:** [YYYY-MM-DD HH:MM]
- **Server Restored:** [YYYY-MM-DD HH:MM]
- **Services Restored:** [YYYY-MM-DD HH:MM]
- **Total Downtime:** [HH:MM]

## Resolution
- **Server Operational:** [Yes/No]
- **Root Cause:** _________________
- **Permanent Fix:** _________________
- **Monitoring Enhanced:** [Yes/No]

## Escalation to L3
Escalate if:
- Hardware failure suspected
- Requires vendor support
- Complex troubleshooting needed
- Multiple restart attempts failed

---
**SLA Target:** 1 hour
**Follow-up:** RCA required for P0/P1
