# Firebase / Stripe / OpenAI Config — Example & Handling

> SAFETY: This file contains **placeholders only**. Never commit real keys.
> The source chat repeatedly said "add your API keys" without saying where keys
> should and shouldn't live. This document fills that gap.

---

## 1. Firebase client config (safe to ship in the app)

Firebase **client** config values (apiKey, authDomain, projectId, etc.) are
*identifiers*, not secrets — they're embedded in every Firebase app and are fine
to ship. Your security comes from **Firestore/Storage rules + Auth**, NOT from
hiding these. FlutterFlow injects these for you when you link the project; you
normally never paste them by hand.

```jsonc
// EXAMPLE ONLY — replace with your project's values (FlutterFlow handles this).
{
  "apiKey": "REPLACE_WITH_FIREBASE_API_KEY",        // public identifier, not a secret
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project-id.appspot.com",
  "messagingSenderId": "REPLACE_WITH_SENDER_ID",
  "appId": "REPLACE_WITH_APP_ID"
}
```

> Even though the client apiKey is public, **lock it down** in Google Cloud
> Console → Credentials → API key restrictions (restrict to your app's bundle
> ids / referrers) to limit abuse.

---

## 2. SECRET keys (must NEVER be in the app or this repo)

These belong only in **Cloud Functions runtime config** (server-side):

| Secret | Where it goes | Never |
|--------|---------------|-------|
| Stripe **secret** key (`sk_live_...` / `sk_test_...`) | Functions config / Secret Manager | In FlutterFlow, in the client, in git |
| Stripe **webhook signing secret** (`whsec_...`) | Functions config / Secret Manager | In the client |
| OpenAI API key (`sk-...`) | Functions config / Secret Manager | In the client |
| Firebase **service account** JSON | Functions runtime (auto) / CI secret store | In git, in the app |

Set them with (modern, recommended) Secret Manager:

```bash
# placeholders — supply real values interactively, do not paste into scripts
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase functions:secrets:set OPENAI_API_KEY
```

Then reference them in the function (see `cloud-functions-outline.md`).

> Stripe **publishable** key (`pk_...`) is the only payment key that may appear
> client-side. The **secret** key must stay server-side.

---

## 3. .gitignore you should have

```gitignore
# never commit these
serviceAccount*.json
google-services.json
GoogleService-Info.plist
.env
.env.*
*.keystore
*.jks
.firebase/
functions/.runtimeconfig.json
```

---

## 4. Key-rotation note

If a secret ever lands in git history or a screenshot: rotate it immediately
(Stripe dashboard / OpenAI dashboard / regenerate service account), don't just
delete the commit. Git history is recoverable; a leaked key is compromised.
