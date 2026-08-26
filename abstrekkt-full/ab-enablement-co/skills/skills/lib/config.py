"""
config.py - Single source of truth for shared constants across the Skills Library pipeline.

All scripts and lib modules should import from here instead of redefining constants.
"""

from pathlib import Path
from typing import Dict, List, Set

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MASTER_DIR = BASE_DIR / "_master-skills"

# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------

CATEGORIES: List[str] = [
    "technical",
    "strategy",
    "creative",
    "industry",
    "operations",
    "ai-agents",
]

# ---------------------------------------------------------------------------
# Temperature mapping per category
# ---------------------------------------------------------------------------

CATEGORY_TEMPERATURES: Dict[str, float] = {
    "technical": 0.3,
    "strategy": 0.5,
    "creative": 0.7,
    "operations": 0.4,
    "industry": 0.4,
    "ai-agents": 0.5,
}

# ---------------------------------------------------------------------------
# Model maps per platform
# ---------------------------------------------------------------------------

GEMINI_MODELS: Dict[str, str] = {
    "simple": "gemini-2.5-flash",
    "moderate": "gemini-2.5-flash",
    "complex": "gemini-2.5-pro",
}

CODEX_MODELS: Dict[str, str] = {
    "simple": "gpt-4.1-mini",
    "moderate": "gpt-4.1",
    "complex": "o4-mini",
}

CLAUDE_MODELS: Dict[str, str] = {
    "simple": "claude-sonnet-4-5-20250929",
    "moderate": "claude-sonnet-4-5-20250929",
    "complex": "claude-opus-4-6",
}

# Category-level Codex model mapping (used by populate_all, convert_to_codex_responses)
CODEX_CATEGORY_MODELS: Dict[str, str] = {
    "technical": "gpt-4.1",
    "ai-agents": "gpt-4.1",
    "strategy": "o4-mini",
    "creative": "gpt-4.1",
    "operations": "gpt-4.1-mini",
    "industry": "gpt-4.1",
}

# ---------------------------------------------------------------------------
# Gemini safety settings
# ---------------------------------------------------------------------------

GEMINI_HARM_CATEGORIES: List[str] = [
    "HARM_CATEGORY_HARASSMENT",
    "HARM_CATEGORY_HATE_SPEECH",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "HARM_CATEGORY_DANGEROUS_CONTENT",
    "HARM_CATEGORY_CIVIC_INTEGRITY",
]

GEMINI_SAFETY_SETTINGS: List[Dict[str, str]] = [
    {"category": cat, "threshold": "BLOCK_ONLY_HIGH"}
    for cat in GEMINI_HARM_CATEGORIES
]

# ---------------------------------------------------------------------------
# Gemini grounding
# ---------------------------------------------------------------------------

GROUNDING_CATEGORIES: Set[str] = {"strategy", "industry", "operations"}

GROUNDING_PREFIX: str = (
    "When responding, leverage Google Search grounding to verify facts and "
    "provide current information. Use structured output when presenting data, "
    "comparisons, or analysis results.\n\n"
)

# ---------------------------------------------------------------------------
# Codex tools mapping per category
# ---------------------------------------------------------------------------

CODEX_TOOLS: Dict[str, List[Dict[str, str]]] = {
    "technical": [{"type": "code_interpreter"}, {"type": "file_search"}],
    "strategy": [{"type": "code_interpreter"}, {"type": "web_search_preview"}],
    "creative": [{"type": "code_interpreter"}],
    "industry": [{"type": "code_interpreter"}, {"type": "web_search_preview"}],
    "operations": [{"type": "code_interpreter"}],
    "ai-agents": [{"type": "code_interpreter"}, {"type": "web_search_preview"}],
}

# ---------------------------------------------------------------------------
# Copilot file patterns per category
# ---------------------------------------------------------------------------

COPILOT_PATTERNS: Dict[str, str] = {
    "technical": "**/*.{ts,js,py,go,rs,java}",
    "strategy": "**/*.{md,txt}",
    "creative": "**/*.{md,html,css,svg}",
    "operations": "**/*.{yml,yaml,json,toml,sh}",
    "industry": "**/*.{md,txt,csv,json}",
    "ai-agents": "**/*.{md,yml,yaml,json,py,ts}",
}

# ---------------------------------------------------------------------------
# GPT Builder capabilities per category (Codex)
# ---------------------------------------------------------------------------

CAPABILITIES_MAP: Dict[str, Dict[str, bool]] = {
    "technical": {
        "web_browsing": False,
        "code_interpreter": True,
        "image_generation": False,
        "file_upload": True,
    },
    "strategy": {
        "web_browsing": True,
        "code_interpreter": True,
        "image_generation": False,
        "file_upload": True,
    },
    "creative": {
        "web_browsing": False,
        "code_interpreter": True,
        "image_generation": True,
        "file_upload": True,
    },
    "industry": {
        "web_browsing": True,
        "code_interpreter": True,
        "image_generation": False,
        "file_upload": True,
    },
    "operations": {
        "web_browsing": False,
        "code_interpreter": True,
        "image_generation": False,
        "file_upload": True,
    },
    "ai-agents": {
        "web_browsing": True,
        "code_interpreter": True,
        "image_generation": False,
        "file_upload": True,
    },
}

# ---------------------------------------------------------------------------
# Agent loop prefix for Codex Agent Builder
# ---------------------------------------------------------------------------

AGENT_LOOP_PREFIX: str = """You are an autonomous agent. Follow these operating principles:
1. Break complex tasks into discrete, verifiable steps.
2. Use your tools to gather information before generating responses.
3. Verify your work at each step before proceeding.
4. If uncertain, state your confidence level and reasoning.
5. Provide structured, actionable output.

"""

# ---------------------------------------------------------------------------
# Gemini Agent tools per category
# ---------------------------------------------------------------------------

GEMINI_AGENT_TOOLS: Dict[str, List[Dict[str, str]]] = {
    "technical": [{"name": "code_execution"}, {"name": "google_search"}],
    "ai-agents": [{"name": "code_execution"}, {"name": "google_search"}],
    "strategy": [{"name": "google_search"}],
    "creative": [{"name": "code_execution"}],
    "operations": [{"name": "code_execution"}],
    "industry": [{"name": "google_search"}],
}

# ---------------------------------------------------------------------------
# Copilot Frontier skill keywords (for autonomous coding agent selection)
# ---------------------------------------------------------------------------

FRONTIER_SKILL_KEYWORDS: List[str] = [
    "code",
    "api",
    "test",
    "debug",
    "refactor",
    "review",
    "deploy",
    "ci",
    "docker",
    "git",
    "database",
    "security",
    "performance",
    "architect",
    "documentation",
    "migration",
    "monitoring",
    "infrastructure",
    "devops",
    "typescript",
    "python",
    "react",
    "vue",
    "angular",
    "node",
    "rust",
    "kubernetes",
    "terraform",
    "aws",
    "azure",
    "microservice",
    "graphql",
]

# ---------------------------------------------------------------------------
# Bundle paths
# ---------------------------------------------------------------------------

GEMINI_BUNDLES = BASE_DIR / "platforms" / "gemini" / "gemini-skills" / "bundles"
CODEX_BUNDLES = BASE_DIR / "platforms" / "codex" / "codex-skills" / "bundles"
COPILOT_BUNDLES = BASE_DIR / "platforms" / "github-copilot" / "copilot-skills" / "bundles"

# ---------------------------------------------------------------------------
# Variant paths
# ---------------------------------------------------------------------------

COPILOT_FRONTIER = BASE_DIR / "platforms" / "github-copilot" / "copilot-skills-frontier"
GEMINI_AGENTS = BASE_DIR / "platforms" / "gemini" / "gemini-skills-agents" / ".gemini" / "agents"
CLAUDE_DESKTOP = BASE_DIR / "platforms" / "claude" / "claude-skills-desktop"
CLAUDE_WEB = BASE_DIR / "platforms" / "claude" / "claude-skills-web"

# ---------------------------------------------------------------------------
# Platform output paths (for CLI converters)
# ---------------------------------------------------------------------------

PLATFORM_OUTPUTS: Dict[str, Path] = {
    "claude": BASE_DIR / "platforms" / "claude" / "claude-skills-cli",
    "gemini": BASE_DIR / "platforms" / "gemini" / "gemini-skills-cli",
    "codex": BASE_DIR / "platforms" / "codex" / "codex-skills-cli",
    "copilot": BASE_DIR / "platforms" / "github-copilot" / "copilot-skills-cli",
}

# ---------------------------------------------------------------------------
# Quality fix constants (used by fix_skills.py and friends)
# ---------------------------------------------------------------------------

# Trigger verbs that make descriptions discoverable
TRIGGER_VERBS: List[str] = [
    "create",
    "analyze",
    "build",
    "manage",
    "optimize",
    "generate",
    "design",
    "develop",
    "implement",
    "configure",
    "deploy",
    "automate",
    "review",
    "audit",
    "plan",
    "monitor",
    "debug",
    "test",
    "transform",
    "validate",
    "migrate",
    "integrate",
    "document",
    "evaluate",
    "refactor",
]

# Category-specific "Use when" phrases
USE_WHEN_MAP: Dict[str, str] = {
    "technical": "Use when building, debugging, or optimizing technical implementations.",
    "strategy": "Use when planning, analyzing, or developing business strategies.",
    "creative": "Use when designing, creating, or reviewing creative deliverables.",
    "industry": "Use when navigating industry-specific regulations, processes, or operations.",
    "operations": "Use when managing, optimizing, or automating operational workflows.",
    "ai-agents": "Use when configuring, building, or troubleshooting AI agent workflows.",
}

# Category-specific verb suggestions
VERB_MAP: Dict[str, List[str]] = {
    "technical": ["build", "debug", "optimize", "implement", "deploy"],
    "strategy": ["analyze", "plan", "evaluate", "develop", "optimize"],
    "creative": ["design", "create", "review", "produce", "refine"],
    "industry": ["manage", "audit", "monitor", "implement", "evaluate"],
    "operations": ["automate", "manage", "optimize", "monitor", "streamline"],
    "ai-agents": ["configure", "build", "automate", "integrate", "orchestrate"],
}

# Core section names recognized in SKILL.md files
CORE_SECTION_NAMES: Set[str] = {
    "core workflow",
    "instructions",
    "core processes",
    "core process",
    "workflow",
    "quick start",
    "how to use",
    "getting started",
    "steps",
    "step",
    "usage",
    "implementation",
    "process",
    "guide",
    "overview",
    "methodology",
    "framework",
    "approach",
    "procedure",
    "how it works",
    "implementation guide",
    "key capabilities",
    "primary functions",
    "main features",
    "configuration",
}

# Workflow section patterns (regex)
WORKFLOW_PATTERNS: List[str] = [
    r"^##\s*Core Workflow",
    r"^##\s*Instructions",
    r"^##\s*Core Process",
    r"^##\s*Workflow",
    r"^##\s*How to Use",
    r"^##\s*Getting Started",
    r"^##\s*Quick Start",
    r"^##\s*Steps?\b",
    r"^##\s*Usage",
    r"^##\s*Implementation",
    r"^##\s*Process",
    r"^##\s*Guide",
    r"^##\s*Overview",
    r"^##\s*Methodology",
    r"^##\s*Framework",
    r"^##\s*Approach",
    r"^##\s*Procedure",
]

# ---------------------------------------------------------------------------
# Junk slugs to clean up
# ---------------------------------------------------------------------------

JUNK_SLUGS: Set[str] = {
    "undefined",
    "unnamed",
    "template-skill",
    "flashfusion-ai-skill-pack",
    "claudeskills",
    "untitled",
    "test-skill",
    "example-skill",
}
