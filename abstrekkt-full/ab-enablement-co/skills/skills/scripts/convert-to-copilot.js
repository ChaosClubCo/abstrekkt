/**
 * @deprecated This converter is deprecated. Use the Python equivalent instead:
 *   python sync-skills.py --targets copilot
 *
 * This JS converter duplicates CopilotConverter in sync-skills.py and cannot
 * share lib/ modules. It will be removed in a future version.
 */

/**
 * convert-to-copilot.js
 *
 * Converts master skill definitions into multiple GitHub Copilot-specific formats:
 *   1. custom-instructions/{category}/{slug}.md        - Enhanced instruction files
 *   2. agent-skills/{category}/{slug}/SKILL.md         - Agent skill format
 *   3. instructions/{category}-{slug}.instructions.md  - Path-specific instructions
 *   4. Category README files + root copilot-instructions-root.md
 *
 * Source: _master-skills/{category}/{skill-name}/SKILL.md
 * Output: platforms/github-copilot/copilot-skills/
 *
 * Node.js only -- no external dependencies.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SOURCE_BASE = path.join(__dirname, '..', '_master-skills');
const TARGET_BASE = path.join(__dirname, '..', 'platforms', 'github-copilot', 'copilot-skills');

const CATEGORIES = ['technical', 'strategy', 'creative', 'industry', 'operations', 'ai-agents'];

/** Glob patterns that Copilot path-specific instructions use per category. */
const APPLY_TO_PATTERNS = {
    technical:  '**/*.{ts,js,py,go,rs,java}',
    strategy:   '**/*.{md,txt}',
    creative:   '**/*.{md,html,css,svg}',
    operations: '**/*.{yml,yaml,json,toml,sh}',
    industry:   '**/*.{md,txt,csv,json}',
    'ai-agents': '**/*.{md,yml,yaml,json,py,ts}',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a slug like "api-design-principles" to "Api Design Principles". */
function toTitleCase(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/** Ensure a directory exists, creating it recursively if needed. */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Parse a SKILL.md file. Returns { name, description, body }.
 * Handles files with or without YAML-ish frontmatter delimited by ---.
 */
function parseSkillMd(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
        return { name: '', description: '', body: content.trim() };
    }

    const frontmatter = match[1];
    const body = match[2].trim();

    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

    return {
        name: nameMatch ? nameMatch[1].trim() : '',
        description: descMatch ? descMatch[1].trim() : '',
        body,
    };
}

/**
 * Return the first N non-empty lines from a body string.
 * Used for the truncated instructions format.
 */
function firstNLines(text, n) {
    const lines = text.split(/\r?\n/);
    const collected = [];
    for (const line of lines) {
        collected.push(line);
        if (collected.length >= n) break;
    }
    return collected.join('\n');
}

// ---------------------------------------------------------------------------
// Format generators
// ---------------------------------------------------------------------------

/**
 * 1. Enhanced custom-instructions format.
 */
function generateCustomInstruction(displayName, description, body, category, slug) {
    const applyTo = APPLY_TO_PATTERNS[category] || '**/*';

    return `# ${displayName}

## Overview
${description || 'No description provided.'}

## Workspace Context
When working with this skill in a codebase:
- Reference relevant files using @workspace
- Use #file:path syntax to include specific file context
- Consider the project's existing patterns and conventions

## Instructions
${body}

## File Patterns
Applies to: \`${applyTo}\`

## Integration Notes
- Use \`@workspace\` to reference project structure
- Use \`@terminal\` for command execution context
- Combine with other instructions in \`.github/copilot-instructions.md\`
`;
}

/**
 * 2. Agent-skills SKILL.md format (with frontmatter).
 */
function generateAgentSkill(name, description, body) {
    return `---
name: ${name}
description: ${description || 'No description provided.'}
---

${body}
`;
}

/**
 * 3. Path-specific .instructions.md format.
 */
function generatePathInstruction(body, category) {
    const applyTo = APPLY_TO_PATTERNS[category] || '**/*';
    const truncatedBody = firstNLines(body, 50);

    return `---
applyTo: "${applyTo}"
---

${truncatedBody}
`;
}

// ---------------------------------------------------------------------------
// Category README
// ---------------------------------------------------------------------------

function generateCategoryReadme(category, skills) {
    const title = toTitleCase(category);
    const skillList = skills
        .map(s => `- [${s.displayName}](./custom-instructions/${category}/${s.slug}.md)`)
        .join('\n');

    return `# ${title} -- Copilot Skills

This directory contains GitHub Copilot skill files for the **${title}** category.

## Available Skills (${skills.length})

${skillList}

## Formats

| Format | Path | Purpose |
|--------|------|---------|
| Custom Instructions | \`custom-instructions/${category}/\` | Full instruction files for \`.github/copilot-instructions.md\` |
| Agent Skills | \`agent-skills/${category}/\` | Skill definitions for Copilot agent mode |
| Path Instructions | \`instructions/\` | File-pattern-scoped instruction snippets |

## Usage

1. **Single Skill** -- Copy content from \`custom-instructions/${category}/<skill>.md\` into your project's \`.github/copilot-instructions.md\`.
2. **Multiple Skills** -- Concatenate the Instructions sections from several files.
3. **Agent Mode** -- Place \`agent-skills/${category}/<skill>/SKILL.md\` where your Copilot agent config expects skill definitions.
4. **Path-Specific** -- Drop \`instructions/${category}-<skill>.instructions.md\` into \`.github/\` for automatic file-pattern matching.
5. **Copilot Chat** -- Reference any file directly in Copilot Chat for context-specific assistance.
`;
}

// ---------------------------------------------------------------------------
// Root copilot-instructions-root.md
// ---------------------------------------------------------------------------

function generateRootInstructions(allSkillsByCategory) {
    const sections = [];

    for (const category of CATEGORIES) {
        const skills = allSkillsByCategory[category] || [];
        if (skills.length === 0) continue;
        const title = toTitleCase(category);
        const list = skills.map(s => `  - ${s.displayName}`).join('\n');
        sections.push(`### ${title} (${skills.length})\n${list}`);
    }

    const totalCount = Object.values(allSkillsByCategory)
        .reduce((sum, arr) => sum + arr.length, 0);

    return `# Copilot Skills Library

> Auto-generated root index -- ${totalCount} skills across ${CATEGORIES.length} categories.

This repository provides GitHub Copilot custom instructions, agent skill definitions,
and path-specific instruction files converted from the master skill library.

## Quick Start

1. Browse by category below.
2. Copy a \`custom-instructions/{category}/{skill}.md\` file into your project's \`.github/copilot-instructions.md\`.
3. Or use \`agent-skills/\` and \`instructions/\` formats for advanced Copilot integration.

## Categories

${sections.join('\n\n')}

## Directory Layout

\`\`\`
copilot-skills/
  custom-instructions/{category}/{slug}.md      -- full instruction files
  agent-skills/{category}/{slug}/SKILL.md       -- agent skill definitions
  instructions/{category}-{slug}.instructions.md -- path-specific snippets
  {category}/README.md                          -- per-category index
  copilot-instructions-root.md                  -- this file
\`\`\`
`;
}

// ---------------------------------------------------------------------------
// Processing
// ---------------------------------------------------------------------------

function processSkill(category, slug, sourcePath) {
    const skillMdPath = path.join(sourcePath, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) {
        return { ok: false, error: `No SKILL.md found in ${category}/${slug}` };
    }

    let content;
    try {
        content = fs.readFileSync(skillMdPath, 'utf-8');
    } catch (err) {
        return { ok: false, error: `Cannot read ${skillMdPath}: ${err.message}` };
    }

    const { name, description, body } = parseSkillMd(content);
    const displayName = name ? toTitleCase(name) : toTitleCase(slug);

    // Paths
    const customDir = path.join(TARGET_BASE, 'custom-instructions', category);
    const agentDir  = path.join(TARGET_BASE, 'agent-skills', category, slug);
    const instrDir  = path.join(TARGET_BASE, 'instructions');

    ensureDir(customDir);
    ensureDir(agentDir);
    ensureDir(instrDir);

    try {
        // 1. Custom instruction
        const customContent = generateCustomInstruction(displayName, description, body, category, slug);
        fs.writeFileSync(path.join(customDir, `${slug}.md`), customContent, 'utf-8');

        // 2. Agent skill
        const agentContent = generateAgentSkill(name || slug, description, body);
        fs.writeFileSync(path.join(agentDir, 'SKILL.md'), agentContent, 'utf-8');

        // 3. Path-specific instruction
        const instrContent = generatePathInstruction(body, category);
        fs.writeFileSync(path.join(instrDir, `${category}-${slug}.instructions.md`), instrContent, 'utf-8');

        return { ok: true, displayName, slug };
    } catch (err) {
        return { ok: false, error: `Write failed for ${category}/${slug}: ${err.message}` };
    }
}

function processCategory(category) {
    const sourcePath = path.join(SOURCE_BASE, category);
    if (!fs.existsSync(sourcePath)) {
        return { skills: [], errors: [`Source directory missing: ${sourcePath}`] };
    }

    let items;
    try {
        items = fs.readdirSync(sourcePath, { withFileTypes: true });
    } catch (err) {
        return { skills: [], errors: [`Cannot read source directory ${sourcePath}: ${err.message}`] };
    }

    const skills = [];
    const errors = [];

    for (const item of items) {
        if (!item.isDirectory()) continue;

        const result = processSkill(category, item.name, path.join(sourcePath, item.name));
        if (result.ok) {
            skills.push({ displayName: result.displayName, slug: result.slug });
        } else {
            errors.push(result.error);
        }
    }

    return { skills, errors };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
    const startTime = Date.now();

    console.log('='.repeat(60));
    console.log('  GitHub Copilot Skill Converter');
    console.log('='.repeat(60));
    console.log();
    console.log(`  Source : ${SOURCE_BASE}`);
    console.log(`  Output : ${TARGET_BASE}`);
    console.log(`  Categories : ${CATEGORIES.join(', ')}`);
    console.log();

    ensureDir(TARGET_BASE);

    const allSkillsByCategory = {};
    let totalConverted = 0;
    let totalErrors = 0;
    const allErrors = [];

    for (const category of CATEGORIES) {
        const catStart = Date.now();
        process.stdout.write(`  [${category}] processing...`);

        const { skills, errors } = processCategory(category);

        allSkillsByCategory[category] = skills;
        totalConverted += skills.length;
        totalErrors += errors.length;
        allErrors.push(...errors.map(e => `[${category}] ${e}`));

        const catMs = Date.now() - catStart;
        // Clear the "processing..." and rewrite with results
        process.stdout.write(`\r  [${category}] ${skills.length} skills converted`);
        if (errors.length > 0) {
            process.stdout.write(` (${errors.length} errors)`);
        }
        console.log(` [${catMs}ms]`);
    }

    console.log();

    // -- Category README files --
    process.stdout.write('  Writing category READMEs...');
    for (const category of CATEGORIES) {
        const skills = allSkillsByCategory[category] || [];
        if (skills.length === 0) continue;
        const readmePath = path.join(TARGET_BASE, category);
        ensureDir(readmePath);
        const readmeContent = generateCategoryReadme(category, skills);
        fs.writeFileSync(path.join(readmePath, 'README.md'), readmeContent, 'utf-8');
    }
    console.log(' done');

    // -- Root instructions file --
    process.stdout.write('  Writing copilot-instructions-root.md...');
    const rootContent = generateRootInstructions(allSkillsByCategory);
    fs.writeFileSync(path.join(TARGET_BASE, 'copilot-instructions-root.md'), rootContent, 'utf-8');
    console.log(' done');

    // -- Summary --
    const elapsed = Date.now() - startTime;
    console.log();
    console.log('-'.repeat(60));
    console.log(`  Total skills converted : ${totalConverted}`);
    console.log(`  Output formats         : 3 (custom-instructions, agent-skills, instructions)`);
    console.log(`  Category READMEs       : ${CATEGORIES.length}`);
    console.log(`  Errors                 : ${totalErrors}`);
    console.log(`  Time                   : ${elapsed}ms`);
    console.log('-'.repeat(60));

    if (allErrors.length > 0) {
        console.log();
        console.log('  Errors:');
        for (const e of allErrors) {
            console.log(`    - ${e}`);
        }
    }

    console.log();
    console.log('  Conversion complete.');
    console.log();

    // Exit with non-zero if there were any category-level errors (missing dirs, etc.)
    // Individual missing SKILL.md files are warnings, not fatal.
    const fatalErrors = allErrors.filter(e => e.includes('Source directory missing'));
    if (fatalErrors.length > 0) {
        process.exit(1);
    }
}

main();
