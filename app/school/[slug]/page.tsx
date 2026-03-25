import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchoolPipeline } from '@/lib/supabase/queries'
import { formatSalary } from '@/lib/utils'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: `${name} — Graduate Employment Pipeline`,
    description: `Where graduates from ${name} get hired for H1B jobs and green card sponsorship.`,
  }
}

export default async function SchoolPage({ params }: Props) {
  const { slug } = await params
  const schoolName = decodeURIComponent(slug).replace(/-/g, ' ')

  const pipelines = await getSchoolPipeline(schoolName)
  if (pipelines.length === 0) notFound()

  const displayName = pipelines[0].university_std
  const totalPerm = pipelines.reduce((s, p) => s + p.perm_count, 0)
  const avgWage = pipelines.filter(p => p.avg_annual_wage).reduce((s, p) => s + (p.avg_annual_wage || 0), 0) / pipelines.filter(p => p.avg_annual_wage).length

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>School pipeline</span>
          <span>›</span>
          <span style={{ color: '#1a1a1a' }}>{displayName}</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>{displayName}</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Graduate employment pipeline · PERM green card data FY2021-2024</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Employers found', value: pipelines.length.toString(), sub: 'PERM sponsors' },
          { label: 'Total PERM cases', value: totalPerm.toLocaleString(), sub: 'FY2021-2024' },
          { label: 'Avg offered wage', value: formatSalary(avgWage), sub: 'across employers' },
        ].map(item => (
          <div key={item.label} style={{ padding: '12px', borderRadius: 9, border: '0.5px solid #e5e7eb' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{item.value}</div>
            <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#1e3a5f', lineHeight: 1.6 }}>
        Based on PERM filings where the foreign worker listed this university as their institution of education. FY2021-2024 certified cases only.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {pipelines.map((p, i) => (
          <a key={i} href={`/company/${p.employer_std.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 80px 80px', gap: 12, padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{p.employer_std}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>
                  {p.top_major} · {p.top_degree}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{p.perm_count}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af' }}>cases</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{formatSalary(p.avg_annual_wage)}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af' }}>avg wage</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* National OPT Context */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          National OPT context (2024)
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.6 }}>
          Graduates on OPT/STEM OPT nationwide — benchmarks for your job search timeline.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'OPT participants', value: '194,554', sub: '+21% vs 2023' },
            { label: 'STEM OPT', value: '95,384', sub: '+54% vs 2023' },
            { label: 'CPT', value: '130,586', sub: 'Pre-completion' },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px', borderRadius: 8, background: '#fafafa', border: '0.5px solid #f3f4f6', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{item.value}</div>
              <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 8 }}>STEM OPT by nationality</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
          {[
            { country: 'India', pct: 48.0, color: '#185FA5' },
            { country: 'China', pct: 20.4, color: '#378ADD' },
            { country: 'Korea', pct: 2.5, color: '#5EA3E8' },
            { country: 'Nepal', pct: 2.3, color: '#8BBFF0' },
            { country: 'Others', pct: 26.9, color: '#e5e7eb' },
          ].map(item => (
            <div key={item.country} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: '#6b7280', width: 50, flexShrink: 0 }}>{item.country}</span>
              <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: item.color, borderRadius: 3, width: `${item.pct}%` }} />
              </div>
              <span style={{ fontSize: 11, color: '#6b7280', width: 36, textAlign: 'right', flexShrink: 0 }}>{item.pct}%</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 8 }}>Top STEM majors (F-1 students, 2024)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Computer Science', 'Electrical Engineering', 'Information Technology', 'Mechanical Engineering', 'Data Science'].map(major => (
            <span key={major} style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: 5 }}>
              {major}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>
          Source: ICE/SEVP 2024 SEVIS by the Numbers Report. National figures — not school-specific.
        </div>
      </div>

    </div>
  )
}