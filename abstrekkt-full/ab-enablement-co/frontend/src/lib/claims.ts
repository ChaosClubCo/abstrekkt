export interface ClaimReviewInput {
  text: string;
  hasEvidence: boolean;
  mentionsCertification: boolean;
  generatedDate: string;
}

export function validateClaim(input: ClaimReviewInput): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!input.hasEvidence) reasons.push('Claim requires source evidence.');
  const cutoff = new Date('2026-07-20T00:00:00-05:00');
  const date = new Date(input.generatedDate);
  if (input.mentionsCertification && date < cutoff && /certified/i.test(input.text)) {
    reasons.push('Use “preparing for Anthropic certification” before verified certification date.');
  }
  return { ok: reasons.length === 0, reasons };
}
