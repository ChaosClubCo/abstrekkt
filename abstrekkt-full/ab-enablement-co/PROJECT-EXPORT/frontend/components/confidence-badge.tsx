import type { ConfidenceTag } from '@memoir/shared';
export function ConfidenceBadge({tag}:{tag:ConfidenceTag}){return <span aria-label={`Confidence: ${tag}`}>[{tag}]</span>}
