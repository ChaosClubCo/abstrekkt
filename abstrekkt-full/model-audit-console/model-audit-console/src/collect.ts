import { existsSync, statSync, readdirSync, globSync } from "fs";
import { join, extname, sep } from "path";

/**
 * Source extensions we expand directories/globs into. An explicitly named
 * file is always audited regardless of extension (explicit intent wins);
 * this allowlist only filters what a directory or glob expansion pulls in,
 * so we don't fire three model calls at every .png / .lock / .md we walk.
 */
export const DEFAULT_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".go", ".rs", ".java", ".rb", ".php",
  ".c", ".cc", ".cpp", ".h", ".hpp", ".cs",
  ".swift", ".kt", ".scala", ".vue", ".svelte", ".sql", ".sh",
]);

/** Directories never worth auditing — vendored code, build output, VCS. */
const IGNORED_DIRS = new Set([
  "node_modules", "dist", "build", ".git", ".next", "out", "coverage", ".turbo", "vendor",
]);

function isGlob(pattern: string): boolean {
  return /[*?[\]{}]/.test(pattern);
}

/** Recursively walk a directory, yielding files that pass the extension allowlist. */
function walkDir(dir: string, exts: Set<string>, acc: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walkDir(join(dir, entry.name), exts, acc);
    } else if (entry.isFile() && exts.has(extname(entry.name).toLowerCase())) {
      acc.push(join(dir, entry.name));
    }
  }
}

function pathIsIgnored(p: string): boolean {
  return p.split(/[/\\]/).some((seg) => IGNORED_DIRS.has(seg));
}

/**
 * Resolve one or more path arguments into a concrete, de-duplicated list of
 * files to audit. Each argument may be:
 *   - a file           → audited as-is (allowlist bypassed; explicit intent)
 *   - a directory      → recursively walked, filtered by `exts`
 *   - a glob pattern    → expanded via fs.globSync, filtered by `exts`
 *
 * Throws with a clear message if an argument matches nothing on disk, so a
 * typo'd path fails loudly instead of silently auditing fewer files than
 * the user intended.
 */
export function collectFiles(args: string[], exts: Set<string> = DEFAULT_EXTENSIONS): string[] {
  const found: string[] = [];

  for (const arg of args) {
    if (isGlob(arg)) {
      const matches = globSync(arg)
        .filter((m) => statSync(m).isFile())
        .filter((m) => exts.has(extname(m).toLowerCase()))
        .filter((m) => !pathIsIgnored(m));
      if (matches.length === 0) throw new Error(`Glob matched no source files: ${arg}`);
      found.push(...matches);
      continue;
    }

    if (!existsSync(arg)) throw new Error(`Path not found: ${arg}`);

    const stat = statSync(arg);
    if (stat.isDirectory()) {
      const before = found.length;
      walkDir(arg, exts, found);
      if (found.length === before) throw new Error(`No source files found under directory: ${arg}`);
    } else {
      // Explicit file: audit regardless of extension.
      found.push(arg);
    }
  }

  // De-dupe while preserving first-seen order (overlapping args, e.g. dir + file).
  return [...new Set(found)];
}
