export type OfferType = 'proof_of_value' | 'paid_audit' | 'workshop' | 'implementation';

export interface PriceCheck {
  offerType: OfferType;
  amountUsd: number;
}

export function validatePrice({ offerType, amountUsd }: PriceCheck): { ok: boolean; reason?: string } {
  if (offerType === 'proof_of_value') {
    return amountUsd === 0 ? { ok: true } : { ok: false, reason: 'Proof-of-value must be free and explicitly scoped.' };
  }
  if (offerType === 'paid_audit' && amountUsd < 4500) {
    return { ok: false, reason: 'Paid audit minimum is $4,500.' };
  }
  if (amountUsd < 0) return { ok: false, reason: 'Price cannot be negative.' };
  return { ok: true };
}
