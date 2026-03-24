import { formatNumber, formatSalary } from '@/lib/utils'

interface Props {
  lcaTotal: number
  avgSalary: number | null
  permTotal: number | null
  prevailingWage: number | null
  hasPerm: boolean
  lcaFy2024: number
  lcaFy2025: number
}

export default function StatCards({ lcaTotal, avgSalary, permTotal, prevailingWage, hasPerm, lcaFy2024, lcaFy2025 }: Props) {
  const yoyPct = lcaFy2024 > 0
    ? Math.round(((lcaFy2025 - lcaFy2024) / lcaFy2024) * 100)
    : null
  const yoyLabel = yoyPct !== null
    ? `${yoyPct >= 0 ? '+' : ''}${yoyPct}% vs FY2024`
    : 'FY2024–2025'

  const cards = [
    {
      label: 'H1B filings (2yr)',
      value: formatNumber(lcaTotal),
      sub: yoyLabel,
      subColor: yoyPct !== null && yoyPct >= 0 ? '#166534' : '#991b1b',
      highlight: true,
    },
    {
      label: 'Avg salary (FY2025)',
      value: formatSalary(avgSalary),
      sub: prevailingWage ? `Prevailing: ${formatSalary(prevailingWage)}` : 'LCA certified',
      subColor: '#9ca3af',
      highlight: false,
    },
    {
      label: 'Green card filings',
      value: hasPerm ? formatNumber(permTotal) : '—',
      sub: hasPerm ? 'PERM FY2021–2024' : 'No filings found',
      subColor: '#9ca3af',
      highlight: false,
      perm: true,
    },
    {
      label: 'Prevailing wage',
      value: formatSalary(prevailingWage),
      sub: 'DOL minimum',
      subColor: '#9ca3af',
      highlight: false,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }}>
      {cards.map(c => (
        <div key={c.label} style={{
          padding: '14px 14px',
          border: c.perm && hasPerm ? '0.5px solid #bbf7d0' : '0.5px solid #e5e7eb',
          borderRadius: 10,
          background: c.highlight ? '#E6F1FB' : c.perm && hasPerm ? '#f0fdf4' : '#fff',
        }}>
          <div style={{ fontSize: 11, color: c.highlight ? '#185FA5' : '#6b7280', marginBottom: 6 }}>
            {c.label}
          </div>
          <div style={{
            fontSize: 19, fontWeight: 500, letterSpacing: '-.5px',
            color: c.highlight ? '#0C447C' : '#1a1a1a',
          }}>
            {c.value}
          </div>
          <div style={{ fontSize: 11, color: c.subColor ?? '#9ca3af', marginTop: 3 }}>
            {c.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
