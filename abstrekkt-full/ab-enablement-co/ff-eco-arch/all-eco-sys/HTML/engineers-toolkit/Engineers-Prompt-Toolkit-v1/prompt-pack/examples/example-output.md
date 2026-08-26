# EXAMPLE OUTPUT: Prompt 05 (Tiered Options Generator) in Action

## The Ask:
"I need to add authentication to my side project. It's a Next.js app
deployed on Vercel with a Supabase database. Currently zero auth —
anyone with the URL can access everything."

---

## Claude's Response (using the Tiered Options prompt):

### OPTION A — QUICK (2-4 hours)

**Approach:** Supabase Auth with email/password, using the built-in
`@supabase/auth-helpers-nextjs` package. Protect routes with middleware.

**What you get:**
- Login/signup pages with email + password
- Session management via cookies
- Protected routes via Next.js middleware
- Supabase Row-Level Security (RLS) policies on your tables

**What you sacrifice:**
- No social login (Google, GitHub)
- No role-based access — everyone is "authenticated" or "not"
- No email verification (users can sign up with fake emails)
- Password reset works but the email templates are generic Supabase defaults

**What breaks first:**
If you need different permission levels (admin vs. user), you'll
have to bolt on a roles system later, which means migrating RLS policies.

**When to upgrade:** When you need more than 2 user types or when you
want social login for conversion.

**Unique risk:** Without email verification, bot signups could pollute
your user table. Add a simple rate limit on the signup endpoint.

---

### OPTION B — STANDARD (1-2 days)

**Approach:** Supabase Auth with email + Google OAuth, email verification
enabled, basic role system (user/admin) stored in a `profiles` table with
RLS policies referencing the role.

**What you get:**
- Everything in Option A
- Google social login (fastest OAuth to set up)
- Email verification required before access
- Admin vs. user roles with RLS enforcement
- Custom email templates (branded, not Supabase defaults)

**What you sacrifice:**
- No team/organization model — roles are per-user, not per-workspace
- No audit logging (who did what, when)
- No invite system (users self-register only)

**What breaks first:**
If you need multi-tenant (each company sees only their data), the
single `profiles` table with a role column won't cut it. You'd need
an `organizations` table and org-scoped RLS.

**When to upgrade:** When you have paying customers who need team
access or when compliance requires audit trails.

**Unique risk:** Google OAuth requires maintaining a Google Cloud
project and keeping the OAuth consent screen verified. If your
Google Cloud project gets suspended, social login breaks.

---

### OPTION C — COMPLETE (1-2 weeks)

**Approach:** Supabase Auth + full RBAC (role-based access control) +
organization/team model + audit logging + invite system + MFA option.

**What you get:**
- Everything in Option B
- Multi-tenant: organizations with member roles (owner/admin/member)
- Invite system (email invites with expiring tokens)
- Audit log table (tracks auth events, permission changes)
- Optional MFA via TOTP (authenticator app)
- Rate limiting on all auth endpoints
- Session management (view active sessions, force logout)

**What you sacrifice:**
- 5-10x the implementation time of Option A
- More complex RLS policies (org-scoped, harder to debug)
- Ongoing maintenance of the invite/audit systems

**What breaks first:**
Complexity. More RLS policies = more surface area for bugs. A
misconfigured policy could leak data across organizations.

**When to upgrade:** You probably don't need to — this covers most
B2B SaaS auth patterns up to enterprise scale.

**Unique risk:** Over-engineering for a side project. If you don't
have paying customers yet, you're building infrastructure for users
who may never arrive.

---

### RECOMMENDATION

**Given that this is a side project with zero current users,
I recommend Option A.**

Ship basic auth in an afternoon. Validate that people actually want
to use the app before investing days in role systems. Option A gives
you a secure baseline (RLS + session management) without the complexity
tax. When your first 5 users ask "can I invite my team?" — that's your
signal to upgrade to Option B.

---

*This example was generated using Prompt 05 from the Engineer's Prompt
Toolkit. The prompt forces Claude to think in constraints instead of
defaulting to the most comprehensive (and most over-engineered) answer.*
