#!/usr/bin/env node
/**
 * Regenerate gemini-skills-studio from _master-skills
 * This script fixes the truncated GEMINI.md files and missing skills
 */

const fs = require('fs');
const path = require('path');
const { convert } = require('../adapters/universal/adapters');

const MASTER_DIR = path.join(__dirname, '..', '_master-skills');
const OUTPUT_DIR = path.join(__dirname, '..', 'platforms', 'gemini', 'gemini-skills-studio', 'prompts');

function findSkillFiles(dir) {
  const skills = [];

  function scan(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          // Skip governance and hidden directories
          if (entry.name.startsWith('.') || entry.name === 'node_modules' ||
              entry.name === 'intinc-claude-skills-governance-role-bundles') {
            continue;
          }
          scan(fullPath);
        } else if (entry.name === 'SKILL.md') {
          skills.push(fullPath);
        }
      }
    } catch (e) {
      console.error(`  [WARN] Cannot access: ${currentDir}`);
    }
  }

  scan(dir);
  return skills;
}

function parseSkillMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return null;
  }

  const skill = { content: {} };

  // Parse frontmatter
  frontmatterMatch[1].split('\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      skill[key] = value;
    }
  });

  // Get skill name from parent directory if not in frontmatter
  if (!skill.name) {
    skill.name = path.basename(path.dirname(filePath));
  }

  // Store the FULL body content
  const body = frontmatterMatch[2];
  skill.content.fullBody = body;

  return skill;
}

function convertSkill(skill, outputDir) {
  try {
    const result = convert(skill, 'gemini-cli');

    const skillDir = path.join(outputDir, skill.name);
    fs.mkdirSync(skillDir, { recursive: true });

    for (const file of result.files) {
      const filePath = path.join(skillDir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content);
    }

    return { success: true, skill: skill.name };
  } catch (e) {
    return { success: false, skill: skill.name, error: e.message };
  }
}

function main() {
  console.log('=' .repeat(72));
  console.log('  Regenerating gemini-skills-studio from _master-skills');
  console.log('=' .repeat(72));
  console.log(`  Source: ${MASTER_DIR}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log('=' .repeat(72));

  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    console.log('\n  Cleaning output directory...');
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Find all skills
  console.log('\n  Scanning for SKILL.md files...');
  const skillFiles = findSkillFiles(MASTER_DIR);
  console.log(`  Found ${skillFiles.length} skills`);

  // Convert all skills
  console.log('\n  Converting skills...');
  const results = { success: 0, failed: 0, errors: [] };

  for (const filePath of skillFiles) {
    const skill = parseSkillMd(filePath);
    if (!skill) {
      results.errors.push({ file: filePath, error: 'Failed to parse' });
      results.failed++;
      console.log(`  [FAIL] ${path.basename(path.dirname(filePath))}`);
      continue;
    }

    const result = convertSkill(skill, OUTPUT_DIR);
    if (result.success) {
      results.success++;
      console.log(`  [ OK ] ${result.skill}`);
    } else {
      results.failed++;
      results.errors.push(result);
      console.log(`  [FAIL] ${result.skill}: ${result.error}`);
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(72));
  console.log('  Conversion Complete');
  console.log('=' .repeat(72));
  console.log(`  Success: ${results.success}`);
  console.log(`  Failed: ${results.failed}`);
  console.log(`  Output: ${OUTPUT_DIR}`);

  if (results.errors.length > 0) {
    console.log(`\n  First 10 errors:`);
    results.errors.slice(0, 10).forEach(e => {
      console.log(`    - ${e.skill || path.basename(e.file)}: ${e.error}`);
    });
  }

  console.log('');
  process.exit(results.failed > 0 ? 1 : 0);
}

main();
