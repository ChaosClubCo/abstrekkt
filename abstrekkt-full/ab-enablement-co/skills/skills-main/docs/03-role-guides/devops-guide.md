# DevOps / SRE Guide

This guide curates the most valuable skills for DevOps engineers, Site Reliability Engineers, and platform teams. Skills are grouped by infrastructure domain so you can quickly find what applies to your current operational challenges.

The Skills Library contains dozens of infrastructure, deployment, and reliability skills across the `technical`, `ai-agents`, and `strategy` categories. This guide highlights the top picks in each subcategory.

---

## Container and Orchestration

Skills for containerizing applications, managing Kubernetes clusters, and orchestrating workloads at scale.

| Skill | Category | Description |
|-------|----------|-------------|
| `container-orchestration` | ai-agents | Docker, Kubernetes, and container management for scalable application deployment and operations |
| `k8s-manifest-generator` | ai-agents | Create production-ready Kubernetes manifests for Deployments, Services, ConfigMaps, and Secrets |
| `k8s-security-policies` | ai-agents | Implement Kubernetes security policies including NetworkPolicy, PodSecurityPolicy, and RBAC |
| `helm-chart-scaffolding` | ai-agents | Design and manage Helm charts for templating and packaging Kubernetes applications |

### Suggested Workflow: Deploying a New Service to Kubernetes

1. Start with `container-orchestration` to containerize the application and define runtime requirements
2. Use `k8s-manifest-generator` to produce Deployments, Services, and ConfigMaps
3. Apply `k8s-security-policies` to enforce RBAC, network isolation, and pod security standards
4. Package everything with `helm-chart-scaffolding` for repeatable, versioned releases
5. Connect to `gitops-workflow` for automated, declarative deployments

---

## Infrastructure as Code

Skills for provisioning and managing cloud infrastructure through code rather than manual processes.

| Skill | Category | Description |
|-------|----------|-------------|
| `terraform-iac-deployment` | technical | Infrastructure as Code with Terraform for AWS, GCP, and Azure including state management and CI/CD |
| `terraform-module-library` | technical | Build reusable Terraform modules for standardized cloud provisioning across providers |
| `gitops-workflow` | technical | Implement GitOps workflows with ArgoCD and Flux for automated Kubernetes deployments |

### Suggested Workflow: Standing Up a New Environment

1. Define infrastructure components using `terraform-module-library` for reusable modules
2. Deploy with `terraform-iac-deployment` for state management and plan/apply workflows
3. Adopt `gitops-workflow` so that all changes flow through Git with automated reconciliation

---

## CI/CD Pipelines

Skills for building, testing, and deploying code through automated pipelines.

| Skill | Category | Description |
|-------|----------|-------------|
| `deployment-pipeline-design` | technical | Design multi-stage CI/CD pipelines with approval gates, security checks, and rollback strategies |
| `github-actions-templates` | technical | Create production-ready GitHub Actions workflows for automated testing, building, and deploying |
| `github-workflows` | technical | Comprehensive GitHub Actions expertise covering CI/CD, PR automation, and security workflows |
| `gitlab-ci-patterns` | technical | Build GitLab CI/CD pipelines with multi-stage workflows, caching, and distributed runners |
| `git-pushing` | technical | Git push workflows for safely pushing changes with branch management and conflict resolution |

### Suggested Workflow: Setting Up CI/CD for a New Project

1. Plan pipeline stages and gates with `deployment-pipeline-design`
2. Implement workflows using `github-actions-templates` or `gitlab-ci-patterns` depending on your platform
3. Use `github-workflows` for advanced automation such as PR checks, labeling, and security scans
4. Establish branch policies and push conventions with `git-pushing`
5. Connect to `gitops-workflow` for continuous delivery to Kubernetes

---

## Monitoring and Observability

Skills for gaining visibility into system health, performance, and behavior across distributed services.

| Skill | Category | Description |
|-------|----------|-------------|
| `monitoring-alerting` | ai-agents | Prometheus, Grafana, and PagerDuty setup for comprehensive observability and incident response |
| `monitoring-observability` | ai-agents | Production monitoring with Prometheus, Grafana, ELK stack, and distributed tracing |
| `prometheus-configuration` | ai-agents | Set up Prometheus for metric collection, storage, and monitoring of infrastructure and applications |
| `grafana-dashboards` | ai-agents | Create production Grafana dashboards for real-time visualization of system and application metrics |
| `distributed-tracing` | ai-agents | Implement distributed tracing with Jaeger and Tempo to track requests across microservices |
| `slo-implementation` | ai-agents | Define SLIs, SLOs, and error budgets with alerting for measuring service reliability |
| `sentry-monitoring` | ai-agents | Error tracking, performance monitoring, and alerting with Sentry for production applications |
| `log-management` | ai-agents | ELK stack, log aggregation, analysis, and operational logging best practices |

### Suggested Workflow: Building an Observability Stack

1. Define reliability targets with `slo-implementation` to establish SLIs and error budgets
2. Deploy metric collection with `prometheus-configuration`
3. Build operational dashboards using `grafana-dashboards`
4. Add request tracing across services with `distributed-tracing`
5. Centralize logs with `log-management` for correlation and troubleshooting
6. Set up application error tracking with `sentry-monitoring`
7. Tie everything together with `monitoring-alerting` for paging and escalation

---

## Reliability and Incident Management

Skills for keeping systems running, recovering from failures, and learning from incidents.

| Skill | Category | Description |
|-------|----------|-------------|
| `incident-response` | technical | Security incident response planning, execution, and post-incident analysis |
| `disaster-recovery` | technical | Disaster recovery planning and implementation including DR testing and RTO/RPO targets |
| `backup-strategies` | strategy | Backup strategy design and implementation including RPO/RTO requirements and automation |
| `server-administration` | ai-agents | Linux and Windows server management including provisioning, configuration, and performance tuning |

### Suggested Workflow: Building a Reliability Program

1. Start with `backup-strategies` to define RPO/RTO requirements and backup architecture
2. Design recovery procedures with `disaster-recovery` including failover testing
3. Create incident runbooks and escalation paths using `incident-response`
4. Harden server configurations with `server-administration`
5. Measure reliability outcomes with `slo-implementation`

---

## Cloud Architecture

Skills for designing, deploying, and optimizing cloud infrastructure across providers.

| Skill | Category | Description |
|-------|----------|-------------|
| `cloud-architecture` | technical | AWS, Azure, and GCP architecture patterns, service selection, and cost optimization |
| `multi-cloud-architecture` | technical | Design multi-cloud architectures to avoid vendor lock-in and leverage best-of-breed services |
| `hybrid-cloud-networking` | technical | Configure secure connectivity between on-premises infrastructure and cloud platforms |
| `cdn-configuration` | ai-agents | CloudFlare, Fastly, edge caching, and content delivery optimization |

### Suggested Workflow: Designing a Cloud Migration

1. Assess current architecture and target cloud services with `cloud-architecture`
2. Evaluate multi-provider strategy with `multi-cloud-architecture` if vendor diversification is needed
3. Set up secure connectivity between on-prem and cloud using `hybrid-cloud-networking`
4. Optimize content delivery and edge performance with `cdn-configuration`
5. Codify the result using `terraform-iac-deployment`

---

## Security

Skills for hardening infrastructure, managing credentials, and detecting vulnerabilities.

| Skill | Category | Description |
|-------|----------|-------------|
| `defense-in-depth` | ai-agents | Validate at every layer data passes through to make bugs impossible |
| `secrets-management` | ai-agents | Vault, AWS Secrets Manager, key rotation, and secure credential handling |
| `ssl-certificates` | ai-agents | Certificate management, renewal automation, and PKI infrastructure |
| `vulnerability-management` | ai-agents | Vulnerability management program implementation including scanning and remediation |
| `security-scanning-framework` | ai-agents | Automated security scanning with SAST, DAST, SCA, and secrets detection in CI/CD pipelines |

### Suggested Workflow: Hardening a Production Environment

1. Adopt `defense-in-depth` to establish layered validation across the stack
2. Centralize credential management with `secrets-management`
3. Automate certificate lifecycle with `ssl-certificates`
4. Integrate `security-scanning-framework` into CI/CD pipelines for automated detection
5. Establish ongoing `vulnerability-management` processes for triage and remediation
6. Enforce cluster-level security with `k8s-security-policies`

---

## Cross-Domain Workflows

These workflows combine skills from multiple sections above for common DevOps scenarios.

### New Production Service (End to End)

1. `cloud-architecture` -- Select services and design infrastructure
2. `terraform-iac-deployment` -- Provision infrastructure as code
3. `container-orchestration` -- Containerize the application
4. `k8s-manifest-generator` -- Generate Kubernetes resources
5. `deployment-pipeline-design` -- Build CI/CD pipeline
6. `monitoring-observability` -- Add metrics, logs, and tracing
7. `incident-response` -- Create runbooks and on-call procedures

### Security Audit

1. `security-scanning-framework` -- Scan code and dependencies
2. `vulnerability-management` -- Triage and prioritize findings
3. `secrets-management` -- Rotate and secure credentials
4. `k8s-security-policies` -- Audit cluster security posture
5. `ssl-certificates` -- Verify certificate validity and automation

---

## Related Guides

- [Developer Guide](developer-guide.md) for application-level development skills
- [Data Analyst Guide](data-analyst-guide.md) for metrics and dashboard design
- [Executive Guide](executive-guide.md) for incident communication and business continuity
- [Category Guides](../04-category-guides/README.md) for browsing by category
