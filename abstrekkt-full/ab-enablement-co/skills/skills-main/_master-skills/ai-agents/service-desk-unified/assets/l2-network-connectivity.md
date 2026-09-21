# L2: Network Connectivity Issues Template

## Incident Information
- **Affected Segment:** [VLAN/Subnet/Building]
- **Impact Scope:** [Users/Devices/Services affected]
- **Connectivity Type:** [LAN/WAN/Wireless/Internet]
- **Severity:** [P1/P2/P3]
- **Ticket ID:** [TICKET-####]

## Symptoms
- [ ] Complete network outage
- [ ] Intermittent connectivity
- [ ] Slow network performance
- [ ] DNS resolution failures
- [ ] Routing issues
- [ ] DHCP failures
- [ ] Specific subnet unreachable

## Network Topology Check
```
Affected Devices: [Count/List]
Switch/Router: [Model/IP]
VLAN: [Number/Name]
Subnet: [XX.XX.XX.XX/XX]
Gateway: [IP Address]
```

## Diagnostic Commands

### Layer 1 (Physical)
```bash
# Check interface status
show interface status
show interface gi0/1

# Check errors
show interface counters errors

# Cable test (if supported)
test cable-diagnostics tdr interface gi0/1
```
**Findings:** _________________

### Layer 2 (Data Link)
```bash
# MAC address table
show mac address-table

# Spanning tree status
show spanning-tree

# VLAN configuration
show vlan brief

# Port channel status
show etherchannel summary
```
**Findings:** _________________

### Layer 3 (Network)
```bash
# Routing table
show ip route

# ARP table
show arp

# Ping gateway
ping [gateway-ip]

# Traceroute
traceroute [destination]
```
**Findings:** _________________

### DNS/DHCP Check
```bash
# DNS resolution test
nslookup company.com [dns-server]

# DHCP scope status
show ip dhcp binding
show ip dhcp pool

# Check DHCP leases
# Check DNS zones
```
**Findings:** _________________

## Performance Metrics
```
Bandwidth Utilization: [XX%] (Max: 80%)
Packet Loss: [XX%] (Acceptable: <1%)
Latency: [XX ms] (Acceptable: <50ms)
Jitter: [XX ms] (Acceptable: <10ms)
```

## Common Issues & Fixes

### Issue: Port Down
- [ ] Check physical cable
- [ ] Check port configuration
- [ ] Bounce port (shut/no shut)
- [ ] Check speed/duplex mismatch
- [ ] Replace cable if needed
- **Result:** _________________

### Issue: DHCP Exhaustion
- [ ] Check available leases
- [ ] Clear stale leases
- [ ] Expand scope (if needed)
- [ ] Identify lease hogs
- **Result:** Available IPs: [XX]

### Issue: Routing Problem
- [ ] Verify routing table
- [ ] Check static routes
- [ ] Verify routing protocol
- [ ] Check route advertisement
- **Result:** _________________

### Issue: DNS Failure
- [ ] Test primary DNS
- [ ] Test secondary DNS
- [ ] Check DNS zone transfer
- [ ] Verify forwarders
- [ ] Clear DNS cache
- **Result:** _________________

### Issue: Broadcast Storm
- [ ] Identify source port
- [ ] Check spanning tree
- [ ] Disable problematic port
- [ ] Check for loops
- **Result:** Storm stopped: [Yes/No]

## Configuration Changes
```
Device: [Switch/Router Name]
Change: _________________
Backup Taken: [Yes/No]
Rollback Plan: _________________
```

## Affected Services
- [ ] Internet access
- [ ] Email
- [ ] File shares
- [ ] VoIP
- [ ] Applications: _________________

## Resolution
- **Connectivity Restored:** [Yes/No]
- **Root Cause:** _________________
- **Downtime Duration:** [Minutes]
- **Permanent Fix Required:** [Yes/No]

## Escalation to L3
Escalate if:
- Router/switch replacement needed
- Complex routing issues
- ISP involvement required
- Firewall rule changes needed
- Infrastructure design issue

---
**SLA Target:** 1 hour
**Follow-up:** Monitor for 4 hours
