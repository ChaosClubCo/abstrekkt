# Secure Flask OAuth 2.0 + PKCE Application

> Reconstructed from source chat
> `Secure Flask OAuth Application with PKCE` (uuid `aaeca38e…`, batch-0001).
> The source built a Google-specific Flask OAuth app across several
> artifacts (`main.py`, `secrets_config.py`, `security_middleware.py`,
> `api_routes.py`, tests, Docker/Nginx, a setup guide). This package
> consolidates that work into a **runnable, modular, provider-agnostic**
> Authorization Code + PKCE app with a real pytest suite that runs offline.

## 1. Executive Summary

A production-shaped **Flask OAuth 2.0 Authorization Code + PKCE** application,
split into clean modules behind an app factory. It implements the full
browser redirect flow against any RFC 6749 / RFC 7636 identity provider:
generate a PKCE pair + `state` + `nonce`, redirect to the IdP, validate the
callback (state match, PKCE verifier present), exchange the code with the
`code_verifier`, fetch the user profile, **encrypt tokens at rest** (Fernet),
and expose a protected route. Security posture is hardened by default:
HttpOnly/Secure/SameSite session cookies, a full set of security headers
(incl. CSP), rate limiting on auth endpoints, CSRF protection, and a startup
security self-audit that refuses to boot insecurely in production.

The source targeted Google specifically and pulled in the Google auth SDK,
Redis, psutil, and an Nginx/Docker stack. This reconstruction keeps the
**security properties** but makes the OAuth client provider-agnostic and
isolates the network boundary into two methods, so the test suite is fully
deterministic and offline. No real client IDs or secrets are included —
`.env.example` ships placeholders only.

## 2. Build

Requirements: Python 3.9+ (developed/verified on 3.13).

```bash
cd flask-oauth-pkce-app
python -m venv .venv
# Windows:  .venv\Scripts\activate
# POSIX:    source .venv/bin/activate
pip install -r requirements-dev.txt        # runtime + pytest
cp .env.example .env                        # then edit .env (placeholders only)
```

Run the tests (primary quality gate):

```bash
pytest
# 19 passed
```

Run the app locally (after filling in `.env` with a real IdP client):

```bash
python run.py            # dev server on http://127.0.0.1:5000
# production:
gunicorn "app:create_app()" --bind 0.0.0.0:5000 --workers 4
```

## 3. Output (file tree)

```
flask-oauth-pkce-app/
├── README.md                 (this file)
├── run.py                    dev/prod entrypoint; startup security audit
├── requirements.txt          runtime deps (Flask, Flask-WTF, Flask-Limiter, cryptography, requests, gunicorn)
├── requirements-dev.txt      runtime + pytest
├── pytest.ini                pytest config
├── .env.example              env template — PLACEHOLDERS ONLY, no real secrets
├── .gitignore                ignores .env, caches, venvs
├── app/
│   ├── __init__.py           exposes create_app
│   ├── factory.py            app factory: wires CSRF, rate limiting, headers, errors, blueprint
│   ├── config.py             AppConfig: env loading, secret validation, secure cookie settings
│   ├── pkce.py               PKCE S256, state, nonce, constant-time compare (pure functions)
│   ├── tokens.py             Fernet encrypt/decrypt tokens at rest (None on tamper)
│   ├── oauth_client.py       provider-agnostic OAuth client; network boundary isolated
│   ├── security.py           security headers + SecurityValidator self-audit
│   └── routes.py             blueprint: / /login /oauth2/callback /me /token-status /logout /health
└── tests/
    ├── conftest.py           secret-free AppConfig + fake OAuth network boundary
    ├── test_pkce.py          PKCE/state/nonce unit tests
    ├── test_tokens.py        encryption roundtrip + tamper/wrong-key rejection
    └── test_oauth_flow.py    PKCE happy path + security edge cases (state mismatch, etc.)
```

### Routes

| Route               | Auth | Purpose                                              |
|---------------------|------|------------------------------------------------------|
| `GET /`             | no   | Landing page (login link or welcome)                 |
| `GET /login`        | no   | Start flow: PKCE + state + nonce, 302 to IdP         |
| `GET /oauth2/callback` | no | Validate state/PKCE, exchange code, set session     |
| `GET /me`           | yes  | Protected JSON profile (401 if unauthenticated)      |
| `GET /token-status` | yes  | Protected; proves stored tokens decrypt              |
| `GET /logout`       | no   | Clear session                                        |
| `GET /health`       | no   | Health + security self-audit result                  |

## 4. Implementation Considerations

- **App factory** (`create_app`) accepts an optional `AppConfig`, so tests
  inject a fully-formed, secret-free config without touching the environment.
- **Provider-agnostic**: set `OAUTH_AUTHORIZE_URL` / `OAUTH_TOKEN_URL` /
  `OAUTH_USERINFO_URL` for any IdP (Google, Okta, Auth0, Entra ID, etc.).
  Register a "Web application" client and set its redirect URI to
  `<BASE_URL>/oauth2/callback`.
- **Network boundary isolated** in `OAuthClient.exchange_code` /
  `.fetch_userinfo` — the two methods tests monkeypatch. No third-party
  OAuth SDK is required for the core flow.
- **Tokens never stored in plaintext**: only a minimal profile (`sub`,
  `name`, `email`) plus a Fernet-encrypted token blob live in the signed
  session cookie.
- **Auto-generated dev keys**: in `development`/`testing`, missing
  `SECRET_KEY`/`ENCRYPTION_KEY` are generated with a loud warning. In
  `production` they are **required** — auto-generation is refused.
- **Optional extras degrade gracefully**: if Flask-WTF or Flask-Limiter is
  absent, the app still imports and logs a warning (use the pinned
  `requirements.txt` for the full posture).

## 5. Performance / Security Notes

Security properties carried from the source and enforced here:

- **PKCE (RFC 7636, S256)** — `code_verifier` is 32 random bytes
  (43-char base64url); `code_challenge` is its SHA-256 transform. Protects
  against authorization-code interception.
- **State CSRF protection** — a random `state` is stored server-side
  (signed session) and compared in constant time on callback; mismatch ⇒
  `400` + `session.clear()`.
- **OIDC nonce** — generated and sent on the authorize request to bind the
  session to the eventual ID token.
- **Encrypted tokens at rest** — Fernet (AES-128-CBC + HMAC); decryption
  failures return `None` (treated as "re-authenticate"), never raise.
- **Secure cookies** — `HttpOnly` always; `Secure` when `FORCE_HTTPS`;
  `SameSite=Lax` (so the IdP redirect still carries the cookie).
- **Security headers** — HSTS (when HTTPS), `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`, a
  restrictive **CSP**, and `Permissions-Policy`.
- **Rate limiting** — global default plus tighter limits on `/login`
  (5/min) and `/oauth2/callback` (10/min). Use Redis
  (`RATELIMIT_STORAGE_URI`) for multi-process deployments.
- **No open redirect** — the callback always redirects to a fixed `/`,
  never a caller-supplied return URL.
- **Session-fixation defence** — one-time OAuth params are popped on
  success; every error path clears the session.

Performance: the flow is two outbound HTTP calls (token + userinfo) with a
10s timeout each; everything else is in-process. The dev server is
single-process — use gunicorn with multiple workers + a shared rate-limit
store in production.

### Smoke test

```bash
pytest -q                                  # 19 passed
python run.py                              # then, in another shell:
curl -s http://127.0.0.1:5000/health | python -m json.tool
# -> {"status":"healthy", "security":{"audit_passed":true, ...}}
```

## 6. Risk Checklist

| Risk                  | Status in this build                                                        |
|-----------------------|----------------------------------------------------------------------------|
| Auth gaps             | Protected routes (`/me`, `/token-status`) return 401 without a session.     |
| Secrets handling      | No secrets in code; `.env.example` placeholders; prod refuses weak keys.    |
| Session fixation      | One-time OAuth params popped on success; session cleared on every error.    |
| Open redirect (callback) | Callback always redirects to fixed `/`; no `next`/return-URL honoured.   |
| CSRF                  | `state` validated (constant-time) + Flask-WTF CSRF on forms.                |
| Rate limiting         | Per-endpoint limits on auth routes; configurable global limit.              |
| Observability         | Structured logging; `/health` exposes audit result. (No metrics/Sentry yet.)|
| Missing tests         | 19 tests: PKCE happy path + state/PKCE/auth edge cases + token tamper.      |
| Dependency drift      | All deps pinned in `requirements*.txt`.                                     |
| Token replay/expiry   | `expires_in` stored; **automatic refresh is NOT implemented** (see §7).     |

## 7. Recommended Next Steps

1. **ID-token verification** — verify the IdP's ID token signature (JWKS)
   and check `nonce`/`aud`/`iss`/`exp` (the source relied on the Google SDK
   for this; provider-agnostic verification is left as an integration step).
2. **Token refresh** — implement refresh-token rotation before `expires_in`
   lapses; the source sketched a `TokenManager` for this.
3. **Server-side session store** — move sessions from the cookie to Redis
   for revocation and larger payloads.
4. **Shared rate-limit backend** — set `RATELIMIT_STORAGE_URI` to Redis for
   multi-worker correctness.
5. **Observability** — add request metrics and error tracking (e.g. Sentry).
6. **CI** — run `pytest` on every push; add `pip-audit` for dependency CVEs.

## 8. Acceptance Criteria

- [x] App factory creates a runnable Flask app from an injected config.
- [x] `/login` issues a 302 with `code_challenge_method=S256`, `state`, `nonce`.
- [x] Callback rejects missing code, missing state, and **state mismatch** (400).
- [x] PKCE happy path authenticates and stores **encrypted** tokens.
- [x] Protected routes return 401 unauthenticated, 200 authenticated.
- [x] Token blob decrypts back to the original; tampering ⇒ `None`.
- [x] Security headers present on responses; `/health` audit passes.
- [x] `pytest` green (19 passed); no real secrets anywhere in the package.

## 9. Troubleshooting

- **`ConfigError: Missing required environment variable: OAUTH_CLIENT_ID`** —
  copy `.env.example` to `.env` and fill the OAuth fields, or export them.
- **`Invalid state parameter` on callback** — cookies disabled, or the
  browser dropped the session between `/login` and the callback; ensure the
  IdP redirect URI exactly matches `<BASE_URL>/oauth2/callback`.
- **`ENCRYPTION_KEY is not a valid Fernet key`** — generate one with
  `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`.
- **Rate-limit warning about in-memory storage** — expected in dev; set
  `RATELIMIT_STORAGE_URI=redis://…` in production.
- **Token endpoint returns HTTP 4xx** — verify client ID/secret and that the
  redirect URI registered with the IdP matches exactly.

## 10. Rollback Notes

This package is self-contained and stateless beyond the session cookie:

- To disable: stop the process (`run.py` / gunicorn). No DB migrations or
  external state are created by the app itself.
- If you introduced a Redis session/rate-limit store, point the env vars
  back to defaults (in-memory) and restart; no data migration needed.
- To revert dependency changes, restore the pinned `requirements.txt` and
  reinstall into a fresh venv.
- Rotating `SECRET_KEY`/`ENCRYPTION_KEY` invalidates existing sessions and
  encrypted token blobs — expected; users simply re-authenticate.

## 11. CLAIMS CHECK

- **Verified (in source):** Authorization Code + PKCE (S256) flow,
  PKCE verifier/challenge generation via `secrets`/`hashlib`, `state`
  CSRF validation with `session.clear()` on mismatch, Fernet token
  encryption at rest, secure session cookies (HttpOnly/Secure/SameSite),
  security headers, rate limiting on auth endpoints, a `SecurityValidator`
  self-audit, a `/health` endpoint, and a pytest/unittest suite covering
  PKCE generation, encryption, missing-code, missing-state, and invalid-state.
- **Verified (this build, executed):** `pytest` → **19 passed** on Python
  3.13; app boots and `/`, `/login`, `/health`, `/me` respond as expected
  (`/health` audit `true`, `/me` 401 unauthenticated).
- **Inferred (this kit):** the app-factory split into `config/pkce/tokens/
  oauth_client/security/routes/factory`, the **provider-agnostic** OAuth
  client (source was Google-specific), the isolated network boundary for
  offline tests, the OIDC `nonce`, and the fixed-target redirect to remove
  open-redirect surface. These restructure the source's intent; they are not
  verbatim source code.
- **Unresolved / caveats:** ID-token signature/`nonce`/`aud` verification is
  **not** implemented here (the source delegated this to the Google SDK);
  automatic **token refresh** is sketched in the source (`TokenManager`) but
  not wired in this build; rate limiting uses in-memory storage by default
  (not production-safe across workers); the Nginx/Docker/Redis deployment
  stack and the `security_middleware.py`/`api_routes.py` extras from the
  source were intentionally **not** materialized to keep this a focused,
  runnable core.
- **Contradictions:** the source's `test_app.py` used a Fernet
  `ENCRYPTION_KEY` value (`"test-key-for-encryption-testing-only="`) that is
  **not** a valid Fernet key — those tests would have failed as written.
  This build generates a valid key in the test fixture instead. The source
  also mixed Flask `2.3.3` (Docker requirements) and `3.0.0`
  (`requirements.txt`); this build pins a single consistent Flask 3.x.
