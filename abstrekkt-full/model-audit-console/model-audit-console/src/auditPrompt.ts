export const PERSONAS = [
  "security",
  "architecture",
  "qa",
  "performance",
  "devops",
  "accessibility",
] as const;

export function buildAuditPrompt(code: string, filename: string): string {
  return `You are auditing a single source file for production readiness.
File: ${filename}

Audit across exactly these six categories: security, architecture, qa, performance, devops, accessibility.

Return ONLY a JSON array (no prose, no markdown fences) of objects with this exact shape:
[{"persona":"security","severity":"P0"|"P1"|"P2","location":"<line or symbol>","description":"<what's wrong>","fix":"<concrete fix>"}]

Severity: P0 = does not ship, P1 = backlog with note, P2 = accept and document.
If a category has no findings, omit it entirely - do not invent findings to pad coverage.
Return valid JSON only. No prose before or after the array.

SOURCE:
\`\`\`
${code}
\`\`\`
`;
}
