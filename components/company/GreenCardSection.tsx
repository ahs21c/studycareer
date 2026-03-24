import { formatNumber, formatSalary } from '@/lib/utils'

interface Props {
  hasPerm: boolean
  permTotal: number | null
  permCertified: number | null
  permAvgWage: number | null
  permFy2021: number | null
  permFy2022: number | null
  permFy2023: number | null
  permFy2024: number | null
}

export default function GreenCardSection({ hasPerm, permTotal, permCertified, permAvgWage, permFy2021, permFy2022, permFy2023, permFy2024 }: Props) {
  const certRate = permTotal && permCertified
    ? Math.round((permCertified / permTotal) * 100)
    : null

  const years = [
    { yr: 'FY2021', count: permFy2021 ?? 0 },
    { yr: 'FY2022', count: permFy2022 ?? 0 },
    { yr: 'FY2023', count: permFy2023 ?? 0 },
    { yr: 'FY2024', count: permFy2024 ?? 0 },
  ]
  const maxYr = Math.max(...years.map(y => y.count), 1)

  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 500, paddingBottom: 12, borderBottom: '0.5px solid #e5e7eb', marginBottom: 18 }}>
        Green card sponsorship
      </div>

      {!hasPerm ? (
        <div style={{ padding: '14px 16px', background: '#fafafa', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
            No PERM green card filings found for this employer name. The company may file under a different legal entity — check parent group affiliates.
          </p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div style={{ padding: '16px', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#166534' }}>Active PERM sponsor</span>
              <span style={{ fontSize: 10, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>
                4-year data
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { label: 'Total filings',   value: formatNumber(permTotal) },
                { label: 'Approval rate',   value: certRate !== null ? `${certRate}%` : 'N/A' },
                { label: 'Avg PERM wage',   value: formatSalary(permAvgWage) },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: '#166534' }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: '#3B6D11', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Year-by-year mini bars */}
          <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
              Annual filings
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 56 }}>
              {years.map(y => {
                const h = Math.max(Math.round((y.count / maxYr) * 100), 4)
                return (
                  <div key={y.yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{y.count.toLocaleString()}</span>
                    <div style={{ width: '100%', height: `${h}%`, background: '#3B6D11', borderRadius: '3px 3px 0 0', opacity: .75 }} />
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>{y.yr.replace('FY', '')}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Wait time callout */}
          <div style={{ padding: '12px 14px', background: '#eff6ff', border: '0.5px solid #bfdbfe', borderRadius: 10, display: 'flex', gap: 10 }}>
            <svg style={{ flexShrink: 0, marginTop: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <p style={{ fontSize: 12, color: '#1e3a5f', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ fontWeight: 500 }}>Green card wait time varies by nationality:</strong>{' '}
              Korea · EU — 1-5 yr &nbsp;·&nbsp; China — 20-50 yr &nbsp;·&nbsp; India — 100+ yr.
              India/China nationals should consider Canada as a parallel track.
            </p>
          </div>
        </>
      )}
    </section>
  )
}
