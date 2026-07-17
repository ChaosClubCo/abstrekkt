# FlutterFlow Marketplace — Step-by-Step Build Guide

> Reconstructed from the source chat "FlutterFlow Marketplace App Development
> Guide" (uuid `c5272ffd`). The source's narrative is preserved and turned into
> a concrete, do-this-now build sequence with named screens, widgets, actions,
> and the exact Firebase wiring. All vendor numbers (prices, % faster) are the
> source's marketing claims — see the README CLAIMS CHECK before quoting them.

**Stack:** FlutterFlow (visual builder) + Firebase (Auth, Firestore, Storage,
Cloud Functions) + Stripe (payments) + OpenAI/ChatGPT (optional AI features).
**Realistic timeline:** the source says 4–8 weeks; treat 8 weeks as the honest
number once payments, trust & safety, and store review are included.

---

## Phase 0 — Accounts & prerequisites (Day 0)

Create these before opening FlutterFlow:

- FlutterFlow account (free tier works to start; Pro removes branding/export limits).
- Firebase / Google account.
- Stripe account (test mode keys to start).
- (Optional) OpenAI API key for AI features.
- Apple Developer ($99/yr) and/or Google Play Console ($25 one-time) **only when
  you're ready to ship** — not on day 0.

> SECURITY: none of these keys belong in your FlutterFlow project files or in
> this repo. See `firebase/firebase-config.example.md` for where they go instead.

---

## Phase 1 — Project & navigation skeleton (Week 1)

1. **Create project**: FlutterFlow → Create New Project → Blank. Name it
   (e.g. `MyMarketplace`). Enable Firebase during setup (or link later in Phase 2).
2. **Create the page set** (these are the screens; bracketed = route name):
   - `LoginPage` / `SignupPage` — auth entry.
   - `HomePage` — product browse grid.
   - `SearchPage` — search + filters.
   - `ProductDetailPage` — single listing (takes `productId` param).
   - `SellPage` — create/edit listing form.
   - `OrdersPage` — buyer purchase history + seller sales.
   - `ChatListPage` / `ChatPage` — messaging (`ChatPage` takes `chatId`).
   - `ProfilePage` — current user account + settings.
   - `PublicProfilePage` — another seller's public profile (takes `uid`).
3. **Navigation**: add a **Bottom Navigation Bar** with Home, Search, Sell,
   Chats, Profile. Use stack/push navigation for detail pages.
4. **Theme**: set app-wide colors, typography, and a reusable `ProductCard`
   component (image, title, price, rating) and `RatingStars` component now —
   you'll reuse them everywhere.

**Acceptance:** you can tap through all five tabs and push to a (empty)
`ProductDetailPage`. No data yet.

---

## Phase 2 — Firebase backend wiring (Week 2)

1. **Link Firebase**: FlutterFlow → Settings & Integrations → Project Setup →
   Firebase → create/link a Firebase project. Download config is handled by
   FlutterFlow; you do not paste keys into code.
2. **Enable services** in Firebase console:
   - **Authentication**: Email/Password + Google sign-in.
   - **Firestore Database**: start in **test mode** for local dev ONLY, then
     immediately plan to replace rules (Phase 3 ships locked-down rules).
   - **Storage**: for product images + avatars.
   - **(Later) Cloud Functions**: requires the Blaze (pay-as-you-go) plan.
3. **Create Firestore collections** exactly as defined in
   `data-model/firestore-data-model.md`. In FlutterFlow, model each as a
   **Firestore Collection** with matching field types. Mismatches between the
   data model and FlutterFlow types are the #1 source of silent read failures.
4. **Storage folders**: `product_images/{uid}/...` and `avatars/{uid}/...` so
   storage rules can scope writes per user.

**Acceptance:** you can manually add a `products` doc in the Firebase console and
see it render in a FlutterFlow `HomePage` ListView bound to the `products`
collection.

---

## Phase 3 — Authentication (Week 2–3)

1. FlutterFlow → Settings & Integrations → App Settings → Authentication →
   enable, type = **Firebase**.
2. Set **Entry Page = LoginPage**, **Logged-In Page = HomePage**.
3. Build the auth actions (see `prompts/flutterflow-actions-and-functions.md`):
   - Sign up (email/password) → on success, **create the `users/{uid}` doc**
     with `roles:["buyer"]`, `status:"active"`, server timestamps.
   - Login, Google sign-in, logout, password reset.
4. **Critical:** creating the `users` doc on first sign-up is a step the source
   glossed over. If you skip it, every rule that checks the user doc fails.

**Acceptance:** register a new account → a `users/{uid}` doc appears → logging out
returns to LoginPage; logging in lands on HomePage.

---

## Phase 4 — Core marketplace features (Week 3–4)

### 4a. Create a listing (`SellPage`)
- Form: title, description, price (collect dollars, **convert to integer cents**
  in a custom function before write — see actions doc), category dropdown (bound
  to `categories`), image upload(s) to Storage.
- On submit: **Create Document** in `products` with `sellerId = currentUserUid`,
  `status:"active"`, `currency:"USD"`, server timestamps, and a computed
  `searchKeywords` array (lowercased title tokens).

### 4b. Browse (`HomePage`)
- ListView/GridView bound to `products` where `status == active`, ordered by
  `createdAt` desc. Bind `ProductCard`. Tap → `ProductDetailPage(productId)`.

### 4c. Search & filter (`SearchPage`)
- Query `products` with `searchKeywords array-contains <lowercased query token>`.
- Category filter = add `category ==` condition. Price sort = order by `price`.
- These need the composite indexes listed in the data model.

### 4d. Product detail (`ProductDetailPage`)
- Read the product by id. Show seller's `PublicProfilePage` link, rating,
  image carousel. Buttons: **Message Seller** (creates/opens a `chat`), **Buy**
  (→ Phase 5 checkout).

### 4e. Favorites (optional)
- Subcollection `users/{uid}/favorites/{productId}` or an array on the user doc.

**Acceptance:** create a listing as user A, browse/search it as user B, open it,
and start a chat.

---

## Phase 5 — Messaging (Week 4)

1. **Message Seller** action: deterministically derive `chatId` from the two
   uids (sorted + joined) so the same pair always reuses one chat. Create the
   `chats/{chatId}` doc with `participants:[a,b]` if absent.
2. `ChatPage`: ListView bound to `chats/{chatId}/messages` ordered by `createdAt`.
   Send action = Create Document in `messages` with `senderId = currentUserUid`.
3. Update `chats.lastMessage` / `lastMessageAt` on each send (do this in the same
   action group or a Cloud Function).
4. `ChatListPage`: query `chats` where `participants array-contains currentUserUid`
   ordered by `lastMessageAt` desc.

**Acceptance:** two accounts can exchange messages in real time; chat list sorts
by most recent.

---

## Phase 6 — Payments (Week 5) — handle with care

> This is the highest-risk phase. Money correctness and fraud resistance live or
> die here. Do NOT trust the client to record payment outcomes.

1. **Stripe setup**: use **test** keys first. For a true marketplace that pays
   sellers, use **Stripe Connect** (each seller gets a connected account stored
   in `users.stripeAccountId`, set server-side).
2. **Checkout**: FlutterFlow can call Stripe via its built-in payments action or
   a custom API call to **your Cloud Function** that creates a PaymentIntent.
   Prefer the Cloud Function path so secret keys never touch the client.
3. **Order lifecycle**: client creates `orders` doc as `status:"pending"`.
   A **Stripe webhook → Cloud Function** flips it to `paid`, sets `amount`,
   `platformFee`, `paymentIntentId`. The client must never write those fields
   (enforced by `firestore.rules`).
4. **Refunds/cancellations**: server-only transitions.

**Acceptance:** a test-card purchase moves an order `pending → paid` **only** via
the webhook, and the buyer sees it in `OrdersPage`. Attempting to set
`status:"paid"` from the app is rejected by rules.

---

## Phase 7 — Reviews & trust/safety (Week 5–6)

1. **Reviews**: on a completed order, buyer can create `reviews/{orderId}_{uid}`
   (deterministic id prevents duplicates). A Cloud Function recomputes
   `users.ratingAvg` / `ratingCount`.
2. **Reporting**: add a "Report" action on listings/users/messages → creates a
   `reports` doc. Admins triage via a console or an admin-only screen.
3. **Moderation**: optional ChatGPT/Claude content check on new listings before
   `status:"active"` (see AI features below).

**Acceptance:** a buyer review updates the seller's visible average; a report
creates an `open` report doc.

---

## Phase 8 — AI features (optional, Week 6)

The source positions ChatGPT for: support chatbot, listing description
generation, smart search, recommendations, review sentiment.

- **Implementation pattern:** FlutterFlow **API Call** → **your Cloud Function**
  → OpenAI. Never put the OpenAI key in the app. Add timeouts, error states, and
  a fallback message.
- **Cost control:** the API is usage-billed; cache generated descriptions and
  rate-limit per user.

---

## Phase 9 — Testing & deployment (Week 7–8)

1. **Test** (see `checklists/testing-checklist.md`): auth flows, product CRUD,
   search accuracy, payments in test mode, messaging, push, image upload,
   cross-platform.
2. **Switch Stripe to live keys**, re-test one real low-value transaction.
3. **Deploy**: FlutterFlow one-click to App Store / Play Store / Web. iOS needs
   Apple Developer + certs; Android needs signing keys + AAB upload; Web can go
   to Firebase Hosting.
4. **Pre-submission**: privacy policy, store listing, screenshots, age rating.
   See `checklists/launch-checklist.md`.

**Acceptance:** internal/TestFlight build passes the full testing checklist;
production rules are live (not test mode); one real transaction succeeds.

---

## Rollback notes (infra)

- **Firestore rules**: keep the previous `firestore.rules` in git. Roll back with
  `firebase deploy --only firestore:rules` against the prior file. Rules deploys
  are near-instant and reversible.
- **Cloud Functions**: deploy versioned; `firebase functions:delete` or redeploy
  the prior source to roll back. Webhook secrets stay in function config, not code.
- **FlutterFlow**: use branching/version history to revert a broken build before
  re-publishing. Never hot-swap live Stripe keys without a tested rollback to test
  keys.
- **Schema changes**: Firestore is schemaless, so additive fields are safe;
  removing/renaming a field requires a migration function and a rules update in
  the same change.
