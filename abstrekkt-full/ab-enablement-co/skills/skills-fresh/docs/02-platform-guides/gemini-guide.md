# Gemini Platform Guide

This guide covers all four Gemini skill variants: the Gem JSON library, CLI skills, AI Studio prompts, and multi-step Agents. Gemini's format is the most structured in the Skills Library, with JSON configuration files that specify model, temperature, safety settings, and grounding behavior alongside each skill's instructions.

## Variants at a Glance

| Variant | Files | Path Pattern | Use Case |
|---------|-------|--------------|----------|
| GeminiSkills | 525 | `gems/{category}/{slug}.json` | Google AI Gems |
| GeminiSkills-CLI | 507 | `skills/{slug}/SKILL.md` | Gemini CLI (`~/.gemini/`) |
| GeminiSkills-Studio | 258 pairs | `prompts/{slug}/` (.md + .json) | Google AI Studio imports |
| GeminiSkills-Agents | 508 pairs | `.gemini/agents/{slug}/` (GEMINI.md + .json) | Multi-step Gemini agents |

---

## 1. GeminiSkills (Gem JSON Library)

The primary Gemini format -- 525 JSON files organized by category, each representing a fully configured Google AI Gem.

### Directory Structure

```
Gemini/GeminiSkills/
  gems/
    ai-agents/           # 232 gems
      access-management.json
      accountability-buddy.json
      ...
    technical/           # 127 gems
    strategy/            # 59 gems
    creative/            # 40 gems
    operations/          # 24 gems
    industry/            # 25 gems
  super-gems/            # 50 specialized gems
    agent-chains/
    interactive-apps/
    multi-step-workflows/
  idx-workspaces/        # 6 Project IDX configs
  ai-studio/             # 1 AI Studio master config
  vertex-ai/             # 1 Vertex AI enterprise config
  bundles/               # 7 curated bundles
    gems-full/           # 508 (all standard gems)
    by-category/         # 508 (organized by category)
    vertex-enterprise/   # 53
    studio-essential-30/ # 30
    agent-chains-20/     # 20
    idx-workspace/       # 20
    studio-creative-15/  # 15
```

The 525 count (vs. 508 master skills) includes extra gems generated for super-gems, IDX workspaces, and other specialized contexts.

### Gem JSON Structure

Each `.json` file contains a complete Gem configuration:

```json
{
  "name": "access-management",
  "description": "Comprehensive identity and access management implementation and governance for enterprise systems.",
  "model": "gemini-2.5-pro-preview",
  "temperature": 0.4,
  "safety_settings": [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ],
  "grounding": {
    "enabled": true,
    "source": "google_search"
  },
  "system_instruction": "You are a specialist in identity and access management...\n\n## Overview\n...\n\n## Core Processes\n..."
}
```

### JSON Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill slug identifier |
| `description` | string | One-sentence description |
| `model` | string | Gemini model ID |
| `temperature` | number | Sampling temperature (0.0--1.0) |
| `safety_settings` | array | Array of safety category/threshold pairs |
| `grounding` | object | Grounding configuration (Google Search, etc.) |
| `system_instruction` | string | Full skill body as the Gem's system prompt |

### Model Selection by Complexity

The `convert_to_gems.py` pipeline assigns models based on skill complexity:

| Complexity | Model | Typical Use |
|------------|-------|-------------|
| simple | gemini-2.0-flash | Quick tasks, lookups, simple generation |
| moderate | gemini-2.0-pro | Multi-step analysis, moderate reasoning |
| complex | gemini-2.5-pro-preview | Deep analysis, architecture design, complex workflows |

### Temperature by Category

Temperature values are tuned per category to balance creativity and precision:

| Category | Temperature | Rationale |
|----------|-------------|-----------|
| creative | 0.8--0.9 | Higher creativity for writing, design, brainstorming |
| strategy | 0.5--0.6 | Balanced for planning and decision-making |
| technical | 0.3--0.5 | Lower variance for code, infrastructure, security |
| ai-agents | 0.4--0.5 | Moderate for agent design and orchestration |
| operations | 0.3--0.4 | Precision for process optimization |
| industry | 0.4--0.5 | Domain-specific accuracy |

### Safety Settings

All gems include the four standard Gemini safety categories with `BLOCK_MEDIUM_AND_ABOVE` thresholds by default. You can adjust these per your use case:

| Threshold | Behavior |
|-----------|----------|
| `BLOCK_NONE` | No blocking (use with caution) |
| `BLOCK_LOW_AND_ABOVE` | Block low-confidence and above |
| `BLOCK_MEDIUM_AND_ABOVE` | Default -- blocks medium-confidence harmful content |
| `BLOCK_HIGH_AND_ABOVE` | Only block high-confidence harmful content |

### Grounding

Most gems have grounding enabled with Google Search as the source. This lets the Gem access current information when answering questions. To disable grounding:

```json
{
  "grounding": {
    "enabled": false
  }
}
```

### Importing a Gem

**Via Google AI Studio (manual):**

1. Open [Google AI Studio](https://aistudio.google.com/).
2. Click "Create" and select "New Gem".
3. Copy the `name` and `description` fields into the Gem name and description.
4. Paste the `system_instruction` content into the system prompt area.
5. Set the model, temperature, and safety settings to match the JSON.
6. Save the Gem.

**Via Gemini API (programmatic):**

```python
import google.generativeai as genai
import json

genai.configure(api_key="YOUR_API_KEY")

# Load gem configuration
with open("gems/ai-agents/access-management.json") as f:
    gem = json.load(f)

# Create a model instance with the gem's configuration
model = genai.GenerativeModel(
    model_name=gem["model"],
    system_instruction=gem["system_instruction"],
    generation_config=genai.GenerationConfig(
        temperature=gem["temperature"]
    ),
    safety_settings={
        s["category"]: s["threshold"]
        for s in gem["safety_settings"]
    }
)

# Start a conversation
chat = model.start_chat()
response = chat.send_message("Design an IAM architecture for a SaaS platform.")
print(response.text)
```

### Super-Gems

The `super-gems/` directory contains 50 advanced gems organized into three categories:

| Sub-directory | Count | Description |
|---------------|-------|-------------|
| `agent-chains/` | ~17 | Multi-agent orchestration patterns |
| `interactive-apps/` | ~17 | Interactive application templates |
| `multi-step-workflows/` | ~16 | Complex multi-phase workflows |

Super-gems differ from standard gems in that they include multi-turn conversation scaffolding and may reference other gems as sub-agents.

### Bundles

Bundles are curated subsets for specific deployment scenarios:

| Bundle | Count | Use Case |
|--------|-------|----------|
| `gems-full` | 508 | Complete standard library |
| `by-category` | 508 | Same skills, organized by category folders |
| `vertex-enterprise` | 53 | Enterprise-focused skills for Vertex AI |
| `studio-essential-30` | 30 | Most commonly used skills for AI Studio |
| `agent-chains-20` | 20 | Agent orchestration patterns |
| `idx-workspace` | 20 | Skills for Google Project IDX |
| `studio-creative-15` | 15 | Creative writing and design skills |

---

## 2. GeminiSkills-CLI

Skills formatted for the Gemini CLI, deployed to `~/.gemini/`.

### Directory Structure

```
Gemini/GeminiSkills-CLI/
  skills/
    access-management/
      SKILL.md
    accountability-buddy/
      SKILL.md
    ...                    # 507 skills (flat, no category subdirs)
  .gemini/
    skills/                # 514 skills (alternate deployment path)
```

### File Format

CLI skills use the standard YAML frontmatter + Markdown body format:

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management..."
platform: gemini-cli
---

## Overview
...

## Core Processes
...
```

### Deployment

**Linux / macOS:**

```bash
# Copy all skills to Gemini CLI directory
mkdir -p ~/.gemini/skills
cp -r Gemini/GeminiSkills-CLI/skills/* ~/.gemini/skills/

# Or use the pre-organized .gemini directory
cp -r Gemini/GeminiSkills-CLI/.gemini/* ~/.gemini/
```

**Windows (PowerShell):**

```powershell
# Create directory if needed
New-Item -ItemType Directory -Force "$env:USERPROFILE\.gemini\skills"

# Copy all skills
Copy-Item -Recurse Gemini\GeminiSkills-CLI\skills\* "$env:USERPROFILE\.gemini\skills\"
```

### Usage

```bash
# List available skills
gemini skills list

# Use a specific skill
gemini --skill access-management "Design an IAM architecture"
```

---

## 3. GeminiSkills-Studio

258 skill pairs formatted for import into Google AI Studio as saved prompts.

### Directory Structure

```
Gemini/GeminiSkills-Studio/
  prompts/
    access-management/
      prompt.md              # Human-readable prompt content
      config.json            # AI Studio import configuration
    api-design/
      prompt.md
      config.json
    ...                      # 258 pairs (subset of full library)
```

### File Formats

**prompt.md** -- the prompt text in Markdown:

```markdown
# Access Management

You are a specialist in identity and access management...

## Instructions

When the user requests help with access management:
1. Assess the current IAM landscape
2. Identify security gaps
3. Recommend solutions
...
```

**config.json** -- AI Studio metadata:

```json
{
  "name": "access-management",
  "description": "Comprehensive identity and access management...",
  "model": "gemini-2.5-pro-preview",
  "temperature": 0.4,
  "topP": 0.95,
  "topK": 40,
  "maxOutputTokens": 8192,
  "systemInstruction": true
}
```

### Importing to AI Studio

1. Open [Google AI Studio](https://aistudio.google.com/).
2. Click "New Prompt" and select "Freeform" or "Chat".
3. Toggle "System instructions" on.
4. Paste the contents of `prompt.md` into the system instructions area.
5. Set the model and parameters from `config.json`.
6. Save the prompt for reuse.

### Why Only 258?

The Studio variant includes skills most suitable for interactive prompting. Skills that are primarily agent-oriented or require multi-tool orchestration are better served by the Agents variant (Section 4) and are excluded from Studio.

---

## 4. GeminiSkills-Agents

508 skill pairs configured as multi-step Gemini agents with both instructions and runtime configuration.

### Directory Structure

```
Gemini/GeminiSkills-Agents/
  .gemini/
    agents/
      access-management/
        GEMINI.md               # Agent instructions
        gemini.config.json      # Agent runtime configuration
      accountability-buddy/
        GEMINI.md
        gemini.config.json
      ...                       # 508 pairs
```

### File Formats

**GEMINI.md** -- agent instructions in Markdown:

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management..."
platform: gemini-agents
version: "1.0.0"
---

# Access Management Agent

## Overview
...

## When to Use
...

## Core Processes
...

## Tools & Templates
...
```

**gemini.config.json** -- agent runtime settings:

```json
{
  "name": "access-management",
  "model": "gemini-2.5-pro-preview",
  "temperature": 0.4,
  "maxOutputTokens": 16384,
  "tools": [
    {
      "type": "google_search",
      "enabled": true
    },
    {
      "type": "code_execution",
      "enabled": true
    }
  ],
  "safety": {
    "harassment": "BLOCK_MEDIUM_AND_ABOVE",
    "hate_speech": "BLOCK_MEDIUM_AND_ABOVE",
    "sexually_explicit": "BLOCK_MEDIUM_AND_ABOVE",
    "dangerous_content": "BLOCK_MEDIUM_AND_ABOVE"
  }
}
```

### Deployment

**As a local agent directory:**

```bash
# Copy agent configs to your project
cp -r Gemini/GeminiSkills-Agents/.gemini .gemini

# Or copy specific agents
mkdir -p .gemini/agents
cp -r Gemini/GeminiSkills-Agents/.gemini/agents/access-management .gemini/agents/
```

**Programmatic usage:**

```python
import google.generativeai as genai
import json

genai.configure(api_key="YOUR_API_KEY")

# Load agent config
with open(".gemini/agents/access-management/gemini.config.json") as f:
    config = json.load(f)

with open(".gemini/agents/access-management/GEMINI.md") as f:
    instructions = f.read()

# Create configured model
model = genai.GenerativeModel(
    model_name=config["model"],
    system_instruction=instructions,
    generation_config=genai.GenerationConfig(
        temperature=config["temperature"],
        max_output_tokens=config["maxOutputTokens"]
    ),
    tools=[
        genai.Tool(google_search=genai.GoogleSearch())
        if t["type"] == "google_search" and t["enabled"]
        else None
        for t in config.get("tools", [])
    ]
)
```

### Agents vs. Gems vs. Studio Prompts

| Feature | Gems (.json) | Studio (paired) | Agents (paired) |
|---------|-------------|-----------------|-----------------|
| Count | 525 | 258 | 508 |
| Config format | Single JSON | .md + config.json | GEMINI.md + gemini.config.json |
| System instruction | Embedded in JSON | Separate .md file | Separate GEMINI.md file |
| Tool support | Grounding only | Model params only | Google Search + Code Execution |
| Best for | API usage, quick import | AI Studio interactive | Multi-step agent workflows |
| Deployment | API / manual import | AI Studio UI | Local `.gemini/` directory |

---

## Vertex AI Integration

For enterprise deployments, the `vertex-ai/` directory and the `vertex-enterprise` bundle (53 skills) provide configurations tuned for Google Cloud Vertex AI.

### Authentication

```bash
# Authenticate with Google Cloud
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### Using Vertex AI SDK

```python
import vertexai
from vertexai.generative_models import GenerativeModel
import json

vertexai.init(project="your-project-id", location="us-central1")

# Load gem configuration
with open("gems/technical/api-design.json") as f:
    gem = json.load(f)

model = GenerativeModel(
    model_name=gem["model"],
    system_instruction=gem["system_instruction"],
    generation_config={
        "temperature": gem["temperature"],
        "max_output_tokens": 8192
    }
)

response = model.generate_content("Design a REST API for user management.")
print(response.text)
```

### Enterprise Bundle

The `vertex-enterprise` bundle contains 53 skills focused on enterprise scenarios:

- Security and compliance (access management, audit, governance)
- Infrastructure (cloud architecture, DevOps, monitoring)
- Data engineering (ETL, data quality, pipeline design)
- Project management (agile, resource planning, risk assessment)

---

## Project IDX Integration

The `idx-workspaces/` directory contains 6 workspace configurations for Google Project IDX, Google's cloud-based development environment.

```bash
# Copy IDX workspace configs
cp -r Gemini/GeminiSkills/idx-workspaces/* your-idx-workspace/
```

IDX workspace files include `.idx/dev.nix` configuration snippets that reference Gemini skills for in-IDE assistance.

---

## Pipeline: How Gems Are Generated

The `convert_to_gems.py` script (19KB) converts master SKILL.md files into Gem JSON:

```bash
# Run the Gemini converter
PYTHONIOENCODING=utf-8 python convert_to_gems.py
```

### Conversion Pipeline

1. **Read** master SKILL.md from `_master-skills/`
2. **Parse** YAML frontmatter and Markdown body
3. **Detect complexity** using `lib/platform_tuning.py`
4. **Assign model** (flash / pro / pro-preview) based on complexity
5. **Set temperature** based on category
6. **Configure safety** settings with default thresholds
7. **Enable grounding** for skills that benefit from web search
8. **Emit** JSON to `GeminiSkills/gems/{category}/{slug}.json`

### Customizing the Converter

Key settings in `convert_to_gems.py`:

```python
# Model mapping
GEMINI_MODELS = {
    "simple": "gemini-2.0-flash",
    "moderate": "gemini-2.0-pro",
    "complex": "gemini-2.5-pro-preview"
}

# Temperature ranges by category
TEMPERATURE_MAP = {
    "creative": 0.85,
    "strategy": 0.55,
    "technical": 0.4,
    "ai-agents": 0.45,
    "operations": 0.35,
    "industry": 0.45
}
```

---

## Choosing a Variant

| If you... | Use this variant |
|-----------|-----------------|
| Want to use Gemini API programmatically | GeminiSkills (Gem JSON) |
| Use Gemini CLI daily | GeminiSkills-CLI |
| Prefer Google AI Studio's visual interface | GeminiSkills-Studio |
| Build multi-step agent workflows | GeminiSkills-Agents |
| Deploy to Google Cloud Vertex AI | GeminiSkills + `vertex-enterprise` bundle |
| Need the richest metadata per skill | GeminiSkills-Agents (paired files) |
| Want the most compact format | GeminiSkills-CLI (single SKILL.md) |

---

## Troubleshooting

### Invalid JSON errors

If a gem JSON file fails to parse:

```bash
# Validate JSON syntax
python -m json.tool gems/ai-agents/access-management.json
```

Common causes: unescaped newlines in `system_instruction`, trailing commas, or encoding issues.

### Model not available

If you get a "model not found" error, check that your API key or Vertex AI project has access to the specified model. The `gemini-2.5-pro-preview` model may require allowlist access.

### Encoding issues on Windows

```powershell
# Set console to UTF-8 before running converters
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"
```

### Grounding not working

Grounding requires the Gemini API to have search enabled. In Vertex AI, ensure the "Grounding" feature is enabled in your project settings. In AI Studio, grounding is enabled by default for supported models.

### Duplicate gem names

Cross-category collisions (e.g., "analytics" in both `ai-agents` and `strategy`) are resolved by the pipeline using the `{category}--{slug}` dedup prefix in flat output directories. In the categorized `gems/` directory, the category folder prevents collisions.

---

## Related Guides

- [Claude Guide](claude-guide.md) -- Compare with Claude's Markdown-based format
- [Platform Comparison](platform-comparison.md) -- Side-by-side feature matrix
- [Universal Adapters](universal-adapters-guide.md) -- Convert between platforms
- [Getting Started](../01-getting-started/) -- Initial setup and orientation
