# RBAC Model — Role-Based Access Control

> **Audience:** ENG, LEAD
> **Phase:** MVP (Week 1)
> **Last Updated:** 2025-02-13

---

## Role Definitions

### Customer Roles

| Role | Description | Typical User |
|------|------------|--------------|
| `service_desk_agent` | Handles incoming tickets, triggers basic workflows | L1 support tech |
| `manager` | Approves escalations, views team metrics, manages direct reports | Team lead, department head |
| `it_admin` | Full workflow management, connector configuration, secret management | IT director, sysadmin |
| `compliance_officer` | Read-only audit log access, compliance report generation | GRC analyst, auditor |

### INT Roles

| Role | Description | Typical User |
|------|------------|--------------|
| `int_support` | Read-only customer data access (with customer consent) | INT support engineer |
| `int_admin` | System-wide operations, billing, monitoring | INT engineering lead |
| `int_service` | Machine-to-machine (control plane backend) | Control plane service account |

---

## Permission Matrix

### Customer Roles

| Resource | Action | service_desk_agent | manager | it_admin | compliance_officer |
|----------|--------|-------------------|---------|----------|-------------------|
| **Run** | Create (trigger workflow) | ✅ (own workflows) | ✅ | ✅ | ❌ |
| **Run** | View status | ✅ (own) | ✅ (team) | ✅ (all) | ✅ (all) |
| **Run** | Cancel | ❌ | ✅ (team) | ✅ (all) | ❌ |
| **Step** | View details | ✅ (own runs) | ✅ (team) | ✅ (all) | ✅ (all) |
| **Approval** | Decide (approve/deny) | ❌ | ✅ (assigned) | ✅ (all) | ❌ |
| **Approval** | View pending | ❌ | ✅ (assigned) | ✅ (all) | ✅ (all) |
| **Policy** | View | ❌ | ✅ | ✅ | ✅ |
| **Policy** | Create/Update/Delete | ❌ | ❌ | ✅ | ❌ |
| **Audit Log** | Query | ❌ | ✅ (team) | ✅ (all) | ✅ (all) |
| **Audit Log** | Export/Report | ❌ | ❌ | ✅ | ✅ |
| **Secret** | Register/Rotate | ❌ | ❌ | ✅ | ❌ |
| **Secret** | View hash/status | ❌ | ❌ | ✅ | ✅ |
| **Dashboard** | View metrics | ✅ (limited) | ✅ (team) | ✅ (full) | ✅ (full) |
| **Connector** | Configure | ❌ | ❌ | ✅ | ❌ |
| **Connector** | View status | ✅ | ✅ | ✅ | ✅ |
| **Kill-Switch** | Activate | ❌ | ❌ | ✅ | ❌ |

### INT Roles

| Resource | Action | int_support | int_admin | int_service |
|----------|--------|-------------|-----------|-------------|
| **Customer Data** | Read (with consent) | ✅ (time-limited) | ✅ | ✅ |
| **Customer Data** | Write | ❌ | ❌ | ✅ (system ops only) |
| **Audit Log** | Read | ✅ (with consent) | ✅ | ✅ |
| **Audit Log** | Write | ❌ | ❌ | ✅ (insert only) |
| **System Config** | Modify | ❌ | ✅ | ❌ |
| **Billing** | View/Modify | ❌ | ✅ | ❌ |
| **Kill-Switch** | Activate (global) | ❌ | ✅ | ✅ (automated) |

---

## JWT Structure

```json
{
  "sub": "user-uuid-123",
  "email": "manager@acmecorp.com",
  "customer_id": "cust-uuid-456",
  "role": "manager",
  "permissions": [
    "run:read:team",
    "run:create",
    "approval:decide:assigned",
    "audit:read:team",
    "dashboard:read:team"
  ],
  "iat": 1707800000,
  "exp": 1707886400,
  "iss": "opsautopilot"
}
```

**Role-to-permissions mapping** is maintained server-side. JWT includes the role claim; the API gateway resolves permissions from a cached mapping table. This allows permission changes without reissuing tokens.

---

## Enforcement Points

### API Gateway (Middleware)

```typescript
async function authorize(req: Request, requiredPermission: string): Promise<boolean> {
  const jwt = verifyJWT(req.headers.authorization);
  
  // 1. Verify customer_id matches resource ownership
  const resource = await getResource(req.params.resource_id);
  if (resource.customer_id !== jwt.customer_id) {
    auditLog({ event: 'authorization.denied', reason: 'cross_tenant', actor: jwt.sub });
    return false; // RLS would also block this, but defense-in-depth
  }
  
  // 2. Verify role has required permission
  const permissions = await getPermissionsForRole(jwt.role);
  if (!permissions.includes(requiredPermission)) {
    auditLog({ event: 'authorization.denied', reason: 'insufficient_role', actor: jwt.sub });
    return false;
  }
  
  // 3. Verify scope (own / team / all)
  const scope = extractScope(requiredPermission);
  if (scope === 'own' && resource.initiator_user_id !== jwt.sub) return false;
  if (scope === 'team' && !await isInTeam(jwt.sub, resource.initiator_user_id)) return false;
  
  return true;
}
```

### Database (RLS)

Even if the API layer is bypassed, RLS provides a second enforcement layer:

```sql
-- All queries automatically filtered by customer_id from JWT
CREATE POLICY customer_isolation ON run
  FOR ALL
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());
```

### Approval Engine

Approval decisions are additionally scoped:

```typescript
function canDecideApproval(jwt: JWT, approval: Approval): boolean {
  // Only the designated approver (or it_admin) can decide
  if (jwt.role === 'it_admin') return true;
  if (approval.approver_role === jwt.role && isApproverForResource(jwt.sub, approval)) return true;
  return false;
}
```

---

## INT Support Access Flow

```
1. Customer clicks "Grant Support Access" in dashboard
2. System generates time-limited JWT:
   {
     "sub": "int-support-engineer-id",
     "customer_id": "customer-uuid",
     "role": "int_support",
     "exp": now() + 4 hours,
     "grant_id": "grant-uuid",
     "granted_by": "it-admin@customer.com"
   }
3. INT support engineer uses JWT to access customer data
4. All actions logged with actor_type: "int_support"
5. Customer can revoke at any time (invalidates grant_id)
6. Auto-expires after 4 hours (non-renewable without new grant)
```

---

## Testing Plan

| Test | Input | Expected |
|------|-------|----------|
| Agent creates run | `role: service_desk_agent` → POST /runs | 201 Created |
| Agent approves (unauthorized) | `role: service_desk_agent` → POST /approvals/*/decision | 403 Forbidden |
| Manager approves (authorized) | `role: manager` → POST /approvals/*/decision (assigned) | 200 OK |
| Manager approves (not assigned) | `role: manager` → POST /approvals/*/decision (different team) | 403 Forbidden |
| Compliance reads audit | `role: compliance_officer` → GET /audit | 200 OK |
| Compliance modifies policy | `role: compliance_officer` → PUT /policy/* | 403 Forbidden |
| IT admin full access | `role: it_admin` → all endpoints | 200 OK |
| Cross-tenant attempt | `customer_id: A` → GET /runs (customer B's run_id) | 404 (RLS blocks) |
| INT support (no consent) | `role: int_support` without grant | 403 Forbidden |
| INT support (with consent) | `role: int_support` with valid grant | 200 OK (read-only) |
| INT support (write attempt) | `role: int_support` → POST /runs | 403 Forbidden |
| Expired JWT | Token with `exp` in the past | 401 Unauthorized |
