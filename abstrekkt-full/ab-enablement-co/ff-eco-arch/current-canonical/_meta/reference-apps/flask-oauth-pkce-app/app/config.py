"""Secure configuration + secrets management.

Reconstructed and refactored from the source chat's ``secrets_config.py``.
Key differences from the source:

* Provider-agnostic: the OAuth endpoints are configurable, not hard-wired
  to Google, so this runs against any RFC 6749 / RFC 7636 provider.
* No secrets are ever hard-coded. Required secrets are read from the
  environment; missing ones raise a clear error. Optional secrets
  (SECRET_KEY / ENCRYPTION_KEY) are auto-generated for local dev only,
  with a loud warning — never rely on auto-generation in production
  (auto-generated keys rotate on every restart and invalidate sessions
  + encrypted tokens).

SECURITY: This module reads untrusted environment input. It validates
formats but never logs secret *values*.
"""

from __future__ import annotations

import logging
import os
import secrets
from dataclasses import dataclass, field
from datetime import timedelta
from typing import Any
from urllib.parse import urlparse

from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)


class ConfigError(RuntimeError):
    """Raised when configuration is missing or invalid."""


def _truthy(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass
class AppConfig:
    """Validated application configuration.

    Build instances with :meth:`from_env` (production / real runs) or by
    constructing directly with explicit values (tests).
    """

    # OAuth client
    oauth_client_id: str
    oauth_client_secret: str
    oauth_authorize_url: str
    oauth_token_url: str
    oauth_userinfo_url: str
    oauth_scopes: list[str]

    # Crypto / Flask
    secret_key: str
    encryption_key: str

    # Runtime
    env: str = "development"
    base_url: str = "http://localhost:5000"
    force_https: bool = False
    rate_limit_per_hour: int = 1000
    session_lifetime_seconds: int = 3600

    # Derived
    redirect_path: str = "/oauth2/callback"
    _cipher: Fernet | None = field(default=None, repr=False, compare=False)

    # ----- construction -------------------------------------------------

    @classmethod
    def from_env(cls, environ: dict[str, str] | None = None) -> "AppConfig":
        env = environ if environ is not None else dict(os.environ)

        def required(key: str) -> str:
            val = env.get(key)
            if not val:
                raise ConfigError(
                    f"Missing required environment variable: {key}. "
                    f"Copy .env.example to .env and fill it in (placeholders only)."
                )
            return val

        flask_env = env.get("FLASK_ENV", "development")
        is_prod = flask_env == "production"

        # SECRET_KEY: required-strength in prod, auto-generated in dev.
        secret_key = env.get("SECRET_KEY", "")
        if not secret_key or len(secret_key) < 32:
            if is_prod:
                raise ConfigError(
                    "SECRET_KEY must be set and >= 32 chars in production."
                )
            secret_key = secrets.token_urlsafe(32)
            logger.warning(
                "No strong SECRET_KEY found; generated an ephemeral one for "
                "development. Sessions will not survive a restart."
            )

        # ENCRYPTION_KEY: must be a valid Fernet key; auto-generate in dev.
        encryption_key = env.get("ENCRYPTION_KEY", "")
        if encryption_key:
            try:
                Fernet(encryption_key.encode())
            except Exception as exc:  # noqa: BLE001 - report and fall through
                if is_prod:
                    raise ConfigError("ENCRYPTION_KEY is not a valid Fernet key.") from exc
                logger.warning("Invalid ENCRYPTION_KEY; generating an ephemeral one.")
                encryption_key = ""
        if not encryption_key:
            if is_prod:
                raise ConfigError("ENCRYPTION_KEY (a Fernet key) is required in production.")
            encryption_key = Fernet.generate_key().decode()
            logger.warning(
                "No ENCRYPTION_KEY found; generated an ephemeral one for "
                "development. Encrypted tokens will not survive a restart."
            )

        scopes = env.get("OAUTH_SCOPES", "openid email profile").split()

        cfg = cls(
            oauth_client_id=required("OAUTH_CLIENT_ID"),
            oauth_client_secret=required("OAUTH_CLIENT_SECRET"),
            oauth_authorize_url=required("OAUTH_AUTHORIZE_URL"),
            oauth_token_url=required("OAUTH_TOKEN_URL"),
            oauth_userinfo_url=required("OAUTH_USERINFO_URL"),
            oauth_scopes=scopes,
            secret_key=secret_key,
            encryption_key=encryption_key,
            env=flask_env,
            base_url=env.get("BASE_URL", "http://localhost:5000").rstrip("/"),
            force_https=_truthy(env.get("FORCE_HTTPS"), default=is_prod),
            rate_limit_per_hour=int(env.get("RATE_LIMIT_PER_HOUR", "1000")),
            session_lifetime_seconds=int(env.get("SESSION_TIMEOUT", "3600")),
        )
        return cfg

    # ----- derived helpers ---------------------------------------------

    @property
    def debug(self) -> bool:
        return self.env not in {"production", "testing"}

    @property
    def redirect_uri(self) -> str:
        return f"{self.base_url}{self.redirect_path}"

    def get_cipher(self) -> Fernet:
        if self._cipher is None:
            self._cipher = Fernet(self.encryption_key.encode())
        return self._cipher

    def flask_settings(self) -> dict[str, Any]:
        """Flask config dict with hardened, secure-by-default session cookies."""
        return {
            "SECRET_KEY": self.secret_key,
            # Secure cookie posture: HttpOnly always; Secure when HTTPS is
            # enforced; SameSite=Lax so the cross-site redirect back from
            # the IdP still carries the session cookie.
            "SESSION_COOKIE_HTTPONLY": True,
            "SESSION_COOKIE_SECURE": self.force_https,
            "SESSION_COOKIE_SAMESITE": "Lax",
            "PERMANENT_SESSION_LIFETIME": timedelta(seconds=self.session_lifetime_seconds),
            "WTF_CSRF_ENABLED": True,
            "WTF_CSRF_TIME_LIMIT": self.session_lifetime_seconds,
            "TESTING": self.env == "testing",
        }
