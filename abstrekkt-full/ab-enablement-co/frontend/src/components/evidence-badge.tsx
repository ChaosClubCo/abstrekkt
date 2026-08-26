type EvidenceStatus = 'VERIFIED' | 'INFERRED' | 'ASSUMED';

export interface EvidenceBadgeProps {
  status: EvidenceStatus;
  children: React.ReactNode;
}

export function EvidenceBadge({ status, children }: EvidenceBadgeProps) {
  return (
    <span aria-label={`Evidence status ${status}`} style={{ display: 'inline-flex', gap: 8, alignItems: 'center', border: '1px solid var(--ff-border)', borderRadius: 999, padding: '8px 12px', color: 'var(--ff-tertiary)' }}>
      <strong>[{status}]</strong> {children}
    </span>
  );
}
