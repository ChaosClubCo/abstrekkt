import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────
//  COLORS
// ─────────────────────────────────────────────────────────────────
const SC = s => ({todo:"#475569",active:"#7c3aed",done:"#15803d",blocked:"#dc2626",skipped:"#f59e0b"})[s]||"#475569";
const RC = r => ({HIGH:"#dc2626",MEDIUM:"#f59e0b",LOW:"#10b981",NONE:"#6b7280"})[r]||"#6b7280";
const RL = r => ({HIGH:"🔴",MEDIUM:"🟡",LOW:"🟢",NONE:"⚪"})[r]||"⚪";

// ─────────────────────────────────────────────────────────────────
//  PHASES
// ─────────────────────────────────────────────────────────────────
const PHASES = [
  {id:0,title:"Baseline Snapshot",risk:"NONE",time:"5 min",tool:"Base44 AI Builder",stop:false},
  {id:1,title:"Backend Security Blockers",risk:"HIGH",time:"90–120 min",tool:"Base44 AI Builder",stop:true},
  {id:2,title:"Backend Warnings",risk:"MEDIUM",time:"60–90 min",tool:"Base44 AI Builder",stop:true},
  {id:3,title:"Frontend Fixes",risk:"LOW",time:"30–45 min",tool:"Base44 AI Builder",stop:false},
  {id:4,title:"Improvements & Infrastructure",risk:"LOW",time:"45–60 min",tool:"Base44 AI Builder",stop:true},
  {id:5,title:"Page Wiring",risk:"MEDIUM",time:"60–90 min",tool:"Base44 AI Builder",stop:false},
  {id:6,title:"Sidebar Restructure",risk:"MEDIUM",time:"30–45 min",tool:"Base44 AI Builder",stop:true},
  {id:7,title:"E2E Testing",risk:"NONE",time:"60–90 min",tool:"Claude Desktop/Chrome",stop:false},
  {id:8,title:"Documentation Update",risk:"NONE",time:"30 min",tool:"Claude Desktop",stop:false},
];

// ─────────────────────────────────────────────────────────────────
//  PROMPTS
// ─────────────────────────────────────────────────────────────────
const PROMPTS = [
  {id:"p0_1",phaseId:0,seq:"0.1",title:"State Export",tool:"Base44 AI Builder",expMin:5,bypass:false,
   edit:["READ-ONLY — zero file edits"],freeze:["ALL files"],
   walkUp:["Base44 app accessible + logged in","No active AI builder jobs running","Ready to save output as SNAPSHOT_BASELINE.md"],
   verify:["SNAPSHOT_BASELINE.md saved locally","All 20 target files confirmed or flagged as missing","Sidebar nav arrays captured for all 3 roles","All App.jsx routes captured","Function file list complete with first-line identifiers"],
   orgInfo:"Pure read-only. Save output BEFORE any Phase 1 work begins.",
   prompt:`ROLE: Build assistant — pre-remediation state capture.

CONTEXT: Starting 47-issue production remediation. Need complete snapshot for rollback.

TASK — ALL of the following (READ-ONLY):
1. LIST every backend function file + its first line (import/comment)
2. LIST sidebar nav arrays from Layout.jsx — admin, facilitator, participant
3. LIST all route definitions from App.jsx
4. CONFIRM these files exist + line counts:
   functions/lib/rbacMiddleware.ts
   functions/lib/middleware.js
   functions/lib/aiGovernance.ts
   functions/redeemReward.js
   functions/completeChallengeTracking.js
   functions/inviteUser.js
   functions/enforceDefaultRole.js
   functions/recordPointsTransaction.js
   functions/awardPoints.ts
   functions/logError.ts
   functions/purchaseWithPoints.js
   functions/createSmartNotification.js
   functions/suspendUser.js     ← FROZEN (note only)
   functions/deleteUser.js      ← FROZEN (note only)
   functions/createNotification.js ← FROZEN (note only)
   src/pages/Landing.jsx
   src/components/common/ErrorBoundary.jsx
   src/Layout.jsx / src/App.jsx / src/pages.config.js
5. OUTPUT as single markdown block → save as SNAPSHOT_BASELINE.md

CONSTRAINTS: Read-only. No modifications. No file creation.`},

  {id:"p1_1",phaseId:1,seq:"1.1",title:"rbacMiddleware: Rate Limiter + Owner Emails",tool:"Base44 AI Builder",expMin:20,bypass:false,
   edit:["functions/lib/rbacMiddleware.ts"],
   freeze:["functions/lib/middleware.js","functions/lib/aiGovernance.ts","suspendUser.js ⚠FROZEN","deleteUser.js ⚠FROZEN","createNotification.js ⚠FROZEN","AuthProvider.jsx","RoleGate.jsx"],
   walkUp:["Phase 0 snapshot saved + verified","OWNER_EMAILS set in Base44 secrets (comma-separated emails)","UPSTASH_REDIS_URL confirmed in secrets","UPSTASH_REDIS_REST_API_TOKEN confirmed in secrets"],
   verify:["rateLimitWithRedis uses fetch() to Upstash REST API","OWNER_EMAILS from Deno.env.get('OWNER_EMAILS')","Old in-memory rateLimitStore Map removed","All exports intact: requireAuth, requirePermission, requireOwner, isOwner, PERMISSIONS, ROLE_HIERARCHY","Redis failure = fail-open + structured log","Startup warning if OWNER_EMAILS empty"],
   orgInfo:"Set OWNER_EMAILS in Base44 secrets BEFORE running this prompt.",
   prompt:`ROLE: Senior security engineer — RBAC middleware targeted fix.

BLOCKER A — Rate Limiter (Line ~141-157):
rateLimitStore = in-memory Map. Deno cold starts = fresh = rate limits broken.

BLOCKER B — Owner Emails (Line ~6):
OWNER_EMAILS = [] → isOwner() always false → CONFIGURE_SYSTEM + EXPORT_SENSITIVE_DATA inaccessible.

FIX A — Replace with Upstash Redis sliding-window:
• Create rateLimitWithRedis(userId, functionName, maxRequests, windowMs)
• Use fetch() to Upstash REST API — no npm packages (Deno compatible)
• Key: ratelimit:{functionName}:{userId} | Window: 60s default
• FALLBACK: Redis unreachable → ALLOW request + log (fail-open for availability)
• Remove old rateLimitStore Map entirely

FIX B — Env-based OWNER_EMAILS:
const OWNER_EMAILS = (Deno.env.get('OWNER_EMAILS') || '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
Add startup AuditLog warning if OWNER_EMAILS is empty.

SCOPE LOCK: functions/lib/rbacMiddleware.ts ONLY
ROLLBACK: Revert to Phase 0 snapshot.`},

  {id:"p1_2",phaseId:1,seq:"1.2",title:"redeemReward: Points Field + Parse Order",tool:"Base44 AI Builder",expMin:15,bypass:false,
   edit:["functions/redeemReward.js"],freeze:["All other files"],
   walkUp:["Prompt 1.1 completed + verified","Snapshot of redeemReward.js noted from Phase 0"],
   verify:["All points checks use available_points (not total_points)","req.json() wrapped in try/catch with 400 on failure","reward_id destructure happens AFTER type guard","RBAC guard at top unchanged"],
   orgInfo:"Points field standard: available_points. Cross-check purchaseWithPoints.js.",
   prompt:`ROLE: Senior security engineer — financial transaction integrity.

BLOCKER A — Points Field Mismatch (Lines ~89, 100):
Points check uses total_points; purchaseWithPoints.js uses available_points → double-spend possible.

BLOCKER B — Parse Order (Lines ~21-25):
reward_id destructured BEFORE type-check → malformed JSON throws before validation.

FIX A — Standardize to available_points:
• Check: userPoints.available_points >= reward.points_cost
• Deduct: available_points: userPoints.available_points - reward.points_cost

FIX B — Safe parse order:
let body;
try { body = await req.json(); } catch { return {status:400, body:{error:'Invalid JSON'}}; }
if (!body || typeof body !== 'object') { return {status:400, body:{error:'Body must be object'}}; }
const { reward_id } = body;

SCOPE LOCK: functions/redeemReward.js ONLY`},

  {id:"p1_3",phaseId:1,seq:"1.3",title:"completeChallengeTracking: Double-Read + Service Role",tool:"Base44 AI Builder",expMin:20,bypass:false,
   edit:["functions/completeChallengeTracking.js"],freeze:["All other files"],
   walkUp:["Prompts 1.1 + 1.2 verified","Snapshot of completeChallengeTracking.js noted"],
   verify:["Body parsed once via req.json() at top","Catch block uses parsedBody?.challenge_id (not req.text())","UserPoints UPDATE uses base44.asServiceRole.entities.UserPoints","Challenge.update uses base44.asServiceRole.entities.Challenge","User-scoped reads remain user-scoped","RBAC guard unchanged"],
   orgInfo:"asServiceRole for writes, user-scoped for reads. Challenge entity has admin-only write.",
   prompt:`ROLE: Senior backend engineer — request handling + permission escalation.

BLOCKER — Body Double-Read (Lines ~113-118):
catch block calls req.text() AFTER req.json() consumed stream → challenge_id always 'unknown'.

WARNING A (Lines ~71-78): UserPoints user-scoped → silently fails if session restricted.
WARNING B (Lines ~82-84): Challenge user-scoped → admin-only write → fails for regular users.

FIX 1 — Parse body once (after auth check):
let parsedBody;
try { parsedBody = await req.json(); } catch { return {status:400, body:{error:'Invalid JSON'}}; }
const { challenge_id, tracking_data } = parsedBody;
In catch block: parsedBody?.challenge_id || 'unknown'
Remove req.text() or any second req.json() call.

FIX 2 — UserPoints writes → service role:
base44.asServiceRole.entities.UserPoints (writes only)

FIX 3 — Challenge update → service role:
base44.asServiceRole.entities.Challenge.update(challenge_id, ...)

SCOPE LOCK: functions/completeChallengeTracking.js ONLY`},

  {id:"p1_4",phaseId:1,seq:"1.4",title:"middleware.js: Structured Logging",tool:"Base44 AI Builder",expMin:20,bypass:false,
   edit:["functions/lib/middleware.js"],
   freeze:["functions/lib/rbacMiddleware.ts (already fixed)","functions/lib/aiGovernance.ts","suspendUser.js ⚠FROZEN","deleteUser.js ⚠FROZEN","createNotification.js ⚠FROZEN"],
   walkUp:["Prompts 1.1–1.3 verified","Snapshot of middleware.js noted"],
   verify:["Zero console.log() calls (grep to confirm)","Zero console.error() calls (grep to confirm)","All error paths write to AuditLog with structured objects","All AuditLog writes in try/catch with silent fallback","No PII in any log string","requireRole has deprecation comment if it exists","All exports intact"],
   orgInfo:"Grep for BOTH 'console.log' AND 'console.error' separately. AuditLog.create always in try/catch with empty catch {}.",
   prompt:`ROLE: Senior security engineer — PII-leaking logs → structured audit logging.

ISSUE: console.log/console.error at lines ~238, 248, 310-311, 331 leak PII. File imported by many functions.

REPLACE ALL console.log/error with:
try {
  await base44.asServiceRole.entities.AuditLog.create({
    event_type: 'middleware_error', severity: 'error',
    details: JSON.stringify({
      function: 'createHandler',
      error: error?.message || 'Unknown',
      timestamp: new Date().toISOString()
    })
  });
} catch (_) { /* SILENT — never crash main flow */ }

ALSO: If requireRole exists, add deprecation comment:
// DEPRECATED: Use requirePermission from rbacMiddleware.ts instead.
// Remove in Supabase migration.

SCOPE LOCK: functions/lib/middleware.js ONLY`},

  {id:"p1_5",phaseId:1,seq:"1.5",title:"enforceDefaultRole: PII Leak + user_type",tool:"Base44 AI Builder",expMin:15,bypass:false,
   edit:["functions/enforceDefaultRole.js"],freeze:["All other files"],
   walkUp:["Prompts 1.1–1.4 verified","Snapshot noted"],
   verify:["Zero console.log() calls","No email or PII in any string","Condition checks !userData.user_type (not !userData.role)","Admin downgrade logic unchanged","Invitation flow still preserves role","AuditLog write has silent fallback"],
   orgInfo:"user_type = frontend normalization field. Backend = 8-tier hierarchy.",
   prompt:`ROLE: Senior security engineer — PII logging + role assignment.

BLOCKER (Line ~37): console.log('User created via invitation, role preserved:', userData.email)
→ Logs plaintext email → GDPR violation.

WARNING (Lines ~42-48): Direct signups with role:'user' never get user_type:'participant'.

FIX 1 — Remove PII + structured AuditLog:
Delete console.log. Replace with:
try {
  await base44.asServiceRole.entities.AuditLog.create({
    event_type: 'user_role_enforced', severity: 'info',
    details: JSON.stringify({ function:'enforceDefaultRole', action:'invitation_role_preserved', timestamp:new Date().toISOString() })
  });
} catch (_) {}

FIX 2 — Always set user_type:
Change: if (!userData.role || userData.role === 'admin')
To:     if (!userData.user_type || userData.role === 'admin')

SCOPE LOCK: functions/enforceDefaultRole.js ONLY`},

  {id:"p1_6",phaseId:1,seq:"1.6",title:"recordPointsTransaction + inviteUser + awardPoints",tool:"Base44 AI Builder",expMin:25,bypass:false,
   edit:["functions/recordPointsTransaction.js","functions/inviteUser.js","functions/awardPoints.ts"],
   freeze:["suspendUser.js ⚠FROZEN","deleteUser.js ⚠FROZEN","createNotification.js ⚠FROZEN","All pages/components"],
   walkUp:["Prompts 1.1–1.5 verified","BASE44_APP_URL set in Base44 secrets","Snapshots of all 3 files noted"],
   verify:["recordPointsTransaction.js: structured console.error","recordPointsTransaction.js: 400 on insufficient balance","inviteUser.js: throws on missing BASE44_APP_URL (no fallback)","inviteUser.js: isOwner from rbacMiddleware, no local OWNER_EMAILS","awardPoints.ts: only ONE helper functions header","All 3: RBAC guards unchanged"],
   orgInfo:"BASE44_APP_URL must be set in secrets before running. inviteUser.js will throw if missing.",
   prompt:`ROLE: Senior backend engineer — logging, URL fallback, code quality.

FILE 1 — recordPointsTransaction.js:
• BLOCKER (Line ~132): console.error dumps raw error
• WARNING (Line ~54): Math.max silently floors to 0 on over-deduction

FIX 1a: console.error('recordPointsTransaction error:', { function:'recordPointsTransaction', error:error?.message, timestamp:new Date().toISOString() });
FIX 1b: Guard BEFORE Math.max:
if (amount < 0 && Math.abs(amount) > currentBalance) {
  return {status:400, body:{error:'Insufficient points balance', current_balance:currentBalance, shortfall:Math.abs(amount)-currentBalance}};
}

FILE 2 — inviteUser.js:
• BLOCKER (Line ~96): placeholder URL 'https://your-app.base44.app'
• WARNING: Duplicate local OWNER_EMAILS = []

FIX 2a: const appUrl = Deno.env.get('BASE44_APP_URL'); if (!appUrl) throw new Error('BASE44_APP_URL not set');
FIX 2b: Add to top of file: import {isOwner} from lib/rbacMiddleware.ts
         Replace OWNER_EMAILS.includes(email) → isOwner(email). Delete local const.

FILE 3 — awardPoints.ts:
• BLOCKER (Lines ~228-234): Duplicate section header comment — remove DUPLICATE.

SCOPE LOCK: recordPointsTransaction.js, inviteUser.js, awardPoints.ts`},

  {id:"p2_1",phaseId:2,seq:"2.1",title:"createSmartNotification + purchaseWithPoints",tool:"Base44 AI Builder",expMin:15,bypass:false,
   edit:["functions/createSmartNotification.js","functions/purchaseWithPoints.js"],freeze:["All other files"],
   walkUp:["Phase 1 STOP GATE passed — all 6 prompts verified","Snapshots noted"],
   verify:["createSmartNotification.js: outer catch uses structured object","purchaseWithPoints.js: points_cost 0 treated as valid","Both: RBAC guards unchanged"],
   orgInfo:"points_cost=0 = valid free premium item. Only null/undefined = misconfigured.",
   prompt:`ROLE: Senior backend engineer — logging + validation edge cases.

FILE 1 — createSmartNotification.js:
• WARNING (Line ~141): Outer catch has unstructured console.error. Inner catch IS correct.
FIX: console.error('Smart notification error:', { function:'createSmartNotification', error:error?.message, timestamp:new Date().toISOString() });

FILE 2 — purchaseWithPoints.js:
• WARNING (Line ~83): item.is_premium && !item.points_cost is truthy when points_cost=0 → free premium items wrongly rejected.
FIX: Change !item.points_cost → (item.points_cost === null || item.points_cost === undefined)

SCOPE LOCK: createSmartNotification.js, purchaseWithPoints.js ONLY`},

  {id:"p2_2",phaseId:2,seq:"2.2",title:"awardPoints: Badge Caching + Double Logging",tool:"Base44 AI Builder",expMin:20,bypass:false,
   edit:["functions/awardPoints.ts"],freeze:["All other files"],
   walkUp:["Prompt 2.1 verified","Snapshot of awardPoints.ts noted"],
   verify:["Badge query filtered by is_active:true OR has TODO comment","Transaction failures produce exactly ONE log entry","All exports unchanged"],
   orgInfo:"Check Badge entity for is_active field before filtering — may not exist yet.",
   prompt:`ROLE: Senior performance engineer — badge checks + telemetry.

WARNING A (Line ~416): Badge.list() unfiltered → fetches ALL badges every award.
FIX A: Badge.filter({ is_active: true })
If Badge has no is_active field: keep list() + add // TODO: Add is_active, then filter

WARNING B (Lines ~152-216): Rollback re-throws transactionError → outer catch also fires → double-logging.
FIX B:
let rollbackHandled = false;
try {
  // rollback logic...
  rollbackHandled = true; throw transactionError;
} catch (rollbackError) {
  if (!rollbackHandled) { /* log rollback failure */ } throw transactionError;
}
In outer catch: skip if already handled.

SCOPE LOCK: functions/awardPoints.ts ONLY`},

  {id:"p2_3",phaseId:2,seq:"2.3",title:"aiGovernance + logError: Variable Shadowing",tool:"Base44 AI Builder",expMin:15,bypass:false,
   edit:["functions/lib/aiGovernance.ts","functions/logError.ts"],freeze:["All other files"],
   walkUp:["Prompt 2.2 verified","Snapshots noted"],
   verify:["aiGovernance.ts: no catch variable named logError","aiGovernance.ts: ROLE_CAPABILITIES uses 'default' key","role lookup falls back to 'default'","logError.ts: catch variable is loggingError","Both: exports unchanged"],
   orgInfo:"ROLE_CAPABILITIES['default'] = fallback for unrecognized roles.",
   prompt:`ROLE: Senior engineer — variable shadowing + role capability key.

FILE 1 — aiGovernance.ts:
FIX 1a: } catch (loggingError) { console.error('Failed to log AI interaction:', { function:'logAIInteraction', error:loggingError?.message, timestamp:new Date().toISOString() }); }
FIX 1b: Rename ROLE_CAPABILITIES 'user' key → 'default'
         Update: const capabilities = ROLE_CAPABILITIES[role] || ROLE_CAPABILITIES['default'];

FILE 2 — logError.ts:
FIX 2: } catch (loggingError) { console.error('Error logging failed:', { function:'logError', error:loggingError?.message }); }

SCOPE LOCK: aiGovernance.ts, logError.ts ONLY`},

  {id:"p2_4",phaseId:2,seq:"2.4",title:"SDK Standardization + validateEnv Utility",tool:"Base44 AI Builder",expMin:20,bypass:false,
   edit:["All function files (SDK version only)","NEW: functions/lib/validateEnv.ts","functions/inviteUser.js","functions/lib/rbacMiddleware.ts"],
   freeze:["suspendUser.js ⚠FROZEN","deleteUser.js ⚠FROZEN","createNotification.js ⚠FROZEN","All pages/components"],
   walkUp:["Prompt 2.3 verified","Confirm latest SDK version (expect @0.8.6)"],
   verify:["grep -r 'sdk/v0.8.4' functions/ = zero results","validateEnv.ts exists in functions/lib/","inviteUser.js calls validateEnv at startup","FROZEN files NOT modified (even for SDK version)"],
   orgInfo:"SDK path pattern: cdn.base44.com/js-sdk/v[VERSION]/base44.js. Frozen files exempt from SDK update.",
   prompt:`ROLE: Senior DevOps — dependency standardization + startup safety.

FIX 1 — Standardize ALL non-frozen function files to SDK @0.8.6:
Update SDK import URL to use version v0.8.6:
   cdn.base44.com/js-sdk/v0.8.6/base44.js
⚠ SKIP frozen files. List every file updated.

FIX 2 — Create functions/lib/validateEnv.ts:
export function validateEnv(requiredVars: string[]): Record<string, string> {
  const missing: string[] = [];
  const values: Record<string, string> = {};
  for (const v of requiredVars) {
    const val = Deno.env.get(v);
    if (!val?.trim()) missing.push(v); else values[v] = val;
  }
  if (missing.length > 0) throw new Error('Missing env vars: ' + missing.join(', '));
  return values;
}

Add validateEnv calls:
• inviteUser.js top: validateEnv(['BASE44_APP_URL'])
• rbacMiddleware.ts inside rate limit (wrapped in try/catch for graceful degrade)

SCOPE LOCK: As listed — frozen files EXEMPT`},

  {id:"p2_5",phaseId:2,seq:"2.5",title:"Landing.jsx: Console Logs + Broken UI",tool:"Base44 AI Builder",expMin:15,bypass:false,
   edit:["src/pages/Landing.jsx"],freeze:["All backend files","All other pages","Layout.jsx","App.jsx"],
   walkUp:["Prompt 2.4 verified","Snapshot of Landing.jsx noted"],
   verify:["grep -n 'console.log' Landing.jsx = zero","Watch Demo has onClick handler","Footer Privacy/Terms/Contact have real hrefs","Pricing nav removed or commented","No JSX errors"],
   orgInfo:"Landing.jsx = public marketing page. Contact: hello@intinc.com.",
   prompt:`ROLE: Senior frontend engineer — public marketing page fixes.

A (Lines ~110, 162, 223, 369): 4× console.log('[LANDING]...') — delete all.
B (Line ~236): Watch Demo button has no onClick → add: onClick={() => alert('Demo video coming soon! Book a live demo instead.')}
C (Lines ~395-403): Footer links use href="#" → fix: Privacy: href="/privacy" | Terms: href="/terms" | Contact: href="mailto:hello@intinc.com"
D (Line ~106): Pricing nav → remove OR: // TODO: Removed from nav — add pricing section first

SCOPE LOCK: src/pages/Landing.jsx ONLY`},

  {id:"p3_1",phaseId:3,seq:"3.1",title:"ErrorBoundary + SEO Meta Tags",tool:"Base44 AI Builder",expMin:20,bypass:false,
   edit:["src/components/common/ErrorBoundary.jsx","src/pages/Landing.jsx (SEO only)"],
   freeze:["All backend files","Layout.jsx","App.jsx"],
   walkUp:["Phase 2 STOP GATE passed","Snapshots noted"],
   verify:["ErrorBoundary calls base44.functions.invoke (not fetch('/api/logError'))","base44 imported in ErrorBoundary","Landing sets document.title + meta tags on mount","Landing cleans up title on unmount","No other Landing changes"],
   orgInfo:"base44.functions.invoke = correct SDK method for calling Deno functions. Theme color: #0066FF.",
   prompt:`ROLE: Senior frontend engineer — error reporting + SEO.

FIX A — ErrorBoundary.jsx (Line ~31):
fetch('/api/logError') → broken. Replace with:
try {
  base44.functions.invoke('logError', {
    error: error?.message || 'Unknown',
    componentStack: errorInfo?.componentStack || '',
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
} catch (_) {} // Must never crash the error boundary
Ensure base44 is imported at top.

FIX B — Landing.jsx SEO useEffect:
useEffect(() => {
  document.title = 'INTeract - Employee Engagement Platform | Real-Time Insights';
  const tags = { 'description':'...', 'og:title':'INTeract - Employee Engagement Platform', 'og:type':'website', 'twitter:card':'summary_large_image', 'theme-color':'#0066FF' };
  // set meta tags...
  return () => { document.title = 'INTeract'; };
}, []);

SCOPE LOCK: ErrorBoundary.jsx, Landing.jsx (SEO only)`},

  {id:"p3_2",phaseId:3,seq:"3.2",title:"Health Check + Legal Page Stubs",tool:"Base44 AI Builder",expMin:25,bypass:false,
   edit:["NEW: functions/healthCheck.js","NEW: src/pages/Privacy.jsx","NEW: src/pages/Terms.jsx","src/App.jsx (2 routes only)"],
   freeze:["All existing backend functions","Layout.jsx","All existing pages"],
   walkUp:["Prompt 3.1 verified","App.jsx routing pattern confirmed from Phase 0 snapshot"],
   verify:["healthCheck.js returns {status:'ok'} without auth","Privacy.jsx renders 5+ sections","Terms.jsx renders 6+ sections","App.jsx has /privacy and /terms routes","Both accessible without auth","No existing routes modified"],
   orgInfo:"Legal email: privacy@intinc.com. Company: INT Inc. Stub pages — full legal review TBD.",
   prompt:`ROLE: Senior engineer — infrastructure endpoints + legal compliance.

CREATE 1 — functions/healthCheck.js (no auth required):
export default async function handler(req) {
  return { status:200, body:{ status:'ok', timestamp:new Date().toISOString(), version:'1.0.0', environment:Deno.env.get('ENVIRONMENT')||'production' } };
}

CREATE 2 — src/pages/Privacy.jsx:
Sections: Information We Collect, How We Use, Data Protection (GDPR/SOC2), Your Rights, Contact (privacy@intinc.com)

CREATE 3 — src/pages/Terms.jsx:
Sections: Acceptance, Account Terms, Acceptable Use, Data Ownership, Liability Limitation, Termination, Contact

WIRE — App.jsx public routes:
Route path="/privacy" | Route path="/terms"
Alongside Landing. Import both. No auth wrapper.`},

  {id:"p4_1",phaseId:4,seq:"4.1",title:"robots.txt + Stats Disclaimer + HTTP Method Guard",tool:"Base44 AI Builder",expMin:15,bypass:false,
   edit:["NEW: public/robots.txt","src/pages/Landing.jsx (stats only)","functions/enforceDefaultRole.js (top only)"],
   freeze:["All other files"],
   walkUp:["Prompts 3.1 + 3.2 verified"],
   verify:["robots.txt exists + disallows /app/ /admin/ /api/","Landing stats have disclaimer","enforceDefaultRole rejects non-POST with 405"],
   orgInfo:"Sitemap URL: interact.intinc.com/sitemap.xml (placeholder — not yet generated).",
   prompt:`ROLE: Senior engineer — SEO infrastructure + content + HTTP validation.

CREATE 1 — public/robots.txt:
User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /api/
Sitemap: https://interact.intinc.com/sitemap.xml

FIX 2 — Landing.jsx stats disclaimer (below stats section ONLY):
<p className="text-xs text-neutral-400 mt-4">
  *Based on internal benchmarks and early adopter feedback. Individual results may vary.
</p>

FIX 3 — enforceDefaultRole.js — add at very top of handler:
if (req.method !== 'POST') { return { status:405, body:{error:'Method not allowed'} }; }`},

  {id:"p4_2",phaseId:4,seq:"4.2",title:"Frozen File Remediation Tracker",tool:"Base44 AI Builder",expMin:10,bypass:false,
   edit:["NEW: functions/FROZEN_FILE_REMEDIATION.md"],
   freeze:["suspendUser.js ⚠FROZEN","deleteUser.js ⚠FROZEN","createNotification.js ⚠FROZEN"],
   walkUp:["Prompt 4.1 verified"],
   verify:["FROZEN_FILE_REMEDIATION.md exists","Frozen files NOT modified","Tracker has all 3 files + unfreeze protocol"],
   orgInfo:"These 3 files handle critical security operations. Edit = export → fix → verify → re-freeze.",
   prompt:`ROLE: Senior engineer — deferred fix documentation. DO NOT edit frozen files.

CREATE functions/FROZEN_FILE_REMEDIATION.md:

# Frozen File Remediation Tracker
## Status: DEFERRED — Requires explicit unfreeze approval

### suspendUser.js — HIGH priority
Issue: Line ~91 — raw error in console.error (PII + stack)
Fix: Structured { function:'suspendUser', error:error?.message, timestamp }

### deleteUser.js — HIGH priority
Issue: Line ~82 — same pattern

### createNotification.js — MEDIUM priority
Issue: Line ~30 — same pattern

### Unfreeze Protocol
1. Export current state | 2. Fix ONE file at a time
3. Verify auth guards | 4. Re-freeze immediately | 5. Test flows end-to-end

SCOPE LOCK: Create FROZEN_FILE_REMEDIATION.md ONLY`},

  {id:"p4_3",phaseId:4,seq:"4.3",title:"Redis Caching Utility",tool:"Base44 AI Builder",expMin:20,bypass:true,
   edit:["NEW: functions/lib/cache.ts"],freeze:["All existing files"],
   walkUp:["Prompt 4.2 verified","Upstash Redis credentials confirmed"],
   verify:["cache.ts exists in functions/lib/","cacheGet, cacheSet, cacheDelete exported","All Redis failures return null","Keys prefixed 'interact:'","No existing files modified"],
   orgInfo:"BYPASS ELIGIBLE if Upstash not yet provisioned. Keys: interact:{resource}:{id}.",
   prompt:`ROLE: Senior performance engineer — shared Redis caching utility.

CREATE functions/lib/cache.ts ONLY. Do NOT wire into existing functions yet.

const REDIS_URL = Deno.env.get('UPSTASH_REDIS_URL');
const REDIS_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_API_TOKEN');

async function redisCommand(command: string[]): Promise<any> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const r = await fetch(REDIS_URL, { method:'POST', headers:{ Authorization:'Bearer '+REDIS_TOKEN, 'Content-Type':'application/json' }, body:JSON.stringify(command) });
    if (!r.ok) return null;
    return (await r.json())?.result ?? null;
  } catch { return null; }
}

export async function cacheGet(key: string) { /* GET interact:{key} — parse JSON */ }
export async function cacheSet(key: string, value: any, ttl=60) { /* SETEX */ }
export async function cacheDelete(key: string) { /* DEL */ }

All failures return null. Keys prefixed 'interact:'.`},

  {id:"p5_1",phaseId:5,seq:"5.1",title:"Wire Admin + Facilitator + Participant Sidebars",tool:"Base44 AI Builder",expMin:30,bypass:false,
   edit:["src/Layout.jsx (sidebar configuration arrays only)"],
   freeze:["App.jsx","AuthProvider.jsx","RoleGate.jsx","All backend files"],
   walkUp:["Phase 4 STOP GATE passed","Layout.jsx Phase 0 snapshot confirmed","Feature inventory reviewed","Item counts: Admin=47, Facilitator=15, Participant=13"],
   verify:["Admin includes all 6 new pages","Facilitator includes 2 new pages","Participant includes 3-4 new pages","ALL existing items present + original order","New icons from lucide-react","Role logic unchanged","Counts: Admin=53, Facilitator=17, Participant=16-17"],
   orgInfo:"Count before AND after. Any discrepancy = rollback immediately. Pattern: { title, icon, path, component }.",
   prompt:`ROLE: Senior frontend architect — orphaned pages → sidebar navigation.

ADD TO ADMIN (6 pages):
• UserManagement → "User Management" group
• RoleManagement → "User Management" group
• RewardsAdmin → "Rewards" group
• IntegrationsAdmin → "Integrations" group
• FeedbackAdmin → "Engagement" group
• UserSegmentation → "Analytics" group

ADD TO FACILITATOR (2): ManagerOnboardingDashboard → "Onboarding" | TeamAutomations → "Team"
ADD TO PARTICIPANT (3-4): SocialHub → "Community" | KnowledgeHub → "Learning" | AIPersonalization → "Personal" | DawnHub → "Wellness" (only if functional)

Follow EXACT existing sidebar item pattern:
{ title:'User Management', icon:Users, path:'/user-management', component:'UserManagement' }

⚠ Do NOT remove existing items. Do NOT reorder. Verify page exists before adding.
SCOPE LOCK: src/Layout.jsx (sidebar configuration arrays only)`},

  {id:"p5_2",phaseId:5,seq:"5.2",title:"Wire Sub-Pages + Marketing Routes",tool:"Base44 AI Builder",expMin:25,bypass:false,
   edit:["src/App.jsx (route additions only)"],freeze:["Layout.jsx","AuthProvider.jsx","All backend files"],
   walkUp:["Prompt 5.1 verified","App.jsx Phase 0 routing snapshot confirmed"],
   verify:["All existing routes unchanged","Sub-page routes within authenticated section","Marketing routes in public section","No duplicate paths","App.jsx renders without errors"],
   orgInfo:"Public routes = no auth wrapper. Check Phase 0 snapshot for exact auth wrapper pattern.",
   prompt:`ROLE: Senior frontend architect — sub-page + marketing routes.

SUB-PAGES (authenticated group):
/events/:id → ParticipantEvent | /events/:id/facilitator → FacilitatorView
/events/create → EventWizard | /teams/:id → TeamDashboard
/users/:id → ExpandedUserProfile | /surveys/:id → SurveyDetail
/challenges/:id → ChallengeDetail | /onboarding/step/:step → OnboardingFlow
/recognition/:id → RecognitionDetail | /reports/:id → ReportDetail

MARKETING (public, no auth):
/features → Features | /about → About | /blog → Blog
/contact → Contact | /security → Security | /integrations → IntegrationsPage
/pricing → Pricing (skip if missing)

⚠ Do NOT modify existing routes. Do NOT change auth wrapper structure.
SCOPE LOCK: src/App.jsx (route additions only)`},

  {id:"p5_3",phaseId:5,seq:"5.3",title:"Landing Nav Links → Marketing Pages",tool:"Base44 AI Builder",expMin:15,bypass:false,
   edit:["src/pages/Landing.jsx (nav + footer only)"],freeze:["All other files"],
   walkUp:["Prompt 5.2 verified — marketing routes exist in App.jsx"],
   verify:["Nav includes Features, About, Blog, Contact, Security","Footer same","Links use React Router Link (not <a>)","All other Landing sections unchanged","Phase 2.5 + 3.1 fixes intact"],
   orgInfo:"5.2 routes must exist before these links will work.",
   prompt:`ROLE: Senior frontend engineer — Landing nav/footer links.

ADD TO NAV: Features → /features | About → /about | Blog → /blog | Contact → /contact | Security → /security
ADD SAME TO FOOTER. Keep existing CTAs.
Use React Router Link for internal routes (not raw <a> tags).

⚠ Do NOT touch: hero, features sections, social proof, SEO meta (Phase 3.1), or removed console.logs (Phase 2.5).
SCOPE LOCK: src/pages/Landing.jsx (nav + footer ONLY)`},

  {id:"p6_1",phaseId:6,seq:"6.1",title:"Admin Sidebar Collapsible Groups",tool:"Base44 AI Builder",expMin:40,bypass:false,
   edit:["src/Layout.jsx (admin sidebar section only)"],
   freeze:["App.jsx","AuthProvider.jsx","All backend files","Facilitator/participant sidebars"],
   walkUp:["Phase 5 complete + verified","Layout.jsx current state noted (53 admin items)","shadcn Collapsible confirmed: available at @/components/ui/collapsible","Total admin count: 53"],
   verify:["Admin item count = 53 (before AND after)","10 collapsible groups","Dashboard always expanded","Collapsible works in browser","State persists (localStorage: sidebar_groups)","Facilitator + participant sidebars UNCHANGED","No render errors"],
   orgInfo:"localStorage key: sidebar_groups. Add imports: Collapsible, CollapsibleTrigger, CollapsibleContent from @/components/ui/collapsible; ChevronDown from lucide-react.",
   prompt:`ROLE: Senior UX engineer — admin sidebar reorganization.

10 GROUPS:
1. Dashboard (always open): Dashboard, AdminHub
2. People: EmployeeDirectory, UserManagement, RoleManagement, RoleSecurity, Teams, OnboardingDashboard, MentorshipHub
3. Engagement: Activities, EventTemplates, Calendar, AIEventPlanner, Surveys, Milestones, FeedbackAdmin
4. Recognition: Recognition, RecognitionFeed, Challenges, TeamChallenges, TeamCompetition
5. Learning & Growth: LearningDashboard, SkillsDashboard, AIEnhancedCoaching, Channels
6. Gamification: GamificationDashboard, GamificationAdmin, GamificationSettings, GamificationAnalytics, Leaderboards, PointStore, RewardsStore, RewardsAdmin
7. Wellness: WellnessAdmin, WellnessAnalyticsReport
8. Analytics: Analytics, AdminAnalyticsDashboard, ReportBuilder, CustomReportBuilder, PredictiveAnalytics, AdvancedReportingSuite, RealTimeAnalytics, UserSegmentation
9. AI & Moderation: AIAdminDashboard, ContentModerationAdmin
10. System: IntegrationsHub, IntegrationsAdmin, AuditLog, Settings, ProjectPlan, Documentation

Persist state: const [openGroups, setOpenGroups] = useState(() => { try { return JSON.parse(localStorage.getItem('sidebar_groups') || '{}'); } catch { return {}; } });

⚠ Every existing item MUST still be present (53). Do NOT touch facilitator/participant sidebars.`},

  {id:"p7_1",phaseId:7,seq:"7.1",title:"Role-Based QA Checklist Generation",tool:"Claude Desktop/Chrome",expMin:30,bypass:false,
   edit:["GENERATE ONLY — no code edits"],freeze:["All files"],
   walkUp:["Phase 6 STOP GATE passed + visual inspection done","App running in browser","3 test accounts ready (admin, facilitator, participant)","DevTools open"],
   verify:["Three checklists generated","Each has 5 sections: Auth, Nav, Flows, Security, Public","Each item has expected behavior","Saved locally before 7.2"],
   orgInfo:"Use real test accounts. Network tab for PII check. Rapid-fire for rate limit test.",
   prompt:`ROLE: QA Lead — role-based test checklists.

THREE CHECKLISTS (Admin / Facilitator / Participant):
A. Auth & Role: login, role detected, correct sidebar, wrong pages blocked
B. Navigation: every sidebar item loads, no blank screens, collapsible groups work
C. Critical Flows:
   ADMIN: EmployeeDirectory, invite user, suspend user, AuditLog, analytics, GamificationAdmin, WellnessAdmin, UserManagement, RoleManagement
   FACILITATOR: Dashboard, create events (CREATE_EVENTS perm), team analytics (VIEW_ANALYTICS perm), cannot access /admin-hub, ManagerOnboardingDashboard, TeamAutomations
   PARTICIPANT: Dashboard, submit survey, send recognition, join challenge (fixed), redeem reward (fixed), RecognitionFeed, cannot access admin, SocialHub, KnowledgeHub
D. Security: rate limiting, no console.log in DevTools, error boundary works, PII not in network
E. Public: Landing, /privacy, /terms, marketing nav, footer links, SEO tags`},

  {id:"p7_2",phaseId:7,seq:"7.2",title:"47-Issue Regression Verification",tool:"Claude Desktop/Chrome",expMin:45,bypass:false,
   edit:["VERIFY ONLY"],freeze:["All files"],
   walkUp:["7.1 checklists saved","App running","All test accounts available"],
   verify:["47-item list with PASS/FAIL/DEFERRED for each","44 PASS, 3 DEFERRED (documented)","Any FAILs logged for immediate fix","Final status report saved"],
   orgInfo:"DEFERRED = PASS if FROZEN_FILE_REMEDIATION.md exists and documents it.",
   prompt:`ROLE: QA Engineer — regression verification on all 47 issues.

🔴 BLOCKERS (12): rbacMiddleware Redis rate limiter, inviteUser throws on missing URL, completeChallengeTracking body parsed once, redeemReward available_points, redeemReward parse order, enforceDefaultRole no PII log, middleware zero console.log/error, suspendUser DEFERRED, recordPointsTransaction structured error, OWNER_EMAILS from env, awardPoints single header, createNotification DEFERRED

🟡 WARNINGS (21): createSmartNotification structured catch, purchaseWithPoints 0-cost, inviteUser isOwner import, completeChallengeTracking asServiceRole×2, recordPointsTransaction 400, awardPoints badge filter + no double-log, aiGovernance/logError loggingError vars, enforceDefaultRole user_type + 405, Landing fixes×7

🔵 IMPROVEMENTS (14): ErrorBoundary SDK invoke, SEO tags, healthCheck, Privacy, Terms, robots.txt, cache.ts, FROZEN_FILE_REMEDIATION.md, aiGovernance default key, page wiring + sidebar restructure`},

  {id:"p8_1",phaseId:8,seq:"8.1",title:"Update Project Documentation",tool:"Claude Desktop",expMin:30,bypass:false,
   edit:["DOCUMENTATION ONLY"],freeze:["All code files"],
   walkUp:["All phases complete + verified","Phase 7 regression finalized"],
   verify:["CHANGELOG [1.1.0] generated","Issue count summary generated","Navigation inventory generated"],
   orgInfo:"Version: 1.1.0. Date: 2026-03-09. Next: Supabase migration planning.",
   prompt:`ROLE: Technical writer — post-remediation documentation.

1. CHANGELOG [1.1.0] - 2026-03-09:
Security: Redis rate limiter, double-spend fix (available_points), PII removed from 8 files, body double-read fix, OWNER_EMAILS from env, validateEnv utility, HTTP method guard, SDK @0.8.6
Fixed: ErrorBoundary SDK invoke, user_type for all signups, 0-cost premium items, 400 on insufficient balance, variable shadowing, awardPoints duplicate + double-logging
Added: healthCheck, Privacy, Terms, cache.ts, robots.txt, SEO meta, 11 pages wired, ~17 new routes, 10 collapsible admin groups, FROZEN_FILE_REMEDIATION.md

2. Issue counts: BEFORE 47 (12+21+14) → AFTER 44 resolved, 3 deferred

3. Navigation: Admin 53 in 10 groups | Facilitator 17 | Participant 16-17 | Routes ~80+`},
];

// ─────────────────────────────────────────────────────────────────
//  LAYOUT ENGINE
// ─────────────────────────────────────────────────────────────────
const PH_W=560,PH_H=58,PH_X=50,PR_W=500,PR_H=46,PR_X=78,GS=26;

function computeLayout(exp) {
  const nodes=[],edges=[];
  let y=28;
  const exits={};
  PHASES.forEach((ph,pi)=>{
    const pid=`ph_${ph.id}`,mid=PH_X+PH_W/2;
    nodes.push({id:pid,type:'phase',x:PH_X,y,w:PH_W,h:PH_H,topCx:mid,topCy:y,botCx:mid,botCy:y+PH_H,data:ph});
    let lastId=pid,lastCx=mid,lastCy=y+PH_H;
    y+=PH_H;
    const prs=PROMPTS.filter(p=>p.phaseId===ph.id);
    if(exp[ph.id]&&prs.length){
      y+=8;
      prs.forEach(pr=>{
        const pcx=PR_X+PR_W/2;
        nodes.push({id:pr.id,type:'prompt',x:PR_X,y,w:PR_W,h:PR_H,topCx:pcx,topCy:y,botCx:pcx,botCy:y+PR_H,data:pr});
        edges.push({from:lastId,fCx:lastCx,fCy:lastCy,to:pr.id,tCx:pcx,tCy:y});
        lastId=pr.id;lastCx=pcx;lastCy=y+PR_H;y+=PR_H+8;
      });
    }
    y+=14;
    if(ph.stop){
      const gid=`gate_${ph.id}`;
      nodes.push({id:gid,type:'gate',cx:mid,cy:y+GS,size:GS,topCx:mid,topCy:y,botCx:mid,botCy:y+GS*2,data:{phaseId:ph.id}});
      edges.push({from:lastId,fCx:lastCx,fCy:lastCy,to:gid,tCx:mid,tCy:y});
      lastId=gid;lastCx=mid;lastCy=y+GS*2;y+=GS*2+18;
    }
    exits[ph.id]={id:lastId,cx:lastCx,cy:lastCy};
    y+=8;
  });
  PHASES.slice(0,-1).forEach((ph,i)=>{
    const ex=exits[ph.id],nxt=nodes.find(n=>n.id===`ph_${PHASES[i+1].id}`);
    if(ex&&nxt) edges.push({from:ex.id,fCx:ex.cx,fCy:ex.cy,to:nxt.id,tCx:nxt.topCx,tCy:nxt.topCy});
  });
  return{nodes,edges,totalH:y+28};
}

// ─────────────────────────────────────────────────────────────────
//  HOOKS + HELPERS
// ─────────────────────────────────────────────────────────────────
function useWindowWidth(){
  const[w,setW]=useState(()=>typeof window!=='undefined'?window.innerWidth:900);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[]);
  return w;
}

const fmt=ms=>{if(!ms)return'00:00:00';const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;return[h,m,sc].map(v=>String(v).padStart(2,'0')).join(':');};
const fmtMin=ms=>ms?`${Math.floor(ms/60000)}m`:'—';

const AI_SYS=`You are the INTeract remediation assistant for Kyle at Intinc.
PLATFORM: INTeract employee engagement SaaS (Base44 / React 18 / Vite / shadcn/ui)
FROZEN FILES (never edit): suspendUser.js, deleteUser.js, createNotification.js, AuthProvider.jsx, RoleGate.jsx
CRITICAL FILES: rbacMiddleware.ts, middleware.js, aiGovernance.ts, Layout.jsx, App.jsx
ENV: OWNER_EMAILS, BASE44_APP_URL, UPSTASH_REDIS_URL, UPSTASH_REDIS_REST_API_TOKEN (Base44 secrets)
ROLE HIERARCHY: owner > admin > ops > hr > team_lead > facilitator > participant > employee
COMMON FAILURES: (1) Frozen file edited → revert Phase 0 snapshot. (2) App won't load → revert Layout.jsx+App.jsx. (3) Auth broken → AuthProvider.jsx should be untouched. (4) Missing env vars → check Base44 secrets panel. (5) PII in logs → replace console.log/error with AuditLog structured writes.
Be concise. Kyle is mid-task. Lead with most likely fix. Exhaust current-phase options before suggesting rollback.`;

const SKEY='interact-remediation-v1';

function quickQuestions(pr){
  const ph=PHASES.find(p=>p.id===pr.phaseId);
  return[
    {label:`Why ${ph?.risk||'?'} risk?`,q:`Why is Prompt ${pr.seq} (${pr.title}) classified ${ph?.risk} risk? What's the worst case if it goes wrong?`},
    {label:'Rollback plan?',q:`For Prompt ${pr.seq} (${pr.title}): if something breaks, what exactly do I revert and in what order?`},
    {label:'Key verify check?',q:`For Prompt ${pr.seq} (${pr.title}): what's the single most important verification item and how do I check it quickly?`},
    {label:'Common mistakes?',q:`What are common mistakes when running Prompt ${pr.seq} (${pr.title})? What should I watch out for?`},
  ];
}

// ─────────────────────────────────────────────────────────────────
//  REUSABLE UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────
function Accordion({label,labelColor,open,onToggle,children,badge,defaultOpen}){
  const lc = labelColor || '#94a3b8';
  const doOpen = defaultOpen || false;
  const[isOpen,setIsOpen]=useState(doOpen||open);
  const controlled=open!==undefined;
  const shown=controlled?open:isOpen;
  return(
    <div style={{border:'1px solid #1e293b',borderRadius:6,overflow:'hidden',marginBottom:6}}>
      <div onClick={()=>{if(controlled){if(onToggle)onToggle();}else setIsOpen(v=>!v);}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 12px',background:'#1e293b88',cursor:'pointer',userSelect:'none'}}>
        <span style={{color:lc,fontWeight:700,fontSize:11,display:'flex',alignItems:'center',gap:6}}>{label}{badge&&<span style={{background:lc+'33',color:lc,borderRadius:10,padding:'1px 7px',fontSize:10}}>{badge}</span>}</span>
        <span style={{color:'#475569',fontSize:10,transform:shown?'rotate(180deg)':'none',transition:'transform 0.2s',display:'inline-block'}}>▼</span>
      </div>
      {shown&&<div style={{padding:'8px 12px'}}>{children}</div>}
    </div>
  );
}

function Checklist({items,prefix,checked,onToggle,doneColor,pendingColor}){
  const dc = doneColor || '#10b981';
  const pc = pendingColor || '#94a3b8';
  return(
    <div>{items.map((item,i)=>{
      const k=`${prefix}_${i}`,done=checked[k];
      return(
        <div key={i} onClick={()=>onToggle(k,!done)} style={{display:'flex',gap:8,alignItems:'flex-start',cursor:'pointer',marginBottom:5,padding:'3px 0'}}>
          <span style={{flexShrink:0,fontSize:14,lineHeight:1.2,color:done?dc:'#334155',transition:'color 0.15s'}}>{done?'✓':'○'}</span>
          <span style={{fontSize:12,lineHeight:1.5,color:done?dc:pc,textDecoration:done?'line-through':'none',transition:'all 0.15s'}}>{item}</span>
        </div>
      );
    })}</div>
  );
}

function StatusPill({status}){
  const c=SC(status);
  const labels={todo:'Todo',active:'Active',done:'Done',blocked:'Blocked',skipped:'Skipped'};
  return<span style={{background:c+'22',color:c,border:`1px solid ${c}44`,borderRadius:10,padding:'2px 8px',fontSize:10,fontWeight:700}}>{labels[status]||'Todo'}</span>;
}

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function App(){
  const w=useWindowWidth();
  const isWide=w>780;
  const isMobile=w<540;

  // Core state
  const[expanded,setExpanded]=useState({0:true});
  const[status,setStatus]=useState({});
  const[sel,setSel]=useState(null);
  const[mobileView,setMobileView]=useState('canvas'); // 'canvas'|'panel'
  const[tab,setTab]=useState('details');
  // Session
  const[sessOn,setSessOn]=useState(false);
  const[sessStart,setSessStart]=useState(null);
  const[elapsed,setElapsed]=useState(0);
  const[nStarts,setNStarts]=useState({});
  const[nEnds,setNEnds]=useState({});
  // Checklists
  const[wuCheck,setWuCheck]=useState({});
  const[vCheck,setVCheck]=useState({});
  // Notes
  const[notes,setNotes]=useState({});
  const[log,setLog]=useState([]);
  // Modals
  const[bypass,setBypass]=useState(null);
  const[bypassReason,setBypassReason]=useState('');
  const[dsAlert,setDsAlert]=useState(null);
  // AI chat (tab)
  const[aiMsgs,setAiMsgs]=useState([]);
  const[aiIn,setAiIn]=useState('');
  const[aiLoad,setAiLoad]=useState(false);
  // Inline AI (embedded in Details)
  const[inlineAiResp,setInlineAiResp]=useState({});
  const[inlineAiIn,setInlineAiIn]=useState('');
  const[inlineAiLoad,setInlineAiLoad]=useState(false);
  // Canvas transform
  const[tx,setTx]=useState({x:20,y:18,k:1});
  const[panning,setPanning]=useState(false);
  const panRef=useRef(null);
  const svgRef=useRef(null);
  const aiEndRef=useRef(null);

  const{nodes,edges,totalH}=useMemo(()=>computeLayout(expanded),[expanded]);
  const selPr=PROMPTS.find(p=>p.id===sel);

  // Storage load
  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.get(SKEY);if(r){const d=JSON.parse(r.value);
        if(d.status) setStatus(d.status);if(d.notes) setNotes(d.notes);if(d.log) setLog(d.log);
        if(d.expanded) setExpanded(d.expanded);if(d.nStarts) setNStarts(d.nStarts);
        if(d.nEnds) setNEnds(d.nEnds);if(d.wuCheck) setWuCheck(d.wuCheck);
        if(d.vCheck) setVCheck(d.vCheck);if(d.inlineAiResp) setInlineAiResp(d.inlineAiResp);
      }}catch{}
    })();
  },[]);

  const save=useCallback((patch={})=>{
    const d={status,notes,log,expanded,nStarts,nEnds,wuCheck,vCheck,inlineAiResp,...patch};
    window.storage.set(SKEY,JSON.stringify(d)).catch(()=>{});
  },[status,notes,log,expanded,nStarts,nEnds,wuCheck,vCheck,inlineAiResp]);

  // Session timer
  useEffect(()=>{
    if(!sessOn)return;
    const id=setInterval(()=>setElapsed(Date.now()-sessStart),1000);
    return()=>clearInterval(id);
  },[sessOn,sessStart]);

  // Wheel zoom
  useEffect(()=>{
    const el=svgRef.current;if(!el)return;
    const h=e=>{e.preventDefault();const d=-e.deltaY*0.001;setTx(t=>({...t,k:Math.max(0.25,Math.min(3,t.k*(1+d)))}));};
    el.addEventListener('wheel',h,{passive:false});
    return()=>el.removeEventListener('wheel',h);
  },[]);

  const applyStatus=(id,ns)=>{
    const now=Date.now(),ns2={...nStarts},ne2={...nEnds};
    if(ns==='active'&&!ns2[id])ns2[id]=now;
    if(['done','skipped'].includes(ns))ne2[id]=now;
    const st2={...status,[id]:ns};
    const lg2=[...log,{t:now,id,action:`→ ${ns}`}];
    setStatus(st2);setNStarts(ns2);setNEnds(ne2);setLog(lg2);
    save({status:st2,nStarts:ns2,nEnds:ne2,log:lg2});
  };

  const setNodeStatus=(id,ns)=>{
    if(ns==='done'){
      const allIds=PROMPTS.map(p=>p.id),idx=allIds.indexOf(id);
      const aff=allIds.slice(idx+1).filter(d=>['active','done'].includes(status[d]));
      if(aff.length){setDsAlert({id,ns,aff});return;}
    }
    applyStatus(id,ns);
  };

  const toggleExpand=(phaseId)=>{
    const nv={...expanded,[phaseId]:!expanded[phaseId]};
    setExpanded(nv);save({expanded:nv});
  };

  // AI tab send
  const sendAI=async()=>{
    if(!aiIn.trim()||aiLoad)return;
    const um={role:'user',content:aiIn};
    const msgs=[...aiMsgs,um];
    setAiMsgs(msgs);setAiIn('');setAiLoad(true);
    const ctx=selPr?`\nActive node: Prompt ${selPr.seq} — ${selPr.title}\nScope: ${(selPr.edit||[]).join(', ')}`:'';
    try{
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,system:AI_SYS+ctx,messages:msgs.map(m=>({role:m.role,content:m.content}))})});
      const d=await r.json();
      const text=d.content?.find(b=>b.type==='text')?.text||'No response.';
      setAiMsgs(m=>[...m,{role:'assistant',content:text}]);
    }catch(e){setAiMsgs(m=>[...m,{role:'assistant',content:'Error: '+e.message}]);}
    setAiLoad(false);
    setTimeout(()=>aiEndRef.current?.scrollIntoView({behavior:'smooth'}),100);
  };

  // Inline AI send (embedded in Details)
  const sendInlineAI=async(question)=>{
    if(!selPr||inlineAiLoad)return;
    setInlineAiLoad(true);
    const ctx=`Prompt ${selPr.seq}: ${selPr.title}\nTool: ${selPr.tool}\nScope edit: ${(selPr.edit||[]).join(', ')}\nFreeze: ${(selPr.freeze||[]).join(', ')}\nPhase: ${PHASES.find(p=>p.id===selPr.phaseId)?.title} (${PHASES.find(p=>p.id===selPr.phaseId)?.risk} risk)`;
    try{
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,system:AI_SYS,messages:[{role:'user',content:`Context:\n${ctx}\n\nQuestion: ${question}`}]})});
      const d=await r.json();
      const text=d.content?.find(b=>b.type==='text')?.text||'No response.';
      const newResp={...inlineAiResp,[selPr.id]:{q:question,a:text}};
      setInlineAiResp(newResp);save({inlineAiResp:newResp});
    }catch(e){
      const newResp={...inlineAiResp,[selPr.id]:{q:question,a:'Error: '+e.message}};
      setInlineAiResp(newResp);
    }
    setInlineAiLoad(false);
  };

  // Stats
  const doneCount=PROMPTS.filter(p=>status[p.id]==='done').length;
  const pct=Math.round(doneCount/PROMPTS.length*100);
  const nodeEl=id=>nStarts[id]?Math.floor(((nEnds[id]||Date.now())-nStarts[id])/60000):null;
  const isOT=id=>{const pr=PROMPTS.find(p=>p.id===id);if(!pr||status[id]!=='active'||!nStarts[id])return false;return(Date.now()-nStarts[id])>pr.expMin*120000;};

  // ── SVG RENDERERS ──────────────────────────────────
  const renderEdge=(e,i)=>{
    const my=(e.fCy+e.tCy)/2;
    return<path key={i} d={`M${e.fCx},${e.fCy} C${e.fCx},${my} ${e.tCx},${my} ${e.tCx},${e.tCy}`} fill="none" stroke="#1e3a5f" strokeWidth={1.5} markerEnd="url(#arr)"/>;
  };

  const renderPhase=(n)=>{
    const ph=n.data,rc=RC(ph.risk),isSel=sel===n.id;
    const prs=PROMPTS.filter(p=>p.phaseId===ph.id);
    const dn=prs.filter(p=>['done','skipped'].includes(status[p.id])).length;
    const isExp=expanded[ph.id];
    return(
      <g key={n.id}>
        {/* Clickable header rect */}
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={7} fill={isSel?'#1e3a5f':'#111827'} stroke={isSel?'#3b82f6':rc} strokeWidth={isSel?1.5:1} style={{cursor:'pointer'}} onClick={e=>{e.stopPropagation();setSel(n.id);setTab('details');if(isMobile)setMobileView('panel');}}/>
        {/* Left accent bar */}
        <rect x={n.x} y={n.y+4} width={4} height={n.h-8} rx={2} fill={rc} style={{pointerEvents:'none'}}/>
        {/* Phase label */}
        <text x={n.x+18} y={n.y+21} fill="white" fontSize={13} fontWeight="700" fontFamily="system-ui" style={{pointerEvents:'none'}}>Phase {ph.id}: {ph.title}</text>
        <text x={n.x+18} y={n.y+39} fill={rc} fontSize={10} fontFamily="system-ui" style={{pointerEvents:'none'}}>{ph.risk} RISK • {ph.time} • {ph.tool}</text>
        {/* Progress */}
        <text x={n.x+n.w-52} y={n.y+32} fill="#475569" fontSize={11} textAnchor="middle" fontFamily="system-ui" style={{pointerEvents:'none'}}>{dn}/{prs.length}</text>
        {/* Stop label */}
        {ph.stop&&<text x={n.x+n.w-105} y={n.y+42} fill="#f59e0b" fontSize={8} fontFamily="system-ui" style={{pointerEvents:'none'}}>⏸ STOP AFTER</text>}
        {/* Chevron toggle — separate click target */}
        <g onClick={e=>{e.stopPropagation();toggleExpand(ph.id);}} style={{cursor:'pointer'}}>
          <rect x={n.x+n.w-36} y={n.y+12} width={28} height={28} rx={5} fill="#1e293b"/>
          <text x={n.x+n.w-22} y={n.y+30} fill="#64748b" fontSize={13} textAnchor="middle" style={{userSelect:'none',transform:isExp?`rotate(180deg)`:'none',transformOrigin:`${n.x+n.w-22}px ${n.y+26}px`,transition:'transform 0.2s'}}>▼</text>
        </g>
      </g>
    );
  };

  const renderPrompt=(n)=>{
    const pr=n.data,sc=SC(status[pr.id]),isSel=sel===pr.id,ot=isOT(pr.id);
    const el=nodeEl(pr.id);
    return(
      <g key={n.id} onClick={e=>{e.stopPropagation();setSel(pr.id);setTab('details');if(isMobile)setMobileView('panel');}} style={{cursor:'pointer'}}>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} fill={isSel?'#1e3a5f':'#0f172a'} stroke={isSel?'#3b82f6':sc+'66'} strokeWidth={isSel?1.5:1}/>
        <rect x={n.x} y={n.y+3} width={4} height={n.h-6} rx={2} fill={sc}/>
        <text x={n.x+18} y={n.y+18} fill="#64748b" fontSize={10} fontWeight="700" fontFamily="system-ui">{pr.seq}</text>
        <text x={n.x+18} y={n.y+32} fill="#334155" fontSize={9} fontFamily="system-ui">{pr.tool.split(' ')[0]}</text>
        <text x={n.x+60} y={n.y+27} fill={isSel?'#93c5fd':'#cbd5e1'} fontSize={12} fontFamily="system-ui">{pr.title}</text>
        {pr.bypass&&<text x={n.x+n.w-74} y={n.y+32} fill="#334155" fontSize={9} fontFamily="system-ui">bypassable</text>}
        {el!==null&&<text x={n.x+n.w-84} y={n.y+18} fill="#475569" fontSize={9} fontFamily="system-ui">{el}m</text>}
        <circle cx={n.x+n.w-16} cy={n.y+n.h/2} r={5} fill={sc}/>
        {ot&&<circle cx={n.x+n.w-16} cy={n.y+n.h/2} r={9} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2"/>}
      </g>
    );
  };

  const renderGate=(n)=>{
    const prs=PROMPTS.filter(p=>p.phaseId===n.data.phaseId);
    const allDone=prs.every(p=>['done','skipped'].includes(status[p.id]));
    const gc=allDone?'#15803d':'#f59e0b';
    return(
      <g key={n.id} onClick={e=>e.stopPropagation()} style={{cursor:'default'}}>
        <polygon points={`${n.cx},${n.cy-n.size} ${n.cx+n.size},${n.cy} ${n.cx},${n.cy+n.size} ${n.cx-n.size},${n.cy}`} fill="#0f172a" stroke={gc} strokeWidth={1.5}/>
        <text x={n.cx} y={n.cy-7} fill={gc} fontSize={8} textAnchor="middle" fontWeight="700" fontFamily="system-ui">STOP GATE</text>
        <text x={n.cx} y={n.cy+4} fill="#475569" fontSize={8} textAnchor="middle" fontFamily="system-ui">{allDone?'✓ PASSED':'⏸ VERIFY'}</text>
        <text x={n.cx} y={n.cy+13} fill="#334155" fontSize={7} textAnchor="middle" fontFamily="system-ui">Ph {n.data.phaseId}</text>
      </g>
    );
  };

  // ── CANVAS VIEW ────────────────────────────────────
  const CanvasView=(props)=>{
    const style = (props && props.style) ? props.style : {};
    return (<div style={{position:'relative',overflow:'hidden',background:'#030712',...style}}>
      {/* Toolbar */}
      <div style={{position:'absolute',top:8,left:8,zIndex:10,display:'flex',gap:4,flexWrap:'wrap'}}>
        {[['＋',()=>setTx(t=>({...t,k:Math.min(3,t.k*1.2)}))],['－',()=>setTx(t=>({...t,k:Math.max(0.25,t.k*0.8)}))],['⌂',()=>setTx({x:20,y:18,k:1})],['Fit',()=>setTx({x:20,y:18,k:0.62})]].map(([l,f])=>(
          <button key={l} onClick={f} style={{padding:'3px 8px',background:'#1e293bcc',border:'1px solid #334155',borderRadius:4,color:'#94a3b8',fontSize:11,cursor:'pointer',backdropFilter:'blur(4px)'}}>{l}</button>
        ))}
        <button onClick={()=>{const all={};PHASES.forEach(p=>all[p.id]=true);setExpanded(all);save({expanded:all});}} style={{padding:'3px 8px',background:'#1e293bcc',border:'1px solid #334155',borderRadius:4,color:'#60a5fa',fontSize:11,cursor:'pointer'}}>Expand All</button>
        <button onClick={()=>{setExpanded({});save({expanded:{}});}} style={{padding:'3px 8px',background:'#1e293bcc',border:'1px solid #334155',borderRadius:4,color:'#64748b',fontSize:11,cursor:'pointer'}}>Collapse</button>
      </div>
      <svg ref={svgRef} width="100%" height="100%"
        onMouseDown={e=>{if(e.button===1||(e.button===0&&e.altKey)){e.preventDefault();setPanning(true);panRef.current={x:e.clientX-tx.x,y:e.clientY-tx.y};}}}
        onMouseMove={e=>{if(!panning||!panRef.current)return;setTx(t=>({...t,x:e.clientX-panRef.current.x,y:e.clientY-panRef.current.y}));}}
        onMouseUp={()=>setPanning(false)} onMouseLeave={()=>setPanning(false)}
        style={{cursor:panning?'grabbing':'default'}} onClick={()=>setSel(null)}
      >
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#1e3a5f"/>
          </marker>
        </defs>
        <g transform={`translate(${tx.x},${tx.y}) scale(${tx.k})`}>
          {edges.map(renderEdge)}
          {nodes.map(n=>{
            if(n.type==='phase')return renderPhase(n);
            if(n.type==='prompt')return renderPrompt(n);
            if(n.type==='gate')return renderGate(n);
            return null;
          })}
        </g>
      </svg>
      {/* Legend */}
      <div style={{position:'absolute',bottom:8,right:8,background:'#0f172acc',border:'1px solid #1e293b',borderRadius:6,padding:'5px 10px',fontSize:10,color:'#475569',display:'flex',gap:8,flexWrap:'wrap',backdropFilter:'blur(4px)'}}>
        {[['Active','#7c3aed'],['Done','#15803d'],['Blocked','#dc2626'],['Skipped','#f59e0b'],['Todo','#475569']].map(([l,c])=>(
          <span key={l} style={{display:'flex',alignItems:'center',gap:3}}><span style={{width:7,height:7,borderRadius:'50%',background:c,display:'inline-block'}}/>{l}</span>
        ))}
        <span style={{color:'#1e293b'}}>|</span>
        <span>Scroll=Zoom • Alt+Drag=Pan • Click▼=Expand</span>
      </div>
    </div>
    );
  };

  // ── DETAILS TAB ────────────────────────────────────
  const DetailsContent=()=>{
    if(!selPr)return(
      <div style={{padding:'32px 16px',textAlign:'center',color:'#334155',fontFamily:'system-ui'}}>
        <div style={{fontSize:32,marginBottom:12}}>↑</div>
        <div style={{fontSize:13,marginBottom:6}}>Select a prompt node on the canvas</div>
        <div style={{fontSize:11,color:'#1e3a5f'}}>or tap a phase to see phase info</div>
      </div>
    );
    const pr=selPr,ph=PHASES.find(p=>p.id===pr.phaseId);
    const wuD=pr.walkUp.filter((_,i)=>wuCheck[`${pr.id}_w_${i}`]).length;
    const vD=pr.verify.filter((_,i)=>vCheck[`${pr.id}_v_${i}`]).length;
    const allVDone=vD===pr.verify.length&&pr.verify.length>0;
    const el=nodeEl(pr.id);
    const iai=inlineAiResp[pr.id];

    const stBtn=(s,label,color)=>(
      <button onClick={()=>{if(s==='skipped'&&pr.bypass){setBypass(pr.id);setBypassReason('');return;}setNodeStatus(pr.id,s);}} style={{padding:'5px 10px',background:color+'22',border:`1px solid ${color}55`,borderRadius:4,color,fontSize:11,cursor:'pointer',fontFamily:'system-ui',fontWeight:600}}>
        {label}
      </button>
    );

    return(
      <div style={{padding:'8px 10px',fontSize:12,fontFamily:'system-ui',color:'#cbd5e1'}}>
        {/* Header card */}
        <div style={{background:'#111827',borderRadius:8,padding:'10px 12px',marginBottom:8,border:`1px solid ${RC(ph?.risk||'NONE')}33`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
            <div>
              <span style={{color:'#475569',fontSize:10,display:'block',marginBottom:2}}>Prompt {pr.seq} • {pr.tool}</span>
              <span style={{color:'#f1f5f9',fontWeight:700,fontSize:14}}>{pr.title}</span>
            </div>
            <div style={{textAlign:'right',flexShrink:0,marginLeft:8}}>
              <StatusPill status={status[pr.id]||'todo'}/>
              <div style={{color:'#475569',fontSize:10,marginTop:3}}>{el!==null?`${el}m elapsed`:`${pr.expMin}m est`}</div>
            </div>
          </div>
          {/* Status buttons */}
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:8}}>
            {stBtn('active','▶ Active','#7c3aed')}
            {stBtn('done','✓ Done','#15803d')}
            {stBtn('blocked','✗ Blocked','#dc2626')}
            {stBtn('todo','○ Reset','#475569')}
            {pr.bypass&&stBtn('skipped','↷ Skip','#f59e0b')}
          </div>
          {allVDone&&<div style={{marginTop:8,padding:'5px 10px',background:'#15803d22',border:'1px solid #15803d44',borderRadius:4,color:'#4ade80',fontSize:11,fontWeight:700}}>✓ All verification passed — safe to mark Done</div>}
        </div>

        {/* Scope */}
        <Accordion label="Scope" labelColor="#10b981" defaultOpen={true}>
          <div style={{color:'#6ee7b7',fontSize:10,fontWeight:700,marginBottom:3}}>EDIT ONLY</div>
          {(pr.edit||[]).map((f,i)=><div key={i} style={{color:'#a7f3d0',fontSize:11,fontFamily:'monospace',padding:'2px 0'}}>• {f}</div>)}
          <div style={{color:'#fca5a5',fontSize:10,fontWeight:700,margin:'8px 0 3px'}}>FREEZE LIST</div>
          {(pr.freeze||[]).map((f,i)=><div key={i} style={{color:'#fca5a5',fontSize:11,fontFamily:'monospace',padding:'2px 0'}}>• {f}</div>)}
        </Accordion>

        {/* Walk-up checklist */}
        <Accordion label="Walk-up checklist" labelColor="#60a5fa" badge={`${wuD}/${pr.walkUp.length}`} defaultOpen={wuD<pr.walkUp.length}>
          <Checklist items={pr.walkUp} prefix={`${pr.id}_w`} checked={wuCheck} onToggle={(k,v)=>{const nv={...wuCheck,[k]:v};setWuCheck(nv);save({wuCheck:nv});}}/>
        </Accordion>

        {/* Prompt text */}
        <Accordion label="Prompt text" labelColor="#a78bfa" defaultOpen={false}>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}>
            <button onClick={()=>navigator.clipboard.writeText(pr.prompt)} style={{padding:'3px 10px',background:'#7c3aed22',border:'1px solid #7c3aed44',borderRadius:4,color:'#a78bfa',fontSize:10,cursor:'pointer',fontFamily:'system-ui'}}>📋 Copy full prompt</button>
          </div>
          <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-word',color:'#94a3b8',fontSize:11,fontFamily:'monospace',margin:0,lineHeight:1.6,maxHeight:340,overflowY:'auto'}}>{pr.prompt}</pre>
        </Accordion>

        {/* Verification */}
        <Accordion label="Verification checklist" labelColor="#34d399" badge={`${vD}/${pr.verify.length}`} defaultOpen={true}>
          <Checklist items={pr.verify} prefix={`${pr.id}_v`} checked={vCheck} onToggle={(k,v)=>{const nv={...vCheck,[k]:v};setVCheck(nv);save({vCheck:nv});}} doneColor="#34d399"/>
        </Accordion>

        {/* EMBEDDED AI HELP */}
        <Accordion label="🤖 AI help for this step" labelColor="#c084fc" defaultOpen={false}>
          {/* Quick questions */}
          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
            {quickQuestions(pr).map(({label,q})=>(
              <button key={label} onClick={()=>{setInlineAiIn('');sendInlineAI(q);}} style={{padding:'4px 8px',background:'#7c3aed22',border:'1px solid #7c3aed44',borderRadius:4,color:'#c084fc',fontSize:10,cursor:'pointer',fontFamily:'system-ui'}}>
                {label}
              </button>
            ))}
          </div>
          {/* Response area */}
          {(iai||inlineAiLoad)&&(
            <div style={{background:'#0f172a',border:'1px solid #7c3aed33',borderRadius:6,padding:'10px 12px',marginBottom:8}}>
              {inlineAiLoad&&!iai&&<span style={{color:'#7c3aed',fontSize:11}}>Thinking…</span>}
              {iai&&(
                <>
                  <div style={{color:'#7c3aed',fontSize:10,marginBottom:4,fontWeight:700}}>Q: {iai.q.length>80?iai.q.slice(0,78)+'…':iai.q}</div>
                  <div style={{color:'#cbd5e1',fontSize:11,whiteSpace:'pre-wrap',lineHeight:1.6,maxHeight:200,overflowY:'auto'}}>{iai.a}</div>
                  <button onClick={()=>{const nv={...inlineAiResp};delete nv[pr.id];setInlineAiResp(nv);}} style={{marginTop:6,padding:'2px 8px',background:'transparent',border:'1px solid #334155',borderRadius:3,color:'#475569',fontSize:10,cursor:'pointer'}}>Clear</button>
                </>
              )}
            </div>
          )}
          {/* Custom question */}
          <div style={{display:'flex',gap:6}}>
            <input value={inlineAiIn} onChange={e=>setInlineAiIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&inlineAiIn.trim()&&sendInlineAI(inlineAiIn)} placeholder="Ask anything about this step…" style={{flex:1,padding:'6px 8px',background:'#0f172a',border:'1px solid #334155',borderRadius:4,color:'#e2e8f0',fontSize:11,fontFamily:'system-ui',outline:'none'}}/>
            <button onClick={()=>inlineAiIn.trim()&&sendInlineAI(inlineAiIn)} disabled={inlineAiLoad} style={{padding:'6px 12px',background:'#7c3aed',border:'none',borderRadius:4,color:'white',fontSize:11,cursor:'pointer',fontFamily:'system-ui',fontWeight:600}}>Ask</button>
          </div>
          <div style={{marginTop:8,borderTop:'1px solid #1e293b',paddingTop:6}}>
            <button onClick={()=>setTab('ai')} style={{padding:'4px 10px',background:'transparent',border:'1px solid #334155',borderRadius:4,color:'#64748b',fontSize:10,cursor:'pointer',fontFamily:'system-ui'}}>Open full AI chat →</button>
          </div>
        </Accordion>

        {/* Org info */}
        {pr.orgInfo&&(
          <Accordion label="Org-specific info" labelColor="#fbbf24" defaultOpen={false}>
            <div style={{color:'#fde68a',fontSize:12,lineHeight:1.6}}>{pr.orgInfo}</div>
          </Accordion>
        )}
      </div>
    );
  };

  // ── AI CHAT TAB ────────────────────────────────────
  const AITab=()=>(
    <div style={{display:'flex',flexDirection:'column',height:'100%',fontFamily:'system-ui'}}>
      <div style={{padding:'6px 12px',background:'#111827',borderBottom:'1px solid #1e293b',fontSize:10,color:'#475569',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span>Full context: frozen files, env vars, RBAC, role hierarchy</span>
        {selPr&&<span style={{color:'#7c3aed'}}>ctx: {selPr.seq}</span>}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:10,display:'flex',flexDirection:'column',gap:8}}>
        {aiMsgs.length===0&&(
          <div style={{color:'#1e3a5f',fontSize:12,textAlign:'center',marginTop:24,lineHeight:1.8}}>
            Full conversation history<br/>
            <span style={{color:'#334155',fontSize:11}}>Use "Ask" buttons in Details tab for quick contextual help,<br/>or type here for deeper questions.</span>
          </div>
        )}
        {aiMsgs.map((m,i)=>(
          <div key={i} style={{padding:'8px 10px',borderRadius:6,background:m.role==='user'?'#1e3a5f':'#111827',border:`1px solid ${m.role==='user'?'#3b82f622':'#1e293b'}`,maxWidth:'96%',alignSelf:m.role==='user'?'flex-end':'flex-start'}}>
            <div style={{color:m.role==='user'?'#93c5fd':'#cbd5e1',fontSize:12,whiteSpace:'pre-wrap',lineHeight:1.5}}>{m.content}</div>
          </div>
        ))}
        {aiLoad&&<div style={{color:'#7c3aed',fontSize:12,padding:8}}>Thinking…</div>}
        <div ref={aiEndRef}/>
      </div>
      <div style={{padding:8,borderTop:'1px solid #1e293b',display:'flex',gap:8}}>
        <input value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),sendAI())} placeholder="Ask anything — errors, rollback, verification…" style={{flex:1,padding:'7px 10px',background:'#111827',border:'1px solid #1e293b',borderRadius:6,color:'#e2e8f0',fontSize:12,fontFamily:'system-ui',outline:'none'}}/>
        <button onClick={sendAI} disabled={aiLoad} style={{padding:'7px 16px',background:'#0066ff',border:'none',borderRadius:6,color:'white',fontSize:12,cursor:'pointer',fontFamily:'system-ui',fontWeight:600}}>Send</button>
      </div>
    </div>
  );

  // ── NOTES TAB ──────────────────────────────────────
  const NotesTab=()=>{
    const nk=sel||'_global';
    return(
      <div style={{display:'flex',flexDirection:'column',height:'100%',fontFamily:'system-ui'}}>
        <div style={{padding:'6px 12px',background:'#111827',borderBottom:'1px solid #1e293b',color:'#475569',fontSize:11}}>
          {selPr?`Notes — ${selPr.seq}: ${selPr.title}`:'Global session notes'}
        </div>
        <textarea value={notes[nk]||''} onChange={e=>{const nv={...notes,[nk]:e.target.value};setNotes(nv);save({notes:nv});}} placeholder="Type notes here…" style={{flex:1,padding:12,background:'#030712',border:'none',color:'#e2e8f0',fontSize:12,fontFamily:'monospace',resize:'none',outline:'none',lineHeight:1.6}}/>
        <div style={{padding:'8px 12px',borderTop:'1px solid #1e293b',maxHeight:130,overflowY:'auto'}}>
          <div style={{color:'#1e3a5f',fontSize:10,fontWeight:700,marginBottom:4}}>SESSION LOG</div>
          {log.length===0&&<div style={{color:'#1e293b',fontSize:10}}>No events yet.</div>}
          {log.slice().reverse().slice(0,40).map((e,i)=>(
            <div key={i} style={{color:'#334155',fontSize:10,fontFamily:'monospace',marginBottom:2}}>
              [{new Date(e.t).toLocaleTimeString()}] {e.id}: {e.action}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── PROGRESS TAB ───────────────────────────────────
  const ProgressTab=()=>{
    const totMin=PROMPTS.reduce((a,p)=>a+p.expMin,0);
    const doneMin=PROMPTS.filter(p=>status[p.id]==='done').reduce((a,p)=>a+p.expMin,0);
    return(
      <div style={{padding:10,fontFamily:'system-ui',overflowY:'auto',height:'100%'}}>
        <div style={{background:'#111827',borderRadius:8,padding:'10px 12px',marginBottom:12,border:'1px solid #1e293b'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <span style={{color:'#64748b',fontSize:12}}>Overall progress</span>
            <span style={{color:'#60a5fa',fontWeight:700,fontSize:12}}>{doneCount}/{PROMPTS.length} ({pct}%)</span>
          </div>
          <div style={{background:'#030712',borderRadius:4,height:8,overflow:'hidden',marginBottom:8}}>
            <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#0066ff,#7c3aed)',transition:'width 0.3s'}}/>
          </div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            {[['Active',PROMPTS.filter(p=>status[p.id]==='active').length,'#7c3aed'],['Done',doneCount,'#15803d'],['Blocked',PROMPTS.filter(p=>status[p.id]==='blocked').length,'#dc2626'],['Skip',PROMPTS.filter(p=>status[p.id]==='skipped').length,'#f59e0b']].map(([l,c,col])=>(
              <span key={l} style={{color:col,fontSize:11}}>{l}: {c}</span>
            ))}
          </div>
          <div style={{color:'#334155',fontSize:10,marginTop:6}}>Est remaining: ~{totMin-doneMin} min  •  Session: {fmt(elapsed)}</div>
        </div>

        {PHASES.map(ph=>{
          const prs=PROMPTS.filter(p=>p.phaseId===ph.id);
          const dn=prs.filter(p=>['done','skipped'].includes(status[p.id])).length;
          const isExp=expanded[ph.id];
          return(
            <div key={ph.id} style={{marginBottom:6,border:'1px solid #1e293b',borderRadius:6,overflow:'hidden'}}>
              <div onClick={()=>toggleExpand(ph.id)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 10px',background:'#111827',cursor:'pointer',userSelect:'none'}}>
                <span style={{color:RC(ph.risk),fontWeight:600,fontSize:12}}>Phase {ph.id}: {ph.title}</span>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{color:'#334155',fontSize:11}}>{dn}/{prs.length}</span>
                  <span style={{color:'#334155',fontSize:10,transform:isExp?'rotate(180deg)':'none',transition:'transform 0.2s',display:'inline-block'}}>▼</span>
                </div>
              </div>
              {isExp&&prs.map(pr=>(
                <div key={pr.id} onClick={()=>{setSel(pr.id);setTab('details');if(isMobile)setMobileView('panel');}} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 12px',cursor:'pointer',background:sel===pr.id?'#1e3a5f':'transparent',borderTop:'1px solid #0f172a'}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:SC(status[pr.id]),flexShrink:0,display:'inline-block'}}/>
                  <span style={{color:'#475569',fontSize:10,minWidth:26,flexShrink:0}}>{pr.seq}</span>
                  <span style={{color:'#94a3b8',fontSize:11,flex:1}}>{pr.title}</span>
                  {nodeEl(pr.id)!==null&&<span style={{color:'#334155',fontSize:10}}>{nodeEl(pr.id)}m</span>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // ── RIGHT PANEL ────────────────────────────────────
  const PanelView=(props)=>{
    const style = (props && props.style) ? props.style : {};
    return (<div style={{display:'flex',flexDirection:'column',overflow:'hidden',background:'#0a0f1a',borderLeft:'1px solid #1e293b',...style}}>
      {/* Node header */}
      {selPr?(
        <div style={{padding:'8px 12px',background:'#111827',borderBottom:'1px solid #1e293b',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:SC(status[selPr.id]),display:'inline-block',flexShrink:0}}/>
          <span style={{color:'#475569',fontSize:10,flexShrink:0}}>{selPr.seq}</span>
          <span style={{color:'#e2e8f0',fontSize:12,fontWeight:600,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selPr.title}</span>
          <span style={{color:RC(PHASES.find(p=>p.id===selPr.phaseId)?.risk||'NONE'),fontSize:9,padding:'2px 6px',border:`1px solid ${RC(PHASES.find(p=>p.id===selPr.phaseId)?.risk||'NONE')}44`,borderRadius:3,flexShrink:0}}>
            {RL(PHASES.find(p=>p.id===selPr.phaseId)?.risk||'NONE')} {PHASES.find(p=>p.id===selPr.phaseId)?.risk}
          </span>
        </div>
      ):(
        <div style={{padding:'7px 12px',background:'#111827',borderBottom:'1px solid #1e293b',color:'#1e3a5f',fontSize:11,fontFamily:'system-ui'}}>
          Select a node to view details
        </div>
      )}
      {/* Tabs */}
      <div style={{display:'flex',background:'#111827',borderBottom:'1px solid #1e293b',flexShrink:0}}>
        {[['details','Details'],['ai','AI Chat'],['notes','Notes'],['progress','Progress']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'7px 4px',background:tab===t?'#0a0f1a':'transparent',border:'none',color:tab===t?'#60a5fa':'#334155',fontSize:11,cursor:'pointer',fontWeight:tab===t?700:400,borderBottom:`2px solid ${tab===t?'#0066ff':'transparent'}`,fontFamily:'system-ui',transition:'all 0.15s'}}>
            {l}{t==='ai'&&aiMsgs.length>0&&<span style={{background:'#7c3aed',color:'white',borderRadius:10,padding:'0 4px',fontSize:9,marginLeft:4}}>{aiMsgs.length}</span>}
          </button>
        ))}
      </div>
      {/* Content */}
      <div style={{flex:1,overflowY:'auto'}}>
        {tab==='details'&&DetailsContent()}
        {tab==='ai'&&AITab()}
        {tab==='notes'&&NotesTab()}
        {tab==='progress'&&ProgressTab()}
      </div>
    </div>
    );
  };

  // ── TOP BAR ────────────────────────────────────────
  const TopBar=()=>(
    <div style={{display:'flex',alignItems:'center',gap:8,padding:`6px ${isMobile?'10px':'14px'}`,background:'#111827',borderBottom:'1px solid #1e293b',flexShrink:0,flexWrap:'wrap'}}>
      <span style={{fontWeight:800,fontSize:isMobile?13:15,color:'#0066ff',letterSpacing:-0.5}}>INTeract</span>
      {!isMobile&&<span style={{color:'#1e293b'}}>|</span>}
      {!isMobile&&<span style={{color:'#334155',fontSize:11}}>Remediation Tracker</span>}
      <div style={{flex:1}}/>
      {/* Progress bar */}
      <div style={{background:'#0f172a',borderRadius:4,height:5,width:isMobile?80:150,overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#0066ff,#7c3aed)'}}/>
      </div>
      <span style={{color:'#334155',fontSize:10,minWidth:40}}>{doneCount}/{PROMPTS.length}</span>
      <span style={{color:sessOn?'#10b981':'#1e3a5f',fontSize:12,fontFamily:'monospace',fontWeight:700,minWidth:60}}>{fmt(elapsed)}</span>
      <button onClick={()=>{if(!sessOn){setSessOn(true);setSessStart(Date.now());}else setSessOn(false);}} style={{padding:`4px ${isMobile?'8px':'12px'}`,background:sessOn?'#dc262611':'#10b98111',border:`1px solid ${sessOn?'#dc262644':'#10b98144'}`,borderRadius:5,color:sessOn?'#dc2626':'#10b981',fontSize:11,cursor:'pointer',fontFamily:'system-ui',fontWeight:600}}>
        {sessOn?'⏹':'▶'}
      </button>
      {!isMobile&&<button onClick={()=>{const t=PROMPTS.filter(p=>['done','skipped'].includes(status[p.id])).sort((a,b)=>(nEnds[a.id]||0)-(nEnds[b.id]||0)).map(p=>`[${status[p.id]==='done'?'✓':'↷'}] ${p.seq} ${p.title}`).join('\n');navigator.clipboard.writeText(t);}} style={{padding:'4px 8px',background:'#1e293b',border:'1px solid #334155',borderRadius:4,color:'#64748b',fontSize:10,cursor:'pointer',fontFamily:'system-ui'}}>Copy Done</button>}
      <button onClick={()=>{if(confirm('Reset all progress?')){const clr={};setStatus(clr);setNStarts(clr);setNEnds(clr);setWuCheck(clr);setVCheck(clr);setLog([]);setInlineAiResp({});save({status:clr,nStarts:clr,nEnds:clr,wuCheck:clr,vCheck:clr,log:[],inlineAiResp:{}});}}} style={{padding:'4px 8px',background:'#dc262611',border:'1px solid #dc262622',borderRadius:4,color:'#dc2626',fontSize:10,cursor:'pointer',fontFamily:'system-ui'}}>Reset</button>
    </div>
  );

  // ── MOBILE VIEW SWITCHER BAR ───────────────────────
  const MobileNav=()=>(
    <div style={{display:'flex',background:'#111827',borderTop:'1px solid #1e293b',flexShrink:0}}>
      {[['canvas','🗺 Canvas'],['panel','📋 Details']].map(([v,l])=>(
        <button key={v} onClick={()=>setMobileView(v)} style={{flex:1,padding:'9px 4px',background:mobileView===v?'#1e293b':'transparent',border:'none',color:mobileView===v?'#60a5fa':'#334155',fontSize:12,cursor:'pointer',fontFamily:'system-ui',fontWeight:mobileView===v?700:400,borderTop:`2px solid ${mobileView===v?'#0066ff':'transparent'}`}}>
          {l}{v==='panel'&&selPr&&<span style={{marginLeft:4,background:'#7c3aed',borderRadius:10,padding:'0 5px',fontSize:9,color:'white'}}>!</span>}
        </button>
      ))}
    </div>
  );

  // ── MODALS ─────────────────────────────────────────
  const OverlayStyle={position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200};
  const ModalStyle={background:'#111827',border:'1px solid #334155',borderRadius:10,padding:20,width:420,maxWidth:'92vw',fontFamily:'system-ui'};

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#030712',color:'#e2e8f0',fontFamily:'system-ui',overflow:'hidden'}}>
      {TopBar()}

      {/* LAYOUT */}
      {isMobile?(
        /* Mobile: stacked, bottom nav to switch */
        <>
          <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
            {mobileView==='canvas'?(
              CanvasView({style:{flex:1}})
            ):(
              PanelView({style:{flex:1}})
            )}
          </div>
          {MobileNav()}
        </>
      ):isWide?(
        /* Wide: side by side */
        <div style={{display:'flex',flex:1,overflow:'hidden'}}>
          {CanvasView({style:{flex:'0 0 58%'}})}
          {PanelView({style:{flex:'0 0 42%'}})}
        </div>
      ):(
        /* Medium: canvas top 50%, panel bottom 50% */
        <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
          {CanvasView({style:{flex:'0 0 48%'}})}
          {PanelView({style:{flex:'0 0 52%'}})}
        </div>
      )}

      {/* BYPASS MODAL */}
      {bypass&&(
        <div style={OverlayStyle}>
          <div style={ModalStyle}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:6,color:'#fbbf24'}}>↷ Bypass / Skip</div>
            <div style={{color:'#475569',fontSize:12,marginBottom:12}}>Skipping: <strong style={{color:'#e2e8f0'}}>{PROMPTS.find(p=>p.id===bypass)?.seq} — {PROMPTS.find(p=>p.id===bypass)?.title}</strong></div>
            <input autoFocus value={bypassReason} onChange={e=>setBypassReason(e.target.value)} onKeyDown={e=>e.key==='Enter'&&bypassReason.trim()&&(applyStatus(bypass,'skipped'),setBypass(null))} placeholder="Required: reason for skipping…" style={{width:'100%',padding:'7px 10px',background:'#0f172a',border:'1px solid #334155',borderRadius:4,color:'#e2e8f0',fontSize:12,fontFamily:'system-ui',boxSizing:'border-box',outline:'none'}}/>
            <div style={{display:'flex',gap:8,marginTop:12,justifyContent:'flex-end'}}>
              <button onClick={()=>setBypass(null)} style={{padding:'6px 14px',background:'#1e293b',border:'1px solid #334155',borderRadius:4,color:'#64748b',cursor:'pointer',fontSize:12,fontFamily:'system-ui'}}>Cancel</button>
              <button onClick={()=>{if(bypassReason.trim()){applyStatus(bypass,'skipped');setBypass(null);}}} disabled={!bypassReason.trim()} style={{padding:'6px 14px',background:bypassReason.trim()?'#f59e0b':'#334155',border:'none',borderRadius:4,color:bypassReason.trim()?'#0f172a':'#64748b',cursor:bypassReason.trim()?'pointer':'not-allowed',fontSize:12,fontWeight:600,fontFamily:'system-ui'}}>Confirm Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* DOWNSTREAM ALERT */}
      {dsAlert&&(
        <div style={OverlayStyle}>
          <div style={ModalStyle}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:6,color:'#f59e0b'}}>⚠ Downstream steps affected</div>
            <div style={{color:'#475569',fontSize:12,marginBottom:8}}>Marking done affects {dsAlert.aff.length} active/done step(s):</div>
            {dsAlert.aff.map(id=>{const p=PROMPTS.find(pr=>pr.id===id);return<div key={id} style={{color:'#fca5a5',fontSize:11,padding:'2px 0'}}>• {p?.seq} {p?.title}</div>;})}
            <div style={{display:'flex',gap:8,marginTop:14,justifyContent:'flex-end'}}>
              <button onClick={()=>setDsAlert(null)} style={{padding:'6px 14px',background:'#1e293b',border:'1px solid #334155',borderRadius:4,color:'#64748b',cursor:'pointer',fontSize:12,fontFamily:'system-ui'}}>Cancel</button>
              <button onClick={()=>{applyStatus(dsAlert.id,dsAlert.ns);setDsAlert(null);}} style={{padding:'6px 14px',background:'#f59e0b',border:'none',borderRadius:4,color:'#0f172a',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'system-ui'}}>Continue anyway</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
