# Codex / OpenAI Platform Guide

This guide covers both Codex skill variants: the multi-format JSON library (3,054 files across Responses API, GPT Builder, Agent Builder, and system-prompt formats) and the CLI variant (508 AGENTS.md files). The Codex platform produces the highest file count per skill because each master skill generates multiple output files targeting different OpenAI deployment surfaces.

## Variants at a Glance

| Variant | Files | Path Pattern | Use Case |
|---------|-------|--------------|----------|
| CodexSkills | 3,054 | `skills/{slug}/` (multiple JSON + TXT per skill) | Responses API, GPT Builder, Agent Builder |
| CodexSkills-CLI | 508 | `skills/{slug}/AGENTS.md` | Local CLI agent (`~/.codex/`) |

---

## 1. CodexSkills (Multi-Format JSON Library)

The primary Codex output -- each master skill generates up to 6 files, producing 3,054 total files across all skills.

### Directory Structure

```
Codex/CodexSkills/
  skills/
    access-management/
      access-management.agent.json       # Responses API format
      access-management.gpt.json         # GPT Builder format
      access-management.assistant.json   # Agent Builder format
      access-management.system-prompt.txt # Raw system prompt
      access-management.config.json      # Shared configuration
      access-management.metadata.json    # Enrichment metadata
    accountability-buddy/
      accountability-buddy.agent.json
      accountability-buddy.gpt.json
      accountability-buddy.assistant.json
      accountability-buddy.system-prompt.txt
      ...
    ...
  bundles/
    responses-api-full/      # 508 (all .agent.json files)
    by-category/             # 508 (organized by category)
    enterprise-assistants/   # 53
    gpt-builder-50/          # 50
    agent-builder-20/        # 20
```

### File Formats

#### Responses API Format (`.agent.json`)

The Responses API format is used with OpenAI's latest API for creating agent-like interactions:

```json
{
  "name": "access-management",
  "description": "Comprehensive identity and access management implementation and governance.",
  "model": "o3",
  "instructions": "You are a specialist in identity and access management...\n\n## Overview\n...\n\n## Core Processes\n...",
  "tools": [
    {
      "type": "web_search_preview"
    },
    {
      "type": "code_interpreter"
    }
  ],
  "temperature": 0.4,
  "max_output_tokens": 16384,
  "metadata": {
    "category": "ai-agents",
    "complexity": "complex",
    "version": "1.0.0"
  }
}
```

#### GPT Builder Format (`.gpt.json`)

Used to create Custom GPTs via the GPT Builder interface or API:

```json
{
  "name": "Access Management Expert",
  "description": "Comprehensive identity and access management implementation and governance.",
  "instructions": "You are a specialist in identity and access management...\n\n## Overview\n...",
  "model": "o3",
  "tools": [
    {"type": "browser"},
    {"type": "code_interpreter"}
  ],
  "capabilities": {
    "web_browsing": true,
    "code_interpreter": true,
    "image_generation": false
  },
  "conversation_starters": [
    "Design an IAM architecture for a SaaS platform",
    "Review our RBAC implementation for security gaps",
    "Create a least-privilege access policy"
  ]
}
```

#### Agent Builder Format (`.assistant.json`)

Used with the OpenAI Assistants API:

```json
{
  "name": "access-management",
  "description": "Comprehensive identity and access management...",
  "model": "o3",
  "instructions": "You are a specialist in identity and access management...",
  "tools": [
    {"type": "code_interpreter"},
    {"type": "file_search"}
  ],
  "temperature": 0.4,
  "top_p": 0.95,
  "metadata": {
    "category": "ai-agents",
    "complexity": "complex"
  }
}
```

#### System Prompt (`.system-prompt.txt`)

A plain-text file containing just the system prompt, suitable for direct use in any OpenAI API call:

```
You are a specialist in identity and access management implementation and governance.

## Overview

Identity and access management (IAM) is a framework of policies, processes, and technologies...

## Core Processes

1. Identity Lifecycle Management
   - User provisioning and deprovisioning
   - Role assignment and rotation
   ...

## Tools & Templates
...
```

#### Configuration (`.config.json`)

Shared settings used across all formats for a given skill:

```json
{
  "name": "access-management",
  "category": "ai-agents",
  "complexity": "complex",
  "model": "o3",
  "temperature": 0.4,
  "max_output_tokens": 16384,
  "tags": ["access", "security", "compliance", "management"],
  "version": "1.0.0"
}
```

### Model Selection by Complexity

The `convert_to_codex_responses.py` pipeline assigns models based on skill complexity:

| Complexity | Model | Typical Use |
|------------|-------|-------------|
| simple | gpt-4o-mini | Quick tasks, simple generation, lookups |
| moderate | gpt-4o | Multi-step analysis, code generation |
| complex | o3 | Deep reasoning, architecture design, complex workflows |

### Temperature by Category

| Category | Temperature | Rationale |
|----------|-------------|-----------|
| creative | 0.8--0.9 | Higher creativity for writing and design |
| strategy | 0.5--0.6 | Balanced for planning and analysis |
| technical | 0.3--0.5 | Precision for code and infrastructure |
| ai-agents | 0.4--0.5 | Moderate for agent orchestration |
| operations | 0.3--0.4 | Precision for process tasks |
| industry | 0.4--0.5 | Domain-specific accuracy |

### Using the Responses API

```python
from openai import OpenAI
import json

client = OpenAI()

# Load the agent configuration
with open("skills/access-management/access-management.agent.json") as f:
    agent = json.load(f)

# Create a response using the Responses API
response = client.responses.create(
    model=agent["model"],
    instructions=agent["instructions"],
    input="Design an IAM architecture for a multi-tenant SaaS platform.",
    tools=agent["tools"],
    temperature=agent["temperature"],
    max_output_tokens=agent["max_output_tokens"]
)

print(response.output_text)
```

### Creating a Custom GPT

**Method 1: GPT Builder UI**

1. Go to [chat.openai.com](https://chat.openai.com) and click "Explore GPTs" then "Create".
2. Open the `.gpt.json` file for your desired skill.
3. Copy the `name`, `description`, and `instructions` into the GPT Builder form.
4. Enable the capabilities listed in the `capabilities` object.
5. Add the `conversation_starters` as starter prompts.
6. Save and publish.

**Method 2: API**

```python
from openai import OpenAI
import json

client = OpenAI()

with open("skills/access-management/access-management.gpt.json") as f:
    gpt = json.load(f)

# Create via Assistants API (GPTs are a specialized form of Assistants)
assistant = client.beta.assistants.create(
    name=gpt["name"],
    description=gpt["description"],
    instructions=gpt["instructions"],
    model=gpt["model"],
    tools=[{"type": t["type"]} for t in gpt["tools"]]
)

print(f"Created GPT: {assistant.id}")
```

### Creating an Assistant (Agent Builder)

```python
from openai import OpenAI
import json

client = OpenAI()

with open("skills/access-management/access-management.assistant.json") as f:
    config = json.load(f)

# Create the assistant
assistant = client.beta.assistants.create(
    name=config["name"],
    description=config["description"],
    instructions=config["instructions"],
    model=config["model"],
    tools=config["tools"],
    temperature=config["temperature"],
    top_p=config.get("top_p", 1.0),
    metadata=config.get("metadata", {})
)

# Create a thread and run
thread = client.beta.threads.create()
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Review our RBAC implementation for security gaps."
)

run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id
)
```

### Using the Raw System Prompt

The `.system-prompt.txt` file is the most portable format -- it works with any OpenAI API call:

```python
from openai import OpenAI

client = OpenAI()

with open("skills/access-management/access-management.system-prompt.txt") as f:
    system_prompt = f.read()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Design an IAM architecture for our SaaS platform."}
    ],
    temperature=0.4
)

print(response.choices[0].message.content)
```

### Bundles

| Bundle | Count | Use Case |
|--------|-------|----------|
| `responses-api-full` | 508 | All skills in Responses API format |
| `by-category` | 508 | Full library organized by category |
| `enterprise-assistants` | 53 | Enterprise-focused Assistants |
| `gpt-builder-50` | 50 | Top 50 skills as Custom GPTs |
| `agent-builder-20` | 20 | Core agent-oriented skills |

---

## 2. CodexSkills-CLI

Skills formatted for the Codex CLI, deployed to `~/.codex/`.

### Directory Structure

```
Codex/CodexSkills-CLI/
  skills/
    access-management/
      AGENTS.md
    accountability-buddy/
      AGENTS.md
    ...                      # 508 skills (flat)
  .codex/
    skills/                  # Pre-organized for deployment
```

### File Format

CLI skills use AGENTS.md (not SKILL.md) with YAML frontmatter:

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management..."
platform: codex-cli
version: "1.0.0"
---

## Overview
...

## Core Processes
...

## Tools & Templates
...
```

The `AGENTS.md` filename (rather than `SKILL.md`) follows the Codex CLI convention for agent configuration files.

### Deployment

**Linux / macOS:**

```bash
# Copy all skills to Codex CLI directory
cp -r Codex/CodexSkills-CLI/.codex ~/.codex

# Or copy the skills directory directly
mkdir -p ~/.codex/skills
cp -r Codex/CodexSkills-CLI/skills/* ~/.codex/skills/
```

**Windows (PowerShell):**

```powershell
# Create directory if needed
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex\skills"

# Copy all skills
Copy-Item -Recurse Codex\CodexSkills-CLI\.codex\* "$env:USERPROFILE\.codex\"
```

### Usage

```bash
# List available agents
codex agents list

# Use a specific agent skill
codex --agent access-management "Design an IAM architecture"

# Or reference the AGENTS.md directly
codex --instructions ~/.codex/skills/access-management/AGENTS.md "Review our IAM setup"
```

---

## Pipeline: How Codex Files Are Generated

The `convert_to_codex_responses.py` script (14KB) converts master SKILL.md files into all Codex output formats:

```bash
# Run the Codex converter
PYTHONIOENCODING=utf-8 python convert_to_codex_responses.py
```

### Conversion Pipeline

1. **Read** master SKILL.md from `_master-skills/`
2. **Parse** YAML frontmatter and Markdown body
3. **Detect complexity** using `lib/platform_tuning.py`
4. **Assign model** (gpt-4o-mini / gpt-4o / o3) based on complexity
5. **Set temperature** based on category
6. **Generate** four output files per skill:
   - `.agent.json` (Responses API)
   - `.gpt.json` (GPT Builder)
   - `.assistant.json` (Agent Builder)
   - `.system-prompt.txt` (raw system prompt)
7. **Generate** shared files:
   - `.config.json` (configuration)
   - `.metadata.json` (enrichment data)

### Why 3,054 Files?

Each of the 508 master skills produces up to 6 output files:

```
508 skills x 6 files = 3,048 (approximate)
+ index files, metadata, and category manifests = 3,054
```

This multi-file approach ensures each OpenAI deployment target (Responses API, GPT Builder, Assistants API, raw prompts) has a ready-to-use configuration without requiring runtime conversion.

---

## Format Comparison

| Feature | .agent.json | .gpt.json | .assistant.json | .system-prompt.txt |
|---------|------------|-----------|----------------|-------------------|
| API Target | Responses API | GPT Builder | Assistants API | Chat Completions |
| Tools | web_search, code_interpreter | browser, code_interpreter | code_interpreter, file_search | None (add manually) |
| Conversation starters | No | Yes | No | No |
| Temperature | Included | Included | Included | Not included |
| Metadata | Included | Minimal | Included | None |
| File search | No | No | Yes | No |
| Portability | OpenAI-specific | OpenAI-specific | OpenAI-specific | Universal |

---

## Choosing a Variant

| If you... | Use this variant |
|-----------|-----------------|
| Build with OpenAI Responses API | CodexSkills `.agent.json` |
| Create Custom GPTs | CodexSkills `.gpt.json` |
| Use OpenAI Assistants API | CodexSkills `.assistant.json` |
| Need a raw system prompt for any API | CodexSkills `.system-prompt.txt` |
| Use the Codex CLI locally | CodexSkills-CLI |
| Want enterprise-grade Assistants | CodexSkills `enterprise-assistants` bundle |
| Need the most portable format | CodexSkills `.system-prompt.txt` |

---

## Troubleshooting

### Model access errors

The `o3` model requires API access approval. If you receive a "model not found" error:

1. Check your OpenAI account tier at [platform.openai.com](https://platform.openai.com).
2. Downgrade the model in the JSON file (replace `"o3"` with `"gpt-4o"`).
3. Or use the `.config.json` to find the complexity and choose an appropriate alternative.

### Invalid JSON

```bash
# Validate JSON syntax
python -m json.tool skills/access-management/access-management.agent.json
```

Common issues: unescaped characters in the `instructions` field, trailing commas, or Windows line endings (`\r\n`) in text fields.

### Encoding issues on Windows

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"
```

### Assistant creation failing

If `client.beta.assistants.create()` fails:

- Verify your API key has Assistants API access.
- Check that the `tools` array uses valid tool types.
- Ensure `metadata` values are strings (the API does not accept nested objects in metadata).

### Token limits

Some skills with very long system instructions may exceed model context limits. The pipeline sets `max_output_tokens` appropriately, but the combined system prompt + user input + output must fit within the model's context window:

| Model | Context Window |
|-------|---------------|
| gpt-4o-mini | 128K tokens |
| gpt-4o | 128K tokens |
| o3 | 200K tokens |

---

## Related Guides

- [Claude Guide](claude-guide.md) -- Compare with Claude's Markdown format
- [Gemini Guide](gemini-guide.md) -- Compare with Gemini's Gem JSON format
- [Platform Comparison](platform-comparison.md) -- Side-by-side feature matrix
- [Universal Adapters](universal-adapters-guide.md) -- Convert between platforms
- [Getting Started](../01-getting-started/) -- Initial setup and orientation
