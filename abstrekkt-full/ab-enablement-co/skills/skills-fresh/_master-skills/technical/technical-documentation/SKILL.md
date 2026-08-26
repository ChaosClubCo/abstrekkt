---
name: technical-documentation
description: Helps build and debug technical documentation processes. API documentation, architecture diagrams, runbooks, and technical writing best practices. Use when creating documentation for APIs, systems, operational procedures, or when establishing documentation standards for engineering teams.
---

# Technical Documentation

## Overview

Technical documentation is the bridge between complex systems and the people who need to understand, use, and maintain them. Good documentation accelerates onboarding, reduces support burden, enables self-service integration, and preserves institutional knowledge that would otherwise live only in developers' heads.

This skill covers the full spectrum of technical documentation: API references, architecture documentation, operational runbooks, and developer guides. It provides templates and patterns that make documentation creation efficient and ensure documents remain useful over time.

The challenge with documentation is not just creating it but maintaining it. This skill emphasizes documentation-as-code practices that keep documentation close to the systems it describes and processes that ensure documentation stays current as systems evolve.

### Why This Matters
- Good API documentation reduces integration time by 70% and support tickets by 50%
- Runbooks reduce incident resolution time by providing immediate context and procedures
- Architecture documentation enables informed decisions and faster onboarding
- Documentation is often the first impression developers have of your platform

## When to Use

### Primary Triggers
- Creating API documentation for internal or external consumers
- Documenting system architecture for the team
- Writing operational runbooks for on-call engineers
- Establishing documentation standards for a team or organization
- Migrating or consolidating existing documentation

### Specific Use Cases
- "Create OpenAPI documentation for our REST API"
- "Document our microservices architecture"
- "Write a runbook for database failover procedures"
- "Set up a documentation site with Docusaurus"
- "Create onboarding documentation for new engineers"

## Core Processes

### 1. Documentation Types and Purposes

**Documentation Quadrant**

| Type | Audience | Purpose | Update Frequency |
|------|----------|---------|------------------|
| Tutorials | New users | Learning | When features change |
| How-to Guides | Users with goals | Accomplishing tasks | With new use cases |
| Reference | Developers | Looking up details | With every change |
| Explanation | Architects/Leads | Understanding decisions | When decisions change |

**Document Type Selection**

```
What does the reader need?
├── Learn concepts → Tutorials / Explanations
│   └── Step-by-step? → Tutorial
│   └── Understanding? → Explanation
└── Complete a task → How-to / Reference
    └── Specific goal? → How-to Guide
    └── Looking up details? → Reference
```

### 2. API Documentation

**OpenAPI Specification Structure**

```yaml
# openapi.yaml
openapi: 3.1.0
info:
  title: Orders API
  description: |
    The Orders API allows you to create, retrieve, and manage customer orders.

    ## Authentication
    All endpoints require Bearer token authentication.
    ```
    Authorization: Bearer <your_api_key>
    ```

    ## Rate Limits
    - 1000 requests per minute per API key
    - Rate limit headers included in responses

    ## Errors
    Errors follow RFC 7807 Problem Details format.
  version: 1.0.0
  contact:
    email: api-support@company.com
    url: https://developers.company.com/support

servers:
  - url: https://api.company.com/v1
    description: Production
  - url: https://api.staging.company.com/v1
    description: Staging

tags:
  - name: Orders
    description: Order management operations
  - name: Products
    description: Product catalog operations

paths:
  /orders:
    get:
      operationId: listOrders
      summary: List orders
      description: |
        Retrieves a paginated list of orders for the authenticated user.
        Results are sorted by creation date, newest first.
      tags: [Orders]
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/PageSizeParam'
        - name: status
          in: query
          description: Filter by order status
          schema:
            $ref: '#/components/schemas/OrderStatus'
      responses:
        '200':
          description: List of orders
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Order'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
              example:
                data:
                  - id: ord_123
                    status: processing
                    total: 99.99
                    createdAt: '2024-01-15T10:30:00Z'
                meta:
                  page: 1
                  pageSize: 20
                  totalCount: 156
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      operationId: createOrder
      summary: Create an order
      description: Creates a new order with the specified items.
      tags: [Orders]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
            example:
              items:
                - productId: prod_456
                  quantity: 2
              shippingAddressId: addr_789
      responses:
        '201':
          description: Order created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/Order'
        '400':
          $ref: '#/components/responses/BadRequest'
        '422':
          description: Invalid order (e.g., out of stock)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    Order:
      type: object
      description: Represents a customer order
      required: [id, status, items, total, createdAt]
      properties:
        id:
          type: string
          description: Unique order identifier
          example: ord_123abc
        status:
          $ref: '#/components/schemas/OrderStatus'
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        total:
          type: number
          format: decimal
          description: Order total in USD
          example: 99.99
        createdAt:
          type: string
          format: date-time
          description: When the order was created

    OrderStatus:
      type: string
      enum: [pending, processing, shipped, delivered, cancelled]
      description: |
        Order status:
        - `pending` - Order placed, awaiting processing
        - `processing` - Order being prepared
        - `shipped` - Order in transit
        - `delivered` - Order delivered to customer
        - `cancelled` - Order cancelled

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: API key obtained from the developer portal

security:
  - bearerAuth: []
```

### 3. Architecture Documentation

**Architecture Decision Record (ADR) Template**

```markdown
# ADR-001: Use PostgreSQL as Primary Database

## Status
Accepted

## Context
We need to select a primary database for our SaaS application. Key requirements:
- Strong consistency for financial data
- Complex querying capabilities
- Horizontal read scaling
- Good tooling and team familiarity

## Decision
We will use PostgreSQL as our primary database, hosted on AWS RDS with read replicas.

## Alternatives Considered

### MySQL/Aurora MySQL
- Pros: Similar capabilities, Aurora performance
- Cons: Less advanced features (JSONB, CTEs historically)
- Verdict: Viable but PostgreSQL slightly preferred

### MongoDB
- Pros: Schema flexibility, horizontal scaling
- Cons: Weaker consistency guarantees, complex transactions
- Verdict: Not suitable for financial data requirements

### DynamoDB
- Pros: Fully managed, excellent scaling
- Cons: Limited querying, expensive for our access patterns
- Verdict: May use for specific use cases (sessions) but not primary

## Consequences

### Positive
- Team familiarity reduces ramp-up time
- Rich feature set (JSONB, full-text search) covers future needs
- Strong ecosystem of tools and libraries
- Read replicas provide read scaling path

### Negative
- Write scaling limited (requires sharding or Citus)
- Need to manage RDS instances and backups
- Connection pooling complexity with serverless

### Risks and Mitigations
- **Risk**: Connection pool exhaustion with Lambda
  - **Mitigation**: Use RDS Proxy or PgBouncer
- **Risk**: Storage growth over time
  - **Mitigation**: Implement data archival strategy early

## Related Documents
- [Database Schema Design](./database-schema.md)
- [Data Retention Policy](./data-retention.md)

## Date
2024-01-15

## Authors
- @tech-lead
- @senior-engineer
```

**System Architecture Document Template**

```markdown
# System Architecture: Order Processing System

## Overview
The Order Processing System handles customer order creation, payment processing,
fulfillment, and delivery tracking. It processes approximately 10,000 orders
per day with peak loads of 100 orders per minute.

## Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Mobile    │     │     Web     │     │   Partner   │
│    App      │     │    App      │     │    API      │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │  API Gateway │
                    │  (Kong)      │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
   ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
   │  Orders   │    │ Payments  │    │ Inventory │
   │  Service  │    │  Service  │    │  Service  │
   └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                   ┌──────▼──────┐
                   │   Postgres  │
                   │   (RDS)     │
                   └─────────────┘
```

## Components

### API Gateway (Kong)
- **Purpose**: Rate limiting, authentication, request routing
- **Technology**: Kong Gateway on ECS
- **SLA**: 99.99% availability

### Orders Service
- **Purpose**: Order CRUD, order state management
- **Technology**: Node.js, Express, TypeScript
- **Dependencies**: Payments Service, Inventory Service
- **Data Store**: PostgreSQL (orders, order_items tables)

### Payments Service
- **Purpose**: Payment processing, refunds
- **Technology**: Node.js, Express, TypeScript
- **External Dependencies**: Stripe API
- **Data Store**: PostgreSQL (payments table)

## Data Flow

### Order Creation Flow
1. Client submits order via API Gateway
2. Orders Service validates request
3. Orders Service reserves inventory (Inventory Service)
4. Orders Service initiates payment (Payments Service)
5. On payment success, order confirmed
6. Event published to order.created topic

### Failure Handling
- Payment failure: Release inventory reservation, return error
- Inventory unavailable: Return 422 with available quantities
- Service timeout: Retry with exponential backoff (max 3 attempts)

## Security

### Authentication
- JWT tokens issued by Auth0
- Token validation at API Gateway
- Service-to-service: mTLS with certificate rotation

### Data Protection
- All data encrypted at rest (RDS encryption)
- All traffic encrypted in transit (TLS 1.3)
- PII fields encrypted at application level

## Monitoring

### Key Metrics
- Order creation success rate: Target > 99.9%
- Order creation latency: p99 < 500ms
- Payment processing time: p99 < 2s

### Alerts
- Error rate > 1%: Page on-call
- Latency p99 > 1s: Slack notification
- Database connection pool > 80%: Slack notification

## Related Documents
- [API Documentation](./api-docs.md)
- [Database Schema](./database-schema.md)
- [Runbook: Order Processing Issues](./runbooks/order-processing.md)
```

### 4. Runbook Documentation

**Runbook Template**

```markdown
# Runbook: Database Failover

## Overview
This runbook describes the procedure for failing over from the primary PostgreSQL
database to the standby replica during an outage.

**Severity**: P1 (Critical)
**Expected Duration**: 15-30 minutes
**Last Updated**: 2024-01-15
**Owner**: @database-team

## Prerequisites
- AWS Console access with RDS permissions
- Access to #database-incidents Slack channel
- PagerDuty account for escalation

## Detection
This runbook should be executed when:
- Primary database is unreachable for > 5 minutes
- RDS health check shows unhealthy primary
- Multiple services reporting database connection errors

### Verification Commands
```bash
# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier production-primary \
  --query 'DBInstances[0].DBInstanceStatus'

# Check replica lag
aws rds describe-db-instances \
  --db-instance-identifier production-replica \
  --query 'DBInstances[0].StatusInfos'
```

## Procedure

### Step 1: Confirm Outage (5 minutes)
1. [ ] Check CloudWatch metrics for connection errors
2. [ ] Attempt direct connection to primary: `psql -h primary.xxx.rds.amazonaws.com`
3. [ ] Verify from multiple locations (not just one service)
4. [ ] Post in #database-incidents: "Investigating primary database issues"

### Step 2: Initiate Failover (5 minutes)
1. [ ] Navigate to RDS Console > Databases > production-primary
2. [ ] Click Actions > Failover
3. [ ] Confirm failover in dialog
4. [ ] Monitor failover progress in Events tab

**AWS CLI Alternative:**
```bash
aws rds failover-db-cluster \
  --db-cluster-identifier production-cluster \
  --target-db-instance-identifier production-replica
```

### Step 3: Verify Failover (5 minutes)
1. [ ] Wait for instance status to show "available"
2. [ ] Verify new primary is accepting connections:
   ```bash
   psql -h production-cluster.cluster-xxx.rds.amazonaws.com -U admin -c "SELECT 1"
   ```
3. [ ] Check application health dashboards returning to normal

### Step 4: Notify Stakeholders
1. [ ] Update #database-incidents with resolution
2. [ ] Page off (if applicable)
3. [ ] Create incident ticket for post-mortem

## Rollback
If failover causes issues:
1. Failover again to return to original primary (if healthy)
2. Or restore from snapshot to new instance

## Post-Incident
- [ ] Schedule post-mortem within 48 hours
- [ ] Review replica lag metrics
- [ ] Verify new replica is syncing properly
- [ ] Update this runbook with any learnings

## Escalation
If failover fails or issues persist:
1. Page Database Team Lead: @db-lead (PagerDuty)
2. Escalate to AWS Support (Premium Support ticket)

## Related Resources
- [RDS Failover Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
- [Database Architecture Doc](../architecture/database.md)
- [Connection String Configuration](../config/database-config.md)
```

### 5. Documentation Site Setup

**Docusaurus Configuration**

```javascript
// docusaurus.config.js
module.exports = {
  title: 'Company Developer Docs',
  tagline: 'Build amazing integrations',
  url: 'https://developers.company.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/company/docs/edit/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          orders: {
            specPath: 'openapi/orders.yaml',
            outputDir: 'docs/api/orders',
          },
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Developer Docs',
      items: [
        { type: 'doc', docId: 'getting-started', label: 'Guides' },
        { to: '/docs/api', label: 'API Reference' },
        { to: '/docs/sdks', label: 'SDKs' },
        { href: 'https://github.com/company', label: 'GitHub' },
      ],
    },
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'company_docs',
    },
  },
};
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Docusaurus | Documentation sites | Free | React-based, versioning |
| GitBook | Collaborative docs | Free tier | Easy editing, clean UI |
| Readme.io | API documentation | $99/mo+ | Interactive, analytics |
| Swagger UI | OpenAPI rendering | Free | Standard, interactive |
| Redoc | OpenAPI documentation | Free | Clean three-panel layout |
| Mermaid | Diagrams in markdown | Free | Code-based diagrams |

## Metrics & KPIs

### Documentation Quality Metrics
- **Documentation Coverage**: % of APIs/services documented
- **Freshness**: % of docs updated in last 6 months
- **Search Success Rate**: Users finding what they need
- **Time on Page**: Engagement with documentation

### Documentation Impact Metrics
- **Support Ticket Reduction**: Tickets about documented topics
- **Integration Time**: Time for new partners to integrate
- **Developer Satisfaction**: Survey scores for documentation

## Common Pitfalls

### 1. Documentation Rot
**Problem**: Documentation becomes outdated as systems change
**Prevention**: Documentation lives with code (docs-as-code). CI checks for doc updates with code changes. Regular review cycles.

### 2. Write-Only Documentation
**Problem**: Documentation written but never read or maintained
**Prevention**: Track usage analytics. Get feedback from readers. Link docs from code and error messages.

### 3. Missing Context
**Problem**: Reference docs without explaining the "why"
**Prevention**: Include explanation documents. Start with use cases. Provide working examples.

### 4. Inconsistent Style
**Problem**: Documentation with varying tone, format, and depth
**Prevention**: Create and enforce style guide. Use templates. Review documentation PRs.

## Integration Points

- **API Development**: API specs become documentation
- **Code Review**: Review documentation changes with code
- **DevOps Practices**: Documentation site in CI/CD
- **Testing Strategies**: Example code should be tested
- **Cloud Architecture**: Architecture diagrams and ADRs
- **Database Design**: Schema documentation
