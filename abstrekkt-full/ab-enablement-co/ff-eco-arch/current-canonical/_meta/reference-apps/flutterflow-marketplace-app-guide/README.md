# FlutterFlow Marketplace App — Build Guide & Backend Kit (ZIP_SPEC)

> Reconstructed from source chat
> `FlutterFlow Marketplace App Development Guide` (uuid `c5272ffd…`, batch-0001).
> The source was a long human-authored guide (with a brief assistant critique)
> for building a buyer↔seller marketplace app using **FlutterFlow + Firebase +
> ChatGPT**, with a sketch data model, example Firestore rules, and Stripe
> payments. This package turns that prose into **working, deployable artifacts**:
> a phased build guide, a hardened Firestore data model, concrete FlutterFlow
> actions/custom functions, locked-down Firebase security rules + Cloud Functions
> outline, and launch/testing/risk checklists.

## 1. Executive Summary

A **production-oriented build kit** for shipping a FlutterFlow marketplace app
without the foot-guns the source guide left open. You get a step-by-step,
phase-by-phase build sequence (named screens, widgets, and Firebase wiring), a
**typed Firestore data model** (users / products / orders / chats / reviews /
categories / reports) that money- and trust-fields are designed around, the exact
**FlutterFlow action chains and Dart custom functions** the build needs, and a
**locked-down security layer** (Firestore rules, Storage rules, and the Cloud
Functions that must own payment/trust transitions). The source treated payments
and security optimistically ("start in test mode", "add your API keys"); this kit
makes the honest, secure choices explicit: Firestore is default-deny, order
`status`/`amount` are server-only, secrets live in Secret Manager, and a risk
register maps every marketplace hazard to a mitigation that ships in the box.

## 2. Build (how this was reconstructed)

- Read the source chat once; extracted its phases, the 4-collection data sketch,
  the example security rules, the Stripe/ChatGPT integration intent, and the
  cost/ROI framing.
- **Materialized** the guidance into artifacts: typed schema, action chains,
  Dart functions, deployable rules, and a Cloud Functions outline that closes
  the client-trust holes implied by the rules.
- **Hardened** every place the source was open-by-default (test-mode Firestore,
  unspecified Storage rules, keys "in the app", client-written order status).
- Added the layers the source omitted: trust & safety (`reports`, moderation),
  observability, negative/security tests, and an ownership/rollback plan.

## 3. Output (file tree)

```
flutterflow-marketplace-app-guide/
├── README.md                              (this file)
├── guide/
│   └── build-guide.md                     phased build (Phase 0→9), screens, wiring, rollback
├── data-model/
│   └── firestore-data-model.md            typed collections/fields, indexes, server-only fields
├── prompts/
│   └── flutterflow-actions-and-functions.md  action chains + Dart custom functions
├── firebase/
│   ├── firestore.rules                    locked-down, default-deny rules (deployable)
│   ├── storage.rules                      per-user, image-only, size-capped (deployable)
│   ├── firebase-config.example.md         placeholders + secret-handling guidance
│   └── cloud-functions-outline.md         createPaymentIntent, stripeWebhook, rating, mirror
└── checklists/
    ├── launch-checklist.md                go-live gate with [BLOCKER] items
    ├── testing-checklist.md               happy-path + negative/security tests
    └── risk-register.md                   16 risks mapped to mitigations + ownership
```

The signature artifacts are `firebase/firestore.rules` (a real, deployable
default-deny ruleset) and `guide/build-guide.md` (the do-this-now sequence).

## 4. Usage steps

1. Read `guide/build-guide.md` top to bottom — it sequences everything else.
2. Model collections per `data-model/firestore-data-model.md` in both Firebase
   and FlutterFlow (types must match exactly).
3. Build screens/actions using `prompts/flutterflow-actions-and-functions.md`.
4. **Before inviting users**, deploy `firebase/firestore.rules` and
   `firebase/storage.rules`:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```
5. Set secrets per `firebase/firebase-config.example.md`; deploy the functions in
   `firebase/cloud-functions-outline.md`.
6. Work `checklists/testing-checklist.md`, then gate go-live on
   `checklists/launch-checklist.md`.

## 5. Implementation Considerations

- **Schema is the contract.** `firestore-data-model.md` is canonical; rules and
  FlutterFlow custom types must mirror it. Drift causes silent permission denials.
- **Cloud Functions are not optional.** The rules deliberately reject client
  writes to money/trust fields, so the functions (Admin SDK) must exist to set
  them. This requires the Firebase **Blaze** plan.
- **Test mode is for the first hour only.** The source's "start in test mode" is
  fine for a sandbox; it is a critical vulnerability in anything real.
- **Money is integer cents** end to end. Never introduce floats into prices,
  amounts, or fees.
- **Stripe Connect** is the right model if you pay sellers; plain charges only
  fit if the platform is the merchant of record.

## 6. Performance / Security Notes

- **Default-deny Firestore + Storage** rules; PII split out of public reads via a
  `publicProfiles` projection.
- **Secrets server-side only** — Stripe secret, webhook secret, and OpenAI keys
  live in Secret Manager, never in the app or repo; client Firebase config and
  Stripe publishable key are the only client-visible keys (and even the Firebase
  apiKey should be API-restricted).
- **Payment integrity**: amount is taken from the server's order doc; only a
  signature-verified webhook marks an order paid; webhooks are idempotent.
- **Performance**: composite indexes are enumerated for every browse/search/sort
  query; images are size-capped and lazy-loaded; lists paginate.
- **Observability** (added, not in source): Crashlytics, Analytics on key
  funnels, and alerts on webhook/payment-failure spikes plus budget alerts.

## 7. Validation / Acceptance Criteria

- [ ] `firestore.rules` deployed; test mode confirmed OFF.
- [ ] `storage.rules` deployed (image-only, size-capped, per-user scope).
- [ ] No secret keys present in app or repo.
- [ ] Sign-up creates a `users/{uid}` doc; rules deny self-granting trust fields.
- [ ] Seller cannot edit another seller's product; buyer cannot read others' orders/chats.
- [ ] Client write of `order.status="paid"` is **rejected**; webhook sets it instead.
- [ ] `createPaymentIntent` uses server price, not client-supplied amount.
- [ ] Search/filter run without "needs index" errors (indexes deployed).
- [ ] Reviews update seller rating; duplicate review blocked.
- [ ] Launch-checklist has zero unchecked **[BLOCKER]** items.
- [ ] CLAIMS CHECK reviewed (below).

## 8. Troubleshooting

- **"Missing or insufficient permissions"** → a rule denied the write. Check the
  doc's owner field matches the signed-in uid, and that you're not touching a
  server-only field. Confirm the `users/{uid}` doc exists.
- **"The query requires an index"** → click the console link Firestore prints,
  create it, and save it to `firestore.indexes.json`.
- **Order never becomes `paid`** → webhook isn't reaching the function, or the
  signing secret is wrong. Check Stripe dashboard webhook deliveries and function
  logs; verify `STRIPE_WEBHOOK_SECRET`.
- **Reads return empty in FlutterFlow but data exists** → FlutterFlow field types
  don't match the data model (e.g. number vs string). Re-sync types.
- **AI call fails / leaks key** → never call OpenAI from the client; route through
  the Cloud Function. Add timeout + fallback.

## 9. Rollback Notes (infra)

- **Rules**: keep prior `firestore.rules` / `storage.rules` in git; redeploy to
  revert (near-instant, reversible).
- **Functions**: versioned — redeploy prior source or delete the bad function.
  Disable the Stripe webhook endpoint to halt payment processing without data
  loss (orders stay `pending`).
- **FlutterFlow**: use branching/version history to revert a broken build before
  publishing; never swap live Stripe keys without a tested fallback to test keys.
- **Schema**: additive fields are safe; renames/removals need a migration
  function + matching rules update in the same change.

## 10. Recommended Next Steps

1. Implement and deploy the Cloud Functions (they're an outline, not finished
   code) and write integration tests for the payment path.
2. Stand up `firestore.indexes.json` from the indexes enumerated in the data model.
3. Add the `publicProfiles` mirror function so the catalog never reads private user docs.
4. Build the admin/moderation surface for `reports` and assign trust & safety ownership.
5. Add content moderation (AI or manual) as a gate before listings go `active`.
6. Wire observability (Crashlytics, Analytics, alerting) before first real users.

## 11. CLAIMS CHECK

- **Verified (in source):** the FlutterFlow + Firebase + ChatGPT stack; the
  phased/weekly build approach; the four core collections (`users`, `products`,
  `orders`, `messages`); the example Firestore rules (users own their data,
  products public-read/owner-write, orders private to participants); Stripe
  payments and OpenAI/ChatGPT feature intent; Firebase Auth (email/Google),
  Storage for images, and Cloud Functions usage; the deploy-to-stores flow.
- **Inferred (this kit):** the typed/expanded data model (field types, indexes,
  server-only fields), the added `reviews`/`categories`/`reports` collections,
  the deterministic chat/review ids, the Dart custom functions, the Cloud
  Functions outline (`createPaymentIntent`/`stripeWebhook`/rating/mirror), the
  Storage rules, the default-deny rewrite of the Firestore rules, and all
  checklists/risk register. These are this kit's construction, consistent with
  the source's intent but not verbatim from it.
- **Unresolved / caveats:** the Cloud Functions are an **outline**, not
  paste-and-run production code — review and test before deploying. The source's
  cost/ROI/marketing figures ("$500–$2,500", "30–40% / 60–80% faster", "scales to
  millions", "4–8 weeks") are **vendor/source claims**, not independently
  verified; the 8-week timeline is the honest end once payments + trust & safety +
  store review are included. FlutterFlow/Firebase/Stripe pricing and exact UI
  menu paths change over time — verify against current docs.
- **Contradictions (flagged, not smoothed):** the source says to "start Firestore
  in test mode" AND to use security rules — these conflict for anything beyond a
  sandbox. This kit resolves it explicitly: test mode for the first hour of local
  dev only, then ship the default-deny rules. The source also implies clients can
  manage orders/payments directly while showing participant-scoped order rules;
  this kit removes the contradiction by making all money/status transitions
  server-only.
