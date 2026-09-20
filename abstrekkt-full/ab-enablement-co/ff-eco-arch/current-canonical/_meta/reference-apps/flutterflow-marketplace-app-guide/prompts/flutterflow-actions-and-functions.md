# FlutterFlow Actions & Custom Functions

> The concrete action chains and Dart custom functions the build guide refers to.
> FlutterFlow "Actions" are configured visually; here they're written as ordered
> step lists you can replicate in the Action Flow Editor. Custom Functions are
> real Dart you paste into FlutterFlow's Custom Code → Functions.

---

## Part A — Action chains (configure in the Action Flow Editor)

### A1. Sign up (email/password) + create user doc
On `SignupPage` → Sign Up button → On Tap:
1. **Authentication → Create Account (Email)** with the email/password fields.
2. **Backend Call → Create Document** in `users`:
   - Document ID = `Authenticated User → User ID` (set doc id = uid).
   - `uid` = Authenticated User UID
   - `displayName` = name field
   - `email` = email field
   - `roles` = `["buyer"]`
   - `isVerified` = `false`
   - `ratingAvg` = `0`, `ratingCount` = `0`
   - `status` = `"active"`
   - `createdAt` / `updatedAt` = **Current Time** (server)
3. **Navigate To** `HomePage` (clear stack).
4. On failure of step 1: **Show Snackbar** with the auth error.

> Without step 2 the user has an Auth account but no profile doc, and every
> security rule that reads `users/{uid}` will deny. This is the most common
> first-week bug.

### A2. Create a listing
On `SellPage` → Publish button → On Tap:
1. **Upload Media** to Storage path `product_images/{currentUserUid}/`.
2. (Custom Function) `dollarsToCents(priceText)` → integer cents.
3. (Custom Function) `buildSearchKeywords(title)` → array of lowercased tokens.
4. **Create Document** in `products`:
   - `sellerId` = currentUserUid
   - `title`, `description`, `category` (dropdown value)
   - `price` = result of step 2, `currency` = `"USD"`
   - `images` = uploaded URL list, `searchKeywords` = result of step 3
   - `status` = `"active"`, `flagCount` = `0`
   - `createdAt`/`updatedAt` = Current Time
5. **Navigate Back** + success snackbar.

### A3. Message seller (deterministic chat id)
On `ProductDetailPage` → Message Seller → On Tap:
1. (Custom Function) `chatIdFor(currentUserUid, sellerUid)` → stable id.
2. **Create Document** `chats/{chatId}` IF NOT EXISTS:
   - `participants` = `[currentUserUid, sellerUid]`
   - `createdAt` = Current Time
   *(use a "document exists" conditional or upsert pattern)*
3. **Navigate To** `ChatPage(chatId)`.

### A4. Send message
On `ChatPage` → Send → On Tap:
1. **Create Document** `chats/{chatId}/messages`:
   - `senderId` = currentUserUid, `text` = input, `createdAt` = Current Time,
     `readBy` = `[currentUserUid]`.
2. **Update Document** `chats/{chatId}`: `lastMessage` = input text,
   `lastMessageAt` = Current Time.
3. Clear the text field.

### A5. Buy (create pending order, then pay)
On `ProductDetailPage` → Buy → On Tap:
1. **Create Document** `orders`:
   - `productId`, `productTitle` (snapshot), `sellerId`, `buyerId` = currentUserUid
   - `amount` = product.price, `currency` = product.currency
   - `status` = `"pending"`, `createdAt`/`updatedAt` = Current Time
2. **API Call → your Cloud Function** `createPaymentIntent` with the order id.
   (Function returns a client secret; FlutterFlow's Stripe action completes it.)
3. Show result UI. **Do NOT set `status:"paid"` here** — the webhook does that.

### A6. Submit review
On a completed order → Leave Review → On Tap:
1. **Create Document** `reviews` with **document id** = `{orderId}_{currentUserUid}`
   (deterministic → blocks duplicates):
   - `productId`, `sellerId`, `authorId` = currentUserUid, `orderId`,
     `rating` (1–5), `text`, `createdAt` = Current Time.
2. Snackbar. (A Cloud Function recomputes `users.ratingAvg`.)

---

## Part B — Custom Functions (Dart — paste into Custom Code → Functions)

> These run client-side. Keep them pure (no secrets, no network). The build
> guide references each by name.

```dart
// dollarsToCents: "25.00" -> 2500. Avoids float money bugs.
int dollarsToCents(String priceText) {
  final cleaned = priceText.replaceAll(RegExp(r'[^0-9.]'), '');
  final value = double.tryParse(cleaned) ?? 0.0;
  return (value * 100).round();
}
```

```dart
// centsToDisplay: 2500 -> "$25.00". For UI only.
String centsToDisplay(int cents, [String symbol = '\$']) {
  return '$symbol${(cents / 100).toStringAsFixed(2)}';
}
```

```dart
// buildSearchKeywords: tokenizes a title into lowercased keywords for
// array-contains search. "Vintage Leather Bag" -> [vintage, leather, bag]
List<String> buildSearchKeywords(String title) {
  return title
      .toLowerCase()
      .replaceAll(RegExp(r'[^a-z0-9 ]'), ' ')
      .split(RegExp(r'\s+'))
      .where((t) => t.length >= 2)
      .toSet()
      .toList();
}
```

```dart
// chatIdFor: stable, order-independent chat id for two users so a buyer/seller
// pair always shares one chat document.
String chatIdFor(String uidA, String uidB) {
  final pair = [uidA, uidB]..sort();
  return '${pair[0]}_${pair[1]}';
}
```

```dart
// validateListing: lightweight client-side guard before write. Server rules are
// still the real enforcement — this is just UX.
bool validateListing(String title, String description, int priceCents) {
  if (title.trim().length < 3 || title.length > 120) return false;
  if (description.trim().isEmpty || description.length > 5000) return false;
  if (priceCents < 0) return false;
  return true;
}
```

---

## Part C — Where things must NOT live client-side

- OpenAI / Stripe **secret** keys → Cloud Function config only.
- Order `status`, `amount`, `platformFee`, `paymentIntentId` → set by webhook
  Cloud Function only; rules reject client writes (see `firestore.rules`).
- `users.isVerified`, `users.ratingAvg`, `users.stripeAccountId` → server-set only.

These restrictions are why several "actions" above stop at creating a `pending`
order and hand off to a Cloud Function rather than finishing the money flow on
the device.
