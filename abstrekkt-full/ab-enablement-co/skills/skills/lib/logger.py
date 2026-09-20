"""
Standardized logging module for Skills project.

Provides colored console logging, error tracking, and strict mode support.
No external dependencies - uses only Python standard library.
"""

import logging
import sys
from typing import Optional

# ANSI Color codes for terminal output
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
CYAN = '\033[96m'
BOLD = '\033[1m'
DIM = '\033[2m'
RESET = '\033[0m'


# Standard format constants for skill-related messages
SKILL_ERROR_FMT = "[ERROR] {category}/{skill}: {message}"
SKILL_WARN_FMT = "[WARN] {category}/{skill}: {message}"


class ColoredFormatter(logging.Formatter):
    """Custom formatter with colored output for different log levels."""

    LEVEL_COLORS = {
        logging.DEBUG: DIM + CYAN,
        logging.INFO: CYAN,
        logging.WARNING: YELLOW,
        logging.ERROR: RED,
        logging.CRITICAL: BOLD + RED,
    }

    def format(self, record):
        """Format log record with colors based on level."""
        # Get color for this level
        color = self.LEVEL_COLORS.get(record.levelno, '')

        # Format the level name
        level_name = record.levelname
        colored_level = f"{color}[{level_name}]{RESET}"

        # Create the formatted message
        message = record.getMessage()
        return f"{colored_level} {message}"


class ErrorTracker:
    """
    Track errors and warnings across the execution.

    Provides summary reporting and exit code determination.
    In strict mode, raises SystemExit on first error.
    """

    def __init__(self, strict: bool = False):
        """
        Initialize error tracker.

        Args:
            strict: If True, raise SystemExit on first error
        """
        self.strict = strict
        self.errors = 0
        self.warnings = 0
        self.error_messages = []
        self.warning_messages = []

    def add_error(self, message: str, category: Optional[str] = None, skill: Optional[str] = None):
        """
        Record an error.

        Args:
            message: Error message
            category: Optional category name
            skill: Optional skill name
        """
        self.errors += 1

        if category and skill:
            full_message = SKILL_ERROR_FMT.format(category=category, skill=skill, message=message)
        else:
            full_message = f"[ERROR] {message}"

        self.error_messages.append(full_message)

        if self.strict:
            print(f"{RED}{full_message}{RESET}", file=sys.stderr)
            sys.exit(1)

    def add_warning(self, message: str, category: Optional[str] = None, skill: Optional[str] = None):
        """
        Record a warning.

        Args:
            message: Warning message
            category: Optional category name
            skill: Optional skill name
        """
        self.warnings += 1

        if category and skill:
            full_message = SKILL_WARN_FMT.format(category=category, skill=skill, message=message)
        else:
            full_message = f"[WARN] {message}"

        self.warning_messages.append(full_message)

    def has_errors(self) -> bool:
        """Check if any errors were recorded."""
        return self.errors > 0

    def has_warnings(self) -> bool:
        """Check if any warnings were recorded."""
        return self.warnings > 0

    def get_summary(self) -> str:
        """
        Get a summary of errors and warnings.

        Returns:
            Summary string with counts
        """
        parts = []

        if self.errors > 0:
            parts.append(f"{RED}{self.errors} error(s){RESET}")

        if self.warnings > 0:
            parts.append(f"{YELLOW}{self.warnings} warning(s){RESET}")

        if not parts:
            return f"{GREEN}No errors or warnings{RESET}"

        return ", ".join(parts)

    def get_exit_code(self) -> int:
        """
        Get appropriate exit code based on errors.

        Returns:
            0 for success (no errors), 1 if errors occurred
        """
        return 1 if self.errors > 0 else 0

    def print_summary(self):
        """Print summary of all errors and warnings."""
        if not self.has_errors() and not self.has_warnings():
            print(f"\n{GREEN}✓ Completed successfully - no errors or warnings{RESET}")
            return

        print(f"\n{BOLD}Summary:{RESET} {self.get_summary()}")

        if self.error_messages:
            print(f"\n{RED}Errors:{RESET}")
            for msg in self.error_messages[:10]:  # Show first 10
                print(f"  {msg}")
            if len(self.error_messages) > 10:
                print(f"  ... and {len(self.error_messages) - 10} more")

        if self.warning_messages:
            print(f"\n{YELLOW}Warnings:{RESET}")
            for msg in self.warning_messages[:10]:  # Show first 10
                print(f"  {msg}")
            if len(self.warning_messages) > 10:
                print(f"  ... and {len(self.warning_messages) - 10} more")

    def reset(self):
        """Reset all counters and messages."""
        self.errors = 0
        self.warnings = 0
        self.error_messages.clear()
        self.warning_messages.clear()


def setup_logger(name: str, verbose: bool = False, strict: bool = False) -> logging.Logger:
    """
    Set up a configured logger with colored output.

    Args:
        name: Logger name (typically __name__ from calling module)
        verbose: If True, set DEBUG level; otherwise INFO
        strict: If True, store strict flag on logger (can be checked later)

    Returns:
        Configured logger instance

    Example:
        logger = setup_logger(__name__, verbose=True)
        logger.debug("Debug message")
        logger.info("Info message")
        logger.error("Error message")
    """
    logger = logging.getLogger(name)

    # Only configure if not already configured
    if not logger.handlers:
        # Set level
        level = logging.DEBUG if verbose else logging.INFO
        logger.setLevel(level)

        # Create console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)

        # Set colored formatter
        formatter = ColoredFormatter()
        console_handler.setFormatter(formatter)

        # Add handler to logger
        logger.addHandler(console_handler)

        # Prevent propagation to root logger
        logger.propagate = False

    # Store strict mode flag on logger
    logger.strict = strict

    return logger


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """
    Retrieve an existing logger by name.

    Args:
        name: Logger name (if None, returns root logger)

    Returns:
        Logger instance

    Example:
        logger = get_logger(__name__)
    """
    if name is None:
        return logging.getLogger()
    return logging.getLogger(name)


# Module-level convenience functions for quick setup
def create_error_tracker(strict: bool = False) -> ErrorTracker:
    """
    Create a new ErrorTracker instance.

    Args:
        strict: If True, raise SystemExit on first error

    Returns:
        ErrorTracker instance
    """
    return ErrorTracker(strict=strict)


if __name__ == "__main__":
    # Demo usage
    print("=== Logger Demo ===\n")

    # Setup logger
    logger = setup_logger(__name__, verbose=True, strict=False)

    # Test different log levels
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")

    print("\n=== ErrorTracker Demo ===\n")

    # Setup error tracker
    tracker = create_error_tracker(strict=False)

    # Add some errors and warnings
    tracker.add_warning("Missing description", category="ai-agents", skill="data-analyst")
    tracker.add_error("Invalid YAML frontmatter", category="technical", skill="python-dev")
    tracker.add_warning("Long description (>200 chars)", category="creative", skill="content-writer")

    # Print summary
    tracker.print_summary()

    print(f"\nExit code: {tracker.get_exit_code()}")
