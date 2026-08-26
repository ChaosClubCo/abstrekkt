# chaosclub.co — Firestore schema (finalized)

**Stack alignment:** React 19 + Vite + Firebase (Auth, Firestore, Cloud Functions, Hosting, FCM) + Cloudflare R2 (audio) + Gemini API (Lyria audio, Imagen 4 visuals, Flash mood tagging) + Stripe ($4.99/mo premium) + PostHog.

**Design principles:**
1. **Client writes are minimal.** Most mutations go through Cloud Functions — direct client writes only for user profile updates, playlist edits, reactions, and comments.
2. **Stripe state is server-owned.** Clients read subscription status but never write it. All sub mutations come from Stripe webhooks.
3. **R2 signed URLs are server-issued.** No R2 credentials ever reach the client. Audio access for premium content goes through a Cloud Function that checks sub status and issues a short-lived signed URL.
4. **Denormalization where query cost matters.** Mood tags denormalized into `lyrics/` docs for filter/browse performance. Tag catalog kept in `moodTags/` for admin.
5. **Soft delete everywhere.** `deletedAt` field over hard delete. Cleanup job purges after 30 days.
6. **Timestamps on everything.** `createdAt`, `updatedAt` via `FieldValue.serverTimestamp()`.

---

## Collection map

```
/users/{uid}
  /playlists/{playlistId}              (subcollection)

/lyrics/{lyricId}
  /reactions/{uid}                     (subcollection — doc ID = reacting user)
  /comments/{commentId}                (subcollection)

/tracks/{trackId}

/collections/{collectionId}

/moodTags/{tagSlug}

/subscriptions/{uid}                   (doc ID = user uid, 1:1)

/stripe_customers/{uid}                (doc ID = user uid, 1:1)

/stripe_events/{eventId}               (idempotency ledger)

/scheduled_drops/{dropId}

/notifications/{notifId}

/invites/{inviteCode}                  (early access gating)

/settings/site                         (singleton — global config)
```

---

## /users/{uid}

The user profile. Doc ID is the Firebase Auth UID.

```typescript
{
  // Identity
  uid: string;                         // matches doc ID and Auth UID
  email: string;                       // mirrored from Auth
  displayName: string;                 // max 40 chars
  avatarUrl: string | null;            // Firebase Storage or R2 URL

  // Subscription (read-only snapshot — source of truth is /subscriptions/{uid})
  isPremium: boolean;                  // denormalized for fast UI checks
  premiumSince: Timestamp | null;

  // Preferences
  prefs: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    preferredTheme: "dark" | "light"; // default "dark"
    autoplay: boolean;                 // autoplay audio on lyric page
  };

  // FCM
  fcmTokens: string[];                 // multi-device. max 10. oldest evicted.

  // Engagement stats (denormalized)
  stats: {
    lyricsRead: number;
    tracksPlayed: number;
    reactionsGiven: number;
    playlistsCreated: number;
  };

  // Lifecycle
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
  deletedAt: Timestamp | null;
}
```

**Indexes:**
- `isPremium` ASC, `lastActiveAt` DESC (admin dashboards)

**Client write access:** Own profile only. Cannot write `isPremium`, `premiumSince`, `stats.*` (server-managed).

**Write patterns:**
- Auth trigger (`onCreate`) creates initial doc with Auth data + defaults.
- Auth trigger (`onDelete`) sets `deletedAt`, triggers 30-day cleanup.
- Stripe webhook updates `isPremium` + `premiumSince`.
- Client updates `displayName`, `avatarUrl`, `prefs.*`.
- Cloud Function updates `stats.*` on relevant events.

---

## /users/{uid}/playlists/{playlistId}

User-curated playlists. Subcollection under user.

```typescript
{
  playlistId: string;
  name: string;                        // max 60 chars
  description: string;                 // max 240 chars
  isPublic: boolean;                   // if true, shareable via URL
  trackIds: string[];                  // ordered. max 200 tracks.
  coverImageUrl: string | null;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}
```

**Client write access:** Owner only. Reads allowed for any authenticated user if `isPublic: true`.

---

## /lyrics/{lyricId}

The primary content unit. Doc ID is a URL-friendly slug.

```typescript
{
  lyricId: string;                     // = slug, matches doc ID
  title: string;                       // 3-80 chars
  slug: string;                        // URL-safe, matches doc ID

  // Content
  body: string;                        // the lyric itself. max 8000 chars.
  linerNote: string | null;            // max 1500 chars (150 words target)

  // Authorship
  authorUid: string;                   // ref to /users/{uid}
  authorDisplayName: string;           // denormalized for perf

  // Publication
  status: "draft" | "scheduled" | "published" | "archived";
  publishedAt: Timestamp | null;
  scheduledFor: Timestamp | null;      // set when status === "scheduled"

  // Access tier
  isPremium: boolean;                  // if true, trackRef audio gated

  // Associated media
  trackId: string | null;              // ref to /tracks/{trackId}
  visualImagenId: string | null;       // Imagen 4 image ID
  visualUrl: string | null;            // served URL for visual
  visualAltText: string;               // required for published lyrics

  // Discovery / filtering (denormalized from /moodTags/)
  moodTags: string[];                  // e.g. ["insomnia", "disquiet", "cold-city"]
  moodTagsGeneratedAt: Timestamp | null;  // when Gemini Flash last ran

  // Collection membership
  collectionIds: string[];             // refs to /collections/{collectionId}

  // Engagement (denormalized for sort/filter)
  stats: {
    readCount: number;
    reactionCount: number;
    commentCount: number;
    shareCount: number;
  };

  // Lifecycle
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}
```

**Indexes (composite):**
- `status` ASC, `publishedAt` DESC (home feed)
- `status` ASC, `isPremium` ASC, `publishedAt` DESC (free/premium filtering)
- `status` ASC, `scheduledFor` ASC (scheduled drop queue)
- `moodTags` ARRAY, `publishedAt` DESC (mood browsing)
- `collectionIds` ARRAY, `publishedAt` DESC (collection pages)

**Client write access:** NONE. All lyric writes happen through Cloud Functions with author verification.

**Write patterns:**
- `createLyric` function: author creates draft.
- `updateLyric`: author edits draft or published lyric.
- `publishLyric`: moves draft → published, runs Gemini Flash mood tagging on body, sets `publishedAt`.
- `scheduleLyric`: moves draft → scheduled with `scheduledFor`.
- Scheduled Cloud Function (Pub/Sub cron every minute): polls for `status: "scheduled"` AND `scheduledFor <= now`, flips to `published`.
- Stats updated by trigger functions on reaction/comment/read events.

---

## /lyrics/{lyricId}/reactions/{uid}

User reactions. Doc ID = reacting user's UID so a user can only have one reaction per lyric.

```typescript
{
  uid: string;                         // = doc ID
  type: "mark" | "save" | "share";     // "mark" = I've read this, "save" = for later
  createdAt: Timestamp;
}
```

**Client write access:** Authenticated user can write own reaction doc (where doc ID matches their UID) on published lyrics only.

**Write triggers:** `onWrite` fires a function that updates `/lyrics/{lyricId}/stats.reactionCount`.

---

## /lyrics/{lyricId}/comments/{commentId}

Optional per-lyric comments (gated by site setting — may not ship in v1).

```typescript
{
  commentId: string;
  authorUid: string;
  authorDisplayName: string;           // denormalized
  body: string;                        // max 1000 chars
  parentCommentId: string | null;      // for threading
  status: "visible" | "flagged" | "removed";

  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}
```

**Client write access:** Authenticated user can create own comments if site setting `commentsEnabled: true`. Can edit own comments within 15 min of creation. Cannot hard-delete.

---

## /tracks/{trackId}

Audio track metadata. R2 pointer, Lyria prompt archive, mood tags.

```typescript
{
  trackId: string;
  lyricId: string | null;              // paired lyric (can be null for standalone tracks)

  title: string;
  durationSeconds: number;

  // R2 storage reference (server-only accessible for premium tracks)
  r2Bucket: string;                    // e.g. "chaosclub-audio"
  r2Key: string;                       // e.g. "tracks/abc123.wav"
  fileFormat: "wav" | "mp3" | "flac";
  fileSizeBytes: number;

  // Generation metadata
  generatedBy: "lyria" | "human" | "hybrid";
  lyriaPromptArchive: {                // nullable if not Lyria
    prompt: string;                    // full prompt text
    model: string;                     // "lyria-3-pro" | "lyria-clip" etc
    generatedAt: Timestamp;
    seed: string | null;
  } | null;

  // Discovery
  moodTags: string[];                  // denormalized from /moodTags/
  bpm: number | null;
  key: string | null;                  // e.g. "Am"

  // Access
  isPremium: boolean;                  // if true, signed URL flow required
  previewDurationSeconds: number;      // free preview clip length, e.g. 30

  // Engagement
  stats: {
    playCount: number;
    completionCount: number;           // played to end
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}
```

**Indexes:**
- `lyricId` ASC (lookup by paired lyric)
- `moodTags` ARRAY, `createdAt` DESC
- `isPremium` ASC, `createdAt` DESC

**Client write access:** NONE. Server-only.

**Audio access flow (critical):**
1. Client requests `/api/track/{trackId}/url` (Cloud Function endpoint).
2. Function verifies Firebase Auth token.
3. Function reads `/tracks/{trackId}` → checks `isPremium`.
4. If `isPremium: true`, function reads `/subscriptions/{uid}` → verifies `status === "active"`.
5. If authorized, function generates R2 signed URL with 15-minute expiry.
6. If free tier requesting premium track, function issues signed URL to preview clip only (pre-generated `{r2Key}.preview.mp3`).
7. URL returned to client.

R2 credentials never leave the server. Signed URLs are short-lived and single-use-pattern (client immediately streams).

---

## /collections/{collectionId}

Editorial groupings — themed drops, series, chapters.

```typescript
{
  collectionId: string;
  title: string;                       // max 80 chars
  slug: string;
  description: string;                 // max 400 chars
  coverImageUrl: string | null;

  // Membership
  lyricIds: string[];                  // ordered. max 50 per collection.

  // Publication
  status: "draft" | "published" | "archived";
  publishedAt: Timestamp | null;

  // Access tier (collection-level gate, overrides lyric-level if stricter)
  isPremium: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}
```

**Indexes:**
- `status` ASC, `publishedAt` DESC

**Client write access:** NONE.

---

## /moodTags/{tagSlug}

Canonical tag catalog. Doc ID is the slug.

```typescript
{
  tagSlug: string;                     // = doc ID. e.g. "insomnia"
  label: string;                       // human-readable. e.g. "Insomnia"
  description: string;                 // what this mood encompasses
  colorHex: string;                    // for UI chip rendering
  parentTag: string | null;            // optional hierarchy

  // Generated by Gemini Flash runs
  source: "manual" | "gemini-flash";
  approvedBy: string | null;           // admin UID if curated
  status: "proposed" | "approved" | "deprecated";

  // Denormalized count for browsing
  lyricCount: number;
  trackCount: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `status` ASC, `lyricCount` DESC (most-used tags)

**Client write access:** Read-only.

**Gemini Flash pattern:** When a lyric is published, a function sends `body` + `title` to Gemini Flash with a prompt instructing it to pick 3-5 tags from existing `approved` tags, or propose new ones. New proposals land in `/moodTags/` with `status: "proposed"` — admin review flips to `approved`.

---

## /subscriptions/{uid}

Stripe subscription mirror. Doc ID = user UID (1:1).

```typescript
{
  uid: string;                         // = doc ID
  stripeCustomerId: string;
  stripeSubscriptionId: string | null; // null if never subscribed

  status: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "none";

  priceId: string;                     // Stripe price ID — e.g. "price_xxx" for $4.99/mo
  currentPeriodStart: Timestamp | null;
  currentPeriodEnd: Timestamp | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: Timestamp | null;
  endedAt: Timestamp | null;

  // Last webhook sync
  lastWebhookEventId: string | null;
  lastSyncedAt: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Client write access:** NONE. Read own doc only.

**Write pattern:** Stripe webhook → `stripeWebhookHandler` Cloud Function → verifies signature → upserts this doc → mirrors `isPremium` to `/users/{uid}`.

---

## /stripe_customers/{uid}

Stripe customer mapping.

```typescript
{
  uid: string;                         // = doc ID
  stripeCustomerId: string;
  email: string;                       // snapshot at creation

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Client write access:** NONE.

---

## /stripe_events/{eventId}

Webhook idempotency ledger. Doc ID = Stripe event ID.

```typescript
{
  eventId: string;                     // = doc ID = Stripe evt_xxx
  eventType: string;                   // e.g. "customer.subscription.updated"
  processed: boolean;
  processedAt: Timestamp | null;
  retries: number;
  lastError: string | null;

  createdAt: Timestamp;
}
```

**Client write access:** NONE.

**Write pattern:** First action of `stripeWebhookHandler` is `.create()` on this doc (will fail if event already processed). Prevents duplicate processing.

---

## /scheduled_drops/{dropId}

Midnight drops. Ties together a collection, a publish timestamp, and a notification plan.

```typescript
{
  dropId: string;
  title: string;                       // e.g. "March Drop — Cold Cities"
  dropAt: Timestamp;                   // midnight in target timezone

  timezone: string;                    // IANA, e.g. "America/Chicago"

  // What drops
  collectionId: string | null;
  lyricIds: string[];                  // direct list if no collection

  // Notification
  notifyFreeUsers: boolean;
  notifyPremiumUsers: boolean;
  notificationTitle: string;
  notificationBody: string;

  // Status
  status: "scheduled" | "firing" | "complete" | "failed";
  firedAt: Timestamp | null;
  failureReason: string | null;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `status` ASC, `dropAt` ASC (queue for scheduler)

**Client write access:** NONE.

---

## /notifications/{notifId}

FCM send queue. Each doc represents one push to one device or one broadcast.

```typescript
{
  notifId: string;
  type: "drop" | "reply" | "system";
  targetUids: string[] | "all";        // explicit or broadcast

  title: string;                       // max 60 chars
  body: string;                        // max 180 chars
  data: Record<string, string>;        // deep-link payload

  status: "queued" | "sending" | "sent" | "failed";
  sentAt: Timestamp | null;
  deliveryStats: {
    attempted: number;
    succeeded: number;
    failed: number;
  };

  createdAt: Timestamp;
}
```

**Client write access:** NONE.

---

## /invites/{inviteCode}

Early access gating (if chaosclub launches as invite-only).

```typescript
{
  inviteCode: string;                  // = doc ID
  createdByUid: string | null;         // null if admin-created
  issuedTo: string | null;             // email or name, optional
  maxUses: number;                     // default 1
  usedCount: number;
  usedByUids: string[];
  expiresAt: Timestamp | null;
  status: "active" | "exhausted" | "expired" | "revoked";

  createdAt: Timestamp;
}
```

**Client write access:** Authenticated user can read a specific invite by code (to validate) but cannot enumerate or write.

---

## /settings/site

Singleton config doc. Admin-only writes.

```typescript
{
  id: "site";                          // always this
  commentsEnabled: boolean;
  inviteOnly: boolean;
  maintenanceMode: boolean;
  homePageHeadline: string;
  homePageSubline: string;
  featuredLyricId: string | null;
  featuredCollectionId: string | null;

  // Premium pricing display
  premiumPriceDisplay: string;         // e.g. "$4.99/mo"
  premiumStripePriceId: string;

  updatedAt: Timestamp;
  updatedByUid: string;
}
```

**Client write access:** Read-only.

---

## Security rules (highlights)

```javascript
// Key enforcement patterns — not the full rules file

match /users/{uid} {
  allow read: if request.auth.uid == uid || resource.data.isPublic == true;
  allow update: if request.auth.uid == uid
    && request.resource.data.isPremium == resource.data.isPremium
    && request.resource.data.premiumSince == resource.data.premiumSince
    && request.resource.data.stats == resource.data.stats
    && request.resource.data.uid == resource.data.uid;
  allow create: if false;              // Auth trigger only
  allow delete: if false;              // soft delete only
}

match /lyrics/{lyricId} {
  allow read: if resource.data.status == "published"
    && (resource.data.isPremium == false
        || (request.auth != null
            && get(/databases/$(database)/documents/subscriptions/$(request.auth.uid)).data.status == "active"));
  allow write: if false;               // Cloud Functions only

  match /reactions/{uid} {
    allow read: if request.auth != null;
    allow write: if request.auth.uid == uid
      && get(/databases/$(database)/documents/lyrics/$(lyricId)).data.status == "published";
  }
}

match /tracks/{trackId} {
  allow read: if true;                 // metadata readable; audio gated at Function level
  allow write: if false;
}

match /subscriptions/{uid} {
  allow read: if request.auth.uid == uid;
  allow write: if false;               // webhook only
}

match /settings/site {
  allow read: if true;
  allow write: if false;               // admin SDK only
}
```

Full security rules file lives separately and should be reviewed against OWASP checklist before production deploy.

---

## Import plan for existing 100+ lyrics

1. **Prep CSV / JSON.** One row per lyric with: title, slug, body, linerNote (optional), isPremium, desiredMoodTags (optional).
2. **Dry-run validation script.** Cloud Function in a protected namespace that validates all rows against schema before writing anything.
3. **Batched import.** Firestore batch writes (max 500/batch). ~200 batches for 100 lyrics if including paired tracks.
4. **Mood tagging backfill.** Run Gemini Flash over each imported lyric to populate `moodTags[]`. Queue job, rate-limit to respect Gemini quota.
5. **Visual generation backfill.** Imagen 4 prompts derived from title + opening line. Store IDs in `visualImagenId`, upload result to R2, populate `visualUrl`.
6. **Verification pass.** Spot-check 10 random imports, verify auth gating on premium ones, confirm search/filter works against `moodTags[]`.

---

## PostHog event taxonomy (aligned with schema)

Client-side events that map to Firestore state:

```
lyric_viewed                         { lyricId, isPremium, authenticated, premium }
lyric_read_complete                  { lyricId, timeSpent }
track_play_started                   { trackId, lyricId, isPremium, authenticated, premium }
track_play_completed                 { trackId, lyricId }
track_preview_requested              { trackId, userTier }   // free user hitting premium paywall
reaction_given                       { lyricId, type }
playlist_created                     { playlistId }
subscription_checkout_started        { stripePriceId }
subscription_activated               { stripeSubscriptionId }     // from webhook mirror
subscription_canceled                { stripeSubscriptionId, reason }
```

---

## What this schema does NOT handle yet

- **Search across lyric body text.** Firestore can't full-text search. Options: (a) ship with tag/collection browsing only in v1, (b) add Algolia or Typesense integration in v2, (c) use Firestore's new vector search preview with embeddings from Gemini.
- **Collaborative playlists.** Single-author only in v1.
- **Multi-tier pricing.** Single $4.99/mo tier. If tiers expand, `subscriptions/{uid}` needs a `tier` field and access checks become tier-aware.
- **Internationalization.** All content treated as single-language (English). Adding i18n means `body`, `linerNote`, `title` become `{ en: string, ... }` maps.
- **Gifting / referrals.** Not modeled. Would add `/gifts/{giftId}` and `referredByUid` on users.

---

## Next steps to implement

1. Initialize Firebase project with these collections (empty).
2. Deploy security rules file.
3. Deploy composite indexes via `firestore.indexes.json`.
4. Write Cloud Functions:
   - `onUserCreate` (Auth trigger) — populate `/users/{uid}`
   - `onUserDelete` (Auth trigger) — soft delete + cleanup schedule
   - `stripeWebhookHandler` (HTTPS) — Stripe sub lifecycle
   - `getTrackUrl` (HTTPS callable) — R2 signed URL issuance
   - `createLyric` / `updateLyric` / `publishLyric` / `scheduleLyric` (callable)
   - `tagLyric` (background trigger on publish) — Gemini Flash mood tagging
   - `fireScheduledDrops` (cron, every 1 min) — `status: scheduled` sweep
   - `sendNotifications` (trigger on `/notifications/` create)
5. Build admin dashboard for content ops (invite-only route, Firebase Auth custom claims).
6. Run import pipeline for existing 100+ lyrics.

---

CLAIMS
- Schema supports the described stack (Firebase + R2 + Stripe + Gemini + FCM) without modification.
- R2 audio access is gated server-side; no credentials reach the client.
- Stripe state is single-source-of-truth via webhook mirror; client cannot forge premium status.
- Scheduled drops fire within ~1 minute of target time (cron resolution).

GAPS
- Full-text search on lyric body not addressed in v1.
- No defined abuse rate limits on reactions / comments / playlist creation — recommend adding Cloud Function rate limits before launch.
- Admin role model not specified — recommend Firebase Auth custom claims (`admin: true`) with security rules gating.
- No defined retention policy for PostHog events or Firestore soft-deletes beyond 30 days.
- Visual generation costs with Imagen 4 at 100+ lyric backfill not estimated — needs Gemini pricing check before batch run.

COUNTEREXAMPLES / WHERE THIS BREAKS
- If premium tier gets sub-tiers (e.g. "premium" + "archivist"), `/subscriptions/` and access checks need rework.
- If comments get high volume, per-lyric subcollection won't scale for "latest comments site-wide" queries — would need a top-level `/comments/` with denormalized `lyricId`.
- If chaosclub adds user-generated lyrics (open submissions), authorship and moderation flows need full redesign.
- If R2 signed URL issuance becomes a bottleneck at scale, consider pre-generating CDN-cacheable signed URLs with longer expiry for public (free) tracks only.
