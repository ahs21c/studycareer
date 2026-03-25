import Link from 'next/link'
import { getTopCompanies, getH1BByState } from '@/lib/supabase/queries'
import { formatSalary } from '@/lib/utils'

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const TOP_JOBS = [
  { title: 'Software Developer', avg_salary: 142000 },
  { title: 'Software Engineer', avg_salary: 148000 },
  { title: 'Data Scientist', avg_salary: 152000 },
  { title: 'Systems Engineer', avg_salary: 128000 },
  { title: 'Business Analyst', avg_salary: 105000 },
]

export default async function PopularSearches() {
  const [companies, states] = await Promise.all([
    getTopCompanies(5),
    getH1BByState(),
  ])

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500 }}>Popular searches</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>

        {/* Top companies */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Top companies
          </div>
          {companies.map((c, i) => (
            <Link key={c.slug} href={`/company/${c.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sc-row">
                <span style={{ fontSize: 10, color: '#9ca3af', width: 14, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingLeft: 6, color: '#1a1a1a' }}>
                  {toTitle(c.employer_name).split(' ').slice(0, 3).join(' ')}
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
          {states.slice(0, 5).map((s, i) => (
            <div key={s.state} className="sc-row">
              <span style={{ fontSize: 10, color: '#9ca3af', width: 14, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingLeft: 6 }}>{s.state}</span>
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