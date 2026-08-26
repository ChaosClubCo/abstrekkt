"""End-to-end OAuth flow tests: PKCE happy path + security edge cases."""

from __future__ import annotations

from urllib.parse import parse_qs, urlparse


# --------------------------------------------------------------------- #
# Happy path
# --------------------------------------------------------------------- #

def test_login_redirects_with_pkce_and_state(client):
    resp = client.get("/login")
    assert resp.status_code == 302

    qs = parse_qs(urlparse(resp.headers["Location"]).query)
    assert qs["response_type"] == ["code"]
    assert qs["code_challenge_method"] == ["S256"]
    assert qs["code_challenge"]      # present
    assert qs["state"]               # present
    assert qs["nonce"]               # present

    with client.session_transaction() as sess:
        assert "pkce_verifier" in sess
        assert "oauth_state" in sess
        assert sess["oauth_state"] == qs["state"][0]


def test_full_pkce_happy_path(client):
    # 1) /login seeds session state + verifier.
    login = client.get("/login")
    state = parse_qs(urlparse(login.headers["Location"]).query)["state"][0]

    # 2) IdP redirects back with code + the SAME state.
    cb = client.get(f"/oauth2/callback?code=AUTH_CODE&state={state}")
    assert cb.status_code == 302
    assert cb.headers["Location"].endswith("/")

    # 3) Session is now authenticated; one-time params are cleared.
    with client.session_transaction() as sess:
        assert sess["user"]["email"] == "test@example.com"
        assert "encrypted_tokens" in sess
        assert "pkce_verifier" not in sess
        assert "oauth_state" not in sess

    # 4) Protected routes work and tokens decrypt.
    me = client.get("/me")
    assert me.status_code == 200
    assert me.get_json()["authenticated"] is True

    ts = client.get("/token-status")
    assert ts.status_code == 200
    body = ts.get_json()
    assert body["has_access_token"] is True
    assert body["has_refresh_token"] is True


# --------------------------------------------------------------------- #
# Security edge cases
# --------------------------------------------------------------------- #

def test_state_mismatch_is_rejected(client):
    """A forged/mismatched state must be rejected (CSRF defence)."""
    client.get("/login")  # seeds a real state in the session
    resp = client.get("/oauth2/callback?code=AUTH_CODE&state=attacker-controlled")
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Invalid state parameter"
    # Session is cleared, so the attacker cannot become authenticated.
    with client.session_transaction() as sess:
        assert "user" not in sess


def test_callback_without_login_has_no_session_state(client):
    """Callback with a state but no prior /login (no session state) is rejected."""
    resp = client.get("/oauth2/callback?code=AUTH_CODE&state=whatever")
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Invalid state parameter"


def test_missing_code_rejected(client):
    state = parse_qs(urlparse(client.get("/login").headers["Location"]).query)["state"][0]
    resp = client.get(f"/oauth2/callback?state={state}")
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Missing authorization code"


def test_missing_state_rejected(client):
    client.get("/login")
    resp = client.get("/oauth2/callback?code=AUTH_CODE")
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Missing state parameter"


def test_idp_error_param_rejected(client):
    state = parse_qs(urlparse(client.get("/login").headers["Location"]).query)["state"][0]
    resp = client.get(f"/oauth2/callback?error=access_denied&state={state}")
    assert resp.status_code == 400


def test_missing_pkce_verifier_rejected(client):
    """If the PKCE verifier is gone but state matches, reject + clear."""
    client.get("/login")
    with client.session_transaction() as sess:
        state = sess["oauth_state"]
        del sess["pkce_verifier"]  # simulate a broken/forged session
    resp = client.get(f"/oauth2/callback?code=AUTH_CODE&state={state}")
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Invalid session state"


def test_protected_route_requires_auth(client):
    assert client.get("/me").status_code == 401
    assert client.get("/token-status").status_code == 401


def test_security_headers_present(client):
    resp = client.get("/")
    assert resp.headers["X-Content-Type-Options"] == "nosniff"
    assert resp.headers["X-Frame-Options"] == "DENY"
    assert "Content-Security-Policy" in resp.headers
    assert "Referrer-Policy" in resp.headers


def test_health_reports_security_features(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "healthy"
    assert data["security"]["audit_passed"] is True
    assert "PKCE (S256)" in data["security"]["features"]


def test_logout_clears_session(client):
    state = parse_qs(urlparse(client.get("/login").headers["Location"]).query)["state"][0]
    client.get(f"/oauth2/callback?code=AUTH_CODE&state={state}")
    client.get("/logout")
    with client.session_transaction() as sess:
        assert "user" not in sess
        assert "encrypted_tokens" not in sess
