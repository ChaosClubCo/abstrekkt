# Deploying to Gemini

This guide covers deploying skills to all four Gemini output variants: Gems, CLI, Studio prompts, and Agents. Each variant targets a different part of the Gemini ecosystem.

---

## Overview of Gemini Variants

| Variant | Directory | Format | Use Case |
|---------|-----------|--------|----------|
| Gemini Gems | `GeminiSkills/gems/` | JSON (`.gem.json`) | Importable Gem configurations |
| Gemini CLI | `GeminiSkills-CLI/` | `.gemini/skills/GEMINI.md` | CLI skill files |
| Gemini Studio | `GeminiSkills-Studio/` | `prompts/{slug}/` (paired .md + .json) | AI Studio prompt library |
| Gemini Agents | `GeminiSkills-Agents/` | `.gemini/agents/{slug}/` (GEMINI.md + .json) | Multi-step agent configs |

Additional resources in `GeminiSkills/`:
- `super-gems/` -- 50 advanced Gem configurations (agent chains, interactive apps, multi-step workflows)
- `idx-workspaces/` -- 6 IDX workspace integration files
- `ai-studio/` -- 1 AI Studio configuration
- `vertex-ai/` -- 1 Vertex AI configuration
- `bundles/` -- 7 curated bundles (see [Choosing a Skill](./choosing-a-skill.md))

---

## Prerequisites

- The Skills Library repository cloned locally
- Google account with access to Gemini
- Gemini CLI installed (for CLI and Agents variants)
- Access to AI Studio (for Studio variant)
- Access to Vertex AI (for enterprise deployments)

---

## Gemini Gems

Gems are custom personas or instruction sets you can create in Gemini. The `GeminiSkills/gems/` directory contains JSON files ready for import.

### Directory Structure

```
GeminiSkills/
  gems/
    ai-agents/
      multi-agent-orchestrator.json
      tool-use-planner.json
      ...
    technical/
      code-review-checklist.json
      ...
    strategy/
      ...
    creative/
      ...
    operations/
      ...
    industry/
      ...
```

Each JSON file contains the Gem's configuration including:
- Display name and description
- System instructions (the skill content)
- Model selection (tuned per category)
- Temperature settings (tuned per skill type)
- Safety settings
- Grounding instructions

### Importing a Gem via Gemini App

1. Open [gemini.google.com](https://gemini.google.com).
2. Click "Gems" in the sidebar.
3. Click "Create Gem" or "New Gem".
4. Open the JSON file for the skill you want:
   ```bash
   cat GeminiSkills/gems/technical/code-review-checklist.json
   ```
5. Copy the `system_instruction` field value from the JSON into the Gem's instruction field.
6. Set the name and description from the JSON.
7. Save the Gem.

### Importing via API (Programmatic)

If you have API access, you can create Gems programmatically. The JSON files are structured for direct API consumption:

```python
import json
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

with open("GeminiSkills/gems/technical/code-review-checklist.json") as f:
    gem_config = json.load(f)

# Use the configuration with the Generative AI SDK
model = genai.GenerativeModel(
    model_name=gem_config.get("model", "gemini-pro"),
    system_instruction=gem_config["system_instruction"]
)
```

### Gem Configuration Details

The converter (`convert_to_gems.py`) applies intelligent defaults based on category:

| Category | Default Model | Temperature | Notes |
|----------|---------------|-------------|-------|
| ai-agents | gemini-pro | 0.3 | Lower temperature for precise agent behavior |
| technical | gemini-pro | 0.2 | Low temperature for code accuracy |
| strategy | gemini-pro | 0.5 | Moderate for analytical tasks |
| creative | gemini-pro | 0.8 | Higher for creative generation |
| operations | gemini-pro | 0.3 | Structured, repeatable outputs |
| industry | gemini-pro | 0.3 | Accuracy-focused for compliance |

---

## Gemini CLI

The Gemini CLI reads skill files from a `.gemini` directory in your home folder or project root.

### Global Installation

```bash
cp -r GeminiSkills-CLI/.gemini ~/.gemini
```

This makes all skills available in every Gemini CLI session.

### Project-Level Installation

To scope skills to a specific project:

```bash
# From your project root
cp -r GeminiSkills-CLI/.gemini .gemini
```

Project-level skills take precedence over global skills.

### Verifying

Start a new Gemini CLI session and the skills will be loaded automatically. Reference a skill by name in your prompt:

```
Use the code-review-checklist skill to review main.py
```

### Deploying Individual Skills

```bash
# Copy a single skill globally
mkdir -p ~/.gemini/skills
cp GeminiSkills-CLI/.gemini/skills/code-review-checklist/GEMINI.md \
   ~/.gemini/skills/code-review-checklist/GEMINI.md
```

---

## Gemini Studio (AI Studio)

Gemini Studio skills are formatted as prompt pairs: a markdown file containing the prompt content and a JSON file with metadata.

### Directory Structure

```
GeminiSkills-Studio/
  prompts/
    code-review-checklist/
      code-review-checklist.md      # Prompt content
      code-review-checklist.json    # Metadata (model, params)
    api-design-reviewer/
      api-design-reviewer.md
      api-design-reviewer.json
    ...
```

### Importing to AI Studio

1. Go to [aistudio.google.com](https://aistudio.google.com).
2. Click "Create new prompt".
3. Open the markdown file for your chosen skill:
   ```bash
   cat GeminiSkills-Studio/prompts/code-review-checklist/code-review-checklist.md
   ```
4. Paste the content into the system instruction field.
5. Open the JSON file for model settings:
   ```bash
   cat GeminiSkills-Studio/prompts/code-review-checklist/code-review-checklist.json
   ```
6. Apply the model, temperature, and other settings from the JSON.
7. Save the prompt.

### Batch Import

To import multiple prompts at once, use the AI Studio API or write a script that reads the JSON metadata files:

```python
import json
import os

prompts_dir = "GeminiSkills-Studio/prompts"
for slug in os.listdir(prompts_dir):
    json_path = os.path.join(prompts_dir, slug, f"{slug}.json")
    md_path = os.path.join(prompts_dir, slug, f"{slug}.md")
    if os.path.exists(json_path) and os.path.exists(md_path):
        with open(json_path) as f:
            config = json.load(f)
        with open(md_path) as f:
            prompt = f.read()
        # Use config and prompt with the AI Studio API
        print(f"Loaded: {slug} ({config.get('model', 'default')})")
```

---

## Gemini Agents

Gemini Agents are multi-step agent configurations that use the Gemini CLI's agent framework.

### Global Installation

```bash
cp -r GeminiSkills-Agents/.gemini/agents ~/.gemini/agents
```

### Directory Structure

Each agent has a paired GEMINI.md (instructions) and JSON (configuration):

```
GeminiSkills-Agents/
  .gemini/
    agents/
      multi-agent-orchestrator/
        GEMINI.md                    # Agent instructions
        multi-agent-orchestrator.json # Agent config
      code-review-checklist/
        GEMINI.md
        code-review-checklist.json
      ...
```

### Using Agents

After installation, agents are available in the Gemini CLI:

```bash
# List available agents
gemini agents list

# Run an agent
gemini agents run code-review-checklist --input "Review src/main.py"
```

### Deploying Individual Agents

```bash
mkdir -p ~/.gemini/agents/code-review-checklist
cp GeminiSkills-Agents/.gemini/agents/code-review-checklist/* \
   ~/.gemini/agents/code-review-checklist/
```

---

## Vertex AI (Enterprise)

For enterprise deployments, the `vertex-enterprise` bundle in `GeminiSkills/bundles/` contains 53 skills curated for Vertex AI use:

```bash
ls GeminiSkills/bundles/vertex-enterprise/
```

These skills are pre-configured with enterprise-appropriate safety settings and grounding instructions. Consult your Vertex AI documentation for deployment procedures specific to your organization.

---

## Super Gems

The `GeminiSkills/super-gems/` directory contains 50 advanced Gem configurations organized into three subcategories:

- **agent-chains** -- multi-agent pipelines where one Gem's output feeds the next
- **interactive-apps** -- Gems designed for interactive, multi-turn workflows
- **multi-step-workflows** -- complex Gems that orchestrate multiple processing stages

These are for advanced users who want to go beyond single-skill Gems.

---

## Using Bundles

Instead of deploying all skills, you can deploy a curated bundle. See `GeminiSkills/bundles/` for the 7 available Gemini bundles:

```bash
# Deploy the essential 30 for AI Studio
cp -r GeminiSkills/bundles/studio-essential-30/ ~/gemini-skills/
```

See [Choosing a Skill](./choosing-a-skill.md) for a full list of bundles and their contents.

---

## What to Read Next

- [Deploying to Claude](./deploying-to-claude.md) -- if you also use Claude
- [Deploying to Copilot](./deploying-to-copilot.md) -- if you also use Copilot
- [Deploying to Codex](./deploying-to-codex.md) -- if you also use Codex
- [Choosing a Skill](./choosing-a-skill.md) -- browse the full catalog
- [FAQ](./faq.md) -- troubleshooting and common questions
