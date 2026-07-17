# Testing Checklist — FlutterFlow Marketplace

> From the source's testing sections, expanded with negative/security tests the
> source did not include (a marketplace that only tests the happy path ships
> exploitable). Run on at least two real accounts (a buyer and a seller).

## Auth
- [ ] Email/password register → `users/{uid}` doc created.
- [ ] Login, logout, password reset, Google sign-in.
- [ ] Session persists across app restart.
- [ ] **Negative:** signed-out user cannot read private data.

## Products (CRUD)
- [ ] Create listing with images; appears in browse.
- [ ] Edit own listing; changes persist.
- [ ] **Negative:** user B cannot edit/delete user A's listing (rule-denied).
- [ ] Price stored as integer cents; displays correctly formatted.

## Search & filtering
- [ ] Keyword search returns expected results (array-contains on `searchKeywords`).
- [ ] Category filter + price sort (composite indexes exist; no "needs index" error).
- [ ] Empty/no-results state renders cleanly.

## Messaging
- [ ] Same buyer/seller pair always reuses one chat (deterministic `chatId`).
- [ ] Messages appear in real time both directions.
- [ ] Chat list sorts by `lastMessageAt`.
- [ ] **Negative:** a third user cannot read someone else's chat.

## Payments (test mode first)
- [ ] Buy creates a `pending` order.
- [ ] Stripe test card completes; webhook flips order to `paid`.
- [ ] **[SECURITY] Negative:** client write of `status:"paid"` is rejected.
- [ ] **[SECURITY] Negative:** `createPaymentIntent` with a tampered amount uses the server price, not the client's.
- [ ] Payment failure path shows an error and leaves order `pending`.

## Reviews & trust/safety
- [ ] Review on a completed order updates `users.ratingAvg`.
- [ ] **Negative:** duplicate review for same order is blocked (deterministic id).
- [ ] Report creates an `open` report; admin can see it.

## Storage
- [ ] Image upload works; **Negative:** non-image / >5MB upload rejected.
- [ ] **Negative:** user cannot upload to another user's `product_images/{uid}` path.

## Cross-platform / performance
- [ ] iOS, Android, and Web (if shipping) render correctly.
- [ ] Lists paginate / scroll smoothly with 100+ items.
- [ ] Images lazy-load / are reasonably sized.
- [ ] Push notification delivered for a new message (if implemented).

## AI features (if enabled)
- [ ] OpenAI call routes through Cloud Function (key never in client).
- [ ] Timeout + error fallback render gracefully.
- [ ] Usage is rate-limited per user.
