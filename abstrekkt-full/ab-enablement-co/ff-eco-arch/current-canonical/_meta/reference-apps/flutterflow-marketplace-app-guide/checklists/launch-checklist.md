# Launch Checklist — FlutterFlow Marketplace

> Consolidated from the source's "Testing & Deployment", "Pre-Deployment", and
> "App Store Requirements" sections, plus the safety items the source omitted.
> Work top to bottom. Do not ship with any **[BLOCKER]** unchecked.

## Backend hardening (do BEFORE inviting users)
- [ ] **[BLOCKER]** Firestore is NOT in test mode; `firestore.rules` deployed.
- [ ] **[BLOCKER]** Storage rules deployed (`storage.rules`).
- [ ] **[BLOCKER]** No secret keys in the app or repo (Stripe secret, OpenAI, webhook secret are in Secret Manager only).
- [ ] Composite indexes created (`firestore.indexes.json` deployed).
- [ ] Cloud Functions deployed: `createPaymentIntent`, `stripeWebhook`, `onReviewWrite`.
- [ ] Stripe switched from test to **live** keys; webhook endpoint points to the deployed function.
- [ ] Admin custom claim set for at least one moderator account.

## Payments & money correctness
- [ ] **[BLOCKER]** Order cannot be marked `paid` from the client (verified by attempting it and getting denied).
- [ ] PaymentIntent amount comes from the server's order doc, not the request body.
- [ ] One real low-value live transaction completes end-to-end and shows `paid`.
- [ ] Refund path tested (server-side transition).
- [ ] Commission/platform fee computes correctly on a real order.

## Trust & safety
- [ ] Report action works; reports land as `open`.
- [ ] Moderator can view/triage reports.
- [ ] Listing content moderation (manual or AI) in place before listings go public.
- [ ] Suspended/banned user (`status`) cannot transact.

## App functionality (smoke)
- [ ] Sign up creates a `users/{uid}` doc.
- [ ] Login / logout / password reset / Google sign-in.
- [ ] Create, edit, archive a listing (images upload).
- [ ] Browse, search (keyword), filter by category, sort by price.
- [ ] Buyer↔seller chat in real time.
- [ ] Review updates seller rating.

## Store submission
- [ ] App icons + screenshots for all device sizes (iOS + Android).
- [ ] **[BLOCKER]** Privacy policy + terms of service published and linked.
- [ ] Data-privacy compliance reviewed (GDPR/CCPA as applicable).
- [ ] Age rating + content guidelines completed.
- [ ] In-app purchase / marketplace policy compliance checked per platform.
- [ ] Apple Developer account + certs/provisioning configured (iOS).
- [ ] Android signing keys + AAB uploaded to Play Console.
- [ ] Web target deployed (Firebase Hosting) if shipping web.

## Observability (the source skipped this — add it)
- [ ] Crash reporting enabled (Crashlytics).
- [ ] Firebase Analytics events on key funnels (signup, list, buy).
- [ ] Alerts on webhook signature failures + payment failure spikes.
- [ ] Budget alerts on Firebase Blaze and OpenAI usage.

## Rollback readiness
- [ ] Previous `firestore.rules` and `storage.rules` kept in git for instant revert.
- [ ] FlutterFlow version/branch snapshot taken before publishing.
- [ ] Documented "revert to Stripe test keys" procedure if live payments misbehave.
