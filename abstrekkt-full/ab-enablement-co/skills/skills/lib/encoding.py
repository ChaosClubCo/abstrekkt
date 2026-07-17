"""Windows encoding compatibility.

Import this module early in any script entry point to ensure
UTF-8 output works correctly on Windows terminals.
"""

import os
import sys


def ensure_utf8():
    """Set UTF-8 encoding for stdout/stderr on Windows.

    Call this at the start of any CLI script to avoid
    UnicodeEncodeError with special characters on Windows.
    """
    if sys.platform == "win32":
        os.environ.setdefault("PYTHONIOENCODING", "utf-8")
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
