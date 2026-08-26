# Universal Pre-Migration Checklist

> **Complete this checklist before starting ANY migration**

This checklist applies to all migration types and ensures nothing critical is overlooked. Each item should be verified and signed off before proceeding to the next phase.

---

## How to Use This Checklist

1. **Review all sections** - Even if some items seem irrelevant, verify they truly don't apply
2. **Document exceptions** - If an item is not applicable, note why in the Notes column
3. **Get sign-offs** - Critical items require stakeholder approval
4. **Track completion** - Use the checkbox and date columns to track progress
5. **Reference guides** - See the [Migration Guide Index](./README.md) for detailed guidance

### Status Legend

| Symbol | Meaning |
|--------|---------|
| [ ] | Not started |
| [~] | In progress |
| [x] | Complete |
| [N/A] | Not applicable (document reason) |

---

## Phase 1: Discovery and Assessment

### 1.1 Stakeholder Identification

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Executive sponsor identified and committed | | | |
| [ ] | Project owner/migration lead assigned | | | |
| [ ] | Technical lead(s) identified | | | |
| [ ] | Business stakeholders identified | | | |
| [ ] | End user representatives identified | | | |
| [ ] | External stakeholders identified (vendors, partners, customers) | | | |
| [ ] | RACI matrix created and approved | | | |

### 1.2 Current State Documentation

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | System architecture diagram current and accurate | | | |
| [ ] | Data model documentation complete | | | |
| [ ] | Integration inventory complete (APIs, files, events) | | | |
| [ ] | User roles and permissions documented | | | |
| [ ] | Business processes documented | | | |
| [ ] | SLA and performance requirements documented | | | |
| [ ] | Current system metrics/baselines captured | | | |
| [ ] | Known issues and technical debt cataloged | | | |
| [ ] | Customizations and configurations documented | | | |
| [ ] | Scheduled jobs and automations documented | | | |

### 1.3 Data Assessment

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Complete data inventory created | | | |
| [ ] | Data volume assessment completed | | | |
| [ ] | Data quality assessment completed | | | |
| [ ] | Data classification (sensitivity levels) completed | | | |
| [ ] | Data retention requirements documented | | | |
| [ ] | Data ownership identified | | | |
| [ ] | Data dependencies mapped | | | |
| [ ] | Historical data requirements defined | | | |

### 1.4 Dependency Mapping

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Upstream dependencies identified | | | |
| [ ] | Downstream dependencies identified | | | |
| [ ] | Third-party service dependencies listed | | | |
| [ ] | Internal system dependencies mapped | | | |
| [ ] | Shared components/libraries identified | | | |
| [ ] | Database dependencies documented | | | |
| [ ] | File system dependencies documented | | | |
| [ ] | Network dependencies documented | | | |

---

## Phase 2: Planning and Design

### 2.1 Business Case and Objectives

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Business case documented and approved | | | |
| [ ] | Success criteria defined and measurable | | | |
| [ ] | ROI/cost-benefit analysis completed | | | |
| [ ] | Timeline aligned with business constraints | | | |
| [ ] | Budget approved and allocated | | | |
| [ ] | Go/no-go criteria defined | | | |

### 2.2 Target State Design

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Target architecture documented | | | |
| [ ] | Target platform/technology selected | | | |
| [ ] | Feature parity analysis completed | | | |
| [ ] | Gap analysis documented | | | |
| [ ] | Data model mapping completed | | | |
| [ ] | Integration design completed | | | |
| [ ] | Security architecture reviewed | | | |
| [ ] | Performance requirements validated | | | |
| [ ] | Scalability requirements addressed | | | |

### 2.3 Migration Strategy

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Migration approach selected (big bang, phased, parallel) | | | |
| [ ] | Migration phases/waves defined | | | |
| [ ] | Pilot scope identified (if applicable) | | | |
| [ ] | Cutover strategy documented | | | |
| [ ] | Rollback strategy documented | | | |
| [ ] | Data migration strategy defined | | | |
| [ ] | Downtime requirements and windows identified | | | |

### 2.4 Resource Planning

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Team roles and responsibilities defined | | | |
| [ ] | Resource requirements identified | | | |
| [ ] | Skill gaps identified and addressed | | | |
| [ ] | External resources/vendors engaged | | | |
| [ ] | Training plan created | | | |
| [ ] | Team availability confirmed for migration window | | | |
| [ ] | Backfill plan for team members' regular duties | | | |

### 2.5 Risk Management

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Risk assessment completed | | | |
| [ ] | Risk register created | | | |
| [ ] | Mitigation strategies documented for high risks | | | |
| [ ] | Contingency plans developed | | | |
| [ ] | Risk owners assigned | | | |
| [ ] | Risk monitoring plan established | | | |

### 2.6 Communication Planning

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Stakeholder communication matrix created | | | |
| [ ] | Communication schedule defined | | | |
| [ ] | Status report template created | | | |
| [ ] | Escalation procedures documented | | | |
| [ ] | External communication plan (if applicable) | | | |
| [ ] | Training and documentation plan created | | | |

---

## Phase 3: Environment and Infrastructure

### 3.1 Target Environment Setup

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Target environment provisioned | | | |
| [ ] | Network configuration completed | | | |
| [ ] | Security groups/firewall rules configured | | | |
| [ ] | DNS entries planned | | | |
| [ ] | SSL certificates provisioned | | | |
| [ ] | Load balancers configured | | | |
| [ ] | Storage allocated and configured | | | |
| [ ] | Monitoring and alerting configured | | | |
| [ ] | Logging infrastructure ready | | | |

### 3.2 Development and Testing Environments

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Development environment ready | | | |
| [ ] | Testing/QA environment ready | | | |
| [ ] | Staging/pre-production environment ready | | | |
| [ ] | Performance testing environment ready | | | |
| [ ] | Environments match production configuration | | | |
| [ ] | Environment refresh process documented | | | |

### 3.3 Rollback Environment

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Current system backup completed | | | |
| [ ] | Backup validation completed | | | |
| [ ] | Rollback environment preserved | | | |
| [ ] | Rollback procedure documented | | | |
| [ ] | Rollback procedure tested | | | |
| [ ] | Rollback time estimate confirmed | | | |

### 3.4 Tools and Access

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Migration tools selected and installed | | | |
| [ ] | Team access to all required systems confirmed | | | |
| [ ] | Vendor/support access arranged | | | |
| [ ] | CI/CD pipelines configured | | | |
| [ ] | Version control repository set up | | | |
| [ ] | Project tracking tools configured | | | |
| [ ] | Communication channels established | | | |

---

## Phase 4: Security and Compliance

### 4.1 Security Requirements

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Security requirements documented | | | |
| [ ] | Security architecture review completed | | | |
| [ ] | Encryption requirements defined (at-rest, in-transit) | | | |
| [ ] | Access control requirements defined | | | |
| [ ] | Authentication requirements defined | | | |
| [ ] | Secrets management strategy documented | | | |
| [ ] | Security scanning tools configured | | | |
| [ ] | Penetration testing scheduled | | | |

### 4.2 Compliance Requirements

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Applicable regulations identified (GDPR, HIPAA, SOC2, etc.) | | | |
| [ ] | Compliance requirements documented | | | |
| [ ] | Data residency requirements addressed | | | |
| [ ] | Audit trail requirements defined | | | |
| [ ] | Data retention policies reviewed | | | |
| [ ] | Privacy impact assessment completed (if required) | | | |
| [ ] | Legal review completed (if required) | | | |
| [ ] | Compliance team sign-off obtained | | | |

### 4.3 Vendor and Third-Party

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Vendor security assessments completed | | | |
| [ ] | Data processing agreements in place | | | |
| [ ] | SLA agreements reviewed | | | |
| [ ] | Vendor support during migration confirmed | | | |
| [ ] | Third-party access controls defined | | | |

---

## Phase 5: Testing Preparation

### 5.1 Test Strategy

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Test strategy document created | | | |
| [ ] | Test scope defined | | | |
| [ ] | Test types identified (unit, integration, E2E, performance, security) | | | |
| [ ] | Test environment requirements defined | | | |
| [ ] | Test data strategy defined | | | |
| [ ] | Test automation approach defined | | | |
| [ ] | Defect management process defined | | | |
| [ ] | Test exit criteria defined | | | |

### 5.2 Test Preparation

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Test cases documented | | | |
| [ ] | Test data prepared | | | |
| [ ] | Test data anonymization completed (if required) | | | |
| [ ] | Automated tests developed/updated | | | |
| [ ] | Performance test scripts prepared | | | |
| [ ] | Security test plan prepared | | | |
| [ ] | UAT test cases prepared | | | |
| [ ] | Regression test suite prepared | | | |

### 5.3 Data Validation

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Data validation strategy defined | | | |
| [ ] | Data validation scripts/tools prepared | | | |
| [ ] | Record count validation approach defined | | | |
| [ ] | Data integrity checks defined | | | |
| [ ] | Sampling strategy defined | | | |
| [ ] | Data reconciliation process defined | | | |

---

## Phase 6: Cutover Preparation

### 6.1 Cutover Planning

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Cutover date and time confirmed | | | |
| [ ] | Maintenance window communicated | | | |
| [ ] | Detailed cutover runbook created | | | |
| [ ] | Cutover checklist created | | | |
| [ ] | Rollback triggers defined | | | |
| [ ] | Rollback decision tree created | | | |
| [ ] | Communication plan for cutover ready | | | |

### 6.2 Cutover Rehearsal

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Dry run scheduled | | | |
| [ ] | Dry run completed successfully | | | |
| [ ] | Dry run issues documented and resolved | | | |
| [ ] | Cutover timing validated | | | |
| [ ] | Rollback procedure tested | | | |
| [ ] | Team roles confirmed for cutover | | | |

### 6.3 Go-Live Readiness

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | All testing completed and signed off | | | |
| [ ] | Performance benchmarks met | | | |
| [ ] | Security review passed | | | |
| [ ] | Documentation completed | | | |
| [ ] | Support team trained and ready | | | |
| [ ] | Monitoring and alerting validated | | | |
| [ ] | Stakeholder sign-offs obtained | | | |
| [ ] | Go/no-go meeting scheduled | | | |

---

## Phase 7: Post-Migration

### 7.1 Immediate Post-Migration

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | System health verification completed | | | |
| [ ] | Data validation completed | | | |
| [ ] | Integration verification completed | | | |
| [ ] | Performance validation completed | | | |
| [ ] | User access verification completed | | | |
| [ ] | Critical business processes validated | | | |
| [ ] | Monitoring baseline established | | | |
| [ ] | Success criteria validated | | | |

### 7.2 Stabilization

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Hypercare support period defined | | | |
| [ ] | Issue tracking and resolution process active | | | |
| [ ] | Performance monitoring active | | | |
| [ ] | User feedback collection active | | | |
| [ ] | Support ticket tracking in place | | | |
| [ ] | Escalation procedures active | | | |

### 7.3 Closure

| Status | Item | Owner | Date | Notes |
|--------|------|-------|------|-------|
| [ ] | Lessons learned session conducted | | | |
| [ ] | Lessons learned document created | | | |
| [ ] | Old system decommissioning plan executed | | | |
| [ ] | Final documentation completed | | | |
| [ ] | Knowledge transfer completed | | | |
| [ ] | Project closure report created | | | |
| [ ] | Stakeholder sign-off on completion | | | |

---

## Appendix A: Critical Sign-Off Checklist

These items require formal sign-off before proceeding to the next phase.

### Planning Phase Sign-Offs

| Item | Approver | Date | Signature |
|------|----------|------|-----------|
| Business case and objectives | Executive Sponsor | | |
| Budget allocation | Finance | | |
| Target architecture | Technical Lead | | |
| Security architecture | Security Team | | |
| Migration strategy | Migration Lead | | |
| Timeline and resource plan | Project Sponsor | | |

### Pre-Cutover Sign-Offs

| Item | Approver | Date | Signature |
|------|----------|------|-----------|
| All testing completed | QA Lead | | |
| Security review passed | Security Team | | |
| Performance benchmarks met | Technical Lead | | |
| Compliance requirements met | Compliance/Legal | | |
| Business readiness confirmed | Business Owner | | |
| Support readiness confirmed | Support Lead | | |
| Go/No-Go decision | Executive Sponsor | | |

### Post-Migration Sign-Offs

| Item | Approver | Date | Signature |
|------|----------|------|-----------|
| System health verified | Technical Lead | | |
| Data integrity confirmed | Data Owner | | |
| Business processes validated | Business Owner | | |
| Migration success confirmed | Project Sponsor | | |
| Project closure approved | Executive Sponsor | | |

---

## Appendix B: Emergency Contacts

Complete this section before cutover begins.

| Role | Name | Phone | Email | Backup |
|------|------|-------|-------|--------|
| Migration Lead | | | | |
| Technical Lead | | | | |
| Database Administrator | | | | |
| Network Administrator | | | | |
| Security Lead | | | | |
| Business Owner | | | | |
| Vendor Support | | | | |
| Executive Sponsor | | | | |

---

## Appendix C: Critical System Information

Document critical system details for quick reference during cutover.

### Source System

| Item | Value |
|------|-------|
| System Name | |
| Environment URL | |
| Database Connection | |
| Admin Console | |
| Monitoring Dashboard | |
| Log Location | |

### Target System

| Item | Value |
|------|-------|
| System Name | |
| Environment URL | |
| Database Connection | |
| Admin Console | |
| Monitoring Dashboard | |
| Log Location | |

### External Dependencies

| System | Contact | Status Check URL |
|--------|---------|------------------|
| | | |
| | | |
| | | |

---

## Appendix D: Quick Reference Commands

Document frequently used commands during migration.

### Health Checks

```bash
# Application health check
[command]

# Database connectivity check
[command]

# Integration health check
[command]
```

### Data Validation

```bash
# Record count validation
[command]

# Data integrity check
[command]
```

### Rollback Commands

```bash
# Stop new system
[command]

# Restore database
[command]

# Switch traffic back
[command]

# Restart old system
[command]
```

---

## Appendix E: Issue Log Template

Use this template to track issues during migration.

| Issue ID | Date/Time | Description | Severity | Status | Owner | Resolution | Resolved Date |
|----------|-----------|-------------|----------|--------|-------|------------|---------------|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

**Severity Levels:**
- **Critical:** Migration cannot proceed, immediate action required
- **High:** Significant impact, must resolve before go-live
- **Medium:** Workaround available, resolve during stabilization
- **Low:** Minor impact, can address post-migration

---

## Checklist Completion Summary

| Phase | Total Items | Completed | Remaining | % Complete |
|-------|-------------|-----------|-----------|------------|
| 1. Discovery and Assessment | | | | |
| 2. Planning and Design | | | | |
| 3. Environment and Infrastructure | | | | |
| 4. Security and Compliance | | | | |
| 5. Testing Preparation | | | | |
| 6. Cutover Preparation | | | | |
| 7. Post-Migration | | | | |
| **TOTAL** | | | | |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-01-20 | ProjectX Team | Initial version |

---

*Return to [Migration Guide Index](./README.md) for detailed guides and additional resources.*
