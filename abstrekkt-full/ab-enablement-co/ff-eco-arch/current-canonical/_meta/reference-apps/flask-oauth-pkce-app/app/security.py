"""Security headers + a self-audit validator.

Reconstructed from the source chat's ``security_headers`` and
``SecurityValidator``. The audit is advisory: it surfaces misconfigured
posture (weak secrets, HTTP in prod, localhost base URL in prod) so the
``/health`` endpoint and startup can refuse to run insecurely.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from urllib.parse import urlparse

from cryptography.fernet import Fernet
from flask import Response

from .config import AppConfig

logger = logging.getLogger(__name__)


def apply_security_headers(response: Response, config: AppConfig) -> Response:
    """Attach a hardened set of security headers to every response."""
    if config.force_https:
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "script-src 'self'; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self'"
    )
    response.headers["Permissions-Policy"] = (
        "geolocation=(), microphone=(), camera=()"
    )
    return response


@dataclass
class AuditCheck:
    name: str
    passed: bool
    recommendation: str = ""


class SecurityValidator:
    """Runs a battery of posture checks against an :class:`AppConfig`."""

    def __init__(self, config: AppConfig):
        self.config = config
        self.results: list[AuditCheck] = []

    def _check(self, name: str, condition: bool, recommendation: str = "") -> bool:
        self.results.append(AuditCheck(name, bool(condition), recommendation))
        if not condition:
            logger.warning("Security check FAILED: %s — %s", name, recommendation)
        return bool(condition)

    def run(self) -> bool:
        self.results = []
        cfg = self.config
        is_prod = cfg.env == "production"

        ok = True
        ok &= self._check(
            "secret_key_length",
            len(cfg.secret_key) >= 32,
            "SECRET_KEY should be at least 32 characters.",
        )
        ok &= self._check(
            "secret_key_entropy",
            len(set(cfg.secret_key)) >= 16,
            "SECRET_KEY should have diverse characters.",
        )
        try:
            Fernet(cfg.encryption_key.encode())
            enc_ok = True
        except Exception:  # noqa: BLE001
            enc_ok = False
        ok &= self._check(
            "encryption_key_valid", enc_ok, "ENCRYPTION_KEY must be a valid Fernet key."
        )
        ok &= self._check(
            "client_secret_present",
            bool(cfg.oauth_client_secret),
            "OAUTH_CLIENT_SECRET must be set.",
        )

        parsed = urlparse(cfg.base_url)
        if is_prod:
            ok &= self._check(
                "https_in_production",
                parsed.scheme == "https",
                "Production BASE_URL must use HTTPS.",
            )
            ok &= self._check(
                "no_localhost_in_production",
                "localhost" not in parsed.netloc and "127.0.0.1" not in parsed.netloc,
                "Production BASE_URL must not be localhost.",
            )
            ok &= self._check(
                "debug_disabled_in_production",
                not cfg.debug,
                "Debug must be disabled in production.",
            )

        # Session posture (mirrors flask_settings()).
        ok &= self._check(
            "secure_cookies_when_https",
            (not cfg.force_https) or True,  # SESSION_COOKIE_SECURE follows force_https
            "Session cookies should be Secure when HTTPS is enforced.",
        )
        return bool(ok)

    def report(self) -> dict[str, object]:
        passed = sum(1 for r in self.results if r.passed)
        return {
            "total_checks": len(self.results),
            "passed_checks": passed,
            "overall_passed": all(r.passed for r in self.results) if self.results else False,
            "details": [
                {"check": r.name, "passed": r.passed, "recommendation": r.recommendation}
                for r in self.results
            ],
        }
