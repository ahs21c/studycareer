import Link from 'next/link'
import { getTopCompanies, getH1BByIndustry, getTopSchools } from '@/lib/supabase/queries'
import { formatSalary } from '@/lib/utils'

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const INDIAN_KEYWORDS = [
  'JAWAHARLAL', 'ANNA UNIVERSITY', 'OSMANIA', 'VISVESV', 'ANDHRA',
  'BHARATHIDASAN', 'BHARATHIAR', 'MADURAI', 'KAKATIYA', 'ACHARYA',
  'NAGARJUNA', 'BANGALORE UNIVERSITY', 'SRI VENKATESWARA', 'UNIVERSITY OF MUMBAI',
  'UNIVERSITY OF PUNE', 'UNIVERSITY OF MADRAS', 'UNIVERSITY OF CALCUTTA',
  'UNIVERSITY OF DELHI', 'UNIVERSITY OF KERALA', 'UNIVERSITY OF CALICUT',
  'UNIVERSITY OF MYSORE', 'WEST BENGAL UNIVERSITY', 'UTTAR PRADESH',
  'INDIRA GANDHI', 'NAGPUR UNIVERSITY', 'SHIVAJI UNIVERSITY',
  'MANIPAL UNIVERSITY', 'SRM UNIVERSITY', 'VIT UNIVERSITY', 'AMITY UNIVERSITY',
  'BIRLA INSTITUTE', 'NATIONAL INSTITUTE OF TECHNOLOGY',
  'NORTHWESTERN POLYTECHNIC', 'SILICON VALLEY UNIVERSITY',
]

function isIndianUniversity(name: string) {
  return INDIAN_KEYWORDS.some(kw => name.toUpperCase().includes(kw))
}

export default async function PopularSearches() {
  const [companies, industries, schools] = await Promise.all([
    getTopCompanies(5),
    getH1BByIndustry(),
    getTopSchools(),
  ])

  const usSchools = schools.filter(s => !isIndianUniversity(s.university_std)).slice(0, 5)

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500 }}>Popular searches</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {/* Top H1B Sponsors */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Top H1B Sponsors
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
            View all top H1B Sponsors →
          </Link>
        </div>

        {/* H1B by industry */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            H1B by industry
          </div>
          {industries.slice(0, 5).map((ind, i) => (
            <Link key={ind.industry} href="/sector" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sc-row">
                <span style={{ fontSize: 10, color: '#9ca3af', width: 14, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingLeft: 6, color: '#1a1a1a' }}>{ind.industry}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{ind.approvals.toLocaleString()}</span>
              </div>
            </Link>
          ))}
          <Link href="/sector" style={{ fontSize: 11, color: '#185FA5', marginTop: 6, display: 'block', paddingLeft: 2 }}>
            View all industries →
          </Link>
        </div>

        {/* Green Card by University */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Top universities
          </div>
          {usSchools.map((s, i) => (
            <Link key={s.slug} href={`/school/${s.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sc-row">
                <span style={{ fontSize: 10, color: '#9ca3af', width: 14, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingLeft: 6, color: '#1a1a1a' }}>
                  {s.university_std}
                </span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{s.perm_count.toLocaleString()}</span>
              </div>
            </Link>
          ))}
          <Link href="/school" style={{ fontSize: 11, color: '#185FA5', marginTop: 6, display: 'block', paddingLeft: 2 }}>
            View all schools →
          </Link>
        </div>
      </div>
    </section>
  )
}