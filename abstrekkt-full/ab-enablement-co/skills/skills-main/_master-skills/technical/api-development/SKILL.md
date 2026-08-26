---
name: api-development
description: REST and GraphQL API design, documentation, versioning, and best practices. Use when designing new APIs, documenting existing endpoints, implementing authentication, handling errors, or planning API versioning strategies for consumer applications.
---

# API Development

## Overview

APIs are the contracts that define how systems communicate. Well-designed APIs accelerate development, reduce integration errors, and create platforms that developers want to use. Poorly designed APIs create friction, generate support burden, and limit system evolution.

This skill covers the full API lifecycle: design, implementation, documentation, versioning, and deprecation. It provides frameworks for making decisions about REST vs GraphQL, authentication strategies, error handling, and rate limiting that balance developer experience with operational requirements.

Whether building internal APIs for your own applications or public APIs for third-party developers, the principles of consistency, clarity, and evolvability remain constant. This skill helps establish patterns that scale from simple CRUD operations to complex distributed systems.

### Why This Matters
- Clear API contracts reduce integration time by 50% and support tickets by 30%
- Consistent API design enables faster feature development across consuming applications
- Proper versioning strategies prevent breaking changes that damage partner relationships
- Good documentation is the difference between adoption and abandonment for public APIs

## When to Use

### Primary Triggers
- Designing new API endpoints or services
- Documenting existing APIs for internal or external consumption
- Implementing authentication and authorization
- Planning API versioning or deprecation strategies
- Troubleshooting integration issues

### Specific Use Cases
- "Design a RESTful API for our e-commerce order management"
- "Should we use GraphQL or REST for our mobile app backend?"
- "Implement OAuth 2.0 with refresh tokens for our API"
- "Create OpenAPI documentation for our existing endpoints"
- "Plan a migration strategy from v1 to v2 of our API"

## Core Processes

### 1. API Design Approach Selection

**REST vs GraphQL Decision Matrix**

| Factor | REST | GraphQL |
|--------|------|---------|
| Multiple clients with different needs | Requires multiple endpoints or sparse fieldsets | Excellent - clients request exactly what they need |
| Caching | Simple with HTTP caching | Complex, requires custom solutions |
| File uploads | Native support | Requires multipart or separate endpoint |
| Real-time updates | Webhooks or polling | Subscriptions built-in |
| Learning curve | Low | Medium |
| Tooling maturity | Excellent | Very good |
| Over-fetching | Common issue | Solved by design |

**When to Choose REST**
- Simple CRUD operations
- Heavy caching requirements
- Team unfamiliar with GraphQL
- File upload/download is primary use case
- Broad ecosystem integration needed

**When to Choose GraphQL**
- Multiple client types (web, mobile, third-party)
- Complex, interconnected data
- Rapid frontend iteration required
- Over-fetching is a significant problem
- Real-time features needed

### 2. RESTful API Design Patterns

**Resource Naming Conventions**

```
# Good - Nouns, plural, hierarchical
GET    /users
GET    /users/{id}
GET    /users/{id}/orders
POST   /users/{id}/orders
GET    /orders/{id}/items

# Bad - Verbs, inconsistent
GET    /getUser/{id}
POST   /user/create
GET    /userOrders/{userId}
```

**HTTP Methods and Status Codes**

| Method | Use Case | Success Code | With Body |
|--------|----------|--------------|-----------|
| GET | Retrieve resource(s) | 200 OK | Yes |
| POST | Create resource | 201 Created | Yes |
| PUT | Replace resource | 200 OK | Yes |
| PATCH | Partial update | 200 OK | Yes |
| DELETE | Remove resource | 204 No Content | No |

**Standard Response Structure**

```typescript
// Success response
interface SuccessResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

// Error response
interface ErrorResponse {
  error: {
    code: string;           // Machine-readable: "VALIDATION_ERROR"
    message: string;        // Human-readable: "Invalid email format"
    details?: {
      field?: string;
      reason?: string;
    }[];
    requestId: string;      // For support/debugging
  };
}

// Example implementations
// GET /users/123
{
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

// GET /users?page=2&pageSize=20
{
  "data": [
    { "id": "21", "email": "..." },
    { "id": "22", "email": "..." }
  ],
  "meta": {
    "page": 2,
    "pageSize": 20,
    "totalCount": 156,
    "totalPages": 8
  }
}

// POST /users with invalid data
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "reason": "Invalid email format" },
      { "field": "password", "reason": "Must be at least 8 characters" }
    ],
    "requestId": "req_abc123"
  }
}
```

### 3. GraphQL Schema Design

**Schema Structure**

```graphql
# schema.graphql
type Query {
  user(id: ID!): User
  users(filter: UserFilter, pagination: PaginationInput): UserConnection!
  order(id: ID!): Order
  orders(filter: OrderFilter, pagination: PaginationInput): OrderConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
}

type User {
  id: ID!
  email: String!
  name: String!
  orders(first: Int, after: String): OrderConnection!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Order {
  id: ID!
  user: User!
  items: [OrderItem!]!
  status: OrderStatus!
  total: Money!
  createdAt: DateTime!
}

# Input types
input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input UpdateUserInput {
  email: String
  name: String
}

# Payload types (for mutations)
type CreateUserPayload {
  user: User
  errors: [UserError!]
}

type UserError {
  field: String
  message: String!
}

# Connection types (for pagination)
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### 4. Authentication Implementation

**JWT with Refresh Tokens**

```typescript
// auth/tokens.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateTokens(user: User) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// auth/middleware.ts
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
        requestId: req.id
      }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired',
          requestId: req.id
        }
      });
    }
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid access token',
        requestId: req.id
      }
    });
  }
}

// Refresh endpoint
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
    const user = await db.users.findById(payload.userId);

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new Error('Invalid refresh token');
    }

    const tokens = generateTokens(user);
    res.json({ data: tokens });
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token is invalid or expired'
      }
    });
  }
});
```

### 5. API Versioning Strategies

**Versioning Approaches**

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| URL Path | `/v1/users` | Clear, easy routing | URL pollution |
| Header | `Accept: application/vnd.api+json;version=1` | Clean URLs | Less discoverable |
| Query Param | `/users?version=1` | Easy to test | Can be forgotten |

**Recommended: URL Path Versioning**

```typescript
// routes/index.ts
import { Router } from 'express';
import v1Routes from './v1';
import v2Routes from './v2';

const router = Router();

router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

// Deprecation headers middleware
router.use('/v1', (req, res, next) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 01 Jan 2025 00:00:00 GMT');
  res.set('Link', '</v2>; rel="successor-version"');
  next();
});
```

**Breaking vs Non-Breaking Changes**

| Non-Breaking (Safe) | Breaking (Requires Version) |
|---------------------|----------------------------|
| Adding new endpoints | Removing endpoints |
| Adding optional fields | Removing fields |
| Adding new enum values | Changing field types |
| Relaxing validation | Tightening validation |
| Adding optional parameters | Changing URL structure |

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| OpenAPI/Swagger | REST documentation | Free | Standard spec, code generation |
| Postman | API testing/docs | Free-$15/mo | Collections, environments, mocks |
| Insomnia | REST/GraphQL testing | Free | Lightweight, GraphQL support |
| Apollo Studio | GraphQL management | Free tier | Schema registry, metrics |
| Stoplight | API design | $99/mo+ | Design-first, mock servers |
| Hoppscotch | Quick API testing | Free | Open source, fast |

### OpenAPI Template

```yaml
openapi: 3.0.3
info:
  title: My API
  version: 1.0.0
  description: API for managing resources
  contact:
    email: api@example.com
servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://api.staging.example.com/v1
    description: Staging

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      tags: [Users]
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/PageSizeParam'
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'

components:
  schemas:
    User:
      type: object
      required: [id, email, name]
      properties:
        id:
          type: string
        email:
          type: string
          format: email
        name:
          type: string
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Metrics & KPIs

### API Health Metrics
- **Availability**: Target 99.9%+ uptime
- **Latency**: p50 < 100ms, p99 < 500ms
- **Error Rate**: < 0.1% 5xx errors
- **Throughput**: Requests per second capacity

### Developer Experience Metrics
- **Time to First Call**: < 15 minutes with docs
- **Integration Success Rate**: Track failed vs successful integrations
- **Documentation Coverage**: 100% of endpoints documented
- **SDK Adoption**: Track usage across official SDKs

## Common Pitfalls

### 1. Inconsistent Response Formats
**Problem**: Different endpoints return data in different structures
**Prevention**: Define and enforce a standard response envelope. Use middleware to ensure consistency.

### 2. Exposing Internal IDs
**Problem**: Using auto-increment IDs exposes business metrics and enables enumeration
**Prevention**: Use UUIDs or encoded IDs (hashids, nanoid) for public-facing identifiers.

### 3. Missing Rate Limiting
**Problem**: No protection against abuse or accidental overload
**Prevention**: Implement rate limiting from day one. Return `429 Too Many Requests` with `Retry-After` header.

### 4. Inadequate Error Information
**Problem**: Generic error messages that don't help developers debug issues
**Prevention**: Include error codes, human-readable messages, field-level details, and request IDs in every error response.

## Integration Points

- **Database Design**: API structure often mirrors database schema
- **Technical Documentation**: API docs are critical technical documentation
- **Testing Strategies**: API testing is essential at integration and E2E levels
- **DevOps Practices**: APIs need CI/CD, monitoring, and alerting
- **Code Review**: API design reviews prevent breaking changes
- **Performance Optimization**: API performance directly impacts user experience
