"""Application package for the Secure Flask OAuth + PKCE demo.

The public entrypoint is :func:`create_app` (the app factory). Importing
the package does not create an app or read the environment, which keeps
imports cheap and test-friendly.
"""

from .factory import create_app

__all__ = ["create_app"]
