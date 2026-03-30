import Link from 'next/link'
import { getTopSchools } from '@/lib/supabase/queries'
import H1BExplorerWidget from './H1BExplorerWidget'

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

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export default async function PopularSearches() {
  const schools = await getTopSchools()
  const usSchools = schools.filter(s => !isIndianUniversity(s.university_std)).slice(0, 5)

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500 }}>Popular searches</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: 24 }}>

        {/* H1B Explorer */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>
            H1B Explorer
          </div>
          <div style={{ fontSize: 10, color: '#c4c9d1', marginBottom: 10 }}>
            Industry · Job · Location
          </div>
          <H1BExplorerWidget />
        </div>

        {/* Green Card by University */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Green Card by University
          </div>
          {usSchools.map((s, i) => (
            <Link key={s.slug} href={`/school/${s.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="sc-row">
                <span style={{ fontSize: 10, color: '#9ca3af', width: 14, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingLeft: 6, color: '#1a1a1a' }}>{toTitle(s.university_std)}</span>
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