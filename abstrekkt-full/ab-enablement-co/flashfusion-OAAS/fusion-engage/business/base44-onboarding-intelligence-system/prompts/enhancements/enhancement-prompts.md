# Enhancement Prompts (15 Differentiators)

The 15 "nice-to-have / accelerator / differentiator" prompts named in the source
chat. Each is an atomic Base44 prompt seed — paste the body into app.base44 and
expand. All read/write `onboarding_state` + `lifecycle_state` and emit events into
the taxonomy from core prompt 08.

> Kept as one library file (not 15 thin stubs) so each entry stays substantive and
> cross-referenced. Split into individual `.txt` files when a specific one is built.

## 1. Ghost / Observer Mode
Let a user explore the product with zero commitment (no compliance gate, sandbox
data). Track `ghost_session` events; convert by showing what they'd unlock on signup.

## 2. AI Strategy Personas
Offer selectable advisor personas (e.g. "conservative allocator", "aggressive
sourcer") that reshape recommendations and copy. Persist choice in onboarding_state.

## 3. Time-Budgeted Workflows
User declares "I have 10 minutes" -> app sequences the highest-value actions to fit.
Emit `time_budget_set` + `time_budget_completed`.

## 4. Adaptive UI Density
Detect expertise (speed, feature use) and shift between guided (sparse) and dense
(pro) layouts automatically; let users override.

## 5. Explainable Recommendations
Every recommended deal/action carries a "why you're seeing this" trace tied to the
user's stated criteria — builds trust, aids compliance.

## 6. Education Sandbox Mode
Safe practice environment with simulated deals/portfolio so users learn mechanics
before touching real money. Pairs with Ghost Mode.

## 7. Signal Marketplace
Let power users publish/subscribe to deal signals or screens; foundation for
network effects and a future revenue share.

## 8. Advisor / Coach Overlay
Contextual coach that nudges next-best-action from lifecycle_state, framed as
guidance not nagging. Respects frequency caps.

## 9. Gamification System
Streaks, milestones, and earned badges tied to *real* value events (deals reviewed,
portfolio actions) — never vanity metrics.

## 10. Social-Proof Engine
Show relevant, privacy-safe peer activity ("syndicates like yours added 3 deals")
to drive habit + expansion. Aggregate only; never expose individuals' figures.

## 11. Predictive Interventions
Use decay + lifecycle signals to intervene *before* churn (proactive win-back tied
to the user's outcome). Emits `predicted_at_risk`.

## 12. Smart Notifications Router
Chooses channel (in-app/email/push) and timing per user from engagement history;
one consolidated nudge, never overlapping layer messages.

## 13. Personalized Deal Digest
Auto-curated recurring digest filtered by criteria + persona; the backbone of the
retention habit loop for `find_deals` users.

## 14. Onboarding Checklist / Progress Hub
A persistent "getting started" hub showing remaining setup + first-win progress;
reduces drop-off between onboarding and activation.

## 15. Referral & Invite Loops
Reward inviting collaborators/syndicate members; ties into Org/Team expansion and
seat-based monetization.
