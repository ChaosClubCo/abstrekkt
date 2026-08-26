---
name: it-support
description: Help desk workflows, ticket prioritization, troubleshooting guides, asset management, hardware provisioning, and software deployment for SMB IT support operations. Use when setting up support systems, creating ticket workflows, managing IT assets, or establishing support tier structures.
---

# IT Support Operations

## Overview

IT Support is the backbone of operational continuity for SMB organizations. This skill covers the complete spectrum of help desk operations, from initial ticket intake through resolution and knowledge management. Effective IT support minimizes downtime, improves employee productivity, and creates a foundation for scalable technology operations.

For SMBs, a well-structured IT support function can mean the difference between minor inconveniences and business-stopping outages. This skill provides frameworks that balance enterprise-grade practices with the resource constraints typical of small and medium businesses.

## When to Use

Invoke this skill when:
- Setting up a new help desk or ticketing system
- Creating or improving ticket prioritization matrices
- Developing troubleshooting guides and runbooks
- Implementing asset management and tracking systems
- Planning hardware provisioning workflows
- Designing software deployment processes
- Establishing support tier structures (L1/L2/L3)
- Creating SLA frameworks for internal or external support
- Building knowledge bases for common issues
- Onboarding new IT support staff

## Core Processes

### 1. Help Desk Ticket Management

#### Ticket Intake Process

```
TICKET INTAKE WORKFLOW
=====================

1. INITIAL CONTACT
   - User submits ticket via: Email | Portal | Phone | Chat | Walk-up
   - Auto-acknowledge receipt within 5 minutes
   - Assign unique ticket ID

2. TICKET CLASSIFICATION
   - Category: Hardware | Software | Network | Access | Other
   - Subcategory: [Specific system/application]
   - Affected users: Individual | Team | Department | Company-wide

3. PRIORITY ASSIGNMENT (See Priority Matrix below)
   - Impact + Urgency = Priority Level
   - Auto-escalation rules based on priority

4. INITIAL TRIAGE
   - Known issue? Link to existing KB article
   - Simple fix? Resolve at L1
   - Complex? Route to appropriate tier

5. ASSIGNMENT
   - Auto-assign based on category/skills matrix
   - Load balance across available technicians
   - Consider timezone for global teams
```

#### Priority Matrix

| Impact / Urgency | Critical (Business Stop) | High (Major Function) | Medium (Workaround Exists) | Low (Minor Inconvenience) |
|------------------|--------------------------|----------------------|---------------------------|--------------------------|
| **Enterprise-wide** | P1 - Critical | P1 - Critical | P2 - High | P3 - Medium |
| **Department** | P1 - Critical | P2 - High | P3 - Medium | P4 - Low |
| **Multiple Users** | P2 - High | P2 - High | P3 - Medium | P4 - Low |
| **Single User** | P2 - High | P3 - Medium | P4 - Low | P5 - Planned |

#### SLA Response and Resolution Targets

| Priority | First Response | Update Frequency | Resolution Target |
|----------|---------------|------------------|-------------------|
| P1 - Critical | 15 minutes | Every 30 minutes | 4 hours |
| P2 - High | 1 hour | Every 2 hours | 8 hours |
| P3 - Medium | 4 hours | Daily | 3 business days |
| P4 - Low | 8 hours | Every 3 days | 5 business days |
| P5 - Planned | 24 hours | Weekly | As scheduled |

### 2. Support Tier Structure

#### Tier 0 - Self-Service
- Knowledge base articles
- FAQ documentation
- Password reset portals
- Automated chatbots
- Video tutorials

**Target Resolution Rate:** 30-40% of all issues

#### Tier 1 - Front-Line Support
**Responsibilities:**
- Initial ticket triage and classification
- Basic troubleshooting (password resets, software restarts)
- Known issue resolution via KB articles
- Ticket routing and escalation
- User communication and updates

**Skills Required:**
- Strong communication skills
- Basic technical knowledge
- Familiarity with common applications
- Ticket system proficiency

**Escalation Triggers:**
- Issue not resolved within 30 minutes
- Requires system access beyond L1 permissions
- Issue outside documented procedures
- User requests escalation

#### Tier 2 - Technical Support
**Responsibilities:**
- Complex troubleshooting
- System configuration changes
- Software installation and configuration
- Network troubleshooting
- Root cause analysis for recurring issues

**Skills Required:**
- Deep technical knowledge
- System administration capabilities
- Scripting abilities
- Network fundamentals

**Escalation Triggers:**
- Requires infrastructure changes
- Security incident suspected
- Vendor engagement needed
- Beyond team expertise

#### Tier 3 - Expert/Engineering
**Responsibilities:**
- Infrastructure changes
- System architecture decisions
- Vendor management
- Major incident response
- Security incident handling
- Project-based work

**Skills Required:**
- Expert-level technical skills
- Architecture experience
- Vendor relationship management
- Project management basics

### 3. Troubleshooting Methodology

#### Standard Troubleshooting Framework

```
TROUBLESHOOTING STEPS
====================

1. IDENTIFY THE PROBLEM
   - What exactly is happening?
   - When did it start?
   - What changed recently?
   - Who is affected?
   - Can you reproduce it?

2. ESTABLISH A THEORY
   - Most common cause first
   - Check recent changes
   - Review similar past incidents
   - Consider environmental factors

3. TEST THE THEORY
   - Start with least invasive tests
   - Document each test and result
   - If theory fails, return to step 2

4. ESTABLISH A PLAN
   - Determine corrective action
   - Assess risk of the fix
   - Get approval if needed
   - Plan rollback strategy

5. IMPLEMENT THE SOLUTION
   - Follow change management if required
   - Document what was done
   - Communicate with user

6. VERIFY FULL FUNCTIONALITY
   - Confirm issue is resolved
   - Test related functions
   - Get user confirmation

7. DOCUMENT
   - Update ticket with resolution
   - Add to knowledge base if new issue
   - Update runbooks if needed
```

#### Common Issue Runbooks

**Computer Won't Start:**
1. Check power cable and outlet
2. Try different outlet
3. Check power button LED
4. Try power cycle (unplug 30 sec)
5. Check for POST beeps/lights
6. If laptop: remove battery, hold power 30 sec
7. Escalate if hardware failure suspected

**Network Connectivity Issues:**
1. Verify physical connection (cable/WiFi)
2. Check network icon status
3. Run ipconfig /all - verify IP assignment
4. Ping gateway, then DNS, then external
5. Flush DNS: ipconfig /flushdns
6. Release/renew IP: ipconfig /release then /renew
7. Check for network outage notices
8. Try different cable/port
9. Escalate to network team if persists

**Application Crashes:**
1. Note exact error message
2. Check for recent updates
3. Clear application cache
4. Repair/reinstall application
5. Check event logs for details
6. Verify system requirements met
7. Test in safe mode
8. Check for conflicting software
9. Escalate to vendor if needed

### 4. Asset Management

#### Hardware Asset Lifecycle

```
ASSET LIFECYCLE STAGES
=====================

1. PROCUREMENT
   - Request and approval
   - Vendor selection
   - Purchase order
   - Receiving and verification

2. DEPLOYMENT
   - Asset tagging
   - Configuration/imaging
   - Software installation
   - User assignment
   - Documentation

3. OPERATION
   - Regular maintenance
   - Performance monitoring
   - Issue tracking
   - Upgrade assessment

4. RETIREMENT
   - End-of-life determination
   - Data sanitization
   - Asset recovery
   - Disposal/recycling
   - Documentation update
```

#### Asset Tracking Template

| Field | Description | Example |
|-------|-------------|---------|
| Asset Tag | Unique identifier | IT-2024-0001 |
| Serial Number | Manufacturer serial | ABC123XYZ |
| Device Type | Category | Laptop |
| Make/Model | Manufacturer and model | Dell Latitude 5540 |
| Purchase Date | Acquisition date | 2024-01-15 |
| Warranty End | Warranty expiration | 2027-01-14 |
| Assigned To | Current user | jsmith@company.com |
| Department | User's department | Engineering |
| Location | Physical location | HQ-Floor2-Desk42 |
| Status | Current state | Active |
| Last Audit | Last physical verification | 2024-06-01 |

#### Asset Audit Schedule

- **Quarterly:** High-value assets (servers, network equipment)
- **Semi-annually:** User devices (laptops, desktops)
- **Annually:** Peripheral equipment, monitors
- **On-demand:** Department moves, terminations

### 5. Hardware Provisioning

#### New Hire Equipment Workflow

```
NEW HIRE PROVISIONING
====================

TRIGGER: HR notification of new hire (7+ days before start)

DAY -7: PREPARATION
[ ] Receive new hire request from HR
[ ] Determine equipment needs based on role
[ ] Check available inventory
[ ] Order if needed (expedite if necessary)

DAY -3: CONFIGURATION
[ ] Image device with standard build
[ ] Install role-specific software
[ ] Configure email and accounts
[ ] Apply security policies
[ ] Test all configurations

DAY -1: FINAL PREP
[ ] Complete asset documentation
[ ] Prepare welcome packet
[ ] Stage equipment at desk/shipping
[ ] Verify network access ready
[ ] Coordinate with facilities

DAY 0: DELIVERY
[ ] Deliver equipment to user
[ ] Provide quick orientation
[ ] Verify user can log in
[ ] Document handoff

DAY +1: FOLLOW-UP
[ ] Check in with user
[ ] Address any issues
[ ] Ensure training scheduled
```

#### Standard Equipment Packages

**Basic Office Worker:**
- Laptop or desktop
- Monitor (1)
- Keyboard and mouse
- Headset for calls
- Basic peripherals

**Power User/Developer:**
- High-spec laptop or workstation
- Monitors (2-3)
- Mechanical keyboard
- Advanced mouse
- Docking station
- Additional RAM/storage as needed

**Executive:**
- Premium laptop
- Large monitor or portable display
- Quality peripherals
- Mobile accessories
- Presentation equipment access

**Remote Worker:**
- Laptop with camera
- Monitor
- Keyboard and mouse
- Headset
- Laptop stand
- Home office stipend consideration

### 6. Software Deployment

#### Deployment Methods

**Method 1: Manual Installation**
- Use for: One-off installs, unique requirements
- Pros: Flexible, immediate
- Cons: Time-consuming, inconsistent

**Method 2: Software Center/Self-Service**
- Use for: Optional software, user-requested apps
- Pros: User empowerment, reduced tickets
- Cons: Requires catalog maintenance

**Method 3: Automated Deployment (MDM/SCCM)**
- Use for: Required software, mass deployments
- Pros: Consistent, scalable, trackable
- Cons: Setup complexity, testing required

**Method 4: Cloud-Based (Intune/Jamf)**
- Use for: Modern management, remote workforce
- Pros: No VPN needed, real-time status
- Cons: Licensing costs, internet dependency

#### Software Deployment Checklist

```
PRE-DEPLOYMENT
[ ] Software approved and licensed
[ ] Compatibility tested
[ ] Security review completed
[ ] Deployment package created
[ ] Documentation prepared
[ ] Rollback plan defined
[ ] Pilot group identified

PILOT DEPLOYMENT
[ ] Deploy to pilot group
[ ] Monitor for issues (48-72 hours)
[ ] Gather user feedback
[ ] Address any problems
[ ] Document lessons learned

PRODUCTION DEPLOYMENT
[ ] Schedule deployment window
[ ] Communicate to users
[ ] Execute deployment
[ ] Monitor deployment status
[ ] Address failures

POST-DEPLOYMENT
[ ] Verify installation counts
[ ] Update asset records
[ ] Close deployment ticket
[ ] Update knowledge base
[ ] Conduct lessons learned
```

## Tools & Templates

### Recommended Help Desk Solutions (SMB)

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Freshdesk | Growing SMBs | Free-$79/agent | Multi-channel, automations |
| Zendesk | Customer-facing | $19-$115/agent | Robust reporting, integrations |
| Jira Service Management | Tech companies | $20-$45/agent | ITSM, development integration |
| Spiceworks | Budget-conscious | Free | Basic but functional |
| HaloPSA | MSPs/IT teams | Contact sales | Full PSA functionality |

### Asset Management Tools

| Tool | Type | Best For |
|------|------|----------|
| Snipe-IT | Open source | Budget-conscious, self-hosted |
| Asset Panda | Cloud | Flexible, mobile-friendly |
| Lansweeper | Discovery-based | Automated network scanning |
| ManageEngine | Enterprise | Full ITAM suite |

### Knowledge Base Template

```markdown
# KB Article: [TITLE]

**Article ID:** KB-[NUMBER]
**Category:** [Category/Subcategory]
**Created:** [Date]
**Last Updated:** [Date]
**Author:** [Name]

## Summary
[One paragraph describing the issue and solution]

## Symptoms
- [Symptom 1]
- [Symptom 2]
- [Symptom 3]

## Applies To
- [System/Application]
- [Version]
- [User type]

## Solution

### Step 1: [Action]
[Detailed instructions]

### Step 2: [Action]
[Detailed instructions]

### Step 3: [Action]
[Detailed instructions]

## Additional Information
[Related context, warnings, notes]

## Related Articles
- KB-[NUMBER]: [Related Title]
- KB-[NUMBER]: [Related Title]
```

## Metrics & KPIs

### Primary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Response Time | Within SLA 95% | Time to first meaningful response |
| Resolution Time | Within SLA 90% | Time to close ticket |
| First Contact Resolution | >70% | Resolved at L1 without escalation |
| Customer Satisfaction | >4.0/5.0 | Post-ticket survey |
| Ticket Volume Trend | Decreasing | Month-over-month comparison |
| Self-Service Adoption | >30% | Issues resolved via KB/portal |

### Secondary Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| Escalation Rate | <30% | L1 effectiveness |
| Reopen Rate | <5% | Quality of resolution |
| Backlog Age | <5 days avg | Queue health |
| Agent Utilization | 70-80% | Resource efficiency |
| Cost per Ticket | Decreasing | Operational efficiency |

### Reporting Cadence

- **Daily:** Open tickets, SLA breaches, critical issues
- **Weekly:** Volume trends, agent performance, backlog
- **Monthly:** Full KPI dashboard, trend analysis
- **Quarterly:** Service review, improvement initiatives

## Common Pitfalls

### Process Pitfalls
- **No ticket = no work:** Enforce ticketing for all requests
- **Priority inflation:** Users marking everything urgent; use objective criteria
- **Tribal knowledge:** Document everything, don't rely on memory
- **Scope creep:** Define clear boundaries for IT support

### Technical Pitfalls
- **Skipping testing:** Always test in non-production first
- **No rollback plan:** Always have an undo strategy
- **Ignoring root cause:** Fix the real problem, not just symptoms
- **Documentation debt:** Keep documentation current

### Communication Pitfalls
- **Radio silence:** Update users regularly, even if no progress
- **Technical jargon:** Communicate at user's level
- **Blame culture:** Focus on solutions, not fault
- **Over-promising:** Set realistic expectations

## Integration Points

### HR Integration
- New hire provisioning triggers
- Termination equipment recovery
- Role change equipment updates
- Contractor management

### Finance Integration
- Asset purchase requests
- Budget tracking
- License cost allocation
- Hardware refresh planning

### Security Integration
- Incident escalation procedures
- Access request workflows
- Security awareness training
- Vulnerability remediation

### Vendor Management
- Warranty claim processing
- Support contract management
- Hardware break-fix coordination
- Software vendor escalations

### Facilities Integration
- Desk assignments
- Office moves
- Equipment installation
- Cable management
