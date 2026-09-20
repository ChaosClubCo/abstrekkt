# Phase I: Integration

**"Map what your app touches before you build what your app does."**

---

## What This Phase Is

Integration is where you map the boundaries of your application — what data flows in and out, what external systems it talks to, what authentication model governs access, and what compliance requirements constrain your architecture. This is the phase where you discover that your "simple" app actually needs to talk to four APIs, handle two different auth flows, and comply with a regulatory framework you haven't read yet.

Phase V validated the problem. Phase I maps the terrain you'll build on. Skipping this phase is how you end up six weeks into development realizing your database schema can't support multi-tenancy, or that the third-party API you designed around has rate limits that break your core feature.

This phase applies equally to new builds and prototype conversions. For new builds, you're mapping from scratch. For prototypes being rebuilt for production, you're documenting what your prototype assumed (usually a lot) and filling in the gaps.

### Phase Gate

Do not proceed to Phase S (Stack) until:

- **Security posture score ≥ 40** (for existing prototypes re-audited after this phase)
- **Data flow diagram completed** showing all inputs, outputs, stores, and external systems
- **Authentication architecture documented** with user roles and access boundaries
- **Compliance requirements identified** with specific standards listed (HIPAA, SOC 2, GDPR, PCI-DSS, or "none required" — explicitly stated)

---

## Step 1: Map Your Data

Before choosing databases, APIs, or frameworks, you need to know what data your app handles and where it moves. This isn't a technical architecture diagram — it's a plain-language inventory of what exists.

### The Data Inventory

For every piece of data your app touches, document:

| Question | Why It Matters |
|---|---|
| What is it? | Name and description of the data (e.g., "customer contact records") |
| Where does it come from? | User input, API, import, another system, manual entry |
| Where does it go? | Display only, stored in your database, sent to third party, exported |
| Who can see it? | All users, specific roles, only the owner, admins only |
| How sensitive is it? | Public, internal, confidential, regulated (PII, PHI, financial) |
| How often does it change? | Static, daily, real-time, event-driven |

### Applied to INT Client Problem Spaces

Using the same verified INT service engagements from Phase V, here's what a data inventory exercise would reveal:

**Martensen IP context (Managed Marketing / HubSpot):**
INT's engagement involved migrating contact data from multiple sources into HubSpot, managing email campaigns, and enabling sales workflows. A data inventory for an app addressing the same problem space would need to account for:

- Contact records coming from multiple sources (legacy systems, spreadsheets, manual entry)
- Email engagement data (opens, clicks, replies) flowing from the marketing platform
- Deal/pipeline data created by sales team members
- Access boundaries: sales team sees their contacts, marketing sees campaign metrics, leadership sees pipeline totals
- Sensitivity: client contact information is confidential; attorney-client relationship data has legal privilege considerations

**Destwin context (SOC 2 Compliance):**
INT implemented a GRC platform (Vanta) and conducted audit preparedness. A compliance automation app would need:

- Security control configurations pulled from live infrastructure (cloud configs, access logs, vulnerability scans)
- Audit evidence documents generated and stored
- Compliance status data updated as controls are verified
- Access boundaries: compliance team has full access, engineering sees their own controls, auditors get read-only evidence packages
- Sensitivity: security configurations and vulnerability data are highly confidential

**RadioMall context (eCommerce Integration):**
INT integrated HubSpot, QuickBooks, and WooCommerce for RadioMall. An inventory unification app would need:

- Product catalog data from the WooCommerce storefront
- Customer purchase data synced to HubSpot CRM
- Financial transaction data flowing to QuickBooks
- Fulfillment status data (RadioMall previously had a fully manual process that INT automated)
- Access boundaries: operations sees everything, customer service sees orders, accounting sees financials
- Sensitivity: payment data falls under PCI-DSS, customer PII under standard privacy practices

**Gardien Products context (Infrastructure / Cybersecurity):**
INT enhanced cybersecurity, WiFi, and cloud administration. An infrastructure monitoring app would need:

- Device health telemetry from on-premise and cloud systems
- Security event logs from monitoring tools
- WiFi performance metrics across facilities
- Access boundaries: IT admins see everything, facility managers see their own site
- Sensitivity: security logs and network configurations are confidential

### For Your Prototypes

If you're converting a prototype to production, the data inventory often reveals assumptions you made implicitly:

- Your prototype probably stores everything in one table or one JSON blob. Production needs a schema.
- Your prototype probably has no access control — every user sees everything. Production needs roles.
- Your prototype probably calls APIs without thinking about rate limits, error handling, or what happens when the API is down. Production needs fallback strategies.
- Your prototype probably has no concept of data sensitivity. Production needs classification.

This isn't a criticism of prototyping — I built most of my 75-90 prototypes the same way. The prototype's job was to prove the concept, not to handle edge cases. Phase I is where you identify the edges.

---

## Step 2: Define API Boundaries

Every connection your app makes to an external system is a boundary. Each boundary is a potential point of failure, a security surface, and a dependency you don't control.

### Boundary Inventory

For each external system your app connects to:

| Question | Document |
|---|---|
| What system? | Name, provider, version |
| What direction? | Read, write, or both |
| What auth? | API key, OAuth, JWT, service account |
| What rate limits? | Requests per minute/hour, throttling behavior |
| What happens when it's down? | Fail open, fail closed, queue and retry, show cached data |
| What data crosses? | Specific fields, sensitivity level |
| Who owns the contract? | Your team, the vendor, a third party |

### Common Boundaries by App Type

**PWA (web-based, installable):**
- Backend API (your own or Supabase)
- Push notification server (VAPID endpoint)
- CDN for static assets
- Analytics service (PostHog, Sentry)
- Auth provider (Supabase Auth, Clerk, Auth0)

**Electron (desktop):**
- All of the above, plus:
- Local file system (read/write with path validation)
- Auto-update server (GitHub Releases, custom endpoint)
- OS notification system
- IPC bridge between main and renderer processes

**Tauri (desktop, Rust backend):**
- Same as Electron, but the IPC boundary is between JavaScript and Rust
- Tauri plugin system for file access, dialogs, clipboard
- System WebView (not bundled Chromium — different API surface)

### The Offline Question

If your app is a PWA or desktop app, you need to answer: **what happens when the network is unavailable?**

Three strategies:

| Strategy | When to Use | Tradeoff |
|---|---|---|
| **Fail gracefully** | Network is essential to core function | User sees clear error, can't proceed |
| **Read from cache** | Data changes infrequently, stale is acceptable | User works with potentially outdated data |
| **Queue and sync** | User creates/edits data offline | Complex — needs conflict resolution and sync logic |

Most of my prototypes ignored this question entirely. They assume network availability because vibecoding platforms are always online. For production — especially Electron and PWA targets — the offline strategy is a first-class architectural decision, not an afterthought.

The reference library's `code/pwa-react/src/workers/sw.ts` and `code/pwa-react/src/hooks/useOfflineQueue.ts` implement the queue-and-sync pattern.

---

## Step 3: Design Authentication and Authorization

Auth is not a feature you add later. It's a structural decision that affects your database schema, your API design, your frontend routing, and your compliance posture.

### Authentication: Who Are You?

Pick one. Don't build your own.

| Provider | Best For | Included In Toolkit |
|---|---|---|
| Supabase Auth | Apps already using Supabase for data | Yes — scaffolder Supabase addon |
| Clerk | Apps needing embeddable UI components | No — add manually |
| Auth0 | Enterprise apps with SSO requirements | No — add manually |
| Custom JWT | Teams with specific requirements and security expertise | Reference patterns in toolkit |

### Authorization: What Can You Do?

Authorization is about roles and permissions. At minimum, define:

- **What roles exist?** (e.g., owner, admin, member, viewer)
- **What can each role do?** (CRUD per resource type)
- **How is it enforced?** (Frontend checks are for UX. Backend enforcement is for security.)

### Row-Level Security

If you're using Supabase (which the toolkit scaffolder supports), authorization should be enforced at the database level using Row-Level Security (RLS) policies — not just in your application code.

The multi-tenant Supabase reference in this toolkit (`p4/supabase/migrations/001_multi_tenant_foundation.sql`) implements:

- Tenant-scoped tables with `tenant_id` on every row
- Role-based policies (owner, admin, member, viewer)
- Helper functions: `get_user_tenant_ids()`, `has_tenant_role()`, `current_tenant_id()`
- Automatic audit logging on all tenant-scoped tables

Application-level auth checks are a convenience for UI. Database-level RLS is the security boundary. Both are required.

### For Your Prototypes

Most prototypes built on vibecoding platforms have one of two auth patterns:

1. **No auth at all.** Everything is public. This is fine for a personal tool but unacceptable for production.
2. **Platform-provided auth** (e.g., Base44's built-in auth, Supabase's default). This works but often lacks role differentiation and RLS.

Phase I documents what auth your prototype currently has and what production requires. The gap between those two is your auth migration scope.

---

## Step 4: Identify Compliance Requirements

Compliance is not optional — it's either required by your data or it isn't. Phase I makes this explicit rather than leaving it as a vague concern.

### The Compliance Decision

| If your app handles... | You likely need... |
|---|---|
| Healthcare patient data | HIPAA compliance |
| Payment card data | PCI-DSS compliance |
| EU resident personal data | GDPR compliance |
| US consumer personal data | State privacy laws (CCPA, etc.) |
| Security-sensitive enterprise data | SOC 2 attestation |
| None of the above | Document "no regulatory compliance required" explicitly |

"No compliance required" is a valid answer — but it must be an explicit, documented decision, not a default assumption.

### What INT's Client Work Demonstrates About Compliance

Compliance was central to several of INT's verified service engagements:

**Destwin:** INT helped Destwin achieve SOC 2 compliance by partnering with Vanta as the GRC platform, implementing compliance processes, and conducting audit preparedness. The key lesson: SOC 2 wasn't a one-time event but an expansion of an existing PCI-DSS program. Compliance layers build on each other.

**Gardien Products:** INT enhanced Gardien's cybersecurity posture alongside WiFi and cloud improvements. For manufacturing environments, data security isn't just about digital records — it intersects with physical infrastructure and operational reliability.

**INT itself:** INT achieved its own SOC 2 attestation, documenting the process publicly. The case study describes conducting risk assessments, strengthening security controls across teams, building documentation and monitoring systems, and creating a culture of security awareness. Their takeaway: compliance is an ongoing process, not a project with an end date.

### Compliance in Practice

For each identified compliance requirement, document:

- **Standard:** Which framework (SOC 2, HIPAA, GDPR, PCI-DSS)
- **Scope:** Which parts of your app are in scope
- **Controls needed:** What technical and organizational controls must exist
- **Evidence:** How you'll demonstrate compliance (automated evidence collection, manual documentation, audit trails)
- **Timeline:** When compliance must be achieved (before launch, within N months, ongoing)

If your app doesn't require formal compliance, you still benefit from baseline security practices: encrypted data at rest and in transit, authentication on all endpoints, input validation, dependency auditing, and access logging. These aren't compliance requirements — they're engineering hygiene.

---

## Step 5: Produce the Integration Map

Steps 1-4 generated the raw material. Step 5 synthesizes it into a single document or diagram that your team (or future you) can reference throughout development.

### What the Integration Map Contains

1. **Data flow diagram** — All data sources, stores, transformations, and destinations. Doesn't need to be formal UML — a clear box-and-arrow diagram works.
2. **API boundary table** — Every external system, auth method, rate limits, and failure strategy.
3. **Auth architecture** — Provider, roles, enforcement layer (frontend, backend, database).
4. **Compliance summary** — Which standards apply, what's in scope, what controls are needed.
5. **Sensitivity classification** — Which data is public, internal, confidential, or regulated.

### Diagram Assets in the Toolkit

The reference library includes several diagrams relevant to this phase:

- `diagrams/svg/data-flow.svg` — Online vs offline request paths
- `diagrams/svg/network-topology.svg` — Client → CDN → Origin architecture
- `diagrams/svg/security-boundaries.svg` — Electron renderer/main process boundaries
- `diagrams/mermaid/ipc-architecture.mermaid` — IPC communication patterns
- `diagrams/mermaid/offline-sync-sequence.mermaid` — Offline queue and sync flow

These are reference patterns, not templates to fill in. Your integration map should reflect your specific app's data flows and boundaries.

### For Prototypes Being Rebuilt

Your prototype's integration map is probably implicit — it's whatever you wired up while building. Phase I makes it explicit. Document:

- What APIs does the prototype call? Are they the right ones for production?
- What data does the prototype store? Is the schema adequate for multi-user or multi-tenant use?
- What auth does the prototype have? What does production require?
- What happens when the prototype is offline? What should happen in production?

The gap between "what the prototype does" and "what production needs" is your Phase I deliverable. It directly informs the stack decisions in Phase S.

---

## Phase I Checklist

- [ ] Data inventory completed for all data the app handles
- [ ] Sensitivity classification assigned to each data type
- [ ] API boundary table documenting all external systems
- [ ] Failure strategy defined for each external dependency
- [ ] Offline strategy chosen and documented (fail, cache, or queue)
- [ ] Auth provider selected with justification
- [ ] User roles defined with per-resource permissions
- [ ] Enforcement layer documented (frontend, backend, database)
- [ ] Compliance requirements identified (or explicitly marked as not required)
- [ ] For regulated data: specific controls and evidence plan documented
- [ ] Integration map produced (diagram + supporting tables)
- [ ] For prototypes: gap analysis between current state and production requirements
- [ ] Security posture audit score ≥ 40

---

## Common Failures

**"We'll figure out auth later."**
Auth affects your database schema, your API design, and your frontend routing. Adding it later means reworking all three. Design it now.

**"We don't need compliance."**
Maybe you don't. But document that decision explicitly. "We assessed compliance requirements and determined none apply because [specific reason]" is a professional decision. Silence on compliance is a liability.

**"The prototype's data model is fine."**
It might be — for a single user with no access control and no offline support. Phase I reveals what "fine for me" lacks when it becomes "fine for production."

**"We'll just use Supabase for everything."**
Supabase is a strong default (and the toolkit supports it). But "use Supabase" isn't an integration plan. Which tables? What RLS policies? What edge functions? What real-time subscriptions? Phase I answers these questions.

**"We don't need an integration diagram."**
You need something that documents what your app connects to. It doesn't need to be UML or a formal diagram — a clear list with a simple drawing is sufficient. The format doesn't matter. The documentation does.

---

## AI Your BI℠: Claude in Phase I

Three specific uses:

**Data Flow Analysis** — Describe your app's functionality to Claude and ask it to enumerate all data inputs, outputs, stores, and external system connections. Claude will often identify connections you've overlooked — especially around auth, logging, analytics, and error reporting, which are easy to forget.

**Compliance Mapping** — Provide Claude with the types of data your app handles and ask which compliance frameworks apply. Claude can outline specific controls required per framework, though you should verify with a compliance professional for regulated industries.

**Schema Design** — Once your data inventory is complete, Claude can propose a database schema with appropriate types, relationships, indexes, and RLS policies. The multi-tenant migration files in this toolkit (`p4/supabase/migrations/`) provide a starting reference.

Example prompt:

```
My app handles the following data types:
[paste your data inventory]

It connects to these external systems:
[paste your boundary table]

Users have these roles: [list roles]

Propose:
1. A database schema with appropriate table relationships
2. RLS policies for tenant isolation (if multi-tenant)
3. An API boundary diagram showing all external connections
4. Which compliance frameworks likely apply and why
```

---

## References

- `p4/supabase/migrations/001_multi_tenant_foundation.sql` — Multi-tenant schema with RLS
- `p4/supabase/migrations/002_tenant_app_tables.sql` — Audit trail and tenant-scoped tables
- `p4/supabase/edge-functions/tenant-api/index.ts` — Tenant-aware API with role-gated endpoints
- `p4/supabase/hooks/index.ts` — React hooks for auth and tenant-scoped queries
- `diagrams/svg/data-flow.svg` — Online/offline request path reference
- `diagrams/svg/security-boundaries.svg` — Electron security boundary reference
- `docs/10-security-hardening.md` — OWASP Top 10 mapping
- `templates/electron-security-checklist.md` — Electron-specific security audit

---

**Previous Phase:** [← Phase V: Vision](./V-vision.md)
**Next Phase:** [Phase S: Stack →](./S-stack.md)
