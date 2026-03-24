import { SITE_STATS } from '@/lib/data/companies'

export default function StatsBar() {
  const stats = [
    { value: SITE_STATS.companies_tracked.toLocaleString(), label: 'Companies tracked', highlight: true },
    { value: '1.57M',                                        label: 'H1B records' },
    { value: SITE_STATS.gc_sponsors.toLocaleString(),        label: 'Green card sponsors' },
    { value: SITE_STATS.sectors.toString(),                  label: 'Industry sectors' },
  ]

  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 36 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          padding: '14px 12px', textAlign: 'center',
          border: '0.5px solid #e5e7eb', borderRadius: 10,
          background: s.highlight ? '#E6F1FB' : '#fff',
        }}>
          <div style={{
            fontSize: 20, fontWeight: 500, letterSpacing: '-.5px',
            color: s.highlight ? '#0C447C' : '#1a1a1a',
          }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: s.highlight ? '#185FA5' : '#6b7280', marginTop: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </section>
  )
}
