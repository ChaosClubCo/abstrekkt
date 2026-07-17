# Paradigm Fit Profile

> Provenance: [SOURCED] — paradigm-fit-profile. Functional/Pipeline 95%, Reactive 82%, Declarative 78%, Imperative 60%, OOP 45%.
> Archived from session dump 2026-07-08 (pass 2). Raw extract, unedited.

---

paradigm-fit-profile
PARADIGM FIT PROFILE — How Kyle's Brain Writes Code
================================================================================
Version 1.0
================================================================================
PARADIGM MAP
================================================================================
1. Functional / Pipeline FIT: 95% — YOUR NATIVE LANGUAGE
─────────────────────────────────────────────────────────────────
Data flows through a chain of transformations. No hidden state, no surprises.
What you see is what you get.
How You Already Use This:
› Your n8n workflows ARE functional pipelines — each node transforms data
and passes it forward
› spec → arch → code → deploy → monitor → iterate is a pure pipeline
› The Intinc Deployment Kit's 6 auto-advancing phases = function
composition in disguise
Languages: JavaScript (map/filter/reduce), Python, Elixir, Clojure
Try This: In your next JS project, chain .map().filter().reduce() instead
of for-loops. You'll feel instantly at home.
Code example:
// This IS how you already think:
const deploy = pipe(
validateConfig,
buildAssets,
runTests,
pushToVercel,
notifySlack
);
// n8n node chain = same concept:
// Webhook → Transform → Filter → Supabase → Resend
────────────────────────────────────────────────────────────────────────────────
2. Reactive / Event-Driven FIT: 82% — STRONG SECONDARY FIT
─────────────────────────────────────────────────────────────────
Systems respond to events and state changes. When X happens, trigger Y.
Perfect for real-time, async workflows.
How You Already Use This:
› n8n webhooks, Supabase realtime, and PostHog event tracking = reactive
› Your "when X happens, do Y" trigger thinking maps directly here
› Stripe webhooks → fulfillment flows in the Customization Service POC
Languages: JavaScript (async/await, Promises), RxJS, Node.js event emitters
Try This: Supabase Realtime subscriptions are pure reactive programming.
You're already doing this.
────────────────────────────────────────────────────────────────────────────────
3. Declarative / Config-Driven FIT: 78% — STEALTH STRENGTH
─────────────────────────────────────────────────────────────────
Describe WHAT you want, not HOW to do it. The system figures out the
implementation.
How You Already Use This:
› Notion databases, Supabase RLS policies, Vercel config = declarative
› Your YAML/JSON config approach to the Deployment Kit is declarative
› SQL queries describe results, not procedures — and you lean into this
Languages: SQL, HTML/CSS, Terraform, YAML configs, React JSX
Try This: Next time you reach for imperative code, ask: "Can I describe
the desired state instead?" Your RLS policies already do this.
────────────────────────────────────────────────────────────────────────────────
4. Imperative / Procedural FIT: 60% — FAMILIAR BUT NOT NATIVE
─────────────────────────────────────────────────────────────────
Step-by-step instructions telling the computer exactly what to do. The
"recipe" approach.
How You Already Use This:
› Your bartending/hospitality background trained you in procedures and SOPs
› Java training is teaching you this paradigm right now
› MDT imaging workflows and deployment checklists are procedural thinking
Languages: Java, C, Python (procedural style), Bash scripts
Try This: You naturally reach for this when writing Bash scripts and
deployment steps. It works — but you'll notice you often want to refactor
into pipelines.
────────────────────────────────────────────────────────────────────────────────
5. Object-Oriented (OOP) FIT: 45% — USEFUL TOOL, NOT YOUR WIRING
─────────────────────────────────────────────────────────────────
Model the world as objects with state and behavior. Nouns become classes,
verbs become methods.
How You Already Use This:
› Java training is immersing you in OOP — inheritance, polymorphism,
encapsulation
› Your frustration with "too many layers" = the classic OOP abstraction pain
› You use objects for data modeling (Supabase schemas) but don't naturally
think in class hierarchies
Languages: Java, C#, TypeScript (class-heavy), Python (class-based)
Try This: Use OOP for data modeling and API structure, but don't force
everything into classes. Your instinct to keep it flat is correct.
================================================================================
KEY INSIGHTS
================================================================================
☕ Why Java Feels Heavy
Your Java training is teaching OOP + imperative style — the two paradigms
that score lowest for your wiring. This isn't a weakness. The key: use
Java's Stream API and functional interfaces to bring pipeline thinking into
Java.
🔑 Your Secret Advantage
Most self-taught devs learn one paradigm and get stuck. Your n8n/Zapier
background gave you functional and reactive intuitions BEFORE you had the
vocabulary for them. Now that you're formalizing your CS knowledge, you can
name and sharpen what you already do instinctively.
📐 Staff Engineer Implication
Pipeline/functional thinkers excel at system design and data architecture —
exactly where Staff Engineers spend their time. Your instinct to "map the
data flow first" is the #1 skill for designing scalable systems at Intinc
and beyond.
================================================================================
YOUR PARADIGM STACK
================================================================================
Primary: Functional / Pipeline — your default mode.
Secondary: Reactive + Declarative — your force multipliers.
Growth edge: OOP via Java — builds versatility without replacing core wiring.
================================================================================
