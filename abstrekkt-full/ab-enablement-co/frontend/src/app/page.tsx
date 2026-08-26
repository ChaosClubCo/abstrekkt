import { MetricCard } from '@/components/metric-card';
import { EvidenceBadge } from '@/components/evidence-badge';

const metrics = [
  { label: 'Audit floor', value: '$4,500', note: 'Paid audit minimum' },
  { label: 'Claims mode', value: 'Guarded', note: 'Evidence required' },
  { label: 'Schedule KPI', value: '2/mo', note: 'Action yield threshold' },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', padding: '48px', maxWidth: 1180, margin: '0 auto' }}>
      <EvidenceBadge status="VERIFIED">FlashFusion Core Target State</EvidenceBadge>
      <h1 style={{ fontSize: 56, lineHeight: 1, margin: '24px 0 16px' }}>
        AI readiness, revenue, and delivery workspace.
      </h1>
      <p style={{ color: 'var(--ff-muted)', fontSize: 20, maxWidth: 760 }}>
        Convert leads into scoped audits, workshops, implementation plans, and reusable AI operating assets without overclaiming credentials, outcomes, or IP rights.
      </p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: 40 }}>
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>
    </main>
  );
}
