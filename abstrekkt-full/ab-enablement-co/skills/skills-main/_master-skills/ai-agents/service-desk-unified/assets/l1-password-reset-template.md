# L1: Password Reset Template

## Basic Information
- **User:** [Full Name]
- **Username:** [username]
- **Email:** [user@domain.com]
- **Department:** [Department]
- **Manager:** [Manager Name]
- **Ticket ID:** [TICKET-####]

## Verification Steps Completed
- [ ] User verified via phone: [Phone Last 4: ####]
- [ ] User verified via email: [Personal Email]
- [ ] User verified via security questions
- [ ] Manager approval obtained (if required)

## Reset Details
- **Reset Method:** [ ] Self-Service Portal [ ] Admin Reset [ ] Temporary Password
- **Temporary Password Issued:** [Yes/No]
- **Password Expires In:** [24 hours / Never]
- **Must Change at Next Login:** [Yes/No]

## Systems Reset
- [ ] Active Directory / SSO
- [ ] VPN Access
- [ ] Email (Exchange/Gmail)
- [ ] Workstation Local Account
- [ ] Remote Desktop
- [ ] Other: _______________

## Communication
**User Notification:**
```
Hi [Name],

Your password has been reset successfully. 

Temporary Password: [If applicable]
You will be required to change this password on your next login.

If you did not request this reset, please contact IT Security immediately at [SECURITY_EMAIL].

Best regards,
[Tech Name]
IT Service Desk
```

## Follow-Up Actions
- [ ] User confirmed successful login
- [ ] MFA re-enrollment (if needed)
- [ ] Unlock related accounts
- [ ] Update password manager
- [ ] Document in ticket notes

## Security Notes
- **Failed Login Attempts:** [Count]
- **Account Previously Locked:** [Yes/No]
- **Unusual Activity Detected:** [Yes/No]
- **Security Team Notified:** [Yes/No]

## Resolution Time
- **Ticket Created:** [Timestamp]
- **Verification Completed:** [Timestamp]
- **Reset Completed:** [Timestamp]
- **User Confirmed:** [Timestamp]
- **Total Time:** [Minutes]

---
**SLA Target:** 15 minutes
**Escalate If:** Unable to verify user identity, security concerns, multiple failed resets
