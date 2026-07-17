import crypto from 'node:crypto';

export interface WebhookVerificationInput {
  rawBody: string;
  signatureHeader: string | null;
  secret: string;
  toleranceSeconds?: number;
  timestampHeader?: string | null;
}

export function verifyHmacWebhook({ rawBody, signatureHeader, secret, timestampHeader, toleranceSeconds = 300 }: WebhookVerificationInput): boolean {
  if (!signatureHeader || !secret || secret.length < 32) return false;
  if (timestampHeader) {
    const timestamp = Number(timestampHeader);
    if (!Number.isFinite(timestamp)) return false;
    const age = Math.abs(Date.now() / 1000 - timestamp);
    if (age > toleranceSeconds) return false;
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = signatureHeader.replace(/^sha256=/, '');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(provided, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
