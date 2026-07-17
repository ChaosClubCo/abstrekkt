"""Unit tests for the PKCE / state / nonce primitives."""

from __future__ import annotations

import base64

from app.pkce import (
    generate_nonce,
    generate_pkce,
    generate_state,
    verify_challenge,
)


def test_pkce_pair_format():
    pair = generate_pkce()
    assert pair.method == "S256"
    # RFC 7636: verifier length 43..128 chars for 32 random bytes -> 43.
    assert 43 <= len(pair.code_verifier) <= 128
    assert len(pair.code_challenge) >= 43
    assert pair.code_verifier != pair.code_challenge
    # base64url, no padding
    assert "=" not in pair.code_verifier
    base64.urlsafe_b64decode(pair.code_verifier + "==")


def test_pkce_pairs_are_unique():
    a, b = generate_pkce(), generate_pkce()
    assert a.code_verifier != b.code_verifier
    assert a.code_challenge != b.code_challenge


def test_verify_challenge_roundtrip():
    pair = generate_pkce()
    assert verify_challenge(pair.code_verifier, pair.code_challenge) is True
    assert verify_challenge("tampered-verifier", pair.code_challenge) is False


def test_state_and_nonce_unique():
    assert generate_state() != generate_state()
    assert generate_nonce() != generate_nonce()
