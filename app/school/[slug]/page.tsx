import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getSchoolDetail, getSchoolPipeline } from '@/lib/supabase/queries'
import { formatNumber, formatSalary } from '@/lib/utils'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const school = await getSchoolDetail(slug)
  if (!school) return { title: 'School not found' }
  return {
    title: `${toTitle(school.school_name)} — PERM Employment Data`,
    description: `${toTitle(school.school_name)} graduates: ${formatNumber(school.perm_count)} PERM green card cases, avg wage ${formatSalary(school.avg_wage)}.`,
  }
}

export default async function SchoolDetailPage({ params }: Props) {
  const { slug } = await params
  const school = await getSchoolDetail(slug)
  if (!school) notFound()

  const pipeline = await getSchoolPipeline(school.school_name)

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <Link href="/" style={{ color: '#9ca3af' }}>Home</Link>
          <span>›</span>
          <Link href="/school" style={{ color: '#9ca3af' }}>Schools</Link>
          <span>›</span>
          <span style={{ color: '#1a1a1a' }}>{toTitle(school.school_name)}</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>
          {toTitle(school.school_name)}
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Employment outcomes based on PERM green card filings · FY2021–2024
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
        <div style={{ padding: 12, borderRadius: 9, border: '0.5px solid #B5D4F4', background: '#E6F1FB' }}>
          <div style={{ fontSize: 11, color: '#185FA5', marginBottom: 5 }}>Total PERM cases</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#0C447C' }}>{formatNumber(school.perm_count)}</div>
          <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>FY2021–2024</div>
        </div>
        <div style={{ padding: 12, borderRadius: 9, border: '0.5px solid #e5e7eb' }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>Avg PERM wage</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>{formatSalary(school.avg_wage)}</div>
          <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>Offered salary</div>
        </div>
        <div style={{ padding: 12, borderRadius: 9, border: '0.5px solid #e5e7eb' }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>Hiring companies</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>{formatNumber(pipeline.length)}</div>
          <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>Unique employers</div>
        </div>
      </div>

      {pipeline.length > 0 && (
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            Top hiring companies
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
            Companies that sponsored PERM green cards for graduates of this university
          </div>
          {pipeline.map((p: any, i: number) => {
            const companySlug = p.employer_std.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
            return (
              <Link
                key={i}
                href={`/company/${companySlug}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '0.5px solid #f3f4f6', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10.5, color: '#9ca3af', width: 20 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 12, color: '#1a1a1a' }}>{toTitle(p.employer_std)}</div>
                    {p.top_major && (
                      <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 1 }}>{p.top_major}</div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 500 }}>{p.perm_count} cases</div>
                  {p.avg_annual_wage && (
                    <div style={{ fontSize: 10.5, color: '#9ca3af' }}>${Math.round(p.avg_annual_wage).toLocaleString()} avg</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {school.top_majors_detail && school.top_majors_detail.length > 0 && (
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Top majors
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {school.top_majors_detail.map((major: string, i: number) => (
              <span key={i} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 6,
                background: i === 0 ? '#E6F1FB' : '#f3f4f6',
                color: i === 0 ? '#185FA5' : '#6b7280',
              }}>
                {major}
              </span>
            ))}
          </div>
        </div>
      )}

      {school.top_education && school.top_education.length > 0 && (
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Degree levels
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {school.top_education.map((edu: string, i: number) => (
              <span key={i} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 6,
                background: '#f3f4f6', color: '#6b7280',
              }}>
                {edu}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 8, fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
        Data based on PERM green card filings where employers listed the foreign worker's institution of education. Does not represent all graduates — only those sponsored for permanent residency.
      </div>
    </div>
  )
}