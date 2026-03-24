import { formatSalary } from '@/lib/utils'
import { STATE_NAMES } from '@/lib/constants'

interface Props {
  topJobs: string[]
  topStates: string[]
  avgSalary: number | null
  medianSalary: number | null
  p75Salary: number | null
  prevailingWage: number | null
  lcaFy2024: number
  lcaFy2025: number
}

function SalRow({ label, value, max, color }: { label: string; value: string; max: number; pct: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: '#6b7280', width: 100, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: `${max}%` }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, width: 58, textAlign: 'right', flexShrink: 0 }}>{value}</span>
    </div>
  )
}

export default function H1BActivity({ topJobs, topStates, avgSalary, medianSalary, p75Salary, prevailingWage, lcaFy2024, lcaFy2025 }: Props) {
  const maxSal = Math.max(avgSalary ?? 0, medianSalary ?? 0, p75Salary ?? 0, prevailingWage ?? 0)

  const salRows = [
    { label: 'P25 estimate', value: formatSalary(prevailingWage ? prevailingWage * 1.05 : null), pct: prevailingWage && maxSal ? Math.round((prevailingWage * 1.05 / maxSal) * 100) : 0, color: '#B5D4F4' },
    { label: 'Median',       value: formatSalary(medianSalary),  pct: medianSalary && maxSal ? Math.round((medianSalary / maxSal) * 100) : 0,  color: '#378ADD' },
    { label: 'Average',      value: formatSalary(avgSalary),     pct: avgSalary && maxSal ? Math.round((avgSalary / maxSal) * 100) : 0,         color: '#185FA5' },
    { label: 'P75',          value: formatSalary(p75Salary),     pct: p75Salary && maxSal ? Math.round((p75Salary / maxSal) * 100) : 0,         color: '#0C447C' },
    { label: 'Prevailing',   value: formatSalary(prevailingWage), pct: prevailingWage && maxSal ? Math.round((prevailingWage / maxSal) * 100) : 0, color: '#e5e7eb' },
  ]

  const total = lcaFy2024 + lcaFy2025
  const fy24Pct = total > 0 ? Math.round((lcaFy2024 / total) * 100) : 50
  const fy25Pct = 100 - fy24Pct

  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 500, paddingBottom: 12, borderBottom: '0.5px solid #e5e7eb', marginBottom: 18 }}>
        H1B activity
      </div>

      {/* Filing trend bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
          <span>Filing volume</span>
          <span>FY2024 vs FY2025</span>
        </div>
        <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
          <div style={{ flex: fy24Pct, background: '#B5D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#0C447C', fontWeight: 500 }}>
              {lcaFy2024.toLocaleString()} · FY24
            </span>
          </div>
          <div style={{ flex: fy25Pct, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#E6F1FB', fontWeight: 500 }}>
              {lcaFy2025.toLocaleString()} · FY25
            </span>
          </div>
        </div>
      </div>

      {/* Salary distribution */}
      <div style={{ marginBottom: 20, padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Salary distribution (FY2025)
        </div>
        {salRows.map(r => (
          <SalRow key={r.label} {...r} max={r.pct} />
        ))}
        {prevailingWage && avgSalary && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '0.5px solid #f3f4f6' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              Avg salary is <strong style={{ color: '#166534', fontWeight: 500 }}>
                +{Math.round(((avgSalary - prevailingWage) / prevailingWage) * 100)}%
              </strong> above DOL prevailing wage
            </span>
          </div>
        )}
      </div>

      {/* Jobs + States */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Top job titles
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {topJobs.map((j, i) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#9ca3af', width: 14 }}>{i + 1}</span>
                <span style={{ fontSize: 12, color: '#374151' }}>{j}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Work locations
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {topStates.map(s => (
              <span key={s} style={{
                fontSize: 11, color: '#374151',
                background: '#f9fafb', border: '0.5px solid #e5e7eb',
                padding: '4px 9px', borderRadius: 5,
              }}>
                {STATE_NAMES[s] ?? s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
