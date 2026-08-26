# Firestore Data Model — FlutterFlow Marketplace

> Reconstructed and hardened from the source chat's collection sketch
> (`/users`, `/products`, `/orders`, `/messages`). The source listed bare
> field names; this version specifies types, required/optional, indexing,
> ownership, and the trust-and-safety fields a real marketplace needs.

This is the **canonical schema** the security rules (`firebase/firestore.rules`)
and FlutterFlow custom data types must match. If you change a field here,
change it there too.

---

## Conventions

- **Document IDs**: use Firebase auto-IDs unless noted. `users/{uid}` uses the
  Firebase Auth UID as the document ID (this is what the security rules key on).
- **Timestamps**: Firestore `timestamp` type, set with server time, never client time.
- **Money**: store as **integer minor units** (cents), never floats. `price: 2500`
  means $25.00. Floats cause rounding drift in payouts.
- **Ownership field**: every writable doc carries an owner id (`sellerId`,
  `buyerId`, or `uid`) so rules can enforce isolation.
- **Soft delete**: prefer `status: "archived"` over hard deletes so orders keep
  referential integrity.

---

## Collection: `users/{uid}`

User profile. One doc per authenticated user. A user may be both buyer and seller.

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `uid` | string | yes | Mirror of doc ID = Auth UID. |
| `displayName` | string | yes | Public name shown on listings. |
| `email` | string | yes | From Auth; do NOT expose in public reads. |
| `photoUrl` | string | no | Storage URL of avatar. |
| `bio` | string | no | Seller blurb. |
| `roles` | array<string> | yes | Subset of `["buyer","seller"]`. Drives UI + rules. |
| `isVerified` | bool | yes | Identity/KYC verified. Default `false`. **Server-set only.** |
| `ratingAvg` | number | yes | Aggregate seller rating 0–5. **Cloud Function-maintained.** |
| `ratingCount` | int | yes | Number of reviews. Default `0`. |
| `stripeAccountId` | string | no | Stripe Connect account id. **Server-set only.** |
| `status` | string | yes | `active` \| `suspended` \| `banned`. Default `active`. |
| `fcmTokens` | array<string> | no | Device push tokens. |
| `createdAt` | timestamp | yes | Server time. |
| `updatedAt` | timestamp | yes | Server time. |

**Privacy note:** `email`, `fcmTokens`, and `stripeAccountId` are sensitive. Rules
below restrict reads of the full doc to the owner; build a separate
`publicProfiles/{uid}` projection (displayName, photoUrl, ratingAvg, isVerified)
for public reads, or read only specific fields in FlutterFlow queries.

---

## Collection: `products/{productId}`

A marketplace listing.

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `title` | string | yes | 3–120 chars. |
| `description` | string | yes | Max ~5000 chars. |
| `price` | int | yes | Minor units (cents), `>= 0`. |
| `currency` | string | yes | ISO 4217, e.g. `"USD"`. |
| `category` | string | yes | Must match a `categories` doc id. |
| `tags` | array<string> | no | For search/filter. |
| `images` | array<string> | no | Storage URLs. Cap at e.g. 8. |
| `sellerId` | string | yes | = owner's `uid`. **Immutable after create.** |
| `status` | string | yes | `draft` \| `active` \| `sold` \| `removed`. |
| `inventory` | int | no | Stock count if applicable. |
| `searchKeywords` | array<string> | no | Lowercased tokens; powers prefix search. |
| `flagCount` | int | yes | Trust & safety. Default `0`. Server-maintained. |
| `createdAt` | timestamp | yes | Server time. |
| `updatedAt` | timestamp | yes | Server time. |

**Indexes (composite) you will need:**
- `category` ASC + `createdAt` DESC (browse by category, newest first)
- `status` ASC + `price` ASC (active listings, price sort)
- `sellerId` ASC + `createdAt` DESC (seller dashboard)
- `searchKeywords` ARRAY_CONTAINS + `createdAt` DESC (keyword search)

Firestore will print the exact composite-index creation link in the console the
first time a query needs one. Capture those into `firestore.indexes.json`.

---

## Collection: `orders/{orderId}`

A purchase. Private to its two participants and admins.

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `productId` | string | yes | Reference to product. |
| `productTitle` | string | yes | Denormalized snapshot (listing may change). |
| `buyerId` | string | yes | Owner (buyer). Immutable. |
| `sellerId` | string | yes | Immutable. |
| `amount` | int | yes | Minor units charged. |
| `currency` | string | yes | ISO 4217. |
| `platformFee` | int | yes | Commission taken, minor units. Server-set. |
| `status` | string | yes | `pending` \| `paid` \| `shipped` \| `completed` \| `refunded` \| `cancelled`. |
| `paymentIntentId` | string | no | Stripe PaymentIntent id. **Server-set only.** |
| `createdAt` | timestamp | yes | Server time. |
| `updatedAt` | timestamp | yes | Server time. |

**Critical:** `status`, `amount`, `platformFee`, and `paymentIntentId` must be
written by a **trusted Cloud Function reacting to Stripe webhooks**, never by the
client. A client that can set `status: "paid"` can get goods for free. See
`firebase/cloud-functions-outline.md`.

---

## Collection: `chats/{chatId}` with subcollection `messages/{messageId}`

Buyer–seller messaging.

`chats/{chatId}`:

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `participants` | array<string> | yes | Exactly two uids. Used by rules + queries. |
| `lastMessage` | string | no | Denormalized preview. |
| `lastMessageAt` | timestamp | no | For sorting chat list. |
| `createdAt` | timestamp | yes | Server time. |

`chats/{chatId}/messages/{messageId}`:

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `senderId` | string | yes | Must be in parent `participants`. |
| `text` | string | no | Message body (or null if image-only). |
| `imageUrl` | string | no | Storage URL. |
| `readBy` | array<string> | no | uids that have read it. |
| `createdAt` | timestamp | yes | Server time. |

**Index:** `chats` where `participants` ARRAY_CONTAINS current uid + `lastMessageAt` DESC.

---

## Collection: `reviews/{reviewId}`

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `productId` | string | yes | Reviewed product. |
| `sellerId` | string | yes | Denormalized for seller rating aggregation. |
| `authorId` | string | yes | Reviewer uid. Owner. |
| `orderId` | string | yes | Must reference a completed order (enforce in function). |
| `rating` | int | yes | 1–5. |
| `text` | string | no | Max ~2000 chars. |
| `createdAt` | timestamp | yes | Server time. |

**Rule of thumb:** allow exactly one review per `(authorId, orderId)`. Enforce by
using a deterministic doc id `${orderId}_${authorId}` so a duplicate create
collides. Recompute `users.ratingAvg` in a Cloud Function on review write.

---

## Collection: `categories/{categoryId}` (admin-managed reference data)

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `name` | string | yes | Display label. |
| `sortOrder` | int | no | UI ordering. |
| `active` | bool | yes | Hide retired categories. |

Read-only to clients; written only by admins (custom claim `admin: true`).

---

## Collection: `reports/{reportId}` (trust & safety)

User-submitted flags on listings/users/messages.

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `targetType` | string | yes | `product` \| `user` \| `message`. |
| `targetId` | string | yes | Reported entity id. |
| `reporterId` | string | yes | Owner. |
| `reason` | string | yes | Enum of reasons. |
| `status` | string | yes | `open` \| `reviewing` \| `resolved`. Default `open`. |
| `createdAt` | timestamp | yes | Server time. |

Clients can create; only admins can read all / update status.

---

## What changed vs. the source chat (honesty note)

The source only sketched four collections with untyped fields and a `profile:
object` blob. This model: (1) splits sensitive user fields out of public reads,
(2) adds `reviews`, `categories`, `reports` (a marketplace needs trust & safety),
(3) marks server-only fields to close the "client sets status=paid" hole, (4)
specifies money as integer cents, and (5) lists the composite indexes the
source's queries imply but never named.
