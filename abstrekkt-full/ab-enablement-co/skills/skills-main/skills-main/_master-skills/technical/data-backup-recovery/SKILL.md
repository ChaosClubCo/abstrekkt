---
name: data-backup-recovery
description: Backup procedures, disaster recovery plans, business continuity, RTO/RPO definitions, backup testing, recovery runbooks, and cloud backup strategies for SMB organizations. Use when designing backup systems, creating disaster recovery plans, or developing business continuity procedures.
---

# Data Backup & Recovery

## Overview

Data backup and recovery form the last line of defense against data loss, system failures, and disasters. For SMBs, where resources are limited but data is equally critical, having robust backup and recovery procedures can mean the difference between a minor inconvenience and business-ending data loss.

This skill provides comprehensive frameworks for protecting organizational data, ensuring business continuity, and enabling rapid recovery from any type of failure - from accidental file deletion to complete site disaster. The goal is to implement enterprise-grade protection scaled appropriately for SMB resources and requirements.

## When to Use

Invoke this skill when:
- Designing or improving backup systems
- Creating disaster recovery plans
- Developing business continuity procedures
- Defining RTO/RPO requirements
- Planning backup testing procedures
- Creating recovery runbooks
- Evaluating cloud backup solutions
- Responding to data loss incidents
- Conducting backup audits
- Planning for ransomware recovery

## Core Processes

### 1. Backup Strategy Framework

#### The 3-2-1 Backup Rule

```
3-2-1 BACKUP STRATEGY
====================

3 = Three copies of data
    - Production data
    - Primary backup
    - Secondary backup

2 = Two different storage media types
    - Local storage (NAS, SAN, disk)
    - Different technology (cloud, tape, offsite disk)

1 = One copy offsite
    - Geographically separated
    - Protected from local disasters
    - Accessible for recovery

ENHANCED: 3-2-1-1-0
====================
+ 1 = One copy offline/air-gapped (ransomware protection)
+ 0 = Zero errors (verified backups)
```

#### Backup Types and Use Cases

| Backup Type | Description | Use Case | Storage Impact |
|-------------|-------------|----------|----------------|
| Full | Complete copy of all data | Baseline, weekly | Highest |
| Incremental | Changes since last backup | Daily | Lowest |
| Differential | Changes since last full | Daily/weekly | Medium |
| Synthetic Full | Constructed from incrementals | Reduce backup window | Medium |
| Continuous (CDP) | Real-time replication | Critical systems | Varies |

#### Backup Frequency Guidelines

| Data Type | Frequency | Retention | Example |
|-----------|-----------|-----------|---------|
| Critical Databases | Continuous/Hourly | 90 days | Production DB |
| Business Applications | Daily | 30 days | ERP, CRM |
| File Shares | Daily | 30 days | Documents |
| Email | Daily | 90 days | Exchange/M365 |
| System Images | Weekly | 4 weeks | Server configs |
| Configurations | Daily | 90 days | Network devices |

### 2. RTO/RPO Definition

#### Understanding RTO and RPO

```
RTO (RECOVERY TIME OBJECTIVE)
=============================
Definition: Maximum acceptable downtime
Question: How long can we be down?

Example Classifications:
- Critical: < 1 hour
- High: < 4 hours
- Medium: < 24 hours
- Low: < 72 hours

RPO (RECOVERY POINT OBJECTIVE)
==============================
Definition: Maximum acceptable data loss
Question: How much data can we lose?

Example Classifications:
- Critical: < 1 hour (near-zero data loss)
- High: < 4 hours
- Medium: < 24 hours
- Low: < 72 hours
```

#### Business Impact Analysis Template

```
BUSINESS IMPACT ANALYSIS
========================

System/Application: _______________________
Business Owner: _______________________
IT Owner: _______________________

CRITICALITY ASSESSMENT
What business functions depend on this system?
____________________________________________

What is the revenue impact per hour of downtime?
$____________ per hour

What is the operational impact of downtime?
[ ] Business stopping
[ ] Major degradation
[ ] Minor inconvenience
[ ] No impact

What is the reputational impact?
[ ] Severe (customer/public facing)
[ ] Moderate (partner facing)
[ ] Minor (internal only)
[ ] None

RECOVERY REQUIREMENTS
Maximum tolerable downtime (RTO): _____ hours
Maximum tolerable data loss (RPO): _____ hours

DEPENDENCIES
Upstream systems: _______________________
Downstream systems: _______________________

RECOVERY PRIORITY
[ ] Tier 1 - Critical (recover first)
[ ] Tier 2 - High (recover second)
[ ] Tier 3 - Medium (recover third)
[ ] Tier 4 - Low (recover last)
```

#### System Classification Matrix

| Tier | RTO | RPO | Backup Frequency | Replication | Examples |
|------|-----|-----|------------------|-------------|----------|
| 1 - Critical | 1 hr | 1 hr | Continuous | Synchronous | Payment systems, core DB |
| 2 - High | 4 hr | 4 hr | Hourly | Asynchronous | ERP, CRM, email |
| 3 - Medium | 24 hr | 24 hr | Daily | Daily batch | File shares, dev systems |
| 4 - Low | 72 hr | 72 hr | Daily | Weekly batch | Archives, test systems |

### 3. Backup Procedures

#### Daily Backup Verification

```
DAILY BACKUP CHECKLIST
=====================

AUTOMATED CHECKS (Morning)
[ ] Verify all backup jobs completed
[ ] Check for errors or warnings
[ ] Confirm backup sizes are normal
[ ] Verify offsite replication complete
[ ] Check storage capacity

WEEKLY CHECKS
[ ] Review backup success rate
[ ] Verify retention policy compliance
[ ] Check backup performance trends
[ ] Validate sample file restores
[ ] Review storage utilization

MONTHLY CHECKS
[ ] Full backup verification
[ ] Complete restore test (rotating systems)
[ ] Review and update backup policies
[ ] Capacity planning review
[ ] Vendor/license status check
```

#### Backup Job Documentation

```markdown
# Backup Job: [Name]

**Job ID:** [ID]
**Created:** [Date]
**Last Modified:** [Date]
**Owner:** [Name]

## Schedule
- Frequency: [Daily/Weekly/etc.]
- Time: [Start time]
- Window: [Max duration]

## Scope
- Source: [Systems/paths]
- Exclusions: [What's excluded]
- Estimated size: [GB]

## Destination
- Primary: [Location]
- Secondary: [Location]
- Retention: [Policy]

## Configuration
- Backup type: [Full/Incremental/etc.]
- Compression: [Yes/No, level]
- Encryption: [Yes/No, method]
- Bandwidth limit: [If applicable]

## Verification
- Automated verification: [Yes/No]
- Verification frequency: [Schedule]
- Last successful test: [Date]

## Notifications
- Success: [Recipients]
- Failure: [Recipients]
- Warning: [Recipients]

## Recovery Information
- Estimated recovery time: [Hours]
- Recovery procedure: [Link/reference]
- Required resources: [List]
```

#### Backup Storage Calculations

```
STORAGE SIZING WORKSHEET
========================

Source Data Size: _____ TB

FULL BACKUP SIZING
Full backup size (with compression ~40%): _____ TB
Weekly full retention (4 weeks): _____ TB

INCREMENTAL SIZING
Daily change rate estimate: _____ %
Daily incremental size: _____ GB
Daily retention (30 days): _____ TB

TOTAL PRIMARY STORAGE NEEDED
Full backups: _____ TB
Incrementals: _____ TB
Growth buffer (20%): _____ TB
TOTAL: _____ TB

OFFSITE/CLOUD REPLICATION
Same as primary or subset: _____ TB
Transfer bandwidth needed: _____ Mbps
```

### 4. Disaster Recovery Planning

#### DR Plan Structure

```
DISASTER RECOVERY PLAN
=====================

1. EXECUTIVE SUMMARY
   - Plan purpose and scope
   - Key contacts
   - Recovery priorities

2. PLAN ACTIVATION
   - Triggering events
   - Declaration authority
   - Notification procedures

3. RECOVERY TEAMS
   - Team structure
   - Roles and responsibilities
   - Contact information

4. RECOVERY PROCEDURES
   - System-specific runbooks
   - Priority order
   - Dependencies

5. TECHNOLOGY REQUIREMENTS
   - DR site specifications
   - Network requirements
   - Recovery tools

6. COMMUNICATION PLAN
   - Internal communication
   - External communication
   - Status updates

7. TESTING AND MAINTENANCE
   - Test schedule
   - Plan updates
   - Training requirements
```

#### DR Site Options

| Option | RTO | Cost | Best For |
|--------|-----|------|----------|
| Hot Site | Minutes | Highest | Critical 24/7 operations |
| Warm Site | Hours | Medium | Important business apps |
| Cold Site | Days | Lowest | Non-critical systems |
| Cloud DR | Variable | Variable | Flexible, scalable needs |
| Reciprocal | Variable | Low | Small businesses |

#### Cloud DR Architecture

```
CLOUD-BASED DR ARCHITECTURE
===========================

PRODUCTION ENVIRONMENT
├── Primary Data Center
│   ├── Application Servers
│   ├── Database Servers
│   └── Storage Systems
│
├── Continuous Replication
│   ├── Database replication (async)
│   ├── Storage replication
│   └── Configuration sync
│
└── CLOUD DR ENVIRONMENT
    ├── Pilot Light
    │   └── Core systems always running
    │   └── Minimal cost during normal ops
    │
    ├── Warm Standby
    │   └── Scaled-down environment
    │   └── Quick scale-up capability
    │
    └── Hot Standby (Multi-Site)
        └── Full production copy
        └── Active-active capable
```

### 5. Recovery Runbooks

#### System Recovery Runbook Template

```markdown
# Recovery Runbook: [System Name]

**System:** [Name]
**Classification:** Tier [1-4]
**RTO:** [Hours]
**RPO:** [Hours]
**Last Tested:** [Date]
**Document Owner:** [Name]

## Prerequisites
- [ ] Backup verified and accessible
- [ ] Recovery environment available
- [ ] Network connectivity confirmed
- [ ] Required credentials available
- [ ] Dependencies operational

## Recovery Steps

### Phase 1: Infrastructure (Time: ~X hours)
1. [ ] Provision compute resources
   - Specifications: [CPU, RAM, Storage]
   - Commands/steps: [Details]

2. [ ] Configure networking
   - IP assignments: [List]
   - DNS updates: [List]
   - Firewall rules: [List]

### Phase 2: Data Recovery (Time: ~X hours)
3. [ ] Restore from backup
   - Backup location: [Path/URL]
   - Restore command: [Command]
   - Expected duration: [Time]

4. [ ] Verify data integrity
   - Validation checks: [List]
   - Record counts: [Expected]

### Phase 3: Application Recovery (Time: ~X hours)
5. [ ] Start application services
   - Service order: [List]
   - Startup commands: [Commands]

6. [ ] Verify application function
   - Health checks: [List]
   - Test transactions: [List]

### Phase 4: Validation (Time: ~X hours)
7. [ ] User acceptance testing
   - Test cases: [List]
   - Testers: [Names]

8. [ ] Performance validation
   - Benchmarks: [Metrics]
   - Acceptable thresholds: [Values]

## Post-Recovery
- [ ] Update DNS if needed
- [ ] Notify stakeholders
- [ ] Document actual recovery time
- [ ] Schedule review meeting

## Rollback Procedure
[Steps to rollback if recovery fails]


## References
- `references/contacts.md` — Contacts
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
