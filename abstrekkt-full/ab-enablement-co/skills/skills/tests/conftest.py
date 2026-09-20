"""
Shared pytest fixtures for the Skills Library test suite.

Provides reusable skill data dicts, temporary directories populated with
sample SKILL.md files, and pre-configured validator instances.
"""

import sys
import textwrap
from pathlib import Path

import pytest

# ---------------------------------------------------------------------------
# Ensure the project root is on sys.path so ``lib.*`` imports resolve.
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_skill_body(
    *,
    line_count: int = 120,
    heading_count: int = 5,
    include_code: bool = True,
    include_numbered_list: bool = True,
    include_overview: bool = True,
) -> str:
    """Generate a synthetic SKILL.md body with configurable properties."""
    parts: list[str] = []

    if include_overview:
        parts.append("## Overview\n")
        parts.append(
            "This skill provides a comprehensive framework for building "
            "reliable and maintainable software components. It covers the "
            "full lifecycle from initial design through deployment.\n"
        )

    parts.append("## Core Processes\n")
    parts.append(
        "Follow the structured workflow below to achieve consistent "
        "high-quality results across all project phases.\n"
    )

    if include_numbered_list:
        parts.append(
            "1. Analyze the project requirements and constraints in detail\n"
            "2. Design the component architecture with clear interfaces\n"
            "3. Implement the solution following established coding standards\n"
            "4. Write comprehensive tests covering edge cases and integration\n"
            "5. Review, refactor, and document the finished component\n"
        )

    if include_code:
        parts.append("## Tools & Templates\n")
        parts.append("```python\n")
        parts.append("def example_function(data: dict) -> dict:\n")
        parts.append("    \"\"\"Process skill data.\"\"\"\n")
        parts.append("    return {k: v.strip() for k, v in data.items()}\n")
        parts.append("```\n")

    for i in range(heading_count - 3 if heading_count > 3 else 0):
        parts.append(f"## Section {i + 1}\n")
        parts.append(
            f"Additional detail and guidance for area {i + 1} of the skill. "
            f"Content for section {i + 1} should be substantive, actionable, "
            f"and specific to the skill domain.\n"
        )

    # Pad to approximate the desired line count with unique paragraphs
    current_lines = sum(p.count("\n") + 1 for p in parts)
    pad_index = 0
    while current_lines < line_count:
        pad_index += 1
        parts.append(
            f"Guideline {pad_index}: Provide clear, actionable guidance that "
            f"practitioners can apply immediately in scenario {pad_index}. "
            f"Include concrete examples and explain the reasoning behind "
            f"each recommendation for this particular case.\n"
        )
        current_lines += 4

    return "\n".join(parts)


def _write_skill_md(directory: Path, name: str, description: str, body: str) -> Path:
    """Write a SKILL.md file into *directory* and return its path."""
    directory.mkdir(parents=True, exist_ok=True)
    skill_path = directory / "SKILL.md"
    content = textwrap.dedent(f"""\
        ---
        name: {name}
        description: {description}
        ---
        {body}
    """)
    skill_path.write_text(content, encoding="utf-8")
    return skill_path


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def sample_skill() -> dict:
    """A realistic skill data dict that should pass validation cleanly."""
    body = _make_skill_body(line_count=150, heading_count=6, include_code=True)
    return {
        "name": "api-development",
        "description": (
            "Create, design, and build production-ready REST and GraphQL APIs. "
            "Use when you need to implement robust backend services with "
            "authentication, validation, and documentation."
        ),
        "body": body,
        "path": str(Path("_master-skills/technical/api-development/SKILL.md")),
        "category": "technical",
    }


@pytest.fixture
def simple_skill() -> dict:
    """A minimal skill that should be classified as 'simple' complexity."""
    body = _make_skill_body(
        line_count=60,
        heading_count=2,
        include_code=False,
        include_numbered_list=True,
        include_overview=True,
    )
    return {
        "name": "quick-checklist",
        "description": (
            "Create a quick checklist for common review tasks. "
            "Use when you need a lightweight validation pass."
        ),
        "body": body,
        "path": str(Path("_master-skills/operations/quick-checklist/SKILL.md")),
        "category": "operations",
    }


@pytest.fixture
def complex_skill() -> dict:
    """A large skill that should be classified as 'complex' complexity."""
    body = _make_skill_body(
        line_count=400,
        heading_count=15,
        include_code=True,
        include_numbered_list=True,
        include_overview=True,
    )
    return {
        "name": "enterprise-architecture-planner",
        "description": (
            "Design and implement enterprise-scale architecture plans. "
            "Analyze system dependencies, optimize performance, and "
            "build migration strategies for complex distributed systems. "
            "Use when planning large-scale infrastructure changes."
        ),
        "body": body,
        "path": str(
            Path("_master-skills/technical/enterprise-architecture-planner/SKILL.md")
        ),
        "category": "technical",
    }


@pytest.fixture
def sample_master_dir(tmp_path: Path) -> Path:
    """Create a temporary master-skills directory with 5 sample SKILL.md files.

    Returns the path to the temporary master directory.  The directory
    structure mirrors ``_master-skills/{category}/{slug}/SKILL.md``.
    """
    skills = [
        {
            "category": "technical",
            "slug": "api-development",
            "name": "api-development",
            "description": (
                "Create and build production-ready REST APIs with "
                "authentication, validation, and documentation."
            ),
        },
        {
            "category": "technical",
            "slug": "code-review",
            "name": "code-review",
            "description": (
                "Analyze and review code for quality, security, and "
                "maintainability. Use when evaluating pull requests."
            ),
        },
        {
            "category": "ai-agents",
            "slug": "agent-orchestrator",
            "name": "agent-orchestrator",
            "description": (
                "Design and build multi-agent orchestration pipelines. "
                "Use when you need to automate complex agent workflows."
            ),
        },
        {
            "category": "strategy",
            "slug": "market-analysis",
            "name": "market-analysis",
            "description": (
                "Analyze market trends and create competitive intelligence "
                "reports. Use when planning product strategy."
            ),
        },
        {
            "category": "creative",
            "slug": "content-writer",
            "name": "content-writer",
            "description": (
                "Generate and write high-quality content for blogs, "
                "documentation, and marketing. Use for content creation."
            ),
        },
    ]

    master = tmp_path / "_master-skills"
    for skill_info in skills:
        skill_dir = master / skill_info["category"] / skill_info["slug"]
        body = _make_skill_body(line_count=120, heading_count=5, include_code=True)
        _write_skill_md(skill_dir, skill_info["name"], skill_info["description"], body)

    return master
