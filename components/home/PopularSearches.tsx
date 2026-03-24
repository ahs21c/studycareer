import Link from 'next/link'
import { TOP_COMPANIES, TOP_JOBS, TOP_STATES } from '@/lib/data/companies'
import { formatSalary } from '@/lib/utils'

export default function PopularSearches() {
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500 }}>Popular searches</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>

        {/* Top companies */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Top companies
          </div>
          {TOP_COMPANIES.slice(0, 5).map((c, i) => (
            <Link key={c.slug} href={`/company/${c.slug}`} style={{ display: 'block' }}>
              <div className="sc-row">
                <span style={{ fontSize: 10, color: '#9ca3af', width: 14, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingLeft: 6 }}>
                  {c.employer_name.split(' ').slice(0, 3).join(' ')}
                </span>
                {c.has_perm && (
                  <span style={{ fontSize: 9.5, background: '#EAF3DE', color: '#3B6D11', padding: '2px 7px', borderRadius: 5, fontWeight: 500, flexShrink: 0 }}>
                    Green card
                  </span>
                )}
              </div>
            </Link>
          ))}
          <Link href="/rankings/top-100" style={{ fontSize: 11, color: '#185FA5', marginTop: 6, display: 'block', paddingLeft: 2 }}>
            View all top companies →
          </Link>
        </div>

        {/* Top jobs */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Top job titles
          </div>
          {TOP_JOBS.map(j => (
            <div key={j.title} className="sc-row">
              <span style={{ fontSize: 12, fontWeight: 500 }}>{j.title}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{formatSalary(j.avg_salary)} avg</span>
            </div>
          ))}
        </div>

        {/* Top states */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Top states
          </div>
          {TOP_STATES.map((s, i) => (
            <div key={s.code} className="sc-row">
              <span style={{ fontSize: 10, color: '#9ca3af', width: 14, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingLeft: 6 }}>{s.name}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{s.approvals.toLocaleString()}</span>
            </div>
          ))}
          <Link href="/rankings/by-state" style={{ fontSize: 11, color: '#185FA5', marginTop: 6, display: 'block', paddingLeft: 2 }}>
            View all states →
          </Link>
        </div>

      </div>
    </section>
  )
}
