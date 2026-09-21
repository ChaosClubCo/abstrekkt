# L1: VPN Connection Troubleshooting Template

## User Information
- **User:** [Full Name]
- **Username:** [username]
- **Location:** [Office/Remote]
- **Device:** [Laptop/Desktop Model]
- **OS:** [Windows 10/11, macOS Version]
- **VPN Client:** [Client Version]
- **Ticket ID:** [TICKET-####]

## Symptoms
- [ ] Cannot connect to VPN
- [ ] Connection drops frequently
- [ ] Slow VPN performance
- [ ] Authentication fails
- [ ] Connected but no network access
- [ ] Error message: _________________

## Initial Diagnostics

### Network Connectivity
- [ ] Internet working: ping 8.8.8.8
- [ ] Can reach VPN gateway: ping vpn.company.com
- [ ] DNS resolving: nslookup vpn.company.com

### Client Status
- [ ] VPN client installed: Version _______
- [ ] VPN client running: [Yes/No]
- [ ] Firewall blocking: [Yes/No]
- [ ] Antivirus interference: [Yes/No]

## Common Fixes Applied

### Fix 1: Client Restart
- [ ] Closed VPN client
- [ ] Restarted VPN service
- [ ] Attempted connection
- **Result:** [Success/Failed]

### Fix 2: Credentials Check
- [ ] Password verified
- [ ] MFA token refreshed
- [ ] Account not locked
- **Result:** [Success/Failed]

### Fix 3: Client Reinstall
- [ ] Uninstalled VPN client
- [ ] Deleted old profiles
- [ ] Installed latest version
- [ ] Imported new profile
- **Result:** [Success/Failed]

## Resolution
- **Issue Resolved:** [Yes/No]
- **Solution Applied:** _________________
- **Time to Resolve:** [Minutes]
- **User Confirmed Access:** [Yes/No]

## Escalation Criteria
Escalate to L2 if:
- All L1 fixes failed
- Multiple users affected
- Certificate/infrastructure issues
- Issue persists > 30 minutes

---
**SLA Target:** 30 minutes
