#!/usr/bin/env python3
"""
Multi-Platform Skills Sync Pipeline
Syncs changes from _master-skills to all platform-specific formats.

Supported targets:
    gemini   - Gemini Gem JSON files
    copilot  - GitHub Copilot custom-instruction Markdown
    codex    - OpenAI Responses API / GPT / system-prompt formats
    claude   - Claude-native SKILL.md with enhanced frontmatter
    cli      - CLI variants for Claude, Gemini, Codex, and Copilot CLIs

Usage:
    python sync-skills.py --targets all
    python sync-skills.py --targets gemini,codex --validate
    python sync-skills.py --skill technical/api-development --targets all
    python sync-skills.py --category ai-agents --targets gemini --dry-run
    python sync-skills.py --targets all --stats
"""

import argparse
import json
import re
import sys
import textwrap
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml

# ---------------------------------------------------------------------------
# Ensure project root is on sys.path so `from lib.*` works after script
# moved from root into scripts/
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# ---------------------------------------------------------------------------
# Optional lib imports - graceful fallback when lib/ isn't available yet
# ---------------------------------------------------------------------------

_HAS_PLATFORM_TUNING = False
_HAS_METADATA_ENRICHER = False
_HAS_SKILL_VALIDATOR = False

try:
    from lib.platform_tuning import (
        PLATFORM_TEMPLATES,
        estimate_complexity,
        get_claude_settings,
        get_codex_settings,
        get_copilot_settings,
        get_gemini_settings,
    )
    _HAS_PLATFORM_TUNING = True
except ImportError:
    pass

try:
    from lib.metadata_enricher import enrich_skill
    _HAS_METADATA_ENRICHER = True
except ImportError:
    pass

try:
    from lib.skill_validator import SkillValidator
    _HAS_SKILL_VALIDATOR = True
except ImportError:
    pass

_HAS_SKILL_PARSER = False
try:
    from lib.skill_parser import parse_skill_file as _parse_skill_file
    _HAS_SKILL_PARSER = True
except ImportError:
    pass

# ---------------------------------------------------------------------------
# Inline fallbacks (used only when lib modules are not importable)
# ---------------------------------------------------------------------------

_FALLBACK_TEMPLATES = {
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


def _get_templates() -> Dict[str, str]:
    """Return platform templates from lib if available, else fallback."""
    if _HAS_PLATFORM_TUNING:
        return PLATFORM_TEMPLATES
    return _FALLBACK_TEMPLATES


def _fallback_estimate_complexity(skill_data: dict) -> str:
    """Minimal complexity estimator used when lib is unavailable."""
    body = skill_data.get("body", "")
    line_count = len(body.splitlines())
    if line_count > 300:
        return "complex"
    elif line_count >= 100:
        return "moderate"
    return "simple"


def _wrap_body(body: str, template_key: str) -> str:
    """Wrap skill body with the named platform template."""
    templates = _get_templates()
    template = templates.get(template_key)
    if template and "{core_instructions}" in template:
        return template.replace("{core_instructions}", body)
    return body




# ===================================================================
#  SkillParser
# ===================================================================

class SkillParser:
    """Parse SKILL.md files into structured data.

    Delegates to ``lib.skill_parser.parse_skill_file`` when available,
    with inline fallback for backward compatibility.
    """

    @staticmethod
    def parse(skill_path: Path) -> Dict:
        """Parse a SKILL.md file and return structured data.

        If the lib.metadata_enricher module is available the parsed data is
        automatically enriched with extra metadata (tags, version, token
        estimates, etc.).
        """
        # Use the canonical shared parser when available
        if _HAS_SKILL_PARSER:
            skill_data = _parse_skill_file(skill_path)
        else:
            # Inline fallback (for backward compatibility)
            content = skill_path.read_text(encoding='utf-8', errors='replace')
            frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
            if frontmatter_match:
                frontmatter_str = frontmatter_match.group(1)
                body = frontmatter_match.group(2).strip()
                try:
                    frontmatter = yaml.safe_load(frontmatter_str) or {}
                    if not isinstance(frontmatter, dict):
                        frontmatter = {}
                except Exception:
                    frontmatter = {}
                    for line in frontmatter_str.split('\n'):
                        if ':' in line:
                            key, value = line.split(':', 1)
                            frontmatter[key.strip()] = value.strip()
            else:
                frontmatter = {'name': skill_path.parent.name, 'description': ''}
                body = content

            category = skill_path.parent.parent.name
            skill_data = {
                'name': frontmatter.get('name', skill_path.parent.name),
                'description': frontmatter.get('description', ''),
                'license': frontmatter.get('license', ''),
                'version': frontmatter.get('version', '1.0.0'),
                'tags': frontmatter.get('tags', []),
                'body': body,
                'path': str(skill_path),
                'category': category,
                'slug': skill_path.parent.name,
            }

        # Ensure license/version/tags fields exist
        skill_data.setdefault('license', '')
        skill_data.setdefault('version', '1.0.0')
        skill_data.setdefault('tags', [])

        # Estimate complexity
        if _HAS_PLATFORM_TUNING:
            skill_data['complexity'] = estimate_complexity(skill_data)
        else:
            skill_data['complexity'] = _fallback_estimate_complexity(skill_data)

        # Enrich with metadata if lib is available
        if _HAS_METADATA_ENRICHER:
            try:
                skill_data = enrich_skill(skill_data)
            except Exception as exc:
                print(f"  [warn] metadata enrichment failed for {skill_data['name']}: {exc}")

        return skill_data


# ===================================================================
#  GeminiConverter
# ===================================================================

class GeminiConverter:
    """Convert skills to Gemini Gem format with platform tuning."""

    def __init__(self, output_dir: Path):
        self.output_dir = output_dir

    def convert(self, skill: Dict, *, dry_run: bool = False) -> List[Path]:
        """Convert a skill to Gemini Gem JSON format.

        Returns a list containing the single output path.
        """
        # Platform-tuned settings
        if _HAS_PLATFORM_TUNING:
            settings = get_gemini_settings(skill)
        else:
            settings = {
                "model": "gemini-2.5-flash",
                "temperature": 0.7,
                "safetySettings": [],
            }

        # Wrap body with grounding template
        wrapped_body = _wrap_body(skill['body'], "gemini_template")

        # Grounding hints
        grounding_hints = {
            "useGrounding": True,
            "groundingSource": "google_search",
        }

        gem = {
            "name": skill['name'],
            "description": skill['description'],
            "systemInstruction": wrapped_body,
            "context": {
                "files": [],
                "knowledgeBase": [],
            },
            "settings": {
                "temperature": settings["temperature"],
                "model": settings["model"],
                "safetySettings": settings.get("safetySettings", []),
            },
            "grounding": grounding_hints,
            "metadata": {
                "category": skill['category'],
                "complexity": skill.get('complexity', 'moderate'),
                "version": skill.get('version', '1.0.0'),
                "tags": skill.get('tags', []),
                "source": "master-skills",
                "synced_at": datetime.now(timezone.utc).isoformat(),
            },
        }

        output_path = (
            self.output_dir / "gems" / skill['category']
            / f"{Path(skill['path']).parent.name}.gem.json"
        )

        if not dry_run:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(json.dumps(gem, indent=2, ensure_ascii=False), encoding='utf-8')

        return [output_path]


# ===================================================================
#  CopilotConverter
# ===================================================================

class CopilotConverter:
    """Convert skills to GitHub Copilot custom-instruction format."""

    def __init__(self, output_dir: Path):
        self.output_dir = output_dir

    def convert(self, skill: Dict, *, dry_run: bool = False) -> List[Path]:
        """Convert a skill to Copilot instruction Markdown.

        Returns a list containing the single output path.
        """
        # Platform-tuned settings
        if _HAS_PLATFORM_TUNING:
            settings = get_copilot_settings(skill)
        else:
            settings = {
                "applyTo": ["**/*"],
                "scope": "workspace",
                "priority": 5,
            }

        # Wrap body with @workspace template
        wrapped_body = _wrap_body(skill['body'], "copilot_template")

        # Build file-pattern header
        apply_to_str = ", ".join(f"`{p}`" for p in settings["applyTo"])

        content = f"""---
applyTo: "{', '.join(settings['applyTo'])}"
scope: {settings['scope']}
priority: {settings['priority']}
---
# {skill['name']}

> **Category:** {skill['category']} | **Complexity:** {skill.get('complexity', 'moderate')} | **Version:** {skill.get('version', '1.0.0')}

## Overview
{skill['description']}

## File Patterns
Applies to: {apply_to_str}

## Instructions
{wrapped_body}

## @workspace References
- Use `@workspace` to reference project files, symbols, and context
- Use `@terminal` for shell command suggestions
- Use `@vscode` for editor actions

## Usage
Use this instruction file with GitHub Copilot by copying to your project's `.github/copilot-instructions.md` file or referencing in Copilot Chat.
"""

        output_path = (
            self.output_dir / "custom-instructions" / skill['category']
            / f"{Path(skill['path']).parent.name}.md"
        )

        if not dry_run:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(content, encoding='utf-8')

        return [output_path]


# ===================================================================
#  CodexResponsesConverter (replaces deprecated CodexConverter)
# ===================================================================

class CodexResponsesConverter:
    """Convert skills to OpenAI Responses API, GPT, and system-prompt formats.

    Generates:
      - .response.json  (Responses API format)
      - .gpt.json       (GPT / ChatGPT custom-GPT format)
      - .txt            (raw system prompt)
    """

    def __init__(self, output_dir: Path):
        self.output_dir = output_dir

    def convert(self, skill: Dict, *, dry_run: bool = False) -> List[Path]:
        """Convert a skill to all OpenAI output formats.

        Returns a list of output paths written.
        """
        paths: List[Path] = []

        # Platform-tuned settings
        if _HAS_PLATFORM_TUNING:
            settings = get_codex_settings(skill)
        else:
            settings = {
                "model": "gpt-4.1",
                "tools": ["code_interpreter"],
                "response_format": {"type": "text"},
            }

        complexity = skill.get('complexity', 'moderate')
        category = skill.get('category', 'technical')
        temperature = {
            "simple": 0.3,
            "moderate": 0.5,
            "complex": 0.7,
        }.get(complexity, 0.5)

        # Wrap body with codex template
        wrapped_body = _wrap_body(skill['body'], "codex_template")

        slug = Path(skill['path']).parent.name

        # --- Responses API format ---
        response_obj = {
            "name": skill['name'],
            "instructions": wrapped_body,
            "model": settings["model"],
            "tools": [{"type": t} for t in settings["tools"]],
            "metadata": {
                "category": category,
                "tags": skill.get('tags', []),
                "complexity": complexity,
                "version": skill.get('version', '1.0.0'),
                "source": "master-skills",
                "synced_at": datetime.now(timezone.utc).isoformat(),
            },
            "temperature": temperature,
            "top_p": 1.0,
        }

        response_path = (
            self.output_dir / "responses" / category / f"{slug}.response.json"
        )
        if not dry_run:
            response_path.parent.mkdir(parents=True, exist_ok=True)
            response_path.write_text(json.dumps(response_obj, indent=2, ensure_ascii=False), encoding='utf-8')
        paths.append(response_path)

        # --- GPT format ---
        gpt = {
            "name": skill['name'],
            "description": skill['description'],
            "instructions": wrapped_body,
            "conversation_starters": [
                f"Help me with {skill['name'].lower()}",
                f"Explain how to use {skill['name'].lower()}",
            ],
            "capabilities": {
                "web_browsing": "web_search" in settings["tools"],
                "code_interpreter": "code_interpreter" in settings["tools"],
                "image_generation": False,
                "file_search": "file_search" in settings["tools"],
            },
            "metadata": {
                "category": category,
                "complexity": complexity,
                "version": skill.get('version', '1.0.0'),
            },
        }

        gpt_path = (
            self.output_dir / "gpts" / category / f"{slug}.gpt.json"
        )
        if not dry_run:
            gpt_path.parent.mkdir(parents=True, exist_ok=True)
            gpt_path.write_text(json.dumps(gpt, indent=2, ensure_ascii=False), encoding='utf-8')
        paths.append(gpt_path)

        # --- System prompt (raw text) ---
        prompt_path = self.output_dir / "system-prompts" / category / f"{slug}.txt"
        if not dry_run:
            prompt_path.parent.mkdir(parents=True, exist_ok=True)
            prompt_path.write_text(wrapped_body, encoding='utf-8')
        paths.append(prompt_path)

        return paths


# ===================================================================
#  ClaudeConverter
# ===================================================================

class ClaudeConverter:
    """Convert skills to Claude-native SKILL.md format with enhanced frontmatter."""

    def __init__(self, output_dir: Path):
        self.output_dir = output_dir

    def convert(self, skill: Dict, *, dry_run: bool = False) -> List[Path]:
        """Convert a skill to Claude-native format.

        Output: platforms/claude/claude-skills/skills/{category}/{skill-name}/SKILL.md

        Returns a list containing the single output path.
        """
        # Platform-tuned settings
        if _HAS_PLATFORM_TUNING:
            settings = get_claude_settings(skill)
        else:
            settings = {
                "model": "claude-sonnet-4-5-20250929",
                "max_tokens": 8192,
                "tool_hints": [],
            }

        # Wrap body with Claude template
        wrapped_body = _wrap_body(skill['body'], "claude_template")

        # Build enhanced frontmatter
        tags_value = skill.get('tags', [])
        if isinstance(tags_value, list):
            tags_yaml = json.dumps(tags_value, ensure_ascii=False)
        else:
            tags_yaml = str(tags_value)

        tool_hints_yaml = ""
        if settings.get("tool_hints"):
            tool_hint_items = []
            for hint in settings["tool_hints"]:
                tool_hint_items.append(
                    f'  - type: {hint["type"]}\n    name: {hint["name"]}\n    description: "{hint["description"]}"'
                )
            tool_hints_yaml = "\ntool_hints:\n" + "\n".join(tool_hint_items)

        frontmatter = (
            f"---\n"
            f"name: \"{skill['name']}\"\n"
            f"description: \"{skill['description']}\"\n"
            f"version: \"{skill.get('version', '1.0.0')}\"\n"
            f"category: {skill['category']}\n"
            f"complexity: {skill.get('complexity', 'moderate')}\n"
            f"tags: {tags_yaml}\n"
            f"model: {settings['model']}\n"
            f"max_tokens: {settings['max_tokens']}"
            f"{tool_hints_yaml}\n"
            f"synced_at: \"{datetime.now(timezone.utc).isoformat()}\"\n"
            f"---"
        )

        content = f"""{frontmatter}

{wrapped_body}
"""

        skill_slug = Path(skill['path']).parent.name
        output_path = (
            self.output_dir / "skills" / skill['category'] / skill_slug / "SKILL.md"
        )

        if not dry_run:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(content, encoding='utf-8')

        return [output_path]


# ===================================================================
#  CLISkillsConverter
# ===================================================================

class CLISkillsConverter:
    """Generate CLI-optimised skill files for all platform CLIs.

    Output layout (all relative to base_dir):
        Claude CLI:
            platforms/claude/claude-skills-cli/skills/{skill-name}/SKILL.md
        Gemini CLI:
            platforms/gemini/gemini-skills-cli/skills/{skill-name}/SKILL.md
            .gemini/skills/{skill-name}/SKILL.md
        Codex CLI:
            platforms/codex/codex-skills-cli/skills/{skill-name}/AGENTS.md
        Copilot CLI:
            platforms/github-copilot/copilot-skills-cli/skills/{skill-name}/SKILL.md
            .github/skills/{skill-name}/SKILL.md
    """

    def __init__(self, base_dir: Path):
        self.base_dir = base_dir

    def convert(self, skill: Dict, *, dry_run: bool = False) -> List[Path]:
        """Convert a skill to all CLI variants.

        Returns a list of output paths written.
        """
        paths: List[Path] = []
        slug = skill.get('_dedup_slug', Path(skill['path']).parent.name)

        # --- Claude CLI ---
        claude_body = _wrap_body(skill['body'], "claude_template")
        claude_content = self._build_skill_md(skill, claude_body, platform="claude")
        claude_path = (
            self.base_dir / "platforms" / "claude" / "claude-skills-cli" / "skills" / slug / "SKILL.md"
        )
        paths.append(claude_path)

        # --- Gemini CLI (two locations) ---
        gemini_body = _wrap_body(skill['body'], "gemini_template")
        gemini_content = self._build_skill_md(skill, gemini_body, platform="gemini")

        gemini_path_1 = (
            self.base_dir / "platforms" / "gemini" / "gemini-skills-cli" / "skills" / slug / "SKILL.md"
        )
        gemini_path_2 = (
            self.base_dir / ".gemini" / "skills" / slug / "SKILL.md"
        )
        paths.extend([gemini_path_1, gemini_path_2])

        # --- Codex CLI ---
        codex_body = _wrap_body(skill['body'], "codex_template")
        codex_content = self._build_skill_md(skill, codex_body, platform="codex")

        codex_path = (
            self.base_dir / "platforms" / "codex" / "codex-skills-cli" / "skills" / slug / "AGENTS.md"
        )
        paths.append(codex_path)

        # --- Copilot CLI (two locations) ---
        copilot_body = _wrap_body(skill['body'], "copilot_template")
        copilot_content = self._build_skill_md(skill, copilot_body, platform="copilot")

        copilot_path_1 = (
            self.base_dir / "platforms" / "github-copilot" / "copilot-skills-cli" / "skills" / slug / "SKILL.md"
        )
        copilot_path_2 = (
            self.base_dir / ".github" / "skills" / slug / "SKILL.md"
        )
        paths.extend([copilot_path_1, copilot_path_2])

        # Write all files
        if not dry_run:
            # Map content to paths
            content_map = {
                claude_path: claude_content,
                gemini_path_1: gemini_content,
                gemini_path_2: gemini_content,
                codex_path: codex_content,
                copilot_path_1: copilot_content,
                copilot_path_2: copilot_content,
            }
            for path, content in content_map.items():
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding='utf-8')

        return paths

    @staticmethod
    def _build_skill_md(skill: Dict, wrapped_body: str, *, platform: str) -> str:
        """Build a SKILL.md (or AGENTS.md) file with frontmatter."""
        tags_value = skill.get('tags', [])
        if isinstance(tags_value, list):
            tags_yaml = json.dumps(tags_value, ensure_ascii=False)
        else:
            tags_yaml = str(tags_value)

        return (
            f"---\n"
            f"name: \"{skill['name']}\"\n"
            f"description: \"{skill['description']}\"\n"
            f"version: \"{skill.get('version', '1.0.0')}\"\n"
            f"category: {skill['category']}\n"
            f"complexity: {skill.get('complexity', 'moderate')}\n"
            f"tags: {tags_yaml}\n"
            f"platform: {platform}\n"
            f"format: cli\n"
            f"synced_at: \"{datetime.now(timezone.utc).isoformat()}\"\n"
            f"---\n\n"
            f"{wrapped_body}\n"
        )


# ===================================================================
#  SkillsSyncer (orchestrator)
# ===================================================================

class SkillsSyncer:
    """Main syncer class to coordinate all conversions."""

    ALL_TARGETS = ['gemini', 'copilot', 'codex', 'claude', 'cli']

    def __init__(self, base_dir: Path):
        self.base_dir = base_dir
        self.master_dir = base_dir / "_master-skills"

        self.converters: Dict[str, Any] = {
            'gemini':  GeminiConverter(base_dir / "platforms" / "gemini" / "gemini-skills"),
            'copilot': CopilotConverter(base_dir / "platforms" / "github-copilot" / "copilot-skills"),
            'codex':   CodexResponsesConverter(base_dir / "platforms" / "codex" / "codex-skills"),
            'claude':  ClaudeConverter(base_dir / "platforms" / "claude" / "claude-skills"),
            'cli':     CLISkillsConverter(base_dir),
        }

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def sync_all(
        self,
        targets: List[str] = None,
        *,
        validate: bool = False,
        dry_run: bool = False,
        show_stats: bool = False,
    ):
        """Sync all skills to specified targets."""
        targets = self._resolve_targets(targets)
        skills = self._discover_skills()

        print(f"Discovered {len(skills)} skills in {self.master_dir}")
        if dry_run:
            print("[DRY RUN] No files will be written.\n")

        stats = {target: 0 for target in targets}
        file_counts = {target: 0 for target in targets}
        validation_errors: List[str] = []
        enrichment_stats = {"enriched": 0, "total": 0}

        # Parse all skills first so we can deduplicate slugs
        from collections import Counter
        parsed_skills = []
        for skill_path in skills:
            skill = SkillParser.parse(skill_path)
            enrichment_stats["total"] += 1
            if skill.get("_enriched"):
                enrichment_stats["enriched"] += 1
            parsed_skills.append(skill)

        # Deduplicate slugs: same dir name in different categories
        dir_name_counts = Counter(Path(s['path']).parent.name for s in parsed_skills)
        for s in parsed_skills:
            dn = Path(s['path']).parent.name
            if dir_name_counts[dn] > 1:
                s['_dedup_slug'] = f"{s['category']}--{dn}"

        for idx, skill in enumerate(parsed_skills, 1):
            label = f"[{idx}/{len(parsed_skills)}] {skill['category']}/{skill['name']}"
            print(f"  {label}")

            if validate and not self._validate_skill(skill, label, validation_errors):
                continue

            for target in targets:
                if target in self.converters:
                    output_paths = self.converters[target].convert(skill, dry_run=dry_run)
                    stats[target] += 1
                    file_counts[target] += len(output_paths)
                    if dry_run:
                        for p in output_paths:
                            print(f"    -> [dry-run] {p}")

        self._print_summary(stats, file_counts, validation_errors, enrichment_stats, show_stats, dry_run)

    def sync_skill(
        self,
        skill_ref: str,
        targets: List[str] = None,
        *,
        validate: bool = False,
        dry_run: bool = False,
        show_stats: bool = False,
    ):
        """Sync a specific skill by category/name reference."""
        targets = self._resolve_targets(targets)

        skill_path = self.master_dir / skill_ref / "SKILL.md"
        if not skill_path.exists():
            print(f"Skill not found: {skill_ref}")
            return

        if dry_run:
            print("[DRY RUN] No files will be written.\n")

        skill = SkillParser.parse(skill_path)
        validation_errors: List[str] = []

        if validate and not self._validate_skill(skill, skill_ref, validation_errors):
            self._print_summary({}, {}, validation_errors, {}, False, dry_run)
            return

        stats = {target: 0 for target in targets}
        file_counts = {target: 0 for target in targets}

        for target in targets:
            if target in self.converters:
                output_paths = self.converters[target].convert(skill, dry_run=dry_run)
                stats[target] += 1
                file_counts[target] += len(output_paths)
                for p in output_paths:
                    action = "[dry-run] " if dry_run else ""
                    print(f"  {action}Converted {skill['name']} -> {target}: {p}")

        enrichment_stats = {
            "total": 1,
            "enriched": 1 if skill.get("_enriched") else 0,
        }
        self._print_summary(stats, file_counts, validation_errors, enrichment_stats, show_stats, dry_run)

    def sync_category(
        self,
        category: str,
        targets: List[str] = None,
        *,
        validate: bool = False,
        dry_run: bool = False,
        show_stats: bool = False,
    ):
        """Sync all skills in a category."""
        targets = self._resolve_targets(targets)

        category_dir = self.master_dir / category
        if not category_dir.exists():
            print(f"Category not found: {category}")
            return

        skills_paths = list(category_dir.glob("*/SKILL.md"))
        print(f"Found {len(skills_paths)} skills in category '{category}'")
        if dry_run:
            print("[DRY RUN] No files will be written.\n")

        stats = {target: 0 for target in targets}
        file_counts = {target: 0 for target in targets}
        validation_errors: List[str] = []
        enrichment_stats = {"enriched": 0, "total": 0}

        for idx, skill_path in enumerate(skills_paths, 1):
            skill = SkillParser.parse(skill_path)
            enrichment_stats["total"] += 1
            if skill.get("_enriched"):
                enrichment_stats["enriched"] += 1

            label = f"[{idx}/{len(skills_paths)}] {skill['name']}"
            print(f"  {label}")

            if validate and not self._validate_skill(skill, label, validation_errors):
                continue

            for target in targets:
                if target in self.converters:
                    output_paths = self.converters[target].convert(skill, dry_run=dry_run)
                    stats[target] += 1
                    file_counts[target] += len(output_paths)

        self._print_summary(stats, file_counts, validation_errors, enrichment_stats, show_stats, dry_run)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _resolve_targets(self, targets: Optional[List[str]]) -> List[str]:
        """Normalise the targets list, expanding 'all'."""
        if targets is None or 'all' in targets:
            return list(self.ALL_TARGETS)
        return [t for t in targets if t in self.converters]

    def _discover_skills(self) -> List[Path]:
        """Discover all SKILL.md files in master directory."""
        return sorted(self.master_dir.glob("*/*/SKILL.md"))

    @staticmethod
    def _validate_skill(skill: Dict, label: str, errors: List[str]) -> bool:
        """Run validation on a parsed skill if the validator is available.

        Returns True if the skill passes validation (or if the validator is
        not available), False if validation fails.
        """
        if not _HAS_SKILL_VALIDATOR:
            return True
        try:
            validator = SkillValidator()
            result = validator.validate(skill)
            if not result.passed:
                issues = result.errors + result.warnings
                if not issues:
                    issues = ["unknown validation error"]
                for issue in issues:
                    msg = f"  [VALIDATION] {label}: {issue}"
                    print(msg)
                    errors.append(msg)
                return False
        except Exception as exc:
            msg = f"  [VALIDATION ERROR] {label}: {exc}"
            print(msg)
            errors.append(msg)
            return False
        return True

    @staticmethod
    def _print_summary(
        stats: Dict[str, int],
        file_counts: Dict[str, int],
        validation_errors: List[str],
        enrichment_stats: Dict[str, int],
        show_stats: bool,
        dry_run: bool,
    ):
        """Print a summary report at the end of a sync run."""
        prefix = "[DRY RUN] " if dry_run else ""

        print(f"\n{'=' * 60}")
        print(f"{prefix}Sync complete")
        print(f"{'=' * 60}")

        if stats:
            total_skills = 0
            total_files = 0
            for target in sorted(stats.keys()):
                count = stats[target]
                files = file_counts.get(target, 0)
                total_skills += count
                total_files += files
                print(f"  {target:>10}: {count:>4} skills  ({files} files)")
            print(f"  {'TOTAL':>10}: {total_skills:>4} skills  ({total_files} files)")

        if validation_errors:
            print(f"\nValidation errors: {len(validation_errors)}")
            for err in validation_errors:
                print(f"  {err}")

        if show_stats and enrichment_stats:
            total = enrichment_stats.get("total", 0)
            enriched = enrichment_stats.get("enriched", 0)
            pct = (enriched / total * 100) if total > 0 else 0
            print("\nEnrichment statistics:")
            print(f"  Total skills processed : {total}")
            print(f"  Successfully enriched  : {enriched} ({pct:.0f}%)")
            if _HAS_PLATFORM_TUNING:
                print("  Platform tuning        : active (lib.platform_tuning)")
            else:
                print("  Platform tuning        : fallback (lib not available)")
            if _HAS_METADATA_ENRICHER:
                print("  Metadata enrichment    : active (lib.metadata_enricher)")
            else:
                print("  Metadata enrichment    : disabled (lib not available)")
            if _HAS_SKILL_VALIDATOR:
                print("  Skill validation       : active (lib.skill_validator)")
            else:
                print("  Skill validation       : disabled (lib not available)")

        print()


# ===================================================================
#  CLI entry point
# ===================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Multi-Platform Skills Sync Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            examples:
              python sync-skills.py --targets all
              python sync-skills.py --targets gemini,codex --validate
              python sync-skills.py --skill technical/api-development --targets all
              python sync-skills.py --category ai-agents --targets gemini --dry-run
              python sync-skills.py --targets all --stats
        """),
    )
    parser.add_argument(
        "--targets", default="all",
        help="Comma-separated targets: gemini,copilot,codex,claude,cli,all (default: all)",
    )
    parser.add_argument(
        "--skill",
        help="Sync a specific skill (e.g., technical/api-development)",
    )
    parser.add_argument(
        "--category",
        help="Sync a specific category (e.g., ai-agents)",
    )
    parser.add_argument(
        "--validate", action="store_true",
        help="Run skill validation before converting (requires lib.skill_validator)",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show what would be converted without writing any files",
    )
    parser.add_argument(
        "--stats", action="store_true",
        help="Show enrichment and platform-tuning statistics after conversion",
    )

    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent.parent
    syncer = SkillsSyncer(base_dir)

    targets = [t.strip() for t in args.targets.split(',')]

    # Print lib availability status
    print("Skills Sync Pipeline")
    print(f"  Platform tuning : {'active' if _HAS_PLATFORM_TUNING else 'fallback'}")
    print(f"  Metadata enrich : {'active' if _HAS_METADATA_ENRICHER else 'disabled'}")
    print(f"  Skill validator : {'active' if _HAS_SKILL_VALIDATOR else 'disabled'}")
    print()

    common_kwargs = dict(
        validate=args.validate,
        dry_run=args.dry_run,
        show_stats=args.stats,
    )

    if args.skill:
        syncer.sync_skill(args.skill, targets, **common_kwargs)
    elif args.category:
        syncer.sync_category(args.category, targets, **common_kwargs)
    else:
        syncer.sync_all(targets, **common_kwargs)


if __name__ == "__main__":
    main()
