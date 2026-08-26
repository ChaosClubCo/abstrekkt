export interface MetricCardProps {
  label: string;
  value: string;
  note: string;
}

export function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <article style={{ border: '1px solid var(--ff-border)', background: 'rgba(26,10,46,0.72)', borderRadius: 20, padding: 24 }}>
      <p style={{ color: 'var(--ff-muted)', margin: 0 }}>{label}</p>
      <strong style={{ display: 'block', fontSize: 36, margin: '10px 0' }}>{value}</strong>
      <p style={{ color: 'var(--ff-muted)', margin: 0 }}>{note}</p>
    </article>
  );
}
