"""
platform_tuning.py - Shared platform tuning configuration module.

Provides platform-specific tuning configurations used by all skill converters.
Maps skill metadata (category, complexity, content shape) to optimal settings
for Gemini, Codex (OpenAI), GitHub Copilot, and Claude platforms.

No external dependencies beyond the Python standard library.
"""

import re
from typing import Any, Dict, List

from lib.config import (
    CATEGORY_TEMPERATURES as CATEGORY_TEMPERATURE_MAP,
)
from lib.config import (
    CLAUDE_MODELS,
    GEMINI_HARM_CATEGORIES,
    GEMINI_MODELS,
)
from lib.config import (
    CODEX_MODELS as _CODEX_MODELS,
)

# ---------------------------------------------------------------------------
# 2. COMPLEXITY_MODEL_MAP
# ---------------------------------------------------------------------------
# Maps estimated skill complexity to recommended model per platform.

COMPLEXITY_MODEL_MAP: Dict[str, Dict[str, str]] = {
    "gemini": GEMINI_MODELS,
    "codex": _CODEX_MODELS,
    "claude": CLAUDE_MODELS,
}

# ---------------------------------------------------------------------------
# 3. estimate_complexity
# ---------------------------------------------------------------------------

def estimate_complexity(skill_data: dict) -> str:
    """Estimate the complexity of a skill based on its content characteristics.

    Heuristics considered:
      - Body length (line count): <100 simple, 100-300 moderate, >300 complex.
      - Number of sections (markdown headings).
      - Presence of code blocks, templates, or framework references.

    Parameters
    ----------
    skill_data : dict
        Must contain a ``"body"`` key with the full skill text.  Optional keys
        ``"sections"`` (int) and ``"has_code_blocks"`` (bool) can be provided
        to short-circuit detection; otherwise they are inferred from the body.

    Returns
    -------
    str
        One of ``"simple"``, ``"moderate"``, or ``"complex"``.
    """
    body: str = skill_data.get("body", "")
    lines = body.splitlines()
    line_count = len(lines)

    # Section / heading count
    _sections = skill_data.get("sections", 0)
    section_count: int = len(_sections) if isinstance(_sections, list) else int(_sections or 0)
    if section_count == 0:
        section_count = sum(1 for line in lines if re.match(r"^\s*#{1,6}\s", line))

    # Code-block / template / framework detection
    has_code: bool = skill_data.get("has_code_blocks", False)
    if not has_code:
        has_code = bool(re.search(r"```", body))

    has_templates: bool = bool(re.search(r"\{\{.*?\}\}", body)) or bool(
        re.search(r"\{core_instructions\}", body)
    )
    has_frameworks: bool = bool(
        re.search(r"(?i)(framework|architecture|pattern|pipeline)", body)
    )

    # Scoring ------------------------------------------------------------------
    score = 0

    # Line-count contribution
    if line_count > 300:
        score += 3
    elif line_count >= 100:
        score += 2
    else:
        score += 1

    # Section density contribution
    if section_count > 10:
        score += 2
    elif section_count > 5:
        score += 1

    # Structural richness contribution
    if has_code:
        score += 1
    if has_templates:
        score += 1
    if has_frameworks:
        score += 1

    # Map score to complexity label
    if score >= 6:
        return "complex"
    elif score >= 3:
        return "moderate"
    return "simple"


# ---------------------------------------------------------------------------
# 4. get_gemini_settings
# ---------------------------------------------------------------------------

def get_gemini_settings(skill_data: dict) -> dict:
    """Return Gemini-optimised generation settings for a skill.

    Parameters
    ----------
    skill_data : dict
        Skill metadata; expects ``"category"`` and ``"body"`` at minimum.

    Returns
    -------
    dict
        Keys: ``model``, ``temperature``, ``safetySettings``.
    """
    category: str = skill_data.get("category", "technical")
    complexity = estimate_complexity(skill_data)
    temperature = CATEGORY_TEMPERATURE_MAP.get(category, 0.4)
    model = COMPLEXITY_MODEL_MAP["gemini"].get(complexity, "gemini-2.5-flash")

    safety_settings = [
        {"category": cat, "threshold": "BLOCK_ONLY_HIGH"}
        for cat in GEMINI_HARM_CATEGORIES
    ]

    return {
        "model": model,
        "temperature": temperature,
        "safetySettings": safety_settings,
    }


# ---------------------------------------------------------------------------
# 5. get_codex_settings
# ---------------------------------------------------------------------------

_RESEARCH_STRATEGY_CATEGORIES = {"strategy", "industry", "ai-agents"}
_TECHNICAL_CATEGORIES = {"technical", "operations"}


def get_codex_settings(skill_data: dict) -> dict:
    """Return OpenAI Codex / ChatGPT-optimised settings for a skill.

    Parameters
    ----------
    skill_data : dict
        Skill metadata; expects ``"category"`` and ``"body"`` at minimum.

    Returns
    -------
    dict
        Keys: ``model``, ``tools`` (list of tool names), ``response_format``.
    """
    category: str = skill_data.get("category", "technical")
    complexity = estimate_complexity(skill_data)
    model = COMPLEXITY_MODEL_MAP["codex"].get(complexity, "gpt-4.1")

    tools: List[str] = ["code_interpreter"]
    if category in _RESEARCH_STRATEGY_CATEGORIES:
        tools.append("web_search")
    if category in _TECHNICAL_CATEGORIES:
        tools.append("file_search")

    response_format: Dict[str, Any] = {
        "type": "text",
        "hints": {
            "style": "structured_markdown" if category in _TECHNICAL_CATEGORIES else "prose",
            "verbosity": "detailed" if complexity == "complex" else "concise",
        },
    }

    return {
        "model": model,
        "tools": tools,
        "response_format": response_format,
    }


# ---------------------------------------------------------------------------
# 6. get_copilot_settings
# ---------------------------------------------------------------------------

_CATEGORY_FILE_PATTERNS: Dict[str, List[str]] = {
    "technical": [
        "**/*.py", "**/*.js", "**/*.ts", "**/*.java", "**/*.go",
        "**/*.rs", "**/*.cpp", "**/*.c", "**/*.h", "**/*.cs",
    ],
    "creative": [
        "**/*.md", "**/*.mdx", "**/*.txt", "**/*.html", "**/*.css",
        "**/*.svg", "**/*.figma", "**/*.sketch",
    ],
    "strategy": [
        "**/*.md", "**/*.txt", "**/*.pdf", "**/*.docx",
    ],
    "operations": [
        "**/*.yaml", "**/*.yml", "**/*.toml", "**/*.json",
        "**/*.tf", "**/*.hcl", "**/Dockerfile", "**/*.sh",
    ],
    "industry": [
        "**/*.md", "**/*.json", "**/*.yaml", "**/*.csv",
    ],
    "ai-agents": [
        "**/*.py", "**/*.js", "**/*.ts", "**/*.yaml", "**/*.json",
    ],
}

_CATEGORY_PRIORITY: Dict[str, int] = {
    "technical": 8,
    "strategy": 6,
    "creative": 5,
    "operations": 7,
    "industry": 6,
    "ai-agents": 9,
}


def get_copilot_settings(skill_data: dict) -> dict:
    """Return GitHub Copilot custom-instruction settings for a skill.

    Parameters
    ----------
    skill_data : dict
        Skill metadata; expects ``"category"`` at minimum.

    Returns
    -------
    dict
        Keys: ``applyTo`` (file patterns), ``scope``, ``priority``.
    """
    category: str = skill_data.get("category", "technical")

    apply_to = _CATEGORY_FILE_PATTERNS.get(
        category, _CATEGORY_FILE_PATTERNS["technical"]
    )
    scope = "workspace" if category in {"technical", "operations", "ai-agents"} else "global"
    priority = _CATEGORY_PRIORITY.get(category, 5)

    return {
        "applyTo": apply_to,
        "scope": scope,
        "priority": priority,
    }


# ---------------------------------------------------------------------------
# 7. get_claude_settings
# ---------------------------------------------------------------------------

_MAX_TOKENS_BY_COMPLEXITY: Dict[str, int] = {
    "simple": 4096,
    "moderate": 8192,
    "complex": 16384,
}


def get_claude_settings(skill_data: dict) -> dict:
    """Return Anthropic Claude-optimised settings for a skill.

    Parameters
    ----------
    skill_data : dict
        Skill metadata; expects ``"category"`` and ``"body"`` at minimum.

    Returns
    -------
    dict
        Keys: ``model``, ``max_tokens``, ``tool_hints``.
    """
    category: str = skill_data.get("category", "technical")
    complexity = estimate_complexity(skill_data)
    model = COMPLEXITY_MODEL_MAP["claude"].get(complexity, "claude-sonnet-4-5-20250929")
    max_tokens = _MAX_TOKENS_BY_COMPLEXITY.get(complexity, 8192)

    tool_hints: List[Dict[str, str]] = []
    if category in _TECHNICAL_CATEGORIES:
        tool_hints.extend([
            {
                "type": "mcp",
                "name": "filesystem",
                "description": "Read, write, and manage project files via MCP filesystem server.",
            },
            {
                "type": "mcp",
                "name": "github",
                "description": "Interact with GitHub repos, issues, and PRs via MCP GitHub server.",
            },
        ])
    if category in _RESEARCH_STRATEGY_CATEGORIES:
        tool_hints.append({
            "type": "mcp",
            "name": "web_search",
            "description": "Search the web for up-to-date information via MCP web-search server.",
        })
    if category == "ai-agents":
        tool_hints.append({
            "type": "mcp",
            "name": "subagent",
            "description": "Delegate subtasks to specialised sub-agents via MCP subagent server.",
        })

    return {
        "model": model,
        "max_tokens": max_tokens,
        "tool_hints": tool_hints,
    }


# ---------------------------------------------------------------------------
# 8. PLATFORM_TEMPLATES
# ---------------------------------------------------------------------------
# Template wrappers for each platform. Use ``{core_instructions}`` as the
# placeholder for the skill's converted body content.

PLATFORM_TEMPLATES: Dict[str, str] = {
    "gemini_template": (
        "# Grounding Instructions\n"
        "You are a specialised assistant. Follow the instructions below precisely.\n"
        "Always ground your responses in verifiable facts and cite sources where possible.\n"
        "When uncertain, state your confidence level explicitly.\n"
        "\n"
        "{core_instructions}\n"
        "\n"
        "# Output Guidance\n"
        "Structure your response using clear markdown headings.\n"
        "Provide outputs in well-defined sections: Summary, Detail, and Recommendations.\n"
        "Use bullet points for lists and fenced code blocks for any code or data."
    ),

    "copilot_template": (
        "# @workspace References\n"
        "This instruction applies within the current VS Code workspace.\n"
        "Use @workspace to reference project files, symbols, and context.\n"
        "Leverage @terminal for shell command suggestions and @vscode for editor actions.\n"
        "\n"
        "{core_instructions}\n"
        "\n"
        "# VS Code Integration Notes\n"
        "Prefer inline suggestions that respect the current file's language and style.\n"
        "When generating code, match existing project conventions (indentation, naming, imports).\n"
        "Use workspace-relative paths in any file references."
    ),

    "codex_template": (
        "# Tool Use Patterns\n"
        "You have access to tools. Use them proactively when they can improve your answer.\n"
        "Prefer code_interpreter for calculations, data transforms, and code validation.\n"
        "Use web_search when the question requires current information beyond your training data.\n"
        "Use file_search to locate relevant files in the user's uploaded documents.\n"
        "\n"
        "{core_instructions}\n"
        "\n"
        "# Function Calling Guidance\n"
        "When invoking tools, provide all required parameters in a single call.\n"
        "Chain tool calls logically: gather information first, then process, then present.\n"
        "Always explain tool outputs in natural language after receiving results."
    ),

    "claude_template": (
        "# MCP Tool References\n"
        "You may have access to MCP (Model Context Protocol) tool servers.\n"
        "Use the filesystem server to read and write project files when needed.\n"
        "Use the GitHub server for repository operations (issues, PRs, code search).\n"
        "Use specialised servers (web search, databases) when the task requires them.\n"
        "\n"
        "{core_instructions}\n"
        "\n"
        "# Sub-Agent Delegation Patterns\n"
        "For complex multi-step tasks, consider decomposing into sub-tasks.\n"
        "Delegate self-contained research or analysis steps to sub-agents when available.\n"
        "Synthesise sub-agent results into a coherent final response.\n"
        "Maintain a clear chain of reasoning across delegated steps."
    ),
}
