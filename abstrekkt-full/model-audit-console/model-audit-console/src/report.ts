import { MergedFinding, isConfirmed } from "./merge.js";
import { ProviderResult } from "./types.js";

interface FileReport {
  filePath: string;
  results: ProviderResult[];
  merged: MergedFinding[];
}

/**
 * Cross-file header rendered only for multi-file runs. Ranks files by
 * confirmed-finding count (then P0 presence) so the worst offenders surface
 * first — the single most useful thing to see when auditing a whole tree.
 */
export function renderSummary(reports: FileReport[]): string {
  const rows = reports
    .map(({ filePath, merged }) => {
      const confirmed = merged.filter(isConfirmed);
      const p0 = merged.filter((f) => f.worstSeverity === "P0").length;
      return { filePath, confirmed: confirmed.length, p0, total: merged.length };
    })
    .sort((a, b) => b.confirmed - a.confirmed || b.p0 - a.p0 || b.total - a.total);

  const totalConfirmed = rows.reduce((n, r) => n + r.confirmed, 0);
  const totalP0 = rows.reduce((n, r) => n + r.p0, 0);

  const lines = [
    `# Multi-Model Audit — Summary (${reports.length} files)`,
    `Total confirmed findings: ${totalConfirmed} · Total P0s: ${totalP0}`,
    ``,
    `| File | Confirmed | P0 | Total |`,
    `| --- | --: | --: | --: |`,
    ...rows.map((r) => `| ${r.filePath} | ${r.confirmed} | ${r.p0} | ${r.total} |`),
  ];
  return lines.join("\n");
}

export function renderReport(filename: string, results: ProviderResult[], merged: MergedFinding[]): string {
  const lines: string[] = [
    `# Multi-Model Audit — ${filename}`,
    `Models run: ${results.map((r) => r.model).join(", ")}`,
  ];

  const errors = results.filter((r) => r.error);
  if (errors.length) {
    lines.push(
      `\n> ⚠️ ${errors.length} provider(s) failed: ${errors.map((e) => `${e.model} (${e.error})`).join("; ")}`
    );
  }

  const confirmed = merged.filter(isConfirmed);
  lines.push(`\n## Confirmed (2+ distinct models agree — highest confidence)`);
  lines.push(
    confirmed.length
      ? confirmed
          .map(
            (f) =>
              `- **[${f.worstSeverity}] ${f.persona}** — ${f.description} (confirmed: ${[
                ...new Set(f.confirmedBy),
              ].join(", ")}; locations: ${f.locations.join(", ")})`
          )
          .join("\n")
      : "_None._"
  );

  const single = merged.filter((f) => !isConfirmed(f));
  lines.push(`\n## Single-model (lower confidence — still worth a look)`);
  lines.push(
    single.length
      ? single
          .map(
            (f) =>
              `- **[${f.worstSeverity}] ${f.persona}** — ${f.description} (flagged only by: ${f.confirmedBy[0]}; ${f.locations[0]})`
          )
          .join("\n")
      : "_None._"
  );

  return lines.join("\n");
}
