import { validatePrice } from '../frontend/src/lib/pricing';
import { validateClaim } from '../frontend/src/lib/claims';

const price = validatePrice({ offerType: 'paid_audit', amountUsd: 4499 });
if (price.ok) throw new Error('Smoke failed: paid audit floor was not enforced.');

const claim = validateClaim({
  text: 'We are Anthropic certified.',
  hasEvidence: true,
  mentionsCertification: true,
  generatedDate: '2026-06-21',
});
if (claim.ok) throw new Error('Smoke failed: certification guard was not enforced.');

console.log('FlashFusion smoke checks passed.');
