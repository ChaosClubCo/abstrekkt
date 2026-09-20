"""PKCE (RFC 7636) and OAuth anti-CSRF primitives.

Pure, dependency-light helpers so they are trivially unit-testable. The
``code_verifier`` is high-entropy (32 random bytes -> 43-char base64url),
and the ``code_challenge`` is the S256 transform (SHA-256, base64url, no
padding) per RFC 7636 section 4.2.
"""

from __future__ import annotations

import base64
import hashlib
import secrets
from dataclasses import dataclass


def _b64url_no_pad(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


@dataclass(frozen=True)
class PKCEPair:
    code_verifier: str
    code_challenge: str
    method: str = "S256"


def generate_pkce() -> PKCEPair:
    """Generate a fresh PKCE verifier/challenge pair (S256)."""
    code_verifier = _b64url_no_pad(secrets.token_bytes(32))
    digest = hashlib.sha256(code_verifier.encode("ascii")).digest()
    code_challenge = _b64url_no_pad(digest)
    return PKCEPair(code_verifier=code_verifier, code_challenge=code_challenge)


def verify_challenge(code_verifier: str, code_challenge: str) -> bool:
    """Recompute the S256 challenge and compare in constant time.

    Used by the test double / resource server to confirm a presented
    verifier matches the challenge sent at authorization time.
    """
    expected = _b64url_no_pad(hashlib.sha256(code_verifier.encode("ascii")).digest())
    return secrets.compare_digest(expected, code_challenge)


def generate_state() -> str:
    """Opaque, unguessable anti-CSRF state value for the OAuth round trip."""
    return secrets.token_urlsafe(32)


def generate_nonce() -> str:
    """OIDC nonce, bound into the request and (optionally) the ID token."""
    return secrets.token_urlsafe(16)


def constant_time_equals(a: str, b: str) -> bool:
    """Timing-safe string comparison wrapper."""
    return secrets.compare_digest(a, b)
