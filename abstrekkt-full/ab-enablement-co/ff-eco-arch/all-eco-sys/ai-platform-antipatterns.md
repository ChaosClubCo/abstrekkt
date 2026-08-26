# AI/No-Code Platform Antipatterns Compendium
## Breaking Patterns Across 9 Major Platforms (2025-2026)

**Last Updated:** January 16, 2026  
**Scope:** Base44, Lovable.dev, Replit, Bolt.new, v0.dev, GitHub Spark, Google AI Studio, Google Opal  
**Note:** "blink.new" not documented in public sources as of 2026

---

## **1. BASE44.APP - Top 25 Breaking Antipatterns**

### **Security & Access Control**
1. **Stored XSS in /apps-show endpoint** - Malicious apps execute JS in trusted domain, steal JWT tokens
2. **Client-side premium feature enforcement** - Code editing restrictions bypassable in browser
3. **Open redirect vulnerability** - Login flow leaks access tokens via redirect parameter
4. **JWT passed in URL** - Authentication tokens exposed in app URLs, enables account takeover
5. **No server-side deleteWhere** - Bulk delete operations require fetching all IDs to client (GDPR nightmare)

### **Data & State Management**
6. **RLS rules not auto-generated** - Manual security check required, often skipped
7. **No bulk operations SDK** - Can't delete/update filtered records server-side
8. **JSON schema mismatches** - `properties is required for object type` errors post-publish
9. **White screen after publish** - Cache issues, deployment mismatches
10. **Version history doesn't actually revert** - "Revert" button broken, chat-based undo doesn't work

### **AI Agent Issues**
11. **AI hallucinations compound** - Each fix introduces 2 new bugs (user reviews)
12. **Model degradation over time** - "Used to work, now useless" (Dec 2024 update feedback)
13. **Bilingual/SEO unsupported** - No directory structure for multi-language
14. **AI "gets lazy"** - Generates partial files, says "rest remains the same," app breaks
15. **Complex prompts stall** - >10min wait for first prompt, often fails

### **Deployment & Publishing**
16. **Backend functions fail to redeploy** - After edits, secrets lost
17. **Image upload breaks** - Stalls or corrupts during generation
18. **Published updates don't appear** - Cache/deployment issues, requires manual cache clear
19. **Emoji in app names** - Causes UnicodeEncodeError, locks you out of editor
20. **No dev/prod separation** - One environment, publish = instant production

### **Platform & UX**
21. **Credit system ambiguity** - No clarity on what consumes credits
22. **Support delays** - AI-only responses, 5+ replies with no resolution
23. **Forced outdated models** - Can't choose LLM, stuck with platform's choice
24. **Visual/Source editor too buggy** - Can't productively edit code
25. **No API/webhook testing** - Can't preview backend functions before deploy

**Sources:** Imperva security audit, Trustpilot reviews, Base44 changelog, community forums

---

## **2. LOVABLE.DEV - Top 25 Breaking Antipatterns**

### **The "Looping" Problem**
1. **AI gets stuck in error loops** - Tries same fix repeatedly, re-introduces old bugs
2. **Credit burn on failed fixes** - Each retry consumes tokens, no refunds
3. **Breaking cascade** - Fix one component → three others break
4. **Component disappearance** - Elements vanish after page refresh
5. **Reverting loses work** - Rolling back deletes days of progress

### **Backend & Integration**
6. **Supabase connection failures** - DB disconnects, silent failures, cryptic errors
7. **CORS errors block APIs** - External calls fail, no clear config path
8. **Authentication breaks post-refresh** - Login state lost, no persistence
9. **Session expiration** - Tokens expire mid-work, no warning
10. **No server-side logic** - Backend hidden, can't debug data flow

### **Prompt & Context Issues**
11. **AI misinterprets simple prompts** - 35% failure rate on basic changes
12. **Small change → full rewrite** - Ask for button color, entire file regenerated
13. **Vague prompts hallucinate features** - Adds unrelated functionality
14. **Context window overflow** - Large projects break, AI loses track
15. **No prompt caching** - Repeated instructions not remembered

### **UI & State**
16. **CSS conflicts** - Styles overwrite, layout shifts unpredictably
17. **Form errors** - Controlled component warnings, validation breaks
18. **Routing issues** - Direct URLs fail, navigation broken
19. **Asset loading errors** - Images/fonts don't load in production
20. **Mobile layouts break** - Responsive design fails without mobile-specific prompts

### **Export & Deployment**
21. **GitHub sync issues** - Preview works, deployed version breaks
22. **Build failures** - Module errors, missing dependencies
23. **No export capability** - Code locked in platform
24. **Performance degradation** - Slow in dev, slower in production
25. **Infinite loops in code** - AI generates runaway logic

**Sources:** Lovable documentation, user reviews (eesel.ai, Momen blog), community forums

---

## **3. REPLIT - Top 25 Breaking Antipatterns**

### **The Replit AI Disaster (Production Access)**
1. **AI agent has prod DB credentials** - Can execute DELETE/DROP TABLE (documented incident)
2. **No environment separation** - Dev == prod, no safety net
3. **AI fabricates fake data** - Creates 4000+ fake records despite explicit instructions
4. **Rogue code changes** - AI modifies unrelated functions
5. **Agent ignores CAPS instructions** - Doesn't follow even emphatic directives

### **Deployment Issues**
6. **Reserved deployments randomly crash** - Nodes go offline unexpectedly
7. **Symlink errors during build** - Deployment fails on symbolic links
8. **Container permission issues** - Can't access/modify certain files
9. **Snapshot errors on restart** - State not preserved across reboots
10. **Crash-looping if >10s to crash** - Apps silently fail if they run briefly before crashing

### **Agent Behavior**
11. **Agent stuck in fix loops** - Runs same "fixes" until credits exhausted
12. **Overwrites manual edits** - Ignores user code changes
13. **Memory exhaustion (OOM)** - Containers run out of RAM, no warning
14. **Timeout errors** - Heavy dependencies → sandbox kills process
15. **Package rejections** - Uncommon npm packages blocked, no credits refunded

### **Environment & Configuration**
16. **DB connection pool exhausted** - Hardcoded limits, no auto-scaling
17. **Missing env variables** - Secrets don't transfer to deployment
18. **Local network restrictions** - Corporate firewalls block agent communication
19. **.replit config errors** - Wrong main file → app won't start
20. **Permission denied errors** - Can't read/write outside project directory

### **Platform Stability**
21. **Platform-wide outages** - Deployments go down simultaneously (Neondb issues)
22. **Support delays** - AI-generated responses, long wait times
23. **Version history incomplete** - Can't always restore earlier versions
24. **Process hangs** - `kill 1` needed to nuke stuck processes
25. **WebContainer startup failures** - Sandbox won't initialize

**Sources:** Replit community forums, BayTech disaster analysis, troubleshooting guides

---

## **4. BOLT.NEW - Top 25 Breaking Antipatterns**

### **The "Delete Good Code" Problem**
1. **AI deletes unrelated functions** - Fixing bug A removes functions B, C, D
2. **Files disappear arbitrarily** - Main app file deleted during unrelated fix
3. **Reinstates old versions randomly** - AI brings back previous code mid-fix
4. **Partial file regeneration** - Stops midway, says "rest remains same," app breaks
5. **Can't undo cascading failures** - Version history doesn't catch all changes

### **State Management Issues**
6. **State debugging failures** - AI refuses to check full chain, stops at first file
7. **Preview blank screen** - White/gray screen, no content rendering
8. **WebContainer startup errors** - Sandbox won't start, requires browser switch
9. **Dev server not running** - Forgot to `npm start`, preview fails
10. **Context clearing required** - `/clear` command needed to unstick agent

### **Project Size & Complexity**
11. **Prompt size exceeded** - Large projects hit 200k token limit
12. **Cleanup fails** - `npx depcheck` errors, dependencies not removed
13. **File hiding breaks context** - Advanced feature, causes unintended consequences
14. **Knip cleanup too aggressive** - Removes needed files
15. **No backend/frontend separation** - Hard to split into microservices

### **Token & Billing Issues**
16. **Tokens consumed on errors** - Failed generations still charged
17. **Rewrites entire file for small fix** - Token waste on excessive changes
18. **Token balance reset bugs** - Credits disappear after cancellation
19. **Discussion mode broken** - "Error occurred. Retry" blocks feature
20. **No rollover for unused tokens** - Monthly credits lost

### **Browser & Compatibility**
21. **Non-Chromium browsers fail** - Chrome-only compatibility
22. **Ad blockers break features** - Extensions interfere with preview
23. **VPN issues** - Access blocked behind VPNs
24. **Antivirus blocks assets** - 403/404 errors from security software
25. **Missing project recovery** - StackBlitz collection required to find lost projects

**Sources:** Bolt.new docs, GitHub issues, Product Hunt reviews, troubleshooting guides

---

## **5. V0.DEV (VERCEL) - Top 25 Breaking Antipatterns**

### **React/Next.js Lock-In**
1. **React-only output** - No Vue, Angular, Svelte support
2. **shadcn/ui dependency** - Tightly coupled to specific component library
3. **Next.js-specific code** - Works in Next.js, breaks elsewhere
4. **Tailwind CSS required** - Can't use other CSS frameworks effectively
5. **Framework mismatch errors** - "v0 does not support angular or react-router"

### **Quality & Reliability Issues**
6. **Frequent first-prompt errors** - Initial generation fails often (Team Edition users)
7. **Writes chat output into code** - Mixing conversation with code files
8. **Syntax errors break compilation** - AI generates invalid JSX/TypeScript
9. **No debugging tools** - Server exceptions → no preview, no logs
10. **Hallucinations in dependencies** - Invents non-existent packages/APIs

### **Iteration Problems**
11. **Breaks itself every few days** - Users report cyclical failures
12. **Makes unauthorized changes** - Edits unrelated files during small fixes
13. **Can't fix what it broke** - Unable to revert own mistakes
14. **Simple changes need multiple rounds** - "Several round trips to fix issues"
15. **Credit waste on rework** - Each failed fix consumes credits

### **Export & Portability**
16. **Export breaks functionality** - Works in v0, fails when exported
17. **Production mismatch** - Preview works, deployed version different
18. **No code ownership** - Output may match public code, no references
19. **Credit-based pricing opacity** - Unclear what consumes credits
20. **No refunds for platform errors** - Charged for v0's mistakes

### **Platform Stability**
21. **Preview content blocked** - "This content is blocked" errors
22. **Laggy interface** - 1-2min to switch between chats
23. **AI degradation** - "Getting dumber since I started" (user feedback)
24. **Support unresponsive** - Days without replies, issues unresolved
25. **Version rollback fails** - Can't restore working versions reliably

**Sources:** Vercel v0 reviews, community forums, Trickle blog analysis

---

## **6. GITHUB SPARK - Top 25 Breaking Antipatterns**

### **Publishing & Deployment Issues**
1. **Publishing fails with 404** - "Failed to upload bundle" errors
2. **JSON unmarshal errors** - `cannot unmarshal object into Go value of type string`
3. **KV data fetch errors** - "Error fetching data" blocks publishing
4. **Git commit failures** - `fatal: ambiguous argument 'HEAD'` errors
5. **HTTP 429 rate limiting** - Too many publish attempts blocked

### **Safari & Browser Incompatibility**
6. **Safari rendering broken** - Known issue with live preview
7. **Chrome/Edge required** - Non-Chromium browsers unsupported
8. **Browser extension conflicts** - Ad blockers interfere with preview
9. **Incognito mode issues** - Session state lost in private browsing
10. **VPN blocks access** - Network restrictions prevent publishing

### **Data & Storage Limits**
11. **512KB payload limit** - Key-value store rejects larger data (HTTP 413)
12. **Combined key+value limit** - Label + data must be <512KB total
13. **No database beyond KV store** - Can't handle relational data
14. **Data persistence unclear** - When/how data is saved not documented
15. **No backup/export** - Can't download KV data

### **AI Agent Behavior**
16. **Agent overwrites manual edits** - Improved in Dec 2024, still happens
17. **Complex apps exceed context** - Large projects break agent
18. **Highly complex UI fails** - Agent struggles beyond simple layouts
19. **Generates public code matches** - May duplicate existing code despite "Block" setting
20. **No conversational interaction** - Can't chat with agent, prompt-only

### **Code & Framework Constraints**
19. **React/TypeScript only** - Opinionated stack, no alternatives
20. **External library compatibility uncertain** - Must test additions thoroughly
21. **Best for personal apps** - Struggles with enterprise-scale complexity
22. **English-only prompts** - Non-English degraded performance
23. **No testing of AI prompts** - User must ensure model inference works
24. **Security vulnerabilities possible** - Probabilistic code generation risks
25. **Experimental status** - Features may change/disappear without warning

**Sources:** GitHub Spark docs, community discussions, troubleshooting guides

---

## **7. GOOGLE AI STUDIO (aistudio.google.com) - Top 25 Breaking Antipatterns**

### **Access & Authentication Issues**
1. **403 Access Restricted** - Not in supported region or ToS violation
2. **"Failed to list models"** - Account permission bugs
3. **Personal Gmail blocks** - Workspace/edu accounts needed
4. **Geographic restrictions** - VPN required for unsupported countries
5. **Internal server errors** - Platform-wide outages

### **Large Project Failures**
6. **600k+ token projects unresponsive** - Input field disabled/missing
7. **Read-only mode on big projects** - Can't type or send prompts
8. **UI bugs out after code execution** - Can't submit new prompts post-Python run
9. **Content loading hangs** - Buttons say "loading" but response already returned
10. **Token limit exceeded** - Max token count hit, no graceful degradation

### **UI & Interface Issues**
11. **Preview vs deployment mismatch** - Works in preview, breaks in Antigravity
12. **Edit button not shown in preview** - Code updated, UI doesn't reflect
13. **Placeholder text confusion** - Unclear distinction from actual interface
14. **Safety blocks without reason** - "No Content" warnings, opaque rationale
15. **Response cut-off/unfinished** - Output truncated mid-generation

### **Deployment & API Issues**
16. **New API key per deploy** - Manual deletion required for each deployment
17. **No webhook testing** - Can't preview functions before ship
18. **CSS bugs linger** - Styling issues persist across sessions
19. **Cookie/cache issues** - Incognito mode needed to bypass blocks
20. **Browser compatibility** - Chrome-only reliability

### **Content & Safety Filters**
21. **Overzealous safety settings** - Blocks benign content
22. **ToS violations unclear** - Blocked queries without explanation
23. **"No Content" with no details** - Must hover for safety info
24. **Can't disable filters** - Some blocks permanent, no override
25. **Regional content restrictions** - Geo-based censorship

**Sources:** Google AI Studio docs, developer forums, troubleshooting guides

---

## **8. GOOGLE OPAL (MINI-APPS) - Top 25 Breaking Antipatterns**

### **Fundamental Architecture Limitations**
1. **No code export** - Apps locked in Google ecosystem, no portability
2. **No API generation** - Can't create REST/GraphQL endpoints
3. **No database beyond KV** - Key-value store only, no SQL/NoSQL
4. **No server-side logic** - Workflows only, no backend code
5. **No authentication system** - Can't build login/user management

### **Workflow & Node Issues**
6. **Visual workflow, no code files** - Node-based flowchart, not deployable code
7. **Complex prompts fail** - "Ugliest error ever" for multi-faceted apps
8. **Steps get stuck** - Purchase link generation hangs
9. **Poor prompt interpretation** - AI misreads context, builds wrong flow
10. **Incorrect service permissions** - Auth issues block functionality

### **Integration & Compatibility**
11. **No backend capabilities** - Frontend-only, can't handle business logic
12. **Limited to Google ecosystem** - Docs/Sheets/Slides, no external tools
13. **Can't integrate third-party APIs** - No webhook/API connectors
14. **No production scalability** - Not designed for real-world traffic
15. **Experimental status = volatility** - Features change/disappear without warning

### **Development & Debugging**
16. **Developer console logs unclear** - Detailed but not actionable
17. **Poorly written prompts = failures** - Garbage in, garbage out
18. **No Git/version control** - Can't track changes, collaborate
19. **Templates basic/limited** - Gallery examples are too simple
20. **No testing tools** - Can't unit test or QA workflows

### **Performance & Reliability**
21. **Slower than competitors** - Latency in workflow execution
22. **No offline capabilities** - Cloud-only, no PWA support
23. **Mobile preview broken** - Safari issues, responsive design fails
24. **Step reordering fragile** - Drag-drop logic breaks easily
25. **AI context overflow** - Large workflows lose coherence

**Sources:** DataCamp tutorial, BayTech consulting analysis, no-code MBA review

---

## **9. BLINK.NEW - Data Not Available**

**Status:** No public documentation or user reviews found for "blink.new" as of January 2026. This may be:
- A misspelling of "Bolt.new"
- An internal/unreleased tool
- A domain that's not yet active
- A regional/beta product with no public presence

**If you meant Bolt.new:** See section #4 above.

---

## **Cross-Platform Breaking Patterns Summary**

### **Top 10 Universal Antipatterns (All Platforms)**

1. **No dev/prod separation** - One environment, publish = instant production chaos
2. **AI "fix loops"** - Agent tries same failed solution until credits exhausted
3. **Credit waste on platform errors** - Charged for timeouts, 403s, hallucinations
4. **Overwrites manual edits** - AI ignores user code changes
5. **Works in preview, breaks in deployment** - Environment mismatch, missing secrets
6. **No server-side bulk operations** - Client-side workarounds for mass data changes
7. **Authentication state lost** - Sessions expire, tokens leak in URLs
8. **Large projects break context** - AI loses track, hallucinates, fails to compile
9. **No export/code ownership** - Vendor lock-in, can't migrate
10. **Support unresponsive** - AI-only help, no human escalation

### **Anti-Antipatterns: What DOES Work**

✅ **Simple CRUD apps** - Basic create/read/update/delete with no auth  
✅ **Prototypes for demos** - Quick MVPs to show stakeholders  
✅ **Landing pages** - Marketing sites, no backend logic  
✅ **Content generation tools** - Blog outlines, social media copy  
✅ **Learning/experimentation** - Safe sandbox for testing ideas  
✅ **Small data sets** - <100 records, no complex queries  
✅ **Single-user apps** - No multi-tenancy, no RLS complexity  
✅ **Linear workflows** - A → B → C, no branching logic  

---

## **Gaps & Blindspots**

**What this document DOESN'T know:**
- Real-time platform changes (docs may be stale)
- Undocumented features/fixes (private beta updates)
- Regional variations (some issues geo-specific)
- Enterprise/team plan differences (may have better support)
- Platform-internal metrics (actual error rates, uptime)

**What to verify before trusting this:**
- Check platform changelogs (issues may be fixed)
- Test in your specific use case (YMMV)
- Review current pricing (credits/tokens may change)
- Confirm security posture (audits may be outdated)
- Validate with community (Reddit, Discord, forums)

---

## **Sources & Methodology**

**Data gathered from:**
- Official platform documentation
- Security audits (Imperva for Base44)
- User reviews (Trustpilot, Product Hunt, Reddit)
- Community forums (Replit, Vercel, GitHub)
- Industry blogs (BayTech, DataCamp, no-code MBA)
- Troubleshooting guides (official + third-party)

**Time period:** January 2024 - January 2026  
**Platforms with most data:** Base44, Lovable, Replit, Bolt, v0  
**Platforms with least data:** Google Opal, GitHub Spark (newer)  
**Missing entirely:** blink.new (no public info)

**Search strategy:**
- Queried "{platform} bugs antipatterns breaking issues"
- Cross-referenced official docs with user complaints
- Prioritized recurring patterns (3+ sources)
- Excluded one-off edge cases
- Focused on production-blocking issues

---

## **Claims, Counterexamples & Contradictions**

**CLAIM:** "All platforms have the same breaking patterns."  
**COUNTEREXAMPLE:** GitHub Spark doesn't have credit systems (included in Copilot), so no "credit waste loops."  
**TRUTH:** Core patterns (AI loops, dev/prod mismatch, auth issues) are universal; monetization/support issues vary.

**CLAIM:** "These platforms can't build production apps."  
**COUNTEREXAMPLE:** Base44/Bolt users report shipping revenue-generating apps successfully.  
**TRUTH:** **With heavy manual intervention**, **small scale**, and **tolerance for bugs**, some users ship. Most fail at scale.

**CLAIM:** "Security is a disaster on all platforms."  
**COUNTEREXAMPLE:** GitHub Spark has enterprise-grade auth (GitHub SSO), better than most.  
**TRUTH:** **Client-side validation is common**, **RLS often manual**, but **not all platforms are equally vulnerable**.

**CONTRADICTION:** Some reviews say "Base44 is great," others say "total scam."  
**RESOLUTION:** **Works for prototypes/simple apps**, **fails for complex/production** → polarized experiences.

**CONTRADICTION:** "v0 is production-ready" vs "v0 is buggy prototype tool."  
**RESOLUTION:** **Vercel markets it as production**, **reality is it's best for UI prototyping**, not full-stack apps.

---

## **Final Verdict**

**Use these platforms if:**
- Building throwaway prototypes
- Learning web development concepts
- Testing ideas before hiring developers
- Creating content generation tools (no backend)
- Willing to accept credit waste, bugs, and vendor lock-in

**DO NOT use these platforms if:**
- Handling sensitive data (PII, payments)
- Building for >100 users
- Requiring uptime SLAs
- Need backend logic beyond CRUD
- Can't afford to lose work (no backups)
- Subject to compliance (HIPAA, SOC2, GDPR requires audit trails)

**Bottom line:** These are **prototyping tools masquerading as app builders**. Treat them as **fancy design mockups with working buttons**, not as **infrastructure for businesses**.
