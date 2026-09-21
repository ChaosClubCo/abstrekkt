# Universal Adapters Guide

The `UniversalAdapters/` directory provides a Node.js toolkit for converting skills between all supported platforms programmatically. It includes 8 platform-specific adapters, a batch converter for bulk operations, a JSON schema for skill validation, and pre-built output for 7 platform targets (2,313 files).

## Directory Structure

```
UniversalAdapters/
  adapters/
    index.js              # Adapter factory and registry
    claude-cli.js         # Claude CLI adapter
    claude-desktop.js     # Claude Desktop adapter
    claude-web.js         # Claude Web (Projects) adapter
    codex-cli.js          # Codex CLI adapter
    copilot-cli.js        # Copilot CLI adapter
    gemini-cli.js         # Gemini CLI adapter
    github-repo.js        # GitHub repository adapter
  converters/
    batch-converter.js    # Bulk conversion CLI tool
  schemas/
    skill-schema.json     # Universal skill JSON schema
  output/                 # Pre-built output (2,313 files)
    claude-cli/
    claude-desktop/
    claude-web/
    codex-cli/
    copilot-cli/
    gemini-cli/
    github-repo/
  package.json
  README.md
```

---

## Quick Start

### Installation

```bash
cd UniversalAdapters

# Install dependencies (none currently required, but future adapters may add them)
npm install
```

### Convert a Single Skill

```javascript
const adapters = require('./adapters');

// Define a skill object
const skill = {
  name: 'access-management',
  description: 'Comprehensive identity and access management...',
  version: '1.0.0',
  content: {
    purpose: 'Implement and govern IAM systems.',
    capabilities: [
      'RBAC and ABAC design',
      'Least-privilege policy generation',
      'Audit trail creation'
    ],
    usage: 'Use when designing or reviewing access control systems.',
    fullBody: '## Overview\n\nIdentity and access management...\n\n## Core Processes\n...'
  }
};

// Convert to a specific platform
const result = adapters.convert(skill, 'gemini-cli');
console.log(result);
// {
//   format: 'gemini-cli',
//   files: [
//     { path: 'GEMINI.md', content: '---\nname: access-management\n...' },
//     { path: 'gemini.config.json', content: '{"name":"access-management",...}' }
//   ]
// }
```

### List Available Platforms

```javascript
const adapters = require('./adapters');

console.log(adapters.listPlatforms());
// ['claude-desktop', 'claude-web', 'claude-cli', 'gemini-cli',
//  'copilot-cli', 'codex-cli', 'github-repo']
```

### Batch Conversion

Convert all skills in a source directory to all platforms at once:

```bash
# Convert all master skills to all platforms
node converters/batch-converter.js ../_master-skills ./output

# Or use the npm script
npm run convert -- ../_master-skills ./output
```

The batch converter:

1. Recursively scans the source directory for `SKILL.md` files.
2. Parses YAML frontmatter and Markdown body from each file.
3. Converts each skill to all 7 platform targets.
4. Writes output to `{output-dir}/{platform}/{slug}/`.

---

## Adapter API

Each adapter module exports a `convert(skill)` function that returns a platform-specific result object.

### Input: Skill Object

All adapters accept a skill object with this structure:

```javascript
{
  name: 'skill-slug',           // Required: skill identifier
  description: 'Brief...',      // Required: one-sentence description
  version: '1.0.0',             // Optional: semantic version
  category: 'ai-agents',        // Optional: category name
  complexity: 'complex',        // Optional: simple | moderate | complex
  tags: ['tag1', 'tag2'],       // Optional: discoverability tags
  content: {
    purpose: 'What the skill does.',
    capabilities: ['cap1', 'cap2'],
    usage: 'When to use it.',
    examples: ['Example 1'],
    fullBody: '## Overview\n...' // Full Markdown body (preferred)
  },
  tools: ['web_search', 'code_interpreter']  // Optional: tool references
}
```

The `content.fullBody` field is preferred over individual content fields. When present, adapters include the complete skill body rather than generating a condensed version.

### Output: Result Object

Each adapter returns:

```javascript
{
  format: 'platform-name',      // Platform identifier
  files: [
    {
      path: 'relative/file/path',  // File path relative to skill directory
      content: '...'                // File content as a string
    }
  ]
}
```

### Adapter Reference

| Adapter | Output Files | Description |
|---------|-------------|-------------|
| `claude-cli` | `SKILL.md` | YAML frontmatter + Markdown for `~/.claude/commands/` |
| `claude-desktop` | `SKILL.md` | Same format, for `.claude-plugin/skills/` |
| `claude-web` | `project-instructions.md` | Plain Markdown for Claude.ai Projects |
| `gemini-cli` | `GEMINI.md` + `gemini.config.json` | Markdown + JSON config for `~/.gemini/` |
| `copilot-cli` | `SKILL.md` | Markdown for `.github/copilot-instructions.md` |
| `codex-cli` | `AGENTS.md` | Markdown for `~/.codex/skills/` |
| `github-repo` | `SKILL.md` + `config.json` | Markdown + config for GitHub repository agents |

---

## The Skill Schema

The `schemas/skill-schema.json` file defines the universal skill format as a JSON Schema (draft-07). Use it to validate skill objects before conversion.

### Schema Overview

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Universal Skill Schema",
  "type": "object",
  "required": ["name", "description"],
  "properties": {
    "name": { "type": "string" },
    "description": { "type": "string" },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "platforms": {
      "type": "array",
      "items": {
        "enum": [
          "claude-desktop", "claude-web", "claude-cli",
          "gemini-cli", "gemini-agents", "gemini-studio",
          "copilot-cli", "copilot-frontier",
          "codex-cli", "github-repo"
        ]
      }
    },
    "content": {
      "type": "object",
      "properties": {
        "purpose": { "type": "string" },
        "capabilities": { "type": "array", "items": { "type": "string" } },
        "usage": { "type": "string" },
        "examples": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

### Validating a Skill

```javascript
const Ajv = require('ajv');
const schema = require('./schemas/skill-schema.json');

const ajv = new Ajv();
const validate = ajv.compile(schema);

const skill = {
  name: 'my-custom-skill',
  description: 'A custom skill for demonstration.'
};

if (validate(skill)) {
  console.log('Valid skill object');
} else {
  console.error('Validation errors:', validate.errors);
}
```

Or validate from the command line (requires the `validate.js` script):

```bash
npm run validate -- path/to/skill.json
```

---

## Pre-Built Output

The `output/` directory contains 2,313 pre-converted files across 7 platform subdirectories. These are generated by running the batch converter against the master skills library.

| Platform | Directory | Approximate Files |
|----------|-----------|-------------------|
| `claude-cli` | `output/claude-cli/` | ~507 |
| `claude-desktop` | `output/claude-desktop/` | ~508 |
| `claude-web` | `output/claude-web/` | ~508 |
| `codex-cli` | `output/codex-cli/` | ~508 |
| `copilot-cli` | `output/copilot-cli/` | ~507 |
| `gemini-cli` | `output/gemini-cli/` | ~514 |
| `github-repo` | `output/github-repo/` | ~258 |

These pre-built outputs are useful for quick deployment without running the conversion pipeline, but may lag behind the latest master skills if the pipeline has been updated.

### Refreshing Output

```bash
# Regenerate all output from current master skills
node converters/batch-converter.js ../_master-skills ./output
```

---

## Adding a New Platform Adapter

To support a new AI platform, create a new adapter module following this pattern:

### Step 1: Create the Adapter File

Create `adapters/my-platform.js`:

```javascript
/**
 * My Platform Adapter
 */

function convert(skill) {
  return {
    format: 'my-platform',
    files: [
      {
        path: 'skill.yaml',
        content: generateYaml(skill)
      }
    ]
  };
}

function generateYaml(skill) {
  // Transform the universal skill object into your platform's format
  return [
    `name: ${skill.name}`,
    `description: ${skill.description}`,
    `version: ${skill.version || '1.0.0'}`,
    '',
    'instructions: |',
    `  ${(skill.content?.fullBody || skill.description).replace(/\n/g, '\n  ')}`
  ].join('\n');
}

module.exports = { convert };
```

### Step 2: Register the Adapter

Edit `adapters/index.js` to include your adapter:

```javascript
const adapters = {
  'claude-desktop': require('./claude-desktop'),
  'claude-web': require('./claude-web'),
  'claude-cli': require('./claude-cli'),
  'gemini-cli': require('./gemini-cli'),
  'copilot-cli': require('./copilot-cli'),
  'codex-cli': require('./codex-cli'),
  'github-repo': require('./github-repo'),
  'my-platform': require('./my-platform')      // Add this line
};
```

### Step 3: Test the Adapter

```javascript
const adapters = require('./adapters');

const testSkill = {
  name: 'test-skill',
  description: 'A test skill.',
  content: { fullBody: '## Overview\nThis is a test.' }
};

const result = adapters.convert(testSkill, 'my-platform');
console.log(result.files[0].content);
```

### Step 4: Run Batch Conversion

```bash
# The batch converter will automatically include the new platform
node converters/batch-converter.js ../_master-skills ./output
```

The new platform's output will appear in `output/my-platform/`.

---

## Programmatic Usage Examples

### Convert One Skill to All Platforms

```javascript
const fs = require('fs');
const path = require('path');
const adapters = require('./adapters');

// Parse a SKILL.md file
function parseSkillMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const skill = { content: {} };
  skill.slug = path.basename(path.dirname(filePath));

  // Parse frontmatter
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      skill[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });

  skill.name = skill.name || skill.slug;
  skill.content.fullBody = match[2].trim();
  return skill;
}

// Convert to all platforms
const skill = parseSkillMd('../_master-skills/ai-agents/access-management/SKILL.md');
const platforms = adapters.listPlatforms();

for (const platform of platforms) {
  const result = adapters.convert(skill, platform);
  const outDir = path.join('output', platform, skill.slug);
  fs.mkdirSync(outDir, { recursive: true });

  for (const file of result.files) {
    fs.writeFileSync(path.join(outDir, file.path), file.content, 'utf8');
  }

  console.log(`${platform}: wrote ${result.files.length} file(s)`);
}
```

### Integrate with CI/CD

```yaml
# .github/workflows/convert-skills.yml
name: Convert Skills
on:
  push:
    paths:
      - '_master-skills/**'

jobs:
  convert:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd UniversalAdapters && npm install
      - run: node UniversalAdapters/converters/batch-converter.js _master-skills UniversalAdapters/output
      - run: |
          git add UniversalAdapters/output/
          git commit -m "Regenerate platform outputs" || true
          git push
```

---

## Troubleshooting

### Adapter not found

```
Error: Unknown platform: my-platform
```

Verify the adapter is registered in `adapters/index.js` and the module file exists.

### Empty fullBody

If converted files have minimal content, ensure the source SKILL.md files include complete Markdown body sections. The `content.fullBody` field is populated from everything after the YAML frontmatter closing `---`.

### Windows path issues

The batch converter uses `path.join()` for cross-platform compatibility. If you encounter path issues on Windows, ensure you are running Node.js (not WSL) and using forward slashes in any manually specified paths.

### Encoding

Source SKILL.md files are read as UTF-8. On Windows, ensure your terminal supports UTF-8:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

---

## Related Guides

- [Claude Guide](claude-guide.md) -- Claude platform details
- [Gemini Guide](gemini-guide.md) -- Gemini platform details
- [Copilot Guide](copilot-guide.md) -- GitHub Copilot platform details
- [Codex Guide](codex-guide.md) -- OpenAI Codex platform details
- [Platform Comparison](platform-comparison.md) -- Side-by-side feature matrix
