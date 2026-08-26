#!/usr/bin/env python3
"""
populate_all.py - Comprehensive population script for Skills Library.

Handles (in execution order):
  Phase 3: Quality fixes (frontmatter, validation) - runs FIRST
  Phase 1: Bundle population (33 bundle dirs across Gemini, Codex, Copilot)
  Phase 2: Thin variant fixes (Copilot Frontier, Gemini Agents, Claude Desktop, Claude Web)
  Cleanup: Remove junk skills, deprecated files

Usage:
    python populate_all.py --phase all
    python populate_all.py --phase bundles
    python populate_all.py --phase variants
    python populate_all.py --phase quality
    python populate_all.py --phase cleanup
    python populate_all.py --dry-run --phase all
"""

import argparse
import json
import re
import shutil
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Ensure project root is on sys.path for lib imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

from lib.config import (
    BASE_DIR,
    CATEGORIES,
    CATEGORY_TEMPERATURES,
    CODEX_TOOLS,
    COPILOT_PATTERNS,
    GEMINI_SAFETY_SETTINGS,
    MASTER_DIR,
    PLATFORM_OUTPUTS,
)
from lib.config import (
    CODEX_CATEGORY_MODELS as CODEX_MODELS,
)

# Bundle roots
GEMINI_BUNDLES = BASE_DIR / "platforms" / "gemini" / "gemini-skills" / "bundles"
CODEX_BUNDLES = BASE_DIR / "platforms" / "codex" / "codex-skills" / "bundles"
COPILOT_BUNDLES = BASE_DIR / "platforms" / "github-copilot" / "copilot-skills" / "bundles"

# Variant roots
COPILOT_FRONTIER = BASE_DIR / "platforms" / "github-copilot" / "copilot-skills-frontier"
GEMINI_AGENTS = BASE_DIR / "platforms" / "gemini" / "gemini-skills-agents" / ".gemini" / "agents"
CLAUDE_DESKTOP = BASE_DIR / "platforms" / "claude" / "claude-skills-desktop"
CLAUDE_WEB = BASE_DIR / "platforms" / "claude" / "claude-skills-web"

# Gemini agent tools by category
GEMINI_AGENT_TOOLS = {
    "technical": [{"name": "code_execution"}, {"name": "google_search"}],
    "ai-agents": [{"name": "code_execution"}, {"name": "google_search"}],
    "strategy": [{"name": "google_search"}],
    "creative": [{"name": "code_execution"}],
    "operations": [{"name": "code_execution"}],
    "industry": [{"name": "google_search"}],
}

# Skills best suited for coding/dev work (for Copilot Frontier selection)
FRONTIER_SKILL_KEYWORDS = [
    "code", "api", "test", "debug", "refactor", "review", "deploy", "ci",
    "docker", "git", "database", "security", "performance", "architect",
    "documentation", "migration", "monitoring", "infrastructure", "devops",
    "typescript", "python", "react", "vue", "angular", "node", "rust",
    "kubernetes", "terraform", "aws", "azure", "microservice", "graphql",
]


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def slugify(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def parse_skill_md(file_path: Path) -> Optional[Dict[str, Any]]:
    """Parse a SKILL.md file returning name, description, body, category."""
    try:
        content = file_path.read_text(encoding='utf-8', errors='replace')
    except Exception:
        return None

    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
    if match:
        fm_text = match.group(1)
        body = match.group(2).strip()
        name_m = re.search(r'^name:\s*(.+)$', fm_text, re.MULTILINE)
        name = name_m.group(1).strip().strip('"\'') if name_m else file_path.parent.name
        desc_m = re.search(r'^description:\s*(.+?)(?=\n[a-zA-Z_-]+:|$)', fm_text, re.MULTILINE | re.DOTALL)
        description = ' '.join(desc_m.group(1).strip().strip('"\'').split()) if desc_m else f"Skill for {name}"
    else:
        # No frontmatter - use directory name and full content as body
        name = file_path.parent.name
        description = f"Skill for {name}"
        body = content.strip()

    category = file_path.parent.parent.name
    line_count = len(body.splitlines())

    return {
        "name": name,
        "description": description,
        "body": body,
        "category": category,
        "slug": file_path.parent.name,
        "path": str(file_path),
        "line_count": line_count,
    }


def discover_all_skills() -> List[Dict[str, Any]]:
    """Discover and parse all master skills."""
    skills = []
    for cat in CATEGORIES:
        cat_dir = MASTER_DIR / cat
        if not cat_dir.is_dir():
            continue
        for skill_dir in sorted(cat_dir.iterdir()):
            if not skill_dir.is_dir():
                continue
            skill_md = skill_dir / "SKILL.md"
            if not skill_md.is_file():
                continue
            skill = parse_skill_md(skill_md)
            if skill:
                skills.append(skill)

    # Deduplicate slugs: if the same directory name appears in multiple
    # categories, prefix all colliding slugs with their category.
    from collections import Counter
    slug_counts = Counter(s["slug"] for s in skills)
    for s in skills:
        if slug_counts[s["slug"]] > 1:
            s["slug"] = f"{s['category']}--{s['slug']}"

    return skills


def select_model_gemini(line_count: int) -> str:
    if line_count > 300:
        return "gemini-2.5-pro"
    return "gemini-2.5-flash"


def complexity_label(line_count: int) -> str:
    if line_count < 100:
        return "basic"
    if line_count <= 300:
        return "moderate"
    return "advanced"


def score_skill(skill: Dict) -> float:
    """Score a skill for ranking in curated bundles. Higher = better."""
    score = 0.0
    body = skill.get("body", "")
    line_count = skill.get("line_count", 0)

    # Reward substantial body
    if line_count >= 50:
        score += 2.0
    if line_count >= 100:
        score += 2.0
    if line_count >= 200:
        score += 1.0

    # Reward good description
    desc = skill.get("description", "")
    if len(desc) > 50:
        score += 1.0
    if "when" in desc.lower() or "use" in desc.lower():
        score += 1.0

    # Reward structure (headings)
    headings = len(re.findall(r'^#{1,4}\s', body, re.MULTILINE))
    score += min(headings * 0.3, 3.0)

    # Reward code blocks
    code_blocks = len(re.findall(r'```', body))
    score += min(code_blocks * 0.2, 2.0)

    # Penalize very short
    if line_count < 20:
        score -= 3.0

    return score


def is_frontier_skill(skill: Dict) -> bool:
    """Check if a skill is suitable for Copilot Frontier (coding agent)."""
    name = skill["name"].lower()
    desc = skill["description"].lower()
    cat = skill["category"]
    text = f"{name} {desc}"

    if cat == "technical":
        return True
    if cat == "ai-agents" and any(kw in text for kw in ["code", "api", "test", "deploy", "debug"]):
        return True
    return any(kw in text for kw in FRONTIER_SKILL_KEYWORDS)


# ---------------------------------------------------------------------------
# Format Builders
# ---------------------------------------------------------------------------

def build_gem_json(skill: Dict) -> str:
    """Build Gemini Gem JSON for a skill."""
    cat = skill["category"]
    model = select_model_gemini(skill["line_count"])
    temp = CATEGORY_TEMPERATURES.get(cat, 0.5)

    gem = {
        "name": skill["name"],
        "description": skill["description"],
        "systemInstruction": skill["body"],
        "settings": {
            "temperature": temp,
            "model": model,
            "topP": 0.95,
            "topK": 40,
            "maxOutputTokens": 8192,
        },
        "safetySettings": [
            {"category": c, "threshold": "BLOCK_ONLY_HIGH"}
            for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH",
                       "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]
        ],
        "metadata": {
            "category": cat,
            "complexity": complexity_label(skill["line_count"]),
            "version": "1.0.0",
            "source": "master-skills",
        },
    }
    return json.dumps(gem, indent=2, ensure_ascii=False)


def build_codex_response_json(skill: Dict) -> str:
    """Build OpenAI Responses API JSON for a skill."""
    cat = skill["category"]
    return json.dumps({
        "model": CODEX_MODELS.get(cat, "gpt-4.1"),
        "instructions": skill["body"],
        "tools": CODEX_TOOLS.get(cat, [{"type": "code_interpreter"}]),
        "metadata": {
            "skill_name": skill["name"],
            "category": cat,
            "version": "1.0.0",
            "source": "master-skills",
        },
        "temperature": CATEGORY_TEMPERATURES.get(cat, 0.5),
        "top_p": 1.0,
        "max_output_tokens": 4096,
    }, indent=2, ensure_ascii=False)


def build_copilot_instruction(skill: Dict) -> str:
    """Build Copilot custom-instructions markdown for a skill."""
    cat = skill["category"]
    pattern = COPILOT_PATTERNS.get(cat, "**/*")
    return f"""# {skill['name']}

## Overview
{skill['description']}

## Workspace Context
When working with this skill in a codebase:
- Reference relevant files using @workspace
- Use #file:path syntax to include specific file context
- Consider the project's existing patterns and conventions

## Instructions
{skill['body']}

## File Patterns
Applies to: `{pattern}`

## Integration Notes
- Use `@workspace` to reference project structure
- Use `@terminal` for command execution context
- Combine with other instructions in `.github/copilot-instructions.md`
"""


def build_copilot_agent_skill(skill: Dict) -> str:
    """Build Copilot agent-skills SKILL.md format."""
    desc_safe = skill['description'].replace('"', '\\"')
    return f"""---
name: {skill['name']}
description: "{desc_safe}"
---

{skill['body']}
"""


def build_frontier_skill(skill: Dict) -> str:
    """Build a Copilot Frontier skill (autonomous coding agent format)."""
    desc_safe = skill['description'].replace('"', '\\"')
    return f"""---
name: {skill['name']}
description: "{desc_safe}"
mode: agent
---

# {skill['name']}

> {skill['description']}

## Agent Instructions

When operating autonomously on this task:
1. Read and understand the existing codebase before making changes
2. Break complex tasks into discrete, verifiable steps
3. Test your changes at each step before proceeding
4. Use the terminal to verify builds and test results
5. Commit logical units of work with clear messages

## Core Instructions

{skill['body']}

## Verification Checklist
- [ ] Changes follow existing project conventions
- [ ] All modified files have been saved
- [ ] Tests pass (if applicable)
- [ ] No regressions introduced
"""


def build_gemini_agent_md(skill: Dict) -> str:
    """Build full GEMINI.md for Gemini Agents (replacing stubs)."""
    desc_safe = skill['description'].replace('"', '\\"')
    return f"""---
name: {skill['name']}
description: "{desc_safe}"
platform: gemini-cli
---

# {skill['name']}

> {skill['description']}

## Instructions

{skill['body']}

## Gemini Agent Notes
- Use `@` to reference files in the current workspace for context
- Leverage Google Search grounding for up-to-date information when relevant
- For code tasks, Gemini can execute code directly - ask it to run and verify
"""


def build_gemini_agent_config(skill: Dict) -> str:
    """Build gemini.config.json for Gemini Agents."""
    cat = skill["category"]
    model = select_model_gemini(skill["line_count"])
    tools = GEMINI_AGENT_TOOLS.get(cat, [])
    return json.dumps({
        "name": skill["name"],
        "version": "1.0.0",
        "model": model,
        "instructions": "./GEMINI.md",
        "tools": tools,
    }, indent=2, ensure_ascii=False)


def build_claude_desktop_skill(skill: Dict) -> str:
    """Build SKILL.md for Claude Desktop plugin format."""
    desc_safe = skill['description'].replace('"', '\\"')
    return f"""---
name: {skill['name']}
description: "{desc_safe}"
---

{skill['body']}
"""


def build_claude_web_project(skill: Dict) -> str:
    """Build project-instructions.md for Claude Web."""
    return f"""# {skill['name']}

{skill['description']}

## Instructions

{skill['body']}
"""


# ---------------------------------------------------------------------------
# Phase 1: Bundle Population
# ---------------------------------------------------------------------------

def populate_bundles(skills: List[Dict], dry_run: bool = False) -> Dict[str, int]:
    """Populate all 33 bundle directories."""
    counts = {}

    # Index skills by category
    by_category: Dict[str, List[Dict]] = {cat: [] for cat in CATEGORIES}
    for s in skills:
        cat = s["category"]
        if cat in by_category:
            by_category[cat].append(s)

    # Rank all skills by score
    all_ranked = sorted(skills, key=score_skill, reverse=True)

    # ── Gemini by-category bundles ──
    for cat in CATEGORIES:
        target = GEMINI_BUNDLES / "by-category" / cat
        count = 0
        for s in by_category[cat]:
            out = target / f"{s['slug']}.gem.json"
            if not dry_run:
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_text(build_gem_json(s), encoding='utf-8')
            count += 1
        counts[f"gemini/by-category/{cat}"] = count

    # ── Codex by-category bundles ──
    for cat in CATEGORIES:
        target = CODEX_BUNDLES / "by-category" / cat
        count = 0
        for s in by_category[cat]:
            out = target / f"{s['slug']}.response.json"
            if not dry_run:
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_text(build_codex_response_json(s), encoding='utf-8')
            count += 1
        counts[f"codex/by-category/{cat}"] = count

    # ── Copilot by-category bundles ──
    for cat in CATEGORIES:
        target = COPILOT_BUNDLES / "by-category" / cat
        count = 0
        for s in by_category[cat]:
            out = target / f"{s['slug']}.md"
            if not dry_run:
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_text(build_copilot_instruction(s), encoding='utf-8')
            count += 1
        counts[f"copilot/by-category/{cat}"] = count

    # ── Gemini named bundles ──

    # gems-full: All 508 as Gem JSONs
    target = GEMINI_BUNDLES / "gems-full"
    count = 0
    for s in skills:
        out = target / s["category"] / f"{s['slug']}.gem.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_gem_json(s), encoding='utf-8')
        count += 1
    counts["gemini/gems-full"] = count

    # studio-essential-30: Top 30 across all categories
    target = GEMINI_BUNDLES / "studio-essential-30"
    for i, s in enumerate(all_ranked[:30]):
        out = target / f"{s['slug']}.gem.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_gem_json(s), encoding='utf-8')
    counts["gemini/studio-essential-30"] = min(30, len(all_ranked))

    # studio-creative-15: Top 15 creative + design skills
    creative_ranked = sorted(by_category.get("creative", []), key=score_skill, reverse=True)
    target = GEMINI_BUNDLES / "studio-creative-15"
    for s in creative_ranked[:15]:
        out = target / f"{s['slug']}.gem.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_gem_json(s), encoding='utf-8')
    counts["gemini/studio-creative-15"] = min(15, len(creative_ranked))

    # vertex-enterprise: Enterprise/operations/compliance skills
    enterprise_skills = sorted(
        by_category.get("operations", []) + by_category.get("industry", []) +
        [s for s in by_category.get("strategy", []) if any(kw in s["name"].lower() for kw in ["enterprise", "compliance", "governance", "risk", "audit"])],
        key=score_skill, reverse=True
    )
    target = GEMINI_BUNDLES / "vertex-enterprise"
    for s in enterprise_skills:
        out = target / f"{s['slug']}.gem.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_gem_json(s), encoding='utf-8')
    counts["gemini/vertex-enterprise"] = len(enterprise_skills)

    # agent-chains-20: Top 20 ai-agents skills
    agents_ranked = sorted(by_category.get("ai-agents", []), key=score_skill, reverse=True)
    target = GEMINI_BUNDLES / "agent-chains-20"
    for s in agents_ranked[:20]:
        out = target / f"{s['slug']}.gem.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_gem_json(s), encoding='utf-8')
    counts["gemini/agent-chains-20"] = min(20, len(agents_ranked))

    # idx-workspace: Top 20 technical/dev skills
    tech_ranked = sorted(by_category.get("technical", []), key=score_skill, reverse=True)
    target = GEMINI_BUNDLES / "idx-workspace"
    for s in tech_ranked[:20]:
        out = target / f"{s['slug']}.gem.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_gem_json(s), encoding='utf-8')
    counts["gemini/idx-workspace"] = min(20, len(tech_ranked))

    # ── Codex named bundles ──

    # responses-api-full: All 508 in Responses API format
    target = CODEX_BUNDLES / "responses-api-full"
    count = 0
    for s in skills:
        out = target / s["category"] / f"{s['slug']}.response.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_codex_response_json(s), encoding='utf-8')
        count += 1
    counts["codex/responses-api-full"] = count

    # gpt-builder-50: Top 50 as GPT configs
    target = CODEX_BUNDLES / "gpt-builder-50"
    for s in all_ranked[:50]:
        clean_name = s["name"].replace("-", " ").title()
        gpt = {
            "name": clean_name,
            "description": s["description"],
            "instructions": s["body"],
            "conversation_starters": [
                f"Help me with {clean_name.lower()}",
                f"Explain how to use {clean_name.lower()}",
                f"What are best practices for {clean_name.lower()}?",
                f"Review my {clean_name.lower()} setup",
            ],
            "capabilities": {
                "web_browsing": s["category"] in ("strategy", "industry", "ai-agents"),
                "code_interpreter": True,
                "image_generation": s["category"] == "creative",
                "file_upload": True,
            },
            "category": s["category"],
        }
        out = target / f"{s['slug']}.gpt.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(gpt, indent=2, ensure_ascii=False), encoding='utf-8')
    counts["codex/gpt-builder-50"] = min(50, len(all_ranked))

    # agent-builder-20: Top 20 agent skills with tool definitions
    target = CODEX_BUNDLES / "agent-builder-20"
    for s in agents_ranked[:20]:
        cat = s["category"]
        agent = {
            "name": f"{s['name'].replace('-', ' ').title()} Agent",
            "description": s["description"],
            "instructions": s["body"],
            "model": CODEX_MODELS.get(cat, "gpt-4.1"),
            "tools": CODEX_TOOLS.get(cat, [{"type": "code_interpreter"}]),
            "handoff_description": s["description"][:200],
            "metadata": {"category": cat, "version": "1.0.0"},
        }
        out = target / f"{s['slug']}.agent.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(agent, indent=2, ensure_ascii=False), encoding='utf-8')
    counts["codex/agent-builder-20"] = min(20, len(agents_ranked))

    # enterprise-assistants: Enterprise/compliance/operations
    target = CODEX_BUNDLES / "enterprise-assistants"
    for s in enterprise_skills:
        out = target / f"{s['slug']}.response.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_codex_response_json(s), encoding='utf-8')
    counts["codex/enterprise-assistants"] = len(enterprise_skills)

    # ── Copilot named bundles ──

    # workspace-essential-30: Top 30 general-purpose instructions
    target = COPILOT_BUNDLES / "workspace-essential-30"
    for s in all_ranked[:30]:
        out = target / f"{s['slug']}.md"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_copilot_instruction(s), encoding='utf-8')
    counts["copilot/workspace-essential-30"] = min(30, len(all_ranked))

    # workspace-by-stack: 8 tech-stack-specific bundles
    stacks = {
        "react-typescript": ["react", "typescript", "nextjs", "next.js", "frontend"],
        "python-data": ["python", "data", "pandas", "numpy", "ml", "machine-learning"],
        "node-express": ["node", "express", "api", "rest", "backend"],
        "devops-cloud": ["docker", "kubernetes", "terraform", "aws", "azure", "ci", "cd", "devops"],
        "mobile-dev": ["mobile", "react-native", "flutter", "ios", "android", "swift"],
        "database": ["database", "sql", "postgres", "mongo", "redis", "schema"],
        "security": ["security", "auth", "encryption", "vulnerability", "owasp", "access"],
        "testing-qa": ["test", "qa", "quality", "jest", "pytest", "cypress", "selenium"],
    }
    target = COPILOT_BUNDLES / "workspace-by-stack"
    total_stack = 0
    for stack_name, keywords in stacks.items():
        stack_skills = [s for s in skills if any(kw in s["name"].lower() or kw in s["description"].lower() for kw in keywords)]
        stack_skills = sorted(stack_skills, key=score_skill, reverse=True)[:10]
        stack_dir = target / stack_name
        for s in stack_skills:
            out = stack_dir / f"{s['slug']}.md"
            if not dry_run:
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_text(build_copilot_instruction(s), encoding='utf-8')
            total_stack += 1
    counts["copilot/workspace-by-stack"] = total_stack

    # chat-participants-20: Top 20 as chat participant configs
    target = COPILOT_BUNDLES / "chat-participants-20"
    for s in all_ranked[:20]:
        participant = {
            "name": s["slug"],
            "fullName": s["name"].replace("-", " ").title(),
            "description": s["description"],
            "instructions": s["body"],
            "category": s["category"],
        }
        out = target / f"{s['slug']}.json"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(participant, indent=2, ensure_ascii=False), encoding='utf-8')
    counts["copilot/chat-participants-20"] = min(20, len(all_ranked))

    # agent-skills-50: Top 50 in Agent Skills SKILL.md format
    target = COPILOT_BUNDLES / "agent-skills-50"
    for s in all_ranked[:50]:
        out = target / s["slug"] / "SKILL.md"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_copilot_agent_skill(s), encoding='utf-8')
    counts["copilot/agent-skills-50"] = min(50, len(all_ranked))

    # coding-agent-20: Top 20 for autonomous coding agent
    frontier_candidates = [s for s in skills if is_frontier_skill(s)]
    frontier_ranked = sorted(frontier_candidates, key=score_skill, reverse=True)
    target = COPILOT_BUNDLES / "coding-agent-20"
    for s in frontier_ranked[:20]:
        out = target / s["slug"] / "SKILL.md"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_frontier_skill(s), encoding='utf-8')
    counts["copilot/coding-agent-20"] = min(20, len(frontier_ranked))

    return counts


# ---------------------------------------------------------------------------
# Phase 2: Thin Variant Fixes
# ---------------------------------------------------------------------------

def populate_copilot_frontier(skills: List[Dict], dry_run: bool = False) -> int:
    """Populate Copilot Frontier with all skills in agent mode."""
    count = 0
    target = COPILOT_FRONTIER / "skills"
    for s in skills:
        out = target / s["slug"] / "SKILL.md"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_frontier_skill(s), encoding='utf-8')
        count += 1
    return count


def upgrade_gemini_agents(skills: List[Dict], dry_run: bool = False) -> Tuple[int, int]:
    """Upgrade existing 257 Gemini agent stubs and create remaining agents."""
    upgraded = 0
    created = 0
    {s["slug"]: s for s in skills}

    # Process all skills - both upgrade existing and create new
    for s in skills:
        agent_dir = GEMINI_AGENTS / s["slug"]
        gemini_md = agent_dir / "GEMINI.md"
        config_json = agent_dir / "gemini.config.json"

        is_existing = agent_dir.exists()

        if not dry_run:
            agent_dir.mkdir(parents=True, exist_ok=True)
            gemini_md.write_text(build_gemini_agent_md(s), encoding='utf-8')
            config_json.write_text(build_gemini_agent_config(s), encoding='utf-8')

        if is_existing:
            upgraded += 1
        else:
            created += 1

    return upgraded, created


def build_studio_prompt_md(skill: Dict) -> str:
    """Build a Gemini Studio prompt GEMINI.md with full skill content."""
    return f"""---
name: {skill['name']}
description: {skill['description']}
platform: gemini-studio
model: gemini-2.5-flash
temperature: {CATEGORY_TEMPERATURES.get(skill['category'], 0.5)}
---

{skill['body']}
"""


def build_studio_prompt_json(skill: Dict) -> str:
    """Build a Gemini Studio prompt config JSON."""
    return json.dumps({
        "name": skill["name"],
        "description": skill["description"],
        "model": "gemini-2.5-flash",
        "temperature": CATEGORY_TEMPERATURES.get(skill["category"], 0.5),
        "category": skill["category"],
        "safetySettings": GEMINI_SAFETY_SETTINGS,
        "version": skill.get("version", "1.0.0"),
    }, indent=2, ensure_ascii=False)


def populate_gemini_studio(skills: List[Dict], dry_run: bool = False) -> int:
    """Populate Gemini Studio with all skills as prompt pairs (GEMINI.md + config.json)."""
    count = 0
    studio_root = BASE_DIR / "platforms" / "gemini" / "gemini-skills-studio" / "prompts"

    for s in skills:
        prompt_dir = studio_root / s["slug"]
        gemini_md = prompt_dir / "GEMINI.md"
        config_json = prompt_dir / f"{s['slug']}.json"

        if not dry_run:
            prompt_dir.mkdir(parents=True, exist_ok=True)
            gemini_md.write_text(build_studio_prompt_md(s), encoding='utf-8')
            config_json.write_text(build_studio_prompt_json(s), encoding='utf-8')
        count += 1

    return count


def populate_claude_desktop(skills: List[Dict], dry_run: bool = False) -> int:
    """Populate Claude Desktop with all skills in plugin format."""
    count = 0
    plugin_root = CLAUDE_DESKTOP / ".claude-plugin" / "skills"

    # Create root-level plugin.json for Claude Desktop plugin discovery
    root_plugin_json = CLAUDE_DESKTOP / "plugin.json"
    if not dry_run:
        root_plugin_json.parent.mkdir(parents=True, exist_ok=True)
        root_plugin_json.write_text(json.dumps({
            "name": "skills-library",
            "description": "508 AI skills across 6 categories for Claude Desktop",
            "version": "1.0.0",
            "skills_dir": ".claude-plugin/skills"
        }, indent=2, ensure_ascii=False), encoding='utf-8')

    for s in skills:
        skill_dir = plugin_root / s["slug"]
        skill_md_path = skill_dir / "SKILL.md"

        if not dry_run:
            skill_md_path.parent.mkdir(parents=True, exist_ok=True)
            skill_md_path.write_text(build_claude_desktop_skill(s), encoding='utf-8')
        count += 1

    return count


def populate_claude_web(skills: List[Dict], dry_run: bool = False) -> int:
    """Populate Claude Web with all skills as project instructions."""
    count = 0
    projects_root = CLAUDE_WEB / "projects"

    for s in skills:
        out = projects_root / s["slug"] / "project-instructions.md"
        if not dry_run:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(build_claude_web_project(s), encoding='utf-8')
        count += 1

    return count


# ---------------------------------------------------------------------------
# Phase 3: Quality Fixes
# ---------------------------------------------------------------------------

def fix_frontmatter(dry_run: bool = False) -> int:
    """Fix skills with missing frontmatter delimiters."""
    fixed = 0
    for cat in CATEGORIES:
        cat_dir = MASTER_DIR / cat
        if not cat_dir.is_dir():
            continue
        for skill_dir in sorted(cat_dir.iterdir()):
            if not skill_dir.is_dir():
                continue
            skill_md = skill_dir / "SKILL.md"
            if not skill_md.is_file():
                continue

            try:
                content = skill_md.read_text(encoding='utf-8', errors='replace')
            except Exception:
                continue

            # Check if missing frontmatter delimiters
            if not content.startswith('---'):
                # Try to find name-like content at top
                lines = content.splitlines()
                name = skill_dir.name
                description = f"Skill for {name}"

                # Check if first line looks like a header
                body = content
                if lines and lines[0].startswith('# '):
                    # First line is a heading - use it as context
                    pass

                # Add frontmatter
                new_content = f'---\nname: {name}\ndescription: "{description}"\n---\n\n{body}'
                if not dry_run:
                    skill_md.write_text(new_content, encoding='utf-8')
                fixed += 1
                print(f"  Fixed frontmatter: {cat}/{skill_dir.name}")

    return fixed


# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

def cleanup(dry_run: bool = False) -> Dict[str, int]:
    """Remove deprecated files and junk skills."""
    results = {}

    # Delete deprecated convert_to_gems.js
    deprecated_js = BASE_DIR / "scripts" / "convert-to-gems.js"
    if deprecated_js.exists():
        if not dry_run:
            deprecated_js.unlink()
        results["deleted_convert_to_gems.js"] = 1
        print(f"  {'[DRY] ' if dry_run else ''}Deleted convert_to_gems.js")
    else:
        results["deleted_convert_to_gems.js"] = 0

    # Remove junk skills from master
    from lib.config import JUNK_SLUGS
    junk_names = JUNK_SLUGS | {"untitled", "test-skill", "example-skill"}
    removed = 0
    for cat in CATEGORIES:
        cat_dir = MASTER_DIR / cat
        if not cat_dir.is_dir():
            continue
        for skill_dir in sorted(cat_dir.iterdir()):
            if not skill_dir.is_dir():
                continue
            if skill_dir.name.lower() in junk_names:
                if not dry_run:
                    shutil.rmtree(skill_dir)
                removed += 1
                print(f"  {'[DRY] ' if dry_run else ''}Removed junk skill: {cat}/{skill_dir.name}")
    results["removed_junk_skills"] = removed

    # Remove junk outputs from Gemini gems
    gems_dir = BASE_DIR / "platforms" / "gemini" / "gemini-skills" / "gems"
    removed_outputs = 0
    if gems_dir.is_dir():
        for cat_dir in gems_dir.iterdir():
            if not cat_dir.is_dir():
                continue
            for gem_file in cat_dir.iterdir():
                stem = gem_file.stem.replace(".gem", "")
                if stem.lower() in junk_names:
                    if not dry_run:
                        gem_file.unlink()
                    removed_outputs += 1
                    print(f"  {'[DRY] ' if dry_run else ''}Removed junk gem: {gem_file.name}")

    # Remove junk outputs from Codex
    for subdir_name in ("responses", "gpts", "agents", "system-prompts"):
        codex_subdir = BASE_DIR / "platforms" / "codex" / "codex-skills" / subdir_name
        if not codex_subdir.is_dir():
            continue
        for cat_dir in codex_subdir.iterdir():
            if not cat_dir.is_dir():
                continue
            for f in cat_dir.iterdir():
                stem = f.stem.replace(".response", "").replace(".gpt", "").replace(".agent", "").replace(".assistant", "")
                if stem.lower() in junk_names:
                    if not dry_run:
                        f.unlink()
                    removed_outputs += 1
                    print(f"  {'[DRY] ' if dry_run else ''}Removed junk codex: {f.name}")

    # Remove junk outputs from CLI skill directories
    for platform_dir in PLATFORM_OUTPUTS.values():
        skills_dir = platform_dir / "skills"
        if not skills_dir.is_dir():
            continue
        for skill_dir in skills_dir.iterdir():
            if skill_dir.is_dir() and skill_dir.name.lower() in junk_names:
                if not dry_run:
                    shutil.rmtree(skill_dir)
                removed_outputs += 1
                print(f"  {'[DRY] ' if dry_run else ''}Removed junk CLI skill: {skill_dir}")

    results["removed_junk_outputs"] = removed_outputs

    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Populate all Skills Library targets")
    parser.add_argument("--phase", default="all",
                        choices=["all", "bundles", "variants", "quality", "cleanup"],
                        help="Which phase to run (default: all)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview without writing files")
    args = parser.parse_args()

    print("=" * 70)
    print("  Skills Library - Full Population Script")
    print("=" * 70)
    print(f"  Phase    : {args.phase}")
    print(f"  Master   : {MASTER_DIR}")
    print(f"  Dry run  : {args.dry_run}")
    print("=" * 70)
    print()

    # Discover all skills
    print("Discovering master skills...")
    skills = discover_all_skills()
    print(f"  Found {len(skills)} skills across {len(CATEGORIES)} categories")
    by_cat = {}
    for s in skills:
        by_cat.setdefault(s["category"], []).append(s)
    for cat in CATEGORIES:
        print(f"    {cat}: {len(by_cat.get(cat, []))}")
    print()

    run_all = args.phase == "all"

    # ── Phase 3: Quality (run FIRST) ──
    if run_all or args.phase == "quality":
        print("=" * 70)
        print("  PHASE 3: Quality Fixes")
        print("=" * 70)

        print("\n  Fixing missing frontmatter...")
        fixed = fix_frontmatter(dry_run=args.dry_run)
        print(f"  Fixed {fixed} skills with missing frontmatter")
        print()

        # Re-discover skills after quality fixes
        if run_all:
            print("Re-discovering skills after quality fixes...")
            skills = discover_all_skills()
            print(f"  Re-scanned {len(skills)} skills")
            print()

    # ── Phase 1: Bundles ──
    if run_all or args.phase == "bundles":
        print("=" * 70)
        print("  PHASE 1: Bundle Population")
        print("=" * 70)
        counts = populate_bundles(skills, dry_run=args.dry_run)
        total = sum(counts.values())
        print(f"\n  Bundle results ({total} total files):")
        for key in sorted(counts.keys()):
            print(f"    {key}: {counts[key]} files")
        print()

    # ── Phase 2: Thin Variants ──
    if run_all or args.phase == "variants":
        print("=" * 70)
        print("  PHASE 2: Thin Variant Population")
        print("=" * 70)

        # 2A: Copilot Frontier
        print("\n  [2A] Copilot Frontier...")
        frontier_count = populate_copilot_frontier(skills, dry_run=args.dry_run)
        print(f"    Populated {frontier_count} Frontier skills")

        # 2B: Gemini Agents
        print("\n  [2B] Gemini Agents...")
        upgraded, created = upgrade_gemini_agents(skills, dry_run=args.dry_run)
        print(f"    Upgraded {upgraded} existing agents, created {created} new agents")

        # 2C: Claude Desktop
        print("\n  [2C] Claude Desktop...")
        desktop_count = populate_claude_desktop(skills, dry_run=args.dry_run)
        print(f"    Populated {desktop_count} Desktop skills")

        # 2D: Claude Web
        print("\n  [2D] Claude Web...")
        web_count = populate_claude_web(skills, dry_run=args.dry_run)
        print(f"    Populated {web_count} Web project instructions")

        # 2E: Gemini Studio
        print("\n  [2E] Gemini Studio...")
        studio_count = populate_gemini_studio(skills, dry_run=args.dry_run)
        print(f"    Populated {studio_count} Studio prompts")

        print()

    # ── Cleanup ──
    if run_all or args.phase == "cleanup":
        print("=" * 70)
        print("  CLEANUP")
        print("=" * 70)
        results = cleanup(dry_run=args.dry_run)
        for key, val in results.items():
            print(f"  {key}: {val}")
        print()

    # ── Final Summary ──
    print("=" * 70)
    print("  COMPLETE" + (" (DRY RUN)" if args.dry_run else ""))
    print("=" * 70)
    print()


if __name__ == "__main__":
    main()
