# Deploying to Codex

This guide covers deploying skills to both Codex output variants: the main CodexSkills directory (multi-format JSON and text files) and CodexSkills-CLI (AGENTS.md files). Each format targets a different part of the OpenAI ecosystem.

---

## Overview of Codex Variants

| Variant | Directory | Format | Use Case |
|---------|-----------|--------|----------|
| CodexSkills (main) | `CodexSkills/` | JSON + TXT (4 files per skill) | Responses API, GPT Builder, Agent Builder |
| Codex CLI | `CodexSkills-CLI/` | `.codex/skills/{slug}/AGENTS.md` | Codex CLI agent instructions |

The main `CodexSkills/` directory contains 3,054 files -- four output files per skill:

| File Pattern | Format | Target |
|-------------|--------|--------|
| `{slug}.agent.json` | JSON | OpenAI Responses API |
| `{slug}.gpt.json` | JSON | GPT Builder (custom GPTs) |
| `{slug}.assistant.json` | JSON | Assistant / Agent Builder |
| `{slug}-system-prompt.txt` | Plain text | Raw system prompt for any integration |

Additionally, `CodexSkills/bundles/` contains 5 curated bundles:

| Bundle | Skills | Description |
|--------|--------|-------------|
| responses-api-full | 508 | Complete Responses API collection |
| by-category | 508 | Full set organized by category |
| enterprise-assistants | 53 | Enterprise-grade assistant configs |
| gpt-builder-50 | 50 | Top 50 GPT Builder configs |
| agent-builder-20 | 20 | Focused agent builder set |

---

## Model Selection

The converter (`convert_to_codex_responses.py`) selects OpenAI models based on skill complexity:

| Complexity | Model | Use Case |
|------------|-------|----------|
| Simple | `gpt-4o-mini` | Straightforward tasks, quick lookups, formatting |
| Moderate | `gpt-4o` | Multi-step analysis, code review, content generation |
| Complex | `o3` | Deep reasoning, multi-agent orchestration, architecture design |

Complexity is estimated automatically by `lib/metadata_enricher.py` based on the skill's content length, number of sections, and task difficulty indicators. You can override the model in any JSON config file after generation.

---

## Prerequisites

- The Skills Library repository cloned locally
- An OpenAI account with API access (obtain a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
- Codex CLI installed (for CLI variant)
- Python 3.8+ (for running the conversion scripts, if modifying skills)

---

## Responses API Setup

The Responses API is OpenAI's latest API for building AI-powered applications. Each `{slug}.agent.json` file contains a ready-to-use configuration.

### File Structure

Each Responses API file follows this structure:

```json
{
  "name": "Code Review Checklist",
  "description": "Structured code review processes and checklists",
  "instructions": "You are a code review specialist...",
  "model": "gpt-4o",
  "temperature": 0.3,
  "tools": [],
  "metadata": {
    "category": "technical",
    "complexity": "intermediate",
    "tags": ["code-review", "quality"]
  }
}
```

### Using with the Responses API

Load a skill configuration and send it to the Responses API:

```python
import json
import openai

# Load the skill configuration
with open("CodexSkills/code-review-checklist.agent.json") as f:
    config = json.load(f)

client = openai.OpenAI()

response = client.responses.create(
    model=config["model"],
    instructions=config["instructions"],
    input="Review this Python function for issues:\n\ndef process(data):\n  ...",
    temperature=config.get("temperature", 0.7),
)

print(response.output_text)
```

### Using with the Chat Completions API

If you prefer the Chat Completions API, extract the system prompt:

```python
import json
import openai

with open("CodexSkills/code-review-checklist.agent.json") as f:
    config = json.load(f)

client = openai.OpenAI()

response = client.chat.completions.create(
    model=config["model"],
    messages=[
        {"role": "system", "content": config["instructions"]},
        {"role": "user", "content": "Review this code for potential issues..."},
    ],
    temperature=config.get("temperature", 0.7),
)

print(response.choices[0].message.content)
```

### Batch Processing Multiple Skills

To load and index all Responses API configurations:

```python
import json
import glob

skills = {}
for path in glob.glob("CodexSkills/*.agent.json"):
    with open(path) as f:
        config = json.load(f)
        slug = path.split("/")[-1].replace(".agent.json", "")
        skills[slug] = config

# Use a specific skill
review_config = skills["code-review-checklist"]
print(f"Loaded {len(skills)} skills")
```

---

## GPT Builder Import

GPT Builder files (`{slug}.gpt.json`) are formatted for creating custom GPTs through the OpenAI GPT Builder interface or API.

### File Structure

```json
{
  "name": "Code Review Checklist",
  "description": "Structured code review processes and checklists",
  "instructions": "You are a code review specialist...",
  "model": "gpt-4o",
  "capabilities": {
    "web_browsing": false,
    "code_interpreter": true,
    "dall_e": false
  },
  "metadata": {
    "category": "technical"
  }
}
```

### Creating a Custom GPT Manually

1. Go to [chat.openai.com/gpts/editor](https://chat.openai.com/gpts/editor).
2. Open the desired `.gpt.json` file in a text editor.
3. Copy the `name` into the GPT name field.
4. Copy the `description` into the GPT description field.
5. Copy the `instructions` into the Instructions field.
6. Enable the capabilities listed in the `capabilities` object.
7. Click **Create** to publish your GPT.

### Creating a Custom GPT via API

```python
import json
import openai

with open("CodexSkills/code-review-checklist.gpt.json") as f:
    config = json.load(f)

client = openai.OpenAI()

# Create an assistant that mirrors the GPT config
assistant = client.beta.assistants.create(
    name=config["name"],
    description=config["description"],
    instructions=config["instructions"],
    model=config["model"],
    tools=[
        {"type": "code_interpreter"}
        if config.get("capabilities", {}).get("code_interpreter")
        else None
    ],
)

print(f"Created assistant: {assistant.id}")
```

### Bulk GPT Creation

To create GPTs from an entire category:

```python
import json
import glob

for path in sorted(glob.glob("CodexSkills/*-*.gpt.json")):
    with open(path) as f:
        config = json.load(f)
    category = config.get("metadata", {}).get("category", "unknown")
    if category == "technical":
        print(f"  {config['name']}: {config['description'][:60]}...")
```

---

## Agent Builder Configuration

Agent Builder files (`{slug}.assistant.json`) are formatted for the OpenAI Assistants API and Agent Builder.

### File Structure

```json
{
  "name": "Code Review Checklist",
  "description": "Structured code review processes and checklists",
  "instructions": "You are a code review specialist...",
  "model": "gpt-4o",
  "tools": [
    {"type": "code_interpreter"},
    {"type": "file_search"}
  ],
  "metadata": {
    "category": "technical",
    "complexity": "intermediate"
  }
}
```

### Creating an Assistant

```python
import json
import openai

with open("CodexSkills/code-review-checklist.assistant.json") as f:
    config = json.load(f)

client = openai.OpenAI()

assistant = client.beta.assistants.create(
    name=config["name"],
    description=config["description"],
    instructions=config["instructions"],
    model=config["model"],
    tools=config.get("tools", []),
)

print(f"Created assistant: {assistant.id}")
```

### Running a Conversation

After creating the assistant, start a thread and run it:

```python
thread = client.beta.threads.create()

client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Review this pull request for security issues...",
)

run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id,
)

if run.status == "completed":
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    for msg in messages.data:
        if msg.role == "assistant":
            print(msg.content[0].text.value)
```

### Attaching Files for File Search

If the assistant uses file search, upload reference files first:

```python
# Upload a file
file = client.files.create(
    file=open("codebase-snapshot.zip", "rb"),
    purpose="assistants",
)

# Create a vector store and add the file
vector_store = client.beta.vector_stores.create(name="Codebase")
client.beta.vector_stores.files.create(
    vector_store_id=vector_store.id,
    file_id=file.id,
)

# Update the assistant to use the vector store
client.beta.assistants.update(
    assistant_id=assistant.id,
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)
```

---

## Raw System Prompts

Each skill also includes a `{slug}-system-prompt.txt` file containing the raw system prompt as plain text. This is useful for:

- Integrating with custom applications that accept a system prompt string
- Pasting into third-party tools or chat interfaces
- Quick reference without parsing JSON

```bash
# View a system prompt
cat CodexSkills/code-review-checklist-system-prompt.txt
```

```bash
# Use in a curl request to the OpenAI API
PROMPT=$(cat CodexSkills/code-review-checklist-system-prompt.txt)
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "{
    \"model\": \"gpt-4o\",
    \"messages\": [
      {\"role\": \"system\", \"content\": $(echo "$PROMPT" | jq -Rs .)},
      {\"role\": \"user\", \"content\": \"Review this code...\"}
    ]
  }"
```

---

## Codex CLI Deployment

The CLI variant provides AGENTS.md files that the Codex CLI reads as agent instructions.

### Installation

```bash
cp -r CodexSkills-CLI/.codex ~/.codex
```

This copies all 508 skill files into your home directory where Codex CLI looks for agent definitions.

### Directory Structure

```
CodexSkills-CLI/
  .codex/
    skills/
      code-review-checklist/AGENTS.md
      api-design-reviewer/AGENTS.md
      multi-agent-orchestrator/AGENTS.md
      ...
```

After installation:

```
~/.codex/
  skills/
    code-review-checklist/AGENTS.md
    api-design-reviewer/AGENTS.md
    ...
```

### Deploying a Single Skill

```bash
mkdir -p ~/.codex/skills/code-review-checklist
cp CodexSkills-CLI/.codex/skills/code-review-checklist/AGENTS.md \
   ~/.codex/skills/code-review-checklist/
```

### Deploying a Subset by Category

Use a bundle to deploy a curated subset:

```bash
# Deploy the enterprise assistants bundle (53 skills)
cp -r CodexSkills/bundles/enterprise-assistants/ ~/.codex/skills/
```

### Per-Project Deployment

To scope skills to a specific project instead of installing globally:

```bash
# From the project root
mkdir -p .codex/skills
cp -r CodexSkills-CLI/.codex/skills/code-review-checklist .codex/skills/
cp -r CodexSkills-CLI/.codex/skills/api-design-reviewer .codex/skills/
```

The Codex CLI checks the local `.codex/` directory first, then falls back to `~/.codex/`.

### Using with Codex CLI

After deployment, reference skills in your Codex CLI sessions:

```bash
# Run Codex with a specific agent skill
codex --agent code-review-checklist "Review this repository for issues"

# List available agents
codex agents list
```

---

## Using Bundles

Instead of deploying all skills, pick a bundle that matches your needs:

| Bundle | Skills | Best For |
|--------|--------|----------|
| responses-api-full | 508 | Complete API integration |
| by-category | 508 | Full set, organized by category |
| enterprise-assistants | 53 | Enterprise-grade workflows |
| gpt-builder-50 | 50 | Building custom GPTs |
| agent-builder-20 | 20 | Focused agent development |

Deploy a bundle:

```bash
# Deploy the GPT Builder bundle
cp -r CodexSkills/bundles/gpt-builder-50/ ~/codex-gpts/
```

---

## Updating Skills

To update to a newer version of the skills:

### CLI Update

```bash
# Remove existing skills
rm -rf ~/.codex/skills

# Re-copy from the updated repository
cp -r CodexSkills-CLI/.codex ~/.codex
```

### Regenerating Codex Outputs

If you have modified master skills and need to regenerate Codex formats:

```bash
export PYTHONIOENCODING=utf-8
python convert_to_codex_responses.py
python convert_to_cli_skills.py --platform codex
```

---

## Best Practices

### Choose the Right Format

- Use **Responses API** (`.agent.json`) for production applications calling the OpenAI API directly.
- Use **GPT Builder** (`.gpt.json`) for creating shareable custom GPTs on chat.openai.com.
- Use **Agent Builder** (`.assistant.json`) for building assistants with file search and code interpreter.
- Use **System Prompt** (`.txt`) for quick integration with any tool that accepts a system prompt.
- Use **CLI** (`AGENTS.md`) for local development with the Codex CLI.

### Keep Assistants Focused

When using the Assistants API, each assistant should serve a single purpose. Rather than combining multiple skill instructions into one assistant, create separate assistants and route requests to the appropriate one.

### Monitor Token Usage

Skill system prompts vary in length. For cost-sensitive applications, check the token count of the system prompt before deploying:

```python
import tiktoken
import json

with open("CodexSkills/code-review-checklist.agent.json") as f:
    config = json.load(f)

enc = tiktoken.encoding_for_model(config["model"])
tokens = enc.encode(config["instructions"])
print(f"System prompt tokens: {len(tokens)}")
```

### Version Your Configurations

If you customize skill configurations, keep your modifications in a separate directory or branch so you can merge upstream updates without conflicts.

---

## Troubleshooting

**API returns "invalid model" error?**
- Check that the `model` field in the JSON file matches a model you have access to. Update it if needed (e.g., change `gpt-4o` to `gpt-4o-mini`).

**Assistant not using tools?**
- Verify the `tools` array in the `.assistant.json` file includes the tools you expect.
- Ensure your OpenAI account has access to the required tool types.

**Codex CLI does not find agents?**
- Confirm the skills were copied to `~/.codex/skills/` (global) or `.codex/skills/` (project-local).
- Check that each skill directory contains an `AGENTS.md` file.

**System prompt too long?**
- Some skills have detailed instructions that may exceed context limits on smaller models. Use the system prompt text file and trim sections you do not need.

**Windows encoding issues?**
- Set the encoding environment variable before running scripts: `set PYTHONIOENCODING=utf-8`.

---

## What to Read Next

- [Deploying to Claude](./deploying-to-claude.md) -- if you also use Claude
- [Deploying to Gemini](./deploying-to-gemini.md) -- if you also use Gemini
- [Deploying to Copilot](./deploying-to-copilot.md) -- if you also use GitHub Copilot
- [Choosing a Skill](./choosing-a-skill.md) -- browse the full catalog
- [FAQ](./faq.md) -- common questions and answers
