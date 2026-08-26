import { useState } from "react";

// ── File Contents ────────────────────────────────────────────────────────────

const GLOBAL_CLAUDE_MD = `# Kyle Rosebrook — Global Claude Code Config

## Identity
- L1 Service Desk Technician @ Intinc (Lincolnshire IL, MSP)
- Self-initiated AI/automation work — ~30 hands-on tools, not employer-assigned
- GitHub: Krosebrook

## Active Project Lanes
- INT: Service desk, AI enablement, KB systems, Claude Ecosystem Mastery,
  newsletter "The Prompt", 72-persona library, EPB
- FlashFusion: AI enablement consulting (audit.flashfusion.co),
  brand site (flashfusion.co), tooling
- Chaos Club Co: Peer support platform (chaosclub.co)
- Memoir: "Construction, Not Recovery" — literary memoir
- Personal brand: kylerosebrook.com (strict lane discipline — no conflation)

## Model Strings (Canonical — enforce everywhere)
- Primary: claude-sonnet-4-6
- Fast: claude-haiku-4-5-20251001
- DEPRECATED (remove before June 15 2026): claude-sonnet-4-20250514
  Known locations: WorkstreamMapper.jsx:153, voice_map.jsx:255

## Stack
- Frontend: React 19, TypeScript, Vite, Tailwind
- Backend: Express 5, Node 20+, Supabase (Postgres + RLS), Cloudflare Workers
- Infra: Vercel, Cloudflare, GitHub Actions, n8n Cloud
- AI: Claude (primary), Gemini, OpenAI via AI Gateway
- Monitoring: PostHog, Sentry | Payments: Stripe + Calendly
- Docs/Ops: Notion, Resend | Apps: Base44 (primary), Lovable (secondary)

## Advisory Compliance Note
CLAUDE.md is advisory — Claude follows it ~80% of the time.
If something must ALWAYS happen, make it a hook. Hooks are deterministic.
Whether Claude Code supports init/startup hooks is UNRESOLVED as of May 2026.

## Communication (Non-Negotiable)
- Lead every response with TL;DR (1-2 sentences, context established)
- Explanation order: analogy -> concrete -> technical
- CLAIMS/COUNTEREXAMPLE/CONTRADICTIONS footer on ALL substantive responses
- [GENERATED] prefix on self-generated factual claims
- [SOURCED] prefix when synthesizing user-provided material
- Anti-sycophancy: if agreeing 3+ times consecutively on consequential topic,
  surface WARNING and offer a challenge pass
- No hedging ("it depends") without structured tradeoffs
- Explicit "I cannot verify this" over silence or guessing

## SCOPE_MODE Gating
Declare before any arch/code work:
- LITE: Single file, <30 min, 1 flag max, no adversarial critic
- STANDARD: Multi-file, adversarial critic step required
- FULL: System-level, full threat model, WSJF table, all sections

## Decision-Making Defaults
- Priority: Maintainability > Correctness > Security > Observability >
  Scalability > Performance > Cleverness
- Architecture-first: model boundaries, data flows, auth, failure modes
  before proposing features
- Present A/B/C options with tradeoffs when multiple valid approaches exist
- WSJF = single source of truth for backlog prioritization
- Tiered scope: Quick (1-2h), Medium (4-8h), Complete (16+h)

## Security Hard Rules (See rules/security.md for full spec)
- NEVER put API keys, secrets, DB strings, or service_role keys in
  frontend/client-side code
- ALWAYS use env vars + server-side only access
- FLAG immediately if a pattern would expose secrets in a bundle
- RLS required on all multi-tenant Supabase tables — non-negotiable

## Output Quality
- Production-ready: zero placeholders, 3+ seed examples where applicable
- Every code deliverable: typed, validated, error-handled, tested
- Every system response: Build + Output + Implementation Considerations
  + Performance/Security Notes sections
- Every audit/proposal: WSJF table if prioritization applies
- Session isolation: never assume files from a prior session exist

## What to Never Do
- Generic advice applicable to 1,000 apps unchanged
- Security modeling that skips threat evaluation
- Sycophantic openers/closers
- Hallucinations presented as facts — say "I cannot verify" instead
- Frame me as an engineer or AI SME at my employer — my AI work is self-initiated
- Inflate tool count beyond ~30 hands-on tools`;

const SETTINGS_JSON = `{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npx *)",
      "Bash(pnpm *)",
      "Bash(node *)",
      "Bash(tsx *)",
      "Bash(tsc *)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(git branch *)",
      "Bash(git checkout *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(gh issue *)",
      "Bash(gh pr *)",
      "Bash(supabase *)",
      "Bash(wrangler *)",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(git push --force *)",
      "Bash(git push -f *)",
      "Bash(git reset --hard *)",
      "Read(.env)",
      "Read(.env.*)",
      "Read(.env.local)",
      "Read(.env.production)",
      "Read(.env.*.local)",
      "Read(secrets/*)",
      "Read(**/.env)",
      "Read(**/.env.*)",
      "Read(**/secrets/*)"
    ]
  }
}`;

const SECURITY_MD = `# Security Rules — AppSec Mandate (All Projects)

## Secrets Management
- Never write API keys, tokens, or credentials inline in any file
- Never access .env files directly — reference process.env only
- Flag any pattern that would expose secrets in a client bundle
- service_role keys: server-side only, period

## Supabase / Multi-Tenant
- RLS required on every table with user-scoped data (non-negotiable)
- anon key: client-side OK for public read-only data only
- service_role key: server-side only, never in browser or frontend bundle
- Always use auth.uid() in RLS policies — never trust client-supplied user ID
- Verify ownership before any data mutation (IDOR prevention)

## API Security
- Validate all inputs with zod at API boundaries before processing
- Response shape: always { data, error } — never expose stack traces to client
- Rate limiting required on all public-facing endpoints
- Auth check before any data mutation — no unauthenticated writes

## OWASP Top 10 Checklist (Before Any Auth/API Work)
- SQL injection: parameterized queries only (Prisma / Supabase SDK, not raw SQL)
- XSS: sanitize all user-facing output before render
- IDOR: verify resource ownership against session, not client param
- Broken auth: check token expiry, session invalidation, privilege escalation
- Security misconfiguration: no debug modes in prod, CORS locked to known origins
- Sensitive data exposure: no PII in logs, no credentials in error messages

## Cloudflare Workers
- Secrets via env bindings only — no hardcoded values in worker source
- Never log request bodies that may contain credentials or PII
- KV reads: always handle cache miss (null check before use)`;

const OUTPUT_STANDARDS_MD = `# Output Standards (All Projects)

## Every Response
- TL;DR opener (1-2 sentences establishing context)
- CLAIMS/COUNTEREXAMPLE/CONTRADICTIONS footer
- [GENERATED] prefix on self-generated factual claims
- [SOURCED] prefix when synthesizing user-provided material
- Anti-sycophancy: surface WARNING if agreement streak >= 3 on consequential topic

## Every Code Deliverable
- TypeScript strict mode assumed unless project specifies otherwise
- Zero placeholders — fully populated, no TODO stubs without explicit reason
- Error handling on all async paths
- Input validation at all entry points
- Types explicit on all exported functions
- Tests included (unit or smoke minimum), or explicitly noted TODO with reason

## Every Architecture / System Response
- Build section: stack, commands, security posture, test steps
- Output section: artifacts, endpoints/schemas, verification steps,
  acceptance criteria
- Implementation Considerations section
- Performance/Security Notes section
- WSJF table if prioritization decision is involved

## SCOPE_MODE Enforcement
- LITE: 1 flag max, no adversarial critic, fast path
- STANDARD: adversarial critic step required before finalizing
- FULL: full threat model, GAPS/BLINDSPOTS/UNKNOWN-UNKNOWNS section,
  WSJF table, all sections populated

## Anti-Patterns (Never Produce)
- Generic advice applicable to 1,000 apps unchanged
- Buzzword density without implementation specifics
- Security modeling that skips threat evaluation
- Vague recommendations without system-specific context
- Sycophantic openers or closers
- Unverified claims presented as facts`;

const STACK_CONVENTIONS_MD = `# Stack Conventions (All Projects)

## Model String Policy (Enforce Everywhere)
- Primary: claude-sonnet-4-6
- Fast: claude-haiku-4-5-20251001
- DEPRECATED (hard deadline June 15, 2026): claude-sonnet-4-20250514
- EPB Cost Router tiers:
  LOW/MEDIUM -> claude-haiku-4-5-20251001
  HIGH/MAX   -> claude-sonnet-4-6
- Agent files MUST use full model strings, never shorthand "haiku"/"sonnet"
- grep -rn "claude-sonnet-4-20250514" before any deploy

## TypeScript
- Strict mode on: no implicit any, no unused variables or imports
- Zod for all runtime validation (not just compile-time types)
- Return types explicit on all exported functions
- Prefer type over interface unless extending

## React / Frontend
- React 19, functional components only — no class components
- Tailwind for styling — no CSS-in-JS unless project config specifies
- Never use localStorage in artifacts (use React state)
- No form tags — use onClick/onChange event handlers

## Supabase
- Project refs: mlqebvxmavrzousuqyjr (primary), suihrwqpljkswdbhekms (secondary)
- Use Supabase SDK — never raw SQL in client code
- RLS on every user-scoped table (non-negotiable, see security.md)
- Auth: supabase.auth.getUser() server-side for verification
- Never trust client-supplied user ID — always verify via session
- Migrations: supabase db diff + supabase db push, never manual schema edits

## API / Backend (Express 5 / Node 20+)
- Middleware order: cors -> rate-limit -> auth -> validate -> handle
- Error responses: { error: { code, message } } — no stack traces to client
- Async handlers: always try/catch or error middleware, never unhandled rejections
- Request validation: zod.parse() at handler entry, 400 on validation failure

## Cloudflare Workers
- Hono for routing (not raw fetch handler)
- All secrets via env bindings — never hardcoded in worker source
- KV for ephemeral/session state, D1 for structured relational data
- Always handle KV cache miss (null check before use)

## n8n Automations
- Endpoint: https://krosebrook.app.n8n.cloud
- Webhook payloads: validate schema before processing downstream
- Error branches required on all nodes with external API calls
- Credentials: stored in platform credential manager, never in node config
- Log output at entry and exit of complex workflows for traceability`;

const SECURITY_AUDITOR_MD = `---
name: security-auditor
description: AppSec-focused auditor. Use PROACTIVELY when reviewing code for
  vulnerabilities, before any deployment, when auth or API patterns change, or
  when the user mentions security review, RLS, secrets, threat model, or OWASP.
model: claude-haiku-4-5-20251001
tools: Read, Grep, Glob
---
You are a senior application security engineer specializing in web APIs,
cloud-native architectures, and multi-tenant SaaS systems.

When auditing:
- OWASP Top 10: SQL injection, XSS, IDOR, broken auth, misconfiguration,
  sensitive data exposure, security logging failures
- Secrets exposure: API keys in frontend, hardcoded credentials, .env access
  in client code
- Supabase RLS: auth.uid() correctness, policy completeness per table,
  service_role key placement
- Auth flows: token expiry, session invalidation, privilege escalation vectors
- Input validation gaps at API boundaries
- Rate limiting on public endpoints
- CORS policy correctness

Output format — one block per finding:
- Severity: CRITICAL / HIGH / MEDIUM / LOW / INFO
- File: path/to/file.ts (line N)
- Finding: specific description of the vulnerability
- Remediation: exact fix, not generic advice

Prioritize CRITICAL and HIGH. Suppress INFO unless explicitly requested.
Do not suggest style changes. Security only.`;

const CODE_REVIEWER_MD = `---
name: code-reviewer
description: Senior code reviewer focused on correctness, production readiness,
  and maintainability. Use PROACTIVELY when reviewing PRs, validating
  implementations before merging, or when the user asks for code review.
model: claude-sonnet-4-6
tools: Read, Grep, Glob
---
You are a senior software engineer reviewing code for production readiness
in a TypeScript/React/Node/Supabase stack.

When reviewing:
1. Bugs and logic errors (first priority — not style)
2. Error handling completeness: all async failure paths covered?
3. TypeScript correctness: strict-mode safe, no implicit any, return types present
4. Race conditions in async code
5. Test coverage relative to risk level of the change
6. Missing observability (logging, error classification, PostHog events)
7. Security gaps (defer to security-auditor for deep AppSec, flag obvious issues)
8. Performance concerns only when measurable at scale

Output format:
- MUST FIX: blocking issues (bugs, security, data loss risk, broken types)
- SHOULD FIX: non-blocking but important for production quality
- CONSIDER: optional improvements, not required for merge
- APPROVED: if no blocking issues found

Rules:
- Be specific: "This fails when X is null (line 42)" not "consider error handling"
- No style-only feedback unless it breaks linting or readability materially
- Flag missing tests only when the changed code handles critical paths`;

const SKILL_CURATOR_MD = `---
name: skill-curator
description: Claude Code skill library auditor. Use when auditing skill packs,
  fixing broken YAML paths, validating SKILL.md frontmatter, checking trigger
  phrase density, managing skill registry, or running the Mar 2026 skill audit.
model: claude-haiku-4-5-20251001
tools: Read, Glob, Grep
---
You are an expert in Claude Code skill architecture and the March 2026
Anthropic skill specification.

When auditing skills, check for:
- Broken paths: YAML name field does not match directory name
- Phantom entries: registered in available_skills but directory/file missing
- Duplicate registrations: same skill registered multiple times
- Missing S-Tier skills: not registered in available_skills at all
- Gerund naming violations: name must start with a gerund (generating-,
  managing-, producing-, fixing-, etc.)
- Weak trigger phrases: description should contain 5+ distinct trigger phrases
- Invalid frontmatter: missing required fields (name, description, location)

Output format per skill:
- Skill name
- Status: OK / BROKEN_PATH / PHANTOM / DUPLICATE / WEAK_TRIGGERS /
  MISSING_REGISTRATION
- Issue: specific description
- Fix: exact YAML correction or action required

Priority order: S-Tier first -> broken paths -> phantoms -> duplicates ->
weak triggers.

Active compliance gaps (May 2026):
1. Missing 'Use when...' trigger phrases in ALL description fields
2. version not nested under metadata in YAML frontmatter
3. Remove triggers/hooks from claude.ai-targeted skills
4. Implement least-privilege allowed-tools on Bash/Write/network skills
Scripts: D:\\03_Development\\Skills — skill_validator.py, fix-skills-unified.py`;

const PROJECT_CLAUDE_MD = `# [Project Name] — CLAUDE.md

## Commands
npm run dev        # Start dev server
npm run test       # Run test suite
npm run lint       # ESLint + type check
npm run build      # Production build
supabase start     # Local Supabase (if applicable)

## Architecture
- [Brief stack description, e.g.: Next.js 15 + Supabase + Cloudflare Workers]
- Key directories: src/app/, src/components/, src/lib/, supabase/migrations/
- Auth: [Supabase Auth / Clerk / custom]
- Deployment: [Vercel / Cloudflare / self-hosted]

## Project-Specific Conventions
- [Any gotchas unique to this repo]
- [Non-obvious dependencies or setup steps]
- [Test DB setup: npm run db:reset before running tests]

## Do Not Touch
- [Files or dirs that should never be auto-edited]
- [e.g.: supabase/migrations/ — never edit existing migration files]

## Known Issues / Active Work
- [Current sprint focus, if relevant]`;

const DEPLOY_SCRIPT = `# Bootstrap ~/.claude/ global config
# Run once. Idempotent.

# Step 1 — Create directory structure
mkdir -p ~/.claude/rules
mkdir -p ~/.claude/agents

# Step 2 — Copy files from this explorer (use COPY button per file)
# ~/.claude/CLAUDE.md
# ~/.claude/settings.json
# ~/.claude/rules/security.md
# ~/.claude/rules/output-standards.md
# ~/.claude/rules/stack-conventions.md
# ~/.claude/agents/security-auditor.md
# ~/.claude/agents/code-reviewer.md
# ~/.claude/agents/skill-curator.md

# Step 3 — Verify load in Claude Code
claude
# Then inside the session:
/memory
# Should show loaded files from ~/.claude/

# Step 4 — Pre-deploy model string scan (CRITICAL)
# Hard deadline: June 15, 2026
echo "=== Scanning for deprecated model strings ==="
grep -rn "claude-sonnet-4-20250514" . --include="*.js" --include="*.jsx" \
  --include="*.ts" --include="*.tsx" --include="*.md" --include="*.json"
echo "=== If any matches found, replace with claude-sonnet-4-6 ==="
# Known locations: WorkstreamMapper.jsx:153, voice_map.jsx:255

# Step 5 — Per-project setup
# Copy project/CLAUDE.md template to your project root
# Fill in: commands, architecture, conventions, do-not-touch
# Commit CLAUDE.md to git
# Add CLAUDE.local.md to .gitignore for personal overrides

# Step 6 — Settings per project (optional)
# Create .claude/settings.json in project root
# Use global settings.json as template
# Tighten deny list based on project risk profile`;

// ── Live Status Data ──────────────────────────────────────────────────────────

const STATUS_ITEMS = [
  {
    cat: "DEADLINE",
    severity: "CRITICAL",
    title: "Model string deprecation — claude-sonnet-4-20250514",
    detail: "Hard deadline June 15, 2026. Replace all instances with claude-sonnet-4-6. Known locations: WorkstreamMapper.jsx:153, voice_map.jsx:255. Run: grep -rn 'claude-sonnet-4-20250514' across all repos.",
    color: "#ef4444",
  },
  {
    cat: "INFRA",
    severity: "REF",
    title: "Infrastructure IDs — ground truth",
    detail: "Supabase: mlqebvxmavrzousuqyjr (primary), suihrwqpljkswdbhekms (secondary)\nVercel: team_hPVeJgH0h1nCrogiaMvD6fxu\nn8n: https://krosebrook.app.n8n.cloud (6 workflows, all HEALTHY)\nInvoke: audit.flashfusion.co — Base44 ID 69c440b10249984f1114bc4b (24 entities)\nOrchestrator AI: orchestrator.flashfusion.co — Base44 ID 694c756124d640756ea9ba23 (89 entities)\nLovable workspace 'The Furnace': fSA1M4YIfzV70HGYAqoa",
    color: "#60a5fa",
  },
  {
    cat: "COMPLIANCE",
    severity: "WARN",
    title: "Skills compliance — 4 active gaps",
    detail: "Gap 1: Missing 'Use when...' trigger phrases in ALL description fields\nGap 2: version not nested under metadata in YAML frontmatter\nGap 3: Remove triggers/hooks from claude.ai-targeted skills\nGap 4: Implement least-privilege allowed-tools on Bash/Write/network skills\nScripts: D:\\03_Development\\Skills — skill_validator.py, fix-skills-unified.py, sync-skills.py",
    color: "#f59e0b",
  },
  {
    cat: "ADVISORY",
    severity: "INFO",
    title: "CLAUDE.md is advisory (~80%) — hooks are deterministic",
    detail: "Claude follows CLAUDE.md instructions approximately 80% of the time. For rules that must always execute, implement them as hooks instead. Whether Claude Code supports init/startup hooks is UNRESOLVED as of May 2026. Test critical rules manually after deploying config.",
    color: "#a78bfa",
  },
  {
    cat: "MODELS",
    severity: "REF",
    title: "Canonical model strings",
    detail: "Primary: claude-sonnet-4-6\nFast: claude-haiku-4-5-20251001\nDEPRECATED: claude-sonnet-4-20250514\n\nEPB Cost Router pattern:\n  LOW/MEDIUM → claude-haiku-4-5-20251001\n  HIGH/MAX   → claude-sonnet-4-6\n\nAgent files must use full strings — never shorthand 'haiku'/'sonnet'",
    color: "#22d3ee",
  },
  {
    cat: "IDENTITY",
    severity: "WARN",
    title: "Public-facing identity rules",
    detail: "Real title: L1 Service Desk Technician (NOT Staff Engineer)\nAI/automation work: self-initiated, not employer-assigned\n~30 hands-on tools (not inflated counts)\nNo employer identification in public content — anonymize as 'MSP service desk'\nStrict lane discipline: flashfusion.co / kylerosebrook.com / chaosclub.co — no conflation",
    color: "#f59e0b",
  },
];

// ── Data ──────────────────────────────────────────────────────────────────

const FILES = {
  "~/.claude/CLAUDE.md":                  { content: GLOBAL_CLAUDE_MD,  icon: "📋", badge: "GLOBAL", note: "Loaded every session — identity, communication rules, security hard rules" },
  "~/.claude/settings.json":              { content: SETTINGS_JSON,      icon: "⚙️",  badge: "PERMS",  note: "Allow/deny permissions — commit to repo, override with settings.local.json" },
  "~/.claude/rules/security.md":          { content: SECURITY_MD,        icon: "🔒", badge: "RULE",   note: "AppSec mandate — all projects, auto-loaded alongside CLAUDE.md" },
  "~/.claude/rules/output-standards.md":  { content: OUTPUT_STANDARDS_MD,icon: "📐", badge: "RULE",   note: "Response format, CLAIMS footer, SCOPE_MODE enforcement" },
  "~/.claude/rules/stack-conventions.md": { content: STACK_CONVENTIONS_MD,icon:"🧰", badge: "RULE",   note: "TypeScript, React, Supabase, Cloudflare, n8n conventions + model strings" },
  "~/.claude/agents/security-auditor.md": { content: SECURITY_AUDITOR_MD,icon: "🕵️", badge: "HAIKU",  note: "Isolated ctx, Read/Grep/Glob only, OWASP severity output format" },
  "~/.claude/agents/code-reviewer.md":    { content: CODE_REVIEWER_MD,   icon: "👁️",  badge: "SONNET", note: "MUST FIX / SHOULD FIX / CONSIDER / APPROVED output format" },
  "~/.claude/agents/skill-curator.md":    { content: SKILL_CURATOR_MD,   icon: "🗂️", badge: "HAIKU",  note: "Skill audit + YAML validation, May 2026 gaps pre-loaded" },
  "project/CLAUDE.md":                    { content: PROJECT_CLAUDE_MD,  icon: "📁", badge: "TEMPLATE",note: "Per-project template — fill in and commit, ~20 lines target" },
};

const TREE = [
  { type: "dir", name: "~/.claude/", children: [
    { type: "file", name: "CLAUDE.md",    path: "~/.claude/CLAUDE.md" },
    { type: "file", name: "settings.json",path: "~/.claude/settings.json" },
    { type: "dir",  name: "rules/", children: [
      { type: "file", name: "security.md",         path: "~/.claude/rules/security.md" },
      { type: "file", name: "output-standards.md", path: "~/.claude/rules/output-standards.md" },
      { type: "file", name: "stack-conventions.md",path: "~/.claude/rules/stack-conventions.md" },
    ]},
    { type: "dir",  name: "agents/", children: [
      { type: "file", name: "security-auditor.md", path: "~/.claude/agents/security-auditor.md" },
      { type: "file", name: "code-reviewer.md",    path: "~/.claude/agents/code-reviewer.md" },
      { type: "file", name: "skill-curator.md",    path: "~/.claude/agents/skill-curator.md" },
    ]},
  ]},
  { type: "dir", name: "project/", children: [
    { type: "file", name: "CLAUDE.md", path: "project/CLAUDE.md" },
  ]},
];

const PRIORITY = [
  {
    num: "01", label: "CLAUDE.md", sub: "≤200 lines · team rules · every session",
    color: "#f59e0b",
    note: "Highest leverage file. Architecture, commands, gotchas, hard rules. Keep lean — adherence drops above 200 lines. Advisory (~80%) — hooks are deterministic for must-run rules.",
    tag: "GLOBAL",
  },
  {
    num: "02", label: "rules/", sub: "path-scoped · modular · team-maintained",
    color: "#fb923c",
    note: "Split crowded CLAUDE.md here. Add paths: frontmatter for file-scoped activation. One concern per file.",
    tag: "MODULAR",
  },
  {
    num: "03", label: "skills/", sub: "auto-invoke + /slash · merged with commands",
    color: "#a78bfa",
    note: "commands/ is legacy. skills/ is canonical — adds auto-invocation, supporting files, frontmatter control. Existing commands/ still fires.",
    tag: "CANONICAL",
  },
  {
    num: "04", label: "agents/", sub: "isolated ctx · tool-restricted · model-specific",
    color: "#34d399",
    note: "Spawn subagents for focused tasks. Use full model strings: claude-haiku-4-5-20251001 for read-only audit, claude-sonnet-4-6 for code review. Clean output, no main ctx clutter.",
    tag: "SUBAGENT",
  },
  {
    num: "05", label: "settings.json", sub: "allow/deny · commit it · .local.json personal",
    color: "#60a5fa",
    note: "Hard deny: rm -rf, curl, .env reads, --force push. Allow: npm run *, git *, supabase *. settings.local.json gitignored for personal overrides.",
    tag: "PERMS",
  },
];

const BADGE_COLORS = {
  GLOBAL: "#f59e0b", PERMS: "#60a5fa", RULE: "#fb923c",
  HAIKU: "#34d399", SONNET: "#a78bfa", TEMPLATE: "#888",
};

const SEV_COLORS = {
  CRITICAL: "#ef4444", WARN: "#f59e0b", INFO: "#a78bfa", REF: "#60a5fa",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ClaudeConfigExplorer() {
  const [tab, setTab]       = useState("files");
  const [file, setFile]     = useState("~/.claude/CLAUDE.md");
  const [open, setOpen]     = useState(new Set(["~/.claude/", "project/", "rules/", "agents/"]));
  const [copied, setCopied] = useState(false);
  const [expandedPriority, setExpandedPriority] = useState(null);
  const [expandedStatus, setExpandedStatus] = useState(null);

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleDir = (name) => {
    setOpen(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const colorLine = (line) => {
    if (line.startsWith("##") || line.startsWith("#"))       return "#f59e0b";
    if (line.startsWith("---"))                              return "#444";
    if (/^(name|description|model|tools):/.test(line.trim())) return "#60a5fa";
    if (/CRITICAL|NEVER|non-negotiable|period$|DEPRECATED/.test(line)) return "#fca5a5";
    if (line.startsWith("  -") || line.startsWith("- "))     return "#d4d4d4";
    if (line.startsWith("//") || line.startsWith("#"))       return "#666";
    if (/"[^"]*"\s*:/.test(line))                            return "#93c5fd";
    return "#ccc";
  };

  const renderTree = (nodes, depth = 0) =>
    nodes.map((node) => {
      if (node.type === "dir") {
        const isOpen = open.has(node.name);
        return (
          <div key={node.name}>
            <div
              onClick={() => toggleDir(node.name)}
              style={{ paddingLeft: depth * 14 + 10, paddingTop: 5, paddingBottom: 5, paddingRight: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#666", fontSize: 11, userSelect: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
              onMouseLeave={e => e.currentTarget.style.color = "#666"}
            >
              <span style={{ fontSize: 9, opacity: 0.8 }}>{isOpen ? "▾" : "▸"}</span>
              <span>{node.name}</span>
            </div>
            {isOpen && renderTree(node.children, depth + 1)}
          </div>
        );
      }
      const sel = file === node.path;
      const fd  = FILES[node.path];
      return (
        <div
          key={node.path}
          onClick={() => { setFile(node.path); setTab("files"); }}
          style={{ paddingLeft: depth * 14 + 22, paddingTop: 5, paddingBottom: 5, paddingRight: 10, cursor: "pointer", fontSize: 11, background: sel ? "rgba(245,158,11,0.08)" : "transparent", borderRight: sel ? "2px solid #f59e0b" : "2px solid transparent", color: sel ? "#f59e0b" : "#888", display: "flex", alignItems: "center", gap: 6, userSelect: "none", transition: "all 0.12s" }}
          onMouseEnter={e => { if (!sel) e.currentTarget.style.color = "#ccc"; }}
          onMouseLeave={e => { if (!sel) e.currentTarget.style.color = "#888"; }}
        >
          <span style={{ opacity: 0.8 }}>{fd?.icon}</span>
          <span>{node.name}</span>
          {fd?.badge && <span style={{ marginLeft: "auto", fontSize: 9, color: BADGE_COLORS[fd.badge] || "#555", opacity: 0.8 }}>{fd.badge}</span>}
        </div>
      );
    });

  const fd = FILES[file];

  const TABS = [["files","📁 FILES"],["priority","⚡ PRIORITY"],["status","⚠ STATUS"],["deploy","🚀 DEPLOY"]];

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: "#0a0a0a", color: "#e5e5e5", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        .hl:hover { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d0d", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, background: "#f59e0b", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#000", flexShrink: 0 }}>C</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f5f5" }}>.claude/ Config Explorer <span style={{ fontSize: 9, color: "#555", fontWeight: 400 }}>v2</span></div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>Kyle Rosebrook · ~/.claude/ global · 9 files · May 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "4px 10px", fontSize: 10, fontFamily: "inherit", background: tab === id ? (id === "status" ? "#ef4444" : "#f59e0b") : "transparent", color: tab === id ? "#000" : "#555", border: "1px solid", borderColor: tab === id ? (id === "status" ? "#ef4444" : "#f59e0b") : "#222", borderRadius: 4, cursor: "pointer", fontWeight: tab === id ? 600 : 400, transition: "all 0.12s", letterSpacing: "0.5px" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* FILES TAB */}
      {tab === "files" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ width: 200, minWidth: 200, borderRight: "1px solid #171717", background: "#0d0d0d", overflowY: "auto", padding: "8px 0" }}>
            {renderTree(TREE)}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "8px 14px", borderBottom: "1px solid #171717", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f0f0f", flexShrink: 0 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>{fd?.icon} {file}</span>
                  {fd?.badge && <span style={{ fontSize: 9, padding: "2px 6px", background: "rgba(245,158,11,0.1)", color: BADGE_COLORS[fd.badge] || "#666", borderRadius: 3, border: "1px solid", borderColor: (BADGE_COLORS[fd.badge] || "#444") + "44" }}>{fd.badge}</span>}
                </div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{fd?.note}</div>
              </div>
              <button onClick={() => copy(fd?.content || "")} style={{ padding: "4px 10px", fontSize: 10, fontFamily: "inherit", background: copied ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.08)", color: copied ? "#22c55e" : "#f59e0b", border: "1px solid", borderColor: copied ? "#22c55e" : "#f59e0b33", borderRadius: 4, cursor: "pointer", transition: "all 0.15s", fontWeight: 600, letterSpacing: "0.5px" }}>
                {copied ? "✓ COPIED" : "COPY"}
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", background: "#0b0b0b", padding: "12px 0" }}>
              {(fd?.content || "").split("\n").map((line, i) => (
                <div key={i} className="hl" style={{ display: "flex", alignItems: "flex-start", minHeight: 18, paddingRight: 16 }}>
                  <span style={{ width: 38, minWidth: 38, textAlign: "right", paddingRight: 14, fontSize: 10, color: "#2a2a2a", userSelect: "none", lineHeight: "18px", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, lineHeight: "18px", color: colorLine(line), whiteSpace: "pre", fontFamily: "inherit" }}>{line || " "}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRIORITY TAB */}
      {tab === "priority" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 28, background: "#0a0a0a" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>reference card</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f5f5f5", marginBottom: 4 }}>.claude/ Priority Order</div>
              <div style={{ fontSize: 11, color: "#555" }}>Where config belongs · what it does · when to touch it — click any row to expand</div>
            </div>

            {PRIORITY.map((item, i) => {
              const isExpanded = expandedPriority === i;
              return (
                <div key={i} onClick={() => setExpandedPriority(isExpanded ? null : i)} style={{ marginBottom: 8, border: "1px solid", borderColor: isExpanded ? item.color + "44" : "#1a1a1a", borderLeft: `3px solid ${item.color}`, borderRadius: 5, background: isExpanded ? "#111" : "#0e0e0e", cursor: "pointer", transition: "all 0.15s", overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 10, color: item.color, fontWeight: 700, opacity: 0.5, minWidth: 20 }}>{item.num}</span>
                    <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.label}</span>
                      <span style={{ fontSize: 10, color: "#555" }}>{item.sub}</span>
                    </div>
                    <span style={{ fontSize: 9, padding: "2px 6px", background: item.color + "15", color: item.color, borderRadius: 3, opacity: 0.8 }}>{item.tag}</span>
                    <span style={{ fontSize: 9, color: "#444", marginLeft: 4 }}>{isExpanded ? "▴" : "▾"}</span>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 16px 14px 50px", fontSize: 11, color: "#999", lineHeight: 1.7, borderTop: "1px solid #1a1a1a", paddingTop: 10 }}>
                      {item.note}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Correction callout */}
            <div style={{ marginTop: 24, padding: "14px 16px", background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", borderLeft: "3px solid #f87171", borderRadius: 5 }}>
              <div style={{ fontSize: 10, color: "#f87171", fontWeight: 700, marginBottom: 6, letterSpacing: "1px" }}>⚠ ARTICLE CORRECTION (Mar 24, 2026)</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.7 }}>
                The Daily Dose of Data Science article treats{" "}
                <span style={{ color: "#f59e0b" }}>commands/</span> and{" "}
                <span style={{ color: "#f59e0b" }}>skills/</span> as separate systems.
                Per official Claude Code docs (confirmed by Randy Lutcavich citing{" "}
                <span style={{ color: "#93c5fd" }}>code.claude.com/docs</span>):
                they have been merged. <span style={{ color: "#e5e5e5" }}>skills/ is canonical</span> — auto-invocation, supporting files, frontmatter control.
                Existing commands/ files continue to work but should migrate.
              </div>
            </div>

            {/* Quick reference card */}
            <div style={{ marginTop: 24, padding: "14px 16px", background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: 5 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: "1px", marginBottom: 10 }}>DECISION TREE · where does this config go?</div>
              {[
                ["Global instruction / identity", "~/.claude/CLAUDE.md"],
                ["File-scoped rule (by path)", "~/.claude/rules/[name].md with paths:"],
                ["Team-wide workflow / slash command", ".claude/skills/[name]/SKILL.md"],
                ["Focused task needing isolated context", ".claude/agents/[name].md"],
                ["What Claude can / cannot execute", ".claude/settings.json"],
                ["Personal override (not committed)", "CLAUDE.local.md or settings.local.json"],
              ].map(([q, a]) => (
                <div key={q} style={{ display: "flex", gap: 12, marginBottom: 7, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, color: "#555", minWidth: 230 }}>{q}</span>
                  <span style={{ fontSize: 11, color: "#f59e0b" }}>→ {a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATUS TAB */}
      {tab === "status" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 28, background: "#0a0a0a" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>live status</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f5f5f5", marginBottom: 4 }}>⚠ Deadlines · Infra · Compliance</div>
              <div style={{ fontSize: 11, color: "#555" }}>Ground-truth reference — updated May 25, 2026. Click any row to expand.</div>
            </div>

            {STATUS_ITEMS.map((item, i) => {
              const isExpanded = expandedStatus === i;
              return (
                <div key={i} onClick={() => setExpandedStatus(isExpanded ? null : i)} style={{ marginBottom: 8, border: "1px solid", borderColor: isExpanded ? item.color + "44" : "#1a1a1a", borderLeft: `3px solid ${item.color}`, borderRadius: 5, background: isExpanded ? "#111" : "#0e0e0e", cursor: "pointer", transition: "all 0.15s", overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 9, padding: "2px 6px", background: (SEV_COLORS[item.severity] || "#555") + "15", color: SEV_COLORS[item.severity] || "#555", borderRadius: 3, fontWeight: 700, minWidth: 55, textAlign: "center" }}>{item.severity}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#e5e5e5" }}>{item.title}</span>
                    </div>
                    <span style={{ fontSize: 9, color: "#444", padding: "2px 6px", background: "#111", borderRadius: 3 }}>{item.cat}</span>
                    <span style={{ fontSize: 9, color: "#444", marginLeft: 4 }}>{isExpanded ? "▴" : "▾"}</span>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 16px 14px 16px", borderTop: "1px solid #1a1a1a", paddingTop: 10 }}>
                      {item.detail.split("\n").map((line, j) => (
                        <div key={j} style={{ fontSize: 11, color: /DEPRECATED|CRITICAL|deadline|Known locations/.test(line) ? "#fca5a5" : /→|->/.test(line) ? "#f59e0b" : "#888", lineHeight: 1.8, fontFamily: "inherit", whiteSpace: "pre-wrap" }}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DEPLOY TAB */}
      {tab === "deploy" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", borderBottom: "1px solid #171717", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f0f0f", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>🚀 bootstrap.sh · create ~/.claude/ structure</div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>Run once · idempotent · includes model string scan</div>
            </div>
            <button onClick={() => copy(DEPLOY_SCRIPT)} style={{ padding: "4px 10px", fontSize: 10, fontFamily: "inherit", background: copied ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.08)", color: copied ? "#22c55e" : "#f59e0b", border: "1px solid", borderColor: copied ? "#22c55e" : "#f59e0b33", borderRadius: 4, cursor: "pointer", transition: "all 0.15s", fontWeight: 600, letterSpacing: "0.5px" }}>
              {copied ? "✓ COPIED" : "COPY"}
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", background: "#0b0b0b", padding: "12px 0" }}>
            {DEPLOY_SCRIPT.split("\n").map((line, i) => (
              <div key={i} className="hl" style={{ display: "flex", alignItems: "flex-start", minHeight: 18, paddingRight: 16 }}>
                <span style={{ width: 38, minWidth: 38, textAlign: "right", paddingRight: 14, fontSize: 10, color: "#2a2a2a", userSelect: "none", lineHeight: "18px", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 11, lineHeight: "18px", whiteSpace: "pre", fontFamily: "inherit", color: line.startsWith("#") ? "#555" : line.startsWith("mkdir") || line.startsWith("claude") || line.startsWith("grep") ? "#60a5fa" : line.startsWith("echo") ? "#fca5a5" : line.startsWith("/") ? "#a78bfa" : "#ccc" }}>
                  {line || " "}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
