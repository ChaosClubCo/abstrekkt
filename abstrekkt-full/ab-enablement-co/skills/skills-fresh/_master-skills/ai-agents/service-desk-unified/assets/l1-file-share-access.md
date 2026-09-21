# L1: File Share Access Issues Template

## User Information
- **User:** [Full Name]
- **Username:** [username]
- **Department:** [Department]
- **Ticket ID:** [TICKET-####]

## File Share Details
- **Share Name:** [\\server\share]
- **Share Path:** _________________
- **Access Type:** [Read/Write/Modify/Full]
- **Issue:** [Cannot access/Permission denied/Slow/Other]

## Issue Type
- [ ] Cannot connect to share
- [ ] Permission denied
- [ ] Slow performance
- [ ] Files missing
- [ ] Cannot save/modify files

## Quick Diagnostics
- [ ] User on network (not VPN issue)
- [ ] Share path correct
- [ ] User in correct security group
- [ ] Share accessible from other machines

## Troubleshooting Steps

### Test Connectivity
- [ ] Ping file server: [Result]
- [ ] Test with IP: \\XX.XX.XX.XX\share
- [ ] Test with hostname: \\server\share

### Permission Check
- [ ] Verify AD group membership
- [ ] Check NTFS permissions
- [ ] Check share permissions
- [ ] Verify not denied explicitly

### Client-Side Fixes
- [ ] Clear cached credentials
- [ ] Disconnect/reconnect mapped drive
- [ ] Restart workstation redirection service
- [ ] Map drive manually

## Actions Taken
1. _________________
2. _________________
3. _________________

## Resolution
- **Access Granted:** [Yes/No]
- **User Can Connect:** [Yes/No]
- **Files Accessible:** [Yes/No]

## Escalation to L2
Escalate if:
- Share permissions issue
- Server-side problem
- Multiple users affected
- Complex group membership

---
**SLA Target:** 30 minutes
