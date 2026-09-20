# Workflow: VPN Access Provisioning

> **Audience:** ENG | **Phase:** Beta (Week 5–8) | **Effort:** 2 days

## Steps
| # | Step | Connector | Action | Approval |
|---|------|-----------|--------|----------|
| 1 | Security training check | Internal | Verify employee completed security training | None |
| 2 | Manager approval | N/A | Approve VPN access request | Manager |
| 3 | Security officer approval | N/A | Approve if elevated access (admin VPN) | Security Officer (conditional) |
| 4 | Create VPN credentials | FortiNet/Custom | create_user with appropriate access level | None |
| 5 | Send setup guide | Slack/Email | VPN client download, config file, instructions | None |
| 6 | Schedule access review | Internal | Set 90-day review reminder | None |

## Conditional Approval
- Standard VPN (employee network): manager only
- Admin VPN (server access): manager + security officer
- Temporary VPN (contractor): manager + 30-day auto-expiry
