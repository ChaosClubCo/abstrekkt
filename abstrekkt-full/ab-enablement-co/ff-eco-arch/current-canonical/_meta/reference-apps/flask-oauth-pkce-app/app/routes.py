"""OAuth + app routes as a Flask blueprint.

Flow (Authorization Code + PKCE, RFC 6749 + RFC 7636):

  GET /login
    -> generate PKCE pair, state, nonce
    -> stash verifier/state/nonce in the (signed, secure) session
    -> 302 to the IdP authorize URL with code_challenge=S256

  GET /oauth2/callback?code&state
    -> reject if code or state missing            (400)
    -> reject if state != session state           (400, session cleared)  [CSRF]
    -> reject if PKCE verifier missing             (400, session cleared)
    -> exchange code + code_verifier for tokens
    -> fetch userinfo, encrypt tokens, store in session
    -> 302 to "/"  (fixed target — no open redirect)

Session-fixation defence: on successful auth the temporary OAuth params
are popped and a fresh authenticated marker is written; combined with
Flask's signed-cookie sessions and ``session.clear()`` on every error,
an attacker-fixed pre-login session cannot be promoted to authenticated.
"""

from __future__ import annotations

import logging

from flask import (
    Blueprint,
    current_app,
    jsonify,
    redirect,
    render_template_string,
    request,
    session,
)

from .oauth_client import OAuthClient, OAuthError
from .pkce import constant_time_equals, generate_nonce, generate_pkce, generate_state
from .security import SecurityValidator
from .tokens import decrypt_tokens, encrypt_tokens

logger = logging.getLogger(__name__)

bp = Blueprint("oauth", __name__)

_LOGIN_PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Secure OAuth + PKCE Demo</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 520px; margin: 80px auto; text-align:center;">
<h1>Secure OAuth 2.0 + PKCE</h1>
<p>Authorization Code flow with PKCE, state/nonce CSRF protection, encrypted tokens, and secure cookies.</p>
<p><a href="/login" style="display:inline-block;padding:12px 24px;background:#2962ff;color:#fff;border-radius:6px;text-decoration:none;">Sign in</a></p>
<p><a href="/health">Health check</a></p>
</body></html>"""

_HOME_PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Signed in</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 520px; margin: 80px auto;">
<h1>Welcome{% if name %}, {{ name }}{% endif %}</h1>
<p>You are authenticated. Security features active: PKCE, state/nonce CSRF protection,
encrypted tokens at rest, secure session cookies, rate limiting, security headers.</p>
<p><a href="/me">View profile (JSON)</a> &middot; <a href="/logout">Log out</a></p>
</body></html>"""


def _client() -> OAuthClient:
    return OAuthClient(current_app.config["APP_CONFIG"])


@bp.route("/")
def index():
    if "user" in session:
        return render_template_string(_HOME_PAGE, name=session["user"].get("name"))
    return render_template_string(_LOGIN_PAGE)


@bp.route("/login")
def login():
    """Start the OAuth flow with a fresh PKCE pair + state + nonce."""
    pkce = generate_pkce()
    state = generate_state()
    nonce = generate_nonce()

    session.permanent = True
    session["pkce_verifier"] = pkce.code_verifier
    session["oauth_state"] = state
    session["oauth_nonce"] = nonce

    auth_url = _client().build_authorization_url(pkce, state, nonce)
    logger.info("OAuth flow initiated")
    return redirect(auth_url)


@bp.route("/oauth2/callback")
def callback():
    """Handle the IdP redirect, with full state + PKCE validation."""
    code = request.args.get("code")
    state_param = request.args.get("state")

    # Surface IdP-reported errors without leaking detail.
    if request.args.get("error"):
        session.clear()
        return jsonify({"error": "Authorization denied"}), 400

    if not code:
        return jsonify({"error": "Missing authorization code"}), 400
    if not state_param:
        return jsonify({"error": "Missing state parameter"}), 400

    # --- CSRF: state must match the value we stashed at /login ---
    session_state = session.get("oauth_state")
    if not session_state or not constant_time_equals(state_param, session_state):
        logger.warning("OAuth state mismatch — possible CSRF; clearing session")
        session.clear()
        return jsonify({"error": "Invalid state parameter"}), 400

    code_verifier = session.get("pkce_verifier")
    if not code_verifier:
        logger.error("Missing PKCE verifier in session")
        session.clear()
        return jsonify({"error": "Invalid session state"}), 400

    try:
        tokens = _client().exchange_code(code, code_verifier)
        profile = _client().fetch_userinfo(tokens.access_token)
    except OAuthError as exc:
        logger.error("OAuth exchange failed: %s", exc)
        session.clear()
        return jsonify({"error": "Authentication failed"}), 502

    # Persist: encrypt tokens, keep only a minimal profile in session.
    cipher = current_app.config["APP_CONFIG"].get_cipher()
    session["user"] = {
        "sub": profile.get("sub") or profile.get("id"),
        "name": profile.get("name"),
        "email": profile.get("email"),
    }
    session["encrypted_tokens"] = encrypt_tokens(cipher, tokens.to_storage())

    # Session-fixation defence: drop the one-time OAuth params.
    for key in ("pkce_verifier", "oauth_state", "oauth_nonce"):
        session.pop(key, None)

    logger.info("OAuth flow completed for user")
    return redirect("/")  # fixed target; never a caller-supplied URL


@bp.route("/me")
def me():
    """Protected route — requires an authenticated session."""
    if "user" not in session:
        return jsonify({"authenticated": False, "error": "Not authenticated"}), 401
    return jsonify({"authenticated": True, "user": session["user"]})


@bp.route("/token-status")
def token_status():
    """Protected route showing that stored tokens decrypt correctly."""
    if "user" not in session or "encrypted_tokens" not in session:
        return jsonify({"authenticated": False}), 401
    cipher = current_app.config["APP_CONFIG"].get_cipher()
    tokens = decrypt_tokens(cipher, session["encrypted_tokens"])
    if tokens is None:
        session.clear()
        return jsonify({"error": "Token store corrupt; please re-authenticate"}), 401
    return jsonify(
        {
            "authenticated": True,
            "has_access_token": bool(tokens.get("access_token")),
            "has_refresh_token": bool(tokens.get("refresh_token")),
            "token_type": tokens.get("token_type"),
        }
    )


@bp.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@bp.route("/health")
def health():
    cfg = current_app.config["APP_CONFIG"]
    validator = SecurityValidator(cfg)
    audit_passed = validator.run()
    return jsonify(
        {
            "status": "healthy",
            "environment": cfg.env,
            "security": {
                "audit_passed": audit_passed,
                "features": [
                    "PKCE (S256)",
                    "state CSRF protection",
                    "OIDC nonce",
                    "token encryption at rest",
                    "rate limiting",
                    "security headers",
                    "secure cookies",
                ],
            },
            "oauth": {
                "client_configured": bool(cfg.oauth_client_id),
                "redirect_uri": cfg.redirect_uri,
            },
        }
    )
