# Developer Guide

This guide curates the most valuable skills for software engineers, full-stack developers, and technical leads. Skills are grouped by development domain so you can quickly find what applies to your current work.

The Skills Library contains over 100 development-focused skills across the `technical` and `ai-agents` categories. This guide highlights the top picks in each subcategory.

---

## API and Backend Development

These skills cover server-side architecture, API design, and backend frameworks.

| Skill | Category | Description |
|-------|----------|-------------|
| `api-design-principles` | technical | Best practices for designing RESTful and GraphQL APIs with consistent conventions |
| `api-development` | technical | End-to-end API development including routing, validation, and documentation |
| `backend-development` | technical | Server-side application development patterns and practices |
| `backend-dev-guidelines` | technical | Coding standards and guidelines for backend teams |
| `nodejs-backend-patterns` | technical | Node.js-specific backend patterns including middleware, error handling, and async flows |
| `fastapi-templates` | technical | FastAPI project scaffolding with typing, dependency injection, and OpenAPI docs |
| `postgresql` | technical | PostgreSQL database administration, query writing, and optimization |
| `postgresql-table-design` | ai-agents | Schema design patterns for PostgreSQL including normalization and indexing |
| `databases` | technical | General database concepts, selection criteria, and management practices |
| `sql-optimization-patterns` | technical | Query optimization techniques including indexing, execution plans, and rewrites |
| `supabase-administration` | technical | Supabase setup, configuration, row-level security, and edge functions |

### Suggested Workflow: Building a New API

1. Start with `api-design-principles` to establish your API contract
2. Use `postgresql-table-design` or `database-design` to model your data layer
3. Apply `fastapi-templates` or `nodejs-backend-patterns` for implementation
4. Use `api-development` for endpoint validation and documentation
5. Finish with `sql-optimization-patterns` to tune query performance

---

## Frontend Development

Skills for building user interfaces, component libraries, and modern web applications.

| Skill | Category | Description |
|-------|----------|-------------|
| `frontend-development` | technical | Core frontend development practices including HTML, CSS, and JavaScript |
| `frontend-dev-guidelines` | technical | Standards and conventions for frontend codebases |
| `react-modernization` | technical | Migrating and modernizing React applications with hooks, concurrent features, and Server Components |
| `angular-migration` | ai-agents | Strategies for upgrading Angular applications across major versions |
| `ui-component-library` | technical | Building and maintaining reusable component libraries |
| `responsive-design-patterns` | creative | Responsive layout techniques including grid, flexbox, and container queries |
| `modern-javascript-patterns` | technical | Contemporary JavaScript idioms including modules, async/await, and functional patterns |
| `typescript-advanced-types` | technical | Advanced TypeScript type patterns including generics, mapped types, and type guards |
| `web-development` | technical | Full-stack web development fundamentals and tooling |
| `web-frameworks` | ai-agents | Comparison and usage patterns for modern web frameworks |
| `mobile-development` | technical | Cross-platform and native mobile development approaches |
| `mobile-patterns` | technical | UI and architecture patterns specific to mobile applications |
| `build-iphone-apps` | technical | iOS application development with Swift and SwiftUI |
| `build-macos-apps` | technical | macOS application development with AppKit and SwiftUI |

### Suggested Workflow: Modernizing a Frontend

1. Audit current state with `code-auditor`
2. Apply `react-modernization` to upgrade component patterns
3. Use `typescript-advanced-types` to improve type safety
4. Build shared components with `ui-component-library`
5. Ensure mobile support with `responsive-design-patterns`

---

## DevOps and Infrastructure

Skills for deployment, container orchestration, and infrastructure management.

| Skill | Category | Description |
|-------|----------|-------------|
| `devops` | technical | Core DevOps philosophy, practices, and toolchain overview |
| `devops-practices` | technical | Specific DevOps workflows including CI/CD, infrastructure as code, and monitoring |
| `container-orchestration` | ai-agents | Docker and container management patterns for development and production |
| `k8s-manifest-generator` | ai-agents | Generating Kubernetes manifests with best practices for resource limits and probes |
| `helm-chart-scaffolding` | ai-agents | Creating and managing Helm charts for Kubernetes deployments |
| `deployment-pipeline-design` | technical | Designing CI/CD pipelines with stages, gates, and rollback strategies |
| `github-actions-templates` | technical | Reusable GitHub Actions workflows for common CI/CD tasks |
| `github-workflows` | technical | Advanced GitHub workflow patterns including matrix builds and reusable workflows |
| `gitlab-ci-patterns` | technical | GitLab CI pipeline configuration and optimization |
| `gitops-workflow` | technical | GitOps practices using tools like ArgoCD and Flux |
| `terraform-iac-deployment` | technical | Terraform infrastructure provisioning and state management |
| `terraform-module-library` | technical | Building reusable Terraform modules for common infrastructure patterns |
| `firebase-deployment` | technical | Firebase hosting, functions, and Firestore deployment workflows |
| `vercel-deployment` | technical | Vercel deployment configuration for frontend and full-stack applications |

### Suggested Workflow: Setting Up a New Project Infrastructure

1. Define infrastructure with `terraform-iac-deployment`
2. Create deployment pipeline using `github-actions-templates`
3. Containerize the application with `container-orchestration`
4. Generate Kubernetes resources with `k8s-manifest-generator`
5. Package with `helm-chart-scaffolding` for release management

---

## Testing and Quality

Skills for building reliable software through testing, reviews, and debugging.

| Skill | Category | Description |
|-------|----------|-------------|
| `testing-strategies` | technical | Comprehensive testing approaches including unit, integration, and end-to-end |
| `e2e-testing-patterns` | technical | End-to-end testing with tools like Playwright, Cypress, and Selenium |
| `javascript-testing-patterns` | technical | JavaScript-specific testing with Jest, Vitest, and Testing Library |
| `python-testing-patterns` | technical | Python testing with pytest, fixtures, mocking, and parametrization |
| `typescript-advanced-types` | technical | Type-level testing and type safety verification |
| `temporal-python-testing` | technical | Testing Temporal workflows and activities in Python |
| `webapp-testing` | technical | Testing strategies specific to web applications |
| `bats-testing-patterns` | ai-agents | Bash Automated Testing System for shell script testing |
| `test-fixing` | technical | Diagnosing and fixing flaky and failing tests |
| `code-review` | technical | Structured code review processes and checklists |
| `code-review-excellence` | ai-agents | Advanced code review techniques focusing on architecture and design feedback |
| `code-auditor` | technical | Automated and manual code audit processes for quality and security |
| `debugging-strategies` | ai-agents | Systematic approaches to finding and fixing bugs |
| `systematic-debugging` | ai-agents | Structured debugging methodologies for complex systems |
| `error-handling-patterns` | ai-agents | Robust error handling and recovery strategies across languages |
| `error-tracking` | technical | Error tracking and monitoring with tools like Sentry and Datadog |

### Suggested Workflow: Improving Test Coverage

1. Assess current coverage with `testing-strategies`
2. Add unit tests using `javascript-testing-patterns` or `python-testing-patterns`
3. Build integration tests with `e2e-testing-patterns`
4. Set up `error-tracking` for production monitoring
5. Establish `code-review` practices to maintain quality

---

## Architecture and Design

Skills for system design, architecture decisions, and technical planning.

| Skill | Category | Description |
|-------|----------|-------------|
| `architecture-patterns` | ai-agents | Common software architecture patterns including microservices, event-driven, and CQRS |
| `microservices-patterns` | technical | Microservices design including service boundaries, communication, and data management |
| `cloud-architecture` | technical | Cloud-native architecture patterns across AWS, GCP, and Azure |
| `multi-cloud-architecture` | technical | Strategies for multi-cloud deployments and portability |
| `hybrid-cloud-networking` | technical | Networking patterns for hybrid cloud environments |
| `solution-architecture` | ai-agents | End-to-end solution design connecting business requirements to technical implementation |
| `architecture-diagram-creator` | technical | Creating clear architecture diagrams using tools like Mermaid and draw.io |
| `design-system-builder` | technical | Building comprehensive design systems with tokens, components, and documentation |
| `design-system-foundation` | technical | Establishing foundational design system elements including tokens and primitives |
| `langchain-architecture` | ai-agents | Designing LLM-powered applications with LangChain frameworks |
| `rag-implementation` | ai-agents | Retrieval-augmented generation system design and optimization |
| `data-modeling` | ai-agents | Data modeling techniques for relational, document, and graph databases |
| `database-design` | ai-agents | Database schema design, normalization, and performance considerations |

### Suggested Workflow: Designing a New System

1. Gather requirements with `solution-architecture`
2. Select patterns with `architecture-patterns`
3. Document with `architecture-diagram-creator`
4. Design the data layer with `data-modeling`
5. Plan implementation with `microservices-patterns` or `cloud-architecture`

---

## Code Quality and Workflow

Skills for writing clean code, managing repositories, and improving developer productivity.

| Skill | Category | Description |
|-------|----------|-------------|
| `code-refactor` | technical | Refactoring techniques for improving code structure without changing behavior |
| `code-auditor` | technical | Systematic code auditing for quality, performance, and security issues |
| `code-review` | technical | Effective code review practices and feedback patterns |
| `code-review-excellence` | ai-agents | Elevating code reviews to cover design, architecture, and team growth |
| `git-advanced-workflows` | ai-agents | Advanced Git workflows including rebasing, cherry-picking, and bisecting |
| `git-pushing` | technical | Git push workflows, branch strategies, and remote management |
| `performance-optimization` | technical | Application performance profiling and optimization techniques |
| `python-performance-optimization` | technical | Python-specific optimization including profiling, caching, and algorithmic improvements |
| `shellcheck-configuration` | technical | Configuring ShellCheck for shell script linting and best practices |
| `changelog-generator` | technical | Automated changelog generation from commit history and PR metadata |
| `technical-documentation` | technical | Writing clear technical documentation for APIs, systems, and processes |
| `technical-doc-creator` | technical | Generating technical documentation from code and architecture |
| `codebase-documenter` | ai-agents | Automated codebase documentation generation and maintenance |
| `monorepo-management` | ai-agents | Managing monorepos with tools like Nx, Turborepo, and Bazel |

---

## Security

Skills for securing applications, infrastructure, and data.

| Skill | Category | Description |
|-------|----------|-------------|
| `auth-implementation-patterns` | technical | Authentication and authorization implementation across frameworks |
| `better-auth` | ai-agents | Modern authentication patterns including OAuth2, OIDC, and passkeys |
| `secrets-management` | ai-agents | Managing secrets, API keys, and credentials securely |
| `security-scanning-framework` | ai-agents | Setting up automated security scanning in CI/CD pipelines |
| `sast-configuration` | ai-agents | Static application security testing configuration and tuning |
| `penetration-testing` | technical | Penetration testing methodologies and reporting |
| `vulnerability-management` | ai-agents | Tracking and remediating security vulnerabilities |
| `k8s-security-policies` | ai-agents | Kubernetes security policies including Pod Security Standards and network policies |
| `defense-in-depth` | ai-agents | Layered security architecture strategies |
| `solidity-security` | ai-agents | Smart contract security patterns and vulnerability prevention |

---

## AI and Machine Learning

Skills for building AI-powered features and integrations.

| Skill | Category | Description |
|-------|----------|-------------|
| `langchain-architecture` | ai-agents | Building applications with LangChain and large language models |
| `rag-implementation` | ai-agents | Retrieval-augmented generation pipelines for knowledge-grounded AI |
| `llm-evaluation` | ai-agents | Evaluating LLM outputs for quality, safety, and accuracy |
| `prompt-engineering-patterns` | ai-agents | Systematic prompt engineering techniques for reliable LLM outputs |
| `prompt-engineering-ui` | ai-agents | Building user interfaces for prompt engineering and testing |
| `ml-pipeline-workflow` | ai-agents | End-to-end machine learning pipeline design and orchestration |
| `mcp-builder` | ai-agents | Building Model Context Protocol servers and integrations |
| `mcp-management` | ai-agents | Managing and configuring MCP tool integrations |
| `google-adk-python` | ai-agents | Google Agent Development Kit for building AI agents in Python |
| `context-engineering` | ai-agents | Techniques for optimizing context windows and information retrieval for LLMs |
| `ai-multimodal` | ai-agents | Building multimodal AI applications with vision, audio, and text |

---

## Related Guides

- [DevOps Guide](devops-guide.md) for deeper infrastructure coverage
- [Data Analyst Guide](data-analyst-guide.md) for database and analytics skills
- [Designer Guide](designer-guide.md) for frontend design patterns
- [Category Guides](../04-category-guides/README.md) for browsing by category
