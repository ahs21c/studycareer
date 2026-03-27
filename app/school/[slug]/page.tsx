'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getSchoolDetail } from '@/lib/supabase/queries'

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())
}

function GreaterThanList({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 12.5, color: '#1a1a1a' }}>{toTitle(item)}</span>
          {i < items.length - 1 && (
            <span style={{ fontSize: 12, color, fontWeight: 600 }}>›</span>
          )}
        </span>
      ))}
    </div>
  )
}

function EmployerList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {items.map((item, i) => {
        const empSlug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <a href={'/company/' + empSlug} style={{ fontSize: 12.5, color: '#185FA5', textDecoration: 'none' }}>{toTitle(item)}</a>
            {i < items.length - 1 && <span style={{ fontSize: 12, color: '#185FA5', fontWeight: 600 }}>›</span>}
          </span>
        )
      })}
    </div>
  )
}

export default function SchoolDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const [school, setSchool] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getSchoolDetail(slug).then(data => {
      setSchool(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</div>
  if (!school) return <div style={{ fontSize: 13, color: '#6b7280' }}>School not found.</div>

  const employers: string[] = school.top_employers ?? []
  const majorsDetail: string[] = school.top_majors_detail ?? []
  const education: string[] = school.top_education ?? []

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <Link href="/" style={{ color: '#9ca3af' }}>Home</Link>
          <span>›</span>
          <Link href="/school" style={{ color: '#9ca3af' }}>Schools</Link>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>{toTitle(school.school_name)}</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>
          {toTitle(school.school_name)}
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Where do graduates get hired? · PERM data FY2021–2024
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        <div style={{ padding: '12px 14px', border: '0.5px solid #e5e7eb', borderRadius: 9 }}>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>PERM filings</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>{school.perm_count?.toLocaleString()}</div>
          <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>FY2021–2024</div>
        </div>
        <div style={{ padding: '12px 14px', border: '0.5px solid #e5e7eb', borderRadius: 9 }}>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Median wage</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            {school.avg_wage ? `$${Math.round(school.avg_wage / 1000)}K` : '—'}
          </div>
          <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>offered at PERM filing</div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Hiring background
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {employers.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>Top employers</div>
              <EmployerList items={employers} />
            </div>
          )}
          <div style={{ borderTop: '0.5px solid #f3f4f6' }} />
          {majorsDetail.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>Top majors</div>
              <GreaterThanList items={majorsDetail} color="#3B6D11" />
            </div>
          )}
          <div style={{ borderTop: '0.5px solid #f3f4f6' }} />
          {education.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>Degree level</div>
              <GreaterThanList items={education} color="#854F0B" />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 8, fontSize: 11, color: '#9ca3af', lineHeight: 1.65 }}>
        Data extracted from PERM green card filings submitted to the U.S. Department of Labor. FY2021–2024 certified cases only. Trends shown by relative frequency, not absolute counts.
      </div>
    </div>
  )
}