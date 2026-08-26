#!/usr/bin/env node
import "dotenv/config";
import { readFileSync } from "fs";
import { auditWithClaude } from "./providers/anthropic.js";
import { auditWithGPT } from "./providers/openai.js";
import { auditWithGemini } from "./providers/gemini.js";
import { mergeFindings } from "./merge.js";
import { renderReport, renderSummary } from "./report.js";
import { collectFiles } from "./collect.js";
import { ProviderResult } from "./types.js";

function printUsageAndExit(): never {
  console.error("Usage: npm run audit -- <file|dir|glob> [more paths...] [--skip-claude]");
  console.error("Examples:");
  console.error("  npm run audit -- src/index.ts");
  console.error("  npm run audit -- src/                    # recurse a directory");
  console.error('  npm run audit -- "src/**/*.ts"           # glob (quote it)');
  console.error("  npm run audit -- src/ lib/utils.py --skip-claude");
  process.exit(1);
}

interface FileAudit {
  filePath: string;
  results: ProviderResult[];
}

/** Fan a single file out to all enabled providers in parallel. */
async function auditFile(filePath: string, skipClaude: boolean): Promise<FileAudit> {
  const code = readFileSync(filePath, "utf-8");
  const jobs: Promise<ProviderResult>[] = [auditWithGPT(code, filePath), auditWithGemini(code, filePath)];
  if (!skipClaude) jobs.push(auditWithClaude(code, filePath));
  const results = await Promise.all(jobs);
  return { filePath, results };
}

async function main() {
  const skipClaude = process.argv.includes("--skip-claude");
  const pathArgs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (pathArgs.length === 0) printUsageAndExit();

  let files: string[];
  try {
    files = collectFiles(pathArgs);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  // Files are audited sequentially: each file already fans out to 3 provider
  // calls in parallel, so running files serially keeps concurrent API calls
  // bounded (avoids rate-limit storms on large directories) at the cost of
  // wall-clock time. Progress goes to stderr so stdout stays a clean report.
  const audits: FileAudit[] = [];
  for (let i = 0; i < files.length; i++) {
    if (files.length > 1) console.error(`[${i + 1}/${files.length}] auditing ${files[i]} ...`);
    audits.push(await auditFile(files[i], skipClaude));
  }

  const perFile = audits.map(({ filePath, results }) => ({
    filePath,
    results,
    merged: mergeFindings(results),
  }));

  const sections: string[] = [];
  if (perFile.length > 1) sections.push(renderSummary(perFile));
  for (const { filePath, results, merged } of perFile) {
    sections.push(renderReport(filePath, results, merged));
  }
  console.log(sections.join("\n\n---\n\n"));

  const anyFailed = perFile.some(({ results }) => results.some((r) => r.error));
  if (anyFailed) process.exitCode = 2; // non-zero if any provider failed, even though we still printed a report
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
