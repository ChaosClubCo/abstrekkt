/*
 * Script to display Figma AI Make prompts
 *
 * This Node.js program reads the Markdown file containing all of
 * the prompts used with Figma’s AI Make tool and writes its
 * contents to standard output. Use this script to quickly view
 * the prompts or pipe them into other tools. It resolves the path
 * relative to this script’s location and assumes the Markdown file
 * resides in the `../docs` directory as `figma_prompts.md`.
 */

const fs = require('fs');
const path = require('path');

// Construct the path to the prompts file. The path is relative to
// this script’s directory so that it works regardless of the
// current working directory when invoked.
const promptsFile = path.join(__dirname, '..', 'docs', 'figma_prompts.md');

try {
  const data = fs.readFileSync(promptsFile, 'utf8');
  process.stdout.write(data);
} catch (error) {
  console.error(`Error reading ${promptsFile}:`, error.message);
  process.exit(1);
}