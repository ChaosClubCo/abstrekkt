import { Finding, ProviderResult, ModelName, Persona, Severity } from "./types.js";

export interface MergedFinding {
  persona: Persona;
  description: string;
  worstSeverity: Severity;
  confirmedBy: ModelName[];
  locations: string[];
}

const SEVERITY_RANK: Record<Severity, number> = { P0: 0, P1: 1, P2: 2 };

/**
 * Crude bucketing key: same persona + normalized first-8-words signature.
 * KNOWN LIMITATION: this under-merges more often than it over-merges - the
 * same underlying issue described in different words by two models will
 * be counted as two separate findings instead of one confirmed finding.
 * A real fix is embedding-based similarity clustering; not implemented
 * here. Treat "confirmed by 2+" counts as a floor, not a ceiling.
 */
function signature(desc: string): string {
  return desc
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .join(" ");
}

export function mergeFindings(results: ProviderResult[]): MergedFinding[] {
  const buckets = new Map<string, MergedFinding>();

  for (const result of results) {
    for (const finding of result.findings) {
      const key = `${finding.persona}:${signature(finding.description)}`;
      const existing = buckets.get(key);

      if (existing) {
        existing.confirmedBy.push(finding.model);
        existing.locations.push(finding.location);
        if (SEVERITY_RANK[finding.severity] < SEVERITY_RANK[existing.worstSeverity]) {
          existing.worstSeverity = finding.severity;
        }
      } else {
        buckets.set(key, {
          persona: finding.persona,
          description: finding.description,
          worstSeverity: finding.severity,
          confirmedBy: [finding.model],
          locations: [finding.location],
        });
      }
    }
  }

  return [...buckets.values()].sort((a, b) => {
    const severityDiff = SEVERITY_RANK[a.worstSeverity] - SEVERITY_RANK[b.worstSeverity];
    if (severityDiff !== 0) return severityDiff;
    return b.confirmedBy.length - a.confirmedBy.length;
  });
}

/** True confirmation requires 2+ *distinct* models, not 2+ findings from the same model. */
export function isConfirmed(f: MergedFinding): boolean {
  return new Set(f.confirmedBy).size >= 2;
}
