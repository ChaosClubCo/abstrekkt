# System Architecture Diagrams
**Unified AI Orchestration System v3.0**

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Dashboard]
        MOBILE[Mobile App]
        CLI[CLI Tool]
        API_CLIENT[API Client]
    end

    subgraph "API Gateway Layer"
        GATEWAY[API Gateway<br/>Auth, Rate Limiting, Routing]
    end

    subgraph "Orchestration Layer"
        ROUTER[Agent Router<br/>Decision Engine]
        CLAUDE_FLOW[Claude-Flow<br/>Branch Manager]
        STATE[State Manager<br/>Workflow Engine]
    end

    subgraph "Prompt Engineering Layer"
        CONTEXT_BUILD[Context Builder<br/>Assembly Engine]
        TEMPLATE[Template Engine<br/>Role Templates]
        LYRA[Lyra Optimizer<br/>Prompt Refinement]
        VALIDATE[Validation Engine<br/>Quality Gates]
    end

    subgraph "AI Agent Layer"
        VISIONARY[Visionary Agent]
        PM[Product Manager Agent]
        UX[UX Designer Agent]
        UI[UI Designer Agent]
        MOBILE_DEV[Mobile Dev Agent]
        BACKEND[Backend Dev Agent]
        QA[QA Engineer Agent]
        DEVOPS[DevOps Agent]
        SECURITY[Security Agent]
        MARKETING[Marketing Agent]
        BA[Business Analyst Agent]
    end

    subgraph "AI Model Layer"
        CLAUDE[Claude API<br/>Sonnet 4.5]
        GPT4[GPT-4 Turbo]
        DEEPSEEK[DeepSeek-V3]
        LOCAL[Local Ollama]
    end

    subgraph "Integration Layer"
        GITHUB[GitHub]
        FIGMA[Figma]
        JIRA[Jira]
        NOTION[Notion]
        FIREBASE[Firebase]
        SUPABASE[Supabase]
    end

    subgraph "Data Layer"
        POSTGRES[(PostgreSQL<br/>Primary DB)]
        REDIS[(Redis<br/>Cache)]
        PINECONE[(Pinecone<br/>Vector DB)]
        S3[(S3/R2<br/>Object Storage)]
        ES[(Elasticsearch<br/>Search)]
    end

    WEB --> GATEWAY
    MOBILE --> GATEWAY
    CLI --> GATEWAY
    API_CLIENT --> GATEWAY

    GATEWAY --> ROUTER
    GATEWAY --> CLAUDE_FLOW
    GATEWAY --> STATE

    ROUTER --> CONTEXT_BUILD
    CONTEXT_BUILD --> TEMPLATE
    TEMPLATE --> LYRA
    LYRA --> VALIDATE

    VALIDATE --> VISIONARY
    VALIDATE --> PM
    VALIDATE --> UX
    VALIDATE --> UI
    VALIDATE --> MOBILE_DEV
    VALIDATE --> BACKEND
    VALIDATE --> QA
    VALIDATE --> DEVOPS
    VALIDATE --> SECURITY
    VALIDATE --> MARKETING
    VALIDATE --> BA

    VISIONARY --> CLAUDE
    PM --> CLAUDE
    UX --> CLAUDE
    UI --> CLAUDE
    MOBILE_DEV --> CLAUDE
    BACKEND --> CLAUDE
    QA --> GPT4
    DEVOPS --> DEEPSEEK
    SECURITY --> CLAUDE
    MARKETING --> GPT4
    BA --> CLAUDE

    ROUTER --> POSTGRES
    STATE --> POSTGRES
    CLAUDE_FLOW --> REDIS
    VALIDATE --> PINECONE

    ROUTER --> GITHUB
    ROUTER --> FIGMA
    ROUTER --> JIRA
    ROUTER --> NOTION
    BACKEND --> FIREBASE
    BACKEND --> SUPABASE

    style GATEWAY fill:#ff6b6b
    style ROUTER fill:#4ecdc4
    style CLAUDE_FLOW fill:#95e1d3
    style LYRA fill:#ffd93d
    style CLAUDE fill:#6c5ce7
    style POSTGRES fill:#0984e3
```

## 2. Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Gateway
    participant Router
    participant PromptEngine
    participant Agent
    participant ClaudeAPI
    participant Validator
    participant Database

    User->>Gateway: Submit Task Request
    Gateway->>Gateway: Authenticate & Authorize
    Gateway->>Router: Route Task
    
    Router->>Router: Analyze Task Requirements
    Router->>Router: Execute Decision Tree
    
    Router->>PromptEngine: Request Context-Engineered Prompt
    PromptEngine->>Database: Fetch Project Context
    PromptEngine->>Database: Fetch Role Template
    PromptEngine->>PromptEngine: Assemble Context
    PromptEngine->>PromptEngine: Lyra Optimization
    PromptEngine->>Router: Return Optimized Prompt
    
    Router->>Agent: Assign Task + Prompt
    Agent->>ClaudeAPI: Execute Prompt
    ClaudeAPI->>Agent: Return Response
    
    Agent->>Validator: Validate Output
    Validator->>Validator: Format Check
    Validator->>Validator: Content Quality
    Validator->>Validator: Hallucination Check
    Validator->>Validator: Security Scan
    Validator->>Agent: Validation Result
    
    alt Validation Passed
        Agent->>Database: Store Result
        Agent->>User: Return Success + Output
    else Validation Failed
        Agent->>Router: Escalate for Review
        Router->>User: Return for Revision
    end
```

## 3. Claude-Flow Integration

```mermaid
graph LR
    subgraph "Main Conversation Thread"
        M1[Message 1:<br/>Project Setup]
        M2[Message 2:<br/>Requirements]
        M3[Message 3:<br/>Architecture]
        M4[Message 4:<br/>Implementation]
    end

    subgraph "Exploration Branch 1"
        E1[Drift Detected:<br/>Database Options]
        E2[Deep Dive:<br/>PostgreSQL vs MongoDB]
        E3[Analysis:<br/>Performance Comparison]
        E4[Insights:<br/>Choose PostgreSQL]
    end

    subgraph "Exploration Branch 2"
        E5[Drift Detected:<br/>Security Concerns]
        E6[Analysis:<br/>RLS Implementation]
        E7[Solution:<br/>Security Layer Design]
        E8[Insights:<br/>Security Patterns]
    end

    M2 --> M3
    M3 -->|Drift Score > 0.3| E1
    E1 --> E2 --> E3 --> E4
    E4 -->|Merge Insights| M3
    
    M3 --> M4
    M4 -->|Drift Score > 0.3| E5
    E5 --> E6 --> E7 --> E8
    E8 -->|Merge Insights| M4

    style M1 fill:#4ecdc4
    style M2 fill:#4ecdc4
    style M3 fill:#4ecdc4
    style M4 fill:#4ecdc4
    style E4 fill:#95e1d3
    style E8 fill:#95e1d3
```

## 4. Quality Validation Pipeline

```mermaid
graph TD
    START[Agent Output] --> FORMAT[Layer 1:<br/>Format Validation]
    
    FORMAT -->|Valid| CONTENT[Layer 2:<br/>Content Quality]
    FORMAT -->|Invalid| FAIL1[Return for Revision]
    
    CONTENT -->|Valid| HALLUCINATION[Layer 3:<br/>Hallucination Check]
    CONTENT -->|Invalid| FAIL2[Return for Revision]
    
    HALLUCINATION -->|Clean| SECURITY[Layer 4:<br/>Security Scan]
    HALLUCINATION -->|Issues Found| FAIL3[Flag for Review]
    
    SECURITY -->|Pass| COMPLIANCE[Layer 5:<br/>Compliance Check]
    SECURITY -->|Vulnerabilities| FAIL4[Block & Alert]
    
    COMPLIANCE -->|Compliant| SUCCESS[✓ Approved<br/>Store & Deploy]
    COMPLIANCE -->|Non-Compliant| FAIL5[Block & Remediate]
    
    style FORMAT fill:#ffd93d
    style CONTENT fill:#ffd93d
    style HALLUCINATION fill:#ff6b6b
    style SECURITY fill:#ff6b6b
    style COMPLIANCE fill:#95e1d3
    style SUCCESS fill:#6bcf7f
```

## 5. Agent Role Hierarchy

```mermaid
graph TD
    VISION[Visionary/Product Strategist<br/>Market Research & Strategy]
    PM[Product Manager<br/>Backlog & Priorities]
    
    VISION --> PM
    
    PM --> DESIGN_PHASE[Design Phase]
    PM --> BUILD_PHASE[Build Phase]
    PM --> RELEASE_PHASE[Release Phase]
    PM --> GROWTH_PHASE[Growth Phase]
    
    DESIGN_PHASE --> UX[UX Designer<br/>User Research & Flows]
    DESIGN_PHASE --> UI[UI Designer<br/>Visual Design]
    
    BUILD_PHASE --> MOBILE[Mobile Developer<br/>iOS/Android]
    BUILD_PHASE --> BACKEND[Backend Developer<br/>APIs & Database]
    BUILD_PHASE --> DEVOPS[DevOps Engineer<br/>Infrastructure]
    
    RELEASE_PHASE --> QA[QA Engineer<br/>Testing & Quality]
    RELEASE_PHASE --> SECURITY[Security Analyst<br/>Security Audit]
    
    GROWTH_PHASE --> MARKETING[Marketing Strategist<br/>Growth & Acquisition]
    GROWTH_PHASE --> BA[Business Analyst<br/>Analytics & Metrics]
    
    style VISION fill:#6c5ce7
    style PM fill:#4ecdc4
    style UX fill:#ff6b6b
    style UI fill:#ff6b6b
    style MOBILE fill:#ffd93d
    style BACKEND fill:#ffd93d
    style DEVOPS fill:#ffd93d
    style QA fill:#95e1d3
    style SECURITY fill:#ff6b6b
    style MARKETING fill:#a29bfe
    style BA fill:#a29bfe
```

## 6. Scalability Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[NGINX Load Balancer]
    end

    subgraph "API Gateway Cluster"
        GW1[Gateway 1]
        GW2[Gateway 2]
        GW3[Gateway 3]
    end

    subgraph "Orchestrator Cluster"
        ORC1[Orchestrator 1]
        ORC2[Orchestrator 2]
        ORC3[Orchestrator 3]
    end

    subgraph "Agent Pool"
        A1[Agent Instance 1]
        A2[Agent Instance 2]
        A3[Agent Instance 3]
        A4[Agent Instance 4]
        AN[Agent Instance N]
    end

    subgraph "Cache Layer"
        REDIS1[(Redis Primary)]
        REDIS2[(Redis Replica)]
    end

    subgraph "Database Cluster"
        PG_PRIMARY[(PostgreSQL<br/>Primary)]
        PG_REPLICA1[(PostgreSQL<br/>Replica 1)]
        PG_REPLICA2[(PostgreSQL<br/>Replica 2)]
    end

    LB --> GW1
    LB --> GW2
    LB --> GW3

    GW1 --> ORC1
    GW2 --> ORC2
    GW3 --> ORC3

    ORC1 --> A1
    ORC1 --> A2
    ORC2 --> A3
    ORC2 --> A4
    ORC3 --> AN

    ORC1 --> REDIS1
    ORC2 --> REDIS1
    ORC3 --> REDIS1
    REDIS1 --> REDIS2

    ORC1 --> PG_PRIMARY
    ORC2 --> PG_REPLICA1
    ORC3 --> PG_REPLICA2
    PG_PRIMARY --> PG_REPLICA1
    PG_PRIMARY --> PG_REPLICA2

    style LB fill:#ff6b6b
    style REDIS1 fill:#ffd93d
    style PG_PRIMARY fill:#4ecdc4
```

## 7. Security Architecture

```mermaid
graph TB
    USER[User Request] --> WAF[Web Application Firewall]
    
    WAF --> AUTH[Authentication Layer<br/>JWT + OAuth]
    
    AUTH --> AUTHZ[Authorization Layer<br/>RBAC + Permissions]
    
    AUTHZ --> INPUT_VAL[Input Validation<br/>Schema + Sanitization]
    
    INPUT_VAL --> RATE_LIMIT[Rate Limiting<br/>Per User/IP]
    
    RATE_LIMIT --> APP[Application Logic]
    
    APP --> RLS[Row-Level Security<br/>PostgreSQL RLS]
    
    APP --> ENCRYPT[Encryption Layer<br/>At Rest + In Transit]
    
    APP --> AUDIT[Audit Logging<br/>All Actions Logged]
    
    RLS --> DATA[(Secure Data Store)]
    
    ENCRYPT --> DATA
    AUDIT --> LOGS[(Audit Logs)]
    
    style WAF fill:#ff6b6b
    style AUTH fill:#ff6b6b
    style AUTHZ fill:#ff6b6b
    style INPUT_VAL fill:#ffd93d
    style RATE_LIMIT fill:#ffd93d
    style RLS fill:#4ecdc4
    style ENCRYPT fill:#4ecdc4
    style AUDIT fill:#95e1d3
```

## 8. Deployment Pipeline

```mermaid
graph LR
    CODE[Code Push] --> LINT[Linting<br/>ESLint/Prettier]
    
    LINT --> TEST[Unit Tests<br/>Jest/Vitest]
    
    TEST --> BUILD[Build<br/>TypeScript Compile]
    
    BUILD --> SECURITY_SCAN[Security Scan<br/>Snyk/OWASP]
    
    SECURITY_SCAN --> INTEGRATION[Integration Tests<br/>API Testing]
    
    INTEGRATION --> STAGING[Deploy to Staging]
    
    STAGING --> E2E[E2E Tests<br/>Playwright]
    
    E2E --> SMOKE[Smoke Tests<br/>Critical Paths]
    
    SMOKE --> CANARY[Canary Deploy<br/>10% Traffic]
    
    CANARY --> MONITOR[Monitor Metrics<br/>15 minutes]
    
    MONITOR -->|Success| PRODUCTION[Full Production<br/>Deploy]
    MONITOR -->|Failure| ROLLBACK[Automatic Rollback]
    
    PRODUCTION --> VERIFY[Post-Deploy<br/>Verification]
    
    style CODE fill:#4ecdc4
    style LINT fill:#ffd93d
    style TEST fill:#ffd93d
    style SECURITY_SCAN fill:#ff6b6b
    style CANARY fill:#95e1d3
    style PRODUCTION fill:#6bcf7f
    style ROLLBACK fill:#ff6b6b
```

## 9. Monitoring & Observability

```mermaid
graph TD
    subgraph "Application Layer"
        APP1[API Gateway]
        APP2[Orchestrator]
        APP3[Agents]
    end

    subgraph "Metrics Collection"
        PROM[Prometheus<br/>Metrics]
        TRACES[Jaeger<br/>Distributed Tracing]
        LOGS[Loki<br/>Log Aggregation]
    end

    subgraph "Visualization"
        GRAFANA[Grafana Dashboards]
        KIBANA[Kibana Log Explorer]
    end

    subgraph "Alerting"
        ALERT_MGR[Alert Manager]
        PAGERDUTY[PagerDuty]
        SLACK[Slack Notifications]
    end

    subgraph "External Monitoring"
        SENTRY[Sentry<br/>Error Tracking]
        DATADOG[DataDog<br/>APM]
    end

    APP1 --> PROM
    APP2 --> PROM
    APP3 --> PROM

    APP1 --> TRACES
    APP2 --> TRACES
    APP3 --> TRACES

    APP1 --> LOGS
    APP2 --> LOGS
    APP3 --> LOGS

    PROM --> GRAFANA
    TRACES --> GRAFANA
    LOGS --> KIBANA

    PROM --> ALERT_MGR
    ALERT_MGR --> PAGERDUTY
    ALERT_MGR --> SLACK

    APP1 --> SENTRY
    APP2 --> SENTRY
    APP3 --> DATADOG

    style GRAFANA fill:#ff6b6b
    style ALERT_MGR fill:#ffd93d
    style SENTRY fill:#4ecdc4
```

---

## System Integration Points

### 1. External Integrations
- **GitHub**: Source code management, CI/CD triggers
- **Figma**: Design file synchronization, version tracking
- **Jira**: Task management, sprint planning
- **Notion**: Documentation, knowledge base
- **Firebase/Supabase**: Backend services, authentication

### 2. AI Model Integration
- **Claude API**: Primary reasoning, strategic thinking
- **GPT-4**: Specialized creative tasks, analysis
- **DeepSeek-V3**: Math and algorithmic optimization
- **Local Ollama**: Privacy-critical operations

### 3. Data Layer Integration
- **PostgreSQL**: Primary relational data with RLS
- **Redis**: Caching, session management, real-time data
- **Pinecone**: Vector embeddings for semantic search
- **S3/R2**: Object storage for artifacts and assets
- **Elasticsearch**: Full-text search across projects

---

## Key Architectural Decisions

### 1. **Microservices vs Monolith**
**Decision**: Hybrid approach
- **Core orchestration**: Monolithic for consistency
- **Agent workers**: Distributed microservices
- **Integrations**: Separate services for isolation

### 2. **Synchronous vs Asynchronous**
**Decision**: Mixed based on use case
- **User requests**: Synchronous (2-3s SLA)
- **Background tasks**: Asynchronous (job queues)
- **Integrations**: Asynchronous (webhooks)

### 3. **Database Strategy**
**Decision**: PostgreSQL with extensions
- **Primary data**: PostgreSQL with JSONB
- **Real-time**: Redis for caching
- **Search**: Elasticsearch for complex queries
- **Vectors**: Pinecone for embeddings

### 4. **Scaling Strategy**
**Decision**: Horizontal scaling with load balancing
- **Auto-scaling**: Based on CPU + queue depth
- **Load balancing**: Round-robin with health checks
- **Database**: Read replicas for scale

### 5. **Security Approach**
**Decision**: Defense in depth
- **Perimeter**: WAF + rate limiting
- **Application**: JWT auth + RBAC
- **Data**: RLS + encryption at rest
- **Audit**: Comprehensive logging

---

*For implementation details, see main unified_ai_orchestration_system.md document*
