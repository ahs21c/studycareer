import type { Metadata } from 'next'
import Link from 'next/link'
import { getTopCompanies } from '@/lib/supabase/queries'
import { formatNumber, formatSalary } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Top H1B Sponsors',
  description: 'Top US companies by H1B visa filings, salary data and green card sponsorship.',
}
export const revalidate = 604800

const TREND_STYLE: Record<string, { bg: string; text: string }> = {
  INCREASING: { bg: '#dcfce7', text: '#166534' },
  STABLE:     { bg: '#dbeafe', text: '#1e40af' },
  DECREASING: { bg: '#fee2e2', text: '#991b1b' },
  NEW:        { bg: '#f3e8ff', text: '#6b21a8' },
}

function toTitle(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export default async function Top100Page() {
  const companies = await getTopCompanies(100)

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <Link href="/" style={{ color: '#9ca3af' }}>Home</Link>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Top H1B sponsors</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Top H1B sponsors</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Ranked by total H1B filings · {companies.length} companies shown</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px 72px', gap: 12, padding: '0 12px 8px', fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span>#</span>
        <span>Company</span>
        <span style={{ textAlign: 'right' }}>Filings</span>
        <span style={{ textAlign: 'right' }}>Avg salary</span>
        <span style={{ textAlign: 'right' }}>Trend</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {companies.map((c, i) => {
          const t = TREND_STYLE[c.h1b_trend] ?? TREND_STYLE.STABLE
          return (
            <Link key={c.slug} href={`/company/${c.slug}`} className="rank-row" style={{ gridTemplateColumns: '28px 1fr 80px 80px 72px', gap: 12 }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {toTitle(c.employer_name)}
                  </span>
                  {c.has_perm && (
                    <span style={{ fontSize: 9.5, background: '#EAF3DE', color: '#3B6D11', padding: '2px 6px', borderRadius: 4, fontWeight: 500, flexShrink: 0 }}>GC</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>
                  {c.sponsor_type ?? ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{formatNumber(c.h1b_total_3yr)}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af' }}>filings</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{formatSalary(c.h1b_avg_salary)}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af' }}>avg</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 10.5, fontWeight: 500, background: t.bg, color: t.text, padding: '3px 7px', borderRadius: 5 }}>
                  {c.h1b_trend}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}