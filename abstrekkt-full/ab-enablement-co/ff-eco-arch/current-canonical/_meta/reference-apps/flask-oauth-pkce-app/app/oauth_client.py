"""Provider-agnostic OAuth 2.0 Authorization Code + PKCE client.

This is a thin, dependency-light client (RFC 6749 / RFC 7636). The HTTP
calls live in two clearly-named methods (:meth:`exchange_code` and
:meth:`fetch_userinfo`) so tests can monkeypatch the network boundary
without mocking a third-party SDK.

Open-redirect safety: this client only ever sends the user to the
configured ``authorize_url`` host and only accepts a callback at the
fixed ``redirect_uri``. The callback handler (routes.py) never honours a
caller-supplied "next"/return URL, so there is no open-redirect surface.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from urllib.parse import urlencode

from .config import AppConfig
from .pkce import PKCEPair

logger = logging.getLogger(__name__)

# ``requests`` is only needed when actually talking to a real IdP. Import
# lazily so unit tests (which monkeypatch the network methods) can run
# without it installed.
try:  # pragma: no cover - trivial import guard
    import requests
except Exception:  # pragma: no cover
    requests = None  # type: ignore[assignment]


class OAuthError(RuntimeError):
    """Raised on a failed token exchange or userinfo call."""


@dataclass
class TokenResponse:
    access_token: str
    token_type: str = "Bearer"
    refresh_token: str | None = None
    expires_in: int | None = None
    id_token: str | None = None
    scope: str | None = None

    def to_storage(self) -> dict[str, object]:
        return {
            "access_token": self.access_token,
            "token_type": self.token_type,
            "refresh_token": self.refresh_token,
            "expires_in": self.expires_in,
            "id_token": self.id_token,
            "scope": self.scope,
        }


class OAuthClient:
    def __init__(self, config: AppConfig):
        self.config = config

    # ----- authorization request ---------------------------------------

    def build_authorization_url(
        self, pkce: PKCEPair, state: str, nonce: str
    ) -> str:
        """Build the IdP authorization URL with PKCE + state + nonce."""
        params = {
            "response_type": "code",
            "client_id": self.config.oauth_client_id,
            "redirect_uri": self.config.redirect_uri,
            "scope": " ".join(self.config.oauth_scopes),
            "state": state,
            "nonce": nonce,
            "code_challenge": pkce.code_challenge,
            "code_challenge_method": pkce.method,
            "access_type": "offline",
            "prompt": "consent",
        }
        return f"{self.config.oauth_authorize_url}?{urlencode(params)}"

    # ----- network boundary (monkeypatched in tests) -------------------

    def exchange_code(self, code: str, code_verifier: str) -> TokenResponse:
        """Exchange an authorization code for tokens, presenting the PKCE
        ``code_verifier`` (RFC 7636 section 4.5)."""
        if requests is None:  # pragma: no cover
            raise OAuthError("The 'requests' package is required for live token exchange.")
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.config.redirect_uri,
            "client_id": self.config.oauth_client_id,
            "client_secret": self.config.oauth_client_secret,
            "code_verifier": code_verifier,
        }
        resp = requests.post(self.config.oauth_token_url, data=data, timeout=10)
        if resp.status_code != 200:
            logger.error("Token exchange failed: HTTP %s", resp.status_code)
            raise OAuthError(f"Token endpoint returned HTTP {resp.status_code}")
        payload = resp.json()
        return TokenResponse(
            access_token=payload["access_token"],
            token_type=payload.get("token_type", "Bearer"),
            refresh_token=payload.get("refresh_token"),
            expires_in=payload.get("expires_in"),
            id_token=payload.get("id_token"),
            scope=payload.get("scope"),
        )

    def fetch_userinfo(self, access_token: str) -> dict[str, object]:
        """Fetch the userinfo profile with the access token."""
        if requests is None:  # pragma: no cover
            raise OAuthError("The 'requests' package is required for userinfo.")
        resp = requests.get(
            self.config.oauth_userinfo_url,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        if resp.status_code != 200:
            logger.error("Userinfo fetch failed: HTTP %s", resp.status_code)
            raise OAuthError(f"Userinfo endpoint returned HTTP {resp.status_code}")
        return resp.json()
