---
name: backend-development
description: Build robust backend systems with modern technologies (Node.js, Python, Go, Rust), frameworks (NestJS, FastAPI, Django), databases (PostgreSQL, MongoDB, Redis), APIs (REST, GraphQL, gRPC), authentication (OAuth 2.1, JWT), testing strategies, security best practices (OWASP Top 10), performance optimization, scalability patterns (microservices, caching, sharding), DevOps practices (Docker, Kubernetes, CI/CD), and monitoring. Use when building, debugging, or optimizing technical implementations.
---

# Backend Development Skill

Production-ready backend development with modern technologies, best practices, and proven patterns.

## Overview

## When to Use

- Designing RESTful, GraphQL, or gRPC APIs
- Building authentication/authorization systems
- Optimizing database queries and schemas
- Implementing caching and performance optimization
- OWASP Top 10 security mitigation
- Designing scalable microservices
- Testing strategies (unit, integration, E2E)
- CI/CD pipelines and deployment
- Monitoring and debugging production systems

## Technology Selection Guide

**Languages:** Node.js/TypeScript (full-stack), Python (data/ML), Go (concurrency), Rust (performance)
**Frameworks:** NestJS, FastAPI, Django, Express, Gin
**Databases:** PostgreSQL (ACID), MongoDB (flexible schema), Redis (caching)
**APIs:** REST (simple), GraphQL (flexible), gRPC (performance)

See: `references/backend-technologies.md` for detailed comparisons

## Reference Navigation

**Core Technologies:**
- `backend-technologies.md` - Languages, frameworks, databases, message queues, ORMs
- `backend-api-design.md` - REST, GraphQL, gRPC patterns and best practices

**Security & Authentication:**
- `backend-security.md` - OWASP Top 10 2025, security best practices, input validation
- `backend-authentication.md` - OAuth 2.1, JWT, RBAC, MFA, session management

**Performance & Architecture:**
- `backend-performance.md` - Caching, query optimization, load balancing, scaling
- `backend-architecture.md` - Microservices, event-driven, CQRS, saga patterns

**Quality & Operations:**
- `backend-testing.md` - Testing strategies, frameworks, tools, CI/CD testing
- `backend-code-quality.md` - SOLID principles, design patterns, clean code
- `backend-devops.md` - Docker, Kubernetes, deployment strategies, monitoring
- `backend-debugging.md` - Debugging strategies, profiling, logging, production debugging
- `backend-mindset.md` - Problem-solving, architectural thinking, collaboration

## Key Best Practices (2025)

**Security:** Argon2id passwords, parameterized queries (98% SQL injection reduction), OAuth 2.1 + PKCE, rate limiting, security headers

**Performance:** Redis caching (90% DB load reduction), database indexing (30% I/O reduction), CDN (50%+ latency cut), connection pooling

**Testing:** 70-20-10 pyramid (unit-integration-E2E), Vitest 50% faster than Jest, contract testing for microservices, 83% migrations fail without tests

**DevOps:** Blue-green/canary deployments, feature flags (90% fewer failures), Kubernetes 84% adoption, Prometheus/Grafana monitoring, OpenTelemetry tracing

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Fast development | Node.js + NestJS |
| Data/ML integration | Python + FastAPI |
| High concurrency | Go + Gin |
| Max performance | Rust + Axum |
| ACID transactions | PostgreSQL |
| Flexible schema | MongoDB |
| Caching | Redis |
| Internal services | gRPC |
| Public APIs | GraphQL/REST |
| Real-time events | Kafka |

## Implementation Checklist

**API:** Choose style → Design schema → Validate input → Add auth → Rate limiting → Documentation → Error handling

**Database:** Choose DB → Design schema → Create indexes → Connection pooling → Migration strategy → Backup/restore → Test performance

**Security:** OWASP Top 10 → Parameterized queries → OAuth 2.1 + JWT → Security headers → Rate limiting → Input validation → Argon2id passwords

**Testing:** Unit 70% → Integration 20% → E2E 10% → Load tests → Migration tests → Contract tests (microservices)

**Deployment:** Docker → CI/CD → Blue-green/canary → Feature flags → Monitoring → Logging → Health checks

## Example: FastAPI CRUD Endpoint with Validation

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

app = FastAPI()

class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)

class ItemResponse(ItemCreate):
    id: int

@app.post("/items", response_model=ItemResponse, status_code=201)
async def create_item(item: ItemCreate, db: AsyncSession = Depends(get_db)):
    """Create a new item with input validation and proper error handling."""
    try:
        db_item = Item(**item.model_dump())
        db.add(db_item)
        await db.commit()
        await db.refresh(db_item)
        return db_item
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Item already exists")

@app.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieve an item by ID with proper 404 handling."""
    item = await db.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
```

## Typical Backend Development Workflow

1. **Gather requirements** - Define API contract, data models, and non-functional requirements (latency, throughput, availability)
2. **Design the schema** - Model your database tables/collections, define relationships, and plan indexes
3. **Set up project structure** - Initialize the framework, configure linting, testing, and CI/CD pipeline
4. **Implement data layer** - Create ORM models, migrations, and repository/service abstractions
5. **Build API endpoints** - Implement routes with input validation, authentication, and error handling
6. **Add middleware** - Wire up logging, rate limiting, CORS, security headers, and request tracing
7. **Write tests** - Unit tests for business logic, integration tests for API endpoints, load tests for performance
8. **Deploy and monitor** - Containerize, deploy with health checks, set up dashboards and alerts

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OAuth 2.1: https://oauth.net/2.1/
- OpenTelemetry: https://opentelemetry.io/
